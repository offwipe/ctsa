import { useMemo } from 'react'
import { rgba } from '../../context/appTheme'
import './WinterFrame.css'

type WinterFrameProps = {
  enabled: boolean
  intensity: number
  fallSpeed: number
  snowflakeSize: number
  borderZone: number
  glowEffect: boolean
  windDrift: boolean
  snowColor: string
}

type Particle = {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  drift: number
  opacity: number
}

function createParticles(count: number, fallSpeed: number, snowflakeSize: number, windDrift: boolean): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 13.7) % 100,
    delay: ((i * 0.47) % 8) * -1,
    duration: 8 - Math.min(5, fallSpeed / 16) + (i % 5) * 1.2,
    size: 1.2 + snowflakeSize / 16 + (i % 4) * 0.6,
    drift: windDrift ? ((i % 7) - 3) * 10 : 0,
    opacity: 0.2 + (i % 5) * 0.1,
  }))
}

export function WinterFrame({
  enabled,
  intensity,
  fallSpeed,
  snowflakeSize,
  borderZone,
  glowEffect,
  windDrift,
  snowColor,
}: WinterFrameProps) {
  const particles = useMemo(() => {
    if (!enabled) return []
    const count = Math.max(10, Math.round(intensity * 0.9))
    return createParticles(count, fallSpeed, snowflakeSize, windDrift)
  }, [enabled, intensity, fallSpeed, snowflakeSize, windDrift])

  if (!enabled) return null

  const edgeWidth = Math.max(6, borderZone)

  return (
    <div aria-hidden className="winter-frame">
      {particles.map(p => (
        <span
          key={p.id}
          className="winter-particle"
          style={{
            left: `${p.x}%`,
            top: `-${p.size + 4}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            backgroundColor: snowColor,
            boxShadow: glowEffect ? `0 0 ${p.size * 6}px ${rgba(snowColor, 0.3)}` : 'none',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--snow-drift' as string]: `${p.drift}px`,
            ['--snow-edge' as string]: `${edgeWidth}px`,
          }}
        />
      ))}
    </div>
  )
}
