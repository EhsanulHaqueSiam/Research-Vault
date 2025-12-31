/**
 * Activity Timeline Component
 * 
 * Shows recent activity across all projects
 */

import { useMemo } from 'react'
import {
    FileText,
    CheckSquare,
    FolderOpen,
    GitCommit,
    Clock,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { formatRelativeTime } from '@/shared/utils/date'

export type ActivityType = 'project' | 'task' | 'note' | 'commit'

export interface ActivityItem {
    id: string
    type: ActivityType
    title: string
    description?: string
    timestamp: Date
    projectName?: string
}

export interface ActivityTimelineProps {
    activities: ActivityItem[]
    maxItems?: number
    className?: string
}

const activityIcons: Record<ActivityType, typeof FolderOpen> = {
    project: FolderOpen,
    task: CheckSquare,
    note: FileText,
    commit: GitCommit,
}

const activityColors: Record<ActivityType, string> = {
    project: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    task: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    note: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    commit: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
}

export function ActivityTimeline({
    activities,
    maxItems = 10,
    className,
}: ActivityTimelineProps) {
    const sortedActivities = useMemo(() => {
        return [...activities]
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, maxItems)
    }, [activities, maxItems])

    if (sortedActivities.length === 0) {
        return (
            <div className={cn('text-center py-8 text-muted-foreground', className)}>
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
            </div>
        )
    }

    return (
        <div className={cn('space-y-1', className)}>
            {sortedActivities.map((activity, index) => {
                const Icon = activityIcons[activity.type]

                return (
                    <div
                        key={activity.id}
                        className={cn(
                            'flex items-start gap-3 p-3 rounded-lg',
                            'hover:bg-muted/50 transition-colors cursor-pointer',
                            'animate-in fade-in-50 slide-in-from-left-2',
                        )}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Icon */}
                        <div className={cn('p-2 rounded-lg shrink-0', activityColors[activity.type])}>
                            <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.title}</p>
                            {activity.description && (
                                <p className="text-xs text-muted-foreground truncate">
                                    {activity.description}
                                </p>
                            )}
                            <div className="flex items-center gap-2 mt-0.5">
                                {activity.projectName && (
                                    <span className="text-xs text-muted-foreground">
                                        {activity.projectName}
                                    </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {formatRelativeTime(activity.timestamp)}
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default ActivityTimeline
