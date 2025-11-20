import { useEffect, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

/**
 * AnimatedCounter - Smoothly animates number changes
 * @param {number} value - The target number to display
 * @param {string} direction - Animation direction ('up' or 'down')
 * @param {function} format - Optional formatting function
 */
const AnimatedCounter = ({ value, direction = 'up', format = null }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? value + 100 : 0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, value, isInView]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const formatted = format 
          ? format(Math.floor(latest))
          : Intl.NumberFormat('en-US').format(Math.floor(latest));
        ref.current.textContent = formatted;
      }
    });

    return () => unsubscribe();
  }, [springValue, format]);

  return <span ref={ref}>{format ? format(0) : '0'}</span>;
};

export default AnimatedCounter;

