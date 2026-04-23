import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

/** Build a list of page numbers to display: always first, last, current ± 1, with ellipses. */
function visiblePages(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) out.push("…");
    out.push(sorted[i]);
  }
  return out;
}

export function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;
  const prev = currentPage - 1;
  const next = currentPage + 1;
  const pages = visiblePages(currentPage, totalPages);

  return (
    <nav
      className="mt-8 flex items-center justify-center gap-1 flex-wrap"
      aria-label="Pagination"
    >
      <Link
        href={prev >= 1 ? buildHref(prev) : "#"}
        aria-disabled={prev < 1}
        tabIndex={prev < 1 ? -1 : 0}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border",
          prev < 1
            ? "border-slate-200 text-slate-300 pointer-events-none"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        )}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Prev
      </Link>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-slate-400" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              "min-w-9 text-center px-3 py-1.5 rounded-md text-sm font-medium border",
              p === currentPage
                ? "bg-brand-600 border-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {p}
          </Link>
        ),
      )}
      <Link
        href={next <= totalPages ? buildHref(next) : "#"}
        aria-disabled={next > totalPages}
        tabIndex={next > totalPages ? -1 : 0}
        className={cn(
          "inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium border",
          next > totalPages
            ? "border-slate-200 text-slate-300 pointer-events-none"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </nav>
  );
}
