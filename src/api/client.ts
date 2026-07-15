import type { CreatedLog, StoredLog } from '../types'

const API_BASE = "/api"

interface StoredLogRow {
  id: string
  scenario: string
  run: number
  content: string
  content_hash: string
  created_at: string
}

export async function fetchLogs(): Promise<StoredLog[]> {
  const res = await fetch(`${API_BASE}/logs`)
  if (!res.ok) throw new Error(`Failed to fetch logs: ${res.statusText}`)
  const rows = await res.json()
  return rows.map((row: StoredLogRow) => ({
    id: row.id,
    scenario: row.scenario,
    run: row.run,
    content: row.content,
    contentHash: row.content_hash,
    createdAt: row.created_at
  }))
}

export interface PostLogParams {
  password: string
  scenario: string
  content: string
  contentHash: string
}

export async function postLog(params: PostLogParams): Promise<CreatedLog> {
  const res = await fetch(`${API_BASE}/logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    throw new Error(`Failed to post log: ${res.statusText}`)
  }

  const row = await res.json()
  return {
    id: row.id,
    scenario: row.scenario,
    run: row.run,
    createdAt: row.created_at,
  }
}