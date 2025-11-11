import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, Check, Users, Star, Calendar, Gift, Trophy, TrendingUp, CreditCard, BookOpen } from 'lucide-react';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification 
} from '../../utils/notifications';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, [isOpen]);

  const loadNotifications = () => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  };

  const handleMarkAsRead = (id) => {
    markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    loadNotifications();
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    loadNotifications();
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays > 7) return then.toLocaleDateString();
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMins > 0) return `${diffMins}m ago`;
    return 'Just now';
  };

  const getIcon = (type) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'friend_request':
      case 'friend_accepted':
        return <Users className={iconClass} />;
      case 'friend_recommendation':
        return <Star className={iconClass} />;
      case 'club_event_reminder':
        return <Calendar className={iconClass} />;
      case 'club_new_book':
        return <BookOpen className={iconClass} />;
      case 'friend_milestone':
        return <Gift className={iconClass} />;
      case 'badge_earned':
        return <Trophy className={iconClass} />;
      case 'trending_among_friends':
        return <TrendingUp className={iconClass} />;
      case 'credit_expiring':
        return <CreditCard className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'friend_request':
      case 'friend_accepted':
        return 'from-blue-400 to-purple-400';
      case 'friend_recommendation':
        return 'from-yellow-400 to-orange-400';
      case 'club_event_reminder':
        return 'from-purple-400 to-pink-400';
      case 'badge_earned':
        return 'from-yellow-500 to-yellow-600';
      case 'trending_among_friends':
        return 'from-orange-400 to-red-400';
      case 'credit_expiring':
        return 'from-red-400 to-pink-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Bell className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Notifications</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {unreadCount > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-white/90 text-sm">
                  {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                </p>
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-white/90 hover:text-white font-semibold flex items-center space-x-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Bell className="w-16 h-16 mb-4 text-gray-400" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-purple-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full bg-gradient-to-br ${getColor(notification.type)} text-white flex-shrink-0`}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                              >
                                Mark read
                              </button>
                            )}
                            
                            {notification.actionUrl && (
                              <Link
                                to={notification.actionUrl}
                                onClick={() => {
                                  handleMarkAsRead(notification.id);
                                  onClose();
                                }}
                                className="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

