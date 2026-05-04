import { useLocation, useNavigate } from 'react-router-dom'
import { formatClock, phaseLabel, usePomodoro } from '../../context/PomodoroContext'
import './PomodoroFloatingWidget.css'

export function PomodoroFloatingWidget() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    mode,
    phase,
    secondsLeft,
    running,
    stopwatchSeconds,
    stopwatchRunning,
    totalDuration,
    startPause,
    reset,
    skip,
    startPauseSW,
    resetSW,
  } = usePomodoro()

  const active = mode === 'pomodoro'
    ? running || phase !== 'work' || secondsLeft < totalDuration
    : stopwatchRunning || stopwatchSeconds > 0
  if (!active || location.pathname === '/pomodoro') return null

  const isStopwatch = mode === 'stopwatch'

  return (
    <aside className="pomo-float" aria-label="Floating Pomodoro timer">
      <div>
        <span className="pomo-float__label">{isStopwatch ? 'Stopwatch' : phaseLabel(phase)}</span>
        <strong className="pomo-float__time">{formatClock(isStopwatch ? stopwatchSeconds : secondsLeft)}</strong>
      </div>
      <div className="pomo-float__actions">
        <button type="button" onClick={isStopwatch ? startPauseSW : startPause}>
          {isStopwatch ? (stopwatchRunning ? 'Pause' : 'Start') : running ? 'Pause' : 'Start'}
        </button>
        <button type="button" onClick={isStopwatch ? resetSW : reset}>Restart</button>
        <button type="button" onClick={skip} disabled={isStopwatch}>Skip</button>
        <button type="button" onClick={() => navigate('/pomodoro')}>Open</button>
      </div>
    </aside>
  )
}
