import type { SessionDisplayMode } from '../lib/types'

type Props = {
  running: boolean
  canClear: boolean
  sessionDisplayMode: SessionDisplayMode
  onPlay: () => void
  onPause: () => void
  onClear: () => void
  onToggleDisplayMode: () => void
}

export function TimerControls({
  running,
  canClear,
  sessionDisplayMode,
  onPlay,
  onPause,
  onClear,
  onToggleDisplayMode,
}: Props) {
  const showClear = !running && canClear
  const countdownActive = sessionDisplayMode === 'countdown'

  return (
    <div className="timer-controls" role="group" aria-label="Timer controls">
      <button
        type="button"
        className="timer-controls__btn"
        onClick={onPlay}
        disabled={running}
        aria-label="Start or resume timer"
      >
        <svg
          className="timer-controls__icon"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M8 5v14l11-7z" />
        </svg>
      </button>
      {showClear ? (
        <button
          type="button"
          className="timer-controls__btn"
          onClick={onClear}
          aria-label="Clear timer and reset to zero"
        >
          <svg
            className="timer-controls__icon"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
          >
            <path fill="currentColor" d="M6 6h12v12H6V6z" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          className="timer-controls__btn"
          onClick={onPause}
          disabled={!running}
          aria-label="Pause timer"
        >
          <svg
            className="timer-controls__icon"
            viewBox="0 0 24 24"
            width="28"
            height="28"
            aria-hidden="true"
          >
            <path fill="currentColor" d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
          </svg>
        </button>
      )}
      <button
        type="button"
        className={
          countdownActive
            ? 'timer-controls__btn timer-controls__btn--mode-on'
            : 'timer-controls__btn'
        }
        onClick={onToggleDisplayMode}
        aria-pressed={countdownActive}
        aria-label={
          countdownActive
            ? 'Switch to stopwatch mode'
            : 'Switch to countdown timer mode'
        }
        title={
          countdownActive
            ? 'Countdown mode — click for stopwatch'
            : 'Stopwatch mode — click for countdown'
        }
      >
        <svg
          className="timer-controls__icon timer-controls__icon--mode"
          viewBox="0 0 24 24"
          width="28"
          height="28"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {countdownActive ? (
            <>
              <line x1="10" x2="14" y1="2" y2="2" />
              <line x1="12" x2="15" y1="14" y2="11" />
              <circle cx="12" cy="14" r="8" />
            </>
          ) : (
            <>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </>
          )}
        </svg>
      </button>
    </div>
  )
}
