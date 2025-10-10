import * as React from 'react'

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(props.defaultTheme || 'light')

  React.useEffect(() => { 
    const savedTheme = localStorage.getItem('theme') || props.defaultTheme || 'light'
    setTheme(savedTheme)
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [props.defaultTheme])

  const contextValue = React.useMemo(() => ({
    theme,
    setTheme: (newTheme: string) => {
      setTheme(newTheme)
      localStorage.setItem('theme', newTheme)
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }), [theme])

  return (
    <div data-theme={theme} className={theme}>
      {children}
    </div>
  )
}
