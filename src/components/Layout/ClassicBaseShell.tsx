import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAppContext } from '../../context/useAppContext'

/** Original CompTIA Study chrome: sidebar + wide reading column. Preserved verbatim as "Classic Base". */
export function ClassicBaseShell({ locationKey }: { locationKey: string }) {
  const { settings } = useAppContext()
  const sidebarRight = settings.sidebarPosition === 'right'

  return (
    <div className={'app-layout' + (sidebarRight ? ' app-layout--sidebar-right' : '')}>
      <Sidebar />
      <main className="app-main">
        <div key={locationKey} className="app-main-inner page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
