# 🚀 Deployment Guide - NASA Space Challenge 2025

Complete guide to deploy your City Resilience Explorer to the web using **Vercel** (recommended) or other platforms.

---

## 🎯 Quick Deploy with Vercel (Recommended)

**Why Vercel?**
- ✅ **Free** for hobby projects
- ✅ **Automatic** builds from GitHub
- ✅ **Zero configuration** for Vite/React
- ✅ **Global CDN** for fast loading
- ✅ **HTTPS** by default
- ✅ **Environment variables** built-in
- ✅ **Custom domains** support

### 🚀 Method 1: Deploy via Vercel Dashboard (Easiest)

#### Step 1: Sign Up for Vercel
1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account
4. Complete the signup process

#### Step 2: Import Your Project
1. On Vercel dashboard, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Find **"Nasa_SpaceChallenge_2025"** in your repository list
4. Click **"Import"**

#### Step 3: Configure Build Settings
Vercel auto-detects Vite projects, but verify these settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Step 4: Add Environment Variables
**CRITICAL**: Add your API keys as environment variables

1. In the "Environment Variables" section, add:

| Name | Value |
|------|-------|
| `VITE_OPENWEATHER_API_KEY` | Your OpenWeatherMap API key |
| `VITE_NASA_API_KEY` | Your NASA API key |

**Example:**
```
Name: VITE_OPENWEATHER_API_KEY
Value: 6ac56844ec850e6937a5dbbaa2087e43
```

2. Select **"Production"**, **"Preview"**, and **"Development"** for each variable
3. Click **"Add"** for each variable

#### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. You'll see: "🎉 Congratulations! Your project has been deployed"
4. Click **"Visit"** to see your live site!

**Your URL will be:** `https://nasa-space-challenge-2025.vercel.app`

---

### 🚀 Method 2: Deploy via Vercel CLI (Advanced)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate.

#### Step 3: Deploy from Terminal
```bash
# In your project directory
cd /Users/niloy19/nasa_space_challenge/nasa_space

# Deploy to production
vercel --prod
```

#### Step 4: Add Environment Variables via CLI
```bash
# Add OpenWeatherMap API key
vercel env add VITE_OPENWEATHER_API_KEY production
# Paste your API key when prompted

# Add NASA API key
vercel env add VITE_NASA_API_KEY production
# Paste your API key when prompted
```

#### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

---

## 🔧 Pre-Deployment Checklist

Before deploying, ensure:

- [x] ✅ `.env` is in `.gitignore` (API keys protected)
- [x] ✅ `.env.example` exists with placeholders
- [x] ✅ All code committed and pushed to GitHub
- [x] ✅ `npm run build` works locally
- [x] ✅ No console errors in production build
- [ ] 🔑 API keys ready to add to Vercel

### Test Production Build Locally
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Check output in browser at http://localhost:4173
```

---

## 🌐 Alternative Deployment Options

### Option 2: Netlify

**Pros:** Similar to Vercel, great UI, drag-and-drop deploy

#### Deploy Steps:
1. Go to https://app.netlify.com/
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repo
5. Configure:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
6. Add environment variables in **Site settings → Environment variables**
7. Click **"Deploy site"**

**Your URL:** `https://nasa-space-challenge-2025.netlify.app`

---

### Option 3: GitHub Pages

**Pros:** Free, uses your GitHub account  
**Cons:** Requires workflow setup, no server-side features

#### Setup Steps:

1. **Install gh-pages package:**
```bash
npm install --save-dev gh-pages
```

2. **Update `package.json`:**
```json
{
  "homepage": "https://niloy200119.github.io/Nasa_SpaceChallenge_2025",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update `vite.config.js`:**
```javascript
export default defineConfig({
  base: '/Nasa_SpaceChallenge_2025/',
  // ... rest of config
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/root`
   - Save

**Your URL:** `https://niloy200119.github.io/Nasa_SpaceChallenge_2025`

**⚠️ Note:** GitHub Pages doesn't support environment variables. You'd need to use hardcoded API keys (not recommended) or use a backend proxy.

---

### Option 4: Render

**Pros:** Free tier, supports static sites and backends

#### Deploy Steps:
1. Go to https://render.com/
2. Sign up with GitHub
3. Click **"New +"** → **"Static Site"**
4. Connect your GitHub repo
5. Configure:
   ```
   Build Command: npm run build
   Publish Directory: dist
   ```
6. Add environment variables in **Environment** tab
7. Click **"Create Static Site"**

**Your URL:** `https://nasa-space-challenge-2025.onrender.com`

---

## 🔑 Managing API Keys in Production

### Security Best Practices

1. **Never commit API keys to Git** ✅ Already done!
2. **Use environment variables** on hosting platform
3. **Rotate keys** if accidentally exposed
4. **Monitor API usage** to detect unauthorized access

### Adding Environment Variables on Vercel

**Via Dashboard:**
1. Go to your project on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:
   - `VITE_OPENWEATHER_API_KEY`
   - `VITE_NASA_API_KEY`
4. Click **"Save"**
5. Click **"Redeploy"** to apply changes

**Via CLI:**
```bash
vercel env add VITE_OPENWEATHER_API_KEY production
vercel env add VITE_NASA_API_KEY production
```

### Verifying Environment Variables Work

After deployment, check your browser console:
- If you see API data loading → ✅ Keys are working
- If you see "401 Unauthorized" → ❌ Keys not set or incorrect

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain on Vercel

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. On Vercel, go to **Project Settings → Domains**
3. Add your domain: `nasa-resilience.com`
4. Follow DNS configuration instructions
5. Wait 24-48 hours for DNS propagation

**Free Vercel subdomain:** `your-project.vercel.app`

---

## 🚀 Continuous Deployment (Auto-Deploy)

### How It Works:
Once deployed on Vercel, **every push to GitHub automatically deploys!**

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Builds your project
# 3. Deploys to production
# 4. Sends you a notification
```

### Branch Previews:
- **Main branch** → Production URL
- **Other branches** → Preview URLs (for testing)

Example:
```bash
git checkout -b new-feature
git push origin new-feature
# Vercel creates: https://nasa-space-challenge-2025-git-new-feature.vercel.app
```

---

## 🔍 Monitoring Your Deployment

### Vercel Analytics (Free)

1. On Vercel dashboard → **Analytics** tab
2. See:
   - Page views
   - Unique visitors
   - Top pages
   - Response times
   - Error rates

### Build Logs

If deployment fails:
1. Click on failed deployment
2. Check **"Build Logs"** tab
3. Look for error messages
4. Common issues:
   - Missing dependencies → Run `npm install` locally
   - Build errors → Run `npm run build` locally
   - Environment variables → Check they're set correctly

---

## 🐛 Troubleshooting

### Issue: "Build Failed"

**Solution:**
```bash
# Test build locally first
npm run build

# If it works locally, check Vercel logs for:
# - Missing dependencies
# - Node version mismatch
# - Environment variables
```

### Issue: "APIs Not Working"

**Solution:**
1. Check Vercel environment variables are set
2. Verify variable names start with `VITE_`
3. Check browser console for API errors
4. Verify API keys are valid on provider websites

### Issue: "404 on Refresh"

**Solution:**
- Vercel should auto-detect this, but if not:
- Check `vercel.json` has proper rewrites (already included!)

### Issue: "Slow Loading"

**Solution:**
1. Enable Vercel **Speed Insights**
2. Check **Analytics** for performance issues
3. Consider:
   - Code splitting
   - Lazy loading components
   - Image optimization
   - Reduce API calls

### Issue: "CORS Errors"

**Solution:**
- NASA and OpenWeatherMap APIs support CORS
- If issues persist, check API key restrictions
- Verify domain is whitelisted on API provider

---

## 📊 Production Optimization

### Before Going Live

1. **Optimize Build Size:**
```bash
# Analyze bundle size
npm run build
# Check dist/ folder size (should be < 5MB)
```

2. **Enable Compression:**
   - Vercel auto-enables Gzip/Brotli compression ✅

3. **Add Favicon:**
   - Already in `public/favicon.svg` ✅

4. **Test on Multiple Devices:**
   - Desktop, tablet, mobile
   - Different browsers (Chrome, Firefox, Safari)

5. **Check Lighthouse Score:**
   - Open deployed site
   - F12 → Lighthouse tab
   - Run audit (aim for 90+ on Performance)

---

## 🎯 Recommended: Deploy with Vercel

**Step-by-Step Command Summary:**

```bash
# 1. Ensure code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Install Vercel CLI (optional)
npm install -g vercel

# 3. Deploy
vercel --prod

# 4. Follow prompts:
# - Link to existing project? No
# - Project name? nasa-space-challenge-2025
# - Directory? ./
# - Override settings? No

# 5. Add environment variables on Vercel dashboard
# Visit: https://vercel.com/dashboard

# 6. Your site is live!
# URL: https://nasa-space-challenge-2025.vercel.app
```

---

## 🌟 Post-Deployment Checklist

After successful deployment:

- [ ] ✅ Site is accessible at public URL
- [ ] ✅ All features work (search, maps, panels)
- [ ] ✅ API keys are secure (not visible in source)
- [ ] ✅ No console errors in production
- [ ] ✅ Responsive on mobile devices
- [ ] ✅ Share URL with friends/colleagues
- [ ] ✅ Update GitHub README with live demo link
- [ ] ✅ Set up monitoring/analytics
- [ ] ✅ Add custom domain (optional)

---

## 📧 Need Help?

**Vercel Support:**
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

**Common Resources:**
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)

---

## 🎉 You're Ready to Deploy!

**Recommended Path:**
1. Sign up for Vercel (free)
2. Import your GitHub repo
3. Add environment variables
4. Click Deploy
5. Share your live site!

**Estimated Time:** 10-15 minutes

**Good luck!** 🚀

---

**Built with ❤️ for NASA Space Challenge 2025**
