import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Check } from "lucide-react";
import { CATEGORY_LABELS } from "@padplay/shared-types";
import { fetchGame } from "@/lib/api";
import { AdSlot } from "@/components/ads/AdSlot";
import { StoreRatings } from "@/components/leaderboard/StoreRatings";
import { ScreenshotGallery } from "@/components/gallery/ScreenshotGallery";
import { Quotes } from "@/components/gallery/Quotes";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = await fetchGame(params.slug);
  if (!game) return { title: "Not found" };
  return {
    title: `${game.title} — tablet review`,
    description: game.shortDescription,
  };
}

export default async function GamePage({ params }: PageProps) {
  const game = await fetchGame(params.slug);
  if (!game) notFound();

  const priceLabel =
    game.priceUsd == null ? "Free" : `$${game.priceUsd.toFixed(2)}`;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: game.title,
            description: game.shortDescription,
            author: { "@type": "Organization", name: game.developer },
            datePublished: String(game.releaseYear),
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: game.tabletScore / 20,
              bestRating: 5,
              ratingCount: 1,
            },
          }),
        }}
      />

      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to leaderboard
      </Link>

      <header className="mt-4 flex items-start gap-4">
        {game.iconUrl && (
          <Image
            src={game.iconUrl}
            alt=""
            width={96}
            height={96}
            className="rounded-2xl shadow flex-shrink-0"
            unoptimized
            priority
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-slate-900">{game.title}</h1>
          <p className="mt-1 text-slate-600">
            {game.developer} · {game.releaseYear} ·{" "}
            {CATEGORY_LABELS[game.category]} ·{" "}
            <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">
              {priceLabel}
            </span>
          </p>
          <StoreRatings game={game} size="md" className="mt-3" />
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-5xl font-bold text-brand-700 leading-none">
            {game.tabletScore}
          </div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            tablet score
          </div>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <p className="text-lg text-slate-800 leading-relaxed">
            {game.shortDescription}
          </p>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Why it earns the score
            </h2>
            <ul className="space-y-1.5">
              {game.tabletFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-slate-700">
                  <Check className="h-5 w-5 flex-shrink-0 text-brand-600" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-wrap gap-3">
            {game.appStoreUrl && (
              <a
                href={game.appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                App Store <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
            {game.playStoreUrl && (
              <a
                href={game.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Play Store <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            )}
          </section>

          {game.screenshots.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Screenshots
              </h2>
              <ScreenshotGallery images={game.screenshots} alt={game.title} />
            </section>
          )}

          <Quotes quotes={game.quotes} />
        </div>

        <aside className="md:col-span-1">
          <AdSlot slot="3333333333" format="rectangle" minHeight={250} />
        </aside>
      </div>
    </div>
  );
}
