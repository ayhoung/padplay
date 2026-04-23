import Link from "next/link";
import { curatedLinks } from "@/lib/seo";

export function DiscoveryLinks() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="max-w-2xl">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Browse by search intent, not just by rank
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          These pages are built to answer the exact queries people use when they
          want tablet-native games, category picks, or platform-specific lists.
        </p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {curatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50"
          >
            <div className="text-sm font-semibold text-slate-900">{link.title}</div>
            <p className="mt-1 text-sm leading-6 text-slate-600">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
