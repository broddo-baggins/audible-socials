import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  BookOpen, 
  Calendar, 
  Sparkles, 
  TrendingUp,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  Star
} from 'lucide-react';
import clubMilestonesData from '../../data/clubMilestones.json';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';

export default function ClubTimeline({ clubId }) {
  const [milestones, setMilestones] = useState([]);
  const [clubStats, setClubStats] = useState(null);
  const [upcomingMilestones, setUpcomingMilestones] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const clubData = clubMilestonesData.find(c => c.clubId === clubId);
    if (clubData) {
      setMilestones(clubData.milestones || []);
      setClubStats(clubData.stats || null);
      setUpcomingMilestones(clubData.upcomingMilestones || []);
    }
  }, [clubId]);

  const getMilestoneIcon = (type) => {
    switch (type) {
      case 'club_founded':
        return <Sparkles className="w-6 h-6" />;
      case 'member_milestone':
        return <Users className="w-6 h-6" />;
      case 'event':
        return <Calendar className="w-6 h-6" />;
      case 'book_completion':
        return <BookOpen className="w-6 h-6" />;
      case 'member_achievement':
        return <Award className="w-6 h-6" />;
      case 'anniversary':
        return <Trophy className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getMilestoneColor = (type) => {
    switch (type) {
      case 'club_founded':
        return 'from-purple-500 to-pink-500';
      case 'member_milestone':
        return 'from-blue-500 to-cyan-500';
      case 'event':
        return 'from-green-500 to-emerald-500';
      case 'book_completion':
        return 'from-orange-500 to-yellow-500';
      case 'member_achievement':
        return 'from-indigo-500 to-purple-500';
      case 'anniversary':
        return 'from-pink-500 to-rose-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getParticipantNames = (participantIds) => {
    if (!participantIds || participantIds.length === 0) return null;
    
    const names = participantIds.map(id => {
      const user = usersData.find(u => u.id === id);
      return user ? user.name : 'Unknown';
    });

    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;
    if (names.length === 3) return `${names[0]}, ${names[1]}, and ${names[2]}`;
    return `${names[0]}, ${names[1]}, and ${names.length - 2} others`;
  };

  // Filter milestones
  const filteredMilestones = milestones.filter(milestone => {
    if (activeFilter === 'all') return true;
    return milestone.type === activeFilter;
  });

  // Sort by most recent first
  const sortedMilestones = [...filteredMilestones].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="space-y-6">
      {/* Club Stats Overview */}
      {clubStats && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
            Club Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <BookOpen className="w-8 h-8 mx-auto text-orange-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{clubStats.totalBooks}</p>
              <p className="text-xs text-gray-600">Books Read</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <Calendar className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{clubStats.totalEvents}</p>
              <p className="text-xs text-gray-600">Events Held</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{clubStats.totalDiscussions}</p>
              <p className="text-xs text-gray-600">Discussions</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <CheckCircle2 className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{clubStats.averageCompletion}%</p>
              <p className="text-xs text-gray-600">Avg Completion</p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Milestones */}
      {upcomingMilestones && upcomingMilestones.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Target className="w-6 h-6 mr-2 text-audible-orange" />
            Upcoming Milestones
          </h3>
          <div className="space-y-4">
            {upcomingMilestones.map((milestone, index) => {
              const progress = (milestone.currentProgress / milestone.target) * 100;
              
              return (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{milestone.title}</h4>
                    <span className="text-sm font-semibold text-gray-600">
                      {milestone.currentProgress.toLocaleString()} / {milestone.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-audible-orange to-yellow-500 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{Math.round(progress)}% complete</span>
                    {milestone.estimatedDate && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Est. {new Date(milestone.estimatedDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('event')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center space-x-1 ${
              activeFilter === 'event'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Events</span>
          </button>
          <button
            onClick={() => setActiveFilter('book_completion')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center space-x-1 ${
              activeFilter === 'book_completion'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Books</span>
          </button>
          <button
            onClick={() => setActiveFilter('member_achievement')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center space-x-1 ${
              activeFilter === 'member_achievement'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Achievements</span>
          </button>
          <button
            onClick={() => setActiveFilter('member_milestone')}
            className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center space-x-1 ${
              activeFilter === 'member_milestone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Members</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-audible-gold" />
          Club Timeline
        </h3>

        {sortedMilestones.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No milestones to display</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-blue-300 to-transparent" />

            {/* Milestones */}
            <div className="space-y-6">
              {sortedMilestones.map((milestone) => (
                <div key={milestone.id} className="relative pl-20">
                  {/* Timeline Icon */}
                  <div className={`absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br ${getMilestoneColor(milestone.type)} flex items-center justify-center text-white shadow-lg`}>
                    {getMilestoneIcon(milestone.type)}
                  </div>

                  {/* Milestone Content */}
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-5 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-lg text-gray-900">{milestone.title}</h4>
                      <span className="text-xs text-gray-500 font-semibold whitespace-nowrap ml-4">
                        {formatDate(milestone.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{milestone.description}</p>

                    {/* Participants */}
                    {milestone.participants && milestone.participants.length > 0 && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-600">
                          {getParticipantNames(milestone.participants)}
                        </span>
                      </div>
                    )}

                    {/* Metadata */}
                    {milestone.metadata && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                        {milestone.metadata.attendeeCount && (
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                            {milestone.metadata.attendeeCount.toLocaleString()} attendees
                          </span>
                        )}
                        {milestone.metadata.completionRate && (
                          <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                            {milestone.metadata.completionRate}% completion
                          </span>
                        )}
                        {milestone.metadata.badgeEarned && (
                          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>Badge Earned</span>
                          </span>
                        )}
                        {milestone.metadata.daysEarly && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{milestone.metadata.daysEarly} days early</span>
                          </span>
                        )}
                        {milestone.metadata.memberCount && (
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                            {milestone.metadata.memberCount.toLocaleString()} members
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Most Active Members */}
      {clubStats && clubStats.mostActiveMembers && clubStats.mostActiveMembers.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-6 h-6 mr-2 text-audible-gold" />
            Most Active Members
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clubStats.mostActiveMembers.slice(0, 3).map((userId, index) => {
              const user = usersData.find(u => u.id === userId);
              if (!user) return null;

              return (
                <div key={userId} className="bg-white rounded-lg p-4 flex items-center space-x-3 shadow-sm">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-audible-orange to-audible-orange-dark rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-audible-gold rounded-full p-1">
                        <Trophy className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">
                      {user.stats?.booksCompleted || 0} books completed
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

