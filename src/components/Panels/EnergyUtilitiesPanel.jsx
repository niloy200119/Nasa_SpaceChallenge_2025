/**
 * ⚡ Energy & Utilities Panel
 * Electricity access, energy sources, grid infrastructure, renewable potential
 * Features: Coverage maps, gap analysis, renewable energy tracking
 */

import React, { useState, useEffect } from 'react'

export default function EnergyUtilitiesPanel({ location, cityName, visible }) {
  const [activeTab, setActiveTab] = useState('access')
  const [energyData, setEnergyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!visible || !location) return

    const analyzeEnergy = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setEnergyData({
        access: generateAccessData(location),
        grid: generateGridData(location),
        sources: generateEnergySourcesData(location),
        renewable: generateRenewableData(location)
      })
      
      setLoading(false)
    }

    analyzeEnergy()
  }, [location, visible])

  if (!visible) return null

  const tabs = [
    { id: 'access', label: '💡 Access', icon: '🔌', color: 'yellow' },
    { id: 'grid', label: '🔌 Grid', icon: '⚡', color: 'blue' },
    { id: 'sources', label: '⚡ Sources', icon: '🏭', color: 'purple' },
    { id: 'renewable', label: '🌞 Renewable', icon: '♻️', color: 'green' }
  ]

  return (
    <div className="bg-gradient-to-br from-space-900 via-space-800 to-space-900 text-white p-6 rounded-2xl shadow-2xl h-full overflow-y-auto backdrop-blur-xl border border-white/10">
      {/* Header */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-green-500/20 rounded-xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <span className="text-4xl">⚡</span>
            <span className="bg-gradient-to-r from-yellow-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
              Energy & Utilities
            </span>
          </h2>
          <p className="text-sm text-white/60 ml-16">
            {cityName} - Power Access & Infrastructure Analysis
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
          {activeTab === 'access' && <AccessTab data={energyData.access} cityName={cityName} />}
          {activeTab === 'grid' && <GridTab data={energyData.grid} cityName={cityName} />}
          {activeTab === 'sources' && <EnergySourcesTab data={energyData.sources} cityName={cityName} />}
          {activeTab === 'renewable' && <RenewableTab data={energyData.renewable} cityName={cityName} />}
        </>
      )}
    </div>
  )
}

/**
 * 💡 Access Tab - Electricity access and gaps
 */
function AccessTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Energy Access Alert */}
      {data.populationWithoutAccess > 5 && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-4 border-red-500 rounded-xl p-5 backdrop-blur-md animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-400 text-lg mb-1">Energy Access Gap</h3>
              <p className="text-sm text-white/80">
                {data.populationWithoutAccess}% of {cityName} residents lack reliable electricity access
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Access Coverage Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-md rounded-2xl p-8 border border-yellow-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-2">Electricity Access Rate</h3>
              <div className="text-7xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {data.accessRate}%
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.householdsConnected.toLocaleString()} of {data.totalHouseholds.toLocaleString()} households
              </p>
            </div>
            <div className="text-9xl opacity-20">💡</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-400 rounded-full"
              style={{ width: `${data.accessRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon="🏠" label="Connected Homes" value={data.householdsConnected.toLocaleString()} color="from-green-500 to-green-600" />
        <MetricCard icon="⚠️" label="Without Access" value={data.householdsWithoutAccess.toLocaleString()} color="from-red-500 to-red-600" />
        <MetricCard icon="💰" label="Avg Monthly Cost" value={`$${data.avgMonthlyCost}`} color="from-blue-500 to-blue-600" />
        <MetricCard icon="⚡" label="Reliability Score" value={`${data.reliabilityScore}%`} color="from-purple-500 to-purple-600" />
      </div>

      {/* Access Gap Regions */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📍</span> Communities Without Reliable Access
        </h3>
        <div className="space-y-4">
          {data.gapRegions.map((region, idx) => (
            <div key={idx} className="group hover:bg-white/5 rounded-xl p-5 transition-all border border-red-500/20">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg">{region.name}</h4>
                  <p className="text-xs text-white/50">
                    {region.population.toLocaleString()} residents • {region.households.toLocaleString()} households
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  region.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  region.severity === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {region.severity}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="text-xs text-white/60 mb-1">Current Access:</div>
                  <div className="text-2xl font-bold text-red-400">{region.currentAccess}%</div>
                </div>
                <div>
                  <div className="text-xs text-white/60 mb-1">Distance to Grid:</div>
                  <div className="text-lg font-bold text-orange-400">{region.distanceToGrid} miles</div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">⚠️</span>
                  <div>
                    <span className="text-white/60">Primary Issue:</span>
                    <span className="ml-2 text-white/80">{region.primaryIssue}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">💡</span>
                  <div>
                    <span className="text-white/60">Recommended Solution:</span>
                    <span className="ml-2 text-white/80">{region.solution}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">💰</span>
                  <div>
                    <span className="text-white/60">Estimated Cost:</span>
                    <span className="ml-2 text-white/80">${region.estimatedCost}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Affordability Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-500/30">
          <div className="text-3xl mb-2">💚</div>
          <div className="text-2xl font-bold text-green-400 mb-1">{data.affordability.affordable}%</div>
          <div className="text-sm text-white/60">Households: Affordable</div>
          <div className="text-xs text-white/50 mt-2">&lt; 6% of income</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-5 border border-yellow-500/30">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-yellow-400 mb-1">{data.affordability.burdensome}%</div>
          <div className="text-sm text-white/60">Households: Burdened</div>
          <div className="text-xs text-white/50 mt-2">6-10% of income</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/40 to-pink-900/40 rounded-xl p-5 border border-red-500/30">
          <div className="text-3xl mb-2">🚨</div>
          <div className="text-2xl font-bold text-red-400 mb-1">{data.affordability.energyPoverty}%</div>
          <div className="text-sm text-white/60">Energy Poverty</div>
          <div className="text-xs text-white/50 mt-2">&gt; 10% of income</div>
        </div>
      </div>

      <RecommendationsCard
        title="Energy Access Expansion Plan"
        recommendations={data.recommendations}
        color="yellow"
      />
    </div>
  )
}

/**
 * 🔌 Grid Tab - Infrastructure and reliability
 */
function GridTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Grid Health Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md rounded-2xl p-8 border border-blue-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Grid Health Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {data.healthScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.healthScore >= 80 ? 'Excellent Condition' : data.healthScore >= 60 ? 'Good Condition' : 'Needs Improvement'}
              </p>
            </div>
            <div className="text-8xl opacity-20">⚡</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-400 rounded-full"
              style={{ width: `${data.healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon="⚡" label="Total Capacity" value={`${data.totalCapacityMW} MW`} color="from-blue-500 to-blue-600" />
        <MetricCard icon="📊" label="Peak Demand" value={`${data.peakDemandMW} MW`} color="from-purple-500 to-purple-600" />
        <MetricCard icon="🔌" label="Substations" value={data.substations} color="from-green-500 to-green-600" />
        <MetricCard icon="📏" label="Trans. Lines" value={`${data.transmissionLinesMiles} mi`} color="from-orange-500 to-orange-600" />
      </div>

      {/* Reliability Metrics */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📊</span> Reliability Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/70">SAIDI (System Average Interruption Duration Index)</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                data.saidi < 120 ? 'bg-green-500/20 text-green-400' :
                data.saidi < 240 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {data.saidi < 120 ? 'Excellent' : data.saidi < 240 ? 'Good' : 'Needs Work'}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-1">{data.saidi} min/year</div>
            <div className="text-xs text-white/50">Average outage time per customer annually</div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-white/70">SAIFI (System Average Interruption Frequency Index)</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                data.saifi < 1.0 ? 'bg-green-500/20 text-green-400' :
                data.saifi < 2.0 ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {data.saifi < 1.0 ? 'Excellent' : data.saifi < 2.0 ? 'Good' : 'Needs Work'}
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">{data.saifi.toFixed(2)} events/year</div>
            <div className="text-xs text-white/50">Average number of interruptions per customer</div>
          </div>
        </div>
      </div>

      {/* Infrastructure Age */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏗️</span> Infrastructure Age & Condition
        </h3>
        <div className="space-y-4">
          {data.infrastructureAge.map((component, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="text-sm font-medium">{component.component}</span>
                  <span className="ml-3 text-xs text-white/50">{component.totalUnits} units</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/50">Avg Age: {component.avgAge} years</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    component.condition === 'Good' ? 'bg-green-500/20 text-green-400' :
                    component.condition === 'Fair' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {component.condition}
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${
                    component.condition === 'Good' ? 'bg-green-500' :
                    component.condition === 'Fair' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${component.replacementNeeded}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-white/50">
                {component.replacementNeeded}% needs replacement within 5 years
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-500/30">
          <div className="text-3xl mb-2">📡</div>
          <div className="text-2xl font-bold text-green-400 mb-1">{data.smartMeters}%</div>
          <div className="text-sm text-white/60">Smart Meter Coverage</div>
          <div className="text-xs text-white/50 mt-2">{data.smartMeterCount.toLocaleString()} installed</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-5 border border-blue-500/30">
          <div className="text-3xl mb-2">🤖</div>
          <div className="text-2xl font-bold text-blue-400 mb-1">{data.automatedGridControl}%</div>
          <div className="text-sm text-white/60">Grid Automation</div>
          <div className="text-xs text-white/50 mt-2">Self-healing capabilities</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl p-5 border border-purple-500/30">
          <div className="text-3xl mb-2">🔋</div>
          <div className="text-2xl font-bold text-purple-400 mb-1">{data.batteryStorageMW} MW</div>
          <div className="text-sm text-white/60">Battery Storage</div>
          <div className="text-xs text-white/50 mt-2">{data.storageHours} hours capacity</div>
        </div>
      </div>

      <RecommendationsCard
        title="Grid Modernization Plan"
        recommendations={data.recommendations}
        color="blue"
      />
    </div>
  )
}

/**
 * ⚡ Energy Sources Tab
 */
function EnergySourcesTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Energy Mix Breakdown */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <span>⚡</span> Current Energy Mix
        </h3>
        
        {/* Visual Energy Mix */}
        <div className="mb-6">
          <div className="flex h-12 rounded-xl overflow-hidden">
            {data.energyMix.map((source, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${source.color} flex items-center justify-center text-xs font-bold transition-all hover:opacity-80`}
                style={{ width: `${source.percentage}%` }}
                title={`${source.name}: ${source.percentage}%`}
              >
                {source.percentage > 8 && source.icon}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/50">
            {data.energyMix.map((source, idx) => (
              <span key={idx}>{source.percentage}%</span>
            ))}
          </div>
        </div>
        
        {/* Detailed Breakdown */}
        <div className="space-y-3">
          {data.energyMix.map((source, idx) => (
            <div key={idx} className={`bg-gradient-to-r ${source.color}/10 border ${source.borderColor} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{source.icon}</span>
                  <div>
                    <h4 className="font-bold">{source.name}</h4>
                    <p className="text-xs text-white/50">{source.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{source.percentage}%</div>
                  <div className="text-xs text-white/50">{source.capacityMW} MW</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm mt-3">
                <div>
                  <div className="text-xs text-white/60">Annual Output:</div>
                  <div className="font-medium">{source.annualGWh} GWh</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Emissions:</div>
                  <div className={`font-medium ${source.co2Intensity === 0 ? 'text-green-400' : 'text-orange-400'}`}>
                    {source.co2Intensity} g CO₂/kWh
                  </div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Cost:</div>
                  <div className="font-medium">${source.costPerKWh}/kWh</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Footprint */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-6 border border-orange-500/30">
          <div className="text-4xl mb-3">🏭</div>
          <div className="text-3xl font-bold text-orange-400 mb-2">{data.annualEmissions} Mt</div>
          <div className="text-sm text-white/60 mb-3">Annual CO₂ Emissions</div>
          <div className={`text-sm ${data.emissionsTrend < 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.emissionsTrend > 0 ? '↑' : '↓'} {Math.abs(data.emissionsTrend)}% vs last year
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-6 border border-green-500/30">
          <div className="text-4xl mb-3">🎯</div>
          <div className="text-3xl font-bold text-green-400 mb-2">{data.carbonNeutralTarget}</div>
          <div className="text-sm text-white/60 mb-3">Carbon Neutral Target</div>
          <div className="text-sm text-white/50">
            {data.yearsToTarget} years remaining • {data.reductionNeeded}% reduction needed
          </div>
        </div>
      </div>

      <RecommendationsCard
        title="Energy Transition Strategy"
        recommendations={data.recommendations}
        color="purple"
      />
    </div>
  )
}

/**
 * 🌞 Renewable Energy Tab
 */
function RenewableTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Renewable Energy Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-green-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Renewable Energy Share</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {data.renewableShare}%
              </div>
              <p className="text-sm text-white/60 mt-2">
                Of total energy generation
              </p>
            </div>
            <div className="text-8xl opacity-20">♻️</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 rounded-full"
              style={{ width: `${data.renewableShare}%` }}
            />
          </div>
        </div>
      </div>

      {/* Renewable Potential Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.renewablePotential.map((source, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${source.color} rounded-xl p-6 border ${source.borderColor}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-4xl mb-2">{source.icon}</div>
                <h4 className="font-bold text-lg">{source.type}</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                source.potential === 'High' ? 'bg-green-500/20 text-green-400' :
                source.potential === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-orange-500/20 text-orange-400'
              }`}>
                {source.potential} Potential
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-white/60">Current Capacity:</span>
                  <span className="font-bold">{source.currentMW} MW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Potential Capacity:</span>
                  <span className="font-bold text-green-400">{source.potentialMW} MW</span>
                </div>
              </div>
              
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500"
                  style={{ width: `${(source.currentMW / source.potentialMW) * 100}%` }}
                />
              </div>
              
              <div className="text-xs text-white/50">
                <div className="mb-1"><strong>Advantages:</strong> {source.advantages}</div>
                <div><strong>Challenges:</strong> {source.challenges}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Renewable Projects */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🚀</span> Active Renewable Projects
        </h3>
        <div className="space-y-3">
          {data.activeProjects.map((project, idx) => (
            <div key={idx} className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold">{project.name}</h4>
                  <p className="text-xs text-white/50">{project.type} • {project.location}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  project.status === 'Operational' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Under Construction' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-xs text-white/60">Capacity:</div>
                  <div className="font-bold">{project.capacityMW} MW</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Investment:</div>
                  <div className="font-bold">${project.investment}M</div>
                </div>
                <div>
                  <div className="text-xs text-white/60">Completion:</div>
                  <div className="font-bold">{project.completion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Solar Programs */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏘️</span> Community Energy Programs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-xl p-5 border border-yellow-500/30">
            <div className="text-3xl mb-2">☀️</div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">{data.communitySolar.participants.toLocaleString()}</div>
            <div className="text-sm text-white/60 mb-2">Community Solar Participants</div>
            <div className="text-xs text-white/50">
              {data.communitySolar.capacityMW} MW installed • {data.communitySolar.savings}% avg savings
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-500/30">
            <div className="text-3xl mb-2">💚</div>
            <div className="text-2xl font-bold text-green-400 mb-1">{data.greenEnergyProgram.subscribers.toLocaleString()}</div>
            <div className="text-sm text-white/60 mb-2">Green Energy Subscribers</div>
            <div className="text-xs text-white/50">
              100% renewable • +{data.greenEnergyProgram.premiumPercent}% premium
            </div>
          </div>
        </div>
      </div>

      <RecommendationsCard
        title="Renewable Energy Expansion Plan"
        recommendations={data.recommendations}
        color="green"
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
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-white/60 animate-pulse">Analyzing energy data...</p>
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

function generateAccessData(location) {
  const accessRate = Math.floor(Math.random() * 15) + 85 // 85-100%
  const totalHouseholds = Math.floor(Math.random() * 200000) + 150000
  const householdsConnected = Math.floor((totalHouseholds * accessRate) / 100)
  
  return {
    accessRate,
    totalHouseholds,
    householdsConnected,
    householdsWithoutAccess: totalHouseholds - householdsConnected,
    avgMonthlyCost: Math.floor(Math.random() * 50) + 95,
    reliabilityScore: Math.floor(Math.random() * 20) + 75,
    populationWithoutAccess: 100 - accessRate,
    gapRegions: [
      {
        name: 'Rural North',
        population: 18000,
        households: 5200,
        currentAccess: 45,
        distanceToGrid: 12.5,
        severity: 'Critical',
        primaryIssue: 'Remote location, high connection costs',
        solution: 'Microgrid with solar + battery storage',
        estimatedCost: '8.5M'
      },
      {
        name: 'Mountain Communities',
        population: 8500,
        households: 2400,
        currentAccess: 62,
        distanceToGrid: 8.2,
        severity: 'High',
        primaryIssue: 'Difficult terrain, aging infrastructure',
        solution: 'Grid extension + local renewable generation',
        estimatedCost: '5.2M'
      },
      {
        name: 'Outer Suburbs',
        population: 12000,
        households: 3600,
        currentAccess: 78,
        distanceToGrid: 4.5,
        severity: 'Moderate',
        primaryIssue: 'Rapid growth, infrastructure lag',
        solution: 'Substation expansion + new distribution lines',
        estimatedCost: '3.8M'
      }
    ],
    affordability: {
      affordable: 68,
      burdensome: 22,
      energyPoverty: 10
    },
    recommendations: [
      { icon: '⚡', action: 'Deploy 3 microgrids in underserved areas', details: 'Solar + storage for 15,000+ residents without access' },
      { icon: '💰', action: 'Launch low-income energy assistance program', details: 'Subsidize 50% of costs for households in energy poverty' },
      { icon: '📡', action: 'Implement smart meters citywide', details: 'Enable time-of-use pricing and demand response' }
    ]
  }
}

function generateGridData(location) {
  return {
    healthScore: Math.floor(Math.random() * 25) + 70,
    totalCapacityMW: Math.floor(Math.random() * 1500) + 2000,
    peakDemandMW: Math.floor(Math.random() * 1000) + 1500,
    substations: Math.floor(Math.random() * 30) + 45,
    transmissionLinesMiles: Math.floor(Math.random() * 500) + 850,
    saidi: Math.floor(Math.random() * 180) + 90, // minutes
    saifi: (Math.random() * 1.5 + 0.5).toFixed(2), // events
    infrastructureAge: [
      { component: 'Transformers', avgAge: 32, totalUnits: 450, condition: 'Fair', replacementNeeded: 42 },
      { component: 'Transmission Lines', avgAge: 45, totalUnits: 850, condition: 'Poor', replacementNeeded: 58 },
      { component: 'Substations', avgAge: 28, totalUnits: 45, condition: 'Good', replacementNeeded: 22 },
      { component: 'Distribution Lines', avgAge: 38, totalUnits: 3200, condition: 'Fair', replacementNeeded: 35 }
    ],
    smartMeters: Math.floor(Math.random() * 30) + 65,
    smartMeterCount: Math.floor(Math.random() * 100000) + 200000,
    automatedGridControl: Math.floor(Math.random() * 20) + 55,
    batteryStorageMW: Math.floor(Math.random() * 100) + 150,
    storageHours: (Math.random() * 2 + 2).toFixed(1),
    recommendations: [
      { icon: '🔧', action: 'Replace 580 miles of aging transmission lines', details: 'Priority: Lines over 50 years old in high-risk zones' },
      { icon: '🤖', action: 'Deploy AI-powered grid management system', details: 'Predictive maintenance and real-time load balancing' },
      { icon: '🔋', action: 'Triple battery storage capacity to 450 MW', details: 'Support renewable integration and grid stability' }
    ]
  }
}

function generateEnergySourcesData(location) {
  return {
    energyMix: [
      { name: 'Natural Gas', type: 'Fossil Fuel', percentage: 38, capacityMW: 1520, annualGWh: 6650, co2Intensity: 490, costPerKWh: 0.045, icon: '🔥', color: 'from-orange-500 to-red-500', borderColor: 'border-orange-500/30' },
      { name: 'Coal', type: 'Fossil Fuel', percentage: 22, capacityMW: 880, annualGWh: 3850, co2Intensity: 820, costPerKWh: 0.038, icon: '⛏️', color: 'from-gray-600 to-gray-800', borderColor: 'border-gray-500/30' },
      { name: 'Nuclear', type: 'Low Carbon', percentage: 18, capacityMW: 720, annualGWh: 6300, co2Intensity: 12, costPerKWh: 0.042, icon: '☢️', color: 'from-purple-500 to-indigo-500', borderColor: 'border-purple-500/30' },
      { name: 'Solar', type: 'Renewable', percentage: 12, capacityMW: 480, annualGWh: 840, co2Intensity: 0, costPerKWh: 0.035, icon: '☀️', color: 'from-yellow-400 to-orange-400', borderColor: 'border-yellow-500/30' },
      { name: 'Wind', type: 'Renewable', percentage: 7, capacityMW: 280, annualGWh: 615, co2Intensity: 0, costPerKWh: 0.032, icon: '💨', color: 'from-cyan-400 to-blue-400', borderColor: 'border-cyan-500/30' },
      { name: 'Hydro', type: 'Renewable', percentage: 3, capacityMW: 120, annualGWh: 525, co2Intensity: 0, costPerKWh: 0.028, icon: '🌊', color: 'from-blue-500 to-cyan-500', borderColor: 'border-blue-500/30' }
    ],
    annualEmissions: (Math.random() * 3 + 4).toFixed(1),
    emissionsTrend: (Math.random() * 10 - 5).toFixed(1),
    carbonNeutralTarget: '2045',
    yearsToTarget: 20,
    reductionNeeded: 82,
    recommendations: [
      { icon: '☀️', action: 'Accelerate solar deployment to 30% by 2030', details: 'Add 1,500 MW capacity over 5 years' },
      { icon: '⛏️', action: 'Phase out all coal plants by 2035', details: 'Replace with renewables + storage' },
      { icon: '💨', action: 'Develop offshore wind potential', details: 'Target 500 MW offshore wind by 2032' }
    ]
  }
}

function generateRenewableData(location) {
  return {
    renewableShare: Math.floor(Math.random() * 15) + 20, // 20-35%
    renewablePotential: [
      {
        type: 'Solar PV',
        icon: '☀️',
        potential: 'High',
        currentMW: 480,
        potentialMW: 2400,
        advantages: 'Abundant sunlight 300+ days/year, declining costs',
        challenges: 'Land use, grid integration',
        color: 'from-yellow-900/40 to-orange-900/40',
        borderColor: 'border-yellow-500/30'
      },
      {
        type: 'Wind Energy',
        icon: '💨',
        potential: 'Medium',
        currentMW: 280,
        potentialMW: 850,
        advantages: 'Coastal winds, offshore potential',
        challenges: 'Intermittency, wildlife impact',
        color: 'from-cyan-900/40 to-blue-900/40',
        borderColor: 'border-cyan-500/30'
      },
      {
        type: 'Hydroelectric',
        icon: '🌊',
        potential: 'Low',
        currentMW: 120,
        potentialMW: 180,
        advantages: 'Reliable baseload, storage capability',
        challenges: 'Limited suitable sites, environmental concerns',
        color: 'from-blue-900/40 to-cyan-900/40',
        borderColor: 'border-blue-500/30'
      },
      {
        type: 'Geothermal',
        icon: '🌋',
        potential: 'Medium',
        currentMW: 0,
        potentialMW: 320,
        advantages: '24/7 baseload, minimal land use',
        challenges: 'High upfront costs, geological surveys needed',
        color: 'from-red-900/40 to-orange-900/40',
        borderColor: 'border-red-500/30'
      }
    ],
    activeProjects: [
      {
        name: 'Sunrise Solar Farm',
        type: 'Solar PV',
        location: 'East County',
        status: 'Under Construction',
        capacityMW: 250,
        investment: 180,
        completion: 'Q2 2026'
      },
      {
        name: 'Coastal Wind Project',
        type: 'Offshore Wind',
        location: '15 miles offshore',
        status: 'Planning',
        capacityMW: 400,
        investment: 850,
        completion: 'Q4 2028'
      },
      {
        name: 'Battery Storage Hub',
        type: 'Energy Storage',
        location: 'Central Grid',
        status: 'Operational',
        capacityMW: 150,
        investment: 95,
        completion: 'Completed'
      }
    ],
    communitySolar: {
      participants: 12500,
      capacityMW: 45,
      savings: 18
    },
    greenEnergyProgram: {
      subscribers: 38000,
      premiumPercent: 3.5
    },
    recommendations: [
      { icon: '☀️', action: 'Launch rooftop solar incentive program', details: '$5,000 rebate + tax credits for residential installations' },
      { icon: '🏢', action: 'Mandate solar on all new commercial buildings', details: 'Buildings over 10,000 sq ft starting 2026' },
      { icon: '🌊', action: 'Fast-track offshore wind permitting', details: 'Streamline process to deploy 400 MW by 2028' }
    ]
  }
}

export { generateAccessData, generateGridData, generateEnergySourcesData, generateRenewableData }
