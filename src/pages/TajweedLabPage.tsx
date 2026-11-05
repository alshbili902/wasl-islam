import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Volume2, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  Layers, 
  ChevronLeft, 
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  MAKHAREJ_AREAS, 
  LETTERS_PROFILES, 
  TAJWEED_RULES, 
  TAJWEED_QUIZZES 
} from '../data/tajweedData';
import { LetterProfile, TajweedRuleItem, GeneralMakhrajArea } from '../types/quranLearning';
import { PageWrapper } from '../components/layout/PageWrapper';

export const TajweedLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'letters' | 'rules' | 'quizzes' | 'recorder'>('letters');

  // Letters & Makharij state
  const [selectedMakhrajArea, setSelectedMakhrajArea] = useState<GeneralMakhrajArea | 'all'>('all');
  const [selectedLetter, setSelectedLetter] = useState<LetterProfile>(LETTERS_PROFILES[0]);

  // Audio playing state
  const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const playAudioClip = (url: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    audio.play().then(() => setPlayingAudioUrl(url)).catch(() => setPlayingAudioUrl(null));
    audio.onended = () => setPlayingAudioUrl(null);
  };

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlobUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setIsRecording(true);
    } catch {
      alert('يرجى تمكين إذن الميكروفون في المتصفح لتسجيل نطقك الذاتي.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Quizzes state
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const currentQuiz = TAJWEED_QUIZZES[currentQuizIdx] || TAJWEED_QUIZZES[0];

  const filteredLetters = LETTERS_PROFILES.filter((l) =>
    selectedMakhrajArea === 'all' ? true : l.makhrajArea === selectedMakhrajArea
  );

  return (
    <PageWrapper
      title="معمل النطق والتجويد القرآني ومخارج الحروف وصفاتها"
      description="تعلّم المخارج الـ 17 للحروف العربية وصفاتها، وتدرّب على أحكام النون والميم والمدود بالأمثلة الصوتية الموثقة والاختبارات التفاعلية."
      canonicalPath="/tajweed-lab"
      breadcrumbs={[
        { name: 'الرئيسية', url: '/' },
        { name: 'معمل التجويد', url: '/tajweed-lab' },
      ]}
      schemaType="LearningResource"
    >
      <div className="pb-12 min-w-0 space-y-8">

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>معمل مخارج الحروف والصفات والأحكام التجويدية</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              معمل النطق والتجويد القرآني
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              تعلّم المخارج الـ 17 للحروف العربية وصفاتها اللازمة والعارضة، وتدرّب على أحكام النون والميم والمدود بالأمثلة الصوتية الموثقة والتسجيل المقارن المباشر.
            </p>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <Layers className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-[#0E1726] p-2 rounded-2xl border border-gold/30 shadow-sm flex flex-wrap gap-2">
          {[
            { id: 'letters', label: 'مخارج الحروف والصفات', icon: BookOpen },
            { id: 'rules', label: 'قواعد وأحكام التجويد', icon: Layers },
            { id: 'quizzes', label: 'تدريبات واختبارات التجويد', icon: CheckCircle2 },
            { id: 'recorder', label: 'معمل التسجيل والمقارنة', icon: Mic }
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

        {/* Tab 1: Letters & Makharij */}
        {activeTab === 'letters' && (
          <div className="space-y-6">
            {/* General Makhraj Areas Filter */}
            <div className="bg-white dark:bg-[#0E1726] p-4 rounded-2xl border border-gold/30 shadow-sm flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-400 pl-2">المخارج العامة:</span>
              <button
                type="button"
                onClick={() => setSelectedMakhrajArea('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMakhrajArea === 'all'
                    ? 'bg-royal text-gold border border-gold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                الكل (28 حرفاً)
              </button>
              {MAKHAREJ_AREAS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMakhrajArea(m.area)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMakhrajArea === m.area
                      ? 'bg-royal text-gold border border-gold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {m.areaLabelAr}
                </button>
              ))}
            </div>

            {/* Letters Grid Picker */}
            <div className="bg-white dark:bg-[#0E1726] p-5 rounded-3xl border border-gold/30 shadow-sm">
              <span className="text-xs font-bold text-slate-400 block mb-3">اختر حرفاً لعرض مخرجه وصفاته ونطقه الصحيح:</span>
              <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 gap-2.5">
                {filteredLetters.map((item) => {
                  const isSelected = selectedLetter.letter === item.letter;
                  return (
                    <button
                      key={item.letter}
                      type="button"
                      onClick={() => setSelectedLetter(item)}
                      className={`h-14 rounded-2xl font-quran text-2xl font-bold flex items-center justify-center transition-all ${
                        isSelected
                          ? 'gold-gradient text-royal shadow-lg scale-105 border-2 border-gold'
                          : 'bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 hover:border-gold/60 text-royal dark:text-gold'
                      }`}
                    >
                      {item.letter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Letter Full Dossier */}
            <div className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 sm:p-8 border-2 border-gold/40 shadow-lg space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/20 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gold-gradient text-royal font-quran text-4xl font-extrabold flex items-center justify-center shadow-md">
                    {selectedLetter.letter}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-royal dark:text-gold">
                      حرف {selectedLetter.nameAr}
                    </h3>
                    <p className="text-xs text-gold font-semibold mt-0.5">
                      المخرج العام: {selectedLetter.makhrajLabel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedLetter.sifaat.map((sifah, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-royal/10 dark:bg-white/10 text-royal dark:text-slate-200 text-xs font-bold border border-gold/20"
                    >
                      {sifah}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Makhraj & Articulation Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 space-y-1.5">
                  <h4 className="font-bold text-gold text-xs flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-gold" />
                    <span>المخرج الدقيق في جهاز النطق:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedLetter.detailedMakhraj}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 space-y-1.5">
                  <h4 className="font-bold text-gold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>كيفية النطق الصحيح والتجويد:</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedLetter.articulationGuide}
                  </p>
                </div>
              </div>

              {/* Quranic Examples with Audio */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-400">أمثلة قرآنية لتطبيق نطق الحرف:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedLetter.quranicExamples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-quran text-base sm:text-lg font-bold text-royal dark:text-gold" dir="rtl">
                          {ex.text}
                        </p>
                        <span className="text-[11px] text-slate-400">
                          سورة {ex.surahName} (الآية {ex.ayahNumber})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => playAudioClip(selectedLetter.vowelAudioExamples.fatha)}
                        className="p-2 rounded-xl gold-gradient text-royal shadow-sm hover:brightness-105 shrink-0"
                        title="استمع للمثال"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Mistakes Warning */}
              {selectedLetter.commonMistakes.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <h4 className="font-bold text-xs text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>أخطاء شائعة ولحون يجب الحذر منها:</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {selectedLetter.commonMistakes.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Tajweed Rules */}
        {activeTab === 'rules' && (
          <div className="space-y-4">
            {TAJWEED_RULES.map((rule) => (
              <div
                key={rule.id}
                className="bg-white dark:bg-[#0E1726] rounded-3xl p-6 border border-gold/30 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 pb-3">
                  <div>
                    <span className="text-xs font-bold text-gold bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                      {rule.categoryLabelAr}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-royal dark:text-gold mt-1.5">
                      {rule.titleAr}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400">حروفه:</span>
                    <div className="flex flex-wrap gap-1">
                      {rule.letters.map((ltr, i) => (
                        <span
                          key={i}
                          className="w-6 h-6 rounded-md bg-royal/10 dark:bg-white/10 text-royal dark:text-gold text-xs font-bold flex items-center justify-center"
                        >
                          {ltr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {rule.ruleExplanation}
                </p>

                <div className="p-3.5 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-gold block">كيفية الأداء العملي:</span>
                  <p>{rule.howToPronounce}</p>
                </div>

                {/* Examples */}
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-slate-400">أمثلة تطبيقية موثقة من القرآن:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rule.quranicExamples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-quran text-base font-bold text-royal dark:text-gold" dir="rtl">
                            {ex.verseSnippet}
                          </p>
                          <span className="text-[11px] text-slate-500">
                            {ex.explanation} (سورة {ex.surahName}: {ex.ayahNumber})
                          </span>
                        </div>
                        {ex.audioUrl && (
                          <button
                            type="button"
                            onClick={() => playAudioClip(ex.audioUrl!)}
                            className="p-2 rounded-xl gold-gradient text-royal shadow-sm hover:brightness-105 shrink-0"
                            title="استمع للحكم"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Quizzes */}
        {activeTab === 'quizzes' && (
          <div className="bg-white dark:bg-[#0E1726] p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gold/20 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-400">اختبار إتقان أحكام التجويد ({currentQuizIdx + 1} من {TAJWEED_QUIZZES.length})</span>
                <h3 className="text-lg font-bold text-royal dark:text-gold">
                  سؤال في أحكام التجويد ومخارج الحروف
                </h3>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/25 text-base sm:text-lg font-bold text-royal dark:text-gold text-center leading-relaxed">
              {currentQuiz.question}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuiz.correctIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isAnswerRevealed}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`p-4 rounded-xl text-right font-bold text-sm border transition-all ${
                      isAnswerRevealed
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

            {isAnswerRevealed && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block">التوضيح التجويدي:</span>
                <p>{currentQuiz.explanation}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsAnswerRevealed(true)}
                disabled={selectedAnswer === null || isAnswerRevealed}
                className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs disabled:opacity-30 shadow-sm"
              >
                تأكيد الإجابة
              </button>

              {isAnswerRevealed && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAnswerRevealed(false);
                    setSelectedAnswer(null);
                    setCurrentQuizIdx((prev) => (prev + 1) % TAJWEED_QUIZZES.length);
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

        {/* Tab 4: Voice Recording & Self-Comparison Lab */}
        {activeTab === 'recorder' && (
          <div className="bg-white dark:bg-[#0E1726] p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-gold/20 pb-4">
              <h3 className="text-xl font-bold text-royal dark:text-gold flex items-center gap-2">
                <Mic className="w-5 h-5 text-gold" />
                <span>معمل التدريب الصوتي والمقارنة الذاتية</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                استمع إلى نطق الحرف أو الآية بصوت الشيخ المتقن، ثم سجّل نطقك واستمع إلى التسجيلين جنباً إلى جنب لاكتشاف الفروق وتصحيح مخارج الحروف.
              </p>
            </div>

            {/* Privacy & Educational Disclaimer Alert */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>تنبيه تربوي وشرعي هام:</span>
              </div>
              <p>
                المعامل الصوتية التلقائية والذكاء الاصطناعي لا يمكنها منح إجازة أو إعطاء حكم قطعي في التجويد؛ فالتجويد أصله التلقي والمشافهة عن الشيوخ المتقنين بالسند المتصل. هذا المعمل مخصص للتدريب والمقارنة الذاتية الميسرة.
              </p>
            </div>

            {/* Active Practice Card */}
            <div className="p-6 rounded-3xl bg-royal/5 dark:bg-white/5 border border-gold/30 text-center space-y-4">
              <span className="text-xs text-slate-400 font-bold block">مقطع التدريب الصوتي المختار:</span>
              <p className="font-quran text-2xl sm:text-3xl font-bold text-royal dark:text-gold" dir="rtl">
                ﴿قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ﴾
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                <button
                  type="button"
                  onClick={() => playAudioClip('https://everyayah.com/data/Alafasy_128kbps/113001.mp3')}
                  className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs flex items-center gap-2 shadow-md hover:brightness-105"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>استماع لتلاوة الشيخ المرجعية</span>
                </button>

                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:bg-red-700"
                  >
                    <Mic className="w-4 h-4" />
                    <span>ابدأ تسجيل صوتك الآن</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2 animate-pulse"
                  >
                    <MicOff className="w-4 h-4 text-red-400" />
                    <span>إيقاف التسجيل وإنهاء المقطع</span>
                  </button>
                )}
              </div>

              {recordedBlobUrl && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080E18] border border-gold/30 mt-4 max-w-md mx-auto space-y-2">
                  <span className="text-xs font-bold text-emerald-600 block">تسجيلك الصوتي جاهز للمقارنة:</span>
                  <audio src={recordedBlobUrl} controls className="w-full h-10" />
                  <button
                    type="button"
                    onClick={() => setRecordedBlobUrl(null)}
                    className="text-[11px] text-slate-400 hover:text-red-500"
                  >
                    مسح التسجيل والبدء من جديد
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
};

export default TajweedLabPage;
