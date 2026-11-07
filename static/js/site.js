// VERGHÉTHORN v7. Nothing here blocks page scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const T = JSON.parse($('#i18n')?.textContent || '{}');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };
const store = { get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };

const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });

const hd = $('[data-hd]'), stage = $('[data-stage]');
seen([stage], e => hd.classList.toggle('light', !e.isIntersecting), { rootMargin: '-72px 0px 0px 0px', threshold: 0 });
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .15 });
seen($$('video[data-auto]'), e => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause(); }, { threshold: .25 });

/* ---------- the 3D film set ---------- */
{
  const canvas = $('[data-set3d]'), lbls = Object.fromEntries($$('[data-lbl]').map(b => [b.dataset.lbl, b]));
  const { lines, product } = JSON.parse($('#hero-lines').textContent);
  const subs = $('[data-subs]'), povcam = $('[data-povcam]'), tc = $('[data-tc]'), viewBtns = $$('[data-view-btn]');
  let api = null, subT = 0, subI = 0;
  const showSub = text => { subs.classList.remove('show'); setTimeout(() => { subs.textContent = text; subs.classList.add('show'); }, 250); };
  const ui = {
    model: '/media/3d/xbot.glb',
    place(id, x, y, vis) { const b = lbls[id]; if (!b) return; b.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`; b.classList.toggle('hidden', !vis); },
    onLamp(id, on) { lbls['lamp:' + id]?.classList.toggle('on', on); },
    onView(v) {
      stage.dataset.view = v; viewBtns.forEach(b => b.setAttribute('aria-selected', String(b.dataset.viewBtn === v)));
      povcam.textContent = v === 'a' ? 'CAMERA A · 35MM' : 'CAMERA B · 85MM · DOLLY';
      clearInterval(subT); subs.classList.remove('show');
      if (v === 'a') { subI = 0; showSub(lines[0]); subT = setInterval(() => showSub(lines[++subI % lines.length]), 3200); }
      if (v === 'b') showSub(product);
    },
    onActor() { sfx('swoosh'); },
    onReady() { stage.classList.add('ready'); },
  };
  const boot = async () => {
    try {
      const m = await import('./set3d.js');
      api = await m.startSet(canvas, ui);
    } catch (e) { console.warn(e); stage.classList.add('failed'); }
  };
  if (!window.WebGLRenderingContext) stage.classList.add('failed'); else boot();
  // the floating labels are real buttons: same actions as tapping the object
  Object.entries(lbls).forEach(([id, b]) => b.addEventListener('click', () => {
    if (!api) return; const [kind, key] = id.split(':');
    if (kind === 'lamp') { api.toggleLamp(key); sfx('tick'); buzz(8); }
    if (kind === 'cam') { api.setView(key); sfx('shutter'); }
    if (kind === 'actor') api.moveActor(key);
  }));
  viewBtns.forEach(b => b.addEventListener('click', () => { api?.setView(b.dataset.viewBtn); sfx(b.dataset.viewBtn === 'set' ? 'tick' : 'shutter'); }));
  canvas.addEventListener('pointerup', () => sfx('tick'));
  const t0 = performance.now(), pad = n => String(n).padStart(2, '0');
  setInterval(() => { if (stage.dataset.view === 'set') return; const f = Math.floor((performance.now() - t0) / (1000 / 24)), s = Math.floor(f / 24); tc.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`; }, 42);
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
  const type = str => { clearInterval(typer); out.innerHTML = ''; const sp = document.createElement('span'), cur = document.createElement('span'); cur.className = 'cur'; out.append(sp, cur); let k = 0; typer = setInterval(() => { sp.textContent = str.slice(0, ++k); if (k % 3 === 0) sfx('key'); if (k >= str.length) clearInterval(typer); }, still ? 0 : 24); };
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
  use.addEventListener('click', () => { const m = $('#f-msg'); if (m) m.value = `${T.pitchPrefix} ${out.textContent.trim()}\n\n`; const r = $('.kinds input[value="campaign"]'); if (r) r.checked = true; });
}

/* ---------- social cards: the brand colour fills the screen, then we go ---------- */
{
  const warp = $('[data-warp]'), icon = $('.warp-i', warp);
  const reset = () => { warp.className = 'warp'; };
  $$('[data-soc]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || still) return;
    e.preventDefault();
    const i = $('.soc-i', a), r = i.getBoundingClientRect();
    warp.style.setProperty('--x', `${r.left + r.width / 2}px`); warp.style.setProperty('--y', `${r.top + r.height / 2}px`);
    warp.style.setProperty('--c', getComputedStyle(a).getPropertyValue('--c'));
    icon.innerHTML = $('svg', i).outerHTML;
    warp.className = `warp go${a.dataset.soc === 'instagram' ? ' ig' : ''}`;
    sfx('whoosh'); setTimeout(() => sfx('pop'), 380); buzz(15);
    setTimeout(() => { location.href = a.href; }, 900); setTimeout(reset, 2400);
  }));
  addEventListener('pageshow', reset);
}

/* ---------- form ---------- */
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
      show('ok', T.form.okTitle, T.form.okText.replace('{email}', body.email)); form.reset(); sfx('ding');
    } catch { show('error', T.form.errTitle, T.form.errNet); }
    finally { submit.disabled = false; submit.textContent = label; }
  });
}
