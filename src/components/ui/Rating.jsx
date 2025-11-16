import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

const Rating = ({ 
  value = 0, 
  max = 5, 
  showValue = true,
  showCount = false,
  count = 0,
  size = 'md',
  interactive = false,
  onChange = null,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };
  
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  
  const handleClick = (rating) => {
    if (interactive && onChange) {
      onChange(rating);
    }
  };
  
  const handleKeyDown = (e, rating) => {
    if (interactive && onChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(rating);
    }
  };
  
  const renderStar = (index) => {
    const starValue = index + 1;
    const filled = starValue <= Math.floor(value);
    const halfFilled = starValue === Math.ceil(value) && value % 1 !== 0;
    
    return (
      <div
        key={index}
        className={`relative ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
        onClick={() => handleClick(starValue)}
        onKeyDown={(e) => handleKeyDown(e, starValue)}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
      >
        {halfFilled ? (
          <div className="relative">
            <Star className={`${sizes[size]} text-audible-gray-300 fill-audible-gray-300`} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={`${sizes[size]} text-yellow-400 fill-yellow-400`} />
            </div>
          </div>
        ) : (
          <Star
            className={`${sizes[size]} ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-audible-gray-300 fill-audible-gray-300'} transition-colors duration-150`}
          />
        )}
      </div>
    );
  };
  
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rating: ${value} out of ${max} stars`}>
        {Array.from({ length: max }, (_, i) => renderStar(i))}
      </div>
      
      {showValue && (
        <span className={`${textSizes[size]} font-medium text-audible-text-primary ml-1`}>
          {value.toFixed(1)}
        </span>
      )}

      {showCount && count > 0 && (
        <span className={`${textSizes[size]} text-audible-text-secondary`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  showValue: PropTypes.bool,
  showCount: PropTypes.bool,
  count: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Rating;
