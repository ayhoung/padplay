import type { Metadata } from "next";
import {
  GAME_CATEGORIES,
  type GameCategory,
  type PlatformFilter,
} from "@padplay/shared-types";
import { fetchGames } from "@/lib/api";
import { LeaderboardFilters } from "@/components/leaderboard/LeaderboardFilters";
import { GameCard } from "@/components/leaderboard/GameCard";
import { Pagination } from "@/components/leaderboard/Pagination";
import { AdSlot } from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  description:
    "The leaderboard of games genuinely built for tablets — not stretched iPhone apps. Updated regularly with fresh tablet-first picks.",
};

const PAGE_SIZE = 20;

interface HomeProps {
  searchParams: { category?: string; platform?: string; page?: string };
}

function parseCategory(value: string | undefined): GameCategory | null {
  if (!value) return null;
  return (GAME_CATEGORIES as string[]).includes(value)
    ? (value as GameCategory)
    : null;
}

function parsePlatform(value: string | undefined): PlatformFilter | null {
  if (value === "ios" || value === "android") return value;
  return null;
}

function parsePage(value: string | undefined): number {
  const n = value ? parseInt(value, 10) : 1;
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

export default async function Home({ searchParams }: HomeProps) {
  const category = parseCategory(searchParams.category);
  const platform = parsePlatform(searchParams.platform);
  const page = parsePage(searchParams.page);
  const offset = (page - 1) * PAGE_SIZE;

  let games: Awaited<ReturnType<typeof fetchGames>>["games"] = [];
  let total = 0;
  let fetchError: string | null = null;
  try {
    const result = await fetchGames({
      category: category ?? undefined,
      platform: platform ?? undefined,
      sort: "score",
      limit: PAGE_SIZE,
      offset,
    });
    games = result.games;
    total = result.total;
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load games";
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function buildPageHref(p: number): string {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (platform) params.set("platform", platform);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

  const rangeStart = total === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + games.length, total);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <section className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Games built for tablets.
        </h1>
        <p className="mt-2 text-slate-600 max-w-2xl">
          We score how well each game actually uses your iPad or Android tablet
          — not just whether it runs. Zero tolerance for stretched iPhone apps.
        </p>
      </section>

      <div className="mb-6">
        <AdSlot slot="1111111111" format="horizontal" className="mb-6" minHeight={90} />
        <LeaderboardFilters activeCategory={category} activePlatform={platform} />
      </div>

      {fetchError && (
        <div
          role="alert"
          className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          Couldn&apos;t reach the backend: {fetchError}
        </div>
      )}

      {!fetchError && total === 0 && (
        <div className="rounded border border-slate-200 bg-white p-8 text-center text-slate-500">
          No games match that filter.
        </div>
      )}

      {!fetchError && total > 0 && (
        <>
          <p className="mb-3 text-sm text-slate-500">
            Showing <strong>{rangeStart}</strong>–<strong>{rangeEnd}</strong> of{" "}
            <strong>{total}</strong>
          </p>
          <ol className="space-y-3">
            {games.map((game, idx) => {
              const rank = offset + idx + 1;
              return (
                <li key={game.slug}>
                  <GameCard game={game} rank={rank} />
                  {idx === 4 && page === 1 && (
                    <div className="py-4">
                      <AdSlot slot="2222222222" format="auto" minHeight={250} />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={buildPageHref}
          />
        </>
      )}
    </div>
  );
}
