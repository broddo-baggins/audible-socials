import { useState, useRef, useEffect } from 'react';
import { MessageCircle, User, Clock, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui';
import { addClubDiscussion, addDiscussionReply, getClubDiscussions, getUserData } from '../../utils/localStorage';

export default function PrivateClubDiscussions({ club, currentUser }) {
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    bookSection: '',
    hasSpoilers: false
  });
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [expandedDiscussion, setExpandedDiscussion] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replySpoilers, setReplySpoilers] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDiscussions();
  }, [club.id]);

  const loadDiscussions = () => {
    // First try to load from localStorage
    const storedDiscussions = getClubDiscussions(club.id);
    if (storedDiscussions.length > 0) {
      setDiscussions(storedDiscussions);
    } else {
      // Fallback to club data
      setDiscussions(club.discussions || []);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) return;

    setLoading(true);
    const userData = getUserData();

    const result = addClubDiscussion(club.id, {
      title: newDiscussion.title,
      content: newDiscussion.content,
      author: userData.id,
      bookSection: newDiscussion.bookSection || null,
      hasSpoilers: newDiscussion.hasSpoilers
    });

    if (result.success) {
      setDiscussions(prev => [result.discussion, ...prev]);
      setNewDiscussion({ title: '', content: '', bookSection: '', hasSpoilers: false });
      setShowNewDiscussion(false);
    }
    setLoading(false);
  };

  const handleReply = async (discussionId) => {
    if (!replyText.trim()) return;

    setLoading(true);
    const userData = getUserData();

    const result = addDiscussionReply(club.id, discussionId, {
      content: replyText,
      author: userData.id,
      hasSpoilers: replySpoilers
    });

    if (result.success) {
      setDiscussions(prev => prev.map(disc =>
        disc.id === discussionId
          ? { ...disc, replies: [...(disc.replies || []), result.reply] }
          : disc
      ));
      setReplyText('');
      setReplySpoilers(false);
      setExpandedDiscussion(null);
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Club Discussions</h3>
          <p className="text-sm text-gray-600 mt-1">
            Discuss books, share thoughts, and plan meetups with your club
          </p>
        </div>
        <button
          onClick={() => setShowNewDiscussion(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Start Discussion</span>
        </button>
      </div>

      {/* New Discussion Form */}
      {showNewDiscussion && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discussion Title
              </label>
              <input
                type="text"
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Chapter 5 Thoughts"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Section (Optional)
              </label>
              <input
                type="text"
                value={newDiscussion.bookSection}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, bookSection: e.target.value }))}
                placeholder="e.g., Chapter 3, Pages 45-67"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Thoughts
              </label>
              <textarea
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts about the book..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newDiscussion.hasSpoilers}
                  onChange={(e) => setNewDiscussion(prev => ({ ...prev, hasSpoilers: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <span className="text-sm text-gray-700">Contains spoilers</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowNewDiscussion(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDiscussion}
                disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim() || loading}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Posting...' : 'Post Discussion'}
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
            <p className="text-gray-600 mb-4">Start the conversation by sharing your thoughts about the book!</p>
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Start First Discussion
            </button>
          </Card>
        ) : (
          discussions.map(discussion => (
            <Card key={discussion.id} className="p-6">
              <div className="space-y-4">
                {/* Discussion Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {discussion.title}
                      </h4>
                      {discussion.hasSpoilers && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <EyeOff className="w-4 h-4" />
                          <span className="text-xs font-medium">Spoilers</span>
                        </div>
                      )}
                    </div>

                    {discussion.bookSection && (
                      <p className="text-sm text-purple-600 font-medium mb-2">
                        📖 {discussion.bookSection}
                      </p>
                    )}

                    <p className="text-gray-700 mb-3">{discussion.content}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Club Member</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(discussion.timestamp)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{discussion.replies?.length || 0} replies</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {discussion.replies && discussion.replies.length > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    {discussion.replies.map(reply => (
                      <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">Club Member</span>
                              {reply.hasSpoilers && (
                                <div className="flex items-center space-x-1 text-orange-600">
                                  <EyeOff className="w-3 h-3" />
                                  <span className="text-xs">Spoilers</span>
                                </div>
                              )}
                              <span className="text-xs text-gray-500">
                                {formatDate(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {expandedDiscussion === discussion.id ? (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Share your thoughts..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none text-sm"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={replySpoilers}
                              onChange={(e) => setReplySpoilers(e.target.checked)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-xs text-gray-700">Contains spoilers</span>
                          </label>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setExpandedDiscussion(null);
                                setReplyText('');
                                setReplySpoilers(false);
                              }}
                              className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReply(discussion.id)}
                              disabled={!replyText.trim() || loading}
                              className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {loading ? 'Sending...' : 'Reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <button
                      onClick={() => setExpandedDiscussion(discussion.id)}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Reply to discussion</span>
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
