export type Posture = 'sitting' | 'standing'

export const STORAGE_KEY = 'desktimer:v1' as const

/** 5 minutes in ms — countdown duration steps */
export const COUNTDOWN_STEP_MS = 5 * 60 * 1000

export const DEFAULT_COUNTDOWN_DURATION_MS = 30 * 60 * 1000

export interface DailyPostureMs {
  sittingMs: number
  standingMs: number
}

export interface PersistedDeskStateV1 {
  version: 1
  posture: Posture
  running: boolean
  sessionPausedMs: number
  runStartedAt: number | null
  weeklySittingMs: number
  weekKey: string
  factIndex: number
}

export interface PersistedDeskStateV2 {
  version: 2
  posture: Posture
  running: boolean
  sessionPausedMs: number
  runStartedAt: number | null
  weeklySittingMs: number
  weekKey: string
  factIndex: number
  dailyLog: Record<string, DailyPostureMs>
}

/** @deprecated migrated from v3 — only used for storage migration */
export type PostureReminderMode = 'off' | 'countdown' | 'clock'

/** @deprecated migrated from v3 */
export interface PostureReminderConfig {
  mode: PostureReminderMode
  countdownMs: number
  clockHour: number
  clockMinute: number
}

export interface PersistedDeskStateV3 {
  version: 3
  posture: Posture
  running: boolean
  sessionPausedMs: number
  runStartedAt: number | null
  weeklySittingMs: number
  weekKey: string
  factIndex: number
  dailyLog: Record<string, DailyPostureMs>
  sittingReminder: PostureReminderConfig
  standingReminder: PostureReminderConfig
}

export type SessionDisplayMode = 'stopwatch' | 'countdown'

export interface PersistedDeskState {
  version: 4
  posture: Posture
  running: boolean
  sessionPausedMs: number
  runStartedAt: number | null
  weeklySittingMs: number
  weekKey: string
  factIndex: number
  dailyLog: Record<string, DailyPostureMs>
  /** Stopwatch (elapsed) vs countdown timer */
  sessionDisplayMode: SessionDisplayMode
  /** Target duration for countdown mode; always a multiple of COUNTDOWN_STEP_MS */
  countdownDurationMs: number
  /** Mon–Fri daily standing ring goal; multiple of COUNTDOWN_STEP_MS when clamped */
  standingGoalMs: number
}
