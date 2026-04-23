import type {
  CategoriesResponse,
  Game,
  GameCategory,
  GameSort,
  GamesResponse,
  PlatformFilter,
} from "@padplay/shared-types";

const API_BASE = process.env.BACKEND_URL ?? "http://localhost:6004";

async function apiGet<T>(path: string, init?: RequestInit): Promise<{ data: T; total: number }> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`API ${path} → ${res.status} ${res.statusText}`);
  }
  const totalHeader = res.headers.get("x-total-count");
  const total = totalHeader ? Number(totalHeader) : 0;
  const data = (await res.json()) as T;
  return { data, total };
}

export interface PaginatedGames {
  games: GamesResponse;
  total: number;
}

export async function fetchGames(opts: {
  category?: GameCategory;
  platform?: PlatformFilter;
  sort?: GameSort;
  limit?: number;
  offset?: number;
} = {}): Promise<PaginatedGames> {
  const params = new URLSearchParams();
  if (opts.category) params.set("category", opts.category);
  if (opts.platform) params.set("platform", opts.platform);
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.limit) params.set("limit", String(opts.limit));
  if (opts.offset) params.set("offset", String(opts.offset));
  const qs = params.toString();
  const { data, total } = await apiGet<GamesResponse>(`/api/games${qs ? `?${qs}` : ""}`);
  return { games: data, total };
}

export async function fetchGame(slug: string): Promise<Game | null> {
  try {
    const { data } = await apiGet<Game>(`/api/games/${encodeURIComponent(slug)}`);
    return data;
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  const { data } = await apiGet<CategoriesResponse>("/api/categories");
  return data;
}
