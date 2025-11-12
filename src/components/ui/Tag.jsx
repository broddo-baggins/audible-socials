import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const Tag = ({ 
  children, 
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove = null,
  icon = null,
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-lg whitespace-nowrap transition-colors duration-150';
  
  const variants = {
    default: 'bg-echo-beige text-echo-text-primary hover:bg-echo-beige-dark',
    primary: 'bg-echo-orange/10 text-echo-orange hover:bg-echo-orange/20',
    outline: 'bg-transparent border border-echo-border text-echo-text-primary hover:border-echo-orange hover:text-echo-orange',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };
  
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };
  
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onRemove) {
      e.preventDefault();
      e.stopPropagation();
      onRemove();
    }
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          onKeyDown={handleKeyDown}
          className="inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors duration-150 -mr-1"
          aria-label={`Remove ${children}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Tag;
