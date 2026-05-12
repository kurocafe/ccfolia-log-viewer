import type { DiceRollEntry, GrowthResult } from "./types";

export function growthRoller(entries: DiceRollEntry[]): GrowthResult[] {
  const groups = new Map<string, Map<string, DiceRollEntry[]>>()

  for (const entry of entries) {
    if (!groups.has(entry.charName)) {
      groups.set(entry.charName, new Map())
    }
    const skillMap = groups.get(entry.charName)!
    if (!skillMap.has(entry.skill)) {
      skillMap.set(entry.skill, [])
    }
    skillMap.get(entry.skill)!.push(entry)
  }

  console.log(groups)
  const results: GrowthResult[] = []
  for (const [_, skillMap] of groups) {
    for (const [__, skillEntries] of skillMap) {

      const hasCritical = skillEntries.some(e => e.result === 'critical')
      const hasSuccess = skillEntries.some(e => e.result === 'success' || e.result === 'hardSuccess' || e.result === 'special' || e.result === 'critical')

      // 対象外はスキップ
      if (!hasCritical && !hasSuccess) continue

      const target = skillEntries[0].target
      const result: GrowthResult = {
        charName: skillEntries[0].charName,
        skill: skillEntries[0].skill,
        target
      }

      // クリティカル成長
      if (hasCritical) {
        result.autoIncrease = Math.floor(Math.random() * 10) + 1
      }

      // ノーマル成長
      if (hasSuccess) {
        result.reRoll = Math.floor(Math.random() * 100) + 1
        if (result.reRoll > target) {
          result.reRollIncrease = Math.floor(Math.random() * 10) + 1
        }
      }

      results.push(result)
    }
  }

  return results
}