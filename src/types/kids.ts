// Types for Muslim Kids Learning World (عالم الأطفال المسلم)

export type KidsCategory = 'quran' | 'basics' | 'games' | 'stories' | 'achievements';

export interface ArabicLetter {
  letter: string;
  nameAr: string;
  exampleWord: string;
  meaningAr: string;
  soundDescription: string;
  quranicTheme: string;
}

export interface ShortSurahLesson {
  surahNumber: number;
  nameAr: string;
  ayahCount: number;
  childFriendlyTheme: string;
  storyBehindSurah: string;
  verses: {
    numberInSurah: number;
    text: string;
    simpleMeaning: string;
    audioUrl?: string;
  }[];
  lessonQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface IslamicPillarLesson {
  id: string;
  pillarType: 'islam' | 'iman';
  number: number;
  title: string;
  subtitle: string;
  summary: string;
  keyAction: string;
  childExample: string;
  hadithOrAyahProof: string;
}

export interface KidsMannerLesson {
  id: string;
  title: string;
  category: 'eating' | 'speaking' | 'sleeping' | 'parents' | 'kindness';
  icon: string;
  rule: string;
  propheticSupplication?: string;
  rewardStory: string;
}

export interface KidsQuizQuestion {
  id: string;
  category: 'quran' | 'manners' | 'prophets' | 'basics';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  starsAwarded: number;
}

export interface KidsMemoryPair {
  id: string;
  pairKey: string;
  frontText: string;
  backText: string;
  category: string;
}

export interface KidsStory {
  id: string;
  title: string;
  heroName: string;
  theme: string;
  moralLesson: string;
  ageGroup: '4-7' | '8-12' | 'all';
  readingTimeMinutes: number;
  paragraphs: string[];
  reflectionQuestions: string[];
  verifiedSource: string;
}

export interface KidsBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}

export interface KidsProgressState {
  childNickname: string;
  totalStars: number;
  completedSurahs: number[];
  completedQuizzes: string[];
  completedStories: string[];
  unlockedBadgeIds: string[];
  wuduStepsCompleted: boolean;
  prayerStepsCompleted: boolean;
}

