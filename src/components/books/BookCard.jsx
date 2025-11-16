import { Play, Plus, Heart, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Rating, Badge, ProgressBar } from '../ui';

const BookCard = ({ 
  book, 
  showProgress = false,
  size = 'md',
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const {
    id,
    title,
    author,
    narrator,
    rating,
    duration,
    cover,
    contentType,
    progress = 0
  } = book;
  
  const sizes = {
    sm: {
      container: 'w-32',
      title: 'text-sm',
      subtitle: 'text-xs',
    },
    md: {
      container: 'w-40',
      title: 'text-base',
      subtitle: 'text-sm',
    },
    lg: {
      container: 'w-48',
      title: 'text-lg',
      subtitle: 'text-base',
    },
  };
  
  const getBadgeVariant = (type) => {
    switch (type) {
      case 'original':
        return 'original';
      case 'podcast':
        return 'podcast';
      default:
        return null;
    }
  };
  
  const badgeVariant = getBadgeVariant(contentType);
  
  return (
    <div className={`${sizes[size].container} flex-shrink-0 ${className}`}>
      {/* Cover Image */}
      <Link to={`/book/${id}`} className="block group">
        <div className="relative aspect-book rounded-md overflow-hidden bg-audible-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer bg-audible-gray-200" />
          )}

          <img
            src={cover}
            alt={`${title} cover`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Content Type Badge */}
          {badgeVariant && (
            <div className="absolute top-2 left-2">
              <Badge variant={badgeVariant} size="sm">
                {contentType === 'original' ? 'Original' : 'Podcast'}
              </Badge>
            </div>
          )}

          {/* Progress Bar Overlay */}
          {showProgress && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-audible-gray-800/20">
              <div
                className="h-full bg-audible-orange transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Book Info */}
      <div className="mt-3 space-y-1">
        <Link to={`/book/${id}`}>
          <h3 className={`${sizes[size].title} font-medium text-audible-text-primary line-clamp-2 hover:text-audible-orange transition-colors leading-tight`}>
            {title}
          </h3>
        </Link>

        <p className={`${sizes[size].subtitle} text-audible-text-secondary line-clamp-1`}>
          {author}
        </p>

        {narrator && (
          <p className={`${sizes[size].subtitle} text-audible-text-tertiary line-clamp-1`}>
            {narrator}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <Rating
            value={rating}
            showValue={false}
            showCount={false}
            size="sm"
          />

          {duration && (
            <span className="text-xs text-audible-text-tertiary">
              {duration}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    narrator: PropTypes.string,
    rating: PropTypes.number,
    ratingsCount: PropTypes.number,
    duration: PropTypes.string,
    cover: PropTypes.string,
    contentType: PropTypes.string,
    progress: PropTypes.number,
  }).isRequired,
  showProgress: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default BookCard;
