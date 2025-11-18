import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';

export default function BattleLeaderboard({ leaderboard, battleType, showFull = false }) {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">{rank}</span>;
    }
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const formatScore = (participant, battleType) => {
    switch (battleType) {
      case 'speed_reading':
        return `${participant.completionTime || 'In Progress'}`;
      case 'streak_challenge':
        return `${participant.currentStreak || 0} day streak`;
      case 'book_voting':
        return `${participant.votes || 0} votes`;
      default:
        return participant.score || 0;
    }
  };

  const displayParticipants = showFull ? leaderboard : leaderboard?.slice(0, 10) || [];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6" />
          <h3 className="text-lg font-bold">Battle Leaderboard</h3>
        </div>
        <p className="text-sm text-white/90 mt-1">Real-time rankings updated every 5 minutes</p>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-gray-100">
        {displayParticipants.map((participant, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={participant.userId}
              className={`p-4 transition-colors hover:bg-gray-50 ${getRankBgColor(rank)}`}
            >
              <div className="flex items-center justify-between">
                {/* Rank and Avatar */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(rank)}
                  </div>

                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {participant.username.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">{participant.username}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      {participant.progress && (
                        <span>📖 {participant.progress}% complete</span>
                      )}
                      {participant.currentStreak && (
                        <span>🔥 {participant.currentStreak} day streak</span>
                      )}
                      {participant.totalMinutes && (
                        <span>⏰ {participant.totalMinutes} min total</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">
                    {formatScore(participant, battleType)}
                  </div>
                  {participant.score && (
                    <div className="text-xs text-gray-600">
                      {participant.score} points
                    </div>
                  )}
                  {isTopThree && (
                    <div className="flex items-center justify-center mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar for Active Battles */}
              {participant.progress !== undefined && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{participant.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${participant.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Streak Indicator */}
              {participant.currentStreak && (
                <div className="mt-2 flex items-center space-x-1">
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(participant.currentStreak, 5) }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-orange-500 rounded-full" />
                    ))}
                    {participant.currentStreak > 5 && (
                      <span className="text-xs text-orange-600 font-semibold ml-1">
                        +{participant.currentStreak - 5}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-orange-600 font-medium">Day streak!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {!showFull && leaderboard && leaderboard.length > 10 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
          <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
            View Full Leaderboard ({leaderboard.length - 10} more participants)
          </button>
        </div>
      )}

      {/* Empty State */}
      {(!leaderboard || leaderboard.length === 0) && (
        <div className="p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-gray-600 font-semibold mb-2">No participants yet</h4>
          <p className="text-gray-500 text-sm">Be the first to join this battle!</p>
        </div>
      )}
    </div>
  );
}
