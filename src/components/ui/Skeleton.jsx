import PropTypes from 'prop-types';

const Skeleton = ({ 
  variant = 'text',
  width = 'full',
  height = 'auto',
  count = 1,
  className = '' 
}) => {
  const baseStyles = 'bg-audible-gray-200 rounded animate-pulse';
  
  const variants = {
    text: 'h-4',
    title: 'h-8',
    button: 'h-10 w-24',
    avatar: 'rounded-full',
    card: 'h-48',
    bookCover: 'aspect-book',
    circle: 'rounded-full aspect-square',
  };
  
  const widthClasses = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4',
  };
  
  const heightClass = height !== 'auto' ? height : '';
  const widthClass = typeof width === 'string' && widthClasses[width] ? widthClasses[width] : width;
  
  const skeletonElement = (
    <div 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${heightClass} ${className}`}
      aria-hidden="true"
    />
  );
  
  if (count === 1) {
    return skeletonElement;
  }
  
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={`${baseStyles} ${variants[variant]} ${widthClass} ${heightClass} ${className}`} aria-hidden="true" />
      ))}
    </div>
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'title', 'button', 'avatar', 'card', 'bookCover', 'circle']),
  width: PropTypes.oneOfType([
    PropTypes.oneOf(['full', '3/4', '1/2', '1/3', '1/4']),
    PropTypes.string,
  ]),
  height: PropTypes.string,
  count: PropTypes.number,
  className: PropTypes.string,
};

// Specialized skeleton components
export const BookCardSkeleton = () => (
  <div className="w-full">
    <Skeleton variant="bookCover" className="w-full mb-3" />
    <Skeleton variant="title" width="full" className="mb-2 h-5" />
    <Skeleton variant="text" width="3/4" className="mb-2" />
    <Skeleton variant="text" width="1/2" />
  </div>
);

export const HeroSkeleton = () => (
  <div className="w-full h-96 bg-audible-gray-100 rounded-lg animate-pulse" />
);

export const CarouselSkeleton = () => (
  <div className="space-y-4">
    <Skeleton variant="title" width="1/4" />
    <div className="flex gap-4">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="w-40 flex-shrink-0">
          <Skeleton variant="bookCover" className="w-full mb-2" />
          <Skeleton variant="text" width="full" className="mb-2" />
          <Skeleton variant="text" width="3/4" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
