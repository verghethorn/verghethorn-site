// VERGHE bridge — office: CRM (contacts, deals, history), team tasks, invoices, meeting prep and minutes.
// Sends nothing by itself: emails to clients or the team go through send_email after his clear yes.
type Ctx = {
  sql: any; zap: (name: string, args: Record<string, unknown>) => Promise<any>;
  findEmails: (q: string) => Promise<any>; findEvents: (s: string, e: string, q?: string) => Promise<any>;
  today: (offset?: number) => string;
};
const STAGES = ['lead', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
const STAGE_RU: Record<string, string> = { lead: 'заявка', contacted: 'на связи', proposal: 'КП отправлено', negotiation: 'переговоры', won: 'выиграна', lost: 'проиграна' };
const money = (n: number, c = 'USD') => `${Math.round(Number(n) * 100) / 100} ${c}`;
const docUrl = (r: any) => JSON.stringify(r ?? '').match(/https:\/\/docs\.google\.com\/[^"\s\\]+/)?.[0] ?? null;

export function crm(ctx: Ctx) {
  const { sql, today } = ctx;

  /* ---------- contacts ---------- */
  async function findContact(q: string) {
    if (!q) return null;
    const s = String(q).trim();
    const r = await sql`select * from verghe.contacts
      where lower(email) = lower(${s}) or lower(name) = lower(${s}) or lower(company) = lower(${s})
         or extensions.similarity(lower(name), lower(${s})) > 0.35 or lower(name) like ${'%' + s.toLowerCase() + '%'}
      order by (lower(name) = lower(${s})) desc, extensions.similarity(lower(name), lower(${s})) desc limit 1`;
    return r[0] ?? null;
  }
  async function contactSave(a: any) {
    if (!a.name && !a.email) return { error: 'need name or email' };
    const c = await findContact(a.email || a.name);
    if (c) {
      await sql`update verghe.contacts set name = coalesce(${a.name ?? null}, name), company = coalesce(${a.company ?? null}, company),
        email = coalesce(${a.email ?? null}, email), phone = coalesce(${a.phone ?? null}, phone), tags = coalesce(${a.tags ?? null}, tags),
        notes = case when ${a.notes ?? null}::text is null then notes else concat_ws(' | ', notes, ${a.notes ?? null}::text) end,
        next_action = coalesce(${a.next_action ?? null}, next_action), next_date = coalesce(${a.next_date ?? null}::date, next_date), updated_at = now() where id = ${c.id}`;
      return { saved: true, updated: true, id: c.id, name: a.name ?? c.name };
    }
    const r = await sql`insert into verghe.contacts (name, company, email, phone, tags, notes, next_action, next_date)
      values (${a.name || a.email}, ${a.company ?? null}, ${a.email ?? null}, ${a.phone ?? null}, ${a.tags ?? null}, ${a.notes ?? null}, ${a.next_action ?? null}, ${a.next_date ?? null}) returning id`;
    return { saved: true, created: true, id: r[0].id };
  }
  async function ensureContact(name: string) {
    const c = await findContact(name); if (c) return c;
    const r = await sql`insert into verghe.contacts (name) values (${name}) returning *`; return r[0];
  }
  async function dossier(c: any) {
    const [deals, hist, inv] = await Promise.all([
      sql`select id, title, stage, amount::float, currency, next_step, due from verghe.deals where contact_id = ${c.id} order by updated_at desc limit 5`,
      sql`select to_char(at at time zone 'Europe/Istanbul', 'DD.MM.YY') as date, kind, summary from verghe.interactions where contact_id = ${c.id} order by at desc limit 6`,
      sql`select number, total::float, currency, status, due from verghe.invoices where contact_id = ${c.id} and status in ('sent','draft') order by created_at desc limit 3`,
    ]);
    return { contact: { id: c.id, name: c.name, company: c.company, email: c.email, phone: c.phone, tags: c.tags, notes: c.notes, next_action: c.next_action, next_date: c.next_date },
      deals: deals.map((d: any) => ({ ...d, stage: STAGE_RU[d.stage] })), history: hist, open_invoices: inv };
  }
  async function crmFind(a: any) {
    const c = await findContact(a.query); if (!c) return { found: false, hint: 'no such contact yet — crm_contact_save adds one' };
    return { found: true, ...(await dossier(c)) };
  }

  /* ---------- deals ---------- */
  async function dealSave(a: any) {
    const stage = STAGES.includes(a.stage) ? a.stage : undefined;
    let d: any = null;
    if (a.id) d = (await sql`select * from verghe.deals where id = ${a.id}`)[0];
    const c = a.contact ? await ensureContact(a.contact) : null;
    if (!d && c) d = (await sql`select * from verghe.deals where contact_id = ${c.id} and stage not in ('won','lost')
      ${a.title ? sql`and extensions.similarity(lower(title), lower(${a.title})) > 0.3` : sql``} order by updated_at desc limit 1`)[0];
    if (d) {
      await sql`update verghe.deals set title = coalesce(${a.title ?? null}, title), stage = coalesce(${stage ?? null}, stage), amount = coalesce(${a.amount ?? null}, amount),
        currency = coalesce(${a.currency ?? null}, currency), next_step = coalesce(${a.next_step ?? null}, next_step), due = coalesce(${a.due ?? null}::date, due), updated_at = now() where id = ${d.id}`;
      if (stage && stage !== d.stage) await sql`insert into verghe.interactions (contact_id, deal_id, kind, summary) values (${d.contact_id}, ${d.id}, 'stage', ${'этап: ' + STAGE_RU[stage]})`;
      return { saved: true, updated: true, id: d.id, stage: STAGE_RU[stage ?? d.stage] };
    }
    if (!a.title) return { error: 'need title for a new deal' };
    const r = await sql`insert into verghe.deals (contact_id, title, stage, amount, currency, next_step, due)
      values (${c?.id ?? null}, ${a.title}, ${stage ?? 'lead'}, ${a.amount ?? null}, ${(a.currency || 'USD').toUpperCase()}, ${a.next_step ?? null}, ${a.due ?? null}) returning id`;
    return { saved: true, created: true, id: r[0].id, stage: STAGE_RU[stage ?? 'lead'] };
  }
  async function pipeline() {
    const [open, won, due, quiet] = await Promise.all([
      sql`select d.id, d.title, d.stage, d.amount::float, d.currency, d.next_step, d.due, c.name as client from verghe.deals d left join verghe.contacts c on c.id = d.contact_id
          where d.stage not in ('won','lost') order by array_position(array['negotiation','proposal','contacted','lead'], d.stage), d.due nulls last limit 20`,
      sql`select count(*)::int n, coalesce(sum(amount),0)::float s from verghe.deals where stage = 'won' and updated_at > date_trunc('month', now())`,
      sql`select d.title, d.next_step, d.due, c.name as client from verghe.deals d left join verghe.contacts c on c.id = d.contact_id
          where d.stage not in ('won','lost') and d.due <= current_date + 1 order by d.due`,
      sql`select c.name, max(i.at)::date as last from verghe.contacts c join verghe.deals d on d.contact_id = c.id and d.stage not in ('won','lost')
          left join verghe.interactions i on i.contact_id = c.id group by c.name having max(i.at) < now() - interval '7 days' or max(i.at) is null limit 5`,
    ]);
    const byStage: Record<string, number> = {}; let total = 0;
    for (const d of open) { byStage[STAGE_RU[d.stage]] = (byStage[STAGE_RU[d.stage]] || 0) + 1; total += d.amount || 0; }
    return { open_deals: open.map((d: any) => ({ ...d, stage: STAGE_RU[d.stage] })), count_by_stage: byStage, open_total_usd_approx: Math.round(total),
      won_this_month: won[0], due_today_or_overdue: due, no_contact_7_days: quiet };
  }
  async function crmLog(a: any) {
    const c = await ensureContact(a.contact);
    await sql`insert into verghe.interactions (contact_id, kind, summary) values (${c.id}, ${a.kind || 'note'}, ${a.summary})`;
    if (a.next_action || a.next_date) await sql`update verghe.contacts set next_action = coalesce(${a.next_action ?? null}, next_action), next_date = coalesce(${a.next_date ?? null}::date, next_date), updated_at = now() where id = ${c.id}`;
    return { saved: true, contact: c.name };
  }

  /* ---------- team tasks ---------- */
  async function taskAdd(a: any) {
    if (!a.title) return { error: 'need title' };
    const r = await sql`insert into verghe.tasks (title, assignee, assignee_email, due, source) values (${a.title}, ${a.assignee ?? null}, ${a.assignee_email ?? null}, ${a.due ?? null}, ${a.source ?? 'voice'}) returning id`;
    return { saved: true, id: r[0].id };
  }
  const taskList = async (a: any) => ({ open: await sql`select id, title, assignee, due, (due < current_date) as overdue from verghe.tasks where status = 'open'
      ${a?.assignee ? sql`and lower(assignee) like ${'%' + String(a.assignee).toLowerCase() + '%'}` : sql``} order by due nulls last, id limit 25` });
  const taskDone = async (a: any) => ({ done: (await sql`update verghe.tasks set status = 'done', done_at = now() where status = 'open' and
      ${a.id ? sql`id = ${a.id}` : sql`id = (select id from verghe.tasks where status = 'open' and extensions.similarity(lower(title), lower(${a.title ?? ''})) > 0.3 order by extensions.similarity(lower(title), lower(${a.title ?? ''})) desc limit 1)`} returning id, title`) });

  /* ---------- invoices (Google Doc + register, he sends it after a yes) ---------- */
  function parseItems(s: string) {
    // "Монтаж ролика x1 1500; Озвучка x2 200" or "Монтаж ролика 1500"
    return String(s || '').split(/[;\n]+/).map(p => p.trim()).filter(Boolean).map(p => {
      const m = p.match(/^(.*?)(?:\s*[x×х]\s*(\d+(?:[.,]\d+)?))?\s+(\d+(?:[.,]\d+)?)\s*$/i);
      if (!m) return null;
      const qty = m[2] ? Number(m[2].replace(',', '.')) : 1, price = Number(m[3].replace(',', '.'));
      return { desc: m[1].trim(), qty, price, sum: Math.round(qty * price * 100) / 100 };
    }).filter(Boolean) as { desc: string; qty: number; price: number; sum: number }[];
  }
  async function invoiceCreate(a: any) {
    const items = parseItems(a.items); if (!items.length) return { error: 'items like "Монтаж ролика x1 1500; Озвучка x2 200"' };
    const cur = (a.currency || 'USD').toUpperCase(), total = items.reduce((s, i) => s + i.sum, 0);
    const c = a.client ? await ensureContact(a.client) : null;
    if (c && a.client_email && !c.email) await sql`update verghe.contacts set email = ${a.client_email} where id = ${c.id}`;
    const year = today().slice(0, 4);
    const [{ n }] = await sql`select count(*)::int + 1 as n from verghe.invoices where number like ${'INV-' + year + '-%'}`;
    const number = `INV-${year}-${String(n).padStart(3, '0')}`, due = a.due || today(Number(a.due_days) || 7);
    const text = [`СЧЁТ / INVOICE ${number}`, `Дата: ${today()}    Оплатить до: ${due}`, '',
      'От: VERGHÉTHORN — AI Film & Commercial Studio · verghethorn.com · verghethorn@gmail.com',
      `Кому: ${a.client}${a.client_email || c?.email ? ' · ' + (a.client_email || c?.email) : ''}`, '',
      ...items.map((i, k) => `${k + 1}. ${i.desc} — ${i.qty} × ${money(i.price, cur)} = ${money(i.sum, cur)}`), '',
      `ИТОГО: ${money(total, cur)}`, '', a.payment_details ? `Реквизиты: ${a.payment_details}` : 'Реквизиты для оплаты: по запросу.', '', 'Спасибо за сотрудничество!'].join('\n');
    const doc = await ctx.zap('google_docs_create_document_from_text', { title: `${number} — ${a.client}`, file: text, output_hint: 'Only: document title and URL.' });
    const url = docUrl(doc);
    await sql`insert into verghe.invoices (number, contact_id, client, client_email, items, total, currency, due, doc)
      values (${number}, ${c?.id ?? null}, ${a.client}, ${a.client_email ?? c?.email ?? null}, ${sql.json(items)}, ${total}, ${cur}, ${due}, ${url})`;
    if (c) await sql`insert into verghe.interactions (contact_id, kind, summary) values (${c.id}, 'invoice', ${`счёт ${number} на ${money(total, cur)}`})`;
    return { created: true, number, total: money(total, cur), due, doc_url: url, client_email: a.client_email ?? c?.email ?? null, next: 'read him the total; send with send_email only after his yes, then invoice_status sent' };
  }
  const invoiceList = async (a: any) => ({ invoices: await sql`select number, client, total::float, currency, due, status, (status = 'sent' and due < current_date) as overdue
      from verghe.invoices where ${a?.status ? sql`status = ${a.status}` : sql`status in ('draft','sent')`} order by due limit 20` });
  const invoiceStatus = async (a: any) => {
    const st = ['sent', 'paid', 'cancelled'].includes(a.status) ? a.status : 'paid';
    return { updated: (await sql`update verghe.invoices set status = ${st}, paid_at = case when ${st} = 'paid' then now() else paid_at end where number = ${String(a.number || '').toUpperCase()} returning number, status`) };
  };

  /* ---------- meetings: prep before, minutes after ---------- */
  async function meetingPrep(a: any) {
    const now = new Date(), end = new Date(now.getTime() + (Number(a?.hours) || 24) * 3600e3);
    const ev: any = await ctx.findEvents(now.toISOString(), end.toISOString(), a?.search);
    const list = Array.isArray(ev?.results) ? ev.results.slice(0, 3) : [];
    if (!list.length) return { meetings: [], note: 'no meetings in this window' };
    const out = [];
    for (const e of list) {
      const title = e.title || e.summary || '', who = a?.person || title.replace(/^(встреча|звонок|meeting|call)\s*(с|with)?\s*/i, '');
      const c = await findContact(who);
      const mails: any = c?.email ? await ctx.findEmails(`from:(${c.email}) OR to:(${c.email}) newer_than:60d`) : null;
      out.push({ event: { title, start: e.start?.dateTime || e.start, location: e.location }, crm: c ? await dossier(c) : null, recent_emails: mails?.results?.slice?.(0, 4) ?? null });
    }
    return { meetings: out };
  }
  async function meetingSave(a: any) {
    const title = a.title || `Встреча ${today()}`;
    const tasks = String(a.tasks || '').split(/[;\n]+/).map(s => s.trim()).filter(Boolean);
    const text = [`ПРОТОКОЛ: ${title}`, `Дата: ${today()}`, a.attendees ? `Участники: ${a.attendees}` : '', '', 'Кратко:', a.summary || '', '',
      a.decisions ? `Решения:\n${String(a.decisions).split(/[;\n]+/).map((s: string) => '• ' + s.trim()).join('\n')}` : '', '',
      tasks.length ? `Задачи:\n${tasks.map(t => '☐ ' + t).join('\n')}` : ''].filter((x, i, arr) => x || arr[i - 1]).join('\n');
    const doc = await ctx.zap('google_docs_create_document_from_text', { title: `Протокол — ${title}`, file: text, output_hint: 'Only: document title and URL.' });
    const url = docUrl(doc);
    await sql`insert into verghe.meetings (title, attendees, summary, decisions, doc) values (${title}, ${a.attendees ?? null}, ${a.summary ?? null}, ${a.decisions ?? null}, ${url})`;
    for (const t of tasks) { // "Аня: смонтировать тизер до 2026-11-15"
      const m = t.match(/^([^:]{2,30}):\s*(.+?)(?:\s+до\s+(\d{4}-\d{2}-\d{2}))?$/);
      await sql`insert into verghe.tasks (title, assignee, due, source) values (${m ? m[2] : t}, ${m ? m[1].trim() : null}, ${m?.[3] ?? null}, ${'meeting: ' + title})`;
    }
    if (a.client) { const c = await ensureContact(a.client); await sql`insert into verghe.interactions (contact_id, kind, summary) values (${c.id}, 'meeting', ${(a.summary || title).slice(0, 500)})`; }
    return { saved: true, doc_url: url, tasks_added: tasks.length, next: 'offer to email the minutes to attendees (send_email only after his yes)' };
  }

  /* ---------- what matters today (for the morning note and briefing) ---------- */
  async function today_() {
    const [t, d, inv, f] = await Promise.all([
      sql`select title, assignee, due from verghe.tasks where status = 'open' and due <= current_date order by due limit 6`,
      sql`select d.title, d.next_step, c.name as client from verghe.deals d left join verghe.contacts c on c.id = d.contact_id where d.stage not in ('won','lost') and d.due <= current_date limit 5`,
      sql`select number, client, total::float, currency, due from verghe.invoices where status = 'sent' and due < current_date limit 5`,
      sql`select name, next_action from verghe.contacts where next_date <= current_date limit 5`,
    ]);
    return { tasks_due: t, deals_due: d, overdue_invoices: inv, contacts_to_reach: f };
  }

  /* ---------- web search (free: DuckDuckGo HTML, Wikipedia as fallback) ---------- */
  const clean = (x: string) => x.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, ' ').trim();
  async function webSearch(a: any) {
    const q = String(a.query || '').trim(); if (!q) return { error: 'need query' };
    const out: any = { query: q, results: [] as any[] };
    try {
      const r = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', 'Accept-Language': 'ru,en;q=0.8' } });
      const h = await r.text();
      for (const m of h.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g)) {
        let url = m[1]; const u = url.match(/uddg=([^&]+)/); if (u) url = decodeURIComponent(u[1]);
        if (/duckduckgo\.com\/y\.js/.test(url)) continue; // ads
        out.results.push({ title: clean(m[2]), snippet: clean(m[3]).slice(0, 240), url });
        if (out.results.length >= 6) break;
      }
    } catch { /* fallback below */ }
    if (!out.results.length) {
      const lang = /[а-яё]/i.test(q) ? 'ru' : 'en';
      const w = await (await fetch(`https://${lang}.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=5&srsearch=${encodeURIComponent(q)}`, { headers: { 'User-Agent': 'VERGHE-assistant/1.0 (verghethorn.com)' } })).json();
      out.results = (w.query?.search || []).map((x: any) => ({ title: x.title, snippet: clean(x.snippet), url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(x.title.replace(/ /g, '_'))}` }));
      out.source = 'Wikipedia';
    } else out.source = 'DuckDuckGo';
    return out;
  }

  const actions: Record<string, (a: any) => Promise<unknown>> = {
    crm_contact_save: contactSave, crm_find: crmFind, deal_save: dealSave, crm_pipeline: () => pipeline(), crm_log: crmLog,
    task_add: taskAdd, task_list: taskList, task_done: taskDone,
    invoice_create: invoiceCreate, invoice_list: invoiceList, invoice_status: invoiceStatus,
    meeting_prep: meetingPrep, meeting_save: meetingSave, office_today: () => today_(), web_search: webSearch,
  };
  const write: Record<string, (a: any) => string> = {
    crm_contact_save: a => `CRM контакт: ${a.name ?? a.email}`, deal_save: a => `сделка: ${a.title ?? a.id ?? ''} ${a.stage ? '→ ' + (STAGE_RU[a.stage] ?? a.stage) : ''}`.trim(),
    crm_log: a => `CRM ${a.contact}: ${String(a.summary).slice(0, 60)}`, task_add: a => `задача${a.assignee ? ' для ' + a.assignee : ''}: ${a.title}`,
    task_done: a => `задача выполнена: ${a.id ?? a.title}`, invoice_create: a => `счёт: ${a.client}`, invoice_status: a => `счёт ${a.number} → ${a.status ?? 'paid'}`,
    meeting_save: a => `протокол: ${a.title ?? 'встреча'}`,
  };
  return { actions, write, today: today_ };
}
