import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { breadcrumbTitle, getMainNav } from '../mainNav'
import './AtriumLayout.css'

export function AtriumLayout({ locationKey }: { locationKey: string }) {
  const { settings, activeCertification } = useAppContext()
  const { pathname } = useLocation()
  const alignEnd = settings.sidebarPosition === 'right'
  const nav = getMainNav(activeCertification)

  return (
    <div className={'atrium-shell' + (alignEnd ? ' atrium-shell--nav-end' : '')}>
      <header className="atrium-cap">
        <div className="atrium-cap__cluster">
          <span className="atrium-cap__title">Study</span>
          <span className="atrium-cap__crumb">{breadcrumbTitle(pathname)}</span>
        </div>
        <nav className="atrium-pills" aria-label="Routes">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'atrium-pill' + (isActive ? ' atrium-pill--active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="atrium-body">
        <div key={locationKey} className="atrium-body__sheet page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
