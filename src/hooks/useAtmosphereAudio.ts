import { useEffect } from 'react'
import { ATMOSPHERE_SAMPLE_URLS, getAtmosphereEngine } from '../audio/atmosphereAudio'
import type { AtmosphereMode } from '../context/appTheme'

const SAMPLE_AUDIO_MODES = Object.keys(ATMOSPHERE_SAMPLE_URLS) as AtmosphereMode[]

const AUDIO_MODES: AtmosphereMode[] = [
  'rain',
  'wind',
  'stormy-focus',
  'lofi-chill',
  'zen-calm',
  ...SAMPLE_AUDIO_MODES,
]

type UseAtmosphereAudioOptions = {
  enabled: boolean
  mode: AtmosphereMode
  volume: number
  windChimeLevel: number
}

/**
 * Drives atmosphere beds (rain / wind / storm composite / Lo-Fi / Zen) + wind chime under pure wind.
 */
export function useAtmosphereAudio({
  enabled,
  mode,
  volume,
  windChimeLevel,
}: UseAtmosphereAudioOptions) {
  useEffect(() => {
    const engine = getAtmosphereEngine()
    engine.setEnabled(enabled)
    engine.setVolume(volume / 100)
  }, [enabled, volume])

  useEffect(() => {
    const engine = getAtmosphereEngine()
    let cancelled = false

    const applyChime = () => {
      if (!enabled || mode !== 'wind') {
        engine.setWindChimeLevel(0)
        return
      }
      engine.setWindChimeLevel(windChimeLevel / 100)
    }

    const run = async () => {
      try {
        await engine.setMode(enabled ? mode : 'off')
      } catch {
        // ignore
      }
      if (!cancelled) applyChime()
    }

    const onFirst = () => {
      void run()
      window.removeEventListener('pointerdown', onFirst)
      window.removeEventListener('keydown', onFirst)
    }

    const modeWantsBed = enabled && AUDIO_MODES.includes(mode)
    if (modeWantsBed) {
      void run()
      window.addEventListener('pointerdown', onFirst, { once: true })
      window.addEventListener('keydown', onFirst, { once: true })
    } else {
      void run()
    }

    return () => {
      cancelled = true
      window.removeEventListener('pointerdown', onFirst)
      window.removeEventListener('keydown', onFirst)
    }
  }, [enabled, mode, windChimeLevel])
}
