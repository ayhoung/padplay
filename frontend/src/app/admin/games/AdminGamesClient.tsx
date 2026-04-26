"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import type { Game } from "@padplay/shared-types";
import { fetchGames, deleteAdminGame } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function AdminGamesClient() {
  const { user, isLoading: authLoading } = useAuth();
  const isSessionAdmin = user?.isAdmin === true;

  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [games, setGames] = useState<Game[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("padplay_admin_token");
    if (saved) {
      setToken(saved);
      setTokenInput(saved);
    }
  }, []);

  const authed = isSessionAdmin || Boolean(token);
  const apiToken = isSessionAdmin ? null : token;

  const load = useCallback(async () => {
    setError(null);
    try {
      const { games: rows } = await fetchGames({ limit: 200, sort: "score" });
      setGames(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
      setGames(null);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  function saveToken() {
    setToken(tokenInput);
    localStorage.setItem("padplay_admin_token", tokenInput);
  }

  async function handleDelete(slug: string, title: string) {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will also cascade and mark the related submission as rejected.`)) {
      return;
    }
    
    setBusy(slug);
    try {
      await deleteAdminGame(apiToken, slug);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  if (authLoading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

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
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          href="/admin/games/new"
          className="inline-flex items-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
        >
          <Plus className="h-4 w-4" />
          Add Game
        </Link>
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

      {games === null ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : games.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          No games found.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Game
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Platforms
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {games.map((g) => (
                <tr key={g.slug}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-4">
                      {g.iconUrl ? (
                        <Image
                          src={g.iconUrl}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-lg shadow-sm"
                          unoptimized
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{g.title}</div>
                        <div className="text-sm text-slate-500">{g.developer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                    {g.tabletScore}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 uppercase">
                    {g.platforms}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/games/${g.slug}`}
                        className="text-brand-600 hover:text-brand-900 p-1 rounded hover:bg-brand-50 transition-colors"
                        title="Edit Game"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(g.slug, g.title)}
                        disabled={busy === g.slug}
                        className="text-rose-600 hover:text-rose-900 p-1 rounded hover:bg-rose-50 transition-colors disabled:opacity-50"
                        title="Delete Game"
                      >
                        {busy === g.slug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
