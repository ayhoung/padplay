import type { Game } from "@padplay/shared-types";
import { SubmitCta } from "@/components/marketing/SubmitCta";
import Image from "next/image";
import Link from "next/link";
import { StoreRatings } from "@/components/leaderboard/StoreRatings";

interface SeoLandingPageProps {
  title: string;
  description: string;
  context: string[];
  scope: string[];
  items: { game: Game; blurb: string }[];
}

export function SeoLandingPage({
  title,
  description,
  context,
  scope,
  items,
}: SeoLandingPageProps) {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: items.map(({ game }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://padplay.app/games/${game.slug}`,
      name: game.title
    }))
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <article className="prose prose-slate prose-lg max-w-none">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-6">
          {title}
        </h1>
        <p className="text-xl leading-8 text-slate-500 mb-10">{description}</p>

        {/* Context Paragraphs */}
        <div className="space-y-6 text-slate-700">
          {context.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Scope / What we looked for */}
        {scope.length > 0 && (
          <div className="my-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 !mt-0 !mb-4">
              What we looked for
            </h2>
            <ul className="space-y-3 text-slate-700 m-0 p-0 list-none">
              {scope.map((signal) => (
                <li key={signal} className="flex gap-3 m-0 p-0">
                  <span className="text-brand-600 font-bold mt-0.5">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Editorial Items (Games) */}
        <div className="mt-16 space-y-16">
          {items.map(({ game, blurb }, index) => (
            <section key={game.slug} className="scroll-mt-24" id={game.slug}>
              <div className="flex items-center gap-4 mb-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-bold text-brand-800">
                  {index + 1}
                </span>
                <h3 className="text-3xl font-bold text-slate-900 !m-0">
                  {game.title}
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                {game.iconUrl && (
                  <div className="shrink-0">
                    <Link href={`/games/${game.slug}`}>
                      <Image
                        src={game.iconUrl}
                        alt={`${game.title} icon`}
                        width={128}
                        height={128}
                        className="rounded-3xl shadow-md transition-transform hover:scale-105 !m-0"
                        unoptimized
                      />
                    </Link>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <StoreRatings game={game} size="sm" />
                    <span className="text-sm font-medium text-slate-500">
                      {game.developer}
                    </span>
                  </div>
                  
                  <p className="text-lg leading-8 text-slate-700 !mt-0 !mb-6">
                    {blurb}
                  </p>

                  <Link 
                    href={`/games/${game.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-colors no-underline"
                  >
                    View details &rarr;
                  </Link>
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>

      <div className="mt-20 border-t border-slate-200 pt-10">
        <SubmitCta />
      </div>
    </div>
  );
}
