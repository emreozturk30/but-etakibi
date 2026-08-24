import { useEffect, useState } from 'react'

const VAR_NAMES = [
  '--chart-blue',
  '--chart-income',
  '--chart-expense',
  '--chart-grid',
  '--chart-muted',
  '--text',
  '--bg',
  '--cat-1',
  '--cat-2',
  '--cat-3',
  '--cat-4',
  '--cat-5',
  '--cat-6',
  '--cat-7',
  '--cat-8',
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
