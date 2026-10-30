import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, InventoryItem } from '../types'
import { compartments } from '../data/compartments'

interface InventoryStore extends AppState {
  selectItem: (id: string | null) => void
  selectCompartment: (id: string | null) => void
  clearSelection: () => void
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
      selectedCompartmentId: null,
      searchQuery: '',
      openFlaps: [],

      selectItem: (id) => {
        if (id) {
          const item = get().items.find((i) => i.id === id)
          if (item) {
            set({
              selectedItemId: id,
              selectedCompartmentId: item.compartmentId,
              openFlaps: [item.compartmentId],
            })
            return
          }
        }
        set({ selectedItemId: null })
      },

      selectCompartment: (id) => {
        if (!id) {
          set({ selectedCompartmentId: null, openFlaps: [] })
          return
        }
        const alreadySelected = get().selectedCompartmentId === id
        if (alreadySelected) {
          set({ selectedCompartmentId: null, selectedItemId: null, openFlaps: [] })
          return
        }
        set({
          selectedCompartmentId: id,
          selectedItemId: null,
          openFlaps: [id],
        })
      },

      clearSelection: () =>
        set({ selectedItemId: null, selectedCompartmentId: null, openFlaps: [] }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, { ...item, id: generateId() }],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          selectedItemId: state.selectedItemId === id ? null : state.selectedItemId,
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
      name: 'carthago-inventory-v4',
    },
  ),
)
