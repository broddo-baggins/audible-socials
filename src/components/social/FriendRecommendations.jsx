import { useMemo, useState } from 'react';
import { Users, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Rating } from '../ui';
import PropTypes from 'prop-types';
import users from '../../data/users.json';
import books from '../../data/books.json';
import { getFriends } from '../../utils/localStorage';

// Stable pseudo-random number per (user, book) so ratings don't change on re-render.
const seeded = (...parts) => {
  let h = 0;
  for (const ch of parts.join(':')) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (h % 1000) / 1000;
};

const generateComment = (user, book) => {
  const comments = [
    `Amazing ${book.genre.toLowerCase()} story! Couldn't stop listening.`,
    `The narrator really brings this one to life. Highly recommend!`,
    `One of the best ${book.genre.toLowerCase()} books I've listened to this year.`,
    `Fantastic world-building and character development.`,
    `This book kept me hooked from start to finish!`,
    `Perfect for fans of ${book.genre.toLowerCase()}. You won't be disappointed.`,
    `The plot twists in this one are incredible!`,
    `Been recommending this to everyone. A must-listen!`,
  ];
  return comments[Math.floor(seeded(user.id, book.id, 'comment') * comments.length)];
};

const FriendRecommendations = ({ bookId, limit = 5 }) => {
  const [showAll, setShowAll] = useState(false);
  const [liked, setLiked] = useState({});

  const allRecommendations = useMemo(() => {
    const currentBook = books.find(b => b.id === bookId);
    if (!currentBook) return [];
    const friendIds = getFriends();

    // Friends who own or are listening to this book
    return users
      .filter(user => friendIds.includes(user.id))
      .filter(user => user.library?.includes(bookId) || user.currentlyReading === bookId)
      .map(user => ({
        ...user,
        rating: Number(user.ratings?.[bookId] ?? 4.0 + seeded(user.id, bookId, 'rating')).toFixed(1),
        likes: Math.floor(seeded(user.id, bookId, 'likes') * 20) + 5,
        comment: generateComment(user, currentBook),
        daysAgo: Math.floor(seeded(user.id, bookId, 'days') * 14) + 1,
      }));
  }, [bookId]);
  const recommendations = showAll ? allRecommendations : allRecommendations.slice(0, limit);

  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-echo-orange" />
        <h3 className="text-lg font-semibold text-echo-text-primary">
          Friends Who Love This
        </h3>
        <Badge variant="primary" size="sm">{recommendations.length}</Badge>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((friend) => (
          <div key={friend.id} className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-echo-orange to-echo-orange-light flex items-center justify-center text-white font-semibold">
                {friend.name.charAt(0)}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="min-w-0">
                  <Link 
                    to={`/friend/${friend.id}/library`}
                    className="font-medium text-echo-text-primary hover:text-echo-orange transition-colors"
                  >
                    {friend.name}
                  </Link>
                  <p className="text-xs text-echo-text-tertiary">
                    Your friend
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Rating value={parseFloat(friend.rating)} size="sm" showValue={false} />
                  <span className="text-sm font-medium text-echo-text-secondary">
                    {friend.rating}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-echo-text-secondary mb-2 line-clamp-2">
                {friend.comment}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-echo-text-tertiary">
                <span>{friend.daysAgo}d ago</span>
                <button
                  onClick={() => setLiked(prev => ({ ...prev, [friend.id]: !prev[friend.id] }))}
                  aria-pressed={Boolean(liked[friend.id])}
                  // The visible count is part of the name, so voice users can say what they see
                  aria-label={`${friend.likes + (liked[friend.id] ? 1 : 0)} likes, like ${friend.name}'s review`}
                  className={`flex items-center gap-1 hover:text-echo-orange transition-colors ${liked[friend.id] ? 'text-echo-orange' : ''}`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{friend.likes + (liked[friend.id] ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!showAll && allRecommendations.length > limit && (
        <button onClick={() => setShowAll(true)} className="mt-4 w-full text-sm text-echo-orange hover:text-echo-orange-dark font-medium transition-colors">
          View all {allRecommendations.length} friend reviews
        </button>
      )}
    </Card>
  );
};

FriendRecommendations.propTypes = {
  bookId: PropTypes.string.isRequired,
  limit: PropTypes.number,
};

export default FriendRecommendations;
