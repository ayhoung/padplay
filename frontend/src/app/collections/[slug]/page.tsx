import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGames } from "@/lib/api";
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

  const { games } = await fetchGames({
    category: config.category,
    platform: config.platform,
    sort: "score",
    limit: 24
  });

  return (
    <SeoLandingPage
      title={config.title}
      description={config.description}
      intro={config.intro}
      games={games}
      signals={config.signals}
      bodyParagraphs={config.bodyParagraphs}
    />
  );
}
