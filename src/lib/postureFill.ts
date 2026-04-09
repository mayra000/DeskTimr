/** Elapsed time in the current posture at which the screen fill reaches 100%. */
export const POSTURE_SESSION_FULL_MS = 3 * 60 * 60 * 1000

export function getPostureFillRatio(elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  return Math.min(1, elapsedMs / POSTURE_SESSION_FULL_MS)
}

/** Countdown mode: fill reaches 100% when elapsed time matches the countdown duration. */
export function getCountdownSessionFillRatio(
  elapsedMs: number,
  durationMs: number,
): number {
  if (durationMs <= 0) return 0
  return Math.min(1, Math.max(0, elapsedMs / durationMs))
}
