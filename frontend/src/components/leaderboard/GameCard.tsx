import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CATEGORY_LABELS, type Game } from "@padplay/shared-types";
import { StoreRatings } from "./StoreRatings";
import { cn } from "@/lib/utils";

interface Props {
  game: Game;
  rank: number;
}

export function GameCard({ game, rank }: Props) {
  const priceLabel =
    game.priceUsd == null ? "Free" : `$${game.priceUsd.toFixed(2)}`;

  return (
    <article className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow">
      <div className="flex-shrink-0 flex flex-col items-center gap-2 w-16">
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full text-sm font-semibold w-8 h-8",
            rank <= 3 ? "bg-brand-100 text-brand-800" : "bg-slate-100 text-slate-600",
          )}
          aria-label={`Rank ${rank}`}
        >
          {rank}
        </span>
        {game.iconUrl ? (
          <Image
            src={game.iconUrl}
            alt=""
            width={56}
            height={56}
            className="rounded-xl shadow-sm"
            unoptimized
          />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-slate-100" aria-hidden />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/games/${game.slug}`}
              className="font-semibold text-slate-900 hover:text-brand-700 truncate block"
            >
              {game.title}
            </Link>
            <p className="text-sm text-slate-500 truncate">
              {game.developer} · {game.releaseYear} · {CATEGORY_LABELS[game.category]}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-2xl font-bold text-brand-700 leading-none">
              {game.tabletScore}
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wide">score</div>
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-700 line-clamp-2">
          {game.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700">
            {priceLabel}
          </span>
          <StoreRatings game={game} size="sm" />
          {game.platforms !== "android" && game.appStoreUrl && (
            <a
              href={game.appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-white hover:bg-slate-700"
            >
              App Store <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
          {game.platforms !== "ios" && game.playStoreUrl && (
            <a
              href={game.playStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded bg-slate-900 px-2 py-0.5 text-white hover:bg-slate-700"
            >
              Play Store <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
