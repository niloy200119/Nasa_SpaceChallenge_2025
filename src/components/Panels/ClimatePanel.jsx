import React, { useEffect, useRef, useState } from 'react'
import { fetchPowerClimatology } from '../../lib/nasa/power'
import Chart from 'chart.js/auto'

export default function ClimatePanel({ lat, lon }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchPowerClimatology(lat, lon)
        if (!active) return
        renderChart(data)
      } catch (e) {
        console.error(e)
        setError('Failed to load climate data')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false; if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null } }
  }, [lat, lon])

  function renderChart({ months, T2M, PRECTOT }) {
    if (chartRef.current) {
      chartRef.current.destroy()
      chartRef.current = null
    }
    const ctx = canvasRef.current.getContext('2d')
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            type: 'line',
            label: '2m Air Temp (°C)',
            data: T2M,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96,165,250,0.2)',
            yAxisID: 'y1',
            tension: 0.35
          },
          {
            type: 'bar',
            label: 'Precip (mm/day)',
            data: PRECTOT,
            backgroundColor: 'rgba(252,61,33,0.5)',
            borderColor: '#fc3d21',
            yAxisID: 'y'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            position: 'left',
            grid: { color: 'rgba(255,255,255,0.08)' },
            ticks: { color: '#fff' },
            title: { display: true, text: 'Precip (mm/day)', color: '#fff' }
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: '#fff' },
            title: { display: true, text: 'Temp (°C)', color: '#fff' }
          },
          x: {
            ticks: { color: '#fff' },
            grid: { color: 'rgba(255,255,255,0.05)' }
          }
        },
        plugins: {
          legend: { labels: { color: '#fff' } },
          tooltip: { mode: 'index', intersect: false }
        }
      }
    })
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-white/70">Lat: {lat.toFixed(3)} Lon: {lon.toFixed(3)}</div>
      <div className="h-56 relative">
        {loading && <div className="absolute inset-0 grid place-items-center text-sm text-white/70">Loading…</div>}
        {error && <div className="absolute inset-0 grid place-items-center text-sm text-red-400">{error}</div>}
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  )
}