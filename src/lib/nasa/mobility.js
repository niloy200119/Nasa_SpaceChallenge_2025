/**
 * Transportation & Mobility API Client
 * 
 * Integrates multiple data sources for smart mobility:
 * - Traffic flow & congestion
 * - Public transit (GTFS)
 * - EV charging stations
 * - Air quality & emissions
 * - Disaster-resilient routing
 * - Citizen participation/crowdsourcing
 */

const MOBILITY_API_BASE = import.meta.env.VITE_MOBILITY_API_URL || 'http://localhost:8001/api/v1'

/**
 * Fetch real-time traffic data for a bbox
 * Uses: OpenStreetMap, HERE Maps, or custom traffic API
 */
export async function fetchTrafficData(bbox, datetime = new Date().toISOString()) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const url = `${MOBILITY_API_BASE}/traffic?bbox=${minLon},${minLat},${maxLon},${maxLat}&time=${datetime}`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('Traffic API error')
    // return await res.json()

    // MOCK DATA
    return generateMockTrafficData(bbox)
  } catch (error) {
    console.error('Failed to fetch traffic data:', error)
    throw error
  }
}

/**
 * Fetch public transit routes and schedules (GTFS data)
 */
export async function fetchPublicTransit(bbox, transitTypes = ['bus', 'metro', 'tram']) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const url = `${MOBILITY_API_BASE}/transit?bbox=${minLon},${minLat},${maxLon},${maxLat}&types=${transitTypes.join(',')}`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('Transit API error')
    // return await res.json()

    // MOCK DATA
    return generateMockTransitData(bbox, transitTypes)
  } catch (error) {
    console.error('Failed to fetch transit data:', error)
    throw error
  }
}

/**
 * Fetch EV charging stations
 * Uses: OpenChargeMap, ChargePoint API
 */
export async function fetchEVStations(bbox, filterAvailable = false) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const url = `${MOBILITY_API_BASE}/ev-stations?bbox=${minLon},${minLat},${maxLon},${maxLat}&available=${filterAvailable}`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('EV stations API error')
    // return await res.json()

    // MOCK DATA
    return generateMockEVStations(bbox)
  } catch (error) {
    console.error('Failed to fetch EV stations:', error)
    throw error
  }
}

/**
 * Fetch air quality and emissions data
 * Uses: OpenAQ, NASA MOPITT, Copernicus
 */
export async function fetchAirQuality(bbox) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const url = `${MOBILITY_API_BASE}/air-quality?bbox=${minLon},${minLat},${maxLon},${maxLat}`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('Air quality API error')
    // return await res.json()

    // MOCK DATA
    return generateMockAirQuality(bbox)
  } catch (error) {
    console.error('Failed to fetch air quality:', error)
    throw error
  }
}

/**
 * Calculate optimal route with disaster awareness
 * Avoids flooded roads, fallen trees, blocked areas
 */
export async function calculateDisasterRoute(start, end, hazards = [], preferences = {}) {
  const url = `${MOBILITY_API_BASE}/route/disaster-aware`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ start, end, hazards, preferences })
    // })
    // if (!res.ok) throw new Error('Routing API error')
    // return await res.json()

    // MOCK DATA
    return generateMockRoute(start, end, hazards)
  } catch (error) {
    console.error('Failed to calculate route:', error)
    throw error
  }
}

/**
 * Submit citizen report (crowdsourced incident)
 */
export async function submitCitizenReport(report) {
  const url = `${MOBILITY_API_BASE}/citizen-reports`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(report)
    // })
    // if (!res.ok) throw new Error('Submit report API error')
    // return await res.json()

    // MOCK DATA
    return {
      report_id: `report_${Date.now()}`,
      status: 'submitted',
      ...report,
      created_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to submit report:', error)
    throw error
  }
}

/**
 * Fetch citizen reports in area
 */
export async function fetchCitizenReports(bbox, limit = 50) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const url = `${MOBILITY_API_BASE}/citizen-reports?bbox=${minLon},${minLat},${maxLon},${maxLat}&limit=${limit}`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('Citizen reports API error')
    // return await res.json()

    // MOCK DATA
    return generateMockCitizenReports(bbox, limit)
  } catch (error) {
    console.error('Failed to fetch citizen reports:', error)
    throw error
  }
}

/**
 * Calculate mobility score (0-100)
 * Based on: transit access, congestion, emissions, safety
 */
export async function calculateMobilityScore(location) {
  const url = `${MOBILITY_API_BASE}/mobility-score?lat=${location.lat}&lon=${location.lon}`

  try {
    // TODO: Uncomment when backend ready
    // const res = await fetch(url)
    // if (!res.ok) throw new Error('Mobility score API error')
    // return await res.json()

    // MOCK DATA
    return {
      score: 60 + Math.floor(Math.random() * 30),
      components: {
        transit_access: 70 + Math.floor(Math.random() * 25),
        congestion: 40 + Math.floor(Math.random() * 40),
        emissions: 50 + Math.floor(Math.random() * 30),
        safety: 65 + Math.floor(Math.random() * 25),
        accessibility: 55 + Math.floor(Math.random() * 35)
      }
    }
  } catch (error) {
    console.error('Failed to calculate mobility score:', error)
    throw error
  }
}

// ========== MOCK DATA GENERATORS ==========

function generateMockTrafficData(bbox) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const segments = []

  for (let i = 0; i < 20; i++) {
    const startLon = minLon + Math.random() * (maxLon - minLon)
    const startLat = minLat + Math.random() * (maxLat - minLat)
    const endLon = startLon + (Math.random() - 0.5) * 0.01
    const endLat = startLat + (Math.random() - 0.5) * 0.01

    segments.push({
      id: `seg_${i}`,
      geometry: {
        type: 'LineString',
        coordinates: [[startLon, startLat], [endLon, endLat]]
      },
      speed_kmh: 20 + Math.random() * 80,
      congestion_level: Math.random(), // 0-1
      incident_count: Math.floor(Math.random() * 3)
    })
  }

  return { segments, timestamp: new Date().toISOString() }
}

function generateMockTransitData(bbox, types) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const routes = []

  types.forEach(type => {
    for (let i = 0; i < 3; i++) {
      routes.push({
        id: `${type}_route_${i}`,
        type,
        name: `${type.toUpperCase()} Line ${i + 1}`,
        stops: Array.from({ length: 5 }, (_, j) => ({
          id: `stop_${i}_${j}`,
          name: `Stop ${j + 1}`,
          location: {
            lat: minLat + Math.random() * (maxLat - minLat),
            lon: minLon + Math.random() * (maxLon - minLon)
          },
          next_arrival: new Date(Date.now() + Math.random() * 900000).toISOString()
        }))
      })
    }
  })

  return { routes }
}

function generateMockEVStations(bbox) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const stations = []

  for (let i = 0; i < 10; i++) {
    stations.push({
      id: `ev_station_${i}`,
      name: `Charging Station ${i + 1}`,
      location: {
        lat: minLat + Math.random() * (maxLat - minLat),
        lon: minLon + Math.random() * (maxLon - minLon)
      },
      chargers: {
        total: 4 + Math.floor(Math.random() * 6),
        available: Math.floor(Math.random() * 5),
        type: Math.random() > 0.5 ? 'Fast' : 'Standard'
      },
      power_kw: Math.random() > 0.5 ? 150 : 50,
      price_per_kwh: 0.25 + Math.random() * 0.15
    })
  }

  return { stations }
}

function generateMockAirQuality(bbox) {
  return {
    aqi: 50 + Math.floor(Math.random() * 100),
    pm25: 10 + Math.random() * 40,
    pm10: 15 + Math.random() * 50,
    no2: 20 + Math.random() * 60,
    co: 0.5 + Math.random() * 2,
    timestamp: new Date().toISOString()
  }
}

function generateMockRoute(start, end, hazards) {
  return {
    route: {
      type: 'LineString',
      coordinates: [
        [start.lon, start.lat],
        [start.lon + (end.lon - start.lon) * 0.5, start.lat + (end.lat - start.lat) * 0.5],
        [end.lon, end.lat]
      ]
    },
    distance_km: 5 + Math.random() * 20,
    duration_min: 10 + Math.random() * 40,
    hazards_avoided: hazards.length,
    safety_score: 70 + Math.floor(Math.random() * 25)
  }
}

/**
 * Calculate mobility risk for a location
 */
export async function calculateMobilityRisk(location, bbox) {
  try {
    const [lat, lon] = location
    
    // Mock mobility risk calculation
    const baseRisk = 30 + Math.random() * 40
    const trafficFactor = Math.random() * 20
    const weatherFactor = Math.random() * 15
    const infrastructureFactor = Math.random() * 15
    
    const overallRisk = Math.min(100, baseRisk + trafficFactor + weatherFactor + infrastructureFactor)
    
    return {
      overallRisk: Math.round(overallRisk),
      accessibility: {
        overall: Math.round(100 - overallRisk * 0.7),
        blockedRoads: Math.floor(Math.random() * 15)
      },
      trafficLevel: overallRisk > 70 ? 'Heavy' : overallRisk > 40 ? 'Moderate' : 'Light',
      avgDelay: Math.round(overallRisk * 0.3),
      transitImpact: Math.round(overallRisk * 0.6),
      affectedRoutes: Math.floor(Math.random() * 8),
      evacuationCapacity: Math.round(100 - overallRisk * 0.8),
      safeRoutes: Math.floor(Math.random() * 5) + 3,
      riskFactors: [
        { name: 'Road Conditions', impact: Math.round(30 + Math.random() * 40) },
        { name: 'Traffic Congestion', impact: Math.round(20 + Math.random() * 50) },
        { name: 'Weather Impact', impact: Math.round(10 + Math.random() * 30) },
        { name: 'Infrastructure Damage', impact: Math.round(5 + Math.random() * 25) },
        { name: 'Public Transit Status', impact: Math.round(15 + Math.random() * 35) }
      ],
      recommendations: [
        'Consider alternative routes during peak hours',
        'Monitor weather conditions for travel planning',
        'Check public transit schedules before departure',
        'Use designated evacuation routes in emergencies'
      ]
    }
  } catch (error) {
    console.error('Failed to calculate mobility risk:', error)
    throw error
  }
}

/**
 * Analyze traffic patterns for a region
 */
export async function analyzeTrafficPatterns(bbox) {
  try {
    const hotspots = []
    const locations = ['Downtown Intersection', 'Highway Exit 5', 'Main Street Bridge', 'City Center Plaza', 'Airport Road']
    const types = ['Bottleneck', 'Accident Zone', 'Construction Area', 'High Volume', 'Poor Signal Timing']
    const severities = ['High', 'Moderate', 'Low']
    
    for (let i = 0; i < 5; i++) {
      hotspots.push({
        location: locations[i],
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        volume: Math.round(500 + Math.random() * 2500),
        delay: Math.round(5 + Math.random() * 20)
      })
    }
    
    const forecast = []
    const now = new Date()
    for (let i = 0; i < 6; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000)
      const timeStr = hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const level = Math.round(30 + Math.random() * 60)
      forecast.push({
        time: timeStr,
        level: level,
        label: level > 70 ? 'Heavy' : level > 40 ? 'Moderate' : 'Light'
      })
    }
    
    return {
      hotspots,
      forecast,
      averageCongestion: Math.round(40 + Math.random() * 30),
      peakHours: ['08:00-10:00', '17:00-19:00']
    }
  } catch (error) {
    console.error('Failed to analyze traffic patterns:', error)
    throw error
  }
}

/**
 * Optimize evacuation routes
 */
export async function optimizeEvacuationRoutes(location, bbox) {
  try {
    const routes = []
    const destinations = ['Safe Zone A', 'Emergency Shelter B', 'Community Center C']
    const statuses = ['Optimal', 'Available', 'Congested', 'Blocked']
    
    for (let i = 0; i < 3; i++) {
      const status = statuses[Math.min(i, statuses.length - 1)]
      const route = {
        from: 'City Center',
        to: destinations[i],
        distance: Math.round(5 + Math.random() * 20),
        duration: Math.round(10 + Math.random() * 30),
        capacity: status === 'Optimal' ? 'High' : status === 'Available' ? 'Medium' : 'Low',
        status: status,
        warnings: []
      }
      
      if (status === 'Congested') {
        route.warnings.push('Heavy traffic expected on this route')
      }
      if (Math.random() > 0.7) {
        route.warnings.push('Road work in progress')
      }
      
      routes.push(route)
    }
    
    return {
      routes,
      recommendedRoute: 0,
      estimatedEvacuationTime: Math.round(15 + Math.random() * 30)
    }
  } catch (error) {
    console.error('Failed to optimize evacuation routes:', error)
    throw error
  }
}

/**
 * Analyze public transit impact
 */
export async function analyzePublicTransitImpact(location, bbox) {
  try {
    const overallImpact = Math.round(20 + Math.random() * 60)
    
    const services = [
      { type: 'Bus', total: Math.floor(15 + Math.random() * 20), affected: Math.floor(Math.random() * 10) },
      { type: 'Metro', total: Math.floor(5 + Math.random() * 10), affected: Math.floor(Math.random() * 5) },
      { type: 'Tram', total: Math.floor(8 + Math.random() * 12), affected: Math.floor(Math.random() * 6) }
    ]
    
    const disruptions = []
    if (Math.random() > 0.5) {
      disruptions.push({
        line: 'Line ' + (Math.floor(Math.random() * 5) + 1),
        description: 'Service delays due to weather conditions',
        duration: Math.round(30 + Math.random() * 90) + ' minutes'
      })
    }
    if (Math.random() > 0.7) {
      disruptions.push({
        line: 'Express Route',
        description: 'Temporary route diversion',
        duration: Math.round(60 + Math.random() * 120) + ' minutes'
      })
    }
    
    return {
      overallImpact,
      services,
      disruptions,
      alternativeOptions: [
        'Use rideshare services',
        'Consider bike-sharing options',
        'Check real-time transit apps'
      ]
    }
  } catch (error) {
    console.error('Failed to analyze transit impact:', error)
    throw error
  }
}

/**
 * Calculate accessibility score
 */
export async function calculateAccessibility(location) {
  try {
    return {
      overall: Math.round(60 + Math.random() * 35),
      wheelchair: Math.round(50 + Math.random() * 40),
      elderly: Math.round(55 + Math.random() * 35),
      visualImpaired: Math.round(45 + Math.random() * 40)
    }
  } catch (error) {
    console.error('Failed to calculate accessibility:', error)
    throw error
  }
}

/**
 * Predict traffic congestion
 */
export async function predictTrafficCongestion(location, timeframe = 24) {
  try {
    const predictions = []
    const now = new Date()
    
    for (let i = 0; i < timeframe; i++) {
      const hour = new Date(now.getTime() + i * 60 * 60 * 1000)
      predictions.push({
        time: hour.toISOString(),
        congestionLevel: Math.round(20 + Math.random() * 70),
        confidence: Math.round(70 + Math.random() * 25)
      })
    }
    
    return {
      predictions,
      peakTimes: ['08:00', '17:30'],
      bestTravelTimes: ['10:00', '14:00', '20:00']
    }
  } catch (error) {
    console.error('Failed to predict traffic congestion:', error)
    throw error
  }
}

function generateMockCitizenReports(bbox, limit) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const reports = []
  const types = ['pothole', 'traffic_jam', 'accident', 'road_closure', 'poor_lighting', 'accessibility_issue']

  for (let i = 0; i < Math.min(limit, 10); i++) {
    reports.push({
      report_id: `report_${Date.now()}_${i}`,
      type: types[Math.floor(Math.random() * types.length)],
      location: {
        lat: minLat + Math.random() * (maxLat - minLat),
        lon: minLon + Math.random() * (maxLon - minLon)
      },
      description: 'Mock citizen report',
      severity: Math.floor(Math.random() * 5) + 1,
      verified: Math.random() > 0.5,
      created_at: new Date(Date.now() - Math.random() * 86400000).toISOString()
    })
  }

  return { reports }
}
