"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Loader2, X } from "lucide-react";
import {
  QUESTIONNAIRE_ITEMS,
  type PendingSubmission,
} from "@padplay/shared-types";
import {
  approveSubmission,
  fetchSubmissions,
  rejectSubmission,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type StatusFilter = "pending" | "approved" | "rejected" | "all";

export function AdminSubmissionsClient() {
  const { user, isLoading: authLoading } = useAuth();
  const isSessionAdmin = user?.isAdmin === true;

  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [submissions, setSubmissions] = useState<PendingSubmission[] | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount (legacy fallback for non-session users)
  useEffect(() => {
    const saved = localStorage.getItem("padplay_admin_token");
    if (saved) {
      setToken(saved);
      setTokenInput(saved);
    }
  }, []);

  const authed = isSessionAdmin || Boolean(token);
  const apiToken = isSessionAdmin ? null : token;

  const load = useCallback(
    async (t: string | null, s: StatusFilter) => {
      setError(null);
      try {
        const rows = await fetchSubmissions(t, s);
        setSubmissions(rows);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Load failed");
        setSubmissions(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (authed) load(apiToken, status);
  }, [authed, apiToken, status, load]);

  function saveToken() {
    setToken(tokenInput);
    localStorage.setItem("padplay_admin_token", tokenInput);
  }

  async function handleApprove(id: number) {
    setBusy(id);
    try {
      const { slug } = await approveSubmission(apiToken, id);
      await load(apiToken, status);
      alert(`Approved → /games/${slug}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Approve failed");
    } finally {
      setBusy(null);
    }
  }

  async function handleReject(id: number) {
    const reason = window.prompt("Rejection reason (optional, sent internally):") ?? "";
    setBusy(id);
    try {
      await rejectSubmission(apiToken, id, reason);
      await load(apiToken, status);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Reject failed");
    } finally {
      setBusy(null);
    }
  }

  if (authLoading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  // Not a session admin and no token → show token prompt (legacy fallback).
  if (!authed) {
    return (
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600 mb-3">
          Log in as an admin, or paste an admin token.
        </p>
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="ADMIN_TOKEN"
          className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={saveToken}
          className="mt-3 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Load
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-1 text-sm">
          {(["pending", "approved", "rejected", "all"] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={
                  "px-3 py-1.5 rounded-full border " +
                  (s === status
                    ? "bg-brand-600 border-brand-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50")
                }
              >
                {s}
              </button>
            ),
          )}
        </div>
        {isSessionAdmin ? (
          <span className="text-xs text-slate-500">
            Signed in as <span className="font-mono">{user?.email}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("padplay_admin_token");
              setToken("");
              setTokenInput("");
            }}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Clear token
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {submissions === null ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : submissions.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          No submissions in this bucket.
        </p>
      ) : (
        <ul className="space-y-4">
          {submissions.map((s) => (
            <SubmissionCard
              key={s.id}
              sub={s}
              busy={busy === s.id}
              onApprove={() => handleApprove(s.id)}
              onReject={() => handleReject(s.id)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function SubmissionCard({
  sub,
  busy,
  onApprove,
  onReject,
}: {
  sub: PendingSubmission;
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-4">
        {sub.iconUrl && (
          <Image
            src={sub.iconUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-xl flex-shrink-0"
            unoptimized
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">
                {sub.title ?? "(no title)"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {sub.developer} · {sub.category} · {sub.platforms} ·{" "}
                {sub.priceUsd != null ? `$${sub.priceUsd}` : "Free"} · Submitted{" "}
                {new Date(sub.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-2xl font-bold text-brand-700 leading-none">
                {sub.computedTabletScore ?? "—"}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-wide">
                score
              </div>
            </div>
          </div>

          {sub.shortDescription && (
            <p className="mt-2 text-sm text-slate-700 line-clamp-2">
              {sub.shortDescription}
            </p>
          )}

          <ul className="mt-3 flex flex-wrap gap-1.5 text-xs">
            {QUESTIONNAIRE_ITEMS.map((item) => {
              const yes = sub.questionnaire?.[item.key];
              return (
                <li
                  key={item.key}
                  className={
                    "inline-flex items-center gap-1 rounded px-2 py-0.5 " +
                    (yes
                      ? "bg-brand-100 text-brand-800"
                      : "bg-slate-100 text-slate-400 line-through")
                  }
                >
                  {yes ? (
                    <Check className="h-3 w-3" aria-hidden />
                  ) : (
                    <X className="h-3 w-3" aria-hidden />
                  )}
                  {item.label}
                </li>
              );
            })}
          </ul>

          {sub.userPitch && (
            <blockquote className="mt-3 rounded border-l-2 border-brand-400 bg-slate-50 p-3 text-sm italic text-slate-700">
              “{sub.userPitch}”
            </blockquote>
          )}

          <div className="mt-3 text-xs text-slate-500 space-y-0.5">
            <div>
              Submitter: <span className="font-mono">{sub.submitterEmail}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sub.appStoreUrl && (
                <a
                  href={sub.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-900"
                >
                  App Store ↗
                </a>
              )}
              {sub.playStoreUrl && (
                <a
                  href={sub.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-slate-900"
                >
                  Play Store ↗
                </a>
              )}
            </div>
          </div>

          {sub.status === "pending" ? (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onApprove}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Check className="h-4 w-4" aria-hidden />
                )}
                Approve
              </button>
              <button
                type="button"
                onClick={onReject}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                <X className="h-4 w-4" aria-hidden />
                Reject
              </button>
            </div>
          ) : (
            <div className="mt-3 text-xs">
              <span
                className={
                  sub.status === "approved"
                    ? "text-emerald-700"
                    : "text-rose-700"
                }
              >
                {sub.status}
              </span>
              {sub.approvedSlug && (
                <>
                  {" — "}
                  <Link
                    href={`/games/${sub.approvedSlug}`}
                    className="underline hover:text-slate-900"
                  >
                    view game
                  </Link>
                </>
              )}
              {sub.rejectionReason && (
                <>
                  {" — "}
                  <span className="italic text-slate-500">
                    {sub.rejectionReason}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
