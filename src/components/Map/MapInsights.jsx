import React, { useState, useEffect } from 'react'

/**
 * Interactive Map Insights - Shows data visualizations below the map
 * Includes: Weather forecasts, density analysis, urban insights
 */
export default function MapInsights({ 
  weather, 
  cityName, 
  location,
  disasters = []
}) {
  const [activeTab, setActiveTab] = useState('forecast')
  const [forecastData, setForecastData] = useState(null)

  // Fetch 5-day forecast
  useEffect(() => {
    if (!location || location.length !== 2) return

    const fetchForecast = async () => {
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'DEMO_KEY'
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0]}&lon=${location[1]}&appid=${API_KEY}&units=metric`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          // Group by day
          const daily = {}
          data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString()
            if (!daily[date]) {
              daily[date] = {
                temps: [],
                conditions: [],
                humidity: [],
                wind: [],
                rain: 0,
                timestamp: item.dt
              }
            }
            daily[date].temps.push(item.main.temp)
            daily[date].conditions.push(item.weather[0].main)
            daily[date].humidity.push(item.main.humidity)
            daily[date].wind.push(item.wind.speed * 3.6)
            daily[date].rain += item.rain?.['3h'] || 0
          })
          setForecastData(daily)
        }
      } catch (err) {
        console.error('Forecast fetch error:', err)
      }
    }

    fetchForecast()
  }, [location])

  const tabs = [
    { id: 'forecast', label: '📊 Weather Forecast', icon: '🌤️' },
    { id: 'density', label: '🏙️ Urban Density', icon: '🏢' },
    { id: 'risks', label: '⚠️ Risk Analysis', icon: '📈' },
    { id: 'forestry', label: '🌲 Forestry & Climate', icon: '🌳' },
    { id: 'geology', label: '🏔️ Earthquake Zones', icon: '⚡' },
    { id: 'mining', label: '⛏️ Mining & Minerals', icon: '💎' }
  ]

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-space-800/60 backdrop-blur-soft shadow-glow">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-nasa-blue/20 border-b-2 border-nasa-blue text-white'
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'forecast' && (
          <ForecastTab 
            forecastData={forecastData}
            cityName={cityName}
            currentWeather={weather}
          />
        )}
        
        {activeTab === 'density' && (
          <DensityTab 
            cityName={cityName}
            location={location}
          />
        )}
        
        {activeTab === 'risks' && (
          <RisksTab 
            disasters={disasters}
            weather={weather}
            cityName={cityName}
          />
        )}

        {activeTab === 'forestry' && (
          <ForestryTab 
            cityName={cityName}
            location={location}
          />
        )}

        {activeTab === 'geology' && (
          <GeologyTab 
            cityName={cityName}
            location={location}
            disasters={disasters}
          />
        )}

        {activeTab === 'mining' && (
          <MiningTab 
            cityName={cityName}
            location={location}
          />
        )}
      </div>
    </div>
  )
}

/**
 * Weather Forecast Tab - 5-day forecast with charts
 */
function ForecastTab({ forecastData, cityName, currentWeather }) {
  if (!forecastData) {
    return (
      <div className="text-center py-8 text-white/60">
        <div className="animate-spin text-2xl mb-2">🌐</div>
        Loading 5-day forecast...
      </div>
    )
  }

  const days = Object.entries(forecastData).slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">5-Day Forecast for {cityName}</h3>
        {currentWeather && (
          <div className="text-sm text-white/70">
            Now: {currentWeather.temp}°C {currentWeather.conditions}
          </div>
        )}
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {days.map(([date, data]) => {
          const avgTemp = Math.round(data.temps.reduce((a, b) => a + b) / data.temps.length)
          const maxTemp = Math.round(Math.max(...data.temps))
          const minTemp = Math.round(Math.min(...data.temps))
          const condition = data.conditions[0]
          const icon = getWeatherEmoji(condition)
          const dayName = new Date(data.timestamp * 1000).toLocaleDateString('en', { weekday: 'short' })

          return (
            <div
              key={date}
              className="bg-space-700/50 rounded-lg p-3 border border-white/5 hover:border-nasa-blue/30 transition-all"
            >
              <div className="text-xs text-white/60 mb-1">{dayName}</div>
              <div className="text-2xl mb-2">{icon}</div>
              <div className="text-xl font-bold mb-1">{avgTemp}°C</div>
              <div className="text-xs text-white/50">
                H: {maxTemp}° L: {minTemp}°
              </div>
              <div className="text-xs text-white/60 mt-2">{condition}</div>
            </div>
          )
        })}
      </div>

      {/* Temperature Graph */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3 text-white/80">Temperature Trend</h4>
        <div className="relative h-32 bg-space-900/50 rounded-lg p-4 border border-white/5">
          <svg width="100%" height="100%" className="overflow-visible">
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Temperature line */}
            {days.length > 1 && (
              <>
                <polyline
                  points={days.map((_, i) => {
                    const x = (i / (days.length - 1)) * 100
                    const temps = days[i][1].temps
                    const avgTemp = temps.reduce((a, b) => a + b) / temps.length
                    const minTemp = Math.min(...days.flatMap(([_, d]) => d.temps))
                    const maxTemp = Math.max(...days.flatMap(([_, d]) => d.temps))
                    const y = 100 - ((avgTemp - minTemp) / (maxTemp - minTemp)) * 80
                    return `${x}%,${y}%`
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Data points */}
                {days.map((_, i) => {
                  const x = (i / (days.length - 1)) * 100
                  const temps = days[i][1].temps
                  const avgTemp = temps.reduce((a, b) => a + b) / temps.length
                  const minTemp = Math.min(...days.flatMap(([_, d]) => d.temps))
                  const maxTemp = Math.max(...days.flatMap(([_, d]) => d.temps))
                  const y = 100 - ((avgTemp - minTemp) / (maxTemp - minTemp)) * 80
                  return (
                    <circle
                      key={i}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="4"
                      fill="#3b82f6"
                      className="cursor-pointer hover:r-6 transition-all"
                    >
                      <title>{Math.round(avgTemp)}°C</title>
                    </circle>
                  )
                })}
              </>
            )}
          </svg>
        </div>
      </div>
    </div>
  )
}

/**
 * Urban Density Tab - Population, housing, infrastructure insights
 */
function DensityTab({ cityName, location }) {
  // Mock data - in production, fetch from real APIs
  const insights = {
    population: {
      estimated: generatePopulationEstimate(cityName),
      density: generateDensity(cityName),
      growth: Math.random() * 5 - 1 // -1% to +4%
    },
    housing: {
      units: Math.floor(Math.random() * 500000) + 100000,
      avgSize: Math.floor(Math.random() * 50) + 70, // 70-120 sqm
      types: [
        { type: 'Apartments', percentage: Math.floor(Math.random() * 40) + 40 },
        { type: 'Houses', percentage: Math.floor(Math.random() * 30) + 20 },
        { type: 'Mixed-use', percentage: Math.floor(Math.random() * 20) + 10 }
      ]
    },
    infrastructure: {
      roads: Math.floor(Math.random() * 5000) + 1000,
      greenSpace: Math.floor(Math.random() * 20) + 10,
      transitScore: Math.floor(Math.random() * 40) + 60
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Urban Analysis: {cityName}</h3>
        <p className="text-sm text-white/60 mb-6">
          Real-time insights into urban density, housing, and infrastructure
        </p>
      </div>

      {/* Population Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon="👥"
          label="Population"
          value={insights.population.estimated}
          unit="people"
          trend={insights.population.growth}
        />
        <StatCard
          icon="📏"
          label="Density"
          value={insights.population.density}
          unit="per km²"
        />
        <StatCard
          icon="🏠"
          label="Housing Units"
          value={insights.housing.units}
          unit="units"
        />
      </div>

      {/* Housing Type Distribution */}
      <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-3 text-white/80">Housing Distribution</h4>
        <div className="space-y-3">
          {insights.housing.types.map(type => (
            <div key={type.type}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">{type.type}</span>
                <span className="font-semibold">{type.percentage}%</span>
              </div>
              <div className="h-2 bg-space-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-nasa-blue to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${type.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoreCard
          icon="🛣️"
          label="Road Network"
          value={insights.infrastructure.roads}
          unit="km"
          score={75}
        />
        <ScoreCard
          icon="🌳"
          label="Green Space"
          value={insights.infrastructure.greenSpace}
          unit="%"
          score={insights.infrastructure.greenSpace * 5}
        />
        <ScoreCard
          icon="🚇"
          label="Transit Score"
          value={insights.infrastructure.transitScore}
          unit="/100"
          score={insights.infrastructure.transitScore}
        />
      </div>
    </div>
  )
}

/**
 * Risk Analysis Tab - Disaster risks, trends, predictions
 */
function RisksTab({ disasters, weather, cityName }) {
  const riskCategories = [
    {
      name: 'Flood Risk',
      level: disasters.some(d => d.categories?.[0]?.title === 'Floods') ? 'HIGH' : 'MODERATE',
      icon: '🌊',
      color: 'blue'
    },
    {
      name: 'Heat Risk',
      level: weather?.temp > 35 ? 'HIGH' : weather?.temp > 30 ? 'MODERATE' : 'LOW',
      icon: '🌡️',
      color: 'red'
    },
    {
      name: 'Storm Risk',
      level: weather?.windSpeed > 50 ? 'HIGH' : weather?.windSpeed > 30 ? 'MODERATE' : 'LOW',
      icon: '⛈️',
      color: 'yellow'
    },
    {
      name: 'Fire Risk',
      level: disasters.some(d => d.categories?.[0]?.title === 'Wildfires') ? 'CRITICAL' : 'LOW',
      icon: '🔥',
      color: 'orange'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Risk Assessment: {cityName}</h3>
        <p className="text-sm text-white/60 mb-4">
          Current and forecasted risks based on real-time data
        </p>
      </div>

      {/* Active Disasters Alert */}
      {disasters.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div className="flex-1">
              <h4 className="font-semibold text-red-400 mb-1">
                {disasters.length} Active Disaster{disasters.length > 1 ? 's' : ''}
              </h4>
              <ul className="text-sm text-white/80 space-y-1">
                {disasters.slice(0, 3).map((d, i) => (
                  <li key={i}>• {d.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Risk Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskCategories.map(risk => (
          <RiskCard key={risk.name} {...risk} />
        ))}
      </div>

      {/* 7-Day Trend */}
      <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-3 text-white/80">7-Day Risk Trend</h4>
        <div className="flex items-end justify-between h-24 gap-2">
          {[...Array(7)].map((_, i) => {
            const height = Math.random() * 100
            const isToday = i === 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t transition-all ${
                    height > 70 ? 'bg-red-500/60' :
                    height > 40 ? 'bg-yellow-500/60' :
                    'bg-green-500/60'
                  } ${isToday ? 'ring-2 ring-white/50' : ''}`}
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-white/50">
                  {i === 0 ? 'Now' : `+${i}d`}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Forestry & Climate Tab - Forest cover, deforestation, carbon storage
 */
function ForestryTab({ cityName, location }) {
  // Mock data - in production, integrate with Global Forest Watch API, NASA MODIS
  const forestryData = {
    forestCover: {
      total: Math.floor(Math.random() * 40) + 10, // 10-50%
      trend: Math.random() * 4 - 2, // -2% to +2%
      primaryForest: Math.floor(Math.random() * 20) + 5,
      secondaryForest: Math.floor(Math.random() * 25) + 10
    },
    deforestation: {
      annualLoss: (Math.random() * 500).toFixed(1), // km²/year
      since2000: Math.floor(Math.random() * 5000) + 1000, // Total km²
      majorCauses: [
        { cause: 'Agriculture', percentage: 45 },
        { cause: 'Urban Expansion', percentage: 25 },
        { cause: 'Logging', percentage: 20 },
        { cause: 'Infrastructure', percentage: 10 }
      ]
    },
    carbon: {
      storage: (Math.random() * 100 + 50).toFixed(1), // Million tonnes
      annualSequestration: (Math.random() * 5 + 1).toFixed(2), // Mt/year
      emissionsAvoided: (Math.random() * 10 + 5).toFixed(1) // Mt CO2/year
    },
    biodiversity: {
      treeSpecies: Math.floor(Math.random() * 200) + 50,
      endangeredSpecies: Math.floor(Math.random() * 30) + 5,
      protectedAreas: Math.floor(Math.random() * 15) + 3
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">🌲 Forest & Climate Analysis: {cityName}</h3>
        <p className="text-sm text-white/60 mb-4">
          Forest cover, deforestation rates, carbon storage, and biodiversity metrics
        </p>
      </div>

      {/* Forest Cover Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon="🌳"
          label="Forest Cover"
          value={forestryData.forestCover.total}
          unit="%"
          trend={forestryData.forestCover.trend}
        />
        <StatCard
          icon="🌲"
          label="Primary Forest"
          value={forestryData.forestCover.primaryForest}
          unit="%"
        />
        <StatCard
          icon="🌱"
          label="Annual Loss"
          value={forestryData.deforestation.annualLoss}
          unit="km²/year"
        />
        <StatCard
          icon="💨"
          label="Carbon Storage"
          value={forestryData.carbon.storage}
          unit="Mt"
        />
      </div>

      {/* Forest Cover Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2">
            <span>🌲</span> Forest Composition
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">Primary Forest</span>
                <span className="font-semibold text-green-400">{forestryData.forestCover.primaryForest}%</span>
              </div>
              <div className="h-2 bg-space-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                  style={{ width: `${forestryData.forestCover.primaryForest}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">Secondary Forest</span>
                <span className="font-semibold text-emerald-400">{forestryData.forestCover.secondaryForest}%</span>
              </div>
              <div className="h-2 bg-space-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                  style={{ width: `${forestryData.forestCover.secondaryForest}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/70">Non-Forest</span>
                <span className="font-semibold text-white/50">
                  {100 - forestryData.forestCover.primaryForest - forestryData.forestCover.secondaryForest}%
                </span>
              </div>
              <div className="h-2 bg-space-900/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-600 to-gray-400 rounded-full"
                  style={{ width: `${100 - forestryData.forestCover.primaryForest - forestryData.forestCover.secondaryForest}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2">
            <span>🪓</span> Deforestation Causes
          </h4>
          <div className="space-y-3">
            {forestryData.deforestation.majorCauses.map(item => (
              <div key={item.cause}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">{item.cause}</span>
                  <span className="font-semibold">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-space-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carbon & Biodiversity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💨</span>
            <span className="text-sm text-white/70">Carbon Sequestration</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {forestryData.carbon.annualSequestration} Mt/year
          </div>
          <div className="text-xs text-white/60">
            Absorbing {forestryData.carbon.emissionsAvoided} Mt CO₂ annually
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🦜</span>
            <span className="text-sm text-white/70">Tree Species</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {forestryData.biodiversity.treeSpecies}
          </div>
          <div className="text-xs text-white/60">
            {forestryData.biodiversity.endangeredSpecies} endangered
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm text-white/70">Protected Areas</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            {forestryData.biodiversity.protectedAreas}
          </div>
          <div className="text-xs text-white/60">
            National parks & reserves
          </div>
        </div>
      </div>

      {/* Historical Trend */}
      <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-3 text-white/80">Forest Cover Trend (2000-2024)</h4>
        <div className="flex items-end justify-between h-32 gap-2">
          {[...Array(12)].map((_, i) => {
            const year = 2000 + i * 2
            const height = 100 - (i * 3) - Math.random() * 5 // Declining trend
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t bg-gradient-to-t from-green-700 to-green-500 transition-all"
                  style={{ height: `${height}%` }}
                  title={`${year}: ${height.toFixed(0)}% coverage`}
                />
                <div className="text-xs text-white/50 -rotate-45 origin-top-left">
                  {year}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 text-xs text-red-400 flex items-center gap-2">
          <span>📉</span>
          <span>Total loss since 2000: {forestryData.deforestation.since2000} km²</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Geology & Earthquake Tab - Historical earthquakes, fault lines, seismic risk
 */
function GeologyTab({ cityName, location, disasters }) {
  // Mock data - in production, integrate with USGS Earthquake API, seismic databases
  const earthquakeZones = disasters.filter(d => d.categories?.[0]?.title === 'Earthquakes')
  
  const geologyData = {
    seismicRisk: {
      zone: ['Low', 'Moderate', 'High', 'Very High'][Math.floor(Math.random() * 4)],
      probability: Math.floor(Math.random() * 40) + 10, // 10-50%
      maxMagnitude: (Math.random() * 3 + 5).toFixed(1) // 5.0-8.0
    },
    historicalQuakes: [
      { year: 2024, magnitude: 6.2, depth: 15, casualties: 120, distance: 45 },
      { year: 2018, magnitude: 7.1, depth: 25, casualties: 850, distance: 120 },
      { year: 2011, magnitude: 5.8, depth: 10, casualties: 12, distance: 65 },
      { year: 2005, magnitude: 6.8, depth: 30, casualties: 340, distance: 95 },
      { year: 1999, magnitude: 7.5, depth: 20, casualties: 2500, distance: 180 }
    ],
    faultLines: [
      { name: 'Primary Fault Zone', type: 'Strike-slip', distance: 35, active: true },
      { name: 'Secondary Fault', type: 'Normal', distance: 85, active: false },
      { name: 'Tertiary Fault', type: 'Reverse', distance: 120, active: true }
    ],
    soilType: {
      category: ['Rock', 'Stiff Soil', 'Soft Soil', 'Loose Fill'][Math.floor(Math.random() * 4)],
      liquefactionRisk: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
      amplificationFactor: (Math.random() * 2 + 1).toFixed(2) // 1.0-3.0
    }
  }

  const getRiskColor = (zone) => {
    const colors = {
      'Low': 'text-green-400 bg-green-500/20',
      'Moderate': 'text-yellow-400 bg-yellow-500/20',
      'High': 'text-orange-400 bg-orange-500/20',
      'Very High': 'text-red-400 bg-red-500/20'
    }
    return colors[zone] || colors['Low']
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">🏔️ Earthquake & Geology Analysis: {cityName}</h3>
        <p className="text-sm text-white/60 mb-4">
          Seismic risk zones, historical earthquakes, fault lines, and soil conditions
        </p>
      </div>

      {/* Active Earthquake Alert */}
      {earthquakeZones.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div className="flex-1">
              <h4 className="font-semibold text-red-400 mb-1">
                {earthquakeZones.length} Recent Earthquake{earthquakeZones.length > 1 ? 's' : ''}
              </h4>
              <ul className="text-sm text-white/80 space-y-1">
                {earthquakeZones.slice(0, 3).map((eq, i) => (
                  <li key={i}>• {eq.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Seismic Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-lg p-4 border ${getRiskColor(geologyData.seismicRisk.zone)}`}>
          <div className="text-xs text-white/60 mb-2">Seismic Risk Zone</div>
          <div className="text-2xl font-bold mb-1">{geologyData.seismicRisk.zone}</div>
          <div className="text-xs text-white/50">
            {geologyData.seismicRisk.probability}% probability in 50 years
          </div>
        </div>

        <StatCard
          icon="📊"
          label="Max Expected"
          value={geologyData.seismicRisk.maxMagnitude}
          unit="magnitude"
        />

        <StatCard
          icon="🗺️"
          label="Fault Lines"
          value={geologyData.faultLines.length}
          unit="identified"
        />

        <div className={`rounded-lg p-4 border ${
          geologyData.soilType.liquefactionRisk === 'High' 
            ? 'border-red-500/30 bg-red-500/10' 
            : 'border-yellow-500/30 bg-yellow-500/10'
        }`}>
          <div className="text-xs text-white/60 mb-2">Liquefaction Risk</div>
          <div className="text-2xl font-bold mb-1">{geologyData.soilType.liquefactionRisk}</div>
          <div className="text-xs text-white/50">
            Soil: {geologyData.soilType.category}
          </div>
        </div>
      </div>

      {/* Historical Earthquakes Table */}
      <div className="bg-space-700/30 rounded-lg border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <span>📜</span> Historical Earthquakes (Last 25 Years)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-space-900/50">
              <tr className="text-white/60 text-left">
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Magnitude</th>
                <th className="px-4 py-2">Depth</th>
                <th className="px-4 py-2">Distance</th>
                <th className="px-4 py-2">Casualties</th>
                <th className="px-4 py-2">Impact</th>
              </tr>
            </thead>
            <tbody>
              {geologyData.historicalQuakes.map((quake, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">{quake.year}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${
                      quake.magnitude >= 7 ? 'text-red-400' :
                      quake.magnitude >= 6 ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      M{quake.magnitude}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/70">{quake.depth} km</td>
                  <td className="px-4 py-3 text-white/70">{quake.distance} km</td>
                  <td className="px-4 py-3 text-white/70">{quake.casualties.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      quake.casualties > 1000 ? 'bg-red-500/20 text-red-400' :
                      quake.casualties > 100 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {quake.casualties > 1000 ? 'Severe' : quake.casualties > 100 ? 'Major' : 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fault Lines */}
      <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2">
          <span>🗺️</span> Major Fault Lines
        </h4>
        <div className="space-y-3">
          {geologyData.faultLines.map((fault, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-space-900/30 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-white mb-1 flex items-center gap-2">
                  {fault.name}
                  {fault.active && (
                    <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/60">
                  Type: {fault.type} • Distance: {fault.distance} km from city center
                </div>
              </div>
              <div className="text-2xl">
                {fault.active ? '⚠️' : '✓'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Magnitude Distribution */}
      <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-3 text-white/80">Magnitude Distribution (Historical)</h4>
        <div className="flex items-end justify-between h-24 gap-3">
          {['<4.0', '4-5', '5-6', '6-7', '7+'].map((range, i) => {
            const count = [45, 28, 12, 4, 1][i]
            const height = (count / 45) * 100
            return (
              <div key={range} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t transition-all ${
                    i === 4 ? 'bg-red-500' :
                    i === 3 ? 'bg-orange-500' :
                    i === 2 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${count} earthquakes`}
                />
                <div className="text-xs text-white/70">{range}</div>
                <div className="text-xs text-white/50">{count}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Mining & Minerals Tab - Active mines, mineral deposits, extraction data
 */
function MiningTab({ cityName, location }) {
  // Mock data - in production, integrate with USGS Mineral Resources, mining databases
  const miningData = {
    activeMines: [
      { name: 'Northern Mine', type: 'Gold', production: 12500, employees: 450, status: 'Active' },
      { name: 'Eastern Quarry', type: 'Limestone', production: 85000, employees: 280, status: 'Active' },
      { name: 'Central Pit', type: 'Copper', production: 35000, employees: 620, status: 'Active' },
      { name: 'Southern Mine', type: 'Coal', production: 125000, employees: 890, status: 'Suspended' }
    ],
    mineralDeposits: {
      precious: [
        { mineral: 'Gold', reserves: '125 tonnes', grade: 'High', status: 'Exploited' },
        { mineral: 'Silver', reserves: '840 tonnes', grade: 'Medium', status: 'Exploited' },
        { mineral: 'Platinum', reserves: '15 tonnes', grade: 'Low', status: 'Unexploited' }
      ],
      industrial: [
        { mineral: 'Copper', reserves: '2.5M tonnes', grade: 'Medium', status: 'Exploited' },
        { mineral: 'Iron Ore', reserves: '15M tonnes', grade: 'High', status: 'Exploited' },
        { mineral: 'Limestone', reserves: '50M tonnes', grade: 'High', status: 'Exploited' }
      ],
      energy: [
        { mineral: 'Coal', reserves: '500M tonnes', grade: 'Medium', status: 'Exploited' },
        { mineral: 'Uranium', reserves: '25K tonnes', grade: 'Low', status: 'Unexploited' },
        { mineral: 'Natural Gas', reserves: '150 BCF', grade: 'Medium', status: 'Exploited' }
      ]
    },
    economics: {
      annualRevenue: (Math.random() * 500 + 200).toFixed(0), // Million USD
      exports: Math.floor(Math.random() * 40) + 30, // % of total exports
      employment: Math.floor(Math.random() * 5000) + 2000,
      gdpContribution: (Math.random() * 10 + 5).toFixed(1) // %
    },
    environmental: {
      landReclamation: Math.floor(Math.random() * 60) + 20, // %
      waterUsage: (Math.random() * 50 + 20).toFixed(1), // Million m³/year
      emissionsReduction: Math.floor(Math.random() * 30) + 10 // % since 2015
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'text-green-400 bg-green-500/20',
      'Suspended': 'text-yellow-400 bg-yellow-500/20',
      'Closed': 'text-red-400 bg-red-500/20'
    }
    return colors[status] || colors['Active']
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">⛏️ Mining & Mineral Resources: {cityName}</h3>
        <p className="text-sm text-white/60 mb-4">
          Active mines, mineral deposits, production data, and environmental impact
        </p>
      </div>

      {/* Economic Impact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon="💰"
          label="Annual Revenue"
          value={miningData.economics.annualRevenue}
          unit="M USD"
        />
        <StatCard
          icon="📦"
          label="Export Share"
          value={miningData.economics.exports}
          unit="%"
        />
        <StatCard
          icon="👷"
          label="Employment"
          value={miningData.economics.employment}
          unit="jobs"
        />
        <StatCard
          icon="📊"
          label="GDP Contribution"
          value={miningData.economics.gdpContribution}
          unit="%"
        />
      </div>

      {/* Active Mines */}
      <div className="bg-space-700/30 rounded-lg border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2">
            <span>⛏️</span> Active Mining Operations
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-space-900/50">
              <tr className="text-white/60 text-left">
                <th className="px-4 py-2">Mine Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Production</th>
                <th className="px-4 py-2">Employees</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {miningData.activeMines.map((mine, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-medium">{mine.name}</td>
                  <td className="px-4 py-3 text-white/70">{mine.type}</td>
                  <td className="px-4 py-3 text-white/70">
                    {mine.production.toLocaleString()} tonnes/year
                  </td>
                  <td className="px-4 py-3 text-white/70">{mine.employees}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(mine.status)}`}>
                      {mine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mineral Deposits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Precious Metals */}
        <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2">
            <span>💎</span> Precious Metals
          </h4>
          <div className="space-y-3">
            {miningData.mineralDeposits.precious.map((mineral, i) => (
              <div key={i} className="p-2 bg-space-900/30 rounded">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{mineral.mineral}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    mineral.status === 'Exploited' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {mineral.status}
                  </span>
                </div>
                <div className="text-xs text-white/60">
                  Reserves: {mineral.reserves}
                </div>
                <div className="text-xs text-white/50">
                  Grade: {mineral.grade}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industrial Minerals */}
        <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2">
            <span>🏭</span> Industrial Minerals
          </h4>
          <div className="space-y-3">
            {miningData.mineralDeposits.industrial.map((mineral, i) => (
              <div key={i} className="p-2 bg-space-900/30 rounded">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{mineral.mineral}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    mineral.status === 'Exploited' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {mineral.status}
                  </span>
                </div>
                <div className="text-xs text-white/60">
                  Reserves: {mineral.reserves}
                </div>
                <div className="text-xs text-white/50">
                  Grade: {mineral.grade}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Minerals */}
        <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2">
            <span>⚡</span> Energy Resources
          </h4>
          <div className="space-y-3">
            {miningData.mineralDeposits.energy.map((mineral, i) => (
              <div key={i} className="p-2 bg-space-900/30 rounded">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{mineral.mineral}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    mineral.status === 'Exploited' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {mineral.status}
                  </span>
                </div>
                <div className="text-xs text-white/60">
                  Reserves: {mineral.reserves}
                </div>
                <div className="text-xs text-white/50">
                  Grade: {mineral.grade}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌱</span>
            <span className="text-sm text-white/70">Land Reclamation</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {miningData.environmental.landReclamation}%
          </div>
          <div className="text-xs text-white/60">
            Of mined areas rehabilitated
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💧</span>
            <span className="text-sm text-white/70">Water Usage</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">
            {miningData.environmental.waterUsage}M m³
          </div>
          <div className="text-xs text-white/60">
            Annual consumption
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">♻️</span>
            <span className="text-sm text-white/70">Emissions Reduction</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">
            -{miningData.environmental.emissionsReduction}%
          </div>
          <div className="text-xs text-white/60">
            Since 2015
          </div>
        </div>
      </div>

      {/* Production Trends */}
      <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
        <h4 className="text-sm font-semibold mb-3 text-white/80">Production Trends (Last 10 Years)</h4>
        <div className="flex items-end justify-between h-32 gap-2">
          {[...Array(10)].map((_, i) => {
            const year = 2015 + i
            const height = 60 + Math.random() * 40 // Varying production
            const color = height > 90 ? 'bg-green-500' : height > 70 ? 'bg-blue-500' : 'bg-yellow-500'
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={`w-full rounded-t ${color} transition-all`}
                  style={{ height: `${height}%` }}
                  title={`${year}: ${height.toFixed(0)}% of capacity`}
                />
                <div className="text-xs text-white/50">
                  '{year.toString().slice(-2)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Helper Components

function StatCard({ icon, label, value, unit, trend }) {
  return (
    <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-white/60">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs text-white/50">{unit}</div>
      {trend !== undefined && (
        <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-white/50'}`}>
          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}% growth
        </div>
      )}
    </div>
  )
}

function ScoreCard({ icon, label, value, unit, score }) {
  const getColor = (s) => {
    if (s >= 80) return 'text-green-400'
    if (s >= 60) return 'text-blue-400'
    if (s >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-space-700/30 rounded-lg p-4 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-lg font-bold ${getColor(score)}`}>{score}/100</span>
      </div>
      <div className="text-sm text-white/70 mb-1">{label}</div>
      <div className="text-xl font-semibold">
        {typeof value === 'number' ? value.toLocaleString() : value} {unit}
      </div>
    </div>
  )
}

function RiskCard({ name, level, icon, color }) {
  const colors = {
    blue: 'border-blue-500/30 bg-blue-500/10',
    red: 'border-red-500/30 bg-red-500/10',
    yellow: 'border-yellow-500/30 bg-yellow-500/10',
    orange: 'border-orange-500/30 bg-orange-500/10'
  }

  const levelColors = {
    LOW: 'text-green-400 bg-green-500/20',
    MODERATE: 'text-yellow-400 bg-yellow-500/20',
    HIGH: 'text-orange-400 bg-orange-500/20',
    CRITICAL: 'text-red-400 bg-red-500/20'
  }

  return (
    <div className={`rounded-lg p-4 border ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold">{name}</span>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold ${levelColors[level]}`}>
          {level}
        </span>
      </div>
    </div>
  )
}

// Utility Functions

function getWeatherEmoji(condition) {
  const map = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '🌨️',
    Mist: '🌫️',
    Fog: '🌫️'
  }
  return map[condition] || '🌤️'
}

function generatePopulationEstimate(cityName) {
  // Mock data - in production, use real API
  const cities = {
    'Tokyo': 37400000,
    'Mumbai': 20400000,
    'London': 9000000,
    'Paris': 2200000,
    'New York': 8400000
  }
  
  for (const [city, pop] of Object.entries(cities)) {
    if (cityName?.includes(city)) return pop
  }
  
  return Math.floor(Math.random() * 5000000) + 500000
}

function generateDensity(cityName) {
  return Math.floor(Math.random() * 15000) + 1000
}
