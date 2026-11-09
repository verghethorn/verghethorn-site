// VERGHE personal assistant — tool bridge (Supabase Edge Function "verghe-tools").
// Called by ElevenLabs webhook tools. Cost rules: deterministic code/APIs first, LLM never called here,
// short answers only, TTL cache for public data, per-call log, simple rate limit.
import postgres from 'npm:postgres@3.4.5';

const ZAPIER = 'https://mcp.zapier.com/api/v1/connect';
import { ZTOKEN, KEY, ANAM, XI } from './secrets.ts'; // not in the public repo
const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { prepare: false, max: 2 });
const TZ = 'Europe/Istanbul';

/* ---------- helpers ---------- */
async function zap(name: string, args: Record<string, unknown>) {
  const r = await fetch(ZAPIER, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ZTOKEN}`, 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: Date.now(), method: 'tools/call', params: { name, arguments: args } }),
  });
  const t = await r.text();
  const line = t.split('\n').find(l => l.startsWith('data: '));
  const j = JSON.parse(line ? line.slice(6) : t);
  const text = j?.result?.content?.[0]?.text ?? JSON.stringify(j.error ?? j);
  if (j.error || /validation error|^error/i.test(text)) return { error: text.slice(0, 300) }; // surface failures, never pretend success
  try { const o = JSON.parse(text); delete o.billingTasksUsed; return o; } catch { return { result: text }; }
}
const list = (to: unknown) => to == null || to === '' ? undefined : (Array.isArray(to) ? to : String(to).split(',').map(s => s.trim()).filter(Boolean));
async function cached<T>(key: string, ttlMin: number, fn: () => Promise<T>): Promise<[T, boolean]> {
  const hit = await sql`select value from verghe.cache where key = ${key} and expires_at > now()`;
  if (hit.length) return [hit[0].value as T, true];
  const v = await fn();
  if (Array.isArray(v) ? v.length === 0 : (v as any)?.error) return [v, false]; // never cache empty or failed results
  await sql`insert into verghe.cache (key, value, expires_at) values (${key}, ${sql.json(v as any)}, now() + ${ttlMin + ' minutes'}::interval)
            on conflict (key) do update set value = excluded.value, expires_at = excluded.expires_at`;
  return [v, false];
}
const j = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json' } });
const today = (offsetDays = 0) => { const d = new Date(Date.now() + offsetDays * 864e5); return d.toLocaleDateString('en-CA', { timeZone: TZ }); };
const strip = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

/* ---------- weather (Open-Meteo, free) ---------- */
const WMO: Record<number, string> = { 0: 'clear', 1: 'mostly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'fog', 48: 'fog', 51: 'light drizzle', 53: 'drizzle', 55: 'heavy drizzle', 61: 'light rain', 63: 'rain', 65: 'heavy rain', 66: 'freezing rain', 67: 'freezing rain', 71: 'light snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains', 80: 'showers', 81: 'showers', 82: 'violent showers', 85: 'snow showers', 86: 'snow showers', 95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'thunderstorm with hail' };
async function weather(place = 'Istanbul', days = 3) {
  const [v, hit] = await cached(`wx:${place.toLowerCase()}:${days}`, 20, async () => {
    const g = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=${encodeURIComponent(place)}`)).json();
    const p = g.results?.[0]; if (!p) return { error: `place not found: ${place}` };
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&timezone=auto&forecast_days=${Math.min(7, days)}` +
      '&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,uv_index' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,snowfall_sum,wind_speed_10m_max,uv_index_max,sunrise,sunset';
    const w = await (await fetch(u)).json(), c = w.current, d = w.daily;
    return {
      place: `${p.name}, ${p.country}`, local_time: c.time,
      now: { temp_c: c.temperature_2m, feels_like_c: c.apparent_temperature, humidity_pct: c.relative_humidity_2m, sky: WMO[c.weather_code] ?? c.weather_code, wind_kmh: c.wind_speed_10m, uv: c.uv_index },
      days: d.time.map((t: string, i: number) => ({ date: t, sky: WMO[d.weather_code[i]] ?? d.weather_code[i], min_c: d.temperature_2m_min[i], max_c: d.temperature_2m_max[i], rain_chance_pct: d.precipitation_probability_max[i], rain_mm: d.precipitation_sum[i], snow_cm: d.snowfall_sum[i], wind_max_kmh: d.wind_speed_10m_max[i], uv_max: d.uv_index_max[i], sunrise: d.sunrise[i]?.slice(11), sunset: d.sunset[i]?.slice(11) })),
    };
  });
  return { ...v as object, ...(hit ? { _cached: true } : {}) };
}

/* ---------- currency (open.er-api.com, free) ---------- */
async function rates(base: string) {
  const [v] = await cached(`fx:${base}`, 360, async () => { const r = await (await fetch(`https://open.er-api.com/v6/latest/${base}`)).json(); return { rates: r.rates, updated: r.time_last_update_utc }; });
  return v as { rates: Record<string, number>; updated: string };
}
async function convert(amount: number, from: string, to: string) {
  from = from.toUpperCase(); to = to.toUpperCase();
  const r = await rates(from); const k = r.rates?.[to];
  if (!k) return { error: `unknown currency ${from}/${to}` };
  return { amount, from, to, result: Math.round(amount * k * 100) / 100, rate: k, updated: r.updated };
}

/* ---------- news (Google News RSS, free) ---------- */
async function news(topic = 'AI advertising', lang = 'en', n = 5) {
  const [v] = await cached(`news:${lang}:${topic.toLowerCase()}`, 60, async () => {
    const loc = lang === 'ru' ? 'hl=ru&gl=RU&ceid=RU:ru' : 'hl=en-US&gl=US&ceid=US:en';
    const x = await (await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(topic + ' when:2d')}&${loc}`)).text();
    return [...x.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8).map(m => ({ title: strip(m[1].match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''), source: strip(m[1].match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? ''), date: m[1].match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] }));
  });
  return { topic, items: (v as any[]).slice(0, n) };
}

/* ---------- mail / calendar shortcuts ---------- */
const findEmails = (query: string) => zap('gmail_find_email', { query, output_hint: 'max 6 emails. For each: message_id, thread_id, from (name and address), subject, date, one-line snippet. Nothing else.' });
const findEvents = (start: string, end: string, search?: string) => zap('google_calendar_find_events', { calendarid: 'primary', start_time: start, end_time: end, search_term: search || undefined, output_hint: 'For each event: event id, title, start, end, location. Nothing else.' });
const addEvent = (text: string) => zap('google_calendar_quick_add_event', { calendarid: 'primary', text, output_hint: 'Only: title, start, end, event id.' });

/* ---------- travel links (no paid API: opens the best search pages with his dates) ---------- */
function travelLinks(a: any) {
  const out: Record<string, string> = {};
  if (a.from && a.to && a.depart) {
    const q = `Flights from ${a.from} to ${a.to} on ${a.depart}${a.return ? ' returning ' + a.return : ' one way'}${a.passengers ? ' ' + a.passengers + ' adults' : ''}`;
    out.google_flights = `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`;
    out.skyscanner = `https://www.skyscanner.net/transport/flights/${encodeURIComponent(a.from_code ?? a.from)}/${encodeURIComponent(a.to_code ?? a.to)}/${a.depart.replaceAll('-', '').slice(2)}/${a.return ? a.return.replaceAll('-', '').slice(2) + '/' : ''}`;
  }
  if (a.city && a.checkin && a.checkout) {
    out.booking = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(a.city)}&checkin=${a.checkin}&checkout=${a.checkout}&group_adults=${a.guests ?? 1}&order=review_score_and_price`;
    out.google_hotels = `https://www.google.com/travel/hotels?q=${encodeURIComponent(`hotels in ${a.city} ${a.checkin} to ${a.checkout}`)}`;
  }
  return Object.keys(out).length ? out : { error: 'need from/to/depart for flights or city/checkin/checkout for hotels' };
}

/* ---------- memory helpers ---------- */
const KINDS = ['profile', 'preference', 'style', 'project', 'decision', 'episode', 'rule', 'state', 'fact'];
async function city() {
  const r = await sql`select note from verghe.memories where kind = 'state' and topic = 'location' and (expires_at is null or expires_at > now()) order by created_at desc limit 1`;
  return r[0]?.note || 'Istanbul';
}
async function context() {
  const rows = await sql`select kind, note from verghe.memories where (expires_at is null or expires_at > now())
                         and kind in ('core','profile','preference','style','rule','project','state') and coalesce(topic, '') <> 'location' order by kind, updated_at desc`;
  const by: Record<string, string[]> = {};
  for (const r of rows) (by[r.kind] ??= []).length < 12 && by[r.kind].push(r.note);
  return { location: await city(), ...by };
}
/* signed one-tap links in the weekly email ("delete this memory") */
async function sign(id: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const b = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode('forget:' + id)));
  return [...b.slice(0, 12)].map(x => x.toString(16).padStart(2, '0')).join('');
}
const SELF = 'https://vgotvplikubsncujcxmk.supabase.co/functions/v1/verghe-tools';
const OWNER = 'verghethorn@gmail.com';
const mail = (subject: string, body: string) => zap('gmail_send_email', { to: [OWNER], subject, body, output_hint: 'Only: sent true/false.' });

/* ---------- proactive: morning note, only when there is something worth saying ---------- */
async function morning(dry = false) {
  const place = await city();
  const s = `${today()}T00:00:00+03:00`, e = `${today(1)}T00:00:00+03:00`;
  const [wx, ev, due, leads] = await Promise.allSettled([
    weather(place, 1), findEvents(s, e),
    sql`select contact, subject from verghe.followups where status = 'open' and due_at < now() + interval '1 day'`,
    findEmails('subject:"New request" newer_than:1d'),
  ]);
  const lines: string[] = [];
  const w: any = wx.status === 'fulfilled' ? wx.value : null, d = w?.days?.[0];
  if (d) {
    const alerts = [];
    if (d.rain_chance_pct >= 60) alerts.push(`дождь ${d.rain_chance_pct}% — возьми зонт`);
    if (d.snow_cm > 0) alerts.push(`снег ${d.snow_cm} см`);
    if (d.max_c >= 35) alerts.push(`жара до ${d.max_c}°`);
    if (d.min_c <= 0) alerts.push(`мороз до ${d.min_c}°`);
    if (d.uv_max >= 8) alerts.push(`сильное солнце (UV ${d.uv_max})`);
    if (d.wind_max_kmh >= 50) alerts.push(`сильный ветер ${d.wind_max_kmh} км/ч`);
    if (alerts.length) lines.push(`Погода, ${w.place}: ${d.min_c}…${d.max_c}°, ${alerts.join(', ')}.`);
  }
  const evs: any = ev.status === 'fulfilled' ? ev.value : null;
  const evList = Array.isArray(evs?.results) ? evs.results : [];
  if (evList.length) lines.push(`Встречи сегодня: ${evList.map((x: any) => `${(x.start?.dateTime || x.start || '').toString().slice(11, 16)} ${x.title || x.summary || ''}`.trim()).join('; ')}.`);
  const f: any = due.status === 'fulfilled' ? due.value : [];
  if (f.length) lines.push(`Ждёшь ответа: ${f.map((x: any) => x.contact + (x.subject ? ` (${x.subject})` : '')).join(', ')}.`);
  const l: any = leads.status === 'fulfilled' ? leads.value : null;
  const ln = Array.isArray(l?.results) ? l.results.length : 0;
  if (ln) lines.push(`Новые заявки с сайта: ${ln}.`);
  if (!lines.length) return { sent: false, reason: 'nothing worth a message today' };
  const body = `Доброе утро.\n\n${lines.join('\n')}\n\n— VERGHE`;
  if (dry) return { sent: false, dry: true, body };
  const r: any = await mail(`VERGHE · ${today()} · главное на сегодня`, body);
  return { sent: !r?.error, error: r?.error, body };
}

/* ---------- weekly summary (Sunday evening) + memory review with one-tap delete ---------- */
async function weekly(dry = false) {
  const [exp, fu, yt, mem, leads, acts] = await Promise.allSettled([
    sql`select category, round(sum(amount_usd)::numeric,2) usd from verghe.expenses where spent_on > current_date - 7 group by 1 order by 2 desc`,
    sql`select contact, subject, status from verghe.followups where status in ('open','reminded')`,
    ACTIONS.youtube_stats({}),
    sql`select id, kind, note from verghe.memories where created_at > now() - interval '7 days' and kind <> 'state' order by created_at`,
    findEmails('subject:"New request" newer_than:7d'),
    sql`select count(*)::int n, count(*) filter (where cached)::int c from verghe.tool_log where at > now() - interval '7 days'`,
  ]);
  const v = (p: PromiseSettledResult<any>) => p.status === 'fulfilled' ? p.value : null;
  const out: string[] = [];
  const e = v(exp) || []; const tot = e.reduce((s: number, r: any) => s + Number(r.usd || 0), 0);
  out.push(e.length ? `Расходы за неделю: $${tot.toFixed(2)} (${e.map((r: any) => `${r.category} $${r.usd}`).join(', ')}).` : 'Расходов за неделю не записано.');
  const f = v(fu) || []; if (f.length) out.push(`Клиенты без ответа: ${f.map((x: any) => x.contact).join(', ')}.`);
  const l = v(leads); out.push(`Заявки с сайта за неделю: ${Array.isArray(l?.results) ? l.results.length : 0}.`);
  const y = v(yt)?.results; if (y?.subscribers !== undefined) out.push(`YouTube «${y.channel_title}»: ${y.subscribers} подписчиков, ${y.total_views} просмотров, ${y.video_count} видео.`);
  const a = v(acts)?.[0]; if (a) out.push(`Агент за неделю: ${a.n} вызовов инструментов, из них ${a.c} бесплатно из кэша.`);
  const m = v(mem) || [];
  if (m.length) {
    out.push('\nЧто я запомнил за неделю (нажми ссылку, чтобы удалить):');
    for (const r of m) out.push(`• [${r.kind}] ${r.note}\n  удалить: ${SELF}?action=forget_link&id=${r.id}&sig=${await sign(String(r.id))}`);
  }
  const body = `Итоги недели.\n\n${out.join('\n')}\n\n— VERGHE`;
  if (dry) return { dry: true, body };
  const r: any = await mail(`VERGHE · итоги недели · ${today()}`, body);
  return { sent: !r?.error, error: r?.error };
}

/* ---------- month recap ("Wrapped"): numbers only from real logs, never invented ---------- */
const prevMonth = () => { const d = new Date(Date.now() - 5 * 864e5); d.setUTCDate(1); return d.toISOString().slice(0, 7); };
const monthRange = (m: string) => { const a = new Date(`${m}-01T00:00:00+03:00`); const b = new Date(a); b.setMonth(b.getMonth() + 1); return [a, b]; };
async function signM(m: string) { return (await sign('wrapped:' + m)); }
const recapUrl = async (m: string) => `https://verghethorn.com/v-55ef1d/wrapped.html?m=${m}&s=${await signM(m)}`;
async function talks(from: Date, to: Date) {
  const out: any[] = []; let cursor = '';
  for (let i = 0; i < 10; i++) {
    const r = await fetch(`https://api.elevenlabs.io/v1/convai/conversations?agent_id=agent_0301m6ye45t5fks83a75m7ayq0e6&page_size=100&call_start_after_unix=${Math.floor(+from / 1000)}&call_start_before_unix=${Math.floor(+to / 1000)}${cursor ? '&cursor=' + cursor : ''}`, { headers: { 'xi-api-key': XI } });
    if (!r.ok) break; const j = await r.json(); out.push(...(j.conversations || []).filter((c: any) => (c.call_duration_secs || 0) >= 5)); // skip failed / empty calls
    if (!j.has_more || !j.next_cursor) break; cursor = j.next_cursor;
  }
  return out;
}
async function recapData(m: string) {
  const [from, to] = monthRange(m);
  const [conv, acts, exp, places, mem, saved] = await Promise.all([
    talks(from, to).catch(() => []),
    sql`select action, count(*)::int n from verghe.tool_log where at >= ${from} and at < ${to} and ok group by action`,
    sql`select category, round(sum(amount_usd)::numeric, 2)::float usd, count(*)::int n from verghe.expenses where spent_on >= ${from}::date and spent_on < ${to}::date group by category order by usd desc`,
    sql`select city, min(at) first from verghe.places where at >= ${from} and at < ${to} group by city order by first`,
    sql`select kind, note from verghe.memories where created_at >= ${from} and created_at < ${to} and kind in ('decision','project','episode') order by created_at desc limit 3`,
    sql`select count(*) filter (where cached)::int c from verghe.tool_log where at >= ${from} and at < ${to}`,
  ]);
  const A: Record<string, number> = Object.fromEntries(acts.map((r: any) => [r.action, r.n]));
  const secs = conv.reduce((s: number, c: any) => s + (c.call_duration_secs || 0), 0);
  const hours = conv.map((c: any) => new Date(c.start_time_unix_secs * 1000).toLocaleString('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }));
  const top = (arr: string[]) => { const f: Record<string, number> = {}; arr.forEach(x => f[x] = (f[x] || 0) + 1); return Object.entries(f).sort((a, b) => b[1] - a[1])[0]?.[0]; };
  const days = conv.map((c: any) => new Date(c.start_time_unix_secs * 1000).toLocaleDateString('ru-RU', { timeZone: TZ, weekday: 'long' }));
  const docs = await sql`select summary from verghe.tool_log where action = 'save_doc' and ok and at >= ${from} and at < ${to} order by at desc limit 3`;
  return {
    month: m,
    talks: conv.length, minutes: Math.round(secs / 60), longest_min: Math.round(Math.max(0, ...conv.map((c: any) => c.call_duration_secs || 0)) / 60),
    favorite_hour: top(hours) ?? null, favorite_day: top(days) ?? null,
    emails_sent: (A.send_email || 0) + (A.reply_email || 0), drafts: A.draft_email || 0, docs: A.save_doc || 0,
    doc_titles: docs.map((d: any) => String(d.summary).replace(/^документ: /, '')),
    events: A.add_event || 0, memories: A.remember || 0, briefings: A.briefing || 0, trips_searched: A.travel_links || 0,
    expenses: { total_usd: Math.round(exp.reduce((s: number, r: any) => s + r.usd, 0) * 100) / 100, top: exp[0] ?? null, count: exp.reduce((s: number, r: any) => s + r.n, 0) },
    cities: places.map((p: any) => p.city), highlights: mem.map((r: any) => r.note), free_from_cache: saved[0]?.c ?? 0,
  };
}
async function wrappedJob(dry = false) {
  const m = prevMonth(), d = await recapData(m), url = await recapUrl(m);
  const body = `Твои итоги ${m}: ${d.talks} разговоров, ${d.minutes} минут вместе${d.cities.length ? ', города: ' + d.cities.join(' → ') : ''}.\n\nОткрой карточки и сохрани для сторис:\n${url}\n\n— VERGHE`;
  if (dry) return { dry: true, body, data: d };
  const r: any = await mail(`VERGHE · твой месяц ${m} ✦`, body);
  return { sent: !r?.error, error: r?.error };
}

/* ---------- actions ---------- */
const ACTIONS: Record<string, (a: any) => Promise<unknown>> = {
  // mail
  find_emails: a => findEmails(a.query || 'in:inbox newer_than:2d'),
  read_email: a => zap('gmail_get_conversation', { thread_id: a.thread_id, format: 'full', output_hint: 'Sender, subject, date and the plain-text body of each message, quoted replies and signatures removed. Max 1500 characters.' }),
  send_email: a => zap('gmail_send_email', { to: list(a.to), subject: a.subject, body: a.body, output_hint: 'Only: sent true/false and message id.' }),
  draft_email: a => zap('gmail_create_draft', { to: list(a.to || 'verghethorn@gmail.com'), subject: a.subject, body: a.body, output_hint: 'Only: draft created true/false.' }),
  reply_email: a => zap('gmail_reply_to_email', { thread_id: a.thread_id, body: a.body, to: list(a.to), output_hint: 'Only: sent true/false.' }),
  site_leads: a => findEmails(`subject:"New request" newer_than:${a.days || 7}d`),
  // calendar & reminders
  find_events: a => findEvents(a.start_time, a.end_time, a.search),
  add_event: a => addEvent(a.text),
  delete_event: a => zap('google_calendar_delete_event', { calendarid: 'primary', eventid: a.event_id, send_notifications: 'false', output_hint: 'Only: deleted true/false.' }),
  // public info (code only, cached)
  weather: async a => weather(a.place || await city(), a.days || 3),
  currency: a => convert(Number(a.amount) || 1, a.from || 'USD', a.to || 'TRY'),
  news: a => news(a.topic || 'AI advertising', a.lang || 'en', 5),
  // one call instead of four
  briefing: async a => {
    const s = `${today()}T00:00:00+03:00`, e = `${today(1)}T00:00:00+03:00`;
    const [wx, ev, mail, ai, ads] = await Promise.allSettled([
      weather(a.place || await city(), 1).then(w => { delete (w as any)._cached; return w; }), findEvents(s, e),
      findEmails('in:inbox newer_than:1d -category:promotions -category:social -category:updates'),
      news('AI video', 'en', 3), news('advertising campaign', 'en', 2),
    ]);
    const v = (p: PromiseSettledResult<unknown>) => p.status === 'fulfilled' ? p.value : { error: String((p as PromiseRejectedResult).reason) };
    return { date: today(), weather: v(wx), today_events: v(ev), important_emails: v(mail), ai_news: v(ai), ad_news: v(ads) };
  },
  // memory — layered (profile, preference, style, project, decision, episode, rule, state); state expires by itself
  remember: async a => {
    const kind = KINDS.includes(a.kind) ? a.kind : 'fact';
    const days = Number(a.expires_in_days) || (kind === 'state' ? 3 : 0);
    const exp = days ? new Date(Date.now() + days * 864e5).toISOString() : null;
    // no duplicates: a near-identical note of the same kind is updated instead of added
    const dup = await sql`select id from verghe.memories where kind = ${kind} and (expires_at is null or expires_at > now())
                          and extensions.similarity(note, ${a.note}) > 0.6 order by extensions.similarity(note, ${a.note}) desc limit 1`;
    if (dup.length) { await sql`update verghe.memories set note = ${a.note}, topic = coalesce(${a.topic ?? null}, topic), person = coalesce(${a.person ?? null}, person), expires_at = ${exp}, updated_at = now() where id = ${dup[0].id}`; return { saved: true, updated_existing: true, id: dup[0].id }; }
    const r = await sql`insert into verghe.memories (kind, topic, person, note, expires_at) values (${kind}, ${a.topic ?? null}, ${a.person ?? null}, ${a.note}, ${exp}) returning id`;
    return { saved: true, id: r[0].id, kind };
  },
  recall: async a => ({ results: await sql`select id, created_at::date as date, kind, topic, person, note from verghe.recall(${a.query}, 8)` }),
  // what the agent should know at the start of a talk: small, stable, cheap (one DB read)
  get_context: async () => ({ ...(await context()), now_istanbul: new Date().toLocaleString('ru-RU', { timeZone: TZ }) }),
  memory_list: async a => {
    const rows = await sql`select id, kind, topic, person, note, created_at::date as date from verghe.memories
                           where (expires_at is null or expires_at > now()) ${a.kind ? sql`and kind = ${a.kind}` : sql``} order by kind, created_at desc limit 60`;
    return { count: rows.length, items: rows };
  },
  forget: async a => {
    const rows = a.id ? await sql`delete from verghe.memories where id = ${a.id} returning id, note`
                      : await sql`delete from verghe.memories where id in (select id from verghe.recall(${a.query}, 3)) returning id, note`;
    return { deleted: rows.length, items: rows };
  },
  set_location: async a => {
    await sql`delete from verghe.memories where kind = 'state' and topic = 'location'`;
    await sql`insert into verghe.memories (kind, topic, note, expires_at) values ('state', 'location', ${a.city}, now() + interval '30 days')`;
    await sql`insert into verghe.places (city) values (${a.city})`;
    return { saved: true, city: a.city };
  },
  // journal of what was done on his behalf
  actions_log: async a => ({ actions: await sql`select to_char(at at time zone 'Europe/Istanbul', 'DD.MM HH24:MI') as at, action, summary, ok
      from verghe.tool_log where summary is not null order by at desc limit ${Math.min(30, Number(a.limit) || 10)}` }),
  // expenses
  log_expense: async a => {
    const cur = (a.currency || 'USD').toUpperCase(); let usd = Number(a.amount);
    if (cur !== 'USD') { const c = await convert(Number(a.amount), cur, 'USD') as any; usd = c.result ?? null; }
    await sql`insert into verghe.expenses (spent_on, amount, currency, amount_usd, category, note) values (${a.date || today()}, ${a.amount}, ${cur}, ${usd}, ${a.category ?? 'other'}, ${a.note ?? null})`;
    return { saved: true, amount: a.amount, currency: cur, amount_usd: usd };
  },
  expenses_summary: async a => {
    const m = a.month || today().slice(0, 7);
    const rows = await sql`select category, round(sum(amount_usd)::numeric, 2) as usd, count(*) as n from verghe.expenses where to_char(spent_on, 'YYYY-MM') = ${m} group by category order by usd desc`;
    const total = rows.reduce((s: number, r: any) => s + Number(r.usd || 0), 0);
    return { month: m, total_usd: Math.round(total * 100) / 100, by_category: rows };
  },
  // follow-ups: reminder if the contact hasn't replied by the due date (checked daily)
  followup_add: async a => {
    const due = new Date(Date.now() + (Number(a.days) || 3) * 864e5).toISOString();
    await sql`insert into verghe.followups (contact, subject, due_at) values (${a.contact}, ${a.subject ?? null}, ${due})`;
    return { saved: true, contact: a.contact, due: due.slice(0, 10) };
  },
  followup_list: async () => ({ open: await sql`select contact, subject, due_at::date as due from verghe.followups where status = 'open' order by due_at` }),
  // documents
  save_doc: a => zap('google_docs_create_document_from_text', { title: a.title, file: a.content, output_hint: 'Only: document title and URL.' }),
  // social stats
  youtube_stats: () => zap('youtube_make_api_get_request', { url: 'https://www.googleapis.com/youtube/v3/channels', querystring: { part: 'statistics,snippet', mine: 'true' }, output_hint: 'Only: channel title, subscribers, total views, video count.' }),
  // travel
  travel_links: async a => travelLinks(a),
  // month recap: key numbers + the card link to open on his screen
  month_recap: async a => { const m = /^\d{4}-\d{2}$/.test(a.month || '') ? a.month : today().slice(0, 7); const d = await recapData(m); return { ...d, card_url: await recapUrl(m) }; },
};

/* daily job: check follow-ups, remind via calendar if no reply */
async function followupCheck() {
  const due = await sql`select * from verghe.followups where status = 'open' and due_at <= now()`;
  const done: unknown[] = [];
  for (const f of due) {
    const since = new Date(f.created_at).toISOString().slice(0, 10).replaceAll('-', '/');
    const r: any = await findEmails(`from:(${f.contact}) after:${since}`);
    const replied = Array.isArray(r?.results) && r.results.length > 0;
    if (replied) await sql`update verghe.followups set status = 'replied', last_checked = now() where id = ${f.id}`;
    else {
      await addEvent(`Follow up: no reply from ${f.contact}${f.subject ? ' about ' + f.subject : ''} — today at 10:00 Istanbul time, 15 minutes`);
      await sql`update verghe.followups set status = 'reminded', last_checked = now() where id = ${f.id}`;
    }
    done.push({ contact: f.contact, replied });
  }
  return { checked: done };
}

const WRITE: Record<string, (a: any) => string> = {
  send_email: a => `письмо → ${a.to}: ${a.subject}`, reply_email: a => `ответ в переписке ${a.to ?? ''}`.trim(),
  draft_email: a => `черновик: ${a.subject}`, add_event: a => `в календарь: ${a.text}`, delete_event: a => `удалено событие ${a.event_id}`,
  save_doc: a => `документ: ${a.title}`, log_expense: a => `расход ${a.amount} ${a.currency ?? 'USD'} ${a.category ?? ''}`.trim(),
  remember: a => `запомнил [${a.kind ?? 'fact'}]: ${String(a.note).slice(0, 80)}`, forget: a => `удалил из памяти: ${a.id ?? a.query}`,
  followup_add: a => `проследить ответ: ${a.contact}`, set_location: a => `локация: ${a.city}`,
};
const JOBS: Record<string, (dry: boolean) => Promise<unknown>> = { followup_check: () => followupCheck(), morning, weekly, wrapped: wrappedJob };

/* live face (Anam): the phone asks for a one-time session token; keys never leave the server */
const AGENT_ID = 'agent_0301m6ye45t5fks83a75m7ayq0e6';
const CORS = { 'Access-Control-Allow-Origin': 'https://verghethorn.com', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'content-type', 'Vary': 'Origin' };
async function faceSession(req: Request) {
  const res = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
  if (req.headers.get('origin') !== 'https://verghethorn.com') return res({ error: 'forbidden' }, 403);
  const [cfg] = await sql`select value from verghe.kv where key = 'face'`;
  const face = cfg?.value as any;
  if (!face?.enabled || !face?.avatarId) return res({ face: false });
  // protects Anam minutes and ElevenLabs credits: at most 8 face sessions per hour
  const [{ n }] = await sql`select count(*)::int n from verghe.tool_log where action = 'face_session' and at > now() - interval '1 hour'`;
  if (n >= 8) return res({ face: false, error: 'rate limit' });
  const el = await fetch(`https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${AGENT_ID}`, { headers: { 'xi-api-key': XI } });
  if (!el.ok) return res({ face: false, error: `elevenlabs ${el.status}` });
  const { signed_url } = await el.json();
  const an = await fetch('https://api.anam.ai/v1/auth/session-token', {
    method: 'POST', headers: { Authorization: `Bearer ${ANAM}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personaConfig: { avatarId: face.avatarId, avatarModel: face.model || 'cara-4', directorNotes: { presetStyle: 'warm', expressivity: 0.5 } },
      environment: { elevenLabsAgentSettings: { signedUrl: signed_url, agentId: AGENT_ID } },
      maxSessions: 3, expiresInSeconds: 300,
    }),
  });
  const out = await an.json().catch(() => ({}));
  sql`insert into verghe.tool_log (action, ms, ok, cached) values ('face_session', 0, ${an.ok}, false)`.catch(() => {});
  return an.ok ? res({ face: true, sessionToken: out.sessionToken }) : res({ face: false, error: `anam ${an.status}` });
}

Deno.serve(async req => {
  const url = new URL(req.url), action = url.searchParams.get('action') || '';
  if (action === 'wrapped_data') {
    const m = url.searchParams.get('m') || '';
    if (!/^\d{4}-\d{2}$/.test(m) || url.searchParams.get('s') !== await signM(m)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json', ...CORS } });
    const [hit] = await sql`select value from verghe.cache where key = ${'wrapped:' + m} and expires_at > now()`;
    const d = hit?.value ?? await recapData(m);
    if (!hit) await sql`insert into verghe.cache (key, value, expires_at) values (${'wrapped:' + m}, ${sql.json(d)}, now() + interval '30 minutes') on conflict (key) do update set value = excluded.value, expires_at = excluded.expires_at`;
    return new Response(JSON.stringify(d), { headers: { 'Content-Type': 'application/json', ...CORS } });
  }
  if (action === 'face_session') return req.method === 'OPTIONS' ? new Response(null, { headers: CORS }) : faceSession(req);
  // one-tap delete from the weekly email (signed, no key needed)
  if (action === 'forget_link') {
    const id = url.searchParams.get('id') || '';
    const txt = (t: string, status = 200) => new Response(t, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    if (!id || url.searchParams.get('sig') !== await sign(id)) return txt('Ссылка недействительна.', 403);
    // two steps, so mail link scanners can't delete anything by just opening the link
    if (!url.searchParams.has('confirm')) {
      const m = await sql`select note from verghe.memories where id = ${id}`;
      return txt(m.length ? `Удалить из памяти VERGHE:\n«${m[0].note}»\n\nПодтвердить удаление:\n${SELF}${url.search}&confirm=1` : 'Уже удалено.');
    }
    const r = await sql`delete from verghe.memories where id = ${id} returning note`;
    await sql`insert into verghe.tool_log (action, ms, ok, cached, summary) values ('forget', 0, true, false, ${'удалил по ссылке: ' + (r[0]?.note ?? id)})`;
    return txt(r.length ? 'Готово: удалено из памяти VERGHE.' : 'Уже удалено.');
  }
  if (req.headers.get('x-verghe-key') !== KEY) return j({ error: 'forbidden' }, 403);
  const t0 = Date.now();
  if (JOBS[action]) return j(await JOBS[action](url.searchParams.has('dry')));
  const fn = ACTIONS[action]; if (!fn) return j({ error: 'unknown action' }, 400);
  // rate limit: protects credits from loops (max 30 calls / 10 min)
  const [{ n }] = await sql`select count(*)::int as n from verghe.tool_log where at > now() - interval '10 minutes'`;
  if (n > 30) return j({ error: 'too many tool calls in a short time — pause and ask the owner' }, 429);
  let args: any = {}; try { args = await req.json(); } catch { /* no body */ }
  let ok = true, out: unknown;
  try { out = await fn(args); if ((out as any)?.error) ok = false; } catch (e) { ok = false; out = { error: String(e) }; }
  const isCached = !!(out as any)?._cached; if (out && typeof out === 'object') delete (out as any)._cached;
  const summary = WRITE[action] ? WRITE[action](args) : null;
  sql`insert into verghe.tool_log (action, ms, ok, cached, summary) values (${action}, ${Date.now() - t0}, ${ok}, ${isCached}, ${summary})`.catch(() => {});
  return j(out); // errors go back as {error} with 200, so the agent can tell him plainly
});
