import type { QuestionnaireAnswers } from "@padplay/shared-types";

/**
 * Compute a rough tablet score from questionnaire answers.
 * Base 55; each "yes" adds 6 points. Max 91 from user submission —
 * admin can boost to 95+ on approval if the game deserves it.
 */
export function computeTabletScore(answers: QuestionnaireAnswers): number {
  const yesses = Object.values(answers).filter((v) => v === true).length;
  return Math.min(91, 55 + yesses * 6);
}

/** Build tablet_features array from questionnaire true answers. */
export function answersToFeatures(answers: QuestionnaireAnswers): string[] {
  const out: string[] = [];
  if (answers.nativeTabletUi) out.push("Native tablet UI");
  if (answers.landscapeReady) out.push("Landscape-ready");
  if (answers.stylusSupport) out.push("Stylus / Apple Pencil support");
  if (answers.offlinePlay) out.push("Offline play");
  if (answers.cleanMonetization) out.push("No dark patterns");
  if (answers.controllerSupport) out.push("Controller support");
  return out;
}

/** Derive "ios" | "android" | "both" from which URLs were submitted. */
export function derivePlatforms(
  appStoreUrl: string | null,
  playStoreUrl: string | null,
): "ios" | "android" | "both" {
  if (appStoreUrl && playStoreUrl) return "both";
  if (appStoreUrl) return "ios";
  return "android";
}

// ------------- Simple IP rate limit (in-memory) -------------

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 3; // max 3 submissions per window per IP

const ipWindow = new Map<string, number[]>();

export function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (ipWindow.get(ip) ?? []).filter((t) => t > cutoff);
  if (hits.length >= RATE_LIMIT_MAX) {
    ipWindow.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipWindow.set(ip, hits);
  return true;
}

// ------------- Email validation -------------

export function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && e.length <= 200;
}
