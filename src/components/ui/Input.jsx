import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({ 
  type = 'text',
  label = '',
  error = '',
  hint = '',
  leftIcon = null,
  rightIcon = null,
  onRightIconClick = null,
  fullWidth = false,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const baseStyles = 'px-4 py-2 text-base bg-white border-2 rounded-lg transition-all duration-200 placeholder:text-echo-text-tertiary focus:outline-none focus:ring-2 focus:ring-echo-orange focus:border-echo-orange disabled:bg-echo-beige disabled:cursor-not-allowed';
  
  const errorStyles = error ? 'border-echo-error focus:ring-echo-error focus:border-echo-error' : 'border-echo-border';
  
  const paddingStyles = leftIcon ? 'pl-11' : rightIcon ? 'pr-11' : '';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`${widthClass} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-echo-text-primary mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-echo-text-secondary pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`${baseStyles} ${errorStyles} ${paddingStyles} ${widthClass} ${className}`}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-echo-text-secondary ${onRightIconClick ? 'cursor-pointer hover:text-echo-orange' : 'pointer-events-none'}`}
            onClick={onRightIconClick}
            role={onRightIconClick ? 'button' : undefined}
            tabIndex={onRightIconClick ? 0 : undefined}
            onKeyDown={onRightIconClick ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRightIconClick();
              }
            } : undefined}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-echo-text-secondary">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1.5 text-sm text-echo-error" role="alert">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  onRightIconClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Input;
