// lib/ai/gemini.js - Google Gemini AI Integration for Crisis Decision Making

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDqV8gH9vMxjKp3nL2wQrTyUiOp4sA6bCd'; // Free tier key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Generate AI-powered crisis recommendations and decision support
 * @param {Object} params - Crisis parameters
 * @param {Array} params.disasters - Active disasters in the area
 * @param {Object} params.weather - Current weather conditions
 * @param {Object} params.resilience - Resilience score breakdown
 * @param {string} params.cityName - Name of the city
 * @param {Object} params.mobility - Transportation data
 * @param {Object} params.airQuality - Air quality data
 * @returns {Promise<Object>} AI-generated recommendations
 */
export async function generateCrisisRecommendations(params) {
  const {
    disasters = [],
    weather = {},
    resilience = {},
    cityName = 'the city',
    mobility = {},
    airQuality = {}
  } = params;

  console.log('🤖 Gemini API - Generating recommendations for:', cityName);
  console.log('📊 API Key available:', GEMINI_API_KEY ? 'Yes' : 'No');

  // Build context for AI
  const context = buildCrisisContext(params);
  
  const prompt = `You are an expert emergency management AI system analyzing real-time data for ${cityName}.

Current Situation:
${context}

Based on this real-time data, provide:

1. IMMEDIATE ACTIONS (next 1-2 hours):
   - List 3-5 critical actions that must be taken immediately
   - Focus on life safety and preventing escalation

2. SHORT-TERM STRATEGY (next 6-24 hours):
   - List 3-4 strategic actions for the next day
   - Include resource allocation and coordination

3. VULNERABLE POPULATIONS:
   - Identify which groups are most at risk
   - Suggest specific protections for each group

4. RESOURCE PRIORITIES:
   - List top 5 resources needed urgently
   - Suggest optimal distribution locations

5. COMMUNICATION STRATEGY:
   - Key messages for the public
   - Channels and timing for alerts

Format your response as JSON with these exact keys:
{
  "severity": "LOW|MODERATE|HIGH|CRITICAL|EXTREME",
  "immediateActions": ["action1", "action2", ...],
  "shortTermStrategy": ["strategy1", "strategy2", ...],
  "vulnerableGroups": [{"group": "name", "risk": "description", "protection": "measures"}],
  "resourcePriorities": [{"resource": "name", "quantity": "estimate", "locations": ["loc1", "loc2"]}],
  "communicationPlan": {
    "publicMessage": "short clear message",
    "channels": ["channel1", "channel2"],
    "updateFrequency": "timing"
  },
  "evacuationNeeded": true/false,
  "estimatedImpact": "brief description"
}

Be specific, actionable, and concise. Base everything on the provided data.`;

  try {
    console.log('🔄 Calling Gemini API...');
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    console.log('✅ Gemini API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API Error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 Gemini API Response received');
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to extract JSON from response
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiRecommendations = JSON.parse(jsonMatch[0]);
      console.log('✅ AI Recommendations parsed successfully');
      return {
        success: true,
        data: aiRecommendations,
        timestamp: new Date().toISOString(),
        model: 'gemini-pro'
      };
    }
    
    console.warn('⚠️ Could not parse JSON from AI response, using fallback parser');
    // Fallback if JSON parsing fails
    return {
      success: true,
      data: parseFallbackResponse(aiText, params),
      timestamp: new Date().toISOString(),
      model: 'gemini-pro-fallback'
    };

  } catch (error) {
    console.error('❌ Gemini AI Error:', error);
    console.log('🔄 Using rule-based fallback recommendations');
    // Return rule-based recommendations as fallback
    return {
      success: false,
      data: generateFallbackRecommendations(params),
      timestamp: new Date().toISOString(),
      model: 'rule-based-fallback',
      error: error.message
    };
  }
}

/**
 * Build comprehensive context string from all available data
 */
function buildCrisisContext(params) {
  const {
    disasters = [],
    weather = {},
    resilience = {},
    cityName = 'the city',
    mobility = {},
    airQuality = {}
  } = params;

  let context = '';

  // Disasters
  if (disasters.length > 0) {
    context += `Active Disasters (${disasters.length}):\n`;
    disasters.slice(0, 5).forEach(d => {
      context += `- ${d.title || d.type}: ${d.description || 'Active event'}\n`;
    });
  } else {
    context += 'No active disasters detected\n';
  }

  // Weather
  if (weather.temp !== undefined) {
    context += `\nWeather Conditions:\n`;
    context += `- Temperature: ${weather.temp}°C (feels like ${weather.feels_like}°C)\n`;
    context += `- Conditions: ${weather.condition}\n`;
    context += `- Wind: ${weather.wind_speed} km/h\n`;
    context += `- Humidity: ${weather.humidity}%\n`;
    if (weather.rain) context += `- Rain: ${weather.rain}mm\n`;
  }

  // Air Quality
  if (airQuality?.aqi) {
    context += `\nAir Quality:\n`;
    context += `- AQI: ${airQuality.aqi} (${airQuality.category})\n`;
    if (airQuality.pm25) context += `- PM2.5: ${airQuality.pm25} µg/m³\n`;
  }

  // Resilience
  if (resilience.overallScore !== undefined) {
    context += `\nCity Resilience Score: ${resilience.overallScore}/100 (${resilience.resilienceLevel})\n`;
    if (resilience.topRisks) {
      context += `Top Vulnerabilities:\n`;
      resilience.topRisks.slice(0, 3).forEach(r => {
        context += `- ${r.name}: ${r.score}/100\n`;
      });
    }
  }

  // Mobility
  if (mobility?.overallRisk) {
    context += `\nTransportation Status:\n`;
    context += `- Overall Risk: ${mobility.overallRisk}\n`;
    context += `- Traffic Level: ${mobility.trafficLevel || 'Unknown'}\n`;
  }

  return context;
}

/**
 * Parse fallback response when JSON extraction fails
 */
function parseFallbackResponse(text, params) {
  return {
    severity: determineSeverity(params),
    immediateActions: extractListFromText(text, 'immediate|action|critical'),
    shortTermStrategy: extractListFromText(text, 'short|strategy|plan'),
    vulnerableGroups: [{
      group: "General Population",
      risk: "Multiple risk factors present",
      protection: "Follow official emergency guidelines"
    }],
    resourcePriorities: [{
      resource: "Emergency Response Units",
      quantity: "As needed",
      locations: ["City Center", "High-risk areas"]
    }],
    communicationPlan: {
      publicMessage: "Stay informed and follow official guidance",
      channels: ["Emergency Alert System", "Local News", "Social Media"],
      updateFrequency: "Every 2-4 hours or as situation changes"
    },
    evacuationNeeded: params.disasters?.length > 0 && params.resilience?.overallScore < 50,
    estimatedImpact: text.substring(0, 200) + '...'
  };
}

/**
 * Generate rule-based fallback recommendations
 */
function generateFallbackRecommendations(params) {
  const { disasters = [], weather = {}, resilience = {} } = params;
  
  const severity = determineSeverity(params);
  const hasDisasters = disasters.length > 0;
  const lowResilience = resilience.overallScore < 50;
  const extremeWeather = weather.temp > 38 || weather.temp < 0 || weather.wind_speed > 80;

  const immediateActions = [];
  const shortTermStrategy = [];
  const vulnerableGroups = [];
  const resourcePriorities = [];

  // Build recommendations based on conditions
  if (hasDisasters) {
    immediateActions.push("Activate emergency operations center");
    immediateActions.push("Issue public alerts about active disasters");
    immediateActions.push("Deploy emergency response teams to affected areas");
    shortTermStrategy.push("Coordinate with regional emergency services");
    resourcePriorities.push({
      resource: "Emergency Response Vehicles",
      quantity: "10-20 units",
      locations: ["Disaster zones", "Strategic staging areas"]
    });
  }

  if (extremeWeather) {
    immediateActions.push("Issue weather warnings to all residents");
    immediateActions.push("Open emergency shelters");
    vulnerableGroups.push({
      group: "Elderly and Children",
      risk: "Extreme temperature exposure",
      protection: "Provide cooling/heating centers, welfare checks"
    });
  }

  if (lowResilience) {
    shortTermStrategy.push("Strengthen critical infrastructure resilience");
    shortTermStrategy.push("Increase resource stockpiles");
    resourcePriorities.push({
      resource: "Medical Supplies",
      quantity: "Emergency stockpile",
      locations: ["Hospitals", "Community centers"]
    });
  }

  // Add default actions if none triggered
  if (immediateActions.length === 0) {
    immediateActions.push("Monitor situation closely");
    immediateActions.push("Ensure emergency systems are operational");
    immediateActions.push("Maintain communication with residents");
  }

  if (shortTermStrategy.length === 0) {
    shortTermStrategy.push("Continue routine preparedness activities");
    shortTermStrategy.push("Update emergency response plans");
    shortTermStrategy.push("Conduct community resilience training");
  }

  return {
    severity,
    immediateActions,
    shortTermStrategy,
    vulnerableGroups: vulnerableGroups.length > 0 ? vulnerableGroups : [{
      group: "At-risk populations",
      risk: "General preparedness",
      protection: "Ensure access to emergency information"
    }],
    resourcePriorities: resourcePriorities.length > 0 ? resourcePriorities : [{
      resource: "Emergency Supplies",
      quantity: "Standard stockpile",
      locations: ["Distribution centers"]
    }],
    communicationPlan: {
      publicMessage: severity === 'LOW' ? 
        "Conditions are stable. Stay informed." :
        "Monitor situation closely and follow official guidance.",
      channels: ["Emergency Alert System", "Local News", "City Website"],
      updateFrequency: severity === 'LOW' ? "Daily" : "Every 4-6 hours"
    },
    evacuationNeeded: severity === 'EXTREME' || (hasDisasters && lowResilience),
    estimatedImpact: `${severity} impact scenario with ${disasters.length} active threat(s)`
  };
}

/**
 * Determine overall severity level
 */
function determineSeverity(params) {
  const { disasters = [], weather = {}, resilience = {}, airQuality = {} } = params;
  
  let severityScore = 0;

  // Disasters (+20 each, max 60)
  severityScore += Math.min(disasters.length * 20, 60);

  // Resilience score (inverse - lower is worse)
  if (resilience.overallScore < 35) severityScore += 30;
  else if (resilience.overallScore < 50) severityScore += 20;
  else if (resilience.overallScore < 65) severityScore += 10;

  // Extreme weather (+15)
  if (weather.temp > 40 || weather.temp < -5 || weather.wind_speed > 100) severityScore += 15;
  else if (weather.temp > 38 || weather.temp < 0 || weather.wind_speed > 80) severityScore += 10;

  // Air quality (+10)
  if (airQuality?.aqi > 300) severityScore += 10;
  else if (airQuality?.aqi > 200) severityScore += 5;

  // Determine level
  if (severityScore >= 80) return 'EXTREME';
  if (severityScore >= 60) return 'CRITICAL';
  if (severityScore >= 40) return 'HIGH';
  if (severityScore >= 20) return 'MODERATE';
  return 'LOW';
}

/**
 * Extract list items from text
 */
function extractListFromText(text, keywords) {
  const regex = new RegExp(`(?:${keywords})[^\\n]*:\\s*\\n?([^\\n]+)`, 'gi');
  const matches = [];
  let match;
  
  while ((match = regex.exec(text)) !== null && matches.length < 5) {
    matches.push(match[1].trim().replace(/^[-*•]\s*/, ''));
  }
  
  return matches.length > 0 ? matches : [
    "Monitor situation continuously",
    "Maintain emergency readiness",
    "Follow official guidance"
  ];
}
