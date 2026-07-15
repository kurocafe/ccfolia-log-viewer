import { useEffect, useMemo, useState } from "react"
import { fetchLogs, postLog } from "./api/client"
import type { StoredLog } from "./types"
import { parseD100Rolls, parserLog } from "./parser"
import LogAnalysisView from "./components/LogAnalysisView"
import type { Theme } from "./useTheme"
import { COPY } from "./themeCopy"
import { readFileAsText } from "./readFileAsText"

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

async function computeHash(html: string): Promise<string> {
  const entries = parserLog(html).slice(0, 20)
  const d100Rolls = parseD100Rolls(html).slice(0, 20)
  const meaningful = JSON.stringify({ entries, d100Rolls })
  const data = new TextEncoder().encode(meaningful)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const pillClass = (active: boolean) =>
  `px-3 py-1.5 rounded-[var(--radius-pill)] border text-xs font-[family-name:var(--font-num)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]
  ${active
    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--surface-hover)]'
    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'}`

export default function Dashboard({ theme }: Props) {
  const [logs, setLogs] = useState<StoredLog[]>([])
  const [view, setView] = useState<View>({ type: 'list' })
  const [password, setPassword] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [isLoadingLogs, setIsLoadingLogs] = useState(true)
  const copy = COPY[theme]

  useEffect(() => {
    fetchLogs()
      .then(setLogs)
      .finally(() => setIsLoadingLogs(false))
  }, [])

  const grouped = useMemo(() => groupByScenario(logs), [logs])
  const scenarioEntries = useMemo(
    () => [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)),
    [grouped]
  )

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

  const characterData = useMemo(() => {
    if (view.type !== 'character')
      return { entries: [], d100Rolls: [] }
    return {
      entries: logs.flatMap(l => parserLog(l.content)),
      d100Rolls: logs.flatMap(l => parseD100Rolls(l.content)),
    }
  }, [view, logs])

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploadError(null)
    setIsUploading(true)
    try {
      const content = await readFileAsText(selectedFile)
      const contentHash = await computeHash(content)
      const scenario = selectedFile.name
        .replace(/\.html$/, '')
        .replace(/\s*\[[^\]]*\]$/, '')
      await postLog({ password, scenario, content, contentHash })
      setLogs(await fetchLogs())
      setSelectedFile(null)
      setFileInputKey((k) => k + 1)
      setPassword('')
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : '不明なエラーが発生しました')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-10 text-[var(--text)] font-[family-name:var(--font-body)]">
      <div className="w-full max-w-3xl mx-auto">
        {/* パンくず */}
        <div className="flex items-center gap-2 mb-8 text-sm font-[family-name:var(--font-heading)]">
          <button
            onClick={() => setView({ type: 'list' })}
            className="text-[var(--accent)] hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
          >
            {copy.navDashboard}
          </button>
          {view.type === 'scenario' && (
            <>
              <span className="text-[var(--text-faint)]">/</span>
              <span className="text-[var(--text-heading)]">
                {view.name}（{view.run === 'all' ? copy.allRunsLabel : `${view.run}${copy.runSuffix}`}）
              </span>
            </>
          )}
          {view.type === 'character' && (
            <>
              <span className="text-[var(--text-faint)]">/</span>
              <span className="text-[var(--text-heading)]">{copy.characterStatsTitle}</span>
            </>
          )}
        </div>

        {view.type === 'list' && (
          <div className="flex flex-col gap-8">
            {/* アップロード */}
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
                <div className="w-1.5 h-5 bg-[var(--accent)] rounded-[var(--radius-pill)]" />
                <span className="font-[family-name:var(--font-heading)] text-base text-[var(--text-heading)]">
                  {copy.uploadTitle}
                </span>
              </div>
              <div className="flex flex-col gap-3 px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className={`cursor-pointer ${isUploading ? 'pointer-events-none opacity-60' : ''}`}>
                    <input
                      key={fileInputKey}
                      type="file"
                      accept=".html"
                      disabled={isUploading}
                      onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    <span className="inline-block px-4 py-2 rounded-[var(--radius-btn)] border bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-border-hover)] shadow-[var(--btn-shadow)] transition-all duration-300 text-sm">
                      {copy.uploadFileLabel}
                    </span>
                  </label>
                  {selectedFile && (
                    <span className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-num)] max-w-60 truncate">
                      {selectedFile.name}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="password"
                    placeholder={copy.uploadPasswordPlaceholder}
                    value={password}
                    disabled={isUploading}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-3 py-2 w-40 rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-sm placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-60"
                  />
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="px-4 py-2 rounded-[var(--radius-btn)] border bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-border-hover)] shadow-[var(--btn-shadow)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {isUploading ? copy.uploadInProgress : copy.uploadSubmit}
                  </button>
                </div>

                {uploadError && (
                  <p className="text-[var(--c-error)] text-sm">{uploadError}</p>
                )}
              </div>
            </div>

            {/* シナリオ一覧 */}
            <div className="border border-[var(--border)] bg-[var(--surface)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
                <div className="w-1.5 h-5 bg-[var(--accent)] rounded-[var(--radius-pill)]" />
                <span className="font-[family-name:var(--font-heading)] text-base text-[var(--text-heading)]">
                  {copy.scenarioListTitle}
                </span>
                {!isLoadingLogs && (
                  <span className="ml-auto font-[family-name:var(--font-num)] text-xs text-[var(--text-muted)]">
                    {scenarioEntries.length}
                  </span>
                )}
              </div>

              {isLoadingLogs ? (
                <div className="flex flex-col items-center gap-2 px-5 py-8">
                  <img src="/SD.png" alt="" className="h-20 w-auto animate-bounce" />
                  <p className="text-sm text-[var(--text-muted)]">{copy.loadingLogs}</p>
                </div>
              ) : scenarioEntries.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                  {copy.dashboardEmpty}
                </p>
              ) : (
                <div>
                  {scenarioEntries.map(([scenario, scenarioLogs]) => (
                    <div
                      key={scenario}
                      className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--surface-hover)] transition-colors duration-150"
                    >
                      <button
                        onClick={() => setView({ type: 'scenario', name: scenario, run: 'all' })}
                        className="font-[family-name:var(--font-body)] text-[var(--text)] hover:text-[var(--accent)] transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded"
                      >
                        {scenario}
                      </button>
                      <div className="ml-auto flex flex-wrap gap-1.5">
                        {[...scenarioLogs].sort((a, b) => a.run - b.run).map((log) => (
                          <button
                            key={log.id}
                            onClick={() => setView({ type: 'scenario', name: scenario, run: log.run })}
                            className="px-2.5 py-1 rounded-[var(--radius-pill)] border border-[var(--border)] text-xs font-[family-name:var(--font-num)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                          >
                            {log.run}{copy.runSuffix}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {scenarioEntries.length > 0 && (
                <div className="px-5 py-4 border-t border-[var(--border)]">
                  <button
                    onClick={() => setView({ type: 'character' })}
                    className="w-full rounded-[var(--radius-btn)] border bg-[var(--btn-bg)] text-[var(--btn-text)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)] hover:border-[var(--btn-border-hover)] shadow-[var(--btn-shadow)] transition-all duration-300 py-2.5 font-[family-name:var(--font-heading)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    {copy.characterStatsButton}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {view.type === 'scenario' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setView({ type: 'scenario', name: view.name, run: 'all' })}
                aria-pressed={view.run === 'all'}
                className={pillClass(view.run === 'all')}
              >
                {copy.allRunsLabel}
              </button>
              {[...(grouped.get(view.name) ?? [])].sort((a, b) => a.run - b.run).map((log) => (
                <button
                  key={log.id}
                  onClick={() => setView({ type: 'scenario', name: view.name, run: log.run })}
                  aria-pressed={view.run === log.run}
                  className={pillClass(view.run === log.run)}
                >
                  {log.run}{copy.runSuffix}
                </button>
              ))}
            </div>
            <LogAnalysisView entries={scenarioData.entries} d100Rolls={scenarioData.d100Rolls} theme={theme} />
          </div>
        )}

        {view.type === 'character' && (
          <LogAnalysisView entries={characterData.entries} d100Rolls={characterData.d100Rolls} theme={theme} />
        )}
      </div>
    </div>
  )
}
