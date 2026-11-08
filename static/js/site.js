// VERGHÉTHORN v11 — product-page layout. Nothing here blocks scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };

/* sound */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });
$$('.pill, .lnk, .gn-l a, .ribbon a').forEach(a => a.addEventListener('click', () => sfx('tick')));

/* mobile menu */
const gn = $('[data-gn]'), burger = $('[data-burger]');
const setMenu = on => { gn.classList.toggle('open', on); burger.setAttribute('aria-expanded', String(on)); document.documentElement.style.overflow = on ? 'hidden' : ''; };
burger.addEventListener('click', () => { setMenu(!gn.classList.contains('open')); sfx('tick'); });
$$('.gn-l a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* reveals + videos that play only while visible */
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .12 });
seen($$('video[data-auto]'), e => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause(); }, { threshold: .05 });

/* AI agent chat plays when the phone comes into view */
seen([$('[data-chat]')], (e, io) => { if (e.isIntersecting) { const ph = e.target; ph.classList.add('play'); io.unobserve(ph); if (!still) [0, 1200, 2600].forEach(t => setTimeout(() => sfx(t % 2200 ? 'pop' : 'tick'), t)); } }, { threshold: .35 });

/* card carousel */
{
  const car = $('[data-car]'), prev = $('[data-car-prev]'), next = $('[data-car-next]');
  const step = () => $('.card', car).offsetWidth + 20;
  const paint = () => { prev.disabled = car.scrollLeft < 8; next.disabled = car.scrollLeft + car.clientWidth > car.scrollWidth - 8; };
  prev.addEventListener('click', () => { sfx('swoosh'); car.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', () => { sfx('swoosh'); car.scrollBy({ left: step(), behavior: 'smooth' }); });
  const dots = $$('[data-dots] button'); let cur = -1;
  const paintDots = () => { const i = Math.round(car.scrollLeft / (car.clientWidth || 1)); if (i !== cur) { if (cur >= 0 && getComputedStyle(dots[0]).display !== 'none') sfx('tick'); cur = i; dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i))); } };
  dots.forEach((d, k) => d.addEventListener('click', () => car.scrollTo({ left: k * car.clientWidth, behavior: 'smooth' })));
  car.addEventListener('scroll', () => { paint(); paintDots(); }, { passive: true }); addEventListener('resize', paint); paint(); paintDots();
}

/* reel player: pick a reel, plays with sound */
{
  const dlg = $('[data-reel-dlg]'), v = $('[data-reel-v]', dlg), picks = $$('[data-reel]', dlg);
  const load = (btn, withSound = true) => {
    picks.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    v.src = btn.dataset.reel; v.muted = !withSound; v.currentTime = 0; play(v);
  };
  $('[data-reel-open]').addEventListener('click', e => { e.preventDefault(); sfx('whoosh'); dlg.showModal(); load(picks.find(b => b.getAttribute('aria-pressed') === 'true') || picks[0]); });
  picks.forEach(b => b.addEventListener('click', () => { sfx('tick'); load(b); }));
  v.addEventListener('ended', () => { const i = picks.findIndex(b => b.getAttribute('aria-pressed') === 'true'); load(picks[(i + 1) % picks.length]); });
  const close = () => { v.pause(); dlg.close(); };
  $('[data-reel-close]').addEventListener('click', close);
  dlg.addEventListener('close', () => v.pause());
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
}

/* social cards: the brand colour fills the screen, then we go */
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
