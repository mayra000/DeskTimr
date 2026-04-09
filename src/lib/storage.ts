import type {
  PersistedDeskState,
  PersistedDeskStateV1,
  PersistedDeskStateV2,
  PersistedDeskStateV3,
} from './types'
import {
  DEFAULT_COUNTDOWN_DURATION_MS,
  STORAGE_KEY,
} from './types'
import { clampCountdownDurationMs } from './time'

export interface DeskStorage {
  load(): PersistedDeskState | null
  save(state: PersistedDeskState): void
}

function migrateV1ToV2(v1: PersistedDeskStateV1): PersistedDeskStateV2 {
  return {
    version: 2,
    posture: v1.posture,
    running: v1.running,
    sessionPausedMs: v1.sessionPausedMs,
    runStartedAt: v1.runStartedAt,
    weeklySittingMs: v1.weeklySittingMs,
    weekKey: v1.weekKey,
    factIndex: v1.factIndex,
    dailyLog: {},
  }
}

function defaultReminderV3(): PersistedDeskStateV3['sittingReminder'] {
  return {
    mode: 'off',
    countdownMs: 30 * 60 * 1000,
    clockHour: 12,
    clockMinute: 0,
  }
}

function migrateV2ToV3(v2: PersistedDeskStateV2): PersistedDeskStateV3 {
  const d = defaultReminderV3()
  return {
    ...v2,
    version: 3,
    sittingReminder: { ...d },
    standingReminder: { ...d },
  }
}

function migrateV3ToV4(v3: PersistedDeskStateV3): PersistedDeskState {
  let duration = DEFAULT_COUNTDOWN_DURATION_MS
  if (v3.sittingReminder.mode === 'countdown') {
    duration = clampCountdownDurationMs(v3.sittingReminder.countdownMs)
  }
  return {
    version: 4,
    posture: v3.posture,
    running: v3.running,
    sessionPausedMs: v3.sessionPausedMs,
    runStartedAt: v3.runStartedAt,
    weeklySittingMs: v3.weeklySittingMs,
    weekKey: v3.weekKey,
    factIndex: v3.factIndex,
    dailyLog: v3.dailyLog,
    sessionDisplayMode: 'stopwatch',
    countdownDurationMs: duration,
  }
}

function parsePersisted(raw: unknown): PersistedDeskState | null {
  if (!raw || typeof raw !== 'object') return null
  const p = raw as Record<string, unknown>
  const ver = p.version
  if (ver === 1) {
    return migrateV3ToV4(migrateV2ToV3(migrateV1ToV2(p as unknown as PersistedDeskStateV1)))
  }
  if (ver === 2) {
    const o = p as unknown as PersistedDeskStateV2
    if (!o.dailyLog || typeof o.dailyLog !== 'object') return null
    return migrateV3ToV4(migrateV2ToV3(o))
  }
  if (ver === 3) {
    const o = p as unknown as PersistedDeskStateV3
    if (!o.dailyLog || typeof o.dailyLog !== 'object') return null
    if (!o.sittingReminder || !o.standingReminder) return null
    return migrateV3ToV4(o)
  }
  if (ver === 4) {
    const o = p as unknown as PersistedDeskState
    if (!o.dailyLog || typeof o.dailyLog !== 'object') return null
    if (o.sessionDisplayMode !== 'stopwatch' && o.sessionDisplayMode !== 'countdown') {
      return null
    }
    if (typeof o.countdownDurationMs !== 'number') return null
    return o
  }
  return null
}

export function createLocalStorageAdapter(): DeskStorage {
  return {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as unknown
        return parsePersisted(parsed)
      } catch {
        return null
      }
    },
    save(state: PersistedDeskState) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        /* quota or private mode */
      }
    },
  }
}

/** Future: replace with API-backed adapter using the same interface. */
export type StorageFactory = () => DeskStorage
