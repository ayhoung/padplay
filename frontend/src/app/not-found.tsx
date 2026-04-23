import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Not found</h1>
      <p className="mt-2 text-slate-600">
        That page doesn&apos;t exist. Maybe it was built for iPhone.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
      >
        Back to leaderboard
      </Link>
    </div>
  );
}
