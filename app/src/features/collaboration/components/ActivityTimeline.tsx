/**
 * Activity Timeline Component
 * 
 * Display project activity in a chronological timeline
 */

import { useMemo } from 'react'
import {
    CheckSquare,
    FileText,
    MessageCircle,
    Archive,
    Plus,
    Edit,
    Download,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { Activity, ActivityType } from '../types'

// ============================================
// Props
// ============================================

export interface ActivityTimelineProps {
    activities: Activity[]
    onActivityClick?: (activity: Activity) => void
    maxItems?: number
}

// ============================================
// Activity Icons
// ============================================

const activityIcons: Record<ActivityType, React.ReactNode> = {
    project_created: <Plus size={14} className="text-blue-500" />,
    project_updated: <Edit size={14} className="text-blue-500" />,
    project_archived: <Archive size={14} className="text-slate-500" />,
    task_created: <Plus size={14} className="text-green-500" />,
    task_completed: <CheckSquare size={14} className="text-green-500" />,
    task_updated: <Edit size={14} className="text-green-500" />,
    note_created: <Plus size={14} className="text-purple-500" />,
    note_updated: <Edit size={14} className="text-purple-500" />,
    comment_added: <MessageCircle size={14} className="text-yellow-500" />,
    backup_created: <Download size={14} className="text-orange-500" />,
    file_added: <FileText size={14} className="text-slate-500" />,
}

const activityColors: Record<ActivityType, string> = {
    project_created: 'bg-blue-100 dark:bg-blue-900/30',
    project_updated: 'bg-blue-100 dark:bg-blue-900/30',
    project_archived: 'bg-slate-100 dark:bg-slate-800',
    task_created: 'bg-green-100 dark:bg-green-900/30',
    task_completed: 'bg-green-100 dark:bg-green-900/30',
    task_updated: 'bg-green-100 dark:bg-green-900/30',
    note_created: 'bg-purple-100 dark:bg-purple-900/30',
    note_updated: 'bg-purple-100 dark:bg-purple-900/30',
    comment_added: 'bg-yellow-100 dark:bg-yellow-900/30',
    backup_created: 'bg-orange-100 dark:bg-orange-900/30',
    file_added: 'bg-slate-100 dark:bg-slate-800',
}

// ============================================
// Component
// ============================================

export function ActivityTimeline({
    activities,
    onActivityClick,
    maxItems = 50,
}: ActivityTimelineProps) {
    const sortedActivities = useMemo(() => {
        return [...activities]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, maxItems)
    }, [activities, maxItems])

    // Group by date
    const groupedByDate = useMemo(() => {
        const groups: { date: string; activities: Activity[] }[] = []

        sortedActivities.forEach(activity => {
            const dateStr = new Date(activity.createdAt).toLocaleDateString('en', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
            })

            const existing = groups.find(g => g.date === dateStr)
            if (existing) {
                existing.activities.push(activity)
            } else {
                groups.push({ date: dateStr, activities: [activity] })
            }
        })

        return groups
    }, [sortedActivities])

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (activities.length === 0) {
        return (
            <div className="py-8 text-center text-sm text-slate-400">
                No activity yet
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {groupedByDate.map(group => (
                <div key={group.date}>
                    {/* Date Header */}
                    <h4 className="text-xs font-medium text-slate-500 uppercase mb-3">
                        {group.date}
                    </h4>

                    {/* Activities for this date */}
                    <div className="space-y-0.5">
                        {group.activities.map((activity, index) => (
                            <div
                                key={activity.id}
                                className={cn(
                                    'flex items-start gap-3 p-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50',
                                    index < group.activities.length - 1 && 'border-l-2 border-slate-200 dark:border-slate-700 ml-3'
                                )}
                                onClick={() => onActivityClick?.(activity)}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                                    activityColors[activity.type]
                                )}>
                                    {activityIcons[activity.type]}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">
                                        <span className="font-medium">{activity.actorName}</span>
                                        {' '}
                                        <span className="text-slate-600 dark:text-slate-400">{activity.title}</span>
                                    </p>
                                    {activity.description && (
                                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                                            {activity.description}
                                        </p>
                                    )}
                                </div>

                                {/* Time */}
                                <span className="text-xs text-slate-400 flex-shrink-0">
                                    {formatTime(activity.createdAt)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ActivityTimeline
