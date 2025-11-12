import { useState, useEffect } from 'react';
import { Users, ThumbsUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Rating } from '../ui';
import PropTypes from 'prop-types';

const FriendRecommendations = ({ bookId, limit = 5 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        // Load mock users and books
        const usersResponse = await fetch('/src/data/mockUsers.json');
        const users = await usersResponse.json();
        
        const booksResponse = await fetch('/src/data/books.json');
        const books = await booksResponse.json();
        
        // Find the current book
        const currentBook = books.find(b => b.id === bookId);
        
        if (!currentBook) {
          setRecommendations([]);
          setLoading(false);
          return;
        }
        
        // Simulate friend recommendations based on genre preferences
        const friendRecs = users
          .filter(user => user.favoriteGenres.includes(currentBook.genre))
          .filter(user => user.currentlyReading.includes(bookId))
          .slice(0, limit)
          .map(user => ({
            ...user,
            rating: (4.0 + Math.random() * 1).toFixed(1),
            comment: generateComment(user, currentBook),
            daysAgo: Math.floor(Math.random() * 14) + 1,
          }));
        
        setRecommendations(friendRecs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecommendations();
  }, [bookId, limit]);
  
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
    return comments[Math.floor(Math.random() * comments.length)];
  };
  
  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-echo-beige rounded w-1/3" />
          <div className="h-12 bg-echo-beige rounded" />
        </div>
      </Card>
    );
  }
  
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
                    to={`/profile/${friend.id}`}
                    className="font-medium text-echo-text-primary hover:text-echo-orange transition-colors"
                  >
                    {friend.name}
                  </Link>
                  <p className="text-xs text-echo-text-tertiary">
                    @{friend.username}
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
                <button className="flex items-center gap-1 hover:text-echo-orange transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{Math.floor(Math.random() * 20) + 5}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-echo-orange transition-colors">
                  <MessageCircle className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {recommendations.length >= limit && (
        <button className="mt-4 w-full text-sm text-echo-orange hover:text-echo-orange-dark font-medium transition-colors">
          View all {recommendations.length + 5} friend reviews
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
