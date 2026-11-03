import { useState, useEffect } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { ACTIVITIES } from '../../utils/idleGame';
import { PIXEL_SPRITES } from '../../data/pixelSprites';

/**
 * CharacterVisuals: the listener, drawn as a 10 x 10 pixel sprite in
 * highlighter on the night surface. Two frames at 2 fps while a book plays,
 * still when paused (and always still under reduced motion).
 */
const sentence = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const CharacterVisuals = ({ activity, isPlaying }) => {
  const [frame, setFrame] = useState(0);
  const reduceMotion = useReducedMotion();

  // Sprite animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 2);
    }, 500); // 500ms per frame = 2fps (slow, retro feel)

    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentActivity = ACTIVITIES[activity];
  const spriteData = PIXEL_SPRITES[activity] || PIXEL_SPRITES.meditate;
  // Paused characters (and reduced motion) rest on the first frame
  const currentFrame = spriteData[isPlaying && !reduceMotion ? frame : 0];

  return (
    <div className="flex items-center gap-5 sm:gap-8">
      <div
        className={`grid h-28 w-28 shrink-0 grid-cols-10 gap-[2px] rounded-lg bg-night p-2.5 ring-1 ring-[#3A3D45] transition-opacity duration-200 sm:h-36 sm:w-36 ${isPlaying ? 'opacity-100' : 'opacity-70'}`}
        role="img"
        aria-label={`Your listener, ${currentActivity?.name?.toLowerCase() || 'resting'}`}
      >
        {currentFrame.map((row, rowIndex) => (
          row.split('').map((pixel, colIndex) => (
            <span
              key={`${rowIndex}-${colIndex}`}
              className={`block h-full w-full rounded-[1px] ${pixel !== '.' ? (isPlaying ? 'bg-hl' : 'bg-ink-on-night-2') : ''}`}
            />
          ))
        ))}
      </div>

      <div className="min-w-0">
        <p className="text-[0.8125rem] font-medium text-ink-on-night-2">{isPlaying ? 'Now doing' : 'Resting on'}</p>
        <Motion.p
          key={activity}
          className="mt-1 font-serif text-2xl font-medium leading-tight sm:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {sentence(currentActivity?.name) || 'Resting'}
        </Motion.p>
        <p className="mt-1 text-[0.9375rem] text-ink-on-night-2 tabular">
          +{currentActivity?.xpPerMinute || 0} XP a minute
        </p>
      </div>
    </div>
  );
};

export default CharacterVisuals;
