// Types for Daily Muslim Companion (رفيق المسلم اليومي)

export type ActivityCategory =
  | 'fard_prayer'
  | 'sunnah_prayer'
  | 'quran'
  | 'adhkar'
  | 'fasting'
  | 'charity'
  | 'manners'
  | 'custom';

export type ActivityPeriod = 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';

export interface DailyActivity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  isObligatory: boolean; // Distinction between obligatory and voluntary worship
  period: ActivityPeriod;
  iconName: string;
  defaultTarget?: number;
  unitLabel?: string;
  isCustom?: boolean;
  referenceEvidence?: string;
}

export interface UserActivityLog {
  activityId: string;
  completed: boolean;
  value?: number;
  completedAt?: string;
  note?: string;
}

export interface DayProgressRecord {
  date: string; // YYYY-MM-DD
  hijriDate?: string;
  activities: Record<string, UserActivityLog>;
  quranPagesRead?: number;
  memorizationMinutes?: number;
  reflectionNote?: string;
  rating?: number; // 1-5 how peaceful was the day
}

export interface CompanionState {
  currentDate: string; // YYYY-MM-DD
  history: Record<string, DayProgressRecord>; // date -> DayProgressRecord
  customActivities: DailyActivity[];
  quranDailyGoalPages: number;
  memorizationGoalSurah: string;
  adhkarNotificationEnabled: boolean;
}

