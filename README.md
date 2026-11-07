# verghethorn.com

One page per language — EN at `/`, RU at `/ru/` — served by GitHub Pages from this branch. No server needed.

## Edit text
1. Change copy in `tools/content.mjs` (both `en` and `ru`).
2. Run `node tools/build.mjs` — it regenerates both pages, redirects for old URLs, `sitemap.xml` and `robots.txt`.
3. Commit and push. Pages publishes in about a minute.

## What is on the page (mobile first)
- **The set** — real film-set photography seen through a camera viewfinder. Tap A / B / C (or swipe the picture) to cut between cameras.
- **Product design** — a swipeable reel: watch, engine, turbine, sneakers, camera, cosmetics, kettle. Each card scans itself to show what is inside (or our blueprint drawing); tap to switch.
- **Advertising** — one product, NOVA serum, as a different ad for each audience.
- **Our films & collaborations** — letterbox frame with subtitles.
- **How we work**, **Also on request** (websites, apps, AI agents).
- **Contact** — four doors shaped like Instagram, YouTube, TikTok and email; the short form.

Scrolling is always native: no pinned sections and nothing that captures touch.

## Photos
`media/v4/` — WebP, two sizes each. Photography from Unsplash (photographers credited in the page footer and in `PHOTOS` in `tools/content.mjs`). The blueprint drawings (`*-in` for sneaker, serum, kettle) were traced from those photos.

## Contact form
Submissions go to Supabase project **verghethorn-site**, table `public.inquiries` (insert-only for the public via row-level security). Read them in the Supabase dashboard → Table editor → `inquiries`.
