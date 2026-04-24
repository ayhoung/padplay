/**
 * Title / developer similarity primitives and the single `isSameGame`
 * matcher used by every store-lookup path. Previously each script rolled its
 * own — refresh-ratings had a permissive substring matcher that let wrong
 * games (e.g. Diablo Immortal for "Divinity") overwrite URLs during
 * enrichment. One matcher, one set of primitives, one place to audit.
 */

export function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

export function tokenize(str: string): Set<string> {
  return new Set(
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length >= 2),
  );
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersect = 0;
  for (const t of a) if (b.has(t)) intersect += 1;
  const union = a.size + b.size - intersect;
  return union === 0 ? 0 : intersect / union;
}

/**
 * Developer-name similarity — tolerant of "Studio A / Publisher B" patterns
 * in the DB matching just "Studio A" on the store, or corporate suffixes
 * like "sp. z o.o." / "Inc." being tacked on.
 */
export function devSimilarity(dbDev: string, remoteDev: string): number {
  const a = normalize(dbDev);
  const b = normalize(remoteDev);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const parts = dbDev
    .split(/[/,&]/)
    .map((p) => normalize(p.trim()))
    .filter(Boolean);
  for (const p of parts) {
    if (!p) continue;
    if (b === p) return 0.95;
    if (b.includes(p) || p.includes(b)) return 0.85;
  }
  return jaccard(tokenize(dbDev), tokenize(remoteDev));
}

export interface IsSameGameInput {
  dbTitle: string;
  remoteTitle: string;
  dbDeveloper?: string | null;
  remoteDeveloper?: string | null;
}

export interface IsSameGameResult {
  ok: boolean;
  confidence: number;
  reason: string;
}

/**
 * Returns `ok: true` only when we're confident the remote product is the
 * same game as the DB row. When developers are supplied on both sides we
 * loosen the title threshold on agreement and tighten it on disagreement —
 * which is the guard that would have rejected "Diablo Immortal" as a match
 * for "Divinity: Original Sin 2" even if their titles had somehow overlapped.
 *
 * This is intentionally conservative: false positives from the old substring
 * matcher caused the data-integrity bug; false negatives here just mean we
 * leave a URL null, which is the safe default.
 */
export function isSameGame(input: IsSameGameInput): IsSameGameResult {
  const { dbTitle, remoteTitle, dbDeveloper, remoteDeveloper } = input;
  const nDb = normalize(dbTitle);
  const nRemote = normalize(remoteTitle);
  if (!nDb || !nRemote) return { ok: false, confidence: 0, reason: "empty title" };
  if (nDb === nRemote) return { ok: true, confidence: 1, reason: "exact title" };

  const shorter = nDb.length < nRemote.length ? nDb : nRemote;
  const longer = nDb.length < nRemote.length ? nRemote : nDb;
  const prefixMatch =
    longer.startsWith(shorter) && shorter.length / longer.length >= 0.6;

  const sim = jaccard(tokenize(dbTitle), tokenize(remoteTitle));

  const devsKnown = !!dbDeveloper && !!remoteDeveloper;
  const devSim = devsKnown ? devSimilarity(dbDeveloper!, remoteDeveloper!) : null;
  const devsMatch = devSim !== null && devSim >= 0.8;
  const devsKnownDifferent = devSim !== null && devSim < 0.3;

  const threshold = devsMatch ? 0.5 : devsKnownDifferent ? 0.85 : 0.7;
  const ok = prefixMatch || sim >= threshold;
  const confidence = Math.max(sim, prefixMatch ? 0.6 : 0);

  let reason: string;
  if (ok) {
    reason = prefixMatch ? "prefix match" : `title similarity ${sim.toFixed(2)}`;
    if (devsMatch) reason += " + developers match";
  } else {
    reason = `title similarity ${sim.toFixed(2)} < ${threshold.toFixed(2)}`;
    if (devsKnownDifferent) reason += " (developers differ)";
  }

  return { ok, confidence, reason };
}
