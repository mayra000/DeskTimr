/**
 * Gamification uses the user's local calendar. Mon–Fri are "workdays" for goals
 * and streaks; Sat–Sun are skipped when walking streaks backward (they neither
 * add nor break a streak).
 */

import { COUNTDOWN_STEP_MS } from './types'

/** Default daily standing target. */
export const DEFAULT_STANDING_GOAL_MS = 60 * 60 * 1000

const MAX_STANDING_GOAL_MS = 8 * 60 * 60 * 1000

/** Same step as countdown edits — 5 minutes. */
const MIN_STANDING_GOAL_MS = COUNTDOWN_STEP_MS

/**
 * Clamp saved/user input to 5-minute steps between 5 minutes and 8 hours.
 */
export function clampStandingGoalMs(ms: number): number {
  const n = Math.floor(Number(ms))
  if (!Number.isFinite(n)) return DEFAULT_STANDING_GOAL_MS
  const rounded = Math.round(n / COUNTDOWN_STEP_MS) * COUNTDOWN_STEP_MS
  const floor = Math.max(MIN_STANDING_GOAL_MS, rounded || MIN_STANDING_GOAL_MS)
  return Math.min(MAX_STANDING_GOAL_MS, floor)
}

/**
 * Monday–Friday in local time (`Date#getDay()`: 0 = Sun … 6 = Sat).
 */
export function isGamificationWorkday(d: Date): boolean {
  const day = d.getDay()
  return day >= 1 && day <= 5
}
