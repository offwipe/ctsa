/* eslint-disable react-refresh/only-export-components -- context module exports provider + hook */
import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { LayoutPresetId } from './appTheme'
import { useAppContext } from './useAppContext'

type LayoutPresetContextValue = {
  layoutPreset: LayoutPresetId
  setLayoutPreset: (id: LayoutPresetId) => void
}

const LayoutPresetContext = createContext<LayoutPresetContextValue | null>(null)

export function LayoutPresetProvider({ children }: { children: ReactNode }) {
  const { settings, updateSetting } = useAppContext()
  const value = useMemo<LayoutPresetContextValue>(
    () => ({
      layoutPreset: settings.layoutPreset,
      setLayoutPreset: (id) => updateSetting('layoutPreset', id),
    }),
    [settings.layoutPreset, updateSetting],
  )
  return <LayoutPresetContext.Provider value={value}>{children}</LayoutPresetContext.Provider>
}

export function useLayoutPreset() {
  const ctx = useContext(LayoutPresetContext)
  if (!ctx) throw new Error('useLayoutPreset must be used within LayoutPresetProvider')
  return ctx
}
