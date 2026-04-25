import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGame } from "@/lib/api";
import {
  collectionLandingConfigs,
  getCollectionLandingConfig
} from "@/lib/seo";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";

interface CollectionPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return collectionLandingConfigs.map((config) => ({ slug: config.slug }));
}

export async function generateMetadata({
  params
}: CollectionPageProps): Promise<Metadata> {
  const config = getCollectionLandingConfig(params.slug);
  if (!config) return { title: "Not found" };

  return {
    title: config.title,
    description: config.description
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const config = getCollectionLandingConfig(params.slug);
  if (!config) notFound();

  const items = await Promise.all(
    config.items.map(async (item) => {
      const game = await fetchGame(item.gameSlug);
      return { game, blurb: item.blurb };
    })
  );

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
