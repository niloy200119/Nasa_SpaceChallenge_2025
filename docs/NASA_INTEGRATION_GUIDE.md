# 🚀 NASA Data Integration - Complete Reference

## 📊 **INTEGRATION STATUS**

### ✅ **FULLY IMPLEMENTED**

| NASA API | File | Status | Features | Mock Data |
|----------|------|--------|----------|-----------|
| **EONET** | `eonet.js` | ✅ | Natural disaster events (wildfires, storms, floods, volcanoes) | ❌ (Real API) |
| **POWER** | `power.js` | ✅ Enhanced | Temperature, precipitation, wind, humidity, solar radiation, 40+ parameters | ✅ Yes |
| **GIBS** | `NasaMap.jsx` | ✅ | Satellite imagery layers (MODIS, VIIRS, Landsat true/false color) | ❌ (Real API) |
| **FIRMS** | `firms.js` | ✅ NEW | Real-time wildfire detection, fire intensity (FRP), fire risk scoring | ✅ Yes |
| **MODIS** | `modis.js` | ✅ NEW | NDVI vegetation health, land surface temperature, drought detection | ✅ Yes |
| **Air Quality** | `air-quality.js` | ✅ NEW | NO2, SO2, CO, PM2.5, AQI calculation, pollution source attribution | ✅ Yes |
| **DONKI** | `donki.js` | ✅ NEW | Space weather: solar flares, CMEs, geomagnetic storms, aurora predictions | ✅ Yes |

### 🔄 **READY TO INTEGRATE** (Mock data generators created)

These APIs have comprehensive mock data but need real API configuration:

- **GPM** (Global Precipitation Measurement) - Real-time rainfall data
- **GLDAS** (Land Data Assimilation) - Soil moisture, runoff
- **SMAP** (Soil Moisture) - High-resolution soil data
- **Grace-FO** (Groundwater) - Water mass changes
- **ICESat-2** (Elevation) - Terrain mapping for flood modeling
- **PO.DAAC** (Ocean Data) - Sea level, temperature, currents
- **Landsat** (High-res Imagery) - 30m resolution land changes
- **TROPOMI** (Air Quality) - High-resolution NO2/CO from Sentinel-5P
- **MERRA-2** (Aerosols) - PM2.5, dust, aerosol analysis

---

## 🎯 **HOW TO USE NASA DATA IN YOUR APP**

### 1. **Wildfire Detection & Monitoring** 🔥

```javascript
import { fetchActiveFires, calculateFireStats, calculateFireRisk } from './lib/nasa/firms'
import { fetchPowerDaily } from './lib/nasa/power'

// Get active fires in viewport
const fires = await fetchActiveFires(bbox, 'VIIRS_SNPP', 1) // Last 24 hours

// Calculate statistics
const stats = calculateFireStats(fires)
console.log(`${stats.total_fires} active fires detected`)
console.log(`Total fire radiative power: ${stats.total_frp} MW`)

// Calculate fire risk with weather data
const weather = await fetchPowerDaily(lat, lon, startDate, endDate, ['T2M', 'WS2M', 'RH2M'])
const risk = calculateFireRisk(
  { lat, lon },
  fires,
  { 
    temperature: weather.T2M[0], 
    wind_speed: weather.WS2M[0] * 3.6, // Convert m/s to km/h
    humidity: weather.RH2M[0] 
  }
)

console.log(`Fire risk score: ${risk.score}/100 (${risk.level})`)
console.log(`Recommendations:`, risk.recommendations)
```

**UI Implementation:**
- Heat map overlay showing fire intensity
- Fire markers color-coded by FRP (Fire Radiative Power)
- Risk scoring panel with weather factors
- Evacuation zone recommendations

---

### 2. **Vegetation Health & Drought Monitoring** 🌾

```javascript
import { fetchNDVI, calculateVegetationHealth, detectDroughtStress, fetchLST } from './lib/nasa/modis'

// Get NDVI time series
const endDate = new Date()
const startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000) // 1 year
const ndviData = await fetchNDVI(lat, lon, 'MOD13Q1', 'NDVI', startDate, endDate)

// Calculate health
const health = calculateVegetationHealth(ndviData.data)
console.log(`Vegetation health score: ${health.health_score}/100`)
console.log(`Status: ${health.status}, Trend: ${health.trend}`)

// Detect drought stress
const lstData = await fetchLST(lat, lon, new Date())
const precipData = await fetchPowerDaily(lat, lon, '20240101', '20241002', ['PRECTOT'])

const drought = detectDroughtStress(health, lstData, { monthly_total: precipData.PRECTOT[0] })
console.log(`Drought stress: ${drought.stress_level} (${drought.stress_score}/100)`)
console.log(`Recommendations:`, drought.recommendations)
```

**UI Implementation:**
- NDVI map with color gradient (red=stressed, green=healthy)
- Time-series chart showing vegetation trends
- Drought stress indicators
- Agricultural recommendations

---

### 3. **Air Quality Monitoring** 🌬️

```javascript
import { fetchAirQuality, calculateAQI, attributePollutionSources, calculateHealthRisk } from './lib/nasa/air-quality'

// Get comprehensive air quality
const aq = await fetchAirQuality(lat, lon, new Date())

console.log(`AQI: ${aq.aqi} (${aq.category})`)
console.log(`Dominant pollutant: ${aq.dominant_pollutant}`)
console.log(`Health implications: ${aq.health_implications}`)

// For custom AQI calculation
const customAQI = calculateAQI({
  pm25: 35.4,
  pm10: 50,
  no2: 100,
  so2: 20,
  co: 500,
  o3: 60
})

// Attribute pollution sources
const sources = attributePollutionSources({
  no2: 80,  // High NO2 = traffic
  co: 1200, // High CO = fires/vehicles
  pm25: 55,
  so2: 15
})

console.log(`Primary source: ${sources.primary_source}`)
console.log(`Traffic-related: ${sources.is_traffic_related}`)
```

**UI Implementation:**
- Multi-layer pollution maps (NO2, PM2.5, SO2, CO)
- AQI color-coded regions
- Health risk calculator
- Source attribution (traffic, industrial, fires)
- Real-time recommendations

---

### 4. **Space Weather Monitoring** ☀️

```javascript
import { fetchSolarFlares, fetchCME, fetchGeomagneticStorms, calculateSpaceWeatherImpact, predictAuroraVisibility } from './lib/nasa/donki'

// Get recent space weather events
const endDate = new Date()
const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000) // Last 7 days

const flares = await fetchSolarFlares(startDate, endDate)
const cmes = await fetchCME(startDate, endDate)
const storms = await fetchGeomagneticStorms(startDate, endDate)

// Calculate impact
const impact = calculateSpaceWeatherImpact(flares, cmes, storms)
console.log(`Space weather impact: ${impact.impact_level} (${impact.impact_score}/100)`)
console.log(`Affected systems:`, impact.affected_systems)

// Check if aurora is visible
const aurora = predictAuroraVisibility(lat, lon, 7) // Kp index 7
console.log(`Aurora visibility: ${aurora.visibility} (${aurora.probability}% probability)`)
console.log(`Best viewing: ${aurora.best_viewing_time}`)
```

**UI Implementation:**
- Solar flare timeline with class types (B, C, M, X)
- CME Earth-impact prediction
- Geomagnetic storm alerts
- Aurora visibility map
- Satellite communication risk warnings

---

### 5. **Comprehensive Climate Analysis** 🌡️

```javascript
import { fetchComprehensiveClimate, calculateExtremeWeatherRisk, calculateClimateAnomalies } from './lib/nasa/power'

// Get all climate parameters
const climate = await fetchComprehensiveClimate(lat, lon)

// Available data:
console.log(`Temperature: ${climate.T2M} °C`)
console.log(`Precipitation: ${climate.PRECTOT} mm/month`)
console.log(`Wind Speed: ${climate.WS10M} m/s`)
console.log(`Humidity: ${climate.RH2M}%`)
console.log(`Solar Radiation: ${climate.ALLSKY_SFC_SW_DWN} kWh/m²/day`)
console.log(`UV Index: ${climate.ALLSKY_SFC_UV_INDEX}`)

// Calculate extreme weather risks
const risks = calculateExtremeWeatherRisk(climate, lat)
console.log(`Extreme weather risk: ${risks.risk_level} (${risks.risk_score}/100)`)
risks.risks.forEach(risk => {
  console.log(`- ${risk.type}: ${risk.severity} (${risk.value})`)
})

// Calculate anomalies
const current = { T2M: 32, PRECTOT: 45, WS2M: 6 }
const anomalies = calculateClimateAnomalies(current, climate)
console.log(`Temperature anomaly: ${anomalies.temperature.anomaly}°C (${anomalies.temperature.status})`)
console.log(`Precipitation anomaly: ${anomalies.precipitation.anomaly}mm (${anomalies.precipitation.status})`)
```

**UI Implementation:**
- Multi-parameter climate dashboard
- Extreme weather risk scoring
- Historical vs current comparison
- Climate anomaly visualization
- Seasonal forecasts

---

## 🎨 **PANEL INTEGRATION EXAMPLES**

### Wildfire Panel (`WildfirePanel.jsx`)

```jsx
import { useState, useEffect } from 'react'
import { fetchActiveFires, calculateFireStats, calculateFireRisk } from '../lib/nasa/firms'
import { fetchAirQuality } from '../lib/nasa/air-quality'

export default function WildfirePanel({ bbox, center }) {
  const [fires, setFires] = useState([])
  const [stats, setStats] = useState(null)
  const [risk, setRisk] = useState(null)
  const [airQuality, setAirQuality] = useState(null)

  useEffect(() => {
    if (!bbox) return

    // Fetch fires
    fetchActiveFires(bbox, 'VIIRS_SNPP', 1).then(data => {
      setFires(data)
      setStats(calculateFireStats(data))
    })

    // Fetch air quality (smoke impact)
    if (center) {
      fetchAirQuality(center[0], center[1]).then(setAirQuality)
    }
  }, [bbox, center])

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🔥 Wildfire Intelligence</h2>
      
      {stats && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-red-900/30 p-3 rounded">
            <div className="text-2xl font-bold">{stats.total_fires}</div>
            <div className="text-sm">Active Fires</div>
          </div>
          <div className="bg-orange-900/30 p-3 rounded">
            <div className="text-2xl font-bold">{stats.max_frp} MW</div>
            <div className="text-sm">Max Intensity</div>
          </div>
          <div className="bg-yellow-900/30 p-3 rounded">
            <div className="text-2xl font-bold">{stats.area_affected_km2} km²</div>
            <div className="text-sm">Area Affected</div>
          </div>
        </div>
      )}

      {airQuality && airQuality.aqi > 100 && (
        <div className="bg-red-500/20 border border-red-500 p-3 rounded">
          <h3 className="font-bold">⚠️ Smoke Impact</h3>
          <p>Air Quality Index: {airQuality.aqi} ({airQuality.category})</p>
          <p className="text-sm mt-2">{airQuality.health_implications}</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-bold">Recent Fires</h3>
        {fires.slice(0, 10).map((fire, i) => (
          <div key={i} className="bg-space-800/50 p-2 rounded text-sm">
            <div className="flex justify-between">
              <span>Fire #{i + 1}</span>
              <span className="text-red-400">{fire.frp} MW</span>
            </div>
            <div className="text-xs text-gray-400">
              {fire.latitude.toFixed(4)}, {fire.longitude.toFixed(4)} • {fire.acq_date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### Air Quality Panel (`AirQualityPanel.jsx`)

```jsx
import { useState, useEffect } from 'react'
import { fetchAirQuality, attributePollutionSources } from '../lib/nasa/air-quality'

export default function AirQualityPanel({ center }) {
  const [aq, setAQ] = useState(null)

  useEffect(() => {
    if (!center) return
    fetchAirQuality(center[0], center[1]).then(setAQ)
  }, [center])

  if (!aq) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🌬️ Air Quality Monitor</h2>
      
      {/* AQI Score */}
      <div 
        className="p-6 rounded-lg text-center"
        style={{ backgroundColor: aq.color + '40', borderColor: aq.color }}
      >
        <div className="text-5xl font-bold">{aq.aqi}</div>
        <div className="text-xl mt-2">{aq.category}</div>
        <div className="text-sm mt-1 opacity-70">{aq.dominant_pollutant}</div>
      </div>

      {/* Health Implications */}
      <div className="bg-space-800/50 p-4 rounded">
        <h3 className="font-bold mb-2">Health Impact</h3>
        <p className="text-sm">{aq.health_implications}</p>
        <div className="mt-3 space-y-1">
          {aq.recommendations.map((rec, i) => (
            <div key={i} className="text-sm">• {rec}</div>
          ))}
        </div>
      </div>

      {/* Pollutant Breakdown */}
      <div className="space-y-2">
        <h3 className="font-bold">Pollutants</h3>
        {aq.components.map(comp => (
          <div key={comp.pollutant} className="bg-space-800/30 p-2 rounded">
            <div className="flex justify-between">
              <span>{comp.pollutant}</span>
              <span className="text-yellow-400">AQI {comp.aqi}</span>
            </div>
            <div className="text-xs text-gray-400">
              {comp.concentration.toFixed(1)} {comp.pollutant === 'PM2.5' ? 'µg/m³' : 'ppb'}
            </div>
          </div>
        ))}
      </div>

      {/* Pollution Sources */}
      {aq.sources.sources.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold">Pollution Sources</h3>
          {aq.sources.sources.map((source, i) => (
            <div key={i} className="bg-space-800/30 p-2 rounded">
              <div className="flex justify-between">
                <span>{source.source}</span>
                <span className="text-red-400">{source.contribution}%</span>
              </div>
              <div className="text-xs text-gray-400">{source.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 🔥 **QUICK START: Add NASA Data to Existing Panels**

### Enhance Climate Panel with More Data

```jsx
// In ClimatePanel.jsx
import { fetchComprehensiveClimate, calculateExtremeWeatherRisk } from '../lib/nasa/power'

// In useEffect:
const climate = await fetchComprehensiveClimate(lat, lon)
const risks = calculateExtremeWeatherRisk(climate, lat)

// Display:
<div>
  <h3>Extreme Weather Risks</h3>
  {risks.risks.map(risk => (
    <div className={`alert alert-${risk.severity}`}>
      {risk.type}: {risk.value}
    </div>
  ))}
</div>
```

### Add Fire Data to Events Panel

```jsx
// In EventsPanel.jsx
import { fetchActiveFires } from '../lib/nasa/firms'

// Add to events list:
const fires = await fetchActiveFires(bbox, 'VIIRS_SNPP', 7) // Last 7 days

fires.forEach(fire => {
  events.push({
    id: `fire-${fire.latitude}-${fire.longitude}`,
    title: `Active Fire (${fire.frp} MW)`,
    categories: [{ title: 'Wildfires' }],
    geometries: [{ coordinates: [fire.longitude, fire.latitude] }],
    date: fire.acq_date
  })
})
```

### Add Air Quality to Transportation Panel

```jsx
// In MobilityPanel.jsx
import { fetchNO2 } from '../lib/nasa/air-quality'

// Show traffic-related emissions:
const no2Data = await fetchNO2(bbox, new Date())

// Overlay NO2 as traffic emission heat map
// High NO2 = high traffic emissions
```

---

## 📚 **API KEY SETUP**

### Get Your FREE NASA API Key

1. Visit: https://api.nasa.gov/
2. Fill out simple form (instant approval)
3. Add to `.env`:

```env
VITE_NASA_API_KEY=your_key_here
```

### FIRMS Requires Separate Key

1. Visit: https://firms.modaps.eosdis.nasa.gov/api/
2. Register for free
3. Add to `.env`:

```env
VITE_FIRMS_API_KEY=your_firms_key_here
```

### Using DEMO_KEY for Testing

All APIs support `DEMO_KEY` for testing:
- Rate limit: 30 requests/hour
- Good for development
- Switch to real key for production

---

## 🚀 **NEXT ACTIONS**

**What would you like me to build next?**

1. **🔥 Wildfire Panel** - Complete UI with fire heat map, risk scoring, evacuation zones
2. **🌬️ Air Quality Panel** - Multi-pollutant maps, health calculator, source attribution
3. **🌾 Vegetation Panel** - NDVI maps, crop health, drought monitoring
4. **☀️ Space Weather Panel** - Solar flares, CMEs, aurora predictions
5. **🌊 Enhanced Water Panel** - Add GPM precipitation, SMAP soil moisture
6. **🌡️ Enhanced Climate Panel** - Add extreme weather risks, climate anomalies

**Or I can:**
- Integrate NASA data into existing panels
- Create unified NASA data dashboard
- Build satellite imagery viewer with time-series

**What's your priority?** 🎯
