import { useId } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Lock, ChevronDown, Ear, Sofa, Star, Fish, Landmark, Compass, Globe, Library, Target, Sparkles, Castle,
  Scroll, Hourglass, Sprout, Mountain, Circle, Shield, Flame, Palette, Hammer, Cat, Footprints, Scissors, BookOpen,
  Glasses, Coins, Briefcase, DollarSign, TrendingUp, ShoppingBag, Crown, Hand, Heart, Moon, Sun, ChefHat, Award,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../../utils/idleGame';

// Achievement data names its icon by word; these are the lucide glyphs for each word.
const ACHIEVEMENT_ICONS = {
  Ear, Sofa, Star, Fish, Landmark, Compass, Globe, Library, Target, Sparkles, Castle, Scroll, Hourglass, Sprout,
  Mountain, Circle, Shield, Flame, Palette, Hammer, Cat, Footprints, Scissors, BookOpen, Glasses, Coins, Briefcase,
  DollarSign, TrendingUp, ShoppingBag, Trophy, Crown, Hand, Heart, Moon, Sun, ChefHat,
  Candle: Flame,
  Tree: Sprout,
  Pig: Coins,
};

/** AchievementIcon: the achievement's glyph, or a lock while it is still to earn. */
export const AchievementIcon = ({ icon, unlocked = true, className = 'h-5 w-5' }) => {
  const Icon = unlocked ? (ACHIEVEMENT_ICONS[icon] || Award) : Lock;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
};

// Achievement names arrive in capitals and some descriptions shout; set both in plain sentence case.
const achievementName = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const plainCopy =(s = '') => s.replace(/!+/g, '.').replace(/\.\./g, '.');

/**
 * IdleAchievements: every listening milestone, earned or not. A disclosure
 * row on night; open, your share earned as a bar and the full list.
 */
const IdleAchievements = ({ gameState, showAchievements, onToggleAchievements }) => {
  const panelId = useId();
  const earnedCount = gameState.achievements.length;
  const totalCount = Object.keys(ACHIEVEMENTS).length;
  const progressPercent = (earnedCount / totalCount) * 100;

  return (
    <div>
      <button
        type="button"
        onClick={onToggleAchievements}
        aria-expanded={showAchievements}
        aria-controls={panelId}
        className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-[#3A3D45] px-4 py-3 text-left transition-colors hover:bg-night-raised"
      >
        <Trophy className="h-5 w-5 shrink-0 text-ink-on-night-2" strokeWidth={1.75} aria-hidden="true" />
        <span className="flex-1 font-medium">Achievements</span>
        <span className="text-[0.8125rem] text-ink-on-night-2 tabular">{earnedCount} of {totalCount}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-ink-on-night-2 transition-transform duration-200 ${showAchievements ? 'rotate-180' : ''}`} strokeWidth={1.75} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {showAchievements && (
          <Motion.div
            id={panelId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 px-1">
              <div className="flex items-center justify-between text-[0.8125rem] text-ink-on-night-2 tabular">
                <span>Earned</span>
                <span className="font-semibold text-ink-on-night">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#3A3D45]">
                <div className="h-full rounded-full bg-hl" style={{ width: `${progressPercent}%` }} />
              </div>

              <ul
                className="mt-4 max-h-96 divide-y divide-[#2C2F36] overflow-y-auto pr-2"
                tabIndex={0}
                aria-label="All achievements"
              >
                {Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
                  const isEarned = gameState.achievements.includes(id);

                  return (
                    <li key={id} className="flex items-start gap-4 px-2 py-3">
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${isEarned ? 'bg-hl text-ink' : 'border border-[#3A3D45] text-ink-on-night-2'}`}>
                        <AchievementIcon icon={achievement.icon} unlocked={isEarned} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium ${isEarned ? '' : 'text-ink-on-night-2'}`}>
                          {achievementName(achievement.name)}
                          <span className="sr-only">{isEarned ? ', earned' : ', not earned yet'}</span>
                        </p>
                        <p className="text-[0.8125rem] text-ink-on-night-2">{plainCopy(achievement.description)}</p>
                        <p className="mt-1 text-xs text-ink-on-night-2 tabular">
                          <span className="capitalize">{achievement.rarity}</span>
                          {achievement.reward && <> · +{achievement.reward.amount} {achievement.reward.type.toUpperCase()}</>}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdleAchievements;
