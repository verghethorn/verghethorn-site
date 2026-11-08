// VERGHÉTHORN v8. Nothing here blocks page scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };

/* sound toggle */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });

/* header turns solid after the hero */
const hd = $('[data-hd]'), hero = $('[data-hero]');
seen([hero], e => hd.classList.toggle('solid', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px', threshold: 0 });

/* reveal + autoplay videos only while visible */
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .15 });
seen($$('video[data-auto]'), e => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause(); }, { threshold: .2 });

/* ---------- hero: hold to stop time ---------- */
{
  const v = $('[data-hero-v]'), btn = $('[data-hold]'), label = $('[data-hold-t]'), tc = $('[data-tc]'), recL = $('[data-held-l]');
  const portrait = matchMedia('(max-aspect-ratio: 1/1)').matches;
  v.src = portrait ? v.dataset.srcM : v.dataset.srcD;
  if (portrait) v.poster = v.dataset.posterM;
  if (still) v.removeAttribute('autoplay'); else play(v);
  seen([hero], e => { if (e.isIntersecting && !held && !still) play(v); else if (!e.isIntersecting) v.pause(); }, { threshold: 0 });

  let held = false, raf = 0, rate = 1;
  const ramp = to => {
    cancelAnimationFrame(raf);
    const step = () => {
      rate += (to - rate) * .09;
      if (to === 0 && rate < .08) { v.pause(); rate = 0; return; }
      if (to === 1 && rate > .98) rate = 1;
      if (rate > 0) { if (v.paused) play(v); v.playbackRate = Math.max(.0625, rate); }
      if (rate !== to) raf = requestAnimationFrame(step);
    };
    if (to === 1 && rate === 0) rate = .07;
    raf = requestAnimationFrame(step);
  };
  const down = e => {
    if (held || e.button > 0) return; held = true;
    hero.classList.add('stopped'); label.textContent = label.dataset.b; recL.textContent = 'HOLD';
    sfx('slowmo'); buzz(20); ramp(0);
  };
  const up = () => {
    if (!held) return; held = false;
    hero.classList.remove('stopped'); label.textContent = label.dataset.a; recL.textContent = 'REC';
    sfx('whoosh'); ramp(1);
  };
  // the button, or a long press anywhere on the picture
  btn.addEventListener('pointerdown', e => { e.preventDefault(); down(e); });
  let lp = 0;
  hero.addEventListener('pointerdown', e => { if (e.target.closest('[data-hold]') || e.pointerType === 'mouse') return; lp = setTimeout(() => down(e), 260); }, { passive: true });
  hero.addEventListener('mousedown', e => { if (!e.target.closest('[data-hold]') && e.button === 0) down(e); });
  ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(t => (t === 'blur' ? window : hero).addEventListener(t, () => { clearTimeout(lp); up(); }));
  addEventListener('scroll', () => { clearTimeout(lp); if (held) up(); }, { passive: true });
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(e); } });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') up(); });
  btn.addEventListener('contextmenu', e => e.preventDefault());
  hero.addEventListener('contextmenu', e => { if (e.pointerType !== 'mouse') e.preventDefault(); });

  const pad = n => String(n).padStart(2, '0');
  const tick = () => { const t = v.currentTime || 0, f = Math.floor(t * 24); tc.textContent = `00:00:${pad(Math.floor(t))}:${pad(f % 24)}`; requestAnimationFrame(tick); };
  tick();
}

/* ---------- statement: words light up as you scroll ---------- */
{
  const p = $('[data-words]');
  p.innerHTML = p.textContent.split(/(\s+)/).map(w => /\s/.test(w) ? w : `<span>${w}</span>`).join('');
  const ws = $$('span', p);
  let on = false;
  const paint = () => {
    const r = p.getBoundingClientRect(), vh = innerHeight;
    const k = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
    const n = Math.round(k * ws.length);
    ws.forEach((w, i) => w.classList.toggle('lit', i < n));
    if (on) requestAnimationFrame(paint);
  };
  seen([p], e => { on = e.isIntersecting; if (on) paint(); }, { threshold: 0 });
}

/* ---------- design: "Bring us an idea — a teapot." ---------- */
{
  const el = $('[data-swap]'), words = JSON.parse($('#words').textContent);
  let i = 0, t = 0;
  const next = () => { el.classList.add('out'); setTimeout(() => { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove('out'); }, 350); };
  if (!still) seen([el], e => { clearInterval(t); if (e.isIntersecting) t = setInterval(next, 2200); }, { threshold: 0 });
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
