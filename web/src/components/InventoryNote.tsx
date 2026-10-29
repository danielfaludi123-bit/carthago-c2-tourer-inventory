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
      className={`group flex items-start gap-2 border-b border-paper-line/60 px-3 py-1.5 transition-colors hover:bg-amber-50/50 ${
        item.checked ? 'opacity-50' : ''
      }`}
      style={{ minHeight: '1.75rem' }}
    >
      <button
        type="button"
        onClick={() => toggleChecked(item.id)}
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
          item.checked ? 'border-terracotta bg-terracotta text-white' : 'border-stone-400'
        }`}
      >
        {item.checked && <Check size={10} />}
      </button>

      <div className="mt-0.5 shrink-0 text-terracotta-dark">
        <Icon size={14} />
      </div>

      <button
        type="button"
        onClick={() => selectItem(item.id)}
        className="min-w-0 flex-1 text-left"
      >
        <p
          className={`truncate text-sm leading-[1.4] ${
            item.checked ? 'line-through text-stone-400' : 'text-stone-800'
          }`}
        >
          {item.quantity > 1 ? `${item.quantity}x ` : ''}
          {item.name}
        </p>
        {compartment && (
          <p className="flex items-center gap-1 text-[10px] text-stone-400">
            <MapPin size={9} />
            {compartment.name}
          </p>
        )}
      </button>

      <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
        <input
          type="number"
          min={0}
          step={0.1}
          value={item.weightKg ?? ''}
          onChange={(e) => updateItemWeight(item.id, parseFloat(e.target.value) || 0)}
          placeholder="kg"
          className="w-11 rounded border border-paper-line bg-white px-1 py-0 text-right text-xs text-stone-600 outline-none focus:border-terracotta"
        />
        <button
          type="button"
          onClick={() => updateQuantity(item.id, -1)}
          className="flex h-5 w-5 items-center justify-center rounded text-stone-500 hover:bg-stone-200"
        >
          <Minus size={12} />
        </button>
        <button
          type="button"
          onClick={() => updateQuantity(item.id, 1)}
          className="flex h-5 w-5 items-center justify-center rounded text-stone-500 hover:bg-stone-200"
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="flex h-5 w-5 items-center justify-center rounded text-stone-400 hover:bg-red-50 hover:text-red-500"
        >
          <Trash2 size={12} />
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
      <div className="note-paper absolute bottom-4 right-4 flex w-80 flex-col rounded-sm shadow-lg">
        {/* Notiz-Kopf */}
        <div className="flex items-center justify-between border-b border-paper-line bg-[#fff8e1] px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-terracotta/80" />
            <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">
              Packliste
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Weight size={12} />
            <span>{totalWeight.toFixed(1)} kg</span>
          </div>
        </div>

        {/* Suchleiste */}
        <div className="flex items-center gap-2 border-b border-paper-line bg-white/60 px-3 py-2">
          <Search size={14} className="text-stone-400" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
          />
        </div>

        {/* Listeneinträge */}
        <div className="max-h-72 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-stone-400">
              <p>Noch nichts eingetragen.</p>
              <p className="mt-1 text-xs">Klicke auf +, um Gegenstände hinzuzufügen.</p>
            </div>
          ) : (
            filteredItems.map((item) => <ItemRow key={item.id} item={item} />)
          )}
        </div>

        {/* Fußzeile */}
        <button
          type="button"
          onClick={() => setShowAddDialog(true)}
          className="flex items-center justify-center gap-1.5 border-t border-paper-line bg-[#fff8e1] px-3 py-2 text-sm font-medium text-terracotta-dark transition-colors hover:bg-[#fff3d0]"
        >
          <PlusCircle size={16} />
          Gegenstand hinzufügen
        </button>
      </div>

      {showAddDialog && <AddItemDialog onClose={() => setShowAddDialog(false)} />}
    </>
  )
}
