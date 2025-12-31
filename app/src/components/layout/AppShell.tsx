/**
 * AppShell Component
 * 
 * Main layout wrapper with sidebar, header, and content area
 */

import { useState, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'
import { cn } from '@/shared/utils/cn'

interface AppShellProps {
    children: ReactNode
    sidebar?: ReactNode
    showSidebar?: boolean
}

export function AppShell({
    children,
    sidebar,
    showSidebar = true,
}: AppShellProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            {showSidebar && (
                <aside
                    className={cn(
                        'border-r bg-card transition-all duration-300',
                        sidebarCollapsed ? 'w-16' : 'w-64'
                    )}
                >
                    {sidebar || (
                        <Sidebar
                            collapsed={sidebarCollapsed}
                            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                        />
                    )}
                </aside>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Content area */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>

                {/* Status bar */}
                <StatusBar />
            </div>
        </div>
    )
}

export default AppShell
