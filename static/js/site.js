// VERGHÉTHORN v10 — AI Cinema. Scroll-linked, never scroll-blocking.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };

/* sound toggle */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });
$$('.nav a, .wm').forEach(a => a.addEventListener('click', () => sfx('tick')));

/* reveals + videos that play only while visible */
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .12 });
seen($$('video[data-auto]'), e => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause(); }, { threshold: .05 });

/* showreel: title + progress per 4-second segment */
const reel = $('[data-reel]'), clips = JSON.parse($('#clips').textContent), clipEl = $('[data-clip]'), bars = $$('.reel-bar em');
let seg = 0;
const tickReel = () => {
  const t = reel.currentTime || 0, i = Math.min(clips.length - 1, Math.floor(t / 4));
  bars.forEach((b, k) => b.style.setProperty('--w', k < i ? 1 : k > i ? 0 : clamp((t - i * 4) / (i === clips.length - 1 ? 4.8 : 4))));
  if (i !== seg) { seg = i; clipEl.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 700, easing: 'ease-out' }); clipEl.textContent = clips[i]; }
  if (!reel.paused) requestAnimationFrame(tickReel);
};
reel.addEventListener('play', () => requestAnimationFrame(tickReel));
seen([reel], e => e.isIntersecting ? play(reel) : reel.pause(), { threshold: 0 });
play(reel); requestAnimationFrame(tickReel);

/* scroll-linked scenes */
const hd = $('[data-hd]'), hero = $('[data-hero]'), sections = $$('main > section[data-theme]'), meta = $('meta[name="theme-color"]');
const words = $$('[data-words] span'), stmt = $('[data-words]'), cards = $$('[data-card]');
let lastY = scrollY, theme = 'dark', ticking = false;
const frame = () => {
  ticking = false;
  const y = scrollY, vh = innerHeight;
  // hero: full-bleed film settles into a frame
  if (!still) hero.style.setProperty('--p', clamp((y - hero.offsetTop) / (hero.offsetHeight - vh)).toFixed(4));
  // page colour follows the section in the middle of the screen
  const mid = vh * .5, cur = sections.find(s => { const r = s.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
  const t = cur ? cur.dataset.theme : theme;
  if (t !== theme) { theme = t; document.body.dataset.theme = t; meta.content = t === 'light' ? '#f4f3f0' : '#0a0a0a'; }
  // header
  hd.classList.toggle('solid', y > vh * .9); hd.classList.toggle('top', y < vh * .3);
  hd.classList.toggle('hide', y > hero.offsetTop + hero.offsetHeight && y > lastY + 4);
  if (y < lastY - 4) hd.classList.remove('hide');
  lastY = y;
  // statement: words light up as you read
  const box = stmt.parentElement.getBoundingClientRect(), k = clamp((vh * .35 - box.top) / (box.height - vh * .9));
  const n = Math.round(k * words.length);
  words.forEach((w, i) => w.classList.toggle('on', still || i < n));
  // service cards: the one underneath steps back as the next one slides over
  if (!still) cards.forEach((c, i) => { const nx = cards[i + 1]; c.style.setProperty('--k', nx ? clamp(1 - nx.getBoundingClientRect().top / vh).toFixed(4) : 0); });
};
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); frame();

/* work rail */
{
  const rail = $('[data-rail]'), prev = $('[data-prev]'), next = $('[data-next]');
  const step = () => { const t = $('.tile', rail); return t.offsetWidth + parseFloat(getComputedStyle(rail).columnGap || 0); };
  const paint = () => { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8; };
  prev.addEventListener('click', () => { sfx('swoosh'); rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', () => { sfx('swoosh'); rail.scrollBy({ left: step(), behavior: 'smooth' }); });
  rail.addEventListener('scroll', paint, { passive: true }); paint();
  if (fine) $$('.tile', rail).forEach(t => t.addEventListener('pointerenter', () => sfx('tick')));
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
