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
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const {
    id,
    title,
    author,
    narrator,
    rating,
    ratingsCount,
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
    <div 
      className={`${sizes[size].container} flex-shrink-0 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <Link to={`/book/${id}`} className="block relative group">
        <div className="relative aspect-book rounded-lg overflow-hidden bg-echo-beige shadow-card hover:shadow-card-hover transition-all duration-250">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          
          <img
            src={cover}
            alt={`${title} cover`}
            className={`w-full h-full object-cover transition-all duration-250 ${isHovered ? 'scale-105' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
              <ProgressBar 
                value={progress} 
                max={100} 
                size="sm"
                variant="player"
              />
            </div>
          )}
          
          {/* Hover Overlay with Actions */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-250 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full bg-echo-orange text-white hover:bg-echo-orange-dark transition-colors shadow-lg"
              aria-label={`Play sample of ${title}`}
              onClick={(e) => {
                e.preventDefault();
                // Play sample functionality
              }}
            >
              <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
            </button>
            
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label={`Add ${title} to library`}
              onClick={(e) => {
                e.preventDefault();
                // Add to library functionality
              }}
            >
              <Plus className="w-5 h-5" />
            </button>
            
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
              aria-label={`Add ${title} to wishlist`}
              onClick={(e) => {
                e.preventDefault();
                // Add to wishlist functionality
              }}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
      
      {/* Book Info */}
      <div className="mt-3 space-y-1">
        <Link to={`/book/${id}`}>
          <h3 className={`${sizes[size].title} font-serif font-semibold text-echo-text-primary line-clamp-2 hover:text-echo-orange transition-colors`}>
            {title}
          </h3>
        </Link>
        
        <p className={`${sizes[size].subtitle} text-echo-text-secondary line-clamp-1`}>
          {author}
        </p>
        
        {narrator && (
          <p className={`${sizes[size].subtitle} text-echo-text-tertiary line-clamp-1`}>
            {narrator}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-1">
          <Rating 
            value={rating} 
            showValue={false}
            showCount={false}
            size="sm"
          />
          
          {duration && (
            <span className="text-xs text-echo-text-tertiary">
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
