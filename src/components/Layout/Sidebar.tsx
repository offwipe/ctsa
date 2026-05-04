import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import { useAppContext } from '../../context/useAppContext'
import { getMainNav } from './mainNav'

export function Sidebar() {
  const { activeCertification } = useAppContext()
  const nav = getMainNav(activeCertification)

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {nav.map(({ to, label, Icon }) => (
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
