import { useInventoryStore } from './stores/inventoryStore'
import { CompartmentViewer } from './components/CompartmentViewer'
import { InventoryNote } from './components/InventoryNote'

function Header() {
  const totalWeight = useInventoryStore((state) => state.getTotalWeight())
  const itemCount = useInventoryStore((state) => state.items.length)

  return (
    <header className="absolute left-4 top-4 z-10 flex items-center gap-4 rounded-2xl bg-white/95 px-5 py-3 shadow-lg backdrop-blur">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      </div>
      <div>
        <h1 className="text-base font-bold leading-tight text-stone-800">
          C2-tourer Stauraum
        </h1>
        <p className="text-xs text-stone-500">
          {itemCount} Gegenstände · {totalWeight.toFixed(1)} kg
        </p>
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#f5f1e8]">
      <Header />
      <CompartmentViewer />
      <InventoryNote />
    </div>
  )
}

export default App
