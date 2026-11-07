// THE LIVING FRAME — one frame, three states: film → structure → interface.
// Hand-written WebGL1 fragment shader, no 3D library. CSS fallback when WebGL is unavailable.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){ vUv = aPos * .5 + .5; gl_Position = vec4(aPos, 0., 1.); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uTexSize;
uniform float uCropX;
uniform float uOpen;
uniform float uSlit;
uniform float uMode;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerOn;
uniform vec3 uFocus;
uniform vec3 uFocusColor;
uniform float uGrain;

float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y); }
float luma(vec3 c){ return dot(c, vec3(.2126,.7152,.0722)); }

vec2 coverUv(vec2 uv){
  float A = uRes.x / uRes.y, B = uTexSize.x / uTexSize.y;
  vec2 o = uv;
  if (A < B) { float w = A / B; float cx = clamp(uCropX, w*.5, 1. - w*.5); o.x = (uv.x - .5) * w + cx; }
  else { float h = B / A; o.y = (uv.y - .5) * h + .5; }
  return o;
}
vec3 tex(vec2 uv){ return texture2D(uTex, clamp(uv, .001, .999)).rgb; }

void main(){
  float A = uRes.x / uRes.y;
  vec2 par = (uPointer - .5) * .012 * uOpen * uPointerOn;
  vec2 uv = coverUv((vUv - .5) / 1.035 + .5 - par);
  vec2 px = 1.5 / uRes / 1.035 * vec2(uRes.x / uRes.y < uTexSize.x / uTexSize.y ? (uRes.x/uRes.y)/(uTexSize.x/uTexSize.y) : 1., 1.);

  // --- film
  vec2 d = (vUv - .5) * .0035;
  vec3 film = vec3(tex(uv + d).r, tex(uv).g, tex(uv - d).b);
  film = pow(film, vec3(1.06));
  film = mix(vec3(.043,.051,.063), film, .96);
  float vig = smoothstep(1.15, .35, length((vUv - .5) * vec2(A * .62, 1.)));
  film *= mix(.55, 1., vig);
  vec2 pa = (vUv - uPointer) * vec2(A, 1.);
  film *= 1. + .14 * exp(-dot(pa, pa) * 7.) * uPointerOn * uOpen;

  // focus spotlight (image space, y down → flip)
  vec2 fuv = vec2(uFocus.x, 1. - uFocus.y);
  vec2 fd = (uv - fuv) * vec2(uTexSize.x / uTexSize.y, 1.);
  float spot = exp(-dot(fd, fd) * 18.);
  vec3 filmRaw = film;
  film *= mix(1., .38 + .9 * spot, uFocus.z);

  // --- structure: sobel edges + luminance lattice
  float tl = luma(tex(uv + px*vec2(-1, 1))), t = luma(tex(uv + px*vec2(0, 1))), tr = luma(tex(uv + px*vec2(1, 1)));
  float l = luma(tex(uv + px*vec2(-1, 0))), r = luma(tex(uv + px*vec2(1, 0)));
  float bl = luma(tex(uv + px*vec2(-1,-1))), b = luma(tex(uv + px*vec2(0,-1))), br = luma(tex(uv + px*vec2(1,-1)));
  float gx = -tl - 2.*l - bl + tr + 2.*r + br;
  float gy = -bl - 2.*b - br + tl + 2.*t + tr;
  float edge = smoothstep(.1, .5, length(vec2(gx, gy)));
  float cell = 9.;
  vec2 g = vUv * uRes / cell;
  vec2 gc = (floor(g) + .5) * cell / uRes;
  float L = luma(tex(coverUv((gc - .5) / 1.035 + .5 - par)));
  float dotR = .08 + .38 * smoothstep(.05, .9, L);
  float dots = 1. - smoothstep(dotR - .08, dotR, length(fract(g) - .5));
  vec3 steel = vec3(.682, .718, .776);
  // emphasise the subject band (the bench), let the bokeh background recede
  float band = exp(-pow((uv.y - .5) / .2, 2.));
  float depth = mix(.22, 1., band);
  vec3 struc = vec3(.043, .051, .063);
  struc += steel * dots * .11 * depth;
  vec3 lineCol = mix(steel, uFocusColor, uFocus.z * smoothstep(.2, .9, spot * 1.4));
  struc += lineCol * edge * .8 * depth * (1. + .8 * uFocus.z * spot);
  struc += steel * .03 * step(.996, max(fract(vUv.x * A * 6.), fract(vUv.y * 6.)));

  // --- interface: a quiet, desaturated plate; focused object returns in full colour
  vec3 plate = vec3(luma(film)) * vec3(.92, .96, 1.04) * .3 + steel * edge * .16 * depth;
  vec3 iface = mix(plate, filmRaw * 1.08, uFocus.z * smoothstep(.15, .7, spot));

  // --- mode wipes with a moving front
  float n = noise(vUv * vec2(6., 3.) + uTime * .05);
  float w = vUv.x * .78 + (1. - vUv.y) * .22 + (n - .5) * .12;
  float a = clamp(uMode, 0., 1.), c = clamp(uMode - 1., 0., 1.);
  float e1 = smoothstep(w - .035, w + .035, a * 1.2 - .1);
  float e2 = smoothstep(w - .035, w + .035, c * 1.2 - .1);
  vec3 col = mix(film, struc, e1);
  col = mix(col, iface, e2);
  float front = exp(-pow((w - (a * 1.2 - .1)) * 60., 2.)) * step(.001, a) * step(a, .999)
              + exp(-pow((w - (c * 1.2 - .1)) * 60., 2.)) * step(.001, c) * step(c, .999);
  col += vec3(.95, .9, .82) * front * .55;

  // grain
  col += (hash(vUv * uRes + fract(uTime * 13.)) - .5) * uGrain;

  // --- aperture
  float dx = abs(vUv.x - uSlit) * A;
  float maxHalf = max(uSlit, 1. - uSlit) * A + .06;
  float o = uOpen * uOpen * (3. - 2. * uOpen);
  float half_ = mix(.0032, maxHalf, o);
  float soft = mix(.0018, .05, o);
  float mask = 1. - smoothstep(half_ - soft, half_ + .0004, dx);
  float vfade = smoothstep(0., .22, vUv.y) * smoothstep(1., .78, vUv.y);
  float closed = 1. - o;
  vec3 dark = vec3(.043, .051, .063) + film * .028;
  vec3 outC = dark + vec3(.95, .92, .86) * (.05 / (dx * 38. + 1.)) * closed * mix(.4, 1., vfade);
  vec3 res = mix(outC, col, mask);
  float lip = exp(-pow((dx - half_) / (.0028 + .01 * o), 2.)) * closed;
  res += vec3(1., .96, .9) * lip * (.55 + .45 * vfade);
  gl_FragColor = vec4(res, 1.);
}`;

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spring(value, target, vel, k, c, dt) {
  const f = -k * (value - target) - c * vel;
  vel += f * dt;
  value += vel * dt;
  return [value, vel];
}

export function hotspotRect(spot, frameW, frameH, texW, texH, cropX) {
  const A = frameW / frameH, B = texW / texH;
  let x, y, w, h;
  if (A < B) {
    const vw = A / B;
    const cx = Math.min(Math.max(cropX, vw / 2), 1 - vw / 2);
    x = (spot.x - (cx - vw / 2)) / vw; w = spot.w / vw; y = spot.y; h = spot.h;
  } else {
    const vh = B / A;
    y = (spot.y - (0.5 - vh / 2)) / vh; h = spot.h / vh; x = spot.x; w = spot.w;
  }
  return { x, y, w, h };
}

export function createLivingFrame(root, opts = {}) {
  const canvas = root.querySelector('canvas');
  const fallback = root.querySelector('.frame-fallback');
  const ui = root.querySelector('.frame-ui');
  const reduce = prefersReduced();
  const state = {
    open: 0, openV: 0, openT: 0,
    slit: .5, slitV: 0, slitT: .5,
    mode: 0, modeV: 0, modeT: 0,
    fz: 0, fzV: 0, fzT: 0, focus: [.5, .5], focusColor: [1, 1, 1],
    pointer: [.5, .5], pointerOn: 0, pointerOnT: 0,
    interacted: false, dragging: false, dragStartX: 0, dragStartMode: 0,
    tex: [2048, 1152],
  };
  const cropX = opts.cropX ?? .5;
  const listeners = { mode: [] };
  let gl, prog, uni = {}, raf = 0, visible = true, last = performance.now(), t0 = last, needsFrame = true;

  // ---------- WebGL setup
  function initGL(img) {
    try {
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
    } catch (e) { gl = null; }
    if (!gl) return false;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;
    prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ['uTex', 'uRes', 'uTexSize', 'uCropX', 'uOpen', 'uSlit', 'uMode', 'uTime', 'uPointer', 'uPointerOn', 'uFocus', 'uFocusColor', 'uGrain']
      .forEach(n => uni[n] = gl.getUniformLocation(prog, n));
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(uni.uTex, 0);
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); root.classList.remove('has-gl'); gl = null; cancelAnimationFrame(raf); });
    return true;
  }

  function resize() {
    const r = root.getBoundingClientRect();
    const coarse = matchMedia('(pointer: coarse)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.75);
    const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    layoutHotspots();
    needsFrame = true;
  }

  function layoutHotspots() {
    if (!ui || !opts.hotspots) return;
    const r = root.getBoundingClientRect();
    ui.querySelectorAll('[data-spot]').forEach(el => {
      const s = opts.hotspots[+el.dataset.spot];
      const q = hotspotRect(s, r.width, r.height, state.tex[0], state.tex[1], cropX);
      const visibleX = q.x > -.02 && q.x < 1.02;
      el.style.left = (q.x * 100) + '%'; el.style.top = (q.y * 100) + '%';
      el.style.width = (q.w * 100) + '%'; el.style.height = (q.h * 100) + '%';
      el.hidden = !visibleX;
    });
  }

  // ---------- fallback (no WebGL)
  function paintFallback() {
    if (!fallback) return;
    fallback.style.setProperty('--open', state.openT.toFixed(3));
    fallback.style.setProperty('--slit', (state.openT >= 1 ? 50 : state.slitT * 100).toFixed(2) + '%');
  }

  // ---------- loop
  function frame(now) {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const k = reduce ? 1e4 : 120, c = reduce ? 200 : 22;
    let moving = false;
    [['open', 'openV', 'openT'], ['slit', 'slitV', 'slitT'], ['mode', 'modeV', 'modeT'], ['fz', 'fzV', 'fzT']].forEach(([v, vv, tt]) => {
      const kk = v === 'mode' ? k * .55 : (v === 'slit' ? k * 1.4 : k);
      const cc = v === 'mode' ? c * .8 : c;
      if (state.dragging && v === 'mode') { state.mode = state.modeT; state.modeV = 0; return; }
      [state[v], state[vv]] = spring(state[v], state[tt], state[vv], kk, cc, dt);
      if (Math.abs(state[v] - state[tt]) > 1e-4 || Math.abs(state[vv]) > 1e-4) moving = true;
      else { state[v] = state[tt]; state[vv] = 0; }
    });
    state.pointerOn += (state.pointerOnT - state.pointerOn) * Math.min(1, dt * 6);
    // ambient drift while untouched and closed
    if (!state.interacted && state.openT < .5 && !reduce) state.slitT = .5 + Math.sin((now - t0) / 1400) * .035;

    if (gl) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uni.uRes, canvas.width, canvas.height);
      gl.uniform2f(uni.uTexSize, state.tex[0], state.tex[1]);
      gl.uniform1f(uni.uCropX, cropX);
      gl.uniform1f(uni.uOpen, Math.max(0, Math.min(1.05, state.open)));
      gl.uniform1f(uni.uSlit, state.slit);
      gl.uniform1f(uni.uMode, Math.max(0, Math.min(2, state.mode)));
      gl.uniform1f(uni.uTime, reduce ? 0 : (now - t0) / 1000);
      gl.uniform2f(uni.uPointer, state.pointer[0], state.pointer[1]);
      gl.uniform1f(uni.uPointerOn, state.pointerOn);
      gl.uniform3f(uni.uFocus, state.focus[0], state.focus[1], Math.max(0, state.fz));
      gl.uniform3f(uni.uFocusColor, ...state.focusColor);
      gl.uniform1f(uni.uGrain, reduce ? 0 : .045);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    root.style.setProperty('--open', state.open.toFixed(3));
    needsFrame = false;
    const keepGoing = visible && !document.hidden && (moving || !reduce);
    if (keepGoing) schedule();
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(frame); }

  // ---------- interaction
  function local(e) { const r = root.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; }
  function setOpen(v) { state.openT = v; root.classList.toggle('is-open', v >= .99); paintFallback(); schedule(); }
  function setMode(m, { emit = true } = {}) {
    m = Math.max(0, Math.min(2, m));
    state.modeT = m;
    if (state.openT < 1) setOpen(1);
    const snapped = Math.round(m);
    if (root.dataset.mode !== String(snapped)) {
      root.dataset.mode = String(snapped);
      if (ui) ui.inert = snapped !== 2;
      if (emit) listeners.mode.forEach(fn => fn(snapped));
    }
    schedule();
  }
  function setFocus(i) {
    if (i == null || !opts.hotspots) { state.fzT = 0; schedule(); return; }
    const s = opts.hotspots[i];
    state.focus = [s.x, s.y]; state.focusColor = s.rgb; state.fzT = 1; schedule();
  }

  if (opts.interactive !== false) {
    root.addEventListener('pointermove', e => {
      const [x, y] = local(e);
      state.pointer = [x, 1 - y]; state.pointerOnT = 1;
      if (e.pointerType === 'mouse' || state.dragging) state.interacted = true;
      if (state.openT < 1 && e.pointerType === 'mouse') {
        state.slitT = Math.min(.97, Math.max(.03, x));
        const near = 1 - Math.min(1, Math.abs(y - .5) * 1.4);
        state.openT = .06 + .1 * near;
      }
      if (state.dragging) {
        const dx = (e.clientX - state.dragStartX) / root.getBoundingClientRect().width;
        if (Math.abs(dx) > .015) { state.dragMoved = true; setMode(state.dragStartMode + dx * 2.6); }
      }
      schedule();
    });
    root.addEventListener('pointerleave', () => {
      state.pointerOnT = 0;
      if (state.openT < 1) { state.openT = 0; state.slitT = .5; }
      schedule();
    });
    root.addEventListener('pointerdown', e => {
      if (e.target.closest('a, button')) return;
      state.interacted = true;
      if (state.openT < 1) {
        // on touch the slit jumps to the finger first, then opens
        state.slitT = local(e)[0];
        setOpen(1);
        return;
      }
      state.dragging = true; state.dragMoved = false; state.dragStartX = e.clientX; state.dragStartMode = state.modeT;
      root.setPointerCapture?.(e.pointerId);
    });
    const endDrag = () => {
      if (!state.dragging) return;
      state.dragging = false;
      if (state.dragMoved) setMode(Math.round(state.modeT));
    };
    root.addEventListener('pointerup', endDrag);
    root.addEventListener('pointercancel', endDrag);
  }

  // ---------- boot
  const ro = new ResizeObserver(resize); ro.observe(root);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) schedule(); }, { rootMargin: '80px' });
  io.observe(root);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); schedule(); } });

  const img = new Image();
  img.decoding = 'async';
  img.src = opts.src;
  const ready = img.decode().then(() => {
    state.tex = [img.naturalWidth, img.naturalHeight];
    if (opts.webgl !== false && initGL(img)) root.classList.add('has-gl');
    resize();
    schedule();
  }).catch(() => { resize(); });

  if (opts.autoOpen != null) {
    setTimeout(() => { if (state.openT < 1) setOpen(1); }, reduce ? 0 : opts.autoOpen);
  }
  if (reduce && opts.autoOpen != null) setOpen(1);
  paintFallback();

  return {
    ready, setMode, setOpen, setFocus,
    get mode() { return Math.round(state.modeT); },
    onMode(fn) { listeners.mode.push(fn); },
    setModeContinuous(v) { state.dragging = false; state.modeT = v; if (state.openT < 1) setOpen(1); schedule(); root.dataset.mode = String(Math.round(v)); if (ui) ui.inert = Math.round(v) !== 2; },
    relayout: layoutHotspots,
  };
}
