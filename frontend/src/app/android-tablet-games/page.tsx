import type { Metadata } from "next";
import { fetchGames } from "@/lib/api";
import { getPlatformLandingCopy } from "@/lib/seo";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";

const copy = getPlatformLandingCopy("android");

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description
};

export default async function AndroidTabletGamesPage() {
  const { games } = await fetchGames({
    platform: "android",
    sort: "score",
    limit: 24
  });

  return (
    <SeoLandingPage
      title={copy.title}
      description={copy.description}
      intro={copy.intro}
      games={games}
      signals={copy.signals}
    />
  );
}
