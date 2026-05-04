import { NavLink, Outlet } from 'react-router-dom'
import { getMainNav } from '../mainNav'
import { useAppContext } from '../../../context/useAppContext'
import './CommandCenterLayout.css'

export function CommandCenterLayout({ locationKey }: { locationKey: string }) {
  const { settings, activeCertification } = useAppContext()
  const railRight = settings.sidebarPosition === 'right'
  const nav = getMainNav(activeCertification)

  return (
    <div className={'command-shell' + (railRight ? ' command-shell--rail-right' : '')}>
      <header className="command-shell__ribbon">
        <span>French Beige</span>
        <span>Patisserie calm · warm study surfaces</span>
      </header>

      <nav className="command-shell__rail" aria-label="French Beige navigation">
        <div className="command-shell__rail-label">Menu du jour</div>
        {nav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            <span className="command-shell__rail-icon" aria-hidden>
              <item.Icon size={15} />
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <section className="command-shell__stage">
        <div key={locationKey} className="command-shell__stage-inner page-transition">
          <Outlet />
        </div>
      </section>

      <aside className="command-shell__meta" aria-label="French Beige status">
        <div className="command-meta__block">
          <h3>Ambience</h3>
          <div className="command-meta__kv">
            Mode: <strong style={{ fontWeight: 600 }}>{settings.atmosphereMode}</strong>
            <br />
            Sound: <strong style={{ fontWeight: 600 }}>{settings.backgroundSoundMode}</strong>
            <br />
            Audio: {settings.atmosphereAudioEnabled && settings.backgroundSoundMode !== 'off' ? `${settings.atmosphereVolume}%` : 'muted'}
          </div>
        </div>
        <div className="command-meta__widgets">
          <div className="command-meta__tile">
            <strong>Service side</strong>
            {settings.sidebarPosition}
          </div>
          <div className="command-meta__tile">
            <strong>Cream mode</strong>
            {settings.mode}
          </div>
        </div>
        <div className="command-meta__block">
          <h3>Chef’s shortcuts</h3>
          <NavLink to="/settings">Open settings</NavLink>
          <br />
          <NavLink to="/pomodoro">Pomodoro timer</NavLink>
        </div>
      </aside>
    </div>
  )
}
