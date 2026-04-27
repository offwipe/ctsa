import { useState } from 'react'
import './CardFlip.css'

type CardFlipProps = {
  front: React.ReactNode
  back: React.ReactNode
  flipped?: boolean
  onFlip?: (flipped: boolean) => void
  className?: string
}

/** Cloze / flashcard flip layout. UI only; no content. */
export function CardFlip({ front, back, flipped: controlled, onFlip, className = '' }: CardFlipProps) {
  const [internal, setInternal] = useState(false)
  const flipped = controlled ?? internal
  const setFlipped = (v: boolean) => {
    if (onFlip) onFlip(v)
    else setInternal(v)
  }

  return (
    <div
      className={'card-flip' + (flipped ? ' card-flip--flipped' : '') + (className ? ' ' + className : '')}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped(!flipped)
        }
      }}
      aria-label={flipped ? 'Show question' : 'Show answer'}
    >
      <div className="card-flip-inner">
        <div className="card-flip-front">{front}</div>
        <div className="card-flip-back">{back}</div>
      </div>
    </div>
  )
}
