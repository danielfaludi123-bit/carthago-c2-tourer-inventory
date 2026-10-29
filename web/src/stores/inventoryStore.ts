import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, InventoryItem } from '../types'
import { compartments } from '../data/compartments'

interface InventoryStore extends AppState {
  selectItem: (id: string | null) => void
  setSearchQuery: (query: string) => void
  addItem: (item: Omit<InventoryItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  toggleChecked: (id: string) => void
  updateItemWeight: (id: string, weightKg: number) => void
  getItemById: (id: string) => InventoryItem | undefined
  getItemsByCompartment: (compartmentId: string) => InventoryItem[]
  getTotalWeight: () => number
  getCompartmentWeight: (compartmentId: string) => number
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      compartments,
      items: [],
      selectedItemId: null,
      searchQuery: '',

      selectItem: (id) => set({ selectedItemId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: generateId() }],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      toggleChecked: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item,
          ),
        })),

      updateItemWeight: (id, weightKg) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, weightKg } : item,
          ),
        })),

      getItemById: (id) => get().items.find((item) => item.id === id),

      getItemsByCompartment: (compartmentId) =>
        get().items.filter((item) => item.compartmentId === compartmentId),

      getTotalWeight: () =>
        get().items.reduce(
          (sum, item) => sum + (item.weightKg || 0) * item.quantity,
          0,
        ),

      getCompartmentWeight: (compartmentId) =>
        get()
          .items.filter((item) => item.compartmentId === compartmentId)
          .reduce((sum, item) => sum + (item.weightKg || 0) * item.quantity, 0),
    }),
    {
      name: 'carthago-inventory-v2',
    },
  ),
)
