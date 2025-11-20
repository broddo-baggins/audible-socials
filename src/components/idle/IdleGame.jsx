import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart } from 'lucide-react';
import { useIdleGame } from '../../hooks/useIdleGame';
import IdleHeader from './IdleHeader';
import CharacterVisuals from './CharacterVisuals';
import ActivityGrid from './ActivityGrid';
import UpgradeShop from './UpgradeShop';
import IdleAchievements from './IdleAchievements';
import FloatingText from './FloatingText';

/**
 * IdleGame - Main idle game component
 * Integrates all sub-components and manages game state via useIdleGame hook
 */
const IdleGame = ({ isPlaying = false, currentBook = null }) => {
  const {
    gameState,
    progressPercent,
    floatingTexts,
    newAchievements,
    changeActivity,
    purchaseUpgrade
  } = useIdleGame(isPlaying, currentBook);

  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  const handleActivityChange = (activityId) => {
    if (changeActivity(activityId)) {
      setShowActivityMenu(false);
    }
  };

  const handlePurchase = (upgradeId) => {
    const result = purchaseUpgrade(upgradeId);
    if (result.success) {
      // Purchase successful - could add additional feedback here
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl p-6 text-white shadow-2xl overflow-hidden">
      {/* Background animated gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, #818cf8 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, #f472b6 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, #34d399 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, #fbbf24 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, #818cf8 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Floating Text Notifications */}
      <FloatingText items={floatingTexts} />

      {/* Achievement Notifications */}
      <AnimatePresence>
        {newAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4 rounded-lg shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{achievement.icon}</div>
              <div>
                <div className="font-bold text-white">Achievement Unlocked!</div>
                <div className="text-sm text-white/90">{achievement.name}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Header with Stats */}
        <IdleHeader gameState={gameState} progressPercent={progressPercent} />

        {/* Character Visualization */}
        <CharacterVisuals activity={gameState.currentActivity} isPlaying={isPlaying} />

        {/* Activity Selection */}
        <ActivityGrid
          gameState={gameState}
          onActivityChange={handleActivityChange}
          showMenu={showActivityMenu}
          onToggleMenu={() => setShowActivityMenu(!showActivityMenu)}
        />

        {/* Upgrade Shop */}
        <UpgradeShop
          gameState={gameState}
          onPurchase={handlePurchase}
          showShop={showShop}
          onToggleShop={() => setShowShop(!showShop)}
        />

        {/* Achievements */}
        <IdleAchievements
          gameState={gameState}
          showAchievements={showAchievements}
          onToggleAchievements={() => setShowAchievements(!showAchievements)}
        />

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-yellow-400">
              {gameState.achievements.length}
            </div>
            <div className="text-sm text-white/70">Achievements</div>
          </motion.div>
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-blue-400">
              {Math.floor(gameState.totalMinutesListened / 60)}h
            </div>
            <div className="text-sm text-white/70">Total Listening</div>
          </motion.div>
        </div>

        {/* Current Book Integration */}
        {currentBook && isPlaying && (
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex items-center gap-3">
              <img
                src={currentBook.cover}
                alt={currentBook.title}
                className="w-10 h-14 object-cover rounded shadow-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">
                  {currentBook.title}
                </p>
                <p className="text-xs text-white/70">Currently listening</p>
              </div>
              <div className="flex items-center gap-1 text-green-400">
                <Heart className="w-5 h-5 fill-green-400" />
                <span className="text-xs font-medium">Active</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Message */}
        <div className="text-center">
          {isPlaying ? (
            <motion.div
              className="flex items-center justify-center gap-2 text-green-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Play className="w-5 h-5" />
              <span className="text-sm font-medium">
                Gaining XP and Focus Points while you listen!
              </span>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-white/60">
              <Pause className="w-5 h-5" />
              <span className="text-sm">Start listening to begin gaining rewards</span>
            </div>
          )}
        </div>

        {/* Multiplier Display (if any upgrades purchased) */}
        {gameState.purchasedUpgrades.length > 0 && (
          <motion.div
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-lg p-3 border border-purple-400/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="text-xs text-white/70 mb-1">Active Multipliers</div>
              <div className="flex items-center justify-center gap-4 text-sm">
                {gameState.multipliers.xp > 1 && (
                  <span className="text-yellow-400 font-bold">
                    XP: ×{gameState.multipliers.xp.toFixed(2)}
                  </span>
                )}
                {gameState.multipliers.fp > 1 && (
                  <span className="text-blue-400 font-bold">
                    FP: ×{gameState.multipliers.fp.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IdleGame;
