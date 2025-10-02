import React, { useState, useEffect } from 'react'
import { requestFieldPack, checkFieldPackStatus } from '../../../lib/nasa/hyfuse'

/**
 * FieldPackModal Component
 * 
 * Modal for generating comprehensive field packs with:
 * - AOI visualization (uses current bbox)
 * - Pack type selection (brief/full)
 * - Email delivery option
 * - Real-time job status tracking
 * - Download link when ready
 */
export default function FieldPackModal({ bbox, onClose }) {
  const [packType, setPackType] = useState('full')
  const [email, setEmail] = useState('')
  const [jobId, setJobId] = useState(null)
  const [jobStatus, setJobStatus] = useState(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Poll job status when job is active
  useEffect(() => {
    if (!jobId) return

    const pollInterval = setInterval(async () => {
      try {
        const status = await checkFieldPackStatus(jobId)
        setJobStatus(status)
        
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(pollInterval)
        }
      } catch (e) {
        console.error('Failed to check job status:', e)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(pollInterval)
  }, [jobId])

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!bbox || bbox.length !== 4) {
      setError('Invalid map bounds. Please adjust the map view.')
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      // Create AOI GeoJSON from bbox
      const [minLon, minLat, maxLon, maxLat] = bbox
      const aoi = {
        type: 'Polygon',
        coordinates: [[
          [minLon, minLat],
          [maxLon, minLat],
          [maxLon, maxLat],
          [minLon, maxLat],
          [minLon, minLat]
        ]]
      }

      const result = await requestFieldPack(aoi, email || null, packType)
      setJobId(result.job_id)
      setJobStatus(result)
    } catch (e) {
      console.error('Failed to request field pack:', e)
      setError('Failed to create field pack. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case 'queued': return '⏳'
      case 'processing': return '⚙️'
      case 'completed': return '✅'
      case 'failed': return '❌'
      default: return '📦'
    }
  }

  function getStatusColor(status) {
    switch (status) {
      case 'queued': return 'text-yellow-400'
      case 'processing': return 'text-blue-400'
      case 'completed': return 'text-green-400'
      case 'failed': return 'text-red-400'
      default: return 'text-white/70'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-space-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            📦 Generate Field Pack
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!jobId ? (
            // Request Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-white/70 mb-3">
                  Generate a comprehensive field pack for the current map view including:
                </p>
                <ul className="text-xs text-white/60 space-y-1 ml-4">
                  <li>• HyFuse risk scores and analysis</li>
                  <li>• Recent flood extent maps (if available)</li>
                  <li>• Historical data and trends</li>
                  <li>• Actionable recommendations</li>
                  <li>• Exportable PDF report + GeoJSON data</li>
                </ul>
              </div>

              {/* Pack Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pack Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPackType('brief')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      packType === 'brief'
                        ? 'bg-nasa-blue/20 border-nasa-blue'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold text-sm">Brief</div>
                    <div className="text-xs text-white/60 mt-1">
                      Quick summary, ~2-3 pages
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPackType('full')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      packType === 'full'
                        ? 'bg-nasa-blue/20 border-nasa-blue'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold text-sm">Full</div>
                    <div className="text-xs text-white/60 mt-1">
                      Detailed analysis, ~10+ pages
                    </div>
                  </button>
                </div>
              </div>

              {/* Email (Optional) */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-nasa-blue"
                />
                <p className="text-xs text-white/50">
                  We'll email you when the field pack is ready
                </p>
              </div>

              {/* Area Info */}
              <div className="p-3 bg-white/5 rounded-lg text-xs space-y-1">
                <div className="text-white/70">Area of Interest:</div>
                {bbox && (
                  <div className="font-mono text-white/90">
                    {bbox[0].toFixed(3)}, {bbox[1].toFixed(3)} → {bbox[2].toFixed(3)}, {bbox[3].toFixed(3)}
                  </div>
                )}
                <div className="text-white/50 mt-2">
                  Current map bounds will be used as the area of interest
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-nasa-blue hover:bg-nasa-blue/80 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Creating...' : '🚀 Generate Field Pack'}
              </button>
            </form>
          ) : (
            // Job Status
            <div className="space-y-4">
              <div className={`text-center py-6 ${getStatusColor(jobStatus?.status)}`}>
                <div className="text-6xl mb-3">
                  {getStatusIcon(jobStatus?.status)}
                </div>
                <div className="text-xl font-semibold capitalize">
                  {jobStatus?.status || 'Processing'}
                </div>
                {jobStatus?.progress !== undefined && (
                  <div className="text-sm mt-2">
                    {jobStatus.progress}% complete
                  </div>
                )}
              </div>

              {jobStatus?.status === 'processing' && (
                <div className="space-y-2">
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-nasa-blue transition-all duration-500"
                      style={{ width: `${jobStatus.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-white/60">
                    Generating your field pack... This may take a minute.
                  </p>
                </div>
              )}

              {jobStatus?.status === 'completed' && jobStatus.download_url && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400 mb-3">
                      Your field pack is ready for download!
                    </p>
                    <a
                      href={jobStatus.download_url}
                      download
                      className="block w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-center transition-colors"
                    >
                      ⬇️ Download Field Pack
                    </a>
                  </div>
                  {email && (
                    <p className="text-xs text-center text-white/60">
                      A copy has also been sent to {email}
                    </p>
                  )}
                </div>
              )}

              {jobStatus?.status === 'failed' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">
                    Failed to generate field pack. Please try again.
                  </p>
                </div>
              )}

              {/* Job Info */}
              <div className="text-xs text-white/50 space-y-1 p-3 bg-white/5 rounded-lg">
                <div>Job ID: <span className="font-mono">{jobId}</span></div>
                {jobStatus?.created_at && (
                  <div>Created: {new Date(jobStatus.created_at).toLocaleString()}</div>
                )}
              </div>

              {/* Close button */}
              {jobStatus?.status === 'completed' || jobStatus?.status === 'failed' ? (
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
