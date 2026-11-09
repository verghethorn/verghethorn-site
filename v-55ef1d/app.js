import * as A from './avatar.js?v=8';
// VERGHE — personal assistant: tap to summon, talk, dismiss.
const AGENT = 'agent_0301m6ye45t5fks83a75m7ayq0e6';
const $ = s => document.querySelector(s);
const B = document.body, statusEl = $('[data-status]'), cap = $('[data-cap]'), note = $('[data-note]');
const T = { idle: 'Без голоса', connecting: 'Подключаюсь', listening: 'Слушаю', speaking: 'Говорит', muted: 'Микрофон выключен', offline: 'Я здесь, но пока без голоса: на ElevenLabs закончились кредиты. Пополни баланс — и я заговорю.', mic: 'Нужен доступ к микрофону. Разреши его в настройках браузера и позови снова.' };

let conv = null, starting = false, speaking = false, muted = false, gotReply = false, raf = 0, lock = null, ac = null;
const setState = s => { B.classList.remove('connecting', 'listening', 'speaking'); if (s) B.classList.add(s); A.setMode(s); statusEl.textContent = s === 'listening' && muted ? T.muted : (T[s] || ''); };
const say = (text, you = false) => { cap.textContent = text; cap.classList.toggle('you', you); cap.scrollTop = 0; };
const showNote = t => { note.textContent = t; note.classList.add('show'); };

/* small synthesized sounds: power on / off */
function tone(up) {
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), t = ac.currentTime;
    o.type = 'sawtooth'; f.type = 'lowpass'; f.frequency.value = 900;
    o.frequency.setValueAtTime(up ? 70 : 220, t); o.frequency.exponentialRampToValueAtTime(up ? 220 : 55, t + .9);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.08, t + .15); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
    o.connect(f).connect(g).connect(ac.destination); o.start(t); o.stop(t + 1.2);
  } catch {}
}

/* the visor follows the voice */
function loop() {
  raf = requestAnimationFrame(loop);
  let v = 0; if (conv && speaking) { try { v = conv.getOutputVolume() || 0; } catch {} }
  A.setVoice(v);
}

async function summon() {
  raf = raf || requestAnimationFrame(loop);
  if (starting || conv) return; starting = true; gotReply = false; note.classList.remove('show');
  tone(true); B.classList.add('on'); A.appear(); setState('connecting'); say('');
  try { lock = await navigator.wakeLock?.request('screen'); } catch {}
  try { await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop())); }
  catch { starting = false; stay(T.mic); return; }
  try {
    const { Conversation } = window.ElevenLabsClient;
    conv = await Promise.race([
      Conversation.startSession({
        agentId: AGENT, connectionType: 'websocket',
        clientTools: { open_link: ({ url, label }) => { showLink(url, label); return 'shown on screen'; } },
        onConnect: () => setState('listening'),
        onMessage: m => { const you = (m.role || m.source) === 'user'; if (!you) gotReply = true; say(m.message, you); },
        onModeChange: ({ mode }) => { speaking = mode === 'speaking'; setState(speaking ? 'speaking' : 'listening'); },
        onDisconnect: () => { if (!B.classList.contains('on')) return; conv = null; speaking = false; if (!gotReply) stay(T.offline); else finish(true); },
        onError: (e, c) => { console.warn('agent error', e, c); if (!gotReply && B.classList.contains('on')) stay(T.offline); },
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 9000)),
    ]);
    raf = raf || requestAnimationFrame(loop);
    setTimeout(async () => { if (conv && !gotReply) { const c = conv; conv = null; try { await c.endSession(); } catch {} stay(T.offline); } }, 7000);
  } catch (e) { console.warn(e); conv = null; stay(T.offline); }
  finally { starting = false; }
}

/* links the agent opens (flights, hotels, documents): a tappable card, since phones block pop-ups */
function showLink(url, label) {
  if (!/^https:\/\//.test(url || '')) return;
  const a = $('[data-link]'); a.href = url; a.querySelector('span').textContent = label || url; a.hidden = false;
  try { window.open(url, '_blank', 'noopener'); } catch {}
}

/* no voice (no credits / no mic): he still appears and stays until you send him away */
function stay(text) { conv = null; speaking = false; setState('idle'); say(text); }

function finish(sound = true) {
  const was = B.classList.contains('on');
  conv = null; speaking = false; muted = false; paintMute();
  setState(null); B.classList.remove('on'); A.vanish(); say('');
  $('[data-link]').hidden = true; $('[data-type]').classList.remove('open'); $('[data-kbd]').setAttribute('aria-pressed', 'false');
  try { lock?.release(); } catch {} lock = null;
  if (was && sound) tone(false);
}
async function dismiss() { const c = conv; finish(true); try { await c?.endSession(); } catch {} }

const paintMute = () => { const b = $('[data-mute]'); b.setAttribute('aria-pressed', String(muted)); b.setAttribute('aria-label', muted ? 'Включить микрофон' : 'Выключить микрофон'); };
$('[data-mute]').addEventListener('click', () => { if (!conv) return; muted = !muted; try { conv.setMicMuted(muted); } catch {} paintMute(); setState(speaking ? 'speaking' : 'listening'); });
$('[data-kbd]').addEventListener('click', e => { const f = $('[data-type]'), on = !f.classList.contains('open'); f.classList.toggle('open', on); e.currentTarget.setAttribute('aria-pressed', String(on)); if (on) $('[data-input]').focus(); });
$('[data-type]').addEventListener('submit', e => { e.preventDefault(); const i = $('[data-input]'), t = i.value.trim(); if (!t || !conv) return; conv.sendUserMessage(t); say(t, true); i.value = ''; });
$('[data-summon]').addEventListener('click', summon);
$('[data-end]').addEventListener('click', dismiss);
document.addEventListener('visibilitychange', async () => { if (document.visibilityState === 'visible' && conv && !lock) { try { lock = await navigator.wakeLock?.request('screen'); } catch {} } });

window.__A = A;
A.init(document.querySelector('[data-scene]'), () => B.classList.add('ready'));

/* opened from the home-screen icon → summon straight away */
if (new URLSearchParams(location.search).has('go')) addEventListener('load', () => setTimeout(summon, 300), { once: true });
