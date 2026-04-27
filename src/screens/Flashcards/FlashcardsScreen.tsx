import { useEffect, useMemo } from 'react'
import '../ScreenShell.css'
import './FlashcardsScreen.css'
import { CardFlip } from '../../components/CardFlip'
import { Section } from '../../components/ui/Section'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { Dropdown } from '../../components/ui/Dropdown'
import { Toggle } from '../../components/ui/Toggle'
import { certificationPacks, getCertificationPack } from '../../data/certificationPacks'
import type { CertificationId, FlashcardItem } from '../../data/certificationPacks'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'

type FlashcardRating = 'again' | 'reviewing' | 'known'
type FlashcardMode = 'standard' | 'rapid-review' | 'again-only'

type FlashcardSetup = {
  certification: CertificationId
  deck: string
  shuffle: boolean
  starredOnly: boolean
  mode: FlashcardMode
}

type FlashcardState = {
  phase: 'setup' | 'study' | 'summary'
  setup: FlashcardSetup
  order: string[]
  current: number
  flipped: boolean
  ratings: Record<string, FlashcardRating>
  starred: string[]
}

const STORAGE_KEY = 'study-app-flashcards'

const DEFAULT_STATE: FlashcardState = {
  phase: 'setup',
  setup: {
    certification: 'a-plus',
    deck: 'all',
    shuffle: true,
    starredOnly: false,
    mode: 'standard',
  },
  order: [],
  current: 0,
  flipped: false,
  ratings: {},
  starred: [],
}

function shuffle<T>(items: T[]) {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }
  return next
}

function getFilteredCards(setup: FlashcardSetup) {
  const pack = getCertificationPack(setup.certification)
  return pack.flashcards.cards.filter((card) => setup.deck === 'all' || card.deck === setup.deck)
}

export function FlashcardsScreen() {
  const [state, setState] = useLocalStorageState<FlashcardState>(STORAGE_KEY, DEFAULT_STATE)
  const pack = getCertificationPack(state.setup.certification)
  const baseCards = useMemo(() => getFilteredCards(state.setup), [state.setup])
  const cards = useMemo(() => {
    let next = baseCards
    if (state.setup.starredOnly) next = next.filter((card) => state.starred.includes(card.id))
    if (state.setup.mode === 'again-only') next = next.filter((card) => state.ratings[card.id] === 'again')
    return next
  }, [baseCards, state.setup.starredOnly, state.setup.mode, state.starred, state.ratings])

  const orderedCards = useMemo(() => {
    const source = cards.filter((card) => state.order.includes(card.id))
    if (source.length === cards.length) {
      return state.order.map((id) => cards.find((card) => card.id === id)).filter(Boolean) as FlashcardItem[]
    }
    return cards
  }, [cards, state.order])

  const currentCard = orderedCards[state.current]
  const knownCount = Object.values(state.ratings).filter((value) => value === 'known').length
  const againCount = Object.values(state.ratings).filter((value) => value === 'again').length

  const updateSetup = <K extends keyof FlashcardSetup>(key: K, value: FlashcardSetup[K]) => {
    setState((previous) => ({
      ...previous,
      phase: 'setup',
      current: 0,
      flipped: false,
      setup: { ...previous.setup, [key]: value },
    }))
  }

  const startStudy = () => {
    const nextCards = state.setup.shuffle ? shuffle(cards) : cards
    setState((previous) => ({
      ...previous,
      phase: 'study',
      order: nextCards.map((card) => card.id),
      current: 0,
      flipped: false,
    }))
  }

  const nextCard = () => {
    setState((previous) => {
      const nextIndex = previous.current + 1
      if (nextIndex >= orderedCards.length) {
        return { ...previous, phase: 'summary', flipped: false }
      }
      return { ...previous, current: nextIndex, flipped: false }
    })
  }

  const previousCard = () => {
    setState((previous) => ({ ...previous, current: Math.max(0, previous.current - 1), flipped: false }))
  }

  const toggleStar = () => {
    if (!currentCard) return
    setState((previous) => ({
      ...previous,
      starred: previous.starred.includes(currentCard.id)
        ? previous.starred.filter((id) => id !== currentCard.id)
        : [...previous.starred, currentCard.id],
    }))
  }

  const rateCard = (rating: FlashcardRating) => {
    if (!currentCard) return
    setState((previous) => ({
      ...previous,
      ratings: { ...previous.ratings, [currentCard.id]: rating },
    }))
    nextCard()
  }

  const restart = () => {
    setState((previous) => ({ ...previous, phase: 'setup', current: 0, flipped: false }))
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (state.phase !== 'study') return
      if (event.key === 'ArrowRight') nextCard()
      if (event.key === 'ArrowLeft') previousCard()
      if (event.key === ' ') {
        event.preventDefault()
        setState((previous) => ({ ...previous, flipped: !previous.flipped }))
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  if (state.phase === 'setup') {
    return (
      <div className="flashcards-page">
        <div className="screen-kicker">Recall Loop</div>
        <h1 className="screen-title">Flashcards</h1>
        <p className="screen-description">
          Study term and cloze cards with deck filters, replay modes, and locally persisted mastery states.
        </p>

        <div className="flashcards-grid">
          <Section title="Deck Setup" badge="Live" badgeVariant="accent" description="Choose a pack, shape the review mode, and start a real study run.">
            <div className="flashcards-setup-grid">
              <Dropdown
                label="Certification"
                value={state.setup.certification}
                options={certificationPacks.map((option) => ({ value: option.id, label: `${option.label} • ${option.examCode}` }))}
                onChange={(value) => updateSetup('certification', value as CertificationId)}
              />
              <Dropdown
                label="Deck"
                value={state.setup.deck}
                options={[{ value: 'all', label: 'All decks' }, ...pack.flashcards.decks.map((deck) => ({ value: deck, label: deck }))]}
                onChange={(value) => updateSetup('deck', value)}
              />
              <Dropdown
                label="Mode"
                value={state.setup.mode}
                options={[
                  { value: 'standard', label: 'Standard review' },
                  { value: 'rapid-review', label: 'Rapid review' },
                  { value: 'again-only', label: 'Again only' },
                ]}
                onChange={(value) => updateSetup('mode', value as FlashcardMode)}
              />
              <div className="flashcards-toggle-row">
                <span>Shuffle order</span>
                <Toggle checked={state.setup.shuffle} onChange={(value) => updateSetup('shuffle', value)} aria-label="Shuffle order" />
              </div>
              <div className="flashcards-toggle-row">
                <span>Starred only</span>
                <Toggle checked={state.setup.starredOnly} onChange={(value) => updateSetup('starredOnly', value)} aria-label="Starred only" />
              </div>
            </div>
            <div className="flashcards-start-row">
              <PrimaryButton onClick={startStudy} disabled={cards.length === 0}>Open Review Deck</PrimaryButton>
              <span className="flashcards-meta">{cards.length} cards match the current filters.</span>
            </div>
          </Section>

          <div className="screen-preview-card">
            <div className="screen-panel-header">
              <div>
                <p className="screen-panel-title">Deck Health</p>
                <p className="screen-panel-copy">Local mastery and starring let the deck adapt without needing a full spaced-repetition engine yet.</p>
              </div>
              <span className="screen-panel-tag">Saved</span>
            </div>
            <div className="flashcards-health-grid">
              <div className="screen-stat-card">
                <div className="screen-stat-label">Known</div>
                <div className="screen-stat-value">{knownCount}</div>
                <div className="screen-stat-note">Cards already rated as stable.</div>
              </div>
              <div className="screen-stat-card">
                <div className="screen-stat-label">Again</div>
                <div className="screen-stat-value">{againCount}</div>
                <div className="screen-stat-note">Cards that still need another pass.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (state.phase === 'summary') {
    return (
      <div className="flashcards-page">
        <div className="screen-kicker">Deck Summary</div>
        <h1 className="screen-title">Flashcards</h1>
        <p className="screen-description">Review the deck outcome, then replay weak cards or start a fresh run.</p>

        <div className="flashcards-grid">
          <div className="screen-preview-card flashcards-summary-surface">
            <div className="exam-score-number">{Math.round((knownCount / Math.max(1, Object.keys(state.ratings).length)) * 100)}%</div>
            <div className="exam-score-caption">{knownCount} cards marked known</div>
            <div className="exam-score-meta">{againCount} cards still marked again</div>
            <div className="exam-review-actions">
              <PrimaryButton onClick={() => updateSetup('mode', 'again-only')}>Replay Again Cards</PrimaryButton>
              <button type="button" className="exam-nav-button" onClick={restart}>Back to setup</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flashcards-page">
      <div className="flashcards-study">
      <div className="screen-kicker">Study Deck</div>
      <div className="flashcards-study-header">
        <div>
          <h1 className="screen-title">Flashcards</h1>
          <p className="screen-description">Space flips the card. Arrow keys move through the deck.</p>
        </div>
        <div className="flashcards-study-meta">
          <span>{state.current + 1} / {orderedCards.length}</span>
          <button type="button" className={'flashcards-star' + (currentCard && state.starred.includes(currentCard.id) ? ' flashcards-star--active' : '')} onClick={toggleStar}>
            Star
          </button>
        </div>
      </div>

      <div className="flashcards-study-body">
        <div className="flashcards-card-wrap">
          <CardFlip
            className="flashcards-card-flip"
            flipped={state.flipped}
            onFlip={(flipped) => setState((previous) => ({ ...previous, flipped }))}
            front={
              <div className="flashcards-card-face">
                <div className="flashcards-card-label">{currentCard.type === 'cloze' ? 'Cloze prompt' : currentCard.deck}</div>
                <p className="flashcards-card-copy">{currentCard.front}</p>
                {currentCard.clue && <p className="flashcards-card-hint">Hint: {currentCard.clue}</p>}
              </div>
            }
            back={
              <div className="flashcards-card-face">
                <div className="flashcards-card-label">Answer</div>
                <p className="flashcards-card-copy">{currentCard.back}</p>
                {currentCard.explanation && <p className="flashcards-card-hint">{currentCard.explanation}</p>}
              </div>
            }
          />
        </div>

        <aside className="flashcards-side-stack">
          <Section title="Self rating" badge="Persisted" description="Mastery tags stay on this device between sessions.">
            <div className="flashcards-rating-grid">
              <button type="button" className="flashcards-rating flashcards-rating--again" onClick={() => rateCard('again')}>Again</button>
              <button type="button" className="flashcards-rating flashcards-rating--reviewing" onClick={() => rateCard('reviewing')}>Reviewing</button>
              <button type="button" className="flashcards-rating flashcards-rating--known" onClick={() => rateCard('known')}>Known</button>
            </div>
            <div className="flashcards-deck-nav">
              <button type="button" className="exam-nav-button" onClick={previousCard} disabled={state.current === 0}>Previous</button>
              <button type="button" className="exam-nav-button exam-nav-button--primary" onClick={nextCard}>Next</button>
            </div>
          </Section>
        </aside>
      </div>
      </div>
    </div>
  )
}
