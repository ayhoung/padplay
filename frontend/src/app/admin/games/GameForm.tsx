"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GAME_CATEGORIES, type Game, type GameCreateRequest, type GameUpdateRequest } from "@padplay/shared-types";
import { createAdminGame, updateAdminGame } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

interface GameFormProps {
  initialData?: Game;
}

export function GameForm({ initialData }: GameFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  // Use a fallback to localStorage if no session user
  const token = user?.isAdmin ? null : (typeof window !== "undefined" ? localStorage.getItem("padplay_admin_token") : null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    slug: initialData?.slug ?? "",
    title: initialData?.title ?? "",
    developer: initialData?.developer ?? "",
    category: initialData?.category ?? "action",
    platforms: initialData?.platforms ?? "both",
    tabletScore: initialData?.tabletScore ?? 80,
    priceUsd: initialData?.priceUsd?.toString() ?? "",
    shortDescription: initialData?.shortDescription ?? "",
    tabletFeatures: initialData?.tabletFeatures?.join("\n") ?? "",
    appStoreUrl: initialData?.appStoreUrl ?? "",
    playStoreUrl: initialData?.playStoreUrl ?? "",
    thumbnail: initialData?.thumbnail ?? "",
    iconUrl: initialData?.iconUrl ?? "",
    screenshots: initialData?.screenshots?.join("\n") ?? "",
    iosRating: initialData?.iosRating?.toString() ?? "",
    iosRatingCount: initialData?.iosRatingCount?.toString() ?? "",
    androidRating: initialData?.androidRating?.toString() ?? "",
    androidRatingCount: initialData?.androidRatingCount?.toString() ?? "",
    releaseYear: initialData?.releaseYear ?? new Date().getFullYear(),
  });

  const isEditing = Boolean(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: GameCreateRequest = {
        slug: formData.slug,
        title: formData.title,
        developer: formData.developer,
        category: formData.category as any,
        platforms: formData.platforms as any,
        tabletScore: Number(formData.tabletScore),
        priceUsd: formData.priceUsd ? Number(formData.priceUsd) : null,
        shortDescription: formData.shortDescription,
        tabletFeatures: formData.tabletFeatures.split("\n").map(s => s.trim()).filter(Boolean),
        appStoreUrl: formData.appStoreUrl || null,
        playStoreUrl: formData.playStoreUrl || null,
        thumbnail: formData.thumbnail,
        iconUrl: formData.iconUrl || null,
        screenshots: formData.screenshots.split("\n").map(s => s.trim()).filter(Boolean),
        iosRating: formData.iosRating ? Number(formData.iosRating) : null,
        iosRatingCount: formData.iosRatingCount ? Number(formData.iosRatingCount) : null,
        androidRating: formData.androidRating ? Number(formData.androidRating) : null,
        androidRatingCount: formData.androidRatingCount ? Number(formData.androidRatingCount) : null,
        releaseYear: Number(formData.releaseYear),
      };

      if (isEditing && initialData) {
        await updateAdminGame(token, initialData.slug, payload);
      } else {
        await createAdminGame(token, payload);
      }

      router.push("/admin/games");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-slate-200 shadow-sm max-w-4xl mx-auto">
      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900">Title</label>
          <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">Slug</label>
          <input required name="slug" value={formData.slug} onChange={handleChange} disabled={isEditing} className={`${inputClass} ${isEditing ? "bg-slate-100" : ""}`} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Developer</label>
          <input required name="developer" value={formData.developer} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">Release Year</label>
          <input required type="number" name="releaseYear" value={formData.releaseYear} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
            {GAME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">Platforms</label>
          <select name="platforms" value={formData.platforms} onChange={handleChange} className={inputClass}>
            <option value="both">Both</option>
            <option value="ios">iOS Only</option>
            <option value="android">Android Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Tablet Score (0-100)</label>
          <input required type="number" name="tabletScore" value={formData.tabletScore} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">Price (USD)</label>
          <input type="number" step="0.01" name="priceUsd" value={formData.priceUsd} onChange={handleChange} className={inputClass} placeholder="Free if empty" />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900">Short Description</label>
          <textarea required name="shortDescription" rows={2} value={formData.shortDescription} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">Thumbnail URL</label>
          <input required name="thumbnail" type="url" value={formData.thumbnail} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">Icon URL</label>
          <input name="iconUrl" type="url" value={formData.iconUrl} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900">App Store URL</label>
          <input name="appStoreUrl" type="url" value={formData.appStoreUrl} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900">Play Store URL</label>
          <input name="playStoreUrl" type="url" value={formData.playStoreUrl} onChange={handleChange} className={inputClass} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900">iOS Rating</label>
            <input type="number" step="0.1" name="iosRating" value={formData.iosRating} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900">Count</label>
            <input type="number" name="iosRatingCount" value={formData.iosRatingCount} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900">Android Rating</label>
            <input type="number" step="0.1" name="androidRating" value={formData.androidRating} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900">Count</label>
            <input type="number" name="androidRatingCount" value={formData.androidRatingCount} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900">Screenshots (One URL per line)</label>
          <textarea name="screenshots" rows={3} value={formData.screenshots} onChange={handleChange} className={inputClass} />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-slate-900">Tablet Features (One per line)</label>
          <textarea name="tabletFeatures" rows={3} value={formData.tabletFeatures} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.push("/admin/games")}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-md hover:bg-brand-700 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Game"}
        </button>
      </div>
    </form>
  );
}
