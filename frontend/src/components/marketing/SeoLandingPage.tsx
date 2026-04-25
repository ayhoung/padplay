import type { Game } from "@padplay/shared-types";
import { GameCard } from "@/components/leaderboard/GameCard";
import { SubmitCta } from "@/components/marketing/SubmitCta";

interface SeoLandingPageProps {
  title: string;
  description: string;
  intro: string;
  games: Game[];
  signals?: string[];
  bodyParagraphs?: string[];
}

export function SeoLandingPage({
  title,
  description,
  intro,
  games,
  signals = [],
  bodyParagraphs = []
}: SeoLandingPageProps) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: games.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://padplay.app/games/${game.slug}`,
      name: game.title
    }))
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <article className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        <p className="mt-3 text-sm leading-6 text-slate-500">{intro}</p>

        {bodyParagraphs.length > 0 && (
          <div className="mt-8 space-y-4">
            {bodyParagraphs.map((p, i) => (
              <p key={i} className="text-sm leading-7 text-slate-600">
                {p}
              </p>
            ))}
          </div>
        )}

        {signals.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              What we looked for
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {signals.map((signal) => (
                <li key={signal} className="flex gap-2">
                  <span className="text-brand-700">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

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
