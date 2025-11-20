import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';
import AnimatedCounter from '../shared/AnimatedCounter';

/**
 * IdleHeader - Displays player stats (Level, XP, Focus Points)
 */
const IdleHeader = ({ gameState, progressPercent }) => {
  return (
    <div className="space-y-4">
      {/* Top Stats Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Idle Listener</h2>
            <p className="text-sm text-white/80">Level {gameState.level}</p>
          </div>
        </div>
        
        {/* Focus Points Display */}
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <div className="text-2xl font-bold text-blue-400">
              <AnimatedCounter value={gameState.focusPoints} />
            </div>
          </div>
          <div className="text-xs text-white/60">Focus Points</div>
        </div>
      </div>

      {/* XP Display */}
      <div className="bg-white/10 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Experience</span>
          <span className="text-sm font-bold text-yellow-400">
            <AnimatedCounter value={gameState.experience} /> XP
          </span>
        </div>
        <div className="text-xs text-white/60 mb-2">
          <AnimatedCounter value={gameState.totalMinutesListened} /> minutes listened
        </div>
      </div>

      {/* Experience Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/80">Level {gameState.level}</span>
          <span className="text-sm font-medium text-white/80">Level {gameState.level + 1}</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
          <motion.div
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 h-4 rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
        <div className="text-center mt-1">
          <span className="text-xs text-white/70">
            {Math.floor((gameState.level * 1000 - gameState.experience))} XP to next level
          </span>
        </div>
      </div>
    </div>
  );
};

export default IdleHeader;

