// Tiny synthesized sound kit — no audio files. Plays only after a click or tap.
let ctx = null, master = null;
let muted = (() => { try { return localStorage.getItem('vt-sound') === 'off'; } catch { return false; } })();

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = .5; master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
function tone(freq, dur, { type = 'sine', gain = .2, attack = .005, at = 0, glide = 0 } = {}) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + attack); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g).connect(master); o.start(t); o.stop(t + dur + .02);
}
function noise(dur, { gain = .2, from = 800, to = 3000, q = 1, at = 0, type = 'bandpass' } = {}) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + at, len = Math.ceil(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + dur * .2); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  src.connect(f).connect(g).connect(master); src.start(t); src.stop(t + dur + .02);
}

const KIT = {
  tick: () => tone(1800, .05, { type: 'triangle', gain: .06 }),
  tap: () => tone(520, .09, { gain: .05, glide: .7 }),
  pick: () => { tone(660, .08, { gain: .08 }); tone(990, .1, { gain: .05, at: .03 }); },
  whoosh: () => noise(.35, { gain: .12, from: 400, to: 2600, q: .8 }),
  shutter: () => { noise(.04, { gain: .25, from: 3000, to: 1500, q: .6 }); noise(.05, { gain: .2, from: 2000, to: 900, q: .6, at: .07 }); tone(110, .08, { type: 'square', gain: .03, at: .07 }); },
  cut: () => { noise(.03, { gain: .2, from: 5000, to: 2000 }); tone(1200, .05, { type: 'triangle', gain: .04 }); },
  door: () => { noise(.7, { gain: .08, from: 180, to: 520, q: 6, type: 'bandpass' }); tone(74, .5, { gain: .08, glide: 1.3 }); [784, 1175, 1568].forEach((f, i) => tone(f, .9, { gain: .07, at: .25 + i * .06 })); },
  chime: () => [988, 1319].forEach((f, i) => tone(f, .7, { gain: .08, at: i * .08 })),
};

export function sfx(name) { if (muted) return; try { KIT[name]?.(); } catch { /* audio not available */ } }
export function isMuted() { return muted; }
export function setMuted(v) { muted = v; try { localStorage.setItem('vt-sound', v ? 'off' : 'on'); } catch { /* ignore */ } if (!v) sfx('chime'); }
