import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '../ScreenShell.css'
import './StudyScreen.css'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { Dropdown } from '../../components/ui/Dropdown'
import { certificationPacks, getCertificationPack } from '../../data/certificationPacks'
import type { CertificationId, FlashcardItem } from '../../data/certificationPacks'

/*
 * Blitz mode: a rapid-fire active-recall round.
 *
 * Memorization technique:
 *   Active Recall (Karpicke & Roediger, 2008) + Leitner-style re-queueing.
 *   Cards you miss come back ~3 cards later, cards you nail are removed
 *   from the queue. That spaced-within-session repetition is what produces
 *   long-term retention, while the per-card timer adds productive pressure
 *   that strengthens the retrieval cue.
 *
 * Game loop:
 *   1. Pick certification + round size.
 *   2. For each card: short timer ticks down, you try to recall the back.
 *   3. Reveal -> self-grade (Got it / Missed).
 *   4. Got it = mastered; Missed = re-queue at index +3 with a small penalty.
 *   5. Done when the queue is empty or you bail out.
 */

type Phase = 'setup' | 'active' | 'complete'

type RoundCard = {
  card: FlashcardItem
  attempts: number
  shownAt: number
}

type RoundResult = {
  card: FlashcardItem
  attempts: number
  hit: boolean
}

const ROUND_SIZES = [10, 20, 30, 50]
const TIMER_OPTIONS: { value: number; label: string }[] = [
  { value: 6, label: 'Sprint — 6s' },
  { value: 8, label: 'Standard — 8s' },
  { value: 12, label: 'Steady — 12s' },
  { value: 0, label: 'No timer' },
]

const RE_QUEUE_OFFSET = 3

function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function pickPool(certification: CertificationId, deck: string | 'all'): FlashcardItem[] {
  const pack = getCertificationPack(certification)
  const cards = pack.flashcards.cards
  if (deck === 'all') return cards
  return cards.filter((card) => card.deck === deck)
}

export function StudyScreen() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [certification, setCertification] = useState<CertificationId>('a-plus')
  const [deck, setDeck] = useState<string | 'all'>('all')
  const [roundSize, setRoundSize] = useState<number>(20)
  const [timerSeconds, setTimerSeconds] = useState<number>(8)

  const [queue, setQueue] = useState<RoundCard[]>([])
  const [revealed, setRevealed] = useState(false)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [mastered, setMastered] = useState(0)
  const [missed, setMissed] = useState(0)
  const [results, setResults] = useState<RoundResult[]>([])
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [roundEndTime, setRoundEndTime] = useState(0)

  const tickRef = useRef<number | null>(null)
  const pack = useMemo(() => getCertificationPack(certification), [certification])
  const decks = pack.flashcards.decks
  const availablePool = useMemo(() => pickPool(certification, deck), [certification, deck])

  const stopTimer = useCallback(() => {
    if (tickRef.current != null) {
      window.clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    if (timerSeconds <= 0) return
    setSecondsLeft(timerSeconds)
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(tickRef.current!)
          tickRef.current = null
          setRevealed(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [stopTimer, timerSeconds])

  useEffect(() => () => stopTimer(), [stopTimer])

  const beginRound = useCallback(() => {
    if (availablePool.length === 0) return
    const targetSize = Math.min(roundSize, availablePool.length)
    const cards = shuffle(availablePool).slice(0, targetSize)
    const initialQueue: RoundCard[] = cards.map((card) => ({ card, attempts: 0, shownAt: 0 }))
    setQueue(initialQueue)
    setRevealed(false)
    setStreak(0)
    setBestStreak(0)
    setMastered(0)
    setMissed(0)
    setResults([])
    setStartTime(Date.now())
    setRoundEndTime(0)
    setPhase('active')
    startTimer()
  }, [availablePool, roundSize, startTimer])

  const reveal = useCallback(() => {
    stopTimer()
    setRevealed(true)
  }, [stopTimer])

  const grade = useCallback((hit: boolean) => {
    setQueue((prev) => {
      if (prev.length === 0) return prev
      const [head, ...rest] = prev
      const attempts = head.attempts + 1
      let nextQueue: RoundCard[]
      if (hit) {
        nextQueue = rest
        setMastered((m) => m + 1)
        setStreak((s) => {
          const next = s + 1
          setBestStreak((best) => Math.max(best, next))
          return next
        })
        setResults((r) => [...r, { card: head.card, attempts, hit: true }])
      } else {
        const reinsertIndex = Math.min(RE_QUEUE_OFFSET, rest.length)
        nextQueue = [
          ...rest.slice(0, reinsertIndex),
          { card: head.card, attempts, shownAt: Date.now() },
          ...rest.slice(reinsertIndex),
        ]
        setMissed((m) => m + 1)
        setStreak(0)
        setResults((r) => [...r, { card: head.card, attempts, hit: false }])
      }
      return nextQueue
    })
    setRevealed(false)
  }, [])

  useEffect(() => {
    if (phase !== 'active') return
    if (queue.length === 0) {
      stopTimer()
      const endId = setTimeout(() => {
        setRoundEndTime(Date.now())
        setPhase('complete')
      }, 0)
      return () => clearTimeout(endId)
    }
    if (!revealed && timerSeconds > 0) {
      const startId = setTimeout(() => {
        startTimer()
      }, 0)
      return () => clearTimeout(startId)
    }
  }, [queue.length, phase, revealed, timerSeconds, startTimer, stopTimer])

  const exitToSetup = useCallback(() => {
    stopTimer()
    setPhase('setup')
    setQueue([])
    setRevealed(false)
    setResults([])
    setRoundEndTime(0)
  }, [stopTimer])

  if (phase === 'setup') {
    return (
      <>
        <div className="screen-kicker">
          <span className="blitz-bolt" aria-hidden>
            <BoltIcon />
          </span>
          Active Recall · Leitner Spacing
        </div>
        <h1 className="screen-title">Blitz</h1>
        <p className="screen-description">
          A rapid-fire memorization round built on two evidence-backed techniques: <em>active recall</em>
          (forcing retrieval is what burns memory in) and the <em>Leitner system</em> (cards you miss
          come back sooner; cards you nail rest). Pick a certification, set the pace, and go.
        </p>

        <div className="blitz-grid">
          <Section
            title="Round setup"
            badge="Configure"
            badgeVariant="accent"
            description="Choose what you want to drill and how fast you want to be pushed."
          >
            <div className="blitz-setup-grid">
              <Dropdown
                label="Certification"
                value={certification}
                options={certificationPacks.map((pack) => ({ value: pack.id, label: `${pack.label} • ${pack.examCode}` }))}
                onChange={(value) => {
                  setCertification(value as CertificationId)
                  setDeck('all')
                }}
              />
              <Dropdown
                label="Deck"
                value={deck}
                options={[{ value: 'all', label: 'All decks' }, ...decks.map((name) => ({ value: name, label: name }))]}
                onChange={(value) => setDeck(value)}
              />
              <Dropdown
                label="Per-card timer"
                value={String(timerSeconds)}
                options={TIMER_OPTIONS.map((opt) => ({ value: String(opt.value), label: opt.label }))}
                onChange={(value) => setTimerSeconds(Number(value))}
              />
              <div className="blitz-round-size">
                <span className="blitz-row-label">Round size</span>
                <div className="blitz-pill-row">
                  {ROUND_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={'blitz-pill' + (roundSize === size ? ' blitz-pill--active' : '')}
                      onClick={() => setRoundSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="blitz-action-row">
              <PrimaryButton onClick={beginRound} disabled={availablePool.length === 0}>
                <span className="blitz-bolt" aria-hidden><BoltIcon /></span>
                Start Blitz
              </PrimaryButton>
              <span className="blitz-pool-meta">{availablePool.length} cards available in this pool.</span>
            </div>
          </Section>

          <div className="screen-preview-card blitz-method-card">
            <div className="screen-panel-header">
              <div>
                <p className="screen-panel-title">How Blitz works</p>
                <p className="screen-panel-copy">Two stacked techniques chosen for measurable retention gains.</p>
              </div>
              <span className="screen-panel-tag">Method</span>
            </div>
            <ul className="blitz-method-list">
              <li>
                <strong>Active recall.</strong> The timer forces you to <em>retrieve</em> the answer
                before reveal. Retrieval practice produces stronger long-term memory than re-reading
                — Karpicke &amp; Roediger, 2008.
              </li>
              <li>
                <strong>Leitner spacing.</strong> A miss re-queues that card 3 positions later so you
                hit it again under fresh context. Right answers are removed from the round so you
                spend energy on the cards that need it.
              </li>
              <li>
                <strong>Streak feedback.</strong> A live streak counter rewards consecutive hits and
                resets on a miss, mirroring the study-app patterns shown to keep self-testing engaging.
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }

  if (phase === 'active') {
    const total = queue.length + results.filter((r) => r.hit).length
    const cardEntry = queue[0]
    if (!cardEntry) return null
    const progress = total === 0 ? 0 : (results.filter((r) => r.hit).length / total) * 100
    const card = cardEntry.card
    const timerActive = timerSeconds > 0 && !revealed
    const timerRatio = timerSeconds > 0 ? secondsLeft / timerSeconds : 0

    return (
      <>
        <div className="blitz-active-header">
          <div>
            <div className="screen-kicker">
              <span className="blitz-bolt" aria-hidden><BoltIcon /></span>
              Blitz Round
            </div>
            <h1 className="screen-title">{pack.label}</h1>
          </div>
          <div className="blitz-hud">
            <div className="blitz-hud-card">
              <span className="blitz-hud-label">Streak</span>
              <span className="blitz-hud-value">{streak}</span>
              <span className="blitz-hud-meta">best {bestStreak}</span>
            </div>
            <div className="blitz-hud-card">
              <span className="blitz-hud-label">Mastered</span>
              <span className="blitz-hud-value">{mastered}</span>
              <span className="blitz-hud-meta">missed {missed}</span>
            </div>
            <div className="blitz-hud-card">
              <span className="blitz-hud-label">Queue</span>
              <span className="blitz-hud-value">{queue.length}</span>
              <span className="blitz-hud-meta">remaining</span>
            </div>
          </div>
        </div>

        <div className="blitz-progress-line">
          <div className="blitz-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {timerActive && (
          <div className="blitz-timer-line" aria-hidden>
            <div
              className="blitz-timer-fill"
              style={{ transform: `scaleX(${Math.max(0, Math.min(1, timerRatio))})` }}
            />
            <span className="blitz-timer-label">{secondsLeft}s</span>
          </div>
        )}

        <div className={'blitz-card' + (revealed ? ' blitz-card--revealed' : '')}>
          <div className="blitz-card-meta">
            <span className="blitz-card-deck">{card.deck}</span>
            <span className="blitz-card-topic">{card.topic}</span>
            {card.type === 'cloze' && <span className="blitz-card-tag">Cloze</span>}
            {cardEntry.attempts > 0 && <span className="blitz-card-tag blitz-card-tag--retry">Retry</span>}
          </div>
          <p className="blitz-card-front">{card.front}</p>
          {card.clue && <p className="blitz-card-clue">Hint: {card.clue}</p>}
          {revealed ? (
            <div className="blitz-card-back-wrap">
              <div className="blitz-card-divider" />
              <p className="blitz-card-back">{card.back}</p>
              {card.explanation && <p className="blitz-card-explanation">{card.explanation}</p>}
            </div>
          ) : (
            <p className="blitz-card-prompt">Try to recall the answer in your head, then reveal.</p>
          )}
        </div>

        <div className="blitz-action-row">
          {!revealed ? (
            <PrimaryButton onClick={reveal}>Reveal answer</PrimaryButton>
          ) : (
            <>
              <button type="button" className="blitz-action blitz-action--miss" onClick={() => grade(false)}>
                <span aria-hidden>✗</span> Missed it
              </button>
              <button type="button" className="blitz-action blitz-action--hit" onClick={() => grade(true)}>
                <span aria-hidden>⚡</span> Got it
              </button>
            </>
          )}
          <button type="button" className="exam-nav-button blitz-bail" onClick={exitToSetup}>
            End round
          </button>
        </div>
      </>
    )
  }

  const elapsedSeconds =
    roundEndTime > 0 && startTime > 0
      ? Math.max(1, Math.round((roundEndTime - startTime) / 1000))
      : 0
  const totalAnswered = mastered + missed
  const accuracy = totalAnswered === 0 ? 0 : Math.round((mastered / totalAnswered) * 100)

  return (
    <>
      <div className="screen-kicker">
        <span className="blitz-bolt" aria-hidden><BoltIcon /></span>
        Round complete
      </div>
      <h1 className="screen-title">Blitz · Results</h1>
      <p className="screen-description">
        Cards you missed have already been re-shown until you locked them in. The stats below are the
        version of the round that mattered: cards mastered through retrieval, not just seen.
      </p>

      <div className="blitz-grid">
        <div className="screen-preview-card blitz-result-card">
          <div className="blitz-result-stat">
            <span className="blitz-result-value">{mastered}</span>
            <span className="blitz-result-label">Mastered</span>
          </div>
          <div className="blitz-result-stat">
            <span className="blitz-result-value">{accuracy}%</span>
            <span className="blitz-result-label">First-try accuracy</span>
          </div>
          <div className="blitz-result-stat">
            <span className="blitz-result-value">{bestStreak}</span>
            <span className="blitz-result-label">Best streak</span>
          </div>
          <div className="blitz-result-stat">
            <span className="blitz-result-value">{Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}</span>
            <span className="blitz-result-label">Elapsed</span>
          </div>
          <div className="blitz-result-actions">
            <PrimaryButton onClick={beginRound}>Run it again</PrimaryButton>
            <button type="button" className="exam-nav-button" onClick={exitToSetup}>New round</button>
          </div>
        </div>

        <Section
          title="What you saw"
          badge="Recap"
          description="Every card from the round, marked with whether you cleared it on the first attempt."
        >
          <div className="blitz-recap-list">
            {results.map((r, i) => (
              <div key={`${r.card.id}-${i}`} className={'blitz-recap-card' + (r.hit && r.attempts === 1 ? ' blitz-recap-card--first' : r.hit ? ' blitz-recap-card--retry' : ' blitz-recap-card--miss')}>
                <div className="blitz-recap-front">{r.card.front}</div>
                <div className="blitz-recap-back">{r.card.back}</div>
                <div className="blitz-recap-meta">
                  {r.hit ? (r.attempts === 1 ? 'First try' : `Got it on attempt ${r.attempts}`) : 'Still queued'}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  )
}

function BoltIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  )
}
