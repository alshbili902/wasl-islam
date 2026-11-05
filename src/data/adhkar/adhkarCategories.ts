import { AdhkarCategoryId } from '../../types';

export interface AdhkarCategoryMeta {
  id: AdhkarCategoryId;
  title: string;
  titleEn: string;
  subtitle: string;
  icon: string;
  badge: string;
  sectionGroup: 'daily' | 'worship' | 'life' | 'seasons';
}

export const EXPANDED_ADHKAR_CATEGORIES: AdhkarCategoryMeta[] = [
  // 1. الأوراد اليومية الكبرى
  {
    id: 'morning',
    title: 'أذكار الصباح',
    titleEn: 'Morning Adhkar',
    subtitle: 'حرز المؤمن ونور يومه من طلوع الفجر حتى الزوال',
    icon: 'Sun',
    badge: 'حرز يومي',
    sectionGroup: 'daily'
  },
  {
    id: 'evening',
    title: 'أذكار المساء',
    titleEn: 'Evening Adhkar',
    subtitle: 'حصن وسكينة النفس من بعد صلاة العصر حتى الليل',
    icon: 'Moon',
    badge: 'حصن المساء',
    sectionGroup: 'daily'
  },
  {
    id: 'sleep',
    title: 'أذكار النوم',
    titleEn: 'Sleep Adhkar',
    subtitle: 'السكينة والتحصين الإلهي وودائع الروح قبل المنام',
    icon: 'BedDouble',
    badge: 'وديعة الروح',
    sectionGroup: 'daily'
  },
  {
    id: 'wakeup',
    title: 'أذكار الاستيقاظ',
    titleEn: 'Waking Up Adhkar',
    subtitle: 'حمد الله على رد الحياة والروح مع مطلع الفجر',
    icon: 'Sunrise',
    badge: 'بعث الحياة',
    sectionGroup: 'daily'
  },
  {
    id: 'daily_remembrance',
    title: 'الأذكار اليومية ومجامع التسبيح',
    titleEn: 'General Daily Tasbih & Tahlil',
    subtitle: 'الباقيات الصالحات وكنوز الجنة والاستغفار المائة',
    icon: 'Sparkles',
    badge: 'كنوز الجنة',
    sectionGroup: 'daily'
  },
  {
    id: 'protection_wellbeing',
    title: 'أذكار الحفظ والتحصين',
    titleEn: 'Protection & Daily Wellbeing',
    subtitle: 'الاستعاذة بكلمات الله التامة من الهوام والشرور والعين',
    icon: 'Shield',
    badge: 'الدرع الواقي',
    sectionGroup: 'daily'
  },

  // 2. أذكار الصلاة والمساجد والقرآن
  {
    id: 'prayer',
    title: 'أذكار بعد الصلاة المفروضة',
    titleEn: 'After Prayer Adhkar',
    subtitle: 'الأذكار المسنونة دبر كل صلاة مكتوبة قبل مغادرة المصلى',
    icon: 'Sparkles',
    badge: 'عقب المكتوبة',
    sectionGroup: 'worship'
  },
  {
    id: 'prayer_actions',
    title: 'أذكار الصلاة (الركوع والسجود)',
    titleEn: 'In-Prayer Adhkar',
    subtitle: 'دعاء الاستفتاح، تسبيح الركوع، دعاء السجود، والتشهد',
    icon: 'HeartHandshake',
    badge: 'خشوع الصلاة',
    sectionGroup: 'worship'
  },
  {
    id: 'mosque',
    title: 'أذكار المسجد والأذان',
    titleEn: 'Mosque & Adhan Adhkar',
    subtitle: 'المشي للمسجد، ترديد الأذان، ودخول وخروج بيت الله',
    icon: 'Building2',
    badge: 'بيوت الله',
    sectionGroup: 'worship'
  },
  {
    id: 'wudu_purification',
    title: 'أذكار الوضوء والطهارة',
    titleEn: 'Wudu & Purification',
    subtitle: 'البسملة والذكر الثابت عقب الفراغ من الطهارة',
    icon: 'Sparkles',
    badge: 'طهارة وبهاء',
    sectionGroup: 'worship'
  },
  {
    id: 'quranic_remembrance',
    title: 'الأذكار من القرآن الكريم',
    titleEn: 'Quranic Remembrances',
    subtitle: 'آية الكرسي، خواتيم البقرة، والمعوذات وسور التحصين',
    icon: 'BookOpen',
    badge: 'محكم التنزيل',
    sectionGroup: 'worship'
  },

  // 3. أذكار العادات والأحوال المعيشية
  {
    id: 'home',
    title: 'أذكار المنزل',
    titleEn: 'Home Adhkar',
    subtitle: 'البركة عند الدخول، وحفظ البيت، والتسمية عند الخروج',
    icon: 'Home',
    badge: 'سكينة البيت',
    sectionGroup: 'life'
  },
  {
    id: 'food_drink',
    title: 'أذكار الطعام والشراب والضيافة',
    titleEn: 'Food & Drink Adhkar',
    subtitle: 'التسمية، دعاء من نسي التسمية، والحمد بعد الأكل والضيافة',
    icon: 'Utensils',
    badge: 'شكر النعمة',
    sectionGroup: 'life'
  },
  {
    id: 'travel',
    title: 'أذكار السفر والتنقل',
    titleEn: 'Travel Adhkar',
    subtitle: 'دعاء ركوب السيارة والمركبة، النزول في منزل، والتكبير والتسبيح',
    icon: 'Compass',
    badge: 'حفظ المسافر',
    sectionGroup: 'life'
  },
  {
    id: 'weather_nature',
    title: 'أذكار الأحوال الجوية والظواهر',
    titleEn: 'Weather & Nature Adhkar',
    subtitle: 'نزول المطر، الرياح الشديدة، سماع الرعد، ورؤية الهلال',
    icon: 'Sun',
    badge: 'آيات الكون',
    sectionGroup: 'life'
  },
  {
    id: 'distress_relief',
    title: 'أذكار الكرب والهم والشدائد',
    titleEn: 'Distress & Relief Adhkar',
    subtitle: 'أدعية تفريج الغم، دفع الخوف، قضاء الدين، وضبط الغضب',
    icon: 'Shield',
    badge: 'مفتاح الفرج',
    sectionGroup: 'life'
  },
  {
    id: 'illness_ruqyah',
    title: 'أذكار المرض والرقية وعيادة المريض',
    titleEn: 'Illness & Ruqyah Adhkar',
    subtitle: 'رقية الجسد والآلام، عيادة المريض، وطلب الشفاء والعافية',
    icon: 'HeartHandshake',
    badge: 'الشفاء والعافية',
    sectionGroup: 'life'
  },

  // 4. أذكار المواسم والمناسبات الخاصة
  {
    id: 'hajj_umrah',
    title: 'أذكار الحج والعمرة',
    titleEn: 'Hajj & Umrah Adhkar',
    subtitle: 'التلبية، الطواف، السعي على الصفا والمروة، وذكر عرفات',
    icon: 'Compass',
    badge: 'المشاعر المقدسة',
    sectionGroup: 'seasons'
  },
  {
    id: 'friday',
    title: 'أذكار يوم الجمعة',
    titleEn: 'Friday Adhkar',
    subtitle: 'إكثار الصلاة على النبي ﷺ، قراءة الكهف، وساعة الإجابة',
    icon: 'Sparkles',
    badge: 'سيد الأيام',
    sectionGroup: 'seasons'
  },
  {
    id: 'ramadan_fasting',
    title: 'أذكار الصيام ورمضان',
    titleEn: 'Fasting & Ramadan Adhkar',
    subtitle: 'دعاء الإفطار، رد الإساءة للصائم، والتماس ليلة القدر',
    icon: 'Moon',
    badge: 'شهر القرآن',
    sectionGroup: 'seasons'
  },
  {
    id: 'specialized_events',
    title: 'أذكار المناسبات والأحداث الخاصة',
    titleEn: 'Specialized Events Adhkar',
    subtitle: 'العطاس، صياح الديك، دخول السوق، زيارة القبور، ورؤية المبشرات',
    icon: 'Sparkles',
    badge: 'مواقف خاصة',
    sectionGroup: 'seasons'
  },
  {
    id: 'general',
    title: 'أذكار متنوعة جامعة',
    titleEn: 'General Devotional Remembrances',
    subtitle: 'جوامع الذكر والاستغفار والتسبيح المطلق في سائر الأوقات',
    icon: 'HeartHandshake',
    badge: 'جوامع الذكر',
    sectionGroup: 'daily'
  }
];

