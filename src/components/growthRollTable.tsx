import type { GrowthResult } from "../types";

interface Props {
  growthResults: GrowthResult[]
}

export default function GrowthRollTable({ growthResults }: Props) {
  const charNames = [...new Set(growthResults.map(r => r.charName))]

  return (
    <div className="space-y-6">
      {charNames.map(charName => {
        const charRolles = growthResults.filter(r => r.charName === charName)
        return (
          <div key={charName} className="border border-[#2a2a3e] bg-[#0d0f1a]">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-[#2a2a3e]">
              <div className="w-1.5 h-5 bg-[#a78bfa]" />
              <span className="font-['Cinzel'] text-sm tracking-[0.2em] text-[#a78bfa] uppercase">
                成長記録
              </span>
              <span className="font-['Noto_Serif_JP'] text-[#e8e0d0] ml-2">{charName}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2a3e]">
                    <th className="text-left px-5 py-3 font-['Cinzel'] text-xs tracking-[0.15em] text-[#6b6888] uppercase">技能</th>
                    <th className="px-3 py-3 font-['Cinzel'] text-xs tracking-widest text-[#6b6888] uppercase text-center">現在値</th>
                    <th className="px-3 py-3 font-['Cinzel'] text-xs tracking-widest text-[#fbbf24aa] uppercase text-center">クリティカル成長</th>
                    <th className="px-3 py-3 font-['Cinzel'] text-xs tracking-widest text-[#6b6888] uppercase text-center">成長ロール</th>
                    <th className="px-3 py-3 font-['Cinzel'] text-xs tracking-widest text-[#34d399aa] uppercase text-center">結果</th>
                  </tr>
                </thead>
                <tbody>
                  {charRolles.map(result => {
                    const reRollFailed = result.reRoll !== undefined && result.reRoll > result.target
                    const totalIncrease = (result.autoIncrease ?? 0) + (result.reRollIncrease ?? 0)
                    return (
                      <tr
                        key={result.skill}
                        className="border-b border-[#1e2030] hover:bg-[#a78bfa]/5 transition-colors duration-150"
                      >
                        <td className="px-5 py-3 font-['Noto_Serif_JP'] text-[#e8e0d0]">
                          {result.skill}
                        </td>
                        <td className="px-3 py-3 text-center font-['JetBrains_Mono'] text-[#8888aa]">
                          {result.target}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {result.autoIncrease !== undefined ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-medium text-[#fbbf24] bg-[rgba(251,191,36,0.12)]">
                              +{result.autoIncrease}
                            </span>
                          ) : (
                            <span className="text-[#2a2a3e] font-['JetBrains_Mono'] text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center font-['JetBrains_Mono'] text-sm">
                          {result.reRoll !== undefined ? (
                            <span className={reRollFailed ? "text-[#f87171]" : "text-[#6b7280]"}>
                              {result.reRoll}
                              <span className="text-xs ml-1">
                                {reRollFailed ? "（失敗）" : "（成功）"}
                              </span>
                            </span>
                          ) : (
                            <span className="text-[#2a2a3e] text-xs">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {totalIncrease > 0 ? (
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-['JetBrains_Mono'] font-medium text-[#34d399] bg-[rgba(52,211,153,0.12)]">
                              +{totalIncrease}
                            </span>
                          ) : (
                            <span className="text-[#2a2a3e] font-['JetBrains_Mono'] text-xs">—</span>
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
    </div>
  )
}
