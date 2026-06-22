import { useMemo, useState } from "react"
import { analyzer } from "./analyzer"
import { parserLog, parseD100Rolls } from "./parser"
import StatsTable from "./components/statsTable"
import type { DiceRollEntry, CharacterStats, GrowthResult, D100Roll } from "./types"
import { growthRoller } from "./growthRoller"
import GrowthRollTable from "./components/growthRollTable"
import { useTheme } from "./useTheme"
import { COPY } from "./themeCopy"

// 判定回数の上位層の平均をもとに、NPCとみなす合計回数のしきい値を求める
function calcNpcThreshold(stats: CharacterStats[]) {
  if (stats.length === 0) return 0
  const totals = stats.map(s => s.total)
  const sorted = [...totals].sort((a, b) => a - b)
  const q3Index = Math.floor(sorted.length * 0.75)
  const upperValues = sorted.slice(q3Index)
  const upperMean = upperValues.reduce((a, b) => a + b, 0) / upperValues.length
  return upperMean * 0.3
}

export default function App() {
  const [growthResults, setGrowthResults] = useState<GrowthResult[]>([])
  const [selectedChar, setSelectedChar] = useState<string[]>([])
  const [entries, setEntries] = useState<DiceRollEntry[]>([])
  const [d100Rolls, setD100Rolls] = useState<D100Roll[]>([])
  const [hasRolled, setHasRolled] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [excludeNpc, setExcludeNpc] = useState(false)
  const [includeD100, setIncludeD100] = useState(false)
  const { theme, toggle } = useTheme()
  const copy = COPY[theme]

  const stats = useMemo(
    () => analyzer(entries, d100Rolls, includeD100),
    [entries, d100Rolls, includeD100]
  )
  const npcThreshold = useMemo(() => calcNpcThreshold(stats), [stats])

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

  const processHtmlContent = (html: string) => {
    setEntries(parserLog(html))
    setD100Rolls(parseD100Rolls(html))

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
    <div className="min-h-screen px-6 py-10 text-[var(--text)] font-[family-name:var(--font-body)]">
      <div className="w-full">
        <div className="flex justify-end mb-2">
          <button
            onClick={toggle}
            className="rounded-[var(--radius-btn)] border bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-border-hover)] shadow-[var(--btn-shadow)] transition-all duration-300 px-4 py-1.5 text-sm font-[family-name:var(--font-body)]"
          >
            {copy.toggleLabel}
          </button>
        </div>

        <header className="text-center mb-10">
          <div className="text-[var(--accent)] text-sm mb-2 font-[family-name:var(--font-accent)] tracking-[0.3em]">
            {copy.eyebrow}
          </div>
          <h1 className="text-4xl font-[family-name:var(--font-heading)] text-[var(--text-heading)] tracking-wide mb-2">
            {copy.title}
          </h1>
          {copy.subtitle ? (
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              {copy.subtitle}
            </p>
          ) : (
            <div className="w-48 h-px bg-linear-to-r from-transparent via-[var(--accent)] to-transparent mx-auto" />
          )}
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
              className={`border rounded-[var(--radius-card)] min-w-80 text-center px-8 py-5 transition-all duration-300 font-[family-name:var(--font-body)] text-base shadow-[var(--shadow-card)]
              ${isDragging
                ? 'border-[var(--upload-border-active)] bg-[var(--upload-bg-active)]'
                : 'border-[var(--upload-border)] bg-[var(--upload-bg)]'}
              hover:border-[var(--upload-border-active)] hover:bg-[var(--upload-bg-hover)] text-[var(--upload-text)]`}>
              {isDragging ? copy.uploadDrag : copy.uploadIdle}
            </div>
          </label>
          {errorMessage && (
            <p className="text-center text-[var(--c-error)] text-sm mt-4 font-[family-name:var(--font-body)]">
              {errorMessage}
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <>
            <div className="flex justify-end flex-wrap gap-x-5 gap-y-1 mb-2">
              <label className="flex items-center gap-2 text-sm text-[var(--accent)] cursor-pointer font-[family-name:var(--font-body)]">
                <input
                  type="checkbox"
                  checked={includeD100}
                  onChange={(e) => setIncludeD100(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                {copy.includeD100}
              </label>
              <label className="flex items-center gap-2 text-sm text-[var(--accent)] cursor-pointer font-[family-name:var(--font-body)]">
                <input
                  type="checkbox"
                  checked={excludeNpc}
                  onChange={(e) => setExcludeNpc(e.target.checked)}
                  className="accent-[var(--accent)]"
                />
                {copy.excludeNpc}
              </label>
            </div>

            <StatsTable stats={displayStats} selectedChar={selectedChar} onToggle={toggleChar} theme={theme} />
            <div className="flex justify-center mt-6">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleGrowthRoll}
                  disabled={selectedChar.length === 0 || hasRolled}
                  className="rounded-[var(--radius-btn)] border bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-border-hover)] shadow-[var(--btn-shadow)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 px-10 py-3 font-[family-name:var(--font-heading)] text-base"
                >
                  {copy.growthButton}
                </button>
                <p className="text-[var(--text-muted)] text-xs font-[family-name:var(--font-body)]">
                  {copy.growthNote}
                </p>
              </div>
            </div>
            {growthResults.length > 0 && (
              <div className="mt-6">
                <GrowthRollTable growthResults={growthResults} theme={theme} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
