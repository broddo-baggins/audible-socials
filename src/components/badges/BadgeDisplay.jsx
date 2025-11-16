import { Award, Lock } from 'lucide-react';
import { Card, Badge as BadgeUI } from '../ui';
import PropTypes from 'prop-types';

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

const BadgeDisplay = ({ earnedBadges = [], allBadges = false, size = 'md' }) => {
  const badgesToShow = allBadges 
    ? Object.keys(BADGE_DEFINITIONS)
    : earnedBadges.filter(id => BADGE_DEFINITIONS[id]);
  
  if (badgesToShow.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Award className="w-12 h-12 text-echo-text-tertiary mx-auto mb-3" />
        <p className="text-echo-text-secondary">
          No badges earned yet. Start listening to unlock achievements!
        </p>
      </Card>
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
};

export default BadgeDisplay;
export { BADGE_DEFINITIONS, BadgeCard };
