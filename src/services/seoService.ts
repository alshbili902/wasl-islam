/**
 * Comprehensive SEO Service for Madar Al-Yaqeen (مدار اليقين)
 * معمارية تحسين محركات البحث والأرشفة المتقدمة لمحرك بحث جوجل
 */

import { SITE_CONFIG } from '../config/siteConfig';
import { SURAHS_META } from '../data/surahsMeta';
import { PROPHETS_DATA } from '../data/prophetsData';
import { COMPANIONS_DATA } from '../data/companionsData';
import { ACADEMY_TRACKS } from '../data/academyData';
import { SEED_UPDATES } from '../data/updates/updatesSeedData';

export interface BreadcrumbItem {
  name?: string;
  label?: string;
  url?: string;
  path?: string;
}

export type SchemaType =
  | 'WebSite'
  | 'Organization'
  | 'CollectionPage'
  | 'Article'
  | 'LearningResource'
  | 'website'
  | 'article'
  | 'collection'
  | 'learning';

export interface RouteSeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  breadcrumbs?: BreadcrumbItem[];
  noindex?: boolean;
  schemaType?: SchemaType;
  schemaData?: Record<string, unknown>;
}

export const BASE_PRODUCTION_URL = SITE_CONFIG.productionUrl || 'https://wasl-islam.fun';
export const DEFAULT_OG_IMAGE = `${BASE_PRODUCTION_URL}/images/madar-al-yaqeen-logo-horizontal.png`;

/**
 * Metadata Registry for all Public Routes
 */
export const ROUTE_SEO_MAP: Record<string, RouteSeoConfig> = {
  '/': {
    title: 'مدار اليقين | المنصة الإسلامية الرقمية العالمية',
    description: 'المنصة الإسلامية الرقمية الفاخرة؛ تجمع المصحف العثماني، مواقيت الصلاة الدقيقة، أطلس قراء العالم، الختمة الذكية، واحة الأذكار، والموسوعات الشرعية الموثقة.',
    canonicalPath: '/',
    ogType: 'website',
    keywords: ['مدار اليقين', 'منصة إسلامية', 'المصحف الشريف', 'مواقيت الصلاة', 'أذكار الصباح والمساء', 'الختمة القرآنية'],
    schemaType: 'WebSite',
  },
  '/prayer': {
    title: 'مواقيت الصلاة الفلكية الدقيقة واتجاه القبلة',
    description: 'حساب مواقيت الصلاة لجميع مدن العالم وفق أدق المعايير الفلكية، مع تحديد دقيق لاتجاه القبلة الشريفة ومنبه الأذان المرئي والمسموع.',
    canonicalPath: '/prayer',
    ogType: 'website',
    keywords: ['مواقيت الصلاة', 'أوقات الأذان', 'اتجاه القبلة', 'صلاة الفجر', 'صلاة الجمعة'],
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'مواقيت الصلاة', url: '/prayer' },
    ],
  },
  '/quran': {
    title: 'المصحف الشريف بالرسم العثماني والتلاوات المرتلة',
    description: 'تصفح القرآن الكريم كاملاً برواية حفص عن عاصم وبالرسم العثماني المعتمد لمجمع الملك فهد، مع إمكانية الاستماع لأشهر القراء وتفسير الآيات.',
    canonicalPath: '/quran',
    ogType: 'website',
    keywords: ['المصحف الرقمي', 'القرآن الكريم', 'رسم عثماني', 'تلاوة القرآن', 'تفسير القرآن'],
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'المصحف الشريف', url: '/quran' },
    ],
    schemaType: 'CollectionPage',
  },
  '/reciters': {
    title: 'أطلس قراء القرآن الكريم والمصاحف المرتلة',
    description: 'استمع وحمّل تلاوات بأصوات كبار قراء العالم الإسلامي بمختلف الروايات والتسجيلات الإذاعية النادرة بجودة صوتية عالية.',
    canonicalPath: '/reciters',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'القراء والتلاوات', url: '/reciters' },
    ],
  },
  '/khatmah': {
    title: 'الختمة القرآنية الذكية وتتبع الورد اليومي',
    description: 'نظام إدارة وجدولة الختمات القرآنية الفردية والجماعية؛ حدد مدة الختمة وتتبع قراءتك يومياً مع إحصائيات الإنجاز الدقيقة.',
    canonicalPath: '/khatmah',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'الختمة القرآنية', url: '/khatmah' },
    ],
  },
  '/adhkar': {
    title: 'موسوعة الأذكار والتحصينات النبوية الموثقة',
    description: 'واحة الأذكار الشاملة المصنفة حسب الأوقات والأحوال؛ أذكار الصباح والمساء، أذكار الصلاة والنوم، مخرجة ومحققة من كتب السنة النبوية.',
    canonicalPath: '/adhkar',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'الأذكار النبوية', url: '/adhkar' },
    ],
    schemaType: 'CollectionPage',
  },
  '/duas': {
    title: 'موسوعة الأدعية القرآنية والنبوية الجامعة',
    description: 'موسوعة كبرى لأدعية القرآن الكريم وصحيح السنة المطهرة؛ أدعية الأنبياء، تفريج الكروب، الرقية الشرعية، مع بيان الفضل والدرجة الحديثية.',
    canonicalPath: '/duas',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'موسوعة الأدعية', url: '/duas' },
    ],
    schemaType: 'CollectionPage',
  },
  '/hadith': {
    title: 'موسوعة الحديث الشريف والأربعين النووية',
    description: 'موسوعة الأحاديث النبوية الصحيحة؛ متضمنة متن وشرح الأربعين النووية، ورياض الصالحين، ومختارات الصحيحين مع التخريج والأحكام الفقهية.',
    canonicalPath: '/hadith',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'موسوعة الحديث الشريف', url: '/hadith' },
    ],
    schemaType: 'CollectionPage',
  },
  '/tafsir': {
    title: 'تفسير القرآن الكريم وبيان معاني الآيات',
    description: 'موسوعة التفسير الميسر المعتمد؛ بيان غريب الكلمات، أسباب النزول، وهدايات الآيات لكافة سور القرآن الكريم المائة وأربعة عشر.',
    canonicalPath: '/tafsir',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'تفسير القرآن', url: '/tafsir' },
    ],
  },
  '/seerah': {
    title: 'السيرة النبوية العطرة والخط الزمني للرسالة',
    description: 'رحلة تفاعلية موثقة في سيرة النبي محمد ﷺ؛ محطات العهد المكي والمدني، الغزوات والعهود، والأخلاق النبوية الشريفة مدعومة بالخرائط.',
    canonicalPath: '/seerah',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'السيرة النبوية', url: '/seerah' },
    ],
  },
  '/companions': {
    title: 'موسوعة الصحابة والصحابيات وسير أعلام الهدى',
    description: 'سير وتراجم الخلفاء الراشدين، العشرة المبشرين بالجنة، أمهات المؤمنين، والصحابيات الجليلات رضي الله عنهم أجمعين ومواقفهم الخالدة.',
    canonicalPath: '/companions',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'موسوعة الصحابة', url: '/companions' },
    ],
  },
  '/prophets': {
    title: 'قصص الأنبياء والمرسلين والدروس الإيمانية',
    description: 'موسوعة قصص الأنبياء عليهم الصلاة والسلام الوارد ذكرهم في القرآن الكريم، مبيّنة مواطن العبرة والدعوة إلى التوحيد الخالص.',
    canonicalPath: '/prophets',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'قصص الأنبياء', url: '/prophets' },
    ],
  },
  '/academy': {
    title: 'أكاديمية مدار اليقين للعلوم الشرعية والتعليم التفاعلي',
    description: 'مسارات تعليمية تفاعلية متدرجة في العقيدة، الفقه، التجويد، الحديث، والسيرة مع اختبارات قياس الفهم وشهادات إتمام إلكترونية.',
    canonicalPath: '/academy',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'الأكاديمية الإسلامية', url: '/academy' },
    ],
    schemaType: 'LearningResource',
  },
  '/daily-fiqh': {
    title: 'فقه الحياة اليومية المعاصرة والنوازل الشرعية',
    description: 'فتاوى وأحكام فقهية معاصرة في المعاملات المالية، الطب، التقنية، السفر، والعبادات موثقة عن كبار الهيئات العلمية والمجامع الفقهية.',
    canonicalPath: '/daily-fiqh',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'فقه الحياة اليومية', url: '/daily-fiqh' },
    ],
  },
  '/content-verifier': {
    title: 'مدقق صحة الأحاديث والروايات والرسائل المتداولة',
    description: 'محرك بحث وفحص لصحة الأحاديث النبوية والرسائل الشائعة في وسائل التواصل، مع بيان درجة صحتها والبديل الشرعي الثابت الصحيح.',
    canonicalPath: '/content-verifier',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'تحقيق صحة الحديث', url: '/content-verifier' },
    ],
  },
  '/hajj-umrah': {
    title: 'دليل الحج والعمرة التفاعلي ومواقيت الإحرام',
    description: 'دليل خطوة بخطوة لمناسك العمرة والحج وفق الهدي النبوي؛ أركان، واجبات، سنن، مواقيت مكانية، وخريطة المشاعر المقدسة.',
    canonicalPath: '/hajj-umrah',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'دليل الحج والعمرة', url: '/hajj-umrah' },
    ],
  },
  '/companion': {
    title: 'رفيق المسلم اليومي ومتابعة الطاعات والسنن',
    description: 'لوحة تفاعلية لإدارة يوم المسلم؛ متابعة صلوات الفريضة والسنن الرواتب، ورد القرآن، أذكار الصباح والمساء، وحاسبة قيام الليل.',
    canonicalPath: '/companion',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'رفيق المسلم', url: '/companion' },
    ],
  },
  '/kids': {
    title: 'عالم الأطفال المسلم والتعليم التفاعلي للنشء',
    description: 'بيئة آمنة تفاعلية لتعليم الصغار أركان الإسلام والإيمان، قصص الأنبياء المبسطة، قصار السور، والآداب الإسلامية بأسلوب ممتع.',
    canonicalPath: '/kids',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'عالم الأطفال', url: '/kids' },
    ],
  },
  '/history-atlas': {
    title: 'أطلس التاريخ والحضارة الإسلامية التفاعلي',
    description: 'أطلس جغرافي وتاريخي يستعرض حواضر العالم الإسلامي، طرق الفتوحات، المعالم الحضارية، والأحداث التاريخية عبر العصور.',
    canonicalPath: '/history-atlas',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'أطلس التاريخ الإسلامي', url: '/history-atlas' },
    ],
  },
  '/janazah': {
    title: 'دليل الجنائز وأحكام التكفين وصلاة الجنازة والتعزية',
    description: 'دليل فقهي شامل يوضح أحكام غسل الميت، صفة التكفين الشرعي، كيفية صلاة الجنازة، أحكام الدفن، وسنن التعزية المأثورة.',
    canonicalPath: '/janazah',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'دليل الجنائز', url: '/janazah' },
    ],
  },
  '/audio-library': {
    title: 'المكتبة الصوتية الإسلامية والمحاضرات والخطب',
    description: 'تسجيلات صوتية إسلامية نقية، تشمل الدروس المنهجية، سلاسل التفسير، الخطب، والابتهالات المأثورة بأعلى جودة للبث والتحميل.',
    canonicalPath: '/audio-library',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'المكتبة الصوتية', url: '/audio-library' },
    ],
  },
  '/card-studio': {
    title: 'استوديو تصميم البطاقات الإسلامية المذهبة',
    description: 'صمم وحمّل بطاقات إسلامية مذهبة فاخرة للآيات، الأحاديث، والأدعية؛ متوافقة مع منشورات وسائل التواصل وقصص إنستغرام وواتساب.',
    canonicalPath: '/card-studio',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'استوديو البطاقات', url: '/card-studio' },
    ],
  },
  '/islamic-centers': {
    title: 'دليل المراكز والمجمعات الإسلامية وحلقات القرآن',
    description: 'دليل توثيقي لأبرز المراكز والمجمعات الإسلامية حول العالم، ودور تحفيظ القرآن الكريم والجمعيات الخيرية المعتمدة.',
    canonicalPath: '/islamic-centers',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'المراكز الإسلامية', url: '/islamic-centers' },
    ],
  },
  '/scholars': {
    title: 'موسوعة علماء الأمة الإسلامية والمؤلفات المعتمدة',
    description: 'تراجم أئمة المذاهب الفقهية، أعلام الحديث والتفسير، وكبار علماء المسلمين عبر القرون مع استعراض أهم مؤلفاتهم المرجعية.',
    canonicalPath: '/scholars',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'موسوعة العلماء', url: '/scholars' },
    ],
  },
  '/quran-coach': {
    title: 'مدرّب حفظ القرآن الكريم والمراجعة الذكية',
    description: 'منظومة تفاعلية لإتقان حفظ كتاب الله؛ تعتمد التكرار الممنهج، التسميع الذاتي، وجداول المراجعة الدورية المخصصة لكل قارئ.',
    canonicalPath: '/quran-coach',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'مدرب الحفظ', url: '/quran-coach' },
    ],
  },
  '/tajweed-lab': {
    title: 'معمل التجويد التفاعلي ومخارج الحروف وصفاتها',
    description: 'تعلّم أحكام التجويد النظري والتطبيقي؛ مخارج الحروف، الصفات، أحكام النون والميم الساكنتين، والمدود بأمثلة صوتية واضحة.',
    canonicalPath: '/tajweed-lab',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'معمل التجويد', url: '/tajweed-lab' },
    ],
  },
  '/quranic-arabic': {
    title: 'أكاديمية لغة القرآن والمفردات القرآنية',
    description: 'تعلّم لغة القرآن الكريم؛ قواعد النحو القرآني، دلالات الألفاظ، والأساليب البلاغية التي تعين على تدبر وفهم كتاب الله العزيز.',
    canonicalPath: '/quranic-arabic',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'أكاديمية لغة القرآن', url: '/quranic-arabic' },
    ],
  },
  '/sign-language': {
    title: 'مركز لغة الإشارة الإسلامي للصم وضعاف السمع',
    description: 'قاموس ودروس إسلامية بلغة الإشارة المعتمدة؛ ترجمة المصطلحات الشرعية، أركان العبادات، والأذكار لتمكين الصم وضعاف السمع.',
    canonicalPath: '/sign-language',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'لغة الإشارة الإسلامية', url: '/sign-language' },
    ],
  },
  '/encyclopedia': {
    title: 'بوابة الموسوعات والعلوم الشرعية الجامعة',
    description: 'الصرح المعرفي الشامل لمدار اليقين؛ يربط موسوعات القرآن، الحديث، السيرة، الفقه، والتاريخ في واجهة علمية متكاملة وسهلة البحث.',
    canonicalPath: '/encyclopedia',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'بوابة الموسوعة', url: '/encyclopedia' },
    ],
  },
  '/worship': {
    title: 'فقه العبادات الإسلامية وأحكام الطهارة والصلاة',
    description: 'أحكام العبادات اليومية؛ صفة الوضوء، الصلاة، أحكام الصيام، زكاة الفطر، وأحكام سجود السهو مدعومة بالأدلة الشرعية الثابتة.',
    canonicalPath: '/worship',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'فقه العبادات', url: '/worship' },
    ],
  },
  '/aqeedah': {
    title: 'موسوعة العقيدة الإسلامية وأصول الإيمان والتوحيد',
    description: 'بيان معتقد أهل السنة والجماعة النقي في أصول الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.',
    canonicalPath: '/aqeedah',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'أصول العقيدة', url: '/aqeedah' },
    ],
  },
  '/fatwas': {
    title: 'دليل الفتاوى الشرعية والقرارات الفقهية المعتمدة',
    description: 'فتاوى موثقة مأخوذة من الهيئات العلمية الرسمية؛ اللجنة الدائمة للبحوث العلمية والإفتاء ومجلس هيئة كبار العلماء.',
    canonicalPath: '/fatwas',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'الفتاوى الشرعية', url: '/fatwas' },
    ],
  },
  '/tasbih': {
    title: 'المسبحة الإلكترونية الذكية وورد التسبيح والاستغفار',
    description: 'مسبحة إلكترونية فاخرة تدعم حفظ العداد تلقائياً، إحصائيات الأوراد اليومية، واهتزاز تفاعلي عند إتمام كل دورة تسبيح.',
    canonicalPath: '/tasbih',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'المسبحة الإلكترونية', url: '/tasbih' },
    ],
  },
  '/sleep': {
    title: 'حاسبة النوم والاستيقاظ والقيام لصلاة الفجر',
    description: 'حساب دورات النوم الطبيعية (90 دقيقة) لمساعدة المسلم على الاستيقاظ بنشاط لصلاة الفجر وقيام الثلث الأخير من الليل.',
    canonicalPath: '/sleep',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'حاسبة النوم والقيام', url: '/sleep' },
    ],
  },
  '/charity': {
    title: 'حاسبة الزكاة الشرعية ونصاب الذهب والفضة',
    description: 'حساب زكاة المال، الذهب، الفضة، وعروض التجارة بنسبة 2.5% بدقة وسهولة وفق النصاب الشرعي والأسعار المعتمدة.',
    canonicalPath: '/charity',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'حاسبة الزكاة', url: '/charity' },
    ],
  },
  '/donations': {
    title: 'دليل منصات التبرع الخيرية الرسمية والموثوقة',
    description: 'دليل المنصات الإنسانية والخيرية الوطنية المعتمدة: إحسان، جود الإسكان، فرجت، شفاء، ومركز الملك سلمان للإغاثة والأعمال الإنسانية.',
    canonicalPath: '/donations',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'منصات التبرع الرسمية', url: '/donations' },
    ],
  },
  '/live': {
    title: 'البث المباشر للحرمين الشريفين والمسجد الأقصى',
    description: 'شاهد البث الحي المباشر عالي الدقة على مدار الساعة للمسجد الحرام بمكة المكرمة، والمسجد النبوي الشريف بالمدينة المنورة.',
    canonicalPath: '/live',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'البث المباشر', url: '/live' },
    ],
  },
  '/channels': {
    title: 'دليل القنوات الفضائية الإسلامية الرسمية المباشرة',
    description: 'متابعة مباشرة لقنوات القرآن الكريم، السنة النبوية، وقنوات الهداية الإسلامية المعتمدة ببث عالي الجودة ودون انقطاع.',
    canonicalPath: '/channels',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'القنوات الإسلامية', url: '/channels' },
    ],
  },
  '/radio': {
    title: 'إذاعات القرآن الكريم الإسلامية على مدار الساعة',
    description: 'بث إذاعي مستمر لإذاعة القرآن الكريم من الرياض، القاهرة، مكة، وإذاعات تلاوات كبار القراء بتسجيلات نقية ومتواصلة.',
    canonicalPath: '/radio',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'إذاعات القرآن', url: '/radio' },
    ],
  },
  '/updates': {
    title: 'سجل التحديثات والميزات الجديدة في مدار اليقين',
    description: 'سجل رسمي يوثق أحدث التحديثات، الميزات الجديدة، التحسينات البرمجية، والإصدارات التي أُطلقت في منصة مدار اليقين.',
    canonicalPath: '/updates',
    ogType: 'website',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'سجل التحديثات', url: '/updates' },
    ],
  },
  '/search': {
    title: 'محرك البحث الإسلامي الشامل في القرآن والسنة والعلوم',
    description: 'ابحث فورياً في آيات القرآن الكريم، الأحاديث النبوية، الأدعية، الأذكار، والفتاوى الموثقة عبر منصة مدار اليقين.',
    canonicalPath: '/search',
    ogType: 'website',
    noindex: true, // Search results shouldn't create infinite duplicate index entries
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'البحث الشامل', url: '/search' },
    ],
  },
  '/settings': {
    title: 'إعدادات المنصة وتخصيص تجربة القراءة والخطوط',
    description: 'تخصيص خطوط المصحف، مظهر الموقع الليلي، أصوات التنبيهات، وطريقة حساب مواقيت الصلاة والمدينة المحددة.',
    canonicalPath: '/settings',
    ogType: 'website',
    noindex: true, // Personal preferences page
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'الإعدادات', url: '/settings' },
    ],
  },
};

/**
 * Dynamic SEO Generator for Holy Quran Surahs
 */
export function getQuranSurahSeo(surahNumber: number, ayahNumber?: number): RouteSeoConfig {
  const surah = SURAHS_META.find((s) => s.number === surahNumber) || SURAHS_META[0];
  const typeLabel = surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية';

  if (ayahNumber && ayahNumber > 0) {
    return {
      title: `سورة ${surah.name} الآية ${ayahNumber} | القرآن الكريم بالرسم العثماني`,
      description: `قراءة واستماع للآية رقم ${ayahNumber} من سورة ${surah.name} (${typeLabel}، آياتها ${surah.numberOfAyahs}) بالرسم العثماني المعتمد وتفسيرها الميسر.`,
      canonicalPath: `/quran?surah=${surah.number}&ayah=${ayahNumber}`,
      ogType: 'article',
      breadcrumbs: [
        { name: 'الرئيسية', url: '/' },
        { name: 'المصحف الشريف', url: '/quran' },
        { name: `سورة ${surah.name}`, url: `/quran?surah=${surah.number}` },
        { name: `الآية ${ayahNumber}`, url: `/quran?surah=${surah.number}&ayah=${ayahNumber}` },
      ],
    };
  }

  return {
    title: `سورة ${surah.name} مكتوبة كاملة بالرسم العثماني (${surah.englishName})`,
    description: `قراءة سورة ${surah.name} كاملة (${typeLabel}، ${surah.numberOfAyahs} آية، الجزء ${surah.juz}) برواية حفص عن عاصم، مع التلاوة المرتلة والتفسير الميسر.`,
    canonicalPath: `/quran?surah=${surah.number}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'المصحف الشريف', url: '/quran' },
      { name: `سورة ${surah.name}`, url: `/quran?surah=${surah.number}` },
    ],
  };
}

/**
 * Dynamic SEO Generator for Quran Tafsir
 */
export function getTafsirSurahSeo(surahNumber: number): RouteSeoConfig {
  const surah = SURAHS_META.find((s) => s.number === surahNumber) || SURAHS_META[0];
  return {
    title: `تفسير سورة ${surah.name} كاملاً | التفسير الميسر المعتمد`,
    description: `بيان معاني آيات سورة ${surah.name} وهداياتها من التفسير الميسر المعتمد بمجمع الملك فهد لطباعة المصحف الشريف؛ شرح ميسر لجميع آيات السورة (${surah.numberOfAyahs} آية).`,
    canonicalPath: `/tafsir?surah=${surah.number}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'تفسير القرآن', url: '/tafsir' },
      { name: `تفسير سورة ${surah.name}`, url: `/tafsir?surah=${surah.number}` },
    ],
  };
}

/**
 * Dynamic SEO Generator for Prophet Profiles
 */
export function getProphetSeo(prophetId: string): RouteSeoConfig {
  const prophet = PROPHETS_DATA.find((p) => p.id === prophetId);
  if (!prophet) return ROUTE_SEO_MAP['/prophets'];

  return {
    title: `قصة ${prophet.name} عليه السلام وسيرته في القرآن الكريم`,
    description: `${prophet.summary || `سيرة نبي الله ${prophet.name} عليه السلام؛ دعوته لقومه، معجزاته المؤيدة بالحق، ومواضع ذكره في القرآن الكريم والعبر المستخلصة.`}`,
    canonicalPath: `/prophets/${prophet.id}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'قصص الأنبياء', url: '/prophets' },
      { name: prophet.name, url: `/prophets/${prophet.id}` },
    ],
  };
}

/**
 * Dynamic SEO Generator for Companion Profiles
 */
export function getCompanionSeo(companionId: string): RouteSeoConfig {
  const companion = COMPANIONS_DATA.find((c) => c.id === companionId);
  if (!companion) return ROUTE_SEO_MAP['/companions'];

  return {
    title: `سيرة ${companion.name} ${companion.honorific} | مناقبه وفضائله`,
    description: `${companion.bioSummary || `ترجمة وسيرة الصحابي الجليل ${companion.name} ${companion.honorific}؛ إسلامه، جهاده، ومناقبه المأثورة في كتب السنة النبوية المطهرة.`}`,
    canonicalPath: `/companions/${companion.id}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'موسوعة الصحابة', url: '/companions' },
      { name: companion.name, url: `/companions/${companion.id}` },
    ],
  };
}

/**
 * Dynamic SEO Generator for Academy Tracks
 */
export function getAcademyTrackSeo(trackId: string): RouteSeoConfig {
  const track = ACADEMY_TRACKS.find((t) => t.id === trackId);
  if (!track) return ROUTE_SEO_MAP['/academy'];

  return {
    title: `مسار ${track.title} | أكاديمية مدار اليقين الشرعية`,
    description: `${track.description} - المستوى: ${track.level}، الدروس: ${track.totalLessons}، مع اختبارات قياس الفهم وشهادة إتمام إلكترونية.`,
    canonicalPath: `/academy/${track.id}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'الأكاديمية الإسلامية', url: '/academy' },
      { name: track.title, url: `/academy/${track.id}` },
    ],
    schemaType: 'LearningResource',
  };
}

/**
 * Dynamic SEO Generator for Website Updates
 */
export function getUpdateSeo(updateId: string): RouteSeoConfig {
  const update = SEED_UPDATES.find((u) => u.id === updateId);
  if (!update) return ROUTE_SEO_MAP['/updates'];

  return {
    title: `${update.title} | تحديثات مدار اليقين (${update.version})`,
    description: update.shortDescription || update.fullDescription.substring(0, 150),
    canonicalPath: `/updates/${update.id}`,
    ogType: 'article',
    breadcrumbs: [
      { name: 'الرئيسية', url: '/' },
      { name: 'سجل التحديثات', url: '/updates' },
      { name: update.title, url: `/updates/${update.id}` },
    ],
  };
}

/* -------------------------------------------------------------
 * JSON-LD Schema.org Structured Data Builders
 * ------------------------------------------------------------- */

/**
 * Schema: WebSite with Sitelinks Search Box
 */
export function buildWebSiteSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.nameEn,
    url: BASE_PRODUCTION_URL,
    description: SITE_CONFIG.description,
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_PRODUCTION_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Schema: Organization
 */
export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.officialOrganization || SITE_CONFIG.name,
    url: BASE_PRODUCTION_URL,
    logo: `${BASE_PRODUCTION_URL}/images/madar-al-yaqeen-logo.png`,
    sameAs: [
      BASE_PRODUCTION_URL,
    ],
    description: SITE_CONFIG.description,
    knowsLanguage: ['ar', 'en'],
  };
}

/**
 * Schema: BreadcrumbList
 */
export function buildBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => {
      const name = crumb.name || crumb.label || '';
      const url = crumb.url || crumb.path || '';
      const fullUrl = url.startsWith('http') ? url : `${BASE_PRODUCTION_URL}${url}`;
      return {
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: fullUrl,
      };
    }),
  };
}

/**
 * Schema: Article
 */
export function buildArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url.startsWith('http') ? article.url : `${BASE_PRODUCTION_URL}${article.url}`,
    image: article.image || DEFAULT_OG_IMAGE,
    datePublished: article.datePublished || '2026-01-01',
    dateModified: article.dateModified || new Date().toISOString().split('T')[0],
    inLanguage: 'ar',
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_PRODUCTION_URL}/images/madar-al-yaqeen-logo.png`,
      },
    },
  };
}

/**
 * Schema: LearningResource / Course
 */
export function buildLearningResourceSchema(resource: {
  name: string;
  description: string;
  url: string;
  educationalLevel?: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: resource.name,
    description: resource.description,
    url: resource.url.startsWith('http') ? resource.url : `${BASE_PRODUCTION_URL}${resource.url}`,
    educationalLevel: resource.educationalLevel || 'Beginner',
    inLanguage: 'ar',
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: BASE_PRODUCTION_URL,
    },
  };
}

/**
 * Schema: CollectionPage
 */
export function buildCollectionSchema(collection: {
  name: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collection.url.startsWith('http') ? collection.url : `${BASE_PRODUCTION_URL}${collection.url}`,
    inLanguage: 'ar',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      url: BASE_PRODUCTION_URL,
    },
  };
}
