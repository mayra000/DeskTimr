import type { Posture } from './types'

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
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

/** Short chime when a posture reminder fires. */
export function playPostureReminderChime(posture: Posture): void {
  const ctx = getAudioContext()
  if (!ctx) return
  const t = ctx.currentTime
  if (posture === 'sitting') {
    beep(ctx, 660, t, 0.18, 0.11)
    beep(ctx, 990, t + 0.22, 0.22, 0.09)
  } else {
    beep(ctx, 520, t, 0.16, 0.1)
    beep(ctx, 780, t + 0.2, 0.2, 0.08)
  }
}

export function notifyPostureReminder(
  posture: Posture,
  kind: 'countdown' | 'clock',
): void {
  if (typeof Notification === 'undefined') return
  if (Notification.permission !== 'granted') return
  const title =
    posture === 'sitting'
      ? 'DeskTimr — sitting reminder'
      : 'DeskTimr — standing reminder'
  const body =
    posture === 'sitting'
      ? kind === 'countdown'
        ? 'You reached your sitting duration. Stand up, stretch, or switch posture.'
        : 'Your scheduled sitting reminder — time to stand or move.'
      : kind === 'countdown'
        ? 'You reached your standing duration. Sit down or rest your legs if needed.'
        : 'Your scheduled standing reminder — time to sit or change posture.'
  try {
    new Notification(title, {
      body,
      tag: `desktimr-posture-${posture}-${kind}`,
      requireInteraction: false,
    })
  } catch {
    /* older browsers / blocked */
  }
}
