import Link from "next/link";
import { Tablet } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Tablet className="h-5 w-5 text-brand-600" aria-hidden />
          <span>PadPlay</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Leaderboard
          </Link>
          <Link href="/best-ipad-games" className="hover:text-slate-900">
            Best iPad Games
          </Link>
          <Link href="/about" className="hover:text-slate-900">
            About
          </Link>
          <Link
            href="/submit"
            className="rounded-md bg-brand-600 px-3 py-1.5 text-white font-medium hover:bg-brand-700"
          >
            Submit
          </Link>
        </nav>
      </div>
    </header>
  );
}
