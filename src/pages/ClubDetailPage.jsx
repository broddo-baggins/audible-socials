import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Users, Calendar, Clock, Crown, Gift, Award, Check, X, Star, TrendingUp, BookOpen } from 'lucide-react';
import clubsData from '../data/clubs.json';
import booksData from '../data/books.json';
import usersData from '../data/users.json';
import { getUserData, joinClub, leaveClub, getJoinedClubs, getFriends } from '../utils/localStorage';
import { fetchGoogleImagesCover } from '../utils/googleImages';
import EventRSVP from '../components/events/EventRSVP';
import ClubTimeline from '../components/clubs/ClubTimeline';

export default function ClubDetailPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState(null);
  const [currentBook, setCurrentBook] = useState(null);
  const [previousBooks, setPreviousBooks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [friendsInClub, setFriendsInClub] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

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
    // Check if user owns the current book
    const userLibrary = userData?.library || [];
    if (!userLibrary.includes(club.currentBook)) {
      alert(`You must own "${currentBook?.title}" to join this book club. Purchase the book first to participate in discussions.`);
      return;
    }

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

  const handlePurchaseBook = () => {
    // Mock purchase - add book to user's library
    const currentUser = getUserData();
    if (!currentUser.library.includes(club.currentBook)) {
      currentUser.library.push(club.currentBook);
      localStorage.setItem('userData', JSON.stringify(currentUser));
      
      // Deduct credit
      if (currentUser.credits > 0) {
        currentUser.credits -= 1;
        localStorage.setItem('userData', JSON.stringify(currentUser));
      }
      
      setPurchaseSuccess(true);
      setUserData(currentUser);
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setShowPurchaseModal(false);
        setPurchaseSuccess(false);
      }, 2000);
    }
  };

  if (!club || !currentBook) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const maxClubs = userData?.isPremium ? 3 : 2;
  const userLibrary = userData?.library || [];
  const ownsCurrentBook = userLibrary.includes(club.currentBook);
  const canJoin = !isMember && (!club.isPremium || userData?.isPremium) && ownsCurrentBook;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <Motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center md:justify-start"
            >
              <img
                src={coverUrl || 'https://via.placeholder.com/400x600'}
                alt={currentBook.title}
                className="w-64 md:w-80 rounded-lg shadow-2xl"
              />
            </Motion.div>

            {/* Club Info */}
            <Motion.div
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
                  {/* Ownership Requirement */}
                  {!ownsCurrentBook && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-orange-300/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white mb-1">Book Ownership Required</h4>
                          <p className="text-sm text-white/90 mb-3">
                            You must own "{currentBook?.title}" to join this book club and participate in discussions.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowPurchaseModal(true)}
                              className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors text-sm"
                            >
                              Get the Book
                            </button>
                            <Link
                              to={`/book/${currentBook?.id}`}
                              className="inline-block bg-white/20 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition-colors text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                  ) : !ownsCurrentBook ? null : canJoin ? (
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
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-4 border-b-2 font-semibold transition-colors flex items-center space-x-2 ${
                activeTab === 'timeline'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Timeline & Milestones</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {activeTab === 'overview' ? (
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
        ) : (
          <div className="space-y-6">
            <ClubTimeline clubId={clubId} />
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && currentBook && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => !purchaseSuccess && setShowPurchaseModal(false)}>
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {!purchaseSuccess ? (
              <>
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Get This Book</h2>
                  <p className="text-white/90">Join {club.name} and start reading today</p>
                </div>

                <div className="p-6">
                  <div className="flex gap-6 mb-6">
                    <img
                      src={coverUrl || currentBook.cover}
                      alt={currentBook.title}
                      className="w-32 h-48 object-cover rounded-lg shadow-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentBook.title}</h3>
                      <p className="text-lg text-gray-600 mb-3">By {currentBook.author}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{currentBook.rating}</span>
                        <span className="text-gray-500">({currentBook.ratingsCount.toLocaleString()} ratings)</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {currentBook.duration}
                      </p>
                    </div>
                  </div>

                  {/* Club Bundle Offer */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-2 border-purple-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-purple-900 mb-1">Book Club Bundle</h4>
                        <p className="text-sm text-purple-800 mb-2">
                          Get this book and automatically join {club.name}
                        </p>
                        <ul className="space-y-1 text-xs text-purple-700">
                          {club.perks.slice(0, 3).map((perk, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="w-4 h-4 mr-1 flex-shrink-0 text-green-600" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700">Book Price</span>
                      <span className="text-gray-900 font-semibold">1 Credit</span>
                    </div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Club Membership</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">1 Credit</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      You have {userData?.credits || 0} credit{userData?.credits !== 1 ? 's' : ''} available
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPurchaseModal(false)}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePurchaseBook}
                      disabled={!userData?.credits || userData.credits < 1}
                      className="flex-1 px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {userData?.credits && userData.credits >= 1 ? 'Get Book & Join Club' : 'Not Enough Credits'}
                    </button>
                  </div>

                  {(!userData?.credits || userData.credits < 1) && (
                    <p className="text-center text-sm text-red-600 mt-3">
                      You need at least 1 credit to purchase this book. <Link to="/account" className="underline">Get more credits</Link>
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <Motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Check className="w-12 h-12 text-white" />
                </Motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                <p className="text-lg text-gray-600 mb-4">
                  "{currentBook.title}" has been added to your library
                </p>
                <p className="text-sm text-gray-500">
                  You can now join {club.name} and start reading
                </p>
              </div>
            )}
          </Motion.div>
        </div>
      )}
    </div>
  );
}
