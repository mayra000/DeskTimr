import { useLayoutEffect, useRef, useState } from 'react'
import type { WeekDayRow } from '../lib/activitySummary'
import { formatDurationShort } from '../lib/time'

type Props = {
  todayKey: string
  today: { sittingMs: number; standingMs: number }
  weekRows: WeekDayRow[]
  weekTotals: { sittingMs: number; standingMs: number }
}

export function ActivityLogTable({
  todayKey,
  today,
  weekRows,
  weekTotals,
}: Props) {
  const rootRef = useRef<HTMLElement>(null)
  const [emphasized, setEmphasized] = useState(false)

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return

    const update = () => {
      const root = document.documentElement
      const scrollable = root.scrollHeight > window.innerHeight + 8
      if (!scrollable) {
        setEmphasized(true)
        return
      }
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const inView = r.top < vh && r.bottom > 0
      const fullyInView = r.top >= 0 && r.bottom <= vh
      const scrolled = window.scrollY > 12
      setEmphasized(inView && (scrolled || fullyInView))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      className="activity-log"
      data-visible={emphasized ? 'true' : 'false'}
      aria-label="Sitting and standing time log"
    >
      <h2 className="activity-log__heading">Your log</h2>
      <p className="activity-log__lede">
        Time counted while the timer is running (sitting vs standing).
      </p>

      <div className="activity-log__block">
        <h3 className="activity-log__subheading">Today</h3>
        <div className="activity-log__table-wrap">
          <table className="activity-log__table">
            <thead>
              <tr>
                <th scope="col">Posture</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sitting</td>
                <td>{formatDurationShort(today.sittingMs)}</td>
              </tr>
              <tr>
                <td>Standing</td>
                <td>{formatDurationShort(today.standingMs)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="activity-log__block">
        <h3 className="activity-log__subheading">This week</h3>
        <div className="activity-log__table-wrap">
          <table className="activity-log__table activity-log__table--week">
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Date</th>
                <th scope="col">Sitting</th>
                <th scope="col">Standing</th>
              </tr>
            </thead>
            <tbody>
              {weekRows.map((row) => (
                <tr
                  key={row.dayKey}
                  data-today={row.dayKey === todayKey ? 'true' : undefined}
                >
                  <td>{row.weekdayShort}</td>
                  <td>{row.dayLabel}</td>
                  <td>{formatDurationShort(row.sittingMs)}</td>
                  <td>{formatDurationShort(row.standingMs)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={2}>
                  Week total
                </th>
                <td>{formatDurationShort(weekTotals.sittingMs)}</td>
                <td>{formatDurationShort(weekTotals.standingMs)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}
