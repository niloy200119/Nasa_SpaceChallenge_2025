import React, { useEffect, useState } from 'react';
import { generateCrisisRecommendations } from '../../lib/ai/gemini';

export default function AICrisisPanel({ 
  disasters, 
  weather, 
  resilience, 
  cityName,
  mobility,
  airQuality 
}) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Generate recommendations when data changes
  useEffect(() => {
    if (!cityName) return;

    const generateRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateCrisisRecommendations({
          disasters,
          weather,
          resilience,
          cityName,
          mobility,
          airQuality
        });

        if (result.success || result.data) {
          setRecommendations(result.data);
          setLastUpdate(new Date());
        } else {
          setError('Unable to generate recommendations');
        }
      } catch (err) {
        console.error('AI Recommendations Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Generate on mount and when key data changes
    generateRecommendations();
  }, [cityName, disasters?.length, resilience?.overallScore]);

  const severityColors = {
    LOW: 'text-green-400 bg-green-500/10 border-green-500/30',
    MODERATE: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    HIGH: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    CRITICAL: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    EXTREME: 'text-red-400 bg-red-500/10 border-red-500/30'
  };

  const severityIcons = {
    LOW: '✅',
    MODERATE: '⚠️',
    HIGH: '🔶',
    CRITICAL: '🔴',
    EXTREME: '🚨'
  };

  if (loading && !recommendations) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="animate-spin">🤖</div>
          <h3 className="font-semibold text-lg">AI Crisis Analysis</h3>
        </div>
        <div className="text-sm text-white/60 animate-pulse">
          Analyzing real-time data with Gemini AI...
        </div>
      </div>
    );
  }

  if (error && !recommendations) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span>🤖</span>
          <h3 className="font-semibold text-lg">AI Crisis Analysis</h3>
        </div>
        <div className="text-sm text-orange-400">
          AI temporarily unavailable. Using rule-based analysis.
        </div>
      </div>
    );
  }

  if (!recommendations) return null;

  const severity = recommendations.severity || 'MODERATE';
  const severityColor = severityColors[severity] || severityColors.MODERATE;
  const severityIcon = severityIcons[severity] || '⚠️';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="font-semibold text-lg">AI Crisis Analysis</h3>
            <div className="text-xs text-white/60">
              Powered by Google Gemini AI
            </div>
          </div>
        </div>
        {lastUpdate && (
          <div className="text-xs text-white/50">
            {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Severity Badge */}
      <div className={`rounded-lg border p-3 ${severityColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{severityIcon}</span>
            <div>
              <div className="text-xs opacity-80">Threat Level</div>
              <div className="font-bold text-lg">{severity}</div>
            </div>
          </div>
          {recommendations.evacuationNeeded && (
            <div className="text-xs font-semibold bg-red-500/20 border border-red-500/50 rounded px-2 py-1">
              EVACUATION RECOMMENDED
            </div>
          )}
        </div>
      </div>

      {/* Estimated Impact */}
      {recommendations.estimatedImpact && (
        <div className="text-sm text-white/80 bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="font-semibold text-xs text-white/60 mb-1">SITUATION ASSESSMENT</div>
          {recommendations.estimatedImpact}
        </div>
      )}

      {/* Immediate Actions */}
      {recommendations.immediateActions && recommendations.immediateActions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>⚡</span>
            <span>IMMEDIATE ACTIONS (Next 1-2 Hours)</span>
          </div>
          <div className="space-y-2">
            {recommendations.immediateActions.map((action, idx) => (
              <div 
                key={idx}
                className="text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2"
              >
                <span className="text-red-400 font-bold">{idx + 1}.</span>
                <span className="text-white/90">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Short-term Strategy */}
      {recommendations.shortTermStrategy && recommendations.shortTermStrategy.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>📋</span>
            <span>SHORT-TERM STRATEGY (Next 6-24 Hours)</span>
          </div>
          <div className="space-y-2">
            {recommendations.shortTermStrategy.map((strategy, idx) => (
              <div 
                key={idx}
                className="text-sm bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2"
              >
                <span className="text-blue-400 font-bold">{idx + 1}.</span>
                <span className="text-white/90">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vulnerable Groups */}
      {recommendations.vulnerableGroups && recommendations.vulnerableGroups.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>👥</span>
            <span>VULNERABLE POPULATIONS</span>
          </div>
          <div className="space-y-2">
            {recommendations.vulnerableGroups.map((group, idx) => (
              <div 
                key={idx}
                className="text-sm bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
              >
                <div className="font-semibold text-yellow-400 mb-1">{group.group}</div>
                <div className="text-white/70 text-xs mb-1">Risk: {group.risk}</div>
                <div className="text-white/90 text-xs">Protection: {group.protection}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Priorities */}
      {recommendations.resourcePriorities && recommendations.resourcePriorities.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>📦</span>
            <span>RESOURCE PRIORITIES</span>
          </div>
          <div className="space-y-2">
            {recommendations.resourcePriorities.map((resource, idx) => (
              <div 
                key={idx}
                className="text-sm bg-purple-500/10 border border-purple-500/30 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-purple-400">{resource.resource}</span>
                  <span className="text-xs text-white/60">{resource.quantity}</span>
                </div>
                {resource.locations && (
                  <div className="text-xs text-white/70">
                    Deploy to: {resource.locations.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Communication Plan */}
      {recommendations.communicationPlan && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span>📢</span>
            <span>COMMUNICATION STRATEGY</span>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 space-y-2">
            {recommendations.communicationPlan.publicMessage && (
              <div>
                <div className="text-xs font-semibold text-green-400 mb-1">PUBLIC MESSAGE</div>
                <div className="text-sm text-white/90 italic">
                  "{recommendations.communicationPlan.publicMessage}"
                </div>
              </div>
            )}
            {recommendations.communicationPlan.channels && (
              <div>
                <div className="text-xs font-semibold text-green-400 mb-1">CHANNELS</div>
                <div className="text-xs text-white/70">
                  {recommendations.communicationPlan.channels.join(' • ')}
                </div>
              </div>
            )}
            {recommendations.communicationPlan.updateFrequency && (
              <div>
                <div className="text-xs font-semibold text-green-400 mb-1">UPDATE FREQUENCY</div>
                <div className="text-xs text-white/70">
                  {recommendations.communicationPlan.updateFrequency}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={async () => {
          setLoading(true);
          try {
            const result = await generateCrisisRecommendations({
              disasters,
              weather,
              resilience,
              cityName,
              mobility,
              airQuality
            });
            if (result.data) {
              setRecommendations(result.data);
              setLastUpdate(new Date());
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        }}
        disabled={loading}
        className="w-full py-2 px-4 bg-nasa-blue/20 hover:bg-nasa-blue/30 border border-nasa-blue/50 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '🔄 Regenerating...' : '🔄 Refresh AI Analysis'}
      </button>

      {/* AI Disclaimer */}
      <div className="text-xs text-white/40 text-center border-t border-white/10 pt-3">
        AI-generated recommendations. Always verify with local emergency services.
      </div>
    </div>
  );
}
