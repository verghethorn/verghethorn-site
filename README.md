# verghethorn.com (v7)

Static site for VERGHÉTHORN, a film studio: brand commercials and short films.

- First screen: a live 3D film set (three.js r180, vendored in `static/vendor/three`). Lamps, cameras and actors can be tapped; Camera A / Camera B show the shot through the lens.
- Copy lives in `tools/content.mjs`. Run `node tools/build.mjs` to regenerate `index.html`, `404.html`, `sitemap.xml`, `robots.txt`.
- Code: `static/js/set3d.js` (3D set), `static/js/site.js` (page logic), `static/js/sfx.js` (synthesized sounds), `static/css/site.css`.
- Media: `media/3d/xbot.glb` (three.js / Mixamo actor), `media/v/*` (Mixkit stock clips, placeholders), `media/set-poster.webp`, `media/og.jpg`.
- Contact form posts to Supabase table `inquiries` (insert-only publishable key).
- Hosting: GitHub Pages from `main` (CNAME verghethorn.com).
