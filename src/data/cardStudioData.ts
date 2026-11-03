import { CardQuotePreset } from '../types/extraModules';

export const CARD_PRESETS: CardQuotePreset[] = [
  {
    id: 'pr-1',
    category: 'ayah',
    categoryLabelAr: 'آية قرآنية',
    text: '﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾',
    source: 'سورة الرعد: الآية 28'
  },
  {
    id: 'pr-2',
    category: 'ayah',
    categoryLabelAr: 'آية قرآنية',
    text: '﴿وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ﴾',
    source: 'سورة البقرة: الآية 186'
  },
  {
    id: 'pr-3',
    category: 'ayah',
    categoryLabelAr: 'آية قرآنية',
    text: '﴿إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا﴾',
    source: 'سورة الشرح: 5-6'
  },
  {
    id: 'pr-4',
    category: 'ayah',
    categoryLabelAr: 'آية قرآنية',
    text: '﴿وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ وَسَبِّحْ بِحَمْدِهِ﴾',
    source: 'سورة الفرقان: الآية 58'
  },
  {
    id: 'pr-5',
    category: 'hadith',
    categoryLabelAr: 'حديث نبوي شريف',
    text: '«احْفَظِ اللَّهَ يَحْفَظْكَ، احْفَظِ اللَّهَ تَجِدْهُ تُجَاهَكَ، إِذَا سَأَلْتَ فَاسْأَلِ اللَّهَ، وَإِذَا اسْتَعَنْتَ فَاسْتَعِنْ بِاللَّهِ»',
    source: 'جامع الترمذي (2516) وصححه الألباني',
    authorOrSpeaker: 'النبي محمد ﷺ'
  },
  {
    id: 'pr-6',
    category: 'hadith',
    categoryLabelAr: 'حديث نبوي شريف',
    text: '«خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ»',
    source: 'المعجم الأوسط للطبراني، وصححه الألباني',
    authorOrSpeaker: 'النبي محمد ﷺ'
  },
  {
    id: 'pr-7',
    category: 'hadith',
    categoryLabelAr: 'حديث نبوي شريف',
    text: '«اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ»',
    source: 'سنن الترمذي (1987) وحسنه',
    authorOrSpeaker: 'النبي محمد ﷺ'
  },
  {
    id: 'pr-8',
    category: 'dhikr',
    categoryLabelAr: 'ذكر ودعاء مأثور',
    text: '«يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ»',
    source: 'سنن النسائي الكبرى وحسنه الألباني'
  },
  {
    id: 'pr-9',
    category: 'dhikr',
    categoryLabelAr: 'ذكر ودعاء مأثور',
    text: '«اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً»',
    source: 'سنن ابن ماجه (925) وصححه الألباني'
  },
  {
    id: 'pr-10',
    category: 'friday',
    categoryLabelAr: 'تهنئة ويوم الجمعة',
    text: '«إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا»\nاللهم صلِّ وسلم وبارك على نبينا محمد',
    source: 'سورة الأحزاب: 56 - سنن الجمعة المباركة'
  },
  {
    id: 'pr-11',
    category: 'wisdom',
    categoryLabelAr: 'حكمة إسلامية مأثورة',
    text: '«إِذَا أَرَدْتَ أَنْ يُفْتَحَ لَكَ بَابُ التَّيْسِيرِ، فَاجْعَلْ قَلْبَكَ مُعَلَّقاً بِرَبِّ الْعَرْشِ الْكَبِيرِ»',
    source: 'من لطائف حكم السلف الصالح',
    authorOrSpeaker: 'من درر الحكم'
  }
];

export interface CardThemeConfig {
  id: string;
  name: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  textColor: string;
  accentColor: string;
  borderGold: string;
  badgeBg: string;
}

export const CARD_THEMES: CardThemeConfig[] = [
  {
    id: 'emerald_gold',
    name: 'زمردي ملكي وذهب',
    bgGradientStart: '#072A20',
    bgGradientEnd: '#0D3E2E',
    textColor: '#FFFFFF',
    accentColor: '#E6C673',
    borderGold: '#C5A059',
    badgeBg: 'rgba(197, 160, 89, 0.25)'
  },
  {
    id: 'dark_luxury',
    name: 'كحلي ليل فاخر',
    bgGradientStart: '#070C15',
    bgGradientEnd: '#0F1A2C',
    textColor: '#F8FAF9',
    accentColor: '#D4AF37',
    borderGold: '#D4AF37',
    badgeBg: 'rgba(212, 175, 55, 0.2)'
  },
  {
    id: 'royal_gold',
    name: 'عقيق وأصالة إسلامية',
    bgGradientStart: '#1A1208',
    bgGradientEnd: '#2D1F0E',
    textColor: '#FFF9EE',
    accentColor: '#F59E0B',
    borderGold: '#F59E0B',
    badgeBg: 'rgba(245, 158, 11, 0.22)'
  },
  {
    id: 'soft_parchment',
    name: 'مخطوطة رقيقة ناصعة',
    bgGradientStart: '#FCF9F2',
    bgGradientEnd: '#EFE6D2',
    textColor: '#072A20',
    accentColor: '#967026',
    borderGold: '#B8860B',
    badgeBg: 'rgba(184, 134, 11, 0.15)'
  }
];
