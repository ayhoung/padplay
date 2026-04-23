"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import {
  QUESTIONNAIRE_ITEMS,
  type QuestionnaireAnswers,
  type SubmissionEnrichPreview,
} from "@padplay/shared-types";
import { createSubmission, previewSubmission } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Step = "urls" | "questionnaire" | "done";

const EMPTY_ANSWERS: QuestionnaireAnswers = {
  nativeTabletUi: false,
  landscapeReady: false,
  stylusSupport: false,
  offlinePlay: false,
  cleanMonetization: false,
  controllerSupport: false,
};

export function SubmitForm() {
  const [step, setStep] = useState<Step>("urls");
  const [appStoreUrl, setAppStoreUrl] = useState("");
  const [playStoreUrl, setPlayStoreUrl] = useState("");
  const [preview, setPreview] = useState<SubmissionEnrichPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [userPitch, setUserPitch] = useState("");
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(EMPTY_ANSWERS);
  const [submitted, setSubmitted] = useState<string | null>(null);

  async function handlePreview(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!appStoreUrl && !playStoreUrl) {
      setError("Paste at least one store URL.");
      return;
    }
    setLoading(true);
    trackEvent("submission_preview_started", {
      has_app_store_url: Boolean(appStoreUrl),
      has_play_store_url: Boolean(playStoreUrl),
    });
    try {
      const data = await previewSubmission({
        appStoreUrl: appStoreUrl || undefined,
        playStoreUrl: playStoreUrl || undefined,
      });
      trackEvent("submission_preview_succeeded", {
        guessed_category: data.guessedCategory,
        has_app_store_url: Boolean(data.appStoreUrl),
        has_play_store_url: Boolean(data.playStoreUrl),
      });
      setPreview(data);
      setStep("questionnaire");
    } catch (err) {
      trackEvent("submission_preview_failed", {
        has_app_store_url: Boolean(appStoreUrl),
        has_play_store_url: Boolean(playStoreUrl),
      });
      setError(err instanceof Error ? err.message : "Could not find that app.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    trackEvent("submission_submitted", {
      checked_answer_count: Object.values(answers).filter(Boolean).length,
      has_pitch: Boolean(userPitch.trim()),
    });
    try {
      const res = await createSubmission({
        email,
        appStoreUrl: appStoreUrl || undefined,
        playStoreUrl: playStoreUrl || undefined,
        answers,
        userPitch,
      });
      trackEvent("submission_completed", {
        checked_answer_count: Object.values(answers).filter(Boolean).length,
        has_pitch: Boolean(userPitch.trim()),
      });
      setSubmitted(res.message);
      setStep("done");
    } catch (err) {
      trackEvent("submission_failed", {
        checked_answer_count: Object.values(answers).filter(Boolean).length,
        has_pitch: Boolean(userPitch.trim()),
      });
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- done ----------------
  if (step === "done") {
    return (
      <div className="rounded-lg border border-brand-200 bg-brand-50 p-6 text-brand-900">
        <div className="flex items-start gap-3">
          <Check className="h-6 w-6 flex-shrink-0 text-brand-600" aria-hidden />
          <div>
            <h2 className="font-semibold text-lg">Submitted</h2>
            <p className="mt-1 text-sm">{submitted}</p>
            <button
              type="button"
              onClick={() => {
                trackEvent("submission_restart");
                setStep("urls");
                setAppStoreUrl("");
                setPlayStoreUrl("");
                setEmail("");
                setUserPitch("");
                setAnswers(EMPTY_ANSWERS);
                setPreview(null);
                setSubmitted(null);
              }}
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 underline"
            >
              Submit another game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- step 1: urls ----------------
  if (step === "urls") {
    return (
      <form onSubmit={handlePreview} className="space-y-5">
        <FormField
          label="App Store URL"
          hint="e.g. https://apps.apple.com/us/app/stardew-valley/id1406710800"
        >
          <input
            type="url"
            value={appStoreUrl}
            onChange={(e) => setAppStoreUrl(e.target.value)}
            placeholder="https://apps.apple.com/…"
            className={inputClass}
          />
        </FormField>

        <FormField
          label="Google Play URL"
          hint="e.g. https://play.google.com/store/apps/details?id=com.chucklefish.stardewvalley"
        >
          <input
            type="url"
            value={playStoreUrl}
            onChange={(e) => setPlayStoreUrl(e.target.value)}
            placeholder="https://play.google.com/store/apps/details?id=…"
            className={inputClass}
          />
        </FormField>

        <p className="text-sm text-slate-500">
          At least one is required. If the game is on both stores, paste both.
        </p>

        {error && <ErrorBox>{error}</ErrorBox>}

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Looking
              up…
            </>
          ) : (
            <>
              Continue <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </form>
    );
  }

  // ---------------- step 2: questionnaire ----------------
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {preview && (
        <section className="rounded-lg border border-slate-200 bg-white p-4 flex items-start gap-4">
          {preview.iconUrl && (
            <Image
              src={preview.iconUrl}
              alt=""
              width={72}
              height={72}
              className="rounded-xl flex-shrink-0"
              unoptimized
            />
          )}
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">
              {preview.title}
            </p>
            <p className="text-sm text-slate-500 truncate">
              {preview.developer}
              {preview.releaseYear ? ` · ${preview.releaseYear}` : ""}
              {" · "}category we guessed:{" "}
              <span className="font-medium text-slate-700">
                {preview.guessedCategory}
              </span>
            </p>
            {preview.shortDescription && (
              <p className="mt-2 text-sm text-slate-700 line-clamp-2">
                {preview.shortDescription}
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                trackEvent("submission_preview_reset");
                setStep("urls");
                setPreview(null);
              }}
              className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Not the right game? Change URL
            </button>
          </div>
        </section>
      )}

      <fieldset className="space-y-2">
        <legend className="text-lg font-semibold text-slate-900 mb-2">
          Why does this game belong on a tablet?
        </legend>
        <div className="space-y-1.5">
          {QUESTIONNAIRE_ITEMS.map((item) => (
            <label
              key={item.key}
              className="flex items-start gap-3 p-3 rounded border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={answers[item.key]}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [item.key]: e.target.checked }))
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              <div className="text-sm">
                <div className="font-medium text-slate-900">{item.label}</div>
                <div className="text-slate-500">{item.description}</div>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <FormField
        label="What makes this game great on a tablet?"
        hint="One or two sentences. Optional."
      >
        <textarea
          value={userPitch}
          onChange={(e) => setUserPitch(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="The map UI finally uses the whole screen, and Apple Pencil makes it feel like drafting on paper…"
          className={cn(inputClass, "resize-y")}
        />
      </FormField>

      <FormField
        label="Your email"
        hint="So we can let you know when it's approved. Never published."
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </FormField>

      {error && <ErrorBox>{error}</ErrorBox>}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setStep("urls")}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Back
        </button>
        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Submitting…
            </>
          ) : (
            "Submit for review"
          )}
        </button>
      </div>
    </form>
  );
}

// ------------ helpers ------------

const inputClass =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

const primaryBtn =
  "inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500";

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-1">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
    >
      {children}
    </div>
  );
}
