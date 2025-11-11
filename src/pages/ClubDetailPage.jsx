import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, Crown, Gift, Award, Check, X, Star } from 'lucide-react';
import clubsData from '../data/clubs.json';
import booksData from '../data/books.json';
import usersData from '../data/users.json';
import { getUserData, joinClub, leaveClub, getJoinedClubs, getFriends } from '../utils/localStorage';
import { fetchGoogleImagesCover } from '../utils/googleImages';
import EventRSVP from '../components/events/EventRSVP';

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const [previousBooks, setPreviousBooks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [friendsInClub, setFriendsInClub] = useState([]);

  useEffect(() => {
    const foundClub = clubsData.find(c => c.id === clubId);
    setClub(foundClub);

    if (foundClub) {
      // Get current book
      const current = booksData.find(b => b.id === foundClub.currentBook);
      setCurrentBook(current);
      
      if (current) {
        fetchGoogleImagesCover(current.id, current.coverQuery, current.genre)
          .then(cover => setCoverUrl(cover));
      }

      // Get previous books
      const previous = foundClub.previousBooks
        .map(id => booksData.find(b => b.id === id))
        .filter(Boolean);
      setPreviousBooks(previous);

      // Get user data
      const user = getUserData();
      setUserData(user);
      setIsMember(getJoinedClubs().includes(clubId));

      // Find friends in this club
      const friendIds = getFriends();
      const friends = usersData.filter(u => 
        friendIds.includes(u.id) && u.joinedClubs.includes(clubId)
      );
      setFriendsInClub(friends);
    }
  }, [clubId]);

  const handleJoinClub = () => {
    const result = joinClub(clubId);
    if (result.success) {
      setIsMember(true);
      setUserData(getUserData());
    } else {
      alert(result.error);
    }
  };

  const handleLeaveClub = () => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      leaveClub(clubId);
      setIsMember(false);
      setUserData(getUserData());
    }
  };

  if (!club || !currentBook) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const maxClubs = userData?.isPremium ? 3 : 2;
  const canJoin = !isMember && (!club.isPremium || userData?.isPremium);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center md:justify-start"
            >
              <img
                src={coverUrl || 'https://via.placeholder.com/400x600'}
                alt={currentBook.title}
                className="w-64 md:w-80 rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Club Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                {club.isPremium && (
                  <span className="bg-audible-gold text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    Premium Club
                  </span>
                )}
                {isMember && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Member
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold font-serif">{club.name}</h1>
              <p className="text-xl text-white/90">Hosted by {club.host}</p>
              
              <p className="text-white/80 leading-relaxed">{club.description}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 py-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{club.memberCount.toLocaleString()}</p>
                    <p className="text-sm text-white/70">Members</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{club.daysRemaining}</p>
                    <p className="text-sm text-white/70">Days Left</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-6 h-6" />
                  <div>
                    <p className="text-2xl font-bold">{club.meetingsPerMonth}</p>
                    <p className="text-sm text-white/70">Meetings/Month</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {isMember ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={`/book/${currentBook.id}`}
                    className="flex-1 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg text-center hover:bg-gray-100 transition-colors"
                  >
                    View Current Book
                  </Link>
                  <button
                    onClick={handleLeaveClub}
                    className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Leave Club</span>
                  </button>
                </div>
              ) : (
                <div>
                  {club.isPremium && !userData?.isPremium ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                      <p className="text-sm text-white/90 mb-2">
                        This is a premium-only club. Upgrade to access exclusive content and events.
                      </p>
                      <Link
                        to="/profile"
                        className="inline-block bg-audible-gold text-white px-6 py-2 rounded-full font-semibold hover:bg-yellow-600 transition-colors"
                      >
                        Upgrade to Premium
                      </Link>
                    </div>
                  ) : canJoin ? (
                    <button
                      onClick={handleJoinClub}
                      className="w-full bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
                    >
                      Join This Club
                    </button>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-sm text-white/90">
                        You've reached your club limit ({maxClubs} clubs). Leave a club to join this one.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Current Book & Events */}
          <div className="md:col-span-2 space-y-8">
            {/* Current Book */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Currently Reading</h2>
              <Link to={`/book/${currentBook.id}`} className="block group">
                <div className="flex items-start space-x-4">
                  <img
                    src={coverUrl || 'https://via.placeholder.com/200x300'}
                    alt={currentBook.title}
                    className="w-24 h-36 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-audible-orange transition-colors">
                      {currentBook.title}
                    </h3>
                    <p className="text-gray-600 mb-2">By {currentBook.author}</p>
                    <p className="text-sm text-gray-700 line-clamp-3 mb-3">{currentBook.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-semibold">{currentBook.rating}</span>
                      </div>
                      <span className="text-gray-500">{currentBook.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>

            {/* Upcoming Events */}
            {club.events && club.events.length > 0 && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                  Upcoming Events
                </h2>
                <div className="space-y-4">
                  {club.events.map((event) => (
                    <EventRSVP key={event.id} event={event} clubId={clubId} />
                  ))}
                </div>
              </section>
            )}

            {/* Club Perks */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Gift className="w-6 h-6 mr-2 text-audible-orange" />
                Member Benefits
              </h2>
              <ul className="space-y-3">
                {club.perks.map((perk, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{perk}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Previous Books */}
            {previousBooks.length > 0 && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Previously Read</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {previousBooks.map((book) => (
                    <Link key={book.id} to={`/book/${book.id}`} className="group">
                      <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-all">
                        <img
                          src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop&sig=${book.id}`}
                          alt={book.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-600">{book.author}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Social */}
          <div className="space-y-6">
            {/* Friends in Club */}
            {friendsInClub.length > 0 && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-purple-600" />
                  Friends in This Club
                </h3>
                <div className="space-y-3">
                  {friendsInClub.map((friend) => (
                    <div key={friend.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {friend.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {friend.isPremium && (
                          <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{friend.name}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Club Stats */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Club Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Host Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{club.hostType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeframe</span>
                  <span className="font-semibold text-gray-900 capitalize">{club.timeframe}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{club.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Books Read</span>
                  <span className="font-semibold text-gray-900">{previousBooks.length + 1}</span>
                </div>
              </div>
            </section>

            {/* Achievements */}
            {isMember && (
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-audible-gold" />
                  Your Progress
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Complete books and participate to earn badges and unlock rewards
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-sm text-gray-700">Books Completed</span>
                    <span className="text-sm font-bold text-purple-600">0 / 1</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded">
                    <span className="text-sm text-gray-700">Events Attended</span>
                    <span className="text-sm font-bold text-purple-600">0 / {club.events?.length || 0}</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

