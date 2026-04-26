/*
 * Atmosphere audio engine.
 *
 * Two-tier strategy:
 *  1. Try to load bundled looping audio assets at /audio/rain-loop.ogg and
 *     /audio/wind-loop.ogg. When present, we play them via Web Audio
 *     AudioBufferSourceNode with `loop = true`, which guarantees a sample-perfect
 *     seamless loop with no click or gap at the boundary.
 *  2. If the asset is missing (404) or fails to decode, fall back to a
 *     procedural synth built from filtered noise. Always-on, completely free,
 *     and gives a believable rain / wind bed.
 *
 * Mode swaps crossfade over 600ms to avoid hard cuts.
 */

import type { AtmosphereMode } from '../context/appTheme'

type ActiveMode = Exclude<AtmosphereMode, 'off' | 'snow'>

const ASSET_URLS: Record<ActiveMode, string> = {
  rain: '/audio/rain-loop.ogg',
  wind: '/audio/wind-loop.ogg',
}

const FADE_SECONDS = 0.6

type ModeNodes = {
  output: GainNode
  cleanup: () => void
}

class AtmosphereEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private currentMode: ActiveMode | null = null
  private currentNodes: ModeNodes | null = null
  private bufferCache: Partial<Record<ActiveMode, AudioBuffer | null>> = {}
  private targetVolume = 0
  private enabled = true

  private ensureContext(): AudioContext {
    if (this.ctx) return this.ctx
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) throw new Error('Web Audio API is not supported in this environment')
    const ctx = new Ctor()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)
    this.ctx = ctx
    this.master = master
    return ctx
  }

  setVolume(volume: number, immediate = false) {
    this.targetVolume = Math.max(0, Math.min(1, volume))
    if (!this.master || !this.ctx) return
    const target = this.enabled ? this.targetVolume : 0
    const now = this.ctx.currentTime
    if (immediate) {
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setValueAtTime(target, now)
    } else {
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setTargetAtTime(target, now, 0.15)
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    this.setVolume(this.targetVolume)
  }

  async setMode(mode: AtmosphereMode) {
    const active: ActiveMode | null = mode === 'rain' || mode === 'wind' ? mode : null
    if (this.currentMode === active) return
    if (active === null) {
      this.fadeOutCurrent()
      this.currentMode = null
      return
    }

    let ctx: AudioContext
    try {
      ctx = this.ensureContext()
    } catch {
      return
    }

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch {
        // ignore
      }
    }

    const previous = this.currentNodes
    const nodes = await this.createNodesFor(active)
    this.currentNodes = nodes
    this.currentMode = active

    const now = ctx.currentTime
    nodes.output.gain.cancelScheduledValues(now)
    nodes.output.gain.setValueAtTime(0, now)
    nodes.output.gain.linearRampToValueAtTime(1, now + FADE_SECONDS)

    if (previous) {
      const t = ctx.currentTime
      previous.output.gain.cancelScheduledValues(t)
      previous.output.gain.setValueAtTime(previous.output.gain.value, t)
      previous.output.gain.linearRampToValueAtTime(0, t + FADE_SECONDS)
      window.setTimeout(() => previous.cleanup(), (FADE_SECONDS + 0.2) * 1000)
    }
  }

  private fadeOutCurrent() {
    if (!this.currentNodes || !this.ctx) return
    const previous = this.currentNodes
    const t = this.ctx.currentTime
    previous.output.gain.cancelScheduledValues(t)
    previous.output.gain.setValueAtTime(previous.output.gain.value, t)
    previous.output.gain.linearRampToValueAtTime(0, t + FADE_SECONDS)
    window.setTimeout(() => previous.cleanup(), (FADE_SECONDS + 0.2) * 1000)
    this.currentNodes = null
  }

  private async createNodesFor(mode: ActiveMode): Promise<ModeNodes> {
    const ctx = this.ensureContext()
    const output = ctx.createGain()
    output.gain.value = 0
    if (this.master) output.connect(this.master)

    const buffer = await this.loadBuffer(mode)
    if (buffer) {
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(output)
      source.start()
      return {
        output,
        cleanup: () => {
          try {
            source.stop()
          } catch {
            // ignore
          }
          source.disconnect()
          output.disconnect()
        },
      }
    }

    return mode === 'rain' ? createRainSynth(ctx, output) : createWindSynth(ctx, output)
  }

  private async loadBuffer(mode: ActiveMode): Promise<AudioBuffer | null> {
    if (mode in this.bufferCache) return this.bufferCache[mode] ?? null
    const ctx = this.ensureContext()
    try {
      const response = await fetch(ASSET_URLS[mode])
      if (!response.ok) {
        this.bufferCache[mode] = null
        return null
      }
      const data = await response.arrayBuffer()
      const buffer = await ctx.decodeAudioData(data)
      this.bufferCache[mode] = buffer
      return buffer
    } catch {
      this.bufferCache[mode] = null
      return null
    }
  }

  dispose() {
    this.fadeOutCurrent()
    this.currentMode = null
    if (this.ctx) {
      const ctx = this.ctx
      window.setTimeout(() => {
        ctx.close().catch(() => undefined)
      }, (FADE_SECONDS + 0.4) * 1000)
    }
    this.ctx = null
    this.master = null
  }
}

function createNoiseBuffer(ctx: AudioContext, seconds: number, type: 'white' | 'pink' | 'brown'): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel)
    let lastOut = 0
    let b0 = 0
    let b1 = 0
    let b2 = 0
    let b3 = 0
    let b4 = 0
    let b5 = 0
    let b6 = 0
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1
      if (type === 'white') {
        data[i] = white
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179
        b1 = 0.99332 * b1 + white * 0.0750759
        b2 = 0.969 * b2 + white * 0.153852
        b3 = 0.8665 * b3 + white * 0.3104856
        b4 = 0.55 * b4 + white * 0.5329522
        b5 = -0.7616 * b5 - white * 0.016898
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
        b6 = white * 0.115926
        data[i] = pink * 0.11
      } else {
        const brown = (lastOut + 0.02 * white) / 1.02
        lastOut = brown
        data[i] = brown * 3.5
      }
    }
  }
  return buffer
}

function createRainSynth(ctx: AudioContext, output: GainNode): ModeNodes {
  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx, 6, 'pink')
  noise.loop = true

  const highpass = ctx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = 700
  highpass.Q.value = 0.7

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 4200
  lowpass.Q.value = 0.5

  const peakBoost = ctx.createBiquadFilter()
  peakBoost.type = 'peaking'
  peakBoost.frequency.value = 2200
  peakBoost.Q.value = 0.9
  peakBoost.gain.value = 4

  const synthGain = ctx.createGain()
  synthGain.gain.value = 0.42

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.18
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.06
  lfo.connect(lfoGain).connect(synthGain.gain)
  lfo.start()

  noise.connect(highpass).connect(peakBoost).connect(lowpass).connect(synthGain).connect(output)
  noise.start()

  return {
    output,
    cleanup: () => {
      try {
        noise.stop()
        lfo.stop()
      } catch {
        // ignore
      }
      noise.disconnect()
      lfo.disconnect()
      synthGain.disconnect()
      lowpass.disconnect()
      peakBoost.disconnect()
      highpass.disconnect()
      output.disconnect()
    },
  }
}

function createWindSynth(ctx: AudioContext, output: GainNode): ModeNodes {
  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx, 8, 'brown')
  noise.loop = true

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 320
  lowpass.Q.value = 0.4

  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.value = 220
  bandpass.Q.value = 4

  const synthGain = ctx.createGain()
  synthGain.gain.value = 0.5

  const filterLfo = ctx.createOscillator()
  filterLfo.frequency.value = 0.07
  const filterLfoGain = ctx.createGain()
  filterLfoGain.gain.value = 120
  filterLfo.connect(filterLfoGain).connect(bandpass.frequency)
  filterLfo.start()

  const ampLfo = ctx.createOscillator()
  ampLfo.frequency.value = 0.13
  const ampLfoGain = ctx.createGain()
  ampLfoGain.gain.value = 0.18
  ampLfo.connect(ampLfoGain).connect(synthGain.gain)
  ampLfo.start()

  noise.connect(lowpass).connect(bandpass).connect(synthGain).connect(output)
  noise.start()

  return {
    output,
    cleanup: () => {
      try {
        noise.stop()
        filterLfo.stop()
        ampLfo.stop()
      } catch {
        // ignore
      }
      noise.disconnect()
      filterLfo.disconnect()
      filterLfoGain.disconnect()
      ampLfo.disconnect()
      ampLfoGain.disconnect()
      synthGain.disconnect()
      lowpass.disconnect()
      bandpass.disconnect()
      output.disconnect()
    },
  }
}

let singleton: AtmosphereEngine | null = null

export function getAtmosphereEngine(): AtmosphereEngine {
  if (!singleton) singleton = new AtmosphereEngine()
  return singleton
}
