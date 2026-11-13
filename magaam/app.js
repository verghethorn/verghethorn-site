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
  coin: '<circle cx="12" cy="12" r="8.6"/><path d="M14.6 9.4c-.4-.9-1.4-1.4-2.6-1.4-1.5 0-2.6.8-2.6 1.9 0 2.6 5.3 1.3 5.3 4.1 0 1.1-1.2 2-2.7 2-1.3 0-2.3-.6-2.7-1.5M12 6.4V8M12 16v1.6"/>',
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
  share:'<path d="M12 3v13M7 8l5-5 5 5M5 14v6h14v-6"/>',
  play:'<path d="M8 5l11 7-11 7z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/>'
};
const T = (x) => I18N.tr(x);
const aiName = () => S.me?.ai_name || T('Your AI');
const ic = (n, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');

/* ---------- state ---------- */
const S = { uid:null, me:null, priv:null, members:new Map(), last:new Map(), unread:new Map(), online:new Set(),
  typing:new Map(), thread:[], threadWith:null, posts:new Map(), jobs:[], rx:new Map(), phone:'', pres:null, view:'', prevView:'' };
try { S.phone = localStorage.getItem('magaam-phone') || ''; } catch {}
const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };

/* ---------- helpers ---------- */
let toastT;
function toast(t, ms = 2400) { const n = $('#toast'); n.textContent = T(t); n.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (n.hidden = true), ms); }
const url = (p) => (p ? MEDIA + p : '');
const thumb = (p) => (p ? MEDIA + p.replace(/\.jpg$/, '-t.jpg') : '');
const sceneImg = (k) => `img/scene-${SCENES.some((s) => s[0] === k) ? k : 'plaza'}.jpg`;
const nameOf = (id) => (id === S.uid ? S.me?.name : S.members.get(id)?.name) || 'Someone';
const initial = (n) => esc((n || '?').trim().charAt(0).toUpperCase());
function hm(d) { return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); }
function when(d) {
  const t = new Date(d), now = new Date(), y = new Date(now); y.setDate(now.getDate() - 1);
  if (t.toDateString() === now.toDateString()) return hm(t);
  if (t.toDateString() === y.toDateString()) return T('Yesterday');
  return t.toLocaleDateString(I18N.lang, { day: 'numeric', month: 'short' });
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
  return `<span class="thumb">${p.photo_path ? `<img class="${p.video_path ? '' : 'raw'}" src="${esc(thumb(p.photo_path))}" alt="" loading="lazy" onerror="this.src='${esc(url(p.photo_path))}'">` : `<span class="ini">${initial(p.name)}</span>`}${on ? '<i class="dot on"></i>' : ''}</span>`;
}
function bgMedia(p) {
  if (p.video_path) return `<video class="bg" data-bgfor="${p.id}" src="${esc(url(p.video_path))}" ${p.photo_path ? `poster="${esc(url(p.photo_path))}"` : ''} autoplay muted loop playsinline preload="auto"></video>`;
  if (p.photo_path) return `<div class="bg rawbox" data-bgfor="${p.id}"><img src="${esc(url(p.photo_path))}" alt=""><span class="alive">${ic('spark')}Coming to life</span></div>`;
  return `<div class="bg-blur" data-bgfor="${p.id}" style="background-image:url('${sceneImg(p.scene)}')"></div>`;
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
const JOBCOLS = 'id,user_id,kind,src_path,scene,status,result_path,error,created_at,updated_at';
async function loadJobs() {
  const { data } = await sb.from('ai_jobs').select(JOBCOLS).gte('created_at', new Date(Date.now() - 86400_000).toISOString()).order('created_at', { ascending: false });
  S.jobs = data || [];
}
const avatarJob = () => S.jobs.find((j) => j.kind === 'avatar');
const pendingPostJobs = () => S.jobs.filter((j) => ['post_edit', 'video_edit'].includes(j.kind) && ['editing', 'video', 'queued'].includes(j.status));
/* ---------- coins, paid AI ---------- */
S.coins = 0;
async function loadWallet() { const { data } = await sb.from('wallets').select('coins').eq('user_id', S.uid).maybeSingle(); S.coins = data?.coins ?? 0; }
async function anim(body) {
  const { data: { session } } = await sb.auth.getSession();
  try {
    const r = await fetch(SB_URL + '/functions/v1/animate', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + (session?.access_token || '') }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({})); return { ok: r.ok, status: r.status, ...j };
  } catch { return { ok: false, status: 0, error: 'network' }; }
}
function aiError(e) {
  return e === 'daily_limit' ? 'You have used today’s AI limit. Try again tomorrow.'
    : e === 'network' ? 'AI is not available right now. Check your connection.'
    : e === 'video_length' ? 'AI can change videos from 3 to 10 seconds long.'
    : e === 'video_read' ? 'This video could not be read. Try an MP4 or MOV video.'
    : e === 'not_ai' ? 'This photo has no AI changes yet.'
    : e === 'group' ? 'Only one person can be in your profile photo, because your living photo talks for you in chats. Choose a photo where only you are visible.'
    : e === 'no_face' ? 'Your profile photo must show your face. Pictures without a person, drawings or animals are not allowed. Choose a photo where your face is visible.'
    : 'AI is not available right now. Try again later.';
}
function dayName(iso) { try { return new Date(iso).toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : I18N.lang, { weekday: 'long', day: 'numeric', month: 'long' }); } catch { return String(iso).slice(0, 10); } }
// A small dialog: message + buttons. Resolves with the chosen button key, or null.
function dialog(html, buttons) {
  return new Promise((res) => {
    const bg = document.createElement('div'); bg.className = 'sheet-bg';
    bg.innerHTML = `<div class="sheet ask" role="dialog"><div class="grab"></div>${html}${buttons.map((b) => `<button class="btn ${b.style || ''}" data-k="${b.k}">${b.icon ? ic(b.icon) : ''}${esc(b.label)}</button>`).join('')}</div>`;
    const done = (v) => { bg.remove(); res(v); };
    bg.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) done(b.dataset.k); else if (e.target === bg) done(null); });
    app.appendChild(bg);
  });
}
const balLine = (n) => `<div class="paybal">${ic('coin')}<span>Your balance: ${n} coins</span></div>`;
async function noCoins(r) {
  const k = await dialog(`${aiMsg(`This costs ${r.price} coins, and you have ${r.coins}. Top up your balance and I'll do it right away.`)}`, [{ k: 'top', label: 'Top up balance', icon: 'coin' }, { k: 'no', label: 'Not now', style: 'out' }]);
  if (k === 'top') go('wallet');
}
// Runs a paid AI action: asks to confirm the price when the server says it costs coins.
async function runPaid(body) {
  let r = await anim(body);
  if (r.status === 402 && (r.error === 'weekly' || r.error === 'confirm')) {
    if (r.coins < r.price) { await noCoins(r); return null; }
    const msg = r.error === 'weekly'
      ? `You can change your living photo for free once a week. The next free change is on ${dayName(r.next)}. Change it now for ${r.price} coins?`
      : `I'll change your ${Math.round(r.seconds)}-second video. It costs ${r.price} coins.`;
    const k = await dialog(`${aiMsg(msg)}${balLine(r.coins)}`, [{ k: 'pay', label: `Pay ${r.price} coins`, icon: 'coin' }, { k: 'no', label: r.error === 'weekly' ? 'Wait for the free change' : 'Not now', style: 'out' }]);
    if (k !== 'pay') return null;
    r = await anim({ ...body, pay: true });
  }
  if (r.status === 402 && r.error === 'coins') { await noCoins(r); return null; }
  if (!r.ok) { toast(aiError(r.error), 4500); return null; }
  if (r.cost) loadWallet().then(refresh);
  await loadJobs(); refresh(); return r;
}
// Traces AI tools leave inside image files (content credentials, generator names).
const AI_MARKS = /c2pa|jumbf|trainedAlgorithmicMedia|algorithmicMedia|midjourney|dall[·-]?e|openai|stable.?diffusion|firefly|imagen|gemini|synthid|krea|flux|leonardo|ideogram|higgsfield|kling|novelai|comfyui|made with ai|ai generated/gi;
async function fileHints(f) {
  try {
    const parts = [f.slice(0, 524288)]; if (f.size > 589824) parts.push(f.slice(f.size - 65536));
    let t = '';
    for (const part of parts) { const b = new Uint8Array(await part.arrayBuffer()); for (let i = 0; i < b.length; i += 8192) t += String.fromCharCode.apply(null, b.subarray(i, i + 8192)); }
    return [...new Set((t.match(AI_MARKS) || []).map((x) => x.toLowerCase()))].slice(0, 5);
  } catch { return []; }
}
async function startAI(kind, path, prompt) {
  const { data: { session } } = await sb.auth.getSession(); if (!session) return null;
  try {
    const r = await fetch(SB_URL + '/functions/v1/animate', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ kind, path, prompt }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { toast(j.error === 'daily_limit' ? 'You have used today’s AI limit. Try again tomorrow.' : 'AI is not available right now. Try again later.', 4000); return null; }
    await loadJobs(); refresh(); return j.job;
  } catch { toast('AI is not available right now. Check your connection.', 4000); return null; }
}
function swapBg(p) { const el = app.querySelector(`[data-bgfor="${p.id}"]`); if (!el) return; const t = document.createElement('div'); t.innerHTML = bgMedia(p); el.replaceWith(t.firstElementChild); }
const totalUnread = () => [...S.unread.values()].reduce((a, b) => a + b, 0);

/* ---------- realtime ---------- */
let rtDb = null;
function startRealtime() {
  if (rtDb) return;
  rtDb = sb.channel('db')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, ({ new: w }) => { if (w && w.user_id === S.uid) { S.coins = w.coins; refresh(); } })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, ({ new: m }) => {
      const o = m.sender === S.uid ? m.recipient : m.sender;
      S.last.set(o, m);
      if (S.threadWith === o && !S.thread.some((x) => x.id === m.id)) {
        S.thread = S.thread.filter((x) => !(x.tmp && x.sender === m.sender && (x.sticker ? x.sticker === m.sticker : x.body ? (x.body === m.body || x.orig === m.orig_body) : !!m.audio_path))); S.thread.push(m);
      }
      if (m.sender !== S.uid) {
        S.typing.delete(o);
        if (route().name === 'chat' && route().id === o && document.visibilityState === 'visible') { sb.rpc('mark_read', { p_other: o }); }
        else { S.unread.set(o, (S.unread.get(o) || 0) + 1); if (route().name !== 'chat') toast(`${nameOf(o)}: ${m.body ? m.body.slice(0, 60) : m.sticker ? T('Sticker') : T('Voice message')}`); }
      }
      refresh();
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, ({ new: m }) => {
      const t = S.thread.find((x) => x.id === m.id); if (t) Object.assign(t, m);
      const o = m.sender === S.uid ? m.recipient : m.sender; const l = S.last.get(o); if (l && l.id === m.id) l.read_at = m.read_at;
      refresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, ({ new: p }) => {
      if (!p || !p.id) return;
      const old = p.id === S.uid ? S.me : S.members.get(p.id);
      if (p.id === S.uid) S.me = p; else if (p.name) S.members.set(p.id, p);
      if (old && (old.photo_path !== p.photo_path || old.video_path !== p.video_path)) swapBg(p);
      refresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_jobs' }, ({ new: j }) => {
      if (!j?.id) return; const i = S.jobs.findIndex((x) => x.id === j.id); if (i >= 0) S.jobs[i] = { ...S.jobs[i], ...j }; else S.jobs.unshift(j);
      if (j.status === 'done' && j.kind === 'avatar') toast(`${aiName()}: your photo is alive now`);
      if (j.status === 'done' && j.kind === 'post_edit') toast(`${aiName()} added a new photo to your gallery`);
      if (j.status === 'done' && j.kind === 'video_edit') { toast(`${aiName()} added your new video to the gallery`); loadPosts(S.uid).then(refresh); }
      if (j.status === 'error' && ['avatar', 'post_edit', 'video_edit'].includes(j.kind)) toast(`${aiName()} could not finish this one. Try another photo or description.`, 4500);
      refresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, (pl) => {
      const x = pl.eventType === 'DELETE' ? pl.old : pl.new; if (!x?.message_id) return; const k = String(x.message_id);
      if (!S.rx.has(k)) S.rx.set(k, new Map());
      if (pl.eventType === 'DELETE') S.rx.get(k).delete(x.user_id); else S.rx.get(k).set(x.user_id, x.emoji);
      refresh();
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, ({ new: x }) => {
      const arr = S.posts.get(x.user_id); if (arr && !arr.some((y) => y.id === x.id)) arr.unshift(x);
      if (route().name === 'gallery' && route().id === x.user_id) show(); else refresh();
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
    if (document.visibilityState === 'visible') { S.pres?.track({ at: Date.now() }); sb.rpc('touch'); loadAll().then(refresh); if (route().name === 'chat') loadThread(route().id).then(refresh); }
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
    const hasPhoto = !!(S.me?.orig_path || S.me?.photo_path);
    if (!S.me?.name && name !== 'about') name = 'about';
    else if (S.me?.name && !S.me?.ai_name && !['about', 'assistant'].includes(name)) name = 'assistant';
    else if (S.me?.name && S.me?.ai_name && !hasPhoto && !['about', 'assistant', 'look'].includes(name)) name = 'look';
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
const progress = (n) => `<div class="progress" aria-label="Step ${n} of 3">${[1,2,3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</div>`;
function sheet(title, items, top) {
  const bg = document.createElement('div'); bg.className = 'sheet-bg';
  bg.innerHTML = `<div class="sheet" role="dialog" aria-label="${esc(title)}"><div class="grab"></div>${top ? top.html : ''}${title ? `<h3>${esc(title)}</h3>` : ''}${items.map((it, i) => `<button class="it ${it.red ? 'red' : ''}" data-i="${i}">${ic(it.icon)}<span ${it.notr ? 'data-notr' : ''}>${esc(it.label)}</span></button>`).join('')}</div>`;
  bg.addEventListener('click', (e) => { const r = e.target.closest('[data-top]'); if (r && top) { bg.remove(); top.run(r.dataset.top); return; } const b = e.target.closest('[data-i]'); if (b) { bg.remove(); items[+b.dataset.i].run(); } else if (e.target === bg) bg.remove(); });
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

V.welcome = () => `<div class="light splash"><button class="langbtn" data-act="uilang">${ic('globe')}<span data-notr>${esc(I18N.label)}</span></button>
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
    S.me = a.data; go(!S.me.ai_name ? 'assistant' : (S.me.orig_path || S.me.photo_path) ? 'me' : 'look');
  };
};

const IDEAS_AVATAR = ['I sit on the hood of a black SUV at sunset and move a chess piece', 'I read in a cozy library and turn a page', 'I walk by the sea at sunset in a white linen outfit', 'I stand on a rooftop at night with city lights'];
const IDEAS_POST = ['Change my outfit to an elegant black suit', 'Put me in Paris at night', 'Make it look like a movie poster', 'Add warm golden-hour light'];
const aiMsg = (text) => `<div class="aimsg"><span class="aiorb">${ic('spark')}</span><div><b>${esc(aiName())}</b><p>${text}</p></div></div>`;

V.assistant = () => `<div class="light">
  <div class="topbar"><span style="width:44px"></span>${progress(2)}<span style="width:44px"></span></div>
  <div class="lhead"><span class="aiorb big">${ic('spark')}</span><h1>Your AI assistant</h1><p class="sub">It helps you every day, answers friends while you are away and brings your photos to life. Give it a name.</p></div>
  <div class="stack">
    <input class="field" id="an" maxlength="30" placeholder="For example, Nova" value="${esc(S.me?.ai_name || '')}" aria-label="Your AI assistant's name">
    <div class="ideas">${[S.me?.name, 'Nova', 'Layla', 'Max'].filter(Boolean).map((n, i) => `<button class="idea" data-fill="${esc(n)}">${i === 0 ? 'Use my name: ' : ''}${esc(n)}</button>`).join('')}</div>
    <p class="err" id="err"></p>
  </div>
  <div class="grow"></div>
  <button class="btn" id="go">Next</button></div>`;
V.assistant.after = () => {
  const an = $('#an');
  app.querySelectorAll('[data-fill]').forEach((b) => (b.onclick = () => { an.value = b.dataset.fill; an.focus(); }));
  $('#go').onclick = async () => {
    const v = an.value.trim(); if (!v) { $('#err').textContent = 'Give your AI a name.'; return; }
    $('#go').disabled = true;
    const { data, error } = await sb.from('profiles').update({ ai_name: v }).eq('id', S.uid).select().single();
    if (error) { $('#err').textContent = 'Could not save. Try again.'; $('#go').disabled = false; return; }
    S.me = data; go((S.me.orig_path || S.me.photo_path) ? 'me' : 'look');
  };
};

let pendingPhoto = null, draftWish = '', lookMode = 'me';
const AI_DECIDES = '__ai__';
let lookVars = null, lookPick = -1, lookBusy = false, lookCheck = '', lookErr = '';
const varKey = () => 'magaam-var-' + S.uid;
function loadVars() { if (lookVars) return; try { lookVars = JSON.parse(store.get(varKey()) || '[]'); } catch { lookVars = []; } }
function saveVars() { store.set(varKey(), JSON.stringify(lookVars || [])); }
async function makeVariants(path, wish) {
  const { data: { session } } = await sb.auth.getSession();
  const r = await fetch(SB_URL + '/functions/v1/animate', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + (session?.access_token || '') }, body: JSON.stringify({ kind: 'variants', path, prompt: wish }) });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'ai'); return j.variants || [];
}
V.look = () => {
  loadVars();
  const editing = !!(S.me?.orig_path || S.me?.photo_path);
  const src = pendingPhoto ? pendingPhoto.preview : (S.me?.orig_path ? url(S.me.orig_path) : S.me?.photo_path ? url(S.me.photo_path) : '');
  const vars = pendingPhoto ? [] : (lookVars || []);
  return `<div class="light">
  <div class="topbar">${editing ? `<button class="iconbtn" data-back="me" aria-label="Back">${ic('back')}</button><span class="word">MAGAAM</span>` : `<span style="width:44px"></span>${progress(3)}`}<span style="width:44px"></span></div>
  <div class="lhead" style="margin-top:14px"><h1>Your living photo</h1><p class="sub">Your profile photo is always made with AI and always alive</p></div>
  <div class="photo-slot sm">${src ? `<img src="${esc(src)}" alt="Your photo">` : `<div class="ph">${ic('camera')}Add your photo</div>`}</div>
  <div class="duo"><button class="btn ${src ? 'out' : ''}" data-act="pick">${ic('image')}${src ? 'Another photo' : 'Upload photo'}</button><button class="btn out" data-act="snap">${ic('camera')}Take a photo</button></div>
  ${lookCheck === 'checking' ? `<div class="varwait"><span class="spinner"></span><span>${esc(aiName())} is looking at your photo…</span></div>`
    : lookCheck === 'ai' ? `<div class="varwait"><span class="spinner"></span><span>This photo is already made with AI. ${esc(aiName())} is bringing it to life…</span></div>`
    : lookCheck === 'hold' ? `<div class="askbox">${aiMsg(`This photo is already made with AI, so I can bring it to life right away.`)}</div>`
    : src ? `<div class="askbox">${aiMsg(lookCheck === 'real' ? `This photo has no AI changes yet. In MAGAAM every profile photo must be changed with AI. Tell me what to change: the place, your outfit and what you are doing. Or let me decide.` : `Hi ${esc(S.me?.name || '')}! I'm ${esc(aiName())}, your AI assistant. Your profile photo must be changed and brought to life. Tell me what you want to see: the place, your outfit and what you are doing.`)}
    <div class="seg2" role="group" aria-label="Who decides"><button data-mode="me" aria-pressed="${lookMode === 'me'}">I'll describe it</button><button data-mode="ai" aria-pressed="${lookMode === 'ai'}">${ic('spark')}${esc(aiName())} decides</button></div>
    ${lookMode === 'ai' ? aiMsg(`Great, I'll choose a new place, outfit and pose for you myself. Just press the button.`) : `<textarea class="field ta" id="wish" maxlength="400" placeholder="Describe your living photo">${esc(draftWish)}</textarea>
    <div class="ideas">${IDEAS_AVATAR.map((t) => `<button class="idea" data-idea="${esc(t)}">${esc(t)}</button>`).join('')}</div>`}</div>` : ''}
  ${lookBusy ? `<div class="varwait"><span class="spinner"></span><span>${esc(aiName())} is creating 4 variants… about 30 seconds</span></div>`
    : vars.length ? `<div class="vars"><h3>Pick the one you like</h3><div class="vgrid">${vars.map((v, i) => `<button class="vimg" data-var="${i}" aria-pressed="${i === lookPick}"><img src="${esc(url(v))}" alt="Variant ${i + 1}"></button>`).join('')}</div></div>` : ''}
  <p class="err" id="err">${esc(lookErr)}</p>
  <div class="grow"></div>
  ${['checking', 'ai'].includes(lookCheck) ? '' : lookCheck === 'hold' ? `<button class="btn" id="live">${ic('spark')}Bring it to life</button>`
    : vars.length && !lookBusy ? `<button class="btn" id="setp" ${lookPick < 0 ? 'disabled' : ''}>${ic('check')}Set as my profile photo</button><button class="btn out" id="go" style="margin-top:8px">${ic('spark')}Make 4 new variants</button>`
    : `<button class="btn" id="go" disabled>${ic('spark')}Create 4 variants</button>`}
  <p class="fine">${['checking', 'ai', 'hold'].includes(lookCheck) ? 'If a photo was made or changed with AI, it comes to life right away.' : !src ? 'A full-length photo works best' : vars.length ? `${esc(aiName())} will bring it to life once you set it. About 2 minutes.` : 'You can write in any language.'}</p></div>`;
};
V.look.after = () => {
  const choose = async (cap) => {
    const f = await pickFile(cap); if (!f) return; const w = $('#wish'); if (w) draftWish = w.value;
    pendingPhoto = { file: f, preview: URL.createObjectURL(f) }; lookVars = []; lookPick = -1; saveVars(); lookCheck = 'checking'; lookErr = ''; show();
    try {
      // Upload, then check whether the photo is already made or changed with AI.
      const [hints, path] = await Promise.all([fileHints(f), uploadPhoto(f, 'avatar')]);
      const r = await anim({ kind: 'check', path, hints });
      if (!r.ok) { sb.storage.from('media').remove([path, path.replace(/\.jpg$/, '-t.jpg')]); throw new Error(r.error || 'ai'); }
      // The rule: one person, with the face visible (that person speaks in chats).
      if (!r.pass) { sb.storage.from('media').remove([path, path.replace(/\.jpg$/, '-t.jpg')]); throw new Error(r.problem === 'group' ? 'group' : 'no_face'); }
      const upd = { orig_path: path }; if (!S.me?.photo_path) upd.photo_path = path;
      const { data, error } = await sb.from('profiles').update(upd).eq('id', S.uid).select().single(); if (error) throw error;
      S.me = data; pendingPhoto = null;
      if (r.ai) { lookCheck = 'ai'; show(); await bringToLife(path); return; }
      lookCheck = 'real';
    } catch (e) {
      lookCheck = ''; pendingPhoto = null; const m = String(e.message || '');
      lookErr = T(m.startsWith('This photo') ? m : aiError(m));
      if (route().name === 'look') show();
      return;
    }
    if (route().name === 'look') show();
  };
  const bringToLife = async (path) => {
    const r = await runPaid({ kind: 'avatar', path });
    if (!r) { lookCheck = 'hold'; if (route().name === 'look') show(); return false; }
    lookVars = []; lookPick = -1; saveVars(); draftWish = ''; lookMode = 'me'; lookCheck = '';
    go('me'); toast(`${aiName()} is bringing your photo to life. About 2 minutes.`, 4500); return true;
  };
  const live = $('#live'); if (live) live.onclick = async () => { live.disabled = true; lookCheck = 'ai'; show(); await bringToLife(S.me.orig_path); };
  app.querySelector('[data-act="pick"]').onclick = () => choose(false);
  app.querySelector('[data-act="snap"]').onclick = () => choose(true);
  const w = $('#wish'), btn = $('#go'), setp = $('#setp');
  app.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => { if (w) draftWish = w.value; lookMode = b.dataset.mode; show(); }));
  app.querySelectorAll('[data-var]').forEach((b) => (b.onclick = () => { lookPick = +b.dataset.var; app.querySelectorAll('[data-var]').forEach((x) => x.setAttribute('aria-pressed', x === b)); if (setp) setp.disabled = false; }));
  const hasSrc = !!app.querySelector('.photo-slot img');
  const check = () => { if (btn) btn.disabled = lookBusy || !hasSrc || (lookMode === 'ai' ? false : (!w || w.value.trim().length < 3)); if (w) draftWish = w.value; };
  if (w) { w.addEventListener('input', check); app.querySelectorAll('[data-idea]').forEach((b) => (b.onclick = () => { w.value = b.dataset.idea; check(); w.focus(); })); }
  check();
  if (btn) btn.onclick = async () => {
    const wish = lookMode === 'ai' ? AI_DECIDES : (w ? w.value.trim() : ''); if (wish.length < 3) return;
    btn.disabled = true;
    try {
      let path = S.me?.orig_path || S.me?.photo_path;
      if (pendingPhoto) {
        btn.textContent = 'Uploading…';
        path = await uploadPhoto(pendingPhoto.file, 'avatar');
        const upd = { orig_path: path }; if (!S.me?.photo_path) upd.photo_path = path;
        const { data, error } = await sb.from('profiles').update(upd).eq('id', S.uid).select().single(); if (error) throw error;
        S.me = data; pendingPhoto = null;
      }
      lookBusy = true; lookPick = -1; show();
      const v = await makeVariants(path, wish);
      lookVars = v; saveVars();
    } catch (e) {
      lookBusy = false; show();
      const m = String(e.message || '');
      $('#err').textContent = T(/fetch|network/i.test(m) ? aiError('network') : m.startsWith('This photo') ? m : aiError(m));
      return;
    }
    lookBusy = false; if (route().name === 'look') show();
  };
  if (setp) setp.onclick = async () => {
    if (lookPick < 0) return; setp.disabled = true; setp.textContent = 'Starting…';
    const r = await runPaid({ kind: 'avatar', path: lookVars[lookPick] });
    if (!r) { setp.disabled = false; setp.innerHTML = `${ic('check')}Set as my profile photo`; return; }
    lookVars = []; lookPick = -1; saveVars(); draftWish = ''; lookMode = 'me'; lookCheck = ''; go('me'); toast(`${aiName()} is bringing your photo to life. About 2 minutes.`, 4500);
  };
};

/* Own page */
V.me = () => {
  const m = S.me; const posts = S.posts.get(S.uid);
  if (!posts) loadPosts(S.uid).then(() => route().name === 'me' && V.me.update());
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(m)}
  <div class="shade"></div>
  <div class="hdr"><div class="leftname"><b data-notr>${esc(m.name)}</b><span class="pill glass aipill">${ic('spark').replace('<svg', '<svg style="width:15px;height:15px"')}${esc(aiName())}</span></div><div class="hright"><button class="pill glass coinpill" data-go="wallet" aria-label="Balance">${ic('coin')}<span data-notr id="coins">${S.coins}</span></button><button class="iconbtn" data-act="settings" aria-label="Settings">${ic('gear')}</button></div></div>
  <div class="dock">
    ${installBanner()}
    <div class="card glass"><div class="ailine" id="ailine" hidden></div><button class="photos-btn" data-go="gallery/${S.uid}"><span class="pt" id="pthumbs"></span><span class="pl"><b>My photos</b><span id="pcount">Open your gallery</span></span><span class="chev">${ic('back')}</span></button>
      <div class="chips two"><button class="chip" data-go="look">${ic('spark')}New living photo</button><button class="chip" data-act="addpost">${ic('plus')}Add photo</button></div></div>
    <div id="tabs">${tabbar('me')}</div>
  </div></div>`;
};
V.me.cls = '';
V.me.update = () => {
  const cn = $('#coins'); if (cn) cn.textContent = S.coins;
  const posts = S.posts.get(S.uid) || [];
  const th = $('#pthumbs'); if (th) th.innerHTML = posts.length ? posts.slice(0, 3).map((x) => `<img src="${esc(thumb(x.path))}" alt="">`).join('') : `<i>${ic('image')}</i>`;
  const pc = $('#pcount'); if (pc) pc.textContent = posts.length ? `${posts.length} photo${posts.length > 1 ? 's' : ''}` : 'No photos yet. Add your first one';
  const al = $('#ailine'); const j = avatarJob();
  if (al) {
    const ai = esc(aiName());
    if (j && ['editing', 'video', 'queued'].includes(j.status)) { al.hidden = false; al.innerHTML = `<span class="spinner sm"></span><span><b>${ai} is creating your living photo</b>${j.status === 'editing' ? 'Changing your photo…' : 'Bringing it to life, about 2 minutes…'}</span>`; }
    else if (j && j.status === 'error' && j === S.jobs.find((x) => x.kind === 'avatar')) { al.hidden = false; al.innerHTML = `<span>${ic('spark')}</span><span><b>${ai} could not finish your photo</b><button data-act="retryai">Try another photo or description</button></span>`; }
    else if (!S.me.video_path) { al.hidden = false; al.innerHTML = `<span>${ic('spark')}</span><span><b>Your photo is not alive yet</b><button data-act="retryai">Create my living photo</button></span>`; }
    else al.hidden = true;
  }
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
    const prev = ty ? T('typing…') : l ? (l.sender === S.uid ? T('You') + ': ' : '') + (l.body || (l.sticker ? T('Sticker') : T('Voice message'))) : T('Say hello');
    return `<button class="crow" data-go="chat/${p.id}">${thumbHTML(p)}<span class="cmid"><b data-notr>${esc(p.name)}</b><span data-notr>${esc(prev)}</span></span><span class="cend">${l ? when(l.created_at) : ''}${u ? `<span class="badge">${u}</span>` : ''}</span></button>`;
  }).join('')}</div>` : `<div class="rows glass"><div class="empty"><b>${q ? 'No one found' : 'No friends here yet'}</b><span>${q ? 'Try another name.' : 'Send the MAGAAM link and an invite code to your friends. They appear here as soon as they join.'}</span></div></div>`;
  const t = $('#tabs'); if (t) t.innerHTML = tabbar('chats');
};
V.chats.after = () => {
  V.chats.update();
  $('[data-act="search"]').onclick = () => { const q = $('#q'); q.hidden = !q.hidden; if (!q.hidden) q.focus(); else { q.value = ''; V.chats.update(); } };
  $('#q').oninput = V.chats.update;
};

/* Chat */
/* Chat helpers: translation, voice, talking photo */
const TR = new Map();
const LANGS = [['English','English'],['Русский','Russian'],['العربية','Arabic'],['Türkçe','Turkish'],['Español','Spanish'],['Français','French'],['Deutsch','German'],['Italiano','Italian'],['Português','Portuguese'],['中文','Chinese'],['हिन्दी','Hindi'],['Bahasa Indonesia','Indonesian'],['Українська','Ukrainian'],['Қазақша','Kazakh'],['O‘zbekcha','Uzbek'],['فارسی','Persian'],['اردو','Urdu']];
function myLang() {
  const v = store.get('magaam-lang'); if (v) return v;
  const map = { ru:'Russian', ar:'Arabic', tr:'Turkish', es:'Spanish', fr:'French', de:'German', it:'Italian', pt:'Portuguese', zh:'Chinese', hi:'Hindi', id:'Indonesian', uk:'Ukrainian', kk:'Kazakh', uz:'Uzbek', fa:'Persian', ur:'Urdu' };
  return I18N.lang !== 'en' ? I18N.langName : (map[(navigator.language || 'en').slice(0, 2)] || 'English');
}
const langLabel = (v) => (LANGS.find((l) => l[1] === v) || [v])[0];
function pickLang() {
  sheet('Translate messages to', LANGS.map(([l, v]) => ({ icon: v === myLang() ? 'check' : 'globe', label: l, run: () => { store.set('magaam-lang', v); TR.clear(); toast(`Messages will be translated to ${l}`); refresh(); } })));
}
async function aiCall(body) {
  const { data: { session } } = await sb.auth.getSession();
  const r = await fetch(SB_URL + '/functions/v1/ai', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + (session?.access_token || '') }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'ai'); return j;
}
const fmtSec = (s) => { s = Math.max(0, Math.round(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
function bars(seed) {
  let x = 0; for (const c of String(seed)) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  let h = ''; for (let i = 0; i < 22; i++) { x = (x * 1103515245 + 12345) >>> 0; h += `<i style="height:${30 + (x % 70)}%"></i>`; } return h;
}
/* Stickers, reactions, big emoji */
const STK_FUN = [['🔥','pulse'],['😂','shake'],['❤️','beat'],['🥳','bounce'],['😎','tilt'],['😭','shake'],['👍','bounce'],['🤯','pulse'],['🙏','bounce'],['💯','spin'],['🫶','beat'],['😴','float'],['👀','tilt'],['🎉','spin'],['💀','shake'],['🤝','bounce'],['🌙','float'],['☕','float'],['⚽','spin'],['🏆','bounce'],['🌹','float'],['✨','spin'],['🤲','float'],['🫡','tilt']];
const STK_WORDS = ['YALLA', 'HABIBI', 'MASHALLAH', 'INSHALLAH', 'BRO', 'OMG', 'LOL', 'TAMAM', 'GG', 'VIBE', 'NO WAY', 'SOON', 'АХАХА', 'ПОКА', 'Я ТУТ', 'ОКЕЙ', 'يلا', 'حبيبي', 'ماشاء الله', 'تمام'];
const STK_ME = [['laugh','😂','Laughing'],['love','🫶','Love'],['wow','😮','Wow'],['cool','😎','Cool'],['sad','😢','Sad'],['angry','😤','Angry'],['sleep','😴','Sleepy'],['hi','👋','Hi'],['party','🥳','Party']];
const REACTS = ['❤️', '😂', '🔥', '😮', '😢', '👍'];
function stickerHTML(code) {
  const [k, a, b] = String(code).split('|');
  if (k === 'e') { const f = STK_FUN.find((x) => x[0] === a); return `<span class="se a-${f ? f[1] : 'bounce'}" data-notr>${esc(f ? f[0] : '✨')}</span>`; }
  if (k === 'w') { const i = Math.max(0, STK_WORDS.indexOf(a)); return `<span class="swd sw${i % 6}" data-notr>${esc(STK_WORDS[i])}</span>`; }
  if (k === 'u' && /^[0-9a-f-]{36}\/sticker-\d+\.png$/.test(a || '')) return `<img class="su" src="${esc(url(a))}" alt="Sticker">`;
  return '';
}
const seg = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter() : null;
function isJumbo(t) {
  if (!t || t.length > 24 || !seg) return false;
  const g = [...seg.segment(t.trim())].map((x) => x.segment).filter((x) => x.trim());
  return g.length > 0 && g.length <= 3 && g.every((x) => /\p{Extended_Pictographic}/u.test(x));
}
function rxHTML(m) {
  const r = S.rx.get(String(m.id)); if (!r || !r.size) return '';
  const counts = {}; r.forEach((e) => (counts[e] = (counts[e] || 0) + 1));
  const mineE = r.get(S.uid);
  return `<span class="rx" data-notr>${Object.entries(counts).map(([e, n]) => `<span class="${e === mineE ? 'mine' : ''}">${e}${n > 1 ? `<b>${n}</b>` : ''}</span>`).join('')}</span>`;
}
async function loadRx() {
  const ids = S.thread.filter((m) => !m.tmp).map((m) => m.id); if (!ids.length) return;
  const { data } = await sb.from('reactions').select('message_id,user_id,emoji').in('message_id', ids.slice(-400));
  (data || []).forEach((x) => { const k = String(x.message_id); if (!S.rx.has(k)) S.rx.set(k, new Map()); S.rx.get(k).set(x.user_id, x.emoji); });
}
async function toggleReact(m, e) {
  if (m.tmp) return; const k = String(m.id);
  if (!S.rx.has(k)) S.rx.set(k, new Map());
  const r = S.rx.get(k), cur = r.get(S.uid);
  if (cur === e) { r.delete(S.uid); refresh(); await sb.from('reactions').delete().eq('message_id', m.id).eq('user_id', S.uid); }
  else { r.set(S.uid, e); refresh(); navigator.vibrate?.(10); await sb.from('reactions').upsert({ message_id: m.id, user_id: S.uid, emoji: e }, { onConflict: 'message_id,user_id' }); }
}
async function sendSticker(to, code) {
  const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: to, sticker: code, created_at: new Date().toISOString() };
  S.thread.push(tmp); V.chat.update(to); const box = $('#msgs'); if (box) box.scrollTop = 1e9;
  const { data, error } = await sb.from('messages').insert({ recipient: to, sticker: code }).select().single();
  S.thread = S.thread.filter((x) => x !== tmp);
  if (error) toast('Message not sent. Check your connection.'); else if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(to, data); }
  V.chat.update(to);
}
let myStickers = null;
async function loadMyStickers() { const { data } = await sb.from('stickers').select('*').eq('user_id', S.uid).order('created_at', { ascending: false }); myStickers = data || []; }
let stkTab = 'fun', stkBusy = false;
function stickerPanel(to) {
  const p = $('#stk'); if (!p) return;
  const tabs = [['fun', 'Fun'], ['words', 'Words'], ['me', 'Me stickers']];
  let body = '';
  if (stkTab === 'fun') body = `<div class="sgrid">${STK_FUN.map(([e, a]) => `<button class="sbtn" data-stk="e|${e}"><span class="se a-${a}" data-notr>${e}</span></button>`).join('')}</div>`;
  else if (stkTab === 'words') body = `<div class="sgrid words">${STK_WORDS.map((w, i) => `<button class="sbtn" data-stk="w|${esc(w)}"><span class="swd sw${i % 6}" data-notr>${esc(w)}</span></button>`).join('')}</div>`;
  else {
    if (!myStickers) { loadMyStickers().then(() => stickerPanel(to)); }
    body = `<div class="mkstk"><b>Make a sticker of me</b>
      <div class="ideas">${STK_ME.map(([k, e, l]) => `<button class="idea dark" data-mk="${k}" ${stkBusy ? 'disabled' : ''}>${e} <span>${l}</span></button>`).join('')}</div>
      <div class="mkrow"><input class="search glass" id="mkp" maxlength="200" placeholder="Or describe your sticker"><button class="send sm" id="mkgo" aria-label="Make" ${stkBusy ? 'disabled' : ''}>${ic('spark', 2)}</button></div>
      ${stkBusy ? `<div class="mkwait"><span class="spinner sm"></span><span>${esc(aiName())} is drawing your sticker…</span></div>` : ''}</div>
      <div class="sgrid">${(myStickers || []).map((x) => `<button class="sbtn" data-stk="u|${esc(x.path)}"><img class="su" src="${esc(url(x.path))}" alt="" loading="lazy"></button>`).join('') || (myStickers ? '<p class="note2">Your stickers appear here</p>' : '<span class="spinner sm"></span>')}</div>`;
  }
  p.innerHTML = `<div class="stabs">${tabs.map(([k, l]) => `<button data-stab="${k}" aria-pressed="${stkTab === k}">${l}</button>`).join('')}</div><div class="sbody">${body}</div>`;
  p.onclick = async (e) => {
    const t = e.target.closest('[data-stab]'); if (t) { stkTab = t.dataset.stab; return stickerPanel(to); }
    const s2 = e.target.closest('[data-stk]'); if (s2) { p.hidden = true; return sendSticker(to, s2.dataset.stk); }
    const mk = e.target.closest('[data-mk]'); const mg = e.target.closest('#mkgo');
    if ((mk || mg) && !stkBusy) {
      const body2 = mk ? { op: 'sticker', expr: mk.dataset.mk } : { op: 'sticker', prompt: ($('#mkp')?.value || '').trim() };
      if (!mk && (body2.prompt || '').length < 2) return;
      stkBusy = true; stickerPanel(to);
      try { const j = await aiCall(body2); if (j.sticker) { myStickers = [j.sticker, ...(myStickers || [])]; toast('Your sticker is ready'); } }
      catch (err) { toast(err.message === 'daily_limit' ? 'You have used today’s AI limit. Try again tomorrow.' : 'Could not make the sticker. Try again.'); }
      stkBusy = false; stickerPanel(to);
    }
  };
}
function msgHTML(m) {
  const mine = m.sender === S.uid;
  if (m.audio_path) {
    const talk = m.talk_status === 'ready' && m.talk_path, making = m.talk_status === 'making';
    const rxv = rxHTML(m);
    return `<div class="b voice ${mine ? 'me' : 'them'} ${playing === String(m.id) ? 'playing' : ''} ${rxv ? 'has-rx' : ''}" data-msg="${m.id}">
      <button class="vplay" data-play="${m.id}" aria-label="${playing === String(m.id) ? 'Stop' : 'Replay voice message'}">${ic(playing === String(m.id) ? 'pause' : 'play', 2)}</button>
      <span class="wave">${bars(m.id)}</span><span class="vlen">${fmtSec((m.audio_ms || 0) / 1000)}</span>
      ${talk ? `<span class="vtag" title="Living photo">${ic('spark', 2)}</span>` : making ? '<span class="vtag wait" title="Living photo is coming"><span class="spinner xs"></span></span>' : ''}${rxv}</div>`;
  }
  const rx = rxHTML(m);
  if (m.sticker) return `<div class="b stk ${mine ? 'me' : 'them'} ${rx ? 'has-rx' : ''}" data-msg="${m.id}">${stickerHTML(m.sticker)}${rx}</div>`;
  const tr = TR.get(String(m.id));
  const text = tr && tr.show ? tr.text : m.body;
  const jumbo = !(tr && tr.show) && isJumbo(m.body);
  const note = tr && tr.show ? `<button class="trnote" data-orig="${m.id}">${ic('globe')}<span>Show original</span></button>`
    : (mine && m.orig_lang ? `<span class="trnote">${ic('globe')}<span>Sent in ${esc(langLabel(m.orig_lang))}</span></span>` : '');
  return `<div class="b ${jumbo ? 'jumbo' : ''} ${mine ? 'me' : 'them'} ${rx ? 'has-rx' : ''}" data-msg="${m.id}" title="${hm(m.created_at)}"><span class="tx" data-notr>${esc(text)}</span>${note}${rx}</div>`;
}
let playing = null, player = null, talkBusy = false;
/* Media elements unlocked by the first tap, so voices can play by themselves later (iOS rule). */
const TALKER = document.createElement('video'); TALKER.setAttribute('playsinline', ''); TALKER.playsInline = true; TALKER.preload = 'auto'; TALKER.className = 'bg talkbg';
const VOICE = new Audio();
let unlocked = false;
document.addEventListener('pointerdown', () => {
  if (player?.video && TALKER.muted) TALKER.muted = false;
  if (unlocked) return; unlocked = true;
  try { TALKER.muted = false; TALKER.src = 'img/silence.mp4'; TALKER.play().then(() => TALKER.pause()).catch(() => {}); } catch {}
  try { VOICE.src = 'img/silence.mp4'; VOICE.play().then(() => VOICE.pause()).catch(() => {}); } catch {}
}, { capture: true });
const played = new Set((store.get('magaam-played') || '').split(',').filter(Boolean));
const markPlayed = (id) => { played.add(String(id)); store.set('magaam-played', [...played].slice(-300).join(',')); };
function talkEligible(m) { const p = S.members.get(m.sender) || (m.sender === S.uid ? S.me : null); return m.audio_ms >= 2000 && m.audio_ms <= 10500 && !!p?.video_path; }
function voiceMode(m) {
  if (m.talk_status === 'ready' && m.talk_path) return 'video';
  if (m.talk_status === 'failed') return 'audio';
  if (talkEligible(m) && Date.now() - new Date(m.created_at) < 180000) return 'wait';
  return 'audio';
}
function autoVoices(chatId) {
  const r = route(); if (r.name !== 'chat' || r.id !== chatId || document.visibilityState !== 'visible' || talkBusy) return;
  const next = S.thread.find((m) => m.audio_path && !m.tmp && m.sender === chatId && !played.has(String(m.id)));
  if (!next || voiceMode(next) === 'wait') return;
  playVoice(next);
}
function stopPlayer() {
  const had = player; player = null; playing = null; talkBusy = false;
  if (had) {
    try { had.audio?.pause(); had.video?.pause(); } catch {}
    if (had.video) { TALKER.classList.add('out'); setTimeout(() => { if (!player) TALKER.remove(); }, 350); }
  }
  refresh();
}
function playVoice(m) {
  const id = String(m.id);
  if (playing === id) return stopPlayer();
  if (player) stopPlayer();
  playing = id; talkBusy = true; markPlayed(id);
  if (m.talk_status === 'ready' && m.talk_path && m.sender !== S.uid) {
    const host = app.querySelector('.view .dark'); const bg = host?.querySelector(`[data-bgfor="${m.sender}"]`);
    TALKER.classList.remove('out'); TALKER.src = url(m.talk_path); TALKER.muted = false;
    if (bg) bg.after(TALKER); else host?.prepend(TALKER);
    player = { video: TALKER };
    TALKER.onended = () => stopPlayer();
    const pr = TALKER.play(); if (pr) pr.catch(() => { TALKER.muted = true; TALKER.play().catch(() => {}); toast('Tap the screen to hear the voice'); });
  } else {
    VOICE.src = url(m.audio_path); VOICE.muted = false; player = { audio: VOICE };
    VOICE.onended = () => stopPlayer();
    VOICE.play().catch(() => { toast('Tap the voice message to listen'); stopPlayer(); });
  }
  refresh();
}
async function translateMsg(m) {
  const id = String(m.id);
  TR.set(id, { text: 'Translating…', show: true }); refresh();
  try { const j = await aiCall({ op: 'translate', text: m.body, to: myLang() }); TR.set(id, { text: j.text || m.body, show: true }); }
  catch { TR.delete(id); toast('Translation is not available right now.'); }
  refresh();
}
function msgMenu(m) {
  const mineE = S.rx.get(String(m.id))?.get(S.uid);
  const top = { html: `<div class="rxrow">${REACTS.map((e) => `<button data-top="${e}" class="${e === mineE ? 'on' : ''}" aria-label="${e}">${e}</button>`).join('')}</div>`, run: (e) => toggleReact(m, e) };
  if (m.audio_path) return sheet('', [{ icon: 'play', label: 'Play', run: () => playVoice(m) }], top);
  if (m.sticker) return sheet('', [], top);
  const tr = TR.get(String(m.id));
  if (m.sender === S.uid && m.orig_body) return sheet('', [
    tr && tr.show ? { icon: 'globe', label: 'Hide original', run: () => { tr.show = false; refresh(); } } : { icon: 'globe', label: 'Show original', run: () => { TR.set(String(m.id), { text: m.orig_body, show: true }); refresh(); } },
    { icon: 'copy', label: 'Copy', run: async () => { try { await navigator.clipboard.writeText(m.body); toast('Copied'); } catch { toast('Could not copy'); } } }
  ], top);
  sheet('', [
    tr && tr.show ? { icon: 'globe', label: 'Show original', run: () => { tr.show = false; refresh(); } } : { icon: 'globe', label: `Translate to ${langLabel(myLang())}`, run: () => translateMsg(m) },
    { icon: 'copy', label: 'Copy', run: async () => { try { await navigator.clipboard.writeText(m.body); toast('Copied'); } catch { toast('Could not copy'); } } },
    { icon: 'edit', label: 'Change translation language', run: pickLang }
  ], top);
}
let rec = null;
async function startRec(to) {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return toast('Voice messages are not supported in this browser.', 4000);
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { return toast('Allow microphone access to record a voice message.', 4000); }
  const mime = ['audio/mp4', 'audio/aac', 'audio/webm;codecs=opus', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported?.(t)) || '';
  const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); const chunks = [];
  mr.ondataavailable = (e) => e.data && e.data.size && chunks.push(e.data);
  rec = { mr, stream, chunks, t0: Date.now(), to };
  mr.start(250);
  $('#cf').hidden = true; $('#rec').hidden = false;
  const tick = () => { if (!rec) return; const sec = (Date.now() - rec.t0) / 1000; $('#rect').textContent = fmtSec(sec);
    $('#rechint').textContent = sec <= 10 ? (S.me?.video_path ? 'Your living photo will say it' : 'Voice message') : 'Over 10 s: sent as a normal voice message';
    if (sec >= 60) stopRec(true); };
  rec.timer = setInterval(tick, 200); tick();
}
function stopRec(send) {
  if (!rec) return; const r = rec; rec = null; clearInterval(r.timer);
  r.mr.onstop = async () => {
    r.stream.getTracks().forEach((t) => t.stop());
    const cf = $('#cf'), rb = $('#rec'); if (cf) cf.hidden = false; if (rb) rb.hidden = true;
    if (!send) return;
    const ms = Date.now() - r.t0; if (ms < 800) return toast('Too short. Hold on a little longer.');
    const type = (r.mr.mimeType || r.chunks[0]?.type || 'audio/webm').split(';')[0];
    await sendVoice(r.to, new Blob(r.chunks, { type }), ms);
  };
  try { r.mr.stop(); } catch { r.mr.onstop(); }
}
async function sendVoice(to, blob, ms) {
  const ext = /mp4|aac|m4a/.test(blob.type) ? 'm4a' : /ogg/.test(blob.type) ? 'ogg' : 'webm';
  const ctype = ext === 'm4a' ? 'audio/mp4' : blob.type;
  const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: to, audio_path: 'pending', audio_ms: Math.round(ms), created_at: new Date().toISOString() };
  S.thread.push(tmp); V.chat.update(to); const box = $('#msgs'); if (box) box.scrollTop = 1e9;
  try {
    const path = `${S.uid}/voice-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('media').upload(path, blob, { contentType: ctype, cacheControl: '31536000' }); if (error) throw error;
    const { data, error: e2 } = await sb.from('messages').insert({ recipient: to, audio_path: path, audio_ms: Math.round(ms) }).select().single(); if (e2) throw e2;
    markPlayed(data.id);
    S.thread = S.thread.filter((x) => x !== tmp); if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(to, data); }
    V.chat.update(to);
    if (ms >= 2000 && ms <= 10500 && S.me?.video_path) aiCall({ op: 'talk', message_id: data.id }).catch(() => {});
  } catch { S.thread = S.thread.filter((x) => x !== tmp); V.chat.update(to); toast('Voice message not sent. Check your connection.'); }
}

V.chat = async (id) => {
  if (!S.members.has(id)) { await loadAll(); if (!S.members.has(id)) { go('chats', true); return; } }
  if (S.threadWith !== id) { S.thread = []; S.threadWith = id; }
  const p = S.members.get(id);
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(p)}
  <div class="shade"></div>
  <div class="hdr"><button class="iconbtn" data-back="chats" aria-label="Back">${ic('back')}</button>
    <button class="hname" data-go="u/${id}"><b data-notr>${esc(p.name)}</b><span class="pill glass" id="st"></span></button>
    <span style="width:44px"></span></div>
  <div class="you glass">${S.me.photo_path ? `<img class="${S.me.video_path ? '' : 'raw'}" src="${esc(thumb(S.me.photo_path))}" alt="">` : ''}<span>You</span></div>
  <div class="msgs" id="msgs" aria-live="polite"></div>
  <div class="stkpanel glass" id="stk" hidden></div>
  <button class="sendlang glass" id="sendlang" hidden></button>
  <form class="composer" id="cf"><button type="button" class="tool glass" id="stkb" aria-label="Stickers">${ic('smile')}</button><button type="button" class="tool glass" id="langb" aria-label="Write in">${ic('globe')}</button><textarea class="glass" id="tx" rows="1" placeholder="Message…" aria-label="Message" maxlength="2000"></textarea>
    <button type="button" class="send" id="micb" aria-label="Record a voice message">${ic('mic', 2)}</button><button class="send" id="sendb" aria-label="Send" hidden>${ic('send', 2)}</button></form>
  <div class="composer recbar" id="rec" hidden><button type="button" class="recx glass" id="reccancel" aria-label="Cancel recording">${ic('x')}</button>
    <div class="recinfo glass"><span class="recdot"></span><b id="rect">0:00</b><span id="rechint"></span></div>
    <button type="button" class="send" id="recsend" aria-label="Send voice message">${ic('send', 2)}</button></div>
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
    html += msgHTML(m);
    if (lastMine && m === lastMine) html += `<div class="meta">${m.tmp ? 'Sending…' : m.read_at ? 'Read ' + hm(m.read_at) : 'Sent ' + hm(m.created_at)}</div>`;
  });
  if (!S.thread.length) html = `<div class="day">Say hello to ${esc(S.members.get(id)?.name)}</div>`;
  if (S.typing.has(id)) html += '<div class="typing"><i></i><i></i><i></i></div>';
  box.innerHTML = html;
  if (nearBottom || box.dataset.init !== '1') { box.scrollTop = box.scrollHeight; box.dataset.init = '1'; }
  setTimeout(() => autoVoices(id), 0);
};
V.chat.after = async (id) => {
  V.chat.update(id);
  await loadThread(id); await loadRx(); markRead(id); V.chat.update(id);
  const tx = $('#tx'), f = $('#cf'), box = $('#msgs');
  const slKey = 'magaam-sl-' + id; let sendIn = store.get(slKey) || '';
  const paintSL = () => { const c = $('#sendlang'); if (!c) return; c.hidden = !sendIn; c.innerHTML = sendIn ? `${ic('globe')}<span>Sending in ${esc(langLabel(sendIn))}</span>${ic('x')}` : ''; $('#langb').classList.toggle('on', !!sendIn); };
  paintSL();
  $('#sendlang').onclick = () => { sendIn = ''; store.set(slKey, ''); paintSL(); };
  $('#langb').onclick = () => sheet('Write in', [{ icon: sendIn ? 'globe' : 'check', label: 'As I type', run: () => { sendIn = ''; store.set(slKey, ''); paintSL(); } },
    ...LANGS.map(([l, v]) => ({ icon: v === sendIn ? 'check' : 'globe', label: l, notr: true, run: () => { sendIn = v; store.set(slKey, v); paintSL(); toast(`Messages to ${S.members.get(id)?.name || ''} will be sent in ${l}`); } }))]);
  $('#stkb').onclick = () => { const p = $('#stk'); p.hidden = !p.hidden; if (!p.hidden) stickerPanel(id); };
  tx.addEventListener('focus', () => { const p = $('#stk'); if (p) p.hidden = true; });
  let lastTap = { id: null, t: 0 };
  box.addEventListener('pointerup', (e) => {
    const b = e.target.closest('.b[data-msg]'); if (!b || e.target.closest('button')) return;
    const now = Date.now();
    if (lastTap.id === b.dataset.msg && now - lastTap.t < 320) { const m = S.thread.find((x) => String(x.id) === b.dataset.msg); if (m) toggleReact(m, '❤️'); lastTap = { id: null, t: 0 }; }
    else lastTap = { id: b.dataset.msg, t: now };
  });
  const grow = () => { tx.style.height = 'auto'; tx.style.height = Math.min(tx.scrollHeight, 130) + 'px'; const has = !!tx.value.trim(); $('#sendb').hidden = !has; $('#micb').hidden = has; };
  tx.addEventListener('input', () => { grow(); if (tx.value.trim()) sendTyping(id); });
  tx.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !/mobi/i.test(navigator.userAgent)) { e.preventDefault(); f.requestSubmit(); } });
  $('#micb').onclick = () => startRec(id);
  $('#reccancel').onclick = () => stopRec(false);
  $('#recsend').onclick = () => stopRec(true);
  // play, show original, long press menu
  let lp = null, sx = 0, sy = 0;
  box.addEventListener('click', (e) => {
    const pl = e.target.closest('[data-play]'); if (pl) { const m = S.thread.find((x) => String(x.id) === pl.dataset.play); if (m && !m.tmp) playVoice(m); return; }
    const og = e.target.closest('[data-orig]'); if (og) { const t = TR.get(og.dataset.orig); if (t) { t.show = false; V.chat.update(id); } }
  });
  box.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.b[data-msg]'); if (!b || e.target.closest('button')) return;
    sx = e.clientX; sy = e.clientY; clearTimeout(lp);
    lp = setTimeout(() => { const m = S.thread.find((x) => String(x.id) === b.dataset.msg); if (m && !m.tmp) { navigator.vibrate?.(15); msgMenu(m); } }, 450);
  });
  box.addEventListener('pointermove', (e) => { if (Math.abs(e.clientX - sx) > 8 || Math.abs(e.clientY - sy) > 8) clearTimeout(lp); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => box.addEventListener(ev, () => clearTimeout(lp)));
  box.addEventListener('contextmenu', (e) => { if (e.target.closest('.b[data-msg]')) e.preventDefault(); });
  f.onsubmit = async (e) => {
    e.preventDefault(); const original = tx.value.trim(); if (!original) return;
    tx.value = ''; grow(); tx.focus();
    const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: id, body: original, orig: original, created_at: new Date().toISOString() };
    S.thread.push(tmp); V.chat.update(id); box.scrollTop = 1e9;
    let row = { recipient: id, body: original };
    if (sendIn) {
      try { const j = await aiCall({ op: 'translate', text: original, to: sendIn }); if (j.text) row = { recipient: id, body: j.text.slice(0, 2000), orig_body: original, orig_lang: sendIn }; }
      catch { S.thread = S.thread.filter((x) => x !== tmp); V.chat.update(id); toast('Translation is not available right now.'); tx.value = original; grow(); return; }
    }
    const { data, error } = await sb.from('messages').insert(row).select().single();
    S.thread = S.thread.filter((x) => x !== tmp);
    if (error) { toast('Message not sent. Check your connection.'); tx.value = original; grow(); }
    else if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(id, data); }
    V.chat.update(id);
  };
};
window.addEventListener('hashchange', () => { if (player) stopPlayer(); if (rec) stopRec(false); });

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
    <div class="hname"><b data-notr>${esc(p.name)}</b><span class="pill glass" id="st"></span></div><span style="width:44px"></span></div>
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
      ${mine ? `<button class="tile add" data-act="addpost" aria-label="Add photo or video">${ic('plus')}</button>` : ''}
      ${mine ? pendingPostJobs().map(() => `<div class="tile wait"><span class="spinner sm"></span><span>AI is working…</span></div>`).join('') : ''}
      ${posts.map((x, i) => `<button class="tile" data-view="${i}">${x.video_path ? `<video src="${esc(url(x.video_path))}#t=0.1" muted playsinline preload="metadata" style="background-image:url('${esc(thumb(x.path))}')"></video><i class="play">${ic('video')}</i>` : `<img src="${esc(thumb(x.path))}" alt="" loading="lazy">`}</button>`).join('')}
    </div>${!posts.length && !mine ? `<div class="empty"><b>No photos yet</b></div>` : ''}</div>
  </div></div>`;
};
V.gallery.after = (id) => {
  app.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => openViewer(id, +b.dataset.view)));
};
function openViewer(id, i) {
  const posts = S.posts.get(id) || []; if (!posts[i]) return;
  const mine = id === S.uid; const v = document.createElement('div'); v.className = 'viewer';
  const paint = () => { const x = posts[i]; v.innerHTML = `${x.video_path ? `<video src="${esc(url(x.video_path))}" poster="${esc(url(x.path))}" autoplay loop playsinline controls></video>` : `<img src="${esc(url(x.path))}" alt="">`}<div class="hdr"><button class="iconbtn" data-x aria-label="Close">${ic('x')}</button><span style="color:#fff;padding-top:12px;font-size:14px">${i + 1} / ${posts.length}</span>${mine ? `<button class="iconbtn" data-del aria-label="Delete">${ic('trash')}</button>` : '<span style="width:44px"></span>'}</div>`; };
  paint(); app.appendChild(v);
  let sx = 0;
  v.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
  v.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) { i = (i + (dx < 0 ? 1 : -1) + posts.length) % posts.length; paint(); } }, { passive: true });
  v.addEventListener('click', async (e) => {
    if (e.target.closest('[data-x]')) return v.remove();
    if (e.target.closest('[data-del]')) {
      const x = posts[i]; await sb.from('posts').delete().eq('id', x.id);
      sb.storage.from('media').remove([x.path, x.path.replace(/\.jpg$/, '-t.jpg'), ...(x.video_path ? [x.video_path] : [])]);
      v.remove(); toast('Photo deleted'); show(); return;
    }
    if (e.target.tagName === 'IMG' && posts.length > 1) { i = (i + 1) % posts.length; paint(); }
  });
}
const IDEAS_VIDEO = ['Move me to a neon city at night', 'Turn it into an anime film scene', 'Put me on a beach at sunset', 'Make it look like a film from the 80s'];
// Reads a video's length and size and takes a still frame for the gallery tile.
function videoInfo(f) {
  return new Promise((res) => {
    const v = document.createElement('video'); v.muted = true; v.playsInline = true; v.preload = 'auto';
    const u = URL.createObjectURL(f); let over = false;
    const fin = (x) => { if (over) return; over = true; res(x); setTimeout(() => URL.revokeObjectURL(u), 2000); };
    v.onloadedmetadata = () => { v.currentTime = Math.min(0.5, (v.duration || 1) / 3); };
    v.onseeked = async () => {
      const k = Math.min(1, 1280 / Math.max(v.videoWidth, v.videoHeight || 1));
      const c = document.createElement('canvas'); c.width = Math.round(v.videoWidth * k); c.height = Math.round(v.videoHeight * k);
      try { c.getContext('2d').drawImage(v, 0, 0, c.width, c.height); } catch { return fin(null); }
      const poster = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.85));
      fin({ dur: v.duration, w: v.videoWidth, h: v.videoHeight, poster });
    };
    v.onerror = () => fin(null); setTimeout(() => fin(null), 20000);
    v.src = u; v.load();
  });
}
function pickVideo() {
  return new Promise((res) => { const i = document.createElement('input'); i.type = 'file'; i.accept = 'video/mp4,video/quicktime,video/webm,video/*';
    i.style.cssText = 'position:fixed;left:-9999px;opacity:0'; document.body.appendChild(i); i.onchange = () => { res(i.files && i.files[0]); i.remove(); }; i.addEventListener('cancel', () => { res(null); i.remove(); }); i.click(); });
}
async function addVideoPost() {
  const f = await pickVideo(); if (!f) return;
  if (f.size > 50 * 1024 * 1024) return toast('This video is larger than 50 MB. Use a shorter clip.', 4000);
  toast('Uploading your video…', 120000);
  let info, path, vpath;
  try {
    info = await videoInfo(f); if (!info || !info.poster) throw new Error('This video could not be read. Try an MP4 or MOV video.');
    const ext = /quicktime|mov/i.test(f.type) || /\.mov$/i.test(f.name) ? 'mov' : /webm/.test(f.type) ? 'webm' : 'mp4';
    vpath = `${S.uid}/clip-${Date.now()}.${ext}`;
    const [p] = await Promise.all([uploadPhoto(info.poster, 'vframe'), sb.storage.from('media').upload(vpath, f, { contentType: f.type || 'video/mp4', cacheControl: '31536000' }).then(({ error }) => { if (error) throw error; })]);
    path = p;
  } catch (e) { toast(e.message || 'Upload failed. Try again.', 4000); return; }
  $('#toast').hidden = true;
  const canAI = /\.(mp4|mov)$/.test(vpath) && info.dur >= 3 && info.dur <= 10.05 && Math.min(info.w, info.h) >= 720;
  const cost = Math.max(3, Math.ceil(info.dur - 0.05)) * 25;
  const k = await dialog(aiMsg(canAI ? `Nice video! Post it as it is, or I can change it with AI: a new place, style or outfit. For this video it costs ${cost} coins.` : `Nice video! I'll post it as it is. AI can change videos from 3 to 10 seconds long, in at least 720p.`),
    [{ k: 'post', label: 'Post as it is', icon: 'check' }, ...(canAI ? [{ k: 'ai', label: 'Change with AI', icon: 'spark', style: 'soft' }] : []), { k: 'no', label: 'Cancel', style: 'out' }]);
  const drop = () => sb.storage.from('media').remove([vpath, path, path.replace(/\.jpg$/, '-t.jpg')]);
  if (k === 'post') {
    const { error } = await sb.from('posts').insert({ user_id: S.uid, path, video_path: vpath });
    if (error) { toast('Upload failed. Try again.'); return; }
    await loadPosts(S.uid); toast('Video added'); show(); return;
  }
  if (k !== 'ai') { drop(); return; }
  const wish = await askAI(`How should I change your video? Pick an idea, write your own, or let me decide.`, IDEAS_VIDEO, 'Change my video');
  if (!wish) { drop(); return; }
  const r = await runPaid({ kind: 'video_edit', path, video: vpath, prompt: wish });
  if (r) { toast(`${aiName()} is changing your video. About 3 minutes.`, 4500); show(); } else drop();
}
function askAI(msg, ideas, cta, ideasPromise) {
  return new Promise((res) => {
    const bg = document.createElement('div'); bg.className = 'sheet-bg';
    const chips = (list) => list.map((t) => `<button class="idea" data-idea="${esc(t)}">${esc(t)}</button>`).join('');
    bg.innerHTML = `<div class="sheet ask" role="dialog" aria-label="${esc(aiName())}"><div class="grab"></div>${aiMsg(msg)}
      <div class="ideas" id="askideas">${ideasPromise ? `<span class="idea muted"><span class="spinner xs dark"></span>${esc(aiName())} is looking at your photo…</span>` : chips(ideas)}</div>
      <textarea class="field ta" id="askta" maxlength="400" placeholder="Or write your own idea"></textarea>
      <button class="btn" id="askgo" disabled>${ic('spark')}${esc(cta)}</button>
      <button class="btn soft" id="askai">${ic('spark')}Let ${esc(aiName())} decide</button>
      <button class="btn out" id="askno">Cancel</button></div>`;
    const done = (v) => { bg.remove(); res(v); };
    app.appendChild(bg);
    const ta = $('#askta', bg), go2 = $('#askgo', bg), box = $('#askideas', bg);
    const wire = () => box.querySelectorAll('[data-idea]').forEach((b) => (b.onclick = () => { ta.value = b.dataset.idea; go2.disabled = false; }));
    wire();
    if (ideasPromise) ideasPromise.then((list) => { box.innerHTML = chips(list && list.length ? list : ideas); wire(); }).catch(() => { box.innerHTML = chips(ideas); wire(); });
    ta.addEventListener('input', () => (go2.disabled = ta.value.trim().length < 3));
    go2.onclick = () => done(ta.value.trim());
    $('#askai', bg).onclick = () => done(AI_DECIDES);
    $('#askno', bg).onclick = () => done(null);
    bg.addEventListener('click', (e) => { if (e.target === bg) done(null); });
  });
}
async function addPost() {
  const f = await pickFile(false); if (!f) return;
  toast('Uploading…', 30000);
  let path;
  try { path = await uploadPhoto(f, 'src'); } catch (e) { toast(e.message || 'Upload failed. Try again.'); return; }
  $('#toast').hidden = true;
  const ideasP = aiCall({ op: 'ideas', path, lang: I18N.langName }).then((j) => j.ideas || []);
  const wish = await askAI(`Every photo in MAGAAM is made with AI. Here are my ideas for this photo. Pick one, write your own, or let me decide.`, IDEAS_POST, 'Change my photo', ideasP);
  if (!wish) { sb.storage.from('media').remove([path, path.replace(/\.jpg$/, '-t.jpg')]); return; }
  if (await startAI('post_edit', path, wish)) toast(`${aiName()} is changing your photo. About 30 seconds.`, 4000);
}

/* Balance */
const PACKS = [[500, '$4.99'], [1200, '$9.99'], [3000, '$19.99']];
const REASONS = { welcome: 'Welcome gift', 'living photo': 'Living photo', 'video change': 'Video change', refund: 'Refund', 'top up': 'Top up' };
V.wallet = async () => {
  const [{ data: tx }] = await Promise.all([sb.from('wallet_tx').select('delta,reason,created_at').order('created_at', { ascending: false }).limit(20), loadWallet()]);
  const d = (iso) => { try { return new Date(iso).toLocaleDateString(I18N.lang === 'en' ? 'en-GB' : I18N.lang, { day: 'numeric', month: 'short' }); } catch { return ''; } };
  return `<div class="light">
  <div class="topbar"><button class="iconbtn" data-back="me" aria-label="Back">${ic('back')}</button><span class="word">MAGAAM</span><span style="width:44px"></span></div>
  <div class="lhead" style="margin-top:14px"><h1>Balance</h1><p class="sub">Coins pay for extra AI magic</p></div>
  <div class="wbal">${ic('coin', 1.6)}<b id="wcoins" data-notr>${S.coins}</b><span>coins</span></div>
  <h3 class="wh">Free</h3>
  <div class="wlist"><div><span>A new living photo once a week</span><b class="free">Free</b></div><div><span>Photo variants and gallery photo changes</span><b class="free">Free</b></div></div>
  <h3 class="wh">With coins</h3>
  <div class="wlist"><div><span>A new living photo before the week is over</span><b>150</b></div><div><span>Change a video with AI, per second</span><b>25</b></div></div>
  <h3 class="wh">Top up</h3>
  <div class="packs">${PACKS.map(([c, p]) => `<button class="pack" data-pack="${c}"><b data-notr>${c}</b><span>coins</span><i data-notr>${p}</i></button>`).join('')}</div>
  <p class="fine">Payments open soon. In the test version the MAGAAM team adds coins for you.</p>
  <h3 class="wh">History</h3>
  <div class="wlist">${(tx || []).map((t) => `<div><span>${esc(REASONS[t.reason] || t.reason)} <small data-notr>${esc(d(t.created_at))}</small></span><b class="${t.delta > 0 ? 'plus' : ''}" data-notr>${t.delta > 0 ? '+' : '−'}${Math.abs(t.delta)}</b></div>`).join('') || '<div><span>No payments yet</span></div>'}</div>
  <div style="height:24px"></div></div>`;
};
V.wallet.after = () => app.querySelectorAll('[data-pack]').forEach((b) => (b.onclick = () => toast('Payments open soon', 3000)));
V.wallet.update = () => { const c = $('#wcoins'); if (c) c.textContent = S.coins; };

/* ---------- global clicks ---------- */
app.addEventListener('click', (e) => {
  const t = e.target.closest('[data-go],[data-back],[data-tab],[data-act]'); if (!t) return;
  if (t.dataset.go) return go(t.dataset.go);
  if (t.dataset.back) return back(t.dataset.back);
  if (t.dataset.tab) { if (t.dataset.tab === 'soon') return toast('Coming soon'); return go(t.dataset.tab); }
  const a = t.dataset.act;
  if (a === 'addpost') return sheet('Add to gallery', [{ icon: 'image', label: 'Photo', run: addPost }, { icon: 'video', label: 'Video', run: addVideoPost }]);
  if (a === 'uilang') return pickUiLang();
  if (a === 'retryai') return go('look');
  if (a === 'hideinstall') { store.set('magaam-install-hide', '1'); $('#install')?.remove(); return; }
  if (a === 'install' && deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; $('#install')?.remove(); }); return; }
  if (a === 'settings') return sheet('Settings', [
    { icon: 'edit', label: 'Edit name and birthday', run: () => go('about') },
    { icon: 'spark', label: 'New living photo', run: () => go('look') },
    { icon: 'coin', label: `Balance: ${S.coins} coins`, run: () => go('wallet') },
    { icon: 'edit', label: `Rename ${aiName()}`, run: () => go('assistant') },
    { icon: 'globe', label: `App language: ${I18N.label}`, run: pickUiLang },
    { icon: 'globe', label: `Translation language: ${langLabel(myLang())}`, run: pickLang },
    { icon: 'share', label: 'Copy invite link', run: async () => { try { await navigator.clipboard.writeText(location.origin + location.pathname); toast('Link copied'); } catch { toast(location.origin + location.pathname, 5000); } } },
    { icon: 'out', label: 'Sign out', red: true, run: async () => { await sb.auth.signOut(); location.hash = '#/welcome'; location.reload(); } }
  ]);
});

/* ---------- interface language ---------- */
new MutationObserver((ms) => { if (I18N.lang === 'en') return; for (const m of ms) { if (m.type === 'characterData') { if (m.target.parentElement) I18N.apply(m.target.parentElement); } else m.addedNodes.forEach((n) => { if (n.nodeType === 1) I18N.apply(n); else if (n.nodeType === 3 && n.parentElement) I18N.apply(n.parentElement); }); } })
  .observe(app, { childList: true, subtree: true, characterData: true });
function pickUiLang() {
  sheet('Choose your language', I18N.LANGS.map(([code, label]) => ({ icon: code === I18N.lang ? 'check' : 'globe', label, notr: true, run: async () => {
    I18N.set(code); if (!store.get('magaam-lang')) TR.clear();
    if (S.uid) sb.from('profiles').update({ ui_lang: code }).eq('id', S.uid);
    show();
  } })));
}

/* ---------- boot ---------- */
async function afterAuth() {
  const { data: { session } } = await sb.auth.getSession();
  S.uid = session?.user?.id || null; if (!S.uid) return;
  await loadMe(); await loadAll(); await loadJobs(); await loadWallet(); startRealtime();
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
