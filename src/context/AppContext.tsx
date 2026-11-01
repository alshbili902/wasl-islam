import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, CityLocation, CalculationMethodId } from '../types';
import { CITIES_LIST } from '../data/citiesData';

export interface QuranBookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: string;
}

interface AppContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleTheme: () => void;
  setCity: (city: CityLocation) => void;
  detectGpsLocation: () => Promise<{ success: boolean; message: string }>;
  isLocating: boolean;
  favoriteReciters: string[];
  toggleFavoriteReciter: (reciterId: string) => void;
  quranBookmarks: QuranBookmark[];
  saveQuranBookmark: (bookmark: QuranBookmark) => void;
  removeQuranBookmark: (surahNumber: number, ayahNumber: number) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  calculationMethod: 'UmmAlQura',
  madhab: 'Shafi',
  quranFontSize: 28,
  defaultReciterId: 'alafasy',
  defaultTafsirId: 'ar.muyassar',
  hapticFeedback: true,
  reduceMotion: false,
  selectedCity: CITIES_LIST[0], // مكة المكرمة
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('madar_settings_v1');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_SETTINGS;
  });

  const [isLocating, setIsLocating] = useState(false);

  const [favoriteReciters, setFavoriteReciters] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('madar_fav_reciters_v1');
      return saved ? JSON.parse(saved) : ['alafasy', 'sudais', 'husary'];
    } catch {
      return ['alafasy', 'sudais', 'husary'];
    }
  });

  const [quranBookmarks, setQuranBookmarks] = useState<QuranBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('madar_quran_bookmarks_v1');
      return saved
        ? JSON.parse(saved)
        : [
            {
              surahNumber: 18,
              ayahNumber: 1,
              surahName: 'الكهف',
              timestamp: new Date().toLocaleDateString('ar-SA'),
            },
          ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('madar_settings_v1', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('madar_fav_reciters_v1', JSON.stringify(favoriteReciters));
    } catch {
      // ignore
    }
  }, [favoriteReciters]);

  useEffect(() => {
    try {
      localStorage.setItem('madar_quran_bookmarks_v1', JSON.stringify(quranBookmarks));
    } catch {
      // ignore
    }
  }, [quranBookmarks]);

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const setCity = (city: CityLocation) => {
    setSettings((prev) => ({
      ...prev,
      selectedCity: city,
      calculationMethod: city.method || prev.calculationMethod,
    }));
  };

  const applyCoordinates = (latitude: number, longitude: number, labelHint?: string): CityLocation => {
    let closestCity = CITIES_LIST[0];
    let minDist = Infinity;
    for (const city of CITIES_LIST) {
      const d = Math.hypot(city.latitude - latitude, city.longitude - longitude);
      if (d < minDist) {
        minDist = d;
        closestCity = city;
      }
    }

    const resolvedCity: CityLocation =
      minDist < 0.45
        ? closestCity
        : {
            id: 'gps-custom',
            nameAr: labelHint
              ? `${labelHint} (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`
              : `موقعي الحالي (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`,
            countryAr: 'إحداثيات مباشرة',
            latitude,
            longitude,
            method: settings.calculationMethod as CalculationMethodId,
          };

    setSettings((prev) => ({
      ...prev,
      selectedCity: resolvedCity,
    }));

    return resolvedCity;
  };

  // Fallback to network IP geolocation when accessed from a phone over HTTP LAN (192.168.x.x)
  const fallbackNetworkLocation = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
          const cityObj = applyCoordinates(data.latitude, data.longitude, data.city || undefined);
          setIsLocating(false);
          return {
            success: true,
            message: `تم تحديد موقعك عبر الشبكة بنجاح: ${cityObj.nameAr}`,
          };
        }
      }
    } catch {
      // ignore network error
    }
    setIsLocating(false);
    return {
      success: false,
      message: 'تعذر الوصول إلى الموقع الجغرافي تلقائياً. يرجى اختيار المدينة يدوياً من القائمة.',
    };
  };

  const detectGpsLocation = (): Promise<{ success: boolean; message: string }> => {
    setIsLocating(true);
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        fallbackNetworkLocation().then(resolve);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const cityObj = applyCoordinates(latitude, longitude);
          setIsLocating(false);
          resolve({
            success: true,
            message: `تم تحديد موقعك الجغرافي بدقة: ${cityObj.nameAr}`,
          });
        },
        () => {
          // If browser blocks GPS over HTTP LAN on mobile, seamlessly use IP network geolocation
          fallbackNetworkLocation().then(resolve);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    });
  };

  const toggleFavoriteReciter = (reciterId: string) => {
    setFavoriteReciters((prev) =>
      prev.includes(reciterId) ? prev.filter((id) => id !== reciterId) : [...prev, reciterId]
    );
  };

  const saveQuranBookmark = (bookmark: QuranBookmark) => {
    setQuranBookmarks((prev) => {
      const filtered = prev.filter(
        (b) => !(b.surahNumber === bookmark.surahNumber && b.ayahNumber === bookmark.ayahNumber)
      );
      return [bookmark, ...filtered].slice(0, 15);
    });
  };

  const removeQuranBookmark = (surahNumber: number, ayahNumber: number) => {
    setQuranBookmarks((prev) =>
      prev.filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber))
    );
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        toggleTheme,
        setCity,
        detectGpsLocation,
        isLocating,
        favoriteReciters,
        toggleFavoriteReciter,
        quranBookmarks,
        saveQuranBookmark,
        removeQuranBookmark,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
