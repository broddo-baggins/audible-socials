import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Users, Star, TrendingUp } from 'lucide-react';
import { getFriends, getUserData } from '../../utils/localStorage';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';

export default function FriendRecommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = () => {
    const friendIds = getFriends();
    const friends = usersData.filter(u => friendIds.includes(u.id));
    const user = getUserData();
    
    const recommendedBooks = new Map();

    friends.forEach(friend => {
      if (!friend.privacySettings?.shareRatings) return;

      Object.entries(friend.ratings).forEach(([bookId, rating]) => {
        if (rating >= 4 && !user.library?.includes(bookId)) {
          if (!recommendedBooks.has(bookId)) {
            recommendedBooks.set(bookId, {
              bookId,
              friends: [],
              totalRating: 0,
              ratingCount: 0
            });
          }
          const rec = recommendedBooks.get(bookId);
          rec.friends.push(friend);
          rec.totalRating += rating;
          rec.ratingCount += 1;
        }
      });
    });

    const recs = Array.from(recommendedBooks.values())
      .map(rec => {
        const book = booksData.find(b => b.id === rec.bookId);
        return {
          book,
          friends: rec.friends,
          avgFriendRating: (rec.totalRating / rec.ratingCount).toFixed(1),
          friendCount: rec.friends.length
        };
      })
      .filter(rec => rec.book)
      .sort((a, b) => b.friendCount - a.friendCount)
      .slice(0, 6);

    setRecommendations(recs);
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <ThumbsUp className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Recommended by Friends</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Books your friends loved that you haven't listened to yet
      </p>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <Link
            key={rec.book.id}
            to={`/book/${rec.book.id}`}
            className="block bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex space-x-3">
              <img
                src={rec.book.cover}
                alt={rec.book.title}
                className="w-16 h-24 object-cover rounded shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {rec.book.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  by {rec.book.author}
                </p>
                
                <div className="flex items-center space-x-3 text-xs">
                  <div className="flex items-center space-x-1 text-purple-600">
                    <Users className="w-3 h-3" />
                    <span className="font-semibold">
                      {rec.friendCount} friend{rec.friendCount > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span className="font-semibold">{rec.avgFriendRating}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center space-x-1">
                  {rec.friends.slice(0, 3).map((friend, idx) => (
                    <div
                      key={friend.id}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"
                      style={{ marginLeft: idx > 0 ? '-4px' : '0' }}
                    >
                      {friend.name.split(' ')[0]}
                    </div>
                  ))}
                  {rec.friends.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{rec.friends.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        to="/clubs/friends"
        className="mt-4 block text-center text-sm font-semibold text-purple-600 hover:text-purple-700"
      >
        See all friend recommendations
      </Link>
    </div>
  );
}

