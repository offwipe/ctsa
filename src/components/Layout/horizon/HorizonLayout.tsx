import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV } from '../mainNav'
import './HorizonLayout.css'

export function HorizonLayout({ locationKey }: { locationKey: string }) {
  const { settings } = useAppContext()
  const tabsReverse = settings.sidebarPosition === 'right'

  return (
    <div className={'horizon-shell' + (tabsReverse ? ' horizon-shell--tabs-reverse' : '')}>
      <main className="horizon-stage">
        <div key={locationKey} className="horizon-stage__inner page-transition">
          <Outlet />
        </div>
      </main>
      <nav className="horizon-tabbar" aria-label="Primary tabs">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 'horizon-tab' + (isActive ? ' horizon-tab--active' : '')}
          >
            <item.Icon size={20} />
            <span className="horizon-tab__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
