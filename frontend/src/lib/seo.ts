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

/* -------------------------------------------------------------------------- */
/*  Category landing configs                                                   */
/* -------------------------------------------------------------------------- */

export const categoryLandingConfigs: Record<GameCategory, CategoryLandingConfig> = {
  strategy: {
    category: "strategy",
    title: "Best strategy games for tablets",
    description:
      "Strategy games scored on how well they use tablet screen space — map visibility, HUD readability, and touch-native controls.",
    intro:
      "Strategy is the genre where tablet quality shows up most clearly. If the map, resource panel, and unit info can't share the screen without toggling, the port usually falls apart fast.",
    signals: [
      "Can you see the map and resource panels simultaneously without switching views?",
      "Do touch targets feel intentional, or are you tapping overlapping icons?",
      "Is the full desktop/console experience intact, or was content stripped out?",
    ],
    bodyParagraphs: [
      "Strategy is the genre where tablet quality shows up most clearly. On a phone, strategy games work but everything feels compressed — you're tapping overlapping icons on a small map, toggling between panels that should be visible simultaneously, and managing units through menus that weren't designed for a thumb. On a tablet, those problems either disappear or they persist, and when they persist it's a design decision worth penalizing.",
      "The best strategy games on tablets share a common trait: they give you more information on screen simultaneously. Civilization VI shows the world map, resource panel, and unit info without forcing you to switch views. Slay the Spire displays your full hand, all relics, and the enemy intents at once. Into the Breach lets you see every threat and every consequence on a single grid. These games don't just tolerate the extra screen space — they use it to reduce the friction between thinking and acting.",
      "I'm always surprised by how well card-based strategy games translate to tablets. Balatro, Slay the Spire, Wildfrost — flicking cards with your thumb is faster and more satisfying than clicking with a mouse. Hearthstone figured this out years ago. The board-as-tablet metaphor works because the physical gesture of playing a card matches the touch input. It sounds trivial but it changes how responsive the game feels over hundreds of runs.",
    ],
  },
  puzzle: {
    category: "puzzle",
    title: "Best puzzle games for tablets",
    description:
      "Puzzle games ranked by how well they use a larger touchscreen — pattern clarity, gesture quality, and visual detail you'd miss on a phone.",
    intro:
      "Puzzle games are the strongest argument for tablet gaming. The genre is built around seeing patterns, making connections, and manipulating objects — all things that benefit from a bigger screen and direct touch.",
    signals: [
      "Does the puzzle benefit from seeing more of the playing field at once?",
      "Are touch gestures part of the experience, or just a substitute for clicks?",
      "Is there visual detail that rewards a larger, sharper display?",
    ],
    bodyParagraphs: [
      "Puzzle games are the strongest argument for tablet gaming. The genre is built around seeing patterns, making connections, and manipulating objects — all things that benefit from a bigger screen and direct touch input. Monument Valley 2 on a phone is pretty. On a 12-inch tablet it's a tiny museum piece you're rotating with your hands. The Room: Old Sins has puzzle boxes you pinch, twist, and rotate — gestures that feel cramped on a phone and natural on a tablet.",
      "The games I keep coming back to are the ones where touch isn't just an input method, it's the experience. Chants of Sennaar has a notebook where you drag glyphs around and draw connections between them. On a phone you'd hate this. On a 12.9-inch screen with an Apple Pencil it feels like actual linguistic fieldwork. Florence tells its story through touch vignettes — assembling speech bubbles, brushing teeth, packing boxes. The touch interactions ARE the storytelling. You lose something playing these with a mouse.",
      "Mini Metro deserves special mention because it's the cleanest example of a game that's better on a tablet than anywhere else. You draw transit lines with two thumbs simultaneously. The minimal UI scales perfectly to any resolution. It's a puzzle game where the input device makes the puzzle feel different. On a phone the lines are too close together. On a tablet you're conducting a transit system.",
    ],
  },
  rpg: {
    category: "rpg",
    title: "Best RPG games for tablets",
    description:
      "RPGs ranked on text readability, menu usability, and whether the tablet port preserves the full game across 40+ hours.",
    intro:
      "RPGs are long games. When a UI problem bothers you, it compounds across dozens of hours. The games here earned their ranking by staying comfortable at tablet scale for an entire playthrough.",
    signals: [
      "Is dialogue, item, and quest text comfortably readable without zooming?",
      "Do menus, inventories, and skill trees work well with touch?",
      "Is the full game here, or was content stripped for mobile?",
    ],
    bodyParagraphs: [
      "RPGs on tablets live or die on text readability. The genre is text-heavy by nature — dialogue trees, item descriptions, quest logs, skill tooltips, lore entries. When the text is comfortable to read, an RPG on a tablet can be a 40-hour companion. When it's not, you either squint or give up by hour three.",
      "Divinity: Original Sin 2 is the poster child for getting this right. Larian rebuilt the entire interface for iPad with three control schemes — touch, controller, or keyboard and mouse — and it runs at 1440p on iPad Pro. The inventory management, the dialogue system, the combat grid: all of it was rethought for how you actually hold a tablet. Disco Elysium is the opposite end of the budget spectrum but the same principle: it's 90% reading, and on a 12.9-inch screen in bed it works like a very weird novel with skill checks.",
      "The RPGs that score lower here aren't necessarily worse games. They're games where the mobile port didn't get the same attention. Baldur's Gate: Enhanced Edition is a masterpiece, but the Infinity Engine was designed for a mouse and the touch adaptation has friction in specific spots. Still worth playing on a tablet — just don't expect the fluidity of a game designed touch-first.",
    ],
  },
  simulation: {
    category: "simulation",
    title: "Best simulation games for tablets",
    description:
      "Simulation games ranked by how well their management UIs, building tools, and information panels use tablet-sized screens.",
    intro:
      "Sim games need space. City builders, farm sims, management games — they all have dense interfaces with lots of small elements that open up on a bigger canvas.",
    signals: [
      "Do management panels, menus, and inventories stop feeling cramped?",
      "Were the touch controls built for tablets, or adapted from mouse/controller?",
      "Does the bigger canvas change how you interact with the simulation?",
    ],
    bodyParagraphs: [
      "Simulation games need space. City builders, farm sims, management games — they all have interfaces with lots of small elements that benefit from a larger canvas. Stardew Valley on a phone means squinting at your inventory grid. On a tablet, the dedicated HUD scaling makes everything readable and the bigger hit targets mean you stop accidentally watering the wrong tile.",
      "Townscaper is the game I show people when they ask why tablet gaming matters. You tap to place buildings on water and the algorithm generates arches, stairways, and courtyards. That's the whole game. $5. On a phone it's charming. On a 12-inch screen with an Apple Pencil, my partner spent two hours placing buildings one by one and she doesn't play games. The bigger canvas turns a toy into something meditative.",
      "Mini Motorways and Pocket City both do something smart: they were built mobile-first, not ported down from PC. The touch interfaces aren't adapted mouse controls — they're native. Drawing road networks in Mini Motorways with two thumbs is how the game was designed to be played. Pocket City's zoning menus were built for tap targets, not click targets. When a simulation game starts from touch and scales up to tablets, the result is almost always better than a PC sim scaled down.",
    ],
  },
  board: {
    category: "board",
    title: "Best board games for tablets",
    description:
      "Digital board games ranked on readability, touch ergonomics, and whether the app beats setting up the physical game.",
    intro:
      "I own physical copies of several games on this list and I reach for the iPad version almost every time. The reason is always bookkeeping.",
    signals: [
      "Are cards, boards, and rule text legible without pinch-to-zoom?",
      "Does the app handle setup, scoring, and rule enforcement automatically?",
      "Is pass-and-play available for playing with people in the room?",
    ],
    bodyParagraphs: [
      "Digital board games on tablets are underrated. I own physical copies of several games on this list and I reach for the iPad version almost every time. The reason is always bookkeeping: setup, teardown, rule enforcement, and scoring. Wingspan takes 20 minutes to set up on a table. The app takes two seconds. Through the Ages is a 3-to-4-hour physical game that runs 45 minutes digitally. The parts of physical play that slow a game down at a table happen in the background.",
      "The tablet is the key ingredient. A board game on a phone feels wrong — the board is too small, the cards are too cramped, you're zooming in and out constantly. A board game on a tablet is the board itself. Carcassonne's tile-laying mechanic translates perfectly to a touch surface. Root's woodland map is legible at tablet scale. Galaxy Trucker's ship-building grid is more satisfying to drag-and-drop on a touchscreen than to grab physical tiles off a table.",
      "Pass-and-play makes tablets the best platform for board gaming with other people in the room. Hand someone the iPad, they take their turn, they pass it back. No rules explanation needed because the app enforces them. No setup, no cleanup, no lost pieces. It's the closest a digital game gets to the social side of tabletop gaming. Carcassonne and Galaxy Trucker are my go-to introduction games now because of this.",
    ],
  },
  action: {
    category: "action",
    title: "Best action games for tablets",
    description:
      "Action games ranked honestly — the control problem is real, but these titles either solved it, worked around it, or don't need precision.",
    intro:
      "Action games are the hardest genre to recommend on tablets. The control problem is real. The games ranked here either solved that problem or have gameplay where it doesn't matter as much.",
    signals: [
      "Can you play comfortably with touch, or does the game need a controller?",
      "Does the larger screen add something — better visibility, more detail?",
      "Were the touch controls designed for this game, or bolted on?",
    ],
    bodyParagraphs: [
      "Action games are the hardest genre to recommend on tablets. The control problem is real — a touchscreen can't match a physical controller for precision in fast-paced games, and holding a tablet while trying to hit action inputs is awkward in a way that doesn't affect slower genres. The games ranked here either solved that problem, worked around it, or have gameplay where it doesn't matter as much.",
      "Hades with a controller plugged into an iPad is legitimately great. Supergiant rebuilt the touch UI for the Netflix release, but the game plays best with a controller and the iPad becomes a portable console. Dead Cells is similar — Playdigious redesigned the touch controls from scratch for mobile, and they work, but a controller is better. Both games look gorgeous on a larger screen and that alone justifies playing them on a tablet instead of a phone.",
      "The action games that work best with pure touch are the ones that don't need precision aiming. GRIS is a watercolor platformer where the inputs are simple but the art needs a big screen to appreciate — there are background details you literally cannot see on a phone. Alto's Odyssey is a one-button game where the scenery is the point. Sayonara Wild Hearts uses swipe and tap controls that were authored for touch, not ported from buttons. When an action game designs around touch limitations instead of fighting them, the tablet version can genuinely be the best version.",
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Platform landing page copy                                                 */
/* -------------------------------------------------------------------------- */

export function getPlatformLandingCopy(
  platform: PlatformFilter
): { title: string; description: string; intro: string; signals: string[]; bodyParagraphs: string[] } {
  if (platform === "ios") {
    return {
      title: "Best iPad games",
      description:
        "PadPlay's tablet-first leaderboard of the best iPad games, ranked by how well they actually use a larger screen — not by download count.",
      intro:
        "Every \"best iPad games\" list is the same five games recycled since 2018. These were picked because they do something specific with the iPad's screen that you wouldn't get on a phone.",
      signals: [
        "Does the game use iPad screen space for more information, not just bigger buttons?",
        "Are the touch controls native-feeling, or a mouse UI with bigger hit targets?",
        "Is the full game here — same content, same depth as desktop or console?",
      ],
      bodyParagraphs: [
        "Every \"best iPad games\" list is the same. Civilization VI, Stardew Valley, maybe Monument Valley if the writer remembers it exists. Those are genuinely great tablet games. They're also the same five picks every outlet has been recycling since 2018. If you search \"best iPad games\" right now, the top results are App Store download charts with editorial polish. Popular and tablet-native are different things.",
        "The games ranked here were picked because they do something specific with the iPad's screen that you wouldn't get on a phone. Divinity: Original Sin 2 runs at 1440p on iPad Pro and has three different control schemes — touch, controller, and keyboard/mouse — because Larian actually rebuilt the interface. FTL's touch controls are so good that people who played it on PC for years say they prefer the iPad version. Chants of Sennaar has a notebook mechanic where you drag glyphs around, and with an Apple Pencil on a 12.9-inch screen it feels like actual linguistic fieldwork. None of these show up on typical \"top iPad games\" listicles.",
        "I'm also skeptical of any iPad games list that doesn't mention pricing model. A game that's free-to-play with energy timers and interstitial ads is a fundamentally different experience from a $10 one-time purchase. Both can be good. But when a list mixes Candy Crush and XCOM 2 into the same ranking without flagging that one respects your time and the other is designed to waste it, that list is useless. Every game here has its pricing and monetization model visible because it matters.",
        "One last thing: a lot of \"iPad games\" are iPhone apps that Apple scales up. They technically launch on an iPad. The buttons are bigger. The layout is the same. That's not a tablet game. A tablet game is one where the developer looked at 11 to 13 inches of screen and made a decision about it.",
      ],
    };
  }

  return {
    title: "Best Android tablet games",
    description:
      "A curated leaderboard of Android tablet games that actually work well on larger screens — not phone games that technically launch.",
    intro:
      "Android tablet game recommendations barely exist. These are the games that actually translate cleanly to a 10 or 11-inch Android screen.",
    signals: [
      "Does the UI scale properly on mainstream Android tablets without layout glitches?",
      "Is the game available natively on the Play Store, not through emulation?",
      "Do touch targets and controls account for a larger device?",
    ],
    bodyParagraphs: [
      "Android tablet game recommendations barely exist. Try searching for them — you'll get a Tom's Guide article from 2023 that lists Genshin Impact and PUBG Mobile, and then nothing useful. The editorial coverage gap is massive. iPad gets dedicated game curation from Apple, tablet-specific App Store features, and outlets that regularly cover iOS gaming. Android tablet owners get told to try whatever phone game is trending.",
      "Part of the problem is fragmentation. A game that runs perfectly on a Samsung Galaxy Tab S9 might have UI scaling issues on a Pixel Tablet or a Lenovo Tab. Developers who want to optimize for tablets have to deal with more screen configurations on Android than on iOS. Some don't bother. The games ranked here are the ones that did bother — or at least the ones where the result holds up across mainstream Android tablets without glaring layout problems.",
      "The good news is that cross-platform games have gotten better about this. Stardew Valley, Slay the Spire, Carcassonne, and Wingspan all work well on Android tablets now. The bad news is you'd never know it from searching. These games get buried under phone-first free-to-play titles in the Play Store's tablet section.",
      "One practical note: if you're on a Samsung tablet, OneUI handles app scaling differently from stock Android. A few games that work fine on a Pixel Tablet might have minor UI quirks on a Galaxy Tab, and vice versa. The scores here reflect general Android tablet behavior. I try to note device-specific issues when they come up, but I can't test every device.",
    ],
  };
}

/* -------------------------------------------------------------------------- */
/*  Collection landing configs                                                 */
/* -------------------------------------------------------------------------- */

export const collectionLandingConfigs: CollectionLandingConfig[] = [
  {
    slug: "best-strategy-games-for-ipad",
    title: "Best strategy games for iPad",
    description:
      "A tablet-first shortlist of the best strategy games for iPad — ranked by map visibility, information density, and touch-native controls.",
    intro:
      "Strategy is the clearest proof of tablet quality. If the map, HUD, and planning space don't improve on a bigger screen, the port usually collapses fast.",
    signals: [
      "Can you see the map and multiple info panels without toggling views?",
      "Does the touch UI feel designed for iPad, not adapted from mouse controls?",
      "Is the full desktop experience intact — content, DLC, save compatibility?",
    ],
    bodyParagraphs: [
      "Strategy is where tablets earn their keep. The genre is built around information density — maps, unit stats, resource panels, tech trees — and all of that benefits from a bigger screen. On a phone, a strategy game is technically playable but you're constantly toggling between views. On an iPad, you can see the map and the resource panel and the unit info at the same time. That's not a small difference over a 40-hour campaign.",
      "Civilization VI is the obvious pick and it deserves to be. Aspyr didn't just port it — they rebuilt the touch interaction. Pinch to zoom the world map, drag to pan, tap units for context menus. It has full DLC parity with the desktop version and cross-save with Steam. I've played full games on an iPad Pro that I started on my PC, and the transition is seamless. At $25 it's the most expensive game on this list and it's worth every dollar.",
      "The more interesting picks are the ones you wouldn't expect. Into the Breach rebuilt its entire touch UI for the Netflix release — the grid-based tactics feel like they were designed for tapping. Balatro at 120fps on a ProMotion iPad with haptic feedback makes the card-flicking genuinely satisfying in a way the PC version doesn't match. And Slay the Spire's card play feels more natural with your thumb than with a mouse, which is something I would have dismissed before trying it.",
      "Landscape orientation was weighted heavily here. Strategy games played in portrait on an iPad are a minority case. Every game on this list works well in landscape, and most of them feel native in that orientation rather than adapted for it.",
    ],
    category: "strategy",
    platform: "ios",
  },
  {
    slug: "best-board-games-for-ipad",
    title: "Best board games for iPad",
    description:
      "PadPlay's picks for board games on iPad — where text readability, touch ergonomics, and automated bookkeeping matter more than raw graphics.",
    intro:
      "I own physical copies of several games on this list and I reach for the iPad version almost every time. The reason is always the same: setup.",
    signals: [
      "Is card, board, and rule text readable without pinch-to-zoom?",
      "Does the app automate the worst parts of physical play — setup, scoring, enforcement?",
      "Is pass-and-play available for shared-device multiplayer?",
    ],
    bodyParagraphs: [
      "I keep reaching for the iPad version of board games I own physically. The reason is always the same: setup. Wingspan takes 20 minutes to set up on a table and 2 seconds to launch on an iPad. Through the Ages is a 3-hour physical game that takes 45 minutes digitally. Terraforming Mars has so many resource cubes that you need a dedicated organizer insert, or you can just tap a screen.",
      "The games that work best on iPad are the ones with heavy bookkeeping. Rule enforcement, scoring, resource tracking — the iPad handles all of it in the background. You spend time on decisions instead of on maintenance. Root is a perfect example: four factions with completely different rule sets. Teaching this at a game night takes 45 minutes. The app just enforces the rules and lets you learn by playing. That's not a minor convenience, it's a fundamentally better way to learn a complex game.",
      "Board game readability matters more on tablets than in any other genre. These games have a lot of text — card descriptions, rules reminders, turn summaries, flavor text. On a phone, that text is either too small or it's zoomed in and you lose board context. On an iPad, you can read the card text and see the full board at the same time. Games where I had to pinch-to-zoom to read card effects ranked lower, regardless of how good the underlying game is.",
      "Pass-and-play deserves a mention. Galaxy Trucker supports 4 players on a single iPad. Carcassonne's pass-and-play is how I introduce people to board games now. You hand someone the iPad, they place a tile, they pass it back. No rules explanation, no setup, no cleanup. It's the closest a digital game gets to the social aspect of a physical one.",
    ],
    category: "board",
    platform: "ios",
  },
  {
    slug: "best-rpg-games-for-android-tablets",
    title: "Best RPG games for Android tablets",
    description:
      "A curated list of RPG games for Android tablets — ranked on text readability, menu usability, and whether the port survives 40+ hours of play.",
    intro:
      "Android tablet players rarely get dedicated editorial curation. This page narrows the field to RPGs that stay legible and comfortable for a full playthrough on a larger display.",
    signals: [
      "Is dialogue and item text comfortable to read at tablet scale?",
      "Do inventory, skill, and menu screens work properly with touch?",
      "Does the game run natively from the Play Store, not through emulation?",
    ],
    bodyParagraphs: [
      "RPGs are long games. When a UI problem bothers you, it bothers you across dozens of hours. On Android tablets, where large-screen support has historically been inconsistent, finding an RPG that holds up for a full playthrough on a 10 or 11-inch screen takes more effort than it should. The games here are the ones I'd actually recommend committing to.",
      "The text readability issue hits RPGs harder than any other genre. Dialogue trees, item descriptions, quest logs, skill tooltips — RPGs are text-heavy by nature. Baldur's Gate on an Android tablet with a 10-inch screen is legible and comfortable. The same game on a 6-inch phone is an exercise in squinting. That difference matters when you're 30 hours into a playthrough.",
      "Crashlands 2 surprised me. Butterscotch Shenanigans built it with cross-progression between iPad, Android, and Steam Deck, and the touch-first UI actually works. No controller required, no awkward virtual joystick. The inventory management benefits from tablet space in a way that's hard to describe until you've tried to manage a crafting-heavy RPG on a phone.",
      "One thing I excluded from this list: games that run through emulation or compatibility layers. Everything here runs natively through the Play Store. Performance and interface quality are more predictable that way, and the rankings reflect that baseline. If you want to emulate PS2 RPGs on an Android tablet, that's a separate conversation.",
    ],
    category: "rpg",
    platform: "android",
  },
  {
    slug: "games-for-ipad-pro",
    title: "Best games for iPad Pro",
    description:
      "Games that actually take advantage of iPad Pro hardware — ProMotion 120Hz, M-series chips, and 11 or 13-inch displays.",
    intro:
      "People searching for iPad Pro games want titles that feel worthy of the hardware. This page leans toward games where the Pro display, refresh rate, or screen size makes a real difference.",
    signals: [
      "Does the game benefit from ProMotion 120Hz or a larger display?",
      "Is there visual fidelity that justifies the Pro's display quality?",
      "Does the 13-inch screen change the gameplay experience, not just scale it up?",
    ],
    bodyParagraphs: [
      "The iPad Pro has a better display than most computers people actually game on. ProMotion at 120Hz, wide color gamut, and a screen that runs 11 or 13 inches. Whether any of that matters for a specific game is the question this list tries to answer.",
      "For most games, an iPad Pro is overkill. The standard iPad Air runs everything here fine. But there are specific cases where the Pro hardware changes the experience. Balatro at 120fps feels different from Balatro at 60fps — the card animations are smoother and the haptic feedback syncs better. Hades at 60fps on a 13-inch ProMotion display with a controller is legitimately a console-quality experience lying flat on your lap. Divinity: Original Sin 2 runs at 1440p, which matches PC resolution, and on a 13-inch screen you can see inventory details that would require zooming on a smaller device.",
      "The 13-inch iPad Pro matters most for strategy and board games where you need to see the whole playing field. Civilization VI's world map at 13 inches is closer to a desktop monitor experience than a tablet one. Through the Ages' dense card layouts stop feeling cramped. If you play one type of game and it's strategy, the 13-inch Pro earns its price difference for gaming alone.",
      "Apple Pencil support is underrated for gaming. Townscaper with a Pencil is more precise than with fingers. Chants of Sennaar's glyph notebook with a Pencil feels like actual research tools. World of Goo Remastered — dragging goo balls with a stylus transforms the game from \"cute physics toy\" to something almost meditative. Not many games support it well, but the ones that do make it hard to go back to fingers.",
    ],
    platform: "ios",
  },
];

export function getCollectionLandingConfig(
  slug: string
): CollectionLandingConfig | null {
  return collectionLandingConfigs.find((config) => config.slug === slug) ?? null;
}
