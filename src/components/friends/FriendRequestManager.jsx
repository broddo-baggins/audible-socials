import { useState, useEffect } from 'react';
import { UserPlus, UserX, Check, X, AlertCircle, Clock, Send } from 'lucide-react';
import usersData from '../../data/users.json';
import { 
  getPendingRequests, 
  getSentRequests, 
  acceptFriendRequest, 
  rejectFriendRequest,
  cancelFriendRequest,
  blockUser
} from '../../utils/friendManagement';
import { createFriendAcceptedNotification } from '../../utils/notifications';

export default function FriendRequestManager({ onUpdate }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    setPendingRequests(getPendingRequests());
    setSentRequests(getSentRequests());
  };

  const handleAccept = (requestId, fromUserId) => {
    const result = acceptFriendRequest(requestId);
    if (result.success) {
      const user = usersData.find(u => u.id === fromUserId);
      if (user) {
        createFriendAcceptedNotification(fromUserId, 'You');
      }
      loadRequests();
      onUpdate?.();
    }
  };

  const handleReject = (requestId) => {
    if (window.confirm('Are you sure you want to decline this request?')) {
      rejectFriendRequest(requestId);
      loadRequests();
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

  const renderPendingRequest = (request) => {
    const user = usersData.find(u => u.id === request.fromUserId);
    if (!user) return null;

    return (
      <div
        key={request.id}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
      >
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900">{user.name}</h4>
              <span className="text-xs text-gray-500">{getTimeSince(request.timestamp)}</span>
            </div>
            
            <p className="text-sm text-gray-600 mb-1">
              {user.library.length} books • {user.joinedClubs.length} clubs
            </p>
            
            {request.message && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700 italic">
                "{request.message}"
              </div>
            )}

            <div className="flex items-center space-x-2 mt-3">
              <button
                onClick={() => handleAccept(request.id, request.fromUserId)}
                className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Accept</span>
              </button>
              
              <button
                onClick={() => handleReject(request.id)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Decline</span>
              </button>
              
              <button
                onClick={() => handleBlock(request.id, request.fromUserId)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Block user"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
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
          <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
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
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserPlus className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Friend Requests</h3>
      </div>

      <div className="flex space-x-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-2 px-4 font-semibold transition-colors ${
            activeTab === 'received'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Received ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-2 px-4 font-semibold transition-colors ${
            activeTab === 'sent'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {activeTab === 'received' && (
        <div className="space-y-3">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No pending friend requests</p>
            </div>
          ) : (
            pendingRequests.map(renderPendingRequest)
          )}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="space-y-3">
          {sentRequests.length === 0 ? (
            <div className="text-center py-8">
              <Send className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No sent requests</p>
            </div>
          ) : (
            sentRequests.map(renderSentRequest)
          )}
        </div>
      )}
    </div>
  );
}

