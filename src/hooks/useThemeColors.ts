import { useEffect, useState } from 'react'

const VAR_NAMES = [
  '--chart-blue',
  '--chart-income',
  '--chart-expense',
  '--chart-grid',
  '--chart-muted',
  '--text',
] as const

type ThemeColors = Record<(typeof VAR_NAMES)[number], string>

function readColors(): ThemeColors {
  const styles = getComputedStyle(document.documentElement)
  const colors = {} as ThemeColors
  for (const name of VAR_NAMES) {
    colors[name] = styles.getPropertyValue(name).trim()
  }
  return colors
}

export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(() => readColors())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setColors(readColors())
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return colors
}
