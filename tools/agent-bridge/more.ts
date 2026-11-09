// VERGHE bridge — markets & crypto, maps, music, replies. Free public data only; numbers come from the APIs, never invented.
// Information only: no trading, no buying, no personal investment advice.
type Ctx = {
  sql: any; cached: <T>(key: string, ttlMin: number, fn: () => Promise<T>) => Promise<[T, boolean]>;
  city: () => Promise<string>; findEmails: (q: string) => Promise<any>; zap: (name: string, args: Record<string, unknown>) => Promise<any>;
  mail: (subject: string, body: string) => Promise<any>;
  convert: (amount: number, from: string, to: string) => Promise<any>;
};

const UA = { 'User-Agent': 'VERGHE-personal-assistant/1.0 (verghethorn.com)', Accept: 'application/json' };
const getJSON = async (url: string, headers: Record<string, string> = UA) => {
  for (let i = 0; ; i++) { // one polite retry on rate limits (free APIs share IPs)
    const r = await fetch(url, { headers });
    if (r.ok) return r.json();
    if (r.status === 429 && i < 1) { await new Promise(res => setTimeout(res, 2500)); continue; }
    throw new Error(`${new URL(url).host} ${r.status}`);
  }
};
/* Coinbase spot price: fallback when CoinGecko is rate-limited */
const cbSpot = async (sym: string) => Number((await getJSON(`https://api.coinbase.com/v2/prices/${sym.toUpperCase()}-USD/spot`)).data.amount);
const round = (n: number, d = 2) => n == null ? null : Math.round(n * 10 ** d) / 10 ** d;
const enc = encodeURIComponent;

export function more(ctx: Ctx) {
  const { sql, cached, city } = ctx;

  /* ---------- crypto (CoinGecko public API + alternative.me Fear & Greed) ---------- */
  const CG = 'https://api.coingecko.com/api/v3';
  const ALIAS: Record<string, string> = {
    btc: 'bitcoin', 'биткоин': 'bitcoin', 'биток': 'bitcoin', eth: 'ethereum', 'эфир': 'ethereum', 'эфириум': 'ethereum', sol: 'solana', 'солана': 'solana',
    bnb: 'binancecoin', xrp: 'ripple', ton: 'the-open-network', 'тон': 'the-open-network', usdt: 'tether', usdc: 'usd-coin', doge: 'dogecoin', 'доги': 'dogecoin',
    ada: 'cardano', trx: 'tron', avax: 'avalanche-2', link: 'chainlink', dot: 'polkadot', pol: 'polygon-ecosystem-token', matic: 'polygon-ecosystem-token',
    ltc: 'litecoin', shib: 'shiba-inu', pepe: 'pepe', sui: 'sui', near: 'near', apt: 'aptos', arb: 'arbitrum', op: 'optimism', not: 'notcoin', xaut: 'tether-gold', paxg: 'pax-gold',
  };
  async function coinId(s: string) {
    const k = String(s).trim().toLowerCase(); if (ALIAS[k]) return ALIAS[k];
    const [v] = await cached(`cgid:${k}`, 60 * 24 * 7, async () => { const r = await getJSON(`${CG}/search?query=${enc(k)}`); return r.coins?.[0]?.id ? { id: r.coins[0].id } : { error: `coin not found: ${s}` }; });
    if ((v as any).error) throw new Error((v as any).error); return (v as any).id as string;
  }
  async function markets(ids: string[], vs = 'usd') {
    const [v] = await cached(`cgm:${vs}:${ids.sort().join(',')}`, 2, async () => getJSON(`${CG}/coins/markets?vs_currency=${vs}&ids=${ids.join(',')}&price_change_percentage=1h,24h,7d,30d`));
    return v as any[];
  }
  const coinRow = (c: any, vs: string) => ({
    name: c.name, symbol: c.symbol?.toUpperCase(), rank: c.market_cap_rank, price: c.current_price, currency: vs.toUpperCase(),
    change_1h_pct: round(c.price_change_percentage_1h_in_currency), change_24h_pct: round(c.price_change_percentage_24h_in_currency ?? c.price_change_percentage_24h), change_7d_pct: round(c.price_change_percentage_7d_in_currency), change_30d_pct: round(c.price_change_percentage_30d_in_currency),
    high_24h: c.high_24h, low_24h: c.low_24h, market_cap: c.market_cap, volume_24h: c.total_volume, ath: c.ath, from_ath_pct: round(c.ath_change_percentage), updated: c.last_updated,
  });
  async function cryptoPrice(a: any) {
    const vs = String(a.vs || 'usd').toLowerCase();
    const ids = await Promise.all(String(a.coins || 'btc').split(/[,\s]+/).filter(Boolean).slice(0, 10).map(coinId));
    try {
      const rows = await markets([...new Set(ids)], vs);
      return { coins: rows.map(c => coinRow(c, vs)), source: 'CoinGecko' };
    } catch (e) { // CoinGecko busy: plain spot prices from Coinbase
      const syms = ids.map(id => Object.entries(ALIAS).find(([k, v]) => v === id && /^[a-z]{2,5}$/.test(k))?.[0]).filter(Boolean) as string[];
      if (!syms.length) throw e;
      const coins = await Promise.all(syms.map(async s => ({ symbol: s.toUpperCase(), price: await cbSpot(s).catch(() => null), currency: 'USD' })));
      return { coins, source: 'Coinbase (short form: CoinGecko is busy, no % changes right now)' };
    }
  }
  async function fearGreed() {
    const [v] = await cached('fng', 30, async () => { const r = await getJSON('https://api.alternative.me/fng/?limit=2'); return { today: r.data?.[0], yesterday: r.data?.[1] }; });
    const t = (v as any).today, y = (v as any).yesterday;
    return t ? { value: Number(t.value), label: t.value_classification, yesterday: y ? Number(y.value) : null } : null;
  }
  async function cryptoMarket() {
    const [v] = await cached('cg:overview', 5, async () => {
      const [g, top, tr] = await Promise.all([getJSON(`${CG}/global`), getJSON(`${CG}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&price_change_percentage=24h`), getJSON(`${CG}/search/trending`)]);
      const d = g.data, sorted = [...top].filter((c: any) => c.price_change_percentage_24h != null).sort((a: any, b: any) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      const mini = (c: any) => ({ symbol: c.symbol.toUpperCase(), name: c.name, price: c.current_price, change_24h_pct: round(c.price_change_percentage_24h) });
      return {
        total_market_cap_usd: Math.round(d.total_market_cap.usd), market_cap_change_24h_pct: round(d.market_cap_change_percentage_24h_usd),
        btc_dominance_pct: round(d.market_cap_percentage.btc, 1), eth_dominance_pct: round(d.market_cap_percentage.eth, 1),
        top_gainers_top100: sorted.slice(0, 3).map(mini), top_losers_top100: sorted.slice(-3).reverse().map(mini),
        trending: tr.coins?.slice(0, 7).map((x: any) => `${x.item.name} (${x.item.symbol})`),
      };
    });
    return { ...(v as object), fear_greed: await fearGreed().catch(() => null), source: 'CoinGecko, alternative.me' };
  }
  async function coinInfo(a: any) {
    const id = await coinId(a.coin || 'btc');
    const [v] = await cached(`cginfo:${id}`, 60 * 24, async () => {
      const c = await getJSON(`${CG}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
      return {
        name: c.name, symbol: c.symbol?.toUpperCase(), categories: c.categories?.slice(0, 4), launched: c.genesis_date, homepage: c.links?.homepage?.[0],
        about: String(c.description?.en || '').replace(/<[^>]+>/g, '').slice(0, 700), rank: c.market_cap_rank,
        circulating_supply: c.market_data?.circulating_supply, max_supply: c.market_data?.max_supply, ath: c.market_data?.ath?.usd, ath_date: c.market_data?.ath_date?.usd?.slice(0, 10),
      };
    });
    return v;
  }
  async function cryptoChart(a: any) {
    const id = await coinId(a.coin || 'btc'), days = Math.min(365, Math.max(1, Number(a.days) || 30));
    const [v] = await cached(`cgch:${id}:${days}`, 30, async () => {
      const r = await getJSON(`${CG}/coins/${id}/market_chart?vs_currency=usd&days=${days}`); const p = r.prices.map((x: number[]) => x[1]);
      const min = Math.min(...p), max = Math.max(...p), first = p[0], last = p[p.length - 1];
      return { coin: id, days, start: round(first), now: round(last), change_pct: round((last / first - 1) * 100), low: round(min), high: round(max), from_high_pct: round((last / max - 1) * 100) };
    });
    return v;
  }
  async function cryptoConvert(a: any) {
    const id = await coinId(a.coin || 'btc'), to = String(a.to || 'usd').toUpperCase(), amount = Number(a.amount) || 1;
    const [m] = await markets([id]); if (!m?.current_price) return { error: `no price for ${id}` };
    const usd = amount * m.current_price;
    if (to === 'USD') return { amount, coin: m.symbol.toUpperCase(), to, result: round(usd, 2), price_usd: m.current_price };
    const c = await ctx.convert(usd, 'USD', to); if (c.error) return c;
    return { amount, coin: m.symbol.toUpperCase(), to, result: c.result, price_usd: m.current_price, usd_rate: c.rate };
  }

  /* ---------- stocks, indices, gold, oil, fiat (Yahoo Finance public chart endpoint) ---------- */
  const TICK: Record<string, string> = {
    gold: 'GC=F', 'золото': 'GC=F', silver: 'SI=F', 'серебро': 'SI=F', oil: 'BZ=F', brent: 'BZ=F', 'нефть': 'BZ=F', gas: 'NG=F',
    sp500: '^GSPC', 's&p': '^GSPC', nasdaq: '^IXIC', dow: '^DJI', bist: 'XU100.IS', bist100: 'XU100.IS', dax: '^GDAXI', nikkei: '^N225', vix: '^VIX',
    apple: 'AAPL', tesla: 'TSLA', nvidia: 'NVDA', microsoft: 'MSFT', google: 'GOOGL', amazon: 'AMZN', meta: 'META', coinbase: 'COIN', microstrategy: 'MSTR', strategy: 'MSTR',
    dxy: 'DX-Y.NYB', 'usdtry': 'TRY=X', 'eurusd': 'EURUSD=X', 'usdrub': 'RUB=X', 'usdaed': 'AED=X', 'usdegp': 'EGP=X',
  };
  async function marketQuote(a: any) {
    const syms = String(a.symbols || 'gold').split(/[,]+/).map(s => s.trim()).filter(Boolean).slice(0, 8);
    const out = await Promise.all(syms.map(async s => {
      const t = TICK[s.toLowerCase()] || s.toUpperCase();
      try {
        const [v] = await cached(`yq:${t}`, 5, async () => {
          const r = await getJSON(`https://query1.finance.yahoo.com/v8/finance/chart/${enc(t)}?range=1mo&interval=1d`, { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' });
          const m = r.chart?.result?.[0]; if (!m) return { error: `not found: ${s}` };
          const closes = (m.indicators?.quote?.[0]?.close || []).filter((x: number | null) => x != null), mp = m.meta;
          return { symbol: t, name: mp.shortName || mp.longName || t, price: round(mp.regularMarketPrice, 4), currency: mp.currency, prev_close: round(mp.chartPreviousClose ?? mp.previousClose, 4),
            change_1d_pct: closes.length > 1 ? round((mp.regularMarketPrice / closes[closes.length - 2] - 1) * 100) : null, change_1m_pct: closes.length ? round((mp.regularMarketPrice / closes[0] - 1) * 100) : null, market_time: new Date(mp.regularMarketTime * 1000).toISOString() };
        });
        return { query: s, ...(v as object) };
      } catch (e) { return { query: s, error: String(e) }; }
    }));
    return { quotes: out, source: 'Yahoo Finance (may be delayed)' };
  }

  /* ---------- portfolio (his own holdings, stored privately) ---------- */
  async function portfolioSet(a: any) {
    const asset = String(a.asset || '').toLowerCase().trim(); if (!asset) return { error: 'need asset' };
    if (Number(a.amount) === 0) { await sql`delete from verghe.holdings where asset = ${asset}`; return { removed: asset }; }
    const id = a.kind === 'stock' ? asset : await coinId(asset);
    await sql`insert into verghe.holdings (asset, kind, amount, cost_usd) values (${id}, ${a.kind || 'crypto'}, ${Number(a.amount)}, ${a.cost_usd ?? null})
              on conflict (asset) do update set amount = excluded.amount, cost_usd = coalesce(excluded.cost_usd, verghe.holdings.cost_usd), updated_at = now()`;
    return { saved: true, asset: id, amount: Number(a.amount) };
  }
  async function portfolioView() {
    const h = await sql`select asset, kind, amount::float, cost_usd::float from verghe.holdings order by asset`;
    if (!h.length) return { empty: true, hint: 'tell me what you hold, e.g. "у меня 0.5 биткоина"' };
    const crypto = h.filter((x: any) => x.kind === 'crypto');
    const rows = crypto.length ? await markets(crypto.map((x: any) => x.asset)) : [];
    const items = crypto.map((x: any) => {
      const m = rows.find((r: any) => r.id === x.asset); const value = m ? x.amount * m.current_price : null;
      const ch = m?.price_change_percentage_24h_in_currency ?? m?.price_change_percentage_24h;
      return { asset: m?.symbol?.toUpperCase() || x.asset, amount: x.amount, price: m?.current_price, value_usd: round(value), change_24h_pct: round(ch), pnl_usd: x.cost_usd != null && value != null ? round(value - x.cost_usd) : null };
    });
    const total = items.reduce((s: number, i: any) => s + (i.value_usd || 0), 0);
    const change = items.reduce((s: number, i: any) => s + (i.value_usd && i.change_24h_pct != null ? i.value_usd - i.value_usd / (1 + i.change_24h_pct / 100) : 0), 0);
    return { total_usd: round(total), change_24h_usd: round(change), items, note: 'information only, not investment advice' };
  }

  /* ---------- price alerts: checked every 10 minutes, email when crossed ---------- */
  async function alertAdd(a: any) {
    const kind = a.kind === 'market' ? 'market' : 'crypto';
    const asset = kind === 'crypto' ? await coinId(a.asset || 'btc') : (TICK[String(a.asset).toLowerCase()] || String(a.asset).toUpperCase());
    const dir = a.direction === 'below' ? 'below' : 'above', target = Number(a.target); if (!target) return { error: 'need target price' };
    const r = await sql`insert into verghe.price_alerts (asset, kind, direction, target, vs, note) values (${asset}, ${kind}, ${dir}, ${target}, ${String(a.vs || 'usd').toLowerCase()}, ${a.note ?? null}) returning id`;
    return { saved: true, id: r[0].id, asset, direction: dir, target };
  }
  const alertList = async () => ({ active: await sql`select id, asset, direction, target::float, vs, note, created_at::date as since from verghe.price_alerts where status = 'active' order by id` });
  const alertRemove = async (a: any) => ({ removed: (await sql`update verghe.price_alerts set status = 'cancelled' where id = ${a.id} and status = 'active' returning id`).length });
  async function alertsCheck() {
    const act = await sql`select * from verghe.price_alerts where status = 'active'`; if (!act.length) return { checked: 0 };
    const fired: string[] = [];
    const cryptoIds = [...new Set(act.filter((x: any) => x.kind === 'crypto').map((x: any) => x.asset))];
    let rows: any[] = []; try { rows = cryptoIds.length ? await markets(cryptoIds) : []; } catch { /* fallback below */ }
    for (const al of act) {
      let price: number | undefined;
      if (al.kind === 'crypto') {
        const m = rows.find((r: any) => r.id === al.asset);
        price = m?.current_price;
        if (price == null) { const sym = Object.entries(ALIAS).find(([k, v]) => v === al.asset && /^[a-z]{2,5}$/.test(k))?.[0]; if (sym) price = await cbSpot(sym).catch(() => undefined); }
        if (price != null && al.vs !== 'usd') { const c = await ctx.convert(price, 'USD', al.vs); price = c.result; }
      }
      else { const q: any = (await marketQuote({ symbols: al.asset })).quotes[0]; price = q?.price; }
      if (price == null) continue;
      const hit = al.direction === 'above' ? price >= Number(al.target) : price <= Number(al.target);
      await sql`update verghe.price_alerts set last_price = ${price} ${hit ? sql`, status = 'triggered', triggered_at = now()` : sql``} where id = ${al.id}`;
      if (hit) fired.push(`${al.asset.toUpperCase()} ${al.direction === 'above' ? 'поднялся выше' : 'опустился ниже'} ${Number(al.target).toLocaleString('ru-RU')} ${al.vs.toUpperCase()} — сейчас ${Number(price).toLocaleString('ru-RU')}${al.note ? ` (${al.note})` : ''}`);
    }
    if (fired.length) await ctx.mail(`VERGHE · сработал алерт: ${fired[0].split(' ')[0]}`, `${fired.join('\n')}\n\nЭто информация, не инвестиционный совет.\n— VERGHE`);
    return { checked: act.length, fired };
  }

  /* ---------- maps: places & routes (OpenStreetMap / OSRM, free) + Google Maps links to open ---------- */
  const PH = 'https://photon.komoot.io/api/';
  const label = (p: any) => [p.street && `${p.street}${p.housenumber ? ' ' + p.housenumber : ''}`, p.district || p.locality, p.city].filter(Boolean).join(', ');
  async function geocode(q: string, bias?: { lat: number; lon: number }) {
    const [v] = await cached(`geo:${q.toLowerCase()}${bias ? `@${bias.lat.toFixed(1)},${bias.lon.toFixed(1)}` : ''}`, 60 * 24 * 30, async () => {
      const r = await getJSON(`${PH}?limit=1&q=${enc(q)}${bias ? `&lat=${bias.lat}&lon=${bias.lon}&location_bias_scale=0.3` : ''}`); const f = r.features?.[0];
      return f ? { lat: f.geometry.coordinates[1], lon: f.geometry.coordinates[0], name: f.properties.name } : { error: `place not found: ${q}` };
    });
    if ((v as any).error) throw new Error((v as any).error); return v as { lat: number; lon: number; name: string };
  }
  async function placesSearch(a: any) {
    const near = a.near || await city(), q = String(a.query || 'restaurant');
    const out: any = { query: q, near, google_maps: `https://www.google.com/maps/search/?api=1&query=${enc(`${q} ${near}`)}` };
    try {
      const c = await geocode(near);
      const r = await getJSON(`${PH}?limit=8&lat=${c.lat}&lon=${c.lon}&location_bias_scale=0.5&q=${enc(q)}`);
      out.results = (r.features || []).filter((f: any) => f.properties.name).slice(0, 6).map((f: any) => {
        const [lon, lat] = f.geometry.coordinates, km = Math.hypot((lat - c.lat) * 111, (lon - c.lon) * 111 * Math.cos(c.lat * Math.PI / 180));
        return { name: f.properties.name, type: f.properties.osm_value, address: label(f.properties), distance_km: round(km, 1), maps: `https://www.google.com/maps/search/?api=1&query=${enc(f.properties.name + ' ' + (f.properties.city || near))}` };
      }).filter((x: any) => x.distance_km <= 15);
    } catch { out.results = []; }
    out.note = 'OpenStreetMap data: no ratings or opening hours — for those open google_maps';
    return out;
  }
  async function route(a: any) {
    const mode = ['walking', 'cycling', 'transit'].includes(a.mode) ? a.mode : 'driving';
    const origin = a.from || await city(), dest = a.to; if (!dest) return { error: 'need destination' };
    const gmode = mode === 'cycling' ? 'bicycling' : mode;
    const out: any = { from: origin, to: dest, mode, google_maps: `https://www.google.com/maps/dir/?api=1&origin=${enc(origin)}&destination=${enc(dest)}&travelmode=${gmode}` };
    if (mode === 'transit') return { ...out, note: 'public transport times — open google_maps' };
    try {
      const here = await geocode(await city()).catch(() => undefined); // landmarks resolve near where he is now
      const [A, B] = await Promise.all([geocode(origin, here), geocode(dest, here)]);
      const crow = Math.hypot((A.lat - B.lat) * 111, (A.lon - B.lon) * 111 * Math.cos(A.lat * Math.PI / 180));
      if ((mode === 'walking' && crow > 60) || crow > 3000) return { ...out, note: 'could not place both points reliably — open google_maps' };
      const prof = mode === 'walking' ? 'routed-foot/route/v1/foot' : mode === 'cycling' ? 'routed-bike/route/v1/bike' : 'routed-car/route/v1/driving';
      const r = await getJSON(`https://routing.openstreetmap.de/${prof}/${A.lon},${A.lat};${B.lon},${B.lat}?overview=false`);
      const rt = r.routes?.[0];
      if (rt) Object.assign(out, { distance_km: round(rt.distance / 1000, 1), duration_min: Math.round(rt.duration / 60), note: mode === 'driving' ? 'without live traffic — real time can be longer; google_maps shows traffic' : undefined });
    } catch (e) { out.error = String(e); }
    return out;
  }

  /* ---------- music: open search / mood playlists in his favourite service ---------- */
  function musicLinks(a: any) {
    const q = String(a.query || 'deep focus music'), e = enc(q);
    const all: Record<string, string> = {
      spotify: `https://open.spotify.com/search/${e}`, apple_music: `https://music.apple.com/search?term=${e}`, youtube_music: `https://music.youtube.com/search?q=${e}`,
      yandex_music: `https://music.yandex.ru/search?text=${e}`, soundcloud: `https://soundcloud.com/search?q=${e}`, deezer: `https://www.deezer.com/search/${e}`, anghami: `https://play.anghami.com/search/${e}`,
    };
    const pref = String(a.service || '').toLowerCase().replace(/\s+/g, '_');
    return { query: q, best: all[pref] || all.spotify, links: all };
  }

  /* ---------- emails waiting for his reply ---------- */
  const needsReply = (a: any) => ctx.zap('gmail_find_email', {
    query: `in:inbox newer_than:${Number(a?.days) || 7}d -category:promotions -category:social -category:updates -category:forums -from:me`,
    output_hint: 'Only threads from real people (skip newsletters, no-reply, notifications, receipts) where the most recent message is NOT from verghethorn@gmail.com, i.e. he has not answered yet. Max 6. For each: thread_id, from (name and address), subject, date, one line on what they want.',
  });

  const actions: Record<string, (a: any) => Promise<unknown>> = {
    crypto_price: cryptoPrice, crypto_market: () => cryptoMarket(), coin_info: coinInfo, crypto_chart: cryptoChart, crypto_convert: cryptoConvert,
    market_quote: marketQuote, portfolio_set: portfolioSet, portfolio_view: () => portfolioView(),
    price_alert_add: alertAdd, price_alert_list: () => alertList(), price_alert_remove: alertRemove,
    places_search: placesSearch, route, music_links: async a => musicLinks(a), needs_reply: needsReply,
  };
  const write: Record<string, (a: any) => string> = {
    price_alert_add: a => `алерт: ${a.asset} ${a.direction === 'below' ? '<' : '>'} ${a.target} ${a.vs ?? 'usd'}`, price_alert_remove: a => `алерт снят: ${a.id}`,
    portfolio_set: a => `портфель: ${a.asset} = ${a.amount}`,
  };
  return { actions, write, jobs: { alerts_check: () => alertsCheck() } };
}
