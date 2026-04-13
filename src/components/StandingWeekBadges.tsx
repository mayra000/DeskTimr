import type { WorkweekBadgeDay } from '../lib/gamification'

type Props = {
  days: WorkweekBadgeDay[]
}

const R = 18
const C = 2 * Math.PI * R
const VB = 48
const CX = VB / 2

function RingProgress({ ratio }: { ratio: number }) {
  const offset = C * (1 - ratio)
  return (
    <svg
      className="standing-badges__svg"
      width={48}
      height={48}
      viewBox={`0 0 ${VB} ${VB}`}
      aria-hidden="true"
    >
      <g transform={`rotate(-90 ${CX} ${CX})`}>
        <circle
          className="standing-badges__track"
          r={R}
          cx={CX}
          cy={CX}
          fill="none"
          strokeWidth={2.5}
        />
        {ratio > 0.001 ? (
          <circle
            className="standing-badges__progress"
            r={R}
            cx={CX}
            cy={CX}
            fill="none"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={`${C} ${C}`}
            strokeDashoffset={offset}
          />
        ) : null}
      </g>
    </svg>
  )
}

function CompleteBadge() {
  return (
    <div className="standing-badges__complete" aria-hidden="true">
      <svg
        className="standing-badges__check"
        width={22}
        height={22}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
  )
}

export function StandingWeekBadges({ days }: Props) {
  return (
    <div
      className="standing-badges"
      role="group"
      aria-label="Standing goal progress Monday through Friday"
    >
      {days.map((d) => (
        <div key={d.dayKey} className="standing-badges__day">
          <div
            className="standing-badges__ring-wrap"
            data-kind={d.kind}
          >
            {d.kind === 'complete' ? <CompleteBadge /> : null}
            {d.kind === 'partial' ? <RingProgress ratio={d.ratio} /> : null}
            {d.kind === 'missed' ? <RingProgress ratio={0} /> : null}
            {d.kind === 'future' ? <RingProgress ratio={0} /> : null}
          </div>
          <span className="standing-badges__label">{d.labelShort}</span>
        </div>
      ))}
    </div>
  )
}
