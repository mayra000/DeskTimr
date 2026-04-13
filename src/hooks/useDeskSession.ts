import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { pruneDailyLog, addPostureDeltaAcrossDays } from '../lib/dailyLog'
import { computeGamificationSnapshot } from '../lib/gamification'
import { ensureWeekKey, getWeekKey } from '../lib/week'
import type { DeskStorage } from '../lib/storage'
import { clampCountdownDurationEditableMs } from '../lib/time'
import {
  DEFAULT_COUNTDOWN_DURATION_MS,
  type PersistedDeskState,
  type Posture,
} from '../lib/types'

function defaultState(): PersistedDeskState {
  const now = new Date()
  return {
    version: 4,
    posture: 'sitting',
    running: false,
    sessionPausedMs: 0,
    runStartedAt: null,
    weeklySittingMs: 0,
    weekKey: getWeekKey(now),
    factIndex: 0,
    dailyLog: {},
    sessionDisplayMode: 'stopwatch',
    countdownDurationMs: DEFAULT_COUNTDOWN_DURATION_MS,
  }
}

function clampFactIndex(index: number, len: number): number {
  if (len <= 0) return 0
  const m = ((index % len) + len) % len
  return m
}

export function useDeskSession(storage: DeskStorage, factCount: number) {
  const [state, setState] = useState<PersistedDeskState>(() => {
    const loaded = storage.load()
    if (loaded) {
      const w = ensureWeekKey(loaded, new Date())
      const now = new Date()
      return {
        ...w,
        factIndex: clampFactIndex(w.factIndex, factCount),
        dailyLog: pruneDailyLog(w.dailyLog, now),
        countdownDurationMs: clampCountdownDurationEditableMs(w.countdownDurationMs),
      }
    }
    return defaultState()
  })

  const [nowMs, setNowMs] = useState(() => Date.now())
  const lastReconcileAt = useRef<number | null>(null)

  const persist = useCallback(
    (next: PersistedDeskState) => {
      storage.save(next)
    },
    [storage],
  )

  const reconcile = useCallback(
    (at: number) => {
      const from = lastReconcileAt.current
      if (from === null) {
        lastReconcileAt.current = at
        return
      }
      const delta = at - from
      if (delta <= 0) return
      lastReconcileAt.current = at
      setState((prev) => {
        let next = ensureWeekKey(prev, new Date(at))
        if (next.posture === 'sitting' && next.running && next.runStartedAt !== null) {
          next = {
            ...next,
            weeklySittingMs: next.weeklySittingMs + delta,
          }
          next = addPostureDeltaAcrossDays(next, from, at, 'sitting')
        }
        if (next.posture === 'standing' && next.running && next.runStartedAt !== null) {
          next = addPostureDeltaAcrossDays(next, from, at, 'standing')
        }
        next = {
          ...next,
          dailyLog: pruneDailyLog(next.dailyLog, new Date(at)),
        }
        return next
      })
    },
    [],
  )

  useEffect(() => {
    const id = window.setInterval(() => {
      const n = Date.now()
      reconcile(n)
      setNowMs(n)
    }, 250)
    return () => window.clearInterval(id)
  }, [reconcile])

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        const n = Date.now()
        reconcile(n)
        setNowMs(n)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [reconcile])

  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const onUnload = () => {
      storage.save(stateRef.current)
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [storage])

  useEffect(() => {
    const id = window.setInterval(() => {
      persist(state)
    }, 2000)
    return () => window.clearInterval(id)
  }, [persist, state])

  const sessionElapsedMs = useMemo(() => {
    const s = state
    const base = s.sessionPausedMs
    if (s.running && s.runStartedAt !== null) {
      return base + (nowMs - s.runStartedAt)
    }
    return base
  }, [state, nowMs])

  const play = useCallback(() => {
    const t = Date.now()
    reconcile(t)
    setNowMs(t)
    setState((prev) => {
      if (prev.running) return prev
      const next: PersistedDeskState = {
        ...prev,
        running: true,
        runStartedAt: t,
      }
      persist(next)
      return next
    })
  }, [persist, reconcile])

  const pause = useCallback(() => {
    const t = Date.now()
    reconcile(t)
    setNowMs(t)
    setState((prev) => {
      if (!prev.running) return prev
      const runStart = prev.runStartedAt
      const add = runStart !== null ? t - runStart : 0
      const next: PersistedDeskState = {
        ...prev,
        running: false,
        sessionPausedMs: prev.sessionPausedMs + add,
        runStartedAt: null,
      }
      persist(next)
      return next
    })
  }, [persist, reconcile])

  const clearSession = useCallback(() => {
    const t = Date.now()
    reconcile(t)
    setNowMs(t)
    setState((prev) => {
      if (prev.running) return prev
      if (prev.sessionPausedMs === 0 && prev.runStartedAt === null) return prev
      const next: PersistedDeskState = {
        ...prev,
        running: false,
        sessionPausedMs: 0,
        runStartedAt: null,
      }
      persist(next)
      return next
    })
  }, [persist, reconcile])

  const switchPosture = useCallback(() => {
    const t = Date.now()
    reconcile(t)
    setNowMs(t)
    setState((prev) => {
      const nextPosture: Posture = prev.posture === 'sitting' ? 'standing' : 'sitting'
      const next: PersistedDeskState = {
        ...ensureWeekKey(prev, new Date(t)),
        posture: nextPosture,
        sessionPausedMs: 0,
        runStartedAt: prev.running ? t : null,
        running: prev.running,
      }
      persist(next)
      return next
    })
  }, [persist, reconcile])

  const factPrev = useCallback(() => {
    setState((prev) => {
      const next: PersistedDeskState = {
        ...prev,
        factIndex: clampFactIndex(prev.factIndex - 1, factCount),
      }
      persist(next)
      return next
    })
  }, [factCount, persist])

  const factNext = useCallback(() => {
    setState((prev) => {
      const next: PersistedDeskState = {
        ...prev,
        factIndex: clampFactIndex(prev.factIndex + 1, factCount),
      }
      persist(next)
      return next
    })
  }, [factCount, persist])

  const toggleSessionDisplayMode = useCallback(() => {
    const t = Date.now()
    reconcile(t)
    setNowMs(t)
    setState((prev) => {
      let next = ensureWeekKey(prev, new Date(t))
      if (next.running) {
        const runStart = next.runStartedAt
        const add = runStart !== null ? t - runStart : 0
        next = {
          ...next,
          running: false,
          sessionPausedMs: prev.sessionPausedMs + add,
          runStartedAt: null,
        }
      }
      const newMode = next.sessionDisplayMode === 'stopwatch' ? 'countdown' : 'stopwatch'
      next = {
        ...next,
        sessionDisplayMode: newMode,
        sessionPausedMs: 0,
        runStartedAt: null,
      }
      persist(next)
      return next
    })
  }, [persist, reconcile])

  const setCountdownDurationMs = useCallback(
    (ms: number) => {
      setState((prev) => {
        if (prev.running || prev.sessionDisplayMode !== 'countdown') return prev
        const nextMs = clampCountdownDurationEditableMs(ms)
        if (nextMs === prev.countdownDurationMs) return prev
        const next: PersistedDeskState = {
          ...prev,
          countdownDurationMs: nextMs,
        }
        persist(next)
        return next
      })
    },
    [persist],
  )

  const completeCountdownSession = useCallback(() => {
    const t = Date.now()
    reconcile(t)
    setNowMs(t)
    setState((prev) => {
      if (!prev.running || prev.sessionDisplayMode !== 'countdown') return prev
      const next: PersistedDeskState = {
        ...prev,
        running: false,
        sessionPausedMs: 0,
        runStartedAt: null,
      }
      persist(next)
      return next
    })
  }, [persist, reconcile])

  /** Wipe saved logs, weekly totals, and reset the timer to defaults (local storage). */
  const clearAllUserData = useCallback(() => {
    const now = new Date()
    const t = Date.now()
    lastReconcileAt.current = t
    setNowMs(t)
    const base = defaultState()
    const w = ensureWeekKey(base, now)
    const next: PersistedDeskState = {
      ...w,
      factIndex: clampFactIndex(0, factCount),
      dailyLog: pruneDailyLog({}, now),
      countdownDurationMs: clampCountdownDurationEditableMs(w.countdownDurationMs),
    }
    persist(next)
    setState(next)
  }, [factCount, persist])

  const gamificationSnapshot = useMemo(
    () => computeGamificationSnapshot(state),
    [state],
  )

  return {
    state,
    sessionElapsedMs,
    nowMs,
    play,
    pause,
    clearSession,
    switchPosture,
    factPrev,
    factNext,
    toggleSessionDisplayMode,
    setCountdownDurationMs,
    completeCountdownSession,
    clearAllUserData,
    gamificationSnapshot,
  }
}
