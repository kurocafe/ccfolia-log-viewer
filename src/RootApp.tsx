import { useState } from "react";
import App from "./App";
import Dashboard from "./Dashboard";
import { useTheme } from "./useTheme";

type Tab = 'local' | 'dashboard'

export default function RootApp() {
  const [tab, setTab] = useState<Tab>('local')
  const { theme, toggle } = useTheme()

  return (
    <div>
      <nav>
        <button onClick={() => setTab('local')}>Local</button>
        <button onClick={() => setTab('dashboard')}>Dashboard</button>
      </nav>
      {tab === 'local' ? <App theme={theme} toggle={toggle} /> : <Dashboard theme={theme} />}
    </div >
  )
}