import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Trophy,
  Printer,
  RotateCcw,
  User,
  Calendar,
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import {
  ACADEMY_TRACKS,
  ACADEMY_LEVELS,
  AcademyTrack,
  LessonItem,
  QuizQuestion
} from '../data/academyData';
import { PageWrapper } from '../components/layout/PageWrapper';

interface UserAcademyProgress {
  studentName: string;
  completedLessons: string[]; // lesson ids
  quizScores: Record<string, number>; // quiz/lesson id -> score percentage
  completedTracks: string[]; // track ids
  certificates: {
    trackId: string;
    trackTitle: string;
    issueDate: string;
    score: number;
  }[];
}

const STORAGE_KEY = 'madar_academy_progress_v1';

export const AcademyPage: React.FC = () => {
  const { trackId } = useParams<{ trackId?: string }>();
  const navigate = useNavigate();

  // Local storage state
  const [progress, setProgress] = useState<UserAcademyProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      studentName: 'طالب العلم المبارك',
      completedLessons: [],
      quizScores: {},
      completedTracks: [],
      certificates: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [progress]);

  // Selected level filter
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [showingCertificate, setShowingCertificate] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(progress.studentName);

  // Active track
  const activeTrack = useMemo(() => {
    if (!trackId) return null;
    return ACADEMY_TRACKS.find((t) => t.id === trackId) || null;
  }, [trackId]);

  // Reset quiz state when changing lesson
  useEffect(() => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setShowingCertificate(false);
  }, [trackId, activeLessonIndex]);

  // Filtered tracks for catalog
  const filteredTracks = useMemo(() => {
    if (selectedLevel === 'all') return ACADEMY_TRACKS;
    return ACADEMY_TRACKS.filter((t) => t.level === selectedLevel);
  }, [selectedLevel]);

  const activeLesson = useMemo<LessonItem | null>(() => {
    if (!activeTrack) return null;
    return activeTrack.lessons[activeLessonIndex] || activeTrack.lessons[0] || null;
  }, [activeTrack, activeLessonIndex]);

  // Handle quiz answer
  const handleSelectAnswer = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  // Submit Lesson Quiz
  const handleSubmitQuiz = () => {
    if (!activeLesson) return;
    setQuizSubmitted(true);

    // Calculate score
    let correctCount = 0;
    activeLesson.quiz.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / activeLesson.quiz.length) * 100);

    // If passed (>= 50%) mark lesson completed
    setProgress((prev) => {
      const isAlreadyCompleted = prev.completedLessons.includes(activeLesson.id);
      const nextCompleted = isAlreadyCompleted
        ? prev.completedLessons
        : [...prev.completedLessons, activeLesson.id];

      // Check if all lessons of this track are completed
      let nextTracks = [...prev.completedTracks];
      let nextCertificates = [...prev.certificates];

      if (activeTrack) {
        const allLessonIds = activeTrack.lessons.map((l) => l.id);
        const allDone = allLessonIds.every((id) => nextCompleted.includes(id));
        if (allDone && !nextTracks.includes(activeTrack.id)) {
          nextTracks.push(activeTrack.id);
          nextCertificates.push({
            trackId: activeTrack.id,
            trackTitle: activeTrack.title,
            issueDate: new Date().toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            score: percent
          });
        }
      }

      return {
        ...prev,
        completedLessons: nextCompleted,
        quizScores: { ...prev.quizScores, [activeLesson.id]: percent },
        completedTracks: nextTracks,
        certificates: nextCertificates
      };
    });
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setProgress((prev) => ({ ...prev, studentName: tempName.trim() }));
    }
    setIsEditingName(false);
  };

  return (
    <PageWrapper
      title={activeTrack ? `مسار ${activeTrack.title} | أكاديمية مدار اليقين الشرعية` : 'أكاديمية مدار اليقين للعلوم الشرعية والتعليم التفاعلي'}
      description={activeTrack ? `${activeTrack.description} - المستوى: ${activeTrack.level}، الدروس: ${activeTrack.totalLessons}.` : 'مسارات تعليمية تفاعلية متدرجة في العقيدة، الفقه، التجويد، الحديث، والسيرة مع اختبارات فهم وشهادات إتمام إلكترونية.'}
      canonicalPath={activeTrack ? `/academy/${activeTrack.id}` : '/academy'}
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'الأكاديمية الإسلامية', url: '/academy' },
        ...(activeTrack ? [{ name: activeTrack.title, url: `/academy/${activeTrack.id}` }] : []),
      ]}
      schemaType="LearningResource"
    >
      <div className="py-2 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-gradient-to-br from-[#072A20] via-[#093528] to-[#041a14] border border-gold/30 shadow-2xl text-white">
        <div className="islamic-pattern absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>الأكاديمية الشرعية والتعليم التفاعلي</span>
          </div>
          <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold mb-4 leading-tight">
            أكاديمية مدار اليقين
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            منظومة تعليمية متكاملة تضم عشرة مسارات علمية وتربوية تغطي أساسيات الإسلام، وفقه العبادات، وأحكام التجويد، والسيرة النبوية، والحديث الشريف، مع دروس تفاعلية واختبارات قياس المعرفة وشهادات إتمام تقديرية.
          </p>

          {/* Student Profile Quick Stats */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/15">
              <User className="w-3.5 h-3.5 text-gold" />
              <span>الدارس: {progress.studentName}</span>
              <button
                onClick={() => {
                  setTempName(progress.studentName);
                  setIsEditingName(true);
                }}
                className="text-[11px] text-gold underline mr-1 hover:text-white"
              >
                تعديل
              </button>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/15">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>الدروس المنجزة: {progress.completedLessons.length}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/15">
              <Trophy className="w-3.5 h-3.5 text-gold" />
              <span>الشهادات المكتسبة: {progress.completedTracks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Student Name Modal */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full border border-gold/30 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              تحديد اسم الدارس للشهادة
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              سيظهر هذا الاسم على شهادات الإتمام التقديرية التي تكسبها في الأكاديمية:
            </p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-gold mb-4"
              placeholder="اكتب اسمك الثلاثي الكريم..."
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditingName(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-400"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveName}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-royal text-gold dark:bg-gold dark:text-royal"
              >
                حفظ الاسم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher: Catalog vs Active Track */}
      {!activeTrack ? (
        /* ================= 1. TRACKS CATALOG ================= */
        <div className="space-y-8">
          {/* Level Filter Bar */}
          <div className="flex items-center justify-between gap-4 bg-white/70 dark:bg-slate-900/70 p-4 rounded-2xl border border-gold/20 backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {ACADEMY_LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedLevel === lvl.id
                      ? 'bg-royal text-gold shadow-md dark:bg-gold dark:text-royal'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/10'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 hidden sm:inline font-medium">
              {filteredTracks.length} مسارات تعليمية متاحة
            </span>
          </div>

          {/* Tracks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => {
              const isCompleted = progress.completedTracks.includes(track.id);
              const completedCountInTrack = track.lessons.filter((l) =>
                progress.completedLessons.includes(l.id)
              ).length;
              const percent = Math.round(
                (completedCountInTrack / track.lessons.length) * 100
              );

              return (
                <motion.div
                  key={track.id}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gold/20 shadow-md hover:shadow-xl hover:border-gold/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-royal/10 dark:bg-gold/15 text-royal dark:text-gold border border-gold/25">
                        {track.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {track.level}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 leading-snug">
                      {track.title}
                    </h3>
                    <p className="text-xs text-gold font-semibold mb-3">
                      {track.subtitle}
                    </p>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                      {track.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>نسبة الإنجاز:</span>
                        <span className="font-bold text-gold">{percent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-600 to-gold transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-gold" />
                        {track.totalLessons} دروس تفاعلية
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gold" />
                        {track.estimatedHours} ساعات تقديرية
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/academy/${track.id}`)}
                    className="w-full py-2.5 rounded-xl bg-royal text-gold dark:bg-gold dark:text-royal font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      {isCompleted
                        ? 'مراجعة المسار والشهادة'
                        : percent > 0
                        ? 'متابعة التعلم'
                        : 'بدء دراسة المسار'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= 2. ACTIVE TRACK READER & QUIZ ================= */
        <div className="space-y-8">
          {/* Breadcrumb Back */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/academy')}
              className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:text-royal dark:hover:text-white transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجميع مسارات الأكاديمية</span>
            </button>

            {progress.completedTracks.includes(activeTrack.id) && (
              <button
                onClick={() => setShowingCertificate(!showingCertificate)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25 transition-all"
              >
                <Award className="w-4 h-4" />
                <span>{showingCertificate ? 'إخفاء الشهادة' : 'عرض شهادة الإتمام'}</span>
              </button>
            )}
          </div>

          {/* Certificate Display if requested or finished */}
          <AnimatePresence>
            {showingCertificate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-4 border-gold shadow-2xl relative overflow-hidden text-center max-w-3xl mx-auto"
              >
                <div className="islamic-pattern absolute inset-0 opacity-10 pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto border-2 border-gold mb-2">
                    <Award className="w-8 h-8" />
                  </div>

                  <span className="text-xs uppercase tracking-widest text-gold font-bold">
                    منصة مدار اليقين الإسلامية • الأكاديمية التعليمية
                  </span>

                  <h2 className="font-quran text-3xl sm:text-4xl text-royal dark:text-gold font-bold">
                    شَهَادَةُ إِتْمَامٍ تَقْدِيرِيَّة
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                    تشهد إدارة أكاديمية مدار اليقين بأن الدارس المبارك:
                  </p>

                  <div className="font-quran text-2xl sm:text-3xl text-slate-900 dark:text-white font-bold py-2 border-b-2 border-gold/40 inline-block px-8">
                    {progress.studentName}
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    قد أتم بنجاح واجتهاد متطلبات واختبارات:
                  </p>

                  <div className="text-lg font-bold text-royal dark:text-gold">
                    {activeTrack.title}
                  </div>

                  <div className="pt-6 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-gold/25 mt-6">
                    <div>
                      <span>تاريخ الإتمام: </span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {new Date().toLocaleDateString('ar-SA')}
                      </strong>
                    </div>
                    <div className="flex items-center gap-1.5 text-gold font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>شهادة إلكترونية معتمدة داخلياً</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2 rounded-xl bg-gold text-royal font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-gold/90 transition-all"
                    >
                      <Printer className="w-4 h-4" />
                      <span>طباعة أو حفظ كـ PDF</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lesson Navigator Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {activeTrack.lessons.map((lesson, idx) => {
              const isLessonDone = progress.completedLessons.includes(lesson.id);
              const isActive = idx === activeLessonIndex;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonIndex(idx)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border ${
                    isActive
                      ? 'bg-royal text-gold border-gold shadow-md dark:bg-gold dark:text-royal'
                      : isLessonDone
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-gold/5'
                  }`}
                >
                  {isLessonDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>
                    الدرس {lesson.order}: {lesson.title.substring(0, 24)}...
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Content */}
          {activeLesson && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-gold/25 shadow-xl space-y-8">
              {/* Lesson Header */}
              <div className="pb-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gold mb-1">
                    <span>
                      الدرس {activeLesson.order} من {activeTrack.lessons.length}
                    </span>
                    <span>• {activeLesson.durationMinutes} دقيقة للقراءة</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-quran text-slate-900 dark:text-slate-100">
                    {activeLesson.title}
                  </h2>
                </div>

                {progress.completedLessons.includes(activeLesson.id) && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم اجتياز هذا الدرس</span>
                  </div>
                )}
              </div>

              {/* Objectives */}
              {activeLesson.objectives.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-gold/5 border border-gold/20 space-y-2">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>الأهداف التعليمية للدرس:</span>
                  </h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {activeLesson.objectives.map((obj, oIdx) => (
                      <li key={oIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                {activeLesson.contentParagraphs.map((para, pIdx) => (
                  <p key={pIdx} className="indent-4 text-justify">
                    {para}
                  </p>
                ))}
              </div>

              {/* Key Takeaways */}
              {activeLesson.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/[0.03] border-r-4 border-gold border-y border-l border-gold/20">
                  <h4 className="text-xs font-bold text-royal dark:text-gold mb-2">
                    خلاصة الدرس وثمراته العملية:
                  </h4>
                  <div className="space-y-1.5">
                    {activeLesson.keyTakeaways.map((takeaway, tIdx) => (
                      <div
                        key={tIdx}
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                      >
                        <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Quiz Section */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    <span>اختبار تقييم الفهم واستيعاب الدرس</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {activeLesson.quiz.length} أسئلة اختيارية
                  </span>
                </div>

                <div className="space-y-6">
                  {activeLesson.quiz.map((q, qIdx) => {
                    const chosen = selectedAnswers[q.id];
                    const isAnswered = chosen !== undefined;
                    const isCorrect = isAnswered && chosen === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                      >
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {qIdx + 1}. {q.question}
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = chosen === optIdx;
                            let btnStyle =
                              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle =
                                  'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                              } else if (isSelected && !isCorrect) {
                                btnStyle =
                                  'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300';
                              }
                            } else if (isSelected) {
                              btnStyle =
                                'bg-royal/10 dark:bg-gold/15 border-gold text-royal dark:text-gold font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleSelectAnswer(q.id, optIdx)}
                                className={`text-right p-3 rounded-xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border border-slate-200 dark:border-slate-700">
                            <strong className="text-royal dark:text-gold">
                              التوضيح:
                            </strong>{' '}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Button */}
                <div className="flex items-center justify-between pt-4">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={
                        Object.keys(selectedAnswers).length <
                        activeLesson.quiz.length
                      }
                      className="px-6 py-2.5 rounded-xl bg-royal text-gold dark:bg-gold dark:text-royal font-bold text-xs sm:text-sm shadow-md hover:opacity-90 disabled:opacity-40 transition-all"
                    >
                      تسليم الإجابات واعتماد النتيجة
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة الاختبار</span>
                      </button>

                      {activeLessonIndex < activeTrack.lessons.length - 1 && (
                        <button
                          onClick={() => setActiveLessonIndex((prev) => prev + 1)}
                          className="px-5 py-2 rounded-xl bg-royal text-gold dark:bg-gold dark:text-royal font-bold text-xs flex items-center gap-1.5"
                        >
                          <span>الانتقال للدرس التالي</span>
                          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </PageWrapper>
  );
};

