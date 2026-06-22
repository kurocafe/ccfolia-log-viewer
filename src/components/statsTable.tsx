import { useState } from "react"
import type { CharacterStats, ResultType } from "../types"
import type { Theme } from "../useTheme"
import { COPY } from "../themeCopy"

interface Props {
  stats: CharacterStats[]
  selectedChar: string[]
  onToggle: (charName: string) => void
  theme: Theme
}

type SortableKey = 'total' | 'successRate' | 'criticalRate' | 'fumbleRate'

const RESULT_CONFIG: Record<ResultType, { label: string; varName: string }> = {
  critical: { label: "クリティカル", varName: "critical" },
  special: { label: "スペシャル", varName: "special" },
  hardSuccess: { label: "ハード成功", varName: "hard" },
  success: { label: "成功", varName: "success" },
  failure: { label: "失敗", varName: "failure" },
  fumble: { label: "ファンブル", varName: "fumble" },
}

function RateBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-[family-name:var(--font-num)] font-medium text-sm w-14 text-right" style={{ color }}>
        {(value * 100).toFixed(1)}%
      </span>
      <div className="w-16 h-1.5 bg-[var(--rate-track)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(value * 100, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

export default function StatsTable({ stats, selectedChar, onToggle, theme }: Props) {
  const [sortKey, setSortKey] = useState<SortableKey | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const copy = COPY[theme]

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
    <div className="border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
        <div className="w-1.5 h-5 bg-[var(--accent)] rounded-[var(--radius-pill)]" />
        <span className="font-[family-name:var(--font-heading)] text-base text-[var(--text-heading)]">
          {copy.statsTitle}
        </span>
        <span className="ml-auto font-[family-name:var(--font-num)] text-xs text-[var(--text-muted)]">
          {stats.length} {copy.countSuffix}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left px-5 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--text-muted)]">
                {copy.explorer}
              </th>
              <th
                className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--text-muted)] text-center cursor-pointer hover:text-[var(--text-heading)] transition-colors"
                onClick={() => handleSort('total')}
              >
                合計
                {sortKey === 'total' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              {Object.entries(RESULT_CONFIG).map(([key, cfg]) => (
                <th
                  key={key}
                  className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-center"
                  style={{ color: `var(--c-${cfg.varName})` }}
                >
                  {cfg.label}
                </th>
              ))}
              <th
                className="px-4 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--c-success)] text-center cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => handleSort('successRate')}
              >
                成功率
                {sortKey === 'successRate' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--c-critical)] text-center cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => handleSort('criticalRate')}
              >
                クリティカル率
                {sortKey === 'criticalRate' && (sortDir === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th className="px-4 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--c-fumble)] text-center cursor-pointer hover:opacity-70 transition-opacity"
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
                className="border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors duration-150 group"
              >
                <td className="px-5 py-3 font-[family-name:var(--font-body)] text-[var(--text)] group-hover:text-[var(--accent)] transition-colors min-w-32 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedChar.includes(stat.charName)}
                      onChange={() => onToggle(stat.charName)}
                      className="w-3.5 h-3.5 accent-[var(--accent)] cursor-pointer"
                    />
                    <span className="text-[var(--text-index)] font-[family-name:var(--font-num)] text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {stat.charName || <span className="text-[var(--text-muted)] italic">unknown</span>}
                  </div>
                </td>
                <td className="px-3 py-3 text-center font-[family-name:var(--font-num)] text-[var(--text-num)]">
                  {stat.total}
                </td>
                {(Object.keys(RESULT_CONFIG) as ResultType[]).map((key) => {
                  const cfg = RESULT_CONFIG[key]
                  const count = stat.counts[key]
                  return (
                    <td key={key} className="px-3 py-3 text-center">
                      {count > 0 ? (
                        <span
                          className="inline-block px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-[family-name:var(--font-num)] font-medium"
                          style={{ color: `var(--c-${cfg.varName})`, backgroundColor: `var(--c-${cfg.varName}-bg)` }}
                        >
                          {count}
                        </span>
                      ) : (
                        <span className="text-[var(--text-faint)] font-[family-name:var(--font-num)] text-xs">—</span>
                      )}
                    </td>
                  )
                })}
                <td className="px-4 py-3">
                  <RateBar value={stat.successRate} color="var(--c-success)" />
                </td>
                <td className="px-4 py-3">
                  <RateBar value={stat.criticalRate} color="var(--c-critical)" />
                </td>
                <td className="px-4 py-3">
                  <RateBar value={stat.fumbleRate} color="var(--c-fumble)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
}
