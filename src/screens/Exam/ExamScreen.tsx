import { useCallback, useEffect, useMemo } from 'react'
import '../ScreenShell.css'
import './ExamScreen.css'
import { certificationPacks, getCertificationPack } from '../../data/certificationPacks'
import type { CertificationId, DifficultyLevel, ExamQuestion } from '../../data/certificationPacks'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { Slider } from '../../components/ui/Slider'
import { Dropdown } from '../../components/ui/Dropdown'
import { useAppContext } from '../../context/useAppContext'

type ExamMode = 'practice' | 'timed' | 'weak-areas'

type ExamSetup = {
  certification: CertificationId
  difficulty: DifficultyLevel | 'all'
  domain: string
  topic: string
  questionCount: number
  timerMinutes: number
  mode: ExamMode
}

type ActiveExamSession = {
  phase: 'active'
  setup: ExamSetup
  questions: ExamQuestion[]
  current: number
  answers: Record<string, string>
  flagged: string[]
  elapsedSeconds: number
  paused: boolean
}

type ReviewExamSession = {
  phase: 'review'
  setup: ExamSetup
  questions: ExamQuestion[]
  answers: Record<string, string>
  flagged: string[]
  score: number
  elapsedSeconds: number
}

type ExamSession = { phase: 'setup'; setup: ExamSetup } | ActiveExamSession | ReviewExamSession

const DEFAULT_SETUP: ExamSetup = {
  certification: 'a-plus',
  difficulty: 'all',
  domain: 'all',
  topic: 'all',
  questionCount: 20,
  timerMinutes: 45,
  mode: 'timed',
}

const STORAGE_KEY = 'study-app-exam-session'

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function getFilteredQuestions(setup: ExamSetup) {
  const pack = getCertificationPack(setup.certification)
  return pack.exam.questions.filter((question) => {
    if (setup.difficulty !== 'all' && question.difficulty !== setup.difficulty) return false
    if (setup.domain !== 'all' && question.domain !== setup.domain) return false
    if (setup.topic !== 'all' && question.topic !== setup.topic) return false
    return true
  })
}

function createSession(setup: ExamSetup): ActiveExamSession {
  const filtered = getFilteredQuestions(setup)
  let selectedQuestions = shuffle(filtered).slice(0, Math.min(setup.questionCount, filtered.length))
  if (setup.certification === 'ccst-it-support' && filtered.length > 0 && selectedQuestions.length < setup.questionCount) {
    const expanded: ExamQuestion[] = []
    while (expanded.length < setup.questionCount) {
      expanded.push(
        ...shuffle(filtered).map((question, index) => ({
          ...question,
          id: `${question.id}--ccst-repeat-${expanded.length + index}`,
        })),
      )
    }
    selectedQuestions = expanded.slice(0, setup.questionCount)
  }
  return {
    phase: 'active',
    setup,
    questions: selectedQuestions,
    current: 0,
    answers: {},
    flagged: [],
    elapsedSeconds: 0,
    paused: false,
  }
}

export function ExamScreen() {
  const { activeCertification, setActiveCertification } = useAppContext()
  const [session, setSession] = useLocalStorageState<ExamSession>(STORAGE_KEY, {
    phase: 'setup',
    setup: DEFAULT_SETUP,
  })

  const setup = session.setup
  const isCcstMode = activeCertification === 'ccst-it-support'
  const pack = getCertificationPack(setup.certification)
  const filteredQuestions = useMemo(() => getFilteredQuestions(setup), [setup])
  const availableQuestions = filteredQuestions.length
  const questionSliderMin = isCcstMode ? 42 : 5
  const questionSliderMax = isCcstMode ? 50 : Math.max(5, availableQuestions || 5)
  const questionSliderValue = Math.min(Math.max(setup.questionCount, questionSliderMin), questionSliderMax)
  const isActivePaused = session.phase === 'active' ? session.paused : false
  const remainingSeconds = session.phase === 'active'
    ? Math.max(0, session.setup.timerMinutes * 60 - session.elapsedSeconds)
    : 0

  useEffect(() => {
    if (session.phase !== 'active' || isActivePaused || session.setup.mode === 'practice') return
    const interval = window.setInterval(() => {
      setSession((previous) => {
        if (previous.phase !== 'active' || previous.paused) return previous
        const elapsedSeconds = previous.elapsedSeconds + 1
        if (elapsedSeconds >= previous.setup.timerMinutes * 60) {
          const score = previous.questions.reduce((total, question) => (
            total + (previous.answers[question.id] === question.answer ? 1 : 0)
          ), 0)
          return {
            phase: 'review',
            setup: previous.setup,
            questions: previous.questions,
            answers: previous.answers,
            flagged: previous.flagged,
            score,
            elapsedSeconds,
          }
        }
        return { ...previous, elapsedSeconds }
      })
    }, 1000)
    return () => window.clearInterval(interval)
  }, [session.phase, isActivePaused, session.setup.mode, session.setup.timerMinutes, setSession])

  useEffect(() => {
    if (!activeCertification) return
    setSession((previous) => {
      if (previous.phase !== 'setup') return previous
      const nextSetup: ExamSetup = {
        ...previous.setup,
        certification: activeCertification,
        ...(activeCertification === 'ccst-it-support'
          ? {
              mode: 'timed' as ExamMode,
              timerMinutes: 50,
              questionCount: Math.min(50, Math.max(42, previous.setup.questionCount)),
              domain: 'all',
              topic: 'all',
              difficulty: 'all' as DifficultyLevel | 'all',
            }
          : {}),
      }
      return JSON.stringify(nextSetup) === JSON.stringify(previous.setup) ? previous : { phase: 'setup', setup: nextSetup }
    })
  }, [activeCertification, setSession])

  const updateSetup = useCallback(<K extends keyof ExamSetup>(key: K, value: ExamSetup[K]) => {
    if (key === 'certification') setActiveCertification(value as CertificationId)
    setSession((previous) => ({ phase: 'setup', setup: { ...previous.setup, [key]: value } }))
  }, [setActiveCertification, setSession])

  const startExam = useCallback(() => {
    setSession((previous) => createSession(previous.setup))
  }, [setSession])

  const selectAnswer = useCallback((questionId: string, answer: string) => {
    setSession((previous) => previous.phase === 'active'
      ? { ...previous, answers: { ...previous.answers, [questionId]: answer } }
      : previous)
  }, [setSession])

  const toggleFlag = useCallback(() => {
    setSession((previous) => {
      if (previous.phase !== 'active') return previous
      const currentQuestionId = previous.questions[previous.current]?.id
      if (!currentQuestionId) return previous
      const flagged = previous.flagged.includes(currentQuestionId)
        ? previous.flagged.filter((id) => id !== currentQuestionId)
        : [...previous.flagged, currentQuestionId]
      return { ...previous, flagged }
    })
  }, [setSession])

  const goToQuestion = useCallback((index: number) => {
    setSession((previous) => previous.phase === 'active'
      ? { ...previous, current: Math.max(0, Math.min(previous.questions.length - 1, index)) }
      : previous)
  }, [setSession])

  const submitExam = useCallback(() => {
    setSession((previous) => {
      if (previous.phase !== 'active') return previous
      const score = previous.questions.reduce((total, question) => (
        total + (previous.answers[question.id] === question.answer ? 1 : 0)
      ), 0)
      return {
        phase: 'review',
        setup: previous.setup,
        questions: previous.questions,
        answers: previous.answers,
        flagged: previous.flagged,
        score,
        elapsedSeconds: previous.elapsedSeconds,
      }
    })
  }, [setSession])

  const retryMissed = useCallback(() => {
    setSession((previous) => {
      if (previous.phase !== 'review') return previous
      const missed = previous.questions.filter((question) => previous.answers[question.id] !== question.answer)
      return {
        phase: 'active',
        setup: { ...previous.setup, mode: 'practice' },
        questions: missed.length > 0 ? missed : previous.questions,
        current: 0,
        answers: {},
        flagged: [],
        elapsedSeconds: 0,
        paused: false,
      }
    })
  }, [setSession])

  const resetToSetup = useCallback(() => {
    setSession((previous) => ({ phase: 'setup', setup: previous.setup }))
  }, [setSession])

  const togglePause = useCallback(() => {
    setSession((previous) => previous.phase === 'active'
      ? { ...previous, paused: !previous.paused }
      : previous)
  }, [setSession])

  const domainScores = useMemo(() => {
    if (session.phase !== 'review') return []
    const byDomain = session.questions.reduce<Record<string, { total: number; correct: number }>>((acc, question) => {
      const bucket = acc[question.domain] ?? { total: 0, correct: 0 }
      bucket.total += 1
      if (session.answers[question.id] === question.answer) bucket.correct += 1
      acc[question.domain] = bucket
      return acc
    }, {})
    return Object.entries(byDomain)
  }, [session])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (session.phase !== 'active') return
      if (event.key >= '1' && event.key <= '4') {
        const question = session.questions[session.current]
        const option = question.options[Number(event.key) - 1]
        if (option) selectAnswer(question.id, option.key)
      }
      if (event.key.toLowerCase() === 'f') toggleFlag()
      if (event.key === 'ArrowRight') goToQuestion(session.current + 1)
      if (event.key === 'ArrowLeft') goToQuestion(session.current - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [session, selectAnswer, toggleFlag, goToQuestion])

  if (session.phase === 'setup') {
    return (
      <>
        <div className="screen-kicker">Certification Exam Prep</div>
        <h1 className="screen-title">Exam Prep</h1>
        <p className="screen-description">
          Build a timed or practice-focused session with real topic filters, question counts, and persisted setup state.
        </p>

        <div className="exam-shell-grid">
          <div className="exam-shell-stack">
            <Section
              title="Session Setup"
              badge="Ready"
              badgeVariant="accent"
              description="Every exam tab now runs from a real multi-cert question bank with setup state stored locally."
            >
              <div className="exam-setup-grid">
                {!isCcstMode && (
                  <Dropdown
                    label="Certification"
                    value={setup.certification}
                    options={certificationPacks.map((option) => ({ value: option.id, label: `${option.label} • ${option.examCode}` }))}
                    onChange={(value) => updateSetup('certification', value as CertificationId)}
                  />
                )}
                <Dropdown
                  label="Mode"
                  value={setup.mode}
                  options={[
                    { value: 'timed', label: 'Timed exam' },
                    { value: 'practice', label: 'Practice mode' },
                    { value: 'weak-areas', label: 'Weak areas' },
                  ]}
                  onChange={(value) => updateSetup('mode', value as ExamMode)}
                />
                <Dropdown
                  label="Difficulty"
                  value={setup.difficulty}
                  options={[
                    { value: 'all', label: 'All difficulties' },
                    { value: 'easy', label: 'Easy' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                  onChange={(value) => updateSetup('difficulty', value as DifficultyLevel | 'all')}
                />
                <Dropdown
                  label="Domain"
                  value={setup.domain}
                  options={[{ value: 'all', label: 'All domains' }, ...pack.exam.domains.map((domain) => ({ value: domain, label: domain }))]}
                  onChange={(value) => updateSetup('domain', value)}
                />
                <Dropdown
                  label="Topic"
                  value={setup.topic}
                  options={[{ value: 'all', label: 'All topics' }, ...pack.exam.topics.map((topic) => ({ value: topic, label: topic }))]}
                  onChange={(value) => updateSetup('topic', value)}
                />
                <div className="exam-timer-presets">
                  <span className="exam-inline-label">Timer presets</span>
                  {(isCcstMode ? [50] : [15, 30, 45, 60, 90]).map((minutes) => (
                    <button
                      key={minutes}
                      type="button"
                      className={'exam-pill-button' + (setup.timerMinutes === minutes ? ' exam-pill-button--active' : '')}
                      onClick={() => updateSetup('timerMinutes', minutes)}
                    >
                      {minutes}m
                    </button>
                  ))}
                </div>
                <Slider
                  label="Question count"
                  value={questionSliderValue}
                  min={questionSliderMin}
                  max={questionSliderMax}
                  step={1}
                  onChange={(value) => updateSetup('questionCount', value)}
                  valueLabel={isCcstMode ? `${questionSliderValue} / 42-50` : `${Math.min(setup.questionCount, availableQuestions || 5)} / ${availableQuestions}`}
                />
                <Slider
                  label="Timer minutes"
                  value={setup.timerMinutes}
                  min={isCcstMode ? 50 : 5}
                  max={isCcstMode ? 50 : 120}
                  step={5}
                  onChange={(value) => updateSetup('timerMinutes', value)}
                  valueLabel={`${setup.timerMinutes} min`}
                  disabled={setup.mode === 'practice' || isCcstMode}
                />
              </div>

              <div className="exam-setup-actions">
                <PrimaryButton onClick={startExam} disabled={availableQuestions === 0}>
                  Start {setup.mode === 'practice' ? 'Practice Session' : 'Exam Session'}
                </PrimaryButton>
                <span className="exam-supporting-text">
                  {isCcstMode
                    ? `${availableQuestions} source questions rotate into a 42-50 question, 50-minute CCST-style run.`
                    : `${availableQuestions} questions available with the current filters.`}
                </span>
              </div>
            </Section>
          </div>

          <div className="exam-shell-stack">
            <div className="screen-preview-card">
              <div className="screen-panel-header">
                <div>
                  <p className="screen-panel-title">Session Snapshot</p>
                  <p className="screen-panel-copy">Quick view of what the exam engine will assemble from the current pack.</p>
                </div>
                <span className="screen-panel-tag">Live</span>
              </div>
              <div className="exam-summary-grid">
                <div className="screen-stat-card">
                  <div className="screen-stat-label">Certification</div>
                  <div className="screen-stat-value">{pack.label}</div>
                  <div className="screen-stat-note">{pack.examCode}</div>
                </div>
                <div className="screen-stat-card">
                  <div className="screen-stat-label">Domains</div>
                  <div className="screen-stat-value">{pack.exam.domains.length}</div>
                  <div className="screen-stat-note">Current pack coverage in this build.</div>
                </div>
                <div className="screen-stat-card">
                  <div className="screen-stat-label">Topics</div>
                  <div className="screen-stat-value">{pack.exam.topics.length}</div>
                  <div className="screen-stat-note">Available topics for filtered exams.</div>
                </div>
                <div className="screen-stat-card">
                  <div className="screen-stat-label">Suggested run</div>
                  <div className="screen-stat-value">{setup.mode === 'weak-areas' ? 'Targeted' : 'Balanced'}</div>
                  <div className="screen-stat-note">Mode adapts flow without changing the shell language.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (session.phase === 'active') {
    const question = session.questions[session.current]
    const selected = session.answers[question.id]
    const answeredCount = Object.keys(session.answers).length

    return (
      <>
        <div className="screen-kicker">Active Session</div>
        <div className="exam-active-header">
          <div>
            <h1 className="screen-title">Exam Prep</h1>
            <p className="screen-description">Keyboard shortcuts: `1-4` answer, `F` flag, arrow keys navigate.</p>
          </div>
          <div className="exam-session-metrics">
            <div className="exam-metric-card">
              <span className="exam-metric-label">Timer</span>
              <span className="exam-metric-value">{session.setup.mode === 'practice' ? formatSeconds(session.elapsedSeconds) : formatSeconds(remainingSeconds)}</span>
            </div>
            <div className="exam-metric-card">
              <span className="exam-metric-label">Answered</span>
              <span className="exam-metric-value">{answeredCount}/{session.questions.length}</span>
            </div>
          </div>
        </div>

        <div className="exam-live-shell">
          <div className="exam-live-main">
            <div className="exam-progress-line">
              <div className="exam-progress-fill" style={{ width: `${((session.current + 1) / session.questions.length) * 100}%` }} />
            </div>

            <Section title={`Question ${session.current + 1} of ${session.questions.length}`} badge={question.domain} description={question.topic}>
              <div className="exam-question-panel">
                <p className="exam-question-prompt">{question.prompt}</p>
                <div className="exam-answer-grid">
                  {question.options.map((option, index) => (
                    <button
                      key={option.key}
                      type="button"
                      className={'exam-answer-card' + (selected === option.key ? ' exam-answer-card--active' : '')}
                      onClick={() => selectAnswer(question.id, option.key)}
                    >
                      <span className="exam-answer-index">{index + 1}</span>
                      <span className="exam-answer-copy">{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            <div className="exam-session-actions">
              <button type="button" className="exam-nav-button" onClick={() => goToQuestion(session.current - 1)} disabled={session.current === 0}>Previous</button>
              <button type="button" className="exam-nav-button" onClick={toggleFlag}>{session.flagged.includes(question.id) ? 'Unflag' : 'Flag'} Question</button>
              <button type="button" className="exam-nav-button" onClick={togglePause}>{session.paused ? 'Resume' : 'Pause'}</button>
              {session.current < session.questions.length - 1 ? (
                <button type="button" className="exam-nav-button exam-nav-button--primary" onClick={() => goToQuestion(session.current + 1)}>Next</button>
              ) : (
                <button type="button" className="exam-nav-button exam-nav-button--submit" onClick={submitExam}>Submit Exam</button>
              )}
            </div>
          </div>

          <div className="exam-live-sidebar">
            <div className="screen-panel">
              <div className="screen-panel-header">
                <div>
                  <p className="screen-panel-title">Question Map</p>
                  <p className="screen-panel-copy">Jump to any question, track flagged items, and finish with confidence.</p>
                </div>
              </div>
              <div className="exam-question-map">
                {session.questions.map((item, index) => {
                  const answered = Boolean(session.answers[item.id])
                  const flagged = session.flagged.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={'exam-map-dot' + (index === session.current ? ' exam-map-dot--current' : '') + (answered ? ' exam-map-dot--answered' : '') + (flagged ? ' exam-map-dot--flagged' : '')}
                      onClick={() => goToQuestion(index)}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const percent = Math.round((session.score / session.questions.length) * 100)

  return (
    <>
      <div className="screen-kicker">Review Complete</div>
      <h1 className="screen-title">Exam Review</h1>
      <p className="screen-description">Score breakdown, domain trends, flagged question review, and one-click retry for missed material.</p>

      <div className="exam-review-grid">
        <div className="screen-preview-card exam-score-surface">
          <div className="exam-score-number">{percent}%</div>
          <div className="exam-score-caption">{session.score} of {session.questions.length} correct</div>
          <div className="exam-score-meta">{session.setup.mode === 'practice' ? 'Practice review' : `Completed in ${formatSeconds(session.elapsedSeconds)}`}</div>
          <div className="exam-review-actions">
            <PrimaryButton onClick={retryMissed}>Retry Missed</PrimaryButton>
            <button type="button" className="exam-nav-button" onClick={resetToSetup}>New Session</button>
          </div>
        </div>

        <div className="exam-shell-stack">
          <Section title="Domain Breakdown" badge="Insights" description="See which parts of the pack are already stable and which ones need another pass.">
            <div className="exam-domain-breakdown">
              {domainScores.map(([domain, stats]) => (
                <div key={domain} className="exam-domain-row">
                  <span>{domain}</span>
                  <span>{stats.correct}/{stats.total}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      <Section title="Question Review" badge="Detailed" description="Every answer keeps its explanation and correctness state for immediate study feedback.">
        <div className="exam-review-list">
          {session.questions.map((question, index) => {
            const correct = session.answers[question.id] === question.answer
            return (
              <article key={question.id} className={'exam-review-card' + (correct ? ' exam-review-card--correct' : ' exam-review-card--wrong')}>
                <div className="exam-review-topline">
                  <span className="exam-review-order">Q{index + 1}</span>
                  <span className="exam-review-domain">{question.domain}</span>
                </div>
                <p className="exam-review-prompt">{question.prompt}</p>
                <div className="exam-review-tags">
                  <span className={'exam-review-tag' + (correct ? ' exam-review-tag--correct' : ' exam-review-tag--wrong')}>Your answer: {session.answers[question.id] ?? 'Skipped'}</span>
                  {!correct && <span className="exam-review-tag exam-review-tag--correct">Correct: {question.answer}</span>}
                  {session.flagged.includes(question.id) && <span className="exam-review-tag">Flagged</span>}
                </div>
                <p className="exam-review-explanation">{question.explanation}</p>
              </article>
            )
          })}
        </div>
      </Section>
    </>
  )
}
