import { forwardRef, useId } from 'react';
import PropTypes from 'prop-types';

/** Input: label above, hint or error below, a 3:1 edge and the system focus ring. */
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
  id,
  ...props
}, ref) => {
  const autoId = useId();
  const inputId = id || autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={`${widthClass} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none">{leftIcon}</div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-11 px-3.5 text-base bg-surface text-ink border rounded-lg transition-colors focus:outline-none focus-visible:outline-none focus:border-ink focus:shadow-[0_0_0_3px_var(--hl)] disabled:bg-surface-sunk disabled:cursor-not-allowed ${error ? 'border-danger' : 'border-line-strong'} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} ${widthClass} ${className}`}
          {...props}
        />
        {rightIcon && (onRightIconClick ? (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk"
            aria-label="Input action"
          >
            {rightIcon}
          </button>
        ) : (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none">{rightIcon}</div>
        ))}
      </div>
      {hint && !error && <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-3">{hint}</p>}
      {error && <p id={`${inputId}-error`} className="mt-1.5 text-sm text-danger" role="alert">{error}</p>}
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
  id: PropTypes.string,
};

export default Input;
