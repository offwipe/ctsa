export type PomodoroStats = {
  totalSessions: number
  totalFocusSeconds: number
  currentStreak: number
  longestStreak: number
  lastSessionDate: string | null
  todaySessions: number
  todayDate: string | null
  xp: number
}

const STORAGE_KEY = 'comptia-study-pomodoro-stats'

export const defaultStats: PomodoroStats = {
  totalSessions: 0,
  totalFocusSeconds: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
  todaySessions: 0,
  todayDate: null,
  xp: 0,
}

export function loadStats(): PomodoroStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultStats }
    return { ...defaultStats, ...JSON.parse(raw) }
  } catch {
    return { ...defaultStats }
  }
}

export function persistStats(stats: PomodoroStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // noop
  }
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isYesterday(dateStr: string): boolean {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const y = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return dateStr === y
}

export function recordSession(
  prev: PomodoroStats,
  focusSeconds: number,
): PomodoroStats {
  const today = todayKey()
  const isNewDay = prev.todayDate !== today

  let currentStreak = prev.currentStreak
  if (prev.lastSessionDate === today) {
    // already counted today, streak unchanged
  } else if (prev.lastSessionDate && isYesterday(prev.lastSessionDate)) {
    currentStreak = prev.currentStreak + 1
  } else if (prev.lastSessionDate === null) {
    currentStreak = 1
  } else {
    currentStreak = 1
  }

  const todaySessions = isNewDay ? 1 : prev.todaySessions + 1
  const longestStreak = Math.max(prev.longestStreak, currentStreak)
  const xpGain = Math.max(5, Math.round(focusSeconds / 60))

  return {
    totalSessions: prev.totalSessions + 1,
    totalFocusSeconds: prev.totalFocusSeconds + focusSeconds,
    currentStreak,
    longestStreak,
    lastSessionDate: today,
    todaySessions,
    todayDate: today,
    xp: prev.xp + xpGain,
  }
}

export function levelFromXP(xp: number): { level: number; intoLevel: number; xpForNext: number } {
  let level = 1
  let xpForNext = 50
  let remaining = xp
  while (remaining >= xpForNext) {
    remaining -= xpForNext
    level += 1
    xpForNext = Math.round(xpForNext * 1.3)
  }
  return { level, intoLevel: remaining, xpForNext }
}

export function levelTitle(level: number): string {
  if (level >= 30) return 'Time Architect'
  if (level >= 20) return 'Focus Master'
  if (level >= 14) return 'Deep Worker'
  if (level >= 9) return 'Studious'
  if (level >= 5) return 'Steady Learner'
  if (level >= 3) return 'Apprentice'
  return 'Novice'
}

export function formatHours(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}
