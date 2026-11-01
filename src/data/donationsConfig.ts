export type DonationCategoryId =
  | 'all'
  | 'general'
  | 'sadaqah_jariyah'
  | 'orphans'
  | 'suqya'
  | 'relief_distress'
  | 'medical'
  | 'mosques'
  | 'needy_families'
  | 'housing'
  | 'feeding'
  | 'education_quran'
  | 'humanitarian_aid'
  | 'awqaf';

export interface DonationCategoryItem {
  id: DonationCategoryId;
  labelAr: string;
  descriptionAr: string;
  iconName:
    | 'HeartHandshake'
    | 'Sprout'
    | 'Heart'
    | 'Droplets'
    | 'HandHeart'
    | 'Stethoscope'
    | 'Landmark'
    | 'Users'
    | 'Home'
    | 'Utensils'
    | 'BookOpen'
    | 'Globe'
    | 'Building2'
    | 'Sparkles';
}

export interface OfficialDonationPlatform {
  id: string;
  nameAr: string;
  classificationAr: string;
  organizationAr: string;
  descriptionAr: string;
  officialUrl: string;
  secondaryUrl?: string;
  secondaryUrlLabelAr?: string;
  supportedCategories: Exclude<DonationCategoryId, 'all'>[];
  fieldsOfWorkAr: string[];
  isSadaqahJariyahSupported: boolean;
  sadaqahJariyahSummaryAr?: string;
  platformType: 'charity_platform' | 'regulatory_verification';
  lastReviewedDate: string;
  verificationStatusTextAr: string;
  regulatoryNoticeAr: string;
  iconName: 'HeartHandshake' | 'Globe' | 'Home' | 'Stethoscope' | 'ShieldCheck';
  accentGradient: string;
}

export const DONATIONS_HUB_METADATA = {
  pageTitleAr: 'بوابة التبرعات',
  pageSubtitleAr: 'دليلك الآمن للوصول المباشر إلى منصات العطاء الرسمية في المملكة العربية السعودية',
  motivationalQuoteAr:
    'العطاء الصادق يبارك المال ويُنمّي الأثر؛ تبرع عبر القنوات الرسمية الأصلية وتثبّت من سريان ترخيص كل مبادرة قبل المساهمة.',
  quranVerse: {
    text: '﴿ مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ۗ وَاللَّهُ يُضَاعِفُ لِمَن يَشَاءُ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ ﴾',
    source: 'سورة البقرة — الآية 261',
  },
  verificationPortal: {
    titleAr: 'تحقق قبل أن تتبرع',
    ncnpMainUrl: 'https://ncnp.gov.sa/',
    donateSafelyUrl: 'https://dongovernance.ncnp.gov.sa/',
    lastConfigReviewDate: '2026-11-02',
    principlesAr: [
      'احرص دائماً على التحقق من سريان ترخيص الجهة، وترخيص الحملة الإعلانية، وترخيص قناة جمع التبرعات عبر بوابة المركز الوطني لتنمية القطاع غير الربحي.',
      'ترخيص كيان أو جمعية لا يعني تلقائياً أن جميع حملاتها الفرعية أو حساباتها البنكية أو روابطها الإعلانية مرخصة وسارية حالياً.',
      'لا يستقبل تطبيق «مدار اليقين» أي تبرعات مالية ولا يطلب أي بيانات بنكية، بل يوجهك مباشرة إلى الرابط الرسمي الأصلي في تبويب مستقل.',
      'تأكد من تطابق النطاق الرسمي للمنصة في شريط عنوان المتصفح قبل إتمام أي عملية تبرع.',
    ],
  },
};

export const DONATION_CATEGORIES: DonationCategoryItem[] = [
  {
    id: 'all',
    labelAr: 'جميع المجالات',
    descriptionAr: 'عرض كافة المنصات الرسمية المسجلة في الدليل',
    iconName: 'Sparkles',
  },
  {
    id: 'general',
    labelAr: 'التبرعات العامة',
    descriptionAr: 'فرص العطاء والمبادرات الخيرية المتنوعة عبر المنصات الوطنية',
    iconName: 'HeartHandshake',
  },
  {
    id: 'sadaqah_jariyah',
    labelAr: 'الصدقة الجارية',
    descriptionAr: 'مساهمات مستدامة الأثر في الأوقاف والصحة والمساجد والسقيا',
    iconName: 'Sprout',
  },
  {
    id: 'orphans',
    labelAr: 'كفالة الأيتام',
    descriptionAr: 'رعاية الأيتام وتمكينهم صحياً وتعليمياً ومعيشياً عبر القنوات الرسمية',
    iconName: 'Heart',
  },
  {
    id: 'suqya',
    labelAr: 'سقيا الماء',
    descriptionAr: 'مشاريع توفير المياه الصالحة للشرب عبر المنصات الرسمية',
    iconName: 'Droplets',
  },
  {
    id: 'relief_distress',
    labelAr: 'تفريج الكرب',
    descriptionAr: 'إعانة المعسرين وتفريج الكربات عبر القنوات الرسمية المعتمدة',
    iconName: 'HandHeart',
  },
  {
    id: 'medical',
    labelAr: 'علاج المرضى',
    descriptionAr: 'دعم المرضى المحتاجين والبرامج العلاجية والأدوية والأجهزة الطبية',
    iconName: 'Stethoscope',
  },
  {
    id: 'mosques',
    labelAr: 'بناء المساجد والعناية بها',
    descriptionAr: 'مشاريع العناية بالمساجد وصيانتها وتجهيزها عبر القنوات الرسمية',
    iconName: 'Landmark',
  },
  {
    id: 'needy_families',
    labelAr: 'دعم الأسر المحتاجة',
    descriptionAr: 'برامج الرعاية والتكافل الاجتماعي للأسر الأشد حاجة',
    iconName: 'Users',
  },
  {
    id: 'housing',
    labelAr: 'توفير السكن والإيجار',
    descriptionAr: 'دعم الأسر المستحقة في توفير المساكن والإيجارات والترميم والإسكان التنموي',
    iconName: 'Home',
  },
  {
    id: 'feeding',
    labelAr: 'إطعام الطعام',
    descriptionAr: 'مبادرات الإطعام والسلال الغذائية عبر المنصات الوطنية والإغاثية',
    iconName: 'Utensils',
  },
  {
    id: 'education_quran',
    labelAr: 'التعليم وتحفيظ القرآن',
    descriptionAr: 'دعم المبادرات التعليمية وحلقات تحفيظ القرآن الكريم عبر المنصات الرسمية',
    iconName: 'BookOpen',
  },
  {
    id: 'humanitarian_aid',
    labelAr: 'الإغاثة الإنسانية',
    descriptionAr: 'البرامج والمشاريع الإنسانية والإغاثية للمتضررين والمحتاجين',
    iconName: 'Globe',
  },
  {
    id: 'awqaf',
    labelAr: 'الأوقاف الخيرية',
    descriptionAr: 'المساهمة في الصناديق والمصارف الوقفية الخيرية والصحية',
    iconName: 'Building2',
  },
];

export const OFFICIAL_DONATION_PLATFORMS: OfficialDonationPlatform[] = [
  {
    id: 'ehsan-platform',
    nameAr: 'منصة إحسان',
    classificationAr: 'العمل الخيري العام',
    organizationAr: 'المنصة الوطنية للعمل الخيري (إحسان)',
    descriptionAr:
      'المنصة الوطنية للعمل الخيري، وتضم فرصاً ومبادرات للتبرع في مجالات متعددة مثل رعاية الأيتام والصحة والمساجد والأوقاف وتفريج الكرب.',
    officialUrl: 'https://ehsan.sa/',
    supportedCategories: [
      'general',
      'sadaqah_jariyah',
      'orphans',
      'suqya',
      'relief_distress',
      'medical',
      'mosques',
      'needy_families',
      'feeding',
      'education_quran',
      'awqaf',
    ],
    fieldsOfWorkAr: [
      'رعاية الأيتام',
      'الصحة والعلاج',
      'العناية بالمساجد',
      'الأوقاف والصدقة الجارية',
      'تفريج الكرب',
      'سقيا الماء وإطعام الطعام',
      'التعليم وتحفيظ القرآن',
    ],
    isSadaqahJariyahSupported: true,
    sadaqahJariyahSummaryAr:
      'توفر المنصة فرص المساهمة في الصناديق الوقفية، سقيا الماء، العناية بالمساجد، والمشاريع ذات الأثر المستدام عبر موقعها الرسمي.',
    platformType: 'charity_platform',
    lastReviewedDate: '2026-11-02',
    verificationStatusTextAr: 'تمت مراجعة النطاق الرسمي (ehsan.sa) — يُتحقق من تفاصيل كل فرصة داخل المنصة الأصلية',
    regulatoryNoticeAr:
      'يُنصح بمراجعة تفاصيل كل فرصة تبرع داخل موقع المنصة الرسمي للتأكد من اكتمال بياناتها النظامية قبل إتمام التبرع.',
    iconName: 'HeartHandshake',
    accentGradient: 'from-[#072A20] via-[#0D4334] to-[#041A13]',
  },
  {
    id: 'sahem-ksrelief',
    nameAr: 'منصة ساهم',
    classificationAr: 'الإغاثة والعمل الإنساني',
    organizationAr: 'مركز الملك سلمان للإغاثة والأعمال الإنسانية',
    descriptionAr:
      'منصة التبرعات التابعة لمركز الملك سلمان للإغاثة، لدعم البرامج والمشاريع الإنسانية والإغاثية.',
    officialUrl: 'https://sahem.ksrelief.org/',
    supportedCategories: [
      'humanitarian_aid',
      'general',
      'feeding',
      'medical',
      'suqya',
      'orphans',
      'housing',
      'education_quran',
    ],
    fieldsOfWorkAr: [
      'الأمن الغذائي والإطعام',
      'الإغاثة العاجلة والإيواء',
      'الصحة والمستلزمات الطبية',
      'المياه والإصحاح البيئي',
      'دعم الأيتام والتعليم في مناطق الاحتياج',
    ],
    isSadaqahJariyahSupported: true,
    sadaqahJariyahSummaryAr:
      'تتضمن مشاريع المياه والإصحاح البيئي والمرافق الصحية والتعليمية الإنسانية عبر البوابة الرسمية للمركز.',
    platformType: 'charity_platform',
    lastReviewedDate: '2026-11-02',
    verificationStatusTextAr:
      'تمت مراجعة النطاق الرسمي الحكومي (sahem.ksrelief.org) التابع لمركز الملك سلمان للإغاثة',
    regulatoryNoticeAr:
      'يتم التبرع حصرياً داخل البوابة الإلكترونية الرسمية لمركز الملك سلمان للإغاثة والأعمال الإنسانية.',
    iconName: 'Globe',
    accentGradient: 'from-[#0A2536] via-[#123A54] to-[#071824]',
  },
  {
    id: 'jood-eskan',
    nameAr: 'منصة جود الإسكان',
    classificationAr: 'الإسكان والتكافل الاجتماعي',
    organizationAr: 'مؤسسة الإسكان التنموي الأهلية (سكن)',
    descriptionAr:
      'دعم الأسر المستحقة في توفير المساكن والإيجارات والترميم والإسكان التنموي.',
    officialUrl: 'https://www.joodeskan.sa/',
    supportedCategories: [
      'housing',
      'needy_families',
      'relief_distress',
      'sadaqah_jariyah',
      'general',
    ],
    fieldsOfWorkAr: [
      'توفير المساكن للأسر الأشد حاجة',
      'دعم سداد الإيجارات السكنية',
      'ترميم وصيانة المساكن',
      'مشاريع الإسكان التنموي',
    ],
    isSadaqahJariyahSupported: true,
    sadaqahJariyahSummaryAr:
      'المساهمة في توفير المساكن التنموية المستدامة للأسر المستحقة المسجلة في المنصة الرسمية.',
    platformType: 'charity_platform',
    lastReviewedDate: '2026-11-02',
    verificationStatusTextAr:
      'تمت مراجعة النطاق الرسمي (joodeskan.sa) — يلزم التحقق من سريان تصريح كل مبادرة أو حملة بشكل مستقل',
    regulatoryNoticeAr:
      'تنبيه تنظيمي: وجود المنصة لا يعني تلقائياً سريان تصريح كل حملة فرعية؛ تحقق دائماً من سريان تصريح جمع التبرعات الخاص بأي مبادرة أو حملة قبل المساهمة.',
    iconName: 'Home',
    accentGradient: 'from-[#093126] via-[#114B3A] to-[#062018]',
  },
  {
    id: 'shefaa-waqf-health',
    nameAr: 'منصة شفاء – صندوق الوقف الصحي',
    classificationAr: 'الصحة والعلاج',
    organizationAr: 'صندوق الوقف الصحي',
    descriptionAr:
      'دعم المرضى المحتاجين والبرامج العلاجية والأوقاف الصحية والأدوية والأجهزة الطبية.',
    officialUrl: 'https://store.saudihef.org.sa/store',
    supportedCategories: [
      'medical',
      'sadaqah_jariyah',
      'awqaf',
      'relief_distress',
      'general',
    ],
    fieldsOfWorkAr: [
      'علاج المرضى المحتاجين',
      'الأوقاف الصحية المستدامة',
      'توفير الأدوية والمستلزمات الطبية',
      'تأمين الأجهزة الطبية التعويضية',
    ],
    isSadaqahJariyahSupported: true,
    sadaqahJariyahSummaryAr:
      'المساهمة في الأوقاف الصحية وتأمين الأجهزة الطبية وعلاج المرضى عبر متجر صندوق الوقف الصحي الرسمي.',
    platformType: 'charity_platform',
    lastReviewedDate: '2026-11-02',
    verificationStatusTextAr:
      'تمت مراجعة النطاق الرسمي لصندوق الوقف الصحي (store.saudihef.org.sa) — يُتحقق من تفاصيل كل حالة داخل المنصة',
    regulatoryNoticeAr:
      'تأكد دائماً من استعراض تفاصيل الحالة العلاجية أو الوقف الصحي مباشرة عبر النطاق الرسمي لصندوق الوقف الصحي.',
    iconName: 'Stethoscope',
    accentGradient: 'from-[#182B24] via-[#0D3B2E] to-[#081C15]',
  },
  {
    id: 'ncnp-verification',
    nameAr: 'المركز الوطني لتنمية القطاع غير الربحي',
    classificationAr: 'التحقق والموثوقية',
    organizationAr: 'المركز الوطني لتنمية القطاع غير الربحي (NCNP)',
    descriptionAr:
      'مرجع رسمي للتحقق من تراخيص جمع التبرعات والجهات والقنوات المعتمدة.',
    officialUrl: 'https://ncnp.gov.sa/',
    secondaryUrl: 'https://dongovernance.ncnp.gov.sa/',
    secondaryUrlLabelAr: 'خدمة التحقق من التراخيص (تبرع بأمان)',
    supportedCategories: ['general'],
    fieldsOfWorkAr: [
      'التحقق من تراخيص جمع التبرعات',
      'الاستعلام عن الكيانات غير الربحية المسجلة',
      'حوكمة التبرعات وحماية المتبرعين',
      'الإبلاغ عن حملات جمع التبرعات غير النظامية',
    ],
    isSadaqahJariyahSupported: false,
    platformType: 'regulatory_verification',
    lastReviewedDate: '2026-11-02',
    verificationStatusTextAr:
      'مرجع حكومي تنظيمي رسمي (.gov.sa) للتحقق من سريان تراخيص الكيانات وحملات وقنوات جمع التبرعات',
    regulatoryNoticeAr:
      'استخدم بوابة حوكمة التبرعات للتحقق من رقم الترخيص وتاريخ سريانه قبل التبرع لأي حملة أو حساب بنكي.',
    iconName: 'ShieldCheck',
    accentGradient: 'from-[#1E293B] via-[#0F172A] to-[#090E17]',
  },
];

