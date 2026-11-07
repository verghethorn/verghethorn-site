// A small 2D special-effects engine: explosions, lightning, rain, snow, warp, confetti, slow motion.
const R = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

export class FX {
  constructor(canvas, host) {
    this.c = canvas; this.g = canvas.getContext('2d'); this.host = host || canvas.parentElement;
    this.p = []; this.rings = []; this.bolts = []; this.flash = 0; this.flashColor = '255,255,255';
    this.emit = []; this.scale = 1; this.slowT = 0; this.running = false; this.visible = true;
    this.resize(); new ResizeObserver(() => this.resize()).observe(canvas);
  }
  resize() { const d = Math.min(devicePixelRatio || 1, 2), r = this.c.getBoundingClientRect(); this.w = r.width; this.h = r.height; this.c.width = Math.max(1, r.width * d); this.c.height = Math.max(1, r.height * d); this.g.setTransform(d, 0, 0, d, 0, 0); }
  start() { if (this.running) return; this.running = true; let last = performance.now(); const step = t => { const dt = Math.min(.05, (t - last) / 1000); last = t; this.tick(dt); if (this.running) requestAnimationFrame(step); }; requestAnimationFrame(step); }
  shake(px = 10) { const h = this.host; h.animate([{ transform: 'translate(0,0)' }, { transform: `translate(${px}px,${-px * .6}px)` }, { transform: `translate(${-px * .8}px,${px * .5}px)` }, { transform: `translate(${px * .4}px,${px * .3}px)` }, { transform: 'translate(0,0)' }], { duration: 380, easing: 'ease-out' }); }
  add(o) { this.p.push(Object.assign({ vx: 0, vy: 0, life: 1, age: 0, size: 3, drag: .985, g: 0, color: '255,255,255', glow: true, shape: 'dot', rot: 0, vr: 0 }, o)); }

  boom(x = this.w / 2, y = this.h / 2) {
    this.flash = .9; this.flashColor = '255,200,140'; this.shake(14);
    this.rings.push({ x, y, r: 4, v: 520, life: .7, age: 0, w: 10, color: '255,190,120' });
    for (let i = 0; i < 90; i++) { const a = R(0, 6.283), s = R(60, 520); this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: R(.5, 1.3), size: R(2, 6), color: pick(['255,220,150', '255,150,60', '255,90,40', '255,255,220']), drag: .94, g: 120 }); }
    for (let i = 0; i < 26; i++) { const a = R(0, 6.283), s = R(20, 120); this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 30, life: R(1.2, 2.2), size: R(16, 40), color: pick(['60,40,40', '80,60,55', '40,35,40']), glow: false, drag: .97, g: -20, shape: 'smoke' }); }
  }
  sparks(x, y, colors = ['255,255,255', '120,230,255', '255,120,220']) {
    this.rings.push({ x, y, r: 2, v: 340, life: .45, age: 0, w: 3, color: pick(colors) });
    for (let i = 0; i < 44; i++) { const a = R(0, 6.283), s = R(80, 420); this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: R(.35, .9), size: R(1.5, 3.5), color: pick(colors), drag: .93, g: 260, shape: 'streak' }); }
  }
  bolt(x = R(this.w * .2, this.w * .8), y = this.h * R(.6, .9)) {
    this.flash = 1; this.flashColor = '210,225,255'; this.shake(8);
    const mk = (x0, y0, x1, y1, depth) => { const pts = [[x0, y0]]; const n = 14; for (let i = 1; i < n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + R(-1, 1) * 38 * (1 - t * .3), y0 + (y1 - y0) * t]); } pts.push([x1, y1]); this.bolts.push({ pts, life: .5, age: 0, w: depth ? 1.5 : 3.5 }); if (!depth) for (let k = 0; k < 2; k++) { const s = pts[3 + Math.floor(Math.random() * 6)]; mk(s[0], s[1], s[0] + R(-120, 120), s[1] + R(60, 180), 1); } };
    mk(x + R(-60, 60), -10, x, y, 0); this.sparks(x, y, ['200,220,255', '255,255,255']);
  }
  rain(sec = 2.2) { this.emit.push({ kind: 'rain', t: sec }); this.flashColor = '120,140,170'; this.flash = .25; }
  snow(sec = 3) { this.emit.push({ kind: 'snow', t: sec }); }
  warp(sec = 1.4) { this.emit.push({ kind: 'warp', t: sec }); this.flash = .35; this.flashColor = '160,200,255'; }
  confetti(x = this.w / 2, y = this.h * .7) { for (let i = 0; i < 120; i++) { const a = R(-2.6, -.5), s = R(250, 680); this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: R(1.6, 3), size: R(4, 8), color: pick(['255,59,48', '255,204,0', '52,199,89', '0,122,255', '175,82,222', '255,45,85', '90,200,250']), glow: false, drag: .975, g: 420, shape: 'paper', rot: R(0, 6), vr: R(-12, 12) }); } }
  slowmo(sec = 1.6) { this.slowT = sec; }
  portal(x = this.w / 2, y = this.h / 2) { for (let i = 0; i < 4; i++) this.rings.push({ x, y, r: 2 + i * 14, v: 160 + i * 40, life: 1.1, age: -i * .08, w: 4, color: pick(['140,90,255', '80,200,255', '255,90,220']) }); for (let i = 0; i < 60; i++) { const a = R(0, 6.283), r0 = R(40, 140); this.add({ x: x + Math.cos(a) * r0, y: y + Math.sin(a) * r0, vx: -Math.cos(a) * r0 * 1.6, vy: -Math.sin(a) * r0 * 1.6, life: .7, size: R(1.5, 3), color: pick(['180,140,255', '120,230,255']), drag: .99 }); } }
  cut() { this.flash = 1; this.flashColor = '255,255,255'; }

  tick(dt) {
    if (this.slowT > 0) { this.slowT -= dt; this.scale += (.18 - this.scale) * .15; } else this.scale += (1 - this.scale) * .08;
    const s = dt * this.scale, g = this.g, w = this.w, h = this.h;
    for (const e of this.emit) {
      e.t -= dt;
      if (e.kind === 'rain') for (let i = 0; i < 6; i++) this.add({ x: R(-40, w), y: -20, vx: 120, vy: R(900, 1300), life: 1.2, size: 1.2, color: '190,210,235', glow: false, drag: 1, shape: 'streak' });
      if (e.kind === 'snow') for (let i = 0; i < 2; i++) this.add({ x: R(0, w), y: -10, vx: R(-20, 20), vy: R(40, 90), life: 6, size: R(2, 4.5), color: '255,255,255', glow: true, drag: 1, shape: 'flake', rot: R(0, 6) });
      if (e.kind === 'warp') for (let i = 0; i < 10; i++) { const a = R(0, 6.283), s0 = R(200, 600); this.add({ x: w / 2 + Math.cos(a) * 10, y: h / 2 + Math.sin(a) * 10, vx: Math.cos(a) * s0, vy: Math.sin(a) * s0, life: 1.2, size: R(1, 2.2), color: pick(['200,230,255', '255,255,255', '160,190,255']), drag: 1.05, shape: 'streak' }); }
    }
    this.emit = this.emit.filter(e => e.t > 0);
    g.clearRect(0, 0, w, h);
    if (this.flash > .01) { g.fillStyle = `rgba(${this.flashColor},${this.flash * .55})`; g.fillRect(0, 0, w, h); this.flash *= Math.pow(.02, dt); }
    for (const r of this.rings) { r.age += s; if (r.age < 0) continue; r.r += r.v * s; r.v *= .96; const a = 1 - r.age / r.life; if (a <= 0) continue; g.globalCompositeOperation = 'lighter'; g.strokeStyle = `rgba(${r.color},${a})`; g.lineWidth = r.w * a + .5; g.beginPath(); g.arc(r.x, r.y, r.r, 0, 6.283); g.stroke(); }
    this.rings = this.rings.filter(r => r.age < r.life);
    for (const b of this.bolts) { b.age += dt; const a = 1 - b.age / b.life; if (a <= 0) continue; g.globalCompositeOperation = 'lighter'; g.shadowColor = 'rgba(160,190,255,1)'; g.shadowBlur = 18; g.strokeStyle = `rgba(230,240,255,${a * (Math.random() > .3 ? 1 : .4)})`; g.lineWidth = b.w; g.lineJoin = 'round'; g.beginPath(); b.pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.shadowBlur = 0; }
    this.bolts = this.bolts.filter(b => b.age < b.life);
    for (const q of this.p) {
      q.age += s; q.vx *= Math.pow(q.drag, s * 60); q.vy = q.vy * Math.pow(q.drag, s * 60) + q.g * s; q.x += q.vx * s; q.y += q.vy * s; q.rot += q.vr * s;
      const a = Math.max(0, 1 - q.age / q.life); if (!a) continue;
      g.globalCompositeOperation = q.glow ? 'lighter' : 'source-over';
      if (q.shape === 'streak') { const k = .028; g.strokeStyle = `rgba(${q.color},${a})`; g.lineWidth = q.size; g.lineCap = 'round'; g.beginPath(); g.moveTo(q.x, q.y); g.lineTo(q.x - q.vx * k, q.y - q.vy * k); g.stroke(); }
      else if (q.shape === 'smoke') { const r = q.size * (1 + q.age); const gr = g.createRadialGradient(q.x, q.y, 0, q.x, q.y, r); gr.addColorStop(0, `rgba(${q.color},${a * .5})`); gr.addColorStop(1, `rgba(${q.color},0)`); g.fillStyle = gr; g.beginPath(); g.arc(q.x, q.y, r, 0, 6.283); g.fill(); }
      else if (q.shape === 'paper') { g.save(); g.translate(q.x, q.y); g.rotate(q.rot); g.scale(1, Math.cos(q.rot * 1.7)); g.fillStyle = `rgba(${q.color},${a})`; g.fillRect(-q.size / 2, -q.size / 3, q.size, q.size * .66); g.restore(); }
      else { g.fillStyle = `rgba(${q.color},${a})`; g.beginPath(); g.arc(q.x, q.y, q.size * (q.shape === 'flake' ? 1 : a), 0, 6.283); g.fill(); }
    }
    this.p = this.p.filter(q => q.age < q.life && q.y < h + 80 && q.x > -100 && q.x < w + 100);
    g.globalCompositeOperation = 'source-over';
  }
}
