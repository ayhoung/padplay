import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PadPlay. Not affiliated with Apple or Google.
          </p>
          <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
            <Link href="/best-ipad-games" className="hover:text-slate-900">
              Best iPad Games
            </Link>
            <Link href="/android-tablet-games" className="hover:text-slate-900">
              Android Tablet Games
            </Link>
            <Link href="/categories/strategy" className="hover:text-slate-900">
              Strategy
            </Link>
            <Link href="/categories/board" className="hover:text-slate-900">
              Board Games
            </Link>
          </nav>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          App Store and Google Play links are informational only. We may earn ad
          revenue from page views.
        </p>
      </div>
    </footer>
  );
}
