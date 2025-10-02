import React, { useMemo } from 'react'
import { SKYLINES } from '../../assets/citySilhouettes'

function Layer({ variant = 'highrise', speed = 1, opacity = 0.4, color = '#0b3d91', bottom = 0 }) {
  const paths = SKYLINES[variant]
  // Parallax animation via CSS keyframes (translateX loop)
  const style = {
    animation: `city-move ${40 / speed}s linear infinite`,
    bottom: bottom,
    opacity: opacity,
  }
  return (
    <div className="absolute left-0 right-0" style={style}>
      <div className="flex">
        {[...Array(6)].map((_, i) => (
          <svg key={i} viewBox="0 0 64 40" className="w-[20vw] h-auto" preserveAspectRatio="none">
            <path d={paths[0]} fill={color} stroke="none"/>
          </svg>
        ))}
      </div>
    </div>
  )
}

export default function CityParallax() {
  const variants = useMemo(() => {
    const all = Object.keys(SKYLINES)
    const pick = () => all[Math.floor(Math.random() * all.length)]
    return [pick(), pick(), pick()]
  }, [])

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0">
      <style>{`
        @keyframes city-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20vw); }
        }
      `}</style>
      <Layer variant={variants[0]} speed={1.0} opacity={0.35} color="#0f2247" bottom={0} />
      <Layer variant={variants[1]} speed={0.7} opacity={0.25} color="#123060" bottom={12} />
      <Layer variant={variants[2]} speed={0.5} opacity={0.18} color="#0f1a33" bottom={22} />
    </div>
  )
}