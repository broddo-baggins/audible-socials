import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Lock } from 'lucide-react';
import { ACTIVITIES } from '../../utils/idleGame';

/**
 * ActivityIcon - Small icon representation for each activity
 */
const ActivityIcon = ({ activityId, size = 20 }) => {
  const icons = {
    meditate: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-purple-300">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
      </svg>
    ),
    cook: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-orange-300">
        <rect x="6" y="8" width="12" height="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="11" r="1" fill="currentColor"/>
        <circle cx="12" cy="11" r="1" fill="currentColor"/>
        <circle cx="15" cy="11" r="1" fill="currentColor"/>
      </svg>
    ),
    clean: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-blue-300">
        <rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="7" y="7" width="10" height="3" fill="currentColor"/>
        <rect x="7" y="11" width="10" height="3" fill="currentColor"/>
      </svg>
    ),
    craft: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-green-300">
        <polygon points="6,18 12,6 18,18" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="9" r="1.5" fill="currentColor"/>
        <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
      </svg>
    ),
    play_with_cat: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-pink-300">
        <ellipse cx="12" cy="16" rx="6" ry="4" fill="currentColor" opacity="0.7"/>
        <ellipse cx="12" cy="12" rx="4" ry="3" fill="currentColor"/>
        <circle cx="10" cy="11" r="1" fill="white"/>
        <circle cx="14" cy="11" r="1" fill="white"/>
      </svg>
    ),
    knit: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-yellow-300">
        <circle cx="6" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
        <circle cx="12" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
        <circle cx="18" cy="8" r="1.5" fill="currentColor"/>
        <rect x="5" y="10" width="14" height="2" fill="currentColor"/>
      </svg>
    ),
    sit_by_fire: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-red-300">
        <path d="M8 16 L12 12 L16 16 Z" fill="currentColor"/>
        <path d="M10 18 L12 16 L14 18 Z" fill="currentColor"/>
        <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    garden: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-lime-300">
        <rect x="3" y="16" width="18" height="4" fill="currentColor" opacity="0.3"/>
        <rect x="6" y="12" width="2" height="6" fill="currentColor"/>
        <rect x="9" y="14" width="2" height="4" fill="currentColor"/>
        <rect x="12" y="11" width="2" height="7" fill="currentColor"/>
        <rect x="15" y="15" width="2" height="3" fill="currentColor"/>
        <circle cx="7" cy="11" r="1.5" fill="currentColor"/>
        <circle cx="10" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="13" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
      </svg>
    ),
    read_books: (
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-indigo-300">
        <rect x="4" y="6" width="16" height="12" fill="none" stroke="currentColor" strokeWidth="2"/>
        <line x1="6" y1="9" x2="18" y2="9" stroke="currentColor" strokeWidth="1"/>
        <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1"/>
        <line x1="6" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1"/>
      </svg>
    )
  };

  return icons[activityId] || icons.meditate;
};

/**
 * ActivityGrid - Interactive menu for selecting activities
 */
const ActivityGrid = ({ gameState, onActivityChange, showMenu, onToggleMenu }) => {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95, rotate: -2 }
  };

  return (
    <div>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggleMenu}
        className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors"
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
      >
        <Settings className="w-5 h-5 text-white" />
        <span className="text-white font-medium">
          Change Activity ({gameState.unlockedActivities.length} unlocked)
        </span>
      </motion.button>

      {/* Activity Selection Grid */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {Object.entries(ACTIVITIES).map(([id, activity]) => {
              const isUnlocked = gameState.unlockedActivities.includes(id);
              const isCurrent = gameState.currentActivity === id;

              return (
                <motion.button
                  key={id}
                  onClick={() => isUnlocked && onActivityChange(id)}
                  disabled={!isUnlocked}
                  className={`w-full p-4 rounded-lg flex items-center gap-3 transition-all ${
                    isCurrent
                      ? 'bg-white/30 border-2 border-yellow-400 shadow-lg'
                      : isUnlocked
                      ? 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                      : 'bg-gray-600/30 cursor-not-allowed border-2 border-transparent'
                  }`}
                  variants={buttonVariants}
                  initial="idle"
                  whileHover={isUnlocked ? "hover" : "idle"}
                  whileTap={isUnlocked ? "tap" : "idle"}
                  layout
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center w-10 h-10">
                    {isUnlocked ? (
                      <ActivityIcon activityId={id} size={28} />
                    ) : (
                      <Lock className="w-6 h-6 text-white/40" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-white text-base">{activity.name}</div>
                    <div className="text-xs text-white/70">{activity.description}</div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    {isUnlocked ? (
                      <>
                        <div className="font-bold text-yellow-400 text-sm">
                          +{activity.xpPerMinute} XP/min
                        </div>
                        {isCurrent && (
                          <div className="text-xs text-green-400 font-medium">Active</div>
                        )}
                      </>
                    ) : (
                      <div className="text-xs text-white/50">
                        Level {activity.unlockLevel}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityGrid;

