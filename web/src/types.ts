export interface Compartment {
  id: string
  name: string
  parentId?: string
  meshName: string
  icon: string
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
  selectedCompartmentId: string | null
  darkMode: boolean
}
