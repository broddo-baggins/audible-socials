# 🚀 Vercel Deployment Guide - Listenable Socials

## Complete Setup Instructions

---

## 📋 Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository connected
- Grok API key from [x.ai](https://x.ai)

---

## 🔧 Step 1: Environment Variables

### Required Environment Variable

The application needs **ONE environment variable** to work with the AI features:

```bash
VITE_GROK_API_KEY=YOUR_GROK_API_KEY_HERE
```

**Where to get your API key**: Visit [x.ai console](https://console.x.ai) → API Keys → Create API Key

### Adding to Vercel

**Method 1: Vercel Dashboard**

1. Go to your project on Vercel
2. Click **Settings** tab
3. Click **Environment Variables** in sidebar
4. Add new variable:
   - **Name**: `VITE_GROK_API_KEY`
   - **Value**: Your Grok API key from [x.ai console](https://console.x.ai)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Important**: Redeploy for changes to take effect

**Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variable
vercel env add VITE_GROK_API_KEY
# Paste your Grok API key when prompted
# Select: Production, Preview, Development (all)

# Pull to update local
vercel env pull
```

---

## 📦 Step 2: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

2. **Configure Build Settings** (Should be auto-detected):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**:
   - Click "Environment Variables" section
   - Add `VITE_GROK_API_KEY` with your key
   - Select all environments

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app will be live!

### Option B: Deploy via CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Select your account]
# - Link to existing project? No
# - What's your project's name? listenable-socials
# - In which directory is your code located? ./
# - Want to override settings? No

# Add environment variable (if not done via dashboard)
vercel env add VITE_GROK_API_KEY

# Deploy to production
vercel --prod
```

---

## ⚙️ Step 3: Verify Configuration

### Check Build Settings

Your `vercel.json` should have:

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

### Check Environment Variable

After deploying, verify the environment variable is set:

1. Go to Project → Settings → Environment Variables
2. You should see `VITE_GROK_API_KEY` listed
3. Value should be masked (hidden for security)

---

## 🧪 Step 4: Test Deployment

### Test Checklist

After deployment, test these features:

1. **Basic Functionality**:
   - [ ] Website loads
   - [ ] Navigation works
   - [ ] Books display correctly
   - [ ] Images load

2. **AI Features**:
   - [ ] AI bot button appears (bottom-right)
   - [ ] Can open AI panel
   - [ ] "Next Listen" tab loads
   - [ ] "Ask About Books" tab works
   - [ ] Book selector dropdown works
   - [ ] Can select a book
   - [ ] AI responds to questions
   - [ ] "Live AI" toggle is available

3. **Test AI Chat**:
   ```
   1. Click purple AI bot icon
   2. Switch to "Ask About Books"
   3. Ensure "Live AI" is enabled (purple)
   4. Select a book from dropdown
   5. Ask: "What's this book about?"
   6. Should get AI response within 3 seconds
   ```

4. **Test AI Recommendations**:
   ```
   1. Click AI bot icon
   2. Stay on "Next Listen" tab
   3. Should see "Grok AI" badge
   4. Click refresh
   5. Should get 3-5 AI recommendations
   ```

---

## 🐛 Troubleshooting

### Issue: AI Not Working

**Symptoms**: "Offline" mode, no "Grok AI" badge, errors

**Solutions**:

1. **Check Environment Variable**:
   ```bash
   # Via CLI
   vercel env ls
   
   # Should show VITE_GROK_API_KEY in all environments
   ```

2. **Redeploy After Adding Env Var**:
   - Environment variables require a new deployment
   - Go to Deployments → Click "..." → Redeploy

3. **Check Browser Console**:
   - F12 → Console tab
   - Look for errors like "API key not found"
   - If you see "VITE_GROK_API_KEY not found", env var isn't set

4. **Verify Build Output**:
   - Go to Deployments → Click latest
   - Check build logs
   - Look for successful build completion

### Issue: 404 Errors on Routes

**Symptoms**: Direct URLs fail, refresh breaks

**Solution**: Ensure `vercel.json` has rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue: Images Not Loading

**Symptoms**: Broken image icons, missing book covers

**Solution**: 
- Images in `/public` are served automatically
- Check file paths are relative: `/images/...`
- Verify images exist in `/public/images/`

### Issue: Build Fails

**Common causes**:

1. **Missing Dependencies**:
   ```bash
   # Locally test the build
   npm install
   npm run build
   ```

2. **Linting Errors**:
   ```bash
   npm run lint
   ```

3. **Check Vercel Build Logs**:
   - Go to Deployments → Click failed deployment
   - Read error messages
   - Fix issues and push to trigger new deployment

---

## 🔒 Security Best Practices

### Environment Variables

✅ **DO**:
- Store API keys in environment variables
- Use different keys for dev/prod
- Rotate keys periodically
- Monitor API usage

❌ **DON'T**:
- Commit API keys to Git
- Share keys publicly
- Use same key across projects
- Expose keys in client-side code

### API Key Management

```bash
# Generate .env from example
cp .env.example .env

# Edit .env (never commit this file)
nano .env

# .gitignore should include:
.env
.env.local
.env.*.local
```

---

## 📊 Monitoring

### Check Deployment Status

```bash
# Via CLI
vercel ls

# Get deployment URL
vercel inspect [deployment-url]

# View logs
vercel logs [deployment-url]
```

### Via Dashboard

1. Go to project on Vercel
2. Click "Deployments" tab
3. See status of each deployment:
   - ✅ Ready (successful)
   - 🔄 Building (in progress)
   - ❌ Error (failed)

### Analytics

Vercel provides analytics for:
- Page views
- Unique visitors
- Top pages
- Performance metrics

Access at: Project → Analytics

---

## 🚀 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment with unique URL

### Preview Deployments

Every push gets a unique preview URL:
```
https://listenable-socials-git-feature-username.vercel.app
```

Test changes before merging to main!

---

## 🎯 Production Checklist

Before going live:

- [ ] Environment variable set (`VITE_GROK_API_KEY`)
- [ ] All pages load correctly
- [ ] AI features working
- [ ] Images display
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Fast load times (<3s)
- [ ] Educational disclaimer visible
- [ ] All docs updated

---

## 📞 Support

### Vercel Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)

### Common Commands

```bash
# Check current deployment
vercel ls

# Deploy to production
vercel --prod

# Check environment variables
vercel env ls

# Pull environment variables
vercel env pull

# View logs
vercel logs

# Remove deployment
vercel remove [deployment-url]
```

---

## ✅ Quick Start Summary

1. **Connect GitHub repo to Vercel**
2. **Add environment variable**: `VITE_GROK_API_KEY`
3. **Deploy** (automatic or via CLI)
4. **Test AI features** on live site
5. **Monitor** via Vercel dashboard

**Your app is now live!** 🎉

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. Go to Project → Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `listenable.app`)
4. Follow DNS instructions
5. Vercel handles SSL automatically

### DNS Setup

Add these records to your domain:
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

---

**Deployment Guide Version**: 1.0  
**Last Updated**: November 20, 2025  
**Status**: Production Ready  

🚀 **Happy Deploying!**

