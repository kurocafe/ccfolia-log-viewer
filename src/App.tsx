import { useState } from "react"
import { analyzer } from "./analyzer"
import { parserLog } from "./parser"
import StatsTable from "./components/statsTable"
import type { DiceRollEntry, CharacterStats, GrowthResult } from "./types"
import { growthRoller } from "./growthRoller"
import GrowthRollTable from "./components/growthRollTable"

export default function App() {
  const [stats, setStats] = useState<CharacterStats[]>([])
  const [growthResults, setGrowthResults] = useState<GrowthResult[]>([])
  const [selectedChar, setSelectedChar] = useState<string[]>([])
  const [entries, setEntries] = useState<DiceRollEntry[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const html = event.target?.result as string
      const parsedEntries = parserLog(html)
      setEntries(parsedEntries)
      setStats(analyzer(parsedEntries))
      setSelectedChar([])
      // setGrowthResults(growthRoller(parsedEntries))
    }
    reader.readAsText(file)
  }

  const handleGrowthRoll = () => {
    const filtered = entries.filter(e => selectedChar.includes(e.charName))
    setGrowthResults(growthRoller(filtered))
  }

  const toggleChar = (charName: string) => {
    setSelectedChar(prev =>
      prev.includes(charName)
        ? prev.filter(c => c !== charName)
        : [...prev, charName]
    )
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
          <div className="w-48 h-px bg-linear-to-r from-transparent via-[#c9a24c] to-transparent mx-auto" />
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

        {stats.length > 0 && (
          <>
            <StatsTable stats={stats} selectedChar={selectedChar} onToggle={toggleChar} />
            <div className="flex justify-center mt-6">
              <button
                onClick={handleGrowthRoll}
                disabled={selectedChar.length === 0}
                className="border border-[#c9a24c]/40 hover:border-[#c9a24c] bg-[#0d0f1a] hover:bg-[#c9a24c]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 px-8 py-3 font-['Cinzel'] text-sm tracking-[0.25em] text-[#c9a24c] uppercase"
              >
                ✦ 成長ロール実行
              </button>
            </div>
            {growthResults.length > 0 && (
              <div className="mt-6">
                <GrowthRollTable growthResults={growthResults} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
