import { useState, useEffect } from 'react';
import { Users, Calendar, MessageCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import PropTypes from 'prop-types';

const BookClubTeaser = ({ bookId }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadClubs = async () => {
      try {
        // Load book clubs data
        const clubsResponse = await fetch('/src/data/clubs.json');
        const clubsData = await clubsResponse.json();
        
        // Load books to find the current one
        const booksResponse = await fetch('/src/data/books.json');
        const booksData = await booksResponse.json();
        const currentBook = booksData.find(b => b.id === bookId);
        
        if (!currentBook) {
          setClubs([]);
          setLoading(false);
          return;
        }
        
        // Filter clubs that are reading this book or match the genre
        const relevantClubs = clubsData
          .filter(club => 
            club.currentBook === bookId || 
            club.genre === currentBook.genre ||
            (currentBook.clubs && currentBook.clubs.includes(club.id))
          )
          .slice(0, 3);
        
        setClubs(relevantClubs);
      } catch (error) {
        console.error('Failed to load book clubs:', error);
        setClubs([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadClubs();
  }, [bookId]);
  
  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-echo-beige rounded w-1/3" />
          <div className="h-20 bg-echo-beige rounded" />
        </div>
      </Card>
    );
  }
  
  if (clubs.length === 0) {
    return null;
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-echo-orange" />
        <h3 className="text-lg font-semibold text-echo-text-primary">
          Book Clubs Reading This
        </h3>
      </div>
      
      <div className="space-y-4">
        {clubs.map((club) => (
          <div key={club.id} className="border-b border-echo-border last:border-0 pb-4 last:pb-0">
            {/* Club Header */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <Link
                  to={`/clubs/${club.id}`}
                  className="text-base font-semibold text-echo-text-primary hover:text-echo-orange transition-colors block"
                >
                  {club.name}
                </Link>
                <p className="text-sm text-echo-text-tertiary">
                  {club.memberCount} members
                </p>
              </div>
              <Badge variant="primary" size="sm">
                {club.genre}
              </Badge>
            </div>
            
            {/* Club Stats */}
            <div className="flex items-center gap-4 text-xs text-echo-text-secondary mb-3">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{club.activeDiscussions || 12} discussions</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Meets {club.meetingFrequency || 'weekly'}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{club.booksRead || 23} books read</span>
              </div>
            </div>
            
            {/* Description */}
            {club.description && (
              <p className="text-sm text-echo-text-secondary mb-3 line-clamp-2">
                {club.description}
              </p>
            )}
            
            {/* Action */}
            <Button
              variant="outline"
              size="sm"
              as={Link}
              to={`/clubs/${club.id}`}
            >
              Join Discussion
            </Button>
          </div>
        ))}
      </div>
      
      {clubs.length > 0 && (
        <Link
          to="/clubs"
          className="mt-4 block w-full text-center text-sm text-echo-orange hover:text-echo-orange-dark font-medium transition-colors"
        >
          Explore all book clubs
        </Link>
      )}
    </Card>
  );
};

BookClubTeaser.propTypes = {
  bookId: PropTypes.string,
};

export default BookClubTeaser;

