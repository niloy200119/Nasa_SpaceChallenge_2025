import React, { useEffect, useState } from 'react'
import { fetchFloodScenes, fetchFloodMask } from '../../../lib/nasa/hyfuse'

/**
 * FloodMaskOverlay Component
 * 
 * Displays SAR-derived flood masks with:
 * - Timeline of available scenes
 * - Date scrubber to view historic floods
 * - Confidence filtering
 * - Toggle to show/hide overlay on map
 */
export default function FloodMaskOverlay({ bbox, onLayerChange }) {
  const [scenes, setScenes] = useState([])
  const [selectedScene, setSelectedScene] = useState(null)
  const [floodMask, setFloodMask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOverlay, setShowOverlay] = useState(true)
  const [confidenceFilter, setConfidenceFilter] = useState(0.5)

  useEffect(() => {
    let active = true
    async function load() {
      if (!bbox || bbox.length !== 4) return

      try {
        setLoading(true)
        setError('')
        const data = await fetchFloodScenes(bbox, 50)
        if (!active) return
        
        // Filter by confidence
        const filtered = data.filter(s => s.confidence >= confidenceFilter)
        setScenes(filtered)
        
        // Auto-select most recent scene
        if (filtered.length > 0) {
          loadFloodMask(filtered[0].scene_id)
        }
      } catch (e) {
        console.error(e)
        setError('Failed to load flood scenes')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [bbox, confidenceFilter])

  async function loadFloodMask(sceneId) {
    try {
      const scene = scenes.find(s => s.scene_id === sceneId)
      setSelectedScene(scene)
      
      const mask = await fetchFloodMask(sceneId, 'geojson')
      setFloodMask(mask)
      
      // Notify parent to update map layer
      if (showOverlay && onLayerChange) {
        onLayerChange({
          type: 'flood_mask',
          enabled: true,
          data: mask
        })
      }
    } catch (e) {
      console.error('Failed to load flood mask:', e)
    }
  }

  useEffect(() => {
    if (onLayerChange) {
      onLayerChange({
        type: 'flood_mask',
        enabled: showOverlay,
        data: showOverlay ? floodMask : null
      })
    }
  }, [showOverlay])

  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-white/70">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nasa-blue"></div>
        <span className="ml-3">Loading flood scenes...</span>
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

  if (scenes.length === 0) {
    return (
      <div className="text-center py-8 text-white/60 text-sm">
        No flood scenes available for this area.
        <br />
        Try adjusting the confidence filter or changing the map view.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-space-900/40 rounded-lg border border-white/10">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="flood-overlay-toggle"
            checked={showOverlay}
            onChange={e => setShowOverlay(e.target.checked)}
            className="accent-nasa-blue"
          />
          <label htmlFor="flood-overlay-toggle" className="text-sm cursor-pointer">
            Show Flood Overlay
          </label>
        </div>
        <div className="text-xs text-white/60">
          {scenes.length} scene{scenes.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Confidence Filter */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-white/70">Min. Confidence</span>
          <span className="text-white font-mono">{(confidenceFilter * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={confidenceFilter}
          onChange={e => setConfidenceFilter(parseFloat(e.target.value))}
          className="w-full accent-nasa-blue"
        />
      </div>

      {/* Selected Scene Info */}
      {selectedScene && (
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-white/60">Selected Scene</div>
              <div className="text-lg font-semibold mt-1">
                {formatDate(selectedScene.scene_date)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/60">Confidence</div>
              <div className="text-lg font-semibold text-nasa-blue">
                {(selectedScene.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          
          {selectedScene.extent_km2 && (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-white/60">Flood Extent</div>
                <div className="font-mono">{selectedScene.extent_km2.toFixed(2)} km²</div>
              </div>
              <div>
                <div className="text-white/60">Processed</div>
                <div className="font-mono">{formatDate(selectedScene.processing_date)}</div>
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
              onClick={() => {
                // Download GeoJSON
                const dataStr = JSON.stringify(floodMask, null, 2)
                const blob = new Blob([dataStr], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `flood_mask_${selectedScene.scene_id}.geojson`
                a.click()
              }}
            >
              ⬇️ GeoJSON
            </button>
            <button
              className="flex-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-xs transition-colors"
              onClick={() => {
                // In production, this would download the GeoTIFF
                alert('GeoTIFF download would be available with backend integration')
              }}
            >
              ⬇️ GeoTIFF
            </button>
          </div>
        </div>
      )}

      {/* Scene Timeline */}
      <div className="space-y-2">
        <div className="text-xs text-white/70">Available Scenes (most recent first)</div>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {scenes.map(scene => {
            const isSelected = selectedScene?.scene_id === scene.scene_id
            return (
              <button
                key={scene.scene_id}
                onClick={() => loadFloodMask(scene.scene_id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-nasa-blue/20 border-2 border-nasa-blue'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">
                      {formatDate(scene.scene_date)}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5">
                      {scene.extent_km2 ? `${scene.extent_km2.toFixed(1)} km² affected` : 'Scene available'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/60">Confidence</div>
                    <div className="text-sm font-mono">
                      {(scene.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Compare Mode (Future Enhancement) */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/70">Compare with HyFuse</span>
          <button
            className="px-3 py-1 bg-white/10 hover:bg-white/15 rounded text-xs transition-colors"
            onClick={() => alert('Comparison mode coming soon!')}
          >
            Enable
          </button>
        </div>
        <p className="text-xs text-white/50 mt-2">
          Overlay flood extents with HyFuse risk scores to identify vulnerable areas
        </p>
      </div>
    </div>
  )
}
