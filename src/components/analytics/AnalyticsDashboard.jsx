import { useMemo } from 'react';
import { BarChart2, Clock, Book, TrendingUp, Award, Headphones } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * AnalyticsDashboard Component
 * Displays reading statistics and analytics
 */
const AnalyticsDashboard = ({ userData, readingHistory = [] }) => {
  const stats = useMemo(() => {
    const totalBooks = readingHistory.length;
    const totalHours = readingHistory.reduce((sum, book) => sum + (book.hoursListened || 0), 0);
    const averageRating = totalBooks > 0
      ? readingHistory.reduce((sum, book) => sum + (book.rating || 0), 0) / totalBooks
      : 0;
    
    const genreCount = {};
    readingHistory.forEach(book => {
      book.genres?.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });
    
    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalBooks,
      totalHours: Math.round(totalHours),
      averageRating: averageRating.toFixed(1),
      topGenres,
      booksThisMonth: readingHistory.filter(book => {
        const bookDate = new Date(book.completedDate);
        const now = new Date();
        return bookDate.getMonth() === now.getMonth() && bookDate.getFullYear() === now.getFullYear();
      }).length
    };
  }, [readingHistory]);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Reading Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Book} label="Books Completed" value={stats.totalBooks} color="bg-blue-500" />
        <StatCard icon={Clock} label="Hours Listened" value={stats.totalHours} color="bg-green-500" />
        <StatCard icon={Award} label="Average Rating" value={stats.averageRating} color="bg-yellow-500" />
        <StatCard icon={TrendingUp} label="This Month" value={stats.booksThisMonth} color="bg-purple-500" />
        <StatCard icon={Headphones} label="Avg Hours/Book" value={stats.totalBooks > 0 ? Math.round(stats.totalHours / stats.totalBooks) : 0} color="bg-indigo-500" />
        <StatCard icon={BarChart2} label="Top Genres" value={stats.topGenres.length} color="bg-pink-500" />
      </div>

      {stats.topGenres.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Favorite Genres</h3>
          <div className="space-y-3">
            {stats.topGenres.map(([genre, count]) => (
              <div key={genre}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{genre}</span>
                  <span className="text-sm text-gray-600">{count} books</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / stats.totalBooks) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AnalyticsDashboard.propTypes = {
  userData: PropTypes.object,
  readingHistory: PropTypes.array
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired
};

export default AnalyticsDashboard;

