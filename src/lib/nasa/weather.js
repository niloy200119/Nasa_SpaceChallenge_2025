/**
 * OpenWeatherMap API Integration
 * Real-time weather, wind, precipitation, and temperature data
 * API Docs: https://openweathermap.org/api
 */

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'DEMO_KEY'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const TILE_URL = 'https://tile.openweathermap.org/map'

/**
 * Fetch current weather for a location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} Weather data with temp, wind, humidity, pressure
 */
export async function fetchCurrentWeather(lat, lon) {
  try {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      location: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      windGust: data.wind.gust ? Math.round(data.wind.gust * 3.6) : null,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : null, // Convert to km
      cloudiness: data.clouds.all,
      conditions: data.weather[0].main,
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].main, data.weather[0].id),
      iconCode: data.weather[0].icon,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(data.dt * 1000),
      timezone: data.timezone,
      raw: data
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    throw error
  }
}

/**
 * Fetch 5-day weather forecast
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} Array of forecast data points
 */
export async function fetchWeatherForecast(lat, lon) {
  try {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      city: data.city.name,
      country: data.city.country,
      forecasts: data.list.map(item => ({
        timestamp: new Date(item.dt * 1000),
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: Math.round(item.wind.speed * 3.6),
        windDirection: item.wind.deg,
        windGust: item.wind.gust ? Math.round(item.wind.gust * 3.6) : null,
        cloudiness: item.clouds.all,
        precipitation: item.rain ? item.rain['3h'] : 0,
        snow: item.snow ? item.snow['3h'] : 0,
        conditions: item.weather[0].main,
        description: item.weather[0].description,
        icon: getWeatherIcon(item.weather[0].main, item.weather[0].id),
        pop: Math.round(item.pop * 100) // Probability of precipitation
      }))
    }
  } catch (error) {
    console.error('Error fetching forecast:', error)
    throw error
  }
}

/**
 * Fetch wind data for a grid area
 * @param {Array} bbox - [minLon, minLat, maxLon, maxLat]
 * @param {number} gridSize - Number of points per axis
 * @returns {Promise} Array of wind data points
 */
export async function fetchWindGrid(bbox, gridSize = 5) {
  const [minLon, minLat, maxLon, maxLat] = bbox
  const lonStep = (maxLon - minLon) / (gridSize - 1)
  const latStep = (maxLat - minLat) / (gridSize - 1)
  
  const promises = []
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const lat = minLat + j * latStep
      const lon = minLon + i * lonStep
      promises.push(
        fetchCurrentWeather(lat, lon)
          .then(data => ({
            lat,
            lon,
            speed: data.windSpeed,
            direction: data.windDirection,
            gust: data.windGust
          }))
          .catch(err => null)
      )
    }
  }
  
  const results = await Promise.all(promises)
  return results.filter(r => r !== null)
}

/**
 * Fetch air pollution data
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} Air quality index and pollutant levels
 */
export async function fetchAirPollution(lat, lon) {
  try {
    const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Air pollution API error: ${response.status}`)
    }
    
    const data = await response.json()
    const current = data.list[0]
    
    return {
      aqi: current.main.aqi, // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
      aqiLabel: ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][current.main.aqi - 1],
      co: current.components.co, // Carbon monoxide (μg/m3)
      no: current.components.no, // Nitrogen monoxide (μg/m3)
      no2: current.components.no2, // Nitrogen dioxide (μg/m3)
      o3: current.components.o3, // Ozone (μg/m3)
      so2: current.components.so2, // Sulphur dioxide (μg/m3)
      pm2_5: current.components.pm2_5, // PM2.5 (μg/m3)
      pm10: current.components.pm10, // PM10 (μg/m3)
      nh3: current.components.nh3, // Ammonia (μg/m3)
      timestamp: new Date(current.dt * 1000)
    }
  } catch (error) {
    console.error('Error fetching air pollution:', error)
    throw error
  }
}

/**
 * Fetch UV index
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} UV index data
 */
export async function fetchUVIndex(lat, lon) {
  try {
    // Note: UV Index endpoint is part of OneCall API (requires subscription)
    // Using current weather as fallback
    const weather = await fetchCurrentWeather(lat, lon)
    return {
      uvi: null, // Not available in basic API
      uvLevel: 'Unknown',
      message: 'UV Index requires OneCall API subscription'
    }
  } catch (error) {
    console.error('Error fetching UV index:', error)
    throw error
  }
}

/**
 * Get weather map tile URL for overlays
 * @param {string} layer - Layer type (clouds_new, precipitation_new, temp_new, wind_new)
 * @param {number} z - Zoom level
 * @param {number} x - Tile X
 * @param {number} y - Tile Y
 * @returns {string} Tile URL
 */
export function getWeatherTileUrl(layer, z, x, y) {
  // Available layers:
  // - clouds_new (cloud coverage)
  // - precipitation_new (rain/snow)
  // - pressure_new (atmospheric pressure)
  // - wind_new (wind speed)
  // - temp_new (temperature)
  return `${TILE_URL}/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`
}

/**
 * Get weather icon based on condition
 * @param {string} main - Main weather condition
 * @param {number} id - Weather condition ID
 * @returns {string} Emoji icon
 */
function getWeatherIcon(main, id) {
  // Thunderstorm
  if (id >= 200 && id < 300) return '⛈️'
  // Drizzle
  if (id >= 300 && id < 400) return '🌦️'
  // Rain
  if (id >= 500 && id < 600) {
    if (id === 511) return '🌨️' // Freezing rain
    return '🌧️'
  }
  // Snow
  if (id >= 600 && id < 700) return '🌨️'
  // Atmosphere (mist, fog, etc)
  if (id >= 700 && id < 800) return '🌫️'
  // Clear
  if (id === 800) return '☀️'
  // Clouds
  if (id > 800) {
    if (id === 801) return '🌤️' // Few clouds
    if (id === 802) return '⛅' // Scattered clouds
    return '☁️' // Overcast
  }
  
  return '🌍'
}

/**
 * Calculate wind chill temperature
 * @param {number} temp - Temperature in Celsius
 * @param {number} windSpeed - Wind speed in km/h
 * @returns {number} Wind chill temperature
 */
export function calculateWindChill(temp, windSpeed) {
  if (temp > 10 || windSpeed < 4.8) {
    return temp
  }
  
  // Wind Chill formula (metric)
  const windChill = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 
                    0.3965 * temp * Math.pow(windSpeed, 0.16)
  
  return Math.round(windChill)
}

/**
 * Calculate heat index (feels like in hot weather)
 * @param {number} temp - Temperature in Celsius
 * @param {number} humidity - Relative humidity percentage
 * @returns {number} Heat index temperature
 */
export function calculateHeatIndex(temp, humidity) {
  if (temp < 27) {
    return temp
  }
  
  // Convert to Fahrenheit for calculation
  const T = temp * 9/5 + 32
  const R = humidity
  
  let HI = -42.379 + 2.04901523 * T + 10.14333127 * R - 0.22475541 * T * R
  HI += -0.00683783 * T * T - 0.05481717 * R * R + 0.00122874 * T * T * R
  HI += 0.00085282 * T * R * R - 0.00000199 * T * T * R * R
  
  // Convert back to Celsius
  return Math.round((HI - 32) * 5/9)
}

/**
 * Get weather alert level
 * @param {Object} weather - Weather data
 * @returns {Object} Alert level and message
 */
export function getWeatherAlertLevel(weather) {
  const alerts = []
  
  // Extreme temperature
  if (weather.temp > 40) {
    alerts.push({ level: 'danger', message: 'Extreme heat warning', icon: '🔥' })
  } else if (weather.temp > 35) {
    alerts.push({ level: 'warning', message: 'High temperature advisory', icon: '🌡️' })
  } else if (weather.temp < -20) {
    alerts.push({ level: 'danger', message: 'Extreme cold warning', icon: '🥶' })
  } else if (weather.temp < -10) {
    alerts.push({ level: 'warning', message: 'Cold temperature advisory', icon: '❄️' })
  }
  
  // High winds
  if (weather.windSpeed > 75) {
    alerts.push({ level: 'danger', message: 'Hurricane-force winds', icon: '🌀' })
  } else if (weather.windSpeed > 50) {
    alerts.push({ level: 'warning', message: 'Strong wind warning', icon: '💨' })
  } else if (weather.windGust && weather.windGust > 60) {
    alerts.push({ level: 'warning', message: 'Wind gust advisory', icon: '🌪️' })
  }
  
  // Severe weather
  if (weather.conditions === 'Thunderstorm') {
    alerts.push({ level: 'warning', message: 'Thunderstorm alert', icon: '⚡' })
  } else if (weather.conditions === 'Tornado') {
    alerts.push({ level: 'danger', message: 'Tornado warning', icon: '🌪️' })
  } else if (weather.conditions === 'Snow' && weather.windSpeed > 30) {
    alerts.push({ level: 'warning', message: 'Blizzard conditions', icon: '🌨️' })
  }
  
  // Poor visibility
  if (weather.visibility && weather.visibility < 1) {
    alerts.push({ level: 'warning', message: 'Poor visibility', icon: '🌫️' })
  }
  
  if (alerts.length === 0) {
    return { level: 'safe', message: 'No weather alerts', icon: '✅' }
  }
  
  // Return highest severity alert
  const dangerAlert = alerts.find(a => a.level === 'danger')
  return dangerAlert || alerts[0]
}

export default {
  fetchCurrentWeather,
  fetchWeatherForecast,
  fetchWindGrid,
  fetchAirPollution,
  fetchUVIndex,
  getWeatherTileUrl,
  calculateWindChill,
  calculateHeatIndex,
  getWeatherAlertLevel
}
