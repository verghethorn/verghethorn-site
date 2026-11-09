// VERGHE — real-time 3D agent: a dark android body, glossy black helmet with an LED visor,
// standing in a dark studio. The visor reacts to the voice; no lip-sync needed.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const BLUE = new THREE.Color(0x3d9bff);
const state = { reveal: 0, revealTo: 0, voice: 0, speaking: 0, listening: 0, ready: false };
let helm, renderer, scene, camera, composer, mixer, clock, visorMat, visorLight, rimL, rimR, actions = {}, model, dust, floorMat, onReady;
const U = { uReveal: { value: 0 }, uTime: { value: 0 } };

/* materialise from the floor up: everything above the line is hidden, the edge glows */
function revealable(mat) {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uReveal = U.uReveal; sh.uniforms.uTime = U.uTime;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWPos; uniform float uReveal; uniform float uTime;')
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        float line = uReveal * 2.15 - 0.05;
        float n = fract(sin(dot(floor(vWPos.xz * 60.0), vec2(12.9898, 78.233))) * 43758.5453) * 0.04;
        if (vWPos.y > line + n) discard;
        float edge = smoothstep(0.06, 0.0, line + n - vWPos.y) * step(uReveal, 0.999);
        gl_FragColor.rgb += vec3(0.25, 0.6, 1.0) * edge * 3.0;`);
  };
  const key = 'reveal' + (revealable.n = (revealable.n || 0) + 1); mat.customProgramCacheKey = () => key;
  return mat;
}

function ledTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 32;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, 512, 32);
  for (let y = 0; y < 4; y++) for (let x = 0; x < 64; x++) {
    const cx = 4 + x * 8, cy = 4 + y * 8, gr = g.createRadialGradient(cx, cy, 0, cx, cy, 3.4);
    gr.addColorStop(0, '#fff'); gr.addColorStop(.5, '#bfe0ff'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(cx - 4, cy - 4, 8, 8);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function floorTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const g = c.getContext('2d');
  const gr = g.createRadialGradient(256, 256, 0, 256, 256, 256);
  gr.addColorStop(0, 'rgba(120,150,190,.55)'); gr.addColorStop(.35, 'rgba(40,55,80,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function helmet(headBone) {
  const grp = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0, roughness: .14, clearcoat: 1, clearcoatRoughness: .02, envMapIntensity: 1 });
  const chrome = new THREE.MeshPhysicalMaterial({ color: 0x9aa3ac, metalness: 1, roughness: .18, envMapIntensity: 2.2 });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(.148, 64, 48), revealable(shell)); dome.scale.set(1, 1.1, 1.06);
  // chrome jaw: lower front shell
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(.151, 64, 32, Math.PI * .14, Math.PI * .72, Math.PI * .6, Math.PI * .26), revealable(chrome));
  jaw.scale.set(1, 1.1, 1.06);
  // ear discs
  const disc = new THREE.CylinderGeometry(.046, .046, .03, 48);
  [-1, 1].forEach(s => { const d = new THREE.Mesh(disc, revealable(chrome)); d.rotation.z = Math.PI / 2; d.position.set(s * .148, -.005, 0); grp.add(d);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.03, .004, 12, 48), new THREE.MeshBasicMaterial({ color: BLUE })); ring.rotation.y = Math.PI / 2; ring.position.set(s * .164, -.005, 0); grp.add(ring); });
  // LED visor band
  const tex = ledTexture();
  visorMat = new THREE.MeshBasicMaterial({ map: tex, color: BLUE.clone().multiplyScalar(1.6), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(.1525, .1525, .04, 96, 1, true, -Math.PI * .34, Math.PI * .68), visorMat);
  band.scale.set(1, 1, 1.06); band.position.y = .012;
  const glassMat = revealable(new THREE.MeshPhysicalMaterial({ color: 0x02040a, roughness: .05, metalness: .1, clearcoat: 1 }));
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(.151, .151, .058, 96, 1, true, -Math.PI * .38, Math.PI * .76), glassMat); glass.scale.set(1, 1, 1.06); glass.position.y = .012;
  visorLight = new THREE.PointLight(BLUE, 0, 1.4, 2); visorLight.position.set(0, -.25, .45);
  // fresnel rim so the black shell reads against the dark background
  const rimMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { c: { value: new THREE.Color(0x4f9dff) }, k: U.uReveal },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 c; uniform float k; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1. - max(dot(vN, vV), 0.), 3.); gl_FragColor = vec4(c * f * .9 * step(.98, k), f); }' });
  const rim = new THREE.Mesh(new THREE.SphereGeometry(.1495, 64, 48), rimMat); rim.scale.copy(dome.scale);
  grp.add(dome, rim, jaw, glass, band, visorLight);
  // place on the head: bone space, so it follows every move
  const wp = new THREE.Vector3(); headBone.getWorldPosition(wp);
  grp.position.copy(wp).add(new THREE.Vector3(0, .1, .018));
  scene.add(grp); headBone.attach(grp);
  return grp;
}

// a dark studio for reflections: black room with a few softboxes, so glossy black stays black
function studioEnv() {
  const env = new THREE.Scene(); env.background = new THREE.Color(0x000000);
  const box = (w, h, col, k, pos, look) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide })); m.position.set(...pos); m.lookAt(...look); env.add(m); };
  box(4, .22, 0xffffff, 2.4, [0, 4, 1.2], [0, 0, 0]);      // overhead strip
  box(.6, 3, 0x6fb2ff, 1.6, [-3, 1.5, -2], [0, 1, 0]);    // cool strip, back left
  box(.6, 3, 0xa8d0ff, 1.2, [3, 1.5, -2], [0, 1, 0]);     // cool strip, back right
  box(.3, 2.2, 0xffe2c4, 1.4, [2.2, 1.7, 3], [0, 1, 0]);    // warm strip, front right
  box(.25, 2.4, 0xcfe4ff, 1.1, [-2.4, 1.7, 2.6], [0, 1, 0]); // cool strip, front left
  return env;
}

export function init(canvas, ready) {
  onReady = ready;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene = new THREE.Scene(); scene.background = new THREE.Color(0x020306); scene.fog = new THREE.Fog(0x020306, 5, 11);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(studioEnv(), .02).texture; scene.environmentIntensity = 1;
  camera = new THREE.PerspectiveCamera(30, 1, .1, 50);

  // light: soft key from above-front, cool rims from behind, a pool of light on the floor
  const key = new THREE.SpotLight(0xfff1e0, 60, 9, .42, .7, 1.6); key.position.set(.9, 4.2, 2.4); key.target.position.set(0, .9, 0); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.bias = -.0005;
  scene.add(key, key.target);
  rimL = new THREE.SpotLight(0x5aa8ff, 40, 8, .5, .8, 1.5); rimL.position.set(-2.2, 2.6, -2.4); rimL.target.position.set(0, 1.2, 0);
  rimR = new THREE.SpotLight(0x8fc4ff, 30, 8, .5, .8, 1.5); rimR.position.set(2.4, 2.2, -2.2); rimR.target.position.set(0, 1.2, 0);
  scene.add(rimL, rimL.target, rimR, rimR.target, new THREE.HemisphereLight(0x1a2333, 0x000000, .6));

  floorMat = new THREE.MeshStandardMaterial({ color: 0x07090d, roughness: .35, metalness: .6 });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(12, 96), floorMat); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const pool = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map: floorTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  pool.rotation.x = -Math.PI / 2; pool.position.y = .002; scene.add(pool);
  // a thin glowing ring where he stands
  const ring = new THREE.Mesh(new THREE.RingGeometry(.62, .635, 128), new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: .55 }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = .003; ring.name = 'ring'; scene.add(ring);

  // dust in the light
  const n = 420, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 4; pos[i * 3 + 1] = Math.random() * 3.2; pos[i * 3 + 2] = (Math.random() - .5) * 3; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0x9fc8ff, size: .012, transparent: true, opacity: .45, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dust);

  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), .45, .4, .85); composer.addPass(bloom);
  composer.addPass(new OutputPass());

  new GLTFLoader().load('/media/me/xbot.glb', gltf => {
    model = gltf.scene;
    model.traverse(o => {
      if (!o.isMesh) return; o.castShadow = true; o.frustumCulled = false;
      const joints = /001/.test(o.name);
      o.material = revealable(new THREE.MeshPhysicalMaterial(joints
        ? { color: 0x5a626c, metalness: 1, roughness: .3, envMapIntensity: 1.8 }
        : { color: 0x0b0d12, metalness: .15, roughness: .55, clearcoat: .2, clearcoatRoughness: .5, sheen: .8, sheenRoughness: .45, envMapIntensity: 1.5, sheenColor: new THREE.Color(0x26324a) }));
    });
    scene.add(model);
    const head = model.getObjectByName('mixamorigHead');
    model.updateMatrixWorld(true); window.__dbg = { model, head, THREE }; helm = helmet(head);
    mixer = new THREE.AnimationMixer(model);
    const clip = name => gltf.animations.find(a => a.name === name);
    actions.idle = mixer.clipAction(clip('idle')); actions.idle.play();
    const agree = THREE.AnimationUtils.makeClipAdditive(clip('agree').clone());
    actions.agree = mixer.clipAction(agree); actions.agree.blendMode = THREE.AdditiveAnimationBlendMode; actions.agree.setEffectiveWeight(0); actions.agree.play();
    state.ready = true; onReady && onReady();
  });

  clock = new THREE.Clock();
  addEventListener('resize', size); size();
  renderer.setAnimationLoop(frame);
}

function size() {
  const w = innerWidth, h = innerHeight, a = w / h;
  renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = a;
  // keep the whole figure in frame at ~62% of the screen height on phones, a little closer on wide screens
  const portrait = a < 1;
  camera.fov = portrait ? 30 : 27;
  camera.position.set(0, portrait ? .98 : 1.0, portrait ? 6.6 : 6.2);
  camera.lookAt(0, portrait ? .74 : .66, 0);
  camera.updateProjectionMatrix();
}

let t = 0, sway = 0, frozen = null;
function frame() {
  const dt = Math.min(clock.getDelta(), .05); t += dt; U.uTime.value = t;
  const sp = state.revealTo ? .5 : 1.4; state.reveal = state.revealTo > state.reveal ? Math.min(state.revealTo, state.reveal + dt * sp) : Math.max(state.revealTo, state.reveal - dt * sp);
  if (helm) helm.visible = state.reveal > .02;
  U.uReveal.value = state.reveal;
  if (mixer) {
    mixer.update(dt);
    const w = actions.agree.getEffectiveWeight(); actions.agree.setEffectiveWeight(w + ((state.speaking ? .32 : 0) - w) * dt * 2.5);
  }
  // visor: off → idle glow → breathing while listening → pulses with the voice while speaking
  if (visorMat) {
    const on = Math.max(0, (state.reveal - .82) / .18);
    const breathe = state.listening ? .55 + .25 * Math.sin(t * 2) : .5;
    const v = state.speaking ? .55 + Math.min(1, state.voice * 2.4) * .95 : breathe;
    const k = on * v; visorMat.opacity = Math.min(1, k * 1.2); visorMat.color.copy(BLUE).multiplyScalar(1 + k * 1.4); visorLight.intensity = 0;
  }
  // slow cinematic drift of the camera
  if (!frozen) { sway += dt * .12; camera.position.x = Math.sin(sway) * .22; camera.lookAt(0, camera.aspect < 1 ? .74 : .66, 0); }
  if (dust) { dust.rotation.y += dt * .015; dust.material.opacity = .15 + .3 * state.reveal; }
  const ring = scene.getObjectByName('ring'); if (ring) ring.material.opacity = .15 + .45 * state.reveal;
  rimL.intensity = 10 + 30 * state.reveal; rimR.intensity = 8 + 22 * state.reveal;
  composer.render();
}

export const appear = () => { state.revealTo = 1; };
export const vanish = () => { state.revealTo = 0; state.speaking = 0; state.listening = 0; };
export const setMode = m => { state.speaking = m === 'speaking' ? 1 : 0; state.listening = m === 'listening' ? 1 : 0; };
export const setVoice = v => { state.voice = v; };
export const isReady = () => state.ready;
export const _now = r => { state.reveal = state.revealTo = r; };
export const _cam = (p, l, fov) => { camera.fov = fov; camera.position.set(...p); camera.updateProjectionMatrix(); camera.lookAt(...l); frozen = l; };
