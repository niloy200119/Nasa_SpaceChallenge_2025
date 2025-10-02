/**
 * HyFuse API Client
 * 
 * Client-side functions to interact with the HyFuse backend API.
 * These functions will connect to your FastAPI microservice once deployed.
 * 
 * For now, they return mock data for frontend development.
 */

// Configure your backend API URL here
const HYFUSE_API_BASE = import.meta.env.VITE_HYFUSE_API_URL || 'http://localhost:8000/api/v1'

/**
 * Fetch HyFuse scores for tiles within a bounding box
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @param {number} aggWindow - Aggregation window in days (7, 30, or 90)
 * @returns {Promise<Object>} GeoJSON FeatureCollection of HyFuse tiles
 */
export async function fetchHyFuseTiles(bbox, date = new Date().toISOString().slice(0, 10), aggWindow = 7) {
  if (!bbox || bbox.length !== 4) {
    throw new Error('Invalid bbox: must be [minLon, minLat, maxLon, maxLat]')
  }

  const bboxStr = bbox.join(',')
  const url = `${HYFUSE_API_BASE}/hyfuse?bbox=${bboxStr}&date=${date}&agg_window=${aggWindow}`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // })
    // if (!res.ok) throw new Error(`HyFuse API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA for development
    return generateMockHyFuseTiles(bbox, 5)
  } catch (error) {
    console.error('Failed to fetch HyFuse tiles:', error)
    throw error
  }
}

/**
 * Fetch detailed HyFuse data for a specific tile
 * @param {string} tileId - Tile identifier
 * @returns {Promise<Object>} HyFuse JSON object
 */
export async function fetchHyFuseTile(tileId) {
  const url = `${HYFUSE_API_BASE}/hyfuse/tile/${tileId}`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // })
    // if (!res.ok) throw new Error(`HyFuse tile API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA
    return generateMockHyFuseData(tileId)
  } catch (error) {
    console.error('Failed to fetch HyFuse tile:', error)
    throw error
  }
}

/**
 * Fetch available flood mask scenes for a bounding box
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {number} limit - Maximum number of scenes to return
 * @returns {Promise<Array>} Array of flood scene metadata
 */
export async function fetchFloodScenes(bbox, limit = 50) {
  const bboxStr = bbox.join(',')
  const url = `${HYFUSE_API_BASE}/flood_scenes?bbox=${bboxStr}&limit=${limit}`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // })
    // if (!res.ok) throw new Error(`Flood scenes API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA
    return generateMockFloodScenes(5)
  } catch (error) {
    console.error('Failed to fetch flood scenes:', error)
    throw error
  }
}

/**
 * Fetch flood mask data for a specific scene
 * @param {string} sceneId - Scene identifier
 * @param {string} format - 'geojson' or 'geotiff'
 * @returns {Promise<Object>} Flood mask data or signed URL
 */
export async function fetchFloodMask(sceneId, format = 'geojson') {
  const url = `${HYFUSE_API_BASE}/floodmask?scene_id=${sceneId}&format=${format}`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // })
    // if (!res.ok) throw new Error(`Flood mask API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA
    return generateMockFloodMask(sceneId, format)
  } catch (error) {
    console.error('Failed to fetch flood mask:', error)
    throw error
  }
}

/**
 * Request a field pack generation
 * @param {Object} aoi - GeoJSON geometry for area of interest
 * @param {string} email - Optional email for delivery
 * @param {string} type - 'brief' or 'full'
 * @returns {Promise<Object>} Job ID and status
 */
export async function requestFieldPack(aoi, email = null, type = 'full') {
  const url = `${HYFUSE_API_BASE}/fieldpack`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({ aoi, email, type })
    // })
    // if (!res.ok) throw new Error(`Field pack API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA
    return {
      job_id: `fp_${Date.now()}`,
      status: 'queued',
      message: 'Field pack generation started'
    }
  } catch (error) {
    console.error('Failed to request field pack:', error)
    throw error
  }
}

/**
 * Check field pack job status
 * @param {string} jobId - Job identifier
 * @returns {Promise<Object>} Job status and download URL if ready
 */
export async function checkFieldPackStatus(jobId) {
  const url = `${HYFUSE_API_BASE}/fieldpack/${jobId}`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   }
    // })
    // if (!res.ok) throw new Error(`Field pack status API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA - simulate completion after 3 seconds
    const timestamp = parseInt(jobId.split('_')[1])
    const elapsed = Date.now() - timestamp
    if (elapsed > 3000) {
      return {
        job_id: jobId,
        status: 'completed',
        download_url: `${HYFUSE_API_BASE}/downloads/${jobId}.zip`,
        created_at: new Date(timestamp).toISOString()
      }
    } else {
      return {
        job_id: jobId,
        status: 'processing',
        progress: Math.min(90, Math.floor((elapsed / 3000) * 100))
      }
    }
  } catch (error) {
    console.error('Failed to check field pack status:', error)
    throw error
  }
}

/**
 * Create an alert rule
 * @param {Object} aoi - GeoJSON geometry
 * @param {number} threshold - HyFuse threshold (0-100)
 * @param {string} channel - 'email' or 'webhook'
 * @param {string} contact - Email address or webhook URL
 * @returns {Promise<Object>} Created alert rule
 */
export async function createAlert(aoi, threshold, channel, contact) {
  const url = `${HYFUSE_API_BASE}/alerts`

  try {
    // TODO: Uncomment when backend is ready
    // const res = await fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${getAuthToken()}`
    //   },
    //   body: JSON.stringify({ aoi, threshold, channel, contact })
    // })
    // if (!res.ok) throw new Error(`Alerts API error: ${res.status}`)
    // return await res.json()

    // MOCK DATA
    return {
      alert_id: `alert_${Date.now()}`,
      aoi,
      threshold,
      channel,
      contact,
      created_at: new Date().toISOString(),
      active: true
    }
  } catch (error) {
    console.error('Failed to create alert:', error)
    throw error
  }
}

// ========== MOCK DATA GENERATORS ==========
// Remove these when connecting to real backend

function generateMockHyFuseTiles(bbox, count = 5) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const features = []

  for (let i = 0; i < count; i++) {
    const lon = minLon + Math.random() * (maxLon - minLon)
    const lat = minLat + Math.random() * (maxLat - minLat)
    const tileSize = 0.05

    features.push({
      type: 'Feature',
      id: `tile_${i}_${Date.now()}`,
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [lon, lat],
          [lon + tileSize, lat],
          [lon + tileSize, lat + tileSize],
          [lon, lat + tileSize],
          [lon, lat]
        ]]
      },
      properties: {
        tile_id: `tile_${i}_${Date.now()}`,
        hyfuse_score: Math.floor(Math.random() * 100),
        confidence: 0.7 + Math.random() * 0.3,
        timestamp: new Date().toISOString(),
        components: {
          recent_rain_mm: Math.random() * 100,
          soil_moisture_index: Math.random() * 0.5,
          grace_anomaly_mm: (Math.random() - 0.5) * 50,
          recent_inundation_count: Math.floor(Math.random() * 10)
        }
      }
    })
  }

  return {
    type: 'FeatureCollection',
    features
  }
}

function generateMockHyFuseData(tileId) {
  return {
    tile_id: tileId,
    hyfuse_score: Math.floor(Math.random() * 100),
    confidence: 0.7 + Math.random() * 0.3,
    timestamp: new Date().toISOString(),
    components: {
      recent_rain_mm: Math.random() * 100,
      soil_moisture_index: Math.random() * 0.5,
      grace_anomaly_mm: (Math.random() - 0.5) * 50,
      recent_inundation_count: Math.floor(Math.random() * 10)
    },
    z_scores: {
      rain: (Math.random() - 0.5) * 3,
      soil: (Math.random() - 0.5) * 3,
      grace: (Math.random() - 0.5) * 3,
      inundation: (Math.random() - 0.5) * 3
    },
    recommendations: [
      'Monitor drainage systems in low-lying areas',
      'Prepare flood barriers near critical infrastructure',
      'Review emergency response protocols'
    ]
  }
}

function generateMockFloodScenes(count = 5) {
  const scenes = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    scenes.push({
      scene_id: `scene_${i}_${now}`,
      scene_date: new Date(now - i * 86400000 * 7).toISOString().slice(0, 10),
      processing_date: new Date(now - i * 86400000 * 7 + 86400000).toISOString(),
      confidence: 0.7 + Math.random() * 0.3,
      extent_km2: Math.random() * 100
    })
  }

  return scenes
}

function generateMockFloodMask(sceneId, format) {
  if (format === 'geojson') {
    return {
      type: 'Feature',
      properties: {
        scene_id: sceneId,
        confidence: 0.85
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-0.2, 5.5],
          [-0.15, 5.5],
          [-0.15, 5.55],
          [-0.2, 5.55],
          [-0.2, 5.5]
        ]]
      }
    }
  } else {
    return {
      scene_id: sceneId,
      format: 'geotiff',
      download_url: `${HYFUSE_API_BASE}/downloads/flood_${sceneId}.tif`,
      expires_at: new Date(Date.now() + 3600000).toISOString()
    }
  }
}

// Helper function to get auth token (implement based on your auth system)
function getAuthToken() {
  // TODO: Implement token retrieval from your auth system
  return localStorage.getItem('auth_token') || ''
}
