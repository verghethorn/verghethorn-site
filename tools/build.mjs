// Static site generator for verghethorn.com — run: node tools/build.mjs
// One cinematic page per language: EN at /, RU at /ru/.
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { SITE, LANGS, LOOK_IDS, AUDIENCE_IDS } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const hashDir = d => { const h = createHash('sha1'); const walk = p => { for (const f of readdirSync(p).sort()) { const q = join(p, f); statSync(q).isDirectory() ? walk(q) : h.update(readFileSync(q)); } }; walk(join(ROOT, d)); return h.digest('hex').slice(0, 8); };
const V = hashDir('static');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const pre = L => (L.lang === 'en' ? '' : '/ru');

const ARROW = '<svg class="arr" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M1 6h9M6.5 2.5 10 6l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const svg = (d, vb = 24) => `<svg viewBox="0 0 ${vb} ${vb}" aria-hidden="true">${d}</svg>`;

const LOOK_ICON = {
  day: svg('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>'),
  golden: svg('<path d="M3 16h18M6 19.5h12"/><path d="M7 16a5 5 0 0 1 10 0"/><path d="M12 6.5v2M5.2 9.5l1.4 1.2M18.8 9.5l-1.4 1.2"/>'),
  anamorphic: svg('<ellipse cx="12" cy="12" rx="9" ry="4.6"/><ellipse cx="12" cy="12" rx="3.4" ry="2.2"/><path d="M1 12h3M20 12h3"/>'),
  night: svg('<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.3 1 2.2h5.2c0-.9.4-1.7 1-2.2A6 6 0 0 0 12 3z"/>'),
  film: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="6.6" r="1.9"/><circle cx="12" cy="17.4" r="1.9"/><circle cx="6.6" cy="12" r="1.9"/><circle cx="17.4" cy="12" r="1.9"/>'),
};
const CAMERA_ICON = svg('<rect x="2.5" y="8" width="13" height="10" rx="2"/><path d="M15.5 11.5 21 9v8l-5.5-2.5"/><circle cx="6" cy="5.5" r="2.3"/><circle cx="11.5" cy="5.5" r="2.3"/>');
const SERVICE_ICON = {
  film: svg('<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 9l16.5-4 .8 3.2M7.5 7.9l2.2 2.7M12 6.8l2.2 2.7M16.5 5.7l2.2 2.7"/>'),
  ad: svg('<path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11"/>'),
  web: svg('<rect x="2.5" y="4" width="19" height="15" rx="2"/><path d="M2.5 8h19M5.5 6h.01M8 6h.01"/><path d="M6 11.5h6v4H6zM14 12h4M14 14.5h3"/>'),
  app: svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 5h3M10 9h1.5v1.5H10zM12.5 9H14v1.5h-1.5zM10 12h1.5v1.5H10zM12.5 12H14v1.5h-1.5z"/>'),
  ai: svg('<path d="M3 12h1.5M6.5 8v8M10 5v14M13.5 9v6M17 7v10M20.5 11v2"/>'),
  anim: svg('<circle cx="8" cy="15" r="4"/><path d="M12 15c2-6 4-9 9-10"/><circle cx="18.5" cy="6.5" r="2"/>'),
  pod: svg('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>'),
};
const DOOR_GLYPH = {
  email: svg('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
  youtube: svg('<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/>'),
  instagram: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".9" fill="currentColor"/>'),
  tiktok: svg('<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.6 2.4 4.3 5 4.5"/>'),
};
const SOUND_ICON = '<svg class="ico-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg><svg class="ico-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5z"/><path d="m16 9.5 5 5M21 9.5l-5 5"/></svg>';

function head(L, { title, desc, path, noindex = false, refresh = '' }) {
  const enUrl = SITE.url + path, ruUrl = SITE.url + '/ru' + path;
  const self = L.lang === 'en' ? enUrl : ruUrl;
  return `<!doctype html>
<html lang="${L.lang}" data-look="day">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${refresh}${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="ru" href="${ruUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">`}
<meta name="theme-color" content="#F5F5F7">
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
<script>try{var l=localStorage.getItem('vt-look');if(l&&/^(day|golden|anamorphic|night|film)$/.test(l))document.documentElement.dataset.look=l}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@300..800&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="/static/css/site.css?v=${V}">
<script type="importmap">{"imports":{"three":"/static/vendor/three/three.module.min.js"}}</script>
<link rel="modulepreload" href="/static/vendor/three/three.module.min.js">
</head>`;
}

function page(L) {
  const H = L.hero, C = L.contact;
  const lp = pre(L);
  const jsonld = { '@context': 'https://schema.org', '@type': 'Organization', name: 'VERGHÉTHORN', alternateName: 'VERGHETHORN', url: SITE.url + '/', email: SITE.email, logo: SITE.url + '/static/apple-touch-icon.png', founder: { '@type': 'Person', name: 'Rashid Kurabegov' }, sameAs: SITE.social.map(s => s.href), description: L.desc };
  const doors = [{ id: 'email', name: C.email, handle: SITE.email, href: `mailto:${SITE.email}`, color: '#E8A33D', note: C.emailNote }, ...SITE.social.map(s => ({ ...s, note: s.handle }))];

  return `${head(L, { title: L.title, desc: L.desc, path: '/' })}
<body>
<a class="skip-link" href="#main">${L.skip}</a>
<header class="gnav">
  <div class="gnav-in">
    <a class="wordmark" href="${lp}/" aria-label="VERGHÉTHORN — ${L.home}"><span class="slit" aria-hidden="true"></span>VERGHÉTHORN</a>
    <nav class="gnav-links" id="gnav-links" aria-label="${L.lang === 'en' ? 'Sections' : 'Разделы'}">
      ${L.nav.map(([id, t]) => `<a href="#${id}" data-nav="${id}">${t}</a>`).join('')}
    </nav>
    <div class="gnav-tools">
      <button class="icon-btn" type="button" data-sound aria-pressed="true" aria-label="${L.sound.on}" data-on="${L.sound.on}" data-off="${L.sound.off}">${SOUND_ICON}</button>
      <span class="lang" role="group" aria-label="Language">
        <a href="/" hreflang="en" lang="en" data-lang-link="en"${L.lang === 'en' ? ' aria-current="true"' : ''}>EN</a>
        <a href="/ru/" hreflang="ru" lang="ru" data-lang-link="ru"${L.lang === 'ru' ? ' aria-current="true"' : ''}>RU</a>
      </span>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="gnav-links">${L.menu}</button>
    </div>
  </div>
</header>

<div class="dock" data-dock>
  <button class="dock-btn" type="button" aria-expanded="false" aria-controls="dock-menu" title="${esc(L.dock.hint)}">
    <span class="dock-cam">${CAMERA_ICON}</span><span class="dock-txt"><small>${L.dock.label}</small><b data-look-name>${L.looks.day[0]}</b></span><span class="dock-rec" aria-hidden="true"></span>
  </button>
  <div class="dock-menu" id="dock-menu" role="radiogroup" aria-label="${esc(L.dock.hint)}" hidden>
    ${LOOK_IDS.map((id, i) => `<button type="button" role="radio" aria-checked="${i === 0}" data-look="${id}" data-name="${esc(L.looks[id][0])}"><span class="lk-ico">${LOOK_ICON[id]}</span><span><b>${L.looks[id][0]}</b><small>${L.looks[id][1]}</small></span></button>`).join('')}
  </div>
</div>
<div class="fx-bars" aria-hidden="true"><i></i><i></i></div>
<div class="fx-grain" aria-hidden="true"></div>
<div class="fx-vignette" aria-hidden="true"></div>

<main id="main" tabindex="-1">

<section class="hero" id="film" aria-labelledby="hero-title">
  <div class="scene scene-set" data-scene="set" role="img" aria-label="${esc(H.canvas)}">
    <div class="set-hud" aria-hidden="false">
      <span class="hud-tag hud-key" data-label="key"><b>${H.key}</b> · <span data-angle>45°</span></span>
      ${['A', 'B', 'C'].map(id => `<button class="hud-tag hud-cam" type="button" data-cam="${id}" aria-pressed="false"><i class="tally" aria-hidden="true"></i><b>${H.cams[id][0]}</b> ${H.cams[id][1]}</button>`).join('')}
    </div>
    <div class="viewfinder" hidden>
      <div class="vf-frame" aria-hidden="true"><i></i><i></i><i></i><i></i><span class="vf-cross"></span></div>
      <p class="vf-top"><span class="vf-rec">● REC</span><span data-vf-info></span><span data-vf-tc>00:00:00:00</span></p>
      <button class="vf-exit" type="button" data-vf-exit>${H.exit} <kbd>Esc</kbd></button>
    </div>
  </div>
  <div class="hero-copy">
    <p class="eyebrow">${H.eyebrow}</p>
    <h1 id="hero-title" class="h-hero">${H.h1}</h1>
    <p class="hero-sub">${H.sub}</p>
    <p class="hero-cta"><a class="btn" href="#contact">${H.cta}</a><a class="link" href="#web">${H.cta2} ${ARROW}</a></p>
  </div>
  <ul class="hints" aria-label="${L.lang === 'en' ? 'Try' : 'Попробуйте'}">${H.hints.map((h, i) => `<li><span class="hint-dot${i ? ' cam' : ''}" aria-hidden="true"></span>${h}</li>`).join('')}</ul>
</section>

<section class="statement" aria-label="${L.lang === 'en' ? 'Our belief' : 'Во что мы верим'}">
  <p class="statement-text">${L.statement.split(/(<em>.*?<\/em>)/).map(part => part.startsWith('<em>') ? `<em>${part.slice(4, -5).split(' ').map(w => `<span class="w">${w}</span>`).join(' ')}</em>` : part.split(' ').filter(Boolean).map(w => `<span class="w">${w}</span>`).join(' ')).join(' ')}</p>
</section>

<section class="pin" id="web" data-pin="web" aria-labelledby="web-t">
  <div class="pin-stage">
    <div class="scene scene-web" data-scene="web" role="img" aria-label="${esc(L.web.canvas)}"></div>
    <div class="pin-copy">
      <p class="eyebrow">${L.web.eyebrow}</p>
      <h2 class="h-sec" id="web-t">${L.web.h2}</h2>
      <p class="sec-sub">${L.web.sub}</p>
    </div>
    <ol class="stages" aria-hidden="true">${L.web.stages.map((s, i) => `<li data-stage="${i}">${s}</li>`).join('')}</ol>
  </div>
</section>

<section class="ads" id="ads" aria-labelledby="ads-t">
  <div class="sec-head">
    <p class="eyebrow">${L.ads.eyebrow}</p>
    <h2 class="h-sec" id="ads-t">${L.ads.h2}</h2>
    <p class="sec-sub">${L.ads.sub}</p>
  </div>
  <div class="ad-player" data-ad-player data-aud="genz">
    <div class="scene scene-ad" data-scene="ad" role="img" aria-label="${esc(L.ads.canvas)}"></div>
    <div class="ad-ui" aria-hidden="true">
      <p class="ad-top"><span class="ad-badge">${L.ads.ad}</span><span>NOVA</span><span class="ad-time" data-ad-time>0:03</span></p>
      <p class="ad-catch">${L.ads.catch}</p>
    </div>
    <p class="ad-tag" aria-live="polite" data-ad-tag>${L.ads.tags.genz}</p>
    <div class="ad-flash" aria-hidden="true"></div>
  </div>
  <div class="aud" role="tablist" aria-label="${L.ads.eyebrow}">
    <button class="aud-arrow" type="button" data-aud-step="-1" aria-label="${L.ads.prev}">‹</button>
    <div class="aud-track">${AUDIENCE_IDS.map((id, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-aud="${id}" data-tag="${esc(L.ads.tags[id])}">${L.ads.audiences[id]}</button>`).join('')}</div>
    <button class="aud-arrow" type="button" data-aud-step="1" aria-label="${L.ads.next}">›</button>
  </div>
</section>

<section class="pin pin-how" id="how" data-pin="how" aria-labelledby="how-t">
  <div class="pin-stage">
    <div class="scene scene-how" data-scene="how" role="img" aria-label="${esc(L.how.canvas)}">
    </div>
    <div class="pin-copy">
      <p class="eyebrow">${L.how.eyebrow}</p>
      <h2 class="h-sec" id="how-t">${L.how.h2}</h2>
      <p class="sec-sub">${L.how.sub}</p>
    </div>
    <ol class="how-steps">${L.how.steps.map(([t, d], i) => `<li data-step="${i}"><button type="button" data-step-go="${i}"><b>${t}</b><span>${d}</span></button></li>`).join('')}</ol>
    <p class="drag-hint" aria-hidden="true">${L.how.hint}</p>
  </div>
</section>

<section class="services" aria-labelledby="svc-t">
  <div class="sec-head">
    <p class="eyebrow">${L.services.eyebrow}</p>
    <h2 class="h-sec" id="svc-t">${L.services.h2}</h2>
  </div>
  <ul class="tiles">${L.services.items.map(([id, t, d]) => `<li class="tile tile-${id} reveal"><span class="tile-ico">${SERVICE_ICON[id]}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ul>
</section>

<section class="contact" id="contact" aria-labelledby="ct-t">
  <div class="sec-head">
    <p class="eyebrow">${C.eyebrow}</p>
    <h2 class="h-sec" id="ct-t">${C.h2}</h2>
    <p class="sec-sub">${C.sub}</p>
  </div>
  <ul class="doors">${doors.map(d => `<li><a class="door" href="${d.href}"${d.id === 'email' ? ' data-email' : ' target="_blank" rel="me noopener"'} style="--c:${d.color}" data-door="${d.id}" aria-label="${esc(d.name)} — ${esc(d.note)}">
    <span class="door-room" aria-hidden="true"><span class="door-glyph">${DOOR_GLYPH[d.id]}</span><span class="door-handle">${esc(d.handle)}</span></span>
    <span class="door-leaf" aria-hidden="true"><span class="door-panel"></span><span class="door-panel"></span><span class="door-knob"></span><span class="door-sign">${esc(d.name)}</span></span>
  </a><p class="door-cap"><b>${esc(d.name)}</b><span>${esc(d.note)}</span></p></li>`).join('')}</ul>
  <p class="toast" role="status" aria-live="polite" data-toast hidden>${C.copied}</p>

  <form class="form" data-inquiry data-endpoint="${SITE.inquiries.endpoint}" data-key="${SITE.inquiries.key}" novalidate>
    <h3 class="form-title">${C.formTitle}</h3>
    <fieldset class="kinds"><legend>${C.what}</legend>${C.kinds.map(([v, t], i) => `<label><input type="radio" name="category" value="${v}"${i === 0 ? ' checked' : ''}><span>${t}</span></label>`).join('')}</fieldset>
    <div class="row2">
      <div class="field"><label for="f-name">${C.name}</label><input id="f-name" name="name" type="text" autocomplete="name" maxlength="120" required aria-describedby="e-name"><p class="error" id="e-name"></p></div>
      <div class="field"><label for="f-email">${C.mail}</label><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="200" required aria-describedby="e-email"><p class="error" id="e-email"></p></div>
    </div>
    <div class="field"><label for="f-msg">${C.message}</label><textarea id="f-msg" name="message" maxlength="4000" required placeholder="${esc(C.messageHint)}" aria-describedby="e-msg"></textarea><p class="error" id="e-msg"></p></div>
    <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
    <p class="form-send"><button class="btn" type="submit">${C.send}</button><small>${C.privacy}</small></p>
    <div class="form-status" data-form-status role="status" tabindex="-1" hidden></div>
  </form>
</section>
</main>

<footer class="foot">
  <p><span class="wordmark small"><span class="slit" aria-hidden="true"></span>VERGHÉTHORN</span> ${L.footer}</p>
  <p class="foot-links"><a href="mailto:${SITE.email}">${SITE.email}</a>${SITE.social.map(s => `<a href="${s.href}" target="_blank" rel="me noopener">${s.name}</a>`).join('')}<span>© ${new Date().getFullYear()}</span></p>
</footer>

<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<script type="application/json" id="i18n">${JSON.stringify({ ...L.js, how: { dialLine: L.how.dialLine, steps: L.how.steps.map(s => s[0]) }, ad: L.ad, webSite: L.webSite, looks: Object.fromEntries(LOOK_IDS.map(id => [id, L.looks[id][0]])), sound: L.sound, copied: C.copied }).replace(/</g, '\\u003c')}</script>
<script type="module" src="/static/js/site.js?v=${V}"></script>
</body>
</html>
`;
}

function notFound() {
  const L = LANGS.en, N = L.notFound, R = LANGS.ru.notFound;
  return `${head(L, { title: N.title, desc: N.text, path: '/404.html', noindex: true })}
<body class="nf"><main class="nf-main"><p class="eyebrow">404</p><h1 class="h-sec">${N.h1}<br><span lang="ru">${R.h1}</span></h1><p class="sec-sub">${N.text} <span lang="ru">${R.text}</span></p><p class="hero-cta"><a class="btn" href="/">${N.home}</a><a class="link" href="/ru/" lang="ru">${R.home} ${ARROW}</a></p></main></body></html>`;
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
  const old = [['/services/', '/#web'], ['/approach/', '/#how'], ['/contact/', '/#contact'], ['/links/', '/#contact'], ['/archive/', '/'], ['/archive/qist/', '/'], ['/archive/qist/app/', '/'], ['/archive/use-5-now/', '/'], ['/archive/living-shapes/', '/'], ['/archive/lab/', '/'], ['/work/', '/'], ['/work/living-shapes/', '/'], ['/work/usefive/', '/'], ['/work/living-frame/', '/'], ['/practice/', '/#web'], ['/lab/', '/'], ['/about/', '/']];
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
