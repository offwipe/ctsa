import type { ReactNode } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { breadcrumbTitle, getMainNav } from '../mainNav'
import './HighlighterLayout.css'

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="hl-nav-group">
      <div className="hl-nav-group__label">{label}</div>
      <ul className="hl-nav-group__list">{children}</ul>
    </div>
  )
}

export function HighlighterLayout({ locationKey }: { locationKey: string }) {
  const { pathname } = useLocation()
  const { settings, activeCertification } = useAppContext()
  const sidebarRight = settings.sidebarPosition === 'right'
  const nav = getMainNav(activeCertification)
  const study = nav.filter((n) => n.group === 'study')
  const system = nav.filter((n) => n.group === 'system')

  return (
    <div className={'highlighter-shell' + (sidebarRight ? ' highlighter-shell--sidebar-right' : '')}>
      <aside className="highlighter-shell__aside" aria-label="Primary navigation">
        <nav className="highlighter-shell__nav">
          <NavGroup label="Study">
            {study.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    'hl-nav-link' + (isActive ? ' hl-nav-link--active' : '')
                  }
                >
                  <span className="hl-nav-link__icon">
                    <item.Icon size={15} />
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </NavGroup>
          {system.length > 0 && (
            <NavGroup label="System">
              {system.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      'hl-nav-link' + (isActive ? ' hl-nav-link--active' : '')
                    }
                  >
                    <span className="hl-nav-link__icon">
                      <item.Icon size={15} />
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </NavGroup>
          )}
        </nav>
        <div className="highlighter-shell__footer">
          <button type="button" className="highlighter-shell__help" disabled title="Coming soon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Help & guide
          </button>
        </div>
      </aside>

      <div className="highlighter-shell__main">
        <header className="highlighter-shell__topbar">
          <div className="highlighter-shell__crumb">
            <span className="highlighter-shell__crumb-kicker">HighLighter</span>
            <span className="highlighter-shell__crumb-sep" aria-hidden>
              /
            </span>
            <span className="highlighter-shell__crumb-title">{breadcrumbTitle(pathname)}</span>
          </div>
          <div className="highlighter-shell__hints">
            <kbd className="hl-keycap">Alt</kbd>
            <span className="highlighter-shell__crumb-sep">+</span>
            <kbd className="hl-keycap">1</kbd>
            <span className="highlighter-shell__hints-desktop">notebook</span>
          </div>
        </header>
        <main className="highlighter-shell__content">
          <div key={locationKey} className="highlighter-shell__content-inner page-transition">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
