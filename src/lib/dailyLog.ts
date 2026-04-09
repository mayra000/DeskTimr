import { forEachDaySlice, getDayKey } from './day'
import type { DailyPostureMs, PersistedDeskState } from './types'

export function addPostureDeltaAcrossDays(
  prev: PersistedDeskState,
  from: number,
  to: number,
  posture: 'sitting' | 'standing',
): PersistedDeskState {
  if (to <= from) return prev
  const field = posture === 'sitting' ? 'sittingMs' : 'standingMs'
  let next = prev
  forEachDaySlice(from, to, (dayKey, ms) => {
    if (ms <= 0) return
    const cur: DailyPostureMs = next.dailyLog[dayKey] ?? {
      sittingMs: 0,
      standingMs: 0,
    }
    next = {
      ...next,
      dailyLog: {
        ...next.dailyLog,
        [dayKey]: {
          ...cur,
          [field]: cur[field] + ms,
        },
      },
    }
  })
  return next
}

/** Drop entries older than `keepDays` before today (local). */
export function pruneDailyLog(
  log: Record<string, DailyPostureMs>,
  now: Date,
  keepDays = 120,
): Record<string, DailyPostureMs> {
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - keepDays)
  const cutoffKey = getDayKey(cutoff)
  const out: Record<string, DailyPostureMs> = {}
  for (const [k, v] of Object.entries(log)) {
    if (k >= cutoffKey) out[k] = v
  }
  return out
}
