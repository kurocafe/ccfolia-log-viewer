import { useEffect, useMemo, useState } from "react";
import { fetchLogs } from "./api/client";
import type { StoredLog } from "./types";
import { parseD100Rolls, parserLog } from "./parser";
import LogAnalysisView from "./components/LogAnalysisView";
import type { Theme } from "./useTheme";

type View =
  | { type: 'list' }
  | { type: 'scenario', name: string, run: number | 'all' }
  | { type: 'character' }

interface Props {
  theme: Theme
}

function groupByScenario(logs: StoredLog[]): Map<string, StoredLog[]> {
  const map = new Map<string, StoredLog[]>()
  for (const log of logs) {
    const list = map.get(log.scenario) ?? []
    list.push(log)
    map.set(log.scenario, list)
  }

  return map
}

export default function Dashboard({ theme }: Props) {
  const [logs, setLogs] = useState<StoredLog[]>([])
  const [view, setView] = useState<View>({ type: 'list' })

  useEffect(() => {
    fetchLogs().then(setLogs)
  }, [])

  const grouped = groupByScenario(logs)

  const scenarioData = useMemo(() => {
    if (view.type !== 'scenario')
      return { entries: [], d100Rolls: [] }

    const scenarioLogs = grouped.get(view.name) ?? []
    const targetLogs = view.run === 'all'
      ? scenarioLogs
      : scenarioLogs.filter(l => l.run === view.run)

    return {
      entries: targetLogs.flatMap(l => parserLog(l.content)),
      d100Rolls: targetLogs.flatMap(l => parseD100Rolls(l.content)),
    }
  }, [view, grouped])

  return (
    <div>
      {view.type === 'list' && (
        <>
          {[...grouped.entries()].map(([scenario, scenarioLogs]) => (
            <div
              key={scenario}
              onClick={() => setView({ type: 'scenario', name: scenario, run: 'all' })}
            >
              {scenario}: {scenarioLogs.map(l => l.run).join(', ')}陣
            </div>
          ))}
        </>
      )}

      {view.type === 'scenario' && (
        <div>
          <button onClick={() => setView({ type: 'list' })}>Back</button>
          <p>{view.name} ({view.run === 'all' ? '全陣' : `${view.run}陣`}) </p>
          <LogAnalysisView entries={scenarioData.entries} d100Rolls={scenarioData.d100Rolls} theme={theme} />
        </div>
      )}
    </div>
  )
}