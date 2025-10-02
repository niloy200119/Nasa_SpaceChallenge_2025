import React, { useEffect, useState } from 'react'
import { calculateResilienceScore, getResilienceTrend } from '../../lib/nasa/resilience'
import ErrorBoundary from '../ErrorBoundary'

export default function ResiliencePanel({ 
  weather, 
  disasters, 
  climate, 
  mobility, 
  airQuality,
  location,
  cityName = 'Selected Location'
}) {
  const [resilienceData, setResilienceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const calculateScore = async () => {
      setLoading(true)
      setError(null)
      try {
        const score = await calculateResilienceScore({
          weather,
          disasters,
          climate,
          mobility,
          airQuality,
          location
        })
        setResilienceData(score)
      } catch (err) {
        console.error('Failed to calculate resilience score:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    calculateScore()
  }, [weather, disasters, climate, mobility, airQuality, location])

  if (loading && !resilienceData) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-space-700/50 rounded-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <p className="text-sm text-red-400">Failed to calculate resilience score</p>
      </div>
    )
  }

  if (!resilienceData) return null

  const trend = getResilienceTrend(resilienceData.overallScore)
  
  // Get color classes based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 bg-green-900/20 border-green-500/30'
    if (score >= 65) return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
    if (score >= 50) return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
    if (score >= 35) return 'text-orange-400 bg-orange-900/20 border-orange-500/30'
    return 'text-red-400 bg-red-900/20 border-red-500/30'
  }

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 65) return 'bg-blue-500'
    if (score >= 50) return 'bg-yellow-500'
    if (score >= 35) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <div className={`p-6 rounded-xl border ${getScoreColor(resilienceData.overallScore)}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-white/70 mb-1">City Resilience Score</h3>
            <p className="text-xs text-white/50">{cityName}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">
              {resilienceData.resilienceIcon} {resilienceData.overallScore}
            </div>
            <div className="text-sm font-medium">{resilienceData.resilienceLevel}</div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="relative w-full h-3 bg-space-700 rounded-full overflow-hidden mb-4">
          <div 
            className={`absolute top-0 left-0 h-full ${getScoreBarColor(resilienceData.overallScore)} transition-all duration-500`}
            style={{ width: `${resilienceData.overallScore}%` }}
          />
        </div>

        {/* Trend */}
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span>{trend.trendIcon}</span>
          <span>{trend.message}</span>
        </div>
      </div>

      {/* Component Scores */}
      <div className="bg-space-800/60 backdrop-blur-soft rounded-lg border border-white/10 p-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-sm font-medium mb-3"
        >
          <span>📊 Component Scores</span>
          <span className="text-white/50">{expanded ? '▼' : '▶'}</span>
        </button>

        {expanded && (
          <div className="space-y-3">
            {Object.entries(resilienceData.componentScores).map(([key, { score, label }]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/70">{label}</span>
                  <span className={`font-semibold ${
                    score >= 70 ? 'text-green-400' : 
                    score >= 50 ? 'text-yellow-400' : 
                    'text-red-400'
                  }`}>
                    {score}/100
                  </span>
                </div>
                <div className="h-2 bg-space-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getScoreBarColor(score)} transition-all duration-300`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Risks */}
      {resilienceData.topRisks.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            ⚠️ Top Vulnerabilities
          </h4>
          <div className="space-y-2">
            {resilienceData.topRisks.map((risk, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-red-300">{risk.category}</span>
                  <span className="ml-2 text-red-400 text-[10px] font-semibold px-1.5 py-0.5 bg-red-500/20 rounded">
                    {risk.severity}
                  </span>
                </div>
                <span className="text-red-400 font-mono">{risk.score}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Strengths */}
      {resilienceData.topStrengths.length > 0 && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            ✅ Key Strengths
          </h4>
          <div className="space-y-2">
            {resilienceData.topStrengths.map((strength, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-green-300">{strength.category}</span>
                <span className="text-green-400 font-mono">{strength.score}/100</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {resilienceData.recommendations.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
            💡 Recommended Actions
          </h4>
          <div className="space-y-3">
            {resilienceData.recommendations.map((rec, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{rec.icon}</span>
                  <span className="text-blue-300 font-medium">{rec.category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    rec.priority === 'Critical' ? 'bg-red-500/30 text-red-300' :
                    rec.priority === 'High' ? 'bg-orange-500/30 text-orange-300' :
                    'bg-yellow-500/30 text-yellow-300'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-white/70 leading-relaxed pl-7">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-[10px] text-white/40 text-center">
        Last updated: {new Date(resilienceData.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
