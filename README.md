# Audible Social - Book Clubs & Friends

A working demo of Audible with new social features including Book Clubs and Friends functionality. Built to improve retention and conversion funnel by solving the difficulty of finding the next book to read.

## 🎯 Overview

This project is a 1:1 Audible replica with two key new additions:
- **Book Clubs**: Join curated reading communities hosted by authors, celebrities, and themed groups
- **Friends System**: Connect with friends, share libraries, and see what they're reading

## ✨ Features

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

## 🚀 Tech Stack

- **Framework**: React 19 with Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: localStorage (client-side)
- **Data**: Mock JSON files
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
cd audible-socials

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
audible-socials/
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

## 📊 Mock Data

The app includes:
- **50+ books** across multiple genres (Science Fiction, Fantasy, Self Development, etc.)
- **8 book clubs** with different hosts and themes
- **20 users** with random names for the friends system
- Ratings, reviews, and activity data

## 🎨 Design Philosophy

- **Premium Minimalist**: Clean, elegant design inspired by Audible
- **Smooth Animations**: Framer Motion for delightful transitions
- **Responsive**: Mobile-first approach with desktop enhancements
- **Typography**: Inter for body text, Literata for headings
- **Color Palette**: Audible orange (#F86800) as primary, with navy and cream accents

## 🔧 Key Functionalities

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

## 🚀 Deployment to Vercel

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

## 📱 Mobile Responsiveness

- Bottom navigation bar for mobile devices
- Touch-friendly interactive elements
- Responsive grid layouts
- Optimized images for mobile
- Smooth scrolling and transitions

## 🎯 User Testing Prompts

The demo includes these key testing scenarios:

1. **Join Book Club Flow**: "What made you want/not want to join this club?"
2. **Club Page with Events**: "Would this make you want to read this book sooner?"
3. **Credit Requirement UX**: "Do you feel pressure or motivation to use a credit here?"
4. **Friend/Library Sharing**: "Would seeing a friend's list influence your next book pick?"
5. **Club Notifications**: "Are these updates useful or overwhelming?"

## 🔮 Future Enhancements

- Real audio playback functionality
- Backend API integration
- Real-time notifications
- Direct messaging between friends
- Book club discussion forums
- Integration with actual Google Images API
- User authentication
- Social sharing features

## 📝 License

This is a demo project created for educational and portfolio purposes.

## 🙏 Acknowledgments

- Design inspiration: Audible
- Icons: Lucide React
- Fonts: Google Fonts (Inter, Literata)
- Images: Unsplash (placeholder images)

---

Built with ❤️ for the Audible Social Product Demo
