import { CaretDownIcon, CaretUpIcon } from './CaretIcons'
import { formatTwoDigits, msFromHms, msToClockParts } from '../lib/time'
import type { SessionDisplayMode } from '../lib/types'

const H_MS = 60 * 60 * 1000
const M_MS = 60 * 1000
const S_MS = 1000

type Props = {
  label: string
  sessionDisplayMode: SessionDisplayMode
  elapsedMs: number
  countdownDurationMs: number
  running: boolean
  onSetCountdownDurationMs: (ms: number) => void
}

function DigitRead({ value }: { value: number }) {
  const { h, m, s } = msToClockParts(value)
  return (
    <>
      <span className="main-timer__part">{formatTwoDigits(h)}</span>
      <span className="main-timer__sep" aria-hidden="true">
        :
      </span>
      <span className="main-timer__part">{formatTwoDigits(m)}</span>
      <span className="main-timer__sep" aria-hidden="true">
        :
      </span>
      <span className="main-timer__part">{formatTwoDigits(s)}</span>
    </>
  )
}

export function MainTimer({
  label,
  sessionDisplayMode,
  elapsedMs,
  countdownDurationMs,
  running,
  onSetCountdownDurationMs,
}: Props) {
  const editingCountdown = sessionDisplayMode === 'countdown' && !running

  const displayMs =
    sessionDisplayMode === 'stopwatch'
      ? elapsedMs
      : running
        ? Math.max(0, countdownDurationMs - elapsedMs)
        : countdownDurationMs

  const parts = msToClockParts(countdownDurationMs)

  const bumpDuration = (deltaMs: number) => {
    onSetCountdownDurationMs(countdownDurationMs + deltaMs)
  }

  return (
    <div className="main-timer">
      <p className="main-timer__label">{label}</p>
      {editingCountdown ? (
        <div className="main-timer__clock">
          <div
            className="main-timer__digit-row main-timer__digit-row--edit"
            aria-live="polite"
          >
            <div className="main-timer__field">
            <button
              type="button"
              className="main-timer__caret"
              aria-label="Increase hours"
              onClick={() => bumpDuration(H_MS)}
            >
              <CaretUpIcon />
            </button>
            <input
              className="main-timer__part main-timer__part--edit"
              type="number"
              min={0}
              max={12}
              inputMode="numeric"
              aria-label="Hours"
              value={parts.h}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                const nh = Number.isNaN(v) ? 0 : Math.min(12, Math.max(0, v))
                onSetCountdownDurationMs(msFromHms(nh, parts.m, parts.s))
              }}
            />
            <button
              type="button"
              className="main-timer__caret"
              aria-label="Decrease hours"
              onClick={() => bumpDuration(-H_MS)}
            >
              <CaretDownIcon />
            </button>
          </div>
          <span className="main-timer__sep" aria-hidden="true">
            :
          </span>
          <div className="main-timer__field">
            <button
              type="button"
              className="main-timer__caret"
              aria-label="Increase minutes"
              onClick={() => bumpDuration(M_MS)}
            >
              <CaretUpIcon />
            </button>
            <input
              className="main-timer__part main-timer__part--edit"
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              aria-label="Minutes"
              value={parts.m}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                const nm = Number.isNaN(v) ? 0 : Math.min(59, Math.max(0, v))
                onSetCountdownDurationMs(msFromHms(parts.h, nm, parts.s))
              }}
            />
            <button
              type="button"
              className="main-timer__caret"
              aria-label="Decrease minutes"
              onClick={() => bumpDuration(-M_MS)}
            >
              <CaretDownIcon />
            </button>
          </div>
          <span className="main-timer__sep" aria-hidden="true">
            :
          </span>
          <div className="main-timer__field">
            <button
              type="button"
              className="main-timer__caret"
              aria-label="Increase seconds"
              onClick={() => bumpDuration(S_MS)}
            >
              <CaretUpIcon />
            </button>
            <input
              className="main-timer__part main-timer__part--edit"
              type="number"
              min={0}
              max={59}
              inputMode="numeric"
              aria-label="Seconds"
              value={parts.s}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                const ns = Number.isNaN(v) ? 0 : Math.min(59, Math.max(0, v))
                onSetCountdownDurationMs(msFromHms(parts.h, parts.m, ns))
              }}
            />
            <button
              type="button"
              className="main-timer__caret"
              aria-label="Decrease seconds"
              onClick={() => bumpDuration(-S_MS)}
            >
              <CaretDownIcon />
            </button>
          </div>
          </div>
          <div className="main-timer__unit-row" aria-hidden="true">
            <span>HOURS</span>
            <span className="main-timer__unit-under-sep" aria-hidden="true" />
            <span>MINUTES</span>
            <span className="main-timer__unit-under-sep" aria-hidden="true" />
            <span>SECONDS</span>
          </div>
        </div>
      ) : (
        <div className="main-timer__clock">
          <div className="main-timer__digit-row" aria-live="polite">
            <DigitRead value={displayMs} />
          </div>
          <div className="main-timer__unit-row" aria-hidden="true">
            <span>HOURS</span>
            <span className="main-timer__unit-under-sep" aria-hidden="true" />
            <span>MINUTES</span>
            <span className="main-timer__unit-under-sep" aria-hidden="true" />
            <span>SECONDS</span>
          </div>
        </div>
      )}
    </div>
  )
}
