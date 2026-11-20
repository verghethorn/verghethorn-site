/* Nakhlio prototype data. All listings are realistic examples for the demo.
   Prices are based on public asking prices in Medina (Aqar, Bayut, Gathern, rental companies), November 2026. */
(function () {
const D = (ru, en, ar) => ({ ru, en, ar });

window.AMEN = {
  wifi: D('Wi-Fi', 'Wi-Fi', 'واي فاي'),
  ac: D('Кондиционер', 'Air conditioning', 'تكييف'),
  water: D('Вода', 'Water', 'الماء'),
  power: D('Электричество', 'Electricity', 'الكهرباء'),
  parking: D('Парковка', 'Parking', 'موقف سيارة'),
  lift: D('Лифт', 'Lift', 'مصعد'),
  kitchen: D('Кухня', 'Kitchen', 'مطبخ'),
  washer: D('Стиральная машина', 'Washing machine', 'غسالة'),
  cleaning: D('Уборка', 'Cleaning', 'تنظيف'),
  security: D('Охрана 24/7', '24/7 security', 'حراسة 24/7'),
  pool: D('Бассейн', 'Pool', 'مسبح'),
};

const DIST = {
  central: D('Центральная зона', 'Central Area', 'المنطقة المركزية'),
  ranuna: D('Ар-Рануна', 'Al Ranuna', 'الرانوناء'),
  fath: D('Аль-Фатх', 'Al Fath', 'الفتح'),
  sultanah: D('Султана', 'Sultanah', 'سلطانة'),
  rayah: D('Ар-Рая', 'Al Rayah', 'الراية'),
  jamiah: D('Аль-Джамиа', 'Al Jamiah', 'الجامعة'),
  qaswa: D('Аль-Кусва', 'Al Qaswa', 'القصواء'),
  salam: D('Ас-Салам', 'As Salam', 'السلام'),
  iskan: D('Аль-Искан', 'Al Iskan', 'الإسكان'),
  aziziyah: D('Аль-Азизия', 'Al Aziziyah', 'العزيزية'),
};
window.DIST = DIST;

window.HOUSING = [
  { id: 'H-1041', term: 'daily', price: 280, dist: 'central', walk: 5, rooms: 1, baths: 1, guests: 2, floor: 6, furnished: true, aud: 'any', featured: true, rating: 4.9,
    title: D('Студия в 5 минутах от Мечети Пророка', 'Studio 5 minutes from the Prophet’s Mosque', 'استوديو على بعد 5 دقائق من المسجد النبوي'),
    desc: D('Светлая студия в новом доме с видом на минареты. Кровать для двоих, мини-кухня, тихий кондиционер. Идеально для паломников и коротких визитов.',
            'A bright studio in a new building with a view of the minarets. Double bed, kitchenette and a quiet air conditioner. Ideal for pilgrims and short stays.',
            'استوديو مشرق في مبنى جديد بإطلالة على المآذن. سرير مزدوج ومطبخ صغير وتكييف هادئ. مثالي للزوار والإقامات القصيرة.'),
    amen: ['wifi', 'ac', 'kitchen', 'lift', 'cleaning'], photos: ['bed4', 'liv12', 'kit2', 'bed1'],
    pay: D('Оплата при заселении', 'Pay on check-in', 'الدفع عند الوصول'), dep: 0, agency: 'Al Haram Stays' },
  { id: 'H-1042', term: 'daily', price: 420, dist: 'ranuna', km: 3.2, rooms: 3, baths: 2, guests: 6, floor: 2, furnished: true, aud: 'families', featured: true, rating: 4.8,
    title: D('Семейная квартира, 3 спальни, до 6 гостей', 'Family apartment, 3 bedrooms, sleeps 6', 'شقة عائلية 3 غرف نوم تتسع لـ 6 ضيوف'),
    desc: D('Просторная квартира для семьи: большая гостиная с маджлисом, полностью оборудованная кухня, две ванные. Рядом супермаркет и аптека.',
            'A spacious family apartment: a large living room with a majlis, a fully equipped kitchen and two bathrooms. Supermarket and pharmacy nearby.',
            'شقة واسعة للعائلات: صالة كبيرة مع مجلس ومطبخ مجهز بالكامل ودورتا مياه. سوبرماركت وصيدلية قريبة.'),
    amen: ['wifi', 'ac', 'kitchen', 'washer', 'parking', 'lift'], photos: ['liv3', 'bed7', 'kit3', 'bed2'],
    pay: D('Оплата при заселении', 'Pay on check-in', 'الدفع عند الوصول'), dep: 300, agency: 'Taybah Homes' },
  { id: 'H-1043', term: 'daily', price: 170, dist: 'fath', km: 4.5, rooms: 1, baths: 1, guests: 3, floor: 3, furnished: true, aud: 'any', rating: 4.6,
    title: D('Гостиничная квартира: спальня и гостиная', 'Serviced apartment: bedroom and living room', 'شقة فندقية: غرفة نوم وصالة'),
    desc: D('Чистая квартира в апарт-отеле с ресепшеном 24/7. Ежедневная уборка, парковка у входа, 10 минут на такси до Харама.',
            'A clean apartment in an aparthotel with a 24/7 reception. Daily cleaning, parking at the entrance, 10 minutes by taxi to the Haram.',
            'شقة نظيفة في فندق شقق باستقبال على مدار الساعة. تنظيف يومي وموقف عند المدخل، 10 دقائق بالتاكسي إلى الحرم.'),
    amen: ['wifi', 'ac', 'cleaning', 'parking', 'security'], photos: ['liv5', 'bed9', 'kit1'],
    pay: D('Оплата при заселении', 'Pay on check-in', 'الدفع عند الوصول'), dep: 0, agency: 'Madinah Suites' },
  { id: 'M-2051', term: 'monthly', price: 1200, dist: 'sultanah', km: 2.1, rooms: 1, baths: 1, guests: 1, floor: 1, furnished: true, aud: 'singles', featured: true, rating: 4.7,
    title: D('Студия для одного, всё включено', 'Studio for one, bills included', 'استوديو لشخص واحد شامل الفواتير'),
    desc: D('Уютная студия с мебелью. Вода, электричество и интернет уже в цене. Рядом остановка автобуса до Харама.',
            'A cosy furnished studio. Water, electricity and internet are included in the price. Bus stop to the Haram nearby.',
            'استوديو مريح ومفروش. الماء والكهرباء والإنترنت مشمولة في السعر. موقف حافلات إلى الحرم قريب.'),
    amen: ['wifi', 'ac', 'water', 'power', 'kitchen'], photos: ['bed10', 'liv8', 'kit5'],
    pay: D('Ежемесячно', 'Monthly', 'شهرياً'), dep: 500, agency: 'Taybah Homes' },
  { id: 'M-2052', term: 'monthly', price: 3200, dist: 'central', walk: 15, rooms: 2, baths: 2, guests: 4, floor: 8, furnished: true, aud: 'families', featured: true, rating: 4.9,
    title: D('2 спальни с мебелью, 15 минут пешком до Харама', '2 bedrooms, furnished, 15 min walk to the Haram', 'غرفتا نوم مفروشتان، 15 دقيقة مشياً إلى الحرم'),
    desc: D('Современная квартира на 8 этаже. Две спальни, гостиная, кухня с техникой. Лифт и охрана в здании.',
            'A modern apartment on the 8th floor. Two bedrooms, a living room and a kitchen with appliances. Lift and security in the building.',
            'شقة حديثة في الدور الثامن. غرفتا نوم وصالة ومطبخ مجهز. مصعد وحراسة في المبنى.'),
    amen: ['wifi', 'ac', 'kitchen', 'washer', 'lift', 'security'], photos: ['liv1', 'bed3', 'kit4', 'liv9'],
    pay: D('Ежемесячно', 'Monthly', 'شهرياً'), dep: 1500, agency: 'Al Haram Stays' },
  { id: 'M-2053', term: 'monthly', price: 5000, dist: 'rayah', km: 6.8, rooms: 3, baths: 3, guests: 6, floor: 4, furnished: true, aud: 'families', rating: 4.8,
    title: D('3 спальни для семьи с мебелью', 'Furnished 3-bedroom family apartment', 'شقة عائلية مفروشة 3 غرف نوم'),
    desc: D('Большая квартира в спокойном районе. Отдельный маджлис для гостей, три ванные, детская площадка во дворе.',
            'A large apartment in a quiet district. A separate majlis for guests, three bathrooms and a playground in the yard.',
            'شقة كبيرة في حي هادئ. مجلس منفصل للضيوف وثلاث دورات مياه وملعب أطفال في الفناء.'),
    amen: ['wifi', 'ac', 'kitchen', 'washer', 'parking', 'lift', 'pool'], photos: ['liv7', 'bed5', 'kit6', 'bed8'],
    pay: D('Ежемесячно', 'Monthly', 'شهرياً'), dep: 2500, agency: 'Rayah Properties' },
  { id: 'M-2054', term: 'monthly', price: 900, dist: 'jamiah', km: 7.5, rooms: 1, baths: 1, guests: 1, floor: 2, furnished: true, aud: 'singles', rating: 4.5,
    title: D('Комната для студента у Исламского университета', 'Student room near the Islamic University', 'غرفة لطالب قرب الجامعة الإسلامية'),
    desc: D('Отдельная комната в квартире на 3 студентов. Общая кухня и гостиная, 7 минут пешком до университета.',
            'A private room in a flat shared by 3 students. Shared kitchen and living room, 7 minutes’ walk to the university.',
            'غرفة خاصة في شقة لثلاثة طلاب. مطبخ وصالة مشتركة، 7 دقائق مشياً إلى الجامعة.'),
    amen: ['wifi', 'ac', 'water', 'power', 'kitchen', 'washer'], photos: ['bed6', 'liv2', 'kit1'],
    pay: D('Ежемесячно', 'Monthly', 'شهرياً'), dep: 300, agency: 'Taybah Homes' },
  { id: 'Y-3061', term: 'yearly', price: 23000, dist: 'qaswa', km: 5.4, rooms: 3, baths: 2, guests: 5, floor: 1, furnished: false, aud: 'families', featured: true, rating: 4.7,
    title: D('3 комнаты без мебели, для семьи', 'Unfurnished 3-room flat for a family', 'شقة غير مفروشة 3 غرف للعوائل'),
    desc: D('Квартира в новом доме, кухня с установленными шкафами, отдельный вход. Подходит для долгого проживания семьи.',
            'An apartment in a new building, kitchen with fitted cabinets and a private entrance. Suits a family staying long term.',
            'شقة في مبنى جديد، مطبخ راكب ومدخل خاص. مناسبة لإقامة عائلية طويلة.'),
    amen: ['ac', 'kitchen', 'parking'], photos: ['liv6', 'kit3', 'bed2'],
    pay: D('2 платежа в год', '2 payments a year', 'دفعتان سنوياً'), dep: 2000, agency: 'Qaswa Real Estate' },
  { id: 'Y-3062', term: 'yearly', price: 34000, dist: 'salam', km: 4.1, rooms: 4, baths: 3, guests: 7, floor: 2, furnished: false, aud: 'families', rating: 4.8,
    title: D('4 комнаты в новом доме, парковка', '4 rooms in a new building, parking', '4 غرف في مبنى جديد مع موقف'),
    desc: D('Новая квартира с большой гостиной и балконом. Своё парковочное место, лифт, рядом школы и мечеть.',
            'A new apartment with a large living room and balcony. Own parking space, lift, schools and a mosque nearby.',
            'شقة جديدة بصالة كبيرة وشرفة. موقف خاص ومصعد، والمدارس والمسجد قريبة.'),
    amen: ['ac', 'kitchen', 'parking', 'lift'], photos: ['liv4', 'bed7', 'kit4', 'liv10'],
    pay: D('2 или 4 платежа в год', '2 or 4 payments a year', 'دفعتان أو أربع دفعات سنوياً'), dep: 3000, agency: 'Salam Estates' },
  { id: 'Y-3063', term: 'yearly', price: 58000, dist: 'iskan', km: 3.6, rooms: 3, baths: 3, guests: 5, floor: 9, furnished: true, aud: 'families', featured: true, rating: 5.0,
    title: D('Премиум: 3 спальни в новом комплексе', 'Premium: 3 bedrooms in a new compound', 'فاخرة: 3 غرف نوم في مجمع جديد'),
    desc: D('Квартира в охраняемом комплексе с бассейном и спортзалом. Дизайнерский ремонт, вид на город, подземная парковка.',
            'An apartment in a gated compound with a pool and gym. Designer finish, city views and underground parking.',
            'شقة في مجمع مسوّر بمسبح ونادٍ رياضي. تشطيب فاخر وإطلالة على المدينة وموقف تحت الأرض.'),
    amen: ['wifi', 'ac', 'kitchen', 'washer', 'parking', 'lift', 'security', 'pool'], photos: ['liv11', 'bed1', 'kit6', 'liv9'],
    pay: D('1, 2 или 4 платежа в год', '1, 2 or 4 payments a year', 'دفعة أو دفعتان أو أربع دفعات سنوياً'), dep: 5000, agency: 'Iskan Premium' },
];

/* ---------- transport ---------- */
const T = [];
const car = (n, model, year, term, price, photo, extra) => T.push(Object.assign({ id: 'C-' + (4100 + n), kind: 'cars', model, year, term, price, photo, seats: 5, gear: 'auto', km: term === 'daily' ? 300 : 6000 }, extra || {}));
car(1, 'Toyota Yaris', 2024, 'daily', 130, 'car1', { featured: true });
car(2, 'Hyundai Accent', 2025, 'daily', 120, 'car3');
car(3, 'Toyota Camry', 2024, 'daily', 280, 'car4');
car(4, 'Hyundai Staria', 2024, 'daily', 550, 'car7', { seats: 11 });
car(5, 'Kia Pegas', 2024, 'monthly', 1600, 'car5');
car(6, 'Toyota Yaris', 2024, 'monthly', 2700, 'car2', { featured: true });
car(7, 'Toyota RAV4', 2024, 'monthly', 4200, 'car6');
car(8, 'Hyundai Accent', 2024, 'yearly', 27600, 'car3');
car(9, 'Toyota Camry', 2024, 'yearly', 37200, 'car8');
car(10, 'Toyota Land Cruiser', 2023, 'yearly', 90000, 'car4', { seats: 7 });

const sco = (n, model, cc, term, price, photo, extra) => T.push(Object.assign({ id: 'S-' + (5100 + n), kind: 'scooters', model, cc, term, price, photo, seats: 2, year: 2024 }, extra || {}));
sco(1, 'Honda PCX 125', 125, 'daily', 90, 'sco2', { featured: true });
sco(2, 'Yamaha NMAX 155', 155, 'daily', 110, 'sco3');
sco(3, 'Suzuki Burgman 200', 200, 'daily', 140, 'sco5');
sco(4, 'Vespa Primavera 125', 125, 'daily', 160, 'sco8');
sco(5, 'Honda PCX 125', 125, 'monthly', 1200, 'sco4');
sco(6, 'Yamaha NMAX 155', 155, 'monthly', 1400, 'sco1');
sco(7, 'Suzuki Burgman 200', 200, 'monthly', 1700, 'sco6');
sco(8, 'Honda Dio 110', 110, 'monthly', 950, 'sco7');
sco(9, 'Honda PCX 125', 125, 'yearly', 10800, 'sco2');
sco(10, 'Yamaha NMAX 155', 155, 'yearly', 13200, 'sco3');

const esc = (n, model, range, term, price, photo, extra) => T.push(Object.assign({ id: 'E-' + (6100 + n), kind: 'escooters', model, range, term, price, photo, seats: 1, year: 2025 }, extra || {}));
esc(1, 'Xiaomi Electric Scooter 4', 35, 'daily', 60, 'esc1', { featured: true });
esc(2, 'Segway Ninebot Max G30', 65, 'daily', 80, 'esc4');
esc(3, 'Segway Ninebot F2', 40, 'daily', 70, 'esc2');
esc(4, 'Kaabo Mantis', 80, 'daily', 120, 'esc6');
esc(5, 'Xiaomi Electric Scooter 4', 35, 'monthly', 450, 'esc3');
esc(6, 'Segway Ninebot Max G30', 65, 'monthly', 550, 'esc7');
esc(7, 'Segway Ninebot F2', 40, 'monthly', 500, 'esc5');
esc(8, '2 × Xiaomi Electric Scooter 4', 35, 'monthly', 800, 'esc3', { seats: 2 });
esc(9, 'Xiaomi Electric Scooter 4', 35, 'yearly', 4200, 'esc1');
esc(10, 'Segway Ninebot Max G30', 65, 'yearly', 5040, 'esc4');
window.TRANSPORT = T;

/* ---------- classifieds ---------- */
window.ADS = [
  { id: 'A-701', cat: D('Домашняя еда', 'Home food', 'أكل بيتي'), title: D('Торты и медовик на заказ', 'Custom cakes and honey cake', 'كيك وكعكة العسل حسب الطلب'), price: D('от 120 SAR', 'from 120 SAR', 'من 120 ر.س'), who: D('Амина · говорит по-русски, по-арабски', 'Amina · speaks Russian, Arabic', 'أمينة · تتحدث الروسية والعربية'), photo: 'kit3', boosted: true },
  { id: 'A-702', cat: D('Вещи', 'Things', 'أغراض'), title: D('Диван-уголок, как новый, уезжаем', 'Corner sofa, like new, moving out', 'كنبة زاوية كالجديدة، بسبب السفر'), price: D('650 SAR', '650 SAR', '650 ر.س'), who: D('Ибрагим · Аль-Азизия', 'Ibrahim · Al Aziziyah', 'إبراهيم · العزيزية'), photo: 'liv6' },
  { id: 'A-703', cat: D('Услуги', 'Services', 'خدمات'), title: D('Электрик: розетки, свет, кондиционеры', 'Electrician: sockets, lights, AC', 'كهربائي: أفياش وإنارة ومكيفات'), price: D('от 80 SAR', 'from 80 SAR', 'من 80 ر.س'), who: D('Усман · говорит на урду, английском', 'Usman · speaks Urdu, English', 'عثمان · يتحدث الأردية والإنجليزية'), photo: 'liv12', pro: true },
  { id: 'A-704', cat: D('Услуги', 'Services', 'خدمات'), title: D('Переезд: грузчики и машина', 'Moving: movers and a truck', 'نقل عفش: عمال وسيارة'), price: D('от 250 SAR', 'from 250 SAR', 'من 250 ر.س'), who: D('Тимур · по всей Медине', 'Timur · all over Medina', 'تيمور · في كل المدينة'), photo: 'car7' },
  { id: 'A-705', cat: D('Учёба', 'Lessons', 'دروس'), title: D('Арабский язык с нуля, онлайн и очно', 'Arabic from zero, online and in person', 'العربية من الصفر، عن بعد وحضورياً'), price: D('60 SAR / урок', '60 SAR / lesson', '60 ر.س / درس'), who: D('Устаз Халид · выпускник Исламского университета', 'Ustaz Khalid · Islamic University graduate', 'الأستاذ خالد · خريج الجامعة الإسلامية'), photo: 'liv8', pro: true },
  { id: 'A-706', cat: D('Отдам даром', 'Free', 'مجاناً'), title: D('Детская кроватка и коляска', 'Baby cot and stroller', 'سرير أطفال وعربة'), price: D('Бесплатно', 'Free', 'مجاناً'), who: D('Мариям · Ас-Салам', 'Maryam · As Salam', 'مريم · السلام'), photo: 'bed6' },
];

window.PARCELS = [
  { id: 'P-801', kind: 'flying', from: D('Медина', 'Medina', 'المدينة'), to: D('Москва', 'Moscow', 'موسكو'), date: '2026-12-02', kg: 3, who: D('Рустам', 'Rustam', 'رستم') },
  { id: 'P-802', kind: 'flying', from: D('Медина', 'Medina', 'المدينة'), to: D('Джакарта', 'Jakarta', 'جاكرتا'), date: '2026-12-05', kg: 5, who: D('Сити', 'Siti', 'سيتي') },
  { id: 'P-803', kind: 'need', from: D('Казань', 'Kazan', 'قازان'), to: D('Медина', 'Medina', 'المدينة'), date: '2026-12-15', kg: 1, what: D('Документы для университета', 'University documents', 'أوراق للجامعة'), who: D('Адель', 'Adel', 'عادل') },
  { id: 'P-804', kind: 'need', from: D('Медина', 'Medina', 'المدينة'), to: D('Лахор', 'Lahore', 'لاهور'), date: '2026-12-10', kg: 2, what: D('Финики и подарки семье', 'Dates and gifts for family', 'تمور وهدايا للعائلة'), who: D('Билал', 'Bilal', 'بلال') },
];

window.HELP = [
  { id: 'G-901', title: D('Встречу в аэропорту и довезу до жилья', 'I’ll meet you at the airport and drive you home', 'أستقبلك في المطار وأوصلك إلى السكن'), price: D('150 SAR', '150 SAR', '150 ر.س'), who: D('Абдулла · RU, AR', 'Abdullah · RU, AR', 'عبدالله · روسي، عربي') },
  { id: 'G-902', title: D('Переводчик в больницу, банк, госучреждения', 'Interpreter for hospital, bank, offices', 'مترجم للمستشفى والبنك والدوائر'), price: D('100 SAR / час', '100 SAR / hour', '100 ر.س / ساعة'), who: D('Зарина · RU, AR, EN', 'Zarina · RU, AR, EN', 'زارينا · روسي، عربي، إنجليزي') },
  { id: 'G-903', title: D('Помощь пожилым родителям на зиярате', 'Help for elderly parents during Ziyarah', 'مساعدة كبار السن في الزيارة'), price: D('200 SAR / день', '200 SAR / day', '200 ر.س / يوم'), who: D('Мухаммад · UR, AR, EN', 'Muhammad · UR, AR, EN', 'محمد · أردو، عربي، إنجليزي') },
  { id: 'G-904', title: D('Покажу районы перед арендой жилья', 'I’ll show you districts before you rent', 'أعرّفك على الأحياء قبل الاستئجار'), price: D('120 SAR', '120 SAR', '120 ر.س'), who: D('Ахмад · ID, AR', 'Ahmad · ID, AR', 'أحمد · إندونيسي، عربي') },
];

/* ---------- Majlis ---------- */
window.TOPICS = ['iqama', 'bank', 'sim', 'insurance', 'licence', 'ejar', 'travel', 'study', 'places', 'doctors'];
window.POSTS = {
  iqama: [
    { q: true, who: 'Saeed · 2026-10', text: D('Как проверить, готова ли иqама после продления?', 'How do I check if my Iqama is ready after renewal?', 'كيف أتحقق من جاهزية الإقامة بعد التجديد؟'), helped: 18,
      a: [{ who: 'Murad · 2026-10', text: D('Через приложение Absher: «Мои услуги» → «Паспорта» → «Продление иqамы». У меня статус обновился через 2 дня.', 'In the Absher app: “My services” → “Passports” → “Iqama renewal”. My status updated after 2 days.', 'من تطبيق أبشر: «خدماتي» ← «الجوازات» ← «تجديد الإقامة». تحدثت الحالة عندي بعد يومين.'), helped: 24 }] },
    { q: false, who: 'Olga · 2026-09', text: D('Мой опыт: регистрировалась в Absher в отделении Jawazat у вокзала. Взяла паспорт и иqаму, очередь 40 минут, всё сделали в тот же день.', 'My experience: I registered for Absher at the Jawazat office near the station. Took my passport and Iqama, 40 minutes of queue, done the same day.', 'تجربتي: سجّلت في أبشر في مكتب الجوازات قرب المحطة. أحضرت الجواز والإقامة، انتظرت 40 دقيقة وتم كل شيء في نفس اليوم.'), helped: 31 },
  ],
  bank: [
    { q: true, who: 'Hasan · 2026-11', text: D('Какой банк быстрее всего открывает счёт по новой иqаме?', 'Which bank opens an account fastest with a new Iqama?', 'أي بنك يفتح الحساب بسرعة بإقامة جديدة؟'), helped: 12,
      a: [{ who: 'Daniyar · 2026-11', text: D('Открывал онлайн через приложение банка за 20 минут, карту привезли домой через 3 дня. Нужен активный Absher.', 'I opened it online in the bank’s app in 20 minutes, the card was delivered in 3 days. You need an active Absher.', 'فتحته عبر تطبيق البنك خلال 20 دقيقة ووصلتني البطاقة بعد 3 أيام. تحتاج حساب أبشر مفعّل.'), helped: 19 }] },
  ],
  sim: [
    { q: false, who: 'Ayesha · 2026-08', text: D('SIM-карту купила прямо в аэропорту Медины, нужен только паспорт. Потом перерегистрировала на иqаму в салоне за 5 минут.', 'I bought a SIM card right at Medina airport, only a passport needed. Later re-registered it to my Iqama in a store in 5 minutes.', 'اشتريت الشريحة من مطار المدينة مباشرة، تحتاج الجواز فقط. ثم نقلتها على الإقامة في المحل خلال 5 دقائق.'), helped: 22 },
  ],
  study: [
    { q: true, who: 'Abdurahman · 2026-10', text: D('Кто поступал в Исламский университет? Сколько ждали ответа?', 'Who applied to the Islamic University? How long did you wait for an answer?', 'من التحق بالجامعة الإسلامية؟ كم انتظرتم الرد؟'), helped: 9,
      a: [{ who: 'Yusuf · 2026-10', text: D('Подавал документы весной, ответ пришёл в июле. Главное — заранее перевести и заверить аттестат.', 'I applied in spring and got the answer in July. The key is to translate and certify your diploma in advance.', 'قدّمت في الربيع وجاء الرد في يوليو. المهم ترجمة الشهادة وتوثيقها مسبقاً.'), helped: 14 }] },
  ],
  doctors: [
    { q: false, who: 'Leyla · 2026-09', text: D('Хороший педиатр, говорит по-английски, в частной клинике в Аль-Азизии. Запись через приложение клиники, ждали 15 минут.', 'A good paediatrician who speaks English, at a private clinic in Al Aziziyah. Booked via the clinic’s app, waited 15 minutes.', 'طبيبة أطفال ممتازة تتحدث الإنجليزية في عيادة خاصة بالعزيزية. الحجز عبر تطبيق العيادة والانتظار 15 دقيقة.'), helped: 27 },
  ],
};
window.OFFICIAL = { iqama: 'Absher · absher.sa', bank: 'SAMA · sama.gov.sa', ejar: 'Ejar · ejar.sa', licence: 'Absher · absher.sa', travel: 'Haramain · sar.com.sa', insurance: 'CHI · chi.gov.sa', sim: 'CST · cst.gov.sa', study: 'IU · iu.edu.sa' };

window.FAMILY = [
  { q: true, who: 'Fatima · 2026-11', text: D('Посоветуйте детский сад с английским языком недалеко от Ас-Салам.', 'Can you recommend an English-speaking kindergarten near As Salam?', 'أريد حضانة تتحدث الإنجليزية قرب حي السلام.'), helped: 11,
    a: [{ who: 'Zainab · 2026-11', text: D('Мы ходим в частный сад в соседнем районе: группы по 12 детей, воспитатели говорят по-английски, есть автобус.', 'We go to a private kindergarten in the next district: groups of 12, English-speaking teachers, and there’s a bus.', 'نذهب إلى حضانة خاصة في الحي المجاور: مجموعات من 12 طفلاً ومعلمات يتحدثن الإنجليزية مع حافلة.'), helped: 8 }] },
  { q: false, who: 'Aliya · 2026-10', text: D('Записали сына в секцию плавания для детей, занятия два раза в неделю, тренер говорит по-английски.', 'We signed our son up for kids’ swimming, twice a week, the coach speaks English.', 'سجّلنا ابننا في السباحة للأطفال مرتين أسبوعياً، والمدرب يتحدث الإنجليزية.'), helped: 6 },
];

/* ---------- spaces ---------- */
window.MEN_ROOMS = [
  { id: 'sport', icon: 'ball', name: D('Спорт', 'Sport', 'الرياضة'), last: D('Кто в субботу на футбол?', 'Who’s up for football on Saturday?', 'مين معنا كورة السبت؟'), n: 214 },
  { id: 'trips', icon: 'tent', name: D('Выезды и поездки', 'Trips & outings', 'الرحلات والطلعات'), last: D('Едем в Аль-Улу на выходные, есть 2 места', 'Going to AlUla for the weekend, 2 seats left', 'رايحين العلا نهاية الأسبوع، باقي مقعدان'), n: 168 },
  { id: 'cars', icon: 'car', name: D('Машины', 'Cars', 'السيارات'), last: D('Где недорого поменять масло?', 'Where to change the oil cheaply?', 'وين أغير الزيت بسعر مناسب؟'), n: 97 },
  { id: 'talk', icon: 'chat', name: D('Общение', 'Chat', 'سوالف'), last: D('Где лучший чай карак в городе?', 'Where’s the best karak tea in town?', 'وين أحلى شاي كرك بالمدينة؟'), n: 305 },
];
window.MEN_EVENTS = [
  { id: 'ev1', title: D('Футбол 7×7', 'Football 7-a-side', 'كرة قدم 7×7'), when: D('Суббота, 20:00', 'Saturday, 20:00', 'السبت، 8:00 م'), where: D('Стадион у Аль-Азизии', 'Pitch near Al Aziziyah', 'ملعب قرب العزيزية'), going: 10, need: 14 },
  { id: 'ev2', title: D('Поездка в Аль-Улу', 'Trip to AlUla', 'رحلة إلى العلا'), when: D('Пятница, 06:00', 'Friday, 06:00', 'الجمعة، 6:00 ص'), where: D('Сбор у Мечети Куба', 'Meet at Quba Mosque', 'التجمع عند مسجد قباء'), going: 5, need: 7 },
];
window.WOMEN_ROOMS = [
  { id: 'kids', icon: 'family', name: D('Дети и здоровье', 'Kids & health', 'الأطفال والصحة'), last: D('Какие прививки делают в 1 год?', 'Which vaccines are given at age 1?', 'ما التطعيمات في عمر سنة؟'), n: 188 },
  { id: 'cook', icon: 'cake', name: D('Кухня и рецепты', 'Cooking & recipes', 'الطبخ والوصفات'), last: D('Где купить хорошую гречку?', 'Where can I buy good buckwheat?', 'من وين أشتري حنطة سوداء جيدة؟'), n: 143 },
  { id: 'shop', icon: 'tag', name: D('Покупки', 'Shopping', 'التسوق'), last: D('Скидки на ткани в старом рынке', 'Fabric sale at the old market', 'تخفيضات أقمشة في السوق القديم'), n: 121 },
];
window.WOMEN_EVENTS = [
  { id: 'ew1', title: D('Кулинарная встреча: выпечка', 'Cooking meetup: baking', 'لقاء طبخ: المخبوزات'), when: D('Четверг, 17:00', 'Thursday, 17:00', 'الخميس، 5:00 م'), where: D('Ас-Салам', 'As Salam', 'السلام'), going: 8, need: 12 },
  { id: 'ew2', title: D('Прогулка с детьми в парке', 'Park walk with kids', 'نزهة مع الأطفال في الحديقة'), when: D('Суббота, 16:30', 'Saturday, 16:30', 'السبت، 4:30 م'), where: D('Парк Короля Фахда', 'King Fahd Park', 'حديقة الملك فهد'), going: 14, need: 30 },
];

/* ---------- days (dates of Islamic holidays are approximate) ---------- */
window.DAYS = [
  { date: '2027-02-08', moon: true, name: D('Начало Рамадана 1448', 'Start of Ramadan 1448', 'بداية رمضان 1448'), note: D('Иша по календарю Умм аль-Кура — через 2 часа после магриба', 'Isha in Umm al-Qura is 2 hours after Maghrib', 'العشاء بعد المغرب بساعتين حسب أم القرى') },
  { date: '2027-02-22', name: D('День основания', 'Founding Day', 'يوم التأسيس'), note: D('Государственный выходной', 'Public holiday', 'إجازة رسمية') },
  { date: '2027-03-10', moon: true, name: D('Ид аль-Фитр', 'Eid al-Fitr', 'عيد الفطر'), note: D('Цены на жильё растут, бронируйте заранее', 'Housing prices go up — book early', 'ترتفع أسعار السكن، احجز مبكراً') },
  { date: '2027-05-10', moon: true, name: D('Сезон хаджа', 'Hajj season', 'موسم الحج'), note: D('Перекрытия дорог и высокий спрос на жильё', 'Road closures and high housing demand', 'إغلاقات للطرق وطلب مرتفع على السكن') },
  { date: '2027-05-16', moon: true, name: D('Ид аль-Адха', 'Eid al-Adha', 'عيد الأضحى'), note: D('Государственный выходной', 'Public holiday', 'إجازة رسمية') },
  { date: '2027-09-23', name: D('Национальный день', 'National Day', 'اليوم الوطني'), note: D('Государственный выходной', 'Public holiday', 'إجازة رسمية') },
];

window.REVIEWS = [
  { who: 'Ali', stars: 5, text: D('Квартира как на фото, оператор ответил за пару минут и всё организовал.', 'The flat looked exactly like the photos; the operator replied in minutes and arranged everything.', 'الشقة مطابقة للصور، والموظف رد خلال دقائق ورتّب كل شيء.') },
  { who: 'Svetlana', stars: 5, text: D('Удобно, что можно писать по-русски, а договорились с владельцем на арабском без меня.', 'Handy that I could write in Russian while they sorted it out with the owner in Arabic.', 'مريح أنني كتبت بالروسية وهم تفاهموا مع المالك بالعربية.') },
];

/* operator replies (original Arabic → translations) */
window.OP_REPLY = D(
  'Здравствуйте! Спасибо за интерес. Да, объявление актуально. Когда вам удобно посмотреть? Мы можем показать сегодня после асра или завтра утром.',
  'Hello! Thank you for your interest. Yes, the listing is available. When would you like to view it? We can show it today after Asr or tomorrow morning.',
  'أهلاً وسهلاً! شكراً لاهتمامك. نعم، الإعلان متاح. متى يناسبك المعاينة؟ يمكننا عرضه اليوم بعد العصر أو غداً صباحاً.'
);
window.OP_REPLY_2 = D(
  'Отлично, записали вас. Оператор пришлёт точный адрес за час до встречи.',
  'Great, you’re booked. The operator will send the exact address an hour before the meeting.',
  'ممتاز، تم تسجيل موعدك. سيرسل الموظف العنوان الدقيق قبل الموعد بساعة.'
);
})();
