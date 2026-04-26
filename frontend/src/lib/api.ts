import type {
  AdminGrantRoleRequest,
  AdminUpdateRoleRequest,
  AdminUsersListResponse,
  AdminUser,
  CategoriesResponse,
  Game,
  GameCategory,
  GameSort,
  GamesResponse,
  GameCreateRequest,
  GameUpdateRequest,
  PendingSubmission,
  PlatformFilter,
  SubmissionCreateRequest,
  SubmissionEnrichPreview,
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

// -------------- Submissions --------------

export async function previewSubmission(
  urls: { appStoreUrl?: string; playStoreUrl?: string },
): Promise<SubmissionEnrichPreview> {
  const res = await fetch(`/api/submissions/preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(urls),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Preview failed");
  return data as SubmissionEnrichPreview;
}

export async function createSubmission(
  body: SubmissionCreateRequest,
): Promise<{ id: number; status: string; message: string }> {
  const res = await fetch(`/api/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Submission failed");
  return data;
}

// -------------- Admin --------------

function adminHeaders(token: string | null, extra: Record<string, string> = {}): HeadersInit {
  return token ? { Authorization: `Bearer ${token}`, ...extra } : extra;
}

export async function fetchSubmissions(
  token: string | null,
  status: "pending" | "approved" | "rejected" | "all" = "pending",
): Promise<PendingSubmission[]> {
  const res = await fetch(`/api/admin/submissions?status=${status}`, {
    credentials: "include",
    headers: adminHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Load failed");
  return data as PendingSubmission[];
}

export async function approveSubmission(
  token: string | null,
  id: number,
): Promise<{ slug: string; url: string }> {
  const res = await fetch(`/api/admin/submissions/${id}/approve`, {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Approve failed");
  return data;
}

export async function rejectSubmission(
  token: string | null,
  id: number,
  reason: string,
): Promise<void> {
  const res = await fetch(`/api/admin/submissions/${id}/reject`, {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ reason }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Reject failed");
}

export async function fetchAdminUsers(token: string | null): Promise<AdminUser[]> {
  const res = await fetch(`/api/admin/users`, {
    credentials: "include",
    headers: adminHeaders(token),
  });
  const data = (await res.json()) as AdminUsersListResponse & { message?: string };
  if (!res.ok) throw new Error(data.message ?? "Load users failed");
  return data.users;
}

export async function grantAdminRole(
  token: string | null,
  body: AdminGrantRoleRequest,
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/roles`, {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { user?: AdminUser; message?: string };
  if (!res.ok || !data.user) throw new Error(data.message ?? "Grant failed");
  return data.user;
}

export async function updateAdminRole(
  token: string | null,
  id: number,
  body: AdminUpdateRoleRequest,
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    credentials: "include",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as { user?: AdminUser; message?: string };
  if (!res.ok || !data.user) throw new Error(data.message ?? "Update failed");
  return data.user;
}

export async function revokeAdminRole(
  token: string | null,
  id: number,
): Promise<AdminUser> {
  const res = await fetch(`/api/admin/users/${id}/role`, {
    method: "DELETE",
    credentials: "include",
    headers: adminHeaders(token),
  });
  const data = (await res.json()) as { user?: AdminUser; message?: string };
  if (!res.ok || !data.user) throw new Error(data.message ?? "Revoke failed");
  return data.user;
}

export async function createAdminGame(
  token: string | null,
  body: GameCreateRequest,
): Promise<Game> {
  const res = await fetch(`/api/admin/games`, {
    method: "POST",
    credentials: "include",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Create game failed");
  return data;
}

export async function updateAdminGame(
  token: string | null,
  slug: string,
  body: GameUpdateRequest,
): Promise<Game> {
  const res = await fetch(`/api/admin/games/${slug}`, {
    method: "PATCH",
    credentials: "include",
    headers: adminHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Update game failed");
  return data;
}

export async function deleteAdminGame(
  token: string | null,
  slug: string,
): Promise<void> {
  const res = await fetch(`/api/admin/games/${slug}`, {
    method: "DELETE",
    credentials: "include",
    headers: adminHeaders(token),
  });
  if (res.status === 204) return;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Delete game failed");
}

// -------------- Auth --------------

export async function registerUser(email: string, password: string, wantsUpdates: boolean) {
  const res = await fetch(`/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, wantsUpdates }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Registration failed");
  return data.user;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Login failed");
  return data.user;
}

export async function logoutUser() {
  await fetch(`/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function fetchCurrentUser() {
  const res = await fetch(`/api/auth/me`, {
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Not authenticated");
  return data.user;
}
