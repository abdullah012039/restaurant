"use client"
import { AppProvider } from "@/contexts/app-provider"
import { FavoritesProvider } from "@/contexts/favorites-provider"
import { ThemeProvider } from "@/contexts/theme-provider"
import { CartProvider } from "@/contexts/cart-provider"
import { ReactNode, useEffect } from "react"
import { useApp } from "@/contexts/app-context"

export function AppProviders({ children }: { children: ReactNode }) {
  const { state } = useApp();
  const { publicData } = state;

  useEffect(() => {
    if (publicData && publicData.system && publicData.system.design_settings) {
      const settings = publicData.system.design_settings;
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        if (settings.primary_color) root.style.setProperty('--primary', hexToHsl(settings.primary_color));
        if (settings.secondary_color) root.style.setProperty('--secondary', hexToHsl(settings.secondary_color));
        if (settings.background) root.style.setProperty('--background', hexToHsl(settings.background));
        if (settings.foreground) root.style.setProperty('--foreground', hexToHsl(settings.foreground));
        if (settings.border) root.style.setProperty('--border', hexToHsl(settings.border));
        if (settings.radius) root.style.setProperty('--radius', settings.radius);
      }
    }
  }, [publicData]);

  // Helper: Convert HEX to HSL string for Tailwind CSS variables
  function hexToHsl(hex: string) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
    >
      <AppProvider>
        <FavoritesProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </FavoritesProvider>
      </AppProvider>
    </ThemeProvider>
  )
}
