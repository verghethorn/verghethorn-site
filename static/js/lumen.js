// LUMEN — a field of light that takes any form.
// Tens of thousands of GPU particles morph between words and shapes (film, website, app, voice, idea).
// WebGL1-compatible; the page works fully without it.

const VERT = `
precision highp float;
attribute vec3 aA;
attribute vec3 aB;
attribute vec4 aR;
uniform float uMix, uTime, uScale, uAspect, uDpr, uTurb, uSize, uPointerOn, uIdle, uGlow;
uniform vec3 uAccent;
uniform vec2 uPointer, uOffset, uRot;
varying vec3 vColor;
varying float vAlpha;
void main(){
  float t = clamp(uMix * 1.55 - aR.x * .55, 0., 1.);
  t = t * t * (3. - 2. * t);
  vec3 p = mix(aA, aB, t);
  float swirl = sin(t * 3.14159);
  float ph = aR.w * 6.2831;
  vec3 n = vec3(sin(p.y * 3.1 + uTime * .55 + ph), sin(p.z * 2.7 + uTime * .45 + ph * .7), sin(p.x * 2.9 + uTime * .62 + ph * 1.3));
  p += n * (swirl * .42 * uTurb + .006 + .012 * uIdle);
  float cy = cos(uRot.x), sy = sin(uRot.x);
  p.xz = mat2(cy, -sy, sy, cy) * p.xz;
  float cx = cos(uRot.y), sx = sin(uRot.y);
  p.yz = mat2(cx, -sx, sx, cx) * p.yz;
  float persp = 1. / (1. - p.z * .28);
  vec2 sp = p.xy * uScale * persp;
  sp.x /= uAspect;
  sp += uOffset;
  vec2 d = sp - uPointer; d.x *= uAspect;
  float dist = length(d);
  float push = uPointerOn * .085 * exp(-dist * dist * 30.);
  sp += (d / max(dist, 1e-4)) * push * vec2(1. / uAspect, 1.);
  gl_Position = vec4(sp, 0., 1.);
  gl_PointSize = uSize * uDpr * aR.y * persp * (1. + swirl * .5) * mix(1., 7., uGlow);
  vec3 ivory = vec3(.945, .933, .91), bronze = vec3(.86, .7, .48), steel = vec3(.62, .69, .8);
  vColor = aR.z > .9 ? bronze : (aR.z > .7 ? mix(steel, uAccent, .85) : ivory);
  vAlpha = (.62 + .38 * clamp(p.z + .5, 0., 1.)) * (1. + push * 6.) * mix(1., .028, uGlow);
}`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - .5;
  float r = dot(c, c);
  float a = smoothstep(.25, .0, r) * vAlpha;
  gl_FragColor = vec4(vColor * a, a);
}`;

const S = 360; // sampling canvas size
const rand = (() => { let s = 1234567; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

function sample(draw, count, { depth = .12, aspect = 1 } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineCap = 'round'; g.lineJoin = 'round';
  draw(g, S);
  const data = g.getImageData(0, 0, S, S).data;
  const pts = [];
  for (let y = 0; y < S; y += 1) for (let x = 0; x < S; x += 1) if (data[(y * S + x) * 4 + 3] > 120) pts.push(x, y);
  const out = new Float32Array(count * 3);
  const n = pts.length / 2 || 1;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(rand() * n) * 2;
    out[i * 3] = ((pts[k] + rand()) / S - .5) * 2 * aspect;
    out[i * 3 + 1] = -((pts[k + 1] + rand()) / S - .5) * 2;
    out[i * 3 + 2] = (rand() - .5) * depth * 2;
  }
  return out;
}

const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

const SHAPES = {
  sphere(count) {
    const out = new Float32Array(count * 3);
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const shell = rand() < .82;
      const y = 1 - (i / (count - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * i;
      const R = shell ? .78 + (rand() - .5) * .03 : rand() * .7;
      out[i * 3] = Math.cos(th) * rad * R; out[i * 3 + 1] = y * R; out[i * 3 + 2] = Math.sin(th) * rad * R;
    }
    return out;
  },
  film: count => sample((g, s) => {
    g.lineWidth = s * .034;
    rr(g, s * .17, s * .4, s * .66, s * .44, s * .03); g.stroke();
    g.save(); g.translate(s * .17, s * .4); g.rotate(-.24);
    rr(g, 0, -s * .13, s * .66, s * .11, s * .02); g.stroke();
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(s * (.06 + i * .13), -s * .125); g.lineTo(s * (.12 + i * .13), -s * .025); g.stroke(); }
    g.restore();
    for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(s * (.23 + i * .13), s * .41); g.lineTo(s * (.29 + i * .13), s * .5); g.stroke(); }
    g.beginPath(); g.moveTo(s * .17, s * .5); g.lineTo(s * .83, s * .5); g.stroke();
    g.lineWidth = s * .02;
    [.6, .68, .76].forEach((y, i) => { g.beginPath(); g.moveTo(s * .26, s * y); g.lineTo(s * (.56 - i * .08), s * y); g.stroke(); });
  }, count, { depth: .1 }),
  web: count => sample((g, s) => {
    g.lineWidth = s * .03;
    rr(g, s * .08, s * .2, s * .84, s * .6, s * .03); g.stroke();
    g.beginPath(); g.moveTo(s * .08, s * .29); g.lineTo(s * .92, s * .29); g.stroke();
    [.13, .17, .21].forEach(x => { g.beginPath(); g.arc(s * x, s * .245, s * .012, 0, 7); g.fill(); });
    rr(g, s * .14, s * .36, s * .4, s * .24, s * .015); g.fill();
    g.lineWidth = s * .022;
    [.39, .46, .53].forEach((y, i) => { g.beginPath(); g.moveTo(s * .6, s * y); g.lineTo(s * (.85 - i * .06), s * y); g.stroke(); });
    [.14, .41, .68].forEach(x => { rr(g, s * x, s * .65, s * .18, s * .09, s * .012); g.fill(); });
  }, count, { depth: .12 }),
  app: count => sample((g, s) => {
    g.lineWidth = s * .03;
    rr(g, s * .3, s * .06, s * .4, s * .88, s * .07); g.stroke();
    rr(g, s * .44, s * .1, s * .12, s * .025, s * .012); g.fill();
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { rr(g, s * (.355 + c * .1), s * (.2 + r * .1), s * .07, s * .07, s * .018); g.fill(); }
    rr(g, s * .355, s * .66, s * .29, s * .13, s * .025); g.fill();
    g.lineWidth = s * .02; g.beginPath(); g.moveTo(s * .44, s * .88); g.lineTo(s * .56, s * .88); g.stroke();
  }, count, { depth: .14 }),
  voice: count => sample((g, s) => {
    const N = 15, w = s * .03;
    for (let i = 0; i < N; i++) {
      const u = (i - (N - 1) / 2) / ((N - 1) / 2);
      const h = s * (.06 + .5 * Math.exp(-u * u * 3.2) * (.55 + .45 * Math.abs(Math.sin(i * 1.7))));
      rr(g, s * .5 + u * s * .44 - w / 2, s * .5 - h / 2, w, h, w / 2); g.fill();
    }
  }, count, { depth: .2 }),
};

function textShape(text, count, font) {
  text = String(text).trim().slice(0, 18) || ' ';
  const c = document.createElement('canvas');
  const g = c.getContext('2d', { willReadFrequently: true });
  const fs = 120;
  g.font = `600 ${fs}px ${font}`;
  const m = g.measureText(text);
  const w = Math.ceil(m.width) + 20, h = Math.ceil(fs * 1.3);
  c.width = w; c.height = h;
  g.font = `600 ${fs}px ${font}`; g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.textAlign = 'center';
  g.fillText(text, w / 2, h / 2);
  const data = g.getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 120) pts.push(x, y);
  const out = new Float32Array(count * 3);
  const n = pts.length / 2 || 1;
  const span = Math.max(w, h * 2.2);
  for (let i = 0; i < count; i++) {
    const k = Math.floor(rand() * n) * 2;
    out[i * 3] = ((pts[k] + rand()) - w / 2) / span * 2.1;
    out[i * 3 + 1] = -((pts[k + 1] + rand()) - h / 2) / span * 2.1;
    out[i * 3 + 2] = (rand() - .5) * .14;
  }
  return out;
}

export function createLumen(canvas, opts = {}) {
  const reduce = !!opts.reduce;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const mem = navigator.deviceMemory || 8;
  const count = opts.count || (coarse || mem <= 4 ? 34000 : 76000);
  const font = opts.font || 'Onest, system-ui, sans-serif';
  let gl;
  try { gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' }); } catch { gl = null; }
  if (!gl) return null;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const U = {}; ['uMix', 'uTime', 'uScale', 'uAspect', 'uDpr', 'uTurb', 'uSize', 'uPointerOn', 'uIdle', 'uPointer', 'uOffset', 'uRot', 'uGlow', 'uAccent'].forEach(n => U[n] = gl.getUniformLocation(prog, n));
  const mkBuf = (name, size, data, usage) => {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    const loc = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    return b;
  };
  const R = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) { R[i * 4] = rand(); R[i * 4 + 1] = .55 + rand() * rand() * 1.6; R[i * 4 + 2] = rand(); R[i * 4 + 3] = rand(); }
  let A = SHAPES.sphere(count), B = A;
  const bufA = mkBuf('aA', 3, A, gl.DYNAMIC_DRAW), bufB = mkBuf('aB', 3, B, gl.DYNAMIC_DRAW);
  mkBuf('aR', 4, R, gl.STATIC_DRAW);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const st = {
    mix: 1, mixT: 1, turb: 0, scale: .5, scaleT: .5, off: [0, 0], offT: [0, 0], rot: [0, 0], rotT: [0, 0],
    pointer: [0, 0], pon: 0, ponT: 0, idle: 1, visible: true, t0: performance.now(), acc: [.86, .7, .48], accT: [.86, .7, .48],
  };
  const cache = new Map();
  const shape = key => {
    if (cache.has(key)) return cache.get(key);
    const v = key.startsWith('text:') ? textShape(key.slice(5), count, font) : SHAPES[key](count);
    cache.set(key, v); return v;
  };
  let raf = 0, last = performance.now(), mixStart = 0, dur = 1700, current = 'sphere';

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, coarse ? 1.6 : 2);
    canvas.width = Math.max(2, Math.round(r.width * dpr)); canvas.height = Math.max(2, Math.round(r.height * dpr));
    st.dpr = dpr; st.aspect = r.width / Math.max(1, r.height);
    kick();
  };

  function currentPositions() {
    const out = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      let t = Math.min(1, Math.max(0, st.mix * 1.55 - R[i * 4] * .55)); t = t * t * (3 - 2 * t);
      out[i * 3] = A[i * 3] + (B[i * 3] - A[i * 3]) * t;
      out[i * 3 + 1] = A[i * 3 + 1] + (B[i * 3 + 1] - A[i * 3 + 1]) * t;
      out[i * 3 + 2] = A[i * 3 + 2] + (B[i * 3 + 2] - A[i * 3 + 2]) * t;
    }
    return out;
  }

  const ACCENT = { film: [.92, .66, .38], web: [.55, .72, 1], app: [.62, .9, .78], voice: [.95, .58, .52], sphere: [.86, .7, .48] };
  function morph(key, { offset, scale } = {}) {
    st.accT = ACCENT[key] || [.86, .7, .48];
    if (offset) st.offT = offset;
    if (scale) st.scaleT = scale;
    if (key.startsWith('text:')) st.scaleT = Math.min(st.scaleT, .86 * (st.aspect || 1));
    if (key === current && st.mix >= 1) { kick(); return; }
    A = st.mix >= 1 ? B : currentPositions();
    B = shape(key); current = key;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufA); gl.bufferData(gl.ARRAY_BUFFER, A, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufB); gl.bufferData(gl.ARRAY_BUFFER, B, gl.DYNAMIC_DRAW);
    st.mix = 0; mixStart = performance.now(); dur = reduce ? 1 : 1800;
    kick();
  }

  function frame(now) {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (st.mix < 1) st.mix = Math.min(1, (now - mixStart) / dur);
    const ease = (a, b, k) => a + (b - a) * Math.min(1, dt * k);
    st.scale = ease(st.scale, st.scaleT, 3.2);
    st.off = [ease(st.off[0], st.offT[0], 3.2), ease(st.off[1], st.offT[1], 3.2)];
    st.pon = ease(st.pon, st.ponT, 5);
    const time = (now - st.t0) / 1000;
    const drift = reduce ? 0 : 1;
    st.rotT = [Math.sin(time * .23) * .22 * drift + st.pointer[0] * .25 * st.pon, Math.sin(time * .17) * .08 * drift - st.pointer[1] * .15 * st.pon];
    st.rot = [ease(st.rot[0], st.rotT[0], 2.4), ease(st.rot[1], st.rotT[1], 2.4)];
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.uMix, st.mix); gl.uniform1f(U.uTime, reduce ? 0 : time);
    gl.uniform1f(U.uScale, st.scale); gl.uniform1f(U.uAspect, st.aspect); gl.uniform1f(U.uDpr, st.dpr);
    gl.uniform1f(U.uTurb, reduce ? 0 : 1); gl.uniform1f(U.uSize, coarse ? 2.1 : 1.85); gl.uniform1f(U.uPointerOn, st.pon);
    gl.uniform1f(U.uIdle, reduce ? 0 : 1);
    gl.uniform2f(U.uPointer, st.pointer[0], st.pointer[1]); gl.uniform2f(U.uOffset, st.off[0], st.off[1]); gl.uniform2f(U.uRot, st.rot[0], st.rot[1]);
    st.acc = st.acc.map((v, i) => ease(v, st.accT[i], 2.5));
    gl.uniform3f(U.uAccent, st.acc[0], st.acc[1], st.acc[2]);
    // soft halo pass (a subset of particles, large and faint), then the crisp pass
    gl.uniform1f(U.uGlow, 1); gl.drawArrays(gl.POINTS, 0, Math.floor(count / 6));
    gl.uniform1f(U.uGlow, 0); gl.drawArrays(gl.POINTS, 0, count);
    if (st.visible && !document.hidden && (!reduce || st.mix < 1 || Math.abs(st.scale - st.scaleT) > 1e-3)) kick();
  }
  function kick() { if (!raf) raf = requestAnimationFrame(frame); }

  const target = opts.pointerTarget || canvas;
  target.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    st.pointer = [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
    st.ponT = e.pointerType === 'mouse' ? 1 : .8; kick();
  }, { passive: true });
  target.addEventListener('pointerleave', () => { st.ponT = 0; });
  target.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') st.ponT = 0; });
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; if (st.visible) { last = performance.now(); kick(); } }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); kick(); } });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); opts.onLost?.(); });
  resize();
  return { morph, prepare: key => shape(key), get current() { return current; }, count };
}
