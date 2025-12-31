/**
 * Sidebar Component
 * 
 * Navigation sidebar with collapsible sections
 */

import { useState } from 'react'
import {
    Home,
    FolderOpen,
    CheckSquare,
    FileText,
    BarChart3,
    Settings,
    PanelLeftClose,
    PanelLeft,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface SidebarProps {
    collapsed?: boolean
    onToggleCollapse?: () => void
    activeItem?: string
    onNavigate?: (item: string) => void
}

interface NavItem {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

export function Sidebar({
    collapsed = false,
    onToggleCollapse,
    activeItem = 'home',
    onNavigate,
}: SidebarProps) {
    // Hover-expand for mini mode
    const [isHovered, setIsHovered] = useState(false)
    const showExpanded = !collapsed || isHovered

    return (
        <div
            className={cn(
                'flex flex-col h-full transition-all duration-300 ease-out',
                collapsed && !isHovered ? 'w-16' : 'w-56'
            )}
            onMouseEnter={() => collapsed && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                {showExpanded && (
                    <h1 className="font-bold text-lg transition-opacity duration-200">
                        Research
                    </h1>
                )}
                <button
                    onClick={onToggleCollapse}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? (
                        <PanelLeft className="h-4 w-4" />
                    ) : (
                        <PanelLeftClose className="h-4 w-4" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeItem === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate?.(item.id)}
                            className={cn(
                                'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                                'text-sm font-medium transition-all duration-200',
                                'hover:scale-[1.02]',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            )}
                            title={!showExpanded ? item.label : undefined}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            {showExpanded && (
                                <span className="transition-opacity duration-200">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-2 border-t">
                <button
                    onClick={() => onNavigate?.('settings')}
                    className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                        'text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    title={!showExpanded ? 'Settings' : undefined}
                >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    {showExpanded && <span>Settings</span>}
                </button>
            </div>
        </div>
    )
}

export default Sidebar
