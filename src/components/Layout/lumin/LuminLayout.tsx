import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV } from '../mainNav'
import './LuminLayout.css'

export function LuminLayout({ locationKey }: { locationKey: string }) {
  const { settings } = useAppContext()
  const railRight = settings.sidebarPosition === 'right'

  return (
    <div className={'lumin-shell' + (railRight ? ' lumin-shell--rail-right' : '')}>
      <aside className="lumin-rail" aria-label="Icon navigation">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => 'lumin-rail__btn' + (isActive ? ' lumin-rail__btn--active' : '')}
            title={item.label}
          >
            <item.Icon size={22} />
            <span className="lumin-rail__tip">{item.label}</span>
          </NavLink>
        ))}
      </aside>
      <main className="lumin-main">
        <div key={locationKey} className="lumin-main__inner page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
