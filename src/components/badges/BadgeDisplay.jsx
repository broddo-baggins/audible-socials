import { Award, Lock, Sparkles, TrendingUp } from 'lucide-react';
import { Card, Badge as BadgeUI } from '../ui';
import PropTypes from 'prop-types';
import badgesData from '../../data/badges.json';

const BADGE_DEFINITIONS = {
  completionist: {
    name: 'Completionist',
    description: 'Finished 50 books',
    icon: 'B',
    color: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  },
  speed_reader: {
    name: 'Speed Reader',
    description: 'Listened at 2x speed for 100+ hours',
    icon: 'S',
    color: 'bg-gradient-to-br from-blue-400 to-purple-500',
  },
  genre_explorer: {
    name: 'Genre Explorer',
    description: 'Completed books in 10+ genres',
    icon: 'E',
    color: 'bg-gradient-to-br from-green-400 to-teal-500',
  },
  space_cadet: {
    name: 'Space Cadet',
    description: '25+ science fiction books',
    icon: 'SC',
    color: 'bg-gradient-to-br from-indigo-400 to-blue-500',
  },
  science_master: {
    name: 'Science Master',
    description: 'Finished 15+ hard SF books',
    icon: 'SM',
    color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
  },
  veteran_listener: {
    name: 'Veteran Listener',
    description: '500+ hours listened',
    icon: 'V',
    color: 'bg-gradient-to-br from-purple-400 to-pink-500',
  },
  legendary_reader: {
    name: 'Legendary Reader',
    description: '200+ books completed',
    icon: 'L',
    color: 'bg-gradient-to-br from-yellow-500 to-red-500',
  },
  fantasy_master: {
    name: 'Fantasy Master',
    description: '30+ fantasy books',
    icon: 'F',
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
  marathon_listener: {
    name: 'Marathon Listener',
    description: '1000+ hours listened',
    icon: 'M',
    color: 'bg-gradient-to-br from-orange-400 to-red-500',
  },
  night_owl: {
    name: 'Night Owl',
    description: '100+ hours between 10 PM - 6 AM',
    icon: 'N',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
  },
  horror_fan: {
    name: 'Horror Fan',
    description: '15+ horror books',
    icon: 'H',
    color: 'bg-gradient-to-br from-gray-700 to-red-600',
  },
  brave_soul: {
    name: 'Brave Soul',
    description: 'Completed 5 horror books in one month',
    icon: 'BS',
    color: 'bg-gradient-to-br from-gray-800 to-black',
  },
  detective: {
    name: 'Detective',
    description: '25+ mystery books',
    icon: 'D',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
  },
  plot_master: {
    name: 'Plot Master',
    description: 'Solved 10 mysteries before the reveal',
    icon: 'P',
    color: 'bg-gradient-to-br from-teal-400 to-green-500',
  },
  clue_hunter: {
    name: 'Clue Hunter',
    description: 'Finished 50+ detective novels',
    icon: 'CH',
    color: 'bg-gradient-to-br from-gray-600 to-blue-600',
  },
};

const BadgeCard = ({ badgeId, earned = true, size = 'md' }) => {
  const badge = BADGE_DEFINITIONS[badgeId];
  
  if (!badge) return null;
  
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-24 h-24 text-4xl',
  };
  
  return (
    <div className={`relative group ${earned ? '' : 'opacity-50'}`}>
      {/* Badge Icon */}
      <div className={`${sizes[size]} rounded-full ${earned ? badge.color : 'bg-gray-300'} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${!earned && 'grayscale'}`}>
        <span className="text-white">{badge.icon}</span>
        {!earned && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
      
      {/* Badge Info Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-echo-charcoal rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <h4 className="text-white font-semibold text-sm mb-1">
          {badge.name}
        </h4>
        <p className="text-echo-player-subtitle text-xs">
          {badge.description}
        </p>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-echo-charcoal" />
      </div>
    </div>
  );
};

BadgeCard.propTypes = {
  badgeId: PropTypes.string.isRequired,
  earned: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

const BadgeProgress = ({ badge, progress = 0, earned = false }) => {
  const rarityColors = {
    common: 'bg-gray-100 text-gray-700 border-gray-300',
    uncommon: 'bg-green-50 text-green-700 border-green-300',
    rare: 'bg-blue-50 text-blue-700 border-blue-300',
    epic: 'bg-purple-50 text-purple-700 border-purple-300',
  };

  return (
    <Card className={`p-4 border-2 ${earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'} hover:shadow-lg transition-all`}>
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-full ${earned ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-300'} flex items-center justify-center flex-shrink-0 shadow-md`}>
          {earned ? (
            <Award className="w-6 h-6 text-white" />
          ) : (
            <Lock className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-audible-text-primary text-sm">{badge.name}</h4>
            {badge.rarity && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${rarityColors[badge.rarity]}`}>
                {badge.rarity}
              </span>
            )}
          </div>
          <p className="text-xs text-audible-text-secondary mb-2">{badge.description}</p>
          {!earned && progress > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-audible-text-tertiary mb-1">
                <span>Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-orange-400 to-yellow-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
          {earned && (
            <div className="flex items-center gap-1 text-xs text-yellow-700">
              <Sparkles className="w-3 h-3" />
              <span className="font-semibold">Unlocked!</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

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
      <Card className="p-8 text-center bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
        <Award className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-audible-text-primary mb-2">
          Start Earning Badges!
        </h3>
        <p className="text-audible-text-secondary mb-4">
          Complete books, join clubs, and connect with friends to unlock achievements
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-300">
            Common
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-300">
            Uncommon
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-300">
            Rare
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-300">
            Epic
          </span>
        </div>
      </Card>
    );
  }
  
  // Show detailed progress view if requested
  if (showProgress) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-audible-text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Your Badges
          </h3>
          <span className="text-sm text-audible-text-secondary">
            {earnedBadges.length} / {badgesData.length} earned
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {badgesData.map((badge) => {
            const isEarned = earnedBadges.includes(badge.id);
            // Mock progress for demonstration
            const mockProgress = isEarned ? 100 : Math.floor(Math.random() * 80) + 10;
            return (
              <BadgeProgress
                key={badge.id}
                badge={badge}
                progress={mockProgress}
                earned={isEarned}
              />
            );
          })}
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {badgesToShow.map((badgeId) => (
        <BadgeCard 
          key={badgeId}
          badgeId={badgeId}
          earned={earnedBadges.includes(badgeId)}
          size={size}
        />
      ))}
    </div>
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
