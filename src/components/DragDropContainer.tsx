import './DragDropContainer.css'

type DragDropContainerProps = {
  children?: React.ReactNode
  empty?: boolean
}

/** Reusable drag-and-drop zone. Empty state when no items to drag yet. */
export function DragDropContainer({ children, empty = true }: DragDropContainerProps) {
  return (
    <div className="drag-drop-container" data-empty={empty}>
      {empty ? (
        <p className="drag-drop-empty">Drag-and-drop area. No items yet.</p>
      ) : (
        children
      )}
    </div>
  )
}
