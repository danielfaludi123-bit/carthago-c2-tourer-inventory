import { ChevronDown, ChevronRight, Folder, FolderOpen, Box } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useInventoryStore } from '../stores/inventoryStore'
import type { Compartment } from '../types'

interface TreeNodeProps {
  compartment: Compartment
  level: number
}

function TreeNode({ compartment, level }: TreeNodeProps) {
  const { selectedCompartmentId, selectCompartment, getCompartmentItems } =
    useInventoryStore()
  const [expanded, setExpanded] = useState(true)

  const compartments = useInventoryStore((state) => state.compartments)
  const children = useMemo(
    () => compartments.filter((c) => c.parentId === compartment.id),
    [compartments, compartment.id],
  )
  const hasChildren = children.length > 0
  const isSelected = selectedCompartmentId === compartment.id
  const itemCount = getCompartmentItems(compartment.id).length

  const Icon = hasChildren ? (expanded ? FolderOpen : Folder) : Box

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          if (hasChildren) {
            setExpanded(!expanded)
          }
          if (compartment.meshName) {
            selectCompartment(compartment.id)
          }
        }}
        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
          isSelected
            ? 'bg-terracotta/15 text-terracotta-dark dark:bg-terracotta/25 dark:text-terracotta-light'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren && (
          <span className="text-gray-400">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {!hasChildren && <span className="w-3.5" />}
        <Icon size={16} className="shrink-0" />
        <span className="flex-1 truncate">{compartment.name}</span>
        {itemCount > 0 && (
          <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {itemCount}
          </span>
        )}
      </button>
      {hasChildren && expanded && (
        <div>
          {children.map((child) => (
            <TreeNode key={child.id} compartment={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CompartmentTree() {
  const compartments = useInventoryStore((state) => state.compartments)
  const roots = useMemo(
    () => compartments.filter((c) => !c.parentId),
    [compartments],
  )

  return (
    <div className="h-full overflow-y-auto p-3">
      <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        Fächer
      </h2>
      {roots.map((root) => (
        <TreeNode key={root.id} compartment={root} level={0} />
      ))}
    </div>
  )
}
