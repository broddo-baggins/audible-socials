import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  UserX, 
  Check, 
  X, 
  AlertCircle, 
  Clock, 
  Send, 
  Heart, 
  HeartHandshake, 
  BookOpen, 
  Users 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import usersData from '../../data/users.json';
import {
  getPendingRequests,
  getSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  blockUser
} from '../../utils/friendManagement';
import { createFriendAcceptedNotification, createFriendRejectedNotification } from '../../utils/notifications';

export default function FriendRequestManager({ onUpdate }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');
  const [actionFeedback, setActionFeedback] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setPendingRequests(getPendingRequests());
    setSentRequests(getSentRequests());
  };

  const showFeedback = (type, message) => {
    setActionFeedback({ type, message });
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleAccept = (requestId, fromUserId) => {
    const result = acceptFriendRequest(requestId);
    if (result.success) {
      const user = usersData.find(u => u.id === fromUserId);
      if (user) {
        createFriendAcceptedNotification(fromUserId, 'You');
        showFeedback('success', `You are now friends with ${user.name}!`);
      }
      loadRequests();
      onUpdate?.();
    } else {
      showFeedback('error', 'Failed to accept friend request');
    }
  };

  const handleReject = (requestId, fromUserId) => {
    if (window.confirm('Are you sure you want to decline this friend request?')) {
      const user = usersData.find(u => u.id === fromUserId);
      const result = rejectFriendRequest(requestId);
      if (result.success) {
        if (user) {
          createFriendRejectedNotification(fromUserId, 'You');
          showFeedback('info', `You declined ${user.name}'s friend request`);
        }
        loadRequests();
        onUpdate?.();
      } else {
        showFeedback('error', 'Failed to decline friend request');
      }
    }
  };

  const handleBlock = (requestId, userId) => {
    if (window.confirm('Block this user? They will not be able to send you requests.')) {
      rejectFriendRequest(requestId);
      blockUser(userId, 'blocked_from_request');
      loadRequests();
      onUpdate?.();
    }
  };

  const handleCancel = (requestId) => {
    if (window.confirm('Cancel this friend request?')) {
      cancelFriendRequest(requestId);
      loadRequests();
    }
  };

  const getTimeSince = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getRelationshipBadge = (context) => {
    const badges = {
      'book_club': { icon: '📚', text: 'Book Club Member', color: 'bg-blue-100 text-blue-700' },
      'similar_taste': { icon: '⭐', text: 'Similar Taste', color: 'bg-purple-100 text-purple-700' },
      'family': { icon: '👨‍👩‍👧‍👦', text: 'Family', color: 'bg-green-100 text-green-700' },
      'real_life': { icon: '🤝', text: 'Friend IRL', color: 'bg-orange-100 text-orange-700' },
      'influencer': { icon: '🌟', text: 'Influencer', color: 'bg-yellow-100 text-yellow-700' }
    };
    return badges[context] || null;
  };

  const renderPendingRequest = (request) => {
    const user = usersData.find(u => u.id === request.fromUserId);
    if (!user) return null;

    const relationshipBadge = request.relationshipContext ? getRelationshipBadge(request.relationshipContext) : null;

    return (
      <motion.div
        key={request.id}
        initial={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className="bg-gradient-to-r from-white to-purple-50/30 border-2 border-purple-200 rounded-xl p-5 hover:border-purple-400 transition-all shadow-sm hover:shadow-md"
      >
        <div className="flex items-start space-x-4">
          <motion.div
            className="flex-shrink-0 relative"
            whileHover={{ scale: 1.05 }}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
                      {user.isPremium && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm">
                          <span className="text-xs text-white font-bold">P</span>
                        </div>
                      )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{user.name}</h4>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {user.library.length} books
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {user.joinedClubs.length} clubs
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {getTimeSince(request.timestamp)}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-600 font-medium">Wants to connect</span>
                </div>
              </div>
            </div>

            {relationshipBadge && (
              <div className="mb-2">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${relationshipBadge.color}`}>
                  <span>{relationshipBadge.icon}</span>
                  <span>{relationshipBadge.text}</span>
                </span>
              </div>
            )}

            {request.message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-purple-100"
              >
                <div className="flex items-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-3 mt-4">
              <motion.button
                onClick={() => handleAccept(request.id, request.fromUserId)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="w-5 h-5" />
                <span>Accept Friend</span>
              </motion.button>

              <motion.button
                onClick={() => handleReject(request.id, request.fromUserId)}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <X className="w-5 h-5" />
                <span>Decline</span>
              </motion.button>

              <motion.button
                onClick={() => handleBlock(request.id, request.fromUserId)}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                title="Block user"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserX className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSentRequest = (request) => {
    const user = usersData.find(u => u.id === request.toUserId);
    if (!user) return null;

    return (
      <div
        key={request.id}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900">{user.name}</h4>
              <span className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {getTimeSince(request.timestamp)}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Request pending
            </p>

            <button
              onClick={() => handleCancel(request.id)}
              className="text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Feedback Notification */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`mb-4 p-4 rounded-lg border-2 ${
              actionFeedback.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : actionFeedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionFeedback.type === 'success' && <Check className="w-5 h-5 text-green-600" />}
              {actionFeedback.type === 'error' && <X className="w-5 h-5 text-red-600" />}
              {actionFeedback.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-600" />}
              <p className="font-semibold">{actionFeedback.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-2 mb-6">
        <UserPlus className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Friend Requests</h3>
        {(pendingRequests.length + sentRequests.length) > 0 && (
          <span className="bg-purple-100 text-purple-700 text-sm font-bold px-3 py-1 rounded-full">
            {pendingRequests.length + sentRequests.length}
          </span>
        )}
      </div>

      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 px-4 font-bold transition-colors relative ${
            activeTab === 'received'
              ? 'border-b-3 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Received
          {pendingRequests.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 px-4 font-bold transition-colors ${
            activeTab === 'sent'
              ? 'border-b-3 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sent
          {sentRequests.length > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {sentRequests.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'received' && (
        <AnimatePresence>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200"
              >
                <Heart className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">No Friend Requests Yet</h4>
                <p className="text-gray-600 mb-4">When people want to connect with you, you'll see their requests here</p>
                <Link
                  to="/social"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
                >
                  <UserPlus className="w-4 h-4" />
                  Explore the Social Hub
                </Link>
              </motion.div>
            ) : (
              pendingRequests.map(renderPendingRequest)
            )}
          </div>
        </AnimatePresence>
      )}

      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sentRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200"
            >
              <Send className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h4 className="text-lg font-bold text-gray-900 mb-2">No Sent Requests</h4>
              <p className="text-gray-600 mb-4">Friend requests you've sent will appear here</p>
              <Link
                to="/social"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                <UserPlus className="w-4 h-4" />
                Find New Friends
              </Link>
            </motion.div>
          ) : (
            sentRequests.map(renderSentRequest)
          )}
        </div>
      )}
    </div>
  );
}

