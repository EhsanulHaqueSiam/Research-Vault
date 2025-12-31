/**
 * Recent Projects Component
 * 
 * Shows recently accessed projects for quick access
 */

import { Clock, FolderOpen, ArrowRight } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { formatRelativeTime } from '@/shared/utils/date'
import type { Project } from '@/features/projects'

export interface RecentProjectsProps {
    projects: Project[]
    onProjectClick?: (project: Project) => void
    onViewAll?: () => void
    maxItems?: number
    className?: string
}

export function RecentProjects({
    projects,
    onProjectClick,
    onViewAll,
    maxItems = 5,
    className,
}: RecentProjectsProps) {
    const recentItems = projects
        .sort((a, b) => new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime())
        .slice(0, maxItems)

    if (recentItems.length === 0) {
        return null
    }

    return (
        <div className={cn('space-y-3', className)}>
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Recently Opened
                </h3>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                        View all <ArrowRight className="h-3 w-3" />
                    </button>
                )}
            </div>

            <div className="space-y-1">
                {recentItems.map((project, index) => (
                    <button
                        key={project.id}
                        onClick={() => onProjectClick?.(project)}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left',
                            'hover:bg-muted/80 transition-all duration-150',
                            'group'
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div
                            className="p-1.5 rounded-md shrink-0 transition-transform group-hover:scale-110"
                            style={{
                                backgroundColor: project.color ? `${project.color}20` : 'hsl(var(--primary) / 0.1)',
                                color: project.color || 'hsl(var(--primary))'
                            }}
                        >
                            <FolderOpen className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {formatRelativeTime(new Date(project.lastModifiedAt))}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default RecentProjects
