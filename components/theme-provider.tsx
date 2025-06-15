"use client"

import * as React from "react"
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes"
import { fetchRestaurantData } from "@/lib/data"
import { applyThemeFromJson } from "@/lib/theme"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [themeLoaded, setThemeLoaded] = React.useState(false)

  React.useEffect(() => {
    async function loadTheme() {
      try {
        const data = await fetchRestaurantData()
        const designSettings = data?.system?.design_settings
        if (designSettings && typeof designSettings === "object") {
          applyThemeFromJson(designSettings)
        }
      } catch (e) {
        console.error("Error loading theme:", e)
        // يمكن إضافة معالجة أخطاء هنا، مثل إظهار رسالة للمستخدم
      } finally {
        setThemeLoaded(true)
      }
    }
    loadTheme()
  }, [])

  if (!themeLoaded) return null // أو يمكن إظهار سبينر

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
