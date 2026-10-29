import { Minus, Plus, Trash2, Check, Weight, Search, PlusCircle, MapPin } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useState, useMemo } from 'react'
import { useInventoryStore } from '../stores/inventoryStore'
import { AddItemDialog } from './AddItemDialog'
import type { InventoryItem } from '../types'

function ItemRow({ item }: { item: InventoryItem }) {
  const { updateQuantity, toggleChecked, removeItem, updateItemWeight, selectItem, compartments } =
    useInventoryStore()
  // @ts-ignore
  const Icon = LucideIcons[item.icon] || LucideIcons.Box
  const compartment = compartments.find((c) => c.id === item.compartmentId)

  return (
    <div
      className={`group flex items-center gap-1.5 border-b border-paper-line/50 px-2.5 py-1 transition-colors hover:bg-amber-50/40 ${
        item.checked ? 'opacity-45' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => toggleChecked(item.id)}
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          item.checked ? 'border-terracotta bg-terracotta text-white' : 'border-stone-400'
        }`}
      >
        {item.checked && <Check size={9} />}
      </button>

      <div className="shrink-0 text-terracotta-dark">
        <Icon size={13} />
      </div>

      <button
        type="button"
        onClick={() => selectItem(item.id)}
        className="min-w-0 flex-1 text-left"
      >
        <p
          className={`truncate text-[13px] leading-tight ${
            item.checked ? 'line-through text-stone-400' : 'text-stone-800'
          }`}
        >
          {item.quantity > 1 ? `${item.quantity}x ` : ''}
          {item.name}
        </p>
        {compartment && (
          <p className="flex items-center gap-1 text-[9px] text-stone-400">
            <MapPin size={8} />
            {compartment.name}
          </p>
        )}
      </button>

      <div className="ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
        <input
          type="number"
          min={0}
          step={0.1}
          value={item.weightKg ?? ''}
          onChange={(e) => updateItemWeight(item.id, parseFloat(e.target.value) || 0)}
          placeholder="kg"
          className="w-9 rounded border border-paper-line bg-white px-0.5 py-0 text-right text-[11px] text-stone-600 outline-none focus:border-terracotta"
        />
        <button
          type="button"
          onClick={() => updateQuantity(item.id, -1)}
          className="flex h-4 w-4 items-center justify-center rounded text-stone-500 hover:bg-stone-200"
        >
          <Minus size={10} />
        </button>
        <button
          type="button"
          onClick={() => updateQuantity(item.id, 1)}
          className="flex h-4 w-4 items-center justify-center rounded text-stone-500 hover:bg-stone-200"
        >
          <Plus size={10} />
        </button>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="flex h-4 w-4 items-center justify-center rounded text-stone-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  )
}

export function InventoryNote() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const { items, searchQuery, setSearchQuery, getTotalWeight } = useInventoryStore()
  const totalWeight = getTotalWeight()

  const filteredItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        useInventoryStore
          .getState()
          .compartments.find((c) => c.id === item.compartmentId)
          ?.name.toLowerCase()
          .includes(query),
    )
  }, [items, searchQuery])

  return (
    <>
      <div className="note-paper absolute bottom-3 right-3 flex w-64 flex-col rounded-sm shadow-lg">
        {/* Notiz-Kopf */}
        <div className="flex items-center justify-between border-b border-paper-line bg-[#fff8e1] px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-terracotta/80" />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-600">
              Packliste
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-stone-500">
            <Weight size={11} />
            <span>{totalWeight.toFixed(1)} kg</span>
          </div>
        </div>

        {/* Suchleiste */}
        <div className="flex items-center gap-1.5 border-b border-paper-line bg-white/60 px-2.5 py-1.5">
          <Search size={12} className="text-stone-400" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13px] text-stone-700 outline-none placeholder:text-stone-400"
          />
        </div>

        {/* Listeneinträge */}
        <div className="max-h-44 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="px-2.5 py-4 text-center text-xs text-stone-400">
              <p>Noch nichts eingetragen.</p>
              <p className="mt-1 text-[10px]">Klicke auf +, um Gegenstände hinzuzufügen.</p>
            </div>
          ) : (
            filteredItems.map((item) => <ItemRow key={item.id} item={item} />)
          )}
        </div>

        {/* Fußzeile */}
        <button
          type="button"
          onClick={() => setShowAddDialog(true)}
          className="flex items-center justify-center gap-1 border-t border-paper-line bg-[#fff8e1] px-2.5 py-1.5 text-[13px] font-medium text-terracotta-dark transition-colors hover:bg-[#fff3d0]"
        >
          <PlusCircle size={14} />
          Hinzufügen
        </button>
      </div>

      {showAddDialog && <AddItemDialog onClose={() => setShowAddDialog(false)} />}
    </>
  )
}
