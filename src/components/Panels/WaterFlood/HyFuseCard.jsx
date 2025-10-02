import React, { useEffect, useState } from 'react'
import { fetchHyFuseTiles, fetchHyFuseTile } from '../../../lib/nasa/hyfuse'

/**
 * HyFuseCard Component
 * 
 * Displays HyFuse scores for the current map view with:
 * - Overall score (0-100) with color coding
 * - Component breakdown (rain, soil moisture, GRACE, inundation)
 * - Confidence meter
 * - Actionable recommendations
 */
export default function HyFuseCard({ bbox, center, onTileSelect, onGenerateFieldPack }) {
  const [tiles, setTiles] = useState([])
  const [selectedTile, setSelectedTile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aggWindow, setAggWindow] = useState(7)

  useEffect(() => {
    let active = true
    async function load() {
      if (!bbox || bbox.length !== 4) return

      try {
        setLoading(true)
        setError('')
        const data = await fetchHyFuseTiles(bbox, new Date().toISOString().slice(0, 10), aggWindow)
        if (!active) return
        setTiles(data.features || [])
        
        // Auto-select first tile if available
        if (data.features?.length > 0 && !selectedTile) {
          const tileId = data.features[0].properties.tile_id
          loadTileDetails(tileId)
        }
      } catch (e) {
        console.error(e)
        setError('Failed to load HyFuse data')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [bbox, aggWindow])

  async function loadTileDetails(tileId) {
    try {
      const data = await fetchHyFuseTile(tileId)
      setSelectedTile(data)
      onTileSelect?.(tileId)
    } catch (e) {
      console.error('Failed to load tile details:', e)
    }
  }

  function getScoreColor(score) {
    if (score >= 80) return 'text-red-400 bg-red-500/20'
    if (score >= 60) return 'text-orange-400 bg-orange-500/20'
    if (score >= 40) return 'text-yellow-400 bg-yellow-500/20'
    if (score >= 20) return 'text-blue-400 bg-blue-500/20'
    return 'text-green-400 bg-green-500/20'
  }

  function getScoreLabel(score) {
    if (score >= 80) return 'Critical'
    if (score >= 60) return 'High Risk'
    if (score >= 40) return 'Moderate'
    if (score >= 20) return 'Low Risk'
    return 'Minimal'
  }

  function renderComponentBar(label, value, max, color) {
    const percentage = (value / max) * 100
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-white/70">{label}</span>
          <span className="text-white font-mono">{value.toFixed(1)}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${color} transition-all duration-500`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-white/70">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nasa-blue"></div>
        <span className="ml-3">Loading HyFuse data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
        {error}
      </div>
    )
  }

  if (tiles.length === 0) {
    return (
      <div className="text-center py-8 text-white/60 text-sm">
        No HyFuse tiles available for this area.
        <br />
        Try zooming or panning the map.
      </div>
    )
  }

  const avgScore = tiles.reduce((sum, t) => sum + t.properties.hyfuse_score, 0) / tiles.length

  return (
    <div className="space-y-4">
      {/* Aggregation Window Selector */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/70">Time window:</span>
        {[7, 30, 90].map(days => (
          <button
            key={days}
            onClick={() => setAggWindow(days)}
            className={`px-2 py-1 rounded ${
              aggWindow === days
                ? 'bg-nasa-blue text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {days}d
          </button>
        ))}
      </div>

      {/* Average Score Card */}
      <div className={`p-4 rounded-lg border ${getScoreColor(avgScore)}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-white/70 mb-1">Area Average HyFuse Score</div>
            <div className="text-3xl font-bold">{avgScore.toFixed(0)}</div>
            <div className="text-xs mt-1">{getScoreLabel(avgScore)}</div>
          </div>
          <div className="text-5xl opacity-50">💧</div>
        </div>
        <div className="mt-3 text-xs text-white/60">
          Analyzing {tiles.length} tiles in current view
        </div>
      </div>

      {/* Selected Tile Details */}
      {selectedTile && (
        <div className="space-y-3 p-4 bg-space-900/40 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Component Breakdown</h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/60">Confidence:</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-nasa-blue"
                    style={{ width: `${selectedTile.confidence * 100}%` }}
                  />
                </div>
                <span className="font-mono">{(selectedTile.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {renderComponentBar(
              'Recent Rainfall',
              selectedTile.components.recent_rain_mm,
              100,
              'bg-blue-500'
            )}
            {renderComponentBar(
              'Soil Moisture',
              selectedTile.components.soil_moisture_index * 100,
              100,
              'bg-amber-600'
            )}
            {renderComponentBar(
              'GRACE Anomaly',
              Math.abs(selectedTile.components.grace_anomaly_mm),
              50,
              selectedTile.components.grace_anomaly_mm > 0 ? 'bg-cyan-500' : 'bg-red-500'
            )}
            {renderComponentBar(
              'Inundation Events',
              selectedTile.components.recent_inundation_count,
              10,
              'bg-indigo-500'
            )}
          </div>

          {/* Recommendations */}
          {selectedTile.recommendations && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <h4 className="text-xs font-semibold text-white/80">Recommended Actions:</h4>
              <ul className="space-y-1 text-xs text-white/70">
                {selectedTile.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-nasa-blue mt-0.5">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onGenerateFieldPack}
            className="w-full mt-3 px-4 py-2 bg-nasa-blue hover:bg-nasa-blue/80 text-white text-sm rounded-lg font-medium transition-colors"
          >
            📦 Generate Field Pack for This Area
          </button>
        </div>
      )}

      {/* Tile Selector */}
      {tiles.length > 1 && (
        <div className="space-y-2">
          <div className="text-xs text-white/70">Select tile to view details:</div>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {tiles.map(tile => {
              const props = tile.properties
              const isSelected = selectedTile?.tile_id === props.tile_id
              return (
                <button
                  key={props.tile_id}
                  onClick={() => loadTileDetails(props.tile_id)}
                  className={`p-2 rounded text-left text-xs border transition-colors ${
                    isSelected
                      ? 'bg-nasa-blue/20 border-nasa-blue'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="font-mono text-[10px] text-white/50 truncate mb-1">
                    {props.tile_id.slice(0, 12)}...
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(props.hyfuse_score).split(' ')[0]}`}>
                    {props.hyfuse_score}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
