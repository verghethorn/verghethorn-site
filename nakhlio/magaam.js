/* MAGAAM — social app inside Nakhlio: feed, stories, reels, friends.
   Uses helpers from app.js (S, V, t, L, ic, esc, go, render, ...). */
(function () {
const NK = window.NK;
const { V, t, L, ic, esc, small, img, avatar, vmark, commentsBlock, loc, nf, toast, sheet, go, render, save, openDM, authSheet, resizeImg, txt, cur } = NK;
const D = (ru, en, ar) => ({ ru, en, ar });
const T = {
  tag: D('Фото, сторис и рилс от тех, кто живёт в Медине', 'Photos, stories and reels from people living in Medina', 'صور وقصص وريلز من سكان المدينة'),
  feed: D('Лента', 'Feed', 'الرئيسية'),
  reels: D('Рилс', 'Reels', 'ريلز'),
  create: D('Создать', 'Create', 'إنشاء'),
  friends: D('Друзья', 'Friends', 'الأصدقاء'),
  your_story: D('Ваша сторис', 'Your story', 'قصتك'),
  posts: D('Публикации', 'Posts', 'المنشورات'),
  followers: D('Подписчики', 'Followers', 'المتابِعون'),
  following: D('Подписки', 'Following', 'يتابع'),
  follow: D('Подписаться', 'Follow', 'متابعة'),
  unfollow: D('Вы подписаны', 'Following', 'تتابعه'),
  add_friend: D('Добавить в друзья', 'Add friend', 'إضافة صديق'),
  req_sent: D('Запрос отправлен', 'Request sent', 'تم إرسال الطلب'),
  is_friend: D('В друзьях', 'Friends', 'صديق'),
  dm_lock: D('Написать можно, когда вас добавят в друзья', 'You can message once they add you as a friend', 'يمكنك المراسلة بعد أن يضيفك صديقاً'),
  accepted: D('принял(а) ваш запрос в друзья', 'accepted your friend request', 'قبل طلب صداقتك'),
  requests: D('Запросы в друзья', 'Friend requests', 'طلبات الصداقة'),
  accept: D('Принять', 'Accept', 'قبول'),
  decline: D('Отклонить', 'Decline', 'رفض'),
  no_friends: D('Пока нет друзей. Найдите людей в ленте и добавьте их.', 'No friends yet. Find people in the feed and add them.', 'لا أصدقاء بعد. ابحث عن أشخاص في الرئيسية وأضفهم.'),
  chats: D('Чаты', 'Chats', 'المحادثات'),
  no_chats: D('Пока нет переписок. Напишите другу или пригласите друзей.', 'No chats yet. Message a friend or invite your friends.', 'لا محادثات بعد. راسل صديقاً أو ادعُ أصدقاءك.'),
  search: D('Поиск', 'Search', 'بحث'),
  you_: D('Вы', 'You', 'أنت'),
  typing: D('печатает…', 'typing…', 'يكتب…'),
  msg_ph: D('Сообщение', 'Message', 'رسالة'),
  deleted: D('Сообщение удалено', 'Message deleted', 'تم حذف الرسالة'),
  today: D('Сегодня', 'Today', 'اليوم'),
  yesterday: D('Вчера', 'Yesterday', 'أمس'),
  copy: D('Копировать', 'Copy', 'نسخ'),
  copied: D('Скопировано', 'Copied', 'تم النسخ'),
  del_msg: D('Удалить', 'Delete', 'حذف'),
  photo_msg: D('Фото', 'Photo', 'صورة'),
  invite: D('Пригласить друзей', 'Invite friends', 'ادعُ أصدقاءك'),
  invite_d: D('Отправьте свою ссылку в WhatsApp или Telegram. Кто зарегистрируется по ней, сразу станет вашим другом.', 'Send your link via WhatsApp or Telegram. Whoever signs up with it becomes your friend right away.', 'أرسل رابطك عبر واتساب أو تيليجرام. من يسجّل عبره يصبح صديقك فوراً.'),
  share: D('Поделиться', 'Share', 'مشاركة'),
  copy_link: D('Скопировать ссылку', 'Copy link', 'نسخ الرابط'),
  inv_text: D('Присоединяйся ко мне в Magaam — фото, рилс и переписка с друзьями:', 'Join me on Magaam — photos, reels and chats with friends:', 'انضم إليّ في Magaam — صور وريلز ومحادثات مع الأصدقاء:'),
  invites_you: D('приглашает вас в Magaam', 'invites you to Magaam', 'يدعوك إلى Magaam'),
  tag2: D('Фото, рилс и переписка с друзьями', 'Photos, reels and chats with friends', 'صور وريلز ومحادثات مع الأصدقاء'),
  code_l: D('Код из письма', 'Code from the e-mail', 'الرمز من البريد'),
  enter: D('Войти', 'Sign in', 'دخول'),
  setup_t: D('Ваш профиль в Magaam', 'Your Magaam profile', 'ملفك في Magaam'),
  setup_d: D('Имя и фото здесь могут отличаться от Nakhlio.', 'Your name and photo here can differ from Nakhlio.', 'يمكن أن يختلف اسمك وصورتك هنا عن نخليو.'),
  name_l: D('Имя', 'Name', 'الاسم'),
  start: D('Начать', 'Start', 'ابدأ'),
  inv_ok: D('Вы теперь друзья с', 'You are now friends with', 'أصبحتما صديقين:'),
  write: D('Написать', 'Message', 'مراسلة'),
  other_email: D('Другой e-mail', 'Another e-mail', 'بريد آخر'),
  people: D('Люди в Magaam', 'People on Magaam', 'أشخاص في Magaam'),
  likes: D('нравится', 'likes', 'إعجاب'),
  new_post: D('Новая публикация', 'New post', 'منشور جديد'),
  t_photo: D('Фото', 'Photo', 'صورة'),
  t_story: D('Сторис', 'Story', 'قصة'),
  t_reel: D('Рилс', 'Reel', 'ريل'),
  pick: D('Выбрать фото или видео', 'Choose a photo or video', 'اختر صورة أو فيديو'),
  caption: D('Подпись', 'Caption', 'الوصف'),
  caption_ph: D('Расскажите, что здесь…', 'Say something about it…', 'اكتب شيئاً عنها…'),
  video_note: D('В прототипе видео хранится до закрытия страницы.', 'In the prototype, videos are kept until the page is closed.', 'في النموذج الأولي يُحفظ الفيديو حتى إغلاق الصفحة.'),
  cover: D('Сменить шапку', 'Change cover', 'تغيير الغلاف'),
  photo: D('Сменить фото', 'Change photo', 'تغيير الصورة'),
  no_posts: D('Публикаций пока нет', 'No posts yet', 'لا منشورات بعد'),
  rules: D('Без политики и споров о религии. Нарушения скрываем.', 'No politics or religious disputes. Violations are hidden.', 'بلا سياسة ولا جدال ديني. نخفي المخالفات.'),
  r_t: D('Правила Magaam', 'Magaam rules', 'قواعد Magaam'),
  r_intro: D('Администрация Magaam просит всех соблюдать правила с уважением друг к другу.', 'The Magaam team asks everyone to follow the rules with respect for one another.', 'تطلب إدارة Magaam من الجميع الالتزام بالقواعد باحترام متبادل.'),
  r1: D('Запрещено размещать фото и видео непристойного содержания.', 'Indecent photos and videos are not allowed.', 'يُمنع نشر الصور والفيديوهات غير اللائقة.'),
  r2: D('Запрещено выкладывать фото и видео девушек и женщин без покрытия.', 'Photos and videos of girls and women without hijab are not allowed.', 'يُمنع نشر صور أو فيديوهات لفتيات أو نساء دون حجاب.'),
  r3: D('Без политики и споров о религии.', 'No politics or religious disputes.', 'بلا سياسة ولا جدال ديني.'),
  r4: D('Увидели нарушение — нажмите «Пожаловаться». Мы проверим и удалим.', 'If you see a violation, tap “Report”. We will check and remove it.', 'إذا رأيت مخالفة فاضغط «إبلاغ» وسنراجعها ونحذفها.'),
  r_ok: D('Принимаю правила', 'I accept the rules', 'أوافق على القواعد'),
  open: D('Открыть Magaam', 'Open Magaam', 'افتح Magaam'),
  back_n: D('Nakhlio', 'Nakhlio', 'Nakhlio'),
};
const M = (k) => L(T[k]);
window.MG_T = T;

/* logo */
window.mgLogo = (cls) => `<svg class="mglogo ${cls || ''}" viewBox="0 0 100 86" aria-hidden="true"><circle cx="38" cy="16" r="11" fill="#1456D6"/><path d="M22 74V54a16 16 0 0 1 29.9-8" fill="none" stroke="#1456D6" stroke-width="13" stroke-linecap="round"/><circle cx="64" cy="18" r="11" fill="#FF7A1F"/><path d="M48 76V56a16 16 0 0 1 32 0v20" fill="none" stroke="var(--mg-gap,#fff)" stroke-width="21" stroke-linecap="round"/><path d="M48 76V56a16 16 0 0 1 32 0v20" fill="none" stroke="#FF7A1F" stroke-width="13" stroke-linecap="round"/></svg>`;

/* sample content */
const P = (id, who, ph, dist, likes, cap, ago, cm) => ({ id, who, ph, dist, likes, cap, ago, cm: cm || [] });
const C = (who, text) => ({ who, text });
const POSTS = [
  P('mp1', 'Yusuf', 'mg6', 'aziziyah', 48, D('Суббота, 20:00 — снова собираемся на поле у школы. Кто с нами?', 'Saturday, 8 pm — we meet again at the pitch by the school. Who’s in?', 'السبت الساعة 8 مساءً نلتقي مجدداً في الملعب بجانب المدرسة. من معنا؟'), 2,
    [C('Imran', D('Я в деле, беру брата!', 'I’m in, bringing my brother!', 'أنا معكم وسأحضر أخي!')), C('Murad', D('Буду к 20:00 💪', 'I’ll be there by 8 💪', 'سأكون هناك الساعة 8 💪'))]),
  P('mp2', 'Amina', 'cake1', 'salam', 112, D('Сегодняшний медовик для дня рождения ❤️', 'Today’s honey cake for a birthday ❤️', 'كعكة العسل اليوم لعيد ميلاد ❤️'), 3,
    [C('Leyla', D('Какая красота! МашаАллах', 'So beautiful! MashaAllah', 'ما أجملها! ما شاء الله'))]),
  P('mp3', 'Imran', 'mg3', 'central', 67, D('Утренний кофе с кардамоном — лучший способ начать день', 'Morning coffee with cardamom — the best way to start the day', 'قهوة الصباح بالهيل أفضل بداية لليوم'), 5),
  P('mp4', 'Siti', 'mg2', 'central', 89, D('Финики Аджва с рынка у Харама. А вы какие любите?', 'Ajwa dates from the market near the Haram. Which ones do you like?', 'تمر العجوة من السوق قرب الحرم. أيّ نوع تحبون؟'), 7),
  P('mp5', 'Ruslan', 'mg4', 'fath', 156, D('Дорога в AlUla. Через неделю едем снова — есть 2 места', 'On the road to AlUla. Going again next week — 2 seats left', 'في الطريق إلى العُلا. سنذهب مجدداً الأسبوع القادم، بقي مقعدان'), 9,
    [C('Daniyar', D('Возьмите меня!', 'Take me with you!', 'خذوني معكم!'))]),
  P('mp6', 'Sana', 'bir1', 'rayah', 95, D('Бирьяни к пятнице готов', 'Biryani is ready for Friday', 'البرياني جاهز ليوم الجمعة'), 12),
  P('mp7', 'Murad', 'mg5', 'iskan', 73, D('Тишина пустыни', 'The silence of the desert', 'سكون الصحراء'), 20),
  P('mp8', 'Abdulla', 'book1', 'jamiah', 41, D('Новый семестр — новые книги', 'New semester, new books', 'فصل جديد وكتب جديدة'), 26),
];
const STORIES = [['Leyla', 'mg1'], ['Yusuf', 'mg6'], ['Amina', 'cake2'], ['Ruslan', 'mg4'], ['Siti', 'mg2'], ['Murad', 'mg5']];
const REELS = [
  { id: 'mr1', who: 'Bilal', ph: 'mg1', likes: 320, cap: D('Вечер у Мечети Пророка ﷺ', 'Evening at the Prophet’s Mosque ﷺ', 'مساء عند المسجد النبوي ﷺ') },
  { id: 'mr2', who: 'Ruslan', ph: 'mg4', likes: 214, cap: D('Верблюды по дороге в AlUla', 'Camels on the road to AlUla', 'جمال في الطريق إلى العُلا') },
  { id: 'mr3', who: 'Murad', ph: 'mg5', likes: 98, cap: D('Закат в дюнах', 'Sunset in the dunes', 'غروب بين الكثبان') },
  { id: 'mr4', who: 'Imran', ph: 'mg3', likes: 133, cap: D('Как мы варим арабский кофе', 'How we make Arabic coffee', 'كيف نحضّر القهوة العربية') },
];
const BASE = { Yusuf: [412, 180], Amina: [968, 210], Imran: [233, 140], Siti: [377, 260], Ruslan: [521, 190], Sana: [640, 120], Murad: [455, 230], Abdulla: [150, 90], Leyla: [288, 170], Bilal: [705, 300] };
const LANG_OF = { Yusuf: 'ru', Amina: 'ru', Imran: 'ur', Siti: 'id', Ruslan: 'ru', Sana: 'ur', Murad: 'ru', Abdulla: 'ru', Leyla: 'en', Bilal: 'ur' };
const INCOMING = ['Kamila', 'Daniyar'];

const st = () => { NK.S.mg = NK.S.mg || {}; const g = NK.S.mg; g.likes = g.likes || {}; g.follow = g.follow || {}; g.friends = g.friends || {}; g.req = g.req || {}; g.inc = g.inc || INCOMING.slice(); g.mine = g.mine || []; g.seen = g.seen || {}; return g; };
const sessionMedia = {};
const media = (p) => p.data || sessionMedia[p.id] || (p.ph ? img(p.ph) : '');
const allPosts = () => st().mine.filter(x => x.type === 'post').concat(POSTS);
const findPost = (id) => allPosts().find(p => p.id === id) || REELS.concat(st().mine).find(p => p.id === id);
const likeN = (p) => (p.likes || 0) + (st().likes[p.id] ? 1 : 0);
const agoTxt = (h) => (h == null ? '' : h < 24 ? nf(h) + ' ' + (NK.lang === 'ru' ? 'ч' : NK.lang === 'ar' ? 'س' : 'h') : nf(Math.round(h / 24)) + ' ' + (NK.lang === 'ru' ? 'д' : NK.lang === 'ar' ? 'ي' : 'd'));
const nameOf = (n) => (n === '@me' ? (NK.S.me ? NK.S.me.name : t('you')) : n);
const mgAv = (n, sz) => `<span class="mgav ${sz || ''}">${avatar(n)}</span>`;
const pLink = (n, inner) => `<button class="pbtn" data-act="mgp" data-v="${esc(n)}">${inner}</button>`;
const capHtml = (p) => { const tr = p.who !== '@me' && LANG_OF[p.who] && LANG_OF[p.who] !== NK.lang; return `${esc(txt(p.cap || ''))}${tr ? `<span class="mgtr">${small('translate')}${t('auto_tr')}</span>` : ''}`; };

const top = (title) => `<header class="mgtop">${window.MG_APP ? '<span class="mgback"></span>' : `<button class="mgback" data-act="tab" data-v="home" aria-label="${t('back')}">${ic('back', 'flip')}<span>${M('back_n')}</span></button>`}
  <div class="mgbrand">${mgLogo()}<b>${title || 'MAGAAM'}</b></div><button class="mgic" data-act="mgnew" aria-label="${M('create')}">${ic('plus')}</button></header>`;
const nav = (on) => `<nav class="mgnav">${[['mg', 'home', 'feed'], ['mgreels', 'play', 'reels'], ['mgnew', 'plus', 'create'], window.LIVE ? ['mgchats', 'chat', 'chats'] : ['mgfriends', 'users', 'friends'], ['mgme', 'user', null]].map(([v, i, k]) =>
  v === 'mgnew' ? `<button class="mgplus" data-act="mgnew" aria-label="${M('create')}">${ic('plus')}</button>`
  : `<button class="${on === v || (v === 'mgchats' && on === 'mgfriends') ? 'on' : ''}" data-act="mggo" data-v="${v}">${v === 'mgme' && NK.S.me ? (window.__mgMeAv ? window.__mgMeAv() : mgAv('@me', 'xs')) : ic(i)}${v === 'mgchats' && window.__mgUnread ? `<em class="mgbadge num">${window.__mgUnread > 99 ? '99+' : window.__mgUnread}</em>` : ''}<span>${k ? M(k) : t('profile_l')}</span></button>`).join('')}</nav>`;
function rulesModal() {
  const g = st(); if (g.rulesOk || document.querySelector('.tmodal')) return;
  const host = document.querySelector('.app') || document.body; const w = document.createElement('div'); w.className = 'tmodal';
  w.innerHTML = `<div class="tbox mgrbox" role="dialog" aria-modal="true">${mgLogo('big')}<h3>${M('r_t')}</h3><p>${M('r_intro')}</p><ul>${['r1', 'r2', 'r3', 'r4'].map(k => `<li>${M(k)}</li>`).join('')}</ul><button class="btn primary full mgbtn">${M('r_ok')}</button></div>`;
  w.querySelector('button').onclick = () => { g.rulesOk = true; save(); w.remove(); };
  host.appendChild(w);
}
const wrapView = (on, body, title) => (setTimeout(rulesModal, 60), { html: `<div class="mg">${top(title)}${body}</div>${nav(on)}` });
const mobileOnly = () => ({ html: `<div class="mg">${top()}<div class="mgwrap" style="text-align:center;padding-top:40px">${mgLogo('big')}<h2 style="margin:14px 0 6px">MAGAAM</h2><p class="note">${esc(L(FX.mg_mobile))}</p></div></div>` });
const lock = () => ({ html: `<div class="mg">${top()}<div class="mgwrap" style="text-align:center;padding-top:40px">${mgLogo('big')}<h2 style="margin:14px 0 6px">MAGAAM</h2><p class="note">${M('tag')}</p><p class="note">${t('spaces_guest')}</p><button class="btn primary full mgbtn" data-act="startreg" style="margin-top:16px">${t('create_profile')}</button></div></div>` });

function postCard(p) {
  const liked = st().likes[p.id];
  return `<article class="mgpost">
    <div class="mgph">${pLink(p.who, mgAv(p.who, 'sm'))}<div class="grow">${pLink(p.who, `<b>${esc(nameOf(p.who))}</b>${vmark(p.who)}`)}${p.dist ? `<small>${small('pin')}${esc(loc(p.dist))}</small>` : ''}</div><small class="num">${agoTxt(p.ago)}</small></div>
    <div class="mgimg" data-act="mgdbl" data-v="${p.id}">${p.vid || sessionMedia[p.id + ':v'] ? `<video src="${sessionMedia[p.id + ':v']}" playsinline muted loop autoplay></video>` : `<img src="${media(p)}" alt="" loading="lazy">`}<i class="mgheart">${ic('heart')}</i></div>
    <div class="mgact"><button class="${liked ? 'on' : ''}" data-act="mglike" data-v="${p.id}" aria-label="like">${ic('heart')}</button><button data-act="mgpost" data-v="${p.id}" aria-label="${t('comment')}">${ic('chat')}</button><button data-act="mgreport" data-v="${p.id}" aria-label="${t('report')}" title="${t('report')}">${ic('flag')}</button><span class="num">${nf(likeN(p))} ${M('likes')}</span></div>
    <p class="mgcap">${pLink(p.who, `<b>${esc(nameOf(p.who))}</b>`)} ${capHtml(p)}</p>
    ${(p.cm.length + (NK.S.cm['mg:' + p.id] || []).length) ? `<button class="mgmore" data-act="mgpost" data-v="${p.id}">${t('comments_t')} · <span class="num">${nf(p.cm.length + (NK.S.cm['mg:' + p.id] || []).length)}</span></button>` : ''}
  </article>`;
}
function storiesRow() {
  const g = st(); const mine = g.mine.filter(x => x.type === 'story');
  const meItem = `<button class="mgst ${mine.length ? '' : 'add'}" data-act="${mine.length ? 'mgstory' : 'mgnew'}" data-v="${mine.length ? 'me' : 'story'}">${mgAv('@me', 'md')}${mine.length ? '' : `<i>${ic('plus')}</i>`}<span>${M('your_story')}</span></button>`;
  return `<div class="mgstories">${meItem}${STORIES.map(([n], i) => `<button class="mgst ${g.seen[n] ? 'seen' : ''}" data-act="mgstory" data-v="${i}">${mgAv(n, 'md')}<span>${esc(n)}</span></button>`).join('')}</div>`;
}

V.mg = () => { if (!NK.isPhone()) return mobileOnly(); if (!NK.S.me) return lock(); return wrapView('mg', `${storiesRow()}<div class="mgfeed">${allPosts().map(postCard).join('')}</div><p class="note mgrules">${small('info')} ${M('rules')}</p>`); };

V.mgpost = (p) => { if (!NK.isPhone()) return mobileOnly(); if (!NK.S.me) return lock(); const x = findPost(p.id); if (!x) return V.mg();
  return wrapView('mg', `<div class="mgfeed">${postCard(Object.assign({ cm: [] }, x))}</div><div class="mgwrap"><h4 style="margin:6px 0 10px">${t('comments_t')}</h4>${commentsBlock('mg:' + x.id, x.cm || [], { nodm: true })}</div>`); };

V.mgreels = () => { if (!NK.isPhone()) return mobileOnly(); if (!NK.S.me) return lock(); const g = st(); setTimeout(rulesModal, 60);
  const list = g.mine.filter(x => x.type === 'reel').concat(REELS);
  return { html: `<div class="mg mgdark">${top(M('reels'))}<div class="mgreels">${list.map(r => `<section class="mgreel">
    ${sessionMedia[r.id + ':v'] ? `<video src="${sessionMedia[r.id + ':v']}" playsinline muted loop autoplay></video>` : `<div class="kb" style="background-image:url(${media(r)})"></div>`}
    <div class="mgrside"><button class="${g.likes[r.id] ? 'on' : ''}" data-act="mglike" data-v="${r.id}">${ic('heart')}<small class="num">${nf(likeN(r))}</small></button><button data-act="mgpost" data-v="${r.id}">${ic('chat')}</button><button data-act="mgreport" data-v="${r.id}" aria-label="${t('report')}">${ic('flag')}</button></div>
    <div class="mgrinfo">${pLink(r.who, `${mgAv(r.who, 'sm')}<b>${esc(nameOf(r.who))}</b>${vmark(r.who)}`)}<p>${capHtml(r)}</p></div></section>`).join('')}</div></div>${nav('mgreels')}` };
};

function counts(n) { const g = st(); if (n === '@me') return [g.mine.filter(x => x.type === 'post').length, Object.keys(g.friends).length, Object.keys(g.follow).length];
  const b = BASE[n] || [60, 40]; return [allPosts().filter(x => x.who === n).length, b[0] + (g.follow[n] ? 1 : 0), b[1]]; }
function profileView(n) {
  const g = st(); const me = n === '@me'; const [pc, fol, fing] = counts(n);
  const posts = allPosts().filter(x => x.who === n);
  const cover = me ? g.cover : null;
  const ab = me ? (NK.S.me.about || '') : txt(((window.ABOUT || {})[n] || {}).about || '');
  const fr = g.friends[n], rq = g.req[n];
  const actions = me ? `<button class="btn soft mgbtn2" data-act="mgedit">${small('user')}${t('edit_profile')}</button>`
    : `<button class="btn ${g.follow[n] ? 'soft mgbtn2' : 'primary mgbtn'}" data-act="mgfollow" data-v="${esc(n)}">${M(g.follow[n] ? 'unfollow' : 'follow')}</button>
       <button class="btn soft mgbtn2" data-act="mgfriend" data-v="${esc(n)}" ${fr || rq ? 'disabled' : ''}>${small(fr ? 'check' : 'plus')}${M(fr ? 'is_friend' : rq ? 'req_sent' : 'add_friend')}</button>
       <button class="btn soft mgbtn2 sq ${fr ? '' : 'dim'}" data-act="mgdm" data-v="${esc(n)}" aria-label="${t('dm')}">${ic('send')}</button><button class="btn soft mgbtn2 sq" data-act="mgreport" data-v="${esc(n)}" aria-label="${t('report')}" title="${t('report')}">${ic('flag')}</button>`;
  return `<div class="mgcover" style="${cover ? `background-image:url(${cover})` : ''}">${me ? `<button class="mgcbtn" data-act="mgcover">${small('camera')}${M('cover')}</button>` : ''}</div>
    <div class="mgwrap mgprof"><div class="mgpav">${mgAv(n, 'xl')}</div>
    <h2>${esc(nameOf(n))}${me ? '' : vmark(n)}</h2>${ab ? `<p class="mgbio">${esc(ab)}</p>` : ''}
    <div class="mgcounts"><div><b class="num">${nf(pc)}</b><small>${M('posts')}</small></div><div><b class="num">${nf(fol)}</b><small>${M('followers')}</small></div><div><b class="num">${nf(fing)}</b><small>${M('following')}</small></div></div>
    <div class="mgpact">${actions}</div>${!me && !fr ? `<p class="note" style="text-align:center;margin-top:8px">${small('lock')} ${M('dm_lock')}</p>` : ''}
    <div class="mggrid">${posts.length ? posts.map(x => `<button data-act="mgpost" data-v="${x.id}" style="background-image:url(${media(x)})"></button>`).join('') : `<p class="note" style="grid-column:1/-1;text-align:center;padding:20px 0">${M('no_posts')}</p>`}</div></div>`;
}
V.mgme = () => { if (!NK.isPhone()) return mobileOnly(); if (!NK.S.me) return lock(); return wrapView('mgme', profileView('@me'), t('profile_l')); };
V.mgp = (p) => { if (!NK.isPhone()) return mobileOnly(); if (!NK.S.me) return lock(); return wrapView('', profileView(p.id), esc(p.id)); };

V.mgfriends = () => { if (!NK.isPhone()) return mobileOnly(); if (!NK.S.me) return lock(); const g = st();
  const inc = g.inc.filter(n => !g.friends[n]);
  const fl = Object.keys(g.friends);
  const people = Object.keys(BASE).filter(n => !g.friends[n]);
  const row = (n, right) => `<div class="mgrow">${pLink(n, mgAv(n, 'md'))}<div class="grow">${pLink(n, `<b>${esc(n)}</b>${vmark(n)}`)}</div>${right}</div>`;
  return wrapView('mgfriends', `<div class="mgwrap">
    ${inc.length ? `<h4>${M('requests')}</h4>${inc.map(n => row(n, `<button class="btn sm primary mgbtn" data-act="mgacc" data-v="${n}">${M('accept')}</button><button class="btn sm soft mgbtn2" data-act="mgdec" data-v="${n}">${M('decline')}</button>`)).join('')}` : ''}
    <h4>${M('friends')}</h4>${fl.length ? fl.map(n => row(n, `<button class="btn sm soft mgbtn2" data-act="mgdm" data-v="${n}">${ic('send')}</button>`)).join('') : `<p class="note">${M('no_friends')}</p>`}
    <h4>${M('people')}</h4>${people.map(n => row(n, `<button class="btn sm ${g.follow[n] ? 'soft mgbtn2' : 'primary mgbtn'}" data-act="mgfollow" data-v="${n}">${M(g.follow[n] ? 'unfollow' : 'follow')}</button>`)).join('')}
  </div>`, M('friends'));
};

/* stories viewer */
let stTimer = null;
function openStory(i) {
  const g = st(); const mine = g.mine.filter(x => x.type === 'story');
  const list = (mine.length ? [['@me', null, mine]] : []).concat(STORIES.map(([n, ph]) => [n, ph]));
  let k = i === 'me' ? 0 : (+i + (mine.length ? 1 : 0));
  const host = document.querySelector('.app') || document.body;
  const w = document.createElement('div'); w.className = 'mgstview'; host.appendChild(w);
  const close = () => { clearTimeout(stTimer); w.remove(); render(); };
  const show = () => {
    if (k >= list.length || k < 0) return close();
    const [n, ph, items] = list[k]; if (n !== '@me') g.seen[n] = true; save();
    const src = items ? media(items[items.length - 1]) : img(ph);
    w.innerHTML = `<div class="bar"><i style="animation-duration:5s"></i></div><div class="who">${mgAv(n, 'sm')}<b>${esc(nameOf(n))}</b><button data-x aria-label="${t('close')}">${ic('x')}</button></div><img src="${src}" alt=""><button class="nav l" data-p aria-label="prev"></button><button class="nav r" data-n aria-label="next"></button>`;
    w.querySelector('[data-x]').onclick = close; w.querySelector('[data-p]').onclick = () => { k--; show(); }; w.querySelector('[data-n]').onclick = () => { k++; show(); };
    clearTimeout(stTimer); stTimer = setTimeout(() => { k++; show(); }, 5000);
  };
  show();
}

/* create */
function createSheet(kind) {
  let type = kind || 'post', file = null;
  const w = sheet(`<h3>${M('new_post')}</h3>
    <div class="seg mgseg">${['post', 'story', 'reel'].map(x => `<button type="button" data-ty="${x}" class="${x === type ? 'on' : ''}">${M(x === 'post' ? 't_photo' : x === 'story' ? 't_story' : 't_reel')}</button>`).join('')}</div>
    <label class="mgpick"><input type="file" id="mgfile" accept="image/*,video/*" hidden><span id="mgprev">${ic('camera')}<b>${M('pick')}</b></span></label>
    <div class="field"><label for="mgcap">${M('caption')}</label><textarea id="mgcap" rows="2" placeholder="${M('caption_ph')}"></textarea></div>
    <p class="note" style="font-size:12px">${M('video_note')}</p>
    <button class="btn primary full mgbtn" id="mgpub" style="margin-top:10px">${t('publish')}</button>`);
  w.querySelectorAll('[data-ty]').forEach(b => b.onclick = () => { type = b.dataset.ty; w.querySelectorAll('[data-ty]').forEach(x => x.classList.toggle('on', x === b)); });
  w.querySelector('#mgfile').onchange = async (e) => { file = e.target.files[0]; if (!file) return; const pv = w.querySelector('#mgprev');
    if (file.type.startsWith('video')) { pv.innerHTML = `<video src="${URL.createObjectURL(file)}" muted autoplay loop playsinline></video>`; } else { const d = await resizeImg(file); file.data = d; pv.innerHTML = `<img src="${d}" alt="">`; } };
  w.querySelector('#mgpub').onclick = () => {
    if (!file) { w.querySelector('.mgpick').classList.add('err'); return; }
    const g = st(); const id = 'mm' + Date.now();
    const item = { id, type, who: '@me', cap: w.querySelector('#mgcap').value.trim(), ago: 0, likes: 0, cm: [], dist: NK.S.me.dist || '' };
    if (file.type.startsWith('video')) { sessionMedia[id + ':v'] = URL.createObjectURL(file); item.vid = true; item.ph = 'mg1'; } else item.data = file.data;
    g.mine.unshift(item); save(); w.remove(); toast(t('published'));
    go(type === 'reel' ? 'mgreels' : type === 'story' ? 'mg' : 'mgme');
  };
}
async function pickImage(cb) { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = async () => { const f = inp.files[0]; if (f) cb(await resizeImg(f)); }; inp.click(); }
function editSheet() {
  const w = sheet(`<h3>${t('edit_profile')}</h3>
    <div style="display:flex;gap:10px;margin:6px 0 14px"><button class="btn soft mgbtn2" id="mgph">${small('camera')}${M('photo')}</button><button class="btn soft mgbtn2" id="mgcv">${small('camera')}${M('cover')}</button></div>
    <div class="field"><label for="mgbio">${t('about_l')}</label><textarea id="mgbio" rows="3">${esc(NK.S.me.about || '')}</textarea></div>
    <button class="btn primary full mgbtn" id="mgsave">${t('save_l')}</button>`);
  w.querySelector('#mgph').onclick = () => pickImage(d => { NK.S.me.photos = [d].concat((NK.S.me.photos || []).slice(1)); save(); toast(t('saved_ok')); });
  w.querySelector('#mgcv').onclick = () => pickImage(d => { st().cover = d; save(); toast(t('saved_ok')); });
  w.querySelector('#mgsave').onclick = () => { NK.S.me.about = w.querySelector('#mgbio').value.trim(); save(); w.remove(); render(); };
}

/* actions */
window.MGACT = (a, v, el) => {
  if (!a.startsWith('mg')) return false;
  if (!NK.S.me && a !== 'mggo') { authSheet(); return true; }
  const g = st();
  switch (a) {
    case 'mggo': if (NK.stack.length && NK.stack[NK.stack.length - 1].v === v) return true; if (['mg', 'mgreels', 'mgfriends', 'mgme', 'mgchats'].includes(cur().v)) NK.stack[NK.stack.length - 1] = { v }; else NK.stack.push({ v }); render(true); return true;
    case 'mgp': if (v === '@me') { go('mgme'); return true; } go('mgp', { id: v }); return true;
    case 'mgpost': go('mgpost', { id: v }); return true;
    case 'mglike': g.likes[v] = !g.likes[v]; save(); render(); return true;
    case 'mgdbl': { const now = Date.now(); if (el._t && now - el._t < 320) { g.likes[v] = true; save(); el.classList.add('pop'); setTimeout(render, 450); } el._t = now; return true; }
    case 'mgfollow': g.follow[v] = !g.follow[v]; if (!g.follow[v]) delete g.follow[v]; save(); render(); return true;
    case 'mgfriend': g.req[v] = true; save(); render(); setTimeout(() => { if (!g.req[v]) return; delete g.req[v]; g.friends[v] = true; save(); toast(v + ' ' + M('accepted')); render(); }, 2500); return true;
    case 'mgacc': g.friends[v] = true; g.inc = g.inc.filter(x => x !== v); save(); render(); return true;
    case 'mgdec': g.inc = g.inc.filter(x => x !== v); save(); render(); return true;
    case 'mgdm': if (!g.friends[v]) { toast(M('dm_lock')); return true; } openDM(v); return true;
    case 'mgnew': createSheet(v); return true;
    case 'mgstory': openStory(v); return true;
    case 'mgedit': editSheet(); return true;
    case 'mgreport': g.rep = g.rep || {}; g.rep[v] = true; save(); toast(t('reported')); return true;
    case 'mgcover': pickImage(d => { g.cover = d; save(); render(); }); return true;
  }
  return false;
};

/* ================= LIVE (server) mode ================= */
const LV = window.LIVE;
if (LV) {
  const { want, dropData, liveAv, isAdmin } = NK;
  const FXM = (k) => L(window.FX[k]);
  const meId = () => LV.user && LV.user.id;
  const prof = (uid) => (uid === meId() && LV.profile) || LV.cached(uid) || {};
  const mname = (uid) => { const p = prof(uid); return p.mg_name || p.name || '…'; };
  const mphoto = (uid) => { const p = prof(uid); return p.mg_avatar || p.photo_url || ''; };
  const av = (uid, sz) => { const ph = mphoto(uid); return `<span class="mgav ${sz || ''}">${ph ? `<span class="av" style="background:url(${esc(ph)}) center/cover"></span>` : liveAv(uid)}</span>`; };
  window.__mgMeAv = () => av(meId(), 'xs');
  const vm = (uid) => prof(uid).verified ? vmark(window.VERIFIED[0]) : '';
  const link = (uid, inner) => `<button class="pbtn" data-act="mgp" data-v="${uid}">${inner}</button>`;
  const TRC = {};
  const trText = (key, text, from) => { if (!text || !from || from === NK.lang) return text; if (TRC[key]) return TRC[key].t; TRC[key] = { t: text }; LV.translate(text, from, NK.lang).then(r => { if (r) { TRC[key] = { t: r, tr: true }; if (cur().v === 'mgchat' && document.getElementById('mgthread')) paintThread(); else render(); } }); return text; };
  const trBadge = (key) => TRC[key] && TRC[key].tr ? `<span class="mgtr">${small('translate')}${t('auto_tr')}</span>` : '';
  const ago = (d) => { const h = Math.max(0, Math.round((Date.now() - new Date(d)) / 36e5)); return agoTxt(h); };
  const ready = () => { if (!NK.isPhone()) return mobileOnly(); if (LV.ready && LV.user && !(LV.profile && LV.profile.mg_on)) return setupView(); if (!NK.S.me || (LV.ready && !LV.user)) return landing(); acceptPending(); if (cur().v !== 'mgchat') inboxTick(); return null; };
  const loading = `<p class="note" style="text-align:center;padding:30px 0">…</p>`;
  const R = () => want('mg:rel', () => LV.rel()) || { friends: new Set(), out: new Set(), inc: [], follow: new Set() };
  const mediaHtml = (p) => p.media_type === 'video' ? `<video src="${esc(p.media_url)}" playsinline muted loop autoplay controls></video>` : `<img src="${esc(p.media_url)}" alt="" loading="lazy">`;
  const admBtns = (p) => isAdmin() ? `<div class="mgadm"><span>${small('shield')}${FXM('adm')}</span><button data-act="mgahide" data-v="${p.id}" data-h="${p.hidden ? 0 : 1}">${FXM(p.hidden ? 'act_show' : 'act_hide')}</button><button data-act="mgadel" data-v="${p.id}">${FXM('act_delete')}</button></div>` : '';
  const card = (p) => `<article class="mgpost ${p.hidden ? 'hid' : ''}">
    <div class="mgph">${link(p.author, av(p.author, 'sm'))}<div class="grow">${link(p.author, `<b>${esc(mname(p.author))}</b>${vm(p.author)}`)}${p.dist ? `<small>${small('pin')}${esc(loc(p.dist))}</small>` : ''}</div><small class="num">${ago(p.created_at)}</small></div>
    <div class="mgimg" data-act="mgdbl" data-v="${p.id}">${mediaHtml(p)}<i class="mgheart">${ic('heart')}</i></div>
    <div class="mgact"><button class="${p.liked ? 'on' : ''}" data-act="mglike" data-v="${p.id}" aria-label="like">${ic('heart')}</button><button data-act="mgpost" data-v="${p.id}" aria-label="${t('comment')}">${ic('chat')}</button>${p.author !== meId() ? `<button data-act="mgreport" data-v="${p.id}" data-t="post" aria-label="${t('report')}">${ic('flag')}</button>` : ''}<span class="num">${nf(p.likes)} ${M('likes')}</span></div>
    ${p.caption ? `<p class="mgcap">${link(p.author, `<b>${esc(mname(p.author))}</b>`)} ${esc(trText('p' + p.id, p.caption, p.lang))}${trBadge('p' + p.id)}</p>` : ''}
    ${p.ncm ? `<button class="mgmore" data-act="mgpost" data-v="${p.id}">${t('comments_t')} · <span class="num">${nf(p.ncm)}</span></button>` : ''}${admBtns(p)}
  </article>`;
  const ALL = {}; const keep = (list) => { (list || []).forEach(p => ALL[p.id] = p); return list; };
  const stories = () => {
    const list = keep(want('mg:stories', () => LV.posts('story'))) || []; const by = {}; list.forEach(s => { (by[s.author] = by[s.author] || []).push(s); });
    const mineS = by[meId()]; const others = Object.keys(by).filter(a => a !== meId());
    window.__mgSt = (mineS ? [[meId(), mineS]] : []).concat(others.map(a => [a, by[a]]));
    const g = st();
    return `<div class="mgstories"><button class="mgst ${mineS ? '' : 'add'}" data-act="${mineS ? 'mglst' : 'mgnew'}" data-v="${mineS ? 0 : 'story'}">${av(meId(), 'md')}${mineS ? '' : `<i>${ic('plus')}</i>`}<span>${M('your_story')}</span></button>${others.map((a, i) => `<button class="mgst ${g.seen[a] ? 'seen' : ''}" data-act="mglst" data-v="${i + (mineS ? 1 : 0)}">${av(a, 'md')}<span>${esc(mname(a))}</span></button>`).join('')}</div>`;
  };
  V.mg = () => { const r = ready(); if (r) return r; const feed = keep(want('mg:feed', () => LV.posts('post')));
    return wrapView('mg', `${stories()}${NK.S.me.banned ? `<div class="banner" style="margin:10px 14px">${ic('info')}<div>${FXM('banned')}</div></div>` : ''}<div class="mgfeed">${feed === undefined ? loading : feed && feed.length ? feed.map(card).join('') : `<div class="mgwrap" style="text-align:center">${mgLogo('big')}<p class="note">${FXM('mg_empty')}</p><button class="btn primary mgbtn" data-act="mgnew">${M('create')}</button></div>`}</div><p class="note mgrules">${small('info')} ${M('rules')}</p>`); };
  V.mgreels = () => { const r = ready(); if (r) return r; setTimeout(rulesModal, 60); const list = keep(want('mg:reels', () => LV.posts('reel')));
    return { html: `<div class="mg mgdark">${top(M('reels'))}<div class="mgreels">${list === undefined ? loading : list && list.length ? list.map(x => `<section class="mgreel">${x.media_type === 'video' ? `<video src="${esc(x.media_url)}" playsinline muted loop autoplay></video>` : `<div class="kb" style="background-image:url(${esc(x.media_url)})"></div>`}
      <div class="mgrside"><button class="${x.liked ? 'on' : ''}" data-act="mglike" data-v="${x.id}">${ic('heart')}<small class="num">${nf(x.likes)}</small></button><button data-act="mgpost" data-v="${x.id}">${ic('chat')}<small class="num">${nf(x.ncm)}</small></button><button data-act="mgreport" data-v="${x.id}" data-t="post">${ic('flag')}</button></div>
      <div class="mgrinfo">${link(x.author, `${av(x.author, 'sm')}<b>${esc(mname(x.author))}</b>${vm(x.author)}`)}<p>${esc(trText('p' + x.id, x.caption || '', x.lang))}${trBadge('p' + x.id)}</p>${admBtns(x)}</div></section>`).join('') : `<div class="mgwrap" style="text-align:center;padding-top:60px"><p class="note" style="color:#AFB7CC">${FXM('mg_empty')}</p><button class="btn primary mgbtn" data-act="mgnew" data-v="reel">${M('create')}</button></div>`}</div></div>${nav('mgreels')}` }; };
  V.mgpost = (p) => { const r = ready(); if (r) return r; const x = want('mg:post:' + p.id, () => LV.post(p.id)); if (x) ALL[x.id] = Object.assign(ALL[x.id] || {}, x);
    if (x === undefined) return wrapView('mg', loading); if (!x) return V.mg();
    const cms = (x.comments || []).map(c => `<div class="cmt"><span>${link(c.author, av(c.author, 'sm'))}</span><div class="cb"><div class="cw">${link(c.author, `<b>${esc(mname(c.author))}</b>${vm(c.author)}`)}<small class="num">${ago(c.created_at)}</small></div><p>${esc(trText('c' + c.id, c.body, c.lang))}${trBadge('c' + c.id)}</p>
      <div class="ca">${c.author !== meId() ? `<button data-act="mgreport" data-v="${c.id}" data-t="comment">${small('flag')}${t('report')}</button>` : ''}${isAdmin() || c.author === meId() ? `<button data-act="mgcdel" data-v="${c.id}" data-p="${x.id}">${small('x')}${FXM('act_delete')}</button>` : ''}</div></div></div>`).join('');
    return wrapView('mg', `<div class="mgfeed">${card(ALL[x.id])}</div><div class="mgwrap"><h4 style="margin:6px 0 10px">${t('comments_t')}</h4>${cms || `<p class="note">—</p>`}
      <div class="mgcbox"><textarea id="mgcin" rows="1" placeholder="${t('comment_ph')}"></textarea><button class="btn primary mgbtn" data-act="mgcsend" data-v="${x.id}">${ic('send')}</button></div></div>`); };
  const profView = (uid) => {
    const me = uid === meId(); const pr = me ? LV.profile || {} : (LV.cached(uid) || want('mg:pf:' + uid, () => LV.fetchProfile(uid)) || {});
    const cnt = want('mg:cnt:' + uid, () => LV.counts(uid)) || [0, 0, 0]; const posts = keep(want('mg:up:' + uid, () => LV.posts('grid', uid))) || []; const rel = R();
    const fr = rel.friends.has(uid), rq = rel.out.has(uid), fo = rel.follow.has(uid);
    const actions = me ? `<button class="btn soft mgbtn2" data-act="mgedit">${small('user')}${t('edit_profile')}</button><button class="btn primary mgbtn" data-act="mginvite">${small('plus')}${M('invite')}</button>`
      : `<button class="btn ${fo ? 'soft mgbtn2' : 'primary mgbtn'}" data-act="mgfollow" data-v="${uid}">${M(fo ? 'unfollow' : 'follow')}</button><button class="btn soft mgbtn2" data-act="mgfriend" data-v="${uid}" ${fr || rq ? 'disabled' : ''}>${small(fr ? 'check' : 'plus')}${M(fr ? 'is_friend' : rq ? 'req_sent' : 'add_friend')}</button><button class="btn soft mgbtn2 sq ${fr ? '' : 'dim'}" data-act="mgdm" data-v="${uid}" aria-label="${t('dm')}">${ic('send')}</button><button class="btn soft mgbtn2 sq" data-act="mgreport" data-v="${uid}" data-t="user" aria-label="${t('report')}">${ic('flag')}</button>`;
    const adm = isAdmin() && !me ? `<div class="mgadmbar"><b>${small('shield')}${FXM('adm')}</b><button data-act="mgaflag" data-v="${uid}" data-f="verified" data-x="${pr.verified ? 0 : 1}">${FXM(pr.verified ? 'act_unverify' : 'act_verify')}</button><button data-act="mgaflag" data-v="${uid}" data-f="banned" data-x="${pr.banned ? 0 : 1}">${FXM(pr.banned ? 'act_unban' : 'act_ban')}</button><button data-act="mgawarn" data-v="${uid}">${FXM('act_warn')}</button></div>` : '';
    return `<div class="mgcover" style="${pr.cover_url ? `background-image:url(${esc(pr.cover_url)})` : ''}">${me ? `<button class="mgcbtn" data-act="mgcover">${small('camera')}${M('cover')}</button>` : ''}</div>
    <div class="mgwrap mgprof"><div class="mgpav">${av(uid, 'xl')}</div><h2>${esc(mname(uid))}${vm(uid)}</h2>${pr.banned ? `<p class="tag" style="background:var(--rose-tint);color:var(--rose)">${FXM('act_ban')}</p>` : ''}${pr.mg_bio ? `<p class="mgbio">${esc(me ? pr.mg_bio : trText('a' + uid, pr.mg_bio, pr.ui_lang))}</p>` : ''}
    <div class="mgcounts"><div><b class="num">${nf(cnt[0])}</b><small>${M('posts')}</small></div><div><b class="num">${nf(cnt[1])}</b><small>${M('followers')}</small></div><div><b class="num">${nf(cnt[2])}</b><small>${M('following')}</small></div></div>
    <div class="mgpact">${actions}</div>${!me && !fr ? `<p class="note" style="text-align:center;margin-top:8px">${small('lock')} ${M('dm_lock')}</p>` : ''}${adm}
    <div class="mggrid">${posts.length ? posts.map(x => x.media_type === 'video' ? `<button class="mgvt" data-act="mgpost" data-v="${x.id}"><video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video>${ic('play')}</button>` : `<button data-act="mgpost" data-v="${x.id}" style="background-image:url(${esc(x.media_url)})"></button>`).join('') : `<p class="note" style="grid-column:1/-1;text-align:center;padding:20px 0">${M('no_posts')}</p>`}</div></div>`;
  };
  V.mgme = () => { const r = ready(); if (r) return r; return wrapView('mgme', profView(meId()), t('profile_l')); };
  V.mgp = (p) => { const r = ready(); if (r) return r; if (p.id === meId()) return V.mgme(); return wrapView('', profView(p.id), esc(mname(p.id))); };
  V.mgfriends = () => V.mgchats({ k: 'friends' });
  const friendsBody = () => { const rel = R(); const people = (want('mg:people', () => LV.mgPeople()) || []).filter(x => x.id !== meId());
    const row = (uid, right) => `<div class="mgrow">${link(uid, av(uid, 'md'))}<div class="grow">${link(uid, `<b>${esc(mname(uid))}</b>${vm(uid)}`)}</div>${right}</div>`;
    return `<div class="mgwrap">${inviteCard()}
      ${rel.inc.length ? `<h4>${M('requests')}</h4>${rel.inc.map(q => row(q.from_id, `<button class="btn sm primary mgbtn" data-act="mgacc" data-v="${q.id}">${M('accept')}</button><button class="btn sm soft mgbtn2" data-act="mgdec" data-v="${q.id}">${M('decline')}</button>`)).join('')}` : ''}
      <h4>${M('friends')}</h4>${rel.friends.size ? [...rel.friends].map(uid => row(uid, `<button class="btn sm primary mgbtn" data-act="mgdm" data-v="${uid}">${small('chat')}${M('write')}</button>`)).join('') : `<p class="note">${M('no_friends')}</p>`}
      <h4>${M('people')}</h4>${people.filter(x => !rel.friends.has(x.id)).map(x => row(x.id, `<button class="btn sm ${rel.follow.has(x.id) ? 'soft mgbtn2' : 'primary mgbtn'}" data-act="mgfollow" data-v="${x.id}">${M(rel.follow.has(x.id) ? 'unfollow' : 'follow')}</button>`)).join('') || `<p class="note">—</p>`}
    </div>`; };

  /* live stories viewer */
  const openLiveStory = (k) => { const list = window.__mgSt || []; const host = document.querySelector('.app') || document.body; const w = document.createElement('div'); w.className = 'mgstview'; host.appendChild(w); let tm;
    const close = () => { clearTimeout(tm); w.remove(); render(); };
    const show = () => { if (k < 0 || k >= list.length) return close(); const [a, items] = list[k]; st().seen[a] = true; save(); const s = items[0];
      w.innerHTML = `<div class="bar"><i style="animation-duration:6s"></i></div><div class="who">${av(a, 'sm')}<b>${esc(mname(a))}</b>${a !== meId() ? `<button data-r aria-label="${t('report')}">${ic('flag')}</button>` : ''}<button data-x aria-label="${t('close')}">${ic('x')}</button></div>${s.media_type === 'video' ? `<video src="${esc(s.media_url)}" autoplay playsinline></video>` : `<img src="${esc(s.media_url)}" alt="">`}${s.caption ? `<p class="stcap">${esc(trText('p' + s.id, s.caption, s.lang))}</p>` : ''}<button class="nav l" data-p></button><button class="nav r" data-n></button>`;
      w.querySelector('[data-x]').onclick = close; const rb = w.querySelector('[data-r]'); if (rb) rb.onclick = () => LV.report('post', s.id).then(() => toast(t('reported')));
      w.querySelector('[data-p]').onclick = () => { k--; show(); }; w.querySelector('[data-n]').onclick = () => { k++; show(); }; clearTimeout(tm); tm = setTimeout(() => { k++; show(); }, 6000); };
    show(); };

  /* live create */
  const createLive = (kind) => { let type = kind || 'post', file = null, data = null;
    const w = sheet(`<h3>${M('new_post')}</h3><div class="seg mgseg">${['post', 'story', 'reel'].map(x => `<button type="button" data-ty="${x}" class="${x === type ? 'on' : ''}">${M(x === 'post' ? 't_photo' : x === 'story' ? 't_story' : 't_reel')}</button>`).join('')}</div>
      <label class="mgpick"><input type="file" id="mgfile" accept="image/*,video/*" hidden><span id="mgprev">${ic('camera')}<b>${M('pick')}</b></span></label>
      <div class="field"><label for="mgcap">${M('caption')}</label><textarea id="mgcap" rows="2" placeholder="${M('caption_ph')}"></textarea></div>
      <p class="note" style="font-size:12px">${M('rules')}</p><button class="btn primary full mgbtn" id="mgpub" style="margin-top:10px">${t('publish')}</button>`);
    w.querySelectorAll('[data-ty]').forEach(b => b.onclick = () => { type = b.dataset.ty; w.querySelectorAll('[data-ty]').forEach(x => x.classList.toggle('on', x === b)); });
    w.querySelector('#mgfile').onchange = async (e) => { file = e.target.files[0]; data = null; if (!file) return; const pv = w.querySelector('#mgprev');
      if (file.type.startsWith('video')) { if (file.size > 50 * 1048576) { toast(FXM('too_big')); file = null; return; } pv.innerHTML = `<video src="${URL.createObjectURL(file)}" muted autoplay loop playsinline></video>`; } else { data = await resizeImg(file); pv.innerHTML = `<img src="${data}" alt="">`; } };
    w.querySelector('#mgpub').onclick = async (ev) => { if (!file) { w.querySelector('.mgpick').classList.add('err'); return; } const b = ev.currentTarget; b.disabled = true; b.textContent = '…';
      try { const isV = file.type.startsWith('video'); const url = await LV.upload(isV ? file : data, type);
        await LV.createPost({ type, media_url: url, media_type: isV ? 'video' : 'image', caption: w.querySelector('#mgcap').value.trim(), lang: NK.lang, dist: NK.S.me.dist || '' });
        w.remove(); toast(t('published')); dropData('mg:'); go(type === 'reel' ? 'mgreels' : 'mg');
      } catch (e) { console.warn(e); toast(FXM('send_fail')); b.disabled = false; b.textContent = t('publish'); } }; };
  const pickImg = (cb) => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = async () => { const f = inp.files[0]; if (f) cb(await resizeImg(f)); }; inp.click(); };
  const editLive = () => { const w = sheet(`<h3>${t('edit_profile')}</h3><div style="display:flex;gap:10px;margin:6px 0 14px"><button class="btn soft mgbtn2" id="mgph">${small('camera')}${M('photo')}</button><button class="btn soft mgbtn2" id="mgcv">${small('camera')}${M('cover')}</button></div>
      <div class="field"><label for="mgnm">${M('name_l')}</label><input id="mgnm" maxlength="40" value="${esc(mname(meId()))}"></div>
      <div class="field"><label for="mgbio">${t('about_l')}</label><textarea id="mgbio" rows="3">${esc((LV.profile || {}).mg_bio || '')}</textarea></div><button class="btn primary full mgbtn" id="mgsave">${t('save_l')}</button>`);
    const up = async (data, field) => { try { const url = await LV.upload(data, field); const pr = await LV.updateProfile({ [field]: url }); NK.S.me = NK.meFrom(pr); save(); toast(t('saved_ok')); render(); } catch (e) { toast(FXM('send_fail')); } };
    w.querySelector('#mgph').onclick = () => pickImg(d => up(d, 'mg_avatar')); w.querySelector('#mgcv').onclick = () => pickImg(d => up(d, 'cover_url'));
    w.querySelector('#mgsave').onclick = async () => { try { const nmv = w.querySelector('#mgnm').value.trim(); const pr = await LV.updateProfile(Object.assign({ mg_bio: w.querySelector('#mgbio').value.trim() }, nmv ? { mg_name: nmv } : {})); NK.S.me = NK.meFrom(pr); save(); w.remove(); render(); } catch (e) { toast(FXM('send_fail')); } }; };

  /* ===== Magaam as its own app: sign-in, own profile, invites ===== */
  const MR = { step: 1, email: '', err: '', photo: null };
  const S_ = () => NK.S;
  const invCode = () => S_().mgInvite || '';
  const invBox = () => { const c = invCode(); if (!c) return ''; const inf = want('mg:inv:' + c, () => LV.inviteInfo(c));
    return inf && inf.name ? `<div class="mginv">${inf.avatar ? `<span class="av lg" style="background:url(${esc(inf.avatar)}) center/cover"></span>` : `<span class="av lg ill">${NK.avatar(inf.name)}</span>`}<div><b>${esc(inf.name)}</b><span>${M('invites_you')}</span></div></div>` : ''; };
  const langSel = () => `<select id="mglang" class="mgsel">${(window.LANGS || []).map(l => `<option value="${l.code}" ${l.code === NK.lang ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}</select>`;
  const landing = () => { const err = MR.err ? `<p class="mgerr">${esc(MR.err)}</p>` : '';
    const body = MR.step === 1 ? `<div class="field"><label for="mgem">${t('email_l')}</label><input id="mgem" type="email" inputmode="email" autocomplete="email" dir="ltr" value="${esc(MR.email)}" placeholder="name@mail.com"></div>
        <div class="field"><label for="mglang">${L(window.FX.lang_l)}</label>${langSel()}</div>${err}<button class="btn primary full mgbtn" data-act="mgrsend">${t('get_code')}</button>`
      : `<p class="note" style="margin:0 0 10px">${L(window.FX.code_sent)} <b dir="ltr">${esc(MR.email)}</b></p><div class="field"><label for="mgcode">${M('code_l')}</label><input id="mgcode" inputmode="numeric" autocomplete="one-time-code" maxlength="8" dir="ltr" style="letter-spacing:6px;font-size:22px;text-align:center"></div>${err}
        <button class="btn primary full mgbtn" data-act="mgrverify">${M('enter')}</button><div style="display:flex;justify-content:space-between;margin-top:12px"><button class="mglink" data-act="mgrback">${M('other_email')}</button><button class="mglink" data-act="mgrsend" data-v="again">${t('get_code')}</button></div>
        <p class="note" style="font-size:12px;margin-top:10px">${L(window.FX.spam_hint)}</p>`;
    return { html: `<div class="mg mgland"><div class="mgwrap"><div class="mglhead">${mgLogo('big')}<h1>MAGAAM</h1><p>${M('tag2')}</p></div>${invBox()}<div class="mgcard">${body}</div></div></div>` }; };
  const setupView = () => { const pr = LV.profile || {}; const ph = MR.photo || pr.mg_avatar || pr.photo_url || '';
    return { html: `<div class="mg mgland"><div class="mgwrap"><div class="mglhead">${mgLogo()}<h2>${M('setup_t')}</h2><p>${M('setup_d')}</p></div>${invBox()}<div class="mgcard">
      <button class="mgsetph" data-act="mgrphoto">${ph ? `<span style="background-image:url(${esc(ph)})"></span>` : `<span>${ic('camera')}</span>`}<b>${M('photo')}</b></button>
      <div class="field"><label for="mgnm">${M('name_l')} *</label><input id="mgnm" maxlength="40" value="${esc(pr.mg_name || pr.name || '')}"></div>
      <div class="field"><label for="mgbio">${t('about_l')}</label><textarea id="mgbio" rows="2">${esc(pr.mg_bio || '')}</textarea></div>${MR.err ? `<p class="mgerr">${esc(MR.err)}</p>` : ''}
      <button class="btn primary full mgbtn" data-act="mgrsave">${M('start')}</button></div></div></div>` }; };
  let accepting = false;
  const acceptPending = () => { const c = invCode(); if (!c || accepting || !LV.user || !(LV.profile && LV.profile.mg_on)) return; accepting = true;
    LV.acceptInvite(c).then(inv => { delete S_().mgInvite; save(); accepting = false; if (inv) { LV.prof([inv]).then(() => { toast(M('inv_ok') + ' ' + mname(inv)); dropData('mg:'); render(); }); } }).catch(e => { console.warn(e); accepting = false; delete S_().mgInvite; save(); }); };
  const inviteLink = () => 'https://verghethorn.com/magaam/?i=' + ((LV.profile || {}).invite_code || '');
  const inviteCard = () => `<button class="mginvcard" data-act="mginvite"><i>${ic('plus')}</i><span><b>${M('invite')}</b><small>${M('invite_d')}</small></span></button>`;
  const inviteSheet = () => { const link = inviteLink(), text = M('inv_text') + ' ' + link;
    const w = sheet(`<div style="text-align:center">${mgLogo()}<h3 style="margin:8px 0 4px">${M('invite')}</h3><p class="note" style="margin:0 0 12px">${M('invite_d')}</p></div>
      <div class="mglinkbox" dir="ltr">${esc(link)}</div>
      ${navigator.share ? `<button class="btn primary full mgbtn" data-x="share" style="margin-top:10px">${small('send')}${M('share')}</button>` : ''}
      <div class="mgshare"><a class="btn soft mgbtn2" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn soft mgbtn2" href="https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(M('inv_text'))}" target="_blank" rel="noopener">Telegram</a><button class="btn soft mgbtn2" data-x="copy">${M('copy_link')}</button></div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return;
      if (b.dataset.x === 'share') navigator.share({ title: 'Magaam', text: M('inv_text'), url: link }).catch(() => {});
      if (b.dataset.x === 'copy') { (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(() => toast(M('copied'))).catch(() => { const ta = document.createElement('textarea'); ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(M('copied')); }); } }); };

  /* ===== messenger ===== */
  const MGM = {}, OTHER_READ = {}, DRAFT = {}, REPLY = {}; let openChat = null, typingCh = null, typingT = null;
  const hm = (d) => new Date(d).toLocaleTimeString(NK.lang === 'ar' ? 'ar' : NK.lang, { hour: '2-digit', minute: '2-digit' });
  const dayLabel = (d) => { const x = new Date(d), n = new Date(); const k = (y) => y.toDateString(); const yd = new Date(Date.now() - 864e5);
    return k(x) === k(n) ? M('today') : k(x) === k(yd) ? M('yesterday') : x.toLocaleDateString(NK.lang, { day: 'numeric', month: 'long' }); };
  const shortTime = (d) => { const x = new Date(d); return x.toDateString() === new Date().toDateString() ? hm(d) : x.toLocaleDateString(NK.lang, { day: 'numeric', month: 'short' }); };
  const inboxTick = () => { const inb = want('mg:inbox', () => LV.mgInbox()); window.__mgUnread = (inb || []).reduce((s, c) => s + Number(c.unread || 0), 0); };
  const ticks = (m, chatId) => { const rd = OTHER_READ[chatId]; return `<i class="mgtick ${rd && new Date(rd) >= new Date(m.created_at) ? 'rd' : ''}">${rd && new Date(rd) >= new Date(m.created_at) ? '✓✓' : '✓'}</i>`; };
  const bubble = (m, chatId) => { const mine = m.sender === meId(); const list = MGM[chatId] || [];
    if (m.deleted) return `<div class="mgb ${mine ? 'me' : ''} del" data-mid="${m.id}"><span>${M('deleted')}</span><small>${hm(m.created_at)}</small></div>`;
    const rq = m.reply_to ? list.find(x => x.id === m.reply_to) : null;
    const txtv = mine ? m.body : trText('mg' + m.id, m.body, m.lang);
    return `<div class="mgb ${mine ? 'me' : ''}" data-act="mgbtap" data-v="${m.id}" data-mid="${m.id}">${rq ? `<span class="mgq"><b>${esc(mname(rq.sender))}</b>${esc(rq.deleted ? M('deleted') : rq.body || M('photo_msg'))}</span>` : ''}${m.media_url ? `<img src="${esc(m.media_url)}" alt="" loading="lazy">` : ''}${m.body ? `<span class="mgtx">${esc(txtv)}</span>` : ''}${!mine && TRC['mg' + m.id] && TRC['mg' + m.id].tr ? `<em class="mgtrs">${small('translate')}${t('auto_tr')}</em>` : ''}<small>${hm(m.created_at)}${mine ? ticks(m, chatId) : ''}</small></div>`; };
  const threadHtml = (chatId) => { const list = MGM[chatId] || []; let last = ''; return list.map(m => { const d = new Date(m.created_at).toDateString(); const sep = d !== last ? `<div class="mgday"><span>${dayLabel(m.created_at)}</span></div>` : ''; last = d; return sep + bubble(m, chatId); }).join(''); };
  const paintThread = () => { if (!openChat) return; const th = document.getElementById('mgthread'); if (!th) return; const atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 120; th.innerHTML = threadHtml(openChat.id); if (atEnd) scrollEnd(); };
  const scrollEnd = () => setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 20);
  const markRead = (chatId) => { LV.mgRead(chatId).catch(() => {}); };

  V.mgchats = (p) => { const r = ready(); if (r) return r; const k = (p && p.k) || 'chats';
    const seg = `<div class="seg mgseg" style="margin:10px 14px">${['chats', 'friends'].map(x => `<button class="${x === k ? 'on' : ''}" data-act="mggo" data-v="${x === 'chats' ? 'mgchats' : 'mgfriends'}">${M(x)}${x === 'friends' && R().inc.length ? ` <em class="mgbadge num" style="position:static">${R().inc.length}</em>` : ''}</button>`).join('')}</div>`;
    if (k === 'friends') return wrapView('mgfriends', seg + friendsBody(), M('chats'));
    const inb = want('mg:inbox', () => LV.mgInbox());
    const rows = (inb || []).map(c => { const un = Number(c.unread || 0); const mineLast = c.last_sender === meId(); const rd = c.other_read && new Date(c.other_read) >= new Date(c.last_at);
      return `<button class="mgchatrow" data-act="mgopen" data-v="${c.id}" data-u="${c.other}" data-nm="${esc(mname(c.other).toLowerCase())}">${av(c.other, 'md')}<span class="grow"><span class="mgcr1"><b>${esc(mname(c.other))}</b><small class="num">${shortTime(c.last_at)}</small></span><span class="mgcr2"><span class="mgprev">${mineLast ? `<i class="mgtick ${rd ? 'rd' : ''}">${rd ? '✓✓' : '✓'}</i> ` : ''}${esc(c.last_body || '')}</span>${un ? `<em class="mgunread num">${un > 99 ? '99+' : un}</em>` : ''}</span></span></button>`; }).join('');
    return wrapView('mgchats', seg + `<div class="mgwrap" style="padding-top:0"><div class="mgsearch">${ic('search')}<input type="search" placeholder="${M('search')}" aria-label="${M('search')}" oninput="var q=this.value.toLowerCase();document.querySelectorAll('.mgchatrow').forEach(function(e){e.hidden=e.dataset.nm.indexOf(q)<0})"></div>
      ${inb === undefined ? loading : rows || `<div class="mgempty">${mgLogo()}<p>${M('no_chats')}</p></div>`}${inviteCard()}</div>`, M('chats')); };

  V.mgchat = (p) => { const r = ready(); if (r) return r; const id = p.id, other = p.u;
    if (!MGM[id] && !p._l) { p._l = 1; Promise.all([LV.mgMessages(id), LV.mgOtherRead(id), LV.prof([other])]).then(([ms, rd]) => { MGM[id] = ms; OTHER_READ[id] = rd; if (cur().v === 'mgchat' && cur().id === id) { if (document.getElementById('mgthread')) paintThread(); else render(); scrollEnd(); } markRead(id); }).catch(e => { console.warn(e); toast(FXM('send_fail')); }); }
    const rq = REPLY[id] ? (MGM[id] || []).find(x => x.id === REPLY[id]) : null;
    return { html: `<div class="mg mgchatv"><header class="mgctop"><button class="mgic" data-act="mgchatback" aria-label="${t('back')}">${ic('back', 'flip')}</button>${link(other, av(other, 'sm'))}<div class="grow">${link(other, `<b>${esc(mname(other))}</b>${vm(other)}`)}<small id="mgsub"></small></div></header>
      <div class="mgthread" id="mgthread">${MGM[id] ? threadHtml(id) : loading}</div>
      <div class="mgcomp">${rq ? `<div class="mgrq"><span><b>${esc(mname(rq.sender))}</b>${esc(rq.body || M('photo_msg'))}</span><button data-act="mgrqx" aria-label="${t('close')}">${small('x')}</button></div>` : ''}
        <div class="mgcrow"><button class="mgic" data-act="mgphoto" aria-label="${M('photo_msg')}">${ic('camera')}</button><textarea id="mgmsg" rows="1" placeholder="${M('msg_ph')}" aria-label="${M('msg_ph')}"></textarea><button class="mgsend" data-act="mgsendm" aria-label="send">${ic('send', 'flip')}</button></div></div></div>` }; };

  const sendText = async () => { if (!openChat) return; const ta = document.getElementById('mgmsg'); const tx = ta ? ta.value.trim() : ''; if (!tx) return; const id = openChat.id;
    ta.value = ''; DRAFT[id] = ''; ta.style.height = 'auto'; const rp = REPLY[id]; delete REPLY[id]; const rqb = document.querySelector('.mgrq'); if (rqb) rqb.remove();
    try { const m = await LV.mgSend(id, tx, NK.lang, null, rp); const l = MGM[id] = MGM[id] || []; if (!l.some(x => x.id === m.id)) l.push(m); paintThread(); scrollEnd(); dropData('mg:inbox'); }
    catch (e) { console.warn(e); toast(FXM('send_fail')); ta.value = tx; } };
  window.MGAFTER = (c) => {
    if (c.v !== 'mgchat') { if (openChat) { if (typingCh) typingCh.leave(); typingCh = null; openChat = null; dropData('mg:inbox'); } return; }
    if (!openChat || openChat.id !== c.id) { if (typingCh) typingCh.leave(); openChat = { id: c.id, u: c.u };
      typingCh = LV.mgTyping(c.id, () => { const s = document.getElementById('mgsub'); if (s) { s.textContent = M('typing'); clearTimeout(typingT); typingT = setTimeout(() => { const s2 = document.getElementById('mgsub'); if (s2) s2.textContent = ''; }, 3000); } }); scrollEnd(); }
    const ta = document.getElementById('mgmsg'); if (!ta) return; ta.value = DRAFT[c.id] || '';
    const auto = () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; }; auto();
    ta.addEventListener('input', () => { DRAFT[c.id] = ta.value; auto(); if (typingCh) typingCh.send(); });
    ta.addEventListener('keydown', ev => { if (ev.key === 'Enter' && !ev.shiftKey && !('ontouchstart' in window)) { ev.preventDefault(); sendText(); } });
  };
  LV.onMg((kind, row, ev) => {
    if (!LV.user) return;
    if (kind === 'read') { if (row.user_id === meId()) return; OTHER_READ[row.chat_id] = row.read_at; if (openChat && openChat.id === row.chat_id) paintThread(); else if (cur().v === 'mgchats') { dropData('mg:inbox'); render(); } return; }
    const list = MGM[row.chat_id];
    if (ev === 'UPDATE') { if (list) { const i = list.findIndex(x => x.id === row.id); if (i >= 0) list[i] = row; } if (openChat && openChat.id === row.chat_id) paintThread(); return; }
    if (list && !list.some(x => x.id === row.id)) list.push(row);
    if (openChat && openChat.id === row.chat_id) { paintThread(); if (row.sender !== meId()) { markRead(row.chat_id); const s = document.getElementById('mgsub'); if (s) s.textContent = ''; } return; }
    if (row.sender === meId()) return;
    dropData('mg:inbox'); LV.mgInbox().then(inb => { DATA_SET(inb); }).catch(() => {});
    LV.prof([row.sender]).then(() => toast(mname(row.sender) + ': ' + (row.body ? String(row.body).slice(0, 60) : M('photo_msg'))));
  });
  const DATA_SET = (inb) => { window.__mgUnread = (inb || []).reduce((s, c) => s + Number(c.unread || 0), 0); if (String(cur().v).startsWith('mg') && cur().v !== 'mgchat' && !document.querySelector('.sheet-wrap')) render(); };
  const msgSheet = (id) => { const c = openChat; if (!c) return; const m = (MGM[c.id] || []).find(x => String(x.id) === String(id)); if (!m || m.deleted) return; const mine = m.sender === meId();
    const w = sheet(`<div class="mgmsheet">${m.body ? `<p>${esc(m.body)}</p>` : ''}<button data-x="reply">${ic('chat')}${t('reply')}</button>${m.body ? `<button data-x="copy">${ic('copy')}${M('copy')}</button>` : ''}${mine ? `<button data-x="del" class="bad">${ic('x')}${M('del_msg')}</button>` : `<button data-x="rep" class="bad">${ic('flag')}${t('report')}</button>`}${isAdmin() && !mine ? `<button data-x="adel" class="bad">${ic('x')}${FXM('act_delete')}</button>` : ''}</div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; const x = b.dataset.x; w.remove();
      if (x === 'reply') { REPLY[c.id] = m.id; render(); setTimeout(() => { const ta = document.getElementById('mgmsg'); if (ta) ta.focus(); }, 50); }
      if (x === 'copy') { (navigator.clipboard ? navigator.clipboard.writeText(m.body) : Promise.reject()).then(() => toast(M('copied'))).catch(() => {}); }
      if (x === 'del') LV.mgDelete(m.id).then(() => { m.deleted = true; m.body = ''; m.media_url = null; paintThread(); dropData('mg:inbox'); }).catch(fail0);
      if (x === 'adel') LV.mgDelete(m.id).then(() => { m.deleted = true; paintThread(); }).catch(fail0);
      if (x === 'rep') LV.report('message', m.id, '', { snapshot: String(m.body || '').slice(0, 500), target_author: m.sender, place: 'mg:' + c.id }).then(() => toast(t('reported'))).catch(fail0); }); };
  const fail0 = (e) => { console.warn(e); toast(FXM('send_fail')); };
  const sendPhoto = () => { if (!openChat) return; const id = openChat.id; pickImg(async d => { try { toast('…'); const url = await LV.upload(d, 'chat'); const m = await LV.mgSend(id, '', NK.lang, url, REPLY[id]); delete REPLY[id]; const l = MGM[id] = MGM[id] || []; if (!l.some(x => x.id === m.id)) l.push(m); paintThread(); scrollEnd(); } catch (e) { fail0(e); } }); };
  const regAct = async (a, el) => {
    if (a === 'mgrsend') { const em = document.getElementById('mgem'); if (em) MR.email = em.value.trim().toLowerCase(); const ls = document.getElementById('mglang'); if (ls && ls.value !== NK.lang && NK.setLang) NK.setLang(ls.value);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(MR.email)) { MR.err = t('err_email'); MR.step = 1; return render(); }
      el.disabled = true; MR.err = ''; try { await LV.sendCode(MR.email, NK.lang); MR.step = 2; toast(L(window.FX.code_sent) + ' ' + MR.email); } catch (e) { MR.err = L(window.FX.send_fail); }
      return NK.boot ? NK.boot() : render(); }
    if (a === 'mgrback') { MR.step = 1; MR.err = ''; return render(); }
    if (a === 'mgrverify') { const c = (document.getElementById('mgcode') || {}).value || ''; if (c.replace(/\D/g, '').length < 6) { MR.err = L(window.FX.code_bad); return render(); }
      el.disabled = true; try { const pr = await LV.verifyCode(MR.email, c.replace(/\D/g, '')); MR.err = ''; MR.step = 1; if (pr) NK.applyLive(pr); else { NK.S.me = { live: true, name: '', mgPending: true }; } save(); render(); }
      catch (e) { MR.err = L(window.FX.code_bad); render(); } return; }
    if (a === 'mgrphoto') { pickImg(d => { MR.photo = d; render(); }); return; }
    if (a === 'mgrsave') { const nm = (document.getElementById('mgnm') || {}).value; const bio = ((document.getElementById('mgbio') || {}).value || '').trim();
      if (!nm || !nm.trim()) { MR.err = t('err_name') || '!'; return render(); } el.disabled = true;
      try { let url = null; if (MR.photo && MR.photo.startsWith('data:')) url = await LV.upload(MR.photo, 'avatar');
        let pr; if (LV.profile) pr = await LV.updateProfile(Object.assign({ mg_on: true, mg_name: nm.trim(), mg_bio: bio }, url ? { mg_avatar: url } : {}));
        else pr = await LV.createProfile({ name: nm.trim(), mg_on: true, mg_name: nm.trim(), mg_bio: bio, origin: 'magaam', ui_lang: NK.lang, photo_url: url, mg_avatar: url });
        MR.photo = null; MR.err = ''; NK.applyLive(pr); save(); NK.stack.length = 1; NK.stack[0] = { v: 'mg' }; render(true); }
      catch (e) { console.warn(e); MR.err = L(window.FX.send_fail); el.disabled = false; render(); } return; }
  };
  const prevAct = window.MGACT;
  window.MGACT = (a, v, el) => {
    if (!a.startsWith('mg')) return false;
    if (['mgrsend', 'mgrback', 'mgrverify', 'mgrphoto', 'mgrsave'].includes(a)) { regAct(a, el); return true; }
    if (!NK.S.me && a !== 'mggo') { render(); return true; }
    const fail = (e) => { console.warn(e); toast(FXM('send_fail')); };
    const reload = (k) => { dropData(k || 'mg:'); render(); };
    switch (a) {
      case 'mglike': { const p = ALL[v]; if (!p) return true; p.liked = !p.liked; p.likes += p.liked ? 1 : -1; render(); LV.like(v, p.liked).catch(fail); return true; }
      case 'mgdbl': { const now = Date.now(); if (el._t && now - el._t < 320) { const p = ALL[v]; if (p && !p.liked) { p.liked = true; p.likes++; LV.like(v, true).catch(fail); } el.classList.add('pop'); setTimeout(render, 450); } el._t = now; return true; }
      case 'mgfollow': { const rel = R(); const on = !rel.follow.has(v); if (on) rel.follow.add(v); else rel.follow.delete(v); render(); LV.follow(v, on).then(() => reload('mg:cnt:')).catch(fail); return true; }
      case 'mgfriend': LV.friendRequest(v).then(() => { toast(M('req_sent')); reload('mg:rel'); }).catch(fail); return true;
      case 'mgacc': LV.answerRequest(v, true).then(() => reload('mg:rel')).catch(fail); return true;
      case 'mgdec': LV.answerRequest(v, false).then(() => reload('mg:rel')).catch(fail); return true;
      case 'mgdm': LV.rel().then(rel => { if (!rel.friends.has(v)) { toast(M('dm_lock')); return null; } return LV.mgChat(v); }).then(c => { if (c) go('mgchat', { id: c.id, u: v }); }).catch(fail); return true;
      case 'mgdm_old': { LV.dmChat(v).then(c => { const key = 'D:' + v; NK.S.chats[key] = Object.assign(NK.S.chats[key] || { msgs: [] }, { live: true, cid: c.id, kind: 'dm', t: Date.now() }); save(); go('chat', { id: key, draft: '' }); }).catch(fail); return true; }
      case 'mgnew': createLive(v); return true;
      case 'mginvite': if (!(LV.profile || {}).invite_code) LV.fetchProfile(meId()).then(pr => { LV.profile = pr; inviteSheet(); }); else inviteSheet(); return true;
      case 'mgopen': go('mgchat', { id: v, u: el.dataset.u }); return true;
      case 'mgchatback': NK.back(); return true;
      case 'mgsendm': sendText(); return true;
      case 'mgphoto': sendPhoto(); return true;
      case 'mgbtap': msgSheet(v); return true;
      case 'mgrqx': if (openChat) delete REPLY[openChat.id]; render(); return true;
      case 'mglst': openLiveStory(+v); return true;
      case 'mgedit': editLive(); return true;
      case 'mgcover': pickImg(async d => { try { const url = await LV.upload(d, 'cover'); const pr = await LV.updateProfile({ cover_url: url }); NK.S.me = NK.meFrom(pr); save(); render(); } catch (e) { fail(e); } }); return true;
      case 'mgreport': LV.report(el.dataset.t || 'post', v).then(() => toast(t('reported'))).catch(fail); return true;
      case 'mgcsend': { const ta = document.getElementById('mgcin'); const tx = ta && ta.value.trim(); if (!tx) return true; LV.comment(v, tx, NK.lang).then(() => reload('mg:post:' + v)).catch(fail); return true; }
      case 'mgcdel': LV.deleteComment(v).then(() => reload('mg:post:' + el.dataset.p)).catch(fail); return true;
      case 'mgahide': LV.hidePost(v, el.dataset.h === '1').then(() => reload()).catch(fail); return true;
      case 'mgadel': if (confirm(FXM('act_delete') + '?')) LV.deletePost(v).then(() => { toast(FXM('act_delete') + ' ✓'); reload(); if (cur().v === 'mgpost') NK.back(); }).catch(fail); return true;
      case 'mgaflag': LV.setFlag(v, { [el.dataset.f]: el.dataset.x === '1' }).then(() => { toast(t('saved_ok')); reload('mg:pf:'); }).catch(fail); return true;
      case 'mgawarn': { const w = sheet(`<h3>${FXM('act_warn')}: ${esc(mname(v))}</h3><div class="field"><textarea id="wtx" rows="4" placeholder="${FXM('warn_ph')}"></textarea></div><button class="btn primary full mgbtn" id="wgo">${FXM('act_warn')}</button>`);
        w.querySelector('#wgo').onclick = () => { const tx = w.querySelector('#wtx').value.trim(); if (!tx) return; LV.warn(v, tx, NK.lang).then(() => { w.remove(); toast(FXM('warn_sent')); NK.liveSyncChats(true); }).catch(fail); }; return true; }
    }
    return prevAct(a, v, el);
  };
}
try { if (document.querySelector('#root .app')) render(); } catch (e) {}
})();
