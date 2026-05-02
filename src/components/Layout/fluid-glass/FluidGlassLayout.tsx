import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV } from '../mainNav'
import './FluidGlassLayout.css'

/**
 * Fluid Glass — reworked “Clarity Deck”: solid surfaces, readable contrast,
 * horizontal link row + scroll stage (no full-window blur).
 */
export function FluidGlassLayout({ locationKey }: { locationKey: string }) {
  const { settings } = useAppContext()
  const railEnd = settings.sidebarPosition === 'right'

  return (
    <div className={'fluid-clear' + (railEnd ? ' fluid-clear--rail-end' : '')}>
      <nav className="fluid-clear__links" aria-label="Primary navigation">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 'fluid-clear__link' + (isActive ? ' fluid-clear__link--active' : '')}
          >
            <item.Icon size={17} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <section className="fluid-clear__stage">
        <div key={locationKey} className="fluid-clear__scroll page-transition">
          <Outlet />
        </div>
      </section>
    </div>
  )
}
