import './ZenCalmFrame.css'

type ZenCalmFrameProps = {
  enabled: boolean
}

/** Ultra-light “breeze + breath” field: two slow gradient sheens, no heavy animation. */
export function ZenCalmFrame({ enabled }: ZenCalmFrameProps) {
  if (!enabled) return null

  return (
    <div className="zen-frame" aria-hidden>
      <div className="zen-frame__breathe" />
      <div className="zen-frame__mist" />
    </div>
  )
}
