// All site copy, EN and RU. Edit text here and run `node tools/build.mjs`.

export const SITE = {
  url: 'https://verghethorn.com',
  email: 'verghethorn@gmail.com',
  social: [
    { id: 'youtube', name: 'YouTube', handle: '@verghethorn', href: 'https://www.youtube.com/@verghethorn', color: '#FF0033' },
    { id: 'instagram', name: 'Instagram', handle: '@verghethorn', href: 'https://www.instagram.com/verghethorn', color: '#E1306C' },
    { id: 'tiktok', name: 'TikTok', handle: '@verghethorn_official', href: 'https://www.tiktok.com/@verghethorn_official', color: '#25F4EE' },
  ],
  inquiries: {
    endpoint: 'https://vgotvplikubsncujcxmk.supabase.co/rest/v1/inquiries',
    key: 'sb_publishable_N2ea44ITl-54nQS16gD0NQ_O_ywKAmd', // publishable: insert-only by row-level security
  },
};

export const LOOK_IDS = ['day', 'golden', 'anamorphic', 'night', 'film'];
export const AUDIENCE_IDS = ['genz', 'business', 'public', 'science', 'family'];

const en = {
  lang: 'en', locale: 'en_US', other: 'ru',
  title: 'VERGHÉTHORN — AI film studio: films, ads, websites and apps',
  desc: 'VERGHÉTHORN stages ideas like cinema: films, commercials, websites, apps and AI assistants — imagined like a scene and made with the newest AI.',
  skip: 'Skip to content', menu: 'Menu', close: 'Close', home: 'home',
  nav: [['film', 'Film'], ['web', 'Websites'], ['ads', 'Ads'], ['how', 'How we work'], ['contact', 'Contact']],
  sound: { on: 'Sound on', off: 'Sound off' },
  dock: { label: 'Camera', hint: 'Change how the whole site is filmed' },
  looks: { day: ['Daylight', 'Clean studio light'], golden: ['Golden hour', 'Low, warm sun'], anamorphic: ['Anamorphic', 'Widescreen, cool, flares'], night: ['Night', 'Tungsten lamps in the dark'], film: ['16 mm film', 'Grain and warmth'] },
  hero: {
    eyebrow: 'VERGHÉTHORN · AI film studio',
    h1: 'We stage ideas<br>like cinema.',
    sub: 'Films, ads, websites and apps — imagined like a scene, made with the newest AI.',
    cta: 'Discuss an idea', cta2: 'See how it works',
    hints: ['Drag the light', 'Tap a camera to look through it'],
    canvas: 'A 3D film set: a clay figure on a white stage, three cinema cameras on a dolly, a jib and a tripod, and a softbox key light you can move.',
    key: 'KEY', cams: { A: ['CAM A', '35 mm · dolly'], B: ['CAM B', '24 mm · jib'], C: ['CAM C', '85 mm · close-up'] },
    exit: 'Back to the set',
  },
  statement: 'Anyone can learn the tools. <em>What matters is imagination</em> — the story, the light, the frame and the feeling it leaves.',
  web: {
    eyebrow: 'Websites', h2: 'Sites that assemble<br>out of thin air.',
    sub: 'Every detail is designed — from the first pixel to the last click. Grab any piece and throw it.',
    stages: ['Idea', 'Structure', 'Design', 'Code', 'Launch'],
    canvas: 'Pieces of a website float in zero gravity and assemble into a finished page as you scroll.',
  },
  webSite: { brand: 'yourbrand', nav: ['Story', 'Work', 'Contact'], title: ['Hello,', 'future.'], cta1: 'Start', cta2: 'Learn', cards: ['Film', 'Web', 'App'] },
  ads: {
    eyebrow: 'Advertising', h2: 'One product.<br>Every audience.',
    sub: 'The same bottle tells five different stories. Choose an audience — then catch the glowing object and throw it.',
    audiences: { genz: 'Gen Z', business: 'Business', public: 'Politics', science: 'Science', family: 'Family' },
    tags: { genz: 'Too good to scroll past.', business: 'Clarity is the advantage.', public: 'One message. Every voice.', science: 'Curiosity, bottled.', family: 'Moments worth sharing.' },
    ad: 'AD', catch: 'Catch it', prev: 'Previous audience', next: 'Next audience',
    canvas: 'A commercial shot of a bottle called NOVA, restyled for the chosen audience, with a glowing object you can throw.',
  },
  ad: { labelLine: 'SPARKLING IDEA' },
  how: {
    eyebrow: 'How we work', h2: 'Take an idea apart.<br>Every piece works.',
    sub: 'Six layers — one clear path from the first thought to the premiere.',
    hint: 'Drag to turn it', dialLine: 'MADE WITH IMAGINATION',
    steps: [['Idea', 'It starts with one clear thought: what you want to say, and to whom.'], ['Form', 'We choose the form: a film, an ad, a website, an app — or all of them.'], ['Story', 'We write a story with a beginning, a rhythm and an ending people remember.'], ['Image', 'Light, colour, type, set and costume — everything the viewer feels.'], ['Technology', 'AI, 3D and code: the mechanism that sets it all in motion.'], ['Premiere', 'We release it into the world and make sure it runs flawlessly.']],
    canvas: 'A mechanical watch that separates into six layers, one for each step of the work.',
  },
  services: {
    eyebrow: 'What we make', h2: 'Everything a story<br>can become.',
    items: [['film', 'Films', 'Short films, brand films and music videos.'], ['ad', 'Advertising', 'Commercials for TV, web and social.'], ['app', 'Apps', 'Interfaces that feel obvious.'], ['web', 'Websites', 'Sites that people remember.'], ['ai', 'AI assistants', 'Voices and agents for your brand.'], ['anim', 'Animation', 'Characters, motion and 3D worlds.'], ['pod', 'Podcasts & interviews', 'A studio look without a studio.']],
  },
  contact: {
    eyebrow: 'Contact', h2: 'The doors are open.', sub: 'Pick a door — each one leads to us.',
    email: 'Email', emailNote: 'Write to us', copied: 'Address copied', open: 'Open',
    formTitle: 'Or tell us here', name: 'Name', mail: 'Email', what: 'What are you thinking about?', message: 'Your idea', messageHint: 'A few lines are enough.',
    kinds: [['film', 'Film'], ['campaign', 'Ad'], ['interactive', 'Website'], ['product', 'App'], ['ai', 'AI assistant'], ['other', 'Other']],
    send: 'Send', privacy: 'Used only to reply to you.',
  },
  footer: 'AI film studio · Films, ads, websites, apps.',
  js: {
    menu: 'Menu', close: 'Close',
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
  lang: 'ru', locale: 'ru_RU', other: 'en',
  title: 'VERGHÉTHORN — студия AI-кино: фильмы, реклама, сайты и приложения',
  desc: 'VERGHÉTHORN ставит идеи как кино: фильмы, реклама, сайты, приложения и AI-ассистенты — придуманы как сцена и сделаны на новейшем AI.',
  skip: 'Перейти к содержанию', menu: 'Меню', close: 'Закрыть', home: 'главная',
  nav: [['film', 'Кино'], ['web', 'Сайты'], ['ads', 'Реклама'], ['how', 'Как мы работаем'], ['contact', 'Контакт']],
  sound: { on: 'Звук включён', off: 'Звук выключен' },
  dock: { label: 'Камера', hint: 'Измените, как снят весь сайт' },
  looks: { day: ['Дневной свет', 'Чистый студийный свет'], golden: ['Золотой час', 'Низкое тёплое солнце'], anamorphic: ['Анаморфот', 'Широкий кадр, холод, блики'], night: ['Ночь', 'Лампы накаливания в темноте'], film: ['Плёнка 16 мм', 'Зерно и тепло'] },
  hero: {
    eyebrow: 'VERGHÉTHORN · студия AI-кино',
    h1: 'Мы ставим идеи<br>как кино.',
    sub: 'Фильмы, реклама, сайты и приложения — придуманы как сцена, сделаны на новейшем AI.',
    cta: 'Обсудить идею', cta2: 'Посмотреть, как это работает',
    hints: ['Двигайте свет', 'Нажмите на камеру — посмотрите её глазами'],
    canvas: '3D-съёмочная площадка: глиняная фигура на белой сцене, три кинокамеры — на тележке, кране и штативе — и софтбокс, который можно двигать.',
    key: 'СВЕТ', cams: { A: ['КАМ A', '35 мм · тележка'], B: ['КАМ B', '24 мм · кран'], C: ['КАМ C', '85 мм · крупный'] },
    exit: 'Вернуться на площадку',
  },
  statement: 'Инструментам может научиться каждый. <em>Решает фантазия</em> — сюжет, свет, кадр и чувство, которое остаётся после.',
  web: {
    eyebrow: 'Сайты', h2: 'Сайты, которые собираются<br>из воздуха.',
    sub: 'Каждая деталь продумана — от первого пикселя до последнего клика. Схватите любую деталь и бросьте.',
    stages: ['Идея', 'Структура', 'Дизайн', 'Код', 'Запуск'],
    canvas: 'Детали сайта парят в невесомости и при прокрутке собираются в готовую страницу.',
  },
  webSite: { brand: 'ваш бренд', nav: ['История', 'Проекты', 'Контакт'], title: ['Привет,', 'будущее.'], cta1: 'Начать', cta2: 'Узнать', cards: ['Кино', 'Сайт', 'Приложение'] },
  ads: {
    eyebrow: 'Реклама', h2: 'Один продукт.<br>Любая аудитория.',
    sub: 'Одна и та же бутылка рассказывает пять разных историй. Выберите аудиторию — и поймайте светящийся объект: его можно бросить куда угодно.',
    audiences: { genz: 'Зумеры', business: 'Бизнес', public: 'Политика', science: 'Наука', family: 'Семья' },
    tags: { genz: 'Слишком хорошо, чтобы листать дальше.', business: 'Ясность — ваше преимущество.', public: 'Одно послание. Каждый голос.', science: 'Любопытство в каждой капле.', family: 'Моменты, которыми хочется делиться.' },
    ad: 'РЕКЛАМА', catch: 'Поймайте', prev: 'Предыдущая аудитория', next: 'Следующая аудитория',
    canvas: 'Рекламный кадр бутылки NOVA, который меняет стиль под выбранную аудиторию, со светящимся объектом, который можно бросить.',
  },
  ad: { labelLine: 'ИГРИСТАЯ ИДЕЯ' },
  how: {
    eyebrow: 'Как мы работаем', h2: 'Разберите идею на детали.<br>Каждая работает.',
    sub: 'Шесть слоёв — один ясный путь от первой мысли до премьеры.',
    hint: 'Потяните, чтобы повернуть', dialLine: 'СДЕЛАНО С ФАНТАЗИЕЙ',
    steps: [['Идея', 'Всё начинается с одной ясной мысли: что вы хотите сказать и кому.'], ['Форма', 'Выбираем форму: фильм, реклама, сайт, приложение — или всё вместе.'], ['Сюжет', 'Пишем историю с началом, ритмом и финалом, который запоминают.'], ['Образ', 'Свет, цвет, шрифты, декорации и костюмы — всё, что чувствует зритель.'], ['Технологии', 'AI, 3D и код — механизм, который приводит всё в движение.'], ['Премьера', 'Выпускаем в мир и следим, чтобы всё работало безупречно.']],
    canvas: 'Механические часы, которые разделяются на шесть слоёв — по одному на каждый шаг работы.',
  },
  services: {
    eyebrow: 'Что мы создаём', h2: 'Всё, чем может стать<br>история.',
    items: [['film', 'Фильмы', 'Короткий метр, имиджевые фильмы и клипы.'], ['ad', 'Реклама', 'Ролики для ТВ, сайта и соцсетей.'], ['app', 'Приложения', 'Интерфейсы, понятные с первого касания.'], ['web', 'Сайты', 'Сайты, которые запоминают.'], ['ai', 'AI-ассистенты', 'Голоса и агенты для вашего бренда.'], ['anim', 'Анимация', 'Персонажи, движение и 3D-миры.'], ['pod', 'Подкасты и интервью', 'Студийная картинка без студии.']],
  },
  contact: {
    eyebrow: 'Контакт', h2: 'Двери открыты.', sub: 'Выберите дверь — каждая ведёт к нам.',
    email: 'Почта', emailNote: 'Напишите нам', copied: 'Адрес скопирован', open: 'Открыть',
    formTitle: 'Или расскажите здесь', name: 'Имя', mail: 'Email', what: 'О чём вы думаете?', message: 'Ваша идея', messageHint: 'Хватит нескольких строк.',
    kinds: [['film', 'Фильм'], ['campaign', 'Реклама'], ['interactive', 'Сайт'], ['product', 'Приложение'], ['ai', 'AI-ассистент'], ['other', 'Другое']],
    send: 'Отправить', privacy: 'Используем только для ответа вам.',
  },
  footer: 'Студия AI-кино · Фильмы, реклама, сайты, приложения.',
  js: {
    menu: 'Меню', close: 'Закрыть',
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
