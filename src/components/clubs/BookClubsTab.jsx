import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Crown, TrendingUp, Gift, Zap } from 'lucide-react';
import clubsData from '../../data/clubs.json';
import booksData from '../../data/books.json';
import { getUserData, getJoinedClubs } from '../../utils/localStorage';

export default function BookClubsTab() {
  const [userData, setUserData] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);

  useEffect(() => {
    const user = getUserData();
    setUserData(user);

    // Get joined clubs
    const clubIds = getJoinedClubs();
    const joined = clubsData.filter(club => clubIds.includes(club.id));
    setJoinedClubs(joined);

    // Get featured clubs (exclude joined ones)
    const featured = clubsData
      .filter(club => !clubIds.includes(club.id))
      .filter(club => !club.isPremium || user.isPremium) // Filter premium clubs if user is not premium
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 6);
    setFeaturedClubs(featured);
  }, []);

  const maxClubs = userData?.isPremium ? 3 : 2;

  return (
    <div className="space-y-8">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Welcome to Book Clubs!</h2>
        <p className="mb-4 text-white/90">
          Join curated book clubs hosted by authors, celebrities, and themed communities. 
          Connect with fellow listeners, attend exclusive events, and never wonder what to read next.
        </p>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Discover books curated by experts and influencers</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Attend live author Q&As and virtual events</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Get 2-for-1 discounts on featured books</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Earn badges and streaks for participation</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Share your reading journey with friends</span>
          </li>
        </ul>
        <p className="text-sm text-white/80">
          You can join up to {maxClubs} clubs at a time{!userData?.isPremium && ' (upgrade to Premium for 3)'}.
        </p>
      </div>

      {/* Joined Clubs */}
      {joinedClubs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Joined Clubs</h2>
            <span className="text-sm text-gray-600">
              {joinedClubs.length} of {maxClubs} clubs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedClubs.map((club) => {
              const currentBook = booksData.find(b => b.id === club.currentBook);
              
              return (
                <Link
                  key={club.id}
                  to={`/club/${club.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-purple-200 hover:border-purple-400 group"
                >
                  {/* Book Cover Header */}
                  {currentBook && (
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
                      <img
                        src={currentBook.cover}
                        alt={currentBook.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      {club.isPremium && (
                        <div className="absolute top-3 right-3 bg-audible-gold text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center shadow-lg">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white text-sm font-semibold mb-1">Currently Reading:</p>
                        <p className="text-white font-bold text-lg line-clamp-1">{currentBook.title}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Club Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {club.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {club.host.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Hosted by</p>
                          <p className="text-sm font-semibold text-gray-900">{club.host}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-3 mb-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-1 text-purple-500" />
                        <span className="font-semibold">{club.daysRemaining} days left</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1 text-purple-500" />
                        <span className="font-semibold">{club.memberCount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Club Perks Highlight */}
                    {club.perks && club.perks.length > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-3 border border-orange-200 mb-3">
                        <p className="text-xs font-semibold text-orange-900 mb-1 flex items-center">
                          <Gift className="w-3 h-3 mr-1" />
                          Member Perks
                        </p>
                        <p className="text-xs text-orange-800 line-clamp-2">
                          {club.perks[0]}
                        </p>
                      </div>
                    )}

                    {/* Next Event */}
                    {club.events && club.events.length > 0 && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                        <p className="text-xs font-semibold text-purple-900 mb-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Next Event
                        </p>
                        <p className="text-sm font-bold text-purple-900 mb-1">{club.events[0].title}</p>
                        <p className="text-xs text-purple-700">
                          {new Date(club.events[0].date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Featured Clubs */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="w-7 h-7 mr-2 text-purple-600" />
            Featured Book Clubs
          </h2>
        </div>

        {featuredClubs.length === 0 && joinedClubs.length >= maxClubs ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              You've reached your club limit
            </h3>
            <p className="text-gray-600 mb-6">
              You're currently in {maxClubs} clubs. Leave a club to join a new one.
            </p>
            {!userData?.isPremium && (
              <Link
                to="/profile"
                className="inline-block bg-audible-gold text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition-colors"
              >
                Upgrade to Premium for 3 Clubs
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredClubs.map((club) => {
              const currentBook = booksData.find(b => b.id === club.currentBook);
              
              return (
                <Link
                  key={club.id}
                  to={`/club/${club.id}`}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-200 hover:border-purple-500 group"
                >
                  {/* Book Cover Header */}
                  {currentBook && (
                    <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        src={currentBook.cover}
                        alt={currentBook.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {club.isPremium && (
                        <div className="absolute top-3 right-3 bg-audible-gold text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center shadow-lg">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white/90 text-xs font-semibold mb-1">Currently Reading:</p>
                        <p className="text-white font-bold line-clamp-1">{currentBook.title}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Club Info */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {club.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">
                            {club.host.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">Hosted by</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{club.host}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{club.description}</p>

                    {/* Perks Highlight */}
                    {club.perks && club.perks.length > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-2 mb-3 border border-orange-200">
                        <p className="text-xs text-orange-900 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-orange-600" />
                          <span className="font-semibold">{club.perks[0]}</span>
                        </p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-200 pt-3">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-purple-500" />
                        <span className="font-semibold">{club.memberCount.toLocaleString()}</span>
                      </div>
                      <span className="text-purple-600 font-semibold">{club.meetingsPerMonth} meetings/mo</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

