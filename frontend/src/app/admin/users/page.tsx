import type { Metadata } from "next";
import { AdminUsersClient } from "./AdminUsersClient";

export const metadata: Metadata = {
  title: "Users · admin",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin roles</h1>
      <p className="mb-6 text-sm text-slate-600">
        Manually grant, update, and revoke admin access for registered users.
      </p>
      <AdminUsersClient />
    </div>
  );
}
