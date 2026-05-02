import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV } from '../mainNav'
import './DeepFocusLayout.css'

function formatClock(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

export function DeepFocusLayout({ locationKey }: { locationKey: string }) {
  const [elapsed, setElapsed] = useState(0)
  const { settings } = useAppContext()
  const trayRight = settings.sidebarPosition === 'right'

  useEffect(() => {
    const id = window.setInterval(() => setElapsed((t) => t + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className={'df-shell' + (trayRight ? ' df-shell--tray-right' : '')}>
      <div className="df-tray" tabIndex={-1}>
        <nav className="df-tray__panel" aria-label="Minimal navigation">
          <h2 className="df-tray__title">Menu</h2>
          {MAIN_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="df-shell__timer" role="timer" aria-live="polite" aria-atomic="true">
        Session · {formatClock(elapsed)}
      </div>

      <main className="df-shell__main">
        <div key={locationKey} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
