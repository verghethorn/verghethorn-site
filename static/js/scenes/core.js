// Shared 3D plumbing: renderer, looks (camera "film stocks"), pointer, labels.
import * as THREE from 'three';
import { RoomEnvironment } from '/static/vendor/three/RoomEnvironment.js';

export { THREE };
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarse = matchMedia('(pointer: coarse)').matches;

// Each look is a lighting setup the whole site switches to.
export const LOOKS = {
  day:        { bg: 0xF5F5F7, floor: 0xF0F0F3, ink: 0x1D1D1F, key: 0xFFFFFF, keyI: 1.0, fill: .55, amb: .9,  exposure: 1.0,  accent: 0xE8A33D, grid: 0xD2D2D7, beam: .10, night: false },
  golden:     { bg: 0xF7EEE3, floor: 0xF2E6D7, ink: 0x2A2118, key: 0xFFBE7A, keyI: 1.25, fill: .4, amb: .75, exposure: 1.02, accent: 0xD9822B, grid: 0xE4CFB6, beam: .16, night: false },
  anamorphic: { bg: 0xEDF1F7, floor: 0xE8EDF4, ink: 0x18202C, key: 0xDDE8FF, keyI: 1.05, fill: .5, amb: .8,  exposure: 1.0,  accent: 0x3D7BFF, grid: 0xCBD5E6, beam: .14, night: false, flare: true },
  night:      { bg: 0x0B0C10, floor: 0x15171C, ink: 0xF5F5F7, key: 0xFFB766, keyI: 1.9, fill: .12, amb: .14, exposure: 1.15, accent: 0xFFB766, grid: 0x2A2D35, beam: .55, night: true },
  film:       { bg: 0xEFE8DC, floor: 0xEBE2D3, ink: 0x2B241C, key: 0xFFDDB0, keyI: 1.1, fill: .45, amb: .75, exposure: 1.0,  accent: 0xC2702E, grid: 0xD8CBB6, beam: .14, night: false },
};
export const lookName = () => (LOOKS[document.documentElement.dataset.look] ? document.documentElement.dataset.look : 'day');
export const currentLook = () => LOOKS[lookName()];
export function onLook(fn) { addEventListener('vt:look', () => fn(currentLook(), lookName())); }

export function createStage(host, { shadows = false, fov = 32, env = true, envIntensity = .7 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'scene-canvas';
  host.prepend(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.remove(); host.classList.add('no-gl'); return null;
  }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = currentLook().exposure;
  renderer.setClearColor(0x000000, 0);
  if (shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
  const scene = new THREE.Scene();
  if (env) {
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
    scene.environmentIntensity = envIntensity;
    pm.dispose();
  }
  const camera = new THREE.PerspectiveCamera(fov, 1, .05, 120);
  const frames = [];
  const resizers = [];
  let w = 1, h = 1, raf = 0, visible = false, last = performance.now(), shift = [0, 0];
  const applyShift = () => { if (shift[0] || shift[1]) camera.setViewOffset(w, h, -shift[0] * w, -shift[1] * h, w, h); else camera.clearViewOffset(); };
  const t0 = last;

  const resize = () => {
    const r = host.getBoundingClientRect();
    w = Math.max(2, Math.round(r.width)); h = Math.max(2, Math.round(r.height));
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarse ? 1.6 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    resizers.forEach(f => f(w, h));
    applyShift(); camera.updateProjectionMatrix();
    kick();
  };
  const frame = now => {
    raf = 0;
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    frames.forEach(f => f(dt, t));
    renderer.render(scene, camera);
    if (visible && !document.hidden) kick();
  };
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
  new ResizeObserver(resize).observe(host);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); kick(); } }, { rootMargin: '100px' }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = performance.now(); kick(); } });
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); cancelAnimationFrame(raf); host.classList.add('no-gl'); });
  onLook(L => { renderer.toneMappingExposure = L.exposure; });
  host.classList.add('has-gl');
  requestAnimationFrame(resize);

  return {
    THREE, renderer, scene, camera, canvas, host,
    get size() { return [w, h]; },
    onFrame: f => frames.push(f),
    onResize: f => resizers.push(f),
    kick,
    // move the rendered image within the frame (fractions of width/height)
    setShift(x, y) { if (shift[0] === x && shift[1] === y) return; shift = [x, y]; applyShift(); camera.updateProjectionMatrix(); },
    // pointer → normalized device coords
    ndc(e) { const r = canvas.getBoundingClientRect(); return new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); },
    // world point → css px inside host (or null if behind)
    project(v) {
      const p = v.clone().project(camera);
      if (p.z > 1) return null;
      return [(p.x + 1) / 2 * w, (1 - p.y) / 2 * h];
    },
  };
}

// small helpers
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const damp = (a, b, k, dt) => a + (b - a) * (1 - Math.exp(-k * dt));

export function radialTexture(inner = 'rgba(0,0,0,.35)', outer = 'rgba(0,0,0,0)', size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gr.addColorStop(0, inner); gr.addColorStop(1, outer);
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// a soft additive / normal light beam (cone) from a source toward a target
export function makeBeam(color = 0xffffff) {
  const geo = new THREE.ConeGeometry(1, 1, 48, 1, true);
  geo.translate(0, -.5, 0); // apex at origin, opening toward -y
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    uniforms: { uColor: { value: new THREE.Color(color) }, uStrength: { value: .2 } },
    vertexShader: `varying float vT; varying vec3 vN; varying vec3 vV;
      void main(){ vT = -position.y; vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; uniform float uStrength; varying float vT; varying vec3 vN; varying vec3 vV;
      void main(){ float edge = pow(abs(dot(normalize(vN), normalize(vV))), 2.2);
        float a = edge * pow(1. - vT, 1.6) * smoothstep(0., .06, vT) * uStrength;
        gl_FragColor = vec4(uColor * a, a); }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.renderOrder = 5;
  const up = new THREE.Vector3(0, -1, 0), dir = new THREE.Vector3();
  mesh.aim = (from, to, angle) => {
    dir.subVectors(to, from); const len = dir.length(); dir.normalize();
    mesh.position.copy(from);
    mesh.quaternion.setFromUnitVectors(up, dir);
    const r = Math.tan(angle) * len;
    mesh.scale.set(r, len, r);
  };
  return mesh;
}
