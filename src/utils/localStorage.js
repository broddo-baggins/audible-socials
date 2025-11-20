import usersData from '../data/users.json';

const STORAGE_KEYS = {
  USER_DATA: 'audible_user_data',
  JOINED_CLUBS: 'audible_joined_clubs',
  FRIENDS: 'audible_friends',
  LIBRARY: 'audible_library',
  CREDITS: 'audible_credits',
  PREMIUM_STATUS: 'audible_premium',
  RATINGS: 'audible_ratings',
  CURRENTLY_READING: 'audible_currently_reading',
  NOTIFICATIONS: 'audible_notifications',
  JOINED_BATTLES: 'audible_joined_battles',
  BATTLE_PROGRESS: 'audible_battle_progress',
};

// User Data
export function getUserData() {
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  if (data) {
    return JSON.parse(data);
  }
  
  // Initialize from users.json if available
  const defaultUser = usersData.find(u => u.id === 'user-me');
  
  if (defaultUser) {
    saveUserData(defaultUser);
    return defaultUser;
  }
  
  // Fallback default user data if users.json is missing 'user-me'
  return {
    id: 'user-me',
    name: 'You',
    isPremium: false,
    credits: 2,
    joinedClubs: [],
    library: ['1', '3', '7', '10', '19', '26'],
    currentlyReading: '1',
    ratings: {
      '26': 5,
      '3': 4,
      '10': 5
    },
    friends: []
  };
}

export function saveUserData(userData) {
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
}

// Club Management
export function getJoinedClubs() {
  const userData = getUserData();
  return userData.joinedClubs || [];
}

export function joinClub(clubId) {
  const userData = getUserData();
  const maxClubs = userData.isPremium ? 3 : 2;
  
  if (userData.joinedClubs.length >= maxClubs) {
    return { success: false, error: `You can only join ${maxClubs} clubs at a time` };
  }
  
  if (!userData.joinedClubs.includes(clubId)) {
    userData.joinedClubs.push(clubId);
    saveUserData(userData);
    return { success: true };
  }
  
  return { success: false, error: 'Already in this club' };
}

export function leaveClub(clubId) {
  const userData = getUserData();
  userData.joinedClubs = userData.joinedClubs.filter(id => id !== clubId);
  saveUserData(userData);
  return { success: true };
}

// Battle Management
export function getJoinedBattles() {
  const data = localStorage.getItem(STORAGE_KEYS.JOINED_BATTLES);
  return data ? JSON.parse(data) : [];
}

export function joinBattle(battleId) {
  const joinedBattles = getJoinedBattles();
  if (!joinedBattles.includes(battleId)) {
    joinedBattles.push(battleId);
    localStorage.setItem(STORAGE_KEYS.JOINED_BATTLES, JSON.stringify(joinedBattles));
    return { success: true };
  }
  return { success: false, error: 'Already in this battle' };
}

export function leaveBattle(battleId) {
  const joinedBattles = getJoinedBattles();
  const updated = joinedBattles.filter(id => id !== battleId);
  localStorage.setItem(STORAGE_KEYS.JOINED_BATTLES, JSON.stringify(updated));
  return { success: true };
}

export function getBattleProgress(battleId) {
  const data = localStorage.getItem(`${STORAGE_KEYS.BATTLE_PROGRESS}_${battleId}`);
  return data ? JSON.parse(data) : {
    progress: 0,
    score: 0,
    lastUpdated: null,
    completed: false
  };
}

export function updateBattleProgress(battleId, progress) {
  const key = `${STORAGE_KEYS.BATTLE_PROGRESS}_${battleId}`;
  localStorage.setItem(key, JSON.stringify({
    ...progress,
    lastUpdated: new Date().toISOString()
  }));
  return { success: true };
}

// Friends Management
export function getFriends() {
  const userData = getUserData();
  return userData.friends || [];
}

export function addFriend(friendId) {
  const userData = getUserData();
  if (!userData.friends) {
    userData.friends = [];
  }
  
  if (!userData.friends.includes(friendId)) {
    userData.friends.push(friendId);
    saveUserData(userData);
    return { success: true };
  }
  
  return { success: false, error: 'Already friends' };
}

export function removeFriend(friendId) {
  const userData = getUserData();
  userData.friends = (userData.friends || []).filter(id => id !== friendId);
  saveUserData(userData);
  return { success: true };
}

// Library Management
export function getLibrary() {
  const userData = getUserData();
  return userData.library || [];
}

export function addToLibrary(bookId) {
  const userData = getUserData();
  if (!userData.library.includes(bookId)) {
    userData.library.push(bookId);
    saveUserData(userData);
    return { success: true };
  }
  return { success: false, error: 'Already in library' };
}

// Credits
export function getCredits() {
  const userData = getUserData();
  return userData.credits || 0;
}

export function spendCredit() {
  const userData = getUserData();
  if (userData.credits > 0) {
    userData.credits--;
    saveUserData(userData);
    return { success: true, remaining: userData.credits };
  }
  return { success: false, error: 'No credits available' };
}

export function addCredits(amount) {
  const userData = getUserData();
  userData.credits = (userData.credits || 0) + amount;
  saveUserData(userData);
  return { success: true, total: userData.credits };
}

// Ratings
export function getRatings() {
  const userData = getUserData();
  return userData.ratings || {};
}

export function rateBook(bookId, rating) {
  const userData = getUserData();
  if (!userData.ratings) {
    userData.ratings = {};
  }
  userData.ratings[bookId] = rating;
  saveUserData(userData);
  return { success: true };
}

// Currently Reading
export function getCurrentlyReading() {
  const userData = getUserData();
  return userData.currentlyReading || null;
}

export function setCurrentlyReading(bookId) {
  const userData = getUserData();
  userData.currentlyReading = bookId;
  saveUserData(userData);
  return { success: true };
}

// Premium Status
export function isPremium() {
  const userData = getUserData();
  return userData.isPremium || false;
}

export function setPremium(status) {
  const userData = getUserData();
  userData.isPremium = status;
  saveUserData(userData);
  return { success: true };
}

// Notifications
export function getNotifications() {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
}

export function addNotification(notification) {
  const notifications = getNotifications();
  const newNotification = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    read: false,
    ...notification
  };
  notifications.unshift(newNotification);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  return newNotification;
}

export function markNotificationAsRead(notificationId) {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
}

export function clearNotifications() {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
}

// Generic localStorage getter
export function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`Error getting data from localStorage for key: ${key}`, error);
    return null;
  }
}

// Generic localStorage setter
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true };
  } catch (error) {
    console.warn(`Error saving data to localStorage for key: ${key}`, error);
    return { success: false, error: error.message };
  }
}
