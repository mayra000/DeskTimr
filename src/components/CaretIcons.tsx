/** Same paths as countdown editor — shared for consistent UI. */
export function CaretUpIcon() {
  return (
    <svg
      className="main-timer__caret-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path fill="currentColor" d="M12 8l-6 6h12l-6-6z" />
    </svg>
  )
}

export function CaretDownIcon() {
  return (
    <svg
      className="main-timer__caret-icon"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path fill="currentColor" d="M12 16l6-6H6l6 6z" />
    </svg>
  )
}
