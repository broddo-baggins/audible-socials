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
      
      case 'friend_count': {
        const friends = JSON.parse(localStorage.getItem('audible_friends') || '[]');
        eligible = friends.length >= criteria.minFriends;
        break;
      }
      
      case 'club_count':
        eligible = Object.keys(userProgress.clubProgress || {}).length >= criteria.minClubs;
        break;
      
      case 'rating_count': {
        const userData = JSON.parse(localStorage.getItem('audible_user_data'));
        eligible = userData && Object.keys(userData.ratings || {}).length >= criteria.minRatings;
        break;
      }
      
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

      // New club-specific badge types
      case 'club_streak': {
        const clubProgresses = Object.values(userProgress.clubProgress || {});
        clubProgresses.forEach(club => {
          if (club.consecutiveMonthsCompleted >= criteria.consecutiveMonths) {
            eligible = true;
          }
        });
        break;
      }

      case 'club_discussions': {
        const totalDiscussions = Object.values(userProgress.clubProgress || {})
          .reduce((sum, club) => sum + (club.discussionsStarted || 0), 0);
        eligible = totalDiscussions >= criteria.minDiscussions;
        break;
      }

      case 'total_events_attended': {
        const totalEvents = Object.values(userProgress.clubProgress || {})
          .reduce((sum, club) => sum + (club.eventsAttended?.length || 0), 0);
        eligible = totalEvents >= criteria.minEvents;
        break;
      }

      case 'club_membership_duration': {
        const now = new Date();
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.joinedDate) {
            const joinDate = new Date(club.joinedDate);
            const monthsDiff = (now - joinDate) / (1000 * 60 * 60 * 24 * 30);
            if (monthsDiff >= criteria.minMonths) {
              eligible = true;
            }
          }
        });
        break;
      }

      case 'first_to_complete': {
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.firstToComplete && club.firstToComplete >= criteria.count) {
            eligible = true;
          }
        });
        break;
      }

      case 'club_friends': {
        const clubFriends = userProgress.clubFriends || [];
        eligible = clubFriends.length >= criteria.minFriends;
        break;
      }

      case 'club_milestones': {
        const totalMilestones = Object.values(userProgress.clubProgress || {})
          .reduce((sum, club) => sum + (club.milestonesParticipated?.length || 0), 0);
        eligible = totalMilestones >= criteria.minMilestones;
        break;
      }

      case 'club_shares': {
        const totalShares = Object.values(userProgress.clubProgress || {})
          .reduce((sum, club) => sum + (club.booksShared || 0), 0);
        eligible = totalShares >= criteria.minShares;
        break;
      }

      case 'club_listening_hours': {
        const totalHours = Object.values(userProgress.clubProgress || {})
          .reduce((sum, club) => sum + (club.hoursListened || 0), 0);
        eligible = totalHours >= criteria.minHours;
        break;
      }

      case 'celebrity_event': {
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.celebrityEventsAttended && club.celebrityEventsAttended >= criteria.count) {
            eligible = true;
          }
        });
        break;
      }

      case 'early_club_join': {
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.joinedEarly) {
            eligible = true;
          }
        });
        break;
      }

      case 'club_genre_diversity': {
        const genresRead = new Set();
        Object.values(userProgress.clubProgress || {}).forEach(club => {
          if (club.genresRead) {
            club.genresRead.forEach(genre => genresRead.add(genre));
          }
        });
        eligible = genresRead.size >= criteria.minGenres;
        break;
      }
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

// Track when a user completes a club book
export const recordClubBookCompletion = (userId, clubId, bookId, daysEarly = 0, isFirst = false) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    booksShared: 0,
    hoursListened: 0,
    discussionsStarted: 0,
    milestonesParticipated: [],
    genresRead: []
  };

  if (!clubProgress.completedBooks) {
    clubProgress.completedBooks = [];
  }

  if (!clubProgress.completedBooks.includes(bookId)) {
    clubProgress.completedBooks.push(bookId);
  }

  if (isFirst && clubProgress.firstToComplete !== undefined) {
    clubProgress.firstToComplete = (clubProgress.firstToComplete || 0) + 1;
  }

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};

// Track when a user attends a club event
export const recordClubEventAttendance = (userId, clubId, eventId, isCelebrityEvent = false) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    celebrityEventsAttended: 0
  };

  if (!clubProgress.eventsAttended) {
    clubProgress.eventsAttended = [];
  }

  if (!clubProgress.eventsAttended.includes(eventId)) {
    clubProgress.eventsAttended.push(eventId);
  }

  if (isCelebrityEvent) {
    clubProgress.celebrityEventsAttended = (clubProgress.celebrityEventsAttended || 0) + 1;
  }

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};

// Track when a user shares a club book
export const recordClubBookShare = (userId, clubId, bookId, sharedWith) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    booksShared: 0
  };

  clubProgress.booksShared = (clubProgress.booksShared || 0) + 1;

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};

// Track when a user starts a club discussion
export const recordClubDiscussion = (userId, clubId, discussionId) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    discussionsStarted: 0
  };

  clubProgress.discussionsStarted = (clubProgress.discussionsStarted || 0) + 1;

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};

// Track when a user participates in a club milestone
export const recordClubMilestone = (userId, clubId, milestoneId) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    milestonesParticipated: []
  };

  if (!clubProgress.milestonesParticipated) {
    clubProgress.milestonesParticipated = [];
  }

  if (!clubProgress.milestonesParticipated.includes(milestoneId)) {
    clubProgress.milestonesParticipated.push(milestoneId);
  }

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};

// Track listening hours for club books
export const recordClubListeningTime = (userId, clubId, hours) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    hoursListened: 0
  };

  clubProgress.hoursListened = (clubProgress.hoursListened || 0) + hours;

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};

// Track club friend connections
export const recordClubFriend = (userId, friendId, clubId) => {
  const userProgress = getUserProgress(userId);
  
  if (!userProgress.clubFriends) {
    userProgress.clubFriends = [];
  }

  const friendEntry = {
    friendId,
    clubId,
    connectedAt: new Date().toISOString()
  };

  const exists = userProgress.clubFriends.some(f => f.friendId === friendId);
  if (!exists) {
    userProgress.clubFriends.push(friendEntry);
    updateUserProgress(userId, userProgress);
  }

  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { userProgress, newBadges };
};

// Add a genre to club progress tracking
export const recordClubGenre = (userId, clubId, genre) => {
  const clubProgress = getClubProgress(userId, clubId) || {
    clubId,
    progress: 0,
    completedBooks: [],
    eventsAttended: [],
    rsvpedEvents: [],
    badges: [],
    perksUnlocked: [],
    genresRead: []
  };

  if (!clubProgress.genresRead) {
    clubProgress.genresRead = [];
  }

  if (!clubProgress.genresRead.includes(genre)) {
    clubProgress.genresRead.push(genre);
  }

  updateClubProgress(userId, clubId, clubProgress);
  
  // Check for new badges
  const newBadges = checkBadgeEligibility(userId);
  return { clubProgress, newBadges };
};
