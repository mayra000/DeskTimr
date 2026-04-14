import { useCallback, useEffect, useState, type KeyboardEvent } from 'react'
import {
  type PomodoroPhase,
  usePomodoro,
} from '../hooks/usePomodoro'

function formatClock(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const TABS: { phase: PomodoroPhase; label: string }[] = [
  { phase: 'pomodoro', label: 'Pomodoro' },
  { phase: 'shortBreak', label: 'Short Break' },
  { phase: 'longBreak', label: 'Long Break' },
]

export function PomodoroView() {
  const {
    phase,
    remainingMs,
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
    startLabel,
  } = usePomodoro()

  const [draft, setDraft] = useState('')

  useEffect(() => {
    document.documentElement.dataset.pomodoroPhase = phase
    return () => {
      delete document.documentElement.dataset.pomodoroPhase
    }
  }, [phase])

  const onAddTask = useCallback(() => {
    addTask(draft)
    setDraft('')
  }, [addTask, draft])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onAddTask()
      }
    },
    [onAddTask],
  )

  return (
    <div className="pomodoro" data-pomodoro-phase={phase}>
      <div className="pomodoro__card">
        <div className="pomodoro__tabs" role="tablist" aria-label="Timer mode">
          {TABS.map(({ phase: p, label }) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={phase === p}
              className={
                phase === p
                  ? 'pomodoro__tab pomodoro__tab--active'
                  : 'pomodoro__tab'
              }
              onClick={() => setPhaseTab(p)}
            >
              {label}
            </button>
          ))}
        </div>

        <div
          className="pomodoro__timer"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatClock(remainingMs)}
        </div>

        <button
          type="button"
          className="pomodoro__start"
          onClick={toggleRunning}
        >
          {startLabel}
        </button>
      </div>

      <div className="pomodoro__status">
        {focusSessionLabel != null && (
          <span className="pomodoro__session-id">{focusSessionLabel}</span>
        )}
        <span className="pomodoro__status-text">{statusLine}</span>
        {activeTask && !activeTask.done && phase === 'pomodoro' && (
          <span className="pomodoro__current-task">{activeTask.title}</span>
        )}
      </div>

      <section className="pomodoro__tasks" aria-label="Tasks">
        <div className="pomodoro__tasks-head">
          <h2 className="pomodoro__tasks-title">Tasks</h2>
        </div>
        <ul className="pomodoro__task-list">
          {tasks.map((t) => (
            <li
              key={t.id}
              className={
                activeTaskId === t.id
                  ? 'pomodoro__task-row pomodoro__task-row--active'
                  : 'pomodoro__task-row'
              }
            >
              <button
                type="button"
                className={
                  t.done
                    ? 'pomodoro__task-check pomodoro__task-check--done'
                    : 'pomodoro__task-check'
                }
                aria-label={t.done ? 'Mark not done' : 'Mark done'}
                onClick={() => toggleTaskDone(t.id)}
              />
              <button
                type="button"
                className={
                  t.done
                    ? 'pomodoro__task-title pomodoro__task-title--done'
                    : 'pomodoro__task-title'
                }
                onClick={() => selectActiveTask(t.id)}
              >
                {t.title}
              </button>
              <button
                type="button"
                className="pomodoro__task-remove"
                aria-label={`Remove ${t.title}`}
                onClick={() => removeTask(t.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="pomodoro__add-dashed">
          <span className="pomodoro__add-plus" aria-hidden="true">
            +
          </span>
          <input
            className="pomodoro__add-input"
            placeholder="Add Task"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            maxLength={200}
            aria-label="Add task"
          />
        </div>
      </section>
    </div>
  )
}
