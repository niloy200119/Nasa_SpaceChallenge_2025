import React, { useState } from 'react'

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
  setShowScenarios
}) {
  const [cityQuery, setCityQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const searchCity = async () => {
    if (!cityQuery.trim()) return
    try {
      setLoading(true)
      setError('')
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
          <div className="w-10 h-10 rounded-full bg-nasa-blue flex items-center justify-center shadow-glow">
            <span className="text-sm font-bold">NASA</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold">City Resilience Explorer</h1>
            <p className="text-xs text-white/70">
              {cityName ? `📍 ${cityName}` : 'GIBS • EONET • POWER'}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            className="w-full md:w-64 px-3 py-2 rounded-md bg-space-800/70 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-nasa-blue"
            placeholder="Search city (e.g., Accra, Ghana)"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchCity()}
          />
          <button
            onClick={searchCity}
            disabled={loading}
            className="px-3 py-2 rounded-md bg-nasa-blue hover:bg-blue-600 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
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