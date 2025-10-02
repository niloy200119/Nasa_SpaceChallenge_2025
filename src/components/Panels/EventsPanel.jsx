import React, { useEffect, useState } from 'react'
import { fetchEonetEventsInBbox } from '../../lib/nasa/eonet'
import { bboxToString } from '../../lib/nasa/utils/geo'

export default function EventsPanel({ bbox }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      if (!bbox) return
      try {
        setLoading(true)
        setError('')
        const bboxStr = bboxToString(bbox)
        const json = await fetchEonetEventsInBbox(bboxStr)
        if (!active) return
        setEvents(json?.events ?? [])
      } catch (e) {
        console.error(e)
        setError('Failed to load EONET events')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    // re-fetch on bbox change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(bbox)])

  return (
    <div className="space-y-2">
      {loading && <div className="text-sm text-white/70">Loading…</div>}
      {error && <div className="text-sm text-red-400">{error}</div>}
      {!loading && !error && (
        <ul className="space-y-2">
          {events.length === 0 && <li className="text-sm text-white/60">No open events in view</li>}
          {events.map(ev => (
            <li key={ev.id} className="p-2 rounded-md bg-space-700/60 border border-white/10">
              <div className="text-sm font-semibold">{ev.title}</div>
              <div className="text-xs text-white/70 flex flex-wrap gap-2">
                <span>Category: {ev.categories?.[0]?.title ?? '—'}</span>
                <a className="underline hover:text-blue-300" target="_blank" rel="noreferrer" href={ev.link}>Details</a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}