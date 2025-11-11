import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Zap, Clock, Gauge } from 'lucide-react';
import { getFriends } from '../../utils/localStorage';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';

export default function SocialNudges() {
  const [nudges, setNudges] = useState([]);

  useEffect(() => {
    generateNudges();
  }, []);

  const generateNudges = () => {
    const friendIds = getFriends();
    const friends = usersData.filter(u => friendIds.includes(u.id));
    const nudgesList = [];

    friends.forEach(friend => {
      if (friend.currentlyReading && friend.privacySettings?.shareProgress) {
        const book = booksData.find(b => b.id === friend.currentlyReading);
        if (book) {
          nudgesList.push({
            type: 'currently_listening',
            friend,
            book,
            progress: friend.currentProgress || 0,
            speed: friend.listeningSpeed || 1.0
          });
        }
      }
    });

    const bookCounts = {};
    friends.forEach(friend => {
      if (friend.currentlyReading) {
        bookCounts[friend.currentlyReading] = (bookCounts[friend.currentlyReading] || 0) + 1;
      }
    });

    Object.entries(bookCounts).forEach(([bookId, count]) => {
      if (count >= 2) {
        const book = booksData.find(b => b.id === bookId);
        const listeningFriends = friends.filter(f => f.currentlyReading === bookId);
        if (book) {
          nudgesList.push({
            type: 'trending',
            book,
            count,
            friends: listeningFriends
          });
        }
      }
    });

    setNudges(nudgesList.slice(0, 5));
  };

  const renderNudge = (nudge) => {
    switch (nudge.type) {
      case 'currently_listening':
        return (
          <Link
            key={`listening-${nudge.friend.id}-${nudge.book.id}`}
            to={`/book/${nudge.book.id}`}
            className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{nudge.friend.name}</span>
                  {' is currently listening to '}
                  <span className="font-semibold text-audible-orange">{nudge.book.title}</span>
                </p>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{nudge.progress}% complete</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-3 h-3" />
                    <span>{nudge.speed}x speed</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );

      case 'trending':
        return (
          <Link
            key={`trending-${nudge.book.id}`}
            to={`/book/${nudge.book.id}`}
            className="block bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-orange-200"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-bold text-orange-600 uppercase">Trending</span>
                </div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{nudge.count} of your friends</span>
                  {' are listening to '}
                  <span className="font-semibold text-audible-orange">{nudge.book.title}</span>
                </p>
                <div className="mt-2 flex items-center space-x-1">
                  {nudge.friends.slice(0, 3).map((friend) => (
                    <div
                      key={friend.id}
                      className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full"
                    >
                      {friend.name.split(' ')[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        );

      default:
        return null;
    }
  };

  if (nudges.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
        <Users className="w-5 h-5 text-purple-600" />
        <span>What Friends Are Listening To</span>
      </h3>
      {nudges.map(nudge => renderNudge(nudge))}
    </div>
  );
}

