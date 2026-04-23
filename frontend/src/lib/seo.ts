import {
  CATEGORY_LABELS,
  GAME_CATEGORIES,
  type GameCategory,
  type PlatformFilter,
} from "@padplay/shared-types";

export interface CategoryLandingConfig {
  category: GameCategory;
  title: string;
  description: string;
  intro: string;
}

export interface CollectionLandingConfig {
  slug: string;
  title: string;
  description: string;
  intro: string;
  category?: GameCategory;
  platform?: PlatformFilter;
}

export const curatedLinks = [
  {
    href: "/best-ipad-games",
    title: "Best iPad games",
    description: "Tablet-ranked picks for iPad owners who want native-feeling games."
  },
  {
    href: "/android-tablet-games",
    title: "Best Android tablet games",
    description: "A filtered leaderboard for games that hold up on larger Android screens."
  },
  {
    href: "/categories/strategy",
    title: "Best strategy games for tablets",
    description: "Our strongest category for proving whether a game really respects screen space."
  },
  {
    href: "/categories/board",
    title: "Best board games for tablets",
    description: "Board game adaptations live or die by readable UI and touch-first design."
  },
  {
    href: "/collections/best-strategy-games-for-ipad",
    title: "Best strategy games for iPad",
    description: "The strongest long-session category for proving whether tablet UI is genuinely native."
  },
  {
    href: "/collections/best-board-games-for-ipad",
    title: "Best board games for iPad",
    description: "Readable text, roomy layouts, and touch-first interactions matter more here than anywhere."
  },
  {
    href: "/collections/best-rpg-games-for-android-tablets",
    title: "Best RPG games for Android tablets",
    description: "Large-screen Android players need a narrower shortlist than the generic mobile-game lists."
  },
  {
    href: "/collections/games-for-ipad-pro",
    title: "Games for iPad Pro",
    description: "A device-focused page for visitors searching around premium iPad hardware intent."
  }
];

export const categoryLandingConfigs: Record<GameCategory, CategoryLandingConfig> =
  Object.fromEntries(
    GAME_CATEGORIES.map((category) => [
      category,
      {
        category,
        title: `Best ${CATEGORY_LABELS[category]} games for tablets`,
        description: `Our tablet-first ranking of ${CATEGORY_LABELS[
          category
        ].toLowerCase()} games for iPad and Android tablets.`,
        intro: `These ${CATEGORY_LABELS[
          category
        ].toLowerCase()} picks earn their place by using tablet space well, not merely scaling up a phone layout.`
      }
    ])
  ) as Record<GameCategory, CategoryLandingConfig>;

export function getPlatformLandingCopy(
  platform: PlatformFilter
): { title: string; description: string; intro: string } {
  if (platform === "ios") {
    return {
      title: "Best iPad games",
      description:
        "PadPlay's tablet-first leaderboard of the best iPad games, ranked by how well they actually use a larger screen.",
      intro:
        "This page is for people searching for iPad games that feel native on tablets, with real UI scale, touch fit, and full-game parity."
    };
  }

  return {
    title: "Best Android tablet games",
    description:
      "A curated leaderboard of Android tablet games that work well on large screens and avoid stretched-phone compromises.",
    intro:
      "Android tablet players get the same problem as iPad owners: too many phone-first ports. These are the games that translate cleanly."
  };
}

export const collectionLandingConfigs: CollectionLandingConfig[] = [
  {
    slug: "best-strategy-games-for-ipad",
    title: "Best strategy games for iPad",
    description:
      "A tablet-first shortlist of the best strategy games for iPad, filtered toward games that reward larger screens.",
    intro:
      "Strategy is the clearest proof of tablet quality. If the map, HUD, and planning space don’t improve on a bigger screen, the port usually collapses fast.",
    category: "strategy",
    platform: "ios"
  },
  {
    slug: "best-board-games-for-ipad",
    title: "Best board games for iPad",
    description:
      "PadPlay's picks for board games on iPad, where readability, spacing, and touch ergonomics matter more than raw graphics.",
    intro:
      "Board game adaptations are either delightful on tablets or painfully cramped. This list favors the ones that respect your hands and your screen.",
    category: "board",
    platform: "ios"
  },
  {
    slug: "best-rpg-games-for-android-tablets",
    title: "Best RPG games for Android tablets",
    description:
      "A curated list of RPG games for Android tablets with stronger UI scale, cleaner touch controls, and fewer phone-port compromises.",
    intro:
      "Android tablet players rarely get dedicated editorial curation. This page narrows the field to RPGs that still feel legible and comfortable on larger displays.",
    category: "rpg",
    platform: "android"
  },
  {
    slug: "games-for-ipad-pro",
    title: "Best games for iPad Pro",
    description:
      "A device-intent landing page for iPad Pro owners who want games that actually take advantage of a premium tablet screen.",
    intro:
      "People searching for iPad Pro games want titles that feel worthy of the hardware, not just apps that happen to launch. This page leans toward games that make room matter.",
    platform: "ios"
  }
];

export function getCollectionLandingConfig(
  slug: string
): CollectionLandingConfig | null {
  return collectionLandingConfigs.find((config) => config.slug === slug) ?? null;
}
