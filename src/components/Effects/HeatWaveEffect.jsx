import React, { useEffect, useRef } from 'react'

/**
 * HeatWaveEffect Component
 * 
 * Creates heat shimmer/distortion effect with:
 * - Rising heat waves
 * - Screen distortion/shimmer
 * - Sun rays
 * - Particle system for heat haze
 */
export default function HeatWaveEffect({ intensity = 0.5 }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const heatParticles = []

    class HeatParticle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + 20
        this.speed = 0.5 + Math.random() * 1.5
        this.size = 20 + Math.random() * 40
        this.opacity = 0.1 + Math.random() * 0.2
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = 0.02 + Math.random() * 0.03
      }

      update() {
        this.y -= this.speed * intensity
        this.wobble += this.wobbleSpeed
        this.opacity -= 0.001
        
        if (this.y < -this.size || this.opacity <= 0) {
          this.y = canvas.height + 20
          this.x = Math.random() * canvas.width
          this.opacity = 0.1 + Math.random() * 0.2
        }
      }

      draw() {
        const wobbleX = Math.sin(this.wobble) * 10
        
        const gradient = ctx.createRadialGradient(
          this.x + wobbleX, this.y, 0,
          this.x + wobbleX, this.y, this.size
        )
        gradient.addColorStop(0, `rgba(255, 150, 50, ${this.opacity})`)
        gradient.addColorStop(0.5, `rgba(255, 200, 100, ${this.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(255, 100, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x + wobbleX, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < 30; i++) {
      heatParticles.push(new HeatParticle())
    }

    // Sun rays
    let rayAngle = 0

    function drawSunRays() {
      const centerX = canvas.width - 100
      const centerY = 100
      
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rayAngle)
      
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i
        
        ctx.save()
        ctx.rotate(angle)
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 200)
        gradient.addColorStop(0, 'rgba(255, 200, 0, 0.1)')
        gradient.addColorStop(1, 'rgba(255, 200, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.moveTo(-5, 0)
        ctx.lineTo(5, 0)
        ctx.lineTo(2, 200)
        ctx.lineTo(-2, 200)
        ctx.closePath()
        ctx.fill()
        
        ctx.restore()
      }
      
      ctx.restore()
      
      rayAngle += 0.002
    }

    function animate() {
      // Clear with orange tint
      ctx.fillStyle = 'rgba(10, 5, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Overall heat overlay
      ctx.fillStyle = `rgba(255, 100, 0, ${0.02 * intensity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw sun rays
      drawSunRays()

      // Update and draw heat particles
      heatParticles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
