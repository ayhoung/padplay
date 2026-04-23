import type { Game, UserQuote } from "@padplay/shared-types";

type GameRow = {
  slug: string;
  title: string;
  developer: string;
  category: string;
  platforms: string;
  tabletScore: number;
  priceUsd: string | number | null;
  priceUpdatedAt: Date | string | null;
  shortDescription: string;
  tabletFeatures: string[];
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  thumbnail: string;
  iconUrl: string | null;
  screenshots: string[] | null;
  quotes: UserQuote[] | null;
  iosRating: string | number | null;
  iosRatingCount: number | null;
  androidRating: string | number | null;
  androidRatingCount: number | null;
  ratingsUpdatedAt: Date | string | null;
  releaseYear: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function iso(v: Date | string | null): string | null {
  return v === null ? null : new Date(v).toISOString();
}

export function serializeGame(row: GameRow): Game {
  return {
    slug: row.slug,
    title: row.title,
    developer: row.developer,
    category: row.category as Game["category"],
    platforms: row.platforms as Game["platforms"],
    tabletScore: row.tabletScore,
    priceUsd: row.priceUsd === null ? null : Number(row.priceUsd),
    priceUpdatedAt: iso(row.priceUpdatedAt),
    shortDescription: row.shortDescription,
    tabletFeatures: row.tabletFeatures ?? [],
    appStoreUrl: row.appStoreUrl,
    playStoreUrl: row.playStoreUrl,
    thumbnail: row.thumbnail,
    iconUrl: row.iconUrl,
    screenshots: row.screenshots ?? [],
    quotes: row.quotes ?? [],
    iosRating: row.iosRating === null ? null : Number(row.iosRating),
    iosRatingCount: row.iosRatingCount,
    androidRating: row.androidRating === null ? null : Number(row.androidRating),
    androidRatingCount: row.androidRatingCount,
    ratingsUpdatedAt: iso(row.ratingsUpdatedAt),
    releaseYear: row.releaseYear,
    createdAt: iso(row.createdAt)!,
    updatedAt: iso(row.updatedAt)!,
  };
}
