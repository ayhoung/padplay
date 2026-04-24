import type { UserQuote } from "@padplay/shared-types";
import { isSameGame } from "./similarity";

export { normalize } from "./similarity";

export type GplayAppFn = (opts: { appId: string; country?: string }) => Promise<{
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
  genre?: string;
  released?: string;
  summary?: string;
  description?: string;
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
    icon?: string;
    url?: string;
  }>
>;

interface Gplay {
  app: GplayAppFn;
  search: GplaySearchFn;
}

let gplay: Gplay | null = null;

export async function loadGplay(): Promise<Gplay> {
  if (gplay) return gplay;
  const mod = (await import("google-play-scraper")) as any;
  const ns = mod.default ?? mod;
  if (typeof ns.app !== "function" || typeof ns.search !== "function") {
    throw new Error("google-play-scraper: missing app/search exports");
  }
  gplay = { app: ns.app, search: ns.search };
  return gplay;
}

export interface ITunesResult {
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
  description?: string;
  primaryGenreName?: string;
  releaseDate?: string;
}

export function extractIosTrackId(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/\/id(\d+)/);
  return m ? m[1] : null;
}

export function extractAndroidAppId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).searchParams.get("id");
  } catch {
    return null;
  }
}

export async function itunesLookup(trackId: string): Promise<ITunesResult | null> {
  const res = await fetch(
    `https://itunes.apple.com/lookup?id=${trackId}&country=us`,
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { resultCount: number; results: ITunesResult[] };
  return data.results?.[0] ?? null;
}

export async function itunesSearch(
  title: string,
  developer?: string | null,
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
        dbDeveloper: developer ?? null,
        remoteDeveloper: r.sellerName ?? r.artistName ?? null,
      }).ok,
  );
  // Deliberately NO `?? results[0]` fallback — that's what let wrong games
  // overwrite correct URLs. If no result passes strict match, return null.
  return match ?? null;
}

interface ITunesReview {
  "im:rating": { label: string };
  author: { name: { label: string } };
  title: { label: string };
  content: { label: string };
  updated?: { label: string };
}

export async function fetchIosReviews(
  trackId: string,
  filterTabletOnly = true,
): Promise<UserQuote[]> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/us/rss/customerreviews/id=${trackId}/sortby=mostrecent/json`,
      { headers: { "User-Agent": "padplay-crawler/1.0" } },
    );
    if (!res.ok) return [];
    const data: any = await res.json();
    const entries: ITunesReview[] = data?.feed?.entry ?? [];
    const reviews = entries.filter((e) => e?.["im:rating"]?.label);
    const quotes: UserQuote[] = [];
    for (const r of reviews) {
      const text = r.content?.label ?? "";
      if (filterTabletOnly && !/\b(ipad|tablet|big\s*screen|pro)\b/i.test(text)) continue;
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

export interface EnrichedData {
  iosTrackId: string | null;
  title: string | null;
  developer: string | null;
  shortDescription: string | null;
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
  genre: string | null;
  quotes: UserQuote[];
}

/**
 * Enrich a submission from App Store and/or Play Store URLs.
 * Returns best-effort data — fields that couldn't be resolved are left null.
 */
export async function enrichFromStoreUrls(opts: {
  appStoreUrl?: string | null;
  playStoreUrl?: string | null;
}): Promise<EnrichedData> {
  const out: EnrichedData = {
    iosTrackId: null,
    title: null,
    developer: null,
    shortDescription: null,
    iconUrl: null,
    appStoreUrl: opts.appStoreUrl ?? null,
    playStoreUrl: opts.playStoreUrl ?? null,
    screenshots: [],
    iosRating: null,
    iosRatingCount: null,
    androidRating: null,
    androidRatingCount: null,
    priceUsd: null,
    releaseYear: null,
    genre: null,
    quotes: [],
  };

  // iOS lookup
  const iosId = extractIosTrackId(opts.appStoreUrl);
  let iosResult: ITunesResult | null = null;
  if (iosId) {
    iosResult = await itunesLookup(iosId);
  }
  if (iosResult) {
    out.iosTrackId = iosResult.trackId ? String(iosResult.trackId) : iosId;
    out.title ??= iosResult.trackName ?? null;
    out.developer ??= iosResult.sellerName ?? iosResult.artistName ?? null;
    out.iconUrl ??= iosResult.artworkUrl512 ?? iosResult.artworkUrl100 ?? null;
    out.appStoreUrl = iosResult.trackViewUrl ?? out.appStoreUrl;
    out.iosRating = iosResult.averageUserRating ?? null;
    out.iosRatingCount = iosResult.userRatingCount ?? null;
    out.screenshots = [
      ...(iosResult.ipadScreenshotUrls ?? []),
      ...(iosResult.screenshotUrls ?? []),
    ].slice(0, 8);
    if (typeof iosResult.price === "number") out.priceUsd = iosResult.price;
    out.genre = iosResult.primaryGenreName ?? null;
    if (iosResult.releaseDate) {
      const y = new Date(iosResult.releaseDate).getFullYear();
      if (Number.isFinite(y)) out.releaseYear = y;
    }
    if (iosResult.description) {
      out.shortDescription ??= iosResult.description.split("\n")[0].slice(0, 280);
    }
    if (out.iosTrackId) {
      // For submissions, don't filter to tablet-only — they're just previews
      out.quotes = await fetchIosReviews(out.iosTrackId, true);
    }
  }

  // Android lookup
  const androidId = extractAndroidAppId(opts.playStoreUrl);
  if (androidId) {
    try {
      const { app } = await loadGplay();
      const r = await app({ appId: androidId, country: "us" });
      out.title ??= r.title ?? null;
      out.developer ??= r.developer ?? null;
      out.iconUrl ??= r.icon ?? null;
      out.playStoreUrl = r.url ?? out.playStoreUrl ??
        `https://play.google.com/store/apps/details?id=${androidId}`;
      out.androidRating = r.score ?? null;
      out.androidRatingCount = r.ratings ?? null;
      if (out.screenshots.length === 0 && r.screenshots?.length) {
        out.screenshots = r.screenshots.slice(0, 8);
      }
      if (out.priceUsd === null) {
        out.priceUsd = r.free ? 0 : typeof r.price === "number" ? r.price : null;
      }
      out.shortDescription ??= (r.summary ?? r.description ?? "").split("\n")[0].slice(0, 280) || null;
      out.genre ??= r.genre ?? null;
      if (out.releaseYear === null && r.released) {
        const y = new Date(r.released).getFullYear();
        if (Number.isFinite(y)) out.releaseYear = y;
      }
    } catch {
      // Ignore — partial data is acceptable
    }
  }

  return out;
}

/** Inferred from genre string from iTunes/Play. Coarse mapping. */
export function guessCategory(genre: string | null): string {
  if (!genre) return "strategy";
  const g = genre.toLowerCase();
  if (/rpg|role/.test(g)) return "rpg";
  if (/puzzle|word|trivia/.test(g)) return "puzzle";
  if (/board|card|casino/.test(g)) return "board";
  if (/simulation|sim|build|farm/.test(g)) return "simulation";
  if (/action|arcade|shoot|race|sport|adventure/.test(g)) return "action";
  return "strategy";
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
