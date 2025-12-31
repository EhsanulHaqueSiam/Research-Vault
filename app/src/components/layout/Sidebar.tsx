/**
 * App Sidebar
 * 
 * Main navigation sidebar with collapsible sections
 */

import { useState } from 'react'
import {
    Home,
    FolderOpen,
    Clock,
    Star,
    Settings,
    ChevronLeft,
    ChevronRight,
    Moon,
    Sun,
    Monitor,
    BookOpen,
    BarChart3,
    HelpCircle,
    Archive,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button, Badge } from '@/components/ui'

export type SidebarView =
    | 'home'
    | 'projects'
    | 'recent'
    | 'favorites'
    | 'archived'
    | 'analytics'
    | 'help'
    | 'settings'

export interface SidebarProps {
    currentView: SidebarView
    onViewChange: (view: SidebarView) => void
    projectCount?: number
    recentCount?: number
    favoritesCount?: number
    onThemeChange?: (theme: 'light' | 'dark' | 'system') => void
    currentTheme?: 'light' | 'dark' | 'system'
    className?: string
}

interface NavItem {
    id: SidebarView
    label: string
    icon: typeof Home
    badge?: number
}

export function Sidebar({
    currentView,
    onViewChange,
    projectCount = 0,
    recentCount = 0,
    favoritesCount = 0,
    onThemeChange,
    currentTheme = 'system',
    className,
}: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    const mainNav: NavItem[] = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'projects', label: 'All Projects', icon: FolderOpen, badge: projectCount },
        { id: 'recent', label: 'Recent', icon: Clock, badge: recentCount },
        { id: 'favorites', label: 'Favorites', icon: Star, badge: favoritesCount },
        { id: 'archived', label: 'Archived', icon: Archive },
    ]

    const secondaryNav: NavItem[] = [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'help', label: 'Help & Tutorial', icon: HelpCircle },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    const themeIcons = {
        light: Sun,
        dark: Moon,
        system: Monitor,
    }

    const ThemeIcon = themeIcons[currentTheme]

    const cycleTheme = () => {
        const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
        const currentIndex = themes.indexOf(currentTheme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        onThemeChange?.(nextTheme)
    }

    return (
        <aside
            className={cn(
                'h-screen flex flex-col bg-card border-r transition-all duration-200',
                isCollapsed ? 'w-16' : 'w-56',
                className
            )}
        >
            {/* Header */}
            <div className="h-14 flex items-center justify-between px-4 border-b">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-sm">Research Vault</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {mainNav.map(item => {
                    const Icon = item.icon
                    const isActive = currentView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                isCollapsed && 'justify-center px-0'
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge !== undefined && item.badge > 0 && (
                                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                                            {item.badge}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </button>
                    )
                })}

                {/* Divider */}
                <div className="h-px bg-border my-3" />

                {secondaryNav.map(item => {
                    const Icon = item.icon
                    const isActive = currentView === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                isCollapsed && 'justify-center px-0'
                            )}
                            title={isCollapsed ? item.label : undefined}
                        >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && (
                                <span className="flex-1 text-left">{item.label}</span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer - Theme Toggle */}
            <div className="p-2 border-t">
                <button
                    onClick={cycleTheme}
                    className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                        'text-muted-foreground hover:bg-muted hover:text-foreground',
                        isCollapsed && 'justify-center px-0'
                    )}
                    title={isCollapsed ? `Theme: ${currentTheme}` : undefined}
                >
                    <ThemeIcon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && (
                        <span className="flex-1 text-left capitalize">{currentTheme} mode</span>
                    )}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
