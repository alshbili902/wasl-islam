import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hls from 'hls.js';
import { motion } from 'framer-motion';
import {
  Tv,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  Landmark,
  Sparkles,
  Compass,
  SkipForward,
  SkipBack,
  Radio,
  Square,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { RELIGIOUS_CHANNELS, ReligiousChannel } from '../data/channelsAndRadiosData';
import { useAudio } from '../context/AudioContext';

export const ChannelsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeVideoChannelId, notifyVideoStarted, notifyVideoStopped } = useAudio();

  const initialChannelId = searchParams.get('ch') || RELIGIOUS_CHANNELS[0].id;
  const [selectedChannel, setSelectedChannel] = useState<ReligiousChannel>(
    () => RELIGIOUS_CHANNELS.find((c) => c.id === initialChannelId) || RELIGIOUS_CHANNELS[0]
  );

  const [status, setStatus] = useState<'loading' | 'playing' | 'paused' | 'stopped' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [reloadNonce, setReloadNonce] = useState<number>(0);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const triedBackupRef = useRef<boolean>(false);

  const destroyHlsInstance = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  // Stop video immediately if an audio radio/recitation starts playing in AudioContext
  useEffect(() => {
    if (activeVideoChannelId === null && status === 'playing') {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      setStatus('paused');
    }
  }, [activeVideoChannelId, status]);

  const startStream = useCallback(
    (url: string, channel: ReligiousChannel) => {
      const video = videoRef.current;
      if (!video) return;

      destroyHlsInstance();
      video.pause();
      setStatus('loading');
      setErrorMessage(null);

      // Notify unified media coordinator so any radio/quran audio pauses
      notifyVideoStarted(channel.id);

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.volume = volume;
          video.muted = isMuted;
          video
            .play()
            .then(() => {
              setStatus('playing');
            })
            .catch(() => {
              // Respect browser autoplay policy: fallback to muted autoplay with clear unmute control
              video.muted = true;
              setIsMuted(true);
              video
                .play()
                .then(() => setStatus('playing'))
                .catch(() => setStatus('paused'));
            });
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            if (channel.backupStreamUrl && !triedBackupRef.current) {
              triedBackupRef.current = true;
              startStream(channel.backupStreamUrl, channel);
              return;
            }
            setStatus('error');
            setErrorMessage(
              `تعذر الاتصال بالبث المباشر لـ «${channel.nameAr}» حالياً. قد يكون الخادم الأصلي مشغولاً أو متوقفاً مؤقتاً.`
            );
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native Safari HLS playback
        video.src = url;
        video.load();
        video
          .play()
          .then(() => {
            setStatus('playing');
          })
          .catch(() => {
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => setStatus('playing'))
              .catch(() => setStatus('paused'));
          });
      } else {
        setStatus('error');
        setErrorMessage('متصفحك الحالي لا يدعم تشغيل البث المباشر بصيغة HLS / M3U8.');
      }
    },
    [destroyHlsInstance, isMuted, notifyVideoStarted, volume]
  );

  // Load ONLY the selected channel
  useEffect(() => {
    triedBackupRef.current = false;
    startStream(selectedChannel.streamUrl, selectedChannel);

    return () => {
      destroyHlsInstance();
    };
  }, [selectedChannel, reloadNonce]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectChannel = (channel: ReligiousChannel) => {
    setSelectedChannel(channel);
    setSearchParams({ ch: channel.id });
  };

  const handleNextPrevChannel = (delta: number) => {
    const idx = RELIGIOUS_CHANNELS.findIndex((c) => c.id === selectedChannel.id);
    const nextIdx = (idx + delta + RELIGIOUS_CHANNELS.length) % RELIGIOUS_CHANNELS.length;
    handleSelectChannel(RELIGIOUS_CHANNELS[nextIdx]);
  };

  const handleTogglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (status === 'stopped' || status === 'error') {
      setReloadNonce((n) => n + 1);
      return;
    }
    if (video.paused) {
      notifyVideoStarted(selectedChannel.id);
      video
        .play()
        .then(() => setStatus('playing'))
        .catch(() => setReloadNonce((n) => n + 1));
    } else {
      video.pause();
      setStatus('paused');
    }
  };

  const handleStopStreamCompletely = () => {
    destroyHlsInstance();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    notifyVideoStopped();
    setStatus('stopped');
  };

  const handleVolumeChange = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    setIsMuted(clamped === 0);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
    }
  };

  const handleFullscreen = () => {
    const container = videoContainerRef.current;
    const video = videoRef.current;
    if (container && container.requestFullscreen) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        container.requestFullscreen().catch(() => {});
      }
    } else if (video && (video as unknown as { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (video as unknown as { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  };

  const getChannelIcon = (iconName: ReligiousChannel['iconName']) => {
    switch (iconName) {
      case 'BookOpen':
        return BookOpen;
      case 'Landmark':
        return Landmark;
      case 'Sparkles':
        return Sparkles;
      default:
        return Compass;
    }
  };

  const ActiveIcon = getChannelIcon(selectedChannel.iconName);

  return (
    <PageWrapper
      title={`القنوات الدينية المباشرة — ${selectedChannel.nameAr}`}
      description="مشاهدة البث المباشر لقناة القرآن الكريم، قناة السنة النبوية، قناة الرسالة، وقناة إقرأ بجودة عالية عبر مشغل HLS متطور."
    >
      <div className="space-y-8">
        {/* 1. Architectural Hero Header (No images) */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>بث فضائي مباشر • مشغل HLS الذكي</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                القنوات الدينية المباشرة
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                شاهد البث الفضائي المباشر لقنوات القرآن الكريم والسنة النبوية والرسالة وإقرأ من مصادرها الرسمية، مع إيقاف تلقائي لأي بث سابق لضمان استقرار الأداء.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/radio"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-gold text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-colors"
              >
                <Radio className="w-4 h-4" />
                <span>الانتقال إلى مكتبة الإذاعات الإسلامية</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Main HLS Video Player Studio */}
        <section className="glass-panel rounded-3xl p-4 sm:p-6 lg:p-8 border border-gold/35 shadow-2xl space-y-5">
          {/* Top Status & Channel Title Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl royal-gradient border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-gold-glow">
                <ActiveIcon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-2xl font-black text-royal dark:text-white truncate">
                    {selectedChannel.nameAr}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                      status === 'playing'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
                        : status === 'loading'
                        ? 'bg-gold/15 border-gold/40 text-gold'
                        : status === 'error'
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                        : 'bg-slate-500/15 border-slate-400/30 text-slate-500 dark:text-slate-300'
                    }`}
                  >
                    {status === 'playing' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>بث مباشر متصل</span>
                      </>
                    )}
                    {status === 'loading' && (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>جاري الاتصال بالبث...</span>
                      </>
                    )}
                    {status === 'paused' && <span>متوقف مؤقتاً</span>}
                    {status === 'stopped' && <span>تم إغلاق البث</span>}
                    {status === 'error' && <span>البث غير متاح حالياً</span>}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {selectedChannel.categoryAr} • {selectedChannel.countryAr}
                </p>
              </div>
            </div>

            {/* Quick Channel Switcher Pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleNextPrevChannel(-1)}
                title="القناة السابقة"
                className="px-3 py-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 border border-gold/25 text-xs font-bold text-royal dark:text-gold inline-flex items-center gap-1 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
                <span className="hidden sm:inline">السابقة</span>
              </button>
              <button
                type="button"
                onClick={() => handleNextPrevChannel(1)}
                title="القناة التالية"
                className="px-3 py-2 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 border border-gold/25 text-xs font-bold text-royal dark:text-gold inline-flex items-center gap-1 transition-colors"
              >
                <span className="hidden sm:inline">التالية</span>
                <SkipBack className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pure Video Frame (Zero Poster / Zero Images) */}
          <div
            ref={videoContainerRef}
            className="relative rounded-3xl overflow-hidden bg-[#050C12] border-2 border-gold/40 aspect-video max-h-[560px] w-full mx-auto shadow-2xl"
          >
            <video
              ref={videoRef}
              playsInline
              onPlay={() => {
                notifyVideoStarted(selectedChannel.id);
                setStatus('playing');
              }}
              onPause={() => {
                if (status !== 'stopped' && status !== 'error') {
                  setStatus('paused');
                }
              }}
              className="w-full h-full object-contain bg-[#050C12]"
            />

            {/* Loading State Overlay (Pure CSS + SVG, no images) */}
            {status === 'loading' && (
              <div className="absolute inset-0 royal-gradient/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-gold/15 border border-gold/45 flex items-center justify-center text-gold shadow-gold-glow">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-black text-gold">
                    جاري تهيئة البث المباشر لـ {selectedChannel.nameAr}
                  </h3>
                  <p className="text-xs text-slate-300">
                    يتم الاتصال بالمصدر الرسمي عبر بروتوكول HLS (M3U8)...
                  </p>
                </div>
              </div>
            )}

            {/* Stopped State Overlay */}
            {status === 'stopped' && (
              <div className="absolute inset-0 royal-gradient flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                  <Tv className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-gold">
                    تم إيقاف البث المباشر
                  </h3>
                  <p className="text-xs text-slate-300">
                    اضغط على زر التشغيل أدناه لاستئناف مشاهدة {selectedChannel.nameAr}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReloadNonce((n) => n + 1)}
                  className="px-5 py-2.5 rounded-2xl gold-gradient text-royal font-extrabold text-xs inline-flex items-center gap-2 shadow-gold-glow"
                >
                  <Play className="w-4 h-4" />
                  <span>تشغيل القناة الآن</span>
                </button>
              </div>
            )}

            {/* Error State Overlay */}
            {status === 'error' && (
              <div className="absolute inset-0 bg-[#072A20]/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-gold">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-lg font-black text-gold">
                    تنبيه انقطاع البث المباشر
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {errorMessage || 'الرابط غير متاح مؤقتاً أو يواجه ضغطاً في المصدر.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setReloadNonce((n) => n + 1)}
                    className="px-5 py-2.5 rounded-2xl gold-gradient text-royal font-extrabold text-xs inline-flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>إعادة تحميل البث</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNextPrevChannel(1)}
                    className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-white font-bold text-xs"
                  >
                    الانتقال للقناة التالية
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Custom Studio Controls Bar */}
          <div className="p-3.5 sm:p-4 rounded-2xl royal-gradient text-white border border-gold/35 flex flex-wrap items-center justify-between gap-3">
            {/* Left/Right Play, Pause, Stop, Reload */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlayPause}
                className="px-4 py-2.5 rounded-xl gold-gradient text-royal font-extrabold text-xs inline-flex items-center gap-1.5 shadow-sm hover:scale-[1.02] transition-transform"
              >
                {status === 'playing' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>إيقاف مؤقت</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>تشغيل البث</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setReloadNonce((n) => n + 1)}
                title="إعادة تحميل البث عند الانقطاع"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-gold/30 text-xs font-bold text-gold inline-flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تحميل البث</span>
              </button>

              <button
                type="button"
                onClick={handleStopStreamCompletely}
                title="إغلاق البث بالكامل"
                className="px-3 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-xs font-bold text-rose-200 inline-flex items-center gap-1.5 transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">إغلاق المشغل</span>
              </button>
            </div>

            {/* Volume, Mute, Fullscreen */}
            <div className="flex items-center gap-3">
              {/* Volume & Mute */}
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                  className="text-gold hover:scale-110 transition-transform"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  aria-label="التحكم بمستوى الصوت"
                  className="w-20 sm:w-24 accent-[#C5A059] cursor-pointer"
                />
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={handleFullscreen}
                title="ملء الشاشة"
                aria-label="ملء الشاشة"
                className="px-3.5 py-2.5 rounded-xl bg-gold/20 hover:bg-gold/30 border border-gold/40 text-gold text-xs font-extrabold inline-flex items-center gap-1.5 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="hidden sm:inline">ملء الشاشة</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Elegant Glassmorphism Channel Cards Grid (Zero Images) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-royal dark:text-white flex items-center gap-2">
                <Tv className="w-6 h-6 text-gold" />
                <span>باقة القنوات الدينية المباشرة (4 قنوات رسمية)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                اضغط على أي بطاقة لتشغيل القناة فوراً داخل المشغل الرئيسي وإيقاف البث السابق تلقائياً
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {RELIGIOUS_CHANNELS.map((channel, index) => {
              const Icon = getChannelIcon(channel.iconName);
              const isSelected = channel.id === selectedChannel.id;
              const isActivelyStreaming = isSelected && status === 'playing';

              return (
                <motion.button
                  key={channel.id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleSelectChannel(channel)}
                  className={`w-full text-right rounded-3xl p-6 border transition-all flex flex-col justify-between gap-5 relative overflow-hidden ${
                    isSelected
                      ? `bg-gradient-to-br ${channel.accentGradient} text-white border-gold shadow-gold-glow`
                      : 'glass-panel border-gold/25 hover:border-gold text-royal dark:text-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 w-full">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-13 h-13 p-3.5 rounded-2xl border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'gold-gradient text-royal border-gold shadow-sm'
                            : 'royal-gradient text-gold border-gold/35'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-[11px] font-bold block ${
                            isSelected ? 'text-gold' : 'text-gold'
                          }`}
                        >
                          {channel.categoryAr}
                        </span>
                        <h3 className="text-lg sm:text-xl font-black truncate">
                          {channel.nameAr}
                        </h3>
                      </div>
                    </div>

                    {/* Animated Live Indicator / Sound Waves */}
                    <div className="shrink-0">
                      {isActivelyStreaming ? (
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold inline-flex items-center gap-2">
                          <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                            {[0.5, 1, 0.65, 0.9].map((h, i) => (
                              <motion.span
                                key={i}
                                animate={{ height: ['25%', `${h * 100}%`, '30%'] }}
                                transition={{ duration: 0.6 + i * 0.12, repeat: Infinity }}
                                className="w-1 bg-emerald-400 rounded-full block"
                              />
                            ))}
                          </div>
                          <span>يعرض الآن</span>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-white/15 border-gold/40 text-gold'
                              : 'bg-gold/10 border-gold/25 text-royal dark:text-gold'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                          <span>{channel.qualityBadge}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isSelected ? 'text-slate-200' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {channel.subtitleAr}
                  </p>

                  <div className="w-full pt-3 border-t border-gold/20 flex items-center justify-between text-xs font-extrabold">
                    <span className={isSelected ? 'text-gold' : 'text-slate-500 dark:text-slate-400'}>
                      {channel.countryAr}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-gold">
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>القناة المختارة في المشغل</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>اضغط للمشاهدة المباشرة</span>
                        </>
                      )}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

