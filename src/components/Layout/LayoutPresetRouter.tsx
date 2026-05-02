import type { LayoutPresetId } from '../../context/appTheme'
import { ClassicBaseShell } from './ClassicBaseShell'
import { HighlighterLayout } from './highlighter/HighlighterLayout'
import { VaultLayout } from './vault/VaultLayout'
import { CommandCenterLayout } from './command/CommandCenterLayout'
import { DeepFocusLayout } from './deep-focus/DeepFocusLayout'
import { FluidGlassLayout } from './fluid-glass/FluidGlassLayout'
import { MeridianLayout } from './meridian/MeridianLayout'
import { LuminLayout } from './lumin/LuminLayout'
import { FolioLayout } from './folio/FolioLayout'
import { HorizonLayout } from './horizon/HorizonLayout'
import { AtriumLayout } from './atrium/AtriumLayout'

export function LayoutPresetRouter({
  preset,
  locationKey,
}: {
  preset: LayoutPresetId
  locationKey: string
}) {
  switch (preset) {
    case 'classic-base':
      return <ClassicBaseShell locationKey={locationKey} />
    case 'highlighter':
      return <HighlighterLayout locationKey={locationKey} />
    case 'vault':
      return <VaultLayout locationKey={locationKey} />
    case 'command-center':
      return <CommandCenterLayout locationKey={locationKey} />
    case 'deep-focus':
      return <DeepFocusLayout locationKey={locationKey} />
    case 'fluid-glass':
      return <FluidGlassLayout locationKey={locationKey} />
    case 'meridian':
      return <MeridianLayout locationKey={locationKey} />
    case 'lumin':
      return <LuminLayout locationKey={locationKey} />
    case 'folio':
      return <FolioLayout locationKey={locationKey} />
    case 'horizon':
      return <HorizonLayout locationKey={locationKey} />
    case 'atrium':
      return <AtriumLayout locationKey={locationKey} />
    default:
      return <ClassicBaseShell locationKey={locationKey} />
  }
}
