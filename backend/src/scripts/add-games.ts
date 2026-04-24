import "dotenv/config";
import { pool } from "../lib/db";
import { enrichFromStoreUrls } from "../lib/enrich";
import type { UserQuote } from "@padplay/shared-types";

/**
 * New games to add from the curated editorial list. Each entry has the
 * hardcoded editorial metadata (title, developer, category, tablet_score,
 * tablet_features, short_description, quotes) plus verified App Store /
 * Play Store IDs. Enrichment (icon, screenshots, ratings, price,
 * releaseYear) is pulled from the stores via enrichFromStoreUrls.
 *
 * Each ID below was verified to return the correct product via iTunes
 * Lookup / google-play-scraper before this file was written — DO NOT trust
 * search-based matching for new IDs; always lookup to verify.
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
    slug: "total-war-medieval-ii",
    title: "Total War: MEDIEVAL II",
    developer: "Feral Interactive",
    category: "strategy",
    platforms: "ios",
    tabletScore: 93,
    tabletFeatures: [
      "Gold-standard mobile port",
      "Touch-redesigned battle controls",
      "Tablet HUD with permanent data overlays",
      "Full DLC included",
    ],
    shortDescription:
      "Creative Assembly's 2006 strategy epic, completely redesigned for touch on the expanded screen of a tablet.",
    iosTrackId: "1477203766",
    androidAppId: null,
    editorialQuotes: [
      "Established what many consider the 'gold standard' for mobile ports.",
      "The interface has been completely redesigned for touch, utilizing the expanded screen of a tablet to allow for a mix of real-time battles and deep strategic management.",
    ],
  },
  {
    slug: "kotor",
    title: "Star Wars: Knights of the Old Republic",
    developer: "Aspyr Media / BioWare",
    category: "rpg",
    platforms: "ios",
    tabletScore: 88,
    tabletFeatures: [
      "Full console RPG experience",
      "Uncompromised port of the 2003 classic",
      "Plays perfectly on iPad",
    ],
    shortDescription:
      "BioWare's landmark Star Wars RPG, a full, uncompromised port of the console classic that still holds up on iPad.",
    iosTrackId: "611436052",
    androidAppId: null,
    editorialQuotes: [
      "Essential for story-driven RPG fans; a full, uncompromised port of the console classics.",
      "KOTOR 1 is in much better shape and plays perfectly on iPads.",
    ],
  },
  {
    slug: "baldurs-gate-2-enhanced",
    title: "Baldur's Gate II: Enhanced Edition",
    developer: "Beamdog / Overhaul Games",
    category: "rpg",
    platforms: "ios",
    tabletScore: 90,
    tabletFeatures: [
      "4:3 aspect ratio aligns with iPad",
      "Stylus precision rivals mouse",
      "Original + Enhanced content",
    ],
    shortDescription:
      "The 2000 CRPG masterpiece enhanced for iPad — where the 4:3 aspect ratio and stylus precision transform the classic.",
    iosTrackId: "633625517",
    androidAppId: null,
    editorialQuotes: [
      "Designed for 4:3 monitors and mouse-driven precision, characteristics that align perfectly with the iPad's aspect ratio and the precision of a stylus.",
      "Playing with an S-Pen transforms the game from a 'fiddly' experience into something infinitely better.",
    ],
  },
  {
    slug: "alien-isolation",
    title: "Alien: Isolation",
    developer: "Feral Interactive / Creative Assembly",
    category: "action",
    platforms: "both",
    tabletScore: 92,
    tabletFeatures: [
      "Desktop-equivalent graphics",
      "Full controller remapping",
      "Top-tier mobile console port",
    ],
    shortDescription:
      "The 2014 survival horror masterpiece running like butter on mobile, with full console-grade visuals and controller support.",
    iosTrackId: "1573029040",
    androidAppId: "com.feralinteractive.alienisolation_android",
    editorialQuotes: [
      "Runs like butter… in the realm of mobile console game ports, this is easily a top 3 best attempt.",
      "Desktop-equivalent graphics and full controller remapping.",
    ],
  },
  {
    slug: "hitman-blood-money-reprisal",
    title: "Hitman: Blood Money — Reprisal",
    developer: "Feral Interactive / IO Interactive",
    category: "action",
    platforms: "both",
    tabletScore: 91,
    tabletFeatures: [
      "Native keyboard and mouse support",
      "Remastered for modern devices",
      "Workstation-like experience",
    ],
    shortDescription:
      "The iconic 2006 stealth assassination game remastered with touch, keyboard, and mouse support for a workstation-like play experience.",
    iosTrackId: "1631331207",
    androidAppId: "com.feralinteractive.hitmanbloodmoney_android",
    editorialQuotes: [
      "Immediately shot up the list of the best iOS game ports in a long time.",
      "Features native keyboard and mouse support for a workstation-like experience.",
    ],
  },
  {
    slug: "resident-evil-village",
    title: "Resident Evil Village",
    developer: "Capcom",
    category: "action",
    platforms: "ios",
    tabletScore: 90,
    tabletFeatures: [
      "MetalFX upscaling support",
      "Customizable resolution + framerate",
      "Console-quality AAA visuals",
    ],
    shortDescription:
      "Capcom's 2021 survival horror blockbuster, a genuine AAA port with PC-level customization options on iPhone and iPad.",
    iosTrackId: "6450980545",
    androidAppId: null,
    editorialQuotes: [
      "Essentially a port of its PC version… with full customization options for resolution, frame rate targets, and even MetalFX upscaling.",
      "Shows the potential that Apple devices have to be considered as legitimate contenders in the AAA gaming world.",
    ],
  },
  {
    slug: "prince-of-persia-lost-crown",
    title: "Prince of Persia: The Lost Crown",
    developer: "Ubisoft",
    category: "action",
    platforms: "both",
    tabletScore: 89,
    tabletFeatures: [
      "60fps on recent devices",
      "Touch-optimized platformer controls",
      "Console-grade graphics",
    ],
    shortDescription:
      "Ubisoft's 2024 metroidvania, delivering console-grade graphics at 60fps with a touch-optimized UI on mobile.",
    iosTrackId: "6504011865",
    androidAppId: "com.ubisoft.princeofpersia.thelostcrown.mobile.action.adventure.platform",
    editorialQuotes: [
      "A revamped interface optimized for touch controls… delivers console-grade graphics without melting your phone.",
      "Runs at 60 FPS on recent generations of mobile devices.",
    ],
  },
  {
    slug: "ftl-faster-than-light",
    title: "FTL: Faster Than Light",
    developer: "Subset Games",
    category: "strategy",
    platforms: "ios",
    tabletScore: 97,
    tabletFeatures: [
      "iPad-exclusive mobile release",
      "UI designed for multi-room monitoring",
      "A definitive tablet-gaming title",
    ],
    shortDescription:
      "The landmark space roguelike, built for iPad — monitoring every room of your ship at once requires the larger screen.",
    iosTrackId: "833951143",
    androidAppId: null,
    editorialQuotes: [
      "One of the definitive reasons to own an iPad for gaming… the UI requires a player to monitor multiple rooms of a spaceship simultaneously, which a smartphone screen cannot handle without compromise.",
      "A true, iPad exclusive!",
    ],
  },
  {
    slug: "subnautica",
    title: "Subnautica",
    developer: "Unknown Worlds Entertainment",
    category: "simulation",
    platforms: "both",
    tabletScore: 90,
    tabletFeatures: [
      "UI built for touch controls",
      "120fps on capable devices",
      "Full PC content on mobile",
    ],
    shortDescription:
      "Unknown Worlds' underwater survival adventure, ported thoughtfully to both iPad and Android with a touch-native UI.",
    iosTrackId: "6478639011",
    androidAppId: "com.unknownworlds.subnautica",
    editorialQuotes: [
      "The Android port of Subnautica is very well done. The UI is perfect for touch controls.",
      "Way better optimized on Android… will run at 120fps on the Odin 3 maxed out.",
    ],
  },
  {
    slug: "world-of-goo-remastered",
    title: "World of Goo Remastered",
    developer: "2D Boy / Tomorrow Corporation",
    category: "puzzle",
    platforms: "both",
    tabletScore: 88,
    tabletFeatures: [
      "Stylus-optimized construction",
      "Netflix Games subscription (no IAP)",
      "Remastered visuals",
    ],
    shortDescription:
      "The 2008 physics puzzler remastered for Netflix Games — a stylus transforms goo-ball construction into a satisfying craft.",
    iosTrackId: "6443476726",
    androidAppId: "com.netflix.NGP.WorldofGooHD",
    editorialQuotes: [
      "A must-play for stylus users; the improved precision makes construction significantly more satisfying than using fingers.",
    ],
  },
  {
    slug: "sky-force-reloaded",
    title: "Sky Force Reloaded",
    developer: "Infinite Dreams",
    category: "action",
    platforms: "both",
    tabletScore: 86,
    tabletFeatures: [
      "S-Pen and stylus support",
      "Precision dodging and targeting",
      "Big-screen shmup",
    ],
    shortDescription:
      "A polished top-down shoot-'em-up where the tablet's larger screen and stylus precision beat phones every time.",
    iosTrackId: "976116090",
    androidAppId: "pl.idreams.SkyForceReloadedTV",
    editorialQuotes: [
      "The S-Pen is most helpful here… much easier when I don't have to try and look around my fingers.",
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
    source: "editorial" as any, // extending the UserQuote.source type informally
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
    // Put editorial first — they're the curator's take, not a random review.
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

    // Rate-limit on iTunes/Play
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
