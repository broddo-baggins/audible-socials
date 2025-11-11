import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, Calendar, Crown } from 'lucide-react';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import clubsData from '../../data/clubs.json';
import { getFriends } from '../../utils/localStorage';

export default function ActivityTab() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    generateActivities();
  }, []);

  const generateActivities = () => {
    const friendIds = getFriends();
    const friends = usersData.filter(u => friendIds.includes(u.id));
    
    const activityList = [];

    // Generate friend reading activities
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
      friend.joinedClubs.forEach((clubId) => {
        const club = clubsData.find(c => c.id === clubId);
        if (club) {
          activityList.push({
            id: `club-${friend.id}-${clubId}`,
            type: 'club_join',
            user: friend,
            club: club,
            timestamp: Date.now() - Math.random() * 86400000 * 14 // Last 14 days
          });
        }
      });
    });

    // Sort by timestamp (most recent first)
    activityList.sort((a, b) => b.timestamp - a.timestamp);

    setActivities(activityList.slice(0, 20)); // Limit to 20 activities
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
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              {activity.user.isPremium && (
                <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{activity.user.name}</span>
                {' is currently reading '}
                <Link to={`/book/${activity.book.id}`} className="text-audible-orange hover:underline font-semibold">
                  {activity.book.title}
                </Link>
              </p>
              <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        );

      case 'rating':
        return (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              {activity.user.isPremium && (
                <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{activity.user.name}</span>
                {' rated '}
                <Link to={`/book/${activity.book.id}`} className="text-audible-orange hover:underline font-semibold">
                  {activity.book.title}
                </Link>
                <span className="ml-2 inline-flex items-center">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-bold">{activity.rating}/5</span>
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        );

      case 'club_join':
        return (
          <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              {activity.user.isPremium && (
                <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{activity.user.name}</span>
                {' joined the '}
                <Link to={`/club/${activity.club.id}`} className="text-purple-600 hover:underline font-semibold">
                  {activity.club.name}
                </Link>
                {' book club'}
              </p>
              <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.timestamp)}</p>
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
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Activity Feed</h2>
        <p className="text-white/90">
          See what your friends are reading, which books they're rating, and which book clubs they've joined. 
          Get inspired by their choices and discover your next great listen!
        </p>
      </div>

      {/* Activity Feed */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No activity yet
          </h3>
          <p className="text-gray-600 mb-6">
            Add friends to see their reading activity
          </p>
          <Link
            to="/clubs/friends"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Find Friends
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => renderActivity(activity))}
        </div>
      )}
    </div>
  );
}

