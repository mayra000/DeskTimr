/**
 * Extension points for XP, streaks, and achievements.
 * Keep logic pure and derive inputs from PersistedDeskState + session metrics.
 */

import type { PersistedDeskState } from './types'

export interface GamificationSnapshot {
  /** Standing time this week (ms) — not tracked in v1; stub for future. */
  weeklyStandingMsEstimate: number
  /** Placeholder level derived from sitting/standing ratio when you add rules. */
  placeholderLevel: number
}

export function computeGamificationSnapshot(
  state: PersistedDeskState,
): GamificationSnapshot {
  void state
  return {
    weeklyStandingMsEstimate: 0,
    placeholderLevel: 1,
  }
}
