// VERGHE — personal assistant: tap to summon, talk, dismiss.
const AGENT = 'agent_0301m6ye45t5fks83a75m7ayq0e6';
const $ = s => document.querySelector(s);
const B = document.body, visor = $('[data-visor]'), statusEl = $('[data-status]'), cap = $('[data-cap]'), note = $('[data-note]');
const T = { connecting: 'Подключаюсь', listening: 'Слушаю', speaking: 'Говорит', muted: 'Микрофон выключен', offline: 'Голос сейчас недоступен. Скорее всего, на ElevenLabs закончились кредиты — пополни баланс, и я снова заговорю.', mic: 'Нужен доступ к микрофону. Разреши его в настройках браузера и позови снова.' };

let conv = null, starting = false, speaking = false, muted = false, gotReply = false, raf = 0, lock = null, ac = null;
const setState = s => { B.classList.remove('connecting', 'listening', 'speaking'); if (s) B.classList.add(s); statusEl.textContent = s === 'listening' && muted ? T.muted : (T[s] || ''); };
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
  if (!conv || !speaking) { visor.style.opacity = ''; visor.style.filter = ''; return; }
  let v = 0; try { v = conv.getOutputVolume() || 0; } catch {}
  const k = Math.min(1, v * 2.2);
  visor.style.opacity = (.5 + k * .5).toFixed(3);
  visor.style.filter = `brightness(${(1 + k * .9).toFixed(2)})`;
}

async function summon() {
  if (starting || conv) return; starting = true; gotReply = false; note.classList.remove('show');
  tone(true); B.classList.add('on'); setState('connecting'); say('');
  try { lock = await navigator.wakeLock?.request('screen'); } catch {}
  try { await navigator.mediaDevices.getUserMedia({ audio: true }).then(s => s.getTracks().forEach(t => t.stop())); }
  catch { starting = false; setState(null); showNote(T.mic); return; }
  try {
    const { Conversation } = window.ElevenLabsClient;
    conv = await Promise.race([
      Conversation.startSession({
        agentId: AGENT, connectionType: 'webrtc',
        onConnect: () => setState('listening'),
        onMessage: m => { const you = (m.role || m.source) === 'user'; if (!you) gotReply = true; say(m.message, you); },
        onModeChange: ({ mode }) => { speaking = mode === 'speaking'; setState(speaking ? 'speaking' : 'listening'); },
        onDisconnect: () => finish(false),
        onError: (e, c) => console.warn('agent error', e, c),
      }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 14000)),
    ]);
    raf = raf || requestAnimationFrame(loop);
    setTimeout(() => { if (conv && !gotReply) { dismiss(); showNote(T.offline); } }, 10000);
  } catch (e) { console.warn(e); conv = null; finish(false); showNote(T.offline); }
  finally { starting = false; }
}

function finish(sound = true) {
  const was = B.classList.contains('on');
  conv = null; speaking = false; muted = false; paintMute();
  setState(null); B.classList.remove('on'); say('');
  $('[data-type]').classList.remove('open'); $('[data-kbd]').setAttribute('aria-pressed', 'false');
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

/* opened from the home-screen icon → summon straight away */
if (new URLSearchParams(location.search).has('go')) addEventListener('load', () => setTimeout(summon, 300), { once: true });
