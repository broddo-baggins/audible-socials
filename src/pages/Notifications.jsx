import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, X } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../utils/notifications';

export default function Notifications() {
  const [notifications, setNotifications] = useState(() => getNotifications());
  const refresh = () => setNotifications(getNotifications());
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-audible-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-audible-text-primary flex items-center gap-2">
            <Bell className="w-7 h-7" />
            Notifications
          </h1>
          {unread > 0 && (
            <button
              onClick={() => { markAllAsRead(); refresh(); }}
              className="text-sm text-audible-orange font-semibold flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="text-audible-text-secondary">You're all caught up. No notifications.</p>
        ) : (
          <ul className="divide-y divide-audible-gray-200 border border-audible-gray-200 rounded-lg">
            {notifications.map(notification => (
              <li
                key={notification.id}
                className={`p-4 flex items-start gap-3 ${notification.read ? '' : 'bg-purple-50/50'}`}
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-audible-text-primary text-sm">{notification.title}</h2>
                  <p className="text-sm text-audible-text-secondary mt-1">{notification.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <time dateTime={notification.timestamp} className="text-audible-text-tertiary">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </time>
                    {!notification.read && (
                      <button
                        onClick={() => { markAsRead(notification.id); refresh(); }}
                        className="text-purple-600 font-semibold"
                      >
                        Mark read
                      </button>
                    )}
                    {notification.actionUrl && (
                      <Link
                        to={notification.actionUrl}
                        onClick={() => markAsRead(notification.id)}
                        className="text-purple-600 font-semibold"
                      >
                        View
                      </Link>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { deleteNotification(notification.id); refresh(); }}
                  aria-label={`Delete notification: ${notification.title}`}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
