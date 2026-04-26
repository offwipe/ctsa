import { useMemo } from 'react'
import './WindFrame.css'

type WindFrameProps = {
  enabled: boolean
  cloudDensity: number
  driftSpeed: number
  cloudOpacity: number
}

type Cloud = {
  id: number
  y: number
  delay: number
  duration: number
  width: number
  height: number
  blur: number
  opacity: number
  layer: 'back' | 'mid' | 'front'
}

function createClouds(count: number, driftSpeed: number, cloudOpacity: number): Cloud[] {
  return Array.from({ length: count }, (_, i) => {
    const layer: Cloud['layer'] = i % 3 === 0 ? 'back' : i % 3 === 1 ? 'mid' : 'front'
    const layerScale = layer === 'back' ? 0.7 : layer === 'mid' ? 1 : 1.35
    const speedFactor = Math.max(0.4, 1.6 - driftSpeed / 60)
    const baseDuration = 30 + (i % 4) * 5
    return {
      id: i,
      y: 4 + ((i * 17.3) % 86),
      delay: -((i * 0.7) % baseDuration),
      duration: baseDuration * speedFactor * (layer === 'back' ? 1.35 : layer === 'mid' ? 1 : 0.8),
      width: (180 + (i % 5) * 60) * layerScale,
      height: (50 + (i % 4) * 16) * layerScale,
      blur: layer === 'back' ? 26 : layer === 'mid' ? 16 : 8,
      opacity: (cloudOpacity / 100) * (layer === 'back' ? 0.55 : layer === 'mid' ? 0.78 : 1),
      layer,
    }
  })
}

export function WindFrame({ enabled, cloudDensity, driftSpeed, cloudOpacity }: WindFrameProps) {
  const clouds = useMemo(() => {
    if (!enabled) return []
    const count = Math.max(4, Math.round(cloudDensity / 6))
    return createClouds(count, driftSpeed, cloudOpacity)
  }, [enabled, cloudDensity, driftSpeed, cloudOpacity])

  if (!enabled) return null

  return (
    <div aria-hidden className="wind-frame">
      <div className="wind-frame-vignette" />
      {clouds.map((cloud) => (
        <span
          key={cloud.id}
          className={`wind-cloud wind-cloud--${cloud.layer}`}
          style={{
            top: `${cloud.y}%`,
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            opacity: cloud.opacity,
            filter: `blur(${cloud.blur}px)`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
