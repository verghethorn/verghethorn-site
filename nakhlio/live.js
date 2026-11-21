/* Nakhlio live backend (Supabase). Data access only — UI lives in app.js / magaam.js.
   The publishable key is meant to be public; access is enforced by row-level security on the server. */
(function () {
const URL_ = 'https://agabolhotzwytvsbwhmw.supabase.co';
const KEY = 'sb_publishable_0nRVs3oYxFw8merCHgTs0g_a_AXYWLC';
const DEMO = !!window.NAKHLIO_DEMO || /[?&]demo=1/.test(location.search);
if (DEMO || !window.supabase) { window.LIVE = null; return; }
const sb = window.supabase.createClient(URL_, KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'nakhlio_auth' } });
const L = { sb, user: null, profile: null, ready: false, listeners: [] };
const ok = (r) => { if (r.error) throw r.error; return r.data; };

L.init = async () => {
  const { data } = await sb.auth.getSession();
  L.user = data.session ? data.session.user : null;
  if (L.user) L.profile = await L.fetchProfile(L.user.id);
  L.ready = true;
  sb.auth.onAuthStateChange((ev, s) => { L.user = s ? s.user : null; if (!s) L.profile = null; });
  return L.profile;
};
/* Sign-in codes are sent by our own server function (through Brevo). If it is not set up yet, Supabase's built-in email is used. */
const FN = URL_ + '/functions/v1/login-code';
const fn = async (body) => { const r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json', apikey: KEY }, body: JSON.stringify(body) }); let j = {}; try { j = await r.json(); } catch (e) {} return j; };
let builtin = false;
L.sendCode = async (email, lang) => {
  const j = await fn({ action: 'send', email, lang }).catch(() => ({ error: 'not_configured' }));
  if (j.ok) { builtin = false; return true; }
  if (j.error === 'not_configured') { builtin = true; return sb.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }).then(ok); }
  const e = new Error(j.error || 'send_failed'); e.code = j.error; throw e;
};
L.verifyCode = async (email, token) => {
  let r;
  if (!builtin) {
    const j = await fn({ action: 'verify', email, code: token });
    if (!j.token_hash) { const e = new Error(j.error || 'code_bad'); e.code = 'code_bad'; throw e; }
    r = await sb.auth.verifyOtp({ token_hash: j.token_hash, type: 'magiclink' });
  } else {
    r = await sb.auth.verifyOtp({ email, token, type: 'email' });
    if (r.error) r = await sb.auth.verifyOtp({ email, token, type: 'signup' });
  }
  ok(r); L.user = r.data.user; L.profile = await L.fetchProfile(L.user.id); return L.profile;
};
L.fetchProfile = async (id) => ok(await sb.from('profiles').select('*').eq('id', id).maybeSingle());
L.createProfile = async (f) => { L.profile = ok(await sb.from('profiles').insert(Object.assign({ id: L.user.id }, f)).select().single()); return L.profile; };
L.updateProfile = async (f) => { L.profile = ok(await sb.from('profiles').update(f).eq('id', L.user.id).select().single()); return L.profile; };
L.signOut = async () => { await sb.auth.signOut(); L.user = null; L.profile = null; };
L.email = () => (L.user && L.user.email) || '';

const b64ToBlob = (d) => { const [h, b] = d.split(','); const bin = atob(b); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return new Blob([a], { type: (h.match(/data:([^;]+)/) || [])[1] || 'image/jpeg' }); };
L.upload = async (fileOrData, kind) => {
  const blob = typeof fileOrData === 'string' ? b64ToBlob(fileOrData) : fileOrData;
  const ext = ((blob.type.split(';')[0].split('/')[1]) || 'jpg').replace('quicktime', 'mov').replace('jpeg', 'jpg').replace('x-m4a', 'm4a');
  const path = `${L.user.id}/${kind || 'm'}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  ok(await sb.storage.from('media').upload(path, blob, { contentType: blob.type.split(';')[0], upsert: false, cacheControl: '31536000' }));
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
};

/* profiles cache */
const PC = {};
L.prof = async (ids) => { const need = [...new Set(ids.filter(id => id && !PC[id]))]; if (need.length) { const rows = ok(await sb.from('profiles').select('*').in('id', need)); rows.forEach(r => PC[r.id] = r); } return PC; };
L.cached = (id) => PC[id] || null;
L.people = async () => { const rows = ok(await sb.from('profiles').select('*').order('created_at', { ascending: false }).limit(200)); rows.forEach(r => PC[r.id] = r); return rows; };

/* chats */
L.myChats = async () => {
  const me = L.user.id;
  let q = sb.from('chats').select('*').or(`user1.eq.${me},user2.eq.${me},kind.eq.support`).order('last_at', { ascending: false });
  const rows = ok(await q);
  const mine = rows.filter(c => c.user1 === me || c.user2 === me);
  await L.prof(rows.flatMap(c => [c.user1, c.user2]));
  const last = await Promise.all(rows.map(c => sb.from('messages').select('*').eq('chat_id', c.id).order('created_at', { ascending: false }).limit(1).then(r => (r.data || [])[0] || null)));
  rows.forEach((c, i) => c.last = last[i]);
  return { mine, all: rows };
};
L.supportChat = async (topic) => {
  const me = L.user.id; topic = topic || '';
  let c = ok(await sb.from('chats').select('*').eq('kind', 'support').eq('user1', me).eq('topic', topic).maybeSingle());
  if (!c) c = ok(await sb.from('chats').insert({ kind: 'support', user1: me, user2: null, topic }).select().single());
  return c;
};
L.supportChatFor = async (userId) => {
  let c = ok(await sb.from('chats').select('*').eq('kind', 'support').eq('user1', userId).eq('topic', '').maybeSingle());
  if (!c) c = ok(await sb.from('chats').insert({ kind: 'support', user1: userId, user2: null, topic: '' }).select().single());
  return c;
};
L.dmChat = async (other) => {
  const me = L.user.id;
  const rows = ok(await sb.from('chats').select('*').eq('kind', 'dm').or(`and(user1.eq.${me},user2.eq.${other}),and(user1.eq.${other},user2.eq.${me})`));
  if (rows[0]) return rows[0];
  return ok(await sb.from('chats').insert({ kind: 'dm', user1: me, user2: other }).select().single());
};
L.chat = async (id) => ok(await sb.from('chats').select('*').eq('id', id).maybeSingle());
L.messages = async (chatId) => ok(await sb.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true }).limit(500));
L.send = async (chatId, body, lang) => ok(await sb.from('messages').insert({ chat_id: chatId, sender: L.user.id, body, lang }).select().single());
L.deleteMessage = async (id) => ok(await sb.from('messages').delete().eq('id', id));
let chan = null;
L.onMessage = (cb) => { L.listeners.push(cb); if (chan) return; chan = sb.channel('msgs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => L.listeners.forEach(f => { try { f(p.new); } catch (e) {} })).subscribe(); };

/* Magaam: invites, own profile, messenger */
L.inviteInfo = async (code) => { const r = await sb.rpc('invite_info', { code }); return r.error ? null : r.data; };
L.acceptInvite = async (code) => ok(await sb.rpc('accept_invite', { code }));
L.mgPeople = async (q) => { let s = sb.from('profiles').select('*').eq('mg_on', true).eq('banned', false); if (q) { const c = q.replace(/[%_,()@]/g, '').trim(); s = s.or(`mg_name.ilike.%${c}%,name.ilike.%${c}%,mg_handle.ilike.%${c}%` + (/^[a-z0-9]{6,12}$/i.test(c) ? `,invite_code.eq.${c.toLowerCase()}` : '')); } const rows = ok(await s.order('created_at', { ascending: false }).limit(60)); rows.forEach(r => PC[r.id] = r); return rows; };
L.mgInbox = async () => { const rows = ok(await sb.rpc('mg_inbox')); await L.prof(rows.map(r => r.other)); return rows; };
L.mgChat = async (other) => { const me = L.user.id;
  const rows = ok(await sb.from('mg_chats').select('*').or(`and(user1.eq.${me},user2.eq.${other}),and(user1.eq.${other},user2.eq.${me})`));
  if (rows[0]) return rows[0]; return ok(await sb.from('mg_chats').insert({ user1: me, user2: other }).select().single()); };
L.mgUserChats = async (uid) => { const rows = ok(await sb.from('mg_chats').select('*').or(`user1.eq.${uid},user2.eq.${uid}`).order('last_at', { ascending: false }).limit(100)); await L.prof(rows.flatMap(c => [c.user1, c.user2])); return rows; };
L.mgChatById = async (id) => ok(await sb.from('mg_chats').select('*').eq('id', id).maybeSingle());
L.mgMessages = async (chatId) => { const rows = ok(await sb.from('mg_messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: false }).limit(300)); return rows.reverse(); };
L.mgSend = async (chatId, body, lang, media_url, reply_to, media_kind, media_meta, product_id) => ok(await sb.from('mg_messages').insert({ chat_id: chatId, sender: L.user.id, body: body || '', lang: lang || '', media_url: media_url || null, reply_to: reply_to || null, media_kind: media_kind || (media_url ? 'image' : null), media_meta: media_meta || null, product_id: product_id || null }).select().single());
L.explore = async (n) => { const rows = ok(await sb.from('mg_posts').select(POSTSEL).in('type', ['post', 'reel']).eq('hidden', false).order('created_at', { ascending: false }).range(0, (n || 30) - 1)).map(norm); await L.prof(rows.map(r => r.author)); return rows; };
/* verification ("blue check") requests */
L.geoCheck = async (pos) => { const r = await sb.functions.invoke('geo-check', { body: pos || {} }); if (r.error) throw r.error; return r.data; };
L.verifyMine = async () => { const r = await sb.from('verify_requests').select('*').eq('user_id', L.user.id).order('created_at', { ascending: false }).limit(1); return (r.data || [])[0] || null; };
L.verifySubmit = async (blob, app, purpose) => { const path = `${L.user.id}/doc-${Date.now()}.jpg`; ok(await sb.storage.from('verify').upload(path, blob, { contentType: 'image/jpeg', upsert: false }));
  return ok(await sb.from('verify_requests').insert({ user_id: L.user.id, doc_path: path, app: app || 'nakhlio', purpose: purpose || null }).select().single()); };
L.verifyList = async () => { const rows = ok(await sb.from('verify_requests').select('*').eq('status', 'pending').order('created_at').limit(50)); await L.prof(rows.map(r => r.user_id)); return rows; };
L.verifyDoc = async (path) => { const r = await sb.storage.from('verify').createSignedUrl(path, 600); return r.data ? r.data.signedUrl : null; };
L.verifyDecide = async (req, approve, note) => {
  if (approve) await L.setFlag(req.user_id, { verified: true });
  ok(await sb.from('verify_requests').update({ status: approve ? 'approved' : 'rejected', note: note || '', reviewed_by: L.user.id, reviewed_at: new Date().toISOString() }).eq('id', req.id));
  await sb.storage.from('verify').remove([req.doc_path]); };
L.mgDelete = async (id) => ok(await sb.from('mg_messages').update({ deleted: true, body: '', media_url: null }).eq('id', id));
L.mgRead = async (chatId) => sb.from('mg_reads').upsert({ chat_id: chatId, user_id: L.user.id, read_at: new Date().toISOString() });
L.mgOtherRead = async (chatId) => { const r = await sb.from('mg_reads').select('*').eq('chat_id', chatId).neq('user_id', L.user.id).maybeSingle(); return r.data ? r.data.read_at : null; };
let mgchan = null; L.mgListeners = [];
L.onMg = (cb) => { L.mgListeners.push(cb); if (mgchan) return; mgchan = sb.channel('mgmsg')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'mg_messages' }, (p) => L.mgListeners.forEach(f => { try { f('msg', p.new, p.eventType); } catch (e) {} }))
  .on('postgres_changes', { event: '*', schema: 'public', table: 'mg_reads' }, (p) => L.mgListeners.forEach(f => { try { f('read', p.new, p.eventType); } catch (e) {} })).subscribe(); };
L.mgTyping = (chatId, onTyping) => { const ch = sb.channel('mgt:' + chatId, { config: { broadcast: { self: false } } }); ch.on('broadcast', { event: 't' }, (p) => { if (p.payload && p.payload.u !== L.user.id) onTyping(); }).subscribe();
  let last = 0; return { send: () => { if (Date.now() - last < 2500) return; last = Date.now(); ch.send({ type: 'broadcast', event: 't', payload: { u: L.user.id } }); }, leave: () => sb.removeChannel(ch) }; };

/* Magaam marketplace: shops and products */
const clean = (q) => String(q || '').replace(/[%_,()]/g, '').trim();
L.products = async (o) => { o = o || {}; let s = sb.from('mg_products').select('*');
  if (o.seller) s = s.eq('seller', o.seller).neq('status', 'hidden'); else s = s.eq('status', 'active');
  if (o.cat) s = s.eq('cat', o.cat); if (o.sub) s = s.eq('sub', o.sub); if (o.country) s = s.eq('country', o.country); if (o.city) s = s.eq('city', o.city);
  if (o.q) { const q = clean(o.q); s = s.or(`title.ilike.%${q}%,descr.ilike.%${q}%`); }
  const rows = ok(await s.order('created_at', { ascending: false }).limit(o.n || 40)); await L.prof(rows.map(r => r.seller)); return rows; };
L.product = async (id) => { const p = ok(await sb.from('mg_products').select('*').eq('id', id).maybeSingle()); if (p) await L.prof([p.seller]); return p; };
L.addProduct = async (f) => ok(await sb.from('mg_products').insert(Object.assign({ seller: L.user.id }, f)).select().single());
L.updProduct = async (id, f) => ok(await sb.from('mg_products').update(Object.assign({ updated_at: new Date().toISOString() }, f)).eq('id', id).select().single());
L.delProduct = async (id) => ok(await sb.from('mg_products').delete().eq('id', id));
L.shops = async (o) => { o = o || {}; let s = sb.from('profiles').select('*').eq('shop_on', true).eq('banned', false);
  if (o.cat) s = s.eq('shop_cat', o.cat); if (o.sub) s = s.eq('shop_sub', o.sub); if (o.country) s = s.eq('country', o.country); if (o.city) s = s.eq('city', o.city);
  if (o.q) { const q = clean(o.q).replace(/^@/, ''); s = s.or(`shop_name.ilike.%${q}%,mg_handle.ilike.%${q}%,shop_about.ilike.%${q}%`); }
  const rows = ok(await s.order('created_at', { ascending: false }).limit(o.n || 30)); rows.forEach(r => PC[r.id] = r); return rows; };
L.handleFree = async (h) => { const r = await sb.rpc('handle_free', { h }); if (r.error) throw r.error; return !!r.data; };
L.byHandle = async (h) => { const r = await sb.from('profiles').select('*').eq('mg_handle', String(h).toLowerCase().replace(/^@/, '')).maybeSingle(); if (r.data) PC[r.data.id] = r.data; return r.data; };
L.favIds = async () => { const r = await sb.from('mg_favs').select('product_id'); return new Set((r.data || []).map(x => x.product_id)); };
L.favs = async () => { const ids = [...await L.favIds()]; if (!ids.length) return []; const rows = ok(await sb.from('mg_products').select('*').in('id', ids)); await L.prof(rows.map(r => r.seller)); return rows; };
L.fav = async (id, on) => on ? sb.from('mg_favs').upsert({ user_id: L.user.id, product_id: id }) : sb.from('mg_favs').delete().eq('user_id', L.user.id).eq('product_id', id);
L.openShop = async (f) => L.updateProfile(Object.assign({ shop_on: true, mg_on: true }, f));

/* friends & follows */
L.rel = async () => {
  const me = L.user.id;
  const fr = ok(await sb.from('friend_requests').select('*').or(`from_id.eq.${me},to_id.eq.${me}`));
  const fo = ok(await sb.from('follows').select('*').eq('follower', me));
  const friends = new Set(), out = new Set(), inc = [];
  fr.forEach(r => { const o = r.from_id === me ? r.to_id : r.from_id; if (r.status === 'accepted') friends.add(o); else if (r.status === 'pending') { if (r.from_id === me) out.add(o); else inc.push(r); } });
  const ct = await sb.from('mg_contacts').select('contact').eq('owner', me); const contacts = new Set((ct.data || []).map(x => x.contact)); contacts.forEach(c => friends.add(c));
  const bl = await sb.from('mg_blocks').select('blocked').eq('blocker', me); const blocked = new Set((bl.data || []).map(x => x.blocked));
  L.R = { friends, out, inc, contacts, blocked, follow: new Set(fo.map(x => x.followee)) };
  return L.R;
};
L.follow = async (id, on) => { if (on) ok(await sb.from('follows').insert({ follower: L.user.id, followee: id })); else ok(await sb.from('follows').delete().eq('follower', L.user.id).eq('followee', id)); };
L.addContact = async (id) => ok(await sb.from('mg_contacts').upsert({ owner: L.user.id, contact: id }));
L.removeContact = async (id) => ok(await sb.from('mg_contacts').delete().eq('owner', L.user.id).eq('contact', id));
L.block = async (id, on) => on ? ok(await sb.from('mg_blocks').upsert({ blocker: L.user.id, blocked: id })) : ok(await sb.from('mg_blocks').delete().eq('blocker', L.user.id).eq('blocked', id));
L.friendRequest = async (id) => ok(await sb.from('friend_requests').insert({ from_id: L.user.id, to_id: id }));
L.answerRequest = async (reqId, accept) => ok(await sb.from('friend_requests').update({ status: accept ? 'accepted' : 'declined' }).eq('id', reqId));
L.counts = async (id) => {
  const c = (q) => q.then(r => r.count || 0);
  const [posts, followers, following] = await Promise.all([
    c(sb.from('mg_posts').select('id', { count: 'exact', head: true }).eq('author', id).eq('type', 'post')),
    c(sb.from('follows').select('follower', { count: 'exact', head: true }).eq('followee', id)),
    c(sb.from('follows').select('followee', { count: 'exact', head: true }).eq('follower', id))]);
  return [posts, followers, following];
};

/* Magaam */
const POSTSEL = '*, mg_likes(user_id), mg_comments(count)';
const norm = (p) => { const me = L.user && L.user.id; return Object.assign(p, { likes: (p.mg_likes || []).length, liked: (p.mg_likes || []).some(x => x.user_id === me), ncm: ((p.mg_comments || [])[0] || {}).count || 0 }); };
L.posts = async (type, author) => {
  let q = sb.from('mg_posts').select(POSTSEL); q = type === 'grid' ? q.in('type', ['post', 'reel']) : q.eq('type', type || 'post'); q = q.order('created_at', { ascending: false }).limit(60);
  if (author) q = q.eq('author', author);
  if (type === 'story') q = q.gte('created_at', new Date(Date.now() - 864e5).toISOString());
  const rows = ok(await q).map(norm); await L.prof(rows.map(r => r.author)); return rows;
};
L.post = async (id) => { const p = ok(await sb.from('mg_posts').select(POSTSEL).eq('id', id).maybeSingle()); if (!p) return null; norm(p);
  p.comments = ok(await sb.from('mg_comments').select('*').eq('post_id', id).order('created_at')); await L.prof([p.author].concat(p.comments.map(c => c.author))); return p; };
L.createPost = async (f) => ok(await sb.from('mg_posts').insert(Object.assign({ author: L.user.id }, f)).select().single());
L.like = async (id, on) => { if (on) await sb.from('mg_likes').insert({ post_id: id, user_id: L.user.id }); else await sb.from('mg_likes').delete().eq('post_id', id).eq('user_id', L.user.id); };
L.comment = async (id, body, lang) => ok(await sb.from('mg_comments').insert({ post_id: id, author: L.user.id, body, lang }).select().single());
L.report = async (type, id, reason, extra) => ok(await sb.from('reports').insert(Object.assign({ reporter: L.user.id, target_type: type, target_id: String(id), reason: reason || '' }, extra || {})));

/* admin */
L.reports = async () => { const rows = ok(await sb.from('reports').select('*').order('status', { ascending: false }).order('created_at', { ascending: false }).limit(100)); await L.prof(rows.map(r => r.reporter).concat(rows.map(r => r.target_author), rows.filter(r => r.target_type === 'user').map(r => r.target_id))); return rows; };
L.stats = async () => ok(await sb.rpc('admin_stats'));
L.searchUsers = async (q, f, n) => { let s = sb.from('profiles').select('*', { count: 'exact' });
  if (q) s = s.ilike('name', '%' + q.replace(/[%_]/g, '') + '%');
  if (f === 'admins') s = s.eq('is_admin', true); else if (f === 'banned') s = s.eq('banned', true); else if (f === 'verified') s = s.eq('verified', true);
  const r = await s.order('created_at', { ascending: false }).range(0, (n || 50) - 1); if (r.error) throw r.error; r.data.forEach(p => PC[p.id] = p); return { rows: r.data, count: r.count || 0 }; };
L.userDms = async (uid) => { const rows = ok(await sb.from('chats').select('*').eq('kind', 'dm').or(`user1.eq.${uid},user2.eq.${uid}`).order('last_at', { ascending: false }).limit(100)); await L.prof(rows.flatMap(c => [c.user1, c.user2]));
  const last = await Promise.all(rows.map(c => sb.from('messages').select('*').eq('chat_id', c.id).order('created_at', { ascending: false }).limit(1).then(r => (r.data || [])[0] || null))); rows.forEach((c, i) => c.last = last[i]); return rows; };
L.closeReport = async (id) => ok(await sb.from('reports').update({ status: 'done' }).eq('id', id));
L.hidePost = async (id, hidden) => ok(await sb.from('mg_posts').update({ hidden }).eq('id', id));
L.deletePost = async (id) => ok(await sb.from('mg_posts').delete().eq('id', id));
L.deleteComment = async (id) => ok(await sb.from('mg_comments').delete().eq('id', id));
L.setFlag = async (uid, f) => { const r = ok(await sb.from('profiles').update(f).eq('id', uid).select().single()); PC[uid] = r; return r; };
L.warn = async (uid, text, lang) => { const c = await L.supportChatFor(uid); return L.send(c.id, text, lang); };

/* translation (MyMemory, free) */
const TC = (() => { try { return JSON.parse(localStorage.getItem('nakhlio_tr') || '{}'); } catch (e) { return {}; } })();
L.translate = async (text, from, to) => {
  if (!text || !from || !to || from === to) return null;
  const k = from + '|' + to + '|' + text; if (TC[k]) return TC[k];
  try { const r = await fetch(URL_ + '/functions/v1/translate', { method: 'POST', headers: { 'content-type': 'application/json', apikey: KEY }, body: JSON.stringify({ text, from, to }) });
    const j = await r.json(); if (j && j.text) { TC[k] = j.text; try { localStorage.setItem('nakhlio_tr', JSON.stringify(TC)); } catch (e) {} return j.text; } } catch (e) {}
  try {
    const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.slice(0, 480)) + '&langpair=' + from + '|' + to);
    const j = await r.json(); const out = j && j.responseData && j.responseData.translatedText;
    if (out && j.responseStatus === 200) { TC[k] = out; try { localStorage.setItem('nakhlio_tr', JSON.stringify(TC)); } catch (e) {} return out; }
  } catch (e) {}
  return null;
};

/* community: Majlis/family, classifieds, parcels, rooms, events */
L.byName = (n) => Object.values(PC).find(p => p.name === n) || null;
L.forum = async () => { const rows = ok(await sb.from('forum_posts').select('*').order('created_at', { ascending: false }).limit(500)); await L.prof(rows.map(r => r.author)); return rows; };
L.forumPost = async (topic, kind, body, lang) => ok(await sb.from('forum_posts').insert({ author: L.user.id, topic, kind, body, lang }).select().single());
L.items = async () => { const rows = ok(await sb.from('items').select('*').order('created_at', { ascending: false }).limit(300)); await L.prof(rows.map(r => r.author)); return rows; };
L.addItem = async (f) => ok(await sb.from('items').insert(Object.assign({ author: L.user.id }, f)).select().single());
L.delItem = async (id) => ok(await sb.from('items').delete().eq('id', id));
L.delForum = async (id) => ok(await sb.from('forum_posts').delete().eq('id', id));
L.comments = async (prefix) => { const rows = ok(await sb.from('comments').select('*').like('target', prefix + '%').order('created_at').limit(2000)); await L.prof(rows.map(r => r.author)); return rows; };
L.addComment = async (target, body, lang, to_name, as_admin) => ok(await sb.from('comments').insert({ target, author: L.user.id, body, lang, to_name: to_name || '', as_admin: !!as_admin }).select().single());
L.delComment2 = async (id) => ok(await sb.from('comments').delete().eq('id', id));
L.helpful = async () => ok(await sb.from('helpful').select('*').limit(5000));
L.setHelpful = async (target, on) => { if (on) await sb.from('helpful').insert({ target, user_id: L.user.id }); else await sb.from('helpful').delete().eq('target', target).eq('user_id', L.user.id); };
L.roomMsgs = async (space) => { const rows = ok(await sb.from('room_messages').select('*').like('room', space + ':%').order('created_at').limit(2000)); await L.prof(rows.map(r => r.author)); return rows; };
L.roomSend = async (room, body, lang, to_name, as_admin) => ok(await sb.from('room_messages').insert({ room, author: L.user.id, body, lang, to_name: to_name || '', as_admin: !!as_admin }).select().single());
L.delRoomMsg = async (id) => ok(await sb.from('room_messages').delete().eq('id', id));
L.events = async () => { const rows = ok(await sb.from('events').select('*, event_going(user_id)').order('created_at', { ascending: false }).limit(200)); await L.prof(rows.map(r => r.author)); return rows; };
L.addEvent = async (f) => ok(await sb.from('events').insert(Object.assign({ author: L.user.id }, f)).select().single());
L.delEvent = async (id) => ok(await sb.from('events').delete().eq('id', id));
L.going = async (id, on) => { if (on) await sb.from('event_going').insert({ event_id: id, user_id: L.user.id }); else await sb.from('event_going').delete().eq('event_id', id).eq('user_id', L.user.id); };
L.itemChat = async (itemId, other) => {
  const me = L.user.id;
  const rows = ok(await sb.from('chats').select('*').eq('kind', 'dm').or(`and(user1.eq.${me},user2.eq.${other}),and(user1.eq.${other},user2.eq.${me})`));
  if (rows[0]) return rows[0];
  return ok(await sb.from('chats').insert({ kind: 'dm', user1: me, user2: other, topic: 'item:' + itemId }).select().single());
};
let rchan = null; L.roomListeners = [];
L.onRoom = (cb) => { L.roomListeners.push(cb); if (rchan) return; rchan = sb.channel('rooms').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'room_messages' }, (p) => L.roomListeners.forEach(f => { try { f(p.new); } catch (e) {} })).subscribe(); };

window.LIVE = L;
})();
