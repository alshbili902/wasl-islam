import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  Sparkles,
  Save,
  RotateCcw,
  AlertTriangle,
  Upload,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { WebsiteUpdate, UpdateCategory, UpdateStatus, UpdateImportance, TargetAudience } from '../../types/updates';
import {
  getAllUpdates,
  saveCustomUpdate,
  deleteCustomUpdate,
  isAdminLoggedIn,
  loginAdmin,
  logoutAdmin,
  resetUpdatesToDefaults
} from '../../services/updatesService';
import { WhatsNewModal } from './WhatsNewModal';

interface UpdatesAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateChanged?: () => void;
}

const EMPTY_UPDATE: WebsiteUpdate = {
  id: '',
  title: '',
  titleEn: '',
  shortDescription: '',
  shortDescriptionEn: '',
  fullDescription: '',
  fullDescriptionEn: '',
  version: '2.5.1',
  releaseDate: new Date().toISOString().split('T')[0],
  category: 'new_feature',
  mediaUrl: '',
  mediaType: 'image',
  actionUrl: '',
  actionLabel: 'استكشف الميزة الآن',
  actionLabelEn: 'Explore Feature',
  status: 'published',
  importance: 'normal',
  popupVisibility: {
    showPopup: true,
    forceUntilAcknowledged: false,
    expiresAt: ''
  },
  targetAudience: 'all',
  highlights: [''],
  highlightsEn: ['']
};

export const UpdatesAdminModal: React.FC<UpdatesAdminModalProps> = ({
  isOpen,
  onClose,
  onUpdateChanged
}) => {
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [editingUpdate, setEditingUpdate] = useState<WebsiteUpdate>(EMPTY_UPDATE);
  const [previewModalUpdate, setPreviewModalUpdate] = useState<WebsiteUpdate | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const authenticated = isAdminLoggedIn();
  const updates = getAllUpdates();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passcode)) {
      setAuthError('');
      setPasscode('');
    } else {
      setAuthError('رمز المرور الإداري غير صحيح، يرجى التحقق وإعادة المحاولة.');
    }
  };

  const handleStartCreate = () => {
    setEditingUpdate({
      ...EMPTY_UPDATE,
      id: `up-${Date.now()}`
    });
    setActiveTab('editor');
  };

  const handleStartEdit = (u: WebsiteUpdate) => {
    setEditingUpdate({ ...u });
    setActiveTab('editor');
  };

  const handleHighlightChange = (index: number, value: string) => {
    const list = [...editingUpdate.highlights];
    list[index] = value;
    setEditingUpdate((prev) => ({ ...prev, highlights: list }));
  };

  const handleAddHighlight = () => {
    setEditingUpdate((prev) => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const handleRemoveHighlight = (index: number) => {
    const list = editingUpdate.highlights.filter((_, i) => i !== index);
    setEditingUpdate((prev) => ({ ...prev, highlights: list }));
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate.title.trim() || !editingUpdate.version.trim()) {
      alert('يرجى تعبئة عنوان التحديث ورقم النسخة.');
      return;
    }

    try {
      saveCustomUpdate({
        ...editingUpdate,
        highlights: editingUpdate.highlights.filter((h) => h.trim().length > 0)
      });
      setSuccessMessage('تم حفظ ونشر التحديث بنجاح.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setActiveTab('list');
      if (onUpdateChanged) onUpdateChanged();
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء الحفظ.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التحديث؟')) {
      deleteCustomUpdate(id);
      if (onUpdateChanged) onUpdateChanged();
    }
  };

  const handlePreview = (u: WebsiteUpdate) => {
    setPreviewModalUpdate(u);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <div className="fixed inset-0" onClick={onClose} />

        <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#072A20] text-white border-2 border-gold/45 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gold/20 flex items-center justify-between bg-black/25">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                {authenticated ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  لوحة إدارة تحديثات الموقع ونظام ما الجديد
                </h3>
                <p className="text-xs text-slate-300">
                  إنشاء وتعديل ونشر الإصدارات والتحكم في النوافذ المنبثقة للزوار
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {authenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logoutAdmin();
                    setSuccessMessage('تم تسجيل الخروج بنجاح.');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-colors"
                >
                  تسجيل خروج
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-1">
            {!authenticated ? (
              /* Passcode Login Screen */
              <div className="max-w-md mx-auto py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-extrabold text-white">منطقة الإدارة الشرعية والتقنية</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    هذه اللوحة مخصصة لإدارة منصة مدار اليقين ونشر التحديثات والإعلانات الرسمية. يرجى إدخال رمز المرور الإداري للمتابعة.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="أدخل رمز المرور الإداري..."
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-gold/30 focus:border-gold outline-none text-center text-sm text-gold placeholder-slate-500 font-mono"
                    autoFocus
                  />
                  {authError && <p className="text-xs text-rose-400 font-bold">{authError}</p>}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl gold-gradient text-royal font-black text-sm shadow-gold-glow hover:scale-[1.01] transition-transform"
                  >
                    تسجيل الدخول للمتابعة
                  </button>
                  <p className="text-[11px] text-slate-400">
                    الرمز الافتراضي المعتمد للمشرف: <code className="text-gold">madar2026</code>
                  </p>
                </form>
              </div>
            ) : (
              /* Authorized Admin Panel */
              <div className="space-y-6">
                {successMessage && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('list')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'list'
                          ? 'royal-gradient text-gold border border-gold/40'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      قائمة التحديثات ({updates.length})
                    </button>
                    <button
                      type="button"
                      onClick={handleStartCreate}
                      className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                        activeTab === 'editor'
                          ? 'gold-gradient text-royal font-black shadow-gold-glow'
                          : 'bg-white/10 text-gold hover:bg-white/20'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة تحديث جديد</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'list' ? (
                  /* Updates Table / List */
                  <div className="space-y-3">
                    {updates.map((u) => (
                      <div
                        key={u.id}
                        className="p-4 rounded-2xl bg-black/25 border border-gold/25 hover:border-gold/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-gold/20 text-gold font-bold">
                              v{u.version}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                u.status === 'published'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : u.status === 'draft'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-500/20 text-slate-400'
                              }`}
                            >
                              {u.status === 'published' ? 'منشور' : u.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {u.releaseDate}
                            </span>
                            {u.popupVisibility?.showPopup && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                                نافذة منبثقة
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-white">{u.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{u.shortDescription}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handlePreview(u)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-gold/20 text-gold transition-colors"
                            title="معاينة النافذة المنبثقة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(u)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-gold/20 text-slate-200 hover:text-white transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(u.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Create / Edit Form */
                  <form onSubmit={handleSaveUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gold block mb-1">
                          رقم الإصدار (Version):
                        </label>
                        <input
                          type="text"
                          value={editingUpdate.version}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, version: e.target.value })}
                          placeholder="مثال: 2.5.1"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gold block mb-1">
                          تاريخ النشر (Release Date):
                        </label>
                        <input
                          type="date"
                          value={editingUpdate.releaseDate}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, releaseDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gold block mb-1">
                          التصنيف (Category):
                        </label>
                        <select
                          value={editingUpdate.category}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, category: e.target.value as UpdateCategory })}
                          className="w-full px-3 py-2 rounded-xl bg-[#072A20] border border-gold/30 text-xs text-white"
                        >
                          <option value="new_feature">ميزة جديدة (New Feature)</option>
                          <option value="improvement">تحسين وتطوير (Improvement)</option>
                          <option value="bug_fix">إصلاح أخطاء (Bug Fix)</option>
                          <option value="performance">أداء وسرعة (Performance)</option>
                          <option value="announcement">إعلان هام (Announcement)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gold block mb-1">
                          عنوان التحديث بالعربية:
                        </label>
                        <input
                          type="text"
                          value={editingUpdate.title}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, title: e.target.value })}
                          placeholder="عنوان جذاب يوضح الإضافة..."
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Title in English (Optional):
                        </label>
                        <input
                          type="text"
                          value={editingUpdate.titleEn}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, titleEn: e.target.value })}
                          placeholder="English title..."
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gold block mb-1">
                        الوصف المختصر (يظهر في القائمة والنافذة المنبثقة):
                      </label>
                      <input
                        type="text"
                        value={editingUpdate.shortDescription}
                        onChange={(e) => setEditingUpdate({ ...editingUpdate, shortDescription: e.target.value })}
                        placeholder="سطر أو سطرين يلخصان الفائدة..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gold block mb-1">
                        الوصف الكامل والشرح التفصيلي:
                      </label>
                      <textarea
                        value={editingUpdate.fullDescription}
                        onChange={(e) => setEditingUpdate({ ...editingUpdate, fullDescription: e.target.value })}
                        rows={3}
                        placeholder="تفاصيل التحديث والمحتوى المضاف..."
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white leading-relaxed"
                        required
                      />
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gold">
                          أبرز النقاط والمزايا (Highlights):
                        </label>
                        <button
                          type="button"
                          onClick={handleAddHighlight}
                          className="text-[11px] text-amber-300 hover:text-white font-bold"
                        >
                          + إضافة نقطة
                        </button>
                      </div>
                      {editingUpdate.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => handleHighlightChange(idx, e.target.value)}
                            placeholder={`ميزة ${idx + 1}...`}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveHighlight(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Action & Media */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gold block mb-1">
                          رابط الصفحة المعنية (Action URL):
                        </label>
                        <input
                          type="text"
                          value={editingUpdate.actionUrl || ''}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, actionUrl: e.target.value })}
                          placeholder="مثال: /adhkar أو /duas"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gold block mb-1">
                          نص زر الاستكشاف (Button Label):
                        </label>
                        <input
                          type="text"
                          value={editingUpdate.actionLabel || ''}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, actionLabel: e.target.value })}
                          placeholder="مثال: استكشف الميزة الآن"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-gold/30 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Publishing & Popup Controls */}
                    <div className="p-4 rounded-2xl bg-black/35 border border-gold/25 space-y-3">
                      <span className="text-xs font-black text-gold block">
                        إعدادات النشر والظهور المنبثق:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-300 mb-1">حالة النشر:</label>
                          <select
                            value={editingUpdate.status}
                            onChange={(e) => setEditingUpdate({ ...editingUpdate, status: e.target.value as UpdateStatus })}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#072A20] border border-gold/30 text-white"
                          >
                            <option value="published">نشر فوري (Published)</option>
                            <option value="draft">حفظ كمسودة (Draft)</option>
                            <option value="archived">أرشفة (Archived)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-1">مستوى الأهمية:</label>
                          <select
                            value={editingUpdate.importance}
                            onChange={(e) => setEditingUpdate({ ...editingUpdate, importance: e.target.value as UpdateImportance })}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#072A20] border border-gold/30 text-white"
                          >
                            <option value="normal">عادي (Normal)</option>
                            <option value="important">مهم (Important)</option>
                            <option value="critical">حرج يتطلب إقراراً (Critical)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 mb-1">الجمهور المستهدف:</label>
                          <select
                            value={editingUpdate.targetAudience}
                            onChange={(e) => setEditingUpdate({ ...editingUpdate, targetAudience: e.target.value as TargetAudience })}
                            className="w-full px-3 py-1.5 rounded-xl bg-[#072A20] border border-gold/30 text-white"
                          >
                            <option value="all">كافة الزوار (All)</option>
                            <option value="returning_visitors">الزوار العائدون فقط</option>
                            <option value="new_visitors">الزوار الجدد فقط</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gold/15 text-xs">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingUpdate.popupVisibility?.showPopup ?? true}
                            onChange={(e) =>
                              setEditingUpdate({
                                ...editingUpdate,
                                popupVisibility: {
                                  ...editingUpdate.popupVisibility,
                                  showPopup: e.target.checked
                                }
                              })
                            }
                            className="rounded border-gold text-gold focus:ring-gold"
                          />
                          <span>إظهار في نافذة ما الجديد التلقائية المنبثقة</span>
                        </label>

                        {editingUpdate.importance === 'critical' && (
                          <label className="inline-flex items-center gap-2 cursor-pointer text-amber-200">
                            <input
                              type="checkbox"
                              checked={editingUpdate.popupVisibility?.forceUntilAcknowledged ?? false}
                              onChange={(e) =>
                                setEditingUpdate({
                                  ...editingUpdate,
                                  popupVisibility: {
                                    ...editingUpdate.popupVisibility,
                                    forceUntilAcknowledged: e.target.checked
                                  }
                                })
                              }
                              className="rounded border-amber-400 text-amber-400 focus:ring-amber-400"
                            />
                            <span>تكرار الظهور حتى يقر الزائر بالاطلاع عليه</span>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-gold/20">
                      <button
                        type="button"
                        onClick={() => handlePreview(editingUpdate)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-gold/30 text-xs font-bold text-gold inline-flex items-center gap-2 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>معاينة حية للنافذة المنبثقة (Live Preview)</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('list')}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl gold-gradient text-royal font-black text-xs shadow-gold-glow inline-flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>حفظ ونشر التحديث</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewModalUpdate && (
        <WhatsNewModal
          previewUpdate={previewModalUpdate}
          onManualClose={() => setPreviewModalUpdate(null)}
        />
      )}
    </>
  );
};

