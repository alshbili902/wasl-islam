export interface LiveTvStream {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  hlsUrl: string;
  backupHlsUrl?: string;
  youtubeChannelUrl: string;
  youtubeEmbedId: string;
  badge: string;
}

export interface RadioStation {
  id: string;
  name: string;
  category: string;
  description: string;
  streamUrl: string;
  country: string;
}

export const LIVE_TV_STREAMS: LiveTvStream[] = [
  {
    id: 'makkah-live',
    title: 'قناة القرآن الكريم — المسجد الحرام',
    subtitle: 'بث مباشر على مدار الساعة من الكعبة المشرفة بمكة المكرمة مع تلاوات أئمة الحرمين',
    location: 'مكة المكرمة',
    hlsUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/saudi_quran-avc1_600000=2-mp4a_145600_ara=3.m3u8',
    backupHlsUrl: 'https://win.holol.com/live/quran/playlist.m3u8',
    youtubeChannelUrl: 'https://www.youtube.com/@SaudiQuranTv/streams',
    youtubeEmbedId: 'live_stream?channel=UC341eR3k9vB0sM2s6_A19wA',
    badge: 'بث مباشر 24/7 • مكة المكرمة',
  },
  {
    id: 'madinah-live',
    title: 'قناة السنة النبوية — المسجد النبوي الشريف',
    subtitle: 'بث مباشر على مدار الساعة من المسجد النبوي الشريف بالمدينة المنورة مع الأحاديث النبوية الصحيحة',
    location: 'المدينة المنورة',
    hlsUrl:
      'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/saudi_sunnah-avc1_600000=2-mp4a_145600_ara=3.m3u8',
    backupHlsUrl: 'https://win.holol.com/live/sunnah/playlist.m3u8',
    youtubeChannelUrl: 'https://www.youtube.com/@SaudiSunnahTv/streams',
    youtubeEmbedId: 'live_stream?channel=UC0N8X9_H7q5-j-H_C5r8L1w',
    badge: 'بث مباشر 24/7 • المدينة المنورة',
  },
];

export const RADIO_STATIONS: RadioStation[] = [
  {
    id: 'saudi-quran-official',
    name: 'إذاعة القرآن الكريم السعودية',
    category: 'إذاعات القرآن الكريم',
    description: 'البث المباشر الرسمي لإذاعة القرآن الكريم من المملكة العربية السعودية',
    streamUrl: 'https://stream.radiojar.com/0tpy1h0kxtzuv',
    country: 'المملكة العربية السعودية',
  },
  {
    id: 'saudi-nidaa-alislam',
    name: 'إذاعة نداء الإسلام من مكة المكرمة',
    category: 'إذاعات الدروس والمحاضرات',
    description: 'إذاعة إسلامية سعودية تبث من مكة المكرمة تعنى بالدعوة والعلوم الشرعية',
    streamUrl: 'https://stream.radiojar.com/4wqre23fytzuv',
    country: 'المملكة العربية السعودية',
  },
  {
    id: 'radio-quran-general',
    name: 'إذاعة القرآن الكريم العامة — تلاوات متنوعة',
    category: 'تلاوات قرآنية',
    description: 'تلاوات مرتلة مختارة على مدار الساعة لكبار قراء العالم الإسلامي',
    streamUrl: 'https://backup.qurango.net/radio/mix',
    country: 'العالم الإسلامي',
  },
  {
    id: 'radio-khashia',
    name: 'إذاعة التلاوات الخاشعة المؤثرة',
    category: 'تلاوات خاشعة',
    description: 'تلاوات خاشعة تبعث السكينة والطمأنينة في القلوب على مدار الساعة',
    streamUrl: 'https://backup.qurango.net/radio/salma',
    country: 'العالم الإسلامي',
  },
  {
    id: 'radio-tafsir',
    name: 'إذاعة التفسير الميسر لمعاني القرآن',
    category: 'علوم القرآن والتفسير',
    description: 'تلاوة آيات القرآن الكريم مع بيان معانيها من التفسير الميسر المعتمد',
    streamUrl: 'https://backup.qurango.net/radio/tafseer',
    country: 'المملكة العربية السعودية',
  },
  {
    id: 'radio-alafasy',
    name: 'إذاعة القارئ مشاري راشد العفاسي',
    category: 'إذاعات القراء',
    description: 'بث متواصل للمصحف المرتل بصوت الشيخ مشاري راشد العفاسي برواية حفص عن عاصم',
    streamUrl: 'https://backup.qurango.net/radio/mishary_alafasi',
    country: 'الكويت',
  },
  {
    id: 'radio-husary',
    name: 'إذاعة القارئ محمود خليل الحصري',
    category: 'المصحف المرتل',
    description: 'المصحف المرتل التاريخي بصوت شيخ عموم المقارئ المصرية الشيخ محمود خليل الحصري',
    streamUrl: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary',
    country: 'مصر',
  },
  {
    id: 'radio-sudais',
    name: 'إذاعة القارئ عبدالرحمن السديس',
    category: 'إذاعات أئمة الحرمين',
    description: 'تلاوات الحرم المكي والمصحف المرتل بصوت الشيخ د. عبدالرحمن السديس',
    streamUrl: 'https://backup.qurango.net/radio/abdulrahman_alsudaes',
    country: 'المملكة العربية السعودية',
  },
];
