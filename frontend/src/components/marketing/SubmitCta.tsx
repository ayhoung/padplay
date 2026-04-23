"use client";

import { trackEvent } from "@/lib/analytics";

interface SubmitCtaProps {
  compact?: boolean;
}

export function SubmitCta({ compact = false }: SubmitCtaProps) {
  return (
    <section
      className={`rounded-2xl border border-brand-200 bg-brand-50 ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className={compact ? "" : "max-w-2xl"}>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Know a great tablet game we missed?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Send it through the submission flow with the store link and a few
          notes on why it deserves a tablet-first spot.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href="/submit"
          onClick={() =>
            trackEvent("submit_cta_click", {
              placement: compact ? "detail_sidebar" : "marketing_section"
            })
          }
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Suggest a game
        </a>
        <a
          href="/about"
          onClick={() =>
            trackEvent("marketing_methodology_click", {
              placement: compact ? "detail_sidebar" : "marketing_section"
            })
          }
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Read the scoring method
        </a>
      </div>
    </section>
  );
}
