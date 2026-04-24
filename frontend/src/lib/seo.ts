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
  signals: string[];
  bodyParagraphs?: string[];
}

export interface CollectionLandingConfig {
  slug: string;
  title: string;
  description: string;
  intro: string;
  signals: string[];
  bodyParagraphs?: string[];
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
        ].toLowerCase()} picks earn their place by using tablet space well, not merely scaling up a phone layout.`,
        signals: [
          "Readable UI that benefits from extra screen space.",
          "Touch targets and controls that feel deliberate on tablets.",
          "Full-featured versions instead of compromised phone ports."
        ]
      }
    ])
  ) as Record<GameCategory, CategoryLandingConfig>;

export function getPlatformLandingCopy(
  platform: PlatformFilter
): { title: string; description: string; intro: string; signals: string[]; bodyParagraphs: string[] } {
  if (platform === "ios") {
    return {
      title: "Best iPad games",
      description:
        "PadPlay's tablet-first leaderboard of the best iPad games, ranked by how well they actually use a larger screen.",
      intro:
        "This page is for people searching for iPad games that feel native on tablets, with real UI scale, touch fit, and full-game parity.",
      signals: [
        "Native-feeling layouts that justify an iPad instead of a phone.",
        "Games that stay legible in long sessions on larger screens.",
        "Ports that preserve depth rather than stripping systems out."
      ],
      bodyParagraphs: [
        "The iPad has been around long enough that developers know what a good tablet port looks like. The ones on this list got it right. They were scored on whether the extra screen space actually does something: whether text stays readable, whether controls sit where your thumbs land, whether the game gives you more information on screen instead of just stretching a phone layout across a bigger display.",
        "Most iPad game rankings are App Store charts filtered by download count. Popular and tablet-native are different things. A game can have fifty million installs and still feel slightly wrong on a larger screen. The scoring here starts from a simpler question: would playing this on an iPad instead of a phone give you a meaningfully better experience?",
        "Four things drove the rankings. UI legibility at tablet size. Touch target placement that accounts for a larger device. Whether the full game content is intact. And how the layout handles landscape orientation, which is how most people hold an iPad when they are gaming seriously. Games that clear all four tend to feel like they belong on the platform."
      ]
    };
  }

  return {
    title: "Best Android tablet games",
    description:
      "A curated leaderboard of Android tablet games that work well on large screens and avoid stretched-phone compromises.",
    intro:
      "Android tablet players get the same problem as iPad owners: too many phone-first ports. These are the games that translate cleanly.",
    signals: [
      "Large-screen Android titles with UI that remains comfortable and sharp.",
      "Games worth recommending even without much Android-tablet editorial coverage.",
      "Better touch ergonomics and less compromised navigation."
    ],
    bodyParagraphs: [
      "The Play Store has plenty of games that work on Android tablets. Fewer of them work well. The common problem is a phone layout that scales to a larger screen without any adjustment: buttons sized for a thumb now float in extra whitespace, menus designed for vertical scrolling do not adapt to a wider landscape view, and text that was legible on a 6-inch screen becomes oversized and awkward at 11 inches.",
      "The games ranked here were filtered to Android and scored against the same criteria used across the full PadPlay leaderboard. Several titles that score well on gameplay ranked lower because the Android build does not hold up at tablet resolution. That gap gets noted, and it affects the score.",
      "One practical caveat: Android tablet behavior varies more than iOS does. Samsung OneUI and stock Android handle app scaling differently, and some games behave differently on a Pixel Tablet versus a Galaxy Tab. The scores here reflect general Android tablet behavior. Device-specific quirks are not accounted for."
    ]
  };
}

export const collectionLandingConfigs: CollectionLandingConfig[] = [
  {
    slug: "best-strategy-games-for-ipad",
    title: "Best strategy games for iPad",
    description:
      "A tablet-first shortlist of the best strategy games for iPad, filtered toward games that reward larger screens.",
    intro:
      "Strategy is the clearest proof of tablet quality. If the map, HUD, and planning space don't improve on a bigger screen, the port usually collapses fast.",
    signals: [
      "Map views and overlays that stay readable during long sessions.",
      "Enough screen room to reduce menu friction and accidental taps.",
      "Depth and parity with desktop or console versions where possible."
    ],
    bodyParagraphs: [
      "Strategy is the genre where PadPlay's scoring criteria show up most clearly. On a phone, a lot of strategy games are technically playable but feel compressed. You can manage your units, but the map is small enough that you are tapping on overlapping icons. You can see the resource panel, but it sits on top of the action. On an iPad, those problems either go away or they stay, and if they stay, they are design decisions.",
      "The games listed here were filtered to iOS and selected because they get it right. Some are PC ports where the developer reworked the interface for how iPad players hold the device. Some started as mobile games built with tablet layouts from the beginning. The common thread is that the extra screen space gets used: for map visibility, for showing information simultaneously that would otherwise require toggling, for controls placed where your hands actually rest.",
      "Landscape orientation was weighted heavily for this category. Strategy games played in portrait on an iPad are a minority case. Games that work well in landscape and feel native in that orientation ranked higher than ones where portrait is clearly the designed default."
    ],
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
    signals: [
      "Readable cards, boards, and rule text on a touch surface.",
      "Turns that feel natural with taps and drags rather than mouse leftovers.",
      "Less visual clutter than typical phone-first adaptations."
    ],
    bodyParagraphs: [
      "A good digital board game on an iPad is one of the cleaner gaming experiences you can have on a touchscreen. The rules are enforced automatically. Turn order is tracked. You spend time on the game itself. When the adaptation is well done, the iPad version often becomes the preferred way to play even for people who own the physical game.",
      "The games here were filtered to iOS and scored with close attention to legibility and layout. Board games have a lot of text: card descriptions, rules reminders, turn summaries. On a tablet, there is no excuse for that text to be too small to read comfortably. Games where reading required zooming ranked lower, regardless of gameplay quality.",
      "A few of the highest-ranked games here have been in print as physical games for years. The digital versions earned their scores because they improved the experience. Deck shuffling, resource tracking, and scoring happen automatically. The parts of physical play that slow a game down at a table are handled in the background."
    ],
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
    signals: [
      "Menus, inventories, and combat UIs that don't collapse on touch.",
      "Android-first or Android-friendly support instead of neglected ports.",
      "RPGs that remain playable for long sessions on bigger screens."
    ],
    bodyParagraphs: [
      "RPGs are long games. When a UI problem bothers you, it bothers you across dozens of hours. On Android tablets, where large-screen support has historically been inconsistent across developers, finding an RPG that holds up for a full playthrough on a 10 or 11-inch screen takes more effort than it should.",
      "The games ranked here were filtered to Android and scored on how the RPG-specific UI elements perform at tablet size: inventory management on a touchscreen, dialogue text legibility, combat interface scaling, and map readability during exploration. Titles where the interface was clearly designed for a phone and never adjusted for larger displays ranked lower, even when the underlying game is strong.",
      "One category was excluded from this list: games that run through emulation or compatibility layers. Everything here runs natively through the Play Store as a proper Android build. Performance and interface quality are more predictable that way, and the rankings reflect that baseline."
    ],
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
    signals: [
      "Games that visually benefit from a premium, high-refresh tablet display.",
      "Interfaces that feel at home on a larger iPad chassis.",
      "Long-session games that justify playing on an iPad Pro specifically."
    ],
    bodyParagraphs: [
      "The iPad Pro has a better display than most computers people actually game on. ProMotion at 120Hz, wide color gamut, and a screen that runs 11 or 13 inches depending on the model. Whether any of that matters for a specific game is the question this list tries to answer.",
      "Most games treat the iPad Pro identically to other iPads. Same frame rate target, same asset resolution, same interface layout. That is fine. Mobile games generally do not need to push the display hardware. But some do benefit from what the Pro models offer, and those are the ones worth knowing about.",
      "The games here were selected because the iPad Pro hardware is worth having for them. Sometimes that is the 13-inch display making a strategy map readable at a size it would not be at 11 inches. Sometimes it is a game that genuinely targets 120fps and the difference shows during fast action. Sometimes it is simply that the game is long and complex enough that a larger, sharper display makes extended sessions more comfortable. The list covers all three cases."
    ],
    platform: "ios"
  }
];

export function getCollectionLandingConfig(
  slug: string
): CollectionLandingConfig | null {
  return collectionLandingConfigs.find((config) => config.slug === slug) ?? null;
}
