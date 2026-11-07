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
<meta name="theme-color" content="#0a0a0a">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..700;1,6..96,400..600&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, F = L.films, S = L.set, B = L.brand, D = L.design, ST = L.story, X = L.portals, C = L.contact;
  const portals = X.items.map(([id, note]) => id === 'email' ? { id, name: X.email, handle: SITE.email, href: `mailto:${SITE.email}`, note } : { id, ...SITE.social[id], note });
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  const tile = (group, [id, img, name, spec], i) => `<button type="button" class="tile" data-${group}="${id}" aria-pressed="${i === (group === 'light' ? 1 : 0)}"><img src="/media/t/${img}.webp" alt="" loading="lazy" decoding="async"><span><b>${name}</b><small>${spec}</small></span></button>`;
  return `${head({ title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip" href="#main">${L.skip}</a>
<header class="hd" data-hd>
  <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
  <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
  <a class="hd-cta" href="#pitch">${L.pitch}</a>
</header>

<main id="main">
<section class="hero" aria-labelledby="h1" data-hero>
  <div class="hero-v" data-reel-hero>
    ${H.mobile.map(([id, t], i) => `<video class="hv m${i === 0 ? ' on' : ''}" data-src="${V_(id)}.mp4" poster="${V_(id)}.webp" muted playsinline preload="none" data-label="${t}"></video>`).join('\n    ')}
    ${H.desktop.map(([id, t], i) => `<video class="hv d${i === 0 ? ' on' : ''}" data-src="${V_(id)}.mp4" poster="${V_(id)}.webp" muted playsinline preload="none" data-label="${t}"></video>`).join('\n    ')}
  </div>
  <div class="bars" aria-hidden="true" data-bars></div>
  <div class="hero-c">
    <p class="eyebrow">${H.eyebrow}</p>
    <h1 id="h1">${H.h1}</h1>
    <p class="hero-sub">${H.sub}</p>
    <p class="hero-cta"><a class="btn light" href="#pitch">${H.cta} ${ARROW}</a><a class="btn line" href="#set">${H.cta2}</a></p>
  </div>
  <p class="hero-label" data-hlabel aria-hidden="true"></p>
</section>

<section class="sec films" id="films" aria-labelledby="f-t">
  <div class="sec-head"><p class="eyebrow">${F.eyebrow}</p><h2 id="f-t">${F.h2}</h2><p class="lead">${F.sub}</p></div>
  <ul class="reels">${F.reels.map(([id, t]) => `<li><figure class="reel">${vid(id)}<figcaption><b>${t}</b></figcaption></figure></li>`).join('')}</ul>
</section>

<section class="sec set" id="set" aria-labelledby="s-t">
  <div class="sec-head"><p class="eyebrow">${S.eyebrow}</p><h2 id="s-t">${S.h2}</h2><p class="lead">${S.sub}</p></div>
  <div class="setbox">
    <div class="monitor" data-monitor>
      <video class="mon-v" src="${V_('set')}.mp4" poster="${V_('set')}.webp" muted loop playsinline preload="auto" crossorigin="anonymous" aria-label="${S.alt}"></video>
      <canvas class="mon-c" data-mon aria-hidden="true"></canvas>
      <div class="mon-hud" aria-hidden="true"><span class="rec"><i></i>REC</span><span data-mhud>A‑CAM · 35MM · 3200K · 24FPS</span><span class="tc" data-tc>00:00:00:00</span><span class="keyc" data-keyc></span></div>
      <p class="mon-tip" aria-hidden="true">${S.tapKey}</p>
    </div>
    <div class="rig">
      <div class="grp"><p class="grp-t">${S.light}</p><div class="tiles">${S.lights.map((l, i) => tile('light', l, i)).join('')}</div></div>
      <div class="grp"><p class="grp-t">${S.lens}</p><div class="tiles">${S.lenses.map((l, i) => tile('lens', l, i)).join('')}</div></div>
    </div>
  </div>
</section>

<section class="sec brand" id="brand" aria-labelledby="b-t">
  <div class="sec-head"><p class="eyebrow">${B.eyebrow}</p><h2 id="b-t">${B.h2}</h2></div>
  ${B.panels.map(([id, k, t]) => `<figure class="panel">${vid(id)}<figcaption><span class="eyebrow">${k}</span><p class="ptitle">${t}</p></figcaption></figure>`).join('\n  ')}
  <p class="brand-line">${B.line}</p>
</section>

<section class="sec design" id="design" aria-labelledby="d-t">
  <div class="sec-head"><p class="eyebrow">${D.eyebrow}</p><h2 id="d-t">${D.h2}</h2><p class="lead">${D.sub}</p></div>
  <ol class="steps">${D.steps.map(([id, t, d], i) => `<li class="step">${vid(id)}<div><small>0${i + 1}</small><h3>${t}</h3><p>${d}</p></div></li>`).join('')}</ol>
  <div class="cw" data-cw="champagne">
    <div class="cw-v">${vid('p-ring', 'cw-video')}</div>
    <div class="cw-c"><h3>${D.cwTitle}</h3><p class="lead">${D.cwSub}</p><div class="cw-chips">${D.colourways.map(([id, t], i) => `<button type="button" data-colour="${id}" aria-pressed="${i === 0}"><i class="sw-${id}"></i>${t}</button>`).join('')}</div></div>
  </div>
</section>

<section class="sec story" id="story" aria-labelledby="st-t">
  <div class="sec-head"><p class="eyebrow">${ST.eyebrow}</p><h2 id="st-t">${ST.h2}</h2><p class="lead">${ST.sub}</p></div>
  <div class="slot" data-slot>
    <div class="slot-reels">${ST.reels.map(([label, items], i) => `<button class="sreel" type="button" data-reel="${i}" aria-pressed="false" aria-label="${label}: ${esc(items[0])}"><span class="sreel-l">${label}</span><span class="sreel-w"><span class="sreel-s" data-strip></span></span><span class="sreel-lock">${ST.lock}</span></button>`).join('')}</div>
    <p class="logline" data-logline aria-live="polite"></p>
    <div class="slot-row"><button class="btn light big" type="button" data-spin>${ST.spin}</button><a class="btn line" href="#pitch" data-use>${ST.use} ${ARROW}</a></div>
    <p class="meta"><span data-spun>0</span> ${ST.count} · ${ST.tapLock}</p>
  </div>
  <script type="application/json" id="reels">${JSON.stringify(ST.reels.map(r => r[1]))}</script>
</section>

<section class="sec portals" id="portals" aria-labelledby="x-t">
  <div class="sec-head"><p class="eyebrow">${X.eyebrow}</p><h2 id="x-t">${X.h2}</h2><p class="lead">${X.sub}</p></div>
  <ul class="ports">${portals.map(p => `<li><a class="port pt-${p.id}" href="${p.href}" data-portal="${p.id}"${p.id === 'email' ? '' : ' rel="me noopener"'}><span class="orb">${GLYPH[p.id]}</span><b>${esc(p.name)}</b><span>${esc(p.handle)}</span></a></li>`).join('')}</ul>
</section>

<section class="sec pitch" id="pitch" aria-labelledby="c-t">
  <div class="sec-head"><p class="eyebrow">${C.eyebrow}</p><h2 id="c-t">${C.h2}</h2></div>
  <form class="form" data-inquiry data-endpoint="${SITE.inquiries.endpoint}" data-key="${SITE.inquiries.key}" novalidate>
    <fieldset class="kinds"><legend>${C.what}</legend>${C.kinds.map(([v, t], i) => `<label><input type="radio" name="category" value="${v}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div class="field"><label for="f-name">${C.name}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="e-name"><p class="error" id="e-name"></p></div>
    <div class="field"><label for="f-email">${C.mail}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" required aria-describedby="e-email"><p class="error" id="e-email"></p></div>
    <div class="field"><label for="f-msg">${C.message}</label><textarea id="f-msg" name="message" rows="4" maxlength="4000" required placeholder="${esc(C.messageHint)}" aria-describedby="e-msg"></textarea><p class="error" id="e-msg"></p></div>
    <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <p class="form-send"><button class="btn light big" type="submit">${C.send}</button><small>${C.privacy}</small></p>
    <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
  </form>
</section>
</main>

<footer class="foot">
  <p class="foot-wm">VERGHÉTHORN</p>
  <p>${L.footer}</p>
  <p class="foot-links"><a href="mailto:${SITE.email}">${SITE.email}</a>${Object.values(SITE.social).map(s => `<a href="${s.href}" rel="me noopener">${s.name}</a>`).join('')}</p>
  <p class="foot-c">© ${new Date().getFullYear()} VERGHÉTHORN · ${L.stock}</p>
</footer>

<div class="portal-ov" data-portal-ov aria-hidden="true"><i class="p1"></i><i class="p2"></i><i class="p3"></i><span class="plane">${svg('<path d="M2 11.5 22 3l-6.5 18-3.8-7.2z" fill="#fff"/><path d="m11.7 13.8 3.8-3.6" stroke="#0a0a0a" stroke-width="1.4"/>')}</span></div>

<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/json" id="i18n">${JSON.stringify(L.js).replace(/</g, '\\u003c')}</script>
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
const old = [['/ru/', '/'], ['/services/', '/#design'], ['/approach/', '/#set'], ['/contact/', '/#pitch'], ['/links/', '/#portals'], ['/archive/', '/'], ['/archive/qist/', '/'], ['/archive/qist/app/', '/'], ['/archive/use-5-now/', '/'], ['/archive/living-shapes/', '/'], ['/archive/lab/', '/'], ['/work/', '/'], ['/work/living-shapes/', '/'], ['/work/usefive/', '/'], ['/work/living-frame/', '/'], ['/practice/', '/'], ['/lab/', '/'], ['/about/', '/']];
old.forEach(([a, b]) => { redirect(a, b); if (a !== '/ru/') redirect('/ru' + a, b); });
writeFileSync(join(ROOT, '404.html'), notFound());
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.url}/</loc><lastmod>${BUILD_DATE}</lastmod></url>
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built · v' + V);
