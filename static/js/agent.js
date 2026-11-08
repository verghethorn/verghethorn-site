// Live VERGHÉTHORN agent (ElevenLabs): voice call or text chat, right inside the phone.
import { sfx } from './sfx.js';

const $ = (s, r = document) => r.querySelector(s);
const phone = $('[data-chat]');
const cfg = JSON.parse($('#agent-cfg').textContent);
const log = $('[data-agent-log]', phone), status = $('[data-agent-status]', phone);
const form = $('[data-agent-form]', phone), input = $('[data-agent-input]', phone);
const mic = $('.ph-mic', phone), callBtns = document.querySelectorAll('[data-agent-call]');
let userEnded = false, offShown = false;
let sdk, conv = null, mode = null, starting = false, cleared = false, pending = null, gotReply = false;

const clean = s => s.replace(/<\/?[A-Za-z][\w-]*>/g, '').replace(/\[[^\]]{1,24}\]/g, '').replace(/\s{2,}/g, ' ').trim();
const setStatus = (t, busy = false) => { status.textContent = t; status.classList.toggle('busy', busy); };
const scroll = () => { log.scrollTop = log.scrollHeight; };
const clearDemo = () => { if (cleared) return; cleared = true; log.innerHTML = ''; phone.classList.add('on-air', 'play'); };
const add = (who, text) => {
  text = clean(text); if (!text) return;
  $('.typing', log)?.remove();
  const li = document.createElement('li'); li.className = `m ${who}`; li.textContent = text; log.append(li); scroll();
};
const typing = on => { $('.typing', log)?.remove(); if (on) { const li = document.createElement('li'); li.className = 'm a typing'; li.setAttribute('aria-hidden', 'true'); li.innerHTML = '<i></i><i></i><i></i>'; log.append(li); scroll(); } };

const loadSdk = () => sdk ? Promise.resolve(sdk) : new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = cfg.sdk; s.onload = () => { sdk = window.ElevenLabsClient; res(sdk); }; s.onerror = rej; document.head.append(s);
});

const paintCall = () => {
  const on = mode === 'voice';
  phone.classList.toggle('calling', on);
  mic.setAttribute('aria-label', on ? mic.dataset.off : mic.dataset.on);
};

const end = async () => { const c = conv; conv = null; mode = null; paintCall(); phone.classList.remove('speaking'); try { await c?.endSession(); } catch {} };

const offline = () => {
  if (offShown || userEnded) return; offShown = true;
  // credits finished or service down: ask for an email instead (the next tap simply tries again)
  $('.typing', log)?.remove();
  const li = document.createElement('li'); li.className = 'm a';
  li.append(cfg.t.busy + ' ');
  const a = document.createElement('a'); a.href = `mailto:${cfg.mail}`; a.textContent = cfg.mail; li.append(a);
  log.append(li); scroll(); setStatus(cfg.t.online);
};
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(Object.assign(new Error('timeout'), { name: 'Timeout' })), ms))]);

async function start(kind, firstText) {
  if (starting) return; starting = true; gotReply = false; userEnded = false; offShown = false;
  clearDemo(); setStatus(cfg.t.connecting, true);
  if (kind === 'voice' && !firstText) add('a', cfg.t.hello);
  typing(true);
  let session = null;
  try {
    const { Conversation } = await loadSdk();
    if (kind === 'voice') await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop()));
    session = Conversation.startSession({
      agentId: cfg.id,
      connectionType: kind === 'voice' ? 'webrtc' : 'websocket',
      textOnly: kind === 'text',
      overrides: { ...(kind === 'text' ? { conversation: { textOnly: true } } : {}), ...(cfg.lang && cfg.lang !== 'en' ? { agent: { language: cfg.lang, ...(cfg.first ? { firstMessage: cfg.first } : {}) } } : {}) },
      onConnect: () => { setStatus(kind === 'voice' ? cfg.t.listening : cfg.t.online); pending = firstText || null; },
      onMessage: m => { const who = (m.role || m.source) === 'user' ? 'u' : 'a'; if (kind === 'text' && who === 'u') return; add(who, m.message); if (who === 'a') { gotReply = true; sfx('pop'); if (pending) { const t = pending; pending = null; setTimeout(() => { conv?.sendUserMessage(t); typing(true); }, 300); } } },
      onModeChange: ({ mode: md }) => { if (kind !== 'voice') return; const sp = md === 'speaking'; phone.classList.toggle('speaking', sp); setStatus(sp ? cfg.t.speaking : cfg.t.listening); },
      onDisconnect: () => { if (mode) { mode = null; conv = null; } paintCall(); phone.classList.remove('speaking'); setStatus(cfg.t.online); typing(false); if (!gotReply) offline(); },
      onError: (msg, ctx) => { console.warn('agent error', msg, ctx); if (!gotReply) { end(); offline(); } },
    });
    conv = await withTimeout(session, 12000);
    mode = kind; paintCall();
    // connected but the greeting never comes → treat as unavailable
    setTimeout(() => { if (conv && !gotReply && !firstText) { end(); offline(); } }, 9000);
  } catch (e) {
    console.warn('agent start failed', e && (e.message || e));
    if (session) session.then(c => c.endSession()).catch(() => {});
    typing(false); conv = null; mode = null; paintCall(); phone.classList.remove('speaking');
    if (e && (e.name === 'NotAllowedError' || e.name === 'NotFoundError')) { add('a', cfg.t.mic); setStatus(cfg.t.online); }
    else offline();
  } finally { starting = false; }
}

callBtns.forEach(b => b.addEventListener('click', async () => {
  sfx('tick');
  if (b !== mic) phone.scrollIntoView({ behavior: 'smooth', block: 'center' });
  if (mode === 'voice') { userEnded = true; await end(); setStatus(cfg.t.ended); return; }
  if (mode === 'text') await end();
  start('voice');
}));

input.addEventListener('input', () => form.classList.toggle('has', input.value.trim().length > 0));
form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim(); if (!text) return;
  input.value = ''; form.classList.remove('has'); sfx('tick');
  clearDemo(); add('u', text);
  if (conv) { conv.sendUserMessage(text); if (mode === 'text') typing(true); }
  else start('text', text);
});
addEventListener('pagehide', () => { end(); });
