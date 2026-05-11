import type { CharacterStats } from "../types";

interface Props {
  stats: CharacterStats[]
}

export default function StatsTable({ stats }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Character</th>
          <th>sum</th>
          <th>critical</th>
          <th>special</th>
          <th>hardSuccess</th>
          <th>success</th>
          <th>failure</th>
          <th>fumble</th>
          <th>successRate</th>
          <th>criticalRate</th>
          <th>fumbleRate</th>
        </tr>
      </thead>
      <tbody>
        {stats.map(stat => (
          <tr key={stat.charName}>
            <td>{stat.charName}</td>
            <td>{stat.total}</td>
            <td>{stat.counts.critical}</td>
            <td>{stat.counts.special}</td>
            <td>{stat.counts.hardSuccess}</td>
            <td>{stat.counts.success}</td>
            <td>{stat.counts.failure}</td>
            <td>{stat.counts.fumble}</td>
            <td>{(stat.successRate * 100).toFixed(2)}%</td>
            <td>{(stat.criticalRate * 100).toFixed(2)}%</td>
            <td>{(stat.fumbleRate * 100).toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}