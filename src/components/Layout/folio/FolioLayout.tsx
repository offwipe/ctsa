import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { getMainNav } from '../mainNav'
import './FolioLayout.css'

export function FolioLayout({ locationKey }: { locationKey: string }) {
  const { settings, activeCertification } = useAppContext()
  const spineRight = settings.sidebarPosition === 'right'
  const nav = getMainNav(activeCertification)

  return (
    <div className={'folio-shell' + (spineRight ? ' folio-shell--spine-right' : '')}>
      <aside className="folio-spine" aria-label="Section navigation">
        <p className="folio-spine__label">Contents</p>
        <nav className="folio-spine__nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'folio-spine__link' + (isActive ? ' folio-spine__link--active' : '')}
            >
              <span className="folio-spine__dot" aria-hidden />
              <span className="folio-spine__text">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="folio-stage">
        <div key={locationKey} className="folio-stage__inner page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
