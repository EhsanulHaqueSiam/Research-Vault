/**
 * Theme Selector Component
 * 
 * Dropdown/button group for selecting light/dark/system theme
 */

import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme, type Theme } from '@/shared/hooks/useTheme'
import { cn } from '@/shared/utils/cn'

interface ThemeSelectorProps {
    variant?: 'dropdown' | 'buttons' | 'toggle'
    className?: string
}

/**
 * Theme option button
 */
function ThemeButton({
    theme,
    currentTheme,
    onClick,
    children,
    icon: Icon,
}: {
    theme: Theme
    currentTheme: Theme
    onClick: () => void
    children: React.ReactNode
    icon: React.ComponentType<{ className?: string }>
}) {
    const isActive = currentTheme === theme

    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
                isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={isActive}
        >
            <Icon className="h-4 w-4" />
            <span>{children}</span>
        </button>
    )
}

/**
 * Theme Selector - allows users to switch between light, dark, and system themes
 */
export function ThemeSelector({ variant = 'buttons', className }: ThemeSelectorProps) {
    const { theme, setTheme, toggleTheme, isDark } = useTheme()

    if (variant === 'toggle') {
        return (
            <button
                onClick={toggleTheme}
                className={cn(
                    'p-2 rounded-lg transition-colors',
                    'hover:bg-muted text-muted-foreground hover:text-foreground',
                    className
                )}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
        )
    }

    return (
        <div className={cn('flex gap-1 p-1 bg-muted rounded-xl', className)}>
            <ThemeButton
                theme="light"
                currentTheme={theme}
                onClick={() => setTheme('light')}
                icon={Sun}
            >
                Light
            </ThemeButton>
            <ThemeButton
                theme="dark"
                currentTheme={theme}
                onClick={() => setTheme('dark')}
                icon={Moon}
            >
                Dark
            </ThemeButton>
            <ThemeButton
                theme="system"
                currentTheme={theme}
                onClick={() => setTheme('system')}
                icon={Monitor}
            >
                System
            </ThemeButton>
        </div>
    )
}

export default ThemeSelector
