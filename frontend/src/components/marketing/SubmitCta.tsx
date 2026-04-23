const ISSUE_URL =
  "https://github.com/ayhoung/padplay/issues/new?title=Game%20suggestion%3A%20&body=Game%20title%3A%0AStore%20link%3A%0AWhy%20it%20belongs%20on%20PadPlay%3A%0A";

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
          Submit it through GitHub and include the store link. That gives us a
          lightweight review queue without adding a new backend form flow.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={ISSUE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Suggest a game
        </a>
        <a
          href="/about"
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Read the scoring method
        </a>
      </div>
    </section>
  );
}
