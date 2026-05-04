import { useMemo } from 'react'
import '../ScreenShell.css'
import './PomodoroScreen.css'
import { Section } from '../../components/ui/Section'
import { Slider } from '../../components/ui/Slider'
import { Toggle } from '../../components/ui/Toggle'
import { Dropdown } from '../../components/ui/Dropdown'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { ResetButton } from '../../components/ui/ResetButton'
import { SettingsRow } from '../../components/ui/SettingsRow'
import { formatClock, phaseLabel, RINGER_OPTIONS, usePomodoro } from '../../context/PomodoroContext'
import type { RingerSound } from './pomodoroSounds'
import {
  formatHours,
  levelFromXP,
  levelTitle,
} from './pomodoroStats'

export function PomodoroScreen() {
  const {
    mode,
    setMode,
    settings,
    updateSetting,
    stats,
    resetStats,
    phase,
    completedWorkCycles,
    secondsLeft,
    running,
    stopwatchSeconds,
    stopwatchRunning,
    dashOffset,
    startPause,
    reset,
    skip,
    startPauseSW,
    resetSW,
    previewRinger,
  } = usePomodoro()

  const { level, intoLevel, xpForNext } = levelFromXP(stats.xp)
  const levelProgress = Math.min(100, Math.round((intoLevel / xpForNext) * 100))

  const xpProgressBarStyle = useMemo(
    () => ({ width: `${levelProgress}%` }),
    [levelProgress],
  )

  const weeklyProgress = Math.min(100, Math.round((stats.todaySessions / 8) * 100))

  return (
    <>
      <h1 className="screen-title">Pomodoro & Focus</h1>
      <p className="screen-description">
        Work in focused intervals, take strategic breaks, and track your study streaks. Timer, stopwatch, and gamified stats — all in one place.
      </p>

      <div className="pomo-mode-tabs">
        <button
          className={'pomo-mode-tab' + (mode === 'pomodoro' ? ' pomo-mode-tab--active' : '')}
          onClick={() => setMode('pomodoro')}
        >
          Pomodoro
        </button>
        <button
          className={'pomo-mode-tab' + (mode === 'stopwatch' ? ' pomo-mode-tab--active' : '')}
          onClick={() => setMode('stopwatch')}
        >
          Stopwatch
        </button>
      </div>

      {mode === 'pomodoro' ? (
        <Section
          title={phaseLabel(phase)}
          badge={running ? 'Running' : 'Paused'}
          badgeVariant={running ? 'accent' : 'secondary'}
          description={`Cycle ${(completedWorkCycles % settings.cyclesBeforeLongBreak) + (phase === 'work' ? 1 : 0)} of ${settings.cyclesBeforeLongBreak} · long break every ${settings.cyclesBeforeLongBreak} cycles.`}
        >
          <div className={'pomo-timer pomo-timer--' + phase}>
            <svg className="pomo-ring" viewBox="0 0 100 100" aria-hidden>
              <circle className="pomo-ring-track" cx="50" cy="50" r="45" />
              <circle
                className="pomo-ring-progress"
                cx="50"
                cy="50"
                r="45"
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="pomo-display">
              <div className="pomo-time">{formatClock(secondsLeft)}</div>
              <div className="pomo-phase-label">{phaseLabel(phase)}</div>
            </div>
          </div>

          <div className="pomo-controls">
            <PrimaryButton onClick={startPause}>
              {running ? 'Pause' : 'Start'}
            </PrimaryButton>
            <ResetButton label="Reset phase" onClick={reset} />
            <ResetButton label="Skip ahead" onClick={skip} />
          </div>
        </Section>
      ) : (
        <Section
          title="Stopwatch"
          badge={stopwatchRunning ? 'Running' : 'Stopped'}
          badgeVariant={stopwatchRunning ? 'accent' : 'secondary'}
          description="Open-ended timer for ad-hoc study sessions."
        >
          <div className="pomo-timer pomo-timer--stopwatch">
            <div className="pomo-display pomo-display--stopwatch">
              <div className="pomo-time">{formatClock(stopwatchSeconds)}</div>
              <div className="pomo-phase-label">Stopwatch</div>
            </div>
          </div>
          <div className="pomo-controls">
            <PrimaryButton onClick={startPauseSW}>
              {stopwatchRunning ? 'Pause' : 'Start'}
            </PrimaryButton>
            <ResetButton label="Reset" onClick={resetSW} />
          </div>
        </Section>
      )}

      <Section
        title="Your Progress"
        badge="Gamified"
        badgeVariant="accent"
        description="Earn XP for every focus session. Build streaks. Level up."
      >
        <div className="pomo-stats-grid">
          <div className="pomo-stat-card pomo-stat-card--hero">
            <div className="pomo-stat-label">Level {level}</div>
            <div className="pomo-stat-title">{levelTitle(level)}</div>
            <div className="pomo-xp-bar">
              <div className="pomo-xp-bar-fill" style={xpProgressBarStyle} />
            </div>
            <div className="pomo-stat-foot">
              {intoLevel} / {xpForNext} XP to level {level + 1}
            </div>
          </div>

          <div className="pomo-stat-card">
            <div className="pomo-stat-label">Current streak</div>
            <div className="pomo-stat-value pomo-stat-value--streak">
              <span className="pomo-flame" aria-hidden>🔥</span>
              {stats.currentStreak}
              <span className="pomo-stat-unit">days</span>
            </div>
            <div className="pomo-stat-foot">Best: {stats.longestStreak} days</div>
          </div>

          <div className="pomo-stat-card">
            <div className="pomo-stat-label">Total sessions</div>
            <div className="pomo-stat-value">{stats.totalSessions}</div>
            <div className="pomo-stat-foot">{formatHours(stats.totalFocusSeconds)} focused</div>
          </div>

          <div className="pomo-stat-card">
            <div className="pomo-stat-label">Today</div>
            <div className="pomo-stat-value">{stats.todaySessions}</div>
            <div className="pomo-stat-foot">sessions completed</div>
          </div>
        </div>

        <div className="pomo-goal">
          <div className="pomo-goal-row">
            <span className="pomo-goal-title">Daily goal</span>
            <span className="pomo-goal-value">{stats.todaySessions} / 8 sessions</span>
          </div>
          <div className="pomo-goal-bar">
            <div className="pomo-goal-bar-fill" style={{ width: `${weeklyProgress}%` }} />
          </div>
        </div>

        <div className="pomo-achievements">
          <div className={'pomo-achievement' + (stats.totalSessions >= 1 ? ' pomo-achievement--unlocked' : '')}>
            <span className="pomo-achievement-icon" aria-hidden>🌱</span>
            <div>
              <div className="pomo-achievement-title">First Step</div>
              <div className="pomo-achievement-desc">Complete 1 session</div>
            </div>
          </div>
          <div className={'pomo-achievement' + (stats.totalSessions >= 10 ? ' pomo-achievement--unlocked' : '')}>
            <span className="pomo-achievement-icon" aria-hidden>📚</span>
            <div>
              <div className="pomo-achievement-title">Bookworm</div>
              <div className="pomo-achievement-desc">10 sessions total</div>
            </div>
          </div>
          <div className={'pomo-achievement' + (stats.currentStreak >= 3 ? ' pomo-achievement--unlocked' : '')}>
            <span className="pomo-achievement-icon" aria-hidden>🔥</span>
            <div>
              <div className="pomo-achievement-title">On Fire</div>
              <div className="pomo-achievement-desc">3-day streak</div>
            </div>
          </div>
          <div className={'pomo-achievement' + (stats.currentStreak >= 7 ? ' pomo-achievement--unlocked' : '')}>
            <span className="pomo-achievement-icon" aria-hidden>⚡</span>
            <div>
              <div className="pomo-achievement-title">Unstoppable</div>
              <div className="pomo-achievement-desc">7-day streak</div>
            </div>
          </div>
          <div className={'pomo-achievement' + (stats.totalFocusSeconds >= 3600 * 10 ? ' pomo-achievement--unlocked' : '')}>
            <span className="pomo-achievement-icon" aria-hidden>🎯</span>
            <div>
              <div className="pomo-achievement-title">Focused</div>
              <div className="pomo-achievement-desc">10 hours focused</div>
            </div>
          </div>
          <div className={'pomo-achievement' + (level >= 10 ? ' pomo-achievement--unlocked' : '')}>
            <span className="pomo-achievement-icon" aria-hidden>🏆</span>
            <div>
              <div className="pomo-achievement-title">Veteran</div>
              <div className="pomo-achievement-desc">Reach level 10</div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Timer Settings"
        description="Adjust durations, cycle behavior, and the alarm."
      >
        <SettingsRow label="Focus length" description="Duration of each work session.">
          <Slider
            value={settings.workMinutes} min={5} max={90} step={5}
            onChange={(v) => updateSetting('workMinutes', v)}
            valueLabel={`${settings.workMinutes} min`}
          />
        </SettingsRow>
        <SettingsRow label="Short break" description="Length of regular breaks.">
          <Slider
            value={settings.shortBreakMinutes} min={1} max={30} step={1}
            onChange={(v) => updateSetting('shortBreakMinutes', v)}
            valueLabel={`${settings.shortBreakMinutes} min`}
          />
        </SettingsRow>
        <SettingsRow label="Long break" description="Length of break after a full cycle.">
          <Slider
            value={settings.longBreakMinutes} min={5} max={60} step={5}
            onChange={(v) => updateSetting('longBreakMinutes', v)}
            valueLabel={`${settings.longBreakMinutes} min`}
          />
        </SettingsRow>
        <SettingsRow label="Cycles before long break" description="How many focus sessions per long break.">
          <Slider
            value={settings.cyclesBeforeLongBreak} min={2} max={8} step={1}
            onChange={(v) => updateSetting('cyclesBeforeLongBreak', v)}
            valueLabel={`${settings.cyclesBeforeLongBreak}`}
          />
        </SettingsRow>
        <SettingsRow label="Auto-cycle" description="Automatically start the next phase after each.">
          <Toggle
            checked={settings.autoCycle}
            onChange={(v) => updateSetting('autoCycle', v)}
            aria-label="Auto-cycle"
          />
        </SettingsRow>
      </Section>

      <Section
        title="Alarm"
        badge="Audible"
        badgeVariant="accent"
        description="Pick a ringer sound and adjust volume. Tap preview to test."
      >
        <SettingsRow label="Ringer sound">
          <Dropdown
            value={settings.ringer}
            options={RINGER_OPTIONS}
            onChange={(v) => updateSetting('ringer', v as RingerSound)}
          />
        </SettingsRow>
        <SettingsRow label="Volume">
          <Slider
            value={settings.volume} min={0} max={100}
            onChange={(v) => updateSetting('volume', v)}
            valueLabel={`${settings.volume}%`}
          />
        </SettingsRow>
        <div className="pomo-controls">
          <PrimaryButton onClick={previewRinger}>
            Preview ringer
          </PrimaryButton>
        </div>
      </Section>

      <Section
        title="Data"
        badge="Careful"
        badgeVariant="secondary"
        description="Reset your stats. This cannot be undone."
      >
        <ResetButton label="Reset all stats" onClick={resetStats} />
      </Section>
    </>
  )
}
