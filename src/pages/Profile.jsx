import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Crown, CreditCard, Users, BookOpen, Settings, LogOut, Trophy, TrendingUp } from 'lucide-react';
import { getUserData, getJoinedClubs, getFriends } from '../utils/localStorage';
import clubsData from '../data/clubs.json';
import usersData from '../data/users.json';
import PrivacySettings from '../components/settings/PrivacySettings';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import ListeningStats from '../components/stats/ListeningStats';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const user = getUserData();
    setUserData(user);

    // Get joined clubs
    const clubIds = getJoinedClubs();
    const clubs = clubsData.filter(club => clubIds.includes(club.id));
    setJoinedClubs(clubs);

    // Get friends
    const friendIds = getFriends();
    const friendsList = usersData.filter(u => friendIds.includes(u.id));
    setFriends(friendsList);
  }, []);

  if (!userData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const maxClubs = userData.isPremium ? 3 : 2;

  return (
    <div className="min-h-screen bg-audible-cream">
      {/* Profile Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-audible-orange to-audible-orange-dark rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              {userData.isPremium && (
                <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-1.5">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                {userData.isPremium && (
                  <span className="bg-audible-gold text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{userData.library.length} books</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{friends.length} friends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{joinedClubs.length} clubs</span>
                </div>
              </div>

              {/* Credits */}
              <div className="bg-gray-100 rounded-lg px-4 py-3 inline-flex items-center space-x-3 border border-gray-200">
                <CreditCard className="w-5 h-5 text-audible-orange" />
                <div>
                  <p className="text-sm text-gray-600">Available Credits</p>
                  <p className="text-2xl font-bold text-audible-orange">{userData.credits}</p>
                </div>
              </div>
            </div>

            {/* Settings Button */}
            <button className="p-2 text-gray-600 hover:text-audible-orange transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 border-b-2 font-semibold transition-colors flex items-center space-x-2 ${
                activeTab === 'stats'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Stats</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`py-4 border-b-2 font-semibold transition-colors flex items-center space-x-2 ${
                activeTab === 'badges'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Badges</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 border-b-2 font-semibold transition-colors flex items-center space-x-2 ${
                activeTab === 'settings'
                  ? 'border-audible-orange text-audible-orange'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
        {/* Membership Section */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Membership</h2>
          
          {userData.isPremium ? (
            <div className="bg-gradient-to-r from-audible-gold to-yellow-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="w-6 h-6" />
                    <h3 className="text-xl font-bold">Premium Member</h3>
                  </div>
                  <p className="text-white/90">
                    Unlimited access to premium book clubs and exclusive content
                  </p>
                </div>
                <button className="bg-white text-audible-gold px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-gray-600 mb-4">
                Get access to premium book clubs, exclusive events, and more credits
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-700">
                  <Crown className="w-4 h-4 mr-2 text-audible-gold" />
                  Join up to 3 book clubs (vs 2)
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Crown className="w-4 h-4 mr-2 text-audible-gold" />
                  Access to premium-only clubs
                </li>
                <li className="flex items-center text-sm text-gray-700">
                  <Crown className="w-4 h-4 mr-2 text-audible-gold" />
                  Exclusive author events
                </li>
              </ul>
              <button className="bg-audible-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors">
                Upgrade Now
              </button>
            </div>
          )}
        </section>

        {/* Book Clubs Section */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Book Clubs</h2>
            <Link
              to="/clubs"
              className="text-audible-orange font-semibold hover:text-audible-orange-light transition-colors text-sm"
            >
              View All
            </Link>
          </div>

          {joinedClubs.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">You haven't joined any book clubs yet</p>
              <Link
                to="/clubs"
                className="inline-block bg-audible-orange text-white px-6 py-2 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors"
              >
                Explore Clubs
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {joinedClubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/club/${club.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-audible-orange hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-600">Hosted by {club.host}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-audible-orange font-semibold">
                        {club.daysRemaining} days left
                      </p>
                      <p className="text-gray-500">{club.memberCount.toLocaleString()} members</p>
                    </div>
                  </div>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  You're in {joinedClubs.length} of {maxClubs} clubs
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Friends Section */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Friends</h2>
            <Link
              to="/clubs/friends"
              className="text-audible-orange font-semibold hover:text-audible-orange-light transition-colors text-sm"
            >
              View All
            </Link>
          </div>

          {friends.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">Connect with friends to share your reading journey</p>
              <Link
                to="/clubs/friends"
                className="inline-block bg-audible-orange text-white px-6 py-2 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors"
              >
                Find Friends
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {friends.slice(0, 6).map((friend) => (
                <div
                  key={friend.id}
                  className="text-center p-3 border border-gray-200 rounded-lg hover:border-audible-orange transition-colors"
                >
                  <div className="relative inline-block mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-audible-orange to-audible-orange-dark rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    {friend.isPremium && (
                      <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{friend.name}</p>
                  <p className="text-xs text-gray-600">{friend.library.length} books</p>
                </div>
              ))}
            </div>
          )}
        </section>

          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <ListeningStats />
          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <BadgeDisplay />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <PrivacySettings />
            
            <button className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-red-500 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

