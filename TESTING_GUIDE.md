# 🧪 Quick Testing Guide - Urban Planning Panels

## ✅ How to Test the New Features

### 1. **Start the Development Server**
```bash
cd /Users/niloy19/nasa_space_challenge/nasa_space
npm run dev
```

The app should open automatically at `http://localhost:5173/`

---

## 2. **Enable the New Panels**

Look at the **header** (top of the page) for the panel toggles:

### Existing Toggles (already there):
- ✅ 🤖 AI Crisis
- ✅ Resilience
- ✅ Scenarios
- ✅ Water/Flood
- ✅ Mobility
- ✅ Events
- ✅ Climate

### NEW Toggles (just added):
- ✅ **🏙️ Infrastructure** ← Click this checkbox
- ✅ **🌿 Environment** ← Click this checkbox
- ✅ **⚡ Energy** ← Click this checkbox

---

## 3. **Test Each Panel**

### 🏙️ Urban Infrastructure Panel

**Enable**: Check "🏙️ Infrastructure" in header

**Expected**: Panel appears on the right sidebar with 6 tabs:
1. **Food Access** - Should show:
   - Food desert zones (0-1km, 1-3km, etc.)
   - Progress bar for nutrition quality (red/yellow/green)
   - Underserved population count
   - Market coverage percentage

2. **Housing** - Should show:
   - Density (people/km²)
   - Affordability index (0-100)
   - Overcrowding percentage
   - Development zones list

3. **Transportation** - Should show:
   - Network coverage percentage
   - Accessibility scores with colored bars
   - Modal share breakdown
   - Underserved areas count

4. **Healthcare** - Should show:
   - Facility distribution map
   - Coverage gaps (Critical/High/Moderate/Low)
   - Population per facility ratio
   - Emergency access time

5. **Parks** - Should show:
   - Green space per capita (m²/person)
   - Accessibility radius visualization
   - Coverage zones (Good/Fair/Poor)
   - Underserved population

6. **Growth** - Should show:
   - Population growth rate (% annually)
   - Development hotspots list
   - Infrastructure gap analysis
   - Priority areas ranking

**Visual Tests**:
- ✅ Tab switching works smoothly
- ✅ Progress bars have gradient colors (red→yellow→green)
- ✅ Numbers are large and readable
- ✅ Hover effects on metric cards
- ✅ Fade-in animation when switching tabs

---

### 🌿 Environmental Health Panel

**Enable**: Check "🌿 Environment" in header

**Expected**: Panel appears with 6 tabs:
1. **Air Quality** - Should show:
   - Real-time PM2.5, NO2, CO, O3 levels
   - AQI scale with colors (Good/Moderate/Unhealthy/Hazardous)
   - Health implications text
   - Heatmap zones (if OpenWeatherMap API working)

2. **Water Quality** - Should show:
   - pH levels by water body
   - Turbidity (NTU)
   - Contaminants detected
   - WQI scores (0-100)

3. **Industrial Impact** - Should show:
   - Factory emissions count
   - Habitat degradation scores
   - Affected species count
   - Restoration priority zones

4. **Waste Management** - Should show:
   - Collection efficiency (%)
   - Recycling rate (%)
   - Landfill capacity (years)
   - Illegal dumping hotspots

5. **Pollution Sources** - Should show:
   - Source breakdown (Vehicles/Industry/Residential/Agriculture)
   - Contribution percentages
   - Impact severity (Critical/High/Moderate/Low)

6. **Environmental Justice** - Should show:
   - Vulnerable communities list
   - Pollution burden scores
   - Health disparity metrics
   - Exposure equity analysis

**Visual Tests**:
- ✅ Air quality shows real data from OpenWeatherMap (if available)
- ✅ Heatmap zones have 5 colors (green/yellow/orange/red/purple)
- ✅ Health implications text is clear
- ✅ Critical zones pulse with animation
- ✅ Efficiency meters fill with gradients

---

### ⚡ Energy & Utilities Panel

**Enable**: Check "⚡ Energy" in header

**Expected**: Panel appears with 6 tabs:
1. **Grid Coverage** - Should show:
   - Electricity access percentage
   - Grid reliability score (0-100)
   - Average outages per year
   - Areas without electricity count

2. **Energy Gaps** - Should show:
   - Underserved areas list
   - Population affected (thousands)
   - Energy poverty rate (%)
   - Household access gaps

3. **Energy Mix** - Should show:
   - Source breakdown (Coal/Gas/Nuclear/Solar/Wind/Hydro)
   - Capacity (MW) per source
   - Emissions (tons CO2/year)
   - Transition progress bars

4. **Renewable Potential** - Should show:
   - Solar capacity (kWh/year)
   - Wind potential based on location
   - Installation opportunities count
   - ROI estimates

5. **Infrastructure** - Should show:
   - Substations count
   - Transmission lines (km)
   - Distribution networks
   - Upgrade priority areas
   - Quality scores (Excellent/Good/Fair/Poor)

6. **Microgrids** - Should show:
   - Community opportunities count
   - Decentralized system potential
   - Resilience benefits text
   - Deployment readiness (High/Medium/Low)

**Visual Tests**:
- ✅ Energy source bars show different colors
- ✅ Renewable potential varies by climate zone
- ✅ Infrastructure quality indicators clear
- ✅ Progress bars animate on load
- ✅ Numbers update based on location

---

## 4. **Test Location Changes**

**Test**: Search for a different city (e.g., "London", "Tokyo", "Mumbai")

**Expected**:
- All panel data should update
- Numbers should change based on new coordinates
- Climate zone calculations should adjust
- Progress bars should re-animate

**Cities to Try**:
- **New York** (temperate zone, high density)
- **Phoenix** (arid zone, high solar potential)
- **Singapore** (tropical zone, high humidity)
- **Berlin** (temperate zone, moderate density)

---

## 5. **Test Visual Animations**

### Progress Bars
- ✅ Should have shimmer effect (light sweep)
- ✅ Should fill from left to right
- ✅ Colors: Red (<30%), Yellow (30-80%), Green (>80%)

### Tab Switching
- ✅ Content fades in smoothly
- ✅ Numbers slide up slightly
- ✅ Tab underline animates

### Metric Cards
- ✅ Hover lifts card up
- ✅ Glow effect appears
- ✅ Smooth transition

### Critical Alerts
- ✅ Red badges pulse
- ✅ Hazardous zones blink
- ✅ Critical indicators glow

---

## 6. **Test Responsive Design**

### Desktop (>1280px)
- ✅ Map on left (2/3 width)
- ✅ Panels on right (1/3 width)
- ✅ All tabs visible
- ✅ Full metrics displayed

### Tablet (768px-1280px)
- ✅ Map on top
- ✅ Panels stack below
- ✅ Tabs scroll horizontally if needed

### Mobile (<768px)
- ✅ Everything stacks vertically
- ✅ Panels full width
- ✅ Tab navigation compact

---

## 7. **Test Error Handling**

### Panel Errors
- ✅ If data fetch fails, should show error message
- ✅ Other panels should still work (ErrorBoundary)
- ✅ No white screen crashes

### API Errors
- ✅ If OpenWeatherMap fails, should show fallback data
- ✅ Clear error message displayed
- ✅ Retry option available (reload)

---

## 8. **Check Browser Console**

**Open DevTools** (F12 or Cmd+Option+I)

### Expected Console Output:
```
🌍 Fetching data for: [City Name] at [lat, lon]
☁️ Fetching weather...
✅ Weather data: {weather data}
💨 Fetching air quality...
✅ Air quality data: {air quality data}
🔥 Fetching disasters...
✅ Disasters found: [count]
```

### Should NOT see:
- ❌ Uncaught errors
- ❌ Failed to compile
- ❌ Module not found
- ❌ Component crash errors

---

## 9. **Test MapInsights (Below Map)**

**Verify**: The interactive insights section below the map should still work

**6 Tabs**:
1. **Forecast** - 5-day weather
2. **Density** - Population metrics
3. **Risks** - Disaster summary
4. **Forestry** - Forest coverage
5. **Geology** - Earthquakes, volcanoes
6. **Mining** - Resource extraction

**Test**: Click through all tabs, ensure they render correctly

---

## 10. **Quick Visual Checklist**

### Header
- ✅ MetroScape logo with 🌍
- ✅ City name displays after search
- ✅ Search autocomplete dropdown works
- ✅ Date picker present
- ✅ 10 panel toggle checkboxes visible (7 old + 3 new)

### Map
- ✅ Centered on location
- ✅ NASA GIBS layers toggleable
- ✅ Leaflet controls working
- ✅ Weather layers dropdown functional

### Sidebar Panels
- ✅ Panels only show when toggled on
- ✅ Scroll works if content overflows
- ✅ Glass morphism effect (semi-transparent with blur)
- ✅ Border glow effect present

### New Panels
- ✅ Infrastructure panel has 6 tabs
- ✅ Environment panel has 6 tabs
- ✅ Energy panel has 6 tabs
- ✅ All tabs render without errors
- ✅ Data updates when city changes

---

## 🐛 Common Issues & Fixes

### Issue: Panel not showing
**Fix**: Check the checkbox in the header

### Issue: Data shows "Loading..."
**Fix**: Wait a few seconds for API calls to complete

### Issue: Numbers don't change with location
**Fix**: Ensure city search completed successfully (check console)

### Issue: CSS animations not working
**Fix**: Check that `visualizations.css` is imported in `main.jsx`

### Issue: Air quality shows mock data
**Fix**: This is expected if OpenWeatherMap API limit reached

---

## ✅ Success Indicators

### You'll know it's working when:
1. **Header has 10 checkboxes** (3 new ones with icons)
2. **Toggling shows/hides panels** smoothly
3. **Each panel has 6 clickable tabs**
4. **Progress bars are colorful** (red/yellow/green)
5. **Numbers are large and readable**
6. **Hover effects work** on metric cards
7. **Animations play** when switching tabs
8. **No console errors**

---

## 🎯 Key Things to Look For

### Visual Appeal (MANDATORY)
- ✅ **Colors are vibrant** and meaningful
- ✅ **Gradients are smooth** (not harsh)
- ✅ **Animations are subtle** (not jarring)
- ✅ **Typography is clear** (readable sizes)
- ✅ **Spacing is consistent** (not cramped)
- ✅ **Glass effects look modern** (blur + transparency)

### User-Friendliness (MANDATORY)
- ✅ **Navigation is intuitive** (tabs obvious)
- ✅ **Metrics are self-explanatory** (clear labels)
- ✅ **Health implications explained** (not just numbers)
- ✅ **Priority levels clear** (Critical/High/Moderate/Low)
- ✅ **Loading states present** (not blank screens)
- ✅ **Error messages helpful** (not technical jargon)

---

## 📸 Screenshot Checklist

Take screenshots of:
1. **Header** with all 10 toggles visible
2. **Infrastructure panel** - Food Access tab
3. **Infrastructure panel** - Housing tab with progress bars
4. **Environment panel** - Air Quality tab with heatmap
5. **Environment panel** - Waste Management tab
6. **Energy panel** - Grid Coverage tab
7. **Energy panel** - Renewable Potential tab
8. **Hover effect** on a metric card (glowing)
9. **Tab switching animation** (if possible)
10. **Full page view** with map + panels

---

## 🚀 Final Verification

### Quick 60-Second Test
1. ✅ Load `http://localhost:5173/`
2. ✅ Search for "New York"
3. ✅ Check "🏙️ Infrastructure"
4. ✅ Click through all 6 tabs
5. ✅ Check "🌿 Environment"
6. ✅ Click through all 6 tabs
7. ✅ Check "⚡ Energy"
8. ✅ Click through all 6 tabs
9. ✅ Search for "Tokyo"
10. ✅ Verify numbers updated

**If all 10 steps work**: ✅ **INTEGRATION SUCCESSFUL!**

---

## 🎉 You're Done!

MetroScape now has **comprehensive urban planning capabilities** with **stunning visualizations**. The platform answers all critical questions about community needs, environmental health, and energy infrastructure—all with professional-grade design.

**Enjoy exploring the platform!** 🌍✨
