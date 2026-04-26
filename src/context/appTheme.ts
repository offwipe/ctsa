export type ThemeMode = 'dark' | 'light'
export type SidebarPos = 'left' | 'right'
export type AmbientBorderStyle =
  | 'steady'
  | 'drift'
  | 'breathe'
  | 'pulse'
export type AtmosphereMode = 'off' | 'snow' | 'rain' | 'wind'

export type CustomizationState = {
  mode: ThemeMode
  sidebarPosition: SidebarPos
  accentColor: string
  accentIntensity: number
  glowIntensity: number
  borderOpacity: number
  cornerRoundness: number
  liveModeTransitions: boolean
  animationIntensity: number
  shadowSoftness: number
  hoverLift: number
  backgroundAmbience: number
  noiseStrength: number
  buttonColor: string
  buttonGlow: number
  ambienceColor1: string
  ambienceColor2: string
  ambienceColor3: string
  ambienceIntensity: number
  ambienceSpread: number
  ambienceSoftness: number
  ambientFrameEnabled: boolean
  ambientBorderThickness: number
  ambientBorderStrength: number
  ambientMultiColor: boolean
  ambientMultiColorCount: number
  ambientMultiColors: [string, string, string, string]
  ambientPulsating: boolean
  ambientFrameColor: string
  ambientLiveViewmodel: boolean
  ambientBorderStyle: AmbientBorderStyle
  ambientBorderSpeed: number
  atmosphereMode: AtmosphereMode
  atmosphereVolume: number
  atmosphereAudioEnabled: boolean
  winterFrameEnabled: boolean
  winterIntensity: number
  winterFallSpeed: number
  winterSnowflakeSize: number
  winterBorderZone: number
  winterGlowEffect: boolean
  winterWindDrift: boolean
  winterSnowColor: string
  rainIntensity: number
  rainFallSpeed: number
  rainDropSize: number
  rainAngle: number
  rainColor: string
  rainGlow: boolean
  windCloudDensity: number
  windDriftSpeed: number
  windCloudOpacity: number
  windTone: number
  windHowlIntensity: number
}

export const defaultSettings: CustomizationState = {
  mode: 'dark',
  sidebarPosition: 'left',
  accentColor: '#8b5cf6',
  accentIntensity: 58,
  glowIntensity: 46,
  borderOpacity: 18,
  cornerRoundness: 26,
  liveModeTransitions: true,
  animationIntensity: 42,
  shadowSoftness: 66,
  hoverLift: 28,
  backgroundAmbience: 38,
  noiseStrength: 10,
  buttonColor: '#8b5cf6',
  buttonGlow: 40,
  ambienceColor1: '#4c1d95',
  ambienceColor2: '#2563eb',
  ambienceColor3: '#f5b21a',
  ambienceIntensity: 50,
  ambienceSpread: 50,
  ambienceSoftness: 50,
  ambientFrameEnabled: true,
  ambientBorderThickness: 6,
  ambientBorderStrength: 32,
  ambientMultiColor: true,
  ambientMultiColorCount: 3,
  ambientMultiColors: ['#8b5cf6', '#60a5fa', '#f59e0b', '#ec4899'],
  ambientPulsating: false,
  ambientFrameColor: '#a5b4fc',
  ambientLiveViewmodel: true,
  ambientBorderStyle: 'breathe',
  ambientBorderSpeed: 30,
  atmosphereMode: 'off',
  atmosphereVolume: 35,
  atmosphereAudioEnabled: true,
  winterFrameEnabled: false,
  winterIntensity: 18,
  winterFallSpeed: 24,
  winterSnowflakeSize: 18,
  winterBorderZone: 26,
  winterGlowEffect: true,
  winterWindDrift: true,
  winterSnowColor: '#f8fbff',
  rainIntensity: 28,
  rainFallSpeed: 50,
  rainDropSize: 30,
  rainAngle: 12,
  rainColor: '#a8c4e8',
  rainGlow: true,
  windCloudDensity: 36,
  windDriftSpeed: 40,
  windCloudOpacity: 32,
  windTone: 40,
  windHowlIntensity: 35,
}

export type PresetRecord = {
  id: string
  name: string
  settings: CustomizationState
  builtIn?: boolean
}

export const defaultPresets: PresetRecord[] = [
  { id: 'nocturne', name: 'Nocturne', builtIn: true, settings: defaultSettings },
  {
    id: 'frost-light',
    name: 'Frost Light',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'light',
      accentColor: '#6366f1',
      buttonColor: '#6366f1',
      borderOpacity: 16,
      backgroundAmbience: 28,
      glowIntensity: 28,
      noiseStrength: 6,
      ambientFrameColor: '#c7d2fe',
      ambientBorderStyle: 'breathe',
      ambientBorderThickness: 5,
      ambientBorderStrength: 26,
      atmosphereMode: 'snow',
      winterFrameEnabled: true,
      winterIntensity: 22,
      winterFallSpeed: 30,
    },
  },
  {
    id: 'gold-studio',
    name: 'Gold Studio',
    builtIn: true,
    settings: {
      ...defaultSettings,
      accentColor: '#f5b21a',
      buttonColor: '#f5b21a',
      accentIntensity: 52,
      glowIntensity: 50,
      ambientMultiColor: false,
      ambientFrameColor: '#ffd76a',
      ambientBorderStyle: 'breathe',
      ambientBorderThickness: 7,
      ambientBorderStrength: 30,
      ambienceColor1: '#3a2200',
      ambienceColor2: '#5a3300',
      ambienceColor3: '#f5b21a',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#34d399',
      buttonColor: '#34d399',
      accentIntensity: 60,
      glowIntensity: 50,
      ambientMultiColor: true,
      ambientMultiColorCount: 3,
      ambientMultiColors: ['#10b981', '#22d3ee', '#a78bfa', '#34d399'],
      ambientBorderStyle: 'drift',
      ambientBorderThickness: 6,
      ambientBorderStrength: 34,
      ambientBorderSpeed: 35,
      ambienceColor1: '#0f3a2c',
      ambienceColor2: '#0e2e4f',
      ambienceColor3: '#311f5f',
    },
  },
  {
    id: 'crimson-focus',
    name: 'Crimson Focus',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#f43f5e',
      buttonColor: '#f43f5e',
      accentIntensity: 60,
      glowIntensity: 50,
      borderOpacity: 20,
      ambientMultiColor: false,
      ambientFrameColor: '#fb7185',
      ambientBorderStyle: 'pulse',
      ambientBorderThickness: 6,
      ambientBorderStrength: 36,
      ambientBorderSpeed: 50,
      ambienceColor1: '#1f0610',
      ambienceColor2: '#3a0a18',
      ambienceColor3: '#7a1530',
      atmosphereMode: 'off',
      winterFrameEnabled: false,
    },
  },
  {
    id: 'mint-calm',
    name: 'Mint Calm',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'light',
      accentColor: '#0d9488',
      buttonColor: '#14b8a6',
      accentIntensity: 44,
      glowIntensity: 28,
      borderOpacity: 14,
      noiseStrength: 4,
      ambientMultiColor: false,
      ambientFrameColor: '#5eead4',
      ambientBorderStyle: 'breathe',
      ambientBorderThickness: 5,
      ambientBorderStrength: 24,
      ambientBorderSpeed: 25,
      ambienceColor1: '#cffafe',
      ambienceColor2: '#a7f3d0',
      ambienceColor3: '#bae6fd',
      atmosphereMode: 'off',
      winterFrameEnabled: false,
    },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#ec4899',
      buttonColor: '#ec4899',
      accentIntensity: 64,
      glowIntensity: 60,
      borderOpacity: 22,
      ambientMultiColor: true,
      ambientMultiColorCount: 3,
      ambientMultiColors: ['#ec4899', '#8b5cf6', '#22d3ee', '#ec4899'],
      ambientBorderStyle: 'drift',
      ambientBorderThickness: 7,
      ambientBorderStrength: 38,
      ambientBorderSpeed: 45,
      ambienceColor1: '#2a0a3a',
      ambienceColor2: '#0a1f4a',
      ambienceColor3: '#3a0a2a',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#fb923c',
      buttonColor: '#f97316',
      accentIntensity: 60,
      glowIntensity: 56,
      ambientMultiColor: true,
      ambientMultiColorCount: 3,
      ambientMultiColors: ['#fb923c', '#facc15', '#ef4444', '#f97316'],
      ambientBorderStyle: 'drift',
      ambientBorderThickness: 7,
      ambientBorderStrength: 36,
      ambientBorderSpeed: 30,
      ambienceColor1: '#3a1a05',
      ambienceColor2: '#5a2300',
      ambienceColor3: '#7a3300',
    },
  },
  {
    id: 'forest-night',
    name: 'Forest Night',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#84cc16',
      buttonColor: '#65a30d',
      accentIntensity: 52,
      glowIntensity: 36,
      borderOpacity: 16,
      ambientMultiColor: true,
      ambientMultiColorCount: 2,
      ambientMultiColors: ['#65a30d', '#15803d', '#84cc16', '#22c55e'],
      ambientBorderStyle: 'breathe',
      ambientBorderThickness: 6,
      ambientBorderStrength: 28,
      ambientBorderSpeed: 22,
      ambienceColor1: '#0a1f0a',
      ambienceColor2: '#102a18',
      ambienceColor3: '#1f3a0a',
      atmosphereMode: 'wind',
    },
  },
  {
    id: 'rainy-evening',
    name: 'Rainy Evening',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#7dd3fc',
      buttonColor: '#0ea5e9',
      accentIntensity: 50,
      glowIntensity: 32,
      borderOpacity: 16,
      ambientMultiColor: false,
      ambientFrameColor: '#7dd3fc',
      ambientBorderStyle: 'breathe',
      ambientBorderThickness: 5,
      ambientBorderStrength: 24,
      ambientBorderSpeed: 22,
      ambienceColor1: '#0c1a2c',
      ambienceColor2: '#0a1928',
      ambienceColor3: '#1c2e44',
      atmosphereMode: 'rain',
      rainIntensity: 32,
      rainFallSpeed: 50,
      atmosphereVolume: 30,
    },
  },
  {
    id: 'minimal-mono',
    name: 'Minimal Mono',
    builtIn: true,
    settings: {
      ...defaultSettings,
      mode: 'dark',
      accentColor: '#e5e7eb',
      buttonColor: '#9ca3af',
      accentIntensity: 38,
      glowIntensity: 16,
      borderOpacity: 18,
      noiseStrength: 4,
      backgroundAmbience: 14,
      ambientMultiColor: false,
      ambientFrameColor: '#9ca3af',
      ambientBorderStyle: 'steady',
      ambientBorderThickness: 4,
      ambientBorderStrength: 18,
      ambientPulsating: false,
      ambienceColor1: '#1f2937',
      ambienceColor2: '#111827',
      ambienceColor3: '#0b1220',
      atmosphereMode: 'off',
      winterFrameEnabled: false,
    },
  },
]

const STORAGE_KEY = 'comptia-study-settings'
const CUSTOM_PRESETS_KEY = 'comptia-study-custom-presets'

const LEGACY_AMBIENT_STYLE_MAP: Record<string, AmbientBorderStyle> = {
  solid: 'steady',
  flow: 'drift',
  shimmer: 'pulse',
  breathing: 'breathe',
  'pulse-dash': 'pulse',
  aurora: 'drift',
}

function migrateSettings(raw: Partial<CustomizationState> & Record<string, unknown>): CustomizationState {
  const merged: CustomizationState = { ...defaultSettings, ...(raw as CustomizationState) }
  const incomingStyle = (raw.ambientBorderStyle ?? merged.ambientBorderStyle) as string
  if (LEGACY_AMBIENT_STYLE_MAP[incomingStyle]) {
    merged.ambientBorderStyle = LEGACY_AMBIENT_STYLE_MAP[incomingStyle]
  } else if (!['steady', 'drift', 'breathe', 'pulse'].includes(incomingStyle)) {
    merged.ambientBorderStyle = defaultSettings.ambientBorderStyle
  }
  if (typeof raw.ambientBorderThickness === 'number' && raw.ambientBorderThickness > 12) {
    merged.ambientBorderThickness = Math.min(12, raw.ambientBorderThickness)
  }
  if (raw.winterFrameEnabled && merged.atmosphereMode === 'off') {
    merged.atmosphereMode = 'snow'
  }
  return merged
}

export function loadSettings(): CustomizationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    return migrateSettings(JSON.parse(raw))
  } catch {
    return defaultSettings
  }
}

export function persistSettings(settings: CustomizationState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // noop
  }
}

export function loadCustomPresets(): PresetRecord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as PresetRecord[]
    return parsed
      .filter((p) => p && p.id && p.name && p.settings)
      .map((p) => ({
        ...p,
        builtIn: false,
        settings: { ...defaultSettings, ...p.settings },
      }))
  } catch {
    return []
  }
}

export function persistCustomPresets(list: PresetRecord[]) {
  try {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(list))
  } catch {
    // noop
  }
}

export function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '')
  const safe = normalized.length === 3 ? normalized.split('').map((char) => char + char).join('') : normalized
  const value = parseInt(safe, 16)
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 }
}

export function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`
}

export function lightenHex(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex)
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)))
  const lr = clamp(r + (255 - r) * amount)
  const lg = clamp(g + (255 - g) * amount)
  const lb = clamp(b + (255 - b) * amount)
  return `#${((1 << 24) | (lr << 16) | (lg << 8) | lb).toString(16).slice(1)}`
}
