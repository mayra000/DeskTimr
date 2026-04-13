/**
 * Gamification uses the user's local calendar. Mon–Fri are "workdays" for goals
 * and streaks; Sat–Sun are skipped when walking streaks backward (they neither
 * add nor break a streak).
 */

/** Default daily standing target until user-configurable goals exist. */
export const DEFAULT_STANDING_GOAL_MS = 60 * 60 * 1000

/**
 * Monday–Friday in local time (`Date#getDay()`: 0 = Sun … 6 = Sat).
 */
export function isGamificationWorkday(d: Date): boolean {
  const day = d.getDay()
  return day >= 1 && day <= 5
}
