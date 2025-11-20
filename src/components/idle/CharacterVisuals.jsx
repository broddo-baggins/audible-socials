import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ACTIVITIES } from '../../utils/idleGame';

/**
 * CharacterVisuals - Animated character display based on current activity
 */
const CharacterVisuals = ({ activity, isPlaying }) => {
  const activityVisuals = {
    meditate: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-purple-200">
        <circle cx="30" cy="30" r="25" fill="currentColor" opacity="0.2"/>
        <circle cx="30" cy="30" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 20 L25 15 L35 25 L40 20" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="30" cy="35" r="8" fill="currentColor" opacity="0.6"/>
        <text x="30" y="40" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">OM</text>
      </svg>
    ),
    cook: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-orange-200">
        <rect x="15" y="35" width="30" height="8" fill="currentColor" opacity="0.3"/>
        <rect x="20" y="30" width="20" height="5" fill="currentColor"/>
        <circle cx="25" cy="20" r="3" fill="currentColor" opacity="0.8"/>
        <circle cx="30" cy="18" r="3" fill="currentColor" opacity="0.8"/>
        <circle cx="35" cy="20" r="3" fill="currentColor" opacity="0.8"/>
        <rect x="18" y="25" width="24" height="2" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    clean: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-blue-200">
        <rect x="15" y="25" width="30" height="25" fill="currentColor" opacity="0.2"/>
        <rect x="20" y="20" width="20" height="5" fill="currentColor"/>
        <circle cx="30" cy="15" r="4" fill="currentColor" opacity="0.8"/>
        <path d="M25 35 L35 35" stroke="currentColor" strokeWidth="3"/>
        <path d="M25 40 L35 40" stroke="currentColor" strokeWidth="3"/>
        <circle cx="40" cy="30" r="2" fill="currentColor"/>
      </svg>
    ),
    craft: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-green-200">
        <rect x="20" y="30" width="20" height="15" fill="currentColor" opacity="0.3"/>
        <polygon points="15,30 30,15 45,30" fill="currentColor" opacity="0.4"/>
        <circle cx="25" cy="25" r="2" fill="currentColor"/>
        <circle cx="30" cy="22" r="2" fill="currentColor"/>
        <circle cx="35" cy="25" r="2" fill="currentColor"/>
        <rect x="22" y="35" width="16" height="3" fill="currentColor"/>
      </svg>
    ),
    play_with_cat: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-pink-200">
        <ellipse cx="30" cy="35" rx="12" ry="8" fill="currentColor" opacity="0.4"/>
        <ellipse cx="30" cy="30" rx="8" ry="6" fill="currentColor" opacity="0.6"/>
        <circle cx="27" cy="28" r="2" fill="currentColor"/>
        <circle cx="33" cy="28" r="2" fill="currentColor"/>
        <path d="M28 32 Q30 35 32 32" stroke="currentColor" strokeWidth="2" fill="none"/>
        <rect x="25" y="38" width="3" height="8" fill="currentColor"/>
        <rect x="32" y="38" width="3" height="8" fill="currentColor"/>
        <circle cx="20" cy="42" r="3" fill="currentColor" opacity="0.8"/>
      </svg>
    ),
    knit: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-yellow-200">
        <rect x="15" y="35" width="30" height="8" fill="currentColor" opacity="0.3"/>
        <circle cx="20" cy="30" r="3" fill="currentColor"/>
        <circle cx="25" cy="28" r="3" fill="currentColor"/>
        <circle cx="30" cy="30" r="3" fill="currentColor"/>
        <circle cx="35" cy="28" r="3" fill="currentColor"/>
        <circle cx="40" cy="30" r="3" fill="currentColor"/>
        <rect x="18" y="33" width="24" height="2" fill="currentColor" opacity="0.6"/>
        <circle cx="45" cy="35" r="2" fill="currentColor"/>
      </svg>
    ),
    sit_by_fire: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-red-200">
        <rect x="20" y="35" width="20" height="15" fill="currentColor" opacity="0.2"/>
        <circle cx="30" cy="30" r="8" fill="currentColor" opacity="0.3"/>
        <path d="M26 25 L30 20 L34 25 Z" fill="currentColor"/>
        <path d="M28 27 L30 23 L32 27 Z" fill="currentColor"/>
        <circle cx="29" cy="35" r="4" fill="currentColor"/>
        <circle cx="31" cy="37" r="3" fill="currentColor"/>
      </svg>
    ),
    garden: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-lime-200">
        <rect x="15" y="40" width="30" height="10" fill="currentColor" opacity="0.2"/>
        <rect x="20" y="30" width="3" height="15" fill="currentColor" opacity="0.6"/>
        <rect x="25" y="35" width="3" height="10" fill="currentColor" opacity="0.6"/>
        <rect x="30" y="32" width="3" height="13" fill="currentColor" opacity="0.6"/>
        <rect x="35" y="38" width="3" height="7" fill="currentColor" opacity="0.6"/>
        <circle cx="22" cy="28" r="3" fill="currentColor"/>
        <circle cx="27" cy="33" r="3" fill="currentColor"/>
        <circle cx="32" cy="30" r="3" fill="currentColor"/>
        <circle cx="37" cy="36" r="3" fill="currentColor"/>
      </svg>
    ),
    read_books: (
      <svg width="80" height="80" viewBox="0 0 60 60" className="text-indigo-200">
        <rect x="18" y="25" width="24" height="20" fill="currentColor" opacity="0.3"/>
        <rect x="20" y="27" width="20" height="16" fill="currentColor"/>
        <line x1="22" y1="30" x2="36" y2="30" stroke="white" strokeWidth="1"/>
        <line x1="22" y1="33" x2="36" y2="33" stroke="white" strokeWidth="1"/>
        <line x1="22" y1="36" x2="36" y2="36" stroke="white" strokeWidth="1"/>
        <circle cx="15" cy="32" r="3" fill="currentColor" opacity="0.8"/>
        <circle cx="42" cy="32" r="3" fill="currentColor" opacity="0.8"/>
      </svg>
    )
  };

  const currentActivity = ACTIVITIES[activity];

  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Background glow effect */}
      <motion.div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${currentActivity?.color || 'from-gray-400 to-gray-600'} opacity-20 blur-3xl`}
        animate={{
          scale: isPlaying ? [1, 1.2, 1] : 1,
          opacity: isPlaying ? [0.2, 0.3, 0.2] : 0.2
        }}
        transition={{
          duration: 3,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut'
        }}
      />

      {/* Character container */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isPlaying ? [1, 1.05, 1] : 1,
          y: isPlaying ? [0, -5, 0] : 0
        }}
        transition={{
          duration: isPlaying ? 4 : 0,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut'
        }}
      >
        {/* Character scene background */}
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentActivity?.color || 'from-gray-400 to-gray-600'} opacity-30 flex items-center justify-center backdrop-blur-sm`}>
          {activityVisuals[activity] || activityVisuals.meditate}
        </div>

        {/* Active indicator */}
        {isPlaying && (
          <motion.div
            className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Play className="w-5 h-5 text-white fill-white" />
          </motion.div>
        )}

        {/* Floating particles */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-70"
              animate={{
                x: [0, 30, 0],
                y: [0, -25, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute w-2 h-2 bg-orange-400 rounded-full opacity-70"
              animate={{
                x: [0, -25, 0],
                y: [0, -30, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
            />
            <motion.div
              className="absolute w-2.5 h-2.5 bg-pink-400 rounded-full opacity-70"
              animate={{
                x: [0, 20, 0],
                y: [0, -20, 0],
                opacity: [0, 0.7, 0]
              }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
            />
          </>
        )}
      </motion.div>

      {/* Activity name and XP rate */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full">
        <motion.p
          className="text-lg font-bold text-white drop-shadow-lg"
          key={activity}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentActivity?.name || 'Resting'}
        </motion.p>
        <p className="text-sm text-white/80 drop-shadow">
          +{currentActivity?.xpPerMinute || 0} XP/min
        </p>
      </div>
    </div>
  );
};

export default CharacterVisuals;

