import { useMemo, useDeferredValue, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Titlebar } from './Titlebar'
import { rgba, lightenHex } from '../../context/appTheme'
import { useAppContext } from '../../context/useAppContext'
import { AmbientFrame } from '../effects/AmbientFrame'
import { WinterFrame } from '../effects/WinterFrame'
import { RainFrame } from '../effects/RainFrame'
import { WindFrame } from '../effects/WindFrame'
import { LofiChillFrame } from '../effects/LofiChillFrame'
import { ZenCalmFrame } from '../effects/ZenCalmFrame'
import { useAtmosphereAudio } from '../../hooks/useAtmosphereAudio'
import { NotebookOverlay } from '../overlays/NotebookOverlay'
import { SevenSecondOverlay } from '../overlays/SevenSecondOverlay'
import { LayoutPresetRouter } from './LayoutPresetRouter'
import '../../styles/layoutPresetVars.css'
import './AppLayout.css'

export function AppLayout() {
  const location = useLocation()
  const { settings } = useAppContext()
  const s = useDeferredValue(settings)
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    let mounted = true
    let unlistenScale: (() => void) | undefined
    let unlistenResize: (() => void) | undefined
    ;(async () => {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window')
        const win = getCurrentWindow()
        const sync = async () => {
          const max = await win.isMaximized()
          const full = await win.isFullscreen()
          if (mounted) setMaximized(max || full)
        }
        await sync()
        unlistenResize = await win.onResized(sync)
        unlistenScale = await win.onScaleChanged(sync)
      } catch {
        // browser fallback
      }
    })()
    return () => {
      mounted = false
      if (unlistenResize) unlistenResize()
      if (unlistenScale) unlistenScale()
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-maximized', maximized ? 'true' : 'false')
  }, [maximized])

  useEffect(() => {
    document.documentElement.setAttribute('data-layout-preset', s.layoutPreset)
  }, [s.layoutPreset])

  const shellStyle = useMemo(() => {
    const isDark = s.mode === 'dark'
    const accentAlpha = 0.24 + s.accentIntensity / 180
    const glowAlpha = accentAlpha + s.glowIntensity / 220
    const glowStrongAlpha = accentAlpha + 0.08 + s.glowIntensity / 180

    const borderSoft = isDark
      ? rgba('#ffffff', s.borderOpacity / 280)
      : rgba('#9aa6bd', s.borderOpacity / 220)
    const borderStrong = isDark
      ? rgba('#ffffff', s.borderOpacity / 170)
      : rgba('#8794ad', s.borderOpacity / 150)
    const shellShadow = isDark
      ? `0 30px ${56 + s.shadowSoftness}px rgba(0,0,0,0.44)`
      : `0 26px ${48 + s.shadowSoftness}px rgba(78,86,110,0.18)`

    const btnGlowAlpha = 0.12 + s.buttonGlow / 200
    const spreadPct = 18 + s.ambienceSpread * 0.32
    const softBase = s.ambienceSoftness / 100

    return {
      '--shell-radius': `${14 + s.cornerRoundness}px`,
      '--accent-color': s.accentColor,
      '--accent-glow-computed': rgba(s.accentColor, glowAlpha),
      '--accent-glow-strong': rgba(s.accentColor, glowStrongAlpha),
      '--accent-border': rgba(s.accentColor, accentAlpha),
      '--glow-spread': `${Math.round(s.glowIntensity * 0.3)}px`,
      '--glow-blur': `${Math.round(8 + s.glowIntensity * 0.4)}px`,
      '--glow-color': rgba(s.accentColor, 0.1 + s.glowIntensity / 200),
      '--border-soft': borderSoft,
      '--border-strong': borderStrong,
      '--shell-shadow': shellShadow,
      '--noise-opacity': `${s.noiseStrength / 100}`,
      '--ambient-strength': `${s.backgroundAmbience / 100}`,
      '--hover-lift': `${s.hoverLift / 100}`,
      '--animation-speed': `${Math.max(80, 300 - s.animationIntensity * 2)}ms`,
      '--btn-solid': s.buttonColor,
      '--btn-solid-hover': lightenHex(s.buttonColor, 0.2),
      '--btn-glow': rgba(s.buttonColor, btnGlowAlpha),
      '--btn-glow-blur': `${Math.round(8 + s.buttonGlow * 0.4)}px`,
      '--btn-gradient': `linear-gradient(135deg, ${s.buttonColor} 0%, ${lightenHex(s.buttonColor, 0.22)} 100%)`,
      '--btn-subtle': rgba(s.buttonColor, 0.12),
      '--ambience-color-1': s.ambienceColor1,
      '--ambience-color-2': s.ambienceColor2,
      '--ambience-color-3': s.ambienceColor3,
      '--ambience-intensity': `${s.ambienceIntensity / 100}`,
      '--ambience-spread': `${Math.round(spreadPct)}%`,
      '--ambience-softness': `${(0.6 + softBase * 0.4).toFixed(2)}`,
      transitionDuration: s.liveModeTransitions ? '220ms' : '0ms',
    } as React.CSSProperties
  }, [s])

  useAtmosphereAudio({
    enabled: s.atmosphereAudioEnabled,
    mode: s.atmosphereMode,
    volume: s.atmosphereVolume,
    windChimeLevel: s.windChimeLevel,
  })

  const mode = s.atmosphereMode
  const showSnow = mode === 'snow' || s.winterFrameEnabled
  const rainActive = mode === 'rain' || mode === 'stormy-focus'
  const windActive = mode === 'wind' || mode === 'stormy-focus'
  const stormy = mode === 'stormy-focus'

  return (
    <div className="app-window-frame" style={shellStyle}>
      <div className="app-shell" data-layout-preset={s.layoutPreset}>
        <div className="app-noise" />
        <div className="app-ambient" />
        <AmbientFrame
          enabled={s.ambientFrameEnabled}
          thickness={s.ambientBorderThickness}
          strength={s.ambientBorderStrength}
          frameColor={s.ambientFrameColor}
          multiColor={s.ambientMultiColor}
          multiColorCount={s.ambientMultiColorCount}
          multiColors={s.ambientMultiColors}
          pulsating={s.ambientPulsating}
          accentColor={s.accentColor}
          style={s.ambientBorderStyle}
          speed={s.ambientBorderSpeed}
        />
        <Titlebar />
        <div className="layout-preset-mount">
          <LayoutPresetRouter preset={s.layoutPreset} locationKey={location.pathname} />
        </div>

        <div className="atm-stack" data-atmosphere={mode} aria-hidden>
          <div className={'atm-layer atm-layer--snow' + (showSnow ? ' atm-layer--on' : '')}>
            <WinterFrame
              enabled={showSnow}
              intensity={s.winterIntensity}
              fallSpeed={s.winterFallSpeed}
              snowflakeSize={s.winterSnowflakeSize}
              borderZone={s.winterBorderZone}
              glowEffect={s.winterGlowEffect}
              windDrift={s.winterWindDrift}
              snowColor={s.winterSnowColor}
            />
          </div>
          <div className={'atm-layer atm-layer--rain' + (rainActive ? ' atm-layer--on' : '')}>
            <RainFrame
              enabled={rainActive}
              intensity={stormy ? Math.round(s.rainIntensity * 0.88) : s.rainIntensity}
              fallSpeed={s.rainFallSpeed}
              dropSize={s.rainDropSize}
              angle={s.rainAngle}
              windMph={stormy ? Math.min(45, s.rainWindMph + 4) : s.rainWindMph}
              turbulence={stormy ? Math.min(100, s.rainTurbulence + 12) : s.rainTurbulence}
              rainColor={s.rainColor}
              glow={s.rainGlow}
            />
          </div>
          <div className={'atm-layer atm-layer--wind' + (windActive ? ' atm-layer--on' : '')}>
            <WindFrame
              enabled={windActive}
              cloudDensity={stormy ? Math.round(s.windCloudDensity * 1.08) : s.windCloudDensity}
              driftSpeed={stormy ? Math.round(s.windDriftSpeed * 1.12) : s.windDriftSpeed}
              cloudOpacity={stormy ? Math.min(100, s.windCloudOpacity + 14) : s.windCloudOpacity}
            />
          </div>
          <div className={'atm-layer atm-layer--lofi' + (mode === 'lofi-chill' ? ' atm-layer--on' : '')}>
            <LofiChillFrame enabled={mode === 'lofi-chill'} />
          </div>
          <div className={'atm-layer atm-layer--zen' + (mode === 'zen-calm' ? ' atm-layer--on' : '')}>
            <ZenCalmFrame enabled={mode === 'zen-calm'} />
          </div>
        </div>

        <NotebookOverlay />
        <SevenSecondOverlay />
      </div>
    </div>
  )
}
