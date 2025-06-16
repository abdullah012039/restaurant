// Unified ThemeProvider for both restaurant and supermarket
"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"
import { applyThemeFromJson } from "@/lib/theme"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Fetch theme settings dynamically (pseudo-code, replace with your logic)
    async function loadTheme() {
      // Example: fetch theme from API or context
      // const themeData = await fetchThemeData()
      // if (themeData) applyThemeFromJson(themeData)
    }
    loadTheme()
  }, [])
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
