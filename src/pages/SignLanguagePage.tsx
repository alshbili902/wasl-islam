import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartHandshake,
  BookOpen,
  Sparkles,
  Compass,
  Users,
  Shield,
  Search,
  Play,
  CheckCircle2,
  Award,
  Eye,
  Maximize2,
  Bookmark,
  Copy,
  Check,
  Type,
  SunMedium,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Video
} from 'lucide-react';
import { SIGN_LANGUAGE_CATEGORIES, SIGN_LANGUAGE_LESSONS } from '../data/signLanguageData';
import { SignLanguageLesson } from '../types/quranLearning';

const STORAGE_KEY = 'madar_sign_language_progress';

export const SignLanguagePage: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLessonId, setActiveLessonId] = useState<string>(SIGN_LANGUAGE_LESSONS[0]?.id || '');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [fontSizeClass, setFontSizeClass] = useState<'text-base' | 'text-lg' | 'text-xl'>('text-base');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedScripture, setCopiedScripture] = useState<boolean>(false);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState<number>(0);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
    } catch (e) {
      console.error('Failed to save sign language progress', e);
    }
  }, [completedLessons]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return SIGN_LANGUAGE_LESSONS.filter(lesson => {
      const matchesCategory = selectedCategoryId === 'all' || lesson.categoryId === selectedCategoryId;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        lesson.titleAr.toLowerCase().includes(query) ||
        lesson.subtitleAr.toLowerCase().includes(query) ||
        lesson.descriptionAr.toLowerCase().includes(query) ||
        lesson.keySignsExplained.some(k => k.signTitle.toLowerCase().includes(query) || k.movementGuide.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, searchQuery]);

  // Current active lesson
  const currentLesson = useMemo(() => {
    return SIGN_LANGUAGE_LESSONS.find(l => l.id === activeLessonId) || filteredLessons[0] || SIGN_LANGUAGE_LESSONS[0];
  }, [activeLessonId, filteredLessons]);

  const toggleLessonCompleted = (id: string) => {
    setCompletedLessons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCopyScripture = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScripture(true);
    setTimeout(() => setCopiedScripture(false), 2000);
  };

  const progressPercentage = Math.round((completedLessons.length / SIGN_LANGUAGE_LESSONS.length) * 100);

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      highContrast 
        ? 'bg-black text-amber-300 select-auto' 
        : 'bg-[#F8FAF9] dark:bg-[#0B131E] text-slate-800 dark:text-slate-100'
    }`}>
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#072A20] via-[#0D382B] to-[#072A20] text-white py-12 md:py-16 border-b border-gold/20">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>مركز التعليم الإسلامي الميسر للصم وضعاف السمع</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                مركز التعليم الإسلامي <span className="text-gold">بلغة الإشارة</span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                منصة مرئية متكاملة لتعليم أصول الدين، وأحكام الطهارة والصلاة، ومعاني قصار السور والأذكار، بلغة الإشارة السعودية المعتمدة والموثقة من قبل نخبة من المترجمين المعتمدين.
              </p>
            </div>

            {/* Accessibility & Stats Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">إنجازك في التعلم:</span>
                <span className="text-xs font-bold text-gold">{completedLessons.length} من {SIGN_LANGUAGE_LESSONS.length} درس ({progressPercentage}%)</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gold h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Accessibility toggles */}
              <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setHighContrast(!highContrast)}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
                    highContrast ? 'bg-amber-400 text-black shadow-md' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="تبديل وضع التباين العالي للصم وضعاف البصر"
                >
                  <SunMedium className="w-3.5 h-3.5" />
                  <span>تباين عالٍ</span>
                </button>

                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg">
                  <Type className="w-3 h-3 text-slate-300 ml-1" />
                  <button
                    type="button"
                    onClick={() => setFontSizeClass('text-base')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSizeClass === 'text-base' ? 'bg-gold text-royal font-black' : 'text-slate-300'}`}
                  >
                    عادي
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSizeClass('text-lg')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSizeClass === 'text-lg' ? 'bg-gold text-royal font-black' : 'text-slate-300'}`}
                  >
                    كبير
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSizeClass('text-xl')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${fontSizeClass === 'text-xl' ? 'bg-gold text-royal font-black' : 'text-slate-300'}`}
                  >
                    ضخم
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

        {/* Verification and Legal Banner */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          highContrast 
            ? 'bg-zinc-900 border-amber-400/50' 
            : 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-500/20 text-emerald-900 dark:text-emerald-100'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                <span>لغة الإشارة السعودية المعتمدة - تدقيق شرعي وتربوي موثق</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-extrabold border border-emerald-500/30">
                  معتمد 100%
                </span>
              </h2>
              <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">
                جميع الإشارات والدروس المسجلة في هذا المركز مستنبطة من المعجم الإشاري الإسلامي السعودي المعتمد وتحت إشراف مترجمين مرخصين من الجمعية السعودية لمترجمي لغة الإشارة.
              </p>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gold" />
              <span>أقسام ومسارات التعلم الإشاري:</span>
            </h2>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الإشارات والدروس..."
                className={`w-full pr-9 pl-4 py-2 text-xs rounded-xl border transition-all outline-none ${
                  highContrast 
                    ? 'bg-zinc-900 border-amber-400 text-amber-300 placeholder:text-zinc-500' 
                    : 'bg-white dark:bg-[#0E1726] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:border-gold'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategoryId === 'all'
                  ? 'gold-gradient text-royal shadow-md font-black'
                  : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-gold'
              }`}
            >
              <span>كافة الدروس</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                {SIGN_LANGUAGE_LESSONS.length}
              </span>
            </button>

            {SIGN_LANGUAGE_CATEGORIES.map(cat => {
              const count = SIGN_LANGUAGE_LESSONS.filter(l => l.categoryId === cat.id).length;
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'gold-gradient text-royal shadow-md font-black'
                      : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-gold'
                  }`}
                >
                  <span>{cat.titleAr}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Description Banner */}
        {selectedCategoryId !== 'all' && (
          <div className="p-4 rounded-xl bg-gold/10 border border-gold/20 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {SIGN_LANGUAGE_CATEGORIES.find(c => c.id === selectedCategoryId)?.descriptionAr}
            </p>
          </div>
        )}

        {/* Main Workspace: Active Video & Lesson Viewer + Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Center (7 cols): Main Video Viewer & Step-by-Step Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Video Box */}
            <div className={`rounded-3xl border overflow-hidden shadow-lg transition-all ${
              highContrast 
                ? 'bg-zinc-900 border-amber-400' 
                : 'bg-white dark:bg-[#0E1726] border-slate-200 dark:border-slate-800'
            }`}>
              
              {/* Responsive 16:9 Video Container */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                {currentLesson ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.titleAr}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-slate-400 text-center p-8">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <span>اختر درساً لمشاهدة لغة الإشارة</span>
                  </div>
                )}
              </div>

              {/* Video Control Bar */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gold/20 text-gold border border-gold/30">
                        {currentLesson?.signLanguageVariant}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {currentLesson?.durationLabel}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                      {currentLesson?.titleAr}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentLesson?.subtitleAr}
                    </p>
                  </div>

                  {/* Complete Button */}
                  <button
                    type="button"
                    onClick={() => currentLesson && toggleLessonCompleted(currentLesson.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                      currentLesson && completedLessons.includes(currentLesson.id)
                        ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {currentLesson && completedLessons.includes(currentLesson.id) ? 'تم إتقان الدرس' : 'تحديد كمكتمل'}
                    </span>
                  </button>
                </div>

                {/* Interpreter Card */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold">
                      {currentLesson?.interpreterName.charAt(2) || 'أ'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        المترجم: {currentLesson?.interpreterName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {currentLesson?.interpreterCredential}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold border border-emerald-500/20">
                    {currentLesson?.reviewStatusLabelAr}
                  </span>
                </div>

                {/* Synchronized Arabic Captions / Subtitles with Click-to-read */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-gold" />
                    <span>النصوص التفسيرية المصاحبة للحركة (المكتوبة للصم):</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentLesson?.captionsArabic.map((cap, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          idx === activeCaptionIndex
                            ? 'bg-gold/15 border-gold/50 font-bold text-slate-900 dark:text-white'
                            : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 hover:border-gold/30'
                        }`}
                        onClick={() => setActiveCaptionIndex(idx)}
                      >
                        <div className="flex items-center justify-between gap-2 text-[10px] text-gold font-mono mb-1">
                          <span>الدقيقة {Math.floor(cap.timeSec / 60)}:{(cap.timeSec % 60).toString().padStart(2, '0')}</span>
                          {idx === activeCaptionIndex && <span>(النص الحالي)</span>}
                        </div>
                        <p className={fontSizeClass}>{cap.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Key Signs Movement Breakdown Guide */}
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
              highContrast 
                ? 'bg-zinc-900 border-amber-400' 
                : 'bg-white dark:bg-[#0E1726] border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  الدليل التشريحي لحركات اليدين والإشارات الرئيسية:
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تفصيل دقيق لوضعية الأصابع واتجاه الكف وحركة اليد في هذا الدرس لتسهيل المحاكاة الصحيحة.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {currentLesson?.keySignsExplained.map((sign, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-gold/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sign.signTitle}
                      </h4>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">وضعية اليد والأصابع:</span>
                        <p className={`text-slate-700 dark:text-slate-300 leading-relaxed ${fontSizeClass}`}>
                          {sign.handPosition}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-gold block">مسار الحركة والمعنى:</span>
                        <p className={`text-slate-700 dark:text-slate-300 leading-relaxed ${fontSizeClass}`}>
                          {sign.movementGuide}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Scripture Card */}
            {currentLesson?.relatedScripture && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900/10 via-gold/10 to-transparent border border-gold/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-gold">
                    <Bookmark className="w-4 h-4" />
                    <span>
                      {currentLesson.relatedScripture.type === 'ayah' ? 'الآية القرآنية المرتبطة بالإشارة:' : 'الحديث النبوي الشريف المرتبط:'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyScripture(currentLesson.relatedScripture!.text)}
                    className="text-xs text-slate-500 hover:text-gold flex items-center gap-1 transition-colors"
                  >
                    {copiedScripture ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScripture ? 'تم النسخ' : 'نسخ النص'}</span>
                  </button>
                </div>

                <p className={`font-quran leading-loose text-slate-800 dark:text-slate-100 ${fontSizeClass}`}>
                  « {currentLesson.relatedScripture.text} »
                </p>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                  المصدر: {currentLesson.relatedScripture.source}
                </span>
              </div>
            )}

          </div>

          {/* Right Column (4 cols): Playlist & Lesson Directory */}
          <div className="lg:col-span-4 space-y-4">
            <div className={`p-5 rounded-3xl border shadow-sm space-y-4 ${
              highContrast 
                ? 'bg-zinc-900 border-amber-400' 
                : 'bg-white dark:bg-[#0E1726] border-slate-200 dark:border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Video className="w-4 h-4 text-gold" />
                  <span>قائمة الدروس ({filteredLessons.length}):</span>
                </h3>
                <span className="text-xs text-slate-400">
                  انقر للمشاهدة
                </span>
              </div>

              {filteredLessons.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  لا توجد دروس مطابقة لبحثك في هذا القسم
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredLessons.map((lesson) => {
                    const isSelected = lesson.id === currentLesson?.id;
                    const isCompleted = completedLessons.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setActiveCaptionIndex(0);
                        }}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gold/15 border-gold shadow-md'
                            : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:border-gold/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <h4 className={`text-xs font-bold leading-snug ${isSelected ? 'text-gold' : 'text-slate-800 dark:text-slate-200'}`}>
                              {lesson.titleAr}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {lesson.subtitleAr}
                            </p>
                          </div>

                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lesson.durationLabel}
                          </span>
                          <span>{lesson.interpreterName}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Tips for Deaf Community */}
            <div className="p-5 rounded-3xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-gold" />
                <span>إرشادات للتعلم الذاتي الفعّال:</span>
              </h4>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
                <li>شاهد الدرس كاملاً أولاً دون محاولة تقليده لفهم الفكرة الكلية.</li>
                <li>قِف أمام مرآة وحاكي حركة اليدين مع مراعاة سرعة الحركة وثبات الأصابع.</li>
                <li>اقرأ النص التفسيري المصاحب لربط المعنى الشرعي بالحركة الإشارية.</li>
                <li>استعن بوضع التباين العالي إذا كانت الإضاءة المحيطة غير كافية.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SignLanguagePage;

