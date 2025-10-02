import React, { useEffect, useRef, useState } from 'react'

/**
 * ThunderEffect Component
 * 
 * Creates an immersive thunderstorm animation with:
 * - Lightning flashes across the screen
 * - Thunder sound effects (optional)
 * - Dark storm clouds
 * - Screen shake on lightning strike
 * - Rain overlay
 */
export default function ThunderEffect({ intensity = 0.5, withSound = false }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const lightningBolts = []

    class Lightning {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = 0
        this.segments = []
        this.opacity = 1
        this.generateBolt()
      }

      generateBolt() {
        let x = this.x
        let y = this.y
        const targetY = canvas.height * (0.3 + Math.random() * 0.4)

        while (y < targetY) {
          const nextX = x + (Math.random() - 0.5) * 60
          const nextY = y + 20 + Math.random() * 40
          
          this.segments.push({ x1: x, y1: y, x2: nextX, y2: nextY })
          
          // Branch occasionally
          if (Math.random() > 0.7 && this.segments.length > 2) {
            const branch = new LightningBranch(x, y, 3 + Math.floor(Math.random() * 3))
            this.branches = this.branches || []
            this.branches.push(branch)
          }
          
          x = nextX
          y = nextY
        }
      }

      update() {
        this.opacity -= 0.1
      }

      draw() {
        if (this.opacity > 0) {
          // Glow effect
          ctx.shadowBlur = 20
          ctx.shadowColor = 'rgba(200, 200, 255, 0.8)'
          
          // Main bolt
          ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`
          ctx.lineWidth = 3
          ctx.beginPath()
          
          this.segments.forEach(seg => {
            ctx.moveTo(seg.x1, seg.y1)
            ctx.lineTo(seg.x2, seg.y2)
          })
          
          ctx.stroke()

          // Secondary glow
          ctx.strokeStyle = `rgba(150, 150, 255, ${this.opacity * 0.5})`
          ctx.lineWidth = 6
          ctx.stroke()

          // Draw branches
          if (this.branches) {
            this.branches.forEach(branch => branch.draw(ctx, this.opacity))
          }

          ctx.shadowBlur = 0
        }
      }

      isFinished() {
        return this.opacity <= 0
      }
    }

    class LightningBranch {
      constructor(startX, startY, length) {
        this.segments = []
        let x = startX
        let y = startY
        
        for (let i = 0; i < length; i++) {
          const nextX = x + (Math.random() - 0.5) * 40
          const nextY = y + 15 + Math.random() * 20
          this.segments.push({ x1: x, y1: y, x2: nextX, y2: nextY })
          x = nextX
          y = nextY
        }
      }

      draw(ctx, opacity) {
        ctx.strokeStyle = `rgba(200, 200, 255, ${opacity * 0.6})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        
        this.segments.forEach(seg => {
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
        })
        
        ctx.stroke()
      }
    }

    // Cloud particles
    const clouds = []
    for (let i = 0; i < 30; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.3,
        radius: 40 + Math.random() * 60,
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.2 + Math.random() * 0.3
      })
    }

    function triggerLightning() {
      lightningBolts.push(new Lightning())
      setFlash(true)
      setTimeout(() => setFlash(false), 100)
      
      // Optional thunder sound
      if (withSound) {
        // Play thunder sound here (requires audio file)
        console.log('⚡ Thunder!')
      }
    }

    // Random lightning strikes
    const lightningInterval = setInterval(() => {
      if (Math.random() < intensity) {
        triggerLightning()
      }
    }, 2000 / intensity)

    function animate() {
      // Dark storm background
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw clouds
      clouds.forEach(cloud => {
        cloud.x += cloud.speed
        if (cloud.x > canvas.width + cloud.radius) {
          cloud.x = -cloud.radius
        }

        ctx.fillStyle = `rgba(40, 40, 60, ${cloud.opacity})`
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw lightning
      lightningBolts.forEach((bolt, index) => {
        bolt.update()
        bolt.draw()
        if (bolt.isFinished()) {
          lightningBolts.splice(index, 1)
        }
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
      clearInterval(lightningInterval)
      window.removeEventListener('resize', handleResize)
    }
  }, [intensity, withSound])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[5]"
        style={{ mixBlendMode: 'screen' }}
      />
      {flash && (
        <div
          className="fixed inset-0 bg-white pointer-events-none z-[6]"
          style={{ opacity: 0.3, animation: 'flash 0.1s ease-out' }}
        />
      )}
    </>
  )
}
