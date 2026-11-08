// Inner pages (/films/, /start/): product-page behaviour. Nothing here blocks scrolling.
import { sfx, isMuted, setMuted, unlock } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const play = v => { const p = v.play(); if (p) p.catch(() => {}); };
const seen = (els, fn, opts = { threshold: .2 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => el && io.observe(el)); return io; };

/* sound + menu */
const sndBtn = $('[data-sound]');
const paintSnd = () => { const m = isMuted(); sndBtn.setAttribute('aria-pressed', String(!m)); sndBtn.setAttribute('aria-label', m ? sndBtn.dataset.off : sndBtn.dataset.on); };
paintSnd(); sndBtn.addEventListener('click', () => { setMuted(!isMuted()); paintSnd(); sfx('tick'); });
addEventListener('pointerdown', unlock, { once: true, passive: true });
const gn = $('[data-gn]'), burger = $('[data-burger]');
const setMenu = on => { gn.classList.toggle('open', on); burger.setAttribute('aria-expanded', String(on)); document.documentElement.style.overflow = on ? 'hidden' : ''; };
burger.addEventListener('click', () => { setMenu(!gn.classList.contains('open')); sfx('tick'); });
$$('.gn-l a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
$$('.pill, .lnk, .ln a').forEach(a => a.addEventListener('click', () => sfx('tick')));

/* reveals + videos that play only while visible */
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .12 });
seen($$('video[data-auto]'), e => { const v = e.target; if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; play(v); } else v.pause(); }, { threshold: .05 });

/* local nav: shadow once it sticks */
const ln = $('[data-ln]');
if (ln) addEventListener('scroll', () => ln.classList.toggle('stuck', ln.getBoundingClientRect().top <= 0 && scrollY > 10), { passive: true });

/* statement: words light up as you scroll */
const words = $$('[data-words] span');
if (words.length) {
  const box = $('[data-words]');
  const paint = () => { const r = box.getBoundingClientRect(), k = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35))); const n = still ? words.length : Math.round(k * words.length * 1.1); words.forEach((w, i) => w.classList.toggle('on', i < n)); };
  addEventListener('scroll', paint, { passive: true }); paint();
}

/* highlight cards carousel */
const car = $('[data-car]');
if (car) {
  const prev = $('[data-car-prev]'), next = $('[data-car-next]'), dots = $$('[data-dots] button');
  const step = () => $('.card', car).offsetWidth + 20;
  let cur = -1;
  const paint = () => {
    prev.disabled = car.scrollLeft < 8; next.disabled = car.scrollLeft + car.clientWidth > car.scrollWidth - 8;
    const i = Math.round(car.scrollLeft / (car.clientWidth || 1));
    if (i !== cur) { cur = i; dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i))); }
  };
  prev.addEventListener('click', () => { sfx('swoosh'); car.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', () => { sfx('swoosh'); car.scrollBy({ left: step(), behavior: 'smooth' }); });
  dots.forEach((d, k) => d.addEventListener('click', () => car.scrollTo({ left: k * car.clientWidth, behavior: 'smooth' })));
  car.addEventListener('scroll', paint, { passive: true }); addEventListener('resize', paint); paint();
}

/* "+" sheets: details open over the page */
const sheet = $('[data-sheet-dlg]');
if (sheet) {
  const body = $('[data-sheet-body]', sheet), tpl = $('#sheets').content.children;
  const close = () => { sheet.classList.add('closing'); setTimeout(() => { sheet.close(); sheet.classList.remove('closing'); body.innerHTML = ''; }, 280); };
  $$('[data-sheet]').forEach(b => b.addEventListener('click', () => {
    body.innerHTML = ''; body.append(tpl[+b.dataset.sheet].cloneNode(true));
    sfx('whoosh'); sheet.showModal(); sheet.scrollTop = 0;
    const v = $('video', body); if (v) { v.preload = 'auto'; play(v); }
  }));
  $('[data-sheet-close]', sheet).addEventListener('click', close);
  sheet.addEventListener('click', e => { if (e.target === sheet) close(); });
  sheet.addEventListener('cancel', e => { e.preventDefault(); close(); });
}

/* film reel with sound */
const reelBtn = $('[data-film-reel]');
if (reelBtn) {
  const dlg = $('[data-reel-dlg]'), v = $('[data-reel-v]', dlg);
  reelBtn.addEventListener('click', () => { sfx('whoosh'); dlg.showModal(); if (!v.src) v.src = v.dataset.src; v.muted = false; v.currentTime = 0; play(v); });
  const close = () => { v.pause(); dlg.close(); };
  $('[data-reel-close]', dlg).addEventListener('click', close);
  dlg.addEventListener('close', () => v.pause());
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
}

/* Start a project: a few steps → a ready email */
const form = $('[data-start]');
if (form) {
  const cfg = JSON.parse($('#start-cfg').textContent);
  const want = new URLSearchParams(location.search).get('s');
  const pre = want && $(`input[name="kind"][data-key="${CSS.escape(want)}"]`, form);
  if (pre) pre.checked = true;
  $$('input[type="radio"]', form).forEach(r => r.addEventListener('change', () => sfx('pop')));
  const err = $('[data-err]', form);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = new FormData(form), kind = d.get('kind'), contact = (d.get('contact') || '').trim();
    if (!kind || !contact) { err.hidden = false; err.scrollIntoView({ behavior: 'smooth', block: 'center' }); sfx('tick'); return; }
    err.hidden = true;
    const lines = [
      `What: ${kind}`,
      d.get('length') && `Length: ${d.get('length')}`,
      d.get('when') && `When: ${d.get('when')}`,
      '', 'Idea:', (d.get('idea') || '—').trim(), '',
      `Name: ${(d.get('name') || '—').trim()}`,
      `Contact: ${contact}`,
    ].filter(x => x !== false && x !== null && x !== undefined);
    sfx('ding');
    location.href = `mailto:${cfg.mail}?subject=${encodeURIComponent(`${cfg.subject} — ${kind}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
  });
}
