// VERGHÉTHORN v9 — AI filmmaker. Nothing here blocks page scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };
const wait = ms => new Promise(r => setTimeout(r, ms));
const store = { get: (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

/* sound toggle */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });

const hd = $('[data-hd]');
addEventListener('scroll', () => hd.classList.toggle('solid', scrollY > 10), { passive: true });
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .15 });
seen($$('video[data-auto]'), e => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause(); }, { threshold: .2 });

/* ---------- hero: prompt → generation → scene ---------- */
{
  const gen = $('[data-gen]'), v = $('[data-gen-v]'), cv = $('[data-gen-noise]'), txt = $('[data-gen-text]'), go = $('[data-gen-go]'),
    prog = $('[data-gen-prog]'), state = $('[data-gen-state]'), num = $('[data-gen-n]'), chips = $$('[data-scene]');
  const { scenes, t } = JSON.parse($('#scenes').textContent);
  const ctx = cv.getContext('2d'); cv.width = 64; cv.height = 36;
  const img = ctx.createImageData(64, 36);
  let noiseOn = false, run = 0, idx = -1, visible = true, timer = 0;
  const noise = () => {
    if (!noiseOn) return;
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = Math.random() * 230, h = Math.random(); d[i] = n * (.55 + h * .45); d[i + 1] = n * .6; d[i + 2] = n * (1 - h * .35); d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0); requestAnimationFrame(noise);
  };
  const type = async (str, id) => {
    txt.textContent = '';
    if (still) { txt.textContent = str; return; }
    for (let k = 1; k <= str.length; k++) { if (id !== run) return; txt.textContent = str.slice(0, k); if (k % 4 === 0) sfx('key'); await wait(22); }
  };
  const show = async (i, manual = false) => {
    const id = ++run; clearTimeout(timer); idx = i;
    const [src, prompt] = scenes[i];
    chips.forEach((c, k) => c.setAttribute('aria-current', String(k === i)));
    num.textContent = String(i + 1).padStart(2, '0');
    await type(prompt, id); if (id !== run) return;
    if (manual) sfx('whoosh');
    gen.classList.add('busy'); noiseOn = true; noise();
    v.src = src + '.mp4'; v.load();
    const dur = still ? 300 : 2300, t0 = performance.now();
    await new Promise(res => { const step = () => { if (id !== run) return res(); const k = Math.min(1, (performance.now() - t0) / dur); prog.style.width = k * 100 + '%'; state.textContent = `${t.gen} · ${Math.floor(k * 100)}%`; k < 1 ? requestAnimationFrame(step) : res(); }; step(); });
    if (id !== run) return;
    play(v); gen.classList.remove('busy'); setTimeout(() => { noiseOn = false; }, 900);
    prog.style.width = '0'; state.textContent = t.done; sfx('ding'); setTimeout(() => { if (id === run) state.textContent = ''; }, 1600);
    timer = setTimeout(() => { if (visible) show((idx + 1) % scenes.length); }, 6500);
  };
  chips.forEach((c, i) => c.addEventListener('click', () => { buzz(8); show(i, true); }));
  go.addEventListener('click', () => { buzz(8); show((idx + 1) % scenes.length, true); });
  seen([gen], e => { visible = e.isIntersecting; if (visible) { if (idx < 0) show(0); else if (!gen.classList.contains('busy')) { play(v); clearTimeout(timer); timer = setTimeout(() => show((idx + 1) % scenes.length), 5000); } } else { v.pause(); clearTimeout(timer); } }, { threshold: .1 });
  v.loop = true;
}

/* ---------- process: timeline playhead width ---------- */
$$('.ui-tl').forEach(el => { const set = () => el.style.setProperty('--w', `${el.clientWidth - 92}px`); set(); addEventListener('resize', set); });

/* ---------- idea lab ---------- */
{
  const slot = $('[data-slot]'), lists = JSON.parse($('#reels').textContent), reels = $$('[data-reel]', slot), spinBtn = $('[data-spin]'), out = $('[data-logline]'), use = $('[data-use]');
  const pos = reels.map(() => 0); let busy = false, typer;
  const escH = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  reels.forEach((r, i) => { $('[data-strip]', r).innerHTML = Array.from({ length: 6 }, () => lists[i].map(x => `<span>${escH(x)}</span>`).join('')).join(''); });
  const ih = r => $('.sreel-w', r).offsetHeight;
  const place = (i, n, ms) => { const s = $('[data-strip]', reels[i]); s.style.transition = ms ? `transform ${ms}ms cubic-bezier(.15,.85,.25,1.05)` : 'none'; s.style.transform = `translateY(${-n * ih(reels[i])}px)`; };
  const text = () => pos.map((p, i) => lists[i][p % lists[i].length]).join(' ') + '.';
  const type = str => { clearInterval(typer); out.innerHTML = ''; const sp = document.createElement('span'), cur = document.createElement('span'); cur.className = 'cur'; out.append(sp, cur); let k = 0; typer = setInterval(() => { sp.textContent = str.slice(0, ++k); if (k % 3 === 0) sfx('key'); if (k >= str.length) clearInterval(typer); }, still ? 0 : 24); };
  const setMail = () => { use.href = `mailto:verghethorn@gmail.com?subject=${encodeURIComponent(use.dataset.subject)}&body=${encodeURIComponent(text() + '\n\n')}`; };
  reels.forEach(r => r.addEventListener('click', () => { if (busy) return; const on = r.getAttribute('aria-pressed') !== 'true'; r.setAttribute('aria-pressed', String(on)); sfx(on ? 'pop' : 'tick'); }));
  const finish = () => { busy = false; sfx('ding'); store.set('vt-spun', +store.get('vt-spun', 0) + 1); type(text()); setMail(); };
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
  type(text()); setMail();
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
