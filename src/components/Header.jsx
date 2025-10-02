import React, { useState, useEffect, useRef } from 'react'
import { debounce } from '../lib/utils/debounce'

export default function Header({
  dateISO,
  onDateChange,
  onGeocode,
  cityName = '',
  showClimate,
  setShowClimate,
  showEvents,
  setShowEvents,
  showWaterFlood,
  setShowWaterFlood,
  showMobility,
  setShowMobility,
  showResilience,
  setShowResilience,
  showScenarios,
  setShowScenarios,
  showAI,
  setShowAI
}) {
  const [cityQuery, setCityQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch city suggestions with debouncing
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('q', query)
      url.searchParams.set('format', 'json')
      url.searchParams.set('addressdetails', '1')
      url.searchParams.set('limit', '8')
      url.searchParams.set('featuretype', 'city')

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      })
      
      if (res.ok) {
        const data = await res.json()
        // Filter for cities, towns, and municipalities
        const cityResults = data.filter(item => 
          item.type === 'city' || 
          item.type === 'town' || 
          item.type === 'municipality' ||
          item.type === 'administrative' ||
          item.class === 'place'
        )
        setSuggestions(cityResults.slice(0, 6))
        setShowSuggestions(cityResults.length > 0)
      }
    } catch (e) {
      console.error('Failed to fetch suggestions:', e)
    }
  }

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useRef(
    debounce(fetchSuggestions, 300)
  ).current

  const handleInputChange = (e) => {
    const value = e.target.value
    setCityQuery(value)
    setError('')
    setSelectedIndex(-1)
    debouncedFetchSuggestions(value)
  }

  const selectSuggestion = (suggestion) => {
    const { lat, lon, display_name } = suggestion
    setCityQuery(display_name)
    setShowSuggestions(false)
    setSuggestions([])
    onGeocode(parseFloat(lat), parseFloat(lon), display_name)
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        searchCity()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex])
        } else {
          searchCity()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
      default:
        break
    }
  }

  const searchCity = async () => {
    if (!cityQuery.trim()) return
    try {
      setLoading(true)
      setError('')
      setShowSuggestions(false)
      
      // OSM Nominatim (public geocoding)
      const url = new URL('https://nominatim.openstreetmap.org/search')
      url.searchParams.set('q', cityQuery)
      url.searchParams.set('format', 'json')
      url.searchParams.set('addressdetails', '1')
      url.searchParams.set('limit', '1')

      const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/json' }
      })
      if (!res.ok) throw new Error('Geocoding failed')
      const data = await res.json()
      if (!data?.length) {
        setError('No results found')
        return
      }
      const { lat, lon } = data[0]
      const displayName = data[0].display_name || cityQuery
      onGeocode(parseFloat(lat), parseFloat(lon), displayName)
    } catch (e) {
      console.error(e)
      setError('Failed to lookup city')
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 bg-gradient-to-b from-space-900/90 to-space-900/40 backdrop-blur-soft border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nasa-blue to-purple-500 flex items-center justify-center shadow-glow">
            <span className="text-lg font-bold">🌍</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold bg-gradient-to-r from-nasa-blue to-purple-400 bg-clip-text text-transparent">MetroScape</h1>
            <p className="text-xs text-white/70">
              {cityName ? `📍 ${cityName}` : 'AI-Powered City Resilience Platform'}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 w-full md:w-auto relative" ref={wrapperRef}>
          <div className="relative w-full md:w-64">
            <input
              className="w-full px-3 py-2 rounded-md bg-space-800/70 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-nasa-blue"
              placeholder="Search city (e.g., Tokyo, London...)"
              value={cityQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-space-800/95 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                {suggestions.map((suggestion, index) => {
                  const cityName = suggestion.address?.city || 
                                   suggestion.address?.town || 
                                   suggestion.address?.municipality ||
                                   suggestion.name
                  const country = suggestion.address?.country
                  const state = suggestion.address?.state
                  
                  return (
                    <div
                      key={suggestion.place_id}
                      className={`px-4 py-3 cursor-pointer border-b border-white/5 last:border-b-0 transition-colors ${
                        index === selectedIndex 
                          ? 'bg-nasa-blue/30' 
                          : 'hover:bg-white/10'
                      }`}
                      onClick={() => selectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-base mt-0.5">📍</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-white truncate">
                            {cityName}
                          </div>
                          <div className="text-xs text-white/60 truncate">
                            {[state, country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          <button
            onClick={searchCity}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-nasa-blue hover:bg-blue-600 text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? '🔍' : 'Search'}
          </button>
          {error && <span className="text-xs text-red-400 ml-2">{error}</span>}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <label className="text-xs text-white/80">
            <span className="mr-2">Date</span>
            <input
              type="date"
              className="px-2 py-1 rounded-md bg-space-800/70 border border-white/10 text-xs"
              value={dateISO}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showAI} onChange={e => setShowAI(e.target.checked)} />
            🤖 AI Crisis
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showResilience} onChange={e => setShowResilience(e.target.checked)} />
            Resilience
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showScenarios} onChange={e => setShowScenarios(e.target.checked)} />
            Scenarios
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showWaterFlood} onChange={e => setShowWaterFlood(e.target.checked)} />
            Water/Flood
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showMobility} onChange={e => setShowMobility(e.target.checked)} />
            Mobility
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showEvents} onChange={e => setShowEvents(e.target.checked)} />
            Events
          </label>
          <label className="text-xs text-white/80 flex items-center gap-2">
            <input type="checkbox" checked={showClimate} onChange={e => setShowClimate(e.target.checked)} />
            Climate
          </label>
        </div>
      </div>
    </header>
  )
}