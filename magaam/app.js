/* MAGAAM — test version. Supabase backend: auth via invite code, profiles, realtime chat, gallery. */
(() => {
'use strict';
const SB_URL = 'https://nooghogoamiywrzchxvi.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vb2dob2dvYW1peXdyemNoeHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1MDk2OTMsImV4cCI6MjExMDA4NTY5M30.soT6V1tE_aiAPcIhNpR7tuvrCkmJ33a_WGT_V-mOB_c';
const sb = supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, storageKey: 'magaam-auth', autoRefreshToken: true } });
const MEDIA = SB_URL + '/storage/v1/object/public/media/';
const SCENES = [['plaza','City plaza'],['library','Library'],['tennis','Tennis court'],['seaside','Seaside'],['cafe','Café'],['rooftop','Rooftop at sunset']];

/* ---------- icons ---------- */
const I = {
  back:'<path d="M15 5l-7 7 7 7"/>',
  gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  spark:'<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>',
  video:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9l5 3-5 3z"/>',
  bag:'<path d="M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  me:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  send:'<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  swap:'<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  pin:'<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  out:'<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  share:'<path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6"/>'
};
const ic = (n, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');

/* ---------- state ---------- */
const S = { uid:null, me:null, priv:null, members:new Map(), last:new Map(), unread:new Map(), online:new Set(),
  typing:new Map(), thread:[], threadWith:null, posts:new Map(), phone:'', pres:null, view:'', prevView:'' };
try { S.phone = localStorage.getItem('magaam-phone') || ''; } catch {}
const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };

/* ---------- helpers ---------- */
let toastT;
function toast(t, ms = 2400) { const n = $('#toast'); n.textContent = t; n.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (n.hidden = true), ms); }
const url = (p) => (p ? MEDIA + p : '');
const thumb = (p) => (p ? MEDIA + p.replace(/\.jpg$/, '-t.jpg') : '');
const sceneImg = (k) => `img/scene-${SCENES.some((s) => s[0] === k) ? k : 'plaza'}.jpg`;
const nameOf = (id) => (id === S.uid ? S.me?.name : S.members.get(id)?.name) || 'Someone';
const initial = (n) => esc((n || '?').trim().charAt(0).toUpperCase());
function hm(d) { return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); }
function when(d) {
  const t = new Date(d), now = new Date(), y = new Date(now); y.setDate(now.getDate() - 1);
  if (t.toDateString() === now.toDateString()) return hm(t);
  if (t.toDateString() === y.toDateString()) return 'Yesterday';
  return t.toLocaleDateString([], { day: 'numeric', month: 'short' });
}
function statusOf(id) {
  if (S.online.has(id)) return { on: true, text: 'Online' };
  const p = S.members.get(id); if (!p?.last_seen) return { on: false, text: 'Away' };
  const t = new Date(p.last_seen), now = new Date();
  if (now - t < 90_000) return { on: false, text: 'Last seen just now' };
  return { on: false, text: 'Last seen ' + (t.toDateString() === now.toDateString() ? hm(t) : when(t)) };
}
function thumbHTML(p, withDot = true) {
  const on = withDot && S.online.has(p.id);
  return `<span class="thumb">${p.photo_path ? `<img src="${esc(thumb(p.photo_path))}" alt="" loading="lazy" onerror="this.src='${esc(url(p.photo_path))}'">` : `<span class="ini">${initial(p.name)}</span>`}${on ? '<i class="dot on"></i>' : ''}</span>`;
}
function bgMedia(p) {
  if (p.video_path) return `<video class="bg" src="${esc(url(p.video_path))}" ${p.photo_path ? `poster="${esc(url(p.photo_path))}"` : ''} autoplay muted loop playsinline preload="auto"></video>`;
  if (p.photo_path) return `<img class="bg" src="${esc(url(p.photo_path))}" alt="">`;
  return `<div class="bg-blur" style="background-image:url('${sceneImg(p.scene)}')"></div>`;
}
async function resize(file, max, q = 0.86) {
  const src = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return await new Promise((res) => c.toBlob(res, 'image/jpeg', q));
  } finally { URL.revokeObjectURL(src); }
}
async function uploadPhoto(file, kind) {
  const [big, small] = await Promise.all([resize(file, 1600), resize(file, 520, 0.8)]);
  if (!big || !small) throw new Error('This photo could not be read. Try a JPG or PNG.');
  const base = `${S.uid}/${kind}-${Date.now()}`;
  const up = async (b, p) => { const { error } = await sb.storage.from('media').upload(p, b, { contentType: 'image/jpeg', cacheControl: '31536000' }); if (error) throw error; };
  await up(big, base + '.jpg'); await up(small, base + '-t.jpg');
  return base + '.jpg';
}
function pickFile(capture) {
  return new Promise((res) => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; if (capture) i.capture = 'user';
    i.style.cssText = 'position:fixed;left:-9999px;opacity:0'; document.body.appendChild(i);
    i.onchange = () => { res(i.files && i.files[0]); i.remove(); };
    i.addEventListener('cancel', () => { res(null); i.remove(); });
    i.click();
  });
}

/* ---------- data ---------- */
async function loadMe() {
  const [{ data: me }, { data: priv }] = await Promise.all([
    sb.from('profiles').select('*').eq('id', S.uid).maybeSingle(),
    sb.from('profiles_private').select('*').eq('id', S.uid).maybeSingle()
  ]);
  S.me = me; S.priv = priv;
}
async function loadAll() {
  const { data: ps } = await sb.from('profiles').select('*');
  S.members.clear(); (ps || []).forEach((p) => { if (p.id === S.uid) S.me = p; else if (p.name) S.members.set(p.id, p); });
  const { data: ms } = await sb.from('messages').select('*').order('created_at', { ascending: false }).limit(1000);
  S.last.clear(); S.unread.clear();
  (ms || []).forEach((m) => {
    const o = m.sender === S.uid ? m.recipient : m.sender;
    if (!S.last.has(o)) S.last.set(o, m);
    if (m.recipient === S.uid && !m.read_at) S.unread.set(o, (S.unread.get(o) || 0) + 1);
  });
}
async function loadThread(o) {
  const { data } = await sb.from('messages').select('*')
    .or(`and(sender.eq.${S.uid},recipient.eq.${o}),and(sender.eq.${o},recipient.eq.${S.uid})`)
    .order('created_at', { ascending: true }).limit(400);
  S.thread = data || []; S.threadWith = o;
}
async function loadPosts(u) {
  const { data } = await sb.from('posts').select('*').eq('user_id', u).order('created_at', { ascending: false });
  S.posts.set(u, data || []); return data || [];
}
async function markRead(o) { if ((S.unread.get(o) || 0) > 0) { S.unread.set(o, 0); await sb.rpc('mark_read', { p_other: o }); } }
const totalUnread = () => [...S.unread.values()].reduce((a, b) => a + b, 0);

/* ---------- realtime ---------- */
let rtDb = null;
function startRealtime() {
  if (rtDb) return;
  rtDb = sb.channel('db')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, ({ new: m }) => {
      const o = m.sender === S.uid ? m.recipient : m.sender;
      S.last.set(o, m);
      if (S.threadWith === o && !S.thread.some((x) => x.id === m.id)) {
        S.thread = S.thread.filter((x) => !(x.tmp && x.body === m.body && x.sender === m.sender)); S.thread.push(m);
      }
      if (m.sender !== S.uid) {
        S.typing.delete(o);
        if (route().name === 'chat' && route().id === o && document.visibilityState === 'visible') { sb.rpc('mark_read', { p_other: o }); }
        else { S.unread.set(o, (S.unread.get(o) || 0) + 1); if (route().name !== 'chat') toast(`${nameOf(o)}: ${m.body.slice(0, 60)}`); }
      }
      refresh();
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, ({ new: m }) => {
      const t = S.thread.find((x) => x.id === m.id); if (t) t.read_at = m.read_at;
      const o = m.sender === S.uid ? m.recipient : m.sender; const l = S.last.get(o); if (l && l.id === m.id) l.read_at = m.read_at;
      refresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, ({ new: p }) => {
      if (!p || !p.id) return;
      if (p.id === S.uid) S.me = p; else if (p.name) S.members.set(p.id, p);
      refresh();
    })
    .subscribe();
  S.pres = sb.channel('presence', { config: { presence: { key: S.uid } } });
  S.pres.on('presence', { event: 'sync' }, () => { S.online = new Set(Object.keys(S.pres.presenceState()).filter((k) => k !== S.uid)); refresh(); })
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload?.to !== S.uid) return; S.typing.set(payload.from, Date.now()); refresh();
      setTimeout(() => { if (Date.now() - (S.typing.get(payload.from) || 0) >= 3500) { S.typing.delete(payload.from); refresh(); } }, 3600);
    })
    .subscribe(async (st) => { if (st === 'SUBSCRIBED') await S.pres.track({ at: Date.now() }); });
  sb.rpc('touch'); setInterval(() => document.visibilityState === 'visible' && sb.rpc('touch'), 60_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { S.pres?.track({ at: Date.now() }); sb.rpc('touch'); loadAll().then(refresh); }
    else { sb.rpc('touch'); S.pres?.untrack(); }
  });
}
let lastTyping = 0;
function sendTyping(to) { const n = Date.now(); if (n - lastTyping < 2000 || !S.pres) return; lastTyping = n; S.pres.send({ type: 'broadcast', event: 'typing', payload: { from: S.uid, to } }); }

/* ---------- router ---------- */
function route() {
  const h = location.hash.replace(/^#\/?/, ''); const [name, id] = h.split('/');
  return { name: name || '', id: id || '' };
}
let navBack = false;
function go(path, replace) { const h = '#/' + path; if (replace) history.replaceState(null, '', h); else history.pushState(null, '', h); show(); }
function back(fallback) { if (history.length > 1 && S.prevView) { navBack = true; history.back(); } else { navBack = true; go(fallback, true); } }
window.addEventListener('popstate', () => { navBack = true; show(); });

const ONBOARD = ['welcome', 'signin', 'code'];
async function show() {
  let { name, id } = route();
  if (!S.uid && !ONBOARD.includes(name)) { name = 'welcome'; history.replaceState(null, '', '#/welcome'); }
  if (S.uid) {
    if (ONBOARD.includes(name) || !name) name = 'me';
    if (!S.me?.name && !['about'].includes(name)) name = 'about';
    else if (S.me?.name && !S.me?.photo_path && !['look', 'about'].includes(name)) name = 'look';
    if (location.hash.replace(/^#\/?/, '').split('/')[0] !== name) history.replaceState(null, '', '#/' + name + (id && ['chat','u','gallery'].includes(name) ? '/' + id : ''));
  }
  S.prevView = S.view; S.view = name;
  const fn = V[name] || V.me;
  const html = await fn(id);
  if (html === undefined) return;
  app.innerHTML = `<section class="view ${navBack ? 'back' : ''} ${V[name]?.cls || ''}">${html}</section>`;
  navBack = false;
  (V[name]?.after || (() => {}))(id);
}
function refresh() {
  const { name, id } = route();
  const u = V[name]?.update; if (u) u(id);
}

/* ---------- shared fragments ---------- */
function tabbar(active) {
  const t = [['spark', 'Assistant', 'soon'], ['chat', 'Chats', 'chats'], ['video', 'Video', 'soon'], ['bag', 'Shop', 'soon'], ['me', 'Me', 'me']];
  const n = totalUnread();
  return `<nav class="tabs glass" aria-label="Sections">${t.map(([i, l, r]) => `<button data-tab="${r}" ${r === active ? 'aria-current="page"' : ''}>${ic(i)}${l}${r === 'chats' && n ? `<span class="badge">${n}</span>` : ''}</button>`).join('')}</nav>`;
}
const progress = (n) => `<div class="progress" aria-label="Step ${n} of 4">${[1,2,3,4].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;
function sheet(title, items) {
  const bg = document.createElement('div'); bg.className = 'sheet-bg';
  bg.innerHTML = `<div class="sheet" role="dialog" aria-label="${esc(title)}"><div class="grab"></div><h3>${esc(title)}</h3>${items.map((it, i) => `<button class="it ${it.red ? 'red' : ''}" data-i="${i}">${ic(it.icon)}${esc(it.label)}</button>`).join('')}</div>`;
  bg.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) { bg.remove(); items[+b.dataset.i].run(); } else if (e.target === bg) bg.remove(); });
  app.appendChild(bg);
}
function installBanner() {
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  if (standalone || store.get('magaam-install-hide')) return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const txt = ios ? 'Tap Share, then “Add to Home Screen”' : (deferredPrompt ? 'Install it like a regular app' : 'Open the browser menu and choose “Add to Home screen”');
  return `<div class="install glass" id="install"><img src="img/icon-192.png" alt=""><div><b>Add MAGAAM to your Home Screen</b>${txt}</div>${!ios && deferredPrompt ? '<button data-act="install" aria-label="Install">' + ic('plus') + '</button>' : ''}<button data-act="hideinstall" aria-label="Hide">${ic('x')}</button></div>`;
}
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });

/* ---------- views ---------- */
const V = {};

V.welcome = () => `<div class="light splash">
  <img class="mark" src="img/symbol.png" alt="MAGAAM">
  <div class="word">MAGAAM</div><p class="sub">Your living self. Always here.</p>
  <div class="grow"></div>
  <button class="btn" data-go="signin">Start</button>
  <p class="fine">Test version. You need an invite code to join.</p></div>`;

V.signin = () => `<div class="light">
  <div class="topbar"><button class="iconbtn" data-back="welcome" aria-label="Back">${ic('back')}</button><span class="word">MAGAAM</span><span style="width:44px"></span></div>
  <div class="lhead"><img src="img/symbol.png" alt=""><h1>Welcome</h1><p class="sub">Sign in with your phone number</p></div>
  <form class="stack" id="f">
    <input class="field" id="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+90 536 000 00 00" value="${esc(S.phone)}" aria-label="Phone number with country code">
    <button class="btn" id="go" type="submit">Get code</button>
    <p class="err" id="err"></p>
  </form>
  <div class="grow"></div>
  <p class="fine">Enter your number with the country code, for example +90, +20 or +971.</p></div>`;
V.signin.after = () => {
  const p = $('#phone'), f = $('#f'); setTimeout(() => p.focus(), 350);
  f.onsubmit = (e) => { e.preventDefault(); const d = p.value.replace(/\D/g, '');
    if (d.length < 8 || d.length > 15) { $('#err').textContent = 'Enter the full number with the country code.'; return; }
    S.phone = '+' + d; try { localStorage.setItem('magaam-phone', S.phone); } catch {} go('code'); };
};

V.code = () => {
  if (!S.phone) { go('signin', true); return; }
  const masked = S.phone.replace(/^(\+\d{2,3})(\d{3})\d+(\d{2})$/, '$1 $2 *** ** $3');
  return `<div class="light">
  <div class="topbar"><button class="iconbtn" data-back="signin" aria-label="Back">${ic('back')}</button><span class="word">MAGAAM</span><span style="width:44px"></span></div>
  <div class="lhead"><img src="img/symbol.png" alt=""><h1>Enter the code</h1><p class="sub">Your personal invite code for ${esc(masked)}</p></div>
  <div class="codecells" id="cells">${'<span></span>'.repeat(6)}<input id="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="6-digit code"></div>
  <p class="err" id="err"></p>
  <div class="grow"></div>
  <button class="btn" id="go" disabled>Continue</button>
  <p class="fine">Test version: no SMS is sent. Use the 6-digit code Rashid gave you.</p></div>`;
};
V.code.after = () => {
  const inp = $('#code'), cells = [...document.querySelectorAll('#cells span')], btn = $('#go');
  const paint = (auto) => { const v = inp.value.replace(/\D/g, '').slice(0, 6); inp.value = v;
    cells.forEach((c, i) => { c.textContent = v[i] || ''; c.classList.toggle('cur', i === Math.min(v.length, 5) && document.activeElement === inp); });
    btn.disabled = v.length !== 6 || busy || done; if (auto === true) { $('#err').textContent = ''; if (v.length === 6) submit(); } };
  inp.addEventListener('input', () => paint(true)); inp.addEventListener('focus', () => paint()); inp.addEventListener('blur', () => paint());
  setTimeout(() => inp.focus(), 350);
  let busy = false, done = false;
  async function submit() {
    if (busy || done || !inp.isConnected) return; busy = true; btn.disabled = true; btn.innerHTML = '<span class="spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;width:22px;height:22px"></span>';
    try {
      const r = await fetch(SB_URL + '/functions/v1/login', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY }, body: JSON.stringify({ phone: S.phone, code: inp.value }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error === 'too_many' ? 'Too many attempts. Try again in 15 minutes.' : j.error === 'wrong_code' ? 'This code does not match. Check the code Rashid sent you.' : 'Could not sign in. Check your connection and try again.');
      const { error } = await sb.auth.setSession({ access_token: j.access_token, refresh_token: j.refresh_token });
      if (error) throw error;
      done = true; await afterAuth(); go('me', true);
    } catch (e) { $('#err').textContent = e.message || 'Could not sign in.'; inp.value = ''; paint(); btn.textContent = 'Continue'; }
    finally { busy = false; }
  }
  btn.onclick = submit;
};

V.about = () => `<div class="light">
  <div class="topbar"><span style="width:44px"></span>${progress(1)}<span style="width:44px"></span></div>
  <div class="lhead"><img src="img/symbol.png" alt=""><h1>About you</h1></div>
  <form class="stack" id="f">
    <label class="fl" for="nm">Name<input class="field" id="nm" maxlength="40" autocomplete="given-name" value="${esc(S.me?.name || '')}" placeholder="Your name"></label>
    <label class="fl" for="bd">Date of birth<input class="field" id="bd" type="date" value="${esc(S.priv?.birthdate || '')}" max="${new Date().toISOString().slice(0, 10)}"></label>
    <p class="fine" style="margin-top:2px">Your age keeps the right protections on for you. Only you see it.</p>
    <p class="err" id="err"></p>
  </form>
  <div class="grow"></div>
  <button class="btn" id="go">Next</button></div>`;
V.about.after = () => {
  $('#go').onclick = async () => {
    const name = $('#nm').value.trim(), bd = $('#bd').value;
    if (!name) { $('#err').textContent = 'Enter your name.'; return; }
    if (!bd) { $('#err').textContent = 'Choose your date of birth.'; return; }
    $('#go').disabled = true;
    const [a, b] = await Promise.all([sb.from('profiles').update({ name }).eq('id', S.uid).select().single(), sb.from('profiles_private').update({ birthdate: bd }).eq('id', S.uid)]);
    if (a.error || b.error) { $('#err').textContent = 'Could not save. Try again.'; $('#go').disabled = false; return; }
    S.me = a.data; go(S.me.photo_path ? 'me' : 'look');
  };
};

let pendingPhoto = null;
V.look = () => {
  const editing = !!S.me?.photo_path; const src = pendingPhoto ? pendingPhoto.preview : (S.me?.photo_path ? url(S.me.photo_path) : '');
  return `<div class="light">
  <div class="topbar">${editing ? `<button class="iconbtn" data-back="me" aria-label="Back">${ic('back')}</button>` : '<span style="width:44px"></span>'}${editing ? '<span class="word">MAGAAM</span>' : progress(2)}<span style="width:44px"></span></div>
  <div class="lhead"><h1>Your look</h1><p class="sub">This is how friends will see you</p></div>
  <div class="photo-slot">${src ? `<img src="${esc(src)}" alt="Your photo">` : `<div class="ph">${ic('camera')}Add your photo</div>`}</div>
  <div class="duo"><button class="btn" data-act="pick">${ic('image')}Upload photo</button><button class="btn out" data-act="snap">${ic('camera')}Take a photo</button></div>
  <p class="fine">A full-length photo works best</p><p class="err" id="err"></p>
  <div class="grow"></div>
  <button class="btn" id="go" ${src ? '' : 'disabled'}>${editing ? 'Save' : 'Next'}</button></div>`;
};
V.look.after = () => {
  const choose = async (cap) => { const f = await pickFile(cap); if (!f) return; pendingPhoto = { file: f, preview: URL.createObjectURL(f) }; show(); };
  app.querySelector('[data-act="pick"]').onclick = () => choose(false);
  app.querySelector('[data-act="snap"]').onclick = () => choose(true);
  $('#go').onclick = async () => {
    const editing = !!S.me?.photo_path;
    if (!pendingPhoto) { go(editing ? 'me' : 'scene'); return; }
    $('#go').disabled = true; $('#go').textContent = 'Uploading…';
    try {
      const path = await uploadPhoto(pendingPhoto.file, 'avatar');
      const { data, error } = await sb.from('profiles').update({ photo_path: path }).eq('id', S.uid).select().single(); if (error) throw error;
      S.me = data; pendingPhoto = null; go(editing ? 'me' : 'scene');
    } catch (e) { $('#err').textContent = e.message || 'Upload failed. Try again.'; $('#go').disabled = false; $('#go').textContent = editing ? 'Save' : 'Next'; }
  };
};

V.scene = () => {
  const cur = S.me?.scene || 'plaza'; const onb = !store.get('magaam-scene-done-' + S.uid);
  return `<div class="light">
  <div class="topbar"><button class="iconbtn" data-back="${onb ? 'look' : 'me'}" aria-label="Back">${ic('back')}</button>${onb ? progress(3) : '<span class="word">MAGAAM</span>'}<span style="width:44px"></span></div>
  <div class="lhead" style="margin-top:14px"><h1>Your scene</h1><p class="sub">Where you are while you're away</p></div>
  <div class="scenes">${SCENES.map(([k, l]) => `<button class="scene" data-scene="${k}" aria-pressed="${k === cur}"><img src="img/scene-${k}.jpg" alt=""><span>${l}</span></button>`).join('')}</div>
  <div class="grow"></div>
  <button class="btn" id="go" style="margin-top:12px">${onb ? 'Create my page' : 'Save'}</button></div>`;
};
V.scene.after = () => {
  let pick = S.me?.scene || 'plaza';
  app.querySelectorAll('[data-scene]').forEach((b) => (b.onclick = () => { pick = b.dataset.scene; app.querySelectorAll('[data-scene]').forEach((x) => x.setAttribute('aria-pressed', x === b)); }));
  $('#go').onclick = async () => {
    $('#go').disabled = true;
    const { data } = await sb.from('profiles').update({ scene: pick }).eq('id', S.uid).select().single();
    if (data) S.me = data; store.set('magaam-scene-done-' + S.uid, '1'); go('me');
  };
};

/* Own page */
V.me = () => {
  const m = S.me; const posts = S.posts.get(S.uid);
  if (!posts) loadPosts(S.uid).then(() => route().name === 'me' && V.me.update());
  const sc = SCENES.find((s) => s[0] === m.scene)?.[1] || 'City plaza';
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(m)}
  <div class="shade"></div>
  <div class="hdr"><div class="leftname"><b>${esc(m.name)}</b><span class="pill glass">${ic('pin').replace('<svg', '<svg style="width:15px;height:15px"')}${esc(sc)}</span></div><button class="iconbtn" data-act="settings" aria-label="Settings">${ic('gear')}</button></div>
  <div class="dock">
    ${installBanner()}
    <div class="card glass"><button class="photos-btn" data-go="gallery/${S.uid}"><span class="pt" id="pthumbs"></span><span class="pl"><b>My photos</b><span id="pcount">Open your gallery</span></span><span class="chev">${ic('back')}</span></button>
      <div class="chips"><button class="chip" data-go="look">${ic('swap')}Change look</button><button class="chip" data-go="scene">${ic('pin')}Scene</button><button class="chip" data-act="addpost">${ic('plus')}Add photo</button></div></div>
    <div id="tabs">${tabbar('me')}</div>
  </div></div>`;
};
V.me.cls = '';
V.me.update = () => {
  const posts = S.posts.get(S.uid) || [];
  const th = $('#pthumbs'); if (th) th.innerHTML = posts.length ? posts.slice(0, 3).map((x) => `<img src="${esc(thumb(x.path))}" alt="">`).join('') : `<i>${ic('image')}</i>`;
  const pc = $('#pcount'); if (pc) pc.textContent = posts.length ? `${posts.length} photo${posts.length > 1 ? 's' : ''}` : 'No photos yet. Add your first one';
  const t = $('#tabs'); if (t) t.innerHTML = tabbar('me');
};
V.me.after = () => V.me.update();

/* Chats list */
V.chats = () => `<div class="dark" style="position:absolute;inset:0">
  <div class="bg-blur" style="background-image:url('${sceneImg(S.me?.scene)}')"></div>
  <div class="listwrap">
    <div class="ltitle"><h2>Chats</h2><button class="iconbtn" data-act="search" aria-label="Search">${ic('search')}</button></div>
    <input class="search glass" id="q" placeholder="Search" hidden aria-label="Search chats">
    <div class="scroll"><div id="list"></div></div>
  </div>
  <div class="dock"><div id="tabs">${tabbar('chats')}</div></div></div>`;
V.chats.update = () => {
  const q = ($('#q')?.value || '').trim().toLowerCase();
  const list = [...S.members.values()].filter((p) => !q || (p.name || '').toLowerCase().includes(q))
    .sort((a, b) => (new Date(S.last.get(b.id)?.created_at || 0) - new Date(S.last.get(a.id)?.created_at || 0)) || (a.name || '').localeCompare(b.name || ''));
  const box = $('#list'); if (!box) return;
  box.innerHTML = list.length ? `<div class="rows glass">${list.map((p) => {
    const l = S.last.get(p.id), u = S.unread.get(p.id) || 0, ty = S.typing.has(p.id);
    const prev = ty ? 'typing…' : l ? (l.sender === S.uid ? 'You: ' : '') + l.body : 'Say hello';
    return `<button class="crow" data-go="chat/${p.id}">${thumbHTML(p)}<span class="cmid"><b>${esc(p.name)}</b><span>${esc(prev)}</span></span><span class="cend">${l ? when(l.created_at) : ''}${u ? `<span class="badge">${u}</span>` : ''}</span></button>`;
  }).join('')}</div>` : `<div class="rows glass"><div class="empty"><b>${q ? 'No one found' : 'No friends here yet'}</b><span>${q ? 'Try another name.' : 'Send the MAGAAM link and an invite code to your friends. They appear here as soon as they join.'}</span></div></div>`;
  const t = $('#tabs'); if (t) t.innerHTML = tabbar('chats');
};
V.chats.after = () => {
  V.chats.update();
  $('[data-act="search"]').onclick = () => { const q = $('#q'); q.hidden = !q.hidden; if (!q.hidden) q.focus(); else { q.value = ''; V.chats.update(); } };
  $('#q').oninput = V.chats.update;
};

/* Chat */
V.chat = async (id) => {
  if (!S.members.has(id)) { await loadAll(); if (!S.members.has(id)) { go('chats', true); return; } }
  if (S.threadWith !== id) { S.thread = []; S.threadWith = id; }
  const p = S.members.get(id);
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(p)}
  <div class="shade"></div>
  <div class="hdr"><button class="iconbtn" data-back="chats" aria-label="Back">${ic('back')}</button>
    <button class="hname" data-go="u/${id}"><b>${esc(p.name)}</b><span class="pill glass" id="st"></span></button>
    <span style="width:44px"></span></div>
  <div class="you glass">${S.me.photo_path ? `<img src="${esc(thumb(S.me.photo_path))}" alt="">` : ''}<span>You</span></div>
  <div class="msgs" id="msgs" aria-live="polite"></div>
  <form class="composer" id="cf"><textarea class="glass" id="tx" rows="1" placeholder="Message…" aria-label="Message" maxlength="2000"></textarea><button class="send" id="sendb" aria-label="Send">${ic('send', 2)}</button></form>
  </div>`;
};
V.chat.update = (id) => {
  const box = $('#msgs'); if (!box) return;
  const st = statusOf(id); const s = $('#st'); if (s) s.innerHTML = `<i class="dot ${st.on ? 'on' : ''}"></i>${esc(st.text)}`;
  const nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
  let html = '', lastDay = '';
  const lastMine = [...S.thread].reverse().find((m) => m.sender === S.uid);
  S.thread.forEach((m) => {
    const d = new Date(m.created_at).toDateString();
    if (d !== lastDay) { html += `<div class="day">${when(m.created_at) === hm(m.created_at) ? 'Today' : when(m.created_at)}</div>`; lastDay = d; }
    html += `<div class="b ${m.sender === S.uid ? 'me' : 'them'}" title="${hm(m.created_at)}">${esc(m.body)}</div>`;
    if (lastMine && m === lastMine) html += `<div class="meta">${m.tmp ? 'Sending…' : m.read_at ? 'Read ' + hm(m.read_at) : 'Sent ' + hm(m.created_at)}</div>`;
  });
  if (!S.thread.length) html = `<div class="day">Say hello to ${esc(S.members.get(id)?.name)}</div>`;
  if (S.typing.has(id)) html += '<div class="typing"><i></i><i></i><i></i></div>';
  box.innerHTML = html;
  if (nearBottom || box.dataset.init !== '1') { box.scrollTop = box.scrollHeight; box.dataset.init = '1'; }
};
V.chat.after = async (id) => {
  V.chat.update(id);
  await loadThread(id); markRead(id); V.chat.update(id);
  const tx = $('#tx'), f = $('#cf');
  const grow = () => { tx.style.height = 'auto'; tx.style.height = Math.min(tx.scrollHeight, 130) + 'px'; };
  tx.addEventListener('input', () => { grow(); if (tx.value.trim()) sendTyping(id); });
  tx.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !/mobi/i.test(navigator.userAgent)) { e.preventDefault(); f.requestSubmit(); } });
  f.onsubmit = async (e) => {
    e.preventDefault(); const body = tx.value.trim(); if (!body) return;
    tx.value = ''; grow(); tx.focus();
    const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: id, body, created_at: new Date().toISOString() };
    S.thread.push(tmp); V.chat.update(id); $('#msgs').scrollTop = 1e9;
    const { data, error } = await sb.from('messages').insert({ recipient: id, body }).select().single();
    S.thread = S.thread.filter((x) => x !== tmp);
    if (error) { toast('Message not sent. Check your connection.'); tx.value = body; grow(); }
    else if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(id, data); }
    V.chat.update(id);
  };
};

/* Someone's page */
V.u = async (id) => {
  if (id === S.uid) { go('me', true); return; }
  if (!S.members.has(id)) { await loadAll(); if (!S.members.has(id)) { go('chats', true); return; } }
  const p = S.members.get(id);
  loadPosts(id).then(() => route().name === 'u' && V.u.update(id));
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(p)}
  <div class="shade"></div>
  <div class="hdr"><button class="iconbtn" data-back="chats" aria-label="Back">${ic('back')}</button>
    <div class="hname"><b>${esc(p.name)}</b><span class="pill glass" id="st"></span></div><span style="width:44px"></span></div>
  <div class="dock"><div class="cta2"><button class="pbtn blue" data-go="chat/${id}">${ic('chat')}Message</button><button class="pbtn glass" data-go="gallery/${id}" id="gal">${ic('grid')}Gallery</button></div></div></div>`;
};
V.u.update = (id) => {
  const st = statusOf(id), s = $('#st'); if (s) s.innerHTML = `<i class="dot ${st.on ? 'on' : ''}"></i>${esc(st.text)}`;
  const g = $('#gal'); const n = (S.posts.get(id) || []).length; if (g) g.innerHTML = `${ic('grid')}Gallery <span class="n">${n}</span>`;
};
V.u.after = (id) => V.u.update(id);

/* Gallery */
V.gallery = async (id) => {
  const mine = id === S.uid; const p = mine ? S.me : S.members.get(id);
  if (!p) { go('chats', true); return; }
  const posts = await loadPosts(id);
  return `<div class="dark" style="position:absolute;inset:0">
  <div class="bg-blur" style="background-image:url('${p.photo_path ? esc(thumb(p.photo_path)) : sceneImg(p.scene)}')"></div>
  <div class="listwrap">
    <div class="ltitle"><button class="iconbtn" data-back="${mine ? 'me' : 'u/' + id}" aria-label="Back">${ic('back')}</button>
      <div class="hname"><b>${esc(p.name)}</b><span style="font-size:13.5px;opacity:.85">${posts.length} photo${posts.length === 1 ? '' : 's'}</span></div><span style="width:44px"></span></div>
    <div class="scroll" style="padding-bottom:calc(var(--sb) + 20px)"><div class="grid">
      ${mine ? `<button class="tile add" data-act="addpost" aria-label="Add photo">${ic('plus')}</button>` : ''}
      ${posts.map((x, i) => `<button class="tile" data-view="${i}"><img src="${esc(thumb(x.path))}" alt="" loading="lazy"></button>`).join('')}
    </div>${!posts.length && !mine ? `<div class="empty"><b>No photos yet</b></div>` : ''}</div>
  </div></div>`;
};
V.gallery.after = (id) => {
  app.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => openViewer(id, +b.dataset.view)));
};
function openViewer(id, i) {
  const posts = S.posts.get(id) || []; if (!posts[i]) return;
  const mine = id === S.uid; const v = document.createElement('div'); v.className = 'viewer';
  const paint = () => { v.innerHTML = `<img src="${esc(url(posts[i].path))}" alt=""><div class="hdr"><button class="iconbtn" data-x aria-label="Close">${ic('x')}</button><span style="color:#fff;padding-top:12px;font-size:14px">${i + 1} / ${posts.length}</span>${mine ? `<button class="iconbtn" data-del aria-label="Delete">${ic('trash')}</button>` : '<span style="width:44px"></span>'}</div>`; };
  paint(); app.appendChild(v);
  let sx = 0;
  v.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  v.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { i = (i + (dx < 0 ? 1 : -1) + posts.length) % posts.length; paint(); } }, { passive: true });
  v.addEventListener('click', async (e) => {
    if (e.target.closest('[data-x]')) return v.remove();
    if (e.target.closest('[data-del]')) {
      const x = posts[i]; await sb.from('posts').delete().eq('id', x.id);
      sb.storage.from('media').remove([x.path, x.path.replace(/\.jpg$/, '-t.jpg')]);
      v.remove(); toast('Photo deleted'); show(); return;
    }
    if (e.target.tagName === 'IMG' && posts.length > 1) { i = (i + 1) % posts.length; paint(); }
  });
}
async function uploadVideo() {
  const f = await new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/mp4,video/quicktime,video/webm,video/*';
    i.style.cssText = 'position:fixed;left:-9999px;opacity:0'; document.body.appendChild(i); i.onchange = () => { res(i.files && i.files[0]); i.remove(); }; i.addEventListener('cancel', () => { res(null); i.remove(); }); i.click(); });
  if (!f) return;
  if (f.size > 50 * 1024 * 1024) return toast('This video is larger than 50 MB. Use a shorter clip.', 4000);
  toast('Uploading your living video…', 120000);
  try {
    const ext = /quicktime|mov/i.test(f.type) ? 'mov' : /webm/.test(f.type) ? 'webm' : 'mp4';
    const path = `${S.uid}/video-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('media').upload(path, f, { contentType: f.type || 'video/mp4', cacheControl: '31536000' }); if (error) throw error;
    const { data, error: e2 } = await sb.from('profiles').update({ video_path: path }).eq('id', S.uid).select().single(); if (e2) throw e2;
    S.me = data; toast('Your page is alive now'); show();
  } catch (e) { toast(e.message || 'Upload failed. Try again.', 4000); }
}
async function addPost() {
  const f = await pickFile(false); if (!f) return;
  toast('Uploading…', 20000);
  try { const path = await uploadPhoto(f, 'post'); const { error } = await sb.from('posts').insert({ path }); if (error) throw error;
    await loadPosts(S.uid); toast('Added to your gallery'); show(); }
  catch (e) { toast(e.message || 'Upload failed. Try again.'); }
}

/* ---------- global clicks ---------- */
app.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-back],[data-tab],[data-act]'); if (!t) return;
  if (t.dataset.go) return go(t.dataset.go);
  if (t.dataset.back) return back(t.dataset.back);
  if (t.dataset.tab) { if (t.dataset.tab === 'soon') return toast('Coming soon'); return go(t.dataset.tab); }
  const a = t.dataset.act;
  if (a === 'addpost') return addPost();
  if (a === 'hideinstall') { store.set('magaam-install-hide', '1'); $('#install')?.remove(); return; }
  if (a === 'install' && deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; $('#install')?.remove(); }); return; }
  if (a === 'settings') return sheet('Settings', [
    { icon: 'edit', label: 'Edit name and birthday', run: () => go('about') },
    { icon: 'camera', label: 'Change photo', run: () => go('look') },
    { icon: 'pin', label: 'Change scene', run: () => go('scene') },
    { icon: 'video', label: S.me?.video_path ? 'Replace living video' : 'Add living video', run: () => uploadVideo() },
    ...(S.me?.video_path ? [{ icon: 'trash', label: 'Remove living video', run: async () => { const { data } = await sb.from('profiles').update({ video_path: null }).eq('id', S.uid).select().single(); if (data) S.me = data; show(); toast('Living video removed'); } }] : []),
    { icon: 'share', label: 'Copy invite link', run: async () => { try { await navigator.clipboard.writeText(location.origin + location.pathname); toast('Link copied'); } catch { toast(location.origin + location.pathname, 5000); } } },
    { icon: 'out', label: 'Sign out', red: true, run: async () => { await sb.auth.signOut(); location.hash = '#/welcome'; location.reload(); } }
  ]);
});

/* ---------- boot ---------- */
async function afterAuth() {
  const { data: { session } } = await sb.auth.getSession();
  S.uid = session?.user?.id || null; if (!S.uid) return;
  await loadMe(); await loadAll(); startRealtime();
}
(async function boot() {
  app.innerHTML = '<div class="center" style="background:var(--paper)"><div class="spinner"></div></div>';
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  try { await afterAuth(); } catch (e) { console.error(e); }
  if (S.uid && !S.me) { await sb.auth.signOut(); S.uid = null; }
  show();
})();
sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') { S.uid = null; } });
})();
