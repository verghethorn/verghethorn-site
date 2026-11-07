// "Design it. Film it. Ship it." — a drink can you design yourself, rendered in 3D.
import * as THREE from 'three';
import { RoomEnvironment } from '/static/vendor/three/RoomEnvironment.js';

export const PALETTES = {
  citrus: ['#ffe14d', '#ff6a1a', '#2b1300'], berry: ['#ff3d7f', '#6a2cff', '#ffffff'], mint: ['#8dffd6', '#0fa3a3', '#06302f'],
  ice: ['#e3f1ff', '#5b7cff', '#0b1a4a'], night: ['#16162b', '#ff3b6b', '#ffffff'], pearl: ['#ffffff', '#cfcaff', '#1d1d1f'],
};

export function startProduct(canvas, opts = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 100); cam.position.set(0, .6, 10.5);

  // label texture
  const lc = document.createElement('canvas'); lc.width = 2048; lc.height = 1024; const lg = lc.getContext('2d');
  const labelTex = new THREE.CanvasTexture(lc); labelTex.colorSpace = THREE.SRGBColorSpace; labelTex.anisotropy = 8;
  const drawLabel = (name, pal) => {
    const [a, b, ink] = PALETTES[pal] || PALETTES.citrus, W = 2048, H = 1024;
    const gr = lg.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, a); gr.addColorStop(1, b); lg.fillStyle = gr; lg.fillRect(0, 0, W, H);
    lg.save(); lg.globalAlpha = .16; lg.fillStyle = ink; for (let x = -H; x < W; x += 140) { lg.beginPath(); lg.moveTo(x, H); lg.lineTo(x + 70, H); lg.lineTo(x + 70 + H * .6, 0); lg.lineTo(x + H * .6, 0); lg.fill(); } lg.restore();
    for (const cx of [512, 1536]) {
      lg.save(); lg.translate(cx, H / 2);
      lg.fillStyle = ink; lg.globalAlpha = .9; lg.beginPath(); lg.arc(0, -250, 46, 0, 6.283); lg.fill(); lg.globalAlpha = 1;
      lg.fillStyle = ink; lg.textAlign = 'center'; lg.textBaseline = 'middle';
      let fs = 300; lg.font = `800 ${fs}px Geist, Onest, system-ui, sans-serif`; while (lg.measureText(name).width > 860 && fs > 80) { fs -= 10; lg.font = `800 ${fs}px Geist, Onest, system-ui, sans-serif`; }
      lg.fillText(name, 0, 10);
      lg.font = '600 54px Geist, system-ui, sans-serif'; lg.globalAlpha = .85; lg.fillText('S P A R K L I N G', 0, 260); lg.restore();
    }
    labelTex.needsUpdate = true;
  };

  const metal = new THREE.MeshPhysicalMaterial({ color: 0xd9dde2, metalness: 1, roughness: .22 });
  const label = new THREE.MeshPhysicalMaterial({ map: labelTex, metalness: .35, roughness: .3, clearcoat: 1, clearcoatRoughness: .08, emissive: 0x000000, emissiveMap: labelTex, emissiveIntensity: 0 });
  const can = new THREE.Group();
  const prof = [[0, -1.78], [.62, -1.78], [.78, -1.74], [.93, -1.62], [.99, -1.5], [1, -1.44], [1, 1.44], [.97, 1.56], [.86, 1.7], [.82, 1.78], [.84, 1.8], [.8, 1.82], [.74, 1.79], [0, 1.76]].map(([r, y]) => new THREE.Vector2(r, y));
  can.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 96), metal));
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.003, 1.003, 2.86, 128, 1, true, -Math.PI / 2), label); can.add(body);
  const tab = new THREE.Mesh(new THREE.CapsuleGeometry(.12, .34, 6, 16), metal); tab.rotation.z = Math.PI / 2; tab.scale.set(1, 1, .25); tab.position.set(0, 1.79, .25); can.add(tab);
  can.rotation.z = -.08; scene.add(can);

  // soft contact shadow
  const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sg = sc.getContext('2d'); const rg = sg.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, 'rgba(0,0,0,.45)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = rg; sg.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.85; scene.add(shadow);

  // film lights + bubbles
  const key = new THREE.SpotLight(0xffffff, 0, 30, .5, .6); key.position.set(4, 6, 6); scene.add(key, key.target);
  const rimA = new THREE.PointLight(0xff3d7f, 0, 20); rimA.position.set(-4, 1, -3); const rimB = new THREE.PointLight(0x5bc8ff, 0, 20); rimB.position.set(4, -1, -3); scene.add(rimA, rimB);
  const bN = 140, bPos = new Float32Array(bN * 3), bSp = new Float32Array(bN);
  for (let i = 0; i < bN; i++) { const a = Math.random() * 6.283, r = 1.3 + Math.random() * 2.2; bPos[i * 3] = Math.cos(a) * r; bPos[i * 3 + 1] = Math.random() * 6 - 3; bPos[i * 3 + 2] = Math.sin(a) * r - .5; bSp[i] = .3 + Math.random() * .9; }
  const bGeo = new THREE.BufferGeometry(); bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  const bMat = new THREE.PointsMaterial({ color: 0xffffff, size: .07, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  scene.add(new THREE.Points(bGeo, bMat));

  const st = { mode: 'design', finish: 'gloss', rot: 0, vel: .5, drag: false, lastX: 0, on: true, t: 0, intro: 0 };
  const setFinish = f => {
    st.finish = f;
    Object.assign(label, { metalness: .35, roughness: .3, clearcoat: 1, emissiveIntensity: 0 }); label.emissive.set(0x000000);
    if (f === 'matte') Object.assign(label, { metalness: 0, roughness: .85, clearcoat: 0 });
    if (f === 'chrome') Object.assign(label, { metalness: .95, roughness: .12, clearcoat: 1 });
    if (f === 'neon') { Object.assign(label, { metalness: .2, roughness: .35, emissiveIntensity: 1.1 }); label.emissive.set(0xffffff); }
    label.needsUpdate = true;
  };
  const setMode = m => { st.mode = m; st.intro = 0; };

  const resize = () => { const r = canvas.getBoundingClientRect(); if (!r.width) return; renderer.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix(); };
  resize(); new ResizeObserver(resize).observe(canvas);
  canvas.addEventListener('pointerdown', e => { st.drag = true; st.lastX = e.clientX; });
  addEventListener('pointermove', e => { if (!st.drag) return; const dx = e.clientX - st.lastX; st.lastX = e.clientX; st.rot += dx * .012; st.vel = dx * .6; });
  addEventListener('pointerup', () => { st.drag = false; }); addEventListener('pointercancel', () => { st.drag = false; });
  new IntersectionObserver(es => { st.on = es[0].isIntersecting; if (st.on) go(); }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock(); let raf = 0;
  const lerp = (a, b, k) => a + (b - a) * k;
  const frame = () => {
    raf = 0; if (!st.on || document.hidden) return;
    const dt = Math.min(clock.getDelta(), .05); st.t += dt; st.intro = Math.min(1, st.intro + dt * .6);
    const film = st.mode === 'film', app = st.mode === 'app';
    if (!st.drag) { st.vel = lerp(st.vel, film ? 1.4 : .45, .03); st.rot += st.vel * dt; }
    can.rotation.y = st.rot; can.position.y = Math.sin(st.t * 1.3) * (film ? .12 : .06);
    const z = film ? lerp(10.5, 7.2, 1 - Math.pow(1 - st.intro, 3)) : app ? 12.5 : 10.5;
    cam.position.z = lerp(cam.position.z, z, .06); cam.position.x = lerp(cam.position.x, film ? Math.sin(st.t * .4) * 1.2 : 0, .05); cam.lookAt(0, film ? .1 : 0, 0);
    key.intensity = lerp(key.intensity, film ? 220 : 0, .05); rimA.intensity = lerp(rimA.intensity, film ? 60 : 0, .05); rimB.intensity = lerp(rimB.intensity, film ? 60 : 0, .05);
    key.position.x = 4 * Math.cos(st.t * .7); key.position.z = 6 * Math.sin(st.t * .7) + 2;
    renderer.toneMappingExposure = lerp(renderer.toneMappingExposure, film ? .8 : 1.05, .05);
    bMat.opacity = lerp(bMat.opacity, film ? .85 : 0, .05);
    if (bMat.opacity > .01) { for (let i = 0; i < bN; i++) { bPos[i * 3 + 1] += bSp[i] * dt; if (bPos[i * 3 + 1] > 3) bPos[i * 3 + 1] = -3; } bGeo.attributes.position.needsUpdate = true; }
    shadow.material.opacity = lerp(shadow.material.opacity, film ? .2 : 1, .05);
    renderer.render(scene, cam); go();
  };
  const go = () => { if (!raf) raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', go);
  drawLabel(opts.name || 'NOVA', opts.palette || 'citrus'); setFinish('gloss'); go();
  document.fonts?.ready.then(() => drawLabel(st.name || opts.name || 'NOVA', st.pal || opts.palette || 'citrus'));
  return {
    label(name, pal) { st.name = name; st.pal = pal; drawLabel(name, pal); },
    finish: setFinish, mode: setMode, spin(v = 8) { st.vel = v; },
  };
}
