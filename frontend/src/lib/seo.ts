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
