import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../../utils/idleGame';

/**
 * IdleAchievements - Display earned and locked achievements
 */
const IdleAchievements = ({ gameState, showAchievements, onToggleAchievements }) => {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const earnedCount = gameState.achievements.length;
  const totalCount = Object.keys(ACHIEVEMENTS).length;
  const progressPercent = (earnedCount / totalCount) * 100;

  const rarityColors = {
    common: 'border-gray-400 bg-gray-500/20',
    uncommon: 'border-green-400 bg-green-500/20',
    rare: 'border-blue-400 bg-blue-500/20',
    epic: 'border-purple-400 bg-purple-500/20',
    legendary: 'border-yellow-400 bg-yellow-500/20'
  };

  return (
    <div>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggleAchievements}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors shadow-lg"
        variants={buttonVariants}
        initial="idle"
        whileHover="hover"
        whileTap="tap"
      >
        <Trophy className="w-5 h-5 text-white" />
        <span className="text-white font-bold">
          Achievements ({earnedCount}/{totalCount})
        </span>
        <Star className="w-4 h-4 text-yellow-300" />
      </motion.button>

      {/* Achievements List */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-3 overflow-hidden"
          >
            {/* Progress Bar */}
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Progress</span>
                <span className="text-sm font-bold text-yellow-400">
                  {progressPercent.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto pr-2">
              {Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
                const isEarned = gameState.achievements.includes(id);

                return (
                  <motion.div
                    key={id}
                    className={`p-3 rounded-lg border-2 ${
                      isEarned
                        ? rarityColors[achievement.rarity] || rarityColors.common
                        : 'border-gray-700 bg-gray-800/30'
                    } ${isEarned ? '' : 'opacity-50'}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isEarned ? 1 : 0.5, x: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="text-3xl flex-shrink-0">
                        {isEarned ? achievement.icon : <Lock className="w-8 h-8 text-gray-600" />}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white text-sm flex items-center gap-2">
                          {achievement.name}
                          {isEarned && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                        </div>
                        <div className="text-xs text-white/70">{achievement.description}</div>
                        
                        {/* Reward Display */}
                        {isEarned && achievement.reward && (
                          <div className="text-xs text-green-400 mt-1">
                            Reward: +{achievement.reward.amount} {achievement.reward.type.toUpperCase()}
                          </div>
                        )}
                        
                        {/* Rarity Badge */}
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            isEarned
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-700 text-gray-500'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdleAchievements;

