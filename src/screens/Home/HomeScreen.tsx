import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/useAppContext'
import { getCertificationPack } from '../../data/certificationPacks'
import type { CertificationId } from '../../data/certificationPacks'
import '../ScreenShell.css'
import './HomeScreen.css'

const certifications = [
  {
    id: 'ccst-it-support',
    name: 'CCST IT Support',
    code: 'Cisco CCST',
    description: 'Entry-level IT support: ticketing, troubleshooting, hardware and OS basics, and networking literacy.',
    color: '#10b981',
    ready: true,
  },
  {
    id: 'network-plus',
    name: 'Network+',
    code: 'N10-009',
    description: 'Networking fundamentals, infrastructure, security, and troubleshooting.',
    color: '#8b5cf6',
    ready: true,
  },
  {
    id: 'a-plus',
    name: 'A+',
    code: '220-1101 / 220-1102',
    description: 'Hardware, OS, networking, security, and operational procedures.',
    color: '#3b82f6',
    ready: true,
  },
  {
    id: 'security-plus',
    name: 'Security+',
    code: 'SY0-701',
    description: 'Threats, vulnerabilities, cryptography, and identity management.',
    color: '#ef4444',
    ready: false,
  },
  {
    id: 'az-900',
    name: 'AZ-900',
    code: 'AZ-900',
    description: 'Microsoft Azure Fundamentals — cloud concepts, services, governance, and pricing.',
    color: '#0ea5e9',
    ready: false,
  },
]

export function HomeScreen() {
  const navigate = useNavigate()
  const { activeCertification, setActiveCertification } = useAppContext()
  const activePack = activeCertification ? getCertificationPack(activeCertification) : null

  const selectCertification = (id: string) => {
    const certification = id as CertificationId
    setActiveCertification(certification)
    navigate(certification === 'ccst-it-support' ? '/pbq' : '/study')
  }

  return (
    <>
      <h1 className="screen-title">{activePack ? `Current exam: ${activePack.label}` : 'Choose your exam'}</h1>
      <p className="screen-description">
        {activePack
          ? 'Switch exams anytime from here. The sidebar, PBQs, exam prep, and titlebar follow the selected exam.'
          : 'Pick an exam before studying. The app will tailor navigation and practice modes to that selection.'}
      </p>

      <div className="cert-grid">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className={
              'cert-card' +
              (cert.ready ? '' : ' cert-card--coming') +
              (activeCertification === cert.id ? ' cert-card--active' : '')
            }
          >
            <div className="cert-card-accent" style={{ background: cert.color }} />
            <div className="cert-card-body">
              <div className="cert-card-header">
                <h2 className="cert-card-name">{cert.name}</h2>
                <span className="cert-card-code">{cert.code}</span>
              </div>
              <p className="cert-card-desc">{cert.description}</p>
              {cert.ready ? (
                <button type="button" className="cert-card-link" onClick={() => selectCertification(cert.id)}>
                  {activeCertification === cert.id ? 'Selected' : 'Select exam'}
                  <ArrowIcon />
                </button>
              ) : (
                <span className="cert-card-coming">Coming soon</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="home-features">
        <h3 className="home-features-title">What's included</h3>
        <ul className="screen-checklist">
          <li>Blitz — rapid-fire active recall with Leitner spacing</li>
          <li>Exam prep — timed exams with scoring</li>
          <li>Subnetting — infinite practice questions</li>
          <li>PBQ practice — drag-and-drop scenarios</li>
          <li>Flashcards — cloze and term cards</li>
        </ul>
      </div>
    </>
  )
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}
