/**
 * Task Form Component
 * 
 * Form for creating and editing tasks
 */

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import {
    Button,
    Input,
    Textarea,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui'
import { formatDateForInput } from '@/shared/utils/date'
import type { Task, CreateTaskDto, UpdateTaskDto, TaskPriority, TaskStatus } from '../types/task.types'

interface TaskFormProps {
    /** Task to edit (null for create mode) */
    task?: Task | null
    /** Project ID for new tasks */
    projectId: string
    /** Parent task ID for subtasks */
    parentId?: string
    /** Whether the form is open */
    isOpen: boolean
    /** Close the form */
    onClose: () => void
    /** Submit handler */
    onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void
    /** Whether submission is in progress */
    isSubmitting?: boolean
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-blue-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' },
]

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
]

export function TaskForm({
    task,
    projectId,
    parentId,
    isOpen,
    onClose,
    onSubmit,
    isSubmitting = false,
}: TaskFormProps) {
    const isEditing = !!task

    // Form state
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState<TaskPriority>('medium')
    const [status, setStatus] = useState<TaskStatus>('todo')
    const [dueDate, setDueDate] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    // Initialize form with task data
    useEffect(() => {
        if (task) {
            setTitle(task.title)
            setDescription(task.description || '')
            setPriority(task.priority)
            setStatus(task.status)
            setDueDate(task.dueDate ? formatDateForInput(task.dueDate) : '')
            setTags(task.tags || [])
        } else {
            // Reset form for new task
            setTitle('')
            setDescription('')
            setPriority('medium')
            setStatus('todo')
            setDueDate('')
            setTags([])
        }
    }, [task, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (isEditing) {
            const data: UpdateTaskDto = {
                title,
                description: description || null,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : null,
                tags: tags.length > 0 ? tags : null,
            }
            onSubmit(data)
        } else {
            const data: CreateTaskDto = {
                projectId,
                parentId,
                title,
                description: description || undefined,
                priority,
                status,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                tags: tags.length > 0 ? tags : undefined,
                order: 0,
            }
            onSubmit(data)
        }
    }

    const addTag = () => {
        const trimmed = tagInput.trim()
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed])
            setTagInput('')
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Edit Task' : 'New Task'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Description</label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={3}
                        />
                    </div>

                    {/* Priority & Status row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Priority</label>
                            <div className="flex gap-1">
                                {PRIORITY_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        className={`
                                            flex-1 py-1.5 text-xs rounded-md transition-all
                                            ${priority === opt.value
                                                ? `${opt.color} text-white`
                                                : 'bg-muted hover:bg-muted/80'
                                            }
                                        `}
                                        onClick={() => setPriority(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="w-full h-9 px-3 rounded-md border bg-background text-sm"
                            >
                                {STATUS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Due Date</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-sm font-medium mb-1 block">Tags</label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                            {tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs"
                                >
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)}>
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Add tag..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        addTag()
                                    }
                                }}
                            />
                            <Button type="button" variant="outline" onClick={addTag}>
                                Add
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!title.trim() || isSubmitting}>
                            {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
