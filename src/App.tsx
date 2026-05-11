import { useState } from "react"
import { analyzer } from "./analyzer"
import { parserLog } from "./parser"
import StatsTable from "./components/statsTable"
import type { CharacterStats } from "./types"

export default function App() {
  const [stats, setStats] = useState<CharacterStats[]>([])
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const html = event.target?.result as string
      const entries = parserLog(html)
      setStats(analyzer(entries))
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {stats.length > 0 && <StatsTable stats={stats} />}
    </div>
  )
}