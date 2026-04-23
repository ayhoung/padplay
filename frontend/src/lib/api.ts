import type {
  CategoriesResponse,
  Game,
  GameCategory,
  GameSort,
  GamesResponse,
  PlatformFilter,
} from "@padplay/shared-types";

const API_BASE = process.env.BACKEND_URL ?? "http://localhost:6004";

async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API ${path} → ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function fetchGames(opts: {
  category?: GameCategory;
  platform?: PlatformFilter;
  sort?: GameSort;
  limit?: number;
} = {}): Promise<GamesResponse> {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.platform) params.set("platform", opts.platform);
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString();
  return apiGet<GamesResponse>(`/api/games${qs ? `?${qs}` : ""}`);
}

export async function fetchGame(slug: string): Promise<Game | null> {
  try {
    return await apiGet<Game>(`/api/games/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  return apiGet<CategoriesResponse>("/api/categories");
}
