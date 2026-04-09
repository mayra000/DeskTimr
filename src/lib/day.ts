/** Local calendar day id (YYYY-MM-DD). */
export function getDayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Start of the next local calendar day after instant `t` (ms). */
export function startOfNextDayMs(t: number): number {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 1)
  return d.getTime()
}

/**
 * Splits [from, to) into per-local-day chunks (ms) for logging.
 */
export function forEachDaySlice(
  from: number,
  to: number,
  cb: (dayKey: string, ms: number) => void,
): void {
  if (to <= from) return
  let t = from
  while (t < to) {
    const next = startOfNextDayMs(t)
    const end = Math.min(to, next)
    cb(getDayKey(new Date(t)), end - t)
    t = end
  }
}
