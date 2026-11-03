import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Award, 
  Users, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Quote, 
  Sparkles,
  Info,
  Filter
} from 'lucide-react';
import { SCHOLARS_DATA } from '../data/scholarsData';
import { ScholarEra, ScholarProfile } from '../types/extraModules';

export const ScholarsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState<ScholarEra | 'all'>('all');
  const [selectedScholar, setSelectedScholar] = useState<ScholarProfile | null>(null);

  const eras: { id: ScholarEra | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة الأئمة' },
    { id: 'four_imams', label: 'الأئمة الأربعة' },
    { id: 'hadith_tafsir_masters', label: 'أئمة الحديث والتفسير' },
    { id: 'classical_muhaqqiqin', label: 'كبار المحققين (ابن تيمية وابن القيم)' },
    { id: 'contemporary_scholars', label: 'علماء العصر الحديث (ابن باز والعثيمين والألباني)' },
  ];

  const filteredScholars = useMemo(() => {
    return SCHOLARS_DATA.filter((scholar) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        scholar.name.includes(searchQuery.trim()) ||
        scholar.fullName.includes(searchQuery.trim()) ||
        scholar.titleOrHonorific.includes(searchQuery.trim()) ||
        scholar.biographySummary.includes(searchQuery.trim()) ||
        scholar.notableBooks.some((b) => b.title.includes(searchQuery.trim()));

      const matchesEra = selectedEra === 'all' || scholar.era === selectedEra;

      return matchesSearch && matchesEra;
    });
  }, [searchQuery, selectedEra]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>أعلام الأمة وحراس الملة والمصنفات الشرعية</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              موسوعة العلماء وأمهات الكتب والمصنفات
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              سير وتراجم أئمة أهل السنة والجماعة، من الأئمة الأربعة وأعلام الحديث والتفسير، إلى كبار المحققين وعلماء العصر الحديث، مع استعراض شامل لأمهات كتبهم ومناهجهم العلمية وروابط التصفح.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <GraduationCap className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Search & Era Filter */}
        <div className="bg-white dark:bg-[#0E1726] p-5 sm:p-6 rounded-2xl border border-gold/30 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن عالم، إمام، أو كتاب (مثل: الشافعي، البخاري، ابن تيمية، ابن باز، مجموع الفتاوى)..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>الطبقة والعصر:</span>
            </span>
            {eras.map((era) => (
              <button
                key={era.id}
                type="button"
                onClick={() => setSelectedEra(era.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedEra === era.id
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                {era.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scholars Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>العلماء والمصنفون ({filteredScholars.length})</span>
            <span>تراجم موثقة بمصادر التاريخ والتراجم</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredScholars.map((scholar) => (
              <motion.div
                key={scholar.id}
                layout
                className="bg-white dark:bg-[#0E1726] rounded-2xl p-6 border border-gold/30 hover:border-gold transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold/15 text-gold border border-gold/30">
                      {scholar.eraLabelAr}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      <span>{scholar.birthDeathHijri}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-royal dark:text-gold">
                      {scholar.name}
                    </h3>
                    <p className="text-xs text-gold/90 dark:text-gold font-semibold mt-0.5">
                      {scholar.titleOrHonorific}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {scholar.biographySummary}
                  </p>

                  {/* Notable Books Mini list */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold text-royal dark:text-gold text-[11px] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-gold" />
                      <span>أبرز أمهات الكتب والمصنفات:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {scholar.notableBooks.map((bk) => (
                        <span
                          key={bk.id}
                          className="px-2 py-0.5 rounded-lg bg-gold/10 text-royal dark:text-slate-200 text-[11px] font-semibold border border-gold/25"
                        >
                          {bk.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Famous Quote */}
                  {scholar.famousQuotes.length > 0 && (
                    <div className="p-3 rounded-xl bg-royal/5 dark:bg-white/5 border-r-2 border-gold text-[11px] italic text-slate-700 dark:text-slate-300">
                      {scholar.famousQuotes[0]}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    <span>{scholar.countryOrCityOrigin}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedScholar(scholar)}
                    className="px-3 py-1.5 rounded-xl gold-gradient text-royal text-xs font-bold inline-flex items-center gap-1.5 hover:brightness-105 transition-all shadow-sm"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>الترجمة والمصنفات كاملة</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scholar Full Profile Modal */}
        <AnimatePresence>
          {selectedScholar && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedScholar(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0D1624] border-2 border-gold/40 shadow-2xl p-6 sm:p-8 space-y-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-gold/20 pb-4">
                  <div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gold/15 text-gold border border-gold/30">
                      {selectedScholar.eraLabelAr}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-royal dark:text-gold mt-2">
                      {selectedScholar.fullName}
                    </h2>
                    <p className="text-xs sm:text-sm text-gold font-semibold">
                      {selectedScholar.titleOrHonorific} ({selectedScholar.birthDeathHijri})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedScholar(null)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
                  >
                    ✕
                  </button>
                </div>

                {/* Biography & Scientific Methodology */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <div>
                    <h4 className="font-bold text-gold text-xs mb-1">الترجمة والسيرة:</h4>
                    <p className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 leading-relaxed">
                      {selectedScholar.biographySummary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gold text-xs mb-1">المنهج العلمي والاستدلالي:</h4>
                    <p className="p-3.5 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/25 leading-relaxed font-semibold">
                      {selectedScholar.scientificMethodology}
                    </p>
                  </div>

                  {/* Teachers and Students */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-gold text-xs block">أبرز الشيوخ:</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {selectedScholar.prominentTeachers.join('، ')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-gold text-xs block">أبرز التلاميذ:</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {selectedScholar.prominentStudents.join('، ')}
                      </p>
                    </div>
                  </div>

                  {/* Books Detailed Section */}
                  <div className="space-y-3 pt-2">
                    <h4 className="font-bold text-royal dark:text-gold text-sm flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gold" />
                      <span>المصنفات وأمهات الكتب:</span>
                    </h4>
                    <div className="space-y-2.5">
                      {selectedScholar.notableBooks.map((bk) => (
                        <div
                          key={bk.id}
                          className="p-4 rounded-xl bg-white dark:bg-[#080E18] border border-gold/30 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-royal dark:text-gold text-sm">
                              {bk.title}
                            </h5>
                            <span className="text-[11px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-md">
                              {bk.fieldLabelAr}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {bk.description}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <span className="text-slate-500">الأهمية: {bk.significance}</span>
                            {bk.shamelaUrl && (
                              <a
                                href={bk.shamelaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold font-bold hover:underline flex items-center gap-1"
                              >
                                <span>تصفح في الشاملة</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedScholar(null)}
                    className="px-5 py-2 rounded-xl gold-gradient text-royal font-bold text-xs shadow-sm"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
