import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ClipboardEvent, CSSProperties, PointerEvent as ReactPointerEvent } from 'react'
import { useAppContext } from '../../context/useAppContext'
import './NotebookOverlay.css'

type WorkspaceMode = 'notebook' | 'whiteboard'
type WhiteboardTool = 'pen' | 'line' | 'rect' | 'text'

export function NotebookOverlay() {
  const { notebookOpen, setNotebookOpen, notebookText, setNotebookText } = useAppContext()
  const ref = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef<{ x: number; y: number; snapshot?: ImageData } | null>(null)
  const dragRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)
  const [mode, setMode] = useState<WorkspaceMode>('notebook')
  const [tool, setTool] = useState<WhiteboardTool>('pen')
  const [strokeColor, setStrokeColor] = useState('#0f172a')
  const [strokeSize, setStrokeSize] = useState(4)
  const [whiteboardText, setWhiteboardText] = useState('Subnet note')

  useEffect(() => {
    if (!notebookOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotebookOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [notebookOpen, setNotebookOpen])

  useEffect(() => {
    if (!notebookOpen || mode !== 'whiteboard') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const empty = ctx.getImageData(0, 0, 1, 1).data.every((value) => value === 0)
    if (!empty) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [mode, notebookOpen])

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

  const style: CSSProperties = pos
    ? { left: pos.left, top: pos.top, right: 'auto', bottom: 'auto' }
    : {}

  const canvasPoint = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    }
  }

  const drawShapePreview = (x: number, y: number) => {
    const canvas = canvasRef.current
    const start = drawingRef.current
    if (!canvas || !start?.snapshot) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.putImageData(start.snapshot, 0, 0)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (tool === 'line') {
      ctx.beginPath()
      ctx.moveTo(start.x, start.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    if (tool === 'rect') {
      ctx.strokeRect(start.x, start.y, x - start.x, y - start.y)
    }
  }

  const onCanvasPointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = canvasPoint(e)
    if (tool === 'text') {
      ctx.fillStyle = strokeColor
      ctx.font = `${Math.max(14, strokeSize * 5)}px Inter, system-ui, sans-serif`
      ctx.fillText(whiteboardText || 'Text', x, y)
      return
    }
    canvas.setPointerCapture(e.pointerId)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = strokeSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    drawingRef.current = {
      x,
      y,
      snapshot: tool === 'pen' ? undefined : ctx.getImageData(0, 0, canvas.width, canvas.height),
    }
    if (tool === 'pen') {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const onCanvasPointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const start = drawingRef.current
    if (!canvas || !start) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { x, y } = canvasPoint(e)
    if (tool === 'pen') {
      ctx.lineTo(x, y)
      ctx.stroke()
      return
    }
    drawShapePreview(x, y)
  }

  const onCanvasPointerUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas?.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    drawingRef.current = null
  }

  const clearWhiteboard = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        const maxWidth = canvas.width * 0.42
        const scale = Math.min(1, maxWidth / img.width)
        ctx.drawImage(img, 36, 36, img.width * scale, img.height * scale)
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const onPasteWhiteboard = (event: ClipboardEvent<HTMLDivElement>) => {
    const imageItem = Array.from(event.clipboardData.items).find((item) => item.type.startsWith('image/'))
    const file = imageItem?.getAsFile()
    if (!file) return
    event.preventDefault()
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (!canvas || !ctx) return
        const scale = Math.min(1, (canvas.width * 0.5) / img.width)
        ctx.drawImage(img, 44, 44, img.width * scale, img.height * scale)
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      ref={ref}
      className={'notebook-overlay' + (mode === 'whiteboard' ? ' notebook-overlay--whiteboard' : '')}
      style={style}
      role="dialog"
      aria-label={mode === 'whiteboard' ? 'Whiteboard' : 'Notebook'}
      onPaste={onPasteWhiteboard}
    >
      <div className="notebook-overlay-header" onMouseDown={onHeaderMouseDown}>
        <div className="notebook-overlay-title">
          <NotebookIcon />
          <div className="notebook-overlay-tabs" role="tablist" aria-label="Workspace mode" onMouseDown={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={'notebook-overlay-tab' + (mode === 'notebook' ? ' notebook-overlay-tab--active' : '')}
              onClick={() => setMode('notebook')}
            >
              Notebook
            </button>
            <button
              type="button"
              className={'notebook-overlay-tab' + (mode === 'whiteboard' ? ' notebook-overlay-tab--active' : '')}
              onClick={() => setMode('whiteboard')}
            >
              Whiteboard
            </button>
          </div>
        </div>
        <div className="notebook-overlay-actions" onMouseDown={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="notebook-overlay-btn"
            onClick={() => setNotebookText('')}
            title="Clear notebook"
            disabled={mode === 'whiteboard'}
          >
            Clear
          </button>
          <button
            type="button"
            className="notebook-overlay-btn"
            onClick={() => navigator.clipboard?.writeText(notebookText)}
            title="Copy contents"
            disabled={mode === 'whiteboard'}
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
      {mode === 'notebook' ? (
        <textarea
          className="notebook-overlay-textarea"
          value={notebookText}
          onChange={(e) => setNotebookText(e.target.value)}
          placeholder="Jot notes, sketch out subnetting steps, capture quick reminders..."
          spellCheck={false}
        />
      ) : (
        <div className="whiteboard-workspace" tabIndex={0}>
          <div className="whiteboard-toolbar">
            {(['pen', 'line', 'rect', 'text'] as WhiteboardTool[]).map((item) => (
              <button
                key={item}
                type="button"
                className={'notebook-overlay-btn' + (tool === item ? ' notebook-overlay-btn--active' : '')}
                onClick={() => setTool(item)}
              >
                {item}
              </button>
            ))}
            <input
              type="color"
              className="whiteboard-color"
              value={strokeColor}
              onChange={(event) => setStrokeColor(event.target.value)}
              aria-label="Whiteboard color"
            />
            <input
              type="range"
              min="2"
              max="18"
              value={strokeSize}
              onChange={(event) => setStrokeSize(Number(event.target.value))}
              aria-label="Stroke size"
            />
            {tool === 'text' && (
              <input
                type="text"
                className="whiteboard-text-input"
                value={whiteboardText}
                onChange={(event) => setWhiteboardText(event.target.value)}
                placeholder="Text"
              />
            )}
            <label className="notebook-overlay-btn whiteboard-upload">
              Image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button type="button" className="notebook-overlay-btn" onClick={clearWhiteboard}>
              Clear board
            </button>
          </div>
          <canvas
            ref={canvasRef}
            className="whiteboard-canvas"
            width={1400}
            height={900}
            onPointerDown={onCanvasPointerDown}
            onPointerMove={onCanvasPointerMove}
            onPointerUp={onCanvasPointerUp}
            onPointerCancel={onCanvasPointerUp}
          />
        </div>
      )}
      <div className="notebook-overlay-footer">
        <span>{mode === 'notebook' ? `${notebookText.length} chars` : 'Paste images directly onto the board'}</span>
        <span className="notebook-overlay-hint">Drag header · resize corner · Esc to close</span>
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
