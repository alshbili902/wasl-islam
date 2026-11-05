import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';
import {
  searchAllEncyclopedia,
  GlobalSearchResult,
  SearchResultType
} from '../data/searchService';

const SEARCH_CATEGORIES: { id: SearchResultType | 'all'; label: string }[] = [
  { id: 'all', label: 'جميع الأقسام' },
  { id: 'update', label: 'تحديثات الموقع' },
  { id: 'adhkar', label: 'واحة الأذكار' },
  { id: 'dua', label: 'موسوعة الأدعية' },
  { id: 'quran_coach', label: 'مدرّب الحفظ' },
  { id: 'tajweed', label: 'معمل التجويد' },
  { id: 'quranic_arabic', label: 'لغة القرآن' },
  { id: 'sign_language', label: 'لغة الإشارة' },
  { id: 'verifier', label: 'تحقق الحديث' },
  { id: 'daily_fiqh', label: 'فقه المعاملات' },
  { id: 'janazah', label: 'دليل الجنائز' },
  { id: 'audio_library', label: 'المكتبة الصوتية' },
  { id: 'islamic_center', label: 'مراكز التحفيظ' },
  { id: 'scholar', label: 'العلماء والكتب' },
  { id: 'companion_activity', label: 'رفيق المسلم' },
  { id: 'hajj_umrah_step', label: 'الحج والعمرة' },
  { id: 'kids_lesson', label: 'عالم الأطفال' },
  { id: 'history_atlas', label: 'أطلس التاريخ' },
  { id: 'prophet', label: 'قصص الأنبياء' },
  { id: 'seerah', label: 'السيرة النبوية' },
  { id: 'companion', label: 'سير الصحابة' },
  { id: 'surah', label: 'تفسير القرآن' },
  { id: 'hadith', label: 'الحديث الشريف' },
  { id: 'academy_track', label: 'الأكاديمية' },
  { id: 'worship_guide', label: 'تعليم العبادات' },
  { id: 'aqeedah_article', label: 'العقيدة الإسلامية' },
  { id: 'fatwa', label: 'الفتاوى الموثقة' },
];

const POPULAR_SEARCHES = [
  'سيد الاستغفار',
  'دعاء تفريج الهم والحزن',
  'دعاء السفر',
  'تكرار الآيات وحفظ جزء عم',
  'مخارج الحروف وصفاتها',
  'إعراب وبلاغة الفاتحة',
  'لغة الإشارة للوضوء والصلاة',
  'حب الوطن من الإيمان',
  'الشراء بالتقسيط',
  'صلاة الجنازة',
  'الشيخ ابن باز',
  'مكنون الرياض',
  'أبو بكر الصديق',
  'غزوة بدر',
  'آية الكرسي',
  'الأربعون النووية',
  'صفة الوضوء',
  'توحيد الألوهية'
];

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const filterParam = (searchParams.get('type') as SearchResultType | 'all') || 'all';

  const [query, setQuery] = useState<string>(qParam);
  const [selectedType, setSelectedType] = useState<SearchResultType | 'all'>(filterParam);
  const navigate = useNavigate();

  useEffect(() => {
    if (qParam) setQuery(qParam);
  }, [qParam]);

  const results = useMemo<GlobalSearchResult[]>(() => {
    return searchAllEncyclopedia(query, selectedType);
  }, [query, selectedType]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setSearchParams(val ? { q: val, type: selectedType } : {});
  };

  const handleTypeChange = (type: SearchResultType | 'all') => {
    setSelectedType(type);
    if (query) {
      setSearchParams({ q: query, type });
    }
  };

  const handleQuickSearch = (keyword: string) => {
    setQuery(keyword);
    setSearchParams({ q: keyword, type: selectedType });
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Search Box */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white text-center">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-2">
            <Search className="w-4 h-4" />
            <span>محرك البحث الإسلامي الموحد</span>
          </div>

          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold leading-tight">
            ابحث في موسوعات مدار اليقين
          </h1>

          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
            محرك بحث ذكي يبحث لحظياً في آلاف المواد الموثقة: قصص الأنبياء، السيرة النبوية، سير الصحابة، تفاسير القرآن، أحاديث السنة، مسارات الأكاديمية، أدلة العبادات، مباحث العقيدة، والفتاوى الرسمية.
          </p>

          {/* Big Input */}
          <div className="relative pt-2">
            <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="اكتب كلمة البحث (مثال: غزوة بدر، صلاة المسافر، بر الوالدين)..."
              className="w-full pr-12 pl-4 py-4 rounded-2xl text-sm sm:text-base bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-2 border-gold/40 shadow-xl focus:outline-none focus:border-gold"
              autoFocus
            />
          </div>

          {/* Popular Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-300">عمليات بحث شائعة:</span>
            {POPULAR_SEARCHES.slice(0, 5).map((pop, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleQuickSearch(pop)}
                className="px-2.5 py-1 rounded-lg bg-black/30 hover:bg-gold/20 text-slate-200 hover:text-gold border border-white/10 transition-colors"
              >
                {pop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-8 bg-white/70 dark:bg-slate-900/70 p-3 rounded-2xl border border-gold/20 backdrop-blur-md">
        {SEARCH_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleTypeChange(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              selectedType === cat.id
                ? 'bg-royal text-gold shadow-md dark:bg-gold dark:text-royal'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Section */}
      {query.trim() ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 mb-2">
            <span>
              تم العثور على <strong>{results.length}</strong> نتيجة لـ "{query}"
            </span>
            <span className="text-gold font-semibold">مرتبة حسب الأولوية والتطابق</span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((res) => (
                <motion.div
                  key={res.id}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(res.url)}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/20 shadow-md hover:border-gold/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25">
                        {res.categoryLabel}
                      </span>
                      {res.badge && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {res.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                      {res.title}
                    </h3>

                    {res.subtitle && (
                      <p className="text-xs text-gold font-semibold mb-2">
                        {res.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4 text-justify">
                      {res.snippet}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-gold font-bold">
                    <span>الانتقال للمحتوى</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 my-6">
              لم نعثر على نتائج مطابقة لـ "{query}". جرب استخدام كلمات أخرى أو تصفح الأقسام مباشرة.
            </div>
          )}
        </div>
      ) : (
        /* Empty State Suggestions */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-gold/20 shadow-md text-center max-w-xl mx-auto space-y-4">
          <Layers className="w-12 h-12 text-gold mx-auto opacity-75" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            ابدأ بالبحث في الموسوعة الإسلامية
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            يمكنك كتابة أي سؤال فقهي، أو اسم نبي أو صحابي، أو كلمة من القرآن أو الحديث النبوي الشريف لتصل إلى المحتوى الموثق مباشرة.
          </p>
        </div>
      )}
    </div>
  );
};

