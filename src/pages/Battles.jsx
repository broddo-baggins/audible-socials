import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sword, Trophy, Users, Zap, Target, Plus, Filter, Search } from 'lucide-react';
import BattleCard from '../components/battles/BattleCard';
import BattleLeaderboard from '../components/battles/BattleLeaderboard';
import bookBattlesData from '../data/bookBattles.json';

export default function Battles() {
  const [battles, setBattles] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setBattles(bookBattlesData);
  }, []);

  const filteredBattles = battles.filter(battle => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && battle.status === 'active') ||
      (activeTab === 'upcoming' && battle.status === 'upcoming') ||
      (activeTab === 'completed' && battle.status === 'completed');

    const matchesSearch = battle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         battle.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || battle.type === filterType;

    return matchesTab && matchesSearch && matchesType;
  });

  const battleTypes = [
    { id: 'all', label: 'All Types', icon: Sword },
    { id: 'speed_reading', label: 'Speed Reading', icon: Zap },
    { id: 'book_voting', label: 'Book Voting', icon: Sword },
    { id: 'streak_challenge', label: 'Streak Challenge', icon: Target },
  ];

  const tabs = [
    { id: 'all', label: 'All Battles', count: battles.length },
    { id: 'active', label: 'Active', count: battles.filter(b => b.status === 'active').length },
    { id: 'upcoming', label: 'Upcoming', count: battles.filter(b => b.status === 'upcoming').length },
    { id: 'completed', label: 'Completed', count: battles.filter(b => b.status === 'completed').length },
  ];

  const totalParticipants = battles.reduce((sum, battle) => sum + (battle.participants?.length || 0), 0);
  const activeBattles = battles.filter(b => b.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Sword className="w-12 h-12 mr-3" />
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Book Battles</h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Challenge your friends in epic reading competitions! Race to finish books, vote on winners,
              maintain streaks, and earn glory in the ultimate literary showdowns.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{activeBattles}</div>
                <div className="text-white/80">Active Battles</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{totalParticipants.toLocaleString()}</div>
                <div className="text-white/80">Total Participants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">10K+</div>
                <div className="text-white/80">Credits Awarded</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-battle"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Plus className="w-6 h-6 mr-2" />
              Create Battle
            </Link>
            <button className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-colors border-2 border-white/30">
              Find Friends to Battle
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search battles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Battle Type Filters */}
            <div className="flex flex-wrap gap-2">
              {battleTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilterType(type.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                    filterType === type.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-md font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Battle Grid */}
        {filteredBattles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredBattles.map((battle) => (
              <BattleCard key={battle.id} battle={battle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sword className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No battles found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <Link
              to="/create-battle"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Create Your First Battle
            </Link>
          </div>
        )}

        {/* Global Leaderboard */}
        {activeTab === 'active' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Global Battle Champions</h2>
              <p className="text-gray-600">Top performers across all active battles</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Speed Reading Champions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-orange-500" />
                  Speed Reading Masters
                </h3>
                <BattleLeaderboard
                  leaderboard={[
                    { userId: '1', username: 'BookWarrior92', score: 1200, completionTime: '18 days' },
                    { userId: '2', username: 'ReadingQueen', score: 980, completionTime: '22 days' },
                    { userId: '3', username: 'SpeedReaderX', score: 1450, completionTime: '15 days' }
                  ]}
                  battleType="speed_reading"
                />
              </div>

              {/* Streak Champions */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-500" />
                  Streak Masters
                </h3>
                <BattleLeaderboard
                  leaderboard={[
                    { userId: '4', username: 'StreakKing', score: 2800, currentStreak: 28 },
                    { userId: '5', username: 'DailyListener', score: 2100, currentStreak: 21 },
                    { userId: '6', username: 'ConsistencyQueen', score: 1950, currentStreak: 19 }
                  ]}
                  battleType="streak_challenge"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
