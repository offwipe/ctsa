import { useMemo, useState } from 'react'
import '../ScreenShell.css'
import './CCSTMinigamesScreen.css'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'

type GameId = 'boot-order' | 'raid-match' | 'firewall-match' | 'cable-match'

const bootSteps = [
  { id: 'power', label: 'Power is applied and hardware begins startup checks' },
  { id: 'post', label: 'POST verifies CPU, memory, keyboard/video, and basic hardware' },
  { id: 'firmware', label: 'BIOS/UEFI checks boot order and selects a boot device' },
  { id: 'bootloader', label: 'Bootloader starts the operating system kernel' },
  { id: 'kernel', label: 'OS initializes drivers/services and presents sign-in or desktop' },
]

const raidLevels = [
  { id: 'raid0', label: 'RAID 0', answer: 'striping' },
  { id: 'raid1', label: 'RAID 1', answer: 'mirror' },
  { id: 'raid5', label: 'RAID 5', answer: 'parity' },
  { id: 'raid10', label: 'RAID 10', answer: 'mirror-stripe' },
]

const raidTargets = [
  { id: 'striping', label: 'Striping for speed; no fault tolerance' },
  { id: 'mirror', label: 'Mirroring across drives for redundancy' },
  { id: 'parity', label: 'Striping with distributed parity; survives one drive failure' },
  { id: 'mirror-stripe', label: 'Mirrored stripes; performance plus redundancy' },
]

/** PBQ-style: match firewall category to where it most commonly applies. */
const firewallItems = [
  { id: 'fw-host', label: 'Host-based / OS firewall', answer: 'tgt-endpoint' },
  { id: 'fw-network', label: 'Network (perimeter) firewall', answer: 'tgt-edge' },
  { id: 'fw-ngfw', label: 'Next-generation firewall (NGFW)', answer: 'tgt-ngfw' },
  { id: 'fw-waf', label: 'Web application firewall (WAF)', answer: 'tgt-waf' },
]

const firewallTargets = [
  {
    id: 'tgt-endpoint',
    label: 'Controls traffic on a single workstation or server using local rules (e.g., Windows Defender Firewall)',
  },
  {
    id: 'tgt-edge',
    label: 'Dedicated appliance or VM between trusted internal LAN and untrusted networks; NAT, zones, ACLs',
  },
  {
    id: 'tgt-ngfw',
    label: 'Deep inspection beyond ports: application ID, users/groups, URL categories, often integrated IPS',
  },
  {
    id: 'tgt-waf',
    label: 'Terminates or proxies HTTP/S in front of web apps to block OWASP-style attacks (SQLi, XSS, bad bots)',
  },
]

/** Match physical/logical cable or connector to its best first-line description. */
const cableItems = [
  { id: 'cable-cat6', label: 'Cat 6 twisted-pair (Ethernet)', answer: 'use-rj45-lan' },
  { id: 'cable-smf', label: 'Single-mode fiber', answer: 'use-long-haul' },
  { id: 'cable-mmf', label: 'Multimode fiber', answer: 'use-building' },
  { id: 'cable-coax', label: 'Coaxial (e.g., RG-6 drop)', answer: 'use-docsis' },
  { id: 'cable-usbc', label: 'USB-C', answer: 'use-usbc' },
  { id: 'cable-hdmi', label: 'HDMI', answer: 'use-hdmi' },
]

const cableTargets = [
  {
    id: 'use-rj45-lan',
    label: 'RJ-45-terminated horizontal cabling for switched LAN access; common in offices (Gigabit+)',
  },
  {
    id: 'use-long-haul',
    label: 'Very long campus or carrier links; a narrow core keeps modes stable over distance',
  },
  {
    id: 'use-building',
    label: 'Short-to-medium building backbones and cross-rack links; LED/laser on wider core than single-mode',
  },
  {
    id: 'use-docsis',
    label: 'Broadband ISP demarcation for cable modem service (DOCSIS) alongside TV splitters in many sites',
  },
  {
    id: 'use-usbc',
    label: 'Universal data, charging, and sometimes DisplayPort Alt Mode video on laptops, docks, and phones',
  },
  {
    id: 'use-hdmi',
    label: 'Digital audio/video to monitors, TVs, and many conference-room displays',
  },
]

function rotate<T>(items: T[], offset: number) {
  return [...items.slice(offset), ...items.slice(0, offset)]
}

export function CCSTMinigamesScreen() {
  const [game, setGame] = useState<GameId>('boot-order')
  const [bootOrder, setBootOrder] = useState(() => rotate(bootSteps, 2).map((item) => item.id))
  const [raidMatches, setRaidMatches] = useState<Record<string, string>>({})
  const [selectedRaid, setSelectedRaid] = useState<string | null>(null)
  const [firewallMatches, setFirewallMatches] = useState<Record<string, string>>({})
  const [selectedFirewall, setSelectedFirewall] = useState<string | null>(null)
  const [cableMatches, setCableMatches] = useState<Record<string, string>>({})
  const [selectedCable, setSelectedCable] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  const orderedBootSteps = useMemo(
    () => bootOrder.map((id) => bootSteps.find((step) => step.id === id)).filter(Boolean) as typeof bootSteps,
    [bootOrder],
  )

  const moveBootStep = (id: string, direction: -1 | 1) => {
    setResult(null)
    setBootOrder((previous) => {
      const index = previous.indexOf(id)
      const swap = index + direction
      if (index < 0 || swap < 0 || swap >= previous.length) return previous
      const next = [...previous]
      ;[next[index], next[swap]] = [next[swap], next[index]]
      return next
    })
  }

  const resetGame = () => {
    setResult(null)
    if (game === 'boot-order') {
      setBootOrder(rotate(bootSteps, (streak % 3) + 1).map((item) => item.id))
    } else if (game === 'raid-match') {
      setRaidMatches({})
      setSelectedRaid(null)
    } else if (game === 'firewall-match') {
      setFirewallMatches({})
      setSelectedFirewall(null)
    } else {
      setCableMatches({})
      setSelectedCable(null)
    }
  }

  const submit = () => {
    let perfect = false
    if (game === 'boot-order') {
      perfect = bootOrder.every((id, index) => id === bootSteps[index].id)
    } else if (game === 'raid-match') {
      perfect = raidLevels.every((level) => raidMatches[level.id] === level.answer)
    } else if (game === 'firewall-match') {
      perfect = firewallItems.every((row) => firewallMatches[row.id] === row.answer)
    } else {
      perfect = cableItems.every((row) => cableMatches[row.id] === row.answer)
    }

    setStreak((previous) => (perfect ? previous + 1 : 0))
    setResult(
      perfect
        ? 'Correct. Streak increased.'
        : 'Not quite. Review definitions, then remap the items that feel closest to each scenario.',
    )
  }

  const sectionTitle =
    game === 'boot-order'
      ? 'Place the correct troubleshooting boot order'
      : game === 'raid-match'
        ? 'Match RAID levels to functions'
        : game === 'firewall-match'
          ? 'PBQ-style: map firewall types to their primary role'
          : 'PBQ-style: match cable types to typical use'

  return (
    <>
      <div className="screen-kicker">CCST IT Support</div>
      <h1 className="screen-title">CCST Minigames</h1>
      <p className="screen-description">
        Focused CCST practice interactions with a simple streak. These stay practical, not arcade-style.
      </p>

      <div className="ccst-game-tabs" role="tablist" aria-label="CCST minigames">
        <button
          type="button"
          className={'ccst-game-tab' + (game === 'boot-order' ? ' ccst-game-tab--active' : '')}
          onClick={() => {
            setGame('boot-order')
            setResult(null)
          }}
        >
          Troubleshooting boot order
        </button>
        <button
          type="button"
          className={'ccst-game-tab' + (game === 'raid-match' ? ' ccst-game-tab--active' : '')}
          onClick={() => {
            setGame('raid-match')
            setResult(null)
          }}
        >
          RAID level match
        </button>
        <button
          type="button"
          className={'ccst-game-tab' + (game === 'firewall-match' ? ' ccst-game-tab--active' : '')}
          onClick={() => {
            setGame('firewall-match')
            setResult(null)
          }}
        >
          Firewall types
        </button>
        <button
          type="button"
          className={'ccst-game-tab' + (game === 'cable-match' ? ' ccst-game-tab--active' : '')}
          onClick={() => {
            setGame('cable-match')
            setResult(null)
          }}
        >
          Cable types
        </button>
      </div>

      <Section title={sectionTitle} badge={`Streak ${streak}`} badgeVariant="accent">
        {game === 'boot-order' ? (
          <div className="ccst-order-list">
            {orderedBootSteps.map((step, index) => (
              <article key={step.id} className="ccst-order-card">
                <span className="ccst-order-rank">{index + 1}</span>
                <p>{step.label}</p>
                <div className="ccst-order-actions">
                  <button type="button" onClick={() => moveBootStep(step.id, -1)} disabled={index === 0}>Up</button>
                  <button type="button" onClick={() => moveBootStep(step.id, 1)} disabled={index === orderedBootSteps.length - 1}>Down</button>
                </div>
              </article>
            ))}
          </div>
        ) : game === 'raid-match' ? (
          <div className="ccst-match-grid">
            <div className="ccst-match-column">
              {raidLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  className={'ccst-match-card' + (selectedRaid === level.id ? ' ccst-match-card--active' : '')}
                  onClick={() => setSelectedRaid(level.id)}
                >
                  <strong>{level.label}</strong>
                  <span>{raidTargets.find((target) => target.id === raidMatches[level.id])?.label ?? 'Tap a description on the right'}</span>
                </button>
              ))}
            </div>
            <div className="ccst-match-column">
              {raidTargets.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  className="ccst-match-target"
                  onClick={() => {
                    if (!selectedRaid) return
                    setRaidMatches((previous) => ({ ...previous, [selectedRaid]: target.id }))
                    setSelectedRaid(null)
                    setResult(null)
                  }}
                >
                  {target.label}
                </button>
              ))}
            </div>
          </div>
        ) : game === 'firewall-match' ? (
          <div className="ccst-match-grid ccst-match-grid--stacked">
            <p className="ccst-match-hint">Select a firewall type, then tap the scenario that best describes where it fits.</p>
            <div className="ccst-match-columns">
              <div className="ccst-match-column">
                {firewallItems.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    className={'ccst-match-card' + (selectedFirewall === row.id ? ' ccst-match-card--active' : '')}
                    onClick={() => setSelectedFirewall(row.id)}
                  >
                    <strong>{row.label}</strong>
                    <span>
                      {firewallTargets.find((t) => t.id === firewallMatches[row.id])?.label ?? 'Tap a scenario on the right'}
                    </span>
                  </button>
                ))}
              </div>
              <div className="ccst-match-column">
                {firewallTargets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    className="ccst-match-target"
                    onClick={() => {
                      if (!selectedFirewall) return
                      setFirewallMatches((previous) => ({ ...previous, [selectedFirewall]: target.id }))
                      setSelectedFirewall(null)
                      setResult(null)
                    }}
                  >
                    {target.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="ccst-match-grid ccst-match-grid--stacked">
            <p className="ccst-match-hint">Select a cable or connector, then tap the description that fits CCST-style troubleshooting context.</p>
            <div className="ccst-match-columns">
              <div className="ccst-match-column">
                {cableItems.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    className={'ccst-match-card' + (selectedCable === row.id ? ' ccst-match-card--active' : '')}
                    onClick={() => setSelectedCable(row.id)}
                  >
                    <strong>{row.label}</strong>
                    <span>{cableTargets.find((t) => t.id === cableMatches[row.id])?.label ?? 'Tap a description on the right'}</span>
                  </button>
                ))}
              </div>
              <div className="ccst-match-column">
                {cableTargets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    className="ccst-match-target"
                    onClick={() => {
                      if (!selectedCable) return
                      setCableMatches((previous) => ({ ...previous, [selectedCable]: target.id }))
                      setSelectedCable(null)
                      setResult(null)
                    }}
                  >
                    {target.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="ccst-game-actions">
          <PrimaryButton onClick={submit}>Check answer</PrimaryButton>
          <button type="button" className="exam-nav-button" onClick={resetGame}>Reset game</button>
          {result ? <span className="ccst-game-result">{result}</span> : null}
        </div>
      </Section>
    </>
  )
}
