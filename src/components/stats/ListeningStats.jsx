import { Clock, BookOpen, TrendingUp, Award, Calendar, Flame } from 'lucide-react';
import { Card, Badge } from '../ui';
import PropTypes from 'prop-types';

const ListeningStats = ({ stats }) => {
  const {
    hoursListened = 0,
    booksFinished = 0,
    currentStreak = 0,
    longestStreak = 0,
    favoriteGenre = 'Not set',
    averageRating = 0,
    thisMonthHours = 0,
    thisYearBooks = 0,
  } = stats || {};
  
  const statCards = [
    {
      icon: Clock,
      label: 'Hours Listened',
      value: hoursListened.toLocaleString(),
      subtext: `${thisMonthHours}h this month`,
      color: 'text-echo-orange',
      bgColor: 'bg-echo-orange/10',
    },
    {
      icon: BookOpen,
      label: 'Books Finished',
      value: booksFinished.toLocaleString(),
      subtext: `${thisYearBooks} this year`,
      color: 'text-echo-success',
      bgColor: 'bg-echo-success/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${currentStreak} days`,
      subtext: `Longest: ${longestStreak} days`,
      color: 'text-echo-error',
      bgColor: 'bg-echo-error/10',
    },
    {
      icon: TrendingUp,
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      subtext: 'Your ratings',
      color: 'text-echo-info',
      bgColor: 'bg-echo-info/10',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-start">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-echo-text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-echo-text-secondary mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-echo-text-tertiary">
                  {stat.subtext}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Listening Activity Chart Placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-echo-text-primary">
            Listening Activity
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm rounded-lg bg-echo-orange text-white">
              Week
            </button>
            <button className="px-3 py-1 text-sm rounded-lg text-echo-text-secondary hover:bg-echo-beige">
              Month
            </button>
            <button className="px-3 py-1 text-sm rounded-lg text-echo-text-secondary hover:bg-echo-beige">
              Year
            </button>
          </div>
        </div>
        
        {/* Simple bar chart visualization */}
        <div className="h-48 flex items-end justify-between gap-2">
          {[3.2, 4.5, 2.8, 5.1, 4.2, 6.3, 5.8].map((hours, index) => {
            const height = (hours / 7) * 100;
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-echo-beige rounded-t-lg relative" style={{ height: `${height}%`, minHeight: '20px' }}>
                  <div 
                    className="absolute inset-0 bg-echo-orange rounded-t-lg transition-all hover:bg-echo-orange-dark"
                    title={`${hours}h`}
                  />
                </div>
                <div className="text-xs text-echo-text-tertiary">
                  {days[index]}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Genre Breakdown */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-echo-text-primary">
            Top Genres
          </h3>
          <p className="text-sm text-echo-text-secondary">
            Favorite genre: <span className="font-semibold text-echo-text-primary">{favoriteGenre}</span>
          </p>
        </div>
        <div className="space-y-3">
          {[
            { genre: 'Science Fiction', count: 23, percentage: 35 },
            { genre: 'Fantasy', count: 18, percentage: 28 },
            { genre: 'Mystery', count: 12, percentage: 18 },
            { genre: 'Self Development', count: 8, percentage: 12 },
            { genre: 'Other', count: 4, percentage: 7 },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-echo-text-primary">
                  {item.genre}
                </span>
                <span className="text-sm text-echo-text-tertiary">
                  {item.count} books ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 bg-echo-beige rounded-full overflow-hidden">
                <div 
                  className="h-full bg-echo-orange rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Reading Goals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-echo-text-primary">
            2025 Reading Goal
          </h3>
          <Badge variant="success">On Track</Badge>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-echo-text-secondary">
                Books Goal: {thisYearBooks} / 50
              </span>
              <span className="text-sm font-medium text-echo-orange">
                {Math.round((thisYearBooks / 50) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-echo-beige rounded-full overflow-hidden">
              <div 
                className="h-full bg-echo-orange rounded-full transition-all"
                style={{ width: `${Math.min((thisYearBooks / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-echo-text-tertiary">
            You're {thisYearBooks >= 50 / 12 * (new Date().getMonth() + 1) ? 'ahead of' : 'behind'} schedule. 
            Keep it up!
          </p>
        </div>
      </Card>
    </div>
  );
};

ListeningStats.propTypes = {
  stats: PropTypes.shape({
    hoursListened: PropTypes.number,
    booksFinished: PropTypes.number,
    currentStreak: PropTypes.number,
    longestStreak: PropTypes.number,
    favoriteGenre: PropTypes.string,
    averageRating: PropTypes.number,
    thisMonthHours: PropTypes.number,
    thisYearBooks: PropTypes.number,
  }),
};

export default ListeningStats;
