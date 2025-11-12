import { Play, Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Rating, Badge } from '../ui';
import { usePlayer } from '../../contexts/PlayerContext';

const HeroBanner = ({ book }) => {
  const { loadBook, play } = usePlayer();
  
  if (!book) return null;
  
  const handleStartListening = () => {
    loadBook(book);
    play();
  };
  
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-echo-orange via-echo-orange-dark to-echo-charcoal" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
        {/* Cover Image */}
        <div className="flex-shrink-0 w-48 md:w-64">
          <Link to={`/book/${book.id}`}>
            <div className="relative aspect-book rounded-lg overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="w-full h-full object-cover"
              />
              {book.contentType !== 'audiobook' && (
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant={book.contentType === 'original' ? 'original' : 'podcast'}
                    size="md"
                  >
                    {book.contentType === 'original' ? 'Original' : 'Podcast'}
                  </Badge>
                </div>
              )}
            </div>
          </Link>
        </div>
        
        {/* Book Info */}
        <div className="flex-1 text-center md:text-left text-white">
          <div className="mb-4">
            <Badge variant="new" size="md" className="mb-3">
              Featured
            </Badge>
            <Link to={`/book/${book.id}`}>
              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 hover:text-echo-beige transition-colors">
                {book.title}
              </h1>
            </Link>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              By {book.author}
            </p>
            {book.narrator && (
              <p className="text-lg text-white/80">
                Narrated by {book.narrator}
              </p>
            )}
          </div>
          
          {/* Rating */}
          <div className="mb-4">
            <Rating 
              value={book.rating} 
              showValue={true}
              showCount={true}
              count={book.ratingsCount}
              size="lg"
              className="justify-center md:justify-start"
            />
          </div>
          
          {/* Description */}
          <p className="text-lg text-white/90 mb-6 line-clamp-3 max-w-2xl">
            {book.description}
          </p>
          
          {/* Duration */}
          {book.duration && (
            <p className="text-base text-white/80 mb-6">
              {book.duration}
            </p>
          )}
          
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <Button 
              size="lg"
              onClick={handleStartListening}
              leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
              className="bg-white text-echo-orange hover:bg-echo-beige"
            >
              Start Listening
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              leftIcon={<Plus className="w-5 h-5" />}
              className="border-white text-white hover:bg-white/10"
            >
              Add to Library
            </Button>
            
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

HeroBanner.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    narrator: PropTypes.string,
    description: PropTypes.string,
    rating: PropTypes.number,
    ratingsCount: PropTypes.number,
    duration: PropTypes.string,
    cover: PropTypes.string,
    contentType: PropTypes.string,
  }),
};

export default HeroBanner;
