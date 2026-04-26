import { useMemo } from 'react'
import { rgba } from '../../context/appTheme'
import './RainFrame.css'

type RainFrameProps = {
  enabled: boolean
  intensity: number
  fallSpeed: number
  dropSize: number
  angle: number
  rainColor: string
  glow: boolean
}

type Drop = {
  id: number
  x: number
  delay: number
  duration: number
  length: number
  thickness: number
  opacity: number
}

function createDrops(count: number, fallSpeed: number, dropSize: number): Drop[] {
  return Array.from({ length: count }, (_, i) => {
    const speedFactor = 0.55 + fallSpeed / 130
    return {
      id: i,
      x: (i * 7.3) % 100,
      delay: ((i * 0.27) % 4) * -1,
      duration: 0.8 + (1.6 - speedFactor) + (i % 5) * 0.18,
      length: 14 + dropSize * 0.55 + (i % 4) * 4,
      thickness: 1 + dropSize / 60 + (i % 3) * 0.25,
      opacity: 0.18 + (i % 4) * 0.08,
    }
  })
}

export function RainFrame({
  enabled,
  intensity,
  fallSpeed,
  dropSize,
  angle,
  rainColor,
  glow,
}: RainFrameProps) {
  const drops = useMemo(() => {
    if (!enabled) return []
    const count = Math.max(12, Math.round(intensity * 1.6))
    return createDrops(count, fallSpeed, dropSize)
  }, [enabled, intensity, fallSpeed, dropSize])

  if (!enabled) return null

  const tilt = Math.max(-30, Math.min(30, angle))

  return (
    <div
      aria-hidden
      className="rain-frame"
      style={{ ['--rain-tilt' as string]: `${tilt}deg` }}
    >
      {drops.map((drop) => (
        <span
          key={drop.id}
          className="rain-drop"
          style={{
            left: `${drop.x}%`,
            width: `${drop.thickness}px`,
            height: `${drop.length}px`,
            opacity: drop.opacity,
            background: `linear-gradient(180deg, transparent, ${rgba(rainColor, 0.85)}, ${rgba(rainColor, 0.2)})`,
            boxShadow: glow ? `0 0 ${drop.thickness * 4}px ${rgba(rainColor, 0.35)}` : 'none',
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
