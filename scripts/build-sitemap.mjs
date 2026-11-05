import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://wasl-islam.fun';
const TODAY = new Date().toISOString().split('T')[0];

// 1. Core static routes
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/quran', priority: '0.95', changefreq: 'daily' },
  { path: '/tafsir', priority: '0.9', changefreq: 'weekly' },
  { path: '/hadith', priority: '0.9', changefreq: 'weekly' },
  { path: '/adhkar', priority: '0.9', changefreq: 'weekly' },
  { path: '/duas', priority: '0.9', changefreq: 'weekly' },
  { path: '/prayer', priority: '0.9', changefreq: 'daily' },
  { path: '/seerah', priority: '0.85', changefreq: 'monthly' },
  { path: '/prophets', priority: '0.85', changefreq: 'monthly' },
  { path: '/companions', priority: '0.85', changefreq: 'monthly' },
  { path: '/academy', priority: '0.85', changefreq: 'monthly' },
  { path: '/worship', priority: '0.85', changefreq: 'monthly' },
  { path: '/aqeedah', priority: '0.85', changefreq: 'monthly' },
  { path: '/fatwas', priority: '0.85', changefreq: 'monthly' },
  { path: '/companion', priority: '0.85', changefreq: 'weekly' },
  { path: '/hajj-umrah', priority: '0.85', changefreq: 'monthly' },
  { path: '/kids', priority: '0.85', changefreq: 'monthly' },
  { path: '/history-atlas', priority: '0.85', changefreq: 'monthly' },
  { path: '/daily-fiqh', priority: '0.85', changefreq: 'weekly' },
  { path: '/content-verifier', priority: '0.85', changefreq: 'weekly' },
  { path: '/janazah', priority: '0.85', changefreq: 'monthly' },
  { path: '/audio-library', priority: '0.85', changefreq: 'weekly' },
  { path: '/card-studio', priority: '0.8', changefreq: 'monthly' },
  { path: '/islamic-centers', priority: '0.8', changefreq: 'monthly' },
  { path: '/scholars', priority: '0.85', changefreq: 'monthly' },
  { path: '/quran-coach', priority: '0.85', changefreq: 'weekly' },
  { path: '/tajweed-lab', priority: '0.85', changefreq: 'monthly' },
  { path: '/quranic-arabic', priority: '0.85', changefreq: 'monthly' },
  { path: '/sign-language', priority: '0.85', changefreq: 'monthly' },
  { path: '/reciters', priority: '0.85', changefreq: 'monthly' },
  { path: '/khatmah', priority: '0.8', changefreq: 'monthly' },
  { path: '/tasbih', priority: '0.8', changefreq: 'monthly' },
  { path: '/sleep', priority: '0.8', changefreq: 'monthly' },
  { path: '/charity', priority: '0.85', changefreq: 'monthly' },
  { path: '/donations', priority: '0.85', changefreq: 'monthly' },
  { path: '/channels', priority: '0.85', changefreq: 'monthly' },
  { path: '/radio', priority: '0.85', changefreq: 'monthly' },
  { path: '/live', priority: '0.85', changefreq: 'monthly' },
  { path: '/updates', priority: '0.85', changefreq: 'weekly' },
  { path: '/encyclopedia', priority: '0.85', changefreq: 'monthly' }
];

// 2. Extract dynamic prophets
function extractProphetIds() {
  const parts = ['prophetsPart1.ts', 'prophetsPart2.ts', 'prophetsPart3.ts'];
  const ids = [];
  for (const part of parts) {
    const file = fs.readFileSync(path.join('src', 'data', part), 'utf8');
    const regex = /id:\s*['"]([a-zA-Z0-9_-]+)['"]/g;
    let match;
    while ((match = regex.exec(file)) !== null) {
      if (!ids.includes(match[1])) {
        ids.push(match[1]);
      }
    }
  }
  return ids;
}

// 3. Extract dynamic companions
function extractCompanionIds() {
  const file = fs.readFileSync(path.join('src', 'data', 'companionsData.ts'), 'utf8');
  // Match inside COMPANIONS_DATA
  const dataBlock = file.split('COMPANIONS_DATA')[1] || '';
  const regex = /id:\s*['"]([a-zA-Z0-9_-]+)['"]/g;
  const ids = [];
  let match;
  while ((match = regex.exec(dataBlock)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
  return ids;
}

// 4. Extract dynamic academy tracks
function extractAcademyTrackIds() {
  const file = fs.readFileSync(path.join('src', 'data', 'academyData.ts'), 'utf8');
  const dataBlock = file.split('ACADEMY_TRACKS')[1] || '';
  const regex = /id:\s*['"]([a-zA-Z0-9_-]+)['"],\s*order:/g;
  const ids = [];
  let match;
  while ((match = regex.exec(dataBlock)) !== null) {
    if (!ids.includes(match[1])) {
      ids.push(match[1]);
    }
  }
  return ids;
}

const entries = [];

// Add static routes
for (const r of staticRoutes) {
  entries.push({
    loc: `${BASE_URL}${r.path}`,
    lastmod: TODAY,
    changefreq: r.changefreq,
    priority: r.priority
  });
}

// Add 114 Surahs for Quran reader and Tafsir
for (let i = 1; i <= 114; i++) {
  entries.push({
    loc: `${BASE_URL}/quran?surah=${i}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.8'
  });
  entries.push({
    loc: `${BASE_URL}/tafsir?surah=${i}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: '0.8'
  });
}

// Add Prophets
const prophetIds = extractProphetIds();
for (const id of prophetIds) {
  entries.push({
    loc: `${BASE_URL}/prophets/${id}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.75'
  });
}

// Add Companions
const companionIds = extractCompanionIds();
for (const id of companionIds) {
  entries.push({
    loc: `${BASE_URL}/companions/${id}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.75'
  });
}

// Add Academy tracks
const trackIds = extractAcademyTrackIds();
for (const id of trackIds) {
  entries.push({
    loc: `${BASE_URL}/academy/${id}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: '0.75'
  });
}

const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.map(e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xmlContent.trim() + '\n', 'utf8');
console.log(`Generated public/sitemap.xml with ${entries.length} URLs successfully!`);
console.log(`- Static pages: ${staticRoutes.length}`);
console.log(`- Quran & Tafsir surahs: 228`);
console.log(`- Prophets: ${prophetIds.length}`);
console.log(`- Companions: ${companionIds.length}`);
console.log(`- Academy tracks: ${trackIds.length}`);
