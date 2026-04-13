import { formatTwoDigits, msToClockParts } from '../lib/time'

type Props = {
  label: string
  weeklySittingMs: number
  onClearData?: () => void
}

export function WeeklySummary({ label, weeklySittingMs, onClearData }: Props) {
  const { h, m, s } = msToClockParts(weeklySittingMs)

  const handleClear = () => {
    if (
      !window.confirm(
        'Clear all saved sitting and standing time and weekly totals? This cannot be undone.',
      )
    ) {
      return
    }
    onClearData?.()
  }

  return (
    <div className="weekly-summary">
      <p className="weekly-summary__label">{label}</p>
      <div className="weekly-summary__digits-row">
        <div
          className="weekly-summary__grid"
          aria-live="polite"
          role="group"
          aria-label="Weekly sitting time"
        >
          <span className="weekly-summary__num">{formatTwoDigits(h)}</span>
          <span className="weekly-summary__grid-sep" aria-hidden="true">
            :
          </span>
          <span className="weekly-summary__num">{formatTwoDigits(m)}</span>
          <span className="weekly-summary__grid-sep" aria-hidden="true">
            :
          </span>
          <span className="weekly-summary__num">{formatTwoDigits(s)}</span>
          <span className="weekly-summary__unit">HR</span>
          <span className="weekly-summary__unit-gap" aria-hidden="true" />
          <span className="weekly-summary__unit">MIN</span>
          <span className="weekly-summary__unit-gap" aria-hidden="true" />
          <span className="weekly-summary__unit">SEC</span>
        </div>
        {onClearData ? (
          <button
            type="button"
            className="weekly-summary__clear"
            onClick={handleClear}
            aria-label="Clear all saved time data"
          >
            <svg
              className="weekly-summary__clear-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  )
}
