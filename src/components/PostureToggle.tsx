type Props = {
  label: string
  onClick: () => void
}

export function PostureToggle({ label, onClick }: Props) {
  return (
    <button type="button" className="posture-toggle" onClick={onClick}>
      {label}
    </button>
  )
}
