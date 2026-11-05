import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Calendar,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  ScrollText,
  Clock,
  Landmark,
  Share2,
  Check
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  HISTORICAL_PERIODS,
  HISTORICAL_CITIES,
  HISTORICAL_TIMELINE_EVENTS,
  HISTORICAL_ROUTES,
  GEOGRAPHIC_REGIONS
} from '../data/historyAtlasData';
import {
  HistoricalPeriodId,
  GeographicRegionId,
  HistoricalCity,
  HistoricalEvent
} from '../types/historyAtlas';

export const HistoryAtlasPage: React.FC = () => {
  // Active View Tabs
  const [activeView, setActiveView] = useState<'map' | 'timeline' | 'cities' | 'civilization'>('map');

  // Filters
  const [selectedPeriod, setSelectedPeriod] = useState<HistoricalPeriodId | 'all'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map Controls: Zoom & Pan
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeRouteId, setActiveRouteId] = useState<string | null>('route_hijrah');

  // Detail Modal / Drawer for City or Event
  const [selectedCity, setSelectedCity] = useState<HistoricalCity | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);

  // Copy alert state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Map projection helper: Converts geographic Lat/Lng to SVG coordinate space
  // Bounds roughly: Lat 15 to 45, Lng -12 to 75
  const projectGeoToSvg = (lat: number, lng: number) => {
    const minLng = -12;
    const maxLng = 75;
    const minLat = 15;
    const maxLat = 45;

    // SVG viewbox 0 0 1000 600
    const x = ((lng - minLng) / (maxLng - minLng)) * 960 + 20;
    const y = 580 - ((lat - minLat) / (maxLat - minLat)) * 540;
    return { x, y };
  };

  // Filtered Cities
  const filteredCities = useMemo(() => {
    return HISTORICAL_CITIES.filter((city) => {
      const matchPeriod = selectedPeriod === 'all' || city.historicalPeriod === selectedPeriod;
      const matchRegion = selectedRegion === 'all' || city.region === selectedRegion;
      const matchSearch =
        !searchQuery.trim() ||
        city.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.modernCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.monuments.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        city.famousScholars.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchPeriod && matchRegion && matchSearch;
    });
  }, [selectedPeriod, selectedRegion, searchQuery]);

  // Filtered Timeline Events
  const filteredEvents = useMemo(() => {
    return HISTORICAL_TIMELINE_EVENTS.filter((ev) => {
      const matchPeriod = selectedPeriod === 'all' || ev.period === selectedPeriod;
      const matchRegion = selectedRegion === 'all' || ev.region === selectedRegion;
      const matchSearch =
        !searchQuery.trim() ||
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.keyFigures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchPeriod && matchRegion && matchSearch;
    }).sort((a, b) => a.gregorianYear - b.gregorianYear);
  }, [selectedPeriod, selectedRegion, searchQuery]);

  // Handlers for Map
  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, z - 0.25));
  const handleResetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCopyLink = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const activePeriodInfo = HISTORICAL_PERIODS.find((p) => p.id === selectedPeriod);

  return (
    <PageWrapper
      title="أطلس التاريخ الإسلامي"
      description="خريطة تفاعلية كبرى وخط زمني شامل لأحداث وحواضر ومعالم التاريخ الإسلامي من العصر النبوي الشريف وحتى العصر الحديث."
      canonicalPath="/history-atlas"
      schemaType="learning"
      breadcrumbs={[
        { label: 'الرئيسية', path: '/' },
        { label: 'أطلس التاريخ الإسلامي', path: '/history-atlas' }
      ]}
    >
      <div className="space-y-8">
        {/* 1. Header Banner */}
        <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
          <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold">
                <Compass className="w-4 h-4" />
                <span>أطلس جغرافي وتاريخي موثق من أمهات المصادر</span>
              </div>
              <h1 className="font-quran text-3xl sm:text-4xl text-gold font-bold">
                أطلس التاريخ الإسلامي التفاعلي
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                استكشف جغرافية الفتوحات، وحواضر العلم الكبرى، والمعارك الفاصلة، ومسارات الهجرة وطريق الحرير العلمي عبر خريطة جغرافية وخط زمني موثق بأصح المراجع الأكاديمية والتاريخية.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 shrink-0 self-stretch md:self-auto">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3.5 border border-gold/30 text-center space-y-1">
                <span className="text-[11px] text-slate-300">الحواضر والمدن</span>
                <p className="text-2xl font-black text-gold">{HISTORICAL_CITIES.length}+</p>
              </div>
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-3.5 border border-gold/30 text-center space-y-1">
                <span className="text-[11px] text-slate-300">الأحداث الموثقة</span>
                <p className="text-2xl font-black text-emerald-400">{HISTORICAL_TIMELINE_EVENTS.length}+</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main View Switcher Tabs & Search Filter Bar */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold/20 pb-4">
            {/* View Switchers */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
              {[
                { id: 'map', label: 'الخريطة الجغرافية التفاعلية', icon: Compass },
                { id: 'timeline', label: 'الخط الزمني للأحداث الكبرى', icon: Clock },
                { id: 'cities', label: 'دليل الحواضر الإسلامية', icon: Landmark },
                { id: 'civilization', label: 'منارات العلوم والحضارة', icon: BookOpen }
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeView === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveView(tab.id as any)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                      isCurrent
                        ? 'royal-gradient text-white border border-gold shadow-sm'
                        : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-gold' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مدينة، معركة، معلم..."
                className="w-full pr-10 pl-3 py-2 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-xs sm:text-sm focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Historical Periods Selector Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedPeriod === 'all'
                  ? 'gold-gradient text-royal shadow-sm'
                  : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
              }`}
            >
              كافة العصور
            </button>

            {HISTORICAL_PERIODS.map((period) => {
              const isSelected = selectedPeriod === period.id;
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'border-gold bg-gold/20 text-royal dark:text-gold shadow-sm'
                      : 'border-transparent bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:border-gold/30'
                  }`}
                >
                  <span>{period.nameAr}</span>
                  <span className="text-[10px] opacity-75 mr-1 font-mono">({period.timeSpanHijri})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. VIEW 1: INTERACTIVE HISTORICAL GEOGRAPHIC MAP */}
        {activeView === 'map' && (
          <div className="space-y-4">
            {/* Map Frame Card */}
            <div className="relative rounded-3xl bg-[#072A20] border-2 border-gold/40 overflow-hidden shadow-2xl">
              {/* Map Floating Controls Header */}
              <div className="absolute top-4 right-4 left-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
                {/* Region Selector Pills */}
                <div className="pointer-events-auto bg-black/60 backdrop-blur-md rounded-2xl p-1.5 border border-gold/30 flex items-center gap-1 overflow-x-auto max-w-full">
                  {GEOGRAPHIC_REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => setSelectedRegion(reg.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-colors ${
                        selectedRegion === reg.id
                          ? 'bg-gold text-royal font-black'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {reg.nameAr}
                    </button>
                  ))}
                </div>

                {/* Zoom & Reset Controls */}
                <div className="pointer-events-auto bg-black/60 backdrop-blur-md rounded-2xl p-1.5 border border-gold/30 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-xl hover:bg-gold/20 text-gold transition-colors"
                    title="تكبير الخريطة"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-xl hover:bg-gold/20 text-gold transition-colors"
                    title="تصغير الخريطة"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMap}
                    className="p-1.5 rounded-xl hover:bg-gold/20 text-gold transition-colors"
                    title="إعادة ضبط الرؤية"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Interactive Vector SVG Map Canvas */}
              <div className="w-full min-h-[480px] sm:min-h-[580px] flex items-center justify-center p-2 relative overflow-hidden">
                <svg
                  viewBox="0 0 1000 600"
                  className="w-full h-auto max-h-[700px] select-none transition-transform duration-300"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0B3026" />
                      <stop offset="100%" stopColor="#051D16" />
                    </radialGradient>
                    <filter id="cityGlow">
                      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Sea & Water Background */}
                  <rect x="0" y="0" width="1000" height="600" fill="url(#waterGrad)" />

                  {/* Generalized Continental Contours (Mediterranean, Middle East, Central Asia, North Africa) */}
                  {/* North Africa & Arabia Peninsula Mass */}
                  <path
                    d="M 50 420 Q 180 400 320 440 T 480 500 T 580 480 Q 640 400 520 330 T 360 300 T 180 320 Z"
                    fill="#0E3D30"
                    stroke="#195543"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />

                  {/* Anatolia, Levant, Mesopotamia & Persia */}
                  <path
                    d="M 400 240 Q 520 220 650 250 T 820 230 Q 880 300 760 380 T 560 340 T 420 300 Z"
                    fill="#0D3B2E"
                    stroke="#195543"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />

                  {/* Iberian Peninsula (Andalusia) */}
                  <path
                    d="M 60 210 Q 140 190 150 250 T 90 290 Z"
                    fill="#0D3B2E"
                    stroke="#195543"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />

                  {/* Mediterranean Water Labeling */}
                  <text x="260" y="270" fill="#2A705E" fontSize="11" fontWeight="bold" letterSpacing="3" opacity="0.6">
                    بحر الروم (البحر الأبيض المتوسط)
                  </text>
                  <text x="500" y="440" fill="#2A705E" fontSize="10" fontWeight="bold" letterSpacing="2" opacity="0.6">
                    بحر القلزم (البحر الأحمر)
                  </text>
                  <text x="660" y="380" fill="#2A705E" fontSize="10" fontWeight="bold" letterSpacing="2" opacity="0.6">
                    الخليج العربي
                  </text>

                  {/* Render Active Historic Routes */}
                  {HISTORICAL_ROUTES.map((route) => {
                    if (activeRouteId && activeRouteId !== route.id) return null;
                    if (route.points.length < 2) return null;

                    const pathString = route.points.reduce((acc, pt, idx) => {
                      const coords = projectGeoToSvg(pt.lat, pt.lng);
                      return idx === 0 ? `M ${coords.x} ${coords.y}` : `${acc} L ${coords.x} ${coords.y}`;
                    }, '');

                    return (
                      <g key={route.id}>
                        <path
                          d={pathString}
                          fill="none"
                          stroke={route.colorHex}
                          strokeWidth="3.5"
                          strokeDasharray="6 4"
                          opacity="0.9"
                          filter="url(#cityGlow)"
                        />
                      </g>
                    );
                  })}

                  {/* Render Cities Markers */}
                  {filteredCities.map((city) => {
                    const coords = projectGeoToSvg(city.coordinates.lat, city.coordinates.lng);
                    const isSelected = selectedCity?.id === city.id;

                    return (
                      <g
                        key={city.id}
                        className="cursor-pointer transition-transform duration-200 hover:scale-125"
                        onClick={() => setSelectedCity(city)}
                      >
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={isSelected ? 9 : 6.5}
                          fill={isSelected ? '#F59E0B' : '#C5A059'}
                          stroke="#FFFFFF"
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          filter="url(#cityGlow)"
                        />

                        {/* City Label */}
                        <text
                          x={coords.x}
                          y={coords.y - 10}
                          fill="#FFFFFF"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          className="drop-shadow-md pointer-events-none select-none"
                        >
                          {city.nameAr}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Route Selector Overlay Bottom */}
                <div className="absolute bottom-4 right-4 left-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="pointer-events-auto bg-black/70 backdrop-blur-md rounded-2xl p-2 border border-gold/30 flex items-center gap-1.5 overflow-x-auto max-w-full">
                    <span className="text-[11px] text-gold font-bold px-2">المسارات التاريخية:</span>
                    {HISTORICAL_ROUTES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setActiveRouteId((prev) => (prev === r.id ? null : r.id))}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                          activeRouteId === r.id
                            ? 'bg-gold text-royal shadow-sm'
                            : 'bg-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {r.nameAr}
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] text-slate-400 bg-black/60 px-3 py-1 rounded-xl pointer-events-auto">
                    انقر على أي مدينة بالخريطة لعرض تفاصيلها التاريخية
                  </span>
                </div>
              </div>
            </div>

            {/* City Detail Drawer Modal */}
            <AnimatePresence>
              {selectedCity && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/40 shadow-2xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                          📍 {selectedCity.modernCountry}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {selectedCity.coordinates.lat.toFixed(2)}° N, {selectedCity.coordinates.lng.toFixed(2)}° E
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-royal dark:text-white mt-1">
                        {selectedCity.nameAr} ({selectedCity.nameEn})
                      </h3>
                      <p className="text-xs text-gold font-semibold">
                        تاريخ التأسيس أو الفتح: {selectedCity.establishedDate}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCity(null)}
                      className="px-3.5 py-1.5 rounded-xl bg-royal/10 dark:bg-white/10 hover:bg-red-500/20 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
                    >
                      إغلاق ✕
                    </button>
                  </div>

                  {/* Summary & Details */}
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                    {selectedCity.roleSummary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Monuments */}
                    <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-2">
                      <h4 className="font-bold text-xs text-royal dark:text-gold flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-gold" />
                        <span>أشهر المعالم الإسلامية:</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {selectedCity.monuments.map((m, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-gold">●</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Historical Events */}
                    <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-2">
                      <h4 className="font-bold text-xs text-royal dark:text-gold flex items-center gap-1.5">
                        <ScrollText className="w-4 h-4 text-gold" />
                        <span>أبرز الأحداث المرتبطة:</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {selectedCity.keyHistoricalEvents.map((ev, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-emerald-500">✓</span>
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Famous Scholars */}
                    <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-2">
                      <h4 className="font-bold text-xs text-royal dark:text-gold flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-gold" />
                        <span>كبار العلماء والمفكرين:</span>
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {selectedCity.famousScholars.map((sch, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="text-gold">✦</span>
                            <span>{sch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Academic Sources */}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-gold/15 pt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span>المصادر والتوثيق الأكاديمي: {selectedCity.academicReferences.join(' • ')}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 4. VIEW 2: CHRONOLOGICAL TIMELINE */}
        {activeView === 'timeline' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-2">
              <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                <span>الخط الزمني الموثق لأحداث التاريخ الإسلامي</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                تسلسل زمني للأحداث الفاصلة من بعثة النبي ﷺ وحتى العصر الحديث مع التحليل الاستراتيجي
              </p>
            </div>

            {/* Timeline Events Stack */}
            <div className="relative border-r-2 border-gold/30 pr-6 mr-3 space-y-8">
              {filteredEvents.map((ev) => (
                <div key={ev.id} className="relative group">
                  {/* Pin Circle on the line */}
                  <div className="absolute -right-[31px] top-1.5 w-4 h-4 rounded-full royal-gradient border-2 border-gold shadow-md group-hover:scale-125 transition-transform" />

                  <div className="glass-panel rounded-2xl p-5 border border-gold/25 space-y-3 hover:border-gold/60 transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                          {ev.hijriYear} هـ ({ev.gregorianYear} م)
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          📍 {ev.cityName}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedEvent(ev)}
                        className="text-xs text-gold hover:underline font-bold"
                      >
                        عرض التفاصيل والمصادر ➔
                      </button>
                    </div>

                    <h3 className="font-black text-base text-royal dark:text-white">
                      {ev.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ev.shortSummary}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gold/15 text-xs text-slate-500 dark:text-slate-400">
                      <strong className="text-royal dark:text-gold">أبرز الشخصيات: </strong>
                      <span>{ev.keyFigures.join('، ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. VIEW 3: CITIES DIRECTORY */}
        {activeView === 'cities' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-2">
              <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-gold" />
                <span>دليل وموسوعة الحواضر والمدن الإسلامية التاريخية</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                استكشف مراكز الإشعاع الحضاري والعلمي في العالم الإسلامي
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCities.map((city) => (
                <div
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className="cursor-pointer glass-panel rounded-2xl p-5 border border-gold/25 hover:border-gold transition-all hover:-translate-y-1 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-base text-royal dark:text-gold">{city.nameAr}</h3>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                        {city.modernCountry}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {city.roleSummary}
                    </p>
                  </div>

                  <div className="border-t border-gold/15 pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">
                      {city.coordinates.lat.toFixed(1)}°N, {city.coordinates.lng.toFixed(1)}°E
                    </span>
                    <span className="text-gold font-bold">استعراض التفاصيل ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. VIEW 4: SCHOLARS & CIVILIZATION ACHIEVEMENTS */}
        {activeView === 'civilization' && (
          <div className="space-y-8">
            <div className="glass-panel rounded-3xl p-6 border border-gold/30 space-y-2">
              <h2 className="text-xl font-bold text-royal dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold" />
                <span>منارات العلوم والحضارة في العصر الذهبي الإسلامي</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                المؤسسات العلمية الكبرى والعلماء الذين غيرت ابتكاراتهم وجه الحضارة الإنسانية
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* House of Wisdom */}
              <div className="glass-panel rounded-3xl p-6 border border-gold/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-royal dark:text-gold">بيت الحكمة ببغداد</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                    العصر العباسي
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  أعظم مجمع علمي ومكتبة ومركز ترجمة في التاريخ الوسيط؛ أسسه هارون الرشيد وازدهر في عهد المأمون، حيث ترجمت فيه أمهات كتب الفلسفة والطب والرياضيات، وانطلقت منه أبحاث الجبر والفلك.
                </p>
                <div className="text-xs font-semibold text-gold pt-2 border-t border-gold/15">
                  أبرز أعلامه: الخوارزمي، حنين بن إسحاق، بنو موسى، الكندي.
                </div>
              </div>

              {/* Al-Qarawiyyin University */}
              <div className="glass-panel rounded-3xl p-6 border border-gold/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-royal dark:text-gold">جامعة القرويين بفاس (859 م)</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-bold">
                    أقدم جامعة بالعالم
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  أسستها السيدة فاطمة الفهرية رحمها الله بمال ورثته من والدها، وتعد حسب تصنيف اليونسكو وموسوعة جينيس أقدم جامعة ما زالت تمنح الشهادات العلمية حتى يومنا هذا، وتخرج منها كبار العلماء والمفكرين.
                </p>
                <div className="text-xs font-semibold text-gold pt-2 border-t border-gold/15">
                  من أشهر روادها: ابن خلدون، ابن رشد، لسان الدين بن الخطيب، الإدريسي.
                </div>
              </div>

              {/* Al-Azhar Mosque & University */}
              <div className="glass-panel rounded-3xl p-6 border border-gold/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-royal dark:text-gold">الجامع الأزهر بالقاهرة (972 م)</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                    قلعة العلوم الشرعية
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  منارة العالم الإسلامي الكبرى في تدريس علوم القرآن والحديث والفقه واللغة العربية، استمر لأكثر من ألف عام في نشر الفكر الإسلامي الوسطي واستقبال الطلاب من كل بقاع الأرض.
                </p>
                <div className="text-xs font-semibold text-gold pt-2 border-t border-gold/15">
                  من كبار علمائه: ابن حجر العسقلاني، جلال الدين السيوطي، ابن دقيق العيد.
                </div>
              </div>

              {/* Great Golden Age Scientists */}
              <div className="glass-panel rounded-3xl p-6 border border-gold/25 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-royal dark:text-gold">رواد العلوم التجريبية المسلمون</h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-500 font-bold">
                    طب • جبر • بصريات
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <li>● <strong>الخوارزمي: </strong>مؤسس علم الجبر ومبتكر الخوارزميات (Algorithms).</li>
                  <li>● <strong>ابن الهيثم: </strong>مؤسس علم البصريات والمكتشف الأول لمبدأ عمل الكاميرا (القمرة).</li>
                  <li>● <strong>الزهراوي: </strong>رائد الجراحة في الأندلس ومبتكر أدوات الجراحة الحديثة.</li>
                  <li>● <strong>ابن سينا: </strong>مؤلف كتاب "القانون في الطب" المرجع الطبي الأول لأوروبا لخمسة قرون.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Event Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-gold/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                  <div>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                      {selectedEvent.hijriYear} هـ ({selectedEvent.gregorianYear} م)
                    </span>
                    <h3 className="text-lg font-black text-royal dark:text-white mt-1">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  <p className="font-semibold bg-royal/5 dark:bg-white/5 p-3 rounded-xl border border-gold/15">
                    {selectedEvent.detailedNarrative}
                  </p>

                  <div className="space-y-1">
                    <strong className="text-royal dark:text-gold">أبرز القادة والشخصيات:</strong>
                    <p className="text-slate-600 dark:text-slate-300">{selectedEvent.keyFigures.join('، ')}</p>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-royal dark:text-gold">النتائج والآثار التاريخية:</strong>
                    <ul className="space-y-1">
                      {selectedEvent.outcomesAndImpact.map((out, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-gold/15">
                    <strong>المصادر المعتمدة: </strong>
                    <span>{selectedEvent.references.join(' • ')}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="px-5 py-2 rounded-xl gold-gradient text-royal font-bold text-xs"
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

