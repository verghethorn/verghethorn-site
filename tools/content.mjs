// All site copy, EN and RU. Edit text here and run `node tools/build.mjs`.

export const SITE = {
  url: 'https://verghethorn.com',
  email: 'verghethorn@gmail.com',
  social: [
    { id: 'youtube', name: 'YouTube', handle: '@verghethorn', href: 'https://www.youtube.com/@verghethorn' },
    { id: 'instagram', name: 'Instagram', handle: '@verghethorn', href: 'https://www.instagram.com/verghethorn' },
    { id: 'tiktok', name: 'TikTok', handle: '@verghethorn_official', href: 'https://www.tiktok.com/@verghethorn_official' },
  ],
  inquiries: {
    endpoint: 'https://vgotvplikubsncujcxmk.supabase.co/rest/v1/inquiries',
    key: 'sb_publishable_N2ea44ITl-54nQS16gD0NQ_O_ywKAmd', // publishable: insert-only by row-level security
  },
};

// Photography (Unsplash licence). Keys match files in /media/v4/.
export const PHOTOS = {
  'hero-a': 'Jose P. Ortiz', 'hero-b': 'Daniel', 'hero-c': 'Jakob Owens',
  watch: 'Tareq Hasan', 'watch-in': 'KC Shum', engine: 'Yukon Haughton', 'engine-in': 'Adem Percem',
  turbine: 'Allan Rodrigues', 'turbine-in': 'Javier Vermaas', camera: 'Hunter Moranville', 'camera-in': 'Shane Aldendorff',
  sneaker: 'Seb Reivers', serum: 'Point Normal', kettle: 'Adiptalk',
  'aud-young': 'Deny Hill', 'aud-business': 'Rodrigo Rodrigues', 'aud-elders': 'Quan-You Zhang', 'aud-dreamers': 'Eleni Trapp',
  film: 'Adam Hornyak', 'step-idea': 'Balázs Kétyi', 'step-shoot': 'Jakob Owens', 'step-edit': 'Peter Stumpf', 'step-premiere': 'Zhyar Ibrahim',
};

// id, outside image, inside image, inside mode (x-ray of a real mechanism, or our blueprint drawing)
export const PRODUCTS = [
  ['watch', 'watch', 'watch-in', 'xray'],
  ['engine', 'engine', 'engine-in', 'xray'],
  ['turbine', 'turbine', 'turbine-in', 'xray'],
  ['sneaker', 'sneaker', 'sneaker-in', 'blue'],
  ['camera', 'camera', 'camera-in', 'xray'],
  ['serum', 'serum', 'serum-in', 'blue'],
  ['kettle', 'kettle', 'kettle-in', 'blue'],
];
export const AUDIENCES = ['young', 'business', 'elders', 'dreamers'];

const en = {
  lang: 'en', locale: 'en_US', other: 'ru', otherName: 'RU', otherLabel: 'Русская версия',
  title: 'VERGHÉTHORN — advertising films and product design for brands',
  desc: 'We shoot advertising films for brands, design products of any kind — from watches to kettles — and make our own films with brands inside the story.',
  skip: 'Skip to content',
  nav: [['design', 'Design'], ['ads', 'Ads'], ['films', 'Films'], ['how', 'How we work']],
  contactBtn: 'Contact',
  hero: {
    eyebrow: 'VERGHÉTHORN · film studio',
    h1: 'We shoot films<br>for brands.',
    sub: 'Commercials, product design and our own cinema — made to be watched to the end.',
    cta: 'Tell us your idea',
    cams: [['A', 'Wide', '35MM'], ['B', 'Dolly', '24MM'], ['C', 'Close-up', '85MM']],
    alts: ['A film crew shooting an actress in a red dress in a bright apartment', 'A crew in light beams laying a dolly track on a studio floor', 'A cinema camera on a tripod in a white studio'],
    group: 'Cameras on set',
  },
  statement: 'Films that sell. <em>Products people want to hold.</em> Stories with your brand inside.',
  design: {
    eyebrow: 'Product design', h2: 'We design anything.<br>Down to the last bolt.',
    sub: 'Watches, engines, kettles, sneakers, cosmetics, clothing. We design the product — then we film it.',
    show: 'See inside', hide: 'Outside', showBlue: 'See the drawing', hint: 'Swipe',
    items: {
      watch: ['Watch', 'Every gear, spring and jewel in its place.'],
      engine: ['Engine', 'Every belt, pulley and bolt — and how they move.'],
      turbine: ['Turbine', 'Every blade, balanced to the gram.'],
      sneaker: ['Sneakers', 'From the first line to the sole.'],
      camera: ['Camera', 'Taken apart, part by part.'],
      serum: ['Cosmetics', 'Bottle, dropper and label — all designed.'],
      kettle: ['Kettle', 'A shape you want to pick up.'],
    },
    alts: {
      watch: ['A steel watch with a white dial on a white table', 'The mechanical movement inside a watch: gears and springs'],
      engine: ['A car engine on a workshop stand', 'Inside an engine: timing belt, pulleys and gears'],
      turbine: ['A jet engine under an airliner wing', 'The core of a jet engine: rows of turbine blades'],
      sneaker: ['A black running shoe with a neon sole held by a hand', 'A blueprint drawing of the same shoe'],
      camera: ['A cinema camera on a tripod', 'A camera taken apart, every part laid out on white'],
      serum: ['An amber serum bottle with a dropper on peach', 'A blueprint drawing of the bottle and dropper'],
      kettle: ['A black pour-over kettle on a table', 'A blueprint drawing of the kettle'],
    },
  },
  ads: {
    eyebrow: 'Advertising', h2: 'One product.<br>Every audience.',
    sub: 'We film the same product as a different story for every audience that matters to you.',
    ad: 'AD', product: 'NOVA', productLine: 'Face serum',
    audiences: {
      young: ['Young', 'Glow loud.'],
      business: ['Business', 'Ten seconds. Ready for anything.'],
      elders: ['Grandparents', 'For every story you still tell.'],
      dreamers: ['Dreamers', 'Made for golden hour.'],
    },
    alts: { young: 'Two young women with skateboards at sunset', business: 'A confident woman in a black suit on a city street', elders: 'Three older friends laughing at a yellow table in a garden', dreamers: 'A woman dancing in a field at sunset' },
    serumAlt: 'NOVA serum bottle',
  },
  films: {
    eyebrow: 'Our films & collaborations', h2: 'Our own films.<br>Your brand, inside the story.',
    sub: 'We make our own films and collaborations. A brand appears the way it does in life — naturally, never in the way.',
    subs: ['— Where are we going?', '— Somewhere worth filming.'],
    alt: 'A woman in a meadow looks at snowy mountains at dusk',
    cta: 'Propose a collaboration',
  },
  how: {
    eyebrow: 'How we work', h2: 'From idea to premiere.',
    steps: [
      ['idea', 'Idea', 'One clear thought: what to say, and to whom.', 'A designer sketching on a tablet'],
      ['shoot', 'Shoot', 'Real light, real people, the right camera.', 'A camera operator with a stabilised rig on set'],
      ['edit', 'Edit', 'Rhythm, colour and sound until it feels right.', 'A video being edited on a laptop'],
      ['premiere', 'Premiere', 'Released where your audience already looks.', 'An audience watching a big screen in the dark'],
    ],
  },
  also: {
    eyebrow: 'Also, on request', h2: 'Websites, apps and AI agents.',
    sub: 'Built with the same care as a film.',
    items: [['web', 'Websites', 'Pages that feel like a scene.'], ['app', 'Apps', 'Clear from the first touch.'], ['ai', 'AI agents', 'A voice for your brand, awake around the clock.']],
    chat: ['Hi! Can you film our new kettle?', 'Of course. Tell me about it'],
  },
  contact: {
    eyebrow: 'Contact', h2: 'The doors are open.', sub: 'Every door leads to us.',
    notes: { email: 'Write to us', youtube: 'Watch', instagram: 'Follow', tiktok: 'Short films' },
    emailName: 'Email',
    formTitle: 'Or tell us here', name: 'Name', mail: 'Email', what: 'What is it about?', message: 'Your idea', messageHint: 'A few lines are enough.',
    kinds: [['film', 'Ad film'], ['product', 'Product design'], ['collaboration', 'Collaboration'], ['interactive', 'Website or app'], ['ai', 'AI agent'], ['other', 'Other']],
    send: 'Send', privacy: 'Used only to reply to you.',
  },
  footer: 'Advertising films · Product design · Our own cinema',
  photos: 'Photography via Unsplash',
  js: {
    form: {
      sending: 'Sending…', errName: 'Add your name so we know who to answer.', errEmail: 'Check the email — it needs an @ and a domain.',
      errMessage: 'A few more words, please — at least 10 characters.',
      okTitle: 'Thank you — the door is open.', okText: 'We read every message personally and will reply to {email}.',
      errTitle: 'The message wasn’t sent.', errNet: 'Your text is still here. Try again in a moment, or write to verghethorn@gmail.com.',
      errBot: 'This looked automated. Wait a few seconds and send again.',
    },
  },
  notFound: { title: 'Page not found — VERGHÉTHORN', h1: 'Cut. Wrong scene.', text: 'This page doesn’t exist.', home: 'Back to the set' },
  moved: 'This page has moved.',
};

const ru = {
  lang: 'ru', locale: 'ru_RU', other: 'en', otherName: 'EN', otherLabel: 'English version',
  title: 'VERGHÉTHORN — рекламное кино и дизайн продуктов для брендов',
  desc: 'Снимаем рекламное кино для брендов, проектируем любые продукты — от часов до чайников — и снимаем собственные фильмы, где бренд живёт внутри истории.',
  skip: 'Перейти к содержанию',
  nav: [['design', 'Дизайн'], ['ads', 'Реклама'], ['films', 'Фильмы'], ['how', 'Как работаем']],
  contactBtn: 'Связаться',
  hero: {
    eyebrow: 'VERGHÉTHORN · киностудия',
    h1: 'Снимаем кино<br>для брендов.',
    sub: 'Реклама, дизайн продуктов и собственное кино — такое, что досматривают до конца.',
    cta: 'Рассказать идею',
    cams: [['A', 'Общий', '35ММ'], ['B', 'Тележка', '24ММ'], ['C', 'Крупный', '85ММ']],
    alts: ['Съёмочная группа снимает актрису в красном в светлой квартире', 'Группа в лучах света прокладывает рельсы для тележки', 'Кинокамера на штативе в белой студии'],
    group: 'Камеры на площадке',
  },
  statement: 'Кино, которое продаёт. <em>Вещи, которые хочется взять в руки.</em> Истории, где ваш бренд — внутри.',
  design: {
    eyebrow: 'Дизайн продуктов', h2: 'Проектируем что угодно.<br>До последнего болтика.',
    sub: 'Часы, двигатели, чайники, кроссовки, косметика, одежда. Создаём продукт — и снимаем его.',
    show: 'Заглянуть внутрь', hide: 'Снаружи', showBlue: 'Показать чертёж', hint: 'Листайте',
    items: {
      watch: ['Часы', 'Каждая шестерёнка, пружина и камень на своём месте.'],
      engine: ['Двигатель', 'Каждый ремень, шкив и болт — и как они движутся.'],
      turbine: ['Турбина', 'Каждая лопатка выверена до грамма.'],
      sneaker: ['Кроссовки', 'От первой линии до подошвы.'],
      camera: ['Камера', 'Разобрана до последней детали.'],
      serum: ['Косметика', 'Флакон, пипетка и этикетка — всё продумано.'],
      kettle: ['Чайник', 'Форма, которую хочется взять в руки.'],
    },
    alts: {
      watch: ['Стальные часы с белым циферблатом на белом столе', 'Механизм часов изнутри: шестерёнки и пружины'],
      engine: ['Автомобильный двигатель на стенде в мастерской', 'Двигатель изнутри: ремень ГРМ, шкивы и шестерни'],
      turbine: ['Реактивный двигатель под крылом самолёта', 'Сердце двигателя: ряды лопаток турбины'],
      sneaker: ['Чёрный кроссовок с неоновой подошвой в руке', 'Чертёж того же кроссовка'],
      camera: ['Кинокамера на штативе', 'Разобранная камера: все детали разложены на белом'],
      serum: ['Янтарный флакон сыворотки с пипеткой на персиковом фоне', 'Чертёж флакона и пипетки'],
      kettle: ['Чёрный чайник для пуровера на столе', 'Чертёж чайника'],
    },
  },
  ads: {
    eyebrow: 'Реклама', h2: 'Один продукт.<br>Любая аудитория.',
    sub: 'Снимаем один и тот же продукт как разные истории — для каждой аудитории, которая вам важна.',
    ad: 'РЕКЛАМА', product: 'NOVA', productLine: 'Сыворотка для лица',
    audiences: {
      young: ['Молодёжь', 'Сияй громко.'],
      business: ['Бизнес', 'Десять секунд — и готова ко всему.'],
      elders: ['Бабушки и дедушки', 'Для всех историй, которые вы ещё расскажете.'],
      dreamers: ['Мечтатели', 'Создано для золотого часа.'],
    },
    alts: { young: 'Две девушки со скейтбордами на закате', business: 'Уверенная женщина в чёрном костюме на улице города', elders: 'Трое пожилых друзей смеются за жёлтым столом в саду', dreamers: 'Девушка танцует в поле на закате' },
    serumAlt: 'Флакон сыворотки NOVA',
  },
  films: {
    eyebrow: 'Наши фильмы и коллаборации', h2: 'Собственное кино.<br>Ваш бренд — внутри истории.',
    sub: 'Снимаем свои фильмы и коллаборации. Бренд появляется так, как в жизни, — естественно и никогда не мешает.',
    subs: ['— Куда мы идём?', '— Туда, где стоит снимать.'],
    alt: 'Девушка на лугу смотрит на снежные горы в сумерках',
    cta: 'Предложить коллаборацию',
  },
  how: {
    eyebrow: 'Как мы работаем', h2: 'От идеи до премьеры.',
    steps: [
      ['idea', 'Идея', 'Одна ясная мысль: что сказать и кому.', 'Дизайнер рисует эскиз на планшете'],
      ['shoot', 'Съёмка', 'Настоящий свет, живые люди, правильная камера.', 'Оператор со стабилизатором на площадке'],
      ['edit', 'Монтаж', 'Ритм, цвет и звук — пока не станет точно.', 'Монтаж видео на ноутбуке'],
      ['premiere', 'Премьера', 'Выпускаем туда, куда уже смотрит ваша аудитория.', 'Зрители смотрят на большой экран в темноте'],
    ],
  },
  also: {
    eyebrow: 'По запросу', h2: 'Сайты, приложения и AI-агенты.',
    sub: 'С той же заботой, что и кино.',
    items: [['web', 'Сайты', 'Страницы, похожие на сцену из фильма.'], ['app', 'Приложения', 'Понятны с первого касания.'], ['ai', 'AI-агенты', 'Голос вашего бренда, который не спит.']],
    chat: ['Привет! Снимете наш новый чайник?', 'Конечно. Расскажите о нём'],
  },
  contact: {
    eyebrow: 'Контакт', h2: 'Двери открыты.', sub: 'Каждая дверь ведёт к нам.',
    notes: { email: 'Написать нам', youtube: 'Смотреть', instagram: 'Подписаться', tiktok: 'Короткие видео' },
    emailName: 'Почта',
    formTitle: 'Или расскажите здесь', name: 'Имя', mail: 'Email', what: 'О чём речь?', message: 'Ваша идея', messageHint: 'Хватит нескольких строк.',
    kinds: [['film', 'Рекламный фильм'], ['product', 'Дизайн продукта'], ['collaboration', 'Коллаборация'], ['interactive', 'Сайт или приложение'], ['ai', 'AI-агент'], ['other', 'Другое']],
    send: 'Отправить', privacy: 'Используем только для ответа вам.',
  },
  footer: 'Рекламное кино · Дизайн продуктов · Собственные фильмы',
  photos: 'Фотографии: Unsplash',
  js: {
    form: {
      sending: 'Отправка…', errName: 'Укажите имя, чтобы мы знали, кому ответить.', errEmail: 'Проверьте email — нужен символ @ и домен.',
      errMessage: 'Пожалуйста, чуть подробнее — хотя бы 10 символов.',
      okTitle: 'Спасибо — дверь открыта.', okText: 'Мы лично читаем каждое сообщение и ответим на {email}.',
      errTitle: 'Сообщение не отправлено.', errNet: 'Текст остался здесь. Попробуйте ещё раз через минуту или напишите на verghethorn@gmail.com.',
      errBot: 'Похоже на автоматическую отправку. Подождите несколько секунд и отправьте снова.',
    },
  },
  notFound: { title: 'Страница не найдена — VERGHÉTHORN', h1: 'Стоп. Не та сцена.', text: 'Такой страницы нет.', home: 'Вернуться на площадку' },
  moved: 'Страница переехала.',
};

export const LANGS = { en, ru };
