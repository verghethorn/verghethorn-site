# verghethorn.com

Static, bilingual (EN at `/`, RU at `/ru/`) site served by GitHub Pages from this branch's root. No build server is needed.

## Edit text or projects
1. Change copy in `tools/content.mjs` (both `en` and `ru` blocks).
2. Run `node tools/build.mjs` — it regenerates every page, `sitemap.xml` and `robots.txt`.
3. Commit and push. Pages publishes in about a minute.

## Structure
- `tools/build.mjs` — page templates; `tools/content.mjs` — all text, projects, hero hotspots.
- `static/css/site.css` — design tokens (Obsidian, Graphite, Ivory, Steel, Bronze), layout, components.
- `static/js/site.js` — navigation, language memory, cursor, filters, player, prototype, contact form.
- `static/js/frame.js` — The Living Frame: hand-written WebGL shader (film → structure → interface) with CSS fallback.
- `static/js/lab.js` — the three Lab demonstrations.
- `media/` — optimized images, video and audio. `brand/` — source brand files.

## Contact form
Submissions go to the Supabase project **verghethorn-site**, table `public.inquiries` (insert-only for the public via row-level security). Read them in the Supabase dashboard → Table editor → `inquiries`. The key in `content.mjs` is the publishable key, safe to ship in the browser.

## Honesty rules
No invented clients, awards, reviews or figures. Every project carries its real status (Original / Commissioned / Concept / Collaboration, plus In development / Live).
