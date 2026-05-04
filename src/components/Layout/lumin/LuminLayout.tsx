import { NavLink, Outlet } from 'react-router-dom'
import { useAppContext } from '../../../context/useAppContext'
import { getMainNav } from '../mainNav'
import './LuminLayout.css'

export function LuminLayout({ locationKey }: { locationKey: string }) {
  const { settings, activeCertification } = useAppContext()
  const railRight = settings.sidebarPosition === 'right'
  const nav = getMainNav(activeCertification)

  return (
    <div className={'lumin-shell' + (railRight ? ' lumin-shell--rail-right' : '')}>
      <aside className="lumin-rail" aria-label="Aurora Grid navigation">
        <div className="lumin-rail__brand">
          <span>Aurora Grid</span>
          <small>luminous focus matrix</small>
        </div>
        <nav className="lumin-rail__nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'lumin-rail__btn' + (isActive ? ' lumin-rail__btn--active' : '')}
              title={item.label}
            >
              <item.Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="lumin-rail__ambient">
          <span>Atmosphere</span>
          <strong>{settings.atmosphereMode}</strong>
        </div>
      </aside>
      <main className="lumin-main">
        <div className="lumin-main__gridline" aria-hidden />
        <div key={locationKey} className="lumin-main__inner page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
