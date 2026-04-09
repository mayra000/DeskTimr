import { getDayKey } from './day'
import { getMonday } from './week'
import type { DailyPostureMs } from './types'

export type WeekDayRow = {
  dayKey: string
  weekdayShort: string
  dayLabel: string
  sittingMs: number
  standingMs: number
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function getWeekDayRows(
  now: Date,
  dailyLog: Record<string, DailyPostureMs>,
): WeekDayRow[] {
  const mon = getMonday(now)
  const rows: WeekDayRow[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(mon)
    d.setDate(mon.getDate() + i)
    const dayKey = getDayKey(d)
    const entry = dailyLog[dayKey] ?? { sittingMs: 0, standingMs: 0 }
    rows.push({
      dayKey,
      weekdayShort: WEEKDAYS[i],
      dayLabel: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`,
      sittingMs: entry.sittingMs,
      standingMs: entry.standingMs,
    })
  }
  return rows
}

export function sumWeek(rows: WeekDayRow[]): {
  sittingMs: number
  standingMs: number
} {
  return rows.reduce(
    (acc, r) => ({
      sittingMs: acc.sittingMs + r.sittingMs,
      standingMs: acc.standingMs + r.standingMs,
    }),
    { sittingMs: 0, standingMs: 0 },
  )
}

export function getTodayFromLog(
  now: Date,
  dailyLog: Record<string, DailyPostureMs>,
): { dayKey: string; sittingMs: number; standingMs: number } {
  const dayKey = getDayKey(now)
  const e = dailyLog[dayKey] ?? { sittingMs: 0, standingMs: 0 }
  return { dayKey, sittingMs: e.sittingMs, standingMs: e.standingMs }
}
