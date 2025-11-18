import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Trophy, TrendingUp, UserPlus, Crown, Calendar, Star, Clock, Award, Sparkles } from 'lucide-react';
import SocialNudges from '../components/social/SocialNudges';
import BadgeDisplay from '../components/badges/BadgeDisplay';
import { Card } from '../components/ui';
import { getUserData, getFriends, getJoinedClubs } from '../utils/localStorage';
import usersData from '../data/users.json';
import clubsData from '../data/clubs.json';
import booksData from '../data/books.json';

const Social = () => {
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);
  const [stats, setStats] = useState({
    totalFriends: 0,
    clubsJoined: 0,
    booksShared: 0
  });

  useEffect(() => {
    const user = getUserData();
    setUserData(user);

    const friendIds = getFriends();
    const friendsList = usersData.filter(u => friendIds.includes(u.id));
    setFriends(friendsList);

    const joinedClubIds = getJoinedClubs();
    const featured = clubsData
      .filter(club => !joinedClubIds.includes(club.id))
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, 3);
    setFeaturedClubs(featured);

    setStats({
      totalFriends: friendsList.length,
      clubsJoined: joinedClubIds.length,
      booksShared: user.library?.length || 0
    });
  }, []);

  return (
    <div className="min-h-screen bg-audible-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
              <h1 className="text-4xl md:text-6xl font-bold font-serif">Social Hub</h1>
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover what your friends are reading, join book clubs, and share your literary journey
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.totalFriends}</p>
              <p className="text-sm text-white/80">Friends</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.clubsJoined}</p>
              <p className="text-sm text-white/80">Book Clubs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <BookOpen className="w-8 h-8 mx-auto mb-2" />
              <p className="text-3xl font-bold">{stats.booksShared}</p>
              <p className="text-sm text-white/80">Books Shared</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Friends Activity Feed */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-audible-text-primary flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                Friends Activity
              </h2>
              <Link
                to="/clubs/friends"
                className="text-audible-orange hover:text-audible-orange-dark font-semibold text-sm flex items-center gap-1"
              >
                View All
                <span>→</span>
              </Link>
            </div>

            <div className="space-y-4 mb-6">
              <SocialNudges limit={6} />
            </div>

            {/* Friends Reading Right Now */}
            {friends.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <h3 className="text-lg font-bold text-audible-text-primary mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Friends Reading Right Now
                </h3>
                <div className="space-y-3">
                  {friends.slice(0, 3).map((friend) => {
                    const currentBook = friend.currentlyReading
                      ? booksData.find(b => b.id === friend.currentlyReading)
                      : null;
                    
                    if (!currentBook) return null;

                    return (
                      <div key={friend.id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {friend.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          {friend.isPremium && (
                            <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-audible-text-primary">
                            {friend.name}
                          </p>
                          <Link
                            to={`/book/${currentBook.id}`}
                            className="text-xs text-audible-text-secondary hover:text-audible-orange truncate block"
                          >
                            {currentBook.title}
                          </Link>
                          {friend.currentProgress && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-1">
                                <div
                                  className="bg-green-500 h-1 rounded-full"
                                  style={{ width: `${friend.currentProgress}%` }}
                                />
                              </div>
                              <span className="text-xs text-audible-text-tertiary">{friend.currentProgress}%</span>
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/book/${currentBook.id}`}
                          className="flex-shrink-0"
                        >
                          <img
                            src={currentBook.cover}
                            alt={currentBook.title}
                            className="w-10 h-14 object-cover rounded shadow-sm hover:shadow-md transition-shadow"
                          />
                        </Link>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/clubs/friends"
                  className="block mt-4 text-center text-sm text-blue-700 hover:text-blue-800 font-semibold"
                >
                  View All Friends
                </Link>
              </Card>
            )}

            {/* No Friends CTA */}
            {friends.length === 0 && (
              <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                <Users className="w-16 h-16 mx-auto text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                  Find Your Reading Buddies
                </h3>
                <p className="text-audible-text-secondary mb-6">
                  Connect with friends to see what they're reading and share recommendations
                </p>
                <Link
                  to="/clubs/friends"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Find Friends
                </Link>
              </Card>
            )}
          </section>

          {/* Book Clubs Discovery */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-audible-text-primary flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                Featured Book Clubs
              </h2>
              <Link
                to="/clubs"
                className="text-audible-orange hover:text-audible-orange-dark font-semibold text-sm flex items-center gap-1"
              >
                Browse All
                <span>→</span>
              </Link>
            </div>

            <div className="space-y-4">
              {featuredClubs.map((club) => {
                const currentBook = booksData.find(b => b.id === club.currentBook);
                
                return (
                  <Link
                    key={club.id}
                    to={`/club/${club.id}`}
                    className="block group"
                  >
                    <Card className="p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300">
                      <div className="flex gap-4">
                        {currentBook && (
                          <img
                            src={currentBook.cover}
                            alt={currentBook.title}
                            className="w-20 h-28 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-xl font-bold text-audible-text-primary group-hover:text-purple-600 transition-colors">
                              {club.name}
                            </h3>
                            {club.isPremium && (
                              <span className="flex items-center gap-1 bg-audible-gold text-white px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                                <Crown className="w-3 h-3" />
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-audible-text-secondary mb-3">
                            Hosted by {club.host}
                          </p>
                          
                          {currentBook && (
                            <div className="bg-purple-50 rounded-lg p-3 mb-3">
                              <p className="text-xs text-purple-700 font-semibold mb-1">
                                Currently Reading:
                              </p>
                              <p className="text-sm font-bold text-purple-900 line-clamp-1">
                                {currentBook.title}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-audible-text-tertiary">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span className="font-semibold">
                                {club.memberCount.toLocaleString()} members
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-purple-500" />
                              <span className="font-semibold">
                                {club.daysRemaining} days left
                              </span>
                            </div>
                          </div>

                          {/* Perks Highlight */}
                          {club.perks && club.perks.length > 0 && (
                            <div className="mt-3 flex items-center gap-2">
                              <Award className="w-4 h-4 text-orange-500" />
                              <p className="text-xs text-audible-text-secondary line-clamp-1">
                                <span className="font-semibold text-orange-600">Perks:</span> {club.perks[0]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Join More Clubs CTA */}
            <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 mt-6">
              <Trophy className="w-16 h-16 mx-auto text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-audible-text-primary mb-2">
                Join a Book Club Today
              </h3>
              <p className="text-audible-text-secondary mb-6">
                Connect with thousands of readers, attend author events, and earn exclusive perks
              </p>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-colors"
              >
                <Users className="w-5 h-5" />
                Browse All Clubs
              </Link>
            </Card>
          </section>
        </div>

        {/* Badges Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-audible-text-primary flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              Your Achievements
            </h2>
            <Link
              to="/account"
              className="text-audible-orange hover:text-audible-orange-dark font-semibold text-sm flex items-center gap-1"
            >
              View All
              <span>→</span>
            </Link>
          </div>
          <BadgeDisplay 
            earnedBadges={userData?.badges || []} 
            showProgress={true}
          />
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-r from-orange-50 via-pink-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-orange-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-audible-text-primary mb-3">
              Why Go Social?
            </h2>
            <p className="text-lg text-audible-text-secondary">
              Enhance your audiobook experience with friends and community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-audible-text-primary mb-2">
                Discover Together
              </h3>
              <p className="text-sm text-audible-text-secondary">
                See what friends are reading and get personalized recommendations based on their ratings
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-audible-text-primary mb-2">
                Join the Conversation
              </h3>
              <p className="text-sm text-audible-text-secondary">
                Participate in book clubs with celebrity hosts, attend live author events, and discuss with fellow listeners
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-audible-text-primary mb-2">
                Earn Rewards
              </h3>
              <p className="text-sm text-audible-text-secondary">
                Unlock badges, get 2-for-1 credit deals, and access exclusive member-only content and perks
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Social;

