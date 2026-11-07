// LAB — three opt-in, working demonstrations.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function initLab(T, { reduce }) {
  realityShift(T);
  motionLanguage(T, reduce);
  storyboard(T);
}

/* A — Reality Shift: the Living Frame engine with every parameter exposed */
function realityShift(T) {
  const box = $('[data-lab="shift"]'); if (!box) return;
  const start = $('[data-start]', box);
  const ctrls = $$('input[type=range]', box);
  ctrls.forEach(c => c.disabled = true);
  start.addEventListener('click', async () => {
    start.closest('.opt-in').remove();
    const { createLivingFrame } = await import('./frame.js');
    const frame = $('.frame', box);
    const lf = createLivingFrame(frame, { src: frame.dataset.src, cropX: .5, interactive: false });
    const [mode, open] = ctrls;
    ctrls.forEach(c => c.disabled = false);
    const out = i => $(`output[for="${ctrls[i].id}"]`, box);
    const sync = () => {
      lf.setOpen(+open.value);
      lf.setModeContinuous(+mode.value);
      const m = +mode.value;
      out(0).textContent = m.toFixed(2) + ' · ' + T.modes[Math.round(m)];
      out(1).textContent = Math.round(+open.value * 100) + '%';
    };
    ctrls.forEach(c => c.addEventListener('input', sync));
    sync();
    mode.focus();
  });
}

/* B — Motion Language: coupled springs you can pull, with stiffness and damping exposed */
function motionLanguage(T, reduce) {
  const box = $('[data-lab="motion"]'); if (!box) return;
  const field = $('.springs', box);
  const [kIn, cIn] = $$('input[type=range]', box);
  const N = 7;
  const nodes = [];
  for (let i = 0; i < N; i++) {
    const bar = document.createElement('div'); bar.className = 'bar';
    const knob = document.createElement('button'); knob.className = 'knob'; knob.type = 'button';
    knob.setAttribute('aria-label', T.lab.knob.replace('{n}', i + 1)); knob.textContent = String(i + 1).padStart(2, '0');
    knob.dataset.cursor = T.lab.drag;
    field.append(bar, knob);
    nodes.push({ bar, knob, y: 0, v: 0, held: false });
  }
  let raf = 0, last = 0;
  const layout = () => {
    const w = field.clientWidth, h = field.clientHeight;
    nodes.forEach((n, i) => {
      const x = w * (i + 1) / (N + 1);
      n.x = x; n.h = h;
      n.bar.style.left = x + 'px';
      n.knob.style.left = x + 'px';
      n.knob.style.top = (h / 2 + n.y) + 'px';
      n.bar.style.transform = `scaleY(${1})`;
      n.bar.style.background = `linear-gradient(to bottom, transparent, var(--steel-dim) ${50 + n.y / h * 100}%, transparent)`;
    });
  };
  const step = now => {
    raf = 0;
    const dt = Math.min(.033, (now - (last || now)) / 1000) || .016; last = now;
    const k = +kIn.value, c = +cIn.value, couple = k * .35;
    let energy = 0;
    nodes.forEach((n, i) => {
      if (n.held) return;
      const l = nodes[i - 1]?.y ?? 0, r = nodes[i + 1]?.y ?? 0;
      const f = -k * n.y - c * n.v + couple * ((l - n.y) + (r - n.y));
      n.v += f * dt; n.y += n.v * dt;
      energy += Math.abs(n.v) + Math.abs(n.y);
    });
    layout();
    if (energy > .05) raf = requestAnimationFrame(step); else last = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
  nodes.forEach((n, i) => {
    n.knob.addEventListener('pointerdown', e => {
      n.held = true; n.knob.setPointerCapture(e.pointerId);
      const top = field.getBoundingClientRect().top;
      const move = ev => { n.y = Math.max(-n.h / 2 + 30, Math.min(n.h / 2 - 30, ev.clientY - top - n.h / 2)); n.v = 0; layout(); kick(); };
      const up = () => { n.held = false; n.knob.removeEventListener('pointermove', move); kick(); };
      n.knob.addEventListener('pointermove', move);
      n.knob.addEventListener('pointerup', up, { once: true });
      n.knob.addEventListener('pointercancel', up, { once: true });
    });
    n.knob.addEventListener('keydown', e => {
      const d = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
      if (e.key === 'ArrowLeft') { nodes[i - 1]?.knob.focus(); e.preventDefault(); return; }
      if (e.key === 'ArrowRight') { nodes[i + 1]?.knob.focus(); e.preventDefault(); return; }
      if (!d) return;
      e.preventDefault(); n.y = d * n.h * .3; n.v = 0; kick();
    });
  });
  const out = (inp, txt) => { $(`output[for="${inp.id}"]`, box).textContent = txt; };
  const sync = () => { out(kIn, kIn.value); out(cIn, cIn.value); kick(); };
  [kIn, cIn].forEach(i => i.addEventListener('input', sync));
  new ResizeObserver(layout).observe(field);
  sync(); layout();
  // a single gentle pluck so the system shows what it does (skipped for reduced motion)
  if (!reduce) new IntersectionObserver(([e], o) => { if (e.isIntersecting) { nodes[2].y = -field.clientHeight * .28; kick(); o.disconnect(); } }, { threshold: .6 }).observe(field);
}

/* C — Playable Product: a small storyboard app with real state */
function storyboard(T) {
  const box = $('[data-lab="board"]'); if (!box) return;
  const list = $('.shots', box), runtime = $('.runtime', box), timeline = $('.timeline', box), count = $('[data-shot-count]', box);
  const addForm = $('.add-shot', box), addInput = $('input', addForm), resetBtn = $('[data-reset]', box), live = $('[data-live]', box);
  const KEY = 'vt-lab-board';
  const defaults = () => T.lab.defaults.map((t, i) => ({ id: crypto.randomUUID?.() || String(Date.now() + i), title: t[0], sec: t[1] }));
  let shots;
  try { shots = JSON.parse(localStorage.getItem(KEY)) || defaults(); } catch { shots = defaults(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(shots)); } catch { /* storage unavailable */ } };
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  let dragId = null;

  const render = (focusId, focusSel = 'input') => {
    list.innerHTML = '';
    shots.forEach((s, i) => {
      const li = document.createElement('li'); li.className = 'shot'; li.dataset.id = s.id; li.draggable = false;
      const grip = document.createElement('button'); grip.type = 'button'; grip.className = 'grip'; grip.textContent = String(i + 1).padStart(2, '0');
      grip.setAttribute('aria-label', T.lab.move.replace('{n}', i + 1)); grip.dataset.cursor = T.lab.drag;
      const title = document.createElement('input'); title.type = 'text'; title.value = s.title; title.setAttribute('aria-label', T.lab.shotTitle.replace('{n}', i + 1)); title.maxLength = 60;
      const sel = document.createElement('select'); sel.setAttribute('aria-label', T.lab.duration.replace('{n}', i + 1));
      [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30].forEach(v => { const o = new Option(v + ' s', v, false, v === s.sec); sel.add(o); });
      const x = document.createElement('button'); x.type = 'button'; x.className = 'x'; x.textContent = '×'; x.setAttribute('aria-label', T.lab.remove.replace('{n}', i + 1));
      title.addEventListener('input', () => { s.title = title.value; save(); });
      sel.addEventListener('change', () => { s.sec = +sel.value; save(); totals(); });
      x.addEventListener('click', () => {
        const next = shots[i + 1]?.id || shots[i - 1]?.id;
        shots.splice(i, 1); save(); render(next, '.x'); announce(T.lab.removed);
        if (!next) addInput.focus();
      });
      grip.addEventListener('keydown', e => {
        const d = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
        if (!d || !shots[i + d]) return;
        e.preventDefault(); [shots[i], shots[i + d]] = [shots[i + d], shots[i]]; save(); render(s.id, '.grip');
        announce(T.lab.moved.replace('{n}', i + d + 1));
      });
      grip.addEventListener('pointerdown', e => {
        dragId = s.id; li.classList.add('is-dragging'); grip.setPointerCapture(e.pointerId);
        const move = ev => {
          const over = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.shot');
          $$('.shot', list).forEach(el => el.classList.toggle('is-over', el === over && el !== li));
        };
        const up = ev => {
          grip.removeEventListener('pointermove', move);
          const over = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.shot');
          if (over && over.dataset.id !== dragId) {
            const from = shots.findIndex(q => q.id === dragId), to = shots.findIndex(q => q.id === over.dataset.id);
            const [m] = shots.splice(from, 1); shots.splice(to, 0, m); save();
          }
          dragId = null; render();
        };
        grip.addEventListener('pointermove', move);
        grip.addEventListener('pointerup', up, { once: true });
      });
      li.append(grip, title, sel, x); list.append(li);
    });
    totals();
    if (focusId) $(`.shot[data-id="${focusId}"] ${focusSel}`, list)?.focus();
  };
  const totals = () => {
    const sum = shots.reduce((a, s) => a + s.sec, 0);
    runtime.textContent = fmt(sum);
    count.textContent = T.lab.shots.replace('{n}', shots.length);
    timeline.innerHTML = '';
    shots.forEach(s => { const sp = document.createElement('span'); sp.style.flexGrow = s.sec; sp.title = `${s.title} · ${s.sec} s`; timeline.append(sp); });
  };
  const announce = msg => { live.textContent = ''; requestAnimationFrame(() => live.textContent = msg); };
  addForm.addEventListener('submit', e => {
    e.preventDefault();
    const t = addInput.value.trim(); if (!t) { addInput.focus(); return; }
    shots.push({ id: crypto.randomUUID?.() || String(Date.now()), title: t.slice(0, 60), sec: 3 });
    save(); addInput.value = ''; render(); announce(T.lab.added); addInput.focus();
  });
  resetBtn.addEventListener('click', () => { shots = defaults(); save(); render(); announce(T.lab.resetDone); });
  render();
}
