import { WebsiteRelease, WebsiteUpdate } from '../../types/updates';

/**
 * البيانات المعتمدة للتحديثات والإصدارات الرسمية لمنصة مدار اليقين
 * تُستخدم كنواة أساسية (Seed Data) وتُدمج تلقائياً مع أي تحديثات ديناميكية جديدة ينشئها المشرفون.
 */

export const SEED_RELEASES: WebsiteRelease[] = [
  {
    id: 'rel-v2.5.0',
    version: 'v2.5.0',
    name: 'الموسوعة الكبرى للأذكار والأدعية ونظام التحديثات الذكي',
    nameEn: 'Comprehensive Adhkar & Duas Encyclopedia & Smart Updates System',
    releaseDate: '2026-11-05',
    isLatest: true,
    summary: 'إطلاق أكبر مكتبة للأذكار النبوية الموثقة (22 تصنيفاً) وموسوعة الأدعية القرآنية والنبوية، مع تدشين نظام إشعارات التحديثات الذكي.',
    summaryEn: 'Major release featuring the comprehensive authentic Adhkar Oasis across 22 categories, the Holy Duas Encyclopedia, and the Smart What\'s New Notification System.',
    badge: 'إصدار رئيسي كبرى',
    updateIds: [
      'up-2026-adhkar-library',
      'up-2026-duas-encyclopedia',
      'up-2026-smart-updates',
      'up-2026-card-studio-sharing'
    ]
  },
  {
    id: 'rel-v2.4.0',
    version: 'v2.4.0',
    name: 'أكاديميات القرآن المتقدمة وشمولية التعلم الإسلامي',
    nameEn: 'Advanced Quran Learning Academies & Accessibility Expansion',
    releaseDate: '2026-11-04',
    isLatest: false,
    summary: 'إضافة 4 أكاديميات متخصصة: مدرّب الحفظ والمراجعة، معمل التجويد، أكاديمية لغة القرآن، ومركز لغة الإشارة الإسلامي.',
    summaryEn: 'Four new advanced modules: Quran Memorization Coach, Interactive Tajweed Lab, Quranic Arabic Academy, and Islamic Sign Language Center.',
    badge: 'تحديث تعليمي شامل',
    updateIds: [
      'up-2026-quran-coach',
      'up-2026-tajweed-lab',
      'up-2026-quranic-arabic',
      'up-2026-sign-language'
    ]
  },
  {
    id: 'rel-v2.3.0',
    version: 'v2.3.0',
    name: 'الموسوعات المعاصرة والخدمات الذكية والتوثيق الشرعي',
    nameEn: 'Modern Encyclopedias, Smart Tools & Authenticity Verification',
    releaseDate: '2026-11-03',
    isLatest: false,
    summary: 'تدشين فاحص صحة الأحاديث، فقه الحياة اليومية، دليل الجنائز، المكتبة الصوتية، واستوديو البطاقات الإسلامية.',
    summaryEn: 'Introduction of Hadith authenticity verifier, daily life fiqh, funeral guide, Islamic audio library, and Islamic cards studio.',
    badge: 'موسوعات معاصرة',
    updateIds: [
      'up-2026-content-verifier',
      'up-2026-daily-fiqh',
      'up-2026-janazah-guide',
      'up-2026-scholars-centers'
    ]
  },
  {
    id: 'rel-v2.2.0',
    version: 'v2.2.0',
    name: 'التفاعل الأسري والتاريخ الإسلامي ومناسك الحج والعمرة',
    nameEn: 'Family Interaction, Islamic History & Hajj Interactive Guide',
    releaseDate: '2026-11-02',
    isLatest: false,
    summary: 'إطلاق رفيق المسلم لمتابعة السنن، دليل الحج والعمرة التفاعلي، عالم الأطفال المسلم، وأطلس التاريخ الإسلامي.',
    summaryEn: 'Daily Muslim companion, interactive Hajj and Umrah guide, Muslim kids learning world, and Islamic history atlas.',
    badge: 'تفاعل وتربية',
    updateIds: [
      'up-2026-companion-daily',
      'up-2026-hajj-umrah',
      'up-2026-kids-world',
      'up-2026-history-atlas'
    ]
  },
  {
    id: 'rel-v2.1.0',
    version: 'v2.1.0',
    name: 'البنية السحابية النقية وتطبيق الويب التقدمي (PWA)',
    nameEn: 'Pure Web Cloud Architecture & Progressive Web App (PWA)',
    releaseDate: '2026-11-01',
    isLatest: false,
    summary: 'التحول الشامل إلى بنية ويب نقية 100% تعمل بسلاسة عبر النطاق الرسمي wasl-islam.fun دون أي تبعات أصلية.',
    summaryEn: 'Transitioning to a pure, ultra-fast Progressive Web App running on Cloudflare Workers without native mobile wrappers.',
    badge: 'ترقية معمارية',
    updateIds: [
      'up-2026-pwa-web-architecture'
    ]
  }
];

export const SEED_UPDATES: WebsiteUpdate[] = [
  // ==========================================
  // Release v2.5.0 Updates
  // ==========================================
  {
    id: 'up-2026-adhkar-library',
    releaseId: 'rel-v2.5.0',
    version: '2.5.0',
    releaseDate: '2026-11-05',
    category: 'new_feature',
    title: 'التوسعة الكبرى لواحة الأذكار النبوية (22 قسماً مع التخريج الكامل)',
    titleEn: 'Major Adhkar Oasis Expansion (22 Categories with Full Verification)',
    shortDescription: 'مكتبة أذكار نبوية شاملة تضم أكثر من 75 ذكراً محققاً عبر 22 تصنيفاً مع التخريج، درجة الصحة، الشرح، والعداد التفاعلي.',
    shortDescriptionEn: 'Comprehensive prophetic Adhkar library featuring 75+ verified remembrances across 22 categories with Hadith grading, explanation, and interactive counter.',
    fullDescription: 'تمت توسعة واحة الأذكار في منصة مدار اليقين لتصبح مكتبة إسلامية متكاملة تضم أذكار الصباح والمساء، أذكار النوم والاستيقاظ، أذكار دبر الصلوات المفروضة وداخل الصلاة، أذكار المسجد والأذان، وأذكار السفر والمنزل والمطر والشدائد وعيادة المريض. جميع الأذكار مضبوطة بالشكل التام مع بيان المصدر من الصحيحين والسنن، وبيان درجة الحديث وتحقيق العلماء، وفضل كل ذكر وعدد تكراره المسنون، بالإضافة إلى عداد تنازلي تفاعلي مع اهتزاز لمسي وحفظ تلقائي للإنجاز اليومي والمفضلة.',
    fullDescriptionEn: 'The Adhkar section has been expanded into an encyclopedic library covering morning, evening, sleep, after-prayer, in-prayer, mosque, travel, home, weather, illness ruqyah, and seasonal remembrances. Fully vowelized Arabic texts, exact Hadith documentation, scholarly gradings, virtues, explanations, interactive repetition counters, and personal favorites.',
    actionUrl: '/adhkar',
    actionLabel: 'استكشف واحة الأذكار الآن',
    actionLabelEn: 'Explore Adhkar Oasis',
    status: 'published',
    importance: 'important',
    popupVisibility: {
      showPopup: true,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      '22 تصنيفاً مفصلاً بدلاً من 6 تصنيفات فقط',
      'توثيق حديثي دقيق من صحيح البخاري ومسلم والسنن الأربعة',
      'عداد تنازلي ذكي مع إمكانية تصفير كل قسم على حدة',
      'نظام حفظ الأذكار المفضلة والمتابعة الشخصية',
      'زر تصميم بطاقة دعوية فوري لكل ذكر بنقرة واحدة'
    ],
    highlightsEn: [
      '22 specialized categories instead of 6',
      'Rigorous Hadith documentation from Sahih Bukhari, Muslim, and the Sunan',
      'Tactile interactive countdown counter with category reset',
      'Personal favorites system stored locally',
      'One-click integration to generate shareable Islamic cards'
    ]
  },
  {
    id: 'up-2026-duas-encyclopedia',
    releaseId: 'rel-v2.5.0',
    version: '2.5.0',
    releaseDate: '2026-11-05',
    category: 'new_feature',
    title: 'إطلاق موسوعة الأدعية القرآنية والنبوية الموثقة (/duas)',
    titleEn: 'Launch of the Verified Quranic & Prophetic Duas Encyclopedia (/duas)',
    shortDescription: 'قسم متكامل للأدعية يضم 80 دعاءً قرآنياً ونبوياً صحيحاً مصنفاً ومترجماً بست لغات عالمية مع البحث الذكي.',
    shortDescriptionEn: 'Comprehensive supplications encyclopedia with 80 verified Quranic & Prophetic duas, categorized and translated into 6 world languages with smart Arabic search.',
    fullDescription: 'موسوعة الأدعية الجديدة في مدار اليقين تقدم للمسلمين مكتبة ضخمة من الأدعية الثابتة في القرآن الكريم والسنة المطهرة. تشمل أدعية الأنبياء، أدعية تفريج الهم والكرب، أدعية الشفاء والعافية، أدعية الرزق والبركة، والاستخارة. تشتمل كل دعوة على التشكيل الكامل، المعنى والتفسير، مناسبة الدعاء، الترجمة الدقيقة، ونظام المجموعات والمفضلة والملاحظات الشخصية.',
    fullDescriptionEn: 'A dedicated library of verified supplications from the Quran and authentic Sunnah covering prophets\' prayers, relief from distress, healing, sustenance, and guidance. Includes 6 language translations, personal collections, audio playback, and instant card studio exporting.',
    actionUrl: '/duas',
    actionLabel: 'تصفح موسوعة الأدعية',
    actionLabelEn: 'Browse Duas Encyclopedia',
    status: 'published',
    importance: 'important',
    popupVisibility: {
      showPopup: true,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      '80 دعاءً موثقاً من القرآن والسنة الصحيحة دون أي صيغ مبتدعة',
      'ترجمة فورية بست لغات (الإنجليزية، الفرنسية، الأردية، الإندونيسية، التركية، الألمانية)',
      'تصدير فوري إلى استوديو البطاقات الدعوية',
      'بحث ذكي يتعامل مع النصوص بتطبيع التشكيل والهمزات'
    ],
    highlightsEn: [
      '80 authentic supplications strictly sourced from Quran and Sunnah',
      'Multi-language translation in 6 global languages',
      'Instant export to Islamic Card Studio',
      'Smart search normalized for Arabic diacritics and letters'
    ]
  },
  {
    id: 'up-2026-smart-updates',
    releaseId: 'rel-v2.5.0',
    version: '2.5.0',
    releaseDate: '2026-11-05',
    category: 'new_feature',
    title: 'تدشين نظام إشعارات التحديثات الذكي وسجل ما الجديد (/updates)',
    titleEn: 'Launch of Smart Website Updates & What\'s New System (/updates)',
    shortDescription: 'نظام إشعارات ديناميكي يُطلع الزوار تلقائياً على كل ميزة جديدة أو تحسين، مع سجل دائم للتحديثات ولوحة إدارة آمنة.',
    shortDescriptionEn: 'Dynamic notification system that automatically informs visitors of new releases, complete with a permanent history page and secure admin management.',
    fullDescription: 'أصبح بإمكان زوار منصة مدار اليقين التعرف فوراً على المزايا والتحسينات الجديدة عبر نافذة منبثقة تفاعلية ذكية تراعي عدم مقاطعة تلاوة القرآن أو الاستماع للصوتيات، وتحفظ حالة القراءة محلياً فلا تتكرر بدون داعٍ. كما تتضمن صفحة دائمة (/updates) لاستعراض السجل الكامل للإصدارات وأرقامها، والفلترة حسب الفئات، ولوحة تحكم آمنة تتيح للمشرفين نشر وإدارة ومعاينة التحديثات قبل نشرها.',
    fullDescriptionEn: 'Visitors are seamlessly notified of new features through an elegant non-intrusive modal that honors audio playback, stores read states, and provides a permanent update history with semantic versioning and administrative management.',
    actionUrl: '/updates',
    actionLabel: 'استعراض سجل التحديثات',
    actionLabelEn: 'View Updates History',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'نافذة تفاعلية منبثقة بألوان الهوية الملكية الإسلامية',
      'مراعاة عدم مقاطعة قراءة القرآن أو تشغيل الصوتيات إطلاقاً',
      'صفحة دائمة لسجل التحديثات (/updates) مع البحث والفلترة',
      'لوحة إدارة آمنة ومحمية بكلمة سر تتيح للمشرفين النشر والمعاينة المباشرة',
      'ربط ديناميكي لرقم إصدار الموقع الفعلي بأحدث إصدار منشور'
    ]
  },
  {
    id: 'up-2026-card-studio-sharing',
    releaseId: 'rel-v2.5.0',
    version: '2.5.0',
    releaseDate: '2026-11-05',
    category: 'improvement',
    title: 'تكامل مباشر بين استوديو البطاقات وجميع الأذكار والأدعية',
    titleEn: 'Direct Integration between Card Studio and all Adhkar & Duas',
    shortDescription: 'إمكانية تحويل أي ذكر أو دعاء بنقرة زر واحدة إلى بطاقة دعوية راقية بخلفيات وزخارف إسلامية وتصديرها كصورة عالية الدقة.',
    shortDescriptionEn: 'One-click conversion of any Dhikr or Dua into an elegant shareable Islamic card with islamic patterns and high-resolution export.',
    fullDescription: 'أصبح استوديو البطاقات الإسلامية (/card-studio) يستقبل تلقائياً نصوص الأذكار والأدعية وعناوينها عبر روابط فورية، مما يمكن الزوار من تخصيص الخطوط والزخارف الإسلامية والتحكم في الألوان والظلال وتصدير البطاقة كصورة PNG فائقة الجودة لمشاركتها على وسائل التواصل.',
    fullDescriptionEn: 'Card Studio now accepts direct URL parameters from Adhkar and Duas, allowing immediate styling, font customization, calligraphy options, and crystal-clear image downloads.',
    actionUrl: '/card-studio',
    actionLabel: 'جرب استوديو البطاقات',
    actionLabelEn: 'Try Card Studio',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'تمرير تلقائي للنص والتخريج من واحة الأذكار وموسوعة الأدعية',
      'قوالب فاخرة متوافقة مع الهوية الملكية الخضراء والذهبية',
      'تصدير سريع وبدقة فائقة للهواتف والشاشات'
    ]
  },

  // ==========================================
  // Release v2.4.0 Updates
  // ==========================================
  {
    id: 'up-2026-quran-coach',
    releaseId: 'rel-v2.4.0',
    version: '2.4.0',
    releaseDate: '2026-11-04',
    category: 'new_feature',
    title: 'مدرّب حفظ القرآن ومراجعته التراكمية الذكية (/quran-coach)',
    titleEn: 'Quran Memorization & Cumulative Revision Coach (/quran-coach)',
    shortDescription: 'مساعد حفظ تفاعلي يوفر مسارات حفظ مخصصة، التكرار الصوتي للآيات، واختبارات قياس دقة الحفظ والمراجعة.',
    shortDescriptionEn: 'Interactive memorization assistant with tailored tracks, audio repetition for verses, and cumulative revision testing.',
    fullDescription: 'مدرّب الحفظ القرآني يساعد الراغبين في حفظ كتاب الله عبر خطط منهجية (جزء عم، سورة البقرة، قصار السور)، مع خاصية إخفاء الكلمات لاختبار الذاكرة، والتكرار الآلي مع كبار القراء، وتتبع مستمر للتقدم بنسب مئوية دقيقة.',
    fullDescriptionEn: 'Structured Quran memorization coach with word masking tests, configurable ayah repetitions, audio syncing, and cumulative revision tracking.',
    actionUrl: '/quran-coach',
    actionLabel: 'ابدأ رحلة الحفظ',
    actionLabelEn: 'Start Memorization',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'مسارات متنوعة للناشئة والكبار ولأجزاء محددة من القرآن',
      'محاكي التسميع مع إخفاء وإظهار الكلمات تدريجياً',
      'حساب معدل الإتقان وحفظ سجل المراجعة اليومية'
    ]
  },
  {
    id: 'up-2026-tajweed-lab',
    releaseId: 'rel-v2.4.0',
    version: '2.4.0',
    releaseDate: '2026-11-04',
    category: 'new_feature',
    title: 'معمل النطق والتجويد التفاعلي ومختبر التسجيل الصوتي (/tajweed-lab)',
    titleEn: 'Interactive Tajweed Lab & Audio Recording Studio (/tajweed-lab)',
    shortDescription: 'أطلس مرئي لمخارج الحروف وصفاتها وأحكام النون والمدود، مع أداة لتسجيل صوت القارئ ومقارنته بتلاوة كبار المقرئين.',
    shortDescriptionEn: 'Visual atlas for letters articulation and Tajweed rules, plus an audio recording lab to compare your recitation with master reciters.',
    fullDescription: 'معمل التجويد يوفر شروحات مرئية ودقيقة لمخارج الحروف الـ 17 وصفاتها اللازمة والعارضة، مع أمثلة صوتية لأحكام النون والميم والتفخيم والمدود، وإمكانية تسجيل صوت القارئ وتشغيله لمقارنة النطق والأداء.',
    fullDescriptionEn: 'Interactive Tajweed laboratory with articulation diagrams, audio examples for Ghunnah, Madd, and Noon Sakinah, and a personal voice recorder.',
    actionUrl: '/tajweed-lab',
    actionLabel: 'ادخل معمل التجويد',
    actionLabelEn: 'Enter Tajweed Lab',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'خريطة تفاعلية لكامل مخارج الحروف مع المقاطع الصوتية',
      'تسجيل صوتي محلي للمقارنة بدون الحاجة لإنترنت',
      'أمثلة قرآنية مسموعة لكل حكم تجويدي'
    ]
  },
  {
    id: 'up-2026-quranic-arabic',
    releaseId: 'rel-v2.4.0',
    version: '2.4.0',
    releaseDate: '2026-11-04',
    category: 'new_feature',
    title: 'أكاديمية لغة القرآن والمفردات البلاغية (/quranic-arabic)',
    titleEn: 'Quranic Arabic Academy & Vocabulary Mastery (/quranic-arabic)',
    shortDescription: 'تعلّم مفردات القرآن الأكثر تكراراً، وجذور الكلمات، وأسرار البلاغة والإعراب التيسيري لآيات التنزيل.',
    shortDescriptionEn: 'Master high-frequency Quranic vocabulary, word roots, and rhetorical nuances to understand the Quran directly.',
    fullDescription: 'أكاديمية لغة القرآن صُممت لتمكين المسلم العربي وغير العربي من فهم 80% من ألفاظ القرآن الكريم من خلال بطاقات المفردات المتكررة، دراسة الجذور الثلاثية، واستيعاب اللمسات البيانية والإعرابية في أشهر الآيات والسور.',
    fullDescriptionEn: 'Understand the Quran directly with high-frequency vocabulary flashcards, root analysis, and simplified grammatical breakdowns.',
    actionUrl: '/quranic-arabic',
    actionLabel: 'تعلم لغة القرآن',
    actionLabelEn: 'Learn Quranic Arabic',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'بطاقات تفاعلية لأكثر من 500 مفردة قرآنية عالية التكرار',
      'شروح بلاغية مستمدة من التفاسير المعتمدة',
      'اختبارات تفاعلية لقياس الفهم المعجمي'
    ]
  },
  {
    id: 'up-2026-sign-language',
    releaseId: 'rel-v2.4.0',
    version: '2.4.0',
    releaseDate: '2026-11-04',
    category: 'new_feature',
    title: 'مركز التعليم الإسلامي بلغة الإشارة للصم وضعاف السمع (/sign-language)',
    titleEn: 'Islamic Sign Language Learning Center for the Deaf (/sign-language)',
    shortDescription: 'أول مكتبة إسلامية معتمدة بلغة الإشارة العربية تشرح أركان الإسلام، الوضوء، الصلاة، والأذكار بمقاطع مرئية وتوضيحية.',
    shortDescriptionEn: 'Dedicated Islamic sign language learning center providing verified sign guides for prayer, ablution, pillars, and daily invocations.',
    fullDescription: 'انطلاقاً من حق الصم وضعاف السمع في الوصول إلى العلوم الشرعية، يضم المركز دروساً مرئية وحركية مصورة تشرح أحكام العبادات ومصطلحات العقيدة وتكبيرات الصلاة والأدعية بلغة الإشارة العربية المعتمدة.',
    fullDescriptionEn: 'Empowering deaf and hard-of-hearing Muslims with certified Arabic sign language tutorials for prayer postures, ablution, and essential tenets.',
    actionUrl: '/sign-language',
    actionLabel: 'تصفح مركز لغة الإشارة',
    actionLabelEn: 'Browse Sign Language Center',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'شروحات حركية مبسطة لأركان الإسلام والصلوات المفروضة',
      'قاموس المصطلحات الشرعية بلغة الإشارة',
      'تصميم متوافق مع إمكانية الوصول وسهولة التنقل'
    ]
  },

  // ==========================================
  // Release v2.3.0 Updates
  // ==========================================
  {
    id: 'up-2026-content-verifier',
    releaseId: 'rel-v2.3.0',
    version: '2.3.0',
    releaseDate: '2026-11-03',
    category: 'new_feature',
    title: 'أداة التحقق من صحة الحديث وتفنيد الرسائل المتداولة (/content-verifier)',
    titleEn: 'Hadith Authenticity Verifier & Circulated Message Checker (/content-verifier)',
    shortDescription: 'محرك بحث وتدقيق في صحة الأحاديث الشائعة، والرسائل المنتشرة على واتساب، والأحاديث الموضوعة والضعيفة.',
    shortDescriptionEn: 'Verification engine for commonly circulated messages, fake hadiths, and viral religious claims with authoritative citations.',
    fullDescription: 'خدمة تفاعلية تمكّن المسلم من فحص الأحاديث والرسائل المتناقلة عبر وسائل التواصل والاطلاع على حكم المحدثين الثقات من أهل السنة والجماعة، وبيان درجتها (صحيح، حسن، ضعيف، موضوع).',
    fullDescriptionEn: 'Examine viral religious claims and messages with documented verdicts from top hadith scholars to combat fabricated and weak reports.',
    actionUrl: '/content-verifier',
    actionLabel: 'تحقق من صحة الحديث',
    actionLabelEn: 'Verify Hadith',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'فهرس للأحاديث الضعيفة والموضوعة المنتشرة',
      'تخريج فوري بنصوص كلام أئمة الحديث',
      'محرك بحث سريع بالنص أو الكلمات المفتاحية'
    ]
  },
  {
    id: 'up-2026-daily-fiqh',
    releaseId: 'rel-v2.3.0',
    version: '2.3.0',
    releaseDate: '2026-11-03',
    category: 'new_feature',
    title: 'موسوعة فقه الحياة اليومية والمعاملات المعاصرة (/daily-fiqh)',
    titleEn: 'Everyday Fiqh & Contemporary Transactions Encyclopedia (/daily-fiqh)',
    shortDescription: 'أحكام المعاملات المالية الحديثة، والتجارة الإلكترونية، والمسائل الطبية، والتقنية المعاصرة بأدلتها الشرعية.',
    shortDescriptionEn: 'Clear rulings on modern financial transactions, e-commerce, medical dilemmas, and digital technology according to authentic Islamic jurisprudence.',
    fullDescription: 'دليل شامل يقرب أحكام الفقه الإسلامي للواقع المعاصر في مجالات البيوع، والتسوق الإلكتروني، والعملات، والطب الحيوي، وأحكام العمل في الخارج، وفق قرارات المجامع الفقهية وهيئة كبار العلماء.',
    fullDescriptionEn: 'A practical jurisprudential guide covering contemporary e-commerce, payment gateways, medical ethics, and workplace issues based on trusted fiqh academies.',
    actionUrl: '/daily-fiqh',
    actionLabel: 'استعرض فقه المعاملات',
    actionLabelEn: 'Browse Daily Fiqh',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'تصنيفات واقعية: معاملات مالية، طبية، رقمية، وأسرية',
      'تبيان الأدلة وقرارات المجامع الفقهية المعتمدة',
      'إجابات مباشرة خالية من الغموض والتطويل'
    ]
  },
  {
    id: 'up-2026-janazah-guide',
    releaseId: 'rel-v2.3.0',
    version: '2.3.0',
    releaseDate: '2026-11-03',
    category: 'new_feature',
    title: 'دليل الجنائز والتعزية الشرعي الشامل (/janazah)',
    titleEn: 'Comprehensive Islamic Funeral & Condolence Guide (/janazah)',
    shortDescription: 'شرح فقهي مصور وموثق لأحكام الاحتضار، والغسل، والتكفين، وصلاة الجنازة بأربع تكبيرات، والدفن، وآداب التعزية.',
    shortDescriptionEn: 'Detailed guide with rulings on dying, washing, shrouding, funeral prayer with four Takbirs, burial, and authentic condolence manners.',
    fullDescription: 'مرجع كامل يرشد المسلمين خطوة بخطوة عند نزول مصيبة الموت بكيفية التعامل مع المحتضر، وتلقينه الشهادة، وتجهيز الميت، وصفة صلاة الجنازة بالتكبيرات والأدعية المسنونة، والتذكير ببدع المآتم والمبالغات المنهي عنها.',
    fullDescriptionEn: 'Step-by-step verified guide detailing pre-death care, ritual washing, shrouding, prayer with all supplications, burial Sunnahs, and condolence etiquette.',
    actionUrl: '/janazah',
    actionLabel: 'دليل الجنائز والتعزية',
    actionLabelEn: 'Funeral Guide',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'صفة صلاة الجنازة التفاعلية والأدعية الواردة بعد كل تكبيرة',
      'توجيهات شرعية للغسل والتكفين والدفن خطوة بخطوة',
      'صيغ التعزية النبوية الصحيحة والتحذير من البدع الشائعة'
    ]
  },
  {
    id: 'up-2026-scholars-centers',
    releaseId: 'rel-v2.3.0',
    version: '2.3.0',
    releaseDate: '2026-11-03',
    category: 'new_feature',
    title: 'موسوعة العلماء والمصنفات ودليل حلقات التحفيظ (/scholars و /islamic-centers)',
    titleEn: 'Scholars & Books Encyclopedia and Quran Learning Centers Directory',
    shortDescription: 'سير أئمة الإسلام والكتب المعتمدة، ودليل للمقارئ الإلكترونية وجمعيات تحفيظ القرآن الكريم حول العالم.',
    shortDescriptionEn: 'Biographies of great Islamic scholars, classical references, and a global directory of verified Quran centers and electronic recitations.',
    fullDescription: 'إتاحة مرجع غني للتعريف بأئمة المذاهب الأربعة وأصحاب السنن والمحدثين، مع عرض لأبرز كتب التفسير والحديث، ودليل جامع للمراكز المعتمدة لتحفيظ القرآن الكريم والجمعيات الخيرية والمقارئ عن بعد.',
    fullDescriptionEn: 'Profiles of prominent Islamic scholars, four Imams, classical texts, alongside a curated directory of accredited Quran memorization centers worldwide.',
    actionUrl: '/scholars',
    actionLabel: 'تصفح موسوعة العلماء',
    actionLabelEn: 'Browse Scholars',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'سير الأئمة الأربعة وكبار أئمة الحديث والتفسير',
      'دليل للمقارئ الإلكترونية المعتمدة للتعليم عن بعد',
      'معلومات تواصل وروابط رسمية للمؤسسات القرآنية'
    ]
  },

  // ==========================================
  // Release v2.2.0 Updates
  // ==========================================
  {
    id: 'up-2026-companion-daily',
    releaseId: 'rel-v2.2.0',
    version: '2.2.0',
    releaseDate: '2026-11-02',
    category: 'new_feature',
    title: 'رفيق المسلم اليومي ومتابعة الطاعات والسنن الرواتب (/companion)',
    titleEn: 'Daily Muslim Companion & Worship Tracker (/companion)',
    shortDescription: 'لوحة تفاعلية لمتابعة أداء الصلوات الخمس والسنن الرواتب، قيام الليل، وصيام النوافل مع إحصائيات تحفيزية.',
    shortDescriptionEn: 'Interactive daily dashboard to track five daily prayers, Sunnahs, night prayer, and voluntary fasting with motivating stats.',
    fullDescription: 'أداة يومية لمساعدة المؤمن على المحافظة على الفرائض والنوافل، ومتابعة قراءة القرآن والذكر، مع سجل تقدم محلي محفوظ في المتصفح للحفاظ على الخصوصية الكاملة.',
    fullDescriptionEn: 'A private daily tracking system for mandatory and voluntary worship, Quran recitation habits, and daily achievements.',
    actionUrl: '/companion',
    actionLabel: 'افتح رفيق المسلم',
    actionLabelEn: 'Open Companion',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'متابعة تفاعلية للصلوات الخمس في أوقاتها مع السنن الرواتب',
      'تتبع صيام الاثنين والخميس والأيام البيض',
      'خصوصية تامة بدون جمع أي بيانات شخصية على خوادم خارجية'
    ]
  },
  {
    id: 'up-2026-hajj-umrah',
    releaseId: 'rel-v2.2.0',
    version: '2.2.0',
    releaseDate: '2026-11-02',
    category: 'new_feature',
    title: 'دليل الحج والعمرة التفاعلي وأحكام المشاعر المقدسة (/hajj-umrah)',
    titleEn: 'Interactive Hajj & Umrah Guide & Sacred Sites Map (/hajj-umrah)',
    shortDescription: 'دليل عملي لمناسك الحج بأنواعه الثلاثة والعمرة خطوة بخطوة مع المواقيت الزمانية والمكانية والأدعية المأثورة.',
    shortDescriptionEn: 'Comprehensive guide to Hajj rites and Umrah with temporal and spatial Miqats, illustrated walkthroughs, and authentic invocations.',
    fullDescription: 'شرح مفصل لكيفية أداء العمرة والحج (التمتع، القران، الإفراد)، مع توضيح مناسك يوم التروية وعرفة ومزدلفة والتشريق، وأحكام الفدية والمحظورات.',
    fullDescriptionEn: 'Detailed walkthrough for Hajj and Umrah pilgrims covering Miqats, Tawaf, Sa\'i, Mina, Arafat, Muzdalifah, Jamarat, and farewell rites.',
    actionUrl: '/hajj-umrah',
    actionLabel: 'دليل الحج والعمرة',
    actionLabelEn: 'Hajj & Umrah Guide',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'مخطط تفاعلي لخطوات العمرة خطوة بخطوة',
      'جدول زمني ومكاني لأيام الحج من 8 إلى 13 ذي الحجة',
      'بيان مواقيت الإحرام الجغرافية بالخريطة والمسافات'
    ]
  },
  {
    id: 'up-2026-kids-world',
    releaseId: 'rel-v2.2.0',
    version: '2.2.0',
    releaseDate: '2026-11-02',
    category: 'new_feature',
    title: 'عالم الأطفال المسلم والتعليم التفاعلي للناشئة (/kids)',
    titleEn: 'Muslim Kids Learning World & Interactive Education (/kids)',
    shortDescription: 'بيئة تربوية آمنة لتعليم الأطفال قصص الأنبياء، أركان الإسلام، الأخلاق والآداب من خلال ألعاب وتحديات مسلية.',
    shortDescriptionEn: 'Safe educational environment teaching children prophets stories, Islamic pillars, and moral manners with games and quizzes.',
    fullDescription: 'قسم مخصص للأطفال والناشئة يقدم قصصاً مصورة بأسلوب شائق، وتعليماً تفاعلياً لأركان الإيمان والإسلام، مع مسابقات وأسئلة تشجيعية وأوسمة إنجاز.',
    fullDescriptionEn: 'Engaging learning space for young Muslims featuring visual prophetic tales, moral stories, manners, and rewarded quizzes.',
    actionUrl: '/kids',
    actionLabel: 'ادخل عالم الأطفال',
    actionLabelEn: 'Enter Kids World',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'قصص مصورة ومكتوبة للأطفال بعناية تربوية فائقة',
      'ألعاب تفاعلية لترتيب خطوات الصلاة والوضوء',
      'بيئة آمنة تماماً وخالية من أي إعلانات'
    ]
  },
  {
    id: 'up-2026-history-atlas',
    releaseId: 'rel-v2.2.0',
    version: '2.2.0',
    releaseDate: '2026-11-02',
    category: 'new_feature',
    title: 'أطلس التاريخ الإسلامي والخط الزمني للحواضر والفتوحات (/history-atlas)',
    titleEn: 'Interactive Islamic History Atlas & Timeline of Civilizations (/history-atlas)',
    shortDescription: 'رحلة بصرية تاريخية لاستكشاف الفتوحات، الدول والحواضر الإسلامية (مكة، المدينة، القدس، دمشق، بغداد، قرطبة، القاهرة).',
    shortDescriptionEn: 'Visual historical journey exploring major eras, battles, scientific advances, and Islamic capitals across continents.',
    fullDescription: 'خريطة تفاعلية كبرى وخط زمني شامل يمتد من العهد النبوي الشريف والخلفاء الراشدين والدولة الأموية والعباسية والأندلسية وصولاً إلى العصر الحديث، موثقاً المعالم والأحداث المفصلية.',
    fullDescriptionEn: 'Comprehensive visual timeline and capital explorer charting Islamic civilization from the Prophetic era through the Rightly-Guided Caliphs, Umayyads, Abbasids, and Andalusia.',
    actionUrl: '/history-atlas',
    actionLabel: 'تصفح أطلس التاريخ',
    actionLabelEn: 'Browse History Atlas',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'خط زمني متدرج من السنة 1 هجرية حتى العصر الحديث',
      'أطلس تفاعلي لحواضر العالم الإسلامي وأبرز معالمها',
      'توثيق للإنجازات العلمية والحضارية لأعلام المسلمين'
    ]
  },

  // ==========================================
  // Release v2.1.0 Updates
  // ==========================================
  {
    id: 'up-2026-pwa-web-architecture',
    releaseId: 'rel-v2.1.0',
    version: '2.1.0',
    releaseDate: '2026-11-01',
    category: 'performance',
    title: 'البنية السحابية النقية وتطبيق الويب التقدمي (PWA)',
    titleEn: 'Pure Web Cloud Architecture & Progressive Web App (PWA)',
    shortDescription: 'تحويل كامل للمنصة كـ Web-Only وتطبيق PWA متطور على نطاق wasl-islam.fun دون أية أطر أصلية أو ملفات APK.',
    shortDescriptionEn: 'Complete transformation of Madar Al-Yaqeen into a pure modern web application accessible globally on wasl-islam.fun.',
    fullDescription: 'تم التخلص الكامل من أية أطر هجينة أو تحزيمات أصلية لنظام أندرويد أو كاباسيتور، والاعتماد الحصري على معايير الويب المفتوحة (Progressive Web App) مع دعم التثبيت المباشر على الشاشة الرئيسية للهواتف وأجهزة الحاسب وسرعة تحميل فائقة وتخزين مؤقت آمن.',
    fullDescriptionEn: 'Clean architectural simplification removing all native wrappers and mobile APK packaging in favor of a responsive, lightning-fast Progressive Web App on Cloudflare Workers.',
    actionUrl: '/',
    actionLabel: 'زيارة الصفحة الرئيسية',
    actionLabelEn: 'Visit Home',
    status: 'published',
    importance: 'normal',
    popupVisibility: {
      showPopup: false,
      forceUntilAcknowledged: false
    },
    targetAudience: 'all',
    highlights: [
      'تطبيق ويب تقدمي PWA سريع وقابل للتثبيت بنقرة واحدة',
      'توافق كامل مع مختلف الشاشات والهواتف والمتصفحات',
      'نشر سحابي سريع على شبكة Cloudflare العالمية'
    ]
  }
];
