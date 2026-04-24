---
type: "query"
date: "2026-04-24T03:49:33.842944+00:00"
question: "How does query() bridge submissions auth refresh-ratings enrichment and integrity check scripts?"
contributor: "graphify"
source_nodes: ["query", "db.ts", "titlesMatch", "enrich.ts", "refresh-ratings.ts", "approveSubmission"]
---

# Q: How does query() bridge submissions auth refresh-ratings enrichment and integrity check scripts?

## Answer

query() in backend/src/lib/db.ts is a thin pool.query wrapper used by three clusters: (1) Submissions + Auth via approveSubmission/rejectSubmission/listSubmissions in submissions.ts — the user-facing write path where bad URLs first enter; (2) refresh-ratings Enrichment via direct pool.query UPDATE using enrich.ts helpers (titlesMatch fallback to itunesSearch is where the Divinity→Diablo bug happened); (3) Integrity Check Scripts (check-integrity, apply-fixes, add-games) importing the same pool. The normalize->titlesMatch edge is the smoking gun: refresh-ratings writes using loose titlesMatch, check-integrity reads using strict compareTitles. Two matchers on same data. Proper fix: harden titlesMatch in enrich.ts:92, gate the search fallback in refresh-ratings.ts:177-180 on developer match, route writes through a single updateGameUrls helper that refuses to UPDATE if new URL's resolved title diverges from DB title.

## Source Nodes

- query
- db.ts
- titlesMatch
- enrich.ts
- refresh-ratings.ts
- approveSubmission