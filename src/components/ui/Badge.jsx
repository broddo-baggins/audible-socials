import PropTypes from 'prop-types';

/**
 * Badge: a small square-cornered label, like a sticker on a spine.
 * Ink, highlighter or outline only; states use their own ink.
 */
const variants = {
  default: 'bg-surface-sunk text-ink-2',
  primary: 'bg-ink text-paper',
  highlight: 'bg-hl text-ink',
  success: 'bg-success-wash text-success',
  warning: 'bg-hl-soft text-ink',
  error: 'bg-danger-wash text-danger',
  info: 'bg-surface-sunk text-ink',
  outline: 'bg-transparent border border-line-strong text-ink',
  original: 'bg-ink text-paper',
  podcast: 'bg-surface text-ink border border-ink',
  new: 'bg-hl text-ink',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-[0.6875rem] gap-1',
  md: 'px-2 py-0.5 text-xs gap-1.5',
  lg: 'px-2.5 py-1 text-sm gap-2',
};

const Badge = ({ children, variant = 'default', size = 'md', dot = false, icon = null, className = '' }) => (
  <span className={`inline-flex items-center rounded-sm font-semibold tracking-[0.02em] whitespace-nowrap ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />}
    {icon && <span className="inline-flex" aria-hidden="true">{icon}</span>}
    {children}
  </span>
);

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'highlight', 'success', 'warning', 'error', 'info', 'outline', 'original', 'podcast', 'new']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  dot: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Badge;
