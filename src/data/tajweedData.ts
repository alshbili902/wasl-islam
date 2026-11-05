import { MakhrajItem, LetterProfile, TajweedRuleItem, TajweedQuizItem } from '../types/quranLearning';

export const MAKHAREJ_AREAS: MakhrajItem[] = [
  {
    id: 'jawf',
    area: 'jawf',
    areaLabelAr: 'الجَوْف',
    nameAr: 'مخرج الجوف (التجويف الحلقي والفموي)',
    letters: ['ا', 'و', 'ي'],
    anatomicalDescription: 'هو الخلاء أو الفضاء الممتد عبر الحلق والفم، وهو مخرج مقدر لا يعتمد على جزء معين من أجزاء الفم، وتخرج منه حروف المد الثلاثة: الألف الساكنة المفتوح ما قبلها، الواو الساكنة المضموم ما قبلها، والياء الساكنة المكسور ما قبلها.',
    diagramTitle: 'مخطط تجويف الجوف وحروف المد واللين'
  },
  {
    id: 'halq',
    area: 'halq',
    areaLabelAr: 'الحَلْق',
    nameAr: 'مخرج الحلق وأقسامه الثلاثة',
    letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
    anatomicalDescription: 'يشتمل على ثلاثة مخارج خاصة لستة أحرف: 1. أقصى الحلق (مما يلي الصدر): الهمزة والهاء. 2. وسط الحلق: العين والحاء المهملتان. 3. أدنى الحلق (مما يلي الفم): الغين والخاء المعجمتان.',
    diagramTitle: 'مخطط أقصى ووسط وأدنى الحلق'
  },
  {
    id: 'lisan',
    area: 'lisan',
    areaLabelAr: 'اللِّسَان',
    nameAr: 'مخرج اللسان (عشرة مخارج لثمانية عشر حرفاً)',
    letters: ['ق', 'ك', 'ج', 'ش', 'ي', 'ض', 'ل', 'ن', 'ر', 'ط', 'د', 'ت', 'ص', 'ز', 'س', 'ظ', 'ذ', 'ث'],
    anatomicalDescription: 'أوسع المخارج وأعظمها؛ يشتمل على: أقصى اللسان (القاف والكاف مع الحنك اللحمي والعظمي)، وسط اللسان (الجيم والشين والياء)، حافتا اللسان (الضاد واللام)، وطرف اللسان مع أصول الثنايا واللثة (النون والراء والطاء والدال والتاء والصاد والزاي والسين والظاء والذال والثاء).',
    diagramTitle: 'أقسام اللسان: الجذر والأقصى والوسط والحافة والطرف ورأس اللسان'
  },
  {
    id: 'shafatan',
    area: 'shafatan',
    areaLabelAr: 'الشَّفَتَان',
    nameAr: 'مخرج الشفتين',
    letters: ['ف', 'ب', 'م', 'و'],
    anatomicalDescription: 'يشتمل على مخرجين: 1. بطن الشفة السفلى مع أطراف الثنايا العليا: ويخرج منه حرف (الفاء). 2. ما بين الشفتين معاً: بانطباقهما يخرج (الباء والميم)، وبانضمامهما واستدارتهما مع فرجة تخرج (الواو غير المدية).',
    diagramTitle: 'مخارج الشفتين وانطباقهما'
  },
  {
    id: 'khayshum',
    area: 'khayshum',
    areaLabelAr: 'الخَيْشُوم',
    nameAr: 'مخرج الخيشوم (صوت الغنة)',
    letters: ['نّ', 'مّ'],
    anatomicalDescription: 'هو الخرق المنجذب إلى داخل الفم فوق سقف الحنك الأعلى والأنف، وتخرج منه الغنة، وهي صوت رخيم مركب في جسم النون والميم لا عمل للسان فيه، وتظهر بقوة في النون والميم المشددتين والمدغمتين والمخفاتين.',
    diagramTitle: 'التجويف الأنفي ومسار صوت الغنة'
  }
];

export const LETTERS_PROFILES: LetterProfile[] = [
  {
    letter: 'أ',
    nameAr: 'الهمزة',
    makhrajArea: 'halq',
    makhrajLabel: 'أقصى الحلق',
    detailedMakhraj: 'من أقصى الحلق مما يلي الصدر عند منطقة الأوتار الصوتية.',
    sifaat: ['الجهر', 'الشدة', 'الاستفال', 'الانفتاح', 'الإصمات'],
    articulationGuide: 'تخرج بانحباس النفس والصوت التام ثم انطلاقه بقوة، مع الحذر من تسهيلها أو تمييعها بغير رواية.',
    vowelAudioExamples: {
      fatha: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3',
      damma: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3',
      kasra: 'https://everyayah.com/data/Alafasy_128kbps/001006.mp3',
      sukun: 'https://everyayah.com/data/Alafasy_128kbps/002003.mp3'
    },
    commonMistakes: [
      'تسهيلها عامية دون رواية كأن يقال "المومنون" بدلاً من "المؤمنون".',
      'تفخيمها إذا جاورها حرف مفخم مثل "الله" أو "أصحاب".'
    ],
    quranicExamples: [
      { text: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ', surahName: 'الفاتحة', ayahNumber: 2 },
      { text: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ', surahName: 'الفاتحة', ayahNumber: 5 }
    ]
  },
  {
    letter: 'ب',
    nameAr: 'الباء',
    makhrajArea: 'shafatan',
    makhrajLabel: 'الشفتان',
    detailedMakhraj: 'من بين الشفتين بانطباقهما انطباقاً محكماً من غير تكلف.',
    sifaat: ['الجهر', 'الشدة', 'الاستفال', 'الانفتاح', 'الإذلاق', 'القلقلة'],
    articulationGuide: 'حرف شديد مجهور ينحبس عنده الصوت والنفس، وإذا سكنت وجب قلقلتها باضطراب المخرج لإظهار صوتها رناناً.',
    vowelAudioExamples: {
      fatha: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
      damma: 'https://everyayah.com/data/Alafasy_128kbps/002004.mp3',
      kasra: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
      sukun: 'https://everyayah.com/data/Alafasy_128kbps/111001.mp3'
    },
    commonMistakes: [
      'همس الباء وإخراج هواء معها كالباء الإنجليزية P.',
      'ترك قلقلتها عند السكون والوقف كقوله "وتَبّ".'
    ],
    quranicExamples: [
      { text: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ', surahName: 'الفاتحة', ayahNumber: 1 },
      { text: 'تَبَّتۡ يَدَآ أَبِي لَهَبٖ وَتَبَّ', surahName: 'المسد', ayahNumber: 1 }
    ]
  },
  {
    letter: 'ق',
    nameAr: 'القاف',
    makhrajArea: 'lisan',
    makhrajLabel: 'أقصى اللسان',
    detailedMakhraj: 'من أقصى اللسان مع ما يحاذيه من الحنك الأعلى اللحمي الرخو.',
    sifaat: ['الجهر', 'الشدة', 'الاستعلاء', 'الانفتاح', 'الإصمات', 'القلقلة'],
    articulationGuide: 'حرف مستعلٍ مفخم قوي، يرتفع فيه أقصى اللسان ويتقعر وسطه مع قلقلة قوية عند السكون.',
    vowelAudioExamples: {
      fatha: 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3',
      damma: 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3',
      kasra: 'https://everyayah.com/data/Alafasy_128kbps/002011.mp3',
      sukun: 'https://everyayah.com/data/Alafasy_128kbps/096001.mp3'
    },
    commonMistakes: [
      'نطقها كالهمزة في اللهجات العامية أو كالجيم القاهرية أو كالكاف.',
      'ترقيقها عند الكسر مثل "قِيل".'
    ],
    quranicExamples: [
      { text: 'قُلۡ هُوَ ٱللَّهُ أَحَدٌ', surahName: 'الإخلاص', ayahNumber: 1 },
      { text: 'ٱقۡرَأۡ بِٱسۡمِ رَبِّكَ ٱلَّذِي خَلَقَ', surahName: 'العلق', ayahNumber: 1 }
    ]
  },
  {
    letter: 'ض',
    nameAr: 'الضاد',
    makhrajArea: 'lisan',
    makhrajLabel: 'حافة اللسان',
    detailedMakhraj: 'من إحدى حافتي اللسان أو كلتيهما مع ما يجاورها من الأضراس العليا اليسرى أو اليمنى.',
    sifaat: ['الجهر', 'الرخاوة', 'الاستعلاء', 'الإطباق', 'الإصمات', 'الاستطالة'],
    articulationGuide: 'أصعب الحروف مخرجاً؛ تتميز بصفة الاستطالة حيث يمتد الصوت من أول حافة اللسان إلى آخرها دون قلقلة.',
    vowelAudioExamples: {
      fatha: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3',
      damma: 'https://everyayah.com/data/Alafasy_128kbps/004028.mp3',
      kasra: 'https://everyayah.com/data/Alafasy_128kbps/002061.mp3',
      sukun: 'https://everyayah.com/data/Alafasy_128kbps/105002.mp3'
    },
    commonMistakes: [
      'خلطها بحرف الظاء وإخراج اللسان فيها كقول "غير المغظوب".',
      'قلقلتها عند السكون مثل "ألم يجعل كيدهم في تضليل".'
    ],
    quranicExamples: [
      { text: 'غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ', surahName: 'الفاتحة', ayahNumber: 7 },
      { text: 'أَلَمۡ يَجۡعَلۡ كَيۡدَهُمۡ فِي تَضۡلِيلٖ', surahName: 'الفيل', ayahNumber: 2 }
    ]
  },
  {
    letter: 'ع',
    nameAr: 'العين',
    makhrajArea: 'halq',
    makhrajLabel: 'وسط الحلق',
    detailedMakhraj: 'من وسط الحلق عند لسان المزمار المنحدر إلى الخلف.',
    sifaat: ['الجهر', 'التوسط (البينية)', 'الاستفال', 'الانفتاح', 'الإصمات'],
    articulationGuide: 'تخرج بجريان جزئي للصوت وتوسط بين الشدة والرخاوة مع رجوع لسان المزمار إلى جدار الحلق دون عصر مبالغ فيه.',
    vowelAudioExamples: {
      fatha: 'https://everyayah.com/data/Alafasy_128kbps/001002.mp3',
      damma: 'https://everyayah.com/data/Alafasy_128kbps/109002.mp3',
      kasra: 'https://everyayah.com/data/Alafasy_128kbps/103001.mp3',
      sukun: 'https://everyayah.com/data/Alafasy_128kbps/001005.mp3'
    },
    commonMistakes: [
      'خنّها أو قفل الصوت فيها تماماً كالهمزة عند السكون "نعبد".',
      'تفخيمها إذا جاورت مفخماً كقول "عاصم".'
    ],
    quranicExamples: [
      { text: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ', surahName: 'الفاتحة', ayahNumber: 5 },
      { text: 'وَٱلۡعَصۡرِ ۝ إِنَّ ٱلۡإِنسَٰنَ لَفِي خُسۡرٍ', surahName: 'العصر', ayahNumber: 1 }
    ]
  },
  {
    letter: 'ر',
    nameAr: 'الراء',
    makhrajArea: 'lisan',
    makhrajLabel: 'طرف اللسان',
    detailedMakhraj: 'من طرف اللسان مع ما يحاذيه من لثة الثنايا العليا أدخل إلى ظهر اللسان قليلاً من النون.',
    sifaat: ['الجهر', 'التوسط', 'الاستفال', 'الانفتاح', 'الإذلاق', 'الانحراف', 'التكرير'],
    articulationGuide: 'قابلة للتفخيم والترقيق؛ تفخم إذا كانت مفتوحة أو مضمومة، وترقق إذا كانت مكسورة، ويجب إخفاء التكرير الزائد برأس اللسان.',
    vowelAudioExamples: {
      fatha: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
      damma: 'https://everyayah.com/data/Alafasy_128kbps/002003.mp3',
      kasra: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
      sukun: 'https://everyayah.com/data/Alafasy_128kbps/094002.mp3'
    },
    commonMistakes: [
      'المبالغة في ارتعاد اللسان وإظهار راءات متعددة (التكرير المفرط).',
      'تفخيم الراء المكسورة أو ترقيق المفتوحة بغير حق.'
    ],
    quranicExamples: [
      { text: 'ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ', surahName: 'الفاتحة', ayahNumber: 3 },
      { text: 'وَوَضَعۡنَا عَنكَ وِزۡرَكَ', surahName: 'الشرح', ayahNumber: 2 }
    ]
  }
];

export const TAJWEED_RULES: TajweedRuleItem[] = [
  // 1. أحكام النون الساكنة والتنوين
  {
    id: 'rule-noon-izhar',
    category: 'noon_tanween',
    categoryLabelAr: 'أحكام النون الساكنة والتنوين',
    titleAr: 'الإظهار الحلقي',
    ruleExplanation: 'هو إخراج النون الساكنة أو التنوين من مخرجها بغير غنة ظاهرة إذا جاء بعدها أحد حروف الحلق الستة المجموعة في أوائل الكلمات: (أخي هاك علماً حازه غير خاسر): الهمزة، الهاء، العين، الحاء، الغين، الخاء.',
    letters: ['ء', 'هـ', 'ع', 'ح', 'غ', 'خ'],
    howToPronounce: 'انطق النون والتنوين بوضوح تام واستقرار على طرف اللسان دون زيادة في زمن الغنة ودون سكت.',
    quranicExamples: [
      {
        verseSnippet: 'مِنۡ خَوۡفِۭ',
        highlightedPart: 'مِنۡ خَـ',
        surahName: 'قريش',
        ayahNumber: 4,
        explanation: 'نون ساكنة بعدها حرف الخاء وهو من حروف الحلق، فحكمها الإظهار الحلقي.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/106004.mp3'
      },
      {
        verseSnippet: 'أَنۡعَمۡتَ عَلَيۡهِمۡ',
        highlightedPart: 'أَنۡعَمۡتَ',
        surahName: 'الفاتحة',
        ayahNumber: 7,
        explanation: 'نون ساكنة جاء بعدها حرف العين في كلمة واحدة، حكمها الإظهار الحلقي.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3'
      }
    ]
  },
  {
    id: 'rule-noon-idgham',
    category: 'noon_tanween',
    categoryLabelAr: 'أحكام النون الساكنة والتنوين',
    titleAr: 'الإدغام (بغنة وبغير غنة)',
    ruleExplanation: 'هو إدخال النون الساكنة أو التنوين في الحرف الذي بعدها بحيث يصيران حرفاً واحداً مشدداً، وحروفه ستة مجموعة في كلمة: (يَرْمَلُون). ينقسم إلى: إدغام بغنة في حروف (يَنْمُو)، وإدغام بغير غنة في حرفي (اللام والراء).',
    letters: ['ي', 'ر', 'م', 'ل', 'و', 'ن'],
    howToPronounce: 'يدغم صوت النون في الحرف التالي، وتمد الغنة بمقدار حركتين مع (ي، ن، م، و)، وبدون غنة مع (ل، ر).',
    quranicExamples: [
      {
        verseSnippet: 'مَن يَقُولُ',
        highlightedPart: 'مَن يَقُولُ',
        surahName: 'البقرة',
        ayahNumber: 8,
        explanation: 'نون ساكنة بعدها ياء في كلمتين، إدغام ناقص بغنة مقدارها حركتان.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002008.mp3'
      },
      {
        verseSnippet: 'مِن رَّبِّهِمۡ',
        highlightedPart: 'مِن رَّبِّهِمۡ',
        surahName: 'البقرة',
        ayahNumber: 5,
        explanation: 'نون ساكنة بعدها راء، إدغام كامل بغير غنة.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002005.mp3'
      }
    ]
  },
  {
    id: 'rule-noon-iqlab',
    category: 'noon_tanween',
    categoryLabelAr: 'أحكام النون الساكنة والتنوين',
    titleAr: 'الإقلاب',
    ruleExplanation: 'هو قلب النون الساكنة أو التنوين ميماً مخفاة بغنة إذا وقع بعدها حرف (الباء) فقط، ويوضع في المصحف ميم صغيرة قائمة (مـ) فوق النون أو التنوين دلالة على الإقلاب.',
    letters: ['ب'],
    howToPronounce: 'اقلب صوت النون إلى ميم ساكنة مخفاة مع تلامس الشفتين برفق ودون كز، مع إظهار غنة كاملة حركتين.',
    quranicExamples: [
      {
        verseSnippet: 'مِنۢ بَعۡدِ',
        highlightedPart: 'مِنۢ بَعۡدِ',
        surahName: 'البقرة',
        ayahNumber: 27,
        explanation: 'نون ساكنة بعدها باء، قلبت النون ميماً مع الغنة بمقدار حركتين.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002027.mp3'
      }
    ]
  },
  {
    id: 'rule-noon-ikhfa',
    category: 'noon_tanween',
    categoryLabelAr: 'أحكام النون الساكنة والتنوين',
    titleAr: 'الإخفاء الحقيقي',
    ruleExplanation: 'هو النطق بالنون الساكنة أو التنوين بصفة بين الإظهار والإدغام عارٍ عن التشديد مع بقاء الغنة بمقدار حركتين، وحروفه خمسة عشر حرفاً مجموعة في أوائل كلمات البيت: (صِفْ ذَا ثَنَا كَمْ جَادَ شَخْصٌ قَدْ سَمَا * دُمْ طَيِّبًا زِدْ فِي تُقًى ضَعْ ظَالِمَا).',
    letters: ['ص', 'ذ', 'ث', 'ك', 'ج', 'ش', 'ق', 'س', 'د', 'ط', 'ز', 'ف', 'ت', 'ض', 'ظ'],
    howToPronounce: 'اجعل لسانك مهيأً عند مخرج الحرف التالي مباشرة دون إلصاقه بمخرج النون، وتكون الغنة مفخمة إن كان الحرف مفخماً (ص، ض، ط، ظ، ق) ومرققة إن كان مرققاً.',
    quranicExamples: [
      {
        verseSnippet: 'مِن قَبۡلِكَ',
        highlightedPart: 'مِن قَبۡلِكَ',
        surahName: 'البقرة',
        ayahNumber: 4,
        explanation: 'نون ساكنة بعدها قاف، إخفاء حقيقي بغنة مفخمة تتبع حرف القاف المستعلي.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002004.mp3'
      },
      {
        verseSnippet: 'كُنتُمۡ خَيۡرَ أُمَّةٍ',
        highlightedPart: 'كُنتُمۡ',
        surahName: 'آل عمران',
        ayahNumber: 110,
        explanation: 'نون ساكنة بعدها تاء، إخفاء حقيقي بغنة مرققة.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/003110.mp3'
      }
    ]
  },

  // 2. أحكام الميم الساكنة
  {
    id: 'rule-meem-sakinah',
    category: 'meem_sakinah',
    categoryLabelAr: 'أحكام الميم الساكنة',
    titleAr: 'أحكام الميم الساكنة الثلاثة',
    ruleExplanation: 'للميم الساكنة ثلاثة أحكام: 1. الإخفاء الشفوي: إذا وقع بعدها باء (تَرْمِيهِم بِحِجَارَةٍ). 2. إدغام المتماثلين الصغير: إذا وقع بعدها ميم متحركة (لَكُم مَّا كَسَبْتُمْ). 3. الإظهار الشفوي: مع باقي الحروف الـ 26، وتكون أشد إظهاراً عند الواو والفاء خشية الاتحاد والقرب في المخرج.',
    letters: ['ب', 'م', 'باقي الحروف'],
    howToPronounce: 'أخفِ الميم عند الباء بتلامس الشفتين بلطف مع غنة حركتين، وأدغمها في الميم بغنة، وأظهرها مع باقي الحروف دون زيادة غنة.',
    quranicExamples: [
      {
        verseSnippet: 'تَرۡمِيهِم بِحِجَارَةٖ',
        highlightedPart: 'تَرۡمِيهِم بِـ',
        surahName: 'الفيل',
        ayahNumber: 4,
        explanation: 'ميم ساكنة بعدها باء، إخفاء شفوي بغنة حركتين.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/105004.mp3'
      },
      {
        verseSnippet: 'عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ',
        highlightedPart: 'عَلَيۡهِمۡ وَلَا',
        surahName: 'الفاتحة',
        ayahNumber: 7,
        explanation: 'ميم ساكنة بعدها واو، إظهار شفوي شديد العناية لئلا تختفي الميم في مخرج الواو.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3'
      }
    ]
  },

  // 3. أحكام المدود
  {
    id: 'rule-madd-ahkam',
    category: 'madd',
    categoryLabelAr: 'أحكام المدود وأقسامها',
    titleAr: 'المد المتصل والمنفصل واللازم',
    ruleExplanation: 'المد هو إطالة الصوت بحرف من حروف المد الثلاثة (الألف، الواو، الياء). ينقسم إلى: 1. مد طبيعي: حركتان لا سبب له. 2. مد واجب متصل: أن يأتي الهمز بعد حرف المد في كلمة واحدة (جَآءَ، السَّمَآء) ويمد 4 أو 5 حركات. 3. مد جائز منفصل: أن يأتي حرف المد في كلمة والهمز في بداية الكلمة التالية (إِنَّآ أَعۡطَيۡنَٰكَ) ويمد 4 أو 5 حركات من طريق الشاطبية. 4. مد لازم: أن يأتي بعد حرف المد سكون أصلي مشدد (الضَّآلِّينَ، الحَآقَّة) ويمد 6 حركات وجوباً.',
    letters: ['ا', 'و', 'ي'],
    howToPronounce: 'التزم بوزن حركات المد بدقة: القصر (حركتان كالطبيعي)، التوسط (4 حركات)، الإشباع والطول (6 حركات في اللازم).',
    quranicExamples: [
      {
        verseSnippet: 'إِذَا جَآءَ نَصۡرُ ٱللَّهِ وَٱلۡفَتۡحُ',
        highlightedPart: 'جَآءَ',
        surahName: 'النصر',
        ayahNumber: 1,
        explanation: 'مد واجب متصل لاجتماع حرف المد والهمز في كلمة واحدة، مقداره 4 أو 5 حركات.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/110001.mp3'
      },
      {
        verseSnippet: 'وَلَا ٱلضَّآلِّينَ',
        highlightedPart: 'ٱلضَّآلِّينَ',
        surahName: 'الفاتحة',
        ayahNumber: 7,
        explanation: 'مد لازم كلمي مثقل، لأن حرف المد بعده حرف مشدد (اللام المشددة)، يمد 6 حركات وجوباً.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001007.mp3'
      }
    ]
  },

  // 4. القلقلة
  {
    id: 'rule-qalqalah',
    category: 'qalqalah',
    categoryLabelAr: 'صفات الحروف وأحكامها',
    titleAr: 'أحكام القلقلة ومراتبها',
    ruleExplanation: 'القلقلة هي اضطراب المخرج عند النطق بالحرف الساكن حتى يسمع له نبرة قوية، وحروفها خمسة مجموعة في: (قُطْبُ جَدٍّ). ومراتبها ثلاث: 1. كبرى: عند الوقف على الحرف المشدد (وتَبّ، الحَقّ). 2. وسطى: عند الوقف على الحرف الساكن غير المشدد (الفَلَق، مُحيط). 3. صغرى: في وسط الكلمة أو وسط الكلام (يَقْطعون، أَبْناء).',
    letters: ['ق', 'ط', 'ب', 'ج', 'د'],
    howToPronounce: 'قلقل الحرف باهتزاز سريع في مخرجه دون أن تشوبه حركة فتح أو ضم أو كسر ودون همزة بعده.',
    quranicExamples: [
      {
        verseSnippet: 'قُلۡ أَعُوذُ بِرَبِّ ٱلۡفَلَقِ',
        highlightedPart: 'ٱلۡفَلَقِ',
        surahName: 'الفلق',
        ayahNumber: 1,
        explanation: 'قاف ساكنة موقوف عليها مخففة، قلقلة وسطى واضحة.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3'
      },
      {
        verseSnippet: 'لَمۡ يَلِدۡ وَلَمۡ يُولَدۡ',
        highlightedPart: 'يَلِدۡ - يُولَدۡ',
        surahName: 'الإخلاص',
        ayahNumber: 3,
        explanation: 'دال ساكنة في الموضعين، قلقلة مسموعة.',
        audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/112003.mp3'
      }
    ]
  }
];

export const TAJWEED_QUIZZES: TajweedQuizItem[] = [
  {
    id: 'tq-1',
    category: 'rule',
    question: 'ما حكم النون الساكنة في قوله تعالى: ﴿مِن مَّالِ ٱللَّهِ﴾؟',
    options: ['إظهار حلقي', 'إدغام بغنة', 'إقلاب', 'إخفاء حقيقي'],
    correctIndex: 1,
    explanation: 'النون الساكنة جاء بعدها حرف الميم (وهو من حروف ينمو)، فحكمها إدغام كامل بغنة حركتين.'
  },
  {
    id: 'tq-2',
    category: 'makhraj',
    question: 'أي من الحروف التالية يخرج من «أقصى الحلق»؟',
    options: ['العين والحاء', 'الهمزة والهاء', 'الغين والخاء', 'القاف والكاف'],
    correctIndex: 1,
    explanation: 'الهمزة والهاء يخرجان من أقصى الحلق مما يلي الصدر عند منطقة الأوتار الصوتية.'
  },
  {
    id: 'tq-3',
    category: 'rule',
    question: 'ما مقدار مد الألف في قوله تعالى: ﴿وَلَا ٱلضَّآلِّينَ﴾ وصلاً ووقفاً؟',
    options: ['حركتان (طبيعي)', '4 حركات (توسط)', '6 حركات وجوباً (مد لازم كلمي مثقل)', 'يجوز فيه 2 أو 4 أو 6'],
    correctIndex: 2,
    explanation: 'مد لازم كلمي مثقل لوقوع حرف مشدد (اللام) بعد حرف المد في كلمة واحدة، ويمد ست حركات لزوماً.'
  },
  {
    id: 'tq-4',
    category: 'sifah',
    question: 'ما هي حروف القلقلة المجموعة في لفظ واحد؟',
    options: ['يرملون', 'خص ضغط قظ', 'قطب جد', 'أخي هاك علماً'],
    correctIndex: 2,
    explanation: 'حروف القلقلة خمسة هي: القاف، الطاء، الباء، الجيم، والدال، وتجمعها عبارة (قُطْبُ جَدٍّ).'
  },
  {
    id: 'tq-5',
    category: 'rule',
    question: 'ما الحكم التجويدي في قوله تعالى: ﴿تَرۡمِيهِم بِحِجَارَةٖ﴾؟',
    options: ['إظهار حلقي', 'إخفاء شفوي', 'إدغام متماثلين', 'إظهار شفوي'],
    correctIndex: 1,
    explanation: 'ميم ساكنة بعدها حرف الباء، فحكمها الإخفاء الشفوي بغنة بمقدار حركتين مع تلامس لطيف للشفتين.'
  }
];

