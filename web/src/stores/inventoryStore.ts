import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, InventoryItem } from '../types'
import { compartments } from '../data/compartments'

interface InventoryStore extends AppState {
  selectCompartment: (id: string | null) => void
  addItem: (item: Omit<InventoryItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, delta: number) => void
  toggleChecked: (id: string) => void
  updateItemWeight: (id: string, weightKg: number) => void
  toggleDarkMode: () => void
  getCompartmentItems: (compartmentId: string) => InventoryItem[]
  getTotalWeight: () => number
  getCompartmentWeight: (compartmentId: string) => number
}

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      compartments,
      items: [],
      selectedCompartmentId: null,
      darkMode: false,

      selectCompartment: (id) => set({ selectedCompartmentId: id }),

      addItem: (item) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...item, id: generateId() },
          ],
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

      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.darkMode
          if (newDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          return { darkMode: newDarkMode }
        }),

      getCompartmentItems: (compartmentId) =>
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
      name: 'carthago-inventory',
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark')
        }
      },
    },
  ),
)
