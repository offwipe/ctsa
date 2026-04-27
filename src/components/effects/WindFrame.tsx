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

function createClouds( count: number, driftSpeed: number, cloudOpacity: number ): Cloud[] {
  return Array.from( { length: count }, ( _, i ) => {
    const layer: Cloud['layer'] = i % 3 === 0 ? 'back' : i % 3 === 1 ? 'mid' : 'front'
    const layerScale = layer === 'back' ? 0.68 : layer === 'mid' ? 1 : 1.4
    const speedT = Math.max( 0, Math.min( 1, driftSpeed / 100 ) )
    const speedFactor = 0.5 + ( 1 - speedT ) * 0.9
    const parallax = layer === 'back' ? 1.45 : layer === 'mid' ? 1.05 : 0.75
    const baseDuration = 72 + ( i % 5 ) * 16
    return {
      id: i,
      y: 3 + ( ( i * 19.1 ) % 88 ),
      delay: -( ( i * 0.9 ) % 100 ),
      duration: baseDuration * speedFactor * parallax * 1.1,
      width: ( 200 + ( i % 6 ) * 70 ) * layerScale,
      height: ( 52 + ( i % 4 ) * 20 ) * layerScale,
      blur: layer === 'back' ? 32 : layer === 'mid' ? 18 : 6,
      opacity: ( cloudOpacity / 100 ) * ( layer === 'back' ? 0.5 : layer === 'mid' ? 0.75 : 0.95 ),
      layer,
    }
  } )
}

export function WindFrame( { enabled, cloudDensity, driftSpeed, cloudOpacity }: WindFrameProps ) {
  const clouds = useMemo( () => {
    if ( !enabled ) return []
    const count = Math.max( 3, Math.round( cloudDensity / 7 ) )
    return createClouds( count, driftSpeed, cloudOpacity )
  }, [enabled, cloudDensity, driftSpeed, cloudOpacity] )

  if ( !enabled ) return null

  return (
    <div aria-hidden className="wind-frame">
      <div className="wind-frame-vignette" />
      <div className="wind-frame-ambient-glow" aria-hidden />
      {clouds.map( ( cloud ) => (
        <div
          key={cloud.id}
          className={`wind-cloud wind-cloud--${cloud.layer}`}
          style={ {
            top: `${cloud.y}%`,
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            opacity: cloud.opacity,
            filter: `blur(${cloud.blur}px)`,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          } }
        >
          <span className="wind-cloud__bloom" />
          <span className="wind-cloud__body" />
          <span className="wind-cloud__rim" />
        </div>
      ) ) }
    </div>
  )
}
