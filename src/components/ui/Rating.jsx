import { Star } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Rating: ink stars on a line-coloured track. No yellow: the stars are a reading, not a decoration.
 * Interactive ratings are real buttons in a radio-like group.
 */
const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5', xl: 'w-6 h-6' };
const textSizes = { sm: 'text-[0.8125rem]', md: 'text-sm', lg: 'text-base', xl: 'text-lg' };

const Rating = ({
  value = 0,
  max = 5,
  showValue = true,
  showCount = false,
  count = 0,
  size = 'md',
  interactive = false,
  onChange = null,
  className = '',
}) => {
  const safe = Number(value) || 0;

  const star = (index) => {
    const starValue = index + 1;
    const fill = Math.max(0, Math.min(1, safe - index));
    const icon = (
      <span className="relative inline-flex">
        <Star className={`${sizes[size]} text-line fill-line`} strokeWidth={1.5} aria-hidden="true" />
        {fill > 0 && (
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
            <Star className={`${sizes[size]} text-ink fill-ink`} strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}
      </span>
    );
    if (!interactive) return <span key={index}>{icon}</span>;
    return (
      <button
        key={index}
        type="button"
        onClick={() => onChange && onChange(starValue)}
        className="p-1 -m-0.5 rounded-full hover:bg-hl-wash"
        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
        aria-pressed={starValue <= safe}
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className="flex items-center gap-0.5"
        role={interactive ? 'group' : 'img'}
        aria-label={interactive ? 'Your rating' : `Rated ${safe.toFixed(1)} out of ${max}`}
      >
        {Array.from({ length: max }, (_, i) => star(i))}
      </div>
      {showValue && <span className={`${textSizes[size]} font-semibold text-ink tabular`}>{safe.toFixed(1)}</span>}
      {showCount && count > 0 && <span className={`${textSizes[size]} text-ink-3 tabular`}>({count.toLocaleString()})</span>}
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
