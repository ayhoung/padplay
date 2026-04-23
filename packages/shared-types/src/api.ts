import type { Game, GameCategory } from "./game";

export interface CategoryCount {
  category: GameCategory;
  count: number;
}

export type GameSort = "score" | "title";

/** Filter by store availability. "ios" shows iOS-only + both; "android" shows Android-only + both. */
export type PlatformFilter = "ios" | "android";

export interface GameListQuery {
  category?: GameCategory;
  platform?: PlatformFilter;
  sort?: GameSort;
  limit?: number;
}

export interface ApiError {
  error: string;
  message: string;
}

export type GamesResponse = Game[];
export type GameResponse = Game;
export type CategoriesResponse = CategoryCount[];
