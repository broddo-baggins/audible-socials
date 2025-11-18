import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Star, Clock, TrendingUp, Share2, ArrowLeft, Crown, Users, ChevronDown, Heart, MessageCircle, Filter } from 'lucide-react';
import usersData from '../data/users.json';
import booksData from '../data/books.json';
import clubsData from '../data/clubs.json';
import shareHistoryData from '../data/shareHistory.json';
import { getFriends } from '../utils/localStorage';

export default function FriendLibrary() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [friendBooks, setFriendBooks] = useState([]);
  const [shareHistory, setShareHistory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    // Find the friend
    const foundFriend = usersData.find(u => u.id === friendId);
    if (!foundFriend) {
      navigate('/clubs/friends');
      return;
    }

    // Check if they're a friend
    const friendsList = getFriends();
    setIsFriend(friendsList.includes(friendId));

    setFriend(foundFriend);

    // Get friend's books with details
    const books = foundFriend.library
      .map(bookId => {
        const book = booksData.find(b => b.id === bookId);
        if (!book) return null;
        
        return {
          ...book,
          userRating: foundFriend.ratings[bookId] || null,
          isCompleted: foundFriend.completedBooks?.includes(bookId),
          isInProgress: foundFriend.inProgressBooks?.includes(bookId),
          isCurrentlyReading: foundFriend.currentlyReading === bookId,
          progress: foundFriend.currentlyReading === bookId ? foundFriend.currentProgress : 100
        };
      })
      .filter(book => book !== null);

    setFriendBooks(books);

    // Get share history
    const history = shareHistoryData.find(h => h.userId === friendId);
    setShareHistory(history);
  }, [friendId, navigate]);

  if (!friend) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-audible-orange"></div>
      </div>
    );
  }

  // Privacy check
  const canViewLibrary = isFriend && friend.privacySettings?.shareLibrary !== false;
  const canViewRatings = isFriend && friend.privacySettings?.shareRatings !== false;
  const canViewProgress = isFriend && friend.privacySettings?.shareProgress !== false;

  if (!canViewLibrary) {
    return (
      <div className="min-h-screen bg-audible-cream py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Library is Private
            </h2>
            <p className="text-gray-600 mb-6">
              {friend.name} has chosen to keep their library private.
            </p>
            <Link
              to="/clubs/friends"
              className="inline-block bg-audible-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors"
            >
              Back to Friends
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort books
  let displayBooks = [...friendBooks];
  
  // Apply filters
  if (filter === 'completed') {
    displayBooks = displayBooks.filter(b => b.isCompleted);
  } else if (filter === 'in-progress') {
    displayBooks = displayBooks.filter(b => b.isInProgress);
  } else if (filter === 'rated') {
    displayBooks = displayBooks.filter(b => b.userRating !== null);
  }

  // Apply sorting
  if (sortBy === 'rating') {
    displayBooks.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
  } else if (sortBy === 'title') {
    displayBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'author') {
    displayBooks.sort((a, b) => a.author.localeCompare(b.author));
  }

  return (
    <div className="min-h-screen bg-audible-cream">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/clubs/friends')}
            className="flex items-center space-x-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Friends</span>
          </button>

          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
                <span className="text-3xl font-bold text-white">
                  {friend.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {friend.isPremium && (
                <div className="absolute -bottom-2 -right-2 bg-audible-gold rounded-full p-2">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Friend Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold">{friend.name}'s Library</h1>
                {friend.isPremium && (
                  <span className="bg-audible-gold text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Premium
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 text-white/90 mb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-lg font-semibold">{friendBooks.length} books</span>
                </div>
                {canViewRatings && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span className="text-lg font-semibold">
                      {Object.keys(friend.ratings || {}).length} ratings
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span className="text-lg font-semibold">
                    {friend.joinedClubs?.length || 0} clubs
                  </span>
                </div>
              </div>

              {/* Favorite Genre */}
              {friend.stats?.favoriteGenre && (
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Favorite Genre: {friend.stats.favoriteGenre}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Currently Reading Section */}
      {canViewProgress && friend.currentlyReading && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-500" />
              Currently Listening
            </h2>
            {(() => {
              const currentBook = friendBooks.find(b => b.isCurrentlyReading);
              if (!currentBook) return null;

              return (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start space-x-6">
                    <Link to={`/book/${currentBook.id}`} className="flex-shrink-0">
                      <img
                        src={currentBook.cover}
                        alt={currentBook.title}
                        className="w-32 h-48 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/book/${currentBook.id}`}
                        className="text-2xl font-bold text-gray-900 hover:text-audible-orange transition-colors mb-2 block"
                      >
                        {currentBook.title}
                      </Link>
                      <p className="text-lg text-gray-700 mb-4">by {currentBook.author}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Progress</span>
                          <span className="font-bold text-lg">{currentBook.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all"
                            style={{ width: `${currentBook.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{friend.listeningSpeed}x speed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{currentBook.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Share History Section */}
      {shareHistory && shareHistory.shareHistory && shareHistory.shareHistory.length > 0 && (
        <section className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Share2 className="w-6 h-6 mr-2 text-blue-500" />
              Recent Recommendations from {friend.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shareHistory.shareHistory.slice(0, 3).map((share) => {
                const book = booksData.find(b => b.id === share.bookId);
                if (!book) return null;

                return (
                  <div key={share.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-3 mb-3">
                      <Link to={`/book/${book.id}`}>
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded shadow-sm hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/book/${book.id}`}
                          className="font-bold text-sm text-gray-900 hover:text-audible-orange line-clamp-2 mb-1"
                        >
                          {book.title}
                        </Link>
                        <p className="text-xs text-gray-600">{book.author}</p>
                      </div>
                    </div>
                    {share.message && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-2">
                        <div className="flex items-start space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 italic">"{share.message}"</p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Shared {new Date(share.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filter and Sort Controls */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
              >
                <option value="all">All Books ({friendBooks.length})</option>
                <option value="completed">
                  Completed ({friendBooks.filter(b => b.isCompleted).length})
                </option>
                <option value="in-progress">
                  In Progress ({friendBooks.filter(b => b.isInProgress).length})
                </option>
                {canViewRatings && (
                  <option value="rated">
                    Rated ({friendBooks.filter(b => b.userRating).length})
                  </option>
                )}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white"
              >
                <option value="recent">Recently Added</option>
                {canViewRatings && <option value="rating">Highest Rated</option>}
                <option value="title">Title (A-Z)</option>
                <option value="author">Author (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {displayBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No books match this filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {displayBooks.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group"
              >
                <div className="relative mb-3">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                  />
                  {book.isCurrentlyReading && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Reading
                    </div>
                  )}
                  {book.isCompleted && !book.isCurrentlyReading && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ✓
                    </div>
                  )}
                  {canViewRatings && book.userRating && (
                    <div className="absolute bottom-2 left-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{book.userRating}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-audible-orange transition-colors line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1">{book.author}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Book Clubs Section */}
      {friend.joinedClubs && friend.joinedClubs.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-purple-500" />
              {friend.name}'s Book Clubs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubsData
                .filter(club => friend.joinedClubs.includes(club.id))
                .map((club) => (
                  <Link
                    key={club.id}
                    to={`/club/${club.id}`}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all"
                  >
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{club.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">Hosted by {club.host}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{club.memberCount.toLocaleString()} members</span>
                      <span>{club.daysRemaining} days left</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

