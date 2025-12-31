import { BaseRepository } from './base.repository'
import { v4 as uuidv4 } from 'uuid'
import { invoke } from '@tauri-apps/api/core'
import type { Task, InsertTask } from '../schema'

// Check if running in Tauri
const isTauri = typeof window !== 'undefined' &&
    '__TAURI_INTERNALS__' in window

// In-memory storage for browser development
const inMemoryTasks: Task[] = []

/**
 * Task Repository
 * 
 * Data access layer for tasks with hierarchical support.
 * Uses Tauri IPC when running in Tauri, in-memory storage otherwise.
 */
export class TaskRepository extends BaseRepository<Task> {
    /**
     * Get all tasks
     */
    async findAll(): Promise<Task[]> {
        if (isTauri) {
            try {
                const tasks = await invoke<Task[]>('list_tasks', { projectId: null })
                return tasks.map(this.normalizeTask)
            } catch (error) {
                console.error('Failed to list tasks:', error)
                throw error
            }
        }
        return [...inMemoryTasks]
    }

    /**
     * Find task by ID
     */
    async findById(id: string): Promise<Task | null> {
        if (isTauri) {
            try {
                const task = await invoke<Task>('get_task', { id })
                return this.normalizeTask(task)
            } catch {
                return null
            }
        }
        return inMemoryTasks.find(t => t.id === id) || null
    }

    /**
     * Get all tasks for a project
     */
    async findByProjectId(projectId: string): Promise<Task[]> {
        if (isTauri) {
            try {
                const tasks = await invoke<Task[]>('list_tasks', { projectId })
                return tasks.map(this.normalizeTask)
            } catch (error) {
                console.error('Failed to list project tasks:', error)
                throw error
            }
        }
        return inMemoryTasks.filter(t => t.projectId === projectId)
    }

    /**
     * Get root tasks (no parent) for a project
     */
    async findRootTasks(projectId: string): Promise<Task[]> {
        if (isTauri) {
            try {
                const tasks = await invoke<Task[]>('list_root_tasks', { projectId })
                return tasks.map(this.normalizeTask)
            } catch (error) {
                console.error('Failed to list root tasks:', error)
                throw error
            }
        }
        return inMemoryTasks.filter(t => t.projectId === projectId && !t.parentId)
    }

    /**
     * Get child tasks (subtasks) for a parent task
     */
    async findSubtasks(parentId: string): Promise<Task[]> {
        if (isTauri) {
            try {
                const tasks = await invoke<Task[]>('list_subtasks', { parentId })
                return tasks.map(this.normalizeTask)
            } catch (error) {
                console.error('Failed to list subtasks:', error)
                throw error
            }
        }
        return inMemoryTasks.filter(t => t.parentId === parentId)
    }

    /**
     * Get tasks by status
     */
    async findByStatus(
        projectId: string,
        status: 'todo' | 'in_progress' | 'done'
    ): Promise<Task[]> {
        if (isTauri) {
            try {
                const tasks = await invoke<Task[]>('list_tasks_by_status', { projectId, status })
                return tasks.map(this.normalizeTask)
            } catch (error) {
                console.error('Failed to list tasks by status:', error)
                throw error
            }
        }
        return inMemoryTasks.filter(t => t.projectId === projectId && t.status === status)
    }

    /**
     * Get tasks by priority
     */
    async findByPriority(
        projectId: string,
        priority: 'low' | 'medium' | 'high'
    ): Promise<Task[]> {
        const tasks = await this.findByProjectId(projectId)
        return tasks.filter(t => t.priority === priority)
    }

    /**
     * Create new task
     */
    async create(data: Partial<InsertTask>): Promise<Task> {
        const now = new Date()
        const task: Task = {
            id: uuidv4(),
            projectId: data.projectId!,
            parentId: data.parentId || null,
            title: data.title!,
            description: data.description || null,
            status: data.status || 'todo',
            priority: data.priority || 'medium',
            dueDate: data.dueDate || null,
            completedAt: null,
            createdAt: now,
            updatedAt: now,
            order: data.order || 0,
            tags: data.tags || null,
        }

        if (isTauri) {
            try {
                const created = await invoke<Task>('create_task', {
                    data: {
                        projectId: task.projectId,
                        parentId: task.parentId,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
                        order: task.order,
                        tags: task.tags,
                    }
                })
                return this.normalizeTask(created)
            } catch (error) {
                console.error('Failed to create task:', error)
                throw error
            }
        }

        inMemoryTasks.push(task)
        return task
    }

    /**
     * Update task
     */
    async update(id: string, data: Partial<InsertTask>): Promise<Task> {
        const updates = {
            ...data,
            updatedAt: new Date(),
        } as Partial<Task>

        // If marking as done, set completedAt
        if (data.status === 'done' && !data.completedAt) {
            updates.completedAt = new Date()
        }

        // If marking as not done, clear completedAt
        if (data.status && data.status !== 'done') {
            updates.completedAt = null
        }

        if (isTauri) {
            try {
                const updated = await invoke<Task>('update_task', { id, data: updates })
                return this.normalizeTask(updated)
            } catch (error) {
                console.error('Failed to update task:', error)
                throw error
            }
        }

        const index = inMemoryTasks.findIndex(t => t.id === id)
        if (index !== -1) {
            inMemoryTasks[index] = {
                ...inMemoryTasks[index],
                ...updates,
            }
            return inMemoryTasks[index]
        }
        throw new Error('Task not found')
    }

    /**
     * Delete task and all its subtasks
     */
    async delete(id: string): Promise<void> {
        if (isTauri) {
            try {
                await invoke('delete_task', { id })
                return
            } catch (error) {
                console.error('Failed to delete task:', error)
                throw error
            }
        }

        // First, recursively delete all subtasks
        const subtasks = await this.findSubtasks(id)
        for (const subtask of subtasks) {
            await this.delete(subtask.id)
        }

        // Then delete the task itself
        const index = inMemoryTasks.findIndex(t => t.id === id)
        if (index !== -1) {
            inMemoryTasks.splice(index, 1)
        }
    }

    /**
     * Search tasks by title or description
     */
    async search(projectId: string, query: string): Promise<Task[]> {
        if (isTauri) {
            try {
                const tasks = await invoke<Task[]>('search_tasks', { projectId, query })
                return tasks.map(this.normalizeTask)
            } catch (error) {
                console.error('Failed to search tasks:', error)
                throw error
            }
        }

        const lowerQuery = query.toLowerCase()
        return inMemoryTasks.filter(t =>
            t.projectId === projectId && (
                t.title.toLowerCase().includes(lowerQuery) ||
                t.description?.toLowerCase().includes(lowerQuery)
            )
        )
    }

    /**
     * Move task to different parent (or make root)
     */
    async moveTask(id: string, newParentId: string | null): Promise<Task> {
        if (isTauri) {
            try {
                const task = await invoke<Task>('move_task', { id, parentId: newParentId })
                return this.normalizeTask(task)
            } catch (error) {
                console.error('Failed to move task:', error)
                throw error
            }
        }
        return await this.update(id, { parentId: newParentId })
    }

    /**
     * Reorder tasks within the same parent
     */
    async reorder(id: string, newOrder: number): Promise<Task> {
        if (isTauri) {
            try {
                const task = await invoke<Task>('reorder_task', { id, order: newOrder })
                return this.normalizeTask(task)
            } catch (error) {
                console.error('Failed to reorder task:', error)
                throw error
            }
        }
        return await this.update(id, { order: newOrder })
    }

    /**
     * Get task hierarchy (task with all its descendants)
     */
    async getHierarchy(id: string): Promise<TaskHierarchy> {
        if (isTauri) {
            try {
                return await invoke<TaskHierarchy>('get_task_hierarchy', { id })
            } catch (error) {
                console.error('Failed to get task hierarchy:', error)
                throw error
            }
        }

        const task = await this.findById(id)
        if (!task) {
            throw new Error(`Task with id ${id} not found`)
        }

        const subtasks = await this.findSubtasks(id)
        const children = await Promise.all(
            subtasks.map(subtask => this.getHierarchy(subtask.id))
        )

        return {
            ...task,
            children,
        }
    }

    /**
     * Normalize task from Rust backend format to TypeScript format
     */
    private normalizeTask(task: Record<string, unknown>): Task {
        const parseDate = (value: unknown): Date | null => {
            if (!value) return null
            if (typeof value === 'number') return new Date(value * 1000)
            if (value instanceof Date) return value
            return new Date(value as string)
        }

        return {
            id: task.id as string,
            projectId: (task.project_id || task.projectId) as string,
            parentId: (task.parent_id || task.parentId) as string | null,
            title: task.title as string,
            description: task.description as string | null,
            status: task.status as 'todo' | 'in_progress' | 'done',
            priority: task.priority as 'low' | 'medium' | 'high',
            dueDate: parseDate(task.due_date || task.dueDate),
            completedAt: parseDate(task.completed_at || task.completedAt),
            createdAt: parseDate(task.created_at || task.createdAt) || new Date(),
            updatedAt: parseDate(task.updated_at || task.updatedAt) || new Date(),
            order: task.order as number,
            tags: task.tags as string[] | null,
        }
    }
}

// Helper type for hierarchy
export interface TaskHierarchy extends Task {
    children: TaskHierarchy[]
}
