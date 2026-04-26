import './Slider.css'

type SliderProps = {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  label?: string
  valueLabel?: string
  disabled?: boolean
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  valueLabel,
  disabled,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="slider-row">
      {label && <label className="slider-label">{label}</label>}
      <div className="slider-wrap">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="slider-input"
          style={{ '--slider-pct': `${pct}%` } as React.CSSProperties}
        />
        {valueLabel != null && (
          <span className="slider-value">{valueLabel}</span>
        )}
      </div>
    </div>
  )
}
