import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Users, BookOpen, Calendar, Check, Trash2, ArrowRight } from 'lucide-react';
import { getNotifications, markNotificationAsRead, clearNotifications, addNotification } from '../utils/localStorage';
import { PageHeader, EmptyState } from '../components/ui';

const TYPE_ICON = {
  club_event: Calendar,
  club_new_book: BookOpen,
  friend_activity: Users,
};

/**
 * Notifications: a plain divide-y list, newest first. Unread rows carry a
 * highlighter bar at the edge and a "Mark as read" button; every row says
 * when it happened and links to what it is about.
 */
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
        message: 'The club is now reading "The Silent Patient". Join the discussion.',
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
    if (window.confirm('Clear all notifications?')) {
      clearNotifications();
      loadNotifications();
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

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="page pb-16">
      <PageHeader
        title="Notifications"
        description={unread === 0 ? 'You are all caught up.' : `${unread} unread ${unread === 1 ? 'notification' : 'notifications'}`}
        actions={notifications.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-danger hover:bg-danger-wash"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Clear all
          </button>
        )}
      />

      <section className="max-w-3xl" aria-label="Notification list">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications yet"
            description="We will tell you about club events, friend activity and new books."
            action="Explore book clubs"
            actionTo="/clubs"
          />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {notifications.map((notification) => {
              const Icon = TYPE_ICON[notification.type] || Bell;
              return (
                <li key={notification.id} className={`relative flex items-start gap-4 py-5 pl-4 ${notification.read ? '' : 'bg-hl-wash/60'}`}>
                  {!notification.read && <span className="absolute inset-y-3 left-0 w-[3px] rounded-full bg-hl ring-1 ring-ink/10" aria-hidden="true" />}
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.read ? 'bg-surface-sunk text-ink-2' : 'bg-ink text-paper'}`}>
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className={`text-ink ${notification.read ? 'font-medium' : 'font-semibold'}`}>
                      {notification.title}
                      {!notification.read && <span className="sr-only"> (unread)</span>}
                    </h3>
                    <p className="mt-1 text-[0.9375rem] text-ink-2">{notification.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
                      <span className="t-meta">{formatTime(notification.timestamp)}</span>
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          className="inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2"
                        >
                          View details <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {!notification.read && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-surface hover:text-ink"
                      aria-label={`Mark "${notification.title}" as read`}
                      title="Mark as read"
                    >
                      <Check className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
