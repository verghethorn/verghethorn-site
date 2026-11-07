// VERGHÉTHORN v4 — small, touch-friendly behaviour. Nothing here ever blocks page scrolling.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const T = JSON.parse($('#i18n')?.textContent || '{}');
const LANG = document.documentElement.lang;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const seen = (els, fn, opts = { threshold: .35 }) => { const io = new IntersectionObserver(es => es.forEach(e => fn(e, io)), opts); els.forEach(el => io.observe(el)); return io; };

/* ---------- header: dark over the film set, light glass after ---------- */
const hd = $('[data-hd]'), set = $('[data-set]');
if (hd && set) seen([set], e => hd.classList.toggle('light', !e.isIntersecting), { rootMargin: '-64px 0px 0px 0px', threshold: 0 });
try { $('[data-lang]')?.addEventListener('click', e => localStorage.setItem('vt-lang', e.currentTarget.dataset.lang)); } catch {}

/* ---------- the set: three cameras, tap or swipe to cut ---------- */
if (set) {
  const shots = $$('.shot', set), cams = $$('.cam', set), label = $('[data-vfcam]', set), tc = $('[data-tc]', set);
  let cur = 0, auto = !still, timer;
  const cut = (i, user) => {
    i = (i + shots.length) % shots.length; if (i === cur) return;
    shots[cur].classList.remove('on'); cams[cur].classList.remove('on'); cams[cur].setAttribute('aria-pressed', 'false');
    cur = i;
    // restart the slow push-in for the new shot
    const im = $('img', shots[cur]); im.style.animation = 'none'; void im.offsetWidth; im.style.animation = '';
    shots[cur].classList.add('on'); cams[cur].classList.add('on'); cams[cur].setAttribute('aria-pressed', 'true');
    label.textContent = cams[cur].dataset.label;
    set.classList.remove('cutting'); void set.offsetWidth; set.classList.add('cutting');
    if (user) { auto = false; clearInterval(timer); }
  };
  cams.forEach((b, i) => b.addEventListener('click', () => cut(i, true)));
  // horizontal swipe on the picture (vertical swipes keep scrolling the page: touch-action: pan-y)
  let x0 = null, y0 = 0;
  const shotsEl = $('[data-shots]', set);
  shotsEl.addEventListener('pointerdown', e => { x0 = e.clientX; y0 = e.clientY; });
  shotsEl.addEventListener('pointerup', e => { if (x0 == null) return; const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) cut(cur + (dx < 0 ? 1 : -1), true); });
  shotsEl.addEventListener('pointercancel', () => { x0 = null; });
  // warm the other shots once the first one is on screen
  addEventListener('load', () => $$('img', set).forEach(im => { if (!im.complete) im.decode?.().catch(() => {}); }));
  if (auto) timer = setInterval(() => { if (!document.hidden && auto) cut(cur + 1); }, 5200);
  // running timecode, 24 fps
  const t0 = performance.now(), pad = n => String(n).padStart(2, '0');
  let visible = true; seen([set], e => { visible = e.isIntersecting; }, { threshold: 0 });
  const tick = now => { if (visible) { const f = Math.floor((now - t0) / (1000 / 24)), s = Math.floor(f / 24); tc.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f % 24)}`; } requestAnimationFrame(tick); };
  if (!still) requestAnimationFrame(tick);
}

/* ---------- reveal on scroll ---------- */
seen($$('.rv'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .15 });

/* ---------- products: see inside (x-ray or blueprint) ---------- */
$$('[data-xr]').forEach(fig => {
  const card = fig.closest('.xc'), btn = $('.xr-btn', card), lab = $('span', btn);
  let touched = false, loop = null;
  const set = open => {
    if (fig.classList.contains('open') === open) return;
    fig.classList.add('moving'); fig.classList.toggle('open', open);
    btn.setAttribute('aria-pressed', String(open)); lab.textContent = open ? btn.dataset.on : btn.dataset.off;
    clearTimeout(fig._mv); fig._mv = setTimeout(() => fig.classList.remove('moving'), 1650);
  };
  btn.addEventListener('click', () => { touched = true; clearInterval(loop); set(!fig.classList.contains('open')); });
  fig.addEventListener('click', () => { touched = true; clearInterval(loop); set(!fig.classList.contains('open')); });
  if (still) return;
  // like a Reel: when a card is on screen it scans itself, inside then outside, until someone taps it
  seen([fig], e => {
    clearInterval(loop);
    if (!e.isIntersecting || touched) return;
    setTimeout(() => !touched && set(true), 500);
    loop = setInterval(() => { if (!touched) set(!fig.classList.contains('open')); }, 3600);
  }, { threshold: .6 });
});

/* ---------- ads: tabs ↔ native swipe reel ---------- */
const reel = $('[data-aud]'), tabs = $$('[data-tab]');
if (reel) {
  const slides = $$('.ad-slide', reel);
  const select = i => tabs.forEach((t, j) => t.setAttribute('aria-selected', String(i === j)));
  tabs.forEach((t, i) => t.addEventListener('click', () => { const s = slides[i]; reel.scrollTo({ left: s.offsetLeft - parseFloat(getComputedStyle(reel).scrollPaddingLeft || 0), behavior: still ? 'auto' : 'smooth' }); select(i); }));
  seen(slides, e => { if (e.isIntersecting) { e.target.classList.add('seen'); select(+e.target.dataset.slide); } }, { root: reel, threshold: .6 });
  seen([reel], (e, io) => { if (e.isIntersecting) { slides[0].classList.add('seen'); io.disconnect(); } }, { threshold: .3 });
}

/* ---------- films: letterbox and subtitles ---------- */
seen($$('[data-lb]'), (e, io) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }, { threshold: .45 });
$$('[data-kind]').forEach(a => a.addEventListener('click', () => { const r = $(`.kinds input[value="${a.dataset.kind}"]`); if (r) r.checked = true; }));

/* ---------- doors: the link opens right away; the door swings open on the page ---------- */
$$('[data-door]').forEach(d => d.addEventListener('click', () => {
  $$('[data-door].open').forEach(o => o !== d && o.classList.remove('open'));
  d.classList.add('open');
  clearTimeout(d._t); d._t = setTimeout(() => d.classList.remove('open'), 4200);
}));

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
      show('ok', T.form.okTitle, T.form.okText.replace('{email}', body.email)); form.reset();
    } catch { show('error', T.form.errTitle, T.form.errNet); }
    finally { submit.disabled = false; submit.textContent = label; }
  });
}
