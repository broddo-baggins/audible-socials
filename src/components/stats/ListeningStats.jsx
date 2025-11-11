import { Clock, Book, Gauge, Flame, TrendingUp, Sun, Sunset, Moon, Coffee } from 'lucide-react';
import { getUserProgress } from '../../utils/badgeSystem';

export default function ListeningStats({ userId = 'user-me' }) {
  const progress = getUserProgress(userId);
  const stats = progress?.listeningStats || {
    totalHours: 0,
    booksCompleted: 0,
    averageSpeed: 1.0,
    streakDays: 0,
    longestStreak: 0,
    favoriteGenres: [],
    listeningTimes: { morning: 0, afternoon: 0, evening: 0, night: 0 }
  };

  const getPreferredTime = () => {
    const times = stats.listeningTimes;
    const max = Math.max(times.morning, times.afternoon, times.evening, times.night);
    
    if (times.morning === max) return { label: 'Morning', icon: Coffee, color: 'yellow' };
    if (times.afternoon === max) return { label: 'Afternoon', icon: Sun, color: 'orange' };
    if (times.evening === max) return { label: 'Evening', icon: Sunset, color: 'pink' };
    return { label: 'Night', icon: Moon, color: 'indigo' };
  };

  const preferredTime = getPreferredTime();
  const PreferredIcon = preferredTime.icon;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Listening Overview</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-700 font-semibold">Total Hours</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats.totalHours}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Book className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700 font-semibold">Completed</span>
            </div>
            <p className="text-3xl font-bold text-green-900">{stats.booksCompleted}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <Gauge className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-purple-700 font-semibold">Avg Speed</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">{stats.averageSpeed}x</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Flame className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-orange-700 font-semibold">Streak</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">{stats.streakDays}</p>
            <p className="text-xs text-orange-700 mt-1">Best: {stats.longestStreak} days</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <PreferredIcon className={`w-5 h-5 mr-2 text-${preferredTime.color}-600`} />
            Listening Patterns
          </h4>
          
          <div className="space-y-3">
            {[
              { label: 'Morning', value: stats.listeningTimes.morning, icon: Coffee, color: 'yellow' },
              { label: 'Afternoon', value: stats.listeningTimes.afternoon, icon: Sun, color: 'orange' },
              { label: 'Evening', value: stats.listeningTimes.evening, icon: Sunset, color: 'pink' },
              { label: 'Night', value: stats.listeningTimes.night, icon: Moon, color: 'indigo' }
            ].map((time) => {
              const TimeIcon = time.icon;
              const total = Object.values(stats.listeningTimes).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? (time.value / total) * 100 : 0;
              
              return (
                <div key={time.label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <TimeIcon className={`w-4 h-4 text-${time.color}-600`} />
                      <span className="text-sm text-gray-700">{time.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {time.value}h ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-${time.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`mt-4 p-3 bg-${preferredTime.color}-50 rounded-lg border border-${preferredTime.color}-200`}>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">You listen most in the {preferredTime.label.toLowerCase()}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Favorite Genres
          </h4>
          
          {stats.favoriteGenres.length > 0 ? (
            <div className="space-y-2">
              {stats.favoriteGenres.map((genre, index) => (
                <div
                  key={genre}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-900">{genre}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Listen to more books to discover your favorite genres
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

