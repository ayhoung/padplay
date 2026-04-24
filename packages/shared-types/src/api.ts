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

// ---------------- Submissions ----------------

export interface QuestionnaireAnswers {
  /** Native tablet UI, not a stretched phone UI */
  nativeTabletUi: boolean;
  /** Works well in landscape orientation */
  landscapeReady: boolean;
  /** Apple Pencil or stylus support */
  stylusSupport: boolean;
  /** Full offline play supported */
  offlinePlay: boolean;
  /** No dark patterns (no pay-to-win, minimal IAP) */
  cleanMonetization: boolean;
  /** MFi / Bluetooth controller support */
  controllerSupport: boolean;
}

export const QUESTIONNAIRE_ITEMS: Array<{
  key: keyof QuestionnaireAnswers;
  label: string;
  description: string;
}> = [
  {
    key: "nativeTabletUi",
    label: "Native tablet UI",
    description: "Layout, touch targets, and HUD are designed for tablet screens — not a stretched phone UI.",
  },
  {
    key: "landscapeReady",
    label: "Works in landscape",
    description: "Plays comfortably in landscape orientation on tablets.",
  },
  {
    key: "stylusSupport",
    label: "Stylus / Apple Pencil",
    description: "Pencil or stylus input is supported where it matters.",
  },
  {
    key: "offlinePlay",
    label: "Offline play",
    description: "Fully playable without a network connection.",
  },
  {
    key: "cleanMonetization",
    label: "No dark patterns",
    description: "No pay-to-win, no aggressive interstitial ads, minimal IAP.",
  },
  {
    key: "controllerSupport",
    label: "Controller support",
    description: "Works with MFi or Bluetooth controllers.",
  },
];

export interface SubmissionEnrichPreview {
  title: string | null;
  developer: string | null;
  shortDescription: string | null;
  iconUrl: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  screenshots: string[];
  iosRating: number | null;
  androidRating: number | null;
  priceUsd: number | null;
  releaseYear: number | null;
  genre: string | null;
  guessedCategory: GameCategory;
}

export interface SubmissionCreateRequest {
  email: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  answers: QuestionnaireAnswers;
  userPitch: string;
}

export interface PendingSubmission {
  id: number;
  submitterEmail: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  title: string | null;
  developer: string | null;
  category: string | null;
  platforms: string | null;
  shortDescription: string | null;
  iconUrl: string | null;
  screenshots: string[];
  iosRating: number | null;
  iosRatingCount: number | null;
  androidRating: number | null;
  androidRatingCount: number | null;
  priceUsd: number | null;
  releaseYear: number | null;
  questionnaire: QuestionnaireAnswers;
  computedTabletScore: number | null;
  userPitch: string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  approvedSlug: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

// -------------- Admin users / roles --------------

export interface AdminUser {
  id: number;
  email: string;
  wantsUpdates: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export interface AdminUsersListResponse {
  users: AdminUser[];
}

export interface AdminGrantRoleRequest {
  email: string;
}

export interface AdminUpdateRoleRequest {
  isAdmin: boolean;
}
