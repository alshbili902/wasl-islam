/**
 * Types for Madar Al-Yaqeen Website Updates and What's New System
 * نظام تحديثات الموقع وإشعارات ما الجديد
 */

export type UpdateCategory =
  | 'new_feature'      // ميزة جديدة
  | 'improvement'      // تحسين وتطوير
  | 'bug_fix'          // إصلاح ومعالجة أخطاء
  | 'performance'      // أداء وسرعة
  | 'announcement';    // إعلان هام ورسمي

export type UpdateStatus =
  | 'draft'            // مسودة غير منشورة
  | 'published'        // منشورة وظاهرة للزوار
  | 'archived';        // مؤرشفة تاريخياً

export type UpdateImportance =
  | 'normal'           // اعتيادي
  | 'important'        // مهم
  | 'critical';        // حرج (يتطلب إقراراً)

export type TargetAudience =
  | 'all'              // كافة الزوار
  | 'new_visitors'     // الزوار الجدد فقط
  | 'returning_visitors'; // الزوار العائدون

export interface PopupVisibilityConfig {
  /**
   * هل تظهر هذه التحديثة في نافذة "ما الجديد" المنبثقة؟
   */
  showPopup: boolean;
  /**
   * للإعلانات الحرجة فقط: إظهار التنبيه حتى يؤكد الزائر اطلاعه عليه
   */
  forceUntilAcknowledged?: boolean;
  /**
   * تاريخ انتهاء صلاحية إظهار النافذة المنبثقة (ISO string)
   */
  expiresAt?: string;
}

export interface WebsiteUpdate {
  id: string;
  title: string;
  titleEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  version: string; // e.g. "2.5.0"
  releaseDate: string; // ISO date string e.g. "2026-11-05"
  category: UpdateCategory;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  actionUrl?: string; // e.g. "/adhkar", "/duas", "/quran-coach"
  actionLabel?: string;
  actionLabelEn?: string;
  status: UpdateStatus;
  importance: UpdateImportance;
  popupVisibility: PopupVisibilityConfig;
  targetAudience: TargetAudience;
  highlights: string[];
  highlightsEn?: string[];
  releaseId?: string; // groups update into a specific release
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteRelease {
  id: string;
  version: string; // e.g. "v2.5.0"
  name: string;
  nameEn: string;
  releaseDate: string;
  isLatest: boolean;
  summary: string;
  summaryEn: string;
  updateIds: string[];
  badge?: string;
}

export interface VisitorUpdateState {
  readUpdateIds: string[];
  dismissedUpdateIds: string[];
  acknowledgedCriticalIds: string[];
  lastPopupShownAt: number | null;
  firstVisitAt: number;
  visitCount: number;
}
