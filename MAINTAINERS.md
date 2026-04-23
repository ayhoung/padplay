# PadPlay — Maintainer Runbook

Hey Hermes 👋 — this is the ops guide for keeping PadPlay running. Written to be read top-to-bottom once, then used as a reference.

**Primary domain**: https://padplay.app
**Repo**: github.com/ayhoung/padplay
**Host**: `ubuntu@13.213.86.62` (shared VPS, also runs DeepResume and other apps)

---

## 1. Architecture at a glance

pnpm monorepo with three workspaces:

| Workspace | Purpose | Prod port |
|---|---|---|
| `frontend/` | Next.js 14 App Router, Tailwind | 6003 |
| `backend/` | Express + TypeScript, raw `pg` (no ORM) | 6004 |
| `packages/shared-types/` | Shared TS types + enums | — |

- **Node 20** via nvm on the VPS
- **Postgres 12** on the VPS (shared with other apps; PadPlay lives in DB `tabletgaming`, user `tabletgaming`)
- **PM2** manages processes (`tabletgaming-backend`, `tabletgaming-frontend`)
- **nginx** is the TLS termination / reverse proxy
- **DNS** in AWS Route 53, hosted zone `padplay.app.` (id `Z06995811BISPYG164D91`)
- **SSL**: Let's Encrypt via certbot (`padplay.app` + `www.padplay.app`, auto-renews)

On the VPS, app dir is `/home/ubuntu/tabletgaming/` (the dir was renamed-in-spirit to PadPlay but kept this path to avoid breaking PM2 state — **do not rename it**, the PM2 app names are hardcoded).

## 2. Day-2: deploying code changes

From local (any dev box with SSH access to `ubuntu@13.213.86.62`):

```bash
cd path/to/padplay
# 1. make your changes, commit to git
# 2. push to VPS
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude 'backend/dist' \
  --exclude 'packages/shared-types/dist' --exclude '*.tsbuildinfo' \
  --exclude .env --exclude .env.local --exclude .git \
  ./ ubuntu@13.213.86.62:/home/ubuntu/tabletgaming/

# 3. install, build, restart
ssh ubuntu@13.213.86.62 \
  'source ~/.nvm/nvm.sh && \
   cd /home/ubuntu/tabletgaming && \
   pnpm install && \
   pnpm -r build && \
   pm2 restart tabletgaming-backend tabletgaming-frontend'
```

If the DB schema changed, run `cd backend && pnpm migrate` before restarting. Migrations live in `backend/sql/migrations/NNNN_name.sql` and are idempotent (tracked in a `_migrations` table).

After deploying, smoke test:

```bash
curl -s https://padplay.app/api/health                      # {"ok":true}
curl -s -o /dev/null -w '%{http_code}\n' https://padplay.app/
curl -s https://padplay.app/api/games | jq length            # 45+
```

## 3. Day-2: adding a game

1. Edit `backend/src/scripts/seed.ts`, add an entry to `SEED_GAMES` (copy the shape from an existing one).
2. Keep `appStoreUrl` / `playStoreUrl` as `null` — the refresh script auto-discovers by title search.
3. Rsync to VPS (same as above), then:

   ```bash
   ssh ubuntu@13.213.86.62 \
     'source ~/.nvm/nvm.sh && \
      cd /home/ubuntu/tabletgaming/backend && \
      pnpm seed && pnpm refresh-ratings'
   ```

4. The daily cron (see §6) will keep it up-to-date from there.

Editing an existing game is the same flow — the seed is idempotent (ON CONFLICT DO UPDATE), and `refresh-ratings` only overwrites ratings/screenshots/quotes/price.

## 4. Key files to know

| Path | What it is |
|---|---|
| `backend/src/routes/games.ts` | All 4 API endpoints (`/api/health`, `/api/games`, `/api/games/:slug`, `/api/categories`) |
| `backend/src/scripts/seed.ts` | Curated catalog — **the source of truth** for which games appear |
| `backend/src/scripts/refresh-ratings.ts` | Fetches iTunes + Play Store data. Rate-limited at 500ms/game. |
| `backend/src/scripts/migrate.ts` | Runs unapplied `sql/migrations/*.sql` in order, tracked in `_migrations` table |
| `backend/src/lib/db.ts` | `query`, `queryOne`, `toCamel` helpers. No ORM. |
| `packages/shared-types/src/game.ts` | `Game` interface — **single source of truth** for the data shape. Changes here ripple to both frontend and backend. |
| `frontend/src/app/layout.tsx` | GA4 + favicon + metadata |
| `frontend/src/app/page.tsx` | Leaderboard home (server component) |
| `frontend/src/app/games/[slug]/page.tsx` | Detail page |
| `frontend/src/components/gallery/ScreenshotGallery.tsx` | Client-side modal with keyboard nav |

## 5. Environment variables

**Frontend** (`/home/ubuntu/tabletgaming/frontend/.env.local`) — baked in at build time (re-run `pnpm build` and restart PM2 after changing):

- `NEXT_PUBLIC_GA_ID=G-DVT98X46Z8` — GA4 measurement ID
- `NEXT_PUBLIC_ADSENSE_CLIENT=` — blank until we apply for AdSense. Set to `ca-pub-…` to re-enable ad placements. No code change needed.
- `BACKEND_URL=http://localhost:6004` — used for server-side fetches

**Backend** (`/home/ubuntu/tabletgaming/backend/.env`):

- `DATABASE_URL=postgresql://tabletgaming:<password>@localhost:5432/tabletgaming`
- `PORT=6004`
- `CORS_ORIGIN=https://padplay.app,https://www.padplay.app`
- `NODE_ENV=production`

The DB password was randomly generated at provisioning. To rotate:

```bash
psql -U postgres -c "ALTER USER tabletgaming WITH PASSWORD 'NEW_PASSWORD';"
# update backend/.env, then
pm2 restart tabletgaming-backend
```

## 6. Submission queue

Users can submit games at https://padplay.app/submit. Each submission:

- Requires email + at least one store URL + questionnaire answers
- Gets auto-enriched server-side (iTunes + Play Store → title/dev/icon/screenshots/ratings/price)
- Is stored in `submissions` table with status=`pending`
- Rate-limited to 3 per IP per 5 minutes (in-memory, resets on PM2 restart)

### Review queue

Access at `https://padplay.app/admin/submissions`. Paste the admin token (stored in `backend/.env` as `ADMIN_TOKEN`) into the login box — browser remembers it via localStorage.

For each pending submission you can see the submitter's email, the questionnaire answers, their free-text pitch, and the auto-fetched metadata. Click **Approve** to convert it into a real row in the `games` table (slug derived from title, unique-ified if needed) — it appears on the leaderboard immediately. Click **Reject** to dismiss with an optional internal reason.

The computed `tabletScore` comes from the questionnaire (55 base + 6 per "yes", capped at 91). If a submission deserves a higher score, approve it and then bump the row directly in the DB or via a future edit UI.

### Getting / rotating the admin token

```bash
ssh ubuntu@13.213.86.62 'grep ADMIN_TOKEN /home/ubuntu/tabletgaming/backend/.env'
# Rotate:
NEW=$(openssl rand -hex 24)
ssh ubuntu@13.213.86.62 "sed -i 's|^ADMIN_TOKEN=.*|ADMIN_TOKEN=$NEW|' /home/ubuntu/tabletgaming/backend/.env && pm2 restart tabletgaming-backend"
```

## 7. Daily refresh cron

Runs at 19:00 UTC (03:00 SGT) via `crontab -l` on the VPS:

```
0 19 * * * /home/ubuntu/padplay-refresh.sh >> /home/ubuntu/padplay-refresh.log 2>&1
```

The script sources nvm, cd's into backend, and runs `pnpm refresh-ratings`. The ratings script:

- Takes ~4 minutes (500ms sleep per game × 45 games)
- Fetches iTunes lookup + search fallback (stale/wrong store URLs self-heal)
- Fetches Play Store via `google-play-scraper` npm package (brittle if Google changes HTML)
- Pulls top 5 App Store reviews per game, filters for ones mentioning tablet/iPad/big screen
- Refreshes price, screenshots (up to 8), icon URL
- Safe to rerun any time

To see last N runs: `tail -100 /home/ubuntu/padplay-refresh.log` on the VPS.

To disable temporarily: `crontab -e` and comment the line. Deleting the script file stops runs immediately.

## 7. Known fragility

- **`google-play-scraper`** is an unofficial scraper. If Google changes their HTML, Play Store lookups silently fail (the script logs "Android miss" and nulls the row's android data rather than crashing). Fix: update the npm package, or swap to a commercial API if failure rate gets high.
- **iTunes RSS reviews feed** occasionally returns HTML instead of JSON when rate-limited. The script handles this silently (zero quotes returned, old quotes kept).
- **Apple Arcade / Netflix Games** show `price: 0` in the iTunes lookup because there's no standalone purchase. That's why some premium games appear as "Free" on the site. It's accurate to the store, even if conceptually misleading.
- **The Play Store scraper does NOT fetch reviews**. We rely on App Store reviews only. If we expand to Android-only titles, we'll need a separate review source.
- **DB has no backup schedule set up here**. The VPS is not paying for managed Postgres. For now: `pg_dump tabletgaming > dump.sql` manually before any risky change. Longer term: set up `pg_dump` in the same crontab.

## 8. Routine ops

### Watching logs
```bash
pm2 logs tabletgaming-frontend --lines 100
pm2 logs tabletgaming-backend --lines 100 --err    # errors only
```

### Restarting after a code change
```bash
pm2 restart tabletgaming-frontend     # just the frontend
pm2 restart tabletgaming-backend      # just the backend
pm2 restart tabletgaming-backend tabletgaming-frontend    # both
```

### Checking nginx / SSL
```bash
sudo nginx -t                                            # config valid?
sudo systemctl reload nginx                              # apply config change
sudo certbot certificates                                # cert expiry
sudo certbot renew --dry-run                             # test renewal
```

Certbot auto-renews via a systemd timer (pre-installed on this VPS).

### Rolling back
```bash
# PM2 process state is in /home/ubuntu/.pm2/dump.pm2
# Code is in /home/ubuntu/tabletgaming/
# Previous builds are NOT retained — rollback means re-deploying the prior commit from git.
cd /home/ubuntu/tabletgaming
git log --oneline -5                                    # (if deploying via git in future)
# Otherwise: rsync the old commit from local and restart.
```

## 9. Emergency contacts

- **Domain registrar**: Spaceship (padplay.app)
- **DNS**: AWS Route 53, account `606394566145`, zone `Z06995811BISPYG164D91`
- **GA4 property**: `G-DVT98X46Z8`, stream id `14421717875`
- **Host provider**: Lightsail (same VPS that runs DeepResume and babylogger)

## 10. What I'd do first week

1. **Verify daily cron ran** — `tail -50 /home/ubuntu/padplay-refresh.log` after 03:00 SGT
2. **Check GA4 realtime** — confirm traffic hitting, check for anomalies
3. **Spot-check 3 random detail pages** — make sure screenshots loaded, quotes readable, prices accurate
4. **Read the seed file** — you'll notice which games I was uncertain about (tabletScore is opinionated — don't be afraid to adjust)
5. **Look at `Android miss` entries** — those are games where automated Play Store lookup failed. Could be worth manually setting `playStoreUrl` in seed.ts for high-value misses.

Questions → look at the commit history first, then ask in our shared channel.
