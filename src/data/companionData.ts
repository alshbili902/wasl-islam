import { DailyActivity } from '../types/companion';

export const DEFAULT_COMPANION_ACTIVITIES: DailyActivity[] = [
  // 1. الصلوات المكتوبة (الفروض الخمسة)
  {
    id: 'fajr_prayer',
    title: 'صلاة الفجر في وقتها',
    description: 'أداء فريضة الفجر في أول وقتها جماعة للرجال مع استحضار خشوع الصلاة.',
    category: 'fard_prayer',
    isObligatory: true,
    period: 'morning',
    iconName: 'Sun',
    referenceEvidence: '﴿أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ ۖ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا﴾ [الإسراء: 78]'
  },
  {
    id: 'dhuhr_prayer',
    title: 'صلاة الظهر في وقتها',
    description: 'أداء فريضة الظهر بعد الزوال.',
    category: 'fard_prayer',
    isObligatory: true,
    period: 'afternoon',
    iconName: 'Sun',
    referenceEvidence: '«أول ما يحاسب به العبد يوم القيامة الصلاة» [رواه الترمذي]'
  },
  {
    id: 'asr_prayer',
    title: 'صلاة العصر (الصلاة الوسطى)',
    description: 'المحافظة على صلاة العصر في وقتها وعدم تأخيرها.',
    category: 'fard_prayer',
    isObligatory: true,
    period: 'afternoon',
    iconName: 'SunMedium',
    referenceEvidence: '«من ترك صلاة العصر حبط عمله» [رواه البخاري]'
  },
  {
    id: 'maghrib_prayer',
    title: 'صلاة المغرب في وقتها',
    description: 'أداء فريضة المغرب عقب غروب الشمس مباشرة.',
    category: 'fard_prayer',
    isObligatory: true,
    period: 'evening',
    iconName: 'Sunset',
    referenceEvidence: '«لا تزال أمتي بخير ما لم يؤخروا المغرب حتى تشتبك النجوم» [رواه أحمد]'
  },
  {
    id: 'isha_prayer',
    title: 'صلاة العشاء في وقتها',
    description: 'أداء فريضة العشاء جماعة.',
    category: 'fard_prayer',
    isObligatory: true,
    period: 'night',
    iconName: 'Moon',
    referenceEvidence: '«ولو يعلمون ما في العتمة والصبح لأتوهما ولو حبوا» [متفق عليه]'
  },

  // 2. السنن والرواتب والنوافل
  {
    id: 'sunan_rawatib',
    title: 'السنن الرواتب (12 ركعة)',
    description: 'ركعتان قبل الفجر، 4 قبل الظهر و2 بعدها، 2 بعد المغرب، و2 بعد العشاء.',
    category: 'sunnah_prayer',
    isObligatory: false,
    period: 'anytime',
    iconName: 'Sparkles',
    defaultTarget: 12,
    unitLabel: 'ركعة',
    referenceEvidence: '«ما من عبد مسلم يصلي لله كل يوم ثنتي عشرة ركعة تطوعاً غير فريضة إلا بنى الله له بيتاً في الجنة» [صحيح مسلم]'
  },
  {
    id: 'duha_prayer',
    title: 'صلاة الضحى (صلاة الأوابين)',
    description: 'ركعتان أو أربع ركعات بعد شروق الشمس بربع ساعة وحتى قبل الزوال.',
    category: 'sunnah_prayer',
    isObligatory: false,
    period: 'morning',
    iconName: 'SunMedium',
    defaultTarget: 2,
    unitLabel: 'ركعة',
    referenceEvidence: '«يصبح على كل سلامى من أحدكم صدقة... ويجزئ من ذلك ركعتان يركعهما من الضحى» [صحيح مسلم]'
  },
  {
    id: 'qiyam_witr',
    title: 'قيام الليل وركعة الوتر',
    description: 'التهجد في جوف الليل وختم صلاة الليل بالوتر.',
    category: 'sunnah_prayer',
    isObligatory: false,
    period: 'night',
    iconName: 'MoonStar',
    defaultTarget: 3,
    unitLabel: 'ركعات',
    referenceEvidence: '«أفضل الصلاة بعد الصلاة المكتوبة صلاة الليل» [صحيح مسلم]'
  },

  // 3. القرآن الكريم والورد اليومي
  {
    id: 'daily_quran_reading',
    title: 'الورد القرآني اليومي (تلاوة وتدبر)',
    description: 'تلاوة جزء يومي أو القدر المحدد في خطتك مع تدبر المعاني.',
    category: 'quran',
    isObligatory: false,
    period: 'anytime',
    iconName: 'BookOpen',
    defaultTarget: 10,
    unitLabel: 'صفحات',
    referenceEvidence: '«اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه» [صحيح مسلم]'
  },
  {
    id: 'quran_memorization',
    title: 'حفظ ومراجعة القرآن الكريم',
    description: 'حفظ آيات جديدة أو مراجعة المحفوظ السابق لتثبيته في الصدر.',
    category: 'quran',
    isObligatory: false,
    period: 'anytime',
    iconName: 'ScrollText',
    defaultTarget: 5,
    unitLabel: 'آيات',
    referenceEvidence: '«يقال لصاحب القرآن: اقرأ وارقَ ورتل كما كنت ترتل في الدنيا» [رواه الترمذي]'
  },

  // 4. الأذكار النبوية الموثقة
  {
    id: 'morning_adhkar',
    title: 'أذكار الصباح كاملة',
    description: 'الأذكار المأثورة بعد صلاة الفجر وحتى شروق الشمس حفظاً وسكينة.',
    category: 'adhkar',
    isObligatory: false,
    period: 'morning',
    iconName: 'Sparkles',
    referenceEvidence: '«من قال حين يصبح وحين يمسي: سبحان الله وبحمده مائة مرة لم يأت أحد يوم القيامة بأفضل مما جاء به» [صحيح مسلم]'
  },
  {
    id: 'evening_adhkar',
    title: 'أذكار المساء كاملة',
    description: 'الأذكار المأثورة من بعد العصر حتى غروب الشمس ودخول الليل.',
    category: 'adhkar',
    isObligatory: false,
    period: 'evening',
    iconName: 'Sparkles',
    referenceEvidence: '﴿وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ الْغُرُوبِ﴾ [ق: 39]'
  },
  {
    id: 'sleep_adhkar',
    title: 'أذكار النوم وسورة الملك',
    description: 'آية الكرسي، المعوذات، قراءة سورة تبارك، والوضوء قبل النوم.',
    category: 'adhkar',
    isObligatory: false,
    period: 'night',
    iconName: 'Moon',
    referenceEvidence: '«إذا أويت إلى فراشك فاقرأ آية الكرسي لن يزال عليك من الله حافظ» [صحيح البخاري]'
  },
  {
    id: 'daily_istighfar_salawat',
    title: 'الاستغفار والصلاة على النبي ﷺ (100 مرة)',
    description: 'المداومة على الاستغفار وسيد الاستغفار والصلاة الإبراهيمية على الحبيب ﷺ.',
    category: 'adhkar',
    isObligatory: false,
    period: 'anytime',
    iconName: 'HeartHandshake',
    defaultTarget: 100,
    unitLabel: 'مرة',
    referenceEvidence: '«إنه ليغان على قلبي وإني لأستغفر الله في اليوم مائة مرة» [صحيح مسلم]'
  },

  // 5. الصدقة وصلة الرحم والأخلاق
  {
    id: 'daily_sadaqah',
    title: 'صدقة اليوم وإدخال السرور',
    description: 'بذل مال، أو كف أذى، أو إطعام طعام، أو ابتسامة وكلمة طيبة.',
    category: 'charity',
    isObligatory: false,
    period: 'anytime',
    iconName: 'HeartHandshake',
    referenceEvidence: '«الصدقة تطفئ الخطيئة كما يطفئ الماء النار» [رواه الترمذي]'
  },
  {
    id: 'family_silah',
    title: 'بر الوالدين وصلة الرحم',
    description: 'مكالمة، زيارة، أو دعاء للوالدين والأقارب تعزيزاً للصلة الشرعية.',
    category: 'manners',
    isObligatory: false,
    period: 'anytime',
    iconName: 'Users',
    referenceEvidence: '«من سره أن يبسط له في رزقه وأن ينسأ له في أثره فليصل رحمه» [متفق عليه]'
  },
  {
    id: 'voluntary_fasting',
    title: 'صيام التطوع (الاثنين/الخميس/البيض)',
    description: 'صيام النوافل المستحبة تقرباً إلى الله عز وجل.',
    category: 'fasting',
    isObligatory: false,
    period: 'morning',
    iconName: 'Clock',
    referenceEvidence: '«من صام يوماً في سبيل الله باعد الله وجهه عن النار سبعين خريفاً» [متفق عليه]'
  }
];

export const ENCOURAGING_WISDOM = [
  {
    text: '«أحب الأعمال إلى الله أدومها وإن قل»',
    source: 'صحيح البخاري'
  },
  {
    text: '«سددوا وقاربوا، واعلموا أنه لن ينجو أحد منكم بعمله، قالوا: ولا أنت يا رسول الله؟ قال: ولا أنا إلا أن يتغمدني الله برحمة منه وفضل»',
    source: 'متفق عليه'
  },
  {
    text: '«ما تقرب إلي عبدي بشيء أحب إلي مما افترضت عليه، وما يزال عبدي يتقرب إلي بالنوافل حتى أحبه»',
    source: 'حديث قدسي - صحيح البخاري'
  },
  {
    text: '«يا عبد الله، لا تكن مثل فلان؛ كان يقوم الليل ثم ترك قيام الليل»',
    source: 'صحيح البخاري'
  }
];

