import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  Share2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  Sparkles,
  Award,
  Shield,
  Compass,
  Users,
  Sun,
  HeartHandshake,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Volume2,
  Globe,
  FileText,
  CheckCircle2,
  AlertCircle,
  Palette,
  ExternalLink,
  SlidersHorizontal,
  FolderHeart,
  BookMarked,
  Printer,
  Calendar,
  Layers
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import {
  ALL_DUAS,
  DUA_SITUATION_CATEGORIES,
  DUA_SOURCE_TABS,
  searchAndFilterDuas,
  getDailyDua,
  getDuaEncyclopediaStats,
  normalizeArabicText
} from '../data/duas';
import {
  DuaItem,
  DuaSourceType,
  DuaSituationId,
  DuaCustomCollection,
  DuaUserNote
} from '../types/duas';

const STORAGE_FAVORITES_KEY = 'madar_duas_favorites';
const STORAGE_COLLECTIONS_KEY = 'madar_duas_custom_collections';
const STORAGE_NOTES_KEY = 'madar_duas_notes';
const STORAGE_RECENTS_KEY = 'madar_duas_recent_viewed';

export const DuasPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { playTrack, currentTrack, isPlaying, togglePlay } = useAudio();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [selectedSourceType, setSelectedSourceType] = useState<DuaSourceType | 'all'>(
    (searchParams.get('source') as DuaSourceType) || 'all'
  );
  const [selectedSituation, setSelectedSituation] = useState<DuaSituationId | 'all'>(
    (searchParams.get('situation') as DuaSituationId) || 'all'
  );
  const [filterPrescribedCountOnly, setFilterPrescribedCountOnly] = useState<boolean>(false);
  const [filterAudioOnly, setFilterAudioOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'collections'>('all');

  // Font size setting (sm, md, lg)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');

  // Detail Modal State
  const [selectedDua, setSelectedDua] = useState<DuaItem | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'explanation' | 'source' | 'translations' | 'notes'>('explanation');
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<'en' | 'ur' | 'fr' | 'id' | 'tr' | 'bn'>('en');

  // Interactive Counters state: key is dua.id -> current count
  const [counters, setCounters] = useState<Record<string, number>>({});

  // Local Storage States
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customCollections, setCustomCollections] = useState<DuaCustomCollection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COLLECTIONS_KEY);
      return saved ? JSON.parse(saved) : [
        {
          id: 'col-daily',
          name: 'أدعيتي اليومية المفضلة',
          description: 'مجموعة الأذكار والأدعية التي أواظب عليها في يومي',
          color: '#C5A059',
          duaIds: ['quran-1', 'prophetic-1', 'prophetic-2', 'sit-1'],
          createdAt: new Date().toISOString()
        },
        {
          id: 'col-parents',
          name: 'أدعية الوالدين والأهل',
          description: 'دعوات بالرحمة والبر والإحسان لوالدي وذريتي',
          color: '#072A20',
          duaIds: ['quran-7', 'quran-8', 'quran-9', 'general-3'],
          createdAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [userNotes, setUserNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [recentViewedIds, setRecentViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RECENTS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI feedback states
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [isCreatingCollection, setIsCreatingCollection] = useState<boolean>(false);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [noteSavedFeedback, setNoteSavedFeedback] = useState<boolean>(false);

  // Stats & Daily Dua
  const stats = useMemo(() => getDuaEncyclopediaStats(), []);
  const dailyDua = useMemo(() => getDailyDua(), []);

  // Save favorites to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Save custom collections
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COLLECTIONS_KEY, JSON.stringify(customCollections));
    } catch (e) {
      console.error(e);
    }
  }, [customCollections]);

  // Save notes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(userNotes));
    } catch (e) {
      console.error(e);
    }
  }, [userNotes]);

  // Save recents
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RECENTS_KEY, JSON.stringify(recentViewedIds));
    } catch (e) {
      console.error(e);
    }
  }, [recentViewedIds]);

  // Handle URL deep link if dua query parameter exists
  useEffect(() => {
    const duaId = searchParams.get('id');
    if (duaId) {
      const found = ALL_DUAS.find((d) => d.id === duaId);
      if (found) {
        openDuaDetail(found);
      }
    }
  }, [searchParams]);

  // Filtered Duas
  const filteredDuas = useMemo(() => {
    if (activeTab === 'favorites') {
      return ALL_DUAS.filter((d) => favorites.includes(d.id));
    }

    return searchAndFilterDuas(searchQuery, {
      sourceType: selectedSourceType,
      situationId: selectedSituation,
      hasPrescribedCount: filterPrescribedCountOnly,
      hasAudio: filterAudioOnly
    });
  }, [
    activeTab,
    favorites,
    searchQuery,
    selectedSourceType,
    selectedSituation,
    filterPrescribedCountOnly,
    filterAudioOnly
  ]);

  // Open detail modal and record in recents
  const openDuaDetail = (dua: DuaItem) => {
    setSelectedDua(dua);
    setDetailActiveTab('explanation');
    setNoteDraft(userNotes[dua.id] || '');
    setRecentViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== dua.id);
      return [dua.id, ...filtered].slice(0, 10);
    });
  };

  const closeDuaDetail = () => {
    setSelectedDua(null);
  };

  // Toggle favorite
  const toggleFavorite = (duaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(duaId) ? prev.filter((id) => id !== duaId) : [...prev, duaId]
    );
  };

  // Counter management
  const incrementCounter = (dua: DuaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCounters((prev) => {
      const current = prev[dua.id] || 0;
      const target = dua.prescribedCount || 33;
      const next = current + 1;
      return {
        ...prev,
        [dua.id]: next > target ? 1 : next
      };
    });
  };

  const resetCounter = (duaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCounters((prev) => ({
      ...prev,
      [duaId]: 0
    }));
  };

  // Copy Dua to Clipboard
  const handleCopyDua = (dua: DuaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const sourceRef =
      dua.quranReference
        ? `${dua.quranReference.surahName}: آية ${dua.quranReference.ayahNumber}`
        : dua.hadithSource
        ? `${dua.hadithSource.bookName} (${dua.hadithSource.numberOrRef || ''}) - ${dua.authenticityGradeLabelAr}`
        : 'أدعية جامعة مأثورة';

    const textToCopy = `${dua.title}\n\n${dua.arabicText}\n\nالمصدر: ${sourceRef}\nالشرح: ${dua.explanationAr}\n— عبر موسوعة الأدعية | منصة مدار اليقين (wasl-islam.fun)`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedDuaId(dua.id);
    setTimeout(() => setCopiedDuaId(null), 2500);
  };

  // Native share or copy fallback
  const handleShareDua = async (dua: DuaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareData = {
      title: `${dua.title} - مدار اليقين`,
      text: `${dua.arabicText}\n\n${dua.title}\nالمصدر: ${dua.authenticityGradeLabelAr}`,
      url: `https://wasl-islam.fun/duas?id=${dua.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyDua(dua);
      }
    } catch {
      handleCopyDua(dua);
    }
  };

  // Open in Islamic Card Studio
  const handleOpenInCardStudio = (dua: DuaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const sourceRef = dua.quranReference
      ? `${dua.quranReference.surahName}: آية ${dua.quranReference.ayahNumber}`
      : dua.hadithSource?.bookName || 'موسوعة الأدعية - مدار اليقين';

    navigate(
      `/card-studio?text=${encodeURIComponent(dua.arabicText)}&source=${encodeURIComponent(
        sourceRef
      )}`
    );
  };

  // Play audio track
  const handlePlayAudio = (dua: DuaItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!dua.audioUrl) return;

    if (currentTrack?.id === dua.id && isPlaying) {
      togglePlay();
    } else {
      playTrack({
        id: dua.id,
        title: dua.title,
        subtitle: dua.situationLabelAr,
        reciterName: dua.audioReciter || 'تلاوة موثقة',
        url: dua.audioUrl,
        streamType: 'mp3'
      });
    }
  };

  // Save personal note for current Dua
  const handleSaveNote = () => {
    if (!selectedDua) return;
    setUserNotes((prev) => ({
      ...prev,
      [selectedDua.id]: noteDraft
    }));
    setNoteSavedFeedback(true);
    setTimeout(() => setNoteSavedFeedback(false), 2000);
  };

  // Add/remove from custom collection
  const toggleDuaInCollection = (collectionId: string, duaId: string) => {
    setCustomCollections((prev) =>
      prev.map((col) => {
        if (col.id !== collectionId) return col;
        const exists = col.duaIds.includes(duaId);
        return {
          ...col,
          duaIds: exists ? col.duaIds.filter((id) => id !== duaId) : [...col.duaIds, duaId]
        };
      })
    );
  };

  // Create new custom collection
  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newCol: DuaCustomCollection = {
      id: `col-${Date.now()}`,
      name: newCollectionName.trim(),
      description: 'مجموعة أدعية شخصية',
      color: '#C5A059',
      duaIds: selectedDua ? [selectedDua.id] : [],
      createdAt: new Date().toISOString()
    };

    setCustomCollections((prev) => [...prev, newCol]);
    setNewCollectionName('');
    setIsCreatingCollection(false);
  };

  // Font size classes
  const getArabicFontSize = () => {
    switch (fontSize) {
      case 'normal':
        return 'text-lg sm:text-xl leading-relaxed sm:leading-loose';
      case 'large':
        return 'text-xl sm:text-2xl leading-loose';
      case 'huge':
        return 'text-2xl sm:text-3xl leading-loose font-black';
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#F8FAF9] dark:bg-[#0B131E] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#072A20] via-[#0D382B] to-[#072A20] text-white py-12 md:py-16 border-b border-gold/25">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الموسوعة الشاملة للأدعية المأثورة والمحققة</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                موسوعة <span className="text-gold font-quran">الأدعية الإسلامية</span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                مكتبة جامعة ودليل رقمي متكامل لأدعية القرآن الكريم، والأدعية النبوية الثابتة في الصحيحين والسنن، والأدعية المأثورة المباحة، مصنفة حسب الأحوال اليومية والعبادات والشدائد بدقة شرعية فائقة.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 min-w-[280px]">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="text-xs text-slate-300 block">إجمالي الأدعية</span>
                <span className="text-xl font-black text-gold">{stats.totalCount} دعاء</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="text-xs text-slate-300 block">أدعية قرآنية</span>
                <span className="text-xl font-black text-white">{stats.quranicCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="text-xs text-slate-300 block">أدعية نبوية</span>
                <span className="text-xl font-black text-white">{stats.propheticCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
                <span className="text-xs text-slate-300 block">أدعية بصوت</span>
                <span className="text-xl font-black text-emerald-400">{stats.audioCount}</span>
              </div>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="relative max-w-3xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute right-4 text-gold pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchParams(e.target.value ? { q: e.target.value } : {});
                }}
                placeholder="ابحث في نصوص الأدعية، الكلمات، المناسبة، السورة، أو راوي الحديث..."
                className="w-full pr-12 pl-12 py-3.5 text-sm sm:text-base rounded-2xl bg-white/15 dark:bg-[#080E18]/80 text-white placeholder:text-slate-300 border border-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50 backdrop-blur-md transition-all shadow-xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

        {/* 2. Daily Dua Banner (دعاء اليوم المتجدد) */}
        {dailyDua && !searchQuery && selectedSituation === 'all' && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#072A20] to-[#0A3D2E] border border-gold/40 text-white p-6 sm:p-8 shadow-xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>دعاء اليوم المتجدد للتدبر والمناجاة</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-gold font-bold">
                    {dailyDua.situationLabelAr}
                  </span>
                  <span>{dailyDua.authenticityGradeLabelAr}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-200">
                  {dailyDua.title}
                </h2>
                <p className="font-quran text-2xl sm:text-3xl text-gold font-bold leading-loose py-2 select-text">
                  « {dailyDua.arabicText} »
                </p>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {dailyDua.explanationAr}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15 text-xs">
                <div className="text-slate-300 font-semibold">
                  المصدر: {dailyDua.quranReference ? `${dailyDua.quranReference.surahName} (${dailyDua.quranReference.ayahNumber})` : dailyDua.hadithSource?.bookName}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyDua(dailyDua)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition-all"
                  >
                    {copiedDuaId === dailyDua.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDuaId === dailyDua.id ? 'تم النسخ' : 'نسخ الدعاء'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenInCardStudio(dailyDua)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gold flex items-center gap-1.5 transition-all"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>تصميم بطاقة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openDuaDetail(dailyDua)}
                    className="px-4 py-1.5 rounded-xl gold-gradient text-royal font-black flex items-center gap-1.5 shadow-md hover:brightness-105"
                  >
                    <span>الشرح والتفاصيل الكاملة</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Main Navigation & Source Tabs */}
        <div className="space-y-4">
          {/* Main View Tabs (All, Favorites, Collections) */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'gold-gradient text-royal shadow-md font-black'
                    : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-gold'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>المكتبة الشاملة ({stats.totalCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'favorites'
                    ? 'gold-gradient text-royal shadow-md font-black'
                    : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-gold'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>أدعيتي المفضلة ({favorites.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('collections')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'collections'
                    ? 'gold-gradient text-royal shadow-md font-black'
                    : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-gold'
                }`}
              >
                <FolderHeart className="w-4 h-4 text-gold" />
                <span>مجموعاتي المخصصة ({customCollections.length})</span>
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-[#0E1726] p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 px-1 font-bold">الخط:</span>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  fontSize === 'normal' ? 'bg-gold text-royal font-black' : 'text-slate-500'
                }`}
              >
                عادي
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  fontSize === 'large' ? 'bg-gold text-royal font-black' : 'text-slate-500'
                }`}
              >
                كبير
              </button>
              <button
                type="button"
                onClick={() => setFontSize('huge')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  fontSize === 'huge' ? 'bg-gold text-royal font-black' : 'text-slate-500'
                }`}
              >
                ضخم
              </button>
            </div>
          </div>

          {/* Source Tabs (Only in All mode) */}
          {activeTab === 'all' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DUA_SOURCE_TABS.map((tab) => {
                  const isSelected = selectedSourceType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedSourceType(tab.id as DuaSourceType | 'all')}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-royal dark:bg-emerald-950 text-white border-gold shadow-md'
                          : 'bg-white dark:bg-[#0E1726] border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-gold/40'
                      }`}
                    >
                      <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-gold' : ''}`}>
                        {tab.labelAr}
                      </span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {tab.descriptionAr}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Situation Categories Carousel */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  التصنيف حسب الأحوال والمواقف الحياتية:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  <button
                    type="button"
                    onClick={() => setSelectedSituation('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedSituation === 'all'
                        ? 'bg-gold text-royal font-black shadow-sm'
                        : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-gold'
                    }`}
                  >
                    كافة الأحوال
                  </button>

                  {DUA_SITUATION_CATEGORIES.map((cat) => {
                    const isSelected = selectedSituation === cat.id;
                    const count = ALL_DUAS.filter((d) => d.situationId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedSituation(cat.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gold text-royal font-black shadow-sm'
                            : 'bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-gold'
                        }`}
                      >
                        <span>{cat.titleAr}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick filter checkboxes */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filterPrescribedCountOnly}
                    onChange={(e) => setFilterPrescribedCountOnly(e.target.checked)}
                    className="accent-[#C5A059] rounded"
                  />
                  <span>فقط ما له عدد مسنون (تكرار)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={filterAudioOnly}
                    onChange={(e) => setFilterAudioOnly(e.target.checked)}
                    className="accent-[#C5A059] rounded"
                  />
                  <span>فقط ما يتوفر له تسجيل صوتي</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* 4. Custom Collections Management View */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#0E1726] border border-gold/30">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FolderHeart className="w-5 h-5 text-gold" />
                  <span>مجموعاتي الدعائية المخصصة</span>
                </h3>
                <p className="text-xs text-slate-500">
                  يمكنك إنشاء مجموعاتك الخاصة لحفظ الأدعية وترتيبها حسب وردك أو حاجاتك مع إضافة ملاحظاتك الخاصة.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreatingCollection(true)}
                className="px-4 py-2 rounded-xl gold-gradient text-royal font-bold text-xs flex items-center gap-1.5 shrink-0 hover:brightness-105"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء مجموعة جديدة</span>
              </button>
            </div>

            {/* Create Collection Dialog */}
            {isCreatingCollection && (
              <form
                onSubmit={handleCreateCollection}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gold/40 space-y-3"
              >
                <h4 className="text-xs font-bold text-gold">اسم المجموعة الجديدة:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="مثلاً: أدعية الشفاء، أدعية قيام الليل، أدعية السفر..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl gold-gradient text-royal font-bold text-xs"
                  >
                    حفظ المجموعة
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCollection(false)}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}

            {/* Collections Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customCollections.map((col) => {
                const colDuas = ALL_DUAS.filter((d) => col.duaIds.includes(d.id));
                return (
                  <div
                    key={col.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-gold/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold">
                          <Bookmark className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {col.name}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {col.duaIds.length} دعاء محفوظ
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        مجموعة خاصة
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {col.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      {colDuas.slice(0, 3).map((d) => (
                        <div
                          key={d.id}
                          onClick={() => openDuaDetail(d)}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-gold/10 cursor-pointer flex items-center justify-between text-xs transition-colors"
                        >
                          <span className="font-semibold truncate max-w-[240px] text-slate-800 dark:text-slate-200">
                            {d.title}
                          </span>
                          <ChevronLeft className="w-3.5 h-3.5 text-gold shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Main Duas Grid */}
        {activeTab !== 'collections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>عرض {filteredDuas.length} دعاء مبارك</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gold hover:underline font-bold"
                >
                  مسح نتائج البحث
                </button>
              )}
            </div>

            {filteredDuas.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0E1726] border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                <AlertCircle className="w-10 h-10 text-gold mx-auto opacity-70" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  لم يتم العثور على أدعية مطابقة لبحثك
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  جرب البحث بكلمات أخرى، أو تصفح الأقسام حسب الأحوال (الصلاة، الكرب، الشفاء، اليوم والليلة)، أو إزالة علامات التشكيل.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSourceType('all');
                    setSelectedSituation('all');
                    setFilterPrescribedCountOnly(false);
                    setFilterAudioOnly(false);
                  }}
                  className="px-4 py-2 rounded-xl gold-gradient text-royal font-bold text-xs"
                >
                  إعادة ضبط كافة الفلاتر
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredDuas.map((dua) => {
                  const isFavorited = favorites.includes(dua.id);
                  const currentCount = counters[dua.id] || 0;
                  const targetCount = dua.prescribedCount || 1;
                  const isAudioPlaying = currentTrack?.id === dua.id && isPlaying;

                  return (
                    <motion.div
                      key={dua.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E1726] border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:border-gold/50 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      {/* Top Badges & Actions */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                dua.sourceType === 'quranic'
                                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                  : dua.sourceType === 'prophetic'
                                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                              }`}
                            >
                              {dua.sourceType === 'quranic'
                                ? 'قرآني'
                                : dua.sourceType === 'prophetic'
                                ? 'نبوي صحيح'
                                : 'جامع مباح'}
                            </span>

                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                              {dua.situationLabelAr}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => toggleFavorite(dua.id, e)}
                              className={`p-2 rounded-xl transition-colors ${
                                isFavorited
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                                  : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                            >
                              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleCopyDua(dua, e)}
                              className="p-2 rounded-xl text-slate-400 hover:text-gold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="نسخ نص الدعاء"
                            >
                              {copiedDuaId === dua.id ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleOpenInCardStudio(dua, e)}
                              className="p-2 rounded-xl text-slate-400 hover:text-gold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="تصميم بطاقة في استوديو البطاقات"
                            >
                              <Palette className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleShareDua(dua, e)}
                              className="p-2 rounded-xl text-slate-400 hover:text-gold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="مشاركة"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-gold transition-colors leading-snug">
                          {dua.title}
                        </h3>

                        {/* Arabic Text (Hero) */}
                        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070D18]/90 border border-slate-100 dark:border-slate-800/80">
                          <p
                            className={`font-quran text-slate-900 dark:text-amber-100 text-center select-text tracking-wide ${getArabicFontSize()}`}
                          >
                            « {dua.arabicText} »
                          </p>
                        </div>

                        {/* Occasion / Context note */}
                        <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          <span className="font-bold text-gold ml-1">المعنى:</span>
                          {dua.explanationAr}
                        </div>
                      </div>

                      {/* Bottom Details & Counter Bar */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold truncate max-w-[230px]">
                            {dua.quranReference
                              ? `${dua.quranReference.surahName} (${dua.quranReference.ayahNumber})`
                              : dua.hadithSource?.bookName || 'أدعية جامعة'}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            {dua.authenticityGradeLabelAr.split('(')[0]}
                          </span>
                        </div>

                        {/* Interactive Counter & Audio Player & Detail Trigger */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          {/* Audio Player Button (if audio exists) */}
                          {dua.audioUrl ? (
                            <button
                              type="button"
                              onClick={(e) => handlePlayAudio(dua, e)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isAudioPlaying
                                  ? 'bg-gold text-royal shadow-sm'
                                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                              }`}
                            >
                              {isAudioPlaying ? (
                                <>
                                  <Pause className="w-3.5 h-3.5" />
                                  <span>إيقاف</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>استماع</span>
                                </>
                              )}
                            </button>
                          ) : (
                            <div />
                          )}

                          {/* Counter / Tally Button */}
                          {dua.prescribedCount && dua.prescribedCount > 1 ? (
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                              <button
                                type="button"
                                onClick={(e) => incrementCounter(dua, e)}
                                className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                                  currentCount >= targetCount
                                    ? 'bg-emerald-600 text-white animate-pulse'
                                    : 'bg-white dark:bg-slate-700 text-royal dark:text-gold shadow-sm'
                                }`}
                              >
                                <span>{currentCount}</span> / <span>{targetCount}</span>
                              </button>
                              {currentCount > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => resetCounter(dua.id, e)}
                                  className="p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-400"
                                  title="تصفير العداد"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ) : null}

                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => openDuaDetail(dua)}
                            className="px-3 py-1.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/15 text-royal dark:text-gold text-xs font-bold flex items-center gap-1 transition-colors mr-auto"
                          >
                            <span>التفاصيل والشرح</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 6. Comprehensive Dua Detail Modal */}
      <AnimatePresence>
        {selectedDua && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#0E1726] rounded-3xl border border-gold/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 royal-gradient text-white flex items-center justify-between border-b border-gold/25">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gold text-royal">
                      {selectedDua.sourceType === 'quranic'
                        ? 'دعاء قرآني'
                        : selectedDua.sourceType === 'prophetic'
                        ? 'دعاء نبوي شريف'
                        : 'دعاء مأثور ومباح'}
                    </span>
                    <span className="text-xs text-slate-300">
                      {selectedDua.situationLabelAr} • {selectedDua.subSituationAr}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {selectedDua.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeDuaDetail}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Full Arabic Text Card */}
                <div className="p-6 rounded-2xl bg-[#072A20]/5 dark:bg-[#060D17] border border-gold/30 text-center space-y-3">
                  <p className="font-quran text-2xl sm:text-3xl text-slate-900 dark:text-amber-100 leading-loose select-text font-black">
                    « {selectedDua.arabicText} »
                  </p>
                  {selectedDua.transliteration && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      النطق اللاتيني: {selectedDua.transliteration}
                    </p>
                  )}
                </div>

                {/* Modal Sub-Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setDetailActiveTab('explanation')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      detailActiveTab === 'explanation'
                        ? 'gold-gradient text-royal font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                    }`}
                  >
                    الشرح والمعاني
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailActiveTab('source')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      detailActiveTab === 'source'
                        ? 'gold-gradient text-royal font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                    }`}
                  >
                    التخريج والمصدر
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailActiveTab('translations')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      detailActiveTab === 'translations'
                        ? 'gold-gradient text-royal font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                    }`}
                  >
                    الترجمة العالمية
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailActiveTab('notes')}
                    className={`px-3 py-1.5 rounded-xl transition-all ${
                      detailActiveTab === 'notes'
                        ? 'gold-gradient text-royal font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-gold'
                    }`}
                  >
                    ملاحظاتي الخاصة {userNotes[selectedDua.id] ? '(موجودة)' : ''}
                  </button>
                </div>

                {/* Tab 1: Explanation */}
                {detailActiveTab === 'explanation' && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gold" />
                        <span>الشرح اللغوي والشرعي:</span>
                      </h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {selectedDua.explanationAr}
                      </p>
                    </div>

                    {selectedDua.occasionContextAr && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gold" />
                          <span>المناسبة وسياق الورود:</span>
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                          {selectedDua.occasionContextAr}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Sources & Verification */}
                {detailActiveTab === 'source' && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                        <Award className="w-4 h-4" />
                        <span>درجة الثبوت والتحقيق الشرعي:</span>
                      </div>
                      <p className="text-emerald-900 dark:text-emerald-100 font-bold text-sm">
                        {selectedDua.authenticityGradeLabelAr}
                      </p>
                    </div>

                    {selectedDua.quranReference && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                        <h5 className="font-bold text-slate-800 dark:text-slate-200">
                          المرجع في المصحف الشريف:
                        </h5>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                          <li>اسم السورة: {selectedDua.quranReference.surahName} (رقم {selectedDua.quranReference.surahNumber})</li>
                          <li>رقم الآية: {selectedDua.quranReference.ayahNumber}</li>
                          {selectedDua.quranReference.fullVerseSnippet && (
                            <li className="font-quran text-slate-800 dark:text-slate-200 pt-1">
                              السياق القرآني: ﴿{selectedDua.quranReference.fullVerseSnippet}﴾
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {selectedDua.hadithSource && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                        <h5 className="font-bold text-slate-800 dark:text-slate-200">
                          تخريج الحديث النبوي:
                        </h5>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                          <li>الكتاب: {selectedDua.hadithSource.bookName}</li>
                          {selectedDua.hadithSource.numberOrRef && (
                            <li>الرقم / الباب: {selectedDua.hadithSource.numberOrRef}</li>
                          )}
                          {selectedDua.hadithSource.narrator && (
                            <li>الصحابي الراوي: {selectedDua.hadithSource.narrator}</li>
                          )}
                          {selectedDua.hadithSource.scholarGrading && (
                            <li>حكم المحدثين: {selectedDua.hadithSource.scholarGrading}</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {selectedDua.externalSourceUrl && (
                      <a
                        href={selectedDua.externalSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>التحقق من المصدر الرسمي المعتمد</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Tab 3: Translations */}
                {detailActiveTab === 'translations' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      {[
                        { code: 'en', label: 'English (الإنجليزية)' },
                        { code: 'ur', label: 'اردو (الأردية)' },
                        { code: 'fr', label: 'Français (الفرنسية)' },
                        { code: 'id', label: 'Indonesian (الإندونيسية)' },
                        { code: 'tr', label: 'Türkçe (التركية)' },
                        { code: 'bn', label: 'বাংলা (البنغالية)' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setSelectedLanguageCode(lang.code as any)}
                          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                            selectedLanguageCode === lang.code
                              ? 'gold-gradient text-royal font-black'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {selectedDua.translations?.[selectedLanguageCode] ||
                        'الترجمة المعتمدة لهذه اللغة قيد التدقيق الإضافي.'}
                    </div>
                  </div>
                )}

                {/* Tab 4: User Private Notes & Collections */}
                {detailActiveTab === 'notes' && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gold" />
                        <span>ملاحظاتك وخاطرتك الخاصة حول هذا الدعاء (محفوظة محلياً):</span>
                      </h4>
                      <textarea
                        rows={4}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        placeholder="اكتب هنا متى استجيب لك هذا الدعاء، أو تأملاتك، أو الأوقات التي تحب ترديده فيها..."
                        className="w-full p-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-gold"
                      />
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={handleSaveNote}
                          className="px-4 py-2 rounded-xl gold-gradient text-royal font-black flex items-center gap-1.5"
                        >
                          {noteSavedFeedback ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          <span>{noteSavedFeedback ? 'تم الحفظ' : 'حفظ الملاحظة'}</span>
                        </button>
                        <span className="text-[11px] text-slate-400">
                          بياناتك خاصة ومحفوظة في متصفحك فقط
                        </span>
                      </div>
                    </div>

                    {/* Add to collections */}
                    <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FolderHeart className="w-4 h-4 text-gold" />
                        <span>إضافة هذا الدعاء لمجموعاتك الخاصة:</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {customCollections.map((col) => {
                          const isInCol = col.duaIds.includes(selectedDua.id);
                          return (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => toggleDuaInCollection(col.id, selectedDua.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isInCol
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-gold'
                              }`}
                            >
                              {isInCol ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                              <span>{col.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(selectedDua.id)}
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition-all ${
                      favorites.includes(selectedDua.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favorites.includes(selectedDua.id) ? 'fill-white' : ''
                      }`}
                    />
                    <span>
                      {favorites.includes(selectedDua.id) ? 'في المفضلة' : 'إضافة للمفضلة'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyDua(selectedDua)}
                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-gold flex items-center gap-1.5 font-bold"
                  >
                    {copiedDuaId === selectedDua.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedDuaId === selectedDua.id ? 'تم النسخ' : 'نسخ الدعاء'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenInCardStudio(selectedDua)}
                    className="px-4 py-2 rounded-xl bg-royal text-gold font-bold flex items-center gap-1.5 hover:brightness-110"
                  >
                    <Palette className="w-4 h-4" />
                    <span>تصميم بطاقة في الاستوديو</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareDua(selectedDua)}
                    className="px-4 py-2 rounded-xl gold-gradient text-royal font-black flex items-center gap-1.5 shadow-md"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Simple Save icon helper component to avoid import confusion
const Save: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </svg>
);

export default DuasPage;

