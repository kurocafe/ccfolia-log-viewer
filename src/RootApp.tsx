import { useState } from "react"
import App from "./App"
import Dashboard from "./Dashboard"
import { useTheme } from "./useTheme"
import { COPY } from "./themeCopy"

type Tab = 'local' | 'dashboard'

export default function RootApp() {
  const [tab, setTab] = useState<Tab>('local')
  const { theme, toggle } = useTheme()
  const copy = COPY[theme]

  return (
    <>
      <nav className="flex items-center justify-center gap-2 px-6 py-3 border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="flex gap-1 p-1 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)]">
          <button
            onClick={() => setTab('local')}
            aria-current={tab === 'local' ? 'page' : undefined}
            className={`px-4 py-1.5 rounded-[var(--radius-btn)] text-sm font-[family-name:var(--font-heading)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
              ${tab === 'local'
                ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] shadow-[var(--btn-shadow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'}`}
          >
            {copy.navLocal}
          </button>
          <button
            onClick={() => setTab('dashboard')}
            aria-current={tab === 'dashboard' ? 'page' : undefined}
            className={`px-4 py-1.5 rounded-[var(--radius-btn)] text-sm font-[family-name:var(--font-heading)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
              ${tab === 'dashboard'
                ? 'bg-[var(--btn-bg)] text-[var(--btn-text)] shadow-[var(--btn-shadow)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-heading)]'}`}
          >
            {copy.navDashboard}
          </button>
        </div>

        <button
          onClick={toggle}
          aria-label="テーマ切替"
          className="rounded-full border bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-border-hover)] shadow-[var(--btn-shadow)] transition-all duration-300 w-9 h-9 flex items-center justify-center text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {copy.toggleLabel}
        </button>
      </nav>

      {tab === 'local' ? <App theme={theme} /> : <Dashboard theme={theme} />}
    </>
  )
}
