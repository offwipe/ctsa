import { useEffect } from 'react'
import { getAtmosphereEngine } from '../audio/atmosphereAudio'
import type { AtmosphereMode } from '../context/appTheme'

type RainOrWind = Extract<AtmosphereMode, 'rain' | 'wind'>

type UseAtmosphereAudioOptions = {
  enabled: boolean
  mode: AtmosphereMode
  volume: number
  windChimeLevel: number
}

/**
 * Drives the atmosphere bed (rain / wind) + wind chime mix.
 * setMode is a no-op when the mode is unchanged, so we can include windChimeLevel
 * in the same effect and only update chime after the async graph is ready the first time.
 */
export function useAtmosphereAudio( { enabled, mode, volume, windChimeLevel }: UseAtmosphereAudioOptions ) {
  useEffect( () => {
    const engine = getAtmosphereEngine()
    engine.setEnabled( enabled )
    engine.setVolume( volume / 100 )
  }, [enabled, volume] )

  useEffect( () => {
    const engine = getAtmosphereEngine()
    let cancelled = false

    const applyChime = () => {
      if ( !enabled || mode !== 'wind' ) {
        engine.setWindChimeLevel( 0 )
        return
      }
      engine.setWindChimeLevel( windChimeLevel / 100 )
    }

    const run = async () => {
      if ( !enabled || ( mode !== 'rain' && mode !== 'wind' ) ) {
        try {
          await engine.setMode( 'off' )
        } catch {
          // ignore
        }
        if ( !cancelled ) applyChime()
        return
      }
      const target: RainOrWind = mode === 'rain' ? 'rain' : 'wind'
      try {
        await engine.setMode( target )
      } catch {
        // ignore
      }
      if ( !cancelled ) applyChime()
    }

    const onFirst = () => {
      void run()
      window.removeEventListener( 'pointerdown', onFirst )
      window.removeEventListener( 'keydown', onFirst )
    }

    if ( mode === 'rain' || mode === 'wind' ) {
      void run()
      window.addEventListener( 'pointerdown', onFirst, { once: true } )
      window.addEventListener( 'keydown', onFirst, { once: true } )
    } else {
      void run()
    }

    return () => {
      cancelled = true
      window.removeEventListener( 'pointerdown', onFirst )
      window.removeEventListener( 'keydown', onFirst )
    }
  }, [enabled, mode, windChimeLevel] )
}
