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
  const [hasRolled, setHasRolled] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [npcThreshold, setNpcThreshold] = useState<number>(0)
  const [excludeNpc, setExcludeNpc] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const html = event.target?.result as string
        processHtmlContent(html)
      } catch (e) {
        console.error("ログの解析に失敗しました：", e)
        setErrorMessage("ログの解析に失敗しました。正しいccfoliaのHTMLファイルか確認してください。")
      }
    }
    reader.onerror = () => {
      console.error("ファイルの読み込みに失敗しました")
      setErrorMessage("ファイルの読み込みに失敗しました。再度試してください。")
    }

    reader.readAsText(file)
  }

  const calcNpcThreshold = (stats: CharacterStats[]) => {
    const totals = stats.map(s => s.total)
    const sorted = [...totals].sort((a, b) => a - b)
    const q3Index = Math.floor(sorted.length * 0.75)
    const upperValues = sorted.slice(q3Index)
    const upperMean = upperValues.reduce((a, b) => a + b, 0) / upperValues.length
    return upperMean * 0.3
  }

  const processHtmlContent = (html: string) => {
    const parsedEntries = parserLog(html)
    setEntries(parsedEntries)

    const analyzedStats = analyzer(parsedEntries)
    setStats(analyzedStats)

    setNpcThreshold(calcNpcThreshold(analyzedStats))

    setSelectedChar([])
    setHasRolled(false)
    setGrowthResults([])
    setErrorMessage(null)
  }

  const handleGrowthRoll = () => {
    const filtered = entries.filter(e => selectedChar.includes(e.charName))
    setGrowthResults(growthRoller(filtered))
    setHasRolled(true)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (!file.name.endsWith('.html')) {
      setErrorMessage("HTMLファイルをドロップしてください。")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const html = event.target?.result as string
        processHtmlContent(html)
      } catch (e) {
        console.error("ログの解析に失敗しました：", e)
        setErrorMessage("ログの解析に失敗しました。正しいccfoliaのHTMLファイルか確認してください。")
      }
    }
    reader.onerror = () => {
      console.error("ファイルの読み込みに失敗しました")
      setErrorMessage("ファイルの読み込みに失敗しました。再度試してください。")
    }

    reader.readAsText(file)
  }
  const toggleChar = (charName: string) => {
    setSelectedChar(prev =>
      prev.includes(charName)
        ? prev.filter(c => c !== charName)
        : [...prev, charName]
    )
  }

  const displayStats = excludeNpc
    ? stats.filter(s => s.total >= npcThreshold)
    : stats

  return (
    <div className="min-h-screen bg-[#07080f] text-[#e8e0d0] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="text-[#c9a24c] text-xs tracking-[0.4em] mb-3 font-['Cinzel']">
            ✦ ARCANE CHRONICLE ✦
          </div>
          <h1 className="text-3xl font-['Cinzel'] font-semibold text-[#e8e0d0] tracking-widest mb-2">
            CCFOLIA LOG VIEWER
          </h1>
          <div className="w-48 h-px bg-linear-to-r from-transparent via-[#c9a24c] to-transparent mx-auto" />
        </header>

        <div
          className="flex flex-col items-center mb-10"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <label className="cursor-pointer group">
            <input
              type="file"
              accept=".html"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className={`border min-w-80 text-center
              ${isDragging ? 'border-[#c9a24c] bg-[#c9a24c]/10' : 'border-[#c9a24c]/40 bg-[#0d0f1a]'} 
              hover:border-[#c9a24c] hover:bg-[#c9a24c]/5 transition-all duration-300 px-8 py-3 font-['Cinzel'] text-sm tracking-[0.25em] text-[#c9a24c] uppercase`}>
              {isDragging ? '⊕ ログファイルをドロップ (.html)' : '⊕ ログファイルを選んでね (.html)'}
            </div>
          </label>
          {errorMessage && (
            <p className="text-center text-[#f87171] text-sm mt-4">
              {errorMessage}
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <>
            <div className="flex justify-end mb-2">
              <label className="flex items-center gap-2 text-sm text-[#c9a24c] cursor-pointer">
                <input
                  type="checkbox"
                  checked={excludeNpc}
                  onChange={(e) => setExcludeNpc(e.target.checked)}
                  className="accent-[#c9a24c]"
                />
                NPCとおもわしきキャラクターを除外する
              </label>
            </div>

            <StatsTable stats={displayStats} selectedChar={selectedChar} onToggle={toggleChar} />
            <div className="flex justify-center mt-6">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleGrowthRoll}
                  disabled={selectedChar.length === 0 || hasRolled}
                  className="border border-[#c9a24c]/40 hover:border-[#c9a24c] bg-[#0d0f1a] hover:bg-[#c9a24c]/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 px-8 py-3 font-['Cinzel'] text-sm tracking-[0.25em] text-[#c9a24c] uppercase"
                >
                  ✦ 成長ロール実行
                </button>
                <p className="text-[#4a4a6a] text-xs font-['Noto_Serif_JP']">
                  ※ 初期値成功による成長判定は含まれていません
                </p>
              </div>
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
