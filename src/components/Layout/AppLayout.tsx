import { useMemo, useDeferredValue, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Titlebar } from './Titlebar'
import { rgba, lightenHex } from '../../context/appTheme'
import { useAppContext } from '../../context/useAppContext'
import { AmbientFrame } from '../effects/AmbientFrame'
import { WinterFrame } from '../effects/WinterFrame'
import { RainFrame } from '../effects/RainFrame'
import { WindFrame } from '../effects/WindFrame'
import { useAtmosphereAudio } from '../../hooks/useAtmosphereAudio'
import { NotebookOverlay } from '../overlays/NotebookOverlay'
import { SevenSecondOverlay } from '../overlays/SevenSecondOverlay'
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
        // browser fallback: nothing to track
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
  })

  const sidebarRight = s.sidebarPosition === 'right'
  const showSnow = s.atmosphereMode === 'snow' || s.winterFrameEnabled
  const showRain = s.atmosphereMode === 'rain'
  const showWind = s.atmosphereMode === 'wind'

  return (
    <div className="app-window-frame" style={shellStyle}>
      <div className="app-shell">
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
        <div className={'app-layout' + (sidebarRight ? ' app-layout--sidebar-right' : '')}>
          <Sidebar />
          <main className="app-main">
            <div key={location.pathname} className="app-main-inner page-transition">
              <Outlet />
            </div>
          </main>
        </div>
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
        <RainFrame
          enabled={showRain}
          intensity={s.rainIntensity}
          fallSpeed={s.rainFallSpeed}
          dropSize={s.rainDropSize}
          angle={s.rainAngle}
          rainColor={s.rainColor}
          glow={s.rainGlow}
        />
        <WindFrame
          enabled={showWind}
          cloudDensity={s.windCloudDensity}
          driftSpeed={s.windDriftSpeed}
          cloudOpacity={s.windCloudOpacity}
        />
        <NotebookOverlay />
        <SevenSecondOverlay />
      </div>
    </div>
  )
}
