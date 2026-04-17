import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'deskfocus-pomodoro-tasks'

export const POMODORO_MS = 25 * 60 * 1000
export const SHORT_BREAK_MS = 5 * 60 * 1000
export const LONG_BREAK_MS = 15 * 60 * 1000

export type PomodoroPhase = 'pomodoro' | 'shortBreak' | 'longBreak'

export type PomodoroTask = {
  id: string
  title: string
  done: boolean
}

function durationForPhase(phase: PomodoroPhase): number {
  switch (phase) {
    case 'pomodoro':
      return POMODORO_MS
    case 'shortBreak':
      return SHORT_BREAK_MS
    case 'longBreak':
      return LONG_BREAK_MS
  }
}

function loadTasks(): { tasks: PomodoroTask[]; activeTaskId: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { tasks: [], activeTaskId: null }
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { tasks: [], activeTaskId: null }
    const o = parsed as Record<string, unknown>
    const tasksRaw = o.tasks
    if (!Array.isArray(tasksRaw)) return { tasks: [], activeTaskId: null }
    const tasks: PomodoroTask[] = tasksRaw
      .filter(
        (t): t is PomodoroTask =>
          t != null &&
          typeof t === 'object' &&
          typeof (t as PomodoroTask).id === 'string' &&
          typeof (t as PomodoroTask).title === 'string' &&
          typeof (t as PomodoroTask).done === 'boolean',
      )
      .map((t) => ({
        id: t.id,
        title: t.title.slice(0, 200),
        done: t.done,
      }))
    let activeTaskId =
      typeof o.activeTaskId === 'string' ? o.activeTaskId : null
    if (activeTaskId && !tasks.some((t) => t.id === activeTaskId)) {
      activeTaskId = tasks.find((t) => !t.done)?.id ?? null
    }
    return { tasks, activeTaskId }
  } catch {
    return { tasks: [], activeTaskId: null }
  }
}

function saveTasks(tasks: PomodoroTask[], activeTaskId: string | null) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, activeTaskId }),
    )
  } catch {
    /* ignore quota */
  }
}

export function usePomodoro() {
  const [phase, setPhase] = useState<PomodoroPhase>('pomodoro')
  const [remainingMs, setRemainingMs] = useState(POMODORO_MS)
  const [running, setRunning] = useState(false)
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0)
  const [tasks, setTasks] = useState<PomodoroTask[]>(() => loadTasks().tasks)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(
    () => loadTasks().activeTaskId,
  )

  const endAtRef = useRef<number | null>(null)
  const phaseRef = useRef(phase)

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const syncFromEndAt = useCallback(() => {
    const end = endAtRef.current
    if (end == null) return 0
    return Math.max(0, end - Date.now())
  }, [])

  const completePhase = useCallback(() => {
    const p = phaseRef.current
    setRunning(false)

    if (p === 'pomodoro') {
      setPomodorosCompleted((c) => {
        const next = c + 1
        if (next > 0 && next % 4 === 0) {
          setPhase('longBreak')
          setRemainingMs(LONG_BREAK_MS)
        } else {
          setPhase('shortBreak')
          setRemainingMs(SHORT_BREAK_MS)
        }
        return next
      })
      return
    }

    setPhase('pomodoro')
    setRemainingMs(POMODORO_MS)
  }, [])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      const end = endAtRef.current
      if (end == null) return
      const left = Math.max(0, end - Date.now())
      setRemainingMs(left)
      if (left <= 0) {
        endAtRef.current = null
        completePhase()
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [running, completePhase])

  const start = useCallback(() => {
    if (remainingMs <= 0) return
    endAtRef.current = Date.now() + remainingMs
    setRunning(true)
  }, [remainingMs])

  const pause = useCallback(() => {
    const left = syncFromEndAt()
    endAtRef.current = null
    setRemainingMs(left)
    setRunning(false)
  }, [syncFromEndAt])

  const toggleRunning = useCallback(() => {
    if (running) pause()
    else start()
  }, [running, pause, start])

  const setPhaseTab = useCallback((next: PomodoroPhase) => {
    endAtRef.current = null
    setRunning(false)
    setPhase(next)
    setRemainingMs(durationForPhase(next))
  }, [])

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return
    const id = crypto.randomUUID()
    setTasks((prev) => [...prev, { id, title: trimmed.slice(0, 200), done: false }])
    setActiveTaskId((cur) => cur ?? id)
  }, [])

  const toggleTaskDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    )
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => {
      const next = prev.filter((t) => t.id !== id)
      queueMicrotask(() => {
        setActiveTaskId((aid) => {
          if (aid !== id) return aid
          return next.find((t) => !t.done)?.id ?? next[0]?.id ?? null
        })
      })
      return next
    })
  }, [])

  const selectActiveTask = useCallback((id: string | null) => {
    setActiveTaskId(id)
  }, [])

  useEffect(() => {
    saveTasks(tasks, activeTaskId)
  }, [tasks, activeTaskId])

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null

  const statusLine =
    phase === 'pomodoro'
      ? 'Time to focus!'
      : phase === 'shortBreak'
        ? 'Take a short break!'
        : 'Take a long break!'

  const focusSessionLabel =
    phase === 'pomodoro' ? `#${pomodorosCompleted + 1}` : null

  return {
    phase,
    remainingMs,
    running,
    pomodorosCompleted,
    tasks,
    activeTask,
    activeTaskId,
    statusLine,
    focusSessionLabel,
    setPhaseTab,
    toggleRunning,
    addTask,
    toggleTaskDone,
    removeTask,
    selectActiveTask,
    startLabel: running ? 'PAUSE' : 'START',
  }
}
