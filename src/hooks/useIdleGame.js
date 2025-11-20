import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getIdleGameState,
  updateIdleGameState,
  ACTIVITIES,
  ACHIEVEMENTS,
  UPGRADES,
  getExperienceProgress
} from '../utils/idleGame';

/**
 * Custom hook to manage Idle Game state and logic
 * Handles game loop, persistence, XP/FP calculation, and activity switching
 */
export const useIdleGame = (isPlaying = false, currentBook = null) => {
  const [gameState, setGameState] = useState(getIdleGameState());
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const intervalRef = useRef(null);
  const floatingTextIdRef = useRef(0);
  
  // Initialize lastActiveTime from saved state if available, otherwise now
  const lastActiveTimeRef = useRef(
    gameState.lastSaveTime && !isNaN(gameState.lastSaveTime) 
      ? gameState.lastSaveTime 
      : Date.now()
  );

  // Add floating text notification
  const addFloatingText = useCallback((text, type = 'xp') => {
    const id = floatingTextIdRef.current++;
    const newText = {
      id,
      text,
      type,
      x: Math.random() * 100 + 150, // Random x position
      y: Math.random() * 50 + 200   // Random y position
    };
    setFloatingTexts(prev => [...prev, newText]);
    
    // Remove after animation completes
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1500);
  }, []);

  // Calculate rewards for a listening period
  const calculateRewards = useCallback((minutes, state) => {
    const currentActivity = ACTIVITIES[state.currentActivity];
    if (!currentActivity) return { xpGained: 0, fpGained: 0 };

    // Calculate XP with multipliers (xp multiplier + activity boost + global multiplier)
    const baseXP = minutes * currentActivity.xpPerMinute;
    const xpMultiplier = state.multipliers.xp || 1;
    const activityBoost = state.activityBoosts?.[state.currentActivity] || 1;
    const globalMultiplier = state.multipliers.global || 1;
    const xpGained = Math.floor(baseXP * xpMultiplier * activityBoost * globalMultiplier);

    // Calculate Focus Points (10 per minute, affected by multipliers)
    const baseFP = minutes * 10;
    const fpMultiplier = state.multipliers.fp || 1;
    const fpGained = Math.floor(baseFP * fpMultiplier * globalMultiplier);

    return { xpGained, fpGained };
  }, []);

  // Check for newly unlocked achievements
  const checkAchievements = useCallback((state) => {
    const newlyUnlocked = [];
    
    Object.entries(ACHIEVEMENTS).forEach(([id, achievement]) => {
      if (state.achievements.includes(id)) return;
      
      let shouldUnlock = false;

      switch (achievement.type) {
        case 'listening_time':
          shouldUnlock = state.totalMinutesListened >= achievement.requirement;
          break;
        
        case 'level':
          shouldUnlock = state.level >= achievement.requirement;
          break;
        
        case 'activity_time': {
          const activityMinutes = state.activityStats[achievement.activityId] || 0;
          shouldUnlock = activityMinutes >= achievement.requirement;
          break;
        }
        
        case 'activity_specific':
          // Handle special conditions like "gain X XP in Y activity"
          if (achievement.activityId && state.currentActivity === achievement.activityId) {
            const activityXP = state.activityStats[`${achievement.activityId}_xp`] || 0;
            shouldUnlock = activityXP >= achievement.requirement;
          }
          break;
        
        case 'currency':
          shouldUnlock = state.totalFocusPointsEarned >= achievement.requirement;
          break;
        
        case 'upgrade':
          shouldUnlock = state.purchasedUpgrades.length >= achievement.requirement;
          break;
        
        case 'passive_check':
          // Count times game was checked while not playing
          shouldUnlock = (state.passiveChecks || 0) >= achievement.requirement;
          break;
        
        default:
          shouldUnlock = false;
      }

      if (shouldUnlock) {
        newlyUnlocked.push({ ...achievement, id });
      }
    });

    return newlyUnlocked;
  }, []);

  // Process listening time and update state
  const processListeningTime = useCallback((minutes) => {
    if (minutes <= 0) return;

    const state = getIdleGameState();
    const { xpGained, fpGained } = calculateRewards(minutes, state);
    
    const newExperience = state.experience + xpGained;
    const newLevel = Math.floor(newExperience / 1000) + 1;
    const newFocusPoints = state.focusPoints + fpGained;
    const newTotalFP = (state.totalFocusPointsEarned || 0) + fpGained;
    const newTotalMinutes = state.totalMinutesListened + minutes;

    // Update activity-specific stats
    const activityStats = { ...state.activityStats };
    const currentActivityId = state.currentActivity;
    activityStats[currentActivityId] = (activityStats[currentActivityId] || 0) + minutes;
    activityStats[`${currentActivityId}_xp`] = (activityStats[`${currentActivityId}_xp`] || 0) + xpGained;

    // Check for newly unlocked activities
    const unlockedActivities = [...state.unlockedActivities];
    Object.keys(ACTIVITIES).forEach(activityId => {
      const activity = ACTIVITIES[activityId];
      if (activity.unlockLevel <= newLevel && !unlockedActivities.includes(activityId)) {
        unlockedActivities.push(activityId);
      }
    });

    // Update state
    const updatedState = {
      ...state,
      level: newLevel,
      experience: newExperience,
      focusPoints: newFocusPoints,
      totalFocusPointsEarned: newTotalFP,
      totalMinutesListened: newTotalMinutes,
      unlockedActivities,
      activityStats,
      lastSaveTime: Date.now() // Update last save time on every tick
    };

    // Check for achievements
    const newAchievements = checkAchievements(updatedState);
    if (newAchievements.length > 0) {
      updatedState.achievements = [...updatedState.achievements, ...newAchievements.map(a => a.id)];
      setNewAchievements(prev => [...prev, ...newAchievements]);
      
      // Clear achievement notifications after 5 seconds
      setTimeout(() => {
        setNewAchievements([]);
      }, 5000);
    }

    updateIdleGameState(updatedState);
    setGameState(updatedState);

    // Add floating text for rewards
    if (xpGained > 0) {
      addFloatingText(`+${xpGained} XP`, 'xp');
    }
    if (fpGained > 0) {
      addFloatingText(`+${fpGained} FP`, 'fp');
    }
  }, [calculateRewards, checkAchievements, addFloatingText]);

  // Function to calculate and award offline progress
  const processOfflineProgress = useCallback(() => {
    const now = Date.now();
    const lastActive = lastActiveTimeRef.current;
    
    // Only calculate if meaningful time has passed (more than 1 minute)
    // And lastActive is valid (not 0 or future)
    if (now <= lastActive) return;
    
    const offlineTimeMs = now - lastActive;
    const offlineMinutes = Math.floor(offlineTimeMs / (1000 * 60)); // Convert to minutes

    // Cap offline progress to prevent abuse (max 24 hours = 1440 minutes)
    const cappedMinutes = Math.min(offlineMinutes, 1440);

    // Check if we should award progress (only if offline progress is allowed when app was closed)
    // STRICT MODE: Only award progress if isPlaying was true when tab was hidden/closed.
    // Since we can't reliably know if it was playing when closed (state lost), 
    // we rely on lastSaveTime update. 
    // However, for "background tab" (visibility change), we can check current isPlaying prop.
    // But processOfflineProgress is called on mount too.
    
    // Logic Update: We will NOT award offline progress on mount (app closed) to strictly enforce "only when playing".
    // We WILL award progress if the tab was just hidden and audio kept playing (visibility change).
    
    // But wait, if audio plays in background tab, the interval loop SHOULD keep running in most modern browsers
    // unless heavily throttled. If throttled, this catch-up logic helps.
    
    // If the user wants "only when playing", then "app closed" progress is technically cheating unless
    // we assume they were listening on another device (which we don't track).
    // So we will DISABLE large offline jumps on mount, but keep small jumps for tab switching.
    
    // Modification: Only run this logic if called from visibility change AND isPlaying is true.
    // Or if on mount, maybe disable it? 
    // Let's restrict it: cappedMinutes > 0 && isPlaying is required.
    // Since isPlaying is false on initial mount usually (unless persisted), this naturally disables app-closed progress.
    
    if (cappedMinutes > 0) {
       // We pass isPlaying to this hook, so we can check it.
       // But inside useCallback, we need to ensure we have the latest isPlaying.
       // It's in the dependency array.
       
       // Note: On strict reload, isPlaying is false. So no progress.
       // On tab switch, isPlaying remains true. So progress is awarded.
       // This matches "only when playing".
       
       // However, we need to access 'isPlaying' inside here.
       // The hook scope has 'isPlaying'.
       
       if (isPlaying) {
          console.log(`🎮 Calculating ${cappedMinutes} minutes of background progress...`);

          // Show loading notification for offline progress
          addFloatingText('⏳ Syncing progress...', 'info');

          // Calculate and award offline progress
          const currentState = getIdleGameState();
          const rewards = calculateRewards(cappedMinutes, currentState);
          
          if (rewards.xpGained > 0 || rewards.fpGained > 0) {
            // Update state with offline rewards
            const updatedState = updateIdleGameState({
              experience: currentState.experience + rewards.xpGained,
              focusPoints: currentState.focusPoints + rewards.fpGained,
              totalMinutesListened: currentState.totalMinutesListened + cappedMinutes,
              lastSaveTime: now
            });

            // Check for level ups and achievements
            const newLevel = Math.floor(updatedState.experience / 1000) + 1;
            if (newLevel > currentState.level) {
              updatedState.level = newLevel;
              addFloatingText(`🎉 Level ${newLevel}!`, 'level');
            }

            // Check for achievements using existing logic
            const achievementsResult = checkAchievements(updatedState);
            if (achievementsResult.length > 0) {
              updatedState.achievements = [...updatedState.achievements, ...achievementsResult.map(a => a.id)];
              setNewAchievements(achievementsResult);
              
              // Clear achievement notifications
              setTimeout(() => {
                setNewAchievements([]);
              }, 5000);
              
              // Persist achievement updates
              updateIdleGameState(updatedState);
            }

            setGameState(updatedState);

            // Show offline progress notification
            const timeString = cappedMinutes < 60
              ? `${cappedMinutes}m`
              : `${Math.floor(cappedMinutes / 60)}h ${cappedMinutes % 60}m`;

            addFloatingText(`⏰ +${timeString} catch-up!`, 'info');
            addFloatingText(`⭐ +${rewards.xpGained} XP`, 'xp');
            if (rewards.fpGained > 0) {
              addFloatingText(`🎯 +${rewards.fpGained} FP`, 'fp');
            }

            console.log(`✅ Awarded ${timeString} background progress: ${rewards.xpGained} XP, ${rewards.fpGained} FP`);
          }
       }
    }

    // Update last active time to now
    lastActiveTimeRef.current = now;
  }, [calculateRewards, checkAchievements, addFloatingText, isPlaying]);

  // Run offline progress check on mount
  useEffect(() => {
    processOfflineProgress();
  }, [processOfflineProgress]);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying && !sessionStartTime) {
      setSessionStartTime(Date.now());
    } else if (!isPlaying && sessionStartTime) {
      // Calculate listening time when audio stops
      const listeningTime = Math.floor((Date.now() - sessionStartTime) / (1000 * 60));
      processListeningTime(listeningTime);
      setSessionStartTime(null);
    }
  }, [isPlaying, sessionStartTime, processListeningTime]);

  // Game loop - update every minute while playing
  useEffect(() => {
    const updateGame = () => {
      if (isPlaying && sessionStartTime) {
        const minutesElapsed = Math.floor((Date.now() - sessionStartTime) / (1000 * 60));
        if (minutesElapsed > 0) {
          processListeningTime(1); // Process 1 minute at a time
          setSessionStartTime(Date.now()); // Reset for next minute
        }
      }
    };

    intervalRef.current = setInterval(updateGame, 60000); // Update every minute

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, sessionStartTime, processListeningTime]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is now hidden - save state and record time
        const now = Date.now();
        lastActiveTimeRef.current = now;
        updateIdleGameState({ lastSaveTime: now });
      } else {
        // Page is now visible - calculate offline progress
        processOfflineProgress();
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [processOfflineProgress]);

  // Change current activity
  const changeActivity = useCallback((activityId) => {
    const state = getIdleGameState();
    if (state.unlockedActivities.includes(activityId)) {
      const updatedState = updateIdleGameState({
        currentActivity: activityId,
        lastActivityChange: Date.now()
      });
      setGameState(updatedState);
      return true;
    }
    return false;
  }, []);

  // Purchase an upgrade
  const purchaseUpgrade = useCallback((upgradeId) => {
    const state = getIdleGameState();
    const upgrade = UPGRADES[upgradeId];
    
    if (!upgrade) return { success: false, error: 'Upgrade not found' };
    
    // Check if already purchased
    if (state.purchasedUpgrades.includes(upgradeId)) {
      return { success: false, error: 'Already purchased' };
    }
    
    // Check if can afford
    if (state.focusPoints < upgrade.cost) {
      return { success: false, error: 'Not enough Focus Points' };
    }
    
    // Check if requirements met
    if (upgrade.requires) {
      const reqUpgrade = upgrade.requires;
      if (!state.purchasedUpgrades.includes(reqUpgrade)) {
        return { success: false, error: 'Requirements not met' };
      }
    }

    // Apply upgrade
    const newFocusPoints = state.focusPoints - upgrade.cost;
    const purchasedUpgrades = [...state.purchasedUpgrades, upgradeId];
    const multipliers = { ...state.multipliers };
    
    // Apply upgrade effects
    const unlockedActivities = [...state.unlockedActivities];
    const activityBoosts = { ...(state.activityBoosts || {}) };

    if (upgrade.effect.type === 'xp_multiplier') {
      multipliers.xp = (multipliers.xp || 1) * upgrade.effect.value;
    } else if (upgrade.effect.type === 'fp_multiplier') {
      multipliers.fp = (multipliers.fp || 1) * upgrade.effect.value;
    } else if (upgrade.effect.type === 'global_multiplier') {
      multipliers.global = (multipliers.global || 1) * upgrade.effect.value;
    } else if (upgrade.effect.type === 'unlock_activity') {
      // Unlock a specific activity
      if (!unlockedActivities.includes(upgrade.effect.value)) {
        unlockedActivities.push(upgrade.effect.value);
      }
    } else if (upgrade.effect.type === 'activity_boost') {
      // Boost a specific activity
      const activityId = upgrade.effect.activity;
      activityBoosts[activityId] = (activityBoosts[activityId] || 1) * upgrade.effect.value;
    }

    const updatedState = updateIdleGameState({
      focusPoints: newFocusPoints,
      purchasedUpgrades,
      multipliers,
      unlockedActivities,
      activityBoosts
    });
    
    setGameState(updatedState);
    addFloatingText(`Purchased: ${upgrade.name}`, 'upgrade');
    
    return { success: true, upgrade };
  }, [addFloatingText]);

  // Track passive checks (when user views game while not playing)
  useEffect(() => {
    if (!isPlaying) {
      const state = getIdleGameState();
      const updatedState = updateIdleGameState({
        passiveChecks: (state.passiveChecks || 0) + 1
      });
      setGameState(updatedState);
    }
  }, [isPlaying]);

  // Get experience progress for current level
  const progressPercent = getExperienceProgress(gameState.experience, gameState.level);

  return {
    gameState,
    isPlaying,
    currentBook,
    progressPercent,
    floatingTexts,
    newAchievements,
    changeActivity,
    purchaseUpgrade,
    processListeningTime
  };
};
