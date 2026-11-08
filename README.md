# verghethorn.com (v9)

Static site for VERGHÉTHORN — AI filmmaker.

- Hero: an AI generator window — a prompt types itself, the frame "denoises" and the scene plays; visitors can pick scenes.
- Sections: Process (script → look & characters → generate → finish), What I make, Why AI cinema, Idea lab (slot machine), Contact.
- Copy lives in `tools/content.mjs`; run `node tools/build.mjs` to regenerate `index.html`, `404.html`, `sitemap.xml`, `robots.txt`.
- Styles `static/css/site.css`, sounds `static/js/sfx.js` (synthesized, WebAudio).
- Media `media/v/*` — Mixkit stock footage (free licence), re-graded; placeholders until our own films are ready.
- Hosting: GitHub Pages from `main` (CNAME verghethorn.com).
