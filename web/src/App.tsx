import { Sun, Moon, Weight } from 'lucide-react'
import { useInventoryStore } from './stores/inventoryStore'
import { CompartmentTree } from './components/CompartmentTree'
import { CompartmentViewer } from './components/CompartmentViewer'
import { BottomSheet } from './components/BottomSheet'

function Header() {
  const { darkMode, toggleDarkMode, getTotalWeight } = useInventoryStore()
  const totalWeight = getTotalWeight()

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-terracotta text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-gray-100">
            C2-tourer Stauraum
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            148 RB-QB L comfort
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-xl bg-sand px-3 py-1.5 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300 sm:flex">
          <Weight size={16} className="text-terracotta" />
          <span>{totalWeight.toFixed(1)} kg</span>
        </div>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-xl bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Dark Mode umschalten"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a
          href="https://github.com/danielfaludi123-bit/carthago-c2-tourer-inventory"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="GitHub Repository"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 shrink-0 overflow-hidden border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
          <CompartmentTree />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 overflow-hidden">
            <CompartmentViewer />
          </div>
          <BottomSheet />
        </main>
      </div>
    </div>
  )
}

export default App
