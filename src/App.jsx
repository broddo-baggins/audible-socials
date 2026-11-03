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
import { AnimatePresence, MotionConfig, motion as Motion } from 'framer-motion';
import { lazy, Suspense } from 'react';

import { PlayerProvider } from './contexts/PlayerContext';
import { pageVariants, pageTransition } from './utils/animationVariants';

// Layout Components - one responsive header and the mobile bottom nav (not lazy loaded - needed immediately)
import DesktopHeader from './components/layout/DesktopHeader';
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
const Discover = lazy(() => import('./pages/Discover'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
// Loading fallback: the shape of a page (header block and a shelf), not a spinner
const PageLoader = () => (
  <div className="page py-12" role="status" aria-label="Loading page">
    <div className="shimmer h-10 w-72 max-w-full rounded-sm" />
    <div className="shimmer mt-4 h-5 w-96 max-w-full rounded-sm" />
    <div className="mt-10 flex gap-5 overflow-hidden">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="w-36 md:w-40 shrink-0">
          <div className="shimmer aspect-book rounded-sm" />
          <div className="shimmer mt-3 h-4 rounded-sm" />
          <div className="shimmer mt-2 h-4 w-1/2 rounded-sm" />
        </div>
      ))}
    </div>
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
      <Motion.main
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        id="main"
        tabIndex={-1}
        className="flex-1 pb-24 md:pb-8 focus:outline-none"
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
            <Route path="/discover" element={<Discover />} />

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

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Motion.main>
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
 * - Every width: Header + Main Content + Audio Player
 * - 768 px and up: Footer
 * - Below 768 px: Bottom Nav (the header's menu holds every other destination)
 */
function App() {
  return (
    <MotionConfig reducedMotion="user">
    <PlayerProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-paper">
          {/* One responsive header for every width */}
          <DesktopHeader />

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
    </MotionConfig>
  );
}

export default App;
