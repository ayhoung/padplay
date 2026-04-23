import type { Metadata } from "next";
import { AdminSubmissionsClient } from "./AdminSubmissionsClient";

export const metadata: Metadata = {
  title: "Submissions · admin",
  robots: { index: false, follow: false },
};

export default function AdminSubmissionsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Submission review
      </h1>
      <AdminSubmissionsClient />
    </div>
  );
}
