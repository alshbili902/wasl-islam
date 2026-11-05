import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Globe, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  MessageCircle,
  Filter,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ISLAMIC_CENTERS_DATA } from '../data/islamicCentersData';
import { CenterType, IslamicCenterItem } from '../types/extraModules';
import { PageWrapper } from '../components/layout/PageWrapper';

export const IslamicCentersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<CenterType | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const centerTypes: { id: CenterType | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة المراكز' },
    { id: 'online_maqraa', label: 'مقارئ إلكترونية عالمية (عن بُعد)' },
    { id: 'quran_memorization', label: 'جمعيات تحفيظ القرآن' },
    { id: 'historic_grand_mosque', label: 'جوامع وصروح إسلامية كبرى' },
    { id: 'islamic_cultural_center', label: 'مراكز إسلامية دولية' },
  ];

  const cities = useMemo(() => {
    const list = Array.from(new Set(ISLAMIC_CENTERS_DATA.map((c) => c.city)));
    return ['all', ...list];
  }, []);

  const filteredCenters = useMemo(() => {
    return ISLAMIC_CENTERS_DATA.filter((center) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        center.name.includes(searchQuery.trim()) ||
        center.city.includes(searchQuery.trim()) ||
        center.country.includes(searchQuery.trim()) ||
        center.description.includes(searchQuery.trim()) ||
        center.servicesOffered.some((s) => s.includes(searchQuery.trim()));

      const matchesType = selectedType === 'all' || center.type === selectedType;
      const matchesCity = selectedCity === 'all' || center.city === selectedCity;

      return matchesSearch && matchesType && matchesCity;
    });
  }, [searchQuery, selectedType, selectedCity]);

  return (
    <PageWrapper
      title="دليل المراكز والمجمعات الإسلامية وحلقات تحفيظ القرآن"
      description="دليل توثيقي يربطك بأكبر جمعيات تحفيظ القرآن الكريم (مكنون، خيركم، فرقان)، والمقارئ الإلكترونية المجانية بالسند المتصل، والمراكز الإسلامية الكبرى."
      canonicalPath="/islamic-centers"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'المراكز الإسلامية', url: '/islamic-centers' },
      ]}
      schemaType="CollectionPage"
    >
      <div className="pb-12 min-w-0 space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <Building2 className="w-4 h-4" />
              <span>دليل المنشآت القرآنية والمراكز المعتمدة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              دليل المراكز الإسلامية وحلقات التحفيظ
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              دليل موثق يربطك بأكبر جمعيات تحفيظ القرآن الكريم بالمملكة (مكنون، خيركم، فرقان)، والمقارئ الإلكترونية المجانية بالسند المتصل (مقرأة الحرمين)، والجوامع الكبرى والمراكز الإسلامية حول العالم.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <Building2 className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#0E1726] p-5 sm:p-6 rounded-2xl border border-gold/30 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مركز، جمعية، مدينة، أو خدمة (مثل: مكنون، الرياض، مقرأة الحرمين، إجازة بالسند)..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Types Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>نوع المركز:</span>
            </span>
            {centerTypes.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedType === t.id
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Cities Filter */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">المدينة:</span>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  selectedCity === city
                    ? 'bg-gold/20 text-gold border border-gold font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                }`}
              >
                {city === 'all' ? 'جميع المدن' : city}
              </button>
            ))}
          </div>
        </div>

        {/* Centers Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>المراكز المسجلة ({filteredCenters.length})</span>
            <span>بيانات موثقة ومحدثة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCenters.map((center) => (
              <motion.div
                key={center.id}
                layout
                className="bg-white dark:bg-[#0E1726] rounded-2xl p-6 border border-gold/30 hover:border-gold transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold/15 text-gold border border-gold/30">
                      {center.typeLabelAr}
                    </span>
                    {center.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>معتمد رسمي</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-royal dark:text-gold">
                    {center.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span>{center.city} — {center.country}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {center.description}
                  </p>

                  {/* Services List */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <span className="font-bold text-gold text-[11px] block">البرامج والخدمات المقدمة:</span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {center.servicesOffered.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {center.workingHours && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <Clock className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>{center.workingHours}</span>
                    </div>
                  )}
                </div>

                {/* Contact & Map Links */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {center.phone && (
                      <a
                        href={`tel:${center.phone}`}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 transition-colors"
                        title="اتصال هاتفي"
                      >
                        <Phone className="w-4 h-4 text-gold" />
                      </a>
                    )}
                    {center.googleMapsUrl && (
                      <a
                        href={center.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-700 dark:text-slate-300 transition-colors"
                        title="فتح الموقع على خرائط Google"
                      >
                        <MapPin className="w-4 h-4 text-gold" />
                      </a>
                    )}
                  </div>

                  {center.website && (
                    <a
                      href={center.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl gold-gradient text-royal text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:brightness-105 transition-all"
                    >
                      <span>زيارة المنصة الرسمية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

