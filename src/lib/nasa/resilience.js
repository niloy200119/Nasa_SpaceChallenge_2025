/**
 * City Resilience Scoring System
 * 
 * Calculates comprehensive resilience score (0-100) based on:
 * - Weather & Climate vulnerability
 * - Disaster exposure & proximity
 * - Infrastructure & Mobility capacity
 * - Air quality & environmental health
 * - Preparedness & response capability
 */

/**
 * Calculate overall city resilience score
 * @param {Object} params - Input parameters
 * @param {Object} params.weather - Current weather data
 * @param {Array} params.disasters - Active disasters in area
 * @param {Object} params.climate - Climate data (POWER API)
 * @param {Object} params.mobility - Mobility/traffic data
 * @param {Object} params.airQuality - Air quality metrics
 * @returns {Object} Resilience score and breakdown
 */
export async function calculateResilienceScore({
  weather = null,
  disasters = [],
  climate = null,
  mobility = null,
  airQuality = null,
  location = null
}) {
  // Individual component scores (0-100, higher is better)
  const weatherScore = calculateWeatherResilience(weather)
  const disasterScore = calculateDisasterResilience(disasters, location)
  const climateScore = calculateClimateResilience(climate)
  const mobilityScore = calculateMobilityResilience(mobility)
  const airQualityScore = calculateAirQualityResilience(airQuality)
  const infrastructureScore = calculateInfrastructureResilience(location, mobility)

  // Weighted average (adjust weights based on priorities)
  const weights = {
    weather: 0.20,        // 20% - Current weather risks
    disaster: 0.25,       // 25% - Active disaster threats
    climate: 0.15,        // 15% - Long-term climate vulnerability
    mobility: 0.15,       // 15% - Transportation resilience
    airQuality: 0.10,     // 10% - Environmental health
    infrastructure: 0.15  // 15% - Built environment capacity
  }

  const overallScore = Math.round(
    weatherScore * weights.weather +
    disasterScore * weights.disaster +
    climateScore * weights.climate +
    mobilityScore * weights.mobility +
    airQualityScore * weights.airQuality +
    infrastructureScore * weights.infrastructure
  )

  // Determine resilience level
  let resilienceLevel = 'Unknown'
  let resilienceColor = 'gray'
  let resilienceIcon = '❓'
  
  if (overallScore >= 80) {
    resilienceLevel = 'Excellent'
    resilienceColor = 'green'
    resilienceIcon = '🛡️'
  } else if (overallScore >= 65) {
    resilienceLevel = 'Good'
    resilienceColor = 'blue'
    resilienceIcon = '✅'
  } else if (overallScore >= 50) {
    resilienceLevel = 'Moderate'
    resilienceColor = 'yellow'
    resilienceIcon = '⚠️'
  } else if (overallScore >= 35) {
    resilienceLevel = 'Fair'
    resilienceColor = 'orange'
    resilienceIcon = '⚡'
  } else {
    resilienceLevel = 'Poor'
    resilienceColor = 'red'
    resilienceIcon = '🚨'
  }

  // Identify top risks and strengths
  const componentScores = {
    weather: weatherScore,
    disaster: disasterScore,
    climate: climateScore,
    mobility: mobilityScore,
    airQuality: airQualityScore,
    infrastructure: infrastructureScore
  }

  const sortedComponents = Object.entries(componentScores)
    .sort((a, b) => a[1] - b[1])

  const topRisks = sortedComponents.slice(0, 2).map(([key, score]) => ({
    category: formatCategoryName(key),
    score: score,
    severity: score < 40 ? 'Critical' : score < 60 ? 'High' : 'Moderate'
  }))

  const topStrengths = sortedComponents.slice(-2).reverse().map(([key, score]) => ({
    category: formatCategoryName(key),
    score: score
  }))

  // Generate recommendations
  const recommendations = generateRecommendations(componentScores, disasters, weather)

  return {
    overallScore,
    resilienceLevel,
    resilienceColor,
    resilienceIcon,
    componentScores: {
      weather: { score: weatherScore, label: 'Weather Resilience' },
      disaster: { score: disasterScore, label: 'Disaster Preparedness' },
      climate: { score: climateScore, label: 'Climate Adaptation' },
      mobility: { score: mobilityScore, label: 'Mobility & Access' },
      airQuality: { score: airQualityScore, label: 'Air Quality' },
      infrastructure: { score: infrastructureScore, label: 'Infrastructure' }
    },
    topRisks,
    topStrengths,
    recommendations,
    timestamp: new Date().toISOString()
  }
}

/**
 * Calculate weather resilience score
 */
function calculateWeatherResilience(weather) {
  if (!weather) return 70 // Neutral score if no data

  let score = 100

  // Temperature extremes
  if (weather.temp > 38) score -= 20 // Extreme heat
  else if (weather.temp > 35) score -= 10
  else if (weather.temp < 0) score -= 15 // Freezing
  else if (weather.temp < 5) score -= 8

  // Wind speed
  if (weather.windSpeed > 80) score -= 25 // Hurricane force
  else if (weather.windSpeed > 60) score -= 15 // Storm force
  else if (weather.windSpeed > 40) score -= 8

  // Precipitation/humidity
  if (weather.humidity > 90 && weather.temp > 30) score -= 10 // Oppressive
  if (weather.pressure < 980) score -= 10 // Low pressure system

  // Weather conditions
  const severeConditions = ['Thunderstorm', 'Tornado', 'Hurricane', 'Hail', 'Snow', 'Blizzard']
  if (severeConditions.some(cond => weather.conditions?.includes(cond))) {
    score -= 15
  }

  return Math.max(0, Math.min(100, score))
}

/**
 * Calculate disaster resilience score
 */
function calculateDisasterResilience(disasters, location) {
  if (!disasters || disasters.length === 0) return 95 // High score if no disasters

  let score = 90
  
  // Deduct points for each disaster based on severity and proximity
  const severityWeights = {
    'Wildfires': 15,
    'Severe Storms': 12,
    'Floods': 18,
    'Earthquakes': 20,
    'Volcanoes': 25,
    'Drought': 10,
    'Landslides': 14,
    'Sea and Lake Ice': 5,
    'Snow': 8,
    'Dust and Haze': 6,
    'Manmade': 10,
    'Temperature Extremes': 12
  }

  disasters.forEach(disaster => {
    const category = disaster.categories?.[0]?.title || 'Unknown'
    const deduction = severityWeights[category] || 10
    score -= deduction
  })

  // Cap maximum deduction
  return Math.max(20, Math.min(95, score))
}

/**
 * Calculate climate resilience score
 */
function calculateClimateResilience(climate) {
  if (!climate) return 70 // Neutral score if no data

  let score = 85

  // Check for extreme climate patterns
  const avgTemp = climate.T2M || climate.avgTemp || 20
  const avgPrecip = climate.PRECTOTCORR || climate.avgPrecip || 50

  // Temperature extremes
  if (avgTemp > 32) score -= 15 // Very hot climate
  else if (avgTemp > 28) score -= 8
  else if (avgTemp < -5) score -= 12 // Very cold climate

  // Precipitation extremes
  if (avgPrecip > 200) score -= 10 // Very wet
  else if (avgPrecip < 10) score -= 15 // Arid/drought prone

  return Math.max(40, Math.min(100, score))
}

/**
 * Calculate mobility resilience score
 */
function calculateMobilityResilience(mobility) {
  if (!mobility) return 70

  let score = 100

  // Check mobility risk factors
  if (mobility.overallRisk) {
    score -= mobility.overallRisk * 0.4 // 0-100 risk translates to 0-40 point deduction
  }

  // Accessibility impact
  if (mobility.accessibility?.overall) {
    score = (score + mobility.accessibility.overall) / 2
  }

  // Transit impact
  if (mobility.transitImpact > 50) {
    score -= 15
  } else if (mobility.transitImpact > 30) {
    score -= 8
  }

  return Math.max(30, Math.min(100, score))
}

/**
 * Calculate air quality resilience score
 */
function calculateAirQualityResilience(airQuality) {
  if (!airQuality) return 75

  let score = 100

  // AQI-based scoring (WHO standards)
  const aqi = airQuality.aqi || 50
  
  if (aqi > 300) score -= 50 // Hazardous
  else if (aqi > 200) score -= 40 // Very unhealthy
  else if (aqi > 150) score -= 30 // Unhealthy
  else if (aqi > 100) score -= 20 // Unhealthy for sensitive
  else if (aqi > 50) score -= 10 // Moderate

  // PM2.5 (critical pollutant)
  const pm25 = airQuality.components?.pm2_5 || airQuality.pm25 || 0
  if (pm25 > 55) score -= 15
  else if (pm25 > 35) score -= 10
  else if (pm25 > 15) score -= 5

  return Math.max(20, Math.min(100, score))
}

/**
 * Calculate infrastructure resilience score
 */
function calculateInfrastructureResilience(location, mobility) {
  let score = 75 // Base score

  // Check evacuation capacity
  if (mobility?.evacuationCapacity) {
    score += (mobility.evacuationCapacity - 50) * 0.3
  }

  // Check road accessibility
  if (mobility?.accessibility?.blockedRoads) {
    const blocked = mobility.accessibility.blockedRoads
    if (blocked > 20) score -= 25
    else if (blocked > 10) score -= 15
    else if (blocked > 5) score -= 8
  }

  // Check safe routes availability
  if (mobility?.safeRoutes) {
    score += Math.min(mobility.safeRoutes * 2, 15)
  }

  return Math.max(30, Math.min(100, score))
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(scores, disasters, weather) {
  const recommendations = []

  // Weather-based recommendations
  if (scores.weather < 60) {
    if (weather?.temp > 35) {
      recommendations.push({
        category: 'Weather',
        priority: 'High',
        action: 'Activate heat emergency protocols. Open cooling centers.',
        icon: '🌡️'
      })
    }
    if (weather?.windSpeed > 50) {
      recommendations.push({
        category: 'Weather',
        priority: 'High',
        action: 'Issue wind warnings. Secure outdoor objects and infrastructure.',
        icon: '💨'
      })
    }
  }

  // Disaster-based recommendations
  if (scores.disaster < 60 && disasters.length > 0) {
    recommendations.push({
      category: 'Disaster',
      priority: 'Critical',
      action: `Active disasters detected: ${disasters.length}. Activate emergency response plan.`,
      icon: '🚨'
    })
    
    const hasFlood = disasters.some(d => d.categories?.[0]?.title === 'Floods')
    const hasFire = disasters.some(d => d.categories?.[0]?.title === 'Wildfires')
    
    if (hasFlood) {
      recommendations.push({
        category: 'Flooding',
        priority: 'Critical',
        action: 'Evacuate low-lying areas. Activate flood barriers and drainage systems.',
        icon: '🌊'
      })
    }
    if (hasFire) {
      recommendations.push({
        category: 'Wildfire',
        priority: 'Critical',
        action: 'Create defensible space. Prepare evacuation routes. Monitor air quality.',
        icon: '🔥'
      })
    }
  }

  // Mobility-based recommendations
  if (scores.mobility < 60) {
    recommendations.push({
      category: 'Mobility',
      priority: 'Moderate',
      action: 'Enhance public transit frequency. Clear blocked routes. Deploy traffic management.',
      icon: '🚦'
    })
  }

  // Air quality recommendations
  if (scores.airQuality < 60) {
    recommendations.push({
      category: 'Air Quality',
      priority: 'Moderate',
      action: 'Issue air quality alerts. Limit outdoor activities. Distribute masks.',
      icon: '😷'
    })
  }

  // Infrastructure recommendations
  if (scores.infrastructure < 60) {
    recommendations.push({
      category: 'Infrastructure',
      priority: 'High',
      action: 'Inspect critical infrastructure. Prioritize repairs. Ensure emergency access routes.',
      icon: '🏗️'
    })
  }

  // General preparedness
  if (scores.disaster < 70 || scores.weather < 70) {
    recommendations.push({
      category: 'Preparedness',
      priority: 'Moderate',
      action: 'Update emergency plans. Conduct drills. Stockpile emergency supplies.',
      icon: '📋'
    })
  }

  return recommendations.slice(0, 5) // Top 5 recommendations
}

/**
 * Format category name for display
 */
function formatCategoryName(key) {
  const labels = {
    weather: 'Weather',
    disaster: 'Disasters',
    climate: 'Climate',
    mobility: 'Mobility',
    airQuality: 'Air Quality',
    infrastructure: 'Infrastructure'
  }
  return labels[key] || key
}

/**
 * Get resilience trend (mock - would require historical data)
 */
export function getResilienceTrend(currentScore) {
  // Simulate trend (in production, compare with historical scores)
  const change = Math.floor(Math.random() * 10) - 5 // -5 to +5
  const trend = change > 0 ? 'improving' : change < 0 ? 'declining' : 'stable'
  const trendIcon = change > 0 ? '📈' : change < 0 ? '📉' : '➡️'
  
  return {
    trend,
    trendIcon,
    change: Math.abs(change),
    message: change > 0 
      ? `Resilience improved by ${change} points in the last 30 days`
      : change < 0
      ? `Resilience declined by ${Math.abs(change)} points in the last 30 days`
      : 'Resilience score stable over the last 30 days'
  }
}
