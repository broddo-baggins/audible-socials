import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Clock, Target, Zap, Sword, BookOpen } from 'lucide-react';
import { joinBattle, getUserData } from '../../utils/localStorage';

export default function BattleCard({ battle, compact = false }) {
  const [isJoining, setIsJoining] = useState(false);
  const userData = getUserData();
  const isParticipant = battle.participants?.includes(userData?.id);
  const isActive = battle.status === 'active';
  const isUpcoming = battle.status === 'upcoming';

  const getBattleIcon = (type) => {
    const icons = {
      'speed_reading': <Zap className="w-5 h-5" />,
      'book_voting': <Sword className="w-5 h-5" />,
      'streak_challenge': <Target className="w-5 h-5" />,
      'review_battle': <Trophy className="w-5 h-5" />,
      'recommendation_duel': <BookOpen className="w-5 h-5" />
    };
    return icons[type] || <Sword className="w-5 h-5" />;
  };

  const getBattleColor = (type) => {
    const colors = {
      'speed_reading': 'from-orange-500 to-red-500',
      'book_voting': 'from-purple-500 to-pink-500',
      'streak_challenge': 'from-blue-500 to-cyan-500',
      'review_battle': 'from-green-500 to-emerald-500',
      'recommendation_duel': 'from-yellow-500 to-orange-500'
    };
    return colors[type] || 'from-purple-500 to-pink-500';
  };

  const handleJoinBattle = async () => {
    setIsJoining(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      joinBattle(battle.id);
      // Update local state would happen here
    } catch (error) {
      console.error('Failed to join battle:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = () => {
    const endDate = new Date(battle.endDate);
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-300 transition-colors">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getBattleColor(battle.type)} flex items-center justify-center text-white`}>
              {getBattleIcon(battle.type)}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{battle.name}</h4>
              <p className="text-xs text-gray-600">{battle.participants?.length || 0} participants</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            isActive ? 'bg-green-100 text-green-700' :
            isUpcoming ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {battle.status}
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{battle.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{getTimeRemaining()}</span>
          <button
            onClick={handleJoinBattle}
            disabled={isParticipant || !isActive || isJoining}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
              isParticipant
                ? 'bg-green-100 text-green-700'
                : isActive
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isParticipant ? 'Joined' : isActive ? 'Join' : 'Upcoming'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getBattleColor(battle.type)} p-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {getBattleIcon(battle.type)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{battle.name}</h3>
              <p className="text-white/90 text-sm">Battle #{battle.id.split('_')[1]}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
            isActive ? 'bg-green-500/20 text-green-100' :
            isUpcoming ? 'bg-blue-500/20 text-blue-100' :
            'bg-gray-500/20 text-gray-100'
          }`}>
            {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
          </div>
        </div>

        <p className="text-white/90 leading-relaxed">{battle.description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-2xl font-bold text-gray-900">{battle.participants?.length || 0}</span>
            </div>
            <p className="text-xs text-gray-600">Participants</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-2xl font-bold text-gray-900">{getTimeRemaining()}</span>
            </div>
            <p className="text-xs text-gray-600">Time Left</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-2xl font-bold text-gray-900">{battle.prizes?.winner || 'Credits'}</span>
            </div>
            <p className="text-xs text-gray-600">Prize</p>
          </div>
        </div>

        {/* Rules Preview */}
        {battle.rules && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Battle Rules</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {battle.rules.timeLimit && <p>⏰ Time Limit: {battle.rules.timeLimit}</p>}
              {battle.rules.minProgress && <p>📊 Min Progress: {battle.rules.minProgress}%</p>}
              {battle.rules.minDailyMinutes && <p>🎧 Daily Goal: {battle.rules.minDailyMinutes} minutes</p>}
              {battle.rules.scoring && <p>🏆 Scoring: {battle.rules.scoring.replace('_', ' ')}</p>}
            </div>
          </div>
        )}

        {/* Leaderboard Preview */}
        {battle.leaderboard && battle.leaderboard.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Current Leaders</h4>
            <div className="space-y-2">
              {battle.leaderboard.slice(0, 3).map((participant, index) => (
                <div key={participant.userId} className="flex items-center justify-between bg-gray-50 rounded p-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      'bg-orange-600 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{participant.username}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{participant.score}</div>
                    <div className="text-xs text-gray-600">
                      {participant.progress ? `${participant.progress}%` :
                       participant.currentStreak ? `${participant.currentStreak}d` :
                       participant.completionTime || ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex space-x-3">
          <Link
            to={`/battle/${battle.id}`}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
          >
            View Details
          </Link>
          <button
            onClick={handleJoinBattle}
            disabled={isParticipant || !isActive || isJoining}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
              isParticipant
                ? 'bg-green-100 text-green-700 cursor-default'
                : isActive
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isJoining ? 'Joining...' :
             isParticipant ? '✓ Joined' :
             isActive ? 'Join Battle' :
             'Starts Soon'}
          </button>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Starts: {formatDate(battle.startDate)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Ends: {formatDate(battle.endDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
