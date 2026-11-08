# verghethorn.com (v8)

Static site for VERGHÉTHORN — films for brands and product design.

- Hero: long-exposure crowd film; press and hold to stop time (`static/js/site.js`).
- Sections: statement → Films → Product design (sketch, 3D model, prototype, production) → "Then we film it" → Contact (Instagram, YouTube, TikTok, Email).
- Copy lives in `tools/content.mjs`; run `node tools/build.mjs` to regenerate `index.html`, `404.html`, `sitemap.xml`, `robots.txt`.
- Styles `static/css/site.css`, sounds `static/js/sfx.js` (synthesized, WebAudio).
- Media `media/v/*` — Mixkit stock footage (free licence), re-graded; placeholders until our own films are ready.
- Hosting: GitHub Pages from `main` (CNAME verghethorn.com).
