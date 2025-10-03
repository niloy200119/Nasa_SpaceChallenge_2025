/**
 * 🌍 Environmental Health Panel
 * Air/water pollution tracking, industrial impact on habitats, waste management
 * Features: Pollution heatmaps, habitat health tracking, waste infrastructure
 */

import React, { useState, useEffect } from 'react'

export default function EnvironmentalHealthPanel({ location, cityName, airQuality, visible }) {
  const [activeTab, setActiveTab] = useState('air')
  const [environmentalData, setEnvironmentalData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!visible || !location) return

    const analyzeEnvironment = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 900))
      
      setEnvironmentalData({
        airPollution: generateAirPollutionData(location, airQuality),
        waterQuality: generateWaterQualityData(location),
        industrialImpact: generateIndustrialImpactData(location),
        waste: generateWasteManagementData(location),
        habitats: generateHabitatHealthData(location)
      })
      
      setLoading(false)
    }

    analyzeEnvironment()
  }, [location, airQuality, visible])

  if (!visible) return null

  const tabs = [
    { id: 'air', label: '💨 Air Quality', icon: '🌫️', color: 'cyan' },
    { id: 'water', label: '💧 Water', icon: '🌊', color: 'blue' },
    { id: 'industrial', label: '🏭 Industry', icon: '⚠️', color: 'orange' },
    { id: 'waste', label: '♻️ Waste', icon: '🗑️', color: 'green' },
    { id: 'habitats', label: '🦋 Habitats', icon: '🌿', color: 'emerald' }
  ]

  return (
    <div className="bg-gradient-to-br from-space-900 via-space-800 to-space-900 text-white p-6 rounded-2xl shadow-2xl h-full overflow-y-auto backdrop-blur-xl border border-white/10">
      {/* Glassmorphism Header */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-green-500/20 rounded-xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <span className="text-4xl">🌍</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Environmental Health
            </span>
          </h2>
          <p className="text-sm text-white/60 ml-16">
            {cityName} - Pollution Tracking & Habitat Protection
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap
              transition-all duration-300 transform hover:scale-105
              ${activeTab === tab.id 
                ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/50` 
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }
            `}
          >
            <span className="text-xl mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {activeTab === 'air' && <AirQualityTab data={environmentalData.airPollution} cityName={cityName} />}
          {activeTab === 'water' && <WaterQualityTab data={environmentalData.waterQuality} cityName={cityName} />}
          {activeTab === 'industrial' && <IndustrialImpactTab data={environmentalData.industrialImpact} cityName={cityName} />}
          {activeTab === 'waste' && <WasteManagementTab data={environmentalData.waste} cityName={cityName} />}
          {activeTab === 'habitats' && <HabitatHealthTab data={environmentalData.habitats} cityName={cityName} />}
        </>
      )}
    </div>
  )
}

/**
 * 💨 Air Quality Tab
 */
function AirQualityTab({ data, cityName }) {
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return { bg: 'from-green-900/40 to-emerald-900/40', border: 'border-green-500/30', text: 'text-green-400', label: 'Good', gradient: 'from-green-500 to-emerald-400' }
    if (aqi <= 100) return { bg: 'from-yellow-900/40 to-amber-900/40', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Moderate', gradient: 'from-yellow-500 to-amber-400' }
    if (aqi <= 150) return { bg: 'from-orange-900/40 to-red-900/40', border: 'border-orange-500/30', text: 'text-orange-400', label: 'Unhealthy (Sensitive)', gradient: 'from-orange-500 to-red-400' }
    if (aqi <= 200) return { bg: 'from-red-900/40 to-pink-900/40', border: 'border-red-500/30', text: 'text-red-400', label: 'Unhealthy', gradient: 'from-red-500 to-pink-400' }
    if (aqi <= 300) return { bg: 'from-purple-900/40 to-violet-900/40', border: 'border-purple-500/30', text: 'text-purple-400', label: 'Very Unhealthy', gradient: 'from-purple-500 to-violet-400' }
    return { bg: 'from-red-900/40 to-red-950/40', border: 'border-red-700/50', text: 'text-red-500', label: 'Hazardous', gradient: 'from-red-700 to-red-900' }
  }

  const aqiInfo = getAQIColor(data.currentAQI)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* AQI Alert */}
      {data.currentAQI > 100 && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-4 border-red-500 rounded-xl p-5 backdrop-blur-md animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-400 text-lg mb-1">Air Quality Alert</h3>
              <p className="text-sm text-white/80">
                Current AQI of {data.currentAQI} is {aqiInfo.label}. Sensitive groups should limit outdoor activity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current AQI - Hero Card */}
      <div className="relative group">
        <div className={`absolute inset-0 bg-gradient-to-r ${aqiInfo.gradient}/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all`} />
        <div className={`relative bg-gradient-to-br ${aqiInfo.bg} backdrop-blur-md rounded-2xl p-8 border ${aqiInfo.border}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2">Air Quality Index</h3>
              <div className={`text-7xl font-black ${aqiInfo.text}`}>
                {data.currentAQI}
              </div>
              <p className={`text-lg font-bold ${aqiInfo.text} mt-2`}>
                {aqiInfo.label}
              </p>
            </div>
            <div className="text-9xl opacity-20">💨</div>
          </div>
          
          {/* Visual AQI Scale */}
          <div className="relative h-5 bg-black/30 rounded-full overflow-hidden mb-3">
            <div className="absolute inset-0 flex">
              <div className="flex-1 bg-green-500" />
              <div className="flex-1 bg-yellow-500" />
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-red-500" />
              <div className="flex-1 bg-purple-500" />
              <div className="flex-1 bg-red-900" />
            </div>
            <div 
              className="absolute top-0 h-full w-1 bg-white shadow-lg"
              style={{ left: `${(data.currentAQI / 300) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50">
            <span>0 Good</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>200</span>
            <span>300+</span>
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.pollutants.map((pollutant, idx) => (
          <PollutantCard key={idx} {...pollutant} />
        ))}
      </div>

      {/* Pollution Sources Heatmap */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🗺️</span> Pollution Hotspots
        </h3>
        <div className="space-y-4">
          {data.pollutionZones.map((zone, idx) => (
            <div key={idx} className="group hover:bg-white/5 rounded-xl p-4 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold">{zone.location}</h4>
                  <p className="text-xs text-white/50">Affected population: {zone.population.toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  zone.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  zone.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  zone.severity === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {zone.severity}
                </span>
              </div>
              
              <div className="space-y-2">
                {zone.sources.map((source, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{source.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            source.contribution > 40 ? 'bg-red-500' :
                            source.contribution > 25 ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${source.contribution}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono w-10">{source.contribution}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ImpactCard
          icon="🫁"
          title="Respiratory Risk"
          value={data.healthImpact.respiratoryRisk}
          description="Population at risk"
          color="red"
        />
        <ImpactCard
          icon="❤️"
          title="Cardiovascular Risk"
          value={data.healthImpact.cardiovascularRisk}
          description="Increased risk level"
          color="orange"
        />
        <ImpactCard
          icon="👶"
          title="Children at Risk"
          value={data.healthImpact.childrenAffected.toLocaleString()}
          description="Under age 12"
          color="purple"
        />
      </div>

      {/* Recommendations */}
      <RecommendationsCard
        title="Air Quality Improvement Plan"
        recommendations={data.recommendations}
        color="cyan"
      />
    </div>
  )
}

/**
 * 💧 Water Quality Tab
 */
function WaterQualityTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Water Quality Alert */}
      {data.overallScore < 60 && (
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-blue-500 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💧</span>
            <div>
              <h3 className="font-bold text-blue-400 text-lg mb-1">Water Quality Concern</h3>
              <p className="text-sm text-white/80">
                {data.concernSources.length} water sources show contamination levels above safe limits
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Water Quality Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Water Quality Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {data.overallScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.overallScore >= 80 ? 'Excellent Quality' : 
                 data.overallScore >= 60 ? 'Good Quality' : 'Needs Improvement'}
              </p>
            </div>
            <div className="text-8xl opacity-20">🌊</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full"
              style={{ width: `${data.overallScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Water Sources Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.waterSources.map((source, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${
            source.quality === 'Excellent' ? 'from-green-900/40 to-emerald-900/40 border-green-500/30' :
            source.quality === 'Good' ? 'from-blue-900/40 to-cyan-900/40 border-blue-500/30' :
            source.quality === 'Fair' ? 'from-yellow-900/40 to-orange-900/40 border-yellow-500/30' :
            'from-red-900/40 to-pink-900/40 border-red-500/30'
          } backdrop-blur-md rounded-xl p-5 border`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg">{source.name}</h4>
                <p className="text-xs text-white/50">{source.type}</p>
              </div>
              <span className="text-3xl">{source.icon}</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Quality Status:</span>
                <span className={`font-bold ${
                  source.quality === 'Excellent' ? 'text-green-400' :
                  source.quality === 'Good' ? 'text-blue-400' :
                  source.quality === 'Fair' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{source.quality}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Population Served:</span>
                <span className="font-medium">{source.populationServed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Contaminants:</span>
                <span className="font-medium">{source.contaminants}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contaminant Levels */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🔬</span> Contaminant Analysis
        </h3>
        <div className="space-y-4">
          {data.contaminants.map((contaminant, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">{contaminant.name}</span>
                  <span className="ml-3 text-xs text-white/50">{contaminant.unit}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">
                    Detected: {contaminant.level} / Safe Limit: {contaminant.safeLimit}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    contaminant.level <= contaminant.safeLimit ? 'bg-green-500/20 text-green-400' :
                    contaminant.level <= contaminant.safeLimit * 1.5 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {contaminant.level <= contaminant.safeLimit ? 'Safe' :
                     contaminant.level <= contaminant.safeLimit * 1.5 ? 'Elevated' : 'Unsafe'}
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${
                    contaminant.level <= contaminant.safeLimit ? 'bg-green-500' :
                    contaminant.level <= contaminant.safeLimit * 1.5 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((contaminant.level / (contaminant.safeLimit * 2)) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon="🏗️" label="Treatment Plants" value={data.treatmentPlants} color="from-blue-500 to-blue-600" />
        <MetricCard icon="💧" label="Daily Capacity" value={`${data.dailyCapacityMGD} MGD`} color="from-cyan-500 to-cyan-600" />
        <MetricCard icon="🔧" label="Pipe Network" value={`${data.pipeNetworkMiles} mi`} color="from-green-500 to-green-600" />
        <MetricCard icon="⚠️" label="Infrastructure Age" value={`${data.avgInfrastructureAge} years`} color="from-orange-500 to-orange-600" />
      </div>

      <RecommendationsCard
        title="Water Quality Action Plan"
        recommendations={data.recommendations}
        color="blue"
      />
    </div>
  )
}

/**
 * 🏭 Industrial Impact Tab
 */
function IndustrialImpactTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Industrial Impact Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-orange-900/40 to-red-900/40 backdrop-blur-md rounded-2xl p-8 border border-orange-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">Industrial Impact Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                {data.impactScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.impactScore < 40 ? 'Low Impact' : data.impactScore < 70 ? 'Moderate Impact' : 'High Impact'}
              </p>
            </div>
            <div className="text-8xl opacity-20">🏭</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 rounded-full"
              style={{ width: `${data.impactScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Industrial Facilities */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon="🏭" label="Factories" value={data.factories} subtitle="Active sites" color="from-orange-500 to-orange-600" />
        <MetricCard icon="⚡" label="Power Plants" value={data.powerPlants} subtitle="Energy generation" color="from-yellow-500 to-yellow-600" />
        <MetricCard icon="🔬" label="Chemical Plants" value={data.chemicalPlants} subtitle="Monitored sites" color="from-red-500 to-red-600" />
        <MetricCard icon="🏗️" label="Heavy Industry" value={data.heavyIndustry} subtitle="Manufacturing" color="from-purple-500 to-purple-600" />
      </div>

      {/* Habitat Impact Zones */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🌿</span> Habitat Impact Assessment
        </h3>
        <div className="space-y-4">
          {data.habitatImpact.map((habitat, idx) => (
            <div key={idx} className="bg-gradient-to-r from-green-900/20 to-yellow-900/20 rounded-xl p-5 border border-yellow-500/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold">{habitat.name}</h4>
                  <p className="text-xs text-white/50">{habitat.type} • {habitat.area} acres</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  habitat.impactLevel === 'Severe' ? 'bg-red-500/20 text-red-400' :
                  habitat.impactLevel === 'Moderate' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {habitat.impactLevel}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠️</span>
                  <div>
                    <div className="font-medium text-white/80">Primary Threat:</div>
                    <div className="text-white/60 text-xs">{habitat.primaryThreat}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">📊</span>
                  <div>
                    <div className="font-medium text-white/80">Biodiversity Loss:</div>
                    <div className="text-white/60 text-xs">{habitat.biodiversityLoss}% species decline since 2000</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">💚</span>
                  <div>
                    <div className="font-medium text-white/80">Protection Status:</div>
                    <div className="text-white/60 text-xs">{habitat.protectionStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emissions Data */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📊</span> Industrial Emissions (Annual)
        </h3>
        <div className="space-y-3">
          {data.emissions.map((emission, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{emission.pollutant}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-red-400">{emission.amount} {emission.unit}</span>
                  <span className={`text-xs ${emission.trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {emission.trend > 0 ? '↑' : '↓'} {Math.abs(emission.trend)}%
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded ${
                      i < emission.amount / 100 ? 'bg-red-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <RecommendationsCard
        title="Industrial Impact Mitigation Plan"
        recommendations={data.recommendations}
        color="orange"
      />
    </div>
  )
}

/**
 * ♻️ Waste Management Tab
 */
function WasteManagementTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Waste Management Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-green-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Waste Management Efficiency</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {data.efficiencyScore}%
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.diversionRate}% waste diverted from landfills
              </p>
            </div>
            <div className="text-8xl opacity-20">♻️</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 rounded-full"
              style={{ width: `${data.efficiencyScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Waste Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon="🗑️" label="Annual Waste" value={`${data.annualWasteTons}K tons`} color="from-red-500 to-red-600" />
        <MetricCard icon="♻️" label="Recycling Rate" value={`${data.recyclingRate}%`} color="from-green-500 to-green-600" />
        <MetricCard icon="🌱" label="Composting" value={`${data.compostingRate}%`} color="from-emerald-500 to-emerald-600" />
        <MetricCard icon="🏭" label="Waste-to-Energy" value={`${data.wasteToEnergyRate}%`} color="from-orange-500 to-orange-600" />
      </div>

      {/* Waste Stream Breakdown */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📊</span> Waste Composition
        </h3>
        <div className="space-y-4">
          {data.wasteStreams.map((stream, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">{stream.type}</span>
                <span className="text-sm font-bold">{stream.percentage}%</span>
              </div>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${stream.color}`}
                  style={{ width: `${stream.percentage}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-white/50">
                <span>{stream.tons.toLocaleString()} tons/year</span>
                <span>Recyclable: {stream.recyclablePercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-5 border border-blue-500/30">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-2xl font-bold text-blue-400 mb-1">{data.recyclingCenters}</div>
          <div className="text-sm text-white/60">Recycling Centers</div>
          <div className="text-xs text-white/50 mt-2">Processing {data.recyclingCapacity} tons/day</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-500/30">
          <div className="text-3xl mb-2">🌱</div>
          <div className="text-2xl font-bold text-green-400 mb-1">{data.compostFacilities}</div>
          <div className="text-sm text-white/60">Compost Facilities</div>
          <div className="text-xs text-white/50 mt-2">Processing {data.compostCapacity} tons/day</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-5 border border-orange-500/30">
          <div className="text-3xl mb-2">🏭</div>
          <div className="text-2xl font-bold text-orange-400 mb-1">{data.landfills}</div>
          <div className="text-sm text-white/60">Active Landfills</div>
          <div className="text-xs text-white/50 mt-2">{data.landfillCapacityYears} years capacity remaining</div>
        </div>
      </div>

      <RecommendationsCard
        title="Waste Reduction Strategy"
        recommendations={data.recommendations}
        color="green"
      />
    </div>
  )
}

/**
 * 🦋 Habitat Health Tab
 */
function HabitatHealthTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Biodiversity Health Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Biodiversity Health Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                {data.biodiversityScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.ecosystemsProtected}% of ecosystems under protection
              </p>
            </div>
            <div className="text-8xl opacity-20">🦋</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 rounded-full"
              style={{ width: `${data.biodiversityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Habitat Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.habitats.map((habitat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${habitat.color} rounded-xl p-5 border ${habitat.borderColor}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-3xl mb-2">{habitat.icon}</div>
                <h4 className="font-bold text-lg">{habitat.type}</h4>
                <p className="text-xs text-white/50">{habitat.area} acres</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                habitat.healthStatus === 'Healthy' ? 'bg-green-500/20 text-green-400' :
                habitat.healthStatus === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {habitat.healthStatus}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Species:</span>
                <span className="font-bold">{habitat.speciesCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Endangered:</span>
                <span className="text-red-400 font-bold">{habitat.endangeredCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Species at Risk */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🐾</span> Species Conservation Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.endangeredSpecies.map((species, idx) => (
            <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold">{species.name}</h4>
                  <p className="text-xs text-white/50">{species.scientificName}</p>
                </div>
                <span className="text-2xl">{species.icon}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    species.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    species.status === 'Endangered' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {species.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Population:</span>
                  <span className="font-medium">{species.population}</span>
                </div>
                <div className="text-xs text-white/60 mt-2">
                  Threat: {species.primaryThreat}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RecommendationsCard
        title="Habitat Restoration Plan"
        recommendations={data.recommendations}
        color="emerald"
      />
    </div>
  )
}

// ===== UTILITY COMPONENTS =====

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-cyan-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-white/60 animate-pulse">Analyzing environmental data...</p>
    </div>
  )
}

function MetricCard({ icon, label, value, subtitle, color }) {
  return (
    <div className={`relative group overflow-hidden rounded-xl bg-gradient-to-br ${color} p-4 transition-all hover:scale-105 hover:shadow-xl`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-xs text-white/80 font-medium">{label}</div>
        {subtitle && <div className="text-xs text-white/50 mt-1">{subtitle}</div>}
      </div>
    </div>
  )
}

function PollutantCard({ name, value, unit, level, safeLimit }) {
  const getColor = () => {
    if (value <= safeLimit) return { bg: 'from-green-900/40 to-emerald-900/40', border: 'border-green-500/30', text: 'text-green-400' }
    if (value <= safeLimit * 1.5) return { bg: 'from-yellow-900/40 to-amber-900/40', border: 'border-yellow-500/30', text: 'text-yellow-400' }
    return { bg: 'from-red-900/40 to-pink-900/40', border: 'border-red-500/30', text: 'text-red-400' }
  }
  
  const colors = getColor()
  
  return (
    <div className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-xl p-4`}>
      <div className="text-xs text-white/60 mb-2">{name}</div>
      <div className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</div>
      <div className="text-xs text-white/50">{unit}</div>
      <div className="mt-3 flex justify-between text-xs">
        <span className="text-white/50">Safe limit:</span>
        <span className="font-medium">{safeLimit} {unit}</span>
      </div>
    </div>
  )
}

function ImpactCard({ icon, title, value, description, color }) {
  return (
    <div className={`bg-${color}-500/10 border border-${color}-500/30 rounded-xl p-5`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className={`text-2xl font-bold text-${color}-400 mb-1`}>{value}</div>
      <div className="text-sm font-medium text-white/80 mb-1">{title}</div>
      <div className="text-xs text-white/50">{description}</div>
    </div>
  )
}

function RecommendationsCard({ title, recommendations, color }) {
  return (
    <div className={`bg-${color}-500/10 border border-${color}-500/30 rounded-xl p-6`}>
      <h3 className={`font-bold text-lg mb-4 text-${color}-400 flex items-center gap-2`}>
        <span>💡</span> {title}
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={idx} className="flex items-start gap-3 text-sm">
            <span className="text-lg mt-0.5">{rec.icon}</span>
            <div>
              <div className="font-medium mb-1">{rec.action}</div>
              <div className="text-xs text-white/60">{rec.details}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ===== DATA GENERATORS =====

function generateAirPollutionData(location, airQuality) {
  const aqi = airQuality?.list?.[0]?.main?.aqi 
    ? airQuality.list[0].main.aqi * 50 
    : Math.floor(Math.random() * 150) + 50

  return {
    currentAQI: aqi,
    pollutants: [
      { name: 'PM2.5', value: (Math.random() * 50 + 10).toFixed(1), unit: 'μg/m³', level: 'Moderate', safeLimit: 35 },
      { name: 'PM10', value: (Math.random() * 100 + 20).toFixed(1), unit: 'μg/m³', level: 'Good', safeLimit: 150 },
      { name: 'NO₂', value: (Math.random() * 80 + 20).toFixed(1), unit: 'ppb', level: 'Good', safeLimit: 100 },
      { name: 'O₃', value: (Math.random() * 60 + 30).toFixed(1), unit: 'ppb', level: 'Moderate', safeLimit: 70 },
      { name: 'CO', value: (Math.random() * 5 + 1).toFixed(1), unit: 'ppm', level: 'Good', safeLimit: 9 },
      { name: 'SO₂', value: (Math.random() * 30 + 5).toFixed(1), unit: 'ppb', level: 'Good', safeLimit: 75 }
    ],
    pollutionZones: [
      {
        location: 'Industrial District',
        population: 45000,
        severity: 'High',
        sources: [
          { name: 'Vehicle Emissions', contribution: 42 },
          { name: 'Factory Emissions', contribution: 35 },
          { name: 'Construction Dust', contribution: 23 }
        ]
      },
      {
        location: 'Downtown Core',
        population: 68000,
        severity: 'Moderate',
        sources: [
          { name: 'Traffic Congestion', contribution: 58 },
          { name: 'Commercial Activity', contribution: 25 },
          { name: 'HVAC Systems', contribution: 17 }
        ]
      }
    ],
    healthImpact: {
      respiratoryRisk: '32%',
      cardiovascularRisk: '+18%',
      childrenAffected: 12500
    },
    recommendations: [
      { icon: '🚌', action: 'Expand public transit to reduce vehicle emissions', details: 'Target 30% reduction in car trips by 2028' },
      { icon: '🌳', action: 'Plant 10,000 trees in high-pollution zones', details: 'Trees can reduce PM2.5 by up to 24%' },
      { icon: '🏭', action: 'Mandate emission controls on industrial facilities', details: 'Require scrubbers and filters on all smokestacks' }
    ]
  }
}

function generateWaterQualityData(location) {
  return {
    overallScore: Math.floor(Math.random() * 30) + 65,
    concernSources: 2,
    waterSources: [
      { name: 'Main Reservoir', type: 'Surface Water', quality: 'Excellent', populationServed: 450000, contaminants: 'None detected', icon: '🏞️' },
      { name: 'North Wellfield', type: 'Groundwater', quality: 'Good', populationServed: 180000, contaminants: 'Trace nitrates', icon: '💧' },
      { name: 'River Intake', type: 'Surface Water', quality: 'Fair', populationServed: 120000, contaminants: 'Elevated turbidity', icon: '🌊' },
      { name: 'South Aquifer', type: 'Groundwater', quality: 'Good', populationServed: 95000, contaminants: 'Low minerals', icon: '⛲' }
    ],
    contaminants: [
      { name: 'Lead', level: 3.2, safeLimit: 15, unit: 'ppb' },
      { name: 'Nitrates', level: 8.5, safeLimit: 10, unit: 'mg/L' },
      { name: 'Coliform Bacteria', level: 2, safeLimit: 5, unit: 'CFU/100mL' },
      { name: 'Turbidity', level: 0.8, safeLimit: 1.0, unit: 'NTU' },
      { name: 'Chlorine Residual', level: 1.2, safeLimit: 4.0, unit: 'mg/L' }
    ],
    treatmentPlants: 4,
    dailyCapacityMGD: 185,
    pipeNetworkMiles: 1250,
    avgInfrastructureAge: 42,
    recommendations: [
      { icon: '🔧', action: 'Replace aging pipes in 5 priority zones', details: '125 miles of pipes are 80+ years old and leaking' },
      { icon: '🏗️', action: 'Upgrade River Intake treatment facility', details: 'Add advanced filtration to reduce turbidity' },
      { icon: '💧', action: 'Implement smart water monitoring system', details: 'Real-time sensors to detect contamination early' }
    ]
  }
}

function generateIndustrialImpactData(location) {
  return {
    impactScore: Math.floor(Math.random() * 40) + 50,
    factories: 28,
    powerPlants: 3,
    chemicalPlants: 7,
    heavyIndustry: 12,
    habitatImpact: [
      {
        name: 'Riverside Wetlands',
        type: 'Freshwater Marsh',
        area: 350,
        impactLevel: 'Severe',
        primaryThreat: 'Chemical runoff from upstream industrial park',
        biodiversityLoss: 42,
        protectionStatus: 'Partially protected (60% designated)'
      },
      {
        name: 'Coastal Estuary',
        type: 'Saltwater Habitat',
        area: 580,
        impactLevel: 'Moderate',
        primaryThreat: 'Thermal pollution from power plant cooling',
        biodiversityLoss: 28,
        protectionStatus: 'State conservation area'
      }
    ],
    emissions: [
      { pollutant: 'CO₂', amount: 2400, unit: 'K tons', trend: -5.2 },
      { pollutant: 'Particulate Matter', amount: 180, unit: 'tons', trend: -8.1 },
      { pollutant: 'VOCs', amount: 95, unit: 'tons', trend: 3.4 },
      { pollutant: 'Heavy Metals', amount: 12, unit: 'tons', trend: -15.6 }
    ],
    recommendations: [
      { icon: '🛡️', action: 'Create 500-meter buffer zones around wetlands', details: 'Prohibit industrial expansion near sensitive habitats' },
      { icon: '🏭', action: 'Require closed-loop cooling systems', details: 'Eliminate thermal pollution into waterways' },
      { icon: '🌳', action: 'Mandate reforestation offsets', details: '2 acres restored for every 1 acre developed' }
    ]
  }
}

function generateWasteManagementData(location) {
  return {
    efficiencyScore: Math.floor(Math.random() * 25) + 65,
    diversionRate: Math.floor(Math.random() * 20) + 55,
    annualWasteTons: Math.floor(Math.random() * 200) + 300,
    recyclingRate: Math.floor(Math.random() * 20) + 35,
    compostingRate: Math.floor(Math.random() * 15) + 18,
    wasteToEnergyRate: Math.floor(Math.random() * 10) + 8,
    wasteStreams: [
      { type: 'Organic Waste', percentage: 32, tons: 96000, recyclablePercentage: 85, color: 'from-green-500 to-emerald-500' },
      { type: 'Paper & Cardboard', percentage: 24, tons: 72000, recyclablePercentage: 90, color: 'from-blue-500 to-cyan-500' },
      { type: 'Plastics', percentage: 18, tons: 54000, recyclablePercentage: 45, color: 'from-orange-500 to-red-500' },
      { type: 'Glass & Metals', percentage: 12, tons: 36000, recyclablePercentage: 95, color: 'from-purple-500 to-pink-500' },
      { type: 'E-Waste', percentage: 6, tons: 18000, recyclablePercentage: 75, color: 'from-yellow-500 to-amber-500' },
      { type: 'Other', percentage: 8, tons: 24000, recyclablePercentage: 20, color: 'from-gray-500 to-slate-500' }
    ],
    recyclingCenters: 8,
    recyclingCapacity: 450,
    compostFacilities: 3,
    compostCapacity: 120,
    landfills: 2,
    landfillCapacityYears: 18,
    recommendations: [
      { icon: '♻️', action: 'Expand curbside recycling to all neighborhoods', details: '35% of residents still lack access' },
      { icon: '🌱', action: 'Launch city-wide composting program', details: 'Organic waste is 32% of total - huge opportunity' },
      { icon: '🏭', action: 'Build waste-to-energy facility', details: 'Could power 15,000 homes while reducing landfill use by 40%' }
    ]
  }
}

function generateHabitatHealthData(location) {
  return {
    biodiversityScore: Math.floor(Math.random() * 25) + 68,
    ecosystemsProtected: Math.floor(Math.random() * 20) + 55,
    habitats: [
      {
        type: 'Freshwater',
        icon: '🌊',
        area: 2400,
        healthStatus: 'Moderate',
        speciesCount: 156,
        endangeredCount: 8,
        color: 'from-blue-900/40 to-cyan-900/40',
        borderColor: 'border-blue-500/30'
      },
      {
        type: 'Forest',
        icon: '🌲',
        area: 4800,
        healthStatus: 'Healthy',
        speciesCount: 289,
        endangeredCount: 12,
        color: 'from-green-900/40 to-emerald-900/40',
        borderColor: 'border-green-500/30'
      },
      {
        type: 'Coastal',
        icon: '🏖️',
        area: 1200,
        healthStatus: 'Threatened',
        speciesCount: 198,
        endangeredCount: 15,
        color: 'from-cyan-900/40 to-blue-900/40',
        borderColor: 'border-cyan-500/30'
      }
    ],
    endangeredSpecies: [
      {
        name: 'River Otter',
        scientificName: 'Lontra canadensis',
        status: 'Endangered',
        population: '120-150',
        primaryThreat: 'Habitat loss',
        icon: '🦦'
      },
      {
        name: 'Blue Heron',
        scientificName: 'Ardea herodias',
        status: 'Vulnerable',
        population: '85 pairs',
        primaryThreat: 'Water pollution',
        icon: '🦅'
      },
      {
        name: 'Native Trout',
        scientificName: 'Salvelinus fontinalis',
        status: 'Critical',
        population: '<500',
        primaryThreat: 'Warming waters',
        icon: '🐟'
      },
      {
        name: 'Monarch Butterfly',
        scientificName: 'Danaus plexippus',
        status: 'Endangered',
        population: 'Declining',
        primaryThreat: 'Pesticides',
        icon: '🦋'
      }
    ],
    recommendations: [
      { icon: '🌿', action: 'Restore 500 acres of wetland habitat', details: 'Critical for river otter and blue heron recovery' },
      { icon: '🚫', action: 'Ban pesticide use in protected areas', details: 'Save monarch butterfly populations' },
      { icon: '❄️', action: 'Create cold-water refuges for native trout', details: 'Deep pools with tree shade to combat warming' }
    ]
  }
}

export { 
  generateAirPollutionData, 
  generateWaterQualityData, 
  generateIndustrialImpactData, 
  generateWasteManagementData,
  generateHabitatHealthData 
}
