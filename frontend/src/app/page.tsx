import type { Metadata } from "next";
import {
  GAME_CATEGORIES,
  type GameCategory,
  type PlatformFilter,
} from "@padplay/shared-types";
import { fetchGames } from "@/lib/api";
import { LeaderboardFilters } from "@/components/leaderboard/LeaderboardFilters";
import { GameCard } from "@/components/leaderboard/GameCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { DiscoveryLinks } from "@/components/marketing/DiscoveryLinks";
import { SubmitCta } from "@/components/marketing/SubmitCta";

export const metadata: Metadata = {
  description:
    "The leaderboard of games genuinely built for tablets — not stretched iPhone apps. Updated regularly with fresh tablet-first picks.",
};

interface HomeProps {
  searchParams: { category?: string; platform?: string };
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

export default async function Home({ searchParams }: HomeProps) {
  const category = parseCategory(searchParams.category);
  const platform = parsePlatform(searchParams.platform);

  let games: Awaited<ReturnType<typeof fetchGames>> = [];
  let fetchError: string | null = null;
  try {
    games = await fetchGames({
      category: category ?? undefined,
      platform: platform ?? undefined,
      sort: "score",
    });
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load games";
  }

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

      <div className="mb-8">
        <DiscoveryLinks />
      </div>

      <div className="mb-6">
        <AdSlot slot="1111111111" format="horizontal" className="mb-6" minHeight={90} />
        <LeaderboardFilters activeCategory={category} activePlatform={platform} />
      </div>

      {fetchError && (
        <div
          role="alert"
          className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
        >
          Couldn&apos;t reach the backend at {fetchError}. Start the API with{" "}
          <code className="rounded bg-amber-100 px-1">make dev-backend</code>.
        </div>
      )}

      {!fetchError && games.length === 0 && (
        <div className="rounded border border-slate-200 bg-white p-8 text-center text-slate-500">
          No games match that filter.
        </div>
      )}

      <ol className="space-y-3">
        {games.map((game, idx) => (
          <li key={game.slug}>
            <GameCard game={game} rank={idx + 1} />
            {idx === 4 && (
              <div className="py-4">
                <AdSlot slot="2222222222" format="auto" minHeight={250} />
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <SubmitCta />
      </div>
    </div>
  );
}
