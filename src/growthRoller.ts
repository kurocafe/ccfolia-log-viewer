/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DiceRollEntry, GrowthResult } from "./types";

export function growthRoller(entries: DiceRollEntry[]): GrowthResult[] {
  const groups = new Map<string, Map<string, DiceRollEntry[]>>()
  const NON_GROWTH_SKILLS = ['アイデア', '幸運', '知識', 'クトゥルフ神話']

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

  const results: GrowthResult[] = []
  for (const [_, skillMap] of groups) {
    for (const [__, skillEntries] of skillMap) {

      const hasCritical = skillEntries.some(e => e.result === 'critical')
      const hasSuccess = skillEntries.some(e => e.result === 'success' || e.result === 'hardSuccess' || e.result === 'special' || e.result === 'critical')

      // 対象外はスキップ
      if (NON_GROWTH_SKILLS.includes(skillEntries[0].skill)) continue
      if (skillEntries[0].skill.includes('×')) continue

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