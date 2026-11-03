/**
 * Button: the one button of the system (DESIGN.md, "Buttons").
 *
 * - primary: ink fill, paper label. The default action.
 * - highlight: highlighter fill, ink label. At most one per screen, for the moment that matters.
 * - secondary / outline: surface with a 3:1 edge.
 * - ghost: no fill until hover. link: underlined ink text.
 * - dark: kept as an alias of primary for older call sites.
 * Every button is a pill. Pressing scales to 0.98; nothing grows on hover.
 */

import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-ink text-paper hover:bg-gray-800',
  dark: 'bg-ink text-paper hover:bg-gray-800',
  highlight: 'bg-hl text-ink hover:bg-[#D6E43F]',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-paper',
  outline: 'bg-transparent text-ink border border-line-strong hover:bg-surface',
  ghost: 'bg-transparent text-ink-2 hover:bg-surface-sunk hover:text-ink',
  link: 'bg-transparent text-ink underline underline-offset-4 decoration-1 hover:decoration-2 px-0',
  onNight: 'bg-ink-on-night text-ink hover:bg-white',
};

const sizes = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-[0.9375rem] gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  xl: 'h-14 px-7 text-base gap-2.5',
};

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
  type = 'button',
  ...props
}, ref) => {
  const base = 'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap select-none transition-colors duration-150 disabled:opacity-45 disabled:cursor-not-allowed';
  const Comp = animated ? motion.button : 'button';
  const motionProps = animated && !disabled && !loading ? { whileTap: { scale: 0.98 } } : {};

  return (
    <Comp
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant] || variants.primary} ${variant === 'link' ? 'h-auto text-[0.9375rem]' : sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...motionProps}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" aria-hidden="true" />
      )}
      {!loading && leftIcon && <span className="inline-flex shrink-0" aria-hidden="true">{leftIcon}</span>}
      <span>{children}</span>
      {!loading && rightIcon && <span className="inline-flex shrink-0" aria-hidden="true">{rightIcon}</span>}
    </Comp>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'link', 'dark', 'highlight', 'onNight']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  animated: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
