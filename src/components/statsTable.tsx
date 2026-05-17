import { useState } from "react"
import type { CharacterStats, ResultType } from "../types"

interface Props {
  stats: CharacterStats[]
  selectedChar: string[]
  onToggle: (charName: string) => void
}

type SortableKey = 'total' | 'successRate' | 'criticalRate' | 'fumbleRate'

const RESULT_CONFIG: Record<ResultType, { label: string; color: string; bg: string }> = {
  critical: { label: "クリティカル", color: "#fbbf24", bg: "rgba(251,191,36,0.12)" },
  special: { label: "スペシャル", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  hardSuccess: { label: "ハード成功", color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  success: { label: "成功", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
  failure: { label: "失敗", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  fumble: { label: "ファンブル", color: "#f87171", bg: "rgba(248,113,113,0.12)" },
}

function RateBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-['JetBrains_Mono'] text-sm w-14 text-right" style={{ color }}>
        {(value * 100).toFixed(1)}%
      </span>
      <div className="w-16 h-1 bg-[#1e2030] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(value * 100, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function StatsTable({ stats, selectedChar, onToggle }: Props) {
  const [sortKey, setSortKey] = useState<SortableKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const sorted = [...stats].sort((a, b) => {
    if (sortKey === null) return 0
    const aVal = a[sortKey as keyof CharacterStats]
    const bVal = b[sortKey as keyof CharacterStats]
    if (typeof aVal !== 'number' || typeof bVal !== 'number') return 0
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  const handleSort = (key: SortableKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div className="border border-[#2a2a3e] bg-[#0d0f1a]">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-[#2a2a3e]">
        <div className="w-1.5 h-5 bg-[#c9a24c]" />
        <span className="font-['Cinzel'] text-sm tracking-[0.2em] text-[#c9a24c] uppercase">
          判定記録
        </span>
        <span className="ml-auto font-['JetBrains_Mono'] text-xs text-[#4a4a6a]">
          {stats.length} characters
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3e]">
              <th className="text-left px-5 py-3 font-['Cinzel'] text-xs tracking-[0.15em] text-[#6b6888] uppercase">
                探索者
              </th>
              <th
                className="px-3 py-3 font-['Cinzel'] text-xs tracking-widest text-[#6b6888] uppercase text-center cursor-pointer hover:text-[#9e9caf] transition-colors"
                onClick={() => handleSort('total')}
              >
                合計
                {sortKey === 'total' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              {Object.entries(RESULT_CONFIG).map(([key, cfg]) => (
                <th
                  key={key}
                  className="px-3 py-3 font-['Cinzel'] text-xs tracking-widest uppercase text-center"
                  style={{ color: cfg.color + "99" }}
                >
                  {cfg.label}
                </th>
              ))}
              <th
                className="px-4 py-3 font-['Cinzel'] text-xs tracking-widest text-[#34d399aa] uppercase text-center cursor-pointer hover:text-[#32d399] transition-colors"
                onClick={() => handleSort('successRate')}
              >
                成功率
                {sortKey === 'successRate' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 font-['Cinzel'] text-xs tracking-widest text-[#fbbf24aa] uppercase text-center cursor-pointer hover:text-[#fbbf24] transition-colors"
                onClick={() => handleSort('criticalRate')}
              >
                クリティカル率
                {sortKey === 'criticalRate' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 font-['Cinzel'] text-xs tracking-widest text-[#f87171aa] uppercase text-center cursor-pointer hover:text-[#f87171] transition-colors"
                onClick={() => handleSort('fumbleRate')}
              >
                ファンブル率
                {sortKey === 'fumbleRate' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((stat, i) => (
              <tr
                key={stat.charName}
                className="border-b border-[#1e2030] hover:bg-[#c9a24c]/5 transition-colors duration-150 group"
              >
                <td className="px-5 py-3 font-['Noto_Serif_JP'] text-[#e8e0d0] group-hover:text-[#c9a24c] transition-colors min-w-32 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedChar.includes(stat.charName)}
                      onChange={() => onToggle(stat.charName)}
                      className="w-3.5 h-3.5 accent-[#c9a24c] cursor-pointer"
                    />
                    <span className="text-[#4a4a6a] font-['JetBrains_Mono'] text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {stat.charName || <span className="text-[#4a4a6a] italic">unknown</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center font-['JetBrains_Mono'] text-[#8888aa]">
                  {stat.total}
                </td>
                {(Object.keys(RESULT_CONFIG) as ResultType[]).map((key) => {
                  const cfg = RESULT_CONFIG[key]
                  const count = stat.counts[key]
                  return (
                    <td key={key} className="px-3 py-3 text-center">
                      {count > 0 ? (
                        <span
                          className="inline-block px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-medium"
                          style={{ color: cfg.color, backgroundColor: cfg.bg }}
                        >
                          {count}
                        </span>
                      ) : (
                        <span className="text-[#2a2a3e] font-['JetBrains_Mono'] text-xs">—</span>
                      )}
                    </td>
                  )
                })}
                <td className="px-4 py-3">
                  <RateBar value={stat.successRate} color="#34d399" />
                </td>
                <td className="px-4 py-3">
                  <RateBar value={stat.criticalRate} color="#fbbf24" />
                </td>
                <td className="px-4 py-3">
                  <RateBar value={stat.fumbleRate} color="#f87171" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
}
