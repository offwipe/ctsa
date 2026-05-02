import { useAppContext } from '../../context/useAppContext'
import type { CSSProperties } from 'react'
import './Titlebar.css'

export function Titlebar() {
  const { settings, notebookOpen, toggleNotebook, chartOpen, toggleChart } = useAppContext()
  const titlebarStyle = settings.titlebarStyle === 'auto' ? settings.layoutPreset : settings.titlebarStyle
  const titlebarVars = {
    '--titlebar-opacity': `${settings.titlebarOpacity / 100}`,
  } as CSSProperties

  const minimize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().minimize()
    } catch { /* browser fallback: noop */ }
  }
  const toggleMaximize = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      const win = getCurrentWindow()
      if (await win.isMaximized()) await win.unmaximize()
      else await win.maximize()
    } catch { /* noop */ }
  }
  const close = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().close()
    } catch { /* noop */ }
  }

  return (
    <div
      className={'titlebar' + (settings.titlebarCompact ? ' titlebar--compact' : '')}
      data-titlebar-style={titlebarStyle}
      data-titlebar-blend={settings.titlebarBlendWithPreset ? 'true' : 'false'}
      data-tauri-drag-region
      style={titlebarVars}
    >
      {settings.titlebarShowTitle && <span className="titlebar-title" data-tauri-drag-region>ctsa</span>}
      <div className="titlebar-controls">
        <button
          className={'titlebar-btn titlebar-btn--tool' + (chartOpen ? ' titlebar-btn--active' : '')}
          onClick={toggleChart}
          aria-label="Toggle 7-Second Subnetting chart"
          aria-pressed={chartOpen}
          title="7-Second Subnetting chart"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
            <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
            <line x1="9.5" y1="3.5" x2="9.5" y2="20.5" />
            <line x1="15.5" y1="3.5" x2="15.5" y2="20.5" />
          </svg>
        </button>
        <button
          className={'titlebar-btn titlebar-btn--tool' + (notebookOpen ? ' titlebar-btn--active' : '')}
          onClick={toggleNotebook}
          aria-label="Toggle notebook"
          aria-pressed={notebookOpen}
          title="Notebook"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 4h11a3 3 0 0 1 3 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4z" />
            <line x1="5" y1="9" x2="19" y2="9" />
            <line x1="9" y1="2.5" x2="9" y2="21.5" />
          </svg>
        </button>
        <span className="titlebar-divider" aria-hidden />
        <button className="titlebar-btn titlebar-btn--minimize" onClick={minimize} aria-label="Minimize">
          <svg width="10" height="1" viewBox="0 0 10 1"><rect width="10" height="1" fill="currentColor" /></svg>
        </button>
        <button className="titlebar-btn titlebar-btn--maximize" onClick={toggleMaximize} aria-label="Maximize">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5" /></svg>
        </button>
        <button className="titlebar-btn titlebar-btn--close" onClick={close} aria-label="Close">
          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" /></svg>
        </button>
      </div>
    </div>
  )
}
