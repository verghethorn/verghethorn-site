/* Nakhlio Services — partner services published by Nakhlio itself.
   Visas, Iqama, insurance, transfers, Umrah and business set-up are done only by licensed partners. */
(function () {
const D = (ru, en, ar) => ({ ru, en, ar });
const S = (id, title, price, time, inc, need) => ({ id, title, price, time, inc, need });

window.SVC_CATS = [
  { k: 'business', icon: 'bank', c: 'clay', name: D('Бизнес в Саудии', 'Business in Saudi', 'الأعمال في السعودية'),
    items: [
      S('SV-401', D('Открытие компании и лицензия инвестора', 'Company set-up and investor licence', 'تأسيس شركة وترخيص الاستثمار'), D('консультация бесплатно', 'free consultation', 'استشارة مجانية'), D('от 3 недель', 'from 3 weeks', 'من 3 أسابيع'),
        [D('Выбор формы компании', 'Choosing the company type', 'اختيار نوع الشركة'), D('Лицензия и коммерческая регистрация через партнёра', 'Licence and commercial registration via a partner', 'الترخيص والسجل التجاري عبر شريك'), D('Банковский счёт компании', 'Company bank account', 'الحساب البنكي للشركة')],
        [D('Паспорт', 'Passport', 'جواز السفر'), D('Описание бизнеса', 'Business description', 'وصف النشاط')]),
      S('SV-402', D('Бизнес-виза и деловые поездки', 'Business visa and business trips', 'تأشيرة أعمال ورحلات عمل'), D('сервис от 300 SAR', 'service from 300 SAR', 'الخدمة من 300 ر.س'), D('3–10 дней', '3–10 days', '3–10 أيام'),
        [D('Приглашение и заявка', 'Invitation and application', 'الدعوة والطلب'), D('Встреча и трансфер', 'Meeting and transfer', 'الاستقبال والتوصيل'), D('Переводчик на встречи', 'Interpreter for meetings', 'مترجم للاجتماعات')],
        [D('Паспорт', 'Passport', 'جواز السفر'), D('Данные компании', 'Company details', 'بيانات الشركة')]),
      S('SV-403', D('Аренда офиса и бухгалтерия', 'Office rental and accounting', 'استئجار مكتب ومحاسبة'), D('от 1 500 SAR / месяц', 'from 1,500 SAR / month', 'من 1500 ر.س / شهر'), D('от 1 недели', 'from 1 week', 'من أسبوع'),
        [D('Офис или рабочее место', 'Office or desk', 'مكتب أو مساحة عمل'), D('Бухгалтер и отчётность ZATCA', 'Accountant and ZATCA reporting', 'محاسب وتقارير هيئة الزكاة'), D('Юридический адрес', 'Registered address', 'عنوان وطني للشركة')],
        [D('Коммерческая регистрация', 'Commercial registration', 'السجل التجاري')]),
    ] },
  { k: 'travel', icon: 'plane', c: 'date', name: D('Встреча в аэропорту', 'Airport pick-up', 'الاستقبال في المطار'),
    items: [
      S('SV-601', D('Встреча в аэропорту Медины', 'Medina airport pick-up', 'الاستقبال في مطار المدينة'), D('от 150 SAR', 'from 150 SAR', 'من 150 ر.س'), D('24/7', '24/7', '24/7'),
        [D('Водитель с табличкой', 'Driver with a name sign', 'سائق بلوحة باسمك'), D('Помощь с багажом', 'Help with luggage', 'المساعدة بالأمتعة'), D('Машина до 7 мест', 'Car up to 7 seats', 'سيارة حتى 7 مقاعد')],
        [D('Номер рейса', 'Flight number', 'رقم الرحلة')]),
    ] },
  { k: 'home', icon: 'box', c: 'palm', name: D('Подключение дома', 'Home set-up', 'تجهيز السكن'),
    items: [
      S('SV-703', D('Подключение интернета и техники', 'Internet and appliance set-up', 'تركيب الإنترنت والأجهزة'), D('от 100 SAR', 'from 100 SAR', 'من 100 ر.س'), D('1–3 дня', '1–3 days', '1–3 أيام'),
        [D('Подбор тарифа и заявка', 'Choosing a plan and ordering', 'اختيار الباقة والطلب'), D('Установка стиральной машины, ТВ, кондиционера', 'Installing washer, TV, AC', 'تركيب الغسالة والتلفاز والمكيف')],
        [D('Адрес', 'Address', 'العنوان'), D('Иqама для договора', 'Iqama for the contract', 'الإقامة للعقد')]),
    ] },
];
window.SVC_TEXT = {
  title: D('Услуги Nakhlio', 'Nakhlio Services', 'خدمات نخليو'),
  sub: D('Бизнес, встреча в аэропорту, подключение дома', 'Business, airport pick-up, home set-up', 'الأعمال، الاستقبال في المطار، تجهيز السكن'),
  vetted: D('Проверен Nakhlio', 'Vetted by Nakhlio', 'موثّق من نخليو'),
  only: D('Все услуги — через проверенных и лицензированных партнёров Nakhlio. Частные лица такие услуги здесь не предлагают. Nakhlio следит за качеством и разбирает каждую жалобу.', 'All services go through vetted and licensed Nakhlio partners. Private individuals do not offer these services here. Nakhlio watches the quality and handles every complaint.', 'كل الخدمات عبر شركاء نخليو الموثّقين والمرخّصين، ولا يقدّمها أفراد هنا. تتابع نخليو الجودة وتعالج كل شكوى.'),
  intro: D('Услуги наших партнёров. Вы оставляете заявку — сотрудник Nakhlio связывается с вами и ведёт дело до конца.', 'Services from our partners. You send a request — a Nakhlio team member contacts you and handles it to the end.', 'خدمات شركائنا. ترسل طلبك ويتواصل معك موظف نخليو ويتابع حتى النهاية.'),
  licensed: D('Лицензированный партнёр', 'Licensed partner', 'شريك مرخّص'),
  how: D('Как это работает', 'How it works', 'كيف تعمل الخدمة'),
  steps: [D('Вы оставляете заявку', 'You send a request', 'ترسل الطلب'), D('Сотрудник Nakhlio связывается с вами в чате или по телефону', 'A Nakhlio team member contacts you by chat or phone', 'يتواصل معك موظف نخليو بالدردشة أو الهاتف'), D('Партнёр выполняет услугу, мы следим за сроками', 'The partner does the work, we watch the deadlines', 'ينفّذ الشريك الخدمة ونتابع المواعيد'), D('Готово — вы оцениваете работу', 'Done — you rate the service', 'تم — تقيّم الخدمة')],
  includes: D('Что входит', 'What’s included', 'ما الذي يشمله'),
  need: D('Что понадобится', 'What you’ll need', 'ما المطلوب'),
  time: D('Срок', 'Time', 'المدة'),
  order: D('Оформить заявку', 'Send a request', 'إرسال الطلب'),
  contact_how: D('Как с вами связаться', 'How should we contact you', 'كيف نتواصل معك'),
  by_chat: D('В чате', 'In chat', 'بالدردشة'),
  by_call: D('Звонок', 'Phone call', 'اتصال'),
  when: D('Удобное время', 'Convenient time', 'الوقت المناسب'),
  t_now: D('Как можно скорее', 'As soon as possible', 'في أقرب وقت'), t_morning: D('Утром', 'Morning', 'صباحاً'), t_evening: D('Вечером', 'Evening', 'مساءً'),
  comment: D('Комментарий', 'Comment', 'ملاحظات'),
  comment_ph: D('Например: нужен перевод 2 дипломов к концу месяца', 'For example: I need 2 diplomas translated by the end of the month', 'مثال: أحتاج ترجمة شهادتين قبل نهاية الشهر'),
  sent: D('Заявка отправлена. Сотрудник Nakhlio свяжется с вами.', 'Request sent. A Nakhlio team member will contact you.', 'تم إرسال الطلب، وسيتواصل معك موظف نخليو.'),
  req: D('Заявка', 'Request', 'طلب'),
  popular: D('Популярное', 'Popular', 'الأكثر طلباً'),
  reply: D('Здравствуйте! Заявка принята. Ваш персональный сотрудник уже смотрит детали и скоро свяжется с вами удобным способом. Подготовьте, пожалуйста, документы из списка.', 'Hello! Your request is accepted. Your personal team member is reviewing the details and will contact you soon. Please prepare the documents from the list.', 'أهلاً وسهلاً! تم استلام طلبك، ويراجع الموظف المسؤول التفاصيل وسيتواصل معك قريباً. نرجو تجهيز المستندات المذكورة.'),
};
})();
