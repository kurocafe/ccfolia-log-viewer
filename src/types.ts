type DiceCommand = 'CC' | 'CCB'

export type ResultType = 'critical' | 'special' | 'hardSuccess' | 'success' | 'failure' | 'fumble'

export interface DiceRollEntry {
  charName: string
  command: DiceCommand
  skill: string
  target: number
  roll: number
  result: ResultType
}

export interface CharacterStats {
  charName: string
  total: number
  counts: Record<ResultType, number>
  successRate: number
  criticalRate: number
  fumbleRate: number
}

export interface GrowthResult {
  charName: string
  skill: string
  target: number
  autoIncrease?: number
  reRoll?: number
  reRollIncrease?: number
}