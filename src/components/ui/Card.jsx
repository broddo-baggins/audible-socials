import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hoverable = false,
  image = null,
  imageAlt = '',
  className = '',
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl transition-all duration-250';
  
  const variants = {
    default: 'border border-echo-border shadow-card',
    elevated: 'shadow-lg',
    flat: 'border border-echo-border',
    ghost: '',
  };
  
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  const hoverStyles = hoverable ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {image && (
        <div className="overflow-hidden rounded-t-xl">
          <img 
            src={image} 
            alt={imageAlt}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      <div className={paddings[padding]}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'flat', 'ghost']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hoverable: PropTypes.bool,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  className: PropTypes.string,
};

export default Card;
