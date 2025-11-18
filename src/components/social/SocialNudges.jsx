import { useState, useEffect } from 'react';
import { Users, Star, TrendingUp, Award, BookOpen, Clock, ThumbsUp, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import PropTypes from 'prop-types';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import { getFriends } from '../../utils/localStorage';

const SocialNudges = ({ limit = 3 }) => {
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadNudges = async () => {
      try {
        // Get actual friends
        const friendIds = getFriends();
        const friends = usersData.filter(u => friendIds.includes(u.id));
        
        // If no friends, use sample users for demo
        const users = friends.length > 0 ? friends : usersData.slice(0, 5);
        const books = booksData;
        
        // Generate richer social nudges
        const generatedNudges = [];
        
        // Type 1: Friends currently listening (with progress)
        users.slice(0, Math.min(3, users.length)).forEach((user, idx) => {
          const currentBook = user.currentlyReading 
            ? books.find(b => b.id === user.currentlyReading)
            : books[idx % books.length];
          
          if (currentBook) {
            generatedNudges.push({
              type: 'friends_listening',
              icon: BookOpen,
              message: `${user.name} is listening to`,
              book: currentBook,
              user,
              progress: user.currentProgress || Math.floor(Math.random() * 80) + 10,
              action: 'Listen too',
              color: 'text-blue-600',
              bgColor: 'bg-blue-50',
              timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`
            });
          }
        });
        
        // Type 2: Friend ratings (show recent high ratings)
        users.slice(0, Math.min(2, users.length)).forEach((user, idx) => {
          const ratedBookIds = Object.keys(user.ratings || {});
          if (ratedBookIds.length > 0) {
            const bookId = ratedBookIds[idx % ratedBookIds.length];
            const book = books.find(b => b.id === bookId);
            const rating = user.ratings[bookId];
            
            if (book && rating >= 4) {
              generatedNudges.push({
                type: 'friend_rating',
                icon: Star,
                message: `${user.name} rated`,
                book,
                user,
                rating,
                action: 'See details',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                timestamp: `${Math.floor(Math.random() * 48) + 1}h ago`
              });
            }
          }
        });
        
        // Type 3: Friend completed book
        if (users.length > 2) {
          const user = users[2];
          const completedBook = books[Math.floor(Math.random() * Math.min(10, books.length))];
          generatedNudges.push({
            type: 'completed',
            icon: Award,
            message: `${user.name} just finished`,
            book: completedBook,
            user,
            action: 'Congratulate',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            timestamp: `${Math.floor(Math.random() * 24) + 1}h ago`
          });
        }
        
        // Type 4: Trending in network
        const trendingBook = books.find(b => b.genre === 'Science Fiction') || books[0];
        generatedNudges.push({
          type: 'trending',
          icon: TrendingUp,
          message: 'Trending among your friends',
          book: trendingBook,
          stat: `${Math.floor(Math.random() * 10) + 3} friends listening`,
          action: 'Explore',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          timestamp: 'Popular this week'
        });
        
        // Shuffle and limit
        const shuffled = generatedNudges.sort(() => Math.random() - 0.5);
        setNudges(shuffled.slice(0, limit));
      } catch (error) {
        console.error('Failed to load social nudges:', error);
        setNudges([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadNudges();
  }, [limit]);
  
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex gap-3">
              <div className="w-12 h-12 bg-echo-beige rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-echo-beige rounded w-3/4" />
                <div className="h-3 bg-echo-beige rounded w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (nudges.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {nudges.map((nudge, index) => {
        const Icon = nudge.icon;
        
        return (
          <Card key={index} className="p-4 hover:shadow-lg transition-all border border-gray-100 hover:border-gray-200">
            <div className="flex gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg ${nudge.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${nudge.color}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-audible-text-secondary">
                    {nudge.message}
                  </p>
                  {nudge.timestamp && (
                    <span className="text-xs text-audible-text-tertiary">
                      • {nudge.timestamp}
                    </span>
                  )}
                </div>
                
                {nudge.book && (
                  <Link
                    to={`/book/${nudge.book.id}`}
                    className="text-base font-bold text-audible-text-primary hover:text-audible-orange transition-colors block mb-2 line-clamp-1"
                  >
                    {nudge.book.title}
                  </Link>
                )}
                
                {/* Rating display */}
                {nudge.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < nudge.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-semibold text-audible-text-secondary ml-1">
                      {nudge.rating}/5
                    </span>
                  </div>
                )}
                
                {/* Progress bar for listening */}
                {nudge.progress !== undefined && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-audible-text-tertiary mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{nudge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${nudge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {nudge.stat && (
                  <p className="text-xs text-audible-text-tertiary mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {nudge.stat}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <Link
                    to={nudge.book ? `/book/${nudge.book.id}` : '#'}
                    className="text-xs font-semibold text-audible-orange hover:text-audible-orange-dark transition-colors"
                  >
                    {nudge.action}
                  </Link>
                  {nudge.type === 'friend_rating' && (
                    <button className="text-xs text-audible-text-tertiary hover:text-audible-text-secondary transition-colors flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      Like
                    </button>
                  )}
                </div>
              </div>
              
              {/* Book Cover (if applicable) */}
              {nudge.book && (
                <Link
                  to={`/book/${nudge.book.id}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={nudge.book.cover}
                    alt={nudge.book.title}
                    className="w-20 h-28 object-cover rounded shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                  />
                </Link>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

SocialNudges.propTypes = {
  limit: PropTypes.number,
};

export default SocialNudges;
