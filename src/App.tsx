import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { AppMode } from './components/Header'
import { FACTS } from './data/facts'
import { useDeskSession } from './hooks/useDeskSession'
import {
  getCountdownSessionFillRatio,
  getPostureFillRatio,
} from './lib/postureFill'
import {
  getTodayFromLog,
  getWeekDayRows,
  sumWeek,
} from './lib/activitySummary'
import {
  notifyPostureReminder,
  playPostureReminderChime,
} from './lib/postureReminderAlerts'
import {
  notifySittingHourComplete,
  playSittingHourChime,
  SITTING_HOUR_MS,
} from './lib/sittingHourReminder'
import {
  fireStandingMilestoneConfetti,
  STANDING_CONFETTI_INTERVAL_MS,
} from './lib/standingConfetti'
import { createLocalStorageAdapter } from './lib/storage'
import { ActivityLogTable } from './components/ActivityLogTable'
import { Header } from './components/Header'
import { PomodoroView } from './components/PomodoroView'
import { MainTimer } from './components/MainTimer'
import { TimerControls } from './components/TimerControls'
import { PostureToggle } from './components/PostureToggle'
import { FactCarousel } from './components/FactCarousel'
import { WeeklySummary } from './components/WeeklySummary'
import { StandingGoalControl } from './components/StandingGoalControl'
import { StandingWeekBadges } from './components/StandingWeekBadges'
import { DeskPostureStrip } from './components/DeskPostureStrip'
import './App.css'

const storage = createLocalStorageAdapter()

const APP_MODE_KEY = 'deskfocus-app-mode'

function loadAppMode(): AppMode {
  try {
    const v = localStorage.getItem(APP_MODE_KEY)
    if (v === 'pomodoro' || v === 'desk') return v
  } catch {
    /* ignore */
  }
  return 'desk'
}

/** Advance the fact carousel automatically (manual prev/next still works). */
const FACT_AUTO_CYCLE_MS = 30_000

function App() {
  const [appMode, setAppMode] = useState<AppMode>(() => loadAppMode())
  const {
    state,
    sessionElapsedMs,
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
    standingGoalMs,
    adjustStandingGoalMs,
  } = useDeskSession(storage, FACTS.length)

  const lastSittingHourAnnouncedRef = useRef(0)
  /** Count of completed 30‑min standing milestones already celebrated this segment. */
  const lastStandingConfettiMilestoneRef = useRef(0)
  const countdownCompletionRef = useRef(false)
  /** Bumps only on auto-advance so the fact line can play a subtle enter animation. */
  const [factAutoAnimKey, setFactAutoAnimKey] = useState(0)

  useEffect(() => {
    if (state.posture !== 'sitting') {
      lastSittingHourAnnouncedRef.current = 0
      return
    }
    if (sessionElapsedMs === 0) {
      lastSittingHourAnnouncedRef.current = 0
      return
    }
    if (!state.running) return
    const completedHours = Math.floor(sessionElapsedMs / SITTING_HOUR_MS)
    if (completedHours < 1 || completedHours <= lastSittingHourAnnouncedRef.current) return
    lastSittingHourAnnouncedRef.current = completedHours
    playSittingHourChime()
    notifySittingHourComplete(completedHours)
  }, [sessionElapsedMs, state.posture, state.running])

  useEffect(() => {
    if (state.posture !== 'standing') {
      lastStandingConfettiMilestoneRef.current = 0
      return
    }
    if (sessionElapsedMs === 0) {
      lastStandingConfettiMilestoneRef.current = 0
      return
    }
    if (!state.running) return
    const milestones = Math.floor(
      sessionElapsedMs / STANDING_CONFETTI_INTERVAL_MS,
    )
    if (
      milestones < 1 ||
      milestones <= lastStandingConfettiMilestoneRef.current
    ) {
      return
    }
    lastStandingConfettiMilestoneRef.current = milestones
    fireStandingMilestoneConfetti()
  }, [sessionElapsedMs, state.posture, state.running])

  useEffect(() => {
    if (state.sessionDisplayMode !== 'countdown') {
      countdownCompletionRef.current = false
      return
    }
    if (!state.running) {
      if (sessionElapsedMs === 0) countdownCompletionRef.current = false
      return
    }
    if (sessionElapsedMs < state.countdownDurationMs) return
    if (countdownCompletionRef.current) return
    countdownCompletionRef.current = true
    completeCountdownSession()
    playPostureReminderChime(state.posture)
    notifyPostureReminder(state.posture, 'countdown')
  }, [
    state.sessionDisplayMode,
    state.running,
    state.countdownDurationMs,
    state.posture,
    sessionElapsedMs,
    completeCountdownSession,
  ])

  useEffect(() => {
    if (FACTS.length <= 1) return
    const id = window.setInterval(() => {
      factNext()
      setFactAutoAnimKey((k) => k + 1)
    }, FACT_AUTO_CYCLE_MS)
    return () => window.clearInterval(id)
  }, [factNext])

  const playWithNotificationOptIn = useCallback(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission()
    }
    play()
  }, [play])

  const fact = useMemo(
    () => FACTS[state.factIndex] ?? FACTS[0],
    [state.factIndex],
  )

  const mainTimerLabel = useMemo(() => {
    if (state.sessionDisplayMode === 'stopwatch') {
      return state.posture === 'sitting'
        ? 'YOU HAVE BEEN SITTING FOR'
        : 'YOU HAVE BEEN STANDING FOR'
    }
    return state.running ? 'TIME LEFT' : 'COUNTDOWN'
  }, [state.posture, state.running, state.sessionDisplayMode])

  const toggleLabel =
    state.posture === 'sitting' ? 'SWITCH TO STANDING' : 'SWITCH TO SITTING'

  const backgroundFillRatio = useMemo(() => {
    if (state.sessionDisplayMode === 'countdown') {
      return getCountdownSessionFillRatio(
        sessionElapsedMs,
        state.countdownDurationMs,
      )
    }
    return getPostureFillRatio(sessionElapsedMs)
  }, [
    state.sessionDisplayMode,
    state.countdownDurationMs,
    sessionElapsedMs,
  ])

  const todayLog = useMemo(
    () => getTodayFromLog(new Date(), state.dailyLog),
    [state.dailyLog],
  )
  const weekRows = useMemo(
    () => getWeekDayRows(new Date(), state.dailyLog),
    [state.dailyLog],
  )
  const weekTotals = useMemo(() => sumWeek(weekRows), [weekRows])

  useEffect(() => {
    document.documentElement.dataset.posture = state.posture
  }, [state.posture])

  useEffect(() => {
    if (appMode === 'pomodoro') {
      document.documentElement.dataset.appMode = 'pomodoro'
    } else {
      delete document.documentElement.dataset.appMode
    }
    try {
      localStorage.setItem(APP_MODE_KEY, appMode)
    } catch {
      /* ignore */
    }
  }, [appMode])

  const onAppModeChange = useCallback((mode: AppMode) => {
    setAppMode(mode)
  }, [])

  return (
    <div
      className="app"
      data-app-mode={appMode}
      data-gam-level={gamificationSnapshot.placeholderLevel}
    >
      <div
        className="app__posture-fill"
        data-posture={state.posture}
        style={
          { '--fill-ratio': String(backgroundFillRatio) } as CSSProperties
        }
        aria-hidden="true"
      />
      <Header appMode={appMode} onAppModeChange={onAppModeChange} />

      {appMode === 'pomodoro' ? (
        <div className="app__stage app__stage--pomodoro">
          <div className="app__main app__main--pomodoro">
            <PomodoroView />
          </div>
        </div>
      ) : (
        <>
          <div className="app__stage app__stage--desk">
            <div className="app__main app__main--desk">
              <div className="desk-timer">
                <div className="desk-timer__card">
                  <DeskPostureStrip posture={state.posture} />
                  <MainTimer
                    label={mainTimerLabel}
                    sessionDisplayMode={state.sessionDisplayMode}
                    elapsedMs={sessionElapsedMs}
                    countdownDurationMs={state.countdownDurationMs}
                    running={state.running}
                    onSetCountdownDurationMs={setCountdownDurationMs}
                  />
                  <TimerControls
                    running={state.running}
                    canClear={!state.running && sessionElapsedMs > 0}
                    sessionDisplayMode={state.sessionDisplayMode}
                    onPlay={playWithNotificationOptIn}
                    onPause={pause}
                    onClear={clearSession}
                    onToggleDisplayMode={toggleSessionDisplayMode}
                  />
                  <PostureToggle
                    label={toggleLabel}
                    onClick={switchPosture}
                  />
                </div>
                <div className="desk-timer__below">
                  <div className="desk-timer__rings">
                    <StandingWeekBadges
                      days={gamificationSnapshot.workweekStandingBadges}
                    />
                  </div>
                  <div className="desk-timer__goal">
                    <StandingGoalControl
                      goalMs={standingGoalMs}
                      onAdjust={adjustStandingGoalMs}
                    />
                  </div>
                </div>
              </div>
            </div>

            <footer className="app-footer app-footer--desk">
              <div className="app-footer__left">
                <FactCarousel
                  fact={fact}
                  onPrev={factPrev}
                  onNext={factNext}
                  autoAdvanceKey={factAutoAnimKey}
                />
              </div>
              <WeeklySummary
                label="TIME SPENT SITTING THIS WEEK:"
                weeklySittingMs={state.weeklySittingMs}
                onClearData={clearAllUserData}
              />
            </footer>
          </div>

          <ActivityLogTable
            todayKey={todayLog.dayKey}
            today={{
              sittingMs: todayLog.sittingMs,
              standingMs: todayLog.standingMs,
            }}
            weekRows={weekRows}
            weekTotals={weekTotals}
          />
        </>
      )}
    </div>
  )
}

export default App
