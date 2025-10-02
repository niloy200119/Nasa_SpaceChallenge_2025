/**
 * NASA FIRMS (Fire Information for Resource Management System)
 * Real-time active fire detection from MODIS and VIIRS satellites
 * 
 * API Documentation: https://firms.modaps.eosdis.nasa.gov/api/
 * 
 * Register for FREE API key: https://firms.modaps.eosdis.nasa.gov/api/
 * NOTE: FIRMS uses a different API key than the standard NASA API key
 */

const FIRMS_API_KEY = import.meta.env.VITE_FIRMS_API_KEY || 'DEMO_KEY'
const FIRMS_BASE_URL = 'https://firms.modaps.eosdis.nasa.gov/api'

/**
 * Fetch active fires within a bounding box
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {string} source - 'VIIRS_SNPP' | 'VIIRS_NOAA20' | 'MODIS_SP' | 'MODIS_NRT'
 * @param {number} dayRange - Number of days back (1-10)
 * @returns {Promise<Array>} Array of fire detections
 */
export async function fetchActiveFires(bbox, source = 'VIIRS_SNPP', dayRange = 1) {
  if (FIRMS_API_KEY === 'DEMO_KEY') {
    console.warn('Using FIRMS mock data. Get API key: https://firms.modaps.eosdis.nasa.gov/api/')
    return generateMockFires(bbox, 50)
  }

  try {
    const [minLon, minLat, maxLon, maxLat] = bbox
    const url = `${FIRMS_BASE_URL}/area/csv/${FIRMS_API_KEY}/${source}/${minLon},${minLat},${maxLon},${maxLat}/${dayRange}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`FIRMS API error: ${response.status}`)
    
    const csvText = await response.text()
    return parseFiresCSV(csvText)
  } catch (error) {
    console.error('FIRMS API error:', error)
    return generateMockFires(bbox, 50)
  }
}

/**
 * Fetch fires near a specific location (radius in km)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Radius in kilometers (max 1000)
 * @param {string} source - Fire detection source
 * @param {number} dayRange - Days back (1-10)
 * @returns {Promise<Array>} Array of fire detections
 */
export async function fetchFiresNearLocation(lat, lon, radius = 100, source = 'VIIRS_SNPP', dayRange = 1) {
  if (FIRMS_API_KEY === 'DEMO_KEY') {
    const bbox = [lon - 1, lat - 1, lon + 1, lat + 1]
    return generateMockFires(bbox, 30)
  }

  try {
    const url = `${FIRMS_BASE_URL}/area/csv/${FIRMS_API_KEY}/${source}/${lat},${lon}/${radius}/${dayRange}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`FIRMS API error: ${response.status}`)
    
    const csvText = await response.text()
    return parseFiresCSV(csvText)
  } catch (error) {
    console.error('FIRMS API error:', error)
    const bbox = [lon - 1, lat - 1, lon + 1, lat + 1]
    return generateMockFires(bbox, 30)
  }
}

/**
 * Get fire statistics for a region
 * @param {Array} fires - Array of fire detections
 * @returns {Object} Fire statistics
 */
export function calculateFireStats(fires) {
  if (!fires || fires.length === 0) {
    return {
      total_fires: 0,
      high_confidence: 0,
      avg_brightness: 0,
      avg_frp: 0,
      max_frp: 0,
      total_frp: 0,
      area_affected_km2: 0
    }
  }

  const highConfidence = fires.filter(f => f.confidence >= 80).length
  const avgBrightness = fires.reduce((sum, f) => sum + f.bright_ti4, 0) / fires.length
  const avgFRP = fires.reduce((sum, f) => sum + f.frp, 0) / fires.length
  const maxFRP = Math.max(...fires.map(f => f.frp))
  const totalFRP = fires.reduce((sum, f) => sum + f.frp, 0)

  // Estimate affected area (rough approximation: 1 fire pixel ≈ 0.375 km² for VIIRS)
  const areaAffected = fires.length * 0.375

  return {
    total_fires: fires.length,
    high_confidence: highConfidence,
    avg_brightness: Math.round(avgBrightness * 10) / 10,
    avg_frp: Math.round(avgFRP * 10) / 10,
    max_frp: Math.round(maxFRP * 10) / 10,
    total_frp: Math.round(totalFRP),
    area_affected_km2: Math.round(areaAffected * 10) / 10
  }
}

/**
 * Categorize fire intensity based on FRP
 * @param {number} frp - Fire Radiative Power (MW)
 * @returns {Object} Intensity level and description
 */
export function categorizeFireIntensity(frp) {
  if (frp < 10) {
    return { level: 'low', color: '#FFD700', description: 'Small fire or hot spot' }
  } else if (frp < 50) {
    return { level: 'moderate', color: '#FF8C00', description: 'Active fire' }
  } else if (frp < 200) {
    return { level: 'high', color: '#FF4500', description: 'Large active fire' }
  } else {
    return { level: 'extreme', color: '#DC143C', description: 'Major wildfire event' }
  }
}

/**
 * Calculate fire risk score based on multiple factors
 * @param {Object} location - {lat, lon}
 * @param {Array} recentFires - Recent fire detections
 * @param {Object} weatherData - Temperature, wind speed, humidity from POWER API
 * @returns {Object} Fire risk assessment
 */
export function calculateFireRisk(location, recentFires, weatherData) {
  let riskScore = 0
  const factors = []

  // Factor 1: Nearby active fires (0-40 points)
  const nearbyFires = recentFires.filter(f => {
    const distance = calculateDistance(location.lat, location.lon, f.latitude, f.longitude)
    return distance < 50 // Within 50km
  })
  
  const fireProximityScore = Math.min(40, nearbyFires.length * 5)
  riskScore += fireProximityScore
  if (fireProximityScore > 0) {
    factors.push(`${nearbyFires.length} active fires within 50km`)
  }

  // Factor 2: Weather conditions (0-30 points)
  if (weatherData) {
    const { temperature, wind_speed, humidity } = weatherData
    
    // High temperature increases risk
    if (temperature > 35) {
      const tempScore = Math.min(15, (temperature - 35) * 2)
      riskScore += tempScore
      factors.push(`High temperature: ${temperature}°C`)
    }
    
    // High wind spreads fires
    if (wind_speed > 20) {
      const windScore = Math.min(10, (wind_speed - 20) * 2)
      riskScore += windScore
      factors.push(`High wind speed: ${wind_speed} km/h`)
    }
    
    // Low humidity increases risk
    if (humidity < 30) {
      const humidityScore = Math.min(5, (30 - humidity) / 2)
      riskScore += humidityScore
      factors.push(`Low humidity: ${humidity}%`)
    }
  }

  // Factor 3: Historical fire activity (0-20 points)
  const historicalScore = Math.min(20, recentFires.length * 0.5)
  riskScore += historicalScore
  if (historicalScore > 0) {
    factors.push(`${recentFires.length} fires detected in region (past 7 days)`)
  }

  // Factor 4: Fire intensity (0-10 points)
  if (nearbyFires.length > 0) {
    const avgFRP = nearbyFires.reduce((sum, f) => sum + f.frp, 0) / nearbyFires.length
    const intensityScore = Math.min(10, avgFRP / 20)
    riskScore += intensityScore
    factors.push(`Average fire intensity: ${Math.round(avgFRP)} MW`)
  }

  // Normalize to 0-100
  riskScore = Math.min(100, riskScore)

  let riskLevel = 'low'
  if (riskScore > 70) riskLevel = 'extreme'
  else if (riskScore > 50) riskLevel = 'high'
  else if (riskScore > 30) riskLevel = 'moderate'

  return {
    score: Math.round(riskScore),
    level: riskLevel,
    factors,
    nearby_fires: nearbyFires.length,
    recommendations: getFireRiskRecommendations(riskLevel)
  }
}

/**
 * Get recommendations based on fire risk level
 */
function getFireRiskRecommendations(riskLevel) {
  const recommendations = {
    low: [
      'Stay informed about local fire conditions',
      'Maintain defensible space around property',
      'Keep emergency supplies ready'
    ],
    moderate: [
      'Monitor local fire alerts closely',
      'Avoid outdoor burning',
      'Prepare evacuation plan',
      'Have emergency supplies packed'
    ],
    high: [
      'Be ready to evacuate at short notice',
      'Close all windows and doors',
      'Turn on sprinklers if available',
      'Move flammable items away from house',
      'Keep car fueled and facing exit direction'
    ],
    extreme: [
      '⚠️ EVACUATE IMMEDIATELY if ordered',
      'Follow designated evacuation routes',
      'Do not return until authorities declare safe',
      'Breathe through wet cloth to filter smoke',
      'Call 911 if trapped'
    ]
  }

  return recommendations[riskLevel] || recommendations.low
}

/**
 * Parse FIRMS CSV response
 */
function parseFiresCSV(csvText) {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',')
  const fires = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    const fire = {}

    headers.forEach((header, index) => {
      const key = header.trim()
      let value = values[index]?.trim()

      // Parse numeric values
      if (['latitude', 'longitude', 'bright_ti4', 'bright_ti5', 'frp', 'confidence'].includes(key)) {
        value = parseFloat(value)
      }

      fire[key] = value
    })

    fires.push(fire)
  }

  return fires
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Generate mock fire data for development
 */
function generateMockFires(bbox, count = 50) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const fires = []

  for (let i = 0; i < count; i++) {
    const latitude = minLat + Math.random() * (maxLat - minLat)
    const longitude = minLon + Math.random() * (maxLon - minLon)
    
    // Generate realistic fire data
    const confidence = Math.random() > 0.3 ? Math.floor(Math.random() * 30 + 70) : Math.floor(Math.random() * 40 + 30)
    const frp = Math.random() * 300 + 5 // 5-305 MW
    const bright_ti4 = Math.random() * 100 + 300 // 300-400 K
    const bright_ti5 = bright_ti4 - Math.random() * 50 // Slightly cooler

    fires.push({
      latitude: Math.round(latitude * 10000) / 10000,
      longitude: Math.round(longitude * 10000) / 10000,
      bright_ti4: Math.round(bright_ti4 * 10) / 10,
      bright_ti5: Math.round(bright_ti5 * 10) / 10,
      frp: Math.round(frp * 10) / 10,
      confidence,
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: Math.floor(Math.random() * 2400).toString().padStart(4, '0'),
      satellite: Math.random() > 0.5 ? 'N' : 'S', // NOAA-20 or Suomi-NPP
      instrument: 'VIIRS',
      version: '2.0NRT',
      daynight: Math.random() > 0.3 ? 'D' : 'N'
    })
  }

  return fires
}

export default {
  fetchActiveFires,
  fetchFiresNearLocation,
  calculateFireStats,
  categorizeFireIntensity,
  calculateFireRisk
}
