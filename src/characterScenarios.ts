import { parseD100Rolls, parserLog } from "./parser";
import type { StoredLog, DiceRollEntry, D100Roll } from "./types"

type CharacterScenario = {
  scenario: string
  run: number
  entries: DiceRollEntry[]
  d100Rolls: D100Roll[]
}

export function scenariosForCharacter(charName: string, logs: StoredLog[]) {
  const result: CharacterScenario[] = []
  for (const log of logs) {
    const charLog = parserLog(log.content).filter(entry => entry.charName === charName)
    const charD100Rolls = parseD100Rolls(log.content).filter(entry => entry.charName === charName)

    if (charLog.length > 0) {
      result.push({
        scenario: log.scenario,
        run: log.run,
        entries: charLog,
        d100Rolls: charD100Rolls
      })
    }
  }

  return result
}