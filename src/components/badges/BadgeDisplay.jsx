import { Award, Lock, Check } from 'lucide-react';
import PropTypes from 'prop-types';
import { EmptyState } from '../ui';
import badgesData from '../../data/badges.json';

const BADGE_DEFINITIONS = {
  completionist: { name: 'Completionist', description: 'Finished 50 books', icon: 'B' },
  speed_reader: { name: 'Speed Reader', description: 'Listened at 2x speed for 100+ hours', icon: 'S' },
  genre_explorer: { name: 'Genre Explorer', description: 'Completed books in 10+ genres', icon: 'E' },
  space_cadet: { name: 'Space Cadet', description: '25+ science fiction books', icon: 'SC' },
  science_master: { name: 'Science Master', description: 'Finished 15+ hard SF books', icon: 'SM' },
  veteran_listener: { name: 'Veteran Listener', description: '500+ hours listened', icon: 'V' },
  legendary_reader: { name: 'Legendary Reader', description: '200+ books completed', icon: 'L' },
  fantasy_master: { name: 'Fantasy Master', description: '30+ fantasy books', icon: 'F' },
  marathon_listener: { name: 'Marathon Listener', description: '1000+ hours listened', icon: 'M' },
  night_owl: { name: 'Night Owl', description: '100+ hours between 10 PM and 6 AM', icon: 'N' },
  horror_fan: { name: 'Horror Fan', description: '15+ horror books', icon: 'H' },
  brave_soul: { name: 'Brave Soul', description: 'Completed 5 horror books in one month', icon: 'BS' },
  detective: { name: 'Detective', description: '25+ mystery books', icon: 'D' },
  plot_master: { name: 'Plot Master', description: 'Solved 10 mysteries before the reveal', icon: 'P' },
  clue_hunter: { name: 'Clue Hunter', description: 'Finished 50+ detective novels', icon: 'CH' },
};

const sentence = (s = '') => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// A stable stand-in for progress until real criteria tracking exists (was random on every render).
const mockProgress = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 80) + 10;
};

/**
 * BadgeCard: a medallion with its initials set in Literata. Earned is an ink
 * disc; still to earn is a dashed ring with a lock. Name and condition are
 * printed under it, so nothing hides behind a hover.
 */
const BadgeCard = ({ badgeId, earned = true, size = 'md' }) => {
  const badge = BADGE_DEFINITIONS[badgeId];

  if (!badge) return null;

  const sizes = {
    sm: 'h-12 w-12 text-base',
    md: 'h-16 w-16 text-xl',
    lg: 'h-20 w-20 text-2xl',
  };

  return (
    <li className="flex items-start gap-3">
      <span
        className={`flex shrink-0 items-center justify-center rounded-full font-serif font-medium ${sizes[size] || sizes.md} ${
          earned ? 'bg-ink text-paper' : 'border border-dashed border-line-strong text-ink-3'
        }`}
        aria-hidden="true"
      >
        {earned ? badge.icon : <Lock className="h-5 w-5" strokeWidth={1.75} />}
      </span>
      <span className="min-w-0 pt-1">
        <span className={`block text-sm font-semibold ${earned ? 'text-ink' : 'text-ink-2'}`}>
          {sentence(badge.name)}
          <span className="sr-only">{earned ? ', earned' : ', not earned yet'}</span>
        </span>
        <span className="block text-[0.8125rem] text-ink-3">{badge.description}</span>
      </span>
    </li>
  );
};

BadgeCard.propTypes = {
  badgeId: PropTypes.string.isRequired,
  earned: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

/** BadgeProgress: one row of the full list, with a progress bar until it is earned. */
const BadgeProgress = ({ badge, progress = 0, earned = false }) => (
  <div className="flex items-start gap-4 py-4">
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${earned ? 'bg-hl text-ink' : 'border border-dashed border-line-strong text-ink-3'}`}
      aria-hidden="true"
    >
      {earned ? <Award className="h-5 w-5" strokeWidth={1.75} /> : <Lock className="h-4 w-4" strokeWidth={1.75} />}
    </span>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h4 className="text-sm font-semibold text-ink">{badge.name}</h4>
        {badge.rarity && <span className="text-[0.8125rem] capitalize text-ink-3">{badge.rarity}</span>}
      </div>
      <p className="mt-0.5 text-[0.8125rem] text-ink-2">{badge.description}</p>
      {!earned && progress > 0 && (
        <div className="mt-2 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label={`${badge.name} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-ink" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <span className="text-[0.8125rem] font-semibold text-ink tabular">{progress}%</span>
        </div>
      )}
      {earned && (
        <p className="mt-1 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-success">
          <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
          Unlocked
        </p>
      )}
    </div>
  </div>
);

BadgeProgress.propTypes = {
  badge: PropTypes.object.isRequired,
  progress: PropTypes.number,
  earned: PropTypes.bool,
};

const BadgeDisplay = ({ earnedBadges = [], allBadges = false, size = 'md', showProgress = false }) => {
  const badgesToShow = allBadges
    ? Object.keys(BADGE_DEFINITIONS)
    : earnedBadges.filter(id => BADGE_DEFINITIONS[id]);

  if (badgesToShow.length === 0 && !allBadges) {
    return (
      <EmptyState
        icon={Award}
        title="Start earning badges"
        description="Finish books, join clubs and listen with friends to earn them. Badges come in four rarities: common, uncommon, rare and epic."
        action="Browse book clubs"
        actionTo="/clubs"
      />
    );
  }

  // Show detailed progress view if requested
  if (showProgress) {
    return (
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="t-h3 text-ink">Your badges</h3>
          <span className="t-meta">{earnedBadges.length} of {badgesData.length} earned</span>
        </div>
        <ul className="mt-3 grid border-t border-line md:grid-cols-2 md:gap-x-10">
          {badgesData.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);
            return (
              <li key={badge.id} className="border-b border-line">
                <BadgeProgress badge={badge} progress={isEarned ? 100 : mockProgress(badge.id)} earned={isEarned} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {badgesToShow.map((badgeId) => (
        <BadgeCard
          key={badgeId}
          badgeId={badgeId}
          earned={earnedBadges.includes(badgeId)}
          size={size}
        />
      ))}
    </ul>
  );
};

BadgeDisplay.propTypes = {
  earnedBadges: PropTypes.arrayOf(PropTypes.string),
  allBadges: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showProgress: PropTypes.bool,
};

export { BadgeProgress };
export default BadgeDisplay;
