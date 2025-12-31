/**
 * Quick Actions Bar Component
 * 
 * Floating action bar for common operations
 */

import { FileText, FolderOpen, Play, Clock } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui'

export interface QuickAction {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant?: 'default' | 'primary'
}

export interface QuickActionsBarProps {
    actions?: QuickAction[]
    className?: string
    onNewProject?: () => void
    onQuickNote?: () => void
    onResumeLast?: () => void
}

const defaultActions: QuickAction[] = [
    { id: 'new-project', label: 'New Project', icon: FolderOpen, onClick: () => { }, variant: 'primary' },
    { id: 'quick-note', label: 'Quick Note', icon: FileText, onClick: () => { } },
    { id: 'resume', label: 'Resume Last', icon: Play, onClick: () => { } },
]

export function QuickActionsBar({
    actions,
    className,
    onNewProject,
    onQuickNote,
    onResumeLast,
}: QuickActionsBarProps) {
    const actionList = actions || [
        { ...defaultActions[0], onClick: onNewProject || (() => { }) },
        { ...defaultActions[1], onClick: onQuickNote || (() => { }) },
        { ...defaultActions[2], onClick: onResumeLast || (() => { }) },
    ]

    return (
        <div className={cn(
            'flex items-center gap-2 p-3 bg-muted/50 rounded-xl border',
            'backdrop-blur-sm',
            className
        )}>
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground mr-2">Quick Actions:</span>

            {actionList.map((action) => {
                const Icon = action.icon
                return (
                    <Button
                        key={action.id}
                        variant={action.variant === 'primary' ? 'default' : 'outline'}
                        size="sm"
                        onClick={action.onClick}
                        className="gap-1.5 h-8"
                    >
                        <Icon className="h-3.5 w-3.5" />
                        {action.label}
                    </Button>
                )
            })}
        </div>
    )
}

export default QuickActionsBar
