# 🛰️ NASA API Integration Guide

## 🎯 Overview

This document catalogs ALL NASA data sources integrated into the Space Challenge app, providing comprehensive Earth observation, climate, and space weather capabilities.

---

## 🔑 **API KEY SETUP**

### Get Your NASA API Key
1. Visit: https://api.nasa.gov/
2. Sign up (free, instant approval)
3. Add to `.env`:

```env
VITE_NASA_API_KEY=your_api_key_here
```

### Alternative: DEMO_KEY
For development, use `DEMO_KEY` (limited to 30 requests/hour):
```javascript
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
```

---

## 📡 **NASA DATA SOURCES**

### ✅ Already Integrated

#### 1. **EONET** (Earth Observatory Natural Event Tracker)
- **URL**: https://eonet.gsfc.nasa.gov/api/v3/events
- **Purpose**: Real-time natural disasters (wildfires, storms, floods, volcanoes)
- **Status**: ✅ Implemented in `src/lib/nasa/eonet.js`
- **Features**: Event filtering, bounding box search, category filtering
- **No API Key Required!**

#### 2. **POWER** (Prediction of Worldwide Energy Resources)
- **URL**: https://power.larc.nasa.gov/api/temporal/daily/point
- **Purpose**: Climate data (temperature, precipitation, solar radiation)
- **Status**: ✅ Implemented in `src/lib/nasa/power.js`
- **Features**: 40+ climate parameters, 1981-present, global coverage
- **No API Key Required!**

#### 3. **GIBS** (Global Imagery Browse Services)
- **URL**: https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/
- **Purpose**: Satellite imagery layers (MODIS, VIIRS, Landsat)
- **Status**: ✅ Implemented in `src/components/Map/NasaMap.jsx`
- **Features**: True color, false color, NDVI, thermal imaging
- **No API Key Required!**

---

### 🆕 **NASA APIs TO INTEGRATE**

#### 4. **FIRMS** (Fire Information for Resource Management System)
- **URL**: https://firms.modaps.eosdis.nasa.gov/api/area/
- **Purpose**: Real-time wildfire detection & monitoring
- **Data**: Fire location, brightness, FRP (Fire Radiative Power), confidence
- **Update Frequency**: Near real-time (15 min - 3 hours)
- **API Key**: Required (different from NASA API key)
- **Register**: https://firms.modaps.eosdis.nasa.gov/api/

**Features to Build:**
- 🔥 Fire heat map overlay
- 📊 Fire intensity chart
- 🚨 Fire alert system
- 📈 Historical fire patterns
- 💨 Smoke plume prediction

---

#### 5. **GPM** (Global Precipitation Measurement)
- **URL**: https://gpm.nasa.gov/data/sources
- **Purpose**: Real-time precipitation, rainfall, snowfall
- **Data**: Precipitation rate (mm/hr), storm tracking, flood forecasting
- **Update Frequency**: 30 minutes
- **Access**: Via Giovanni or GES DISC

**Features to Build:**
- 🌧️ Rainfall accumulation maps
- ⛈️ Storm tracking & prediction
- 🌊 Flood risk enhancement (combine with HyFuse)
- 📉 Drought monitoring

---

#### 6. **GLDAS** (Global Land Data Assimilation System)
- **URL**: https://ldas.gsfc.nasa.gov/gldas/
- **Purpose**: Soil moisture, groundwater, runoff, evapotranspiration
- **Data**: Soil wetness, snow water equivalent, surface runoff
- **Resolution**: 0.25° x 0.25° (27 km)
- **Update Frequency**: Daily

**Features to Build:**
- 💧 Soil moisture maps
- 🌊 Runoff prediction (flood precursor)
- 🏜️ Drought severity index
- ❄️ Snow water equivalent (spring flood risk)

---

#### 7. **SMAP** (Soil Moisture Active Passive)
- **URL**: https://smap.jpl.nasa.gov/data/
- **Purpose**: High-resolution soil moisture
- **Data**: Surface soil moisture (0-5 cm depth)
- **Resolution**: 9 km (higher than GLDAS)
- **Update Frequency**: 2-3 days

**Features to Build:**
- 🌱 Agricultural water stress
- 🌊 Flash flood potential
- 🔥 Wildfire risk (dry soil = higher risk)
- 📊 Soil moisture anomaly maps

---

#### 8. **Grace-FO** (Gravity Recovery and Climate Experiment Follow-On)
- **URL**: https://grace.jpl.nasa.gov/data/get-data/
- **Purpose**: Groundwater depletion, water mass changes
- **Data**: Groundwater storage anomalies, aquifer levels
- **Resolution**: ~300 km
- **Update Frequency**: Monthly

**Features to Build:**
- 💧 Groundwater depletion trends
- 🚰 Water scarcity alerts
- 📉 Long-term drought assessment
- 🌊 Subsidence risk (groundwater pumping)

---

#### 9. **MODIS** (Moderate Resolution Imaging Spectroradiometer)
- **URL**: https://modis.gsfc.nasa.gov/data/
- **Purpose**: Vegetation health, land cover, thermal anomalies
- **Data**: NDVI, EVI, LST (Land Surface Temperature), fire detection
- **Resolution**: 250m - 1km
- **Update Frequency**: Daily (Terra & Aqua satellites)

**Features to Build:**
- 🌿 NDVI vegetation health maps
- 🔥 Thermal anomaly detection (fires, volcanoes)
- 🌡️ Urban heat island mapping
- 🌾 Crop health monitoring
- 🏜️ Desertification tracking

---

#### 10. **Landsat** (30+ years of Earth imagery)
- **URL**: https://landsat.gsfc.nasa.gov/data/
- **Purpose**: High-resolution land change detection
- **Data**: True color, false color, land use changes
- **Resolution**: 30 meters
- **Archive**: 1972-present

**Features to Build:**
- 🏙️ Urban growth time-lapse
- 🌳 Deforestation tracking
- 🌊 Coastline erosion monitoring
- 🏔️ Glacier retreat visualization
- 🔍 Before/after disaster comparison

---

#### 11. **OMI** (Ozone Monitoring Instrument)
- **URL**: https://aura.gsfc.nasa.gov/omi.html
- **Purpose**: Air quality - NO2, SO2, ozone
- **Data**: Tropospheric NO2 (traffic/industry), SO2 (volcanoes/coal)
- **Resolution**: 13 x 24 km
- **Update Frequency**: Daily

**Features to Build:**
- 🏭 NO2 pollution maps (traffic hotspots)
- 🌋 SO2 volcanic emissions
- 😷 Air quality health alerts
- 🚗 Traffic-related emissions for Mobility panel
- 📊 Pollution trends over time

---

#### 12. **MERRA-2** (Modern-Era Retrospective analysis)
- **URL**: https://gmao.gsfc.nasa.gov/reanalysis/MERRA-2/
- **Purpose**: Comprehensive atmospheric data reanalysis
- **Data**: PM2.5, PM10, black carbon, dust, sea salt aerosols
- **Resolution**: 0.5° x 0.625° (~50 km)
- **Time Range**: 1980-present

**Features to Build:**
- 😷 Historical air quality analysis
- 💨 Dust storm tracking
- 🌫️ Aerosol optical depth maps
- 🏭 Emission source attribution

---

#### 13. **TROPOMI** (on Sentinel-5P)
- **URL**: https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-5p
- **Purpose**: High-resolution air quality (NO2, CO, O3, SO2, CH4)
- **Resolution**: 7 x 3.5 km (best air quality satellite!)
- **Update Frequency**: Daily
- **Note**: ESA satellite with NASA data distribution

**Features to Build:**
- 🚗 Traffic congestion via NO2 (Mobility panel!)
- 🏭 Industrial emission hotspots
- 🔥 CO from wildfires
- 🌾 Methane from agriculture/landfills

---

#### 14. **ICESat-2** (Ice, Cloud, and land Elevation Satellite)
- **URL**: https://icesat-2.gsfc.nasa.gov/
- **Purpose**: High-precision elevation measurements
- **Data**: Terrain height, ice sheet thickness, forest canopy height
- **Resolution**: 70 cm vertical accuracy
- **Update Frequency**: 91-day repeat cycle

**Features to Build:**
- 🌊 Flood inundation modeling (elevation-based)
- 🏔️ Glacier mass balance
- 🌲 Forest biomass estimation
- 🏙️ 3D city terrain for flood routing

---

#### 15. **PO.DAAC** (Physical Oceanography DAAC)
- **URL**: https://podaac.jpl.nasa.gov/
- **Purpose**: Ocean data - SST, sea level, currents, salinity
- **Data**: Sea surface temperature, sea level anomaly, ocean currents
- **Satellites**: Jason-3, SWOT, Sentinel-6
- **Update Frequency**: Daily to weekly

**Features to Build:**
- 🌊 Sea level rise trends
- 🌀 Hurricane intensification (warm ocean)
- 🏖️ Coastal flood risk (storm surge + sea level)
- 🐟 Ocean temperature anomalies (El Niño/La Niña)

---

#### 16. **DONKI** (Space Weather Database Of Notifications)
- **URL**: https://api.nasa.gov/DONKI/
- **Purpose**: Space weather events affecting Earth
- **Data**: Solar flares, CMEs, geomagnetic storms, radiation events
- **Update Frequency**: Real-time
- **API Key**: Standard NASA API key

**Features to Build:**
- ☀️ Solar flare alerts
- 🌌 Geomagnetic storm warnings
- 📡 Satellite communication impact
- ⚡ Power grid vulnerability
- 🌈 Aurora forecast

---

#### 17. **Mars Weather** (InSight & Curiosity)
- **URL**: https://api.nasa.gov/insight_weather/
- **Purpose**: Mars atmospheric data (bonus feature!)
- **Data**: Temperature, pressure, wind speed on Mars
- **Update Frequency**: Daily (when available)
- **API Key**: Standard NASA API key

**Features to Build:**
- 🔴 Mars weather widget (fun comparison!)
- 🌡️ "Warmer than Mars?" alert
- 📊 Earth vs Mars climate chart

---

#### 18. **Earth Observatory Image of the Day**
- **URL**: https://earthobservatory.nasa.gov/feeds/image-of-the-day.rss
- **Purpose**: Educational satellite imagery with stories
- **Format**: RSS feed
- **Update Frequency**: Daily

**Features to Build:**
- 🖼️ Featured Earth image carousel
- 📰 Educational content integration
- 🌍 "Learn more" links for events

---

#### 19. **Earthdata Search**
- **URL**: https://search.earthdata.nasa.gov/
- **Purpose**: Unified search across ALL NASA Earth data
- **Data**: Access to 8,000+ datasets
- **API**: CMR (Common Metadata Repository)
- **Note**: Advanced users can download raw data

**Features to Build:**
- 🔍 Data discovery interface
- 📥 Dataset download links
- 📚 Data citation generator
- 🗓️ Temporal coverage explorer

---

## 🎨 **NEW PANEL IDEAS**

### Panel 1: 🔥 Wildfire Intelligence
**NASA Data:**
- FIRMS (active fires)
- MODIS (thermal anomalies, smoke)
- OMI (air quality impact)
- Wind data from POWER

**Features:**
- Real-time fire map
- Fire intensity & growth rate
- Smoke plume direction
- Evacuation zone recommendations
- Historical fire risk (seasonal)
- Air quality health warnings

---

### Panel 2: 🌧️ Precipitation & Flooding
**NASA Data:**
- GPM (real-time precipitation)
- GLDAS (soil moisture, runoff)
- SMAP (soil saturation)
- Grace-FO (groundwater levels)
- ICESat-2 (terrain elevation)

**Features:**
- Rainfall accumulation maps
- Flash flood risk scoring
- River stage predictions
- Groundwater depletion alerts
- Historical flood comparison

---

### Panel 3: 🛰️ Satellite Imagery Lab
**NASA Data:**
- GIBS (multi-layer imagery)
- MODIS (daily imagery)
- Landsat (high-res archive)

**Features:**
- Layer selector (true color, NDVI, thermal)
- Time-series slider (see changes over time)
- Before/after disaster comparison
- Download high-res images
- Share imagery permalinks

---

### Panel 4: 🌬️ Air Quality Monitor
**NASA Data:**
- OMI (NO2, SO2, ozone)
- TROPOMI (high-res NO2/CO)
- MERRA-2 (PM2.5, aerosols)
- MODIS AOD (aerosol optical depth)

**Features:**
- Multi-pollutant maps
- Health impact calculator
- Pollution source attribution
- Traffic-related emissions
- Industrial hotspots
- Historical trends

---

### Panel 5: 🌊 Ocean & Coastal
**NASA Data:**
- PO.DAAC (sea level, SST)
- MODIS (ocean color)
- Grace-FO (ocean mass)

**Features:**
- Sea level rise trends
- Storm surge risk
- Coastal erosion monitoring
- Hurricane heat potential
- Coral bleaching alerts
- El Niño/La Niña tracker

---

### Panel 6: 🌾 Agriculture & Vegetation
**NASA Data:**
- MODIS NDVI (vegetation health)
- Landsat (crop boundaries)
- SMAP (soil moisture)
- GLDAS (evapotranspiration)

**Features:**
- Crop health mapping
- Drought stress detection
- Irrigation recommendations
- Deforestation alerts
- Land use change timeline

---

### Panel 7: ☀️ Space Weather
**NASA Data:**
- DONKI (solar events)
- SDO (solar imagery)

**Features:**
- Solar flare alerts
- CME impact predictions
- Geomagnetic storm warnings
- Aurora oval forecast
- Satellite communication risk
- Power grid vulnerability

---

## 🏗️ **IMPLEMENTATION PRIORITY**

### Phase 1: Enhance Existing Panels (IMMEDIATE) ⚡
1. **Water/Flood Panel** → Add GPM precipitation, GLDAS runoff, SMAP soil moisture
2. **Climate Panel** → Expand POWER data (add wind, humidity, solar radiation)
3. **Events Panel** → Enhance with FIRMS fire data, disaster attribution

### Phase 2: New Critical Panels (HIGH PRIORITY) 🔥
4. **Wildfire Panel** → FIRMS + MODIS + air quality
5. **Air Quality Panel** → OMI + TROPOMI + MERRA-2
6. **Satellite Imagery Lab** → GIBS + MODIS + Landsat time-series

### Phase 3: Advanced Features (MEDIUM PRIORITY) 🌊
7. **Precipitation/Hydrology Panel** → GPM + GLDAS + ICESat-2 flood modeling
8. **Ocean/Coastal Panel** → PO.DAAC sea level + storm surge
9. **Agriculture Panel** → MODIS NDVI + SMAP soil moisture

### Phase 4: Specialized Panels (NICE TO HAVE) 🚀
10. **Space Weather Panel** → DONKI solar events
11. **Mars Weather Widget** → Fun comparison feature
12. **Earth Observatory Gallery** → Educational content

---

## 💻 **CODE STRUCTURE**

### Unified NASA API Client
```
src/lib/nasa/
├── eonet.js              ✅ Existing (natural events)
├── power.js              ✅ Existing (climate data)
├── hyfuse.js             ✅ Existing (water risk - external)
├── mobility.js           ✅ Existing (transportation - external)
├── firms.js              🆕 Wildfires
├── gpm.js                🆕 Precipitation
├── gldas.js              🆕 Hydrology
├── smap.js               🆕 Soil moisture
├── grace.js              🆕 Groundwater
├── modis.js              🆕 Satellite imagery
├── landsat.js            🆕 High-res imagery
├── omi.js                🆕 Air quality (NO2, SO2)
├── tropomi.js            🆕 High-res air quality
├── merra2.js             🆕 Aerosols
├── icesat2.js            🆕 Elevation data
├── podaac.js             🆕 Ocean data
├── donki.js              🆕 Space weather
└── earth-observatory.js  🆕 Image of the day
```

---

## 🎯 **NEXT STEPS**

**Tell me which panels you want me to build first!**

Options:
1. 🔥 **Wildfire Intelligence Panel** (FIRMS + MODIS + air quality)
2. 🌧️ **Enhanced Precipitation Panel** (GPM + GLDAS + flood modeling)
3. 🌬️ **Air Quality Monitor Panel** (OMI + TROPOMI + health impact)
4. 🛰️ **Satellite Imagery Lab** (Multi-layer viewer with time-series)
5. 🌾 **Agriculture & Vegetation Panel** (NDVI + crop health + drought)
6. ☀️ **Space Weather Panel** (Solar flares + geomagnetic storms)

Or I can:
- **Enhance existing panels** with more NASA data first
- **Build all API clients** at once, then panels later
- **Focus on one specific use case** you're most excited about

**What's your priority?** 🚀
