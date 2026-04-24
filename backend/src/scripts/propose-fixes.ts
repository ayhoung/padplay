import "dotenv/config";
import { pool } from "../lib/db";
import { itunesLookup, loadGplay } from "../lib/enrich";
import { devSimilarity, jaccard, tokenize } from "../lib/similarity";

interface Row {
  slug: string;
  title: string;
  developer: string;
  platforms: string;
  app_store_url: string | null;
  play_store_url: string | null;
}

interface Candidate {
  title: string;
  developer: string;
  id: string; // trackId or appId
  url: string;
  titleSim: number;
  devSim: number;
  score: number;
}

async function itunesSearchMany(term: string, limit = 10): Promise<any[]> {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=software&country=us&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as { results: any[] };
  return data.results ?? [];
}

async function rankIosCandidates(row: Row): Promise<Candidate[]> {
  const queries = [row.title, `${row.title} ${row.developer.split(/[/,&]/)[0].trim()}`];
  const results: any[] = [];
  const seen = new Set<number>();
  for (const q of queries) {
    const r = await itunesSearchMany(q, 10);
    for (const item of r) {
      if (!item.trackId || seen.has(item.trackId)) continue;
      seen.add(item.trackId);
      results.push(item);
    }
  }

  const cands: Candidate[] = [];
  for (const r of results) {
    const title = r.trackName ?? "";
    const dev = r.sellerName ?? r.artistName ?? "";
    const titleSim = jaccard(tokenize(row.title), tokenize(title));
    const devSim = devSimilarity(row.developer, dev);
    const score = titleSim * 0.5 + devSim * 0.5;
    cands.push({
      title,
      developer: dev,
      id: String(r.trackId),
      url: r.trackViewUrl ?? `https://apps.apple.com/us/app/id${r.trackId}`,
      titleSim,
      devSim,
      score,
    });
  }
  cands.sort((a, b) => b.score - a.score);
  return cands.slice(0, 5);
}

async function rankAndroidCandidates(row: Row): Promise<Candidate[]> {
  const { search } = await loadGplay();
  const queries = [row.title, `${row.title} ${row.developer.split(/[/,&]/)[0].trim()}`];
  const seen = new Set<string>();
  const results: Array<{ appId: string; title: string; developer: string; url?: string }> = [];
  for (const q of queries) {
    try {
      const r = await search({ term: q, num: 10, country: "us" });
      for (const item of r) {
        if (seen.has(item.appId)) continue;
        seen.add(item.appId);
        results.push(item);
      }
    } catch {
      // search failures are non-fatal
    }
  }

  const cands: Candidate[] = [];
  for (const r of results) {
    const titleSim = jaccard(tokenize(row.title), tokenize(r.title ?? ""));
    const devSim = devSimilarity(row.developer, r.developer ?? "");
    const score = titleSim * 0.5 + devSim * 0.5;
    cands.push({
      title: r.title ?? "",
      developer: r.developer ?? "",
      id: r.appId,
      url: r.url ?? `https://play.google.com/store/apps/details?id=${r.appId}`,
      titleSim,
      devSim,
      score,
    });
  }
  cands.sort((a, b) => b.score - a.score);
  return cands.slice(0, 5);
}

function fmtCand(c: Candidate, i: number): string {
  const mark = c.devSim >= 0.8 && c.titleSim >= 0.5 ? "✓" : " ";
  return (
    `    ${mark} [${i}] score=${c.score.toFixed(2)}  titleSim=${c.titleSim.toFixed(2)}  devSim=${c.devSim.toFixed(2)}\n` +
    `        title="${c.title}"  dev="${c.developer}"\n` +
    `        url=${c.url}`
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  // Slugs to investigate — 14 bad + 4 likely-false-positives from the audit.
  const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const defaultSlugs = [
    // bad — totally wrong apps
    "divinity-original-sin-2",
    "hades",
    "disco-elysium",
    "inkulinati",
    "sayonara-wild-hearts",
    "root-board-game",
    "two-point-hospital",
    "fantasian-neo-dimension",
    "gloomhaven",
    "alto-odyssey",
    "florence",
    "pocket-city",
    "wingspan",
    "dead-cells",
    // likely-false-positive (same game, listing differs)
    "civilization-vi",
    "baldurs-gate-enhanced",
    "oceanhorn-2",
  ];
  const targets = slugs.length > 0 ? slugs : defaultSlugs;

  const { rows } = await pool.query<Row>(
    `SELECT slug, title, developer, platforms, app_store_url, play_store_url
       FROM games WHERE slug = ANY($1) ORDER BY slug`,
    [targets],
  );

  for (const row of rows) {
    console.log(`\n━━━ ${row.slug}`);
    console.log(`    db title:     "${row.title}"`);
    console.log(`    db developer: "${row.developer}"`);
    console.log(`    platforms:    ${row.platforms}`);
    console.log(`    current iOS:  ${row.app_store_url ?? "(none)"}`);
    console.log(`    current Play: ${row.play_store_url ?? "(none)"}`);

    const wantIos = row.platforms !== "android";
    const wantAndroid = row.platforms !== "ios";

    if (wantIos) {
      console.log(`\n  iOS candidates:`);
      try {
        const ios = await rankIosCandidates(row);
        if (ios.length === 0) console.log(`    (no results)`);
        ios.forEach((c, i) => console.log(fmtCand(c, i)));
      } catch (err) {
        console.log(`    ERROR: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (wantAndroid) {
      console.log(`\n  Android candidates:`);
      try {
        const android = await rankAndroidCandidates(row);
        if (android.length === 0) console.log(`    (no results)`);
        android.forEach((c, i) => console.log(fmtCand(c, i)));
      } catch (err) {
        console.log(`    ERROR: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    await sleep(400);
  }

  console.log(`\nDone. ✓ = strong candidate (devSim≥0.8 AND titleSim≥0.5).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
