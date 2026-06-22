import { SUCCESS_RESULTS, type CharacterStats, type DiceRollEntry, type D100Roll, type ResultType } from "./types";

export function analyzer(
  entries: DiceRollEntry[],
  d100Rolls: D100Roll[] = [],
  includeD100 = false
): CharacterStats[] {
  const entriesByChar = new Map<string, DiceRollEntry[]>()
  const d100ByChar = new Map<string, D100Roll[]>()
  const charNames = new Set<string>()

  for (const entry of entries) {
    charNames.add(entry.charName)
    if (!entriesByChar.has(entry.charName)) {
      entriesByChar.set(entry.charName, [])
    }
    entriesByChar.get(entry.charName)!.push(entry)
  }

  if (includeD100) {
    for (const roll of d100Rolls) {
      charNames.add(roll.charName)
      if (!d100ByChar.has(roll.charName)) {
        d100ByChar.set(roll.charName, [])
      }
      d100ByChar.get(roll.charName)!.push(roll)
    }
  }

  const stats: CharacterStats[] = []

  // 生の 1d100 単体では CC/CCB を判別できないため、同じログ内の CC/CCB
  // エントリの多数派からシナリオのコマンド種別を推定する（混在しない前提）。
  // CC（7版）はクリティカルが出目1のみ、CCB（6版）は 1〜5。
  const ccCount = entries.filter(e => e.command === 'CC').length
  const isCCScenario = ccCount > entries.length - ccCount
  const d100CriticalMax = isCCScenario ? 1 : 5

  for (const charName of charNames) {
    const counts: Record<ResultType, number> = {
      critical: 0,
      special: 0,
      hardSuccess: 0,
      success: 0,
      failure: 0,
      fumble: 0
    }

    const charEntries = entriesByChar.get(charName) ?? []
    const effectiveEntries = charEntries.map(e => ({
      ...e,
      result: e.command === 'CCB' && e.roll >= 96 ? 'fumble' as ResultType : e.result
    }))

    for (const e of effectiveEntries) {
      counts[e.result]++
    }

    let total = charEntries.length

    // 生の 1d100 は技能値が無いため成否を判定できない。
    // クリティカルは CC=1 のみ / CCB=1〜5、ファンブルは 96〜100 とし、
    // 間の出目は合計回数にだけ加算する（成否カウントには入れない）
    if (includeD100) {
      const rolls = d100ByChar.get(charName) ?? []
      for (const r of rolls) {
        total++
        if (r.roll <= d100CriticalMax) counts.critical++
        else if (r.roll >= 96) counts.fumble++
      }
    }

    const successCount = SUCCESS_RESULTS.reduce((sum, key) => sum + counts[key], 0)

    stats.push({
      charName,
      total,
      counts,
      successRate: total ? successCount / total : 0,
      criticalRate: total ? counts.critical / total : 0,
      fumbleRate: total ? counts.fumble / total : 0
    })
  }

  return stats
}
