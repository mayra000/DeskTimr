import type { WeekDayRow } from './activitySummary'
import { formatDurationShort } from './time'

export type ActivityLogExportPayload = {
  exportedAt: string
  app: 'DeskFocus'
  today: { dayKey: string; sittingMs: number; standingMs: number }
  week: WeekDayRow[]
  weekTotals: { sittingMs: number; standingMs: number }
}

function triggerDownload(blob: Blob, filename: string) {
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function buildActivityLogExport(
  todayKey: string,
  today: { sittingMs: number; standingMs: number },
  weekRows: WeekDayRow[],
  weekTotals: { sittingMs: number; standingMs: number },
): ActivityLogExportPayload {
  return {
    exportedAt: new Date().toISOString(),
    app: 'DeskFocus',
    today: {
      dayKey: todayKey,
      sittingMs: today.sittingMs,
      standingMs: today.standingMs,
    },
    week: weekRows,
    weekTotals,
  }
}

export function exportActivityLogJson(payload: ActivityLogExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
    triggerDownload(blob, `deskfocus-log-${payload.today.dayKey}.json`)
}

export async function exportActivityLogExcel(payload: ActivityLogExportPayload) {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()

  const todaySheet = [
    ['Posture', 'Time (ms)', 'Time'],
    [
      'Sitting',
      payload.today.sittingMs,
      formatDurationShort(payload.today.sittingMs),
    ],
    [
      'Standing',
      payload.today.standingMs,
      formatDurationShort(payload.today.standingMs),
    ],
  ]
  const wsToday = XLSX.utils.aoa_to_sheet(todaySheet)
  XLSX.utils.book_append_sheet(wb, wsToday, 'Today')

  const weekHeader = [
    'Day',
    'Date',
    'Day key',
    'Sitting (ms)',
    'Standing (ms)',
    'Sitting',
    'Standing',
  ]
  const weekBody = payload.week.map((r) => [
    r.weekdayShort,
    r.dayLabel,
    r.dayKey,
    r.sittingMs,
    r.standingMs,
    formatDurationShort(r.sittingMs),
    formatDurationShort(r.standingMs),
  ])
  const weekTotalRow = [
    'Week total',
    '',
    '',
    payload.weekTotals.sittingMs,
    payload.weekTotals.standingMs,
    formatDurationShort(payload.weekTotals.sittingMs),
    formatDurationShort(payload.weekTotals.standingMs),
  ]
  const wsWeek = XLSX.utils.aoa_to_sheet([
    weekHeader,
    ...weekBody,
    weekTotalRow,
  ])
  XLSX.utils.book_append_sheet(wb, wsWeek, 'This week')

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  triggerDownload(blob, `deskfocus-log-${payload.today.dayKey}.xlsx`)
}
