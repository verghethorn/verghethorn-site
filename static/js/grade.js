// "On set" monitor: one real video, re-lit and re-lensed live in WebGL.
const FRAG = `precision mediump float;
uniform sampler2D V; uniform vec2 R; uniform vec2 VR; uniform float T;
uniform vec3 K; uniform vec3 RIM; uniform vec2 KP; uniform float KA; uniform float AMB; uniform float SAT; uniform float CON; uniform float HAZE;
uniform float ZOOM; uniform vec2 FOC; uniform float BLUR; uniform float ANA; uniform float FILM;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec3 tex(vec2 uv){ return texture2D(V, clamp(uv, .001, .999)).rgb; }
void main(){
  vec2 q = gl_FragCoord.xy / R;
  // letterbox for anamorphic (2.39:1)
  float barH = ANA > .5 ? max(0., (1. - (R.x / R.y) / 2.39) * .5) : 0.;
  if (q.y < barH || q.y > 1. - barH) { gl_FragColor = vec4(0., 0., 0., 1.); return; }
  // cover-fit the video, then zoom around the subject like a longer lens
  float ra = R.x / R.y, va = VR.x / VR.y; vec2 s = ra > va ? vec2(1., va / ra) : vec2(ra / va, 1.);
  vec2 uv = vec2(q.x, 1. - q.y);
  vec2 half = .5 * s / ZOOM; vec2 cen = clamp(FOC, half, 1. - half);
  uv = (uv - .5) * s / ZOOM + cen;
  if (ANA > .5) uv.x = (uv.x - cen.x) * 1.12 + cen.x;
  if (FILM > .5) uv += (vec2(h(vec2(floor(T * 12.), 1.)), h(vec2(floor(T * 12.), 2.))) - .5) * .0025;
  vec3 c = tex(uv);
  // shallow focus: the edges melt away on the portrait lens
  if (BLUR > 0.) {
    float d = smoothstep(.18, .75, length((q - vec2(.55, .5)) * vec2(ra, 1.)) / ra * 1.6);
    vec3 b = vec3(0.); float r = BLUR * d * .012;
    for (int i = 0; i < 8; i++) { float a = float(i) * .785; b += tex(uv + vec2(cos(a), sin(a) * ra / 1.) * r); }
    c = mix(c, b / 8., d);
  }
  // relight: the key lamp falls off from where it points; the rest sinks into ambience
  float lum = dot(c, vec3(.299, .587, .114));
  vec2 kp = (q - KP) * vec2(ra, 1.); float fall = exp(-dot(kp, kp) * 2.2);
  float rim = smoothstep(.55, 1., q.x) * .9 + smoothstep(.45, 0., q.x) * .25;
  vec3 lit = c * (AMB + KA * fall * K * 1.6) + c * RIM * rim * .9;
  lit += K * HAZE * fall * .18;
  // anamorphic streak on highlights
  if (ANA > .5) { float st = 0.; for (int i = -6; i <= 6; i++) { vec3 sm = tex(uv + vec2(float(i) * .018, 0.)); st += smoothstep(.75, 1., dot(sm, vec3(.333))); } lit += vec3(.25, .45, 1.) * st * .06; }
  // grade
  float l2 = dot(lit, vec3(.299, .587, .114));
  lit = mix(vec3(l2), lit, SAT);
  lit = (lit - .5) * CON + .5;
  if (FILM > .5) {
    lit += vec3(.9, .25, .1) * smoothstep(.7, 1., l2) * .25;          // halation
    lit = mix(lit, vec3(.05, .04, .03) + lit * .92, .5);               // lifted blacks
    lit += (h(gl_FragCoord.xy + T * 60.) - .5) * .11;                   // grain
  } else lit += (h(gl_FragCoord.xy + T * 60.) - .5) * .025;
  vec2 vq = q - .5; lit *= 1. - dot(vq, vq) * (FILM > .5 ? 1.3 : .8);
  gl_FragColor = vec4(clamp(lit, 0., 1.), 1.);
}`;

export const LIGHTS = {
  day:    { K: [1.0, 1.0, 1.03], RIM: [.12, .14, .16], KA: .75, AMB: .55, SAT: 1.0, CON: 1.02, HAZE: 0 },
  tungsten:{ K: [1.0, .66, .36], RIM: [.05, .03, .02], KA: 1.05, AMB: .28, SAT: 1.05, CON: 1.15, HAZE: .25 },
  neon:   { K: [1.0, .18, .62], RIM: [.05, .55, 1.0], KA: .95, AMB: .18, SAT: 1.25, CON: 1.2, HAZE: .35 },
  golden: { K: [1.0, .72, .42], RIM: [.6, .32, .1], KA: .95, AMB: .42, SAT: 1.12, CON: 1.05, HAZE: .6 },
};
export const LENSES = {
  35:  { ZOOM: 1.0, BLUR: 0, ANA: 0, FILM: 0 },
  85:  { ZOOM: 1.55, BLUR: 1, ANA: 0, FILM: 0 },
  ana: { ZOOM: 1.15, BLUR: .4, ANA: 1, FILM: 0 },
  16:  { ZOOM: 1.08, BLUR: 0, ANA: 0, FILM: 1 },
};

export function startMonitor(canvas, video, focus = [.6, .45]) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}')); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(p); gl.useProgram(p);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const al = gl.getAttribLocation(p, 'a'); gl.enableVertexAttribArray(al); gl.vertexAttribPointer(al, 2, gl.FLOAT, false, 0, 0);
  const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  const U = n => gl.getUniformLocation(p, n);
  const names = ['R', 'VR', 'T', 'K', 'RIM', 'KP', 'KA', 'AMB', 'SAT', 'CON', 'HAZE', 'ZOOM', 'FOC', 'BLUR', 'ANA', 'FILM']; const u = Object.fromEntries(names.map(n => [n, U(n)]));
  // current values ease towards targets so every switch feels like a real light change
  const cur = { ...LIGHTS.tungsten, ...LENSES[35], KP: [.42, .6] }, tgt = structuredClone(cur);
  const resize = () => { const r = canvas.getBoundingClientRect(); const k = Math.min(devicePixelRatio || 1, 1.6); canvas.width = Math.max(2, r.width * k | 0); canvas.height = Math.max(2, r.height * k | 0); gl.viewport(0, 0, canvas.width, canvas.height); };
  resize(); new ResizeObserver(resize).observe(canvas);
  let on = true, raf = 0, ready = false; const t0 = performance.now();
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) { video.play().catch(() => {}); go(); } else video.pause(); }, { threshold: 0 }).observe(canvas);
  const mix = (a, b, k) => Array.isArray(a) ? a.map((v, i) => v + (b[i] - v) * k) : a + (b - a) * k;
  const frame = () => {
    raf = 0; if (!on || document.hidden) return;
    if (video.readyState >= 2) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video); ready = true; }
    if (ready) {
      for (const k in tgt) cur[k] = (k === 'ANA' || k === 'FILM') ? tgt[k] : mix(cur[k], tgt[k], .08);
      gl.uniform2f(u.R, canvas.width, canvas.height); gl.uniform2f(u.VR, video.videoWidth || 16, video.videoHeight || 9); gl.uniform1f(u.T, (performance.now() - t0) / 1000);
      gl.uniform3fv(u.K, cur.K); gl.uniform3fv(u.RIM, cur.RIM); gl.uniform2fv(u.KP, cur.KP); gl.uniform2fv(u.FOC, focus);
      for (const n of ['KA', 'AMB', 'SAT', 'CON', 'HAZE', 'ZOOM', 'BLUR', 'ANA', 'FILM']) gl.uniform1f(u[n], cur[n]);
      gl.drawArrays(gl.TRIANGLES, 0, 3); canvas.classList.add('live');
    }
    go();
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', go);
  go();
  return {
    light(id) { Object.assign(tgt, LIGHTS[id]); },
    lens(id) { Object.assign(tgt, LENSES[id]); },
    key(x, y) { tgt.KP = [x, y]; },
  };
}
