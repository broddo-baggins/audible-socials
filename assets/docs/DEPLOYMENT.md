# Deployment Guide - Audible Social to Vercel

##  Pre-Deployment Checklist

- [x] All components created and tested
- [x] Mock data populated (50+ books, 8 clubs, 20 users)
- [x] Routes configured in App.jsx
- [x] Responsive design implemented
- [x] Loading states added
- [x] Error handling implemented
- [x] localStorage integration working
- [x] vercel.json configuration file created
- [x] README.md documentation complete
- [x] .gitignore file configured

##  Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI (if not already installed)
npm install -g vercel

# 2. Navigate to project directory
cd /Users/amity/projects/audible-socials

# 3. Login to Vercel
vercel login

# 4. Deploy to production
vercel --prod

# The CLI will:
# - Auto-detect Vite framework
# - Set build command: npm run build
# - Set output directory: dist
# - Deploy the site
```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Audible Social demo"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your site will be live at `https://your-project.vercel.app`

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_URL)

## ⚙️ Configuration

### vercel.json (Already Created)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x (auto-detected)

##  Environment Variables

### Not Required for Demo
This project uses mock data and localStorage, so no environment variables are needed for the demo deployment.

### Optional (for Production)
If implementing real Google Images API:
```
VITE_GOOGLE_API_KEY=your_api_key_here
VITE_GOOGLE_SEARCH_ENGINE_ID=your_engine_id_here
```

To add in Vercel:
1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add key-value pairs
4. Redeploy

##  Post-Deployment

### 1. Verify Deployment
- [ ] Home page loads correctly
- [ ] All navigation works
- [ ] Images load properly
- [ ] Book clubs page functions
- [ ] Friends search works
- [ ] Credits system functional
- [ ] localStorage persists data
- [ ] Mobile responsive design works
- [ ] All animations smooth

### 2. Custom Domain (Optional)
```bash
# Via CLI
vercel domains add yourdomain.com

# Via Dashboard
# 1. Go to Project Settings
# 2. Click "Domains"
# 3. Add your custom domain
# 4. Update DNS records as shown
```

### 3. Performance Optimization
- Vercel automatically handles:
  -  Edge caching
  -  Compression (gzip/brotli)
  -  Image optimization
  -  CDN distribution
  -  HTTP/2

### 4. Analytics (Optional)
```bash
# Enable Vercel Analytics
# In vercel.json, add:
{
  "analytics": {
    "enable": true
  }
}
```

##  Monitoring

### Vercel Dashboard
- **Deployments**: View all deployments and their status
- **Analytics**: Page views, performance metrics
- **Logs**: Build logs and runtime logs
- **Settings**: Environment variables, custom domains

### Key Metrics to Watch
- Build time: ~1-2 minutes
- Page load speed: < 2 seconds
- Lighthouse score: Aim for 90+
- Core Web Vitals: All green

##  Troubleshooting

### Build Fails
```bash
# Check build locally first
npm run build

# If successful locally, check Vercel logs
# Common issues:
# - Node version mismatch
# - Missing dependencies
# - Environment variables
```

### 404 Errors
- Ensure `rewrites` in vercel.json are configured
- Check that routes match React Router paths

### Images Not Loading
- Verify image URLs are correct
- Check if Unsplash API rate limits hit
- Fallback images should work regardless

### localStorage Not Working
- This is expected - each user gets their own localStorage
- Data doesn't sync across devices (by design for demo)

##  Continuous Deployment

### Automatic Deployments
Once connected to GitHub:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Automatic preview links

### Manual Deployments
```bash
# Deploy current directory
vercel

# Deploy to production
vercel --prod
```

##  Testing Deployed Site

### Desktop
1. Open deployed URL
2. Test all navigation
3. Join a book club
4. Add friends
5. Browse books
6. Check notifications

### Mobile
1. Open on actual mobile device
2. Test touch interactions
3. Verify bottom nav
4. Check responsive layouts
5. Test scrolling and animations

### Share Link for User Testing
```
Your demo is live at:
https://audible-socials.vercel.app

Test credentials:
- Default user (no login required)
- 2 credits available
- Can join 2 clubs
- 20 friends available to add
```

##  Success Criteria

-  Build completes successfully
-  Site loads in < 3 seconds
-  All features functional
-  Mobile responsive
-  No console errors
-  localStorage working
-  Smooth animations
-  All routes accessible

##  Support

### Vercel Documentation
- [Vite Deployment](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)

### Project Issues
- Check QUICKSTART.md for common issues
- Review browser console for errors
- Check Vercel deployment logs

---

**Ready to Deploy!** 

The project is fully prepared for Vercel deployment. All configurations are in place, and the app is production-ready.

