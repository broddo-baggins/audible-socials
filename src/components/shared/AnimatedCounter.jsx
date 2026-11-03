import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * AnimatedCounter: eases a number to its new value once it is on screen.
 * Under reduced motion it prints the final number at once, with no count-up.
 * @param {number} value - The target number to display
 * @param {string} direction - Animation direction ('up' or 'down')
 * @param {function} format - Optional formatting function
 */
const formatNumber = (n, format) => (format ? format(Math.floor(n)) : Intl.NumberFormat('en-US').format(Math.floor(n)));

const AnimatedCounter = ({ value, direction = 'up', format = null, className = '' }) => {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value + 100 : 0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (reduceMotion) return;
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView, reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest, format);
      }
    });

    return () => unsubscribe();
  }, [springValue, format, reduceMotion]);

  if (reduceMotion) {
    return <span ref={ref} className={`tabular ${className}`}>{formatNumber(value || 0, format)}</span>;
  }

  return <span ref={ref} className={`tabular ${className}`}>{format ? format(0) : '0'}</span>;
};

export default AnimatedCounter;
