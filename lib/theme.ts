// lib/theme.ts
// Utility to apply theme JSON (with HEX colors) to CSS variables

export type ThemeJson = Record<string, string>;

export function applyThemeFromJson(theme: ThemeJson) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isDark = root.classList.contains('dark');
  Object.entries(theme).forEach(([key, value]) => {
    // في حالة الوضع الداكن، تجاهل background و foreground
    if (isDark && (key === 'background' || key === 'foreground')) return;
    // Convert camelCase to --kebab-case
    const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
    console.log(`Setting ${cssVar} to ${value}`); // Debug log
    root.style.setProperty(cssVar, value); // Force override
  });
}

// Default theme colors
const DEFAULT_COLORS = {
  primaryColor: "#00bfff",
  secondaryColor: "#ffffff",
  background: "#ffffff",
  foreground: "#304b7a",
  border: "#e5e5e5",
  radius: "0.5rem"
};

// Validate hex color
function isValidHexColor(color: string | undefined): boolean {
  if (!color) return false;
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

// Convert hex to HSL
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  if (!isValidHexColor(hex)) {
    console.warn(`Invalid hex color: ${hex}, using default color`);
    return { h: 0, s: 0, l: 100 }; // Default to white
  }

  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');

  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Convert hex to CSS HSL string
function hexToCSSHSL(hex: string | undefined): string {
  if (!hex || !isValidHexColor(hex)) {
    console.warn(`Invalid hex color: ${hex}, using default color`);
    return "0 0% 100%"; // Default to white
  }
  const { h, s, l } = hexToHSL(hex);
  return `${h} ${s}% ${l}%`;
}

// Update CSS variables based on design settings
export function updateThemeColors(designSettings: {
  primaryColor?: string;
  secondaryColor?: string;
  background?: string;
  foreground?: string;
  border?: string;
  radius?: string;
}) {
  const root = document.documentElement;
  
  // Use provided colors or fall back to defaults
  const colors = {
    primaryColor: designSettings.primaryColor || DEFAULT_COLORS.primaryColor,
    secondaryColor: designSettings.secondaryColor || DEFAULT_COLORS.secondaryColor,
    background: designSettings.background || DEFAULT_COLORS.background,
    foreground: designSettings.foreground || DEFAULT_COLORS.foreground,
    border: designSettings.border || DEFAULT_COLORS.border,
    radius: designSettings.radius || DEFAULT_COLORS.radius
  };

  // Update CSS variables
  root.style.setProperty('--primary', hexToCSSHSL(colors.primaryColor));
  root.style.setProperty('--secondary', hexToCSSHSL(colors.secondaryColor));
  root.style.setProperty('--background', hexToCSSHSL(colors.background));
  root.style.setProperty('--foreground', hexToCSSHSL(colors.foreground));
  root.style.setProperty('--border', hexToCSSHSL(colors.border));
  root.style.setProperty('--radius', colors.radius);
}

// Get HSL values for a hex color
export function getHSLValues(hex: string | undefined): string {
  return hexToCSSHSL(hex);
}
