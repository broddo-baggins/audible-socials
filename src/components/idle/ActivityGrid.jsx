import { useId } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Lock, ChevronDown, CircleDot, ChefHat, Brush, Scissors, Cat, Spool, Flame, Sprout, BookOpen, Shuffle } from 'lucide-react';
import { ACTIVITIES } from '../../utils/idleGame';

const ACTIVITY_ICONS = {
  meditate: CircleDot,
  cook: ChefHat,
  clean: Brush,
  craft: Scissors,
  play_with_cat: Cat,
  knit: Spool,
  sit_by_fire: Flame,
  garden: Sprout,
  read_books: BookOpen,
};

const sentence = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/**
 * ActivityGrid: what your listener does while the book plays. A disclosure
 * row on night; open, a list of activities with the current one marked by a
 * highlighter bar. Locked ones say the level that opens them.
 */
const ActivityGrid = ({ gameState, onActivityChange, showMenu, onToggleMenu }) => {
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        onClick={onToggleMenu}
        aria-expanded={showMenu}
        aria-controls={panelId}
        className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-[#3A3D45] px-4 py-3 text-left transition-colors hover:bg-night-raised"
      >
        <Shuffle className="h-5 w-5 shrink-0 text-ink-on-night-2" strokeWidth={1.75} aria-hidden="true" />
        <span className="flex-1 font-medium">Change activity</span>
        <span className="text-[0.8125rem] text-ink-on-night-2 tabular">{gameState.unlockedActivities.length} unlocked</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-ink-on-night-2 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {showMenu && (
          <Motion.div
            id={panelId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-2 divide-y divide-[#2C2F36]">
              {Object.entries(ACTIVITIES).map(([id, activity]) => {
                const isUnlocked = gameState.unlockedActivities.includes(id);
                const isCurrent = gameState.currentActivity === id;
                const Icon = ACTIVITY_ICONS[id] || CircleDot;

                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => isUnlocked && onActivityChange(id)}
                      disabled={!isUnlocked}
                      aria-pressed={isCurrent}
                      className={`relative flex min-h-14 w-full items-center gap-4 rounded-md px-4 py-3 text-left transition-colors ${
                        isCurrent ? 'bg-night-raised' : isUnlocked ? 'hover:bg-night-raised' : 'cursor-not-allowed'
                      }`}
                    >
                      {isCurrent && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-hl" aria-hidden="true" />}
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#3A3D45]">
                        {isUnlocked ? (
                          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                        ) : (
                          <Lock className="h-4 w-4 text-ink-on-night-2" strokeWidth={1.75} aria-hidden="true" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className={`block font-medium ${isUnlocked ? '' : 'text-ink-on-night-2'}`}>{sentence(activity.name)}</span>
                        <span className="block text-[0.8125rem] text-ink-on-night-2">{activity.description}</span>
                      </span>

                      <span className="shrink-0 text-right text-[0.8125rem] tabular">
                        {isUnlocked ? (
                          <>
                            <span className="block font-semibold">+{activity.xpPerMinute} XP/min</span>
                            {isCurrent && <span className="block text-ink-on-night-2">Active</span>}
                          </>
                        ) : (
                          <span className="block text-ink-on-night-2">Level {activity.unlockLevel}</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityGrid;
