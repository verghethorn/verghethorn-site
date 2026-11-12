// VERGHE bridge — ideas taken from the NOVA proposal (12.11.2026):
// close the day, undo the last action, visible rules, a trip plan in one doc, background tasks with a report,
// read-only exchange portfolio (Binance / Bybit, keys without trade or withdraw rights), flashcards with spaced repetition.
// Same rules as the rest of the bridge: no LLM here, nothing goes outside without his yes, errors are returned honestly.
type Ctx = {
  sql: any; zap: (name: string, args: Record<string, unknown>) => Promise<any>;
  today: (offset?: number) => string; findEvents: (s: string, e: string, q?: string) => Promise<any>;
  needsReply: (a: any) => Promise<any>; travelLinks: (a: any) => any; weather: (place: string, days: number) => Promise<any>;
  convert: (amount: number, from: string, to: string) => Promise<any>;
  secrets: Record<string, string | undefined>;
};
const docUrl = (r: any) => JSON.stringify(r ?? '').match(/https:\/\/docs\.google\.com\/[^"\s\\]+/)?.[0] ?? null;
const TG = 'https://vgotvplikubsncujcxmk.supabase.co/functions/v1/verghe-telegram';

/* what can be taken back, recorded with each call (tool_log.undo) */
function findId(o: any, depth = 0): string | null {
  if (!o || typeof o !== 'object' || depth > 4) return null;
  for (const [k, v] of Object.entries(o)) if (/^(event_?id|id)$/i.test(k) && (typeof v === 'string' || typeof v === 'number')) return String(v);
  for (const v of Object.values(o)) { const r = findId(v, depth + 1); if (r) return r; }
  return null;
}
export function undoSpec(action: string, a: any, out: any): Record<string, unknown> | null {
  if (!out || out.error) return null;
  switch (action) {
    case 'add_event': { const id = findId(out?.results ?? out); return id ? { kind: 'event', id, label: `событие «${a.text}»` } : null; }
    case 'task_add': return out.id ? { kind: 'row', table: 'tasks', id: out.id, label: `задачу «${a.title}»` } : null;
    case 'task_done': return out.done?.[0]?.id ? { kind: 'reopen_task', id: out.done[0].id, label: `отметку «выполнено» у «${out.done[0].title}»` } : null;
    case 'crm_contact_save': return out.created ? { kind: 'row', table: 'contacts', id: out.id, label: `контакт ${a.name ?? a.email}` } : null;
    case 'deal_save': return out.created ? { kind: 'row', table: 'deals', id: out.id, label: `сделку «${a.title}»` } : null;
    case 'log_expense': return out.id ? { kind: 'row', table: 'expenses', id: out.id, label: `расход ${a.amount} ${out.currency}` } : null;
    case 'remember': return out.id && !out.updated_existing ? { kind: 'row', table: 'memories', id: out.id, label: `запись в памяти` } : null;
    case 'followup_add': return out.id ? { kind: 'row', table: 'followups', id: out.id, label: `слежку за ответом ${a.contact}` } : null;
    case 'invoice_create': return out.number ? { kind: 'cancel_invoice', number: out.number, label: `счёт ${out.number}` } : null;
    case 'card_add': return out.ids?.length ? { kind: 'rows', table: 'cards', ids: out.ids, label: `${out.ids.length} карточек` } : null;
    case 'bg_task_add': return out.id ? { kind: 'cancel_bg', id: out.id, label: `фоновую задачу «${a.title}»` } : null;
    case 'price_alert_add': { const id = out.id ?? out.alert?.id; return id ? { kind: 'row', table: 'price_alerts', id, label: `алерт ${a.asset}` } : null; }
    default: return null;
  }
}
const NOT_UNDOABLE: Record<string, string> = {
  send_email: 'письмо уже ушло — отозвать его нельзя. Могу написать вдогонку уточнение.',
  reply_email: 'ответ уже ушёл — отозвать его нельзя. Могу написать вдогонку уточнение.',
  save_doc: 'документ создан в Google Docs; удалить его могу только ты, я дам ссылку.',
  meeting_save: 'протокол уже сохранён в Google Docs; задачи из него можно закрыть по одной.',
  draft_email: 'черновик лежит в Gmail, его можно просто не отправлять.',
};

export function nova(ctx: Ctx) {
  const { sql, today } = ctx;

  /* ---------- «Закрой день»: what is still open tonight ---------- */
  async function closeDay() {
    const t1 = `${today(1)}T00:00:00+03:00`, t2 = `${today(2)}T00:00:00+03:00`;
    const [done, tasks, fus, deals, inv, bg, waiting, tomorrow] = await Promise.allSettled([
      sql`select to_char(at at time zone 'Europe/Istanbul', 'HH24:MI') at, summary from verghe.tool_log
          where summary is not null and ok and at > (now() at time zone 'Europe/Istanbul')::date at time zone 'Europe/Istanbul' order by at limit 25`,
      sql`select id, title, assignee, due, (due < current_date) overdue from verghe.tasks where status = 'open' and (due is null or due <= current_date + 1) order by due nulls last limit 10`,
      sql`select contact, subject, due_at::date due, status from verghe.followups where status in ('open','reminded') order by due_at limit 8`,
      sql`select d.title, d.next_step, d.due, c.name client, d.updated_at::date last_move from verghe.deals d left join verghe.contacts c on c.id = d.contact_id
          where d.stage not in ('won','lost') and (d.due <= current_date + 1 or d.updated_at < now() - interval '7 days') order by d.due nulls last limit 8`,
      sql`select number, client, total::float, currency, due from verghe.invoices where status = 'sent' and due < current_date limit 6`,
      sql`select id, title, status from verghe.bg_tasks where status in ('queued','running') order by id`,
      ctx.needsReply({ days: 3 }),
      ctx.findEvents(t1, t2),
    ]);
    const v = (p: PromiseSettledResult<any>) => p.status === 'fulfilled' ? p.value : { error: String((p as PromiseRejectedResult).reason).slice(0, 200) };
    return {
      date: today(), done_today: v(done), open_tasks: v(tasks), waiting_for_reply_from_others: v(fus), deals_need_move: v(deals),
      overdue_invoices: v(inv), background_tasks_running: v(bg), emails_waiting_for_your_reply: v(waiting), tomorrow_events: v(tomorrow),
      how_to_answer: 'Short: 1) what got done, 2) what is still open — one next step per item, 3) tomorrow. Offer to prepare drafts; send nothing without his yes.',
    };
  }

  /* ---------- «Отмени последнее» ---------- */
  async function undoLast(a: any) {
    const rows = await sql`select id, action, summary, undo, undone, at from verghe.tool_log
      where summary is not null and ok and at > now() - interval '24 hours' and action not in ('undo_last') order by at desc limit 1`;
    const last = rows[0];
    if (!last) return { undone: false, reason: 'за последние сутки я ничего не меняла' };
    if (last.undone) return { undone: false, reason: `последнее действие уже отменено: ${last.summary}` };
    if (!last.undo) return { undone: false, action: last.summary, reason: NOT_UNDOABLE[last.action] ?? 'это действие автоматически не отменяется' };
    const u = last.undo as any;
    if (a?.dry) return { would_undo: u.label, action: last.summary };
    let res: any = { ok: true };
    if (u.kind === 'event') res = await ctx.zap('google_calendar_delete_event', { calendarid: 'primary', eventid: u.id, send_notifications: 'false', output_hint: 'Only: deleted true/false.' });
    else if (u.kind === 'row') await sql`delete from ${sql('verghe.' + u.table)} where id = ${u.id}`;
    else if (u.kind === 'rows') await sql`delete from ${sql('verghe.' + u.table)} where id in ${sql(u.ids)}`;
    else if (u.kind === 'reopen_task') await sql`update verghe.tasks set status = 'open', done_at = null where id = ${u.id}`;
    else if (u.kind === 'cancel_invoice') await sql`update verghe.invoices set status = 'cancelled' where number = ${u.number} and status = 'draft'`;
    else if (u.kind === 'cancel_bg') await sql`update verghe.bg_tasks set status = 'cancelled' where id = ${u.id} and status in ('queued','running')`;
    if (res?.error) return { undone: false, action: last.summary, error: res.error };
    await sql`update verghe.tool_log set undone = true where id = ${last.id}`;
    await sql`insert into verghe.tool_log (action, ms, ok, cached, summary) values ('undo_last', 0, true, false, ${'отменила: ' + u.label})`;
    return { undone: true, what: u.label, action: last.summary };
  }

  /* ---------- rules he gave about how to talk to him ---------- */
  const rulesList = async () => ({ rules: await sql`select id, note, created_at::date date from verghe.memories where kind = 'rule' and (expires_at is null or expires_at > now()) order by created_at` });

  /* ---------- trip plan in one Google Doc ---------- */
  const CUR: Record<string, string> = { dubai: 'AED', 'abu dhabi': 'AED', cairo: 'EGP', hurghada: 'EGP', 'sharm el sheikh': 'EGP', istanbul: 'TRY', antalya: 'TRY', bodrum: 'TRY', izmir: 'TRY', ankara: 'TRY', moscow: 'RUB', 'saint petersburg': 'RUB', london: 'GBP', paris: 'EUR', rome: 'EUR', milan: 'EUR', barcelona: 'EUR', madrid: 'EUR', berlin: 'EUR', amsterdam: 'EUR', baku: 'AZN', tbilisi: 'GEL', doha: 'QAR', riyadh: 'SAR', bangkok: 'THB', bali: 'IDR', tokyo: 'JPY', 'new york': 'USD' };
  async function tripPlan(a: any) {
    if (!a.to || !a.depart) return { error: 'need to (city) and depart (YYYY-MM-DD); also from, return, travelers, budget_usd, itinerary' };
    const links = ctx.travelLinks({ from: a.from || 'Istanbul', to: a.to, depart: a.depart, return: a.return, passengers: a.travelers, from_code: a.from_code, to_code: a.to_code });
    const hotel = a.return ? ctx.travelLinks({ city: a.to, checkin: a.depart, checkout: a.return, guests: a.travelers || 1 }) : {};
    const days = Math.round((Date.parse(a.depart) - Date.now()) / 864e5);
    const wx = days <= 6 ? await ctx.weather(a.to, 7).catch(() => null) : null;
    const cur = (a.local_currency || CUR[String(a.to).toLowerCase()] || '').toUpperCase();
    const fx = cur && cur !== 'USD' ? await ctx.convert(100, 'USD', cur).catch(() => null) : null;
    const lines = [
      `ПОЕЗДКА: ${a.from || 'Istanbul'} → ${a.to}`, `Даты: ${a.depart}${a.return ? ' — ' + a.return : ''}${a.travelers ? ` · ${a.travelers} чел.` : ''}`,
      a.budget_usd ? `Бюджет: ${a.budget_usd} USD` : '', '',
      a.options ? `ВАРИАНТЫ\n${a.options}` : '', a.options ? '' : '',
      a.itinerary ? `МАРШРУТ ПО ДНЯМ\n${a.itinerary}` : '', a.itinerary ? '' : '',
      a.budget_breakdown ? `БЮДЖЕТ ПО СТАТЬЯМ (оценка, проверить цены по ссылкам)\n${a.budget_breakdown}` : '', a.budget_breakdown ? '' : '',
      wx?.days ? `ПОГОДА (прогноз)\n${wx.days.filter((d: any) => d.date >= a.depart && (!a.return || d.date <= a.return)).map((d: any) => `${d.date}: ${d.min_c}…${d.max_c}°, ${d.sky}`).join('\n') || 'даты поездки за пределами прогноза'}` : 'ПОГОДА: прогноз появится за неделю до вылета.',
      fx?.result ? `\nКУРС: 100 USD ≈ ${fx.result} ${cur} (${fx.updated?.slice(5, 16) ?? ''})` : '', '',
      'ГДЕ СМОТРЕТЬ И БРОНИРОВАТЬ (бронирует и платит владелец)',
      ...Object.entries({ ...(links.error ? {} : links), ...(hotel.error ? {} : hotel) }).map(([k, u]) => `• ${k}: ${u}`),
      '', a.checklist ? `ЧЕК-ЛИСТ\n${a.checklist}` : 'ЧЕК-ЛИСТ\n☐ паспорт и виза\n☐ страховка\n☐ трансфер из аэропорта\n☐ eSIM / роуминг\n☐ наличные в местной валюте',
      '', 'Цены и наличие — только по ссылкам выше в момент брони. — VERGHE',
    ].filter((x, i, arr) => x !== '' || arr[i - 1] !== '');
    const doc = await ctx.zap('google_docs_create_document_from_text', { title: `Поездка — ${a.to} ${a.depart}`, file: lines.join('\n'), output_hint: 'Only: document title and URL.' });
    const url = docUrl(doc);
    if (!url) return { error: 'не удалось создать документ', detail: doc?.error ?? doc };
    return { created: true, doc_url: url, links: { ...links, ...hotel }, weather_in_doc: !!wx, rate: fx?.result ? `100 USD = ${fx.result} ${cur}` : null, next: 'show the doc with open_link; booking and payment are his' };
  }

  /* ---------- background tasks: queued here, run by the Telegram bridge with the agent, report goes to Telegram ---------- */
  async function bgTaskAdd(a: any) {
    if (!a.title || !a.brief) return { error: 'need title and brief (what exactly to do and what the result should look like)' };
    const [{ n }] = await sql`select count(*)::int n from verghe.bg_tasks where created_at > now() - interval '1 hour'`;
    if (n >= 3) return { error: 'уже 3 фоновые задачи за час — подожди, пока они закончатся' };
    const [r] = await sql`insert into verghe.bg_tasks (title, brief, deliver_by) values (${a.title}, ${a.brief}, ${a.deliver_by ?? null}) returning id`;
    let kicked = false;
    if (ctx.secrets.CRON) {
      try { const k = await fetch(`${TG}?job=task&id=${r.id}`, { method: 'POST', headers: { 'x-verghe-cron': ctx.secrets.CRON } }); kicked = k.ok; } catch { /* stays queued */ }
    }
    return { queued: true, id: r.id, started: kicked, report: 'придёт в Telegram, когда будет готово', note: kicked ? undefined : 'не удалось запустить сразу — задача ждёт в очереди' };
  }
  const bgTaskList = async () => ({ tasks: await sql`select id, title, status, deliver_by, to_char(created_at at time zone 'Europe/Istanbul', 'DD.MM HH24:MI') created,
      left(result, 600) result from verghe.bg_tasks order by id desc limit 8` });

  /* ---------- exchanges: read-only portfolio. A key that can trade or withdraw is refused. ---------- */
  const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  async function hmac(secret: string, msg: string) {
    const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return hex(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(msg)));
  }
  async function binance() {
    const { BINANCE_KEY: key, BINANCE_SECRET: sec } = ctx.secrets; if (!key || !sec) return { exchange: 'Binance', connected: false };
    const get = async (path: string) => { const q = `timestamp=${Date.now()}&recvWindow=10000`; const r = await fetch(`https://api.binance.com${path}?${q}&signature=${await hmac(sec, q)}`, { headers: { 'X-MBX-APIKEY': key } }); return r.json(); };
    const rest = await get('/sapi/v1/account/apiRestrictions');
    if (rest.code) return { exchange: 'Binance', error: `Binance: ${rest.msg}` };
    if (rest.enableWithdrawals || rest.enableSpotAndMarginTrading || rest.enableFutures || rest.enableMargin || rest.enableInternalTransfer || rest.permitsUniversalTransfer)
      return { exchange: 'Binance', error: 'ключ Binance имеет права на торговлю или вывод — я им не пользуюсь. Нужен ключ только «чтение».' };
    const acc = await get('/api/v3/account'); if (acc.code) return { exchange: 'Binance', error: `Binance: ${acc.msg}` };
    const bal = (acc.balances || []).map((b: any) => ({ asset: b.asset, amount: Number(b.free) + Number(b.locked) })).filter((b: any) => b.amount > 0);
    const prices: Record<string, number> = Object.fromEntries((await (await fetch('https://api.binance.com/api/v3/ticker/price')).json()).map((p: any) => [p.symbol, Number(p.price)]));
    const usd = (a: string, n: number) => /^(USDT|USDC|FDUSD|BUSD|DAI)$/.test(a) ? n : prices[a + 'USDT'] ? n * prices[a + 'USDT'] : null;
    return { exchange: 'Binance', connected: true, assets: bal.map((b: any) => ({ ...b, usd: usd(b.asset, b.amount) && Math.round(usd(b.asset, b.amount)! * 100) / 100 })) };
  }
  async function bybit() {
    const { BYBIT_KEY: key, BYBIT_SECRET: sec } = ctx.secrets; if (!key || !sec) return { exchange: 'Bybit', connected: false };
    const get = async (path: string, q = '') => { const ts = String(Date.now()), rw = '10000'; const sig = await hmac(sec, ts + key + rw + q);
      return (await fetch(`https://api.bybit.com${path}${q ? '?' + q : ''}`, { headers: { 'X-BAPI-API-KEY': key, 'X-BAPI-TIMESTAMP': ts, 'X-BAPI-RECV-WINDOW': rw, 'X-BAPI-SIGN': sig } })).json(); };
    const info = await get('/v5/user/query-api');
    if (info.retCode) return { exchange: 'Bybit', error: `Bybit: ${info.retMsg}` };
    const p = info.result?.permissions ?? {};
    if (info.result?.readOnly !== 1 || (p.Wallet ?? []).some((x: string) => /Withdraw|Transfer/i.test(x)))
      return { exchange: 'Bybit', error: 'ключ Bybit не «только чтение» — я им не пользуюсь. Нужен ключ Read-Only.' };
    const w = await get('/v5/account/wallet-balance', 'accountType=UNIFIED'); if (w.retCode) return { exchange: 'Bybit', error: `Bybit: ${w.retMsg}` };
    const acc = w.result?.list?.[0];
    return { exchange: 'Bybit', connected: true, total_usd: acc ? Math.round(Number(acc.totalEquity) * 100) / 100 : null,
      assets: (acc?.coin ?? []).filter((c: any) => Number(c.walletBalance) > 0).map((c: any) => ({ asset: c.coin, amount: Number(c.walletBalance), usd: Math.round(Number(c.usdValue) * 100) / 100 })) };
  }
  async function exchangePortfolio() {
    const r = await Promise.all([binance(), bybit()].map(p => p.catch((e: unknown) => ({ error: String(e).slice(0, 200) }))));
    const live = r.filter((x: any) => x.connected);
    if (!live.length && r.every((x: any) => x.connected === false)) return { connected: false, hint: 'биржи не подключены: нужен ключ «только чтение» от Binance или Bybit. Пока считаю портфель по ручным записям (portfolio_view).' };
    const total = live.reduce((s: number, x: any) => s + (x.total_usd ?? x.assets.reduce((t: number, a: any) => t + (a.usd || 0), 0)), 0);
    return { exchanges: r, total_usd: Math.round(total * 100) / 100, note: 'только просмотр: торговать и выводить я не могу' };
  }

  /* ---------- flashcards with spaced repetition (Leitner: 1, 2, 4, 8, 16, 32 days) ---------- */
  const STEP = [0, 1, 2, 4, 8, 16, 32];
  async function cardAdd(a: any) {
    const deck = String(a.deck || 'general').toLowerCase();
    const pairs: [string, string][] = a.front && a.back ? [[a.front, a.back]]
      : String(a.items || '').split(/[;\n]+/).map(s => s.split(/\s+[—–-]\s+|\s*=\s*/)).filter(p => p.length >= 2 && p[0].trim() && p[1].trim()).map(p => [p[0].trim(), p.slice(1).join(' — ').trim()]);
    if (!pairs.length) return { error: 'need front+back or items like "merhaba — привет; teşekkürler — спасибо"' };
    const rows = await sql`insert into verghe.cards ${sql(pairs.slice(0, 50).map(([front, back]) => ({ deck, front, back })))} returning id`;
    return { saved: rows.length, deck, ids: rows.map((r: any) => r.id) };
  }
  async function cardsDue(a: any) {
    const deck = a?.deck ? String(a.deck).toLowerCase() : null;
    const due = await sql`select id, deck, front, back, box from verghe.cards where due <= current_date ${deck ? sql`and deck = ${deck}` : sql``} order by box, due, random() limit ${Math.min(20, Number(a?.n) || 10)}`;
    const decks = await sql`select deck, count(*)::int total, count(*) filter (where due <= current_date)::int due from verghe.cards group by deck order by deck`;
    return { due, decks, how: 'ask the front, wait for his answer, then card_grade with ok true/false' };
  }
  async function cardGrade(a: any) {
    const [c] = await sql`select id, box from verghe.cards where id = ${a.id}`; if (!c) return { error: 'no such card' };
    const ok = a.ok === true || a.ok === 'true' || a.ok === 1, box = ok ? Math.min(6, c.box + 1) : 1;
    await sql`update verghe.cards set box = ${box}, due = current_date + ${STEP[box]}::int, reviews = reviews + 1 where id = ${c.id}`;
    return { id: c.id, box, next_in_days: STEP[box] };
  }

  // Schedules are OFF by default; the owner turns each one on by voice (verghe.schedules + security-definer cron wrappers).
  const scheduleList = async () => ({ schedules: await sql`select key, title, what, costs, on_ as "on", time_istanbul, day from verghe.schedule_list()` });
  async function scheduleSet(a: any) {
    const key = String(a?.key ?? '').trim(), on = a?.on === undefined || a?.on === null || a?.on === '' ? null : (a.on === true || a.on === 'true' || a.on === 1);
    const time = a?.time ? String(a.time).trim() : null;
    if (!key) return { error: 'key required', ...(await scheduleList()) };
    const [r] = await sql`select verghe.schedule_set(${key}, ${on}, ${time}) r`;
    return r.r;
  }

  const actions: Record<string, (a: any) => Promise<unknown>> = {
    schedule_list: () => scheduleList(), schedule_set: scheduleSet,
    close_day: () => closeDay(), undo_last: undoLast, rules_list: () => rulesList(), trip_plan: tripPlan,
    bg_task_add: bgTaskAdd, bg_task_list: () => bgTaskList(), exchange_portfolio: () => exchangePortfolio(),
    card_add: cardAdd, cards_due: cardsDue, card_grade: cardGrade,
  };
  const write: Record<string, (a: any) => string> = {
    schedule_set: a => `расписание ${a.key}: ${a.on === false || a.on === 'false' ? 'выкл' : a.on ? 'вкл' : ''}${a.time ? ' ' + a.time : ''}`,
    trip_plan: a => `документ: поездка ${a.to} ${a.depart}`,
    bg_task_add: a => `фоновая задача: ${a.title}`, card_add: a => `карточки: ${a.deck ?? 'general'}`,
  };
  return { actions, write };
}
