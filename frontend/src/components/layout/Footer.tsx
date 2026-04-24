import Link from "next/link";
import { curatedLinks } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

        {/* Curated internal links — SEO value, visible to crawlers and users */}
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Explore
          </p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {curatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-slate-500 hover:text-slate-900"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} PadPlay. Not affiliated with Apple or Google.
          </p>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          App Store and Google Play links are informational only. We may earn ad
          revenue from page views.
        </p>
      </div>
    </footer>
  );
}
