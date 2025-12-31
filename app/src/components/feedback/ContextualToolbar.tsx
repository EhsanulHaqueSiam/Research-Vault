/**
 * Contextual Toolbar Component
 * 
 * Floating action bar when items are selected
 */

import { X, Archive, Trash2, FolderInput, Tag } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/components/ui'

export interface ContextualToolbarAction {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    onClick: () => void
    variant?: 'default' | 'destructive'
}

export interface ContextualToolbarProps {
    selectedCount: number
    onClear: () => void
    actions?: ContextualToolbarAction[]
    className?: string
}

const defaultActions: ContextualToolbarAction[] = [
    { id: 'archive', label: 'Archive', icon: Archive, onClick: () => { } },
    { id: 'move', label: 'Move to...', icon: FolderInput, onClick: () => { } },
    { id: 'tag', label: 'Add Tag', icon: Tag, onClick: () => { } },
    { id: 'delete', label: 'Delete', icon: Trash2, onClick: () => { }, variant: 'destructive' },
]

export function ContextualToolbar({
    selectedCount,
    onClear,
    actions = defaultActions,
    className,
}: ContextualToolbarProps) {
    if (selectedCount === 0) return null

    return (
        <div className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
            'flex items-center gap-2 px-4 py-2.5 rounded-xl',
            'bg-card/95 backdrop-blur-lg border shadow-xl',
            'animate-in slide-in-from-bottom-4 duration-200',
            className
        )}>
            {/* Selection count */}
            <div className="flex items-center gap-2 pr-3 border-r">
                <span className="font-semibold text-primary">{selectedCount}</span>
                <span className="text-sm text-muted-foreground">selected</span>
                <button
                    onClick={onClear}
                    className="p-1 hover:bg-muted rounded transition-colors ml-1"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
                {actions.map((action) => {
                    const Icon = action.icon
                    return (
                        <Button
                            key={action.id}
                            variant={action.variant === 'destructive' ? 'destructive' : 'ghost'}
                            size="sm"
                            onClick={action.onClick}
                            className="gap-1.5 h-8"
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{action.label}</span>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}

export default ContextualToolbar
