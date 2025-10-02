/**
 * Weather Overlay Layers
 * Precipitation radar, temperature heatmap, and wind visualization
 */

import React from 'react'
import { TileLayer, useMap } from 'react-leaflet'
import { getWeatherTileUrl } from '../../lib/nasa/weather'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'DEMO_KEY'

/**
 * Precipitation radar overlay
 * Shows rain and snow in real-time
 */
export function PrecipitationLayer({ opacity = 0.6 }) {
  return (
    <TileLayer
      url={`https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
      opacity={opacity}
      attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
      zIndex={500}
    />
  )
}

/**
 * Temperature heatmap overlay
 * Shows temperature distribution across the map
 */
export function TemperatureLayer({ opacity = 0.5 }) {
  return (
    <TileLayer
      url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
      opacity={opacity}
      attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
      zIndex={490}
    />
  )
}

/**
 * Cloud coverage overlay
 * Shows cloud cover percentage
 */
export function CloudLayer({ opacity = 0.4 }) {
  return (
    <TileLayer
      url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
      opacity={opacity}
      attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
      zIndex={480}
    />
  )
}

/**
 * Wind speed overlay
 * Shows wind speed distribution
 */
export function WindLayer({ opacity = 0.5 }) {
  return (
    <TileLayer
      url={`https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
      opacity={opacity}
      attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
      zIndex={470}
    />
  )
}

/**
 * Pressure overlay
 * Shows atmospheric pressure
 */
export function PressureLayer({ opacity = 0.4 }) {
  return (
    <TileLayer
      url={`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
      opacity={opacity}
      attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
      zIndex={460}
    />
  )
}

/**
 * Weather layer controls component
 * Toggle different weather layers on/off
 */
export function WeatherLayerControls({ layers, onToggle }) {
  const layerOptions = [
    { id: 'precipitation', label: 'Precipitation', icon: '🌧️', component: PrecipitationLayer },
    { id: 'temperature', label: 'Temperature', icon: '🌡️', component: TemperatureLayer },
    { id: 'clouds', label: 'Clouds', icon: '☁️', component: CloudLayer },
    { id: 'wind', label: 'Wind Speed', icon: '💨', component: WindLayer },
    { id: 'pressure', label: 'Pressure', icon: '🔽', component: PressureLayer }
  ]

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '10px',
      zIndex: 1000,
      background: 'rgba(10, 14, 39, 0.95)',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minWidth: '180px'
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '8px',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        🌤️ Weather Layers
      </div>
      
      {layerOptions.map(layer => (
        <label
          key={layer.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 8px',
            marginBottom: '4px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '12px',
            color: 'white',
            transition: 'background-color 0.2s',
            backgroundColor: layers[layer.id] ? 'rgba(59, 130, 246, 0.3)' : 'transparent'
          }}
          onMouseEnter={(e) => {
            if (!layers[layer.id]) {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            }
          }}
          onMouseLeave={(e) => {
            if (!layers[layer.id]) {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          <input
            type="checkbox"
            checked={layers[layer.id] || false}
            onChange={() => onToggle(layer.id)}
            style={{
              marginRight: '8px',
              cursor: 'pointer',
              accentColor: '#3b82f6'
            }}
          />
          <span>{layer.icon} {layer.label}</span>
        </label>
      ))}

      <div style={{
        marginTop: '8px',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center'
      }}>
        Real-time data from OpenWeatherMap
      </div>
    </div>
  )
}

/**
 * Legend component for weather overlays
 */
export function WeatherLegend({ activeLayer }) {
  const legends = {
    precipitation: {
      title: 'Precipitation (mm/h)',
      colors: ['#0000', '#6BB6FF', '#00B8FF', '#00FFDE', '#00FF6B', '#FFFF00', '#FFB800', '#FF0000', '#8B0000'],
      values: ['0', '0.1', '0.5', '1', '2', '5', '10', '20', '50+']
    },
    temperature: {
      title: 'Temperature (°C)',
      colors: ['#0000FF', '#00BFFF', '#00FF00', '#FFFF00', '#FFA500', '#FF0000', '#8B0000'],
      values: ['-40', '-20', '0', '10', '20', '30', '40+']
    },
    wind: {
      title: 'Wind Speed (km/h)',
      colors: ['#0000', '#64B5F6', '#42A5F5', '#2196F3', '#1976D2', '#0D47A1'],
      values: ['0', '10', '20', '30', '50', '75+']
    },
    clouds: {
      title: 'Cloud Coverage (%)',
      colors: ['#0000', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#424242'],
      values: ['0', '20', '40', '60', '80', '100']
    },
    pressure: {
      title: 'Pressure (hPa)',
      colors: ['#0000FF', '#00BFFF', '#E0E0E0', '#FFB366', '#FF0000'],
      values: ['960', '980', '1000', '1020', '1040+']
    }
  }

  if (!activeLayer || !legends[activeLayer]) return null

  const legend = legends[activeLayer]

  return (
    <div style={{
      position: 'absolute',
      bottom: '50px',
      left: '10px',
      zIndex: 1000,
      background: 'rgba(10, 14, 39, 0.95)',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      fontSize: '11px',
      color: 'white',
      minWidth: '180px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {legend.title}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
        {legend.colors.map((color, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: '16px',
              backgroundColor: color,
              border: color === '#0000' ? '1px solid rgba(255,255,255,0.2)' : 'none'
            }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', opacity: 0.8 }}>
        <span>{legend.values[0]}</span>
        <span>{legend.values[Math.floor(legend.values.length / 2)]}</span>
        <span>{legend.values[legend.values.length - 1]}</span>
      </div>
    </div>
  )
}

export default {
  PrecipitationLayer,
  TemperatureLayer,
  CloudLayer,
  WindLayer,
  PressureLayer,
  WeatherLayerControls,
  WeatherLegend
}
