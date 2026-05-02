import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import { MAIN_NAV } from './mainNav'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {MAIN_NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' sidebar-link--active' : '')
            }
            end={to === '/'}
          >
            <span className="sidebar-link-icon">
              <Icon />
            </span>
            <span className="sidebar-link-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
