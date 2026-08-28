export type ThemeId = 'nyse' | 'ted'

export const THEME_OPTIONS: { value: ThemeId; label: string }[] = [
  { value: 'nyse', label: 'NYSE' },
  { value: 'ted', label: "Ted's Visual Taste" },
]

export const DEFAULT_THEME: ThemeId = 'ted'

export function applyTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme
}
