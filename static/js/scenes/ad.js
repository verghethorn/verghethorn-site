// ADS — one product, many audiences. Each audience gets its own light, motion and camera.
// The glowing object is alive: grab it and throw it, and everything in the shot reacts.
import { THREE, createStage, currentLook, onLook, reduce, coarse, clamp, damp, radialTexture } from './core.js';

export const AUDIENCES = ['genz', 'business', 'public', 'science', 'family'];

const STYLE = {
  genz:     { bottle: 0xFF4FB8, label: ['#111111', '#C6FF3D'], orb: 0xC6FF3D, cam: [1.25, 1.55, 3.7], roll: .16, look: [0, 1.0, 0], cols: [0xFF4FB8, 0xC6FF3D, 0x5AE0FF, 0x8F6BFF], key: 0xFFFFFF },
  business: { bottle: 0x2C2F36, label: ['#F5F5F7', '#C9A86A'], orb: 0xE9C98A, cam: [0, 1.15, 4.3], roll: 0, look: [0, 1.0, 0], cols: [0xD8DCE2, 0xBFC5CE, 0xE9C98A], key: 0xFFF4E6 },
  public:   { bottle: 0x2B4A8B, label: ['#FFFFFF', '#E8EEF8'], orb: 0xFFFFFF, cam: [-1.2, 1.7, 3.9], roll: -.03, look: [0, 1.05, 0], cols: [0xFFFFFF, 0xF2F4F8], key: 0xFFFFFF },
  science:  { bottle: 0x7FC6E8, label: ['#0B3550', '#FFFFFF'], orb: 0x46B4FF, cam: [.95, .55, 3.8], roll: .02, look: [0, 1.1, 0], cols: [0x46B4FF, 0xFFFFFF, 0x1E6FB8], key: 0xE8F6FF },
  family:   { bottle: 0xF7A673, label: ['#FFFFFF', '#FFE4CC'], orb: 0xFFC27A, cam: [-.7, 1.25, 3.6], roll: 0, look: [0, 1.0, 0], cols: [0xFFE4CC, 0xFFFFFF, 0xFFC9A8], key: 0xFFE9D2 },
};

export function initAd(host, T, sfx) {
  const st = createStage(host, { fov: 32, envIntensity: 1 });
  if (!st) return null;
  const { scene, camera } = st;
  const hemi = new THREE.HemisphereLight(0xffffff, 0xe8e2da, .9); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-2.5, 3.5, 3); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(3, 2, -3); scene.add(rim);
  const font = getComputedStyle(document.body).fontFamily;

  /* ---------- the product ---------- */
  const prof = [[0, 0], [.33, 0], [.355, .03], [.36, .1], [.36, 1.08], [.35, 1.18], [.3, 1.3], [.2, 1.44], [.145, 1.52], [.145, 1.74], [0, 1.74]].map(([r, y]) => new THREE.Vector2(r, y));
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: .55, roughness: .26, clearcoat: 1, clearcoatRoughness: .08 });
  const bottle = new THREE.Group(); scene.add(bottle);
  const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 96), bodyMat); bottle.add(body);
  const capM = new THREE.MeshPhysicalMaterial({ color: 0x1D1D1F, metalness: .8, roughness: .3, clearcoat: 1 });
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(.158, .158, .26, 48), capM); capMesh.position.y = 1.86; bottle.add(capMesh);
  const lc = document.createElement('canvas'); lc.width = 1024; lc.height = 512;
  const labelTex = new THREE.CanvasTexture(lc); labelTex.colorSpace = THREE.SRGBColorSpace; labelTex.anisotropy = 8;
  const label = new THREE.Mesh(new THREE.CylinderGeometry(.364, .364, .62, 96, 1, true), new THREE.MeshPhysicalMaterial({ map: labelTex, roughness: .4, clearcoat: .6 }));
  label.position.y = .62; label.rotation.y = Math.PI; bottle.add(label);
  const drawLabel = (st_) => {
    const g = lc.getContext('2d'), [bg, fg] = st_.label;
    g.fillStyle = bg; g.fillRect(0, 0, 1024, 512);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 150px ${font}`; g.fillText('NOVA', 512, 230);
    g.font = `500 34px ${font}`; g.globalAlpha = .8; g.fillText(T.ad.labelLine, 512, 340); g.globalAlpha = 1;
    g.fillRect(380, 400, 264, 4);
    labelTex.needsUpdate = true;
  };
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), new THREE.MeshBasicMaterial({ map: radialTexture('rgba(0,0,0,.35)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = .001; scene.add(shadow);

  /* ---------- swarms, one per audience ---------- */
  const N = coarse ? 46 : 70;
  const geos = {
    genz: new THREE.IcosahedronGeometry(.07, 0),
    business: new THREE.BoxGeometry(.1, .1, .1),
    public: new THREE.PlaneGeometry(.2, .14),
    science: new THREE.SphereGeometry(.06, 20, 12),
    family: new THREE.SphereGeometry(.075, 24, 16),
  };
  const mats = {
    genz: new THREE.MeshPhysicalMaterial({ roughness: .25, clearcoat: 1 }),
    business: new THREE.MeshPhysicalMaterial({ roughness: .08, metalness: .6, clearcoat: 1 }),
    public: new THREE.MeshStandardMaterial({ roughness: .8, side: THREE.DoubleSide }),
    science: new THREE.MeshPhysicalMaterial({ roughness: .15, clearcoat: 1 }),
    family: new THREE.MeshPhysicalMaterial({ roughness: .05, transparent: true, opacity: .6, clearcoat: 1 }),
  };
  const rand = (() => { let x = 11; return () => ((x = (x * 16807) % 2147483647) / 2147483647); })();
  const swarms = {};
  AUDIENCES.forEach(a => {
    const m = new THREE.InstancedMesh(geos[a], mats[a], N);
    m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const P = [];
    for (let i = 0; i < N; i++) {
      P.push({ r: .7 + rand() * 1.5, h: .1 + rand() * 2.1, w: (.15 + rand() * .35) * (rand() < .5 ? -1 : 1), a: rand() * 6.28, s: .6 + rand() * .9,
        spin: new THREE.Vector3(rand(), rand(), rand()).multiplyScalar(2), off: new THREE.Vector3(), vel: new THREE.Vector3(), pos: new THREE.Vector3() });
      m.setColorAt(i, new THREE.Color(STYLE[a].cols[i % STYLE[a].cols.length]));
    }
    m.instanceColor.needsUpdate = true;
    m.visible = false; scene.add(m);
    swarms[a] = { mesh: m, P };
  });

  /* ---------- the living object ---------- */
  const orb = new THREE.Mesh(new THREE.SphereGeometry(.1, 32, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.setScalar(.9); orb.add(glow); scene.add(orb);
  const TRAIL = 48;
  const trailGeo = new THREE.BufferGeometry();
  const tPos = new Float32Array(TRAIL * 3), tCol = new Float32Array(TRAIL * 4);
  trailGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3));
  trailGeo.setAttribute('color', new THREE.BufferAttribute(tCol, 4));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }));
  trail.frustumCulled = false; scene.add(trail);
  const center = new THREE.Vector3(0, 1.0, 0);
  const o = { pos: new THREE.Vector3(1.2, 1.2, .4), vel: new THREE.Vector3(0, 0, -1.4), held: false };
  for (let i = 0; i < TRAIL; i++) tPos.set([o.pos.x, o.pos.y, o.pos.z], i * 3);

  /* ---------- audience switching ---------- */
  let cur = 'genz', S = STYLE.genz;
  const camPos = new THREE.Vector3(...S.cam), camLook = new THREE.Vector3(...S.look);
  let roll = S.roll, flash = 0;
  const orbCol = new THREE.Color(S.orb), bottleCol = new THREE.Color(S.bottle);
  const setAudience = a => {
    if (!STYLE[a]) return;
    swarms[cur].mesh.visible = false;
    cur = a; S = STYLE[a];
    swarms[cur].mesh.visible = true;
    swarms[cur].P.forEach(p => p.vel.set((rand() - .5) * 6, (rand() - .2) * 6, (rand() - .5) * 6)); // burst in
    drawLabel(S);
    key.color.set(S.key);
    o.vel.set((rand() - .5) * 3, 1.5, (rand() - .5) * 3);
    flash = 1;
    st.kick();
  };
  swarms.genz.mesh.visible = true; drawLabel(S);
  (document.fonts?.ready || Promise.resolve()).then(() => drawLabel(S));

  /* ---------- interaction: grab and throw ---------- */
  const ray = new THREE.Raycaster(); const plane = new THREE.Plane(); const hp = new THREE.Vector3();
  let last = new THREE.Vector3(), lastT = 0;
  const cv = st.canvas;
  const pickOrb = e => { ray.setFromCamera(st.ndc(e), camera); const d = ray.ray.distanceToPoint(o.pos); return d < .32; };
  cv.addEventListener('pointerdown', e => {
    if (!pickOrb(e)) return;
    o.held = true; cv.setPointerCapture(e.pointerId); host.classList.add('is-grabbing');
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), o.pos);
    last.copy(o.pos); lastT = performance.now(); sfx?.('pick');
  });
  cv.addEventListener('pointermove', e => {
    if (!o.held) { if (e.pointerType === 'mouse') cv.style.cursor = pickOrb(e) ? 'grab' : 'default'; return; }
    ray.setFromCamera(st.ndc(e), camera);
    if (ray.ray.intersectPlane(plane, hp)) {
      const now = performance.now(), dt = Math.max(8, now - lastT) / 1000;
      o.vel.copy(hp).sub(last).divideScalar(dt).clampLength(0, 9);
      o.pos.copy(hp); last.copy(hp); lastT = now; st.kick();
    }
  });
  const rel = () => { if (!o.held) return; o.held = false; host.classList.remove('is-grabbing'); sfx?.('whoosh'); };
  cv.addEventListener('pointerup', rel); cv.addEventListener('pointercancel', rel);

  /* ---------- framing ---------- */
  let distMul = 1;
  st.onResize((w, h) => { distMul = w / h < 1 ? 1.95 : w / h < 1.3 ? 1.6 : 1.42; });

  /* ---------- loop ---------- */
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), e3 = new THREE.Euler();
  const tmp = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  st.onFrame((dt, t) => {
    // object physics: steer back into orbit after a throw
    if (!o.held) {
      const rel_ = tmp.copy(o.pos).sub(center); const r = Math.hypot(rel_.x, rel_.z) || .001;
      const tangent = new THREE.Vector3(-rel_.z, 0, rel_.x).normalize().multiplyScalar(1.7);
      const radial = new THREE.Vector3(rel_.x, 0, rel_.z).normalize().multiplyScalar((1.25 - r) * 2.2);
      const vert = new THREE.Vector3(0, (Math.sin(t * .9) * .45 - rel_.y) * 2, 0);
      const want = tangent.add(radial).add(vert);
      o.vel.lerp(want, 1 - Math.exp(-1.1 * dt));
      o.pos.addScaledVector(o.vel, dt);
      // soft walls
      if (o.pos.y < .15) { o.pos.y = .15; o.vel.y = Math.abs(o.vel.y) * .7; sfx?.('tap'); }
      if (o.pos.length() > 4.5) o.vel.addScaledVector(o.pos.clone().sub(center).normalize(), -6 * dt);
    }
    orb.position.copy(o.pos);
    orbCol.lerp(new THREE.Color(S.orb), 1 - Math.exp(-4 * dt));
    orb.material.color.copy(orbCol); glow.material.color.copy(orbCol);
    // trail
    tPos.copyWithin(3, 0, (TRAIL - 1) * 3); tPos[0] = o.pos.x; tPos[1] = o.pos.y; tPos[2] = o.pos.z;
    for (let i = 0; i < TRAIL; i++) { const a = Math.pow(1 - i / TRAIL, 1.6) * .9; tCol.set([orbCol.r, orbCol.g, orbCol.b, a], i * 4); }
    trailGeo.attributes.position.needsUpdate = true; trailGeo.attributes.color.needsUpdate = true;
    // bottle
    bottleCol.lerp(new THREE.Color(S.bottle), 1 - Math.exp(-4 * dt)); bodyMat.color.copy(bottleCol);
    bottle.rotation.y = reduce ? .3 : Math.sin(t * .35) * .35 + .2;
    bottle.position.y = reduce ? 0 : Math.sin(t * .8) * .03;
    // swarm
    const sw = swarms[cur];
    sw.P.forEach((p, i) => {
      const sp = reduce ? 0 : 1;
      let ang = p.a + t * p.w * sp, y = p.h;
      if (cur === 'family') { y = ((p.h + t * .12 * p.s * sp) % 2.4); }
      if (cur === 'business') { ang = p.a + Math.round((t * p.w * .25) * 4) / 4; }
      tmp.set(Math.cos(ang) * p.r, y + (cur === 'public' ? Math.sin(t * 1.3 * p.s + p.a) * .12 : 0), Math.sin(ang) * p.r);
      // the object pushes things aside
      const d = tmp.clone().add(p.off).sub(o.pos); const dl = d.length();
      if (dl < .55) p.vel.addScaledVector(d.normalize(), (.55 - dl) * 40 * dt);
      p.vel.addScaledVector(p.off, -9 * dt); p.vel.multiplyScalar(Math.exp(-3 * dt));
      p.off.addScaledVector(p.vel, dt);
      tmp.add(p.off);
      e3.set(t * p.spin.x * sp, t * p.spin.y * sp, t * p.spin.z * sp);
      q.setFromEuler(e3);
      const s = cur === 'business' ? p.s * .9 : p.s;
      sc.setScalar(s);
      m4.compose(tmp, q, sc); sw.mesh.setMatrixAt(i, m4);
    });
    sw.mesh.instanceMatrix.needsUpdate = true;
    // camera
    const target = new THREE.Vector3(...S.cam).multiplyScalar(distMul); target.y = S.cam[1];
    if (!reduce) target.z -= (Math.sin(t * .25) * .5 + .5) * .35;
    camPos.lerp(target, 1 - Math.exp(-2.2 * dt));
    camLook.lerp(new THREE.Vector3(...S.look), 1 - Math.exp(-2.2 * dt));
    roll = damp(roll, S.roll, 2.2, dt);
    camera.position.copy(camPos); camera.up.set(Math.sin(roll), Math.cos(roll), 0); camera.lookAt(camLook);
    flash = damp(flash, 0, 6, dt);
    host.style.setProperty('--flash', flash.toFixed(3));
  });
  onLook(L => { hemi.intensity = L.night ? .35 : .9; scene.environmentIntensity = L.night ? .5 : 1; st.kick(); });
  return { setAudience };
}
