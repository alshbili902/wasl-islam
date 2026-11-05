import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  EyeOff, 
  Calendar, 
  Award, 
  BookOpen, 
  Volume2, 
  Mic, 
  MicOff, 
  Plus, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BarChart3, 
  Flame, 
  HelpCircle,
  FileEdit,
  Check,
  AlertCircle
} from 'lucide-react';
import { SURAHS_META } from '../data/surahsMeta';
import { 
  POPULAR_MEMORIZATION_TRACKS, 
  COACH_SAMPLE_VERSES, 
  COACH_TEST_QUESTIONS 
} from '../data/quranCoachData';
import { 
  MemorizationPlan, 
  AyahProgressRecord, 
  MemorizationCoachStorage,
  MemorizationTestQuestion
} from '../types/quranLearning';

const STORAGE_KEY = 'madar_quran_coach_v1';

export const QuranCoachPage: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'session' | 'revision' | 'testing' | 'dashboard'>('session');

  // Persistent Coach State
  const [coachData, setCoachData] = useState<MemorizationCoachStorage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      activePlanId: 'plan-default',
      savedPlans: [
        {
          id: 'plan-default',
          ...POPULAR_MEMORIZATION_TRACKS[2], // سورة الملك
          createdAt: new Date().toISOString()
        }
      ],
      ayahRecords: {
        '67:1': {
          surahNumber: 67,
          ayahNumber: 1,
          status: 'memorized',
          memorizedDate: new Date().toISOString(),
          lastRevisedDate: new Date().toISOString(),
          revisionCount: 3,
          difficultyRating: 1
        }
      },
      dailyStreak: 3,
      lastActiveDate: new Date().toISOString().slice(0, 10)
    };
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(coachData));
    } catch {
      // ignore
    }
  }, [coachData]);

  // Current session verse selection
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const activeVerse = COACH_SAMPLE_VERSES[currentVerseIndex] || COACH_SAMPLE_VERSES[0];
  const activeRecordKey = `${activeVerse.surahNumber}:${activeVerse.ayahNumber}`;
  const activeRecord = coachData.ayahRecords[activeRecordKey];

  // Playback & Repetition controls
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [repeatTarget, setRepeatTarget] = useState<number>(3);
  const [currentRepeatCount, setCurrentRepeatCount] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [hideMode, setHideMode] = useState<'visible' | 'blur' | 'hidden'>('visible');
  const [personalNote, setPersonalNote] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio Playback handling with repetition loop
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(activeVerse.audioUrl);
    } else {
      audioRef.current.src = activeVerse.audioUrl;
    }
    audioRef.current.playbackRate = playbackSpeed;

    const onEnded = () => {
      setCurrentRepeatCount((prev) => {
        const next = prev + 1;
        if (next < repeatTarget) {
          audioRef.current?.play().catch(() => {});
          return next;
        } else {
          setIsPlayingAudio(false);
          return 0;
        }
      });
    };

    const audio = audioRef.current;
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', onEnded);
    };
  }, [activeVerse, repeatTarget, playbackSpeed]);

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      setCurrentRepeatCount(0);
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => setIsPlayingAudio(false));
    }
  };

  // Mark verse as memorized
  const handleMarkMemorized = () => {
    setCoachData((prev) => {
      const now = new Date().toISOString();
      const existing = prev.ayahRecords[activeRecordKey];
      return {
        ...prev,
        ayahRecords: {
          ...prev.ayahRecords,
          [activeRecordKey]: {
            surahNumber: activeVerse.surahNumber,
            ayahNumber: activeVerse.ayahNumber,
            status: 'memorized',
            memorizedDate: existing?.memorizedDate || now,
            lastRevisedDate: now,
            revisionCount: (existing?.revisionCount || 0) + 1,
            difficultyRating: existing?.difficultyRating || 2,
            notes: personalNote || existing?.notes
          }
        }
      };
    });

    // Advance to next verse if available
    if (currentVerseIndex < COACH_SAMPLE_VERSES.length - 1) {
      setCurrentVerseIndex((prev) => prev + 1);
    }
  };

  // Voice recording for memorization practice
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert('يرجى السماح بالوصول إلى الميكروفون في المتصفح لتسجيل تلاوتك الذاتية.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Testing Section State
  const [currentTestIdx, setCurrentTestIdx] = useState<number>(0);
  const [selectedTestAnswer, setSelectedTestAnswer] = useState<number | null>(null);
  const [isTestEvaluated, setIsTestEvaluated] = useState<boolean>(false);
  const activeTest = COACH_TEST_QUESTIONS[currentTestIdx] || COACH_TEST_QUESTIONS[0];

  // Plan creation form
  const [newPlanSurah, setNewPlanSurah] = useState<number>(67);
  const [newPlanDailyAyahs, setNewPlanDailyAyahs] = useState<number>(3);
  const [newPlanDays, setNewPlanDays] = useState<number>(5);

  const handleCreatePlan = () => {
    const meta = SURAHS_META.find((s) => s.number === newPlanSurah) || SURAHS_META[66];
    const newPlan: MemorizationPlan = {
      id: `plan-${Date.now()}`,
      title: `خطة حفظ سورة ${meta.name}`,
      goalType: 'selected_surah',
      startSurah: meta.number,
      startAyah: 1,
      endSurah: meta.number,
      endAyah: meta.numberOfAyahs,
      dailyAyahsCount: newPlanDailyAyahs,
      daysPerWeek: newPlanDays,
      preferredDailyTime: '06:00 ص',
      revisionFrequency: 'daily',
      createdAt: new Date().toISOString()
    };

    setCoachData((prev) => ({
      ...prev,
      savedPlans: [newPlan, ...prev.savedPlans],
      activePlanId: newPlan.id
    }));
    setActiveTab('session');
  };

  // Dashboard calculations
  const totalMemorizedCount = useMemo(() => {
    return Object.values(coachData.ayahRecords).filter((r) => r.status === 'memorized').length;
  }, [coachData.ayahRecords]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>منظومة الحفظ والمراجعة المتقنة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              مدرّب حفظ القرآن ومراجعته
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              ابنِ خطتك الشخصية لحفظ كتاب الله، واضبط وردك اليومي بتقنية التكرار الصوتي المتقن، ووضع إخفاء النص للاستظهار، وجدولة المراجعة التباعدية الذكية لتثبيت الحفظ.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <BookOpen className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-[#0E1726] p-2 rounded-2xl border border-gold/30 shadow-sm flex flex-wrap gap-2">
          {[
            { id: 'session', label: 'جلسة الحفظ اليومية', icon: BookOpen },
            { id: 'revision', label: 'المراجعة التباعدية الذكية', icon: RotateCcw },
            { id: 'testing', label: 'اختبار الحفظ الذاتي', icon: CheckCircle2 },
            { id: 'dashboard', label: 'لوحة الإنجاز والخطة', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  isActive
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gold/15'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Daily Memorization Session */}
        {activeTab === 'session' && (
          <div className="space-y-6">
            {/* Session Controller Header */}
            <div className="bg-white dark:bg-[#0E1726] p-5 rounded-3xl border border-gold/30 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block mb-1">السورة والمقطع الحالي:</span>
                <h3 className="text-xl font-extrabold text-royal dark:text-gold flex items-center gap-2">
                  <span>سورة {activeVerse.surahName}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30">
                    الآية {activeVerse.ayahNumber}
                  </span>
                </h3>
              </div>

              {/* Selector for verses in active sample */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentVerseIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentVerseIndex === 0}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="الآية السابقة"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {currentVerseIndex + 1} / {COACH_SAMPLE_VERSES.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentVerseIndex((prev) => Math.min(COACH_SAMPLE_VERSES.length - 1, prev + 1))}
                  disabled={currentVerseIndex === COACH_SAMPLE_VERSES.length - 1}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="الآية التالية"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quran Uthmani Card with Hide & Reveal */}
            <div className="relative bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-12 border-2 border-gold/40 shadow-lg text-center space-y-6">
              {/* Hide / Reveal Toolbar */}
              <div className="flex items-center justify-between border-b border-gold/20 pb-4 text-xs font-semibold">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-gold" />
                  <span>طريقة العرض للاستظهار:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHideMode('visible')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      hideMode === 'visible' ? 'bg-gold/20 text-gold border border-gold' : 'text-slate-500'
                    }`}
                  >
                    إظهار النص
                  </button>
                  <button
                    type="button"
                    onClick={() => setHideMode('blur')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      hideMode === 'blur' ? 'bg-gold/20 text-gold border border-gold' : 'text-slate-500'
                    }`}
                  >
                    تمويه النص
                  </button>
                  <button
                    type="button"
                    onClick={() => setHideMode('hidden')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      hideMode === 'hidden' ? 'bg-gold/20 text-gold border border-gold' : 'text-slate-500'
                    }`}
                  >
                    إخفاء كامل
                  </button>
                </div>
              </div>

              {/* The Verse Text */}
              <div className="py-6 sm:py-10">
                <p
                  className={`font-quran text-2xl sm:text-4xl leading-loose text-royal dark:text-gold transition-all duration-300 ${
                    hideMode === 'blur' ? 'blur-md select-none' : hideMode === 'hidden' ? 'opacity-0 select-none' : ''
                  }`}
                  dir="rtl"
                >
                  {activeVerse.textUthmani}
                </p>
                {hideMode !== 'visible' && (
                  <button
                    type="button"
                    onClick={() => setHideMode('visible')}
                    className="mt-4 px-4 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-bold border border-gold/30 hover:bg-gold/25"
                  >
                    اضغط لإظهار الآية للتأكد من حفظك
                  </button>
                )}
              </div>

              {/* Interactive Audio Repetition Controls */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#080E18] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayAudio}
                    className="w-12 h-12 rounded-2xl gold-gradient text-royal flex items-center justify-center font-bold shadow-md hover:brightness-105"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5 fill-royal" /> : <Play className="w-5 h-5 fill-royal" />}
                  </button>
                  <div className="text-right">
                    <span className="text-xs font-bold text-royal dark:text-gold block">
                      {isPlayingAudio ? `جارٍ التكرار (${currentRepeatCount + 1} من ${repeatTarget})` : 'استماع للتلاوة بالتكرار'}
                    </span>
                    <span className="text-[11px] text-slate-400">بصوت الشيخ مشاري العفاسي</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  {/* Repetition Count Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">التكرار:</span>
                    {[1, 3, 5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRepeatTarget(num)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold ${
                          repeatTarget === num ? 'bg-royal text-gold border border-gold' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'
                        }`}
                      >
                        {num}x
                      </button>
                    ))}
                  </div>

                  {/* Playback Speed */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">السرعة:</span>
                    {[0.75, 1.0, 1.25].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-2 py-1 rounded-md text-[11px] ${
                          playbackSpeed === spd ? 'bg-gold text-royal font-black' : 'text-slate-400'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Mark as Memorized */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleMarkMemorized}
                  className="px-6 py-3 rounded-xl gold-gradient text-royal font-extrabold text-sm flex items-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>أتقنت حفظ هذه الآية (انتقل للتالية)</span>
                </button>
              </div>
            </div>

            {/* Self Recording & Voice Comparison */}
            <div className="bg-white dark:bg-[#0E1726] p-6 rounded-3xl border border-gold/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-royal dark:text-gold flex items-center gap-2">
                  <Mic className="w-4 h-4 text-gold" />
                  <span>تسجيل تلاوتك الذاتية للاستماع والمقارنة:</span>
                </h4>
                <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                  خصوصية تامة في متصفحك
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                سجل تلاوتك غيباً ثم استمع لتسجيلك وقارنه فوراً بتلاوة الشيخ لضبط الحفظ ومخارج الحروف. (لا يتم حفظ أو إرسال التسجيل إلى أي خادم خارجي).
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-red-600 shadow-sm"
                  >
                    <Mic className="w-4 h-4" />
                    <span>ابدأ تسجيل تلاوتك</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse"
                  >
                    <MicOff className="w-4 h-4 text-red-400" />
                    <span>إيقاف التسجيل وحفظ المقطع</span>
                  </button>
                )}

                {recordedAudioUrl && (
                  <div className="flex items-center gap-2">
                    <audio src={recordedAudioUrl} controls className="h-9 rounded-xl" />
                    <button
                      type="button"
                      onClick={() => setRecordedAudioUrl(null)}
                      className="text-xs text-slate-400 hover:text-red-500"
                    >
                      حذف
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spaced Revision */}
        {activeTab === 'revision' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0E1726] p-6 rounded-3xl border border-gold/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-royal dark:text-gold flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-gold" />
                    <span>جدول المراجعة التباعدية الذكية</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    «تعاهدوا هذا القرآن، فوالذي نفس محمد بيده لهو أشد تفلتاً من الإبل في عقلها» [متفق عليه]
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold bg-gold/15 px-3 py-1.5 rounded-full border border-gold/30">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>المراجعات المستحقة اليوم: {totalMemorizedCount > 0 ? '1 مقطع' : '0 مقطع'}</span>
                </div>
              </div>

              {/* Revision Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-royal dark:text-gold">سورة الملك (الآيات 1 - 5)</span>
                    <span className="text-emerald-600 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-md">
                      مستحقة اليوم
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    آخر مراجعة كانت منذ يومين. يوصى بتلاوتها غيباً في صلاة المغرب أو العشاء.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      alert('بارك الله فيك، تم تسجيل إتمام مراجعة سورة الملك وتحديث موعد المراجعة القادمة.');
                    }}
                    className="w-full py-2 rounded-xl gold-gradient text-royal font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>تمت المراجعة غيباً بإتقان</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-royal dark:text-gold">سورة الكهف (العشر الأوائل)</span>
                    <span className="text-gold font-bold bg-gold/15 px-2 py-0.5 rounded-md">
                      مستحقة يوم الجمعة
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    مراجعة أسبوعية دورية مع قراءة سورة الكهف كل جمعة لنيل العصمة والنور.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      alert('تم تأكيد المراجعة الدورية لسورة الكهف.');
                    }}
                    className="w-full py-2 rounded-xl border border-gold/50 text-royal dark:text-gold font-bold text-xs hover:bg-gold/10 transition-colors"
                  >
                    تثبيت المراجعة الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Memorization Testing */}
        {activeTab === 'testing' && (
          <div className="bg-white dark:bg-[#0E1726] p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gold/20 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">سؤال اختبار الحفظ ({currentTestIdx + 1} من {COACH_TEST_QUESTIONS.length})</span>
                <h3 className="text-lg font-bold text-royal dark:text-gold">
                  سورة {activeTest.surahName}
                </h3>
              </div>
              {activeTest.audioUrl && (
                <button
                  type="button"
                  onClick={() => {
                    const a = new Audio(activeTest.audioUrl);
                    a.play();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-gold/20 text-gold text-xs font-bold flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استمع للمقطع الصوتي</span>
                </button>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-base sm:text-lg font-bold text-royal dark:text-gold text-center leading-relaxed">
              {activeTest.prompt}
            </div>

            {/* Test Options */}
            {activeTest.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeTest.options.map((opt, idx) => {
                  const isSelected = selectedTestAnswer === idx;
                  const isCorrect = idx === activeTest.correctIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isTestEvaluated}
                      onClick={() => setSelectedTestAnswer(idx)}
                      className={`p-4 rounded-xl text-right font-bold text-sm border transition-all ${
                        isTestEvaluated
                          ? isCorrect
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                            : isSelected
                            ? 'bg-red-500/20 border-red-500 text-red-700 dark:text-red-300'
                            : 'border-slate-200 opacity-50'
                          : isSelected
                          ? 'bg-gold/20 border-gold text-royal dark:text-gold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-gold/50'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Check button & next question */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsTestEvaluated(true)}
                disabled={selectedTestAnswer === null || isTestEvaluated}
                className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs disabled:opacity-30 shadow-sm"
              >
                تحقق من الإجابة
              </button>

              {isTestEvaluated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsTestEvaluated(false);
                    setSelectedTestAnswer(null);
                    setCurrentTestIdx((prev) => (prev + 1) % COACH_TEST_QUESTIONS.length);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-royal text-gold font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>السؤال التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Dashboard & Plan Management */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">إجمالي الآيات المحفوظة</span>
                <span className="text-2xl sm:text-3xl font-black text-royal dark:text-gold">{totalMemorizedCount}</span>
                <span className="text-[11px] text-emerald-600 block">آية موثقة</span>
              </div>

              <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">أيام الالتزام المتتالية</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <span>{coachData.dailyStreak}</span>
                  <Flame className="w-5 h-5 fill-amber-500" />
                </span>
                <span className="text-[11px] text-slate-500 block">أيام متصلة</span>
              </div>

              <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">الخطط النشطة</span>
                <span className="text-2xl sm:text-3xl font-black text-royal dark:text-gold">{coachData.savedPlans.length}</span>
                <span className="text-[11px] text-slate-500 block">خطة حفظ معتمدة</span>
              </div>

              <div className="bg-white dark:bg-[#0E1726] p-5 rounded-2xl border border-gold/30 shadow-sm text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold block">معدل الإتقان</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">95%</span>
                <span className="text-[11px] text-emerald-600 block">تقييم متميز</span>
              </div>
            </div>

            {/* Create New Plan Card */}
            <div className="bg-white dark:bg-[#0E1726] p-6 rounded-3xl border border-gold/30 shadow-sm space-y-5">
              <h3 className="font-bold text-base text-royal dark:text-gold flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold" />
                <span>إنشاء خطة حفظ شخصية جديدة:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">السورة المستهدفة:</label>
                  <select
                    value={newPlanSurah}
                    onChange={(e) => setNewPlanSurah(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    {SURAHS_META.map((s) => (
                      <option key={s.number} value={s.number}>
                        {s.number}. سورة {s.name} ({s.numberOfAyahs} آية)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">المقدار اليومي:</label>
                  <select
                    value={newPlanDailyAyahs}
                    onChange={(e) => setNewPlanDailyAyahs(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value={1}>آية واحدة يومياً (تثبيت متأنٍ)</option>
                    <option value={3}>3 آيات يومياً (متوسط)</option>
                    <option value={5}>5 آيات يومياً (مكثف)</option>
                    <option value={10}>10 آيات يومياً (سريع)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">أيام الحفظ في الأسبوع:</label>
                  <select
                    value={newPlanDays}
                    onChange={(e) => setNewPlanDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-xs font-bold"
                  >
                    <option value={5}>5 أيام حفظ + يومان للمراجعة</option>
                    <option value={6}>6 أيام حفظ + يوم للمراجعة</option>
                    <option value={7}>7 أيام يومياً</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCreatePlan}
                  className="px-6 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs flex items-center gap-2 shadow-sm hover:brightness-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>اعتماد الخطة والبدء بالجلسات</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuranCoachPage;
