import { formatTwoDigits, msToClockParts } from '../lib/time'

type Props = {
  label: string
  weeklySittingMs: number
}

export function WeeklySummary({ label, weeklySittingMs }: Props) {
  const { h, m, s } = msToClockParts(weeklySittingMs)
  return (
    <div className="weekly-summary">
      <p className="weekly-summary__label">{label}</p>
      <div className="weekly-summary__digits" aria-live="polite">
        <span>{formatTwoDigits(h)}</span>
        <span className="weekly-summary__sep" aria-hidden="true">
          {' '}
          :{' '}
        </span>
        <span>{formatTwoDigits(m)}</span>
        <span className="weekly-summary__sep" aria-hidden="true">
          {' '}
          :{' '}
        </span>
        <span>{formatTwoDigits(s)}</span>
      </div>
      <div className="weekly-summary__units" aria-hidden="true">
        <span>HR</span>
        <span className="weekly-summary__gap" />
        <span>MIN</span>
        <span className="weekly-summary__gap" />
        <span>SEC</span>
      </div>
    </div>
  )
}
