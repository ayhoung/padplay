# PadPlay

Leaderboard for games built **tablet-first** — Civ VI, Slay the Spire, Stardew Valley — not iPhone apps stretched to fit a bigger screen.

Monetized via Google AdSense. Google Analytics wired from day one.

## Architecture

pnpm monorepo, two-tier:

| Workspace | Stack | Port |
|-----------|-------|------|
| `frontend/` | Next.js 14 + Tailwind + TypeScript | 6003 |
| `backend/` | Express + TypeScript + raw `pg` | 6004 |
| `packages/shared-types/` | Shared TS types | — |

Database migrations are plain SQL files in `backend/sql/migrations/`, applied in alphabetical order by `pnpm migrate`. No ORM.

## Prerequisites

- Node 20+
- pnpm 9+
- PostgreSQL 14+ running locally

## Setup

```bash
# 1. Create database + user
createuser tabletgaming --superuser
createdb tabletgaming -O tabletgaming

# 2. Install everything
pnpm install

# 3. Env files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local with a real NEXT_PUBLIC_GA_ID

# 4. Migrate + seed
cd backend && pnpm migrate && pnpm seed
cd ..

# 5. Run everything
make dev
# → open http://localhost:6003
```

## Adding a new game

Edit `backend/src/scripts/seed.ts`, add an entry to the `SEED_GAMES` array, then:

```bash
cd backend && pnpm seed
```

The seed is idempotent (upsert by `slug`), so rerunning is safe.

## Refreshing ratings + icons

Pulls live ratings and icons from iTunes (iOS) and Play Store (Android) for every game with a matching `appStoreUrl` / `playStoreUrl`:

```bash
cd backend && pnpm refresh-ratings
```

Safe to run on a schedule — updates only the rating/icon columns.

## API

- `GET /api/health` — health check
- `GET /api/games?category=&sort=score|title&limit=` — leaderboard
- `GET /api/games/:slug` — detail
- `GET /api/categories` — categories with counts

## Analytics & Ads

- Google Analytics: set `NEXT_PUBLIC_GA_ID` in `frontend/.env.local`. Script loads automatically from `src/app/layout.tsx`.
- Google AdSense: set `NEXT_PUBLIC_ADSENSE_CLIENT`. `<AdSlot />` component renders `<ins class="adsbygoogle">` placeholders; ads display once AdSense approves the site.
