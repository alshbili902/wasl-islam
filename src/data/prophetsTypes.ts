// =====================================================================
// موسوعة قصص الأنبياء عليهم الصلاة والسلام – مدار اليقين / وصل الإسلامية
// موثقة بالكامل من المصادر الشرعية المعتمدة (القرآن الكريم، التفسير الميسر،
// صحيح البخاري، صحيح مسلم، ومصادر مجمع الملك فهد لطباعة المصحف الشريف)
// =====================================================================

export type ProphetCategoryId =
  | 'all'
  | 'ulu_al_azm'   // أولو العزم من الرسل
  | 'patience'     // الصبر والابتلاء
  | 'trust'        // التوكل واليقين
  | 'wisdom'       // الحكمة والحكم
  | 'calling'      // الدعوة والبلاغ
  | 'family';      // البر والأسرة والدعاء

export interface ProphetAyah {
  text: string;
  surahName: string;
  ayahNumber: string | number;
  tafsir: string;
  quranLink?: string;
}

export interface ProphetHadith {
  text: string;
  narrator: string;
  source: string;
  hadithNumber?: string;
  grade: 'صحيح' | 'متفق عليه' | 'حسن';
  explanation?: string;
}

export interface ProphetChapter {
  id: string;
  title: string;
  order: number;
  content: string;
  ayahs?: ProphetAyah[];
  hadiths?: ProphetHadith[];
}

export interface ProphetLesson {
  id: string;
  title: string;
  description: string;
}

export interface ProphetReference {
  name: string;
  book: string;
  authorOrOrg: string;
  details?: string;
  url?: string;
}

export interface ProphetQuranicStation {
  surah: string;
  verses: string;
}

export interface Prophet {
  id: string;
  order: number;
  name: string;
  shortName: string;
  title: string;
  isUluAlAzm: boolean;
  quranMentionsCount: number;
  summary: string;
  lineageAndBackground: string;
  missionAndCall: string;
  categories: ProphetCategoryId[];
  categoryLabels: string[];
  estimatedReadingTimeMinutes: number;
  quranicStations: ProphetQuranicStation[];
  keyThemes: string[];
  chapters: ProphetChapter[];
  lessons: ProphetLesson[];
  references: ProphetReference[];
  specialScholarlyNote?: string;
}

export const PROPHET_CATEGORIES: { id: ProphetCategoryId; label: string; icon: string; count?: number }[] = [
  { id: 'all', label: 'جميع الأنبياء (25)', icon: 'Sparkles' },
  { id: 'ulu_al_azm', label: 'أولو العزم من الرسل (5)', icon: 'Crown' },
  { id: 'patience', label: 'الصبر والابتلاء', icon: 'ShieldCheck' },
  { id: 'trust', label: 'التوكل واليقين', icon: 'Flame' },
  { id: 'wisdom', label: 'الحكمة والحُكم', icon: 'Scale' },
  { id: 'calling', label: 'الدعوة والبلاغ', icon: 'BookOpen' },
  { id: 'family', label: 'البر والأسرة', icon: 'Heart' },
];

export const OFFICIAL_SCHOLARLY_RESOURCES = [
  {
    name: 'مجمع الملك فهد لطباعة المصحف الشريف',
    url: 'https://qurancomplex.gov.sa/',
    description: 'المرجع الرسمي الأول لطباعة ونشر المصحف الشريف وبيانات التفسير الميسر.',
  },
  {
    name: 'خدمة التفسير الميسر المعتمدة',
    url: 'https://qurancomplex.gov.sa/quran-dev/',
    description: 'تفسير الآيات وسياقاتها وفق معايير النخبة من علماء التفسير بالمجمع.',
  },
  {
    name: 'الرئاسة العامة للبحوث العلمية والإفتاء',
    url: 'https://alifta.gov.sa/',
    description: 'الفتاوى والبحوث الشرعية وهيئة كبار العلماء بالمملكة العربية السعودية.',
  },
  {
    name: 'خدمة السنة النبوية المطهرة',
    url: 'https://sunna.alifta.gov.sa/',
    description: 'تخريج وتحقيق الأحاديث النبوية المعتمدة برئاسة الإفتاء.',
  },
  {
    name: 'مشروع المصحف الإلكتروني بجامعة الملك سعود',
    url: 'https://quran.ksu.edu.sa/',
    description: 'الربط المباشر بآيات المصحف الشريف والتفاسير المعتمدة المتعددة.',
  },
];

