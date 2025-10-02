/**
 * NASA MODIS (Moderate Resolution Imaging Spectroradiometer)
 * Vegetation health, land surface temperature, and environmental monitoring
 * 
 * Data Access: https://modis.gsfc.nasa.gov/data/
 * LAADS DAAC: https://ladsweb.modaps.eosdis.nasa.gov/
 */

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const MODIS_BASE_URL = 'https://modis.ornl.gov/rst/api/v1'

/**
 * Fetch NDVI (Normalized Difference Vegetation Index) for a location
 * NDVI ranges from -1 to 1, where:
 * - 0.6-1.0: Dense vegetation (forests, croplands)
 * - 0.2-0.6: Sparse vegetation (shrublands, grasslands)
 * - -0.1-0.2: Bare soil, urban areas
 * - < -0.1: Water, snow, ice
 * 
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {string} product - 'MOD13Q1' (250m, 16-day) or 'MOD13A2' (1km, 16-day)
 * @param {string} band - 'NDVI' or 'EVI' (Enhanced Vegetation Index)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} NDVI time series data
 */
export async function fetchNDVI(lat, lon, product = 'MOD13Q1', band = 'NDVI', startDate, endDate) {
  // For now, return mock data until we set up proper MODIS API access
  console.warn('Using MODIS mock data. Real implementation requires LAADS DAAC authentication.')
  return generateMockNDVI(lat, lon, startDate, endDate)
}

/**
 * Fetch Land Surface Temperature (LST) data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Date} date - Date to fetch
 * @returns {Promise<Object>} LST data in Kelvin and Celsius
 */
export async function fetchLST(lat, lon, date) {
  console.warn('Using mock LST data')
  return generateMockLST(lat, lon, date)
}

/**
 * Calculate vegetation health score
 * @param {Array} ndviTimeSeries - Array of NDVI values over time
 * @param {Array} historicalBaseline - Historical average NDVI for comparison
 * @returns {Object} Vegetation health assessment
 */
export function calculateVegetationHealth(ndviTimeSeries, historicalBaseline = null) {
  if (!ndviTimeSeries || ndviTimeSeries.length === 0) {
    return {
      health_score: 0,
      status: 'unknown',
      trend: 'unknown',
      anomaly: 0
    }
  }

  // Calculate current average NDVI
  const currentNDVI = ndviTimeSeries[ndviTimeSeries.length - 1].value
  const avgNDVI = ndviTimeSeries.reduce((sum, d) => sum + d.value, 0) / ndviTimeSeries.length

  // Determine health status based on NDVI value
  let status = 'unknown'
  let healthScore = 0

  if (currentNDVI > 0.6) {
    status = 'healthy'
    healthScore = 85 + (currentNDVI - 0.6) * 37.5 // 85-100
  } else if (currentNDVI > 0.4) {
    status = 'moderate'
    healthScore = 60 + (currentNDVI - 0.4) * 125 // 60-85
  } else if (currentNDVI > 0.2) {
    status = 'stressed'
    healthScore = 35 + (currentNDVI - 0.2) * 125 // 35-60
  } else if (currentNDVI > 0) {
    status = 'poor'
    healthScore = 15 + currentNDVI * 100 // 15-35
  } else {
    status = 'bare_soil_or_water'
    healthScore = 0
  }

  // Calculate trend (comparing first half to second half)
  const midpoint = Math.floor(ndviTimeSeries.length / 2)
  const firstHalf = ndviTimeSeries.slice(0, midpoint).reduce((sum, d) => sum + d.value, 0) / midpoint
  const secondHalf = ndviTimeSeries.slice(midpoint).reduce((sum, d) => sum + d.value, 0) / (ndviTimeSeries.length - midpoint)
  
  const trendValue = ((secondHalf - firstHalf) / firstHalf) * 100
  let trend = 'stable'
  if (trendValue > 5) trend = 'improving'
  else if (trendValue < -5) trend = 'declining'

  // Calculate anomaly if baseline provided
  let anomaly = 0
  if (historicalBaseline) {
    const baselineAvg = historicalBaseline.reduce((sum, v) => sum + v, 0) / historicalBaseline.length
    anomaly = ((currentNDVI - baselineAvg) / baselineAvg) * 100
  }

  return {
    health_score: Math.round(healthScore),
    status,
    trend,
    trend_percentage: Math.round(trendValue * 10) / 10,
    anomaly: Math.round(anomaly),
    current_ndvi: Math.round(currentNDVI * 1000) / 1000,
    average_ndvi: Math.round(avgNDVI * 1000) / 1000,
    interpretation: getVegetationInterpretation(status, trend)
  }
}

/**
 * Detect drought stress using NDVI and LST
 * @param {Object} ndviData - Current NDVI data
 * @param {Object} lstData - Land Surface Temperature data
 * @param {Object} precipData - Precipitation data (optional)
 * @returns {Object} Drought stress assessment
 */
export function detectDroughtStress(ndviData, lstData, precipData = null) {
  let stressScore = 0
  const indicators = []

  // Indicator 1: Low NDVI (0-40 points)
  if (ndviData.current_ndvi < 0.3) {
    const ndviStress = (0.3 - ndviData.current_ndvi) * 100
    stressScore += Math.min(40, ndviStress)
    indicators.push(`Low vegetation index (NDVI: ${ndviData.current_ndvi})`)
  }

  // Indicator 2: Declining NDVI trend (0-20 points)
  if (ndviData.trend === 'declining') {
    stressScore += Math.min(20, Math.abs(ndviData.trend_percentage) * 2)
    indicators.push(`Vegetation declining (${ndviData.trend_percentage}%)`)
  }

  // Indicator 3: High land surface temperature (0-25 points)
  if (lstData && lstData.temperature_celsius > 35) {
    const tempStress = (lstData.temperature_celsius - 35) * 2
    stressScore += Math.min(25, tempStress)
    indicators.push(`High land surface temperature (${lstData.temperature_celsius}°C)`)
  }

  // Indicator 4: Low precipitation (0-15 points)
  if (precipData && precipData.monthly_total < 50) {
    const precipStress = (50 - precipData.monthly_total) / 3
    stressScore += Math.min(15, precipStress)
    indicators.push(`Low rainfall (${precipData.monthly_total}mm/month)`)
  }

  stressScore = Math.min(100, stressScore)

  let stressLevel = 'none'
  if (stressScore > 70) stressLevel = 'severe'
  else if (stressScore > 50) stressLevel = 'high'
  else if (stressScore > 30) stressLevel = 'moderate'
  else if (stressScore > 10) stressLevel = 'mild'

  return {
    stress_score: Math.round(stressScore),
    stress_level: stressLevel,
    indicators,
    recommendations: getDroughtRecommendations(stressLevel)
  }
}

/**
 * Detect urban heat islands using LST
 * @param {Array} lstGrid - Grid of LST measurements
 * @returns {Object} Urban heat island analysis
 */
export function detectUrbanHeatIsland(lstGrid) {
  if (!lstGrid || lstGrid.length === 0) return null

  const temperatures = lstGrid.map(cell => cell.temperature_celsius)
  const avgTemp = temperatures.reduce((sum, t) => sum + t, 0) / temperatures.length
  const maxTemp = Math.max(...temperatures)
  const minTemp = Math.min(...temperatures)

  const intensity = maxTemp - minTemp
  let uhiLevel = 'weak'
  if (intensity > 10) uhiLevel = 'strong'
  else if (intensity > 5) uhiLevel = 'moderate'

  // Find hotspots (temperature > avg + 2°C)
  const hotspots = lstGrid.filter(cell => cell.temperature_celsius > avgTemp + 2)

  return {
    average_temperature: Math.round(avgTemp * 10) / 10,
    max_temperature: Math.round(maxTemp * 10) / 10,
    min_temperature: Math.round(minTemp * 10) / 10,
    temperature_range: Math.round(intensity * 10) / 10,
    uhi_intensity: uhiLevel,
    hotspot_count: hotspots.length,
    hotspot_locations: hotspots.map(h => ({ lat: h.lat, lon: h.lon, temp: h.temperature_celsius }))
  }
}

/**
 * Get vegetation health interpretation
 */
function getVegetationInterpretation(status, trend) {
  const interpretations = {
    healthy: {
      improving: 'Dense, healthy vegetation with positive growth',
      stable: 'Dense, healthy vegetation maintained',
      declining: 'Healthy vegetation showing early signs of stress'
    },
    moderate: {
      improving: 'Vegetation recovering and growing',
      stable: 'Moderate vegetation cover, stable conditions',
      declining: 'Vegetation under stress, declining health'
    },
    stressed: {
      improving: 'Stressed vegetation showing signs of recovery',
      stable: 'Persistently stressed vegetation',
      declining: 'Vegetation degrading, drought or disease likely'
    },
    poor: {
      improving: 'Severe vegetation loss beginning to recover',
      stable: 'Minimal vegetation cover, poor conditions',
      declining: 'Critical vegetation loss, severe environmental stress'
    }
  }

  return interpretations[status]?.[trend] || 'Vegetation status uncertain'
}

/**
 * Get drought management recommendations
 */
function getDroughtRecommendations(stressLevel) {
  const recommendations = {
    none: [
      'Monitor vegetation regularly',
      'Maintain normal irrigation schedules',
      'Check weather forecasts'
    ],
    mild: [
      'Increase irrigation monitoring',
      'Check soil moisture levels',
      'Prepare for potential water restrictions',
      'Reduce non-essential water use'
    ],
    moderate: [
      'Implement water conservation measures',
      'Prioritize essential crops/vegetation',
      'Use drip irrigation where possible',
      'Mulch to retain soil moisture',
      'Monitor weather patterns closely'
    ],
    high: [
      'Severe water conservation required',
      'Reduce irrigated area if possible',
      'Consider drought-resistant crops',
      'Implement deficit irrigation strategies',
      'Prepare for potential crop loss'
    ],
    severe: [
      '⚠️ Critical drought conditions',
      'Emergency water rationing',
      'Focus on survival of perennial crops',
      'Consider early harvest',
      'Seek government drought assistance',
      'Plan for next season recovery'
    ]
  }

  return recommendations[stressLevel] || recommendations.none
}

/**
 * Generate mock NDVI data
 */
function generateMockNDVI(lat, lon, startDate, endDate) {
  const dataPoints = []
  const daysRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  const numPoints = Math.floor(daysRange / 16) // 16-day intervals

  // Base NDVI varies by latitude (higher near equator for tropical vegetation)
  const baseNDVI = 0.4 + (Math.abs(lat) < 30 ? 0.3 : 0.1)

  for (let i = 0; i < numPoints; i++) {
    const date = new Date(startDate.getTime() + i * 16 * 24 * 60 * 60 * 1000)
    
    // Add seasonal variation (Northern hemisphere)
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    const seasonalEffect = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.15
    
    // Add some random variation
    const noise = (Math.random() - 0.5) * 0.1
    
    const ndvi = Math.max(-0.1, Math.min(1, baseNDVI + seasonalEffect + noise))

    dataPoints.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(ndvi * 1000) / 1000,
      quality: Math.random() > 0.1 ? 'good' : 'cloudy'
    })
  }

  return {
    latitude: lat,
    longitude: lon,
    product: 'MOD13Q1',
    band: 'NDVI',
    data: dataPoints
  }
}

/**
 * Generate mock LST data
 */
function generateMockLST(lat, lon, date) {
  // Base temperature varies by latitude and season
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  const seasonalEffect = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 15
  
  // Latitude effect (hotter near equator)
  const latEffect = 30 - Math.abs(lat) * 0.5
  
  const baseTempC = 25 + latEffect + seasonalEffect + (Math.random() - 0.5) * 10
  const baseTempK = baseTempC + 273.15

  return {
    latitude: lat,
    longitude: lon,
    date: date.toISOString().split('T')[0],
    temperature_kelvin: Math.round(baseTempK * 10) / 10,
    temperature_celsius: Math.round(baseTempC * 10) / 10,
    product: 'MOD11A1',
    time: 'day'
  }
}

export default {
  fetchNDVI,
  fetchLST,
  calculateVegetationHealth,
  detectDroughtStress,
  detectUrbanHeatIsland
}
