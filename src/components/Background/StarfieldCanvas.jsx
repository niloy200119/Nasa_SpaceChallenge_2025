import React, { useEffect, useRef } from 'react'

function rand(min, max) { return Math.random() * (max - min) + min }

export default function StarfieldCanvas() {
  const canvasRef = useRef(null)
  const rafRef = useRef()
  const starsRef = useRef([])
  const satellitesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
      initSatellites()
    }
    function initStars() {
      const count = Math.min(400, Math.floor((canvas.width * canvas.height) / 6000))
      starsRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: rand(0.2, 1.2),
        tw: rand(0.2, 1),
        p: Math.random() * Math.PI * 2,
      }))
    }
    function initSatellites() {
      satellitesRef.current = Array.from({ length: 2 }).map(() => ({
        x: Math.random() * canvas.width,
        y: rand(canvas.height * 0.15, canvas.height * 0.45),
        vx: rand(0.4, 0.8),
        r: rand(1.2, 2.2),
      }))
    }

    function draw() {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      // Background gradient
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#0a0f1f')
      g.addColorStop(1, '#0f1a33')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (const s of starsRef.current) {
        s.p += s.tw * 0.02
        const alpha = 0.6 + 0.4 * Math.sin(s.p)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        ctx.fill()
      }

      // Satellites (simple dots with trail)
      for (const sat of satellitesRef.current) {
        sat.x += sat.vx
        if (sat.x > w + 20) { sat.x = -20; sat.y = rand(h * 0.15, h * 0.45) }
        ctx.beginPath()
        ctx.fillStyle = '#fc3d21'
        ctx.arc(sat.x, sat.y, sat.r, 0, Math.PI * 2)
        ctx.fill()
        // trail
        const grad = ctx.createLinearGradient(sat.x - 40, sat.y, sat.x, sat.y)
        grad.addColorStop(0, 'rgba(252,61,33,0)')
        grad.addColorStop(1, 'rgba(252,61,33,0.8)')
        ctx.strokeStyle = grad
        ctx.beginPath()
        ctx.moveTo(sat.x - 40, sat.y)
        ctx.lineTo(sat.x, sat.y)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}