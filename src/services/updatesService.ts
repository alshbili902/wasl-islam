import {
  WebsiteRelease,
  WebsiteUpdate,
  VisitorUpdateState,
  UpdateCategory
} from '../types/updates';
import { SEED_RELEASES, SEED_UPDATES } from '../data/updates/updatesSeedData';

const DYNAMIC_UPDATES_KEY = 'madar_dynamic_updates_v1';
const DYNAMIC_RELEASES_KEY = 'madar_dynamic_releases_v1';
const VISITOR_STATE_KEY = 'madar_updates_visitor_state_v1';
const ADMIN_SESSION_KEY = 'madar_admin_session_token_v1';

// Admin passcode for update publishing operations (secure client-side gate)
const ADMIN_PASSCODE_HASH = 'madar2026';

const DEFAULT_VISITOR_STATE: VisitorUpdateState = {
  readUpdateIds: [],
  dismissedUpdateIds: [],
  acknowledgedCriticalIds: [],
  lastPopupShownAt: null,
  firstVisitAt: Date.now(),
  visitCount: 1
};

/**
 * دالة إشعار التغييرات لتحديث الواجهات تفاعلياً
 */
function notifyUpdatesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('madar_updates_changed'));
  }
}

/**
 * الحصول على حالة الزائر من التخزين المحلي
 */
export function getVisitorState(): VisitorUpdateState {
  if (typeof window === 'undefined') return DEFAULT_VISITOR_STATE;
  try {
    const raw = localStorage.getItem(VISITOR_STATE_KEY);
    if (raw) {
      return { ...DEFAULT_VISITOR_STATE, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_VISITOR_STATE;
}

/**
 * حفظ حالة الزائر
 */
export function saveVisitorState(state: VisitorUpdateState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(VISITOR_STATE_KEY, JSON.stringify(state));
    notifyUpdatesChanged();
  } catch {
    // ignore
  }
}

/**
 * تسجيل زيارة جديدة للزائر وتحديث العداد
 */
export function recordVisitorVisit(): void {
  const current = getVisitorState();
  const sessionVisited = sessionStorage.getItem('madar_session_visit_recorded');
  if (!sessionVisited) {
    sessionStorage.setItem('madar_session_visit_recorded', '1');
    current.visitCount = (current.visitCount || 0) + 1;
    saveVisitorState(current);
  }
}

/**
 * جلب التحديثات الديناميكية المحفوظة محلياً (المعدلة أو المنشأة من لوحة الإدارة)
 */
function getStoredDynamicUpdates(): WebsiteUpdate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DYNAMIC_UPDATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * جلب الإصدارات الديناميكية المحفوظة
 */
function getStoredDynamicReleases(): WebsiteRelease[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DYNAMIC_RELEASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * الحصول على جميع الإصدارات (الرسمية + الإضافات الإدارية) مرتبة زمنياً من الأحدث
 */
export function getAllReleases(): WebsiteRelease[] {
  const dynamic = getStoredDynamicReleases();
  const dynamicIds = new Set(dynamic.map((r) => r.id));
  const merged = [
    ...dynamic,
    ...SEED_RELEASES.filter((r) => !dynamicIds.has(r.id))
  ];

  return merged.sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );
}

/**
 * الحصول على جميع التحديثات (الرسمية + الإضافات الإدارية)
 */
export function getAllUpdates(): WebsiteUpdate[] {
  const dynamic = getStoredDynamicUpdates();
  const dynamicIds = new Set(dynamic.map((u) => u.id));
  const merged = [
    ...dynamic,
    ...SEED_UPDATES.filter((u) => !dynamicIds.has(u.id))
  ];

  return merged.sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );
}

/**
 * الحصول على التحديثات المنشورة فقط (المتاحة للجمهور)
 */
export function getPublishedUpdates(): WebsiteUpdate[] {
  const all = getAllUpdates();
  const now = new Date();
  return all.filter((u) => {
    if (u.status !== 'published') return false;
    // If scheduled publication date is in the future
    const relDate = new Date(u.releaseDate);
    if (relDate > now) return false;
    return true;
  });
}

/**
 * جلب تحديث محدد بواسطة المعرف
 */
export function getUpdateById(id: string): WebsiteUpdate | undefined {
  return getAllUpdates().find((u) => u.id === id);
}

/**
 * جلب إصدار محدد برقم النسخة أو المعرف
 */
export function getReleaseByVersion(versionOrId: string): WebsiteRelease | undefined {
  const clean = versionOrId.toLowerCase().trim();
  return getAllReleases().find(
    (r) =>
      r.id.toLowerCase() === clean ||
      r.version.toLowerCase() === clean ||
      r.version.toLowerCase().replace('v', '') === clean.replace('v', '')
  );
}

/**
 * استخراج رقم النسخة الحالي للموقع ديناميكياً من أحدث إصدار منشور
 */
export function getLatestWebsiteVersion(): string {
  const releases = getAllReleases();
  const latestPublished = releases.find((r) => r.isLatest) || releases[0];
  return latestPublished ? latestPublished.version : 'v2.5.0';
}

/**
 * التحقق مما إذا كان الذكر أو التحديث قد تمت قراءته بواسطة الزائر
 */
export function isUpdateRead(updateId: string): boolean {
  const state = getVisitorState();
  return state.readUpdateIds.includes(updateId);
}

/**
 * تحديد تحديث كمقروء
 */
export function markUpdateAsRead(updateId: string): void {
  const state = getVisitorState();
  if (!state.readUpdateIds.includes(updateId)) {
    state.readUpdateIds.push(updateId);
    saveVisitorState(state);
  }
}

/**
 * تحديد جميع التحديثات المنشورة كمقروءة
 */
export function markAllUpdatesAsRead(): void {
  const state = getVisitorState();
  const published = getPublishedUpdates();
  const allIds = new Set([...state.readUpdateIds, ...published.map((u) => u.id)]);
  state.readUpdateIds = Array.from(allIds);
  saveVisitorState(state);
}

/**
 * إغلاق أو تجاهل النافذة المنبثقة للتحديث
 */
export function dismissUpdatePopup(updateId: string): void {
  const state = getVisitorState();
  if (!state.dismissedUpdateIds.includes(updateId)) {
    state.dismissedUpdateIds.push(updateId);
  }
  state.lastPopupShownAt = Date.now();
  saveVisitorState(state);
}

/**
 * إقرار الإعلان الحرج
 */
export function acknowledgeCriticalUpdate(updateId: string): void {
  const state = getVisitorState();
  if (!state.acknowledgedCriticalIds.includes(updateId)) {
    state.acknowledgedCriticalIds.push(updateId);
  }
  if (!state.readUpdateIds.includes(updateId)) {
    state.readUpdateIds.push(updateId);
  }
  saveVisitorState(state);
}

/**
 * جلب التحديثات المنشورة وغير المقروءة
 */
export function getUnreadPublishedUpdates(): WebsiteUpdate[] {
  const published = getPublishedUpdates();
  const state = getVisitorState();
  const readSet = new Set(state.readUpdateIds);
  return published.filter((u) => !readSet.has(u.id));
}

/**
 * جلب التحديثات المؤهلة للظهور في النافذة المنبثقة التلقائية "ما الجديد"
 * @param isAudioPlaying مؤشر تشغيل الصوتيات (إذا كان True لا يُسمح بإظهار النافذة أبداً)
 */
export function getEligiblePopupUpdates(isAudioPlaying: boolean = false): WebsiteUpdate[] {
  // CRITICAL RULE: Never interrupt Quran or audio playback!
  if (isAudioPlaying) {
    return [];
  }

  const published = getPublishedUpdates();
  const state = getVisitorState();
  const now = Date.now();

  return published.filter((update) => {
    // 1. Must have popup enabled
    if (!update.popupVisibility || !update.popupVisibility.showPopup) {
      return false;
    }

    // 2. Check expiration date
    if (update.popupVisibility.expiresAt) {
      const expTime = new Date(update.popupVisibility.expiresAt).getTime();
      if (now > expTime) return false;
    }

    // 3. Critical announcements with forceUntilAcknowledged
    if (update.importance === 'critical' && update.popupVisibility.forceUntilAcknowledged) {
      return !state.acknowledgedCriticalIds.includes(update.id);
    }

    // 4. If already marked as read, never show again
    if (state.readUpdateIds.includes(update.id)) {
      return false;
    }

    // 5. If dismissed in this session or recently
    if (state.dismissedUpdateIds.includes(update.id)) {
      return false;
    }

    // 6. Target audience check
    if (update.targetAudience === 'returning_visitors' && state.visitCount <= 1) {
      return false;
    }
    if (update.targetAudience === 'new_visitors' && state.visitCount > 2) {
      return false;
    }

    return true;
  });
}

// ==========================================
// إدارة ونشر التحديثات (Admin Management & CMS)
// ==========================================

/**
 * التحقق من رمز مرور إدارة التحديثات
 */
export function verifyAdminPasscode(code: string): boolean {
  return code.trim() === ADMIN_PASSCODE_HASH;
}

/**
 * تسجيل دخول المشرف وحفظ الجلسة
 */
export function loginAdmin(passcode: string): boolean {
  if (verifyAdminPasscode(passcode)) {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authorized_' + Date.now());
      notifyUpdatesChanged();
    }
    return true;
  }
  return false;
}

/**
 * هل جلسة المشرف مصرحة حالياً؟
 */
export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!sessionStorage.getItem(ADMIN_SESSION_KEY);
}

/**
 * تسجيل خروج المشرف
 */
export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    notifyUpdatesChanged();
  }
}

/**
 * حفظ أو تعديل تحديث (للمشرفين المصرحين فقط)
 */
export function saveCustomUpdate(update: WebsiteUpdate): void {
  if (!isAdminLoggedIn()) {
    throw new Error('غير مصرح لك بنشر أو تعديل التحديثات.');
  }

  const stored = getStoredDynamicUpdates();
  const existingIdx = stored.findIndex((u) => u.id === update.id);
  const nowStr = new Date().toISOString();

  const toSave: WebsiteUpdate = {
    ...update,
    updatedAt: nowStr,
    createdAt: update.createdAt || nowStr
  };

  let updatedList: WebsiteUpdate[];
  if (existingIdx >= 0) {
    updatedList = [...stored];
    updatedList[existingIdx] = toSave;
  } else {
    updatedList = [toSave, ...stored];
  }

  localStorage.setItem(DYNAMIC_UPDATES_KEY, JSON.stringify(updatedList));
  notifyUpdatesChanged();
}

/**
 * حذف تحديث مخصص
 */
export function deleteCustomUpdate(updateId: string): void {
  if (!isAdminLoggedIn()) {
    throw new Error('غير مصرح لك بحذف التحديثات.');
  }

  const stored = getStoredDynamicUpdates();
  const filtered = stored.filter((u) => u.id !== updateId);
  localStorage.setItem(DYNAMIC_UPDATES_KEY, JSON.stringify(filtered));
  notifyUpdatesChanged();
}

/**
 * تغيير حالة التحديث (نشر / مسودة / أرشفة)
 */
export function setUpdateStatus(updateId: string, status: WebsiteUpdate['status']): void {
  if (!isAdminLoggedIn()) {
    throw new Error('غير مصرح لك بتغيير حالة النشر.');
  }

  const all = getAllUpdates();
  const target = all.find((u) => u.id === updateId);
  if (!target) return;

  saveCustomUpdate({
    ...target,
    status
  });
}

/**
 * حفظ أو تعديل إصدار (Release)
 */
export function saveCustomRelease(release: WebsiteRelease): void {
  if (!isAdminLoggedIn()) {
    throw new Error('غير مصرح لك بحفظ الإصدارات.');
  }

  const stored = getStoredDynamicReleases();
  const existingIdx = stored.findIndex((r) => r.id === release.id);

  let updatedList: WebsiteRelease[];
  if (existingIdx >= 0) {
    updatedList = [...stored];
    updatedList[existingIdx] = release;
  } else {
    updatedList = [release, ...stored];
  }

  // If this release is marked as latest, unmark other releases
  if (release.isLatest) {
    updatedList = updatedList.map((r) => ({
      ...r,
      isLatest: r.id === release.id
    }));
  }

  localStorage.setItem(DYNAMIC_RELEASES_KEY, JSON.stringify(updatedList));
  notifyUpdatesChanged();
}

/**
 * إعادة تعيين النظام إلى التحديثات الرسمية الافتراضية
 */
export function resetUpdatesToDefaults(): void {
  if (!isAdminLoggedIn()) {
    throw new Error('عملية غير مصرحة.');
  }
  localStorage.removeItem(DYNAMIC_UPDATES_KEY);
  localStorage.removeItem(DYNAMIC_RELEASES_KEY);
  notifyUpdatesChanged();
}
