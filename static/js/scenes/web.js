// WEBSITES — a site assembling itself in zero gravity. Scroll to build it, grab any piece and throw it.
import { THREE, createStage, currentLook, onLook, reduce, clamp, damp, radialTexture } from './core.js';

const PX = 300; // canvas px per world unit

export function initWeb(host, T, sfx) {
  const st = createStage(host, { fov: 30, envIntensity: .8 });
  if (!st) return null;
  const { scene, camera } = st;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xdedad4, 1.1));
  const dl = new THREE.DirectionalLight(0xffffff, 1.2); dl.position.set(2, 3, 5); scene.add(dl);
  const font = getComputedStyle(document.body).fontFamily;
  let L = currentLook();

  const pal = () => L.night
    ? { page: '#141519', card: '#1E2026', ink: '#F5F5F7', soft: '#8B8E96', line: '#2C2F36', accent: '#FFB766', btn: '#F5F5F7', btnInk: '#111' }
    : { page: '#FFFFFF', card: '#F5F5F7', ink: '#1D1D1F', soft: '#86868B', line: '#E5E5EA', accent: '#' + new THREE.Color(L.accent).getHexString(), btn: '#1D1D1F', btnInk: '#fff' };

  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
  const text = (g, s, x, y, size, weight = 600, color, align = 'left') => { g.font = `${weight} ${size}px ${font}`; g.fillStyle = color; g.textAlign = align; g.textBaseline = 'middle'; g.fillText(s, x, y); };

  // each piece of the finished site: size, target position, drawing
  const S = T.webSite;
  const parts = [
    { id: 'frame', w: 4.4, h: 2.9, x: 0, y: 0, z: -.07, r: 26, draw(g, W, H, c) {
      g.fillStyle = c.page; rr(g, 0, 0, W, H, 26); g.fill();
      g.fillStyle = c.card; rr(g, 0, 0, W, 54, [26, 26, 0, 0]); g.fill();
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(30 + i * 24, 27, 7, 0, 7); g.fill(); });
      g.fillStyle = c.page; rr(g, W / 2 - 170, 13, 340, 28, 14); g.fill();
      text(g, 'yourbrand.com', W / 2, 28, 15, 500, c.soft, 'center');
    } },
    { id: 'nav', w: 4.1, h: .22, x: 0, y: 1.12, r: 12, draw(g, W, H, c) {
      text(g, '◐ ' + S.brand, 20, H / 2, 26, 700, c.ink);
      S.nav.forEach((n, i) => text(g, n, W - 480 + i * 130, H / 2, 20, 500, c.soft));
      g.fillStyle = c.btn; rr(g, W - 100, H / 2 - 18, 84, 36, 18); g.fill(); text(g, '→', W - 58, H / 2, 20, 600, c.btnInk, 'center');
    } },
    { id: 'image', w: 2.15, h: 1.3, x: -.95, y: .3, r: 18, draw(g, W, H, c) {
      const gr = g.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, L.night ? '#1C2340' : '#CFE1FF'); gr.addColorStop(.6, L.night ? '#3A2A4A' : '#FDE7D3'); gr.addColorStop(1, L.night ? '#5A3A2C' : '#F8C9A6');
      g.fillStyle = gr; rr(g, 0, 0, W, H, 18); g.fill();
      g.fillStyle = L.night ? '#FFD08A' : '#FFFFFF'; g.globalAlpha = .9; g.beginPath(); g.arc(W * .68, H * .42, 58, 0, 7); g.fill(); g.globalAlpha = 1;
      g.fillStyle = L.night ? '#0E1222' : '#9DB3D6'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * .72); g.lineTo(W * .22, H * .55); g.lineTo(W * .42, H * .7); g.lineTo(W * .62, H * .5); g.lineTo(W * .82, H * .68); g.lineTo(W, H * .58); g.lineTo(W, H); g.fill();
      g.fillStyle = L.night ? '#070910' : '#7F98C1'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * .85); g.lineTo(W * .3, H * .74); g.lineTo(W * .55, H * .86); g.lineTo(W * .8, H * .76); g.lineTo(W, H * .84); g.lineTo(W, H); g.fill();
    } },
    { id: 'title', w: 1.75, h: .56, x: 1.13, y: .66, r: 8, draw(g, W, H, c) {
      text(g, S.title[0], 6, H * .3, 62, 700, c.ink); text(g, S.title[1], 6, H * .76, 62, 700, c.accent);
    } },
    { id: 'para', w: 1.75, h: .3, x: 1.13, y: .2, r: 6, draw(g, W, H, c) {
      g.fillStyle = c.line; [0, 1, 2].forEach(i => { rr(g, 6, 14 + i * 28, W * (i === 2 ? .55 : .92), 12, 6); g.fill(); });
    } },
    { id: 'btn1', w: .74, h: .19, x: .62, y: -.08, r: 30, draw(g, W, H, c) { g.fillStyle = c.btn; rr(g, 0, 0, W, H, H / 2); g.fill(); text(g, S.cta1, W / 2, H / 2, 22, 600, c.btnInk, 'center'); } },
    { id: 'btn2', w: .74, h: .19, x: 1.44, y: -.08, r: 30, draw(g, W, H, c) { g.strokeStyle = c.ink; g.lineWidth = 3; rr(g, 2, 2, W - 4, H - 4, H / 2); g.stroke(); text(g, S.cta2, W / 2, H / 2, 22, 600, c.ink, 'center'); } },
    ...[0, 1, 2].map(i => ({ id: 'card' + i, w: 1.3, h: .66, x: -1.38 + i * 1.38, y: -.72, r: 16, draw(g, W, H, c) {
      g.fillStyle = c.card; rr(g, 0, 0, W, H, 16); g.fill();
      const col = [c.accent, L.night ? '#7FA7FF' : '#3D7BFF', L.night ? '#6FD3A0' : '#30B07A'][i];
      g.fillStyle = col; g.beginPath();
      if (i === 0) g.arc(56, 56, 26, 0, 7); else if (i === 1) rr(g, 30, 30, 52, 52, 10); else { g.moveTo(56, 28); g.lineTo(84, 82); g.lineTo(28, 82); }
      g.fill();
      text(g, S.cards[i], 28, 128, 28, 700, c.ink);
      g.fillStyle = c.line; rr(g, 28, 156, W * .7, 10, 5); g.fill(); rr(g, 28, 176, W * .45, 10, 5); g.fill();
    } })),
    { id: 'footer', w: 4.1, h: .12, x: 0, y: -1.22, r: 8, draw(g, W, H, c) { g.fillStyle = c.line; rr(g, 0, H / 2 - 2, W, 4, 2); g.fill(); text(g, '© ' + S.brand, 8, H / 2 - 16, 16, 500, c.soft); } },
  ];

  const shadowTex = radialTexture('rgba(0,0,0,.22)', 'rgba(0,0,0,0)');
  const root = new THREE.Group(); scene.add(root);
  const rand = (() => { let x = 7; return () => ((x = (x * 16807) % 2147483647) / 2147483647); })();

  parts.forEach((p, i) => {
    const c = document.createElement('canvas');
    c.width = Math.round(p.w * PX); c.height = Math.round(p.h * PX);
    p.canvas = c;
    p.tex = new THREE.CanvasTexture(c); p.tex.colorSpace = THREE.SRGBColorSpace; p.tex.anisotropy = 4;
    const g = new THREE.Group();
    const front = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), new THREE.MeshStandardMaterial({ map: p.tex, transparent: true, roughness: .55, metalness: 0 }));
    const back = new THREE.Mesh(new THREE.PlaneGeometry(p.w, p.h), new THREE.MeshStandardMaterial({ map: p.tex, color: 0xC8C8CE, roughness: .6, transparent: true }));
    back.rotation.y = Math.PI; back.position.z = -.004;
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(p.w * 1.25, p.h * 1.35), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    sh.position.set(.06, -.08, -.03); sh.renderOrder = -1;
    g.add(sh, back, front);
    p.mesh = g; p.front = front; p.shadow = sh;
    front.userData.part = p; back.userData.part = p;
    // floating state
    const a = rand() * Math.PI * 2, b = (rand() - .5) * 1.4;
    p.float = new THREE.Vector3(Math.cos(a) * (2.2 + rand() * 2.6), b * 2 + (rand() - .5), -1.6 + rand() * 3.4);
    if (p.id === 'frame') p.float.set(.4, -.2, -3.2);
    p.floatRot = new THREE.Euler((rand() - .5) * 1.6, (rand() - .5) * 1.8, (rand() - .5) * 1.2);
    p.target = new THREE.Vector3(p.x, p.y, p.z || 0);
    p.pos = p.float.clone(); p.vel = new THREE.Vector3();
    p.rot = p.floatRot.clone();
    p.phase = rand() * 6.28;
    p.delay = p.id === 'frame' ? 0 : .08 + (i / parts.length) * .5;
    root.add(g);
  });
  const redraw = () => { const c = pal(); parts.forEach(p => { const g = p.canvas.getContext('2d'); g.clearRect(0, 0, p.canvas.width, p.canvas.height); p.draw(g, p.canvas.width, p.canvas.height, c); p.tex.needsUpdate = true; }); st.kick(); };
  (document.fonts?.ready || Promise.resolve()).then(redraw); redraw();
  onLook(() => { L = currentLook(); redraw(); });

  /* ---------- progress from scroll (0 floating → 1 built) ---------- */
  let prog = 0, progT = 0;
  const setProgress = v => { progT = clamp(v, 0, 1); st.kick(); };

  /* ---------- framing ---------- */
  const look = new THREE.Vector3(0, .5, 0);
  st.onResize((w, h) => {
    const aspect = w / h, half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const needW = 5.2 / (2 * half * aspect), needH = 4.6 / (2 * half);
    const wide = aspect > 1.15;
    camera.position.set(0, 0, wide ? Math.max(8.6, 5.4 / (2 * half * aspect * .62)) : Math.max(6, 4.75 / (2 * half * aspect)));
    look.y = 0;
    st.setShift(wide ? .2 : 0, wide ? .06 : .17);
  });

  /* ---------- grab & throw ---------- */
  const ray = new THREE.Raycaster();
  const fronts = parts.flatMap(p => [p.front]);
  let held = null; const plane = new THREE.Plane(); const hitP = new THREE.Vector3(), off = new THREE.Vector3(), prev = new THREE.Vector3(); let lastT = 0;
  const cv = st.canvas;
  cv.addEventListener('pointerdown', e => {
    ray.setFromCamera(st.ndc(e), camera);
    const h = ray.intersectObjects(fronts, false)[0];
    if (!h) return;
    held = h.object.userData.part;
    plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), held.mesh.getWorldPosition(new THREE.Vector3()));
    off.copy(held.mesh.position).sub(root.worldToLocal(h.point.clone()));
    prev.copy(held.pos); lastT = performance.now();
    cv.setPointerCapture(e.pointerId); host.classList.add('is-grabbing'); sfx?.('pick');
  });
  cv.addEventListener('pointermove', e => {
    if (!held) {
      if (e.pointerType === 'mouse') { ray.setFromCamera(st.ndc(e), camera); cv.style.cursor = ray.intersectObjects(fronts, false).length ? 'grab' : 'default'; }
      return;
    }
    ray.setFromCamera(st.ndc(e), camera);
    if (ray.ray.intersectPlane(plane, hitP)) {
      const p = root.worldToLocal(hitP.clone()).add(off);
      const now = performance.now(), dt = Math.max(1, now - lastT) / 1000;
      held.vel.copy(p).sub(prev).divideScalar(dt).clampLength(0, 14);
      prev.copy(p); lastT = now; held.pos.copy(p);
      st.kick();
    }
  });
  const release = () => { if (!held) return; held = null; host.classList.remove('is-grabbing'); sfx?.('whoosh'); };
  cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', release);

  /* ---------- loop ---------- */
  const tgt = new THREE.Vector3(), tq = new THREE.Quaternion(), fq = new THREE.Quaternion(), zq = new THREE.Quaternion();
  const ptr = new THREE.Vector2();
  host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); ptr.set((e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5); });
  st.onFrame((dt, t) => {
    prog = reduce ? progT : damp(prog, progT, 6, dt);
    parts.forEach(p => {
      const k = clamp((prog - p.delay) / .42, 0, 1);
      const e = k * k * (3 - 2 * k);
      const bob = reduce ? 0 : (1 - e);
      tgt.lerpVectors(p.float, p.target, e);
      tgt.x += Math.sin(t * .5 + p.phase) * .12 * bob; tgt.y += Math.cos(t * .6 + p.phase) * .14 * bob;
      if (held !== p) {
        // spring toward target: throws overshoot and settle
        p.vel.addScaledVector(tgt.clone().sub(p.pos), 34 * dt);
        p.vel.multiplyScalar(Math.exp(-5.5 * dt));
        p.pos.addScaledVector(p.vel, dt);
      }
      p.mesh.position.copy(p.pos);
      fq.setFromEuler(new THREE.Euler(p.floatRot.x + Math.sin(t * .3 + p.phase) * .2 * bob, p.floatRot.y + t * .05 * bob, p.floatRot.z));
      tq.slerpQuaternions(fq, zq, e);
      if (held === p) tq.slerp(zq, .5);
      p.mesh.quaternion.slerp(tq, 1 - Math.exp(-8 * dt));
      p.shadow.material.opacity = .5 + .5 * e;
    });
    // finished site turns gently toward the pointer
    const tilt = prog > .9 ? 1 : 0;
    root.rotation.y = damp(root.rotation.y, ptr.x * .35 * tilt + (1 - prog) * .25, 3, dt);
    root.rotation.x = damp(root.rotation.x, ptr.y * .18 * tilt, 3, dt);
    camera.lookAt(look);
  });
  return { setProgress };
}
