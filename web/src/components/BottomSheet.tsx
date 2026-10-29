import { useState } from 'react'
import { Plus, X, Package } from 'lucide-react'
import { useInventoryStore } from '../stores/inventoryStore'
import { InventoryList } from './InventoryList'
import { AddItemDialog } from './AddItemDialog'

export function BottomSheet() {
  const selectedCompartmentId = useInventoryStore(
    (state) => state.selectedCompartmentId,
  )
  const compartments = useInventoryStore((state) => state.compartments)
  const selectCompartment = useInventoryStore(
    (state) => state.selectCompartment,
  )
  const [showAddDialog, setShowAddDialog] = useState(false)

  const compartment = compartments.find((c) => c.id === selectedCompartmentId)

  if (!compartment || !compartment.meshName) {
    return (
      <div className="flex h-48 flex-col items-center justify-center border-t border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900">
        <Package size={32} className="mb-2 opacity-50" />
        <p className="text-sm">Wähle ein Fach aus, um den Inhalt zu sehen</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex max-h-80 min-h-[14rem] flex-col border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {compartment.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Klicke auf +, um Gegenstände hinzuzufügen
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta-dark"
            >
              <Plus size={16} />
              Hinzufügen
            </button>
            <button
              type="button"
              onClick={() => selectCompartment(null)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <InventoryList compartmentId={compartment.id} />
        </div>
      </div>

      {showAddDialog && (
        <AddItemDialog
          compartmentId={compartment.id}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </>
  )
}
