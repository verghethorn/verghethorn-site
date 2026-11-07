# verghethorn.com

One cinematic page per language — EN at `/`, RU at `/ru/` — served by GitHub Pages from this branch. No server needed.

## Edit text
1. Change copy in `tools/content.mjs` (both `en` and `ru`).
2. Run `node tools/build.mjs` — it regenerates both pages, redirects for old URLs, `sitemap.xml` and `robots.txt`.
3. Commit and push. Pages publishes in about a minute.

## What is on the page
- **Film** (`static/js/scenes/set.js`) — a 3D film set: drag the key light, tap a camera (dolly, jib, tripod) to look through it.
- **Websites** (`web.js`) — a site assembling itself in zero gravity as you scroll; pieces can be grabbed and thrown.
- **Ads** (`ad.js`) — one product restyled for five audiences; the glowing object can be caught and thrown.
- **How we work** (`explode.js`) — a working watch that separates into six layers, one per step.
- **Services**, **Contact** (doors with sound, short form).
- **Camera dock** (bottom-left) — five looks that re-light the whole site: Daylight, Golden hour, Anamorphic, Night, 16 mm film.
- Sounds are synthesized in `static/js/sound.js` (no audio files); a toggle in the header turns them off.

## Tech
three.js r180 (vendored in `static/vendor/three`, MIT), WebGL with graceful fallback, View Transitions for the camera switch, scroll-driven CSS, reduced-motion support.

## Contact form
Submissions go to Supabase project **verghethorn-site**, table `public.inquiries` (insert-only for the public via row-level security). Read them in the Supabase dashboard → Table editor → `inquiries`.
