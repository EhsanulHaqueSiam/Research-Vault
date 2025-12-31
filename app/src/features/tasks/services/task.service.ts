/**
 * Task Service
 * 
 * Business logic layer for task operations
 */

import { TaskRepository, TaskHierarchy } from '@/core/database/repositories'
import {
    Task,
    CreateTaskDto,
    UpdateTaskDto,
    TaskStats,
    CreateTaskDtoSchema,
    UpdateTaskDtoSchema
} from '../types/task.types'

const taskRepository = new TaskRepository()

export class TaskService {
    /**
     * Create a new task
     */
    static async create(data: CreateTaskDto): Promise<Task> {
        // Validate input
        const validated = CreateTaskDtoSchema.parse(data)
        return await taskRepository.create(validated)
    }

    /**
     * Get all tasks for a project
     */
    static async getAll(projectId: string): Promise<Task[]> {
        return await taskRepository.findByProjectId(projectId)
    }

    /**
     * Get root tasks (no parent) for a project
     */
    static async getRootTasks(projectId: string): Promise<Task[]> {
        return await taskRepository.findRootTasks(projectId)
    }

    /**
     * Get subtasks for a parent task
     */
    static async getSubtasks(parentId: string): Promise<Task[]> {
        return await taskRepository.findSubtasks(parentId)
    }

    /**
     * Get task by ID
     */
    static async getById(id: string): Promise<Task | null> {
        return await taskRepository.findById(id)
    }

    /**
     * Get task hierarchy
     */
    static async getHierarchy(id: string): Promise<TaskHierarchy> {
        return await taskRepository.getHierarchy(id)
    }

    /**
     * Update task
     */
    static async update(id: string, data: UpdateTaskDto): Promise<Task> {
        // Validate input
        const validated = UpdateTaskDtoSchema.parse(data)
        return await taskRepository.update(id, validated)
    }

    /**
     * Delete task and all subtasks
     */
    static async delete(id: string): Promise<void> {
        return await taskRepository.delete(id)
    }

    /**
     * Move task to a different parent
     */
    static async move(id: string, newParentId: string | null): Promise<Task> {
        return await taskRepository.moveTask(id, newParentId)
    }

    /**
     * Reorder task
     */
    static async reorder(id: string, newOrder: number): Promise<Task> {
        return await taskRepository.reorder(id, newOrder)
    }

    /**
     * Get tasks by status
     */
    static async getByStatus(
        projectId: string,
        status: 'todo' | 'in_progress' | 'done'
    ): Promise<Task[]> {
        return await taskRepository.findByStatus(projectId, status)
    }

    /**
     * Get tasks by priority
     */
    static async getByPriority(
        projectId: string,
        priority: 'low' | 'medium' | 'high'
    ): Promise<Task[]> {
        return await taskRepository.findByPriority(projectId, priority)
    }

    /**
     * Search tasks
     */
    static async search(projectId: string, query: string): Promise<Task[]> {
        return await taskRepository.search(projectId, query)
    }

    /**
     * Get task statistics for a project
     */
    static async getStats(projectId: string): Promise<TaskStats> {
        const allTasks = await taskRepository.findByProjectId(projectId)
        const now = new Date()

        return {
            total: allTasks.length,
            todo: allTasks.filter(t => t.status === 'todo').length,
            inProgress: allTasks.filter(t => t.status === 'in_progress').length,
            done: allTasks.filter(t => t.status === 'done').length,
            overdue: allTasks.filter(t =>
                t.status !== 'done' &&
                t.dueDate &&
                new Date(t.dueDate) < now
            ).length,
        }
    }

    /**
     * Complete a task
     */
    static async complete(id: string): Promise<Task> {
        return await taskRepository.update(id, {
            status: 'done',
            completedAt: new Date()
        })
    }

    /**
     * Reopen a completed task
     */
    static async reopen(id: string): Promise<Task> {
        return await taskRepository.update(id, {
            status: 'todo',
            completedAt: null
        })
    }

    /**
     * Create a subtask
     */
    static async createSubtask(parentId: string, data: Omit<CreateTaskDto, 'parentId'>): Promise<Task> {
        const parentTask = await taskRepository.findById(parentId)
        if (!parentTask) {
            throw new Error('Parent task not found')
        }

        return await this.create({
            ...data,
            projectId: parentTask.projectId,
            parentId,
        })
    }

    /**
     * Get overdue tasks
     */
    static async getOverdue(projectId: string): Promise<Task[]> {
        const allTasks = await taskRepository.findByProjectId(projectId)
        const now = new Date()

        return allTasks.filter(t =>
            t.status !== 'done' &&
            t.dueDate &&
            new Date(t.dueDate) < now
        )
    }

    /**
     * Bulk update task order
     */
    static async bulkReorder(updates: { id: string; order: number }[]): Promise<void> {
        for (const update of updates) {
            await taskRepository.reorder(update.id, update.order)
        }
    }
}
