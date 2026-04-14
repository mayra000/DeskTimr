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
      <div className="pomodoro__above-fold">
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

      <article
        className="pomodoro-article"
        aria-labelledby="pomodoro-article-heading"
      >
        <h2 id="pomodoro-article-heading" className="pomodoro-article__title">
          The Pomodoro Technique
        </h2>

        <section className="pomodoro-article__section" aria-labelledby="pomodoro-what-heading">
          <h3 id="pomodoro-what-heading" className="pomodoro-article__h">
            What it is
          </h3>
          <p className="pomodoro-article__p">
            The Pomodoro Technique is a time-management method: you work in focused
            intervals (classically 25 minutes), then take a short break before the next
            round. After several focus rounds you take a longer break. The idea is to
            make deep work predictable and to build rest into the rhythm instead of
            burning out in one long stretch.
          </p>
        </section>

        <section className="pomodoro-article__section" aria-labelledby="pomodoro-when-heading">
          <h3 id="pomodoro-when-heading" className="pomodoro-article__h">
            When it started
          </h3>
          <p className="pomodoro-article__p">
            Francesco Cirillo developed the technique as a university student in the
            late 1980s. He used a kitchen timer shaped like a tomato—
            <span lang="it">pomodoro</span> in Italian—hence the name. It has since
            been described in books and courses and is widely used in software,
            studying, and creative work.
          </p>
        </section>

        <section className="pomodoro-article__section" aria-labelledby="pomodoro-why-heading">
          <h3 id="pomodoro-why-heading" className="pomodoro-article__h">
            Why it works well
          </h3>
          <p className="pomodoro-article__p">
            Short, bounded sessions reduce the anxiety of “finishing the whole
            project” and make it easier to start. Breaks help sustain attention and
            give your eyes and body a reset—especially valuable if you sit at a desk.
            Many people also like the clear signal to ignore distractions until the
            timer rings.
          </p>
        </section>

        <section
          className="pomodoro-article__sources"
          aria-labelledby="pomodoro-sources-heading"
        >
          <h3 id="pomodoro-sources-heading" className="pomodoro-article__h">
            Sources
          </h3>
          <ul className="pomodoro-article__source-list">
            <li>
              <a
                href="https://francescocirillo.com/pages/pomodoro-technique"
                className="pomodoro-article__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cirillo, Francesco — Pomodoro Technique (official overview)
              </a>
            </li>
            <li>
              <a
                href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
                className="pomodoro-article__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia — Pomodoro Technique
              </a>
            </li>
          </ul>
        </section>
      </article>
    </div>
  )
}
