export interface ReligiousChannel {
  id: string;
  nameAr: string;
  subtitleAr: string;
  countryAr: string;
  categoryAr: string;
  qualityBadge: string;
  streamUrl: string;
  backupStreamUrl?: string;
  accentGradient: string;
  iconName: 'BookOpen' | 'Landmark' | 'Sparkles' | 'Compass';
}

export type RadioCategoryId =
  | 'all'
  | 'quran'
  | 'haramain'
  | 'sunnah'
  | 'tafsir'
  | 'seerah'
  | 'aqeedah'
  | 'fiqh'
  | 'lectures'
  | 'adhkar'
  | 'languages';

export interface IslamicRadioStation {
  id: string;
  nameAr: string;
  descriptionAr: string;
  category: Exclude<RadioCategoryId, 'all'>;
  categoryLabelAr: string;
  countryAr: string;
  languageAr: string;
  streamUrl: string;
  backupStreamUrl?: string;
  streamType: 'mp3' | 'hls' | 'aac';
}

export const RELIGIOUS_CHANNELS: ReligiousChannel[] = [
  {
    id: 'saudi-quran',
    nameAr: 'قناة القرآن الكريم',
    subtitleAr: 'بث مباشر متواصل من المسجد الحرام بمكة المكرمة مع تلاوات أئمة الحرمين الشريفين على مدار الساعة',
    countryAr: 'المملكة العربية السعودية',
    categoryAr: 'بث الحرم المكي • تلاوات قرآنية',
    qualityBadge: 'HD • بث مباشر 24/7',
    streamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/saudi_quran-avc1_600000=2-mp4a_145600_ara=3.m3u8',
    backupStreamUrl: 'https://win.holol.com/live/quran/playlist.m3u8',
    accentGradient: 'from-[#072A20] via-[#0D4334] to-[#041A13]',
    iconName: 'BookOpen',
  },
  {
    id: 'saudi-sunnah',
    nameAr: 'قناة السنة النبوية',
    subtitleAr: 'بث مباشر متواصل من المسجد النبوي الشريف بالمدينة المنورة مع الأحاديث النبوية الصحيحة',
    countryAr: 'المملكة العربية السعودية',
    categoryAr: 'بث المسجد النبوي • السنة المشرفة',
    qualityBadge: 'HD • بث مباشر 24/7',
    streamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/saudi_sunnah-avc1_600000=2-mp4a_145600_ara=3.m3u8',
    backupStreamUrl: 'https://win.holol.com/live/sunnah/playlist.m3u8',
    accentGradient: 'from-[#093126] via-[#114B3A] to-[#062018]',
    iconName: 'Landmark',
  },
  {
    id: 'al-risalah',
    nameAr: 'قناة الرسالة',
    subtitleAr: 'قناة فضائية إسلامية هادفة تقدم البرامج العلمية والتربوية والحوارية الوسطية',
    countryAr: 'المملكة العربية السعودية',
    categoryAr: 'برامج علمية ودعوية',
    qualityBadge: 'FHD 1080p • بث مباشر',
    streamUrl:
      'https://rotana.hibridcdn.net/rotananet/risala_net-7Y83PP5adWixDF93/rotana/risala_1080p/chunks.m3u8',
    accentGradient: 'from-[#0A2536] via-[#133A52] to-[#071824]',
    iconName: 'Sparkles',
  },
  {
    id: 'iqraa-tv',
    nameAr: 'قناة إقرأ الفضائية',
    subtitleAr: 'من أوائل القنوات الإسلامية العالمية المتخصصة في علوم القرآن والسنة والأسرة المسلمة',
    countryAr: 'المملكة العربية السعودية',
    categoryAr: 'علوم شرعية وثقافة إسلامية',
    qualityBadge: 'HD • بث مباشر',
    streamUrl:
      'https://playlist.fasttvcdn.com/pl/dlkqw1ftuvuuzkcb4pxdcg/Iqraafasttv2/playlist/0.m3u8',
    accentGradient: 'from-[#182B24] via-[#0D3B2E] to-[#081C15]',
    iconName: 'Compass',
  },
];

export const ISLAMIC_RADIO_CATEGORIES: { id: RadioCategoryId; nameAr: string }[] = [
  { id: 'all', nameAr: 'جميع الإذاعات' },
  { id: 'quran', nameAr: 'إذاعات القرآن الكريم' },
  { id: 'haramain', nameAr: 'إذاعات الحرمين الشريفين' },
  { id: 'sunnah', nameAr: 'إذاعات السنة النبوية والحديث' },
  { id: 'tafsir', nameAr: 'إذاعات التفسير وعلوم القرآن' },
  { id: 'seerah', nameAr: 'إذاعات السيرة النبوية' },
  { id: 'aqeedah', nameAr: 'إذاعات العقيدة والتوحيد' },
  { id: 'fiqh', nameAr: 'إذاعات الفقه والعلوم الشرعية' },
  { id: 'lectures', nameAr: 'إذاعات الدروس والمحاضرات' },
  { id: 'adhkar', nameAr: 'إذاعات الأذكار والأدعية' },
  { id: 'languages', nameAr: 'إذاعات بلغات عالمية مختلفة' },
];

export const ISLAMIC_RADIO_STATIONS: IslamicRadioStation[] = [
  // 1. الإذاعات السعودية الرسمية وإذاعات الحرمين الشريفين
  {
    id: 'saudi-quran-official',
    nameAr: 'إذاعة القرآن الكريم السعودية',
    descriptionAr: 'البث المباشر الرسمي لإذاعة القرآن الكريم من المملكة العربية السعودية — تلاوات وبرامج قرآنية على مدار الساعة',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://stream.radiojar.com/0tpy1h0kxtzuv',
    backupStreamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/saudi_quran-mp4a_145600_ara=3.m3u8',
    streamType: 'mp3',
  },
  {
    id: 'saudi-nidaa-alislam',
    nameAr: 'إذاعة نداء الإسلام من مكة المكرمة',
    descriptionAr: 'إذاعة إسلامية سعودية تبث من مكة المكرمة تعنى بالدعوة إلى الله والعلوم الشرعية والدروس العلمية',
    category: 'lectures',
    categoryLabelAr: 'إذاعات الدروس والمحاضرات',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://stream.radiojar.com/4wqre23fytzuv',
    backupStreamUrl: 'https://backup.qurango.net/radio/mix',
    streamType: 'mp3',
  },
  {
    id: 'haram-makkah-audio',
    nameAr: 'إذاعة المسجد الحرام المباشرة — مكة المكرمة',
    descriptionAr: 'بث صوتي حي متواصل للصلوات والتلاوات من رحاب المسجد الحرام بمكة المكرمة',
    category: 'haramain',
    categoryLabelAr: 'إذاعات الحرمين الشريفين',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/saudi_quran-mp4a_145600_ara=3.m3u8',
    backupStreamUrl: 'https://backup.qurango.net/radio/abdulrahman_alsudaes',
    streamType: 'hls',
  },
  {
    id: 'haram-madinah-audio',
    nameAr: 'إذاعة المسجد النبوي الشريف — المدينة المنورة',
    descriptionAr: 'بث صوتي حي متواصل للصلوات والأحاديث النبوية من رحاب المسجد النبوي الشريف',
    category: 'haramain',
    categoryLabelAr: 'إذاعات الحرمين الشريفين',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/saudi_sunnah-mp4a_145600_ara=3.m3u8',
    backupStreamUrl: 'https://backup.qurango.net/radio/saud_alshuraim',
    streamType: 'hls',
  },
  {
    id: 'haramain-sudais',
    nameAr: 'إذاعة تلاوات الحرم المكي — عبدالرحمن السديس',
    descriptionAr: 'تلاوات مرتلة وخاشعة من المسجد الحرام بصوت إمام الحرم الشيخ د. عبدالرحمن السديس',
    category: 'haramain',
    categoryLabelAr: 'إذاعات الحرمين الشريفين',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/abdulrahman_alsudaes',
    streamType: 'mp3',
  },
  {
    id: 'haramain-shuraim',
    nameAr: 'إذاعة تلاوات الحرم المكي — سعود الشريم',
    descriptionAr: 'المصحف المرتل وتلاوات التراويح والقيام بصوت الشيخ د. سعود الشريم',
    category: 'haramain',
    categoryLabelAr: 'إذاعات الحرمين الشريفين',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/saud_alshuraim',
    streamType: 'mp3',
  },

  // 2. إذاعات القرآن الكريم (العالم الإسلامي)
  {
    id: 'quran-general-mix',
    nameAr: 'الإذاعة العامة للقرآن الكريم — تلاوات مختارة',
    descriptionAr: 'تلاوات قرآنية متواصلة على مدار الساعة لنخبة من كبار قراء العالم الإسلامي',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'العالم الإسلامي',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/mix',
    streamType: 'mp3',
  },
  {
    id: 'quran-khashia-salma',
    nameAr: 'إذاعة التلاوات الخاشعة المؤثرة',
    descriptionAr: 'تلاوات قرآنية خاشعة تبعث السكينة والطمأنينة والتدبر في القلوب',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/salma',
    streamType: 'mp3',
  },
  {
    id: 'quran-alafasy-kw',
    nameAr: 'إذاعة القرآن الكريم — مشاري راشد العفاسي',
    descriptionAr: 'بث متواصل للمصحف المرتل برواية حفص عن عاصم بصوت القارئ مشاري راشد العفاسي',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'الكويت',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/mishary_alafasi',
    streamType: 'mp3',
  },
  {
    id: 'quran-husary-eg',
    nameAr: 'إذاعة المصحف المرتل — محمود خليل الحصري',
    descriptionAr: 'المصحف المرتل التاريخي المعتمد بصوت شيخ عموم المقارئ المصرية محمود خليل الحصري',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'مصر',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary',
    streamType: 'mp3',
  },
  {
    id: 'quran-minshawi-eg',
    nameAr: 'إذاعة المصحف المرتل — محمد صديق المنشاوي',
    descriptionAr: 'تلاوات خاشعة متواصلة بصوت القارئ الشيخ محمد صديق المنشاوي رحمه الله',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'مصر',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi',
    streamType: 'mp3',
  },
  {
    id: 'quran-kouchi-ma',
    nameAr: 'إذاعة القرآن برواية ورش — العيون الكوشي',
    descriptionAr: 'بث متواصل للقرآن الكريم برواية ورش عن نافع بصوت القارئ المغربي العيون الكوشي',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'المغرب',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/aloyoon_alkoshi',
    streamType: 'mp3',
  },
  {
    id: 'quran-alzain-sd',
    nameAr: 'إذاعة القرآن الكريم — الزين محمد أحمد',
    descriptionAr: 'تلاوات قرآنية مرتلة بالأداء السوداني الخاشع بصوت الشيخ الزين محمد أحمد',
    category: 'quran',
    categoryLabelAr: 'إذاعات القرآن الكريم',
    countryAr: 'السودان',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/alzain_mohammad_ahmad',
    streamType: 'mp3',
  },

  // 3. إذاعات السنة النبوية والحديث
  {
    id: 'sunnah-sahih-muslim',
    nameAr: 'إذاعة صحيح الإمام مسلم والحديث الشريف',
    descriptionAr: 'قراءة وعرض أحاديث صحيح الإمام مسلم بن الحجاج رحمه الله وشروح السنة النبوية المطهرة',
    category: 'sunnah',
    categoryLabelAr: 'إذاعات السنة النبوية والحديث',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/saheh-muslim',
    backupStreamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/saudi_sunnah-mp4a_145600_ara=3.m3u8',
    streamType: 'mp3',
  },
  {
    id: 'sunnah-nabawiyah-live',
    nameAr: 'إذاعة السنة النبوية من المدينة المنورة',
    descriptionAr: 'أحاديث رسول الله ﷺ الصحيحة وشروحها الفقهية والتربوية من رحاب طيبة الطيبة',
    category: 'sunnah',
    categoryLabelAr: 'إذاعات السنة النبوية والحديث',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/saudi_sunnah-mp4a_145600_ara=3.m3u8',
    streamType: 'hls',
  },

  // 4. إذاعات التفسير وعلوم القرآن
  {
    id: 'tafsir-muyassar-radio',
    nameAr: 'إذاعة تفسير القرآن الكريم وعلومه',
    descriptionAr: 'تلاوة آيات الذكر الحكيم مع بيان معانيها وهداياتها من كتب التفسير المعتمدة',
    category: 'tafsir',
    categoryLabelAr: 'إذاعات التفسير وعلوم القرآن',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/tafseer',
    streamType: 'mp3',
  },
  {
    id: 'tafsir-mukhtasar-radio',
    nameAr: 'إذاعة المختصر في تفسير القرآن الكريم',
    descriptionAr: 'حلقات متواصلة في بيان مقاصد السور وتفسير الآيات بأسلوب واضح وميسر',
    category: 'tafsir',
    categoryLabelAr: 'إذاعات التفسير وعلوم القرآن',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/mukhtasartafsir',
    streamType: 'mp3',
  },

  // 5. إذاعات السيرة النبوية
  {
    id: 'seerah-fi-zilal',
    nameAr: 'إذاعة في ظلال السيرة النبوية العطرة',
    descriptionAr: 'سرد موثق لمحطات السيرة النبوية الشريفة من المولد والبعثة إلى الهجرة وبناء الدولة الإسلامية',
    category: 'seerah',
    categoryLabelAr: 'إذاعات السيرة النبوية',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/fi_zilal_alsiyra',
    streamType: 'mp3',
  },
  {
    id: 'seerah-mukhtasar',
    nameAr: 'إذاعة المختصر في السيرة النبوية والشمائل',
    descriptionAr: 'دروس متخصصة في شمائل النبي ﷺ وأخلاقه وغزواته وسير الصحابة الكرام رضي الله عنهم',
    category: 'seerah',
    categoryLabelAr: 'إذاعات السيرة النبوية',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/almukhtasar_fi_alsiyra',
    streamType: 'mp3',
  },

  // 6. إذاعات العقيدة والتوحيد
  {
    id: 'aqeedah-tawheed-radio',
    nameAr: 'إذاعة العقيدة الإسلامية وأصول الإيمان',
    descriptionAr: 'بيان العقيدة الصحيحة الصافية من الكتاب والسنة وأسماء الله الحسنى وصفاته العلا',
    category: 'aqeedah',
    categoryLabelAr: 'إذاعات العقيدة والتوحيد',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/roqiah',
    backupStreamUrl: 'https://backup.qurango.net/radio/tafseer',
    streamType: 'mp3',
  },

  // 7. إذاعات الفقه والعلوم الشرعية
  {
    id: 'fiqh-bin-baz',
    nameAr: 'إذاعة الاختيارات الفقهية والعلوم الشرعية',
    descriptionAr: 'دروس فقهية مؤصلة في فقه العبادات والمعاملات والأحكام الشرعية بأدلتها من الكتاب والسنة',
    category: 'fiqh',
    categoryLabelAr: 'إذاعات الفقه والعلوم الشرعية',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/alaikhtiarat_alfiqhayh_bin_baz',
    streamType: 'mp3',
  },
  {
    id: 'fiqh-fatwa-radio',
    nameAr: 'إذاعة الفتاوى الشرعية وأحكام المسلم',
    descriptionAr: 'إجابات علمية موثقة في فقه الطهارة والصلاة والزكاة والصيام والحج والمعاملات المالية',
    category: 'fiqh',
    categoryLabelAr: 'إذاعات الفقه والعلوم الشرعية',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/fatwa',
    streamType: 'mp3',
  },

  // 8. إذاعات الدروس والمحاضرات
  {
    id: 'lectures-science-radio',
    nameAr: 'إذاعة المجالس العلمية والدروس الشرعية',
    descriptionAr: 'محاضرات علمية ودعوية وتربوية في تزكية النفوس وآداب طالب العلم والرقائق الإيمانية',
    category: 'lectures',
    categoryLabelAr: 'إذاعات الدروس والمحاضرات',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/mukhtasartafsir',
    backupStreamUrl: 'https://stream.radiojar.com/4wqre23fytzuv',
    streamType: 'mp3',
  },

  // 9. إذاعات الأذكار والأدعية
  {
    id: 'adhkar-masa-sabah-radio',
    nameAr: 'إذاعة الأذكار النبوية والتحصين اليومي',
    descriptionAr: 'بث متواصل لأذكار الصباح والمساء والأدعية النبوية المأثورة من الكتاب والسنة الصحيحة',
    category: 'adhkar',
    categoryLabelAr: 'إذاعات الأذكار والأدعية',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/athkar_masa',
    streamType: 'mp3',
  },
  {
    id: 'adhkar-ruqyah-sakeenah',
    nameAr: 'إذاعة آيات السكينة والرقية الشرعية الثابتة',
    descriptionAr: 'تلاوة آيات السكينة والشفاء والأدعية الثابتة في السنة النبوية لراحة القلب والطمأنينة',
    category: 'adhkar',
    categoryLabelAr: 'إذاعات الأذكار والأدعية',
    countryAr: 'المملكة العربية السعودية',
    languageAr: 'العربية',
    streamUrl: 'https://backup.qurango.net/radio/roqiah',
    streamType: 'mp3',
  },

  // 10. إذاعات بلغات عالمية مختلفة
  {
    id: 'lang-french-quran',
    nameAr: 'إذاعة ترجمة معاني القرآن باللغة الفرنسية',
    descriptionAr: 'تلاوة القرآن الكريم مع ترجمة معانيه المعتمدة باللغة الفرنسية للمسلمين الناطقين بها',
    category: 'languages',
    categoryLabelAr: 'إذاعات بلغات عالمية مختلفة',
    countryAr: 'بث عالمي',
    languageAr: 'الفرنسية (Français)',
    streamUrl: 'https://backup.qurango.net/radio/translation_quran_french',
    streamType: 'mp3',
  },
  {
    id: 'lang-urdu-quran',
    nameAr: 'إذاعة ترجمة معاني القرآن باللغة الأردية',
    descriptionAr: 'تلاوات الحرمين الشريفين مع ترجمة معاني القرآن الكريم باللغة الأردية',
    category: 'languages',
    categoryLabelAr: 'إذاعات بلغات عالمية مختلفة',
    countryAr: 'بث عالمي',
    languageAr: 'الأردية (اردو)',
    streamUrl: 'https://backup.qurango.net/radio/translation_quran_urdu_sds_shur',
    streamType: 'mp3',
  },
  {
    id: 'lang-turkish-quran',
    nameAr: 'إذاعة ترجمة معاني القرآن باللغة التركية',
    descriptionAr: 'تلاوة القرآن الكريم مع بيان معانيه باللغة التركية على مدار الساعة',
    category: 'languages',
    categoryLabelAr: 'إذاعات بلغات عالمية مختلفة',
    countryAr: 'بث عالمي',
    languageAr: 'التركية (Türkçe)',
    streamUrl: 'https://backup.qurango.net/radio/translation_quran_turkish',
    streamType: 'mp3',
  },
];

