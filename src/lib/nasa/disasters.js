/**
 * Unified Disaster Management System
 * Integrates 10 disaster types with NASA Earth observation data
 * 
 * Disasters: Flood, Wildfire, Earthquake, Drought, Landslide, 
 *            Extreme Heat, Volcano, Tsunami, Thunderstorm, Rainblast
 */

import { fetchEONETEvents } from './eonet'
import { fetchActiveFires, calculateFireStats, calculateFireRisk } from './firms'
import { fetchNDVI, calculateVegetationHealth, detectDroughtStress, fetchLST } from './modis'
import { fetchComprehensiveClimate, calculateExtremeWeatherRisk } from './power'
import { fetchAirQuality } from './air-quality'

/**
 * Disaster type definitions
 */
export const DISASTER_TYPES = {
  FLOOD: 'flood',
  WILDFIRE: 'wildfire',
  EARTHQUAKE: 'earthquake',
  DROUGHT: 'drought',
  LANDSLIDE: 'landslide',
  EXTREME_HEAT: 'extreme_heat',
  VOLCANO: 'volcano',
  TSUNAMI: 'tsunami',
  THUNDERSTORM: 'thunderstorm',
  RAINBLAST: 'rainblast'
}

/**
 * Disaster severity levels
 */
export const SEVERITY_LEVELS = {
  LOW: { level: 'low', score: 0, color: '#00FF00', label: 'Low Risk' },
  MODERATE: { level: 'moderate', score: 30, color: '#FFFF00', label: 'Moderate Risk' },
  HIGH: { level: 'high', score: 60, color: '#FF8C00', label: 'High Risk' },
  EXTREME: { level: 'extreme', score: 80, color: '#FF0000', label: 'Extreme Risk' }
}

/**
 * Get all active disasters for a location
 * @param {Object} location - {lat, lon, bbox}
 * @returns {Promise<Object>} All disaster risks
 */
export async function getAllDisasterRisks(location) {
  const { lat, lon, bbox } = location

  const risks = await Promise.all([
    assessFloodRisk(location),
    assessWildfireRisk(location),
    assessEarthquakeRisk(location),
    assessDroughtRisk(location),
    assessLandslideRisk(location),
    assessExtremeHeatRisk(location),
    assessVolcanoRisk(location),
    assessTsunamiRisk(location),
    assessThunderstormRisk(location),
    assessRainblastRisk(location)
  ])

  return {
    location: { lat, lon },
    timestamp: new Date().toISOString(),
    disasters: {
      flood: risks[0],
      wildfire: risks[1],
      earthquake: risks[2],
      drought: risks[3],
      landslide: risks[4],
      extreme_heat: risks[5],
      volcano: risks[6],
      tsunami: risks[7],
      thunderstorm: risks[8],
      rainblast: risks[9]
    },
    overall_risk: calculateOverallRisk(risks),
    highest_risk: getHighestRisk(risks),
    active_alerts: risks.filter(r => r.risk_score > 60).length
  }
}

/**
 * Assess flood risk
 */
export async function assessFloodRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with GPM, GLDAS, HyFuse
  const precipitationRate = 20 + Math.random() * 80 // mm/day
  const soilMoisture = 0.2 + Math.random() * 0.5 // 0-1
  const elevation = Math.random() * 100 // meters
  
  let riskScore = 0
  const factors = []

  // Heavy precipitation
  if (precipitationRate > 50) {
    riskScore += (precipitationRate - 50) * 0.8
    factors.push(`Heavy rainfall: ${Math.round(precipitationRate)}mm/day`)
  }

  // Saturated soil
  if (soilMoisture > 0.6) {
    riskScore += (soilMoisture - 0.6) * 100
    factors.push(`Saturated soil: ${Math.round(soilMoisture * 100)}%`)
  }

  // Low elevation
  if (elevation < 10) {
    riskScore += (10 - elevation) * 3
    factors.push(`Low elevation: ${Math.round(elevation)}m`)
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.FLOOD,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getFloodRecommendations(riskScore),
    data_sources: ['GPM (Precipitation)', 'GLDAS (Soil Moisture)', 'SRTM (Elevation)']
  }
}

/**
 * Assess wildfire risk
 */
export async function assessWildfireRisk(location) {
  const { lat, lon, bbox } = location
  
  try {
    // Get active fires
    const fires = await fetchActiveFires(bbox || [lon - 0.5, lat - 0.5, lon + 0.5, lat + 0.5], 'VIIRS_SNPP', 7)
    const stats = calculateFireStats(fires)
    
    // Get weather data
    const climate = await fetchComprehensiveClimate(lat, lon)
    const currentMonth = new Date().getMonth()
    
    const risk = calculateFireRisk(
      { lat, lon },
      fires,
      {
        temperature: climate.T2M?.[currentMonth] || 25,
        wind_speed: (climate.WS10M?.[currentMonth] || 5) * 3.6,
        humidity: climate.RH2M?.[currentMonth] || 50
      }
    )

    return {
      disaster_type: DISASTER_TYPES.WILDFIRE,
      risk_score: risk.score,
      severity: getSeverityLevel(risk.score),
      factors: risk.factors,
      active_fires: stats.total_fires,
      population_at_risk: estimatePopulationAtRisk(lat, lon, risk.score),
      recommendations: risk.recommendations,
      data_sources: ['FIRMS (Active Fires)', 'MODIS (Thermal)', 'POWER (Weather)']
    }
  } catch (error) {
    console.error('Wildfire risk assessment error:', error)
    return generateMockDisasterRisk(DISASTER_TYPES.WILDFIRE, lat, lon)
  }
}

/**
 * Assess earthquake risk
 */
export async function assessEarthquakeRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with USGS API
  // Historical seismicity data
  const distanceToFault = 50 + Math.random() * 200 // km
  const historicalMagnitude = 4 + Math.random() * 4 // M 4-8
  const yearsLastQuake = Math.random() * 100
  
  let riskScore = 0
  const factors = []

  // Proximity to fault line
  if (distanceToFault < 50) {
    riskScore += (50 - distanceToFault) * 0.8
    factors.push(`Near fault line: ${Math.round(distanceToFault)}km`)
  }

  // Historical magnitude
  if (historicalMagnitude > 6) {
    riskScore += (historicalMagnitude - 6) * 15
    factors.push(`Historical M${historicalMagnitude.toFixed(1)} earthquakes`)
  }

  // Seismic gap (long time since last quake = stress accumulation)
  if (yearsLastQuake > 50) {
    riskScore += (yearsLastQuake - 50) * 0.3
    factors.push(`${Math.round(yearsLastQuake)} years since last major quake`)
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.EARTHQUAKE,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getEarthquakeRecommendations(riskScore),
    data_sources: ['USGS (Seismicity)', 'NASA InSAR (Ground Deformation)']
  }
}

/**
 * Assess drought risk
 */
export async function assessDroughtRisk(location) {
  const { lat, lon } = location
  
  try {
    // Get vegetation health
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000) // 3 months
    const ndviData = await fetchNDVI(lat, lon, 'MOD13Q1', 'NDVI', startDate, endDate)
    const health = calculateVegetationHealth(ndviData.data)
    
    // Get land surface temperature
    const lstData = await fetchLST(lat, lon, new Date())
    
    const drought = detectDroughtStress(health, lstData)

    return {
      disaster_type: DISASTER_TYPES.DROUGHT,
      risk_score: drought.stress_score,
      severity: getSeverityLevel(drought.stress_score),
      factors: drought.indicators,
      vegetation_health: health.health_score,
      population_at_risk: estimatePopulationAtRisk(lat, lon, drought.stress_score),
      recommendations: drought.recommendations,
      data_sources: ['MODIS NDVI', 'SMAP (Soil Moisture)', 'Grace-FO (Groundwater)']
    }
  } catch (error) {
    console.error('Drought risk assessment error:', error)
    return generateMockDisasterRisk(DISASTER_TYPES.DROUGHT, lat, lon)
  }
}

/**
 * Assess landslide risk
 */
export async function assessLandslideRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with NASA LHASA
  const slopeAngle = Math.random() * 60 // degrees
  const recentRainfall = 50 + Math.random() * 200 // mm
  const soilType = Math.random() > 0.5 ? 'clay' : 'loose'
  const vegetation = Math.random() // 0-1
  
  let riskScore = 0
  const factors = []

  // Steep slope
  if (slopeAngle > 30) {
    riskScore += (slopeAngle - 30) * 2
    factors.push(`Steep slope: ${Math.round(slopeAngle)}°`)
  }

  // Heavy rainfall
  if (recentRainfall > 100) {
    riskScore += (recentRainfall - 100) * 0.3
    factors.push(`Heavy rainfall: ${Math.round(recentRainfall)}mm`)
  }

  // Poor soil stability
  if (soilType === 'loose') {
    riskScore += 20
    factors.push('Loose soil composition')
  }

  // Lack of vegetation
  if (vegetation < 0.3) {
    riskScore += (0.3 - vegetation) * 50
    factors.push('Sparse vegetation cover')
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.LANDSLIDE,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getLandslideRecommendations(riskScore),
    data_sources: ['NASA LHASA', 'GPM (Rainfall)', 'SRTM (Slope)', 'Landsat (Vegetation)']
  }
}

/**
 * Assess extreme heat risk
 */
export async function assessExtremeHeatRisk(location) {
  const { lat, lon } = location
  
  try {
    const climate = await fetchComprehensiveClimate(lat, lon)
    const risks = calculateExtremeWeatherRisk(climate, lat)
    
    // Find heat-related risks
    const heatRisks = risks.risks.filter(r => r.type === 'Extreme Heat')
    const heatScore = heatRisks.length > 0 ? 
      Math.min(100, heatRisks[0].severity === 'high' ? 80 : 50) : 
      risks.risk_score

    return {
      disaster_type: DISASTER_TYPES.EXTREME_HEAT,
      risk_score: heatScore,
      severity: getSeverityLevel(heatScore),
      factors: heatRisks.map(r => `${r.description}: ${r.value}`),
      population_at_risk: estimatePopulationAtRisk(lat, lon, heatScore),
      recommendations: getHeatRecommendations(heatScore),
      data_sources: ['MODIS LST', 'POWER (Temperature)', 'Landsat (Urban Heat Island)']
    }
  } catch (error) {
    console.error('Heat risk assessment error:', error)
    return generateMockDisasterRisk(DISASTER_TYPES.EXTREME_HEAT, lat, lon)
  }
}

/**
 * Assess volcano risk
 */
export async function assessVolcanoRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with Smithsonian GVP
  const distanceToVolcano = 100 + Math.random() * 500 // km
  const volcanoActivity = Math.random() // 0-1
  const lastEruption = Math.random() * 1000 // years
  
  let riskScore = 0
  const factors = []

  // Proximity to active volcano
  if (distanceToVolcano < 100) {
    riskScore += (100 - distanceToVolcano) * 0.5
    factors.push(`${Math.round(distanceToVolcano)}km from active volcano`)
  }

  // Current activity
  if (volcanoActivity > 0.5) {
    riskScore += volcanoActivity * 50
    factors.push('Elevated volcanic activity detected')
  }

  // Recent eruption history
  if (lastEruption < 100) {
    riskScore += (100 - lastEruption) * 0.3
    factors.push(`Erupted ${Math.round(lastEruption)} years ago`)
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.VOLCANO,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getVolcanoRecommendations(riskScore),
    data_sources: ['MODIS (Thermal)', 'OMI (SO2)', 'InSAR (Ground Deformation)']
  }
}

/**
 * Assess tsunami risk
 */
export async function assessTsunamiRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with NOAA
  const distanceToCoast = calculateDistanceToCoast(lat, lon)
  const elevation = Math.random() * 50 // meters
  const subductionZone = Math.random() > 0.7
  
  let riskScore = 0
  const factors = []

  // Coastal proximity
  if (distanceToCoast < 10) {
    riskScore += (10 - distanceToCoast) * 10
    factors.push(`${Math.round(distanceToCoast)}km from coast`)
  }

  // Low elevation
  if (elevation < 10 && distanceToCoast < 50) {
    riskScore += (10 - elevation) * 5
    factors.push(`Low elevation: ${Math.round(elevation)}m`)
  }

  // Near subduction zone
  if (subductionZone) {
    riskScore += 40
    factors.push('Near tectonic subduction zone')
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.TSUNAMI,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getTsunamiRecommendations(riskScore),
    data_sources: ['NOAA Tsunami Warning', 'Jason-3 (Sea Level)', 'USGS (Earthquakes)']
  }
}

/**
 * Assess thunderstorm risk
 */
export async function assessThunderstormRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with NOAA NWS, GOES-R GLM
  const atmosphericInstability = Math.random() // 0-1
  const moisture = 50 + Math.random() * 40 // %
  const windShear = Math.random() * 50 // m/s
  
  let riskScore = 0
  const factors = []

  // Unstable atmosphere
  if (atmosphericInstability > 0.6) {
    riskScore += atmosphericInstability * 40
    factors.push('Unstable atmospheric conditions')
  }

  // High moisture
  if (moisture > 70) {
    riskScore += (moisture - 70) * 1.5
    factors.push(`High moisture: ${Math.round(moisture)}%`)
  }

  // Wind shear (tornado potential)
  if (windShear > 20) {
    riskScore += (windShear - 20) * 2
    factors.push(`Strong wind shear: ${Math.round(windShear)} m/s`)
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.THUNDERSTORM,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getThunderstormRecommendations(riskScore),
    data_sources: ['GOES-R GLM (Lightning)', 'GPM (Rainfall)', 'NOAA NWS (Warnings)']
  }
}

/**
 * Assess rainblast/cloudburst risk
 */
export async function assessRainblastRisk(location) {
  const { lat, lon } = location
  
  // Mock implementation - integrate with GPM IMERG
  const convectiveActivity = Math.random() // 0-1
  const rainfallRate = Math.random() * 150 // mm/hour
  const urbanDrainage = Math.random() > 0.5 ? 'good' : 'poor'
  
  let riskScore = 0
  const factors = []

  // High convective activity
  if (convectiveActivity > 0.7) {
    riskScore += convectiveActivity * 50
    factors.push('Strong convective cell detected')
  }

  // Extreme rainfall rate
  if (rainfallRate > 50) {
    riskScore += (rainfallRate - 50) * 0.8
    factors.push(`Intense rainfall: ${Math.round(rainfallRate)}mm/hour`)
  }

  // Poor drainage
  if (urbanDrainage === 'poor') {
    riskScore += 30
    factors.push('Inadequate urban drainage system')
  }

  riskScore = Math.min(100, riskScore)

  return {
    disaster_type: DISASTER_TYPES.RAINBLAST,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors,
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: getRainblastRecommendations(riskScore),
    data_sources: ['GPM IMERG (Precipitation)', 'GOES-R (Cloud Imaging)', 'Urban Drainage Maps']
  }
}

// Helper functions

function getSeverityLevel(score) {
  if (score >= 80) return SEVERITY_LEVELS.EXTREME
  if (score >= 60) return SEVERITY_LEVELS.HIGH
  if (score >= 30) return SEVERITY_LEVELS.MODERATE
  return SEVERITY_LEVELS.LOW
}

function calculateOverallRisk(risks) {
  const avgScore = risks.reduce((sum, r) => sum + r.risk_score, 0) / risks.length
  return {
    score: Math.round(avgScore),
    severity: getSeverityLevel(avgScore)
  }
}

function getHighestRisk(risks) {
  return risks.reduce((highest, current) => 
    current.risk_score > highest.risk_score ? current : highest
  )
}

function estimatePopulationAtRisk(lat, lon, riskScore) {
  // Mock implementation - integrate with WorldPop, SEDAC
  const basePopulation = 10000 + Math.random() * 90000
  const exposureFactor = riskScore / 100
  return Math.round(basePopulation * exposureFactor)
}

function calculateDistanceToCoast(lat, lon) {
  // Simplified mock - real implementation would use coastline database
  const isCoastal = Math.abs(lon) % 30 < 10 || Math.abs(lat) % 30 < 10
  return isCoastal ? Math.random() * 50 : 50 + Math.random() * 500
}

function generateMockDisasterRisk(type, lat, lon) {
  const riskScore = Math.random() * 100
  return {
    disaster_type: type,
    risk_score: Math.round(riskScore),
    severity: getSeverityLevel(riskScore),
    factors: ['Mock data - integrate real APIs'],
    population_at_risk: estimatePopulationAtRisk(lat, lon, riskScore),
    recommendations: ['Monitor situation', 'Stay informed'],
    data_sources: ['Mock data']
  }
}

// Recommendation functions

function getFloodRecommendations(score) {
  if (score > 70) return ['⚠️ EVACUATE IMMEDIATELY if ordered', 'Move to higher ground', 'Do not walk/drive through floodwater', 'Keep emergency supplies ready']
  if (score > 50) return ['Prepare evacuation plan', 'Move valuables to upper floors', 'Monitor weather alerts', 'Clear drainage systems']
  if (score > 30) return ['Stay informed', 'Check flood insurance', 'Prepare emergency kit', 'Know evacuation routes']
  return ['Monitor weather', 'Maintain emergency supplies']
}

function getEarthquakeRecommendations(score) {
  if (score > 70) return ['⚠️ HIGH RISK ZONE', 'Retrofit buildings', 'Secure heavy furniture', 'Practice Drop-Cover-Hold', 'Keep 72-hour emergency kit']
  if (score > 50) return ['Secure heavy items', 'Know safe spots', 'Prepare emergency kit', 'Check building structural integrity']
  return ['Learn earthquake safety', 'Prepare emergency kit', 'Identify safe spots indoors']
}

function getLandslideRecommendations(score) {
  if (score > 70) return ['⚠️ EVACUATE if ground cracks appear', 'Avoid steep slopes during rain', 'Monitor hillside for movement', 'Report ground deformation']
  if (score > 50) return ['Monitor slope stability', 'Avoid building on steep slopes', 'Plant vegetation for stabilization', 'Construct retaining walls']
  return ['Be aware of landslide signs', 'Maintain slope drainage', 'Report unusual ground movement']
}

function getHeatRecommendations(score) {
  if (score > 70) return ['⚠️ EXTREME HEAT WARNING', 'Stay indoors with AC', 'Drink water frequently', 'Check on elderly neighbors', 'Go to cooling centers']
  if (score > 50) return ['Limit outdoor activity', 'Stay hydrated', 'Wear light clothing', 'Never leave children/pets in cars']
  return ['Stay hydrated', 'Limit sun exposure', 'Check weather forecasts']
}

function getVolcanoRecommendations(score) {
  if (score > 70) return ['⚠️ EVACUATE if ordered', 'Prepare evacuation kit', 'Avoid ash cloud areas', 'Wear masks for ash protection', 'Follow official updates']
  if (score > 50) return ['Monitor volcanic activity', 'Prepare evacuation plan', 'Stock emergency supplies', 'Know evacuation routes']
  return ['Stay informed', 'Know volcano alert levels', 'Prepare emergency kit']
}

function getTsunamiRecommendations(score) {
  if (score > 70) return ['⚠️ GO TO HIGH GROUND IMMEDIATELY', 'Move 3km inland or 30m elevation', 'Do not return until all-clear given', 'Listen to emergency radio']
  if (score > 50) return ['Know evacuation routes', 'Prepare evacuation kit', 'Participate in tsunami drills', 'Install tsunami warning app']
  return ['Learn tsunami warning signs', 'Know evacuation routes', 'Prepare emergency kit']
}

function getThunderstormRecommendations(score) {
  if (score > 70) return ['⚠️ SEVERE STORM WARNING', 'Go indoors immediately', 'Avoid windows', 'Unplug electronics', 'Stay away from water/metal']
  if (score > 50) return ['Monitor weather radar', 'Secure outdoor items', 'Charge devices', 'Avoid tall trees']
  return ['Monitor weather', 'Prepare for power outages', 'Know safe shelter locations']
}

function getRainblastRecommendations(score) {
  if (score > 70) return ['⚠️ FLASH FLOOD WARNING', 'Avoid low-lying areas', 'Do not drive through water', 'Move to higher floors', 'Monitor local alerts']
  if (score > 50) return ['Avoid driving if possible', 'Clear drainage systems', 'Move vehicles to higher ground', 'Monitor weather']
  return ['Clear gutters/drains', 'Be prepared for sudden flooding', 'Know flood-prone areas']
}

export default {
  DISASTER_TYPES,
  SEVERITY_LEVELS,
  getAllDisasterRisks,
  assessFloodRisk,
  assessWildfireRisk,
  assessEarthquakeRisk,
  assessDroughtRisk,
  assessLandslideRisk,
  assessExtremeHeatRisk,
  assessVolcanoRisk,
  assessTsunamiRisk,
  assessThunderstormRisk,
  assessRainblastRisk
}
