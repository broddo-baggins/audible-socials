/**
 * Listenable Socials - Main Application Component
 *
 * This component serves as the root of the Listenable Socials application. It provides:
 * - React Router for client-side navigation
 * - Player context for audio playback state management
 * - Responsive layout components (desktop/tablet/mobile headers, navigation)
 * - Audio player components
 * - Page transition animations using Framer Motion
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';

import { PlayerProvider } from './contexts/PlayerContext';
import { pageVariants, pageTransition } from './utils/animationVariants';

// Layout Components - Responsive headers and navigation (not lazy loaded - needed immediately)
import DesktopHeader from './components/layout/DesktopHeader';
import TabletHeader from './components/layout/TabletHeader';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Footer from './components/layout/Footer';

// Audio Player Components (not lazy loaded - needed immediately)
import AudioPlayer from './components/player/AudioPlayer';
import MiniPlayer from './components/player/MiniPlayer';

// Shared Utilities
import ScrollToTop from './components/shared/ScrollToTop';

// AI Assistant
import AIAssistant from './components/ai/AIAssistant';

// Home page - not lazy loaded for immediate access
import Home from './pages/Home';

// Lazy-loaded Pages - loaded on demand for better performance
const Library = lazy(() => import('./pages/Library'));
const Browse = lazy(() => import('./pages/Browse'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const Search = lazy(() => import('./pages/Search'));
const Account = lazy(() => import('./pages/Account'));
const Social = lazy(() => import('./pages/Social'));
const IdleGamePage = lazy(() => import('./pages/IdleGamePage'));
const MyBookClubs = lazy(() => import('./pages/MyBookClubs'));
const ClubDetailPage = lazy(() => import('./pages/ClubDetailPage'));
const Battles = lazy(() => import('./pages/Battles'));
const Profile = lazy(() => import('./pages/Profile'));
const FriendLibrary = lazy(() => import('./pages/FriendLibrary'));

// Company Pages - lazy loaded
const About = lazy(() => import('./pages/About'));
const Careers = lazy(() => import('./pages/Careers'));
const Press = lazy(() => import('./pages/Press'));
const Blog = lazy(() => import('./pages/Blog'));

// Help Pages - lazy loaded
const Support = lazy(() => import('./pages/Support'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Accessibility = lazy(() => import('./pages/Accessibility'));

// Legal Pages - lazy loaded
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Cookies = lazy(() => import('./pages/Cookies'));
const ContentPolicy = lazy(() => import('./pages/ContentPolicy'));

// App Pages - lazy loaded
const IOSApp = lazy(() => import('./pages/IOSApp'));
const AndroidApp = lazy(() => import('./pages/AndroidApp'));
const DesktopApp = lazy(() => import('./pages/DesktopApp'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);


/**
 * AnimatedRoutes Component
 *
 * Handles page transitions using Framer Motion. Each route change triggers
 * a smooth animation between pages. The component uses AnimatePresence
 * with mode="wait" to ensure exit animations complete before new page enters.
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-1 pb-20 tablet:pb-16 lg:pb-0"
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/originals" element={<Browse />} />
            <Route path="/podcasts" element={<Browse />} />
            <Route path="/book/:bookId" element={<BookDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/account" element={<Account />} />
            <Route path="/settings" element={<Account />} />
            <Route path="/help" element={<Account />} />
            <Route path="/notifications" element={<Account />} />
            <Route path="/social" element={<Social />} />
            <Route path="/idle" element={<IdleGamePage />} />
            <Route path="/battles" element={<Battles />} />
            <Route path="/clubs" element={<MyBookClubs />} />
            <Route path="/clubs/friends" element={<MyBookClubs />} />
            <Route path="/clubs/activity" element={<MyBookClubs />} />
            <Route path="/club/:clubId" element={<ClubDetailPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friend/:friendId/library" element={<FriendLibrary />} />

            {/* Company Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/press" element={<Press />} />
            <Route path="/blog" element={<Blog />} />

            {/* Help Pages */}
            <Route path="/support" element={<Support />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/accessibility" element={<Accessibility />} />

            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/content-policy" element={<ContentPolicy />} />

            {/* App Pages */}
            <Route path="/apps/ios" element={<IOSApp />} />
            <Route path="/apps/android" element={<AndroidApp />} />
            <Route path="/apps/desktop" element={<DesktopApp />} />
          </Routes>
        </Suspense>
      </motion.main>
    </AnimatePresence>
  );
};

/**
 * App Component - Main Application Layout
 *
 * The root component that provides the overall application structure:
 * - PlayerProvider: Context for audio playback state management
 * - Router: Client-side routing with React Router
 * - Responsive layout: Different headers/navigation for desktop/tablet/mobile
 * - Audio player: Full and mini player components
 * - Page transitions: Smooth animations between routes
 *
 * Layout Structure:
 * - Desktop: Header + Main Content + Footer + Audio Player
 * - Tablet: Header + Main Content + Audio Player
 * - Mobile: Main Content + Bottom Nav + Audio Player
 */
function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-audible-white">
          {/* Desktop Header - visible only on large screens */}
          <div className="hidden lg:block">
            <DesktopHeader />
          </div>

          {/* Tablet Header - shown on tablet and desktop */}
          <TabletHeader />

          {/* Main Content with Page Transitions */}
          <AnimatedRoutes />

          {/* Audio Player Components - available on all devices */}
          <AudioPlayer />
          <MiniPlayer />

          {/* Mobile Bottom Navigation - visible on mobile/tablet */}
          <MobileBottomNav />

          {/* Footer - hidden on mobile devices */}
          <div className="hidden md:block">
            <Footer />
          </div>

          {/* Scroll to Top Utility */}
          <ScrollToTop />

          {/* AI Assistant - Floating AI helper */}
          <AIAssistant />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
