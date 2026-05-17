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

    const effectiveEntries = charEntries.map(e => ({
      ...e,
      result: e.command === 'CCB' && e.roll >= 96 ? 'fumble' as ResultType : e.result
    }))

    for (const e of effectiveEntries) {
      counts[e.result]++
    }

    stats.push({
      charName,
      total: charEntries.length,
      counts: counts,
      successRate: effectiveEntries.filter(e => SUCCESS_RESULTS.includes(e.result)).length / effectiveEntries.length || 0,
      criticalRate: effectiveEntries.filter(e => e.result === 'critical').length / effectiveEntries.length || 0,
      fumbleRate: effectiveEntries.filter(e => e.result === 'fumble').length / effectiveEntries.length || 0
    })
  }

  return stats
}