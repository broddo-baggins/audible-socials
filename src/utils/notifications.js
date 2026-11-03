import notificationsData from '../data/notifications.json';

const NOTIFICATIONS_KEY = 'audible_notifications';

export const initializeNotifications = () => {
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notificationsData));
  }
};

export const getNotifications = (userId = 'user-me') => {
  initializeNotifications();
  const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  return notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const getUnreadNotifications = (userId = 'user-me') => {
  return getNotifications(userId).filter(n => !n.read);
};

export const getUnreadCount = (userId = 'user-me') => {
  return getUnreadNotifications(userId).length;
};

export const markAsRead = (notificationId) => {
  const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return { success: true };
  }
  
  return { success: false };
};

export const markAllAsRead = (userId = 'user-me') => {
  const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  notifications.forEach(n => {
    if (n.userId === userId) {
      n.read = true;
    }
  });
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return { success: true };
};

export const deleteNotification = (notificationId) => {
  const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  const filtered = notifications.filter(n => n.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
  return { success: true };
};

export const createNotification = (notification) => {
  initializeNotifications();
  const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
  
  const newNotification = {
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    read: false,
    ...notification
  };
  
  notifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  
  return { success: true, notification: newNotification };
};

export const createFriendAcceptedNotification = (userId, acceptedUserName) => {
  return createNotification({
    userId,
    type: 'friend_accepted',
    title: 'Friend Request Accepted',
    message: `${acceptedUserName} accepted your friend request`,
    actionUrl: '/clubs/friends'
  });
};

export const createFriendRejectedNotification = (userId, rejectedUserName) => {
  return createNotification({
    userId,
    type: 'friend_rejected',
    title: 'Friend Request Declined',
    message: `${rejectedUserName} declined your friend request`,
    actionUrl: '/clubs/friends'
  });
};

