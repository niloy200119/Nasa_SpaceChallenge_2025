import React, { useEffect, useRef } from 'react'

/**
 * TrafficEffect Component
 * 
 * Creates dynamic traffic flow visualization with:
 * - Flowing light trails (vehicles)
 * - Pulsing intersections
 * - Congestion heat waves
 * - Grid patterns for roads
 * - Traffic density indicators
 */
export default function TrafficEffect({ intensity = 0.5, congestionLevel = 0.3 }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Vehicle light trails
    const vehicles = []
    const intersections = []

    class Vehicle {
      constructor() {
        this.direction = Math.random() > 0.5 ? 'horizontal' : 'vertical'
        
        if (this.direction === 'horizontal') {
          this.x = Math.random() > 0.5 ? -20 : canvas.width + 20
          this.y = Math.random() * canvas.height
          this.speedX = this.x < 0 ? (2 + Math.random() * 3) * intensity : -(2 + Math.random() * 3) * intensity
          this.speedY = 0
        } else {
          this.x = Math.random() * canvas.width
          this.y = Math.random() > 0.5 ? -20 : canvas.height + 20
          this.speedX = 0
          this.speedY = this.y < 0 ? (2 + Math.random() * 3) * intensity : -(2 + Math.random() * 3) * intensity
        }
        
        this.length = 20 + Math.random() * 30
        this.color = Math.random() > 0.5 
          ? `rgba(255, ${100 + Math.floor(Math.random() * 155)}, 0, 0.6)` // Orange/red for cars
          : `rgba(255, 255, 255, 0.6)` // White for cars
        this.trail = []
      }

      update() {
        // Store trail positions
        this.trail.push({ x: this.x, y: this.y })
        if (this.trail.length > 10) this.trail.shift()

        this.x += this.speedX
        this.y += this.speedY

        // Slow down in congestion zones
        if (congestionLevel > 0.5 && Math.random() > 0.98) {
          this.speedX *= 0.5
          this.speedY *= 0.5
        }
      }

      draw() {
        // Draw trail
        ctx.lineWidth = 2
        ctx.strokeStyle = this.color
        ctx.beginPath()
        
        this.trail.forEach((point, index) => {
          const opacity = (index / this.trail.length) * 0.6
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        
        ctx.stroke()

        // Draw vehicle (bright dot)
        ctx.fillStyle = this.color.replace('0.6', '1')
        ctx.beginPath()
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      isOffScreen() {
        return this.x < -50 || this.x > canvas.width + 50 ||
               this.y < -50 || this.y > canvas.height + 50
      }
    }

    class Intersection {
      constructor() {
        this.x = (Math.random() * 0.8 + 0.1) * canvas.width
        this.y = (Math.random() * 0.8 + 0.1) * canvas.height
        this.radius = 0
        this.maxRadius = 30
        this.pulseSpeed = 0.05
        this.opacity = 0.4
      }

      update() {
        this.radius += this.pulseSpeed
        if (this.radius > this.maxRadius) {
          this.radius = 0
        }
      }

      draw() {
        // Pulsing circle
        const opacity = (1 - this.radius / this.maxRadius) * this.opacity
        ctx.strokeStyle = `rgba(0, 255, 200, ${opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.stroke()

        // Center dot
        ctx.fillStyle = `rgba(0, 255, 200, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize intersections
    for (let i = 0; i < 8; i++) {
      intersections.push(new Intersection())
    }

    // Road grid lines
    function drawRoadGrid() {
      ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)'
      ctx.lineWidth = 1

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
    }

    // Heat map for congestion
    function drawCongestionHeat() {
      if (congestionLevel > 0.3) {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width / 2
        )
        gradient.addColorStop(0, `rgba(255, 0, 0, ${congestionLevel * 0.1})`)
        gradient.addColorStop(0.5, `rgba(255, 100, 0, ${congestionLevel * 0.05})`)
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    function animate() {
      // Clear with slight fade for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw road grid
      drawRoadGrid()

      // Draw congestion heat
      drawCongestionHeat()

      // Spawn new vehicles
      if (Math.random() < intensity * 0.3 && vehicles.length < 100) {
        vehicles.push(new Vehicle())
      }

      // Update and draw vehicles
      vehicles.forEach((vehicle, index) => {
        vehicle.update()
        vehicle.draw()
        
        if (vehicle.isOffScreen()) {
          vehicles.splice(index, 1)
        }
      })

      // Update and draw intersections
      intersections.forEach(intersection => {
        intersection.update()
        intersection.draw()
      })

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
  }, [intensity, congestionLevel])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
