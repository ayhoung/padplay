import type { Metadata } from "next";
import { fetchGame } from "@/lib/api";
import { getPlatformLandingConfig } from "@/lib/seo";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";

const config = getPlatformLandingConfig("android");

export const metadata: Metadata = {
  title: config.title,
  description: config.description
};

export default async function AndroidTabletGamesPage() {
  const items = await Promise.all(
    config.items.map(async (item) => {
      const game = await fetchGame(item.gameSlug);
      return { game, blurb: item.blurb };
    })
  );

  // Filter out any missing games
  const validItems = items.filter((item): item is { game: NonNullable<typeof item.game>; blurb: string } => item.game !== null);

  return (
    <SeoLandingPage
      title={config.title}
      description={config.description}
      context={config.context}
      scope={config.scope}
      items={validItems}
    />
  );
}
