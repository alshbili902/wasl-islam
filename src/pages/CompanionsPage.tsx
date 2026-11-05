import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Sparkles,
  Award,
  BookOpen,
  Quote,
  Shield,
  HeartHandshake,
  Copy,
  Check,
  X,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  COMPANIONS_DATA,
  COMPANION_CATEGORIES,
  CompanionProfile,
  CompanionCategory
} from '../data/companionsData';
import { PageWrapper } from '../components/layout/PageWrapper';

export const CompanionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCompanionId = searchParams.get('companionId');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionProfile | null>(
    initialCompanionId
      ? COMPANIONS_DATA.find((c) => c.id === initialCompanionId) || null
      : null
  );
  const [copiedBio, setCopiedBio] = useState<boolean>(false);

  // Filtered companions
  const filteredCompanions = useMemo(() => {
    return COMPANIONS_DATA.filter((comp) => {
      const matchCategory =
        selectedCategory === 'all' || comp.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.lineage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.bioSummary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenCompanion = (companion: CompanionProfile) => {
    setSelectedCompanion(companion);
    setSearchParams({ companionId: companion.id });
  };

  const handleCloseModal = () => {
    setSelectedCompanion(null);
    setSearchParams({});
  };

  const handleCopyProfile = (companion: CompanionProfile) => {
    const text = `سيرة الصحابي الجليل: ${companion.name} (${companion.honorific})\nاللقب: ${companion.title}\nالنسب: ${companion.lineage}\nالمعالم: توفي سنة ${companion.deathYearH} بموضع: ${companion.deathPlace}\n\nنبذة: ${companion.bioSummary}\n\nمن فضائله:\n${companion.virtues.map((v) => `• ${v}`).join('\n')}\n\nمن أقواله:\n${companion.famousSaying || ''}\n\n— من موسوعة الصحابة والصحابيات بمشروع مدار اليقين`;
    navigator.clipboard.writeText(text);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2500);
  };

  return (
    <PageWrapper
      title={selectedCompanion ? `سيرة ${selectedCompanion.name} ${selectedCompanion.honorific} | موسوعة الصحابة` : 'موسوعة الصحابة والصحابيات وسير أعلام الهدى'}
      description={selectedCompanion ? (selectedCompanion.bioSummary || `ترجمة وسيرة الصحابي الجليل ${selectedCompanion.name} ${selectedCompanion.honorific}؛ إسلامه وجهاده ومناقبه.`) : 'سير موثقة لأصحاب رسول الله ﷺ من الخلفاء الراشدين، والعشرة المبشرين بالجنة، وأمهات المؤمنين، والصحابيات الجليلات.'}
      canonicalPath={selectedCompanion ? `/companions/${selectedCompanion.id}` : '/companions'}
      breadcrumbs={
        selectedCompanion
          ? [
              { name: 'الرئيسية', url: '/' },
              { name: 'موسوعة الصحابة', url: '/companions' },
              { name: selectedCompanion.name, url: `/companions/${selectedCompanion.id}` },
            ]
          : [
              { name: 'الرئيسية', url: '/' },
              { name: 'موسوعة الصحابة', url: '/companions' },
            ]
      }
      schemaType={selectedCompanion ? 'Article' : 'CollectionPage'}
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <Users className="w-4 h-4" />
            <span>جيل النصر والتمكين</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            موسوعة الصحابة والصحابيات
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            سير موثقة لأصحاب رسول الله ﷺ من الخلفاء الراشدين، والعشرة المبشرين بالجنة، وأمهات المؤمنين، والصحابيات الجليلات، وأعلام الرواة والفقهاء، مع بيان مناقبهم الشريفة، وتضحياتهم التاريخية، وأحاديث فضلهم المروية في أصح كتب السنة.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Shield className="w-3.5 h-3.5 text-gold" />
              الخلفاء الراشدون الأربعة
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Award className="w-3.5 h-3.5 text-gold" />
              العشرة المبشرون بالجنة
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-xl border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              أمهات المؤمنين الطاهرات
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-gold/20 backdrop-blur-md">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {COMPANION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-royal text-gold shadow-md shadow-royal/30 dark:bg-gold dark:text-royal'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو اللقب أو الفضيلة..."
            className="w-full pl-4 pr-10 py-2 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Grid of Companion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanions.map((comp) => (
          <motion.div
            key={comp.id}
            layout
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/20 shadow-md hover:shadow-xl hover:border-gold/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25">
                  {comp.categoryNameAr}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {comp.deathYearH}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                {comp.name}
              </h3>
              <p className="text-xs text-gold font-semibold mb-2">
                {comp.honorific} • {comp.title}
              </p>

              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                {comp.bioSummary}
              </p>

              {/* Virtues preview tag */}
              <div className="space-y-1.5 mb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                {comp.virtues.slice(0, 2).map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <Sparkles className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenCompanion(comp)}
              className="w-full mt-2 py-2.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-slate-900 dark:text-gold border border-gold/25 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-gold" />
              <span>قراءة السيرة الكاملة والمناقب</span>
            </button>
          </motion.div>
        ))}
      </div>

      {filteredCompanions.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 my-8">
          لم يتم العثور على نتائج مطابقة لـ "{searchQuery}"
        </div>
      )}

      {/* Detailed Modal Dialog */}
      <AnimatePresence>
        {selectedCompanion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-gold/30 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-5 left-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25 inline-block mb-2">
                  {selectedCompanion.categoryNameAr}
                </span>
                <h2 className="text-2xl font-bold font-quran text-slate-900 dark:text-slate-100">
                  {selectedCompanion.name} ({selectedCompanion.honorific})
                </h2>
                <p className="text-sm text-gold font-semibold mt-1">
                  {selectedCompanion.title}
                </p>
              </div>

              {/* Lineage and Death info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    النسب الشريف:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {selectedCompanion.lineage}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    الوفاة والمدفن:
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedCompanion.deathYearH} — {selectedCompanion.deathPlace}
                  </span>
                </div>
              </div>

              {/* Conversion Story */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-royal dark:text-gold flex items-center gap-1.5 mb-2">
                  <HeartHandshake className="w-4 h-4" />
                  <span>قصة إسلامه وهجرته</span>
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-500/5 dark:bg-gold/5 p-4 rounded-2xl border border-gold/15">
                  {selectedCompanion.conversionStory}
                </p>
              </div>

              {/* Virtues & Prophetic Praise */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-royal dark:text-gold flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4" />
                  <span>فضائله ومناقبه الشريفة</span>
                </h4>
                <div className="space-y-2">
                  {selectedCompanion.virtues.map((v, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Authentic Hadiths */}
              {selectedCompanion.authenticHadiths.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-royal dark:text-gold flex items-center gap-1.5 mb-2">
                    <Shield className="w-4 h-4" />
                    <span>أحاديث نبوية في فضله</span>
                  </h4>
                  <div className="space-y-2.5">
                    {selectedCompanion.authenticHadiths.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/[0.03] border border-gold/20"
                      >
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1 leading-relaxed">
                          {h.text}
                        </p>
                        <span className="text-[11px] text-gold font-bold">
                          {h.source}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Famous Saying */}
              {selectedCompanion.famousSaying && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border-r-4 border-gold border-y border-l border-gold/20">
                  <div className="flex items-center gap-2 text-xs font-bold text-gold mb-1">
                    <Quote className="w-3.5 h-3.5" />
                    <span>من مأثور أقواله الخالدة:</span>
                  </div>
                  <p className="text-sm text-slate-800 dark:text-slate-100 font-semibold italic">
                    {selectedCompanion.famousSaying}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleCopyProfile(selectedCompanion)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-royal/10 dark:bg-gold/15 hover:bg-gold/25 text-royal dark:text-gold border border-gold/30 transition-all"
                >
                  {copiedBio ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500">تم نسخ السيرة</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gold" />
                      <span>نسخ السيرة والمناقب</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </PageWrapper>
  );
};

