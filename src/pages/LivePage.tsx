import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hls from 'hls.js';
import { motion } from 'framer-motion';
import {
  Radio,
  Tv,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Volume2,
  Link2,
  CheckCircle2,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { LIVE_TV_STREAMS, RADIO_STATIONS, LiveTvStream } from '../data/liveChannelsData';
import { useAudio } from '../context/AudioContext';

export const LivePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    playTrack,
    currentTrack,
    isPlaying,
    togglePlay,
    activeVideoChannelId,
    notifyVideoStarted,
  } = useAudio();

  const initialChannelId = searchParams.get('channel') || LIVE_TV_STREAMS[0].id;
  const [selectedTv, setSelectedTv] = useState<LiveTvStream>(
    () => LIVE_TV_STREAMS.find((c) => c.id === initialChannelId) || LIVE_TV_STREAMS[0]
  );
  const [useBackupServer, setUseBackupServer] = useState<boolean>(false);
  const [customM3u8Url, setCustomM3u8Url] = useState<string>('');
  const [activeStreamUrl, setActiveStreamUrl] = useState<string>(selectedTv.hlsUrl);
  const [videoStatus, setVideoStatus] = useState<'loading' | 'playing' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCounter, setRetryCounter] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const nextUrl =
      useBackupServer && selectedTv.backupHlsUrl ? selectedTv.backupHlsUrl : selectedTv.hlsUrl;
    setActiveStreamUrl(nextUrl);
  }, [selectedTv, useBackupServer]);

  // Stop video if audio starts in AudioContext
  useEffect(() => {
    if (activeVideoChannelId === null && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [activeVideoChannelId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeStreamUrl) return;

    setVideoStatus('loading');
    setErrorMessage(null);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;

      hls.loadSource(activeStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setVideoStatus('playing');
        notifyVideoStarted(selectedTv.id);
        video.play().catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setVideoStatus('error');
          setErrorMessage(
            'تعذر الاتصال بخادم البث المرئي المباشر (M3U8) حالياً. يمكنك التبديل للخادم الاحتياطي أو الانتقال لقسم القنوات الدينية.'
          );
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        setVideoStatus('playing');
        notifyVideoStarted(selectedTv.id);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setVideoStatus('error');
        setErrorMessage('انقطع الاتصال بخادم البث المباشر. يرجى التبديل للخادم الاحتياطي أو إعادة المحاولة.');
      });
    } else {
      setVideoStatus('error');
      setErrorMessage('متصفحك الحالي لا يدعم تشغيل بث الفيديو M3U8 مباشرة.');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeStreamUrl, retryCounter, notifyVideoStarted, selectedTv.id]);

  const handleSelectChannel = (stream: LiveTvStream) => {
    setSelectedTv(stream);
    setUseBackupServer(false);
    setSearchParams({ channel: stream.id });
  };

  const handleApplyCustomM3u8 = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customM3u8Url.trim();
    if (!trimmed) return;
    setActiveStreamUrl(trimmed);
    setRetryCounter((c) => c + 1);
  };

  return (
    <PageWrapper
      title="البث المباشر للحرمين وإذاعات القرآن"
      description="مشاهدة البث المباشر للمسجد الحرام والمسجد النبوي الشريف على مدار الساعة والاستماع لإذاعات القرآن الكريم الموثوقة."
    >
      <div className="space-y-10">
        {/* Hero Banner */}
        <section className="rounded-3xl royal-gradient text-white p-6 sm:p-8 border border-gold/35 shadow-xl relative overflow-hidden">
          <div className="islamic-pattern absolute inset-0 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>بث حي متواصل 24 ساعة • الحرمين الشريفين وإذاعات القرآن</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">
                الإذاعة والبث المباشر للحرمين الشريفين
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
                شاهد البث المباشر لقناة القرآن الكريم من المسجد الحرام وقناة السنة النبوية من المسجد النبوي الشريف، أو انتقل إلى قسم القنوات الدينية ومكتبة الإذاعات الإسلامية الشاملة.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to="/channels"
                className="px-4 py-2.5 rounded-2xl gold-gradient text-royal font-extrabold text-xs inline-flex items-center gap-2 shadow-gold-glow"
              >
                <Tv className="w-4 h-4" />
                <span>قسم القنوات الدينية (4 قنوات)</span>
              </Link>
              <Link
                to="/radio"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold/35 text-gold font-extrabold text-xs inline-flex items-center gap-2"
              >
                <Radio className="w-4 h-4" />
                <span>مكتبة الإذاعات الإسلامية</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Part 1: Live Haramain TV Video Player */}
        <section className="glass-panel rounded-3xl p-5 sm:p-8 border border-gold/30 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/20 pb-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {LIVE_TV_STREAMS.map((ch) => {
                const active = ch.id === selectedTv.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => handleSelectChannel(ch)}
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 border ${
                      active
                        ? 'royal-gradient text-white border-gold shadow-gold-glow'
                        : 'bg-royal/5 dark:bg-white/5 border-gold/20 text-royal dark:text-slate-200 hover:border-gold'
                    }`}
                  >
                    <Tv className="w-4 h-4 text-gold" />
                    <span>{ch.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseBackupServer(!useBackupServer)}
                className="px-3.5 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-xs font-extrabold text-royal dark:text-gold"
              >
                {useBackupServer ? 'الخادم الاحتياطي مفعل' : 'التبديل للخادم الاحتياطي'}
              </button>
              <button
                type="button"
                onClick={() => setRetryCounter((c) => c + 1)}
                title="إعادة تحميل البث"
                className="p-2.5 rounded-xl bg-royal/5 dark:bg-white/5 hover:bg-gold/20 text-gold border border-gold/25"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-[#050C12] border-2 border-gold/40 aspect-video max-h-[540px] w-full mx-auto shadow-2xl">
            <video
              ref={videoRef}
              controls
              playsInline
              onPlay={() => notifyVideoStarted(selectedTv.id)}
              className="w-full h-full object-contain bg-[#050C12]"
            />

            {videoStatus === 'loading' && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white p-6 text-center">
                <RefreshCw className="w-8 h-8 text-gold animate-spin" />
                <p className="text-sm sm:text-base font-extrabold text-gold">
                  جاري الاتصال بخادم البث المباشر ({selectedTv.title})...
                </p>
                <p className="text-xs text-slate-300">بروتوكول البث المباشر HLS (M3U8)</p>
              </div>
            )}

            {videoStatus === 'error' && errorMessage && (
              <div className="absolute inset-0 bg-[#072A20]/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-white p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-gold" />
                <div className="max-w-lg space-y-2">
                  <h3 className="text-lg font-extrabold text-gold">
                    تنبيه اتصال البث المرئي المباشر
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {errorMessage}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUseBackupServer(!useBackupServer);
                      setRetryCounter((c) => c + 1);
                    }}
                    className="px-4 py-2.5 rounded-xl gold-gradient text-royal font-extrabold text-xs inline-flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>تجربة الخادم البديل وإعادة المحاولة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      playTrack({
                        id: RADIO_STATIONS[0].id,
                        title: RADIO_STATIONS[0].name,
                        subtitle: RADIO_STATIONS[0].category,
                        reciterName: RADIO_STATIONS[0].country,
                        url: RADIO_STATIONS[0].streamUrl,
                        isLive: true,
                      })
                    }
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-gold/40 text-white font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4 text-gold" />
                    <span>تشغيل البث الصوتي المباشر للقرآن الكريم</span>
                  </button>

                  <a
                    href={selectedTv.youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-gold font-bold text-xs inline-flex items-center gap-1.5"
                  >
                    <span>القناة الرسمية على يوتيوب</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleApplyCustomM3u8}
            className="p-4 rounded-2xl bg-royal/5 dark:bg-white/5 border border-gold/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-royal dark:text-gold shrink-0">
              <Link2 className="w-4 h-4 text-gold" />
              <span>تشغيل رابط بث مباشر مخصص (M3U8 / M3U):</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <input
                type="url"
                dir="ltr"
                value={customM3u8Url}
                onChange={(e) => setCustomM3u8Url(e.target.value)}
                placeholder="https://example.com/live/playlist.m3u8"
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B131E] border border-gold/30 text-xs font-mono text-royal dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl royal-gradient text-gold text-xs font-extrabold shrink-0"
              >
                تشغيل الرابط
              </button>
            </div>
          </form>
        </section>

        {/* Part 2: Quick Radio Stations */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-royal dark:text-white flex items-center gap-2">
                <Radio className="w-6 h-6 text-gold" />
                <span>مختارات إذاعات القرآن الكريم</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                اضغط على أي إذاعة لتشغيلها فوراً، أو تصفح المكتبة الكاملة في قسم الإذاعات الإسلامية
              </p>
            </div>
            <Link
              to="/radio"
              className="px-4 py-2 rounded-xl bg-gold/15 hover:bg-gold/25 border border-gold/35 text-xs font-extrabold text-royal dark:text-gold self-start sm:self-auto"
            >
              عرض المكتبة الإذاعية الكاملة (10 تصنيفات)
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RADIO_STATIONS.map((station) => {
              const isCurrentStation = currentTrack?.id === station.id;
              const activePlaying = isCurrentStation && isPlaying;

              return (
                <motion.div
                  key={station.id}
                  whileHover={{ y: -3 }}
                  className={`glass-panel rounded-3xl p-5 border transition-all flex flex-col justify-between gap-4 ${
                    activePlaying
                      ? 'royal-gradient text-white border-gold shadow-gold-glow'
                      : 'border-gold/25 hover:border-gold'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-extrabold ${
                          activePlaying
                            ? 'bg-gold text-royal'
                            : 'bg-gold/15 text-royal dark:text-gold border border-gold/25'
                        }`}
                      >
                        {station.category}
                      </span>
                      {activePlaying && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-300 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          يبث الآن
                        </span>
                      )}
                    </div>

                    <h3
                      className={`font-extrabold text-base ${
                        activePlaying ? 'text-white' : 'text-royal dark:text-white'
                      }`}
                    >
                      {station.name}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed ${
                        activePlaying ? 'text-slate-200' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {station.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isCurrentStation) {
                        togglePlay();
                      } else {
                        playTrack({
                          id: station.id,
                          title: station.name,
                          subtitle: station.category,
                          reciterName: station.country,
                          url: station.streamUrl,
                          isLive: true,
                        });
                      }
                    }}
                    className={`w-full py-2.5 px-4 rounded-2xl font-extrabold text-xs inline-flex items-center justify-center gap-2 transition-all ${
                      activePlaying
                        ? 'gold-gradient text-royal shadow-sm'
                        : 'royal-gradient text-white hover:opacity-95'
                    }`}
                  >
                    {activePlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>إيقاف البث المباشر</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 text-gold" />
                        <span>تشغيل الإذاعة الآن</span>
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};
