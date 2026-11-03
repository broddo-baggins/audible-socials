import { useMemo } from 'react';
import { Users, Calendar, MessageCircle, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../ui';
import PropTypes from 'prop-types';
import clubsData from '../../data/clubs.json';
import booksData from '../../data/books.json';

// Clubs have no genre of their own: use the genre of the book they are reading
const clubGenre = (club) => booksData.find(b => b.id === club.currentBook)?.genre;

const BookClubTeaser = ({ bookId }) => {
  const navigate = useNavigate();
  const clubs = useMemo(() => {
    const currentBook = booksData.find(b => b.id === bookId);
    if (!currentBook) return [];

    // Clubs that are reading this book or match the genre
    return clubsData
      .filter(club =>
        club.currentBook === bookId ||
        clubGenre(club) === currentBook.genre ||
        (currentBook.clubs && currentBook.clubs.includes(club.id))
      )
      .slice(0, 3);
  }, [bookId]);

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
                  to={`/club/${club.id}`}
                  className="text-base font-semibold text-echo-text-primary hover:text-echo-orange transition-colors block"
                >
                  {club.name}
                </Link>
                <p className="text-sm text-echo-text-tertiary">
                  {club.memberCount} members
                </p>
              </div>
              {clubGenre(club) && (
                <Badge variant="primary" size="sm">
                  {clubGenre(club)}
                </Badge>
              )}
            </div>
            
            {/* Club Stats */}
            <div className="flex items-center gap-4 text-xs text-echo-text-secondary mb-3">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{club.activeDiscussions || 12} discussions</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Meets {club.meetingsPerMonth ? `${club.meetingsPerMonth}x a month` : 'monthly'}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{(club.previousBooks?.length || 0) + 1} books read</span>
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
              onClick={() => navigate(`/club/${club.id}`)}
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

