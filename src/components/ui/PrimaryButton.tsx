import './PrimaryButton.css'

type PrimaryButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  icon?: React.ReactNode
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled,
  icon,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className="primary-button"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="primary-button-icon" aria-hidden>{icon}</span>}
      {children}
    </button>
  )
}
