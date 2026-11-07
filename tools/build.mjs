// Static site generator for verghethorn.com — run: node tools/build.mjs
// One page per language: EN at /, RU at /ru/. Mobile first, photographic, native scrolling only.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE, LANGS, PHOTOS, PRODUCTS, AUDIENCES } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const hashDir = d => { const h = createHash('sha1'); const walk = p => { for (const f of readdirSync(p).sort()) { const q = join(p, f); statSync(q).isDirectory() ? walk(q) : h.update(readFileSync(q)); } }; walk(join(ROOT, d)); return h.digest('hex').slice(0, 8); };
const V = hashDir('static');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pre = L => (L.lang === 'en' ? '' : '/ru');
const M = '/media/v4/';

// responsive <img>: k = file key, small/large widths available on disk
const img = (k, alt, { sizes = '100vw', big = 1200, cls = '', lazy = true, prio = '', extra = '' } = {}) =>
  `<img${cls ? ` class="${cls}"` : ''} src="${M}${k}-800.webp" srcset="${M}${k}-800.webp 800w, ${M}${k}-${big}.webp ${big}w" sizes="${sizes}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async"${prio ? ` fetchpriority="${prio}"` : ''}${extra}>`;

const ARROW = '<svg class="arr" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1.5 7h10M7.5 3 11.5 7l-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CAM_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="8" width="13" height="10" rx="2"/><path d="M15.5 11.5 21 9v8l-5.5-2.5"/><circle cx="6" cy="5.5" r="2.3"/><circle cx="11.5" cy="5.5" r="2.3"/></svg>';
const EYE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3.2"/></svg>';
const TT_NOTE = 'M58 8v66a22 22 0 1 1-22-22M58 8c3 16 14 26 30 27';

function head(L, { title, desc, path, noindex = false, refresh = '' }) {
  const enUrl = SITE.url + path, ruUrl = SITE.url + '/ru' + path;
  const self = L.lang === 'en' ? enUrl : ruUrl;
  return `<!doctype html>
<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ru" href="${ruUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">`}
<meta name="theme-color" content="#0b0b0c">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VERGHÉTHORN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${self}">
<meta property="og:image" content="${SITE.url}/media/og.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="${L.locale}"><meta property="og:locale:alternate" content="${LANGS[L.other].locale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/static/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png" sizes="180x180">
<link rel="apple-touch-icon" href="/static/apple-touch-icon.png">
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300..800&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

/* ---------- doors: each one is a real door, shaped and painted like the platform ---------- */
function doorFace(id) {
  if (id === 'instagram') return '<span class="ig-ring"></span><span class="ig-port"><span class="glass"></span></span><span class="ig-dot"></span><span class="lever"></span>';
  if (id === 'youtube') return '<span class="yt-frame"><span class="yt-glass"></span></span><span class="panel p1"></span><span class="panel p2"></span><span class="lever light"></span>';
  if (id === 'tiktok') return `<svg class="tt" viewBox="0 0 100 110" aria-hidden="true"><path class="c" d="${TT_NOTE}" transform="translate(-4 -3)"/><path class="m" d="${TT_NOTE}" transform="translate(4 3)"/><path class="w" d="${TT_NOTE}"/></svg><span class="lever light"></span>`;
  return '<span class="panel p1"></span><span class="slot"><span class="env"></span><span class="flap"></span></span><span class="panel p2"></span><span class="knob"></span>';
}

function page(L) {
  const H = L.hero, D = L.design, A = L.ads, F = L.films, W = L.how, X = L.also, C = L.contact;
  const doors = [
    { id: 'instagram', name: 'Instagram', href: SITE.social[1].href },
    { id: 'youtube', name: 'YouTube', href: SITE.social[0].href },
    { id: 'tiktok', name: 'TikTok', href: SITE.social[2].href },
    { id: 'email', name: C.emailName, href: `mailto:${SITE.email}` },
  ];
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: SITE.social.map(s => s.href), description: L.desc };
  const heroKeys = ['hero-a', 'hero-b', 'hero-c'];

  return `${head(L, { title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip" href="#main">${L.skip}</a>
<header class="hd" data-hd>
  <a class="wm" href="${pre(L)}/" aria-label="VERGHÉTHORN">VERGHÉTHORN</a>
  <nav class="hd-nav" aria-label="Main">${L.nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
  <a class="lang" href="${pre(LANGS[L.other])}/" hreflang="${L.other}" lang="${L.other}" aria-label="${L.otherLabel}" data-lang="${L.other}">${L.otherName}</a>
  <a class="hd-cta" href="#contact">${L.contactBtn}</a>
</header>

<main id="main">
<section class="set" id="film" aria-labelledby="h1" data-set>
  <div class="shots" data-shots>
    ${heroKeys.map((k, i) => `<picture class="shot${i === 0 ? ' on' : ''}" data-shot="${i}"><source media="(min-aspect-ratio: 4/3) and (min-width: 900px)" srcset="${M}${k}-wide-1600.webp"><img src="${M}${k}-800.webp" srcset="${M}${k}-800.webp 800w, ${M}${k}-1400.webp 1400w" sizes="100vw" alt="${esc(H.alts[i])}" decoding="async"${i === 0 ? ' fetchpriority="high"' : ' fetchpriority="low"'}></picture>`).join('\n    ')}
  </div>
  <div class="vf" aria-hidden="true">
    <span class="c tl"></span><span class="c tr"></span><span class="c bl"></span><span class="c br"></span>
    <span class="vf-rec"><i></i>REC</span><span class="vf-tc" data-tc>00:00:00:00</span>
    <span class="vf-cam" data-vfcam>CAM ${H.cams[0][0]} · ${H.cams[0][2]}</span><span class="vf-iso">T2.0 · 4K · 24FPS</span>
    <span class="vf-x"></span>
  </div>
  <span class="cut" aria-hidden="true"></span>
  <div class="set-copy">
    <p class="eyebrow light">${H.eyebrow}</p>
    <h1 id="h1">${H.h1}</h1>
    <p class="set-sub">${H.sub}</p>
    <p class="set-cta"><a class="btn white" href="#contact">${H.cta} ${ARROW}</a></p>
    <div class="cams" role="group" aria-label="${esc(H.group)}">${H.cams.map(([id, name, lens], i) => `<button class="cam${i === 0 ? ' on' : ''}" type="button" data-cam="${i}" data-label="CAM ${id} · ${lens}" aria-pressed="${i === 0}">${CAM_ICON}<b>${id}</b><span>${name}</span></button>`).join('')}</div>
  </div>
</section>

<section class="statement" aria-label="VERGHÉTHORN"><p class="rv">${L.statement}</p></section>

<section class="sec" id="design" aria-labelledby="d-t">
  <div class="sec-head rv"><p class="eyebrow">${D.eyebrow}</p><h2 id="d-t">${D.h2}</h2><p class="sec-sub">${D.sub}</p></div>
  <ul class="reel products" data-reel>
    ${PRODUCTS.map(([id, out, inn, mode]) => `<li class="xc">
      <figure class="xr ${mode}" data-xr>
        ${img(out, D.alts[id][0], { sizes: '(min-width: 900px) 30vw, 84vw', cls: 'xr-out' })}
        <span class="xr-in">${img(inn, D.alts[id][1], { sizes: '(min-width: 900px) 30vw, 84vw' })}</span>
        <span class="xr-line" aria-hidden="true"></span>
      </figure>
      <div class="xc-meta"><h3>${D.items[id][0]}</h3><p>${D.items[id][1]}</p>
        <button class="xr-btn" type="button" aria-pressed="false" data-on="${esc(D.hide)}" data-off="${esc(mode === 'blue' ? D.showBlue : D.show)}">${EYE_ICON}<span>${mode === 'blue' ? D.showBlue : D.show}</span></button></div>
    </li>`).join('\n    ')}
  </ul>
  <p class="reel-hint" aria-hidden="true">${D.hint} <span>→</span></p>
</section>

<section class="sec ads" id="ads" aria-labelledby="a-t">
  <div class="sec-head rv"><p class="eyebrow">${A.eyebrow}</p><h2 id="a-t">${A.h2}</h2><p class="sec-sub">${A.sub}</p></div>
  <div class="tabs" role="tablist" aria-label="${esc(A.eyebrow)}" data-tabs>${AUDIENCES.map((id, i) => `<button role="tab" type="button" id="tab-${id}" aria-controls="aud-${id}" aria-selected="${i === 0}" data-tab="${i}">${A.audiences[id][0]}</button>`).join('')}</div>
  <ul class="reel aud" data-aud>
    ${AUDIENCES.map((id, i) => `<li class="ad-slide" id="aud-${id}" role="tabpanel" aria-labelledby="tab-${id}" data-slide="${i}">
      ${img('aud-' + id, A.alts[id], { sizes: '(min-width: 900px) 42vw, 88vw' })}
      <span class="ad-pill">${A.ad}</span>
      <div class="ad-copy"><p class="ad-brand">${A.product}</p><p class="ad-tag">${A.audiences[id][1]}</p></div>
      <span class="ad-pack"><img src="${M}serum-800.webp" alt="${esc(A.serumAlt)}" loading="lazy" decoding="async"><span><b>${A.product}</b>${A.productLine}</span></span>
    </li>`).join('\n    ')}
  </ul>
</section>

<section class="sec films" id="films" aria-labelledby="f-t">
  <div class="sec-head rv"><p class="eyebrow">${F.eyebrow}</p><h2 id="f-t">${F.h2}</h2><p class="sec-sub">${F.sub}</p></div>
  <figure class="lb" data-lb>
    <picture><source media="(min-width: 900px)" srcset="${M}film-wide-1600.webp">${img('film', F.alt, { sizes: '100vw' })}</picture>
    <span class="bar top" aria-hidden="true"></span><span class="bar bot" aria-hidden="true"></span>
    <figcaption class="subs" aria-hidden="true"><span>${F.subs[0]}</span><span>${F.subs[1]}</span></figcaption>
  </figure>
  <p class="films-cta rv"><a class="btn" href="#contact" data-kind="collaboration">${F.cta} ${ARROW}</a></p>
</section>

<section class="sec" id="how" aria-labelledby="h-t">
  <div class="sec-head rv"><p class="eyebrow">${W.eyebrow}</p><h2 id="h-t">${W.h2}</h2></div>
  <ol class="reel steps">
    ${W.steps.map(([k, t, d, alt]) => `<li class="step">${img('step-' + k, alt, { sizes: '(min-width: 900px) 24vw, 72vw' })}<div><h3>${t}</h3><p>${d}</p></div></li>`).join('\n    ')}
  </ol>
</section>

<section class="sec also" aria-labelledby="x-t">
  <div class="sec-head rv"><p class="eyebrow">${X.eyebrow}</p><h2 id="x-t">${X.h2}</h2><p class="sec-sub">${X.sub}</p></div>
  <ul class="minis">
    <li class="mini rv"><div class="toy web" aria-hidden="true"><i class="bar"></i><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i></div><h3>${X.items[0][1]}</h3><p>${X.items[0][2]}</p></li>
    <li class="mini rv"><div class="toy app" aria-hidden="true"><i class="ph"><i class="r1"></i><i class="r2"></i><i class="r3"></i></i></div><h3>${X.items[1][1]}</h3><p>${X.items[1][2]}</p></li>
    <li class="mini rv"><div class="toy ai" aria-hidden="true"><i class="q">${esc(X.chat[0])}</i><i class="a">${esc(X.chat[1])}<b></b></i></div><h3>${X.items[2][1]}</h3><p>${X.items[2][2]}</p></li>
  </ul>
</section>

<section class="sec contact" id="contact" aria-labelledby="c-t">
  <div class="sec-head rv"><p class="eyebrow">${C.eyebrow}</p><h2 id="c-t">${C.h2}</h2><p class="sec-sub">${C.sub}</p></div>
  <ul class="doors">
    ${doors.map(d => `<li><a class="door d-${d.id}" href="${d.href}"${d.id === 'email' ? '' : ' target="_blank" rel="me noopener"'} data-door aria-label="${esc(d.name)} — ${esc(C.notes[d.id])}">
      <span class="d-frame" aria-hidden="true"><span class="d-room"></span><span class="d-leaf">${doorFace(d.id)}</span></span>
      <span class="d-spill" aria-hidden="true"></span>
    </a><p class="door-cap"><b>${esc(d.name)}</b><span>${esc(C.notes[d.id])}</span></p></li>`).join('\n    ')}
  </ul>

  <form class="form" data-inquiry data-endpoint="${SITE.inquiries.endpoint}" data-key="${SITE.inquiries.key}" novalidate>
    <h3 class="form-title">${C.formTitle}</h3>
    <fieldset class="kinds"><legend>${C.what}</legend>${C.kinds.map(([v, t], i) => `<label><input type="radio" name="category" value="${v}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div class="field"><label for="f-name">${C.name}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="e-name"><p class="error" id="e-name"></p></div>
    <div class="field"><label for="f-email">${C.mail}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" required aria-describedby="e-email"><p class="error" id="e-email"></p></div>
    <div class="field"><label for="f-msg">${C.message}</label><textarea id="f-msg" name="message" rows="4" maxlength="4000" required placeholder="${esc(C.messageHint)}" aria-describedby="e-msg"></textarea><p class="error" id="e-msg"></p></div>
    <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <p class="form-send"><button class="btn" type="submit">${C.send}</button><small>${C.privacy}</small></p>
    <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
  </form>
</section>
</main>

<footer class="foot">
  <p class="foot-wm">VERGHÉTHORN</p>
  <p>${L.footer}</p>
  <p class="foot-links"><a href="mailto:${SITE.email}">${SITE.email}</a>${SITE.social.map(s => `<a href="${s.href}" target="_blank" rel="me noopener">${s.name}</a>`).join('')}</p>
  <details class="credits"><summary>${L.photos}</summary><p>${[...new Set(Object.values(PHOTOS))].join(' · ')}</p></details>
  <p class="foot-c">© ${new Date().getFullYear()} VERGHÉTHORN</p>
</footer>

<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/json" id="i18n">${JSON.stringify(L.js).replace(/</g, '\\u003c')}</script>
<script type="module" src="/static/js/site.js?v=${V}"></script>
</body>
</html>
`;
}

function notFound() {
  const L = LANGS.en, N = L.notFound, R = LANGS.ru.notFound;
  return `${head(L, { title: N.title, desc: N.text, path: '/404.html', noindex: true })}
<body class="nf"><main class="nf-main"><p class="eyebrow">404</p><h1>${N.h1}<br><span lang="ru">${R.h1}</span></h1><p class="sec-sub">${N.text} <span lang="ru">${R.text}</span></p><p class="nf-cta"><a class="btn" href="/">${N.home}</a><a class="btn ghost" href="/ru/" lang="ru">${R.home}</a></p></main></body></html>`;
}

function redirect(L, from, to) {
  const dest = pre(L) + to;
  const html = `${head(L, { title: 'VERGHÉTHORN', desc: L.moved, path: from, noindex: true, refresh: `<meta http-equiv="refresh" content="0; url=${dest}">\n` })}
<body><p style="padding:40px"><a href="${dest}">${L.moved}</a></p><script>location.replace(${JSON.stringify(dest)})</script></body></html>`;
  const file = join(ROOT, pre(L) + from, 'index.html');
  mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html);
}

// clean every folder generated by earlier versions
for (const d of ['work', 'practice', 'lab', 'about', 'services', 'approach', 'contact', 'archive', 'links', 'ru']) { const p = join(ROOT, d); if (existsSync(p)) rmSync(p, { recursive: true }); }

for (const L of Object.values(LANGS)) {
  const file = join(ROOT, pre(L), 'index.html'); mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, page(L));
  const old = [['/services/', '/#design'], ['/approach/', '/#how'], ['/contact/', '/#contact'], ['/links/', '/#contact'], ['/archive/', '/'], ['/archive/qist/', '/'], ['/archive/qist/app/', '/'], ['/archive/use-5-now/', '/'], ['/archive/living-shapes/', '/'], ['/archive/lab/', '/'], ['/work/', '/'], ['/work/living-shapes/', '/'], ['/work/usefive/', '/'], ['/work/living-frame/', '/'], ['/practice/', '/'], ['/lab/', '/'], ['/about/', '/']];
  old.forEach(([a, b]) => redirect(L, a, b));
}
writeFileSync(join(ROOT, '404.html'), notFound());
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${['', '/ru'].map(pr => `  <url><loc>${SITE.url}${pr}/</loc><lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE.url}/"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${SITE.url}/ru/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}/"/>
  </url>`).join('\n')}
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built · v' + V);
