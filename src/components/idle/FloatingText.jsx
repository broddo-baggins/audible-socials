import { motion, AnimatePresence } from 'framer-motion';

/**
 * FloatingText - Displays floating animated text notifications
 * Used for XP gains, Focus Points, achievements, etc.
 */
const FloatingText = ({ items }) => {
  const getColorByType = (type) => {
    switch (type) {
      case 'xp':
        return 'text-yellow-400';
      case 'fp':
        return 'text-blue-400';
      case 'upgrade':
        return 'text-green-400';
      case 'achievement':
        return 'text-purple-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.5, 1.3, 1.2, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className={`absolute font-bold text-xl ${getColorByType(item.type)} drop-shadow-lg`}
            style={{ 
              left: `${item.x}px`, 
              top: `${item.y}px`,
              textShadow: '0 0 10px rgba(0,0,0,0.8)'
            }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FloatingText;

