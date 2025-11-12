import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-echo-orange disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-echo-orange text-white hover:bg-echo-orange-dark active:bg-echo-orange-dark shadow-sm hover:shadow-md',
    secondary: 'bg-white text-echo-text-primary border-2 border-echo-border hover:border-echo-orange hover:text-echo-orange active:bg-echo-beige',
    outline: 'bg-transparent text-echo-orange border-2 border-echo-orange hover:bg-echo-orange hover:text-white active:bg-echo-orange-dark',
    ghost: 'bg-transparent text-echo-text-primary hover:bg-echo-beige active:bg-echo-beige-dark',
    link: 'bg-transparent text-echo-orange hover:text-echo-orange-dark hover:underline',
    dark: 'bg-echo-charcoal text-white hover:bg-echo-charcoal-light active:bg-echo-charcoal shadow-sm',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-base rounded-lg gap-2',
    lg: 'px-6 py-3 text-lg rounded-lg gap-2.5',
    xl: 'px-8 py-4 text-xl rounded-xl gap-3',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = disabled ? 'bg-echo-beige text-echo-text-tertiary cursor-not-allowed' : variants[variant];
  
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantClass} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'link', 'dark']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Button;
