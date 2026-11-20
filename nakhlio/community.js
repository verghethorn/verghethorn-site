/* Nakhlio prototype — community content written as real people would.
   Places are always kept in English (see app.js). */
(function () {
const D = (ru, en, ar) => ({ ru, en, ar });
const P = (name, langs, since, rating, dist) => ({ name, langs, since, rating, dist });

window.ADCATS = {
  food: D('Домашняя еда', 'Home food', 'أكل بيتي'),
  things: D('Вещи', 'Things', 'أغراض'),
  services: D('Услуги', 'Services', 'خدمات'),
  lessons: D('Учёба', 'Lessons', 'دروس'),
  free: D('Даром', 'Free', 'مجاناً'),
};
window.HELPCATS = {
  airport: D('Аэропорт и трансфер', 'Airport & transfer', 'المطار والتوصيل'),
  translate: D('Переводчик', 'Interpreter', 'مترجم'),
  elderly: D('Помощь пожилым', 'Help for elderly', 'مساعدة كبار السن'),
  tours: D('Экскурсии по городу', 'City tours', 'جولات في المدينة'),
};

window.ADS = [
  /* ---- food ---- */
  { id: 'A-701', cat: 'food', boosted: true, photos: ['cake1', 'cake2'], seller: P('Amina', 'RU · AR', '2025', 4.9, 'salam'),
    title: D('Торты и медовик на заказ', 'Custom cakes and honey cake', 'كيك وكعكة العسل حسب الطلب'), price: D('от 120 SAR', 'from 120 SAR', 'من 120 ر.س'),
    desc: D('Пеку дома уже 6 лет. Медовик, «Наполеон», шоколадные и детские торты с надписью. Только натуральные продукты. Заказ лучше за 2 дня, могу передать с доставкой по району As Salam.',
            'I’ve been baking at home for 6 years. Honey cake, Napoleon, chocolate and kids’ cakes with lettering. Natural ingredients only. Please order 2 days ahead; delivery around As Salam is possible.',
            'أخبز في البيت منذ 6 سنوات: كعكة العسل والنابليون والشوكولاتة وكيك الأطفال مع الكتابة. مكونات طبيعية فقط. يُفضّل الطلب قبل يومين، والتوصيل ممكن داخل حي As Salam.'),
    comments: [
      { who: 'Fatima', text: D('Ассаляму алейкум! Можно торт на день рождения сына к пятнице, человек на 12?', 'Assalamu alaikum! Could I order a birthday cake for my son by Friday, for about 12 people?', 'السلام عليكم، هل يمكن طلب كيك لعيد ميلاد ابني يوم الجمعة لحوالي 12 شخصاً؟') },
      { who: 'Amina', to: 'Fatima', text: D('Ва алейкум ассалам! Да, успею. Напишите мне лично, обсудим начинку и надпись 🙂', 'Wa alaikum assalam! Yes, I can make it. Message me privately and we’ll choose the filling and the lettering 🙂', 'وعليكم السلام! نعم أستطيع. راسليني على الخاص لنتفق على الحشوة والكتابة 🙂') },
      { who: 'Leyla', text: D('Брала у Амины медовик на прошлой неделе — очень вкусный, не приторный. Рекомендую!', 'I bought Amina’s honey cake last week — delicious and not too sweet. Recommend!', 'أخذت كعكة العسل من أمينة الأسبوع الماضي، لذيذة وغير مبالغ في حلاوتها. أنصح بها!') },
    ] },
  { id: 'A-707', cat: 'food', photos: ['dump1', 'dump2'], seller: P('Gulnara', 'RU · UZ', '2024', 4.8, 'aziziyah'),
    title: D('Домашние манты, самса и чучвара', 'Homemade manti, samsa and chuchvara', 'مانتي وسمبوسة وشُشفارا منزلية'), price: D('35 SAR / дюжина', '35 SAR / dozen', '35 ر.س / دزينة'),
    desc: D('Готовлю по узбекским рецептам мамы. Можно замороженные — удобно держать дома. Самса с говядиной и с тыквой. Забрать в Al Aziziyah или доставка за 10 SAR.',
            'I cook from my mother’s Uzbek recipes. Frozen packs available — handy to keep at home. Samsa with beef or pumpkin. Pick up in Al Aziziyah or delivery for 10 SAR.',
            'أطبخ على وصفات أمي الأوزبكية. متوفر مجمّد لسهولة الحفظ. سمبوسة باللحم أو بالقرع. الاستلام من Al Aziziyah أو التوصيل بـ 10 ر.س.'),
    comments: [
      { who: 'Hasan', text: D('А с тыквой бывают каждый день?', 'Is the pumpkin samsa available every day?', 'هل سمبوسة القرع متوفرة كل يوم؟') },
      { who: 'Gulnara', to: 'Hasan', text: D('С тыквой пеку по четвергам и субботам, можно заказать заранее.', 'I bake the pumpkin ones on Thursdays and Saturdays; you can pre-order.', 'أخبز سمبوسة القرع يومي الخميس والسبت، ويمكن الطلب مسبقاً.') },
      { who: 'Daniyar', text: D('Взяли 3 дюжины мантов на семью — как дома в Ташкенте. Спасибо!', 'We took 3 dozen manti for the family — just like home in Tashkent. Thank you!', 'أخذنا 3 دزينات مانتي للعائلة، تماماً مثل البيت في طشقند. شكراً!') },
    ] },
  { id: 'A-708', cat: 'food', photos: ['bir1', 'bir2'], seller: P('Sana', 'UR · EN', '2025', 4.9, 'rayah'),
    title: D('Пакистанский бирьяни и нихари на заказ', 'Pakistani biryani and nihari to order', 'برياني ونهاري باكستاني حسب الطلب'), price: D('от 60 SAR', 'from 60 SAR', 'من 60 ر.س'),
    desc: D('Бирьяни с курицей или бараниной, нихари по выходным. Порция на 4–5 человек. Готовлю для семейных встреч и мероприятий.',
            'Chicken or mutton biryani, nihari on weekends. One tray feeds 4–5 people. I also cook for family gatherings and events.',
            'برياني بالدجاج أو باللحم الضأن، والنهاري في عطلة نهاية الأسبوع. الصينية تكفي 4–5 أشخاص. أطبخ للمناسبات العائلية أيضاً.'),
    comments: [
      { who: 'Imran', text: D('Можно на 20 человек в субботу?', 'Could you do it for 20 people on Saturday?', 'هل يمكن لـ 20 شخصاً يوم السبت؟') },
      { who: 'Sana', to: 'Imran', text: D('Да, инша Аллах. Нужно подтвердить до четверга.', 'Yes, insha’Allah. Please confirm by Thursday.', 'نعم إن شاء الله، أرجو التأكيد قبل الخميس.') },
    ] },
  /* ---- things ---- */
  { id: 'A-702', cat: 'things', photos: ['liv6', 'liv3'], seller: P('Ibrahim', 'AR · EN', '2023', 4.7, 'aziziyah'),
    title: D('Диван-уголок, как новый — уезжаем', 'Corner sofa, like new — moving out', 'كنبة زاوية كالجديدة — بسبب السفر'), price: D('650 SAR', '650 SAR', '650 ر.س'),
    desc: D('Куплен 8 месяцев назад в IKEA Jeddah за 1 800 SAR. Серый, раскладывается, чехлы снимаются и стираются. Самовывоз из Al Aziziyah, помогу вынести.',
            'Bought 8 months ago at IKEA Jeddah for 1,800 SAR. Grey, pulls out into a bed, covers are removable and washable. Pick up from Al Aziziyah, I’ll help carry it.',
            'اشتريتها قبل 8 أشهر من ايكيا جدة بـ 1800 ر.س. رمادية وتتحول إلى سرير، والأغطية قابلة للنزع والغسيل. الاستلام من Al Aziziyah وأساعد في الحمل.'),
    comments: [
      { who: 'Murad', text: D('Ещё актуально? Можно посмотреть сегодня вечером?', 'Still available? Can I see it this evening?', 'هل ما زالت متوفرة؟ ممكن أشوفها الليلة؟') },
      { who: 'Ibrahim', to: 'Murad', text: D('Да, приходите после магриба. Напишите лично, скину точку.', 'Yes, come after Maghrib. Message me privately and I’ll send the location.', 'نعم، تعال بعد المغرب. راسلني على الخاص وأرسل لك الموقع.') },
    ] },
  { id: 'A-709', cat: 'things', photos: ['wash1', 'wash2'], seller: P('Ahmad', 'ID · AR', '2024', 4.8, 'salam'),
    title: D('Стиральная машина LG 8 кг', 'LG washing machine, 8 kg', 'غسالة LG سعة 8 كجم'), price: D('400 SAR', '400 SAR', '400 ر.س'),
    desc: D('Работает отлично, 2 года. Фронтальная загрузка, тихая. Продаю, потому что в новой квартире уже есть машина.',
            'Works perfectly, 2 years old. Front loader, quiet. Selling because the new flat already has one.',
            'تعمل بشكل ممتاز، عمرها سنتان. تحميل أمامي وهادئة. أبيعها لأن الشقة الجديدة فيها غسالة.'),
    comments: [
      { who: 'Siti', text: D('Можно доставку до Al Fath?', 'Can you deliver to Al Fath?', 'ممكن توصيل إلى Al Fath؟') },
      { who: 'Ahmad', to: 'Siti', text: D('Да, с другом на машине привезём за 30 SAR.', 'Yes, a friend and I can bring it by car for 30 SAR.', 'نعم، أوصلها مع صديقي بالسيارة مقابل 30 ر.س.') },
      { who: 'Timur', text: D('Если вдруг нужна помощь с переездом техники — пишите, у меня машина.', 'If you need help moving appliances, write to me — I have a van.', 'إذا احتجتم مساعدة في نقل الأجهزة راسلوني، عندي سيارة نقل.') },
    ] },
  { id: 'A-710', cat: 'things', photos: ['book1', 'book2'], seller: P('Abdulla', 'RU · AR', '2025', 5.0, 'jamiah'),
    title: D('Учебники арабского «Мединский курс», 3 тома', 'Arabic textbooks “Madinah Course”, 3 volumes', 'كتب «دروس اللغة العربية» – المدينة، 3 أجزاء'), price: D('45 SAR', '45 SAR', '45 ر.س'),
    desc: D('Почти без пометок, все 3 тома плюс тетрадь с упражнениями. Отдаю студентам со скидкой. Встреча у Islamic University.',
            'Almost no notes, all 3 volumes plus the exercise book. Discount for students. We can meet at the Islamic University.',
            'بدون ملاحظات تقريباً، الأجزاء الثلاثة مع كراسة التمارين. خصم للطلاب. اللقاء عند الجامعة الإسلامية.'),
    comments: [
      { who: 'Yusuf', text: D('Брат, забронируй за мной, пожалуйста, заберу завтра после зухра.', 'Brother, please reserve them for me — I’ll pick up tomorrow after Dhuhr.', 'أخي احجزها لي من فضلك، آخذها غداً بعد الظهر.') },
      { who: 'Abdulla', to: 'Yusuf', text: D('Хорошо, держу до завтра.', 'OK, holding them until tomorrow.', 'تمام، محجوزة لك حتى الغد.') },
    ] },
  /* ---- services ---- */
  { id: 'A-703', cat: 'services', pro: true, photos: ['elec1', 'elec2'], seller: P('Usman', 'UR · EN · AR', '2022', 4.9, 'qaswa'),
    title: D('Электрик: розетки, свет, кондиционеры', 'Electrician: sockets, lights, AC', 'كهربائي: أفياش وإنارة ومكيفات'), price: D('от 80 SAR', 'from 80 SAR', 'من 80 ر.س'),
    desc: D('12 лет опыта. Установка люстр, розеток, водонагревателей, обслуживание сплит-кондиционеров. Выезд по всей Медине, в день обращения.',
            '12 years of experience. Chandeliers, sockets, water heaters, split AC servicing. I come anywhere in Medina, same day.',
            'خبرة 12 سنة. تركيب ثريات وأفياش وسخانات، وصيانة مكيفات سبليت. أحضر لأي مكان في المدينة في نفس اليوم.'),
    comments: [
      { who: 'Denis', text: D('Сколько стоит повесить люстру и поменять 3 розетки?', 'How much to hang a chandelier and change 3 sockets?', 'كم تكلفة تركيب ثريا وتغيير 3 أفياش؟') },
      { who: 'Usman', to: 'Denis', text: D('Всё вместе 150 SAR, могу сегодня после асра.', '150 SAR for everything, I can come today after Asr.', 'الكل بـ 150 ر.س، أقدر آجي اليوم بعد العصر.') },
      { who: 'Kamila', text: D('Чистил нам 2 кондиционера — аккуратно и быстро, всё убрал за собой.', 'He cleaned 2 ACs for us — neat and quick, left everything tidy.', 'نظّف لنا مكيفين بسرعة ونظافة وترك المكان مرتباً.') },
    ] },
  { id: 'A-704', cat: 'services', photos: ['move1', 'move2'], seller: P('Timur', 'RU · AR', '2024', 4.8, 'aziziyah'),
    title: D('Переезд: грузчики и машина', 'Moving: movers and a van', 'نقل عفش: عمال وسيارة'), price: D('от 250 SAR', 'from 250 SAR', 'من 250 ر.س'),
    desc: D('Закрытая машина, 2 грузчика, разборка и сборка мебели. Перевозим по Медине и в Jeddah. Упаковочные коробки — бесплатно.',
            'Closed van, 2 movers, furniture assembly and disassembly. We move within Medina and to Jeddah. Packing boxes free.',
            'سيارة مغلقة وعاملان مع فك وتركيب الأثاث. ننقل داخل المدينة وإلى Jeddah. كراتين التغليف مجاناً.'),
    comments: [
      { who: 'Olga', text: D('Сколько будет 2-комнатная квартира с 3 этажа без лифта?', 'How much for a 2-bedroom flat from the 3rd floor, no lift?', 'كم سعر نقل شقة غرفتين من الدور الثالث بدون مصعد؟') },
      { who: 'Timur', to: 'Olga', text: D('Около 400 SAR, точнее скажу по фото. Скиньте лично.', 'Around 400 SAR, I’ll confirm from photos. Send them privately.', 'حوالي 400 ر.س، أحدد السعر من الصور. أرسليها على الخاص.') },
    ] },
  { id: 'A-711', cat: 'services', photos: ['kit5', 'liv12'], seller: P('Mariam', 'AR · EN', '2025', 4.7, 'ranuna'),
    title: D('Уборка квартир после выезда и до заселения', 'Move-out and move-in cleaning', 'تنظيف الشقق قبل السكن وبعد الإخلاء'), price: D('от 180 SAR', 'from 180 SAR', 'من 180 ر.س'),
    desc: D('Генеральная уборка: кухня, санузлы, окна, кондиционеры снаружи. Работаем вдвоём, свои средства.',
            'Deep cleaning: kitchen, bathrooms, windows, AC units outside. Two of us, our own products.',
            'تنظيف شامل: المطبخ ودورات المياه والنوافذ والمكيفات من الخارج. نعمل اثنتين وبمنتجاتنا.'),
    comments: [
      { who: 'Aisha', text: D('Работаете в пятницу?', 'Do you work on Friday?', 'هل تعملون يوم الجمعة؟') },
      { who: 'Mariam', to: 'Aisha', text: D('В пятницу после джума, с 15:00.', 'On Friday after Jumu’ah, from 15:00.', 'يوم الجمعة بعد الصلاة، من الساعة 3 عصراً.') },
    ] },
  /* ---- lessons ---- */
  { id: 'A-705', cat: 'lessons', pro: true, photos: ['book2', 'liv8'], seller: P('Ustaz Khalid', 'AR · EN · RU', '2023', 5.0, 'jamiah'),
    title: D('Арабский язык с нуля, онлайн и очно', 'Arabic from zero, online and in person', 'العربية من الصفر، عن بعد وحضورياً'), price: D('60 SAR / урок', '60 SAR / lesson', '60 ر.س / درس'),
    desc: D('Выпускник Islamic University of Madinah. Разговорный арабский для жизни в Медине и литературный по «Мединскому курсу». Первый урок бесплатно.',
            'Islamic University of Madinah graduate. Spoken Arabic for daily life in Medina and classical Arabic with the Madinah Course. First lesson free.',
            'خريج الجامعة الإسلامية بالمدينة. عربية محكية للحياة اليومية وفصحى بمنهج «دروس اللغة العربية». الدرس الأول مجاني.'),
    comments: [
      { who: 'Ruslan', text: D('Занимаюсь у устаза 3 месяца — уже свободно говорю в магазине и в такси 👍', 'I’ve studied with the ustaz for 3 months — I already speak easily in shops and taxis 👍', 'أدرس عند الأستاذ منذ 3 أشهر، وصرت أتكلم بسهولة في المحلات والتاكسي 👍') },
      { who: 'Nur', text: D('Есть ли группы для сестёр?', 'Are there groups for sisters?', 'هل توجد مجموعات للأخوات؟') },
      { who: 'Ustaz Khalid', to: 'Nur', text: D('Да, женскую группу ведёт моя супруга, онлайн по вторникам.', 'Yes, my wife teaches the sisters’ group online on Tuesdays.', 'نعم، زوجتي تدرّس مجموعة الأخوات عن بعد يوم الثلاثاء.') },
    ] },
  { id: 'A-712', cat: 'lessons', photos: ['book1', 'bed6'], seller: P('Zaynab', 'RU · AR', '2025', 4.9, 'salam'),
    title: D('Таджвид и Коран для детей онлайн', 'Tajweed and Quran for kids, online', 'تجويد وقرآن للأطفال عن بعد'), price: D('200 SAR / месяц', '200 SAR / month', '200 ر.س / شهر'),
    desc: D('Группы по 4 ребёнка 6–12 лет, 3 раза в неделю по 40 минут. Иджаза по чтению Хафса.',
            'Groups of 4 children aged 6–12, three times a week for 40 minutes. Ijazah in Hafs recitation.',
            'مجموعات من 4 أطفال بعمر 6–12 سنة، ثلاث مرات أسبوعياً لمدة 40 دقيقة. مُجازة برواية حفص.'),
    comments: [
      { who: 'Farida', text: D('Сыну 5 лет, возьмёте?', 'My son is 5 — would you take him?', 'ابني عمره 5 سنوات، هل تقبلينه؟') },
      { who: 'Zaynab', to: 'Farida', text: D('Можно попробовать на пробном уроке, посмотрим, как ему будет.', 'Let’s try a trial lesson and see how he does.', 'نجرب درساً تجريبياً ونرى كيف يتفاعل.') },
    ] },
  /* ---- free ---- */
  { id: 'A-706', cat: 'free', photos: ['crib1', 'crib2'], seller: P('Maryam', 'RU · EN', '2024', 4.8, 'salam'),
    title: D('Детская кроватка и коляска — даром', 'Baby cot and stroller — free', 'سرير أطفال وعربة — مجاناً'), price: D('Бесплатно', 'Free', 'مجاناً'),
    desc: D('Дети выросли, отдадим тем, кому нужнее. Кроватка с матрасом, коляска складная. Забрать в As Salam.',
            'Our kids have grown up — giving them to someone who needs them. Cot with mattress, foldable stroller. Pick up in As Salam.',
            'كبر أطفالنا ونهديها لمن يحتاجها. سرير مع مرتبة وعربة قابلة للطي. الاستلام من As Salam.'),
    comments: [
      { who: 'Aliya', text: D('Ассаляму алейкум, можно я заберу? Ждём малыша в январе.', 'Assalamu alaikum, may I take them? We’re expecting a baby in January.', 'السلام عليكم، ممكن آخذها؟ ننتظر مولوداً في يناير.') },
      { who: 'Maryam', to: 'Aliya', text: D('Ва алейкум ассалам, конечно! Машаллах, пусть легко пройдёт. Напишите лично.', 'Wa alaikum assalam, of course! May it go easily. Message me privately.', 'وعليكم السلام، أكيد! الله يتمم لك على خير. راسليني على الخاص.') },
    ] },
  { id: 'A-713', cat: 'free', photos: ['book2', 'liv2'], seller: P('Olga', 'RU', '2023', 4.6, 'fath'),
    title: D('20 книг на русском — даром', '20 books in Russian — free', '20 كتاباً بالروسية — مجاناً'), price: D('Бесплатно', 'Free', 'مجاناً'),
    desc: D('Детективы, детские сказки и книги по исламу на русском. Отдам всё вместе, удобно забрать в Al Fath.',
            'Detective novels, children’s tales and books on Islam in Russian. Giving them all together; easy pickup in Al Fath.',
            'روايات بوليسية وقصص أطفال وكتب إسلامية بالروسية. أعطيها كلها معاً، والاستلام من Al Fath.'),
    comments: [
      { who: 'Kamila', text: D('Детские сказки ещё есть? Для дочки 7 лет.', 'Are the children’s tales still there? For my 7-year-old daughter.', 'هل قصص الأطفال ما زالت موجودة؟ لابنتي عمرها 7 سنوات.') },
      { who: 'Olga', to: 'Kamila', text: D('Есть, отложу для вас.', 'Yes, I’ll put them aside for you.', 'نعم، سأحتفظ بها لك.') },
    ] },
];

window.HELP = [
  { id: 'G-901', cat: 'airport', seller: P('Abdullah', 'RU · AR', '2024', 4.9, 'central'),
    title: D('Встречу в аэропорту и довезу до жилья', 'I’ll meet you at the airport and drive you to your place', 'أستقبلك في المطار وأوصلك إلى السكن'), price: D('150 SAR', '150 SAR', '150 ر.س'),
    desc: D('Встречаю в Prince Mohammad bin Abdulaziz Airport с табличкой, помогу с SIM-картой и багажом. Машина на 6 мест.', 'I meet you at Prince Mohammad bin Abdulaziz Airport with a sign, help with a SIM card and luggage. 6-seat car.', 'أستقبلك في مطار الأمير محمد بن عبدالعزيز بلوحة باسمك، وأساعد في الشريحة والأمتعة. سيارة 6 مقاعد.'),
    comments: [{ who: 'Rustam', text: D('Рейс прилетает в 3 ночи — встретите?', 'My flight lands at 3 a.m. — can you meet me?', 'رحلتي تصل الساعة 3 فجراً، هل تستقبلني؟') }, { who: 'Abdullah', to: 'Rustam', text: D('Да, ночью тоже работаю, +30 SAR.', 'Yes, I work nights too, +30 SAR.', 'نعم أعمل ليلاً أيضاً، بزيادة 30 ر.س.') }] },
  { id: 'G-905', cat: 'airport', seller: P('Imran', 'UR · EN', '2025', 4.8, 'aziziyah'),
    title: D('Трансфер Медина → Мекка на умру', 'Transfer Medina → Makkah for Umrah', 'توصيل من المدينة إلى مكة للعمرة'), price: D('450 SAR / машина', '450 SAR / car', '450 ر.س / سيارة'),
    desc: D('Остановка в микате Dhul Hulayfah для ихрама. GMC на 7 человек, вода и детское кресло.', 'Stop at the Dhul Hulayfah miqat for ihram. GMC for 7 people, water and a child seat.', 'توقف عند ميقات ذي الحليفة للإحرام. سيارة GMC لـ 7 أشخاص مع ماء وكرسي أطفال.'),
    comments: [{ who: 'Siti', text: D('Едем семьёй из 5 человек в четверг утром.', 'We’re a family of 5, going Thursday morning.', 'نحن عائلة من 5 أشخاص، يوم الخميس صباحاً.') }, { who: 'Imran', to: 'Siti', text: D('Отлично, в четверг свободен. Выезд в 6:00?', 'Great, I’m free Thursday. Leave at 6:00?', 'ممتاز، أنا متفرغ الخميس. ننطلق 6 صباحاً؟') }] },
  { id: 'G-902', cat: 'translate', seller: P('Zarina', 'RU · AR · EN', '2023', 5.0, 'salam'),
    title: D('Переводчик в больницу, банк, Jawazat', 'Interpreter for hospital, bank, Jawazat', 'مترجمة للمستشفى والبنك والجوازات'), price: D('100 SAR / час', '100 SAR / hour', '100 ر.س / ساعة'),
    desc: D('Живу в Медине 9 лет. Хожу с вами к врачу, в банк или госучреждение и перевожу на месте.', 'I’ve lived in Medina for 9 years. I go with you to the doctor, bank or government office and interpret on the spot.', 'أعيش في المدينة منذ 9 سنوات. أرافقك إلى الطبيب أو البنك أو الدائرة الحكومية وأترجم مباشرة.'),
    comments: [{ who: 'Leyla', text: D('Зарина ходила со мной к гинекологу — объяснила всё до мелочей, очень спокойно.', 'Zarina came with me to the gynaecologist — explained everything in detail, very calmly.', 'رافقتني زارينا إلى طبيبة النساء وشرحت كل شيء بهدوء وتفصيل.') }] },
  { id: 'G-906', cat: 'translate', seller: P('Bilal', 'UR · AR · EN', '2024', 4.7, 'qaswa'),
    title: D('Перевод документов и помощь с Absher', 'Document translation and Absher help', 'ترجمة مستندات ومساعدة في أبشر'), price: D('от 50 SAR', 'from 50 SAR', 'من 50 ر.س'),
    desc: D('Помогаю записаться в Absher, оплатить штрафы, продлить иqаму и перевести документы через аккредитованное бюро.', 'I help you register in Absher, pay fines, renew your Iqama and translate documents through an accredited office.', 'أساعد في التسجيل في أبشر وسداد المخالفات وتجديد الإقامة وترجمة المستندات عبر مكتب معتمد.'),
    comments: [{ who: 'Hasan', text: D('Помог за 15 минут разобраться с продлением, спасибо!', 'Sorted out my renewal in 15 minutes, thank you!', 'ساعدني في التجديد خلال 15 دقيقة، شكراً!') }] },
  { id: 'G-903', cat: 'elderly', seller: P('Muhammad', 'UR · AR · EN', '2023', 4.9, 'central'),
    title: D('Помощь пожилым родителям на зиярате', 'Help for elderly parents during Ziyarah', 'مساعدة كبار السن في الزيارة'), price: D('200 SAR / день', '200 SAR / day', '200 ر.س / يوم'),
    desc: D('Сопровождаю в Масджид ан-Набави, Куба и Ухуд, есть кресло-коляска. Подстраиваюсь под время намазов.', 'I accompany them to Masjid an-Nabawi, Quba and Uhud; I have a wheelchair. I plan around prayer times.', 'أرافقهم إلى المسجد النبوي وقباء وأحد، ولدي كرسي متحرك. أرتب الوقت حسب الصلوات.'),
    comments: [{ who: 'Farida', text: D('Мама в восторге от Мухаммада, очень терпеливый.', 'My mother is delighted with Muhammad — very patient.', 'أمي سعيدة جداً بمحمد، صبور للغاية.') }] },
  { id: 'G-907', cat: 'elderly', seller: P('Aisha', 'AR · EN', '2025', 4.8, 'rayah'),
    title: D('Сиделка для пожилой женщины на дому', 'Home carer for an elderly woman', 'مرافقة منزلية لامرأة مسنّة'), price: D('150 SAR / день', '150 SAR / day', '150 ر.س / يوم'),
    desc: D('Медсестра по образованию. Помогу с лекарствами по расписанию врача, прогулками и бытом.', 'Nurse by training. I help with medication on the doctor’s schedule, walks and daily tasks.', 'ممرضة بالتخصص. أساعد في مواعيد الأدوية حسب الطبيب والمشي والأعمال اليومية.'),
    comments: [{ who: 'Olga', text: D('Работаете с ночёвкой?', 'Do you do overnight stays?', 'هل تعملين مع المبيت؟') }, { who: 'Aisha', to: 'Olga', text: D('Да, по договорённости.', 'Yes, by arrangement.', 'نعم، بالاتفاق.') }] },
  { id: 'G-904', cat: 'tours', seller: P('Ahmad', 'ID · AR', '2024', 4.9, 'fath'),
    title: D('Покажу районы перед арендой жилья', 'I’ll show you districts before you rent', 'أعرّفك على الأحياء قبل الاستئجار'), price: D('120 SAR', '120 SAR', '120 ر.س'),
    desc: D('За 3 часа объедем 4–5 районов, покажу магазины, школы и мечети рядом. Помогает понять, где удобнее жить.', 'In 3 hours we’ll drive around 4–5 districts and I’ll show nearby shops, schools and mosques. Helps you see where it’s easier to live.', 'خلال 3 ساعات نزور 4–5 أحياء وأريك المحلات والمدارس والمساجد القريبة، لتعرف أين الأنسب لك.'),
    comments: [{ who: 'Denis', text: D('После поездки сразу выбрали Al Rayah — тихо и рядом школа.', 'After the tour we chose Al Rayah right away — quiet and a school nearby.', 'بعد الجولة اخترنا Al Rayah مباشرة، هادئ وقريب من المدرسة.') }] },
  { id: 'G-908', cat: 'tours', seller: P('Yusuf', 'RU · AR', '2023', 5.0, 'central'),
    title: D('Исторические места Медины с рассказом', 'Historic sites of Medina with a guide', 'المعالم التاريخية في المدينة مع مرشد'), price: D('100 SAR / человек', '100 SAR / person', '100 ر.س / شخص'),
    desc: D('Ухуд, Куба, Масджид аль-Киблатайн, ров Хандак. Рассказываю сиру на русском, группы до 8 человек.', 'Uhud, Quba, Masjid al-Qiblatayn, the Trench. I tell the Seerah in Russian, groups up to 8.', 'أحد وقباء ومسجد القبلتين والخندق. أروي السيرة بالروسية لمجموعات حتى 8 أشخاص.'),
    comments: [{ who: 'Ruslan', text: D('Были с детьми — слушали с открытым ртом. Джазакаллаху хайран!', 'We went with the kids — they listened open-mouthed. JazakAllahu khayran!', 'ذهبنا مع الأطفال وكانوا منبهرين. جزاك الله خيراً!') }] },
];

window.PARCELS = [
  { id: 'P-801', kind: 'flying', from: 'Medina', to: 'Moscow', date: '2026-12-02', kg: 3, seller: P('Rustam', 'RU', '2024', 4.8, 'aziziyah'),
    desc: D('Лечу прямым рейсом через Jeddah. Возьму только открытые вещи: финики, одежду, книги. Встреча в Москве у м. Комсомольская.', 'Flying via Jeddah. I’ll take open items only: dates, clothes, books. Meeting point in Moscow near Komsomolskaya metro.', 'مسافر عبر Jeddah. آخذ أغراضاً مفتوحة فقط: تمور وملابس وكتب. التسليم في موسكو قرب محطة كومسومولسكايا.'),
    comments: [{ who: 'Kamila', text: D('2 кг фиников Аджва для мамы возьмёте?', 'Could you take 2 kg of Ajwa dates for my mum?', 'هل تأخذ 2 كجم تمر عجوة لأمي؟') }, { who: 'Rustam', to: 'Kamila', text: D('Да, передайте открытой коробкой до 1 декабря.', 'Yes, hand them over in an open box by 1 December.', 'نعم، سلّميها في علبة مفتوحة قبل 1 ديسمبر.') }] },
  { id: 'P-802', kind: 'flying', from: 'Medina', to: 'Jakarta', date: '2026-12-05', kg: 5, seller: P('Siti', 'ID · AR', '2025', 4.9, 'fath'),
    desc: D('Лечу домой на 2 недели, есть место в багаже. Сама упакую при вас.', 'Going home for 2 weeks, I have space in my luggage. I’ll pack it myself in front of you.', 'مسافرة إلى بلدي لأسبوعين وعندي مكان في الحقيبة. أغلّف بنفسي أمامك.'),
    comments: [{ who: 'Ahmad', text: D('Можно передать молитвенные коврики для семьи?', 'Can I send prayer rugs for my family?', 'ممكن أرسل سجادات صلاة للعائلة؟') }] },
  { id: 'P-805', kind: 'flying', from: 'Medina', to: 'Istanbul', date: '2026-12-12', kg: 4, seller: P('Murad', 'RU · TR', '2023', 4.7, 'salam'),
    desc: D('Пересадка в Istanbul, могу передать там. Только вещи, которые проверю сам.', 'Transit in Istanbul, can hand over there. Only items I can check myself.', 'ترانزيت في Istanbul وأسلّم هناك. فقط الأغراض التي أفحصها بنفسي.'),
    comments: [] },
  { id: 'P-803', kind: 'need', from: 'Kazan', to: 'Medina', date: '2026-12-15', kg: 1, seller: P('Adel', 'RU · AR', '2025', 4.9, 'jamiah'),
    what: D('Документы для университета', 'University documents', 'أوراق للجامعة'),
    desc: D('Нужно привезти конверт с заверенным аттестатом из Казани. Могу оплатить 100 SAR и встретить в аэропорту.', 'Need someone to bring an envelope with my certified diploma from Kazan. I can pay 100 SAR and meet at the airport.', 'أحتاج من يحضر ظرفاً فيه شهادتي الموثقة من قازان. أدفع 100 ر.س وأستقبله في المطار.'),
    comments: [{ who: 'Ruslan', text: D('Лечу из Казани 14-го, напишу лично.', 'I fly from Kazan on the 14th, I’ll message you.', 'مسافر من قازان يوم 14، سأراسلك.') }] },
  { id: 'P-804', kind: 'need', from: 'Medina', to: 'Lahore', date: '2026-12-10', kg: 2, seller: P('Bilal', 'UR · AR', '2024', 4.8, 'qaswa'),
    what: D('Финики и подарки семье', 'Dates and gifts for family', 'تمور وهدايا للعائلة'),
    desc: D('Финики и 2 платка, всё открытое. Брат встретит в Lahore.', 'Dates and 2 scarves, all open. My brother will meet you in Lahore.', 'تمور وشالان، كلها مفتوحة. أخي يستقبلك في Lahore.'),
    comments: [{ who: 'Imran', text: D('Лечу в Lahore 9-го, могу взять.', 'I fly to Lahore on the 9th, I can take it.', 'مسافر إلى Lahore يوم 9، أقدر آخذها.') }] },
  { id: 'P-806', kind: 'need', from: 'Almaty', to: 'Medina', date: '2026-12-20', kg: 1.5, seller: P('Aliya', 'RU · KZ', '2025', 4.9, 'salam'),
    what: D('Детские зимние вещи для поездки', 'Kids’ winter clothes for a trip', 'ملابس شتوية للأطفال للسفر'),
    desc: D('Мама передаст пакет с детскими вещами, всё можно открыть и проверить.', 'My mum will hand over a bag of kids’ clothes; everything can be opened and checked.', 'أمي ستسلّم كيساً فيه ملابس أطفال، ويمكن فتحه وفحصه.'),
    comments: [] },
];

/* ---------- Majlis ---------- */
const Q = (who, date, text, helped, a) => ({ q: true, who, date, text, helped, a: a || [] });
const E = (who, date, text, helped, a) => ({ q: false, who, date, text, helped, a: a || [] });
const A = (who, date, text, helped, to) => ({ who, date, text, helped, to });
window.POSTS = {
  iqama: [
    Q('Saeed', '2026-10', D('Как проверить, готова ли иqама после продления?', 'How do I check if my Iqama is ready after renewal?', 'كيف أتحقق من جاهزية الإقامة بعد التجديد؟'), 18, [
      A('Murad', '2026-10', D('В Absher: «Мои услуги» → «Паспорта» → «Продление иqамы». У меня статус обновился через 2 дня.', 'In Absher: “My services” → “Passports” → “Iqama renewal”. My status updated after 2 days.', 'في أبشر: «خدماتي» ← «الجوازات» ← «تجديد الإقامة». تحدثت الحالة عندي بعد يومين.'), 24),
      A('Saeed', '2026-10', D('Спасибо, брат, нашёл!', 'Thanks brother, found it!', 'شكراً أخي، وجدتها!'), 2, 'Murad')]),
    E('Olga', '2026-09', D('Мой опыт: регистрировалась в Absher в отделении Jawazat у вокзала. Взяла паспорт и иqаму, очередь 40 минут, всё сделали в тот же день.', 'My experience: I registered for Absher at the Jawazat office near the station. Passport and Iqama, 40 minutes in the queue, done the same day.', 'تجربتي: سجّلت في أبشر في مكتب الجوازات قرب المحطة. أحضرت الجواز والإقامة، وانتظرت 40 دقيقة، وتم كل شيء في نفس اليوم.'), 31, [
      A('Kamila', '2026-09', D('А для жены отдельно идти или с мужем?', 'Does the wife go separately or with her husband?', 'هل تذهب الزوجة وحدها أم مع زوجها؟'), 3),
      A('Olga', '2026-09', D('Я ходила с мужем, его тоже попросили показать иqаму.', 'I went with my husband — they asked to see his Iqama too.', 'ذهبت مع زوجي وطلبوا إقامته أيضاً.'), 5, 'Kamila')]),
  ],
  bank: [
    Q('Hasan', '2026-11', D('Какой банк быстрее всего открывает счёт по новой иqаме?', 'Which bank opens an account fastest with a new Iqama?', 'أي بنك يفتح الحساب بسرعة بإقامة جديدة؟'), 12, [
      A('Daniyar', '2026-11', D('Открывал онлайн в приложении банка за 20 минут, карту привезли через 3 дня. Нужен активный Absher.', 'Opened it online in the bank’s app in 20 minutes, card delivered in 3 days. You need an active Absher.', 'فتحته عبر تطبيق البنك في 20 دقيقة ووصلتني البطاقة بعد 3 أيام. تحتاج حساب أبشر مفعّل.'), 19),
      A('Imran', '2026-11', D('У меня онлайн не прошло из-за имени латиницей — сходил в отделение, сделали за час.', 'Online didn’t work for me because of the Latin spelling of my name — went to a branch, done in an hour.', 'ما نجح معي أونلاين بسبب كتابة الاسم بالإنجليزي، فذهبت للفرع وانتهى خلال ساعة.'), 7)]),
    E('Leyla', '2026-10', D('Совет: сразу подключите Apple Pay / mada Pay — почти везде платят телефоном, наличные почти не нужны.', 'Tip: set up Apple Pay / mada Pay right away — phones are accepted almost everywhere, you barely need cash.', 'نصيحة: فعّل Apple Pay أو مدى باي مباشرة، الدفع بالجوال في كل مكان تقريباً.'), 15),
  ],
  sim: [
    E('Ayesha', '2026-08', D('SIM-карту купила прямо в аэропорту Медины по паспорту. Потом перерегистрировала на иqаму в салоне за 5 минут.', 'Bought a SIM right at Medina airport with my passport. Later re-registered it to my Iqama in a store in 5 minutes.', 'اشتريت الشريحة من مطار المدينة بالجواز، ثم نقلتها على الإقامة في المحل خلال 5 دقائق.'), 22, [
      A('Rustam', '2026-08', D('Какой тариф брали?', 'Which plan did you get?', 'أي باقة أخذتِ؟'), 1),
      A('Ayesha', '2026-08', D('Предоплата на месяц с безлимитным интернетом, около 100 SAR.', 'Prepaid monthly with unlimited data, around 100 SAR.', 'مسبقة الدفع شهرية بإنترنت غير محدود، حوالي 100 ر.س.'), 6, 'Rustam')]),
    Q('Ruslan', '2026-11', D('Можно ли оформить eSIM на иqаму без похода в салон?', 'Can I get an eSIM on my Iqama without going to a store?', 'هل يمكن استخراج eSIM بالإقامة بدون زيارة المحل؟'), 8, [
      A('Daniyar', '2026-11', D('Да, через приложение оператора с подтверждением через Nafath, у меня заняло 10 минут.', 'Yes, via the operator’s app with Nafath verification — took me 10 minutes.', 'نعم، عبر تطبيق المشغل مع التحقق بنفاذ، أخذ مني 10 دقائق.'), 11)]),
  ],
  insurance: [
    Q('Farida', '2026-10', D('Покрывает ли рабочая страховка мужа роды?', 'Does my husband’s work insurance cover childbirth?', 'هل يغطي تأمين عمل زوجي الولادة؟'), 9, [
      A('Zarina', '2026-10', D('Зависит от класса полиса. Посмотрите в приложении страховой раздел «Maternity» — у нас было покрыто 100%.', 'Depends on the policy class. Check the “Maternity” section in the insurer’s app — ours was covered 100%.', 'يعتمد على فئة الوثيقة. راجعي قسم «الأمومة» في تطبيق شركة التأمين، عندنا كانت مغطاة 100%.'), 13)]),
    E('Denis', '2026-09', D('Клиники принимают страховку по карточке в приложении — бумажная не нужна. Сохраните её в Wallet.', 'Clinics accept the insurance card from the app — no paper card needed. Save it to your Wallet.', 'العيادات تقبل بطاقة التأمين من التطبيق، لا حاجة للورقية. احفظها في المحفظة.'), 10),
  ],
  licence: [
    Q('Timur', '2026-09', D('Как поменять права на саудовские? Нужен ли экзамен?', 'How do I exchange my licence for a Saudi one? Is there a test?', 'كيف أستبدل رخصتي برخصة سعودية؟ هل يوجد اختبار؟'), 14, [
      A('Murad', '2026-09', D('Записывался через Absher в Dallah Driving School. Для моей страны был только практический тест, сдал с первого раза.', 'Booked via Absher at Dallah Driving School. For my country there was only a practical test, passed first time.', 'حجزت عبر أبشر في مدرسة دلة لتعليم القيادة. لبلدي كان اختبار عملي فقط ونجحت من أول مرة.'), 17),
      A('Timur', '2026-09', D('Сколько всё стоило?', 'How much was it in total?', 'كم كانت التكلفة الإجمالية؟'), 1, 'Murad'),
      A('Murad', '2026-09', D('Примерно 900 SAR вместе с медкомиссией.', 'About 900 SAR including the medical check.', 'حوالي 900 ر.س مع الفحص الطبي.'), 9, 'Timur')]),
  ],
  ejar: [
    E('Kamila', '2026-10', D('Обязательно просите договор через Ejar — без него не прописать семью в Absher. Агентство сделало за день.', 'Always ask for the contract through Ejar — without it you can’t add your family in Absher. The agency did it in a day.', 'اطلبوا العقد عبر منصة إيجار دائماً، بدونه لا تستطيع إضافة العائلة في أبشر. المكتب أنجزه في يوم.'), 21, [
      A('Hasan', '2026-10', D('А комиссию Ejar кто платит?', 'Who pays the Ejar fee?', 'من يدفع رسوم إيجار؟'), 2),
      A('Kamila', '2026-10', D('У нас поделили пополам с владельцем.', 'We split it half and half with the owner.', 'تقاسمناها مناصفة مع المالك.'), 4, 'Hasan')]),
    Q('Adel', '2026-11', D('Можно платить годовую аренду помесячно?', 'Can I pay a yearly lease monthly?', 'هل يمكن دفع الإيجار السنوي شهرياً؟'), 6, [
      A('Ibrahim', '2026-11', D('Обычно 2 или 4 платежа. Помесячно соглашаются редко, но через Nakhlio мне нашли такой вариант.', 'Usually 2 or 4 payments. Monthly is rare, but Nakhlio found me such an option.', 'عادة دفعتان أو أربع. الشهري نادر، لكن نخليو وجدوا لي خياراً كهذا.'), 8)]),
  ],
  travel: [
    E('Yusuf', '2026-10', D('Поезд Haramain Медина → Мекка 2 часа 20 минут. Билеты лучше брать в приложении за неделю, в выходные всё раскупают.', 'Haramain train Medina → Makkah takes 2 h 20 min. Buy tickets in the app a week ahead — weekends sell out.', 'قطار الحرمين من المدينة إلى مكة ساعتان و20 دقيقة. احجز من التطبيق قبل أسبوع، تنفد التذاكر في العطل.'), 26, [
      A('Siti', '2026-10', D('А в ихраме в поезде можно?', 'Can you be in ihram on the train?', 'هل يمكن لبس الإحرام في القطار؟'), 2),
      A('Yusuf', '2026-10', D('Да, многие так едут. Ихрам надеваешь заранее, намерение — у миката.', 'Yes, many people do. Put on ihram beforehand; make the intention at the miqat.', 'نعم، كثيرون يفعلون. البس الإحرام مسبقاً والنية عند الميقات.'), 7, 'Siti')]),
    Q('Denis', '2026-11', D('Как дешевле всего добраться из аэропорта в центр?', 'Cheapest way from the airport to the centre?', 'ما أرخص طريقة من المطار إلى المركز؟'), 5, [
      A('Abdullah', '2026-11', D('Автобус до Харама ходит каждые 30 минут, около 15 SAR. Такси через приложение — 60–80 SAR.', 'A bus to the Haram runs every 30 minutes, about 15 SAR. Ride-hailing app taxi — 60–80 SAR.', 'حافلة إلى الحرم كل 30 دقيقة بحوالي 15 ر.س. والتاكسي بالتطبيق 60–80 ر.س.'), 9)]),
  ],
  study: [
    Q('Abdurahman', '2026-10', D('Кто поступал в Islamic University? Сколько ждали ответа?', 'Who applied to the Islamic University? How long did you wait?', 'من التحق بالجامعة الإسلامية؟ كم انتظرتم الرد؟'), 9, [
      A('Yusuf', '2026-10', D('Подавал весной, ответ пришёл в июле. Главное — заранее перевести и заверить аттестат.', 'Applied in spring, answer came in July. The key is translating and certifying your diploma early.', 'قدّمت في الربيع وجاء الرد في يوليو. المهم ترجمة الشهادة وتوثيقها مبكراً.'), 14)]),
    E('Adel', '2026-09', D('Подготовительный год по арабскому очень сильный. Совет: сразу ищите разговорного напарника-араба.', 'The Arabic preparatory year is very strong. Tip: find an Arab speaking partner right away.', 'السنة التحضيرية للعربية قوية جداً. نصيحة: ابحث عن زميل عربي للمحادثة مباشرة.'), 12),
  ],
  places: [
    E('Gulnara', '2026-10', D('Халяльные русские и узбекские продукты (гречка, творог, сметана) — в маленьком магазине у рынка в Al Aziziyah.', 'Russian and Uzbek groceries (buckwheat, cottage cheese, sour cream) — in a small shop by the market in Al Aziziyah.', 'منتجات روسية وأوزبكية (حنطة سوداء وجبن قريش وقشطة) في محل صغير قرب السوق في Al Aziziyah.'), 29, [
      A('Leyla', '2026-10', D('А пельмени там есть?', 'Do they have pelmeni?', 'هل عندهم بيلميني؟'), 3),
      A('Gulnara', '2026-10', D('Есть замороженные, по средам привоз.', 'Frozen ones, delivered on Wednesdays.', 'نعم مجمّدة، وتصل يوم الأربعاء.'), 5, 'Leyla')]),
    E('Imran', '2026-11', D('Лучший карак-чай и парата — кафе у Quba Mosque, работает до полуночи.', 'Best karak tea and paratha — the café by Quba Mosque, open till midnight.', 'أحلى شاي كرك وبراتا في المقهى قرب مسجد قباء، يفتح حتى منتصف الليل.'), 17),
  ],
  doctors: [
    E('Leyla', '2026-09', D('Хороший педиатр, говорит по-английски, в частной клинике в Al Aziziyah. Запись через приложение, ждали 15 минут.', 'A good paediatrician who speaks English at a private clinic in Al Aziziyah. Booked in the app, waited 15 minutes.', 'طبيبة أطفال ممتازة تتحدث الإنجليزية في عيادة خاصة في Al Aziziyah. حجزت بالتطبيق وانتظرت 15 دقيقة.'), 27),
    Q('Ruslan', '2026-11', D('Посоветуйте стоматолога, который говорит по-русски.', 'Recommend a dentist who speaks Russian?', 'أريد طبيب أسنان يتحدث الروسية.'), 11, [
      A('Kamila', '2026-11', D('В центре есть стоматология, там врач из Дагестана. Напишу название лично.', 'There’s a dental clinic in the centre with a doctor from Dagestan. I’ll message you the name.', 'هناك عيادة أسنان في المركز فيها طبيب من داغستان، أرسل لك الاسم على الخاص.'), 6)]),
  ],
};
window.FAMILY = [
  Q('Fatima', '2026-11', D('Посоветуйте детский сад с английским языком недалеко от As Salam.', 'Recommend an English-speaking kindergarten near As Salam?', 'أريد حضانة تتحدث الإنجليزية قرب As Salam.'), 11, [
    A('Zainab', '2026-11', D('Мы ходим в частный сад в соседнем районе: группы по 12 детей, воспитатели говорят по-английски, есть автобус.', 'We go to a private kindergarten next district over: groups of 12, English-speaking teachers, there’s a bus.', 'نذهب إلى حضانة خاصة في الحي المجاور: 12 طفلاً في المجموعة ومعلمات بالإنجليزية وحافلة.'), 8),
    A('Fatima', '2026-11', D('Сколько стоит в месяц?', 'How much per month?', 'كم الرسوم الشهرية؟'), 1, 'Zainab'),
    A('Zainab', '2026-11', D('1 400 SAR с питанием.', '1,400 SAR with meals.', '1400 ر.س مع الوجبات.'), 4, 'Fatima')]),
  E('Aliya', '2026-10', D('Записали сына на плавание: 2 раза в неделю, тренер говорит по-английски, бассейн женский/детский в первой половине дня.', 'Signed our son up for swimming: twice a week, English-speaking coach, ladies/kids pool in the mornings.', 'سجّلنا ابننا في السباحة مرتين أسبوعياً، المدرب يتحدث الإنجليزية، والمسبح للنساء والأطفال صباحاً.'), 6),
  Q('Denis', '2026-11', D('Какие международные школы есть в Медине и сколько стоят?', 'Which international schools are there in Medina and how much are they?', 'ما المدارس العالمية في المدينة وكم رسومها؟'), 13, [
    A('Kamila', '2026-11', D('Мы смотрели 3 школы с британской программой — от 18 000 до 30 000 SAR в год. Записываться лучше весной.', 'We looked at 3 schools with a British curriculum — 18,000 to 30,000 SAR a year. Better to apply in spring.', 'زرنا 3 مدارس بمنهج بريطاني، من 18000 إلى 30000 ر.س سنوياً. التسجيل الأفضل في الربيع.'), 10)]),
];

/* ---------- spaces ---------- */
const M = (who, text, to) => ({ who, text, to });
window.MEN_ROOMS = [
  { id: 'sport', icon: 'ball', n: 214, name: D('Спорт', 'Sport', 'الرياضة'), msgs: [
    M('Yusuf', D('Кто в субботу на футбол? Нужно ещё 4 человека.', 'Who’s up for football on Saturday? We need 4 more.', 'مين معنا كورة السبت؟ نحتاج 4 لاعبين.')),
    M('Imran', D('Я в деле, возьму брата.', 'I’m in, I’ll bring my brother.', 'أنا معكم وأجيب أخوي.'), 'Yusuf'),
    M('Murad', D('Во сколько и где? Если в 20:00 у Al Aziziyah — приду.', 'What time and where? If 20:00 near Al Aziziyah — I’ll come.', 'متى ووين؟ إذا الساعة 8 قرب Al Aziziyah أحضر.')),
    M('Yusuf', D('Да, 20:00, поле у школы. Создал встречу во вкладке «Встречи».', 'Yes, 20:00, the pitch by the school. I created a meetup in the “Meetups” tab.', 'نعم الساعة 8 في ملعب المدرسة، أنشأت لقاءً في تبويب «اللقاءات».'), 'Murad') ] },
  { id: 'trips', icon: 'tent', n: 168, name: D('Выезды и поездки', 'Trips & outings', 'الرحلات والطلعات'), msgs: [
    M('Ruslan', D('Едем в AlUla на выходные, на машине есть 2 места.', 'Driving to AlUla for the weekend, 2 seats left in the car.', 'رايحين AlUla نهاية الأسبوع وباقي مقعدان بالسيارة.')),
    M('Adel', D('Сколько скинуться на бензин?', 'How much to chip in for fuel?', 'كم المشاركة في البنزين؟'), 'Ruslan'),
    M('Ruslan', D('По 80 SAR с человека, ночёвка в кемпе отдельно.', '80 SAR each; the camp overnight is separate.', '80 ر.س لكل شخص، والمبيت في المخيم منفصل.'), 'Adel'),
    M('Bilal', D('Был там в прошлом месяце — берите тёплые вещи, ночью +10.', 'Was there last month — take warm clothes, it’s +10 at night.', 'كنت هناك الشهر الماضي، خذوا ملابس دافئة، الليل 10 درجات.')) ] },
  { id: 'cars', icon: 'car', n: 97, name: D('Машины', 'Cars', 'السيارات'), msgs: [
    M('Timur', D('Где недорого поменять масло?', 'Where can I change the oil cheaply?', 'وين أغير الزيت بسعر مناسب؟')),
    M('Usman', D('Станция у Sultanah, 90 SAR с фильтром.', 'The station near Sultanah, 90 SAR with the filter.', 'المحطة قرب Sultanah بـ 90 ر.س مع الفلتر.'), 'Timur'),
    M('Daniyar', D('Подтверждаю, быстро и без очереди утром.', 'Confirm — quick, no queue in the morning.', 'أؤكد، سريع وبدون زحمة الصباح.')) ] },
  { id: 'talk', icon: 'chat', n: 305, name: D('Общение', 'Chat', 'سوالف'), msgs: [
    M('Saeed', D('Братья, где лучший карак-чай в городе?', 'Brothers, where’s the best karak tea in town?', 'يا شباب، وين أحلى شاي كرك في المدينة؟')),
    M('Imran', D('У Quba, без вариантов ☕', 'By Quba, no contest ☕', 'عند قباء بدون نقاش ☕'), 'Saeed'),
    M('Hasan', D('Поддерживаю, плюс там парата горячая всегда.', 'Agreed, and the paratha there is always hot.', 'أؤيد، والبراتا هناك دائماً ساخنة.')) ] },
];
window.MEN_EVENTS = [
  { id: 'ev1', title: D('Футбол 7×7', 'Football 7-a-side', 'كرة قدم 7×7'), when: D('Суббота, 20:00', 'Saturday, 20:00', 'السبت، 8:00 م'), where: 'School pitch, Al Aziziyah', going: 10, need: 14, org: 'Yusuf',
    comments: [M('Murad', D('Беру мяч и манишки.', 'I’ll bring the ball and bibs.', 'أجيب الكورة والصدريات.')), M('Imran', D('Нас двое, отметился.', 'Two of us, marked.', 'نحن اثنان، سجّلت.'))] },
  { id: 'ev2', title: D('Поездка в AlUla', 'Trip to AlUla', 'رحلة إلى العلا'), when: D('Пятница, 06:00', 'Friday, 06:00', 'الجمعة، 6:00 ص'), where: 'Meet at Quba Mosque', going: 5, need: 7, org: 'Ruslan',
    comments: [M('Bilal', D('Можно с сыном 14 лет?', 'Can I bring my 14-year-old son?', 'ممكن أجيب ابني عمره 14؟')), M('Ruslan', D('Конечно, место есть.', 'Of course, there’s room.', 'أكيد، يوجد مكان.'), 'Bilal')] },
  { id: 'ev3', title: D('Утренняя пробежка 5 км', 'Morning run, 5 km', 'جري صباحي 5 كم'), when: D('Вторник, 06:15', 'Tuesday, 06:15', 'الثلاثاء، 6:15 ص'), where: 'King Fahd Park', going: 6, need: 15, org: 'Daniyar',
    comments: [M('Timur', D('После фаджра самое то, буду.', 'Perfect after Fajr, I’ll be there.', 'بعد الفجر أفضل وقت، سأحضر.'))] },
];
window.WOMEN_ROOMS = [
  { id: 'kids', icon: 'family', n: 188, name: D('Дети и здоровье', 'Kids & health', 'الأطفال والصحة'), msgs: [
    M('Aliya', D('Девочки, какие прививки делают в 1 год?', 'Ladies, which vaccines are given at age 1?', 'يا بنات، ما التطعيمات في عمر سنة؟')),
    M('Zarina', D('Мы делали в поликлинике по графику из приложения Sehhaty, там всё расписано.', 'We did them at the clinic following the schedule in the Sehhaty app — it’s all listed there.', 'سوّيناها في المركز الصحي حسب الجدول في تطبيق صحتي، كله مكتوب هناك.'), 'Aliya'),
    M('Kamila', D('И запись там же, без очереди.', 'And you book there too, no queue.', 'والحجز من نفس التطبيق بدون انتظار.')) ] },
  { id: 'cook', icon: 'cake', n: 143, name: D('Кухня и рецепты', 'Cooking & recipes', 'الطبخ والوصفات'), msgs: [
    M('Leyla', D('Где купить хорошую гречку?', 'Where can I buy good buckwheat?', 'من وين أشتري حنطة سوداء جيدة؟')),
    M('Gulnara', D('В магазине у рынка в Al Aziziyah, я там всегда беру.', 'In the shop by the market in Al Aziziyah, I always buy there.', 'من المحل قرب السوق في Al Aziziyah، دائماً أشتري منه.'), 'Leyla'),
    M('Sana', D('А кто знает, где купить настоящий басмати оптом?', 'Does anyone know where to buy real basmati in bulk?', 'أحد يعرف وين أشتري أرز بسمتي أصلي بالجملة؟')),
    M('Amina', D('В оптовом на выезде к Tabuk road, мешок 10 кг дешевле.', 'At the wholesale store on the way to Tabuk road, a 10 kg bag is cheaper.', 'في محل الجملة على طريق تبوك، كيس 10 كجم أرخص.'), 'Sana') ] },
  { id: 'shop', icon: 'tag', n: 121, name: D('Покупки', 'Shopping', 'التسوق'), msgs: [
    M('Farida', D('На старом рынке скидки на ткани до конца недели!', 'Fabric sale at the old market until the end of the week!', 'تخفيضات أقمشة في السوق القديم حتى نهاية الأسبوع!')),
    M('Nur', D('Спасибо! Абайи там тоже есть?', 'Thanks! Do they have abayas too?', 'شكراً! هل توجد عبايات أيضاً؟'), 'Farida'),
    M('Farida', D('Да, целый ряд, цены от 80 SAR.', 'Yes, a whole row, prices from 80 SAR.', 'نعم صف كامل، الأسعار من 80 ر.س.'), 'Nur') ] },
];
window.WOMEN_EVENTS = [
  { id: 'ew1', title: D('Кулинарная встреча: выпечка', 'Cooking meetup: baking', 'لقاء طبخ: المخبوزات'), when: D('Четверг, 17:00', 'Thursday, 17:00', 'الخميس، 5:00 م'), where: 'As Salam', going: 8, need: 12, org: 'Amina',
    comments: [M('Leyla', D('Что взять с собой?', 'What should I bring?', 'ماذا أحضر معي؟')), M('Amina', D('Только фартук, продукты мои 🙂', 'Just an apron, I’ll provide the ingredients 🙂', 'مريلة فقط، والمكونات عليّ 🙂'), 'Leyla')] },
  { id: 'ew2', title: D('Прогулка с детьми в парке', 'Park walk with kids', 'نزهة مع الأطفال في الحديقة'), when: D('Суббота, 16:30', 'Saturday, 16:30', 'السبت، 4:30 م'), where: 'King Fahd Park', going: 14, need: 30, org: 'Aliya',
    comments: [M('Kamila', D('Будем с двумя детьми, возьму пледы.', 'Coming with two kids, I’ll bring blankets.', 'سنحضر مع طفلين، وسأجيب بطانيات.'))] },
  { id: 'ew3', title: D('Тафсир для сестёр', 'Tafsir circle for sisters', 'حلقة تفسير للأخوات'), when: D('Понедельник, 19:30', 'Monday, 19:30', 'الاثنين، 7:30 م'), where: 'Online', going: 22, need: 40, org: 'Zaynab',
    comments: [M('Nur', D('Будет запись для тех, кто не успеет?', 'Will there be a recording for those who miss it?', 'هل يوجد تسجيل لمن يفوتها؟')), M('Zaynab', D('Да, в этой же встрече.', 'Yes, in this same meetup.', 'نعم، في نفس اللقاء.'), 'Nur')] },
];

window.PERSON_REPLY = D('Ва алейкум ассалам! Да, конечно. Давайте договоримся, когда вам удобно?', 'Wa alaikum assalam! Yes, of course. Let’s arrange it — when suits you?', 'وعليكم السلام! نعم بالتأكيد، متى يناسبك نتفق؟');
})();

/* ---------- public profiles of community members ---------- */
(function () {
const D = (ru, en, ar) => ({ ru, en, ar });
window.ABOUT = {
  'Amina': { job: D('Домашний кондитер', 'Home baker', 'صانعة حلويات منزلية'), about: D('Из Казани, в Медине 4 года с мужем и тремя детьми. Пеку на заказ и веду кулинарные встречи для сестёр.', 'From Kazan, in Medina for 4 years with my husband and three kids. I bake to order and host cooking meetups for sisters.', 'من قازان، أعيش في المدينة منذ 4 سنوات مع زوجي وأطفالي الثلاثة. أخبز حسب الطلب وأنظم لقاءات طبخ للأخوات.') },
  'Gulnara': { job: D('Домашняя кухня', 'Home cooking', 'طبخ منزلي'), about: D('Из Ташкента. Готовлю узбекскую еду по маминым рецептам.', 'From Tashkent. I cook Uzbek food from my mother’s recipes.', 'من طشقند، أطبخ الأكل الأوزبكي على وصفات أمي.') },
  'Sana': { job: D('Пакистанская кухня', 'Pakistani cooking', 'مطبخ باكستاني'), about: D('Из Лахора, готовлю для семейных встреч и праздников.', 'From Lahore, I cook for family gatherings and celebrations.', 'من لاهور، أطبخ للمناسبات العائلية والاحتفالات.') },
  'Usman': { job: D('Электрик, 12 лет опыта', 'Electrician, 12 years’ experience', 'كهربائي، خبرة 12 سنة'), about: D('Работаю по всей Медине. Розетки, свет, водонагреватели и кондиционеры. Даю гарантию на работу 3 месяца.', 'I work all over Medina: sockets, lights, water heaters and AC. 3-month guarantee on my work.', 'أعمل في كل المدينة: أفياش وإنارة وسخانات ومكيفات. ضمان 3 أشهر على العمل.') },
  'Timur': { job: D('Переезды и грузоперевозки', 'Moving and transport', 'نقل عفش'), about: D('Есть закрытая машина и двое помощников. Перевозим аккуратно, собираем мебель.', 'I have a closed van and two helpers. We move carefully and assemble furniture.', 'عندي سيارة مغلقة ومساعدان، ننقل بعناية ونركّب الأثاث.') },
  'Ustaz Khalid': { job: D('Преподаватель арабского', 'Arabic teacher', 'معلم لغة عربية'), about: D('Выпускник Islamic University of Madinah. 8 лет преподаю арабский иностранцам, говорю по-английски и по-русски.', 'Islamic University of Madinah graduate. 8 years teaching Arabic to foreigners; I speak English and Russian.', 'خريج الجامعة الإسلامية بالمدينة، أدرّس العربية لغير الناطقين بها منذ 8 سنوات وأتحدث الإنجليزية والروسية.') },
  'Zarina': { job: D('Переводчик RU · AR · EN', 'Interpreter RU · AR · EN', 'مترجمة روسي · عربي · إنجليزي'), about: D('Живу в Медине 9 лет. Сопровождаю к врачам, в банки и госучреждения.', 'I’ve lived in Medina for 9 years. I accompany people to doctors, banks and government offices.', 'أعيش في المدينة منذ 9 سنوات، أرافق الناس إلى الأطباء والبنوك والدوائر الحكومية.') },
  'Abdullah': { job: D('Водитель, трансферы', 'Driver, transfers', 'سائق وتوصيل'), about: D('Встречаю гостей в аэропорту и вожу на зиярат. Машина на 6 мест.', 'I meet guests at the airport and drive them on Ziyarah. 6-seat car.', 'أستقبل الضيوف في المطار وأوصلهم للزيارة. سيارة 6 مقاعد.') },
  'Yusuf': { job: D('Студент Islamic University, гид', 'Islamic University student, guide', 'طالب في الجامعة الإسلامية ومرشد'), about: D('Провожу экскурсии по истории Медины и организую футбол по субботам.', 'I run history tours of Medina and organise football on Saturdays.', 'أنظم جولات تاريخية في المدينة وكرة قدم كل سبت.') },
  'Muhammad': { job: D('Сопровождение пожилых', 'Elderly companion', 'مرافق لكبار السن'), about: D('Помогаю пожилым паломникам, есть кресло-коляска.', 'I help elderly pilgrims; I have a wheelchair.', 'أساعد الزوار كبار السن، ولدي كرسي متحرك.') },
  'Ruslan': { job: D('IT-специалист', 'IT specialist', 'مختص تقنية'), about: D('Работаю удалённо, люблю поездки по Саудии. Часто организую выезды в AlUla.', 'I work remotely and love trips around Saudi. I often organise outings to AlUla.', 'أعمل عن بعد وأحب الرحلات في المملكة، أنظم طلعات إلى العلا كثيراً.') },
  'Ibrahim': { job: D('Инженер', 'Engineer', 'مهندس'), about: D('Переезжаю в Jeddah, распродаю мебель.', 'Moving to Jeddah, selling my furniture.', 'منتقل إلى جدة وأبيع أثاثي.') },
};
const R = (who, stars, text) => ({ who, stars, text });
window.PREVIEWS = {
  'Amina': [R('Leyla', 5, D('Торт был просто сказка, дети в восторге!', 'The cake was a dream, the kids loved it!', 'الكيك كان رائعاً والأطفال انبسطوا!')), R('Fatima', 5, D('Всё вовремя и очень вкусно.', 'On time and delicious.', 'في الوقت ولذيذ جداً.'))],
  'Usman': [R('Kamila', 5, D('Аккуратно, быстро, убрал за собой.', 'Neat, fast, cleaned up after himself.', 'مرتب وسريع ونظّف بعده.')), R('Denis', 5, D('Приехал в тот же день, цена как договорились.', 'Came the same day, price as agreed.', 'حضر في نفس اليوم والسعر كما اتفقنا.'))],
  'Timur': [R('Olga', 5, D('Перевезли без единой царапины.', 'Moved everything without a scratch.', 'نقلوا كل شيء بدون خدش.'))],
  'Ustaz Khalid': [R('Ruslan', 5, D('Лучший преподаватель, объясняет просто.', 'The best teacher, explains things simply.', 'أفضل معلم، يشرح ببساطة.'))],
  'Zarina': [R('Leyla', 5, D('Очень спокойная и внимательная.', 'Very calm and attentive.', 'هادئة جداً ومهتمة.'))],
  'Gulnara': [R('Daniyar', 5, D('Манты как дома!', 'Manti just like home!', 'مانتي مثل البيت!'))],
};
})();
