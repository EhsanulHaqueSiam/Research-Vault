/**
 * Kanban Board Component
 * 
 * Accessible drag-and-drop kanban board using @dnd-kit
 * Per PROJECT_PLAN.md: Uses @dnd-kit/core for accessible drag and drop
 */

import { useState, useMemo } from 'react'
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import type { Task, TaskWithChildren, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types/task.types'

interface KanbanBoardProps {
    projectId: string
    tasks: TaskWithChildren[]
    onCreateTask: (data: CreateTaskDto) => void
    onUpdateTask: (taskId: string, data: UpdateTaskDto) => void
    onDeleteTask: (taskId: string) => void
    isLoading?: boolean
}

interface KanbanColumn {
    id: TaskStatus
    title: string
    color: string
}

const COLUMNS: KanbanColumn[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-400' },
    { id: 'in_progress', title: 'In Progress', color: 'border-yellow-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
]

/**
 * Sortable task card wrapper
 */
function SortableTaskCard({
    task,
    onEdit,
    onDelete,
    onStatusChange,
}: {
    task: TaskWithChildren
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onStatusChange: (taskId: string, status: TaskStatus) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
        >
            <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                showSubtasks={false}
            />
        </div>
    )
}

/**
 * Droppable column wrapper
 */
function DroppableColumn({
    column,
    tasks,
    onAddTask,
    onEdit,
    onDelete,
    onStatusChange,
}: {
    column: KanbanColumn
    tasks: TaskWithChildren[]
    onAddTask: () => void
    onEdit: (task: Task) => void
    onDelete: (taskId: string) => void
    onStatusChange: (taskId: string, status: TaskStatus) => void
}) {
    // Register this column as a droppable target
    const { isOver, setNodeRef } = useDroppable({
        id: column.id,
    })

    return (
        <div
            ref={setNodeRef}
            className={`
                flex-1 min-w-[280px] max-w-[350px] rounded-lg
                border-t-4 ${column.color} bg-muted/30
                transition-colors duration-200
                ${isOver ? 'bg-primary/10 ring-2 ring-primary/30' : ''}
            `}
        >
            {/* Column header */}
            <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                    <h3 className="font-medium">{column.title}</h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onAddTask}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Column content */}
            <div className="p-3 space-y-2 min-h-[200px]">
                <SortableContext
                    items={tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                            Drop tasks here
                        </div>
                    ) : (
                        tasks.map(task => (
                            <SortableTaskCard
                                key={task.id}
                                task={task}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                            />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    )
}

export function KanbanBoard({
    projectId,
    tasks,
    onCreateTask,
    onUpdateTask,
    onDeleteTask,
    isLoading = false,
}: KanbanBoardProps) {
    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)
    const [newTaskColumn, setNewTaskColumn] = useState<TaskStatus>('todo')

    // Drag state
    const [activeTask, setActiveTask] = useState<TaskWithChildren | null>(null)

    // Configure sensors for mouse/touch and keyboard
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor)
    )

    // Group tasks by status
    const tasksByStatus = useMemo(() => {
        const grouped: Record<TaskStatus, TaskWithChildren[]> = {
            todo: [],
            in_progress: [],
            done: [],
        }

        tasks.forEach(task => {
            grouped[task.status].push(task)
        })

        // Sort by order within each column
        Object.values(grouped).forEach(arr => {
            arr.sort((a, b) => a.order - b.order)
        })

        return grouped
    }, [tasks])

    const handleEdit = (task: Task) => {
        setEditingTask(task)
        setIsFormOpen(true)
    }

    const handleFormSubmit = (data: CreateTaskDto | UpdateTaskDto) => {
        if (editingTask) {
            onUpdateTask(editingTask.id, data as UpdateTaskDto)
        } else {
            onCreateTask({ ...data as CreateTaskDto, status: newTaskColumn })
        }
        setIsFormOpen(false)
        setEditingTask(null)
    }

    const handleStatusChange = (taskId: string, status: TaskStatus) => {
        onUpdateTask(taskId, { status })
    }

    const handleAddToColumn = (column: TaskStatus) => {
        setNewTaskColumn(column)
        setEditingTask(null)
        setIsFormOpen(true)
    }

    // @dnd-kit handlers
    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id)
        setActiveTask(task || null)
    }

    const handleDragOver = (_event: DragOverEvent) => {
        // useDroppable handles visual feedback now
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        setActiveTask(null)

        if (!over) return

        const activeId = active.id as string
        const overId = over.id as string
        const activeTask = tasks.find(t => t.id === activeId)

        if (!activeTask) return

        // Determine target column
        let targetColumn: TaskStatus | null = null

        if (['todo', 'in_progress', 'done'].includes(overId)) {
            targetColumn = overId as TaskStatus
        } else {
            const overTask = tasks.find(t => t.id === overId)
            if (overTask) {
                targetColumn = overTask.status
            }
        }

        // Update status if moved to different column
        if (targetColumn && activeTask.status !== targetColumn) {
            onUpdateTask(activeId, { status: targetColumn })
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">Kanban Board</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{tasks.length} tasks</span>
                </div>
            </div>

            {/* Board */}
            <div className="flex-1 overflow-x-auto p-4">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 min-h-full">
                        {COLUMNS.map(column => (
                            <DroppableColumn
                                key={column.id}
                                column={column}
                                tasks={tasksByStatus[column.id]}
                                onAddTask={() => handleAddToColumn(column.id)}
                                onEdit={handleEdit}
                                onDelete={onDeleteTask}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>

                    {/* Drag overlay for visual feedback */}
                    <DragOverlay>
                        {activeTask ? (
                            <div className="opacity-90 shadow-lg">
                                <TaskCard
                                    task={activeTask}
                                    showSubtasks={false}
                                />
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
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
