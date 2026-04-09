/** Monday 00:00:00 local time for the week containing `d`. */
export function getMonday(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

/** Stable id for the local week (Monday-based). */
export function getWeekKey(d: Date): string {
  const mon = getMonday(d)
  const y = mon.getFullYear()
  const m = String(mon.getMonth() + 1).padStart(2, '0')
  const day = String(mon.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function ensureWeekKey<T extends { weekKey: string; weeklySittingMs: number }>(
  state: T,
  now: Date,
): T {
  const key = getWeekKey(now)
  if (state.weekKey === key) return state
  return { ...state, weekKey: key, weeklySittingMs: 0 }
}
