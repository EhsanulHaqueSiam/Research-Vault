/**
 * Task Type Definitions with Zod Validation
 */

import { z } from 'zod'

// ============================================
// Enums
// ============================================

export const TaskStatus = z.enum(['todo', 'in_progress', 'done'])
export type TaskStatus = z.infer<typeof TaskStatus>

export const TaskPriority = z.enum(['low', 'medium', 'high'])
export type TaskPriority = z.infer<typeof TaskPriority>

// ============================================
// Task Schema
// ============================================

export const TaskSchema = z.object({
    id: z.string().uuid(),
    projectId: z.string().uuid(),
    parentId: z.string().uuid().nullable(),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().nullable(),
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: z.date().nullable(),
    completedAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    order: z.number().int().nonnegative(),
    tags: z.array(z.string()).nullable(),
})

export type Task = z.infer<typeof TaskSchema>

// ============================================
// Task with Children (Hierarchy)
// ============================================

export interface TaskWithChildren extends Task {
    children: TaskWithChildren[]
}

// ============================================
// DTOs
// ============================================

export const CreateTaskDtoSchema = z.object({
    projectId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional(),
    status: TaskStatus.optional().default('todo'),
    priority: TaskPriority.optional().default('medium'),
    dueDate: z.date().optional(),
    order: z.number().int().nonnegative().optional().default(0),
    tags: z.array(z.string()).optional(),
})

export type CreateTaskDto = z.infer<typeof CreateTaskDtoSchema>

export const UpdateTaskDtoSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().nullable().optional(),
    status: TaskStatus.optional(),
    priority: TaskPriority.optional(),
    dueDate: z.date().nullable().optional(),
    parentId: z.string().uuid().nullable().optional(),
    order: z.number().int().nonnegative().optional(),
    tags: z.array(z.string()).nullable().optional(),
})

export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoSchema>

// ============================================
// Query Filters
// ============================================

export const TaskFilterSchema = z.object({
    projectId: z.string().uuid(),
    status: TaskStatus.optional(),
    priority: TaskPriority.optional(),
    parentId: z.string().uuid().nullable().optional(),
    hasDueDate: z.boolean().optional(),
    overdue: z.boolean().optional(),
    search: z.string().optional(),
})

export type TaskFilter = z.infer<typeof TaskFilterSchema>

// ============================================
// Utility Types
// ============================================

export interface TaskStats {
    total: number
    todo: number
    inProgress: number
    done: number
    overdue: number
}
