import PropTypes from 'prop-types';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  dot = false,
  icon = null,
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full whitespace-nowrap';
  
  const variants = {
    default: 'bg-audible-gray-100 text-audible-text-secondary',
    primary: 'bg-audible-orange text-white',
    success: 'bg-audible-new-release text-white',
    warning: 'bg-audible-bestseller text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    outline: 'bg-transparent border border-audible-gray-300 text-audible-text-primary',
    original: 'bg-audible-original text-white',
    podcast: 'bg-audible-podcast text-white',
    new: 'bg-audible-new-release text-white',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };
  
  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`${dotSize[size]} rounded-full bg-current opacity-75`} aria-hidden="true" />
      )}
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'warning', 'error', 'info', 'outline', 'original', 'podcast', 'new']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Badge;
