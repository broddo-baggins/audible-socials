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
  PRIVATE_CLUBS: 'audible_private_clubs',
  CLUB_DISCUSSIONS: 'audible_club_discussions',
  CLUB_VOTES: 'audible_club_votes',
  CLUB_EVENTS: 'audible_club_events',
};

// Parse a stored JSON value; corrupt or unreadable entries fall back instead of crashing the app.
function readJSON(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    console.warn(`Ignoring unreadable localStorage value for key: ${key}`, error);
    return fallback;
  }
}

// User Data
export function getUserData() {
  const stored = readJSON(STORAGE_KEYS.USER_DATA, null);
  if (stored && typeof stored === 'object') {
    return { joinedClubs: [], library: [], friends: [], ...stored };
  }

  // Initialize from users.json if available. Clone it so callers that mutate
  // the returned object never change the imported users.json module data.
  const defaultUser = usersData.find(u => u.id === 'user-me');

  if (defaultUser) {
    const user = structuredClone(defaultUser);
    saveUserData(user);
    return user;
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

  // If it's a private club, also update the club data
  if (clubId.startsWith('private-')) {
    const clubs = getPrivateClubs();
    const clubIndex = clubs.findIndex(c => c.id === clubId);
    if (clubIndex !== -1) {
      clubs[clubIndex].members = clubs[clubIndex].members.filter(id => id !== userData.id);
      savePrivateClubs(clubs);
    }
  }

  return { success: true };
}

// Private Club Management
export function getPrivateClubs() {
  return readJSON(STORAGE_KEYS.PRIVATE_CLUBS, []);
}

export function savePrivateClubs(clubs) {
  localStorage.setItem(STORAGE_KEYS.PRIVATE_CLUBS, JSON.stringify(clubs));
}

export function createPrivateClub(clubData) {
  const clubs = getPrivateClubs();
  const newClub = {
    id: `private-${Date.now()}`,
    ...clubData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  clubs.push(newClub);
  savePrivateClubs(clubs);

  // Auto-join the creator
  joinClub(newClub.id);

  return { success: true, club: newClub };
}

// Club Discussions (private clubs)
export function getClubDiscussions(clubId) {
  return readJSON(`${STORAGE_KEYS.CLUB_DISCUSSIONS}_${clubId}`, []);
}

export function addClubDiscussion(clubId, discussion) {
  const discussions = getClubDiscussions(clubId);
  const newDiscussion = {
    id: `disc-${Date.now()}`,
    timestamp: new Date().toISOString(),
    replies: [],
    ...discussion
  };

  discussions.unshift(newDiscussion);
  localStorage.setItem(`${STORAGE_KEYS.CLUB_DISCUSSIONS}_${clubId}`, JSON.stringify(discussions));

  return { success: true, discussion: newDiscussion };
}

export function addDiscussionReply(clubId, discussionId, reply) {
  const discussions = getClubDiscussions(clubId);
  const discussion = discussions.find(d => d.id === discussionId);

  if (!discussion) {
    return { success: false, error: 'Discussion not found' };
  }

  const newReply = {
    id: `reply-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...reply
  };

  discussion.replies = [...(discussion.replies || []), newReply];
  localStorage.setItem(`${STORAGE_KEYS.CLUB_DISCUSSIONS}_${clubId}`, JSON.stringify(discussions));

  return { success: true, reply: newReply };
}

// Club Voting (private clubs)
export function getClubVotes(clubId) {
  return readJSON(`${STORAGE_KEYS.CLUB_VOTES}_${clubId}`, {});
}

export function castClubVote(clubId, bookId, userId) {
  const votes = getClubVotes(clubId);

  // One vote per member: drop any earlier vote first
  Object.keys(votes).forEach(book => {
    votes[book] = votes[book].filter(id => id !== userId);
  });
  votes[bookId] = [...(votes[bookId] || []), userId];

  localStorage.setItem(`${STORAGE_KEYS.CLUB_VOTES}_${clubId}`, JSON.stringify(votes));

  return { success: true, votes };
}

// Club Events (private clubs)
export function getClubEvents(clubId) {
  return readJSON(`${STORAGE_KEYS.CLUB_EVENTS}_${clubId}`, []);
}

export function createClubEvent(clubId, eventData) {
  const events = getClubEvents(clubId);
  const newEvent = {
    id: `event-${Date.now()}`,
    createdAt: new Date().toISOString(),
    attendees: [eventData.host],
    ...eventData
  };

  events.push(newEvent);
  localStorage.setItem(`${STORAGE_KEYS.CLUB_EVENTS}_${clubId}`, JSON.stringify(events));

  return { success: true, event: newEvent };
}

export function rsvpClubEvent(clubId, eventId, userId, attending) {
  const events = getClubEvents(clubId);
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return { success: false, error: 'Event not found' };
  }

  const attendees = (event.attendees || []).filter(id => id !== userId);
  event.attendees = attending ? [...attendees, userId] : attendees;
  event.rsvpCount = event.attendees.length;
  localStorage.setItem(`${STORAGE_KEYS.CLUB_EVENTS}_${clubId}`, JSON.stringify(events));

  return { success: true, event };
}

// Battle Management
export function getJoinedBattles() {
  return readJSON(STORAGE_KEYS.JOINED_BATTLES, []);
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

export function addToLibrary(bookId) {
  const userData = getUserData();
  if (!userData.library.includes(bookId)) {
    userData.library.push(bookId);
    saveUserData(userData);
    return { success: true };
  }
  return { success: false, error: 'Already in library' };
}

// Add or remove a book; returns whether it is now on the wishlist.
export function toggleWishlist(bookId) {
  const userData = getUserData();
  const wishlist = userData.wishlist || [];
  const onList = wishlist.includes(bookId);
  userData.wishlist = onList ? wishlist.filter(id => id !== bookId) : [...wishlist, bookId];
  saveUserData(userData);
  return !onList;
}

// Buy a book with one credit: adds it to the library and spends the credit together.
export function purchaseBook(bookId) {
  const userData = getUserData();
  if (userData.library.includes(bookId)) {
    return { success: false, error: 'Already in library' };
  }
  if (!(userData.credits > 0)) {
    return { success: false, error: 'No credits available' };
  }
  userData.library.push(bookId);
  userData.credits--;
  saveUserData(userData);
  return { success: true, user: userData };
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

// Generic localStorage getter
// Demo sign-out: forget this browser's user so the next visit starts from the default demo user.
export function signOut() {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
}

export function getFromLocalStorage(key) {
  return readJSON(key, null);
}

