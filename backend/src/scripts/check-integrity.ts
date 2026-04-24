import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pool } from "../lib/db";
import {
  extractAndroidAppId,
  extractIosTrackId,
  itunesLookup,
  loadGplay,
} from "../lib/enrich";
import { isSameGame } from "../lib/similarity";

type Status = "OK" | "MISMATCH" | "MISSING" | "ABSENT" | "ERROR";

interface PlatformReport {
  status: Status;
  url: string | null;
  externalId: string | null;
  remoteTitle: string | null;
  remoteDeveloper: string | null;
  similarity: number | null;
  note: string | null;
}

interface GameReport {
  slug: string;
  dbTitle: string;
  dbDeveloper: string;
  platforms: string;
  ios: PlatformReport;
  android: PlatformReport;
}

interface Row {
  slug: string;
  title: string;
  developer: string;
  platforms: string;
  app_store_url: string | null;
  play_store_url: string | null;
}

function compareTitles(
  dbTitle: string,
  remoteTitle: string,
  dbDeveloper: string | null,
  remoteDeveloper: string | null,
): { ok: boolean; similarity: number } {
  const r = isSameGame({ dbTitle, remoteTitle, dbDeveloper, remoteDeveloper });
  return { ok: r.ok, similarity: r.confidence };
}

async function checkIos(row: Row): Promise<PlatformReport> {
  const url = row.app_store_url;
  if (!url) {
    return {
      status: "ABSENT",
      url: null,
      externalId: null,
      remoteTitle: null,
      remoteDeveloper: null,
      similarity: null,
      note: null,
    };
  }

  const trackId = extractIosTrackId(url);
  if (!trackId) {
    return {
      status: "ERROR",
      url,
      externalId: null,
      remoteTitle: null,
      remoteDeveloper: null,
      similarity: null,
      note: "Could not extract trackId from URL",
    };
  }

  try {
    const result = await itunesLookup(trackId);
    if (!result || !result.trackName) {
      return {
        status: "MISSING",
        url,
        externalId: trackId,
        remoteTitle: null,
        remoteDeveloper: null,
        similarity: null,
        note: "iTunes lookup returned no result (removed/region-locked?)",
      };
    }
    const remoteDev = result.sellerName ?? result.artistName ?? null;
    const { ok, similarity } = compareTitles(
      row.title,
      result.trackName,
      row.developer,
      remoteDev,
    );
    return {
      status: ok ? "OK" : "MISMATCH",
      url,
      externalId: trackId,
      remoteTitle: result.trackName,
      remoteDeveloper: remoteDev,
      similarity,
      note: null,
    };
  } catch (err) {
    return {
      status: "ERROR",
      url,
      externalId: trackId,
      remoteTitle: null,
      remoteDeveloper: null,
      similarity: null,
      note: err instanceof Error ? err.message : String(err),
    };
  }
}

async function checkAndroid(row: Row): Promise<PlatformReport> {
  const url = row.play_store_url;
  if (!url) {
    return {
      status: "ABSENT",
      url: null,
      externalId: null,
      remoteTitle: null,
      remoteDeveloper: null,
      similarity: null,
      note: null,
    };
  }

  const appId = extractAndroidAppId(url);
  if (!appId) {
    return {
      status: "ERROR",
      url,
      externalId: null,
      remoteTitle: null,
      remoteDeveloper: null,
      similarity: null,
      note: "Could not extract appId from URL",
    };
  }

  try {
    const { app } = await loadGplay();
    const r = await app({ appId, country: "us" });
    if (!r.title) {
      return {
        status: "MISSING",
        url,
        externalId: appId,
        remoteTitle: null,
        remoteDeveloper: null,
        similarity: null,
        note: "Play Store lookup returned no title",
      };
    }
    const { ok, similarity } = compareTitles(
      row.title,
      r.title,
      row.developer,
      r.developer ?? null,
    );
    return {
      status: ok ? "OK" : "MISMATCH",
      url,
      externalId: appId,
      remoteTitle: r.title,
      remoteDeveloper: r.developer ?? null,
      similarity,
      note: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // google-play-scraper throws when an app isn't found
    const notFound = /not found|404/i.test(msg);
    return {
      status: notFound ? "MISSING" : "ERROR",
      url,
      externalId: appId,
      remoteTitle: null,
      remoteDeveloper: null,
      similarity: null,
      note: msg,
    };
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function shortSim(sim: number | null): string {
  return sim === null ? "—" : sim.toFixed(2);
}

function fmtPlatform(label: string, p: PlatformReport, dbTitle: string, dbDev: string): string {
  if (p.status === "OK") return `  ${label.padEnd(8)} OK    ${shortSim(p.similarity)}   store="${p.remoteTitle}"`;
  if (p.status === "ABSENT") return `  ${label.padEnd(8)} ABSENT`;
  if (p.status === "MISMATCH") {
    return (
      `  ${label.padEnd(8)} MISMATCH sim=${shortSim(p.similarity)}\n` +
      `           db    = "${dbTitle}" (${dbDev})\n` +
      `           store = "${p.remoteTitle}" (${p.remoteDeveloper ?? "?"})\n` +
      `           url   = ${p.url}`
    );
  }
  if (p.status === "MISSING") return `  ${label.padEnd(8)} MISSING  ${p.note ?? ""}\n           url = ${p.url}`;
  return `  ${label.padEnd(8)} ERROR    ${p.note ?? ""}`;
}

async function main() {
  const onlySlug = process.argv[2]?.startsWith("--slug=")
    ? process.argv[2].slice("--slug=".length)
    : null;

  const { rows } = await pool.query<Row>(
    onlySlug
      ? `SELECT slug, title, developer, platforms, app_store_url, play_store_url
           FROM games WHERE slug = $1`
      : `SELECT slug, title, developer, platforms, app_store_url, play_store_url
           FROM games ORDER BY slug`,
    onlySlug ? [onlySlug] : [],
  );

  if (rows.length === 0) {
    console.log(onlySlug ? `No game with slug "${onlySlug}".` : "No games in DB.");
    await pool.end();
    return;
  }

  console.log(`Checking integrity for ${rows.length} game${rows.length === 1 ? "" : "s"}…\n`);

  const reports: GameReport[] = [];
  let mismatches = 0;
  let missing = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const [ios, android] = await Promise.all([checkIos(row), checkAndroid(row)]);

    const report: GameReport = {
      slug: row.slug,
      dbTitle: row.title,
      dbDeveloper: row.developer,
      platforms: row.platforms,
      ios,
      android,
    };
    reports.push(report);

    const worst =
      [ios.status, android.status].includes("MISMATCH")
        ? "MISMATCH"
        : [ios.status, android.status].includes("MISSING")
          ? "MISSING"
          : [ios.status, android.status].includes("ERROR")
            ? "ERROR"
            : "OK";

    if (worst === "MISMATCH") mismatches += 1;
    if (worst === "MISSING") missing += 1;
    if (worst === "ERROR") errors += 1;

    const header = `[${String(i + 1).padStart(3)}/${rows.length}] ${worst.padEnd(8)} ${row.slug}`;
    if (worst === "OK") {
      console.log(header);
    } else {
      console.log(`\n${header}`);
      console.log(fmtPlatform("iOS", ios, row.title, row.developer));
      console.log(fmtPlatform("Android", android, row.title, row.developer));
    }

    await sleep(500);
  }

  const reportPath = resolve(
    __dirname,
    "..",
    "..",
    "tmp",
    `integrity-report-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
  );
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(
    reportPath,
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        total: rows.length,
        mismatches,
        missing,
        errors,
        reports,
      },
      null,
      2,
    ),
  );

  console.log(
    `\nDone. ${mismatches} mismatch(es), ${missing} missing, ${errors} error(s) across ${rows.length} games.`,
  );
  console.log(`Full report: ${reportPath}`);

  await pool.end();

  if (mismatches > 0 || missing > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
