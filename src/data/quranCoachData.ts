import { MemorizationPlan, MemorizationTestQuestion } from '../types/quranLearning';

export const POPULAR_MEMORIZATION_TRACKS: Omit<MemorizationPlan, 'id' | 'createdAt'>[] = [
  {
    title: 'خطة حفظ جزء عم (الجزء 30)',
    goalType: 'juz',
    startSurah: 78,
    startAyah: 1,
    endSurah: 114,
    endAyah: 6,
    dailyAyahsCount: 5,
    daysPerWeek: 5,
    preferredDailyTime: '06:00 ص (بعد الفجر)',
    targetCompletionDate: 'خلال 45 يوماً',
    revisionFrequency: 'daily',
    notes: 'البدء من قصار السور صعوداً لتثبيت الحفظ والمراجعة مع الصلاة اليومية.'
  },
  {
    title: 'خطة حفظ سورة الكهف المباركة',
    goalType: 'selected_surah',
    startSurah: 18,
    startAyah: 1,
    endSurah: 18,
    endAyah: 110,
    dailyAyahsCount: 4,
    daysPerWeek: 5,
    preferredDailyTime: '05:30 ص',
    targetCompletionDate: 'خلال شهر واحد',
    revisionFrequency: 'daily',
    notes: 'لقراءتها بتدبر كل يوم جمعة ونيل نور ما بين الجمعتين.'
  },
  {
    title: 'خطة حفظ سورة الملك (المنجية من عذاب القبر)',
    goalType: 'selected_surah',
    startSurah: 67,
    startAyah: 1,
    endSurah: 67,
    endAyah: 30,
    dailyAyahsCount: 3,
    daysPerWeek: 5,
    preferredDailyTime: '09:00 م (قبل النوم)',
    targetCompletionDate: 'خلال 10 أيام',
    revisionFrequency: 'daily',
    notes: 'سورة ثلاثون آية تشفع لصاحبها، يسن قراءتها كل ليلة قبل النوم.'
  },
  {
    title: 'خطة حفظ العشر الأوائل من سورة الكهف',
    goalType: 'selected_ayahs',
    startSurah: 18,
    startAyah: 1,
    endSurah: 18,
    endAyah: 10,
    dailyAyahsCount: 2,
    daysPerWeek: 5,
    preferredDailyTime: '06:30 ص',
    targetCompletionDate: 'خلال 5 أيام',
    revisionFrequency: 'daily',
    notes: '«من حفظ عشر آيات من أول سورة الكهف عُصم من فتنة الدجال» [صحيح مسلم].'
  },
  {
    title: 'خطة حفظ سورة يس (قلب القرآن)',
    goalType: 'selected_surah',
    startSurah: 36,
    startAyah: 1,
    endSurah: 36,
    endAyah: 83,
    dailyAyahsCount: 4,
    daysPerWeek: 6,
    preferredDailyTime: '06:00 ص',
    targetCompletionDate: 'خلال 3 أسابيع',
    revisionFrequency: 'spaced_smart',
    notes: 'سورة جليلة القدر في تقرير البعث والرسالة والتوحيد.'
  }
];

export interface CoachVerseSample {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  textUthmani: string;
  audioUrl: string;
}

// Built-in verified samples for instant offline coaching sessions (Surah Al-Mulk & Al-Kahf highlights)
export const COACH_SAMPLE_VERSES: CoachVerseSample[] = [
  {
    surahNumber: 67,
    ayahNumber: 1,
    surahName: 'الملك',
    textUthmani: 'تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5242.mp3'
  },
  {
    surahNumber: 67,
    ayahNumber: 2,
    surahName: 'الملك',
    textUthmani: 'ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5243.mp3'
  },
  {
    surahNumber: 67,
    ayahNumber: 3,
    surahName: 'الملك',
    textUthmani: 'ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5244.mp3'
  },
  {
    surahNumber: 67,
    ayahNumber: 4,
    surahName: 'الملك',
    textUthmani: 'ثُمَّ ٱرۡجِعِ ٱلۡبَصَرَ كَرَّتَيۡنِ يَنقَلِبۡ إِلَيۡكَ ٱلۡبَصَرُ خَاسِئٗا وَهُوَ حَسِيرٞ',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5245.mp3'
  },
  {
    surahNumber: 67,
    ayahNumber: 5,
    surahName: 'الملك',
    textUthmani: 'وَلَقَدۡ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنۡيَا بِمَصَٰبِيحَ وَجَعَلۡنَٰهَا رُجُومٗا لِّلشَّيَٰطِينِۖ وَأَعۡتَدۡنَا لَهُمۡ عَذَابَ ٱلسَّعِيرِ',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5246.mp3'
  },
  {
    surahNumber: 18,
    ayahNumber: 1,
    surahName: 'الكهف',
    textUthmani: 'ٱلۡحَمۡدُ لِلَّهِ ٱلَّذِيٓ أَنزَلَ عَلَىٰ عَبۡدِهِ ٱلۡكِتَٰبَ وَلَمۡ يَجۡعَل لَّهُۥ عِوَجَاۜ',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2141.mp3'
  },
  {
    surahNumber: 18,
    ayahNumber: 2,
    surahName: 'الكهف',
    textUthmani: 'قَيِّمٗا لِّيُنذِرَ بَأۡسٗا شَدِيدٗا مِّن لَّدُنۡهُ وَيُبَشِّرَ ٱلۡمُؤۡمِنِينَ ٱلَّذِينَ يَعۡمَلُونَ ٱلصَّٰلِحَٰتِ أَنَّ لَهُمۡ أَجۡرًا حَسَنٗا',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2142.mp3'
  },
  {
    surahNumber: 18,
    ayahNumber: 3,
    surahName: 'الكهف',
    textUthmani: 'مَّٰكِثِينَ فِيهِ أَبَدٗا',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/2143.mp3'
  }
];

export const COACH_TEST_QUESTIONS: MemorizationTestQuestion[] = [
  {
    id: 'test-1',
    surahNumber: 67,
    ayahNumber: 1,
    surahName: 'الملك',
    type: 'hidden_words',
    prompt: 'أكمل الكلمة الناقصة في قوله تعالى: «تَبَٰرَكَ ٱلَّذِي بِيَدِهِ [...] وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ»',
    fullAyahText: 'تَبَٰرَكَ ٱلَّذِي بِيَدِهِ ٱلۡمُلۡكُ وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ',
    options: ['ٱلۡمُلۡكُ', 'ٱلۡخَلۡقُ', 'ٱلۡأَمۡرُ', 'ٱلۡحَمۡدُ'],
    correctIndex: 0
  },
  {
    id: 'test-2',
    surahNumber: 67,
    ayahNumber: 2,
    surahName: 'الملك',
    type: 'continue_verse',
    prompt: 'ما هي الآية التالية لقوله تعالى: «ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ أَيُّكُمۡ أَحۡسَنُ عَمَلٗاۚ وَهُوَ ٱلۡعَزِيزُ ٱلۡغَفُورُ»؟',
    fullAyahText: 'ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ',
    options: [
      'ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖ',
      'ثُمَّ ٱرۡجِعِ ٱلۡبَصَرَ كَرَّتَيۡنِ يَنقَلِبۡ إِلَيۡكَ ٱلۡبَصَرُ خَاسِئٗا',
      'وَلَقَدۡ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنۡيَا بِمَصَٰبِيحَ وَجَعَلۡنَٰهَا رُجُومٗا لِّلشَّيَٰطِينِ',
      'إِذَآ أُلۡقُواْ فِيهَا سَمِعُواْ لَهَا شَهِيقٗا وَهِيَ تَفُورُ'
    ],
    correctIndex: 0
  },
  {
    id: 'test-3',
    surahNumber: 18,
    ayahNumber: 1,
    surahName: 'الكهف',
    type: 'hidden_words',
    prompt: 'اختر الكلمة الصحيحة لملء الفراغ: «ٱلۡحَمۡدُ لِلَّهِ ٱلَّذِيٓ أَنزَلَ عَلَىٰ عَبۡدِهِ ٱلۡكِتَٰبَ وَلَمۡ يَجۡعَل لَّهُۥ [...]»',
    fullAyahText: 'ٱلۡحَمۡدُ لِلَّهِ ٱلَّذِيٓ أَنزَلَ عَلَىٰ عَبۡدِهِ ٱلۡكِتَٰبَ وَلَمۡ يَجۡعَل لَّهُۥ عِوَجَاۜ',
    options: ['عِوَجَاۜ', 'ضَيِّقًا', 'حَرَجًا', 'نَقۡصًا'],
    correctIndex: 0
  },
  {
    id: 'test-4',
    surahNumber: 67,
    ayahNumber: 3,
    surahName: 'الملك',
    type: 'audio_identify',
    prompt: 'استمع للتلاوة وحدد ختام الآية الكريمة بدقة:',
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5244.mp3',
    fullAyahText: 'ٱلَّذِي خَلَقَ سَبۡعَ سَمَٰوَٰتٖ طِبَاقٗاۖ مَّا تَرَىٰ فِي خَلۡقِ ٱلرَّحۡمَٰنِ مِن تَفَٰوُتٖۖ فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ',
    options: [
      'فَٱرۡجِعِ ٱلۡبَصَرَ هَلۡ تَرَىٰ مِن فُطُورٖ',
      'فَٱرۡجِعِ ٱلۡبَصَرَ كَرَّتَيۡنِ',
      'وَهُوَ عَلَىٰ كُلِّ شَيۡءٖ قَدِيرٌ',
      'وَأَعۡتَدۡنَا لَهُمۡ عَذَابَ ٱلسَّعِيرِ'
    ],
    correctIndex: 0
  }
];

