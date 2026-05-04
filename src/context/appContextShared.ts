import { createContext } from 'react'
import type { CertificationId } from '../data/certificationPacks'
import type { CustomizationState, PresetRecord } from './appTheme'

export interface AppContextValue {
  settings: CustomizationState
  activeCertification: CertificationId | null
  setActiveCertification: (certification: CertificationId | null) => void
  presets: PresetRecord[]
  customPresets: PresetRecord[]
  updateSetting: <K extends keyof CustomizationState>(key: K, value: CustomizationState[K]) => void
  updateSettings: (next: Partial<CustomizationState>) => void
  resetAll: () => void
  resetAmbientFrame: () => void
  resetWinterFrame: () => void
  resetAtmosphere: () => void
  resetButtons: () => void
  resetAmbience: () => void
  applyPreset: (preset: PresetRecord) => void
  saveCurrentAsPreset: (name: string) => PresetRecord | null
  deleteCustomPreset: (id: string) => void
  renameCustomPreset: (id: string, name: string) => void
  notebookOpen: boolean
  toggleNotebook: () => void
  setNotebookOpen: (open: boolean) => void
  notebookText: string
  setNotebookText: (text: string) => void
  chartOpen: boolean
  toggleChart: () => void
  setChartOpen: (open: boolean) => void
}

export const AppContext = createContext<AppContextValue | null>(null)
