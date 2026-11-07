// VERGHÉTHORN — page behaviour. Everything degrades gracefully: the page reads fine without scripts or WebGL.
import { sfx, isMuted, setMuted } from './sound.js';

const T = JSON.parse(document.getElementById('i18n')?.textContent || '{}');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };
const LANG = document.documentElement.lang;

/* ---------- nav ---------- */
const menuBtn = $('.menu-btn'), links = $('#gnav-links');
const closeMenu = () => { links.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = T.menu; };
menuBtn?.addEventListener('click', () => {
  const open = !links.classList.contains('is-open');
  links.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', String(open)); menuBtn.textContent = open ? T.close : T.menu;
  sfx('tick');
});
$$('a', links).forEach(a => a.addEventListener('click', closeMenu));
addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeDock(); } });
// highlight the section on screen
const navMap = Object.fromEntries($$('[data-nav]').map(a => [a.dataset.nav, a]));
const navObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { $$('[data-nav]').forEach(a => a.classList.remove('is-active')); navMap[e.target.id]?.classList.add('is-active'); } }), { rootMargin: '-45% 0px -50% 0px' });
['film', 'web', 'ads', 'how', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) navObs.observe(el); });

/* ---------- language memory ---------- */
$$('[data-lang-link]').forEach(a => a.addEventListener('click', () => store.set('vt-lang', a.dataset.langLink)));
if (LANG === 'en' && location.pathname === '/' && store.get('vt-lang') === 'ru' && !document.referrer.startsWith(location.origin)) location.replace('/ru/');

/* ---------- sound ---------- */
const sBtn = $('[data-sound]');
const syncSound = () => { const on = !isMuted(); sBtn.setAttribute('aria-pressed', String(on)); sBtn.setAttribute('aria-label', on ? sBtn.dataset.on : sBtn.dataset.off); };
sBtn?.addEventListener('click', () => { setMuted(!isMuted()); syncSound(); }); syncSound();

/* ---------- camera looks ---------- */
const dock = $('[data-dock]'), dockBtn = $('.dock-btn', dock), dockMenu = $('#dock-menu');
const lookBtns = $$('[data-look]', dockMenu);
const closeDock = () => { if (!dockMenu.hidden) { dockMenu.hidden = true; dockBtn.setAttribute('aria-expanded', 'false'); } };
dockBtn.addEventListener('click', () => {
  const open = dockMenu.hidden; dockMenu.hidden = !open; dockBtn.setAttribute('aria-expanded', String(open)); sfx('tick');
  if (open) ($('[aria-checked="true"]', dockMenu) || lookBtns[0]).focus();
});
document.addEventListener('pointerdown', e => { if (!dock.contains(e.target)) closeDock(); });
const reflectLook = id => {
  lookBtns.forEach(b => { const on = b.dataset.look === id; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
  $('[data-look-name]').textContent = T.looks[id];
  document.querySelector('meta[name=theme-color]').content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
};
const setLook = (id, from) => {
  const apply = () => { document.documentElement.dataset.look = id; reflectLook(id); dispatchEvent(new CustomEvent('vt:look', { detail: id })); };
  store.set('vt-look', id);
  if (from) { const r = from.getBoundingClientRect(); document.documentElement.style.setProperty('--ix', r.left + r.width / 2 + 'px'); document.documentElement.style.setProperty('--iy', r.top + r.height / 2 + 'px'); }
  if (document.startViewTransition && !reduce) document.startViewTransition(apply); else apply();
  sfx('shutter');
};
lookBtns.forEach((b, i) => {
  b.addEventListener('click', () => { setLook(b.dataset.look, dockBtn); closeDock(); dockBtn.focus(); });
  b.addEventListener('keydown', e => {
    const d = ['ArrowDown', 'ArrowRight'].includes(e.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(e.key) ? -1 : 0;
    if (d) { e.preventDefault(); lookBtns[(i + d + lookBtns.length) % lookBtns.length].focus(); }
  });
});
reflectLook(document.documentElement.dataset.look || 'day');

/* ---------- statement words (fallback for browsers without scroll timelines) ---------- */
if (!CSS.supports('animation-timeline: view()')) {
  const words = $$('.statement-text .w');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-lit'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -35% 0px' });
  words.forEach(w => io.observe(w));
}
const revIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); revIO.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
$$('.reveal').forEach(el => reduce ? el.classList.add('is-in') : revIO.observe(el));

/* ---------- 3D scenes: loaded when near the screen ---------- */
const scenes = {};
const loaders = {
  set: el => import('./scenes/set.js').then(m => m.initSet(el, T, sfx)),
  web: el => import('./scenes/web.js').then(m => m.initWeb(el, T, sfx)),
  ad: el => import('./scenes/ad.js').then(m => m.initAd(el, T, sfx)),
  how: el => import('./scenes/explode.js').then(m => m.initExplode(el, T, sfx)),
};
const sceneIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, id = el.dataset.scene; sceneIO.unobserve(el);
  loaders[id](el).then(api => { scenes[id] = api; onScroll(); if (id === 'ad' && api) api.setAudience(curAud); })
    .catch(err => { console.warn('scene', id, err); el.classList.add('no-gl'); });
}), { rootMargin: '600px 0px' });
$$('[data-scene]').forEach(el => sceneIO.observe(el));

/* ---------- pinned sections: scroll progress ---------- */
const pins = $$('[data-pin]');
const stagesEl = $$('.stages li');
const stepEls = $$('.how-steps li');
let lastStep = -2, lastStage = -1;
function progressOf(el) { const r = el.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); }
function onScroll() {
  pins.forEach(el => {
    const p = progressOf(el);
    if (el.dataset.pin === 'web') {
      scenes.web?.setProgress(p * 1.15);
      const st = Math.min(stagesEl.length - 1, Math.floor(p * stagesEl.length * .999));
      if (st !== lastStage) { lastStage = st; stagesEl.forEach((li, i) => { li.classList.toggle('is-on', i === st); li.classList.toggle('is-done', i < st); }); }
    } else if (el.dataset.pin === 'how') {
      const a = scenes.how?.setProgress(p) ?? (p < .18 ? -1 : Math.min(5, Math.floor((p - .18) / .82 * 6)));
      if (a !== lastStep) {
        if (lastStep !== -2 && a >= 0) sfx('tick');
        lastStep = a;
        stepEls.forEach((li, i) => { li.classList.toggle('is-on', i === a); li.classList.toggle('is-done', i < a); });
        const lab = $('[data-layer-label]'); if (lab && a >= 0) lab.textContent = T.how.steps[a].toUpperCase();
      }
    }
  });
}
let ticking = false;
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } }, { passive: true });
addEventListener('resize', onScroll, { passive: true });
onScroll();
// clicking a step scrolls to it
$$('[data-step-go]').forEach(b => b.addEventListener('click', () => {
  const pin = $('[data-pin="how"]'), i = +b.dataset.stepGo;
  const target = .18 + (i + .5) / 6 * .82;
  const top = pin.getBoundingClientRect().top + scrollY + target * (pin.offsetHeight - innerHeight);
  scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
}));

/* ---------- ad audiences ---------- */
const player = $('[data-ad-player]'), tag = $('[data-ad-tag]'), audBtns = $$('[data-aud]', $('.aud'));
let curAud = 'genz';
const pickAud = (id, focus) => {
  curAud = id;
  audBtns.forEach(b => { const on = b.dataset.aud === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on) { b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' }); if (focus) b.focus(); } });
  player.dataset.aud = id;
  const b = audBtns.find(x => x.dataset.aud === id);
  tag.textContent = b.dataset.tag; tag.style.animation = 'none'; void tag.offsetWidth; tag.style.animation = '';
  scenes.ad?.setAudience(id);
  sfx('cut');
};
audBtns.forEach((b, i) => {
  b.addEventListener('click', () => pickAud(b.dataset.aud));
  b.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); pickAud(audBtns[(i + d + audBtns.length) % audBtns.length].dataset.aud, true); } });
});
$$('[data-aud-step]').forEach(b => b.addEventListener('click', () => {
  const i = audBtns.findIndex(x => x.dataset.aud === curAud);
  pickAud(audBtns[(i + +b.dataset.audStep + audBtns.length) % audBtns.length].dataset.aud);
}));
// a little countdown, like a real spot
const adTime = $('[data-ad-time]');
if (adTime && !reduce) { let n = 3; setInterval(() => { n = n <= 1 ? 3 : n - 1; adTime.textContent = '0:0' + n; }, 1000); }

/* ---------- doors ---------- */
const toast = $('[data-toast]');
let toastT = 0;
const showToast = () => { toast.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => toast.hidden = true, 2200); };
$$('.door').forEach(d => {
  d.addEventListener('pointerenter', () => sfx('tick'));
  d.addEventListener('click', e => {
    e.preventDefault();
    d.classList.add('is-open'); sfx('door');
    const href = d.getAttribute('href');
    if (d.hasAttribute('data-email')) {
      navigator.clipboard?.writeText(href.replace('mailto:', '')).then(showToast, () => {});
      setTimeout(() => { location.href = href; }, 650);
    } else {
      setTimeout(() => { const w = window.open(href, '_blank', 'noopener'); if (!w) location.href = href; }, 650);
    }
    setTimeout(() => d.classList.remove('is-open'), 2600);
  });
});

/* ---------- inquiry form ---------- */
const form = $('form[data-inquiry]');
if (form) {
  const statusEl = $('[data-form-status]'), submit = $('button[type=submit]', form), opened = Date.now();
  const rules = {
    name: v => v.trim() ? '' : T.form.errName,
    email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? '' : T.form.errEmail,
    message: v => v.trim().length >= 10 ? '' : T.form.errMessage,
  };
  const check = (el, show) => {
    const msg = rules[el.name]?.(el.value) ?? '', field = el.closest('.field'), err = $('.error', field);
    if (show || field.classList.contains('is-invalid')) { field.classList.toggle('is-invalid', !!msg); err.textContent = msg; el.setAttribute('aria-invalid', String(!!msg)); }
    return !msg;
  };
  $$('input, textarea', form).forEach(el => { if (!rules[el.name]) return; el.addEventListener('blur', () => { if (el.value) check(el, true); }); el.addEventListener('input', () => check(el, false)); });
  $$('.kinds input', form).forEach(r => r.addEventListener('change', () => sfx('tick')));
  const show = (kind, title, text) => { statusEl.hidden = false; statusEl.dataset.kind = kind; statusEl.innerHTML = ''; const s = document.createElement('strong'); s.textContent = title; const p = document.createElement('p'); p.textContent = text; statusEl.append(s, p); statusEl.focus(); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = $$('input, textarea', form).filter(el => rules[el.name] && !check(el, true));
    if (bad.length) { bad[0].focus(); return; }
    if (form.elements.website.value || Date.now() - opened < 2500) { show('error', T.form.errTitle, T.form.errBot); return; }
    submit.disabled = true; const label = submit.textContent; submit.textContent = T.form.sending;
    const body = { name: form.elements.name.value.trim().slice(0, 120), email: form.elements.email.value.trim().slice(0, 200), category: form.elements.category.value || 'other', message: form.elements.message.value.trim().slice(0, 4000), lang: LANG, page: location.pathname.slice(0, 200) };
    try {
      const r = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: form.dataset.key, Prefer: 'return=minimal' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(String(r.status));
      show('ok', T.form.okTitle, T.form.okText.replace('{email}', body.email)); form.reset(); sfx('chime');
    } catch { show('error', T.form.errTitle, T.form.errNet); }
    finally { submit.disabled = false; submit.textContent = label; }
  });
}
