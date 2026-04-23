import type { Game } from "@padplay/shared-types";
import { GameCard } from "@/components/leaderboard/GameCard";
import { DiscoveryLinks } from "@/components/marketing/DiscoveryLinks";
import { SubmitCta } from "@/components/marketing/SubmitCta";

interface SeoLandingPageProps {
  title: string;
  description: string;
  intro: string;
  games: Game[];
}

export function SeoLandingPage({
  title,
  description,
  intro,
  games
}: SeoLandingPageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        <p className="mt-3 text-sm leading-6 text-slate-500">{intro}</p>
      </section>

      <div className="mt-8">
        <DiscoveryLinks />
      </div>

      <div className="mt-8">
        <ol className="space-y-3">
          {games.map((game, index) => (
            <li key={game.slug}>
              <GameCard game={game} rank={index + 1} />
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <SubmitCta />
      </div>
    </div>
  );
}
