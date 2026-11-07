// Live, generated "footage": six cinematic worlds rendered in real time with WebGL.
const FRAG = `precision mediump float;
uniform vec2 R; uniform float T; uniform float M; uniform vec2 P;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 5; i++){ v += a*n(p); p = p*2.03 + 1.7; a *= .5; } return v; }
float stars(vec2 fc, float th){ vec2 c = floor(fc/2.); float s = h(c); return step(th, s) * (.5 + .5*sin(T*3. + s*80.)); }
vec3 neon(vec2 uv){
  float hz = -.06; vec3 c;
  if (uv.y > hz){
    c = mix(vec3(1., .32, .48), vec3(.07, .02, .18), smoothstep(-.02, .62, uv.y));
    c += stars(gl_FragCoord.xy, .996) * .8 * smoothstep(.2, .5, uv.y);
    vec2 sc = vec2(0., .17); float d = length(uv - sc);
    vec3 sun = mix(vec3(1., .2, .55), vec3(1., .9, .35), smoothstep(-.12, .42, uv.y));
    float band = step(.5, fract((uv.y - T*.025) * 26.)) + smoothstep(.12, .02, uv.y - sc.y + .04);
    float cut = uv.y < sc.y ? step(.35, fract((uv.y + T*.02)*24.)) : 1.;
    c = mix(c, sun, smoothstep(.29, .285, d) * cut);
    c += vec3(1., .3, .5) * .35 * exp(-d*4.5);
    float m = hz + .06 + .13*fbm(vec2(uv.x*2.4 + 3., 1.)) - .05*abs(uv.x);
    if (uv.y < m) c = mix(vec3(.12, .03, .2), vec3(.25, .05, .3), (uv.y - hz)/(m - hz + .001));
  } else {
    float z = .3/(hz - uv.y + .002); float x = uv.x*z;
    float gx = abs(fract(x) - .5), gz = abs(fract(z - T*1.6) - .5), lw = .018*z + .02;
    float l = max(smoothstep(.5 - lw, .5, gx), smoothstep(.5 - lw, .5, gz));
    c = mix(vec3(.05, .0, .1), vec3(1., .2, .8), l * exp(-z*.08));
    c += vec3(1., .3, .6) * .5 * exp(-(hz - uv.y)*18.);
  }
  return c;
}
vec3 space(vec2 uv){
  vec2 p = uv*1.7 + vec2(T*.02, 0.);
  vec2 q = vec2(fbm(p + T*.04), fbm(p + vec2(5.2, 1.3) - T*.03));
  float f = fbm(p + 2.2*q);
  vec3 c = mix(vec3(.02, .01, .06), vec3(.45, .14, .8), f);
  c = mix(c, vec3(.05, .65, 1.), smoothstep(.45, .95, q.x)*.55);
  c += vec3(1., .45, .75) * pow(f, 5.) * 2.2;
  c += stars(gl_FragCoord.xy, .994) + stars(gl_FragCoord.xy*.5, .998)*.6;
  return c;
}
vec3 sunset(vec2 uv){
  float hz = -.04; vec3 c; vec2 sc = vec2(.0, .07);
  if (uv.y > hz){
    c = mix(vec3(1., .55, .32), vec3(.32, .42, .82), smoothstep(-.02, .65, uv.y));
    c = mix(c, vec3(1., .78, .55), .5*smoothstep(.25, .0, uv.y));
    float cl = fbm(vec2(uv.x*2. + T*.02, uv.y*9.)); c = mix(c, vec3(1., .62, .55), smoothstep(.55, .8, cl)*.55*smoothstep(.05, .3, uv.y));
    float d = length(uv - sc); c = mix(c, vec3(1., .96, .82), smoothstep(.09, .085, d)); c += vec3(1., .6, .3)*.5*exp(-d*7.);
  } else {
    float dz = hz - uv.y; c = mix(vec3(.9, .45, .35), vec3(.05, .1, .25), smoothstep(.0, .35, dz));
    float w = n(vec2(uv.x*14./(dz*6. + .2), dz*90./(dz*4. + .2) - T*2.));
    float path = exp(-abs(uv.x)*(5. + dz*30.)); c += vec3(1., .8, .55) * path * smoothstep(.55, .9, w) * 1.2;
    c += vec3(1.)*smoothstep(.93, 1., w)*.25*(1. - dz*2.);
  }
  return c;
}
vec3 noir(vec2 uv){
  float fog = fbm(uv*2.5 + vec2(T*.03, 0.));
  float c = .06 + .12*fog;
  vec2 lp = vec2(.32, .42); float cone = smoothstep(.55, .0, abs(uv.x - lp.x - (lp.y - uv.y)*.18 ) - (lp.y - uv.y)*.35) * step(uv.y, lp.y);
  c += cone*.35*(.7 + .3*fog); c += .9*exp(-length(uv - lp)*18.);
  for (int i = 0; i < 6; i++){ float fi = float(i); vec2 b = vec2(h(vec2(fi, 3.))*1.6 - .8, h(vec2(fi, 7.))*.3 - .25); c += .18*smoothstep(.08, .0, length(uv - b) - .02); }
  vec2 st = vec2(uv.x*55. + uv.y*6., uv.y*1.4 + T*2.8); float id = floor(st.x); float y = fract(st.y + h(vec2(id, 1.))*9.);
  float drop = smoothstep(.06, .0, abs(fract(st.x) - .5)) * smoothstep(.0, .15, y) * smoothstep(.45, .15, y);
  c += drop*.35;
  if (uv.y < -.3) c += .15*smoothstep(.6, 1., n(vec2(uv.x*20., uv.y*60. + T*4.)))*exp(-length(uv.x - lp.x)*2.);
  return vec3(c)*vec3(1., .98, .95);
}
vec3 aurora(vec2 uv){
  vec3 c = mix(vec3(.01, .03, .08), vec3(.02, .1, .2), smoothstep(.6, -.3, uv.y));
  c += stars(gl_FragCoord.xy, .995)*.9;
  for (int i = 0; i < 3; i++){
    float fi = float(i); float x = uv.x*1.4 + fi*.9;
    float cy = .12 + fi*.06 + .1*sin(x*1.8 + T*.35 + fi) + .06*fbm(vec2(x*2., T*.1 + fi));
    float band = exp(-pow((uv.y - cy)*7., 2.)) * smoothstep(cy - .25, cy, uv.y);
    float ray = .5 + .5*n(vec2(uv.x*38. + fi*13., T*.6));
    vec3 col = mix(vec3(.15, 1., .55), vec3(.85, .3, 1.), fi/2.);
    c += col*band*ray*.9;
  }
  float hill = -.3 + .07*fbm(vec2(uv.x*2.5, 2.)); if (uv.y < hill) c = mix(vec3(.75, .82, .95)*.35, vec3(.05, .07, .12), smoothstep(hill, hill - .4, uv.y));
  return c;
}
vec3 warp(vec2 uv){
  float a = atan(uv.y, uv.x), r = length(uv); vec3 c = vec3(.01, .015, .04);
  float id = floor((a + 3.1416)/6.2832*140.);
  float sp = .25 + h(vec2(id, 2.)); float z = fract(h(vec2(id, 9.)) + T*sp*.55);
  float rad = z*z*1.6; float len = .02 + z*z*.35;
  float s = smoothstep(len, .0, abs(r - rad)) * smoothstep(.0, .2, z);
  float w = smoothstep(.45, .0, abs(fract((a + 3.1416)/6.2832*140.) - .5));
  c += mix(vec3(.5, .7, 1.), vec3(1.), z)*s*w*1.6;
  c += vec3(.3, .5, 1.)*.6*exp(-r*5.);
  return c;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - .5*R)/R.y + P*.02;
  vec3 c;
  if (M < .5) c = neon(uv); else if (M < 1.5) c = space(uv); else if (M < 2.5) c = sunset(uv); else if (M < 3.5) c = noir(uv); else if (M < 4.5) c = aurora(uv); else c = warp(uv);
  vec2 q = gl_FragCoord.xy/R; c *= .35 + .65*pow(16.*q.x*q.y*(1. - q.x)*(1. - q.y), .22);
  c += (h(gl_FragCoord.xy + fract(T)*100.) - .5)*.06;
  gl_FragColor = vec4(pow(max(c, 0.), vec3(.95)), 1.);
}`;

export function startScene(canvas) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = { R: gl.getUniformLocation(pr, 'R'), T: gl.getUniformLocation(pr, 'T'), M: gl.getUniformLocation(pr, 'M'), P: gl.getUniformLocation(pr, 'P') };
  const st = { mode: 0, px: 0, py: 0, tx: 0, ty: 0, on: true, t0: performance.now() };
  const resize = () => { const r = canvas.getBoundingClientRect(); const k = Math.min(devicePixelRatio || 1, 1.5) * (r.width < 700 ? .85 : .75); canvas.width = Math.max(2, r.width * k | 0); canvas.height = Math.max(2, r.height * k | 0); gl.viewport(0, 0, canvas.width, canvas.height); };
  resize(); new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(es => { st.on = es[0].isIntersecting; if (st.on) loop(); }, { threshold: 0 }).observe(canvas);
  let raf = 0;
  const frame = t => { raf = 0; if (!st.on || document.hidden) return; st.px += (st.tx - st.px) * .05; st.py += (st.ty - st.py) * .05;
    gl.uniform2f(U.R, canvas.width, canvas.height); gl.uniform1f(U.T, (t - st.t0) / 1000); gl.uniform1f(U.M, st.mode); gl.uniform2f(U.P, st.px, st.py); gl.drawArrays(gl.TRIANGLES, 0, 3); loop(); };
  const loop = () => { if (!raf) raf = requestAnimationFrame(frame); };
  document.addEventListener('visibilitychange', loop);
  loop();
  return { setMode: m => { st.mode = m; }, look: (x, y) => { st.tx = x; st.ty = y; } };
}
