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
 * Mode swaps use asymmetric crossfades (faster duck-out, slower fade-in).
 * Optional `/audio/wind-chime.ogg` layers under wind with slow gain breathing.
 */

import type { AtmosphereMode } from '../context/appTheme'

/** Bundled looping beds (no matching canvas effects — audio only). */
export const ATMOSPHERE_SAMPLE_URLS: Partial<Record<AtmosphereMode, string>> = {
  'ambient-cloudy-mountain': '/audio/atmosphere/cloudy-mountain.m4a',
  'ambient-thunderstorm': '/audio/atmosphere/thunderstorm.m4a',
  'ambient-alpine-meadow': '/audio/atmosphere/alpine-meadow.m4a',
  'ambient-rain-window': '/audio/atmosphere/rain-window.oga',
  'ambient-fireplace': '/audio/atmosphere/fireplace.oga',
  'ambient-ocean': '/audio/atmosphere/ocean-waves.m4a',
  'ambient-forest': '/audio/atmosphere/forest.oga',
  'ambient-rain-soft': '/audio/atmosphere/rain-soft.m4a',
}

/** Internal audio bed — composite storm + synthetic chill/zen layers. */
type BedMode = 'rain' | 'wind' | 'stormy' | 'lofi' | 'zen'

function mapAtmosphereToBed(mode: AtmosphereMode): BedMode | null {
  switch (mode) {
    case 'rain':
      return 'rain'
    case 'wind':
      return 'wind'
    case 'stormy-focus':
      return 'stormy'
    case 'lofi-chill':
      return 'lofi'
    case 'zen-calm':
      return 'zen'
    default:
      return null
  }
}

const ASSET_URLS: Record<'rain' | 'wind', string> = {
  rain: '/audio/rain-loop.ogg',
  wind: '/audio/wind-loop.ogg',
}

const CHIME_URL = '/audio/wind-chime.ogg'

const FADE_OUT = 0.95
const FADE_IN = 1.25

type ModeNodes = {
  output: GainNode
  cleanup: () => void
}

class AtmosphereEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private currentBed: BedMode | null = null
  private currentNodes: ModeNodes | null = null
  /** When playing a bundled atmosphere sample, avoids redundant reloads. */
  private activeSampleUrl: string | null = null
  private bufferCache: Partial<Record<'rain' | 'wind', AudioBuffer | null>> = {}
  private sampleBufferCache: Record<string, AudioBuffer | null | undefined> = {}
  private chimeBuffer: AudioBuffer | null = null
  private chimeLoadAttempted = false
  private chimeGain: GainNode | null = null
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
    const sampleUrl = ATMOSPHERE_SAMPLE_URLS[mode]

    if (!sampleUrl) {
      this.activeSampleUrl = null
    }

    if (sampleUrl) {
      if (this.activeSampleUrl === sampleUrl && this.currentNodes) return

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

      const buffer = await this.loadSampleBuffer(sampleUrl)
      if (!buffer) {
        this.fadeOutCurrent()
        this.currentNodes = null
        this.currentBed = null
        this.activeSampleUrl = null
        return
      }

      const previous = this.currentNodes
      const output = ctx.createGain()
      output.gain.value = 0
      if (this.master) output.connect(this.master)

      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(output)
      source.start()

      const nodes: ModeNodes = {
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

      this.currentNodes = nodes
      this.currentBed = null
      this.activeSampleUrl = sampleUrl

      const now = ctx.currentTime
      nodes.output.gain.cancelScheduledValues(now)
      nodes.output.gain.setValueAtTime(0, now)
      nodes.output.gain.linearRampToValueAtTime(1, now + FADE_IN)

      if (previous) {
        const t = ctx.currentTime
        previous.output.gain.cancelScheduledValues(t)
        previous.output.gain.setValueAtTime(previous.output.gain.value, t)
        previous.output.gain.linearRampToValueAtTime(0, t + FADE_OUT)
        window.setTimeout(() => previous.cleanup(), (FADE_OUT + 0.25) * 1000)
      }
      return
    }

    const active = mapAtmosphereToBed(mode)
    if (this.currentBed === active && active !== null && !this.activeSampleUrl) return
    if (active === null) {
      this.fadeOutCurrent()
      this.currentBed = null
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
    this.currentBed = active

    const now = ctx.currentTime
    nodes.output.gain.cancelScheduledValues(now)
    nodes.output.gain.setValueAtTime(0, now)
    nodes.output.gain.linearRampToValueAtTime(1, now + FADE_IN)

    if (previous) {
      const t = ctx.currentTime
      previous.output.gain.cancelScheduledValues(t)
      previous.output.gain.setValueAtTime(previous.output.gain.value, t)
      previous.output.gain.linearRampToValueAtTime(0, t + FADE_OUT)
      window.setTimeout(() => previous.cleanup(), (FADE_OUT + 0.25) * 1000)
    }
  }

  private fadeOutCurrent() {
    if (!this.currentNodes || !this.ctx) return
    const previous = this.currentNodes
    const t = this.ctx.currentTime
    previous.output.gain.cancelScheduledValues(t)
    previous.output.gain.setValueAtTime(previous.output.gain.value, t)
    previous.output.gain.linearRampToValueAtTime(0, t + FADE_OUT)
    window.setTimeout(() => previous.cleanup(), (FADE_OUT + 0.25) * 1000)
    this.currentNodes = null
  }

  /** 0–1 mix for wind chime layer (only while wind mode is active). */
  setWindChimeLevel(level: number) {
    const g = Math.max(0, Math.min(1, level)) * 0.42
    if (!this.chimeGain || !this.ctx) return
    const now = this.ctx.currentTime
    this.chimeGain.gain.cancelScheduledValues(now)
    this.chimeGain.gain.setTargetAtTime(g, now, 0.12)
  }

  private async createNodesFor(mode: BedMode): Promise<ModeNodes> {
    const ctx = this.ensureContext()
    const output = ctx.createGain()
    output.gain.value = 0
    if (this.master) output.connect(this.master)

    if (mode === 'wind') {
      return this.createWindModeNodes(ctx, output)
    }

    if (mode === 'stormy') {
      return this.createStormyNodes(ctx, output)
    }

    if (mode === 'lofi') {
      return createLofiSynth(ctx, output)
    }

    if (mode === 'zen') {
      return createZenSynth(ctx, output)
    }

    const buffer = await this.loadBuffer('rain')
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

    return createRainSynth(ctx, output)
  }

  /** Rain + wind beds blended — light storm soundscape without separate assets. */
  private async createStormyNodes(ctx: AudioContext, output: GainNode): Promise<ModeNodes> {
    const rainBus = ctx.createGain()
    rainBus.gain.value = 0.52
    rainBus.connect(output)
    const windBus = ctx.createGain()
    windBus.gain.value = 0.42
    windBus.connect(output)

    const rainNodes = await this.createRainMix(ctx, rainBus)
    const windNodes = await this.createWindMix(ctx, windBus)

    return {
      output,
      cleanup: () => {
        rainNodes.cleanup()
        windNodes.cleanup()
        rainBus.disconnect()
        windBus.disconnect()
        output.disconnect()
      },
    }
  }

  /** Rain bed routed into `sink` (sink already connected upstream). */
  private async createRainMix(ctx: AudioContext, sink: GainNode): Promise<{ cleanup: () => void }> {
    const buffer = await this.loadBuffer('rain')
    if (buffer) {
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(sink)
      source.start()
      return {
        cleanup: () => {
          try {
            source.stop()
          } catch {
            // ignore
          }
          source.disconnect()
        },
      }
    }
    const sub = ctx.createGain()
    sub.connect(sink)
    const synth = createRainSynth(ctx, sub)
    return { cleanup: () => synth.cleanup() }
  }

  private async createWindMix(ctx: AudioContext, sink: GainNode): Promise<{ cleanup: () => void }> {
    const buffer = await this.loadBuffer('wind')
    if (buffer) {
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(sink)
      source.start()
      return {
        cleanup: () => {
          try {
            source.stop()
          } catch {
            // ignore
          }
          source.disconnect()
        },
      }
    }
    const sub = ctx.createGain()
    sub.connect(sink)
    const synth = createWindSynth(ctx, sub)
    return { cleanup: () => synth.cleanup() }
  }

  private async createWindModeNodes(ctx: AudioContext, output: GainNode): Promise<ModeNodes> {
    const buffer = await this.loadBuffer('wind')
    if (buffer) {
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = true
      source.connect(output)
      source.start()
      const chimeCleanup = await this.attachWindChime(ctx, output)
      return {
        output,
        cleanup: () => {
          try {
            source.stop()
          } catch {
            // ignore
          }
          source.disconnect()
          chimeCleanup?.()
          this.chimeGain = null
          output.disconnect()
        },
      }
    }

    const wind = createWindSynth(ctx, output)
    const chimeCleanup = await this.attachWindChime(ctx, output)
    return {
      output: wind.output,
      cleanup: () => {
        wind.cleanup()
        chimeCleanup?.()
        this.chimeGain = null
      },
    }
  }

  private async attachWindChime(ctx: AudioContext, bus: GainNode): Promise<(() => void) | null> {
    const buf = await this.loadChimeBuffer()
    if (!buf) return null

    const source = ctx.createBufferSource()
    source.buffer = buf
    source.loop = true
    const cg = ctx.createGain()
    cg.gain.value = 0
    this.chimeGain = cg

    source.connect(cg).connect(bus)
    source.start()

    return () => {
      try {
        source.stop()
      } catch {
        // ignore
      }
      source.disconnect()
      cg.disconnect()
      this.chimeGain = null
    }
  }

  private async loadChimeBuffer(): Promise<AudioBuffer | null> {
    if (this.chimeBuffer) return this.chimeBuffer
    if (this.chimeLoadAttempted) return null
    this.chimeLoadAttempted = true
    const ctx = this.ensureContext()
    try {
      const response = await fetch(CHIME_URL)
      if (!response.ok) return null
      const data = await response.arrayBuffer()
      const buffer = await ctx.decodeAudioData(data)
      this.chimeBuffer = buffer
      return buffer
    } catch {
      return null
    }
  }

  private async loadBuffer(mode: 'rain' | 'wind'): Promise<AudioBuffer | null> {
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

  private async loadSampleBuffer(url: string): Promise<AudioBuffer | null> {
    if (Object.prototype.hasOwnProperty.call(this.sampleBufferCache, url)) {
      return this.sampleBufferCache[url] ?? null
    }
    const ctx = this.ensureContext()
    try {
      const response = await fetch(url)
      if (!response.ok) {
        this.sampleBufferCache[url] = null
        return null
      }
      const data = await response.arrayBuffer()
      const buffer = await ctx.decodeAudioData(data)
      this.sampleBufferCache[url] = buffer
      return buffer
    } catch {
      this.sampleBufferCache[url] = null
      return null
    }
  }

  dispose() {
    this.fadeOutCurrent()
    this.currentBed = null
    if (this.ctx) {
      const ctx = this.ctx
      window.setTimeout(() => {
        ctx.close().catch(() => undefined)
      }, (FADE_IN + 0.5) * 1000)
    }
    this.ctx = null
    this.master = null
  }
}

function createLofiSynth(ctx: AudioContext, output: GainNode): ModeNodes {
  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx, 8, 'pink')
  noise.loop = true

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 980

  const warmth = ctx.createBiquadFilter()
  warmth.type = 'peaking'
  warmth.frequency.value = 380
  warmth.Q.value = 0.55
  warmth.gain.value = 5

  const synthGain = ctx.createGain()
  synthGain.gain.value = 0.2

  const lfo = ctx.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.035
  const lfoAmp = ctx.createGain()
  lfoAmp.gain.value = 0.035
  lfo.connect(lfoAmp).connect(synthGain.gain)
  lfo.start()

  noise.connect(lowpass).connect(warmth).connect(synthGain).connect(output)
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
      lfoAmp.disconnect()
      synthGain.disconnect()
      warmth.disconnect()
      lowpass.disconnect()
      output.disconnect()
    },
  }
}

function createZenSynth(ctx: AudioContext, output: GainNode): ModeNodes {
  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx, 12, 'brown')
  noise.loop = true

  const lowpass = ctx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = 210

  const synthGain = ctx.createGain()
  synthGain.gain.value = 0.055

  const slow = ctx.createOscillator()
  slow.type = 'sine'
  slow.frequency.value = 0.042
  const slowAmp = ctx.createGain()
  slowAmp.gain.value = 0.045
  slow.connect(slowAmp).connect(synthGain.gain)
  slow.start()

  noise.connect(lowpass).connect(synthGain).connect(output)
  noise.start()

  return {
    output,
    cleanup: () => {
      try {
        noise.stop()
        slow.stop()
      } catch {
        // ignore
      }
      noise.disconnect()
      slow.disconnect()
      slowAmp.disconnect()
      synthGain.disconnect()
      lowpass.disconnect()
      output.disconnect()
    },
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
