import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Crown } from 'lucide-react';
import { getFriends } from '../../utils/localStorage';
import usersData from '../../data/users.json';

export default function FriendRatingsOnBook({ bookId }) {
  const [friendRatings, setFriendRatings] = useState([]);

  const loadFriendRatings = useCallback(() => {
    const friendIds = getFriends();
    const friends = usersData.filter(u => friendIds.includes(u.id));
    
    const ratings = friends
      .filter(friend => 
        friend.ratings[bookId] && 
        friend.privacySettings?.shareRatings
      )
      .map(friend => ({
        friend,
        rating: friend.ratings[bookId]
      }))
      .sort((a, b) => b.rating - a.rating);

    setFriendRatings(ratings);
  }, [bookId]);

  useEffect(() => {
    loadFriendRatings();
  }, [loadFriendRatings]);

  if (friendRatings.length === 0) {
    return null;
  }

  const avgRating = (
    friendRatings.reduce((sum, r) => sum + r.rating, 0) / friendRatings.length
  ).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>What Your Friends Think</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {friendRatings.length} friend{friendRatings.length > 1 ? 's' : ''} rated this book
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
          </div>
          <p className="text-xs text-gray-600">Average from friends</p>
        </div>
      </div>

      <div className="space-y-3">
        {friendRatings.map(({ friend, rating }) => (
          <Link
            key={friend.id}
            to="/clubs/friends"
            className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                {friend.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{friend.name}</p>
                <p className="text-xs text-gray-600">{friend.library.length} books</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-bold text-gray-900">{rating}</span>
              <span className="text-sm text-gray-500">/5</span>
            </div>
          </Link>
        ))}
      </div>

      {friendRatings.length > 3 && (
        <Link
          to="/clubs/friends"
          className="mt-4 block text-center text-sm font-semibold text-purple-600 hover:text-purple-700"
        >
          See all friend ratings
        </Link>
      )}
    </div>
  );
}
