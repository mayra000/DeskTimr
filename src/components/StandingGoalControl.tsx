import { CaretDownIcon, CaretUpIcon } from './CaretIcons'
import { clampStandingGoalMs } from '../lib/gamificationRules'
import { formatDurationShort } from '../lib/time'
import { COUNTDOWN_STEP_MS } from '../lib/types'

type Props = {
  goalMs: number
  onAdjust: (deltaMs: number) => void
}

export function StandingGoalControl({ goalMs, onAdjust }: Props) {
  const label = formatDurationShort(goalMs)
  const atMin = clampStandingGoalMs(goalMs - COUNTDOWN_STEP_MS) === goalMs
  const atMax = clampStandingGoalMs(goalMs + COUNTDOWN_STEP_MS) === goalMs

  return (
    <div
      className="standing-goal"
      role="group"
      aria-label="Daily standing goal for weekday rings"
    >
      <span className="standing-goal__caption">Standing goal</span>
      <div className="standing-goal__row">
        <span
          className="standing-goal__value"
          title="Target standing time to complete each weekday ring"
        >
          {label}
        </span>
        <div className="standing-goal__carets" role="group" aria-label="Adjust goal">
          <button
            type="button"
            className="standing-goal__caret"
            onClick={() => onAdjust(COUNTDOWN_STEP_MS)}
            disabled={atMax}
            aria-label="Increase daily standing goal by five minutes"
          >
            <CaretUpIcon />
          </button>
          <button
            type="button"
            className="standing-goal__caret"
            onClick={() => onAdjust(-COUNTDOWN_STEP_MS)}
            disabled={atMin}
            aria-label="Decrease daily standing goal by five minutes"
          >
            <CaretDownIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
