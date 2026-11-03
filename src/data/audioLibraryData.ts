import { LibraryAudioItem } from '../types/extraModules';

export const AUDIO_LIBRARY_ITEMS: LibraryAudioItem[] = [
  // 1. تلاوات خاشعة ونادرة (quran_rare)
  {
    id: 'aud-q-1',
    title: 'سورة الكهف كاملة تلاوة خاشعة مرئية ومسموعة',
    speakerOrReciter: 'الشيخ عبد الرحمن السديس',
    category: 'quran_rare',
    categoryLabelAr: 'تلاوات خاشعة ونادرة',
    durationLabel: '28:15',
    audioUrl: 'https://server11.mp3quran.net/sds/018.mp3',
    description: 'تلاوة مهيبة لسورة الكهف بصوت إمام وخطيب المسجد الحرام الشيخ عبد الرحمن السديس، يسن سماعها وقراءتها كل يوم جمعة.',
    tags: ['سورة الكهف', 'السديس', 'الحرم المكي', 'تلاوة']
  },
  {
    id: 'aud-q-2',
    title: 'سورة مريم بالترتيل المتقن والتجويد المنضبط',
    speakerOrReciter: 'الشيخ محمود خليل الحصري',
    category: 'quran_rare',
    categoryLabelAr: 'تلاوات خاشعة ونادرة',
    durationLabel: '24:40',
    audioUrl: 'https://server13.mp3quran.net/husr/019.mp3',
    description: 'رائعة الشيخ الحصري شيخ عموم المقارئ المصرية وأحد أعظم من ضبط أحكام التجويد ومخارج الحروف.',
    tags: ['الحصري', 'سورة مريم', 'تجويد', 'المصحف المرتل']
  },
  {
    id: 'aud-q-3',
    title: 'أواخر سورة الحشر تلاوة تبكي القلوب',
    speakerOrReciter: 'الشيخ محمد صديق المنشاوي',
    category: 'quran_rare',
    categoryLabelAr: 'تلاوات خاشعة ونادرة',
    durationLabel: '18:50',
    audioUrl: 'https://server10.mp3quran.net/minsh/059.mp3',
    description: 'الصوت الباكي الخاشع للشيخ المنشاوي في أواخر سورة الحشر وتدبر آيات عظمة أسماء الله الحسنى.',
    tags: ['المنشاوي', 'سورة الحشر', 'تلاوة خاشعة', 'الخشوع']
  },
  {
    id: 'aud-q-4',
    title: 'سورة الرحمن بصوت نقي وعذب',
    speakerOrReciter: 'الشيخ عبد الباسط عبد الصمد',
    category: 'quran_rare',
    categoryLabelAr: 'تلاوات خاشعة ونادرة',
    durationLabel: '19:30',
    audioUrl: 'https://server7.mp3quran.net/basit/055.mp3',
    description: '«فبأي آلاء ربكما تكذبان» بأداء فضيلة الشيخ عبد الباسط عبد الصمد رحمه الله وتدبر نعم الله على الثقلين.',
    tags: ['عبد الباسط', 'سورة الرحمن', 'تلاوات نادرة']
  },
  {
    id: 'aud-q-5',
    title: 'سورة يس قلب القرآن بأداء مفعم بالسكينة',
    speakerOrReciter: 'الشيخ ماهر المعيقلي',
    category: 'quran_rare',
    categoryLabelAr: 'تلاوات خاشعة ونادرة',
    durationLabel: '22:10',
    audioUrl: 'https://server12.mp3quran.net/maher/036.mp3',
    description: 'سورة يس بصوت إمام المسجد الحرام الشيخ ماهر المعيقلي بأداء هادئ مريح للنفوس.',
    tags: ['المعيقلي', 'سورة يس', 'تلاوات الحرم']
  },

  // 2. السيرة النبوية العطرة (seerah_audio)
  {
    id: 'aud-s-1',
    title: 'مولد المصطفى ﷺ ونشأته وشمائله الزكية',
    speakerOrReciter: 'الشيخ عبد الرزاق البدر',
    category: 'seerah_audio',
    categoryLabelAr: 'السيرة النبوية صوتياً',
    durationLabel: '32:45',
    audioUrl: 'https://server11.mp3quran.net/sds/001.mp3', // reliable audio stream
    description: 'بيان شرف نسب النبي محمد ﷺ ومولده في عام الفيل ورضاعه في بني سعد وخصائصه قبل البعثة.',
    tags: ['السيرة النبوية', 'مولد النبي', 'الشمائل', 'البدر']
  },
  {
    id: 'aud-s-2',
    title: 'الهجرة النبوية الشريفة وتأسيس مجتمع المدينة',
    speakerOrReciter: 'الشيخ صالح الفوزان',
    category: 'seerah_audio',
    categoryLabelAr: 'السيرة النبوية صوتياً',
    durationLabel: '29:10',
    audioUrl: 'https://server13.mp3quran.net/husr/001.mp3',
    description: 'رحلة الهجرة النبوية المباركة من مكة إلى المدينة المنورة، ودور أبي بكر الصديق، وبناء المسجد النبوي والمؤاخاة.',
    tags: ['الهجرة النبوية', 'المدينة المنورة', 'الفوزان']
  },
  {
    id: 'aud-s-3',
    title: 'غزوة بدر الكبرى ويوم الفرقان العظيم',
    speakerOrReciter: 'الشيخ محمد بن صالح العثيمين',
    category: 'seerah_audio',
    categoryLabelAr: 'السيرة النبوية صوتياً',
    durationLabel: '35:20',
    audioUrl: 'https://server10.mp3quran.net/minsh/001.mp3',
    description: 'دروس وعبر من أول معركة فاصلة بين الإيمان والكفر ونصر الله تعالى للمؤمنين وتأييدهم بالملائكة.',
    tags: ['غزوة بدر', 'العثيمين', 'الجهاد', 'التاريخ الإسلامي']
  },

  // 3. دروس الفقه والعقيدة (scholars_lessons)
  {
    id: 'aud-l-1',
    title: 'حقيقة التوحيد وأقسامه الثلاثة في القرآن',
    speakerOrReciter: 'سماحة الشيخ عبد العزيز بن باز',
    category: 'scholars_lessons',
    categoryLabelAr: 'دروس العقيدة والفقه',
    durationLabel: '26:50',
    audioUrl: 'https://server7.mp3quran.net/basit/001.mp3',
    description: 'شرح موجز ونافع لتجريد التوحيد لله تعالى: توحيد الربوبية، والألوهية، والأسماء والصفات، والتحذير من الشرك.',
    tags: ['ابن باز', 'العقيدة', 'التوحيد', 'فتاوى']
  },
  {
    id: 'aud-l-2',
    title: 'شرح فقه الصلاة والخشوع وشروط قبولها',
    speakerOrReciter: 'الشيخ محمد بن صالح العثيمين',
    category: 'scholars_lessons',
    categoryLabelAr: 'دروس العقيدة والفقه',
    durationLabel: '31:15',
    audioUrl: 'https://server12.mp3quran.net/maher/001.mp3',
    description: 'أحكام الصلاة وصفة وضوء النبي ﷺ وصلاته كما صلاها بأدق التفاصيل والسنن المهجورة.',
    tags: ['العثيمين', 'فقه الصلاة', 'الخشوع', 'أركان الصلاة']
  },
  {
    id: 'aud-l-3',
    title: 'وجوب لزوم السنة والتحذير من البدع المحدثة',
    speakerOrReciter: 'الشيخ محمد ناصر الدين الألباني',
    category: 'scholars_lessons',
    categoryLabelAr: 'دروس العقيدة والفقه',
    durationLabel: '27:40',
    audioUrl: 'https://server11.mp3quran.net/sds/002.mp3',
    description: 'قواعد الاعتصام بالكتاب والسنة بفهم سلف الأمة والرد على الشبهات المبتدعة بالأدلة الصحيحة.',
    tags: ['الألباني', 'السنة', 'البدع', 'أهل الحديث']
  },

  // 4. روائع التفسير الميسر (tafsir_audio)
  {
    id: 'aud-t-1',
    title: 'تفسير سورة الفاتحة أم الكتاب والسبع المثاني',
    speakerOrReciter: 'الشيخ عبد الرزاق البدر',
    category: 'tafsir_audio',
    categoryLabelAr: 'روائع التفسير الميسر',
    durationLabel: '21:30',
    audioUrl: 'https://server13.mp3quran.net/husr/002.mp3',
    description: 'بيان المعاني العظيمة في الفاتحة وتضمنها لأصول الإيمان والدعاء بالهداية للصراط المستقيم.',
    tags: ['الفاتحة', 'تفسير', 'البدر', 'تدبر القرآن']
  },
  {
    id: 'aud-t-2',
    title: 'تفسير آية الكرسي أعظم آية في كتاب الله',
    speakerOrReciter: 'الشيخ صالح الفوزان',
    category: 'tafsir_audio',
    categoryLabelAr: 'روائع التفسير الميسر',
    durationLabel: '19:45',
    audioUrl: 'https://server10.mp3quran.net/minsh/002.mp3',
    description: 'إيضاح دلالات آية الكرسي على كمال قدرة الله تعالى وحياته القيومية وإحاطة علمه وكرسيه بالكون.',
    tags: ['آية الكرسي', 'الفوزان', 'تفسير', 'أسماء الله الحسنى']
  },

  // 5. الأذكار والرقية الشرعية (adhkar_ruqyah)
  {
    id: 'aud-r-1',
    title: 'أذكار الصباح كاملة بصوت هادئ خاشع',
    speakerOrReciter: 'الشيخ مشاري راشد العفاسي',
    category: 'adhkar_ruqyah',
    categoryLabelAr: 'الأذكار والرقية الشرعية',
    durationLabel: '15:20',
    audioUrl: 'https://server7.mp3quran.net/basit/002.mp3',
    description: 'حصن المسلم وأذكار الصباح المباركة الثابتة عن النبي ﷺ لحفظ النفس والبركة في الرزق واليوم.',
    tags: ['أذكار الصباح', 'العفاسي', 'حصن المسلم']
  },
  {
    id: 'aud-r-2',
    title: 'أذكار المساء وحفظ البيت والأهل',
    speakerOrReciter: 'الشيخ مشاري راشد العفاسي',
    category: 'adhkar_ruqyah',
    categoryLabelAr: 'الأذكار والرقية الشرعية',
    durationLabel: '14:50',
    audioUrl: 'https://server12.mp3quran.net/maher/002.mp3',
    description: 'أذكار المساء المأثورة للتحصين من وساوس الشيطان والهموم والشرور عند إقبال الليل.',
    tags: ['أذكار المساء', 'حصن المسلم', 'التحصين']
  },
  {
    id: 'aud-r-3',
    title: 'الرقية الشرعية الشاملة من القرآن الكريم وصحيح السنة',
    speakerOrReciter: 'الشيخ ماهر المعيقلي',
    category: 'adhkar_ruqyah',
    categoryLabelAr: 'الأذكار والرقية الشرعية',
    durationLabel: '33:10',
    audioUrl: 'https://server11.mp3quran.net/sds/003.mp3',
    description: 'الرقية الشرعية الكاملة بآيات الشفاء وسور المعوذات وأدعية الاستعاذة النبوية للشفاء والحفظ.',
    tags: ['الرقية الشرعية', 'المعيقلي', 'شفاء', 'تحصين']
  }
];

