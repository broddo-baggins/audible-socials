import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Plus, Check, Star, Clock, Users, Share2, Heart, Crown } from 'lucide-react';
import booksData from '../data/books.json';
import clubsData from '../data/clubs.json';
import usersData from '../data/users.json';
import { getUserData, addToLibrary, useCredit, rateBook, setCurrentlyReading, getFriends } from '../utils/localStorage';
import { fetchGoogleImagesCover } from '../utils/googleImages';
import FriendRatingsOnBook from '../components/social/FriendRatingsOnBook';

export default function BookDetailPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [relatedClubs, setRelatedClubs] = useState([]);
  const [userData, setUserData] = useState(null);
  const [inLibrary, setInLibrary] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [showRating, setShowRating] = useState(false);
  const [friendsReading, setFriendsReading] = useState([]);

  useEffect(() => {
    const foundBook = booksData.find(b => b.id === bookId);
    setBook(foundBook);

    if (foundBook) {
      // Load cover
      fetchGoogleImagesCover(foundBook.id, foundBook.coverQuery, foundBook.genre)
        .then(cover => setCoverUrl(cover));

      // Find related clubs
      const clubs = clubsData.filter(club => foundBook.clubs?.includes(club.id));
      setRelatedClubs(clubs);

      // Get user data
      const user = getUserData();
      setUserData(user);
      setInLibrary(user.library.includes(bookId));

      // Find friends reading this book
      const friendIds = getFriends();
      const friends = usersData.filter(u => 
        friendIds.includes(u.id) && u.library.includes(bookId)
      );
      setFriendsReading(friends);
    }
  }, [bookId]);

  const handleAddToLibrary = () => {
    const result = useCredit();
    if (result.success) {
      addToLibrary(bookId);
      setInLibrary(true);
      setUserData(getUserData());
    } else {
      alert('You need credits to add this book to your library');
    }
  };

  const handleStartListening = () => {
    if (!inLibrary) {
      handleAddToLibrary();
    }
    setCurrentlyReading(bookId);
    // In a real app, this would navigate to the player
    alert('Starting audiobook...');
  };

  const handleRateBook = (rating) => {
    rateBook(bookId, rating);
    setUserData(getUserData());
    setShowRating(false);
  };

  if (!book) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const userRating = userData?.ratings[bookId];
  const isCurrentlyReading = userData?.currentlyReading === bookId;
  const clubDiscount = relatedClubs.length > 0 && userData?.joinedClubs.some(id => relatedClubs.map(c => c.id).includes(id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-audible-navy to-audible-navy-light text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-center md:justify-start"
            >
              <div className="relative">
                <img
                  src={coverUrl || 'https://via.placeholder.com/400x600'}
                  alt={book.title}
                  className="w-64 md:w-80 rounded-lg shadow-2xl"
                />
                {isCurrentlyReading && (
                  <div className="absolute top-4 left-4 bg-audible-orange text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Currently Reading
                  </div>
                )}
              </div>
            </motion.div>

            {/* Book Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <span className="text-audible-orange font-semibold text-sm">{book.genre}</span>
                <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-3 font-serif">{book.title}</h1>
                <p className="text-xl text-white/90">By {book.author}</p>
                <p className="text-white/80">Narrated by {book.narrator}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">{book.rating}</span>
                  <span className="text-white/70">({book.ratingsCount.toLocaleString()} ratings)</span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center space-x-2 text-white/80">
                <Clock className="w-5 h-5" />
                <span>{book.duration}</span>
              </div>

              {/* Credits Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/90">Price:</span>
                  <div className="flex items-center space-x-2">
                    {clubDiscount && (
                      <span className="text-white/60 line-through">${book.price}</span>
                    )}
                    <span className="text-2xl font-bold text-audible-orange">
                      1 Credit{clubDiscount && ' (2-for-1)'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Your credits:</span>
                  <span className="font-semibold">{userData?.credits} available</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {inLibrary ? (
                  <>
                    <button
                      onClick={handleStartListening}
                      className="flex-1 bg-audible-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-audible-orange-dark transition-colors flex items-center justify-center space-x-2"
                    >
                      <Play className="w-6 h-6" />
                      <span>{isCurrentlyReading ? 'Continue' : 'Start'} Listening</span>
                    </button>
                    <button className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddToLibrary}
                      disabled={userData?.credits === 0}
                      className="flex-1 bg-audible-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-audible-orange-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Add to Library (1 Credit)</span>
                    </button>
                    <button className="px-6 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/20 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Extended Preview for Club Members */}
              {relatedClubs.length > 0 && userData?.joinedClubs.some(id => relatedClubs.map(c => c.id).includes(id)) && (
                <div className="bg-purple-600/30 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30">
                  <p className="text-sm font-semibold mb-2 flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Book Club Member Benefit
                  </p>
                  <p className="text-sm text-white/80">
                    Get 30 minutes of extended preview (vs 5 minutes)
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Description */}
          <div className="md:col-span-2 space-y-8">
            {/* Publisher's Summary */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Publisher's Summary</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </section>

            {/* Friend Ratings */}
            <FriendRatingsOnBook bookId={bookId} />

            {/* Related Book Clubs */}
            {relatedClubs.length > 0 && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Clubs Reading This</h2>
                <div className="space-y-4">
                  {relatedClubs.map((club) => (
                    <Link
                      key={club.id}
                      to={`/club/${club.id}`}
                      className="block p-4 border-2 border-gray-200 rounded-lg hover:border-audible-orange hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-bold text-gray-900">{club.name}</h3>
                            {club.isPremium && (
                              <span className="bg-audible-gold text-white text-xs font-semibold px-2 py-0.5 rounded-full flex items-center">
                                <Crown className="w-3 h-3 mr-1" />
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Hosted by {club.host}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-audible-orange font-semibold text-sm">
                            {club.daysRemaining} days left
                          </p>
                          <p className="text-gray-500 text-xs">{club.memberCount.toLocaleString()} members</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* User Rating */}
            {inLibrary && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rating</h2>
                {userRating ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          className={`w-8 h-8 ${
                            rating <= userRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setShowRating(true)}
                      className="text-audible-orange font-semibold hover:text-audible-orange-dark"
                    >
                      Change Rating
                    </button>
                  </div>
                ) : (
                  <div>
                    {showRating ? (
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleRateBook(rating)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star className="w-10 h-10 text-gray-300 hover:text-yellow-400 hover:fill-yellow-400" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRating(true)}
                        className="bg-audible-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors"
                      >
                        Rate This Book
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Social */}
          <div className="space-y-6">
            {/* Friends Reading This */}
            {friendsReading.length > 0 && (
              <section className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-audible-orange" />
                  Friends Reading This
                </h3>
                <div className="space-y-3">
                  {friendsReading.map((friend) => (
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
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{friend.name}</p>
                        {friend.ratings[bookId] && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600">{friend.ratings[bookId]}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Book Details */}
            <section className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Release Date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(book.releaseDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{book.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Genre</span>
                  <span className="font-semibold text-gray-900">{book.genre}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

