import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchGame } from "@/lib/api";
import { GameForm } from "../GameForm";

export const metadata: Metadata = {
  title: "Edit Game · admin",
  robots: { index: false, follow: false },
};

export default async function EditGamePage({ params }: { params: { slug: string } }) {
  const game = await fetchGame(params.slug);
  if (!game) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Edit {game.title}
      </h1>
      <GameForm initialData={game} />
    </div>
  );
}
