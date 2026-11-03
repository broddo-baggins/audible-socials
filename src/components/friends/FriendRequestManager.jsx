import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { UserX, Check, X } from 'lucide-react';
import usersData from '../../data/users.json';
import {
  getPendingRequests,
  getSentRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  blockUser,
} from '../../utils/friendManagement';
import { createFriendAcceptedNotification, createFriendRejectedNotification } from '../../utils/notifications';
import { Avatar } from '../ui';

/**
 * FriendRequestManager: requests you received and sent, as two tabs over a
 * list. Accept is the one filled button; decline and block sit quietly beside it.
 */

const relationshipLabels = {
  book_club: 'Same book club',
  similar_taste: 'Similar taste',
  family: 'Family',
  real_life: 'Friend in real life',
  influencer: 'Influencer',
};

const timeSince = (timestamp) => {
  const diffMs = Date.now() - new Date(timestamp);
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
};

// Messages are user text; the system shows no emoji, so drop pictographs and tidy the spaces.
const stripEmoji = (s = '') => s.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').replace(/\s+([.,!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();

const tabClass = (selected) =>
  `relative -mb-px inline-flex h-11 items-center gap-2 text-[0.9375rem] font-medium transition-colors ${selected ? 'text-ink' : 'text-ink-2 hover:text-ink'}`;

export default function FriendRequestManager({ onUpdate }) {
  const [pendingRequests, setPendingRequests] = useState(() => getPendingRequests());
  const [sentRequests, setSentRequests] = useState(() => getSentRequests());
  const [activeTab, setActiveTab] = useState('received');
  const [actionFeedback, setActionFeedback] = useState(null);

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
      const user = usersData.find((u) => u.id === fromUserId);
      if (user) {
        createFriendAcceptedNotification(fromUserId, 'You');
        showFeedback('success', `You and ${user.name} are now friends.`);
      }
      loadRequests();
      onUpdate?.();
    } else {
      showFeedback('error', 'The request could not be accepted.');
    }
  };

  const handleReject = (requestId, fromUserId) => {
    if (window.confirm('Decline this friend request?')) {
      const user = usersData.find((u) => u.id === fromUserId);
      const result = rejectFriendRequest(requestId);
      if (result.success) {
        if (user) {
          createFriendRejectedNotification(fromUserId, 'You');
          showFeedback('info', `You declined ${user.name}'s request.`);
        }
        loadRequests();
        onUpdate?.();
      } else {
        showFeedback('error', 'The request could not be declined.');
      }
    }
  };

  const handleBlock = (requestId, userId) => {
    if (window.confirm('Block this person? They will not be able to send you requests.')) {
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

  const renderPending = (request) => {
    const user = usersData.find((u) => u.id === request.fromUserId);
    if (!user) return null;
    const relation = request.relationshipContext ? relationshipLabels[request.relationshipContext] : null;

    return (
      <li key={request.id} className="py-4">
        <div className="flex items-start gap-3">
          <Avatar src={user.avatar} name={user.name} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="truncate font-semibold text-ink">{user.name}</p>
              <span className="shrink-0 text-[0.8125rem] text-ink-3 tabular">{timeSince(request.timestamp)}</span>
            </div>
            <p className="text-[0.8125rem] text-ink-3 tabular">
              {user.library.length} books · {user.joinedClubs.length} clubs
              {user.isPremium && ' · Premium'}
            </p>
            {relation && <p className="mt-1.5 inline-flex rounded-sm bg-surface-sunk px-1.5 py-0.5 text-xs font-medium text-ink-2">{relation}</p>}
            {request.message && (
              <blockquote className="mt-2 border-l-2 border-line-strong pl-3 text-sm italic text-ink-2">&ldquo;{stripEmoji(request.message)}&rdquo;</blockquote>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => handleAccept(request.id, request.fromUserId)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-paper hover:bg-gray-800">
                <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> Accept
              </button>
              <button type="button" onClick={() => handleReject(request.id, request.fromUserId)} className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-ink hover:bg-surface">
                Decline
              </button>
              <button
                type="button"
                onClick={() => handleBlock(request.id, request.fromUserId)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-danger-wash hover:text-danger"
                aria-label={`Block ${user.name}`}
                title="Block"
              >
                <UserX className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  };

  const renderSent = (request) => {
    const user = usersData.find((u) => u.id === request.toUserId);
    if (!user) return null;
    return (
      <li key={request.id} className="flex items-center gap-3 py-3">
        <Avatar src={user.avatar} name={user.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-ink">{user.name}</p>
          <p className="text-[0.8125rem] text-ink-3 tabular">Pending, sent {timeSince(request.timestamp)}</p>
        </div>
        <button type="button" onClick={() => handleCancel(request.id)} className="inline-flex h-9 shrink-0 items-center rounded-full px-3 text-sm font-medium text-danger hover:bg-danger-wash">
          Cancel
        </button>
      </li>
    );
  };

  const total = pendingRequests.length + sentRequests.length;

  return (
    <section aria-labelledby="requests-title">
      <h2 id="requests-title" className="t-h3 text-ink">
        Friend requests {total > 0 && <span className="text-ink-3 tabular">{total}</span>}
      </h2>

      {actionFeedback && (
        <p
          role="status"
          className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${
            actionFeedback.type === 'success' ? 'border-success/30 bg-success-wash text-success' : actionFeedback.type === 'error' ? 'border-danger/30 bg-danger-wash text-danger' : 'border-line bg-surface text-ink-2'
          }`}
        >
          {actionFeedback.type === 'success' ? <Check className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : actionFeedback.type === 'error' ? <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" /> : null}
          {actionFeedback.message}
        </p>
      )}

      <div role="tablist" aria-label="Friend requests" className="mt-3 flex gap-6 border-b border-line">
        {[
          { id: 'received', label: 'Received', count: pendingRequests.length },
          { id: 'sent', label: 'Sent', count: sentRequests.length },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`req-tab-${t.id}`}
            aria-selected={activeTab === t.id}
            aria-controls="req-panel"
            onClick={() => setActiveTab(t.id)}
            className={tabClass(activeTab === t.id)}
          >
            {t.label}
            {t.count > 0 && <span className="rounded-full bg-surface-sunk px-1.5 text-xs font-semibold text-ink tabular">{t.count}</span>}
            {activeTab === t.id && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-hl" aria-hidden="true" />}
          </button>
        ))}
      </div>

      <div id="req-panel" role="tabpanel" aria-labelledby={`req-tab-${activeTab}`}>
        {activeTab === 'received' && (
          pendingRequests.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-line-strong p-5">
              <p className="font-medium text-ink">No requests right now</p>
              <p className="mt-1 text-sm text-ink-2">When someone wants to connect, their request shows up here.</p>
              <Link to="/social" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">Go to Social</Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">{pendingRequests.map(renderPending)}</ul>
          )
        )}
        {activeTab === 'sent' && (
          sentRequests.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-line-strong p-5">
              <p className="font-medium text-ink">No sent requests</p>
              <p className="mt-1 text-sm text-ink-2">Requests you send wait here until they are answered.</p>
              <Link to="/social" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2">Find new friends</Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">{sentRequests.map(renderSent)}</ul>
          )
        )}
      </div>
    </section>
  );
}

FriendRequestManager.propTypes = {
  onUpdate: PropTypes.func,
};
