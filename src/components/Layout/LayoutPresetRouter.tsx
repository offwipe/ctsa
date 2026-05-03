import type { LayoutPresetId } from '../../context/appTheme'
import { ClassicBaseShell } from './ClassicBaseShell'
import { HighlighterLayout } from './highlighter/HighlighterLayout'
import { VaultLayout } from './vault/VaultLayout'
import { CommandCenterLayout } from './command/CommandCenterLayout'
import { LuminLayout } from './lumin/LuminLayout'
import { FolioLayout } from './folio/FolioLayout'
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
    case 'lumin':
      return <LuminLayout locationKey={locationKey} />
    case 'folio':
      return <FolioLayout locationKey={locationKey} />
    case 'atrium':
      return <AtriumLayout locationKey={locationKey} />
    default:
      return <ClassicBaseShell locationKey={locationKey} />
  }
}
