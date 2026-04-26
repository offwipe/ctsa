import { useEffect } from 'react'
import { getAtmosphereEngine } from '../audio/atmosphereAudio'
import type { AtmosphereMode } from '../context/appTheme'

type UseAtmosphereAudioOptions = {
  enabled: boolean
  mode: AtmosphereMode
  volume: number
}

export function useAtmosphereAudio({ enabled, mode, volume }: UseAtmosphereAudioOptions) {
  useEffect(() => {
    const engine = getAtmosphereEngine()
    engine.setEnabled(enabled)
    engine.setVolume(volume / 100)
  }, [enabled, volume])

  useEffect(() => {
    const engine = getAtmosphereEngine()
    let cancelled = false

    const start = async () => {
      const target: AtmosphereMode = enabled ? mode : 'off'
      try {
        await engine.setMode(target)
      } catch {
        // ignore
      }
      if (cancelled) return
    }

    const onFirstInteraction = () => {
      void start()
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }

    if (mode === 'rain' || mode === 'wind') {
      void start()
      window.addEventListener('pointerdown', onFirstInteraction, { once: true })
      window.addEventListener('keydown', onFirstInteraction, { once: true })
    } else {
      void engine.setMode('off')
    }

    return () => {
      cancelled = true
      window.removeEventListener('pointerdown', onFirstInteraction)
      window.removeEventListener('keydown', onFirstInteraction)
    }
  }, [enabled, mode])
}
