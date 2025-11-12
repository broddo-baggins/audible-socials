import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Pages
import Home from './pages/Home';
import Library from './pages/Library';
import Discover from './pages/Discover';
import MyBookClubs from './pages/MyBookClubs';
import ClubDetailPage from './pages/ClubDetailPage';
import BookDetailPage from './pages/BookDetailPage';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-audible-cream">
        <Header />
        
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/clubs" element={<MyBookClubs />} />
            <Route path="/clubs/friends" element={<MyBookClubs />} />
            <Route path="/clubs/activity" element={<MyBookClubs />} />
            <Route path="/club/:clubId" element={<ClubDetailPage />} />
            <Route path="/book/:bookId" element={<BookDetailPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
