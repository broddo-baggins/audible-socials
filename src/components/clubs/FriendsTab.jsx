import { useState, useEffect } from 'react';
import { Search, UserPlus, Crown, Users, BookOpen, Star, Gauge, Clock, Send } from 'lucide-react';
import usersData from '../../data/users.json';
import booksData from '../../data/books.json';
import clubsData from '../../data/clubs.json';
import { getUserData, getFriends, removeFriend } from '../../utils/localStorage';
import { sendFriendRequest, getSuggestedFriends, isUserBlocked } from '../../utils/friendManagement';
import FriendRequestManager from '../friends/FriendRequestManager';

export default function FriendsTab() {
  const [friends, setFriends] = useState([]);
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

  const handleSendRequest = (friendId, userName) => {
    const result = sendFriendRequest(friendId, '');
    if (result.success) {
      alert(`Friend request sent to ${userName}`);
      handleSearch(searchQuery);
    } else {
      alert(result.error);
    }
  };

  const handleRemoveFriend = (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      removeFriend(friendId);
      loadFriends();
      setSelectedFriend(null);
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
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Friends Grid */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Friends ({friends.length})
          </h3>
          
          {friends.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No friends yet
              </h4>
              <p className="text-gray-600">
                Search for friends above to connect with them
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => handleSelectFriend(friend)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedFriend?.id === friend.id
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
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
                      <p className="font-semibold text-gray-900">{friend.name}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {friend.library.length}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {friend.joinedClubs.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Friend Detail */}
        {selectedFriend && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedFriend.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
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
                onClick={() => handleRemoveFriend(selectedFriend.id)}
                className="text-red-600 text-sm font-semibold hover:text-red-700"
              >
                Remove
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
                <h4 className="font-semibold text-gray-900 mb-3">Recently Completed</h4>
                <div className="space-y-2">
                  {Object.keys(selectedFriend.ratings)
                    .slice(0, 3)
                    .map((bookId) => {
                      const book = booksData.find(b => b.id === bookId);
                      if (!book) return null;

                      const completionTime = selectedFriend.completionTimes?.[bookId] ||
                        Math.floor((book.durationMinutes || 600) / (selectedFriend.listeningSpeed || 1.0));
                      const daysAgo = Math.floor(Math.random() * 30) + 1; // Mock data

                      return (
                        <div key={bookId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{book.title}</p>
                            <p className="text-xs text-gray-600">
                              Completed {daysAgo} days ago • {Math.floor(completionTime / 60)}h {completionTime % 60}m
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">
                              {selectedFriend.ratings[bookId]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Recent Ratings */}
            {selectedFriend.privacySettings?.shareRatings && Object.keys(selectedFriend.ratings).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Ratings</h4>
                <div className="space-y-2">
                  {Object.entries(selectedFriend.ratings)
                    .slice(0, 5)
                    .map(([bookId, rating]) => {
                      const book = booksData.find(b => b.id === bookId);
                      if (!book) return null;
                      return (
                        <div key={bookId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <p className="text-sm text-gray-900 flex-1 truncate">{book.title}</p>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">{rating}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

