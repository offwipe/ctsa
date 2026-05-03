import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

/** Original CompTIA Study chrome: sidebar + wide reading column. Preserved verbatim as "Classic Base". */
export function ClassicBaseShell({ locationKey }: { locationKey: string }) {
  return (
    <div className="classic-base-contents">
      <Sidebar />
      <main className="app-main">
        <div key={locationKey} className="app-main-inner page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
