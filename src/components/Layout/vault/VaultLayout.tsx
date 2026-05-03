import { NavLink, Outlet } from 'react-router-dom'
import { certificationPacks } from '../../../data/certificationPacks'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV } from '../mainNav'
import './VaultLayout.css'

export function VaultLayout({ locationKey }: { locationKey: string }) {
  const { notebookText, setNotebookText, settings } = useAppContext()
  const navRight = settings.sidebarPosition === 'right'
  const activeSound = settings.atmosphereAudioEnabled && settings.backgroundSoundMode !== 'off'

  return (
    <div className={'vault-shell' + (navRight ? ' vault-shell--nav-right' : '')}>
      <aside className="vault-shell__left" aria-label="Dark Minimalistic navigation">
        <div className="vault-brand">
          <span className="vault-brand__mark" aria-hidden />
          <div>
            <p className="vault-brand__eyebrow">Dark Minimalistic</p>
            <h2>Midnight workspace</h2>
          </div>
        </div>
        <nav className="vault-quick" aria-label="Primary routes">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'vault-quick__link' + (isActive ? ' vault-quick__link--active' : '')}
            >
              <span className="vault-quick__icon" aria-hidden>
                <item.Icon size={15} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="vault-status" aria-label="Layout status">
          <span>Atmosphere</span>
          <strong>{settings.atmosphereMode}</strong>
          <span>Sound</span>
          <strong>{activeSound ? settings.backgroundSoundMode : 'muted'}</strong>
        </div>
      </aside>

      <main className="vault-shell__center">
        <div className="vault-shell__mast">
          <span>Quiet contrast</span>
          <span>Readable panels · even spacing · no visual noise</span>
        </div>
        <div key={locationKey} className="vault-shell__center-inner page-transition">
          <Outlet />
        </div>
      </main>

      <aside className="vault-shell__right" aria-label="Study map and scratchpad">
        <section className="vault-cert-stack" aria-label="Certification overview">
          <h2>Certification map</h2>
          <div className="vault-cert-list">
            {certificationPacks.map((pack) => (
              <article key={pack.id} className="vault-cert">
                <div>
                  <strong>{pack.label}</strong>
                  <span>{pack.examCode}</span>
                </div>
                <p>{pack.exam.domains.slice(0, 3).join(' · ')}</p>
              </article>
            ))}
          </div>
        </section>
        <h2>Scratchpad</h2>
        <div className="vault-scratch">
          <label htmlFor="vault-scratch-area" className="sr-only">
            Session notes
          </label>
          <textarea
            id="vault-scratch-area"
            value={notebookText}
            onChange={(e) => setNotebookText(e.target.value)}
            placeholder="Capture ideas, subnet tricks, or mnemonics — synced with Settings notebook storage."
            spellCheck
          />
        </div>
      </aside>
    </div>
  )
}
