/* Nakhlio — mobile web app prototype (installable PWA). */
(function () {
'use strict';

/* ---------- extra texts used by screens ---------- */
const EXTRA = {
  en: { catalog: 'Catalog', nothing: 'Nothing found', nothing_d: 'Try another word or open a section below.', all_sections: 'All sections', price_from: 'Price', title_f: 'Title', category: 'Category', photo: 'Photos', add_photo: 'Add photos', demo_pay: 'demo', post_parcel: 'Post a trip or request', agree_rules: 'I have read the rules. I carry only open items and check the contents myself.', what: 'What', weight: 'Weight', kg: 'kg', date: 'Date', from_to: 'Route', guest: 'Guest', you: 'You', client_lang: 'Client language', top: 'Top', pro: 'PRO', yours: 'yours', members: 'members', room_hello: 'Assalamu alaikum! Welcome to the room.', room_rule: 'Remember the Majlis rules: no politics, no religious disputes.', write_room: 'Write to the room…', km: 'km', min: 'min', any: 'Anyone', audience: 'Suitable for', term_l: 'Rental term', cc: 'Engine', open_maps: 'Location on the map', walk_to: 'walk', open: 'Open', help_post: 'Offer help', ask_family: 'Ask parents', q_tag: 'Question', e_tag: 'Experience', comment: 'Comment', reply: 'Reply', dm: 'Message privately', reply_to: 'Replying to', comments_t: 'Questions & comments', comment_ph: 'Write a comment…', seller: 'Author', on_since: 'on Nakhlio since', langs_spoken: 'Speaks', event_org: 'Organiser', auto_tr: 'Translated automatically' },
  ru: { catalog: 'Каталог', nothing: 'Ничего не найдено', nothing_d: 'Попробуйте другое слово или откройте раздел ниже.', all_sections: 'Все разделы', price_from: 'Цена', title_f: 'Заголовок', category: 'Категория', photo: 'Фото', add_photo: 'Добавить фото', demo_pay: 'демо', post_parcel: 'Разместить поездку или запрос', agree_rules: 'Я прочитал правила. Перевожу только открытые вещи и сам проверяю содержимое.', what: 'Что', weight: 'Вес', kg: 'кг', date: 'Дата', from_to: 'Маршрут', guest: 'Гость', you: 'Вы', client_lang: 'Язык клиента', top: 'Топ', pro: 'PRO', yours: 'ваше', members: 'участников', room_hello: 'Ассаляму алейкум! Добро пожаловать в комнату.', room_rule: 'Помните правила Меджлиса: без политики и споров о религии.', write_room: 'Написать в комнату…', km: 'км', min: 'мин', any: 'Всем', audience: 'Подходит', term_l: 'Срок аренды', cc: 'Двигатель', open_maps: 'Место на карте', walk_to: 'пешком', open: 'Открыть', help_post: 'Предложить помощь', ask_family: 'Спросить родителей', q_tag: 'Вопрос', e_tag: 'Опыт', comment: 'Комментировать', reply: 'Ответить', dm: 'Написать лично', reply_to: 'Ответ для', comments_t: 'Вопросы и комментарии', comment_ph: 'Напишите комментарий…', seller: 'Автор', on_since: 'на Nakhlio с', langs_spoken: 'Говорит', event_org: 'Организатор', auto_tr: 'Переведено автоматически' },
  ar: { catalog: 'الكتالوج', nothing: 'لا توجد نتائج', nothing_d: 'جرّب كلمة أخرى أو افتح قسماً بالأسفل.', all_sections: 'كل الأقسام', price_from: 'السعر', title_f: 'العنوان', category: 'الفئة', photo: 'الصور', add_photo: 'أضف صوراً', demo_pay: 'تجريبي', post_parcel: 'أضف رحلة أو طلباً', agree_rules: 'قرأت القواعد. أنقل الأغراض المفتوحة فقط وأفحص المحتوى بنفسي.', what: 'ماذا', weight: 'الوزن', kg: 'كجم', date: 'التاريخ', from_to: 'المسار', guest: 'زائر', you: 'أنت', client_lang: 'لغة العميل', top: 'مميز', pro: 'PRO', yours: 'إعلانك', members: 'عضو', room_hello: 'السلام عليكم! أهلاً بك في الغرفة.', room_rule: 'تذكّر قواعد المجلس: لا سياسة ولا جدال في الدين.', write_room: 'اكتب في الغرفة…', km: 'كم', min: 'د', any: 'للجميع', audience: 'مناسب لـ', term_l: 'مدة الإيجار', cc: 'المحرك', open_maps: 'الموقع على الخريطة', walk_to: 'مشياً', open: 'فتح', help_post: 'اعرض مساعدة', ask_family: 'اسأل الأهالي', q_tag: 'سؤال', e_tag: 'تجربة', comment: 'تعليق', reply: 'رد', dm: 'رسالة خاصة', reply_to: 'رداً على', comments_t: 'الأسئلة والتعليقات', comment_ph: 'اكتب تعليقاً…', seller: 'صاحب الإعلان', on_since: 'في نخليو منذ', langs_spoken: 'يتحدث', event_org: 'المنظّم', auto_tr: 'ترجمة تلقائية' },
};
for (const k in EXTRA) Object.assign(I18N[k], EXTRA[k]);

/* ---------- state ---------- */
const KEY = 'nakhlio_v1';
let S = {};
try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
S.saved = S.saved || []; S.chats = S.chats || {}; S.going = S.going || {}; S.posts = S.posts || {}; S.req = S.req || {}; S.reported = S.reported || {}; S.helped = S.helped || {}; S.cm = S.cm || {};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

const DEMO = !!window.NAKHLIO_DEMO || /[?&]demo=1/.test(location.search);
if (DEMO) { S.demoSkip = true; try { localStorage.setItem('nakhlio_v1', JSON.stringify(S)); } catch (e) {} }
const browserLang = (() => { const n = (navigator.language || 'en').slice(0, 2); return LANGS.some(l => l.code === n) ? n : 'en'; })();
let lang = S.lang || browserLang;
const TRL = () => (window.TR && window.TR[lang]) || { u: {}, c: {} };
const t = (k) => (I18N[lang] && I18N[lang][k]) || TRL().u[k] || I18N.en[k] || k;
const L = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang] || (o.en && TRL().c[o.en]) || o.en || o.ru || ''));
const dir = () => (LANGS.find(l => l.code === lang) || {}).dir || 'ltr';
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const locale = () => ({ ar: 'ar-SA', fa: 'fa-IR', ur: 'ur-PK', ru: 'ru-RU', tr: 'tr-TR', fr: 'fr-FR', id: 'id-ID', ms: 'ms-MY', bn: 'bn-BD', hi: 'hi-IN' }[lang] || 'en-US');
const nf = (n, d) => new Intl.NumberFormat(locale(), { maximumFractionDigits: d == null ? 0 : d }).format(n);
const money = (n) => nf(n) + ' ' + t('sar');
const img = (name) => 'img/' + name + '.jpg';

/* ---------- icons ---------- */
const P = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z', heart: 'M12 20s-7-4.4-9.2-8.6C1.4 8.6 3 5 6.6 5c2 0 3.4 1.2 5.4 3.3C14 6.2 15.4 5 17.4 5 21 5 22.6 8.6 21.2 11.4 19 15.6 12 20 12 20z',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0', search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5', back: 'M15 5l-7 7 7 7', chev: 'M9 5l7 7-7 7',
  bed: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 14h18M3 18v2M21 18v2M7 9V6h10v3', bath: 'M4 12h16v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM6 12V5a2 2 0 0 1 4 0M7 20l-1 2M17 20l1 2',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 6.5M18 14a6 6 0 0 1 3.5 6', layers: 'M12 3 2 8l10 5 10-5zM2 13l10 5 10-5',
  pin: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', walk: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM10 22l2-7 3 3v4M8 12l2-5 4 1 3 4M10 7l-2 1-2 4',
  car: 'M5 16h14M3 16v-3l2-5h14l2 5v3h-2M3 16h2M7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5 11h14',
  scooter: 'M6 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.5 16.5h7l1.5-6h-3M15 4h2l1 6.5M4 13h6l1 3.5', kick: 'M5 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 17h10M17 17 14 4h3',
  tag: 'M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7.5 7.5h.01', box: 'M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  plane: 'M2.5 13.5 21 6l-3.5 13-5-4-3 3v-5l7.5-6.5-9.5 5.5z', hand: 'M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L3.5 15a1.6 1.6 0 0 1 2.6-1.8L7 14',
  majlis: 'M4 5h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM17 9h3a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1v2.5L16 18h-3',
  male: 'M10 20a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM14.5 9.5 20 4M15 4h5v5', female: 'M12 14a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM12 14v8M9 19h6',
  family: 'M7 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM3 21v-6a4 4 0 0 1 8 0M13 21v-6a4 4 0 0 1 8 0M9.5 21v-2a2.5 2.5 0 0 1 5 0v2',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v5M16 3v5', phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z',
  shield: 'M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6zM8.5 12l2.5 2.5 4.5-5', check: 'M5 12.5 10 17 19 7', send: 'M4 12 20 4l-4 16-4-7zM12 13l8-9',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z', info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 7.5v.5',
  x: 'M6 6l12 12M18 6 6 18', plus: 'M12 5v14M5 12h14', wifi: 'M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5v.5',
  ac: 'M12 2v20M4 7l16 10M20 7 4 17M9 4l3 2 3-2M9 20l3-2 3 2', water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z', power: 'M13 2 4 14h7l-1 8 9-12h-7z',
  parking: 'M5 3h14v18H5zM10 17V7h3.5a3 3 0 0 1 0 6H10', lift: 'M5 3h14v18H5zM9 9l3-3 3 3M9 15l3 3 3-3', kitchen: 'M6 3v8a2 2 0 0 0 2 2v8M10 3v8a2 2 0 0 1-2 2M8 3v6M16 21V3c2 1 3 4 3 7s-1 4-3 4',
  washer: 'M4 3h16v18H4zM12 18a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM7 6h2', cleaning: 'M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z',
  security: 'M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6zM8.5 12l2.5 2.5 4.5-5', pool: 'M2 18c2 1.3 4 1.3 6 0s4-1.3 6 0 4 1.3 6 0M8 15V5a2 2 0 0 1 4 0M16 15V5a2 2 0 0 0-4 0M8 9h8',
  lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3', flag: 'M5 21V4M5 4h11l-2 4 2 4H5', ball: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7l4 3-1.5 4.5h-5L8 10zM12 3v4M16 10l4.5-1.5M14.5 14.5l2.5 4M9.5 14.5 7 18.5M8 10 3.5 8.5',
  tent: 'M3 20 12 4l9 16zM12 4v16M9 20l3-6 3 6', cake: 'M4 20h16v-7H4zM4 15c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 4 0M12 13V9M12 6.5a1.2 1.2 0 0 1 0-2.5c.7 0 1.2 1.2 0 2.5z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2', moon: 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
  up: 'M12 19V5M6 11l6-6 6 6', palette: 'M12 3a9 9 0 0 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-1.3-1-1.5-1-2.5 0-.8.7-1.5 1.5-1.5H16a5 5 0 0 0 5-5c0-4-4-7.5-9-7.5zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1', battery: 'M3 8h15v8H3zM21 11v2M6 11v2M9 11v2',
  seat: 'M7 4h6l1 9H6zM5 13h11l1 4H5zM7 17v3M15 17v3', share: 'M12 15V3M8 7l4-4 4 4M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8', dots: 'M5 12h.01M12 12h.01M19 12h.01',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1', siren: 'M7 18v-5a5 5 0 0 1 10 0v5M5 18h14v3H5zM12 3v2M4.2 6.2l1.4 1.4M19.8 6.2l-1.4 1.4',
  translate: 'M4 5h8M8 3v2M6 5c0 4 2.5 7 6 8M10 5c-.5 3.5-3 7-6 8M13 21l4-9 4 9M14.5 18h5', camera: 'M4 8h3l2-3h6l2 3h3v12H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5v1.5M12 16v1.5',
  headset: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1zM17 20a4 4 0 0 1-4 2h-1', book: 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
  bank: 'M3 6h18v12H3zM3 10h18M7 15h3', sim: 'M7 3h7l4 4v14H7zM10 12h5v5h-5z', idcard: 'M3 5h18v14H3zM8.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.5 16a3 3 0 0 1 6 0M14 9h4M14 13h4',
  train: 'M6 3h12v13H6zM6 10h12M9 19l-2 2M15 19l2 2M9 13.5h.01M15 13.5h.01', grad: 'M2 9l10-5 10 5-10 5zM6 11v5c2 2 10 2 12 0v-5M22 9v6',
  medic: 'M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11zM12 9v5M9.5 11.5h5', contract: 'M6 3h9l4 4v14H6zM9 12h7M9 16h5M14 3v5h5', star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
};
const FILL = { star: 1 };
const ic = (n, cls) => `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="${FILL[n] ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="${FILL[n] ? 0 : 1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;

/* ---------- brand & illustrations ---------- */
const logo = (bg) => `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="${bg || '#0F5C4C'}"/><path d="M15 54V30a17 17 0 0 1 34 0v24z" fill="#F6F1E8"/><g fill="none" stroke="#0F5C4C" stroke-width="2.6" stroke-linecap="round"><path d="M32 52V31"/><path d="M32 31c-4-4-10-4.5-14-1.5"/><path d="M32 31c4-4 10-4.5 14-1.5"/><path d="M32 31c-3-6-8-8.5-12.5-8"/><path d="M32 31c3-6 8-8.5 12.5-8"/><path d="M32 31c-.5-6 .5-10 0-12.5"/></g><circle cx="29" cy="35" r="2.3" fill="#E3A23B"/><circle cx="35" cy="35" r="2.3" fill="#E3A23B"/><circle cx="32" cy="38.5" r="2.3" fill="#E3A23B"/></svg>`;
const palmShape = (x, h, s) => `<g transform="translate(${x} ${120 - h}) scale(${s})"><path d="M0 ${h / s} C2 ${h / s * .6} -2 ${h / s * .3} 0 0" stroke="currentColor" stroke-width="4" fill="none"/><path d="M0 0c-10-8-24-8-32 2 10-3 20-2 32-2zM0 0c10-8 24-8 32 2-10-3-20-2-32-2zM0 0c-6-12-16-16-26-14 9 2 18 7 26 14zM0 0c6-12 16-16 26-14-9 2-18 7-26 14z" fill="currentColor"/></g>`;
const skyline = () => `<svg class="sky" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <circle cx="318" cy="38" r="20" fill="#E3A23B" opacity=".9"/>
  <g color="rgba(255,255,255,.10)">${palmShape(22, 78, 1)}${palmShape(372, 70, .9)}</g>
  <g fill="rgba(255,255,255,.16)">
    <rect x="96" y="34" width="9" height="86"/><path d="M93 36h15l-7.5-16z"/><rect x="97.5" y="12" width="2" height="8"/>
    <rect x="244" y="34" width="9" height="86"/><path d="M241 36h15l-7.5-16z"/><rect x="247.5" y="12" width="2" height="8"/>
    <path d="M128 120V92a46 46 0 0 1 92 0v28z"/>
  </g>
  <path d="M152 92a22 22 0 0 1 44 0z" fill="#2FA07F" opacity=".9"/><rect x="173" y="62" width="2" height="9" fill="#2FA07F"/>
  <g color="rgba(255,255,255,.2)">${palmShape(300, 62, .75)}${palmShape(62, 52, .6)}</g>
  <rect x="0" y="112" width="400" height="8" fill="rgba(255,255,255,.12)"/>
</svg>`;
const phoneIllus = () => `<svg viewBox="0 0 250 230" aria-hidden="true">
  <rect x="70" y="8" width="110" height="214" rx="22" fill="#0A4538" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
  <rect x="78" y="18" width="94" height="194" rx="15" fill="#F6F1E8"/>
  ${[0, 1, 2].map(r => [0, 1, 2].map(c => (r === 1 && c === 1) ? '' : `<rect x="${88 + c * 27}" y="${38 + r * 32}" width="20" height="20" rx="6" fill="${['#E2EFEA', '#FBF0DC', '#E3F0F7', '#F8E6EC'][(r + c) % 4]}"/>`).join('')).join('')}
  <g transform="translate(110 65) scale(.5)">${logo().replace('<svg viewBox="0 0 64 64" aria-hidden="true">', '').replace('</svg>', '')}</g>
  <circle cx="126" cy="81" r="23" fill="none" stroke="#E3A23B" stroke-width="3" stroke-dasharray="5 5"/>
  <rect x="98" y="196" width="54" height="5" rx="2.5" fill="#d8d0c2"/>
  <path d="M188 150c14-6 24 2 30 12" stroke="#E3A23B" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M214 150l5 13-13-3" stroke="#E3A23B" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <g color="rgba(255,255,255,.18)">${palmShape(32, 100, .9).replace('translate(32 20)', 'translate(32 130)')}</g>
</svg>`;
const emptyIllus = (kind) => `<svg viewBox="0 0 160 110" aria-hidden="true"><ellipse cx="80" cy="100" rx="60" ry="7" fill="#E7E1D6"/>
  ${kind === 'chat' ? '<rect x="30" y="22" width="70" height="44" rx="14" fill="#E2EFEA"/><path d="M44 66l-6 12 16-12z" fill="#E2EFEA"/><rect x="66" y="44" width="64" height="38" rx="13" fill="#FBF0DC"/><path d="M116 82l6 10-15-10z" fill="#FBF0DC"/><circle cx="52" cy="44" r="4" fill="#0F5C4C"/><circle cx="65" cy="44" r="4" fill="#0F5C4C"/><circle cx="78" cy="44" r="4" fill="#0F5C4C"/>'
  : kind === 'lock' ? '<rect x="50" y="44" width="60" height="50" rx="12" fill="#F8E6EC"/><path d="M62 44V34a18 18 0 0 1 36 0v10" stroke="#C2577A" stroke-width="7" fill="none"/><circle cx="80" cy="66" r="6" fill="#C2577A"/><rect x="77" y="66" width="6" height="14" rx="3" fill="#C2577A"/>'
  : '<path d="M80 96V48" stroke="#8a6b45" stroke-width="6" stroke-linecap="round"/><path d="M80 48c-14-12-34-10-44 2 14-5 30-4 44-2zM80 48c14-12 34-10 44 2-14-5-30-4-44-2zM80 48c-8-16-22-22-36-18 12 2 26 9 36 18zM80 48c8-16 22-22 36-18-12 2-26 9-36 18z" fill="#0F5C4C"/><circle cx="74" cy="56" r="4" fill="#E3A23B"/><circle cx="84" cy="57" r="4" fill="#E3A23B"/>'}
</svg>`;
const mapSvg = (dist) => {
  const d = Math.max(0.3, Math.min(8, dist));
  const px = 300 - (48 + d * 24);
  return `<svg viewBox="0 0 360 200" aria-hidden="true">
  <rect width="360" height="200" fill="#EFE9DC"/>
  <path d="M0 140C80 120 140 160 220 130S330 90 360 100" stroke="#fff" stroke-width="14" fill="none"/>
  <path d="M90 0C100 60 80 120 110 200M250 0c-10 50 20 110 0 200" stroke="#fff" stroke-width="10" fill="none"/>
  <path d="M0 60h360" stroke="#fff" stroke-width="6"/>
  <ellipse cx="170" cy="40" rx="40" ry="18" fill="#D8E8D6"/><ellipse cx="60" cy="175" rx="34" ry="14" fill="#D8E8D6"/>
  <path d="M${px} 92 Q ${(px + 300) / 2} 60 300 92" stroke="#0F5C4C" stroke-width="3" stroke-dasharray="6 6" fill="none"/>
  <g transform="translate(300 92)"><circle r="20" fill="#0F5C4C" opacity=".12"/><path d="M-11 6V-1a11 11 0 0 1 22 0v7z" fill="#2FA07F"/><rect x="-16" y="-14" width="4" height="20" fill="#0F5C4C"/><rect x="12" y="-14" width="4" height="20" fill="#0F5C4C"/></g>
  <g transform="translate(${px} 92)"><path d="M0 0c-9-9-14-14-14-21a14 14 0 0 1 28 0c0 7-5 12-14 21z" fill="#E3A23B" transform="translate(0 -2)"/><circle cy="-23" r="5" fill="#fff"/></g>
</svg>`; };

/* ---------- prayer times (Umm al-Qura, Medina) ---------- */
function prayerTimes(y, m, d) {
  const lat = 24.4672, lng = 39.6112, tz = 3;
  const rad = x => x * Math.PI / 180, deg = x => x * 180 / Math.PI;
  const fix = (a, b) => { a = a - b * Math.floor(a / b); return a < 0 ? a + b : a; };
  let Y = y, M = m; if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100), B = 2 - A + Math.floor(A / 4);
  const jd0 = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5 - lng / (15 * 24);
  const sun = (jd) => { const D = jd - 2451545; const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
    const Ls = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360), e = 23.439 - 0.00000036 * D;
    const RA = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(Ls)), Math.cos(rad(Ls)))) / 15, 24);
    return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(Ls)))), eqt: q / 15 - RA }; };
  const mid = (tt) => fix(12 - sun(jd0 + tt).eqt, 24);
  const at = (angle, tt, ccw) => { const dc = sun(jd0 + tt).decl; const v = (-Math.sin(rad(angle)) - Math.sin(rad(dc)) * Math.sin(rad(lat))) / (Math.cos(rad(dc)) * Math.cos(rad(lat)));
    const T = deg(Math.acos(Math.max(-1, Math.min(1, v)))) / 15; return mid(tt) + (ccw ? -T : T); };
  const asrA = (tt) => { const dc = sun(jd0 + tt).decl; return -deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(lat - dc)))))); };
  const adj = (h) => (h + tz - lng / 15) * 60;
  const maghrib = adj(at(0.833, 18 / 24, false));
  return { fajr: adj(at(18.5, 5 / 24, true)), sunrise: adj(at(0.833, 6 / 24, true)), dhuhr: adj(mid(12 / 24)) + 1, asr: adj(at(asrA(13 / 24), 13 / 24, false)), maghrib, isha: maghrib + 90 };
}
const medinaNow = () => new Date(Date.now() + 3 * 3600e3);
const hm = (min) => { min = Math.round(min); const h = Math.floor(min / 60) % 24, mm = min % 60; return nf(h) .padStart(2, lang === 'en' ? '0' : '') + ':' + String(mm).padStart(2, '0').replace(/\d/g, x => nf(+x)); };
function nextPrayer() {
  const n = medinaNow(); const cur = n.getUTCHours() * 60 + n.getUTCMinutes() + n.getUTCSeconds() / 60;
  const pt = prayerTimes(n.getUTCFullYear(), n.getUTCMonth() + 1, n.getUTCDate());
  const order = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let nx = order.find(k => pt[k] > cur), left;
  if (!nx) { nx = 'fajr'; left = 1440 - cur + pt.fajr; } else left = pt[nx] - cur;
  return { pt, nx, left };
}

/* ---------- currency (indicative) ---------- */
const CUR = { ru: ['RUB', 82], ur: ['PKR', 280], id: ['IDR', 16300], ms: ['MYR', 4.3], tr: ['TRY', 41], bn: ['BDT', 122], hi: ['INR', 88], fr: ['EUR', .86], fa: ['USD', 1], en: ['USD', 1], ar: ['USD', 1] };

/* ---------- environment ---------- */
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true;
const isPhone = () => (matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) && Math.min(screen.width, screen.height) < 820;
const isInApp = () => /Instagram|FBAN|FBAV|FB_IAB|Line\/|TikTok|Snapchat|Telegram|musical_ly/i.test(navigator.userAgent);
const platform = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios' : /Android/.test(navigator.userAgent) ? 'android' : 'other';
let bip = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); bip = e; });
addEventListener('appinstalled', () => { S.installed = true; save(); boot(); });

/* ---------- routing ---------- */
const root = document.getElementById('root');
let stack = [{ v: 'home' }];
const cur = () => stack[stack.length - 1];
function go(v, p) { stack.push(Object.assign({ v }, p || {})); try { history.pushState({ n: stack.length }, ''); } catch (e) {} render(true); }
function back() { if (stack.length > 1) { stack.pop(); render(true); } }
addEventListener('popstate', () => { if (stack.length > 1) { stack.pop(); render(true); } });
function tab(v) { stack = [{ v }]; render(true); }

function toast(msg) { const b = document.getElementById('toasts'); const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; b.appendChild(el); setTimeout(() => el.remove(), 2600); }

/* ---------- gates ---------- */
function setDoc() { document.documentElement.lang = lang; document.documentElement.dir = dir(); }

function langPillGate() { return `<button class="lang-pill langsel" data-act="gatelang">${ic('globe')}${esc((LANGS.find(l => l.code === lang) || {}).name)}</button>`; }

function gateDesktop() {
  root.innerHTML = `<div class="gate center">
    <div class="brand">${logo('#fff').replace('#fff"', 'rgba(255,255,255,.12)"')}Nakhlio</div>
    <h1>${t('gate_phone_title')}</h1><p>${t('gate_phone_text')}</p>
    <div class="qr" id="qr"></div>
    ${DEMO ? '<p class="small">nakhlio.app</p>' : ''}
    <div class="push" style="margin-top:18px"><button class="btn primary" data-act="deskdemo">${t('gate_demo')}</button></div>
  </div>`;
  try { new QRCode(document.getElementById('qr'), { text: DEMO ? 'https://nakhlio.app' : location.href.split('#')[0], width: 200, height: 200, colorDark: '#0F5C4C', colorLight: '#ffffff' }); } catch (e) {}
}
function gateInApp() {
  root.innerHTML = `<div class="gate">${langPillGate()}
    <div class="brand">${logo()}Nakhlio</div>
    <h1>${t('inapp_title')}</h1><p>${t('inapp_text')}</p>
    <div class="illus">${phoneIllus()}</div>
    <div class="push"><button class="btn primary full" data-act="copylink">${ic('copy')}${t('copy_link')}</button>
    ${DEMO ? `<button class="btn ghostw full" data-act="demoskip">${t('demo_continue')}</button>` : ''}</div></div>`;
}
function gateInstall() {
  const pf = platform();
  const steps = pf === 'ios' ? [t('ios_1') + ' ' + ic('share'), t('ios_2'), t('ios_3')] : [t('and_1'), t('and_2'), t('and_3')];
  root.innerHTML = `<div class="gate">${langPillGate()}
    <div class="brand">${logo('rgba(255,255,255,.12)')}Nakhlio</div>
    <h1>${t('install_title')}</h1><p>${t('install_text')}</p>
    <div class="illus">${phoneIllus()}</div>
    <ol class="steps">${steps.map((s, i) => `<li><span class="n">${nf(i + 1)}</span><span>${s}</span></li>`).join('')}</ol>
    <div class="push">
      ${pf !== 'ios' ? `<button class="btn primary full" data-act="install">${ic('plus')}${t('install_btn')}</button><p class="small">${t('install_menu')}</p>` : ''}
      ${DEMO ? `<button class="btn ghostw full" data-act="demoskip">${t('demo_continue')}</button>` : ''}
    </div></div>`;
}
function gateLang(inApp) {
  root.innerHTML = `<div class="gate light" style="${inApp ? '' : ''}">
    <div class="brand" style="color:var(--palm)">${logo()}Nakhlio</div>
    <h1 style="margin-top:26px">${t('lang_title')}</h1><p style="color:var(--ink-2)">${t('lang_sub')}</p>
    <div class="langs">${LANGS.map(l => `<button class="lang ${l.code === lang ? 'on' : ''}" data-act="setlang" data-v="${l.code}" dir="${l.dir}"><b>${l.name}</b><small>${l.latin}</small></button>`).join('')}</div>
    ${inApp ? `<div class="push"><button class="btn soft full" data-act="gateback">${t('back')}</button></div>` : ''}
  </div>`;
}

/* ---------- shared pieces ---------- */
const homeBtn = () => `<button class="ibtn home-btn" data-act="tab" data-v="home" aria-label="Nakhlio" title="Nakhlio">${logo()}</button>`;
const topbar = (title, opts) => `<div class="topbar">${opts && opts.noBack ? '' : `<button class="ibtn" data-act="back" aria-label="${t('back')}">${ic('back', 'flip')}</button>`}<h1>${esc(title)}</h1>${(opts && opts.right) || ''}${opts && opts.noBack ? '' : homeBtn()}</div>`;
/* approximate district centres — the map shows the district, never the exact building */
const GEO = { central: [24.4686, 39.6111], ranuna: [24.4575, 39.6195], fath: [24.4935, 39.5995], sultanah: [24.4795, 39.5860], rayah: [24.5290, 39.5615], jamiah: [24.4810, 39.5480], qaswa: [24.4410, 39.6480], salam: [24.4905, 39.5660], iskan: [24.5095, 39.6215], aziziyah: [24.4245, 39.6150] };
function mapBlock(dk, capHtml) {
  const g = GEO[dk] || GEO.central; const name = loc(dk) + ', Medina';
  const gm = `https://www.google.com/maps/search/?api=1&query=${g[0]},${g[1]}`;
  const am = `https://maps.apple.com/?ll=${g[0]},${g[1]}&q=${encodeURIComponent(name)}&z=14`;
  return `<div class="map real"><iframe src="https://maps.google.com/maps?q=${g[0]},${g[1]}&z=14&hl=${lang}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${esc(name)}"></iframe></div>
    <div class="map-cap">${capHtml}</div>
    <div class="maplinks"><a class="btn sm soft" href="${gm}" target="_blank" rel="noopener">${small('pin')}Google Maps</a><a class="btn sm soft" href="${am}" target="_blank" rel="noopener">${small('pin')}Apple Maps</a></div>`;
}
const termSuffix = (term, kind) => term === 'daily' ? (kind ? t('per_day') : t('per_night')) : term === 'monthly' ? t('per_month') : t('per_year');
const isSaved = (id) => S.saved.includes(id);
const heart = (id) => `<button class="heart ${isSaved(id) ? 'on' : ''}" data-act="save" data-v="${id}" aria-label="♡">${ic('heart')}</button>`;
const distTxt = (h) => h.walk ? `${nf(h.walk)} ${t('min')} ${t('walk_to')}` : `${nf(h.km, 1)} ${t('km')}`;

function houseCard(h) {
  return `<div class="lcard"><button data-act="go" data-v="house" data-id="${h.id}" style="display:block;width:100%;text-align:start">
    <div class="ph"><img src="${img(h.photos[0])}" alt="" loading="lazy"><span class="chip-on-photo">${ic('shield')}${t('verified').split('·')[0].trim()}</span><span class="rating">${ic('star')}${nf(h.rating, 1)}</span></div>
    <div class="body"><div class="ttl">${esc(L(h.title))}</div>
    <div class="meta"><span>${ic('pin')}${esc(loc(h.dist))}</span><span>${ic(h.walk ? 'walk' : 'car')}${distTxt(h)}</span><span>${ic('bed')}${nf(h.rooms)}</span></div>
    <div class="price num">${money(h.price)} <small>${termSuffix(h.term)}</small></div></div></button>${heart(h.id)}</div>`;
}
function trCard(x) {
  const spec = x.kind === 'cars' ? `${ic('seat')}${nf(x.seats)}` : x.kind === 'scooters' ? `${ic('gear')}${nf(x.cc)} cc` : `${ic('battery')}${nf(x.range)} ${t('km')}`;
  return `<div class="lcard"><button data-act="go" data-v="vehicle" data-id="${x.id}" style="display:block;width:100%;text-align:start">
    <div class="ph"><img src="${img(x.photo)}" alt="" loading="lazy"><span class="chip-on-photo">${ic('shield')}${t('insurance_inc')}</span></div>
    <div class="body"><div class="ttl">${esc(x.model)}</div>
    <div class="meta"><span>${ic('calendar')}${nf(x.year)}</span><span>${spec}</span><span>${ic('pin')}${t('delivery')}</span></div>
    <div class="price num">${money(x.price)} <small>${termSuffix(x.term, 1)}</small></div></div></button>${heart(x.id)}</div>`;
}
const SECTIONS = [
  { k: 'housing', ic: 'home', c: 'palm' }, { k: 'transport', ic: 'car', c: 'sky' }, { k: 'services', ic: 'headset', c: 'date' }, { k: 'ads', ic: 'tag', c: 'date' }, { k: 'parcels', ic: 'box', c: 'clay' },
  { k: 'majlis', ic: 'majlis', c: 'date' }, { k: 'men', ic: 'male', c: 'sky' }, { k: 'women', ic: 'female', c: 'rose' },
  { k: 'family', ic: 'family', c: 'clay' }, { k: 'days', ic: 'calendar', c: 'palm' },
];

/* ---------- views ---------- */
const V = {};

V.home = () => {
  const np = nextPrayer();
  const [cc, rate] = CUR[lang] || CUR.en;
  const per = rate / 3.75;
  const featured = HOUSING.filter(h => h.featured).concat(TRANSPORT.filter(x => x.featured).slice(0, 2));
  const prow = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map(k => `<div class="${k === np.nx ? 'on' : ''}">${t(k)}<b class="num">${hm(np.pt[k])}</b></div>`).join('');
  const nextDay = DAYS.map(d => ({ d, left: Math.ceil((new Date(d.date + 'T00:00:00+03:00') - Date.now()) / 864e5) })).filter(x => x.left >= 0)[0];
  return { tabs: true, raw: true, html: `
  <div class="hero">${skyline()}
    <div class="hero-top"><div class="brand">${logo('rgba(255,255,255,.14)')}Nakhlio</div>
    <button class="lang-pill" data-act="go" data-v="lang">${ic('globe')}${esc((LANGS.find(l => l.code === lang) || {}).name)}</button></div>
    <h2>${t('hello')}${S.me && S.me.name ? ', ' + esc(S.me.name) : ''}</h2><p>${t('hello_sub')}</p>
    <label class="search">${ic('search')}<input id="q" type="search" placeholder="${t('search_ph')}" enterkeyhint="search" aria-label="${t('search_ph')}"></label>
  </div>
  <div class="prayer" id="prayerCard">
    <div class="prayer-head"><span class="prayer-ico">${ic('moon')}</span><div><small>${t('next_prayer')}</small><b>${t(np.nx)} · <span class="num">${hm(np.pt[np.nx])}</span></b></div>
    <div class="cd"><small>${t('in_time')}</small><b class="num" id="cd">${cdTxt(np.left)}</b></div></div>
    <div class="prayer-row">${prow}</div><div class="prayer-note">${t('prayer_note')}</div>
  </div>
  <div class="wrap">
    <div class="bigcats">
      <button class="bigcat" data-act="go" data-v="housing"><img src="${img('liv1')}" alt=""><span><b>${t('s_housing')}</b><small>${t('s_housing_d')}</small></span></button>
      <button class="bigcat" data-act="go" data-v="transport"><img src="${img('car2')}" alt=""><span><b>${t('s_transport')}</b><small>${t('s_transport_d')}</small></span></button>
      <button class="bigcat svc" data-act="go" data-v="services"><span class="svc-icons">${['bank', 'box', 'palette', 'car', 'user'].map(i => `<i>${ic(i)}</i>`).join('')}</span><span><b>${t('s_services')}</b><small>${t('s_services_d')}</small></span></button>
    </div>
    <div class="cats" style="margin-top:18px">${SECTIONS.filter(s => !['housing', 'transport', 'services'].includes(s.k)).map(s => `<button class="cat" data-act="go" data-v="${s.k}"><i class="b-${s.c} c-${s.c}">${ic(s.ic)}</i>${t('s_' + s.k)}</button>`).join('')}</div>
    <div class="sec"><h3>${t('featured')}</h3><button data-act="go" data-v="housing">${t('see_all')}</button></div>
    <div class="hscroll">${featured.map(x => x.kind ? trCard(x) : houseCard(x)).join('')}</div>
    ${nextDay ? `<button class="card" data-act="go" data-v="days" style="display:flex;gap:14px;align-items:center;width:100%;text-align:start;margin-top:18px"><span class="prayer-ico" style="background:var(--palm-tint);color:var(--palm)">${ic('calendar')}</span><span style="flex:1;min-width:0"><small style="color:var(--ink-2);font-weight:600;font-size:12px">${t('s_days')}</small><b style="display:block">${esc(L(nextDay.d.name))}</b></span><b class="num" style="color:var(--palm);text-align:end">${nf(nextDay.left)}<small style="display:block;font-size:11px;color:var(--ink-2);font-weight:600">${t('days_left')}</small></b></button>` : ''}
    <div class="mini" style="margin-top:12px">
      <div class="card"><h5>${ic('coin')}${t('rate')}</h5><div class="rate-big num">1 ${t('sar')}</div><div class="num" style="font-weight:700;color:var(--palm)">≈ ${nf(per, per < 1 ? 3 : per < 10 ? 2 : 0)} ${cc}</div><div class="rate-small">${t('rate_note')}</div></div>
      <div class="card"><h5>${ic('siren')}${t('emergency')}</h5><div class="em">
        <a href="tel:911">${t('unified')}<b>911</b></a><a href="tel:999">${t('police')}<b>999</b></a><a href="tel:997">${t('ambulance')}<b>997</b></a><a href="tel:998">${t('fire')}<b>998</b></a><a href="tel:993">${t('traffic')}<b>993</b></a></div></div>
    </div>
    <div style="display:flex;justify-content:center"><span class="demo-flag">${ic('info')}${t('demo_badge')}</span></div>
  </div>` };
};
const cdTxt = (left) => { const h = Math.floor(left / 60), m = Math.floor(left % 60); return (h ? nf(h) + ':' : '') + (h ? String(m).padStart(2, '0').replace(/\d/g, x => nf(+x)) : nf(m) + ' ' + t('min')); };

V.housing = (p) => {
  const term = p.term || 'daily'; const f = p.f || 'all';
  let items = HOUSING.filter(h => h.term === term);
  const med = items.map(h => h.price).sort((a, b) => a - b)[Math.floor(items.length / 2)];
  items = items.filter(h => f === 'all' || (f === 'furnished' && h.furnished) || (f === 'unfurnished' && !h.furnished) || (f === 'families' && (h.aud === 'families' || h.aud === 'any')) || (f === 'singles' && (h.aud === 'singles' || h.aud === 'any')) || (f === 'near' && (h.walk || h.km < 3.5)) || (f === 'under' && h.price <= med));
  const chips = ['all', 'near', 'furnished', 'unfurnished', 'families', 'singles', 'under'].map(c => `<button class="chip ${c === f ? 'on' : ''}" data-act="filter" data-v="${c}">${t(c === 'near' ? 'near_haram' : c)}</button>`).join('');
  return { tabs: true, html: topbar(t('s_housing')) + `<div class="wrap">
    <div class="seg">${['daily', 'monthly', 'yearly'].map(x => `<button class="${x === term ? 'on' : ''}" data-act="term" data-v="${x}">${t(x)}</button>`).join('')}</div>
    <div class="chips">${chips}</div>
    <div class="count">${nf(items.length)} ${t('results')}</div>
    <div class="list">${items.map(houseCard).join('') || emptyBlock()}</div></div>` };
};
V.transport = (p) => {
  const kind = p.kind || 'cars', term = p.term || 'daily';
  const items = TRANSPORT.filter(x => x.kind === kind && x.term === term);
  return { tabs: true, html: topbar(t('s_transport')) + `<div class="wrap">
    <div class="chips" style="padding-top:2px">${[['cars', 'car'], ['scooters', 'scooter'], ['escooters', 'kick']].map(([k, i]) => `<button class="chip ${k === kind ? 'on' : ''}" data-act="kind" data-v="${k}">${ic(i)}${t(k)}</button>`).join('')}</div>
    <div class="seg" style="margin-top:10px">${['daily', 'monthly', 'yearly'].map(x => `<button class="${x === term ? 'on' : ''}" data-act="term" data-v="${x}">${t(x)}</button>`).join('')}</div>
    <div class="count">${nf(TRANSPORT.filter(x => x.kind === kind).length)} ${t('results')}</div>
    <div class="list">${items.map(trCard).join('')}</div></div>` };
};
const emptyBlock = (txt, kind) => `<div class="empty">${emptyIllus(kind)}<b>${txt || t('nothing')}</b>${txt ? '' : t('nothing_d')}</div>`;

function gallery(photos, id) {
  return `<div class="gallery"><div class="track" id="gtrack">${photos.map(ph => `<img src="${img(ph)}" alt="">`).join('')}</div>
    <div class="dots" id="gdots">${photos.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
    <div class="float"><button class="ibtn" data-act="back" aria-label="${t('back')}">${ic('back', 'flip')}</button><span class="fr">${homeBtn()}${id ? `<button class="ibtn ${isSaved(id) ? 'c-rose' : ''}" data-act="save" data-v="${id}" aria-label="♡">${ic('heart')}</button>` : ''}</span></div></div>`;
}
V.house = (p) => {
  const h = HOUSING.find(x => x.id === p.id);
  const aud = h.aud === 'families' ? t('families') : h.aud === 'singles' ? t('singles') : t('any');
  const facts = [['bed', h.rooms, t('rooms')], ['bath', h.baths, t('baths')], ['users', h.guests, t('guests')], ['layers', h.floor, t('floor')]];
  return { cta: `<div class="p"><b class="num">${money(h.price)}</b><small>${termSuffix(h.term)}</small></div><button class="btn primary" data-act="write" data-v="${h.id}">${ic('chat')}${t('write')}</button>`, raw: true, html: gallery(h.photos, h.id) + `
  <div class="sheetbody wrap">
    <h2 class="d-title">${esc(L(h.title))}</h2>
    <div class="d-sub"><span>${ic('pin')}${esc(loc(h.dist))}</span><span>${ic(h.walk ? 'walk' : 'car')}${h.walk ? `${nf(h.walk)} ${t('min_walk')}` : `${nf(h.km, 1)} ${t('km_haram')}`}</span><span style="color:var(--date-2)">${ic('star')}<b class="num">${nf(h.rating, 1)}</b></span></div>
    <div class="verified">${ic('camera')}${t('verified')}</div>
    <div class="facts">${facts.map(([i, v, l]) => `<div class="fact">${ic(i)}<b class="num">${nf(v)}</b><small>${l}</small></div>`).join('')}</div>
    <div class="block"><h4>${t('description')}</h4><p>${esc(L(h.desc))}</p></div>
    <div class="block"><h4>${t('included')}</h4><div class="amen">${h.amen.map(a => `<span>${ic(a)}${esc(L(AMEN[a]))}</span>`).join('')}</div></div>
    <div class="block"><h4>${t('terms')}</h4><div class="kv">
      <div><span>${t('term_l')}</span><b>${t(h.term)}</b></div><div><span>${t('payment')}</span><b>${esc(L(h.pay))}</b></div>
      <div><span>${t('deposit')}</span><b class="num">${h.dep ? money(h.dep) : '—'}</b></div><div><span>${t('audience')}</span><b>${aud} · ${h.furnished ? t('furnished') : t('unfurnished')}</b></div></div></div>
    <div class="block"><h4>${t('location')}</h4>${mapBlock(h.dist, `<b>${esc(loc(h.dist))}</b> · ${h.walk ? `${nf(h.walk)} ${t('min_walk')}` : `${nf(h.km, 1)} ${t('km_haram')}`}<br>${t('location_note')}`)}</div>
    <div class="block"><h4>${t('reviews')} <span class="tag">${t('review_example')}</span></h4>${REVIEWS.map(r => `<div class="review"><div class="who">${pBtn(r.who, avatar(r.who, 'sm'))}${pBtn(r.who, esc(r.who))}<span class="stars">${ic('star').repeat(r.stars)}</span></div><p>${esc(L(r.text))}</p></div>`).join('')}</div>
    <p class="note" style="margin-top:18px">${t('listing_no')} <b class="num">${h.id}</b></p>
  </div>` };
};
V.vehicle = (p) => {
  const x = TRANSPORT.find(v => v.id === p.id);
  const same = TRANSPORT.filter(v => v.kind === x.kind && v.photo !== x.photo).map(v => v.photo);
  const photos = [x.photo].concat([...new Set(same)].slice(0, 2));
  const facts = x.kind === 'cars' ? [['calendar', nf(x.year), t('year')], ['gear', t('auto'), t('gearbox')], ['seat', nf(x.seats), t('seats')], ['car', nf(x.km), t('km') + ' ' + termSuffix(x.term, 1)]]
    : x.kind === 'scooters' ? [['calendar', nf(x.year), t('year')], ['gear', nf(x.cc) + ' cc', t('cc')], ['seat', nf(x.seats), t('seats')], ['shield', '✓', t('insurance_inc')]]
    : [['calendar', nf(x.year), t('year')], ['battery', nf(x.range) + ' ' + t('km'), t('range')], ['users', nf(x.seats), t('seats')], ['shield', '✓', t('insurance_inc')]];
  const req = x.kind === 'cars' ? t('req_car') : x.kind === 'scooters' ? t('req_sco') : t('req_esc');
  return { cta: `<div class="p"><b class="num">${money(x.price)}</b><small>${termSuffix(x.term, 1)}</small></div><button class="btn primary" data-act="write" data-v="${x.id}">${ic('chat')}${t('write')}</button>`, raw: true, html: gallery(photos, x.id) + `
  <div class="sheetbody wrap">
    <h2 class="d-title">${esc(x.model)}</h2>
    <div class="d-sub"><span>${ic(x.kind === 'cars' ? 'car' : x.kind === 'scooters' ? 'scooter' : 'kick')}${t(x.kind)}</span><span>${ic('calendar')}${t(x.term)}</span><span>${ic('pin')}${t('delivery')}</span></div>
    <div class="facts">${facts.map(([i, v, l]) => `<div class="fact">${ic(i)}<b class="num" style="font-size:13.5px">${v}</b><small>${l}</small></div>`).join('')}</div>
    <div class="block"><h4>${t('included')}</h4><div class="amen"><span>${ic('shield')}${t('insurance_inc')}</span><span>${ic('pin')}${t('delivery')}</span>${x.kind === 'cars' ? `<span>${ic('gear')}${t('auto')}</span>` : ''}<span>${ic('headset')}24/7</span></div></div>
    <div class="block"><div class="banner">${ic('idcard')}<div><b>${t('requirements')}</b>${req}</div></div></div>
    <div class="block"><div class="banner green">${ic('contract')}<div>${t('rental_by')}</div></div></div>
    <p class="note" style="margin-top:18px">${t('listing_no')} <b class="num">${x.id}</b></p>
  </div>` };
};

V.explore = (p) => {
  const q = (p.q || '').trim().toLowerCase();
  let res = '';
  if (q) {
    const hs = HOUSING.filter(h => [L(h.title), h.title.en, h.title.ru, DIST[h.dist].en].join(' ').toLowerCase().includes(q));
    const ts = TRANSPORT.filter(x => (x.model + ' ' + t(x.kind)).toLowerCase().includes(q));
    const as = myAds().concat(ADS).filter(a => (txt(a.title) + ' ' + catLabel(a.cat, ADCATS) + ' ' + a.seller.name).toLowerCase().includes(q));
    const ss = []; for (const c of SVC_CATS) for (const it of c.items) if ([L(it.title), it.title.en, it.title.ru, L(c.name)].join(' ').toLowerCase().includes(q)) ss.push(svcRow(c, it));
    res = (hs.length + ts.length + as.length + ss.length) ? `<div class="count">${nf(hs.length + ts.length + as.length + ss.length)} ${t('results')}</div><div class="list">${ss.join('')}${hs.map(houseCard).join('')}${ts.map(trCard).join('')}${as.map(adRow).join('')}</div>` : emptyBlock();
  }
  return { tabs: true, html: topbar(t('catalog'), { noBack: stack.length < 2 }) + `<div class="wrap">
    <label class="search" style="box-shadow:var(--shadow)">${ic('search')}<input id="q2" type="search" value="${esc(p.q || '')}" placeholder="${t('search_ph')}" enterkeyhint="search" aria-label="${t('search_ph')}"></label>
    ${res}
    <div class="sec"><h3>${t('all_sections')}</h3></div>
    <div class="list">${SECTIONS.map(s => `<button class="row-card" data-act="go" data-v="${s.k}"><span class="thumb b-${s.c} c-${s.c}" style="display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:16px">${ic(s.ic).replace('<svg', '<svg style="width:26px;height:26px"')}</span><span class="grow"><span class="ttl" style="display:block">${t('s_' + s.k)}</span><span class="sub" style="display:block">${t('s_' + s.k + '_d')}</span></span>${ic('chev', 'flip').replace('<svg', '<svg style="width:18px;height:18px;color:var(--ink-3)"')}</button>`).join('')}</div>
  </div>` };
};

/* ---------- community helpers ---------- */
const loc = (k) => (DIST[k] ? DIST[k].en : (k || ''));
const who = (n) => (n === '@me' ? t('you') : n);
const initial = (n) => esc((String(who(n)).replace(/^Ustaz /, '')[0]) || '?');
const txt = (x) => (typeof x === 'string' ? x : L(x));
const catLabel = (k, map) => (map[k] ? L(map[k]) : (k || ''));
const small = (n) => ic(n).replace('<svg', '<svg style="width:15px;height:15px"');
let openC = {}, replyTo = {};
function commentsBlock(key, list, opts) {
  opts = opts || {};
  const all = (list || []).concat(S.cm[key] || []);
  const items = all.map((c) => {
    const mine = c.who === '@me';
    return `<div class="cmt ${c.to ? 'sub' : ''}">${pBtn(c.who, avatar(c.who))}<div class="cb">
      <div class="cw">${pBtn(c.who, `<b>${esc(who(c.who))}</b>`)}${c.to ? `<span class="to">${small('chev')}${esc(who(c.to))}</span>` : ''}${c.date ? `<small class="num">${c.date}</small>` : ''}</div>
      <p>${esc(txt(c.text))}</p>
      ${mine ? '' : `<div class="ca"><button data-act="reply" data-k="${key}" data-v="${esc(c.who)}">${small('chat')}${t('reply')}</button><button data-act="dm" data-v="${esc(c.who)}">${small('send')}${t('dm')}</button>${c.helped != null ? `<span class="num">${small('check')}${nf(c.helped)}</span>` : ''}</div>`}
    </div></div>`;
  }).join('');
  const box = opts.collapsed && !openC[key] ? '' : `<div class="cbox"><div class="rchip" ${replyTo[key] ? '' : 'hidden'}>${t('reply_to')} <b>${esc(who(replyTo[key] || ''))}</b><button data-act="unreply" data-k="${key}" aria-label="${t('close')}">${small('x')}</button></div>
    <div class="crow"><textarea rows="1" data-ck="${key}" placeholder="${t('comment_ph')}" aria-label="${t('comment_ph')}"></textarea><button class="send" data-act="csend" data-k="${key}" aria-label="send">${ic('send', 'flip')}</button></div></div>`;
  return `<div class="cmts">${items}</div>${box}`;
}
const chipsRow = (map, curK, act) => `<div class="chips"><button class="chip ${curK === 'all' ? 'on' : ''}" data-act="${act}" data-v="all">${t('all')}</button>${Object.keys(map).map(k => `<button class="chip ${k === curK ? 'on' : ''}" data-act="${act}" data-v="${k}">${esc(L(map[k]))}</button>`).join('')}</div>`;
const cCount = (x) => (x.comments || []).length + (S.cm['c:' + x.id] || []).length;
const myAds = () => S.myAds || [];

const adRow = (a) => `<button class="row-card" data-act="go" data-v="item" data-id="${a.id}" style="${a.boosted ? 'background:var(--date-tint)' : ''}"><span class="thumb"><img src="${img(a.photos[0])}" alt="" loading="lazy"></span><span class="grow">
  <span class="sub" style="display:flex;gap:6px;align-items:center;margin:0 0 3px;flex-wrap:wrap">${esc(catLabel(a.cat, ADCATS))}${a.boosted ? `<span class="tag gold">${t('top')}</span>` : ''}${a.pro ? `<span class="tag green">${t('pro')}</span>` : ''}${a.mine ? `<span class="tag">${t('yours')}</span>` : ''}</span>
  <span class="ttl" style="display:block">${esc(txt(a.title))}</span><span class="sub" style="display:block">${esc(who(a.seller.name))} · ${esc(loc(a.seller.dist))}</span>
  <span style="display:flex;justify-content:space-between;align-items:center;margin-top:5px;gap:8px"><span class="price">${esc(txt(a.price))}</span><span class="sub" style="display:inline-flex;gap:4px;align-items:center;margin:0">${small('chat')}<span class="num">${nf(cCount(a))}</span></span></span></span></button>`;
V.ads = (p) => {
  const c = p.c || 'all';
  const items = myAds().concat(ADS).filter(a => c === 'all' || a.cat === c);
  return { tabs: true, html: topbar(t('s_ads'), { right: `<button class="ibtn" data-act="postad" aria-label="${t('ad_post')}">${ic('plus')}</button>` }) + `<div class="wrap">
  <div class="banner green">${ic('lock')}<div>${t('ad_contact_note')}<br>${ST('free_ads')}</div></div>
  ${chipsRow(ADCATS, c, 'c')}
  <div class="count">${nf(items.length)} ${t('results')}</div>
  <div class="list">${items.map(adRow).join('') || emptyBlock()}</div>
  <button class="btn primary full" style="margin-top:16px" data-act="postad">${ic('plus')}${t('ad_post')} · ${t('ad_free')}</button></div>` };
};
const HELP_IC = { airport: 'plane', translate: 'translate', elderly: 'hand', tours: 'pin' };
const helpRow = (x) => `<button class="row-card" data-act="go" data-v="item" data-id="${x.id}"><span class="thumb b-palm c-palm" style="display:flex;align-items:center;justify-content:center">${ic(HELP_IC[x.cat]).replace('<svg', '<svg style="width:30px;height:30px"')}</span><span class="grow">
  <span class="sub" style="margin:0 0 3px;display:block">${esc(catLabel(x.cat, HELPCATS))}</span><span class="ttl" style="display:block">${esc(L(x.title))}</span>
  <span class="sub" style="display:block">${esc(x.seller.name)} · ${esc(x.seller.langs)} · ★ ${nf(x.seller.rating, 1)}</span>
  <span style="display:flex;justify-content:space-between;align-items:center;margin-top:5px"><span class="price">${esc(L(x.price))}</span><span class="sub" style="display:inline-flex;gap:4px;align-items:center;margin:0">${small('chat')}<span class="num">${nf(cCount(x))}</span></span></span></span></button>`;
V.help = () => V.services();
const parcelRow = (x) => `<button class="row-card" data-act="go" data-v="item" data-id="${x.id}"><span class="thumb b-${x.kind === 'flying' ? 'date c-date' : 'clay c-clay'}" style="display:flex;align-items:center;justify-content:center">${ic(x.kind === 'flying' ? 'plane' : 'box').replace('<svg', '<svg style="width:30px;height:30px"')}</span><span class="grow">
  <span class="ttl" style="display:block">${esc(x.from)} → ${esc(x.to)}</span>
  <span class="sub num" style="display:block">${new Date(x.date).toLocaleDateString(locale(), { day: 'numeric', month: 'long' })} · ${nf(x.kg, 1)} ${t('kg')}${x.what ? ' · ' + esc(L(x.what)) : ''}</span>
  <span class="sub" style="display:flex;justify-content:space-between;margin-top:4px"><span>${esc(x.seller.name)} · ★ ${nf(x.seller.rating, 1)}</span><span style="display:inline-flex;gap:4px;align-items:center">${small('chat')}<span class="num">${nf(cCount(x))}</span></span></span></span></button>`;
V.parcels = (p) => {
  const k = p.k || 'flying';
  return { tabs: true, html: topbar(t('s_parcels')) + `<div class="wrap">
  <div class="banner rose">${ic('shield')}<div><b>${t('parcel_rules_t')}</b>${t('parcel_rules')}</div></div>
  <div class="seg" style="margin-top:14px">${['flying', 'need'].map(x => `<button class="${x === k ? 'on' : ''}" data-act="pk" data-v="${x}">${t(x === 'flying' ? 'flying' : 'need_send')}</button>`).join('')}</div>
  <div class="list" style="margin-top:14px">${PARCELS.filter(x => x.kind === k).map(parcelRow).join('')}</div>
  <button class="btn soft full" style="margin-top:16px" data-act="postparcel">${ic('plus')}${t('post_parcel')}</button></div>` };
};
function findItem(id) { return ADS.find(x => x.id === id) || myAds().find(x => x.id === id) || HELP.find(x => x.id === id) || PARCELS.find(x => x.id === id); }
function sellerCard(s) {
  return `<div class="seller">${pBtn(s.name, avatar(s.name, 'lg'))}<div class="grow">${pBtn(s.name, `<b>${esc(who(s.name))}</b>`)}<small>${t('langs_spoken')}: ${esc(s.langs || '—')}</small><small>★ ${nf(s.rating || 5, 1)} · ${t('on_since')} ${esc(s.since || '2026')} · ${esc(loc(s.dist))}</small></div>${s.name === '@me' ? '' : `<button class="btn sm soft" data-act="dm" data-v="${esc(s.name)}">${small('chat')}${t('dm')}</button>`}</div>`;
}
V.item = (p) => {
  const x = findItem(p.id); if (!x) return V.home();
  const kind = PARCELS.includes(x) ? 'parcel' : HELP.includes(x) ? 'help' : 'ad';
  const title = kind === 'parcel' ? `${x.from} → ${x.to}` : txt(x.title);
  const price = kind === 'parcel' ? `${nf(x.kg, 1)} ${t('kg')}` : txt(x.price);
  const cat = kind === 'ad' ? catLabel(x.cat, ADCATS) : kind === 'help' ? catLabel(x.cat, HELPCATS) : t(x.kind === 'flying' ? 'flying' : 'need_send');
  const icn = kind === 'help' ? HELP_IC[x.cat] : x.kind === 'flying' ? 'plane' : 'box';
  const head = x.photos ? gallery(x.photos, null) : `<div class="item-head"><div class="float"><button class="ibtn" data-act="back" aria-label="${t('back')}">${ic('back', 'flip')}</button><span class="fr">${homeBtn()}</span></div><span class="big-ic">${ic(icn)}</span></div>`;
  const sub = kind === 'parcel' ? `<span>${small('calendar')}<span class="num">${new Date(x.date).toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' })}</span></span><span>${small('box')}${nf(x.kg, 1)} ${t('kg')}</span>` : `<span>${small('pin')}${esc(loc(x.seller.dist))}</span>`;
  const me = x.seller.name === '@me';
  return { raw: true, cta: me ? null : `<div class="p"><b class="num">${esc(price)}</b><small>${esc(cat)}</small></div><button class="btn primary" data-act="dm" data-v="${esc(x.seller.name)}">${ic('chat')}${t('write')}</button>`, html: head + `
  <div class="sheetbody wrap">
    <span class="tag green">${esc(cat)}</span>
    <h2 class="d-title" style="margin-top:8px">${esc(title)}</h2>
    <div class="d-sub">${sub}</div>
    ${kind === 'parcel' && x.what ? `<div class="verified" style="background:var(--date-tint);color:#5a3c06">${ic('box')}${esc(L(x.what))}</div>` : ''}
    ${x.desc ? `<div class="block"><h4>${t('description')}</h4><p>${esc(txt(x.desc))}</p></div>` : ''}
    ${kind !== 'parcel' ? `<div class="block"><h4>${t('location')}</h4>${mapBlock(x.seller.dist, `<b>${esc(loc(x.seller.dist))}</b><br>${t('location_note')}`)}</div>` : ''}
    ${kind === 'parcel' ? `<div class="block"><div class="banner rose">${ic('shield')}<div><b>${t('parcel_rules_t')}</b>${t('parcel_rules')}</div></div></div>` : ''}
    <div class="block"><h4>${t('seller')}</h4>${sellerCard(x.seller)}</div>
    <div class="block"><h4>${t('comments_t')} <span class="num" style="color:var(--ink-3)">${nf(cCount(x))}</span></h4>${commentsBlock('c:' + x.id, x.comments)}</div>
    <p class="note" style="margin-top:18px">${t('listing_no')} <b class="num">${x.id}</b></p>
  </div>` };
};

const TOPIC_IC = { iqama: 'idcard', bank: 'bank', sim: 'sim', insurance: 'medic', licence: 'car', ejar: 'contract', travel: 'train', study: 'grad', places: 'pin', doctors: 'medic' };
const TOPIC_C = ['palm', 'date', 'sky', 'rose', 'clay'];
const postsFor = (k) => (S.posts[k] || []).concat(POSTS[k] || []);
function postHtml(pst, i, k) {
  const id = k + ':' + i; const hl = S.helped[id];
  if (S.reported[id]) return '';
  const key = 'p:' + id; const n = (pst.a || []).length + (S.cm[key] || []).length;
  return `<div class="post"><div class="who">${pBtn(pst.who, avatar(pst.who, 'sm'))}${pBtn(pst.who, `<b style="color:var(--ink)">${esc(who(pst.who))}</b>`)}${pst.date ? `<span class="num">· ${pst.date}</span>` : ''}<span class="tag ${pst.q ? 'gold' : 'green'}">${pst.q ? t('q_tag') : t('e_tag')}</span></div>
    <p>${esc(txt(pst.text))}</p>
    <div class="acts"><button class="${hl ? 'on' : ''}" data-act="helped" data-v="${id}">${ic('check')}${t('helped')} · <span class="num">${nf((pst.helped || 0) + (hl ? 1 : 0))}</span></button>
    <button data-act="comment" data-k="${key}">${ic('chat')}${t('comment')} · <span class="num">${nf(n)}</span></button>
    ${pst.who !== '@me' ? `<button data-act="dm" data-v="${esc(pst.who)}" aria-label="${t('dm')}" title="${t('dm')}">${ic('send')}</button>` : ''}
    <button class="rep" data-act="report" data-v="${id}" aria-label="${t('report')}" title="${t('report')}">${ic('flag')}</button></div>
    ${n || openC[key] ? `<div class="thread">${commentsBlock(key, pst.a, { collapsed: true })}</div>` : ''}</div>`;
}
V.majlis = () => {
  if (!S.rulesOk) setTimeout(rulesSheet, 250);
  return { tabs: true, html: topbar(t('s_majlis')) + `<div class="wrap">
  <div class="card" style="background:var(--palm);color:#fff;display:flex;gap:14px;align-items:center"><span style="width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex:none">${ic('majlis').replace('<svg', '<svg style="width:28px;height:28px"')}</span><div><b style="font-size:17px">${t('s_majlis')}</b><div style="opacity:.85;font-size:13.5px">${t('majlis_tag')}</div></div></div>
  <button class="banner" style="margin-top:12px;width:100%;text-align:start" data-act="rules">${ic('info')}<div><b>${t('rules_title')}</b>${t('rules_text').split('.')[0]}.</div></button>
  <div class="topics" style="margin-top:14px">${TOPICS.map((k, i) => `<button class="topic" data-act="go" data-v="topic" data-id="${k}"><i class="b-${TOPIC_C[i % 5]} c-${TOPIC_C[i % 5]}">${ic(TOPIC_IC[k])}</i><span>${t('t_' + k)}<small class="num">${nf(postsFor(k).length)} · ${nf(postsFor(k).reduce((a, p) => a + (p.a || []).length, 0))} ${t('answers')}</small></span></button>`).join('')}</div>
  </div>` };
};
V.topic = (p) => {
  const k = p.id; const posts = postsFor(k);
  return { tabs: true, html: topbar(t('t_' + k)) + `<div class="wrap narrow">
  <div class="two-btn"><button class="btn green" data-act="compose" data-v="q" data-id="${k}">${ic('majlis')}${t('ask_q')}</button><button class="btn primary" data-act="compose" data-v="e" data-id="${k}">${ic('book')}${t('share_exp')}</button></div>
  ${OFFICIAL[k] ? `<div class="banner green" style="margin-top:12px">${ic('shield')}<div><b>${t('official')}</b>${OFFICIAL[k]}</div></div>` : ''}
  <div style="margin-top:14px">${posts.length ? posts.map((x, i) => postHtml(x, i, k)).join('') : emptyBlock(t('majlis_tag'), 'chat')}</div></div>` };
};
V.family = () => ({ tabs: true, html: topbar(t('s_family')) + `<div class="wrap narrow">
  <div class="banner green">${ic('family')}<div>${t('s_family_d')}</div></div>
  <div class="two-btn" style="margin-top:12px"><button class="btn green" data-act="compose" data-v="q" data-id="family">${ic('majlis')}${t('ask_family')}</button><button class="btn primary" data-act="compose" data-v="e" data-id="family">${ic('book')}${t('share_exp')}</button></div>
  <div style="margin-top:14px">${(S.posts.family || []).concat(FAMILY).map((x, i) => postHtml(x, i, 'family')).join('')}</div></div>` });

const allEvents = () => MEN_EVENTS.concat(WOMEN_EVENTS);
function eventCard(e, full) {
  const g = S.going[e.id]; const n = e.going + (g ? 1 : 0); const cn = (e.comments || []).length + (S.cm['e:' + e.id] || []).length;
  return `<div class="event"><div class="top"><span class="date">${ic('calendar')}</span><div style="flex:1;min-width:0"><b>${esc(L(e.title))}</b><small>${esc(L(e.when))}</small><small>${small('pin')} ${esc(e.where)}</small><small>${t('event_org')}: ${pBtn(e.org, `<b style="color:var(--palm)">${esc(e.org)}</b>`)}</small></div></div>
    <div class="progress"><i style="width:${Math.min(100, n / e.need * 100)}%"></i></div>
    <div class="foot"><span class="num">${nf(n)} / ${nf(e.need)} ${t('going_n')}</span>${full ? '' : `<button class="btn sm soft" data-act="go" data-v="event" data-id="${e.id}">${small('chat')}<span class="num">${nf(cn)}</span></button>`}<button class="btn sm ${g ? 'green' : 'primary'}" data-act="going" data-v="${e.id}">${g ? ic('check') : '✋'} ${t('going')}</button></div></div>`;
}
function spaceView(which) {
  const rooms = which === 'men' ? MEN_ROOMS : WOMEN_ROOMS, events = which === 'men' ? MEN_EVENTS : WOMEN_EVENTS;
  const col = which === 'men' ? 'sky' : 'rose';
  const k = (cur().k) || 'rooms';
  const last = (r) => { const m = r.msgs[r.msgs.length - 1]; return m ? `${m.who}: ${L(m.text)}` : ''; };
  return { tabs: true, html: topbar(t('s_' + which)) + `<div class="wrap">
    <div class="seg">${['rooms', 'events'].map(x => `<button class="${x === k ? 'on' : ''}" data-act="spk" data-v="${x}">${t(x === 'rooms' ? 'rooms_title' : 'events')}</button>`).join('')}</div>
    <div style="margin-top:14px" class="${k === 'rooms' ? 'rooms-grid' : 'list'}">${k === 'rooms' ? rooms.map(r => `<button class="room" data-act="go" data-v="room" data-id="${which}:${r.id}"><i class="b-${col} c-${col}">${ic(r.icon)}</i><span class="grow"><b>${esc(L(r.name))}</b><small>${esc(last(r))}</small></span><em class="num">${nf(r.n)}</em></button>`).join('') : events.map(e => eventCard(e)).join('')}</div>
    ${k === 'events' ? `<button class="btn soft full" style="margin-top:14px" data-act="toastdemo">${ic('plus')}${t('create_event')}</button>` : ''}
  </div>` };
}
const PLEDGE = {
  intro_women: { ru: 'Это пространство только для женщин. Мужчинам входить сюда запрещено.', en: 'This space is for women only. Men are not permitted to enter.', ar: 'هذه المساحة للنساء فقط، ولا يجوز للرجال دخولها.' },
  intro_men: { ru: 'Это пространство только для мужчин. Женщинам входить сюда запрещено.', en: 'This space is for men only. Women are not permitted to enter.', ar: 'هذه المساحة للرجال فقط، ولا يجوز للنساء دخولها.' },
  title: { ru: 'Напоминание перед входом', en: 'A reminder before you enter', ar: 'تذكير قبل الدخول' },
  q1: { ar: 'وَلَا تَقْفُ مَا لَيْسَ لَكَ بِهِ عِلْمٌ ۚ إِنَّ السَّمْعَ وَالْبَصَرَ وَالْفُؤَادَ كُلُّ أُولَٰئِكَ كَانَ عَنْهُ مَسْئُولًا', ru: '«Не следуй тому, чего не знаешь. Воистину, слух, зрение и сердце — обо всём этом будет спрошено»', en: '“Do not follow that of which you have no knowledge. Indeed, the hearing, the sight and the heart — about all of these one will be questioned.”', src: { ru: 'Коран, сура аль-Исра, 17:36 (смысловой перевод)', en: 'Quran, Al-Isra 17:36 (meaning)', ar: 'سورة الإسراء، الآية 36' } },
  q2: { ar: 'لَعَنَ رَسُولُ اللَّهِ ﷺ الْمُتَشَبِّهِينَ مِنَ الرِّجَالِ بِالنِّسَاءِ، وَالْمُتَشَبِّهَاتِ مِنَ النِّسَاءِ بِالرِّجَالِ', ru: '«Посланник Аллаха ﷺ проклял мужчин, уподобляющихся женщинам, и женщин, уподобляющихся мужчинам»', en: '“The Messenger of Allah ﷺ cursed men who imitate women and women who imitate men.”', src: { ru: 'Сахих аль-Бухари, 5885', en: 'Sahih al-Bukhari 5885', ar: 'صحيح البخاري، 5885' } },
  q3: { ar: 'مَنْ غَشَّنَا فَلَيْسَ مِنَّا', ru: '«Кто обманывает нас — тот не из нас»', en: '“Whoever deceives us is not one of us.”', src: { ru: 'Сахих Муслим, 101', en: 'Sahih Muslim 101', ar: 'صحيح مسلم، 101' } },
  oath_women: { ru: 'Я — женщина. Аллах свидетель моим словам.', en: 'I am a woman. Allah is witness to my words.', ar: 'أنا امرأة، والله شاهد على ما أقول.' },
  oath_men: { ru: 'Я — мужчина. Аллах свидетель моим словам.', en: 'I am a man. Allah is witness to my words.', ar: 'أنا رجل، والله شاهد على ما أقول.' },
  enter: { ru: 'Войти', en: 'Enter', ar: 'دخول' },
  leave: { ru: 'Вернуться назад', en: 'Go back', ar: 'رجوع' },
};
S.pledge = S.pledge || {};
function pledgeView(which) {
  const col = which === 'men' ? 'sky' : 'rose';
  const q = (k) => `<figure class="ayah"><p class="ar" dir="rtl" lang="ar">${PLEDGE[k].ar}</p>${lang !== 'ar' ? `<p class="tr">${esc(L(PLEDGE[k]))}</p>` : ''}<figcaption>${esc(L(PLEDGE[k].src))}</figcaption></figure>`;
  return { tabs: true, html: topbar(t('s_' + which)) + `<div class="wrap narrow"><div class="card pledge">
    <span class="pl-ic b-${col} c-${col}">${ic(which === 'men' ? 'male' : 'female')}</span>
    <h2>${esc(L(PLEDGE.title))}</h2><p class="pl-intro">${esc(L(PLEDGE['intro_' + which]))}</p>
    ${q('q1')}${q('q2')}${q('q3')}
    <label class="check"><input type="checkbox" id="oath"><span><b>${esc(L(PLEDGE['oath_' + which]))}</b></span></label>
    <button class="btn green full" style="margin-top:16px" id="oathgo" data-act="oath" data-v="${which}" disabled>${esc(L(PLEDGE.enter))}</button>
    <button class="btn soft full" style="margin-top:10px" data-act="back">${esc(L(PLEDGE.leave))}</button>
  </div></div>` };
}
const blocked = (which, key) => ({ tabs: true, html: topbar(t('s_' + which)) + `<div class="wrap"><div class="empty">${emptyIllus('lock')}<b>${t(key)}</b></div></div>` });
V.men = () => {
  if (!S.me) return guestLock(t('s_men'), t('spaces_guest'));
  if (S.me.gender === 'f') return blocked('men', 'men_only');
  if (!S.pledge.men) return pledgeView('men');
  return spaceView('men');
};
V.women = () => {
  if (!S.me) return guestLock(t('s_women'), t('spaces_guest'));
  if (S.me.gender === 'm') return blocked('women', 'women_only_m');
  if (!S.pledge.women) return pledgeView('women');
  return spaceView('women');
};
V.event = (p) => {
  const e = allEvents().find(x => x.id === p.id);
  return { tabs: true, html: topbar(L(e.title)) + `<div class="wrap narrow">${eventCard(e, true)}
    <div class="block"><h4>${t('comments_t')}</h4>${commentsBlock('e:' + e.id, e.comments)}</div></div>` };
};
V.room = (p) => {
  const [sp, id] = p.id.split(':'); const r = (sp === 'men' ? MEN_ROOMS : WOMEN_ROOMS).find(x => x.id === id);
  const mine = ((S.rooms && S.rooms[p.id]) || []).map(m => typeof m === 'string' ? { who: '@me', text: m } : m);
  const msgs = r.msgs.concat(mine);
  const bub = msgs.map(m => m.who === '@me'
    ? `<div class="bubble me">${m.to ? `<span class="rto">${small('chev')}${esc(who(m.to))}</span>` : ''}${esc(txt(m.text))}</div>`
    : `<div class="msg">${pBtn(m.who, avatar(m.who))}<div class="bubble op">${pBtn(m.who, `<b class="nm">${esc(m.who)}</b>`)}${m.to ? `<span class="rto">${small('chev')}${esc(who(m.to))}</span>` : ''}${esc(txt(m.text))}<div class="ma"><button data-act="rreply" data-v="${esc(m.who)}">${t('reply')}</button><button data-act="dm" data-v="${esc(m.who)}">${t('dm')}</button></div></div></div>`).join('');
  return { composer: 'room', html: topbar(L(r.name), { right: `<span class="tag green num">${nf(r.n)} ${t('members')}</span>` }) + `<div class="wrap chat-wrap">
    <div class="banner" style="font-size:12.5px">${ic('info')}<div>${t('room_rule')}</div></div>
    <div class="msg"><span class="av" style="background:var(--palm);color:#fff">N</span><div class="bubble op"><b class="nm">${t('operator')}</b>${t('room_hello')}</div></div>
    ${bub}
  </div>` };
};

V.days = () => ({ tabs: true, html: topbar(t('days_title')) + `<div class="wrap">
  <div class="banner green">${ic('calendar')}<div>${t('weekend_note')}</div></div>
  <div class="list" style="margin-top:14px">${DAYS.map(d => { const left = Math.ceil((new Date(d.date + 'T00:00:00+03:00') - Date.now()) / 864e5); return `<div class="event"><div class="top"><span class="date" style="flex-direction:column;width:58px;height:58px;font-weight:800;line-height:1.05"><span class="num" style="font-size:19px">${nf(new Date(d.date).getDate())}</span><span style="font-size:11px">${new Date(d.date).toLocaleDateString(locale(), { month: 'short' })}</span></span><div style="flex:1;min-width:0"><b>${esc(L(d.name))}</b><small>${esc(L(d.note))}</small>${d.moon ? `<small style="color:var(--ink-3)">≈ ${t('approx')}</small>` : ''}</div><b class="num" style="color:var(--palm);text-align:end;flex:none">${nf(Math.max(0, left))}<small style="font-size:11px;color:var(--ink-2)">${t('days_left')}</small></b></div></div>`; }).join('')}</div></div>` });

/* ---------- registration & profiles ---------- */
const REGX = {
  en: { reg_title: 'Create your profile', reg_sub: 'One minute, no passwords. Your phone and e-mail are never shown to other people.', step: 'Step', of: 'of', phone_l: 'Phone number', phone_ph: '5X XXX XXXX', get_code: 'Get the code', code_title: 'Enter the code', code_sub: 'We sent an SMS to', demo_code: 'Demo: the code is 1234', code_l: 'Code from SMS', change_num: 'Change number', resend: 'Send again', name_l: 'Your name', name_ph: 'How should people call you?', email_l: 'E-mail', gender_l: 'I am', male: 'a man', female: 'a woman', gender_note: 'Needed for the men’s and women’s spaces. Not shown on your profile.', photos_l: 'Profile photos', photos_hint: 'Up to 3. The first one is your main photo. You can use a picture instead of your face.', add: 'Add', about_l: 'About me', about_ph: 'For example: from Kazan, in Medina with my family, I bake cakes to order', job_l: 'What I do', job_ph: 'For example: student, electrician, home baker', optional: 'optional', next: 'Continue', finish: 'Done — open Nakhlio', err_phone: 'Enter the number without the country code: 9–10 digits.', err_code: 'The code has 4 digits. Demo code: 1234.', err_name: 'Enter your name, at least 2 letters.', err_email: 'Check the e-mail: it should look like name@mail.com', err_gender: 'Choose one option.', edit_profile: 'Edit profile', logout: 'Log out', save_l: 'Save', saved_ok: 'Profile saved', v_phone: 'Phone verified', v_email: 'E-mail verified', v_nakhlio: 'Checked by Nakhlio', since_l: 'On Nakhlio since', reviews_l: 'Reviews', listings_l: 'Listings', no_listings: 'No listings yet', no_reviews: 'No reviews yet', report_user: 'Report', profile_l: 'Profile', district_l: 'District', langs_l: 'Languages', men_only: 'This space is for men only', women_only_m: 'This space is for women only', main_photo: 'main', remove: 'Remove', men_lock: 'For verified men only', men_lock_text: 'To keep this space safe, a male moderator confirms every member with a short voice call. It takes 2 minutes.', auth_t: 'Create a profile to continue', auth_d: 'You can browse without signing up. To write, reply, comment and post ads — create a profile in 1 minute. No passwords.', create_profile: 'Create a profile', later: 'Later', guest_d: 'Browse freely. Create a profile to write messages, comment and post ads.', chats_guest: 'Your messages will appear here after you create a profile.', spaces_guest: 'This space is for members only. Create a profile to join.' },
  ru: { reg_title: 'Создайте профиль', reg_sub: 'Одна минута, без паролей. Телефон и e-mail никогда не показываются другим людям.', step: 'Шаг', of: 'из', phone_l: 'Номер телефона', phone_ph: '5X XXX XXXX', get_code: 'Получить код', code_title: 'Введите код', code_sub: 'Мы отправили SMS на', demo_code: 'Демо: код 1234', code_l: 'Код из SMS', change_num: 'Изменить номер', resend: 'Отправить ещё раз', name_l: 'Ваше имя', name_ph: 'Как к вам обращаться?', email_l: 'E-mail', gender_l: 'Я', male: 'мужчина', female: 'женщина', gender_note: 'Нужно для мужского и женского пространства. В профиле не показывается.', photos_l: 'Фото профиля', photos_hint: 'До 3 фото. Первое — главное. Можно поставить не своё фото, а картинку.', add: 'Добавить', about_l: 'О себе', about_ph: 'Например: из Казани, в Медине с семьёй, пеку торты на заказ', job_l: 'Чем занимаюсь', job_ph: 'Например: студент, электрик, домашний кондитер', optional: 'по желанию', next: 'Дальше', finish: 'Готово — открыть Nakhlio', err_phone: 'Введите номер без кода страны: 9–10 цифр.', err_code: 'Код — 4 цифры. Демо-код: 1234.', err_name: 'Введите имя, хотя бы 2 буквы.', err_email: 'Проверьте e-mail: он должен быть вида name@mail.com', err_gender: 'Выберите вариант.', edit_profile: 'Редактировать профиль', logout: 'Выйти', save_l: 'Сохранить', saved_ok: 'Профиль сохранён', v_phone: 'Телефон подтверждён', v_email: 'E-mail подтверждён', v_nakhlio: 'Проверен Nakhlio', since_l: 'На Nakhlio с', reviews_l: 'Отзывы', listings_l: 'Объявления', no_listings: 'Пока нет объявлений', no_reviews: 'Пока нет отзывов', report_user: 'Пожаловаться', profile_l: 'Профиль', district_l: 'Район', langs_l: 'Языки', men_only: 'Этот раздел только для мужчин', women_only_m: 'Этот раздел только для женщин', main_photo: 'главное', remove: 'Убрать', men_lock: 'Только для проверенных мужчин', men_lock_text: 'Чтобы здесь было безопасно, модератор-мужчина подтверждает каждого участника коротким голосовым звонком. Это 2 минуты.', auth_t: 'Создайте профиль, чтобы продолжить', auth_d: 'Смотреть можно без регистрации. Чтобы писать, отвечать, комментировать и размещать объявления — создайте профиль за 1 минуту. Без паролей.', create_profile: 'Создать профиль', later: 'Позже', guest_d: 'Смотрите всё свободно. Чтобы писать, комментировать и размещать объявления — создайте профиль.', chats_guest: 'Ваши сообщения появятся здесь после того, как вы создадите профиль.', spaces_guest: 'Этот раздел только для участников. Создайте профиль, чтобы войти.' },
  ar: { reg_title: 'أنشئ ملفك الشخصي', reg_sub: 'دقيقة واحدة بدون كلمات مرور. رقمك وبريدك لا يظهران للآخرين أبداً.', step: 'الخطوة', of: 'من', phone_l: 'رقم الجوال', phone_ph: '5X XXX XXXX', get_code: 'أرسل الرمز', code_title: 'أدخل الرمز', code_sub: 'أرسلنا رسالة إلى', demo_code: 'تجريبي: الرمز 1234', code_l: 'رمز التحقق', change_num: 'تغيير الرقم', resend: 'إعادة الإرسال', name_l: 'اسمك', name_ph: 'بماذا يناديك الناس؟', email_l: 'البريد الإلكتروني', gender_l: 'أنا', male: 'رجل', female: 'امرأة', gender_note: 'مطلوب لمساحة الرجال ومساحة النساء، ولا يظهر في ملفك.', photos_l: 'صور الملف', photos_hint: 'حتى 3 صور، الأولى هي الرئيسية. يمكنك وضع صورة رمزية بدل صورتك.', add: 'إضافة', about_l: 'نبذة عني', about_ph: 'مثال: من قازان، أعيش في المدينة مع عائلتي وأخبز الكيك حسب الطلب', job_l: 'ماذا أعمل', job_ph: 'مثال: طالب، كهربائي، صانعة حلويات', optional: 'اختياري', next: 'متابعة', finish: 'تم — افتح نخليو', err_phone: 'أدخل الرقم بدون رمز الدولة: 9–10 أرقام.', err_code: 'الرمز 4 أرقام. الرمز التجريبي: 1234.', err_name: 'أدخل اسمك، حرفان على الأقل.', err_email: 'تحقق من البريد: يجب أن يكون مثل name@mail.com', err_gender: 'اختر أحد الخيارين.', edit_profile: 'تعديل الملف', logout: 'تسجيل الخروج', save_l: 'حفظ', saved_ok: 'تم حفظ الملف', v_phone: 'الجوال موثّق', v_email: 'البريد موثّق', v_nakhlio: 'موثّق من نخليو', since_l: 'في نخليو منذ', reviews_l: 'التقييمات', listings_l: 'الإعلانات', no_listings: 'لا توجد إعلانات بعد', no_reviews: 'لا توجد تقييمات بعد', report_user: 'إبلاغ', profile_l: 'الملف', district_l: 'الحي', langs_l: 'اللغات', men_only: 'هذه المساحة للرجال فقط', women_only_m: 'هذه المساحة للنساء فقط', main_photo: 'رئيسية', remove: 'حذف', men_lock: 'للرجال الموثّقين فقط', men_lock_text: 'حفاظاً على الأمان، يؤكد مشرف كل عضو بمكالمة صوتية قصيرة مدتها دقيقتان.', auth_t: 'أنشئ ملفك للمتابعة', auth_d: 'يمكنك التصفح بدون تسجيل. للمراسلة والرد والتعليق ونشر الإعلانات أنشئ ملفك خلال دقيقة، بدون كلمات مرور.', create_profile: 'إنشاء ملف', later: 'لاحقاً', guest_d: 'تصفّح بحرية. أنشئ ملفك للمراسلة والتعليق ونشر الإعلانات.', chats_guest: 'ستظهر رسائلك هنا بعد إنشاء ملفك.', spaces_guest: 'هذه المساحة للأعضاء فقط. أنشئ ملفك للدخول.' },
};
for (const k in REGX) Object.assign(I18N[k], REGX[k]);
for (const k of ['ru', 'en', 'ar']) { I18N[k].s_services = SVC_TEXT.title[k]; I18N[k].s_services_d = SVC_TEXT.sub[k]; }
const CODES = [['+966', 'SA'], ['+7', 'RU / KZ'], ['+92', 'PK'], ['+62', 'ID'], ['+60', 'MY'], ['+90', 'TR'], ['+880', 'BD'], ['+91', 'IN'], ['+98', 'IR'], ['+20', 'EG'], ['+998', 'UZ'], ['+33', 'FR'], ['+44', 'UK'], ['+1', 'US']];
let reg = { step: 1, code: '+966', phone: '', errs: {} };
const AV_C = ['b-palm c-palm', 'b-date c-date', 'b-sky c-sky', 'b-rose c-rose', 'b-clay c-clay'];
const avCls = (n) => { let h = 0; for (const ch of String(n)) h = (h * 31 + ch.charCodeAt(0)) % 997; return AV_C[h % AV_C.length]; };
const WOMEN = ['Amina', 'Gulnara', 'Sana', 'Maryam', 'Mariam', 'Olga', 'Fatima', 'Leyla', 'Kamila', 'Siti', 'Aisha', 'Ayesha', 'Nur', 'Zaynab', 'Zainab', 'Aliya', 'Farida', 'Zarina', 'Svetlana'];
const isWoman = (n) => /@$/.test(n) ? !!(S.me && S.me.gender === 'f') : n === '@me' ? !!(S.me && S.me.gender === 'f') : WOMEN.includes(n);
const AVBG = ['#E2EFEA', '#FBF0DC', '#E3F0F7', '#F8E6EC', '#F7E7DF', '#EDE7F6'];
const SKIN = ['#E8C3A0', '#D9A77F', '#B98462', '#8D5E42', '#F1D3B8'];
const CLOTH = ['#0F5C4C', '#2F7DA8', '#B8613F', '#5B6C66', '#7A4E8C', '#C2577A', '#1F3B4D'];
function avatarSvg(n) {
  let h = 7; for (const ch of String(n)) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  const bg = AVBG[h % AVBG.length], skin = SKIN[(h >>> 3) % SKIN.length], cl = CLOTH[(h >>> 5) % CLOTH.length];
  if (isWoman(n)) {
    const hj = CLOTH[(h >>> 7) % CLOTH.length];
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${bg}"/><path d="M8 64c2-14 12-21 24-21s22 7 24 21z" fill="${hj}"/><path d="M14 40c0-13 8-24 18-24s18 11 18 24c0 6-3 10-6 12H20c-3-2-6-6-6-12z" fill="${hj}"/><ellipse cx="32" cy="34" rx="9" ry="11" fill="${skin}"/><path d="M21 31c1-8 5-12 11-12s10 4 11 12c-3-5-7-7-11-7s-8 2-11 7z" fill="${hj}" opacity=".85"/></svg>`;
  }
  const hat = (h >>> 9) % 3, beard = (h >>> 11) % 2;
  const head = hat === 0 ? `<path d="M19 30c0-9 6-15 13-15s13 6 13 15c-4-2-8-3-13-3s-9 1-13 3z" fill="#fff"/><path d="M15 31c3 9 6 17 9 22l3-20zM49 31c-3 9-6 17-9 22l-3-20z" fill="#fff"/><rect x="18" y="26" width="28" height="4" rx="2" fill="#2b2b2b"/>`
    : hat === 1 ? `<path d="M22 25a10 9 0 0 1 20 0z" fill="#fff"/><path d="M22 25h20" stroke="#d8d0c2" stroke-width="1.5"/>`
    : `<path d="M22 26c0-7 4-11 10-11s10 4 10 11c-3-3-6-4-10-4s-7 1-10 4z" fill="#2b2b2b"/>`;
  return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${bg}"/><path d="M8 64c2-14 12-20 24-20s22 6 24 20z" fill="${cl}"/><rect x="28" y="38" width="8" height="8" fill="${skin}"/><ellipse cx="32" cy="32" rx="9.5" ry="11" fill="${skin}"/>${beard ? `<path d="M23 34c1 8 5 12 9 12s8-4 9-12c-2 3-5 4-9 4s-7-1-9-4z" fill="#3a2a20"/>` : ''}${head}</svg>`;
}
function avatar(n, size) {
  const me = n === '@me' && S.me;
  const ph = me && S.me.photos && S.me.photos[0];
  return ph ? `<span class="av ${size || ''}" style="background:url(${ph}) center/cover"></span>` : `<span class="av ill ${size || ''}">${avatarSvg(n === '@me' && S.me ? S.me.name + '@' : n)}</span>`;
}
function resizeImg(file) {
  return new Promise((res) => {
    const fr = new FileReader(); fr.onload = () => { const im = new Image(); im.onload = () => {
      const k = Math.min(1, 480 / Math.max(im.width, im.height)); const c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', 0.78)); }; im.onerror = () => res(null); im.src = fr.result; }; fr.onerror = () => res(null); fr.readAsDataURL(file);
  });
}
const fieldErr = (k) => reg.errs[k] ? `<span class="ferr">${ic('info')}${t(reg.errs[k])}</span>` : '';
function profileForm(d, forEdit) {
  const photos = d.photos || [];
  return `
    <div class="field"><label for="rname">${t('name_l')} *</label><input id="rname" value="${esc(d.name || '')}" placeholder="${t('name_ph')}" autocomplete="given-name">${fieldErr('name')}</div>
    <div class="field"><label for="remail">${t('email_l')} *</label><input id="remail" type="email" inputmode="email" value="${esc(d.email || '')}" placeholder="name@mail.com" autocomplete="email">${fieldErr('email')}</div>
    ${forEdit ? '' : `<div class="field"><label>${t('gender_l')} *</label><div class="seg gsel"><button type="button" class="${d.gender === 'm' ? 'on' : ''}" data-g="m">${t('male')}</button><button type="button" class="${d.gender === 'f' ? 'on' : ''}" data-g="f">${t('female')}</button></div><small class="hint">${t('gender_note')}</small>${fieldErr('gender')}</div>`}
    <div class="field"><label>${t('photos_l')} <span class="opt-l">${t('optional')}</span></label>
      <div class="pgrid">${[0, 1, 2].map(i => photos[i] ? `<div class="pslot" style="background-image:url(${photos[i]})">${i === 0 ? `<span class="pmain">${t('main_photo')}</span>` : ''}<button type="button" class="prm" data-rm="${i}" aria-label="${t('remove')}">${ic('x')}</button></div>` : `<label class="pslot empty">${ic('camera')}<span>${t('add')}</span><input type="file" accept="image/*" data-pi="${i}" hidden></label>`).join('')}</div>
      <small class="hint">${t('photos_hint')}</small></div>
    <div class="field"><label for="rjob">${t('job_l')} <span class="opt-l">${t('optional')}</span></label><input id="rjob" value="${esc(d.job || '')}" placeholder="${t('job_ph')}"></div>
    <div class="field"><label for="rabout">${t('about_l')} <span class="opt-l">${t('optional')}</span></label><textarea id="rabout" rows="3" placeholder="${t('about_ph')}">${esc(d.about || '')}</textarea></div>
    <div class="field"><label for="rdist">${t('district_l')} <span class="opt-l">${t('optional')}</span></label><select id="rdist"><option value="">—</option>${Object.keys(DIST).map(k => `<option value="${k}" ${d.dist === k ? 'selected' : ''}>${esc(DIST[k].en)}</option>`).join('')}</select></div>`;
}
function bindProfileForm(scope, d) {
  scope.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', () => { const fe = el.parentElement.querySelector('.ferr'); if (fe) fe.remove(); }));
  scope.querySelectorAll('.gsel button').forEach(b => b.addEventListener('click', () => { const fe = b.closest('.field').querySelector('.ferr'); if (fe) fe.remove(); }));
  scope.querySelectorAll('.gsel button').forEach(b => b.addEventListener('click', () => { d.gender = b.dataset.g; scope.querySelectorAll('.gsel button').forEach(x => x.classList.toggle('on', x === b)); }));
  scope.querySelectorAll('input[data-pi]').forEach(inp => inp.addEventListener('change', async () => { const f = inp.files[0]; if (!f) return; const u = await resizeImg(f); if (!u) return; d.photos = (d.photos || []).concat(u).slice(0, 3); collect(scope, d); reg.errs = {}; d._rerender(); }));
  scope.querySelectorAll('[data-rm]').forEach(b => b.addEventListener('click', () => { d.photos.splice(+b.dataset.rm, 1); collect(scope, d); reg.errs = {}; d._rerender(); }));
}
function collect(scope, d) {
  const v = (id) => { const el = scope.querySelector('#' + id); return el ? el.value.trim() : ''; };
  d.name = v('rname'); d.email = v('remail'); d.job = v('rjob'); d.about = v('rabout'); d.dist = v('rdist');
}
function validate(d, forEdit) {
  const e = {};
  if (!d.name || d.name.length < 2) e.name = 'err_name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email || '')) e.email = 'err_email';
  if (!forEdit && !d.gender) e.gender = 'err_gender';
  return e;
}
function gateReg() {
  setDoc();
  const st = reg.step;
  const prog = `<div class="rprog"><span>${t('step')} ${nf(st)} ${t('of')} ${nf(3)}</span><div class="progress"><i style="width:${st / 3 * 100}%"></i></div></div>`;
  let body = '';
  if (st === 1) body = `<h1>${t('reg_title')}</h1><p class="lead">${t('reg_sub')}</p>
    <div class="field"><label for="rphone">${t('phone_l')} *</label><div class="phone-row"><select id="rcode" aria-label="code">${CODES.map(([c, n]) => `<option value="${c}" ${c === reg.code ? 'selected' : ''}>${c} ${n}</option>`).join('')}</select><input id="rphone" type="tel" inputmode="numeric" autocomplete="tel-national" value="${esc(reg.phone)}" placeholder="${t('phone_ph')}"></div>${fieldErr('phone')}</div>
    <button class="btn primary full" style="margin-top:18px" data-reg="code">${t('get_code')}</button>`;
  else if (st === 2) body = `<h1>${t('code_title')}</h1><p class="lead">${t('code_sub')} <b dir="ltr">${esc(reg.code + ' ' + reg.phone)}</b></p>
    <div class="banner" style="margin-top:12px">${ic('info')}<div>${t('demo_code')}</div></div>
    <div class="field"><label for="rcodein">${t('code_l')} *</label><input id="rcodein" class="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="4" placeholder="• • • •">${fieldErr('code')}</div>
    <button class="btn primary full" style="margin-top:18px" data-reg="verify">${t('next')}</button>
    <div style="display:flex;justify-content:space-between;margin-top:14px"><button class="link" data-reg="back1">${t('change_num')}</button><button class="link" data-reg="resend">${t('resend')}</button></div>`;
  else body = `<h1>${t('reg_title')}</h1><p class="lead">${t('reg_sub')}</p><div id="pform">${profileForm(reg)}</div>
    <button class="btn primary full" style="margin-top:20px" data-reg="finish">${t('finish')}</button>`;
  root.innerHTML = `<div class="gate light reg"><div style="display:flex;align-items:center;justify-content:space-between"><div class="brand" style="color:var(--palm)">${logo()}Nakhlio</div><button class="link" data-reg="cancel">${t('later')}</button></div>${prog}${body}</div>`;
  const scope = root.querySelector('.reg');
  if (st === 3) { reg._rerender = () => gateReg(); bindProfileForm(scope, reg); }
  const f = scope.querySelector('#rphone, #rcodein, #rname'); if (f && st < 3) setTimeout(() => f.focus(), 50);
  scope.querySelectorAll('[data-reg]').forEach(b => b.addEventListener('click', () => {
    const a = b.dataset.reg; reg.errs = {};
    if (a === 'code') { reg.code = scope.querySelector('#rcode').value; reg.phone = scope.querySelector('#rphone').value.replace(/\D/g, ''); if (reg.phone.length < 9 || reg.phone.length > 10) reg.errs.phone = 'err_phone'; else { reg.step = 2; toast(t('demo_code')); } }
    if (a === 'verify') { const c = scope.querySelector('#rcodein').value.trim(); if (c !== '1234') reg.errs.code = 'err_code'; else reg.step = 3; }
    if (a === 'cancel') { reg = { step: 1, code: '+966', phone: '', errs: {} }; return render(true); }
    if (a === 'back1') reg.step = 1;
    if (a === 'resend') toast(t('demo_code'));
    if (a === 'finish') { collect(scope, reg); reg.errs = validate(reg); if (!Object.keys(reg.errs).length) {
      S.me = { name: reg.name, email: reg.email, phone: reg.code + ' ' + reg.phone, gender: reg.gender, photos: reg.photos || [], about: reg.about, job: reg.job, dist: reg.dist || '', langs: (LANGS.find(l => l.code === lang) || {}).latin, since: new Date().getFullYear() + '' };
      save(); reg = { step: 1, code: '+966', phone: '', errs: {} }; toast(t('saved_ok')); return render(true); } }
    gateReg();
  }));
}
/* person data for any name */
function person(n) {
  if (n === '@me') { const m = S.me || {}; return { name: '@me', display: m.name || t('you'), job: m.job, about: m.about, dist: m.dist, langs: m.langs, since: m.since, rating: null, photos: m.photos || [], me: true }; }
  const items = ADS.concat(HELP, PARCELS).filter(x => x.seller && x.seller.name === n);
  const s = (items[0] && items[0].seller) || {};
  const ab = (window.ABOUT || {})[n] || {};
  return { name: n, display: n, job: ab.job, about: ab.about, dist: s.dist, langs: s.langs, since: s.since || '2025', rating: s.rating, items, reviews: (window.PREVIEWS || {})[n] || [] };
}
const pBtn = (n, inner, cls) => `<button class="pbtn ${cls || ''}" data-act="profile" data-v="${esc(n)}">${inner}</button>`;
function profileHtml(n) {
  const p = person(n); const me = !!p.me;
  const items = me ? myAds() : p.items;
  const reviews = me ? [] : p.reviews;
  const badges = `<span class="vb">${small('check')}${t('v_phone')}</span>${me || p.rating >= 4.8 ? `<span class="vb">${small('check')}${t('v_email')}</span>` : ''}${!me && p.rating >= 4.9 ? `<span class="vb gold">${small('shield')}${t('v_nakhlio')}</span>` : ''}`;
  const photos = p.photos || [];
  return `<div class="phead"><div class="pcover">${skyline()}</div>
    <div class="pmain-row">${photos[0] ? `<span class="av xl" style="background:url(${photos[0]}) center/cover"></span>` : `<span class="av xl ill">${avatarSvg(me ? (S.me ? S.me.name + '@' : 'guest') : n)}</span>`}
      <div class="pid"><h2>${esc(p.display)}</h2>${p.job ? `<div class="pjob">${esc(txt(p.job))}</div>` : ''}</div></div>
    <div class="badges">${badges}</div>
    <div class="pstats"><div><b class="num">${p.rating ? '★ ' + nf(p.rating, 1) : '—'}</b><small>${t('reviews_l')} · <span class="num">${nf(reviews.length)}</span></small></div><div><b class="num">${nf(items.length)}</b><small>${t('listings_l')}</small></div><div><b class="num">${esc(p.since || '2026')}</b><small>${t('since_l')}</small></div></div>
    <div class="pmeta">${p.dist ? `<span>${small('pin')}${esc(loc(p.dist))}</span>` : ''}${p.langs ? `<span>${small('globe')}${esc(p.langs)}</span>` : ''}</div>
    ${p.about ? `<p class="pabout">${esc(txt(p.about))}</p>` : ''}
    ${photos.length > 1 ? `<div class="pphotos">${photos.map(u => `<span style="background-image:url(${u})"></span>`).join('')}</div>` : ''}
    <div class="pact">${me ? `<button class="btn soft full" data-act="go" data-v="editprofile">${small('user')}${t('edit_profile')}</button>` : `<button class="btn primary" data-act="dm" data-v="${esc(n)}">${ic('chat')}${t('dm')}</button><button class="btn soft" data-act="reportuser" aria-label="${t('report_user')}">${ic('flag')}</button>`}</div>
  </div>
  <div class="block"><h4>${t('listings_l')}</h4>${items.length ? `<div class="list">${items.map(x => PARCELS.includes(x) ? parcelRow(x) : HELP.includes(x) ? helpRow(x) : adRow(x)).join('')}</div>` : `<p class="note">${t('no_listings')}</p>`}</div>
  ${me ? '' : `<div class="block"><h4>${t('reviews_l')}</h4>${reviews.length ? reviews.map(r => `<div class="review"><div class="who">${avatar(r.who, 'sm')}${pBtn(r.who, esc(r.who))}<span class="stars">${ic('star').repeat(r.stars)}</span></div><p>${esc(L(r.text))}</p></div>`).join('') : `<p class="note">${t('no_reviews')}</p>`}</div>`}`;
}
V.person = (p) => ({ tabs: true, html: topbar(t('profile_l')) + `<div class="wrap narrow">${profileHtml(p.id)}</div>` });
V.editprofile = () => {
  const d = Object.assign({}, S.me, { photos: (S.me.photos || []).slice(), errs: {} });
  setTimeout(() => {
    const scope = root.querySelector('#pform'); if (!scope) return;
    d._rerender = () => { scope.innerHTML = profileForm(d, true); bindProfileForm(scope, d); };
    bindProfileForm(scope, d);
    root.querySelector('#psave').addEventListener('click', () => { collect(scope, d); const e = validate(d, true); if (Object.keys(e).length) { reg.errs = e; scope.innerHTML = profileForm(d, true); bindProfileForm(scope, d); reg.errs = {}; return; }
      Object.assign(S.me, { name: d.name, email: d.email, photos: d.photos, about: d.about, job: d.job, dist: d.dist }); save(); toast(t('saved_ok')); back(); });
  }, 0);
  return { html: topbar(t('edit_profile')) + `<div class="wrap narrow"><div id="pform">${profileForm(d, true)}</div><button class="btn primary full" id="psave" style="margin-top:18px">${t('save_l')}</button></div>` };
};

/* ---------- Nakhlio Services ---------- */
const ST = (k) => L(SVC_TEXT[k]);
function svcFind(id) { for (const c of SVC_CATS) { const it = c.items.find(x => x.id === id); if (it) return { cat: c, item: it }; } return null; }
const svcTile = (c) => `<button class="topic" data-act="go" data-v="scat" data-id="${c.k}"><i class="b-${c.c} c-${c.c}">${ic(c.icon)}</i><span>${esc(L(c.name))}<small class="num">${nf(c.items.length)}</small></span></button>`;
const svcRow = (c, it) => `<button class="row-card" data-act="go" data-v="svc" data-id="${it.id}"><span class="thumb b-${c.c} c-${c.c}" style="display:flex;align-items:center;justify-content:center">${ic(c.icon).replace('<svg', '<svg style="width:30px;height:30px"')}</span><span class="grow">
  <span class="sub" style="display:flex;gap:6px;align-items:center;margin:0 0 3px;flex-wrap:wrap">${esc(L(c.name))}<span class="tag green">${small('shield')}${ST(c.vetted ? 'vetted' : 'licensed')}</span></span>
  <span class="ttl" style="display:block">${esc(L(it.title))}</span>
  <span style="display:flex;justify-content:space-between;gap:8px;margin-top:5px"><span class="price">${esc(L(it.price))}</span><span class="sub" style="display:inline-flex;gap:4px;align-items:center;margin:0">${small('clock')}${esc(L(it.time))}</span></span></span></button>`;
V.services = () => ({ tabs: true, html: topbar(ST('title')) + `<div class="wrap">
  <div class="card svc-hero"><span class="svc-badge">${logo('rgba(255,255,255,.14)')}</span><div><b>${ST('title')}</b><p>${ST('intro')}</p></div></div>
  <div class="banner green" style="margin-top:12px">${ic('shield')}<div>${ST('only')}</div></div>
  <div class="topics" style="margin-top:14px">${SVC_CATS.map(svcTile).join('')}</div>
  <div class="sec"><h3>${ST('popular')}</h3></div>
  <div class="list">${SVC_CATS.map(c => svcRow(c, c.items[0])).join('')}</div></div>` });
V.scat = (p) => { const c = SVC_CATS.find(x => x.k === p.id); return { tabs: true, html: topbar(L(c.name)) + `<div class="wrap">
  <div class="banner green">${ic('shield')}<div>${ST('intro')}</div></div>
  <div class="list" style="margin-top:14px">${c.items.map(it => svcRow(c, it)).join('')}</div></div>` }; };
V.svc = (p) => {
  const f = svcFind(p.id); if (!f) return V.services(); const c = f.cat, it = f.item;
  return { raw: true, cta: `<div class="p"><b class="num">${esc(L(it.price))}</b><small>${esc(L(it.time))}</small></div><button class="btn primary" data-act="sorder" data-v="${it.id}">${ic('send', 'flip')}${ST('order')}</button>`, html: `<div class="item-head svc-head b-${c.c}"><div class="float"><button class="ibtn" data-act="back" aria-label="${t('back')}">${ic('back', 'flip')}</button><span class="fr">${homeBtn()}</span></div><span class="big-ic c-${c.c}">${ic(c.icon)}</span></div>
  <div class="sheetbody wrap">
    <span class="tag green">${small('shield')}${ST(c.vetted ? 'vetted' : 'licensed')}</span>
    <h2 class="d-title" style="margin-top:8px">${esc(L(it.title))}</h2>
    <div class="d-sub"><span>${small(c.icon)}${esc(L(c.name))}</span><span>${small('clock')}${ST('time')}: ${esc(L(it.time))}</span></div>
    <div class="block"><h4>${ST('includes')}</h4><div class="svc-list">${it.inc.map(x => `<span>${small('check')}${esc(L(x))}</span>`).join('')}</div></div>
    <div class="block"><h4>${ST('need')}</h4><div class="svc-list need">${it.need.map(x => `<span>${small('contract')}${esc(L(x))}</span>`).join('')}</div></div>
    <div class="block"><h4>${ST('how')}</h4><ol class="svc-steps">${SVC_TEXT.steps.map((s, i) => `<li><span class="n num">${nf(i + 1)}</span><span>${esc(L(s))}</span></li>`).join('')}</ol></div>
    <p class="note" style="margin-top:18px">${ST('req')} <b class="num">${it.id}</b></p>
  </div>` };
};
function orderSheet(id) {
  const f = svcFind(id); if (!f) return; const it = f.item; let how = 'chat', when = 't_now';
  const w = sheet(`<h3>${ST('order')}</h3><p class="note">${esc(L(it.title))} · ${esc(L(it.price))}</p>
    <div class="field"><label>${ST('contact_how')}</label><div class="seg" id="ohow"><button type="button" class="on" data-v="chat">${small('chat')} ${ST('by_chat')}</button><button type="button" data-v="call">${small('phone')} ${ST('by_call')}</button></div>
      <small class="hint" dir="ltr" style="text-align:start">${esc(S.me ? S.me.phone : '')}</small></div>
    <div class="field"><label>${ST('when')}</label><div class="chips" id="owhen" style="padding:0;margin:0">${['t_now', 't_morning', 't_evening'].map((k, i) => `<button type="button" class="chip ${i ? '' : 'on'}" data-v="${k}">${ST(k)}</button>`).join('')}</div></div>
    <div class="field"><label for="ocomm">${ST('comment')} <span class="opt-l">${t('optional')}</span></label><textarea id="ocomm" rows="3" placeholder="${ST('comment_ph')}"></textarea></div>
    <button class="btn primary full" style="margin-top:16px" id="ogo">${ic('send', 'flip')}${ST('order')}</button>`);
  w.querySelectorAll('#ohow button').forEach(b => b.addEventListener('click', () => { how = b.dataset.v; w.querySelectorAll('#ohow button').forEach(x => x.classList.toggle('on', x === b)); }));
  w.querySelectorAll('#owhen button').forEach(b => b.addEventListener('click', () => { when = b.dataset.v; w.querySelectorAll('#owhen button').forEach(x => x.classList.toggle('on', x === b)); }));
  w.querySelector('#ogo').addEventListener('click', () => {
    const cm = w.querySelector('#ocomm').value.trim();
    const msg = `${ST('req')}: ${L(it.title)} (${id}). ${ST('contact_how')}: ${how === 'chat' ? ST('by_chat') : ST('by_call')}. ${ST('when')}: ${ST(when)}.${cm ? ' ' + cm : ''}`;
    S.chats[id] = S.chats[id] || { msgs: [] }; S.chats[id].lang = lang; S.chats[id].t = Date.now();
    S.chats[id].msgs.push({ from: 'me', text: msg }); save(); w.remove(); toast(ST('sent'));
    go('chat', { id, draft: '' });
    setTimeout(() => { const ty = document.getElementById('typing'); if (ty) ty.innerHTML = '<div class="bubble op typing"><i></i><i></i><i></i></div>'; }, 400);
    setTimeout(() => { S.chats[id].msgs.push({ from: 'op', text: SVC_TEXT.reply }); save(); if (cur().v === 'chat' && cur().id === id) render(); }, 2000);
  });
}

/* chats */
function listingInfo(id) {
  if (id.startsWith('U:')) return { title: id.slice(2), person: id.slice(2), price: '', agency: '—' };
  if (id.startsWith('SV-')) { const f = svcFind(id); if (f) return { title: L(f.item.title), svc: f.cat, price: L(f.item.price), agency: ST(f.cat.vetted ? 'vetted' : 'licensed') + ' · ' + L(f.cat.name) }; }
  const h = HOUSING.find(x => x.id === id); if (h) return { title: L(h.title), photo: h.photos[0], price: money(h.price) + ' ' + termSuffix(h.term), agency: h.agency };
  const x = TRANSPORT.find(v => v.id === id); if (x) return { title: x.model, photo: x.photo, price: money(x.price) + ' ' + termSuffix(x.term, 1), agency: 'Madinah Rent Partners' };
  return { title: id, photo: 'liv8', price: '', agency: '—' };
}
const svcThumb = (c, sz) => `<span class="thumb b-${c.c} c-${c.c}" style="display:flex;align-items:center;justify-content:center;${sz || ''}">${ic(c.icon).replace('<svg', '<svg style="width:26px;height:26px"')}</span>`;
const chatThumb = (li) => li.svc ? svcThumb(li.svc, 'width:56px;height:56px;border-radius:16px') : li.person ? `<span class="thumb av ill" style="width:56px;height:56px;border-radius:18px">${avatarSvg(li.person)}</span>` : `<span class="thumb"><img src="${img(li.photo)}" alt=""></span>`;
V.chats = () => {
  if (!S.me) return guestLock(t('chats_title'), t('chats_guest'));
  const ids = Object.keys(S.chats).sort((a, b) => (S.chats[b].t || 0) - (S.chats[a].t || 0));
  return { tabs: true, html: topbar(t('chats_title'), { noBack: true }) + `<div class="wrap chat-list narrow">${ids.length ? `<div class="list one">${ids.map(id => { const c = S.chats[id]; const li = listingInfo(id); const last = c.msgs[c.msgs.length - 1]; return `<button class="row-card" data-act="go" data-v="chat" data-id="${id}">${chatThumb(li)}<span class="grow"><span class="ttl" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(li.title)}</span><span class="sub" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${last ? esc(txt(last.text)) : ''}</span><span class="sub" style="display:block;color:var(--palm);font-weight:700">${li.person ? t('dm') : t('operator') + ' · ' + id}</span></span></button>`; }).join('')}</div>` : emptyBlock(t('chats_empty'), 'chat').replace(t('nothing_d'), '')}</div>` };
};
V.chat = (p) => {
  const id = p.id; const c = S.chats[id] || { msgs: [] }; const li = listingInfo(id); const dmChat = !!li.person;
  const bubbles = c.msgs.map((m, i) => m.from === 'me' ? `<div class="bubble me">${esc(m.text)}${m.num ? `<small>${small('phone')} ${t('number_shared')}</small>` : ''}</div>`
    : `<div class="bubble op">${esc(m.showOrig ? m.text.ar : L(m.text))}${dmChat ? `<span class="tr">${small('translate')}${t('auto_tr')}</span>` : lang !== 'ar' ? `<button class="tr" data-act="orig" data-v="${i}">${small('translate')}${m.showOrig ? t('show_translation') : t('translated') + ' · ' + t('show_original')}</button>` : ''}<small>${esc(dmChat ? li.person : t('operator'))}</small></div>`).join('');
  const head = dmChat ? `${pBtn(li.person, avatar(li.person, 'lg'))}<h1 style="font-size:16px">${pBtn(li.person, esc(li.person))}<small style="display:block;font-size:12px;color:var(--palm);font-weight:700">● ${t('online')}</small></h1>`
    : `<span style="width:40px;height:40px;flex:none">${logo()}</span><h1 style="font-size:16px">${t('operator')}<small style="display:block;font-size:12px;color:var(--palm);font-weight:700">● ${t('online')}</small></h1>`;
  return { composer: 'chat', html: `<div class="topbar"><button class="ibtn" data-act="back" aria-label="${t('back')}">${ic('back', 'flip')}</button>${head}${homeBtn()}</div>
  <div class="wrap chat-wrap">
    ${dmChat ? '' : `<button class="listing-pin" data-act="openlisting" data-v="${id}">${li.svc ? svcThumb(li.svc, 'width:48px;height:48px;border-radius:10px') : `<img src="${img(li.photo)}" alt="">`}<span style="text-align:start;min-width:0"><b>${esc(li.title)}</b><small class="num">${esc(li.price)}${li.price ? ' · ' : ''}${id}</small></span></button>`}
    <div class="banner green" style="font-size:12.5px">${ic('lock')}<div>${t('privacy_note')}</div></div>
    ${bubbles}<div id="typing"></div>
  </div>` };
};
V.saved = () => {
  const items = S.saved.map(id => HOUSING.find(h => h.id === id) || TRANSPORT.find(x => x.id === id)).filter(Boolean);
  return { tabs: true, html: topbar(t('saved_title'), { noBack: true }) + `<div class="wrap">${items.length ? `<div class="list">${items.map(x => x.kind ? trCard(x) : houseCard(x)).join('')}</div>` : emptyBlock(t('saved_empty'))}</div>` };
};
V.profile = () => ({ tabs: true, html: topbar(t('profile_title'), { noBack: true }) + `<div class="wrap narrow">
  ${S.me ? profileHtml('@me') : `<div class="phead"><div class="pcover">${skyline()}</div><div class="pmain-row"><span class="av xl b-date c-date">${t('guest')[0]}</span><div class="pid"><h2>${t('guest')}</h2></div></div><p class="pabout">${t('guest_d')}</p><div class="pact"><button class="btn primary full" data-act="startreg">${ic('user')}${t('create_profile')}</button></div></div>`}
  <div class="plist" style="margin-top:18px">
    <button data-act="go" data-v="lang"><i class="b-palm c-palm">${ic('globe')}</i><span class="grow">${t('language')}<small>${esc((LANGS.find(l => l.code === lang) || {}).name)}</small></span>${ic('chev', 'flip chev')}</button>
    <button data-act="go" data-v="saved"><i class="b-rose c-rose">${ic('heart')}</i><span class="grow">${t('saved_title')}<small class="num">${nf(S.saved.length)}</small></span>${ic('chev', 'flip chev')}</button>
    <button data-act="rules"><i class="b-date c-date">${ic('info')}</i><span class="grow">${t('rules')}</span>${ic('chev', 'flip chev')}</button>
    <button data-act="go" data-v="about"><i class="b-sky c-sky">${ic('home')}</i><span class="grow">${t('about')}</span>${ic('chev', 'flip chev')}</button>
  </div>
  <div class="plist" style="margin-top:14px"><button data-act="go" data-v="operator"><i class="b-clay c-clay">${ic('headset')}</i><span class="grow">${t('operator_panel')}<small>${t('operator_panel_d')}</small></span>${ic('chev', 'flip chev')}</button></div>
  <div class="plist" style="margin-top:14px">${S.me ? '' : '<!--'}<button data-act="logout"><i class="b-sky c-sky">${ic('back', 'flip')}</i><span class="grow">${t('logout')}<small dir="ltr" style="text-align:start">${esc(S.me ? [S.me.phone, S.me.email].filter(Boolean).join(' · ') : '')}</small></span></button><button data-act="reset"><i class="b-rose c-rose">${ic('x')}</i><span class="grow">${t('reset')}</span></button>${S.me ? '' : '-->'}</div>
  <p class="note" style="text-align:center;margin-top:16px">${t('license')} FAL-1200000000 (${t('example')}) · ${t('demo_badge')}</p></div>` });
V.about = () => ({ tabs: true, html: topbar(t('about')) + `<div class="wrap"><div class="card" style="text-align:center"><div style="width:72px;margin:0 auto 10px">${logo()}</div><b style="font-size:20px">Nakhlio</b><p style="margin:10px 0 0;line-height:1.6">${t('about_text')}</p></div>
  <div class="kv" style="margin-top:14px"><div><span>${t('license')}</span><b>FAL-1200000000 (${t('example')})</b></div><div><span>${t('verified').split('·')[0]}</span><b>✓</b></div></div><p class="note" style="margin-top:14px;text-align:center">${t('photo_credit')}</p></div>` });
V.lang = () => ({ tabs: true, html: topbar(t('language')) + `<div class="wrap"><div class="langs" style="margin-top:4px">${LANGS.map(l => `<button class="lang ${l.code === lang ? 'on' : ''}" data-act="setlang" data-v="${l.code}" dir="${l.dir}"><b>${l.name}</b><small>${l.latin}</small></button>`).join('')}</div></div>` });
V.operator = () => {
  const ids = Object.keys(S.chats).filter(id => !id.startsWith('U:'));
  const st = ['new', 'work', 'view', 'done'];
  return { tabs: true, html: topbar(t('operator_panel')) + `<div class="wrap"><p class="note" style="margin-top:0">${t('operator_panel_d')}</p>${ids.length ? `<div class="list">${ids.map(id => { const li = listingInfo(id); const s = S.req[id] || 'new'; const c = S.chats[id]; return `<div class="card"><div style="display:flex;gap:10px;align-items:center">${li.svc ? svcThumb(li.svc, 'width:52px;height:52px;border-radius:12px') : `<img src="${img(li.photo)}" alt="" style="width:52px;height:52px;border-radius:12px;object-fit:cover">`}<div style="flex:1;min-width:0"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(li.title)}</b><span class="note num">${id}</span></div><button class="status st-${s}" data-act="status" data-v="${id}">${t('req_status_' + s)}</button></div>
    <div class="kv" style="margin-top:12px;box-shadow:none;border:1px solid var(--line)"><div><span>${t('client')}</span><b>${t('guest')} · ${esc((LANGS.find(l => l.code === (c.lang || lang)) || {}).name)}</b></div><div><span>${t('source')}</span><b>${esc(li.agency)}</b></div><div><span>${t('chats_title')}</span><b class="num">${nf(c.msgs.length)}</b></div></div>
    <button class="btn sm soft" style="margin-top:10px" data-act="go" data-v="chat" data-id="${id}">${ic('chat')}${t('open')}</button></div>`; }).join('')}</div>` : emptyBlock(t('chats_empty'), 'chat').replace(t('nothing_d'), '')}</div>` };
};

/* ---------- sheets ---------- */
function sheet(html) {
  const host = document.querySelector('.app') || document.body;
  const w = document.createElement('div'); w.className = 'sheet-wrap'; w.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  w.addEventListener('click', e => { if (e.target === w || e.target.closest('[data-close]')) w.remove(); });
  host.appendChild(w); return w;
}
function rulesSheet() {
  const w = sheet(`<h3>${t('rules_title')}</h3><p style="line-height:1.6;margin:8px 0 16px">${t('rules_text')}</p><button class="btn green full" data-close>${t('understood')}</button>`);
  w.querySelector('[data-close]').addEventListener('click', () => { S.rulesOk = true; save(); });
}

function authSheet() {
  const w = sheet(`<div style="width:64px;margin:4px 0 12px">${logo()}</div><h3>${t('auth_t')}</h3><p style="line-height:1.55;margin:6px 0 16px;color:var(--ink-2)">${t('auth_d')}</p>
    <button class="btn primary full" data-startreg>${ic('user')}${t('create_profile')}</button><button class="btn soft full" style="margin-top:10px" data-close>${t('later')}</button>`);
  w.querySelector('[data-startreg]').addEventListener('click', () => { w.remove(); gateReg(); });
}
const AUTH = ['sorder', 'write', 'dm', 'reply', 'comment', 'csend', 'postad', 'postparcel', 'compose', 'going', 'helped', 'rreply', 'verify', 'report', 'reportuser', 'toastdemo'];
const guestLock = (title, txt0) => ({ tabs: true, html: topbar(title, { noBack: stack.length < 2 }) + `<div class="wrap"><div class="empty">${emptyIllus('lock')}<b>${title}</b><p style="margin:6px auto 18px;max-width:34ch">${txt0}</p><button class="btn primary" data-act="startreg">${ic('user')}${t('create_profile')}</button></div></div>` });
/* ---------- events ---------- */
root.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, v = el.dataset.v, id = el.dataset.id;
  if (!S.me && AUTH.includes(a)) { e.preventDefault(); return authSheet(); }
  switch (a) {
    case 'startreg': gateReg(); break;
    case 'go': go(v, id ? { id } : {}); break;
    case 'back': back(); break;
    case 'tab': tab(v); break;
    case 'term': cur().term = v; render(); break;
    case 'kind': cur().kind = v; render(); break;
    case 'filter': cur().f = v; render(); break;
    case 'pk': cur().k = v; render(); break;
    case 'c': cur().c = v; render(); break;
    case 'dm': openDM(v); break;
    case 'sorder': orderSheet(v); break;
    case 'profile': if (v === '@me') tab('profile'); else go('person', { id: v }); break;
    case 'reportuser': toast(t('reported')); break;
    case 'logout': delete S.me; save(); stack = [{ v: 'home' }]; boot(); break;
    case 'reply': replyTo[el.dataset.k] = v; openC[el.dataset.k] = true; render(); focusBox(el.dataset.k); break;
    case 'unreply': replyTo[el.dataset.k] = null; render(); break;
    case 'comment': openC[el.dataset.k] = !openC[el.dataset.k]; render(); if (openC[el.dataset.k]) focusBox(el.dataset.k); break;
    case 'csend': { const k = el.dataset.k; const ta = root.querySelector(`textarea[data-ck="${k}"]`); const tx = ta && ta.value.trim(); if (!tx) { ta && ta.focus(); break; } S.cm[k] = (S.cm[k] || []).concat({ who: '@me', text: tx, to: replyTo[k] || undefined, date: new Date().toISOString().slice(0, 7) }); replyTo[k] = null; save(); render(); break; }
    case 'rreply': cur().replyTo = v; render(); setTimeout(() => { const m = document.getElementById('msg'); if (m) m.focus(); }, 30); break;
    case 'rclear': cur().replyTo = null; render(); break;
    case 'spk': cur().k = v; render(); break;
    case 'save': e.stopPropagation(); S.saved = isSaved(v) ? S.saved.filter(x => x !== v) : S.saved.concat(v); save(); render(); break;
    case 'write': openChat(v); break;
    case 'writead': openChat(v); break;
    case 'writeitem': if (!S.chats[v]) S.chats[v] = { msgs: [], meta: { title: el.dataset.t } }; openChat(v); break;
    case 'openlisting': if (v.startsWith('SV-')) go('svc', { id: v }); else if (HOUSING.some(h => h.id === v)) go('house', { id: v }); else if (TRANSPORT.some(x => x.id === v)) go('vehicle', { id: v }); break;
    case 'orig': { const c = S.chats[cur().id]; c.msgs[+v].showOrig = !c.msgs[+v].showOrig; save(); render(); break; }
    case 'setlang': lang = v; S.lang = v; save(); setDoc(); if (cur().v === 'lang' && stack.length > 1) stack.pop(); boot(); break;
    case 'gatelang': stack.push({ v: 'lang' }); gateLang(true); break;
    case 'gateback': stack.pop(); boot(); break;
    case 'rules': rulesSheet(); break;
    case 'helped': S.helped[v] = !S.helped[v]; save(); render(); break;
    case 'report': S.reported[v] = true; save(); toast(t('reported')); render(); break;
    case 'compose': composeSheet(v, id); break;
    case 'going': S.going[v] = !S.going[v]; save(); render(); break;
    case 'oath': S.pledge[v] = true; save(); render(true); break;
    case 'postad': adSheet(); break;
    case 'postparcel': parcelSheet(); break;
    case 'status': { const st = ['new', 'work', 'view', 'done']; S.req[v] = st[(st.indexOf(S.req[v] || 'new') + 1) % 4]; save(); render(); break; }
    case 'reset': try { localStorage.removeItem(KEY); } catch (er) {} location.reload(); break;
    case 'toastdemo': toast(t('published')); break;
    case 'deskdemo': S.desk = true; save(); boot(); break;
    case 'demoskip': S.demoSkip = true; save(); boot(); break;
    case 'copylink': try { navigator.clipboard.writeText(location.href).then(() => toast(t('copied'))).catch(() => toast(location.href)); } catch (er) { toast(location.href); } break;
    case 'install':
      if (bip) { bip.prompt(); bip.userChoice.then(r => { if (r.outcome === 'accepted') { S.installed = true; save(); } bip = null; }); }
      else toast(t('install_menu'));
      break;
  }
});
root.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.target.id === 'q' || e.target.id === 'q2')) { const q = e.target.value; if (e.target.id === 'q') go('explore', { q }); else { cur().q = q; render(); } }
});

function focusBox(k) { setTimeout(() => { const ta = root.querySelector(`textarea[data-ck="${k}"]`); if (ta) { ta.focus(); ta.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 40); }
function openDM(name) {
  if (!name || name === '@me') return;
  const id = 'U:' + name;
  if (!S.chats[id]) S.chats[id] = { msgs: [], person: name };
  S.chats[id].t = S.chats[id].t || Date.now(); save();
  go('chat', { id, draft: '' });
}
function openChat(id) {
  if (!S.chats[id]) S.chats[id] = { msgs: [] };
  S.chats[id].lang = lang; S.chats[id].t = S.chats[id].t || Date.now(); save();
  go('chat', { id, draft: S.chats[id].msgs.length ? '' : t('chat_intro') + ' ' + id + '.' });
}
function sendChat(text, num) {
  const id = cur().id; const c = S.chats[id]; if (!text.trim() && !num) return;
  c.msgs.push({ from: 'me', text: num ? t('share_number') + ': +966 5•• ••• ••' : text.trim(), num: !!num }); c.t = Date.now(); save(); render();
  const nOp = c.msgs.filter(m => m.from === 'op').length;
  if (num || nOp > 1) return;
  setTimeout(() => { const ty = document.getElementById('typing'); if (ty) { ty.innerHTML = '<div class="bubble op typing"><i></i><i></i><i></i></div>'; scrollEnd(); } }, 500);
  setTimeout(() => { c.msgs.push({ from: 'op', text: id.startsWith('U:') ? PERSON_REPLY : nOp === 0 ? OP_REPLY : OP_REPLY_2 }); c.t = Date.now(); save(); if (cur().v === 'chat' && cur().id === id) render(); }, 2200);
}
const scrollEnd = () => window.scrollTo(0, document.body.scrollHeight);

function composeSheet(kind, topic) {
  const w = sheet(`<h3>${kind === 'q' ? t('ask_q') : t('share_exp')}</h3><p class="note">${t('t_' + topic) !== 't_' + topic ? t('t_' + topic) : t('s_family')}</p>
    <div class="field"><textarea id="ctext" rows="5" placeholder="${kind === 'q' ? t('composer_q_ph') : t('composer_e_ph')}"></textarea></div>
    <div class="banner" style="margin-top:12px;font-size:12.5px">${ic('info')}<div>${t('room_rule')}</div></div>
    <button class="btn green full" style="margin-top:14px" id="cpub">${t('publish')}</button>`);
  w.querySelector('#cpub').addEventListener('click', () => {
    const txt = w.querySelector('#ctext').value.trim(); if (!txt) return;
    S.posts[topic] = [{ q: kind === 'q', who: '@me', date: new Date().toISOString().slice(0, 7), text: txt, helped: 0 }].concat(S.posts[topic] || []);
    save(); w.remove(); toast(t('published')); render();
  });
}
function adSheet() {
  const w = sheet(`<h3>${t('ad_post')}</h3><p class="note">${ST('free_ads')}</p>
    <div class="field"><label for="adcat">${t('category')}</label><select id="adcat">${Object.keys(ADCATS).map(k => `<option value="${k}">${esc(L(ADCATS[k]))}</option>`).join('')}</select></div>
    <div class="field"><label for="adt">${t('title_f')}</label><input id="adt" placeholder="${lang === 'ru' ? 'Например: Стиральная машина, 2 года' : lang === 'ar' ? 'مثال: غسالة، عمرها سنتان' : 'e.g. Washing machine, 2 years old'}"></div>
    <div class="field"><label for="adp">${t('price_from')}, ${t('sar')}</label><input id="adp" inputmode="numeric" placeholder="300"></div>
    <div class="field"><label>${t('photo')}</label><button class="btn line full" type="button">${ic('camera')}${t('add_photo')}</button></div>
    <label class="opt"><input type="checkbox" id="adb"><span><b>${ic('up').replace('<svg', '<svg style="width:15px;height:15px;vertical-align:-2px"')} ${t('boost')}</b><small>7 ${t('days_left').split(' ')[0]}</small></span><span class="pr num">10 ${t('sar')} · ${t('demo_pay')}</span></label>
    <label class="opt"><input type="checkbox" id="adh"><span><b>${ic('palette').replace('<svg', '<svg style="width:15px;height:15px;vertical-align:-2px"')} ${t('highlight')}</b></span><span class="pr num">5 ${t('sar')} · ${t('demo_pay')}</span></label>
    <button class="btn green full" style="margin-top:16px" id="adgo">${t('publish')}</button>`);
  w.querySelector('#adgo').addEventListener('click', () => {
    const ti = w.querySelector('#adt').value.trim(); if (!ti) { w.querySelector('#adt').focus(); return; }
    const pr = w.querySelector('#adp').value.trim();
    const cat = w.querySelector('#adcat').value;
    S.myAds = [{ id: 'A-' + (800 + (S.myAds || []).length), cat, title: ti, price: pr ? pr + ' ' + t('sar') : '—', seller: { name: '@me', langs: (LANGS.find(l => l.code === lang) || {}).latin, since: '2026', rating: 5, dist: 'central' }, photos: ['liv2'], desc: '', comments: [], mine: true, boosted: w.querySelector('#adb').checked || w.querySelector('#adh').checked }].concat(S.myAds || []);
    save(); w.remove(); toast(t('published')); if (cur().v !== 'ads') go('ads'); else render();
  });
}
function parcelSheet() {
  const w = sheet(`<h3>${t('post_parcel')}</h3>
    <div class="seg" style="margin-top:10px"><button class="on" type="button">${t('flying')}</button><button type="button">${t('need_send')}</button></div>
    <div class="field"><label for="pr1">${t('from_to')}</label><input id="pr1" placeholder="${lang === 'ru' ? 'Медина → Казань' : lang === 'ar' ? 'المدينة ← القاهرة' : 'Medina → Istanbul'}"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="pr2">${t('date')}</label><input id="pr2" type="date"></div><div class="field"><label for="pr3">${t('weight')}, ${t('kg')}</label><input id="pr3" inputmode="decimal" placeholder="3"></div></div>
    <div class="banner rose" style="margin-top:14px;font-size:12.5px">${ic('shield')}<div>${t('parcel_rules')}</div></div>
    <label class="check"><input type="checkbox" id="pagree"><span>${t('agree_rules')}</span></label>
    <button class="btn green full" style="margin-top:14px" id="pgo" disabled>${t('publish')}</button>`);
  const segs = w.querySelectorAll('.seg button'); segs.forEach(b => b.addEventListener('click', () => { segs.forEach(x => x.classList.remove('on')); b.classList.add('on'); }));
  const ag = w.querySelector('#pagree'), btn = w.querySelector('#pgo');
  ag.addEventListener('change', () => { btn.disabled = !ag.checked; });
  btn.addEventListener('click', () => { w.remove(); toast(t('published')); });
}

/* ---------- render ---------- */
let prayerTimer = null;
function render(scrollTop) {
  setDoc();
  const c = cur(); const fn = V[c.v] || V.home; const r = fn(c);
  const rootTabs = ['home', 'explore', 'chats', 'saved', 'profile'];
  const tabsHtml = r.tabs ? `<nav class="tabbar">${[['home', 'home'], ['explore', 'grid'], ['chats', 'chat'], ['saved', 'heart'], ['profile', 'user']].map(([v, i]) => { const on = stack[0].v === v; const n = v === 'chats' ? Object.keys(S.chats).length : 0; return `<button class="tab ${on ? 'on' : ''}" data-act="tab" data-v="${v}">${ic(i)}${t('tab_' + v)}${n ? `<span class="dot num">${nf(n)}</span>` : ''}</button>`; }).join('')}</nav>` : '';
  const cta = r.cta ? `<div class="cta-bar">${r.cta}</div>` : '';
  const rchip = r.composer === 'room' && c.replyTo ? `<div class="rchip">${t('reply_to')} <b>${esc(c.replyTo)}</b><button data-act="rclear" aria-label="${t('close')}">${small('x')}</button></div>` : '';
  const comp = r.composer ? `<div class="composer">${rchip}${r.composer === 'chat' ? `<button class="share" data-act="sharenum" aria-label="${t('share_number')}" title="${t('share_number')}">${ic('phone')}</button>` : ''}<textarea id="msg" rows="1" placeholder="${r.composer === 'room' ? t('write_room') : t('type_msg')}" aria-label="${t('type_msg')}">${esc(c.draft || '')}</textarea><button class="send" id="sendBtn" aria-label="send">${ic('send', 'flip')}</button></div>` : '';
  const scroller = document.querySelector('.scroller');
  const keep = !scrollTop && scroller ? window.scrollY : 0;
  const dsk = document.body.classList.contains('dsk');
  const html = r.raw && r.html.trim().startsWith('<div class="gallery') || r.html.trim().startsWith('<div class="item-head') ? `<div class="detail">${r.html}</div>` : r.html;
  const dnav = dsk ? `<header class="dnav"><div class="dnav-in"><button class="brand" data-act="tab" data-v="home" style="color:var(--palm)">${logo()}Nakhlio</button><nav>${[['home', 'home'], ['explore', 'grid'], ['chats', 'chat'], ['saved', 'heart'], ['profile', 'user']].map(([v, i]) => { const n = v === 'chats' ? Object.keys(S.chats).length : 0; return `<button class="${stack[0].v === v ? 'on' : ''}" data-act="tab" data-v="${v}">${ic(i)}${t('tab_' + v)}${n ? `<span class="dot num">${nf(n)}</span>` : ''}</button>`; }).join('')}</nav><button class="lang-pill dark" data-act="go" data-v="lang">${ic('globe')}${esc((LANGS.find(l => l.code === lang) || {}).name)}</button></div></header>` : '';
  root.innerHTML = `<div class="app">${dnav}<div class="scroller"><div class="view ${r.tabs ? '' : 'no-tabs'}">${html}</div></div>${dsk ? '' : tabsHtml}${cta}${comp}</div>`;
  const sc = document.querySelector('.scroller');
  window.scrollTo(0, keep);
  if (rootTabs.includes(c.v) && stack.length === 1) stack[0] = c;
  const oath = document.getElementById('oath'); if (oath) oath.addEventListener('change', () => { document.getElementById('oathgo').disabled = !oath.checked; });
  // gallery dots
  const tr = document.getElementById('gtrack');
  if (tr) tr.addEventListener('scroll', () => { const i = Math.round(Math.abs(tr.scrollLeft) / tr.clientWidth); document.querySelectorAll('#gdots i').forEach((d, j) => d.classList.toggle('on', i === j)); }, { passive: true });
  // composer
  const msg = document.getElementById('msg');
  if (msg) {
    const auto = () => { msg.style.height = 'auto'; msg.style.height = Math.min(120, msg.scrollHeight) + 'px'; };
    msg.addEventListener('input', () => { c.draft = msg.value; auto(); }); auto();
    const doSend = () => { const v = msg.value; if (!v.trim()) return; c.draft = ''; if (r.composer === 'chat') sendChat(v); else { S.rooms = S.rooms || {}; (S.rooms[c.id] = S.rooms[c.id] || []).push({ who: '@me', text: v.trim(), to: c.replyTo || undefined }); c.replyTo = null; save(); render(); } setTimeout(scrollEnd, 50); };
    document.getElementById('sendBtn').addEventListener('click', doSend);
    msg.addEventListener('keydown', ev => { if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); doSend(); } });
    const sn = document.querySelector('[data-act=sharenum]'); if (sn) sn.addEventListener('click', ev => { ev.stopPropagation(); sendChat('', true); });
    if (c.v === 'chat' && S.chats[c.id] && S.chats[c.id].msgs.length) setTimeout(scrollEnd, 30);
  }
  clearInterval(prayerTimer);
  if (c.v === 'home') prayerTimer = setInterval(() => { const el = document.getElementById('cd'); if (!el) return; const np = nextPrayer(); el.textContent = cdTxt(np.left); }, 20000);
}

/* ---------- boot ---------- */
const TR_LANGS = ['ur', 'id', 'ms', 'tr', 'bn', 'hi', 'fa', 'fr'];
const trTried = {};
function boot() {
  if (TR_LANGS.includes(lang) && !(window.TR && window.TR[lang]) && !trTried[lang]) {
    trTried[lang] = true; const sc = document.createElement('script'); sc.src = 'tr/' + lang + '.js?v=' + (window.NAKHLIO_V || 1);
    sc.onload = sc.onerror = () => boot(); document.head.appendChild(sc); return;
  }
  setDoc();
  const desk = !isPhone();
  document.body.classList.toggle('dsk', desk);
  if (!desk) {
    if (isInApp() && !isStandalone() && !(DEMO && S.demoSkip)) return gateInApp();
    if (!isStandalone() && !(DEMO && S.demoSkip) && !S.installed) return gateInstall();
  }
  if (!S.lang) return gateLang(false);
  if (stack.length && stack[stack.length - 1].v === 'lang' && !document.querySelector('.app')) stack = [{ v: 'home' }];
  render(true);
}
boot();
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !DEMO) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
