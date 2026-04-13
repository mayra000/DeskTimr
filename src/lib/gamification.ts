/**
 * Gamification: streaks, XP, rings, etc. Pure functions only.
 *
 * Rollout (one slice at a time for UI feedback):
 * 1. Done — Mon–Fri standing badges (check / progress / future) under the timer.
 * 2. Week-over-week or same-weekday comparison.
 * 3. Achievements / soft XP + optional streak freeze.
 */

import { getDayKey } from './day'
import { getWeekDayRows } from './activitySummary'
import { clampStandingGoalMs, isGamificationWorkday } from './gamificationRules'
import type { DailyPostureMs, PersistedDeskState } from './types'

function startOfLocalDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function addLocalDays(d: Date, delta: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + delta)
  return x
}

/** Sum standing time for Mon–Fri of the Monday week that contains `now`. */
export function sumStandingMsWorkweek(
  now: Date,
  dailyLog: Record<string, DailyPostureMs>,
): number {
  const rows = getWeekDayRows(now, dailyLog)
  let sum = 0
  for (let i = 0; i < 5; i++) {
    sum += rows[i]?.standingMs ?? 0
  }
  return sum
}

/**
 * Consecutive local Mon–Fri days (walking backward from `now`) where standing
 * meets `goalMs`. Weekends are skipped: they neither increment nor break.
 */
export function computeWorkdayStandingStreak(
  dailyLog: Record<string, DailyPostureMs>,
  now: Date,
  goalMs: number,
): number {
  const floor = Math.max(goalMs, 1)
  let streak = 0
  let d = startOfLocalDay(now)
  const maxCalendarDays = 400
  for (let i = 0; i < maxCalendarDays; i++) {
    if (isGamificationWorkday(d)) {
      const key = getDayKey(d)
      const standing = dailyLog[key]?.standingMs ?? 0
      if (standing >= floor) streak += 1
      else break
    }
    d = addLocalDays(d, -1)
  }
  return streak
}

export type WorkweekBadgeDayKind = 'future' | 'complete' | 'partial' | 'missed'

export interface WorkweekBadgeDay {
  labelShort: string
  dayKey: string
  kind: WorkweekBadgeDayKind
  /** 0..1 — partial fill for in-progress today; 0 for future/missed */
  ratio: number
}

const WORKWEEK_BADGE_LABELS = ['M', 'T', 'W', 'TH', 'F'] as const

/**
 * Mon–Fri of the Monday week containing `now`: standing goal progress per day.
 * Past days: complete (met goal) or missed. Today: partial or complete. Future: empty.
 */
export function getWorkweekStandingBadges(
  now: Date,
  dailyLog: Record<string, DailyPostureMs>,
  goalMs: number,
): WorkweekBadgeDay[] {
  const rows = getWeekDayRows(now, dailyLog)
  const todayKey = getDayKey(now)
  const goal = Math.max(goalMs, 1)
  const out: WorkweekBadgeDay[] = []

  for (let i = 0; i < 5; i++) {
    const row = rows[i]!
    const standing = row.standingMs
    const dk = row.dayKey
    const labelShort = WORKWEEK_BADGE_LABELS[i]!

    if (dk > todayKey) {
      out.push({ labelShort, dayKey: dk, kind: 'future', ratio: 0 })
    } else if (dk < todayKey) {
      if (standing >= goal) {
        out.push({ labelShort, dayKey: dk, kind: 'complete', ratio: 1 })
      } else {
        out.push({ labelShort, dayKey: dk, kind: 'missed', ratio: 0 })
      }
    } else {
      if (standing >= goal) {
        out.push({ labelShort, dayKey: dk, kind: 'complete', ratio: 1 })
      } else {
        out.push({
          labelShort,
          dayKey: dk,
          kind: 'partial',
          ratio: Math.min(1, standing / goal),
        })
      }
    }
  }
  return out
}

export interface GamificationSnapshot {
  standingGoalMs: number
  /** True when today is Mon–Fri (local). */
  gamificationActiveToday: boolean
  /** Standing time on Mon–Fri this calendar week (Monday-based). */
  weeklyStandingWorkdaysMs: number
  /** Workday standing streak (see computeWorkdayStandingStreak). */
  workdayStandingStreak: number
  /** Placeholder for future XP / levels. */
  placeholderLevel: number
  /** Mon–Fri badge row for the current week. */
  workweekStandingBadges: WorkweekBadgeDay[]
}

export function computeGamificationSnapshot(
  state: PersistedDeskState,
  now: Date,
): GamificationSnapshot {
  const standingGoalMs = clampStandingGoalMs(state.standingGoalMs)
  return {
    standingGoalMs,
    gamificationActiveToday: isGamificationWorkday(now),
    weeklyStandingWorkdaysMs: sumStandingMsWorkweek(now, state.dailyLog),
    workdayStandingStreak: computeWorkdayStandingStreak(
      state.dailyLog,
      now,
      standingGoalMs,
    ),
    placeholderLevel: 1,
    workweekStandingBadges: getWorkweekStandingBadges(
      now,
      state.dailyLog,
      standingGoalMs,
    ),
  }
}
