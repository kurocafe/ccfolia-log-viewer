interface DiceRollResult {
  charName: string
  result: Results
}

type Results = {
  critical: number
  special: number
  success: number
  failure: number
  fumble: number
}

export default function App (results: DiceRollResult[]) {
  return (
    <div>
      app
    </div>
  )
}