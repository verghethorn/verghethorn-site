// VERGHÉTHORN — shared behaviour. Every enhancement is optional: the site works without this file.
const T = JSON.parse(document.getElementById('i18n')?.textContent || '{}');
const LANG = document.documentElement.lang || 'en';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const saveData = navigator.connection?.saveData === true;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
};

/* ---------- header ---------- */
const header = $('.site-header');
const onScroll = () => header?.classList.toggle('is-solid', scrollY > 24 || !!$('.nav.is-open'));
addEventListener('scroll', onScroll, { passive: true }); onScroll();

const menuBtn = $('.menu-btn'), nav = $('#site-nav');
if (menuBtn && nav) {
  const close = () => { nav.classList.remove('is-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.textContent = T.menu; onScroll(); };
  menuBtn.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? T.close : T.menu;
    onScroll();
    if (open) nav.querySelector('a')?.focus();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { close(); menuBtn.focus(); } });
  matchMedia('(min-width: 861px)').addEventListener('change', close);
}

/* ---------- language: remember the reader's choice ---------- */
$$('[data-lang-link]').forEach(a => a.addEventListener('click', () => store.set('vt-lang', a.dataset.langLink)));
if (LANG === 'en' && location.pathname === '/' && store.get('vt-lang') === 'ru' && !document.referrer.startsWith(location.origin)) {
  location.replace('/ru/');
}

/* ---------- reveal fallback (browsers without scroll-driven animations) ---------- */
if (!CSS.supports('animation-timeline: view()') && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
} else { $$('.reveal').forEach(el => el.classList.add('is-in')); }

/* ---------- living cursor ---------- */
if (fine && !reduce) {
  const c = document.createElement('div');
  c.className = 'cursor'; c.setAttribute('aria-hidden', 'true'); c.innerHTML = '<span></span>';
  document.body.appendChild(c);
  const label = c.firstChild;
  let x = -100, y = -100, cx = x, cy = y, raf = 0;
  const tick = () => { cx += (x - cx) * .22; cy += (y - cy) * .22; c.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; raf = (Math.abs(x - cx) + Math.abs(y - cy) > .3) ? requestAnimationFrame(tick) : 0; };
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY; c.classList.add('is-visible');
    const t = e.target.closest?.('[data-cursor]');
    const txt = t ? t.dataset.cursor : '';
    if (label.textContent !== txt) label.textContent = txt;
    c.classList.toggle('has-label', !!txt);
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  document.addEventListener('pointerleave', () => c.classList.remove('is-visible'));
}

/* ---------- hero: the Living Frame ---------- */
const hero = $('[data-living-frame]');
if (hero) {
  const spots = JSON.parse(hero.dataset.spots || '[]');
  const shiftBtns = $$('.shift-track [role="radio"]');
  const thumb = $('.shift-thumb');
  const meta = $('[data-frame-meta]');
  const tc = $('[data-timecode]');
  const reflect = m => {
    shiftBtns.forEach((b, i) => { b.setAttribute('aria-checked', String(i === m)); b.tabIndex = i === m ? 0 : -1; });
    thumb?.style.setProperty('--i', m);
    if (meta) meta.textContent = T.frameMeta[m];
  };
  let lf = null;
  const ui = $('.frame-ui', hero); if (ui) ui.inert = true;
  import('./frame.js').then(({ createLivingFrame }) => {
    lf = createLivingFrame(hero, { src: hero.dataset.src, cropX: .5, hotspots: spots, autoOpen: 2400, webgl: !saveData });
    lf.onMode(reflect);
    $$('[data-spot]', hero).forEach(a => {
      const i = +a.dataset.spot;
      a.addEventListener('pointerenter', () => lf.setFocus(i));
      a.addEventListener('focus', () => lf.setFocus(i));
      a.addEventListener('pointerleave', () => lf.setFocus(null));
      a.addEventListener('blur', () => lf.setFocus(null));
    });
  });
  shiftBtns.forEach((b, i) => {
    b.addEventListener('click', () => { lf?.setMode(i); reflect(i); });
    b.addEventListener('keydown', e => {
      const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = (i + d + 3) % 3;
      shiftBtns[n].focus(); lf?.setMode(n); reflect(n);
    });
  });
  // a quiet timecode that only runs while the hero is on screen
  if (tc && !reduce) {
    let start = performance.now(), on = true;
    new IntersectionObserver(([e]) => on = e.isIntersecting).observe(hero);
    const fmt = n => String(n).padStart(2, '0');
    setInterval(() => {
      if (!on || document.hidden) return;
      const f = Math.floor((performance.now() - start) / (1000 / 24));
      tc.textContent = `TC ${fmt(Math.floor(f / 86400))}:${fmt(Math.floor(f / 1440) % 60)}:${fmt(Math.floor(f / 24) % 60)}:${fmt(f % 24)}`;
    }, 1000 / 12);
  }
}

/* ---------- media previews: play muted clips only while visible ---------- */
$$('video[data-preview]').forEach(v => {
  if (reduce || saveData) { v.removeAttribute('autoplay'); return; }
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); }
    else v.pause();
  }, { rootMargin: '120px' });
  io.observe(v);
});

/* ---------- work filter ---------- */
const filter = $('[data-filter]');
if (filter) {
  const rows = $$('[data-cats]');
  const empty = $('[data-empty]');
  const apply = cat => {
    let shown = 0;
    rows.forEach(r => { const ok = cat === 'all' || r.dataset.cats.split(' ').includes(cat); r.hidden = !ok; if (ok) shown++; });
    $$('button', filter).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    if (empty) { empty.hidden = shown > 0; const n = $('[data-empty-name]', empty); if (n) n.textContent = $(`button[data-cat="${cat}"] .label`, filter)?.textContent || ''; }
    $('[data-result-count]').textContent = T.shown.replace('{n}', shown);
  };
  $$('button', filter).forEach(b => b.addEventListener('click', () => {
    const cat = b.dataset.cat; apply(cat);
    history.replaceState(null, '', cat === 'all' ? location.pathname : '#' + cat);
  }));
  const fromHash = location.hash.slice(1);
  apply($(`button[data-cat="${fromHash}"]`, filter) ? fromHash : 'all');
}

/* ---------- case player ---------- */
$$('[data-player]').forEach(p => {
  const v = $('video', p), btn = $('[data-play]', p), big = $('.player-big', p), bar = $('input[type=range]', p), time = $('time', p);
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const icon = playing => playing ? '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" fill="currentColor"/><rect x="8.5" y="1" width="3.5" height="12" fill="currentColor"/></svg>'
                                  : '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor"/></svg>';
  const sync = () => {
    const playing = !v.paused && !v.ended;
    p.classList.toggle('is-playing', playing);
    btn.innerHTML = icon(playing);
    btn.setAttribute('aria-label', playing ? T.pause : T.play);
  };
  const toggle = () => { v.paused || v.ended ? v.play() : v.pause(); };
  btn.addEventListener('click', toggle); big.addEventListener('click', toggle);
  v.addEventListener('click', toggle);
  v.addEventListener('play', sync); v.addEventListener('pause', sync); v.addEventListener('ended', sync);
  v.addEventListener('loadedmetadata', () => { bar.max = v.duration; time.textContent = `0:00 / ${fmt(v.duration)}`; });
  v.addEventListener('timeupdate', () => { bar.value = v.currentTime; time.textContent = `${fmt(v.currentTime)} / ${fmt(v.duration || 0)}`; });
  bar.addEventListener('input', () => { v.currentTime = +bar.value; });
  sync();
});

/* ---------- Living Shapes: hero explorer ---------- */
const explorer = $('[data-heroes]');
if (explorer) {
  const stage = $('.heroes-stage', explorer);
  const btns = $$('[data-hero]', explorer);
  const caption = $('[data-hero-caption]', explorer);
  const pick = (b, push = true) => {
    const on = b && b.getAttribute('aria-pressed') !== 'true';
    btns.forEach(x => x.setAttribute('aria-pressed', String(on && x === b)));
    if (on) {
      stage.style.setProperty('--fx', b.dataset.x + '%'); stage.style.setProperty('--fy', b.dataset.y + '%');
      stage.style.setProperty('--z', matchMedia('(max-width: 860px)').matches ? 2.2 : 2.6);
      stage.style.setProperty('--r', '9%');
      caption.textContent = b.dataset.caption;
      if (push) history.replaceState(null, '', '#' + b.dataset.hero);
    } else {
      stage.style.setProperty('--z', 1); stage.style.setProperty('--r', '100%');
      caption.textContent = caption.dataset.default;
      if (push) history.replaceState(null, '', location.pathname);
    }
  };
  btns.forEach(b => b.addEventListener('click', () => pick(b)));
  const h = location.hash.slice(1); const pre = btns.find(b => b.dataset.hero === h); if (pre) pick(pre, false);
}

/* ---------- UseFive: playable prototype ---------- */
const proto = $('[data-proto]');
if (proto) {
  const imgs = { brother: $('img[data-agent="brother"]', proto), sister: $('img[data-agent="sister"]', proto) };
  const segBtns = $$('.seg button', proto), speak = $('.speak', proto), state = $('.state', proto), canvas = $('canvas.wave', proto);
  const audio = new Audio(); audio.preload = 'none'; audio.src = proto.dataset.voice;
  let agent = 'brother', ctx, analyser, data, raf = 0;
  const setState = k => { state.textContent = T.proto[k]; proto.dataset.state = k; };
  const draw = () => {
    const c = canvas.getContext('2d'), w = canvas.width = canvas.clientWidth * devicePixelRatio, h = canvas.height = canvas.clientHeight * devicePixelRatio;
    c.clearRect(0, 0, w, h);
    if (analyser) analyser.getByteFrequencyData(data);
    const bars = 48, bw = w / bars;
    for (let i = 0; i < bars; i++) {
      const j = Math.abs(i - (bars - 1) / 2) / (bars / 2); // mirrored from the centre
      const v = analyser ? data[Math.floor(4 + j * 90)] / 255 : 0;
      const bh = Math.max(2 * devicePixelRatio, Math.pow(v, 1.4) * h * .95);
      c.fillStyle = 'rgba(126, 200, 255, .9)';
      c.fillRect(i * bw + bw * .3, (h - bh) / 2, bw * .4, bh);
    }
    if (!audio.paused) raf = requestAnimationFrame(draw); else { raf = 0; c.clearRect(0, 0, w, h); }
  };
  const choose = a => {
    agent = a;
    segBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.agent === a)));
    Object.entries(imgs).forEach(([k, el]) => el.hidden = k !== a);
    audio.pause(); audio.currentTime = 0;
    const ready = a === 'brother';
    speak.disabled = !ready; speak.setAttribute('aria-pressed', 'false');
    speak.lastChild.textContent = ready ? T.proto.listen : T.proto.unavailable;
    setState(ready ? 'idle' : 'pending');
  };
  segBtns.forEach(b => b.addEventListener('click', () => choose(b.dataset.agent)));
  speak.addEventListener('click', async () => {
    if (!audio.paused) { audio.pause(); return; }
    try {
      if (!ctx) {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = ctx.createMediaElementSource(audio); analyser = ctx.createAnalyser(); analyser.fftSize = 512;
        data = new Uint8Array(analyser.frequencyBinCount); analyser.smoothingTimeConstant = .7; src.connect(analyser); analyser.connect(ctx.destination);
      }
      await ctx.resume();
      setState('loading');
      await audio.play();
    } catch { setState('error'); }
  });
  audio.addEventListener('playing', () => { setState('speaking'); speak.setAttribute('aria-pressed', 'true'); speak.lastChild.textContent = T.proto.stop; if (!raf) draw(); });
  audio.addEventListener('pause', () => { if (proto.dataset.state === 'speaking') setState('idle'); speak.setAttribute('aria-pressed', 'false'); if (agent === 'brother') speak.lastChild.textContent = T.proto.listen; });
  audio.addEventListener('ended', () => setState('done'));
  choose('brother');
}

/* ---------- contact form: real submission to the inquiries backend ---------- */
const form = $('form[data-inquiry]');
if (form) {
  const statusEl = $('[data-form-status]');
  const submit = $('button[type=submit]', form);
  const opened = Date.now();
  const rules = {
    name: v => v.trim().length ? '' : T.form.errName,
    email: v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? '' : T.form.errEmail,
    category: v => v ? '' : T.form.errCategory,
    message: v => v.trim().length >= 10 ? '' : T.form.errMessage,
  };
  const check = (el, show) => {
    const msg = rules[el.name]?.(el.value) ?? '';
    const field = el.closest('.field'), err = $('.error', field);
    if (show || field.classList.contains('is-invalid')) {
      field.classList.toggle('is-invalid', !!msg); err.textContent = msg; el.setAttribute('aria-invalid', String(!!msg));
    }
    return !msg;
  };
  $$('input, select, textarea', form).forEach(el => {
    if (!rules[el.name]) return;
    el.addEventListener('blur', () => { if (el.value) check(el, true); });
    el.addEventListener('input', () => check(el, false));
  });
  // keep an unsent draft in this browser only
  const draftKey = 'vt-inquiry-draft';
  try { const d = JSON.parse(store.get(draftKey) || '{}'); Object.entries(d).forEach(([k, v]) => { if (form.elements[k] && !form.elements[k].value) form.elements[k].value = v; }); } catch { /* ignore */ }
  form.addEventListener('input', () => {
    const d = {}; ['name', 'email', 'category', 'message'].forEach(k => d[k] = form.elements[k].value); store.set(draftKey, JSON.stringify(d));
  });
  const show = (kind, title, text) => {
    statusEl.hidden = false; statusEl.dataset.kind = kind;
    statusEl.innerHTML = ''; const s = document.createElement('strong'); s.textContent = title; const p = document.createElement('p'); p.textContent = text;
    statusEl.append(s, p); statusEl.focus();
  };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fields = $$('input, select, textarea', form).filter(el => rules[el.name]);
    const bad = fields.filter(el => !check(el, true));
    if (bad.length) { bad[0].focus(); return; }
    if (form.elements.website.value || Date.now() - opened < 2500) {
      show('error', T.form.errTitle, T.form.errBot); return;
    }
    submit.disabled = true; const label = submit.firstChild.textContent; submit.firstChild.textContent = T.form.sending;
    const body = {
      name: form.elements.name.value.trim().slice(0, 120),
      email: form.elements.email.value.trim().slice(0, 200),
      category: form.elements.category.value,
      message: form.elements.message.value.trim().slice(0, 4000),
      lang: LANG, page: location.pathname.slice(0, 200),
    };
    try {
      const r = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: form.dataset.key, Prefer: 'return=minimal' },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error(String(r.status));
      show('ok', T.form.okTitle, T.form.okText.replace('{email}', body.email));
      form.reset(); store.set(draftKey, '{}');
    } catch {
      show('error', T.form.errTitle, T.form.errNet);
    } finally { submit.disabled = false; submit.firstChild.textContent = label; }
  });
}

/* ---------- lab (opt-in, loaded on demand) ---------- */
if ($('[data-lab]')) import('./lab.js').then(m => m.initLab(T, { reduce }));
