import { Play, Plus, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Rating, Badge } from '../ui';
import { usePlayer } from '../../contexts/usePlayer';

const HeroBanner = ({ book }) => {
  const { loadBook, play } = usePlayer();
  
  if (!book) return null;
  
  const handleStartListening = () => {
    loadBook(book);
    play();
  };
  
  return (
    <div className="bg-white border-b border-audible-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Cover Image */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <Link to={`/book/${book.id}`}>
              <div className="relative aspect-book rounded-md overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={book.cover}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover"
                />
                {book.contentType !== 'audiobook' && (
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={book.contentType === 'original' ? 'original' : 'podcast'}
                      size="sm"
                    >
                      {book.contentType === 'original' ? 'Original' : 'Podcast'}
                    </Badge>
                  </div>
                )}
              </div>
            </Link>
          </div>

          {/* Book Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <Badge variant="new-release" size="sm" className="mb-3">
                Featured
              </Badge>
              <Link to={`/book/${book.id}`}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-audible-text-primary mb-4 hover:text-audible-orange transition-colors">
                  {book.title}
                </h1>
              </Link>
              <p className="text-lg md:text-xl text-audible-text-secondary mb-2">
                By {book.author}
              </p>
              {book.narrator && (
                <p className="text-base text-audible-text-tertiary">
                  Narrated by {book.narrator}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="mb-6">
              <Rating
                value={book.rating}
                showValue={true}
                showCount={true}
                count={book.ratingsCount}
                size="md"
                className="justify-center lg:justify-start"
              />
            </div>

            {/* Description */}
            <p className="text-base text-audible-text-secondary mb-8 max-w-2xl leading-relaxed">
              {book.description}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-8 justify-center lg:justify-start">
              {book.duration && (
                <div className="text-sm text-audible-text-secondary">
                  Length: <span className="font-medium text-audible-text-primary">{book.duration}</span>
                </div>
              )}
              {book.genre && (
                <div className="text-sm text-audible-text-secondary">
                  Genre: <span className="font-medium text-audible-text-primary">{book.genre}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={handleStartListening}
                leftIcon={<Play className="w-5 h-5" fill="currentColor" />}
                className="bg-audible-orange text-white hover:bg-audible-orange-dark px-8 py-3 font-medium"
              >
                Start Listening
              </Button>

              <Button
                size="lg"
                variant="outline"
                leftIcon={<Plus className="w-5 h-5" />}
                className="border-audible-gray-300 text-audible-text-primary hover:bg-audible-gray-50 px-6 py-3"
              >
                Add to Library
              </Button>

              <button className="p-3 text-audible-gray-600 hover:text-audible-orange transition-colors" aria-label="Add to wishlist">
                <Heart className="w-6 h-6" />
              </button>
            </div>
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
