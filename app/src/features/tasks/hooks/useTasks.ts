/**
 * Task Hooks
 * 
 * TanStack Query hooks for task operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskService } from '../services/task.service'
import type {
    Task,
    CreateTaskDto,
    UpdateTaskDto,
    TaskFilter,
} from '../types/task.types'

// ============================================
// Query Keys
// ============================================

export const taskKeys = {
    all: ['tasks'] as const,
    list: (projectId: string) => [...taskKeys.all, 'list', projectId] as const,
    hierarchy: (projectId: string) => [...taskKeys.all, 'hierarchy', projectId] as const,
    detail: (taskId: string) => [...taskKeys.all, 'detail', taskId] as const,
    stats: (projectId: string) => [...taskKeys.all, 'stats', projectId] as const,
    filtered: (filter: TaskFilter) => [...taskKeys.all, 'filtered', filter] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Get all tasks for a project as a flat list
 */
export function useTasks(projectId: string) {
    return useQuery({
        queryKey: taskKeys.list(projectId),
        queryFn: () => TaskService.getAll(projectId),
        enabled: !!projectId,
    })
}

/**
 * Get tasks with hierarchy (parents and children)
 */
export function useTaskHierarchy(projectId: string) {
    return useQuery({
        queryKey: taskKeys.hierarchy(projectId),
        queryFn: async () => {
            // Get all tasks and build hierarchy client-side
            const tasks = await TaskService.getAll(projectId)
            return buildHierarchy(tasks)
        },
        enabled: !!projectId,
    })
}

/**
 * Build task hierarchy from flat list
 */
function buildHierarchy(tasks: Task[]): TaskWithChildren[] {
    const taskMap = new Map<string, TaskWithChildren>()
    const roots: TaskWithChildren[] = []

    // First pass: create all nodes
    for (const task of tasks) {
        taskMap.set(task.id, { ...task, children: [] })
    }

    // Second pass: link children to parents
    for (const task of tasks) {
        const node = taskMap.get(task.id)!
        if (task.parentId) {
            const parent = taskMap.get(task.parentId)
            if (parent) {
                parent.children.push(node)
            } else {
                roots.push(node)
            }
        } else {
            roots.push(node)
        }
    }

    return roots.sort((a, b) => a.order - b.order)
}

interface TaskWithChildren extends Task {
    children: TaskWithChildren[]
}

/**
 * Get a single task by ID
 */
export function useTask(taskId: string) {
    return useQuery({
        queryKey: taskKeys.detail(taskId),
        queryFn: () => TaskService.getById(taskId),
        enabled: !!taskId,
    })
}

/**
 * Get task statistics for a project
 */
export function useTaskStats(projectId: string) {
    return useQuery({
        queryKey: taskKeys.stats(projectId),
        queryFn: () => TaskService.getStats(projectId),
        enabled: !!projectId,
    })
}

/**
 * Get filtered tasks
 */
export function useFilteredTasks(filter: TaskFilter) {
    return useQuery({
        queryKey: taskKeys.filtered(filter),
        queryFn: async () => {
            // Use search if query provided, else get all
            if (filter.search) {
                return TaskService.search(filter.projectId, filter.search)
            }
            if (filter.status) {
                return TaskService.getByStatus(filter.projectId, filter.status)
            }
            if (filter.priority) {
                return TaskService.getByPriority(filter.projectId, filter.priority)
            }
            return TaskService.getAll(filter.projectId)
        },
        enabled: !!filter.projectId,
    })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Create a new task
 */
export function useCreateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTaskDto) => TaskService.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.list(variables.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.hierarchy(variables.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.stats(variables.projectId) })
        },
    })
}

/**
 * Update an existing task
 */
export function useUpdateTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ taskId, data }: { taskId: string; data: UpdateTaskDto }) => {
            const task = await TaskService.update(taskId, data)
            return task
        },
        onSuccess: (updatedTask: Task) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.list(updatedTask.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.hierarchy(updatedTask.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.stats(updatedTask.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.detail(updatedTask.id) })
        },
    })
}

/**
 * Delete a task
 */
export function useDeleteTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ taskId, projectId }: { taskId: string; projectId: string }) => {
            await TaskService.delete(taskId)
            return projectId
        },
        onSuccess: (projectId: string) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.hierarchy(projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.stats(projectId) })
        },
    })
}

/**
 * Toggle task completion status
 */
export function useToggleTask() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ task }: { task: Task }) => {
            if (task.status === 'done') {
                return TaskService.reopen(task.id)
            } else {
                return TaskService.complete(task.id)
            }
        },
        onSuccess: (updatedTask: Task) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.list(updatedTask.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.hierarchy(updatedTask.projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.stats(updatedTask.projectId) })
        },
    })
}

/**
 * Reorder tasks (for drag-and-drop)
 */
export function useReorderTasks() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({
            projectId,
            taskIds
        }: {
            projectId: string
            taskIds: string[]
        }) => {
            const updates = taskIds.map((id, index) => ({ id, order: index }))
            await TaskService.bulkReorder(updates)
            return projectId
        },
        onSuccess: (projectId: string) => {
            queryClient.invalidateQueries({ queryKey: taskKeys.list(projectId) })
            queryClient.invalidateQueries({ queryKey: taskKeys.hierarchy(projectId) })
        },
    })
}

// ============================================
// Combined Hook
// ============================================

/**
 * All-in-one hook for task management
 */
export function useProjectTasks(projectId: string) {
    const tasks = useTaskHierarchy(projectId)
    const stats = useTaskStats(projectId)
    const createTask = useCreateTask()
    const updateTask = useUpdateTask()
    const deleteTask = useDeleteTask()
    const toggleTask = useToggleTask()
    const reorderTasks = useReorderTasks()

    return {
        // Data
        tasks: tasks.data || [],
        stats: stats.data,
        isLoading: tasks.isLoading,

        // Mutations
        create: (data: CreateTaskDto) => createTask.mutateAsync(data),
        update: (taskId: string, data: UpdateTaskDto) =>
            updateTask.mutateAsync({ taskId, data }),
        remove: (taskId: string) =>
            deleteTask.mutateAsync({ taskId, projectId }),
        toggle: (task: Task) => toggleTask.mutateAsync({ task }),
        reorder: (taskIds: string[]) =>
            reorderTasks.mutateAsync({ projectId, taskIds }),

        // States
        isCreating: createTask.isPending,
        isUpdating: updateTask.isPending,
        isDeleting: deleteTask.isPending,
    }
}
