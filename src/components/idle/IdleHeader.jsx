import { motion as Motion } from 'framer-motion';
import AnimatedCounter from '../shared/AnimatedCounter';

/**
 * IdleHeader: level, focus points and the way to the next level, on night.
 * Numbers in Literata; the experience bar is the one highlighter fill here.
 */
const IdleHeader = ({ gameState, progressPercent }) => {
  const toNext = Math.max(0, Math.floor(gameState.level * 1000 - gameState.experience));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="text-[0.8125rem] font-medium text-ink-on-night-2">Idle listener</p>
          <p className="mt-1 font-serif text-4xl font-medium leading-none tracking-[-0.02em] md:text-5xl">
            Level <span className="tabular">{gameState.level}</span>
          </p>
        </div>

        <dl className="flex gap-8 text-right">
          <div>
            <dt className="text-[0.8125rem] text-ink-on-night-2">Experience</dt>
            <dd className="mt-1 font-serif text-2xl font-medium tabular">
              <AnimatedCounter value={gameState.experience} /> <span className="font-sans text-sm text-ink-on-night-2">XP</span>
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-ink-on-night-2">Focus points</dt>
            <dd className="mt-1 font-serif text-2xl font-medium tabular">
              <AnimatedCounter value={gameState.focusPoints} /> <span className="font-sans text-sm text-ink-on-night-2">FP</span>
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-[0.8125rem] text-ink-on-night-2 tabular">
          <span>Level {gameState.level}</span>
          <span>Level {gameState.level + 1}</span>
        </div>
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#3A3D45]"
          role="progressbar"
          aria-label={`Progress to level ${gameState.level + 1}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progressPercent)}
        >
          <Motion.div
            className="h-full rounded-full bg-hl"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[0.8125rem] text-ink-on-night-2">
          <span>{toNext.toLocaleString()} XP to the next level</span>
          <span><AnimatedCounter value={gameState.totalMinutesListened} /> minutes listened</span>
        </div>
      </div>
    </div>
  );
};

export default IdleHeader;
