import { SUCCESS_RESULTS, type DiceRollEntry, type GrowthResult } from "./types";
const NON_GROWTH_SKILLS = ['アイデア', '幸運', '知識', 'クトゥルフ神話']

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

  const results: GrowthResult[] = []
  for (const [, skillMap] of groups) {
    for (const [, skillEntries] of skillMap) {

      const hasCritical = skillEntries.some(e => {
        if (e.result !== 'critical') return false
        if (e.baseTarget >= 100) return e.roll === 1
        return true
      })
      const hasSuccess = skillEntries.some(e => SUCCESS_RESULTS.includes(e.result))

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