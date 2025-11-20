import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Heart, Volume2, VolumeX, FastForward, Rewind } from 'lucide-react';
import { useIdleGame } from '../../hooks/useIdleGame';
import { usePlayer } from '../../contexts/usePlayer';
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
const IdleGame = ({ isPlaying: externalIsPlaying, currentBook: externalBook }) => {
  // Use global player context if props are not provided or to control playback
  const player = usePlayer();
  
  // Determine effective state (props take precedence if provided, otherwise context)
  // But since we want to CONTROL the player, we should primarily rely on context
  // unless this component is used in a pure display mode.
  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : player.isPlaying;
  const currentBook = externalBook !== undefined ? externalBook : player.currentBook;

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

  // Audio Visualizer Bars
  const AudioVisualizer = () => (
    <div className="flex items-end justify-center gap-1 h-8 mb-2">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-green-400 rounded-t-sm"
          animate={isPlaying ? {
            height: [4, 16 + Math.random() * 16, 4],
            opacity: [0.5, 1, 0.5]
          } : {
            height: 4,
            opacity: 0.3
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

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
        <div className="relative">
          <CharacterVisuals activity={gameState.currentActivity} isPlaying={isPlaying} />
          
          {/* In-Game Player Controls */}
          <div className="absolute bottom-0 right-0 flex flex-col items-center gap-2">
             <div className="bg-black/30 backdrop-blur-md rounded-lg p-2 border border-white/10 flex items-center gap-2">
                <button 
                  onClick={() => player.togglePlay()}
                  className={`p-3 rounded-full transition-all ${
                    isPlaying 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/20' 
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current pl-1" />}
                </button>
             </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center">
           <div className={`
             flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300
             ${isPlaying 
               ? 'bg-green-500/20 border-green-500/50 text-green-200' 
               : 'bg-gray-800/40 border-gray-600/50 text-gray-400'}
           `}>
              {isPlaying ? (
                <>
                  <AudioVisualizer />
                  <span className="font-medium text-sm tracking-wide">GAINING XP</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="font-medium text-sm tracking-wide">PAUSED - NO PROGRESS</span>
                </>
              )}
           </div>
        </div>

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
        {currentBook ? (
          <motion.div
            className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 border transition-colors duration-300 ${isPlaying ? 'border-green-500/30 bg-green-900/10' : 'border-white/10'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentBook.cover}
                  alt={currentBook.title}
                  className={`w-12 h-16 object-cover rounded shadow-lg transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-60 grayscale'}`}
                />
                {isPlaying && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                    LIVE
                  </div>
                )}
                {player.isLoading && (
                  <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">
                  {currentBook.title}
                </p>
                <p className="text-xs text-white/70 truncate">{currentBook.author}</p>

                {/* Audio Status */}
                {player.audioError && (
                  <p className="text-xs text-red-400 mt-1">⚠️ {player.audioError}</p>
                )}

                <div className="flex items-center gap-2 mt-2">
                   <button
                     onClick={() => player.skipBackward()}
                     disabled={player.isLoading}
                     className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
                   >
                     <Rewind className="w-4 h-4" />
                   </button>
                   <button
                     onClick={() => player.togglePlay()}
                     disabled={player.isLoading}
                     className={`p-1.5 rounded-full ${isPlaying ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/10 text-white'} hover:bg-white/20 transition-all disabled:opacity-50`}
                   >
                     {player.isLoading ? (
                       <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                     ) : isPlaying ? (
                       <Pause className="w-4 h-4 fill-current" />
                     ) : (
                       <Play className="w-4 h-4 fill-current" />
                     )}
                   </button>
                   <button
                     onClick={() => player.skipForward()}
                     disabled={player.isLoading}
                     className="text-white/60 hover:text-white transition-colors disabled:opacity-50"
                   >
                     <FastForward className="w-4 h-4" />
                   </button>
                </div>

                {/* YouTube Search Option */}
                {player.audioError && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => player.searchYouTube(currentBook)}
                      className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs py-1.5 px-3 rounded transition-colors flex items-center justify-center gap-1"
                    >
                      🔍 Search YouTube for Preview
                    </button>
                    <p className="text-[10px] text-white/50 mt-1 text-center">
                      Opens YouTube search in new tab
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
           <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10 border-dashed">
              <p className="text-sm text-white/50">No book selected. Go to Library to start.</p>
           </div>
        )}

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
