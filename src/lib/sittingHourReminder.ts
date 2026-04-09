/** One hour in ms — milestone for sitting reminders. */
export const SITTING_HOUR_MS = 60 * 60 * 1000

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  if (!audioContext) audioContext = new Ctx()
  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }
  return audioContext
}

function beep(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  gain: number,
) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(frequency, startTime)
  g.gain.setValueAtTime(0, startTime)
  g.gain.linearRampToValueAtTime(gain, startTime + 0.02)
  g.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)
}

/** Soft two-tone chime when a full hour of sitting is reached. */
export function playSittingHourChime(): void {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  beep(ctx, 880, t, 0.22, 0.12)
  beep(ctx, 1320, t + 0.28, 0.2, 0.1)
}

const STRETCH_HINTS = [
  'Roll your shoulders, stretch your neck, and look away from the screen.',
  'Stand up, reach toward the ceiling, then touch your toes gently.',
  'Walk for a minute and sip some water.',
]

function pickStretchHint(hour: number): string {
  return STRETCH_HINTS[hour % STRETCH_HINTS.length]
}

export function notifySittingHourComplete(hour: number): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  const hint = pickStretchHint(hour)
  try {
    new Notification('DeskTimr — time for a break', {
      body:
        hour === 1
          ? `You've been sitting for an hour. Switch to standing or take a quick stretch. ${hint}`
          : `You've been sitting for ${hour} hours. Take a standing break or do some stretches. ${hint}`,
      tag: 'desktimr-sitting-hour',
      requireInteraction: false,
    })
  } catch {
    /* older browsers / blocked */
  }
}
