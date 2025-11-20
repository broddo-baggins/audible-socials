const IDLE_GAME_KEY = 'audible_idle_game';

// Activity definitions with their requirements and rewards
export const ACTIVITIES = {
  meditate: {
    name: 'Meditate',
    description: 'Find inner peace while listening',
    icon: 'OM',
    xpPerMinute: 2,
    unlockLevel: 1,
    color: 'from-purple-400 to-indigo-500'
  },
  cook: {
    name: 'Cook',
    description: 'Prepare delicious meals',
    icon: 'CHEF',
    xpPerMinute: 3,
    unlockLevel: 2,
    color: 'from-orange-400 to-red-500'
  },
  clean: {
    name: 'Clean',
    description: 'Keep everything tidy',
    icon: 'DUST',
    xpPerMinute: 4,
    unlockLevel: 3,
    color: 'from-blue-400 to-cyan-500'
  },
  craft: {
    name: 'Craft',
    description: 'Create beautiful handmade items',
    icon: 'ART',
    xpPerMinute: 5,
    unlockLevel: 5,
    color: 'from-green-400 to-emerald-500'
  },
  play_with_cat: {
    name: 'Play with Cat',
    description: 'Spend time with your feline friend',
    icon: 'CAT',
    xpPerMinute: 3,
    unlockLevel: 4,
    color: 'from-pink-400 to-rose-500'
  },
  knit: {
    name: 'Knit',
    description: 'Create cozy knitted items',
    icon: 'KNIT',
    xpPerMinute: 4,
    unlockLevel: 6,
    color: 'from-yellow-400 to-amber-500'
  },
  sit_by_fire: {
    name: 'Sit by Fire',
    description: 'Relax by the warm fireplace',
    icon: 'FIRE',
    xpPerMinute: 2,
    unlockLevel: 1,
    color: 'from-red-400 to-orange-600'
  },
  garden: {
    name: 'Garden',
    description: 'Tend to your garden',
    icon: 'PLANT',
    xpPerMinute: 6,
    unlockLevel: 8,
    color: 'from-green-300 to-lime-500'
  },
  read_books: {
    name: 'Read Books',
    description: 'Read physical books',
    icon: 'BOOK',
    xpPerMinute: 8,
    unlockLevel: 10,
    color: 'from-indigo-400 to-purple-600'
  }
};

// Upgrade Shop - Spend Focus Points to gain permanent bonuses
export const UPGRADES = {
  basic_headphones: {
    id: 'basic_headphones',
    name: 'Basic Headphones',
    description: 'Increase XP gain by 10%',
    cost: 500,
    effect: { type: 'xp_multiplier', value: 1.1 },
    icon: '🎧',
    category: 'equipment'
  },
  premium_headphones: {
    id: 'premium_headphones',
    name: 'Premium Headphones',
    description: 'Increase XP gain by 25%',
    cost: 2000,
    requires: 'basic_headphones',
    effect: { type: 'xp_multiplier', value: 1.25 },
    icon: '🎧',
    category: 'equipment'
  },
  audiophile_setup: {
    id: 'audiophile_setup',
    name: 'Audiophile Setup',
    description: 'Increase XP gain by 50%',
    cost: 5000,
    requires: 'premium_headphones',
    effect: { type: 'xp_multiplier', value: 1.5 },
    icon: '🎧',
    category: 'equipment'
  },
  comfy_chair: {
    id: 'comfy_chair',
    name: 'Comfy Chair',
    description: 'Unlock "Read Books" activity early',
    cost: 1500,
    effect: { type: 'unlock_activity', value: 'read_books' },
    icon: '🪑',
    category: 'furniture'
  },
  cozy_blanket: {
    id: 'cozy_blanket',
    name: 'Cozy Blanket',
    description: 'Increase Focus Points gain by 20%',
    cost: 800,
    effect: { type: 'fp_multiplier', value: 1.2 },
    icon: '🛋️',
    category: 'furniture'
  },
  coffee_maker: {
    id: 'coffee_maker',
    name: 'Coffee Maker',
    description: 'Increase Focus Points gain by 30%',
    cost: 3000,
    effect: { type: 'fp_multiplier', value: 1.3 },
    icon: '☕',
    category: 'consumable'
  },
  bookshelf: {
    id: 'bookshelf',
    name: 'Bookshelf',
    description: 'Increase all gains by 15%',
    cost: 4000,
    effect: { type: 'global_multiplier', value: 1.15 },
    icon: '📚',
    category: 'furniture'
  },
  meditation_cushion: {
    id: 'meditation_cushion',
    name: 'Meditation Cushion',
    description: 'Double XP gain in Meditate activity',
    cost: 1200,
    effect: { type: 'activity_boost', activity: 'meditate', value: 2 },
    icon: '🧘',
    category: 'equipment'
  },
  kitchen_upgrade: {
    id: 'kitchen_upgrade',
    name: 'Kitchen Upgrade',
    description: 'Double XP gain in Cook activity',
    cost: 1500,
    effect: { type: 'activity_boost', activity: 'cook', value: 2 },
    icon: '🍳',
    category: 'equipment'
  },
  garden_tools: {
    id: 'garden_tools',
    name: 'Garden Tools',
    description: 'Double XP gain in Garden activity',
    cost: 2500,
    effect: { type: 'activity_boost', activity: 'garden', value: 2 },
    icon: '🌱',
    category: 'equipment'
  }
};

// Dedicated Idle Game Achievements (separate from main app badges)
export const ACHIEVEMENTS = {
  // Getting Started - Short-term
  getting_started: {
    name: 'Getting Started',
    description: 'Listen for 30 minutes',
    icon: '▶️',
    type: 'listening_time',
    requirement: 30,
    rarity: 'common',
    reward: { type: 'fp', amount: 100 }
  },
  first_hour: {
    name: 'First Hour',
    description: 'Listen for 1 hour total',
    icon: '🎧',
    type: 'listening_time',
    requirement: 60,
    rarity: 'common',
    reward: { type: 'fp', amount: 200 }
  },
  quick_session: {
    name: 'Quick Session',
    description: 'Listen for 2 hours total',
    icon: '⏱️',
    type: 'listening_time',
    requirement: 120,
    rarity: 'common',
    reward: { type: 'fp', amount: 300 }
  },
  dedicated_beginner: {
    name: 'Dedicated Beginner',
    description: 'Listen for 5 hours total',
    icon: '⭐',
    type: 'listening_time',
    requirement: 300,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 500 }
  },

  // Medium-term listening
  bookworm: {
    name: 'Bookworm',
    description: 'Listen for 10 hours total',
    icon: '📖',
    type: 'listening_time',
    requirement: 600,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 1000 }
  },
  audiobook_enthusiast: {
    name: 'Audiobook Enthusiast',
    description: 'Listen for 25 hours total',
    icon: '📚',
    type: 'listening_time',
    requirement: 1500,
    rarity: 'rare',
    reward: { type: 'fp', amount: 2000 }
  },
  dedicated_listener: {
    name: 'Dedicated Listener',
    description: 'Listen for 50 hours total',
    icon: '🎵',
    type: 'listening_time',
    requirement: 3000,
    rarity: 'rare',
    reward: { type: 'fp', amount: 3000 }
  },
  marathon_listener: {
    name: 'Marathon Listener',
    description: 'Listen for 100 hours total',
    icon: '🏃',
    type: 'listening_time',
    requirement: 6000,
    rarity: 'epic',
    reward: { type: 'fp', amount: 5000 }
  },

  // Level-based achievements
  level_5: {
    name: 'Level 5',
    description: 'Reach level 5',
    icon: '🔰',
    type: 'level',
    requirement: 5,
    rarity: 'common',
    reward: { type: 'fp', amount: 500 }
  },
  level_10: {
    name: 'Level 10',
    description: 'Reach level 10',
    icon: '🎖️',
    type: 'level',
    requirement: 10,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 1000 }
  },
  level_25: {
    name: 'Level 25',
    description: 'Reach level 25',
    icon: '🏆',
    type: 'level',
    requirement: 25,
    rarity: 'rare',
    reward: { type: 'fp', amount: 2500 }
  },
  level_50: {
    name: 'Level 50',
    description: 'Reach level 50',
    icon: '👑',
    type: 'level',
    requirement: 50,
    rarity: 'epic',
    reward: { type: 'fp', amount: 5000 }
  },
  level_100: {
    name: 'Level 100',
    description: 'Reach level 100',
    icon: '💎',
    type: 'level',
    requirement: 100,
    rarity: 'legendary',
    reward: { type: 'fp', amount: 10000 }
  },

  // Activity-specific achievements
  the_multitasker: {
    name: 'The Multitasker',
    description: 'Gain 1000 XP in Cook activity',
    icon: '🍳',
    type: 'activity_specific',
    activityId: 'cook',
    requirement: 1000,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 800 }
  },
  zen_master: {
    name: 'Zen Master',
    description: 'Spend 10 hours meditating',
    icon: '🧘',
    type: 'activity_time',
    activityId: 'meditate',
    requirement: 600,
    rarity: 'rare',
    reward: { type: 'fp', amount: 1500 }
  },
  green_thumb: {
    name: 'Green Thumb',
    description: 'Spend 15 hours gardening',
    icon: '🌱',
    type: 'activity_time',
    activityId: 'garden',
    requirement: 900,
    rarity: 'rare',
    reward: { type: 'fp', amount: 2000 }
  },
  cat_whisperer: {
    name: 'Cat Whisperer',
    description: 'Spend 12 hours playing with cat',
    icon: '🐱',
    type: 'activity_time',
    activityId: 'play_with_cat',
    requirement: 720,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 1200 }
  },
  fire_enjoyer: {
    name: 'Fire Enjoyer',
    description: 'Spend 8 hours by the fire',
    icon: '🔥',
    type: 'activity_time',
    activityId: 'sit_by_fire',
    requirement: 480,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 800 }
  },
  craft_master: {
    name: 'Craft Master',
    description: 'Spend 20 hours crafting',
    icon: '🎨',
    type: 'activity_time',
    activityId: 'craft',
    requirement: 1200,
    rarity: 'rare',
    reward: { type: 'fp', amount: 1800 }
  },

  // Currency-based achievements
  focus_collector: {
    name: 'Focus Collector',
    description: 'Earn 5,000 total Focus Points',
    icon: '💰',
    type: 'currency',
    requirement: 5000,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 500 }
  },
  focus_hoarder: {
    name: 'Focus Hoarder',
    description: 'Earn 25,000 total Focus Points',
    icon: '💎',
    type: 'currency',
    requirement: 25000,
    rarity: 'rare',
    reward: { type: 'fp', amount: 2000 }
  },
  focus_master: {
    name: 'Focus Master',
    description: 'Earn 100,000 total Focus Points',
    icon: '🌟',
    type: 'currency',
    requirement: 100000,
    rarity: 'epic',
    reward: { type: 'fp', amount: 5000 }
  },

  // Upgrade-based achievements
  first_purchase: {
    name: 'First Purchase',
    description: 'Buy your first upgrade',
    icon: '🛒',
    type: 'upgrade',
    requirement: 1,
    rarity: 'common',
    reward: { type: 'fp', amount: 300 }
  },
  smart_shopper: {
    name: 'Smart Shopper',
    description: 'Buy 5 upgrades',
    icon: '🛍️',
    type: 'upgrade',
    requirement: 5,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 1000 }
  },
  max_upgrades: {
    name: 'Fully Upgraded',
    description: 'Buy all available upgrades',
    icon: '⚡',
    type: 'upgrade',
    requirement: Object.keys(UPGRADES).length,
    rarity: 'legendary',
    reward: { type: 'fp', amount: 10000 }
  },

  // Special idle-specific achievements
  silence_is_golden: {
    name: 'Silence is Golden',
    description: 'Check idle game while not playing 10 times',
    icon: '🤫',
    type: 'passive_check',
    requirement: 10,
    rarity: 'uncommon',
    reward: { type: 'fp', amount: 500 }
  },
  activity_explorer: {
    name: 'Activity Explorer',
    description: 'Try all available activities',
    icon: '🗺️',
    type: 'activity_count',
    requirement: 9, // All 9 activities
    rarity: 'rare',
    reward: { type: 'fp', amount: 1500 }
  }
};

// Initialize idle game state with new economy fields
export const initializeIdleGame = () => {
  if (!localStorage.getItem(IDLE_GAME_KEY)) {
    const initialState = {
      level: 1,
      experience: 0,
      focusPoints: 0,
      totalFocusPointsEarned: 0,
      totalMinutesListened: 0,
      currentActivity: 'meditate',
      unlockedActivities: ['meditate', 'sit_by_fire'],
      achievements: [],
      purchasedUpgrades: [],
      multipliers: {
        xp: 1,
        fp: 1,
        global: 1
      },
      activityBoosts: {},
      activityStats: {
        meditate: 0,
        cook: 0,
        clean: 0,
        craft: 0,
        play_with_cat: 0,
        knit: 0,
        sit_by_fire: 0,
        garden: 0,
        read_books: 0
      },
      lastActivityChange: Date.now(),
      passiveChecks: 0,
      character: {
        name: 'Listener',
        appearance: 'default',
        accessories: []
      }
    };
    localStorage.setItem(IDLE_GAME_KEY, JSON.stringify(initialState));
  } else {
    // Migration: Add new fields to existing saves
    const state = JSON.parse(localStorage.getItem(IDLE_GAME_KEY));
    let needsUpdate = false;

    if (state.focusPoints === undefined) {
      state.focusPoints = 0;
      state.totalFocusPointsEarned = 0;
      needsUpdate = true;
    }
    if (state.purchasedUpgrades === undefined) {
      state.purchasedUpgrades = [];
      needsUpdate = true;
    }
    if (state.multipliers === undefined) {
      state.multipliers = { xp: 1, fp: 1, global: 1 };
      needsUpdate = true;
    }
    if (state.activityStats === undefined) {
      state.activityStats = {
        meditate: 0,
        cook: 0,
        clean: 0,
        craft: 0,
        play_with_cat: 0,
        knit: 0,
        sit_by_fire: 0,
        garden: 0,
        read_books: 0
      };
      needsUpdate = true;
    }
    if (state.passiveChecks === undefined) {
      state.passiveChecks = 0;
      needsUpdate = true;
    }
    if (state.activityBoosts === undefined) {
      state.activityBoosts = {};
      needsUpdate = true;
    }

    if (needsUpdate) {
      localStorage.setItem(IDLE_GAME_KEY, JSON.stringify(state));
    }
  }
};

export const getIdleGameState = () => {
  initializeIdleGame();
  return JSON.parse(localStorage.getItem(IDLE_GAME_KEY));
};

export const updateIdleGameState = (updates) => {
  const currentState = getIdleGameState();
  const newState = { ...currentState, ...updates };
  localStorage.setItem(IDLE_GAME_KEY, JSON.stringify(newState));
  return newState;
};

export const getExperienceToNextLevel = (currentLevel) => {
  return currentLevel * 1000; // 1000 XP per level
};

export const getExperienceProgress = (currentExperience, currentLevel) => {
  const currentLevelXP = (currentLevel - 1) * 1000;
  const nextLevelXP = currentLevel * 1000;
  const progressXP = currentExperience - currentLevelXP;
  const neededXP = nextLevelXP - currentLevelXP;
  return Math.min((progressXP / neededXP) * 100, 100);
};

// Get upgrades by category
export const getUpgradesByCategory = (category) => {
  return Object.values(UPGRADES).filter(u => u.category === category);
};

// Check if upgrade is available for purchase
export const isUpgradeAvailable = (upgradeId, gameState) => {
  const upgrade = UPGRADES[upgradeId];
  if (!upgrade) return false;
  
  // Already purchased
  if (gameState.purchasedUpgrades.includes(upgradeId)) return false;
  
  // Check requirements
  if (upgrade.requires && !gameState.purchasedUpgrades.includes(upgrade.requires)) {
    return false;
  }
  
  // Check if can afford
  return gameState.focusPoints >= upgrade.cost;
};
