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
const vid = (id, cls = '') => `<video class="${cls}" src="${V_(id)}.mp4" poster="${V_(id)}.webp" muted loop playsinline preload="none" disablepictureinpicture data-auto></video>`;

function head({ title, desc, path, noindex = false, refresh = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE.url}${path}">`}
<meta name="theme-color" content="#0d0c0b">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400..700;1,400..600&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, F = L.films, D = L.design, B = L.bridge, C = L.contact;
  const socials = [...Object.entries(SITE.social).map(([id, s]) => ({ id, ...s })), { id: 'email', name: C.emailName, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#3d5afe' }];
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  return `${head({ title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip" href="#main">${L.skip}</a>
<header class="hd" data-hd>
  <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
  <nav class="nav" aria-label="Sections">${L.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
  <a class="hd-cta" href="#contact">${L.talk}</a>
</header>

<main id="main">
<section class="hero" aria-labelledby="h1" data-hero>
  <video class="hero-v" data-hero-v muted loop playsinline autoplay preload="auto" disablepictureinpicture poster="${V_('hero')}.webp" data-src-d="${V_('hero')}.mp4" data-src-m="${V_('hero-m')}.mp4" data-poster-m="${V_('hero-m')}.webp"></video>
  <div class="hero-shade" aria-hidden="true"></div>
  <p class="hero-tc" aria-hidden="true"><i></i><span data-held-l>REC</span> <span data-tc>00:00:00:00</span></p>
  <div class="hero-in">
    <p class="kicker">${H.eyebrow}</p>
    <h1 id="h1">${H.h1}</h1>
  </div>
  <button class="hold" type="button" data-hold aria-label="${H.hold}"><span class="hold-ring" aria-hidden="true"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30"/></svg><i></i></span><span class="hold-t" data-hold-t data-a="${H.hold}" data-b="${H.held}">${H.hold}</span></button>
</section>

<section class="statement wrap" aria-label="About"><p data-words>${L.statement}</p></section>

<section class="sec films" id="films" aria-labelledby="f-t">
  <header class="sec-h wrap"><span class="num">${F.num}</span><h2 id="f-t">${F.h2}</h2><p class="lead">${F.lead}</p></header>
  <div class="reel wrap" data-rail>${F.tiles.map(([v, c, k]) => `<figure class="tile ${k}">${vid(v)}<figcaption><i></i>${c}</figcaption></figure>`).join('')}</div>
  <ul class="kinds wrap">${F.list.map(([t, d]) => `<li class="rv"><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</section>

<section class="sec design" id="design" aria-labelledby="d-t">
  <header class="sec-h wrap"><span class="num">${D.num}</span><h2 id="d-t">${D.h2}</h2>
    <p class="lead big">${D.leadA} <span class="swap" data-swap aria-live="off">${D.words[0]}</span><span class="sp"> </span><br>${D.leadB}</p></header>
  <script type="application/json" id="words">${JSON.stringify(D.words)}</script>
  <ol class="steps wrap">${D.steps.map(([v, t, d], i) => `<li class="step rv"><div class="step-v">${vid(v)}</div><span class="num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
</section>

<section class="bridge" aria-labelledby="b-t">
  ${vid('d-teapot', 'bridge-v')}
  <div class="bridge-in wrap"><h2 id="b-t" class="rv">${B.h2}</h2><p class="rv">${B.p}</p></div>
</section>

<section class="sec contact" id="contact" aria-labelledby="c-t">
  <header class="sec-h wrap"><span class="num">${C.num}</span><h2 id="c-t">${C.h2}</h2><p class="lead">${C.lead}</p></header>
  <ul class="socials wrap">${socials.map(s => `<li><a class="soc" href="${s.href}" data-soc="${s.id}" style="--c:${s.color}"${s.id === 'email' ? '' : ' rel="me noopener"'}><span class="soc-i">${GLYPH[s.id]}</span><span class="soc-t"><b>${esc(s.name)}</b><small>${esc(s.handle)}</small></span><span class="soc-a">${ARROW}</span></a></li>`).join('')}</ul>
</section>
</main>

<footer class="foot wrap">
  <p class="foot-wm">VERGHÉTHORN</p>
  <p>${L.footer}</p>
  <p class="foot-c">© ${new Date().getFullYear()} VERGHÉTHORN · ${L.credits}</p>
</footer>

<div class="warp" data-warp aria-hidden="true"><span class="warp-i"></span></div>

<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="module" src="/static/js/site.js?v=${V}"></script>
</body>
</html>
`;
}

function notFound() {
  const N = L.notFound;
  return `${head({ title: N.title, desc: N.text, path: '/404.html', noindex: true })}
<body class="nf"><main class="nf-main"><p class="kicker">404</p><h1>${N.h1}</h1><p class="lead">${N.text}</p><p class="nf-cta"><a class="btn big" href="/">${N.home}</a></p></main></body></html>`;
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
