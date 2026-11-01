import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  ListMusic,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  Radio,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

function formatAudioSeconds(secs: number): string {
  if (!Number.isFinite(secs) || secs <= 0) return '00:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const GlobalAudioPlayer: React.FC = () => {
  const {
    currentTrack,
    playlist,
    currentIndex,
    isPlaying,
    isLoading,
    error,
    currentTime,
    duration,
    volume,
    isMuted,
    repeatMode,
    isMinimized,
    isPlaylistOpen,
    playTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    toggleMute,
    cycleRepeatMode,
    setIsMinimized,
    setIsPlaylistOpen,
    closePlayer,
  } = useAudio();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pointer-events-none px-2 sm:px-4 pb-2 sm:pb-3">
      <div className="max-w-6xl mx-auto pointer-events-auto">
        {/* Playlist Drawer */}
        <AnimatePresence>
          {isPlaylistOpen && !isMinimized && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-2 rounded-2xl glass-panel border border-gold/30 shadow-2xl overflow-hidden max-h-72 flex flex-col"
            >
              <div className="px-4 py-3 royal-gradient text-white flex items-center justify-between border-b border-gold/20">
                <div className="flex items-center gap-2">
                  <ListMusic className="w-4 h-4 text-gold" />
                  <span className="text-sm font-bold">
                    قائمة التشغيل ({playlist.length} {playlist.length === 1 ? 'مقطع' : 'سورة/مقطع'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlaylistOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto p-2 space-y-1 bg-[#F8FAF9]/95 dark:bg-[#0B131E]/95">
                {playlist.map((item, idx) => {
                  const active = item.id === currentTrack.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => playTrack(item, playlist)}
                      className={`w-full text-right px-3 py-2 rounded-xl flex items-center justify-between gap-2 text-xs transition-all ${
                        active
                          ? 'royal-gradient text-white font-bold border border-gold/40'
                          : 'hover:bg-gold/10 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-gold/20 text-gold flex items-center justify-center font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <p className="truncate">{item.title}</p>
                          <p className={`text-[11px] truncate ${active ? 'text-gold/90' : 'text-slate-400'}`}>
                            {item.reciterName}
                          </p>
                        </div>
                      </div>
                      {active && isPlaying && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold text-royal font-bold shrink-0">
                          يعمل الآن
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Pill Player */}
        {isMinimized ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mr-auto w-fit max-w-full royal-gradient text-white rounded-2xl border border-gold/40 shadow-2xl px-3.5 py-2.5 flex items-center gap-3"
          >
            {/* Animated Sound Waves */}
            <div className="flex items-end gap-0.5 h-4 shrink-0" aria-hidden="true">
              {[0.5, 0.9, 0.6, 1].map((h, i) => (
                <motion.span
                  key={i}
                  animate={
                    isPlaying
                      ? { height: ['25%', `${h * 100}%`, '35%'] }
                      : { height: '25%' }
                  }
                  transition={{ duration: 0.7 + i * 0.15, repeat: Infinity }}
                  className="w-1 bg-gold rounded-full block"
                />
              ))}
            </div>

            <div className="min-w-0 max-w-[170px] sm:max-w-xs">
              <p className="text-xs font-bold truncate text-gold">{currentTrack.title}</p>
              <p className="text-[10px] text-slate-300 truncate">{currentTrack.reciterName}</p>
            </div>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              className="w-8 h-8 rounded-xl gold-gradient text-royal flex items-center justify-center shrink-0"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              title="تكبير المشغل"
              aria-label="تكبير المشغل"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gold shrink-0"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          /* Full Expanded Bar Player */
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="royal-gradient text-white rounded-2xl border border-gold/40 shadow-2xl p-3 sm:p-4"
          >
            {error && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center justify-between">
                <span className="truncate">{error}</span>
              </div>
            )}

            {/* Top Progress Scrubber (hidden for live radio streams) */}
            {!currentTrack.isLive && (
              <div className="mb-2.5 flex items-center gap-2.5 text-[11px] text-slate-300">
                <span className="font-mono w-10 text-left shrink-0">{formatAudioSeconds(currentTime)}</span>
                <div className="relative flex-1 h-2 bg-white/15 rounded-full overflow-hidden cursor-pointer group">
                  <div
                    className="absolute top-0 right-0 bottom-0 gold-gradient rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.5}
                    value={currentTime}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    aria-label="شريط تقدم التلاوة"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="font-mono w-10 text-right shrink-0">{formatAudioSeconds(duration)}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Track Info + Animated Waveforms */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center shrink-0">
                  {currentTrack.isLive ? (
                    <Radio className="w-5 h-5 text-gold animate-pulse" />
                  ) : (
                    <div className="flex items-end gap-0.5 h-5" aria-hidden="true">
                      {[0.45, 0.95, 0.65, 1, 0.55].map((h, i) => (
                        <motion.span
                          key={i}
                          animate={
                            isPlaying
                              ? { height: ['22%', `${h * 100}%`, '30%'] }
                              : { height: '25%' }
                          }
                          transition={{ duration: 0.65 + i * 0.12, repeat: Infinity }}
                          className="w-1 bg-gold rounded-full block"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm sm:text-base text-gold truncate">
                      {currentTrack.title}
                    </p>
                    {currentTrack.isLive && (
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold shrink-0">
                        بث مباشر
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 truncate">
                    القارئ: {currentTrack.reciterName}
                    {currentTrack.subtitle ? ` • ${currentTrack.subtitle}` : ''}
                  </p>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={prevTrack}
                  title="السابق"
                  aria-label="المقطع السابق"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                  className="w-11 h-11 rounded-2xl gold-gradient text-royal font-bold flex items-center justify-center shadow-gold-glow hover:scale-105 transition-transform"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={nextTrack}
                  title="التالي"
                  aria-label="المقطع التالي"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              </div>

              {/* Extra Controls: Repeat, Volume, Playlist, Minimize, Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={cycleRepeatMode}
                  title={
                    repeatMode === 'one'
                      ? 'تكرار السورة الحالية'
                      : repeatMode === 'all'
                      ? 'تشغيل متتابع للقائمة'
                      : 'إيقاف التكرار'
                  }
                  className={`p-2 rounded-xl transition-colors ${
                    repeatMode !== 'off'
                      ? 'bg-gold/25 text-gold border border-gold/40'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>

                {/* Volume Control on sm+ */}
                <div className="hidden md:flex items-center gap-1.5 bg-white/10 px-2.5 py-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
                    className="text-gold"
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
                    onChange={(e) => setVolume(Number(e.target.value))}
                    aria-label="مستوى الصوت"
                    className="w-16 accent-[#C5A059] cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                  title="قائمة التشغيل"
                  aria-label="قائمة التشغيل"
                  className={`p-2 rounded-xl transition-colors relative ${
                    isPlaylistOpen
                      ? 'bg-gold text-royal font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ListMusic className="w-4 h-4" />
                  {playlist.length > 1 && (
                    <span className="sr-only">{playlist.length} عناصر في القائمة</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  title="تصغير المشغل"
                  aria-label="تصغير المشغل"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gold transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={closePlayer}
                  title="إغلاق المشغل"
                  aria-label="إغلاق المشغل"
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

