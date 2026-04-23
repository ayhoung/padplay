# Search Console Launch Checklist

Use this after the marketing branch is merged and deployed.

## 1. Verify the deployment

```bash
curl -s https://padplay.app/api/health
curl -s -o /dev/null -w '%{http_code}\n' https://padplay.app/
curl -s https://padplay.app/sitemap.xml
```

Confirm the new routes resolve:

- `/best-ipad-games`
- `/android-tablet-games`
- `/categories/strategy`
- `/collections/best-strategy-games-for-ipad`
- `/submit`

## 2. Submit the sitemap

In Google Search Console:

1. Open the `padplay.app` property
2. Go to **Sitemaps**
3. Submit `https://padplay.app/sitemap.xml`

## 3. Request indexing for priority pages

Use **URL Inspection** on:

- `https://padplay.app/`
- `https://padplay.app/best-ipad-games`
- `https://padplay.app/android-tablet-games`
- `https://padplay.app/categories/strategy`
- `https://padplay.app/collections/best-strategy-games-for-ipad`
- `https://padplay.app/submit`

## 4. Watch the first 2 weeks

- Check **Pages** for crawl/indexing errors
- Check **Performance** for early impressions on long-tail queries
- Watch for clicks on query patterns like:
  - `best ipad games`
  - `android tablet games`
  - `best strategy games for ipad`
  - `games for ipad pro`

## 5. GA4 checks

Use Realtime/DebugView to confirm events are arriving:

- `submit_cta_click`
- `marketing_methodology_click`
- `submission_preview_started`
- `submission_preview_succeeded`
- `submission_preview_failed`
- `submission_submitted`
- `submission_completed`
- `submission_failed`

## 6. First content follow-ups

If impressions start but CTR is weak:

- tighten titles and descriptions on the top landing pages
- add one-paragraph editorial notes to the winning pages
- create another collection page for the query family that starts surfacing
