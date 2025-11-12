import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ 
  value = 0, 
  max = 100,
  showTime = false,
  currentTime = '0:00',
  totalTime = '0:00',
  interactive = false,
  onChange = null,
  onSeek = null,
  chapters = [],
  size = 'md',
  variant = 'default',
  className = '' 
}) => {
  const [hovering, setHovering] = useState(false);
  const [hoverPosition, setHoverPosition] = useState(0);
  const progressRef = useRef(null);
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const variants = {
    default: {
      bg: 'bg-echo-beige-dark',
      fill: 'bg-echo-orange',
    },
    player: {
      bg: 'bg-echo-player-border',
      fill: 'bg-echo-orange',
    },
  };
  
  const handleMouseMove = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPosition(Math.min(Math.max(position, 0), 100));
  };
  
  const handleClick = (e) => {
    if (!interactive || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * max;
    const newValue = Math.min(Math.max(position, 0), max);
    
    if (onChange) onChange(newValue);
    if (onSeek) onSeek(newValue);
  };
  
  const handleKeyDown = (e) => {
    if (!interactive) return;
    
    let newValue = value;
    const step = max / 100;
    
    if (e.key === 'ArrowRight') {
      newValue = Math.min(value + step * 5, max);
    } else if (e.key === 'ArrowLeft') {
      newValue = Math.max(value - step * 5, 0);
    } else if (e.key === 'Home') {
      newValue = 0;
    } else if (e.key === 'End') {
      newValue = max;
    } else {
      return;
    }
    
    e.preventDefault();
    if (onChange) onChange(newValue);
    if (onSeek) onSeek(newValue);
  };
  
  return (
    <div className={`w-full ${className}`}>
      {showTime && (
        <div className="flex justify-between items-center text-sm text-echo-text-secondary mb-1.5">
          <span>{currentTime}</span>
          <span>{totalTime}</span>
        </div>
      )}
      
      <div
        ref={progressRef}
        className={`relative w-full ${sizes[size]} ${variants[variant].bg} rounded-full overflow-hidden ${interactive ? 'cursor-pointer' : ''} group`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        role={interactive ? 'slider' : 'progressbar'}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={handleKeyDown}
      >
        {/* Progress fill */}
        <div
          className={`absolute left-0 top-0 h-full ${variants[variant].fill} transition-all duration-150`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* Hover preview */}
        {interactive && hovering && (
          <div
            className="absolute top-0 h-full w-1 bg-white opacity-50"
            style={{ left: `${hoverPosition}%` }}
          />
        )}
        
        {/* Chapter markers */}
        {chapters.length > 0 && chapters.map((chapter, index) => {
          const chapterPosition = (chapter.position / max) * 100;
          return (
            <div
              key={index}
              className="absolute top-0 h-full w-0.5 bg-white opacity-30"
              style={{ left: `${chapterPosition}%` }}
            />
          );
        })}
        
        {/* Interactive handle */}
        {interactive && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-all duration-150 ${hovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
            style={{ left: `calc(${percentage}% - 6px)` }}
          />
        )}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  showTime: PropTypes.bool,
  currentTime: PropTypes.string,
  totalTime: PropTypes.string,
  interactive: PropTypes.bool,
  onChange: PropTypes.func,
  onSeek: PropTypes.func,
  chapters: PropTypes.arrayOf(PropTypes.shape({
    position: PropTypes.number,
    title: PropTypes.string,
  })),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'player']),
  className: PropTypes.string,
};

export default ProgressBar;
