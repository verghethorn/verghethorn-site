// Static site generator for verghethorn.com — run: node tools/build.mjs
// Writes EN pages at /… and RU pages at /ru/… with hreflang, sitemap and shared assets.
import { mkdirSync, writeFileSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE, HEROES, LANGS } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const ver = f => createHash('sha1').update(readFileSync(join(ROOT, f))).digest('hex').slice(0, 8);
const V = { css: ver('static/css/site.css'), js: ver('static/js/site.js') };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const pre = L => (L.lang === 'en' ? '' : '/ru');
const href = (L, p) => pre(L) + p;
const pages = [];

const ARROW = '<svg class="arr" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
const EXT = '<svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';

function head(L, { title, desc, path, image = '/media/og.jpg', jsonld = '', noindex = false }) {
  const other = LANGS[L.other];
  const enUrl = SITE.url + path, ruUrl = SITE.url + '/ru' + path;
  const self = L.lang === 'en' ? enUrl : ruUrl;
  return `<!doctype html>
<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ru" href="${ruUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">`}
<meta name="theme-color" content="#0B0D10">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VERGHÉTHORN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${self}">
<meta property="og:image" content="${SITE.url}${image}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="${L.locale}"><meta property="og:locale:alternate" content="${other.locale}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/static/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.png" type="image/png" sizes="180x180">
<link rel="apple-touch-icon" href="/static/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300..700&family=Spectral:ital,wght@0,300;0,400;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V.css}">
${jsonld}
</head>`;
}

function header(L, active, path) {
  const n = L.nav;
  const item = (k, p) => `<a href="${href(L, p)}"${active === k ? ' aria-current="page"' : ''}>${n[k]}</a>`;
  const enHref = path, ruHref = '/ru' + path;
  return `<a class="skip-link" href="#main">${L.skip}</a>
<header class="site-header">
  <div class="wrap">
    <a class="wordmark" href="${href(L, '/')}" aria-label="VERGHÉTHORN — ${L.lang === 'en' ? 'home' : 'главная'}"><span class="slit" aria-hidden="true"></span>VERGHÉTHORN</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">${L.menu}</button>
    <nav class="nav" id="site-nav" aria-label="${L.lang === 'en' ? 'Main' : 'Основное'}">
      ${item('work', '/work/')}${item('practice', '/practice/')}${item('lab', '/lab/')}${item('about', '/about/')}${item('contact', '/contact/')}
      <span class="lang" role="group" aria-label="${L.lang === 'en' ? 'Language' : 'Язык'}">
        <a href="${enHref}" hreflang="en" lang="en" data-lang-link="en"${L.lang === 'en' ? ' aria-current="true"' : ''}>EN</a>
        <a href="${ruHref}" hreflang="ru" lang="ru" data-lang-link="ru"${L.lang === 'ru' ? ' aria-current="true"' : ''}>RU</a>
      </span>
    </nav>
  </div>
</header>`;
}

function footer(L) {
  const n = L.nav;
  return `<footer class="site-footer">
  <div class="wrap">
    <div style="display:grid;gap:14px">
      <a class="wordmark" href="${href(L, '/')}"><span class="slit" aria-hidden="true"></span>VERGHÉTHORN</a>
      <small>${L.footer.line}<br>${L.footer.rights}</small>
      <small>© ${new Date().getFullYear()} VERGHÉTHORN · <a href="mailto:${SITE.email}">${SITE.email}</a></small>
    </div>
    <nav aria-label="${L.lang === 'en' ? 'Footer' : 'Подвал'}">
      <a href="${href(L, '/work/')}">${n.work}</a><a href="${href(L, '/practice/')}">${n.practice}</a><a href="${href(L, '/lab/')}">${n.lab}</a><a href="${href(L, '/about/')}">${n.about}</a><a href="${href(L, '/contact/')}">${n.contact}</a>
      ${SITE.social.map(s => `<a href="${s.href}" rel="me noopener" target="_blank">${s.name} ${EXT}</a>`).join('')}
    </nav>
  </div>
</footer>`;
}

function page(L, meta, active, body, { module = true } = {}) {
  return `${head(L, meta)}
<body>
${header(L, active, meta.path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(L)}
<script type="application/json" id="i18n">${JSON.stringify(L.js).replace(/</g, '\\u003c')}</script>
${module ? `<script type="module" src="/static/js/site.js?v=${V.js}"></script>` : ''}
</body>
</html>
`;
}

function out(path, html) {
  const file = join(ROOT, path.endsWith('/') ? path + 'index.html' : path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  pages.push(path);
}

const statusTags = (L, p) => p.status.map(s => `<span class="status"${s === 'live' ? ' data-live' : ''}>${L.statuses[s]}</span>`).join('');

function thumb(p, L, eager = false) {
  const load = eager ? 'eager' : 'lazy';
  if (p.thumb === 'living-shapes') return `<img src="/media/living-shapes-960.webp" width="960" height="540" alt="" loading="${load}" decoding="async" style="object-position:50% 55%">`;
  if (p.thumb === 'usefive') return `<video muted playsinline loop preload="none" data-preview data-src="/media/usefive-preview.mp4" poster="/media/usefive-portrait-480.webp" aria-hidden="true"></video>`;
  return `<svg viewBox="0 0 400 300" width="400" height="300" aria-hidden="true" style="background:#0B0D10"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F1EEE8" stop-opacity="0"/><stop offset=".5" stop-color="#F1EEE8"/><stop offset="1" stop-color="#F1EEE8" stop-opacity="0"/></linearGradient><radialGradient id="r"><stop offset="0" stop-color="#F1EEE8" stop-opacity=".25"/><stop offset="1" stop-color="#F1EEE8" stop-opacity="0"/></radialGradient></defs><rect x="40" y="70" width="320" height="134" fill="none" stroke="#AEB7C6" stroke-opacity=".35"/><ellipse cx="200" cy="137" rx="90" ry="60" fill="url(#r)"/><rect x="199" y="60" width="2" height="154" fill="url(#g)"/><g fill="#AEB7C6" fill-opacity=".5">${Array.from({ length: 12 }, (_, i) => `<circle cx="${60 + i * 26}" cy="235" r="${1 + (i % 3)}"/>`).join('')}</g></svg>`;
}

function workRow(L, p, i, eager) {
  return `<li class="work-row" data-cats="${p.cats.join(' ')}">
  <a href="${href(L, '/work/' + p.slug + '/')}" data-cursor="${L.home.open}">
    <span class="work-num">${String(i + 1).padStart(2, '0')}</span>
    <span class="work-title">${esc(p.title)}</span>
    <span class="work-desc">${esc(p.short)}</span>
    <span class="work-meta"><span class="tag-row">${statusTags(L, p)}</span><span class="mono">${p.cats.map(c => L.cats[c]).join(' · ')} · ${p.year}</span></span>
    <span class="work-thumb" aria-hidden="true">${thumb(p, L, eager)}</span>
  </a>
</li>`;
}

/* ================= HOME ================= */
function home(L) {
  const H = L.home;
  const spots = HEROES.map(h => ({ x: h.x, y: h.y, w: h.w, h: h.h, rgb: h.rgb }));
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': SITE.url + '/#org', name: 'VERGHÉTHORN', alternateName: 'VERGHETHORN', url: SITE.url + '/', email: SITE.email, logo: SITE.url + '/static/apple-touch-icon.png', founder: { '@type': 'Person', name: 'Rashid Kurabegov' }, sameAs: SITE.social.map(s => s.href) },
      { '@type': 'WebSite', '@id': SITE.url + '/#site', url: SITE.url + '/', name: 'VERGHÉTHORN', inLanguage: ['en', 'ru'], publisher: { '@id': SITE.url + '/#org' } },
    ],
  })}</script>`;
  const body = `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-stage">
    <div>
      <div class="frame" data-living-frame data-mode="0" data-src="/media/living-shapes-2048.webp" data-spots='${JSON.stringify(spots)}' role="img" aria-label="${esc(H.frameTitle)}">
        <div class="frame-meta" aria-hidden="true"><span data-frame-meta>${L.js.frameMeta[0]}</span><span data-timecode>TC 00:00:00:00</span></div>
        <div class="frame-fallback" style="background-image:url(/media/living-shapes-1600.webp)"></div>
        <canvas aria-hidden="true"></canvas>
        <div class="frame-ui">
          ${HEROES.map((h, i) => `<a class="hotspot" href="${href(L, '/work/living-shapes/#' + h.id)}" data-spot="${i}" style="--c:${h.color}" data-cursor="${L.home.open}"><span class="tag">${h.name} <small>${esc(L.livingShapes.heroes[h.id].split(' · ')[0])}</small></span><span class="visually-hidden">— Living Shapes</span></a>`).join('')}
        </div>
        <div class="frame-marks" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <p class="frame-hint" aria-hidden="true"><span class="hint-fine">${H.hintFine}</span><span class="hint-coarse">${H.hintCoarse}</span></p>
      </div>
      <div class="shift">
        <span class="shift-label" id="shift-label">${H.shiftLabel}</span>
        <div class="shift-track" role="radiogroup" aria-labelledby="shift-label">
          <span class="shift-thumb" aria-hidden="true"></span>
          ${H.modes.map((m, i) => `<button type="button" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${m}</button>`).join('')}
        </div>
      </div>
    </div>
  </div>
  <div class="wrap hero-copy">
    <div>
      <p class="eyebrow">${H.eyebrow}</p>
      <h1 class="display" id="hero-title">${H.h1}</h1>
    </div>
    <div class="side">
      <p class="lede">${H.lede}</p>
      <div class="actions">
        <a class="btn" href="${href(L, '/work/')}">${H.ctaWork} ${ARROW}</a>
        <a class="btn ghost" href="${href(L, '/contact/')}">${H.ctaContact}</a>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="sel-title">
  <div class="wrap">
    <div class="section-head reveal">
      <div><p class="eyebrow">${H.selectedEyebrow}</p><h2 class="h2" id="sel-title">${H.selectedTitle}</h2></div>
      <a class="link-arrow" href="${href(L, '/work/')}">${H.allWork} ${ARROW}</a>
    </div>
    <ol class="work-list">
      ${L.projects.map((p, i) => workRow(L, p, i)).join('\n')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="pr-title">
  <div class="wrap grid-12">
    <div style="grid-column:1 / span 5" class="reveal">
      <p class="eyebrow">${H.practiceEyebrow}</p>
      <h2 class="h2" id="pr-title">${H.practiceTitle}</h2>
      <p style="margin-top:32px"><a class="link-arrow" href="${href(L, '/practice/')}">${H.practiceLink} ${ARROW}</a></p>
    </div>
    <ol class="disciplines" style="grid-column:6 / -1">
      ${L.practice.map((d, i) => `<li class="reveal"><span class="work-num">${String(i + 1).padStart(2, '0')}</span><span class="d-name">${d.name}</span><p>${d.line}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="au-title">
  <div class="wrap author">
    <div class="reveal"><p class="eyebrow">${H.authorEyebrow}</p><h2 class="h2" id="au-title">${H.authorTitle}</h2></div>
    <div class="body-copy reveal">
      ${H.authorText.map(t => `<p>${t}</p>`).join('')}
      <p><a class="link-arrow" href="${href(L, '/about/')}">${H.authorLink} ${ARROW}</a></p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="ct-title">
  <div class="wrap contact-band">
    <p class="eyebrow">${H.contactEyebrow}</p>
    <h2 class="h2 reveal" id="ct-title">${H.contactTitle}</h2>
    <a class="big-mail reveal" href="mailto:${SITE.email}">${SITE.email}</a>
    <p><a class="btn" href="${href(L, '/contact/')}">${H.contactLink} ${ARROW}</a></p>
  </div>
</section>`;
  out(href(L, '/'), page(L, { title: H.title, desc: H.desc, path: '/', jsonld }, null, body));
}

/* ================= WORK ================= */
function work(L) {
  const W = L.workPage;
  const counts = Object.fromEntries(Object.keys(L.cats).map(c => [c, L.projects.filter(p => p.cats.includes(c)).length]));
  const body = `
<header class="page-head"><div class="wrap">
  <p class="eyebrow">${W.eyebrow}</p>
  <h1 class="display">${W.h1}</h1>
  <p class="lede">${W.lede}</p>
  <div class="filters" data-filter role="group" aria-label="${L.lang === 'en' ? 'Filter by discipline' : 'Фильтр по направлению'}">
    <button type="button" data-cat="all" aria-pressed="true"><span class="label">${W.all}</span><span class="count">${L.projects.length}</span></button>
    ${Object.entries(L.cats).map(([k, v]) => `<button type="button" data-cat="${k}" aria-pressed="false"><span class="label">${v}</span><span class="count">${counts[k]}</span></button>`).join('')}
  </div>
  <p class="visually-hidden" aria-live="polite" data-result-count></p>
</div></header>
<section class="section" style="padding-top:0"><div class="wrap">
  <ol class="work-list" style="border-top:0">
    ${L.projects.map((p, i) => workRow(L, p, i, i === 0)).join('\n')}
  </ol>
  <div class="empty-state" data-empty hidden><p>${W.empty}</p><a class="btn ghost" href="${href(L, '/contact/')}">${W.emptyCta} ${ARROW}</a></div>
</div></section>`;
  out(href(L, '/work/'), page(L, { title: W.title, desc: W.desc, path: '/work/' }, 'work', body));
}

function caseShell(L, p, C, inner, heroMedia) {
  const idx = L.projects.findIndex(x => x.slug === p.slug);
  const next = L.projects[(idx + 1) % L.projects.length];
  const jsonld = `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: strip(C.desc), dateCreated: String(p.year), creativeWorkStatus: L.statuses[p.status[1]], author: { '@type': 'Organization', name: 'VERGHÉTHORN', url: SITE.url + '/' }, inLanguage: L.lang, url: SITE.url + href(L, '/work/' + p.slug + '/') })}</script>`;
  const body = `
<article>
<header class="case-hero"><div class="wrap">
  <p class="eyebrow"><a href="${href(L, '/work/')}" style="text-decoration:none">${L.case.back}</a> / ${p.cats.map(c => L.cats[c]).join(' · ')}</p>
  <h1 class="display">${C.h1}</h1>
  <p class="lede" style="margin-top:28px">${C.lede}</p>
  ${heroMedia}
  <dl class="facts" style="margin-top:0">
    <div><dt>${L.case.status}</dt><dd><span class="tag-row">${statusTags(L, p)}</span></dd></div>
    <div><dt>${L.case.year}</dt><dd>${p.year}</dd></div>
    <div><dt>${L.case.role}</dt><dd>${esc(p.role)}</dd></div>
    <div><dt>${L.case.format}</dt><dd>${esc(p.format)}</dd></div>
  </dl>
</div></header>
<div class="wrap">
${inner}
</div>
</article>
<a class="next-case" href="${href(L, '/work/' + next.slug + '/')}" data-cursor="${L.home.open}"><div class="wrap">
  <p class="eyebrow">${L.case.next}</p><p class="display" style="font-size:clamp(44px,8vw,128px)">${esc(next.title)} ${ARROW.replace('width="14" height="14"', 'width="0.5em" height="0.5em"')}</p>
</div></a>`;
  out(href(L, '/work/' + p.slug + '/'), page(L, { title: C.title, desc: C.desc, path: '/work/' + p.slug + '/', jsonld, image: p.slug === 'usefive' ? '/media/og.jpg' : '/media/og.jpg' }, 'work', body));
}

const chapters = list => list.map(([k, h, ps]) => `<section class="chapter reveal"><h2>${k}</h2><div><p class="h2">${h}</p><div class="body-copy">${ps.map(t => `<p>${t}</p>`).join('')}</div></div></section>`).join('\n');

function livingShapes(L) {
  const C = L.livingShapes, p = L.projects.find(x => x.slug === 'living-shapes');
  const media = `<div class="media" style="view-transition-name:case-media"><img src="/media/living-shapes-1600.webp" srcset="/media/living-shapes-960.webp 960w, /media/living-shapes-1600.webp 1600w, /media/living-shapes-2048.webp 2048w" sizes="(max-width: 1440px) 100vw, 1440px" width="1600" height="900" alt="${esc(C.imgAlt)}" fetchpriority="high"></div>`;
  const inner = `
${chapters(C.chapters)}
<section class="chapter" aria-labelledby="heroes-t">
  <h2 id="heroes-t">${C.heroesTitle}</h2>
  <div class="heroes" data-heroes>
    <p class="body-copy" style="margin:0">${C.heroesHint}</p>
    <div class="heroes-stage"><img src="/media/living-shapes-1600.webp" srcset="/media/living-shapes-1600.webp 1600w, /media/living-shapes-2048.webp 2048w" sizes="(max-width: 860px) 100vw, 66vw" width="1600" height="900" alt="" loading="lazy" decoding="async"></div>
    <p class="mono" aria-live="polite" data-hero-caption data-default="${esc(C.heroesDefault)}">${C.heroesDefault}</p>
    <ul class="heroes-list">
      ${HEROES.map(h => `<li id="${h.id}"><button type="button" aria-pressed="false" data-hero="${h.id}" data-x="${(h.x * 100).toFixed(1)}" data-y="${(h.y * 100).toFixed(1)}" data-caption="${esc(h.name + ' — ' + C.heroes[h.id])}" style="--c:${h.color}"><span class="n">${h.name.toUpperCase()}</span><span class="m">${C.heroes[h.id]}</span></button></li>`).join('')}
    </ul>
  </div>
</section>
<section class="chapter reveal"><h2>${C.resultTitle}</h2><div class="body-copy">${C.result.map(t => `<p>${t}</p>`).join('')}<p style="display:flex;gap:24px;align-items:center;flex-wrap:wrap"><img src="/media/ring-720.webp" width="120" height="120" alt="" loading="lazy" style="width:120px;height:120px;mix-blend-mode:screen"><a class="link-arrow" href="https://www.youtube.com/@verghethorn" rel="noopener" target="_blank">${C.follow} ${EXT}</a></p></div></section>`;
  caseShell(L, p, C, inner, media);
}

function usefive(L) {
  const C = L.usefive, p = L.projects.find(x => x.slug === 'usefive');
  const media = `<div class="media" style="view-transition-name:case-media;aspect-ratio:auto;display:grid;grid-template-columns:1fr 1fr;gap:2px;background:var(--line)"><img src="/media/agent-brother-640.webp" width="640" height="640" alt="${L.lang === 'en' ? 'UseFive agent for brothers: a hooded figure with a blue LED visor' : 'Агент UseFive для братьев: фигура в капюшоне с синим LED-визором'}" fetchpriority="high"><img src="/media/agent-sister-640.webp" width="640" height="640" alt="${L.lang === 'en' ? 'UseFive agent for sisters: a hooded figure with a pink LED visor' : 'Агент UseFive для сестёр: фигура в капюшоне с розовым LED-визором'}"></div>`;
  const inner = `
${chapters(C.chapters)}
<section class="chapter" aria-labelledby="film-t">
  <h2 id="film-t">${C.filmTitle}</h2>
  <div>
    <div class="player" data-player style="aspect-ratio:9/16;max-width:420px">
      <video playsinline preload="none" poster="/media/usefive-portrait-720.webp" width="720" height="1280"><source src="/media/usefive-full.mp4" type="video/mp4"></video>
      <button class="player-big" type="button" aria-label="${L.js.play}" data-cursor="${L.js.play}"><svg width="22" height="22" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg></button>
      <div class="player-ui"><button type="button" data-play></button><input type="range" min="0" max="30" step="0.1" value="0" aria-label="${L.lang === 'en' ? 'Seek' : 'Перемотка'}"><time>0:00 / 0:30</time></div>
    </div>
    <p class="notice" style="margin-top:16px">${C.filmNote}</p>
  </div>
</section>
<section class="chapter" aria-labelledby="proto-t">
  <h2 id="proto-t">${C.protoTitle}</h2>
  <div class="proto" data-proto data-voice="/media/voice-brother.mp3">
    <div class="body-copy">${C.protoText.map(t => `<p>${t}</p>`).join('')}</div>
    <div class="phone" role="group" aria-label="UseFive prototype">
      <div class="phone-screen">
        <div class="phone-top" aria-hidden="true"><span>USEFIVE</span><span>● ● ●</span></div>
        <div class="agent-view">
          <img data-agent="brother" src="/media/agent-brother-640.webp" width="640" height="640" alt="" loading="lazy">
          <img data-agent="sister" src="/media/agent-sister-640.webp" width="640" height="640" alt="" loading="lazy" hidden>
          <canvas class="wave" aria-hidden="true"></canvas>
          <p class="state" role="status" aria-live="polite"></p>
        </div>
        <div class="phone-controls">
          <div class="seg" role="group" aria-label="${L.lang === 'en' ? 'Choose an agent' : 'Выберите агента'}">
            <button type="button" data-agent="brother" aria-pressed="true">${C.agents.brother}</button>
            <button type="button" data-agent="sister" aria-pressed="false">${C.agents.sister}</button>
          </div>
          <button class="speak" type="button" aria-pressed="false"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6v4h3l4 3V3L5 6zM11 5.5a3.5 3.5 0 010 5M12.8 3.5a6 6 0 010 9" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><span>${L.js.proto.listen}</span></button>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="chapter reveal"><h2>${C.resultTitle}</h2><div class="body-copy">${C.result.map(t => `<p>${t}</p>`).join('')}</div></section>`;
  caseShell(L, p, C, inner, media);
}

function livingFrame(L) {
  const C = L.livingFrame, p = L.projects.find(x => x.slug === 'living-frame');
  const media = `<div class="media" style="view-transition-name:case-media;display:grid;place-items:center;background:#07080A">${thumb(p, L, true).replace('<svg ', '<svg style="width:100%;height:100%" ')}</div>`;
  const inner = `
${chapters(C.chapters)}
<section class="chapter reveal"><h2>Lab</h2><div><p class="h2">${C.tryTitle}</p><p><a class="btn" href="${href(L, '/lab/')}">${C.tryLink} ${ARROW}</a></p></div></section>`;
  caseShell(L, p, C, inner, media);
}

/* ================= PRACTICE ================= */
function practice(L) {
  const P = L.practicePage;
  const proofLink = d => d.key === 'film' ? href(L, '/work/living-shapes/') : d.key === 'interactive' ? href(L, '/work/living-frame/') : d.key === 'products' ? href(L, '/work/usefive/') : null;
  const body = `
<header class="page-head"><div class="wrap"><p class="eyebrow">${P.eyebrow}</p><h1 class="display">${P.h1}</h1><p class="lede">${P.lede}</p></div></header>
<div class="wrap">
${L.practice.map((d, i) => `<section class="practice-item reveal" id="${d.key}" aria-labelledby="p-${d.key}">
  <div><p class="work-num">${String(i + 1).padStart(2, '0')}</p><h2 class="h2" id="p-${d.key}" style="font-family:var(--font-mono);font-size:clamp(22px,2.4vw,34px);letter-spacing:.1em;margin-top:12px">${d.name}</h2></div>
  <div><p class="lede" style="max-width:none">${d.line}</p><ul>${d.items.map(t => `<li>${t}</li>`).join('')}</ul>
  <p class="proof">${proofLink(d) ? `<a href="${proofLink(d)}">${d.proof}</a>` : d.proof}</p></div>
</section>`).join('\n')}
<section class="section" aria-labelledby="proc-t" style="border-top:0">
  <h2 class="h2" id="proc-t" style="margin-bottom:48px">${P.processTitle}</h2>
  <ol class="steps">${P.steps.map(([k, t, d]) => `<li><span class="k">${k}</span><h3 class="h3">${t}</h3><p>${d}</p></li>`).join('')}</ol>
  <p style="margin-top:56px"><a class="btn" href="${href(L, '/contact/')}">${P.cta} ${ARROW}</a></p>
</section>
</div>`;
  out(href(L, '/practice/'), page(L, { title: P.title, desc: P.desc, path: '/practice/' }, 'practice', body));
}

/* ================= LAB ================= */
function lab(L) {
  const B = L.lab;
  const head_ = (x, id) => `<header><div><p class="eyebrow">${x.k} / Lab</p><h2 class="h2" id="${id}">${x.name}</h2></div><p class="body-copy" style="margin:0">${x.text}</p></header>`;
  const body = `
<header class="page-head"><div class="wrap"><p class="eyebrow">${B.eyebrow}</p><h1 class="display">${B.h1}</h1><p class="lede">${B.lede}</p></div></header>
<div class="wrap">
<section class="lab-item" data-lab="shift" aria-labelledby="lab-a">
  ${head_(B.a, 'lab-a')}
  <div class="lab-canvas">
    <div class="frame" data-mode="0" data-src="/media/living-shapes-2048.webp" style="width:100%;cursor:default">
      <div class="frame-fallback" style="background-image:url(/media/living-shapes-1600.webp)"></div>
      <canvas aria-hidden="true"></canvas>
    </div>
    <div class="opt-in"><button class="btn" type="button" data-start>${B.start} ${ARROW}</button><p>${B.startNote}</p></div>
  </div>
  <div class="controls">
    <div class="control"><label for="lab-mode">${B.a.mode} <output for="lab-mode">0.00</output></label><input id="lab-mode" type="range" min="0" max="2" step="0.01" value="0.6"></div>
    <div class="control"><label for="lab-open">${B.a.open} <output for="lab-open">—</output></label><input id="lab-open" type="range" min="0" max="1" step="0.01" value="1"></div>
  </div>
</section>
<section class="lab-item" data-lab="motion" aria-labelledby="lab-b">
  ${head_(B.b, 'lab-b')}
  <div class="lab-canvas"><div class="springs" role="group" aria-label="${B.b.name}"></div></div>
  <div class="controls">
    <div class="control"><label for="lab-k">${B.b.k1} <output for="lab-k"></output></label><input id="lab-k" type="range" min="20" max="400" step="1" value="140"></div>
    <div class="control"><label for="lab-c">${B.b.c1} <output for="lab-c"></output></label><input id="lab-c" type="range" min="1" max="40" step="0.5" value="7"></div>
    <p class="mono" style="flex-basis:100%;margin:0;text-transform:none;letter-spacing:.02em">${B.b.kbd}</p>
  </div>
</section>
<section class="lab-item" data-lab="board" aria-labelledby="lab-c-t">
  ${head_(B.c, 'lab-c-t')}
  <div class="lab-canvas board">
    <div class="board-main">
      <ol class="shots" aria-label="${B.c.name}"></ol>
      <form class="add-shot" autocomplete="off"><label class="visually-hidden" for="new-shot">${B.c.addLabel}</label><input id="new-shot" type="text" maxlength="60" placeholder="${B.c.placeholder}"><button class="btn ghost" type="submit">${B.c.add}</button></form>
      <p class="mono" style="margin:0;text-transform:none;letter-spacing:.02em">${B.c.kbd}</p>
    </div>
    <aside class="board-side">
      <p class="mono" style="margin:0">${B.c.runtime}</p>
      <p class="runtime" aria-live="polite">0:00</p>
      <div class="timeline" aria-hidden="true"></div>
      <p class="mono" data-shot-count style="margin:0"></p>
      <button class="btn ghost" type="button" data-reset style="justify-self:start">${B.c.reset}</button>
      <p class="visually-hidden" aria-live="polite" data-live></p>
    </aside>
  </div>
</section>
</div>`;
  out(href(L, '/lab/'), page(L, { title: B.title, desc: B.desc, path: '/lab/' }, 'lab', body));
}

/* ================= ABOUT ================= */
function about(L) {
  const A = L.about;
  const body = `
<header class="page-head"><div class="wrap"><p class="eyebrow">${A.eyebrow}</p><h1 class="display">${A.h1}</h1></div></header>
<div class="wrap">
  <section class="chapter"><h2>VERGHÉTHORN</h2><div class="body-copy" style="font-size:clamp(18px,1.5vw,21px)">${A.text.map(t => `<p>${t}</p>`).join('')}</div></section>
  <section class="chapter"><h2>${A.principlesTitle}</h2><ol class="disciplines">${A.principles.map(([t, d], i) => `<li class="reveal"><span class="work-num">${String(i + 1).padStart(2, '0')}</span><span class="h3">${t}</span><p>${d}</p></li>`).join('')}</ol></section>
  <section class="section" style="border-top:0"><a class="btn" href="${href(L, '/contact/')}">${A.cta} ${ARROW}</a></section>
</div>`;
  out(href(L, '/about/'), page(L, { title: A.title, desc: A.desc, path: '/about/' }, 'about', body));
}

/* ================= CONTACT ================= */
function contact(L) {
  const C = L.contact;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}&su=${encodeURIComponent(L.lang === 'en' ? 'Project inquiry — VERGHÉTHORN' : 'Заявка на проект — VERGHÉTHORN')}`;
  const body = `
<header class="page-head"><div class="wrap"><p class="eyebrow">${C.eyebrow}</p><h1 class="display">${C.h1}</h1><p class="lede">${C.lede}</p></div></header>
<section class="section" style="border-top:0"><div class="wrap contact-grid">
  <form class="form" data-inquiry data-endpoint="${SITE.inquiries.endpoint}" data-key="${SITE.inquiries.key}" novalidate>
    <div class="field"><label for="f-name">${C.name}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="e-name"><p class="error" id="e-name" aria-live="polite"></p></div>
    <div class="field"><label for="f-email">${C.email}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" required aria-describedby="e-email"><p class="error" id="e-email" aria-live="polite"></p></div>
    <div class="field"><label for="f-cat">${C.category}</label><select id="f-cat" name="category" required aria-describedby="e-cat"><option value="">${C.choose}</option>${C.options.map(([v, t]) => `<option value="${v}">${t}</option>`).join('')}</select><p class="error" id="e-cat" aria-live="polite"></p></div>
    <div class="field"><label for="f-msg">${C.message}</label><span class="hint" id="h-msg">${C.messageHint}</span><textarea id="f-msg" name="message" maxlength="4000" required aria-describedby="h-msg e-msg"></textarea><p class="error" id="e-msg" aria-live="polite"></p></div>
    <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><button class="btn" type="submit">${C.send} ${ARROW}</button><small class="muted">${C.privacy}</small></div>
    <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
  </form>
  <aside class="contact-aside">
    <dl>
      <div><dt>${C.direct}</dt><dd><a href="mailto:${SITE.email}" style="font-size:20px">${SITE.email}</a><br><a href="${gmail}" target="_blank" rel="noopener" style="font-size:14px;color:var(--steel)">${C.gmail} ${EXT}</a></dd></div>
      <div><dt>${C.follow}</dt><dd style="display:grid;gap:10px">${SITE.social.map(s => `<a href="${s.href}" target="_blank" rel="me noopener">${s.name} · ${s.handle} ${EXT}</a>`).join('')}</dd></div>
    </dl>
  </aside>
</div></section>`;
  out(href(L, '/contact/'), page(L, { title: C.title, desc: C.desc, path: '/contact/' }, 'contact', body));
}

/* ================= 404, links, sitemap ================= */
function notFound() {
  const L = LANGS.en, N = L.notFound, R = LANGS.ru.notFound;
  const body = `<section class="not-found"><div><p class="eyebrow" style="justify-content:center">404</p><h1 class="display">${N.h1}</h1><p class="lede" style="margin:24px auto 36px">${N.text}<br><span lang="ru">${R.text}</span></p><p style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><a class="btn" href="/">${N.home}</a><a class="btn ghost" href="/ru/" lang="ru">${R.home}</a></p></div></section>`;
  writeFileSync(join(ROOT, '404.html'), page(L, { title: N.title, desc: N.text, path: '/404.html', noindex: true }, null, body));
}

function links(L) {
  const K = L.links;
  const body = `<section class="not-found" style="min-height:auto;padding-top:140px"><div style="width:100%;max-width:440px;display:grid;gap:12px">
  <p class="eyebrow" style="justify-content:center">${K.line}</p>
  <a class="btn" style="justify-content:space-between" href="${href(L, '/')}">${K.site} ${ARROW}</a>
  <a class="btn ghost" style="justify-content:space-between" href="${href(L, '/contact/')}">${K.contact} ${ARROW}</a>
  ${SITE.social.map(s => `<a class="btn ghost" style="justify-content:space-between" href="${s.href}" rel="me noopener">${s.name} <span class="mono">${s.handle}</span></a>`).join('')}
  <a class="btn ghost" style="justify-content:space-between" href="mailto:${SITE.email}">Email <span class="mono" style="text-transform:none">${SITE.email}</span></a>
</div></section>`;
  out(href(L, '/links/'), page(L, { title: K.title, desc: K.line, path: '/links/' }, null, body));
}

function sitemap() {
  const paths = ['/', '/work/', '/work/living-shapes/', '/work/usefive/', '/work/living-frame/', '/practice/', '/lab/', '/about/', '/contact/'];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.flatMap(p => ['', '/ru'].map(pr => `  <url><loc>${SITE.url}${pr}${p}</loc><lastmod>${BUILD_DATE}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE.url}${p}"/>
    <xhtml:link rel="alternate" hreflang="ru" href="${SITE.url}/ru${p}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${p}"/>
  </url>`)).join('\n')}
</urlset>
`;
  writeFileSync(join(ROOT, 'sitemap.xml'), xml);
  writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
}

for (const L of Object.values(LANGS)) { home(L); work(L); livingShapes(L); usefive(L); livingFrame(L); practice(L); lab(L); about(L); contact(L); links(L); }
notFound(); sitemap();
console.log(`built ${pages.length + 1} pages · css ${V.css} · js ${V.js}`);
