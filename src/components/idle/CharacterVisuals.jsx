import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ACTIVITIES } from '../../utils/idleGame';
import { PIXEL_SPRITES, SPRITE_COLORS } from '../../data/pixelSprites';

/**
 * CharacterVisuals - Renders animated pixel art sprites
 * Uses code-defined sprite data (arrays of color strings) to render retro graphics
 */
const CharacterVisuals = ({ activity, isPlaying }) => {
  const [frame, setFrame] = useState(0);
  
  // Sprite animation loop
  useEffect(() => {
    if (!isPlaying) {
      setFrame(0);
      return;
    }

    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 2);
    }, 500); // 500ms per frame = 2fps (slow, retro feel)

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentActivity = ACTIVITIES[activity];
  const spriteData = PIXEL_SPRITES[activity] || PIXEL_SPRITES.meditate;
  const currentFrame = spriteData[frame];
  const pixelColor = SPRITE_COLORS[activity] || '#A78BFA';

  // Helper to render the pixel grid
  const renderPixelGrid = () => {
    return (
      <div className="grid grid-cols-10 gap-0.5 w-40 h-40 bg-black/20 p-2 rounded-lg backdrop-blur-sm border-4 border-white/20">
        {currentFrame.map((row, rowIndex) => (
          row.split('').map((pixel, colIndex) => {
            const isPixel = pixel !== '.';
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="w-full h-full rounded-sm transition-colors duration-200"
                style={{
                  backgroundColor: isPixel ? pixelColor : 'transparent',
                  opacity: isPixel ? 1 : 0,
                  boxShadow: isPixel ? `0 0 4px ${pixelColor}` : 'none'
                }}
              />
            );
          })
        ))}
      </div>
    );
  };

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
          y: isPlaying ? [0, -5, 0] : 0
        }}
        transition={{
          duration: isPlaying ? 4 : 0,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut'
        }}
      >
        {/* Render the pixel sprite */}
        {renderPixelGrid()}

        {/* Active indicator */}
        {isPlaying && (
          <motion.div
            className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-none border-4 border-white flex items-center justify-center shadow-lg"
            animate={{ 
              y: [0, -5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Play className="w-6 h-6 text-white fill-white" />
          </motion.div>
        )}

        {/* Retro Particles */}
        {isPlaying && (
          <>
            <motion.div
              className="absolute w-4 h-4 bg-yellow-400 border-2 border-white"
              style={{ top: '0%', right: '0%' }}
              animate={{
                y: [0, -40],
                opacity: [1, 0],
                rotate: [0, 90]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute w-3 h-3 bg-white border border-white/50"
              style={{ top: '20%', left: '-10%' }}
              animate={{
                y: [0, -30],
                opacity: [0.8, 0],
                rotate: [0, -90]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
          </>
        )}
      </motion.div>

      {/* Activity name and XP rate */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-center w-full">
        <motion.p
          className="text-xl font-bold text-white drop-shadow-lg font-mono tracking-wide"
          key={activity}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentActivity?.name.toUpperCase() || 'RESTING'}
        </motion.p>
        <p className="text-sm text-white/80 drop-shadow font-mono">
          +{currentActivity?.xpPerMinute || 0} XP/MIN
        </p>
      </div>
    </div>
  );
};

export default CharacterVisuals;
