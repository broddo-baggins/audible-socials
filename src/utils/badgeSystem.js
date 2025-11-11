import badgesData from '../data/badges.json';
import userProgressData from '../data/userProgress.json';

const USER_PROGRESS_KEY = 'audible_user_progress';

export const initializeUserProgress = () => {
  if (!localStorage.getItem(USER_PROGRESS_KEY)) {
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(userProgressData));
  }
};

export const getUserProgress = (userId = 'user-me') => {
  initializeUserProgress();
  const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '[]');
  const userProgress = allProgress.find(p => p.userId === userId);
  
  if (!userProgress) {
    const newProgress = {
      userId,
      clubProgress: {},
      listeningStats: {
        totalHours: 0,
        booksCompleted: 0,
        averageSpeed: 1.0,
        streakDays: 0,
        longestStreak: 0,
        favoriteGenres: [],
        listeningTimes: { morning: 0, afternoon: 0, evening: 0, night: 0 }
      },
      earnedBadges: []
    };
    allProgress.push(newProgress);
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress));
    return newProgress;
  }
  
  return userProgress;
};

export const updateUserProgress = (userId, updates) => {
  const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '[]');
  const index = allProgress.findIndex(p => p.userId === userId);
  
  if (index >= 0) {
    allProgress[index] = { ...allProgress[index], ...updates };
  } else {
    allProgress.push({ userId, ...updates });
  }
  
  localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress));
  return allProgress[index >= 0 ? index : allProgress.length - 1];
};

export const updateClubProgress = (userId, clubId, progressData) => {
  const userProgress = getUserProgress(userId);
  
  if (!userProgress.clubProgress) {
    userProgress.clubProgress = {};
  }
  
  userProgress.clubProgress[clubId] = {
    ...userProgress.clubProgress[clubId],
    ...progressData,
    lastActivity: new Date().toISOString()
  };
  
  return updateUserProgress(userId, userProgress);
};

export const checkBadgeEligibility = (userId) => {
  const userProgress = getUserProgress(userId);
  const earnedBadgeIds = userProgress.earnedBadges.map(b => b.badgeId);
  const newBadges = [];

  badgesData.forEach(badge => {
    if (earnedBadgeIds.includes(badge.id)) return;

    const { criteria } = badge;
    let eligible = false;

    switch (criteria.type) {
      case 'complete_book_early':
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.completedBooks && club.completedBooks.length > 0) {
            eligible = true;
          }
        });
        break;
      
      case 'speed_listening':
        eligible = userProgress.listeningStats.averageSpeed >= criteria.minSpeed;
        break;
      
      case 'friend_count':
        const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');
        eligible = friends.length >= criteria.minFriends;
        break;
      
      case 'club_count':
        eligible = Object.keys(userProgress.clubProgress || {}).length >= criteria.minClubs;
        break;
      
      case 'rating_count':
        const userData = JSON.parse(localStorage.getItem('audible_user_data'));
        eligible = userData && Object.keys(userData.ratings || {}).length >= criteria.minRatings;
        break;
      
      case 'event_attendance':
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.eventsAttended && club.rsvpedEvents) {
            const rate = (club.eventsAttended.length / club.rsvpedEvents.length) * 100;
            if (rate >= criteria.attendanceRate) {
              eligible = true;
            }
          }
        });
        break;
    }

    if (eligible) {
      newBadges.push({
        badgeId: badge.id,
        earnedAt: new Date().toISOString()
      });
    }
  });

  if (newBadges.length > 0) {
    userProgress.earnedBadges = [...userProgress.earnedBadges, ...newBadges];
    updateUserProgress(userId, userProgress);
  }

  return newBadges;
};

export const getAllBadges = () => {
  return badgesData;
};

export const getUserBadges = (userId = 'user-me') => {
  const userProgress = getUserProgress(userId);
  return userProgress.earnedBadges.map(earned => {
    const badge = badgesData.find(b => b.id === earned.badgeId);
    return { ...badge, ...earned };
  });
};

export const getClubProgress = (userId, clubId) => {
  const userProgress = getUserProgress(userId);
  return userProgress.clubProgress?.[clubId] || null;
};

export const unlockPerk = (userId, clubId, perkId) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: []
  };

  if (!clubProgress.perksUnlocked.includes(perkId)) {
    clubProgress.perksUnlocked.push(perkId);
    updateClubProgress(userId, clubId, clubProgress);
    return { success: true, perk: perkId };
  }

  return { success: false, error: 'Perk already unlocked' };
};

export const hasUnlockedPerk = (userId, clubId, perkId) => {
  const clubProgress = getClubProgress(userId, clubId);
  return clubProgress?.perksUnlocked?.includes(perkId) || false;
};

