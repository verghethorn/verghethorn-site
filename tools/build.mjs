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
<meta name="theme-color" content="#08080a">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400..700&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, P = L.process, W = L.work, Y = L.why, B = L.lab, C = L.contact;
  const socials = [...Object.entries(SITE.social).map(([id, s]) => ({ id, ...s })), { id: 'email', name: C.emailName, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#3d5afe' }];
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  const sh = (n, h, extra = '') => `<header class="sec-h wrap"><span class="num">${n}</span><h2>${h}</h2>${extra}</header>`;
  const frames = H.scenes.map(([v]) => `<img src="${V_(v)}.webp" alt="" loading="lazy">`).join('');
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
<section class="hero wrap" aria-labelledby="h1">
  <div class="hero-txt">
    <p class="kicker"><i></i>${H.kicker}</p>
    <h1 id="h1">${H.h1}</h1>
  </div>
  <div class="gen" data-gen>
    <div class="gen-bar"><span class="dots"><i></i><i></i><i></i></span><span class="gen-file">${H.file}_<b data-gen-n>01</b>.mp4</span><span class="gen-chips">${H.chips.map(c => `<em>${c}</em>`).join('')}</span></div>
    <div class="gen-frame">
      <video data-gen-v muted playsinline preload="auto" disablepictureinpicture poster="${V_(H.scenes[0][0])}.webp"></video>
      <canvas class="gen-noise" data-gen-noise aria-hidden="true"></canvas>
      <span class="gen-state" data-gen-state aria-live="polite"></span>
    </div>
    <div class="gen-prompt">
      <p class="gen-text"><span class="gen-p">›</span><span data-gen-text></span><span class="cur"></span></p>
      <button type="button" class="gen-go" data-gen-go>${H.gen}<span class="gen-prog" data-gen-prog></span></button>
    </div>
    <div class="gen-try"><span>${H.tryLabel}</span>${H.scenes.map(([v, t], i) => `<button type="button" data-scene="${i}">${t}</button>`).join('')}</div>
    <script type="application/json" id="scenes">${JSON.stringify({ scenes: H.scenes.map(([v, , p]) => [V_(v), p]), t: { gen: H.generating, done: H.done } })}</script>
  </div>
  <div class="hero-more">
    <p class="hero-sub">${H.sub}</p>
    <p class="hero-cta"><a class="btn" href="#contact">${H.cta}</a><a class="btn ghost" href="#process">${H.cta2}</a></p>
  </div>
</section>

<section class="sec process" id="process" aria-label="Process">
  ${sh(P.num, P.h2, `<p class="lead">${P.lead}</p>`)}
  <ol class="pipe wrap">
    <li class="card rv"><span class="num">01</span><h3>${P.steps[0][0]}</h3><p>${P.steps[0][1]}</p>
      <div class="ui ui-script"><p class="ui-h">script.fdx</p>${P.script.map((l, i) => `<p class="s${i}">${esc(l)}</p>`).join('')}</div></li>
    <li class="card rv"><span class="num">02</span><h3>${P.steps[1][0]}</h3><p>${P.steps[1][1]}</p>
      <div class="ui ui-frames"><p class="ui-h">style-frames</p><div class="fr">${frames}</div></div></li>
    <li class="card rv"><span class="num">03</span><h3>${P.steps[2][0]}</h3><p>${P.steps[2][1]}</p>
      <div class="ui ui-shots"><p class="ui-h">shots</p>${P.shots.map(([id, t, p]) => `<p class="shot"><b>${id}</b><span>${t}</span><em>${p === 100 ? '✓' : p ? p + '%' : '—'}</em><i style="--p:${p}%"></i></p>`).join('')}</div></li>
    <li class="card rv"><span class="num">04</span><h3>${P.steps[3][0]}</h3><p>${P.steps[3][1]}</p>
      <div class="ui ui-tl"><p class="ui-h">timeline</p>${P.tracks.map((t, i) => `<p class="trk t${i}"><b>${t}</b><span><i></i><i></i><i></i></span></p>`).join('')}<span class="ph" aria-hidden="true"></span></div></li>
  </ol>
</section>

<section class="sec work" id="work" aria-label="What I make">
  ${sh(W.num, W.h2)}
  <ul class="work-l wrap">${W.items.map(([v, t, d]) => `<li class="wk rv"><div class="wk-v">${vid(v)}<span class="wk-tag">AI · ${t.replace('AI ', '')}</span></div><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</section>

<section class="sec why" aria-label="Why AI cinema">
  ${sh(Y.num, Y.h2)}
  <ul class="why-l wrap">${Y.items.map(([t, d]) => `<li class="rv"><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</section>

<section class="sec lab" id="lab" aria-label="Idea lab">
  ${sh(B.num, B.h2, `<p class="lead">${B.sub}</p>`)}
  <div class="slot wrap" data-slot>
    <div class="slot-reels">${B.reels.map(([label, items], i) => `<button class="sreel" type="button" data-reel="${i}" aria-pressed="false" aria-label="${label}: ${esc(items[0])}"><span class="sreel-l">${label}</span><span class="sreel-w"><span class="sreel-s" data-strip></span></span><span class="sreel-lock">${B.lock}</span></button>`).join('')}</div>
    <p class="logline" data-logline aria-live="polite"></p>
    <div class="slot-row"><button class="btn" type="button" data-spin>${B.spin}</button><a class="btn ghost" href="mailto:${SITE.email}" data-use data-subject="${esc(B.subject)}">${B.use} ${ARROW}</a></div>
  </div>
  <script type="application/json" id="reels">${JSON.stringify(B.reels.map(r => r[1]))}</script>
</section>

<section class="sec contact" id="contact" aria-label="Contact">
  ${sh(C.num, C.h2, `<p class="lead">${C.lead}</p>`)}
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
