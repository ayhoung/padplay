import type { Metadata } from "next";
import { GameForm } from "../GameForm";

export const metadata: Metadata = {
  title: "New Game · admin",
  robots: { index: false, follow: false },
};

export default function NewGamePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Add New Game
      </h1>
      <GameForm />
    </div>
  );
}
