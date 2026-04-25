import "dotenv/config";
import { pool } from "../lib/db";
import { enrichFromStoreUrls } from "../lib/enrich";
import type { UserQuote } from "@padplay/shared-types";

/**
 * Curated additions sourced from the r/ipad "What's the Best Game for iPad?"
 * thread. Same shape as add-games.ts: hand-written editorial metadata plus
 * verified store IDs, with icon/screenshots/ratings/price/year pulled from
 * the stores via enrichFromStoreUrls.
 *
 * Every iOS trackId and Android appId below was verified via
 * iTunes Lookup / google-play-scraper before this file was written.
 */

interface NewGame {
  slug: string;
  title: string;
  developer: string;
  category: string;
  platforms: "ios" | "android" | "both";
  tabletScore: number;
  tabletFeatures: string[];
  shortDescription: string;
  iosTrackId: string | null;
  androidAppId: string | null;
  editorialQuotes: string[];
}

const EDITORIAL_AUTHOR = "Editorial";

const NEW_GAMES: NewGame[] = [
  {
    slug: "rollercoaster-tycoon-classic",
    title: "RollerCoaster Tycoon Classic",
    developer: "Atari / Origin8 Technologies",
    category: "simulation",
    platforms: "ios",
    tabletScore: 92,
    tabletFeatures: [
      "Faithful PC port with original tilesets",
      "Pinch-and-drag park building scales to the iPad screen",
      "No timers or pay-to-progress mechanics",
    ],
    shortDescription:
      "The original RCT 1 + 2 content rebuilt for touch — a complete PC park-builder you actually own, not a freemium spin-off.",
    iosTrackId: "1113736426",
    androidAppId: null,
    editorialQuotes: [
      "It's my comfort game and a really decent port — a must-have on every device.",
      "Building a whole park on a tablet only really works once the screen is large enough to drag track and place scenery without fighting your finger.",
    ],
  },
  {
    slug: "magic-the-gathering-arena",
    title: "Magic: The Gathering Arena",
    developer: "Wizards of the Coast",
    category: "strategy",
    platforms: "both",
    tabletScore: 84,
    tabletFeatures: [
      "Full Standard, Historic, and limited formats",
      "Battlefield UI built around a tablet's playmat-sized canvas",
      "Cross-progression with the PC client",
    ],
    shortDescription:
      "Wizards' digital MTG client, where the tablet finally gives the battlefield room to breathe — lands, creatures, and the stack stop overlapping.",
    iosTrackId: "1496227521",
    androidAppId: "com.wizards.mtga",
    editorialQuotes: [
      "If you play Magic, this is the version where the tablet earns its keep — phone screens crowd the battlefield once permanents start stacking.",
    ],
  },
  {
    slug: "resident-evil-4",
    title: "Resident Evil 4",
    developer: "Capcom",
    category: "action",
    platforms: "ios",
    tabletScore: 90,
    tabletFeatures: [
      "Native iPad port of the 2023 remake",
      "MetalFX upscaling and adjustable framerate",
      "Free demo, full unlock as in-app purchase",
    ],
    shortDescription:
      "Capcom's 2023 remake of the survival-horror classic, ported natively to iPad with PC-grade graphics options on Apple silicon.",
    iosTrackId: "6462360082",
    androidAppId: null,
    editorialQuotes: [
      "Sits alongside Resident Evil Village as proof that AAA console ports on iPad aren't a stunt anymore — they're the real thing.",
      "Plays great with a controller; the larger screen makes the over-the-shoulder aiming feel closer to console than phone.",
    ],
  },
  {
    slug: "hidden-folks",
    title: "Hidden Folks",
    developer: "Adriaan de Jongh",
    category: "puzzle",
    platforms: "both",
    tabletScore: 93,
    tabletFeatures: [
      "Hand-drawn dioramas built for big-screen scanning",
      "Tap-to-poke interactions across every scene",
      "No timers, no IAP, no scaling pressure",
    ],
    shortDescription:
      "A hand-drawn, mouth-noise-scored where's-Waldo where the iPad's extra screen turns a fiddly hunt into a relaxed one.",
    iosTrackId: "1133544923",
    androidAppId: "com.adriaandejongh.hiddenfolks",
    editorialQuotes: [
      "Hidden-object games live or die by how much of the scene you can see at once — this is the genre that most rewards the upgrade from phone to tablet.",
    ],
  },
  {
    slug: "brotato",
    title: "Brotato",
    developer: "Blobfish / Erabit Studios",
    category: "action",
    platforms: "both",
    tabletScore: 85,
    tabletFeatures: [
      "Touch-first controls with optional virtual stick",
      "20-second waves fit pick-up-and-play sessions",
      "Full PC roster of characters and weapons",
    ],
    shortDescription:
      "The auto-firing potato roguelite — short waves, dense screen-clear chaos, and a build-craft loop that scales nicely to a tablet.",
    iosTrackId: "6445884925",
    androidAppId: "com.brotato.shooting.survivors.action.roguelike",
    editorialQuotes: [
      "Round-based survivor-likes are designed for phones, but Brotato's stat screens and item descriptions stop being squint-worthy on a tablet.",
    ],
  },
  {
    slug: "sneaky-sasquatch",
    title: "Sneaky Sasquatch",
    developer: "RAC7 Games",
    category: "simulation",
    platforms: "ios",
    tabletScore: 89,
    tabletFeatures: [
      "Apple Arcade exclusive — no ads, no IAP",
      "Open-ended life-sim with stealth and odd jobs",
      "Frequent free content updates",
    ],
    shortDescription:
      "An Apple Arcade flagship: a chunky, charming life-sim about a sasquatch sneaking through campsites, working jobs, and quietly stealing sandwiches.",
    iosTrackId: "1098342019",
    androidAppId: null,
    editorialQuotes: [
      "One of the best reasons to keep an Apple Arcade subscription, and a textbook example of a game designed around the iPad as the primary device.",
    ],
  },
  {
    slug: "arcaea",
    title: "Arcaea",
    developer: "lowiro",
    category: "action",
    platforms: "both",
    tabletScore: 92,
    tabletFeatures: [
      "Two-track playfield benefits from extra width",
      "Stylus-friendly note tracking",
      "Active soundtrack updates and free song packs",
    ],
    shortDescription:
      "A rhythm game whose two-layered note chart was practically built for tablet width — phone screens cramp the sky-track, tablets don't.",
    iosTrackId: "1205999125",
    androidAppId: "moe.low.arc",
    editorialQuotes: [
      "Rhythm games scale with how much chart you can read ahead — Arcaea's dual-track layout is one of the clearest cases for playing on a tablet, not a phone.",
    ],
  },
  {
    slug: "project-sekai",
    title: "HATSUNE MIKU: COLORFUL STAGE!",
    developer: "SEGA / Colorful Palette",
    category: "action",
    platforms: "both",
    tabletScore: 87,
    tabletFeatures: [
      "12-key chart layout suits widescreen tablet display",
      "Full-screen story scenes with VN-style dialogue",
      "Free-to-play with optional gacha",
    ],
    shortDescription:
      "The English release of Project Sekai — a rhythm-and-story hybrid where Vocaloid stages and visual-novel scenes both gain from the larger panel.",
    iosTrackId: "1580044138",
    androidAppId: "com.sega.ColorfulStage.en",
    editorialQuotes: [
      "Half rhythm game, half visual novel — both halves are easier on the eyes (and the fingers) when you're not playing on a 6-inch screen.",
    ],
  },
];

function buildIosUrl(trackId: string): string {
  return `https://apps.apple.com/us/app/id${trackId}`;
}

function buildAndroidUrl(appId: string): string {
  return `https://play.google.com/store/apps/details?id=${appId}`;
}

function editorialQuoteToUserQuote(text: string): UserQuote {
  return {
    author: EDITORIAL_AUTHOR,
    text,
    rating: null,
    date: null,
    source: "editorial" as any,
  };
}

async function main() {
  const apply = process.argv.includes("--apply");
  console.log(`${apply ? "APPLYING" : "DRY RUN"} — ${NEW_GAMES.length} games\n`);

  const prepared: Array<{
    game: NewGame;
    enrichedTitle: string | null;
    iconUrl: string | null;
    appStoreUrl: string | null;
    playStoreUrl: string | null;
    screenshots: string[];
    iosRating: number | null;
    iosRatingCount: number | null;
    androidRating: number | null;
    androidRatingCount: number | null;
    priceUsd: number | null;
    releaseYear: number | null;
    mergedQuotes: UserQuote[];
    existed: boolean;
  }> = [];

  for (const game of NEW_GAMES) {
    const iosUrl = game.iosTrackId ? buildIosUrl(game.iosTrackId) : null;
    const playUrl = game.androidAppId ? buildAndroidUrl(game.androidAppId) : null;

    const enriched = await enrichFromStoreUrls({
      appStoreUrl: iosUrl,
      playStoreUrl: playUrl,
    });

    const editorial = game.editorialQuotes.map(editorialQuoteToUserQuote);
    const mergedQuotes = [...editorial, ...enriched.quotes].slice(0, 8);

    const existing = await pool.query<{ slug: string }>(
      `SELECT slug FROM games WHERE slug = $1`,
      [game.slug],
    );

    prepared.push({
      game,
      enrichedTitle: enriched.title,
      iconUrl: enriched.iconUrl,
      appStoreUrl: enriched.appStoreUrl ?? iosUrl,
      playStoreUrl: enriched.playStoreUrl ?? playUrl,
      screenshots: enriched.screenshots,
      iosRating: enriched.iosRating,
      iosRatingCount: enriched.iosRatingCount,
      androidRating: enriched.androidRating,
      androidRatingCount: enriched.androidRatingCount,
      priceUsd: enriched.priceUsd,
      releaseYear: enriched.releaseYear,
      mergedQuotes,
      existed: existing.rows.length > 0,
    });

    const op = existing.rows.length > 0 ? "UPDATE" : "INSERT";
    const iosLabel = iosUrl ? `iOS=${game.iosTrackId} → "${enriched.title ?? "?"}"` : "no iOS";
    const andLabel = playUrl ? `Android=${game.androidAppId}` : "no Android";
    const year = enriched.releaseYear ?? "?";
    const price = enriched.priceUsd === null ? "?" : `$${enriched.priceUsd}`;
    const shots = enriched.screenshots.length;
    console.log(
      `  ${op.padEnd(6)} ${game.slug.padEnd(30)}  ${iosLabel}  ${andLabel}  (${year}, ${price}, ${shots}sc, ${mergedQuotes.length}q)`,
    );

    await new Promise((r) => setTimeout(r, 400));
  }

  console.log(`\n${prepared.filter((p) => !p.existed).length} new, ${prepared.filter((p) => p.existed).length} updating existing rows.`);

  if (!apply) {
    console.log(`\nDry run. Re-run with --apply to commit.`);
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const p of prepared) {
      await client.query(
        `INSERT INTO games (
           slug, title, developer, category, platforms, tablet_score,
           price_usd, short_description, tablet_features,
           app_store_url, play_store_url, thumbnail, release_year,
           icon_url, screenshots, quotes,
           ios_rating, ios_rating_count, android_rating, android_rating_count,
           price_updated_at, ratings_updated_at
         ) VALUES (
           $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb,$17,$18,$19,$20,NOW(),NOW()
         )
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           developer = EXCLUDED.developer,
           category = EXCLUDED.category,
           platforms = EXCLUDED.platforms,
           tablet_score = EXCLUDED.tablet_score,
           price_usd = COALESCE(EXCLUDED.price_usd, games.price_usd),
           short_description = EXCLUDED.short_description,
           tablet_features = EXCLUDED.tablet_features,
           app_store_url = COALESCE(EXCLUDED.app_store_url, games.app_store_url),
           play_store_url = COALESCE(EXCLUDED.play_store_url, games.play_store_url),
           thumbnail = EXCLUDED.thumbnail,
           release_year = COALESCE(EXCLUDED.release_year, games.release_year),
           icon_url = COALESCE(EXCLUDED.icon_url, games.icon_url),
           screenshots = CASE WHEN array_length(EXCLUDED.screenshots, 1) IS NULL THEN games.screenshots ELSE EXCLUDED.screenshots END,
           quotes = EXCLUDED.quotes,
           ios_rating = COALESCE(EXCLUDED.ios_rating, games.ios_rating),
           ios_rating_count = COALESCE(EXCLUDED.ios_rating_count, games.ios_rating_count),
           android_rating = COALESCE(EXCLUDED.android_rating, games.android_rating),
           android_rating_count = COALESCE(EXCLUDED.android_rating_count, games.android_rating_count),
           price_updated_at = NOW(),
           ratings_updated_at = NOW(),
           updated_at = NOW()`,
        [
          p.game.slug,
          p.game.title,
          p.game.developer,
          p.game.category,
          p.game.platforms,
          p.game.tabletScore,
          p.priceUsd,
          p.game.shortDescription,
          p.game.tabletFeatures,
          p.appStoreUrl,
          p.playStoreUrl,
          `/images/games/${p.game.slug}.jpg`,
          p.releaseYear ?? new Date().getFullYear(),
          p.iconUrl,
          p.screenshots,
          JSON.stringify(p.mergedQuotes),
          p.iosRating,
          p.iosRatingCount,
          p.androidRating,
          p.androidRatingCount,
        ],
      );
    }
    await client.query("COMMIT");
    console.log(`\n✓ Committed ${prepared.length} rows.`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(`\n✗ ROLLED BACK:`, err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
