import { createContext, useContext, useState, useEffect } from 'react'

const ThemeCtx = createContext({ isDark: true, toggle: () => {}, c: (d) => d })

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)

  // Read persisted preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dex-theme')
      if (saved === 'light') setIsDark(false)
    } catch {}
  }, [])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    document.body.style.backgroundColor = isDark ? '#080808' : '#F5F4F2'
    try { localStorage.setItem('dex-theme', isDark ? 'dark' : 'light') } catch {}
  }, [isDark])

  // Shorthand: c(darkValue, lightValue) → returns the right one
  const c = (dark, light) => isDark ? dark : light

  return (
    <ThemeCtx.Provider value={{ isDark, toggle: () => setIsDark(v => !v), c }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
