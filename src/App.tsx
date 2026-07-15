import { useState } from "react"
import { parserLog, parseD100Rolls } from "./parser"
import type { DiceRollEntry, D100Roll } from "./types"
import type { Theme } from "./useTheme"
import { COPY } from "./themeCopy"
import LogAnalysisView from "./components/LogAnalysisView"

interface Props {
  theme: Theme
}

export default function App({ theme }: Props) {
  const [entries, setEntries] = useState<DiceRollEntry[]>([])
  const [d100Rolls, setD100Rolls] = useState<D100Roll[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const copy = COPY[theme]


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const html = event.target?.result as string
        processHtmlContent(html)
      } catch (e) {
        console.error("ログの解析に失敗しました：", e)
        setErrorMessage("ログの解析に失敗しました。正しいccfoliaのHTMLファイルか確認してください。")
      }
    }
    reader.onerror = () => {
      console.error("ファイルの読み込みに失敗しました")
      setErrorMessage("ファイルの読み込みに失敗しました。再度試してください。")
    }

    reader.readAsText(file)
  }

  const processHtmlContent = (html: string) => {
    setEntries(parserLog(html))
    setD100Rolls(parseD100Rolls(html))

    setErrorMessage(null)
  }


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (!file.name.endsWith('.html')) {
      setErrorMessage("HTMLファイルをドロップしてください。")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const html = event.target?.result as string
        processHtmlContent(html)
      } catch (e) {
        console.error("ログの解析に失敗しました：", e)
        setErrorMessage("ログの解析に失敗しました。正しいccfoliaのHTMLファイルか確認してください。")
      }
    }
    reader.onerror = () => {
      console.error("ファイルの読み込みに失敗しました")
      setErrorMessage("ファイルの読み込みに失敗しました。再度試してください。")
    }

    reader.readAsText(file)
  }


  return (
    <div className="min-h-screen px-6 py-10 text-[var(--text)] font-[family-name:var(--font-body)]">
      <div className="w-full">
        <header className="text-center mb-10">
          <div className="text-[var(--accent)] text-sm mb-2 font-[family-name:var(--font-accent)] tracking-[0.3em]">
            {copy.eyebrow}
          </div>
          <h1 className="text-4xl font-[family-name:var(--font-heading)] text-[var(--text-heading)] tracking-wide mb-2">
            {copy.title}
          </h1>
          {copy.subtitle ? (
            <p className="text-xs text-[var(--text-muted)] font-[family-name:var(--font-body)]">
              {copy.subtitle}
            </p>
          ) : (
            <div className="w-48 h-px bg-linear-to-r from-transparent via-[var(--accent)] to-transparent mx-auto" />
          )}
        </header>

        <div
          className="flex flex-col items-center mb-10"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
        >
          <label className="cursor-pointer group">
            <input
              type="file"
              accept=".html"
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              className={`border rounded-[var(--radius-card)] min-w-80 text-center px-8 py-5 transition-all duration-300 font-[family-name:var(--font-body)] text-base shadow-[var(--shadow-card)]
              ${isDragging
                  ? 'border-[var(--upload-border-active)] bg-[var(--upload-bg-active)]'
                  : 'border-[var(--upload-border)] bg-[var(--upload-bg)]'}
              hover:border-[var(--upload-border-active)] hover:bg-[var(--upload-bg-hover)] text-[var(--upload-text)]`}>
              {isDragging ? copy.uploadDrag : copy.uploadIdle}
            </div>
          </label>
          {errorMessage && (
            <p className="text-center text-[var(--c-error)] text-sm mt-4 font-[family-name:var(--font-body)]">
              {errorMessage}
            </p>
          )}
        </div>

        <LogAnalysisView entries={entries} d100Rolls={d100Rolls} theme={theme} />
      </div>
    </div>
  )
}
