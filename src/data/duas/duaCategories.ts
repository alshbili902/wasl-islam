import { DuaCategoryMeta } from '../../types/duas';

export const DUA_SITUATION_CATEGORIES: DuaCategoryMeta[] = [
  {
    id: 'daily_life',
    titleAr: 'اليوم والليلة والعادات',
    titleEn: 'Daily Life Supplications',
    subtitleAr: 'أدعية الاستيقاظ، النوم، اللباس، الطعام، الخلاء، ودخول وخروج المنزل',
    iconName: 'Sun',
    badge: 'الحصن اليومي',
    colorGradient: 'from-amber-950 via-[#072A20] to-emerald-950'
  },
  {
    id: 'worship',
    titleAr: 'الصلاة والعبادات',
    titleEn: 'Worship & Prayer',
    subtitleAr: 'أدعية الاستفتاح، الركوع، السجود، القنوت، الوتر، الطهارة، والحج والعمرة والصيام',
    iconName: 'HeartHandshake',
    badge: 'روح العبادة',
    colorGradient: 'from-emerald-950 via-[#072A20] to-teal-950'
  },
  {
    id: 'distress',
    titleAr: 'تفريج الكرب والهم والضيق',
    titleEn: 'Distress, Anxiety & Relief',
    subtitleAr: 'أدعية تفريج الأحزان، قضاء الدين، دفع الخوف، رد الغضب، والسكينة القلبية',
    iconName: 'Shield',
    badge: 'مفتاح الفرج',
    colorGradient: 'from-teal-950 via-[#072A20] to-slate-950'
  },
  {
    id: 'health',
    titleAr: 'الشفاء والرقية الشرعية',
    titleEn: 'Health & Healing (Ruqyah)',
    subtitleAr: 'أدعية المرض، عيادة المريض، الرقية المأثورة عن النبي ﷺ، والاستعاذة من الآلام',
    iconName: 'Sparkles',
    badge: 'العافية والرقية',
    colorGradient: 'from-emerald-900 via-[#072A20] to-cyan-950'
  },
  {
    id: 'family',
    titleAr: 'الوالدين والذرية والأهل',
    titleEn: 'Parents, Children & Family',
    subtitleAr: 'أدعية بر الوالدين حيين وميتين، صلاح الذرية والأبناء، المودة الزوجية، ولم الشمل',
    iconName: 'Users',
    badge: 'بر ورحمة',
    colorGradient: 'from-teal-900 via-[#072A20] to-emerald-950'
  },
  {
    id: 'nature',
    titleAr: 'المطر والرياح والظواهر',
    titleEn: 'Nature & Weather',
    subtitleAr: 'أدعية نزول الغيث، هبوب الرياح، سماع الرعد، رؤية الهلال، وكسوف الشمس',
    iconName: 'Compass',
    badge: 'آيات الكون',
    colorGradient: 'from-blue-950 via-[#072A20] to-emerald-950'
  },
  {
    id: 'travel',
    titleAr: 'السفر والتنقل',
    titleEn: 'Travel & Journeys',
    subtitleAr: 'دعاء ركوب الدابة والمركبة، السفر، النزول في منزل، ودعاء العودة للوطن',
    iconName: 'Compass',
    badge: 'حفظ المسافر',
    colorGradient: 'from-emerald-950 via-[#072A20] to-amber-950'
  },
  {
    id: 'seasons',
    titleAr: 'المواسم والأوقات الفاضلة',
    titleEn: 'Seasons & Blessed Times',
    subtitleAr: 'أدعية شهر رمضان، ليلة القدر، عشر ذي الحجة، يوم عرفة، الجمعة، وسحر الليل',
    iconName: 'Sparkles',
    badge: 'نفحات الخير',
    colorGradient: 'from-amber-900 via-[#072A20] to-emerald-950'
  }
];

export const DUA_SOURCE_TABS = [
  { id: 'all', labelAr: 'كافة الأدعية الموثقة', descriptionAr: 'المكتبة الشاملة لجميع الأدعية القرآنية والنبوية والجامعة' },
  { id: 'quranic', labelAr: 'أدعية القرآن الكريم', descriptionAr: 'الأدعية المنزلة في محكم التنزيل وأدعية الأنبياء والمرسلين' },
  { id: 'prophetic', labelAr: 'الأدعية النبوية الصحيحة', descriptionAr: 'الأدعية الثابتة عن خير البرية ﷺ في أصح كتب السنة' },
  { id: 'general', labelAr: 'أدعية جامعة مأثورة', descriptionAr: 'صيغ دعاء مباحة ومأثورة شرعاً لا تنسب لسنة راتبة محددة' }
];
