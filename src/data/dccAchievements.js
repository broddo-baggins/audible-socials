export const DCC_ACHIEVEMENTS = {
  // ------------------- LISTENING TIME (15) -------------------
  started_listening: {
    name: "AUDIO PIONEER",
    description: "You listened to a book for 1 minute. Every journey begins with a single word.",
    icon: "👂",
    type: "listening_time",
    requirement: 1,
    rarity: "common",
    reward: { type: "fp", amount: 10 }
  },
  warm_up: {
    name: "GETTING COMFY",
    description: "30 minutes of listening. Settle in, this is going to be good.",
    icon: "🛋️",
    type: "listening_time",
    requirement: 30,
    rarity: "common",
    reward: { type: "fp", amount: 50 }
  },
  hour_one: {
    name: "STORYTELLER'S APPRENTICE",
    description: "You made it one hour. The plot thickens!",
    icon: "⭐",
    type: "listening_time",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  two_hours: {
    name: "IMMERSED LISTENER",
    description: "2 hours. You're really getting into it now.",
    icon: "🐠",
    type: "listening_time",
    requirement: 120,
    rarity: "uncommon",
    reward: { type: "fp", amount: 200 }
  },
  five_hours: {
    name: "CHAPTER CHAMPION",
    description: "5 hours. The world around you fades away.",
    icon: "🏛️",
    type: "listening_time",
    requirement: 300,
    rarity: "uncommon",
    reward: { type: "fp", amount: 500 }
  },
  ten_hours: {
    name: "NARRATIVE NAVIGATOR",
    description: "10 hours. You're charting a course through stories.",
    icon: "🧭",
    type: "listening_time",
    requirement: 600,
    rarity: "uncommon",
    reward: { type: "fp", amount: 1000 }
  },
  twenty_four: {
    name: "AUDIO ADVENTURER",
    description: "24 hours. A full day of stories! What a journey.",
    icon: "🌍",
    type: "listening_time",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 2400 }
  },
  fifty_hours: {
    name: "LORE KEEPER",
    description: "50 hours. Your mind is a library of tales.",
    icon: "📚",
    type: "listening_time",
    requirement: 3000,
    rarity: "rare",
    reward: { type: "fp", amount: 5000 }
  },
  hundred_hours: {
    name: "SAGA SEEKER",
    description: "100 hours. Epic stories require epic dedication.",
    icon: "💯",
    type: "listening_time",
    requirement: 6000,
    rarity: "epic",
    reward: { type: "fp", amount: 10000 }
  },
  two_fifty: {
    name: "MASTER OF TALES",
    description: "250 hours. You've lived a thousand lives through books.",
    icon: "🧙‍♂️",
    type: "listening_time",
    requirement: 15000,
    rarity: "epic",
    reward: { type: "fp", amount: 25000 }
  },
  five_hundred: {
    name: "LIBRARY LEGEND",
    description: "500 hours. Your knowledge grows with every word.",
    icon: "🏰",
    type: "listening_time",
    requirement: 30000,
    rarity: "legendary",
    reward: { type: "fp", amount: 50000 }
  },
  one_thousand: {
    name: "ARCHMAGE OF AUDIO",
    description: "1000 hours. The spoken word is your domain.",
    icon: "🔮",
    type: "listening_time",
    requirement: 60000,
    rarity: "legendary",
    reward: { type: "fp", amount: 100000 }
  },
  two_thousand: {
    name: "CHRONICLER OF AGES",
    description: "2000 hours. Your wisdom rivals the ancients.",
    icon: "📜",
    type: "listening_time",
    requirement: 120000,
    rarity: "legendary",
    reward: { type: "fp", amount: 200000 }
  },
  five_thousand: {
    name: "VOICE OF THE COSMOS",
    description: "5000 hours. You hear the universe's story.",
    icon: "🌌",
    type: "listening_time",
    requirement: 300000,
    rarity: "godly",
    reward: { type: "fp", amount: 500000 }
  },
  ten_thousand: {
    name: "ETERNAL LISTENER",
    description: "10,000 hours. Time flows like a river of words.",
    icon: "⏳",
    type: "listening_time",
    requirement: 600000,
    rarity: "godly",
    reward: { type: "fp", amount: 1000000 }
  },

  // ------------------- LEVELS (10) -------------------
  level_2: {
    name: "LEVEL 2 HERO",
    description: "Level 2. You've taken the first step into a larger world.",
    icon: "🌱",
    type: "level",
    requirement: 2,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  level_5: {
    name: "RISING STAR",
    description: "Level 5. You're getting the hang of this!",
    icon: "🌟",
    type: "level",
    requirement: 5,
    rarity: "common",
    reward: { type: "fp", amount: 250 }
  },
  level_10: {
    name: "TENACIOUS TEN",
    description: "Level 10. Double digits! Keep climbing.",
    icon: "🧗",
    type: "level",
    requirement: 10,
    rarity: "uncommon",
    reward: { type: "fp", amount: 500 }
  },
  level_20: {
    name: "EXPERIENCED EXPLORER",
    description: "Level 20. New horizons await.",
    icon: "🔭",
    type: "level",
    requirement: 20,
    rarity: "uncommon",
    reward: { type: "fp", amount: 1000 }
  },
  level_30: {
    name: "SEASONED VETERAN",
    description: "Level 30. You've seen quite a bit now.",
    icon: "🛡️",
    type: "level",
    requirement: 30,
    rarity: "rare",
    reward: { type: "fp", amount: 1500 }
  },
  level_42: {
    name: "THE ANSWER",
    description: "Level 42. You're figuring it all out.",
    icon: "🐬",
    type: "level",
    requirement: 42,
    rarity: "rare",
    reward: { type: "fp", amount: 2000 }
  },
  level_50: {
    name: "HALFWAY HERO",
    description: "Level 50. A significant milestone on your journey.",
    icon: "🏔️",
    type: "level",
    requirement: 50,
    rarity: "epic",
    reward: { type: "fp", amount: 2500 }
  },
  level_69: {
    name: "BALANCED BEING",
    description: "Level 69. Perfect harmony.",
    icon: "☯️",
    type: "level",
    requirement: 69,
    rarity: "epic",
    reward: { type: "fp", amount: 6969 }
  },
  level_75: {
    name: "DIAMOND TIER",
    description: "Level 75. You shine bright like a diamond.",
    icon: "💎",
    type: "level",
    requirement: 75,
    rarity: "legendary",
    reward: { type: "fp", amount: 7500 }
  },
  level_100: {
    name: "CENTENNIAL SAGE",
    description: "Level 100. A century of levels. Incredible!",
    icon: "🎂",
    type: "level",
    requirement: 100,
    rarity: "godly",
    reward: { type: "fp", amount: 10000 }
  },

  // ------------------- ACTIVITIES (25) -------------------
  // Meditate
  zen_1: {
    name: "MINDFUL MOMENT",
    description: "Meditated for 1 hour. Peace begins with a pause.",
    icon: "🧘",
    type: "activity_time",
    activityId: "meditate",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  zen_master: {
    name: "TRANQUILITY",
    description: "Meditated for 24 hours. You have found your center.",
    icon: "💮",
    type: "activity_time",
    activityId: "meditate",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Cook
  chef_boy: {
    name: "CULINARY STUDENT",
    description: "Cooked for 1 hour. Something smells good!",
    icon: "🍳",
    type: "activity_time",
    activityId: "cook",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  gordon: {
    name: "MASTER CHEF",
    description: "Cooked for 24 hours. A feast fit for a king.",
    icon: "👨‍🍳",
    type: "activity_time",
    activityId: "cook",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Clean
  janitor: {
    name: "TIDY UP",
    description: "Cleaned for 1 hour. A fresh start.",
    icon: "🧹",
    type: "activity_time",
    activityId: "clean",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  sparkle: {
    name: "SPARKLING CLEAN",
    description: "Cleaned for 24 hours. Everything shines brighter now.",
    icon: "✨",
    type: "activity_time",
    activityId: "clean",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Craft
  glue_eater: {
    name: "CRAFTY HANDS",
    description: "Crafted for 1 hour. Making things is magic.",
    icon: "🎨",
    type: "activity_time",
    activityId: "craft",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  master_builder: {
    name: "ARTISAN",
    description: "Crafted for 24 hours. You create wonders.",
    icon: "🔨",
    type: "activity_time",
    activityId: "craft",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Cat
  pspsps: {
    name: "FELINE FRIEND",
    description: "Played with cat for 1 hour. Purrfect.",
    icon: "🐱",
    type: "activity_time",
    activityId: "play_with_cat",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  servant: {
    name: "CAT COMPANION",
    description: "Played with cat for 24 hours. Best friends furever.",
    icon: "🐾",
    type: "activity_time",
    activityId: "play_with_cat",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Knit
  grandma: {
    name: "COZY KNITTER",
    description: "Knitted for 1 hour. Warm and fuzzy feelings.",
    icon: "🧶",
    type: "activity_time",
    activityId: "knit",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  scarf_lord: {
    name: "WEAVER OF WARMTH",
    description: "Knitted for 24 hours. Wrapping the world in comfort.",
    icon: "🧣",
    type: "activity_time",
    activityId: "knit",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Fire
  pyro: {
    name: "WARM HEARTH",
    description: "Sat by fire for 1 hour. So cozy.",
    icon: "🔥",
    type: "activity_time",
    activityId: "sit_by_fire",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  toasty: {
    name: "KEEPER OF THE FLAME",
    description: "Sat by fire for 24 hours. The fire within burns bright.",
    icon: "🕯️",
    type: "activity_time",
    activityId: "sit_by_fire",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Garden
  touch_grass: {
    name: "NATURE LOVER",
    description: "Gardened for 1 hour. Growth is good.",
    icon: "🌱",
    type: "activity_time",
    activityId: "garden",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  forest: {
    name: "FOREST GUARDIAN",
    description: "Gardened for 24 hours. You are one with nature.",
    icon: "🌳",
    type: "activity_time",
    activityId: "garden",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Reading
  traitor: {
    name: "HYBRID READER",
    description: "Read a physical book for 1 hour. Eyes and ears working in harmony.",
    icon: "📖",
    type: "activity_time",
    activityId: "read_books",
    requirement: 60,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  library: {
    name: "SCHOLAR",
    description: "Read physical books for 24 hours. A true love for literature.",
    icon: "👓",
    type: "activity_time",
    activityId: "read_books",
    requirement: 1440,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  // Activity Collection
  jack_of_all: {
    name: "ENTHUSIAST",
    description: "Unlocked 3 activities. Exploring your options.",
    icon: "🃏",
    type: "activity_count",
    requirement: 3,
    rarity: "common",
    reward: { type: "fp", amount: 200 }
  },
  halfway_there: {
    name: "VERSATILE",
    description: "Unlocked 5 activities. You can do it all!",
    icon: "🌈",
    type: "activity_count",
    requirement: 5,
    rarity: "uncommon",
    reward: { type: "fp", amount: 400 }
  },
  completionist: {
    name: "RENAISSANCE SOUL",
    description: "Unlocked all activities. A master of many talents.",
    icon: "🎨",
    type: "activity_count",
    requirement: 9,
    rarity: "epic",
    reward: { type: "fp", amount: 1000 }
  },

  // ------------------- CURRENCY & SHOP (15) -------------------
  penny_pincher: {
    name: "SAVER",
    description: "Earned 100 Focus Points. A penny saved is a penny earned.",
    icon: "🪙",
    type: "currency",
    requirement: 100,
    rarity: "common",
    reward: { type: "fp", amount: 10 }
  },
  piggy_bank: {
    name: "NEST EGG",
    description: "Earned 1,000 Focus Points. Building a bright future.",
    icon: "🐷",
    type: "currency",
    requirement: 1000,
    rarity: "common",
    reward: { type: "fp", amount: 100 }
  },
  wallet_fat: {
    name: "PROSPERITY",
    description: "Earned 5,000 Focus Points. Success looks good on you.",
    icon: "💼",
    type: "currency",
    requirement: 5000,
    rarity: "uncommon",
    reward: { type: "fp", amount: 500 }
  },
  money_bags: {
    name: "WEALTH",
    description: "Earned 10,000 Focus Points. Abundance flows.",
    icon: "💰",
    type: "currency",
    requirement: 10000,
    rarity: "rare",
    reward: { type: "fp", amount: 1000 }
  },
  scrooge: {
    name: "FORTUNE",
    description: "Earned 50,000 Focus Points. A fortune of focus.",
    icon: "🏦",
    type: "currency",
    requirement: 50000,
    rarity: "epic",
    reward: { type: "fp", amount: 5000 }
  },
  consumer: {
    name: "INVESTOR",
    description: "Bought your first upgrade. Investing in yourself.",
    icon: "📈",
    type: "upgrade",
    requirement: 1,
    rarity: "common",
    reward: { type: "fp", amount: 50 }
  },
  shopper: {
    name: "COLLECTOR",
    description: "Bought 3 upgrades. Gathering useful tools.",
    icon: "🛍️",
    type: "upgrade",
    requirement: 3,
    rarity: "common",
    reward: { type: "fp", amount: 150 }
  },
  hoarder: {
    name: "CURATOR",
    description: "Bought 5 upgrades. A fine collection.",
    icon: "🏛️",
    type: "upgrade",
    requirement: 5,
    rarity: "uncommon",
    reward: { type: "fp", amount: 300 }
  },
  maxed_out: {
    name: "COMPLETIONIST",
    description: "Bought all upgrades. You have everything you need.",
    icon: "🏆",
    type: "upgrade",
    requirement: 10,
    rarity: "legendary",
    reward: { type: "fp", amount: 1000 }
  },
  
  // ------------------- SPECIAL / SECRET (8) -------------------
  stalker: {
    name: "CHECKING IN",
    description: "Checked the idle game 10 times while offline. Thanks for visiting!",
    icon: "👋",
    type: "passive_check",
    requirement: 10,
    rarity: "uncommon",
    reward: { type: "fp", amount: 200 }
  },
  obsessed: {
    name: "DEDICATED FAN",
    description: "Checked the idle game 50 times. Always happy to see you.",
    icon: "❤️",
    type: "passive_check",
    requirement: 50,
    rarity: "rare",
    reward: { type: "fp", amount: 500 }
  },
  night_owl: {
    name: "STARRY EYED",
    description: "Played between 2AM and 5AM. The night is young.",
    icon: "🌙",
    type: "time_window", // Logic to be implemented in hook
    requirement: 1,
    rarity: "rare",
    reward: { type: "fp", amount: 666 }
  },
  early_bird: {
    name: "SUNRISE SEEKER",
    description: "Played between 5AM and 7AM. The early bird gets the worm.",
    icon: "☀️",
    type: "time_window", // Logic to be implemented in hook
    requirement: 1,
    rarity: "rare",
    reward: { type: "fp", amount: 333 }
  }
};

