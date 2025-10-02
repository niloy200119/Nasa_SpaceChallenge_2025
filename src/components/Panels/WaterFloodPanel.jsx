import React, { useState } from 'react'
import HyFuseCard from './WaterFlood/HyFuseCard'
import FloodMaskOverlay from './WaterFlood/FloodMaskOverlay'
import FieldPackModal from './WaterFlood/FieldPackModal'
import AlertCreator from './WaterFlood/AlertCreator'

/**
 * Water Resources & Flood Risk Panel
 * 
 * Integrates HyFuse scoring, SAR flood masks, field pack generation,
 * and alert management for water resource planning.
 */
export default function WaterFloodPanel({ bbox, center, onLayerChange }) {
  const [activeTab, setActiveTab] = useState('hyfuse') // hyfuse | floods | fieldpack | alerts
  const [selectedTileId, setSelectedTileId] = useState(null)
  const [showFieldPackModal, setShowFieldPackModal] = useState(false)

  const tabs = [
    { id: 'hyfuse', label: 'HyFuse Scores', icon: '💧' },
    { id: 'floods', label: 'Flood Masks', icon: '🌊' },
    { id: 'fieldpack', label: 'Field Packs', icon: '📦' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' }
  ]

  return (
    <div className="space-y-3">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-space-900/40 rounded-lg border border-white/5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-nasa-blue text-white shadow-md'
                : 'text-white/60 hover:text-white/90 hover:bg-white/5'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'hyfuse' && (
          <HyFuseCard
            bbox={bbox}
            center={center}
            onTileSelect={setSelectedTileId}
            onGenerateFieldPack={() => setShowFieldPackModal(true)}
          />
        )}

        {activeTab === 'floods' && (
          <FloodMaskOverlay
            bbox={bbox}
            onLayerChange={onLayerChange}
          />
        )}

        {activeTab === 'fieldpack' && (
          <div className="space-y-3">
            <p className="text-sm text-white/70">
              Generate comprehensive field reports with HyFuse scores, flood risk maps, 
              and actionable recommendations for your area of interest.
            </p>
            <button
              onClick={() => setShowFieldPackModal(true)}
              className="w-full px-4 py-2 bg-nasa-blue hover:bg-nasa-blue/80 text-white rounded-lg font-medium transition-colors"
            >
              📦 Create New Field Pack
            </button>
          </div>
        )}

        {activeTab === 'alerts' && (
          <AlertCreator bbox={bbox} />
        )}
      </div>

      {/* Field Pack Modal */}
      {showFieldPackModal && (
        <FieldPackModal
          bbox={bbox}
          onClose={() => setShowFieldPackModal(false)}
        />
      )}

      {/* Help Text */}
      <div className="text-xs text-white/50 space-y-1 pt-2 border-t border-white/5">
        <p><strong>HyFuse:</strong> Hybrid Fusion score (0-100) combining rain, soil moisture, GRACE anomalies, and inundation data</p>
        <p><strong>Flood Masks:</strong> SAR-derived flood extent polygons from recent satellite passes</p>
      </div>
    </div>
  )
}
