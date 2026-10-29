import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { X, Plus, Minus, Search, Sparkles } from 'lucide-react'
import { useInventoryStore } from '../stores/inventoryStore'
import { defaultItems, categories } from '../data/defaultItems'

interface AddItemDialogProps {
  compartmentId: string
  onClose: () => void
}

export function AddItemDialog({ compartmentId, onClose }: AddItemDialogProps) {
  const [activeTab, setActiveTab] = useState<'defaults' | 'custom'>('defaults')
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
  const [search, setSearch] = useState('')
  const [customName, setCustomName] = useState('')
  const [customIcon, setCustomIcon] = useState('Box')
  const [customWeight, setCustomWeight] = useState('')
  const [quantity, setQuantity] = useState(1)
  const addItem = useInventoryStore((state) => state.addItem)

  const filteredItems = defaultItems.filter((item) => {
    const matchesCategory = item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAdd = (name: string, icon: string, weightKg?: number) => {
    addItem({
      compartmentId,
      name,
      icon,
      quantity,
      checked: false,
      weightKg,
    })
    onClose()
  }

  const handleCustomAdd = () => {
    if (!customName.trim()) return
    handleAdd(
      customName.trim(),
      customIcon,
      customWeight ? parseFloat(customWeight) : undefined,
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Inhalt hinzufügen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
          <button
            type="button"
            onClick={() => setActiveTab('defaults')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'defaults'
                ? 'bg-white text-terracotta-dark shadow dark:bg-gray-600 dark:text-terracotta-light'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Vorschläge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-white text-terracotta-dark shadow dark:bg-gray-600 dark:text-terracotta-light'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            Eigener Gegenstand
          </button>
        </div>

        {activeTab === 'defaults' ? (
          <>
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 dark:border-gray-600">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none dark:text-gray-100"
              />
            </div>

            <div className="mb-3 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-terracotta text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mb-4 grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                // @ts-ignore
                const Icon = LucideIcons[item.icon] || LucideIcons.Box
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleAdd(item.name, item.icon, item.weightKg)}
                    className="flex items-center gap-2 rounded-xl border border-gray-100 bg-sand p-2 text-left transition-colors hover:border-terracotta/30 hover:bg-terracotta/5 dark:border-gray-700 dark:bg-gray-700/50"
                  >
                    <Icon size={18} className="text-terracotta-dark dark:text-terracotta-light" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.weightKg ? `${item.weightKg} kg` : '—'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="mb-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="z. B. Lieblingskissen"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-terracotta dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Symbol (Lucide-Name)
                </label>
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-terracotta dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                  Gewicht (kg)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                  placeholder="optional"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-terracotta dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleCustomAdd}
              disabled={!customName.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-dark disabled:opacity-50"
            >
              <Sparkles size={16} />
              Hinzufügen
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">Menge</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-[1.5rem] text-center font-medium dark:text-gray-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
