import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Heart,
  Star,
  Award,
  Gamepad2,
  ScrollText,
  Volume2,
  CheckCircle2,
  RotateCcw,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Smile,
  LogOut,
  Info,
  Crown,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import {
  ARABIC_ALPHABET_QURANIC,
  SHORT_SURAHS_LESSONS,
  ISLAMIC_PILLARS_KIDS,
  KIDS_MANNERS_DATA,
  WUDU_STEPS_KIDS,
  KIDS_QUIZ_QUESTIONS,
  KIDS_MEMORY_PAIRS,
  KIDS_STORIES_DATA,
  KIDS_BADGES_DATA
} from '../data/kidsData';
import { KidsCategory, KidsProgressState, ArabicLetter, ShortSurahLesson } from '../types/kids';

const KIDS_STORAGE_KEY = 'madar_kids_progress_v1';

export const KidsPage: React.FC = () => {
  // Navigation Section
  const [activeTab, setActiveTab] = useState<KidsCategory>('quran');

  // Child Progress State
  const [progress, setProgress] = useState<KidsProgressState>(() => {
    try {
      const saved = localStorage.getItem(KIDS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      childNickname: 'البطل الصغير',
      totalStars: 15,
      completedSurahs: [1],
      completedQuizzes: [],
      completedStories: [],
      unlockedBadgeIds: ['b_fatihah'],
      wuduStepsCompleted: false,
      prayerStepsCompleted: false
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(KIDS_STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Parents Modal & Certificate Modal
  const [showParentsModal, setShowParentsModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(progress.childNickname);

  // Selected Letter in Alphabet
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter>(ARABIC_ALPHABET_QURANIC[0]);

  // Selected Surah in Quran
  const [selectedSurah, setSelectedSurah] = useState<ShortSurahLesson>(SHORT_SURAHS_LESSONS[0]);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizStarsEarnedThisRound, setQuizStarsEarnedThisRound] = useState(0);

  // Memory Game State
  const [memoryCards, setMemoryCards] = useState(() => {
    const list = KIDS_MEMORY_PAIRS.flatMap((p) => [
      { id: `${p.id}_front`, pairKey: p.pairKey, text: p.frontText, isFront: true },
      { id: `${p.id}_back`, pairKey: p.pairKey, text: p.backText, isFront: false }
    ]);
    return list.sort(() => Math.random() - 0.5);
  });
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Selected Story
  const [selectedStoryId, setSelectedStoryId] = useState(KIDS_STORIES_DATA[0].id);
  const activeStory = KIDS_STORIES_DATA.find((s) => s.id === selectedStoryId) || KIDS_STORIES_DATA[0];

  // Handlers for Quiz
  const currentQuiz = KIDS_QUIZ_QUESTIONS[currentQuizIndex];

  const handleSelectQuizOption = (index: number) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(index);
    setQuizSubmitted(true);

    if (index === currentQuiz.correctIndex) {
      const starsToAdd = currentQuiz.starsAwarded || 5;
      setQuizStarsEarnedThisRound((prev) => prev + starsToAdd);
      setProgress((prev) => ({
        ...prev,
        totalStars: prev.totalStars + starsToAdd,
        completedQuizzes: Array.from(new Set([...prev.completedQuizzes, currentQuiz.id])),
        unlockedBadgeIds: Array.from(new Set([...prev.unlockedBadgeIds, 'b_quiz']))
      }));
    }
  };

  const handleNextQuiz = () => {
    setQuizSelectedOption(null);
    setQuizSubmitted(false);
    setCurrentQuizIndex((prev) => (prev + 1) % KIDS_QUIZ_QUESTIONS.length);
  };

  // Handlers for Memory Game
  const handleCardClick = (cardId: string, pairKey: string) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedPairs.includes(pairKey)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = memoryCards.find((c) => c.id === newFlipped[0]);
      const secondCard = memoryCards.find((c) => c.id === newFlipped[1]);

      if (firstCard && secondCard && firstCard.pairKey === secondCard.pairKey) {
        setMatchedPairs((prev) => [...prev, firstCard.pairKey]);
        setFlippedCards([]);
        setProgress((prev) => ({ ...prev, totalStars: prev.totalStars + 10 }));
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const handleResetMemoryGame = () => {
    setMatchedPairs([]);
    setFlippedCards([]);
    setMemoryCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleSaveNickname = () => {
    if (nicknameInput.trim()) {
      setProgress((prev) => ({ ...prev, childNickname: nicknameInput.trim() }));
      setShowCertificateModal(true);
    }
  };

  return (
    <PageWrapper
      title="عالم الأطفال المسلم"
      description="عالم تفاعلي تعليمي ممتع وآمن للأطفال: تعلم القرآن الكريم، أركان الإسلام، الوضوء والصلاة، ألعاب الذكاء، وقصص الأنبياء الملهمة."
    >
      <div className="space-y-8">
        {/* 1. Cheerful Kid-Friendly Header */}
        <section className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-r from-[#072A20] via-[#0D4D3A] to-[#C5A059] border-2 border-gold shadow-2xl text-white">
          <div className="islamic-pattern absolute inset-0 opacity-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-right max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/40 text-amber-200 text-xs font-black shadow-sm">
                <Smile className="w-4 h-4 text-amber-300" />
                <span>أهلاً بك يا بطل في عالمك الإسلامي الجميل!</span>
              </div>
              <h1 className="font-quran text-3xl sm:text-5xl text-gold font-bold drop-shadow-md">
                عالم الأطفال المسلم
              </h1>
              <p className="text-xs sm:text-base text-slate-100 leading-relaxed font-semibold">
                هنا تتعلم كتاب ربك، وأخلاق نبيك محمد ﷺ، وتلعب ألعاب الذكاء الإسلامية، وتجمع النجوم والأوسمة الذهبية!
              </p>
            </div>

            {/* Stars & Nickname Card */}
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-5 border-2 border-gold/50 flex flex-col items-center gap-3 shrink-0 shadow-xl">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-2xl font-black font-mono text-amber-300">{progress.totalStars}</span>
                <span className="text-xs font-bold text-slate-200">نجمة ذهبية</span>
              </div>

              <div className="text-center">
                <p className="text-xs text-amber-200 font-bold">المسلم الصغير:</p>
                <p className="text-base font-black text-white">{progress.childNickname}</p>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/20 w-full justify-center">
                <button
                  type="button"
                  onClick={() => setShowCertificateModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-gold text-royal font-bold text-xs hover:scale-105 transition-transform flex items-center gap-1 shadow-sm"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>شهادة إنجازي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowParentsModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  title="دليل أولياء الأمور والخصوصية الآمنة"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </button>

                <Link
                  to="/"
                  className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  title="الخروج إلى المنصة الرئيسية"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Module Navigation Tabs */}
        <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'quran', label: 'تعلم القرآن الكريم', icon: BookOpen, color: 'text-emerald-400' },
            { id: 'basics', label: 'أساسيات الإسلام والعبادات', icon: Crown, color: 'text-amber-400' },
            { id: 'games', label: 'ألعاب الذكاء والمعرفة', icon: Gamepad2, color: 'text-blue-400' },
            { id: 'stories', label: 'قصص إسلامية ملهمة', icon: ScrollText, color: 'text-purple-400' },
            { id: 'achievements', label: 'أوسمتي وإنجازاتي', icon: Trophy, color: 'text-yellow-400' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as KidsCategory)}
                className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2.5 whitespace-nowrap ${
                  isCurrent
                    ? 'royal-gradient text-white border-2 border-gold shadow-lg scale-105'
                    : 'glass-panel text-slate-600 dark:text-slate-300 hover:border-gold/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </section>

        {/* 3. TAB 1: LEARN QURAN (الحروف وقصار السور) */}
        {activeTab === 'quran' && (
          <div className="space-y-8">
            {/* Arabic Alphabet Strip */}
            <div className="glass-panel rounded-3xl p-6 border-2 border-gold/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-royal dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gold" />
                    <span>حروف الهجاء بالكلمات القرآنية (اضغط على الحرف)</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    تعلم نطق الحروف العربية الجميلة مع كلمات من كتاب الله العزيز
                  </p>
                </div>
              </div>

              {/* Alphabet Grid */}
              <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
                {ARABIC_ALPHABET_QURANIC.map((l) => {
                  const isSel = selectedLetter.letter === l.letter;
                  return (
                    <button
                      key={l.letter}
                      type="button"
                      onClick={() => setSelectedLetter(l)}
                      className={`h-11 sm:h-12 rounded-xl font-quran text-lg sm:text-xl font-bold flex items-center justify-center transition-all ${
                        isSel
                          ? 'royal-gradient text-gold border-2 border-gold scale-110 shadow-md'
                          : 'bg-royal/5 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-gold/20'
                      }`}
                    >
                      {l.letter}
                    </button>
                  );
                })}
              </div>

              {/* Selected Letter Display Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gold/10 border border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl royal-gradient text-gold font-quran text-4xl font-black flex items-center justify-center border-2 border-gold shadow-md shrink-0">
                    {selectedLetter.letter}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-royal dark:text-white">
                      حرف {selectedLetter.nameAr}: ﴿{selectedLetter.exampleWord}﴾
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                      المعنى: {selectedLetter.meaningAr} • النطق: <span className="font-mono text-gold font-bold">{selectedLetter.soundDescription}</span>
                    </p>
                    <p className="text-[11px] text-gold/90 font-bold mt-1">
                      ✨ {selectedLetter.quranicTheme}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                    حرف قرآني مبارك ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Short Surahs Interactive Reader */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gold/20 pb-4">
                <div>
                  <h3 className="text-xl font-black text-royal dark:text-gold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <span>قصار السور المباركة للأطفال (استمع وتدبر)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    اختر سورة لقراءتها آية آية مع معانيها الميسرة وأسئلتها اللطيفة
                  </p>
                </div>

                {/* Surah Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                  {SHORT_SURAHS_LESSONS.map((surah) => (
                    <button
                      key={surah.surahNumber}
                      type="button"
                      onClick={() => setSelectedSurah(surah)}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                        selectedSurah.surahNumber === surah.surahNumber
                          ? 'gold-gradient text-royal shadow-sm'
                          : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
                      }`}
                    >
                      {surah.nameAr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Surah Header & Theme */}
              <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-lg text-royal dark:text-white">{selectedSurah.nameAr}</h4>
                  <span className="text-xs text-gold font-bold">{selectedSurah.ayahCount} آيات كريمة</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                  🌸 {selectedSurah.childFriendlyTheme}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  📖 {selectedSurah.storyBehindSurah}
                </p>
              </div>

              {/* Verses List with Simple Meanings */}
              <div className="space-y-3">
                {selectedSurah.verses.map((v) => (
                  <div
                    key={v.numberInSurah}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gold/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-gold/50 transition-all"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full royal-gradient text-gold font-bold text-xs flex items-center justify-center shrink-0">
                          {v.numberInSurah}
                        </span>
                        <p className="font-quran text-xl sm:text-2xl text-royal dark:text-amber-100 font-bold">
                          ﴿ {v.text} ﴾
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pr-8">
                        💡 المعنى البسيط: {v.simpleMeaning}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setProgress((prev) => ({ ...prev, totalStars: prev.totalStars + 1 }));
                        }}
                        className="px-2.5 py-1 rounded-xl bg-gold/15 text-gold text-xs font-bold hover:bg-gold/25 transition-colors flex items-center gap-1"
                        title="قرأت هذه الآية وتدبرتها"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>قرأت</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Quiz for the Surah */}
              {selectedSurah.lessonQuestions.length > 0 && (
                <div className="p-5 rounded-2xl bg-gold/10 border border-gold/30 space-y-3">
                  <h4 className="font-bold text-sm text-royal dark:text-gold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gold" />
                    <span>تحدي ذكاء المسلم الصغير حول {selectedSurah.nameAr}:</span>
                  </h4>

                  {selectedSurah.lessonQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2">
                      <p className="text-xs sm:text-sm font-bold text-royal dark:text-white">
                        {q.question}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt, optIdx) => (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (optIdx === q.correctIndex) {
                                alert(`🎉 ${q.explanation}`);
                                setProgress((prev) => ({ ...prev, totalStars: prev.totalStars + 3 }));
                              } else {
                                alert('حاول مرة أخرى يا بطل!');
                              }
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-gold/30 text-xs font-bold text-royal dark:text-slate-200 hover:bg-gold/20 transition-all shadow-sm"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. TAB 2: ISLAMIC BASICS (أركان الإسلام والوضوء والصلاة) */}
        {activeTab === 'basics' && (
          <div className="space-y-8">
            {/* Five Pillars of Islam */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-royal dark:text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-gold" />
                    <span>أركان الإسلام الخمسة العظيمة للناشئة</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    خمسة أعمدة يبنى عليها إسلامنا لنعيش سعداء ونفوز بالجنة
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ISLAMIC_PILLARS_KIDS.map((p) => (
                  <div
                    key={p.id}
                    className="glass-panel rounded-2xl p-5 border border-gold/25 flex flex-col justify-between gap-3 hover:border-gold/60 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="w-7 h-7 rounded-xl royal-gradient text-gold font-bold text-xs flex items-center justify-center">
                          {p.number}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                          ركن أساسي
                        </span>
                      </div>

                      <h3 className="font-black text-sm text-royal dark:text-white">{p.title}</h3>
                      <p className="text-xs text-gold font-semibold">{p.subtitle}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{p.summary}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 border border-gold/15 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      🌟 <strong>في حياتي: </strong>{p.childExample}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Illustrated Wudu Guide */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-royal dark:text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    <span>كيف أتوضأ لصلاة مقبولة؟ (خطوات الوضوء الثمانية)</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    الوضوء طهارة ونور للمسلم الصغير
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProgress((prev) => ({
                      ...prev,
                      wuduStepsCompleted: true,
                      totalStars: prev.totalStars + 10,
                      unlockedBadgeIds: Array.from(new Set([...prev.unlockedBadgeIds, 'b_wudu']))
                    }));
                    alert('🎉 ما شاء الله! حصلت على وسام بطل الطهارة و 10 نجوم!');
                  }}
                  className="px-3.5 py-1.5 rounded-xl gold-gradient text-royal font-bold text-xs shadow-sm hover:scale-105 transition-transform"
                >
                  أتقنت الوضوء ✓
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {WUDU_STEPS_KIDS.map((w) => (
                  <div
                    key={w.stepNumber}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-gold/20 flex flex-col justify-between gap-3 shadow-sm hover:border-gold/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-xl royal-gradient text-gold font-bold text-xs flex items-center justify-center">
                        {w.stepNumber}
                      </span>
                      <span className="text-xs font-bold text-gold">{w.title}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                      {w.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Manners for Kids */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-4">
              <h3 className="text-xl font-black text-royal dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold" />
                <span>آداب وأخلاق المسلم الصغير</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KIDS_MANNERS_DATA.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 space-y-2"
                  >
                    <h4 className="font-bold text-sm text-royal dark:text-gold flex items-center gap-2">
                      <span>🌸 {m.title}</span>
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                      {m.rule}
                    </p>
                    {m.propheticSupplication && (
                      <p className="text-[11px] text-gold font-quran bg-black/10 dark:bg-black/30 p-2 rounded-xl">
                        {m.propheticSupplication}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      🎁 <strong>الفضل والثواب: </strong>{m.rewardStory}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. TAB 3: KNOWLEDGE GAMES (ألعاب الذكاء) */}
        {activeTab === 'games' && (
          <div className="space-y-8">
            {/* Game 1: Interactive Islamic Quiz */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                    اللعبة الأولى: تحدي الأسئلة الذكية
                  </span>
                  <h3 className="text-xl font-black text-royal dark:text-white mt-1">
                    السؤال {currentQuizIndex + 1} من {KIDS_QUIZ_QUESTIONS.length}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-royal/10 dark:bg-white/10 px-3 py-1 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>+{currentQuiz.starsAwarded} نجوم</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 space-y-4">
                <p className="text-base sm:text-lg font-black text-royal dark:text-white leading-relaxed">
                  {currentQuiz.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentQuiz.options.map((opt, i) => {
                    const isSelected = quizSelectedOption === i;
                    const isCorrect = i === currentQuiz.correctIndex;

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={quizSubmitted}
                        onClick={() => handleSelectQuizOption(i)}
                        className={`p-3.5 rounded-2xl font-bold text-xs sm:text-sm text-center border transition-all ${
                          quizSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600 scale-102 shadow-md'
                              : isSelected
                              ? 'bg-red-500 text-white border-red-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
                            : 'bg-white dark:bg-slate-800 text-royal dark:text-slate-200 border-gold/30 hover:border-gold hover:scale-102'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-between gap-3"
                  >
                    <p className="text-xs font-bold text-royal dark:text-white">
                      💡 {currentQuiz.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextQuiz}
                      className="px-4 py-2 rounded-xl gold-gradient text-royal font-black text-xs shrink-0 shadow-sm hover:scale-105 transition-transform"
                    >
                      السؤال التالي ➔
                    </button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Game 2: Match the Pairs (Memory Challenge) */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-500 font-bold">
                    اللعبة الثانية: لعبة تطابق الأزواج
                  </span>
                  <h3 className="text-xl font-black text-royal dark:text-white mt-1">
                    طابق المفهوم الإسلامي بصفته الصحيحة
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleResetMemoryGame}
                  className="px-3 py-1.5 rounded-xl bg-royal/10 dark:bg-white/10 hover:bg-gold/20 text-xs font-bold text-gold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة اللعبة</span>
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {memoryCards.map((card) => {
                  const isFlipped = flippedCards.includes(card.id) || matchedPairs.includes(card.pairKey);
                  const isMatched = matchedPairs.includes(card.pairKey);

                  return (
                    <button
                      key={card.id}
                      type="button"
                      disabled={isMatched}
                      onClick={() => handleCardClick(card.id, card.pairKey)}
                      className={`h-24 sm:h-28 rounded-2xl p-2 font-black text-xs text-center border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                        isMatched
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300 scale-95'
                          : isFlipped
                          ? 'royal-gradient text-gold border-gold scale-105 shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border-gold/20 hover:border-gold hover:scale-102'
                      }`}
                    >
                      {isFlipped ? (
                        <>
                          <Sparkles className="w-4 h-4 text-gold" />
                          <span className="line-clamp-2 leading-tight">{card.text}</span>
                        </>
                      ) : (
                        <div className="text-2xl font-bold font-mono text-gold/60">؟</div>
                      )}
                    </button>
                  );
                })}
              </div>

              {matchedPairs.length === KIDS_MEMORY_PAIRS.length && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-center space-y-2">
                  <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-300">
                    🎉 ما شاء الله! أنت عبقري وطابقت جميع البطاقات بنجاح!
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    أضيفت 10 نجوم ذهبية إلى رصيدك تشجيعاً لك!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. TAB 4: STORIES FOR CHILDREN (قصص ملهمة بدون تجسيد) */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6 border-2 border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-royal dark:text-white flex items-center gap-2">
                  <ScrollText className="w-5 h-5 text-gold" />
                  <span>قصص إسلامية ملهمة وموثقة للأطفال</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  صياغة أدبية تربوية راقية بدون أي تجسيد للأنبياء والصحابة
                </p>
              </div>

              {/* Story selector pills */}
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                {KIDS_STORIES_DATA.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStoryId(st.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                      selectedStoryId === st.id
                        ? 'gold-gradient text-royal shadow-sm'
                        : 'bg-royal/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-gold/15'
                    }`}
                  >
                    {st.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Story Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-gold/30 space-y-6">
              <div className="border-b border-gold/20 pb-4 space-y-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/15 text-gold font-bold">
                  {activeStory.heroName}
                </span>
                <h3 className="text-2xl font-black text-royal dark:text-white mt-1">
                  {activeStory.title}
                </h3>
                <p className="text-xs sm:text-sm text-gold font-semibold">
                  🌟 العبرة المستفادة: {activeStory.moralLesson}
                </p>
              </div>

              {/* Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                {activeStory.paragraphs.map((p, i) => (
                  <p key={i} className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-gold/15 shadow-sm">
                    {p}
                  </p>
                ))}
              </div>

              {/* Reflection Questions */}
              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/25 space-y-2">
                <h4 className="text-xs font-bold text-royal dark:text-gold">
                  🤔 أسئلة نفكر فيها معاً:
                </h4>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {activeStory.reflectionQuestions.map((q, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-gold font-bold">●</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-slate-400 pt-1 text-left" dir="ltr">
                  Source: {activeStory.verifiedSource}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB 5: ACHIEVEMENTS & BADGES (أوسمتي وإنجازاتي) */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="glass-panel rounded-3xl p-6 border-2 border-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-royal dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gold" />
                  <span>لوحة أوسمة وإنجازات المسلم الصغير</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  كل درس تتقنه ولعبة تنجزها تمنحك وساماً تشجيعياً فخماً
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCertificateModal(true)}
                className="px-4 py-2 rounded-xl gold-gradient text-royal font-black text-xs shadow-md hover:scale-105 transition-transform flex items-center gap-1.5 shrink-0"
              >
                <Award className="w-4 h-4" />
                <span>عرض وطباعة شهادة التقدير</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {KIDS_BADGES_DATA.map((badge) => {
                const isUnlocked = progress.unlockedBadgeIds.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`rounded-2xl p-5 border-2 transition-all flex items-start gap-4 ${
                      isUnlocked
                        ? 'glass-panel border-gold bg-gold/10 shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${
                        isUnlocked
                          ? 'royal-gradient text-gold border-2 border-gold shadow-sm'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? '🏆' : '🔒'}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-sm text-royal dark:text-white">{badge.title}</h4>
                        {isUnlocked && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
                            مفتوح ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {badge.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold pt-1">
                        الشرط: {badge.requirement}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        <AnimatePresence>
          {showCertificateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 max-w-lg w-full border-4 border-gold shadow-2xl space-y-6 text-center relative"
              >
                <div className="islamic-pattern absolute inset-0 opacity-10 pointer-events-none" />

                <div className="space-y-2 relative z-10">
                  <div className="w-16 h-16 mx-auto rounded-full royal-gradient text-gold flex items-center justify-center border-2 border-gold text-2xl shadow-md">
                    🎖️
                  </div>
                  <h3 className="font-quran text-2xl sm:text-3xl font-black text-royal dark:text-gold">
                    شهادة إتمام وتقدير المسلم الصغير
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    صادرة من منصة مدار اليقين التعليمية
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-royal/5 dark:bg-white/5 border-2 border-gold/40 space-y-3 relative z-10">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">
                    تشهد منصة مدار اليقين بأن البطل المبارك:
                  </p>
                  <div className="font-quran text-2xl sm:text-3xl font-black text-royal dark:text-white text-gold-glow">
                    {progress.childNickname}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                    قد أتم بنجاح استكشاف دروس القرآن الكريم، وحفظ آداب النبي ﷺ، وأنجز التحديات الإسلامية جامعاً <strong className="text-gold">{progress.totalStars} نجمة ذهبية</strong>.
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold pt-2 border-t border-gold/20">
                    بارك الله فيك وجعلك قرة عين لوالديك ونفع بك الإسلام والمسلمين!
                  </p>
                </div>

                {/* Edit Nickname in Certificate */}
                <div className="flex items-center gap-2 relative z-10">
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="اكتب اسمك ليظهر في الشهادة..."
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-gold/30 text-royal dark:text-white focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNickname}
                    className="px-3 py-2 rounded-xl gold-gradient text-royal font-bold text-xs"
                  >
                    تحديث الاسم
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gold/20 relative z-10">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-royal/10 dark:bg-white/10 hover:bg-gold/20 text-xs font-bold text-royal dark:text-gold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الشهادة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowCertificateModal(false)}
                    className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Parents & Safety Guide Modal */}
        <AnimatePresence>
          {showParentsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-gold/40 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                  <h3 className="text-base font-bold text-royal dark:text-gold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>دليل أولياء الأمور وخصوصية الطفل الآمنة</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowParentsModal(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <p>
                    🔒 <strong>بيئة آمنة 100%: </strong>صمم هذا القسم للأطفال ليناسب هويتهم الإسلامية بدون أي إعلانات، ولا روابط تتبع خارجية، ولا خاصية محادثات بين المستخدمين.
                  </p>
                  <p>
                    🛡️ <strong>حفظ البيانات محلياً: </strong>جميع إنجازات طفلك ونجومه واسمه تحفظ في ذاكرة متصفح جهازكم فقط ولا ترفع إلى خوادم خارجية.
                  </p>
                  <p>
                    📖 <strong>موثوقية المحتوى: </strong>جميع الآيات الكريمة والأحاديث النبوية والقصص مأخوذة من مصادر معتمدة خالية من أي تجسيد للأنبياء والصحابة.
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-gold/20">
                  <button
                    type="button"
                    onClick={() => setShowParentsModal(false)}
                    className="px-4 py-2 rounded-xl gold-gradient text-royal font-bold text-xs"
                  >
                    حسناً، فهمت
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
