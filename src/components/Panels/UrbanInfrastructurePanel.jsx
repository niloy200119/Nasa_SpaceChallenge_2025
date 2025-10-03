/**
 * 🏙️ Urban Infrastructure Panel
 * Comprehensive analysis of food access, housing, transportation, healthcare, and parks
 * Features: Heatmaps, accessibility scores, visual indicators, growth tracking
 */

import React, { useState, useEffect } from 'react'

export default function UrbanInfrastructurePanel({ location, cityName, visible }) {
  const [activeTab, setActiveTab] = useState('food')
  const [infrastructureData, setInfrastructureData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!visible || !location) return

    const analyzeInfrastructure = async () => {
      setLoading(true)
      // Simulate data fetch - in production, integrate with OpenStreetMap, Census APIs, etc.
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setInfrastructureData({
        foodAccess: generateFoodAccessData(location),
        housing: generateHousingData(location),
        transportation: generateTransportationData(location),
        healthcare: generateHealthcareData(location),
        parks: generateParksData(location)
      })
      
      setLoading(false)
    }

    analyzeInfrastructure()
  }, [location, visible])

  if (!visible) return null

  const tabs = [
    { id: 'food', label: '🍎 Food Access', icon: '🥗', color: 'green' },
    { id: 'housing', label: '🏘️ Housing', icon: '🏠', color: 'blue' },
    { id: 'transport', label: '🚇 Transit', icon: '🚊', color: 'purple' },
    { id: 'health', label: '🏥 Healthcare', icon: '⚕️', color: 'red' },
    { id: 'parks', label: '🌳 Parks', icon: '🌲', color: 'emerald' }
  ]

  return (
    <div className="bg-gradient-to-br from-space-900 via-space-800 to-space-900 text-white p-6 rounded-2xl shadow-2xl h-full overflow-y-auto backdrop-blur-xl border border-white/10">
      {/* Header with Glassmorphism */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl" />
        <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <span className="text-4xl">🏙️</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Urban Infrastructure
            </span>
          </h2>
          <p className="text-sm text-white/60 ml-16">
            {cityName} - Community Access & Development Analysis
          </p>
        </div>
      </div>

      {/* Animated Tab Navigation */}
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
            {activeTab === tab.id && (
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {activeTab === 'food' && <FoodAccessTab data={infrastructureData.foodAccess} cityName={cityName} />}
          {activeTab === 'housing' && <HousingTab data={infrastructureData.housing} cityName={cityName} />}
          {activeTab === 'transport' && <TransportationTab data={infrastructureData.transportation} cityName={cityName} />}
          {activeTab === 'health' && <HealthcareTab data={infrastructureData.healthcare} cityName={cityName} />}
          {activeTab === 'parks' && <ParksTab data={infrastructureData.parks} cityName={cityName} />}
        </>
      )}
    </div>
  )
}

/**
 * 🍎 Food Access Tab
 * Shows food deserts, grocery stores, farmers markets, food banks
 */
function FoodAccessTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Food Desert Alert */}
      {data.foodDesertRisk > 40 && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-4 border-red-500 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-400 text-lg mb-1">Food Desert Alert</h3>
              <p className="text-sm text-white/80">
                {data.foodDesertRisk}% of {cityName} residents live in food deserts (1+ mile from fresh food)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Access Score - Large Visual Card */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md rounded-2xl p-8 border border-green-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Food Access Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {data.accessScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.accessScore >= 75 ? 'Excellent Access' : 
                 data.accessScore >= 50 ? 'Moderate Access' : 'Limited Access'}
              </p>
            </div>
            <div className="text-8xl opacity-20">🍎</div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 rounded-full animate-pulse"
              style={{ width: `${data.accessScore}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon="🏪"
          label="Grocery Stores"
          value={data.groceryStores}
          subtitle="Within 1 mile"
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          icon="🧺"
          label="Farmers Markets"
          value={data.farmersMarkets}
          subtitle="Active markets"
          color="from-green-500 to-green-600"
        />
        <MetricCard
          icon="🏦"
          label="Food Banks"
          value={data.foodBanks}
          subtitle="Community support"
          color="from-purple-500 to-purple-600"
        />
        <MetricCard
          icon="🚚"
          label="Delivery Coverage"
          value={`${data.deliveryCoverage}%`}
          subtitle="Population served"
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Community Needs Heatmap */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📍</span> Community Needs by District
        </h3>
        <div className="space-y-3">
          {data.districts.map((district, idx) => (
            <div key={idx} className="group hover:bg-white/5 rounded-xl p-4 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="font-medium">{district.name}</span>
                  <span className="ml-3 text-xs text-white/50">
                    {district.population.toLocaleString()} residents
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  district.needLevel === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  district.needLevel === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  district.needLevel === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {district.needLevel}
                </span>
              </div>
              
              {/* Visual Need Indicator */}
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded ${
                      i < district.needScore / 10
                        ? district.needLevel === 'Critical' ? 'bg-red-500' :
                          district.needLevel === 'High' ? 'bg-orange-500' :
                          district.needLevel === 'Moderate' ? 'bg-yellow-500' :
                          'bg-green-500'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              
              <div className="mt-3 text-xs text-white/60">
                <span className="mr-4">🏪 {district.storesWithin1Mile} stores</span>
                <span>🚶 {district.avgWalkTime} min avg walk</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsCard
        title="Recommended Actions"
        recommendations={data.recommendations}
        color="green"
      />
    </div>
  )
}

/**
 * 🏘️ Housing Tab
 * Housing density, affordability, development needs
 */
function HousingTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Housing Crisis Alert */}
      {data.affordabilityIndex < 40 && (
        <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-l-4 border-red-500 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <h3 className="font-bold text-red-400 text-lg mb-1">Housing Affordability Crisis</h3>
              <p className="text-sm text-white/80">
                Only {data.affordabilityIndex}% of residents can afford median home prices
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          icon="🏠"
          label="Total Housing Units"
          value={data.totalUnits.toLocaleString()}
          trend={data.unitGrowth}
          color="blue"
        />
        <StatCard
          icon="👥"
          label="Population Density"
          value={`${data.densityPerSqMile.toLocaleString()}/mi²`}
          trend={data.densityGrowth}
          color="purple"
        />
        <StatCard
          icon="💰"
          label="Median Home Price"
          value={`$${(data.medianPrice / 1000).toFixed(0)}K`}
          trend={data.priceGrowth}
          color="green"
        />
        <StatCard
          icon="📊"
          label="Vacancy Rate"
          value={`${data.vacancyRate}%`}
          trend={-data.vacancyChange}
          color="orange"
        />
        <StatCard
          icon="🏗️"
          label="New Construction"
          value={data.newUnitsThisYear.toLocaleString()}
          subtitle="This year"
          color="cyan"
        />
        <StatCard
          icon="📈"
          label="Growth Rate"
          value={`+${data.growthRate}%`}
          subtitle="Year over year"
          color="pink"
        />
      </div>

      {/* Housing Type Breakdown */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏘️</span> Housing Distribution
        </h3>
        <div className="space-y-4">
          {data.housingTypes.map((type, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{type.type}</span>
                <span className="text-sm font-bold">{type.percentage}%</span>
              </div>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${type.color} transition-all duration-1000`}
                  style={{ width: `${type.percentage}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-white/50">
                {type.units.toLocaleString()} units • Avg: ${type.avgPrice.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Areas Map */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📍</span> High-Growth Development Zones
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.growthZones.map((zone, idx) => (
            <div key={idx} className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl p-5 border border-blue-500/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg">{zone.name}</h4>
                  <p className="text-xs text-white/60">{zone.type}</p>
                </div>
                <span className="text-2xl">{zone.icon}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">New Units Planned:</span>
                  <span className="font-bold text-blue-400">{zone.plannedUnits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Timeline:</span>
                  <span className="font-medium">{zone.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Priority Level:</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    zone.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                    zone.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {zone.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsCard
        title="Development Recommendations"
        recommendations={data.recommendations}
        color="blue"
      />
    </div>
  )
}

/**
 * 🚇 Transportation Tab
 * Transit networks, accessibility, mobility hubs
 */
function TransportationTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Transit Coverage Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Transit Access Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {data.transitScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.transitScore >= 75 ? 'Excellent Coverage' : 
                 data.transitScore >= 50 ? 'Moderate Coverage' : 'Limited Coverage'}
              </p>
            </div>
            <div className="text-8xl opacity-20">🚇</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 rounded-full"
              style={{ width: `${data.transitScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transit Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon="🚊"
          label="Transit Lines"
          value={data.transitLines}
          subtitle={`${data.stationsCount} stations`}
          color="from-purple-500 to-purple-600"
        />
        <MetricCard
          icon="🚌"
          label="Bus Routes"
          value={data.busRoutes}
          subtitle={`${data.busStops} stops`}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          icon="🚴"
          label="Bike Lanes"
          value={`${data.bikeLanesMiles} mi`}
          subtitle="Protected lanes"
          color="from-green-500 to-green-600"
        />
        <MetricCard
          icon="🚗"
          label="Park & Ride"
          value={data.parkRideFacilities}
          subtitle={`${data.parkRideSpaces} spaces`}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Transit Gaps Analysis */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>⚠️</span> Transit Access Gaps
        </h3>
        <div className="space-y-3">
          {data.transitGaps.map((gap, idx) => (
            <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold">{gap.area}</h4>
                  <p className="text-sm text-white/60">{gap.population.toLocaleString()} residents affected</p>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                  {gap.distance} mi to nearest stop
                </span>
              </div>
              <p className="text-sm text-white/80 mb-2">{gap.impact}</p>
              <div className="text-xs text-white/50">
                Recommended: {gap.solution}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobility Hubs */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🚏</span> Major Transit Hubs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.majorHubs.map((hub, idx) => (
            <div key={idx} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-xl p-5 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold">{hub.name}</h4>
                <span className="text-2xl">{hub.icon}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Daily Passengers:</span>
                  <span className="font-bold text-blue-400">{hub.dailyPassengers.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hub.connections.map((conn, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs">
                      {conn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsCard
        title="Transit Improvement Plan"
        recommendations={data.recommendations}
        color="purple"
      />
    </div>
  )
}

/**
 * 🏥 Healthcare Tab
 * Hospital locations, access to care, health facilities
 */
function HealthcareTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Healthcare Access Alert */}
      {data.accessScore < 50 && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-l-4 border-red-500 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <h3 className="font-bold text-red-400 text-lg mb-1">Healthcare Access Concern</h3>
              <p className="text-sm text-white/80">
                {data.populationWithoutAccess}% of residents live 30+ minutes from emergency care
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Healthcare Coverage Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur-md rounded-2xl p-8 border border-red-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Healthcare Access Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                {data.accessScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                Based on proximity, capacity, and availability
              </p>
            </div>
            <div className="text-8xl opacity-20">🏥</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-pink-500 to-red-400 rounded-full"
              style={{ width: `${data.accessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon="🏥"
          label="Hospitals"
          value={data.hospitals}
          subtitle={`${data.beds.toLocaleString()} beds`}
          color="from-red-500 to-red-600"
        />
        <MetricCard
          icon="🏪"
          label="Clinics"
          value={data.clinics}
          subtitle="Primary care"
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          icon="💊"
          label="Pharmacies"
          value={data.pharmacies}
          subtitle="24/7 available"
          color="from-green-500 to-green-600"
        />
        <MetricCard
          icon="🚑"
          label="Urgent Care"
          value={data.urgentCare}
          subtitle="Emergency ready"
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Capacity Analysis */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📊</span> Healthcare Capacity
        </h3>
        <div className="space-y-4">
          {data.capacityMetrics.map((metric, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">{metric.category}</span>
                  <span className="ml-3 text-xs text-white/50">{metric.subtitle}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  metric.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  metric.status === 'Strained' ? 'bg-orange-500/20 text-orange-400' :
                  metric.status === 'Adequate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {metric.status}
                </span>
              </div>
              <div className="relative h-3 bg-black/30 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${
                    metric.utilization > 85 ? 'bg-red-500' :
                    metric.utilization > 70 ? 'bg-orange-500' :
                    metric.utilization > 50 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${metric.utilization}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-white/50">
                {metric.utilization}% capacity • {metric.available} {metric.unit} available
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Facility Locations */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>📍</span> Recommended New Facilities
        </h3>
        <div className="space-y-3">
          {data.recommendedFacilities.map((facility, idx) => (
            <div key={idx} className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl p-5 border border-blue-500/30">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg">{facility.type}</h4>
                  <p className="text-sm text-white/60">{facility.location}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  facility.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  facility.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {facility.priority}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Population Served:</span>
                  <span className="font-bold">{facility.populationServed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Current Gap:</span>
                  <span className="text-red-400 font-bold">{facility.currentGap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Estimated Cost:</span>
                  <span className="font-bold">${facility.estimatedCost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsCard
        title="Healthcare Improvement Plan"
        recommendations={data.recommendations}
        color="red"
      />
    </div>
  )
}

/**
 * 🌳 Parks Tab
 * Green spaces, recreation access, environmental benefits
 */
function ParksTab({ data, cityName }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Park Access Score */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
        <div className="relative bg-gradient-to-br from-emerald-900/40 to-green-900/40 backdrop-blur-md rounded-2xl p-8 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-2">Park Access Score</h3>
              <div className="text-6xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                {data.accessScore}
              </div>
              <p className="text-sm text-white/60 mt-2">
                {data.populationWithinWalk}% of residents within 10-min walk
              </p>
            </div>
            <div className="text-8xl opacity-20">🌳</div>
          </div>
          
          <div className="relative h-4 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-400 rounded-full"
              style={{ width: `${data.accessScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Green Space Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon="🏞️"
          label="Total Parks"
          value={data.totalParks}
          subtitle={`${data.totalAcres} acres`}
          color="from-emerald-500 to-emerald-600"
        />
        <MetricCard
          icon="🎾"
          label="Sports Facilities"
          value={data.sportsFacilities}
          subtitle="Fields & courts"
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          icon="🌲"
          label="Tree Canopy"
          value={`${data.treeCanopy}%`}
          subtitle="Coverage"
          color="from-green-500 to-green-600"
        />
        <MetricCard
          icon="🚶"
          label="Walking Trails"
          value={`${data.trailMiles} mi`}
          subtitle="Maintained paths"
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Park Access Gaps */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🗺️</span> Neighborhoods Needing Parks
        </h3>
        <div className="space-y-3">
          {data.parkGaps.map((gap, idx) => (
            <div key={idx} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold">{gap.neighborhood}</h4>
                  <p className="text-sm text-white/60">{gap.population.toLocaleString()} residents</p>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                  {gap.distance} from nearest park
                </span>
              </div>
              <p className="text-sm text-white/80 mb-2">
                Current: {gap.greenSpacePerCapita} sq ft per person (Goal: 300 sq ft)
              </p>
              <div className="text-xs text-emerald-400">
                ✓ Recommended: {gap.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Benefits */}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🌍</span> Environmental Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 rounded-xl p-5 border border-blue-500/30">
            <div className="text-3xl mb-2">💧</div>
            <div className="text-2xl font-bold text-blue-400 mb-1">{data.stormwaterManaged}M gal</div>
            <div className="text-sm text-white/60">Stormwater Managed Annually</div>
          </div>
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-xl p-5 border border-green-500/30">
            <div className="text-3xl mb-2">🌳</div>
            <div className="text-2xl font-bold text-green-400 mb-1">{data.carbonSequestered}K tons</div>
            <div className="text-sm text-white/60">Carbon Sequestered/Year</div>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-red-900/40 rounded-xl p-5 border border-orange-500/30">
            <div className="text-3xl mb-2">🌡️</div>
            <div className="text-2xl font-bold text-orange-400 mb-1">-{data.heatReduction}°F</div>
            <div className="text-sm text-white/60">Urban Heat Reduction</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <RecommendationsCard
        title="Green Space Development Plan"
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
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-white/60 animate-pulse">Analyzing infrastructure data...</p>
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

function StatCard({ icon, label, value, trend, subtitle, color }) {
  return (
    <div className={`bg-${color}-500/10 border border-${color}-500/30 rounded-xl p-4`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-sm font-bold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold text-${color}-400 mb-1`}>{value}</div>
      <div className="text-xs text-white/60">{label}</div>
      {subtitle && <div className="text-xs text-white/50 mt-1">{subtitle}</div>}
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

// ===== DATA GENERATORS (Mock - Replace with real APIs) =====

function generateFoodAccessData(location) {
  return {
    accessScore: Math.floor(Math.random() * 30) + 55, // 55-85
    foodDesertRisk: Math.floor(Math.random() * 40) + 20, // 20-60%
    groceryStores: Math.floor(Math.random() * 15) + 8,
    farmersMarkets: Math.floor(Math.random() * 8) + 3,
    foodBanks: Math.floor(Math.random() * 6) + 2,
    deliveryCoverage: Math.floor(Math.random() * 20) + 70,
    districts: [
      {
        name: 'Downtown Core',
        population: 45000,
        needLevel: 'Low',
        needScore: 25,
        storesWithin1Mile: 12,
        avgWalkTime: 8
      },
      {
        name: 'East Side',
        population: 32000,
        needLevel: 'Critical',
        needScore: 85,
        storesWithin1Mile: 2,
        avgWalkTime: 25
      },
      {
        name: 'North District',
        population: 28000,
        needLevel: 'High',
        needScore: 70,
        storesWithin1Mile: 4,
        avgWalkTime: 18
      },
      {
        name: 'West End',
        population: 38000,
        needLevel: 'Moderate',
        needScore: 45,
        storesWithin1Mile: 6,
        avgWalkTime: 12
      }
    ],
    recommendations: [
      { icon: '🏪', action: 'Build 2 grocery stores in East Side', details: 'Would serve 32,000 residents currently in food desert' },
      { icon: '🚚', action: 'Expand delivery services to underserved areas', details: 'Partner with local farms for fresh produce delivery' },
      { icon: '🧺', action: 'Add 3 farmers markets in North District', details: 'Seasonal markets every weekend, focus on affordability' }
    ]
  }
}

function generateHousingData(location) {
  return {
    totalUnits: Math.floor(Math.random() * 50000) + 80000,
    densityPerSqMile: Math.floor(Math.random() * 3000) + 2000,
    medianPrice: Math.floor(Math.random() * 200000) + 250000,
    vacancyRate: (Math.random() * 5 + 2).toFixed(1),
    newUnitsThisYear: Math.floor(Math.random() * 3000) + 1500,
    growthRate: (Math.random() * 4 + 1).toFixed(1),
    affordabilityIndex: Math.floor(Math.random() * 40) + 35,
    unitGrowth: (Math.random() * 5 + 1).toFixed(1),
    densityGrowth: (Math.random() * 3 + 0.5).toFixed(1),
    priceGrowth: (Math.random() * 8 + 2).toFixed(1),
    vacancyChange: (Math.random() * 2 - 1).toFixed(1),
    housingTypes: [
      { type: 'Single-Family Homes', percentage: 45, units: 54000, avgPrice: 385000, color: 'from-blue-500 to-blue-600' },
      { type: 'Apartments', percentage: 30, units: 36000, avgPrice: 215000, color: 'from-purple-500 to-purple-600' },
      { type: 'Condominiums', percentage: 15, units: 18000, avgPrice: 295000, color: 'from-green-500 to-green-600' },
      { type: 'Townhouses', percentage: 10, units: 12000, avgPrice: 315000, color: 'from-orange-500 to-orange-600' }
    ],
    growthZones: [
      {
        name: 'Riverside Development',
        type: 'Mixed-Use',
        icon: '🏗️',
        plannedUnits: 2500,
        timeline: '2025-2028',
        priority: 'Critical'
      },
      {
        name: 'Tech Hub Expansion',
        type: 'High-Density Residential',
        icon: '🏢',
        plannedUnits: 1800,
        timeline: '2026-2029',
        priority: 'High'
      },
      {
        name: 'Suburban Fill-In',
        type: 'Single-Family',
        icon: '🏡',
        plannedUnits: 950,
        timeline: '2025-2027',
        priority: 'Moderate'
      },
      {
        name: 'Urban Core Revitalization',
        type: 'Mixed-Use',
        icon: '🌆',
        plannedUnits: 3200,
        timeline: '2025-2030',
        priority: 'Critical'
      }
    ],
    recommendations: [
      { icon: '🏗️', action: 'Fast-track Riverside Development permits', details: '2,500 units would ease housing shortage by 18%' },
      { icon: '💰', action: 'Implement affordability requirements', details: '25% of new units should be affordable housing' },
      { icon: '🚇', action: 'Focus development near transit hubs', details: 'Reduce car dependency and increase accessibility' }
    ]
  }
}

function generateTransportationData(location) {
  return {
    transitScore: Math.floor(Math.random() * 30) + 60,
    transitLines: Math.floor(Math.random() * 8) + 4,
    stationsCount: Math.floor(Math.random() * 40) + 25,
    busRoutes: Math.floor(Math.random() * 50) + 30,
    busStops: Math.floor(Math.random() * 300) + 200,
    bikeLanesMiles: Math.floor(Math.random() * 80) + 45,
    parkRideFacilities: Math.floor(Math.random() * 12) + 6,
    parkRideSpaces: Math.floor(Math.random() * 3000) + 2000,
    transitGaps: [
      {
        area: 'Industrial District',
        population: 18000,
        distance: 1.8,
        impact: 'Workers rely on personal vehicles, contributing to traffic congestion',
        solution: 'Add shuttle service or extend bus route 42'
      },
      {
        area: 'Suburban Northeast',
        population: 25000,
        distance: 2.3,
        impact: 'Limited public transit forces car dependency for commuters',
        solution: 'Establish new park & ride facility with express bus to downtown'
      }
    ],
    majorHubs: [
      {
        name: 'Central Station',
        icon: '🚉',
        dailyPassengers: 85000,
        connections: ['Metro Red', 'Metro Blue', '15 Bus Routes', 'Regional Rail']
      },
      {
        name: 'Airport Transit Center',
        icon: '✈️',
        dailyPassengers: 42000,
        connections: ['Metro Green', 'Airport Shuttle', '8 Bus Routes']
      }
    ],
    recommendations: [
      { icon: '🚌', action: 'Extend bus route 42 to Industrial District', details: 'Would serve 18,000 workers currently without transit' },
      { icon: '🚲', action: 'Connect bike lanes into continuous network', details: 'Add 15 miles of protected lanes to close gaps' },
      { icon: '🚏', action: 'Build Northeast Park & Ride facility', details: 'Reduce traffic by 3,500 vehicles daily' }
    ]
  }
}

function generateHealthcareData(location) {
  return {
    accessScore: Math.floor(Math.random() * 35) + 55,
    populationWithoutAccess: Math.floor(Math.random() * 20) + 12,
    hospitals: Math.floor(Math.random() * 8) + 5,
    beds: Math.floor(Math.random() * 2000) + 1500,
    clinics: Math.floor(Math.random() * 25) + 18,
    pharmacies: Math.floor(Math.random() * 40) + 30,
    urgentCare: Math.floor(Math.random() * 12) + 8,
    capacityMetrics: [
      { category: 'ICU Beds', subtitle: '125 total', utilization: 78, status: 'Strained', available: 28, unit: 'beds' },
      { category: 'Emergency Dept', subtitle: '4 locations', utilization: 92, status: 'Critical', available: 3, unit: 'beds' },
      { category: 'Primary Care', subtitle: '38 providers', utilization: 65, status: 'Adequate', available: 13, unit: 'slots/day' },
      { category: 'Mental Health', subtitle: '22 specialists', utilization: 85, status: 'Strained', available: 3, unit: 'therapists' }
    ],
    recommendedFacilities: [
      {
        type: 'Urgent Care Center',
        location: 'West End (Highway 45 & Oak St)',
        priority: 'Critical',
        populationServed: 42000,
        currentGap: '35 min to nearest facility',
        estimatedCost: '$4.2M'
      },
      {
        type: 'Community Health Clinic',
        location: 'East Side (Main St & 15th Ave)',
        priority: 'High',
        populationServed: 28000,
        currentGap: '45 min to primary care',
        estimatedCost: '$2.8M'
      },
      {
        type: 'Mental Health Center',
        location: 'Downtown (Central Plaza)',
        priority: 'High',
        populationServed: 65000,
        currentGap: '2-month wait times',
        estimatedCost: '$3.5M'
      }
    ],
    recommendations: [
      { icon: '🏥', action: 'Build West End Urgent Care immediately', details: 'Would reduce ER overcrowding by 20%' },
      { icon: '👨‍⚕️', action: 'Recruit 8 more primary care physicians', details: 'Current ratio: 1 doctor per 2,800 residents (goal: 1:1,500)' },
      { icon: '🧠', action: 'Expand mental health services', details: 'Add telehealth options and 5 more therapists' }
    ]
  }
}

function generateParksData(location) {
  return {
    accessScore: Math.floor(Math.random() * 30) + 65,
    populationWithinWalk: Math.floor(Math.random() * 25) + 68,
    totalParks: Math.floor(Math.random() * 40) + 35,
    totalAcres: Math.floor(Math.random() * 1500) + 800,
    sportsFacilities: Math.floor(Math.random() * 30) + 22,
    treeCanopy: Math.floor(Math.random() * 20) + 35,
    trailMiles: Math.floor(Math.random() * 60) + 45,
    stormwaterManaged: (Math.random() * 50 + 150).toFixed(1),
    carbonSequestered: (Math.random() * 15 + 25).toFixed(1),
    heatReduction: (Math.random() * 3 + 4).toFixed(1),
    parkGaps: [
      {
        neighborhood: 'Industrial South',
        population: 22000,
        distance: '1.5 miles',
        greenSpacePerCapita: 45,
        recommendation: 'Convert 8-acre brownfield site into community park with sports fields'
      },
      {
        neighborhood: 'High-Rise District',
        population: 18000,
        distance: '0.8 miles',
        greenSpacePerCapita: 82,
        recommendation: 'Create rooftop gardens and pocket parks between buildings'
      }
    ],
    recommendations: [
      { icon: '🏞️', action: 'Build community park in Industrial South', details: '8-acre park would serve 22,000 residents' },
      { icon: '🌳', action: 'Plant 5,000 trees citywide over 3 years', details: 'Increase canopy coverage from 35% to 42%' },
      { icon: '🚶', action: 'Connect trails into 100-mile network', details: 'Add 55 miles of new multi-use paths' }
    ]
  }
}

export { generateFoodAccessData, generateHousingData, generateTransportationData, generateHealthcareData, generateParksData }
