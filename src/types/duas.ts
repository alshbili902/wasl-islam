// Types for Comprehensive Islamic Dua Encyclopedia (موسوعة الأدعية) - Madar Al-Yaqeen

export type DuaSourceType = 'quranic' | 'prophetic' | 'general';

export type DuaSituationId =
  | 'daily_life'      // أدعية اليوم والليلة
  | 'worship'         // أدعية الصلاة والعبادات
  | 'distress'        // أدعية تفريج الكرب والهم والضيق
  | 'health'          // أدعية الشفاء والرقية الشرعية
  | 'family'          // أدعية الوالدين والأهل والذرية
  | 'nature'          // أدعية الظواهر الكونية والمطر والرياح
  | 'travel'          // أدعية السفر والتنقل
  | 'seasons';        // أدعية المواسم والأوقات الفاضلة (رمضان، عرفة، الجمعة)

export type DuaAuthenticityGrade =
  | 'quranic'               // نص قرآني كريم ثابت قطعي الثبوت
  | 'muttafaq_alayh'        // متفق عليه (رواه البخاري ومسلم)
  | 'sahih_bukhari'         // صحيح البخاري
  | 'sahih_muslim'          // صحيح مسلم
  | 'sahih'                 // صحيح (صححه الألباني أو الأرناؤوط أو كبار المحدثين)
  | 'hasan'                 // حسن (حسنه المحققون)
  | 'permissible_general';  // دعاء جامع مباح شرعاً لا ينسب للنبي ﷺ

export interface DuaHadithSource {
  bookName: string;         // مثل: صحيح البخاري، سنن أبي داود، سنن الترمذي
  numberOrRef?: string;     // مثل: حديث رقم 6306
  narrator?: string;        // مثل: أبو هريرة رضي الله عنه
  scholarGrading?: string;  // مثل: صححه الألباني في صحيح أبي داود
}

export interface DuaQuranReference {
  surahName: string;        // اسم السورة: مثل سورة البقرة
  surahNumber: number;      // رقم السورة
  ayahNumber: number;       // رقم الآية
  fullVerseSnippet?: string;// الآية الكريمة كاملة لسياق الدعاء
}

export interface DuaItem {
  id: string;
  title: string;                         // عنوان الدعاء
  arabicText: string;                    // النص العربي المضبوط بالشكل التام
  sourceType: DuaSourceType;             // قرآني / نبوي / عام
  situationId: DuaSituationId;           // تصنيف الحالة
  situationLabelAr: string;              // مسمى الحالة بالعربية
  subSituationAr: string;                // الحالة الفرعية الدقيقة (عند الاستيقاظ، في السجود...)
  transliteration?: string;              // النطق الصوتي بالحروف اللاتينية
  translations?: {
    en?: string;                         // English
    ur?: string;                         // Urdu
    fr?: string;                         // French
    id?: string;                         // Indonesian
    tr?: string;                         // Turkish
    bn?: string;                         // Bengali
  };
  explanationAr: string;                 // شرح المعنى اللغوي والشرعي وتفسير الآية/الحديث
  occasionContextAr?: string;            // المناسبة أو سبب ورود الدعاء
  authenticityGrade: DuaAuthenticityGrade;
  authenticityGradeLabelAr: string;
  hadithSource?: DuaHadithSource;
  quranReference?: DuaQuranReference;
  prescribedCount?: number;              // عدد المرات المسنونة (1، 3، 7، 33، 100...) أو غير مقيد
  countContextNoteAr?: string;           // بيان أصل العدد إن كان مسنوناً أو متروكاً للاختيار الشخصي
  audioUrl?: string;                     // رابط ملف الصوت الموثق إن وجد
  audioReciter?: string;                 // اسم القارئ
  tags: string[];                        // وسوم البحث والربط
  verificationStatus: 'verified_official' | 'canonical_source';
  lastVerifiedDate: string;
  externalSourceUrl?: string;            // رابط المصدر الشرعي (مجمع الملك فهد، الدرر السنية)
}

export interface DuaCategoryMeta {
  id: DuaSituationId;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  iconName: string;
  badge: string;
  colorGradient: string;
}

export interface DuaCustomCollection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  duaIds: string[];
  createdAt: string;
}

export interface DuaUserNote {
  duaId: string;
  note: string;
  updatedAt: string;
}

export interface DuaFilterOptions {
  sourceType?: DuaSourceType | 'all';
  situationId?: DuaSituationId | 'all';
  authenticityGrade?: string | 'all';
  hasPrescribedCount?: boolean;
  hasAudio?: boolean;
}

