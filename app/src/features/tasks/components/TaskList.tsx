/**
 * Task List Component
 * 
 * List view of tasks with filtering and sorting
 */

import { useState, useMemo } from 'react'
import { Plus, Search, Filter, SortAsc, List, LayoutGrid } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import type { Task, TaskWithChildren, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../types/task.types'

interface TaskListProps {
    /** Project ID */
    projectId: string
    /** Tasks to display */
    tasks: TaskWithChildren[]
    /** Create new task */
    onCreateTask: (data: CreateTaskDto) => void
    /** Update existing task */
    onUpdateTask: (taskId: string, data: UpdateTaskDto) => void
    /** Delete task */
    onDeleteTask: (taskId: string) => void
    /** Whether mutations are loading */
    isLoading?: boolean
}

type SortOption = 'priority' | 'dueDate' | 'status' | 'title'
type ViewMode = 'list' | 'grouped'

export function TaskList({
    projectId,
    tasks,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    isLoading = false,
}: TaskListProps) {
    // UI State
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('priority')
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
    const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    // Filter and sort tasks
    const filteredTasks = useMemo(() => {
        let result = [...tasks]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(t =>
                t.title.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query)
            )
        }

        // Status filter
        if (filterStatus !== 'all') {
            result = result.filter(t => t.status === filterStatus)
        }

        // Priority filter
        if (filterPriority !== 'all') {
            result = result.filter(t => t.priority === filterPriority)
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'priority': {
                    const order = { high: 0, medium: 1, low: 2 }
                    return order[a.priority] - order[b.priority]
                }
                case 'dueDate': {
                    if (!a.dueDate && !b.dueDate) return 0
                    if (!a.dueDate) return 1
                    if (!b.dueDate) return -1
                    return a.dueDate.getTime() - b.dueDate.getTime()
                }
                case 'status': {
                    const order = { todo: 0, in_progress: 1, done: 2 }
                    return order[a.status] - order[b.status]
                }
                case 'title':
                    return a.title.localeCompare(b.title)
                default:
                    return 0
            }
        })

        return result
    }, [tasks, searchQuery, filterStatus, filterPriority, sortBy])

    // Group by status for grouped view
    const groupedTasks = useMemo(() => {
        if (viewMode !== 'grouped') return null

        return {
            todo: filteredTasks.filter(t => t.status === 'todo'),
            in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
            done: filteredTasks.filter(t => t.status === 'done'),
        }
    }, [filteredTasks, viewMode])

    const handleEdit = (task: Task) => {
        setEditingTask(task)
        setIsFormOpen(true)
    }

    const handleFormSubmit = (data: CreateTaskDto | UpdateTaskDto) => {
        if (editingTask) {
            onUpdateTask(editingTask.id, data as UpdateTaskDto)
        } else {
            onCreateTask(data as CreateTaskDto)
        }
        setIsFormOpen(false)
        setEditingTask(null)
    }

    const handleStatusChange = (taskId: string, status: TaskStatus) => {
        onUpdateTask(taskId, { status })
    }

    // Stats
    const stats = useMemo(() => ({
        total: tasks.length,
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        done: tasks.filter(t => t.status === 'done').length,
    }), [tasks])

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Tasks</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-0.5 bg-muted rounded">{stats.todo} todo</span>
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">{stats.inProgress} in progress</span>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 rounded">{stats.done} done</span>
                    </div>
                </div>
                <Button onClick={() => { setEditingTask(null); setIsFormOpen(true) }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 border-b bg-muted/30">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        className="pl-9 h-8"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="h-8 px-2 text-sm border rounded-md bg-background"
                    >
                        <option value="all">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as any)}
                        className="h-8 px-2 text-sm border rounded-md bg-background"
                    >
                        <option value="all">All Priority</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="h-8 px-2 text-sm border rounded-md bg-background"
                    >
                        <option value="priority">Priority</option>
                        <option value="dueDate">Due Date</option>
                        <option value="status">Status</option>
                        <option value="title">Title</option>
                    </select>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center gap-1 bg-muted rounded-md p-0.5 ml-auto">
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'grouped' ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode('grouped')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
                {filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <p className="text-lg mb-2">No tasks found</p>
                        <p className="text-sm">Create a new task to get started</p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="space-y-2">
                        {filteredTasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEdit}
                                onDelete={onDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        <TaskGroup
                            title="To Do"
                            tasks={groupedTasks?.todo || []}
                            onEdit={handleEdit}
                            onDelete={onDeleteTask}
                            onStatusChange={handleStatusChange}
                        />
                        <TaskGroup
                            title="In Progress"
                            tasks={groupedTasks?.in_progress || []}
                            onEdit={handleEdit}
                            onDelete={onDeleteTask}
                            onStatusChange={handleStatusChange}
                            accent="yellow"
                        />
                        <TaskGroup
                            title="Done"
                            tasks={groupedTasks?.done || []}
                            onEdit={handleEdit}
                            onDelete={onDeleteTask}
                            onStatusChange={handleStatusChange}
                            accent="green"
                        />
                    </div>
                )}
            </div>

            {/* Task Form Dialog */}
            <TaskForm
                task={editingTask}
                projectId={projectId}
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingTask(null) }}
                onSubmit={handleFormSubmit}
                isSubmitting={isLoading}
            />
        </div>
    )
}

/**
 * Task group column for grouped view
 */
function TaskGroup({
    title,
    tasks,
    onEdit,
    onDelete,
    onStatusChange,
    accent,
}: {
    title: string
    tasks: TaskWithChildren[]
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onStatusChange: (taskId: string, status: TaskStatus) => void
    accent?: 'yellow' | 'green'
}) {
    const accentClass = accent === 'yellow' ? 'border-yellow-500/30'
        : accent === 'green' ? 'border-green-500/30' : 'border-border'

    return (
        <div className={`rounded-lg border-2 ${accentClass} bg-muted/20 p-3`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">{title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {tasks.length}
                </span>
            </div>
            <div className="space-y-2">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                        showSubtasks={false}
                    />
                ))}
            </div>
        </div>
    )
}
