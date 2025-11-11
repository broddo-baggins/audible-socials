import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Crown, TrendingUp } from 'lucide-react';
import clubsData from '../../data/clubs.json';
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {joinedClubs.map((club) => (
              <Link
                key={club.id}
                to={`/club/${club.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-purple-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                      {club.isPremium && (
                        <span className="bg-audible-gold text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Hosted by {club.host}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{club.description}</p>

                <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="font-semibold text-purple-600">{club.daysRemaining} days</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{club.memberCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {club.events && club.events.length > 0 && (
                  <div className="mt-4 bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-purple-900 mb-1">
                      Next Event: {club.events[0].title}
                    </p>
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
              </Link>
            ))}
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
            {featuredClubs.map((club) => (
              <Link
                key={club.id}
                to={`/club/${club.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-purple-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">{club.name}</h3>
                  {club.isPremium && (
                    <span className="bg-audible-gold text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center ml-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 mb-3">Hosted by {club.host}</p>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{club.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-3">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{club.memberCount.toLocaleString()}</span>
                  </div>
                  <span className="text-xs">{club.meetingsPerMonth} meetings/mo</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

