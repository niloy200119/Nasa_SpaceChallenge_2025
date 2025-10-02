/**
 * Transportation & Mobility Panel
 * Real-time traffic, mobility risk analysis, route optimization
 */

import React, { useState, useEffect } from 'react'
import { 
  calculateMobilityRisk,
  analyzeTrafficPatterns,
  optimizeEvacuationRoutes,
  analyzePublicTransitImpact,
  calculateAccessibility,
  predictTrafficCongestion
} from '../../lib/nasa/mobility'

export default function MobilityPanel({ location, bbox, visible }) {
  const [mobilityData, setMobilityData] = useState(null)
  const [trafficData, setTrafficData] = useState(null)
  const [routes, setRoutes] = useState([])
  const [transitImpact, setTransitImpact] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')

  useEffect(() => {
    if (!visible || !location) return

    const fetchMobilityData = async () => {
      setLoading(true)
      try {
        // Fetch all mobility data in parallel
        const [mobility, traffic, evacuationRoutes, transit] = await Promise.all([
          calculateMobilityRisk(location, bbox),
          analyzeTrafficPatterns(bbox),
          optimizeEvacuationRoutes(location, bbox),
          analyzePublicTransitImpact(location, bbox)
        ])

        setMobilityData(mobility)
        setTrafficData(traffic)
        setRoutes(evacuationRoutes.routes || [])
        setTransitImpact(transit)
      } catch (error) {
        console.error('Error fetching mobility data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMobilityData()
    
    // Refresh every 2 minutes for traffic updates
    const interval = setInterval(fetchMobilityData, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location, bbox, visible])

  if (!visible) return null

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 rounded-xl shadow-2xl h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
          🚗 Transportation & Mobility
        </h2>
        <p className="text-sm text-gray-400">
          Real-time traffic analysis and mobility risk assessment
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-700">
        {['overview', 'traffic', 'routes', 'transit'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              selectedTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading mobility data...</p>
          </div>
        </div>
      )}

      {!loading && mobilityData && (
        <>
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Overall Mobility Risk */}
              <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Mobility Risk Score</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative w-full h-8 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full transition-all ${
                          mobilityData.overallRisk > 70 ? 'bg-red-500' :
                          mobilityData.overallRisk > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${mobilityData.overallRisk}%` }}
                      />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${
                    mobilityData.overallRisk > 70 ? 'text-red-400' :
                    mobilityData.overallRisk > 40 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {Math.round(mobilityData.overallRisk)}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {mobilityData.overallRisk > 70 ? '🔴 High Risk - Significant mobility disruptions expected' :
                   mobilityData.overallRisk > 40 ? '🟡 Moderate Risk - Some delays and congestion' :
                   '🟢 Low Risk - Normal traffic conditions'}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Road Accessibility</div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(mobilityData.accessibility?.overall || 0)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {mobilityData.accessibility?.blockedRoads || 0} roads affected
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Traffic Congestion</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {mobilityData.trafficLevel || 'Normal'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Avg delay: {mobilityData.avgDelay || 0} min
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Public Transit Impact</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round(mobilityData.transitImpact || 0)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {mobilityData.affectedRoutes || 0} routes disrupted
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Evacuation Capacity</div>
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(mobilityData.evacuationCapacity || 0)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {mobilityData.safeRoutes || 0} routes available
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Risk Factors</h3>
                <div className="space-y-2">
                  {mobilityData.riskFactors?.map((factor, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{factor.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              factor.impact > 70 ? 'bg-red-500' :
                              factor.impact > 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${factor.impact}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-12 text-right">
                          {Math.round(factor.impact)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Traffic Tab */}
          {selectedTab === 'traffic' && trafficData && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Traffic Patterns</h3>
                
                {/* Traffic hotspots */}
                <div className="space-y-3">
                  {trafficData.hotspots?.slice(0, 5).map((hotspot, idx) => (
                    <div key={idx} className="bg-slate-700 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{hotspot.location}</div>
                          <div className="text-xs text-gray-400">{hotspot.type}</div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          hotspot.severity === 'High' ? 'bg-red-500' :
                          hotspot.severity === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}>
                          {hotspot.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300">
                        🚗 Volume: {hotspot.volume} vehicles/hour
                      </div>
                      <div className="text-sm text-gray-300">
                        ⏱️ Delay: {hotspot.delay} minutes
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Congestion forecast */}
              <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Congestion Forecast (Next 6 Hours)</h3>
                <div className="space-y-2">
                  {trafficData.forecast?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{item.time}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              item.level > 70 ? 'bg-red-500' :
                              item.level > 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${item.level}%` }}
                          />
                        </div>
                        <span className="text-xs w-16">{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Routes Tab */}
          {selectedTab === 'routes' && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Evacuation Routes</h3>
                
                {routes.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No evacuation routes available for this location
                  </p>
                ) : (
                  <div className="space-y-3">
                    {routes.map((route, idx) => (
                      <div key={idx} className="bg-slate-700 p-4 rounded">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-lg">Route {idx + 1}</div>
                            <div className="text-sm text-gray-400">
                              {route.from} → {route.to}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded ${
                            route.status === 'Optimal' ? 'bg-green-500' :
                            route.status === 'Available' ? 'bg-blue-500' :
                            route.status === 'Congested' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {route.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <div className="text-gray-400">Distance</div>
                            <div className="font-medium">{route.distance} km</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Duration</div>
                            <div className="font-medium">{route.duration} min</div>
                          </div>
                          <div>
                            <div className="text-gray-400">Capacity</div>
                            <div className="font-medium">{route.capacity}</div>
                          </div>
                        </div>

                        {route.warnings && route.warnings.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-600">
                            {route.warnings.map((warning, wIdx) => (
                              <div key={wIdx} className="text-xs text-yellow-400 flex items-start gap-2">
                                <span>⚠️</span>
                                <span>{warning}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Transit Tab */}
          {selectedTab === 'transit' && transitImpact && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Public Transit Impact</h3>
                
                <div className="space-y-4">
                  {/* Overall impact */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">System-wide Impact</span>
                      <span className="text-lg font-bold text-orange-400">
                        {Math.round(transitImpact.overallImpact || 0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${transitImpact.overallImpact}%` }}
                      />
                    </div>
                  </div>

                  {/* Affected services */}
                  <div className="grid grid-cols-2 gap-3">
                    {transitImpact.services?.map((service, idx) => (
                      <div key={idx} className="bg-slate-700 p-3 rounded">
                        <div className="font-medium mb-1">{service.type}</div>
                        <div className="text-2xl font-bold text-blue-400">
                          {service.affected}/{service.total}
                        </div>
                        <div className="text-xs text-gray-400">routes affected</div>
                      </div>
                    ))}
                  </div>

                  {/* Disruptions */}
                  {transitImpact.disruptions?.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Active Disruptions</h4>
                      <div className="space-y-2">
                        {transitImpact.disruptions.map((disruption, idx) => (
                          <div key={idx} className="bg-red-900/30 border border-red-500/50 p-3 rounded">
                            <div className="flex items-start gap-2">
                              <span className="text-red-400">🚨</span>
                              <div className="flex-1">
                                <div className="font-medium">{disruption.line}</div>
                                <div className="text-sm text-gray-300">{disruption.description}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Duration: {disruption.duration}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Recommendations */}
      {mobilityData && (
        <div className="mt-6 bg-blue-900/30 border border-blue-500/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            💡 Recommendations
          </h3>
          <ul className="space-y-2 text-sm">
            {mobilityData.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Last updated */}
      <div className="mt-6 text-xs text-center text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
