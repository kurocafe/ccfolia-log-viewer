import { useMemo, useState } from "react"
import { COPY } from "../themeCopy"
import type { CharacterStats, D100Roll, DiceRollEntry, GrowthResult } from "../types"
import type { Theme } from "../useTheme"
import { analyzer } from "../analyzer"
import { growthRoller } from "../growthRoller"
import StatsTable from "./StatsTable"
import GrowthRollTable from "./GrowthRollTable"

interface Props {
  entries: DiceRollEntry[]
  d100Rolls: D100Roll[]
  theme: Theme
}

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

export default function LogAnalysisView({ entries, d100Rolls, theme }: Props) {
  const [growthResults, setGrowthResults] = useState<GrowthResult[]>([])
  const [selectedChar, setSelectedChar] = useState<string[]>([])
  const [hasRolled, setHasRolled] = useState(false)
  const [excludeNpc, setExcludeNpc] = useState(false)
  const [includeD100, setIncludeD100] = useState(false)
  const copy = COPY[theme]

  const stats = useMemo(
    () => analyzer(entries, d100Rolls, includeD100),
    [entries, d100Rolls, includeD100]
  )
  const npcThreshold = useMemo(() => calcNpcThreshold(stats), [stats])

  const handleGrowthRoll = () => {
    const filtered = entries.filter(e => selectedChar.includes(e.charName))
    setGrowthResults(growthRoller(filtered))
    setHasRolled(true)
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

  if (stats.length === 0) return null

  return (
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
  )
}