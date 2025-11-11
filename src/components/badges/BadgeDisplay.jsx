import { Trophy, Zap, Users, Crown, Star, Calendar, Moon } from 'lucide-react';
import { getUserBadges, getAllBadges } from '../../utils/badgeSystem';

export default function BadgeDisplay({ userId = 'user-me', compact = false }) {
  const earnedBadges = getUserBadges(userId);
  const allBadges = getAllBadges();

  const getIconComponent = (iconName) => {
    const iconClass = compact ? "w-4 h-4" : "w-6 h-6";
    switch (iconName) {
      case 'trophy':
        return <Trophy className={iconClass} />;
      case 'zap':
        return <Zap className={iconClass} />;
      case 'users':
        return <Users className={iconClass} />;
      case 'crown':
        return <Crown className={iconClass} />;
      case 'star':
        return <Star className={iconClass} />;
      case 'calendar':
        return <Calendar className={iconClass} />;
      case 'moon':
        return <Moon className={iconClass} />;
      default:
        return <Trophy className={iconClass} />;
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-500';
      case 'uncommon':
        return 'from-green-400 to-green-500';
      case 'rare':
        return 'from-blue-400 to-blue-500';
      case 'epic':
        return 'from-purple-400 to-purple-500';
      case 'legendary':
        return 'from-yellow-400 to-yellow-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityLabel = (rarity) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  const getEarnedDate = (badgeId) => {
    const earned = earnedBadges.find(b => b.id === badgeId);
    if (earned?.earnedAt) {
      return new Date(earned.earnedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return null;
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {earnedBadges.slice(0, 5).map((badge) => (
          <div
            key={badge.id}
            className={`p-2 rounded-lg bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white`}
            title={`${badge.name} - ${badge.description}`}
          >
            {getIconComponent(badge.icon)}
          </div>
        ))}
        {earnedBadges.length > 5 && (
          <div className="p-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold flex items-center">
            +{earnedBadges.length - 5}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Earned Badges ({earnedBadges.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <div
                key={badge.id}
                className="bg-white rounded-xl shadow-md p-4 border-2 border-gray-200 hover:border-purple-400 transition-all"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} text-white flex items-center justify-center`}>
                  {getIconComponent(badge.icon)}
                </div>
                <h4 className="font-bold text-gray-900 text-center mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-600 text-center mb-2">{badge.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${
                    badge.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                    badge.rarity === 'uncommon' ? 'bg-green-100 text-green-700' :
                    badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                    badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {getRarityLabel(badge.rarity)}
                  </span>
                  <span className="text-gray-500">{getEarnedDate(badge.id)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Available Badges ({allBadges.length - earnedBadges.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allBadges
            .filter(badge => !earnedBadges.find(e => e.id === badge.id))
            .map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-50 rounded-xl shadow-sm p-4 border-2 border-gray-200 opacity-60"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center">
                  {getIconComponent(badge.icon)}
                </div>
                <h4 className="font-bold text-gray-700 text-center mb-1">{badge.name}</h4>
                <p className="text-xs text-gray-500 text-center mb-2">{badge.description}</p>
                <div className="text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-semibold">
                    Locked
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

