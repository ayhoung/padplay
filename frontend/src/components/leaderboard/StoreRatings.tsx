import { Star } from "lucide-react";
import type { Game } from "@padplay/shared-types";
import { cn } from "@/lib/utils";

interface Props {
  game: Pick<
    Game,
    "iosRating" | "iosRatingCount" | "androidRating" | "androidRatingCount" | "platforms"
  >;
  size?: "sm" | "md";
  className?: string;
}

function formatCount(n: number | null): string {
  if (n === null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function RatingPill({
  label,
  rating,
  count,
  size,
}: {
  label: string;
  rating: number | null;
  count: number | null;
  size: "sm" | "md";
}) {
  if (rating == null || Number.isNaN(rating)) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white text-slate-700",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
      )}
      title={`${label}: ${rating.toFixed(1)} average from ${count ?? 0} ratings`}
    >
      <Star
        className={cn("fill-amber-400 text-amber-400", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")}
        aria-hidden
      />
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="text-slate-400">{label}</span>
      {count !== null && count > 0 && (
        <span className="text-slate-400">· {formatCount(count)}</span>
      )}
    </span>
  );
}

export function StoreRatings({ game, size = "sm", className }: Props) {
  const hasAny = game.iosRating != null || game.androidRating != null;
  if (!hasAny) return null;
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {game.platforms !== "android" && (
        <RatingPill
          label="iOS"
          rating={game.iosRating}
          count={game.iosRatingCount}
          size={size}
        />
      )}
      {game.platforms !== "ios" && (
        <RatingPill
          label="Play"
          rating={game.androidRating}
          count={game.androidRatingCount}
          size={size}
        />
      )}
    </div>
  );
}
