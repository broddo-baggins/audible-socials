import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, Crown, Users, BookOpen, Star, Gauge, Clock, Send } from 'lucide-react';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import clubsData from '../../data/clubs.json';
import { getUserData, getFriends, removeFriend } from '../../utils/localStorage';
import { sendFriendRequest, getSuggestedFriends, getFriendsOfFriends, isUserBlocked } from '../../utils/friendManagement';
import FriendRequestManager from '../friends/FriendRequestManager';

export default function FriendsTab() {
  const [friends, setFriends] = useState([]);
  const [friendsOfFriends, setFriendsOfFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  useEffect(() => {
    getUserData();
    loadFriends();
  }, []);

  const loadFriends = () => {
    const friendIds = getFriends();
    const friendsList = usersData.filter(u => friendIds.includes(u.id));
    setFriends(friendsList);

    // Load friends of friends
    const fofList = getFriendsOfFriends('user-me', usersData).slice(0, 6); // Show top 6
    setFriendsOfFriends(fofList);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const suggested = getSuggestedFriends('user-me', usersData);
      const results = suggested.filter(user =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    } else {
      const suggested = getSuggestedFriends('user-me', usersData);
      setSearchResults(suggested.slice(0, 10));
    }
  };

  const getContextualMessage = (user, currentUser) => {
    // Check for shared clubs
    const sharedClubs = user.joinedClubs?.filter(clubId => 
      currentUser.joinedClubs?.includes(clubId)
    ) || [];
    
    if (sharedClubs.length > 0) {
      const club = clubsData.find(c => c.id === sharedClubs[0]);
      return {
        message: `Hey! We're both in ${club?.name}. I'd love to connect and share our thoughts on the books!`,
        context: 'book_club',
        sharedClub: sharedClubs[0]
      };
    }

    // Check for similar reading taste (shared books in library)
    const sharedBooks = user.library?.filter(bookId => 
      currentUser.library?.includes(bookId)
    ) || [];
    
    if (sharedBooks.length >= 3) {
      return {
        message: `Hi! I noticed we have ${sharedBooks.length} books in common - we have such similar taste! Would love to connect and share recommendations.`,
        context: 'similar_taste'
      };
    }

    // Check for same favorite genre
    const userFavoriteGenre = user.stats?.favoriteGenre;
    const myFavoriteGenre = currentUser.stats?.favoriteGenre;
    
    if (userFavoriteGenre && userFavoriteGenre === myFavoriteGenre) {
      return {
        message: `Hey! I see we both love ${userFavoriteGenre}. Let's connect and swap our favorite listens!`,
        context: 'similar_taste'
      };
    }

    // Default message
    return {
      message: `Hi! Your reading list looks great. Would love to connect and share book recommendations!`,
      context: null
    };
  };

  const handleSendRequest = (friendId, userName) => {
    const currentUser = getUserData();
    const targetUser = usersData.find(u => u.id === friendId);
    
    if (targetUser) {
      const { message, context, ...extraData } = getContextualMessage(targetUser, currentUser);
      const result = sendFriendRequest(friendId, message, context, extraData);
      
      if (result.success) {
        alert(`Friend request sent to ${userName}!`);
        handleSearch(searchQuery);
      } else {
        alert(result.error);
      }
    }
  };

  const handleRemoveFriend = (friendId, friendName) => {
    if (window.confirm(`Are you sure you want to remove ${friendName} from your friends? This action cannot be undone.`)) {
      const result = removeFriend(friendId);
      if (result.success) {
        loadFriends();
        setSelectedFriend(null);
        alert(`You have removed ${friendName} from your friends.`);
      } else {
        alert('Failed to remove friend. Please try again.');
      }
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Connect with Friends</h2>
        <p className="mb-4 text-white/90">
          See what your friends are reading, share book ratings, and discover which book clubs they've joined.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>View friends' libraries and reading history</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>See their book ratings and reviews</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Find which book clubs they're in</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Get personalized recommendations</span>
          </li>
        </ul>
      </div>

      {/* Friend Requests */}
      <FriendRequestManager onUpdate={loadFriends} />

      {/* Friends of Friends */}
      {friendsOfFriends.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md p-6 border border-indigo-200">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-gray-900">Friends of Friends</h3>
            <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-2 py-1 rounded-full">
              Discover
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            People you might know through your friends. Expand your reading circle!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendsOfFriends.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      {user.isPremium && (
                        <Crown className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {user.library.length} books • {user.joinedClubs.length} clubs
                    </p>

                    {user.mutualFriends > 0 && (
                      <p className="text-xs text-indigo-600 mb-2">
                        <Users className="w-3 h-3 inline mr-1" />
                        {user.mutualFriends} mutual friend{user.mutualFriends !== 1 ? 's' : ''}
                        {user.mutualFriendList.length > 0 && (
                          <span>: {user.mutualFriendList.join(', ')}</span>
                        )}
                      </p>
                    )}

                    <button
                      onClick={() => handleSendRequest(user.id, user.name)}
                      disabled={isUserBlocked(user.id)}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add Friend</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <Link
              to="/social"
              className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
            >
              Explore more connections →
            </Link>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Find Friends</h3>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                    {user.isPremium && (
                      <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-0.5">
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.library.length} books</p>
                  </div>
                </div>
                {!isUserBlocked(user.id) ? (
                  <button
                    onClick={() => handleSendRequest(user.id, user.name)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Request</span>
                  </button>
                ) : (
                  <span className="text-xs text-red-600 font-semibold">Blocked</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friends List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            Your Friends ({friends.length})
          </h3>
        </div>
        
        {friends.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="w-20 h-20 mx-auto text-gray-400 mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              No friends yet
            </h4>
            <p className="text-gray-600 mb-6">
              Search for friends above to connect with them
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {friends.map((friend) => {
              const currentBook = friend.currentlyReading 
                ? booksData.find(b => b.id === friend.currentlyReading)
                : null;
              const currentRating = currentBook && friend.ratings[friend.currentlyReading]
                ? friend.ratings[friend.currentlyReading]
                : null;

              return (
                <div
                  key={friend.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 overflow-hidden group"
                >
                  {/* Friend Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="relative">
                        {friend.avatar ? (
                          <img 
                            src={friend.avatar} 
                            alt={friend.name} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-white font-bold text-lg">
                              {friend.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        {friend.isPremium && (
                          <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-1">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{friend.name}</h4>
                        {friend.isPremium && (
                          <span className="text-xs text-white/80">Premium Member</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center justify-around text-center text-xs bg-white/10 rounded-lg py-2">
                      <div>
                        <p className="font-bold text-lg">{friend.library.length}</p>
                        <p className="text-white/70">Books</p>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div>
                        <p className="font-bold text-lg">{friend.joinedClubs.length}</p>
                        <p className="text-white/70">Clubs</p>
                      </div>
                      <div className="w-px h-8 bg-white/20"></div>
                      <div>
                        <p className="font-bold text-lg">{Object.keys(friend.ratings).length}</p>
                        <p className="text-white/70">Ratings</p>
                      </div>
                    </div>
                  </div>

                  {/* Currently Reading Section */}
                  <div className="p-4">
                    {currentBook ? (
                      <div>
                        <Link
                          to={`/book/${currentBook.id}`}
                          className="block group/book"
                        >
                          <div className="flex space-x-3 mb-4">
                            <img
                              src={currentBook.cover}
                              alt={currentBook.title}
                              className="w-16 h-24 object-cover rounded shadow-md group-hover/book:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <h6 className="font-bold text-sm text-gray-900 group-hover/book:text-audible-orange transition-colors line-clamp-2 mb-1">
                                {currentBook.title}
                              </h6>
                              <p className="text-xs text-gray-600 mb-2">{currentBook.author}</p>
                              {currentRating && (
                                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full w-fit">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs font-bold text-gray-900">{currentRating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>

                        {/* Enhanced Progress Display */}
                        {friend.currentProgress !== undefined && friend.currentProgress > 0 ? (
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm font-bold">{friend.currentProgress}%</span>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-700">Reading Progress</p>
                                  <p className="text-xs text-gray-600">
                                    {friend.currentProgress < 100
                                      ? `${100 - friend.currentProgress}% remaining`
                                      : 'Completed!'
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-green-600">{friend.currentProgress}%</p>
                                <p className="text-xs text-gray-500">complete</p>
                              </div>
                            </div>

                            {/* Large Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                                style={{ width: `${friend.currentProgress}%` }}
                              />
                            </div>

                            {/* Progress Milestones */}
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>0%</span>
                              <span className={friend.currentProgress >= 25 ? 'text-green-600 font-semibold' : ''}>25%</span>
                              <span className={friend.currentProgress >= 50 ? 'text-green-600 font-semibold' : ''}>50%</span>
                              <span className={friend.currentProgress >= 75 ? 'text-green-600 font-semibold' : ''}>75%</span>
                              <span className={friend.currentProgress >= 100 ? 'text-green-600 font-semibold' : ''}>100%</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-gray-400" />
                              <span className="text-sm text-gray-600">Reading progress not shared</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-center mt-3">
                          <Link
                            to={`/book/${currentBook.id}`}
                            className="text-xs text-audible-orange hover:text-audible-orange-dark font-semibold"
                          >
                            View Book Details →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">Not currently listening</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="border-t border-gray-100 p-4 bg-gray-50 flex space-x-2">
                    <Link
                      to={`/friend/${friend.id}/library`}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm text-center"
                    >
                      View Library
                    </Link>
                    <button
                      onClick={() => handleSelectFriend(friend)}
                      className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors text-sm"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleRemoveFriend(friend.id, friend.name)}
                      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all text-sm shadow-md hover:shadow-lg"
                    >
                      Remove Friend
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Friend Detail Modal */}
      {selectedFriend && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedFriend(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {selectedFriend.avatar ? (
                    <img 
                      src={selectedFriend.avatar} 
                      alt={selectedFriend.name} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-white font-bold text-xl">
                        {selectedFriend.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  {selectedFriend.isPremium && (
                    <div className="absolute -bottom-1 -right-1 bg-audible-gold rounded-full p-1">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedFriend.name}</h3>
                  {selectedFriend.isPremium && (
                    <span className="text-sm text-audible-gold font-semibold">Premium Member</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveFriend(selectedFriend.id, selectedFriend.name)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
              >
                Remove Friend
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedFriend.library.length}</p>
                <p className="text-xs text-gray-600">Books</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedFriend.joinedClubs.length}</p>
                <p className="text-xs text-gray-600">Clubs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedFriend.credits}</p>
                <p className="text-xs text-gray-600">Credits</p>
              </div>
            </div>

            {/* Book Clubs */}
            {selectedFriend.joinedClubs.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Book Clubs</h4>
                <div className="space-y-2">
                  {clubsData
                    .filter(club => selectedFriend.joinedClubs.includes(club.id))
                    .map((club) => (
                      <div key={club.id} className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-semibold text-gray-900 text-sm">{club.name}</p>
                        <p className="text-xs text-gray-600">by {club.host}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Reading Progress & History */}
            {selectedFriend.currentlyReading && selectedFriend.privacySettings?.shareProgress && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Currently Listening</h4>
                {(() => {
                  const currentBook = booksData.find(b => b.id === selectedFriend.currentlyReading);
                  if (!currentBook) return null;

                  const progress = selectedFriend.currentProgress || 0;
                  const totalDuration = currentBook.durationMinutes || 600; // fallback
                  const currentPosition = Math.round((progress / 100) * totalDuration);
                  const remainingTime = totalDuration - currentPosition;
                  const estimatedCompletion = new Date(Date.now() + (remainingTime * 60 * 1000));

                  return (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200">
                      <p className="font-semibold text-gray-900 text-sm mb-2">{currentBook.title}</p>
                      <p className="text-xs text-gray-600 mb-3">by {currentBook.author}</p>

                      <div className="space-y-3">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span className="font-semibold">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Time Information */}
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <div className="text-gray-600">Current Position</div>
                            <div className="font-semibold text-gray-900">
                              {Math.floor(currentPosition / 60)}h {currentPosition % 60}m
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Time Remaining</div>
                            <div className="font-semibold text-gray-900">
                              {Math.floor(remainingTime / 60)}h {remainingTime % 60}m
                            </div>
                          </div>
                        </div>

                        {/* Listening Speed & Estimated Completion */}
                        <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-purple-200">
                          <div className="flex items-center space-x-1">
                            <Gauge className="w-3 h-3" />
                            <span>{selectedFriend.listeningSpeed || 1.0}x speed</span>
                          </div>
                          <div>
                            <span>Finishes: {estimatedCompletion.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Recently Completed Books */}
            {selectedFriend.privacySettings?.shareHistory && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Recently Completed</h4>
                <div className="space-y-3">
                  {Object.keys(selectedFriend.ratings)
                    .slice(0, 3)
                    .map((bookId) => {
                      const book = booksData.find(b => b.id === bookId);
                      if (!book) return null;

                      const completionTime = selectedFriend.completionTimes?.[bookId] ||
                        Math.floor((book.durationMinutes || 600) / (selectedFriend.listeningSpeed || 1.0));
                      const daysAgo = Math.floor(Math.random() * 30) + 1; // Mock data

                      return (
                        <Link
                          key={bookId}
                          to={`/book/${bookId}`}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <img
                            src={book.cover}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow-sm group-hover:scale-105 transition-transform"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 group-hover:text-audible-orange transition-colors line-clamp-1 mb-1">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                            <p className="text-xs text-gray-500">
                              Completed {daysAgo} days ago • {Math.floor(completionTime / 60)}h {completionTime % 60}m
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900">
                              {selectedFriend.ratings[bookId]}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedFriend(null)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

