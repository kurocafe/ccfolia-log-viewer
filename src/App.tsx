import { parserLog } from "./parser"

export default function App () {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return 

    const reader = new FileReader()
    reader.onload = (event) => {
      const html = event.target?.result as string
      const entries = parserLog(html)
      console.log(entries)
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  )
}