export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} PadPlay. Not affiliated with Apple or Google.</p>
        <p className="text-xs">
          App Store and Google Play links are informational only. We may earn
          ad revenue from page views.
        </p>
      </div>
    </footer>
  );
}
