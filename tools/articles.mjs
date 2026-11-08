// Articles for search engines (EN + RU). Reached only from the small "Articles" link in the footer.
// Each article: slug, date, img (poster from /media/v or a full path), en / ru: { title, desc, body (HTML) }, cta page.

export const ARTICLES_UI = {
  en: { h1: 'Articles', sub: 'Notes on commercials, films and AI production from the VERGHÉTHORN studio.', read: 'Read', min: 'min read', more: 'More articles', cta: { h: 'Have a project in mind?', p: 'Tell us about it — the director replies personally.', a: 'Start a project', b: 'See the service' }, title: 'Articles — commercials, cinematic advertising and AI video | VERGHÉTHORN', desc: 'Articles about brand commercials, cinematic advertising, product videos, fashion campaigns, hotel videos and AI agents — from the VERGHÉTHORN studio.' },
  ru: { h1: 'Статьи', sub: 'Заметки студии VERGHÉTHORN о рекламе, кино и производстве с AI.', read: 'Читать', min: 'мин чтения', more: 'Другие статьи', cta: { h: 'Есть идея проекта?', p: 'Расскажите о ней — режиссёр ответит лично.', a: 'Начать проект', b: 'Смотреть услугу' }, title: 'Статьи — реклама для брендов, кинематографичная реклама и AI-видео | VERGHÉTHORN', desc: 'Статьи о рекламе для брендов, кинематографичной рекламе, видео о продукте, fashion-кампаниях, видео для отелей и AI-агентах — от студии VERGHÉTHORN.' },
};

export const ARTICLES = [
{
  slug: 'brand-commercial-production', date: '2026-11-08', img: 's-ads', page: 'commercials',
  en: { title: 'How a brand commercial is made: from brief to final cut', desc: 'A clear guide to commercial production for brands: brief, concept, storyboard, production, edit, sound and colour — classic and AI-powered.',
    body: `<p>A brand commercial looks simple on screen: thirty seconds, a few shots, a logo at the end. Behind it is a production process that decides whether people remember the brand or scroll past. Here is how a commercial is made, step by step — and what changes when the footage is created with AI.</p>
<h2>1. The brief</h2>
<p>Everything starts with a short, honest brief: what the brand sells, who the audience is, what the commercial must achieve and where it will run — TV, YouTube, Instagram Reels, TikTok or a website. One clear goal is better than five. “Make people want to try our coffee at home” is a brief; “show everything about our company” is not.</p>
<h2>2. Concept and script</h2>
<p>The concept is the idea that carries the commercial: a situation, a feeling or a small story. The script turns it into scenes, lines and timing. Good commercials usually have one idea, one emotion and one clear moment for the product.</p>
<h2>3. Storyboard and style frames</h2>
<p>A storyboard shows each shot in order. Style frames show the look: light, colour, camera, mood. This is where the client sees the commercial before it exists — and where changes are cheap.</p>
<h2>4. Production</h2>
<p>In classic commercial production this is the shoot: locations, crew, cast, equipment, permits and the weather. With AI video production, the footage is generated instead: every shot is created, reviewed and regenerated until it matches the storyboard. The director’s job does not disappear — it moves from managing a set to directing every frame.</p>
<h2>5. Edit, sound and colour</h2>
<p>The edit gives the commercial its rhythm. Then come voice-over, music, sound design and colour grading. Sound is half of the impression: the same picture feels cheap or premium depending on what you hear.</p>
<h2>6. Versions for every screen</h2>
<p>A modern campaign needs several cuts: horizontal 16:9 for TV and YouTube, vertical 9:16 for Reels and TikTok, square 1:1 for feeds, plus short 6–15 second versions. Planning them from the start saves time later.</p>
<h2>Classic shoot or AI?</h2>
<p>A classic shoot is right when you need real people performing or a specific real location. AI production is strong when you need worlds that are hard to film — space, history, extreme landscapes, impossible camera moves — or when the product must look perfect without a studio day. Many projects combine both.</p>
<p>At VERGHÉTHORN we produce brand commercials and cinematic advertising with AI and direct them like cinema — from the first idea to every format.</p>` },
  ru: { title: 'Как создаётся рекламный ролик для бренда: от брифа до финального монтажа', desc: 'Понятный разбор производства рекламы для брендов: бриф, концепция, раскадровка, производство, монтаж, звук и цвет — классическая съёмка и AI.',
    body: `<p>На экране рекламный ролик выглядит просто: тридцать секунд, несколько кадров, логотип в конце. За ним стоит процесс производства, от которого зависит, запомнят бренд или пролистают. Разбираем по шагам, как создаётся реклама для бренда — и что меняется, когда изображение создаётся с помощью AI.</p>
<h2>1. Бриф</h2>
<p>Всё начинается с короткого и честного брифа: что продаёт бренд, кто аудитория, какую задачу должен решить ролик и где он будет показан — ТВ, YouTube, Reels, TikTok или сайт. Одна ясная цель лучше пяти. «Сделать так, чтобы захотелось попробовать наш кофе дома» — это бриф. «Показать всё о нашей компании» — нет.</p>
<h2>2. Концепция и сценарий</h2>
<p>Концепция — это идея, на которой держится ролик: ситуация, чувство или маленькая история. Сценарий превращает её в сцены, реплики и хронометраж. У хорошей рекламы обычно одна идея, одна эмоция и один ясный момент для продукта.</p>
<h2>3. Раскадровка и кадры стиля</h2>
<p>Раскадровка показывает каждый кадр по порядку. Кадры стиля показывают облик: свет, цвет, камеру, настроение. На этом этапе заказчик видит ролик до того, как он создан, — и правки здесь обходятся дешевле всего.</p>
<h2>4. Производство</h2>
<p>В классическом видеопродакшне это съёмка: локации, группа, актёры, техника, разрешения и погода. В AI-производстве изображение генерируется: каждый кадр создаётся, проверяется и пересоздаётся, пока не совпадёт с раскадровкой. Работа режиссёра не исчезает — она переходит от управления площадкой к режиссуре каждого кадра.</p>
<h2>5. Монтаж, звук и цвет</h2>
<p>Монтаж задаёт ритм. Затем — дикторский текст, музыка, звуковой дизайн и цветокоррекция. Звук — половина впечатления: одна и та же картинка выглядит дёшево или дорого в зависимости от того, что вы слышите.</p>
<h2>6. Версии для каждого экрана</h2>
<p>Современной кампании нужно несколько версий: горизонтальная 16:9 для ТВ и YouTube, вертикальная 9:16 для Reels и TikTok, квадратная 1:1 для ленты, плюс короткие версии на 6–15 секунд. Если планировать их с самого начала, это экономит время.</p>
<h2>Классическая съёмка или AI?</h2>
<p>Классическая съёмка нужна, когда в кадре должны играть реальные люди или нужна конкретная реальная локация. AI-производство сильно там, где нужны миры, которые сложно снять, — космос, история, экстремальные пейзажи, невозможные движения камеры, — или когда продукт должен выглядеть идеально без студийного дня. Многие проекты сочетают оба подхода.</p>
<p>В VERGHÉTHORN мы производим рекламу для брендов и кинематографичные ролики с AI и режиссируем их как кино — от первой идеи до всех форматов.</p>` },
},
{
  slug: 'cinematic-advertising', date: '2026-11-08', img: 'c-fire', page: 'commercials',
  en: { title: 'Cinematic advertising: why the best ads feel like films', desc: 'What makes a commercial cinematic — story, light, sound, pacing and restraint — and how brands use cinematic advertising to be remembered.',
    body: `<p>Most advertising is forgotten within seconds. The commercials people remember often have something in common: they feel like a scene from a film. That is cinematic advertising — and it is less about budget than about decisions.</p>
<h2>A story, not a list</h2>
<p>A cinematic commercial tells one small story instead of listing product features. A grandfather teaching his grandson to make coffee says more about a coffee brand than ten seconds of text on screen. The product appears where it belongs in the story.</p>
<h2>Light and colour with intention</h2>
<p>Cinema uses light to guide the eye and set the mood: golden hour for warmth, cool blue for calm, hard contrast for tension. A consistent colour grade makes every shot feel like part of one world — and can carry the brand’s own palette.</p>
<h2>The camera has a point of view</h2>
<p>Slow push-ins, wide establishing shots, close-ups on hands and details — the camera tells the viewer what matters. Fewer, better shots usually feel more premium than fast cuts of everything.</p>
<h2>Sound does half the work</h2>
<p>Quiet sound design — fabric, footsteps, a cup on a table — makes an image feel real. Music sets the emotional arc. Silence, used well, is one of the most powerful tools in advertising.</p>
<h2>Restraint</h2>
<p>Premium brands rarely say everything. They leave space: a pause, an empty frame, a single line. Restraint signals confidence.</p>
<h2>Cinematic, at any budget</h2>
<p>Cinematic advertising used to require large crews and long shoots. With AI production, locations, light and camera moves are designed rather than found, so smaller brands can reach a film-like look too. What still matters most is direction: a clear idea, taste and care in every frame.</p>
<p>VERGHÉTHORN creates cinematic commercials and brand films for companies that want to be remembered.</p>` },
  ru: { title: 'Кинематографичная реклама: почему лучшие ролики похожи на кино', desc: 'Что делает рекламу кинематографичной — история, свет, звук, ритм и сдержанность — и как бренды используют кинорекламу, чтобы их запоминали.',
    body: `<p>Большую часть рекламы забывают через несколько секунд. У роликов, которые помнят, часто есть общее: они ощущаются как сцена из фильма. Это и есть кинематографичная реклама — и дело в ней не столько в бюджете, сколько в решениях.</p>
<h2>История, а не список</h2>
<p>Кинематографичный ролик рассказывает одну маленькую историю вместо перечисления характеристик. Дедушка, который учит внука варить кофе, говорит о кофейном бренде больше, чем десять секунд текста на экране. Продукт появляется там, где ему место в истории.</p>
<h2>Свет и цвет с намерением</h2>
<p>Кино использует свет, чтобы вести взгляд и задавать настроение: золотой час — тепло, холодный синий — спокойствие, жёсткий контраст — напряжение. Единая цветокоррекция делает каждый кадр частью одного мира и может нести палитру бренда.</p>
<h2>У камеры есть точка зрения</h2>
<p>Медленные наезды, широкие общие планы, крупные планы рук и деталей — камера показывает зрителю, что важно. Меньше кадров, но лучше, обычно выглядит дороже, чем быстрая нарезка всего подряд.</p>
<h2>Звук делает половину работы</h2>
<p>Тихий звуковой дизайн — ткань, шаги, чашка на столе — делает изображение настоящим. Музыка задаёт эмоциональную дугу. Тишина, использованная к месту, — один из самых сильных инструментов рекламы.</p>
<h2>Сдержанность</h2>
<p>Премиальные бренды редко говорят всё. Они оставляют пространство: паузу, пустой кадр, одну фразу. Сдержанность — это знак уверенности.</p>
<h2>Кинематографично — при любом бюджете</h2>
<p>Раньше кинематографичная реклама требовала большой группы и долгих съёмок. С AI-производством локации, свет и движения камеры проектируются, а не ищутся, поэтому кинематографичный облик доступен и небольшим брендам. Главным по-прежнему остаётся режиссура: ясная идея, вкус и внимание к каждому кадру.</p>
<p>VERGHÉTHORN создаёт кинематографичную рекламу и имиджевые фильмы для брендов, которые хотят, чтобы их запомнили.</p>` },
},
{
  slug: 'ai-video-production', date: '2026-11-08', img: 'c-forest', page: 'films',
  en: { title: 'AI video production for brands: what it is and how it works', desc: 'AI video production explained for brands: how AI-generated commercials and films are made, what a director still does, and what to prepare.',
    body: `<p>“AI video” often sounds like pressing a button and getting a commercial. Real AI video production for brands is closer to filmmaking than to magic: a director, a script and many decisions — with AI generating the footage instead of a camera.</p>
<h2>What AI does — and what it does not</h2>
<p>AI models can generate shots from descriptions and reference images: landscapes, interiors, products, camera moves, light. They do not decide what the story is, which shot is right, how scenes connect or what the brand should feel like. That is direction, and it is still human work.</p>
<h2>The process</h2>
<ul><li><b>Idea and script</b> — the same as in any film or commercial.</li><li><b>Look development</b> — style frames, characters and locations are designed and kept consistent across shots.</li><li><b>Generation</b> — each shot is generated, reviewed and regenerated until it serves the scene.</li><li><b>Post-production</b> — edit, voice, music, sound design and colour grading turn shots into a film.</li></ul>
<h2>Where AI production is strongest</h2>
<p>Worlds that are expensive or impossible to film: space, deep history, remote nature, fantasy. Perfect product shots without a studio day. Many versions of the same commercial for different markets and formats.</p>
<h2>Where to be careful</h2>
<p>Real people, real locations and exact brand assets need care: references, approvals and, where needed, real footage combined with generated shots. A responsible studio is open about what is generated and respects rights and likeness.</p>
<h2>What a brand should prepare</h2>
<p>A short brief, the audience, where the video will run, brand guidelines (logo, colours, fonts) and any product photos or 3D files. One sentence of the idea is enough to start; the rest is shaped together.</p>
<p>VERGHÉTHORN is an AI video production studio: films and commercials, created with AI and directed like cinema.</p>` },
  ru: { title: 'AI-видеопродакшн для брендов: что это и как это работает', desc: 'Что такое AI-видеопродакшн для брендов: как создаются AI-реклама и фильмы, что делает режиссёр и что подготовить заказчику.',
    body: `<p>«AI-видео» часто звучит как нажатие кнопки, после которого появляется реклама. Настоящий AI-видеопродакшн для брендов ближе к кинопроизводству, чем к магии: режиссёр, сценарий и множество решений — только изображение создаёт AI, а не камера.</p>
<h2>Что делает AI — и чего не делает</h2>
<p>AI-модели генерируют кадры по описаниям и референсам: пейзажи, интерьеры, продукты, движения камеры, свет. Но они не решают, о чём история, какой кадр верный, как связаны сцены и каким должен ощущаться бренд. Это режиссура, и это по-прежнему работа человека.</p>
<h2>Процесс</h2>
<ul><li><b>Идея и сценарий</b> — как в любом фильме или рекламе.</li><li><b>Разработка облика</b> — кадры стиля, персонажи и локации проектируются и остаются едиными от кадра к кадру.</li><li><b>Генерация</b> — каждый кадр создаётся, проверяется и пересоздаётся, пока не начнёт работать на сцену.</li><li><b>Постпродакшн</b> — монтаж, голос, музыка, звук и цветокоррекция превращают кадры в фильм.</li></ul>
<h2>Где AI-производство сильнее всего</h2>
<p>Миры, которые дорого или невозможно снять: космос, далёкая история, труднодоступная природа, фантастика. Идеальные кадры продукта без студийного дня. Много версий одного ролика для разных рынков и форматов.</p>
<h2>Где нужна осторожность</h2>
<p>Реальные люди, реальные места и точные элементы бренда требуют внимания: референсы, согласования и, где нужно, сочетание настоящей съёмки с генерацией. Ответственная студия открыто говорит, что создано AI, и уважает права и образ людей.</p>
<h2>Что подготовить бренду</h2>
<p>Короткий бриф, аудиторию, площадки показа, брендбук (логотип, цвета, шрифты) и фото продукта или 3D-файлы, если они есть. Чтобы начать, достаточно одной фразы с идеей — остальное сформулируем вместе.</p>
<p>VERGHÉTHORN — студия AI-видеопродакшна: фильмы и реклама, созданные с AI и снятые как кино.</p>` },
},
{
  slug: 'product-video-3d', date: '2026-11-08', img: 'p-pottery', page: 'design',
  en: { title: 'Product video and 3D visualisation: show a product before it exists', desc: 'How product videos, 3D renders and launch films help brands present a new product — for pre-orders, investors, marketplaces and social media.',
    body: `<p>A new product often needs to be shown before it can be photographed: for pre-orders, investors, a marketplace listing or a launch campaign. Product video and 3D visualisation make that possible.</p>
<h2>3D model and renders</h2>
<p>A 3D model is a digital version of the product. From it come photoreal renders: the product from every angle, in every colour and material, on any background. Renders are ideal for websites, catalogues and presentations — and they can be updated when the design changes.</p>
<h2>Product video</h2>
<p>A product video shows how the product moves, opens, pours or shines. Macro shots, slow motion and perfect light make details feel tangible. Short loops work well on product pages; 15–30 second cuts work in social ads.</p>
<h2>Launch film</h2>
<p>A launch film puts the product into a story: who uses it, where and why. It is the bridge between design and advertising — the first time the world sees the product as part of life.</p>
<h2>Why design and video belong together</h2>
<p>When the same team designs a product and creates its video, the visual language stays consistent: materials, colours and details are shown the way they were intended. It also saves time — the 3D model created for design becomes the base for the video.</p>
<h2>What to prepare</h2>
<p>Sketches or photos of a prototype, dimensions, materials and colours, and the places where the video will be used. Even an idea on paper is enough to begin.</p>
<p>VERGHÉTHORN designs products and creates product videos and launch films — from the first sketch to the camera.</p>` },
  ru: { title: 'Видео о продукте и 3D-визуализация: как показать продукт до его выпуска', desc: 'Как видео о продукте, 3D-рендеры и фильмы к запуску помогают показать новый продукт — для предзаказов, инвесторов, маркетплейсов и соцсетей.',
    body: `<p>Новый продукт часто нужно показать раньше, чем его можно сфотографировать: для предзаказа, инвесторов, карточки на маркетплейсе или кампании к запуску. Видео о продукте и 3D-визуализация делают это возможным.</p>
<h2>3D-модель и рендеры</h2>
<p>3D-модель — это цифровая копия продукта. Из неё получаются фотореалистичные рендеры: продукт со всех сторон, в любом цвете и материале, на любом фоне. Рендеры идеальны для сайта, каталога и презентаций, и их легко обновить, если дизайн изменится.</p>
<h2>Видео о продукте</h2>
<p>Видео о продукте показывает, как он двигается, открывается, наливается или блестит. Макросъёмка, замедление и идеальный свет делают детали осязаемыми. Короткие зацикленные видео хорошо работают в карточках товара, версии на 15–30 секунд — в рекламе в соцсетях.</p>
<h2>Фильм к запуску</h2>
<p>Фильм к запуску помещает продукт в историю: кто им пользуется, где и зачем. Это мост между дизайном и рекламой — первый раз, когда мир видит продукт как часть жизни.</p>
<h2>Почему дизайн и видео лучше делать вместе</h2>
<p>Когда одна команда проектирует продукт и создаёт его видео, визуальный язык остаётся единым: материалы, цвета и детали показаны так, как задумывались. Это экономит и время — 3D-модель из дизайна становится основой для видео.</p>
<h2>Что подготовить</h2>
<p>Эскизы или фото прототипа, размеры, материалы и цвета, а также площадки, где будет использоваться видео. Чтобы начать, достаточно даже идеи на бумаге.</p>
<p>VERGHÉTHORN проектирует продукты и создаёт видео о продукте и фильмы к запуску — от первого эскиза до камеры.</p>` },
},
{
  slug: 'ai-agent-for-business', date: '2026-11-08', img: '/media/agent-call.webp', page: 'agents',
  en: { title: 'AI agents for business: a website assistant that talks like a person', desc: 'What an AI agent for business is, how it differs from a chatbot, where it works — website, voice, messengers — and how to set clear rules.',
    body: `<p>Clients ask questions at any hour: what you offer, how to start, whether you can help. An AI agent answers them immediately — in chat, by voice or on video — and hands over to you when a person is needed.</p>
<h2>AI agent vs. chatbot</h2>
<p>A classic chatbot follows a menu of buttons and fixed answers. An AI agent understands free questions, keeps the context of the conversation and replies naturally. It can switch to the client’s language and speak with a real-sounding voice.</p>
<h2>Where an AI agent works</h2>
<ul><li><b>Website</b> — a chat or voice assistant on your pages.</li><li><b>Messengers</b> — depending on the project and the platform.</li><li><b>Phone</b> — a voice agent that answers calls.</li></ul>
<h2>Clear rules matter most</h2>
<p>A good agent knows what it may say and what it must not. For example: it never discusses prices and sends those questions to your email; it does not promise deadlines; it invites the client to contact a person when the question is complex. These rules protect your brand.</p>
<h2>Character and voice</h2>
<p>An agent is part of your brand experience, so its manner matters: calm or energetic, formal or friendly. A designed character — a look, a voice, a name — turns a support tool into something people remember.</p>
<h2>How to start</h2>
<p>Write down what clients ask most often, what the agent should always say, and what it should never say. That is enough for a first version; real conversations then show what to improve.</p>
<p>VERGHÉTHORN builds AI agents for brands — you can talk to ours on the home page.</p>` },
  ru: { title: 'AI-агент для бизнеса: ассистент на сайте, который говорит как человек', desc: 'Что такое AI-агент для бизнеса, чем он отличается от чат-бота, где работает — сайт, голос, мессенджеры — и как задать понятные правила.',
    body: `<p>Клиенты задают вопросы в любое время: что вы предлагаете, как начать, сможете ли помочь. AI-агент отвечает сразу — в чате, голосом или по видео — и передаёт разговор вам, когда нужен человек.</p>
<h2>AI-агент и чат-бот</h2>
<p>Классический чат-бот работает по меню кнопок и готовым ответам. AI-агент понимает свободные вопросы, помнит контекст разговора и отвечает естественно. Он может перейти на язык клиента и говорить голосом, похожим на живой.</p>
<h2>Где работает AI-агент</h2>
<ul><li><b>Сайт</b> — чат или голосовой ассистент на ваших страницах.</li><li><b>Мессенджеры</b> — в зависимости от проекта и платформы.</li><li><b>Телефон</b> — голосовой агент, который отвечает на звонки.</li></ul>
<h2>Главное — понятные правила</h2>
<p>Хороший агент знает, что ему можно говорить, а что нельзя. Например: никогда не обсуждает цены и направляет такие вопросы на вашу почту; не обещает сроки; предлагает связаться с человеком, если вопрос сложный. Эти правила защищают ваш бренд.</p>
<h2>Характер и голос</h2>
<p>Агент — часть впечатления от бренда, поэтому важна его манера: спокойная или энергичная, официальная или дружелюбная. Продуманный персонаж — облик, голос, имя — превращает инструмент поддержки в то, что запоминают.</p>
<h2>С чего начать</h2>
<p>Запишите, о чём клиенты спрашивают чаще всего, что агент должен говорить всегда и чего не должен говорить никогда. Этого достаточно для первой версии, а реальные разговоры покажут, что улучшить.</p>
<p>VERGHÉTHORN создаёт AI-агентов для брендов — с нашим можно поговорить на главной странице.</p>` },
},
{
  slug: 'fashion-beauty-campaigns', date: '2026-11-08', img: 'c-ink', page: 'commercials',
  en: { title: 'Fashion and beauty campaigns: films, lookbooks and social content with AI', desc: 'How fashion and beauty brands create campaign films, lookbooks and social content — mood, colour, texture and formats — with classic shoots and AI.',
    body: `<p>Fashion and beauty live on images. A season, a collection or a new fragrance needs a campaign film, stills for a lookbook and a stream of content for social media — all in one recognisable mood.</p>
<h2>Start with the mood, not the product</h2>
<p>Strong fashion campaigns sell a world first: a place, a light, a feeling. The collection or the product then belongs to that world. A mood board and style frames fix this world before production begins.</p>
<h2>Texture and colour</h2>
<p>Fabric, skin, liquid, glass — texture is everything in fashion and beauty. Macro shots, slow motion and careful colour grading make materials feel tangible. A consistent palette ties the film, the lookbook and social posts together.</p>
<h2>The formats a campaign needs</h2>
<ul><li>A campaign film — 30 to 90 seconds.</li><li>Short vertical cuts for Reels and TikTok.</li><li>Stills for the lookbook, website and marketplaces.</li><li>Loops for product pages and screens in stores.</li></ul>
<h2>Where AI helps</h2>
<p>AI production is useful for worlds and atmospheres that are hard to shoot — surreal sets, impossible locations, abstract visuals of colour and liquid — and for producing many versions quickly. Campaigns built around real people and real garments usually combine a classic shoot with generated environments, with clear consent and rights for everyone shown.</p>
<h2>Consistency is the luxury</h2>
<p>What makes a campaign feel premium is not one spectacular shot but consistency: the same light, rhythm and restraint across every format.</p>
<p>VERGHÉTHORN creates campaign films and visual content for brands — directed like cinema.</p>` },
  ru: { title: 'Реклама для fashion и beauty брендов: фильмы, лукбуки и контент с AI', desc: 'Как fashion- и beauty-бренды создают имиджевые фильмы, лукбуки и контент для соцсетей — настроение, цвет, фактура и форматы — со съёмкой и AI.',
    body: `<p>Fashion и beauty живут изображениями. Сезону, коллекции или новому аромату нужен имиджевый фильм, кадры для лукбука и поток контента для соцсетей — всё в одном узнаваемом настроении.</p>
<h2>Начинайте с настроения, а не с продукта</h2>
<p>Сильные fashion-кампании сначала продают мир: место, свет, ощущение. Коллекция или продукт становятся частью этого мира. Мудборд и кадры стиля фиксируют его ещё до начала производства.</p>
<h2>Фактура и цвет</h2>
<p>Ткань, кожа, жидкость, стекло — в fashion и beauty фактура решает всё. Макросъёмка, замедление и аккуратная цветокоррекция делают материалы осязаемыми. Единая палитра связывает фильм, лукбук и публикации в соцсетях.</p>
<h2>Какие форматы нужны кампании</h2>
<ul><li>Имиджевый фильм — от 30 до 90 секунд.</li><li>Короткие вертикальные версии для Reels и TikTok.</li><li>Кадры для лукбука, сайта и маркетплейсов.</li><li>Зацикленные видео для карточек товара и экранов в магазинах.</li></ul>
<h2>Где помогает AI</h2>
<p>AI-производство полезно для миров и атмосфер, которые сложно снять, — сюрреалистичных декораций, невозможных локаций, абстрактных образов из цвета и жидкости — и для быстрого создания множества версий. Кампании с реальными людьми и реальной одеждой обычно сочетают классическую съёмку с созданными окружениями — с ясным согласием и правами всех, кто в кадре.</p>
<h2>Роскошь — это цельность</h2>
<p>Премиальной кампанию делает не один эффектный кадр, а цельность: один свет, ритм и сдержанность во всех форматах.</p>
<p>VERGHÉTHORN создаёт имиджевые фильмы и визуальный контент для брендов — с режиссурой как в кино.</p>` },
},
{
  slug: 'hotel-travel-video', date: '2026-11-08', img: 's-nature', page: 'nature',
  en: { title: 'Video for hotels and travel brands: how to sell a place', desc: 'How hotels, resorts, tourism brands and regions use video to sell a place — atmosphere, story, aerial shots and the right formats.',
    body: `<p>People do not book a room; they book a feeling — the view in the morning, the silence, the light at sunset. Video is the closest thing to being there, which is why hotels, resorts and tourism brands rely on it.</p>
<h2>Show the experience, not the inventory</h2>
<p>A list of rooms and amenities informs. A short story — arriving, the first look at the sea, dinner under the stars — makes people want to come. Plan the video around moments of a stay.</p>
<h2>Atmosphere sells</h2>
<p>Light and weather carry the mood: mist over the mountains, golden hour on the terrace, a quiet night sky. Choosing the right hour is as important as choosing the location.</p>
<h2>Aerial and wide shots</h2>
<p>Wide landscapes and aerial views explain where the place is and why it is special. They used to need drones, permits and the right weather; with AI production they are designed around the real character of the place.</p>
<h2>Formats for every channel</h2>
<ul><li>A 60–90 second destination film for the website and YouTube.</li><li>Vertical 15–30 second cuts for Reels and TikTok.</li><li>Silent loops for the website header and booking pages.</li></ul>
<h2>Be honest about the place</h2>
<p>Travel video must not mislead guests. Generated shots should stay true to the real location — its landscape, architecture and atmosphere — based on photos and references, and combined with real footage where accuracy matters.</p>
<p>VERGHÉTHORN creates destination films and travel videos for hotels, resorts, tourism brands and regions.</p>` },
  ru: { title: 'Видео для отелей и туризма: как продать место', desc: 'Как отели, курорты, туристические бренды и регионы используют видео, чтобы продать место: атмосфера, история, съёмки с высоты и нужные форматы.',
    body: `<p>Люди бронируют не номер, а ощущение — утренний вид, тишину, свет на закате. Видео ближе всего к тому, чтобы оказаться там, поэтому отели, курорты и туристические бренды делают на него ставку.</p>
<h2>Показывайте впечатления, а не перечень</h2>
<p>Список номеров и удобств информирует. Короткая история — приезд, первый взгляд на море, ужин под звёздами — вызывает желание приехать. Стройте видео вокруг моментов отдыха.</p>
<h2>Продаёт атмосфера</h2>
<p>Настроение передают свет и погода: туман над горами, золотой час на террасе, тихое ночное небо. Выбрать правильный час так же важно, как выбрать локацию.</p>
<h2>Общие планы и съёмка с высоты</h2>
<p>Широкие пейзажи и виды с высоты объясняют, где находится место и чем оно особенное. Раньше для этого нужны были дроны, разрешения и подходящая погода; в AI-производстве такие кадры создаются вокруг настоящего характера места.</p>
<h2>Форматы для каждого канала</h2>
<ul><li>Фильм о направлении на 60–90 секунд для сайта и YouTube.</li><li>Вертикальные версии на 15–30 секунд для Reels и TikTok.</li><li>Беззвучные циклы для шапки сайта и страниц бронирования.</li></ul>
<h2>Будьте честны в отношении места</h2>
<p>Туристическое видео не должно вводить гостей в заблуждение. Созданные кадры должны оставаться верными реальному месту — его пейзажу, архитектуре и атмосфере — на основе фото и референсов, а там, где важна точность, сочетаться с настоящей съёмкой.</p>
<p>VERGHÉTHORN создаёт фильмы о направлениях и видео для отелей, курортов, туристических брендов и регионов.</p>` },
},
{
  slug: 'brand-collaboration-product-placement', date: '2026-11-08', img: 's-collab', page: 'collab',
  en: { title: 'Brand collaborations and product placement: when the ad is the story', desc: 'How brand collaborations and product placement work in films and online content — natural integration, story first, approvals and distribution.',
    body: `<p>Viewers skip ads but watch stories. Brand collaborations put a brand inside content people actually want to see — a short film, a series or a creator’s video — instead of interrupting it.</p>
<h2>Product placement vs. collaboration</h2>
<p>Classic product placement puts a product on screen. A collaboration goes further: the brand’s values, product or place become part of the plot, and the content is created together with the brand from the start.</p>
<h2>Story first</h2>
<p>The most effective branded content works even without the brand — and becomes better with it. If the story only exists to show the product, viewers feel it. A natural role for the brand is the goal.</p>
<h2>How it works</h2>
<ul><li>The brand shares its values, audience and boundaries.</li><li>The studio proposes a story with a natural role for the brand.</li><li>The brand approves the story and the look before production.</li><li>The premiere is planned together on both sides’ channels.</li></ul>
<h2>Why it pays off</h2>
<p>People share stories that move them. A brand inside such a story travels with that feeling — further than a banner and with more trust than a pre-roll ad.</p>
<p>VERGHÉTHORN creates original AI films with natural brand integration — collaborations created together.</p>` },
  ru: { title: 'Коллаборации брендов и продакт-плейсмент: когда реклама становится историей', desc: 'Как работают коллаборации брендов и продакт-плейсмент в фильмах и онлайн-контенте: естественная интеграция, история прежде всего, согласования и дистрибуция.',
    body: `<p>Рекламу пропускают, а истории смотрят. Коллаборации брендов помещают бренд внутрь контента, который люди действительно хотят видеть, — короткометражки, сериала или видео автора, — вместо того чтобы его прерывать.</p>
<h2>Продакт-плейсмент и коллаборация</h2>
<p>Классический продакт-плейсмент показывает продукт в кадре. Коллаборация идёт дальше: ценности, продукт или место бренда становятся частью сюжета, а контент создаётся вместе с брендом с самого начала.</p>
<h2>Сначала история</h2>
<p>Самый сильный брендированный контент работает даже без бренда — и становится лучше вместе с ним. Если история существует только ради продукта, зритель это чувствует. Цель — естественная роль бренда.</p>
<h2>Как это устроено</h2>
<ul><li>Бренд рассказывает о своих ценностях, аудитории и границах.</li><li>Студия предлагает историю с естественной ролью для бренда.</li><li>Бренд утверждает историю и облик до начала производства.</li><li>Премьера планируется вместе — на каналах обеих сторон.</li></ul>
<h2>Почему это окупается</h2>
<p>Люди делятся историями, которые их тронули. Бренд внутри такой истории путешествует вместе с этим чувством — дальше, чем баннер, и с большим доверием, чем реклама перед видео.</p>
<p>VERGHÉTHORN создаёт оригинальные AI-фильмы с естественной интеграцией брендов — коллаборации, созданные вместе.</p>` },
},
];
