import { Quote, Star } from "lucide-react";
import type { UserQuote } from "@padplay/shared-types";

const SOURCE_LABEL: Record<UserQuote["source"], string> = {
  app_store: "App Store",
  play_store: "Play Store",
  reddit: "Reddit",
};

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function Quotes({ quotes }: { quotes: UserQuote[] }) {
  if (!quotes.length) return null;
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">
        What tablet players say
      </h2>
      <ul className="space-y-3">
        {quotes.map((q, idx) => (
          <li
            key={`${q.author}-${idx}`}
            className="rounded-lg border border-slate-200 bg-white p-4 text-sm"
          >
            <div className="flex items-start gap-2">
              <Quote className="h-4 w-4 flex-shrink-0 text-brand-500 mt-0.5" aria-hidden />
              <p className="text-slate-800 leading-relaxed">{q.text}</p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{q.author}</span>
              {q.rating !== null && (
                <span className="inline-flex items-center gap-0.5" aria-label={`${q.rating} stars`}>
                  {Array.from({ length: q.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                  ))}
                </span>
              )}
              <span>· {SOURCE_LABEL[q.source]}</span>
              {q.date && <span>· {formatDate(q.date)}</span>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
