import { rgba } from '../../context/appTheme'
import type { AmbientBorderStyle } from '../../context/appTheme'
import './AmbientFrame.css'

type AmbientFrameProps = {
  enabled: boolean
  thickness: number
  strength: number
  frameColor: string
  multiColor: boolean
  multiColorCount: number
  multiColors: [string, string, string, string]
  pulsating: boolean
  accentColor: string
  style: AmbientBorderStyle
  speed: number
}

export function AmbientFrame({
  enabled,
  thickness,
  strength,
  frameColor,
  multiColor,
  multiColorCount,
  multiColors,
  pulsating,
  accentColor,
  style,
  speed,
}: AmbientFrameProps) {
  if (!enabled) return null

  const reach = Math.max(2, Math.min(12, thickness))
  const innerSpread = 6 + reach * 4
  const innerBlur = 18 + reach * 6
  const outerBlur = 14 + reach * 5

  const intensity = Math.max(0, Math.min(1, strength / 100))
  const innerOpacity = 0.18 + intensity * 0.42
  const outerOpacity = 0.06 + intensity * 0.18

  const colors = multiColor
    ? multiColors.slice(0, Math.max(1, Math.min(4, multiColorCount)))
    : [frameColor]

  const primary = colors[0]
  const tinted = rgba(primary, innerOpacity)
  const tintedSoft = rgba(primary, innerOpacity * 0.7)
  const outerTint = rgba(multiColor ? accentColor : frameColor, outerOpacity)

  const haloStops = (() => {
    if (colors.length === 1) {
      return `${rgba(colors[0], innerOpacity)} 0%, ${rgba(colors[0], innerOpacity * 0.6)} 50%, ${rgba(colors[0], innerOpacity)} 100%`
    }
    return colors
      .map((c, i) => `${rgba(c, innerOpacity * 0.92)} ${(i / (colors.length - 1)) * 100}%`)
      .join(', ')
  })()

  const speedFactor = Math.max(15, 100 - speed)
  const driftDuration = (8 + speedFactor / 2.5).toFixed(2)
  const breatheDuration = (4 + speedFactor / 6).toFixed(2)
  const pulseDuration = (3 + speedFactor / 8).toFixed(2)

  const animationClass =
    style === 'drift'
      ? ' ambient-frame--drift'
      : style === 'breathe'
        ? ' ambient-frame--breathe'
        : style === 'pulse'
          ? ' ambient-frame--pulse'
          : ''

  const pulseHaloOpacity = pulsating ? '1' : '0.92'

  const inlineStyle: React.CSSProperties = {
    ['--af-inner-spread' as string]: `${innerSpread}px`,
    ['--af-inner-blur' as string]: `${innerBlur}px`,
    ['--af-outer-blur' as string]: `${outerBlur}px`,
    ['--af-tint' as string]: tinted,
    ['--af-tint-soft' as string]: tintedSoft,
    ['--af-outer-tint' as string]: outerTint,
    ['--af-halo' as string]: `linear-gradient(135deg, ${haloStops})`,
    ['--af-drift-duration' as string]: `${driftDuration}s`,
    ['--af-breathe-duration' as string]: `${breatheDuration}s`,
    ['--af-pulse-duration' as string]: `${pulseDuration}s`,
    ['--af-halo-opacity' as string]: pulseHaloOpacity,
    ['--af-radius' as string]: 'inherit',
  }

  return (
    <div aria-hidden className={`ambient-frame${animationClass}`} style={inlineStyle}>
      <div className="ambient-frame-inner" />
      {(style === 'drift' || multiColor) && <div className="ambient-frame-halo" />}
    </div>
  )
}
