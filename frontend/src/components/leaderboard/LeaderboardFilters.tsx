import Link from "next/link";
import { Apple, Smartphone } from "lucide-react";
import { CATEGORY_LABELS, GAME_CATEGORIES } from "@padplay/shared-types";
import type { GameCategory, PlatformFilter } from "@padplay/shared-types";
import { cn } from "@/lib/utils";

interface Props {
  activeCategory: GameCategory | null;
  activePlatform: PlatformFilter | null;
}

function buildHref(
  category: GameCategory | null,
  platform: PlatformFilter | null,
): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (platform) params.set("platform", platform);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export function LeaderboardFilters({ activeCategory, activePlatform }: Props) {
  const categoryItems: Array<{ key: string; label: string; href: string; active: boolean }> = [
    {
      key: "all",
      label: "All",
      href: buildHref(null, activePlatform),
      active: activeCategory === null,
    },
    ...GAME_CATEGORIES.map((c) => ({
      key: c,
      label: CATEGORY_LABELS[c],
      href: buildHref(c, activePlatform),
      active: activeCategory === c,
    })),
  ];

  const platformItems: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    href: string;
    active: boolean;
  }> = [
    {
      key: "all-platforms",
      label: "Any store",
      href: buildHref(activeCategory, null),
      active: activePlatform === null,
    },
    {
      key: "ios",
      label: "iOS",
      icon: <Apple className="h-3.5 w-3.5" aria-hidden />,
      href: buildHref(activeCategory, "ios"),
      active: activePlatform === "ios",
    },
    {
      key: "android",
      label: "Android",
      icon: <Smartphone className="h-3.5 w-3.5" aria-hidden />,
      href: buildHref(activeCategory, "android"),
      active: activePlatform === "android",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {categoryItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            role="tab"
            aria-selected={item.active}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              item.active
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by platform">
        {platformItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            role="tab"
            aria-selected={item.active}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              item.active
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
