import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Star,
  MessageCircle,
  UserPlus,
  Calendar,
  Award,
  Target
} from 'lucide-react';
import { Card } from '../ui';
import { getUserData, getFriends } from '../../utils/localStorage';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';

const SocialDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [stats, setStats] = useState({
    totalFriends: 0,
    booksCompleted: 0,
    hoursListened: 0,
    clubsJoined: 0,
    averageRating: 0,
    streakDays: 0
  });

  useEffect(() => {
    const user = getUserData();
    setUserData(user);

    const friendIds = getFriends();
    const friendsList = usersData.filter(u => friendIds.includes(u.id));
    setFriends(friendsList);

    // Calculate stats
    const ratings = Object.values(user.ratings || {});
    const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;

    setStats({
      totalFriends: friendsList.length,
      booksCompleted: user.library?.length || 0,
      hoursListened: user.hoursListened || 0,
      clubsJoined: user.joinedClubs?.length || 0,
      averageRating: avgRating,
      streakDays: user.streakDays || 0
    });
  }, []);

  const StatCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
    const Icon = icon;
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}-600`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </Card>
    );
  };

  const RecentActivity = () => {
    const activities = [
      { type: 'completed', book: 'The Three-Body Problem', daysAgo: 2, rating: 5 },
      { type: 'joined', club: 'Sci-Fi Sundays', daysAgo: 5 },
      { type: 'friend', friend: 'Sarah Chen', daysAgo: 7 },
    ];

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                {activity.type === 'completed' && <BookOpen className="w-4 h-4 text-purple-600" />}
                {activity.type === 'joined' && <Users className="w-4 h-4 text-purple-600" />}
                {activity.type === 'friend' && <UserPlus className="w-4 h-4 text-purple-600" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {activity.type === 'completed' && `Completed "${activity.book}"`}
                  {activity.type === 'joined' && `Joined "${activity.club}"`}
                  {activity.type === 'friend' && `Connected with ${activity.friend}`}
                </p>
                <p className="text-xs text-gray-500">{activity.daysAgo} days ago</p>
              </div>
              {activity.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{activity.rating}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const FriendProgress = () => {
    const friendProgress = friends.slice(0, 3).map(friend => ({
      ...friend,
      progress: friend.currentProgress || Math.floor(Math.random() * 100),
      book: booksData.find(b => b.id === friend.currentlyReading) || booksData[0]
    }));

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" />
          Friends' Progress
        </h3>
        <div className="space-y-4">
          {friendProgress.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {friend.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{friend.name}</p>
                <p className="text-xs text-gray-600 truncate">{friend.book?.title || 'Unknown Book'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${friend.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{friend.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {friends.length > 3 && (
          <Link
            to="/clubs/friends"
            className="block mt-4 text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            View all friends
          </Link>
        )}
      </Card>
    );
  };

  const Achievements = () => {
    const achievements = [
      { icon: Trophy, title: 'First Book Club', description: 'Joined your first book club', unlocked: stats.clubsJoined > 0 },
      { icon: Star, title: 'Book Lover', description: 'Completed 10 books', unlocked: stats.booksCompleted >= 10 },
      { icon: Users, title: 'Social Butterfly', description: 'Made 5 friends', unlocked: stats.totalFriends >= 5 },
      { icon: Award, title: 'High Scorer', description: 'Average rating above 4.5', unlocked: stats.averageRating >= 4.5 },
    ];

    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 ${
                achievement.unlocked
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <achievement.icon
                className={`w-6 h-6 mb-2 ${
                  achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                }`}
              />
              <p className={`text-sm font-medium ${
                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {achievement.title}
              </p>
              <p className={`text-xs ${
                achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  if (!userData) return null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          title="Friends"
          value={stats.totalFriends}
          color="blue"
        />
        <StatCard
          icon={BookOpen}
          title="Books Completed"
          value={stats.booksCompleted}
          color="green"
        />
        <StatCard
          icon={Clock}
          title="Hours Listened"
          value={stats.hoursListened}
          subtitle="total listening time"
          color="purple"
        />
        <StatCard
          icon={Trophy}
          title="Book Clubs"
          value={stats.clubsJoined}
          color="orange"
        />
        <StatCard
          icon={Star}
          title="Avg Rating"
          value={stats.averageRating}
          color="yellow"
        />
        <StatCard
          icon={Target}
          title="Reading Streak"
          value={`${stats.streakDays} days`}
          color="red"
        />
      </div>

      {/* Activity and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <FriendProgress />
      </div>

      {/* Achievements */}
      <Achievements />

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/clubs/friends"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserPlus className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Find Friends</span>
          </Link>
          <Link
            to="/clubs"
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Join Clubs</span>
          </Link>
          <Link
            to="/browse?sort=trending"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-900">Discover</span>
          </Link>
          <Link
            to="/account"
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Award className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Profile</span>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SocialDashboard;
