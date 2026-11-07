// The opening shot: a real-time 3D film set for a brand commercial.
// Lamps switch on and off, cameras can be looked through, actors walk between their marks.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mat = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
const M = {
  black: mat(0x161618, .55, .2), steel: mat(0x9a9ea4, .35, .9), dark: mat(0x232326, .4, .6), rubber: mat(0x0d0d0e, .9),
  cyc: mat(0xe7e5e0, .95), floor: mat(0x18181a, .78, .05), plinth: mat(0xf2f0eb, .7), tape: mat(0xf4c542, .8), tape2: mat(0x4aa3ff, .8),
  bottle: mat(0x111113, .28, .2), cap: mat(0xc9ccd1, .22, 1), box: mat(0xe9e6df, .55),
};

function cyclorama() {
  // floor-to-wall cove, swept along x
  const pts = []; const R = 1.2, z0 = -2.6;
  for (let i = 0; i <= 16; i++) { const a = (i / 16) * Math.PI / 2; pts.push([z0 - Math.sin(a) * R, R - Math.cos(a) * R]); }
  pts.push([z0 - R, 5.5]); pts.unshift([0.2, 0]);
  const W = 26, pos = [], idx = [];
  pts.forEach(([z, y]) => { pos.push(-W / 2, y, z, W / 2, y, z); });
  for (let i = 0; i < pts.length - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, M.cyc); m.receiveShadow = true; return m;
}

function stand(h) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.018, .022, h, 10), M.steel); pole.position.y = h / 2; g.add(pole);
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, .72, 6), M.black); const a = i * 2.094;
    leg.position.set(Math.cos(a) * .24, .3, Math.sin(a) * .24); leg.lookAt(Math.cos(a) * .6, -.2, Math.sin(a) * .6); leg.rotateX(Math.PI / 2); g.add(leg);
  }
  return g;
}

function beam(color, len, radius) {
  const geo = new THREE.ConeGeometry(radius, len, 40, 1, true); geo.translate(0, -len / 2, 0); geo.rotateX(-Math.PI / 2);
  const m = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { c: { value: new THREE.Color(color) }, k: { value: 0 }, L: { value: len } },
    vertexShader: 'varying float d; varying vec3 n; varying vec3 v; void main(){ d = position.z; vec4 w = modelViewMatrix * vec4(position,1.); v = normalize(-w.xyz); n = normalize(normalMatrix * normal); gl_Position = projectionMatrix * w; }',
    fragmentShader: 'uniform vec3 c; uniform float k; uniform float L; varying float d; varying vec3 n; varying vec3 v; void main(){ float t = clamp(d / L, 0., 1.); float e = pow(abs(dot(n, v)), 1.6); gl_FragColor = vec4(c * k * .09 * pow(1. - t, 1.4) * e, 1.); }',
  });
  return new THREE.Mesh(geo, m);
}

function fresnel() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.15, .17, .32, 24), M.black); body.rotation.x = Math.PI / 2; g.add(body);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(.13, 32), new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffd2a0, emissiveIntensity: 0, roughness: .2 })); lens.position.z = .162; g.add(lens);
  for (let i = 0; i < 4; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(.3, .005, .16), M.black); const a = i * Math.PI / 2; d.position.set(Math.cos(a) * .16, Math.sin(a) * .16, .24); d.rotation.z = a + Math.PI / 2; d.rotateX(i % 2 ? .35 : -.35); g.add(d); }
  const yoke = new THREE.Mesh(new THREE.TorusGeometry(.2, .012, 6, 20, Math.PI), M.steel); yoke.rotation.z = Math.PI; yoke.rotation.y = Math.PI / 2; g.add(yoke);
  return { g, lens };
}
function softbox() {
  const g = new THREE.Group();
  const box = new THREE.Mesh(new THREE.CylinderGeometry(.08, .55, .45, 4, 1, true), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: .9, side: THREE.DoubleSide }));
  box.rotation.x = Math.PI / 2; box.rotation.y = Math.PI / 4; box.position.z = .1; g.add(box);
  const front = new THREE.Mesh(new THREE.PlaneGeometry(.77, .77), new THREE.MeshStandardMaterial({ color: 0xf2f2f2, emissive: 0xeef3ff, emissiveIntensity: 0, roughness: .9 })); front.position.z = .325; g.add(front);
  return { g, lens: front };
}

function cinemaCamera() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(.17, .17, .3), M.black); g.add(body);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(.055, .06, .2, 24), M.dark); lens.rotation.x = Math.PI / 2; lens.position.z = .25; g.add(lens);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.058, .006, 6, 24), mat(0xe8e8e8, .4)); ring.position.z = .3; g.add(ring);
  const mb = new THREE.Mesh(new THREE.CylinderGeometry(.11, .07, .1, 4, 1, true), new THREE.MeshStandardMaterial({ color: 0x111111, side: THREE.DoubleSide, roughness: .7 })); mb.rotation.x = Math.PI / 2; mb.rotation.y = Math.PI / 4; mb.position.z = .4; g.add(mb);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(.03, .04, .22), M.dark); handle.position.set(0, .12, 0); g.add(handle);
  const mon = new THREE.Mesh(new THREE.BoxGeometry(.13, .09, .015), M.black); mon.position.set(-.16, .1, -.02); mon.rotation.y = .6; g.add(mon);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(.115, .075), new THREE.MeshBasicMaterial({ color: 0x3a5a78 })); scr.position.set(-.155, .1, -.03); scr.rotation.y = .6 + Math.PI; g.add(scr);
  const tally = new THREE.Mesh(new THREE.SphereGeometry(.012, 10, 8), new THREE.MeshBasicMaterial({ color: 0x441111 })); tally.position.set(.05, .09, .1); g.add(tally);
  return { g, tally, scr };
}
function tripod(h) {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + .5; const leg = new THREE.Mesh(new THREE.CylinderGeometry(.016, .014, h * 1.05, 6), M.black); leg.position.set(Math.cos(a) * .2, h / 2, Math.sin(a) * .2); leg.lookAt(Math.cos(a) * .45, -1, Math.sin(a) * .45); leg.rotateX(Math.PI / 2); g.add(leg); }
  const head = new THREE.Mesh(new THREE.CylinderGeometry(.07, .06, .1, 16), M.dark); head.position.y = h; g.add(head);
  return g;
}

function bottle() {
  const g = new THREE.Group();
  const prof = [[0, 0], [.06, 0], [.066, .01], [.066, .2], [.05, .235], [.022, .25], [.022, .27], [0, .27]].map(([r, y]) => new THREE.Vector2(r, y));
  const b = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.bottle); b.castShadow = true; g.add(b);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(.028, .028, .07, 32), M.cap); cap.position.y = .3; cap.castShadow = true; g.add(cap);
  const label = new THREE.Mesh(new THREE.CylinderGeometry(.0665, .0665, .05, 48, 1, true, -.7, 1.4), mat(0xe9e6df, .5)); label.position.y = .12; g.add(label);
  return g;
}
function tapeMark(x, z, m) { const g = new THREE.Group(); [0, Math.PI / 2].forEach(r => { const t = new THREE.Mesh(new THREE.BoxGeometry(.22, .004, .04), m); t.rotation.y = r + .785; g.add(t); }); g.position.set(x, .002, z); return g; }

export async function startSet(canvas, ui) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x0c0c0d); scene.fog = new THREE.Fog(0x0c0c0d, 9, 22);
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = .12;
  const cam = new THREE.PerspectiveCamera(40, 1, .05, 60);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), M.floor); floor.rotation.x = -Math.PI / 2; floor.position.y = -.004; floor.receiveShadow = true; scene.add(floor);
  scene.add(cyclorama());
  scene.add(new THREE.HemisphereLight(0x9fb4d0, 0x1a1410, .14));
  const work = new THREE.PointLight(0xffffff, 3, 14, 2); work.position.set(0, 4.5, 3); scene.add(work); // dim house light

  // set dressing: a plinth with the client's product on a turntable
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.0, .95, .62), M.plinth); plinth.position.set(0, .475, -1.55); plinth.castShadow = plinth.receiveShadow = true; scene.add(plinth);
  const turntable = new THREE.Group(); turntable.position.set(0, .95, -1.55); scene.add(turntable);
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .02, 48), mat(0x2a2a2c, .4, .5)); disk.position.y = .01; disk.receiveShadow = true; turntable.add(disk);
  const product = bottle(); product.position.y = .02; turntable.add(product);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(.16, .22, .07), M.box); pack.position.set(.33, 1.06, -1.5); pack.rotation.y = -.4; pack.castShadow = true; scene.add(pack);
  const marks = [V3(-.95, 0, -1.25), V3(.95, 0, -1.25), V3(-.55, 0, -.35), V3(.6, 0, -.4), V3(-1.6, 0, -.9)];
  marks.forEach((p, i) => scene.add(tapeMark(p.x, p.z, i % 2 ? M.tape2 : M.tape)));

  // lights on stands
  const lamps = [];
  const addLamp = ({ id, kind, pos, h, target, color, intensity, angle, penumbra, shadow, len, rad }) => {
    const grp = new THREE.Group(); grp.position.copy(pos); scene.add(grp);
    const st = stand(h); grp.add(st); st.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const { g: head, lens } = kind === 'soft' ? softbox() : fresnel(); head.position.y = h; grp.add(head);
    const tgtW = target.clone(); head.lookAt(tgtW); head.traverse(o => { if (o.isMesh) o.castShadow = kind !== 'soft'; });
    const L = new THREE.SpotLight(color, 0, 18, angle, penumbra, 2); const hw = new THREE.Vector3(); head.getWorldPosition(hw);
    L.position.copy(hw); L.target.position.copy(tgtW); scene.add(L, L.target);
    if (shadow) { L.castShadow = true; L.shadow.mapSize.set(1024, 1024); L.shadow.bias = -.0004; L.shadow.normalBias = .02; L.shadow.radius = 4; }
    const bm = beam(color, len, rad); bm.position.copy(hw); bm.lookAt(tgtW); scene.add(bm);
    const lamp = { id, kind, grp, head, lens, light: L, beam: bm, on: false, k: 0, max: intensity, anchor: () => head.getWorldPosition(new THREE.Vector3()).add(V3(0, .35, 0)) };
    lamps.push(lamp); return lamp;
  };
  addLamp({ id: 'key', kind: 'fresnel', pos: V3(-2.7, 0, .7), h: 2.25, target: V3(-.7, 1.2, -1.3), color: 0xffc896, intensity: 95, angle: .42, penumbra: .55, shadow: true, len: 3.8, rad: 1.1 });
  addLamp({ id: 'fill', kind: 'soft', pos: V3(2.6, 0, .9), h: 1.75, target: V3(.1, 1.1, -1.3), color: 0xe4ecff, intensity: 38, angle: .85, penumbra: 1, shadow: false, len: 2.6, rad: 1.7 });
  addLamp({ id: 'back', kind: 'fresnel', pos: V3(2.0, 0, -3.15), h: 2.7, target: V3(-.4, 1.3, -1.25), color: 0xcfe0ff, intensity: 70, angle: .38, penumbra: .45, shadow: false, len: 3.2, rad: .95 });
  addLamp({ id: 'set', kind: 'fresnel', pos: V3(-1.9, 0, -2.2), h: .45, target: V3(.6, 2.4, -3.9), color: 0xffb27a, intensity: 55, angle: .62, penumbra: .8, shadow: false, len: 2.2, rad: 1.0 });

  // cameras
  const cams = [];
  const addCam = ({ id, pos, h, look, fov, dolly }) => {
    const grp = new THREE.Group(); grp.position.copy(pos); scene.add(grp);
    if (dolly) {
      for (const x of [-.18, .18]) { const r = new THREE.Mesh(new THREE.BoxGeometry(.03, .03, 2.4), M.steel); r.position.set(x, .015, 0); grp.add(r); }
      for (let i = -5; i <= 5; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(.5, .02, .05), mat(0x3a2a1c, .8)); s.position.set(0, .005, i * .22); grp.add(s); }
    }
    const rig = new THREE.Group(); grp.add(rig);
    if (dolly) { const cart = new THREE.Mesh(new THREE.BoxGeometry(.5, .12, .55), M.dark); cart.position.y = .09; rig.add(cart); }
    const tp = tripod(h - (dolly ? .15 : 0)); tp.position.y = dolly ? .15 : 0; rig.add(tp);
    const { g: body, tally, scr } = cinemaCamera(); body.position.y = h + .12; rig.add(body);
    rig.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const c = { id, grp, rig, body, tally, scr, look, fov, dolly, anchor: () => body.getWorldPosition(new THREE.Vector3()).add(V3(0, .3, 0)) };
    cams.push(c); return c;
  };
  addCam({ id: 'a', pos: V3(.15, 0, 2.5), h: 1.38, look: V3(-.5, 1.32, -1.25), fov: 32 });
  addCam({ id: 'b', pos: V3(1.9, 0, .6), h: 1.12, look: V3(0, 1.12, -1.55), fov: 20, dolly: true });
  const aimCams = () => cams.forEach(c => { const p = c.body.getWorldPosition(new THREE.Vector3()); const t = c.look.clone(); c.body.lookAt(t.x, t.y, t.z); c.body.position.y = c.body.position.y; void p; });
  aimCams();

  // actors (loaded async)
  const actors = []; const mixers = [];
  const loader = new GLTFLoader(); loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(ui.model);
  const clip = n => gltf.animations.find(a => a.name === n);
  const agreeAdd = THREE.AnimationUtils.makeClipAdditive(clip('agree').clone());
  const mkActor = (id, markI, bodyColor, jointColor) => {
    const m = SkeletonUtils.clone(gltf.scene); m.scale.setScalar(.98);
    m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.material = o.material.clone(); const isJ = /Joint/i.test(o.material.name); o.material.color.set(isJ ? jointColor : bodyColor); o.material.roughness = isJ ? .45 : .55; o.material.metalness = isJ ? .4 : .1; } });
    m.position.copy(marks[markI]); scene.add(m);
    const mixer = new THREE.AnimationMixer(m); mixers.push(mixer);
    const idle = mixer.clipAction(clip('idle')).play(), walk = mixer.clipAction(clip('walk')); walk.setEffectiveWeight(0).play();
    const talk = mixer.clipAction(agreeAdd); talk.setEffectiveWeight(0); talk.play();
    const a = { id, m, mixer, idle, walk, talk, mark: markI, path: null, anchor: () => m.position.clone().add(V3(0, 2.05, 0)) };
    actors.push(a); return a;
  };
  mkActor('presenter', 0, 0xd9d6cf, 0x2b2b2e);
  mkActor('guest', 1, 0x3c3f45, 0xb9bcc2);
  const faceFront = a => { const t = cams[0].grp.position; a.m.rotation.y = Math.atan2(t.x - a.m.position.x, t.z - a.m.position.z); };
  actors.forEach(faceFront);

  /* ---------- state + views ---------- */
  const views = {
    set: () => { const port = cam.aspect < .9; return { pos: port ? V3(4.8, 4.4, 10.2) : V3(4.6, 2.7, 6.6), look: port ? V3(-.55, .9, -.7) : V3(-.2, 1.0, -1.0), fov: port ? 50 : 38 }; },
    a: () => { const c = cams[0]; const p = c.body.getWorldPosition(new THREE.Vector3()).add(V3(0, .02, 0)); const dir = c.look.clone().sub(p).normalize(); return { pos: p.add(dir.multiplyScalar(.35)), look: c.look.clone(), fov: cam.aspect < .9 ? 44 : c.fov } },
    b: () => { const c = cams[1]; const p = c.body.getWorldPosition(new THREE.Vector3()); const dir = c.look.clone().sub(p).normalize(); return { pos: p.add(dir.multiplyScalar(.35)), look: c.look.clone(), fov: cam.aspect < .9 ? 30 : c.fov } },
  };
  let view = 'set', yaw = 0, yawT = 0, from = null, tween = 1, autoYaw = true;
  const curLook = V3(-.2, 1, -1);
  const setView = v => { from = { pos: cam.position.clone(), look: curLook.clone(), fov: cam.fov }; view = v; tween = 0; cams.forEach(c => c.tally.material.color.set(c.id === v ? 0xff2a2a : 0x441111)); ui.onView?.(v); };

  const toggleLamp = (id, force) => {
    const l = lamps.find(x => x.id === id); if (!l) return; l.on = force ?? !l.on; ui.onLamp?.(id, l.on);
  };
  const moveActor = id => {
    const a = actors.find(x => x.id === id); if (!a || a.path) return;
    const taken = actors.filter(x => x !== a).map(x => x.mark);
    let n = a.mark; do n = (n + 1) % marks.length; while (taken.includes(n));
    a.path = { from: a.m.position.clone(), to: marks[n].clone(), t: 0 }; a.mark = n;
    ui.onActor?.(id);
  };
  let spin = 0; const spinProduct = () => { spin = 2.4; };

  // resize
  const resize = () => { const r = canvas.getBoundingClientRect(); if (!r.width) return; renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix(); if (tween >= 1) { const t = views[view](); cam.position.copy(t.pos); cam.fov = t.fov; cam.updateProjectionMatrix(); } };
  resize(); new ResizeObserver(resize).observe(canvas);
  { const t = views.set(); cam.position.copy(t.pos); curLook.copy(t.look); cam.fov = t.fov; cam.lookAt(curLook); cam.updateProjectionMatrix(); }

  // tap = raycast pick; horizontal drag in the overview orbits a little (vertical swipes keep scrolling)
  const ray = new THREE.Raycaster(), nd = new THREE.Vector2();
  const pickables = [...lamps.map(l => [l.grp, () => toggleLamp(l.id)]), ...cams.map(c => [c.grp, () => setView(view === c.id ? 'set' : c.id)]), ...actors.map(a => [a.m, () => moveActor(a.id)]), [turntable, spinProduct], [plinth, spinProduct]];
  const pickAt = (x, y) => { const r = canvas.getBoundingClientRect(); nd.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1); ray.setFromCamera(nd, cam); let best = null, bd = 1e9; for (const [o, fn] of pickables) { const h = ray.intersectObject(o, true)[0]; if (h && h.distance < bd) { bd = h.distance; best = fn; } } return best; };
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: Date.now(), yaw: yawT }; });
  canvas.addEventListener('pointermove', e => { if (!down || view !== 'set') return; const dx = e.clientX - down.x; if (Math.abs(dx) > 8) { autoYaw = false; yawT = Math.max(-.7, Math.min(.7, down.yaw - dx * .004)); } });
  canvas.addEventListener('pointerup', e => { if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); if (moved < 10 && Date.now() - down.t < 600) { const fn = pickAt(e.clientX, e.clientY); if (fn) fn(); else if (view !== 'set') setView('set'); } down = null; });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' || down) return; canvas.style.cursor = pickAt(e.clientX, e.clientY) ? 'pointer' : 'grab'; });

  // labels follow their objects on screen
  const items = [...lamps.map(l => ({ id: 'lamp:' + l.id, anchor: l.anchor })), ...cams.map(c => ({ id: 'cam:' + c.id, anchor: c.anchor })), ...actors.map(a => ({ id: 'actor:' + a.id, anchor: a.anchor }))];
  const v = new THREE.Vector3();

  let on = true, raf = 0; const clock = new THREE.Clock(); let t = 0, talkT = 0;
  new IntersectionObserver(es => { on = es[0].isIntersecting; if (on) go(); }, { threshold: 0 }).observe(canvas);
  const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const frame = () => {
    raf = 0; if (!on || document.hidden) return;
    const dt = Math.min(clock.getDelta(), .05); t += dt;
    // lamps fade like real tungsten
    for (const l of lamps) { l.k += ((l.on ? 1 : 0) - l.k) * Math.min(1, dt * (l.on ? 5 : 3)); l.light.intensity = l.max * l.k; l.beam.material.uniforms.k.value = l.k; l.lens.material.emissiveIntensity = l.k * (l.kind === 'soft' ? 1.4 : 3); }
    // dolly B slides slowly along its track
    cams[1].rig.position.z = Math.sin(t * .35) * .75; cams[1].body.lookAt(cams[1].look);
    // product turntable
    spin = Math.max(0, spin - dt * .8); turntable.rotation.y += dt * (.25 + spin * 2.2);
    // actors
    talkT += dt;
    for (const a of actors) {
      if (a.path) {
        const p = a.path, dist = p.from.distanceTo(p.to); p.t = Math.min(1, p.t + dt * 1.1 / Math.max(.3, dist));
        a.m.position.lerpVectors(p.from, p.to, p.t);
        const dir = p.to.clone().sub(p.from); a.m.rotation.y = Math.atan2(dir.x, dir.z);
        a.walk.setEffectiveWeight(Math.min(1, a.walk.getEffectiveWeight() + dt * 4)); a.idle.setEffectiveWeight(1 - a.walk.getEffectiveWeight());
        if (p.t >= 1) { a.path = null; }
      } else {
        a.walk.setEffectiveWeight(Math.max(0, a.walk.getEffectiveWeight() - dt * 4)); a.idle.setEffectiveWeight(1 - a.walk.getEffectiveWeight());
        const tgt = cams[0].grp.position; const want = Math.atan2(tgt.x - a.m.position.x, tgt.z - a.m.position.z); let d = want - a.m.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); a.m.rotation.y += d * Math.min(1, dt * 4);
      }
      const speaking = a.id === 'presenter' && (Math.sin(talkT * .9) > -.2);
      a.talk.setEffectiveWeight(THREE.MathUtils.lerp(a.talk.getEffectiveWeight(), speaking && !a.path ? .9 : 0, dt * 3));
    }
    mixers.forEach(m => m.update(dt));
    // camera
    if (autoYaw && view === 'set') yawT = Math.sin(t * .12) * .22;
    yaw += (yawT - yaw) * Math.min(1, dt * 4);
    const target = views[view]();
    if (view === 'set') { const r = target.pos.clone().sub(target.look); r.applyAxisAngle(V3(0, 1, 0), yaw); target.pos = target.look.clone().add(r); }
    if (tween < 1 && from) { tween = Math.min(1, tween + dt / 1.3); const k = ease(tween); cam.position.lerpVectors(from.pos, target.pos, k); curLook.lerpVectors(from.look, target.look, k); cam.fov = THREE.MathUtils.lerp(from.fov, target.fov, k); }
    else { cam.position.lerp(target.pos, Math.min(1, dt * 3)); curLook.lerp(target.look, Math.min(1, dt * 3)); cam.fov += (target.fov - cam.fov) * Math.min(1, dt * 3); }
    if (view !== 'set') { cam.position.y += Math.sin(t * 1.3) * .0015; }
    cam.lookAt(curLook); cam.updateProjectionMatrix();
    renderer.render(scene, cam);
    // project labels
    if (ui.place) { const r = canvas.getBoundingClientRect(); for (const it of items) { v.copy(it.anchor()).project(cam); ui.place(it.id, (v.x * .5 + .5) * r.width, (-v.y * .5 + .5) * r.height, v.z < 1 && view === 'set'); } }
    go();
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', go);
  // the set warms up: lamps come on one by one
  ['set', 'back', 'fill', 'key'].forEach((id, i) => setTimeout(() => toggleLamp(id, true), 500 + i * 650));
  go();
  ui.onReady?.();
  return { toggleLamp, setView, moveActor, spinProduct, lamps: () => lamps.map(l => ({ id: l.id, on: l.on })) };
}
