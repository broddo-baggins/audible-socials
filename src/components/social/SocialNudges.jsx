import { useState, useEffect } from 'react';
import { Users, Star, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import PropTypes from 'prop-types';

const SocialNudges = ({ limit = 3 }) => {
  const [nudges, setNudges] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadNudges = async () => {
      try {
        // Load mock users and books
        const usersResponse = await fetch('/src/data/mockUsers.json');
        const users = await usersResponse.json();
        
        const booksResponse = await fetch('/src/data/books.json');
        const books = await booksResponse.json();
        
        // Generate social nudges
        const generatedNudges = [];
        
        // Type 1: Friends also listening
        const friendsListening = users.slice(0, 3).map(user => ({
          type: 'friends_listening',
          icon: Users,
          message: `${user.name} just started listening to`,
          book: books[Math.floor(Math.random() * Math.min(10, books.length))],
          user,
          action: 'Listen now',
          color: 'text-echo-info',
          bgColor: 'bg-echo-info/10',
        }));
        
        // Type 2: Popular in your genre
        const popularInGenre = {
          type: 'trending',
          icon: TrendingUp,
          message: 'Trending now in Science Fiction',
          book: books.find(b => b.genre === 'Science Fiction') || books[0],
          stat: '234 listeners this week',
          action: 'Check it out',
          color: 'text-echo-orange',
          bgColor: 'bg-echo-orange/10',
        };
        
        // Type 3: Friend milestone
        const friendMilestone = {
          type: 'milestone',
          icon: Award,
          message: `${users[5]?.name || 'A friend'} just earned the "Completionist" badge`,
          user: users[5],
          action: 'Congratulate',
          color: 'text-echo-success',
          bgColor: 'bg-echo-success/10',
        };
        
        generatedNudges.push(...friendsListening, popularInGenre, friendMilestone);
        
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
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg ${nudge.bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${nudge.color}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-echo-text-secondary mb-1">
                  {nudge.message}
                </p>
                
                {nudge.book && (
                  <Link
                    to={`/book/${nudge.book.id}`}
                    className="text-base font-semibold text-echo-text-primary hover:text-echo-orange transition-colors block mb-1"
                  >
                    {nudge.book.title}
                  </Link>
                )}
                
                {nudge.stat && (
                  <p className="text-xs text-echo-text-tertiary mb-2">
                    {nudge.stat}
                  </p>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {nudge.action}
                </Button>
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
                    className="w-16 h-24 object-cover rounded shadow-sm hover:shadow-md transition-shadow"
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
