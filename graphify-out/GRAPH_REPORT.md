# Graph Report - .  (2026-04-24)

## Corpus Check
- Corpus is ~26,271 words - fits in a single context window. You may not need a graph.

## Summary
- 290 nodes · 354 edges · 45 communities detected
- Extraction: 81% EXTRACTED · 19% INFERRED · 0% AMBIGUOUS · INFERRED: 67 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend Submissions + Auth|Backend Submissions + Auth]]
- [[_COMMUNITY_Reddit Marketing Content|Reddit Marketing Content]]
- [[_COMMUNITY_Infra + Architecture|Infra + Architecture]]
- [[_COMMUNITY_Integrity Check Scripts|Integrity Check Scripts]]
- [[_COMMUNITY_Frontend Pages + SEO|Frontend Pages + SEO]]
- [[_COMMUNITY_Env + Runbook|Env + Runbook]]
- [[_COMMUNITY_Favicon PNG Assets|Favicon PNG Assets]]
- [[_COMMUNITY_Deploy + SEO Landing Routes|Deploy + SEO Landing Routes]]
- [[_COMMUNITY_refresh-ratings Enrichment|refresh-ratings Enrichment]]
- [[_COMMUNITY_Submit Flow Frontend|Submit Flow Frontend]]
- [[_COMMUNITY_propose-fixes Ranking|propose-fixes Ranking]]
- [[_COMMUNITY_Apple Touch Icon Brand|Apple Touch Icon Brand]]
- [[_COMMUNITY_Error Middleware|Error Middleware]]
- [[_COMMUNITY_Admin Auth Middleware|Admin Auth Middleware]]
- [[_COMMUNITY_Serialize Helpers|Serialize Helpers]]
- [[_COMMUNITY_Sitemap Route|Sitemap Route]]
- [[_COMMUNITY_Admin Submissions Page|Admin Submissions Page]]
- [[_COMMUNITY_About Page|About Page]]
- [[_COMMUNITY_AdSlot Component|AdSlot Component]]
- [[_COMMUNITY_Navbar|Navbar]]
- [[_COMMUNITY_Screenshot Gallery|Screenshot Gallery]]
- [[_COMMUNITY_Quotes Component|Quotes Component]]
- [[_COMMUNITY_Pagination|Pagination]]
- [[_COMMUNITY_Store Ratings|Store Ratings]]
- [[_COMMUNITY_Leaderboard Filters|Leaderboard Filters]]
- [[_COMMUNITY_Discovery Links|Discovery Links]]
- [[_COMMUNITY_cn  utils|cn / utils]]
- [[_COMMUNITY_next.config|next.config]]
- [[_COMMUNITY_next-env types|next-env types]]
- [[_COMMUNITY_tailwind config|tailwind config]]
- [[_COMMUNITY_postcss config|postcss config]]
- [[_COMMUNITY_Root Layout|Root Layout]]
- [[_COMMUNITY_Footer|Footer]]
- [[_COMMUNITY_Game Card|Game Card]]
- [[_COMMUNITY_Submit CTA|Submit CTA]]
- [[_COMMUNITY_SEO Landing Page|SEO Landing Page]]
- [[_COMMUNITY_Backend index|Backend index]]
- [[_COMMUNITY_games route|games route]]
- [[_COMMUNITY_categories route|categories route]]
- [[_COMMUNITY_health route|health route]]
- [[_COMMUNITY_Frontend api lib|Frontend api lib]]
- [[_COMMUNITY_game shared type|game shared type]]
- [[_COMMUNITY_shared-types index|shared-types index]]
- [[_COMMUNITY_Game Interface Type|Game Interface Type]]
- [[_COMMUNITY_Environment Variables|Environment Variables]]

## God Nodes (most connected - your core abstractions)
1. `Architecture Overview` - 11 edges
2. `PadPlay Favicon` - 10 edges
3. `query()` - 8 edges
4. `Reddit Posting Pack README` - 8 edges
5. `fetchIos()` - 7 edges
6. `enrichFromStoreUrls()` - 7 edges
7. `PadPlay README` - 7 edges
8. `Comment Bank (reply templates)` - 7 edges
9. `generateMetadata()` - 6 edges
10. `fetchGames()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `README Architecture Section` --semantically_similar_to--> `Architecture Overview`  [INFERRED] [semantically similar]
  README.md → MAINTAINERS.md
- `Step 1: Verify deployment` --semantically_similar_to--> `Post-deploy smoke test`  [INFERRED] [semantically similar]
  docs/search-console-checklist.md → MAINTAINERS.md
- `Tablet-fit Scoring Philosophy` --semantically_similar_to--> `tabletScore Formula (55 base + 6/yes, cap 91)`  [INFERRED] [semantically similar]
  marketing/reddit/comment_bank.md → MAINTAINERS.md
- `Tablet-first Leaderboard Concept` --semantically_similar_to--> `Tablet-fit Scoring Philosophy`  [INFERRED] [semantically similar]
  README.md → marketing/reddit/comment_bank.md
- `r/ipad Draft Post` --semantically_similar_to--> `Tablet-first Leaderboard Concept`  [INFERRED] [semantically similar]
  marketing/reddit/post_01_r_ipad.md → README.md

## Hyperedges (group relationships)
- **PadPlay Production Stack** — maintainers_pm2, maintainers_nginx_tls, maintainers_letsencrypt_certbot, maintainers_postgres_12, maintainers_node_20_nvm [EXTRACTED 0.95]
- **Reddit Marketing Pack (drafts + comment bank)** — post_01_r_ipad_draft, post_02_r_iosgaming_draft, post_03_r_androidgaming_draft, post_04_r_boardgames_draft, comment_bank_doc [EXTRACTED 0.95]
- **Submission Flow Pipeline (submit -> review -> games)** — maintainers_submission_queue, maintainers_submissions_table, maintainers_review_queue_admin, maintainers_games_table, maintainers_tabletscore_formula [EXTRACTED 0.95]

## Communities

### Community 0 - "Backend Submissions + Auth"
Cohesion: 0.08
Nodes (16): buildAndroidUrl(), buildIosUrl(), main(), handleApprove(), handleReject(), query(), snakeToCamel(), toCamel() (+8 more)

### Community 1 - "Reddit Marketing Content"
Cohesion: 0.09
Nodes (29): Reply: Android coverage focus, Comment Bank (reply templates), Reply: How scores work, Reply: Self-promo framing, Reply: Opinionated ranking rationale, Reply: Submit flow link, Reply: What PadPlay is, padplay.app (primary domain) (+21 more)

### Community 2 - "Infra + Architecture"
Cohesion: 0.08
Nodes (26): Architecture Overview, backend/src/lib/db.ts (query, queryOne, toCamel), Rationale: Do not rename VPS path (PM2 state), frontend/src/app/page.tsx (Leaderboard home), frontend/src/app/games/[slug]/page.tsx, backend/src/routes/games.ts (4 endpoints), Let's Encrypt via certbot, AWS Lightsail Host (shared VPS) (+18 more)

### Community 3 - "Integrity Check Scripts"
Cohesion: 0.15
Nodes (20): main(), verifyAppId(), verifyTrackId(), checkAndroid(), checkIos(), compareTitles(), fmtPlatform(), jaccard() (+12 more)

### Community 4 - "Frontend Pages + SEO"
Cohesion: 0.13
Nodes (14): fetchGame(), fetchGames(), NotFound(), AndroidTabletGamesPage(), BestIpadGamesPage(), CategoryPage(), CollectionPage(), generateMetadata() (+6 more)

### Community 5 - "Env + Runbook"
Cohesion: 0.1
Nodes (22): Adding a Game (workflow), ADMIN_TOKEN, NEXT_PUBLIC_ADSENSE_CLIENT, Apple Arcade / Netflix Games price=0 caveat, BACKEND_URL=http://localhost:6004, backend/ (Express + TypeScript + raw pg, port 6004), Daily Refresh Cron (19:00 UTC), DATABASE_URL (+14 more)

### Community 6 - "Favicon PNG Assets"
Cohesion: 0.16
Nodes (20): Color Teal #0d9488, Color White #ffffff, PadPlay favicon 16x16, PadPlay Favicon 32x32, Home Button Dot, Inner Tablet Rectangle Fill, Inner Tablet Rectangle Stroke, Letter P Glyph (+12 more)

### Community 7 - "Deploy + SEO Landing Routes"
Cohesion: 0.11
Nodes (19): Deploy Flow (git-based), scripts/deploy.sh, backend/src/scripts/migrate.ts, backend/sql/migrations/NNNN_name.sql, _migrations tracking table, RUN_MIGRATIONS=1 flag, Post-deploy smoke test, /best-ipad-games route (+11 more)

### Community 8 - "refresh-ratings Enrichment"
Cohesion: 0.27
Nodes (13): extractAndroidAppId(), extractIosTrackId(), fetchAndroid(), fetchIos(), fetchIosReviews(), itunesLookup(), itunesSearch(), loadGplay() (+5 more)

### Community 9 - "Submit Flow Frontend"
Cohesion: 0.18
Nodes (5): trackEvent(), createSubmission(), previewSubmission(), handlePreview(), handleSubmit()

### Community 10 - "propose-fixes Ranking"
Cohesion: 0.47
Nodes (8): devSimilarity(), itunesSearchMany(), jaccard(), main(), rankAndroidCandidates(), rankIosCandidates(), sleep(), tokenize()

### Community 11 - "Apple Touch Icon Brand"
Cohesion: 0.47
Nodes (6): iOS home screen touch icon context, Letter P branding mark, PadPlay Apple Touch Icon, PadPlay brand identity, Tablet/iPad outline graphic with letter P, Teal rounded-square background

### Community 12 - "Error Middleware"
Cohesion: 0.67
Nodes (0): 

### Community 13 - "Admin Auth Middleware"
Cohesion: 1.0
Nodes (2): constantTimeEqual(), requireAdmin()

### Community 14 - "Serialize Helpers"
Cohesion: 1.0
Nodes (2): iso(), serializeGame()

### Community 15 - "Sitemap Route"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Admin Submissions Page"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "About Page"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "AdSlot Component"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Navbar"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Screenshot Gallery"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Quotes Component"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Pagination"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Store Ratings"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Leaderboard Filters"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Discovery Links"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "cn / utils"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "next.config"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "next-env types"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "tailwind config"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "postcss config"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Root Layout"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Footer"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Game Card"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Submit CTA"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "SEO Landing Page"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Backend index"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "games route"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "categories route"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "health route"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Frontend api lib"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "game shared type"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "shared-types index"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "Game Interface Type"
Cohesion: 1.0
Nodes (1): packages/shared-types/src/game.ts (Game interface)

### Community 44 - "Environment Variables"
Cohesion: 1.0
Nodes (1): Environment Variables

## Knowledge Gaps
- **48 isolated node(s):** `PadPlay Maintainer Runbook`, `packages/shared-types/ (Shared TS types)`, `Node 20 via nvm`, `nginx TLS / reverse proxy`, `Let's Encrypt via certbot` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Sitemap Route`** (2 nodes): `sitemap.ts`, `sitemap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Submissions Page`** (2 nodes): `page.tsx`, `AdminSubmissionsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `About Page`** (2 nodes): `page.tsx`, `AboutPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AdSlot Component`** (2 nodes): `AdSlot()`, `AdSlot.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Navbar`** (2 nodes): `Navbar.tsx`, `Navbar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Screenshot Gallery`** (2 nodes): `ScreenshotGallery.tsx`, `ScreenshotGallery()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Quotes Component`** (2 nodes): `Quotes.tsx`, `formatDate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pagination`** (2 nodes): `Pagination.tsx`, `visiblePages()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Store Ratings`** (2 nodes): `StoreRatings.tsx`, `formatCount()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Leaderboard Filters`** (2 nodes): `LeaderboardFilters.tsx`, `buildHref()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Discovery Links`** (2 nodes): `DiscoveryLinks()`, `DiscoveryLinks.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `cn / utils`** (2 nodes): `utils.ts`, `cn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `next.config`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `next-env types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `tailwind config`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `postcss config`** (1 nodes): `postcss.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Root Layout`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer`** (1 nodes): `Footer.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Game Card`** (1 nodes): `GameCard.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Submit CTA`** (1 nodes): `SubmitCta.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SEO Landing Page`** (1 nodes): `SeoLandingPage.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Backend index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `games route`** (1 nodes): `games.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `categories route`** (1 nodes): `categories.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `health route`** (1 nodes): `health.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Frontend api lib`** (1 nodes): `api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `game shared type`** (1 nodes): `game.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `shared-types index`** (1 nodes): `index.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Game Interface Type`** (1 nodes): `packages/shared-types/src/game.ts (Game interface)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Environment Variables`** (1 nodes): `Environment Variables`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `query()` connect `Backend Submissions + Auth` to `refresh-ratings Enrichment`, `Integrity Check Scripts`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `Architecture Overview` connect `Infra + Architecture` to `Reddit Marketing Content`, `Env + Runbook`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `PadPlay Favicon` (e.g. with `PadPlay Brand` and `PadPlay Brand Mark`) actually correct?**
  _`PadPlay Favicon` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `query()` (e.g. with `main()` and `main()`) actually correct?**
  _`query()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PadPlay Maintainer Runbook`, `packages/shared-types/ (Shared TS types)`, `Node 20 via nvm` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Backend Submissions + Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Reddit Marketing Content` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._