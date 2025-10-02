# 🚀 NASA Space Challenge - Real-Time Data Setup Guide

## 📋 Overview
This application uses **real-time data** from multiple APIs - NO MOCKS! Get ready to see live weather, traffic, disasters, and satellite data.

---

## 🔑 Required API Keys

### 1. **OpenWeatherMap API** (FREE - Required for Weather Features)
**Why**: Real-time weather, wind, precipitation, temperature overlays

**How to Get**:
1. Go to https://openweathermap.org/api
2. Click "Sign Up" → Create free account
3. Go to API Keys section
4. Copy your API key

**Free Tier**: 
- 60 calls/minute
- 1,000,000 calls/month
- Perfect for this app!

**Add to `.env`**:
```bash
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

---

### 2. **NASA API Key** (FREE - Optional but Recommended)
**Why**: Higher rate limits for NASA data (EONET, FIRMS, POWER, GIBS)

**How to Get**:
1. Go to https://api.nasa.gov/
2. Click "Generate API Key"
3. Fill form (takes 30 seconds)
4. Copy your key

**Free Tier**:
- 1,000 requests/hour
- No credit card needed!

**Add to `.env`**:
```bash
VITE_NASA_API_KEY=your_nasa_api_key_here
```

**Note**: If you don't set this, app will use `DEMO_KEY` (works but has lower rate limits)

---

## ⚡ Quick Start

### 1. **Clone/Navigate to Project**
```bash
cd nasa_space_challenge/nasa_space
```

### 2. **Create `.env` File**
```bash
# Copy the example file
cp .env.example .env

# OR create manually
nano .env
```

### 3. **Add Your API Keys**
Edit `.env` and add your keys:
```bash
# OpenWeatherMap (REQUIRED for weather features)
VITE_OPENWEATHER_API_KEY=your_actual_key_here

# NASA API (Optional - use DEMO_KEY if not set)
VITE_NASA_API_KEY=your_nasa_key_here
```

### 4. **Install Dependencies**
```bash
npm install
```

### 5. **Start the App**
```bash
npm run dev
```

### 6. **Open in Browser**
```
http://localhost:5173
```

---

## 🌟 Features with Real-Time Data

### ✅ **Currently Working (No API Key Needed)**
- ✅ NASA GIBS Satellite Imagery (no key needed)
- ✅ NASA EONET Natural Events (no key or DEMO_KEY)
- ✅ NASA POWER Climate Data (no key or DEMO_KEY)
- ✅ Search functionality (OpenStreetMap - free)
- ✅ Map navigation and zoom

### 🔑 **Requires OpenWeatherMap API Key**
- 🌤️ Real-time weather at zoom level 10+
  - Temperature, humidity, pressure
  - Wind speed and direction with arrows
  - Air quality (PM2.5, PM10, NO2, O3)
  - Weather alerts and warnings
- 🌧️ Precipitation radar overlay
- 🌡️ Temperature heatmap
- ☁️ Cloud coverage layer
- 💨 Wind speed visualization
- 🔽 Atmospheric pressure

### 🚀 **Enhanced with NASA API Key**
- 🔥 More wildfire data (FIRMS)
- 🌊 Better flood risk analysis
- 🌍 Higher rate limits for all NASA APIs

---

## 🎯 Testing Real-Time Features

### Test 1: Weather Overlay (Zoom Level 10+)
1. Search for "Dhaka" or "Tokyo"
2. Zoom in until you see "🌤️ Real-Time Weather" indicator
3. Click the marker to see:
   - Current temperature
   - Wind speed/direction
   - Humidity, pressure
   - Air quality (PM2.5, AQI)
   - Weather alerts

### Test 2: Weather Layers (Zoom Level 8+)
1. Zoom in to city level
2. Click "🌤️ Weather Layers" panel (top-right)
3. Toggle layers:
   - 🌧️ Precipitation (rain radar)
   - 🌡️ Temperature (heatmap)
   - ☁️ Clouds (coverage)
   - 💨 Wind Speed
   - 🔽 Pressure

### Test 3: Wind Arrows (Zoom Level 11+)
1. Zoom in very close to a city
2. See wind direction arrows appear
3. Colors indicate wind strength:
   - Gray: Light winds (< 15 km/h)
   - Blue: Moderate (15-30 km/h)
   - Orange: Strong (30-50 km/h)
   - Red: Very strong (50+ km/h)

### Test 4: Search & Navigate
1. Type "New York" in search bar
2. Press Enter or click Search
3. Map flies to location smoothly
4. Zoom automatically set to 11

### Test 5: Mobility Panel
1. Click "Mobility" checkbox in header
2. See Transportation & Mobility panel
3. Tabs: Overview, Traffic, Routes, Transit
4. Real-time traffic patterns
5. Evacuation route optimization

---

## 🔧 Troubleshooting

### Problem: "Weather data error" message
**Solution**: 
- Check your `.env` file has correct API key
- Verify key at https://home.openweathermap.org/api_keys
- Make sure key is active (takes 10 minutes after signup)
- Restart dev server: `Ctrl+C` then `npm run dev`

### Problem: Weather layers not showing
**Solution**:
- Zoom in to level 8 or higher
- Click "🌤️ Weather Layers" panel
- Toggle at least one layer on
- Check browser console for errors

### Problem: Map doesn't move when searching
**Solution**:
- This should be fixed! The FlyToLocation component now handles this
- Clear browser cache and refresh
- Check console for geocoding errors

### Problem: "Rate limit exceeded"
**Solution**:
- Get a NASA API key (free, instant)
- Add to `.env` as `VITE_NASA_API_KEY`
- OpenWeatherMap free tier is 60/min - shouldn't hit it
- Wait 1 minute and try again

---

## 📊 API Usage & Rate Limits

### OpenWeatherMap (Free Tier)
- **Current Weather**: ~1 call per zoom-in (refreshes every 5 min)
- **Air Quality**: ~1 call per zoom-in
- **Wind Grid**: ~16 calls per zoom-in at level 11+
- **Weather Layers**: 0 calls (tile-based, no API calls!)

**Estimate**: ~100-200 API calls per hour of active use ✅ Well within free tier!

### NASA APIs (DEMO_KEY or Your Key)
- **EONET Events**: 1 call per map move
- **POWER Climate**: 1 call per location click
- **GIBS Tiles**: No API calls (direct tile service)
- **FIRMS**: 1 call per data fetch

**Estimate**: ~10-20 calls per hour ✅ No worries!

---

## 🎨 What You'll See

### Zoom Level Guide
- **Zoom 1-7**: Global/regional view
  - Satellite imagery (low opacity)
  - No weather overlays (too cluttered)
  
- **Zoom 8-9**: Country/state view
  - Weather layers available (precipitation, temp, etc.)
  - Satellite imagery (higher opacity)
  
- **Zoom 10+**: City view
  - ✅ Real-time weather marker appears
  - ✅ Weather alerts active
  - ✅ Air quality data
  
- **Zoom 11+**: Street level
  - ✅ Wind direction arrows (4x4 grid)
  - ✅ Detailed weather popup
  - ✅ Maximum detail mode

---

## 🌐 Optional APIs (Future Enhancement)

### Twilio (SMS Alerts)
```bash
VITE_TWILIO_ACCOUNT_SID=your_sid
VITE_TWILIO_AUTH_TOKEN=your_token
```

### Firebase (Push Notifications)
```bash
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project
```

---

## 📝 Environment Variables Summary

```bash
# .env file (create in project root)

# === REQUIRED FOR WEATHER ===
VITE_OPENWEATHER_API_KEY=your_openweather_key_here

# === OPTIONAL BUT RECOMMENDED ===
VITE_NASA_API_KEY=your_nasa_key_here

# === FUTURE FEATURES (Optional) ===
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_TWILIO_ACCOUNT_SID=your_twilio_sid
VITE_TWILIO_AUTH_TOKEN=your_twilio_token
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🚀 Next Steps

### Immediate
1. ✅ Get OpenWeatherMap API key (2 minutes)
2. ✅ Add to `.env` file
3. ✅ Run `npm run dev`
4. ✅ Test weather features!

### Optional
1. Get NASA API key for better rate limits
2. Explore all weather layers
3. Test mobility panel
4. Try different cities worldwide

---

## 💡 Pro Tips

1. **Best Weather Viewing**: Zoom to level 11 on major cities
2. **Wind Arrows**: Only appear at zoom 11+ (by design - avoids clutter)
3. **Refresh Rate**: Weather auto-refreshes every 5 minutes
4. **Layer Combos**: Try Temperature + Precipitation layers together
5. **Search Works Now**: Search bar fully functional with smooth fly-to animation
6. **Mobile-Friendly**: All features work on mobile (touch-friendly)

---

## 📞 Support

### Check These First
1. Browser console (F12) for error messages
2. `.env` file exists and has correct format
3. API keys are active and valid
4. Dev server restarted after adding keys

### Common Error Messages
- **"Weather data error: 401"** → Invalid API key
- **"Weather data error: 429"** → Rate limit (wait 1 min)
- **"Failed to fetch"** → Network/CORS issue (should not happen with OpenWeatherMap)

---

## ✨ You're Ready!

With your OpenWeatherMap API key set up, you now have:
- 🌤️ Real-time weather data
- 💨 Live wind visualization  
- 🌧️ Precipitation radar
- 🌡️ Temperature heatmaps
- 🏭 Air quality monitoring
- 🚗 Traffic analysis (coming soon)
- 🌊 Disaster risk assessment

**No more mocks - this is the real deal!** 🎉

---

## 📄 License
This project uses data from NASA (public domain) and OpenWeatherMap (free tier). All code is for educational purposes.

**Happy exploring! 🚀🌍**
