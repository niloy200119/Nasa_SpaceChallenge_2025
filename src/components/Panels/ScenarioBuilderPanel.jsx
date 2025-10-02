import React, { useState, useEffect } from 'react'
import { getScenarioAspects, simulateScenario, getScenarioPreparednessActions } from '../../lib/nasa/scenarios'

export default function ScenarioBuilderPanel({ location, disasters = [] }) {
  const [selectedDisaster, setSelectedDisaster] = useState('Floods')
  const [severity, setSeverity] = useState('Moderate')
  const [duration, setDuration] = useState(24)
  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const disasterTypes = [
    'Floods',
    'Wildfires',
    'Earthquakes',
    'Severe Storms',
    'Temperature Extremes',
    'Drought',
    'Landslides'
  ]

  const severityLevels = ['Low', 'Moderate', 'High', 'Severe']

  // Run simulation
  const runSimulation = async () => {
    setLoading(true)
    try {
      const sim = await simulateScenario(selectedDisaster, severity, location, duration)
      setSimulation(sim)
      setCurrentTime(0)
      setIsPlaying(false)
    } catch (error) {
      console.error('Simulation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-play simulation
  useEffect(() => {
    if (!isPlaying || !simulation) return

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= simulation.timeline.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1000) // 1 second per time step

    return () => clearInterval(interval)
  }, [isPlaying, simulation])

  const aspects = getScenarioAspects(selectedDisaster)
  const actions = getScenarioPreparednessActions(selectedDisaster, severity)
  const currentData = simulation?.timeline[currentTime]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          🎭 Scenario Builder
        </h2>
        <div className="text-xs text-white/50">Disaster Simulation</div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-space-800/60 backdrop-blur-soft rounded-lg border border-white/10 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white/80">Configure Scenario</h3>

        {/* Disaster Type Selection */}
        <div>
          <label className="text-xs text-white/70 block mb-2">Disaster Type</label>
          <div className="grid grid-cols-2 gap-2">
            {disasterTypes.map(type => {
              const typeAspects = getScenarioAspects(type)
              return (
                <button
                  key={type}
                  onClick={() => setSelectedDisaster(type)}
                  className={`p-2 rounded-lg border text-sm transition-all ${
                    selectedDisaster === type
                      ? 'bg-nasa-blue border-blue-400 text-white'
                      : 'bg-space-700/50 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  <span className="text-lg mr-1">{typeAspects.icon}</span>
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Severity Selection */}
        <div>
          <label className="text-xs text-white/70 block mb-2">Severity Level</label>
          <div className="grid grid-cols-4 gap-2">
            {severityLevels.map(level => (
              <button
                key={level}
                onClick={() => setSeverity(level)}
                className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                  severity === level
                    ? level === 'Severe' ? 'bg-red-600 border-red-400' :
                      level === 'High' ? 'bg-orange-600 border-orange-400' :
                      level === 'Moderate' ? 'bg-yellow-600 border-yellow-400' :
                      'bg-green-600 border-green-400'
                    : 'bg-space-700/50 border-white/10 text-white/70 hover:border-white/30'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="text-xs text-white/70 block mb-2">
            Duration: {duration} hours
          </label>
          <input
            type="range"
            min="6"
            max="72"
            step="6"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-white/50 mt-1">
            <span>6h</span>
            <span>24h</span>
            <span>48h</span>
            <span>72h</span>
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={runSimulation}
          disabled={loading}
          className="w-full py-3 bg-nasa-blue hover:bg-blue-600 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Simulating...' : '▶️ Run Simulation'}
        </button>
      </div>

      {/* Simulation Results */}
      {simulation && (
        <>
          {/* Playback Controls */}
          <div className="bg-space-800/60 backdrop-blur-soft rounded-lg border border-white/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white/80">Simulation Timeline</h3>
              <div className="text-xs text-white/50">
                Hour {currentTime} of {simulation.timeline.length - 1}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-space-700 rounded-full mb-3 overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full bg-${simulation.color}-500 transition-all duration-300`}
                style={{ width: `${(currentTime / (simulation.timeline.length - 1)) * 100}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 1))}
                className="px-3 py-1 bg-space-700 hover:bg-space-600 rounded text-xs"
                disabled={currentTime === 0}
              >
                ◀
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-1 bg-nasa-blue hover:bg-blue-600 rounded text-xs font-semibold"
              >
                {isPlaying ? '⏸ Pause' : '▶️ Play'}
              </button>
              <button
                onClick={() => setCurrentTime(Math.min(simulation.timeline.length - 1, currentTime + 1))}
                className="px-3 py-1 bg-space-700 hover:bg-space-600 rounded text-xs"
                disabled={currentTime === simulation.timeline.length - 1}
              >
                ▶
              </button>
              <button
                onClick={() => setCurrentTime(0)}
                className="ml-auto px-3 py-1 bg-space-700 hover:bg-space-600 rounded text-xs"
              >
                ⏮ Reset
              </button>
            </div>
          </div>

          {/* Current Conditions */}
          {currentData && (
            <div className="bg-space-800/60 backdrop-blur-soft rounded-lg border border-white/10 p-4">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                {simulation.icon} Current Conditions
                <span className="text-[10px] text-white/50 font-normal">
                  {new Date(currentData.timestamp).toLocaleString()}
                </span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {simulation.aspects.slice(0, 6).map(aspect => {
                  const value = currentData.aspectValues[aspect.id]
                  const displayValue = typeof value === 'number' 
                    ? `${value}${aspect.unit || ''}` 
                    : value

                  return (
                    <div key={aspect.id} className="bg-space-700/50 rounded p-3">
                      <div className="text-[10px] text-white/50 mb-1">{aspect.name}</div>
                      <div className="text-lg font-bold">{displayValue}</div>
                      {aspect.ranges && (
                        <div className="mt-1">
                          {aspect.ranges.map(range => (
                            parseFloat(value) >= parseFloat(range.value.split('-')[0]) &&
                            parseFloat(value) <= (parseFloat(range.value.split('-')[1]) || 999) && (
                              <div key={range.level} className={`text-[10px] text-${range.color}-400`}>
                                {range.level}: {range.impact}
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Scenario Summary */}
          <div className="bg-space-800/60 backdrop-blur-soft rounded-lg border border-white/10 p-4">
            <h3 className="text-sm font-semibold text-white/80 mb-3">📊 Impact Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Estimated Impact:</span>
                <span className={`font-semibold ${
                  simulation.summary.estimatedImpact === 'Severe' ? 'text-red-400' :
                  simulation.summary.estimatedImpact === 'High' ? 'text-orange-400' :
                  simulation.summary.estimatedImpact === 'Moderate' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {simulation.summary.estimatedImpact}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Affected Population:</span>
                <span className="font-semibold">{simulation.summary.affectedPopulation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Economic Loss:</span>
                <span className="font-semibold text-red-400">{simulation.summary.economicLoss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Evacuation Needed:</span>
                <span className={`font-semibold ${simulation.summary.evacuationNeeded ? 'text-red-400' : 'text-green-400'}`}>
                  {simulation.summary.evacuationNeeded ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-white/70 mb-2">Response Units Required:</div>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                {Object.entries(simulation.summary.responseUnitsRequired).map(([key, value]) => (
                  <div key={key} className="bg-space-700/50 rounded p-2">
                    <div className="text-white/50">{key}</div>
                    <div className="text-base font-bold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preparedness Actions */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              ✅ Preparedness Checklist
            </h3>
            <ul className="space-y-2">
              {actions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-white/80">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* No Simulation State */}
      {!simulation && !loading && (
        <div className="bg-space-800/60 backdrop-blur-soft rounded-lg border border-white/10 p-8 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-sm font-semibold text-white/80 mb-2">No Active Simulation</h3>
          <p className="text-xs text-white/60">
            Configure a scenario above and click "Run Simulation" to see disaster-specific impacts and timeline.
          </p>
        </div>
      )}
    </div>
  )
}
