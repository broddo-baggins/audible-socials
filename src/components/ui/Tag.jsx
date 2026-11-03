import { X } from 'lucide-react';
import PropTypes from 'prop-types';

/** Tag: a pill chip for filters and topics. `primary` is the selected state. */
const variants = {
  default: 'bg-surface-sunk text-ink',
  primary: 'bg-ink text-paper',
  outline: 'bg-transparent border border-line-strong text-ink',
};

const sizes = {
  sm: 'h-7 px-2.5 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-[0.9375rem] gap-2',
};

const Tag = ({ children, variant = 'default', size = 'md', removable = false, onRemove = null, icon = null, className = '' }) => {
  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove();
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {icon && <span className="inline-flex" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="-mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-black/10"
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
        >
          <X className="w-3.5 h-3.5" strokeWidth={2} />
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
