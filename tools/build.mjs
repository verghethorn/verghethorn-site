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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300..600&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, SV = L.services, W = L.work, K = L.craft, C = L.contact;
  const socials = [...Object.entries(SITE.social).map(([id, s]) => ({ id, ...s })), { id: 'email', name: C.emailName, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#3d5afe' }];
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  const words = L.statement.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ');
  return `${head({ title: L.title, desc: L.desc, path: '/' })}
<body data-theme="dark">
<a class="skip" href="#main">${L.skip}</a>
<header class="hd" data-hd>
  <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
  <nav class="nav" aria-label="Sections">${L.nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
  <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
</header>

<main id="main">
<section class="hero" data-theme="dark" data-hero aria-label="VERGHÉTHORN — ${H.tag}">
  <div class="hero-pin">
    <div class="hero-film">
      <video src="${V_('reel')}.mp4" poster="${V_('reel')}.webp" muted loop playsinline autoplay preload="auto" disablepictureinpicture data-reel></video>
    </div>
    <div class="hero-id">
      <h1 class="hero-wm">VERGHÉTHORN</h1>
      <p class="hero-tag">${H.tag}</p>
    </div>
    <p class="hero-over" aria-hidden="true">${H.over}</p>
    <div class="hero-foot">
      <p class="reel-l"><span>${H.reel}</span><b data-clip>${H.clips[0]}</b></p>
      <p class="reel-bar" aria-hidden="true">${H.clips.map(() => '<i><em></em></i>').join('')}</p>
      <p class="scroll-c" aria-hidden="true">${H.scroll}<i></i></p>
    </div>
    <script type="application/json" id="clips">${JSON.stringify(H.clips)}</script>
  </div>
</section>

<section class="stmt" data-theme="light" aria-label="About">
  <p class="stmt-t" data-words>${words}</p>
</section>

<section class="svc" id="services" data-theme="dark" aria-label="${SV.label}">
  ${SV.items.map(([v, t, d], i) => `<article class="svc-c" data-card>
    <div class="svc-v">${vid(v)}</div>
    <div class="svc-t"><p class="lbl">${String(i + 1).padStart(2, '0')} — ${SV.label}</p><h2>${t}</h2><p>${d}</p></div>
  </article>`).join('')}
</section>

<section class="work" id="work" data-theme="light" aria-label="${W.label}">
  <header class="sh wrap rv"><p class="lbl">${W.label}</p><h2>${W.h2}</h2>
    <p class="arrows"><button type="button" data-prev aria-label="${W.prev}">${ARROW}</button><button type="button" data-next aria-label="${W.next}">${ARROW}</button></p></header>
  <ul class="rail" data-rail>${W.items.map(([v, t, c, fx]) => `<li class="tile rv"${fx ? ` style="--fx:${fx}"` : ''}><div class="tile-v">${vid(v)}</div><p class="tile-c"><b>${t}</b><span>${c}</span></p></li>`).join('')}</ul>
</section>

<section class="craft" data-theme="light" aria-label="${K.label}">
  <div class="wrap">
    <header class="sh rv"><p class="lbl">${K.label}</p><h2>${K.h2}</h2></header>
    <ol class="steps">${K.steps.map((s, i) => `<li class="rv" style="--d:${i * 90}ms"><span>${String(i + 1).padStart(2, '0')}</span><b>${s}</b></li>`).join('')}</ol>
  </div>
</section>

<section class="contact" id="contact" data-theme="dark" aria-label="${C.label}">
  <div class="wrap">
    <header class="sh rv"><p class="lbl">${C.label}</p><h2 class="big">${C.h2}</h2><p class="lead">${C.lead}</p></header>
    <ul class="socials">${socials.map((s, i) => `<li class="rv" style="--d:${i * 80}ms"><a class="soc" href="${s.href}" data-soc="${s.id}" style="--c:${s.color}"${s.id === 'email' ? '' : ' rel="me noopener"'}><span class="soc-i">${GLYPH[s.id]}</span><span class="soc-t"><b>${esc(s.name)}</b><small>${esc(s.handle)}</small></span><span class="soc-a">${ARROW}</span></a></li>`).join('')}</ul>
  </div>
  <footer class="foot wrap">
    <p class="foot-wm">VERGHÉTHORN</p>
    <p class="foot-row"><span>${L.footer}</span><span>© ${new Date().getFullYear()} VERGHÉTHORN · ${L.credits}</span></p>
  </footer>
</section>
</main>

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
<body class="nf" data-theme="dark"><main class="nf-main"><p class="lbl">404</p><h1>${N.h1}</h1><p class="lead">${N.text}</p><p><a class="btn" href="/">${N.home}</a></p></main></body></html>`;
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
