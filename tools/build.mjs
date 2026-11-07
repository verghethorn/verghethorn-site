// Static site generator for verghethorn.com — run: node tools/build.mjs
// One interactive page (English). /ru/ and older URLs redirect to it.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE, L } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const hashDir = d => { const h = createHash('sha1'); const walk = p => { for (const f of readdirSync(p).sort()) { const q = join(p, f); statSync(q).isDirectory() ? walk(q) : h.update(readFileSync(q)); } }; walk(join(ROOT, d)); return h.digest('hex').slice(0, 8); };
const V = hashDir('static');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const svg = (d, vb = '0 0 24 24') => `<svg viewBox="${vb}" aria-hidden="true">${d}</svg>`;

const ARROW = svg('<path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
const CLAP = svg('<path d="M3 10h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor"/><path d="M3.2 8.6 19.4 4l.6 2.2L3.8 10.8z" fill="currentColor"/><path d="M7 5.9l2.4 3.3M11.4 4.7l2.4 3.3M15.8 3.4l2.4 3.3" stroke="var(--clap, #000)" stroke-width="1.6"/>');
const SOUND = '<svg class="on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg><svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>';
const GLYPH = {
  youtube: svg('<rect x="2" y="5" width="20" height="14" rx="4.5" fill="#fff"/><path d="M10 9v6l5.2-3z" fill="#ff0033"/>'),
  instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="#fff"/>'),
  tiktok: svg('<path d="M14.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6" fill="none" stroke="#25f4ee" stroke-width="2.6" stroke-linecap="round" transform="translate(-.9 -.7)"/><path d="M14.5 3c.5 2.7 2.4 4.4 5 4.6" fill="none" stroke="#25f4ee" stroke-width="2.6" stroke-linecap="round" transform="translate(-.9 -.7)"/><path d="M14.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6M14.5 3c.5 2.7 2.4 4.4 5 4.6" fill="none" stroke="#fe2c55" stroke-width="2.6" stroke-linecap="round" transform="translate(.9 .7)"/><path d="M14.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6M14.5 3c.5 2.7 2.4 4.4 5 4.6" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>'),
  email: svg('<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="#fff"/><path d="m3.8 7 8.2 6 8.2-6" fill="none" stroke="#5b5bf0" stroke-width="1.8" stroke-linejoin="round"/>'),
};
const CARD_ICON = {
  film: svg('<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 9l16.5-4 .8 3.2M7.5 7.9l2.2 2.7M12 6.8l2.2 2.7M16.5 5.7l2.2 2.7"/>'),
  ads: svg('<path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11"/>'),
  collab: svg('<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>'),
  design: svg('<path d="M8 3h8l-1 3H9z"/><rect x="6" y="6" width="12" height="15" rx="3"/><path d="M6 11h12"/>'),
  apps: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 5h3M10 9h1.5v1.5H10zM12.5 9H14v1.5h-1.5zM10 12h1.5v1.5H10zM12.5 12H14v1.5h-1.5z"/>'),
};

function head({ title, desc, path, noindex = false, refresh = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE.url}${path}">`}
<meta name="theme-color" content="#f4f4f6">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VERGHÉTHORN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.url}${path}">
<meta property="og:image" content="${SITE.url}/media/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/static/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png" sizes="180x180">
<link rel="apple-touch-icon" href="/static/apple-touch-icon.png">
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..900&family=Geist+Mono:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, S = L.story, P = L.product, F = L.fx, W = L.what, X = L.portals, C = L.contact;
  const portals = X.items.map(([id, note]) => id === 'email'
    ? { id, name: X.email, handle: SITE.email, href: `mailto:${SITE.email}`, note }
    : { id, ...SITE.social[id], note });
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  return `${head({ title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip" href="#main">${L.skip}</a>
<div class="aura" aria-hidden="true"><i></i><i></i><i></i></div>
<header class="hd">
  <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
  <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
  <a class="hd-cta" href="#pitch">${L.pitch}</a>
</header>

<main id="main">
<section class="hero" aria-labelledby="h1">
  <div class="hero-head">
    <p class="eyebrow">${H.eyebrow}</p>
    <h1 id="h1">${H.h1}</h1>
    <p class="lead">${H.sub}</p>
  </div>
  <div class="screen" data-screen>
    <canvas class="scene" data-scene role="img" aria-label="${esc(H.canvas)}"></canvas>
    <canvas class="fxc" data-fx aria-hidden="true"></canvas>
    <div class="hud" aria-hidden="true">
      <span class="rec"><i></i>REC</span><span class="take" data-take>SCENE 01 · TAKE 01</span>
      <span class="tc" data-tc>00:00:00:00</span>
      <span class="fxn" data-fxn>FX ×0</span>
      <span class="frame"><b></b><b></b><b></b><b></b></span>
    </div>
    <p class="title-card" data-title aria-live="polite">${H.genres[0][2]}</p>
    <p class="tap-hint" data-hint aria-hidden="true"><span></span>${H.hint}</p>
  </div>
  <div class="deck">
    <div class="genres" role="radiogroup" aria-label="Genre">${H.genres.map(([id, name, title], i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-genre="${i}" data-title="${title}" class="g-${id}">${name}</button>`).join('')}</div>
    <button class="action" type="button" data-action>${CLAP}<span>${H.action}</span></button>
  </div>
</section>

<section class="sec story" id="story" aria-labelledby="s-t">
  <div class="sec-head"><p class="eyebrow">${S.eyebrow}</p><h2 id="s-t">${S.h2}</h2><p class="lead">${S.sub}</p></div>
  <div class="slot" data-slot>
    <div class="reels">${S.reels.map(([label, items], i) => `<button class="reel" type="button" data-reel="${i}" aria-pressed="false" aria-label="${label}: ${esc(items[0])}"><span class="reel-l">${label}</span><span class="reel-w"><span class="reel-s" data-strip>${items.map(t => `<span>${esc(t)}</span>`).join('')}</span></span><span class="reel-lock">${S.lock}</span></button>`).join('')}</div>
    <p class="logline" data-logline aria-live="polite"></p>
    <div class="slot-row">
      <button class="btn big" type="button" data-spin><span class="die" aria-hidden="true"></span>${S.spin}</button>
      <a class="btn ghost" href="#pitch" data-use>${S.use} ${ARROW}</a>
    </div>
    <p class="meta"><span data-spun>0</span> ${S.count} · ${S.tapLock}</p>
  </div>
  <script type="application/json" id="reels">${JSON.stringify(S.reels.map(r => r[1]))}</script>
</section>

<section class="sec product" id="product" aria-labelledby="p-t">
  <div class="sec-head"><p class="eyebrow">${P.eyebrow}</p><h2 id="p-t">${P.h2}</h2><p class="lead">${P.sub}</p></div>
  <div class="studio" data-studio data-mode="design" data-pal="citrus">
    <div class="tabs" role="tablist" aria-label="Mode">${P.modes.map(([id, t], i) => `<button role="tab" type="button" aria-selected="${i === 0}" data-mode-btn="${id}">${t}</button>`).join('')}</div>
    <div class="stage">
      <div class="pscreen" data-pscreen>
        <canvas class="can3d" data-can role="img" aria-label="${esc(P.canvas)}"></canvas>
        <div class="film-ov" aria-hidden="true"><span class="lbx t"></span><span class="lbx b"></span><span class="ad">${P.ad}</span><p class="tag"><b data-pname>NOVA</b>. ${P.tagline}</p></div>
        <div class="app-ov"><p class="app-top"><span class="dot"></span><b data-pname>NOVA</b><span class="chip">${P.drop}</span></p><button type="button" class="buy" data-buy data-added="${esc(P.added)}">${P.add}</button></div>
        <p class="drag-hint" aria-hidden="true">${P.drag}</p>
      </div>
    </div>
    <div class="controls">
      <label class="namef"><span>${P.name}</span><input type="text" maxlength="10" value="NOVA" data-pname-in autocomplete="off" spellcheck="false" autocapitalize="characters"></label>
      <div class="ctl"><span>${P.flavour}</span><div class="sw">${P.flavours.map(([id, t], i) => `<button type="button" class="s-${id}" data-pal="${id}" aria-pressed="${i === 0}" aria-label="${t}" title="${t}"></button>`).join('')}</div></div>
      <div class="ctl"><span>${P.finish}</span><div class="chips">${P.finishes.map(([id, t], i) => `<button type="button" data-finish="${id}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div></div>
    </div>
  </div>
</section>

<section class="sec fxsec" id="fx" aria-labelledby="f-t">
  <div class="sec-head"><p class="eyebrow">${F.eyebrow}</p><h2 id="f-t">${F.h2}</h2><p class="lead">${F.sub}</p></div>
  <div class="fxbox">
    <div class="fx-stage" data-fxstage><canvas data-fxcanvas aria-label="${esc(F.canvas)}" role="img"></canvas><span class="fx-word" data-fxword aria-hidden="true"></span></div>
    <div class="pads">${F.pads.map(([id, t], i) => `<button type="button" class="pad p-${id}" data-pad="${id}"><kbd>${F.keys[i]}</kbd><span>${t}</span></button>`).join('')}</div>
    <p class="meta keys">${F.keysHint}</p>
  </div>
</section>

<section class="sec what" id="what" aria-labelledby="w-t">
  <div class="sec-head"><p class="eyebrow">${W.eyebrow}</p><h2 id="w-t">${W.h2}</h2><p class="lead">${W.tap}</p></div>
  <ul class="cards">${W.cards.map(([id, t, d], i) => `<li><button type="button" class="card c-${id}" aria-pressed="false" data-card><span class="face front"><span class="art"></span><span class="ico">${CARD_ICON[id]}</span><b>${t}</b><small>0${i + 1}</small></span><span class="face back"><b>${t}</b><span>${d}</span></span></button></li>`).join('')}</ul>
</section>

<section class="sec portals" id="portals" aria-labelledby="x-t">
  <div class="sec-head"><p class="eyebrow">${X.eyebrow}</p><h2 id="x-t">${X.h2}</h2><p class="lead">${X.sub}</p></div>
  <ul class="ports">${portals.map(p => `<li><a class="port pt-${p.id}" href="${p.href}" data-portal="${p.id}"${p.id === 'email' ? '' : ' rel="me noopener"'}><span class="orb">${GLYPH[p.id]}</span><b>${esc(p.name)}</b><span>${esc(p.note)}</span></a></li>`).join('')}</ul>
</section>

<section class="sec pitch" id="pitch" aria-labelledby="c-t">
  <div class="sec-head"><p class="eyebrow">${C.eyebrow}</p><h2 id="c-t">${C.h2}</h2></div>
  <form class="form" data-inquiry data-endpoint="${SITE.inquiries.endpoint}" data-key="${SITE.inquiries.key}" novalidate>
    <fieldset class="kinds"><legend>${C.what}</legend>${C.kinds.map(([v, t], i) => `<label><input type="radio" name="category" value="${v}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div class="field"><label for="f-name">${C.name}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="e-name"><p class="error" id="e-name"></p></div>
    <div class="field"><label for="f-email">${C.mail}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" required aria-describedby="e-email"><p class="error" id="e-email"></p></div>
    <div class="field"><label for="f-msg">${C.message}</label><textarea id="f-msg" name="message" rows="4" maxlength="4000" required placeholder="${esc(C.messageHint)}" aria-describedby="e-msg"></textarea><p class="error" id="e-msg"></p></div>
    <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <p class="form-send"><button class="btn big" type="submit">${C.send}</button><small>${C.privacy}</small></p>
    <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
  </form>
</section>
</main>

<footer class="foot">
  <p class="foot-wm">VERGHÉTHORN</p>
  <p>${L.footer}</p>
  <p class="foot-links"><a href="mailto:${SITE.email}">${SITE.email}</a>${Object.values(SITE.social).map(s => `<a href="${s.href}" rel="me noopener">${s.name}</a>`).join('')}</p>
  <p class="foot-c">© ${new Date().getFullYear()} VERGHÉTHORN</p>
</footer>

<div class="portal-ov" data-portal-ov aria-hidden="true"><i class="p1"></i><i class="p2"></i><i class="p3"></i><span class="plane">${svg('<path d="M2 11.5 22 3l-6.5 18-3.8-7.2z" fill="#fff"/><path d="m11.7 13.8 3.8-3.6" stroke="#5b5bf0" stroke-width="1.4"/>')}</span></div>

<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/json" id="i18n">${JSON.stringify(L.js).replace(/</g, '\\u003c')}</script>
<script type="importmap">{"imports":{"three":"/static/vendor/three/three.module.min.js"}}</script>
<script type="module" src="/static/js/site.js?v=${V}"></script>
</body>
</html>
`;
}

function notFound() {
  const N = L.notFound;
  return `${head({ title: N.title, desc: N.text, path: '/404.html', noindex: true })}
<body class="nf"><main class="nf-main"><p class="eyebrow">404</p><h1>${N.h1}</h1><p class="lead">${N.text}</p><p class="nf-cta"><a class="btn big" href="/">${N.home}</a></p></main></body></html>`;
}

function redirect(from, to) {
  const html = `${head({ title: 'VERGHÉTHORN', desc: L.moved, path: from, noindex: true, refresh: `<meta http-equiv="refresh" content="0; url=${to}">\n` })}
<body><p style="padding:40px"><a href="${to}">${L.moved}</a></p><script>location.replace(${JSON.stringify(to)})</script></body></html>`;
  const file = join(ROOT, from, 'index.html');
  mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html);
}

for (const d of ['work', 'practice', 'lab', 'about', 'services', 'approach', 'contact', 'archive', 'links', 'ru']) { const p = join(ROOT, d); if (existsSync(p)) rmSync(p, { recursive: true }); }
writeFileSync(join(ROOT, 'index.html'), page());
const old = [['/ru/', '/'], ['/services/', '/#what'], ['/approach/', '/#what'], ['/contact/', '/#pitch'], ['/links/', '/#portals'], ['/archive/', '/'], ['/archive/qist/', '/'], ['/archive/qist/app/', '/'], ['/archive/use-5-now/', '/'], ['/archive/living-shapes/', '/'], ['/archive/lab/', '/'], ['/work/', '/'], ['/work/living-shapes/', '/'], ['/work/usefive/', '/'], ['/work/living-frame/', '/'], ['/practice/', '/'], ['/lab/', '/'], ['/about/', '/']];
old.forEach(([a, b]) => { redirect(a, b); if (a !== '/ru/') redirect('/ru' + a, b); });
writeFileSync(join(ROOT, '404.html'), notFound());
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.url}/</loc><lastmod>${BUILD_DATE}</lastmod></url>
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built · v' + V);
