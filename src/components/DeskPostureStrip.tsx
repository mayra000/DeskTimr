type Posture = 'sitting' | 'standing'

type Props = {
  posture: Posture
}

const LABEL: Record<Posture, string> = {
  sitting: 'Sitting',
  standing: 'Standing',
}

export function DeskPostureStrip({ posture }: Props) {
  return (
    <div
      className="desk-timer__posture-strip"
      data-posture={posture}
      role="status"
      aria-live="polite"
    >
      <span className="desk-timer__posture-strip-label">Now</span>
      <span className="desk-timer__posture-strip-value">{LABEL[posture]}</span>
    </div>
  )
}
