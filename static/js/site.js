// VERGHÉTHORN v6 — video-first. Nothing here ever blocks page scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';
import { startMonitor } from './grade.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const T = JSON.parse($('#i18n')?.textContent || '{}');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };
const store = { get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
const onTap = (el, fn) => { let d = null; el.addEventListener('pointerdown', e => { d = { x: e.clientX, y: e.clientY, t: Date.now() }; }); el.addEventListener('pointerup', e => { if (!d) return; if (Math.hypot(e.clientX - d.x, e.clientY - d.y) < 12 && Date.now() - d.t < 600) fn(e); d = null; }); el.addEventListener('pointercancel', () => { d = null; }); };
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };

/* sound toggle */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });

/* header */
const hd = $('[data-hd]'), hero = $('[data-hero]');
seen([hero], e => hd.classList.toggle('solid', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px', threshold: 0 });
seen($$('.sec-head'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .2 });

/* ---------- hero: stories-style montage ---------- */
{
  const wide = matchMedia('(min-width: 1000px) and (min-aspect-ratio: 1/1)').matches;
  const clips = $$(wide ? '.hv.d' : '.hv.m', hero), bars = $('[data-bars]'), label = $('[data-hlabel]');
  bars.innerHTML = clips.map(() => '<i><b></b></i>').join(''); const bi = $$('i', bars);
  let cur = -1, timer;
  const load = v => { if (!v.src) { v.src = v.dataset.src; v.load(); } };
  const show = i => {
    i = (i + clips.length) % clips.length; const prev = clips[cur];
    cur = i; const v = clips[cur]; load(v); load(clips[(cur + 1) % clips.length]);
    clips.forEach(c => c !== v && c.classList.remove('on')); v.classList.add('on');
    v.style.animation = 'none'; void v.offsetWidth; v.style.animation = '';
    v.currentTime = 0; play(v); if (prev && prev !== v) setTimeout(() => prev.pause(), 900);
    label.textContent = v.dataset.label;
    bi.forEach((b, j) => { b.className = j < cur ? 'done' : ''; });
    const dur = still ? 9 : 6.5; bi[cur].style.setProperty('--dur', dur + 's'); void bi[cur].offsetWidth; bi[cur].className = 'now';
    clearTimeout(timer); timer = setTimeout(() => show(cur + 1), dur * 1000);
  };
  clips.forEach(v => { v.loop = true; });
  show(0);
  onTap($('[data-reel-hero]'), e => { const left = e.clientX < innerWidth * .3; show(cur + (left ? -1 : 1)); sfx('swoosh'); });
  seen([hero], e => { const v = clips[cur]; if (e.isIntersecting) { play(v); } else v.pause(); }, { threshold: 0 });
}

/* ---------- autoplay muted clips only while on screen ---------- */
seen($$('video[data-auto]'), e => {
  const v = e.target;
  if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause();
}, { threshold: .25 });
seen($$('.panel'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .35 });

/* ---------- on set: lights, lenses, aim the key ---------- */
{
  const box = $('[data-monitor]'), video = $('.mon-v', box), canvas = $('[data-mon]'), hud = $('[data-mhud]'), tc = $('[data-tc]'), keyc = $('[data-keyc]');
  let mon = null; try { mon = startMonitor(canvas, video, [.56, .32]); } catch (e) { console.warn(e); }
  const state = { light: 'tungsten', lens: '35' };
  const LBL = { light: { day: '5600K', tungsten: '3200K', neon: 'NEON', golden: 'GOLDEN HOUR' }, lens: { 35: '35MM', 85: '85MM · T1.5', ana: '40MM ANAMORPHIC · 2.39:1', 16: '16MM FILM' } };
  const FALL = { day: 'saturate(1) brightness(1.05)', tungsten: 'sepia(.35) saturate(1.2) contrast(1.1)', neon: 'hue-rotate(-40deg) saturate(1.6) contrast(1.15)', golden: 'sepia(.5) saturate(1.3) brightness(1.05)' };
  const paint = () => { hud.textContent = `A‑CAM · ${LBL.lens[state.lens]} · ${LBL.light[state.light]} · 24FPS`; if (!mon) video.style.filter = FALL[state.light]; };
  const pick = (group, btn) => { $$(`[data-${group}]`).forEach(b => b.setAttribute('aria-pressed', String(b === btn))); state[group] = btn.dataset[group]; mon?.[group](state[group]); paint(); sfx(group === 'lens' ? 'shutter' : 'clap'); buzz(10); };
  $$('[data-light]').forEach(b => b.addEventListener('click', () => pick('light', b)));
  $$('[data-lens]').forEach(b => b.addEventListener('click', () => pick('lens', b)));
  const aim = (x, y) => { keyc.style.left = `${x * 100}%`; keyc.style.top = `${y * 100}%`; mon?.key(x, 1 - y); };
  aim(.42, .4);
  onTap(box, e => { const r = box.getBoundingClientRect(); aim((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); box.classList.add('aimed'); sfx('tick'); });
  if (!mon) canvas.remove();
  paint();
  play(video);
  const t0 = performance.now(), pad = n => String(n).padStart(2, '0');
  let vis = false; seen([box], e => { vis = e.isIntersecting; }, { threshold: 0 });
  const tick = now => { if (vis) { const f = Math.floor((now - t0) / (1000 / 24)), s = Math.floor(f / 24); tc.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`; } requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}

/* ---------- colourways ---------- */
{
  const cw = $('[data-cw]');
  $$('[data-colour]', cw).forEach(b => b.addEventListener('click', () => { cw.dataset.cw = b.dataset.colour; $$('[data-colour]', cw).forEach(x => x.setAttribute('aria-pressed', String(x === b))); sfx('tick'); }));
}

/* ---------- script lab ---------- */
{
  const slot = $('[data-slot]'), lists = JSON.parse($('#reels').textContent), reels = $$('[data-reel]', slot), spinBtn = $('[data-spin]'), out = $('[data-logline]'), spun = $('[data-spun]'), use = $('[data-use]');
  const pos = reels.map(() => 0); let count = +store.get('vt-spun', 0), busy = false, typer;
  spun.textContent = count;
  const escH = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  reels.forEach((r, i) => { $('[data-strip]', r).innerHTML = Array.from({ length: 6 }, () => lists[i].map(t => `<span>${escH(t)}</span>`).join('')).join(''); });
  const ih = r => $('.sreel-w', r).offsetHeight;
  const place = (i, idx, ms) => { const s = $('[data-strip]', reels[i]); s.style.transition = ms ? `transform ${ms}ms cubic-bezier(.15,.85,.25,1.05)` : 'none'; s.style.transform = `translateY(${-idx * ih(reels[i])}px)`; };
  const text = () => pos.map((p, i) => lists[i][p % lists[i].length]).join(' ') + '.';
  const type = str => { clearInterval(typer); out.innerHTML = ''; const sp = document.createElement('span'), cur = document.createElement('span'); cur.className = 'cur'; out.append(sp, cur); let k = 0; typer = setInterval(() => { sp.textContent = str.slice(0, ++k); if (k % 3 === 0) sfx('key'); if (k >= str.length) clearInterval(typer); }, still ? 0 : 26); };
  reels.forEach(r => r.addEventListener('click', () => { if (busy) return; const on = r.getAttribute('aria-pressed') !== 'true'; r.setAttribute('aria-pressed', String(on)); sfx(on ? 'pop' : 'tick'); }));
  const finish = () => { busy = false; sfx('ding'); count++; spun.textContent = count; store.set('vt-spun', count); type(text()); };
  spinBtn.addEventListener('click', () => {
    if (busy) return; busy = true; sfx('whoosh'); let done = 0;
    reels.forEach((r, i) => {
      if (r.getAttribute('aria-pressed') === 'true') { done++; return; }
      const n = lists[i].length, target = Math.floor(Math.random() * n), cur = pos[i] % n;
      place(i, cur, 0); void r.offsetWidth;
      const dist = n * 3 + ((target - cur + n) % n || n), ms = 900 + i * 380; r.classList.add('spinning');
      requestAnimationFrame(() => place(i, cur + dist, ms));
      let k = 0; const tk = setInterval(() => { sfx('tick'); if (++k > ms / 80) clearInterval(tk); }, 80);
      setTimeout(() => { r.classList.remove('spinning'); pos[i] = target; place(i, target, 0); r.setAttribute('aria-label', `${$('.sreel-l', r).textContent}: ${lists[i][target]}`); sfx('pop'); buzz(8); if (++done === reels.length) finish(); }, ms + 40);
    });
    if (done === reels.length) finish();
  });
  addEventListener('resize', () => reels.forEach((_, i) => place(i, pos[i] % lists[i].length, 0)));
  reels.forEach((_, i) => { pos[i] = Math.floor(Math.random() * lists[i].length); place(i, pos[i], 0); });
  type(text());
  use.addEventListener('click', () => { const m = $('#f-msg'); if (m) m.value = `${T.pitchPrefix} ${out.textContent.trim()}\n\n`; const r = $('.kinds input[value="film"]'); if (r) r.checked = true; });
}

/* ---------- portals ---------- */
{
  const ov = $('[data-portal-ov]');
  const FX = { youtube: ['yt', ['power', 'whoosh'], 900], instagram: ['ig', ['shutter'], 950], tiktok: ['tt', ['glitch', 'drop'], 750], email: ['mail', ['swoosh', 'ding'], 950] };
  const reset = () => { ov.className = 'portal-ov'; document.body.classList.remove('tt-glitch'); $$('.port.fire').forEach(p => p.classList.remove('fire')); };
  $$('[data-portal]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || still) return;
    e.preventDefault();
    const [cls, sounds, ms] = FX[a.dataset.portal], r = $('.orb', a).getBoundingClientRect();
    ov.style.setProperty('--x', `${r.left + r.width / 2}px`); ov.style.setProperty('--y', `${r.top + r.height / 2}px`);
    a.classList.add('fire'); ov.className = `portal-ov go ${cls}`; if (cls === 'tt') document.body.classList.add('tt-glitch');
    sounds.forEach((s, i) => setTimeout(() => sfx(s), i * 260)); buzz(25);
    setTimeout(() => { location.href = a.href; }, ms); setTimeout(reset, ms + 1500);
  }));
  addEventListener('pageshow', reset);
}

/* ---------- pitch form ---------- */
const form = $('form[data-inquiry]');
if (form) {
  const statusEl = $('[data-form-status]'), submit = $('button[type=submit]', form), opened = Date.now();
  const rules = { name: v => v.trim() ? '' : T.form.errName, email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? '' : T.form.errEmail, message: v => v.trim().length >= 10 ? '' : T.form.errMessage };
  const check = (el, show) => { const msg = rules[el.name]?.(el.value) ?? '', field = el.closest('.field'), err = $('.error', field); if (show || field.classList.contains('is-invalid')) { field.classList.toggle('is-invalid', !!msg); err.textContent = msg; el.setAttribute('aria-invalid', String(!!msg)); } return !msg; };
  $$('input, textarea', form).forEach(el => { if (!rules[el.name]) return; el.addEventListener('blur', () => { if (el.value) check(el, true); }); el.addEventListener('input', () => check(el, false)); });
  const show = (kind, title, text) => { statusEl.hidden = false; statusEl.dataset.kind = kind; statusEl.innerHTML = ''; const s = document.createElement('strong'); s.textContent = title; const p = document.createElement('p'); p.textContent = text; statusEl.append(s, p); statusEl.focus(); };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const bad = $$('input, textarea', form).filter(el => rules[el.name] && !check(el, true));
    if (bad.length) { bad[0].focus(); return; }
    if (form.elements.website.value || Date.now() - opened < 2500) { show('error', T.form.errTitle, T.form.errBot); return; }
    submit.disabled = true; const label = submit.textContent; submit.textContent = T.form.sending;
    const body = { name: form.elements.name.value.trim().slice(0, 120), email: form.elements.email.value.trim().slice(0, 200), category: form.elements.category.value || 'other', message: form.elements.message.value.trim().slice(0, 4000), lang: 'en', page: location.pathname.slice(0, 200) };
    try {
      const r = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: form.dataset.key, Prefer: 'return=minimal' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(String(r.status));
      show('ok', T.form.okTitle, T.form.okText.replace('{email}', body.email)); form.reset(); sfx('clap');
    } catch { show('error', T.form.errTitle, T.form.errNet); }
    finally { submit.disabled = false; submit.textContent = label; }
  });
}
