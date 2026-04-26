import { useEffect, useMemo, useRef, useState } from 'react'
import '../ScreenShell.css'
import './PBQScreen.css'
import { certificationPacks, getCertificationPack } from '../../data/certificationPacks'
import type { CertificationId, DifficultyLevel, PBQScenario, PBQScenarioType } from '../../data/certificationPacks'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { Dropdown } from '../../components/ui/Dropdown'

type PBQSetup = {
  certification: CertificationId
  topic: string
  type: PBQScenarioType | 'all'
  difficulty: DifficultyLevel | 'all'
}

type PBQState = {
  phase: 'setup' | 'active' | 'review'
  setup: PBQSetup
  scenarioId: string | null
  placements: Record<string, string>
  submitted: boolean
}

const STORAGE_KEY = 'study-app-pbq'

const DEFAULT_STATE: PBQState = {
  phase: 'setup',
  setup: {
    certification: 'a-plus',
    topic: 'all',
    type: 'all',
    difficulty: 'all',
  },
  scenarioId: null,
  placements: {},
  submitted: false,
}

function getFilteredScenarios(setup: PBQSetup) {
  const pack = getCertificationPack(setup.certification)
  return pack.pbq.scenarios.filter((scenario) => {
    if (setup.topic !== 'all' && scenario.topic !== setup.topic) return false
    if (setup.type !== 'all' && scenario.type !== setup.type) return false
    if (setup.difficulty !== 'all' && scenario.difficulty !== setup.difficulty) return false
    return true
  })
}

function randomScenario(setup: PBQSetup) {
  const scenarios = getFilteredScenarios(setup)
  return scenarios[Math.floor(Math.random() * scenarios.length)] ?? null
}

export function PBQScreen() {
  const [state, setState] = useLocalStorageState<PBQState>(STORAGE_KEY, DEFAULT_STATE)
  const pack = getCertificationPack(state.setup.certification)
  const scenarios = useMemo(() => getFilteredScenarios(state.setup), [state.setup])
  const scenario = scenarios.find((item) => item.id === state.scenarioId) ?? null

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [hoverTargetId, setHoverTargetId] = useState<string | null>(null)
  const ghostRef = useRef<HTMLDivElement | null>(null)
  const dragStateRef = useRef<{
    itemId: string
    label: string
    pointerId: number
    startedFrom: 'pool' | 'placed'
  } | null>(null)

  useEffect(() => {
    return () => {
      if (ghostRef.current) {
        ghostRef.current.remove()
        ghostRef.current = null
      }
    }
  }, [])

  const updateSetup = <K extends keyof PBQSetup>(key: K, value: PBQSetup[K]) => {
    setState((previous) => ({
      ...previous,
      phase: 'setup',
      scenarioId: null,
      placements: {},
      submitted: false,
      setup: { ...previous.setup, [key]: value },
    }))
  }

  const startScenario = () => {
    const next = randomScenario(state.setup)
    if (!next) return
    setState((previous) => ({
      ...previous,
      phase: 'active',
      scenarioId: next.id,
      placements: {},
      submitted: false,
    }))
  }

  const placeItem = (itemId: string, targetId: string) => {
    setState((previous) => {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(previous.placements)) {
        if (k === itemId) continue
        if (v === targetId) continue
        next[k] = v
      }
      next[itemId] = targetId
      return { ...previous, placements: next }
    })
  }

  const unplaceItem = (itemId: string) => {
    setState((previous) => {
      const next = { ...previous.placements }
      delete next[itemId]
      return { ...previous, placements: next }
    })
  }

  const resetScenario = () => {
    setState((previous) => ({ ...previous, placements: {}, submitted: false }))
  }

  const submitScenario = () => {
    setState((previous) => ({ ...previous, phase: 'review', submitted: true }))
  }

  const retryScenario = () => {
    setState((previous) => ({ ...previous, phase: 'active', placements: {}, submitted: false }))
  }

  const backToSetup = () => {
    setState((previous) => ({ ...previous, phase: 'setup', scenarioId: null, placements: {}, submitted: false }))
  }

  const scoreScenario = (activeScenario: PBQScenario) =>
    activeScenario.items.reduce((total, item) => {
      const expected = activeScenario.solution[item.id]
      const actual = state.placements[item.id]
      return total + (String(expected) === String(actual) ? 1 : 0)
    }, 0)

  if (state.phase === 'setup' || !scenario) {
    return (
      <>
        <div className="screen-kicker">Interactive Scenarios</div>
        <h1 className="screen-title">PBQ Practice</h1>
        <p className="screen-description">
          Run real match, ordering, and map-style scenarios with a focused desktop workspace and saved setup state.
        </p>

        <div className="pbq-grid">
          <Section
            title="Scenario Setup"
            badge="Interactive"
            badgeVariant="accent"
            description="Use the current content pack to launch PBQs by topic, type, and difficulty."
          >
            <div className="pbq-setup-grid">
              <Dropdown
                label="Certification"
                value={state.setup.certification}
                options={certificationPacks.map((option) => ({ value: option.id, label: `${option.label} • ${option.examCode}` }))}
                onChange={(value) => updateSetup('certification', value as CertificationId)}
              />
              <Dropdown
                label="Topic"
                value={state.setup.topic}
                options={[{ value: 'all', label: 'All topics' }, ...pack.pbq.topics.map((topic) => ({ value: topic, label: topic }))]}
                onChange={(value) => updateSetup('topic', value)}
              />
              <Dropdown
                label="Type"
                value={state.setup.type}
                options={[
                  { value: 'all', label: 'All scenario types' },
                  { value: 'match', label: 'Match' },
                  { value: 'order', label: 'Order' },
                  { value: 'map', label: 'Map / placement' },
                ]}
                onChange={(value) => updateSetup('type', value as PBQScenarioType | 'all')}
              />
              <Dropdown
                label="Difficulty"
                value={state.setup.difficulty}
                options={[
                  { value: 'all', label: 'All difficulties' },
                  { value: 'easy', label: 'Easy' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                ]}
                onChange={(value) => updateSetup('difficulty', value as DifficultyLevel | 'all')}
              />
            </div>
            <div className="pbq-action-row">
              <PrimaryButton onClick={startScenario} disabled={scenarios.length === 0}>Launch Scenario</PrimaryButton>
              <span className="pbq-meta">{scenarios.length} scenarios match the current filters.</span>
            </div>
          </Section>

          <div className="screen-preview-card">
            <div className="screen-panel-header">
              <div>
                <p className="screen-panel-title">Scenario Coverage</p>
                <p className="screen-panel-copy">PBQs cover all three interaction patterns inside the same theme language.</p>
              </div>
              <span className="screen-panel-tag">PBQ</span>
            </div>
            <div className="pbq-mode-grid">
              <div className="screen-module-card"><p className="screen-module-title">Match</p><p className="screen-module-copy">Connector, service, and concept pairing.</p></div>
              <div className="screen-module-card"><p className="screen-module-title">Order</p><p className="screen-module-copy">Troubleshooting and workflow sequencing.</p></div>
              <div className="screen-module-card"><p className="screen-module-title">Map</p><p className="screen-module-copy">Zone and topology placement.</p></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const score = scoreScenario(scenario)
  const allPlaced = scenario.items.every((item) => Boolean(state.placements[item.id]))
  const placedItemIds = new Set(Object.keys(state.placements))
  const unplacedItems = scenario.items.filter((item) => !placedItemIds.has(item.id))

  if (state.phase === 'review') {
    return (
      <>
        <div className="screen-kicker">Scenario Review</div>
        <h1 className="screen-title">PBQ Practice</h1>
        <p className="screen-description">Check the placement results, read the explanation, and retry the scenario if needed.</p>

        <div className="pbq-grid">
          <div className="screen-preview-card pbq-review-score">
            <div className="exam-score-number">{score}/{scenario.items.length}</div>
            <div className="exam-score-caption">Correct placements</div>
            <div className="exam-score-meta">{scenario.topic} • {scenario.type}</div>
            <div className="exam-review-actions">
              <PrimaryButton onClick={retryScenario}>Retry Scenario</PrimaryButton>
              <button type="button" className="exam-nav-button" onClick={backToSetup}>Back to setup</button>
            </div>
          </div>

          <Section title="Scenario Explanation" badge="Reviewed" description={scenario.prompt}>
            <p className="pbq-explanation">{scenario.explanation}</p>
            <div className="pbq-review-grid">
              {scenario.items.map((item) => {
                const expected = String(scenario.solution[item.id])
                const actual = state.placements[item.id]
                const correct = expected === actual
                const targetLabel = scenario.targets.find((target) => target.id === actual)?.label ?? 'Unplaced'
                const expectedLabel = scenario.targets.find((target) => target.id === expected)?.label ?? expected
                return (
                  <div key={item.id} className={'pbq-review-card' + (correct ? ' pbq-review-card--correct' : ' pbq-review-card--wrong')}>
                    <p className="pbq-review-title">{item.label}</p>
                    <p className="pbq-review-copy">Placed: {targetLabel}</p>
                    {!correct && <p className="pbq-review-copy">Expected: {expectedLabel}</p>}
                  </div>
                )
              })}
            </div>
          </Section>
        </div>
      </>
    )
  }

  const cleanupDrag = () => {
    if (ghostRef.current) {
      ghostRef.current.remove()
      ghostRef.current = null
    }
    dragStateRef.current = null
    setDraggingId(null)
    setHoverTargetId(null)
    document.body.classList.remove('pbq-dragging-cursor')
  }

  const handlePointerMove = (ev: PointerEvent) => {
    const drag = dragStateRef.current
    if (!drag || ev.pointerId !== drag.pointerId) return
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate3d(${ev.clientX}px, ${ev.clientY}px, 0)`
    }
    const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
    const targetEl = el?.closest('[data-pbq-target]') as HTMLElement | null
    const targetId = targetEl?.getAttribute('data-pbq-target') ?? null
    setHoverTargetId((current) => (current === targetId ? current : targetId))
  }

  const handlePointerUp = (ev: PointerEvent) => {
    const drag = dragStateRef.current
    if (!drag || ev.pointerId !== drag.pointerId) return
    const el = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
    const targetEl = el?.closest('[data-pbq-target]') as HTMLElement | null
    const poolEl = el?.closest('[data-pbq-pool]') as HTMLElement | null
    const targetId = targetEl?.getAttribute('data-pbq-target')
    if (targetId) {
      placeItem(drag.itemId, targetId)
    } else if (poolEl && drag.startedFrom === 'placed') {
      unplaceItem(drag.itemId)
    }
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
    cleanupDrag()
  }

  const beginDrag = (
    e: React.PointerEvent<HTMLDivElement>,
    itemId: string,
    label: string,
    startedFrom: 'pool' | 'placed',
  ) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('.pbq-drag-remove')) return
    e.preventDefault()

    const ghost = document.createElement('div')
    ghost.className = 'pbq-drag-ghost'
    ghost.textContent = label
    ghost.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    document.body.appendChild(ghost)
    ghostRef.current = ghost

    dragStateRef.current = {
      itemId,
      label,
      pointerId: e.pointerId,
      startedFrom,
    }
    setDraggingId(itemId)
    document.body.classList.add('pbq-dragging-cursor')

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  return (
    <>
      <div className="screen-kicker">Live Scenario</div>
      <h1 className="screen-title">PBQ Practice</h1>
      <p className="screen-description">{scenario.instructions}</p>

      <div className="pbq-grid">
        <Section
          title={scenario.prompt}
          badge={scenario.type.toUpperCase()}
          badgeVariant="accent"
          description={`${scenario.topic} • ${scenario.difficulty}`}
        >
          <div className="pbq-workspace">
            <div className="pbq-pool-label">Drag from this pool</div>
            <div
              className={'pbq-pool' + (draggingId ? ' pbq-pool--active' : '')}
              data-pbq-pool="true"
            >
              {unplacedItems.length === 0 ? (
                <div className="pbq-pool-empty">All items placed — drop one back here to undo.</div>
              ) : (
                <div className="pbq-draggable-grid">
                  {unplacedItems.map((item) => (
                    <div
                      key={item.id}
                      className={'pbq-drag-item' + (draggingId === item.id ? ' pbq-drag-item--dragging' : '')}
                      onPointerDown={(e) => beginDrag(e, item.id, item.label, 'pool')}
                    >
                      <span className="pbq-drag-handle" aria-hidden>
                        <svg width="10" height="14" viewBox="0 0 10 14">
                          <circle cx="3" cy="3" r="1.2" fill="currentColor" />
                          <circle cx="7" cy="3" r="1.2" fill="currentColor" />
                          <circle cx="3" cy="7" r="1.2" fill="currentColor" />
                          <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                          <circle cx="3" cy="11" r="1.2" fill="currentColor" />
                          <circle cx="7" cy="11" r="1.2" fill="currentColor" />
                        </svg>
                      </span>
                      <span className="pbq-drag-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pbq-pool-label">Drop into the right slot</div>
            <div className="pbq-target-grid">
              {scenario.targets.map((target, index) => {
                const assigned = scenario.items.find((item) => state.placements[item.id] === target.id)
                const isHover = hoverTargetId === target.id
                return (
                  <div
                    key={target.id}
                    className={
                      'pbq-target' +
                      (isHover ? ' pbq-target--hover' : '') +
                      (assigned ? ' pbq-target--filled' : '')
                    }
                    data-pbq-target={target.id}
                  >
                    <div className="pbq-target-label">
                      {scenario.type === 'order' ? `Step ${index + 1}` : target.label}
                    </div>
                    {assigned ? (
                      <div
                        className={'pbq-drag-item pbq-drag-item--placed' + (draggingId === assigned.id ? ' pbq-drag-item--dragging' : '')}
                        onPointerDown={(e) => beginDrag(e, assigned.id, assigned.label, 'placed')}
                      >
                        <span className="pbq-drag-handle" aria-hidden>
                          <svg width="10" height="14" viewBox="0 0 10 14">
                            <circle cx="3" cy="3" r="1.2" fill="currentColor" />
                            <circle cx="7" cy="3" r="1.2" fill="currentColor" />
                            <circle cx="3" cy="7" r="1.2" fill="currentColor" />
                            <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                            <circle cx="3" cy="11" r="1.2" fill="currentColor" />
                            <circle cx="7" cy="11" r="1.2" fill="currentColor" />
                          </svg>
                        </span>
                        <span className="pbq-drag-label">{assigned.label}</span>
                        <button
                          type="button"
                          className="pbq-drag-remove"
                          onClick={() => unplaceItem(assigned.id)}
                          aria-label={`Remove ${assigned.label}`}
                          title="Remove"
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                            <line x1="2" y1="2" x2="8" y2="8" />
                            <line x1="8" y1="2" x2="2" y2="8" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="pbq-target-slot">Drop item here</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Section>

        <div className="pbq-side-stack">
          <Section
            title="Scenario Controls"
            badge="Guided"
            description="Reset, submit, or swap scenarios without leaving the PBQ workspace."
          >
            <div className="exam-review-actions">
              <button type="button" className="exam-nav-button" onClick={resetScenario}>Reset</button>
              <button type="button" className="exam-nav-button" onClick={startScenario}>Randomize</button>
              <button
                type="button"
                className="exam-nav-button exam-nav-button--primary"
                onClick={submitScenario}
                disabled={!allPlaced}
              >
                Submit
              </button>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}
