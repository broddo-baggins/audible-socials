import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerContext';
import DesktopHeader from './components/layout/DesktopHeader';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Footer from './components/layout/Footer';
import AudioPlayer from './components/player/AudioPlayer';
import MiniPlayer from './components/player/MiniPlayer';

// Pages
import Home from './pages/Home';
import Library from './pages/Library';
import Browse from './pages/Browse';
import BookDetail from './pages/BookDetail';
import Search from './pages/Search';
import Account from './pages/Account';
import MyBookClubs from './pages/MyBookClubs';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-audible-white">
          {/* Desktop Header - hidden on mobile */}
          <div className="hidden md:block">
            <DesktopHeader />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 pb-20 md:pb-0">
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
              <Route path="/clubs" element={<MyBookClubs />} />
              <Route path="/clubs/friends" element={<MyBookClubs />} />
              <Route path="/clubs/activity" element={<MyBookClubs />} />
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
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
