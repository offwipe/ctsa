import { useCallback, useEffect, useRef } from 'react'
import { hexToRgb } from '../../context/appTheme'
import './RainFrame.css'

type RainFrameProps = {
  enabled: boolean
  intensity: number
  fallSpeed: number
  dropSize: number
  angle: number
  windMph: number
  turbulence: number
  rainColor: string
  glow: boolean
}

type Drop = {
  x: number
  y: number
  smoothVx: number
  len: number
  thick: number
  opacity: number
  phase: number
}

/** Maps 0–45 mph to a horizontal component (px/s) scaled to viewport width. */
function windMphToPxPerSec( mph: number, wCss: number ) {
  const t = Math.max( 0, Math.min( 1, mph / 45 ) )
  return ( t * 0.9 + t * t * 0.55 ) * ( wCss * 0.08 )
}

export function RainFrame( {
  enabled,
  intensity,
  fallSpeed,
  dropSize,
  windMph,
  turbulence,
  rainColor,
  glow,
}: RainFrameProps ) {
  const canvasRef = useRef<HTMLCanvasElement>( null )
  const dropsRef = useRef<Drop[]>( [] )
  const paramsRef = useRef( { intensity, fallSpeed, dropSize, windMph, turbulence, rainColor, glow } )
  const rafRef = useRef( 0 )
  const reducedRef = useRef( false )
  const timeRef = useRef( 0 )

  useEffect( () => {
    paramsRef.current = { intensity, fallSpeed, dropSize, windMph, turbulence, rainColor, glow }
  }, [intensity, fallSpeed, dropSize, windMph, turbulence, rainColor, glow] )

  const resize = useCallback( () => {
    const c = canvasRef.current
    if ( !c ) return
    const p = c.parentElement
    if ( !p ) return
    const dpr = Math.min( 2, window.devicePixelRatio || 1 )
    const w = p.clientWidth
    const h = p.clientHeight
    c.width = Math.max( 1, Math.floor( w * dpr ) )
    c.height = Math.max( 1, Math.floor( h * dpr ) )
    c.style.width = `${w}px`
    c.style.height = `${h}px`
  }, [] )

  const ensureDrops = useCallback( ( wCss: number, hCss: number, n: number ) => {
    const next: Drop[] = []
    for ( let i = 0; i < n; i += 1 ) {
      next.push( {
        x: Math.random() * wCss,
        y: Math.random() * hCss,
        smoothVx: 0,
        len: 10 + ( dropSize / 100 ) * 28 + ( i % 5 ) * 2,
        thick: 0.55 + ( dropSize / 100 ) * 1.5 + ( i % 3 ) * 0.12,
        opacity: 0.11 + ( i % 6 ) * 0.042,
        phase: i * 2.17,
      } )
    }
    dropsRef.current = next
  }, [dropSize] )

  useEffect( () => {
    if ( !enabled ) return
    reducedRef.current = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches
    const mq = window.matchMedia( '(prefers-reduced-motion: reduce)' )
    const h = () => { reducedRef.current = mq.matches }
    mq.addEventListener( 'change', h )
    return () => mq.removeEventListener( 'change', h )
  }, [enabled] )

  useEffect( () => {
    if ( !enabled ) {
      if ( rafRef.current ) cancelAnimationFrame( rafRef.current )
      return
    }

    const canvas = canvasRef.current
    if ( !canvas ) return
    const ctx = canvas.getContext( '2d' )
    if ( !ctx ) return

    const dpr = Math.min( 2, window.devicePixelRatio || 1 )
    let last = performance.now()

    const frame = ( now: number ) => {
      timeRef.current = now
      const dt = Math.min( 0.033, ( now - last ) / 1000 )
      last = now

      const p = paramsRef.current
      const wPx = canvas.width
      const hPx = canvas.height
      const wCss = wPx / dpr
      const hCss = hPx / dpr
      const rm = reducedRef.current
      const count = rm
        ? Math.max( 6, Math.round( p.intensity * 0.4 ) )
        : Math.max( 20, Math.round( p.intensity * 1.2 ) )
      if ( dropsRef.current.length !== count ) ensureDrops( wCss, hCss, count )

      const { r, g, b } = hexToRgb( p.rainColor )
      const baseWind = windMphToPxPerSec( p.windMph, wCss )
      const fallVy = 320 + ( p.fallSpeed / 100 ) * 640
      const turb = ( p.turbulence / 100 ) * 1

      ctx.setTransform( dpr, 0, 0, dpr, 0, 0 )
      ctx.clearRect( 0, 0, wCss, hCss )

      for ( const d of dropsRef.current ) {
        const gust = rm ? 0 : ( Math.random() - 0.5 ) * 2 * turb * wCss * 0.04
        const wave = Math.sin( now * 0.00035 + d.phase ) * turb * 45
        const targetVx = baseWind + gust + wave
        d.smoothVx = d.smoothVx * 0.88 + targetVx * 0.12

        d.x += d.smoothVx * dt
        d.y += fallVy * dt
        if ( !rm && turb > 0.05 ) {
          d.x += ( Math.random() - 0.5 ) * turb * 8 * dt
        }

        if ( d.y > hCss + 30 ) {
          d.y = -20 - Math.random() * 100
          d.x = Math.random() * wCss
        }
        if ( d.x < -30 ) d.x = wCss + 10
        if ( d.x > wCss + 30 ) d.x = -10

        const sp = Math.hypot( d.smoothVx, fallVy ) + 0.001
        const ux = d.smoothVx / sp
        const uy = fallVy / sp
        const x1 = d.x
        const y1 = d.y
        const x2 = d.x - ux * d.len
        const y2 = d.y - uy * d.len

        ctx.beginPath()
        const alpha = d.opacity * ( 0.7 + 0.3 * ( p.intensity / 100 ) )
        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.lineWidth = d.thick
        ctx.lineCap = 'round'
        if ( p.glow && !rm ) {
          ctx.shadowColor = `rgba(${r},${g},${b},0.4)`
          ctx.shadowBlur = d.thick * 3.5
        } else {
          ctx.shadowBlur = 0
        }
        ctx.moveTo( x1, y1 )
        ctx.lineTo( x2, y2 )
        ctx.stroke()
      }
      rafRef.current = requestAnimationFrame( frame )
    }
    rafRef.current = requestAnimationFrame( frame )
    return () => { if ( rafRef.current ) cancelAnimationFrame( rafRef.current ) }
  }, [enabled, ensureDrops] )

  useEffect( () => {
    if ( !enabled ) return
    resize()
    const c = canvasRef.current
    const ro = new ResizeObserver( () => resize() )
    if ( c?.parentElement ) ro.observe( c.parentElement )
    window.addEventListener( 'resize', resize )
    return () => {
      ro.disconnect()
      window.removeEventListener( 'resize', resize )
    }
  }, [enabled, resize] )

  if ( !enabled ) return null
  return <canvas ref={canvasRef} className="rain-frame" aria-hidden />
}
