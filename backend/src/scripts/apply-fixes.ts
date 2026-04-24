import "dotenv/config";
import { pool } from "../lib/db";
import { itunesLookup, loadGplay } from "../lib/enrich";

type Decision =
  | { action: "set-ios"; trackId: string }
  | { action: "set-android"; appId: string }
  | { action: "null-ios" }
  | { action: "null-android" };

interface SlugFix {
  slug: string;
  decisions: Decision[];
  reason: string;
}

/**
 * Each entry below was picked manually from the propose-fixes.ts output and
 * cross-verified with direct iTunes / Play lookups. For games with no
 * legitimate mobile listing, we NULL the field rather than leave a wrong link.
 */
const FIXES: SlugFix[] = [
  // --- URL corrections (wrong app → correct app) ---
  {
    slug: "alto-odyssey",
    decisions: [{ action: "set-ios", trackId: "1182456409" }],
    reason: "iOS was linking to 'The Lost City' by Joe Kauffman. Correct listing is Snowman's Alto's Odyssey.",
  },
  {
    slug: "fantasian-neo-dimension",
    decisions: [{ action: "set-ios", trackId: "1517339045" }],
    reason: "iOS was linking to 'Neo Artifacts'. Correct listing is FANTASIAN by MISTWALKER CORPORATION (the iPad release).",
  },
  {
    slug: "root-board-game",
    decisions: [
      { action: "set-ios", trackId: "1439262206" },
      { action: "set-android", appId: "com.direwolfdigital.root" },
    ],
    reason: "iOS was linking to 'Root: car insurance'. Correct: Root Board Game by Dire Wolf Digital on both platforms.",
  },
  {
    slug: "pocket-city",
    decisions: [{ action: "set-android", appId: "com.codebrewgames.pocketcitygame" }],
    reason: "Android was linking to a clone ('Pocket City Builder' by gaheegame). Correct: com.codebrewgames.pocketcitygame.",
  },

  // --- NULL-outs (no legitimate mobile listing exists) ---
  {
    slug: "divinity-original-sin-2",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to Diablo Immortal. Larian's iPad port appears delisted; no current listing to link to.",
  },
  {
    slug: "hades",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to the Netflix app itself. No standalone App Store listing surfaces in search.",
  },
  {
    slug: "disco-elysium",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to 'Grim Quest'. Disco Elysium's iOS port was pulled and no current listing exists.",
  },
  {
    slug: "inkulinati",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to a random Armenian app. Inkulinati has no iOS release.",
  },
  {
    slug: "sayonara-wild-hearts",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to 'WHAT THE GOLF?'. Sayonara Wild Hearts is Apple Arcade only (no standalone App Store listing).",
  },
  {
    slug: "two-point-hospital",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to 'Hospital Empire Tycoon'. Two Point Hospital has no iOS/iPad release.",
  },
  {
    slug: "gloomhaven",
    decisions: [{ action: "null-ios" }],
    reason: "iOS was linking to a fan 'Campaign Tracker' tool. No official mobile Gloomhaven exists.",
  },
  {
    slug: "florence",
    decisions: [{ action: "null-android" }],
    reason: "Android was linking to 'Florence | NCLEX Prep' (nursing app). Florence by Annapurna/Mountains has no Android release.",
  },
  {
    slug: "dead-cells",
    decisions: [{ action: "null-android" }],
    reason: "Android was linking to 'Dead Cells: Netflix Edition' (a different build owned by Netflix). Playdigious's version isn't on Play Store.",
  },
  {
    slug: "wingspan",
    decisions: [{ action: "null-android" }],
    reason: "Android was linking to 'WingSpan WWT' (Wildfowl & Wetlands Trust app). Monster Couch's Wingspan isn't on Play Store.",
  },
];

async function verifyTrackId(trackId: string): Promise<string | null> {
  const r = await itunesLookup(trackId);
  if (!r || !r.trackName) return null;
  return `"${r.trackName}" by ${r.sellerName ?? r.artistName ?? "?"}`;
}

async function verifyAppId(appId: string): Promise<string | null> {
  try {
    const { app } = await loadGplay();
    const r = await app({ appId, country: "us" });
    if (!r.title) return null;
    return `"${r.title}" by ${r.developer ?? "?"}`;
  } catch {
    return null;
  }
}

async function main() {
  const apply = process.argv.includes("--apply");

  console.log(`${apply ? "APPLYING" : "DRY RUN"} — ${FIXES.length} slugs\n`);

  const updates: Array<{ slug: string; iosUrl: string | null | undefined; androidUrl: string | null | undefined; note: string }> = [];
  let verifyFailures = 0;

  for (const fix of FIXES) {
    const { rows } = await pool.query<{
      slug: string;
      title: string;
      developer: string;
      app_store_url: string | null;
      play_store_url: string | null;
    }>(
      `SELECT slug, title, developer, app_store_url, play_store_url
         FROM games WHERE slug = $1`,
      [fix.slug],
    );
    if (rows.length === 0) {
      console.log(`! ${fix.slug}: NOT FOUND in DB — skipping`);
      continue;
    }
    const row = rows[0];
    console.log(`\n━━━ ${fix.slug}  ("${row.title}" — ${row.developer})`);
    console.log(`    reason: ${fix.reason}`);

    let iosUrl: string | null | undefined = undefined;
    let androidUrl: string | null | undefined = undefined;

    for (const d of fix.decisions) {
      if (d.action === "set-ios") {
        const verified = await verifyTrackId(d.trackId);
        if (!verified) {
          console.log(`    ✗ iOS verify failed for trackId=${d.trackId}`);
          verifyFailures += 1;
          continue;
        }
        iosUrl = `https://apps.apple.com/us/app/id${d.trackId}`;
        console.log(`    iOS:     ${row.app_store_url ?? "(null)"}`);
        console.log(`         →   ${iosUrl}   [verified: ${verified}]`);
      } else if (d.action === "set-android") {
        const verified = await verifyAppId(d.appId);
        if (!verified) {
          console.log(`    ✗ Android verify failed for appId=${d.appId}`);
          verifyFailures += 1;
          continue;
        }
        androidUrl = `https://play.google.com/store/apps/details?id=${d.appId}`;
        console.log(`    Android: ${row.play_store_url ?? "(null)"}`);
        console.log(`         →   ${androidUrl}   [verified: ${verified}]`);
      } else if (d.action === "null-ios") {
        iosUrl = null;
        console.log(`    iOS:     ${row.app_store_url ?? "(null)"}`);
        console.log(`         →   NULL`);
      } else if (d.action === "null-android") {
        androidUrl = null;
        console.log(`    Android: ${row.play_store_url ?? "(null)"}`);
        console.log(`         →   NULL`);
      }
    }

    updates.push({ slug: fix.slug, iosUrl, androidUrl, note: fix.reason });
  }

  console.log(`\n${"=".repeat(60)}`);
  if (verifyFailures > 0) {
    console.log(`✗ ${verifyFailures} verification failure(s). Aborting — not applying anything.`);
    await pool.end();
    process.exit(1);
  }

  console.log(`✓ All verifications passed. ${updates.length} row(s) to update.`);

  if (!apply) {
    console.log(`\nDry run only. Re-run with --apply to commit.`);
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const u of updates) {
      const sets: string[] = [];
      const values: unknown[] = [u.slug];
      if (u.iosUrl !== undefined) {
        sets.push(`app_store_url = $${values.length + 1}`);
        values.push(u.iosUrl);
      }
      if (u.androidUrl !== undefined) {
        sets.push(`play_store_url = $${values.length + 1}`);
        values.push(u.androidUrl);
      }
      if (sets.length === 0) continue;
      sets.push("updated_at = NOW()");
      await client.query(`UPDATE games SET ${sets.join(", ")} WHERE slug = $1`, values);
    }
    await client.query("COMMIT");
    console.log(`\n✓ Committed ${updates.length} updates.`);
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
