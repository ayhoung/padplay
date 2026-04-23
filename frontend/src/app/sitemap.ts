import type { MetadataRoute } from "next";
import { GAME_CATEGORIES } from "@padplay/shared-types";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://padplay.app",
      lastModified: now
    },
    {
      url: "https://padplay.app/about",
      lastModified: now
    },
    {
      url: "https://padplay.app/best-ipad-games",
      lastModified: now
    },
    {
      url: "https://padplay.app/android-tablet-games",
      lastModified: now
    },
    ...GAME_CATEGORIES.map((category) => ({
      url: `https://padplay.app/categories/${category}`,
      lastModified: now
    }))
  ];
}
