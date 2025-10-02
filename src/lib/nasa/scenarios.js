/**
 * Scenario Builder - Disaster-specific scenario simulations
 * 
 * Different disaster types show different aspects:
 * - Floods: Water depth, drainage capacity, evacuation routes
 * - Wildfires: Fire spread, wind direction, smoke dispersion, air quality
 * - Earthquakes: Building damage, infrastructure collapse, aftershocks
 * - Heatwaves: Temperature zones, vulnerable populations, power grid stress
 * - Hurricanes: Wind speed, storm surge, flooding, power outages
 * - Drought: Water scarcity, crop impact, fire risk
 */

/**
 * Get scenario aspects based on disaster type
 */
export function getScenarioAspects(disasterType) {
  const scenarios = {
    'Floods': {
      icon: '🌊',
      color: 'blue',
      aspects: [
        {
          id: 'water_depth',
          name: 'Water Depth',
          description: 'Predicted flood depth in affected areas',
          unit: 'meters',
          ranges: [
            { level: 'Low', value: '0.3-0.5m', impact: 'Minor property damage, passable with caution', color: 'yellow' },
            { level: 'Medium', value: '0.5-1.5m', impact: 'Vehicle access blocked, ground floor flooding', color: 'orange' },
            { level: 'High', value: '1.5-3m', impact: 'Complete ground floor inundation, dangerous currents', color: 'red' },
            { level: 'Extreme', value: '>3m', impact: 'Multi-story flooding, life-threatening conditions', color: 'purple' }
          ]
        },
        {
          id: 'drainage_capacity',
          name: 'Drainage System Load',
          description: 'Percentage of drainage system capacity utilized',
          unit: '%',
          thresholds: [50, 75, 90, 100]
        },
        {
          id: 'evacuation_time',
          name: 'Evacuation Window',
          description: 'Time available before roads become impassable',
          unit: 'hours',
          critical: 2
        },
        {
          id: 'contamination_risk',
          name: 'Water Contamination Risk',
          description: 'Likelihood of sewage and chemical contamination',
          levels: ['Low', 'Moderate', 'High', 'Severe']
        },
        {
          id: 'infrastructure_impact',
          name: 'Infrastructure Vulnerability',
          description: 'Critical infrastructure at risk',
          categories: ['Power Grid', 'Water Supply', 'Roads', 'Bridges', 'Emergency Services']
        }
      ]
    },

    'Wildfires': {
      icon: '🔥',
      color: 'red',
      aspects: [
        {
          id: 'fire_spread_rate',
          name: 'Fire Spread Rate',
          description: 'Speed of fire advancement based on wind and terrain',
          unit: 'km/h',
          ranges: [
            { level: 'Slow', value: '<2 km/h', impact: 'Controlled spread, manageable evacuation', color: 'yellow' },
            { level: 'Moderate', value: '2-5 km/h', impact: 'Rapid containment needed, evacuation recommended', color: 'orange' },
            { level: 'Fast', value: '5-10 km/h', impact: 'Difficult to control, immediate evacuation', color: 'red' },
            { level: 'Extreme', value: '>10 km/h', impact: 'Uncontrollable, life-threatening situation', color: 'purple' }
          ]
        },
        {
          id: 'wind_influence',
          name: 'Wind Factor',
          description: 'Wind speed and direction affecting fire behavior',
          unit: 'km/h',
          critical: 40
        },
        {
          id: 'smoke_dispersion',
          name: 'Smoke Plume Direction',
          description: 'Areas affected by smoke and poor air quality',
          visibility: 'meters'
        },
        {
          id: 'air_quality_impact',
          name: 'Air Quality Degradation',
          description: 'PM2.5 and CO levels in smoke-affected areas',
          aqi_levels: [0, 50, 100, 150, 200, 300, 500]
        },
        {
          id: 'fuel_density',
          name: 'Fuel Load',
          description: 'Vegetation density and flammability',
          levels: ['Light', 'Moderate', 'Heavy', 'Extreme']
        },
        {
          id: 'containment_lines',
          name: 'Fire Breaks',
          description: 'Natural and artificial barriers to fire spread',
          effectiveness: '%'
        }
      ]
    },

    'Earthquakes': {
      icon: '🏚️',
      color: 'purple',
      aspects: [
        {
          id: 'magnitude',
          name: 'Earthquake Magnitude',
          description: 'Richter scale measurement',
          unit: 'Magnitude',
          ranges: [
            { level: 'Minor', value: '3.0-3.9', impact: 'Felt but rarely causes damage', color: 'green' },
            { level: 'Light', value: '4.0-4.9', impact: 'Noticeable shaking, minor damage', color: 'yellow' },
            { level: 'Moderate', value: '5.0-5.9', impact: 'Moderate damage to structures', color: 'orange' },
            { level: 'Strong', value: '6.0-6.9', impact: 'Serious damage in populated areas', color: 'red' },
            { level: 'Major', value: '7.0+', impact: 'Widespread devastation', color: 'purple' }
          ]
        },
        {
          id: 'building_vulnerability',
          name: 'Building Damage Assessment',
          description: 'Structural integrity of different building types',
          categories: ['Residential', 'Commercial', 'Critical Infrastructure', 'Historical']
        },
        {
          id: 'liquefaction_risk',
          name: 'Soil Liquefaction Zones',
          description: 'Areas where soil may lose strength',
          susceptibility: ['Low', 'Moderate', 'High', 'Very High']
        },
        {
          id: 'aftershock_probability',
          name: 'Aftershock Likelihood',
          description: 'Probability and expected magnitude of aftershocks',
          timeframes: ['First 24h', '24-72h', '3-7 days', '1-4 weeks']
        },
        {
          id: 'infrastructure_collapse',
          name: 'Infrastructure Failure Risk',
          description: 'Probability of critical infrastructure collapse',
          systems: ['Bridges', 'Overpasses', 'Dams', 'Power Lines', 'Gas Lines']
        },
        {
          id: 'tsunami_risk',
          name: 'Tsunami Potential',
          description: 'Risk of tsunami generation (coastal areas)',
          likelihood: ['None', 'Low', 'Moderate', 'High']
        }
      ]
    },

    'Severe Storms': {
      icon: '⛈️',
      color: 'indigo',
      aspects: [
        {
          id: 'wind_speed',
          name: 'Maximum Wind Speed',
          description: 'Peak wind gusts expected',
          unit: 'km/h',
          ranges: [
            { level: 'Strong', value: '50-70', impact: 'Tree branches break, minor damage', color: 'yellow' },
            { level: 'Damaging', value: '70-100', impact: 'Trees uprooted, roof damage', color: 'orange' },
            { level: 'Destructive', value: '100-150', impact: 'Structural damage, flying debris', color: 'red' },
            { level: 'Catastrophic', value: '>150', impact: 'Widespread devastation', color: 'purple' }
          ]
        },
        {
          id: 'rainfall_intensity',
          name: 'Rainfall Rate',
          description: 'Precipitation intensity',
          unit: 'mm/hour',
          flood_threshold: 50
        },
        {
          id: 'lightning_frequency',
          name: 'Lightning Activity',
          description: 'Strikes per minute in storm area',
          danger_level: ['Low', 'Moderate', 'High', 'Extreme']
        },
        {
          id: 'hail_size',
          name: 'Hail Diameter',
          description: 'Maximum hail stone size',
          unit: 'cm',
          damage_threshold: 2.5
        },
        {
          id: 'storm_surge',
          name: 'Storm Surge Height',
          description: 'Coastal water level rise',
          unit: 'meters',
          coastal_only: true
        },
        {
          id: 'power_outage_risk',
          name: 'Power Grid Vulnerability',
          description: 'Likelihood of widespread outages',
          probability: '%'
        }
      ]
    },

    'Temperature Extremes': {
      icon: '🌡️',
      color: 'orange',
      aspects: [
        {
          id: 'temperature_peak',
          name: 'Peak Temperature',
          description: 'Maximum temperature expected',
          unit: '°C',
          ranges: [
            { level: 'Hot', value: '35-38°C', impact: 'Heat stress risk, stay hydrated', color: 'yellow' },
            { level: 'Very Hot', value: '38-42°C', impact: 'High heat stress, limit outdoor activities', color: 'orange' },
            { level: 'Extreme', value: '42-45°C', impact: 'Dangerous conditions, heat illness likely', color: 'red' },
            { level: 'Catastrophic', value: '>45°C', impact: 'Life-threatening heat, stay indoors', color: 'purple' }
          ]
        },
        {
          id: 'heat_index',
          name: 'Feels Like Temperature',
          description: 'Combined heat and humidity effect',
          unit: '°C',
          dangerous_threshold: 40
        },
        {
          id: 'vulnerable_populations',
          name: 'At-Risk Population',
          description: 'Number of vulnerable individuals (elderly, children)',
          categories: ['Elderly (65+)', 'Children (<5)', 'Homeless', 'Outdoor Workers']
        },
        {
          id: 'cooling_center_capacity',
          name: 'Cooling Center Availability',
          description: 'Capacity vs demand for air-conditioned shelters',
          utilization: '%'
        },
        {
          id: 'power_demand',
          name: 'Electrical Grid Stress',
          description: 'AC usage impact on power system',
          load_percentage: '%',
          blackout_risk_threshold: 95
        },
        {
          id: 'wildfire_risk',
          name: 'Heat-Related Fire Risk',
          description: 'Increased fire danger due to extreme heat',
          risk_level: ['Low', 'Moderate', 'High', 'Extreme']
        }
      ]
    },

    'Drought': {
      icon: '🏜️',
      color: 'yellow',
      aspects: [
        {
          id: 'water_scarcity',
          name: 'Water Supply Deficit',
          description: 'Percentage below normal water availability',
          unit: '%',
          critical_threshold: 60
        },
        {
          id: 'crop_impact',
          name: 'Agricultural Impact',
          description: 'Crop yield reduction estimate',
          unit: '%',
          food_security_threshold: 40
        },
        {
          id: 'reservoir_levels',
          name: 'Water Storage',
          description: 'Current capacity of reservoirs and aquifers',
          unit: '% of capacity',
          emergency_threshold: 20
        },
        {
          id: 'fire_danger',
          name: 'Wildfire Risk',
          description: 'Fire danger rating due to dry conditions',
          levels: ['Low', 'Moderate', 'High', 'Very High', 'Extreme']
        },
        {
          id: 'dust_storms',
          name: 'Dust Storm Potential',
          description: 'Likelihood of dust storms from dry soil',
          visibility_impact: 'meters'
        },
        {
          id: 'water_restrictions',
          name: 'Conservation Measures',
          description: 'Water use restrictions in effect',
          stages: ['Voluntary', 'Level 1', 'Level 2', 'Level 3 (Emergency)']
        }
      ]
    },

    'Landslides': {
      icon: '⛰️',
      color: 'brown',
      aspects: [
        {
          id: 'slope_stability',
          name: 'Slope Stability Index',
          description: 'Geological stability of terrain',
          stability: ['Stable', 'Marginally Stable', 'Unstable', 'Failed']
        },
        {
          id: 'soil_saturation',
          name: 'Soil Moisture Content',
          description: 'Water saturation in soil (trigger factor)',
          unit: '%',
          critical_threshold: 85
        },
        {
          id: 'affected_roads',
          name: 'Road Network Impact',
          description: 'Roads at risk or blocked by landslides',
          categories: ['Primary Routes', 'Secondary Routes', 'Evacuation Routes']
        },
        {
          id: 'population_exposure',
          name: 'Exposed Population',
          description: 'Number of people in landslide zones',
          risk_zones: ['High Risk', 'Moderate Risk', 'Low Risk']
        },
        {
          id: 'debris_volume',
          name: 'Debris Flow Volume',
          description: 'Estimated volume of material movement',
          unit: 'cubic meters',
          severity_threshold: 10000
        }
      ]
    }
  }

  return scenarios[disasterType] || {
    icon: '⚠️',
    color: 'gray',
    aspects: [
      {
        id: 'generic_severity',
        name: 'Severity Level',
        description: 'Overall impact assessment',
        levels: ['Low', 'Moderate', 'High', 'Severe']
      }
    ]
  }
}

/**
 * Generate scenario simulation data
 */
export async function simulateScenario(disasterType, severity, location, duration) {
  const aspects = getScenarioAspects(disasterType)
  const simulations = []

  // Generate time-series data for scenario progression
  const timeSteps = Math.ceil(duration) // hours
  
  for (let hour = 0; hour <= timeSteps; hour++) {
    const timestamp = new Date(Date.now() + hour * 3600000).toISOString()
    const progress = hour / timeSteps // 0 to 1
    
    const dataPoint = {
      timestamp,
      hour,
      aspectValues: {}
    }

    // Generate values for each aspect based on disaster type
    aspects.aspects.forEach(aspect => {
      dataPoint.aspectValues[aspect.id] = generateAspectValue(
        aspect,
        severity,
        progress,
        disasterType
      )
    })

    simulations.push(dataPoint)
  }

  return {
    disasterType,
    icon: aspects.icon,
    color: aspects.color,
    severity,
    duration,
    location,
    aspects: aspects.aspects,
    timeline: simulations,
    summary: generateScenarioSummary(disasterType, severity, simulations)
  }
}

/**
 * Generate realistic values for scenario aspects
 */
function generateAspectValue(aspect, severity, progress, disasterType) {
  const severityMultiplier = {
    'Low': 0.3,
    'Moderate': 0.6,
    'High': 0.85,
    'Severe': 1.0
  }[severity] || 0.5

  // Peak happens at 60-70% of timeline
  const peakTime = 0.65
  const intensityCurve = progress < peakTime
    ? progress / peakTime // Ramp up
    : 1 - ((progress - peakTime) / (1 - peakTime)) * 0.7 // Slow decline

  const intensity = Math.max(0, Math.min(1, intensityCurve * severityMultiplier + Math.random() * 0.1))

  // Generate aspect-specific values
  switch (aspect.id) {
    case 'water_depth':
      return (intensity * 4).toFixed(1) // 0-4 meters
    
    case 'drainage_capacity':
      return Math.round(intensity * 100) // 0-100%
    
    case 'fire_spread_rate':
      return (intensity * 15).toFixed(1) // 0-15 km/h
    
    case 'magnitude':
      return (3 + intensity * 5).toFixed(1) // 3-8 Richter scale
    
    case 'wind_speed':
      return Math.round(30 + intensity * 150) // 30-180 km/h
    
    case 'temperature_peak':
      return Math.round(30 + intensity * 20) // 30-50°C
    
    case 'water_scarcity':
      return Math.round(intensity * 80) // 0-80% deficit
    
    default:
      return Math.round(intensity * 100) // Generic 0-100 value
  }
}

/**
 * Generate scenario summary
 */
function generateScenarioSummary(disasterType, severity, timeline) {
  const peakPoint = timeline[Math.floor(timeline.length * 0.65)]
  
  return {
    peakTime: peakPoint.timestamp,
    estimatedImpact: severity,
    affectedPopulation: Math.floor(Math.random() * 50000) + 10000,
    economicLoss: `$${(Math.random() * 500 + 50).toFixed(1)}M`,
    evacuationNeeded: severity === 'Severe' || severity === 'High',
    responseUnitsRequired: {
      'Emergency Services': Math.floor(Math.random() * 20) + 10,
      'Medical Teams': Math.floor(Math.random() * 15) + 5,
      'Evacuation Vehicles': Math.floor(Math.random() * 50) + 20
    }
  }
}

/**
 * Get recommended preparedness actions for scenario
 */
export function getScenarioPreparednessActions(disasterType, severity) {
  const baseActions = {
    'Floods': [
      'Evacuate low-lying areas and basements',
      'Move valuables to upper floors',
      'Turn off utilities if instructed',
      'Avoid walking/driving through flood water',
      'Monitor weather alerts continuously'
    ],
    'Wildfires': [
      'Create defensible space around buildings',
      'Prepare evacuation bags (go-bags)',
      'Close all windows and doors',
      'Wet down roofs if time permits',
      'Follow evacuation orders immediately'
    ],
    'Earthquakes': [
      'Drop, Cover, and Hold On',
      'Stay away from windows and heavy objects',
      'Check for gas leaks after shaking stops',
      'Inspect building for structural damage',
      'Prepare for aftershocks'
    ],
    'Severe Storms': [
      'Secure outdoor objects',
      'Stay indoors away from windows',
      'Charge all devices',
      'Fill bathtubs with water',
      'Identify shelter location (interior room)'
    ],
    'Temperature Extremes': [
      'Stay in air-conditioned spaces',
      'Drink plenty of water',
      'Check on vulnerable neighbors',
      'Limit outdoor activities',
      'Never leave children/pets in vehicles'
    ],
    'Drought': [
      'Implement water conservation measures',
      'Reduce landscape watering',
      'Fix leaks immediately',
      'Avoid fire-prone activities',
      'Monitor water supply levels'
    ],
    'Landslides': [
      'Evacuate if ground movement detected',
      'Stay alert during heavy rainfall',
      'Report ground cracks to authorities',
      'Avoid affected roads',
      'Listen for unusual sounds (debris flow)'
    ]
  }

  return baseActions[disasterType] || [
    'Monitor situation closely',
    'Follow official instructions',
    'Prepare emergency supplies',
    'Stay informed via weather radio'
  ]
}
