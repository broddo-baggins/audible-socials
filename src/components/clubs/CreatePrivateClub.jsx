import { useState, useEffect } from 'react';
import { Users, Plus, X, BookOpen, Calendar, Clock, Check } from 'lucide-react';
import { getFriends, getUserData, createPrivateClub } from '../../utils/localStorage';
import usersData from '../../data/users.json';
import { Card } from '../ui';

export default function CreatePrivateClub({ onClubCreated, onClose }) {
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Invite Friends, 3: Book Selection
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    invitedFriends: [],
    currentBook: null,
    meetingFrequency: 'monthly',
    nextMeeting: null
  });

  const [friends, setFriends] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load friends
    const friendIds = getFriends();
    const friendData = usersData.filter(u => friendIds.includes(u.id));
    setFriends(friendData);

    // Load available books (sample for now)
    const sampleBooks = [
      { id: '1', title: 'Project Hail Mary', author: 'Andy Weir', cover: '/images/covers/1-project-hail-mary.jpg' },
      { id: '2', title: 'Where the Crawdads Sing', author: 'Delia Owens', cover: '/images/covers/2-where-the-crawdads-sing.jpg' },
      { id: '3', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', cover: '/images/covers/3-seven-husbands.jpg' },
      { id: '4', title: 'The Three-Body Problem', author: 'Liu Cixin', cover: '/images/covers/4-three-body-problem.jpg' },
      { id: '5', title: 'Dune', author: 'Frank Herbert', cover: '/images/covers/5-dune.jpg' }
    ];
    setBooks(sampleBooks);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFriend = (friendId) => {
    setFormData(prev => ({
      ...prev,
      invitedFriends: prev.invitedFriends.includes(friendId)
        ? prev.invitedFriends.filter(id => id !== friendId)
        : [...prev.invitedFriends, friendId]
    }));
  };

  const selectBook = (bookId) => {
    setFormData(prev => ({
      ...prev,
      currentBook: bookId
    }));
  };

  const createClub = async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = getUserData();

      const clubData = {
        name: formData.name,
        host: userData.id,
        hostType: 'user',
        description: formData.description,
        coverQuery: formData.name,
        currentBook: formData.currentBook,
        previousBooks: [],
        memberCount: formData.invitedFriends.length + 1,
        isPremium: false,
        timeframe: formData.meetingFrequency,
        duration: '1 month',
        daysRemaining: 30,
        meetingsPerMonth: 1,
        nextMeeting: formData.nextMeeting,
        isPrivate: true,
        members: [userData.id, ...formData.invitedFriends],
        invitedMembers: [],
        bookVotes: {},
        selectedBook: formData.currentBook,
        discussions: [],
        events: formData.nextMeeting ? [{
          id: `priv-${Date.now()}`,
          title: `First Meetup: ${formData.name}`,
          date: formData.nextMeeting,
          type: 'discussion',
          description: `Welcome to our new private book club! Let's discuss our first book and plan future reads.`,
          rsvpCount: formData.invitedFriends.length + 1,
          maxCapacity: formData.invitedFriends.length + 1,
          isExclusive: true,
          attendees: [userData.id, ...formData.invitedFriends]
        }] : []
      };

      const result = createPrivateClub(clubData);
      if (result.success) {
        onClubCreated(result.club);
        onClose();
      } else {
        setError(result.error || 'Failed to create club');
      }
    } catch (err) {
      setError('An unexpected error occurred while creating the club');
      console.error('Club creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() && formData.description.trim();
      case 2:
        return formData.invitedFriends.length > 0;
      case 3:
        return formData.currentBook !== null;
      default:
        return false;
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Create Private Book Club</h2>
              <p className="text-purple-100 mt-1">Start a private club for you and your friends</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step
                    ? 'bg-white text-purple-600'
                    : 'bg-white/30 text-white/70'
                }`}>
                  {stepNum}
                </div>
                <span className="ml-2 text-sm font-medium">
                  {stepNum === 1 && 'Club Info'}
                  {stepNum === 2 && 'Invite Friends'}
                  {stepNum === 3 && 'Choose Book'}
                </span>
                {stepNum < 3 && <div className="w-8 h-0.5 bg-white/30 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Club Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Sci-Fi Book Lovers"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell your friends what your club is about..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Frequency
                  </label>
                  <select
                    value={formData.meetingFrequency}
                    onChange={(e) => handleInputChange('meetingFrequency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Meeting (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.nextMeeting || ''}
                    onChange={(e) => handleInputChange('nextMeeting', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Invite Friends</h3>
                <p className="text-sm text-gray-600">Choose which friends you'd like to invite to your club.</p>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search friends..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredFriends.map(friend => (
                  <div
                    key={friend.id}
                    onClick={() => toggleFriend(friend.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.invitedFriends.includes(friend.id)
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={friend.avatar || '/images/avatars/default.png'}
                        alt={friend.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{friend.name}</p>
                        <p className="text-sm text-gray-600">{friend.currentlyReading ? 'Currently reading' : 'Available'}</p>
                      </div>
                    </div>
                    {formData.invitedFriends.includes(friend.id) && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <Users className="w-4 h-4 inline mr-1" />
                  <strong>{formData.invitedFriends.length} friends invited</strong> - You can always invite more later!
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose First Book</h3>
                <p className="text-sm text-gray-600">Select a book to start your club discussions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {books.map(book => (
                  <div
                    key={book.id}
                    onClick={() => selectBook(book.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.currentBook === book.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex space-x-3">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {book.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          by {book.author}
                        </p>
                        {formData.currentBook === book.id && (
                          <div className="flex items-center mt-2 text-purple-600">
                            <Check className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                step === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              disabled={step === 1}
            >
              Back
            </button>

            <div className="flex items-center space-x-3">
              {step === 3 && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={step === 3 ? createClub : () => setStep(step + 1)}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {step === 3 ? 'Create Club' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
