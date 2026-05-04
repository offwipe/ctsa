import { useMemo, useState } from 'react'
import '../ScreenShell.css'
import './CCSTMinigamesScreen.css'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'

type GameId = 'boot-order' | 'raid-match'

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

function rotate<T>(items: T[], offset: number) {
  return [...items.slice(offset), ...items.slice(0, offset)]
}

export function CCSTMinigamesScreen() {
  const [game, setGame] = useState<GameId>('boot-order')
  const [bootOrder, setBootOrder] = useState(() => rotate(bootSteps, 2).map((item) => item.id))
  const [raidMatches, setRaidMatches] = useState<Record<string, string>>({})
  const [selectedRaid, setSelectedRaid] = useState<string | null>(null)
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
    } else {
      setRaidMatches({})
      setSelectedRaid(null)
    }
  }

  const submit = () => {
    const perfect =
      game === 'boot-order'
        ? bootOrder.every((id, index) => id === bootSteps[index].id)
        : raidLevels.every((level) => raidMatches[level.id] === level.answer)

    setStreak((previous) => (perfect ? previous + 1 : 0))
    setResult(perfect ? 'Correct. Streak increased.' : 'Not quite. Review the sequence/function and try again.')
  }

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
      </div>

      <Section title={game === 'boot-order' ? 'Place the correct troubleshooting boot order' : 'Match RAID levels to functions'} badge={`Streak ${streak}`} badgeVariant="accent">
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
        ) : (
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
                  <span>{raidTargets.find((target) => target.id === raidMatches[level.id])?.label ?? 'Choose a function'}</span>
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
