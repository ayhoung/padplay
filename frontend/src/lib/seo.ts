import {
  CATEGORY_LABELS,
  GAME_CATEGORIES,
  type GameCategory,
  type PlatformFilter,
} from "@padplay/shared-types";

export interface EditorialItem {
  gameSlug: string;
  blurb: string;
}

export interface CategoryLandingConfig {
  category: GameCategory;
  title: string;
  description: string;
  context: string[];
  scope: string[];
  items: EditorialItem[];
}

export interface CollectionLandingConfig {
  slug: string;
  title: string;
  description: string;
  context: string[];
  scope: string[];
  items: EditorialItem[];
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
    context: [
      "Strategy is the genre where tablet quality shows up most clearly. On a phone, strategy games work but everything feels compressed — you're tapping overlapping icons on a small map, toggling between panels that should be visible simultaneously, and managing units through menus that weren't designed for a thumb. On a tablet, those problems either disappear or they persist, and when they persist it's a design decision worth penalizing.",
      "The best strategy games on tablets share a common trait: they give you more information on screen simultaneously. These games don't just tolerate the extra screen space — they use it to reduce the friction between thinking and acting.",
      "I'm always surprised by how well card-based strategy games translate to tablets. Flicking cards with your thumb is faster and more satisfying than clicking with a mouse. The board-as-tablet metaphor works because the physical gesture of playing a card matches the touch input. It sounds trivial but it changes how responsive the game feels over hundreds of runs.",
    ],
    scope: [
      "Can you see the map and resource panels simultaneously without switching views?",
      "Do touch targets feel intentional, or are you tapping overlapping icons?",
      "Is the full desktop/console experience intact, or was content stripped out?",
    ],
    items: [
      {
        gameSlug: "civilization-vi",
        blurb: "The absolute benchmark for what a tablet port should look like. Aspyr didn't just port the desktop game — they rebuilt the input layer. Pinching to zoom the world map and dragging to pan feels so much better than WASD navigation. You can see the tech tree, unit details, and city panels simultaneously without toggling views.",
      },
      {
        gameSlug: "slay-the-spire",
        blurb: "This is what I mean when I say card-based strategy works better on a tablet. Slay the Spire is great on PC, but dragging a card from your hand directly onto an enemy with your thumb feels completely natural. The HUD was designed perfectly for portrait or landscape, and seeing your entire deck and relic bar at once makes combo math much easier to track.",
      },
      {
        gameSlug: "into-the-breach",
        blurb: "The grid-based tactics of Into the Breach feel like they were explicitly designed for a touchscreen. The Netflix mobile port rebuilt the UI specifically for tablets, so you're never squinting to see an enemy's intent or fat-fingering a mech movement. It's the kind of game where seeing the entire 8x8 grid clearly is the difference between a perfect run and failure.",
      },
      {
        gameSlug: "balatro",
        blurb: "The poker roguelike phenomenon. People who played this for 100 hours on PC try the mobile port and immediately prefer it. The tactile feedback of selecting and flicking cards with a finger just fits the casino aesthetic perfectly. Plus, on a tablet you can see your entire hand, all your jokers, and the scoring multiplier at the same time without menus overlapping.",
      },
      {
        gameSlug: "xcom-2-collection",
        blurb: "Feral Interactive are wizards at porting. XCOM 2 is a heavy, complex tactical game, and they made the unit selection and camera controls feel completely organic to a touchscreen. Swiping with two fingers to rotate the battlefield works better than middle-clicking on a mouse.",
      }
    ],
  },
  puzzle: {
    category: "puzzle",
    title: "Best puzzle games for tablets",
    description:
      "Puzzle games ranked by how well they use a larger touchscreen — pattern clarity, gesture quality, and visual detail you'd miss on a phone.",
    context: [
      "Puzzle games are the strongest argument for tablet gaming. The genre is built around seeing patterns, making connections, and manipulating objects — all things that benefit from a bigger screen and direct touch input.",
      "The games I keep coming back to are the ones where touch isn't just an input method, it's the experience. You lose something playing these with a mouse. On a phone, the interactions are too cramped. On a 10 to 13-inch screen, it feels like actual tactile work.",
    ],
    scope: [
      "Does the puzzle benefit from seeing more of the playing field at once?",
      "Are touch gestures part of the experience, or just a substitute for clicks?",
      "Is there visual detail that rewards a larger, sharper display?",
    ],
    items: [
      {
        gameSlug: "the-room-4",
        blurb: "This entire series is built around tactile puzzle boxes. You pinch, twist, and slide pieces to unlock compartments. On a phone, your hand covers half the puzzle. On a tablet, it genuinely feels like you're manipulating a complex mechanical object in front of you.",
      },
      {
        gameSlug: "monument-valley-2",
        blurb: "On a phone, Monument Valley 2 is a pretty game. On a 12-inch tablet, it's a tiny interactive museum piece. The Escher-inspired optical illusions require you to grab architecture and twist it until paths align. The extra screen space just lets the art breathe.",
      },
      {
        gameSlug: "mini-metro",
        blurb: "The cleanest example of a game that's better on a tablet than anywhere else. You draw transit lines by dragging from station to station. On a phone the lines get too close together as the city grows. On a tablet, you can use two thumbs simultaneously to route trains across the river. You're basically conducting a transit system.",
      },
      {
        gameSlug: "chants-of-sennaar",
        blurb: "A language deciphering game. You encounter strange glyphs and drag them into a notebook to guess their meanings. This drag-and-drop notebook mechanic feels like it was tailor-made for an iPad. With an Apple Pencil, it feels like actual linguistic fieldwork.",
      },
      {
        gameSlug: "unpacking",
        blurb: "A cozy zen puzzle about moving into new rooms. You pull items out of boxes and place them on shelves. The pixel art is incredibly detailed — you can read the spines of the books and identify the specific video game consoles. You miss half of those details on a 6-inch phone screen.",
      }
    ],
  },
  rpg: {
    category: "rpg",
    title: "Best RPG games for tablets",
    description:
      "RPGs ranked on text readability, menu usability, and whether the tablet port preserves the full game across 40+ hours.",
    context: [
      "RPGs on tablets live or die on text readability. The genre is text-heavy by nature — dialogue trees, item descriptions, quest logs, skill tooltips, lore entries. When the text is comfortable to read, an RPG on a tablet can be a 40-hour companion. When it's not, you either squint or give up by hour three.",
      "The RPGs that score lower here aren't necessarily worse games. They're games where the mobile port didn't get the same attention, resulting in tiny text or menus that require pinpoint accuracy.",
    ],
    scope: [
      "Is dialogue, item, and quest text comfortably readable without zooming?",
      "Do menus, inventories, and skill trees work well with touch?",
      "Is the full game here, or was content stripped for mobile?",
    ],
    items: [
      {
        gameSlug: "divinity-original-sin-2",
        blurb: "The absolute gold standard. Larian rebuilt the entire interface for iPad with three control schemes — touch, controller, or keyboard and mouse — and it runs at 1440p on iPad Pro. The inventory management, the dialogue system, the combat grid: all of it was rethought for how you actually hold a tablet.",
      },
      {
        gameSlug: "disco-elysium",
        blurb: "Disco Elysium is 90% reading. It's essentially a very weird, brilliant novel where your personality traits argue with you. On a phone, reading that much text is miserable. On an iPad, sitting on the couch or in bed, it's the perfect format. The large screen makes the dense text blocks actually inviting.",
      },
      {
        gameSlug: "baldurs-gate-enhanced",
        blurb: "A masterpiece of the genre, but the Infinity Engine was originally designed for a mouse in 1998. Beamdog did a fantastic job updating the UI for touchscreens, and the tablet version is far superior to playing this on a phone where the touch targets are impossibly small. Still, expect a little bit of friction compared to modern touch-native RPGs.",
      },
      {
        gameSlug: "crashlands-2",
        blurb: "A sprawling crafting RPG that proves you don't need a controller for action combat if the touch interface is designed well from day one. The inventory system is massive, and having the screen space to organize your resources without constantly scrolling through tiny menus is a lifesaver over a 30-hour playthrough.",
      },
      {
        gameSlug: "fantasian-neo-dimension",
        blurb: "Hironobu Sakaguchi's latest RPG features environments built entirely from physical, hand-crafted dioramas that were photographed and brought into the game. Because it was originally an Apple Arcade exclusive, the UI and combat pacing were tuned specifically for touchscreen play on Apple devices.",
      }
    ],
  },
  simulation: {
    category: "simulation",
    title: "Best simulation games for tablets",
    description:
      "Simulation games ranked by how well their management UIs, building tools, and information panels use tablet-sized screens.",
    context: [
      "Simulation games need space. City builders, farm sims, management games — they all have interfaces with lots of small elements that benefit from a larger canvas.",
      "When a simulation game starts from touch and scales up to tablets, the result is almost always better than a PC sim scaled down. The games that get this right don't just use the space to show more terrain; they use it to make the menus usable.",
    ],
    scope: [
      "Do management panels, menus, and inventories stop feeling cramped?",
      "Were the touch controls built for tablets, or adapted from mouse/controller?",
      "Does the bigger canvas change how you interact with the simulation?",
    ],
    items: [
      {
        gameSlug: "stardew-valley",
        blurb: "On a phone, managing your farm in Stardew Valley means squinting at your inventory grid and occasionally watering the wrong crop because your thumb was off by a millimeter. On a tablet, the dedicated HUD scaling makes everything readable, and the bigger hit targets make farm management completely stress-free.",
      },
      {
        gameSlug: "townscaper",
        blurb: "Townscaper is what I show people when they ask why tablet gaming matters. You tap to place buildings on water, and the algorithm generates arches and courtyards. That's it. On a phone it's charming. On a 12-inch screen, it's a meditative architectural toy. The wide canvas completely changes the vibe of the game.",
      },
      {
        gameSlug: "mini-motorways",
        blurb: "From the team behind Mini Metro. You're drawing road networks to connect houses to businesses. The iPad screen is the ideal canvas for drawing these roads — especially if you use an Apple Pencil. It was built mobile-first, so there's no controller cruft or awkward mouse-adaptation menus.",
      },
      {
        gameSlug: "pocket-city",
        blurb: "A premium SimCity-like city builder with a clean touch UI. Zoning menus need screen space to be usable, and Pocket City's tap-to-zone interface really opens up on a tablet. Watching disasters tear through a city you just spent hours optimizing is much more cinematic on a 10-inch display.",
      },
      {
        gameSlug: "two-point-hospital",
        blurb: "The spiritual successor to Theme Hospital, brought to mobile via Netflix. Management games usually suffer on mobile because of menu density, but Two Point Hospital's UI was completely reworked for tablet-sized touch targets. It actually has a better cross-save system than the Switch version.",
      }
    ],
  },
  board: {
    category: "board",
    title: "Best board games for tablets",
    description:
      "Digital board games ranked on readability, touch ergonomics, and whether the app beats playing on PC or Switch.",
    context: [
      "Digital board games on tablets are underrated. I own most of these games on Steam or console, but I reach for the iPad version almost every time. Playing them with a mouse or a controller feels clunky compared to direct touch.",
      "The tablet is the key ingredient. A board game on a phone feels wrong — the board is too small, the cards are too cramped, you're zooming in and out constantly. A board game on a tablet is the board itself. You just tap what you need to interact with.",
      "Pass-and-play makes tablets the best platform for board gaming with other people in the room. Hand someone the iPad, they take their turn, they pass it back. No rules explanation needed because the app enforces them. It's the closest a digital game gets to the social side of tabletop gaming.",
    ],
    scope: [
      "Are cards, boards, and rule text legible without pinch-to-zoom?",
      "Does the touch interface feel natural, or like a clunky mouse port?",
      "Is pass-and-play available for playing with people in the room?",
    ],
    items: [
      {
        gameSlug: "wingspan",
        blurb: "Wingspan is a click-heavy chore on PC, but dragging and dropping birds onto the board with your finger feels entirely natural. The app automates all the engine-building math, and on a tablet, the gorgeous bird illustrations actually have room to be appreciated.",
      },
      {
        gameSlug: "root-board-game",
        blurb: "Root has four factions with completely different rule sets, which makes it notoriously difficult to teach to new players. The app just enforces the rules and lets you learn by playing. Plus, dragging your little woodland warriors around the map on a big screen is weirdly satisfying.",
      },
      {
        gameSlug: "carcassonne",
        blurb: "Carcassonne's tile-laying mechanic translates perfectly to a touch surface. It's my go-to introduction game for pass-and-play local multiplayer. You hand someone the tablet, they drag a tile onto the board, and they pass it back. No messy scoring tracks to manage.",
      },
      {
        gameSlug: "through-the-ages",
        blurb: "Through the Ages is a 3-hour tabletop game that takes 45 minutes digitally. It has incredibly dense menus and card rows that are much faster to navigate when you can just tap them instead of tabbing through UI elements with a controller or mouse.",
      },
      {
        gameSlug: "galaxy-trucker",
        blurb: "Galaxy Trucker's frenetic ship-building phase is chaotic and fun, but it's fundamentally a race. Dragging and dropping ship components onto a grid on a touchscreen is infinitely more satisfying than trying to do it with a mouse cursor.",
      }
    ],
  },
  action: {
    category: "action",
    title: "Best action games for tablets",
    description:
      "Action games ranked honestly — the control problem is real, but these titles either solved it, worked around it, or don't need precision.",
    context: [
      "Action games are the hardest genre to recommend on tablets. The control problem is real — a touchscreen can't match a physical controller for precision in fast-paced games, and holding a tablet while trying to hit action inputs is awkward in a way that doesn't affect slower genres.",
      "The games ranked here either solved that problem by supporting external controllers flawlessly, or they have gameplay that works around touch limitations.",
    ],
    scope: [
      "Can you play comfortably with touch, or does the game need a controller?",
      "Does the larger screen add something — better visibility, more detail?",
      "Were the touch controls designed for this game, or bolted on?",
    ],
    items: [
      {
        gameSlug: "hades",
        blurb: "Hades plays perfectly at 60fps on an iPad. While Supergiant did rebuild the touch UI, the real reason it's here is its flawless controller support. Plug an Xbox or PlayStation controller in, prop the tablet up, and it's a completely uncompromised console experience.",
      },
      {
        gameSlug: "dead-cells",
        blurb: "The benchmark for how to adapt action games to touchscreens. Playdigious redesigned the controls from the ground up for mobile. While it's still better with a physical controller, the touch interface is shockingly usable for a game this fast, and the 120Hz support on Pro models makes dodging incredibly responsive.",
      },
      {
        gameSlug: "sayonara-wild-hearts",
        blurb: "This is how you do a touch-native action game. It's a pop-album rhythm runner where the swipe and tap controls were authored specifically for touch, not ported from buttons. It looks gorgeous on a big screen and runs flawlessly on older tablets.",
      },
      {
        gameSlug: "gris",
        blurb: "An action-platformer that doesn't require twitch reflexes. The inputs are simple enough that touch controls never get in the way. The reason you play GRIS on a tablet instead of a phone is the art: it's a stunning watercolor world with tiny background details that are completely lost on a smaller display.",
      },
      {
        gameSlug: "vampire-survivors",
        blurb: "The bullet-hell roguelike phenomenon is perfect for tablets because you only need one thumb to steer — the game handles all the attacking automatically. The tablet version supports 4-player couch co-op, which means you can lay the tablet flat on a table and have four people playing at once.",
      }
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Platform landing page copy                                                 */
/* -------------------------------------------------------------------------- */

export function getPlatformLandingConfig(platform: PlatformFilter): {
  title: string;
  description: string;
  context: string[];
  scope: string[];
  items: EditorialItem[];
} {
  if (platform === "ios") {
    return {
      title: "Best iPad games",
      description: "Tablet-ranked picks for iPad owners who want native-feeling games.",
      context: [
        "Every \"best iPad games\" list is the same. Civilization VI, Stardew Valley, maybe Monument Valley if the writer remembers it exists. Those are genuinely great tablet games. They're also the same five picks every outlet has been recycling since 2018. If you search \"best iPad games\" right now, the top results are App Store download charts with editorial polish.",
        "The games ranked here were picked because they do something specific with the iPad's screen that you wouldn't get on a phone. They give you more information, they use gestures that feel native to a touch surface, and they don't compromise on depth.",
        "One last thing: a lot of \"iPad games\" are iPhone apps that Apple scales up. They technically launch on an iPad. The buttons are bigger. The layout is the same. That's not a tablet game. A tablet game is one where the developer looked at 11 to 13 inches of screen and made a decision about it.",
      ],
      scope: [
        "Does the game use iPad screen space for more information, not just bigger buttons?",
        "Are the touch controls native-feeling, or a mouse UI with bigger hit targets?",
        "Is the full game here — same content, same depth as desktop or console?",
      ],
      items: [
        {
          gameSlug: "divinity-original-sin-2",
          blurb: "Larian rebuilt the entire interface for iPad. It runs at 1440p on iPad Pro, has three different control schemes (touch, controller, and keyboard/mouse), and includes local split-screen co-op. This is the gold standard for porting a massive PC game to a tablet.",
        },
        {
          gameSlug: "civilization-vi",
          blurb: "The touch controls outclass playing with a mouse. Pinching to zoom the map, dragging to pan, and tapping units feels completely organic. You have full DLC parity with the desktop version and cross-save with Steam, meaning you can bounce between your PC and iPad seamlessly.",
        },
        {
          gameSlug: "balatro",
          blurb: "Balatro on iPad is dangerous. The tactile feeling of selecting and dragging cards with your thumb is so much more satisfying than clicking them. It supports 120fps on ProMotion iPads and has haptic feedback that syncs perfectly with the card flips.",
        },
        {
          gameSlug: "chants-of-sennaar",
          blurb: "A language deciphering game where you drag glyphs into a notebook to guess their meaning. With an Apple Pencil on a 12.9-inch screen, it feels like actual linguistic fieldwork. You won't find this on typical \"top 10\" listicles.",
        },
        {
          gameSlug: "hades",
          blurb: "It plays flawlessly at 60fps, but the real draw is the controller support. Plug in an Xbox or DualSense controller, and your iPad becomes a portable console. It's a completely uncompromised version of one of the best action roguelikes ever made.",
        },
        {
          gameSlug: "mini-motorways",
          blurb: "Drawing road networks with your fingers across a massive iPad screen is how this game was meant to be played. It's an Apple Arcade title, which means no ads and no microtransactions. Just pure, touch-first design.",
        }
      ],
    };
  }

  return {
    title: "Best Android tablet games",
    description: "A curated leaderboard of Android tablet games that actually work well on larger screens.",
    context: [
      "Android tablet game recommendations barely exist. Try searching for them — you'll get a generic tech blog article from 2023 that lists Genshin Impact and PUBG Mobile, and then nothing useful. The editorial coverage gap is massive compared to iPads.",
      "Part of the problem is fragmentation. A game that runs perfectly on a Samsung Galaxy Tab S9 might have UI scaling issues on a Pixel Tablet. Developers who want to optimize for tablets have to deal with more screen configurations on Android than on iOS.",
      "The games ranked here are the ones that did bother — or at least the ones where the result holds up across mainstream Android tablets without glaring layout problems. They're all available natively on the Play Store, no emulation required.",
    ],
    scope: [
      "Does the UI scale properly on mainstream Android tablets without layout glitches?",
      "Is the game available natively on the Play Store, not through emulation?",
      "Do touch targets and controls account for a larger device?",
    ],
    items: [
      {
        gameSlug: "stardew-valley",
        blurb: "Stardew Valley is one of the few games that gets Android tablet scaling perfectly right. The dedicated HUD scaling makes the inventory grid readable, and the larger hit targets mean you aren't constantly fighting the controls while trying to water crops.",
      },
      {
        gameSlug: "slay-the-spire",
        blurb: "The Android port had a rocky start years ago, but it's in great shape now. Seeing your entire deck, relics, and the enemy's intent clearly on an 11-inch screen without UI overlap makes this the definitive way to play.",
      },
      {
        gameSlug: "dead-cells",
        blurb: "Playdigious did the Android port, and they are the best in the business at bringing PC games to mobile. They rebuilt the touch controls entirely. While a bluetooth controller is still recommended, the touch UI is remarkably usable.",
      },
      {
        gameSlug: "carcassonne",
        blurb: "Board games are a safe bet for Android tablets because they don't rely on twitch reflexes. Carcassonne runs beautifully, and the pass-and-play feature is perfect for laying a tablet flat on a table and playing with friends.",
      },
      {
        gameSlug: "crashlands-2",
        blurb: "A massive open-world RPG that was built with cross-progression in mind. You can seamlessly sync your saves between an Android tablet, phone, and PC. The inventory management benefits hugely from the extra screen real estate.",
      }
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
    description: "A tablet-first shortlist of the best strategy games for iPad.",
    context: [
      "Strategy is where tablets earn their keep. The genre is built around information density — maps, unit stats, resource panels, tech trees — and all of that benefits from a bigger screen. On a phone, a strategy game is technically playable but you're constantly toggling between views. On an iPad, you can see the map and the resource panel and the unit info at the same time.",
      "Landscape orientation was weighted heavily here. Strategy games played in portrait on an iPad are a minority case. Every game on this list works well in landscape, and most of them feel native in that orientation rather than adapted for it.",
    ],
    scope: [
      "Can you see the map and multiple info panels without toggling views?",
      "Does the touch UI feel designed for iPad, not adapted from mouse controls?",
      "Is the full desktop experience intact — content, DLC, save compatibility?",
    ],
    items: [
      {
        gameSlug: "civilization-vi",
        blurb: "The obvious pick. Aspyr didn't just port it — they rebuilt the touch interaction. Pinch to zoom the world map, drag to pan, tap units for context menus. It has full DLC parity with the desktop version and cross-save with Steam. I've played full games on an iPad Pro that I started on my PC, and the transition is seamless.",
      },
      {
        gameSlug: "into-the-breach",
        blurb: "Into the Breach rebuilt its entire touch UI for the Netflix release — the grid-based tactics feel like they were explicitly designed for tapping. It's a flawless port of a perfect strategy game.",
      },
      {
        gameSlug: "balatro",
        blurb: "Balatro at 120fps on a ProMotion iPad with haptic feedback makes the card-flicking genuinely satisfying in a way the PC version doesn't match. It's incredibly addictive and runs perfectly.",
      },
      {
        gameSlug: "slay-the-spire",
        blurb: "Slay the Spire's card play feels more natural with your thumb than with a mouse. Seeing your whole hand laid out across the bottom of a 10-inch screen gives you the mental space to plan out massive combos.",
      },
      {
        gameSlug: "xcom-2-collection",
        blurb: "A full, uncompromised tactical experience tuned specifically for the iPad Pro. Feral Interactive added gesture-based camera controls that make navigating the 3D battlefield completely intuitive.",
      }
    ],
    category: "strategy",
    platform: "ios",
  },
  {
    slug: "best-board-games-for-ipad",
    title: "Best board games for iPad",
    description: "PadPlay's picks for board games on iPad — where text readability and intuitive controls matter.",
    context: [
      "I keep reaching for the iPad version of board games I own on Steam. The reason is always the same: touch controls. Wingspan is fine with a mouse, but dragging and dropping birds onto the board with your finger feels so much better. Terraforming Mars has so many menus and resource tracks that navigating it with a controller on a console is miserable, but on an iPad you just tap exactly what you need.",
      "The games that work best on iPad are the ones with heavy bookkeeping and complex rule sets. The iPad handles all the rule enforcement in the background so you spend time on decisions instead of maintenance.",
      "Board game readability matters more on tablets than in any other genre. These games have a lot of text. On an iPad, you can read the card text and see the full board at the same time. Games where I had to pinch-to-zoom to read card effects ranked lower.",
    ],
    scope: [
      "Is card, board, and rule text readable without pinch-to-zoom?",
      "Does the app take advantage of touch controls, or does it feel like a mouse port?",
      "Is pass-and-play available for shared-device multiplayer?",
    ],
    items: [
      {
        gameSlug: "wingspan",
        blurb: "Wingspan automates all the engine-building math. Dragging a bird card onto the board with your finger feels tactile and natural, and the gorgeous bird illustrations actually have room to be appreciated on the iPad's display.",
      },
      {
        gameSlug: "root-board-game",
        blurb: "Root has four asymmetric factions with totally different rule sets. Teaching it to friends is a nightmare. The iPad app enforces the rules and lets you learn by doing. The animated 3D board looks fantastic.",
      },
      {
        gameSlug: "terraforming-mars",
        blurb: "Terraforming Mars has an overwhelming amount of resource cubes and tracks to manage. Playing it with a controller on Xbox is clunky, but on the iPad, tapping menus and adjusting resource tracks is fast and intuitive.",
      },
      {
        gameSlug: "carcassonne",
        blurb: "My absolute favorite game for pass-and-play local multiplayer. You hand someone the iPad, they drag a tile onto the board, and they pass it back. The app handles all the complicated field scoring automatically.",
      },
      {
        gameSlug: "through-the-ages",
        blurb: "A 3-hour tabletop game condensed into 45 minutes digitally. The iPad version organizes the massive sprawl of technology and leader cards into clean, readable UI panels that you can just tap through.",
      }
    ],
    category: "board",
    platform: "ios",
  },
  {
    slug: "best-rpg-games-for-android-tablets",
    title: "Best RPG games for Android tablets",
    description: "A curated list of RPG games for Android tablets — ranked on text readability and menu usability.",
    context: [
      "RPGs are long games. When a UI problem bothers you, it bothers you across dozens of hours. On Android tablets, where large-screen support has historically been inconsistent, finding an RPG that holds up for a full playthrough on a 10 or 11-inch screen takes more effort than it should. The games here are the ones I'd actually recommend committing to.",
      "The text readability issue hits RPGs harder than any other genre. Dialogue trees, item descriptions, quest logs, skill tooltips — RPGs are text-heavy by nature. A game that works fine on a 6-inch phone can be an exercise in squinting on a tablet if the UI doesn't scale properly.",
      "Everything here runs natively through the Play Store. Performance and interface quality are more predictable that way, and the rankings reflect that baseline.",
    ],
    scope: [
      "Is dialogue and item text comfortable to read at tablet scale?",
      "Do inventory, skill, and menu screens work properly with touch?",
      "Does the game run natively from the Play Store, not through emulation?",
    ],
    items: [
      {
        gameSlug: "baldurs-gate-enhanced",
        blurb: "Baldur's Gate on an Android tablet with a 10-inch screen is legible and comfortable. The touch adaptation is a massive step up from playing it on a phone, where the touch targets are impossibly small. It's the best way to play the classic Infinity Engine games natively on Android.",
      },
      {
        gameSlug: "crashlands-2",
        blurb: "A sprawling crafting RPG that proves you don't need a controller for action combat if the touch interface is designed well. The massive inventory system benefits from tablet space in a way that's hard to describe until you've tried to manage crafting on a phone.",
      },
      {
        gameSlug: "stardew-valley",
        blurb: "While technically a simulation game, Stardew's RPG elements are deep enough to warrant a mention here. The Android tablet version scales perfectly, meaning you can navigate the mines and manage your inventory without UI overlap.",
      }
    ],
    category: "rpg",
    platform: "android",
  },
  {
    slug: "games-for-ipad-pro",
    title: "Best games for iPad Pro",
    description: "Games that actually take advantage of iPad Pro hardware.",
    context: [
      "The iPad Pro has a better display than most computers people actually game on. ProMotion at 120Hz, wide color gamut, and a screen that runs 11 or 13 inches. Whether any of that matters for a specific game is the question this list tries to answer.",
      "For most games, an iPad Pro is overkill. The standard iPad Air runs everything fine. But there are specific cases where the Pro hardware changes the experience. Smooth 120fps animations, 1440p rendering, and raw processing power.",
      "Apple Pencil support is also underrated for gaming. Not many games support it well, but the ones that do make it hard to go back to fingers.",
    ],
    scope: [
      "Does the game benefit from ProMotion 120Hz or a larger display?",
      "Is there visual fidelity that justifies the Pro's display quality?",
      "Does the 13-inch screen change the gameplay experience, not just scale it up?",
    ],
    items: [
      {
        gameSlug: "divinity-original-sin-2",
        blurb: "Divinity runs at 1440p on the iPad Pro, matching high-end PC resolution. The 13-inch screen gives you the necessary real estate to see environmental hazards and manage your dense inventory without zooming.",
      },
      {
        gameSlug: "hades",
        blurb: "Hades at 60fps on a 13-inch ProMotion display with an Xbox controller is legitimately a console-quality experience lying flat on your lap. It pushes the M-series chips to maintain absolute fluidity during chaotic combat.",
      },
      {
        gameSlug: "balatro",
        blurb: "Balatro runs at a flawless 120fps on ProMotion displays. It feels incredibly smooth, and the haptic feedback on newer iPads syncs perfectly with the card movements. It's the definitive version of the game.",
      },
      {
        gameSlug: "civilization-vi",
        blurb: "The 13-inch iPad Pro matters most for strategy games. Civ VI's world map at 13 inches is closer to a desktop monitor experience than a tablet one. The M4 chip handles late-game AI turns far faster than older hardware.",
      },
      {
        gameSlug: "townscaper",
        blurb: "Townscaper with an Apple Pencil is more precise than with fingers. The massive, bright display of the Pro turns this simple procedural toy into a gorgeous, vibrant architectural canvas.",
      }
    ],
    platform: "ios",
  },
];

export function getCollectionLandingConfig(
  slug: string
): CollectionLandingConfig | null {
  return collectionLandingConfigs.find((config) => config.slug === slug) ?? null;
}
