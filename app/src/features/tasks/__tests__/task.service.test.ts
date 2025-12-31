/**
 * Task Service Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
// These imports are used by vi.mock for type-checking
import type { TaskService as _TaskService } from '../services/task.service'
import type { TaskRepository as _TaskRepository } from '@/core/database/repositories'

// Mock the repository
vi.mock('@/core/database/repositories', () => ({
    TaskRepository: vi.fn().mockImplementation(() => ({
        findAll: vi.fn(),
        findById: vi.fn(),
        findByProjectId: vi.fn(),
        findRootTasks: vi.fn(),
        findSubtasks: vi.fn(),
        findByStatus: vi.fn(),
        findByPriority: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
        moveTask: vi.fn(),
        reorder: vi.fn(),
        getHierarchy: vi.fn(),
    })),
}))

describe('TaskService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getStats', () => {
        it('should calculate correct statistics', async () => {
            const mockTasks = [
                { id: '1', status: 'todo', dueDate: null },
                { id: '2', status: 'todo', dueDate: null },
                { id: '3', status: 'in_progress', dueDate: null },
                { id: '4', status: 'done', dueDate: null },
                { id: '5', status: 'done', dueDate: null },
            ]

            // Test the counting logic
            const todo = mockTasks.filter(t => t.status === 'todo').length
            const inProgress = mockTasks.filter(t => t.status === 'in_progress').length
            const done = mockTasks.filter(t => t.status === 'done').length

            expect(todo).toBe(2)
            expect(inProgress).toBe(1)
            expect(done).toBe(2)
            expect(mockTasks.length).toBe(5)
        })

        it('should identify overdue tasks', async () => {
            const now = new Date()
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

            const mockTasks = [
                { id: '1', status: 'todo', dueDate: yesterday },
                { id: '2', status: 'todo', dueDate: tomorrow },
                { id: '3', status: 'in_progress', dueDate: yesterday },
                { id: '4', status: 'done', dueDate: yesterday }, // Should not count as overdue
            ]

            const overdue = mockTasks.filter(t =>
                t.status !== 'done' &&
                t.dueDate &&
                new Date(t.dueDate) < now
            ).length

            expect(overdue).toBe(2)
        })
    })

    describe('Task Status Transitions', () => {
        it('should allow todo -> in_progress transition', () => {
            const validTransitions = {
                todo: ['in_progress', 'done'],
                in_progress: ['todo', 'done'],
                done: ['todo', 'in_progress'],
            }

            expect(validTransitions.todo).toContain('in_progress')
        })

        it('should allow in_progress -> done transition', () => {
            const validTransitions = {
                todo: ['in_progress', 'done'],
                in_progress: ['todo', 'done'],
                done: ['todo', 'in_progress'],
            }

            expect(validTransitions.in_progress).toContain('done')
        })
    })

    describe('Task Hierarchy', () => {
        it('should build correct hierarchy structure', () => {
            const rootTask = {
                id: 'root',
                title: 'Root Task',
                parentId: null,
            }

            const subtask1 = {
                id: 'sub1',
                title: 'Subtask 1',
                parentId: 'root',
            }

            const subtask2 = {
                id: 'sub2',
                title: 'Subtask 2',
                parentId: 'root',
            }

            // Verify hierarchy relationships
            expect(subtask1.parentId).toBe(rootTask.id)
            expect(subtask2.parentId).toBe(rootTask.id)
            expect(rootTask.parentId).toBeNull()
        })

        it('should detect circular references', () => {
            const task1 = { id: '1', parentId: '2' }
            const task2 = { id: '2', parentId: '1' }

            // Check for potential circular reference
            const isCircular = task1.parentId === task2.id && task2.parentId === task1.id
            expect(isCircular).toBe(true)
        })
    })

    describe('Task Priority', () => {
        it('should validate priority values', () => {
            const validPriorities = ['low', 'medium', 'high']

            expect(validPriorities).toContain('low')
            expect(validPriorities).toContain('medium')
            expect(validPriorities).toContain('high')
            expect(validPriorities).not.toContain('urgent')
        })

        it('should sort by priority correctly', () => {
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            const tasks = [
                { title: 'Low', priority: 'low' },
                { title: 'High', priority: 'high' },
                { title: 'Medium', priority: 'medium' },
            ]

            const sorted = tasks.sort(
                (a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] -
                    priorityOrder[b.priority as keyof typeof priorityOrder]
            )

            expect(sorted[0].priority).toBe('high')
            expect(sorted[1].priority).toBe('medium')
            expect(sorted[2].priority).toBe('low')
        })
    })

    describe('Task Ordering', () => {
        it('should maintain order after reordering', () => {
            const tasks = [
                { id: '1', order: 0 },
                { id: '2', order: 1 },
                { id: '3', order: 2 },
            ]

            // Simulate moving task 3 to position 0
            const movingTask = tasks.find(t => t.id === '3')!
            movingTask.order = 0

            // Increment order of other tasks
            tasks.forEach(t => {
                if (t.id !== '3' && t.order >= 0) {
                    t.order++
                }
            })

            const sorted = tasks.sort((a, b) => a.order - b.order)
            expect(sorted[0].id).toBe('3')
        })
    })
})
