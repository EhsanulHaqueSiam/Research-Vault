/**
 * App Layout
 * 
 * Main layout wrapper with sidebar and content area
 */

import { useState } from 'react'
import { Sidebar, SidebarView } from './Sidebar'
import { cn } from '@/shared/utils/cn'

export interface AppLayoutProps {
    children: React.ReactNode
    currentView: SidebarView
    onViewChange: (view: SidebarView) => void
    className?: string
}

export function AppLayout({
    children,
    currentView,
    onViewChange,
    className,
}: AppLayoutProps) {
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')

    // Handle theme change (placeholder for actual theme context)
    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme)
        // In a real implementation we would update the document class/context here
        if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <div className={cn('flex h-screen w-full bg-background overflow-hidden', className)}>
            <Sidebar
                currentView={currentView}
                onViewChange={onViewChange}
                currentTheme={theme}
                onThemeChange={handleThemeChange}
            />
            <main className="flex-1 overflow-hidden h-full relative">
                {children}
            </main>
        </div>
    )
}

export default AppLayout
