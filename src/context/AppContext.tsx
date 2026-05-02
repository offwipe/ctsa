import { useState, useEffect, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  defaultPresets,
  defaultSettings,
  loadSettings,
  persistSettings,
  loadCustomPresets,
  persistCustomPresets,
} from './appTheme'
import type { CustomizationState, PresetRecord } from './appTheme'
import { AppContext } from './appContextShared'
import type { AppContextValue } from './appContextShared'

const NOTEBOOK_KEY = 'comptia-study-notebook'

function loadNotebookText(): string {
  try {
    return localStorage.getItem(NOTEBOOK_KEY) ?? ''
  } catch {
    return ''
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CustomizationState>(() => loadSettings())
  const [customPresets, setCustomPresets] = useState<PresetRecord[]>(() => loadCustomPresets())
  const [notebookOpen, setNotebookOpen] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)
  const [notebookText, setNotebookText] = useState<string>(() => loadNotebookText())

  useEffect(() => {
    try { localStorage.setItem(NOTEBOOK_KEY, notebookText) } catch { /* noop */ }
  }, [notebookText])

  const toggleNotebook = useCallback(() => setNotebookOpen((o) => !o), [])
  const toggleChart = useCallback(() => setChartOpen((o) => !o), [])

  useEffect(() => {
    persistSettings(settings)
  }, [settings])

  useEffect(() => {
    persistCustomPresets(customPresets)
  }, [customPresets])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.mode)
  }, [settings.mode])

  const updateSetting = useCallback(<K extends keyof CustomizationState>(key: K, value: CustomizationState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateSettings = useCallback((next: Partial<CustomizationState>) => {
    setSettings(prev => ({ ...prev, ...next }))
  }, [])

  const resetAll = useCallback(() => setSettings(defaultSettings), [])

  const resetAmbientFrame = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      ambientFrameEnabled: defaultSettings.ambientFrameEnabled,
      ambientBorderThickness: defaultSettings.ambientBorderThickness,
      ambientBorderStrength: defaultSettings.ambientBorderStrength,
      ambientMultiColor: defaultSettings.ambientMultiColor,
      ambientMultiColorCount: defaultSettings.ambientMultiColorCount,
      ambientMultiColors: defaultSettings.ambientMultiColors,
      ambientPulsating: defaultSettings.ambientPulsating,
      ambientFrameColor: defaultSettings.ambientFrameColor,
      ambientLiveViewmodel: defaultSettings.ambientLiveViewmodel,
      ambientBorderStyle: defaultSettings.ambientBorderStyle,
      ambientBorderSpeed: defaultSettings.ambientBorderSpeed,
    }))
  }, [])

  const resetWinterFrame = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      winterFrameEnabled: defaultSettings.winterFrameEnabled,
      winterIntensity: defaultSettings.winterIntensity,
      winterFallSpeed: defaultSettings.winterFallSpeed,
      winterSnowflakeSize: defaultSettings.winterSnowflakeSize,
      winterBorderZone: defaultSettings.winterBorderZone,
      winterGlowEffect: defaultSettings.winterGlowEffect,
      winterWindDrift: defaultSettings.winterWindDrift,
      winterSnowColor: defaultSettings.winterSnowColor,
    }))
  }, [])

  const resetAtmosphere = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      atmosphereMode: defaultSettings.atmosphereMode,
      atmosphereVolume: defaultSettings.atmosphereVolume,
      atmosphereAudioEnabled: defaultSettings.atmosphereAudioEnabled,
      winterFrameEnabled: defaultSettings.winterFrameEnabled,
      winterIntensity: defaultSettings.winterIntensity,
      winterFallSpeed: defaultSettings.winterFallSpeed,
      winterSnowflakeSize: defaultSettings.winterSnowflakeSize,
      winterBorderZone: defaultSettings.winterBorderZone,
      winterGlowEffect: defaultSettings.winterGlowEffect,
      winterWindDrift: defaultSettings.winterWindDrift,
      winterSnowColor: defaultSettings.winterSnowColor,
      rainIntensity: defaultSettings.rainIntensity,
      rainFallSpeed: defaultSettings.rainFallSpeed,
      rainDropSize: defaultSettings.rainDropSize,
      rainAngle: defaultSettings.rainAngle,
      rainWindMph: defaultSettings.rainWindMph,
      rainTurbulence: defaultSettings.rainTurbulence,
      rainColor: defaultSettings.rainColor,
      rainGlow: defaultSettings.rainGlow,
      windCloudDensity: defaultSettings.windCloudDensity,
      windDriftSpeed: defaultSettings.windDriftSpeed,
      windCloudOpacity: defaultSettings.windCloudOpacity,
      windChimeLevel: defaultSettings.windChimeLevel,
      windTone: defaultSettings.windTone,
      windHowlIntensity: defaultSettings.windHowlIntensity,
    }))
  }, [])

  const resetButtons = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      buttonColor: defaultSettings.buttonColor,
      buttonGlow: defaultSettings.buttonGlow,
    }))
  }, [])

  const resetAmbience = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      ambienceColor1: defaultSettings.ambienceColor1,
      ambienceColor2: defaultSettings.ambienceColor2,
      ambienceColor3: defaultSettings.ambienceColor3,
      ambienceIntensity: defaultSettings.ambienceIntensity,
      ambienceSpread: defaultSettings.ambienceSpread,
      ambienceSoftness: defaultSettings.ambienceSoftness,
      backgroundAmbience: defaultSettings.backgroundAmbience,
    }))
  }, [])

  const applyPreset = useCallback((preset: PresetRecord) => {
    setSettings((prev) => ({
      ...defaultSettings,
      ...preset.settings,
      ambientFrameEnabled: false,
      layoutPreset: prev.layoutPreset,
    }))
  }, [])

  const saveCurrentAsPreset = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return null
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const record: PresetRecord = {
      id,
      name: trimmed,
      builtIn: false,
      settings: { ...settings },
    }
    setCustomPresets((prev) => [...prev, record])
    return record
  }, [settings])

  const deleteCustomPreset = useCallback((id: string) => {
    setCustomPresets((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const renameCustomPreset = useCallback((id: string, name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCustomPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)))
  }, [])

  const allPresets = useMemo(() => [...defaultPresets, ...customPresets], [customPresets])

  const value = useMemo<AppContextValue>(() => ({
    settings,
    presets: allPresets,
    customPresets,
    updateSetting,
    updateSettings,
    resetAll,
    resetAmbientFrame,
    resetWinterFrame,
    resetAtmosphere,
    resetButtons,
    resetAmbience,
    applyPreset,
    saveCurrentAsPreset,
    deleteCustomPreset,
    renameCustomPreset,
    notebookOpen,
    toggleNotebook,
    setNotebookOpen,
    notebookText,
    setNotebookText,
    chartOpen,
    toggleChart,
    setChartOpen,
  }), [settings, allPresets, customPresets, updateSetting, updateSettings, resetAll, resetAmbientFrame, resetWinterFrame, resetAtmosphere, resetButtons, resetAmbience, applyPreset, saveCurrentAsPreset, deleteCustomPreset, renameCustomPreset, notebookOpen, toggleNotebook, notebookText, chartOpen, toggleChart])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

