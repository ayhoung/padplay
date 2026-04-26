import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { pool, toCamel } from "../lib/db";
import { GAME_CATEGORIES } from "@padplay/shared-types";
import { serializeGame } from "../lib/serialize";

const gameBodySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  developer: z.string().min(1),
  category: z.enum(GAME_CATEGORIES as [string, ...string[]]),
  platforms: z.enum(["ios", "android", "both"]),
  tabletScore: z.number().int().min(0).max(100),
  priceUsd: z.number().nullable().optional(),
  shortDescription: z.string().min(1),
  tabletFeatures: z.array(z.string()).optional(),
  appStoreUrl: z.string().url().nullable().optional(),
  playStoreUrl: z.string().url().nullable().optional(),
  thumbnail: z.string().min(1),
  iconUrl: z.string().url().nullable().optional(),
  screenshots: z.array(z.string()).optional(),
  quotes: z.array(z.any()).optional(), // or a specific quote schema
  iosRating: z.number().nullable().optional(),
  iosRatingCount: z.number().nullable().optional(),
  androidRating: z.number().nullable().optional(),
  androidRatingCount: z.number().nullable().optional(),
  releaseYear: z.number().int().min(1970).max(2100),
});

export async function createAdminGame(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = gameBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "bad_request", message: "Invalid payload", issues: parsed.error.issues });
      return;
    }

    const data = parsed.data;

    // Check slug collision
    const existing = await pool.query(`SELECT id FROM games WHERE slug = $1`, [data.slug]);
    if (existing.rowCount && existing.rowCount > 0) {
      res.status(409).json({ error: "conflict", message: "A game with this slug already exists" });
      return;
    }

    const { rows } = await pool.query(
      `INSERT INTO games (
        slug, title, developer, category, platforms, tablet_score,
        price_usd, short_description, tablet_features,
        app_store_url, play_store_url, thumbnail, icon_url,
        screenshots, quotes,
        ios_rating, ios_rating_count, android_rating, android_rating_count,
        release_year
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9,
        $10, $11, $12, $13,
        $14, $15,
        $16, $17, $18, $19,
        $20
      ) RETURNING *`,
      [
        data.slug, data.title, data.developer, data.category, data.platforms, data.tabletScore,
        data.priceUsd ?? null, data.shortDescription, data.tabletFeatures ?? [],
        data.appStoreUrl ?? null, data.playStoreUrl ?? null, data.thumbnail, data.iconUrl ?? null,
        data.screenshots ?? [], JSON.stringify(data.quotes ?? []),
        data.iosRating ?? null, data.iosRatingCount ?? null, data.androidRating ?? null, data.androidRatingCount ?? null,
        data.releaseYear
      ]
    );

    const camel = toCamel<any>(rows[0]);
    res.status(201).json(serializeGame(camel));
  } catch (err) {
    next(err);
  }
}

export async function updateAdminGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;
    const parsed = gameBodySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "bad_request", message: "Invalid payload", issues: parsed.error.issues });
      return;
    }

    const data = parsed.data;
    
    // Build dynamic update query
    const setKeys: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const addField = (colName: string, value: any) => {
      setKeys.push(`${colName} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    };

    if (data.slug !== undefined) addField("slug", data.slug);
    if (data.title !== undefined) addField("title", data.title);
    if (data.developer !== undefined) addField("developer", data.developer);
    if (data.category !== undefined) addField("category", data.category);
    if (data.platforms !== undefined) addField("platforms", data.platforms);
    if (data.tabletScore !== undefined) addField("tablet_score", data.tabletScore);
    if (data.priceUsd !== undefined) addField("price_usd", data.priceUsd);
    if (data.shortDescription !== undefined) addField("short_description", data.shortDescription);
    if (data.tabletFeatures !== undefined) addField("tablet_features", data.tabletFeatures);
    if (data.appStoreUrl !== undefined) addField("app_store_url", data.appStoreUrl);
    if (data.playStoreUrl !== undefined) addField("play_store_url", data.playStoreUrl);
    if (data.thumbnail !== undefined) addField("thumbnail", data.thumbnail);
    if (data.iconUrl !== undefined) addField("icon_url", data.iconUrl);
    if (data.screenshots !== undefined) addField("screenshots", data.screenshots);
    if (data.quotes !== undefined) addField("quotes", JSON.stringify(data.quotes));
    if (data.iosRating !== undefined) addField("ios_rating", data.iosRating);
    if (data.iosRatingCount !== undefined) addField("ios_rating_count", data.iosRatingCount);
    if (data.androidRating !== undefined) addField("android_rating", data.androidRating);
    if (data.androidRatingCount !== undefined) addField("android_rating_count", data.androidRatingCount);
    if (data.releaseYear !== undefined) addField("release_year", data.releaseYear);

    if (setKeys.length === 0) {
      res.status(400).json({ error: "bad_request", message: "No fields to update" });
      return;
    }

    addField("updated_at", new Date());

    values.push(slug);
    const slugParamIndex = paramIndex;

    const queryStr = `UPDATE games SET ${setKeys.join(", ")} WHERE slug = $${slugParamIndex} RETURNING *`;
    
    const { rows } = await pool.query(queryStr, values);
    if (rows.length === 0) {
      res.status(404).json({ error: "not_found", message: "Game not found" });
      return;
    }

    const camel = toCamel<any>(rows[0]);
    res.json(serializeGame(camel));
  } catch (err) {
    next(err);
  }
}

export async function deleteAdminGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { slug } = req.params;

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const { rows } = await client.query(`DELETE FROM games WHERE slug = $1 RETURNING id`, [slug]);
      
      if (rows.length === 0) {
        await client.query("ROLLBACK");
        res.status(404).json({ error: "not_found", message: "Game not found" });
        return;
      }

      // Application-level cascade: Update linked submissions
      await client.query(`
        UPDATE submissions 
        SET approved_slug = NULL, 
            status = 'rejected', 
            rejection_reason = 'Game was deleted by admin' 
        WHERE approved_slug = $1
      `, [slug]);

      await client.query("COMMIT");
      res.status(204).send();
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
}
