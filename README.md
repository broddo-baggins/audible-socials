# Listenable Socials - Educational Mock Audiobook Platform

> **Status**: 🟢 Production Ready | **Build**: ✅ Passing | **Version**: 1.0.0
> 
> **⚠️ EDUCATIONAL DISCLAIMER**: This is a mock educational project created for academic purposes to showcase social networking features for audiobook platforms. This project is not affiliated with, endorsed by, or connected to Audible or Amazon. Created to demonstrate how social features could reduce "Time To Next Book" metrics in audiobook service funnels.

A comprehensive social audiobook platform built as an educational mock project. Features modern design, 400+ curated books (Sci-Fi & LitRPG focus), celebrity-hosted book clubs, and robust social features to reduce "Time To Next Book."

##  Overview

**Listenable Socials** is a fully-featured social audiobook platform that combines:
- **Modern Audiobook Design**: Clean interface with audiobook platform aesthetics
- **400+ Books**: Curated collection featuring Three Body Problem, Dungeon Crawler Carl, and more
- **Celebrity Book Clubs**: Reese Witherspoon, Oprah, Emma Watson, Jenna Bush Hager, Sarah Jessica Parker
- **Social Features**: Friend management, progress tracking, recommendations, achievements
- **Mobile Responsive**: Full mobile support with touch-optimized interactions

### Quick Links
-  **[Complete Documentation](./assets/docs/COMPLETE_PROJECT_DOCUMENTATION.md)** - Comprehensive guide
-  **[Quick Start Guide](./assets/docs/QUICK_START_GUIDE.md)** - Get started in 5 minutes
-  **[Features Overview](./assets/docs/FEATURES.md)** - All features explained
- **[Testing Results](./assets/docs/TESTING_RESULTS.md)** - Quality assurance report

##  Features

### 🤖 AI Reading Assistant (NEW!) - **Powered by Grok API**
- **Real AI Intelligence**: Integrated with xAI's Grok for genuine, intelligent responses
- **Smart Recommendations**: AI-powered "Next Listen" suggestions based on:
  - Your listening history and preferences
  - Friends' activity and ratings
  - Book club trends and discussions
  - Reading patterns and time available
- **Context-Aware Q&A**: Ask questions about books with intelligent features:
  - Spoiler protection by default (toggle to enable)
  - Contextual responses about plot, characters, themes
  - Suggested follow-up questions
  - Natural language understanding
- **Live/Offline Mode**: Toggle between real AI and offline mock responses
- **Floating AI Widget**: Accessible from any page in the app

**See [Grok API Integration Guide](./GROK_API_INTEGRATION.md) for complete details.**

### Book Clubs
- Join up to 2 clubs (3 for Premium members)
- Author, celebrity, and themed club options
- 2-for-1 discounts for club members
- Live events and Q&A sessions
- Member badges and achievements
- Premium-only exclusive clubs

### Friends System
- Search and add friends
- View friends' libraries and reading history
- See friends' book ratings
- Track which book clubs friends are in
- Activity feed of friends' reading progress

### Core Features
- Premium design with smooth animations
- Fully responsive (mobile + desktop)
- Credit system for purchasing books
- Premium membership with exclusive benefits
- Book ratings and reviews
- Personalized recommendations
- Notification system for club events
- Audio player with club milestone tracking

##  Tech Stack

- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: localStorage (client-side)
- **Data**: Mock JSON files
- **Deployment**: Vercel

##  Installation

```bash
# Clone the repository
cd listenable-socials

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔑 Environment Setup

### AI Features Configuration

To enable the AI features powered by Grok API:

1. **Get a Fresh Grok API Key** from [x.ai](https://x.ai):
   - Visit https://console.x.ai
   - Sign in to your account
   - Go to API Keys section
   - Generate a new API key (format: `gsk_...`)

2. **Create a `.env` file** in the project root:

```bash
# Create .env file with your fresh API key
echo "VITE_GROK_API_KEY=gsk_your_actual_key_here" > .env
```

3. **Restart the development server** to pick up the new environment variable

**⚠️ Important Notes:**
- API keys can expire - if you get authentication errors, generate a new key
- Never commit `.env` files to version control
- The application gracefully falls back to intelligent mock responses if no valid key is provided

**🔧 Testing Your API Key:**
```bash
# The app will show "🟢 LIVE AI" when working properly
# It will show "🔴 OFFLINE MODE" if the API key is invalid
# Check browser console for detailed error messages
```

**🚨 Current Status:** The provided API key appears to be expired or invalid. Please generate a fresh key from [console.x.ai](https://console.x.ai).

## ️ Project Structure

```
listenable-socials/
├── src/
│   ├── components/
│   │   ├── layout/          # Header, BottomNav
│   │   ├── player/          # Audio player
│   │   ├── clubs/           # Book club components
│   │   ├── friends/         # Friends components
│   │   ├── books/           # Book card components
│   │   └── shared/          # Shared components
│   ├── pages/               # Main page components
│   ├── data/                # Mock data (books, clubs, users)
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── public/                  # Static assets
└── vercel.json              # Vercel configuration
```

##  Content & Data

The app includes:
- **400+ books** with focus on Sci-Fi (Three Body Problem trilogy, Dune, The Expanse) and LitRPG (Dungeon Crawler Carl series, Azarinth Healer)
- **5 celebrity book clubs** (Reese, Oprah, Emma Watson, Jenna Bush Hager, SJP)
- **50+ mock users** with realistic profiles and reading histories
- **Complete metadata**: Ratings, reviews, progress tracking, achievements
- **Social data**: Friend connections, club memberships, activity feeds

### 📖 **Actual Book Content Available**

The application now includes **actual book content** for public domain classics:

- **Pride and Prejudice** by Jane Austen (752KB)
- **Dracula** by Bram Stoker (870KB)
- **Frankenstein** by Mary Shelley (421KB)
- **The Adventures of Sherlock Holmes** by Arthur Conan Doyle (607KB)

All content is legally sourced from **Project Gutenberg** and fully readable within the application.

### 📚 Librivox Integration

Add thousands of public domain audiobooks from [Librivox.org](https://librivox.org):

```bash
# Search for books
node scripts/download-librivox-audiobooks.js search "pride and prejudice"

# Organize downloaded files
node scripts/download-librivox-audiobooks.js organize ~/Downloads/Librivox

# Integrate into application
node scripts/download-librivox-audiobooks.js integrate
```

### 📚 Public Domain Content System

Download additional public domain books legally:

```bash
# Download content for all books in database
node scripts/download-public-domain-books.js download

# List all available public domain books
node scripts/download-public-domain-books.js list

# Download specific book
node scripts/download-public-domain-books.js single pride_and_prejudice_jane_austen
```

See **[Librivox Integration Guide](./LIBRIVOX_INTEGRATION_README.md)** for complete instructions.

##  Design Philosophy

- **Premium Minimalist**: Clean, elegant design inspired by modern audiobook platforms
- **Smooth Animations**: Framer Motion for delightful transitions
- **Responsive**: Mobile-first approach with desktop enhancements
- **Typography**: Inter for body text, Literata for headings
- **Color Palette**: Orange (#F86800) as primary, with navy and cream accents

##  Key Functionalities

### User Flow
1. **Home**: Featured clubs and trending books
2. **Library**: User's audiobook collection
3. **Discover**: Browse all books with genre filtering
4. **My Book Clubs**: 
   - Book Clubs tab: Browse and join clubs
   - Friends tab: Search friends and view their activity
   - Activity tab: See what friends are reading
5. **Profile**: Manage membership, credits, and settings

### Business Logic
- Free users: Join up to 2 clubs
- Premium users: Join up to 3 clubs, access premium-only clubs
- Club members get 2-for-1 credit discounts
- Extended preview (30 min vs 5 min) for club members
- Credit system for book purchases

##  Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Vite and configure settings
6. Click "Deploy"

### Environment Variables

No environment variables are required for the demo. All data is stored locally using localStorage.

For production with Google Images API:
```
VITE_GOOGLE_API_KEY=your_api_key
VITE_GOOGLE_SEARCH_ENGINE_ID=your_engine_id
```

##  Mobile Responsiveness

- Bottom navigation bar for mobile devices
- Touch-friendly interactive elements
- Responsive grid layouts
- Optimized images for mobile
- Smooth scrolling and transitions

##  User Testing Prompts

The demo includes these key testing scenarios:

1. **Join Book Club Flow**: "What made you want/not want to join this club?"
2. **Club Page with Events**: "Would this make you want to read this book sooner?"
3. **Credit Requirement UX**: "Do you feel pressure or motivation to use a credit here?"
4. **Friend/Library Sharing**: "Would seeing a friend's list influence your next book pick?"
5. **Club Notifications**: "Are these updates useful or overwhelming?"

## 🎯 Key Innovation: AI-Powered Discovery

This project demonstrates how AI can reduce the "Time To Next Book" metric by:

1. **Proactive Recommendations**: AI suggests books before users finish their current listen
2. **Social Context**: Recommendations consider friends' activity and book club discussions
3. **Spoiler-Free Exploration**: Users can learn about books without plot spoilers
4. **Personalized Discovery**: Machine learning adapts to individual reading patterns

### Metrics Impact (Theoretical)
- **Time To Next Book**: Reduce from 5-7 days to 1-2 days
- **User Engagement**: Increase book discovery by 40%
- **Social Features**: Drive 60% more friend interactions
- **Retention**: Improve subscription renewal by 25%

##  Future Enhancements

- Real audio playback functionality
- Backend API integration with actual LLM (GPT-4, Claude, etc.)
- Real-time notifications
- Direct messaging between friends
- Book club discussion forums
- Integration with actual Google Images API
- User authentication
- Social sharing features
- Advanced AI features:
  - Voice-based book queries
  - Emotional tone analysis of books
  - Reading buddy matching
  - Predictive listening schedules

##  License

This is a mock educational project created for academic and portfolio purposes only. Not affiliated with or endorsed by any audiobook service provider.

##  Educational Purpose

This project was created to:
- Demonstrate social networking integration in audiobook platforms
- Showcase how social features can reduce "Time To Next Book" metrics
- Explore UX patterns for community-driven content discovery
- Provide a portfolio piece demonstrating full-stack frontend development

##  Acknowledgments

- Design inspiration: Modern audiobook platforms
- Icons: Lucide React
- Fonts: Google Fonts (Inter, Literata)
- Images: Unsplash (placeholder images)

---

Built with ️ as an Educational Mock Project | Not affiliated with Audible or Amazon
