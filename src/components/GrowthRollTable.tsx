import type { GrowthResult } from "../types";
import type { Theme } from "../useTheme"
import { COPY } from "../themeCopy"

interface Props {
  growthResults: GrowthResult[]
  theme: Theme
}

export default function GrowthRollTable({ growthResults, theme }: Props) {
  const charNames = [...new Set(growthResults.map(r => r.charName))]
  const copy = COPY[theme]

  return (
    <div className="space-y-6">
      {charNames.map(charName => {
        const charRolls = growthResults.filter(r => r.charName === charName)
        return (
          <div key={charName} className="border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
              <div className="w-1.5 h-5 bg-[var(--c-special)] rounded-[var(--radius-pill)]" />
              <span className="font-[family-name:var(--font-heading)] text-base text-[var(--c-special)]">
                {copy.growthTitle}
              </span>
              <span className="font-[family-name:var(--font-body)] text-[var(--text-heading)] ml-2">{charName}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left px-5 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--text-muted)]">技能</th>
                    <th className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--text-muted)] text-center">現在値</th>
                    <th className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--c-critical)] text-center">クリティカル成長</th>
                    <th className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--text-muted)] text-center">成長ロール</th>
                    <th className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--text-muted)] text-center">ロール成長</th>
                    <th className="px-3 py-3 font-[family-name:var(--font-heading)] text-xs text-[var(--c-success)] text-center">結果</th>
                  </tr>
                </thead>
                <tbody>
                  {charRolls.map(result => {
                    const reRollGrows = result.reRoll !== undefined && result.reRoll > result.target
                    const totalIncrease = (result.autoIncrease ?? 0) + (result.reRollIncrease ?? 0)
                    return (
                      <tr
                        key={`${result.charName}-${result.skill}`}
                        className="border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors duration-150"
                      >
                        <td className="px-5 py-3 font-[family-name:var(--font-body)] text-[var(--text)]">
                          {result.skill}
                        </td>
                        <td className="px-3 py-3 text-center font-[family-name:var(--font-num)] text-[var(--text-num)]">
                          {result.target}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {result.autoIncrease !== undefined ? (
                            <span className="inline-block px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-[family-name:var(--font-num)] font-medium text-[var(--c-critical)] bg-[var(--c-critical-bg)]">
                              +{result.autoIncrease}
                            </span>
                          ) : (
                            <span className="text-[var(--text-faint)] font-[family-name:var(--font-num)] text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center font-[family-name:var(--font-num)] text-sm">
                          {result.reRoll !== undefined ? (
                            <span className={reRollGrows ? "text-[var(--c-fumble)]" : "text-[var(--text-muted)]"}>
                              {result.reRoll}
                              <span className="text-xs ml-1">
                                {reRollGrows ? "（失敗）" : "（成功）"}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[var(--text-faint)] text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {result.reRollIncrease !== undefined ? (
                            <span className="inline-block px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-[family-name:var(--font-num)] font-medium text-[var(--c-special)] bg-[var(--c-special-bg)]">
                              +{result.reRollIncrease}
                            </span>
                          ) : (
                            <span className="text-[var(--text-faint)] font-[family-name:var(--font-num)] text-xs">-</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {totalIncrease > 0 ? (
                            <span className="inline-block px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-[family-name:var(--font-num)] font-medium text-[var(--c-success)] bg-[var(--c-success-bg)]">
                              +{totalIncrease}
                            </span>
                          ) : (
                            <span className="text-[var(--text-faint)] font-[family-name:var(--font-num)] text-xs">—</span>
                          )}
                        </td>
                      </tr>
                )
                  })}
              </tbody>
            </table>
          </div>
          </div>
  )
})}
    </div >
  )
}
