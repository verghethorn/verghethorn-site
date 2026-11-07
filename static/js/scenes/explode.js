// HOW WE WORK — a working watch that comes apart layer by layer. Every layer is one step.
import { THREE, createStage, currentLook, onLook, reduce, clamp, damp, ease, radialTexture } from './core.js';

function gearGeo(teeth, rOut, depth = .035, holes = 0, rHub = .04) {
  const s = new THREE.Shape();
  const rIn = rOut - Math.min(.05, rOut * .14);
  for (let i = 0; i < teeth; i++) {
    const a0 = i / teeth * Math.PI * 2, a = Math.PI * 2 / teeth;
    const pts = [[rIn, a0], [rOut, a0 + a * .18], [rOut, a0 + a * .48], [rIn, a0 + a * .66]];
    pts.forEach(([r, an], j) => { const x = Math.cos(an) * r, y = Math.sin(an) * r; if (i === 0 && j === 0) s.moveTo(x, y); else s.lineTo(x, y); });
  }
  s.closePath();
  const hub = new THREE.Path(); hub.absarc(0, 0, rHub * .45, 0, Math.PI * 2, true); s.holes.push(hub);
  for (let i = 0; i < holes; i++) {
    const a = i / holes * Math.PI * 2, rr = (rIn + rHub) / 2, hr = (rIn - rHub) * .32;
    const h = new THREE.Path(); h.absarc(Math.cos(a) * rr, Math.sin(a) * rr, hr, 0, Math.PI * 2, true); s.holes.push(h);
  }
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: .004, bevelSize: .004, bevelSegments: 1, curveSegments: 8 });
  g.rotateX(-Math.PI / 2); g.translate(0, 0, 0);
  return g;
}

export function initExplode(host, T, sfx) {
  const st = createStage(host, { fov: 28, envIntensity: 1.1 });
  if (!st) return null;
  const { scene, camera } = st;
  const hemi = new THREE.HemisphereLight(0xffffff, 0xe6e2dc, .6); scene.add(hemi);
  const kl = new THREE.DirectionalLight(0xffffff, 2); kl.position.set(-3, 5, 4); scene.add(kl);
  const rl = new THREE.DirectionalLight(0xffffff, 1.2); rl.position.set(4, 1, -3); scene.add(rl);
  const font = getComputedStyle(document.body).fontFamily;

  const steel = new THREE.MeshPhysicalMaterial({ color: 0xD4D7DD, metalness: 1, roughness: .2, clearcoat: .4 });
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xD9AE62, metalness: 1, roughness: .26 });
  const plateM = new THREE.MeshPhysicalMaterial({ color: 0xC9CDD4, metalness: 1, roughness: .38 });
  const ink = new THREE.MeshPhysicalMaterial({ color: 0x1D1D1F, metalness: .6, roughness: .3 });
  const jewel = new THREE.MeshPhysicalMaterial({ color: 0xC0182E, roughness: .05, clearcoat: 1 });
  const glassM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, metalness: 0, transparent: true, opacity: .16, clearcoat: 1, depthWrite: false });
  // dial texture
  const dc = document.createElement('canvas'); dc.width = dc.height = 1024;
  const dialTex = new THREE.CanvasTexture(dc); dialTex.colorSpace = THREE.SRGBColorSpace; dialTex.anisotropy = 8;
  const drawDial = () => {
    const g = dc.getContext('2d'), c = 512;
    const gr = g.createRadialGradient(c, c, 50, c, c, 512); gr.addColorStop(0, '#FBFAF7'); gr.addColorStop(1, '#ECE9E2');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
    g.fillStyle = '#1D1D1F';
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * Math.PI * 2, big = i % 5 === 0;
      g.save(); g.translate(c, c); g.rotate(a); g.fillRect(-(big ? 6 : 2), -470, big ? 12 : 4, big ? 58 : 22); g.restore();
    }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `600 44px ${font}`; g.fillText('VERGHÉTHORN', c, c - 170);
    g.font = `500 22px ${font}`; g.fillStyle = '#86868B'; g.fillText(T.how.dialLine, c, c + 190);
    dialTex.needsUpdate = true;
  };
  drawDial(); (document.fonts?.ready || Promise.resolve()).then(drawDial);
  const dialM = new THREE.MeshPhysicalMaterial({ map: dialTex, roughness: .45, clearcoat: .3 });

  // ---------- build the watch, one group per layer (top → bottom) ----------
  const watch = new THREE.Group(); scene.add(watch);
  const layer = () => { const g = new THREE.Group(); watch.add(g); return g; };

  // 0 · crystal
  const L0 = layer();
  { const m = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .05, 96), glassM); L0.add(m);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.9, .012, 12, 96), steel); ring.rotation.x = Math.PI / 2; L0.add(ring); }
  // 1 · case + bezel + crown + lugs
  const L1 = layer();
  { const prof = [[.92, -.12], [1.02, -.1], [1.06, -.02], [1.05, .06], [.98, .1], [.92, .1]].map(([x, y]) => new THREE.Vector2(x, y));
    const c = new THREE.Mesh(new THREE.LatheGeometry(prof, 128), steel); L1.add(c);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .14, 32), steel); crown.rotation.z = Math.PI / 2; crown.position.set(1.12, 0, 0); L1.add(crown);
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => { const lug = new THREE.Mesh(new THREE.BoxGeometry(.16, .1, .34), steel); lug.position.set(sx * .55, -.02, sz * .98); lug.rotation.y = sx * sz * .25; L1.add(lug); }); }
  // 2 · hands
  const L2 = layer();
  const hand = (len, w, mat, y) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, .012, len), mat); m.position.z = -len / 2 + .08; g.add(m); g.position.y = y; L2.add(g); return g; };
  const hH = hand(.48, .045, ink, 0), hM = hand(.72, .03, ink, .018), hS = hand(.8, .012, new THREE.MeshPhysicalMaterial({ color: 0xE8A33D, metalness: .4, roughness: .3 }), .034);
  { const pin = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .05, 24), ink); pin.position.y = .02; L2.add(pin); }
  // 3 · dial
  const L3 = layer();
  { const d = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .025, 128), [new THREE.MeshPhysicalMaterial({ color: 0xE9E6DF }), dialM, dialM]); L3.add(d); }
  // 4 · movement — plate, gears, balance wheel, jewels
  const L4 = layer();
  const gears = [];
  { const plate = new THREE.Mesh(new THREE.CylinderGeometry(.86, .86, .04, 96), plateM); plate.position.y = -.03; L4.add(plate);
    const spec = [[36, .34, 0, 0, gold, 6, 1], [14, .15, .44, -.12, steel, 0, -36 / 14], [24, .24, -.36, .38, gold, 4, -36 / 24], [12, .12, -.08, .56, steel, 0, 36 / 24 * 24 / 12], [18, .19, .26, .5, gold, 3, -1.1]];
    spec.forEach(([n, r, x, z, mat, holes, ratio]) => { const g = new THREE.Mesh(gearGeo(n, r, .035, holes), mat); g.position.set(x, 0, z); L4.add(g); gears.push([g, ratio]);
      const j = new THREE.Mesh(new THREE.SphereGeometry(.028, 16, 10), jewel); j.position.set(x, .045, z); j.scale.y = .5; L4.add(j); });
    const bal = new THREE.Group(); bal.position.set(.4, .02, .32); L4.add(bal);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.17, .016, 10, 64), gold); ring.rotation.x = Math.PI / 2; bal.add(ring);
    for (let i = 0; i < 3; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.33, .01, .016), gold); sp.rotation.y = i / 3 * Math.PI; bal.add(sp); }
    gears.balance = bal;
    const bridge = new THREE.Mesh(new THREE.TorusGeometry(.62, .05, 8, 64, Math.PI * .9), plateM); bridge.rotation.x = Math.PI / 2; bridge.rotation.z = 2.2; bridge.position.y = .06; L4.add(bridge); }
  // 5 · case back
  const L5 = layer();
  { const b = new THREE.Mesh(new THREE.CylinderGeometry(.96, .9, .06, 128), steel); L5.add(b);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.7, .006, 8, 96), ink); ring.rotation.x = Math.PI / 2; ring.position.y = -.032; L5.add(ring); }

  const layers = [L0, L1, L2, L3, L4, L5];
  const baseY = [.12, 0, .07, .04, -.04, -.12];
  const exY = [1.55, .95, .5, .1, -.55, -1.25];
  // clone materials so each layer can fade on its own
  layers.forEach(g => g.traverse(o => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone(); const arr = [].concat(o.material); arr.forEach(m => { m.userData.baseOpacity = m.opacity; m.userData.baseTransparent = m.transparent; }); } }));
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ map: radialTexture('rgba(0,0,0,.18)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.9; scene.add(shadow);

  /* ---------- state from scroll + clicks ---------- */
  let explode = 0, explodeT = 0, active = -1, fade = layers.map(() => 1);
  const setProgress = (p) => {
    explodeT = clamp(p / .18, 0, 1);
    active = p < .18 ? -1 : Math.min(5, Math.floor((p - .18) / .82 * 6));
    st.kick();
    return active;
  };

  /* ---------- rotate by hand ---------- */
  let yaw = -.5, yawT = -.5, pitch = .42, pitchT = .42, drag = null;
  const cv = st.canvas;
  cv.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, yaw: yawT, pitch: pitchT }; if (e.pointerType === 'mouse') cv.setPointerCapture(e.pointerId); host.classList.add('is-grabbing'); });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    yawT = drag.yaw + (e.clientX - drag.x) * .008;
    if (e.pointerType === 'mouse') pitchT = clamp(drag.pitch + (e.clientY - drag.y) * .005, .05, 1.1);
    st.kick();
  });
  const end = () => { drag = null; host.classList.remove('is-grabbing'); };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  cv.style.cursor = 'grab';

  let dist = 8.6;
  st.onResize((w, h) => { const ar = w / h; dist = ar < 1 ? 13 : ar < 1.3 ? 10 : 9.4; st.setShift(ar > 1.15 ? .01 : 0, ar > 1.15 ? .03 : .17); });

  const label = host.querySelector('[data-layer-label]');
  const tip = new THREE.Vector3();
  const now = new Date();
  st.onFrame((dt, t) => {
    explode = reduce ? explodeT : damp(explode, explodeT, 5, dt);
    if (!drag && !reduce) yawT += dt * .12;
    yaw = damp(yaw, yawT, 6, dt); pitch = damp(pitch, pitchT, 6, dt);
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(0, .05, 0);
    const e = ease(explode);
    layers.forEach((g, i) => {
      const lift = active === i ? .18 : 0;
      g.position.y = baseY[i] + (exY[i] - baseY[i]) * e + lift * e;
      const f = active < 0 ? 1 : (active === i ? 1 : .14);
      fade[i] = damp(fade[i], f, 6, dt);
      g.traverse(o => { if (!o.isMesh) return; [].concat(o.material).forEach(m => {
        const want = m.userData.baseOpacity * fade[i];
        m.opacity = want; const tr = m.userData.baseTransparent || fade[i] < .99;
        if (m.transparent !== tr) { m.transparent = tr; m.depthWrite = !tr; m.needsUpdate = true; }
      }); });
    });
    // working mechanism
    const sp = reduce ? 0 : 1;
    gears.forEach(([g, ratio]) => g.rotation.y = t * .6 * ratio * sp);
    gears.balance.rotation.y = Math.sin(t * 9 * sp) * 1.2;
    const sec = now.getSeconds() + t, min = now.getMinutes() + sec / 60, hr = (now.getHours() % 12) + min / 60;
    hS.rotation.y = -sec / 60 * Math.PI * 2; hM.rotation.y = -min / 60 * Math.PI * 2; hH.rotation.y = -hr / 12 * Math.PI * 2;
    // label next to the active layer
    if (label) {
      if (active >= 0 && e > .5) {
        tip.set(1.1, layers[active].position.y, 0).applyMatrix4(watch.matrixWorld);
        const p = st.project(tip);
        if (p) { label.style.transform = `translate(${p[0]}px, ${p[1]}px)`; label.classList.add('is-on'); }
      } else label.classList.remove('is-on');
    }
  });
  onLook(L => { hemi.intensity = L.night ? .2 : .6; scene.environmentIntensity = L.night ? .55 : 1.1; st.kick(); });
  return { setProgress };
}
