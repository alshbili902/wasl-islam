import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { AudioProvider } from './context/AudioContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalAudioPlayer } from './components/layout/GlobalAudioPlayer';
import { Logo } from './components/layout/Logo';
import { HomePage } from './pages/HomePage';

// Lazy-loaded dedicated pages for optimal bundle splitting
const PrayerPage = lazy(() => import('./pages/PrayerPage').then((m) => ({ default: m.PrayerPage })));
const QuranPage = lazy(() => import('./pages/QuranPage').then((m) => ({ default: m.QuranPage })));
const RecitersPage = lazy(() => import('./pages/RecitersPage').then((m) => ({ default: m.RecitersPage })));
const KhatmahPage = lazy(() => import('./pages/KhatmahPage').then((m) => ({ default: m.KhatmahPage })));
const AdhkarPage = lazy(() => import('./pages/AdhkarPage').then((m) => ({ default: m.AdhkarPage })));
const TasbihPage = lazy(() => import('./pages/TasbihPage').then((m) => ({ default: m.TasbihPage })));
const SleepPage = lazy(() => import('./pages/SleepPage').then((m) => ({ default: m.SleepPage })));
const CharityPage = lazy(() => import('./pages/CharityPage').then((m) => ({ default: m.CharityPage })));
const DonationsPage = lazy(() => import('./pages/DonationsPage').then((m) => ({ default: m.DonationsPage })));
const ProphetsPage = lazy(() => import('./pages/ProphetsPage').then((m) => ({ default: m.ProphetsPage })));
const ChannelsPage = lazy(() => import('./pages/ChannelsPage').then((m) => ({ default: m.ChannelsPage })));
const RadioPage = lazy(() => import('./pages/RadioPage').then((m) => ({ default: m.RadioPage })));
const LivePage = lazy(() => import('./pages/LivePage').then((m) => ({ default: m.LivePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const SeerahPage = lazy(() => import('./pages/SeerahPage').then((m) => ({ default: m.SeerahPage })));
const CompanionsPage = lazy(() => import('./pages/CompanionsPage').then((m) => ({ default: m.CompanionsPage })));
const TafsirPage = lazy(() => import('./pages/TafsirPage').then((m) => ({ default: m.TafsirPage })));
const HadithPage = lazy(() => import('./pages/HadithPage').then((m) => ({ default: m.HadithPage })));
const AcademyPage = lazy(() => import('./pages/AcademyPage').then((m) => ({ default: m.AcademyPage })));
const WorshipPage = lazy(() => import('./pages/WorshipPage').then((m) => ({ default: m.WorshipPage })));
const AqeedahPage = lazy(() => import('./pages/AqeedahPage').then((m) => ({ default: m.AqeedahPage })));
const FatwasPage = lazy(() => import('./pages/FatwasPage').then((m) => ({ default: m.FatwasPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const EncyclopediaHubPage = lazy(() => import('./pages/EncyclopediaHubPage').then((m) => ({ default: m.EncyclopediaHubPage })));

const PageSkeleton: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[50vh] space-y-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl animate-pulse" />
      <Logo size="lg" className="animate-pulse relative z-10" />
    </div>
    <div className="flex items-center gap-2 text-xs font-bold text-gold/80">
      <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
      <span>جاري تحميل الصفحة المباركة...</span>
    </div>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/prayer" element={<PrayerPage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/reciters" element={<RecitersPage />} />
          <Route path="/khatmah" element={<KhatmahPage />} />
          <Route path="/adhkar" element={<AdhkarPage />} />
          <Route path="/tasbih" element={<TasbihPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/charity" element={<CharityPage />} />
          <Route path="/donations" element={<DonationsPage />} />
          <Route path="/prophets" element={<ProphetsPage />} />
          <Route path="/prophets/:prophetId" element={<ProphetsPage />} />
          <Route path="/channels" element={<ChannelsPage />} />
          <Route path="/radio" element={<RadioPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/encyclopedia" element={<EncyclopediaHubPage />} />
          <Route path="/seerah" element={<SeerahPage />} />
          <Route path="/companions" element={<CompanionsPage />} />
          <Route path="/companions/:companionId" element={<CompanionsPage />} />
          <Route path="/tafsir" element={<TafsirPage />} />
          <Route path="/hadith" element={<HadithPage />} />
          <Route path="/academy" element={<AcademyPage />} />
          <Route path="/academy/:trackId" element={<AcademyPage />} />
          <Route path="/worship" element={<WorshipPage />} />
          <Route path="/aqeedah" element={<AqeedahPage />} />
          <Route path="/fatwas" element={<FatwasPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AudioProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#F8FAF9] dark:bg-[#0B131E] text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-clip">
            <Navbar />
            <div className="flex-1 min-w-0">
              <AnimatedRoutes />
            </div>
            <Footer />
            <GlobalAudioPlayer />
          </div>
        </BrowserRouter>
      </AudioProvider>
    </AppProvider>
  );
};

export default App;
