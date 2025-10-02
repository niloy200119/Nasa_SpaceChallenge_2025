/**
 * NASA Air Quality Data Integration
 * Combines data from multiple NASA satellites:
 * - OMI (Ozone Monitoring Instrument) - NO2, SO2, Ozone
 * - TROPOMI (Sentinel-5P) - High-res NO2, CO, CH4
 * - MERRA-2 - PM2.5, PM10, Aerosols
 * - MODIS - Aerosol Optical Depth (AOD)
 * 
 * APIs:
 * - NASA Earthdata GES DISC: https://disc.gsfc.nasa.gov/
 * - Sentinel-5P Hub: https://s5phub.copernicus.eu/
 * - Giovanni: https://giovanni.gsfc.nasa.gov/
 */

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'

/**
 * Fetch comprehensive air quality data for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date} date - Date to fetch (defaults to today)
 * @returns {Promise<Object>} Comprehensive air quality data
 */
export async function fetchAirQuality(lat, lon, date = new Date()) {
  console.warn('Using mock air quality data. Real implementation requires Earthdata authentication.')
  
  return generateMockAirQuality(lat, lon, date)
}

/**
 * Fetch NO2 (Nitrogen Dioxide) from OMI/TROPOMI
 * Primary indicator of traffic and industrial emissions
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {Date} date - Date to fetch
 * @returns {Promise<Object>} NO2 column density (molecules/cm²)
 */
export async function fetchNO2(bbox, date = new Date()) {
  console.warn('Using mock NO2 data')
  return generateMockNO2(bbox, date)
}

/**
 * Fetch SO2 (Sulfur Dioxide) from OMI
 * Indicator of volcanic activity and coal burning
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {Date} date - Date to fetch
 * @returns {Promise<Object>} SO2 column density
 */
export async function fetchSO2(bbox, date = new Date()) {
  console.warn('Using mock SO2 data')
  return generateMockSO2(bbox, date)
}

/**
 * Fetch CO (Carbon Monoxide) from TROPOMI
 * Indicator of incomplete combustion (vehicles, fires)
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {Date} date - Date to fetch
 * @returns {Promise<Object>} CO mixing ratio
 */
export async function fetchCO(bbox, date = new Date()) {
  console.warn('Using mock CO data')
  return generateMockCO(bbox, date)
}

/**
 * Fetch PM2.5 from MERRA-2 reanalysis
 * Fine particulate matter (< 2.5 microns)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} PM2.5 time series (µg/m³)
 */
export async function fetchPM25(lat, lon, startDate, endDate) {
  console.warn('Using mock PM2.5 data')
  return generateMockPM25(lat, lon, startDate, endDate)
}

/**
 * Fetch Aerosol Optical Depth (AOD) from MODIS
 * Measure of atmospheric aerosol loading
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {Date} date - Date to fetch
 * @returns {Promise<Object>} AOD values (unitless, 0-5)
 */
export async function fetchAOD(bbox, date = new Date()) {
  console.warn('Using mock AOD data')
  return generateMockAOD(bbox, date)
}

/**
 * Calculate Air Quality Index (AQI) from pollutant concentrations
 * Uses US EPA AQI standard
 * @param {Object} pollutants - {pm25, pm10, o3, no2, so2, co}
 * @returns {Object} AQI score and category
 */
export function calculateAQI(pollutants) {
  const aqiComponents = []

  // PM2.5 (µg/m³)
  if (pollutants.pm25 !== undefined) {
    aqiComponents.push({
      pollutant: 'PM2.5',
      concentration: pollutants.pm25,
      aqi: calculatePM25AQI(pollutants.pm25)
    })
  }

  // PM10 (µg/m³)
  if (pollutants.pm10 !== undefined) {
    aqiComponents.push({
      pollutant: 'PM10',
      concentration: pollutants.pm10,
      aqi: calculatePM10AQI(pollutants.pm10)
    })
  }

  // Ozone (ppb)
  if (pollutants.o3 !== undefined) {
    aqiComponents.push({
      pollutant: 'O3',
      concentration: pollutants.o3,
      aqi: calculateO3AQI(pollutants.o3)
    })
  }

  // NO2 (ppb)
  if (pollutants.no2 !== undefined) {
    aqiComponents.push({
      pollutant: 'NO2',
      concentration: pollutants.no2,
      aqi: calculateNO2AQI(pollutants.no2)
    })
  }

  // Overall AQI is the highest component AQI
  const maxAQI = Math.max(...aqiComponents.map(c => c.aqi))
  const category = getAQICategory(maxAQI)
  const dominantPollutant = aqiComponents.find(c => c.aqi === maxAQI)?.pollutant

  return {
    aqi: Math.round(maxAQI),
    category: category.name,
    color: category.color,
    level: category.level,
    dominant_pollutant: dominantPollutant,
    components: aqiComponents,
    health_implications: category.health_implications,
    recommendations: category.recommendations
  }
}

/**
 * Calculate pollution source attribution
 * @param {Object} pollutants - NO2, CO, PM2.5 levels
 * @returns {Object} Estimated pollution sources
 */
export function attributePollutionSources(pollutants) {
  const sources = []

  // High NO2 → Traffic/Industrial
  if (pollutants.no2 > 50) {
    const trafficContribution = Math.min(100, (pollutants.no2 / 100) * 100)
    sources.push({
      source: 'Traffic & Transportation',
      contribution: Math.round(trafficContribution),
      description: 'Vehicles, especially diesel engines',
      indicator: 'High NO2 levels'
    })
  }

  // High CO → Vehicle emissions, wildfires
  if (pollutants.co > 500) {
    const coContribution = Math.min(100, (pollutants.co / 2000) * 100)
    sources.push({
      source: 'Incomplete Combustion',
      contribution: Math.round(coContribution),
      description: 'Vehicles, wildfires, industrial processes',
      indicator: 'Elevated CO levels'
    })
  }

  // High PM2.5 → Multiple sources
  if (pollutants.pm25 > 35) {
    const pmContribution = Math.min(100, (pollutants.pm25 / 150) * 100)
    sources.push({
      source: 'Fine Particulates',
      contribution: Math.round(pmContribution),
      description: 'Combustion, dust, industrial emissions',
      indicator: 'High PM2.5'
    })
  }

  // High SO2 → Industrial/Coal/Volcanic
  if (pollutants.so2 > 20) {
    sources.push({
      source: 'Industrial Emissions',
      contribution: Math.round((pollutants.so2 / 100) * 100),
      description: 'Coal burning, oil refineries, metal smelting',
      indicator: 'Elevated SO2'
    })
  }

  return {
    sources,
    primary_source: sources[0]?.source || 'Unknown',
    is_traffic_related: pollutants.no2 > 50,
    is_industrial: pollutants.so2 > 20 || pollutants.pm25 > 50,
    is_fire_related: pollutants.co > 1000
  }
}

/**
 * Calculate health risk score
 */
export function calculateHealthRisk(aqi, sensitiveGroups = false) {
  let riskScore = 0
  let riskLevel = 'low'

  if (aqi <= 50) {
    riskScore = 10
    riskLevel = 'low'
  } else if (aqi <= 100) {
    riskScore = 25 + (aqi - 50) * 0.5
    riskLevel = 'moderate'
  } else if (aqi <= 150) {
    riskScore = 50 + (aqi - 100) * 0.6
    riskLevel = 'high'
  } else if (aqi <= 200) {
    riskScore = 80 + (aqi - 150) * 0.4
    riskLevel = 'very_high'
  } else {
    riskScore = 100
    riskLevel = 'extreme'
  }

  // Increase risk for sensitive groups
  if (sensitiveGroups) {
    riskScore = Math.min(100, riskScore * 1.3)
  }

  return {
    risk_score: Math.round(riskScore),
    risk_level: riskLevel,
    sensitive_groups_affected: sensitiveGroups || aqi > 100,
    affected_populations: getAffectedPopulations(aqi, sensitiveGroups)
  }
}

// Helper functions for AQI calculations (US EPA breakpoints)

function calculatePM25AQI(pm25) {
  const breakpoints = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500, 301, 500]
  ]
  return calculateAQIFromBreakpoints(pm25, breakpoints)
}

function calculatePM10AQI(pm10) {
  const breakpoints = [
    [0, 54, 0, 50],
    [55, 154, 51, 100],
    [155, 254, 101, 150],
    [255, 354, 151, 200],
    [355, 424, 201, 300],
    [425, 604, 301, 500]
  ]
  return calculateAQIFromBreakpoints(pm10, breakpoints)
}

function calculateO3AQI(o3ppb) {
  const breakpoints = [
    [0, 54, 0, 50],
    [55, 70, 51, 100],
    [71, 85, 101, 150],
    [86, 105, 151, 200],
    [106, 200, 201, 300]
  ]
  return calculateAQIFromBreakpoints(o3ppb, breakpoints)
}

function calculateNO2AQI(no2ppb) {
  const breakpoints = [
    [0, 53, 0, 50],
    [54, 100, 51, 100],
    [101, 360, 101, 150],
    [361, 649, 151, 200],
    [650, 1249, 201, 300]
  ]
  return calculateAQIFromBreakpoints(no2ppb, breakpoints)
}

function calculateAQIFromBreakpoints(concentration, breakpoints) {
  for (const [cLow, cHigh, aqiLow, aqiHigh] of breakpoints) {
    if (concentration >= cLow && concentration <= cHigh) {
      return ((aqiHigh - aqiLow) / (cHigh - cLow)) * (concentration - cLow) + aqiLow
    }
  }
  return 500 // Maximum AQI
}

function getAQICategory(aqi) {
  if (aqi <= 50) {
    return {
      name: 'Good',
      level: 1,
      color: '#00E400',
      health_implications: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      recommendations: ['Enjoy outdoor activities', 'No restrictions needed']
    }
  } else if (aqi <= 100) {
    return {
      name: 'Moderate',
      level: 2,
      color: '#FFFF00',
      health_implications: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
      recommendations: ['Unusually sensitive people should consider reducing prolonged outdoor exertion', 'General population can enjoy normal activities']
    }
  } else if (aqi <= 150) {
    return {
      name: 'Unhealthy for Sensitive Groups',
      level: 3,
      color: '#FF7E00',
      health_implications: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
      recommendations: ['Children, elderly, and people with respiratory conditions should reduce outdoor exertion', 'General population should limit prolonged outdoor exertion']
    }
  } else if (aqi <= 200) {
    return {
      name: 'Unhealthy',
      level: 4,
      color: '#FF0000',
      health_implications: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
      recommendations: ['Everyone should reduce prolonged outdoor exertion', 'Sensitive groups should avoid outdoor exertion', 'Consider wearing N95 mask outdoors']
    }
  } else if (aqi <= 300) {
    return {
      name: 'Very Unhealthy',
      level: 5,
      color: '#8F3F97',
      health_implications: 'Health alert: The risk of health effects is increased for everyone.',
      recommendations: ['Everyone should avoid prolonged outdoor exertion', 'Sensitive groups should stay indoors', 'Close windows and use air purifiers', 'Wear N95 masks if going outside']
    }
  } else {
    return {
      name: 'Hazardous',
      level: 6,
      color: '#7E0023',
      health_implications: 'Health warning of emergency conditions: everyone is more likely to be affected.',
      recommendations: ['⚠️ Everyone should STAY INDOORS', 'Close all windows and doors', 'Use air purifiers', 'Evacuate if conditions worsen', 'Seek medical attention if experiencing symptoms']
    }
  }
}

function getAffectedPopulations(aqi, sensitiveGroups) {
  const populations = []
  
  if (aqi > 50 || sensitiveGroups) {
    populations.push('Children', 'Elderly (65+)', 'People with asthma', 'People with heart disease')
  }
  
  if (aqi > 100) {
    populations.push('Outdoor workers', 'Athletes', 'Pregnant women')
  }
  
  if (aqi > 150) {
    populations.push('General population')
  }
  
  return populations
}

// Mock data generators

function generateMockAirQuality(lat, lon, date) {
  // Urban areas have worse air quality
  const isUrban = Math.random() > 0.6
  const baseAQI = isUrban ? 60 + Math.random() * 60 : 30 + Math.random() * 40

  const pm25 = isUrban ? 15 + Math.random() * 40 : 5 + Math.random() * 20
  const pm10 = pm25 * 1.5 + Math.random() * 20
  const no2 = isUrban ? 30 + Math.random() * 60 : 10 + Math.random() * 20
  const so2 = isUrban ? 10 + Math.random() * 30 : 2 + Math.random() * 8
  const co = isUrban ? 300 + Math.random() * 700 : 100 + Math.random() * 300
  const o3 = 30 + Math.random() * 50

  const pollutants = {
    pm25: Math.round(pm25 * 10) / 10,
    pm10: Math.round(pm10 * 10) / 10,
    no2: Math.round(no2),
    so2: Math.round(so2),
    co: Math.round(co),
    o3: Math.round(o3)
  }

  const aqi = calculateAQI(pollutants)
  const sources = attributePollutionSources(pollutants)
  const health = calculateHealthRisk(aqi.aqi, false)

  return {
    latitude: lat,
    longitude: lon,
    date: date.toISOString().split('T')[0],
    ...aqi,
    pollutants,
    sources,
    health_risk: health,
    data_source: 'NASA OMI/TROPOMI/MERRA-2 (Mock)'
  }
}

function generateMockNO2(bbox, date) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const grid = []
  const resolution = 0.1 // ~10km

  for (let lat = minLat; lat <= maxLat; lat += resolution) {
    for (let lon = minLon; lon <= maxLon; lon += resolution) {
      // Higher NO2 near cities (simplified)
      const isUrban = Math.random() > 0.7
      const no2 = isUrban ? 5e15 + Math.random() * 1e16 : 1e15 + Math.random() * 5e15

      grid.push({
        lat: Math.round(lat * 100) / 100,
        lon: Math.round(lon * 100) / 100,
        no2_column: no2, // molecules/cm²
        quality: Math.random() > 0.2 ? 'good' : 'cloudy'
      })
    }
  }

  return {
    date: date.toISOString().split('T')[0],
    satellite: 'TROPOMI',
    parameter: 'NO2 Tropospheric Column',
    units: 'molecules/cm²',
    grid
  }
}

function generateMockSO2(bbox, date) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const grid = []
  const resolution = 0.1

  for (let lat = minLat; lat <= maxLat; lat += resolution) {
    for (let lon = minLon; lon <= maxLon; lon += resolution) {
      // Low background SO2, occasional industrial hotspot
      const isIndustrial = Math.random() > 0.95
      const so2 = isIndustrial ? 1e16 + Math.random() * 5e16 : 1e15 + Math.random() * 5e15

      grid.push({
        lat: Math.round(lat * 100) / 100,
        lon: Math.round(lon * 100) / 100,
        so2_column: so2, // molecules/cm²
        quality: 'good'
      })
    }
  }

  return {
    date: date.toISOString().split('T')[0],
    satellite: 'OMI',
    parameter: 'SO2 Column',
    units: 'molecules/cm²',
    grid
  }
}

function generateMockCO(bbox, date) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const avgCO = 100 + Math.random() * 100 // ppb

  return {
    date: date.toISOString().split('T')[0],
    satellite: 'TROPOMI',
    parameter: 'CO Mixing Ratio',
    units: 'ppb',
    average_value: Math.round(avgCO),
    bbox
  }
}

function generateMockPM25(lat, lon, startDate, endDate) {
  const dataPoints = []
  const daysRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))

  for (let i = 0; i <= daysRange; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    const pm25 = 10 + Math.random() * 40 + Math.sin(i / 7) * 10 // Weekly variation

    dataPoints.push({
      date: date.toISOString().split('T')[0],
      pm25: Math.round(pm25 * 10) / 10
    })
  }

  return {
    latitude: lat,
    longitude: lon,
    parameter: 'PM2.5',
    units: 'µg/m³',
    source: 'MERRA-2',
    data: dataPoints
  }
}

function generateMockAOD(bbox, date) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const avgAOD = 0.1 + Math.random() * 0.4

  return {
    date: date.toISOString().split('T')[0],
    satellite: 'MODIS Terra',
    parameter: 'Aerosol Optical Depth 550nm',
    units: 'unitless',
    average_aod: Math.round(avgAOD * 1000) / 1000,
    bbox
  }
}

export default {
  fetchAirQuality,
  fetchNO2,
  fetchSO2,
  fetchCO,
  fetchPM25,
  fetchAOD,
  calculateAQI,
  attributePollutionSources,
  calculateHealthRisk
}
