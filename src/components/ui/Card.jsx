import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  animated = false,
  image = null,
  imageAlt = '',
  className = '',
  ...props
}) => {
  const baseStyles = 'bg-white rounded-xl';

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

  // Enhanced hover animations using Framer Motion
  const hoverVariants = {
    initial: {
      y: 0,
      boxShadow: variant === 'elevated'
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    },
    hover: hoverable || animated ? {
      y: -4,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    } : {}
  };

  const MotionComponent = animated || hoverable ? motion.div : 'div';
  const motionProps = (animated || hoverable) ? {
    initial: "initial",
    whileHover: "hover",
    variants: hoverVariants
  } : {};

  return (
    <MotionComponent
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={{ cursor: hoverable ? 'pointer' : 'default' }}
      {...motionProps}
      {...props}
    >
      {image && (
        <motion.div
          className="overflow-hidden rounded-t-xl"
          whileHover={{ scale: hoverable ? 1.02 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-auto object-cover"
          />
        </motion.div>
      )}
      <div className={paddings[padding]}>
        {children}
      </div>
    </MotionComponent>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'flat', 'ghost']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hoverable: PropTypes.bool,
  animated: PropTypes.bool,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  className: PropTypes.string,
};

export default Card;
