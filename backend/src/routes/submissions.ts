import { Router } from "express";
import type { Request } from "express";
import { GAME_CATEGORIES } from "@padplay/shared-types";
import type {
  QuestionnaireAnswers,
  SubmissionCreateRequest,
  SubmissionEnrichPreview,
} from "@padplay/shared-types";
import { pool, query, queryOne, toCamel, toCamelRows } from "../lib/db";
import { enrichFromStoreUrls, guessCategory, slugify } from "../lib/enrich";
import {
  answersToFeatures,
  computeTabletScore,
  derivePlatforms,
  isValidEmail,
  rateLimitOk,
} from "../lib/submission";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

export const submissionsRouter = Router();

const ses = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function sendNewSubmissionEmail(data: { email: string; title: string; category: string; pitch: string }) {
  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.log("Mock Email (SES not configured): New submission from", data.email, "for", data.title);
    return;
  }
  
  const fromEmail = process.env.SES_FROM_EMAIL || "no-reply@padplay.app";
  const command = new SendEmailCommand({
    Source: fromEmail,
    Destination: {
      ToAddresses: ["ayhoung@gmail.com"],
    },
    Message: {
      Subject: { Data: `New PadPlay Submission: ${data.title}` },
      Body: {
        Text: {
          Data: `New App Submitted!\n\nSubmitter: ${data.email}\nApp: ${data.title}\nCategory: ${data.category}\n\nPitch:\n${data.pitch || "No pitch provided."}\n\nReview in the admin panel.`
        }
      }
    }
  });

  try {
    await ses.send(command);
    console.log(`Email notification sent for submission: ${data.title}`);
  } catch (err) {
    console.error("Failed to send submission email via SES:", err);
  }
}

function getClientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  return req.ip ?? "unknown";
}

/**
 * POST /api/submissions/preview
 * Body: { appStoreUrl?, playStoreUrl? }
 * Returns enriched data the submitter can confirm before filling the questionnaire.
 */
submissionsRouter.post("/preview", async (req, res, next) => {
  try {
    const appStoreUrl = typeof req.body?.appStoreUrl === "string" ? req.body.appStoreUrl.trim() : "";
    const playStoreUrl = typeof req.body?.playStoreUrl === "string" ? req.body.playStoreUrl.trim() : "";

    if (!appStoreUrl && !playStoreUrl) {
      res.status(400).json({
        error: "bad_request",
        message: "Provide at least one store URL",
      });
      return;
    }

    const enriched = await enrichFromStoreUrls({
      appStoreUrl: appStoreUrl || null,
      playStoreUrl: playStoreUrl || null,
    });

    if (!enriched.title) {
      res.status(422).json({
        error: "enrichment_failed",
        message:
          "Couldn't find this app. Check the URL points to an App Store or Play Store listing.",
      });
      return;
    }

    const preview: SubmissionEnrichPreview = {
      title: enriched.title,
      developer: enriched.developer,
      shortDescription: enriched.shortDescription,
      iconUrl: enriched.iconUrl,
      appStoreUrl: enriched.appStoreUrl,
      playStoreUrl: enriched.playStoreUrl,
      screenshots: enriched.screenshots,
      iosRating: enriched.iosRating,
      androidRating: enriched.androidRating,
      priceUsd: enriched.priceUsd,
      releaseYear: enriched.releaseYear,
      genre: enriched.genre,
      guessedCategory: guessCategory(enriched.genre) as SubmissionEnrichPreview["guessedCategory"],
    };

    res.json(preview);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/submissions
 * Body: SubmissionCreateRequest — email + urls + questionnaire answers + pitch
 * Writes a pending submission, re-enriches server-side (so submitter can't fake data).
 */
submissionsRouter.post("/", async (req, res, next) => {
  try {
    const ip = getClientIp(req);
    if (!rateLimitOk(ip)) {
      res.status(429).json({
        error: "rate_limited",
        message: "Too many submissions from this IP. Try again in a few minutes.",
      });
      return;
    }

    const body = req.body as Partial<SubmissionCreateRequest>;
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const appStoreUrl = typeof body?.appStoreUrl === "string" ? body.appStoreUrl.trim() : "";
    const playStoreUrl = typeof body?.playStoreUrl === "string" ? body.playStoreUrl.trim() : "";
    const userPitch = typeof body?.userPitch === "string" ? body.userPitch.trim().slice(0, 1000) : "";
    const answers = body?.answers;

    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: "bad_request", message: "Valid email required" });
      return;
    }
    if (!appStoreUrl && !playStoreUrl) {
      res.status(400).json({
        error: "bad_request",
        message: "Provide at least one store URL",
      });
      return;
    }
    if (!answers || typeof answers !== "object") {
      res.status(400).json({ error: "bad_request", message: "Questionnaire answers required" });
      return;
    }

    // Coerce answer values to strict booleans
    const cleanAnswers: QuestionnaireAnswers = {
      nativeTabletUi: !!answers.nativeTabletUi,
      landscapeReady: !!answers.landscapeReady,
      stylusSupport: !!answers.stylusSupport,
      offlinePlay: !!answers.offlinePlay,
      cleanMonetization: !!answers.cleanMonetization,
      controllerSupport: !!answers.controllerSupport,
    };

    const enriched = await enrichFromStoreUrls({
      appStoreUrl: appStoreUrl || null,
      playStoreUrl: playStoreUrl || null,
    });

    if (!enriched.title) {
      res.status(422).json({
        error: "enrichment_failed",
        message: "Couldn't find this app in either store",
      });
      return;
    }

    const platforms = derivePlatforms(enriched.appStoreUrl, enriched.playStoreUrl);
    const category = guessCategory(enriched.genre);
    const tabletScore = computeTabletScore(cleanAnswers);

    const row = await queryOne<{ id: number }>(
      `INSERT INTO submissions (
         submitter_email, submitter_ip,
         app_store_url, play_store_url,
         title, developer, category, platforms, short_description,
         icon_url, screenshots,
         ios_rating, ios_rating_count, android_rating, android_rating_count,
         price_usd, release_year,
         questionnaire, computed_tablet_score, user_pitch
       ) VALUES (
         $1, $2, $3, $4, $5, $6, $7, $8, $9,
         $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
       )
       RETURNING id`,
      [
        email,
        ip,
        enriched.appStoreUrl,
        enriched.playStoreUrl,
        enriched.title,
        enriched.developer,
        category,
        platforms,
        enriched.shortDescription,
        enriched.iconUrl,
        enriched.screenshots,
        enriched.iosRating,
        enriched.iosRatingCount,
        enriched.androidRating,
        enriched.androidRatingCount,
        enriched.priceUsd,
        enriched.releaseYear,
        JSON.stringify(cleanAnswers),
        tabletScore,
        userPitch,
      ],
    );

    // Fire and forget email notification
    sendNewSubmissionEmail({
      email,
      title: enriched.title,
      category,
      pitch: userPitch,
    });

    res.status(201).json({
      id: row?.id,
      status: "pending",
      message: "Thanks — we'll review your submission and email you when it's live.",
    });
  } catch (err) {
    next(err);
  }
});

// ------------------ Admin ------------------

const ADMIN_COLUMNS = `
  id, submitter_email, app_store_url, play_store_url,
  title, developer, category, platforms, short_description,
  icon_url, screenshots,
  ios_rating, ios_rating_count, android_rating, android_rating_count,
  price_usd, release_year,
  questionnaire, computed_tablet_score, user_pitch,
  status, rejection_reason, approved_slug,
  created_at, reviewed_at
`;

/** GET /api/admin/submissions?status=pending */
export async function listSubmissions(
  req: Request,
  res: Parameters<Parameters<typeof submissionsRouter.get>[1]>[1],
  next: Parameters<Parameters<typeof submissionsRouter.get>[1]>[2],
) {
  try {
    const statusParam = typeof req.query.status === "string" ? req.query.status : "pending";
    const statusOk = ["pending", "approved", "rejected", "all"].includes(statusParam);
    if (!statusOk) {
      res.status(400).json({ error: "bad_request", message: "Unknown status" });
      return;
    }
    const rows =
      statusParam === "all"
        ? await query<Record<string, unknown>>(
            `SELECT ${ADMIN_COLUMNS} FROM submissions ORDER BY created_at DESC LIMIT 200`,
          )
        : await query<Record<string, unknown>>(
            `SELECT ${ADMIN_COLUMNS} FROM submissions WHERE status = $1 ORDER BY created_at DESC LIMIT 200`,
            [statusParam],
          );

    res.json(toCamelRows<any>(rows));
  } catch (err) {
    next(err);
  }
}

/** POST /api/admin/submissions/:id/approve */
export async function approveSubmission(
  req: Request,
  res: Parameters<Parameters<typeof submissionsRouter.post>[1]>[1],
  next: Parameters<Parameters<typeof submissionsRouter.post>[1]>[2],
) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid id" });
      return;
    }

    const sub = await queryOne<any>(
      `SELECT ${ADMIN_COLUMNS} FROM submissions WHERE id = $1`,
      [id],
    );
    if (!sub) {
      res.status(404).json({ error: "not_found", message: "Submission not found" });
      return;
    }
    const camel = toCamel<any>(sub);
    if (camel.status !== "pending") {
      res.status(409).json({
        error: "conflict",
        message: `Already ${camel.status}`,
      });
      return;
    }
    if (!camel.title || !(GAME_CATEGORIES as string[]).includes(camel.category)) {
      res.status(422).json({
        error: "unprocessable",
        message: "Submission missing required data",
      });
      return;
    }

    const baseSlug = slugify(camel.title);
    // Resolve slug uniqueness
    let slug = baseSlug;
    let n = 2;
    while (true) {
      const clash = await queryOne<{ slug: string }>(
        `SELECT slug FROM games WHERE slug = $1`,
        [slug],
      );
      if (!clash) break;
      slug = `${baseSlug}-${n++}`;
      if (n > 20) break;
    }

    // Derive feature list from questionnaire
    const answers = camel.questionnaire ?? {};
    const features = answersToFeatures(answers);

    await pool.query("BEGIN");
    try {
      await pool.query(
        `INSERT INTO games (
           slug, title, developer, category, platforms, tablet_score,
           price_usd, short_description, tablet_features,
           app_store_url, play_store_url, thumbnail, icon_url, screenshots,
           ios_rating, ios_rating_count, android_rating, android_rating_count,
           release_year, ratings_updated_at
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19, NOW()
         )
         ON CONFLICT (slug) DO NOTHING`,
        [
          slug,
          camel.title,
          camel.developer,
          camel.category,
          camel.platforms,
          camel.computedTabletScore,
          camel.priceUsd,
          camel.shortDescription ?? "",
          features,
          camel.appStoreUrl,
          camel.playStoreUrl,
          `/images/games/${slug}.jpg`,
          camel.iconUrl,
          camel.screenshots ?? [],
          camel.iosRating,
          camel.iosRatingCount,
          camel.androidRating,
          camel.androidRatingCount,
          camel.releaseYear ?? new Date().getFullYear(),
        ],
      );

      await pool.query(
        `UPDATE submissions
            SET status = 'approved',
                approved_slug = $2,
                reviewed_at = NOW(),
                updated_at = NOW()
          WHERE id = $1`,
        [id, slug],
      );

      await pool.query("COMMIT");
    } catch (err) {
      await pool.query("ROLLBACK");
      throw err;
    }

    res.json({ ok: true, slug, url: `/games/${slug}` });
  } catch (err) {
    next(err);
  }
}

/** POST /api/admin/submissions/:id/reject */
export async function rejectSubmission(
  req: Request,
  res: Parameters<Parameters<typeof submissionsRouter.post>[1]>[1],
  next: Parameters<Parameters<typeof submissionsRouter.post>[1]>[2],
) {
  try {
    const id = parseInt(req.params.id, 10);
    const reason =
      typeof req.body?.reason === "string" ? req.body.reason.slice(0, 500) : "";
    if (!Number.isFinite(id)) {
      res.status(400).json({ error: "bad_request", message: "Invalid id" });
      return;
    }
    const result = await pool.query(
      `UPDATE submissions
          SET status = 'rejected',
              rejection_reason = $2,
              reviewed_at = NOW(),
              updated_at = NOW()
        WHERE id = $1 AND status = 'pending'
        RETURNING id`,
      [id, reason || null],
    );
    if (result.rowCount === 0) {
      res.status(404).json({ error: "not_found", message: "No pending submission with that id" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
