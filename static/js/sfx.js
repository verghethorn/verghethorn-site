// Synthesised cinema sounds — no audio files. Starts on the first tap (browsers require a gesture).
let ctx = null, master = null, noiseBuf = null;
let muted = false, armed = false;
for (const ev of ['pointerdown', 'keydown']) addEventListener(ev, () => { armed = true; }, { capture: true, passive: true });
try { muted = localStorage.getItem('vt-mute') === '1'; } catch {}

function init() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
  ctx = new AC(); master = ctx.createGain(); master.gain.value = .55;
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 6;
  master.connect(comp).connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return true;
}
const now = () => ctx.currentTime;
function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
function noise(t, dur, { type = 'lowpass', f = 1000, f2 = null, q = 1, peak = .6, a = .003 } = {}) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf; const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = ctx.createGain(); env(g, t, a, peak, dur); s.connect(fl).connect(g).connect(master); s.start(t, Math.random()); s.stop(t + a + dur + .05);
}
function tone(t, dur, { type = 'sine', f = 440, f2 = null, peak = .4, a = .004 } = {}) {
  const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  const g = ctx.createGain(); env(g, t, a, peak, dur); o.connect(g).connect(master); o.start(t); o.stop(t + a + dur + .05);
}

const S = {
  clap() { const t = now(); noise(t, .09, { type: 'highpass', f: 1800, peak: .9 }); tone(t, .05, { type: 'square', f: 1400, f2: 500, peak: .15 }); noise(t + .012, .14, { type: 'bandpass', f: 2500, q: .8, peak: .35 }); },
  boom() { const t = now(); tone(t, .9, { f: 120, f2: 32, peak: .95 }); noise(t, .7, { f: 900, f2: 60, peak: .9 }); noise(t, .12, { type: 'highpass', f: 3000, peak: .3 }); },
  zap() { const t = now(); for (let i = 0; i < 6; i++) noise(t + i * .035 + Math.random() * .02, .05, { type: 'highpass', f: 2500 + Math.random() * 3000, peak: .5 }); tone(t, .35, { type: 'sawtooth', f: 900, f2: 60, peak: .12 }); noise(t + .1, .9, { f: 400, f2: 80, peak: .5 }); },
  whoosh() { const t = now(); noise(t, .55, { type: 'bandpass', f: 300, f2: 4000, q: 1.4, peak: .55, a: .15 }); },
  swoosh() { const t = now(); noise(t, .45, { type: 'bandpass', f: 3500, f2: 400, q: 1.2, peak: .5, a: .05 }); },
  shutter() { const t = now(); noise(t, .03, { type: 'highpass', f: 2000, peak: .8 }); tone(t, .03, { type: 'square', f: 900, peak: .12 }); noise(t + .09, .04, { type: 'highpass', f: 1500, peak: .7 }); tone(t + .09, .03, { type: 'square', f: 600, peak: .1 }); },
  glitch() { const t = now(); for (let i = 0; i < 9; i++) tone(t + i * .03, .025, { type: 'square', f: 80 + Math.random() * 1600, peak: .18 }); },
  drop() { const t = now(); tone(t, .8, { type: 'sine', f: 220, f2: 38, peak: .95 }); tone(t, .8, { type: 'sawtooth', f: 110, f2: 30, peak: .12 }); },
  warp() { const t = now(); tone(t, .7, { type: 'sawtooth', f: 80, f2: 1800, peak: .12, a: .2 }); noise(t, .8, { type: 'bandpass', f: 200, f2: 6000, q: 2, peak: .35, a: .3 }); },
  rain() { const t = now(); noise(t, 1.6, { type: 'bandpass', f: 4500, q: .6, peak: .28, a: .25 }); for (let i = 0; i < 10; i++) tone(t + Math.random() * 1.4, .03, { f: 1800 + Math.random() * 2500, peak: .05 }); },
  snow() { const t = now(); [1568, 1760, 2093, 2637, 3136].forEach((f, i) => tone(t + i * .09, .5, { f, peak: .09 })); },
  confetti() { const t = now(); noise(t, .06, { type: 'highpass', f: 1200, peak: .7 }); [523, 659, 784, 1047, 1319].forEach((f, i) => tone(t + .05 + i * .05, .25, { type: 'triangle', f, peak: .14 })); },
  slowmo() { const t = now(); tone(t, 1.1, { type: 'sawtooth', f: 300, f2: 40, peak: .14 }); noise(t, 1, { f: 1200, f2: 100, peak: .3 }); },
  tick() { const t = now(); tone(t, .02, { type: 'square', f: 2200, peak: .06 }); },
  key() { const t = now(); noise(t, .025, { type: 'highpass', f: 3000 + Math.random() * 1500, peak: .18 }); },
  ding() { const t = now(); tone(t, .6, { f: 1318, peak: .22 }); tone(t + .08, .7, { f: 1976, peak: .14 }); },
  pop() { const t = now(); tone(t, .08, { f: 900, f2: 300, peak: .3 }); },
  power() { const t = now(); tone(t, .5, { type: 'sine', f: 60, f2: 220, peak: .5, a: .02 }); noise(t + .3, .3, { type: 'bandpass', f: 1200, q: 2, peak: .3 }); },
};

export function sfx(name) { if (muted || !armed) return; if (!init()) return; try { S[name]?.(); } catch {} }
export const isMuted = () => muted;
export function setMuted(m) { muted = m; try { localStorage.setItem('vt-mute', m ? '1' : '0'); } catch {} if (!m) init(); }
export function unlock() { if (!muted) init(); }
