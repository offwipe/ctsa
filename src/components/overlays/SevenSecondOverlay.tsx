import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../context/useAppContext'
import { sevenSecondRows } from '../../utils/subnetting'
import './SevenSecondOverlay.css'

export function SevenSecondOverlay() {
  const { chartOpen, setChartOpen } = useAppContext()
  const ref = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    if (!chartOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setChartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chartOpen, setChartOpen])

  if (!chartOpen) return null

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
      setPos({
        left: Math.max(8, dragRef.current.left + dx),
        top: Math.max(8, dragRef.current.top + dy),
      })
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
      className="seven-overlay"
      style={style}
      role="dialog"
      aria-label="7-Second Subnetting Chart"
    >
      <div className="seven-overlay-header" onMouseDown={onHeaderMouseDown}>
        <div className="seven-overlay-title">
          <ChartIcon /> 7-Second Subnetting
        </div>
        <button
          type="button"
          className="seven-overlay-close"
          onClick={() => setChartOpen(false)}
          aria-label="Close chart"
          title="Close (Esc)"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="2" x2="10" y2="10" />
            <line x1="10" y1="2" x2="2" y2="10" />
          </svg>
        </button>
      </div>

      <div className="seven-overlay-table">
        <div className="seven-overlay-row seven-overlay-row--head seven-overlay-row--super">
          <span className="seven-overlay-cell seven-overlay-cell--span4">Masks</span>
          <span className="seven-overlay-cell">Networks</span>
          <span className="seven-overlay-cell">Addresses</span>
        </div>
        {sevenSecondRows.map((row) => (
          <div key={row.mask} className="seven-overlay-row">
            <span className="seven-overlay-cell seven-overlay-cell--mask">{row.mask}</span>
            <span className="seven-overlay-cell seven-overlay-cell--mask">{row.networkMask}</span>
            <span className="seven-overlay-cell seven-overlay-cell--mask">{row.addressMask}</span>
            <span className="seven-overlay-cell seven-overlay-cell--mask">{row.hostMask}</span>
            <span className="seven-overlay-cell seven-overlay-cell--octet">{row.octet}</span>
            <span className="seven-overlay-cell">{row.networks}</span>
            <span className="seven-overlay-cell">{row.addresses}</span>
          </div>
        ))}
      </div>

      <div className="seven-overlay-footer">
        <span className="seven-overlay-hint">Drag header to reposition · Esc to close</span>
      </div>
    </div>
  )
}

function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  )
}
