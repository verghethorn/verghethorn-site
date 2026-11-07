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

const ARROW = svg('<path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>');
const SOUND = '<svg class="on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg><svg class="off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>';
const GLYPH = {
  youtube: svg('<rect x="2" y="5" width="20" height="14" rx="4.5" fill="#fff"/><path d="M10 9v6l5.2-3z" fill="#ff0033"/>'),
  instagram: svg('<rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="#fff"/>'),
  tiktok: svg('<path d="M14.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6M14.5 3c.5 2.7 2.4 4.4 5 4.6" fill="none" stroke="#25f4ee" stroke-width="2.4" stroke-linecap="round" transform="translate(-.8 -.6)"/><path d="M14.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6M14.5 3c.5 2.7 2.4 4.4 5 4.6" fill="none" stroke="#fe2c55" stroke-width="2.4" stroke-linecap="round" transform="translate(.8 .6)"/><path d="M14.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6M14.5 3c.5 2.7 2.4 4.4 5 4.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>'),
  email: svg('<rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="#fff" stroke-width="1.8"/><path d="m3.8 7 8.2 6 8.2-6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/>'),
};
const V_ = id => `/media/v/${id}`;
const vid = (id, cls = '', extra = '') => `<video class="${cls}" src="${V_(id)}.mp4" poster="${V_(id)}.webp" muted loop playsinline preload="none" disablepictureinpicture data-auto${extra}></video>`;

function head({ title, desc, path, noindex = false, refresh = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE.url}${path}">`}
<meta name="theme-color" content="#0c0c0d">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, SV = L.services, P = L.process, ST = L.story, C = L.contact;
  const socials = [...Object.entries(SITE.social).map(([id, s]) => ({ id, ...s })), { id: 'email', name: C.emailName, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#3d5afe' }];
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  return `${head({ title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip" href="#main">${L.skip}</a>
<header class="hd" data-hd>
  <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
  <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
  <a class="hd-cta" href="#contact">${L.contactBtn}</a>
</header>

<main id="main">
<section class="stage" aria-labelledby="h1" data-stage data-view="set">
  <canvas class="set3d" data-set3d role="img" aria-label="${esc(H.fallback)}"></canvas>
  <img class="poster" src="/media/set-poster.webp" alt="" aria-hidden="true">
  <p class="loading" data-loading aria-hidden="true">${H.loading}</p>
  <div class="labels" data-labels>${Object.entries(H.labels).map(([id, t]) => `<button type="button" class="lbl" data-lbl="${id}"><i></i>${t}</button>`).join('')}</div>
  <div class="pov" aria-hidden="true"><span class="lb t"></span><span class="lb b"></span><span class="pov-hud"><span class="rec"><i></i>REC</span><span data-povcam>CAMERA A</span><span data-tc>00:00:00:00</span></span><p class="subs" data-subs></p></div>
  <div class="stage-top"><span class="slate"><i></i>${H.slate}</span></div>
  <div class="stage-bottom">
    <h1 id="h1">${H.h1}</h1>
    <p class="hint">${H.hint}</p>
    <div class="views" role="tablist" aria-label="View">${H.views.map(([id, t], i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-view-btn="${id}">${t}</button>`).join('')}</div>
  </div>
  <script type="application/json" id="hero-lines">${JSON.stringify({ lines: H.lines, product: H.productCard })}</script>
</section>

<section class="intro"><p class="rv">${L.intro}</p></section>

<section class="sec services" aria-label="${SV.eyebrow}">
  <p class="eyebrow wrap">${SV.eyebrow}</p>
  <ul class="svc">${SV.items.map(([v, t, d]) => `<li class="svc-i rv"><div class="svc-v">${vid(v)}</div><div class="svc-t"><h2>${t}</h2><p>${d}</p></div></li>`).join('')}</ul>
</section>

<section class="sec process" aria-labelledby="p-t">
  <div class="wrap"><p class="eyebrow">${P.eyebrow}</p><h2 id="p-t" class="rv">${P.h2}</h2>
  <ol class="steps">${P.steps.map(([t, d], i) => `<li class="rv"><span>0${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join('')}</ol></div>
</section>

<section class="sec story" id="story" aria-labelledby="st-t">
  <div class="wrap"><p class="eyebrow">${ST.eyebrow}</p><h2 id="st-t" class="rv">${ST.h2}</h2><p class="lead">${ST.sub}</p></div>
  <div class="slot" data-slot>
    <div class="slot-reels">${ST.reels.map(([label, items], i) => `<button class="sreel" type="button" data-reel="${i}" aria-pressed="false" aria-label="${label}: ${esc(items[0])}"><span class="sreel-l">${label}</span><span class="sreel-w"><span class="sreel-s" data-strip></span></span><span class="sreel-lock">${ST.lock}</span></button>`).join('')}</div>
    <p class="logline" data-logline aria-live="polite"></p>
    <div class="slot-row"><button class="btn dark" type="button" data-spin>${ST.spin}</button><a class="btn ghost" href="#contact" data-use>${ST.use} ${ARROW}</a><span class="meta"><span data-spun>0</span> ${ST.count}</span></div>
  </div>
  <script type="application/json" id="reels">${JSON.stringify(ST.reels.map(r => r[1]))}</script>
</section>

<section class="sec contact" id="contact" aria-labelledby="c-t">
  <div class="wrap"><p class="eyebrow">${C.eyebrow}</p><h2 id="c-t" class="rv">${C.h2}</h2></div>
  <ul class="socials wrap">${socials.map(s => `<li><a class="soc" href="${s.href}" data-soc="${s.id}" style="--c:${s.color}"${s.id === 'email' ? '' : ' rel="me noopener"'}><span class="soc-i">${GLYPH[s.id]}</span><span class="soc-t"><b>${esc(s.name)}</b><small>${esc(s.handle)}</small></span><span class="soc-a">${ARROW}</span></a></li>`).join('')}</ul>
  <form class="form wrap" data-inquiry data-endpoint="${SITE.inquiries.endpoint}" data-key="${SITE.inquiries.key}" novalidate>
    <h3>${C.formTitle}</h3>
    <fieldset class="kinds"><legend>${C.what}</legend>${C.kinds.map(([v, t], i) => `<label><input type="radio" name="category" value="${v}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div class="row2">
      <div class="field"><label for="f-name">${C.name}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="e-name"><p class="error" id="e-name"></p></div>
      <div class="field"><label for="f-email">${C.mail}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" required aria-describedby="e-email"><p class="error" id="e-email"></p></div>
    </div>
    <div class="field"><label for="f-msg">${C.message}</label><textarea id="f-msg" name="message" rows="4" maxlength="4000" required placeholder="${esc(C.messageHint)}" aria-describedby="e-msg"></textarea><p class="error" id="e-msg"></p></div>
    <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <p class="form-send"><button class="btn dark" type="submit">${C.send}</button><small>${C.privacy}</small></p>
    <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
  </form>
</section>
</main>

<footer class="foot wrap">
  <p class="foot-wm">VERGHÉTHORN</p>
  <p>${L.footer}</p>
  <p class="foot-c">© ${new Date().getFullYear()} VERGHÉTHORN · ${L.credits}</p>
</footer>

<div class="warp" data-warp aria-hidden="true"><span class="warp-i"></span></div>

<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/json" id="i18n">${JSON.stringify(L.js).replace(/</g, '\\u003c')}</script>
<script type="importmap">{"imports":{"three":"/static/vendor/three/build/three.module.min.js","three/addons/":"/static/vendor/three/jsm/"}}</script>
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
const old = [['/ru/', '/'], ['/services/', '/'], ['/approach/', '/'], ['/contact/', '/#contact'], ['/links/', '/#contact'], ['/archive/', '/'], ['/archive/qist/', '/'], ['/archive/qist/app/', '/'], ['/archive/use-5-now/', '/'], ['/archive/living-shapes/', '/'], ['/archive/lab/', '/'], ['/work/', '/'], ['/work/living-shapes/', '/'], ['/work/usefive/', '/'], ['/work/living-frame/', '/'], ['/practice/', '/'], ['/lab/', '/'], ['/about/', '/']];
old.forEach(([a, b]) => { redirect(a, b); if (a !== '/ru/') redirect('/ru' + a, b); });
writeFileSync(join(ROOT, '404.html'), notFound());
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.url}/</loc><lastmod>${BUILD_DATE}</lastmod></url>
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built · v' + V);
