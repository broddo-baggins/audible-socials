import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  animated = true,
  className = '',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  const variants = {
    primary: 'bg-audible-orange text-white focus:ring-2 focus:ring-audible-orange focus:ring-offset-2',
    secondary: 'bg-white text-audible-text-primary border border-audible-gray-300 focus:ring-2 focus:ring-audible-orange focus:ring-offset-2',
    outline: 'bg-transparent text-audible-orange border border-audible-orange focus:ring-2 focus:ring-audible-orange focus:ring-offset-2',
    ghost: 'bg-transparent text-audible-gray-600',
    link: 'bg-transparent text-audible-orange underline',
    dark: 'bg-audible-gray-800 text-white focus:ring-2 focus:ring-audible-orange focus:ring-offset-2',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-base rounded-lg gap-2',
    lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
    xl: 'px-8 py-4 text-lg rounded-xl gap-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = disabled ? 'bg-echo-bg-tertiary text-echo-text-disabled cursor-not-allowed border border-echo-border' : variants[variant];

  // Enhanced button animations
  const buttonVariants = {
    initial: { scale: 1 },
    hover: !disabled && !loading && animated ? {
      scale: 1.02,
      transition: { duration: 0.2, ease: "easeOut" }
    } : {},
    tap: !disabled && !loading && animated ? {
      scale: 0.98,
      transition: { duration: 0.1 }
    } : {}
  };

  const MotionComponent = animated ? motion.button : 'button';
  const motionProps = animated ? {
    variants: buttonVariants,
    initial: "initial",
    whileHover: "hover",
    whileTap: "tap"
  } : {};

  return (
    <MotionComponent
      ref={ref}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantClass} ${sizes[size]} ${widthClass} ${className}`}
      {...motionProps}
      {...props}
    >
      {loading && (
        <motion.svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
        </motion.svg>
      )}
      {!loading && leftIcon && (
        <motion.span
          className="inline-flex"
          whileHover={{ scale: animated ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {leftIcon}
        </motion.span>
      )}
      <motion.span
        layout
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {!loading && rightIcon && (
        <motion.span
          className="inline-flex"
          whileHover={{ scale: animated ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {rightIcon}
        </motion.span>
      )}
    </MotionComponent>
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
  animated: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
