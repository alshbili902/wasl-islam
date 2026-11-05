import { 
  SupportedLanguage, 
  QuranicArabicLevel, 
  WordByWordAyahData, 
  QuranicVocabCard 
} from '../types/quranLearning';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'ar', nameEn: 'Arabic', nameNative: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'en', nameEn: 'English', nameNative: 'English', direction: 'ltr', flag: '🇬🇧' },
  { code: 'ur', nameEn: 'Urdu', nameNative: 'اردو', direction: 'rtl', flag: '🇵🇰' },
  { code: 'fr', nameEn: 'French', nameNative: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'id', nameEn: 'Indonesian', nameNative: 'Bahasa Indonesia', direction: 'ltr', flag: '🇮🇩' },
  { code: 'tr', nameEn: 'Turkish', nameNative: 'Türkçe', direction: 'ltr', flag: '🇹🇷' },
  { code: 'bn', nameEn: 'Bengali', nameNative: 'বাংলা', direction: 'ltr', flag: '🇧🇩' }
];

export const QURANIC_ARABIC_LEVELS: QuranicArabicLevel[] = [
  {
    levelNumber: 1,
    titleAr: 'المستوى الأول: أصول الأبجدية والحركات والأصوات',
    titleEn: 'Level 1: Arabic Alphabet & Phonics',
    descriptionAr: 'تعلم حروف الهجاء العربية بأشكالها الثلاثة والحركات القصيرة (الفتحة، الضمة، الكسرة) وحروف المد والسكون.',
    descriptionEn: 'Learn Arabic letters in isolated and connected forms, short vowels, long vowels, and sukun.',
    modulesList: [
      {
        id: 'lvl-1-mod-1',
        titleAr: 'حروف الهجاء وأشكالها',
        titleEn: 'Alphabet & Letter Positions',
        summaryAr: 'التعرف على الـ 28 حرفاً في أول الكلمة ووسطها وآخرها.',
        topics: ['الأشكال المتصلة والمنفصلة', 'الحروف التي لا تتصل بما بعدها', 'الهمزة وأنواعها']
      },
      {
        id: 'lvl-1-mod-2',
        titleAr: 'الحركات القصيرة وحروف المد',
        titleEn: 'Short & Long Vowels',
        summaryAr: 'الفتحة والضمة والكسرة والمد بالألف والواو والياء.',
        topics: ['زمن نطق الحركة القصيرة', 'الفرق بين الحركة وحرف المد', 'التنوين الثلاثي']
      }
    ]
  },
  {
    levelNumber: 2,
    titleAr: 'المستوى الثاني: قواعد القراءة القرآنية ورسم المصحف',
    titleEn: 'Level 2: Quranic Reading & Orthography',
    descriptionAr: 'قراءة الكلمات القرآنية المركبة، رسم المصحف العثماني، التاء المربوطة والمفتوحة، وهمزة الوصل والقطع.',
    descriptionEn: 'Reading complex Quranic compound words, Uthmani script peculiarities, and hamzat al-wasl.',
    modulesList: [
      {
        id: 'lvl-2-mod-1',
        titleAr: 'خصائص الرسم العثماني',
        titleEn: 'Uthmani Script Features',
        summaryAr: 'الألف الخنجرية، الصفر المستدير والمستطيل، والياء والواو الصغيرتان.',
        topics: ['الألف المحذوفة رسماً الثابتة لفظاً', 'علامات السكون في المصحف', 'هاء الكناية']
      },
      {
        id: 'lvl-2-mod-2',
        titleAr: 'التعابير القرآنية الأكثر شيوعاً',
        titleEn: 'Frequent Quranic Formulae',
        summaryAr: 'قراءة آيات البسملة والاستعاذة والحمدلة والتسبيح بدقة.',
        topics: ['سبحان الله', 'الحمد لله رب العالمين', 'إن شاء الله', 'لا حول ولا قوة إلا بالله']
      }
    ]
  },
  {
    levelNumber: 3,
    titleAr: 'المستوى الثالث: مفردات القرآن الأكثر تكراراً والجذور',
    titleEn: 'Level 3: Core Quranic Vocabulary & Roots',
    descriptionAr: 'دراسة الكلمات والجذور الثلاثية التي تشكل ما يزيد عن 80% من ألفاظ القرآن الكريم.',
    descriptionEn: 'Study core tri-literal roots and high-frequency vocabulary covering 80%+ of the Quranic text.',
    modulesList: [
      {
        id: 'lvl-3-mod-1',
        titleAr: 'الجذور الثلاثية وعائلات الكلمات',
        titleEn: 'Triliteral Roots & Derivations',
        summaryAr: 'فهم كيف يشتق من الجذر (ع-ل-م) كلمات: علم، عالم، عليم، يعلمون، معلّم.',
        topics: ['الميزان الصرفي (فعل)', 'المفرد والجمع السالم والتكسير', 'أوزان الفاعل والمفعول']
      },
      {
        id: 'lvl-3-mod-2',
        titleAr: 'أفعال القرآن الشائعة',
        titleEn: 'Common Quranic Verbs',
        summaryAr: 'الأفعال الأكثر وروداً: قال، كان، جعل، خلق، آمن، كفر، عمل، جاء.',
        topics: ['تصريف الماضي والمضارع والأمر', 'الضمائر المتصلة بالفعل', 'نون النسوة وواو الجماعة']
      }
    ]
  },
  {
    levelNumber: 4,
    titleAr: 'المستوى الرابع: القواعد النحوية القرآنية الميسرة',
    titleEn: 'Level 4: Applied Quranic Grammar',
    descriptionAr: 'التمييز بين الاسم والفعل والحرف، وفهم المبتدأ والخبر، والفاعل والمفعول، وحروف الجر في الآيات.',
    descriptionEn: 'Distinguish nouns, verbs, and particles, understand basic sentence structures, agents, and objects.',
    modulesList: [
      {
        id: 'lvl-4-mod-1',
        titleAr: 'الجملة الاسمية والجملة الفعلية',
        titleEn: 'Nominal & Verbal Sentences',
        summaryAr: 'تركيب الجملة في القرآن: الفاعل المرفوع والمفعول به المنصوب والمجرورات.',
        topics: ['المبتدأ والخبر', 'الفاعل ونائبه', 'حروف الجر وأثرها الإعرابي']
      },
      {
        id: 'lvl-4-mod-2',
        titleAr: 'الضمائر وأسماء الإشارة والموصول',
        titleEn: 'Pronouns & Relatives',
        summaryAr: 'الذي، الذين، هذا، هؤلاء، والضمائر المنفصلة والمتصلة في الخطاب القرآني.',
        topics: ['ضمائر المخاطب والغائب والمتكلم', 'الأسماء الموصولة', 'أسماء الإشارة']
      }
    ]
  },
  {
    levelNumber: 5,
    titleAr: 'المستوى الخامس: فقه التراكيب والبيان القرآني',
    titleEn: 'Level 5: Quranic Rhetoric & Structures',
    descriptionAr: 'تذوق بلاغة القرآن الكريم وأسرار التقديم والتأخير وأساليب القسم والاستفهام والمثل القرآني.',
    descriptionEn: 'Appreciate Quranic eloquence, word placement, rhetorical oaths, and metaphorical parables.',
    modulesList: [
      {
        id: 'lvl-5-mod-1',
        titleAr: 'التقديم والتأخير والقصر والحصر',
        titleEn: 'Word Order & Emphasis',
        summaryAr: 'لماذا قيل ﴿إِيَّاكَ نَعْبُدُ﴾ ولم يقل (نعبدك) لإفادة الحصر والتخصيص.',
        topics: ['أسلوب القصر والحصر', 'أدوات التوكيد (إنّ، اللام)', 'بلاغة الحذف']
      },
      {
        id: 'lvl-5-mod-2',
        titleAr: 'أقسام القرآن وأمثاله',
        titleEn: 'Oaths & Parables',
        summaryAr: 'دلالات القسم بمخلوقات الله كالشمس والقمر والليل، وضرب الأمثال للناس.',
        topics: ['حروف القسم', 'أمثال القرآن الحية', 'التصوير الفني في القرآن']
      }
    ]
  }
];

export const WORD_BY_WORD_VERSES: WordByWordAyahData[] = [
  // سورة الفاتحة - الآية 1
  {
    surahNumber: 1,
    ayahNumber: 1,
    surahName: 'الفاتحة',
    fullAyahText: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
    tafsirSummary: 'أبدأ قراءتي مستعيناً باسم الله الأعظم، المتصف بصفة الرحمة الواسعة الشاملة لجميع الخلق، الرحيم بالمؤمنين.',
    words: [
      {
        wordId: '1-1-1',
        wordArabic: 'بِسۡمِ',
        transliteration: 'Bismi',
        rootArabic: 'س-م-و',
        grammarCategoryAr: 'جار ومجرور (الباء حرف جر + اسم مجرور)',
        grammarCategoryEn: 'Preposition + Noun in Genitive',
        meanings: {
          ar: 'مستعيناً ومتبركاً باسم',
          en: 'In the name of',
          ur: 'نام کے ساتھ',
          fr: 'Au nom de',
          id: 'Dengan nama',
          tr: 'İsmiyle, adıyla',
          bn: 'নামে'
        },
        linguisticBenefitAr: 'الباء للاستعانة والتبرك، وحُذفت ألف "اسم" لكثرة الاستعمال.'
      },
      {
        wordId: '1-1-2',
        wordArabic: 'ٱللَّهِ',
        transliteration: 'Allāh',
        rootArabic: 'إ-ل-ه',
        grammarCategoryAr: 'اسم الجلالة، مضاف إليه مجرور وعلامة جره الكسرة',
        grammarCategoryEn: 'Proper noun (Allah), genitive',
        meanings: {
          ar: 'الإله الحق المستحق للعبادة وحده',
          en: 'Allah (the One True God)',
          ur: 'اللہ (جو معبودِ برحق ہے)',
          fr: 'Allah (le Dieu Unique)',
          id: 'Allah (Tuhan Yang Maha Esa)',
          tr: 'Allah (Tek ve Hakiki İlah)',
          bn: 'আল্লাহ (একমাত্র উপাস্য)'
        },
        linguisticBenefitAr: 'أخص أسماء الله تعالى ولا يسمى به غيره، وأصله الإله حذفت همزته وأدغمت لامه للتعظيم.'
      },
      {
        wordId: '1-1-3',
        wordArabic: 'ٱلرَّحۡمَٰنِ',
        transliteration: 'Ar-Raḥmān',
        rootArabic: 'ر-ح-م',
        grammarCategoryAr: 'نعت أول لاسم الجلالة مجرور بالكسرة',
        grammarCategoryEn: 'First Epithet / Adjective, genitive',
        meanings: {
          ar: 'ذو الرحمة الواسعة التي وسعت كل شيء',
          en: 'The Entirely Merciful',
          ur: 'بڑا مہربان (وسیع رحمت والا)',
          fr: 'Le Tout Miséricordieux',
          id: 'Maha Pengasih',
          tr: 'Rahmân (Sonsuz Merhamet Sahibi)',
          bn: 'পরম করুণাময়'
        },
        linguisticBenefitAr: 'على وزن فَعلان دال على الامتلاء والاتساع والشمول لجميع الخلائق.'
      },
      {
        wordId: '1-1-4',
        wordArabic: 'ٱلرَّحِيمِ',
        transliteration: 'Ar-Raḥīm',
        rootArabic: 'ر-ح-م',
        grammarCategoryAr: 'نعت ثانٍ لاسم الجلالة مجرور بالكسرة',
        grammarCategoryEn: 'Second Epithet / Adjective, genitive',
        meanings: {
          ar: 'ذو الرحمة الدائمة الموصلة لعباده المؤمنين',
          en: 'The Especially Merciful',
          ur: 'نہایت رحم فرمانے والا',
          fr: 'Le Très Miséricordieux',
          id: 'Maha Penyayang',
          tr: 'Rahîm (Bağışlayıcı ve Şefkatli)',
          bn: 'অসীম দয়ালু'
        },
        linguisticBenefitAr: 'على وزن فَعيل دال على الثبوت والدوام وإيصال الرحمة إلى المرحومين.'
      }
    ]
  },

  // سورة الفاتحة - الآية 2
  {
    surahNumber: 1,
    ayahNumber: 2,
    surahName: 'الفاتحة',
    fullAyahText: 'ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ',
    tafsirSummary: 'الثناء الكامل والمحبة والتعظيم كله لله وحده خالصاً دون سواه، وهو المربي لجميع خلقه بنعمه.',
    words: [
      {
        wordId: '1-2-1',
        wordArabic: 'ٱلۡحَمۡدُ',
        transliteration: 'Al-Ḥamdu',
        rootArabic: 'ح-م-د',
        grammarCategoryAr: 'مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة',
        grammarCategoryEn: 'Subject / Noun in Nominative with Definite Article',
        meanings: {
          ar: 'الثناء الكامل المطلق مع المحبة والتعظيم',
          en: 'All praise and thanks',
          ur: 'تمام تعریفیں اور شکر',
          fr: 'Toutes les louanges',
          id: 'Segala puji',
          tr: 'Tüm övgüler ve hamdler',
          bn: 'সমস্ত প্রশংসা'
        },
        linguisticBenefitAr: '(أل) للاستغراق أي استغراق جميع أنواع المحامد والكمالات لله سبحانه.'
      },
      {
        wordId: '1-2-2',
        wordArabic: 'لِلَّهِ',
        transliteration: 'Lillāh',
        rootArabic: 'إ-ل-ه',
        grammarCategoryAr: 'اللام حرف جر للاختصاص والاستحقاق + اسم الجلالة',
        grammarCategoryEn: 'Preposition (For) + Allah',
        meanings: {
          ar: 'خالصاً ومستحقاً لله وحده',
          en: 'belong to Allah',
          ur: 'اللہ ہی کے لیے ہیں',
          fr: 'sont à Allah',
          id: 'bagi Allah',
          tr: 'Allah\'a aittir',
          bn: 'আল্লাহর জন্য'
        },
        linguisticBenefitAr: 'اللام تفيد الملك والاستحقاق والاختصاص.'
      },
      {
        wordId: '1-2-3',
        wordArabic: 'رَبِّ',
        transliteration: 'Rabbi',
        rootArabic: 'ر-ب-ب',
        grammarCategoryAr: 'بدل أو نعت لاسم الجلالة مجرور بالكسرة',
        grammarCategoryEn: 'Apposition / Noun (Lord / Sustainer), genitive',
        meanings: {
          ar: 'المالك المصلح المربي المعبود بحق',
          en: 'Lord and Sustainer of',
          ur: 'پروردگار اور مالک',
          fr: 'Seigneur de',
          id: 'Tuhan pemelihara',
          tr: 'Rabbidir (Eğiten ve Besleyen)',
          bn: 'রব্ব (পালনকর্তা)'
        },
        linguisticBenefitAr: 'الرب يتضمن معاني الخلق والملك والتدبير والتربية والإنعام.'
      },
      {
        wordId: '1-2-4',
        wordArabic: 'ٱلۡعَٰلَمِينَ',
        transliteration: 'Al-ʿĀlamīn',
        rootArabic: 'ع-ل-م',
        grammarCategoryAr: 'مضاف إليه مجرور بالياء لأنه ملحق بجمع المذكر السالم',
        grammarCategoryEn: 'Plural Noun (All the worlds), genitive',
        meanings: {
          ar: 'كل ما سوى الله من الإنس والجن والملائكة والخلائق',
          en: 'the worlds (all creation)',
          ur: 'تمام جہانوں کا',
          fr: 'l\'univers',
          id: 'seluruh alam semesta',
          tr: 'tüm âlemlerin',
          bn: 'সমগ্র সৃষ্টিজগতের'
        },
        linguisticBenefitAr: 'جمع عالَم، سمي بذلك لأنه عَلَم ودليل على وجود خالقه وبارئه سبحانه.'
      }
    ]
  },

  // سورة الفاتحة - الآية 5
  {
    surahNumber: 1,
    ayahNumber: 5,
    surahName: 'الفاتحة',
    fullAyahText: 'إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ',
    tafsirSummary: 'نخصك وحدك بالعبادة والتذلل، ونخصك وحدك بطلب العون في جميع شؤوننا، فلا نعبد إلا إياك ولا نستعين إلا بك.',
    words: [
      {
        wordId: '1-5-1',
        wordArabic: 'إِيَّاكَ',
        transliteration: 'Iyyāka',
        rootArabic: 'إ-ي-ي',
        grammarCategoryAr: 'ضمير منفصل مبني في محل نصب مفعول به مقدم',
        grammarCategoryEn: 'Detached Pronoun, fronted direct object (You alone)',
        meanings: {
          ar: 'أنت وحدك لا شريك لك',
          en: 'You alone',
          ur: 'صرف تجھی کو',
          fr: 'C\'est Toi seul que',
          id: 'Hanya kepada Engkaulah',
          tr: 'Yalnızca Sana',
          bn: 'কেবল আপনারই'
        },
        linguisticBenefitAr: 'تقديم المفعول به "إياك" يفيد الحصر والقصر: أي لا نعبد غيرك قط.'
      },
      {
        wordId: '1-5-2',
        wordArabic: 'نَعۡبُدُ',
        transliteration: 'Naʿbudu',
        rootArabic: 'ع-ب-د',
        grammarCategoryAr: 'فعل مضارع مرفوع بالضمة والفاعل ضمير مستتر تقديره نحن',
        grammarCategoryEn: 'Imperfect Verb, 1st person plural (we worship)',
        meanings: {
          ar: 'نفرك بالطاعة والذل والمحبة والخضوع',
          en: 'we worship',
          ur: 'ہم بندگی کرتے ہیں',
          fr: 'nous adorons',
          id: 'kami menyembah',
          tr: 'kulluk ederiz',
          bn: 'আমরা ইবাদত করি'
        },
        linguisticBenefitAr: 'العبادة كمال الحب مع كمال الذل والخضوع لله سبحانه.'
      },
      {
        wordId: '1-5-3',
        wordArabic: 'وَإِيَّاكَ',
        transliteration: 'Wa-Iyyāka',
        rootArabic: 'إ-ي-ي',
        grammarCategoryAr: 'الواو عاطفة + ضمير منفصل مفعول به مقدم',
        grammarCategoryEn: 'Conjunction (and) + Pronoun (You alone)',
        meanings: {
          ar: 'وبك وحدك دون خلقك',
          en: 'and You alone',
          ur: 'اور صرف تجھی سے',
          fr: 'et c\'est Toi seul que',
          id: 'dan hanya kepada Engkaulah',
          tr: 've yalnız Senden',
          bn: 'এবং শুধু আপনার কাছেই'
        },
        linguisticBenefitAr: 'تكرار الضمير "إياك" لتوكيد إخلاص الاستعانة ونفي الشرك فيها.'
      },
      {
        wordId: '1-5-4',
        wordArabic: 'نَسۡتَعِينُ',
        transliteration: 'Nastaʿīn',
        rootArabic: 'ع-و-ن',
        grammarCategoryAr: 'فعل مضارع مرفوع بالضمة، والفاعل ضمير مستتر (نحن)',
        grammarCategoryEn: 'Imperfect Verb, 1st person plural (we ask for help)',
        meanings: {
          ar: 'نطلب العون والمدد والقوة والتوفيق في أمورنا',
          en: 'we ask for help',
          ur: 'ہم مدد مانگتے ہیں',
          fr: 'nous implorons le secours',
          id: 'kami memohon pertolongan',
          tr: 'yardım dileriz',
          bn: 'আমরা সাহায্য প্রার্থনা করি'
        },
        linguisticBenefitAr: 'السين والتاء للطلب؛ أي نطلب عونك الدائم لعلمنا بضعفنا وغناك المطلق.'
      }
    ]
  }
];

export const CORE_VOCABULARY_CARDS: QuranicVocabCard[] = [
  {
    id: 'voc-1',
    wordArabic: 'قَالَ',
    rootArabic: 'ق-و-ل',
    frequencyInQuran: 1722,
    grammaticalType: 'فعل ماض',
    themeCategory: 'stories',
    themeCategoryLabelAr: 'الحوار والقصص القرآني',
    meanings: {
      ar: 'تكلم وأخبر ونطق',
      en: 'He said / He stated',
      ur: 'اس نے کہا',
      fr: 'Il a dit',
      id: 'Dia berkata',
      tr: 'Dedi, söyledi',
      bn: 'তিনি বললেন'
    },
    exampleAyah: {
      text: 'قَالَ إِنِّي عَبۡدُ ٱللَّهِ ءَاتَىٰنِيَ ٱلۡكِتَٰبَ',
      surahName: 'مريم',
      ayahNumber: 30
    }
  },
  {
    id: 'voc-2',
    wordArabic: 'كَانَ',
    rootArabic: 'ك-و-ن',
    frequencyInQuran: 1358,
    grammaticalType: 'فعل ماض',
    themeCategory: 'theology',
    themeCategoryLabelAr: 'العقيدة والصفات',
    meanings: {
      ar: 'فعل ناقص يدل على الثبوت والوجود الأزلي لله',
      en: 'Was / Existed / Ever is',
      ur: 'تھا / ہمیشہ سے ہے',
      fr: 'Était / Fut',
      id: 'Adalah / Dia Maha',
      tr: 'İdi, oldu',
      bn: 'ছিল / চিরকাল আছেন'
    },
    exampleAyah: {
      text: 'وَكَانَ ٱللَّهُ عَلِيمًا حَكِيمٗا',
      surahName: 'النساء',
      ayahNumber: 17
    }
  },
  {
    id: 'voc-3',
    wordArabic: 'عَلِيمٌ',
    rootArabic: 'ع-ل-م',
    frequencyInQuran: 162,
    grammaticalType: 'اسم',
    themeCategory: 'theology',
    themeCategoryLabelAr: 'أسماء الله الحسنى',
    meanings: {
      ar: 'المحيط بكل شيء علماً ظاهراً وباطناً سرّاً وعلانية',
      en: 'All-Knowing / Omniscient',
      ur: 'سب کچھ جاننے والا',
      fr: 'Omniscient',
      id: 'Maha Mengetahui',
      tr: 'Her Şeyi Bilen',
      bn: 'সর্বজ্ঞ'
    },
    exampleAyah: {
      text: 'وَٱللَّهُ بِكُلِّ شَيۡءٍ عَلِيمٌ',
      surahName: 'البقرة',
      ayahNumber: 282
    }
  },
  {
    id: 'voc-4',
    wordArabic: 'ءَامَنُواْ',
    rootArabic: 'أ-م-ن',
    frequencyInQuran: 537,
    grammaticalType: 'فعل ماض',
    themeCategory: 'theology',
    themeCategoryLabelAr: 'الإيمان واليقين',
    meanings: {
      ar: 'صدقوا وأيقنوا واطمأنت قلوبهم وأذعنوا لأمر الله',
      en: 'They believed',
      ur: 'وہ ایمان لائے',
      fr: 'Ils ont cru',
      id: 'Mereka beriman',
      tr: 'İman ettiler',
      bn: 'তারা ঈমান এনেছে'
    },
    exampleAyah: {
      text: 'يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ ٱتَّقُواْ ٱللَّهَ',
      surahName: 'البقرة',
      ayahNumber: 278
    }
  },
  {
    id: 'voc-5',
    wordArabic: 'خَلَقَ',
    rootArabic: 'خ-ل-ق',
    frequencyInQuran: 248,
    grammaticalType: 'فعل ماض',
    themeCategory: 'creation',
    themeCategoryLabelAr: 'الخلق والكون',
    meanings: {
      ar: 'أوجد من العدم وأبدع وصوّر بقدرته',
      en: 'He created',
      ur: 'اس نے پیدا کیا',
      fr: 'Il a créé',
      id: 'Dia menciptakan',
      tr: 'Yarattı',
      bn: 'তিনি সৃষ্টি করেছেন'
    },
    exampleAyah: {
      text: 'ٱلَّذِي خَلَقَ ٱلۡمَوۡتَ وَٱلۡحَيَوٰةَ لِيَبۡلُوَكُمۡ',
      surahName: 'الملك',
      ayahNumber: 2
    }
  },
  {
    id: 'voc-6',
    wordArabic: 'رَحۡمَةٌ',
    rootArabic: 'ر-ح-م',
    frequencyInQuran: 114,
    grammaticalType: 'اسم',
    themeCategory: 'theology',
    themeCategoryLabelAr: 'الرحمة والمغفرة',
    meanings: {
      ar: 'الرأفة والإحسان والخير العظيم من الله',
      en: 'Mercy / Grace',
      ur: 'رحمت اور فضل',
      fr: 'Miséricorde',
      id: 'Rahmat / Kasih sayang',
      tr: 'Merhamet, rahmet',
      bn: 'রহমত ও অনুকম্পা'
    },
    exampleAyah: {
      text: 'وَمَآ أَرۡسَلۡنَٰكَ إِلَّا رَحۡمَةٗ لِّلۡعَٰلَمِينَ',
      surahName: 'الأنبياء',
      ayahNumber: 107
    }
  }
];
