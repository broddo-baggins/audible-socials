import PropTypes from 'prop-types';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  dot = false,
  icon = null,
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full whitespace-nowrap';
  
  const variants = {
    default: 'bg-echo-beige text-echo-text-primary',
    primary: 'bg-echo-orange text-white',
    success: 'bg-echo-success text-white',
    warning: 'bg-echo-warning text-white',
    error: 'bg-echo-error text-white',
    info: 'bg-echo-info text-white',
    outline: 'bg-transparent border-2 border-echo-border text-echo-text-primary',
    original: 'bg-gradient-to-r from-echo-orange to-echo-orange-light text-white',
    podcast: 'bg-echo-charcoal text-white',
    new: 'bg-echo-success text-white',
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
