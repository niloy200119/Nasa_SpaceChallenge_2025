import React, { useEffect, useRef } from 'react'

/**
 * FloodEffect Component
 * 
 * Creates an immersive flood/water animation with:
 * - Animated water ripples
 * - Rain drops falling
 * - Water surface shimmer
 * - Blue/cyan color overlay
 * - Rising water level animation
 */
export default function FloodEffect({ intensity = 0.5, showRain = true }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particle system for rain
    const raindrops = []
    const ripples = []

    class Raindrop {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = -10
        this.speed = 3 + Math.random() * 5
        this.length = 10 + Math.random() * 20
        this.opacity = 0.3 + Math.random() * 0.4
      }

      update() {
        this.y += this.speed * intensity
        if (this.y > canvas.height) {
          // Create ripple on impact
          if (Math.random() > 0.7) {
            ripples.push(new Ripple(this.x, canvas.height - 100))
          }
          this.y = -10
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        ctx.strokeStyle = `rgba(100, 200, 255, ${this.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y + this.length)
        ctx.stroke()
      }
    }

    class Ripple {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = 0
        this.maxRadius = 30 + Math.random() * 20
        this.opacity = 0.6
        this.speed = 2
      }

      update() {
        this.radius += this.speed
        this.opacity -= 0.02
      }

      draw() {
        if (this.opacity > 0 && this.radius < this.maxRadius) {
          ctx.strokeStyle = `rgba(100, 200, 255, ${this.opacity})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      isFinished() {
        return this.opacity <= 0 || this.radius >= this.maxRadius
      }
    }

    // Initialize raindrops
    const raindropCount = Math.floor(50 * intensity)
    for (let i = 0; i < raindropCount; i++) {
      raindrops.push(new Raindrop())
    }

    // Water level wave
    let waveOffset = 0

    function animate() {
      // Semi-transparent clear for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw water surface wave
      waveOffset += 0.02
      ctx.fillStyle = 'rgba(30, 144, 255, 0.1)'
      ctx.beginPath()
      ctx.moveTo(0, canvas.height - 100)
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height - 100 + Math.sin(x * 0.01 + waveOffset) * 10
        ctx.lineTo(x, y)
      }
      
      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      ctx.fill()

      // Draw rain
      if (showRain) {
        raindrops.forEach(drop => {
          drop.update()
          drop.draw()
        })
      }

      // Draw ripples
      ripples.forEach((ripple, index) => {
        ripple.update()
        ripple.draw()
        if (ripple.isFinished()) {
          ripples.splice(index, 1)
        }
      })

      // Add random ripples occasionally
      if (Math.random() > 0.98 && ripples.length < 20) {
        ripples.push(new Ripple(
          Math.random() * canvas.width,
          canvas.height - 100 + Math.random() * 20
        ))
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity, showRain])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
