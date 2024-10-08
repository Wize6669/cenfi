import { useEffect, useState, useCallback } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<string | null>(null)
  const [isSystemDark, setIsSystemDark] = useState(false)

  const checkSystemTheme = useCallback(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  const isDarkHours = useCallback(() => {
    const currentHour = new Date().getHours()
    return currentHour >= 18 || currentHour < 7
  }, [])

  const applyTheme = useCallback((newTheme: string) => {
    if (newTheme === 'system') {
      const systemPrefersDark = checkSystemTheme()
      setIsSystemDark(systemPrefersDark)
      document.documentElement.classList.toggle('dark', systemPrefersDark)
    } else if (newTheme === 'auto') {
      const shouldBeDark = isDarkHours()
      document.documentElement.classList.toggle('dark', shouldBeDark)
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }, [checkSystemTheme, isDarkHours])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'auto') {
      applyTheme('auto')
    } else if (savedTheme === 'system') {
      applyTheme('system')
    } else if (savedTheme) {
      applyTheme(savedTheme)
    } else {
      applyTheme('auto') // Por defecto, usamos el modo automático basado en la hora
    }

    const systemThemeListener = window.matchMedia('(prefers-color-scheme: dark)')
    systemThemeListener.addEventListener('change', (e) => {
      if (theme === 'system') {
        const systemDark = e.matches
        setIsSystemDark(systemDark)
        document.documentElement.classList.toggle('dark', systemDark)
      }
    })

    // Configurar un intervalo para verificar la hora cada minuto
    const intervalId = setInterval(() => {
      if (theme === 'auto') {
        applyTheme('auto')
      }
    }, 60000) // 60000 ms = 1 minuto

    return () => {
      systemThemeListener.removeEventListener('change', () => {})
      clearInterval(intervalId)
    }
  }, [theme, applyTheme])

  const switchTheme = useCallback((newTheme: string) => {
    applyTheme(newTheme)
  }, [applyTheme])

  return { theme, isSystemDark, switchTheme }
}
