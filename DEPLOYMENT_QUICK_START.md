# ⚡ Quick Start: Deploy to Vercel in 5 Minutes

## 🎯 What You Need

1. ✅ Vercel account ([sign up free](https://vercel.com))
2. ✅ Your Grok API key (from [x.ai console](https://console.x.ai))

---

## 🚀 Deploy Now (3 Easy Steps)

### Step 1: Connect to Vercel

**Option A: Via Dashboard** (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"

**Option B: Via CLI**

```bash
npm i -g vercel
vercel login
vercel
```

---

### Step 2: Add Environment Variable

**CRITICAL**: Add this BEFORE deploying:

1. In Vercel project settings → **Environment Variables**
2. Click "Add New"
3. Enter:
   ```
   Name: VITE_GROK_API_KEY
   Value: YOUR_GROK_API_KEY_HERE
   ```
4. Select: ✅ Production ✅ Preview ✅ Development
5. Click **Save**

**Via CLI**:
```bash
vercel env add VITE_GROK_API_KEY
# Paste the key when prompted
# Select all environments
```

---

### Step 3: Deploy!

**Via Dashboard**: Click "Deploy" button

**Via CLI**:
```bash
vercel --prod
```

⏱️ **Build time**: ~3 minutes

---

## ✅ Verify It Works

After deployment:

1. Open your Vercel URL
2. Click purple AI bot (bottom-right)
3. Look for "Live AI" button (should be purple)
4. Look for "Grok AI" badge in recommendations
5. Ask a question → Should get AI response!

---

## 🐛 Not Working?

### AI showing "Offline" mode?

**Fix**: Environment variable not set properly

```bash
# Check if variable exists
vercel env ls

# If missing, add it:
vercel env add VITE_GROK_API_KEY

# Then redeploy:
vercel --prod
```

### Build failing?

**Fix**: Test locally first

```bash
npm install
npm run build
# If this works, Vercel will work too
```

---

## 📱 Your Live URLs

After deployment, you'll get:

- **Production**: `https://listenable-socials.vercel.app`
- **Preview** (per branch): `https://listenable-socials-git-[branch].vercel.app`

---

## 🎉 That's It!

Your AI-powered audiobook platform is now live! 🚀

**Full guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for details.

---

**Need help?** Check the troubleshooting section in the full deployment guide.

