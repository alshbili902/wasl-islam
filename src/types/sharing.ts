/**
 * Types for Madar Al-Yaqeen Unified Sharing, Image Export & Social Publishing System
 * نظام المشاركة الموحد وتصدير البطاقات والنشر الاجتماعي
 */

export type ShareableContentType =
  | 'quran'       // آية أو مقطع قرآني
  | 'hadith'      // حديث نبوي شريف
  | 'dhikr'       // ذكر نبوي أو تسبيح راتب
  | 'dua'         // دعاء مأثور أو قرآني
  | 'fiqh'        // مسألة أو فتوى فقهية معاصرة
  | 'verifier'    // تحقيق صحة حديث أو تفنيد شبهة
  | 'article'     // مقال أو هداية إسلامية
  | 'update'      // تحديث أو ميزة جديدة في المنصة
  | 'general';    // حكمة أو اقتباس عام

export interface ShareableContent {
  type: ShareableContentType;
  title: string;
  text: string;
  translationEn?: string;
  source?: string;
  sourceBook?: string;
  sourceNumber?: string;
  grade?: string;
  narrator?: string;
  repetitionCount?: number;
  surahName?: string;
  surahNumber?: number;
  ayahNumber?: number;
  referenceText?: string;
  categoryLabel?: string;
  virtue?: string;
  explanation?: string;
  canonicalUrl?: string;
  id?: string;
  author?: string;
}

export type ImageTemplateId =
  | 'royal_green'        // الأخضر الزمردي والذهب الملكي
  | 'elegant_ivory'       // العاجي الأندلسي الفاخر
  | 'minimal_white'       // الأبيض النقي العصري
  | 'premium_dark'        // الأسود الكحلي والذهب
  | 'quran_inspired'      // المصحف الشريف المذهب
  | 'islamic_geometric'   // الزخرفة الهندسية الإسلامية
  | 'modern_elegant';     // العصري الهادئ

export type ImageDimensionId =
  | 'story'               // Instagram / WhatsApp Story (1080 x 1920)
  | 'square'              // Square Post (1080 x 1080)
  | 'portrait'            // Portrait Post (1080 x 1350)
  | 'auto';               // أبعاد متكيفة تلقائياً مع طول النص

export interface ImageTemplateConfig {
  id: ImageTemplateId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textColor: string;
  accentGold: string;
  secondaryText: string;
  borderColor: string;
  innerBorderColor: string;
  headerStampColor: string;
  patternType: 'islamic_arch' | 'arabesque' | 'geometric_stars' | 'minimal_lines' | 'illuminated_mushaf';
  isDark: boolean;
}

export interface ImageExportConfig {
  templateId: ImageTemplateId;
  dimension: ImageDimensionId;
  fontSizeDelta: number; // -8 to +16 (default 0)
  showLogo: boolean;
  showMetadata: boolean;
  showQr: boolean;
}

export interface SocialShareLink {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  getUrl: (text: string, url: string, title: string) => string;
}
