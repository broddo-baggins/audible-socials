/**
 * Bot Activity Engine
 * Simulates multi-user activity for a lively community feel
 */

import mockUsersData from '../data/mockUsers.json';
import usersData from '../data/users.json';
import socket from './socket';

// Combine all available users for bot simulation
const ALL_USERS = [...mockUsersData, ...usersData.filter(u => u.id !== 'user-me')];

/**
 * Get random bot user
 * @returns {Object} Random user object
 */
function getRandomBot() {
  return ALL_USERS[Math.floor(Math.random() * ALL_USERS.length)];
}

/**
 * Get random delay between min and max seconds
 * @param {number} minSeconds - Minimum delay in seconds
 * @param {number} maxSeconds - Maximum delay in seconds
 * @returns {number} Delay in milliseconds
 */
function getRandomDelay(minSeconds = 5, maxSeconds = 30) {
  return (minSeconds + Math.random() * (maxSeconds - minSeconds)) * 1000;
}

/**
 * Generate random bot reply to a discussion
 * @param {string} originalMessage - The message being replied to
 * @returns {string} Bot reply
 */
function generateBotReply(originalMessage) {
  const replies = [
    "I totally agree with this perspective!",
    "That's an interesting take. I hadn't thought of it that way.",
    "Great point! This really adds depth to the discussion.",
    "I had a similar reaction when I got to that part.",
    "This is exactly what I was thinking!",
    "Thanks for sharing this insight!",
    "I'm curious to hear what others think about this.",
    "This reminds me of another book I read recently.",
    "The author did such a great job with this section.",
    "I can't wait to see where this goes!",
    "This chapter really stood out to me too.",
    "I appreciate you bringing this up for discussion.",
    "That's a really thoughtful observation.",
    "I'm glad someone else noticed this detail!",
    "This is one of my favorite parts so far."
  ];
  
  return replies[Math.floor(Math.random() * replies.length)];
}

/**
 * Simulate bot reply to a discussion post
 * @param {string} clubId - Club ID
 * @param {string} discussionId - Discussion ID
 * @param {string} originalMessage - Original message
 * @param {Function} callback - Callback with bot reply data
 */
export function simulateBotReply(clubId, discussionId, originalMessage, callback) {
  const delay = getRandomDelay(10, 45);
  
  setTimeout(() => {
    const bot = getRandomBot();
    const reply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: bot.id,
      userName: bot.name,
      userAvatar: bot.avatar,
      content: generateBotReply(originalMessage),
      timestamp: new Date().toISOString(),
      isBot: true
    };

    // Broadcast via socket
    socket.broadcastMessage(clubId, {
      discussionId,
      reply
    });

    // Call callback if provided
    if (callback) {
      callback(reply);
    }
  }, delay);
}

/**
 * Simulate bot voting on a book
 * @param {string} clubId - Club ID
 * @param {string} bookId - Book ID being voted on
 * @param {Function} callback - Callback with vote data
 */
export function simulateBotVote(clubId, bookId, callback) {
  const delay = getRandomDelay(15, 60);
  
  setTimeout(() => {
    const bot = getRandomBot();
    const vote = {
      userId: bot.id,
      userName: bot.name,
      bookId,
      timestamp: new Date().toISOString(),
      isBot: true
    };

    // Broadcast via socket
    socket.emit('vote_cast', {
      clubId,
      vote
    });

    // Call callback if provided
    if (callback) {
      callback(vote);
    }
  }, delay);
}

/**
 * Simulate bot activity in the activity feed
 * @param {Function} callback - Callback with activity data
 */
export function simulateBotActivity(callback) {
  const delay = getRandomDelay(30, 120);
  
  setTimeout(() => {
    const bot = getRandomBot();
    const activityTypes = ['reading', 'rating', 'club_join'];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    const activity = {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: activityType,
      user: bot,
      timestamp: Date.now(),
      isBot: true
    };

    // Add type-specific data
    if (activityType === 'rating') {
      activity.rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
    }

    // Broadcast via socket
    socket.broadcastActivity(activityType, activity);

    // Call callback if provided
    if (callback) {
      callback(activity);
    }

    // Schedule next activity
    simulateBotActivity(callback);
  }, delay);
}

/**
 * Simulate typing indicator
 * @param {string} clubId - Club ID
 * @param {number} duration - Duration in milliseconds
 */
export function simulateTypingIndicator(clubId, duration = 3000) {
  const bot = getRandomBot();
  
  socket.broadcastPresence(bot.id, 'typing', {
    clubId,
    userName: bot.name
  });

  setTimeout(() => {
    socket.broadcastPresence(bot.id, 'idle', {
      clubId,
      userName: bot.name
    });
  }, duration);
}

/**
 * Start bot activity engine
 * Begins simulating random bot activities
 */
export function startBotActivityEngine() {
  // Start activity simulation
  simulateBotActivity();
  
  console.log('[Bot Activity] Engine started - simulating community activity');
}

/**
 * Trigger bot reactions to user action
 * @param {string} actionType - Type of action (post, vote, etc.)
 * @param {Object} context - Context data
 */
export function triggerBotReactions(actionType, context) {
  const { clubId, discussionId, message, bookId } = context;
  
  // Randomly decide if bots should react (30% chance)
  if (Math.random() > 0.3) {
    return;
  }

  switch (actionType) {
    case 'discussion_post':
      // 1-2 bots might reply
      const replyCount = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < replyCount; i++) {
        simulateBotReply(clubId, discussionId, message);
      }
      break;
      
    case 'vote_cast':
      // 1-3 bots might also vote
      const voteCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < voteCount; i++) {
        simulateBotVote(clubId, bookId);
      }
      break;
      
    default:
      break;
  }
}

export default {
  simulateBotReply,
  simulateBotVote,
  simulateBotActivity,
  simulateTypingIndicator,
  startBotActivityEngine,
  triggerBotReactions
};

