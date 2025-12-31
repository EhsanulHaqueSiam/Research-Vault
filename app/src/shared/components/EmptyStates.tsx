/**
 * Empty State Components
 * 
 * Consistent empty state displays for lists and containers
 */

import {
    FolderOpen,
    FileText,
    CheckSquare,
    Inbox,
    Search,
    Plus,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Types
// ============================================

export type EmptyStateType = 'projects' | 'tasks' | 'notes' | 'search' | 'generic'

export interface EmptyStateProps {
    type?: EmptyStateType
    title?: string
    description?: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

// ============================================
// Icons
// ============================================

const emptyStateIcons: Record<EmptyStateType, React.ReactNode> = {
    projects: <FolderOpen size={48} className="text-slate-300 dark:text-slate-600" />,
    tasks: <CheckSquare size={48} className="text-slate-300 dark:text-slate-600" />,
    notes: <FileText size={48} className="text-slate-300 dark:text-slate-600" />,
    search: <Search size={48} className="text-slate-300 dark:text-slate-600" />,
    generic: <Inbox size={48} className="text-slate-300 dark:text-slate-600" />,
}

const defaultTitles: Record<EmptyStateType, string> = {
    projects: 'No projects yet',
    tasks: 'No tasks yet',
    notes: 'No notes yet',
    search: 'No results found',
    generic: 'Nothing here yet',
}

const defaultDescriptions: Record<EmptyStateType, string> = {
    projects: 'Create your first project to get started',
    tasks: 'Create tasks to track your work',
    notes: 'Add notes to capture your thoughts',
    search: 'Try a different search term',
    generic: 'Add some content to see it here',
}

// ============================================
// Component
// ============================================

export function EmptyState({
    type = 'generic',
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-12 px-4 text-center',
            className
        )}>
            {emptyStateIcons[type]}
            <h3 className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">
                {title || defaultTitles[type]}
            </h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm">
                {description || defaultDescriptions[type]}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={16} />
                    {action.label}
                </button>
            )}
        </div>
    )
}

export default EmptyState
