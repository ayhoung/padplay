import "dotenv/config";
import { pool } from "../lib/db";
import { isSameGame } from "../lib/similarity";
import type { UserQuote } from "@padplay/shared-types";

type GplayAppFn = (opts: { appId: string; country?: string }) => Promise<{
  score?: number;
  ratings?: number;
  icon?: string;
  title?: string;
  developer?: string;
  url?: string;
  appId?: string;
  price?: number;
  priceText?: string;
  free?: boolean;
  screenshots?: string[];
}>;

type GplaySearchFn = (opts: {
  term: string;
  num?: number;
  country?: string;
}) => Promise<
  Array<{
    appId: string;
    title: string;
    developer: string;
    score?: number;
    scoreText?: string;
    icon?: string;
    url?: string;
  }>
>;

interface Gplay {
  app: GplayAppFn;
  search: GplaySearchFn;
}

let gplay: Gplay | null = null;

async function loadGplay(): Promise<Gplay> {
  if (gplay) return gplay;
  const mod = (await import("google-play-scraper")) as any;
  const ns = mod.default ?? mod;
  if (typeof ns.app !== "function" || typeof ns.search !== "function") {
    throw new Error("google-play-scraper: missing app/search exports");
  }
  gplay = { app: ns.app, search: ns.search };
  return gplay;
}

interface ITunesResult {
  trackId?: number;
  trackName?: string;
  sellerName?: string;
  artistName?: string;
  trackViewUrl?: string;
  averageUserRating?: number;
  userRatingCount?: number;
  artworkUrl512?: string;
  artworkUrl100?: string;
  ipadScreenshotUrls?: string[];
  screenshotUrls?: string[];
  price?: number;
  formattedPrice?: string;
}

function extractIosTrackId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/id(\d+)/);
  return m ? m[1] : null;
}

function extractAndroidAppId(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get("id");
  } catch {
    return null;
  }
}

async function itunesLookup(trackId: string): Promise<ITunesResult | null> {
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${trackId}&country=us`,
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { resultCount: number; results: ITunesResult[] };
  return data.results?.[0] ?? null;
}

async function itunesSearch(
  title: string,
  developer: string,
): Promise<ITunesResult | null> {
  const q = encodeURIComponent(title);
  const res = await fetch(
    `https://itunes.apple.com/search?term=${q}&entity=software&country=us&limit=5`,
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { resultCount: number; results: ITunesResult[] };
  const results = data.results ?? [];
  const match = results.find(
    (r) =>
      r.trackName &&
      isSameGame({
        dbTitle: title,
        remoteTitle: r.trackName,
        dbDeveloper: developer,
        remoteDeveloper: r.sellerName ?? r.artistName ?? null,
      }).ok,
  );
  // No `?? results[0]` fallback: accepting a random top hit is how wrong
  // games (Diablo Immortal, WHAT THE GOLF?, etc.) clobbered correct URLs.
  return match ?? null;
}

interface ITunesReview {
  "im:rating": { label: string };
  author: { name: { label: string } };
  title: { label: string };
  content: { label: string };
  updated?: { label: string };
}

async function fetchIosReviews(trackId: string): Promise<UserQuote[]> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/us/rss/customerreviews/id=${trackId}/sortby=mostrecent/json`,
      { headers: { "User-Agent": "padplay-crawler/1.0" } },
    );
    if (!res.ok) return [];
    const data: any = await res.json();
    const entries: ITunesReview[] = data?.feed?.entry ?? [];
    // First entry is the app metadata; skip it. Each real review has im:rating.
    const reviews = entries.filter((e) => e?.["im:rating"]?.label);
    const quotes: UserQuote[] = [];
    for (const r of reviews) {
      const text = r.content?.label ?? "";
      // Prefer reviews that actually talk about tablet experience
      const mentionsTablet = /\b(ipad|tablet|big\s*screen|pro)\b/i.test(text);
      if (!mentionsTablet) continue;
      quotes.push({
        author: r.author?.name?.label ?? "Anonymous",
        text: text.replace(/\s+/g, " ").trim(),
        rating: Number(r["im:rating"].label) || null,
        date: r.updated?.label ?? null,
        source: "app_store",
      });
      if (quotes.length >= 5) break;
    }
    return quotes;
  } catch {
    return [];
  }
}

interface PlatformData {
  rating: number | null;
  ratingCount: number | null;
  iconUrl: string | null;
  url: string | null;
  price: number | null;
  screenshots: string[];
  reviews: UserQuote[];
}

async function fetchIos(
  existingUrl: string | null,
  title: string,
  developer: string,
): Promise<PlatformData | null> {
  let result: ITunesResult | null = null;
  const trackId = extractIosTrackId(existingUrl);
  if (trackId) {
    const looked = await itunesLookup(trackId);
    const match = looked?.trackName
      ? isSameGame({
          dbTitle: title,
          remoteTitle: looked.trackName,
          dbDeveloper: developer,
          remoteDeveloper: looked.sellerName ?? looked.artistName ?? null,
        })
      : null;
    if (match?.ok) {
      result = looked;
      if (!looked?.averageUserRating && !looked?.userRatingCount) {
        // We have the right product but stale ratings — refresh from search.
        const searched = await itunesSearch(title, developer);
        if (searched) result = searched;
      }
    } else {
      // Stored trackId resolves to a different product (or nothing). Try
      // to recover by searching, but isSameGame inside itunesSearch will
      // reject anything that doesn't match on title+developer.
      result = await itunesSearch(title, developer);
    }
  } else {
    result = await itunesSearch(title, developer);
  }
  if (!result) return null;

  const foundTrackId = result.trackId ? String(result.trackId) : null;
  const reviews = foundTrackId ? await fetchIosReviews(foundTrackId) : [];

  const screenshots = [
    ...(result.ipadScreenshotUrls ?? []),
    ...(result.screenshotUrls ?? []),
  ].slice(0, 8);

  return {
    rating: result.averageUserRating ?? null,
    ratingCount: result.userRatingCount ?? null,
    iconUrl: result.artworkUrl512 ?? result.artworkUrl100 ?? null,
    url: result.trackViewUrl ?? null,
    price: typeof result.price === "number" ? result.price : null,
    screenshots,
    reviews,
  };
}

async function fetchAndroid(
  existingUrl: string | null,
  title: string,
  developer: string,
): Promise<PlatformData | null> {
  const { app, search } = await loadGplay();
  const appId = extractAndroidAppId(existingUrl);

  const hydrate = async (id: string): Promise<PlatformData | null> => {
    try {
      const r = await app({ appId: id, country: "us" });
      if (!r.title) return null;
      const match = isSameGame({
        dbTitle: title,
        remoteTitle: r.title,
        dbDeveloper: developer,
        remoteDeveloper: r.developer ?? null,
      });
      if (!match.ok) return null;
      return {
        rating: r.score ?? null,
        ratingCount: r.ratings ?? null,
        iconUrl: r.icon ?? null,
        url: r.url ?? `https://play.google.com/store/apps/details?id=${id}`,
        price: r.free ? 0 : typeof r.price === "number" ? r.price : null,
        screenshots: (r.screenshots ?? []).slice(0, 8),
        reviews: [], // Play Store reviews scraping is flaky; skip for now
      };
    } catch {
      return null;
    }
  };

  if (appId) {
    const direct = await hydrate(appId);
    if (direct) return direct;
  }

  try {
    const results = await search({ term: `${title} ${developer}`, num: 5, country: "us" });
    const match =
      results.find(
        (r) =>
          isSameGame({
            dbTitle: title,
            remoteTitle: r.title,
            dbDeveloper: developer,
            remoteDeveloper: r.developer,
          }).ok,
      ) ?? null;
    if (!match) return null;
    return await hydrate(match.appId);
  } catch {
    return null;
  }
}

function mergeQuotes(ios: PlatformData | null, android: PlatformData | null): UserQuote[] {
  const all = [...(ios?.reviews ?? []), ...(android?.reviews ?? [])];
  // Dedupe by author+text prefix
  const seen = new Set<string>();
  const out: UserQuote[] = [];
  for (const q of all) {
    const key = `${q.author}::${q.text.slice(0, 40)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
    if (out.length >= 5) break;
  }
  return out;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { rows } = await pool.query<{
    slug: string;
    title: string;
    developer: string;
    platforms: string;
    app_store_url: string | null;
    play_store_url: string | null;
  }>(
    `SELECT slug, title, developer, platforms, app_store_url, play_store_url
       FROM games ORDER BY slug`,
  );

  console.log(`Refreshing ratings/screenshots/quotes/price for ${rows.length} games…\n`);

  for (const row of rows) {
    const wantIos = row.platforms !== "android";
    const wantAndroid = row.platforms !== "ios";

    const [ios, android] = await Promise.all([
      wantIos ? fetchIos(row.app_store_url, row.title, row.developer) : Promise.resolve(null),
      wantAndroid
        ? fetchAndroid(row.play_store_url, row.title, row.developer)
        : Promise.resolve(null),
    ]);

    const iconUrl = ios?.iconUrl ?? android?.iconUrl ?? null;
    const screenshots = ios?.screenshots?.length
      ? ios.screenshots
      : (android?.screenshots ?? []);
    const quotes = mergeQuotes(ios, android);

    const newAppStoreUrl = wantIos ? (ios?.url ?? null) : row.app_store_url;
    const newPlayStoreUrl = wantAndroid ? (android?.url ?? null) : row.play_store_url;

    // Prefer a real price. If both platforms report 0 or free, keep the seed value.
    let price: number | null | undefined = undefined;
    if (ios?.price !== null && ios?.price !== undefined) price = ios.price;
    else if (android?.price !== null && android?.price !== undefined) price = android.price;

    await pool.query(
      `UPDATE games SET
         app_store_url        = $2,
         play_store_url       = $3,
         ios_rating           = $4,
         ios_rating_count     = $5,
         android_rating       = $6,
         android_rating_count = $7,
         icon_url             = COALESCE($8, icon_url),
         screenshots          = CASE WHEN $9::text[] = '{}' THEN screenshots ELSE $9 END,
         quotes               = CASE WHEN jsonb_array_length($10::jsonb) = 0 THEN quotes ELSE $10 END,
         price_usd            = COALESCE($11, price_usd),
         price_updated_at     = CASE WHEN $11 IS NOT NULL THEN NOW() ELSE price_updated_at END,
         ratings_updated_at   = NOW(),
         updated_at           = NOW()
       WHERE slug = $1`,
      [
        row.slug,
        newAppStoreUrl,
        newPlayStoreUrl,
        ios?.rating ?? null,
        ios?.ratingCount ?? null,
        android?.rating ?? null,
        android?.ratingCount ?? null,
        iconUrl,
        screenshots,
        JSON.stringify(quotes),
        price === undefined ? null : price,
      ],
    );

    const iosLabel = !wantIos
      ? "no iOS"
      : ios?.rating
        ? `iOS ${ios.rating.toFixed(1)}`
        : ios
          ? "iOS (no rating)"
          : "iOS miss";
    const andLabel = !wantAndroid
      ? "no Android"
      : android?.rating
        ? `Android ${android.rating.toFixed(1)}`
        : android
          ? "Android (no rating)"
          : "Android miss";
    const shots = `${screenshots.length}sc`;
    const q = `${quotes.length}q`;
    const p = price !== undefined && price !== null ? `$${price}` : "—";
    console.log(`  ✓ ${row.title} — ${iosLabel} | ${andLabel} | ${shots} ${q} ${p}`);

    await sleep(500);
  }

  console.log(`\nDone.`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
