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
