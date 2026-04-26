import './ResetButton.css'

type ResetButtonProps = {
  label: string
  onClick: () => void
  disabled?: boolean
}

export function ResetButton({ label, onClick, disabled }: ResetButtonProps) {
  return (
    <button
      type="button"
      className="reset-button"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
