import type { CSSProperties } from 'react'
import './LofiChillFrame.css'

type LofiChillFrameProps = {
  enabled: boolean
}

/** Warm desk-lamp ambience: soft amber glow + slow drifting particles (GPU-light). */
export function LofiChillFrame({ enabled }: LofiChillFrameProps) {
  if (!enabled) return null

  return (
    <div className="lofi-frame" aria-hidden>
      <div className="lofi-frame__wash" />
      <div className="lofi-frame__glow lofi-frame__glow--a" />
      <div className="lofi-frame__glow lofi-frame__glow--b" />
      <div className="lofi-frame__particles">
        {Array.from({ length: 28 }).map((_, i) => (
          <span key={i} className="lofi-frame__dot" style={{ '--lofi-i': i } as CSSProperties} />
        ))}
      </div>
    </div>
  )
}
