export interface Compartment {
  id: string
  name: string
  meshName: string
  icon: string
  // Camera position for this compartment (world coordinates)
  cameraPosition: [number, number, number]
  // Where the camera should look at
  cameraTarget: [number, number, number]
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
}
