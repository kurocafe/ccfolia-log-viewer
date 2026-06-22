type DiceCommand = 'CC' | 'CCB'

export type ResultType = 'critical' | 'special' | 'hardSuccess' | 'success' | 'failure' | 'fumble'

export const SUCCESS_RESULTS: ResultType[] = ['success', 'hardSuccess', 'special', 'critical']

export interface DiceRollEntry {
  charName: string
  command: DiceCommand
  skill: string
  target: number
  roll: number
  result: ResultType
  baseTarget: number
}

// 技能値を持たない生の 1d100（出目だけ）
export interface D100Roll {
  charName: string
  roll: number
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