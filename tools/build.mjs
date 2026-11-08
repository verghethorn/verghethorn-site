// Static site generator for verghethorn.com — run: node tools/build.mjs
// One interactive page (English). /ru/ and older URLs redirect to it.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE, L, FILMS, START } from './content.mjs';

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


const SOCIALS = () => [...Object.entries(SITE.social).map(([id, s]) => ({ id, ...s })), { id: 'email', name: L.contact.emailName, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#3d5afe' }];
const HOMEHREF = h => h.startsWith('#') ? `/${h}` : h;
function gnav(sub = false) {
  const nav = L.nav.map(([h, t]) => [t === 'Films' ? '/films/' : (sub ? HOMEHREF(h) : h), t]);
  return `<header class="gn${sub ? ' gn-sub' : ''}" data-gn>
  <nav class="gn-in" aria-label="Main">
    <a class="wm" href="/" aria-label="VERGHÉTHORN home">VERGHÉTHORN</a>
    <ul class="gn-l" id="gn-menu">${nav.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    <button class="snd" type="button" data-sound aria-pressed="true" aria-label="${L.soundOff}" data-on="${L.soundOff}" data-off="${L.soundOn}">${SOUND}</button>
    <button class="burger" type="button" data-burger aria-expanded="false" aria-controls="gn-menu" aria-label="${L.menu}"><i></i><i></i></button>
  </nav>
</header>`;
}
function footer(sub = false) {
  const anchor = { Films: '/films/', Commercials: '#commercials', 'Product design': '#design', 'Nature & travel': '#nature', 'AI Agents': '#agents', Collaborations: '#collab' };
  const href = x => { const h = anchor[x] || '#lineup'; return sub ? HOMEHREF(h) : h; };
  const socials = SOCIALS();
  return `<footer class="ft">
  <div class="wrap">
    <p class="ft-note">${L.footNote}</p>
    <div class="ft-cols">${L.footCols.map(([h, ls]) => `<div><h3>${h}</h3><ul>${ls.map(x => `<li><a href="${href(x)}">${x}</a></li>`).join('')}</ul></div>`).join('')}
      <div><h3>Contact</h3><ul><li><a href="/start/">Start a project</a></li>${socials.map(s => `<li><a href="${s.href}"${s.id === 'email' ? '' : ' rel="me noopener"'}>${s.name}</a></li>`).join('')}</ul></div></div>
    <p class="ft-b"><span>Copyright © ${new Date().getFullYear()} VERGHÉTHORN. All rights reserved.</span><a href="mailto:${SITE.email}">${SITE.email}</a></p>
  </div>
</footer>`;
}

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
${gnav()}
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
      <script type="application/json" id="agent-cfg">${JSON.stringify({ id: chat.agentId, mail: SITE.email, sdk: `/static/vendor/elevenlabs-client-1.30.0.js?v=${V}`, t: chat.t })}</script>
    </div>
  </div>
</section>

<section class="tile ads" id="commercials" aria-label="${A.h2}">
  <div class="t-txt"><h2>${A.h2}</h2><p class="sub">${A.sub}</p>${btns(A.a, A.b, '#lineup')}</div>
  <div class="t-media">${vid('s-ads')}</div>
</section>

<div class="grid">${L.tiles.map(([id, th, v, t, d, pos]) => `<section class="tile half ${th}" id="${id}" aria-label="${t}">
  <div class="t-txt"><h2>${t}</h2><p class="sub">${d}</p>${id === 'films' ? btns(L.tileA, L.tileB, '/films/', '/start/?s=films') : btns(L.tileA, L.tileB, '#lineup')}</div>
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
    <p class="ctas sm"><a class="pill" href="${v === 's-films' ? '/start/?s=films' : '#contact'}">${LU.b}</a><a class="lnk" href="${v === 's-films' ? '/films/' : '#contact'}">${LU.a} ›</a></p>
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

${footer()}

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


function filmsPage() {
  const F = FILMS, H = F.hero;
  const plus = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  return `${head({ title: F.title, desc: F.desc, path: '/films/' })}
<body class="sub">
<a class="skip" href="#main">${L.skip}</a>
${gnav(true)}
<nav class="ln" aria-label="${F.name}" data-ln>
  <div class="ln-in">
    <a class="ln-t" href="#overview">${F.name}</a>
    <ul class="ln-l">${F.local.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    <a class="pill ln-b" href="/start/?s=films">${F.cta}</a>
  </div>
</nav>

<main id="main">
<section class="fh" id="overview" aria-labelledby="fh-h">
  <div class="fh-txt wrap">
    <p class="fh-eb rv">${H.eyebrow}</p>
    <h1 id="fh-h" class="rv" style="--d:80ms">${H.h1}</h1>
    <p class="fh-sub rv" style="--d:160ms">${H.sub}</p>
    <p class="ctas rv" style="--d:240ms"><button type="button" class="pill" data-film-reel>${H.a}</button><a class="pill ol" href="/start/?s=films">${H.b}</a></p>
  </div>
  <div class="fh-media">${vid('s-films')}</div>
</section>

<section class="fstmt" aria-label="About">
  <p class="fstmt-t wrap" data-words>${F.statement.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ')}</p>
</section>

<section class="sec gray" id="highlights" aria-labelledby="hl-h">
  <div class="sec-h wrap"><h2 id="hl-h">${F.highlights.h2}</h2></div>
  <div class="car-w">
    <ul class="car" data-car>${F.highlights.items.map(([v, k, t], i) => `<li class="card">${vid(v)}<p><span>${k}</span><b>${t}</b></p><button type="button" class="card-plus" data-sheet="${i}" aria-label="More about ${esc(k)}">${plus}</button></li>`).join('')}</ul>
    <p class="car-dots" data-dots>${F.highlights.items.map((_, i) => `<button type="button" aria-label="${i + 1} / ${F.highlights.items.length}"></button>`).join('')}</p>
    <p class="car-nav wrap"><button type="button" data-car-prev aria-label="Previous">${ARROW}</button><button type="button" data-car-next aria-label="Next">${ARROW}</button></p>
  </div>
</section>

<section class="sec" id="how" aria-labelledby="how-h">
  <div class="sec-h wrap center"><h2 id="how-h">${F.how.h2}</h2><p class="sub">${F.how.sub}</p></div>
  <ol class="how wrap">${F.how.steps.map(([t, d], i) => `<li class="rv" style="--d:${i * 90}ms"><span class="how-n">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
</section>

<section class="sec gray" aria-labelledby="get-h">
  <div class="sec-h wrap"><h2 id="get-h">${F.get.h2}</h2></div>
  <ul class="get wrap">${F.get.items.map(([t, d], i) => `<li class="rv" style="--d:${i * 70}ms"><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</section>

<section class="sec" id="faq" aria-labelledby="faq-h">
  <div class="sec-h wrap"><h2 id="faq-h">${F.faq.h2}</h2></div>
  <div class="faq wrap">${F.faq.items.map(([q, a]) => `<details><summary>${q}<i aria-hidden="true"></i></summary><p>${a}</p></details>`).join('')}</div>
</section>

<section class="tile hero dark fend" aria-labelledby="end-h">
  <div class="t-txt"><h2 id="end-h">${F.end.h2}</h2><p class="ctas"><a class="pill" href="/start/?s=films">${F.end.a}</a><a class="pill ol" href="${SITE.social.instagram.href}" rel="noopener">${F.end.b}</a></p></div>
  <div class="t-media">${vid('c-stars')}</div>
</section>
</main>

${footer(true)}

<dialog class="sheet" data-sheet-dlg aria-label="${F.name}">
  <button type="button" class="sheet-x" data-sheet-close aria-label="${L.close}"><i></i><i></i></button>
  <div class="sheet-in" data-sheet-body></div>
</dialog>
<template id="sheets">${F.highlights.items.map(([v, k, , t, ps]) => `<article><p class="sheet-k">${k}</p><h2>${t}</h2><div class="sheet-v">${vid(v)}</div>${ps.map(x => `<p>${x}</p>`).join('')}<p class="ctas"><a class="pill" href="/start/?s=films">${F.cta}</a></p></article>`).join('')}</template>
<dialog class="reel" data-reel-dlg aria-label="${H.a}">
  <button type="button" class="reel-x" data-reel-close aria-label="${L.close}"><i></i><i></i></button>
  <div class="reel-in"><video playsinline controls preload="none" data-reel-v data-src="/media/r/films.mp4?v=${MV}"></video></div>
</dialog>
<script type="module" src="/static/js/sub.js?v=${V}"></script>
</body>
</html>
`;
}

function startPage() {
  const S = START;
  const opt = (step, [val, t, d]) => `<label class="opt"><input type="radio" name="${step}" value="${esc(t || val)}" data-key="${esc(val)}"><span><b>${t || val}</b>${d ? `<small>${d}</small>` : ''}</span></label>`;
  return `${head({ title: S.title, desc: S.desc, path: '/start/' })}
<body class="sub start">
<a class="skip" href="#main">${L.skip}</a>
${gnav(true)}
<main id="main" class="st wrap">
  <header class="st-h"><h1>${S.h1}</h1><p class="sub">${S.sub}</p></header>
  <form class="st-f" data-start novalidate>
    ${S.steps.map((st, i) => `<fieldset class="st-s rv"><legend><span>${i + 1}</span>${st.h}</legend><div class="opts${st.id === 'kind' ? ' big' : ''}">${st.opts.map(o => opt(st.id, o)).join('')}</div></fieldset>`).join('')}
    <fieldset class="st-s rv"><legend><span>${S.steps.length + 1}</span>${S.idea.h}</legend><textarea name="idea" rows="5" placeholder="${esc(S.idea.ph)}" maxlength="2000"></textarea></fieldset>
    <fieldset class="st-s rv"><legend><span>${S.steps.length + 2}</span>${S.you.h}</legend>
      <label class="fld"><span>${S.you.name}</span><input name="name" autocomplete="name"></label>
      <label class="fld"><span>${S.you.contact}</span><input name="contact" autocomplete="email" required></label>
    </fieldset>
    <div class="st-send"><p class="st-err" data-err hidden>${S.need}</p><button type="submit" class="pill big">${S.send}</button><p class="st-note">${S.note}</p></div>
  </form>
</main>
${footer(true)}
<script type="application/json" id="start-cfg">${JSON.stringify({ mail: SITE.email, subject: S.subject })}</script>
<script type="module" src="/static/js/sub.js?v=${V}"></script>
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
for (const [d, html] of [['films', filmsPage()], ['start', startPage()]]) { mkdirSync(join(ROOT, d), { recursive: true }); writeFileSync(join(ROOT, d, 'index.html'), html); }
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.url}/</loc><lastmod>${BUILD_DATE}</lastmod></url>
  <url><loc>${SITE.url}/films/</loc><lastmod>${BUILD_DATE}</lastmod></url>
  <url><loc>${SITE.url}/start/</loc><lastmod>${BUILD_DATE}</lastmod></url>
</urlset>
`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built · v' + V);
