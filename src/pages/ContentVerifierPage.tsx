import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Info,
  Filter,
  Sparkles
} from 'lucide-react';
import { VERIFIER_DATA, VERIFIED_HADITH_SOURCES } from '../data/verifierData';
import { VerifierCategory, AuthenticityGrade, VerifierItem } from '../types/extraModules';

export const ContentVerifierPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VerifierCategory>('all');
  const [selectedGrade, setSelectedGrade] = useState<'all' | AuthenticityGrade>('all');
  const [selectedItem, setSelectedItem] = useState<VerifierItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: VerifierCategory; label: string }[] = [
    { id: 'all', label: 'كافة الموضوعات' },
    { id: 'popular_messages', label: 'رسائل الواتساب المتداولة' },
    { id: 'ibadat', label: 'عبادات وأدعية' },
    { id: 'muamalat', label: 'معاملات وأخلاق' },
    { id: 'virtues_times', label: 'فضائل الأوقات والمواسم' },
  ];

  const grades: { id: 'all' | AuthenticityGrade; label: string }[] = [
    { id: 'all', label: 'جميع الدرجات' },
    { id: 'sahih', label: 'صحيح ثابت' },
    { id: 'daif', label: 'ضعيف لا يصح' },
    { id: 'mawdu', label: 'مكذوب موضوع' },
    { id: 'no_basis', label: 'بدعة ولا أصل له' },
  ];

  const filteredItems = useMemo(() => {
    return VERIFIER_DATA.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.queryPhrase.includes(searchQuery.trim()) ||
        item.commonSpreadText.includes(searchQuery.trim()) ||
        item.verdictSummary.includes(searchQuery.trim()) ||
        item.tags.some((tag) => tag.includes(searchQuery.trim()));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesGrade = selectedGrade === 'all' || item.grade === selectedGrade;

      return matchesSearch && matchesCat && matchesGrade;
    });
  }, [searchQuery, selectedCategory, selectedGrade]);

  const handleCopyVerdict = async (item: VerifierItem) => {
    const text = `🔍 *تحقق من صحة الحديث عبر منصة مدار اليقين*:
النص المتداول: «${item.queryPhrase}»
الدرجة الشرعية: ${item.gradeLabelAr}
المحدث والمصدر: ${item.primaryMuhaddith} - ${item.referenceBook}
خلاصة الحكم: ${item.verdictSummary}
${item.authenticAlternative ? `\n✅ *البديل الصحيح الثابت*: «${item.authenticAlternative.text}» (${item.authenticAlternative.source})` : ''}
🔗 https://wasl-islam.fun/content-verifier`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      // ignore
    }
  };

  const getGradeBadge = (grade: AuthenticityGrade) => {
    switch (grade) {
      case 'sahih':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>صحيح ثابت</span>
          </span>
        );
      case 'daif':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ضعيف الإسناد</span>
          </span>
        );
      case 'mawdu':
      case 'no_basis':
      case 'distorted_meaning':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>مكذوب / لا أصل له</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>منظومة التحقق الشرعي والتخريج الحديثي</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              تحقق من صحة المعلومة الإسلامية
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              افحص الأحاديث المتداولة والرسائل المنتشرة في وسائل التواصل واعرف حكم كبار أئمة الحديث (البخاري، مسلم، ابن باز، الألباني) مع بيان الأحاديث الصحيحة البديلة.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-[#0E1726] p-5 sm:p-6 rounded-2xl border border-gold/30 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن حديث، مقولة، أو كلمة مثل: (حب الوطن، خمس عشرة عقوبة، سبعين ألف ملك)..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                مسح
              </button>
            )}
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>التصنيف:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grade Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الدرجة:</span>
            {grades.map((grd) => (
              <button
                key={grd.id}
                type="button"
                onClick={() => setSelectedGrade(grd.id)}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${
                  selectedGrade === grd.id
                    ? 'bg-gold/20 text-gold border border-gold font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                }`}
              >
                {grd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>عدد النتائج: {filteredItems.length} حديث ومقولة موثقة</span>
            <span>المصدر: مجمع الملك فهد والدرر السنية وهيئة كبار العلماء</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-[#0E1726] p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <AlertTriangle className="w-12 h-12 text-gold mx-auto" />
              <h3 className="font-bold text-lg">لم يتم العثور على نتائج مطابقة</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                جرب البحث بكلمات أخرى أو تصفح روابط المصادر الرسمية أدناه للبحث في موسوعات التخريج الكبرى.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-white dark:bg-[#0E1726] rounded-2xl p-5 border border-gold/25 hover:border-gold transition-all shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      {getGradeBadge(item.grade)}
                      <span className="text-[11px] font-bold text-slate-400">
                        {item.categoryLabelAr}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-royal dark:text-gold leading-snug">
                      «{item.queryPhrase}»
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {item.verdictSummary}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">المحقق / المحدث:</span>
                        <strong className="text-royal dark:text-slate-200">{item.primaryMuhaddith}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">المصدر المعتمد:</span>
                        <span className="text-slate-700 dark:text-slate-300">{item.referenceBook}</span>
                      </div>
                    </div>

                    {item.authenticAlternative && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>البديل الصحيح الثابت:</span>
                        </span>
                        <p className="text-slate-700 dark:text-slate-200 line-clamp-2">
                          {item.authenticAlternative.text}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-bold text-gold hover:underline flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>عرض التفصيل والتخريج</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyVerdict(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="نسخ التخريج لنشره وتنبيه الآخرين"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ التخريج</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0D1624] border-2 border-gold/40 shadow-2xl p-6 space-y-5"
              >
                <div className="flex items-start justify-between gap-3 border-b border-gold/20 pb-4">
                  <div>
                    {getGradeBadge(selectedItem.grade)}
                    <h3 className="text-lg sm:text-xl font-bold text-royal dark:text-gold mt-2">
                      «{selectedItem.queryPhrase}»
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-gold text-xs mb-1">صيغة الانتشار المتداولة:</h4>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 italic">
                      {selectedItem.commonSpreadText}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gold text-xs mb-1">التفصيل العلمي وبيان الحكم:</h4>
                    <p className="leading-relaxed whitespace-pre-line">
                      {selectedItem.verifiedRulingDetail}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/20">
                    <div>
                      <span className="text-slate-500 text-xs block">المحقق المعتمد:</span>
                      <strong className="text-royal dark:text-gold">{selectedItem.primaryMuhaddith}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">مرجع التخريج:</span>
                      <span className="text-slate-700 dark:text-slate-300">{selectedItem.referenceBook}</span>
                    </div>
                  </div>

                  {selectedItem.authenticAlternative && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>ما صح وثبت في هذا الباب:</span>
                      </h4>
                      <p className="font-bold text-emerald-950 dark:text-emerald-200">
                        {selectedItem.authenticAlternative.text}
                      </p>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        <span>المصدر: {selectedItem.authenticAlternative.source}</span>
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300">
                        {selectedItem.authenticAlternative.meaning}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleCopyVerdict(selectedItem)}
                    className="px-4 py-2 rounded-xl gold-gradient text-royal font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === selectedItem.id ? 'تم النسخ!' : 'نسخ النص للتوعية'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Official Sources Cards */}
        <div className="p-6 rounded-3xl bg-royal/5 dark:bg-white/5 border border-gold/30 space-y-3">
          <h3 className="font-bold text-base text-royal dark:text-gold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gold" />
            <span>المصادر الرسمية المعتمدة للتحقق والتخريج</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            يمكنك الرجوع مباشرة للمنصات والموسوعات الرسمية المعتمدة للبحث في أسانيد الأحاديث والفتاوى:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
            {VERIFIED_HADITH_SOURCES.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/25 hover:border-gold text-xs font-semibold text-royal dark:text-slate-200 flex items-center justify-between transition-all group"
              >
                <span className="truncate">{src.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gold opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

