# EchoRead Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd /Users/amity/projects/audible-socials
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to `http://localhost:5173` (or the port shown in terminal)

## What You'll See

### Home Page (Default Route: `/`)
- Featured audiobook hero banner with CTAs
- "Continue Listening" carousel with progress bars
- "What Your Friends Are Up To" social nudges
- Multiple genre-specific carousels
- Originals and Podcasts sections

### Key Features to Test

#### 1. Audio Player (Simulated)
- Click "Play" on any book to open the full player
- Test controls: play/pause, skip forward/back
- Try playback speed (0.75x - 3.0x)
- Navigate chapters
- Set sleep timer
- Minimize player to see mini player at bottom
- Player state persists in localStorage

#### 2. Browse & Search
- **Browse** (`/browse`): Use filters (genre, duration, rating, language)
- **Search** (`/search`): Real-time search with autocomplete
- Try sorting by different criteria
- Toggle between grid and list views

#### 3. Book Details
- Click any book to see full details page
- View "Friends Who Love This" section (mock data)
- See "Book Clubs Reading This" integration
- Check out "More from Author" and similar recommendations

#### 4. Library
- Navigate to `/library` to see your collection
- Filter by Audiobooks, Podcasts, or Wishlist tabs
- View progress on books you're "listening to"

#### 5. Account Page
- Go to `/account` to see:
  - **Listening Stats**: Hours listened, books finished, current streak
  - **Weekly Activity Chart**: Visual listening patterns
  - **Genre Breakdown**: Your most-listened genres
  - **Badges**: Achievements you've earned (hover for descriptions)
  - Settings and preferences

#### 6. Social Features
- **Home Page**: Friend activity nudges showing what friends are listening to
- **Book Detail Pages**: Friend recommendations and ratings
- **Book Clubs**: See which clubs are discussing each book

## Mock Data Overview

### Books
- **65+ audiobooks** with full metadata
- Organized by content type: audiobooks, originals, podcasts
- Each includes chapters, narrators, ratings, and descriptions

### Users
- **50 diverse mock users** with unique preferences:
  - LitRPG fans, SciFi enthusiasts, Fantasy readers
  - Horror lovers, Mystery solvers, Romance readers
  - Self-development seekers, and more
- Each user has realistic stats, badges, and currently reading lists

### No Backend Required
- All data loads from JSON files in `/src/data/`
- No API calls, no authentication
- Simulated audio playback (no real audio files)
- State persists in browser localStorage

## Testing Workflow

### Recommended Test Path:
1. **Start on Home** → Browse featured content
2. **Click a book** → View full details with social features
3. **Start listening** → Test player controls
4. **Minimize player** → Continue browsing with mini player
5. **Use Browse** → Try filters and sorting
6. **Search** → Test autocomplete and results
7. **View Account** → Check stats and badges
8. **Library** → See progress tracking

## Responsive Design Testing

### Desktop (1280px+)
- Horizontal navigation at top
- Full-width carousels with navigation arrows
- Side-by-side layouts for book details
- Full-featured player modal

### Tablet (768px - 1279px)
- Adjusted layouts for medium screens
- Simplified navigation
- Responsive grids

### Mobile (<768px)
- Bottom tab navigation
- Single column layouts
- Touch-optimized player controls
- Simplified carousels with swipe

## Key Keyboard Shortcuts

When player is active:
- **Spacebar**: Play/Pause
- **→** (Right Arrow): Skip forward 30s
- **←** (Left Arrow): Skip backward 30s
- **↑** (Up Arrow): Volume up
- **↓** (Down Arrow): Volume down
- **Esc**: Close/minimize player

## Browser DevTools Tips

### Inspect Mock Data
Open browser console and check:
```javascript
localStorage.getItem('echoread_player_state')  // Player state
localStorage.getItem('echoread_library')       // User library
```

### Simulate Different Users
The 50 mock users are in `/src/data/mockUsers.json` - you can view their profiles by:
1. Opening the social nudges on home
2. Viewing friend recommendations on book pages
3. Checking book club member lists

### Network Tab
Notice no actual network requests (except initial app load) - everything runs client-side!

## Common Questions

**Q: Why don't I hear any audio?**
A: Audio playback is simulated. The player advances time automatically when playing, but no actual audio files are used.

**Q: How do I log in as different users?**
A: There's no authentication system. The app simulates a single user experience with 50 mock "friends."

**Q: Can I add real books?**
A: Yes! Edit `/src/data/books.json` and add new entries following the existing format.

**Q: Where are the book covers from?**
A: Covers are fetched via Google Images API based on the `coverQuery` field in each book's data.

**Q: Is my progress saved?**
A: Yes, player progress and library state are saved to browser localStorage.

## Troubleshooting

### Books Not Loading
- Check browser console for errors
- Verify JSON files in `/src/data/` are valid
- Clear localStorage and refresh: `localStorage.clear()`

### Images Not Showing
- Google Images API may rate-limit
- Check network tab for failed image requests
- Images are cached in localStorage after first load

### Player Not Working
- Clear player state: `localStorage.removeItem('echoread_player_state')`
- Refresh the page
- Check that you clicked "Play" or "Start Listening"

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## File Structure Reference

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── books/           # Book-specific components
│   ├── layout/          # Navigation and layout
│   ├── player/          # Audio player
│   ├── social/          # Social features
│   ├── stats/           # Statistics displays
│   └── badges/          # Achievement system
├── contexts/
│   └── PlayerContext.jsx    # Global player state
├── pages/               # Route pages
├── data/                # Mock data JSON files
└── utils/               # Helper functions
```

## Next Steps

After exploring the app:
1. **Customize the design**: Edit Tailwind config and color tokens
2. **Add more books**: Expand `/src/data/books.json`
3. **Create new badges**: Add achievements to badge system
4. **Integrate backend**: Replace JSON files with API calls
5. **Add real audio**: Replace simulated playback with actual audio

## Support

For issues or questions:
- Check browser console for errors
- Review this guide
- Inspect the implementation documentation in `IMPLEMENTATION_COMPLETE.md`

**Enjoy exploring EchoRead!** 

