import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../context/useAppContext'
import './NotebookOverlay.css'

export function NotebookOverlay() {
  const { notebookOpen, setNotebookOpen, notebookText, setNotebookText } = useAppContext()
  const ref = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    if (!notebookOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotebookOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [notebookOpen, setNotebookOpen])

  if (!notebookOpen) return null

  const onHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: rect.left,
      top: rect.top,
    }
    const onMove = (ev: MouseEvent) => {
      if (!dragRef.current) return
      const dx = ev.clientX - dragRef.current.x
      const dy = ev.clientY - dragRef.current.y
      const next = {
        left: Math.max(8, dragRef.current.left + dx),
        top: Math.max(8, dragRef.current.top + dy),
      }
      setPos(next)
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const style: React.CSSProperties = pos
    ? { left: pos.left, top: pos.top, right: 'auto', bottom: 'auto' }
    : {}

  return (
    <div
      ref={ref}
      className="notebook-overlay"
      style={style}
      role="dialog"
      aria-label="Notebook"
    >
      <div className="notebook-overlay-header" onMouseDown={onHeaderMouseDown}>
        <div className="notebook-overlay-title">
          <NotebookIcon /> Notebook
        </div>
        <div className="notebook-overlay-actions">
          <button
            type="button"
            className="notebook-overlay-btn"
            onClick={() => setNotebookText('')}
            title="Clear notebook"
          >
            Clear
          </button>
          <button
            type="button"
            className="notebook-overlay-btn"
            onClick={() => navigator.clipboard?.writeText(notebookText)}
            title="Copy contents"
          >
            Copy
          </button>
          <button
            type="button"
            className="notebook-overlay-btn notebook-overlay-btn--close"
            onClick={() => setNotebookOpen(false)}
            aria-label="Close notebook"
            title="Close (Esc)"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        </div>
      </div>
      <textarea
        className="notebook-overlay-textarea"
        value={notebookText}
        onChange={(e) => setNotebookText(e.target.value)}
        placeholder="Jot notes, sketch out subnetting steps, capture quick reminders..."
        spellCheck={false}
      />
      <div className="notebook-overlay-footer">
        <span>{notebookText.length} chars</span>
        <span className="notebook-overlay-hint">Drag header to reposition · Esc to close</span>
      </div>
    </div>
  )
}

function NotebookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a4 4 0 0 1 4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z" />
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="8" y1="2" x2="8" y2="22" />
    </svg>
  )
}
