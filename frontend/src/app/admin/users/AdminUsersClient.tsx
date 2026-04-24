"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AdminUser } from "@padplay/shared-types";
import {
  fetchAdminUsers,
  grantAdminRole,
  revokeAdminRole,
  updateAdminRole,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export function AdminUsersClient() {
  const { user, isLoading: authLoading } = useAuth();
  const isSessionAdmin = user?.isAdmin === true;

  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [email, setEmail] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [granting, setGranting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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
    if (!authed) return;
    setError(null);
    try {
      const rows = await fetchAdminUsers(apiToken);
      setUsers(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed");
      setUsers(null);
    }
  }, [authed, apiToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || !users) return users;
    return users.filter((row) => row.email.toLowerCase().includes(q));
  }, [search, users]);

  function saveToken() {
    setToken(tokenInput);
    localStorage.setItem("padplay_admin_token", tokenInput);
  }

  async function handleGrant() {
    if (!email.trim()) return;
    setGranting(true);
    setError(null);
    try {
      await grantAdminRole(apiToken, { email: email.trim() });
      setEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grant failed");
    } finally {
      setGranting(false);
    }
  }

  async function handleToggleRole(row: AdminUser) {
    setBusyId(row.id);
    setError(null);
    try {
      await updateAdminRole(apiToken, row.id, { isAdmin: !row.isAdmin });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevoke(row: AdminUser) {
    setBusyId(row.id);
    setError(null);
    try {
      await revokeAdminRole(apiToken, row.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Revoke failed");
    } finally {
      setBusyId(null);
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
      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="grant-email" className="mb-2 block text-sm font-medium text-slate-700">
            Grant admin by email
          </label>
          <div className="flex gap-2">
            <input
              id="grant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="registered-user@example.com"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleGrant}
              disabled={granting}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {granting ? "Granting…" : "Grant"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            The user must already exist in the PadPlay users table.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="user-search" className="mb-2 block text-sm font-medium text-slate-700">
            Search users
          </label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by email"
            className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      {filteredUsers === null ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : filteredUsers.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          No users match this filter.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Updates</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((row) => {
                const busy = busyId === row.id;
                return (
                  <tr key={row.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-medium " +
                          (row.isAdmin
                            ? "bg-brand-100 text-brand-800"
                            : "bg-slate-100 text-slate-600")
                        }
                      >
                        {row.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.wantsUpdates ? "Subscribed" : "Off"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleRole(row)}
                          disabled={busy}
                          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {busy ? "Saving…" : row.isAdmin ? "Demote" : "Promote"}
                        </button>
                        {row.isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleRevoke(row)}
                            disabled={busy}
                            className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
