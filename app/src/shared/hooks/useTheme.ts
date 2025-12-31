/**
 * useTheme Hook
 * 
 * Manages theme state with localStorage persistence and system preference detection
 */

import { useState, useEffect, useCallback } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface UseThemeReturn {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
    isDark: boolean
}

const STORAGE_KEY = 'theme-preference'

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
}

function getStoredTheme(): Theme {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
            return stored
        }
    }
    return 'system'
}

export function useTheme(): UseThemeReturn {
    const [theme, setThemeState] = useState<Theme>(getStoredTheme)
    const [isDark, setIsDark] = useState<boolean>(false)

    // Resolve actual theme (handling 'system' preference)
    const resolveTheme = useCallback((t: Theme): 'light' | 'dark' => {
        return t === 'system' ? getSystemTheme() : t
    }, [])

    // Apply theme to document
    const applyTheme = useCallback((t: 'light' | 'dark') => {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(t)
        setIsDark(t === 'dark')
    }, [])

    // Set theme and persist
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem(STORAGE_KEY, newTheme)
        applyTheme(resolveTheme(newTheme))
    }, [applyTheme, resolveTheme])

    // Toggle between light and dark
    const toggleTheme = useCallback(() => {
        const current = resolveTheme(theme)
        setTheme(current === 'dark' ? 'light' : 'dark')
    }, [theme, resolveTheme, setTheme])

    // Initialize theme and listen for system changes
    useEffect(() => {
        applyTheme(resolveTheme(theme))

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') {
                applyTheme(getSystemTheme())
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, applyTheme, resolveTheme])

    return { theme, setTheme, toggleTheme, isDark }
}

export default useTheme
