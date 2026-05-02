import { useState } from 'react'
import '../ScreenShell.css'
import './SettingsScreen.css'
import { Section } from '../../components/ui/Section'
import { Toggle } from '../../components/ui/Toggle'
import { Slider } from '../../components/ui/Slider'
import { Dropdown } from '../../components/ui/Dropdown'
import { ColorPicker } from '../../components/ui/ColorPicker'
import { ResetButton } from '../../components/ui/ResetButton'
import { SettingsRow } from '../../components/ui/SettingsRow'
import { PrimaryButton } from '../../components/ui/PrimaryButton'
import { UpdaterSection } from '../../components/UpdaterSection'
import { useAppContext } from '../../context/useAppContext'
import type { AmbientBorderStyle, AtmosphereMode, LayoutPresetId } from '../../context/appTheme'

const SIDEBAR_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
]

const BORDER_STYLE_OPTIONS = [
  { value: 'steady', label: 'Steady — soft static glow' },
  { value: 'breathe', label: 'Breathe — slow pulse' },
  { value: 'pulse', label: 'Pulse — rhythmic flare' },
  { value: 'drift', label: 'Drift — color movement' },
]

const ATMOSPHERE_MODE_OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'snow', label: 'Snowfall' },
  { value: 'rain', label: 'Light rain' },
  { value: 'wind', label: 'Wind & clouds' },
  { value: 'stormy-focus', label: 'Stormy focus' },
  { value: 'lofi-chill', label: 'Lo-Fi chill' },
  { value: 'zen-calm', label: 'Zen calm' },
  { value: 'ambient-cloudy-mountain', label: 'Sound — Cloudy mountain' },
  { value: 'ambient-thunderstorm', label: 'Sound — Thunderstorm' },
  { value: 'ambient-alpine-meadow', label: 'Sound — Alpine meadow' },
  { value: 'ambient-rain-window', label: 'Sound — Rain on window' },
  { value: 'ambient-fireplace', label: 'Sound — Crackling fireplace' },
  { value: 'ambient-ocean', label: 'Sound — Ocean waves' },
  { value: 'ambient-forest', label: 'Sound — Forest' },
  { value: 'ambient-rain-soft', label: 'Sound — Soft rain' },
]

const LAYOUT_PRESET_OPTIONS: { value: LayoutPresetId; label: string }[] = [
  { value: 'classic-base', label: 'Classic Base' },
  { value: 'highlighter', label: 'HighLighter' },
  { value: 'vault', label: 'The Vault' },
  { value: 'command-center', label: 'Command Center' },
  { value: 'deep-focus', label: 'Deep Focus' },
  { value: 'fluid-glass', label: 'Fluid Glass (Clarity)' },
  { value: 'meridian', label: 'Meridian Rail' },
  { value: 'lumin', label: 'Lumin Beacon' },
  { value: 'folio', label: 'Folio Spine' },
  { value: 'horizon', label: 'Horizon Tabs' },
  { value: 'atrium', label: 'Atrium Studio' },
]

export function SettingsScreen() {
  const {
    settings: s,
    presets,
    customPresets,
    updateSetting,
    resetAll,
    resetAmbientFrame,
    resetWinterFrame,
    resetAtmosphere,
    resetButtons,
    resetAmbience,
    applyPreset,
    saveCurrentAsPreset,
    deleteCustomPreset,
  } = useAppContext()

  const [timerMinutes, setTimerMinutes] = useState(90)
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presets[0]?.id ?? '')
  const [presetName, setPresetName] = useState('')
  const [presetMessage, setPresetMessage] = useState<string | null>(null)

  const presetOptions = presets.map((p) => ({
    value: p.id,
    label: p.builtIn ? p.name : `${p.name} (custom)`,
  }))

  const selectedPreset = presets.find((p) => p.id === selectedPresetId) ?? presets[0]

  const handleApply = () => {
    if (selectedPreset) {
      applyPreset(selectedPreset)
      setPresetMessage(`Applied “${selectedPreset.name}”.`)
      window.setTimeout(() => setPresetMessage(null), 1800)
    }
  }

  const handleSave = () => {
    const trimmed = presetName.trim()
    if (!trimmed) {
      setPresetMessage('Enter a name for the preset first.')
      return
    }
    const created = saveCurrentAsPreset(trimmed)
    if (created) {
      setSelectedPresetId(created.id)
      setPresetName('')
      setPresetMessage(`Saved “${created.name}”.`)
      window.setTimeout(() => setPresetMessage(null), 1800)
    }
  }

  const handleDelete = () => {
    if (selectedPreset && !selectedPreset.builtIn) {
      const name = selectedPreset.name
      deleteCustomPreset(selectedPreset.id)
      setSelectedPresetId(presets[0]?.id ?? '')
      setPresetMessage(`Deleted “${name}”.`)
      window.setTimeout(() => setPresetMessage(null), 1800)
    }
  }

  const updateMultiColor = (index: number, color: string) => {
    const next = [...s.ambientMultiColors] as [string, string, string, string]
    next[index] = color
    updateSetting('ambientMultiColors', next)
  }

  return (
    <>
      <h1 className="screen-title">Settings</h1>
      <p className="screen-description">
        Customize appearance, interaction, ambient effects, and study defaults. Changes apply in real time.
      </p>

      <UpdaterSection />

      <Section
        title="Theme"
        badge="Live"
        badgeVariant="accent"
        description="Light/dark mode, accent color, glow, border, and related controls."
      >
        <SettingsRow label="Dark mode" description="Toggle between dark and light theme.">
          <Toggle
            checked={s.mode === 'dark'}
            onChange={(on) => updateSetting('mode', on ? 'dark' : 'light')}
            aria-label="Dark mode"
          />
        </SettingsRow>
        <SettingsRow
          label="Accent color"
          description="Theme tint for focus rings, progress and meter fills, section badges, links, and subtle highlights. Primary click targets use “Button color” below."
        >
          <ColorPicker value={s.accentColor} onChange={(v) => updateSetting('accentColor', v)} />
        </SettingsRow>
        <SettingsRow label="Accent intensity" description="Strength of accent color in UI elements.">
          <Slider
            value={s.accentIntensity} min={0} max={100}
            onChange={(v) => updateSetting('accentIntensity', v)}
            valueLabel={`${s.accentIntensity}%`}
          />
        </SettingsRow>
        <SettingsRow label="Glow intensity" description="Controls glow on borders, frames, and interactive elements.">
          <Slider
            value={s.glowIntensity} min={0} max={100}
            onChange={(v) => updateSetting('glowIntensity', v)}
            valueLabel={`${s.glowIntensity}%`}
          />
        </SettingsRow>
        <SettingsRow label="Border opacity">
          <Slider
            value={s.borderOpacity} min={0} max={100}
            onChange={(v) => updateSetting('borderOpacity', v)}
            valueLabel={`${s.borderOpacity}%`}
          />
        </SettingsRow>
        <SettingsRow label="Corner roundness">
          <Slider
            value={s.cornerRoundness} min={0} max={38}
            onChange={(v) => updateSetting('cornerRoundness', v)}
            valueLabel={`${s.cornerRoundness}px`}
          />
        </SettingsRow>
      </Section>

      <Section
        title="Buttons"
        badge="Live"
        badgeVariant="accent"
        description="Customize primary button color, glow, and active states across the entire app."
      >
        <SettingsRow label="Button color" description="Base color for all primary/active buttons, toggles, and sliders.">
          <ColorPicker value={s.buttonColor} onChange={(v) => updateSetting('buttonColor', v)} />
        </SettingsRow>
        <SettingsRow label="Button glow" description="Glow intensity on hover and active button states.">
          <Slider
            value={s.buttonGlow} min={0} max={100}
            onChange={(v) => updateSetting('buttonGlow', v)}
            valueLabel={`${s.buttonGlow}%`}
          />
        </SettingsRow>
        <ResetButton label="Reset button defaults" onClick={resetButtons} />
      </Section>

      <Section
        title="Background Ambience"
        badge="Atmospheric"
        description="Colored radial glows in the background. Customize each glow's color, intensity, spread, and softness."
      >
        <SettingsRow label="Ambience color 1" description="Top-left radial glow.">
          <ColorPicker value={s.ambienceColor1} onChange={(v) => updateSetting('ambienceColor1', v)} />
        </SettingsRow>
        <SettingsRow label="Ambience color 2" description="Top-right radial glow.">
          <ColorPicker value={s.ambienceColor2} onChange={(v) => updateSetting('ambienceColor2', v)} />
        </SettingsRow>
        <SettingsRow label="Ambience color 3" description="Bottom-left radial glow.">
          <ColorPicker value={s.ambienceColor3} onChange={(v) => updateSetting('ambienceColor3', v)} />
        </SettingsRow>
        <SettingsRow label="Intensity" description="Overall brightness of the ambient glows.">
          <Slider
            value={s.ambienceIntensity} min={0} max={100}
            onChange={(v) => updateSetting('ambienceIntensity', v)}
            valueLabel={`${s.ambienceIntensity}%`}
          />
        </SettingsRow>
        <SettingsRow label="Spread" description="How far each glow extends into the background.">
          <Slider
            value={s.ambienceSpread} min={0} max={100}
            onChange={(v) => updateSetting('ambienceSpread', v)}
            valueLabel={`${s.ambienceSpread}%`}
          />
        </SettingsRow>
        <SettingsRow label="Softness" description="Edge blending — higher is smoother and more diffused.">
          <Slider
            value={s.ambienceSoftness} min={0} max={100}
            onChange={(v) => updateSetting('ambienceSoftness', v)}
            valueLabel={`${s.ambienceSoftness}%`}
          />
        </SettingsRow>
        <ResetButton label="Reset ambience defaults" onClick={resetAmbience} />
      </Section>

      <Section
        title="Interaction"
        badge="Responsive"
        description="Animation, shadows, hover lift, and noise texture."
      >
        <SettingsRow label="Animation intensity" description="Speed and presence of page transitions.">
          <Slider
            value={s.animationIntensity} min={0} max={100}
            onChange={(v) => updateSetting('animationIntensity', v)}
            valueLabel={`${s.animationIntensity}%`}
          />
        </SettingsRow>
        <SettingsRow label="Shadow softness" description="Depth and spread of drop shadows.">
          <Slider
            value={s.shadowSoftness} min={0} max={100}
            onChange={(v) => updateSetting('shadowSoftness', v)}
            valueLabel={`${s.shadowSoftness}%`}
          />
        </SettingsRow>
        <SettingsRow label="Hover lift" description="Upward shift on hoverable elements.">
          <Slider
            value={s.hoverLift} min={0} max={100}
            onChange={(v) => updateSetting('hoverLift', v)}
            valueLabel={`${s.hoverLift}%`}
          />
        </SettingsRow>
        <SettingsRow label="Noise and texture" description="Subtle scan-line texture overlay.">
          <Slider
            value={s.noiseStrength} min={0} max={100}
            onChange={(v) => updateSetting('noiseStrength', v)}
            valueLabel={`${s.noiseStrength}%`}
          />
        </SettingsRow>
      </Section>

      <Section
        title="Ambient Frame"
        badge="Edge Light"
        badgeVariant="accent"
        description="A soft inset halo around the shell. Off by default — turn on only when you want a visible edge. Presets do not change this; it stays your choice."
      >
        <SettingsRow label="Enable Ambient Frame">
          <Toggle
            checked={s.ambientFrameEnabled}
            onChange={(v) => updateSetting('ambientFrameEnabled', v)}
            aria-label="Enable Ambient Frame"
          />
        </SettingsRow>
        {s.ambientFrameEnabled && (
        <>
        <SettingsRow label="Style" description="How the edge light moves over time.">
          <Dropdown
            value={s.ambientBorderStyle}
            options={BORDER_STYLE_OPTIONS}
            onChange={(v) => updateSetting('ambientBorderStyle', v as AmbientBorderStyle)}
          />
        </SettingsRow>
        <SettingsRow label="Animation speed" description="Cycle speed for breathe / pulse / drift.">
          <Slider
            value={s.ambientBorderSpeed} min={0} max={100}
            onChange={(v) => updateSetting('ambientBorderSpeed', v)}
            valueLabel={`${s.ambientBorderSpeed}%`}
          />
        </SettingsRow>
        <SettingsRow label="Reach" description="How far the halo extends inward (kept tight on purpose).">
          <Slider
            value={s.ambientBorderThickness} min={2} max={12}
            onChange={(v) => updateSetting('ambientBorderThickness', v)}
            valueLabel={`${s.ambientBorderThickness}`}
          />
        </SettingsRow>
        <SettingsRow label="Strength" description="Brightness of the edge light.">
          <Slider
            value={s.ambientBorderStrength} min={0} max={100}
            onChange={(v) => updateSetting('ambientBorderStrength', v)}
            valueLabel={`${s.ambientBorderStrength}%`}
          />
        </SettingsRow>
        <SettingsRow label="Multi-color mode" description="Blend multiple colors across the halo.">
          <Toggle
            checked={s.ambientMultiColor}
            onChange={(v) => updateSetting('ambientMultiColor', v)}
            aria-label="Multi-color mode"
          />
        </SettingsRow>
        {s.ambientMultiColor && (
          <>
            <SettingsRow label="Color count" description="Number of colors in the gradient (1-4).">
              <Slider
                value={s.ambientMultiColorCount} min={1} max={4}
                onChange={(v) => updateSetting('ambientMultiColorCount', v)}
                valueLabel={`${s.ambientMultiColorCount}`}
              />
            </SettingsRow>
            {Array.from({ length: s.ambientMultiColorCount }, (_, i) => (
              <SettingsRow key={i} label={`Color ${i + 1}`}>
                <ColorPicker value={s.ambientMultiColors[i]} onChange={(v) => updateMultiColor(i, v)} />
              </SettingsRow>
            ))}
          </>
        )}
        {!s.ambientMultiColor && (
          <SettingsRow label="Frame color">
            <ColorPicker value={s.ambientFrameColor} onChange={(v) => updateSetting('ambientFrameColor', v)} />
          </SettingsRow>
        )}
        </>
        )}
        <ResetButton label="Reset ambient defaults" onClick={resetAmbientFrame} />
      </Section>

      <Section
        title="Background Atmosphere"
        badge="Atmospheric"
        description="Scene effects behind the chrome — snowfall, precipitation, layered wind, storm composites, synthetic Lo-Fi/Zen beds, plus dedicated audio-only atmospheres (Sound — …) with smooth crossfades."
      >
        <SettingsRow label="Atmosphere" description="One mode at a time — switching swaps in the matching settings below.">
          <Dropdown
            value={s.atmosphereMode}
            options={ATMOSPHERE_MODE_OPTIONS}
            onChange={(v) => updateSetting('atmosphereMode', v as AtmosphereMode)}
          />
        </SettingsRow>

        {s.atmosphereMode !== 'off' && (
          <>
            <SettingsRow label="Audio enabled" description="Mute or unmute the ambient soundscape.">
              <Toggle
                checked={s.atmosphereAudioEnabled}
                onChange={(v) => updateSetting('atmosphereAudioEnabled', v)}
                aria-label="Atmosphere audio"
              />
            </SettingsRow>
            <SettingsRow label="Volume">
              <Slider
                value={s.atmosphereVolume} min={0} max={100}
                onChange={(v) => updateSetting('atmosphereVolume', v)}
                valueLabel={`${s.atmosphereVolume}%`}
                disabled={!s.atmosphereAudioEnabled}
              />
            </SettingsRow>
          </>
        )}

        {s.atmosphereMode === 'snow' && (
          <>
            <SettingsRow label="Intensity" description="Number of snowflakes on screen.">
              <Slider
                value={s.winterIntensity} min={0} max={100}
                onChange={(v) => updateSetting('winterIntensity', v)}
                valueLabel={`${s.winterIntensity}%`}
              />
            </SettingsRow>
            <SettingsRow label="Fall speed">
              <Slider
                value={s.winterFallSpeed} min={0} max={100}
                onChange={(v) => updateSetting('winterFallSpeed', v)}
                valueLabel={`${s.winterFallSpeed}%`}
              />
            </SettingsRow>
            <SettingsRow label="Snowflake size">
              <Slider
                value={s.winterSnowflakeSize} min={0} max={100}
                onChange={(v) => updateSetting('winterSnowflakeSize', v)}
                valueLabel={`${s.winterSnowflakeSize}%`}
              />
            </SettingsRow>
            <SettingsRow label="Glow on snowflakes">
              <Toggle
                checked={s.winterGlowEffect}
                onChange={(v) => updateSetting('winterGlowEffect', v)}
                aria-label="Glow effect"
              />
            </SettingsRow>
            <SettingsRow label="Wind drift">
              <Toggle
                checked={s.winterWindDrift}
                onChange={(v) => updateSetting('winterWindDrift', v)}
                aria-label="Wind drift"
              />
            </SettingsRow>
            <SettingsRow label="Snow color">
              <ColorPicker value={s.winterSnowColor} onChange={(v) => updateSetting('winterSnowColor', v)} />
            </SettingsRow>
          </>
        )}

        {(s.atmosphereMode === 'rain' || s.atmosphereMode === 'stormy-focus') && (
          <>
            <SettingsRow label="Intensity" description="Density of falling raindrops.">
              <Slider
                value={s.rainIntensity} min={0} max={100}
                onChange={(v) => updateSetting('rainIntensity', v)}
                valueLabel={`${s.rainIntensity}%`}
              />
            </SettingsRow>
            <SettingsRow label="Fall speed">
              <Slider
                value={s.rainFallSpeed} min={0} max={100}
                onChange={(v) => updateSetting('rainFallSpeed', v)}
                valueLabel={`${s.rainFallSpeed}%`}
              />
            </SettingsRow>
            <SettingsRow label="Drop size">
              <Slider
                value={s.rainDropSize} min={0} max={100}
                onChange={(v) => updateSetting('rainDropSize', v)}
                valueLabel={`${s.rainDropSize}%`}
              />
            </SettingsRow>
            <SettingsRow label="Wind (mph)" description="Horizontal push on drops (0 = vertical fall).">
              <Slider
                value={s.rainWindMph} min={0} max={45}
                onChange={(v) => updateSetting('rainWindMph', v)}
                valueLabel={`${s.rainWindMph} mph`}
              />
            </SettingsRow>
            <SettingsRow label="Turbulence" description="Gusts and random shear — higher feels windier.">
              <Slider
                value={s.rainTurbulence} min={0} max={100}
                onChange={(v) => updateSetting('rainTurbulence', v)}
                valueLabel={`${s.rainTurbulence}%`}
              />
            </SettingsRow>
            <SettingsRow label="Drop glow">
              <Toggle
                checked={s.rainGlow}
                onChange={(v) => updateSetting('rainGlow', v)}
                aria-label="Drop glow"
              />
            </SettingsRow>
            <SettingsRow label="Rain color">
              <ColorPicker value={s.rainColor} onChange={(v) => updateSetting('rainColor', v)} />
            </SettingsRow>
          </>
        )}

        {(s.atmosphereMode === 'wind' || s.atmosphereMode === 'stormy-focus') && (
          <>
            <SettingsRow label="Cloud density" description="How many drifting cloud layers.">
              <Slider
                value={s.windCloudDensity} min={0} max={100}
                onChange={(v) => updateSetting('windCloudDensity', v)}
                valueLabel={`${s.windCloudDensity}%`}
              />
            </SettingsRow>
            <SettingsRow label="Drift speed" description="How fast layers glide. Default is slow and calm.">
              <Slider
                value={s.windDriftSpeed} min={0} max={100}
                onChange={(v) => updateSetting('windDriftSpeed', v)}
                valueLabel={`${s.windDriftSpeed}%`}
              />
            </SettingsRow>
            <SettingsRow label="Cloud opacity" description="How visible the clouds are.">
              <Slider
                value={s.windCloudOpacity} min={0} max={100}
                onChange={(v) => updateSetting('windCloudOpacity', v)}
                valueLabel={`${s.windCloudOpacity}%`}
              />
            </SettingsRow>
          </>
        )}

        {s.atmosphereMode === 'wind' && (
          <>
            <SettingsRow label="Chime bed" description="Subtle chimes under wind (add wind-chime.ogg in public/audio).">
              <Slider
                value={s.windChimeLevel} min={0} max={100}
                onChange={(v) => updateSetting('windChimeLevel', v)}
                valueLabel={`${s.windChimeLevel}%`}
                disabled={!s.atmosphereAudioEnabled}
              />
            </SettingsRow>
            <SettingsRow label="Howl tone" description="Pitch of the wind soundscape.">
              <Slider
                value={s.windTone} min={0} max={100}
                onChange={(v) => updateSetting('windTone', v)}
                valueLabel={`${s.windTone}%`}
                disabled={!s.atmosphereAudioEnabled}
              />
            </SettingsRow>
            <SettingsRow label="Howl intensity" description="Strength of the wind body in the audio bed.">
              <Slider
                value={s.windHowlIntensity} min={0} max={100}
                onChange={(v) => updateSetting('windHowlIntensity', v)}
                valueLabel={`${s.windHowlIntensity}%`}
                disabled={!s.atmosphereAudioEnabled}
              />
            </SettingsRow>
          </>
        )}

        <ResetButton label="Reset atmosphere defaults" onClick={resetAtmosphere} />
      </Section>

      <Section
        title="Layout"
        description="Structural shells (navigation paradigm and spacing). Independent of theme presets — applying a theme preset keeps your layout choice."
      >
        <SettingsRow
          label="Layout preset"
          description="Classic Base preserves the original UI. Other presets rearrange navigation and panels without touching your saved colors or atmosphere sliders."
        >
          <Dropdown
            value={s.layoutPreset}
            options={LAYOUT_PRESET_OPTIONS}
            onChange={(v) => updateSetting('layoutPreset', v as LayoutPresetId)}
          />
        </SettingsRow>
        <SettingsRow label="Sidebar position" description="Which side the navigation appears on (Classic Base shell).">
          <Dropdown
            value={s.sidebarPosition}
            options={SIDEBAR_OPTIONS}
            onChange={(v) => updateSetting('sidebarPosition', v as 'left' | 'right')}
          />
        </SettingsRow>
      </Section>

      <Section
        title="Exam & Study"
        description="Defaults for exam prep and study sessions."
      >
        <SettingsRow label="Default timer" description="Default exam duration in minutes.">
          <Slider
            value={timerMinutes}
            min={15}
            max={180}
            step={5}
            onChange={setTimerMinutes}
            valueLabel={`${timerMinutes} min`}
          />
        </SettingsRow>
      </Section>

      <Section
        title="Presets"
        badge="Curated"
        badgeVariant="accent"
        description="Apply a curated look or save your current configuration as a custom preset."
      >
        <SettingsRow
          label="Choose preset"
          description={
            selectedPreset
              ? `${selectedPreset.settings.mode} mode · accent ${selectedPreset.settings.accentColor} · ${selectedPreset.builtIn ? 'built-in' : 'custom'}`
              : 'No presets available.'
          }
        >
          <Dropdown
            value={selectedPresetId}
            options={presetOptions}
            onChange={(v) => setSelectedPresetId(v)}
          />
        </SettingsRow>

        {selectedPreset && (
          <div className="preset-swatch-row">
            <span
              className="preset-swatch"
              style={{ background: selectedPreset.settings.accentColor }}
              aria-hidden
            />
            <span
              className="preset-swatch"
              style={{ background: selectedPreset.settings.buttonColor }}
              aria-hidden
            />
            {selectedPreset.settings.ambientMultiColors.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="preset-swatch preset-swatch--sm"
                style={{ background: c }}
                aria-hidden
              />
            ))}
          </div>
        )}

        <div className="preset-actions">
          <PrimaryButton onClick={handleApply} disabled={!selectedPreset}>
            Apply preset
          </PrimaryButton>
          {selectedPreset && !selectedPreset.builtIn && (
            <ResetButton label="Delete preset" onClick={handleDelete} />
          )}
        </div>

        <SettingsRow
          label="Save current as preset"
          description="Stores all current customization settings under a name you choose."
        >
          <div className="preset-save-row">
            <input
              type="text"
              className="preset-name-input"
              placeholder="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              maxLength={32}
            />
            <PrimaryButton onClick={handleSave}>Save</PrimaryButton>
          </div>
        </SettingsRow>

        {presetMessage && (
          <div className="preset-message" role="status">{presetMessage}</div>
        )}

        {customPresets.length > 0 && (
          <p className="preset-count-hint">
            {customPresets.length} custom preset{customPresets.length === 1 ? '' : 's'} saved.
          </p>
        )}
      </Section>

      <Section
        title="System actions"
        badge="Careful"
        badgeVariant="secondary"
        description="Reset controls for the entire customization system."
      >
        <div className="system-actions-stack">
          <ResetButton label="Reset entire system" onClick={resetAll} />
          <ResetButton label="Reset buttons only" onClick={resetButtons} />
          <ResetButton label="Reset ambience only" onClick={resetAmbience} />
          <ResetButton label="Reset ambient frame only" onClick={resetAmbientFrame} />
          <ResetButton label="Reset atmosphere only" onClick={resetAtmosphere} />
          <ResetButton label="Reset legacy snow only" onClick={resetWinterFrame} />
        </div>
      </Section>
    </>
  )
}
