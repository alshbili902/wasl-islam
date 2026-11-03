import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  Search, 
  Play, 
  Pause, 
  Download, 
  Radio, 
  Volume2, 
  Clock, 
  User, 
  Sparkles,
  Share2,
  Filter,
  ListMusic
} from 'lucide-react';
import { AUDIO_LIBRARY_ITEMS } from '../data/audioLibraryData';
import { AudioCategoryType, LibraryAudioItem } from '../types/extraModules';
import { useAudio } from '../context/AudioContext';
import { AudioTrack } from '../types';

export const AudioLibraryPage: React.FC = () => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const [selectedCategory, setSelectedCategory] = useState<AudioCategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: AudioCategoryType | 'all'; label: string }[] = [
    { id: 'all', label: 'كافة المقاطع الصوتية' },
    { id: 'quran_rare', label: 'تلاوات خاشعة ونادرة' },
    { id: 'seerah_audio', label: 'السيرة النبوية صوتياً' },
    { id: 'scholars_lessons', label: 'دروس العقيدة والفقه' },
    { id: 'tafsir_audio', label: 'روائع التفسير الميسر' },
    { id: 'adhkar_ruqyah', label: 'الأذكار والرقية الشرعية' },
  ];

  const filteredItems = useMemo(() => {
    return AUDIO_LIBRARY_ITEMS.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.includes(searchQuery.trim()) ||
        item.speakerOrReciter.includes(searchQuery.trim()) ||
        item.description.includes(searchQuery.trim()) ||
        item.tags.some((t) => t.includes(searchQuery.trim()));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const mapToAudioTrack = (item: LibraryAudioItem): AudioTrack => ({
    id: item.id,
    title: item.title,
    subtitle: item.categoryLabelAr,
    reciterName: item.speakerOrReciter,
    url: item.audioUrl,
    streamType: 'mp3',
  });

  const handlePlayItem = (item: LibraryAudioItem) => {
    if (currentTrack?.id === item.id) {
      togglePlay();
    } else {
      const queue = filteredItems.map(mapToAudioTrack);
      playTrack(mapToAudioTrack(item), queue);
    }
  };

  const handlePlayAll = () => {
    if (filteredItems.length === 0) return;
    const queue = filteredItems.map(mapToAudioTrack);
    playTrack(queue[0], queue);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-[#070D14] text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl royal-gradient p-6 sm:p-10 text-white shadow-xl border-2 border-gold/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold">
              <Headphones className="w-4 h-4" />
              <span>المكتبة الصوتية الإسلامية الموثقة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gold tracking-tight">
              المكتبة الصوتية الإسلامية
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              استمع إلى تلاوات نادرة ومؤثرة لكبار القراء، ودروس العقيدة والفقه لأئمة الإسلام (ابن باز، العثيمين، الألباني، الفوزان)، والسيرة النبوية صوتياً، والأذكار والرقية الشرعية عبر المشغل المدمج المستمر.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handlePlayAll}
                className="px-5 py-2.5 rounded-xl gold-gradient text-royal font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg hover:brightness-105 transition-all"
              >
                <ListMusic className="w-4 h-4" />
                <span>تشغيل كل المقاطع في هذه القائمة</span>
              </button>
            </div>
          </div>
          <div className="absolute left-4 bottom-4 opacity-10 pointer-events-none">
            <Headphones className="w-64 h-64 text-gold" />
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="bg-white dark:bg-[#0E1726] p-5 sm:p-6 rounded-2xl border border-gold/30 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن تلاوة، شيخ، قارئ، أو موضوع (مثل: السديس، الحصري، ابن باز، السيرة، الكهف)..."
              className="w-full pr-12 pl-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#090F1A] border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>الأقسام:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-royal text-gold border border-gold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-gold/15'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>التسجيلات المتاحة ({filteredItems.length})</span>
            <span>يدعم التشغيل المستمر في خلفية المنصة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isCurrent = currentTrack?.id === item.id;
              const isItemPlaying = isCurrent && isPlaying;

              return (
                <motion.div
                  key={item.id}
                  layout
                  className={`rounded-2xl p-5 border transition-all shadow-sm flex flex-col justify-between space-y-4 ${
                    isCurrent
                      ? 'bg-gold/10 border-gold shadow-gold-glow dark:bg-[#0C1A2E]'
                      : 'bg-white dark:bg-[#0E1726] border-gold/25 hover:border-gold/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold/15 text-gold border border-gold/30">
                        {item.categoryLabelAr}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.durationLabel}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-royal dark:text-gold leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                      <User className="w-3.5 h-3.5 text-gold" />
                      <span>{item.speakerOrReciter}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handlePlayItem(item)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                        isItemPlaying
                          ? 'bg-emerald-600 text-white animate-pulse'
                          : 'gold-gradient text-royal hover:brightness-105'
                      }`}
                    >
                      {isItemPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>إيقاف مؤقت</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-royal" />
                          <span>{isCurrent ? 'متابعة الاستماع' : 'استماع الآن'}</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={item.audioUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold/20 text-slate-600 dark:text-slate-300 transition-colors"
                        title="تحميل الملف الصوتي MP3"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
