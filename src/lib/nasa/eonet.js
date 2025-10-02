// NASA EONET v3: https://eonet.gsfc.nasa.gov/docs/v3
export async function fetchEonetEventsInBbox(bboxString) {
  const url = new URL('https://eonet.gsfc.nasa.gov/api/v3/events')
  url.searchParams.set('status', 'open')
  if (bboxString) url.searchParams.set('bbox', bboxString)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to fetch EONET events')
  return res.json()
}