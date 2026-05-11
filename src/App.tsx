import { useState } from "react"
import { analyzer } from "./analyzer"
import { parserLog } from "./parser"
import StatsTable from "./components/statsTable"
import type { CharacterStats } from "./types"

export default function App() {
  const [stats, setStats] = useState<CharacterStats[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const html = event.target?.result as string
      const entries = parserLog(html)
      setStats(analyzer(entries))
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-[#07080f] text-[#e8e0d0] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="text-[#c9a24c] text-xs tracking-[0.4em] mb-3 font-['Cinzel']">
            ✦ ARCANE CHRONICLE ✦
          </div>
          <h1 className="text-3xl font-['Cinzel'] font-semibold text-[#e8e0d0] tracking-widest mb-2">
            ccfolia Log Viewer
          </h1>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#c9a24c] to-transparent mx-auto" />
        </header>

        <div className="flex justify-center mb-10">
          <label className="cursor-pointer group">
            <input
              type="file"
              accept=".html"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="border border-[#c9a24c]/40 hover:border-[#c9a24c] bg-[#0d0f1a] hover:bg-[#c9a24c]/5 transition-all duration-300 px-8 py-3 font-['Cinzel'] text-sm tracking-[0.25em] text-[#c9a24c] uppercase">
              ⊕ ログファイルを選択
            </div>
          </label>
        </div>

        {stats.length > 0 && <StatsTable stats={stats} />}
      </div>
    </div>
  )
}
