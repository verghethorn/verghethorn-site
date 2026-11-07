// HERO — a film set you can direct: drag the key light, tap a camera to look through it.
import { THREE, createStage, currentLook, onLook, reduce, coarse, clamp, damp, ease, makeBeam, radialTexture } from './core.js';
import { RoundedBoxGeometry } from '/static/vendor/three/RoundedBoxGeometry.js';

export function initSet(host, T, sfx) {
  const st = createStage(host, { shadows: true, fov: 30, envIntensity: .55 });
  if (!st) return null;
  const { scene, camera, renderer } = st;
  let L = currentLook();

  /* ---------- materials ---------- */
  const M = {
    clay: new THREE.MeshStandardMaterial({ color: 0xE9E5DF, roughness: .6 }),
    floor: new THREE.MeshStandardMaterial({ color: L.floor, roughness: .95 }),
    body: new THREE.MeshStandardMaterial({ color: 0x2E3034, roughness: .4, metalness: .35 }),
    shell: new THREE.MeshStandardMaterial({ color: 0x55575D, roughness: .6, metalness: .1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x9A9DA4, roughness: .28, metalness: .9 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x17181B, roughness: .7, metalness: .2 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x0B0D12, roughness: .04, metalness: .1, clearcoat: 1 }),
    wood: new THREE.MeshStandardMaterial({ color: 0xC9A27A, roughness: .7 }),
    softbox: new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.4, toneMapped: false }),
    tally: new THREE.MeshBasicMaterial({ color: 0xFF3B30, toneMapped: false }),
    tape: new THREE.MeshStandardMaterial({ color: L.accent, roughness: .8 }),
  };
  const shadowAll = o => o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });

  /* ---------- cyclorama: floor curving into the wall ---------- */
  {
    const wallZ = 7, R = 3.2, H = 12, front = 16, W = 60;
    const prof = [[front, 0], [-wallZ + R, 0]];
    for (let i = 1; i <= 20; i++) { const a = i / 20 * Math.PI / 2; prof.push([-wallZ + R - Math.sin(a) * R, R - Math.cos(a) * R]); }
    prof.push([-wallZ, H]);
    const pos = [], idx = [];
    prof.forEach(([z, y]) => { pos.push(-W / 2, y, z, W / 2, y, z); });
    for (let j = 0; j < prof.length - 1; j++) { const a = j * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const cyc = new THREE.Mesh(g, M.floor); cyc.receiveShadow = true; scene.add(cyc);
  }
  const grid = new THREE.GridHelper(14, 28, L.grid, L.grid);
  grid.material.transparent = true; grid.material.opacity = .45; grid.position.y = .002; scene.add(grid);

  /* ---------- the subject: a clay figure ---------- */
  const subject = new THREE.Group(); subject.rotation.y = .35; scene.add(subject);
  const cap = (r, l) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 6, 16), M.clay);
  const sph = r => new THREE.Mesh(new THREE.SphereGeometry(r, 28, 18), M.clay);
  const hips = new THREE.Group(); hips.position.y = .98; hips.rotation.z = .03; subject.add(hips);
  { const p = sph(.16); p.scale.set(1.15, .8, .8); hips.add(p); }
  const spine = new THREE.Group(); spine.position.y = .08; hips.add(spine);
  { const t = cap(.15, .3); t.position.y = .25; t.scale.set(1.12, 1, .74); spine.add(t); }
  const chest = sph(.17); chest.position.y = .44; chest.scale.set(1.25, .9, .78); spine.add(chest);
  { const n = cap(.05, .08); n.position.y = .6; spine.add(n); }
  const head = new THREE.Group(); head.position.y = .73; spine.add(head);
  { const s = sph(.112); s.scale.set(.9, 1.14, 1); head.add(s); }
  const limb = (parent, at, r1, l1, r2, l2, endR, rot1, rot2) => {
    const j1 = new THREE.Group(); j1.position.set(...at); j1.rotation.set(...rot1); parent.add(j1);
    const a = cap(r1, l1); a.position.y = -(l1 / 2 + r1 * .6); j1.add(a);
    const j2 = new THREE.Group(); j2.position.y = -(l1 + r1 * 1.3); j2.rotation.set(...rot2); j1.add(j2);
    const b = cap(r2, l2); b.position.y = -(l2 / 2 + r2 * .6); j2.add(b);
    const e = sph(endR); e.position.y = -(l2 + r2 * 1.6); e.scale.set(.8, 1.2, .7); j2.add(e);
    return [j1, j2, e];
  };
  limb(spine, [.22, .5, 0], .05, .25, .045, .23, .05, [0, 0, .16], [-.2, 0, 0]);
  limb(spine, [-.22, .5, 0], .05, .25, .045, .23, .05, [-.35, 0, -.12], [-1.05, 0, 0]);
  const legs = [[.09, -.04, 0, [.02, 0, .02], [0, 0, 0]], [-.09, -.04, 0, [-.12, 0, -.03], [.2, 0, 0]]];
  legs.forEach(([x, y, z, r1, r2]) => {
    const [, , foot] = limb(hips, [x, y, z], .07, .36, .055, .36, .06, r1, r2);
    foot.scale.set(.9, .5, 2.1); foot.position.z += .05;
  });
  shadowAll(subject);
  // tape mark under the subject
  [[0, .9, .03, .38], [0, .74, .22, .03]].forEach(([x, z, w, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .004, d), M.tape); m.position.set(x, .003, z - .7); scene.add(m); });
  const focus = new THREE.Vector3(0, 1.35, 0);

  /* ---------- cinema cameras ---------- */
  function cineCam() {
    const g = new THREE.Group();
    const add = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); g.add(m); return m; };
    add(new RoundedBoxGeometry(.2, .22, .34, 3, .025), M.body, 0, 0, 0);
    add(new THREE.CylinderGeometry(.056, .062, .22, 28), M.dark, 0, 0, .27, Math.PI / 2);
    add(new THREE.CylinderGeometry(.07, .07, .035, 28), M.metal, 0, 0, .23, Math.PI / 2);
    add(new THREE.CylinderGeometry(.066, .066, .02, 28), M.metal, 0, 0, .34, Math.PI / 2);
    add(new THREE.CircleGeometry(.05, 28), M.glass, 0, 0, .382);
    [[0, .095, .26, .015], [0, -.095, .26, .015], [.125, 0, .015, .19], [-.125, 0, .015, .19]].forEach(([x, y, w, h]) => add(new THREE.BoxGeometry(w, h, .13), M.body, x, y, .44));
    add(new THREE.BoxGeometry(.035, .028, .26), M.body, 0, .16, .02);
    add(new THREE.BoxGeometry(.02, .05, .02), M.body, 0, .135, .12); add(new THREE.BoxGeometry(.02, .05, .02), M.body, 0, .135, -.08);
    add(new THREE.CylinderGeometry(.024, .03, .15, 16), M.dark, -.13, .07, .06, Math.PI / 2);
    add(new THREE.BoxGeometry(.16, .12, .05), M.dark, 0, -.01, -.2);
    [-.04, .04].forEach(x => add(new THREE.CylinderGeometry(.008, .008, .5, 8), M.metal, x, -.13, .12, Math.PI / 2));
    const tally = add(new THREE.SphereGeometry(.013, 12, 8), M.tally, .07, .118, .15);
    g.userData.tally = tally;
    shadowAll(g);
    return g;
  }
  const leg3 = (parent, h, spread, mat = M.metal) => {
    for (let i = 0; i < 3; i++) {
      const a = i / 3 * Math.PI * 2 + .3;
      const foot = new THREE.Vector3(Math.cos(a) * spread, 0, Math.sin(a) * spread);
      const top = new THREE.Vector3(0, h, 0);
      const len = foot.distanceTo(top);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.012, .015, len, 8), mat);
      m.position.copy(foot).add(top).multiplyScalar(.5);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(foot).normalize());
      m.castShadow = true; parent.add(m);
    }
  };

  const cams = [];
  // CAM A — on a dolly track
  {
    const rig = new THREE.Group(); rig.position.set(0, 0, 4.4); scene.add(rig);
    [-.26, .26].forEach(z => { const r = new THREE.Mesh(new THREE.BoxGeometry(6.4, .035, .05), M.metal); r.position.set(0, .03, z); r.receiveShadow = r.castShadow = true; rig.add(r); });
    for (let x = -3; x <= 3.01; x += .5) { const t = new THREE.Mesh(new THREE.BoxGeometry(.06, .025, .72), M.wood); t.position.set(x, .012, 0); t.receiveShadow = true; rig.add(t); }
    const cart = new THREE.Group(); rig.add(cart);
    { const b = new THREE.Mesh(new RoundedBoxGeometry(.7, .12, .66, 2, .02), M.dark); b.position.y = .14; cart.add(b);
      const p = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, 1.15, 16), M.metal); p.position.y = .76; cart.add(p);
      [-.28, .28].forEach(x => [-.26, .26].forEach(z => { const w = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .04, 16), M.dark); w.rotation.x = Math.PI / 2; w.position.set(x, .07, z); cart.add(w); })); }
    shadowAll(cart);
    const cam = cineCam(); cam.position.y = 1.45; cart.add(cam);
    cams.push({ id: 'A', lens: 35, fov: 30, model: cam, update: t => { cart.position.x = reduce ? .8 : Math.sin(t * .22) * 2.2 + .4; } });
  }
  // CAM B — on a jib
  {
    const base = new THREE.Group(); base.position.set(-4.3, 0, .6); scene.add(base);
    leg3(base, 1.3, .55);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(.045, .05, .5, 12), M.metal); post.position.y = 1.5; base.add(post);
    const yaw = new THREE.Group(); yaw.position.y = 1.75; base.add(yaw);
    const pitch = new THREE.Group(); yaw.add(pitch);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, 4.2), M.body); arm.position.z = 1.1; pitch.add(arm);
    const cw = new THREE.Mesh(new RoundedBoxGeometry(.24, .26, .3, 2, .03), M.dark); cw.position.z = -.9; pitch.add(cw);
    const end = new THREE.Group(); end.position.set(0, -.12, 3.2); pitch.add(end);
    const cam = cineCam(); end.add(cam);
    shadowAll(base);
    cams.push({ id: 'B', lens: 24, fov: 40, model: cam, update: t => {
      const s = reduce ? 0 : 1;
      yaw.rotation.y = .62 + Math.sin(t * .17) * .32 * s;
      pitch.rotation.x = -.12 + Math.sin(t * .23 + 1) * .16 * s;
    } });
  }
  // CAM C — on a tripod, close-up
  {
    const base = new THREE.Group(); base.position.set(3.1, 0, -.4); scene.add(base);
    leg3(base, 1.25, .5);
    const headG = new THREE.Mesh(new RoundedBoxGeometry(.16, .1, .16, 2, .02), M.dark); headG.position.y = 1.3; base.add(headG);
    const cam = cineCam(); cam.position.y = 1.47; base.add(cam);
    shadowAll(base);
    cams.push({ id: 'C', lens: 85, fov: 14, model: cam, update: () => {} });
  }

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight(0xffffff, 0xd9d6d0, L.amb); scene.add(hemi);
  // key — softbox on a stand, draggable
  const key = new THREE.Group(); scene.add(key);
  const keyHeight = 2.55;
  {
    leg3(key, .5, .42);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.014, .018, keyHeight, 8), M.metal); pole.position.y = keyHeight / 2; pole.castShadow = true; key.add(pole);
  }
  const keyHead = new THREE.Group(); keyHead.position.y = keyHeight; key.add(keyHead);
  {
    const inner = new THREE.Group(); inner.rotation.x = -Math.PI / 2; keyHead.add(inner);
    const fb = new THREE.Mesh(new THREE.CylinderGeometry(.13, .62, .5, 4, 1, false), M.shell); fb.rotation.y = Math.PI / 4; inner.add(fb); fb.castShadow = true;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(.86, .86), M.softbox); face.position.z = .3; keyHead.add(face);
    keyHead.userData.face = face;
  }
  const spot = new THREE.SpotLight(L.key, 60 * L.keyI, 14, .52, .75, 1.6);
  spot.castShadow = true; spot.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  spot.shadow.bias = -.0004; spot.shadow.normalBias = .02; spot.shadow.radius = 4;
  scene.add(spot); scene.add(spot.target); spot.target.position.copy(focus);
  const beam = makeBeam(L.key); scene.add(beam);
  const flare = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture('rgba(150,190,255,.9)', 'rgba(150,190,255,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  flare.scale.set(5, .12, 1); flare.visible = false; scene.add(flare);

  // fill — a white bounce board (poly V-flat) on the right
  {
    const vf = new THREE.Group(); vf.position.set(4.6, 0, .9); vf.scale.setScalar(.8); scene.add(vf);
    const board = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: .9 });
    const a = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, .06), board); a.position.set(-.42, 1.2, 0); a.rotation.y = .5;
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.4, .06), board); b.position.set(.42, 1.2, 0); b.rotation.y = -.5;
    vf.add(a, b); vf.lookAt(0, 0, 0); vf.rotateY(Math.PI); shadowAll(vf);
  }
  const fill = new THREE.DirectionalLight(0xffffff, L.fill * 1.6); fill.position.set(3, 2.2, 4); scene.add(fill);
  // rim — small fresnel behind
  const rim = new THREE.SpotLight(0xFFD9A8, 25, 10, .4, .6, 1.5); rim.position.set(-2.7, 1.65, -2.4); rim.target.position.set(0, 1.4, 0); scene.add(rim, rim.target);
  { const g = new THREE.Group(); g.position.set(-2.7, 0, -2.4); scene.add(g); leg3(g, .4, .3);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.012, .016, 1.5, 8), M.metal); pole.position.y = .75; g.add(pole);
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.13, .16, .3, 20), M.body); lamp.position.y = 1.62; g.add(lamp);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(.12, 20), M.softbox); lens.position.set(0, 1.62, .16); g.add(lens);
    g.children.forEach(c => c.castShadow = true);
    const look = new THREE.Vector3(0, 1.4, 0); lamp.lookAt(look); lamp.rotateX(Math.PI / 2); lens.lookAt(look); }
  // apple boxes — every set has them
  [[1.25, .1, -1.6, 0], [1.3, .3, -1.62, .15], [-1.5, .1, 1.4, .4]].forEach(([x, y, z, r]) => {
    const b = new THREE.Mesh(new RoundedBoxGeometry(.5, .2, .3, 2, .012), M.wood); b.position.set(x, y, z); b.rotation.y = r; b.castShadow = b.receiveShadow = true; scene.add(b);
  });

  /* ---------- schematic lines ---------- */
  const lineMat = new THREE.LineDashedMaterial({ color: L.ink, dashSize: .09, gapSize: .07, transparent: true, opacity: .35 });
  const mkLine = () => { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]); const l = new THREE.Line(g, lineMat); scene.add(l); return l; };
  const keyLine = mkLine(), camLine = mkLine();
  const setLine = (l, a, b) => { const p = l.geometry.attributes.position; p.setXYZ(0, a.x, a.y, a.z); p.setXYZ(1, b.x, b.y, b.z); p.needsUpdate = true; l.computeLineDistances(); };

  /* ---------- state ---------- */
  const s = {
    keyAng: 2.25, keyR: 3.4, keyAngT: 2.25, keyRT: 3.4,
    yaw: .5, yawT: .5, pitch: .36, dist: 15, view: null, vt: 0, vtT: 0, lastView: null,
    drag: null, sx: 0, sy: 0, moved: 0, hoverKey: false,
  };
  const keyPos = new THREE.Vector3();
  const placeKey = () => {
    keyPos.set(Math.cos(s.keyAng) * s.keyR, keyHeight, Math.sin(s.keyAng) * s.keyR);
    key.position.set(keyPos.x, 0, keyPos.z);
    keyHead.lookAt(focus);
    const front = new THREE.Vector3(0, 0, .32).applyQuaternion(keyHead.getWorldQuaternion(new THREE.Quaternion())).add(keyHead.getWorldPosition(new THREE.Vector3()));
    spot.position.copy(front);
    beam.aim(front, new THREE.Vector3(focus.x, 0, focus.z).lerp(focus, .35), .5);
    flare.position.copy(front);
  };

  /* ---------- HUD (DOM) ---------- */
  const hud = host.querySelector('.set-hud');
  const keyLabel = hud.querySelector('[data-label=key]');
  const camBtns = cams.map(c => { const b = hud.querySelector(`[data-cam="${c.id}"]`); b.addEventListener('click', () => lookThrough(c)); return b; });
  const vf = host.querySelector('.viewfinder');
  const vfInfo = vf.querySelector('[data-vf-info]'), vfTc = vf.querySelector('[data-vf-tc]');
  vf.querySelector('[data-vf-exit]').addEventListener('click', () => exitView());
  addEventListener('keydown', e => { if (e.key === 'Escape' && s.view) exitView(); });

  function lookThrough(c) {
    if (s.view === c) { exitView(); return; }
    s.view = c; s.lastView = c; s.vtT = 1;
    vf.hidden = false; requestAnimationFrame(() => vf.classList.add('is-on'));
    (host.closest('.hero') || host).classList.add('is-viewing');
    vfInfo.textContent = `CAM ${c.id} · ${c.lens} mm · T2.0 · ISO 800 · ${L.night ? '3200K' : '5600K'}`;
    camBtns.forEach((b, i) => b.setAttribute('aria-pressed', String(cams[i] === c)));
    sfx?.('shutter');
    st.kick();
  }
  function exitView() {
    s.view = null; s.vtT = 0;
    vf.classList.remove('is-on'); (host.closest('.hero') || host).classList.remove('is-viewing');
    setTimeout(() => { if (!s.view) vf.hidden = true; }, 400);
    camBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
    sfx?.('tick');
  }

  /* ---------- interaction ---------- */
  const ray = new THREE.Raycaster();
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const keyPick = [], camPick = new Map();
  key.traverse(o => { if (o.isMesh) keyPick.push(o); });
  cams.forEach(c => c.model.traverse(o => { if (o.isMesh) camPick.set(o, c); }));
  const hit = e => {
    ray.setFromCamera(st.ndc(e), camera);
    const k = ray.intersectObjects(keyPick, false)[0];
    const c = ray.intersectObjects([...camPick.keys()], false)[0];
    if (k && (!c || k.distance < c.distance)) return { type: 'key' };
    if (c) return { type: 'cam', cam: camPick.get(c.object) };
    return { type: 'floor', point: ray.ray.intersectPlane(floorPlane, new THREE.Vector3()) };
  };
  const moveKeyTo = p => {
    if (!p) return;
    s.keyAngT = Math.atan2(p.z, p.x);
    s.keyRT = clamp(Math.hypot(p.x, p.z), 1.9, 6);
  };
  const cv = st.canvas;
  cv.addEventListener('pointerdown', e => {
    if (s.view) return;
    const h = hit(e);
    s.sx = e.clientX; s.sy = e.clientY; s.moved = 0;
    s.drag = h.type === 'key' ? 'key' : h.type === 'cam' ? { cam: h.cam } : 'orbit';
    if (s.drag === 'key') { cv.setPointerCapture(e.pointerId); host.classList.add('is-grabbing'); sfx?.('tick'); }
  });
  cv.addEventListener('pointermove', e => {
    if (!s.drag) {
      if (e.pointerType === 'mouse' && !s.view) {
        const h = hit(e);
        cv.style.cursor = h.type === 'key' ? 'grab' : h.type === 'cam' ? 'pointer' : 'default';
        s.hoverKey = h.type === 'key';
      }
      return;
    }
    s.moved += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
    if (s.drag === 'key') {
      ray.setFromCamera(st.ndc(e), camera);
      moveKeyTo(ray.ray.intersectPlane(floorPlane, new THREE.Vector3()));
      st.kick();
    } else if (s.drag === 'orbit' && e.pointerType === 'mouse') {
      s.yawT = clamp(s.yawT - (e.movementX || 0) * .004, -.2, 1.25);
    }
  });
  const up = e => {
    const d = s.drag; s.drag = null; host.classList.remove('is-grabbing');
    if (!d) return;
    const dist = Math.hypot(e.clientX - s.sx, e.clientY - s.sy);
    if (dist < 8) {
      if (d.cam) lookThrough(d.cam);
      else if (d === 'orbit') { const h = hit(e); if (h.type === 'floor') { moveKeyTo(h.point); sfx?.('tick'); } }
    }
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', () => { s.drag = null; host.classList.remove('is-grabbing'); });

  /* ---------- framing ---------- */
  const orbitPos = new THREE.Vector3(), orbitTarget = new THREE.Vector3(0, .95, 0);
  let baseFov = 30, shiftY = .2, aspect = 1.6;
  const lensFov = v => aspect >= 1.4 ? v : Math.min(80, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(v) / 2) * 1.6 / aspect)));
  st.onResize((w, h) => {
    const ar = w / h, portrait = ar < 1; aspect = ar;
    baseFov = portrait ? 46 : ar < 1.4 ? 38 : 30;
    s.dist = portrait ? 13.5 : 15;
    shiftY = portrait ? .24 : .19;
  });

  /* ---------- look changes ---------- */
  const applyLook = () => {
    L = currentLook();
    M.floor.color.set(L.floor); grid.material.color.set(L.grid);
    hemi.intensity = L.amb; hemi.groundColor.set(L.night ? 0x0d0e12 : 0xd9d6d0);
    spot.color.set(L.key); spot.intensity = 60 * L.keyI;
    fill.intensity = L.fill * 1.6;
    rim.intensity = L.night ? 45 : 25;
    beam.material.uniforms.uColor.value.set(L.key); beam.material.uniforms.uStrength.value = L.beam;
    beam.material.blending = L.night ? THREE.AdditiveBlending : THREE.NormalBlending; beam.material.needsUpdate = true;
    M.softbox.emissive.set(L.night ? 0xFFE2BC : 0xffffff);
    M.tape.color.set(L.accent);
    lineMat.color.set(L.ink); lineMat.opacity = L.night ? .45 : .32;
    flare.visible = !!L.flare;
    scene.environmentIntensity = L.night ? .18 : .55;
    if (s.view) vfInfo.textContent = `CAM ${s.view.id} · ${s.view.lens} mm · T2.0 · ISO 800 · ${L.night ? '3200K' : '5600K'}`;
    st.kick();
  };
  onLook(applyLook); applyLook();

  /* ---------- loop ---------- */
  const tmpQ = new THREE.Quaternion(), flip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
  const camWorld = new THREE.Vector3(), lookM = new THREE.Matrix4();
  const oQ = new THREE.Quaternion(), vQ = new THREE.Quaternion(), vP = new THREE.Vector3();
  const headTarget = new THREE.Vector3();
  let tcStart = performance.now();
  st.onFrame((dt, t) => {
    // key light easing
    s.keyAng = damp(s.keyAng, s.keyAngT, 8, dt); s.keyR = damp(s.keyR, s.keyRT, 8, dt);
    placeKey();
    // cameras move
    cams.forEach(c => { c.update(t); c.model.parent.updateMatrixWorld(true); c.model.lookAt(focus); c.model.userData.tally.visible = (Math.floor(t * 1.6) % 2 === 0) || s.view === c; });
    // breathing + head follows the camera that is "live"
    if (!reduce) { chest.scale.y = .9 + Math.sin(t * 1.4) * .012; spine.rotation.y = Math.sin(t * .4) * .04; }
    const live = s.view || s.lastView || cams[0];
    live.model.getWorldPosition(headTarget);
    const local = subject.worldToLocal(headTarget.clone());
    const yawH = clamp(Math.atan2(local.x, local.z), -.7, .7);
    head.rotation.y = damp(head.rotation.y, yawH, 3, dt);
    // orbit camera
    if (!reduce && !s.drag) s.yawT += Math.sin(t * .08) * .0006;
    s.yaw = damp(s.yaw, s.yawT, 4, dt);
    orbitPos.set(Math.sin(s.yaw) * Math.cos(s.pitch) * s.dist, Math.sin(s.pitch) * s.dist + orbitTarget.y, Math.cos(s.yaw) * Math.cos(s.pitch) * s.dist);
    lookM.lookAt(orbitPos, orbitTarget, camera.up); oQ.setFromRotationMatrix(lookM);
    // look-through blend
    s.vt = reduce ? s.vtT : damp(s.vt, s.vtT, 3.2, dt);
    const v = s.view || s.lastView;
    let fov = baseFov;
    if (v && s.vt > .001) {
      v.model.getWorldPosition(camWorld);
      v.model.getWorldQuaternion(tmpQ);
      vQ.copy(tmpQ).multiply(flip);
      vP.copy(camWorld).add(new THREE.Vector3(0, .02, .42).applyQuaternion(tmpQ));
      const k = ease(Math.min(1, s.vt));
      camera.position.lerpVectors(orbitPos, vP, k);
      camera.quaternion.slerpQuaternions(oQ, vQ, k);
      fov = baseFov + (lensFov(v.fov) - baseFov) * k;
      cams.forEach(c => c.model.visible = !(c === v && s.vt > .6));
    } else {
      camera.position.copy(orbitPos); camera.quaternion.copy(oQ);
      cams.forEach(c => c.model.visible = true);
    }
    st.setShift(0, shiftY * (1 - ease(Math.min(1, s.vt))));
    if (Math.abs(camera.fov - fov) > .01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    // schematic lines
    setLine(keyLine, spot.position, focus);
    const a = cams[0].model.getWorldPosition(camWorld);
    setLine(camLine, a, focus);
    keyLine.visible = camLine.visible = s.vt < .5;
    // HUD positions
    const place = (el, v3, dx = 0, dy = 0) => { const p = st.project(v3); if (!p) { el.style.opacity = 0; return; } el.style.opacity = s.vt > .4 ? 0 : 1; el.style.transform = `translate(${p[0] + dx}px, ${p[1] + dy}px)`; };
    const ang = Math.round(THREE.MathUtils.radToDeg(Math.acos(clamp(
      new THREE.Vector3(spot.position.x, 0, spot.position.z).normalize().dot(new THREE.Vector3(a.x, 0, a.z).normalize()), -1, 1))));
    keyLabel.querySelector('[data-angle]').textContent = ang + '°';
    place(keyLabel, keyPos.clone().add(new THREE.Vector3(0, .62, 0)));
    cams.forEach((c, i) => place(camBtns[i], c.model.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, .34, 0))));
    host.classList.toggle('hover-key', s.hoverKey);
    if (s.view) {
      const f = Math.floor((performance.now() - tcStart) / (1000 / 24));
      const z = n => String(n).padStart(2, '0');
      vfTc.textContent = `${z(Math.floor(f / 86400) % 24)}:${z(Math.floor(f / 1440) % 60)}:${z(Math.floor(f / 24) % 60)}:${z(f % 24)}`;
    }
  });
  placeKey();
  return { lookThrough: id => lookThrough(cams.find(c => c.id === id)), exitView };
}
