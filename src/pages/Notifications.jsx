import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Users, UserPlus, BookOpen, Calendar, Check, CheckCheck, X, ArrowRight, Award, CreditCard, TrendingUp } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../utils/notifications';
import { PageHeader, EmptyState } from '../components/ui';

const TYPE_ICON = {
  friend_request: UserPlus,
  friend_accepted: Users,
  friend_recommendation: BookOpen,
  friend_milestone: Users,
  club_event_reminder: Calendar,
  club_new_book: BookOpen,
  credit_expiring: CreditCard,
  trending_among_friends: TrendingUp,
  badge_earned: Award,
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  const diff = Date.now() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (diff < 0 || days > 30) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/**
 * Notifications: a plain divide-y list, newest first. Unread rows carry a
 * highlighter bar at the edge and a "Mark as read" button; every row says
 * when it happened and links to what it is about.
 */
export default function Notifications() {
  const [notifications, setNotifications] = useState(() => getNotifications());
  const refresh = () => setNotifications(getNotifications());

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="page pb-16">
      <PageHeader
        title="Notifications"
        description={unread === 0 ? 'You are all caught up.' : `${unread} unread ${unread === 1 ? 'notification' : 'notifications'}`}
        actions={unread > 0 && (
          <button
            type="button"
            onClick={() => { markAllAsRead(); refresh(); }}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[0.9375rem] font-medium text-ink hover:bg-surface"
          >
            <CheckCheck className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Mark all read
          </button>
        )}
      />

      <section className="max-w-3xl" aria-label="Notification list">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You are all caught up. We will tell you about club events, friend activity and new books."
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
                    <h2 className={`text-ink ${notification.read ? 'font-medium' : 'font-semibold'}`}>
                      {notification.title}
                      {!notification.read && <span className="sr-only"> (unread)</span>}
                    </h2>
                    <p className="mt-1 text-[0.9375rem] text-ink-2">{notification.message}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
                      <time dateTime={notification.timestamp} className="t-meta">{formatTime(notification.timestamp)}</time>
                      {notification.actionUrl && (
                        <Link
                          to={notification.actionUrl}
                          onClick={() => markAsRead(notification.id)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-1 underline-offset-4 hover:decoration-2"
                        >
                          View details <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="mr-1 flex shrink-0 items-center">
                    {!notification.read && (
                      <button
                        type="button"
                        onClick={() => { markAsRead(notification.id); refresh(); }}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface hover:text-ink"
                        aria-label={`Mark "${notification.title}" as read`}
                        title="Mark as read"
                      >
                        <Check className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => { deleteNotification(notification.id); refresh(); }}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-3 hover:bg-surface hover:text-danger"
                      aria-label={`Delete notification: ${notification.title}`}
                      title="Delete"
                    >
                      <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
