import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Qibla,
  Madhab,
  CalculationParameters,
} from 'adhan';
import { CalculationMethodId, MadhabId } from '../types';

export interface PrayerScheduleItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  nameAr: string;
  time: Date;
  formattedTime: string;
  isPrayer: boolean;
}

export interface ComputedPrayerState {
  schedule: PrayerScheduleItem[];
  currentPrayerId: string | null;
  nextPrayer: PrayerScheduleItem;
  remainingSeconds: number;
  remainingFormatted: string;
  qiblaDirection: number;
  hijriDateFormatted: string;
  gregorianDateFormatted: string;
}

export function getCalculationParams(
  methodId: CalculationMethodId,
  madhabId: MadhabId = 'Shafi'
): CalculationParameters {
  let params: CalculationParameters;
  switch (methodId) {
    case 'UmmAlQura':
      params = CalculationMethod.UmmAlQura();
      break;
    case 'MuslimWorldLeague':
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'Dubai':
      params = CalculationMethod.Dubai();
      break;
    case 'Qatar':
      params = CalculationMethod.Qatar();
      break;
    case 'Kuwait':
      params = CalculationMethod.Kuwait();
      break;
    case 'NorthAmerica':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'Turkey':
      params = CalculationMethod.Turkey();
      break;
    default:
      params = CalculationMethod.UmmAlQura();
  }
  params.madhab = madhabId === 'Hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export function formatTimeArabic(date: Date): string {
  try {
    return new Intl.DateTimeFormat('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  }
}

export function formatHijriDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'full' }).format(date);
  }
}

export function formatGregorianDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return date.toLocaleDateString('ar');
  }
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return [hrs, mins, secs].map((n) => String(n).padStart(2, '0')).join(':');
}

export function computePrayerTimesForDate(
  latitude: number,
  longitude: number,
  methodId: CalculationMethodId,
  madhabId: MadhabId = 'Shafi',
  now: Date = new Date()
): ComputedPrayerState {
  const coords = new Coordinates(latitude, longitude);
  const params = getCalculationParams(methodId, madhabId);
  const prayerTimes = new PrayerTimes(coords, now, params);

  const schedule: PrayerScheduleItem[] = [
    {
      id: 'fajr',
      nameAr: 'الفجر',
      time: prayerTimes.fajr,
      formattedTime: formatTimeArabic(prayerTimes.fajr),
      isPrayer: true,
    },
    {
      id: 'sunrise',
      nameAr: 'الشروق',
      time: prayerTimes.sunrise,
      formattedTime: formatTimeArabic(prayerTimes.sunrise),
      isPrayer: false,
    },
    {
      id: 'dhuhr',
      nameAr: 'الظهر',
      time: prayerTimes.dhuhr,
      formattedTime: formatTimeArabic(prayerTimes.dhuhr),
      isPrayer: true,
    },
    {
      id: 'asr',
      nameAr: 'العصر',
      time: prayerTimes.asr,
      formattedTime: formatTimeArabic(prayerTimes.asr),
      isPrayer: true,
    },
    {
      id: 'maghrib',
      nameAr: 'المغرب',
      time: prayerTimes.maghrib,
      formattedTime: formatTimeArabic(prayerTimes.maghrib),
      isPrayer: true,
    },
    {
      id: 'isha',
      nameAr: 'العشاء',
      time: prayerTimes.isha,
      formattedTime: formatTimeArabic(prayerTimes.isha),
      isPrayer: true,
    },
  ];

  // Determine current and next event
  let nextPrayer: PrayerScheduleItem | null = null;
  let currentPrayerId: string | null = null;

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i].time.getTime() > now.getTime()) {
      nextPrayer = schedule[i];
      if (i > 0) {
        currentPrayerId = schedule[i - 1].id;
      } else {
        currentPrayerId = 'isha';
      }
      break;
    }
  }

  // If after Isha, next prayer is tomorrow's Fajr
  if (!nextPrayer) {
    currentPrayerId = 'isha';
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayers = new PrayerTimes(coords, tomorrow, params);
    nextPrayer = {
      id: 'fajr',
      nameAr: 'الفجر (غداً)',
      time: tomorrowPrayers.fajr,
      formattedTime: formatTimeArabic(tomorrowPrayers.fajr),
      isPrayer: true,
    };
  }

  const remainingSeconds = Math.max(
    0,
    Math.floor((nextPrayer.time.getTime() - now.getTime()) / 1000)
  );

  const qiblaDirection = Math.round(Qibla(coords) * 10) / 10;

  return {
    schedule,
    currentPrayerId,
    nextPrayer,
    remainingSeconds,
    remainingFormatted: formatCountdown(remainingSeconds),
    qiblaDirection,
    hijriDateFormatted: formatHijriDate(now),
    gregorianDateFormatted: formatGregorianDate(now),
  };
}

