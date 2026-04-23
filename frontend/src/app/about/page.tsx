import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About & methodology",
  description:
    "How we score games for tablet-first experience and keep the leaderboard honest.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 prose prose-slate">
      <h1>About PadPlay</h1>
      <p>
        Tablets are gaming hardware. They have 11&quot; to 13&quot; screens,
        120Hz refresh, and pro-grade chips. Most of what the App Store calls
        &quot;iPad games&quot; are iPhone apps that technically run. We sort
        the difference.
      </p>

      <h2>The tablet score (0–100)</h2>
      <p>We weight five criteria:</p>
      <ul>
        <li>
          <strong>Native HUD</strong> — Is the UI designed for a tablet, or
          is it an iPhone UI at 2×?
        </li>
        <li>
          <strong>Input fit</strong> — Multi-touch, controller, stylus; all
          wired up and first-class?
        </li>
        <li>
          <strong>Content parity</strong> — Is this the full game, or a
          stripped mobile version?
        </li>
        <li>
          <strong>Screen respect</strong> — Does the art, font, and zoom
          actually use 12.9 inches?
        </li>
        <li>
          <strong>No dark patterns</strong> — Free-to-play exploitation and
          interstitial ads drop the score fast.
        </li>
      </ul>

      <h2>How the list is maintained</h2>
      <p>
        Games are curated by hand — no user-generated voting yet. If you
        spot something we should add or remove, get in touch.
      </p>
    </div>
  );
}
