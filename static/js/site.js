// VERGHÉTHORN v5 — every block is something to play with. Nothing ever blocks page scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';
import { FX } from './fx.js';
import { startScene } from './hero.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const T = JSON.parse($('#i18n')?.textContent || '{}');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const R = (a, b) => a + Math.random() * (b - a);
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };
const store = { get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
// a tap = pointer went down and up without moving much (so swipes and scrolls never trigger anything)
const onTap = (el, fn) => { let d = null; el.addEventListener('pointerdown', e => { d = { x: e.clientX, y: e.clientY, t: Date.now() }; }); el.addEventListener('pointerup', e => { if (!d) return; const m = Math.hypot(e.clientX - d.x, e.clientY - d.y); if (m < 12 && Date.now() - d.t < 600) fn(e); d = null; }); el.addEventListener('pointercancel', () => { d = null; }); };

/* ---------- sound toggle ---------- */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd();
sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('pop'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });

/* ---------- reveal headings ---------- */
seen($$('.sec-head'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .2 });

/* ---------- hero: live scenes + tap effects ---------- */
{
  const screen = $('[data-screen]'), scene = $('[data-scene]'), fx = new FX($('[data-fx]'), screen);
  let gl = null; try { gl = startScene(scene); } catch (e) { console.warn(e); }
  if (!gl) screen.classList.add('no-gl');
  fx.start();
  const genres = $$('[data-genre]'), title = $('[data-title]'), take = $('[data-take]'), fxn = $('[data-fxn]'), tc = $('[data-tc]'), action = $('[data-action]');
  let mode = 0, sceneN = 1, takeN = 1, fired = 0;
  const pad = n => String(n).padStart(2, '0');
  const showTitle = t => { title.classList.remove('show'); title.textContent = t; void title.offsetWidth; requestAnimationFrame(() => title.classList.add('show')); clearTimeout(showTitle.t); showTitle.t = setTimeout(() => title.classList.remove('show'), 2600); };
  const cut = (i, newScene) => {
    mode = i; gl?.setMode(i); fx.cut(); sfx('clap'); buzz(12);
    if (newScene) { sceneN++; takeN = 1; } else takeN++;
    take.textContent = `SCENE ${pad(sceneN)} · TAKE ${pad(takeN)}`;
    genres.forEach((g, j) => g.setAttribute('aria-checked', String(j === i)));
    showTitle(genres[i].dataset.title);
  };
  genres.forEach((g, i) => g.addEventListener('click', () => cut(i, i !== mode)));
  action.addEventListener('click', () => { action.classList.remove('snap'); void action.offsetWidth; action.classList.add('snap'); let n; do n = Math.floor(Math.random() * genres.length); while (n === mode); cut(n, true); genres[n].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); });
  const FXS = [
    (x, y) => { fx.boom(x, y); sfx('boom'); buzz(30); },
    (x, y) => { fx.sparks(x, y); sfx('zap'); buzz(10); },
    (x, y) => { fx.bolt(x, y); sfx('zap'); buzz(20); },
    (x, y) => { fx.portal(x, y); sfx('warp'); },
    (x, y) => { fx.confetti(x, y); sfx('confetti'); },
  ];
  onTap(screen, e => {
    const r = screen.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    screen.classList.add('tapped'); FXS[fired % FXS.length](x, y); fired++; fxn.textContent = `FX ×${fired}`;
  });
  screen.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = screen.getBoundingClientRect(); gl?.look((e.clientX - r.left) / r.width - .5, .5 - (e.clientY - r.top) / r.height); });
  setTimeout(() => showTitle(genres[0].dataset.title), 600);
  // timecode
  const t0 = performance.now(); let vis = true; seen([screen], e => { vis = e.isIntersecting; }, { threshold: 0 });
  const tick = now => { if (vis) { const f = Math.floor((now - t0) / (1000 / 24)), s = Math.floor(f / 24); tc.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`; } requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  // idle: if nobody touches it, the scene keeps changing on its own like a trailer
  if (!still) setInterval(() => { if (vis && !document.hidden && !screen.classList.contains('tapped')) { gl?.setMode((mode = (mode + 1) % genres.length)); genres.forEach((g, j) => g.setAttribute('aria-checked', String(j === mode))); showTitle(genres[mode].dataset.title); fx.cut(); } }, 6000);
}

/* ---------- script lab: slot machine ---------- */
{
  const slot = $('[data-slot]'), lists = JSON.parse($('#reels').textContent), reels = $$('[data-reel]', slot), spinBtn = $('[data-spin]'), out = $('[data-logline]'), spun = $('[data-spun]'), use = $('[data-use]');
  const pos = reels.map(() => 0); let count = +store.get('vt-spun', 0), busy = false, typer;
  spun.textContent = count;
  const ih = r => r.querySelector('.reel-w').offsetHeight;
  const place = (i, idx, anim) => { const s = $('[data-strip]', reels[i]); s.style.transition = anim ? `transform ${anim}ms cubic-bezier(.15,.85,.25,1.05)` : 'none'; s.style.transform = `translateY(${-idx * ih(reels[i])}px)`; };
  // build long strips so the spin can travel
  reels.forEach((r, i) => { const s = $('[data-strip]', r); const items = lists[i]; s.innerHTML = Array.from({ length: 6 }, () => items.map(t => `<span>${t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('')).join(''); });
  const text = () => { const [a, b, c] = pos.map((p, i) => lists[i][p % lists[i].length]); return `${a} ${b} ${c}.`; };
  const type = str => { clearInterval(typer); out.innerHTML = ''; const span = document.createElement('span'), cur = document.createElement('span'); cur.className = 'cur'; out.append(span, cur); let k = 0; typer = setInterval(() => { span.textContent = str.slice(0, ++k); if (k % 2) sfx('key'); if (k >= str.length) clearInterval(typer); }, still ? 0 : 24); };
  reels.forEach((r, i) => { r.addEventListener('click', () => { if (busy) return; const on = r.getAttribute('aria-pressed') !== 'true'; r.setAttribute('aria-pressed', String(on)); sfx(on ? 'pop' : 'tick'); }); });
  const spin = () => {
    if (busy) return; busy = true; spinBtn.classList.add('spinning-btn'); sfx('whoosh');
    let done = 0;
    reels.forEach((r, i) => {
      if (r.getAttribute('aria-pressed') === 'true') { done++; return; }
      const n = lists[i].length, target = Math.floor(Math.random() * n), cur = pos[i] % n;
      place(i, cur, 0); void r.offsetWidth;
      const dist = n * 3 + ((target - cur + n) % n || n);
      const ms = 900 + i * 380; r.classList.add('spinning');
      requestAnimationFrame(() => place(i, cur + dist, ms));
      let ticks = 0; const tk = setInterval(() => { sfx('tick'); if (++ticks > ms / 70) clearInterval(tk); }, 70);
      setTimeout(() => { r.classList.remove('spinning'); pos[i] = target; place(i, target, 0); r.setAttribute('aria-label', `${r.querySelector('.reel-l').textContent}: ${lists[i][target]}`); sfx('pop'); buzz(8); if (++done === reels.length) finish(); }, ms + 40);
    });
    if (done === reels.length) finish();
  };
  const finish = () => { busy = false; spinBtn.classList.remove('spinning-btn'); sfx('ding'); count++; spun.textContent = count; store.set('vt-spun', count); type(text()); };
  spinBtn.addEventListener('click', spin);
  addEventListener('resize', () => reels.forEach((_, i) => place(i, pos[i] % lists[i].length, 0)));
  // start on a random story
  reels.forEach((_, i) => { pos[i] = Math.floor(Math.random() * lists[i].length); place(i, pos[i], 0); });
  type(text());
  use.addEventListener('click', () => { const m = $('#f-msg'); if (m) m.value = `${T.pitchPrefix} ${out.textContent.trim()}\n\n`; const r = $('.kinds input[value="campaign"]'); if (r) r.checked = true; });
}

/* ---------- product studio: design → film → app ---------- */
{
  const studio = $('[data-studio]'), canvas = $('[data-can]');
  let api = null, name = 'NOVA', pal = 'citrus';
  const names = $$('[data-pname]');
  const load = async () => { try { const m = await import('./product.js'); api = m.startProduct(canvas, { name, palette: pal }); } catch (e) { console.warn(e); } };
  seen([studio], (e, io) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '400px 0px' });
  const input = $('[data-pname-in]');
  input.addEventListener('input', () => { name = (input.value || 'NOVA').toUpperCase().replace(/[^\p{L}\p{N} &!?.-]/gu, '').slice(0, 10) || 'NOVA'; names.forEach(n => n.textContent = name); api?.label(name, pal); sfx('key'); });
  $$('[data-pal]', studio).forEach(b => b.addEventListener('click', () => { pal = b.dataset.pal; studio.dataset.pal = pal; $$('[data-pal]', studio).forEach(x => x.setAttribute('aria-pressed', String(x === b))); api?.label(name, pal); api?.spin(7); sfx('pop'); }));
  $$('[data-finish]', studio).forEach(b => b.addEventListener('click', () => { $$('[data-finish]', studio).forEach(x => x.setAttribute('aria-pressed', String(x === b))); api?.finish(b.dataset.finish); api?.spin(6); sfx(b.dataset.finish === 'neon' ? 'zap' : 'tick'); }));
  $$('[data-mode-btn]', studio).forEach(b => b.addEventListener('click', () => {
    const m = b.dataset.modeBtn; if (studio.dataset.mode === m) return; studio.dataset.mode = m;
    $$('[data-mode-btn]', studio).forEach(x => x.setAttribute('aria-selected', String(x === b))); api?.mode(m);
    sfx(m === 'film' ? 'clap' : m === 'app' ? 'swoosh' : 'pop'); if (m === 'film') setTimeout(() => sfx('drop'), 250);
  }));
  const buy = $('[data-buy]'); const buyTxt = buy.textContent;
  buy.addEventListener('click', () => { buy.classList.add('done'); buy.textContent = buy.dataset.added; sfx('ding'); buzz(15); setTimeout(() => { buy.classList.remove('done'); buy.textContent = buyTxt; }, 1800); });
}

/* ---------- FX pad ---------- */
{
  const stage = $('[data-fxstage]'), fx = new FX($('[data-fxcanvas]'), stage), word = $('[data-fxword]');
  let started = false; seen([stage], e => { if (e.isIntersecting && !started) { started = true; fx.start(); } }, { threshold: 0 });
  const W = () => fx.w, H = () => fx.h;
  const say = t => { word.textContent = t; word.classList.remove('pop'); void word.offsetWidth; word.classList.add('pop'); };
  const ACT = {
    boom: () => { fx.boom(R(W() * .3, W() * .7), H() * R(.45, .7)); sfx('boom'); say('BOOM'); buzz(30); },
    bolt: () => { fx.bolt(); sfx('zap'); say('ZAP'); buzz(15); },
    rain: () => { fx.rain(); sfx('rain'); },
    snow: () => { fx.snow(); sfx('snow'); },
    warp: () => { fx.warp(); sfx('warp'); say('WARP'); },
    glitch: () => { stage.classList.remove('glitch'); void stage.offsetWidth; stage.classList.add('glitch'); sfx('glitch'); },
    confetti: () => { fx.confetti(W() / 2, H() * .85); sfx('confetti'); say('YAY'); },
    slowmo: () => { fx.slowmo(); fx.sparks(W() / 2, H() / 2, ['120,230,255', '255,255,255']); sfx('slowmo'); say('SLO‑MO'); },
    cut: () => { fx.cut(); sfx('clap'); say('CUT!'); },
  };
  const pads = $$('[data-pad]');
  const hit = b => { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 140); ACT[b.dataset.pad]?.(); };
  pads.forEach(b => { b.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && !e.button) hit(b); }); onTap(b, e => { if (e.pointerType !== 'mouse') hit(b); }); });
  pads.forEach(b => b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit(b); } }));
  const keys = 'qweasdzxc';
  addEventListener('keydown', e => { if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return; const i = keys.indexOf(e.key.toLowerCase()); if (i < 0) return; const r = stage.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; hit(pads[i]); });
}

/* ---------- flip cards ---------- */
$$('[data-card]').forEach(c => c.addEventListener('click', () => { const on = c.getAttribute('aria-pressed') !== 'true'; c.setAttribute('aria-pressed', String(on)); sfx(on ? 'swoosh' : 'pop'); }));

/* ---------- portals: a cinematic effect, then off you go ---------- */
{
  const ov = $('[data-portal-ov]');
  const FXMAP = { youtube: ['yt', ['power', 'whoosh'], 900], instagram: ['ig', ['shutter'], 950], tiktok: ['tt', ['glitch', 'drop'], 750], email: ['mail', ['swoosh', 'ding'], 950] };
  $$('[data-portal]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || still) return;
    e.preventDefault();
    const [cls, sounds, ms] = FXMAP[a.dataset.portal]; const r = $('.orb', a).getBoundingClientRect();
    ov.style.setProperty('--x', `${r.left + r.width / 2}px`); ov.style.setProperty('--y', `${r.top + r.height / 2}px`);
    a.classList.add('fire'); ov.className = `portal-ov go ${cls}`; if (cls === 'tt') document.body.classList.add('tt-glitch');
    sounds.forEach((s, i) => setTimeout(() => sfx(s), i * 260)); buzz(25);
    setTimeout(() => { location.href = a.href; }, ms);
    setTimeout(reset, ms + 1500);
  }));
  const reset = () => { ov.className = 'portal-ov'; document.body.classList.remove('tt-glitch'); $$('.port.fire').forEach(p => p.classList.remove('fire')); };
  addEventListener('pageshow', reset);
}

/* ---------- pitch form ---------- */
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
    if (bad.length) { bad[0].focus(); sfx('glitch'); return; }
    if (form.elements.website.value || Date.now() - opened < 2500) { show('error', T.form.errTitle, T.form.errBot); return; }
    submit.disabled = true; const label = submit.textContent; submit.textContent = T.form.sending;
    const body = { name: form.elements.name.value.trim().slice(0, 120), email: form.elements.email.value.trim().slice(0, 200), category: form.elements.category.value || 'other', message: form.elements.message.value.trim().slice(0, 4000), lang: 'en', page: location.pathname.slice(0, 200) };
    try {
      const r = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: form.dataset.key, Prefer: 'return=minimal' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(String(r.status));
      show('ok', T.form.okTitle, T.form.okText.replace('{email}', body.email)); form.reset(); sfx('clap'); setTimeout(() => sfx('ding'), 200);
    } catch { show('error', T.form.errTitle, T.form.errNet); }
    finally { submit.disabled = false; submit.textContent = label; }
  });
}
