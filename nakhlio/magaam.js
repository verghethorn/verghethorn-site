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
  explore: D('Поиск', 'Explore', 'استكشاف'),
  city: D('Город', 'City', 'المدينة'),
  contacts: D('Контакты', 'Contacts', 'جهات الاتصال'),
  me_t: D('Я', 'Me', 'أنا'),
  new_friends: D('Новые друзья', 'New friends', 'أصدقاء جدد'),
  my_moments: D('Мои моменты', 'My moments', 'لحظاتي'),
  friends_tab: D('Друзья', 'Friends', 'الأصدقاء'),
  no_friends_m: D('У друзей пока нет моментов. Загляните в «Город».', 'Your friends have no moments yet. Look at “City”.', 'لا لحظات لأصدقائك بعد. انظر إلى «المدينة».'),
  rules_mg: D('Правила Magaam', 'Magaam rules', 'قواعد Magaam'),
  no_contacts: D('Пока нет друзей. Позовите их по своей ссылке — они сразу появятся здесь.', 'No friends yet. Invite them with your link — they will appear here right away.', 'لا أصدقاء بعد. ادعهم برابطك — سيظهرون هنا فوراً.'),
  moment_new: D('Момент', 'Moment', 'لحظة'),
  moments: D('Моменты', 'Moments', 'اللحظات'),
  invite_s: D('Позвать', 'Invite', 'ادعُ'),
  find_people: D('Найти людей', 'Find people', 'ابحث عن أشخاص'),
  people_empty: D('Здесь будут ваши люди. Позовите друзей — по вашей ссылке они сразу станут друзьями.', 'Your people will be here. Invite friends — with your link they become friends right away.', 'هنا سيكون أشخاصك. ادعُ أصدقاءك — عبر رابطك يصبحون أصدقاء فوراً.'),
  city_empty: D('Пока тихо. Поделитесь первым моментом.', 'Quiet for now. Share the first moment.', 'هادئ الآن. شارك أول لحظة.'),
  share_profile: D('Поделиться', 'Share profile', 'مشاركة الملف'),
  settings: D('Настройки', 'Settings', 'الإعدادات'),
  more_l: D('Ещё', 'More', 'المزيد'),
  writes_in: D('Пишет на:', 'Writes in', 'يكتب بـ'),
  tr_for_you: D('вам переводится', 'translated for you', 'مترجم لك'),
  tr_from: D('Перевод', 'Translated', 'مترجم'),
  edit_l: D('Редактировать', 'Edit profile', 'تعديل الملف'),
  original: D('оригинал', 'original', 'الأصل'),
  show_tr: D('Показать перевод', 'Show translation', 'عرض الترجمة'),
  no_reels: D('Пока нет рилс', 'No reels yet', 'لا ريلز بعد'),
  unread: D('Непрочитанные', 'Unread', 'غير المقروءة'),
  no_unread: D('Всё прочитано', 'All caught up', 'لا رسائل غير مقروءة'),
  pin: D('Закрепить', 'Pin', 'تثبيت'),
  unpin: D('Открепить', 'Unpin', 'إلغاء التثبيت'),
  all_comments: D('Комментарии', 'Comments', 'التعليقات'),
  msg_ph_tr: D('Пишите на своём — {n} поймёт', 'Write in your language — {n} will understand', 'اكتب بلغتك — {n} سيفهم'),
  no_barrier: D('Без языкового барьера: каждый пишет на своём языке и читает на своём.', 'No language barrier: everyone writes in their language and reads in theirs.', 'بلا حاجز لغوي: كلٌّ يكتب بلغته ويقرأ بلغته.'),
  people_s: D('Люди', 'People', 'أشخاص'),
  all_posts: D('Все публикации', 'All posts', 'كل المنشورات'),
  more: D('Показать ещё', 'Show more', 'عرض المزيد'),
  nobody: D('Никого не нашли', 'Nobody found', 'لم نجد أحداً'),
  attach_media: D('Фото или видео', 'Photo or video', 'صورة أو فيديو'),
  take_photo: D('Сделать фото', 'Take a photo', 'التقاط صورة'),
  voice: D('Голосовое', 'Voice message', 'رسالة صوتية'),
  rec_hint: D('Идёт запись… Нажмите «Отправить» или ✕', 'Recording… Tap Send or ✕', 'جارٍ التسجيل… اضغط «إرسال» أو ✕'),
  mic_denied: D('Нет доступа к микрофону. Разрешите его в настройках телефона.', 'No microphone access. Allow it in your phone settings.', 'لا يوجد إذن للميكروفون. اسمح به في إعدادات الهاتف.'),
  sending: D('Отправляем…', 'Sending…', 'جارٍ الإرسال…'),
  send_l: D('Отправить', 'Send', 'إرسال'),
  from_contacts: D('Пригласить из контактов', 'Invite from contacts', 'ادعُ من جهات الاتصال'),
  mg_users_n: D('Пользователей в Magaam', 'Magaam users', 'مستخدمو Magaam'),
  new7_n: D('новых за 7 дней', 'new in 7 days', 'جدد خلال 7 أيام'),
  inst_t: D('Установите Magaam на телефон', 'Install Magaam on your phone', 'ثبّت Magaam على هاتفك'),
  inst_d: D('Так Magaam откроется как обычное приложение, и вам будут приходить уведомления о сообщениях.', 'Magaam will open like a normal app and you will get message notifications.', 'سيفتح Magaam كتطبيق عادي وستصلك إشعارات الرسائل.'),
  inst_1: D('Нажмите кнопку «Поделиться» внизу экрана', 'Tap the Share button at the bottom of the screen', 'اضغط زر «مشاركة» أسفل الشاشة'),
  inst_2: D('Выберите «На экран Домой»', 'Choose “Add to Home Screen”', 'اختر «إضافة إلى الشاشة الرئيسية»'),
  inst_3: D('Откройте Magaam с экрана «Домой» и зарегистрируйтесь', 'Open Magaam from your Home Screen and sign up', 'افتح Magaam من الشاشة الرئيسية وسجّل'),
  inst_safari: D('Нет такой кнопки? Откройте ссылку в Safari: нажмите ⋯ или значок компаса и выберите «Открыть в Safari».', 'No such button? Open the link in Safari: tap ⋯ or the compass icon and choose “Open in Safari”.', 'لا يوجد هذا الزر؟ افتح الرابط في Safari: اضغط ⋯ أو أيقونة البوصلة واختر «فتح في Safari».'),
  inst_btn: D('Установить', 'Install', 'تثبيت'),
  inst_skip: D('Продолжить в браузере', 'Continue in the browser', 'المتابعة في المتصفح'),
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
  goods_h: D("Товары", "Goods", "المنتجات"),
  services_h: D("Услуги", "Services", "الخدمات"),
  everywhere: D("Все страны", "All countries", "كل الدول"),
  choose_country: D("Выберите страну", "Choose a country", "اختر الدولة"),
  choose_city: D("Выберите город", "Choose a city", "اختر المدينة"),
  search_country: D("Поиск страны", "Search for a country", "ابحث عن دولة"),
  all_country: D("Вся страна", "Whole country", "كل الدولة"),
  other_city: D("Другой город", "Another city", "مدينة أخرى"),
  city_l: D("Город", "City", "المدينة"),
  city_ph: D("Напишите название города", "Type the city name", "اكتب اسم المدينة"),
  location: D("Где вы находитесь", "Where you are", "موقعك"),
  my_place: D("Страна и город", "Country & city", "الدولة والمدينة"),
  loc_need: D("Укажите страну и город.", "Choose your country and city.", "اختر الدولة والمدينة."),
  sub_l: D("Направление", "Speciality", "التخصص"),
  sub_other: D("Своё направление", "My own speciality", "تخصص آخر"),
  sub_other_ph: D("Например: свечи ручной работы", "For example: handmade candles", "مثلاً: شموع يدوية"),
  all_l: D("Все", "All", "الكل"),
  no_products_here: D("Здесь пока нет товаров. Попробуйте другую страну или категорию.", "No items here yet. Try another country or category.", "لا منتجات هنا بعد. جرّب دولة أو قسماً آخر."),
  h_title: D("Ваш Magaam ID", "Your Magaam ID", "معرّف Magaam الخاص بك"),
  h_once: D("Magaam ID задаётся один раз и потом не меняется. По нему вас найдут покупатели и друзья.", "Your Magaam ID is set once and can’t be changed later. Buyers and friends will find you by it.", "يُختار المعرّف مرة واحدة ولا يمكن تغييره لاحقاً. سيجدك به المشترون والأصدقاء."),
  h_rules: D("От 3 до 24 знаков: латинские буквы, цифры, _ и точка. Начинается с буквы.", "3–24 characters: Latin letters, digits, _ and dot. Starts with a letter.", "من 3 إلى 24 حرفاً: حروف لاتينية وأرقام و _ والنقطة، ويبدأ بحرف."),
  h_free: D("свободен", "available", "متاح"),
  h_taken: D("Этот ID уже занят", "This ID is already taken", "هذا المعرّف مستخدم"),
  h_save: D("Установить ID", "Set ID", "تعيين المعرّف"),
  h_confirm: D("Установить {h}? Изменить потом будет нельзя.", "Set {h}? You won’t be able to change it later.", "تعيين {h}؟ لن تتمكن من تغييره لاحقاً."),
  h_locked: D("Magaam ID закреплён за вами навсегда.", "This Magaam ID is yours for good.", "هذا المعرّف لك بشكل دائم."),
  h_copy: D("Скопировать ID и ссылку", "Copy ID and link", "نسخ المعرّف والرابط"),
  h_not_set: D("не задан", "not set", "غير محدد"),
  h_set: D("Указать", "Set", "تحديد"),
  showcase: D("Витрина", "Showcase", "المعرض"),
  catalog: D("Каталог", "Catalog", "الأقسام"),
  sell: D("Продать", "Sell", "بيع"),
  price_ask: D("Цена договорная", "Price on request", "السعر عند الطلب"),
  sold: D("Продано", "Sold", "تم البيع"),
  no_products: D("Товаров пока нет", "No items yet", "لا منتجات بعد"),
  search_market: D("Товар, услуга или магазин", "Item, service or shop", "منتج أو خدمة أو متجر"),
  shops: D("Магазины", "Shops", "المتاجر"),
  open_shop: D("Открыть магазин", "Open a shop", "افتح متجرك"),
  open_shop_d: D("Бесплатно. Выкладывайте товары и услуги — покупатели напишут вам сами.", "Free. Post your items and services — buyers will message you.", "مجاناً. اعرض منتجاتك وخدماتك وسيراسلك المشترون."),
  new_items: D("Новое", "New", "الجديد"),
  items: D("Товары и услуги", "Items & services", "المنتجات والخدمات"),
  to_shop: D("В магазин", "Visit shop", "زيارة المتجر"),
  safe_deal: D("Договаривайтесь в чате. Не переводите предоплату незнакомым.", "Agree in the chat. Don’t send prepayments to strangers.", "اتفقوا في المحادثة. لا ترسل دفعة مقدمة لغرباء."),
  more_from_shop: D("Ещё в этом магазине", "More from this shop", "المزيد من هذا المتجر"),
  edit_item: D("Изменить", "Edit", "تعديل"),
  back_on_sale: D("Снова в продаже", "Back on sale", "إعادة للبيع"),
  mark_sold: D("Отметить «Продано»", "Mark as sold", "تحديد كمباع"),
  ask_seller: D("Написать продавцу", "Message the seller", "راسل البائع"),
  add_item: D("Добавить товар", "Add an item", "أضف منتجاً"),
  edit_shop: D("Изменить магазин", "Edit shop", "تعديل المتجر"),
  items_n: D("товаров", "items", "منتجات"),
  first_item: D("Добавьте первый товар — его увидят все.", "Add your first item — everyone will see it.", "أضف أول منتج وسيراه الجميع."),
  favs: D("Избранное", "Favourites", "المفضلة"),
  no_favs: D("Нажмите ♡ на товаре — он появится здесь.", "Tap ♡ on an item and it will appear here.", "اضغط ♡ على منتج ليظهر هنا."),
  my_shop: D("Мой магазин", "My shop", "متجري"),
  shop_photo: D("Фото или логотип", "Photo or logo", "صورة أو شعار"),
  shop_name: D("Название магазина", "Shop name", "اسم المتجر"),
  shop_name_ph: D("Например: Сладости от Амины", "For example: Amina’s sweets", "مثلاً: حلويات أمينة"),
  shop_cat: D("Категория", "Category", "القسم"),
  shop_about: D("О магазине", "About the shop", "عن المتجر"),
  shop_about_ph: D("Что вы продаёте, район, доставка, часы работы", "What you sell, area, delivery, opening hours", "ماذا تبيع، الحي، التوصيل، ساعات العمل"),
  save_l: D("Сохранить", "Save", "حفظ"),
  shop_need: D("Укажите название и категорию.", "Enter a name and choose a category.", "أدخل الاسم واختر القسم."),
  shop_ready: D("Магазин открыт!", "Your shop is open!", "تم فتح متجرك!"),
  item_title: D("Название", "Title", "العنوان"),
  item_title_ph: D("Например: Абая чёрная, размер M", "For example: Black abaya, size M", "مثلاً: عباية سوداء، مقاس M"),
  item_price: D("Цена", "Price", "السعر"),
  price_hint: D("Оставьте пустым — будет «Цена договорная».", "Leave empty for “Price on request”.", "اتركه فارغاً ليظهر «السعر عند الطلب»."),
  item_desc: D("Описание", "Description", "الوصف"),
  item_desc_ph: D("Размер, цвет, состояние, доставка…", "Size, colour, condition, delivery…", "المقاس، اللون، الحالة، التوصيل…"),
  publish_item: D("Опубликовать", "Publish", "نشر"),
  item_need: D("Напишите название товара.", "Enter the item title.", "اكتب عنوان المنتج."),
  photo_need: D("Добавьте хотя бы одно фото.", "Add at least one photo.", "أضف صورة واحدة على الأقل."),
  saved: D("Сохранено", "Saved", "تم الحفظ"),
  published_item: D("Товар опубликован", "Item published", "تم نشر المنتج"),
  share_shop_t: D("Загляните в магазин «{n}» в Magaam:", "Take a look at the “{n}” shop on Magaam:", "ألقِ نظرة على متجر «{n}» في Magaam:"),
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

const ROOTS = ['mg', 'mgchats', 'mgcontacts', 'mgme'];
const top = (title, on) => { const live = !!window.LIVE; const root = !live || ROOTS.includes(on);
  const lead = !root ? `<button class="mgic" data-act="mgback" aria-label="${t('back')}">${ic('back', 'flip')}</button>` : '';
  return `<header class="mgtop">${lead}<div class="mgbrand">${title ? `<b>${title}</b>` : '<img class="mgwm" src="img/mgapp/wordmark-dark.png" alt="MAGAAM">'}</div><div class="mgtopr">${live && root && on === 'mgchats' ? `<button class="mgic" data-act="mgplusmenu" aria-label="${M('create')}">${ic('plus')}</button>` : ''}</div></header>`; };
const nav = (on) => window.LIVE ? `<nav class="mgnav mgnav5 m8nav">${[['mgchats', 'chat', 'chats', window.__mgUnread], ['mgcontacts', 'users', 'contacts', window.__mgReq], ['mgme', 'user', 'me_t', 0]].map(([v, i2, k, n]) => `<button class="${on === v || (v === 'mgchats' && on === 'mg') || (v === 'mgme' && on === 'mgmine') ? 'on' : ''}" data-act="mggo" data-v="${v}">${ic(i2)}${n ? `<em class="mgtabn num">${n > 99 ? '99+' : n}</em>` : ''}<span>${M(k)}</span></button>`).join('')}</nav>` : _navOld(on);
const _navOld = (on) => `<nav class="mgnav">${[['mg', 'home', 'feed'], window.LIVE ? ['mgexplore', 'search', 'explore'] : ['mgreels', 'play', 'reels'], ['mgnew', 'plus', 'create'], window.LIVE ? ['mgchats', 'chat', 'chats'] : ['mgfriends', 'users', 'friends'], ['mgme', 'user', null]].map(([v, i, k]) =>
  v === 'mgnew' ? `<button class="mgplus" data-act="mgnew" aria-label="${M('create')}">${ic('plus')}</button>`
  : `<button class="${on === v || (v === 'mgchats' && on === 'mgfriends') ? 'on' : ''}" data-act="mggo" data-v="${v}">${v === 'mgme' && NK.S.me ? (window.__mgMeAv ? window.__mgMeAv() : mgAv('@me', 'xs')) : ic(i)}${v === 'mgchats' && window.__mgUnread ? `<em class="mgbadge num">${window.__mgUnread > 99 ? '99+' : window.__mgUnread}</em>` : ''}<span>${k ? M(k) : t('profile_l')}</span></button>`).join('')}</nav>`;
function rulesModal() {
  const g = st(); if (g.rulesOk || document.querySelector('.tmodal')) return;
  const host = document.querySelector('.app') || document.body; const w = document.createElement('div'); w.className = 'tmodal';
  w.innerHTML = `<div class="tbox mgrbox" role="dialog" aria-modal="true">${mgLogo('big')}<h3>${M('r_t')}</h3><p>${M('r_intro')}</p><ul>${['r1', 'r2', 'r3', 'r4'].map(k => `<li>${M(k)}</li>`).join('')}</ul><button class="btn primary full mgbtn">${M('r_ok')}</button></div>`;
  w.querySelector('button').onclick = () => { g.rulesOk = true; save(); w.remove(); };
  host.appendChild(w);
}
const wrapView = (on, body, title) => (setTimeout(rulesModal, 60), { html: `<div class="mg">${top(title, on)}${body}</div>${nav(on)}` });
const mobileOnly = () => ({ html: `<div class="mg">${top()}<div class="mgwrap" style="text-align:center;padding-top:40px">${mgLogo('big')}<h2 style="margin:14px 0 6px"><img class="mgwm" src="img/mgapp/wordmark-dark.png" alt="MAGAAM"></h2><p class="note">${esc(L(FX.mg_mobile))}</p></div></div>` });
const lock = () => ({ html: `<div class="mg">${top()}<div class="mgwrap" style="text-align:center;padding-top:40px">${mgLogo('big')}<h2 style="margin:14px 0 6px"><img class="mgwm" src="img/mgapp/wordmark-dark.png" alt="MAGAAM"></h2><p class="note">${M('tag')}</p><p class="note">${t('spaces_guest')}</p><button class="btn primary full mgbtn" data-act="startreg" style="margin-top:16px">${t('create_profile')}</button></div></div>` });

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
    case 'mggo': if (NK.stack.length && NK.stack[NK.stack.length - 1].v === v) return true; if (ROOTS.includes(v)) { NK.stack.length = 1; NK.stack[0] = { v }; } else NK.stack.push({ v }); render(true); return true;
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
  const ORIG = {};
  const langName = (c) => ((window.LANGS || []).find(l => l.code === c) || {}).name || c;
  const trText = (key, text, from) => { if (!text || !from || from === NK.lang) return text; if (TRC[key]) return TRC[key].tr && ORIG[key] ? text : TRC[key].t; TRC[key] = { t: text, from }; LV.translate(text, from, NK.lang).then(r => { if (r && r !== text) { TRC[key] = { t: r, tr: true, from }; if (cur().v === 'mgchat' && document.getElementById('mgthread')) paintThread(); else render(); } }); return text; };
  const trBadge = (key) => TRC[key] && TRC[key].tr ? `<button class="mgtrp" data-act="mgorig" data-v="${key}">${small('translate')}${ORIG[key] ? M('show_tr') : `${M('tr_from')} · ${esc(langName(TRC[key].from))}`}<em>${ORIG[key] ? '' : ' · ' + M('original')}</em></button>` : '';
  const ago = (d) => { const h = Math.max(0, Math.round((Date.now() - new Date(d)) / 36e5)); return agoTxt(h); };
  const ready = () => { if (!NK.isPhone()) return mobileOnly(); if (window.MG_APP && !NK.isStandalone()) return installGate(); if (LV.ready && LV.user && !(LV.profile && LV.profile.mg_on)) return setupView(); if (!NK.S.me || (LV.ready && !LV.user)) return landing(); acceptPending(); if (cur().v !== 'mgchat') inboxTick(); return null; };
  const loading = `<p class="note" style="text-align:center;padding:30px 0">…</p>`;
  const R = () => want('mg:rel', () => LV.rel()) || { friends: new Set(), out: new Set(), inc: [], follow: new Set() };
  const mediaHtml = (p) => p.media_type === 'video' ? `<video src="${esc(p.media_url)}" playsinline muted loop autoplay controls></video>` : `<img src="${esc(p.media_url)}" alt="" loading="lazy">`;
  const admBtns = (p) => isAdmin() ? `<div class="mgadm"><span>${small('shield')}${FXM('adm')}</span><button data-act="mgahide" data-v="${p.id}" data-h="${p.hidden ? 0 : 1}">${FXM(p.hidden ? 'act_show' : 'act_hide')}</button><button data-act="mgadel" data-v="${p.id}">${FXM('act_delete')}</button></div>` : '';
  const card = (p) => `<article class="mgpost ${p.hidden ? 'hid' : ''}">
    <div class="mgph">${link(p.author, av(p.author, 'sm'))}<div class="grow">${link(p.author, `<b>${esc(mname(p.author))}</b>${vm(p.author)}`)}<small>${p.dist ? esc(loc(p.dist)) + ' · ' : ''}<span class="num">${ago(p.created_at)}</span></small></div><button class="mgic sm" data-act="mgpmenu" data-v="${p.id}" aria-label="${M('more_l')}">${ic('dots')}</button></div>
    <div class="mgimg" data-act="mgdbl" data-v="${p.id}">${mediaHtml(p)}<i class="mgheart">${ic('heart')}</i></div>
    <div class="mgact"><button class="${p.liked ? 'on' : ''}" data-act="mglike" data-v="${p.id}" aria-label="like">${ic('heart')}</button><button data-act="mgpost" data-v="${p.id}" aria-label="${t('comment')}">${ic('chat')}</button><button data-act="mgshare" data-v="${p.id}" aria-label="${M('share')}">${ic('send')}</button></div>
    <div class="mgmeta">${p.likes ? `<b class="num">${nf(p.likes)} ${M('likes')}</b>` : ''}
    ${p.caption ? `<p class="mgcap">${link(p.author, `<b>${esc(mname(p.author))}</b>`)} ${esc(trText('p' + p.id, p.caption, p.lang))}</p>${trBadge('p' + p.id)}` : ''}
    ${p.ncm ? `<button class="mgmore" data-act="mgpost" data-v="${p.id}">${M('all_comments')} · <span class="num">${nf(p.ncm)}</span></button>` : ''}</div>${admBtns(p)}
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
  let PTAB = 'grid';
  const profView = (uid) => {
    const me = uid === meId(); const pr = me ? LV.profile || {} : (LV.cached(uid) || want('mg:pf:' + uid, () => LV.fetchProfile(uid)) || {});
    const cnt = want('mg:cnt:' + uid, () => LV.counts(uid)) || [0, 0, 0]; const all = keep(want('mg:up:' + uid, () => LV.posts('grid', uid))) || []; const rel = R();
    const fr = rel.friends.has(uid), rq = rel.out.has(uid), fo = rel.follow.has(uid);
    const posts = all;
    const actions = me ? `<button class="mgb1 soft" data-act="mgedit">${M('edit_l')}</button><button class="mgb1 soft" data-act="mginvite">${M('share_profile')}</button><button class="mgb1 soft sq" data-act="mgmenu" aria-label="${M('settings')}">${ic('dots')}</button>`
      : `<button class="mgb1 ${fo ? 'soft' : 'dark'}" data-act="mgfollow" data-v="${uid}">${M(fo ? 'unfollow' : 'follow')}</button>${fr ? `<button class="mgb1 soft" data-act="mgdm" data-v="${uid}">${M('write')}</button>` : `<button class="mgb1 soft" data-act="mgfriend" data-v="${uid}" ${rq ? 'disabled' : ''}>${M(rq ? 'req_sent' : 'add_friend')}</button>`}<button class="mgb1 soft sq" data-act="mgumenu" data-v="${uid}" aria-label="${M('more_l')}">${ic('dots')}</button>`;
    const adm = isAdmin() && !me ? `<div class="mgadmbar"><b>${small('shield')}${FXM('adm')}</b><button data-act="mgaflag" data-v="${uid}" data-f="verified" data-x="${pr.verified ? 0 : 1}">${FXM(pr.verified ? 'act_unverify' : 'act_verify')}</button><button data-act="mgaflag" data-v="${uid}" data-f="banned" data-x="${pr.banned ? 0 : 1}">${FXM(pr.banned ? 'act_unban' : 'act_ban')}</button><button data-act="mgawarn" data-v="${uid}">${FXM('act_warn')}</button></div>` : '';
    const ast = me && isAdmin() ? want('adm:stats', () => LV.stats()) || {} : {};
    const admTop = me && isAdmin() ? `<button class="mgadmmode" data-act="admmode">${small('shield')}<b>${FXM('adm_badge')}</b><span>${FXM('adm_mode_off')}</span></button><div class="mgastats"><div><b class="num">${ast.mg_users == null ? '…' : nf(ast.mg_users)}</b><small>${M('mg_users_n')}</small></div><div><b class="num">${ast.mg_new7 == null ? '…' : nf(ast.mg_new7)}</b><small>${M('new7_n')}</small></div><div><b class="num">${ast.reports == null ? '…' : nf(ast.reports)}</b><small>${FXM('tab_reports')}</small></div><div><b class="num">${ast.verify == null ? '…' : nf(ast.verify)}</b><small>${FXM('tab_verify')}</small></div></div>` : '';
    const lng = pr.ui_lang ? `<span class="mglang">${small('globe')}${M('writes_in')} ${esc(langName(pr.ui_lang))}${!me && pr.ui_lang !== NK.lang ? ` · <b>${M('tr_for_you')}</b>` : ''}</span>` : '';
    const tile = (x) => x.media_type === 'video' ? `<button class="mgvt" data-act="mgpost" data-v="${x.id}"><video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video>${ic('play')}</button>` : `<button data-act="mgpost" data-v="${x.id}" style="background-image:url(${esc(x.media_url)})"></button>`;
    return admTop + `<div class="mgp2">
      <div class="mgp2-top"><div class="mgp2-av ${me ? '' : ''}">${av(uid, 'xl')}</div><div class="mgp2-st"><div><b class="num">${nf(all.length)}</b><small>${M('moments')}</small></div><button data-act="mgfriendsk" data-v="followers"><b class="num">${nf(me ? rel.friends.size : cnt[1])}</b><small>${M(me ? 'friends' : 'followers')}</small></button></div></div>
      <h2 class="mgp2-nm">${esc(mname(uid))}${vm(uid)}</h2>${pr.banned ? `<p class="tag" style="background:var(--rose-tint);color:var(--rose)">${FXM('act_ban')}</p>` : ''}
      ${pr.mg_bio ? `<p class="mgp2-bio">${esc(me ? pr.mg_bio : trText('a' + uid, pr.mg_bio, pr.ui_lang))}</p>${me ? '' : trBadge('a' + uid)}` : me ? `<button class="mglink" data-act="mgedit">+ ${t('about_l')}</button>` : ''}
      <div class="mgp2-meta">${lng}${me && !pr.verified ? `<button class="mgvfchip" data-act="vfopen" data-v="mg">${small('check')}${FXM('vf_t')}</button>` : ''}</div>
      <div class="mgp2-act">${actions}</div>${!me && !fr ? `<p class="mgp2-note">${small('lock')} ${M('dm_lock')}</p>` : ''}${adm}
    </div>
    <div class="mggrid">${posts.length ? posts.map(tile).join('') : `<div class="mgempty" style="grid-column:1/-1">${me ? `<p>${M('city_empty')}</p><button class="mgb1 dark" style="flex:none;padding:0 22px" data-act="mgnew">${M('moment_new')}</button>` : `<p>${M('no_posts')}</p>`}</div>`}</div>`;
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
    const w = sheet(`<h3>${M('moment_new')}</h3>
      <label class="mgpick"><input type="file" id="mgfile" accept="image/*,video/*" hidden><span id="mgprev">${ic('camera')}<b>${M('pick')}</b></span></label>
      <div class="field"><label for="mgcap">${M('caption')}</label><textarea id="mgcap" rows="2" placeholder="${M('caption_ph')}"></textarea></div>
      <p class="note" style="font-size:12px">${M('rules')}</p><button class="btn primary full mgbtn" id="mgpub" style="margin-top:10px">${t('publish')}</button>`);
    w.querySelectorAll('[data-ty]').forEach(b => b.onclick = () => { type = b.dataset.ty; w.querySelectorAll('[data-ty]').forEach(x => x.classList.toggle('on', x === b)); });
    w.querySelector('#mgfile').onchange = async (e) => { file = e.target.files[0]; data = null; if (!file) return; const pv = w.querySelector('#mgprev');
      if (file.type.startsWith('video')) { if (file.size > 50 * 1048576) { toast(FXM('too_big')); file = null; return; } pv.innerHTML = `<video src="${URL.createObjectURL(file)}" muted autoplay loop playsinline></video>`; } else { data = await resizeImg(file, 2048, 0.88); pv.innerHTML = `<img src="${data}" alt="">`; } };
    w.querySelector('#mgpub').onclick = async (ev) => { if (!file) { w.querySelector('.mgpick').classList.add('err'); return; } const b = ev.currentTarget; b.disabled = true; b.textContent = '…';
      try { const isV = file.type.startsWith('video'); type = isV ? 'reel' : 'post'; const url = await LV.upload(isV ? file : data, type);
        await LV.createPost({ type, media_url: url, media_type: isV ? 'video' : 'image', caption: w.querySelector('#mgcap').value.trim(), lang: NK.lang, dist: NK.S.me.dist || '' });
        w.remove(); toast(t('published')); dropData('mg:'); NK.stack.length = 1; NK.stack[0] = { v: 'mgexplore' }; render(true);
      } catch (e) { console.warn(e); toast(FXM('send_fail')); b.disabled = false; b.textContent = t('publish'); } }; };
  const pickImg = (cb, max) => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = async () => { const f = inp.files[0]; if (f) cb(await resizeImg(f, max || 1080, 0.88)); }; inp.click(); };
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
    return { html: `<div class="mg mgland"><div class="mgwrap"><div class="mglhead">${mgLogo('big')}<h1 class="mgh1"><img class="mgwm" src="img/mgapp/wordmark-dark.png" alt="MAGAAM"></h1><p>${M('tag2')}</p></div>${invBox()}<div class="mgcard">${body}</div></div></div>` }; };
  let bip = null; window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); bip = e; if (cur().v.startsWith('mg')) render(); });
  const shareIc = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-4px"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>`;
  const plusIc = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="vertical-align:-4px"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/></svg>`;
  const installGate = () => { const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
    return { html: `<div class="mg mgland"><div class="mgwrap"><div class="mglhead">${mgLogo('big')}<h1 class="mgh1"><img class="mgwm" src="img/mgapp/wordmark-dark.png" alt="MAGAAM"></h1><p>${M('tag2')}</p></div>${invBox()}<div class="mgcard">
      <h3 style="margin:0 0 4px">${M('inst_t')}</h3><p class="note" style="margin:0 0 12px">${M('inst_d')}</p>
      ${bip ? `<button class="btn primary full mgbtn" data-act="mginst">${M('inst_btn')}</button>` : `<ol class="mgsteps"><li><span>1</span>${M('inst_1')} ${shareIc}</li><li><span>2</span>${M('inst_2')} ${plusIc}</li><li><span>3</span>${M('inst_3')}</li></ol>${ios ? `<p class="note" style="font-size:12.5px;margin:10px 0 0">${M('inst_safari')}</p>` : ''}`}
      </div></div>${ios && !bip ? '<div class="mgarrow">↓</div>' : ''}</div>` }; };
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
      <div class="mgshare"><a class="btn soft mgbtn2" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">WhatsApp</a><a class="btn soft mgbtn2" href="https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(M('inv_text'))}" target="_blank" rel="noopener">Telegram</a><button class="btn soft mgbtn2" data-x="copy">${M('copy_link')}</button></div><button class="btn soft full mgbtn2" style="margin-top:8px" data-act="mgcontacts">${small('users')}${M('from_contacts')}</button>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return;
      if (b.dataset.x === 'share') navigator.share({ title: 'Magaam', text: M('inv_text'), url: link }).catch(() => {});
      if (b.dataset.x === 'copy') { (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(() => toast(M('copied'))).catch(() => { const ta = document.createElement('textarea'); ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(M('copied')); }); } }); };

  /* ===== messenger ===== */
  const MGM = {}, OTHER_READ = {}, DRAFT = {}, REPLY = {}, WATCH = {}; let openChat = null, typingCh = null, typingT = null;
  const hm = (d) => new Date(d).toLocaleTimeString(NK.lang === 'ar' ? 'ar' : NK.lang, { hour: '2-digit', minute: '2-digit' });
  const dayLabel = (d) => { const x = new Date(d), n = new Date(); const k = (y) => y.toDateString(); const yd = new Date(Date.now() - 864e5);
    return k(x) === k(n) ? M('today') : k(x) === k(yd) ? M('yesterday') : x.toLocaleDateString(NK.lang, { day: 'numeric', month: 'long' }); };
  const shortTime = (d) => { const x = new Date(d); return x.toDateString() === new Date().toDateString() ? hm(d) : x.toLocaleDateString(NK.lang, { day: 'numeric', month: 'short' }); };
  const inboxTick = () => { const inb = want('mg:inbox', () => LV.mgInbox()); if (inb) { window.__mgUnread = inb.reduce((s, c) => s + Number(c.unread || 0), 0); if (window.MG_APP) NK.setBadge(window.__mgUnread); } };
  const ticks = (m, chatId) => { const rd = OTHER_READ[chatId]; return `<i class="mgtick ${rd && new Date(rd) >= new Date(m.created_at) ? 'rd' : ''}">${rd && new Date(rd) >= new Date(m.created_at) ? '✓✓' : '✓'}</i>`; };
  const bubble = (m, chatId) => { const W_ = WATCH[chatId]; const mine = m.sender === (W_ ? W_.a : meId()); const list = MGM[chatId] || []; const kindTxt = (x) => x.media_kind === 'audio' ? '🎤 ' + M('voice') : x.media_kind === 'video' ? '🎬' : M('photo_msg');
    if (m.deleted) return `<div class="mgb ${mine ? 'me' : ''} del" data-mid="${m.id}"><span>${M('deleted')}</span><small>${hm(m.created_at)}</small></div>`;
    const rq = m.reply_to ? list.find(x => x.id === m.reply_to) : null;
    const txtv = mine ? m.body : trText('mg' + m.id, m.body, m.lang);
    return `<div class="mgb ${mine ? 'me' : ''} ${m.media_url && !m.body && m.media_kind !== 'audio' ? 'media' : ''}" data-act="${W_ ? 'noop' : 'mgbtap'}" data-v="${m.id}" data-mid="${m.id}">${W_ ? `<b class="mgwho">${esc(mname(m.sender))}</b>` : `<b class="m8who">${esc(mname(m.sender))}</b>`}${rq ? `<span class="mgq"><b>${esc(mname(rq.sender))}</b>${esc(rq.deleted ? M('deleted') : rq.body || kindTxt(rq))}</span>` : ''}${m.product_id ? prodCardMsg(m) : ''}${mediaInBubble(m)}${m.body && !(m.product_id && PRODS[m.product_id] && m.body.startsWith('🛍')) ? `<span class="mgtx">${esc(txtv)}</span>` : ''}${!mine ? trBadge('mg' + m.id) : ''}<small>${hm(m.created_at)}${mine && !W_ ? ticks(m, chatId) : ''}</small></div>`; };
  const threadHtml = (chatId) => { const list = MGM[chatId] || []; let last = ''; return list.map(m => { const d = new Date(m.created_at).toDateString(); const sep = d !== last ? `<div class="mgday"><span>${dayLabel(m.created_at)}</span></div>` : ''; last = d; const W_ = WATCH[chatId]; const mine = m.sender === (W_ ? W_.a : meId()); return sep + `<div class="mgbrow ${mine ? 'me' : ''}"><button class="pbtn m8bav" data-act="mgp" data-v="${m.sender}">${av(m.sender, 'bb')}</button>${bubble(m, chatId)}</div>`; }).join(''); };
  const paintThread = () => { if (!openChat) return; const th = document.getElementById('mgthread'); if (!th) return; const atEnd = window.innerHeight + window.scrollY >= document.body.scrollHeight - 120; th.innerHTML = threadHtml(openChat.id); if (atEnd) scrollEnd(); };
  const scrollEnd = () => setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 20);
  const markRead = (chatId) => { LV.mgRead(chatId).catch(() => {}); };

  let CF = 'all';
  const pins = () => NK.S.mgPins || (NK.S.mgPins = []);
  V.mgchats = (p) => { const r = ready(); if (r) return r; const k = (p && p.k) || 'chats';
    const inb = want('mg:inbox', () => LV.mgInbox()); const nUn = (inb || []).filter(c => Number(c.unread) > 0).length; const nReq = R().inc.length;
    const chip = (v, label, n, act) => `<button class="mgchip ${(k === 'friends' ? 'friends' : CF) === v ? 'on' : ''}" data-act="${act || 'mgcf'}" data-v="${v}">${label}${n ? ` <em class="num">${n}</em>` : ''}</button>`;
    const chips = `<div class="mgchips">${chip('all', t('all'), 0)}${chip('unread', M('unread'), nUn)}${chip('friends', M('friends'), nReq, 'mgcf')}</div>`;
    if (k === 'friends') return wrapView('mgfriends', chips + friendsBody(), M('chats'));
    const P = pins(); let list = (inb || []).slice();
    if (CF === 'unread') list = list.filter(c => Number(c.unread) > 0);
    list.sort((a, b) => (P.includes(b.id) - P.includes(a.id)) || (new Date(b.last_at) - new Date(a.last_at)));
    const rows = list.map(c => { const un = Number(c.unread || 0); const mineLast = c.last_sender === meId(); const rd = c.other_read && new Date(c.other_read) >= new Date(c.last_at); const pin = P.includes(c.id);
      return `<button class="mgchatrow ${un ? 'un' : ''}" data-act="mgopen" data-v="${c.id}" data-u="${c.other}" data-nm="${esc(mname(c.other).toLowerCase())}">${av(c.other, 'md')}<span class="grow"><span class="mgcr1"><b>${esc(mname(c.other))}${vm(c.other)}</b><small class="num">${shortTime(c.last_at)}</small></span><span class="mgcr2"><span class="mgprev">${mineLast ? `<i class="mgtick ${rd ? 'rd' : ''}">${rd ? '✓✓' : '✓'}</i> ` : ''}${esc(c.last_body || '')}</span>${un ? `<em class="mgunread num">${un > 99 ? '99+' : un}</em>` : pin ? `<i class="mgpinic">${small('pin')}</i>` : ''}</span></span></button>`; }).join('');
    return wrapView('mgchats', `<div class="mgwrap" style="padding-top:4px"><div class="mgsearch">${ic('search')}<input type="search" placeholder="${M('search')}" aria-label="${M('search')}" oninput="var q=this.value.toLowerCase();document.querySelectorAll('.mgchatrow').forEach(function(e){e.hidden=e.dataset.nm.indexOf(q)<0})"></div>${chips}
      <div class="mgchatlist">${inb === undefined ? loading : rows || `<div class="mgempty">${mgLogo()}<p>${M(CF === 'unread' ? 'no_unread' : 'no_chats')}</p></div>`}</div><p class="mgnobar">${small('translate')} ${M('no_barrier')}</p>${inviteCard()}</div>`, M('chats')); };

  V.mgchat = (p) => { const r = ready(); if (r) return r; const id = p.id, other = p.u;
    if (p.w) { WATCH[id] = { a: p.u, b: p.w };
      if (!MGM[id] && !p._l) { p._l = 1; Promise.all([LV.mgMessages(id), LV.prof([p.u, p.w])]).then(([ms]) => { MGM[id] = ms; if (cur().v === 'mgchat' && cur().id === id) { render(); scrollEnd(); } }).catch(e => { console.warn(e); toast(FXM('send_fail')); }); }
      return { html: `<div class="mg mgchatv"><header class="mgctop"><button class="mgic" data-act="mgchatback" aria-label="${t('back')}">${ic('back', 'flip')}</button>${av(p.u, 'sm')}<div class="grow"><b>${esc(mname(p.u))} ↔ ${esc(mname(p.w))}</b><small>${FXM('read_only')}</small></div></header>
        <div class="mgwatch">${small('shield')} ${FXM('watch_dm')}</div><div class="mgthread" id="mgthread" style="padding-bottom:30px">${MGM[id] ? threadHtml(id) : loading}</div></div>` }; }
    if (!MGM[id] && !p._l) { p._l = 1; Promise.all([LV.mgMessages(id), LV.mgOtherRead(id), LV.prof([other])]).then(([ms, rd]) => { MGM[id] = ms; OTHER_READ[id] = rd; if (cur().v === 'mgchat' && cur().id === id) { if (document.getElementById('mgthread')) paintThread(); else render(); scrollEnd(); } markRead(id); }).catch(e => { console.warn(e); toast(FXM('send_fail')); }); }
    const rq = REPLY[id] ? (MGM[id] || []).find(x => x.id === REPLY[id]) : null;
    return { html: `<div class="mg mgchatv"><header class="mgctop"><button class="mgic" data-act="mgchatback" aria-label="${t('back')}">${ic('back', 'flip')}</button>${link(other, av(other, 'sm'))}<div class="grow">${link(other, `<b>${esc(mname(other))}</b>${vm(other)}`)}<small id="mgsub">${(prof(other).ui_lang && prof(other).ui_lang !== NK.lang) ? small('translate') + ' ' + esc(langName(prof(other).ui_lang)) : ''}</small></div><button class="mgic" data-act="mgcmenu" data-v="${id}" data-u="${other}" aria-label="${M('more_l')}">${ic('dots')}</button></header>
      <div class="mgthread m8th ${window.MG8STYLE ? window.MG8STYLE() : 'cards'}" id="mgthread">${MGM[id] ? threadHtml(id) : loading}</div>
      <div class="mgcomp">${rq ? `<div class="mgrq"><span><b>${esc(mname(rq.sender))}</b>${esc(rq.body || M('photo_msg'))}</span><button data-act="mgrqx" aria-label="${t('close')}">${small('x')}</button></div>` : ''}
        <div id="mgrecbar" class="mgrecbar" hidden><i class="mgdot"></i><b id="mgrect" class="num">0:00</b><span>${M('rec_hint')}</span><button class="mgic" data-act="mgrecx" aria-label="${t('close')}">${ic('x')}</button><button class="mgsend" data-act="mgrecsend" aria-label="${M('send_l')}">${ic('send', 'flip')}</button></div><div class="mgcrow"><button class="mgic" data-act="mgattach" aria-label="${M('attach_media')}">${ic('plus')}</button><textarea id="mgmsg" rows="1" placeholder="${prof(other).ui_lang && prof(other).ui_lang !== NK.lang ? M('msg_ph_tr').replace('{n}', mname(other).split(' ')[0]) : M('msg_ph')}" aria-label="${M('msg_ph')}"></textarea><button class="mgsend mgmic" data-act="mgrec" aria-label="${M('voice')}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button><button class="mgsend mgsnd" data-act="mgsendm" aria-label="${M('send_l')}">${ic('send', 'flip')}</button></div></div></div>` }; };

  const sendText = async () => { if (!openChat) return; const ta = document.getElementById('mgmsg'); const tx = ta ? ta.value.trim() : ''; if (!tx) return; const id = openChat.id;
    ta.value = ''; DRAFT[id] = ''; ta.style.height = 'auto'; const rw = ta.closest('.mgcrow'); if (rw) rw.classList.remove('has'); const rp = REPLY[id]; delete REPLY[id]; const rqb = document.querySelector('.mgrq'); if (rqb) rqb.remove();
    try { const m = await LV.mgSend(id, tx, NK.lang, null, rp); const l = MGM[id] = MGM[id] || []; if (!l.some(x => x.id === m.id)) l.push(m); paintThread(); scrollEnd(); dropData('mg:inbox'); }
    catch (e) { console.warn(e); toast(FXM('send_fail')); ta.value = tx; } };
  window.MGAFTER = (c) => {
    if (c.v !== 'mgchat') { if (REC) recStop(false); if (openChat) { if (typingCh) typingCh.leave(); typingCh = null; openChat = null; dropData('mg:inbox'); } return; }
    if (c.w) { openChat = { id: c.id, u: c.u, watch: true }; if (typingCh) { typingCh.leave(); typingCh = null; } return; }
    if (!openChat || openChat.id !== c.id) { if (typingCh) typingCh.leave(); openChat = { id: c.id, u: c.u };
      typingCh = LV.mgTyping(c.id, () => { const s = document.getElementById('mgsub'); if (s) { s.textContent = M('typing'); clearTimeout(typingT); typingT = setTimeout(() => { const s2 = document.getElementById('mgsub'); if (s2) s2.textContent = ''; }, 3000); } }); scrollEnd(); }
    const ta = document.getElementById('mgmsg'); if (!ta) return; ta.value = DRAFT[c.id] || '';
    const auto = () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; }; auto();
    const swap = () => { const row = ta.closest('.mgcrow'); if (row) row.classList.toggle('has', !!ta.value.trim()); }; swap();
    ta.addEventListener('input', () => { DRAFT[c.id] = ta.value; auto(); swap(); if (typingCh) typingCh.send(); });
    ta.addEventListener('keydown', ev => { if (ev.key === 'Enter' && !ev.shiftKey && !('ontouchstart' in window)) { ev.preventDefault(); sendText(); } });
  };
  LV.onMg((kind, row, ev) => {
    if (!LV.user) return;
    if (kind === 'read') { if (row.user_id === meId()) return; OTHER_READ[row.chat_id] = row.read_at; if (openChat && openChat.id === row.chat_id) paintThread(); else if (cur().v === 'mgchats') { dropData('mg:inbox'); render(); } return; }
    const list = MGM[row.chat_id];
    if (ev === 'UPDATE') { if (list) { const i = list.findIndex(x => x.id === row.id); if (i >= 0) list[i] = row; } if (openChat && openChat.id === row.chat_id) paintThread(); return; }
    if (list && !list.some(x => x.id === row.id)) list.push(row);
    if (openChat && openChat.id === row.chat_id) { paintThread(); if (openChat.watch) return; if (row.sender !== meId()) { NK.chime(); markRead(row.chat_id); const s = document.getElementById('mgsub'); if (s) s.textContent = ''; } return; }
    if (row.sender === meId()) return;
    NK.chime();
    dropData('mg:inbox'); LV.mgInbox().then(inb => { DATA_SET(inb); }).catch(() => {});
    LV.prof([row.sender]).then(() => toast(mname(row.sender) + ': ' + (row.body ? String(row.body).slice(0, 60) : M('photo_msg'))));
  });
  const DATA_SET = (inb) => { window.__mgUnread = (inb || []).reduce((s, c) => s + Number(c.unread || 0), 0); if (window.MG_APP) NK.setBadge(window.__mgUnread); if (String(cur().v).startsWith('mg') && cur().v !== 'mgchat' && !document.querySelector('.sheet-wrap')) render(); };
  const msgSheet = (id) => { const c = openChat; if (!c) return; const m = (MGM[c.id] || []).find(x => String(x.id) === String(id)); if (!m || m.deleted) return; const mine = m.sender === meId();
    const w = sheet(`<div class="mgmsheet">${m.body ? `<p>${esc(m.body)}</p>` : ''}<button data-x="reply">${ic('chat')}${t('reply')}</button>${m.body ? `<button data-x="copy">${ic('copy')}${M('copy')}</button>` : ''}${mine ? `<button data-x="del" class="bad">${ic('x')}${M('del_msg')}</button>` : `<button data-x="rep" class="bad">${ic('flag')}${t('report')}</button>`}${isAdmin() && !mine ? `<button data-x="adel" class="bad">${ic('x')}${FXM('act_delete')}</button>` : ''}</div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; const x = b.dataset.x; w.remove();
      if (x === 'reply') { REPLY[c.id] = m.id; render(); setTimeout(() => { const ta = document.getElementById('mgmsg'); if (ta) ta.focus(); }, 50); }
      if (x === 'copy') { (navigator.clipboard ? navigator.clipboard.writeText(m.body) : Promise.reject()).then(() => toast(M('copied'))).catch(() => {}); }
      if (x === 'del') LV.mgDelete(m.id).then(() => { m.deleted = true; m.body = ''; m.media_url = null; paintThread(); dropData('mg:inbox'); }).catch(fail0);
      if (x === 'adel') LV.mgDelete(m.id).then(() => { m.deleted = true; paintThread(); }).catch(fail0);
      if (x === 'rep') LV.report('message', m.id, '', { snapshot: String(m.body || '').slice(0, 500), target_author: m.sender, place: 'mg:' + c.id }).then(() => toast(t('reported'))).catch(fail0); }); };
  const fail0 = (e) => { console.warn(e); toast(FXM('send_fail')); };
  const sharePost = (id) => { const link = inviteLink(); const text = M('inv_text') + ' ' + link; if (navigator.share) navigator.share({ title: 'Magaam', text: M('inv_text'), url: link }).catch(() => {}); else (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(M('copied'))).catch(() => {}); };
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
  /* ===== Explore: search people + everyone's posts and reels ===== */
  const EXQ = { q: '', n: 30 };
  V.mgexplore = () => { const r = ready(); if (r) return r;
    const q = EXQ.q.trim(); const people = q ? want('mg:ppl:' + q, () => LV.mgPeople(q)) : null;
    const list = keep(want('mg:ex:' + EXQ.n, () => LV.explore(EXQ.n)));
    const tiles = (list || []).map((x, i) => { const big = x.type === 'reel' && i % 10 === 2;
      return `<button class="mgxt ${big ? 'big' : ''}" data-act="mgpost" data-v="${x.id}">${x.media_type === 'video' ? `<video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video><i class="mgxp">${ic('play')}</i>` : `<img src="${esc(x.media_url)}" alt="" loading="lazy">`}</button>`; }).join('');
    const ppl = q ? (people === undefined ? loading : people && people.length ? people.filter(p => p.id !== meId()).map(p => `<div class="mgrow">${link(p.id, av(p.id, 'md'))}<div class="grow">${link(p.id, `<b>${esc(mname(p.id))}</b>${vm(p.id)}`)}</div><button class="btn sm soft mgbtn2" data-act="mgp" data-v="${p.id}">${t('open')}</button></div>`).join('') : `<p class="note">${M('nobody')}</p>`) : '';
    return wrapView('mgexplore', `<div class="mgwrap" style="padding-bottom:0"><form class="mgsearch" data-act="noop" onsubmit="event.preventDefault();document.getElementById('mgxgo').click()">${ic('search')}<input id="mgxq" type="search" value="${esc(q)}" placeholder="${M('search')}" aria-label="${M('search')}" enterkeyhint="search"><button type="button" id="mgxgo" class="mglink" data-act="mgxsearch">${M('search')}</button></form>${q ? `<h4>${M('people_s')}</h4>${ppl}` : ''}</div>
      <div class="mgxgrid">${list === undefined ? loading : tiles || `<p class="note" style="grid-column:1/-1;text-align:center">${M('mg_empty') || ''}</p>`}</div>
      ${list && list.length >= EXQ.n ? `<div class="mgwrap"><button class="btn soft full mgbtn2" data-act="mgxmore">${M('more')}</button></div>` : ''}`, M('explore')); };

  /* ===== chat attachments: photo/video in full quality, voice messages ===== */
  const fmtDur = (s) => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const attachSheet = () => { const w = sheet(`<div class="mgmsheet"><button data-x="lib">${ic('camera')}${M('attach_media')}</button><button data-x="cam">${ic('camera')}${M('take_photo')}</button></div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); pickMedia(b.dataset.x === 'cam'); }); };
  const pickMedia = (camera) => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = camera ? 'image/*' : 'image/*,video/*'; if (camera) inp.capture = 'environment'; inp.multiple = !camera;
    inp.onchange = async () => { for (const f of [...inp.files].slice(0, 10)) await sendFile(f); }; inp.click(); };
  const sendFile = async (f) => { if (!openChat) return; const id = openChat.id;
    if (f.size > 50 * 1048576) { toast(FXM('too_big')); return; }
    toast(M('sending'));
    try { let url, kind, meta = null;
      if (f.type.startsWith('video')) { kind = 'video'; url = await LV.upload(f, 'chat'); }
      else { kind = 'image'; const d = await resizeImg(f, 2560, 0.9); url = await LV.upload(d || f, 'chat'); }
      const m = await LV.mgSend(id, '', NK.lang, url, REPLY[id], kind, meta); delete REPLY[id]; const l = MGM[id] = MGM[id] || []; if (!l.some(x => x.id === m.id)) l.push(m); paintThread(); scrollEnd(); }
    catch (e) { fail0(e); } };
  let REC = null;
  const recStart = async () => { if (REC || !openChat) return;
    let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); } catch (e) { toast(M('mic_denied')); return; }
    const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'].find(t => window.MediaRecorder && MediaRecorder.isTypeSupported(t)) || '';
    const rec = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 64000 } : undefined); const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    REC = { rec, stream, chunks, t0: Date.now(), type: rec.mimeType || type || 'audio/mp4', timer: setInterval(() => { const el = document.getElementById('mgrect'); if (el) el.textContent = fmtDur((Date.now() - REC.t0) / 1000); }, 300) };
    rec.start(250); const bar = document.querySelector('.mgcrow'); if (bar) bar.classList.add('rec');
    const rb = document.getElementById('mgrecbar'); if (rb) rb.hidden = false; };
  const recStop = (send) => { if (!REC) return; const R_ = REC; REC = null; clearInterval(R_.timer); const bar = document.querySelector('.mgcrow'); if (bar) bar.classList.remove('rec'); const rb = document.getElementById('mgrecbar'); if (rb) rb.hidden = true;
    R_.rec.onstop = async () => { R_.stream.getTracks().forEach(t => t.stop()); const dur = (Date.now() - R_.t0) / 1000; if (!send || dur < 0.8 || !openChat) return; const id = openChat.id;
      try { const blob = new Blob(R_.chunks, { type: R_.type.split(';')[0] }); const url = await LV.upload(blob, 'voice'); const m = await LV.mgSend(id, '', NK.lang, url, REPLY[id], 'audio', { dur: Math.round(dur) }); delete REPLY[id]; const l = MGM[id] = MGM[id] || []; if (!l.some(x => x.id === m.id)) l.push(m); paintThread(); scrollEnd(); } catch (e) { fail0(e); } };
    R_.rec.stop(); };
  const audioHtml = (m) => `<span class="mgvoice"><button class="mgvp" data-act="mgplay" data-v="${m.id}" aria-label="play">${ic('play')}</button><span class="mgvw"><i style="width:0%"></i></span><em class="num">${fmtDur(m.media_meta && m.media_meta.dur)}</em><audio preload="none" src="${esc(m.media_url)}" data-mid="${m.id}"></audio></span>`;
  const mediaInBubble = (m) => !m.media_url ? '' : m.media_kind === 'audio' ? audioHtml(m) : m.media_kind === 'video' ? `<video src="${esc(m.media_url)}#t=0.1" controls playsinline preload="metadata"></video>` : `<img src="${esc(m.media_url)}" alt="" loading="lazy" data-act="mgzoom" data-v="${esc(m.media_url)}">`;
  const playVoice = (id) => { const a = document.querySelector(`audio[data-mid="${id}"]`); if (!a) return; document.querySelectorAll('.mgvoice audio').forEach(x => { if (x !== a) x.pause(); });
    const box = a.closest('.mgvoice'), bar = box.querySelector('.mgvw i'), btn = box.querySelector('.mgvp');
    a.ontimeupdate = () => { if (a.duration) bar.style.width = (a.currentTime / a.duration * 100) + '%'; };
    a.onended = () => { bar.style.width = '0%'; btn.innerHTML = ic('play'); }; a.onpause = () => { btn.innerHTML = ic('play'); }; a.onplay = () => { btn.innerHTML = `<b style="font-size:13px">❚❚</b>`; };
    if (a.paused) a.play().catch(() => {}); else a.pause(); };
  const zoom = (url) => { const host = document.querySelector('.app') || document.body; const w = document.createElement('div'); w.className = 'mgzoom'; w.innerHTML = `<img src="${esc(url)}" alt=""><button aria-label="${t('close')}">${ic('x')}</button>`; w.onclick = () => w.remove(); host.appendChild(w); };
  const contactsInvite = async () => { const link = inviteLink(), text = M('inv_text') + ' ' + link;
    if ('contacts' in navigator && 'select' in navigator.contacts) { try { const cs = await navigator.contacts.select(['name', 'tel'], { multiple: true }); const nums = cs.flatMap(c => c.tel || []).map(n => n.replace(/[^\d+]/g, '')).filter(Boolean);
        if (nums.length) location.href = `sms:${nums.join(',')}?body=${encodeURIComponent(text)}`; } catch (e) {} return; }
    if (navigator.share) navigator.share({ title: 'Magaam', text: M('inv_text'), url: link }).catch(() => {}); else location.href = `sms:?&body=${encodeURIComponent(text)}`; };
  /* ===== Magaam 3: people first — one space per person ===== */
  const recentAll = () => keep(want('mg:recent', () => LV.posts('grid'))) || [];
  const SEEN = () => NK.S.mgSeen || (NK.S.mgSeen = {});
  const newMoment = (uid, list) => { const l = list.find(x => x.author === uid); return !!(l && (!SEEN()[uid] || new Date(l.created_at) > new Date(SEEN()[uid]))); };
  V.mg = () => { const r = ready(); if (r) return r;
    const rel = R(); const inb = want('mg:inbox', () => LV.mgInbox()) || []; INBOX = inb; const list = recentAll();
    const sc = new Map(); const bump = (u, tm) => { if (!u || u === meId()) return; const s = tm ? new Date(tm).getTime() : 0; sc.set(u, Math.max(sc.get(u) || 0, s)); };
    inb.forEach(c => bump(c.other, c.last_at)); rel.friends.forEach(u => bump(u)); rel.follow.forEach(u => bump(u));
    list.forEach(x => { if (rel.friends.has(x.author) || rel.follow.has(x.author)) bump(x.author, x.created_at); });
    const un = {}; inb.forEach(c => { un[c.other] = Number(c.unread || 0); });
    const ppl = [...sc.keys()].sort((a, b) => ((un[b] > 0) - (un[a] > 0)) || (newMoment(b, list) - newMoment(a, list)) || (sc.get(b) - sc.get(a)));
    const tile = (u) => `<button class="mgpt ${newMoment(u, list) ? 'new' : ''}" data-act="mgperson" data-v="${u}"><span class="mgpt-av">${av(u, 'pt')}${un[u] ? `<em class="num">${un[u] > 9 ? '9+' : un[u]}</em>` : ''}</span><b>${esc(mname(u).split(' ')[0])}</b></button>`;
    const req = rel.inc.length ? `<button class="mgreq" data-act="mggo" data-v="mgfind">${small('users')}<span>${M('requests')}</span><em class="num">${rel.inc.length}</em></button>` : '';
    return wrapView('mg', `<div class="mgpeople">${req}<div class="mgpgrid">
      <button class="mgpt me" data-act="mgnew"><span class="mgpt-av">${av(meId(), 'pt')}<i>${ic('plus')}</i></span><b>${M('moment_new')}</b></button>${ppl.map(tile).join('')}
      <button class="mgpt add" data-act="mginvite"><span class="mgpt-av"><span class="mgpt-plus">${ic('plus')}</span></span><b>${M('invite_s')}</b></button></div>
      ${ppl.length ? '' : `<p class="mghint">${M('people_empty')}</p>`}<p class="mgnobar">${small('translate')} ${M('no_barrier')}</p></div>`); };
  V.mgexplore = () => { const r = ready(); if (r) return r; const list = keep(want('mg:ex:' + EXQ.n, () => LV.explore(EXQ.n)));
    const tl = (x) => `<button class="mgct ${x.media_type === 'video' ? 'vid' : ''}" data-act="mgpost" data-v="${x.id}">${x.media_type === 'video' ? `<video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video><i class="mgxp">${ic('play')}</i>` : `<img src="${esc(x.media_url)}" alt="" loading="lazy">`}<span class="mgct-by">${av(x.author, 'xs')}<span>${esc(mname(x.author).split(' ')[0])}</span></span></button>`;
    return wrapView('mgexplore', `<div class="mgcity">${list === undefined ? loading : (list || []).length ? list.map(tl).join('') : `<p class="mghint">${M('city_empty')}</p>`}</div>${list && list.length >= EXQ.n ? `<div class="mgwrap"><button class="mgb1 soft" style="width:100%" data-act="mgxmore">${M('more')}</button></div>` : ''}`, M('city')); };
  V.mgfind = () => { const r = ready(); if (r) return r; const q = EXQ.q.trim(); const found = q ? want('mg:ppl:' + q, () => LV.mgPeople(q)) : null;
    const res = q ? (found === undefined ? loading : found && found.length ? found.filter(x => x.id !== meId()).map(x => `<div class="mgrow">${link(x.id, av(x.id, 'md'))}<div class="grow">${link(x.id, `<b>${esc(mname(x.id))}</b>${vm(x.id)}`)}</div><button class="mgb1 soft" style="flex:none" data-act="mgperson" data-v="${x.id}">${t('open')}</button></div>`).join('') : `<p class="mghint">${M('nobody')}</p>`) : '';
    return wrapView('mgfind', `<div class="mgwrap"><form class="mgsearch" onsubmit="event.preventDefault();document.getElementById('mgxgo').click()">${ic('search')}<input id="mgxq" type="search" value="${esc(q)}" placeholder="${M('find_people')}" aria-label="${M('find_people')}" enterkeyhint="search"><button type="button" id="mgxgo" class="mglink" data-act="mgxsearch">${M('search')}</button></form>${res}</div>${q ? '' : friendsBody()}`, M('find_people')); };
  V.mgfriends = () => V.mgfind(); V.mgreels = () => V.mgexplore();
  const momentStrip = (uid) => { const l = (keep(want('mg:up:' + uid, () => LV.posts('grid', uid))) || []).slice(0, 15); if (!l.length) return '';
    return `<div class="mgmoms">${l.map(x => `<button data-act="mgpost" data-v="${x.id}">${x.media_type === 'video' ? `<video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video>` : `<img src="${esc(x.media_url)}" alt="" loading="lazy">`}</button>`).join('')}</div>`; };
  const openPerson = (uid) => { SEEN()[uid] = new Date().toISOString(); save(); const inb = (INBOX || []).find(c => c.other === uid);
    if (inb) return go('mgchat', { id: inb.id, u: uid });
    LV.rel().then(rel => rel.friends.has(uid) ? LV.mgChat(uid).then(c => go('mgchat', { id: c.id, u: uid })) : go('mgp', { id: uid })).catch(fail0); };
  let INBOX = [];
  /* ===== Magaam 4: Chats · Contacts · Moments · Me ===== */
  const reqCount = () => { const n = R().inc.length; window.__mgReq = n; return n; };
  V.mgchats = () => { const r = ready(); if (r) return r; reqCount();
    const inb = want('mg:inbox', () => LV.mgInbox()); INBOX = inb || []; const P = pins();
    const list = (inb || []).slice().sort((a, b) => (P.includes(b.id) - P.includes(a.id)) || (new Date(b.last_at) - new Date(a.last_at)));
    const rows = list.map(c => { const un = Number(c.unread || 0); const mineLast = c.last_sender === meId(); const rd = c.other_read && new Date(c.other_read) >= new Date(c.last_at);
      return `<button class="mgcl ${P.includes(c.id) ? 'pin' : ''}" data-act="mgopen" data-v="${c.id}" data-u="${c.other}" data-nm="${esc(mname(c.other).toLowerCase())}"><span class="mgcl-av">${av(c.other, 'md')}${un ? `<em class="num">${un > 99 ? '99+' : un}</em>` : ''}</span><span class="grow"><span class="mgcl1"><b>${esc(mname(c.other))}</b>${vm(c.other)}<small class="num">${shortTime(c.last_at)}</small></span><span class="mgcl2">${mineLast ? `<i class="mgtick ${rd ? 'rd' : ''}">${rd ? '✓✓' : '✓'}</i>` : ''}${esc(c.last_body || '')}</span></span></button>`; }).join('');
    return wrapView('mgchats', `<div class="mgsbar"><div class="mgsearch">${ic('search')}<input type="search" placeholder="${M('search')}" aria-label="${M('search')}" oninput="var q=this.value.toLowerCase();document.querySelectorAll('.mgcl').forEach(function(e){e.hidden=e.dataset.nm.indexOf(q)<0})"></div></div>
      <div class="mglist">${inb === undefined ? loading : rows || `<div class="mgempty">${mgLogo()}<p>${M('no_chats')}</p><button class="mgb1 dark" style="flex:none;padding:0 20px" data-act="mggo" data-v="mgcontacts">${M('contacts')}</button></div>`}</div>
      <p class="mgnobar">${small('translate')} ${M('no_barrier')}</p>`, M('chats')); };
  V.mg = () => V.mgchats();
  V.mgcontacts = () => { const r = ready(); if (r) return r; const rel = R(); const n = reqCount();
    const fr = [...rel.friends].sort((a, b) => mname(a).localeCompare(mname(b), NK.lang));
    let letter = ''; const rows = fr.map(u => { const L0 = (mname(u)[0] || '#').toUpperCase(); const h = L0 !== letter ? `<div class="mgletter">${esc(L0)}</div>` : ''; letter = L0;
      return h + `<button class="mgcl" data-act="mgp" data-v="${u}"><span class="mgcl-av">${av(u, 'md')}</span><span class="grow"><span class="mgcl1"><b>${esc(mname(u))}</b>${vm(u)}</span></span></button>`; }).join('');
    const sys = (act, icn, label, badge, v) => `<button class="mgcl sys" data-act="${act}" ${v ? `data-v="${v}"` : ''}><span class="mgsysic">${ic(icn)}</span><span class="grow"><span class="mgcl1"><b>${label}</b></span></span>${badge ? `<em class="mgbadge2 num">${badge}</em>` : ''}${ic('chev', 'flip chev')}</button>`;
    return wrapView('mgcontacts', `<div class="mglist">${sys('mggo', 'users', M('new_friends'), n, 'mgfind')}${sys('mggo', 'search', M('find_people'), 0, 'mgfind')}${sys('mginvite', 'plus', M('invite'), 0)}</div>
      <div class="mglist" style="margin-top:12px">${rows || `<p class="mghint" style="padding:16px">${M('no_contacts')}</p>`}</div>`, M('contacts')); };
  let MT = 'friends';
  V.mgmoments = () => { const r = ready(); if (r) return r; const rel = R(); const pr = LV.profile || {};
    const all = MT === 'city' ? keep(want('mg:ex:' + EXQ.n, () => LV.explore(EXQ.n))) : recentAll();
    const list = all === undefined ? undefined : MT === 'city' ? all : (all || []).filter(x => x.author === meId() || rel.friends.has(x.author) || rel.follow.has(x.author));
    const item = (p) => `<article class="mgmo"><button class="pbtn" data-act="mgperson" data-v="${p.author}">${av(p.author, 'mo')}</button><div class="grow">
      <button class="mgmo-nm" data-act="mgperson" data-v="${p.author}">${esc(mname(p.author))}${vm(p.author)}</button>
      ${p.caption ? `<p class="mgmo-tx">${esc(trText('p' + p.id, p.caption, p.lang))}</p>${trBadge('p' + p.id)}` : ''}
      <button class="mgmo-media ${p.media_type === 'video' ? 'vid' : ''}" data-act="mgpost" data-v="${p.id}">${p.media_type === 'video' ? `<video src="${esc(p.media_url)}#t=0.5" muted playsinline preload="metadata"></video><i class="mgxp">${ic('play')}</i>` : `<img src="${esc(p.media_url)}" alt="" loading="lazy">`}</button>
      <div class="mgmo-meta"><small class="num">${ago(p.created_at)}${p.dist ? ' · ' + esc(loc(p.dist)) : ''}</small><span><button class="${p.liked ? 'on' : ''}" data-act="mglike" data-v="${p.id}" aria-label="like">${ic('heart')}${p.likes ? `<b class="num">${nf(p.likes)}</b>` : ''}</button><button data-act="mgpost" data-v="${p.id}" aria-label="${t('comment')}">${ic('chat')}${p.ncm ? `<b class="num">${nf(p.ncm)}</b>` : ''}</button></span></div></div></article>`;
    const cover = `<div class="mgmocover" style="${pr.cover_url ? `background-image:url(${esc(pr.cover_url)})` : ''}"><button class="mgmocme" data-act="mggo" data-v="mgmine"><b>${esc(mname(meId()))}</b>${av(meId(), 'mc')}</button></div>`;
    const seg = `<div class="mgseg2"><button class="${MT === 'friends' ? 'on' : ''}" data-act="mgmtab" data-v="friends">${M('friends_tab')}</button><button class="${MT === 'city' ? 'on' : ''}" data-act="mgmtab" data-v="city">${M('city')}</button></div>`;
    return wrapView('mgmoments', cover + seg + `<div class="mgmolist">${list === undefined ? loading : list.length ? list.map(item).join('') : `<p class="mghint">${M(MT === 'city' ? 'city_empty' : 'no_friends_m')}</p>`}</div>${MT === 'city' && list && list.length >= EXQ.n ? `<div class="mgwrap"><button class="mgb1 soft" style="width:100%" data-act="mgxmore">${M('more')}</button></div>` : ''}`, M('moments')); };
  V.mgexplore = () => { MT = 'city'; return V.mgmoments(); };
  V.mgmine = () => { const r = ready(); if (r) return r; return wrapView('mgmine', profView(meId()), M('my_moments')); };
  V.mgme = () => { const r = ready(); if (r) return r; const pr = LV.profile || {};
    const row = (act, icn, label, v, extra) => `<button class="mgcl sys" data-act="${act}" ${v ? `data-v="${v}"` : ''}><span class="mgsysic">${ic(icn)}</span><span class="grow"><span class="mgcl1"><b>${label}</b></span></span>${extra || ''}${ic('chev', 'flip chev')}</button>`;
    return wrapView('mgme', `<button class="mgmecard" data-act="mggo" data-v="mgmine">${av(meId(), 'me')}<span class="grow"><b>${esc(mname(meId()))}${vm(meId())}</b><small>Magaam ID: ${esc(pr.invite_code || '—')}</small>${pr.mg_bio ? `<small>${esc(pr.mg_bio)}</small>` : ''}</span>${ic('chev', 'flip chev')}</button>
      ${isAdmin() ? `<button class="mgadmmode" data-act="admmode">${small('shield')}<b>${FXM('adm_badge')}</b><span>${FXM('adm_mode_off')}</span></button>` : ''}
      <div class="mglist">${row('mggo', 'camera', M('my_moments'), 'mgmine')}${row('mginvite', 'users', M('invite'))}${pr.verified ? '' : row('vfopen', 'check', FXM('vf_t'), 'mg')}</div>
      <div class="mglist">${row('notifset', 'siren', FXM('notif_t'))}${row('mglangs', 'globe', t('language'), '', `<small class="mgrowv">${esc(langName(NK.lang))}</small>`)}${row('mgedit', 'user', t('edit_profile'))}</div>
      <div class="mglist">${NK.canAdmin() ? row('admmode', 'shield', FXM(isAdmin() ? 'adm_mode_off' : 'adm_mode_on')) : ''}${row('mgrules', 'info', M('rules_mg'))}</div>`, M('me_t')); };
  const langsSheet = () => { const w = sheet(`<h3>${t('language')}</h3><div class="mgmsheet">${(window.LANGS || []).map(l => `<button data-x="${l.code}" dir="${l.dir}">${l.code === NK.lang ? small('check') : '<i style="width:20px"></i>'}${esc(l.name)}</button>`).join('')}</div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); NK.setLang(b.dataset.x); NK.boot(); }); };
  const plusMenu = () => { const w = sheet(`<div class="mgmsheet"><button data-x="new">${ic('camera')}${M('moment_new')}</button><button data-x="find">${ic('search')}${M('find_people')}</button><button data-x="inv">${ic('users')}${M('invite')}</button></div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); const x = b.dataset.x; if (x === 'new') createLive(); if (x === 'find') go('mgfind'); if (x === 'inv') inviteSheet(); }); };
  /* ===== Magaam 6: a social network of shops — directions, places, Magaam ID ===== */
  const MD = window.MGDATA || { groups: [], cities: {}, pri: [], all: [] };
  const ALLC = MD.groups.flatMap(g => g.cats.map(c => Object.assign({ g: g.g }, c)));
  const CATS = ALLC.map(c => [c.k, c.e, c.n]);
  const catObj = (k) => ALLC.find(c => c.k === k) || ALLC.find(c => c.k === 'other') || { k: 'other', e: '✨', n: {}, subs: [] };
  const catName = (k) => L(catObj(k).n);
  const catEmoji = (k) => catObj(k).e;
  const subObj = (c, s) => (catObj(c).subs || []).find(x => x.k === s);
  const subName = (c, s, note) => s === 'x' ? (note || '') : subObj(c, s) ? L(subObj(c, s).n) : '';
  const subEmoji = (c, s) => (subObj(c, s) || catObj(c)).e;
  /* places: country names come from the browser in the viewer's language; city names in ru/en/ar from our list */
  const ARABC = ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'EG', 'JO', 'IQ', 'SY', 'LB', 'PS', 'YE', 'SD', 'MA', 'DZ', 'TN'];
  let DN = null, DNL = '';
  const ctryName = (cc) => { if (!cc) return ''; try { if (DNL !== NK.lang) { DN = new Intl.DisplayNames([NK.lang], { type: 'region' }); DNL = NK.lang; } return DN.of(cc) || cc; } catch (e) { return cc; } };
  const cityName = (cc, en) => { if (!en) return ''; const r = (MD.cities[cc] || []).find(x => x[0] === en); if (!r) return en; const lg = NK.lang; return lg === 'ru' ? r[1] : lg === 'ar' || ((lg === 'fa' || lg === 'ur') && ARABC.includes(cc)) ? r[2] : r[0]; };
  const locTxt = (cc, city) => cc ? (city ? cityName(cc, city) + ', ' : '') + ctryName(cc) : '';
  const myLoc = () => NK.S.mgLoc || {};
  const shopName = (uid) => { const p = prof(uid); const n = p.shop_name || mname(uid); return uid === meId() || !p.shop_name ? n : trText('sn' + uid, n, p.ui_lang); };
  const priceTxt = (p) => p.price != null && p.price !== '' ? `${nf(Number(p.price))} SAR` : (p.price_note || M('price_ask'));
  const PRODS = {}; const keepP = (l) => { (l || []).forEach(p => { PRODS[p.id] = p; }); return l; };
  const FAV = () => want('mg:favids', () => LV.favIds()) || new Set();
  const myShop = () => !!(LV.profile && LV.profile.shop_on);
  const lk = () => { const l = myLoc(); return (l.country || '') + '|' + (l.city || ''); };
  const pcard = (p) => `<button class="mgpc" data-act="mgprod" data-v="${p.id}"><span class="mgpc-img">${p.photos && p.photos[0] ? `<img src="${esc(p.photos[0])}" alt="" loading="lazy">` : `<i>${catEmoji(p.cat)}</i>`}${p.status === 'sold' ? `<em>${M('sold')}</em>` : ''}${FAV().has(p.id) ? `<u>${ic('heart')}</u>` : ''}</span><span class="mgpc-b"><b class="num">${esc(priceTxt(p))}</b><span>${esc(trText('pt' + p.id, p.title, p.lang))}</span><small>${esc(shopName(p.seller))}${p.city ? ` · ${esc(cityName(p.country, p.city))}` : ''}</small></span></button>`;
  const pgrid = (list, empty) => list === undefined ? loading : list.length ? `<div class="mgpgrid2">${list.map(pcard).join('')}</div>` : `<div class="mgempty">${empty || `<p>${M('no_products')}</p>`}</div>`;
  const catChips = (on) => `<div class="mgcatrow">${CATS.map(([k, e, n]) => `<button class="${k === on ? 'on' : ''}" data-act="mgcat" data-v="${k}"><i>${e}</i><span>${esc(L(n))}</span></button>`).join('')}</div>`;
  const searchBox = (val) => `<form class="mgsearch mgbig" onsubmit="event.preventDefault();document.getElementById('mgsq-go').click()">${ic('search')}<input id="mgsq" type="search" value="${esc(val || '')}" placeholder="${M('search_market')}" aria-label="${M('search_market')}" enterkeyhint="search"><button type="button" id="mgsq-go" data-act="mgsearchgo" hidden></button></form>`;
  const locChip = () => { const l = myLoc(); return `<button class="mglocchip ${l.country ? 'on' : ''}" data-act="mgloc">${small('pin')}<span>${esc(l.country ? locTxt(l.country, l.city) : M('everywhere'))}</span>${ic('chev', 'chev dn')}</button>`; };
  const shopTile = (s) => `<button data-act="mgshop" data-v="${s.id}">${av(s.id, 'sh')}<b>${esc(shopName(s.id))}</b><small>${esc(s.shop_sub ? subName(s.shop_cat, s.shop_sub, s.shop_sub_note) : catName(s.shop_cat))}</small></button>`;
  const shopRow = (shops) => shops && shops.length ? `<h4 class="mgh4">${M('shops')}</h4><div class="mgshoprow">${shops.map(shopTile).join('')}</div>` : '';
  const Q = (o) => Object.assign({ country: myLoc().country, city: myLoc().city }, o);

  V.mg = () => { const r = ready(); if (r) return r; const list = keepP(want('mg:pnew:' + lk(), () => LV.products(Q({ n: 40 }))));
    const shops = want('mg:shops:' + lk(), () => LV.shops(Q({ n: 12 }))) || [];
    const promo = myShop() ? '' : `<button class="mgpromo" data-act="mgopenshop"><span>🛍</span><span class="grow"><b>${M('open_shop')}</b><small>${M('open_shop_d')}</small></span>${ic('chev', 'flip chev')}</button>`;
    return wrapView('mg', `<div class="mgwrap mgmarket">${searchBox()}${locChip()}${catChips()}${promo}${shopRow(shops)}<h4 class="mgh4">${M('new_items')}</h4>${pgrid(list, `<p>${M(myLoc().country ? 'no_products_here' : 'no_products')}</p>${myShop() ? '' : `<button class="mgb1 dark" style="flex:none;padding:0 20px" data-act="mgopenshop">${M('open_shop')}</button>`}`)}</div>`); };
  V.mgcats = () => { const r = ready(); if (r) return r;
    const grp = (g, title) => `<h4 class="mgh4">${title}</h4><div class="mgcatgrid">${ALLC.filter(c => c.g === g).map(c => `<button data-act="mgcat" data-v="${c.k}"><i>${c.e}</i><b>${esc(L(c.n))}</b></button>`).join('')}</div>`;
    return wrapView('mgcats', `<div class="mgwrap">${locChip()}${grp('goods', M('goods_h'))}<div style="height:10px"></div>${grp('services', M('services_h'))}</div>`, M('catalog')); };
  V.mgcat = (p) => { const r = ready(); if (r) return r; const k = p.id, s = p.sub || ''; const c = catObj(k); const key = k + ':' + s + ':' + lk();
    const list = keepP(want('mg:pcat:' + key, () => LV.products(Q({ cat: k, sub: s || undefined, n: 60 })))); const shops = want('mg:scat:' + key, () => LV.shops(Q({ cat: k, sub: s || undefined }))) || [];
    const subs = (c.subs || []).length ? `<div class="mgsubrow"><button class="${s ? '' : 'on'}" data-act="mgsub" data-v="${k}" data-s="">${M('all_l')}</button>${c.subs.map(x => `<button class="${x.k === s ? 'on' : ''}" data-act="mgsub" data-v="${k}" data-s="${x.k}">${x.e} ${esc(L(x.n))}</button>`).join('')}</div>` : '';
    return wrapView('mgcat', `<div class="mgwrap mgmarket">${locChip()}${subs}${shopRow(shops)}<h4 class="mgh4">${M('items')}</h4>${pgrid(list, `<p>${M('no_products_here')}</p>`)}</div>`, `${c.e} ${esc(L(c.n))}`); };
  let SQ = '';
  V.mgsearch = () => { const r = ready(); if (r) return r; const q = SQ.trim(); const key = q + ':' + lk();
    const list = q ? keepP(want('mg:psq:' + key, () => LV.products(Q({ q, n: 60 })))) : [];
    const shops = q ? want('mg:ssq:' + key, () => LV.shops(Q({ q }))) || [] : [];
    const subHits = q.length > 1 ? ALLC.flatMap(c => (c.subs || []).filter(x => Object.values(x.n).some(v => v.toLowerCase().includes(q.toLowerCase()))).map(x => `<button data-act="mgsub" data-v="${c.k}" data-s="${x.k}">${x.e} ${esc(L(x.n))}</button>`)).slice(0, 12).join('') : '';
    return wrapView('mgsearch', `<div class="mgwrap mgmarket">${searchBox(q)}${locChip()}${q ? `${subHits ? `<div class="mgsubrow wrap">${subHits}</div>` : ''}${shopRow(shops)}<h4 class="mgh4">${M('items')}</h4>${pgrid(list, `<p>${M('nobody')}</p>`)}` : catChips()}</div>`, M('search')); };
  V.mgprod = (p) => { const r = ready(); if (r) return r; const x = PRODS[p.id] || want('mg:prod:' + p.id, () => LV.product(p.id).then(v => { if (v) PRODS[v.id] = v; return v; }));
    if (x === undefined) return wrapView('mgprod', loading, ''); if (!x) return V.mg(); const mine = x.seller === meId(); const fav = FAV().has(x.id);
    const ph = x.photos && x.photos.length ? x.photos : [];
    const gal = ph.length ? `<div class="mggal" onscroll="var i=Math.round(Math.abs(this.scrollLeft)/this.clientWidth);this.nextElementSibling&&this.nextElementSibling.querySelectorAll('i').forEach(function(d,j){d.classList.toggle('on',i===j)})">${ph.map(u => `<img src="${esc(u)}" alt="" data-act="mgzoom" data-v="${esc(u)}">`).join('')}</div>${ph.length > 1 ? `<div class="mggaldots">${ph.map((u, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : ''}` : `<div class="mggal empty"><i>${catEmoji(x.cat)}</i></div>`;
    const more = keepP(want('mg:pseller:' + x.seller, () => LV.products({ seller: x.seller, n: 12 })) || []).filter(o => o.id !== x.id && o.status !== 'hidden');
    const bar = mine ? `<div class="mgbuybar"><button class="mgb1 soft" data-act="mgpedit" data-v="${x.id}">${M('edit_item')}</button><button class="mgb1 dark" data-act="mgpsold" data-v="${x.id}">${M(x.status === 'sold' ? 'back_on_sale' : 'mark_sold')}</button></div>`
      : `<div class="mgbuybar"><button class="mgb1 soft sq ${fav ? 'on' : ''}" data-act="mgfav" data-v="${x.id}" aria-label="♡">${ic('heart')}</button><button class="mgb1 dark" data-act="mgask" data-v="${x.id}">${ic('chat')}${M('ask_seller')}</button></div>`;
    const sp = prof(x.seller);
    return { html: `<div class="mg mgprodv">${top('', 'mgprod')}${gal}<div class="mgwrap">
      <div class="mgprice num">${esc(priceTxt(x))}${x.status === 'sold' ? ` <em>${M('sold')}</em>` : ''}</div><h1 class="mgptitle">${esc(trText('pt' + x.id, x.title, x.lang))}</h1>${trBadge('pt' + x.id)}
      <div class="mgchips"><button class="mgchipcat" data-act="mgcat" data-v="${x.cat}">${catEmoji(x.cat)} ${esc(catName(x.cat))}</button>${x.sub && x.sub !== 'x' ? `<button class="mgchipcat" data-act="mgsub" data-v="${x.cat}" data-s="${x.sub}">${subEmoji(x.cat, x.sub)} ${esc(subName(x.cat, x.sub))}</button>` : ''}${x.country ? `<span class="mgchipcat">${small('pin')} ${esc(locTxt(x.country, x.city))}</span>` : ''}</div>
      ${x.descr ? `<p class="mgpdesc">${esc(trText('pd' + x.id, x.descr, x.lang))}</p>${trBadge('pd' + x.id)}` : ''}
      <button class="mgshopcard" data-act="mgshop" data-v="${x.seller}">${av(x.seller, 'md')}<span class="grow"><b>${esc(shopName(x.seller))}${vm(x.seller)}</b><small>${sp.mg_handle ? '@' + esc(sp.mg_handle) + ' · ' : ''}${esc(locTxt(sp.country, sp.city) || catName(sp.shop_cat))}</small></span><span class="mglink">${M('to_shop')}</span></button>
      <p class="mgnobar">${small('lock')} ${M('safe_deal')}</p>
      ${more.length ? `<h4 class="mgh4">${M('more_from_shop')}</h4><div class="mgpgrid2">${more.slice(0, 6).map(pcard).join('')}</div>` : ''}
      ${!mine ? `<button class="mglink" style="display:block;margin:18px auto 0" data-act="mgprep" data-v="${x.id}">${small('flag')} ${t('report')}</button>` : ''}</div>${bar}</div>` }; };
  V.mgshop = (p) => { const r = ready(); if (r) return r; const uid = p.id; const pr = prof(uid).id ? prof(uid) : (want('mg:pf:' + uid, () => LV.fetchProfile(uid)) || {}); const mine = uid === meId();
    const list = keepP(want('mg:pseller:' + uid, () => LV.products({ seller: uid, n: 60 })));
    const acts = mine ? `<button class="mgb1 dark" data-act="mgnewprod">${ic('plus')}${M('add_item')}</button><button class="mgb1 soft" data-act="mgopenshop">${M('edit_shop')}</button><button class="mgb1 soft sq" data-act="mgshareshop" data-v="${uid}" aria-label="${M('share')}">${ic('share')}</button>`
      : `<button class="mgb1 dark" data-act="mgaskshop" data-v="${uid}">${ic('chat')}${M('write')}</button><button class="mgb1 soft sq" data-act="mgshareshop" data-v="${uid}" aria-label="${M('share')}">${ic('share')}</button><button class="mgb1 soft sq" data-act="mgumenu" data-v="${uid}" aria-label="${M('more_l')}">${ic('dots')}</button>`;
    const subTx = pr.shop_sub ? subName(pr.shop_cat, pr.shop_sub, pr.shop_sub_note && !mine ? trText('ss' + uid, pr.shop_sub_note, pr.ui_lang) : pr.shop_sub_note) : '';
    return wrapView('mgshop', `<div class="mgshopv">${pr.cover_url ? `<div class="mgshopcov" style="background-image:url(${esc(pr.cover_url)})"></div>` : ''}<div class="mgshophead ${pr.cover_url ? 'hascov' : ''}">${av(uid, 'shx')}<h2>${esc(shopName(uid))}${vm(uid)}</h2>${mine ? '' : trBadge('sn' + uid)}${pr.mg_handle ? `<div class="mghandle">@${esc(pr.mg_handle)}</div>` : ''}
      <div class="mgchips c"><button class="mgchipcat" data-act="mgcat" data-v="${pr.shop_cat || 'other'}">${catEmoji(pr.shop_cat)} ${esc(catName(pr.shop_cat))}</button>${subTx ? `<button class="mgchipcat" ${pr.shop_sub !== 'x' ? `data-act="mgsub" data-v="${pr.shop_cat}" data-s="${pr.shop_sub}"` : ''}>${subEmoji(pr.shop_cat, pr.shop_sub)} ${esc(subTx)}</button>` : ''}</div>
      ${pr.country ? `<div class="mgshoploc">${small('pin')} ${esc(locTxt(pr.country, pr.city))}</div>` : ''}
      ${pr.shop_about ? `<p class="mgp2-bio">${esc(mine ? pr.shop_about : trText('sa' + uid, pr.shop_about, pr.ui_lang))}</p>${mine ? '' : trBadge('sa' + uid)}` : ''}
      <div class="mgshopn"><b class="num">${list ? nf(list.length) : '…'}</b> ${M('items_n')}${pr.ui_lang ? ` · ${small('globe')} ${esc(langName(pr.ui_lang))}${!mine && pr.ui_lang !== NK.lang ? ` · ${M('tr_for_you')}` : ''}` : ''}</div><div class="mgp2-act">${acts}</div></div>
      <div class="mgwrap">${pgrid(list, mine ? `<p>${M('first_item')}</p><button class="mgb1 dark" style="flex:none;padding:0 20px" data-act="mgnewprod">${M('add_item')}</button>` : '')}</div></div>`, ''); };
  V.mgfavs = () => { const r = ready(); if (r) return r; const list = keepP(want('mg:favs', () => LV.favs()));
    return wrapView('mgfavs', `<div class="mgwrap mgmarket">${pgrid(list, `<p>${M('no_favs')}</p>`)}</div>`, M('favs')); };
  V.mgme = () => { const r = ready(); if (r) return r; const pr = LV.profile || {};
    const row = (act, icn, label, v, extra) => `<button class="mgcl sys" data-act="${act}" ${v ? `data-v="${v}"` : ''}><span class="mgsysic">${ic(icn)}</span><span class="grow"><span class="mgcl1"><b>${label}</b></span></span>${extra || ''}${ic('chev', 'flip chev')}</button>`;
    const shopBox = pr.shop_on ? `<button class="mgmyshop" data-act="mgshop" data-v="${meId()}">${av(meId(), 'md')}<span class="grow"><small>${M('my_shop')}</small><b>${esc(pr.shop_name || mname(meId()))}</b><small>${catEmoji(pr.shop_cat)} ${esc(pr.shop_sub ? subName(pr.shop_cat, pr.shop_sub, pr.shop_sub_note) : catName(pr.shop_cat))}</small></span>${ic('chev', 'flip chev')}</button><div class="mgp2-act" style="padding:0 14px 14px;margin:0;background:#fff"><button class="mgb1 dark" data-act="mgnewprod">${ic('plus')}${M('add_item')}</button><button class="mgb1 soft" data-act="mgshareshop" data-v="${meId()}">${M('share')}</button></div>`
      : `<button class="mgpromo" style="margin:0 14px" data-act="mgopenshop"><span>🛍</span><span class="grow"><b>${M('open_shop')}</b><small>${M('open_shop_d')}</small></span>${ic('chev', 'flip chev')}</button>`;
    return wrapView('mgme', `<button class="mgmecard" data-act="mgedit">${av(meId(), 'me')}<span class="grow"><b>${esc(mname(meId()))}${vm(meId())}</b><small>${pr.mg_handle ? '@' + esc(pr.mg_handle) : 'Magaam ID: ' + M('h_not_set')}</small>${pr.country ? `<small>${small('pin')} ${esc(locTxt(pr.country, pr.city))}</small>` : ''}</span>${ic('chev', 'flip chev')}</button>
      ${isAdmin() ? `<button class="mgadmmode" data-act="admmode">${small('shield')}<b>${FXM('adm_badge')}</b><span>${FXM('adm_mode_off')}</span></button>` : ''}
      <div class="mglist" style="margin-bottom:10px">${shopBox}</div>
      <div class="mglist">${row('mghandle', 'idcard', 'Magaam ID', '', `<small class="mgrowv">${pr.mg_handle ? '@' + esc(pr.mg_handle) : M('h_set')}</small>`)}${row('mgmyloc', 'pin', M('my_place'), '', `<small class="mgrowv">${esc(pr.country ? (pr.city ? cityName(pr.country, pr.city) : ctryName(pr.country)) : M('h_set'))}</small>`)}</div>
      <div class="mglist">${row('mggo', 'heart', M('favs'), 'mgfavs')}${row('mginvite', 'users', M('invite'))}${pr.verified ? '' : row('vfopen', 'check', FXM('vf_t'), 'mg')}</div>
      <div class="mglist">${row('notifset', 'siren', FXM('notif_t'))}${row('mglangs', 'globe', t('language'), '', `<small class="mgrowv">${esc(langName(NK.lang))}</small>`)}</div>
      <div class="mglist">${NK.canAdmin() ? row('admmode', 'shield', FXM(isAdmin() ? 'adm_mode_off' : 'adm_mode_on')) : ''}${row('mgrules', 'info', M('rules_mg'))}</div>`, M('me_t')); };
  const _mgp = V.mgp; V.mgp = (p) => p && prof(p.id).shop_on ? V.mgshop(p) : _mgp(p);
  V.mgexplore = () => V.mg(); V.mgmoments = () => V.mg(); V.mgcontacts = () => V.mgchats();

  /* place picker: country (searchable, in the viewer's language) → city */
  const locSheet = (curL, opts, cb) => { opts = opts || {}; let cc = curL.country || '';
    const allCodes = () => { const pri = MD.pri.filter(c => MD.all.includes(c)); const rest = MD.all.filter(c => !pri.includes(c)).sort((a, b) => ctryName(a).localeCompare(ctryName(b), NK.lang)); return pri.concat(rest); };
    const w = sheet(`<div id="lsb"></div>`); const box = w.querySelector('#lsb');
    const stepC = () => { box.innerHTML = `<h3>${M('choose_country')}</h3><div class="mgsearch">${ic('search')}<input id="lsq" type="search" placeholder="${M('search_country')}" autocomplete="off"></div>${opts.any ? `<button class="mgpick any" data-c="">${small('globe')} ${M('everywhere')}</button>` : ''}<div class="mgpicklist" id="lsl"></div>`;
      const draw = (q) => { q = (q || '').toLowerCase(); box.querySelector('#lsl').innerHTML = allCodes().filter(c => !q || ctryName(c).toLowerCase().includes(q) || c.toLowerCase() === q).map(c => `<button class="mgpick ${c === cc ? 'on' : ''}" data-c="${c}"><span class="flag">${c.replace(/./g, ch => String.fromCodePoint(127397 + ch.charCodeAt(0)))}</span>${esc(ctryName(c))}</button>`).join(''); };
      draw(''); box.querySelector('#lsq').oninput = (e) => draw(e.target.value);
      box.onclick = (e) => { const b = e.target.closest('[data-c]'); if (!b) return; if (!b.dataset.c) { w.remove(); cb({ country: null, city: null }); return; } cc = b.dataset.c; stepCity(); }; };
    const stepCity = () => { const list = MD.cities[cc] || [];
      box.innerHTML = `<button class="mglink" id="lsback">‹ ${esc(ctryName(cc))}</button><h3>${M('choose_city')}</h3>${opts.any ? `<button class="mgpick any" data-y="">${small('globe')} ${M('all_country')}</button>` : ''}<div class="mgpicklist">${list.map(x => `<button class="mgpick ${x[0] === curL.city ? 'on' : ''}" data-y="${esc(x[0])}">${esc(cityName(cc, x[0]))}</button>`).join('')}</div>
        <div class="field" style="margin-top:12px"><label for="lsc">${M(list.length ? 'other_city' : 'city_l')}</label><div class="mgpricein"><input id="lsc" maxlength="60" placeholder="${M('city_ph')}" value="${list.some(x => x[0] === curL.city) || cc !== curL.country ? '' : esc(curL.city || '')}"><button class="btn primary mgbtn" id="lsok" style="flex:none;padding:0 16px">OK</button></div></div>`;
      box.querySelector('#lsback').onclick = stepC;
      box.querySelector('#lsok').onclick = () => { const v = box.querySelector('#lsc').value.trim(); if (!v && !opts.any) return; w.remove(); cb({ country: cc, city: v || null }); };
      box.onclick = (e) => { const b = e.target.closest('[data-y]'); if (!b) return; w.remove(); cb({ country: cc, city: b.dataset.y || null }); }; };
    if (cc && !opts.any) stepCity(); else stepC(); };
  const pickFilterLoc = () => locSheet(myLoc(), { any: true }, (l) => { NK.S.mgLoc = l.country ? l : null; save(); render(); });
  const pickMyLoc = (done) => locSheet(LV.profile || {}, {}, async (l) => { try { const np = await LV.updateProfile({ country: l.country, city: l.city }); NK.S.me = NK.meFrom(np); save(); dropData('mg:'); toast(M('saved')); if (done) done(l); else render(); } catch (e) { fail0(e); } });

  /* Magaam ID: set once, unique */
  const handleSheet = () => { const pr = LV.profile || {};
    if (pr.mg_handle) { const link = 'https://verghethorn.com/magaam/?i=' + (pr.invite_code || '') + '&u=' + pr.mg_handle; const w = sheet(`<h3>Magaam ID</h3><div class="mghbig">@${esc(pr.mg_handle)}</div><p class="note">${M('h_locked')}</p><button class="btn primary full mgbtn" id="hcp">${M('h_copy')}</button>`);
      w.querySelector('#hcp').onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText('@' + pr.mg_handle + ' — ' + link) : Promise.reject()).then(() => toast(M('copied'))).catch(() => {}); }; return; }
    const w = sheet(`<h3>${M('h_title')}</h3><p class="note" style="margin:0 0 12px">${M('h_once')}</p><div class="field"><div class="mghin"><b>@</b><input id="hin" maxlength="24" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="rashid" inputmode="latin"></div><small class="note" id="hst">${M('h_rules')}</small></div><button class="btn primary full mgbtn" id="hgo" disabled>${M('h_save')}</button>`);
    const inp = w.querySelector('#hin'), st = w.querySelector('#hst'), go = w.querySelector('#hgo'); let tm = 0, okv = '';
    const valid = (v) => /^[a-z][a-z0-9_.]{2,23}$/.test(v);
    inp.oninput = () => { const v = inp.value = inp.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''); okv = ''; go.disabled = true; clearTimeout(tm);
      if (!valid(v)) { st.className = 'note'; st.textContent = M('h_rules'); return; } st.className = 'note'; st.textContent = '…';
      tm = setTimeout(async () => { try { const free = await LV.handleFree(v); if (inp.value !== v) return; st.className = free ? 'note okc' : 'note badc'; st.textContent = free ? '✓ @' + v + ' — ' + M('h_free') : '✕ ' + M('h_taken'); if (free) { okv = v; go.disabled = false; } } catch (e) { st.textContent = FXM('send_fail'); } }, 350); };
    go.onclick = async () => { if (!okv || !confirm(M('h_confirm').replace('{h}', '@' + okv))) return; go.disabled = true;
      try { const np = await LV.updateProfile({ mg_handle: okv }); NK.S.me = NK.meFrom(np); save(); w.remove(); toast('✓ @' + okv); render(); }
      catch (e) { const m = String(e && (e.message || e.code) || ''); st.className = 'note badc'; st.textContent = /duplicate|23505|unique/i.test(m) ? '✕ ' + M('h_taken') : FXM('send_fail'); go.disabled = false; } }; };

  /* open a shop / add and edit products */
  const catPicker = (sel) => `<div class="mgcatpick" data-pick="cat">${CATS.map(([k, e, n]) => `<button type="button" data-k="${k}" class="${k === sel ? 'on' : ''}">${e} ${esc(L(n))}</button>`).join('')}</div>`;
  const subPicker = (cat, sel, note, other) => { const c = catObj(cat); return `<div class="mgcatpick" data-pick="sub">${(c.subs || []).map(x => `<button type="button" data-k="${x.k}" class="${x.k === sel ? 'on' : ''}">${x.e} ${esc(L(x.n))}</button>`).join('')}${other ? `<button type="button" data-k="x" class="${sel === 'x' ? 'on' : ''}">✍️ ${M('sub_other')}</button>` : ''}</div>${other ? `<input id="subn" class="mgsubn" ${sel === 'x' ? '' : 'hidden'} maxlength="60" placeholder="${M('sub_other_ph')}" value="${esc(note || '')}">` : ''}`; };
  const bindPick = (w, st, other) => { const wire = () => {
      w.querySelectorAll('[data-pick="cat"] button').forEach(b => b.onclick = () => { st.cat = b.dataset.k; st.sub = ''; w.querySelectorAll('[data-pick="cat"] button').forEach(x => x.classList.toggle('on', x === b)); w.querySelector('#subbox').innerHTML = subPicker(st.cat, '', st.note, other); w.querySelector('#subf').hidden = false; wire(); });
      w.querySelectorAll('[data-pick="sub"] button').forEach(b => b.onclick = () => { st.sub = b.dataset.k; w.querySelectorAll('[data-pick="sub"] button').forEach(x => x.classList.toggle('on', x === b)); const n = w.querySelector('#subn'); if (n) { n.hidden = st.sub !== 'x'; if (!n.hidden) n.focus(); } }); };
    wire(); };
  const shopSheet = () => { const pr = LV.profile || {}; const st = { cat: pr.shop_cat || '', sub: pr.shop_sub || '', note: pr.shop_sub_note || '' }; let photo = null, cover = null; let loc = { country: pr.country, city: pr.city };
    const w = sheet(`<h3>${M(pr.shop_on ? 'edit_shop' : 'open_shop')}</h3><p class="note" style="margin:0 0 12px">${M('open_shop_d')}</p>
      <div class="mgsetrow"><button class="mgsetph" type="button" id="shph">${(pr.mg_avatar || pr.photo_url) ? `<span style="background-image:url(${esc(pr.mg_avatar || pr.photo_url)})"></span>` : `<span>${ic('camera')}</span>`}<b>${M('shop_photo')}</b></button><button class="mgsetcv" type="button" id="shcv" style="${pr.cover_url ? `background-image:url(${esc(pr.cover_url)})` : ''}"><span>${ic('camera')}${M('cover')}</span></button></div>
      <div class="field"><label for="shn">${M('shop_name')} *</label><input id="shn" maxlength="60" value="${esc(pr.shop_name || '')}" placeholder="${M('shop_name_ph')}"></div>
      <div class="field"><label>${M('shop_cat')} *</label>${catPicker(st.cat)}</div>
      <div class="field" id="subf" ${st.cat ? '' : 'hidden'}><label>${M('sub_l')}</label><div id="subbox">${st.cat ? subPicker(st.cat, st.sub, st.note, true) : ''}</div></div>
      <div class="field"><label>${M('location')} *</label><button type="button" class="mglocbtn" id="shloc">${small('pin')}<span>${esc(loc.country ? locTxt(loc.country, loc.city) : M('choose_country'))}</span>${ic('chev', 'flip chev')}</button></div>
      <div class="field"><label for="sha">${M('shop_about')}</label><textarea id="sha" rows="3" placeholder="${M('shop_about_ph')}">${esc(pr.shop_about || '')}</textarea></div>
      <p class="ferr" id="sherr" hidden></p><button class="btn primary full mgbtn" id="shgo">${M(pr.shop_on ? 'save_l' : 'open_shop')}</button>`);
    bindPick(w, st, true);
    w.querySelector('#shph').onclick = () => pickImg(d => { photo = d; w.querySelector('#shph span').outerHTML = `<span style="background-image:url(${d})"></span>`; }, 1080);
    w.querySelector('#shcv').onclick = () => pickImg(d => { cover = d; w.querySelector('#shcv').style.backgroundImage = `url(${d})`; }, 1600);
    w.querySelector('#shloc').onclick = () => locSheet(loc, {}, (l) => { loc = l; w.querySelector('#shloc span').textContent = locTxt(l.country, l.city); });
    w.querySelector('#shgo').onclick = async (ev) => { const nm = w.querySelector('#shn').value.trim(); const er = w.querySelector('#sherr'); const note = (w.querySelector('#subn') || {}).value || '';
      if (!nm || !st.cat) { er.hidden = false; er.textContent = M('shop_need'); return; } if (!loc.country || !loc.city) { er.hidden = false; er.textContent = M('loc_need'); return; }
      const b = ev.currentTarget; b.disabled = true; b.textContent = '…';
      try { const f = { shop_name: nm, shop_cat: st.cat, shop_sub: st.sub || null, shop_sub_note: st.sub === 'x' ? note.trim() : null, shop_about: w.querySelector('#sha').value.trim(), country: loc.country, city: loc.city };
        if (photo) f.mg_avatar = await LV.upload(photo, 'avatar'); if (cover) f.cover_url = await LV.upload(cover, 'cover');
        const np = await LV.openShop(f); NK.S.me = NK.meFrom(np); save(); w.remove(); dropData('mg:'); toast(M(pr.shop_on ? 'saved' : 'shop_ready')); go('mgshop', { id: meId() }); }
      catch (e) { console.warn(e); b.disabled = false; b.textContent = M(pr.shop_on ? 'save_l' : 'open_shop'); er.hidden = false; er.textContent = FXM('send_fail'); } }; };
  const prodSheet = (edit) => { if (!myShop()) return shopSheet(); const pr = LV.profile || {}; const x = edit || {}; const st = { cat: x.cat || pr.shop_cat || 'other', sub: x.sub || (edit ? '' : pr.shop_sub && pr.shop_sub !== 'x' ? pr.shop_sub : '') }; const photos = (x.photos || []).slice(); const fresh = [];
    const thumbs = () => photos.concat(fresh).map((u, i) => `<span class="mgth" style="background-image:url(${u})"><button type="button" data-rm="${i}" aria-label="x">${small('x')}</button></span>`).join('') + (photos.length + fresh.length < 6 ? `<button type="button" class="mgth add" id="pradd">${ic('camera')}<small>${photos.length + fresh.length}/6</small></button>` : '');
    const w = sheet(`<h3>${M(edit ? 'edit_item' : 'add_item')}</h3><div class="mgths" id="prth">${thumbs()}</div>
      <div class="field"><label for="prt">${M('item_title')} *</label><input id="prt" maxlength="120" value="${esc(x.title || '')}" placeholder="${M('item_title_ph')}"></div>
      <div class="field"><label for="prp">${M('item_price')}</label><div class="mgpricein"><input id="prp" inputmode="decimal" value="${x.price != null ? esc(String(x.price)) : ''}" placeholder="0"><b>SAR</b></div><small class="note">${M('price_hint')}</small></div>
      <div class="field"><label>${M('shop_cat')}</label>${catPicker(st.cat)}</div>
      <div class="field" id="subf"><label>${M('sub_l')}</label><div id="subbox">${subPicker(st.cat, st.sub, '', false)}</div></div>
      <div class="field"><label for="prd">${M('item_desc')}</label><textarea id="prd" rows="4" maxlength="3000" placeholder="${M('item_desc_ph')}">${esc(x.descr || '')}</textarea></div>
      <p class="ferr" id="prerr" hidden></p><button class="btn primary full mgbtn" id="prgo">${M(edit ? 'save_l' : 'publish_item')}</button>${edit ? `<button class="btn soft full" style="margin-top:8px;color:#C2352B" id="prdel">${M('del_msg')}</button>` : ''}`);
    bindPick(w, st, false);
    const redraw = () => { w.querySelector('#prth').innerHTML = thumbs(); bind(); };
    const bind = () => { const a = w.querySelector('#pradd'); if (a) a.onclick = () => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = true; inp.onchange = async () => { for (const f of [...inp.files].slice(0, 6 - photos.length - fresh.length)) { const d = await resizeImg(f, 1600, 0.88); if (d) fresh.push(d); } redraw(); }; inp.click(); };
      w.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { const i = +b.dataset.rm; if (i < photos.length) photos.splice(i, 1); else fresh.splice(i - photos.length, 1); redraw(); }); };
    bind();
    w.querySelector('#prgo').onclick = async (ev) => { const title = w.querySelector('#prt').value.trim(); const er = w.querySelector('#prerr'); const pv = w.querySelector('#prp').value.replace(',', '.').trim();
      if (title.length < 2) { er.hidden = false; er.textContent = M('item_need'); return; } if (!photos.length && !fresh.length) { er.hidden = false; er.textContent = M('photo_need'); return; }
      const b = ev.currentTarget; b.disabled = true; b.textContent = '…';
      try { const up = []; for (const d of fresh) up.push(await LV.upload(d, 'item'));
        const f = { title, price: pv === '' || isNaN(+pv) ? null : +pv, cat: st.cat, sub: st.sub || null, descr: w.querySelector('#prd').value.trim(), photos: photos.concat(up), lang: NK.lang };
        const saved = edit ? await LV.updProduct(edit.id, f) : await LV.addProduct(f); PRODS[saved.id] = saved; w.remove(); dropData('mg:'); toast(M(edit ? 'saved' : 'published_item')); go('mgprod', { id: saved.id }); }
      catch (e) { console.warn(e); b.disabled = false; b.textContent = M(edit ? 'save_l' : 'publish_item'); er.hidden = false; er.textContent = FXM('send_fail'); } };
    const del = w.querySelector('#prdel'); if (del) del.onclick = () => { if (!confirm(M('del_msg') + '?')) return; LV.delProduct(edit.id).then(() => { w.remove(); dropData('mg:'); NK.back(); }).catch(fail0); }; };
  const askSeller = async (prodId, sellerId) => { try { const x = prodId ? (PRODS[prodId] || await LV.product(prodId)) : null; const seller = x ? x.seller : sellerId; if (seller === meId()) return;
      const c = await LV.mgChat(seller); if (x) { const m = await LV.mgSend(c.id, '🛍 ' + x.title, x.lang || NK.lang, null, null, null, null, x.id); MGM[c.id] = (MGM[c.id] || []).concat(m); }
      dropData('mg:inbox'); go('mgchat', { id: c.id, u: seller }); } catch (e) { fail0(e); } };
  const shareShop = (uid) => { const p = prof(uid); const link = inviteLink() + '&shop=' + uid; const text = M('share_shop_t').replace('{n}', shopName(uid)) + (p.mg_handle ? ' @' + p.mg_handle : '') + ' ' + link; if (navigator.share) navigator.share({ title: 'Magaam', text, url: link }).catch(() => {}); else (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(M('copied'))).catch(() => {}); };
  const prodCardMsg = (m) => { const x = PRODS[m.product_id]; if (!x && !m._pl) { m._pl = 1; LV.product(m.product_id).then(v => { if (v) { PRODS[v.id] = v; paintThread(); } }).catch(() => {}); }
    return x ? `<button class="mgmsgprod" data-act="mgprod" data-v="${x.id}">${x.photos && x.photos[0] ? `<img src="${esc(x.photos[0])}" alt="">` : `<i>${catEmoji(x.cat)}</i>`}<span><b>${esc(trText('pt' + x.id, x.title, x.lang))}</b><small class="num">${esc(priceTxt(x))}</small></span></button>` : ''; };

  const prevAct = window.MGACT;
  window.MGACT = (a, v, el) => {
    if (!a.startsWith('mg')) return false;
    if (['mgrsend', 'mgrback', 'mgrverify', 'mgrphoto', 'mgrsave'].includes(a)) { regAct(a, el); return true; }
    if (a === 'mgskipinst') { NK.S.mgSkipInst = true; save(); render(); return true; }
    if (a === 'mginst') { if (bip) { bip.prompt(); bip.userChoice.finally(() => { bip = null; render(); }); } return true; }
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
      case 'mginst': if (bip) { bip.prompt(); bip.userChoice.finally(() => { bip = null; render(); }); } return true;
      case 'mgskipinst': NK.S.mgSkipInst = true; save(); render(); return true;
      case 'mginvite': if (!(LV.profile || {}).invite_code) LV.fetchProfile(meId()).then(pr => { LV.profile = pr; inviteSheet(); }); else inviteSheet(); return true;
      case 'mgcat': go('mgcat', { id: v }); return true;
      case 'mgloc': pickFilterLoc(); return true;
      case 'mgsub': { const nv = { v: 'mgcat', id: v, sub: el.dataset.s || '' }; if (cur().v === 'mgcat' && cur().id === v) { NK.stack[NK.stack.length - 1] = nv; render(); } else go('mgcat', { id: v, sub: nv.sub }); return true; }
      case 'mghandle': if (!(LV.profile || {}).invite_code) LV.fetchProfile(meId()).then(pr => { LV.profile = pr; handleSheet(); }); else handleSheet(); return true;
      case 'mgmyloc': pickMyLoc(); return true;
      case 'mgprod': go('mgprod', { id: v }); return true;
      case 'mgshop': go('mgshop', { id: v }); return true;
      case 'mgsearchgo': { const i = document.getElementById('mgsq'); SQ = i ? i.value : ''; if (cur().v === 'mgsearch') render(); else go('mgsearch'); return true; }
      case 'mgopenshop': shopSheet(); return true;
      case 'mgnewprod': prodSheet(); return true;
      case 'mgsell': if (myShop()) prodSheet(); else shopSheet(); return true;
      case 'mgpedit': prodSheet(PRODS[v]); return true;
      case 'mgpsold': { const x = PRODS[v]; if (!x) return true; const st = x.status === 'sold' ? 'active' : 'sold'; LV.updProduct(v, { status: st }).then(n => { PRODS[v] = n; dropData('mg:'); render(); }).catch(fail); return true; }
      case 'mgfav': { const f = FAV(); const on = !f.has(v); if (on) f.add(v); else f.delete(v); render(); LV.fav(v, on).then(() => dropData('mg:favs')).catch(fail); return true; }
      case 'mgask': askSeller(v); return true;
      case 'mgaskshop': askSeller(null, v); return true;
      case 'mgshareshop': shareShop(v); return true;
      case 'mgprep': { const x = PRODS[v] || {}; LV.report('user', x.seller || v, 'product ' + v + ': ' + (x.title || ''), { snapshot: '🛍 ' + (x.title || '') + ' — ' + priceTxt(x) + '\n' + (x.descr || '').slice(0, 400), target_author: x.seller || null, place: 'Magaam' }).then(() => toast(t('reported'))).catch(fail); return true; }
      case 'mgopen': go('mgchat', { id: v, u: el.dataset.u }); return true;
      case 'mgchatback': NK.back(); return true;
      case 'mgsendm': sendText(); return true;
      case 'mgphoto': sendPhoto(); return true;
      case 'mgattach': attachSheet(); return true;
      case 'mgperson': openPerson(v); return true;
      case 'mgplusmenu': plusMenu(); return true;
      case 'mgmtab': MT = v; render(); return true;
      case 'mglangs': langsSheet(); return true;
      case 'mgrules': NK.S.mg && (NK.S.mg.rulesOk = false); save(); render(); return true;
      case 'mgback': NK.back(); return true;
      case 'mgorig': ORIG[v] = !ORIG[v]; if (cur().v === 'mgchat' && document.getElementById('mgthread')) paintThread(); else render(); return true;
      case 'mgptab': PTAB = v; render(); return true;
      case 'mgcf': if (v === 'friends') { NK.stack[NK.stack.length - 1] = { v: 'mgfriends' }; } else { CF = v; NK.stack[NK.stack.length - 1] = { v: 'mgchats' }; } render(); return true;
      case 'mgfriendsk': go('mgcontacts'); return true;
      case 'mgmenu': { const pr = LV.profile || {}; const w = sheet(`<div class="mgmsheet"><button data-x="notif">${ic('siren')}${FXM('notif_t')}</button><button data-x="invite">${ic('users')}${M('invite')}</button>${pr.verified ? '' : `<button data-x="vf">${ic('check')}${FXM('vf_t')}</button>`}<button data-x="cover">${ic('camera')}${M('cover')}</button>${NK.canAdmin() ? `<button data-x="adm">${ic('shield')}${FXM(isAdmin() ? 'adm_mode_off' : 'adm_mode_on')}</button>` : ''}</div>`);
        w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); const x = b.dataset.x; if (x === 'notif') NK.notifSheet(); if (x === 'invite') inviteSheet(); if (x === 'vf') NK.verifySheet(true); if (x === 'adm') { NK.S.adminMode = !NK.S.adminMode; save(); render(); } if (x === 'cover') pickImg(async d => { try { const url = await LV.upload(d, 'cover'); const np = await LV.updateProfile({ cover_url: url }); NK.S.me = NK.meFrom(np); save(); render(); } catch (er) { fail(er); } }, 1600); }); return true; }
      case 'mgumenu': { const w = sheet(`<div class="mgmsheet"><button data-x="rep" class="bad">${ic('flag')}${t('report')}</button></div>`); w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); LV.report('user', v).then(() => toast(t('reported'))).catch(fail); }); return true; }
      case 'mgpmenu': { const p = ALL[v] || {}; const mine = p.author === meId(); const w = sheet(`<div class="mgmsheet"><button data-x="open">${ic('chat')}${M('all_comments')}</button><button data-x="share">${ic('send')}${M('share')}</button>${mine ? `<button data-x="del" class="bad">${ic('x')}${M('del_msg')}</button>` : `<button data-x="rep" class="bad">${ic('flag')}${t('report')}</button>`}</div>`);
        w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); const x = b.dataset.x; if (x === 'open') go('mgpost', { id: v }); if (x === 'share') sharePost(v); if (x === 'rep') LV.report('post', v).then(() => toast(t('reported'))).catch(fail); if (x === 'del' && confirm(M('del_msg') + '?')) LV.deletePost(v).then(() => { dropData('mg:'); render(); }).catch(fail); }); return true; }
      case 'mgshare': sharePost(v); return true;
      case 'mgcmenu': { const P = pins(); const on = P.includes(v); const w = sheet(`<div class="mgmsheet"><button data-x="pin">${small('pin')}${M(on ? 'unpin' : 'pin')}</button><button data-x="prof">${ic('user')}${t('profile_l')}</button><button data-x="rep" class="bad">${ic('flag')}${t('report')}</button></div>`);
        w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; w.remove(); const x = b.dataset.x; if (x === 'pin') { if (on) P.splice(P.indexOf(v), 1); else P.unshift(v); save(); toast(M(on ? 'unpin' : 'pin') + ' ✓'); } if (x === 'prof') go('mgp', { id: el.dataset.u }); if (x === 'rep') LV.report('user', el.dataset.u).then(() => toast(t('reported'))).catch(fail); }); return true; }
      case 'mgrec': recStart(); return true;
      case 'mgrecx': recStop(false); return true;
      case 'mgrecsend': recStop(true); return true;
      case 'mgplay': playVoice(v); return true;
      case 'mgzoom': zoom(v); return true;
      case 'mgxsearch': { const i = document.getElementById('mgxq'); EXQ.q = i ? i.value : ''; render(); return true; }
      case 'mgxmore': EXQ.n += 30; render(); return true;
      case 'mgcontacts': contactsInvite(); return true;
      case 'mgbtap': if (window.__lastTarget && window.__lastTarget.closest && window.__lastTarget.closest('video,.mgvoice,img')) return true; msgSheet(v); return true;
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
  /* ===== Magaam 8: just a messenger — Chats · Contacts · Me; profiles with a cover and photos; message cards ===== */
  const T8 = {
    chats: D('Чаты', 'Chats', 'الدردشات'), contacts: D('Контакты', 'Contacts', 'جهات الاتصال'),
    add_contact: D('Добавить в контакты', 'Add to contacts', 'إضافة إلى جهات الاتصال'), in_contacts: D('В контактах', 'In contacts', 'في جهات الاتصال'),
    req_sent2: D('Запрос отправлен', 'Request sent', 'تم إرسال الطلب'), photos_n: D('фото', 'photos', 'صور'), contacts_n: D('контактов', 'contacts', 'جهات'),
    add_photo: D('Добавить фото', 'Add photo', 'إضافة صورة'), my_qr: D('Мой QR-код', 'My QR code', 'رمز QR الخاص بي'),
    qr_d: D('Покажите этот код человеку рядом. Он наведёт камеру, установит Magaam, войдёт по почте — и вы сразу окажетесь в контактах друг у друга.', 'Show this code to someone next to you. They point the camera, install Magaam, sign in with email — and you are in each other’s contacts right away.', 'اعرض هذا الرمز لمن بجانبك. يوجّه الكاميرا، يثبّت Magaam، يسجّل بالبريد — وتصبحان فورًا في جهات اتصال بعضكما.'),
    msg_style: D('Вид сообщений', 'Message style', 'شكل الرسائل'), st_cards: D('Карточки', 'Cards', 'بطاقات'), st_bubbles: D('Пузыри', 'Bubbles', 'فقاعات'),
    tr_auto: D('Пишите на своём языке — собеседник получит текст на своём, как от носителя.', 'Write in your language — the other person gets it in theirs, as if a native speaker wrote it.', 'اكتب بلغتك — يستلمها الطرف الآخر بلغته كأن متحدثًا أصليًا كتبها.'),
    edit_cover: D('Сменить шапку', 'Change cover', 'تغيير الغلاف'), no_photos: D('Пока нет фото', 'No photos yet', 'لا صور بعد'),
    find_add: D('Найти по имени или Magaam ID', 'Find by name or Magaam ID', 'ابحث بالاسم أو Magaam ID'), back_nk: D('Вернуться в Nakhlio', 'Back to Nakhlio', 'العودة إلى نخليو'),
    new_chat: D('Новый чат', 'New chat', 'دردشة جديدة'), speaks: D('Пишет на языке', 'Writes in', 'يكتب بـ'),
  };
  const M8 = (k) => L(T8[k]);
  const STYLE = () => NK.S.mgStyle || 'cards';
  const NKL = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#0F5C4C"/><path d="M15 54V30a17 17 0 0 1 34 0v24z" fill="#F6F1E8"/><g fill="none" stroke="#0F5C4C" stroke-width="2.6" stroke-linecap="round"><path d="M32 52V31"/><path d="M32 31c-4-4-10-4.5-14-1.5"/><path d="M32 31c4-4 10-4.5 14-1.5"/><path d="M32 31c-.5-6 .5-10 0-12.5"/></g><circle cx="29" cy="35" r="2.3" fill="#E3A23B"/><circle cx="35" cy="35" r="2.3" fill="#E3A23B"/><circle cx="32" cy="38.5" r="2.3" fill="#E3A23B"/></svg>`;

  /* chats */
  V.mgchats = () => { const r = ready(); if (r) return r; reqCount();
    const inb = want('mg:inbox', () => LV.mgInbox()); INBOX = inb || []; const P = pins();
    const list = (inb || []).slice().sort((a, b) => (P.includes(b.id) - P.includes(a.id)) || (new Date(b.last_at) - new Date(a.last_at)));
    const rows = list.map(c => { const un = Number(c.unread || 0); const mineLast = c.last_sender === meId(); const rd = c.other_read && new Date(c.other_read) >= new Date(c.last_at);
      return `<button class="m8row ${un ? 'un' : ''}" data-act="mgopen" data-v="${c.id}" data-u="${c.other}" data-nm="${esc(mname(c.other).toLowerCase())}">${av(c.other, 'md')}<span class="grow"><span class="m8r1"><b>${esc(mname(c.other))}${vm(c.other)}</b><small class="num">${shortTime(c.last_at)}</small></span><span class="m8r2"><span>${mineLast ? `<i class="mgtick ${rd ? 'rd' : ''}">${rd ? '✓✓' : '✓'}</i> ` : ''}${esc(mineLast ? c.last_body || '' : trText('lb' + c.id + (c.last_body || '').length, c.last_body || '', prof(c.other).ui_lang))}</span>${un ? `<em class="num">${un > 99 ? '99+' : un}</em>` : ''}</span></span></button>`; }).join('');
    return wrapView('mgchats', `<div class="m8wrap"><h1 class="m8big">${M8('chats')}</h1><div class="m8search">${ic('search')}<input type="search" placeholder="${M('search')}" aria-label="${M('search')}" oninput="var q=this.value.toLowerCase();document.querySelectorAll('.m8row').forEach(function(e){e.hidden=e.dataset.nm.indexOf(q)<0})"></div>
      <div class="m8list">${inb === undefined ? loading : rows || `<div class="m8empty">${mgLogo()}<p>${M('no_chats')}</p><button class="m8btn dark" data-act="mggo" data-v="mgcontacts">${M8('contacts')}</button></div>`}</div>
      <p class="m8note">${small('translate')} ${M8('tr_auto')}</p></div>`, ''); };
  V.mg = () => V.mgchats();

  /* contacts */
  V.mgcontacts = () => { const r = ready(); if (r) return r; const rel = R(); const n = reqCount();
    const fr = [...rel.friends].sort((a, b) => mname(a).localeCompare(mname(b), NK.lang));
    let letter = ''; const rows = fr.map(u => { const L0 = (mname(u)[0] || '#').toUpperCase(); const h = L0 !== letter ? `<div class="m8letter">${esc(L0)}</div>` : ''; letter = L0;
      return h + `<button class="m8row" data-act="mgp" data-v="${u}">${av(u, 'md')}<span class="grow"><span class="m8r1"><b>${esc(mname(u))}${vm(u)}</b></span>${prof(u).mg_handle ? `<span class="m8r2"><span>@${esc(prof(u).mg_handle)}</span></span>` : ''}</span></button>`; }).join('');
    const reqs = rel.inc.map(q => `<div class="m8row"><button class="pbtn" data-act="mgp" data-v="${q.from_id}">${av(q.from_id, 'md')}</button><span class="grow"><span class="m8r1"><b>${esc(mname(q.from_id))}</b></span></span><button class="m8btn sm dark" data-act="mgacc" data-v="${q.id}">${M('accept')}</button><button class="m8btn sm" data-act="mgdec" data-v="${q.id}">${M('decline')}</button></div>`).join('');
    return wrapView('mgcontacts', `<div class="m8wrap"><h1 class="m8big">${M8('contacts')}</h1>
      <div class="m8list">${`<button class="m8row sys" data-act="mggo" data-v="mgfind"><span class="m8ic">${ic('search')}</span><span class="grow"><b>${M8('find_add')}</b></span>${ic('chev', 'flip chev')}</button><button class="m8row sys" data-act="mgqr"><span class="m8ic">${ic('grid')}</span><span class="grow"><b>${M8('my_qr')}</b></span>${ic('chev', 'flip chev')}</button><button class="m8row sys" data-act="mginvite"><span class="m8ic">${ic('plus')}</span><span class="grow"><b>${M('invite')}</b></span>${ic('chev', 'flip chev')}</button>`}</div>
      ${n ? `<h4 class="m8h">${M('requests')} · <span class="num">${n}</span></h4><div class="m8list">${reqs}</div>` : ''}
      <div class="m8list">${rows || `<p class="m8note" style="padding:16px">${M('no_contacts')}</p>`}</div></div>`, ''); };

  /* profile: cover, photo, name, about, photos */
  const prof8 = (uid) => {
    const me = uid === meId(); const pr = me ? LV.profile || {} : (LV.cached(uid) || want('mg:pf:' + uid, () => LV.fetchProfile(uid)) || {});
    const all = keep(want('mg:up:' + uid, () => LV.posts('grid', uid))) || []; const rel = R(); const fr = rel.friends.has(uid), rq = rel.out.has(uid);
    const lng = pr.ui_lang ? `<span class="m8lang">${small('globe')}${M8('speaks')}: ${esc(langName(pr.ui_lang))}${!me && pr.ui_lang !== NK.lang ? ` · <b>${M('tr_for_you')}</b>` : ''}</span>` : '';
    const acts = me ? `<button class="m8btn" data-act="mgedit">${M('edit_l')}</button><button class="m8btn" data-act="mgqr">${M8('my_qr')}</button>`
      : `${fr ? `<button class="m8btn dark" data-act="mgdm" data-v="${uid}">${ic('chat')}${M('write')}</button><button class="m8btn" disabled>${small('check')}${M8('in_contacts')}</button>` : `<button class="m8btn dark" data-act="mgfriend" data-v="${uid}" ${rq ? 'disabled' : ''}>${rq ? M8('req_sent2') : M8('add_contact')}</button>`}<button class="m8btn sq" data-act="mgumenu" data-v="${uid}" aria-label="${M('more_l')}">${ic('dots')}</button>`;
    const tile = (x) => x.media_type === 'video' ? `<button class="vid" data-act="mgpost" data-v="${x.id}"><video src="${esc(x.media_url)}#t=0.5" muted playsinline preload="metadata"></video>${ic('play')}</button>` : `<button data-act="mgpost" data-v="${x.id}" style="background-image:url(${esc(x.media_url)})"></button>`;
    return `<div class="m8prof"><div class="m8cover" style="${pr.cover_url ? `background-image:url(${esc(pr.cover_url)})` : ''}">${me ? `<button class="m8covbtn" data-act="mgcover">${small('camera')}${M8('edit_cover')}</button>` : ''}</div>
      <div class="m8head"><div class="m8av">${av(uid, 'xl')}</div><h2>${esc(mname(uid))}${vm(uid)}</h2>${pr.mg_handle ? `<div class="m8handle">@${esc(pr.mg_handle)}</div>` : ''}
        ${pr.mg_bio ? `<p class="m8bio">${esc(me ? pr.mg_bio : trText('a' + uid, pr.mg_bio, pr.ui_lang))}</p>${me ? '' : trBadge('a' + uid)}` : me ? `<button class="mglink" data-act="mgedit">+ ${t('about_l')}</button>` : ''}
        <div class="m8stats"><div><b class="num">${nf(all.length)}</b><small>${M8('photos_n')}</small></div>${me ? `<button data-act="mggo" data-v="mgcontacts"><b class="num">${nf(rel.friends.size)}</b><small>${M8('contacts_n')}</small></button>` : ''}</div>
        ${lng}<div class="m8acts">${acts}</div></div>
      <div class="m8grid">${me ? `<button class="add" data-act="mgnew">${ic('plus')}<small>${M8('add_photo')}</small></button>` : ''}${all.map(tile).join('')}${!me && !all.length ? `<p class="m8note" style="grid-column:1/-1;text-align:center;padding:24px 0">${M8('no_photos')}</p>` : ''}</div></div>`; };
  V.mgp = (p) => { const r = ready(); if (r) return r; if (p.id === meId()) return V.mgmine(); return wrapView('mgp', prof8(p.id), ''); };
  V.mgmine = () => { const r = ready(); if (r) return r; return wrapView('mgmine', prof8(meId()), ''); };

  /* me */
  V.mgme = () => { const r = ready(); if (r) return r; const pr = LV.profile || {};
    const row = (act, icn, label, v, extra) => `<button class="m8row sys" data-act="${act}" ${v ? `data-v="${v}"` : ''}><span class="m8ic">${icn}</span><span class="grow"><b>${label}</b></span>${extra ? `<small class="m8val">${extra}</small>` : ''}${ic('chev', 'flip chev')}</button>`;
    return wrapView('mgme', `<div class="m8wrap"><h1 class="m8big">${M('me_t')}</h1>
      <button class="m8mecard" data-act="mggo" data-v="mgmine">${av(meId(), 'me')}<span class="grow"><b>${esc(mname(meId()))}${vm(meId())}</b><small>${pr.mg_handle ? '@' + esc(pr.mg_handle) : 'Magaam ID: ' + esc(pr.invite_code || '—')}</small></span>${ic('chev', 'flip chev')}</button>
      ${isAdmin() ? `<button class="mgadmmode" data-act="admmode">${small('shield')}<b>${FXM('adm_badge')}</b><span>${FXM('adm_mode_off')}</span></button>` : ''}
      <div class="m8list">${row('mgqr', ic('grid'), M8('my_qr'))}${row('mginvite', ic('users'), M('invite'))}${pr.verified ? '' : row('vfopen', ic('check'), FXM('vf_t'), 'mg')}</div>
      <div class="m8list">${row('mgstyle', ic('chat'), M8('msg_style'), '', M8(STYLE() === 'cards' ? 'st_cards' : 'st_bubbles'))}${row('mglangs', ic('globe'), t('language'), '', esc(langName(NK.lang)))}${row('notifset', ic('siren'), FXM('notif_t'))}</div>
      <div class="m8list">${row('mgedit', ic('user'), t('edit_profile'))}${NK.canAdmin() ? row('admmode', ic('shield'), FXM(isAdmin() ? 'adm_mode_off' : 'adm_mode_on')) : ''}${row('mgrules', ic('info'), M('rules_mg'))}</div>
      ${window.MG_APP ? '' : `<div class="m8list"><button class="m8row sys" data-act="tab" data-v="home"><span class="m8ic nk">${NKL}</span><span class="grow"><b>${M8('back_nk')}</b></span>${ic('chev', 'flip chev')}</button></div>`}
      <p class="m8note">${small('translate')} ${M8('tr_auto')}</p></div>`, ''); };

  /* the old social and shop screens lead back to the messenger */
  ['mgexplore', 'mgmoments', 'mgcats', 'mgcat', 'mgsearch', 'mgfavs', 'mgshop', 'mgreels', 'mgfriends'].forEach(k => { V[k] = k === 'mgshop' ? (p) => V.mgp(p) : () => V.mgchats(); });

  const qrSheet = () => { const pr = LV.profile || {}; const link = inviteLink() + (pr.mg_handle ? '&u=' + pr.mg_handle : '');
    const w = sheet(`<div class="m8qr"><div class="m8qrav">${av(meId(), 'md')}<b>${esc(mname(meId()))}</b>${pr.mg_handle ? `<small>@${esc(pr.mg_handle)}</small>` : ''}</div><div class="m8qrbox" id="m8qr"></div><p class="note">${M8('qr_d')}</p><button class="btn primary full mgbtn" data-x="share">${small('send')}${M('share')}</button></div>`);
    try { new window.QRCode(w.querySelector('#m8qr'), { text: link, width: 220, height: 220, colorDark: '#1C1C1E', colorLight: '#ffffff' }); } catch (e) { w.querySelector('#m8qr').textContent = link; }
    w.querySelector('[data-x="share"]').onclick = () => { if (navigator.share) navigator.share({ title: 'Magaam', text: M('inv_text'), url: link }).catch(() => {}); else (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(() => toast(M('copied'))).catch(() => {}); }; };
  const styleSheet = () => { const w = sheet(`<h3>${M8('msg_style')}</h3><div class="m8styles"><button data-x="cards" class="${STYLE() === 'cards' ? 'on' : ''}"><span class="m8demo cards"><i></i><i class="me"></i><i></i></span><b>${M8('st_cards')}</b></button><button data-x="bubbles" class="${STYLE() === 'bubbles' ? 'on' : ''}"><span class="m8demo bubbles"><i></i><i class="me"></i><i></i></span><b>${M8('st_bubbles')}</b></button></div>`);
    w.addEventListener('click', e => { const b = e.target.closest('[data-x]'); if (!b) return; NK.S.mgStyle = b.dataset.x; save(); w.remove(); render(); }); };
  window.MG8STYLE = STYLE;

  const prev8 = window.MGACT;
  window.MGACT = (a, v, el) => {
    switch (a) {
      case 'mgqr': if (!(LV.profile || {}).invite_code) LV.fetchProfile(meId()).then(pr => { LV.profile = pr; qrSheet(); }); else qrSheet(); return true;
      case 'mgstyle': styleSheet(); return true;
      case 'mgback': if (NK.stack.length > 1) NK.back(); else { NK.stack.length = 1; NK.stack[0] = { v: 'mgchats' }; render(true); } return true;
      case 'mgplusmenu': go('mgcontacts'); return true;
      case 'mgsell': go('mgcontacts'); return true;
      case 'mgdec': LV.answerRequest(v, false).then(() => { dropData('mg:rel'); render(); }).catch(fail0); return true;
    }
    return prev8(a, v, el);
  };
}
try { if (document.querySelector('#root .app')) render(); } catch (e) {}
})();
