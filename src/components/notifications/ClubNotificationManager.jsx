import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../../contexts/ToastContext';
import socket, { SOCKET_EVENTS } from '../../utils/socket';
import { Bell, MessageSquare, Users, Vote, BookOpen } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * ClubNotificationManager
 * Manages real-time notifications for book clubs
 */
const ClubNotificationManager = ({ userId, subscribedClubs = [] }) => {
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);

  // Handle new message notifications
  const handleNewMessage = useCallback((data) => {
    const { channelId, message } = data;
    
    // Only notify if user is subscribed to this club and didn't send the message
    if (subscribedClubs.includes(channelId) && message.userId !== userId) {
      toast.info(
        `${message.userName}: ${message.content.substring(0, 50)}${message.content.length > 50 ? '...' : ''}`,
        'New Message'
      );

      setNotifications(prev => [...prev, {
        id: `notif-${Date.now()}`,
        type: 'message',
        clubId: channelId,
        data: message,
        timestamp: Date.now(),
        read: false
      }]);
    }
  }, [subscribedClubs, userId, toast]);

  // Handle vote cast notifications
  const handleVoteCast = useCallback((data) => {
    const { clubId, vote } = data;
    
    if (subscribedClubs.includes(clubId) && vote.userId !== userId) {
      toast.info(
        `${vote.userName} voted for a book`,
        'New Vote'
      );

      setNotifications(prev => [...prev, {
        id: `notif-${Date.now()}`,
        type: 'vote',
        clubId,
        data: vote,
        timestamp: Date.now(),
        read: false
      }]);
    }
  }, [subscribedClubs, userId, toast]);

  // Handle club update notifications
  const handleClubUpdate = useCallback((data) => {
    const { clubId, updateType, details } = data;
    
    if (subscribedClubs.includes(clubId)) {
      let message = '';
      switch (updateType) {
        case 'new_member':
          message = `${details.userName} joined the club`;
          break;
        case 'book_selected':
          message = `New book selected: ${details.bookTitle}`;
          break;
        case 'meeting_scheduled':
          message = `Meeting scheduled for ${details.date}`;
          break;
        default:
          message = 'Club updated';
      }

      toast.info(message, 'Club Update');

      setNotifications(prev => [...prev, {
        id: `notif-${Date.now()}`,
        type: 'club_update',
        clubId,
        data: details,
        timestamp: Date.now(),
        read: false
      }]);
    }
  }, [subscribedClubs, toast]);

  // Handle presence updates (typing indicators)
  const handlePresenceUpdate = useCallback((data) => {
    const { userId: presenceUserId, status, clubId, userName } = data;
    
    if (subscribedClubs.includes(clubId) && presenceUserId !== userId && status === 'typing') {
      // Could show typing indicator in UI
      console.log(`[Presence] ${userName} is typing in ${clubId}`);
    }
  }, [subscribedClubs, userId]);

  // Handle activity updates
  const handleActivityUpdate = useCallback((data) => {
    const { activityType, data: activityData } = data;
    
    // Show occasional activity notifications
    if (Math.random() > 0.7) { // Only show 30% of activities to avoid spam
      let message = '';
      switch (activityType) {
        case 'reading':
          message = `${activityData.user.name} started reading a new book`;
          break;
        case 'rating':
          message = `${activityData.user.name} rated a book ${activityData.rating} stars`;
          break;
        case 'club_join':
          message = `${activityData.user.name} joined a book club`;
          break;
        default:
          return;
      }

      toast.info(message, 'Community Activity');
    }
  }, [toast]);

  // Subscribe to socket events
  useEffect(() => {
    const unsubscribeMessage = socket.on(SOCKET_EVENTS.NEW_MESSAGE, handleNewMessage);
    const unsubscribeVote = socket.on(SOCKET_EVENTS.VOTE_CAST, handleVoteCast);
    const unsubscribeClub = socket.on(SOCKET_EVENTS.CLUB_UPDATE, handleClubUpdate);
    const unsubscribePresence = socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresenceUpdate);
    const unsubscribeActivity = socket.on(SOCKET_EVENTS.ACTIVITY_UPDATE, handleActivityUpdate);

    return () => {
      unsubscribeMessage();
      unsubscribeVote();
      unsubscribeClub();
      unsubscribePresence();
      unsubscribeActivity();
    };
  }, [handleNewMessage, handleVoteCast, handleClubUpdate, handlePresenceUpdate, handleActivityUpdate]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll
  };
};

ClubNotificationManager.propTypes = {
  userId: PropTypes.string.isRequired,
  subscribedClubs: PropTypes.arrayOf(PropTypes.string)
};

/**
 * NotificationBell Component
 * Visual indicator for notifications
 */
export const NotificationBell = ({ count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
      aria-label={`Notifications ${count > 0 ? `(${count} unread)` : ''}`}
    >
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
};

NotificationBell.propTypes = {
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};

/**
 * NotificationIcon Component
 * Returns appropriate icon for notification type
 */
export const NotificationIcon = ({ type }) => {
  const icons = {
    message: MessageSquare,
    vote: Vote,
    club_update: Users,
    activity: BookOpen
  };

  const Icon = icons[type] || Bell;
  return <Icon className="w-5 h-5" />;
};

NotificationIcon.propTypes = {
  type: PropTypes.string.isRequired
};

export default ClubNotificationManager;

