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
const MV = hashDir('media');
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
const vid = (id, cls = '', pos = '') => `<video class="${cls}"${pos ? ` style="object-position:${pos}"` : ''} src="${V_(id)}.mp4?v=${MV}" poster="${V_(id)}.webp?v=${MV}" muted loop playsinline preload="none" disablepictureinpicture data-auto></video>`;

function head({ title, desc, path, noindex = false, refresh = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE.url}${path}">`}
<meta name="theme-color" content="#ffffff">
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
</head>`;
}

function page() {
  const H = L.hero, G = L.agents, A = L.ads, K = L.know, LU = L.lineup, Y = L.why, C = L.contact;
  const socials = [...Object.entries(SITE.social).map(([id, s]) => ({ id, ...s })), { id: 'email', name: C.emailName, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#3d5afe' }];
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url, email: SITE.email, sameAs: Object.values(SITE.social).map(s => s.href), description: L.desc };
  const btns = (a, b, ha = '#contact', hb = '#contact', da = '') => `<p class="ctas"><a class="pill" href="${ha}"${da}>${a}</a><a class="pill ol" href="${hb}">${b}</a></p>`;
  const anchor = { Films: '#films', Commercials: '#commercials', 'Product design': '#design', 'Nature & travel': '#nature', 'AI Agents': '#agents', Collaborations: '#collab' };
  const chat = G.chat;
  const agentIcon = `<img src="/media/agent-card.webp?v=${MV}" alt="" loading="lazy">`;
  return `${head({ title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip" href="#main">${L.skip}</a>
<header class="gn" data-gn>
  <nav class="gn-in" aria-label="Main">
    <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
    <ul class="gn-l" id="gn-menu">${L.nav.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
    <button class="burger" type="button" data-burger aria-expanded="false" aria-controls="gn-menu" aria-label="${L.menu}"><i></i><i></i></button>
  </nav>
</header>
<p class="ribbon">${L.ribbon[0]} <a href="#contact">${L.ribbon[1]} ›</a></p>

<main id="main">
<section class="tile hero dark" aria-labelledby="h1">
  <div class="t-txt"><h1 id="h1">${H.h1}</h1><p class="sub">${H.sub}</p>${btns(H.a, H.b, '#reel', '#contact', ' data-reel-open')}</div>
  <div class="t-media hero-media"><video poster="${V_('reel')}.webp?v=${MV}" muted loop playsinline autoplay preload="auto" disablepictureinpicture data-auto><source src="${V_('reel-m')}.mp4?v=${MV}" type="video/mp4" media="(max-width: 734px)"><source src="${V_('reel')}.mp4?v=${MV}" type="video/mp4"></video></div>
</section>

<section class="tile agents gray" id="agents" aria-label="${G.h2}">
  <div class="t-txt"><h2>${G.h2}</h2><p class="sub">${G.sub}</p><p class="ctas"><button type="button" class="pill" data-agent-call>${G.a}</button><a class="pill ol" href="#contact">${G.b}</a></p></div>
  <div class="t-media phone-wrap">
    <div class="phone" data-chat>
      <div class="ph-call"><img src="/media/agent-call.webp?v=${MV}" alt="${esc(chat.alt)}" width="940" height="620"><span class="visor" aria-hidden="true"></span>
        <span class="live"><i></i>${chat.live}</span><span class="wave" aria-hidden="true">${'<i></i>'.repeat(14)}</span></div>
      <p class="ph-top"><img class="ph-av" src="/media/agent-av.webp?v=${MV}" alt="" width="36" height="36"><span><b>${chat.name}</b><small data-agent-status>${chat.status}</small></span></p>
      <ul class="ph-msgs" data-agent-log aria-live="polite">${chat.msgs.map(([w, t]) => `<li class="m ${w}">${esc(t)}</li>`).join('')}<li class="m a typing" aria-hidden="true"><i></i><i></i><i></i></li></ul>
      <div class="ph-dock">
        <form class="ph-comp" data-agent-form><input type="text" data-agent-input placeholder="${esc(chat.type)}" aria-label="${esc(chat.type)}" maxlength="400" autocomplete="off" enterkeyhint="send"><button type="submit" class="ph-send" aria-label="${esc(chat.send)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></form>
        <button type="button" class="ph-mic" data-agent-call aria-label="${esc(chat.call)}" data-on="${esc(chat.call)}" data-off="${esc(chat.end)}"><svg class="i-mic" viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><svg class="i-end" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14.5c5-4.7 13-4.7 18 0l-2.4 2.6-3.6-1.6v-2.6a12 12 0 0 0-6 0v2.6l-3.6 1.6z" fill="currentColor"/></svg></button>
      </div>
      <script type="application/json" id="agent-cfg">${JSON.stringify({ id: chat.agentId, sdk: `/static/vendor/elevenlabs-client-1.30.0.js?v=${V}`, t: chat.t })}</script>
    </div>
  </div>
</section>

<section class="tile ads" id="commercials" aria-label="${A.h2}">
  <div class="t-txt"><h2>${A.h2}</h2><p class="sub">${A.sub}</p>${btns(A.a, A.b, '#lineup')}</div>
  <div class="t-media">${vid('s-ads')}</div>
</section>

<div class="grid">${L.tiles.map(([id, th, v, t, d, pos]) => `<section class="tile half ${th}" id="${id}" aria-label="${t}">
  <div class="t-txt"><h2>${t}</h2><p class="sub">${d}</p>${btns(L.tileA, L.tileB, '#lineup')}</div>
  <div class="t-media">${vid(v, '', pos)}</div>
</section>`).join('')}</div>

<section class="sec gray" aria-labelledby="know-h">
  <div class="sec-h wrap"><h2 id="know-h">${K.h2}</h2></div>
  <div class="car-w">
    <ul class="car" data-car>${K.items.map(([v, k, t, pos]) => `<li class="card">${vid(v, '', pos)}<p><span>${k}</span><b>${t}</b></p></li>`).join('')}</ul>
    <p class="car-dots" data-dots>${K.items.map((_, i) => `<button type="button" aria-label="${i + 1} / ${K.items.length}"></button>`).join('')}</p>
    <p class="car-nav wrap"><button type="button" data-car-prev aria-label="Previous">${ARROW}</button><button type="button" data-car-next aria-label="Next">${ARROW}</button></p>
  </div>
</section>

<section class="sec" id="lineup" aria-labelledby="lu-h">
  <div class="sec-h wrap"><h2 id="lu-h">${LU.h2}</h2></div>
  <ul class="lineup wrap">${LU.items.map(([v, t, d, pts]) => `<li class="rv">
    <div class="li-img">${v === 'agent' ? agentIcon : `<img src="${V_(v)}.webp?v=${MV}" alt="" loading="lazy">`}</div>
    <h3>${t}</h3><p class="li-d">${d}</p>
    <p class="ctas sm"><a class="pill" href="#contact">${LU.b}</a><a class="lnk" href="#contact">${LU.a} ›</a></p>
    <ul class="li-pts">${pts.map(x => `<li>${x}</li>`).join('')}</ul>
  </li>`).join('')}</ul>
</section>

<section class="sec gray" aria-labelledby="why-h">
  <div class="sec-h wrap"><h2 id="why-h">${Y.h2}</h2></div>
  <ul class="why wrap">${Y.items.map(([i, t, d], k) => `<li class="rv" style="--d:${k * 80}ms"><span class="why-i" aria-hidden="true">${i}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</section>

<section class="sec contact" id="contact" aria-labelledby="c-h">
  <div class="sec-h wrap center"><h2 id="c-h">${C.h2}</h2><p class="sub">${C.sub}</p></div>
  <ul class="socials wrap">${socials.map((s, i) => `<li class="rv" style="--d:${i * 70}ms"><a class="soc" href="${s.href}" data-soc="${s.id}" style="--c:${s.color}"${s.id === 'email' ? '' : ' rel="me noopener"'}><span class="soc-i">${GLYPH[s.id]}</span><span class="soc-t"><b>${esc(s.name)}</b><small>${esc(s.handle)}</small></span><span class="soc-a">${ARROW}</span></a></li>`).join('')}</ul>
</section>
</main>

<footer class="ft">
  <div class="wrap">
    <p class="ft-note">${L.footNote}</p>
    <div class="ft-cols">${L.footCols.map(([h, ls]) => `<div><h3>${h}</h3><ul>${ls.map(x => `<li><a href="${anchor[x] || '#lineup'}">${x}</a></li>`).join('')}</ul></div>`).join('')}
      <div><h3>Contact</h3><ul>${socials.map(s => `<li><a href="${s.href}"${s.id === 'email' ? '' : ' rel="me noopener"'}>${s.name}</a></li>`).join('')}</ul></div></div>
    <p class="ft-b"><span>Copyright © ${new Date().getFullYear()} VERGHÉTHORN. All rights reserved.</span><a href="mailto:${SITE.email}">${SITE.email}</a></p>
  </div>
</footer>

<dialog class="reel" data-reel-dlg aria-label="${L.reels.label}">
  <button type="button" class="reel-x" data-reel-close aria-label="${L.close}"><i></i><i></i></button>
  <div class="reel-in">
    <video playsinline controls preload="none" data-reel-v></video>
    <p class="reel-h">${L.reels.pick}</p>
    <ul class="reel-pick">${L.reels.items.map(([id, t, th], i) => `<li><button type="button" data-reel="/media/r/${id}.mp4?v=${MV}" aria-pressed="${i === 0}"><img src="${V_(th)}.webp?v=${MV}" alt="" loading="lazy"><span>${t}</span></button></li>`).join('')}</ul>
  </div>
</dialog>
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
<body class="nf"><main class="nf-main"><p class="lbl">404</p><h1>${N.h1}</h1><p class="lead">${N.text}</p><p><a class="btn" href="/">${N.home}</a></p></main></body></html>`;
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
