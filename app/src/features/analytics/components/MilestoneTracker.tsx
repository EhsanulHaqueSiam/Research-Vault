/**
 * Milestone Tracker Component
 * 
 * Track project milestones and deadlines
 */

import { useMemo } from 'react'
import { Flag, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// ============================================
// Types
// ============================================

export interface Milestone {
    id: string
    title: string
    description?: string
    dueDate: Date
    completedAt?: Date
    status: 'pending' | 'in-progress' | 'completed' | 'overdue'
}

export interface MilestoneTrackerProps {
    milestones: Milestone[]
    onMilestoneClick?: (milestone: Milestone) => void
}

// ============================================
// Helpers
// ============================================

function getStatusColor(status: Milestone['status']) {
    switch (status) {
        case 'completed':
            return 'bg-green-500'
        case 'overdue':
            return 'bg-red-500'
        case 'in-progress':
            return 'bg-yellow-500'
        default:
            return 'bg-slate-300 dark:bg-slate-600'
    }
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ============================================
// Component
// ============================================

export function MilestoneTracker({ milestones, onMilestoneClick }: MilestoneTrackerProps) {
    const sortedMilestones = useMemo(() => {
        return [...milestones].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    }, [milestones])

    const completedCount = milestones.filter((m) => m.status === 'completed').length
    const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Flag size={18} className="text-blue-500" />
                    Milestones
                </h3>
                <span className="text-sm text-slate-500">
                    {completedCount}/{milestones.length} completed
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
                <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Timeline */}
            <div className="space-y-0">
                {sortedMilestones.map((milestone, index) => (
                    <div
                        key={milestone.id}
                        className={cn(
                            'relative pl-6 pb-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 -ml-2 px-2 rounded-lg',
                            index === sortedMilestones.length - 1 && 'pb-0'
                        )}
                        onClick={() => onMilestoneClick?.(milestone)}
                    >
                        {/* Timeline line */}
                        {index < sortedMilestones.length - 1 && (
                            <div className="absolute left-[9px] top-5 w-0.5 h-full bg-slate-200 dark:bg-slate-700" />
                        )}

                        {/* Status dot */}
                        <div className={cn(
                            'absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center',
                            getStatusColor(milestone.status)
                        )}>
                            {milestone.status === 'completed' && (
                                <Check size={12} className="text-white" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className={cn(
                                    'font-medium',
                                    milestone.status === 'completed' && 'line-through text-slate-400'
                                )}>
                                    {milestone.title}
                                </p>
                                {milestone.description && (
                                    <p className="text-sm text-slate-500 mt-0.5">{milestone.description}</p>
                                )}
                            </div>
                            <span className={cn(
                                'text-xs px-2 py-0.5 rounded whitespace-nowrap',
                                milestone.status === 'overdue'
                                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            )}>
                                {formatDate(milestone.dueDate)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {milestones.length === 0 && (
                <div className="py-8 text-center text-sm text-slate-400">
                    No milestones yet
                </div>
            )}
        </div>
    )
}

export default MilestoneTracker
