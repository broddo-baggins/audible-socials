import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, Calendar, Crown, Heart, MessageCircle } from 'lucide-react';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import clubsData from '../../data/clubs.json';
import { getFriends } from '../../utils/localStorage';

export default function ActivityTab() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    generateActivities();
    // Slower refresh - every 60 seconds instead of real-time
    const interval = setInterval(generateActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const generateActivities = () => {
    const friendIds = getFriends();
    const friends = usersData.filter(u => friendIds.includes(u.id));
    
    const activityList = [];

    // FRIENDS ONLY - No trending or public activities
    friends.forEach((friend) => {
      // Currently reading
      if (friend.currentlyReading) {
        const book = booksData.find(b => b.id === friend.currentlyReading);
        if (book) {
          activityList.push({
            id: `reading-${friend.id}`,
            type: 'reading',
            user: friend,
            book: book,
            timestamp: Date.now() - Math.random() * 86400000 * 3 // Last 3 days
          });
        }
      }

      // Recent ratings
      Object.entries(friend.ratings).slice(0, 2).forEach(([bookId, rating]) => {
        const book = booksData.find(b => b.id === bookId);
        if (book) {
          activityList.push({
            id: `rating-${friend.id}-${bookId}`,
            type: 'rating',
            user: friend,
            book: book,
            rating: rating,
            timestamp: Date.now() - Math.random() * 86400000 * 7 // Last 7 days
          });
        }
      });

      // Club joins
      friend.joinedClubs.slice(0, 1).forEach((clubId) => {
        const club = clubsData.find(c => c.id === clubId);
        if (club) {
          const clubBook = booksData.find(b => b.id === club.currentBook);
          activityList.push({
            id: `club-${friend.id}-${clubId}`,
            type: 'club_join',
            user: friend,
            club: club,
            book: clubBook,
            timestamp: Date.now() - Math.random() * 86400000 * 14 // Last 14 days
          });
        }
      });
    });

    // Sort by timestamp (most recent first)
    activityList.sort((a, b) => b.timestamp - a.timestamp);

    setActivities(activityList.slice(0, 25)); // Show more activities
  };

  const getTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor(diff / 3600000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const renderActivity = (activity) => {
    switch (activity.type) {
      case 'reading':
        return (
          <div key={activity.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-5 border border-gray-100">
            <div className="flex items-start space-x-4">
              {/* Book Cover */}
              <Link to={`/book/${activity.book.id}`} className="flex-shrink-0">
                <img
                  src={activity.book.cover}
                  alt={activity.book.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                />
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {activity.user.isPremium && (
                        <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{activity.user.name}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                  <BookOpen className="w-5 h-5 text-green-500" />
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="text-green-600 font-semibold">Currently listening to</span>
                </p>

                <Link to={`/book/${activity.book.id}`} className="group">
                  <h4 className="font-bold text-gray-900 group-hover:text-audible-orange transition-colors mb-1">
                    {activity.book.title}
                  </h4>
                  <p className="text-sm text-gray-600">by {activity.book.author}</p>
                </Link>
              </div>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div key={activity.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-5 border border-gray-100">
            <div className="flex items-start space-x-4">
              {/* Book Cover */}
              <Link to={`/book/${activity.book.id}`} className="flex-shrink-0">
                <img
                  src={activity.book.cover}
                  alt={activity.book.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                />
              </Link>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {activity.user.isPremium && (
                        <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{activity.user.name}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{activity.rating}/5</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="text-orange-600 font-semibold">Rated this audiobook</span>
                </p>

                <Link to={`/book/${activity.book.id}`} className="group">
                  <h4 className="font-bold text-gray-900 group-hover:text-audible-orange transition-colors mb-1">
                    {activity.book.title}
                  </h4>
                  <p className="text-sm text-gray-600">by {activity.book.author}</p>
                </Link>
              </div>
            </div>
          </div>
        );

      case 'club_join':
        return (
          <div key={activity.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-5 border border-gray-100">
            <div className="flex items-start space-x-4">
              {/* Book Cover - Club's current book */}
              {activity.book && (
                <Link to={`/book/${activity.book.id}`} className="flex-shrink-0">
                  <img
                    src={activity.book.cover}
                    alt={activity.book.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-md hover:scale-105 transition-transform"
                  />
                </Link>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {activity.user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {activity.user.isPremium && (
                        <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{activity.user.name}</p>
                      <p className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="text-purple-600 font-semibold">Joined a book club</span>
                </p>

                <Link to={`/club/${activity.club.id}`} className="group">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                    {activity.club.name}
                  </h4>
                  <p className="text-sm text-gray-600">Hosted by {activity.club.host}</p>
                  {activity.book && (
                    <p className="text-xs text-gray-500 mt-1">Currently reading: {activity.book.title}</p>
                  )}
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Friends Activity Feed</h2>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <Users className="w-5 h-5 inline mr-2" />
            <span className="font-semibold">Friends Only</span>
          </div>
        </div>
        <p className="text-white/90 text-lg">
          See what your friends are reading, which audiobooks they're rating, and which book clubs they've joined. 
          Get inspired by their choices and discover your next great listen!
        </p>
      </div>

      {/* Activity Feed */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Users className="w-20 h-20 mx-auto text-gray-400 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            No Friend Activity Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Connect with friends to see their reading journey, book ratings, and club memberships right here.
          </p>
          <Link
            to="/clubs/friends"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all transform hover:scale-105"
          >
            <Users className="w-5 h-5" />
            <span>Find Friends</span>
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">
              <span className="font-bold text-gray-900">{activities.length}</span> recent activities from your friends
            </p>
            <p className="text-xs text-gray-500">Updates every 60 seconds</p>
          </div>
          <div className="space-y-4">
            {activities.map(activity => renderActivity(activity))}
          </div>
        </div>
      )}
    </div>
  );
}

