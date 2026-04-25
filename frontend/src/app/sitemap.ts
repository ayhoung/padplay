import type { MetadataRoute } from "next";
import { GAME_CATEGORIES } from "@padplay/shared-types";
import { collectionLandingConfigs } from "@/lib/seo";
import { fetchGames } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Fetch all game slugs for individual game page entries
  let gameSlugs: string[] = [];
  try {
    const { games } = await fetchGames({ sort: "score", limit: 200 });
    gameSlugs = games.map((g) => g.slug);
  } catch {
    // Sitemap still works without game pages if the API is down
  }

  return [
    {
      url: "https://padplay.app",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://padplay.app/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://padplay.app/best-ipad-games",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://padplay.app/android-tablet-games",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...collectionLandingConfigs.map((config) => ({
      url: `https://padplay.app/collections/${config.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...GAME_CATEGORIES.map((category) => ({
      url: `https://padplay.app/categories/${category}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...gameSlugs.map((slug) => ({
      url: `https://padplay.app/games/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
