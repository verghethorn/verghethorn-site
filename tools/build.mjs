// Static site generator for verghethorn.com — run: node tools/build.mjs
// EN pages at /…, RU pages at /ru/…, with hreflang, sitemap and shared assets.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE, HEROES, LANGS, U5_SCREENS } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const ver = f => createHash('sha1').update(readFileSync(join(ROOT, f))).digest('hex').slice(0, 8);
const V = { css: ver('static/css/site.css'), js: ver('static/js/site.js') };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const pre = L => (L.lang === 'en' ? '' : '/ru');
const href = (L, p) => pre(L) + p;
const n2 = i => String(i + 1).padStart(2, '0');

const ARROW = '<svg class="arr" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
const EXT = '<svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';

// small line icons for the four forms (used outside the particle stage)
const ICON = {
  film: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="20" width="32" height="20" rx="2"/><path d="M8 20l30-7 1.5 6M14 18.6l4 5M21 17l4 5M28 15.4l4 5M8 26h32"/></svg>',
  web: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="10" width="38" height="28" rx="2"/><path d="M5 16h38M11 21h14v9H11zM29 22h9M29 26h7"/></svg>',
  app: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="15" y="5" width="18" height="38" rx="4"/><path d="M21 9h6M19 15h3v3h-3zM26 15h3v3h-3zM19 21h3v3h-3zM26 21h3v3h-3zM19 28h10v6H19z"/></svg>',
  voice: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24v0M11 20v8M16 15v18M21 10v28M26 14v20M31 18v12M36 21v6M41 23v2"/></svg>',
};

function head(L, { title, desc, path, image = '/media/og.jpg', jsonld = '', noindex = false, alt = true, refresh = '' }) {
  const enUrl = SITE.url + path, ruUrl = SITE.url + '/ru' + path;
  const self = L.lang === 'en' ? enUrl : ruUrl;
  return `<!doctype html>
<html lang="${L.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">\n' : ''}${!noindex ? `<link rel="canonical" href="${self}">\n` : ''}${alt && !noindex ? `<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ru" href="${ruUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">` : ''}
<meta name="theme-color" content="#0B0D10">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="VERGHÉTHORN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${self}">
<meta property="og:image" content="${SITE.url}${image}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="${L.locale}"><meta property="og:locale:alternate" content="${LANGS[L.other].locale}">
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
  return `<a class="skip-link" href="#main">${L.skip}</a>
<header class="site-header">
  <div class="wrap">
    <a class="wordmark" href="${href(L, '/')}" aria-label="VERGHÉTHORN — ${L.home}"><span class="slit" aria-hidden="true"></span>VERGHÉTHORN</a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav">${L.menu}</button>
    <nav class="nav" id="site-nav" aria-label="${L.lang === 'en' ? 'Main' : 'Основное'}">
      ${item('services', '/services/')}${item('approach', '/approach/')}${item('contact', '/contact/')}
      <span class="lang" role="group" aria-label="${L.lang === 'en' ? 'Language' : 'Язык'}">
        <a href="${path}" hreflang="en" lang="en" data-lang-link="en"${L.lang === 'en' ? ' aria-current="true"' : ''}>EN</a>
        <a href="/ru${path}" hreflang="ru" lang="ru" data-lang-link="ru"${L.lang === 'ru' ? ' aria-current="true"' : ''}>RU</a>
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
      <small>${L.footer.line}<br>${L.footer.small}</small>
      <small>© ${new Date().getFullYear()} VERGHÉTHORN · <a href="mailto:${SITE.email}">${SITE.email}</a></small>
    </div>
    <nav aria-label="${L.lang === 'en' ? 'Footer' : 'Подвал'}">
      <a href="${href(L, '/services/')}">${n.services}</a><a href="${href(L, '/approach/')}">${n.approach}</a><a href="${href(L, '/contact/')}">${n.contact}</a>
      ${SITE.social.map(s => `<a href="${s.href}" rel="me noopener" target="_blank">${s.name} ${EXT}</a>`).join('')}
      <a class="quiet" href="${href(L, '/archive/')}">${n.archive}</a>
    </nav>
  </div>
</footer>`;
}

function page(L, meta, active, body) {
  return `${head(L, meta)}
<body${meta.bodyClass ? ` class="${meta.bodyClass}"` : ''}>
${header(L, active, meta.path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(L)}
<script type="application/json" id="i18n">${JSON.stringify(L.js).replace(/</g, '\\u003c')}</script>
<script type="module" src="/static/js/site.js?v=${V.js}"></script>
</body>
</html>
`;
}

const written = [];
function out(path, html) {
  const file = join(ROOT, path.endsWith('/') ? path + 'index.html' : path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  written.push(path);
}

const statusTags = (L, p) => p.status.map(s => `<span class="status"${s === 'live' ? ' data-live' : ''}>${L.statuses[s]}</span>`).join('');
const pageHead = (eyebrow, h1, lede) => `<header class="page-head"><div class="wrap"><p class="eyebrow">${eyebrow}</p><h1 class="display">${h1}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}</div></header>`;
const stepsList = L => `<ol class="steps">${L.steps.map(([k, t, d]) => `<li><span class="k">${k}</span><h3 class="h3">${t}</h3><p>${d}</p></li>`).join('')}</ol>`;
const chapters = list => list.map(([k, h, ps]) => `<section class="chapter reveal"><h2>${k}</h2><div><p class="h2">${h}</p><div class="body-copy">${ps.map(t => `<p>${t}</p>`).join('')}</div></div></section>`).join('\n');

/* ================= HOME ================= */
function home(L) {
  const H = L.home;
  const jsonld = `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': SITE.url + '/#org', name: 'VERGHÉTHORN', alternateName: 'VERGHETHORN', url: SITE.url + '/', email: SITE.email, logo: SITE.url + '/static/apple-touch-icon.png', founder: { '@type': 'Person', name: 'Rashid Kurabegov' }, sameAs: SITE.social.map(s => s.href), knowsAbout: ['Film production', 'Web design', 'Mobile apps', 'Artificial intelligence'] },
      { '@type': 'WebSite', '@id': SITE.url + '/#site', url: SITE.url + '/', name: 'VERGHÉTHORN', inLanguage: ['en', 'ru'], publisher: { '@id': SITE.url + '/#org' } },
    ],
  })}</script>`;
  const body = `
<div class="stage" data-stage>
  <div class="stage-canvas" aria-hidden="false">
    <canvas id="lumen" role="img" aria-label="${esc(H.canvasLabel)}"></canvas>
    <div class="stage-fallback" aria-hidden="true"><span>VERGHÉTHORN</span></div>
  </div>

  <section class="hero2" data-scene="intro" aria-labelledby="hero-title">
    <div class="wrap">
      <ol class="forms" aria-hidden="true">${L.js.forms.map((f, i) => `<li${i === 0 ? ' class="is-on"' : ''}>${f}</li>`).join('')}</ol>
      <form class="try" data-try autocomplete="off">
        <label for="try-word">${H.tryLabel}</label>
        <div class="try-row"><input id="try-word" name="word" type="text" maxlength="18" placeholder="${esc(H.tryPh)}" enterkeyhint="go"><button type="submit" class="try-btn" data-cursor="${esc(H.tryBtn)}">${H.tryBtn} ${ARROW}</button></div>
      </form>
      <div class="hero2-copy">
        <div>
          <p class="eyebrow">${H.eyebrow}</p>
          <h1 class="display" id="hero-title">${H.h1}</h1>
        </div>
        <div class="side">
          <p class="lede">${H.lede}</p>
          <div class="actions">
            <a class="btn" href="${href(L, '/contact/')}">${H.cta} ${ARROW}</a>
            <a class="btn ghost" href="#forms">${H.cta2}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="story-head wrap" id="forms">
    <p class="eyebrow">${H.storyEyebrow}</p>
    <h2 class="h2">${H.storyTitle}</h2>
  </div>
  ${H.story.map(s => `
  <section class="scene" data-scene="${s.shape}" aria-labelledby="sc-${s.shape}">
    <div class="wrap">
      <div class="panel">
        <p class="scene-k"><span>${s.k}</span><span class="scene-icon">${ICON[s.shape]}</span></p>
        <h3 class="h2" id="sc-${s.shape}">${s.title}</h3>
        <p class="lede">${s.text}</p>
        <ul class="points">${s.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
    </div>
  </section>`).join('')}
</div>

<section class="section how" aria-labelledby="how-t">
  <div class="wrap">
    <div class="section-head reveal"><div><p class="eyebrow">${H.howEyebrow}</p><h2 class="h2" id="how-t">${H.howTitle}</h2></div>
    <a class="link-arrow" href="${href(L, '/approach/')}">${L.nav.approach} ${ARROW}</a></div>
    <div class="steps-wrap"><span class="steps-line" aria-hidden="true"></span>${stepsList(L)}</div>
  </div>
</section>

<section class="section" aria-labelledby="why-t">
  <div class="wrap">
    <div class="reveal" style="max-width:980px"><p class="eyebrow">${H.why.eyebrow}</p><h2 class="h2" id="why-t">${H.why.title}</h2></div>
    <ol class="disciplines" style="margin-top:clamp(40px,6vw,80px)">
      ${H.why.items.map(([t, d], i) => `<li class="reveal"><span class="work-num">${n2(i)}</span><span class="h3">${t}</span><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section final" aria-labelledby="final-t">
  <div class="wrap contact-band">
    <h2 class="display reveal" id="final-t" style="font-size:clamp(40px,6.4vw,104px)">${H.final.title}</h2>
    <a class="big-mail reveal" href="mailto:${SITE.email}">${SITE.email}</a>
    <p><a class="btn" href="${href(L, '/contact/')}">${H.final.btn} ${ARROW}</a></p>
  </div>
</section>`;
  out(href(L, '/'), page(L, { title: H.title, desc: H.desc, path: '/', jsonld, bodyClass: 'is-home' }, null, body));
}

/* ================= SERVICES ================= */
function services(L) {
  const S = L.services;
  const body = `
${pageHead(S.eyebrow, S.h1, S.lede)}
<div class="wrap">
${S.items.map((d, i) => `<section class="practice-item reveal" id="${d.shape}" aria-labelledby="sv-${d.shape}">
  <div><p class="scene-k"><span>${n2(i)}</span><span class="scene-icon">${ICON[d.shape]}</span></p><h2 class="h2" id="sv-${d.shape}" style="margin-top:14px">${d.name}</h2><p class="lede" style="margin-top:18px">${d.line}</p></div>
  <div class="sv-cols">
    <div><p class="mono">${S.forWhom}</p><p class="body-copy" style="margin:10px 0 0">${d.who}</p></div>
    <div><p class="mono">${S.youGet}</p><ul>${d.get.map(t => `<li>${t}</li>`).join('')}</ul></div>
  </div>
</section>`).join('\n')}
<section class="section unsure" style="border-top:0">
  <h2 class="h2">${S.unsure}</h2>
  <p class="lede" style="margin:20px 0 32px">${S.unsureText}</p>
  <a class="btn" href="${href(L, '/contact/')}">${S.unsureBtn} ${ARROW}</a>
</section>
</div>`;
  out(href(L, '/services/'), page(L, { title: S.title, desc: S.desc, path: '/services/' }, 'services', body));
}

/* ================= APPROACH ================= */
function approach(L) {
  const A = L.approach;
  const body = `
${pageHead(A.eyebrow, A.h1, A.lede)}
<div class="wrap">
  <section class="section" style="border-top:0" aria-labelledby="ap-steps"><h2 class="h2" id="ap-steps" style="margin-bottom:48px">${A.stepsTitle}</h2><div class="steps-wrap"><span class="steps-line" aria-hidden="true"></span>${stepsList(L)}</div></section>
  <section class="chapter" aria-labelledby="ap-tech"><h2 id="ap-tech">${A.techTitle}</h2><ol class="disciplines">${A.tech.map(([t, d], i) => `<li class="reveal"><span class="work-num">${n2(i)}</span><span class="h3">${t}</span><p>${d}</p></li>`).join('')}</ol></section>
  <section class="chapter" aria-labelledby="ap-faq"><h2 id="ap-faq">${A.faqTitle}</h2><div class="faq">${A.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></section>
  <section class="section" style="border-top:0"><a class="btn" href="${href(L, '/contact/')}">${A.cta} ${ARROW}</a></section>
</div>`;
  out(href(L, '/approach/'), page(L, { title: A.title, desc: A.desc, path: '/approach/' }, 'approach', body));
}

/* ================= CONTACT ================= */
function contact(L) {
  const C = L.contact;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${SITE.email}&su=${encodeURIComponent(L.lang === 'en' ? 'Project inquiry — VERGHÉTHORN' : 'Проект — VERGHÉTHORN')}`;
  const body = `
${pageHead(C.eyebrow, C.h1, C.lede)}
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

/* ================= ARCHIVE ================= */
function archiveIndex(L) {
  const A = L.archive;
  const body = `
${pageHead(A.eyebrow, A.h1, A.lede)}
<section class="section" style="padding-top:0;border-top:0"><div class="wrap">
  <ol class="work-list" style="border-top:0">
  ${L.projects.map((p, i) => `<li class="work-row"><a href="${href(L, '/archive/' + p.slug + '/')}" data-cursor="${A.open}">
    <span class="work-num">${n2(i)}</span><span class="work-title">${esc(p.title)}</span><span class="work-desc">${esc(p.short)}</span>
    <span class="work-meta"><span class="tag-row">${statusTags(L, p)}</span><span class="mono">${p.kind} · ${p.year}</span></span>
  </a></li>`).join('\n')}
  </ol>
  <section style="margin-top:clamp(64px,9vw,120px)" aria-labelledby="concepts-t">
    <div class="section-head" style="margin-bottom:28px"><div><p class="eyebrow">${L.statuses.concept}</p><h2 class="h2" id="concepts-t">${A.conceptsTitle}</h2></div><p class="notice" style="margin:0">${A.conceptNote}</p></div>
    <ul class="concepts">${L.concepts.map(([t, d]) => `<li><span class="tag-row"><span class="status">${L.statuses.concept}</span><span class="status">${L.statuses.dev}</span></span><h3 class="h3">${t}</h3><p>${d}</p></li>`).join('')}</ul>
  </section>
</div></section>`;
  out(href(L, '/archive/'), page(L, { title: A.title, desc: A.desc, path: '/archive/', noindex: true }, null, body));
}

function caseShell(L, slug, C, inner, media) {
  const A = L.archive, p = L.projects.find(x => x.slug === slug);
  const idx = L.projects.indexOf(p), next = L.projects[(idx + 1) % L.projects.length];
  const body = `
<article>
<header class="case-hero"><div class="wrap">
  <p class="eyebrow"><a href="${href(L, '/archive/')}" style="text-decoration:none">${A.back}</a> / ${p.kind}</p>
  <h1 class="display">${C.h1}</h1>
  <p class="lede" style="margin-top:28px">${C.lede}</p>
  ${media || ''}
  <dl class="facts"${media ? '' : ' style="margin-top:48px"'}>
    <div><dt>${A.status}</dt><dd><span class="tag-row">${statusTags(L, p)}</span></dd></div>
    <div><dt>${A.year}</dt><dd>${p.year}</dd></div>
    <div><dt>${A.role}</dt><dd>${esc(p.role)}</dd></div>
    <div><dt>${A.format}</dt><dd>${esc(p.format)}</dd></div>
  </dl>
</div></header>
<div class="wrap">${inner}</div>
</article>
<a class="next-case" href="${href(L, '/archive/' + next.slug + '/')}" data-cursor="${A.open}"><div class="wrap">
  <p class="eyebrow">${A.back}</p><p class="display" style="font-size:clamp(44px,8vw,128px)">${esc(next.title)}</p>
</div></a>`;
  out(href(L, '/archive/' + slug + '/'), page(L, { title: C.title, desc: C.desc, path: '/archive/' + slug + '/', noindex: true }, null, body));
}

function qist(L) {
  const C = L.qist;
  const inner = `
${chapters(C.chapters)}
<section class="chapter" aria-labelledby="q-try"><h2 id="q-try">${C.tryTitle}</h2>
  <div class="proto">
    <div class="body-copy"><p>${C.tryText}</p><p><a class="link-arrow" href="/archive/qist/app/" target="_blank" rel="noopener">${C.full} ${EXT}</a></p><p class="notice">${C.note}</p></div>
    <div class="phone phone-live"><div class="phone-screen" style="display:block;background:#fff"><iframe src="/archive/qist/app/" title="Qist — prototype" loading="lazy"></iframe></div></div>
  </div>
</section>`;
  caseShell(L, 'qist', C, inner);
}

function use5now(L) {
  const C = L.u5;
  const media = `<div class="u5-hero"><div class="u5-glow" aria-hidden="true"></div><img src="/media/u5/welcome.webp" width="508" height="1100" alt="USE 5 NOW — ${L.lang === 'en' ? 'welcome screen' : 'первый экран'}" fetchpriority="high"><p class="mono">${C.countries}</p></div>`;
  const inner = `
${chapters(C.chapters)}
<section class="chapter" aria-labelledby="u5-how"><h2 id="u5-how">${C.howTitle}</h2><ol class="steps" style="grid-template-columns:repeat(2,minmax(0,1fr))">${C.how.map(([t, d], i) => `<li><span class="k">${n2(i)}</span><h3 class="h3">${t}</h3><p>${d}</p></li>`).join('')}</ol></section>
<section class="chapter" aria-labelledby="u5-sc" style="grid-template-columns:minmax(0,1fr)"><div style="display:flex;justify-content:space-between;align-items:end;gap:16px;flex-wrap:wrap"><div><h2 id="u5-sc">${C.screensTitle}</h2><p class="muted" style="margin:8px 0 0;font-size:14px">${C.screensHint}</p></div>
  <div class="car-ctrl"><button type="button" data-car="-1" aria-label="${L.lang === 'en' ? 'Previous' : 'Назад'}">←</button><button type="button" data-car="1" aria-label="${L.lang === 'en' ? 'Next' : 'Вперёд'}">→</button></div></div>
  <ul class="carousel" data-carousel tabindex="0" aria-label="${C.screensTitle}">${U5_SCREENS.map(s => `<li><img src="/media/u5/${s}.webp" width="492" height="1068" alt="" loading="lazy" decoding="async"></li>`).join('')}</ul>
</section>`;
  caseShell(L, 'use-5-now', C, inner, media);
}

function livingShapes(L) {
  const C = L.ls;
  const media = `<div class="media"><img src="/media/living-shapes-1600.webp" srcset="/media/living-shapes-960.webp 960w, /media/living-shapes-1600.webp 1600w, /media/living-shapes-2048.webp 2048w" sizes="(max-width: 1440px) 100vw, 1440px" width="1600" height="900" alt="${esc(C.imgAlt)}" fetchpriority="high"></div>`;
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
<section class="chapter reveal"><h2>YouTube</h2><div><p><img src="/media/ring-720.webp" width="120" height="120" alt="" loading="lazy" style="width:120px;height:120px;mix-blend-mode:screen"></p><a class="link-arrow" href="https://www.youtube.com/@verghethorn" rel="noopener" target="_blank">@verghethorn ${EXT}</a></div></section>`;
  caseShell(L, 'living-shapes', C, inner, media);
}

function lab(L) {
  const B = L.lab;
  const head_ = (x, id) => `<header><div><p class="eyebrow">${x.k}</p><h2 class="h2" id="${id}">${x.name}</h2></div><p class="body-copy" style="margin:0">${x.text}</p></header>`;
  const inner = `
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
</section>`;
  caseShell(L, 'lab', B, inner);
}

/* ================= 404, links, redirects, sitemap ================= */
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
  out(href(L, '/links/'), page(L, { title: K.title, desc: K.line, path: '/links/', noindex: true }, null, body));
}

function redirect(L, from, to) {
  const dest = href(L, to);
  const html = `${head(L, { title: 'VERGHÉTHORN', desc: L.moved, path: from, noindex: true, refresh: `<meta http-equiv="refresh" content="0; url=${dest}">\n` })}
<body><p style="padding:40px;font-family:system-ui;color:#F1EEE8"><a href="${dest}">${L.moved}</a></p><script>location.replace(${JSON.stringify(dest)} + location.hash)</script></body></html>`;
  const file = join(ROOT, href(L, from), 'index.html');
  mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html);
}

function sitemap() {
  const paths = ['/', '/services/', '/approach/', '/contact/'];
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

// clear generated folders from earlier site versions
for (const d of ['work', 'practice', 'lab', 'about', 'ru/work', 'ru/practice', 'ru/lab', 'ru/about']) { const p = join(ROOT, d); if (existsSync(p)) rmSync(p, { recursive: true }); }

for (const L of Object.values(LANGS)) {
  home(L); services(L); approach(L); contact(L); archiveIndex(L); qist(L); use5now(L); livingShapes(L); lab(L); links(L);
  [['/work/', '/archive/'], ['/work/living-shapes/', '/archive/living-shapes/'], ['/work/usefive/', '/archive/use-5-now/'], ['/work/living-frame/', '/archive/lab/'], ['/practice/', '/services/'], ['/lab/', '/archive/lab/'], ['/about/', '/approach/']].forEach(([a, b]) => redirect(L, a, b));
}
notFound(); sitemap();
console.log(`built ${written.length + 1} pages · css ${V.css} · js ${V.js}`);
