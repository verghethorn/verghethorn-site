// VERGHE personal assistant — tool bridge (Supabase Edge Function "verghe-tools").
// Called by ElevenLabs webhook tools. Cost rules: deterministic code/APIs first, LLM never called here,
// short answers only, TTL cache for public data, per-call log, simple rate limit.
import postgres from 'npm:postgres@3.4.5';

const ZAPIER = 'https://mcp.zapier.com/api/v1/connect';
import { ZTOKEN, KEY } from './secrets.ts'; // not in the public repo
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
  try { const o = JSON.parse(text); delete o.billingTasksUsed; return o; } catch { return { result: text }; }
}
async function cached<T>(key: string, ttlMin: number, fn: () => Promise<T>): Promise<[T, boolean]> {
  const hit = await sql`select value from verghe.cache where key = ${key} and expires_at > now()`;
  if (hit.length) return [hit[0].value as T, true];
  const v = await fn();
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
  return { ...v as object, _cached: hit };
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

/* ---------- actions ---------- */
const ACTIONS: Record<string, (a: any) => Promise<unknown>> = {
  // mail
  find_emails: a => findEmails(a.query || 'in:inbox newer_than:2d'),
  read_email: a => zap('gmail_get_conversation', { thread_id: a.thread_id, format: 'full', output_hint: 'Sender, subject, date and the plain-text body of each message, quoted replies and signatures removed. Max 1500 characters.' }),
  send_email: a => zap('gmail_send_email', { to: a.to, subject: a.subject, body: a.body, output_hint: 'Only: sent true/false and message id.' }),
  draft_email: a => zap('gmail_create_draft', { to: a.to || 'verghethorn@gmail.com', subject: a.subject, body: a.body, output_hint: 'Only: draft created true/false.' }),
  reply_email: a => zap('gmail_reply_to_email', { thread_id: a.thread_id, body: a.body, to: a.to, output_hint: 'Only: sent true/false.' }),
  site_leads: a => findEmails(`subject:"New request" newer_than:${a.days || 7}d`),
  // calendar & reminders
  find_events: a => findEvents(a.start_time, a.end_time, a.search),
  add_event: a => addEvent(a.text),
  delete_event: a => zap('google_calendar_delete_event', { calendarid: 'primary', eventid: a.event_id, send_notifications: 'false', output_hint: 'Only: deleted true/false.' }),
  // public info (code only, cached)
  weather: a => weather(a.place || 'Istanbul', a.days || 3),
  currency: a => convert(Number(a.amount) || 1, a.from || 'USD', a.to || 'TRY'),
  news: a => news(a.topic || 'AI advertising', a.lang || 'en', 5),
  // one call instead of four
  briefing: async a => {
    const s = `${today()}T00:00:00+03:00`, e = `${today(1)}T00:00:00+03:00`;
    const [wx, ev, mail, ai, ads] = await Promise.allSettled([
      weather(a.place || 'Istanbul', 1), findEvents(s, e),
      findEmails('in:inbox newer_than:1d -category:promotions -category:social -category:updates'),
      news('artificial intelligence video', 'en', 3), news('advertising campaign brand', 'en', 2),
    ]);
    const v = (p: PromiseSettledResult<unknown>) => p.status === 'fulfilled' ? p.value : { error: String((p as PromiseRejectedResult).reason) };
    return { date: today(), weather: v(wx), today_events: v(ev), important_emails: v(mail), ai_news: v(ai), ad_news: v(ads) };
  },
  // memory
  remember: async a => { const r = await sql`insert into verghe.memories (topic, person, note) values (${a.topic ?? null}, ${a.person ?? null}, ${a.note}) returning id`; return { saved: true, id: r[0].id }; },
  recall: async a => ({ results: await sql`select created_at::date as date, topic, person, note from verghe.recall(${a.query}, 8)` }),
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

Deno.serve(async req => {
  if (req.headers.get('x-verghe-key') !== KEY) return j({ error: 'forbidden' }, 403);
  const action = new URL(req.url).searchParams.get('action') || '';
  const t0 = Date.now();
  if (action === 'followup_check') return j(await followupCheck());
  const fn = ACTIONS[action]; if (!fn) return j({ error: 'unknown action' }, 400);
  // rate limit: protects credits from loops (max 30 calls / 10 min)
  const [{ n }] = await sql`select count(*)::int as n from verghe.tool_log where at > now() - interval '10 minutes'`;
  if (n > 30) return j({ error: 'too many tool calls in a short time — pause and ask the owner' }, 429);
  let args = {}; try { args = await req.json(); } catch { /* no body */ }
  let ok = true, out: unknown;
  try { out = await fn(args); } catch (e) { ok = false; out = { error: String(e) }; }
  const isCached = !!(out as any)?._cached; if (out && typeof out === 'object') delete (out as any)._cached;
  sql`insert into verghe.tool_log (action, ms, ok, cached) values (${action}, ${Date.now() - t0}, ${ok}, ${isCached})`.catch(() => {});
  return j(out, ok ? 200 : 502);
});
