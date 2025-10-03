import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import StarfieldCanvas from './components/Background/StarfieldCanvas.jsx'
import CityParallax from './components/Background/CityParallax.jsx'
import Header from './components/Header.jsx'
import NasaMap from './components/Map/NasaMap.jsx'
import MapInsights from './components/Map/MapInsights.jsx'
import ClimatePanel from './components/Panels/ClimatePanel.jsx'
import EventsPanel from './components/Panels/EventsPanel.jsx'
import WaterFloodPanel from './components/Panels/WaterFloodPanel.jsx'
import MobilityPanel from './components/Panels/MobilityPanel.jsx'
import ResiliencePanel from './components/Panels/ResiliencePanel.jsx'
import ScenarioBuilderPanel from './components/Panels/ScenarioBuilderPanel.jsx'
import AICrisisPanel from './components/Panels/AICrisisPanel.jsx'
import UrbanInfrastructurePanel from './components/Panels/UrbanInfrastructurePanel.jsx'
import EnvironmentalHealthPanel from './components/Panels/EnvironmentalHealthPanel.jsx'
import EnergyUtilitiesPanel from './components/Panels/EnergyUtilitiesPanel.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { debounce } from './lib/utils/debounce.js'
import { fetchCurrentWeather, fetchAirPollution } from './lib/nasa/weather.js'
import { fetchEonetEventsInBbox } from './lib/nasa/eonet.js'

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
  const [showAI, setShowAI] = useState(true)
  const [showInfrastructure, setShowInfrastructure] = useState(false)
  const [showEnvironment, setShowEnvironment] = useState(false)
  const [showEnergy, setShowEnergy] = useState(false)
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

  // Fetch real-time data for resilience and AI analysis
  useEffect(() => {
    if (!center || center.length !== 2) return

    const fetchData = async () => {
      console.log('🌍 Fetching data for:', cityName, 'at', center)
      try {
        // Fetch weather
        console.log('☁️ Fetching weather...')
        const weather = await fetchCurrentWeather(center[0], center[1])
        console.log('✅ Weather data:', weather)
        setWeatherData(weather)

        // Fetch air quality
        console.log('💨 Fetching air quality...')
        const airQuality = await fetchAirPollution(center[0], center[1])
        console.log('✅ Air quality data:', airQuality)
        setAirQualityData(airQuality)

        // Fetch disasters if bbox available
        if (bbox) {
          console.log('🔥 Fetching disasters...')
          const disasters = await fetchEonetEventsInBbox(bbox)
          console.log('✅ Disasters found:', disasters?.length || 0)
          setDisastersData(disasters)
        }
      } catch (error) {
        console.error('❌ Error fetching real-time data:', error)
      }
    }

    fetchData()
  }, [center, bbox, cityName])

  return (
    <div className="relative min-h-screen">
      {/* Background NASA vibe */}
      <StarfieldCanvas />
      <CityParallax />

      {/* Foreground content */}
      <div className="relative z-10 min-h-screen flex flex-col">
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
          showAI={showAI}
          setShowAI={setShowAI}
          showInfrastructure={showInfrastructure}
          setShowInfrastructure={setShowInfrastructure}
          showEnvironment={showEnvironment}
          setShowEnvironment={setShowEnvironment}
          showEnergy={showEnergy}
          setShowEnergy={setShowEnergy}
        />

        <main className="flex-1 p-2 md:p-4">
          {/* Modern 2-Column Layout: Map + Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 items-start">
            
            {/* LEFT COLUMN: Map Section - Takes full width on mobile, 2/3 on desktop */}
            <section className="lg:col-span-8 space-y-3 md:space-y-4">
              {/* Map Container - Fixed height on mobile, flexible on desktop */}
              <div className="lg:sticky lg:top-20 rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft shadow-glow overflow-hidden h-[50vh] md:h-[60vh] lg:h-[calc(100vh-6rem)] flex flex-col">
                {/* Layer Controls - Compact on mobile */}
                <div className="p-2 md:p-3 flex flex-wrap items-center gap-2 md:gap-4 border-b border-white/10 flex-shrink-0 bg-space-900/40">
                  <div className="text-xs md:text-sm text-white/80 font-medium">🛰️ NASA GIBS</div>
                  <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <input type="checkbox" className="accent-nasa-blue w-3 h-3 md:w-4 md:h-4" checked={selectedLayers.trueColor} onChange={e => setSelectedLayers(s => ({ ...s, trueColor: e.target.checked }))} />
                    <span className="hidden sm:inline">True Color</span>
                    <span className="sm:hidden">Color</span>
                  </label>
                  <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <input type="checkbox" className="accent-nasa-blue w-3 h-3 md:w-4 md:h-4" checked={selectedLayers.firesNight} onChange={e => setSelectedLayers(s => ({ ...s, firesNight: e.target.checked }))} />
                    <span className="hidden sm:inline">Thermal</span>
                    <span className="sm:hidden">🔥</span>
                  </label>
                  <label className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <input type="checkbox" className="accent-nasa-blue w-3 h-3 md:w-4 md:h-4" checked={selectedLayers.airAerosol} onChange={e => setSelectedLayers(s => ({ ...s, airAerosol: e.target.checked }))} />
                    <span className="hidden sm:inline">Aerosol</span>
                    <span className="sm:hidden">💨</span>
                  </label>
                </div>
                {/* Map - Full height with proper flex */}
                <div className="flex-1 min-h-0 relative">
                  <NasaMap
                    center={center}
                    zoom={zoom}
                    dateISO={dateISO}
                    onMoved={onMapMoved}
                    selectedLayers={selectedLayers}
                  />
                </div>
              </div>

              {/* Interactive Map Insights - Below the map, responsive cards */}
              <div className="lg:block">
                <ErrorBoundary fallbackMessage="Map insights temporarily unavailable.">
                  <MapInsights
                    weather={weatherData}
                    cityName={cityName}
                    location={center}
                    disasters={disastersData}
                  />
                </ErrorBoundary>
              </div>
            </section>

            {/* RIGHT COLUMN: Analytics Panels - Scrollable cards */}
            <aside className="lg:col-span-4 space-y-3 md:space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-2 scroll-smooth">
            {showAI && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300 max-h-[85vh] overflow-y-auto">
                <ErrorBoundary fallbackMessage="AI analysis temporarily unavailable.">
                  <AICrisisPanel 
                    disasters={disastersData}
                    weather={weatherData}
                    resilience={null}
                    cityName={cityName}
                    mobility={mobilityData}
                    airQuality={airQualityData}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showResilience && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300">
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
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300 max-h-[80vh] overflow-y-auto">
                <ErrorBoundary fallbackMessage="Scenario builder temporarily unavailable.">
                  <ScenarioBuilderPanel 
                    location={center}
                    disasters={disastersData}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showMobility && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg shadow-glow hover:shadow-xl transition-all duration-300 h-[65vh] overflow-hidden">
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
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-xl">💧</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Water Resources & Flood Risk</h2>
                    <p className="text-xs text-white/60">HyFuse scores, flood masks & alerts</p>
                  </div>
                </div>
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
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <span className="text-xl">☀️</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">City Climate</h2>
                    <p className="text-xs text-white/60">NASA POWER monthly normals</p>
                  </div>
                </div>
                <ClimatePanel lat={center[0]} lon={center[1]} />
              </div>
            )}
            {showEvents && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <span className="text-xl">🌋</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Natural Events</h2>
                    <p className="text-xs text-white/60">NASA EONET live tracking</p>
                  </div>
                </div>
                <EventsPanel bbox={bbox} />
              </div>
            )}
            {showInfrastructure && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg shadow-glow hover:shadow-xl transition-all duration-300 h-[65vh] overflow-hidden">
                <ErrorBoundary fallbackMessage="Urban infrastructure data temporarily unavailable.">
                  <UrbanInfrastructurePanel 
                    location={center}
                    bbox={bbox}
                    cityName={cityName}
                    visible={showInfrastructure}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showEnvironment && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg shadow-glow hover:shadow-xl transition-all duration-300 h-[65vh] overflow-hidden">
                <ErrorBoundary fallbackMessage="Environmental health data temporarily unavailable.">
                  <EnvironmentalHealthPanel 
                    location={center}
                    bbox={bbox}
                    cityName={cityName}
                    airQuality={airQualityData}
                    visible={showEnvironment}
                  />
                </ErrorBoundary>
              </div>
            )}
            {showEnergy && (
              <div className="glass-card rounded-2xl border border-white/10 bg-space-800/60 backdrop-blur-lg shadow-glow hover:shadow-xl transition-all duration-300 h-[65vh] overflow-hidden">
                <ErrorBoundary fallbackMessage="Energy & utilities data temporarily unavailable.">
                  <EnergyUtilitiesPanel 
                    location={center}
                    bbox={bbox}
                    cityName={cityName}
                    visible={showEnergy}
                  />
                </ErrorBoundary>
              </div>
            )}
            <div className="glass-card rounded-2xl border border-white/10 bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-lg p-4 md:p-5 shadow-glow hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-xl">ℹ️</span>
                </div>
                <h2 className="text-lg font-semibold">About MetroScape</h2>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Advanced urban planning platform powered by NASA Earth observation data. 
                Features real-time weather, disaster monitoring, and comprehensive analytics 
                for resilient city development.
              </p>
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2 text-xs text-white/60">
                <span className="px-2 py-1 bg-white/5 rounded-lg">NASA GIBS</span>
                <span className="px-2 py-1 bg-white/5 rounded-lg">EONET</span>
                <span className="px-2 py-1 bg-white/5 rounded-lg">POWER</span>
                <span className="px-2 py-1 bg-white/5 rounded-lg">OpenWeather</span>
              </div>
            </div>
          </aside>
          </div>
        </main>
      </div>
    </div>
  )
}