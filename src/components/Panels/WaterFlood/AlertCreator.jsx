import React, { useState } from 'react'
import { createAlert } from '../../../lib/nasa/hyfuse'

/**
 * AlertCreator Component
 * 
 * Create and manage alert rules for water/flood risks:
 * - Set HyFuse score thresholds
 * - Choose notification channel (email/webhook)
 * - View and manage active alerts
 * - Test alert delivery
 */
export default function AlertCreator({ bbox }) {
  const [alerts, setAlerts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    threshold: 60,
    channel: 'email',
    contact: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!bbox || bbox.length !== 4) {
      setError('Invalid map bounds. Please adjust the map view.')
      return
    }

    if (!formData.contact.trim()) {
      setError('Please provide an email or webhook URL')
      return
    }

    // Validate email or webhook URL
    if (formData.channel === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.contact)) {
        setError('Please provide a valid email address')
        return
      }
    } else {
      try {
        new URL(formData.contact)
      } catch {
        setError('Please provide a valid webhook URL')
        return
      }
    }

    try {
      setIsSubmitting(true)
      setError('')
      setSuccess('')

      // Create AOI from bbox
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

      const result = await createAlert(
        aoi,
        formData.threshold,
        formData.channel,
        formData.contact
      )

      setAlerts([...alerts, result])
      setSuccess('Alert created successfully!')
      setShowForm(false)
      setFormData({
        threshold: 60,
        channel: 'email',
        contact: ''
      })
    } catch (e) {
      console.error('Failed to create alert:', e)
      setError('Failed to create alert. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function deleteAlert(alertId) {
    setAlerts(alerts.filter(a => a.alert_id !== alertId))
    setSuccess('Alert deleted')
    setTimeout(() => setSuccess(''), 3000)
  }

  function getThresholdLabel(threshold) {
    if (threshold >= 80) return '🔴 Critical'
    if (threshold >= 60) return '🟠 High'
    if (threshold >= 40) return '🟡 Moderate'
    return '🟢 Low'
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <p className="text-sm text-white/70">
          Get notified when HyFuse scores in your area exceed your chosen threshold.
          Alerts check every 6 hours.
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Create Alert Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-2 bg-nasa-blue hover:bg-nasa-blue/80 text-white rounded-lg font-medium transition-colors"
        >
          🔔 Create New Alert
        </button>
      )}

      {/* Alert Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-space-900/40 rounded-lg border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">New Alert Rule</h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setError('')
              }}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>

          {/* Threshold Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Alert Threshold: {getThresholdLabel(formData.threshold)}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={formData.threshold}
                onChange={e => setFormData({ ...formData, threshold: parseInt(e.target.value) })}
                className="flex-1 accent-nasa-blue"
              />
              <div className="w-12 text-right font-mono text-sm">{formData.threshold}</div>
            </div>
            <p className="text-xs text-white/50">
              You'll be notified when any tile in your AOI exceeds this HyFuse score
            </p>
          </div>

          {/* Channel Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notification Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, channel: 'email' })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  formData.channel === 'email'
                    ? 'bg-nasa-blue/20 border-nasa-blue'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-xl mb-1">📧</div>
                <div className="font-semibold text-sm">Email</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, channel: 'webhook' })}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  formData.channel === 'webhook'
                    ? 'bg-nasa-blue/20 border-nasa-blue'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="text-xl mb-1">🔗</div>
                <div className="font-semibold text-sm">Webhook</div>
              </button>
            </div>
          </div>

          {/* Contact Input */}
          <div className="space-y-2">
            <label htmlFor="contact" className="text-sm font-medium">
              {formData.channel === 'email' ? 'Email Address' : 'Webhook URL'}
            </label>
            <input
              type={formData.channel === 'email' ? 'email' : 'url'}
              id="contact"
              value={formData.contact}
              onChange={e => setFormData({ ...formData, contact: e.target.value })}
              placeholder={formData.channel === 'email' ? 'your@email.com' : 'https://your-webhook.com/endpoint'}
              required
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-nasa-blue"
            />
          </div>

          {/* Area Info */}
          <div className="p-3 bg-white/5 rounded-lg text-xs space-y-1">
            <div className="text-white/70">Monitoring Area:</div>
            {bbox && (
              <div className="font-mono text-white/90">
                {bbox[0].toFixed(2)}, {bbox[1].toFixed(2)} → {bbox[2].toFixed(2)}, {bbox[3].toFixed(2)}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-nasa-blue hover:bg-nasa-blue/80 disabled:bg-white/10 disabled:text-white/40 text-white rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Alert'}
          </button>
        </form>
      )}

      {/* Active Alerts List */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white/80">Active Alerts ({alerts.length})</h3>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.alert_id}
                className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{alert.channel === 'email' ? '📧' : '🔗'}</span>
                      <span className="font-semibold text-sm">
                        {getThresholdLabel(alert.threshold)} Alert
                      </span>
                      {alert.active && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/60 space-y-0.5">
                      <div>Threshold: {alert.threshold}</div>
                      <div className="truncate">
                        {alert.channel === 'email' ? 'Email: ' : 'Webhook: '}
                        {alert.contact}
                      </div>
                      <div className="text-white/40">
                        Created: {new Date(alert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAlert(alert.alert_id)}
                    className="text-red-400 hover:text-red-300 text-sm ml-2"
                    title="Delete alert"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {alerts.length === 0 && !showForm && (
        <div className="text-center py-6 text-white/40 text-sm">
          No active alerts. Create one to get notified about water risks.
        </div>
      )}

      {/* Info Box */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300/80">
        <strong>💡 Pro Tip:</strong> Set multiple alerts with different thresholds to create an early warning system 
        for different risk levels in your area.
      </div>
    </div>
  )
}
