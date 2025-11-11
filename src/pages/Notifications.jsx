import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Users, BookOpen, Calendar, Check, Trash2 } from 'lucide-react';
import { getNotifications, markNotificationAsRead, clearNotifications, addNotification } from '../utils/localStorage';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
    
    // Add some demo notifications if empty
    const existing = getNotifications();
    if (existing.length === 0) {
      addNotification({
        type: 'club_event',
        title: 'Live Q&A with Andy Weir',
        message: 'Join the Sci-Fi Sundays club for an exclusive author chat tonight at 7 PM',
        clubId: '1',
        actionUrl: '/club/1'
      });
      
      addNotification({
        type: 'friend_activity',
        title: 'Emma Richardson finished a book',
        message: 'Emma just finished "Project Hail Mary" and rated it 5 stars',
        actionUrl: '/book/1'
      });
      
      addNotification({
        type: 'club_new_book',
        title: 'New book in Mystery Mondays',
        message: 'The club is now reading "The Silent Patient". Join the discussion!',
        clubId: '2',
        actionUrl: '/club/2'
      });
      
      loadNotifications();
    }
  }, []);

  const loadNotifications = () => {
    setNotifications(getNotifications());
  };

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      clearNotifications();
      loadNotifications();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'club_event':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'club_new_book':
        return <BookOpen className="w-5 h-5 text-audible-orange" />;
      case 'friend_activity':
        return <Users className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Bell className="w-10 h-10 mr-3 text-audible-orange" />
                Notifications
              </h1>
              <p className="text-gray-600">
                {notifications.filter(n => !n.read).length} unread notifications
              </p>
            </div>
            
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Notifications List */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-600 mb-6">
              We'll notify you about club events, friend activity, and new books
            </p>
            <Link
              to="/clubs"
              className="inline-block bg-audible-orange text-white px-6 py-3 rounded-full font-semibold hover:bg-audible-orange-dark transition-colors"
            >
              Explore Book Clubs
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                  notification.read
                    ? 'border-transparent'
                    : 'border-audible-orange/20 bg-audible-cream/30'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      notification.read ? 'bg-gray-100' : 'bg-white'
                    }`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-audible-orange transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="inline-block mt-3 text-sm font-semibold text-audible-orange hover:text-audible-orange-dark"
                        >
                          View Details →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

