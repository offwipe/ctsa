import { NavLink, Outlet } from 'react-router-dom'
import { certificationPacks } from '../../../data/certificationPacks'
import { useAppContext } from '../../../context/useAppContext'
import { MAIN_NAV } from '../mainNav'
import './VaultLayout.css'

export function VaultLayout({ locationKey }: { locationKey: string }) {
  const { notebookText, setNotebookText, settings } = useAppContext()
  const navRight = settings.sidebarPosition === 'right'

  return (
    <div className={'vault-shell' + (navRight ? ' vault-shell--nav-right' : '')}>
      <aside className="vault-shell__left" aria-label="Certification modules">
        <div className="vault-shell__left-head">
          <p className="vault-shell__left-title">Knowledge map</p>
        </div>
        <div className="vault-shell__left-scroll">
          <div className="vault-tree">
            {certificationPacks.map((pack) => (
              <details key={pack.id} className="vault-tree__cert" open>
                <summary>
                  <span>{pack.label}</span>
                  <span className="vault-tree__code">{pack.examCode}</span>
                </summary>
                <div className="vault-tree__body">
                  <p className="vault-tree__domains">
                    Domains include {pack.exam.domains.slice(0, 4).join(', ')}
                    {pack.exam.domains.length > 4 ? '…' : '.'}
                  </p>
                  <div className="vault-tree__decks-label">Flashcard decks</div>
                  <ul className="vault-tree__deck-list">
                    {pack.flashcards.decks.map((deck) => (
                      <li key={`${pack.id}-${deck}`}>{deck}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </aside>

      <main className="vault-shell__center">
        <div key={locationKey} className="vault-shell__center-inner page-transition">
          <Outlet />
        </div>
      </main>

      <aside className="vault-shell__right" aria-label="Scratchpad and quick links">
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
        <h2>Navigate</h2>
        <nav className="vault-quick" aria-label="Primary routes">
          {MAIN_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => 'vault-quick__link' + (isActive ? ' vault-quick__link--active' : '')}
            >
              <span className="vault-quick__icon" aria-hidden>
                <item.Icon size={14} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  )
}
