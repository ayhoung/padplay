import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  GAME_CATEGORIES,
  type GameCategory
} from "@padplay/shared-types";
import { fetchGame } from "@/lib/api";
import { categoryLandingConfigs } from "@/lib/seo";
import { SeoLandingPage } from "@/components/marketing/SeoLandingPage";

interface CategoryPageProps {
  params: { category: string };
}

function parseCategory(value: string): GameCategory | null {
  return (GAME_CATEGORIES as string[]).includes(value)
    ? (value as GameCategory)
    : null;
}

export function generateStaticParams() {
  return GAME_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const category = parseCategory(params.category);
  if (!category) return { title: "Not found" };

  const config = categoryLandingConfigs[category];
  return {
    title: config.title,
    description: config.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = parseCategory(params.category);
  if (!category) notFound();

  const config = categoryLandingConfigs[category];
  
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
