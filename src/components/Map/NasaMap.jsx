import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { MapContainer, TileLayer, useMap, Circle, Popup, Marker, Polyline } from 'react-leaflet'
import { gibsTileUrl, GIBS_LAYERS } from '../../lib/nasa/constants'
import { fetchCurrentWeather, fetchWindGrid, fetchAirPollution, getWeatherAlertLevel } from '../../lib/nasa/weather'
import ErrorBoundary from '../ErrorBoundary'
import { 
  PrecipitationLayer, 
  TemperatureLayer, 
  CloudLayer, 
  WindLayer, 
  PressureLayer,
  WeatherLayerControls,
  WeatherLegend
} from './WeatherLayers'

function MapEvents({ onMoved }) {
  const map = useMap()
  useEffect(() => {
    const handler = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      const b = map.getBounds()
      const bounds = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()] // [minX,minY,maxX,maxY]
      onMoved?.({ center, zoom, bounds })
    }
    handler()
    map.on('moveend', handler)
    return () => map.off('moveend', handler)
  }, [map, onMoved])
  return null
}

// Component to fly to a location when center/zoom changes
function FlyToLocation({ center, zoom }) {
  const map = useMap()
  const prevCenter = useRef(center)
  const prevZoom = useRef(zoom)

  useEffect(() => {
    // Only fly if center or zoom actually changed
    const centerChanged = prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1]
    const zoomChanged = prevZoom.current !== zoom

    if (centerChanged || zoomChanged) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      })
      prevCenter.current = center
      prevZoom.current = zoom
    }
  }, [map, center, zoom])

  return null
}

// Weather and wind overlay - only shown when zoomed in
function WeatherOverlay({ center, zoom, bounds }) {
  const [weatherData, setWeatherData] = useState(null)
  const [windGrid, setWindGrid] = useState([])
  const [airQuality, setAirQuality] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Stabilize bounds to prevent infinite re-renders
  const boundsKey = bounds ? bounds.join(',') : ''
  
  const fetchWeatherData = useCallback(async () => {
    if (zoom < 10) {
      setWeatherData(null)
      setWindGrid([])
      setAirQuality(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      // Fetch current weather for center point
      const weather = await fetchCurrentWeather(center[0], center[1])
      setWeatherData(weather)

      // Fetch air quality
      try {
        const air = await fetchAirPollution(center[0], center[1])
        setAirQuality(air)
      } catch (err) {
        console.warn('Air quality data unavailable:', err)
      }

      // Fetch wind grid when zoomed in more (zoom >= 11)
      if (zoom >= 11 && bounds) {
        try {
          const windData = await fetchWindGrid(bounds, 4)
          setWindGrid(windData)
        } catch (err) {
          console.warn('Wind grid data unavailable:', err)
          setWindGrid([])
        }
      } else {
        setWindGrid([])
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      setError(error.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }, [center[0], center[1], zoom, boundsKey])

  useEffect(() => {
    fetchWeatherData()
    
    // Refresh every 5 minutes (only if zoom >= 10)
    if (zoom >= 10) {
      const interval = setInterval(fetchWeatherData, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [fetchWeatherData, zoom])

  // Show loading indicator
  if (zoom >= 10 && loading && !weatherData) {
    return (
      <Circle
        center={center}
        radius={500}
        pathOptions={{ color: 'blue', fillColor: 'lightblue', fillOpacity: 0.3 }}
      >
        <Popup>
          <div className="text-sm text-center">
            <div className="animate-pulse">🌤️ Loading weather data...</div>
          </div>
        </Popup>
      </Circle>
    )
  }

  if (zoom < 10 || !weatherData) return null

  const alertLevel = getWeatherAlertLevel(weatherData)

  return (
    <>
      {/* Weather info marker */}
      <Marker position={center}>
        <Popup maxWidth={300}>
          <div className="text-sm">
            {/* Location header */}
            <div className="font-bold text-lg mb-2 border-b pb-2">
              {weatherData.icon} {weatherData.location}, {weatherData.country}
            </div>

            {/* Weather alert */}
            {alertLevel.level !== 'safe' && (
              <div className={`mb-2 p-2 rounded ${
                alertLevel.level === 'danger' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                <strong>{alertLevel.icon} {alertLevel.message}</strong>
              </div>
            )}

            {/* Main conditions */}
            <div className="mb-2">
              <div className="text-base font-semibold">{weatherData.conditions}</div>
              <div className="text-xs text-gray-600 capitalize">{weatherData.description}</div>
            </div>

            {/* Temperature */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span>🌡️ Temperature:</span>
                <strong className="text-lg">{weatherData.temp}°C</strong>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Feels like: {weatherData.feelsLike}°C</span>
                <span>Min/Max: {weatherData.tempMin}°/{weatherData.tempMax}°C</span>
              </div>
            </div>

            {/* Wind */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span>💨 Wind:</span>
                <strong>{weatherData.windSpeed} km/h</strong>
              </div>
              <div className="text-xs text-gray-600">
                Direction: {weatherData.windDirection}° ({getWindDirection(weatherData.windDirection)})
                {weatherData.windGust && ` • Gusts: ${weatherData.windGust} km/h`}
              </div>
            </div>

            {/* Other conditions */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>💧 Humidity: <strong>{weatherData.humidity}%</strong></div>
              <div>🔽 Pressure: <strong>{weatherData.pressure} hPa</strong></div>
              <div>☁️ Clouds: <strong>{weatherData.cloudiness}%</strong></div>
              {weatherData.visibility && (
                <div>👁️ Visibility: <strong>{weatherData.visibility} km</strong></div>
              )}
            </div>

            {/* Air quality */}
            {airQuality && (
              <div className="border-t pt-2 mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span>🏭 Air Quality:</span>
                  <span className={`font-bold ${
                    airQuality.aqi <= 2 ? 'text-green-600' : 
                    airQuality.aqi === 3 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {airQuality.aqiLabel}
                  </span>
                </div>
                <div className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                  <div>PM2.5: {airQuality.pm2_5.toFixed(1)} μg/m³</div>
                  <div>PM10: {airQuality.pm10.toFixed(1)} μg/m³</div>
                  <div>NO₂: {airQuality.no2.toFixed(1)} μg/m³</div>
                  <div>O₃: {airQuality.o3.toFixed(1)} μg/m³</div>
                </div>
              </div>
            )}

            {/* Sun times */}
            <div className="border-t pt-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>🌅 Sunrise: {weatherData.sunrise.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span>🌇 Sunset: {weatherData.sunset.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500 mt-2 text-center">
              Updated: {weatherData.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </Popup>
      </Marker>

      {/* Weather zone circle */}
      <Circle
        center={center}
        radius={zoom >= 12 ? 1000 : 2000}
        pathOptions={{
          color: alertLevel.level === 'danger' ? '#ef4444' : 
                 alertLevel.level === 'warning' ? '#f59e0b' : '#3b82f6',
          fillColor: alertLevel.level === 'danger' ? '#ef4444' : 
                     alertLevel.level === 'warning' ? '#f59e0b' : '#3b82f6',
          fillOpacity: 0.1,
          weight: 2
        }}
      />

      {/* Wind arrows grid */}
      {windGrid.length > 0 && windGrid.map((point, idx) => (
        <WindArrow
          key={idx}
          position={[point.lat, point.lon]}
          speed={point.speed}
          direction={point.direction}
          zoom={zoom}
        />
      ))}

      {/* Loading indicator */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          🌐 Loading real-time weather data...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          zIndex: 2000,
          background: 'rgba(239, 68, 68, 0.9)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '250px'
        }}>
          ⚠️ Weather data error: {error}
          <div className="text-xs mt-1">Check your OpenWeatherMap API key</div>
        </div>
      )}
    </>
  )
}

// Wind arrow component
function WindArrow({ position, speed, direction, zoom }) {
  if (!speed || speed < 1) return null

  // Calculate arrow end point based on wind direction
  const arrowLength = zoom >= 13 ? 0.008 : 0.015
  const radians = ((direction - 90) * Math.PI) / 180 // Adjust for north-up orientation
  const endLat = position[0] + Math.sin(radians) * arrowLength
  const endLon = position[1] + Math.cos(radians) * arrowLength

  // Color based on wind speed
  const color = speed > 50 ? '#ef4444' : // Red for strong winds
                speed > 30 ? '#f59e0b' : // Orange for moderate winds
                speed > 15 ? '#3b82f6' : // Blue for light winds
                '#94a3b8' // Gray for very light winds

  const weight = speed > 30 ? 3 : 2

  return (
    <>
      {/* Wind line */}
      <Polyline
        positions={[position, [endLat, endLon]]}
        pathOptions={{
          color,
          weight,
          opacity: 0.8
        }}
      />
      {/* Arrow head (small circle) */}
      <Circle
        center={[endLat, endLon]}
        radius={50}
        pathOptions={{
          color,
          fillColor: color,
          fillOpacity: 1,
          weight: 0
        }}
      />
    </>
  )
}

// Helper function to get wind direction name
function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export default function NasaMap({ center, zoom, dateISO, onMoved, selectedLayers }) {
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [currentBounds, setCurrentBounds] = useState(null)
  const [weatherLayers, setWeatherLayers] = useState({
    precipitation: false,
    temperature: false,
    clouds: false,
    wind: false,
    pressure: false
  })
  
  const baseUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

  // Determine which layers to show based on zoom level
  const showWeather = currentZoom >= 10
  const showWeatherLayers = currentZoom >= 8

  const handleMapMoved = (data) => {
    setCurrentZoom(data.zoom)
    setCurrentBounds(data.bounds)
    onMoved?.(data)
  }

  const toggleWeatherLayer = (layerId) => {
    setWeatherLayers(prev => ({
      ...prev,
      [layerId]: !prev[layerId]
    }))
  }

  // Get the first active weather layer for legend
  const activeWeatherLayer = Object.keys(weatherLayers).find(key => weatherLayers[key])

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      className="h-full w-full rounded-b-xl" 
      zoomControl={true}
      style={{ background: '#0a0e27' }}
    >
      {/* Base map layer */}
      <TileLayer url={baseUrl} attribution={attribution} />

      {/* NASA GIBS Satellite Layers */}
      {selectedLayers.trueColor && (
        <TileLayer
          url={gibsTileUrl(GIBS_LAYERS.TRUE_COLOR.id, 'latest')}
          opacity={currentZoom >= 8 ? 0.75 : 0.5}
          tileSize={256}
          zIndex={300}
        />
      )}

      {selectedLayers.firesNight && (
        <TileLayer
          url={gibsTileUrl(GIBS_LAYERS.FIRES_NIGHT.id, dateISO)}
          opacity={currentZoom >= 8 ? 0.9 : 0.6}
          tileSize={256}
          zIndex={400}
        />
      )}

      {selectedLayers.airAerosol && (
        <TileLayer
          url={gibsTileUrl(GIBS_LAYERS.AEROSOL_OPTICAL_DEPTH.id, dateISO)}
          opacity={currentZoom >= 8 ? 0.7 : 0.5}
          tileSize={256}
          zIndex={350}
        />
      )}

      {/* OpenWeatherMap Real-Time Layers */}
      {showWeatherLayers && (
        <>
          {weatherLayers.precipitation && <PrecipitationLayer />}
          {weatherLayers.temperature && <TemperatureLayer />}
          {weatherLayers.clouds && <CloudLayer />}
          {weatherLayers.wind && <WindLayer />}
          {weatherLayers.pressure && <PressureLayer />}
        </>
      )}

      {/* Real-time weather overlay with wind arrows - only shown when zoomed in */}
      {showWeather && (
        <ErrorBoundary fallbackMessage="Weather data temporarily unavailable. The map will continue to function.">
          <WeatherOverlay 
            center={center} 
            zoom={currentZoom} 
            bounds={currentBounds}
          />
        </ErrorBoundary>
      )}

      {/* Fly to location when center/zoom changes */}
      <FlyToLocation center={center} zoom={zoom} />

      {/* Map event handlers */}
      <MapEvents onMoved={handleMapMoved} />

      {/* Weather layer controls */}
      {showWeatherLayers && (
        <WeatherLayerControls 
          layers={weatherLayers}
          onToggle={toggleWeatherLayer}
        />
      )}

      {/* Weather legend */}
      {activeWeatherLayer && <WeatherLegend activeLayer={activeWeatherLayer} />}

      {/* Zoom level indicator */}
      <div 
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 1000,
          background: 'rgba(10, 14, 39, 0.8)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        🔍 Zoom: {currentZoom} {showWeather && '• 🌤️ Real-Time Weather'}
      </div>
    </MapContainer>
  )
}