export type CompartmentSide = 'left' | 'right' | 'rear' | 'front' | 'roof'

export interface Compartment {
  id: string
  name: string
  meshName: string
  icon: string
  side: CompartmentSide
}

export interface InventoryItem {
  id: string
  compartmentId: string
  name: string
  icon: string
  quantity: number
  checked: boolean
  weightKg?: number
}

export interface AppState {
  compartments: Compartment[]
  items: InventoryItem[]
  selectedItemId: string | null
  searchQuery: string
  openFlaps: string[]
}
