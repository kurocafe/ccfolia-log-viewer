import { useEffect, useState } from "react"

export type Theme = "cool" | "soft"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "cool"
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = () => setTheme((prev) => (prev === "cool" ? "soft" : "cool"))

  return { theme, toggle }
}
