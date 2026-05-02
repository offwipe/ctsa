import { NavLink, Outlet } from 'react-router-dom'
import { MAIN_NAV } from '../mainNav'
import { useAppContext } from '../../../context/useAppContext'
import './CommandCenterLayout.css'

export function CommandCenterLayout({ locationKey }: { locationKey: string }) {
  const { settings } = useAppContext()
  const railRight = settings.sidebarPosition === 'right'

  return (
    <div className={'command-shell' + (railRight ? ' command-shell--rail-right' : '')}>
      <header className="command-shell__ribbon">
        <span>Command Center</span>
        <span>Study shell · dashboard density</span>
      </header>

      <nav className="command-shell__rail" aria-label="Jump navigation">
        <div className="command-shell__rail-label">Routes</div>
        {MAIN_NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <section className="command-shell__stage">
        <div key={locationKey} className="command-shell__stage-inner page-transition">
          <Outlet />
        </div>
      </section>

      <aside className="command-shell__meta" aria-label="Environment status">
        <div className="command-meta__block">
          <h3>Atmosphere</h3>
          <div className="command-meta__kv">
            Mode: <strong style={{ fontWeight: 600 }}>{settings.atmosphereMode}</strong>
            <br />
            Audio: {settings.atmosphereAudioEnabled ? `${settings.atmosphereVolume}%` : 'muted'}
          </div>
        </div>
        <div className="command-meta__widgets">
          <div className="command-meta__tile">
            <strong>Sidebar</strong>
            {settings.sidebarPosition}
          </div>
          <div className="command-meta__tile">
            <strong>Theme</strong>
            {settings.mode}
          </div>
        </div>
        <div className="command-meta__block">
          <h3>Widgets</h3>
          <NavLink to="/settings">Open settings</NavLink>
          <br />
          <NavLink to="/pomodoro">Pomodoro timer</NavLink>
        </div>
      </aside>
    </div>
  )
}
