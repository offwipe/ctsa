import { useState, useRef, useEffect } from 'react'
import './Dropdown.css'

export type DropdownOption = { value: string; label: string }

type DropdownProps = {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  label?: string
  disabled?: boolean
}

export function Dropdown({ value, options, onChange, label, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value)?.label ?? value

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onOutside)
      return () => document.removeEventListener('mousedown', onOutside)
    }
  }, [open])

  return (
    <div className="dropdown-row" ref={ref}>
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-wrap">
        <button
          type="button"
          className="dropdown-trigger"
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="dropdown-value">{selected}</span>
          <span className="dropdown-chevron" aria-hidden>▼</span>
        </button>
        {open && (
          <ul
            role="listbox"
            className="dropdown-menu"
            aria-activedescendant={value}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                id={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={'dropdown-option' + (opt.value === value ? ' dropdown-option--selected' : '')}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
