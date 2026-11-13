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
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
  useradd: '<circle cx="10" cy="8" r="4"/><path d="M3 21c1-4 3.6-6 7-6 1.4 0 2.6.3 3.6.9M19 14v6M16 17h6"/>',
  qr: '<rect x="3.5" y="3.5" width="6" height="6" rx="1"/><rect x="14.5" y="3.5" width="6" height="6" rx="1"/><rect x="3.5" y="14.5" width="6" height="6" rx="1"/><path d="M14.5 14.5h2.5v2.5h-2.5zM18.5 18.5h2v2h-2zM14.5 19.5h1.5M19.5 14.5v2"/>',
  block: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
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
const S = { extra: new Map(), streaks: new Map(), reqIn: [], reqOut: new Set(), blocked: [], uid:null, me:null, priv:null, members:new Map(), last:new Map(), unread:new Map(), online:new Set(),
  typing:new Map(), thread:[], threadWith:null, posts:new Map(), jobs:[], rx:new Map(), phone:'', pres:null, view:'', prevView:'' };
try { S.phone = localStorage.getItem('magaam-phone') || ''; } catch {}
const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };

/* ---------- helpers ---------- */
let toastT;
function toast(t, ms = 2400) { const n = $('#toast'); n.textContent = T(t); n.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => (n.hidden = true), ms); }
const url = (p) => (p ? MEDIA + p : '');
const thumb = (p) => (p ? MEDIA + p.replace(/\.jpg$/, '-t.jpg') : '');
const sceneImg = (k) => `img/scene-${SCENES.some((s) => s[0] === k) ? k : 'plaza'}.jpg`;
const nameOf = (id) => (id === S.uid ? S.me?.name : S.members.get(id)?.name || S.extra?.get(id)?.name || S.people?.get(id)?.name) || 'Someone';
const initial = (n) => esc((n || '?').trim().charAt(0).toUpperCase());
function hm(d) { return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); }
function when(d) {
  const t = new Date(d), now = new Date(), y = new Date(now); y.setDate(now.getDate() - 1);
  if (t.toDateString() === now.toDateString()) return hm(t);
  if (t.toDateString() === y.toDateString()) return T('Yesterday');
  return t.toLocaleDateString(I18N.lang, { day: 'numeric', month: 'short' });
}
// A friend's AI assistant speaks for them when they have been away for 5 minutes.
const awayOn = (id) => { const p = S.members.get(id); if (!p || p.away_ai === false || !p.ai_name || S.online.has(id)) return false; return !p.last_seen || Date.now() - new Date(p.last_seen) > 5 * 60_000; };
S.aiTyping = new Set();
function statusOf(id) {
  if (S.online.has(id)) return { on: true, text: 'Online' };
  const p = S.members.get(id) || S.extra.get(id); if (!p?.last_seen) return { on: false, text: 'Away' };
  const t = new Date(p.last_seen), now = new Date();
  if (now - t < 90_000) return { on: false, text: 'Last seen just now' };
  return { on: false, text: 'Last seen ' + (t.toDateString() === now.toDateString() ? hm(t) : when(t)) };
}
function thumbHTML(p, withDot = true) {
  const on = withDot && S.online.has(p.id);
  const ph = p.still_path || p.photo_path;
  return `<span class="thumb">${ph ? `<img class="${p.video_path || p.still_path ? '' : 'raw'}" src="${esc(thumb(ph))}" alt="" loading="lazy" onerror="this.src='${esc(url(ph))}'">` : `<span class="ini">${initial(p.name)}</span>`}${on ? '<i class="dot on"></i>' : ''}</span>`;
}
function bgMedia(p) {
  const still = p.still_path || p.photo_path;
  // Two copies of the living video crossfade at the end, so the loop never jumps.
  if (p.video_path) { const v = esc(url(p.video_path)), si = still ? `<img class="lvstill" src="${esc(url(still))}" alt="">` : ''; return `<div class="bg loopbox" data-bgfor="${p.id}">${si}<video class="lv on" src="${v}" autoplay muted playsinline webkit-playsinline disablepictureinpicture disableremoteplayback preload="auto"></video><video class="lv" src="${v}" muted playsinline webkit-playsinline disablepictureinpicture disableremoteplayback preload="auto"></video></div>`; }
  // The AI photo shows right away and gently "breathes" while its living video is being made.
  if (p.still_path) return `<div class="bg stillbox" data-bgfor="${p.id}"><img src="${esc(url(p.still_path))}" alt=""></div>`;
  if (p.photo_path) return `<div class="bg rawbox" data-bgfor="${p.id}"><img src="${esc(url(p.photo_path))}" alt=""><span class="alive">${ic('spark')}Not alive yet</span></div>`;
  return `<div class="bg-blur" data-bgfor="${p.id}" style="background-image:url('${sceneImg(p.scene)}')"></div>`;
}
// Crossfade loop for living videos, and a light check on living photos still being made.
// The AI photo always sits under the video, so the screen is never black; a video only shows once it really plays.
// play() on iPhone can stay pending forever (Low Power Mode, a slow network): give up after 2.5 s and try again later.
const lvPlay = (v) => { v.muted = true; v.defaultMuted = true; v.playsInline = true; const pr = v.play() || Promise.resolve();
  return Promise.race([pr, new Promise((_, rej) => setTimeout(() => rej(new Error('slow')), 2500))]); };
// The video shows only once it really moves; until then the AI photo "breathes" underneath.
document.addEventListener('playing', (e) => { const box = e.target.closest?.('.loopbox'); if (box) box.classList.add('live'); }, true);
setInterval(() => {
  app.querySelectorAll('.loopbox').forEach((box) => {
    const [a, b] = box.querySelectorAll('video'); if (!a || !b) return;
    const cur = a.classList.contains('on') ? a : b, nxt = cur === a ? b : a;
    if (box.dataset.x || document.hidden) return;
    if (cur.paused && !cur.ended) { box.dataset.x = '1'; lvPlay(cur).then(() => box.classList.add('live')).catch(() => {}).finally(() => delete box.dataset.x); return; }
    if (!cur.paused) box.classList.add('live');
    if (!cur.duration || !isFinite(cur.duration)) return;
    if (cur.ended || cur.currentTime > cur.duration - 0.75) {
      box.dataset.x = '1'; nxt.currentTime = 0;
      lvPlay(nxt).then(() => {
        nxt.classList.add('on'); cur.classList.remove('on');
        setTimeout(() => { cur.pause(); delete box.dataset.x; }, 850);
      }).catch(() => {
        // The second copy could not start: just loop the same one.
        cur.currentTime = 0; lvPlay(cur).catch(() => {}).finally(() => delete box.dataset.x);
      });
    }
  });
}, 120);
// iPhone in Low Power Mode blocks videos that start by themselves: the first touch starts them.
['touchstart', 'pointerdown', 'visibilitychange'].forEach((ev) => document.addEventListener(ev, () => {
  if (document.hidden) return;
  app.querySelectorAll('.loopbox video.on').forEach((v) => { if (v.paused) lvPlay(v).then(() => v.closest('.loopbox')?.classList.add('live')).catch(() => {}); });
}, { passive: true }));
let lastPoll = 0;
setInterval(async () => {
  if (!S.uid || document.hidden || Date.now() - lastPoll < 12000) return;
  const j = (S.jobs || []).find((x) => x.kind === 'avatar' && x.status === 'video' && Date.now() - new Date(x.created_at) > 25000 && Date.now() - new Date(x.created_at) < 3600000);
  if (!j) return; lastPoll = Date.now();
  try { const { data: { session } } = await sb.auth.getSession(); await fetch(SB_URL + '/functions/v1/or-hook', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + (session?.access_token || '') }, body: JSON.stringify({ job: j.id }) }); } catch {}
}, 3000);
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
  // Only friends (and people with a pending request) are visible; chats are with friends only.
  const [{ data: ps }, { data: fr }, { data: bl }] = await Promise.all([sb.from('profiles').select('*'), sb.from('friends').select('*'), sb.from('blocks').select('blocked')]);
  const byId = new Map((ps || []).map((p) => [p.id, p])); S.people = byId;
  S.members.clear(); S.reqIn = []; S.reqOut = new Set(); S.blocked = (bl || []).map((x) => x.blocked);
  if (byId.has(S.uid)) S.me = byId.get(S.uid);
  (fr || []).forEach((f) => {
    const o = f.a === S.uid ? f.b : f.a, p = byId.get(o);
    if (f.status === 'accepted') { if (p?.name) S.members.set(o, p); }
    else if (f.requested_by === S.uid) S.reqOut.add(o);
    else if (p?.name) S.reqIn.push(p);
  });
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
async function startAI(kind, path, prompt, extra) {
  const { data: { session } } = await sb.auth.getSession(); if (!session) return null;
  try {
    const r = await fetch(SB_URL + '/functions/v1/animate', { method: 'POST', headers: { 'content-type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ kind, path, prompt, ...(extra || {}) }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) { toast(j.error === 'daily_limit' ? 'You have used today’s AI limit. Try again tomorrow.' : 'AI is not available right now. Try again later.', 4000); return null; }
    await loadJobs(); refresh(); return j.job;
  } catch { toast('AI is not available right now. Check your connection.', 4000); return null; }
}
function swapBg(p) { const el = app.querySelector(`[data-bgfor="${p.id}"]`); if (!el) return; const t = document.createElement('div'); t.innerHTML = bgMedia(p); el.replaceWith(t.firstElementChild); }
function previewOf(m) {
  if (m.body) return m.body;
  if (m.sticker === 'x|poke') return T('👉 Poke!');
  if (m.sticker) return T('Sticker');
  if (m.media_kind === 'circle') return T('⭕ Video message');
  if (m.media_path) return T(m.media_fx === 'once' ? '🔥 View-once photo' : m.media_kind === 'video' ? '🎬 Video' : '📷 Photo');
  return T('Voice message');
}
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
        S.thread = S.thread.filter((x) => !(x.tmp && x.sender === m.sender && (x.sticker ? x.sticker === m.sticker : x.media_path ? x.media_path === m.media_path : x.body ? (x.body === m.body || x.orig === m.orig_body) : !!m.audio_path))); S.thread.push(m);
      }
      if (m.sender !== S.uid) { setTimeout(() => onIncoming(m), 60); chime(route().name === 'chat' && route().id === m.sender); }
      if (m.sender !== S.uid) {
        S.typing.delete(o);
        if (route().name === 'chat' && route().id === o && document.visibilityState === 'visible') { sb.rpc('mark_read', { p_other: o }).then(() => {}); }
        else { S.unread.set(o, (S.unread.get(o) || 0) + 1); if (route().name !== 'chat') toast(`${nameOf(o)}: ${previewOf(m).slice(0, 60)}`); }
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
      if (p.id === S.uid) S.me = p; else if (p.name && S.members.has(p.id)) S.members.set(p.id, p);
      if (old && (old.photo_path !== p.photo_path || old.video_path !== p.video_path || old.still_path !== p.still_path)) swapBg(p);
      refresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_jobs' }, ({ new: j }) => {
      if (!j?.id) return; const i = S.jobs.findIndex((x) => x.id === j.id); if (i >= 0) S.jobs[i] = { ...S.jobs[i], ...j }; else S.jobs.unshift(j);
      if (j.status === 'done' && j.kind === 'avatar') toast(`${aiName()}: your photo is alive now`);
      if (j.status === 'done' && j.kind === 'post_edit') { if (j.scene === 'story') { toast('Your story is live for 24 hours'); loadStories().then(refresh); } else toast(`${aiName()} added a new photo to your gallery`); }
      if (j.status === 'done' && j.kind === 'video_edit') { toast(`${aiName()} added your new video to the gallery`); loadPosts(S.uid).then(refresh); }
      if (j.status === 'error' && ['avatar', 'post_edit', 'video_edit'].includes(j.kind)) toast(`${aiName()} could not finish this one. Try another photo or description.`, 4500);
      refresh();
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, (pl) => {
      const x = pl.eventType === 'DELETE' ? pl.old : pl.new; if (!x?.message_id) return; const k = String(x.message_id);
      if (!S.rx.has(k)) S.rx.set(k, new Map());
      if (pl.eventType === 'DELETE') S.rx.get(k).delete(x.user_id); else S.rx.get(k).set(x.user_id, x.emoji);
      refresh();
      if (pl.eventType !== 'DELETE' && x.user_id !== S.uid && route().name === 'chat') setTimeout(() => burst(x.emoji, app.querySelector(`.b[data-msg="${k}"]`)), 30);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, (pl) => {
      const f = pl.new && pl.new.a ? pl.new : null;
      loadAll().then(() => {
        if (f && f.status === 'pending' && f.requested_by !== S.uid) { const p = S.reqIn.find((x) => x.id === f.requested_by); if (p) { toast(`${p.name} wants to be your friend`, 4000); chime(); } }
        if (f && f.status === 'accepted' && pl.eventType === 'UPDATE' && f.requested_by === S.uid) { const o = f.a === S.uid ? f.b : f.a; const p = S.members.get(o); if (p) toast(`${p.name} accepted your friend request`, 4000); }
        const rn = route().name; if (rn === 'add') V.add.update(); else if (rn === 'chats' || (rn === 'u' && !S.members.has(route().id)) || (rn === 'chat' && !S.members.has(route().id))) show(); else refresh();
      });
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stories' }, () => { loadStories().then(() => { if (route().name === 'chats') V.chats.update(); }); })
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
  sb.rpc('touch').then(() => {}); setInterval(() => document.visibilityState === 'visible' && sb.rpc('touch').then(() => {}), 60_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { S.pres?.track({ at: Date.now() }); sb.rpc('touch'); loadAll().then(refresh); if (route().name === 'chat') loadThread(route().id).then(refresh); }
    else { sb.rpc('touch').then(() => {}); S.pres?.untrack(); }
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

const ONBOARD = ['lang', 'welcome', 'signin', 'code'];
const langChosen = () => !!store.get('magaam-ui-chosen');
async function show() {
  let { name, id } = route();
  // A friend's "add me" link opened before signing in: remember it for after sign-in.
  if (!S.uid && name === 'add' && id) store.set('magaam-addfriend', id);
  if (!S.uid && !ONBOARD.includes(name)) { name = 'welcome'; history.replaceState(null, '', '#/welcome'); }
  // The very first screen: choose the language of the app.
  if (!S.uid && !langChosen() && name !== 'lang') { name = 'lang'; history.replaceState(null, '', '#/lang'); }
  if (S.uid) {
    if (ONBOARD.includes(name) || !name) name = 'me';
    const hasPhoto = !!(S.me?.orig_path || S.me?.photo_path);
    if ((!S.me?.name || !S.me?.username) && name !== 'about') name = 'about';
    else if (S.me?.name && !S.me?.ai_name && !['about', 'assistant'].includes(name)) name = 'assistant';
    else if (S.me?.name && S.me?.ai_name && !hasPhoto && !['about', 'assistant', 'look'].includes(name)) name = 'look';
    const pend = store.get('magaam-addfriend');
    if (pend && name === 'me' && S.me?.username && S.me?.ai_name && hasPhoto) { store.set('magaam-addfriend', ''); name = 'add'; id = pend; }
    if (location.hash.replace(/^#\/?/, '').split('/')[0] !== name) history.replaceState(null, '', '#/' + name + (id && ['chat','u','gallery','add','p'].includes(name) ? '/' + id : ''));
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
  const t = [['spark', 'Assistant', 'soon'], ['chat', 'Chats', 'chats'], ['video', 'Video', 'video'], ['bag', 'Shop', 'soon'], ['me', 'Me', 'me']];
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

const LANG_HELLO = { en: 'Hello', ru: 'Привет', ar: 'مرحبًا', tr: 'Merhaba' };
V.lang = () => `<div class="light splash langpick">
  <img class="mark sm" src="img/symbol.png" alt="MAGAAM">
  <div class="word">MAGAAM</div>
  <h1 class="lp-title" data-notr><span>Choose your language</span><span>Выберите язык</span><span dir="rtl">اختر لغتك</span><span>Dilini seç</span></h1>
  <div class="lp-list">${I18N.LANGS.map(([code, label]) => `<button class="lp-btn" data-pick="${code}" aria-pressed="${code === I18N.lang}" ${code === 'ar' ? 'dir="rtl"' : ''}><b data-notr>${esc(label)}</b><span data-notr>${esc(LANG_HELLO[code] || '')}</span></button>`).join('')}</div>
</div>`;
V.lang.after = () => app.querySelectorAll('[data-pick]').forEach((b) => (b.onclick = () => {
  I18N.set(b.dataset.pick); store.set('magaam-ui-chosen', '1'); TR.clear?.(); go('welcome', true);
}));
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
    <label class="fl" for="un">Username<span class="unwrap"><span class="at" data-notr>@</span><input class="field" id="un" maxlength="20" autocapitalize="none" autocorrect="off" spellcheck="false" value="${esc(S.me?.username || '')}" placeholder="yourname"></span></label>
    <p class="fine" style="margin-top:-4px">Friends find you by this name. Letters a–z, numbers, dot and _.</p>
    <div class="fl"><span>Profile</span><div class="seg" id="pv" role="radiogroup"><button type="button" role="radio" data-pv="0" aria-checked="${!S.me?.is_public}">${ic('lock', 2)}Closed</button><button type="button" role="radio" data-pv="1" aria-checked="${!!S.me?.is_public}">${ic('globe', 2)}Open</button></div></div>
    <p class="fine" style="margin-top:-4px" id="pvh">${S.me?.is_public ? 'Everyone sees your gallery and stories.' : 'Only friends see your gallery and stories.'}</p>
    <label class="fl" for="bd">Date of birth<input class="field" id="bd" type="date" value="${esc(S.priv?.birthdate || '')}" max="${new Date().toISOString().slice(0, 10)}"></label>
    <p class="fine" style="margin-top:2px">Your age keeps the right protections on for you. Only you see it.</p>
    <p class="err" id="err"></p>
  </form>
  <div class="grow"></div>
  <button class="btn" id="go">Next</button></div>`;
const TRL = { а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ы:'y',э:'e',ю:'yu',я:'ya',ı:'i',ş:'s',ğ:'g',ç:'c',ö:'o',ü:'u' };
const cleanUser = (v) => String(v || '').toLowerCase().replace(/^@+/, '').split('').map((c) => TRL[c] ?? c).join('').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').replace(/[^a-z0-9_.]/g, '').slice(0, 20);
V.about.after = () => {
  const nm = $('#nm'), un = $('#un'); let touched = !!S.me?.username;
  const suggest = () => { if (!touched) { const b = cleanUser(nm.value); un.value = b.length >= 3 ? b : b ? b + Math.floor(100 + Math.random() * 900) : ''; } };
  nm.addEventListener('input', suggest); suggest();
  let pub = !!S.me?.is_public;
  app.querySelectorAll('[data-pv]').forEach((b) => (b.onclick = () => { pub = b.dataset.pv === '1'; app.querySelectorAll('[data-pv]').forEach((x) => x.setAttribute('aria-checked', String(x === b))); $('#pvh').textContent = T(pub ? 'Everyone sees your gallery and stories.' : 'Only friends see your gallery and stories.'); }));
  un.addEventListener('input', () => { touched = true; const c = cleanUser(un.value); if (c !== un.value) un.value = c; });
  $('#go').onclick = async () => {
    const name = nm.value.trim(), bd = $('#bd').value, username = cleanUser(un.value);
    if (!name) { $('#err').textContent = 'Enter your name.'; return; }
    if (username.length < 3) { $('#err').textContent = 'The username needs at least 3 letters or numbers.'; return; }
    if (!bd) { $('#err').textContent = 'Choose your date of birth.'; return; }
    $('#go').disabled = true;
    const [a, b] = await Promise.all([sb.from('profiles').update({ name, username, is_public: pub }).eq('id', S.uid).select().single(), sb.from('profiles_private').update({ birthdate: bd }).eq('id', S.uid)]);
    if (a.error?.code === '23505') { $('#err').textContent = 'This username is taken. Try another one.'; $('#go').disabled = false; return; }
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
// When was the last living photo made? Free once a week; earlier it costs coins.
let weekInfo = null;
async function loadWeek() {
  const { data } = await sb.from('ai_jobs').select('created_at').eq('user_id', S.uid).eq('kind', 'avatar').in('status', ['video', 'queued', 'done']).gte('created_at', new Date(Date.now() - 7 * 86400_000).toISOString()).order('created_at', { ascending: false }).limit(1);
  weekInfo = data?.[0] ? { next: new Date(new Date(data[0].created_at).getTime() + 7 * 86400_000).toISOString() } : { next: null };
}
// A gentle change used when someone wants to keep the photo as it is: same scene, just a cinematic AI frame.
const KEEP_AS_IS = 'Keep everything as it is: the same place, pose, outfit, framing and background. Only turn it into a cinematic, high-quality frame with beautiful light.';
let lookEdit = false, lookWish = '', checkedAI = {};
V.look = () => {
  loadVars();
  if (!weekInfo) loadWeek().then(() => { if (route().name === 'look' && weekInfo.next) show(); });
  const editing = !!(S.me?.orig_path || S.me?.photo_path);
  const orig = pendingPhoto ? pendingPhoto.preview : (S.me?.orig_path ? url(S.me.orig_path) : S.me?.photo_path ? url(S.me.photo_path) : '');
  const vars = pendingPhoto ? [] : (lookVars || []);
  const showVar = vars.length > 0 && lookPick >= 0 && lookPick < vars.length;
  const src = showVar ? url(vars[lookPick]) : orig;
  const busy = lookBusy || ['checking', 'ai'].includes(lookCheck);
  const status = lookCheck === 'checking' ? `${esc(aiName())} is checking your photo…`
    : lookCheck === 'ai' ? `This photo is already made with AI. ${esc(aiName())} is bringing it to life…`
    : lookBusy ? `${esc(aiName())} is making your photo… about 20 seconds` : '';
  let actions = '';
  if (lookCheck === 'later') actions = `<div class="askbox">${aiMsg(`AI is not available right now, so I saved your photo for now. Others see it blurred until I change it and bring it to life. Come back later: Settings → Change profile photo.`)}</div><button class="btn" data-go="me">${ic('check')}Continue to MAGAAM</button>`;
  else if (busy) actions = '';
  else if (!orig) actions = `<button class="btn" data-act="pick">${ic('image')}Upload photo</button><button class="btn out" data-act="snap" style="margin-top:10px">${ic('camera')}Take a photo</button>`;
  else if (showVar) actions = `<button class="btn" id="livevar">${ic('spark')}Bring to life</button>
    <div class="duo" style="margin-top:10px"><button class="btn out" id="nextvar">${ic('swap')}Another variant</button><button class="btn out" id="backorig">${ic('image')}My photo</button></div>`;
  else actions = `<button class="btn" id="liveorig">${ic('spark')}Bring to life</button>
    <div class="duo" style="margin-top:10px"><button class="btn out" id="editb" aria-pressed="${lookEdit}">${ic('edit')}Change with AI</button><button class="btn out" data-act="pick">${ic('image')}Another photo</button></div>
    ${lookEdit ? `<div class="editbox"><textarea class="field ta" id="wish" maxlength="400" placeholder="What to change? For example: me in Paris at night">${esc(lookWish)}</textarea>
      <div class="ideas">${IDEAS_AVATAR.slice(1, 4).map((t) => `<button class="idea" data-idea="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div class="duo"><button class="btn" id="go">${ic('spark')}Create</button><button class="btn soft" id="aidec">${ic('spark')}Let ${esc(aiName())} decide</button></div></div>` : ''}`;
  return `<div class="light look2">
  <div class="topbar">${editing ? `<button class="iconbtn" data-back="me" aria-label="Back">${ic('back')}</button><span class="word">MAGAAM</span>` : `<span style="width:44px"></span>${progress(3)}`}<span style="width:44px"></span></div>
  <h1 class="l2title">Living photo</h1>
  ${weekInfo?.next ? `<div class="weeknote">${ic('coin')}<span>Free once a week. Next free change: ${esc(dayName(weekInfo.next))}. Earlier: 150 coins.</span></div>` : ''}
  <div class="photo-slot big ${busy ? 'busy' : ''}">${src ? `<img src="${esc(src)}" alt="Your photo">` : `<div class="ph">${ic('camera')}Add your photo</div>`}${busy ? '<span class="spinner"></span>' : ''}</div>
  ${status ? `<p class="l2status">${status}</p>` : ''}
  ${showVar && !busy ? `<p class="l2note">Not this one? Tap “Another variant”.</p>` : ''}
  <p class="err" id="err">${esc(lookErr)}</p>
  <div class="grow"></div>
  <div class="l2actions">${actions}</div></div>`;
};
V.look.after = () => {
  const keepWish = () => { const w = $('#wish'); if (w) lookWish = w.value; };
  const fail = (e) => { lookBusy = false; if (lookCheck !== 'later') lookCheck = ''; const m = String(e?.message || e || ''); lookErr = T(/fetch|network/i.test(m) ? aiError('network') : m.startsWith('This photo') ? m : aiError(m)); if (route().name === 'look') show(); };
  const bringToLife = async (path) => {
    lookErr = ''; const r = await runPaid({ kind: 'avatar', path }); weekInfo = null;
    if (!r) { lookCheck = ''; if (route().name === 'look') show(); return false; }
    lookVars = []; lookPick = -1; saveVars(); lookWish = ''; lookEdit = false; lookCheck = '';
    go('me'); toast(`${aiName()} is bringing your photo to life. About 2 minutes.`, 4500); return true;
  };
  // Make one new look of the photo (the AI makes a few at once; they are shown one by one).
  const makeOne = async (wish) => {
    lookErr = ''; lookBusy = true; show();
    try { const v = await makeVariants(S.me.orig_path || S.me.photo_path, wish); lookVars = v; lookPick = 0; saveVars(); }
    catch (e) { return fail(e); }
    lookBusy = false; if (route().name === 'look') show();
  };
  const choose = async (cap) => {
    const f = await pickFile(cap); if (!f) return; keepWish();
    pendingPhoto = { file: f, preview: URL.createObjectURL(f) }; lookVars = []; lookPick = -1; saveVars(); lookCheck = 'checking'; lookErr = ''; show();
    try {
      // Upload, then check the photo: one person, a face, and whether it is already made with AI.
      const [hints, path] = await Promise.all([fileHints(f), uploadPhoto(f, 'avatar')]);
      const r = await anim({ kind: 'check', path, hints });
      if (!r.ok && (r.status === 0 || r.status >= 500)) {
        const upd = { orig_path: path }; if (!S.me?.photo_path) upd.photo_path = path;
        const { data } = await sb.from('profiles').update(upd).eq('id', S.uid).select().single(); if (data) S.me = data;
        pendingPhoto = null; lookCheck = 'later'; if (route().name === 'look') show(); return;
      }
      if (!r.ok) { sb.storage.from('media').remove([path, path.replace(/\.jpg$/, '-t.jpg')]); throw new Error(r.error || 'ai'); }
      if (!r.pass) { sb.storage.from('media').remove([path, path.replace(/\.jpg$/, '-t.jpg')]); throw new Error(r.problem === 'group' ? 'group' : 'no_face'); }
      const upd = { orig_path: path }; if (!S.me?.photo_path) upd.photo_path = path;
      const { data, error } = await sb.from('profiles').update(upd).eq('id', S.uid).select().single(); if (error) throw error;
      S.me = data; pendingPhoto = null; checkedAI[path] = !!r.ai;
      if (r.ai) { lookCheck = 'ai'; show(); await bringToLife(path); return; }
      lookCheck = '';
    } catch (e) { pendingPhoto = null; return fail(e); }
    if (route().name === 'look') show();
  };
  app.querySelectorAll('[data-act="pick"]').forEach((b) => (b.onclick = () => choose(false)));
  app.querySelectorAll('[data-act="snap"]').forEach((b) => (b.onclick = () => choose(true)));
  // One button: an AI photo comes alive right away; a regular one first gets a gentle AI touch.
  const lo = $('#liveorig'); if (lo) lo.onclick = async () => {
    const path = S.me.orig_path || S.me.photo_path; lookErr = '';
    let ai = checkedAI[path];
    if (ai === undefined) {
      lookCheck = 'checking'; show();
      const r = await anim({ kind: 'check', path, hints: [] });
      if (!r.ok) return fail(r.error || 'ai');
      if (!r.pass) return fail(r.problem === 'group' ? 'group' : 'no_face');
      ai = checkedAI[path] = !!r.ai;
    }
    if (ai) { lookCheck = 'ai'; show(); return bringToLife(path); }
    lookCheck = ''; makeOne(KEEP_AS_IS);
  };
  const lv = $('#livevar'); if (lv) lv.onclick = () => { lookCheck = 'ai'; show(); bringToLife(lookVars[lookPick]); };
  const nv = $('#nextvar'); if (nv) nv.onclick = () => { if (lookPick + 1 < lookVars.length) { lookPick++; show(); } else makeOne(lookWish.trim().length >= 3 ? lookWish.trim() : KEEP_AS_IS); };
  const bo = $('#backorig'); if (bo) bo.onclick = () => { lookPick = -1; show(); };
  const eb = $('#editb'); if (eb) eb.onclick = () => { lookEdit = !lookEdit; show(); if (lookEdit) setTimeout(() => $('#wish')?.focus(), 50); };
  const w = $('#wish');
  if (w) { w.addEventListener('input', keepWish); app.querySelectorAll('[data-idea]').forEach((b) => (b.onclick = () => { w.value = b.dataset.idea; keepWish(); })); }
  // "Keep it as it is, just bring it to life" means exactly that: no new look.
  const KEEP_RE = /(как\s*есть|не\s*меня|ничего\s*не\s*меня|только\s*ожив|просто\s*ожив|as\s*it\s*is|keep\s*it|don'?t\s*change|just\s*(animate|bring)|olduğu\s*gibi|değiştirme|كما\s*هي|لا\s*تغير)/i;
  const g = $('#go'); if (g) g.onclick = () => { keepWish(); const t = lookWish.trim(); if (t.length < 3) return w?.focus(); if (KEEP_RE.test(t)) { lookEdit = false; lookWish = ''; return $('#liveorig')?.click(); } makeOne(t); };
  const ad = $('#aidec'); if (ad) ad.onclick = () => { lookWish = ''; makeOne(AI_DECIDES); };
};

/* Own page */
V.me = () => {
  const m = S.me; const posts = S.posts.get(S.uid);
  if (!posts) loadPosts(S.uid).then(() => route().name === 'me' && V.me.update());
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(m)}
  <div class="shade"></div>
  <div class="hdr"><div class="leftname"><b data-notr>${esc(m.name)}</b><span class="pill glass aipill">${ic('spark').replace('<svg', '<svg style="width:15px;height:15px"')}${esc(aiName())}</span></div><div class="hright"><button class="pill glass coinpill" data-go="wallet" aria-label="Balance">${ic('coin')}<span data-notr id="coins">${S.coins}</span></button><button class="iconbtn" data-act="settings" aria-label="Settings">${ic('gear')}</button></div></div>
  <div class="digest" id="digest" hidden></div>
  <div class="dock">
    ${installBanner()}
    <div class="card glass"><div class="ailine" id="ailine" hidden></div><button class="photos-btn" data-go="gallery/${S.uid}"><span class="pt" id="pthumbs"></span><span class="pl"><b>My photos</b><span id="pcount">Open your gallery</span></span><span class="chev">${ic('back')}</span></button>
      <div class="chips two"><button class="chip" data-go="look">${ic('spark')}<span class="cl">Profile photo</span></button><button class="chip" data-act="addpost">${ic('plus')}<span class="cl">Add to gallery</span></button></div></div>
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
    else if (!S.me.video_path) { al.hidden = false; al.innerHTML = `<span>${ic('spark')}</span><span><b>Your photo is not alive yet</b><button data-act="retryai">Change profile photo</button></span>`; }
    else al.hidden = true;
  }
  const t = $('#tabs'); if (t) t.innerHTML = tabbar('me');
  showDigest();
};
V.me.after = () => V.me.update();
// "While you were away": your own assistant tells you who wrote and what about.
let digestBusy = false;
async function showDigest() {
  const el = $('#digest'); if (!el) return;
  if (!totalUnread()) { el.hidden = true; return; }
  const key = [...S.unread.entries()].filter(([, c]) => c).map(([k, c]) => k + ':' + c).sort().join(',') + '|' + I18N.lang;
  if (store.get('magaam-digest-x') === key) { el.hidden = true; return; }
  let cached = null; try { cached = JSON.parse(store.get('magaam-digest') || 'null'); } catch {}
  const shell = (body) => `<div class="dg glass"><span class="aiorb">${ic('spark')}</span><div class="dgt"><b data-notr>${esc(aiName())}</b>${body}</div><button class="iconbtn dgx" data-dgx aria-label="Close">${ic('x')}</button></div>`;
  const paint = (d) => {
    el.hidden = false;
    el.innerHTML = shell(`<p data-notr>${esc(d.text)}</p><div class="dgp">${(d.people || []).filter((p) => S.members.has(p.id)).map((p) => `<button class="dgc" data-go="chat/${p.id}">${thumbHTML(S.members.get(p.id))}<span data-notr>${esc(p.name)}</span>${S.unread.get(p.id) ? `<b class="badge">${S.unread.get(p.id)}</b>` : ''}</button>`).join('')}</div>`);
    el.querySelector('[data-dgx]').onclick = () => { store.set('magaam-digest-x', key); el.hidden = true; };
  };
  if (cached?.key === key) return paint(cached);
  if (digestBusy) return; digestBusy = true;
  el.hidden = false; el.innerHTML = shell(`<p><span class="spinner xs"></span> ${esc(T('Reading your new messages…'))}</p>`);
  el.querySelector('[data-dgx]').onclick = () => { store.set('magaam-digest-x', key); el.hidden = true; };
  try {
    const j = await aiCall({ op: 'digest', lang: I18N.langName });
    if (j.text) { const d = { key, text: j.text, people: j.people }; store.set('magaam-digest', JSON.stringify(d)); if (route().name === 'me') { paint(d); chime(true); } } else el.hidden = true;
  } catch { el.hidden = true; } finally { digestBusy = false; }
}

/* Chats list */
V.chats = () => `<div class="dark" style="position:absolute;inset:0">
  <div class="bg-blur" style="background-image:url('${sceneImg(S.me?.scene)}')"></div>
  <div class="listwrap">
    <div class="ltitle"><h2>Chats</h2><span class="hright"><button class="iconbtn" data-act="search" aria-label="Search">${ic('search')}</button><button class="iconbtn" data-go="add" aria-label="Add friends">${ic('useradd')}${S.reqIn.length ? `<span class="badge dotb">${S.reqIn.length}</span>` : ''}</button></span></div>
    <input class="search glass" id="q" placeholder="Search" hidden aria-label="Search chats">
    <div class="scroll"><div class="strow" id="strow"></div><div id="list"></div></div>
  </div>
  <div class="dock"><div id="tabs">${tabbar('chats')}</div></div></div>`;
V.chats.update = () => {
  const q = ($('#q')?.value || '').trim().toLowerCase();
  const list = [...S.members.values()].filter((p) => !q || (p.name || '').toLowerCase().includes(q))
    .sort((a, b) => (new Date(S.last.get(b.id)?.created_at || 0) - new Date(S.last.get(a.id)?.created_at || 0)) || (a.name || '').localeCompare(b.name || ''));
  const box = $('#list'); if (!box) return;
  const sr = $('#strow'); if (sr) { sr.innerHTML = storiesRowHTML(); sr.hidden = !!q; }
  const reqs = S.reqIn.length && !q ? `<button class="reqbar glass" data-go="add">${ic('useradd')}<span><b>Friend requests</b><span data-notr>${S.reqIn.map((p) => esc(p.name)).slice(0, 3).join(', ')}</span></span><span class="badge">${S.reqIn.length}</span></button>` : '';
  box.innerHTML = reqs + (list.length ? `<div class="rows glass">${list.map((p) => {
    const l = S.last.get(p.id), u = S.unread.get(p.id) || 0, ty = S.typing.has(p.id);
    const prev = ty ? T('typing…') : l ? (l.sender === S.uid ? T('You') + ': ' : '') + previewOf(l) : T('Say hello');
    return `<button class="crow" data-go="chat/${p.id}">${thumbHTML(p)}<span class="cmid"><b data-notr>${esc(p.name)}${S.streaks.get(p.id) ? ` <span class="streak">🔥${S.streaks.get(p.id)}</span>` : ''}</b><span data-notr>${esc(prev)}</span></span><span class="cend">${l ? when(l.created_at) : ''}${u ? `<span class="badge">${u}</span>` : ''}</span></button>`;
  }).join('')}</div>` : `<div class="rows glass"><div class="empty"><b>${q ? 'No one found' : 'No friends yet'}</b><span>${q ? 'Try another name.' : 'Add friends by their @username or send them your link.'}</span>${q ? '' : `<button class="pbtn blue" data-go="add">${ic('useradd')}Add friends</button>`}</div></div>`);
  const t = $('#tabs'); if (t) t.innerHTML = tabbar('chats');
};
V.chats.after = () => {
  V.chats.update();
  loadStories().then(() => route().name === 'chats' && V.chats.update());
  sb.rpc('my_streaks').then(({ data }) => { S.streaks = new Map((data || []).map((x) => [x.other, x.days])); if (route().name === 'chats') V.chats.update(); });
  $('[data-act="search"]').onclick = () => { const q = $('#q'); q.hidden = !q.hidden; if (!q.hidden) q.focus(); else { q.value = ''; V.chats.update(); } };
  $('#q').oninput = V.chats.update;
};


/* Add friends: by @username, by link or QR code; requests in and out */
const myLink = () => location.origin + location.pathname + '#/add/' + (S.me?.username || '');
let qrLoad = null;
function loadQR() { return qrLoad ||= new Promise((res, rej) => { if (window.qrcode) return res(); const sc = document.createElement('script'); sc.src = 'qrcode.js?v=1'; sc.onload = res; sc.onerror = rej; document.head.appendChild(sc); }); }
const mutualTxt = (n) => (n ? ' · ' + T(n === 1 ? '1 mutual friend' : '{n} mutual friends').replace('{n}', n) : '');
const personRow = (p, right) => `<div class="crow"><button class="prow" data-go="p/${p.id}">${thumbHTML(p)}<span class="cmid"><b data-notr>${esc(p.name)}</b><span data-notr>@${esc(p.username || '')}${esc(mutualTxt(p.mutual))}</span></span></button><span class="cend fbtns">${right}</span></div>`;
const relBtn = (id, big) => { const c = big ? 'pbtn' : 'pbtn sm';
  return id === S.uid ? `<span class="tag">This is you</span>`
    : S.members.has(id) ? `<button class="${c} blue" data-go="chat/${id}">${ic('chat')}Message</button>`
    : S.reqOut.has(id) ? `<button class="${c} glass" data-fr="cancel" data-uid="${id}">${big ? ic('check') : ''}Request sent</button>`
    : S.reqIn.some((x) => x.id === id) ? `<button class="${c} blue" data-fr="accept" data-uid="${id}">${ic('check')}Accept</button>`
    : `<button class="${c} blue" data-fr="add" data-uid="${id}">${ic('useradd')}${big ? 'Add friend' : 'Add'}</button>`; };
async function shareLink() {
  const url = myLink();
  if (navigator.share) { try { await navigator.share({ title: 'MAGAAM', text: T('Add me on MAGAAM'), url }); return; } catch (e) { if (e?.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast(url, 6000); }
}
async function friendAct(kind, uid) {
  let r;
  if (kind === 'add') r = await sb.rpc('friend_request', { p_to: uid });
  else if (kind === 'accept') r = await sb.rpc('friend_respond', { p_other: uid, p_accept: true });
  else if (kind === 'decline' || kind === 'cancel') r = await sb.rpc('friend_respond', { p_other: uid, p_accept: false });
  if (r?.error) { toast('Something went wrong. Try again.'); return; }
  const out = r?.data;
  if (out === 'blocked') toast('You cannot add this person.');
  else if (out === 'limit') toast('Too many requests today. Try again tomorrow.');
  else if (kind === 'add' && out === 'sent') toast('Friend request sent');
  else if (out === 'friends') toast('You are friends now');
  await loadAll(); if (route().name === 'add') V.add.update(); else if (route().name === 'p') show(); else refresh();
}
let addList = null, addMsg = '';
V.add = (id) => {
  addList = null; addMsg = '';
  return `<div class="dark" style="position:absolute;inset:0">
  <div class="bg-blur" style="background-image:url('${sceneImg(S.me?.scene)}')"></div>
  <div class="listwrap">
    <div class="ltitle"><span class="hright"><button class="iconbtn" data-back="chats" aria-label="Back">${ic('back')}</button><h2>Add friends</h2></span></div>
    <div class="scroll"><div class="addwrap">
      <form class="findrow" id="ff"><span class="unwrap dark srch"><span class="at">${ic('search', 2)}</span><input class="search glass" id="fu" maxlength="40" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="Name or @username" aria-label="Name or @username" value="${esc(id && id !== S.me?.username ? id : '')}"></span></form>
      <div id="found"></div>
      <div id="reqs"></div>
      <div class="mycard glass"><div class="qr" id="qr" aria-label="My QR code"></div><b data-notr>@${esc(S.me?.username || '')}</b><span>Friends scan this code with the camera or open your link to add you.</span>
        <div class="chips two"><button class="chip" data-act="sharelink">${ic('share')}Share my link</button><button class="chip" data-act="copylink">${ic('copy')}Copy link</button></div></div>
      <div id="sent"></div>
    </div></div>
  </div>
  <div class="dock"><div id="tabs">${tabbar('chats')}</div></div></div>`;
};
V.add.update = () => {
  const f = $('#found');
  if (f) {
    if (addMsg) f.innerHTML = `<div class="rows glass"><div class="empty sm"><span>${esc(addMsg)}</span></div></div>`;
    else if (addList) f.innerHTML = `<div class="rows glass">${addList.map((p) => personRow(p, relBtn(p.id))).join('')}</div>`;
    else f.innerHTML = '';
  }
  const r = $('#reqs');
  if (r) r.innerHTML = S.reqIn.length ? `<h3 class="sech">Friend requests</h3><div class="rows glass">${S.reqIn.map((p) => personRow(p, `<button class="pbtn blue sm" data-fr="accept" data-uid="${p.id}">${ic('check')}Accept</button><button class="iconbtn sm" data-fr="decline" data-uid="${p.id}" aria-label="Decline">${ic('x')}</button>`)).join('')}</div>` : '';
  const sn = $('#sent');
  if (sn) sn.innerHTML = S.reqOut.size ? `<h3 class="sech">Waiting for an answer</h3><div class="rows glass">${[...S.reqOut].map((id) => { const p = S.people?.get(id) || { id, name: '…' }; return personRow(p, `<button class="pbtn glass sm" data-fr="cancel" data-uid="${id}">Cancel</button>`); }).join('')}</div>` : '';
  const t = $('#tabs'); if (t) t.innerHTML = tabbar('chats');
};
V.add.after = (id) => {
  V.add.update();
  const fu = $('#fu');
  let seq = 0, tmr = 0;
  const find = async (fromLink) => {
    const q = fu.value.trim().replace(/^@+/, '');
    if (q.length < 2) { addList = null; addMsg = ''; V.add.update(); return; }
    const my = ++seq;
    // Also search the Latin spelling: "Амина" finds "Amina".
    const lat = cleanUser(q), qs = [q, ...(lat.length >= 2 && lat !== q.toLowerCase() ? [lat] : [])];
    const res = await Promise.all(qs.map((x) => sb.rpc('search_users', { p_q: x })));
    if (my !== seq) return;
    const seen = new Set(); addList = res.flatMap((r) => r.data || []).filter((p) => !seen.has(p.id) && seen.add(p.id)).map((p) => ({ ...p, still_path: p.photo }));
    addList.forEach((p) => S.extra.set(p.id, { ...(S.extra.get(p.id) || {}), ...p }));
    addMsg = addList.length ? '' : T('No one found for “{q}”.').replace('{q}', q);
    // An "add me" link opens that person's page right away.
    if (fromLink === true) { const hit = addList.find((p) => p.username === cleanUser(q)); if (hit) return go('p/' + hit.id, true); }
    V.add.update();
  };
  fu.addEventListener('input', () => { clearTimeout(tmr); tmr = setTimeout(find, 280); });
  $('#ff').onsubmit = (e) => { e.preventDefault(); fu.blur(); find(); };
  app.querySelector('.addwrap').addEventListener('click', (e) => { const b = e.target.closest('[data-fr]'); if (b) { b.disabled = true; friendAct(b.dataset.fr, b.dataset.uid); } });
  if (fu.value) find(true);
  loadQR().then(() => {
    const q = qrcode(0, 'M'); q.addData(myLink()); q.make();
    const box = $('#qr'); if (box) box.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
  }).catch(() => { const box = $('#qr'); if (box) box.hidden = true; });
};
async function reportUser(id) {
  const reasons = ['Bullying or threats', 'Inappropriate photos or messages', 'Spam or scam', 'Pretending to be someone else', 'Something else'];
  const k = await dialog(`<h3 class="dh">Report ${esc(nameOf(id))}</h3><p class="dp">Tell us what happened. ${esc(nameOf(id))} will not know who reported.</p>`, [...reasons.map((r, i) => ({ k: String(i), label: r, style: 'out' })), { k: 'x', label: 'Cancel', style: 'soft' }]);
  if (k === null || k === 'x') return;
  const { error } = await sb.from('reports').insert({ reporter: S.uid, target: id, reason: reasons[+k] });
  if (error) { toast('Could not send. Try again.'); return; }
  const b = await dialog(`<h3 class="dh">Thank you</h3><p class="dp">We will look at it. Do you also want to block ${esc(nameOf(id))}?</p>`, [{ k: 'b', label: 'Block', style: 'red' }, { k: 'n', label: 'Not now', style: 'out' }]);
  if (b === 'b') await blockUser(id, true);
}
async function blockUser(id, sure) {
  if (!sure) {
    const k = await dialog(`<h3 class="dh">Block ${esc(nameOf(id))}?</h3><p class="dp">You will no longer be friends. ${esc(nameOf(id))} cannot write to you, find you or add you again. You can unblock later in Settings.</p>`, [{ k: 'b', label: 'Block', style: 'red' }, { k: 'n', label: 'Cancel', style: 'out' }]);
    if (k !== 'b') return;
  }
  const { error } = await sb.rpc('block_user', { p_other: id });
  if (error) { toast('Something went wrong. Try again.'); return; }
  toast('Blocked'); await loadAll(); go('chats', true);
}
async function removeFriend(id) {
  const k = await dialog(`<h3 class="dh">Remove ${esc(nameOf(id))} from friends?</h3><p class="dp">You will not be able to write to each other until one of you adds the other again.</p>`, [{ k: 'r', label: 'Remove', style: 'red' }, { k: 'n', label: 'Cancel', style: 'out' }]);
  if (k !== 'r') return;
  await sb.rpc('friend_remove', { p_other: id }); await loadAll(); go('chats', true);
}
async function blockedList() {
  if (!S.blocked.length) { toast('You have not blocked anyone'); return; }
  const { data } = await sb.rpc('blocked_people');
  sheet('Blocked people', (data || []).map((p) => ({ icon: 'block', label: `${p.name} — unblock`, notr: false, run: async () => { await sb.rpc('unblock_user', { p_other: p.id }); await loadAll(); toast('Unblocked'); } })));
}

/* ---------- message sound: a soft glass bell ---------- */
let AC = null;
const soundOn = () => store.get('magaam-sound') !== 'off';
function unlockAudio() { try { AC ||= new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch {} }
['touchstart', 'pointerdown', 'keydown'].forEach((ev) => document.addEventListener(ev, unlockAudio, { passive: true }));
function chime(soft, force) {
  if ((!soundOn() && !force) || !AC || document.hidden) return;
  try {
    if (AC.state === 'suspended') AC.resume();
    const t = AC.currentTime + 0.03, out = AC.createGain(); out.gain.value = soft ? 0.09 : 0.15;
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4800; out.connect(lp); lp.connect(AC.destination);
    // a quiet echo makes it feel airy
    const dl = AC.createDelay(); dl.delayTime.value = 0.17; const fb = AC.createGain(); fb.gain.value = 0.2;
    lp.connect(dl); dl.connect(fb); fb.connect(dl); fb.connect(AC.destination);
    const note = (f, at, len, vol) => [[1, 1], [2.0, 0.16], [3.99, 0.04]].forEach(([m, a]) => {
      const o = AC.createOscillator(), g = AC.createGain(); o.type = 'sine'; o.frequency.value = f * m;
      g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(vol * a, at + 0.014); g.gain.exponentialRampToValueAtTime(0.0001, at + len / Math.sqrt(m));
      o.connect(g); g.connect(out); o.start(at); o.stop(at + len + 0.1);
    });
    note(783.99, t, 1.0, 0.9);                  // G5
    if (!soft) note(1174.66, t + 0.12, 1.2, 0.65); // D6, a gentle rising fifth
  } catch {}
}

/* ---------- stories: 24 hours, for friends ---------- */
S.stories = new Map(); S.seenSt = new Set();
async function loadStories() {
  const [{ data: st }, { data: sv }] = await Promise.all([
    sb.from('stories').select('*').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: true }),
    sb.from('story_views').select('story_id').eq('viewer', S.uid)]);
  S.stories = new Map();
  (st || []).forEach((s) => { if (s.user_id !== S.uid && !S.members.has(s.user_id)) return; if (!S.stories.has(s.user_id)) S.stories.set(s.user_id, []); S.stories.get(s.user_id).push(s); });
  S.seenSt = new Set((sv || []).map((x) => x.story_id));
}
const unseenSt = (u) => (S.stories.get(u) || []).some((s) => !S.seenSt.has(s.id));
const lastSt = (u) => { const a = S.stories.get(u) || []; return a.length ? new Date(a[a.length - 1].created_at).getTime() : 0; };
const storyUsers = () => [...S.stories.keys()].filter((u) => u !== S.uid).sort((a, b) => (unseenSt(b) - unseenSt(a)) || (lastSt(b) - lastSt(a)));
function storiesRowHTML() {
  const mine = S.stories.get(S.uid) || [];
  const me = `<div class="stit"><button class="ring ${mine.length ? 'mine' : 'none'}" data-act="${mine.length ? 'story' : 'addstory'}" data-uid="${S.uid}" aria-label="Your story">${thumbHTML(S.me)}</button><button class="stplus" data-act="addstory" aria-label="Add to your story">${ic('plus', 2.6)}</button><span class="stn">Your story</span></div>`;
  return me + storyUsers().map((u) => { const p = S.members.get(u); return `<div class="stit"><button class="ring ${unseenSt(u) ? 'on' : 'seen'}" data-act="story" data-uid="${u}" aria-label="${esc(p?.name || '')}">${thumbHTML(p)}</button><span class="stn" data-notr>${esc(p?.name || '')}</span></div>`; }).join('');
}
async function addStory() {
  const k = await choose('Add to your story', [{ k: 'photo', icon: 'spark', label: 'Photo, changed with AI' }, { k: 'gallery', icon: 'grid', label: 'From my photos' }, { k: 'video', icon: 'video', label: 'Video' }]);
  if (k === 'photo') {
    const f = await pickFile(false); if (!f) return;
    toast('Uploading…', 30000);
    let path; try { path = await uploadPhoto(f, 'src'); } catch (e) { toast(e.message || 'Upload failed. Try again.'); return; }
    $('#toast').hidden = true;
    const ideasP = aiCall({ op: 'ideas', path, lang: I18N.langName }).then((j) => j.ideas || []);
    const wish = await askAI(`Every photo in MAGAAM is made with AI. How should I change it for your story?`, IDEAS_POST, 'Make my story', ideasP);
    if (!wish) { sb.storage.from('media').remove([path, path.replace(/\.jpg$/, '-t.jpg')]); return; }
    if (await startAI('post_edit', path, wish, { story: true })) toast(`${aiName()} is making your story. About 30 seconds.`, 4000);
    return;
  }
  if (k === 'gallery') {
    const posts = await loadPosts(S.uid);
    if (!posts.length) return toast('Your gallery is empty. Add a photo first.', 3500);
    const pick = await new Promise((res) => {
      const bg = document.createElement('div'); bg.className = 'sheet-bg';
      bg.innerHTML = `<div class="sheet" role="dialog"><div class="grab"></div><h3>From my photos</h3><div class="pickgrid">${posts.slice(0, 30).map((x, i) => `<button data-pi="${i}">${x.video_path ? `<i>${ic('play', 2)}</i>` : ''}<img src="${esc(thumb(x.path))}" alt=""></button>`).join('')}</div></div>`;
      bg.addEventListener('click', (e) => { const b = e.target.closest('[data-pi]'); if (b) { bg.remove(); res(posts[+b.dataset.pi]); } else if (e.target === bg) { bg.remove(); res(null); } });
      app.appendChild(bg);
    });
    if (!pick) return;
    const { error } = await sb.from('stories').insert({ user_id: S.uid, path: pick.path, video_path: pick.video_path || null });
    if (error) return toast('Something went wrong. Try again.');
    await loadStories(); toast('Your story is live for 24 hours'); refresh(); return;
  }
  if (k === 'video') {
    const f = await pickVideo(); if (!f) return;
    if (f.size > 50 * 1024 * 1024) return toast('This video is larger than 50 MB. Use a shorter clip.', 4000);
    toast('Uploading your video…', 120000);
    try {
      const info = await videoInfo(f); if (!info?.poster) throw new Error('This video could not be read. Try an MP4 or MOV video.');
      if (info.dur > 60.5) throw new Error('A story video can be up to 60 seconds long.');
      const ext = /quicktime|mov/i.test(f.type) || /\.mov$/i.test(f.name) ? 'mov' : /webm/.test(f.type) ? 'webm' : 'mp4';
      const vpath = `${S.uid}/story-${Date.now()}.${ext}`;
      const [p] = await Promise.all([uploadPhoto(info.poster, 'sframe'), sb.storage.from('media').upload(vpath, f, { contentType: f.type || 'video/mp4', cacheControl: '31536000' }).then(({ error }) => { if (error) throw error; })]);
      const { error } = await sb.from('stories').insert({ user_id: S.uid, path: p, video_path: vpath }); if (error) throw error;
      await loadStories(); toast('Your story is live for 24 hours'); refresh();
    } catch (e) { toast(e.message || 'Upload failed. Try again.', 4000); }
  }
}
// Full-screen stories: tap right for next, left for back, hold to pause, swipe down to close.
function openStories(startUid) {
  const queue = startUid === S.uid ? [S.uid] : storyUsers().filter((u) => u !== S.uid);
  let ui = Math.max(0, queue.indexOf(startUid)), si = 0, raf = 0, t0 = 0, dur = 5000, paused = false, pausedAt = 0;
  const v = document.createElement('div'); v.className = 'storyv'; app.appendChild(v);
  const list = () => S.stories.get(queue[ui]) || [];
  const firstUnseen = () => { const i = list().findIndex((s) => !S.seenSt.has(s.id)); return i < 0 ? 0 : i; };
  si = queue[ui] === S.uid ? 0 : firstUnseen();
  const close = () => { cancelAnimationFrame(raf); v.remove(); refresh(); };
  const go = (d) => {
    si += d;
    if (si >= list().length) { ui++; if (ui >= queue.length) return close(); si = firstUnseen(); }
    else if (si < 0) { if (ui === 0) si = 0; else { ui--; si = 0; } }
    paint();
  };
  const tick = () => {
    if (!paused) { const p = Math.min(1, (performance.now() - t0) / dur); const bar = v.querySelector('.sbars .cur i'); if (bar) bar.style.width = p * 100 + '%'; if (p >= 1) return go(1); }
    raf = requestAnimationFrame(tick);
  };
  const paint = () => {
    cancelAnimationFrame(raf);
    const u = queue[ui], s = list()[si]; if (!s) return close();
    const mine = u === S.uid, p = mine ? S.me : S.members.get(u);
    if (!mine && !S.seenSt.has(s.id)) { S.seenSt.add(s.id); sb.from('story_views').insert({ story_id: s.id, viewer: S.uid }).then(() => {}); }
    v.innerHTML = `<div class="sbars">${list().map((x, i) => `<span class="${i < si ? 'done' : i === si ? 'cur' : ''}"><i></i></span>`).join('')}</div>
      <div class="shead">${thumbHTML(p)}<b data-notr>${esc(mine ? T('Your story') : p?.name || '')}</b><span data-notr>${esc(when(s.created_at))}</span><span class="grow"></span>${mine ? `<button class="iconbtn" data-sdel aria-label="Delete">${ic('trash')}</button>` : ''}<button class="iconbtn" data-sx aria-label="Close">${ic('x')}</button></div>
      <div class="smedia">${s.video_path ? `<video src="${esc(url(s.video_path))}" poster="${esc(url(s.path))}" playsinline autoplay></video>` : `<img src="${esc(url(s.path))}" alt="">`}</div>
      <button class="sz l" data-prev aria-label="Back"></button><button class="sz r" data-next aria-label="Next"></button>
      <div class="sfoot">${mine ? `<button class="pill glass" data-seen>${ic('me')}<span>Seen by</span> <b data-notr id="seenn">…</b></button>`
        : `<form class="sreply" id="srf"><input class="glass" id="srt" maxlength="500" placeholder="Reply to ${esc(p?.name || '')}…" autocomplete="off"><span class="srx">${['❤️', '🔥', '😂', '😮'].map((e) => `<button type="button" data-srx="${e}" data-notr>${e}</button>`).join('')}</span></form>`}</div>`;
    t0 = performance.now(); dur = 5000; paused = false;
    const vid = v.querySelector('.smedia video');
    if (vid) {
      vid.muted = false; vid.play().catch(() => { vid.muted = true; vid.play().catch(() => {}); });
      vid.onloadedmetadata = () => { dur = Math.min(60, vid.duration || 5) * 1000; t0 = performance.now() - vid.currentTime * 1000; };
      vid.ontimeupdate = () => { if (vid.duration) t0 = performance.now() - vid.currentTime * 1000; };
    }
    if (mine) sb.from('story_views').select('viewer', { count: 'exact', head: true }).eq('story_id', s.id).then(({ count }) => { const n = v.querySelector('#seenn'); if (n) n.textContent = count ?? 0; });
    raf = requestAnimationFrame(tick);
    const inp = v.querySelector('#srt');
    if (inp) { inp.onfocus = () => { paused = true; pausedAt = performance.now(); vid?.pause(); }; inp.onblur = () => { if (paused) { t0 += performance.now() - pausedAt; paused = false; vid?.play().catch(() => {}); } }; }
    const send = async (body) => {
      const { error } = await sb.from('messages').insert({ recipient: u, body, reply_story: s.path });
      toast(error ? 'Not sent. Check your connection.' : 'Sent');
    };
    v.querySelector('#srf')?.addEventListener('submit', (e) => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; inp.value = ''; inp.blur(); send(t); });
    v.querySelectorAll('[data-srx]').forEach((b) => (b.onclick = () => { burst(b.dataset.srx, b); send(b.dataset.srx); }));
  };
  v.addEventListener('click', async (e) => {
    if (e.target.closest('[data-sx]')) return close();
    if (e.target.closest('[data-next]')) return go(1);
    if (e.target.closest('[data-prev]')) return go(-1);
    if (e.target.closest('[data-sdel]')) {
      const s = list()[si]; paused = true;
      const k = await dialog(`<h3 class="dh">Delete this story?</h3>`, [{ k: 'd', label: 'Delete', style: 'red' }, { k: 'n', label: 'Cancel', style: 'out' }]);
      if (k !== 'd') { paused = false; t0 = performance.now(); return; }
      await sb.from('stories').delete().eq('id', s.id); await loadStories();
      if (!(S.stories.get(S.uid) || []).length) return close(); si = Math.min(si, list().length - 1); return paint();
    }
    if (e.target.closest('[data-seen]')) {
      const s = list()[si]; paused = true;
      const { data } = await sb.from('story_views').select('viewer,viewed_at').eq('story_id', s.id).order('viewed_at', { ascending: false });
      await new Promise((res) => { sheet((data || []).length ? 'Seen by' : 'No one has seen it yet', (data || []).map((x) => ({ icon: 'me', label: `${nameOf(x.viewer)} · ${hm(x.viewed_at)}`, run: res }))); setTimeout(() => { const bg = [...app.querySelectorAll('.sheet-bg')].pop(); bg?.addEventListener('click', (ev) => { if (ev.target === bg) res(); }); }, 0); });
      paused = false; t0 = performance.now(); return;
    }
  });
  // hold to pause, swipe down to close
  let sy = 0, down = 0;
  v.addEventListener('pointerdown', (e) => { if (e.target.closest('input,form,button:not(.sz)')) return; sy = e.clientY; down = performance.now(); setTimeout(() => { if (down && !paused) { paused = true; pausedAt = performance.now(); v.querySelector('.smedia video')?.pause(); v.classList.add('held'); } }, 220); });
  v.addEventListener('pointerup', (e) => {
    const held = paused && v.classList.contains('held'); down = 0;
    if (e.clientY - sy > 90) return close();
    if (held) { e.stopPropagation(); v.classList.remove('held'); t0 += performance.now() - pausedAt; paused = false; v.querySelector('.smedia video')?.play().catch(() => {}); v.dataset.skip = '1'; setTimeout(() => delete v.dataset.skip, 50); }
  });
  v.addEventListener('click', (e) => { if (v.dataset.skip) { e.stopImmediatePropagation(); } }, true);
  paint();
}

/* ---------- video messages in a circle ---------- */
const CIRC = new Map();
function circleHTML(m, mine, rx) {
  return `<div class="b circle ${mine ? 'me' : 'them'} ${rx ? 'has-rx' : ''}" data-msg="${m.id}"><span class="circph" data-circ="${m.id}"></span>${m.tmp ? '<span class="ptag">Sending…</span>' : ''}${rx}</div>`;
}
function mountCircles(box) {
  box.querySelectorAll('[data-circ]').forEach((ph) => {
    const id = ph.dataset.circ, m = S.thread.find((x) => String(x.id) === id); if (!m) return;
    let el = CIRC.get(id);
    if (!el) {
      el = document.createElement('button'); el.className = 'circv'; el.setAttribute('aria-label', T('Play video message'));
      const src = m.tmp ? m.preview : url(m.media_path);
      el.innerHTML = `<video muted loop playsinline webkit-playsinline preload="auto" ${m.poster_path ? `poster="${esc(url(m.poster_path))}"` : ''} src="${esc(src)}"></video><svg class="cring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/></svg><i class="csnd">${ic('mic', 2)}</i>`;
      const vid = el.querySelector('video');
      el.onclick = (e) => {
        e.stopPropagation();
        if (vid.muted) { app.querySelectorAll('.circv.loud').forEach((o) => { if (o !== el) { const ov = o.querySelector('video'); ov.muted = true; ov.loop = true; o.classList.remove('loud'); } });
          vid.muted = false; vid.loop = false; vid.currentTime = 0; vid.play().catch(() => {}); el.classList.add('loud'); }
        else { vid.muted = true; vid.loop = true; el.classList.remove('loud'); vid.play().catch(() => {}); }
      };
      vid.onended = () => { vid.muted = true; vid.loop = true; el.classList.remove('loud'); vid.play().catch(() => {}); };
      vid.ontimeupdate = () => { if (!vid.muted && vid.duration) el.style.setProperty('--p', vid.currentTime / vid.duration); };
      if (!m.tmp) CIRC.set(id, el);
    }
    ph.replaceWith(el);
    const vid = el.querySelector('video'); if (vid.paused) lvPlay(vid).catch(() => {});
  });
}
async function recordCircle(to) {
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) return toast('This phone cannot record video messages here.', 4000);
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }, audio: true }); }
  catch { return toast('Allow the camera and microphone to record a video message.', 4500); }
  const mime = ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp8,opus', 'video/webm'].find((t) => MediaRecorder.isTypeSupported?.(t)) || '';
  const v = document.createElement('div'); v.className = 'circrec';
  v.innerHTML = `<div class="crtop"><button class="iconbtn" data-cx aria-label="Cancel">${ic('x')}</button><b id="crt" data-notr>0:00</b><span style="width:44px"></span></div>
    <div class="crwrap"><video class="live" autoplay muted playsinline></video><video class="prev" playsinline loop hidden></video><svg class="crring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/></svg></div>
    <p class="crhint" id="crh">Tap to record. Up to 30 seconds.</p>
    <div class="crbtns"><button class="pbtn glass" data-cagain hidden>${ic('swap')}Again</button><button class="crbig" data-crec aria-label="Record"><i></i></button><button class="pbtn blue" data-csend hidden>${ic('send')}Send</button></div>`;
  app.appendChild(v);
  const live = v.querySelector('.live'), prev = v.querySelector('.prev'), ring = v.querySelector('.crring');
  live.srcObject = stream; live.play().catch(() => {});
  let rec = null, chunks = [], blob = null, poster = null, t0 = 0, timer = 0;
  const stopAll = () => { clearInterval(timer); try { rec?.state === 'recording' && rec.stop(); } catch {} stream.getTracks().forEach((t) => t.stop()); v.remove(); };
  const grab = () => new Promise((res) => { const c = document.createElement('canvas'); const s = Math.min(live.videoWidth, live.videoHeight) || 480; c.width = c.height = Math.min(640, s);
    const sx = (live.videoWidth - s) / 2, sy = (live.videoHeight - s) / 2; const g = c.getContext('2d'); g.translate(c.width, 0); g.scale(-1, 1); g.drawImage(live, sx, sy, s, s, 0, 0, c.width, c.height); c.toBlob(res, 'image/jpeg', 0.85); });
  const start = async () => {
    chunks = []; blob = null; poster = await grab();
    rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), videoBitsPerSecond: 1_000_000 });
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => {
      blob = new Blob(chunks, { type: (rec.mimeType || mime || 'video/mp4').split(';')[0] });
      prev.src = URL.createObjectURL(blob); prev.hidden = false; live.hidden = true; prev.play().catch(() => {});
      v.querySelector('[data-crec]').hidden = true; v.querySelector('[data-csend]').hidden = false; v.querySelector('[data-cagain]').hidden = false;
      $('#crh', v).textContent = T('Send it or record again.');
    };
    rec.start(250); t0 = Date.now(); v.classList.add('recording'); $('#crh', v).textContent = T('Tap to stop.');
    timer = setInterval(() => { const s = (Date.now() - t0) / 1000; $('#crt', v).textContent = fmtSec(s); ring.style.setProperty('--p', Math.min(1, s / 30)); if (s >= 30) stop(); }, 100);
  };
  const stop = () => { clearInterval(timer); v.classList.remove('recording'); if (rec?.state === 'recording') rec.stop(); };
  v.addEventListener('click', async (e) => {
    if (e.target.closest('[data-cx]')) return stopAll();
    if (e.target.closest('[data-crec]')) return rec?.state === 'recording' ? stop() : start();
    if (e.target.closest('[data-cagain]')) { prev.pause(); prev.hidden = true; live.hidden = false; ring.style.setProperty('--p', 0); $('#crt', v).textContent = '0:00'; v.querySelector('[data-crec]').hidden = false; v.querySelector('[data-csend]').hidden = true; v.querySelector('[data-cagain]').hidden = true; $('#crh', v).textContent = T('Tap to record. Up to 30 seconds.'); return; }
    if (e.target.closest('[data-csend]')) {
      if (!blob || (Date.now() - t0) < 700) return;
      const b = blob, pst = poster; stopAll();
      const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: to, media_kind: 'circle', preview: URL.createObjectURL(b), created_at: new Date().toISOString() };
      S.thread.push(tmp); V.chat.update(to);
      try {
        const ext = /webm/.test(b.type) ? 'webm' : 'mp4', media = `${S.uid}/circle-${Date.now()}.${ext}`;
        const [p] = await Promise.all([pst ? uploadPhoto(pst, 'circp') : Promise.resolve(null), sb.storage.from('media').upload(media, b, { contentType: b.type || 'video/mp4', cacheControl: '31536000' }).then(({ error }) => { if (error) throw error; })]);
        const { data, error } = await sb.from('messages').insert({ recipient: to, media_path: media, media_kind: 'circle', poster_path: p }).select().single(); if (error) throw error;
        S.thread = S.thread.filter((x) => x !== tmp); if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(to, data); }
      } catch { S.thread = S.thread.filter((x) => x !== tmp); toast('Not sent. Check your connection.'); }
      V.chat.update(to);
    }
  });
}

/* ---------- Video: a feed of friends' videos, swipe up for the next ---------- */
let feedMuted = false, feedObs = null, feedItems = [];
V.video = () => `<div class="feedwrap"><div class="feed" id="feed"><div class="center" style="height:100%"><div class="spinner"></div></div></div>
  <div class="feedtop"><h2>Video</h2><button class="iconbtn" id="fsnd" aria-label="Sound">${ic('mic')}</button></div>
  <div class="dock"><div id="tabs">${tabbar('video')}</div></div></div>`;
V.video.cls = 'darkv';
V.video.after = async () => {
  const { data } = await sb.from('posts').select('*').not('video_path', 'is', null).order('created_at', { ascending: false }).limit(60);
  feedItems = (data || []).filter((x) => x.user_id === S.uid || S.members.has(x.user_id));
  const feed = $('#feed'); if (!feed) return;
  if (!feedItems.length) { feed.innerHTML = `<div class="center fempty"><b>No videos from friends yet</b><span>Add your first video. Friends will see it here.</span><button class="pbtn blue" data-act="addvideo">${ic('video')}Add a video</button></div>`; return; }
  const counts = new Map(((await sb.rpc('feed_counts', { p_ids: feedItems.map((x) => x.id) })).data || []).map((c) => [c.post_id, c]));
  feedItems.forEach((x) => Object.assign(x, counts.get(x.id) || { likes: 0, comments: 0, liked: false }));
  feed.innerHTML = feedItems.map((x, i) => { const p = x.user_id === S.uid ? S.me : S.members.get(x.user_id);
    return `<section class="fitem" data-fi="${i}"><video playsinline webkit-playsinline loop preload="none" poster="${esc(url(x.path))}" data-src="${esc(url(x.video_path))}"></video>
      <div class="fshade"></div><span class="fheart" aria-hidden="true">❤️</span>
      <div class="fside"><button data-fu="${x.user_id}" aria-label="${esc(p?.name || '')}">${thumbHTML(p)}</button>
        <button data-flike class="${x.liked ? 'on' : ''}" aria-label="Like"><span data-notr>${x.liked ? '❤️' : '🤍'}</span><b data-notr>${x.likes || ''}</b></button>
        <button data-fcom aria-label="Comments"><span data-notr>💬</span><b data-notr>${x.comments || ''}</b></button>
        <button data-fsend aria-label="Send to a friend">${ic('send', 2)}</button></div>
      <div class="fmeta"><b data-notr>${esc(p?.name || '')}</b><span data-notr>${esc(when(x.created_at))}</span></div></section>`; }).join('');
  const vids = [...feed.querySelectorAll('video')];
  const load = (vd) => { if (vd && !vd.src) { vd.src = vd.dataset.src; vd.preload = 'auto'; } };
  feedObs?.disconnect();
  feedObs = new IntersectionObserver((ents) => ents.forEach((en) => {
    const vd = en.target.querySelector('video'), i = +en.target.dataset.fi;
    if (en.isIntersecting && en.intersectionRatio > 0.6) {
      load(vd); load(vids[i + 1]);
      vd.muted = feedMuted; vd.play().catch(() => { vd.muted = true; feedMuted = true; paintSnd(); vd.play().catch(() => {}); });
    } else { vd.pause(); }
  }), { root: feed, threshold: [0, 0.6, 1] });
  feed.querySelectorAll('.fitem').forEach((s) => feedObs.observe(s));
  const paintSnd = () => { const b = $('#fsnd'); if (b) { b.classList.toggle('muted', feedMuted); b.setAttribute('aria-label', feedMuted ? T('Turn sound on') : T('Turn sound off')); } };
  paintSnd();
  $('#fsnd').onclick = () => { feedMuted = !feedMuted; vids.forEach((vd) => (vd.muted = feedMuted)); paintSnd(); };
  let lastTap = 0;
  feed.addEventListener('click', async (e) => {
    const sec = e.target.closest('.fitem'); if (!sec) return; const x = feedItems[+sec.dataset.fi], vd = sec.querySelector('video');
    const fu = e.target.closest('[data-fu]'); if (fu) return go(fu.dataset.fu === S.uid ? 'gallery/' + S.uid : 'u/' + fu.dataset.fu);
    if (e.target.closest('[data-flike]')) return toggleLike(x, sec);
    if (e.target.closest('[data-fcom]')) return openComments(x, sec);
    if (e.target.closest('[data-fsend]')) return sendToFriend(x);
    const now = Date.now();
    if (now - lastTap < 300) { lastTap = 0; const h = sec.querySelector('.fheart'); h.classList.remove('go'); void h.offsetWidth; h.classList.add('go'); if (!x.liked) toggleLike(x, sec); return; }
    lastTap = now;
    setTimeout(() => { if (lastTap !== now) return; if (feedMuted) { feedMuted = false; vids.forEach((v2) => (v2.muted = false)); paintSnd(); vd.play().catch(() => {}); } else if (vd.paused) vd.play().catch(() => {}); else vd.pause(); }, 310);
  });
};
async function toggleLike(x, sec) {
  x.liked = !x.liked; x.likes = Math.max(0, (x.likes || 0) + (x.liked ? 1 : -1));
  const b = sec.querySelector('[data-flike]'); b.classList.toggle('on', x.liked); b.innerHTML = `<span data-notr>${x.liked ? '❤️' : '🤍'}</span><b data-notr>${x.likes || ''}</b>`;
  if (x.liked) { navigator.vibrate?.(15); await sb.from('post_likes').insert({ post_id: x.id, user_id: S.uid }); } else await sb.from('post_likes').delete().eq('post_id', x.id).eq('user_id', S.uid);
}
async function openComments(x, sec) {
  const bg = document.createElement('div'); bg.className = 'sheet-bg';
  bg.innerHTML = `<div class="sheet comsheet" role="dialog"><div class="grab"></div><h3>Comments</h3><div class="comlist" id="coml"><div class="center" style="padding:20px"><span class="spinner sm dark"></span></div></div>
    <form class="comform" id="comf"><input class="field" id="comt" maxlength="500" placeholder="Add a comment…" autocomplete="off"><button class="send sm" aria-label="Send">${ic('send', 2)}</button></form></div>`;
  app.appendChild(bg);
  bg.addEventListener('click', (e) => { if (e.target === bg) bg.remove(); });
  const paint = async () => {
    const { data } = await sb.rpc('post_comments_list', { p_post: x.id });
    const l = $('#coml', bg); if (!l) return;
    l.innerHTML = (data || []).length ? data.map((c) => `<div class="com">${thumbHTML({ id: c.user_id, still_path: c.photo })}<div><b data-notr>${esc(c.name || '')}</b> <small data-notr>${esc(when(c.created_at))}</small><p data-notr>${esc(c.body)}</p></div></div>`).join('') : `<p class="fine" style="text-align:center;padding:18px">No comments yet. Be the first.</p>`;
    l.scrollTop = 1e9; x.comments = (data || []).length; const b = sec.querySelector('[data-fcom] b'); if (b) b.textContent = x.comments || '';
  };
  await paint();
  $('#comf', bg).onsubmit = async (e) => { e.preventDefault(); const t = $('#comt', bg).value.trim(); if (!t) return; $('#comt', bg).value = ''; const { error } = await sb.from('post_comments').insert({ post_id: x.id, user_id: S.uid, body: t }); if (error) toast('Not sent. Check your connection.'); await paint(); };
}
async function sendToFriend(x) {
  const fr = [...S.members.values()].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  if (!fr.length) return toast('Add friends first');
  const to = await choose('Send to', fr.map((p) => ({ k: p.id, icon: 'send', label: p.name, notr: true })));
  if (!to) return;
  const { error } = await sb.from('messages').insert({ recipient: to, media_path: x.video_path, media_kind: 'video', poster_path: x.path });
  toast(error ? 'Not sent. Check your connection.' : 'Sent');
}

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
  if (k === 'x' && a === 'poke') return `<span class="poke" data-notr>👉</span><b class="poketx">${esc(T('Poke!'))}</b>`;
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
  else { r.set(S.uid, e); refresh(); navigator.vibrate?.(10); burst(e, app.querySelector(`.b[data-msg="${k}"]`)); await sb.from('reactions').upsert({ message_id: m.id, user_id: S.uid, emoji: e }, { onConflict: 'message_id,user_id' }); }
}
async function sendSticker(to, code) {
  const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: to, sticker: code, created_at: new Date().toISOString() };
  S.thread.push(tmp); V.chat.update(to); const box = $('#msgs'); if (box) box.scrollTop = 1e9;
  const { data, error } = await sb.from('messages').insert({ recipient: to, sticker: code }).select().single();
  S.thread = S.thread.filter((x) => x !== tmp);
  if (error) toast('Message not sent. Check your connection.'); else { if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(to, data); } if (code.startsWith('e|')) runFx(fxFor(code.slice(2))); }
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
  if (m.media_path || m.media_kind) return mediaHTML(m, mine, rx);
  if (m.sticker) return `<div class="b stk ${mine ? 'me' : 'them'} ${rx ? 'has-rx' : ''}" data-msg="${m.id}">${stickerHTML(m.sticker)}${rx}</div>`;
  const tr = TR.get(String(m.id));
  const text = tr && tr.show ? tr.text : m.body;
  const jumbo = !(tr && tr.show) && !m.reply_story && isJumbo(m.body);
  const rs = m.reply_story ? `<span class="rstory"><img src="${esc(thumb(m.reply_story))}" alt=""><span>${mine ? 'Replied to a story' : 'Replied to your story'}</span></span>` : '';
  const note = tr && tr.show ? `<button class="trnote" data-orig="${m.id}">${ic('globe')}<span>Show original</span></button>`
    : (mine && m.orig_lang ? `<span class="trnote">${ic('globe')}<span>Sent in ${esc(langLabel(m.orig_lang))}</span></span>` : '');
  const ail = m.ai ? `<span class="ailbl">${ic('spark', 2)}<span data-notr>${esc(mine ? T('{ai} answered for you').replace('{ai}', S.me?.ai_name || 'AI') : T('{ai} · assistant of {n}').replace('{ai}', S.members.get(m.sender)?.ai_name || 'AI').replace('{n}', nameOf(m.sender)))}</span></span>` : '';
  return `<div class="b ${jumbo && !m.ai ? 'jumbo' : ''} ${m.ai ? 'ai' : ''} ${mine ? 'me' : 'them'} ${rx ? 'has-rx' : ''}" data-msg="${m.id}" title="${hm(m.created_at)}">${ail}${rs}<span class="tx" data-notr>${esc(text)}</span>${note}${rx}</div>`;
}
/* ---------- chat magic: screen effects, flying reactions, poke ---------- */
const FX_WORDS = [
  ['confetti', /(с\s*д[нн][её]м\s*рождени|happy\s*birthday|doğum\s*günün|عيد\s*ميلاد|كل\s*عام|поздравля|congrat|tebrik|مبروك|🎉|🥳|🎂)/i],
  ['hearts', /(люблю|love\s*you|i\s*love|seni\s*seviyorum|أحبك|بحبك|❤️|🫶|😍|💕|💖|🥰)/i],
  ['fireworks', /(^|[\s!.,])(ура+|hooray|yay+|yaşasın|машалла|mashallah|ماشاء\s*الله|с\s*новым\s*годом|happy\s*new\s*year|🎆|🎇|🚀)/i],
  ['laugh', /(ахах|хаха|lol|lmao|haha|jaja|😂|🤣)/i],
];
function fxFor(t) { if (!t) return null; for (const [k, re] of FX_WORDS) if (re.test(t)) return k; return null; }
const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let fxOn = false;
function runFx(kind) {
  if (!kind || fxOn || reduceMotion()) return;
  fxOn = true;
  const c = document.createElement('canvas'); c.className = 'fxcv'; c.setAttribute('aria-hidden', 'true'); app.appendChild(c);
  const k = Math.min(2, devicePixelRatio || 1), W = c.width = app.clientWidth * k, H = c.height = app.clientHeight * k;
  const g = c.getContext('2d'); const P = []; const t0 = performance.now();
  const COL = ['#0A3CFF', '#FFC233', '#2BD46B', '#FF5C8A', '#7B61FF', '#FFFFFF', '#3A63FF'];
  const R = Math.random;
  if (kind === 'confetti') for (let i = 0; i < 160; i++) P.push({ t: 'c', x: W * (.15 + R() * .7), y: H * 1.02, vx: (R() - .5) * 9 * k, vy: -(11 + R() * 13) * k, w: (6 + R() * 6) * k, h: (3 + R() * 4) * k, c: COL[R() * COL.length | 0], a: R() * 6, va: (R() - .5) * .35, g: .3 * k, d: R() * 300 });
  const emo = kind === 'hearts' ? ['❤️', '💖', '💕', '🫶', '❤️'] : kind === 'laugh' ? ['😂', '🤣', '😂'] : null;
  if (emo) for (let i = 0; i < 30; i++) P.push({ t: 'e', x: R() * W, y: H + R() * H * .6, vx: (R() - .5) * k, vy: -(3.2 + R() * 4) * k, s: (24 + R() * 30) * k, e: emo[i % emo.length], ph: R() * 6, g: 0, d: 0 });
  const bursts = [];
  if (kind === 'fireworks') for (let b = 0; b < 6; b++) bursts.push({ at: b * 380, x: W * (.15 + R() * .7), y: H * (.12 + R() * .4), c: COL[R() * 5 | 0], done: false });
  const life = kind === 'fireworks' ? 3400 : emo ? 3800 : 3000;
  const step = (now) => {
    const el = now - t0; g.clearRect(0, 0, W, H);
    for (const b of bursts) if (!b.done && el >= b.at) { b.done = true; for (let i = 0; i < 70; i++) { const a = (i / 70) * Math.PI * 2, v = (2.5 + R() * 4.5) * k; P.push({ t: 'f', x: b.x, y: b.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: R() < .2 ? '#FFFFFF' : b.c, l: 1, g: .05 * k, d: 0 }); } }
    for (const p of P) {
      if (p.d > 0 && el < p.d) continue;
      p.vy += p.g; p.x += p.vx; p.y += p.vy;
      if (p.t === 'c') { p.vx *= .985; p.a += p.va; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.globalAlpha = Math.max(0, 1 - el / life); g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); g.restore(); }
      else if (p.t === 'e') { p.ph += .05; g.globalAlpha = Math.max(0, Math.min(1, (life - el) / 600)); g.font = `${p.s}px system-ui, "Apple Color Emoji", "Segoe UI Emoji"`; g.fillText(p.e, p.x + Math.sin(p.ph) * 14 * k, p.y); }
      else { p.vx *= .97; p.vy *= .97; p.l -= .014; if (p.l <= 0) continue; g.globalAlpha = p.l; g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, 2.4 * k, 0, 7); g.fill(); }
    }
    g.globalAlpha = 1;
    if (el < life) requestAnimationFrame(step); else { c.remove(); fxOn = false; }
  };
  requestAnimationFrame(step);
}
// An emoji bursts out of a message and flies across the screen.
function burst(emoji, el) {
  if (!emoji || reduceMotion()) return;
  const a = app.getBoundingClientRect(), r = (el || app).getBoundingClientRect();
  const x0 = r.left - a.left + r.width / 2, y0 = r.top - a.top + r.height / 2;
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('span'); s.className = 'rxfly'; s.textContent = emoji; s.setAttribute('aria-hidden', 'true');
    s.style.left = x0 + 'px'; s.style.top = y0 + 'px';
    s.style.setProperty('--dx', (Math.random() - .5) * 260 + 'px'); s.style.setProperty('--dy', -(140 + Math.random() * 320) + 'px');
    s.style.setProperty('--r', (Math.random() - .5) * 120 + 'deg'); s.style.animationDelay = i * 40 + 'ms';
    app.appendChild(s); setTimeout(() => s.remove(), 1700);
  }
}
let lastPoke = 0;
function shakeView() { const v = app.querySelector('.view'); if (!v) return; v.classList.remove('poked'); void v.offsetWidth; v.classList.add('poked'); }
async function sendPoke(to) {
  if (Date.now() - lastPoke < 4000) return toast('One poke at a time 🙂');
  lastPoke = Date.now(); navigator.vibrate?.(30);
  const bg = app.querySelector(`[data-bgfor="${to}"]`); if (bg) { bg.classList.remove('poked'); void bg.offsetWidth; bg.classList.add('poked'); }
  await sendSticker(to, 'x|poke');
}
// What happens on my screen when a friend's message arrives.
function onIncoming(m) {
  const fresh = Date.now() - new Date(m.created_at) < 20000;
  if (!fresh) return;
  const here = route().name === 'chat' && route().id === m.sender && document.visibilityState === 'visible';
  if (m.sticker === 'x|poke') { navigator.vibrate?.([90, 60, 90]); shakeView(); if (!here) toast(`${nameOf(m.sender)} poked you 👉`, 3000); return; }
  if (!here) return;
  runFx(fxFor(m.body) || (m.sticker?.startsWith('e|') ? fxFor(m.sticker.slice(2)) : null));
}

/* ---------- photos and videos in chats ---------- */
const landed = new Set();
const scratched = new Set((store.get('magaam-scratched') || '').split(',').filter(Boolean));
const SCR = new Map();
function mediaHTML(m, mine, rx) {
  if (m.media_kind === 'circle') return circleHTML(m, mine, rx);
  const id = String(m.id);
  const fresh = !landed.has(id) && Date.now() - new Date(m.created_at) < 15000; if (!m.tmp) landed.add(id);
  const cls = `b media ${mine ? 'me' : 'them'} ${rx ? 'has-rx' : ''} ${fresh ? (mine ? 'land-me' : 'land-them') : ''}`;
  const what = m.media_kind === 'video' ? 'View-once video' : 'View-once photo';
  if (m.media_fx === 'once') {
    const opened = !!m.opened_at;
    const inner = `<span class="oncei" data-notr>${opened ? '💨' : '🔥'}</span><span class="oncet"><b>${what}</b><span>${mine ? (m.tmp ? 'Sending…' : opened ? 'Opened' : 'Not opened yet') : opened ? 'Opened' : 'Tap to open. It disappears after viewing'}</span></span>`;
    return `<div class="${cls} once" data-msg="${m.id}">${mine || opened ? `<div class="oncebox">${inner}</div>` : `<button class="oncebox" data-once="${m.id}">${inner}</button>`}${rx}</div>`;
  }
  const src = m.tmp ? m.preview : url(m.media_kind === 'video' ? (m.poster_path || m.media_path) : m.media_path);
  const cover = m.media_fx === 'scratch' && !mine && !m.tmp && !scratched.has(id);
  return `<div class="${cls} polaroid" data-msg="${m.id}"><button class="pimg" data-media="${m.id}" aria-label="${m.media_kind === 'video' ? 'Play video' : 'Open photo'}"><img src="${esc(src)}" alt="" ${fresh ? 'class="develop"' : ''}>${m.media_kind === 'video' ? `<i class="pplay">${ic('play', 2)}</i>` : ''}${cover ? `<canvas class="scratch" data-scratch="${m.id}"></canvas>` : ''}</button>${m.media_fx === 'scratch' && mine ? '<span class="ptag">Scratch to reveal</span>' : ''}${m.tmp ? '<span class="ptag">Sending…</span>' : ''}${rx}</div>`;
}
// "Scratch to reveal": a silver layer the friend rubs off with a finger. Progress survives re-renders.
function mountScratch(box) {
  box.querySelectorAll('canvas[data-scratch]').forEach((ph) => {
    const id = ph.dataset.scratch;
    if (SCR.has(id)) { ph.replaceWith(SCR.get(id)); return; }
    const c = ph; SCR.set(id, c);
    const paint = () => {
      const r = c.parentElement.getBoundingClientRect(); if (!r.width) return requestAnimationFrame(paint);
      const k = 2; c.width = r.width * k; c.height = r.height * k;
      const g = c.getContext('2d'); const gr = g.createLinearGradient(0, 0, c.width, c.height);
      gr.addColorStop(0, '#C9CED9'); gr.addColorStop(.5, '#F2F4F8'); gr.addColorStop(1, '#AEB5C4'); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
      g.fillStyle = 'rgba(11,20,48,.12)'; for (let y = 0; y < c.height; y += 26) for (let x = (y / 26) % 2 ? 13 : 0; x < c.width; x += 26) { g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
      g.fillStyle = '#0B1430'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = `600 ${15 * k}px Geologica, system-ui, sans-serif`;
      g.fillText('✨ ' + T('Scratch me') + ' ✨', c.width / 2, c.height / 2);
    };
    let down = false, n = 0;
    const im = c.parentElement.querySelector('img'); if (im && !im.complete) im.addEventListener('load', () => n || paint(), { once: true }); else requestAnimationFrame(paint);
    const rub = (e) => {
      if (!down) return; e.preventDefault();
      const r = c.getBoundingClientRect(), g = c.getContext('2d'), k = c.width / r.width;
      g.globalCompositeOperation = 'destination-out'; g.beginPath(); g.arc((e.clientX - r.left) * k, (e.clientY - r.top) * k, 24 * k, 0, 7); g.fill();
      if (++n % 8) return;
      const d = g.getImageData(0, 0, c.width, c.height).data; let clear = 0, all = 0;
      for (let i = 3; i < d.length; i += 64) { all++; if (d[i] === 0) clear++; }
      if (clear / all > .5) { down = false; c.classList.add('gone'); navigator.vibrate?.(20); scratched.add(id); store.set('magaam-scratched', [...scratched].slice(-300).join(',')); setTimeout(() => { c.remove(); SCR.delete(id); }, 450); }
    };
    c.addEventListener('pointerdown', (e) => { down = true; c.setPointerCapture?.(e.pointerId); rub(e); });
    c.addEventListener('pointermove', rub);
    ['pointerup', 'pointercancel'].forEach((ev) => c.addEventListener(ev, () => (down = false)));
  });
}
function choose(title, items) { return new Promise((res) => { sheet(title, items.map((it) => ({ ...it, run: () => res(it.k) }))); setTimeout(() => { const bg = [...app.querySelectorAll('.sheet-bg')].pop(); bg?.addEventListener('click', (e) => { if (e.target === bg) res(null); }); }, 0); }); }
async function sendMedia(to) {
  const kind = await choose('Send to chat', [{ k: 'circle', icon: 'camera', label: 'Video message in a circle' }, { k: 'image', icon: 'image', label: 'Photo' }, { k: 'video', icon: 'video', label: 'Video' }]); if (!kind) return;
  if (kind === 'circle') return recordCircle(to);
  const f = kind === 'image' ? await pickFile(false) : await pickVideo(); if (!f) return;
  if (kind === 'video' && f.size > 50 * 1024 * 1024) return toast('This video is larger than 50 MB. Use a shorter clip.', 4000);
  const fx = await choose('How should it arrive?', [{ k: 'plain', icon: 'send', label: 'Send' }, { k: 'scratch', icon: 'spark', label: 'Scratch to reveal' }, { k: 'once', icon: 'x', label: 'View once, then it disappears' }]); if (!fx) return;
  let info = null; if (kind === 'video') { info = await videoInfo(f); if (!info?.poster) return toast('This video could not be read. Try an MP4 or MOV video.', 4000); }
  const tmp = { id: 'tmp' + Date.now(), tmp: true, sender: S.uid, recipient: to, media_kind: kind, media_fx: fx === 'plain' ? null : fx, preview: URL.createObjectURL(kind === 'image' ? f : info.poster), created_at: new Date().toISOString() };
  S.thread.push(tmp); V.chat.update(to); const box = $('#msgs'); if (box) box.scrollTop = 1e9;
  try {
    let media, poster = null;
    if (kind === 'image') media = await uploadPhoto(f, 'chat');
    else {
      const ext = /quicktime|mov/i.test(f.type) || /\.mov$/i.test(f.name) ? 'mov' : /webm/.test(f.type) ? 'webm' : 'mp4';
      media = `${S.uid}/chatv-${Date.now()}.${ext}`;
      const [p] = await Promise.all([uploadPhoto(info.poster, 'chatp'), sb.storage.from('media').upload(media, f, { contentType: f.type || 'video/mp4', cacheControl: '31536000' }).then(({ error }) => { if (error) throw error; })]);
      poster = p;
    }
    tmp.media_path = media;
    const { data, error } = await sb.from('messages').insert({ recipient: to, media_path: media, media_kind: kind, poster_path: poster, media_fx: tmp.media_fx }).select().single(); if (error) throw error;
    landed.add(String(data.id));
    S.thread = S.thread.filter((x) => x !== tmp); if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(to, data); }
  } catch { S.thread = S.thread.filter((x) => x !== tmp); toast('Not sent. Check your connection.'); }
  V.chat.update(to);
}
// Full-screen view. A "view once" photo turns into dust when closed.
function openMedia(m) {
  const once = m.media_fx === 'once' && m.sender !== S.uid;
  const v = document.createElement('div'); v.className = 'viewer mview';
  const src = url(m.media_path);
  v.innerHTML = `${m.media_kind === 'video' ? `<video src="${esc(src)}" ${m.poster_path ? `poster="${esc(url(m.poster_path))}"` : ''} autoplay playsinline ${once ? '' : 'controls loop'}></video>` : `<img src="${esc(src)}" alt="" crossorigin="anonymous">`}
    <div class="hdr"><button class="iconbtn" data-x aria-label="Close">${ic('x')}</button>${once ? `<span class="pill glass onceflag" data-notr>🔥 ${esc(T('View once'))}</span>` : ''}<span style="width:44px"></span></div>`;
  app.appendChild(v);
  const close = async () => {
    if (!once) return v.remove();
    v.querySelector('.hdr').remove();
    const media = v.querySelector('img,video');
    await dissolve(media); v.remove();
    m.opened_at = new Date().toISOString(); refresh();
    sb.rpc('open_once', { p_id: m.id }).then(() => {});
  };
  v.addEventListener('click', (e) => { if (e.target.closest('[data-x]') || (!once && e.target === v)) close(); });
  if (once && m.media_kind === 'video') v.querySelector('video').onended = close;
}
function dissolve(el) {
  return new Promise((res) => {
    if (!el || reduceMotion()) return res();
    const r = el.getBoundingClientRect(), a = app.getBoundingClientRect();
    const isImg = el.tagName === 'IMG' && el.naturalWidth;
    const fw = isImg ? el.naturalWidth : r.width, fh = isImg ? el.naturalHeight : r.height;
    const sc = Math.min(r.width / fw, r.height / fh), dw = fw * sc, dh = fh * sc, ox = r.left - a.left + (r.width - dw) / 2, oy = r.top - a.top + (r.height - dh) / 2;
    const c = document.createElement('canvas'), k = Math.min(2, devicePixelRatio || 1); c.className = 'fxcv'; c.style.zIndex = 60;
    c.width = app.clientWidth * k; c.height = app.clientHeight * k; app.appendChild(c); el.style.visibility = 'hidden';
    const g = c.getContext('2d'), T0 = performance.now(), N = 14, tw = dw / N, th = tw, rows = Math.ceil(dh / th), tiles = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < N; x++) tiles.push({ x, y, d: (x / N) * 500 + Math.random() * 400, vx: (1 + Math.random() * 3), vy: -(1 + Math.random() * 3), rot: (Math.random() - .5) * .2 });
    const step = (now) => {
      const t = now - T0; g.clearRect(0, 0, c.width, c.height);
      for (const p of tiles) {
        const u = Math.max(0, t - p.d) / 900; if (u >= 1) continue;
        const dx = p.vx * u * 120, dy = p.vy * u * 120;
        g.globalAlpha = 1 - u; g.save(); g.translate((ox + p.x * tw + tw / 2 + dx) * k, (oy + p.y * th + th / 2 + dy) * k); g.rotate(p.rot * u * 10);
        const sw = tw * (1 - u * .6), sh = th * (1 - u * .6);
        if (isImg) g.drawImage(el, (p.x * tw) / sc, (p.y * th) / sc, tw / sc, th / sc, -sw / 2 * k, -sh / 2 * k, sw * k, sh * k);
        else { g.fillStyle = '#8A93A8'; g.fillRect(-sw / 2 * k, -sh / 2 * k, sw * k, sh * k); }
        g.restore();
      }
      if (t < 1900) requestAnimationFrame(step); else { c.remove(); res(); }
    };
    requestAnimationFrame(step);
  });
}

/* ---------- voice effects (made right in the phone) ---------- */
const VFX = [['', 'Normal', '🎙️'], ['robot', 'Robot', '🤖'], ['chip', 'Chipmunk', '🐿️'], ['deep', 'Deep', '🐻'], ['echo', 'Echo', '🏔️']];
let vfx = '';
async function applyVfx(blob, kind) {
  const AC = window.AudioContext || window.webkitAudioContext; const ac = new AC();
  const ab = await blob.arrayBuffer();
  const buf = await new Promise((res, rej) => { const p = ac.decodeAudioData(ab, res, rej); if (p && p.then) p.then(res, rej); });
  ac.close?.();
  const rate = kind === 'chip' ? 1.45 : kind === 'deep' ? 0.78 : 1;
  const sr = 24000, len = buf.duration / rate + (kind === 'echo' ? 0.9 : 0);
  const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext; const oc = new OC(1, Math.ceil(len * sr), sr);
  const src = oc.createBufferSource(); src.buffer = buf; src.playbackRate.value = rate;
  if (kind === 'robot') {
    const mod = oc.createGain(); mod.gain.value = 0; const osc = oc.createOscillator(); osc.frequency.value = 50; osc.connect(mod.gain); osc.start();
    const boost = oc.createGain(); boost.gain.value = 1.6; src.connect(mod); mod.connect(boost); boost.connect(oc.destination);
  } else if (kind === 'echo') {
    const dl = oc.createDelay(1); dl.delayTime.value = 0.23; const fb = oc.createGain(); fb.gain.value = 0.42; const wet = oc.createGain(); wet.gain.value = 0.6;
    src.connect(oc.destination); src.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(oc.destination);
  } else src.connect(oc.destination);
  src.start();
  const out = await new Promise((res, rej) => { oc.oncomplete = (e) => res(e.renderedBuffer); const p = oc.startRendering(); if (p && p.then) p.then(res, rej); });
  return { blob: wavOf(out), ms: Math.round(out.duration * 1000) };
}
function wavOf(b) {
  const d = b.getChannelData(0), n = d.length, v = new DataView(new ArrayBuffer(44 + n * 2));
  const w = (o, t) => { for (let i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); };
  w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, b.sampleRate, true); v.setUint32(28, b.sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i])); const g = peak > 1 ? 1 / peak : 1;
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i] * g)) * 0x7fff, true);
  return new Blob([v], { type: 'audio/wav' });
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
  if (m.sticker || m.media_kind) return sheet('', [], top);
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
  $('#cf').hidden = true; $('#rec').hidden = false; $('#vfx').hidden = false;
  const tick = () => { if (!rec) return; const sec = (Date.now() - rec.t0) / 1000; $('#rect').textContent = fmtSec(sec);
    $('#rechint').textContent = sec <= 10 ? (S.me?.video_path ? 'Your living photo will say it' : 'Voice message') : 'Over 10 s: sent as a normal voice message';
    if (sec >= 60) stopRec(true); };
  rec.timer = setInterval(tick, 200); tick();
}
function stopRec(send) {
  if (!rec) return; const r = rec; rec = null; clearInterval(r.timer);
  r.mr.onstop = async () => {
    r.stream.getTracks().forEach((t) => t.stop());
    const cf = $('#cf'), rb = $('#rec'), vr = $('#vfx'); if (cf) cf.hidden = false; if (rb) rb.hidden = true; if (vr) vr.hidden = true;
    if (!send) return;
    const ms = Date.now() - r.t0; if (ms < 800) return toast('Too short. Hold on a little longer.');
    const type = (r.mr.mimeType || r.chunks[0]?.type || 'audio/webm').split(';')[0];
    let blob = new Blob(r.chunks, { type }), len = ms;
    if (blob.size < 800) return toast('The voice message did not record. Try again.', 3500);
    // Short voices become a plain WAV file: iPhone records in a format the talking-photo AI cannot read.
    if (vfx || ms <= 10500) { try { const out = await applyVfx(blob, vfx); blob = out.blob; len = out.ms; } catch (e) { console.warn('voice convert', e); } }
    await sendVoice(r.to, blob, len);
  };
  try { r.mr.stop(); } catch { r.mr.onstop(); }
}
async function sendVoice(to, blob, ms) {
  const ext = /wav/.test(blob.type) ? 'wav' : /mp4|aac|m4a/.test(blob.type) ? 'm4a' : /ogg/.test(blob.type) ? 'ogg' : 'webm';
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
    <button class="iconbtn pokebtn" id="pokeb" aria-label="Poke ${esc(p.name)}" title="Poke"><span data-notr>👉</span></button></div>
  <div class="you glass">${S.me.still_path || S.me.photo_path ? `<img class="${S.me.video_path || S.me.still_path ? '' : 'raw'}" src="${esc(thumb(S.me.still_path || S.me.photo_path))}" alt="">` : ''}<span>You</span></div>
  <div class="msgs" id="msgs" aria-live="polite"></div>
  <div class="stkpanel glass" id="stk" hidden></div>
  <button class="sendlang glass" id="sendlang" hidden></button>
  <form class="composer" id="cf"><button type="button" class="tool glass" id="attb" aria-label="Send a photo or video">${ic('image')}</button><button type="button" class="tool glass" id="stkb" aria-label="Stickers">${ic('smile')}</button><button type="button" class="tool glass" id="langb" aria-label="Write in">${ic('globe')}</button><textarea class="glass" id="tx" rows="1" placeholder="Message…" aria-label="Message" maxlength="2000"></textarea>
    <button type="button" class="send" id="micb" aria-label="Record a voice message">${ic('mic', 2)}</button><button class="send" id="sendb" aria-label="Send" hidden>${ic('send', 2)}</button></form>
  <div class="vfxrow" id="vfx" hidden role="group" aria-label="Voice effect">${VFX.map(([k, l, e]) => `<button type="button" data-vfx="${k}" aria-pressed="${k === vfx}"><span data-notr>${e}</span>${l}</button>`).join('')}</div>
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
  if (!S.thread.length && !awayOn(id)) html = `<div class="day">Say hello to ${esc(S.members.get(id)?.name)}</div>`;
  const lastM = S.thread[S.thread.length - 1];
  if (awayOn(id) && !(lastM?.ai && lastM.sender === id) && !S.aiTyping.has(id)) {
    const p = S.members.get(id), t = p.last_seen ? (new Date(p.last_seen).toDateString() === new Date().toDateString() ? hm(p.last_seen) : when(p.last_seen)) : '';
    const txt = (t ? T("Hi {me}! I'm {ai}, {n}'s AI assistant. {n} has been offline since {t}. Write to me and I'll answer or pass it on.") : T("Hi {me}! I'm {ai}, {n}'s AI assistant. {n} is offline right now. Write to me and I'll answer or pass it on."))
      .replace('{me}', S.me?.name || '').replace('{ai}', p.ai_name).replaceAll('{n}', p.name).replace('{t}', t);
    html += `<div class="b them ai greet"><span class="ailbl">${ic('spark', 2)}<span data-notr>${esc(T('{ai} · assistant of {n}').replace('{ai}', p.ai_name).replace('{n}', p.name))}</span></span><span class="tx" data-notr>${esc(txt)}</span></div>`;
  }
  if (S.aiTyping.has(id)) html += `<div class="typing aity"><span data-notr>${esc(S.members.get(id)?.ai_name || '')}</span><i></i><i></i><i></i></div>`;
  if (S.typing.has(id)) html += '<div class="typing"><i></i><i></i><i></i></div>';
  box.innerHTML = html;
  mountScratch(box); mountCircles(box);
  const stick = nearBottom || box.dataset.init !== '1';
  if (stick) { box.scrollTop = box.scrollHeight; box.dataset.init = '1'; }
  // Photos load after the list is drawn; keep the newest message in view.
  if (stick) box.querySelectorAll('img').forEach((im) => { if (!im.complete) im.addEventListener('load', () => { box.scrollTop = box.scrollHeight; }, { once: true }); });
  setTimeout(() => autoVoices(id), 0);
};
V.chat.after = async (id) => {
  V.chat.update(id);
  await loadThread(id); await loadRx(); markRead(id); V.chat.update(id);
  const tx = $('#tx'), f = $('#cf'), box = $('#msgs');
  if (!tx || !f || route().name !== 'chat' || route().id !== id) return; // left the chat while it was loading
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
  if (tx.value) grow(); // text typed while the chat was still loading
  tx.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !/mobi/i.test(navigator.userAgent)) { e.preventDefault(); f.requestSubmit(); } });
  $('#micb').onclick = () => startRec(id);
  $('#attb').onclick = () => sendMedia(id);
  $('#pokeb').onclick = () => sendPoke(id);
  $('#vfx').onclick = (e) => { const b = e.target.closest('[data-vfx]'); if (!b) return; vfx = b.dataset.vfx; $('#vfx').querySelectorAll('[data-vfx]').forEach((x) => x.setAttribute('aria-pressed', x === b)); };
  $('#reccancel').onclick = () => stopRec(false);
  $('#recsend').onclick = () => stopRec(true);
  // play, show original, long press menu
  let lp = null, sx = 0, sy = 0;
  box.addEventListener('click', (e) => {
    if (e.target.closest('canvas.scratch')) return;
    const md = e.target.closest('[data-media]'); if (md) { const m = S.thread.find((x) => String(x.id) === md.dataset.media); if (m && !m.tmp) openMedia(m); return; }
    const on = e.target.closest('[data-once]'); if (on) { const m = S.thread.find((x) => String(x.id) === on.dataset.once); if (m && !m.opened_at) openMedia(m); return; }
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
    else {
      if (!S.thread.some((x) => x.id === data.id)) { S.thread.push(data); S.last.set(id, data); } runFx(fxFor(original));
      if (awayOn(id)) {
        S.aiTyping.add(id); V.chat.update(id);
        aiCall({ op: 'away', to: id }).then((j) => { const m = j?.message; if (m && !S.thread.some((x) => x.id === m.id) && S.threadWith === id) { S.thread.push(m); S.last.set(id, m); chime(true); } })
          .catch(() => {}).finally(() => { S.aiTyping.delete(id); if (route().name === 'chat' && route().id === id) V.chat.update(id); });
      }
    }
    V.chat.update(id);
  };
};
window.addEventListener('hashchange', () => { if (player) stopPlayer(); if (rec) stopRec(false); });

/* Someone's page */
/* A person's page before you are friends: open or closed profile */
V.p = async (id) => {
  if (id === S.uid) { go('me', true); return; }
  if (S.members.has(id)) { go('u/' + id, true); return; }
  const { data } = await sb.rpc('person_card', { p_id: id });
  const c = data?.[0]; if (!c) { toast('This profile is not available'); go('add', true); return; }
  S.extra.set(id, c);
  const stats = [`<span><b data-notr>${c.friends}</b> ${esc(T(c.friends === 1 ? 'friend' : 'friends'))}</span>`, `<span><b data-notr>${c.posts}</b> ${esc(T(c.posts === 1 ? 'photo' : 'photos'))}</span>`, c.mutual ? `<span><b data-notr>${c.mutual}</b> ${esc(T('mutual'))}</span>` : ''].join('');
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(c)}
  <div class="shade"></div>
  <div class="hdr"><button class="iconbtn" data-back="add" aria-label="Back">${ic('back')}</button>
    <div class="hname"><b data-notr>${esc(c.name)}</b>${c.is_public ? `<span class="pill glass" id="st"></span>` : ''}</div><button class="iconbtn" data-act="umore" data-uid="${id}" aria-label="More">${ic('more', 2.4)}</button></div>
  <div class="dock"><div class="card glass pcard">
    <div class="phead"><span class="puser" data-notr>@${esc(c.username || '')}</span><span class="ptype ${c.is_public ? 'open' : ''}">${ic(c.is_public ? 'globe' : 'lock', 2)}${esc(T(c.is_public ? 'Open profile' : 'Closed profile'))}</span></div>
    <div class="pstats">${stats}</div>
    ${c.is_public ? `<div class="cta2">${relBtn(id, true)}<button class="pbtn glass" data-go="gallery/${id}">${ic('grid')}Gallery</button></div>`
      : `<div class="plock">${ic('lock', 2)}<span>Gallery and stories are only for friends.</span></div>${relBtn(id, true)}`}
  </div></div></div>`;
};
V.p.after = (id) => {
  const s = $('#st'); if (s) { const st = statusOf(id); s.innerHTML = `<i class="dot ${st.on ? 'on' : ''}"></i>${esc(T(st.text))}`; }
  app.querySelectorAll('[data-fr]').forEach((b) => (b.onclick = () => { b.disabled = true; friendAct(b.dataset.fr, b.dataset.uid); }));
};

V.u = async (id) => {
  if (id === S.uid) { go('me', true); return; }
  if (!S.members.has(id)) { await loadAll(); if (!S.members.has(id)) { go('chats', true); return; } }
  const p = S.members.get(id);
  loadPosts(id).then(() => route().name === 'u' && V.u.update(id));
  return `<div class="dark" style="position:absolute;inset:0">
  ${bgMedia(p)}
  <div class="shade"></div>
  <div class="hdr"><button class="iconbtn" data-back="chats" aria-label="Back">${ic('back')}</button>
    <div class="hname"><b data-notr>${esc(p.name)}</b><span class="pill glass" id="st"></span></div><button class="iconbtn" data-act="umore" data-uid="${id}" aria-label="More">${ic('more', 2.4)}</button></div>
  <div class="dock"><div class="cta2"><button class="pbtn blue" data-go="chat/${id}">${ic('chat')}Message</button><button class="pbtn glass" data-go="gallery/${id}" id="gal">${ic('grid')}Gallery</button></div></div></div>`;
};
V.u.update = (id) => {
  const st = statusOf(id), s = $('#st'); if (s) s.innerHTML = `<i class="dot ${st.on ? 'on' : ''}"></i>${esc(st.text)}`;
  const g = $('#gal'); const n = (S.posts.get(id) || []).length; if (g) g.innerHTML = `${ic('grid')}Gallery <span class="n">${n}</span>`;
};
V.u.after = (id) => V.u.update(id);

/* Gallery */
V.gallery = async (id) => {
  const mine = id === S.uid; const p = mine ? S.me : S.members.get(id) || (S.extra.get(id)?.is_public ? S.extra.get(id) : null);
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
      <div class="ideas" id="askideas">${chips(ideas)}${ideasPromise ? `<span class="idea muted" id="askwait"><span class="spinner xs dark"></span>${esc(aiName())} is looking at your photo…</span>` : ''}</div>
      <textarea class="field ta" id="askta" maxlength="400" placeholder="Or write your own idea"></textarea>
      <button class="btn" id="askgo" disabled>${ic('spark')}${esc(cta)}</button>
      <button class="btn soft" id="askai">${ic('spark')}Let ${esc(aiName())} decide</button>
      <button class="btn out" id="askno">Cancel</button></div>`;
    const done = (v) => { bg.remove(); res(v); };
    app.appendChild(bg);
    const ta = $('#askta', bg), go2 = $('#askgo', bg), box = $('#askideas', bg);
    const wire = () => box.querySelectorAll('[data-idea]').forEach((b) => (b.onclick = () => { ta.value = b.dataset.idea; go2.disabled = false; }));
    wire();
    // Ready-made ideas show at once; ideas made for this exact photo replace them when they arrive.
    if (ideasPromise) {
      const stopWait = () => $('#askwait', bg)?.remove();
      const t = setTimeout(stopWait, 15000);
      ideasPromise.then((list) => { clearTimeout(t); if (list && list.length && bg.isConnected) { box.innerHTML = chips(list); wire(); } else stopWait(); }).catch(() => { clearTimeout(t); stopWait(); });
    }
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
  if (a === 'sharelink') return shareLink();
  if (a === 'addstory') return addStory();
  if (a === 'story') return openStories(t.dataset.uid);
  if (a === 'addvideo') return addVideoPost().then(() => route().name === 'video' && show());
  if (a === 'copylink') { navigator.clipboard.writeText(myLink()).then(() => toast('Link copied')).catch(() => toast(myLink(), 6000)); return; }
  if (a === 'umore') { const id = t.dataset.uid; return sheet(nameOf(id), [
    { icon: 'flag', label: 'Report', run: () => reportUser(id) },
    { icon: 'x', label: 'Remove from friends', run: () => removeFriend(id) },
    { icon: 'block', label: 'Block', red: true, run: () => blockUser(id) }]); }
  if (a === 'retryai') return go('look');
  if (a === 'hideinstall') { store.set('magaam-install-hide', '1'); $('#install')?.remove(); return; }
  if (a === 'install' && deferredPrompt) { deferredPrompt.prompt(); deferredPrompt.userChoice.finally(() => { deferredPrompt = null; $('#install')?.remove(); }); return; }
  if (a === 'settings') return sheet('Settings', [
    { icon: 'edit', label: 'Edit name and birthday', run: () => go('about') },
    { icon: 'spark', label: 'Change profile photo', run: () => go('look') },
    { icon: 'coin', label: `Balance: ${S.coins} coins`, run: () => go('wallet') },
    { icon: 'edit', label: `Rename ${aiName()}`, run: () => go('assistant') },
    { icon: 'globe', label: `App language: ${I18N.label}`, run: pickUiLang },
    { icon: 'globe', label: `Translation language: ${langLabel(myLang())}`, run: pickLang },
    { icon: 'spark', label: S.me?.away_ai === false ? `${aiName()} answers for me: off` : `${aiName()} answers for me: on`, run: async () => {
      const v = S.me?.away_ai === false; const { data, error } = await sb.from('profiles').update({ away_ai: v }).eq('id', S.uid).select().single();
      if (error) return toast('Could not save. Try again.'); S.me = data; toast(v ? `${aiName()} will answer friends while you are away` : `${aiName()} will not answer for you`); } },
    { icon: 'bell', label: soundOn() ? 'Message sound: on' : 'Message sound: off', run: () => { store.set('magaam-sound', soundOn() ? 'off' : 'on'); unlockAudio(); if (soundOn()) setTimeout(() => chime(false, true), 60); toast(soundOn() ? 'Message sound is on' : 'Message sound is off'); } },
    { icon: S.me?.is_public ? 'globe' : 'lock', label: S.me?.is_public ? 'Profile: open' : 'Profile: closed', run: pickPrivacy },
    { icon: 'useradd', label: 'Add friends', run: () => go('add') },
    { icon: 'share', label: 'Share my friend link', run: shareLink },
    { icon: 'edit', label: `My username: @${S.me?.username || ''}`, notr: false, run: () => go('about') },
    { icon: 'block', label: 'Blocked people', run: blockedList },
    { icon: 'out', label: 'Sign out', red: true, run: async () => { await sb.auth.signOut(); location.hash = '#/welcome'; location.reload(); } }
  ]);
});

/* ---------- interface language ---------- */
new MutationObserver((ms) => { if (I18N.lang === 'en') return; for (const m of ms) { if (m.type === 'characterData') { if (m.target.parentElement) I18N.apply(m.target.parentElement); } else m.addedNodes.forEach((n) => { if (n.nodeType === 1) I18N.apply(n); else if (n.nodeType === 3 && n.parentElement) I18N.apply(n.parentElement); }); } })
  .observe(app, { childList: true, subtree: true, characterData: true });
async function pickPrivacy() {
  const k = await dialog(`<h3 class="dh">Who can see your profile?</h3>`, [
    { k: 'open', icon: 'globe', label: 'Open — everyone sees my gallery and stories', style: S.me?.is_public ? '' : 'out' },
    { k: 'closed', icon: 'lock', label: 'Closed — only friends', style: S.me?.is_public ? 'out' : '' }]);
  if (!k) return;
  const { data, error } = await sb.from('profiles').update({ is_public: k === 'open' }).eq('id', S.uid).select().single();
  if (error) return toast('Could not save. Try again.');
  S.me = data; toast(k === 'open' ? 'Your profile is open' : 'Your profile is closed. Only friends see it');
}
function pickUiLang() {
  sheet('Choose your language', I18N.LANGS.map(([code, label]) => ({ icon: code === I18N.lang ? 'check' : 'globe', label, notr: true, run: async () => {
    I18N.set(code); if (!store.get('magaam-lang')) TR.clear();
    if (S.uid) sb.from('profiles').update({ ui_lang: code }).eq('id', S.uid).then(() => {});
    show();
  } })));
}

/* ---------- boot ---------- */
async function afterAuth() {
  const { data: { session } } = await sb.auth.getSession();
  S.uid = session?.user?.id || null; if (!S.uid) return;
  await loadMe(); await loadAll(); await loadJobs(); await loadWallet(); startRealtime();
}
// Updates arrive by themselves: if a newer version is published, the app reloads into it.
const MY_VER = (document.querySelector('script[src*="app.js?v="]')?.getAttribute('src') || '').split('v=')[1] || '';
async function checkUpdate() {
  try {
    const h = await (await fetch(location.pathname + '?check=' + Date.now(), { cache: 'no-store' })).text();
    const v = (h.match(/app\.js\?v=(\d+)/) || [])[1];
    if (v && MY_VER && v !== MY_VER && sessionStorage.getItem('magaam-upd') !== v) {
      sessionStorage.setItem('magaam-upd', v);
      location.replace(location.pathname + '?v=' + v + location.hash);
    }
  } catch {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkUpdate(); });
setTimeout(checkUpdate, 1500);
(async function boot() {
  app.innerHTML = '<div class="center" style="background:var(--paper)"><div class="spinner"></div></div>';
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  try { await afterAuth(); } catch (e) { console.error(e); }
  if (S.uid && !S.me) { await sb.auth.signOut(); S.uid = null; }
  show();
})();
sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') { S.uid = null; } });
})();
