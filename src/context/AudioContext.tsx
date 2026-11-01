import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { AudioTrack, Reciter } from '../types';
import { SURAHS_META } from '../data/surahsMeta';
import { getSurahAudioUrl } from '../data/recitersData';

interface AudioContextType {
  currentTrack: AudioTrack | null;
  playlist: AudioTrack[];
  currentIndex: number;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'off' | 'one' | 'all';
  isMinimized: boolean;
  isPlaylistOpen: boolean;
  favoriteRadios: string[];
  lastPlayedRadio: AudioTrack | null;
  activeVideoChannelId: string | null;
  playTrack: (track: AudioTrack, queue?: AudioTrack[]) => void;
  playReciterSurah: (reciter: Reciter, surahNumber: number) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  cycleRepeatMode: () => void;
  setIsMinimized: (val: boolean) => void;
  setIsPlaylistOpen: (val: boolean) => void;
  closePlayer: () => void;
  toggleFavoriteRadio: (radioId: string) => void;
  notifyVideoStarted: (channelId: string) => void;
  notifyVideoStopped: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const triedBackupRef = useRef<boolean>(false);
  const currentTrackRef = useRef<AudioTrack | null>(null);

  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('all');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [activeVideoChannelId, setActiveVideoChannelId] = useState<string | null>(null);

  const [favoriteRadios, setFavoriteRadios] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('madar_fav_radios_v1');
      return saved ? JSON.parse(saved) : ['saudi-quran-official', 'haram-makkah-audio'];
    } catch {
      return ['saudi-quran-official', 'haram-makkah-audio'];
    }
  });

  const [lastPlayedRadio, setLastPlayedRadio] = useState<AudioTrack | null>(() => {
    try {
      const saved = localStorage.getItem('madar_last_radio_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('madar_fav_radios_v1', JSON.stringify(favoriteRadios));
    } catch {
      // ignore
    }
  }, [favoriteRadios]);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const attachSourceAndPlay = useCallback(
    (url: string, isHlsStream: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;

      destroyHls();
      audio.pause();
      setIsLoading(true);
      setError(null);

      if (isHlsStream && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
              setIsPlaying(false);
            });
        });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) {
            const track = currentTrackRef.current;
            if (track?.backupUrl && !triedBackupRef.current) {
              triedBackupRef.current = true;
              const backupIsHls = track.backupUrl.toLowerCase().includes('.m3u8');
              attachSourceAndPlay(track.backupUrl, backupIsHls);
            } else {
              setIsLoading(false);
              setIsPlaying(false);
              setError('تعذر الاتصال بخادم البث الصوتي حالياً. يرجى المحاولة مرة أخرى أو اختيار محطة أخرى.');
            }
          }
        });
      } else {
        audio.src = url;
        audio.load();
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            // Handle fallback if primary stream failed
            const track = currentTrackRef.current;
            if (track?.backupUrl && !triedBackupRef.current) {
              triedBackupRef.current = true;
              const backupIsHls = track.backupUrl.toLowerCase().includes('.m3u8');
              attachSourceAndPlay(track.backupUrl, backupIsHls);
            } else {
              setIsLoading(false);
              setIsPlaying(false);
            }
          });
      }
    },
    [destroyHls]
  );

  // Initialize single persistent HTMLAudioElement
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onDurationChange = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onLoadStart = () => {
      setIsLoading(true);
    };
    const onCanPlay = () => setIsLoading(false);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setError(null);
    };
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      const track = currentTrackRef.current;
      if (track?.backupUrl && !triedBackupRef.current) {
        triedBackupRef.current = true;
        const backupIsHls = track.backupUrl.toLowerCase().includes('.m3u8');
        attachSourceAndPlay(track.backupUrl, backupIsHls);
        return;
      }
      setIsLoading(false);
      setIsPlaying(false);
      setError('تعذر تشغيل هذا البث حالياً. جرب إعادة المحاولة أو اختيار بث آخر.');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      destroyHls();
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
    };
  }, [attachSourceAndPlay, destroyHls]);

  const loadAndPlay = useCallback(
    (track: AudioTrack) => {
      // Stop any active video channel so video and audio never play simultaneously
      setActiveVideoChannelId(null);
      currentTrackRef.current = track;
      triedBackupRef.current = false;

      if (track.isLive) {
        setLastPlayedRadio(track);
        try {
          localStorage.setItem('madar_last_radio_v1', JSON.stringify(track));
        } catch {
          // ignore
        }
      }

      const isHls =
        track.streamType === 'hls' || track.url.toLowerCase().includes('.m3u8');
      attachSourceAndPlay(track.url, isHls);
    },
    [attachSourceAndPlay]
  );

  const playTrack = useCallback(
    (track: AudioTrack, queue?: AudioTrack[]) => {
      const nextQueue = queue && queue.length > 0 ? queue : [track];
      const idx = nextQueue.findIndex((t) => t.id === track.id);
      setPlaylist(nextQueue);
      setCurrentIndex(idx >= 0 ? idx : 0);
      setCurrentTrack(track);
      loadAndPlay(track);
    },
    [loadAndPlay]
  );

  const playReciterSurah = useCallback(
    (reciter: Reciter, surahNumber: number) => {
      const queue: AudioTrack[] = SURAHS_META.map((surah) => ({
        id: `${reciter.id}-surah-${surah.number}`,
        title: `سورة ${surah.name}`,
        subtitle: `${reciter.riwayah} • ${surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}`,
        reciterName: reciter.nameAr,
        reciterId: reciter.id,
        surahNumber: surah.number,
        url: getSurahAudioUrl(reciter, surah.number),
        streamType: 'mp3',
      }));

      const target = queue.find((t) => t.surahNumber === surahNumber) || queue[0];
      playTrack(target, queue);
    },
    [playTrack]
  );

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIdx = currentIndex + 1;
    if (nextIdx < playlist.length) {
      const next = playlist[nextIdx];
      setCurrentIndex(nextIdx);
      setCurrentTrack(next);
      loadAndPlay(next);
    } else if (repeatMode === 'all') {
      const first = playlist[0];
      setCurrentIndex(0);
      setCurrentTrack(first);
      loadAndPlay(first);
    } else {
      setIsPlaying(false);
    }
  }, [playlist, currentIndex, repeatMode, loadAndPlay]);

  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIdx = currentIndex - 1 >= 0 ? currentIndex - 1 : playlist.length - 1;
    const prev = playlist[prevIdx];
    setCurrentIndex(prevIdx);
    setCurrentTrack(prev);
    loadAndPlay(prev);
  }, [playlist, currentIndex, loadAndPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      if (repeatMode === 'one' && currentTrack) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [repeatMode, currentTrack, nextTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (isPlaying) {
      audio.pause();
    } else {
      setActiveVideoChannelId(null);
      if (error) {
        loadAndPlay(currentTrack);
      } else {
        audio.play().catch(() => {
          loadAndPlay(currentTrack);
        });
      }
    }
  };

  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = clamped === 0;
    }
    setIsMuted(clamped === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMute = !isMuted;
    audio.muted = nextMute;
    setIsMuted(nextMute);
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => (prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'));
  };

  const closePlayer = () => {
    destroyHls();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    currentTrackRef.current = null;
    setCurrentTrack(null);
    setIsPlaying(false);
    setIsPlaylistOpen(false);
    setError(null);
  };

  const toggleFavoriteRadio = (radioId: string) => {
    setFavoriteRadios((prev) =>
      prev.includes(radioId) ? prev.filter((id) => id !== radioId) : [...prev, radioId]
    );
  };

  // Called when a TV video channel starts playing: automatically stops audio player
  const notifyVideoStarted = useCallback(
    (channelId: string) => {
      setActiveVideoChannelId(channelId);
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    },
    []
  );

  const notifyVideoStopped = useCallback(() => {
    setActiveVideoChannelId(null);
  }, []);

  return (
    <AudioContext.Provider
      value={{
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
        favoriteRadios,
        lastPlayedRadio,
        activeVideoChannelId,
        playTrack,
        playReciterSurah,
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
        toggleFavoriteRadio,
        notifyVideoStarted,
        notifyVideoStopped,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider');
  return ctx;
};
