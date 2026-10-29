import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { X, Plus, Minus, Search, Sparkles, MapPin } from 'lucide-react'
import { useInventoryStore } from '../stores/inventoryStore'
import { defaultItems, categories } from '../data/defaultItems'

interface AddItemDialogProps {
  onClose: () => void
}

export function AddItemDialog({ onClose }: AddItemDialogProps) {
  const [activeTab, setActiveTab] = useState<'defaults' | 'custom'>('defaults')
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0])
  const [search, setSearch] = useState('')
  const [customName, setCustomName] = useState('')
  const [customIcon, setCustomIcon] = useState('Box')
  const [customWeight, setCustomWeight] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedCompartmentId, setSelectedCompartmentId] = useState<string>('')
  const { compartments, addItem } = useInventoryStore()

  const filteredItems = defaultItems.filter((item) => {
    const matchesCategory = item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleAdd = (name: string, icon: string, weightKg?: number) => {
    if (!selectedCompartmentId) return
    addItem({
      compartmentId: selectedCompartmentId,
      name,
      icon,
      quantity,
      checked: false,
      weightKg,
    })
    onClose()
  }

  const handleCustomAdd = () => {
    if (!customName.trim() || !selectedCompartmentId) return
    handleAdd(
      customName.trim(),
      customIcon,
      customWeight ? parseFloat(customWeight) : undefined,
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-800">
            Gegenstand hinzufügen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Fach-Auswahl */}
        <div className="mb-4">
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-500">
            <MapPin size={14} />
            Wo wird es verstaut?
          </label>
          <select
            value={selectedCompartmentId}
            onChange={(e) => setSelectedCompartmentId(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none focus:border-terracotta"
          >
            <option value="">Fach auswählen...</option>
            {compartments.map((compartment) => (
              <option key={compartment.id} value={compartment.id}>
                {compartment.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex gap-2 rounded-xl bg-stone-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab('defaults')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'defaults'
                ? 'bg-white text-terracotta-dark shadow'
                : 'text-stone-600'
            }`}
          >
            Vorschläge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-white text-terracotta-dark shadow'
                : 'text-stone-600'
            }`}
          >
            Eigener
          </button>
        </div>

        {activeTab === 'defaults' ? (
          <>
            <div className="mb-3 flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2">
              <Search size={16} className="text-stone-400" />
              <input
                type="text"
                placeholder="Suchen..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-stone-700"
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
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mb-4 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                // @ts-ignore
                const Icon = LucideIcons[item.icon] || LucideIcons.Box
                return (
                  <button
                    key={item.name}
                    type="button"
                    disabled={!selectedCompartmentId}
                    onClick={() => handleAdd(item.name, item.icon, item.weightKg)}
                    className="flex items-center gap-2 rounded-xl border border-stone-100 bg-[#fffdf5] p-2 text-left transition-colors hover:border-terracotta/30 hover:bg-terracotta/5 disabled:opacity-40"
                  >
                    <Icon size={18} className="text-terracotta-dark" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">
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
              <label className="mb-1 block text-xs font-medium text-stone-500">
                Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="z. B. Lieblingskissen"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-terracotta text-stone-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Symbol
                </label>
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-terracotta text-stone-700"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-500">
                  Gewicht (kg)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={customWeight}
                  onChange={(e) => setCustomWeight(e.target.value)}
                  placeholder="optional"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-terracotta text-stone-700"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleCustomAdd}
              disabled={!customName.trim() || !selectedCompartmentId}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2.5 text-sm font-medium text-white transition-colors hover:bg-terracotta-dark disabled:opacity-50"
            >
              <Sparkles size={16} />
              Hinzufügen
            </button>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="text-sm text-stone-500">Menge</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
            >
              <Minus size={16} />
            </button>
            <span className="min-w-[1.5rem] text-center font-medium text-stone-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-600 hover:bg-stone-200"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
