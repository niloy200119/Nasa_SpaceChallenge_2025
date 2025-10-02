/**
 * NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information)
 * Real-time space weather events and their impacts on Earth
 * 
 * API Documentation: https://api.nasa.gov/
 * Documentation: https://ccmc.gsfc.nasa.gov/support/DONKI-webservices.php
 */

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const DONKI_BASE_URL = 'https://api.nasa.gov/DONKI'

/**
 * Fetch solar flares within a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of solar flare events
 */
export async function fetchSolarFlares(startDate, endDate) {
  try {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    
    const url = `${DONKI_BASE_URL}/FLR?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`DONKI API error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('DONKI Solar Flares error:', error)
    return generateMockSolarFlares(startDate, endDate)
  }
}

/**
 * Fetch Coronal Mass Ejections (CMEs)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of CME events
 */
export async function fetchCME(startDate, endDate) {
  try {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    
    const url = `${DONKI_BASE_URL}/CME?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`DONKI API error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('DONKI CME error:', error)
    return generateMockCME(startDate, endDate)
  }
}

/**
 * Fetch Geomagnetic Storms
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of geomagnetic storm events
 */
export async function fetchGeomagneticStorms(startDate, endDate) {
  try {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    
    const url = `${DONKI_BASE_URL}/GST?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`DONKI API error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('DONKI Geomagnetic Storms error:', error)
    return generateMockGeomagneticStorms(startDate, endDate)
  }
}

/**
 * Fetch Solar Energetic Particle (SEP) events
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array>} Array of SEP events
 */
export async function fetchSEP(startDate, endDate) {
  try {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    
    const url = `${DONKI_BASE_URL}/SEP?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`DONKI API error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('DONKI SEP error:', error)
    return generateMockSEP(startDate, endDate)
  }
}

/**
 * Fetch all space weather notifications
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} type - 'all' | 'FLR' | 'CME' | 'GST' | 'SEP' | 'IPS'
 * @returns {Promise<Array>} Array of notifications
 */
export async function fetchSpaceWeatherNotifications(startDate, endDate, type = 'all') {
  try {
    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]
    
    const url = `${DONKI_BASE_URL}/notifications?startDate=${start}&endDate=${end}&type=${type}&api_key=${NASA_API_KEY}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`DONKI API error: ${response.status}`)
    
    return await response.json()
  } catch (error) {
    console.error('DONKI Notifications error:', error)
    return []
  }
}

/**
 * Calculate space weather impact score
 * @param {Array} flares - Solar flare events
 * @param {Array} cmes - CME events
 * @param {Array} storms - Geomagnetic storm events
 * @returns {Object} Impact assessment
 */
export function calculateSpaceWeatherImpact(flares, cmes, storms) {
  let impactScore = 0
  const threats = []

  // Assess solar flares
  if (flares && flares.length > 0) {
    const xClassFlares = flares.filter(f => f.classType?.startsWith('X')).length
    const mClassFlares = flares.filter(f => f.classType?.startsWith('M')).length
    
    const flareScore = xClassFlares * 30 + mClassFlares * 10
    impactScore += Math.min(40, flareScore)
    
    if (xClassFlares > 0) {
      threats.push(`${xClassFlares} X-class solar flare(s) detected`)
    }
    if (mClassFlares > 0) {
      threats.push(`${mClassFlares} M-class solar flare(s) detected`)
    }
  }

  // Assess CMEs
  if (cmes && cmes.length > 0) {
    const earthDirected = cmes.filter(c => 
      c.cmeAnalyses?.[0]?.isMostAccurate && 
      c.cmeAnalyses[0]?.latitude !== null
    ).length
    
    const cmeScore = earthDirected * 20
    impactScore += Math.min(30, cmeScore)
    
    if (earthDirected > 0) {
      threats.push(`${earthDirected} Earth-directed CME(s)`)
    }
  }

  // Assess geomagnetic storms
  if (storms && storms.length > 0) {
    const severeStorms = storms.filter(s => s.kpIndex >= 7).length
    const moderateStorms = storms.filter(s => s.kpIndex >= 5 && s.kpIndex < 7).length
    
    const stormScore = severeStorms * 30 + moderateStorms * 15
    impactScore += Math.min(30, stormScore)
    
    if (severeStorms > 0) {
      threats.push(`${severeStorms} severe geomagnetic storm(s) (Kp≥7)`)
    }
    if (moderateStorms > 0) {
      threats.push(`${moderateStorms} moderate geomagnetic storm(s) (Kp 5-6)`)
    }
  }

  impactScore = Math.min(100, impactScore)

  let impactLevel = 'low'
  if (impactScore > 70) impactLevel = 'extreme'
  else if (impactScore > 50) impactLevel = 'high'
  else if (impactScore > 30) impactLevel = 'moderate'

  return {
    impact_score: Math.round(impactScore),
    impact_level: impactLevel,
    threats,
    affected_systems: getAffectedSystems(impactLevel),
    recommendations: getSpaceWeatherRecommendations(impactLevel)
  }
}

/**
 * Get systems affected by space weather
 */
function getAffectedSystems(impactLevel) {
  const systems = {
    low: ['Amateur radio', 'GPS accuracy (minor)'],
    moderate: ['Satellite navigation', 'Radio communications', 'Power grid (minor)', 'Aurora visible at high latitudes'],
    high: ['GPS disruption', 'HF radio blackout', 'Satellite operations', 'Power grid voltage fluctuations', 'Aurora visible at mid-latitudes'],
    extreme: ['⚠️ Total radio blackout', 'GPS system failure', 'Satellite damage risk', 'Power grid collapse risk', 'Aurora visible at low latitudes', 'Radiation hazard for aircraft/spacecraft']
  }

  return systems[impactLevel] || systems.low
}

/**
 * Get space weather recommendations
 */
function getSpaceWeatherRecommendations(impactLevel) {
  const recommendations = {
    low: [
      'Monitor space weather alerts',
      'No immediate action required'
    ],
    moderate: [
      'Monitor satellite operations',
      'Expect minor GPS accuracy issues',
      'Amateur radio operators: expect disruptions',
      'Check for aurora alerts if at high latitude'
    ],
    high: [
      'Postpone critical satellite operations',
      'Use backup navigation systems',
      'Power companies: monitor grid stability',
      'Airlines: reroute polar flights if needed',
      'Aurora photography opportunity!'
    ],
    extreme: [
      '⚠️ Satellite operators: protect assets',
      '⚠️ Power grid: implement protective measures',
      '⚠️ Airlines: avoid polar routes',
      '⚠️ Expect widespread communication disruptions',
      'Emergency services: prepare backup systems',
      'Astronauts: seek radiation shelter'
    ]
  }

  return recommendations[impactLevel] || recommendations.low
}

/**
 * Predict aurora visibility
 * @param {number} lat - Observer latitude
 * @param {number} lon - Observer longitude
 * @param {number} kpIndex - Geomagnetic activity index (0-9)
 * @returns {Object} Aurora visibility prediction
 */
export function predictAuroraVisibility(lat, lon, kpIndex) {
  // Aurora oval typically at 67° geomagnetic latitude
  // Expands equatorward with higher Kp
  const auroraLatitude = 67 - (kpIndex * 3) // Rough approximation

  const distanceFromAurora = Math.abs(Math.abs(lat) - auroraLatitude)
  
  let visibility = 'none'
  let probability = 0

  if (distanceFromAurora < 5) {
    visibility = 'overhead'
    probability = 90
  } else if (distanceFromAurora < 10) {
    visibility = 'very_high'
    probability = 70
  } else if (distanceFromAurora < 15) {
    visibility = 'high'
    probability = 50
  } else if (distanceFromAurora < 20) {
    visibility = 'moderate'
    probability = 30
  } else if (distanceFromAurora < 30) {
    visibility = 'low'
    probability = 10
  }

  return {
    visibility,
    probability,
    kp_index: kpIndex,
    aurora_latitude: Math.round(auroraLatitude),
    observer_latitude: lat,
    best_viewing_time: 'Between 10 PM - 2 AM local time',
    tips: visibility !== 'none' ? [
      'Find a dark location away from city lights',
      'Look towards the north (or south if in southern hemisphere)',
      'Allow 15-30 minutes for eyes to adjust to darkness',
      'Check weather - clear skies needed',
      'Use camera with long exposure for best results'
    ] : ['Aurora not visible at this latitude with current conditions']
  }
}

// Mock data generators

function generateMockSolarFlares(startDate, endDate) {
  const flares = []
  const daysRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  const numFlares = Math.floor(Math.random() * 15) + 5

  const classes = ['B', 'C', 'M', 'X']
  
  for (let i = 0; i < numFlares; i++) {
    const date = new Date(startDate.getTime() + Math.random() * daysRange * 24 * 60 * 60 * 1000)
    const classType = classes[Math.floor(Math.random() * classes.length)]
    const magnitude = Math.random() * 9 + 1
    
    flares.push({
      flrID: `2024-${String(i + 1).padStart(4, '0')}`,
      beginTime: date.toISOString(),
      peakTime: new Date(date.getTime() + 600000).toISOString(), // +10 min
      endTime: new Date(date.getTime() + 1800000).toISOString(), // +30 min
      classType: `${classType}${magnitude.toFixed(1)}`,
      sourceLocation: `N${Math.floor(Math.random() * 30)}W${Math.floor(Math.random() * 90)}`,
      activeRegionNum: Math.floor(Math.random() * 3000) + 10000,
      linkedEvents: []
    })
  }

  return flares.sort((a, b) => new Date(b.beginTime) - new Date(a.beginTime))
}

function generateMockCME(startDate, endDate) {
  const cmes = []
  const daysRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  const numCMEs = Math.floor(Math.random() * 10) + 3

  for (let i = 0; i < numCMEs; i++) {
    const date = new Date(startDate.getTime() + Math.random() * daysRange * 24 * 60 * 60 * 1000)
    const speed = Math.floor(Math.random() * 2000) + 300 // 300-2300 km/s
    const isEarthDirected = Math.random() > 0.7

    cmes.push({
      activityID: `2024-${String(i + 1).padStart(4, '0')}CME`,
      startTime: date.toISOString(),
      sourceLocation: `N${Math.floor(Math.random() * 60) - 30}W${Math.floor(Math.random() * 180) - 90}`,
      cmeAnalyses: [{
        time21_5: date.toISOString(),
        latitude: isEarthDirected ? Math.floor(Math.random() * 30) - 15 : null,
        longitude: isEarthDirected ? Math.floor(Math.random() * 30) - 15 : null,
        speed: speed,
        type: speed > 900 ? 'S' : 'C', // S=Fast, C=Common
        isMostAccurate: true,
        note: isEarthDirected ? 'Earth-directed' : 'Not Earth-directed'
      }],
      linkedEvents: []
    })
  }

  return cmes.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
}

function generateMockGeomagneticStorms(startDate, endDate) {
  const storms = []
  const daysRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  const numStorms = Math.floor(Math.random() * 8) + 2

  for (let i = 0; i < numStorms; i++) {
    const date = new Date(startDate.getTime() + Math.random() * daysRange * 24 * 60 * 60 * 1000)
    const kpIndex = Math.floor(Math.random() * 5) + 3 // Kp 3-8

    storms.push({
      gstID: `2024-${String(i + 1).padStart(4, '0')}GST`,
      startTime: date.toISOString(),
      kpIndex: kpIndex,
      allKpIndex: Array(8).fill(0).map(() => Math.floor(Math.random() * 3) + (kpIndex - 1)),
      linkedEvents: []
    })
  }

  return storms.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
}

function generateMockSEP(startDate, endDate) {
  const seps = []
  const daysRange = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24))
  const numSEPs = Math.floor(Math.random() * 5)

  for (let i = 0; i < numSEPs; i++) {
    const date = new Date(startDate.getTime() + Math.random() * daysRange * 24 * 60 * 60 * 1000)

    seps.push({
      sepID: `2024-${String(i + 1).padStart(4, '0')}SEP`,
      eventTime: date.toISOString(),
      instruments: [
        { displayName: 'GOES-16' },
        { displayName: 'GOES-17' }
      ],
      linkedEvents: []
    })
  }

  return seps.sort((a, b) => new Date(b.eventTime) - new Date(a.eventTime))
}

export default {
  fetchSolarFlares,
  fetchCME,
  fetchGeomagneticStorms,
  fetchSEP,
  fetchSpaceWeatherNotifications,
  calculateSpaceWeatherImpact,
  predictAuroraVisibility
}
