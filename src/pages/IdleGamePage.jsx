import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, Trophy, Star, Clock, Award, Zap, Lock } from 'lucide-react';
import IdleGame from '../components/idle/IdleGame';
import { Card, Button } from '../components/ui';
import { getIdleGameState, ACHIEVEMENTS, updateIdleGameState } from '../utils/idleGame';

// Achievement Icon Component - now using emoji icons
const AchievementIcon = ({ icon, unlocked = true }) => {
  if (!unlocked) {
    return <Lock className="w-6 h-6 text-gray-400" />;
  }

  // Icons are now emoji strings
  return (
    <div className="text-2xl">
      {icon}
    </div>
  );
};

const IdleGamePage = () => {
  const [gameState, setGameState] = useState(getIdleGameState());
  const [isPlaying] = useState(false);

  // Development helper: Simulate offline progress
  const simulateOfflineProgress = (minutes) => {
    const now = Date.now();
    const pastTime = now - (minutes * 60 * 1000);

    // Temporarily modify localStorage to simulate being away
    const currentState = getIdleGameState();
    const fakeState = {
      ...currentState,
      lastSaveTime: pastTime
    };
    localStorage.setItem('idleGameState', JSON.stringify(fakeState));

    // Trigger visibility change to simulate coming back
    setTimeout(() => {
      // This will trigger the offline progress calculation
      document.dispatchEvent(new Event('visibilitychange'));
    }, 100);
  };

  useEffect(() => {
    // Refresh game state periodically
    const interval = setInterval(() => {
      setGameState(getIdleGameState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Convert ACHIEVEMENTS object to array for filtering
  const achievementsArray = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => ({
    ...achievement,
    id
  }));

  const unlockedAchievements = achievementsArray.filter(achievement =>
    gameState.achievements.includes(achievement.id)
  );

  const lockedAchievements = achievementsArray.filter(achievement =>
    !gameState.achievements.includes(achievement.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Idle Listener</h1>
                <p className="text-white/80">Your audiobook-powered idle game</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-300">
                  Level {gameState.level}
                </div>
                <div className="text-sm text-white/70">
                  {gameState.experience.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <IdleGame isPlaying={isPlaying} />
            </motion.div>

            {/* Quick Start Listening */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Start Listening to Gain XP!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Play any audiobook to begin earning experience and unlocking activities.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Play className="w-4 h-4 text-green-500" />
                      <span>Play audio</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Gain XP automatically</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-purple-500" />
                      <span>Unlock new activities</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/library"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Browse Library
                </Link>
              </div>
            </Card>

            {/* Development: Offline Progress Simulator */}
            {process.env.NODE_ENV === 'development' && (
              <Card className="p-4 bg-yellow-50 border-2 border-yellow-200">
                <h4 className="font-bold text-gray-900 mb-2">🧪 Development Tools</h4>
                <p className="text-sm text-gray-600 mb-3">Test offline progress accumulation:</p>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateOfflineProgress(5)}
                  >
                    +5 min offline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateOfflineProgress(30)}
                  >
                    +30 min offline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateOfflineProgress(120)}
                  >
                    +2h offline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => simulateOfflineProgress(1440)}
                  >
                    +24h offline
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Switch tabs/minimize browser, then click a button to test offline progress.
                </p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                  {unlockedAchievements.length}/{achievementsArray.length}
                </span>
              </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                {/* Unlocked Achievements */}
                {unlockedAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  >
                    <AchievementIcon icon={achievement.icon} unlocked={true} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      {achievement.reward && (
                        <p className="text-xs text-green-600 mt-1">
                          Reward: +{achievement.reward.amount} {achievement.reward.type.toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div className="text-yellow-500">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}

                {/* Locked Achievements */}
                {lockedAchievements.slice(0, 5).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (unlockedAchievements.length + index) * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                  >
                    <AchievementIcon icon={achievement.icon} unlocked={false} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-500">{achievement.name}</h4>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                    <div className="text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                  </motion.div>
                ))}

                {lockedAchievements.length > 5 && (
                  <p className="text-center text-sm text-gray-500 py-2">
                    +{lockedAchievements.length - 5} more achievements to unlock
                  </p>
                )}
              </div>
            </Card>

            {/* Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-500" />
                Game Stats
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Listening Time</span>
                  <span className="font-semibold text-blue-600">
                    {Math.floor(gameState.totalMinutesListened / 60)}h {gameState.totalMinutesListened % 60}m
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activities Unlocked</span>
                  <span className="font-semibold text-green-600">
                    {gameState.unlockedActivities.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Activity</span>
                  <span className="font-semibold text-purple-600">
                    {gameState.currentActivity.replace('_', ' ')}
                  </span>
                </div>

                <hr className="my-3" />

                <h4 className="font-semibold text-gray-900 mb-2">Activity Stats</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-blue-600">{Math.floor(gameState.activityStats?.meditate || 0)}</div>
                    <div className="text-gray-600">Meditate (min)</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-600">{Math.floor(gameState.activityStats?.cook || 0)}</div>
                    <div className="text-gray-600">Cook (min)</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-bold text-purple-600">{Math.floor(gameState.activityStats?.craft || 0)}</div>
                    <div className="text-gray-600">Craft (min)</div>
                  </div>
                  <div className="text-center p-2 bg-pink-50 rounded">
                    <div className="font-bold text-pink-600">{Math.floor(gameState.activityStats?.play_with_cat || 0)}</div>
                    <div className="text-gray-600">Cat Time (min)</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* How It Works */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                How It Works
              </h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <p>Start playing any audiobook from your library</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <p>Your character automatically gains XP and levels up</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <p>Unlock new activities like cooking, crafting, and gardening</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">4</div>
                  <p>Earn achievements for listening milestones</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Pro Tip:</strong> Earn Focus Points while listening, then spend them in the shop to buy upgrades that multiply your XP gains!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleGamePage;
