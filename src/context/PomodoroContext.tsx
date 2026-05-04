/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect -- provider also shares timer helpers used by overlays/screens */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { playRinger, RINGER_OPTIONS } from '../screens/Pomodoro/pomodoroSounds'
import type { RingerSound } from '../screens/Pomodoro/pomodoroSounds'
import {
  defaultStats,
  loadStats,
  persistStats,
  recordSession,
} from '../screens/Pomodoro/pomodoroStats'

export type PomodoroMode = 'pomodoro' | 'stopwatch'
export type PomodoroPhase = 'work' | 'short-break' | 'long-break'

export type PomodoroSettings = {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  cyclesBeforeLongBreak: number
  autoCycle: boolean
  ringer: RingerSound
  volume: number
}

const SETTINGS_KEY = 'comptia-study-pomodoro-settings'

export const defaultPomoSettings: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
  autoCycle: true,
  ringer: 'chime',
  volume: 60,
}

function loadPomoSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultPomoSettings
    return { ...defaultPomoSettings, ...JSON.parse(raw) }
  } catch {
    return defaultPomoSettings
  }
}

function savePomoSettings(s: PomodoroSettings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch { /* noop */ }
}

export function formatClock(totalSeconds: number): string {
  const t = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function phaseDuration(phase: PomodoroPhase, s: PomodoroSettings): number {
  if (phase === 'work') return s.workMinutes * 60
  if (phase === 'short-break') return s.shortBreakMinutes * 60
  return s.longBreakMinutes * 60
}

export function phaseLabel(phase: PomodoroPhase): string {
  if (phase === 'work') return 'Focus'
  if (phase === 'short-break') return 'Short Break'
  return 'Long Break'
}

type PomodoroContextValue = {
  mode: PomodoroMode
  setMode: (mode: PomodoroMode) => void
  settings: PomodoroSettings
  updateSetting: <K extends keyof PomodoroSettings>(key: K, value: PomodoroSettings[K]) => void
  stats: ReturnType<typeof loadStats>
  resetStats: () => void
  phase: PomodoroPhase
  completedWorkCycles: number
  secondsLeft: number
  running: boolean
  stopwatchSeconds: number
  stopwatchRunning: boolean
  totalDuration: number
  progress: number
  dashOffset: number
  startPause: () => void
  reset: () => void
  skip: () => void
  startPauseSW: () => void
  resetSW: () => void
  previewRinger: () => void
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null)

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PomodoroMode>('pomodoro')
  const [settings, setSettings] = useState<PomodoroSettings>(() => loadPomoSettings())
  const [stats, setStats] = useState(() => loadStats())
  const [phase, setPhase] = useState<PomodoroPhase>('work')
  const [completedWorkCycles, setCompletedWorkCycles] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(() => settings.workMinutes * 60)
  const [running, setRunning] = useState(false)
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
  const [stopwatchRunning, setStopwatchRunning] = useState(false)

  const tickRef = useRef<number | null>(null)
  const swRef = useRef<number | null>(null)
  const lastSettingsRef = useRef(settings)
  const phaseRef = useRef(phase)
  const settingsRef = useRef(settings)
  const secondsLeftRef = useRef(secondsLeft)
  const completedWorkCyclesRef = useRef(completedWorkCycles)

  useEffect(() => { savePomoSettings(settings) }, [settings])
  useEffect(() => { persistStats(stats) }, [stats])
  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { settingsRef.current = settings }, [settings])
  useEffect(() => { secondsLeftRef.current = secondsLeft }, [secondsLeft])
  useEffect(() => { completedWorkCyclesRef.current = completedWorkCycles }, [completedWorkCycles])

  useEffect(() => {
    if (running) return
    if (lastSettingsRef.current.workMinutes !== settings.workMinutes && phase === 'work') {
      setSecondsLeft(settings.workMinutes * 60)
    } else if (lastSettingsRef.current.shortBreakMinutes !== settings.shortBreakMinutes && phase === 'short-break') {
      setSecondsLeft(settings.shortBreakMinutes * 60)
    } else if (lastSettingsRef.current.longBreakMinutes !== settings.longBreakMinutes && phase === 'long-break') {
      setSecondsLeft(settings.longBreakMinutes * 60)
    }
    lastSettingsRef.current = settings
  }, [settings, phase, running])

  const completeBreakPhase = useCallback(() => {
    const s = settingsRef.current
    setRunning(false)
    playRinger(s.ringer, s.volume / 100)
    setPhase('work')
    setSecondsLeft(phaseDuration('work', s))
    if (s.autoCycle) setRunning(true)
  }, [])

  const completeWorkPhase = useCallback((focusCreditSeconds: number | null) => {
    const s = settingsRef.current
    setRunning(false)
    playRinger(s.ringer, s.volume / 100)
    if (focusCreditSeconds !== null && focusCreditSeconds > 0) {
      setStats((prev) => recordSession(prev, focusCreditSeconds))
    }
    const newCount = completedWorkCyclesRef.current + 1
    setCompletedWorkCycles(newCount)
    const nextPhase: PomodoroPhase =
      newCount % s.cyclesBeforeLongBreak === 0 ? 'long-break' : 'short-break'
    setPhase(nextPhase)
    setSecondsLeft(phaseDuration(nextPhase, s))
    if (s.autoCycle) setRunning(true)
  }, [])

  const handlePhaseComplete = useCallback(() => {
    const s = settingsRef.current
    if (phaseRef.current === 'work') {
      completeWorkPhase(s.workMinutes * 60)
    } else {
      completeBreakPhase()
    }
  }, [completeBreakPhase, completeWorkPhase])

  useEffect(() => {
    if (!running) {
      if (tickRef.current != null) {
        window.clearInterval(tickRef.current)
        tickRef.current = null
      }
      return
    }
    tickRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.setTimeout(() => handlePhaseComplete(), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (tickRef.current != null) window.clearInterval(tickRef.current)
      tickRef.current = null
    }
  }, [running, handlePhaseComplete])

  useEffect(() => {
    if (!stopwatchRunning) {
      if (swRef.current != null) {
        window.clearInterval(swRef.current)
        swRef.current = null
      }
      return
    }
    swRef.current = window.setInterval(() => {
      setStopwatchSeconds((p) => p + 1)
    }, 1000)
    return () => {
      if (swRef.current != null) window.clearInterval(swRef.current)
      swRef.current = null
    }
  }, [stopwatchRunning])

  const skip = useCallback(() => {
    const s = settingsRef.current
    if (phaseRef.current === 'work') {
      const total = phaseDuration('work', s)
      const inFinalTenPercent = secondsLeftRef.current <= total * 0.1
      const creditSeconds = inFinalTenPercent ? s.workMinutes * 60 : null
      completeWorkPhase(creditSeconds)
    } else {
      completeBreakPhase()
    }
  }, [completeBreakPhase, completeWorkPhase])

  const totalDuration = phaseDuration(phase, settings)
  const progress = totalDuration > 0 ? 1 - secondsLeft / totalDuration : 0
  const dashOffset = 282.74 * (1 - progress)

  const value = useMemo<PomodoroContextValue>(() => ({
    mode,
    setMode,
    settings,
    updateSetting: (key, value) => setSettings((previous) => ({ ...previous, [key]: value })),
    stats,
    resetStats: () => setStats(defaultStats),
    phase,
    completedWorkCycles,
    secondsLeft,
    running,
    stopwatchSeconds,
    stopwatchRunning,
    totalDuration,
    progress,
    dashOffset,
    startPause: () => setRunning((r) => !r),
    reset: () => {
      setRunning(false)
      setSecondsLeft(phaseDuration(phaseRef.current, settingsRef.current))
    },
    skip,
    startPauseSW: () => setStopwatchRunning((r) => !r),
    resetSW: () => {
      setStopwatchRunning(false)
      setStopwatchSeconds(0)
    },
    previewRinger: () => playRinger(settings.ringer, settings.volume / 100),
  }), [mode, settings, stats, phase, completedWorkCycles, secondsLeft, running, stopwatchSeconds, stopwatchRunning, totalDuration, progress, dashOffset, skip])

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>
}

export function usePomodoro() {
  const value = useContext(PomodoroContext)
  if (!value) throw new Error('usePomodoro must be used inside PomodoroProvider')
  return value
}

export { RINGER_OPTIONS }
