import './ColorPicker.css'

type ColorPickerProps = {
  value: string
  onChange: (hex: string) => void
  label?: string
  disabled?: boolean
}

export function ColorPicker({ value, onChange, label, disabled }: ColorPickerProps) {
  const normalized = value.startsWith('#') ? value : '#' + value
  return (
    <div className="color-picker-row">
      {label && <label className="color-picker-label">{label}</label>}
      <div className="color-picker-wrap">
        <input
          type="color"
          value={normalized}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="color-picker-swatch"
          aria-label={label}
        />
        <input
          type="text"
          value={normalized.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value.trim()
            if (/^#?[0-9A-Fa-f]{6}$/.test(v)) onChange(v.startsWith('#') ? v : '#' + v)
          }}
          className="color-picker-hex"
          disabled={disabled}
          aria-label={`${label ?? 'Color'} hex`}
        />
      </div>
    </div>
  )
}
