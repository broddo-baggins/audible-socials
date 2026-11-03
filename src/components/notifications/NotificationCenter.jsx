import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Bell, X, Check, Users, Star, Calendar, Gift, Trophy, TrendingUp, CreditCard, BookOpen } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../../utils/notifications';

/**
 * NotificationCenter: the bell's slide-over. A right-side sheet on paper,
 * each notification a surface row; unread rows carry a highlighter dot and
 * a bold title. A modal dialog: focus moves in, Tab stays inside, Escape
 * or the scrim closes it and focus returns to the bell.
 */
const ICONS = {
  friend_request: Users,
  friend_accepted: Users,
  friend_recommendation: Star,
  club_event_reminder: Calendar,
  club_new_book: BookOpen,
  friend_milestone: Gift,
  badge_earned: Trophy,
  trending_among_friends: TrendingUp,
  credit_expiring: CreditCard,
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

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const loadNotifications = useCallback(() => {
    setNotifications(getNotifications());
    setUnreadCount(getUnreadCount());
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [isOpen, loadNotifications]);

  // The header passes a new onClose each render; keep the latest without re-running the effect
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Focus in, Escape to close, keep Tab inside, restore focus on close
  useEffect(() => {
    if (!isOpen) return undefined;
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      if (previous && typeof previous.focus === 'function') previous.focus();
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-ink/40 animate-fade-in" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notifications-title"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-paper shadow-[var(--shadow-2)] animate-fade-in"
      >
        <div className="border-b border-line px-5 pb-4 pt-5">
          <div className="flex items-center justify-between gap-4">
            <h2 id="notifications-title" className="t-h2 text-ink">Notifications</h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-2 hover:bg-surface-sunk hover:text-ink"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>

          <div className="mt-1 flex min-h-9 items-center justify-between gap-4">
            <p className="text-sm text-ink-2" aria-live="polite">
              {unreadCount > 0
                ? <><span className="font-semibold text-ink tabular">{unreadCount}</span> unread notification{unreadCount > 1 ? 's' : ''}</>
                : 'You are all caught up'}
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink hover:bg-surface"
              >
                <Check className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3">
          {notifications.length === 0 ? (
            <div className="m-2 flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong px-6 py-10">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunk text-ink-2">
                <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="t-h3 text-ink">No notifications</h3>
              <p className="text-[0.9375rem] text-ink-2">Friend requests, club reminders and badges will show up here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {notifications.map((notification) => {
                const Icon = ICONS[notification.type] || Bell;
                const unread = !notification.read;
                return (
                  <li
                    key={notification.id}
                    className={`rounded-lg border bg-surface p-4 ${unread ? 'border-line-strong/50' : 'border-line'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="relative mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-sunk text-ink">
                        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} aria-hidden="true" />
                        {unread && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-hl ring-2 ring-surface" aria-hidden="true" />}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`text-[0.9375rem] leading-snug text-ink ${unread ? 'font-bold' : 'font-medium'}`}>
                            {unread && <span className="sr-only">Unread: </span>}
                            {notification.title}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleDelete(notification.id)}
                            aria-label={`Delete notification: ${notification.title}`}
                            className="-mr-2 -mt-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-3 hover:bg-danger-wash hover:text-danger"
                          >
                            <X className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </div>

                        <p className={`mt-0.5 text-sm ${unread ? 'text-ink' : 'text-ink-2'}`}>{notification.message}</p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <span className="t-meta">{getTimeAgo(notification.timestamp)}</span>
                          <div className="flex items-center gap-1">
                            {unread && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="inline-flex h-8 items-center rounded-full px-3 text-[0.8125rem] font-medium text-ink-2 hover:bg-surface-sunk hover:text-ink"
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
                                className="inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-[0.8125rem] font-medium text-paper hover:bg-gray-800"
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
