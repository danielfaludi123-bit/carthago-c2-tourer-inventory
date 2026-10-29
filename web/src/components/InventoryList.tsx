import { Minus, Plus, Trash2, Check, Weight } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useInventoryStore } from '../stores/inventoryStore'
import type { InventoryItem } from '../types'

interface InventoryListProps {
  compartmentId: string
}

function ItemRow({ item }: { item: InventoryItem }) {
  const { updateQuantity, toggleChecked, removeItem, updateItemWeight } =
    useInventoryStore()
  // @ts-ignore - dynamic icon lookup
  const Icon = LucideIcons[item.icon] || LucideIcons.Box

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 ${
        item.checked ? 'opacity-60' : ''
      }`}
    >
      <button
        type="button"
        onClick={() => toggleChecked(item.id)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          item.checked
            ? 'border-terracotta bg-terracotta text-white'
            : 'border-gray-300 dark:border-gray-500'
        }`}
      >
        {item.checked && <Check size={14} />}
      </button>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sand text-terracotta-dark dark:bg-gray-700 dark:text-terracotta-light">
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-medium ${
            item.checked ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {item.name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Weight size={12} />
          <input
            type="number"
            min={0}
            step={0.1}
            value={item.weightKg ?? ''}
            onChange={(e) =>
              updateItemWeight(item.id, parseFloat(e.target.value) || 0)
            }
            placeholder="kg"
            className="w-16 rounded border border-gray-200 px-1 py-0.5 dark:border-gray-600 dark:bg-gray-700"
          />
          <span>kg / Stk</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => updateQuantity(item.id, -1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Minus size={16} />
        </button>
        <span className="min-w-[2rem] text-center font-medium">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(item.id, 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <Plus size={16} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

export function InventoryList({ compartmentId }: InventoryListProps) {
  const items = useInventoryStore((state) =>
    state.items.filter((item) => item.compartmentId === compartmentId),
  )
  const weight = useInventoryStore((state) =>
    state.getCompartmentWeight(compartmentId),
  )

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-400 dark:text-gray-500">
        <p>Dieses Fach ist noch leer.</p>
        <p className="text-sm">Füge Gegenstände hinzu →</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{items.length} Gegenstände</span>
        <span className="flex items-center gap-1">
          <Weight size={14} />
          {weight.toFixed(1)} kg
        </span>
      </div>
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </div>
  )
}
