import {
  COUNTDOWN_STEP_MS,
  DEFAULT_COUNTDOWN_DURATION_MS,
} from './types'

export function msToClockParts(ms: number): { h: number; m: number; s: number } {
  const safe = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(safe / 3600)
  const m = Math.floor((safe % 3600) / 60)
  const s = safe % 60
  return { h, m, s }
}

export function formatTwoDigits(n: number): string {
  return String(n).padStart(2, '0')
}

/** Compact duration for tables (e.g. "2h 15m", "42m"). */
export function formatDurationShort(ms: number): string {
  const safe = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(safe / 3600)
  const m = Math.floor((safe % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const MAX_COUNTDOWN_EDIT_MS = 12 * 60 * 60 * 1000
const MIN_COUNTDOWN_EDIT_MS = 1000

/** Clamp to 5-minute steps between one step and 12 hours (migration / legacy). */
export function clampCountdownDurationMs(ms: number): number {
  const MAX = MAX_COUNTDOWN_EDIT_MS
  const rounded = Math.round(ms / COUNTDOWN_STEP_MS) * COUNTDOWN_STEP_MS
  return Math.min(MAX, Math.max(COUNTDOWN_STEP_MS, rounded || DEFAULT_COUNTDOWN_DURATION_MS))
}

/** Clamp user-edited countdown duration: 1 second … 12 hours. */
export function clampCountdownDurationEditableMs(ms: number): number {
  const n = Math.floor(Number(ms))
  if (!Number.isFinite(n)) return DEFAULT_COUNTDOWN_DURATION_MS
  if (n <= 0) return MIN_COUNTDOWN_EDIT_MS
  return Math.min(MAX_COUNTDOWN_EDIT_MS, Math.max(MIN_COUNTDOWN_EDIT_MS, n))
}

/** Build duration from H/M/S fields; values are clamped to a valid range. */
export function msFromHms(h: number, m: number, s: number): number {
  const hh = Math.max(0, Math.floor(h))
  const mm = Math.min(59, Math.max(0, Math.floor(m)))
  const ss = Math.min(59, Math.max(0, Math.floor(s)))
  const raw = (hh * 3600 + mm * 60 + ss) * 1000
  return clampCountdownDurationEditableMs(raw)
}
