export type RingerSound =
  | 'chime'
  | 'bell'
  | 'soft'
  | 'beep'
  | 'victory'
  | 'digital'

export const RINGER_OPTIONS: { value: RingerSound; label: string }[] = [
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'soft', label: 'Soft Pad' },
  { value: 'beep', label: 'Beep' },
  { value: 'victory', label: 'Victory' },
  { value: 'digital', label: 'Digital' },
]

let sharedCtx: AudioContext | null = null
function getCtx(): AudioContext {
  if (!sharedCtx) {
    type Win = Window & { webkitAudioContext?: typeof AudioContext }
    const Ctor: typeof AudioContext =
      window.AudioContext ?? (window as Win).webkitAudioContext!
    sharedCtx = new Ctor()
  }
  if (sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {})
  }
  return sharedCtx
}

type Note = {
  freq: number
  start: number
  duration: number
  type?: OscillatorType
  gain?: number
}

function playSequence(notes: Note[], masterGain: number) {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime
    const master = ctx.createGain()
    master.gain.value = masterGain
    master.connect(ctx.destination)

    for (const note of notes) {
      const osc = ctx.createOscillator()
      const env = ctx.createGain()
      osc.type = note.type ?? 'sine'
      osc.frequency.value = note.freq
      env.gain.value = 0
      const peak = note.gain ?? 1
      const startAt = now + note.start
      const endAt = startAt + note.duration
      env.gain.setValueAtTime(0, startAt)
      env.gain.linearRampToValueAtTime(peak, startAt + 0.012)
      env.gain.exponentialRampToValueAtTime(0.0001, endAt)
      osc.connect(env)
      env.connect(master)
      osc.start(startAt)
      osc.stop(endAt + 0.05)
    }
  } catch {
    // noop — audio not available
  }
}

export function playRinger(sound: RingerSound, volume = 0.6) {
  const v = Math.max(0, Math.min(1, volume))
  switch (sound) {
    case 'chime':
      playSequence(
        [
          { freq: 880, start: 0,    duration: 0.55, type: 'sine' },
          { freq: 1318, start: 0.18, duration: 0.55, type: 'sine' },
          { freq: 1760, start: 0.36, duration: 0.7,  type: 'sine' },
        ],
        v * 0.55,
      )
      return
    case 'bell':
      playSequence(
        [
          { freq: 660,  start: 0,    duration: 1.2, type: 'triangle', gain: 1 },
          { freq: 1320, start: 0,    duration: 1.0, type: 'sine',     gain: 0.4 },
          { freq: 1980, start: 0.02, duration: 0.7, type: 'sine',     gain: 0.15 },
        ],
        v * 0.5,
      )
      return
    case 'soft':
      playSequence(
        [
          { freq: 392, start: 0,    duration: 1.1, type: 'sine',     gain: 0.9 },
          { freq: 523, start: 0.05, duration: 1.0, type: 'triangle', gain: 0.5 },
          { freq: 659, start: 0.10, duration: 0.9, type: 'sine',     gain: 0.4 },
        ],
        v * 0.5,
      )
      return
    case 'beep':
      playSequence(
        [
          { freq: 1000, start: 0,    duration: 0.18, type: 'square' },
          { freq: 1000, start: 0.28, duration: 0.18, type: 'square' },
          { freq: 1000, start: 0.56, duration: 0.18, type: 'square' },
        ],
        v * 0.35,
      )
      return
    case 'victory':
      playSequence(
        [
          { freq: 523,  start: 0,    duration: 0.22, type: 'triangle' },
          { freq: 659,  start: 0.18, duration: 0.22, type: 'triangle' },
          { freq: 784,  start: 0.36, duration: 0.22, type: 'triangle' },
          { freq: 1046, start: 0.54, duration: 0.5,  type: 'triangle' },
        ],
        v * 0.55,
      )
      return
    case 'digital':
      playSequence(
        [
          { freq: 1760, start: 0,    duration: 0.08, type: 'square' },
          { freq: 2349, start: 0.10, duration: 0.08, type: 'square' },
          { freq: 1760, start: 0.20, duration: 0.08, type: 'square' },
          { freq: 2349, start: 0.30, duration: 0.10, type: 'square' },
        ],
        v * 0.3,
      )
      return
  }
}
