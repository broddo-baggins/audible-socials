import friendRequestsData from '../data/friendRequests.json';
import blockedUsersData from '../data/blockedUsers.json';

const FRIEND_REQUESTS_KEY = 'audible_friend_requests';
const BLOCKED_USERS_KEY = 'audible_blocked_users';

export const initializeFriendData = () => {
  if (!localStorage.getItem(FRIEND_REQUESTS_KEY)) {
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(friendRequestsData));
  }
  if (!localStorage.getItem(BLOCKED_USERS_KEY)) {
    localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blockedUsersData));
  }
};

export const getFriendRequests = (userId = 'user-me') => {
  initializeFriendData();
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  return requests.filter(req => 
    (req.toUserId === userId && req.status === 'pending') ||
    (req.fromUserId === userId)
  );
};

export const getPendingRequests = (userId = 'user-me') => {
  initializeFriendData();
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  return requests.filter(req => req.toUserId === userId && req.status === 'pending');
};

export const getSentRequests = (userId = 'user-me') => {
  initializeFriendData();
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  return requests.filter(req => req.fromUserId === userId && req.status === 'pending');
};

export const sendFriendRequest = (toUserId, message = '', relationshipContext = null, extraData = {}) => {
  initializeFriendData();
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  const blocked = isUserBlocked(toUserId) || isBlockedByUser(toUserId);
  
  if (blocked) {
    return { success: false, error: 'Cannot send request to this user' };
  }

  const existing = requests.find(req => 
    (req.fromUserId === 'user-me' && req.toUserId === toUserId && req.status === 'pending') ||
    (req.fromUserId === toUserId && req.toUserId === 'user-me' && req.status === 'pending')
  );

  if (existing) {
    return { success: false, error: 'Request already exists' };
  }

  const newRequest = {
    id: `fr-${Date.now()}`,
    fromUserId: 'user-me',
    toUserId,
    status: 'pending',
    timestamp: new Date().toISOString(),
    message,
    relationshipContext, // 'book_club', 'similar_taste', 'family', 'real_life', 'influencer'
    ...extraData
  };

  requests.push(newRequest);
  localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));
  
  return { success: true, request: newRequest };
};

export const acceptFriendRequest = (requestId) => {
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  const request = requests.find(req => req.id === requestId);
  
  if (!request || request.status !== 'pending') {
    return { success: false, error: 'Request not found' };
  }

  request.status = 'accepted';
  request.acceptedAt = new Date().toISOString();
  localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));

  const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');
  if (!friends.includes(request.fromUserId)) {
    friends.push(request.fromUserId);
    localStorage.setItem('audible_friends', JSON.stringify(friends));
  }

  return { success: true, userId: request.fromUserId };
};

export const rejectFriendRequest = (requestId) => {
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  const request = requests.find(req => req.id === requestId);
  
  if (!request) {
    return { success: false, error: 'Request not found' };
  }

  request.status = 'rejected';
  request.rejectedAt = new Date().toISOString();
  localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));

  return { success: true };
};

export const cancelFriendRequest = (requestId) => {
  const requests = JSON.parse(localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]');
  const filtered = requests.filter(req => req.id !== requestId);
  localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(filtered));
  return { success: true };
};

export const blockUser = (userId, reason = '') => {
  initializeFriendData();
  const blocked = JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY) || '[]');
  
  const existing = blocked.find(b => b.userId === 'user-me' && b.blockedUserId === userId);
  if (existing) {
    return { success: false, error: 'User already blocked' };
  }

  const newBlock = {
    id: `block-${Date.now()}`,
    userId: 'user-me',
    blockedUserId: userId,
    timestamp: new Date().toISOString(),
    reason
  };

  blocked.push(newBlock);
  localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(blocked));

  const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');
  const filteredFriends = friends.filter(id => id !== userId);
  localStorage.setItem('audible_friends', JSON.stringify(filteredFriends));

  return { success: true };
};

export const unblockUser = (userId) => {
  const blocked = JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY) || '[]');
  const filtered = blocked.filter(b => !(b.userId === 'user-me' && b.blockedUserId === userId));
  localStorage.setItem(BLOCKED_USERS_KEY, JSON.stringify(filtered));
  return { success: true };
};

export const isUserBlocked = (userId) => {
  initializeFriendData();
  const blocked = JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY) || '[]');
  return blocked.some(b => b.userId === 'user-me' && b.blockedUserId === userId);
};

export const isBlockedByUser = (userId) => {
  initializeFriendData();
  const blocked = JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY) || '[]');
  return blocked.some(b => b.userId === userId && b.blockedUserId === 'user-me');
};

export const getBlockedUsers = () => {
  initializeFriendData();
  const blocked = JSON.parse(localStorage.getItem(BLOCKED_USERS_KEY) || '[]');
  return blocked.filter(b => b.userId === 'user-me');
};

export const getFriendsOfFriends = (currentUserId = 'user-me', allUsers = []) => {
  const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');

  // Get all friends of current user's friends (excluding current user and direct friends)
  const friendsOfFriends = new Set();

  friends.forEach(friendId => {
    const friend = allUsers.find(u => u.id === friendId);
    if (friend && friend.friends) {
      friend.friends.forEach(fofId => {
        // Don't include current user or direct friends
        if (fofId !== currentUserId && !friends.includes(fofId)) {
          friendsOfFriends.add(fofId);
        }
      });
    }
  });

  // Convert back to user objects and add mutual friend info
  return Array.from(friendsOfFriends).map(userId => {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return null;

    // Find mutual friends
    const mutualFriends = friends.filter(friendId => {
      const friend = allUsers.find(u => u.id === friendId);
      return friend && friend.friends && friend.friends.includes(userId);
    });

    return {
      ...user,
      mutualFriends: mutualFriends.length,
      mutualFriendList: mutualFriends.slice(0, 3).map(id => allUsers.find(u => u.id === id)?.name).filter(Boolean)
    };
  }).filter(Boolean);
};

export const getClubFriends = (clubId, allUsers = []) => {
  const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');

  // Get users who are in this club
  const clubMembers = allUsers.filter(user =>
    user.joinedClubs && user.joinedClubs.includes(clubId)
  );

  // Separate friends who are in the club vs friends of friends who are in the club
  const directFriendsInClub = clubMembers.filter(user => friends.includes(user.id));
  const friendsOfFriendsInClub = clubMembers.filter(user => !friends.includes(user.id));

  return {
    allMembers: clubMembers,
    directFriends: directFriendsInClub,
    friendsOfFriends: friendsOfFriendsInClub,
    hasFriends: directFriendsInClub.length > 0,
    hasFriendsOfFriends: friendsOfFriendsInClub.length > 0
  };
};

export const getSuggestedFriends = (currentUserId = 'user-me', allUsers = []) => {
  const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');
  const blocked = getBlockedUsers().map(b => b.blockedUserId);
  const pending = getPendingRequests();
  const sent = getSentRequests();

  const pendingIds = [...pending.map(r => r.fromUserId), ...sent.map(r => r.toUserId)];

  // Get friends of friends first (prioritize them)
  const friendsOfFriends = getFriendsOfFriends(currentUserId, allUsers)
    .filter(user =>
      !blocked.includes(user.id) &&
      !pendingIds.includes(user.id)
    )
    .sort((a, b) => b.mutualFriends - a.mutualFriends); // Sort by most mutual friends

  // Get other suggestions
  const otherSuggestions = allUsers.filter(user =>
    user.id !== currentUserId &&
    !friends.includes(user.id) &&
    !blocked.includes(user.id) &&
    !pendingIds.includes(user.id) &&
    !friendsOfFriends.some(fof => fof.id === user.id) // Don't duplicate
  );

  // Return friends of friends first, then other suggestions
  return [...friendsOfFriends, ...otherSuggestions];
};
