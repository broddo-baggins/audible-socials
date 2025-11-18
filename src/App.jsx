import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerContext';
import DesktopHeader from './components/layout/DesktopHeader';
import TabletHeader from './components/layout/TabletHeader';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Footer from './components/layout/Footer';
import AudioPlayer from './components/player/AudioPlayer';
import MiniPlayer from './components/player/MiniPlayer';
import ScrollToTop from './components/shared/ScrollToTop';

// Pages
import Home from './pages/Home';
import Library from './pages/Library';
import Browse from './pages/Browse';
import BookDetail from './pages/BookDetail';
import Search from './pages/Search';
import Account from './pages/Account';
import Social from './pages/Social';
import MyBookClubs from './pages/MyBookClubs';
import ClubDetailPage from './pages/ClubDetailPage';
import Profile from './pages/Profile';
import FriendLibrary from './pages/FriendLibrary';

// Company Pages
import About from './pages/About';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Blog from './pages/Blog';

// Help Pages
import Support from './pages/Support';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Accessibility from './pages/Accessibility';

// Legal Pages
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import ContentPolicy from './pages/ContentPolicy';

// App Pages
import IOSApp from './pages/IOSApp';
import AndroidApp from './pages/AndroidApp';
import DesktopApp from './pages/DesktopApp';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-audible-white">
          {/* Desktop Header - hidden on mobile and tablet */}
          <div className="hidden lg:block">
            <DesktopHeader />
          </div>

          {/* Tablet Header - shown only on tablet */}
          <TabletHeader />
          
          {/* Main Content */}
          <main className="flex-1 pb-20 tablet:pb-16 lg:pb-0">
            <Routes>
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
          </main>
          
          {/* Audio Player Components */}
          <AudioPlayer />
          <MiniPlayer />

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
          
          {/* Footer - hidden on mobile */}
          <div className="hidden md:block">
            <Footer />
          </div>
          
          {/* Scroll to Top Button */}
          <ScrollToTop />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
