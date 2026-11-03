/**
 * Card: a surface with a hairline edge (DESIGN.md, "Surfaces").
 * Use a card only when the group needs a boundary; otherwise a rule and space do the work.
 */

import PropTypes from 'prop-types';

const variants = {
  default: 'bg-surface border border-line',
  elevated: 'bg-surface border border-line shadow-md',
  flat: 'bg-surface border border-line',
  sunk: 'bg-surface-sunk',
  ghost: '',
};

const paddings = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
  xl: 'p-6 md:p-8',
};

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  // kept for API compatibility; cards no longer float on hover
  animated: _animated = false,
  image = null,
  imageAlt = '',
  className = '',
  ...props
}) => (
  <div
    className={`rounded-lg overflow-hidden ${variants[variant] || variants.default} ${hoverable ? 'transition-colors duration-150 hover:border-line-strong' : ''} ${className}`}
    {...props}
  >
    {image && <img src={image} alt={imageAlt} className="w-full h-auto object-cover" />}
    <div className={paddings[padding]}>{children}</div>
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'flat', 'ghost', 'sunk']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hoverable: PropTypes.bool,
  animated: PropTypes.bool,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  className: PropTypes.string,
};

export default Card;
