/**
 * Task Card Component
 * 
 * Individual task card with priority, status, and actions
 */

import { memo } from 'react'
import {
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Trash2,
    Edit,
    ChevronRight,
    AlertCircle,
} from 'lucide-react'
import { Button, Badge, Card } from '@/components/ui'
import { formatDueDate } from '@/shared/utils/date'
import type { Task, TaskWithChildren } from '../types/task.types'

interface TaskCardProps {
    task: Task | TaskWithChildren
    onEdit?: (task: Task) => void
    onDelete?: (taskId: string) => void
    onStatusChange?: (taskId: string, status: Task['status']) => void
    onSelect?: (task: Task) => void
    showSubtasks?: boolean
    depth?: number
}


/**
 * Get priority badge styling
 */
function getPriorityStyle(priority: Task['priority']) {
    switch (priority) {
        case 'high':
            return 'bg-red-500/15 text-red-500 border-red-500/30'
        case 'medium':
            return 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30'
        case 'low':
            return 'bg-blue-500/15 text-blue-500 border-blue-500/30'
    }
}

/**
 * Get status icon
 */
function StatusIcon({ status }: { status: Task['status'] }) {
    switch (status) {
        case 'done':
            return <CheckCircle2 className="h-4 w-4 text-green-500" />
        case 'in_progress':
            return <Clock className="h-4 w-4 text-yellow-500" />
        default:
            return <Circle className="h-4 w-4 text-muted-foreground" />
    }
}

function TaskCardComponent({
    task,
    onEdit,
    onDelete,
    onStatusChange,
    onSelect,
    showSubtasks = true,
    depth = 0,
}: TaskCardProps) {
    const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null
    const hasChildren = 'children' in task && task.children.length > 0
    const completedChildren = hasChildren
        ? (task as TaskWithChildren).children.filter(c => c.status === 'done').length
        : 0
    const totalChildren = hasChildren ? (task as TaskWithChildren).children.length : 0

    // Calculate progress percentage
    const progress = totalChildren > 0 ? Math.round((completedChildren / totalChildren) * 100) : 0

    return (
        <div style={{ marginLeft: depth * 24 }}>
            <Card
                className={`
                    p-3 cursor-pointer transition-all duration-200
                    hover:shadow-md hover:border-primary/40
                    ${task.status === 'done' ? 'opacity-60' : ''}
                `}
                onClick={() => onSelect?.(task)}
            >
                <div className="flex items-start gap-3">
                    {/* Status toggle */}
                    <button
                        className="mt-0.5 hover:scale-110 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation()
                            const nextStatus = task.status === 'done' ? 'todo'
                                : task.status === 'todo' ? 'in_progress' : 'done'
                            onStatusChange?.(task.id, nextStatus)
                        }}
                    >
                        <StatusIcon status={task.status} />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className={`
                                text-sm font-medium truncate
                                ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}
                            `}>
                                {task.title}
                            </h4>
                            {hasChildren && (
                                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                        </div>

                        {/* Description preview */}
                        {task.description && (
                            <p className="text-xs text-muted-foreground truncate mb-2">
                                {task.description}
                            </p>
                        )}

                        {/* Meta row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Priority badge */}
                            <Badge
                                variant="outline"
                                className={`text-[10px] h-5 capitalize ${getPriorityStyle(task.priority)}`}
                            >
                                {task.priority}
                            </Badge>

                            {/* Due date */}
                            {dueInfo && (
                                <div className={`
                                    flex items-center gap-1 text-xs
                                    ${dueInfo.isOverdue ? 'text-red-500' : 'text-muted-foreground'}
                                `}>
                                    {dueInfo.isOverdue ? (
                                        <AlertCircle className="h-3 w-3" />
                                    ) : (
                                        <Calendar className="h-3 w-3" />
                                    )}
                                    <span>{dueInfo.text}</span>
                                </div>
                            )}

                            {/* Subtask progress */}
                            {totalChildren > 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span>{completedChildren}/{totalChildren}</span>
                                </div>
                            )}

                            {/* Tags */}
                            {task.tags?.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] h-5">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Actions - show on hover */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit?.(task)
                            }}
                        >
                            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete?.(task.id)
                            }}
                        >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Subtasks */}
            {showSubtasks && hasChildren && (
                <div className="mt-2 space-y-2">
                    {(task as TaskWithChildren).children.map(child => (
                        <TaskCardComponent
                            key={child.id}
                            task={child}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                            onSelect={onSelect}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export const TaskCard = memo(TaskCardComponent)
