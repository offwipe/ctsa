import { useMemo } from 'react'
import '../ScreenShell.css'
import './SubnettingScreen.css'
import type { SubnettingWeakZoneCategory } from '../../data/certificationPacks'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { Dropdown } from '../../components/ui/Dropdown'
import { generateSubnettingPrompt } from '../../utils/subnetting'

type SubnetMode = 'full-drill' | 'fields-only' | 'scratching-surface'
type AnswerField = 'networkId' | 'broadcastAddress' | 'blockSize' | 'subnetMask' | 'usableHosts' | 'usableRange'

type SubnetStats = {
  attempts: number
  correct: number
}

type SubnetState = {
  mode: SubnetMode
  selectedFields: AnswerField[]
  weakZone: SubnettingWeakZoneCategory
  prompt: ReturnType<typeof generateSubnettingPrompt> | null
  answers: Partial<Record<AnswerField, string>>
  feedback: Partial<Record<AnswerField, boolean>>
  stats: Record<string, SubnetStats>
}

const STORAGE_KEY = 'study-app-subnetting'

const DEFAULT_STATE: SubnetState = {
  mode: 'full-drill',
  selectedFields: ['networkId', 'broadcastAddress', 'blockSize'],
  weakZone: 'third-octet-focus',
  prompt: null,
  answers: {},
  feedback: {},
  stats: {},
}

const fieldOptions: Array<{ value: AnswerField; label: string }> = [
  { value: 'networkId', label: 'Network ID' },
  { value: 'broadcastAddress', label: 'Broadcast Address' },
  { value: 'blockSize', label: 'Block Size' },
  { value: 'subnetMask', label: 'Subnet Mask' },
  { value: 'usableHosts', label: 'Usable Hosts' },
  { value: 'usableRange', label: 'Usable Range' },
]

const defaultSubnetCidrs = [16, 20, 22, 24, 25, 26, 27, 28, 29, 30]

const weakZoneOptions: Array<{ value: SubnettingWeakZoneCategory; label: string }> = [
  { value: 'third-octet-focus', label: 'xxx.xxx.43.xx style third octet focus' },
  { value: 'block-size', label: 'Block size only' },
  { value: 'network-broadcast', label: 'Network ID and broadcast only' },
  { value: 'subnet-mask', label: 'Subnet mask only' },
  { value: 'host-count', label: 'Host count only' },
  { value: 'cidr-to-mask', label: 'CIDR to subnet mask' },
  { value: 'mask-to-cidr', label: 'Subnet mask to CIDR' },
  { value: 'usable-range', label: 'Usable range only' },
]

const modeOptions: Array<{ value: SubnetMode; label: string }> = [
  { value: 'full-drill', label: 'Full drill' },
  { value: 'fields-only', label: 'Fields only' },
  { value: 'scratching-surface', label: 'Weak zone focus' },
]

function answerFieldsForMode(state: SubnetState): AnswerField[] {
  if (state.mode === 'fields-only') return state.selectedFields
  if (state.mode === 'scratching-surface') {
    switch (state.weakZone) {
      case 'block-size':
        return ['blockSize']
      case 'network-broadcast':
        return ['networkId', 'broadcastAddress']
      case 'subnet-mask':
      case 'cidr-to-mask':
        return ['subnetMask']
      case 'host-count':
        return ['usableHosts']
      case 'usable-range':
        return ['usableRange']
      case 'mask-to-cidr':
        return ['subnetMask']
      default:
        return ['networkId', 'broadcastAddress', 'blockSize']
    }
  }
  return ['networkId', 'broadcastAddress', 'blockSize', 'subnetMask', 'usableHosts', 'usableRange']
}

export function SubnettingScreen() {
  const [state, setState] = useLocalStorageState<SubnetState>(STORAGE_KEY, DEFAULT_STATE)
  const activeFields = answerFieldsForMode(state)

  const generatePrompt = () => {
    const prompt = generateSubnettingPrompt(defaultSubnetCidrs, state.mode === 'scratching-surface' ? state.weakZone : undefined)
    setState((previous) => ({ ...previous, prompt, answers: {}, feedback: {} }))
  }

  const updateAnswer = (field: AnswerField, value: string) => {
    setState((previous) => ({
      ...previous,
      answers: { ...previous.answers, [field]: value },
    }))
  }

  const validatePrompt = () => {
    if (!state.prompt) return
    const expected: Record<AnswerField, string> = {
      networkId: state.prompt.networkId,
      broadcastAddress: state.prompt.broadcastAddress,
      blockSize: String(state.prompt.blockSize),
      subnetMask: state.prompt.mask,
      usableHosts: String(state.prompt.usableHosts),
      usableRange: state.prompt.usableRange,
    }

    const feedback = activeFields.reduce<Partial<Record<AnswerField, boolean>>>((acc, field) => {
      acc[field] = (state.answers[field] ?? '').trim().toLowerCase() === expected[field].trim().toLowerCase()
      return acc
    }, {})

    const correctCount = Object.values(feedback).filter(Boolean).length
    const bucket = state.mode === 'scratching-surface' ? state.weakZone : state.mode
    const currentStats = state.stats[bucket] ?? { attempts: 0, correct: 0 }

    setState((previous) => ({
      ...previous,
      feedback,
      stats: {
        ...previous.stats,
        [bucket]: {
          attempts: currentStats.attempts + 1,
          correct: currentStats.correct + correctCount,
        },
      },
    }))
  }

  const toggleField = (field: AnswerField) => {
    setState((previous) => {
      const exists = previous.selectedFields.includes(field)
      const selectedFields = exists
        ? previous.selectedFields.filter((item) => item !== field)
        : [...previous.selectedFields, field]
      return { ...previous, selectedFields: selectedFields.length > 0 ? selectedFields : previous.selectedFields }
    })
  }

  const statsRows = useMemo(() => Object.entries(state.stats), [state.stats])

  return (
    <>
      <div className="screen-kicker">Network Math</div>
      <h1 className="screen-title">Subnetting</h1>
      <p className="screen-description">
        Generate live subnet drills, isolate weak zones, or switch into focused field-answer practice. Use the toolbar
        notebook for scratch work and the chart icon for the 7-second reference table.
      </p>

      <div className="subnet-grid">
        <div className="subnet-main-stack">
          <Section
            title="Drill Controls"
            badge="Generated"
            badgeVariant="accent"
            description="Every prompt is generated live and scored locally by mode or weak category."
          >
            <div className="subnet-setup-grid">
              <Dropdown
                label="Mode"
                value={state.mode}
                options={modeOptions}
                onChange={(value) => setState((previous) => ({ ...previous, mode: value as SubnetMode }))}
              />
              <Dropdown
                label="Weak zone"
                value={state.weakZone}
                options={weakZoneOptions}
                onChange={(value) => setState((previous) => ({ ...previous, weakZone: value as SubnettingWeakZoneCategory }))}
                disabled={state.mode !== 'scratching-surface'}
              />
            </div>

            {state.mode === 'fields-only' && (
              <div className="subnet-field-pills">
                {fieldOptions.map((field) => (
                  <button
                    key={field.value}
                    type="button"
                    className={'subnet-mode-pill' + (state.selectedFields.includes(field.value) ? ' subnet-mode-pill--active' : '')}
                    onClick={() => toggleField(field.value)}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            )}

            <div className="subnet-action-row">
              <PrimaryButton onClick={generatePrompt}>Generate Prompt</PrimaryButton>
              <button
                type="button"
                className="exam-nav-button"
                onClick={() => setState((previous) => ({ ...previous, answers: {}, feedback: {} }))}
              >
                Clear Answers
              </button>
            </div>
          </Section>

          {state.prompt && (
            <Section
              title={`${state.prompt.ipAddress} /${state.prompt.cidr}`}
              badge="Live Drill"
              description={`Interesting octet: ${state.prompt.interestingOctetIndex + 1} • Block size: ${state.prompt.blockSize}`}
            >
              <div className="subnet-answer-grid">
                {activeFields.map((field) => {
                  const label = fieldOptions.find((item) => item.value === field)?.label ?? field
                  return (
                    <label key={field} className="subnet-answer-card">
                      <span className="subnet-answer-label">{label}</span>
                      <input
                        value={state.answers[field] ?? ''}
                        onChange={(event) => updateAnswer(field, event.target.value)}
                        className={'subnet-answer-input' + (field in state.feedback ? (state.feedback[field] ? ' subnet-answer-input--correct' : ' subnet-answer-input--wrong') : '')}
                      />
                    </label>
                  )
                })}
              </div>
              <div className="subnet-action-row">
                <button type="button" className="exam-nav-button exam-nav-button--primary" onClick={validatePrompt}>
                  Check Answers
                </button>
              </div>
            </Section>
          )}
        </div>

        <div className="subnet-side-stack">
          <Section
            title="Performance"
            badge="Saved"
            description="Weak-zone stats persist locally so you can revisit problem areas quickly."
          >
            <div className="subnet-stats-list">
              {statsRows.length === 0 ? (
                <p className="subnet-empty">No scored attempts yet.</p>
              ) : statsRows.map(([bucket, stats]) => (
                <div key={bucket} className="subnet-stat-row">
                  <span>{bucket}</span>
                  <span>{stats.correct}/{stats.attempts}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Quick Tools" badge="Toolbar" description="Use the titlebar buttons (top-right) to open the notebook and 7-second chart anywhere in the app.">
            <div className="subnet-tool-hints">
              <div className="subnet-tool-hint">
                <span className="subnet-tool-hint-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 4h11a3 3 0 0 1 3 3v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4z" />
                    <line x1="5" y1="9" x2="19" y2="9" />
                    <line x1="9" y1="2.5" x2="9" y2="21.5" />
                  </svg>
                </span>
                <div>
                  <div className="subnet-tool-hint-title">Notebook</div>
                  <div className="subnet-tool-hint-copy">Sticky scratchpad for octet math and quick notes.</div>
                </div>
              </div>
              <div className="subnet-tool-hint">
                <span className="subnet-tool-hint-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
                    <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
                    <line x1="9.5" y1="3.5" x2="9.5" y2="20.5" />
                    <line x1="15.5" y1="3.5" x2="15.5" y2="20.5" />
                  </svg>
                </span>
                <div>
                  <div className="subnet-tool-hint-title">7-Second Chart</div>
                  <div className="subnet-tool-hint-copy">Mask, networks, and address quick-reference table.</div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </>
  )
}
