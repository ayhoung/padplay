export type GameCategory =
  | "strategy"
  | "puzzle"
  | "rpg"
  | "simulation"
  | "board"
  | "action";

export type Platform = "ios" | "android" | "both";

export interface UserQuote {
  author: string;
  text: string;
  rating: number | null;
  date: string | null;
  source: "app_store" | "play_store" | "reddit";
}

export interface Game {
  slug: string;
  title: string;
  developer: string;
  category: GameCategory;
  platforms: Platform;
  tabletScore: number;
  priceUsd: number | null;
  priceUpdatedAt: string | null;
  shortDescription: string;
  tabletFeatures: string[];
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  thumbnail: string;
  iconUrl: string | null;
  screenshots: string[];
  quotes: UserQuote[];
  iosRating: number | null;
  iosRatingCount: number | null;
  androidRating: number | null;
  androidRatingCount: number | null;
  ratingsUpdatedAt: string | null;
  releaseYear: number;
  createdAt: string;
  updatedAt: string;
}

export const GAME_CATEGORIES: GameCategory[] = [
  "strategy",
  "puzzle",
  "rpg",
  "simulation",
  "board",
  "action",
];

export const CATEGORY_LABELS: Record<GameCategory, string> = {
  strategy: "Strategy",
  puzzle: "Puzzle",
  rpg: "RPG",
  simulation: "Simulation",
  board: "Board",
  action: "Action",
};
