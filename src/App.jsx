import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import StarfieldCanvas from './components/Background/StarfieldCanvas.jsx'
import CityParallax from './components/Background/CityParallax.jsx'
import Header from './components/Header.jsx'
import NasaMap from './components/Map/NasaMap.jsx'
import ClimatePanel from './components/Panels/ClimatePanel.jsx'
import EventsPanel from './components/Panels/EventsPanel.jsx'
import WaterFloodPanel from './components/Panels/WaterFloodPanel.jsx'
import MobilityPanel from './components/Panels/MobilityPanel.jsx'
import ResiliencePanel from './components/Panels/ResiliencePanel.jsx'
import ScenarioBuilderPanel from './components/Panels/ScenarioBuilderPanel.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { debounce } from './lib/utils/debounce.js'

export default function App() {
  const [center, setCenter] = useState([5.6037, -0.1870]) // Accra default
  const [zoom, setZoom] = useState(8)
  const [dateISO, setDateISO] = useState(() => new Date().toISOString().slice(0, 10))
  const [bbox, setBbox] = useState(null)
  const [cityName, setCityName] = useState('Accra, Ghana')
  const [showClimate, setShowClimate] = useState(true)
  const [showEvents, setShowEvents] = useState(true)
  const [showWaterFlood, setShowWaterFlood] = useState(true)
  const [showMobility, setShowMobility] = useState(false)
  const [showResilience, setShowResilience] = useState(true)
  const [showScenarios, setShowScenarios] = useState(false)
  const [selectedLayers, setSelectedLayers] = useState({
    trueColor: true,
    firesNight: true,
    airAerosol: false
  })
  
  // Data for resilience scoring
  const [weatherData, setWeatherData] = useState(null)
  const [disastersData, setDisastersData] = useState([])
  const [climateData, setClimateData] = useState(null)
  const [mobilityData, setMobilityData] = useState(null)
  const [airQualityData, setAirQualityData] = useState(null)

  // Debounce map movements to prevent excessive API calls
  const onMapMoved = useCallback(
    debounce(({ center, zoom, bounds }) => {
      setCenter([center.lat, center.lng])
      setZoom(zoom)
      setBbox(bounds)
    }, 500), // 500ms delay
    []
  )
  
  // Handle city geocode with name
  const handleGeocode = useCallback((lat, lon, name = null) => {
    setCenter([lat, lon])
    setZoom(11)
    if (name) setCityName(name)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background NASA vibe */}
      <StarfieldCanvas />
      <CityParallax />

      {/* Foreground content */}
      <div className="relative z-10">
        <Header
          dateISO={dateISO}
          onDateChange={setDateISO}
          onGeocode={handleGeocode}
          cityName={cityName}
          showClimate={showClimate}
          setShowClimate={setShowClimate}
          showEvents={showEvents}
          setShowEvents={setShowEvents}
          showWaterFlood={showWaterFlood}
          setShowWaterFlood={setShowWaterFlood}
          showMobility={showMobility}
          setShowMobility={setShowMobility}
          showResilience={showResilience}
          setShowResilience={setShowResilience}
          showScenarios={showScenarios}
          setShowScenarios={setShowScenarios}
        />

        <main className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">
          <section className="xl:col-span-2">
            <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft shadow-glow">
              <div className="p-3 flex flex-wrap items-center gap-4 border-b border-white/10">
                <div className="text-sm text-white/80">NASA GIBS Layers</div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-nasa-blue" checked={selectedLayers.trueColor} onChange={e => setSelectedLayers(s => ({ ...s, trueColor: e.target.checked }))} />
                  True Color (MODIS)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-nasa-blue" checked={selectedLayers.firesNight} onChange={e => setSelectedLayers(s => ({ ...s, firesNight: e.target.checked }))} />
                  Thermal Anomalies (VIIRS Night)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-nasa-blue" checked={selectedLayers.airAerosol} onChange={e => setSelectedLayers(s => ({ ...s, airAerosol: e.target.checked }))} />
                  Aerosol Optical Depth (MODIS)
                </label>
                <div className="ml-auto text-xs text-white/60">Date affects daily layers</div>
              </div>
              <div className="h-[68vh]">
                <NasaMap
                  center={center}
                  zoom={zoom}
                  dateISO={dateISO}
                  onMoved={onMapMoved}
                  selectedLayers={selectedLayers}
                />
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            {showResilience && (
              <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft p-4 shadow-glow">
                <ErrorBoundary fallbackMessage="Resilience score temporarily unavailable.">
                  <ResiliencePanel 
                    weather={weatherData}
                    disasters={disastersData}
                    climate={climateData}
                    mobility={mobilityData}
                    airQuality={airQualityData}
                    location={center}
                    cityName={cityName}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showScenarios && (
              <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft p-4 shadow-glow max-h-[80vh] overflow-y-auto">
                <ErrorBoundary fallbackMessage="Scenario builder temporarily unavailable.">
                  <ScenarioBuilderPanel 
                    location={center}
                    disasters={disastersData}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showMobility && (
              <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft shadow-glow h-[68vh] overflow-hidden">
                <ErrorBoundary fallbackMessage="Mobility data temporarily unavailable. Please try refreshing.">
                  <MobilityPanel 
                    location={center}
                    bbox={bbox}
                    visible={showMobility}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showWaterFlood && (
              <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft p-4 shadow-glow">
                <h2 className="text-lg font-semibold mb-2">Water Resources & Flood Risk</h2>
                <p className="text-xs text-white/70 mb-3">HyFuse scores, flood masks & alerts</p>
                <WaterFloodPanel 
                  bbox={bbox}
                  center={center}
                  onLayerChange={(layer) => {
                    // Handle layer updates for flood masks
                    console.log('Layer update:', layer)
                  }}
                />
              </div>
            )}
            {showClimate && (
              <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft p-4 shadow-glow">
                <h2 className="text-lg font-semibold mb-2">City Climate (NASA POWER)</h2>
                <p className="text-xs text-white/70 mb-3">Monthly normals at map center</p>
                <ClimatePanel lat={center[0]} lon={center[1]} />
              </div>
            )}
            {showEvents && (
              <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft p-4 shadow-glow">
                <h2 className="text-lg font-semibold mb-2">Natural Events (NASA EONET)</h2>
                <p className="text-xs text-white/70 mb-3">Open events in current map view</p>
                <EventsPanel bbox={bbox} />
              </div>
            )}
            <div className="rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft p-4 shadow-glow">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-sm text-white/80">
                This demo overlays NASA Earth observation data to inform city planning and resilience.
                Real-time weather, traffic, and disaster monitoring. NASA GIBS, EONET, POWER, and OpenWeatherMap used live.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}