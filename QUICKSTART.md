# Quick Start Guide - Audible Social Demo

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd /Users/amity/projects/audible-socials
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Explore the Demo

#### Default User State
- Credits: 2
- Library: 6 books
- Joined Clubs: None (you can join up to 2)
- Friends: None (search and add from 20 available users)
- Premium: No (can upgrade in Profile)

## 🎯 Key Demo Flows

### A. Join a Book Club
1. Navigate to **My Book Clubs** (desktop header or mobile tab)
2. Scroll to "Featured Book Clubs"
3. Click on a club (e.g., "Sci-Fi Sundays" or "Women Who Write")
4. Click "Join This Club"
5. View club details, events, and current book

**Note**: Premium clubs require upgrade. You can join max 2 clubs (3 with Premium).

### B. Add Friends
1. Go to **My Book Clubs** → **Friends** tab
2. Use the search bar to find friends (try "Emma", "Marcus", "Sofia")
3. Click "Add" button
4. Click on a friend to view their profile
5. See their library, ratings, and book clubs

### C. Explore Books
1. Go to **Discover**
2. Filter by genre (Science Fiction, Mystery, Self Development, etc.)
3. Click on a book
4. View details, related clubs, and friends reading it
5. Use a credit to add to library

### D. View Activity Feed
1. Add some friends first (see flow B)
2. Go to **My Book Clubs** → **Activity** tab
3. See what friends are reading and rating
4. Click on books or clubs to explore

### E. Check Notifications
1. Click the bell icon in the header
2. View club event notifications
3. See friend activity updates
4. Mark notifications as read

## 🎨 Features to Showcase

### Book Clubs
- **8 clubs** with different hosts (authors, celebrities, curated)
- **Live events** with scheduled dates and times
- **Member benefits** (2-for-1 discounts, badges, early access)
- **Premium clubs** (require Premium membership)
- **Time-based** (14 or 30 day reading windows)

### Social Features
- **20 friends** available to add
- **Activity feed** showing real-time updates
- **Library sharing** (see what friends own)
- **Rating visibility** (view friends' book scores)
- **Club discovery** (see which clubs friends joined)

### Premium Features
- Join **3 clubs** instead of 2
- Access **premium-only clubs** (e.g., History Buffs, Mythology & Magic)
- See **premium badges** on profiles
- **Extended previews** (30 min vs 5 min)

## 📱 Testing on Mobile

1. Open `http://localhost:5173` on your phone (same network)
2. Or use browser DevTools responsive mode
3. Bottom navigation appears on mobile
4. All features are touch-optimized

## 🔍 What to Look For

### User Testing Prompts
1. **Join Flow**: Is it clear what you get by joining?
2. **Club Value**: Do events and perks feel valuable?
3. **Credit Usage**: Does the 2-for-1 deal motivate you?
4. **Friends Influence**: Would you pick a book a friend rated highly?
5. **Notifications**: Are updates helpful or overwhelming?

### Design Elements
- Smooth animations (Framer Motion)
- Premium minimalist aesthetic
- Audible orange brand color
- Responsive grid layouts
- Loading states and transitions

## 🧪 Sample Test Scenarios

### Scenario 1: New User Onboarding
1. Land on Home page
2. Explore featured clubs
3. Join "Sci-Fi Sundays" with Andy Weir
4. Check upcoming event (Live Q&A)
5. View current book "Project Hail Mary"

### Scenario 2: Social Discovery
1. Add friend "Emma Richardson"
2. View her profile (Premium member)
3. See she's reading "Project Hail Mary" (rated 5 stars)
4. Notice she's in same club
5. Add book to library with credit

### Scenario 3: Credit Decision
1. Browse Discover page
2. Find "Atomic Habits" (part of "Level Up Your Life" club)
3. See 2-for-1 discount available
4. Compare price: 1 credit (normally $14.95)
5. Make purchase decision

## 💡 Pro Tips

### Quick Navigation
- Desktop: Use header links
- Mobile: Use bottom tab bar
- Dropdown: Hover "My Book Clubs" for submenu

### Data Persistence
- All actions save to localStorage
- Refresh page to see data persists
- Clear localStorage to reset demo

### Mock Data
- Books: 50+ across 10 genres
- Clubs: 8 with real author/celebrity names
- Users: 20 with random names
- All data in `/src/data/` folder

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Styles Not Loading
```bash
# Rebuild
npm run build
npm run dev
```

### Data Not Persisting
- Check browser localStorage is enabled
- Clear cache and hard refresh (Cmd+Shift+R)

## 📚 Learn More

- **README.md**: Full technical documentation
- **FEATURES.md**: Complete feature list
- **tailwind.config.js**: Design system tokens
- **/src/data/**: Mock data files

## 🎉 You're Ready!

The demo is fully functional and ready to present. All features work, data persists, and the UI is polished for user testing.

**Next Steps**: Run user interviews with the testing prompts above!

