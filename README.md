# 🌍 MetroScape - AI-Powered City Resilience Platform

> **An intelligent web application using AI and real-time NASA data to monitor city resilience, predict disasters, and provide crisis management recommendations.**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF?logo=vite)

**🌐 [Live Demo](https://nasa-space-challenge-2025.vercel.app)** | **📚 [Documentation](docs/)** | **🚀 [Deployment Guide](DEPLOYMENT_GUIDE.md)**

---

## 🎯 Overview

**MetroScape** is an AI-powered urban resilience platform that combines real-time NASA satellite data with Google Gemini AI to provide:

- 🤖 **AI Crisis Management** - Intelligent recommendations for emergency response using Gemini AI
- 🔍 **Real-Time Disaster Monitoring** - Track wildfires, floods, earthquakes, storms live
- 📊 **Dynamic Resilience Scoring** - City-specific 0-100 scores updated in real-time
- 🎮 **Disaster Scenario Simulation** - Run "what-if" scenarios for preparedness
- 🗺️ **NASA Satellite Visualization** - 8 live data layers from NASA GIBS
- 🚨 **Smart Flood Alerts** - HyFuse sensor integration with AI analysis

### 🏆 Key Features

### 🏆 Key Features

🤖 **AI-Powered Crisis Management** - Google Gemini AI analyzes real-time data and generates intelligent action plans  
✅ **City-Specific Real-Time Data** - All metrics update dynamically based on actual conditions  
✅ **14 Toggleable Layers** - 8 NASA satellite layers + 6 data panels  
✅ **Dynamic Resilience Scoring** - 0-100 score calculated from live weather, disasters, air quality  
✅ **Disaster Scenarios** - 7 disaster types with unique simulation aspects  
✅ **Live Weather Integration** - OpenWeatherMap real-time data with 5 overlay layers  
✅ **NASA Satellite Data** - 7 integrated NASA APIs (GIBS, EONET, POWER, FIRMS, etc.)  
✅ **Fixed Map Interface** - No scrolling gaps, smooth UX  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **API Keys** (free):
  - [OpenWeatherMap API](https://openweathermap.org/api) - Weather data
  - [NASA API](https://api.nasa.gov/) - Satellite and disaster data

### Installation

```bash
# Clone the repository
git clone https://github.com/niloy200119/Nasa_SpaceChallenge_2025.git
cd Nasa_SpaceChallenge_2025

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your API keys

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### 🌐 Deploy to Production

Deploy your own instance to Vercel (recommended):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/niloy200119/Nasa_SpaceChallenge_2025)

**Or use the quick deploy script:**
```bash
# Install Vercel CLI and deploy
npm install -g vercel
./deploy.sh
```

**📖 Full deployment instructions:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**🔐 Remember to add environment variables on Vercel:**
- `VITE_OPENWEATHER_API_KEY`
- `VITE_NASA_API_KEY`

---### Environment Setup

Create a `.env` file in the project root (copy from `.env.example`):

```env
# Required
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_NASA_API_KEY=your_nasa_api_key_here

# Optional
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

**🔐 Important:** Never commit your `.env` file with real API keys to GitHub!

---

## 📖 Usage Guide

### 1. City Search
- Click the search bar in the top-left
- Type any city name (e.g., "Tokyo", "New York", "Mumbai")
- Press Enter or click a suggestion
- Map zooms to your city with filtered data

### 2. Toggle Map Layers
**NASA GIBS Layers** (above map):
- ✅ True Color - Satellite imagery
- 🔥 Thermal Anomalies - Fire detection
- 🌫️ Aerosol Optical Depth - Air quality

**Weather Overlays** (🌤️ button top-right):
- Precipitation, Temperature, Clouds, Wind, Pressure

### 3. View Resilience Score
- Check **"Resilience"** in header
- See 0-100 score with color coding:
  - 🟢 80-100: Excellent
  - 🔵 65-79: Good
  - 🟡 50-64: Moderate
  - 🟠 35-49: Fair
  - 🔴 0-34: Poor
- Expand to see 6 component breakdowns
- View top vulnerabilities and strengths
- Get priority recommendations

### 4. Run Disaster Simulations
- Check **"Scenarios"** in header
- Select disaster type (Floods, Wildfires, Earthquakes, etc.)
- Choose severity: Low → Moderate → High → Severe
- Set duration: 6-72 hours
- Click **"Run Simulation"**
- Use playback controls: ▶️ Play | ⏸️ Pause | ⏭️ Step | 🔄 Reset

**Each disaster shows unique aspects:**
- 🌊 **Floods**: Water depth, drainage capacity, evacuation time
- 🔥 **Wildfires**: Fire spread rate, smoke dispersion, fuel density
- 🏚️ **Earthquakes**: Magnitude, liquefaction risk, aftershock probability
- ⛈️ **Severe Storms**: Wind speed, rainfall intensity, storm surge
- 🌡️ **Temperature Extremes**: Heat index, vulnerable populations
- 🏜️ **Drought**: Water scarcity, crop impact, fire danger
- ⛰️ **Landslides**: Slope stability, soil saturation

### 5. Other Panels
- **Water/Flood** - Configure flood alerts, view HyFuse sensor data
- **Mobility** - Transportation impact analysis
- **Climate** - Long-term climate normals
- **Events** - NASA EONET disaster tracking

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - UI framework with hooks
- **Vite 5.4.8** - Build tool with HMR
- **Leaflet 1.9.4** - Interactive mapping
- **Tailwind CSS** - Utility-first styling

### APIs & Data Sources
- **NASA GIBS** - Satellite imagery tiles
- **NASA EONET** - Natural event tracking
- **NASA POWER** - Climate data
- **NASA FIRMS** - Fire information
- **NASA MODIS** - Atmospheric data
- **NASA Air Quality** - Pollution monitoring
- **NASA DONKI** - Space weather
- **OpenWeatherMap** - Real-time weather
- **OpenStreetMap Nominatim** - Geocoding

### Architecture
- Component-based React architecture
- Error boundaries for graceful failure handling
- Debounced API calls to prevent rate limiting
- State management with React hooks
- Responsive design for mobile/tablet/desktop

---

## 📁 Project Structure

```
nasa_space/
├── src/
│   ├── components/
│   │   ├── Background/       # Starfield & city parallax
│   │   ├── Effects/          # Visual effects (flood, thunder, etc.)
│   │   ├── Map/              # Leaflet map components
│   │   ├── Panels/           # Data panels (6 panels)
│   │   ├── ErrorBoundary.jsx
│   │   └── Header.jsx
│   ├── lib/
│   │   ├── nasa/             # NASA API integrations (11 files)
│   │   └── utils/            # Helper utilities
│   ├── assets/               # Static assets
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── docs/                     # Detailed documentation
│   ├── QUICK_START_GUIDE.md
│   ├── API_REFERENCE.md
│   ├── FEATURE_CHECKLIST.md
│   └── ...
├── public/                   # Static files
├── .env.example              # Environment template
├── package.json
└── vite.config.js
```

---

## 📊 Resilience Scoring System

The app calculates a **comprehensive 0-100 resilience score** based on 6 weighted components:

| Component | Weight | Description |
|-----------|--------|-------------|
| 🌤️ Weather | 20% | Temperature extremes, wind, precipitation |
| 🔥 Disaster | 25% | Active disasters, proximity, severity |
| 🌍 Climate | 15% | Long-term patterns, vulnerability |
| 🚗 Mobility | 15% | Transportation, evacuation capacity |
| 💨 Air Quality | 10% | AQI, PM2.5, pollutants |
| 🏗️ Infrastructure | 15% | Safe routes, blocked roads |

**Output includes:**
- Overall score (0-100)
- Resilience level (Excellent → Poor)
- Component breakdown (6 individual scores)
- Top 2 vulnerabilities (red alerts)
- Top 2 strengths (green highlights)
- Up to 5 priority recommendations

---

## 🎮 Disaster Simulation Engine

Run realistic hour-by-hour disaster simulations with **disaster-specific aspects**:

### Simulation Features
- ⏱️ **Timeline**: Hour-by-hour progression (6-72 hours)
- 📈 **Intensity Curve**: Peaks at ~65% of timeline, then declines
- 🎚️ **4 Severity Levels**: Low (0.3x) → Moderate (0.6x) → High (0.85x) → Severe (1.0x)
- 📊 **Impact Analysis**: Population affected, economic loss, response units
- ✅ **Preparedness Checklist**: 5 disaster-specific action items

### Unique Aspects Per Disaster
Each disaster type has **5-6 unique aspects** (NO overlap):

**🌊 Floods** show: Water depth (m), Drainage capacity (%), Evacuation time (h)  
**🔥 Wildfires** show: Fire spread rate (km/h), Smoke dispersion, Fuel density  
**🏚️ Earthquakes** show: Magnitude (Richter), Liquefaction risk, Aftershock probability  
**⛈️ Storms** show: Wind speed (km/h), Rainfall intensity, Storm surge  

---

## 🗺️ Interactive Map Layers

### NASA GIBS Layers (3)
1. **True Color (MODIS Terra)** - Natural satellite view
2. **Thermal Anomalies (VIIRS Noaa20)** - Fire/heat detection
3. **Aerosol Optical Depth (MODIS Aqua)** - Air quality visualization

### Weather Overlays (5)
1. **Precipitation** - Rain/snow radar
2. **Temperature** - Heat map (°C/°F)
3. **Clouds** - Cloud coverage %
4. **Wind** - Wind speed and direction
5. **Pressure** - Atmospheric pressure (hPa)

### Disaster Markers
- 🔥 **Wildfires** - Active fire locations (NASA FIRMS)
- 🌊 **Floods** - Flood events (NASA EONET)
- 🌀 **Storms** - Severe weather events
- 🌋 **Volcanoes** - Volcanic activity
- 🏚️ **Earthquakes** - Seismic events
- 🌡️ **Temperature Extremes** - Heat waves

---

## 📚 Documentation

Detailed documentation available in `/docs`:

- **[Quick Start Guide](docs/QUICK_START_GUIDE.md)** - Tutorials and tips
- **[Feature Checklist](docs/FEATURE_CHECKLIST.md)** - All implemented features
- **[API Reference](docs/API_REFERENCE.md)** - API integration details
- **[Implementation Verification](docs/IMPLEMENTATION_VERIFICATION.md)** - Technical architecture
- **[Final Summary](docs/FINAL_IMPLEMENTATION_SUMMARY.md)** - Project overview
- **[NASA Integration Guide](docs/NASA_INTEGRATION_GUIDE.md)** - NASA APIs setup
- **[Water/Flood Summary](docs/WATER_FLOOD_SUMMARY.md)** - Flood system details
- **[Disaster Management Plan](docs/DISASTER_MANAGEMENT_MASTER_PLAN.md)** - Emergency framework

---

## 🐛 Troubleshooting

### Common Issues

**❌ "API Key Error"**
- Check your `.env` file exists and has valid API keys
- Restart dev server after changing `.env`
- Verify API keys at [OpenWeatherMap](https://home.openweathermap.org/api_keys) and [NASA API](https://api.nasa.gov/)

**❌ Map layers not showing**
- Check browser console for API errors
- Verify internet connection
- Some NASA layers have date restrictions (use recent dates)

**❌ City search not working**
- Try full city names (e.g., "New York City" instead of "NYC")
- Check internet connection (uses OpenStreetMap API)

**❌ Slow performance**
- Disable unused layers
- Close unused panels
- Clear browser cache

**❌ "Too many requests" error**
- Debouncing is enabled (500ms)
- Free API limits: OpenWeatherMap 60/min, NASA 1,000/hour
- Wait a few minutes and try again

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow existing code style (Prettier + ESLint)
- Add comments for complex logic
- Test all features before committing
- Update documentation if adding features

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA** - For providing free APIs and satellite data
- **OpenWeatherMap** - For real-time weather data
- **OpenStreetMap** - For geocoding services
- **React Team** - For the amazing UI framework
- **Leaflet** - For mapping capabilities

---

## 📧 Contact

**Project Maintainer:** Niloy  
**GitHub:** [@niloy200119](https://github.com/niloy200119)  
**Repository:** [Nasa_SpaceChallenge_2025](https://github.com/niloy200119/Nasa_SpaceChallenge_2025)

---

## 🌟 Star History

If this project helps you, please consider giving it a ⭐️ on GitHub!

---

**Built with ❤️ for NASA Space Challenge 2025**
