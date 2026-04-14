type Props = {
  label: string
  onClick: () => void
}

export function PostureToggle({ label, onClick }: Props) {
  return (
    <button type="button" className="desk-timer__posture" onClick={onClick}>
      {label}
    </button>
  )
}
