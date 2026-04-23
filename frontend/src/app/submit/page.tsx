import type { Metadata } from "next";
import { SubmitForm } from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit a tablet game",
  description:
    "Submit a game you think belongs on the PadPlay leaderboard. Paste an App Store or Play Store link and tell us what makes it great on a tablet.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Submit a tablet game
        </h1>
        <p className="mt-2 text-slate-600">
          Know a game that genuinely deserves to be played on a tablet? Paste
          the store link, answer six quick questions, and we&apos;ll review it.
        </p>
      </header>
      <SubmitForm />
    </div>
  );
}
