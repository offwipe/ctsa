import './PreviewBox.css'

type PreviewBoxProps = {
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function PreviewBox({ children, className = '', style }: PreviewBoxProps) {
  return (
    <div className={'preview-box ' + className} style={style}>
      {children}
    </div>
  )
}
