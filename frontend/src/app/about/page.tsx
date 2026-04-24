import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  Hand,
  Package,
  Maximize2,
  ShieldCheck,
  Tablet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About & methodology",
  description:
    "How we score games for tablet-first experience and keep the leaderboard honest.",
};

const CRITERIA = [
  {
    icon: LayoutDashboard,
    title: "Native HUD",
    body: "Is the UI designed for a tablet, or is it an iPhone UI at 2×?",
  },
  {
    icon: Hand,
    title: "Input fit",
    body: "Multi-touch, controller, stylus — all wired up and first-class?",
  },
  {
    icon: Package,
    title: "Content parity",
    body: "Is this the full game, or a stripped mobile version?",
  },
  {
    icon: Maximize2,
    title: "Screen respect",
    body: "Does the art, font, and zoom actually use 12.9 inches?",
  },
  {
    icon: ShieldCheck,
    title: "No dark patterns",
    body: "Free-to-play exploitation and interstitial ads drop the score fast.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-brand-50 via-white to-transparent"
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-20">
        <section className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur">
            <Tablet className="h-3.5 w-3.5" aria-hidden />
            About PadPlay
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Tablets are{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              gaming hardware.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 leading-relaxed">
            11″ to 13″ screens, 120Hz refresh, and pro-grade chips. Most of what
            the App Store calls &ldquo;iPad games&rdquo; are iPhone apps that
            technically run. We sort the difference.
          </p>
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              The tablet score
            </h2>
            <span className="text-sm font-mono text-slate-400">0–100</span>
          </div>
          <p className="text-slate-600 max-w-2xl mb-10">
            Five criteria, weighted equally. Each game is reviewed by hand
            against every one.
          </p>

          <ul className="grid gap-4 sm:grid-cols-2">
            {CRITERIA.map(({ icon: Icon, title, body }, idx) => (
              <li
                key={title}
                className="group relative rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-300 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition group-hover:bg-brand-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">
                        0{idx + 1}
                      </span>
                      <h3 className="font-semibold text-slate-900">{title}</h3>
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                      {body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              How the list is maintained
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed max-w-2xl">
              Games are curated by hand — no user-generated voting yet. If you
              spot something we should add or remove,{" "}
              <Link
                href="/"
                className="font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-600"
              >
                submit it from the leaderboard
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
