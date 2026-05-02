import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV, breadcrumbTitle } from '../mainNav'
import './MeridianLayout.css'

export function MeridianLayout({ locationKey }: { locationKey: string }) {
  const { settings } = useAppContext()
  const { pathname } = useLocation()
  const navEnd = settings.sidebarPosition === 'right'

  return (
    <div className={'meridian-shell' + (navEnd ? ' meridian-shell--nav-end' : '')}>
      <header className="meridian-header">
        <p className="meridian-eyebrow" id="meridian-nav-label">
          Navigation
        </p>
        <nav className="meridian-nav" aria-labelledby="meridian-nav-label">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'meridian-link' + (isActive ? ' meridian-link--active' : '')}
            >
              <item.Icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="meridian-context" role="status">
          {breadcrumbTitle(pathname)}
        </p>
      </header>
      <main className="meridian-main">
        <div key={locationKey} className="meridian-main__inner page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
