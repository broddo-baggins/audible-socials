import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import BookClubsTab from '../components/clubs/BookClubsTab';
import FriendsTab from '../components/clubs/FriendsTab';
import ActivityTab from '../components/clubs/ActivityTab';

const deriveActiveTab = (pathname) => {
  if (pathname === '/clubs/friends') return 'friends';
  if (pathname === '/clubs/activity') return 'activity';
  return 'clubs';
};

export default function MyBookClubs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => deriveActiveTab(location.pathname));

  useEffect(() => {
    setActiveTab(deriveActiveTab(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'clubs') navigate('/clubs');
    else if (tab === 'friends') navigate('/clubs/friends');
    else if (tab === 'activity') navigate('/clubs/activity');
  };

  return (
    <div className="min-h-screen bg-audible-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-3 font-serif text-white">
            My Book Clubs
          </h1>
          <p className="text-xl text-white/90">
            Connect, read, and share with fellow audiobook lovers
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200 shadow-sm sticky top-0 md:top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabChange('clubs')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'clubs'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Book Clubs
            </button>
            <button
              onClick={() => handleTabChange('friends')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'friends'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Friends
            </button>
            <button
              onClick={() => handleTabChange('activity')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'activity'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity
            </button>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <Motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {activeTab === 'clubs' && <BookClubsTab />}
        {activeTab === 'friends' && <FriendsTab />}
        {activeTab === 'activity' && <ActivityTab />}
      </Motion.div>
    </div>
  );
}
