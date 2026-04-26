import type { Metadata } from "next";
import { AdminGamesClient } from "./AdminGamesClient";

export const metadata: Metadata = {
  title: "Games · admin",
  robots: { index: false, follow: false },
};

export default function AdminGamesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Games Management
      </h1>
      <AdminGamesClient />
    </div>
  );
}
