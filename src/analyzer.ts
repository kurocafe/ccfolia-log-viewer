import { SUCCESS_RESULTS, type CharacterStats, type DiceRollEntry, type ResultType } from "./types";

export function analyzer(entries: DiceRollEntry[]) {
  const groups = new Map<string, DiceRollEntry[]>()
  const stats: CharacterStats[] = []

  for (const entry of entries) {
    if (!groups.has(entry.charName)) {
      groups.set(entry.charName, [])
    }
    groups.get(entry.charName)!.push(entry)
  }

  for (const [charName, charEntries] of groups) {
    const counts: Record<ResultType, number> = {
      critical: 0,
      special: 0,
      hardSuccess: 0,
      success: 0,
      failure: 0,
      fumble: 0
    }
    for (const e of charEntries) {
      counts[e.result]++
    }

    stats.push({
      charName,
      total: charEntries.length,
      counts: counts,
      successRate: charEntries.filter(e => SUCCESS_RESULTS.includes(e.result)).length / charEntries.length || 0,
      criticalRate: charEntries.filter(e => e.result === 'critical').length / charEntries.length || 0,
      fumbleRate: charEntries.filter(e => e.result === 'fumble').length / charEntries.length || 0
    })
  }

  return stats
}