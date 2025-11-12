# EchoRead - Quick Start Guide

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📱 Testing the Design

### Desktop Experience
1. Start dev server: `npm run dev`
2. Open `http://localhost:5173`
3. Test pages:
   - Home: `/` - Hero banner + carousels
   - Browse: `/browse` - Filters + grid
   - Library: `/library` - Tabs + progress tracking
   - Book Detail: `/book/1` - Full detail page
   - Search: `/search` - Search interface
   - Account: `/account` - Profile + membership

### Mobile Experience
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone/Android device
4. Test bottom navigation
5. Test carousels and scrolling

## 🎨 Design System

### Brand Colors
- **Primary**: Orange `#D85A29` - Use for CTAs and emphasis
- **Secondary**: Charcoal `#2A2A2A` - Use for dark backgrounds
- **Accent**: Beige `#F5F1ED` - Use for card backgrounds

### Using Components

#### Buttons
```jsx
import { Button } from './components/ui';

<Button variant="primary" size="lg">Click Me</Button>
<Button variant="outline" icon={<Icon />}>With Icon</Button>
```

#### Cards
```jsx
import { Card } from './components/ui';

<Card hover padding="md">
  <h3>Card Content</h3>
</Card>
```

#### Rating
```jsx
import { Rating } from './components/ui';

<Rating rating={4.5} showValue reviewCount={1234} />
```

#### Book Display
```jsx
import { BookCard, BookCarousel, BookGrid } from './components/books';

// Single card
<BookCard book={book} size="md" showProgress />

// Carousel
<BookCarousel title="New Releases" books={books} />

// Grid
<BookGrid books={books} cardSize="md" />
```

## 📂 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── books/        # Book-specific components
│   ├── layout/       # Layout components
│   └── [feature]/    # Feature-specific components
├── pages/            # Route pages
├── utils/            # Helper functions
├── data/             # Mock data
└── App.jsx          # Main app with routing
```

## 🔧 Customization

### Adding New Colors
Edit `tailwind.config.js`:
```js
colors: {
  echo: {
    'custom-color': '#HEX',
  }
}
```

### Creating New Pages
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
```jsx
<Route path="/new" element={<NewPage />} />
```

### Adding Components
1. Create in appropriate folder
2. Export from `index.js` if in `ui/`
3. Import and use

## 📋 Key Features Checklist

### Home Page
- [x] Hero banner
- [x] Continue listening carousel
- [x] Recommendation carousels
- [x] Loading states
- [x] Mobile responsive

### Browse/Discover
- [x] Filter sidebar
- [x] Category filters
- [x] Sort controls
- [x] Grid display
- [x] Empty states

### Library
- [x] Tab navigation
- [x] Progress tracking
- [x] Grid/List toggle
- [x] Continue listening section

### Book Detail
- [x] Large cover display
- [x] Metadata section
- [x] CTAs
- [x] Reviews section
- [x] Recommendations

### Audio Player
- [x] Full screen player
- [x] Playback controls
- [x] Chapter navigation
- [x] Speed control
- [x] Mini player (mobile)

### Search
- [x] Global search bar
- [x] Recent searches
- [x] Trending tags
- [x] Results grid

### Account
- [x] Profile section
- [x] Membership card
- [x] Statistics
- [x] Settings

## 🎯 Common Tasks

### Changing Featured Book
Edit `src/pages/Home.jsx`:
```jsx
setFeaturedBook(booksWithCovers[INDEX]); // Change INDEX
```

### Modifying Navigation
Edit `src/components/layout/DesktopHeader.jsx` or `MobileBottomNav.jsx`:
```jsx
const navItems = [
  { label: 'New Item', path: '/new', icon: Icon },
];
```

### Adding Filters
Edit `src/components/browse/FilterSidebar.jsx`:
```jsx
const categories = ['New Category', ...];
```

### Customizing Hero Banner
Edit `src/components/home/HeroBanner.jsx` to modify layout and styling.

## 🐛 Troubleshooting

### Images Not Loading
- Check `src/utils/imageCache.js`
- Verify book data has `coverQuery` or `cover` field

### Styles Not Applying
- Restart dev server
- Check Tailwind classes are correct
- Verify component imports

### Routes Not Working
- Check `App.jsx` for route definitions
- Verify component imports
- Check for typos in paths

## 📚 Learn More

- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Router**: https://reactrouter.com/
- **Lucide Icons**: https://lucide.dev/
- **Framer Motion**: https://www.framer.com/motion/

## 🎨 Design References

See detailed design documentation:
- `ECHOREAD_DESIGN.md` - Complete design specification
- `REDESIGN_SUMMARY.md` - Implementation details

## 💡 Tips

1. **Use the component library** - Don't recreate components
2. **Follow the color system** - Use `echo-*` colors
3. **Maintain spacing** - Use Tailwind's spacing scale
4. **Keep it accessible** - Add ARIA labels and focus states
5. **Mobile first** - Test mobile layout first

## ⚡ Performance

- Images lazy load automatically
- Carousels use smooth scrolling
- Components re-render efficiently
- Bundle size optimized with Vite

## 🚢 Deployment

Ready to deploy to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- GitHub Pages

Build command: `npm run build`
Output directory: `dist`

---

**Need Help?** Check the detailed documentation files or inspect component source code for usage examples.

