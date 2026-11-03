import { CompanionState, DayProgressRecord, DailyActivity } from '../types/companion';
import { DEFAULT_COMPANION_ACTIVITIES } from '../data/companionData';

const COMPANION_STORAGE_KEY = 'madar_companion_data_v1';

export function getTodayDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatArabicDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return date.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function getInitialCompanionState(): CompanionState {
  const today = getTodayDateString();
  const initialTodayRecord: DayProgressRecord = {
    date: today,
    activities: {},
    quranPagesRead: 0,
    memorizationMinutes: 0,
    reflectionNote: ''
  };

  return {
    currentDate: today,
    history: {
      [today]: initialTodayRecord
    },
    customActivities: [],
    quranDailyGoalPages: 10,
    memorizationGoalSurah: 'سورة الملك',
    adhkarNotificationEnabled: true
  };
}

export function loadCompanionState(): CompanionState {
  try {
    const raw = localStorage.getItem(COMPANION_STORAGE_KEY);
    if (!raw) return getInitialCompanionState();
    const parsed: CompanionState = JSON.parse(raw);

    const today = getTodayDateString();
    if (!parsed.history) parsed.history = {};

    // If today does not exist in history, initialize it
    if (!parsed.history[today]) {
      parsed.history[today] = {
        date: today,
        activities: {},
        quranPagesRead: 0,
        memorizationMinutes: 0,
        reflectionNote: ''
      };
    }

    parsed.currentDate = today;
    return parsed;
  } catch (err) {
    console.warn('[Companion] Storage load error:', err);
    return getInitialCompanionState();
  }
}

export function saveCompanionState(state: CompanionState): void {
  try {
    localStorage.setItem(COMPANION_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Companion] Storage save error:', err);
  }
}

export function toggleActivityCompletion(
  state: CompanionState,
  activityId: string,
  targetDate?: string,
  value?: number
): CompanionState {
  const dateKey = targetDate || state.currentDate;
  const history = { ...state.history };
  const dayRecord: DayProgressRecord = history[dateKey]
    ? { ...history[dateKey], activities: { ...history[dateKey].activities } }
    : {
        date: dateKey,
        activities: {},
        quranPagesRead: 0,
        memorizationMinutes: 0,
        reflectionNote: ''
      };

  const currentLog = dayRecord.activities[activityId];
  const newCompleted = currentLog ? !currentLog.completed : true;

  dayRecord.activities[activityId] = {
    activityId,
    completed: newCompleted,
    value: value !== undefined ? value : newCompleted ? 1 : 0,
    completedAt: newCompleted ? new Date().toISOString() : undefined
  };

  history[dateKey] = dayRecord;

  const nextState: CompanionState = {
    ...state,
    history
  };

  saveCompanionState(nextState);
  return nextState;
}

export function updateDayReflection(
  state: CompanionState,
  dateKey: string,
  reflectionNote: string
): CompanionState {
  const history = { ...state.history };
  const dayRecord: DayProgressRecord = history[dateKey]
    ? { ...history[dateKey] }
    : {
        date: dateKey,
        activities: {},
        quranPagesRead: 0,
        memorizationMinutes: 0
      };

  dayRecord.reflectionNote = reflectionNote;
  history[dateKey] = dayRecord;

  const nextState: CompanionState = {
    ...state,
    history
  };

  saveCompanionState(nextState);
  return nextState;
}

export function updateQuranProgress(
  state: CompanionState,
  dateKey: string,
  pages: number
): CompanionState {
  const history = { ...state.history };
  const dayRecord: DayProgressRecord = history[dateKey]
    ? { ...history[dateKey] }
    : {
        date: dateKey,
        activities: {},
        quranPagesRead: 0,
        memorizationMinutes: 0
      };

  dayRecord.quranPagesRead = Math.max(0, pages);
  history[dateKey] = dayRecord;

  const nextState: CompanionState = {
    ...state,
    history
  };

  saveCompanionState(nextState);
  return nextState;
}

export function addCustomActivity(
  state: CompanionState,
  activity: Omit<DailyActivity, 'id' | 'isCustom'>
): CompanionState {
  const newActivity: DailyActivity = {
    ...activity,
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    isCustom: true
  };

  const nextState: CompanionState = {
    ...state,
    customActivities: [...state.customActivities, newActivity]
  };

  saveCompanionState(nextState);
  return nextState;
}

export function removeCustomActivity(state: CompanionState, activityId: string): CompanionState {
  const nextState: CompanionState = {
    ...state,
    customActivities: state.customActivities.filter((a) => a.id !== activityId)
  };

  saveCompanionState(nextState);
  return nextState;
}

// Compute statistics for the past 7 days
export function getWeeklyStats(
  state: CompanionState,
  allActivities: DailyActivity[]
): {
  date: string;
  dayLabel: string;
  totalActivities: number;
  completedActivities: number;
  percentage: number;
}[] {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = getTodayDateString(d);
    const dayName = d.toLocaleDateString('ar-SA', { weekday: 'short' });

    const record = state.history[dateStr];
    let completedCount = 0;

    if (record && record.activities) {
      allActivities.forEach((act) => {
        if (record.activities[act.id]?.completed) {
          completedCount++;
        }
      });
    }

    const total = allActivities.length || 1;
    const percentage = Math.round((completedCount / total) * 100);

    result.push({
      date: dateStr,
      dayLabel: dayName,
      totalActivities: total,
      completedActivities: completedCount,
      percentage
    });
  }

  return result;
}
