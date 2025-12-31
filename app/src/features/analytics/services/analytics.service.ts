/**
 * Analytics Service
 * 
 * Provides metrics and statistics for projects, tasks, and notes
 */

import { ProjectService } from '@/features/projects/services/project.service'
import { TaskService } from '@/features/tasks/services/task.service'
import { NoteService } from '@/features/notes/services/note.service'

// ============================================
// Types
// ============================================

export interface DashboardStats {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    archivedProjects: number
    totalTasks: number
    completedTasks: number
    pendingTasks: number
    overdueTasks: number
    totalNotes: number
    recentNotes: number
    taskCompletionRate: number
}

export interface ActivityData {
    date: string
    tasks: number
    notes: number
    commits: number
}

export interface TaskCompletionData {
    name: string
    completed: number
    pending: number
}

// ============================================
// Analytics Service
// ============================================

class AnalyticsServiceClass {
    /**
     * Get dashboard summary statistics
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        // Get all projects
        const projects = await ProjectService.getAll()
        const activeProjects = projects.filter(p => p.status === 'active').length
        const completedProjects = 0 // Note: Project status doesn't include 'completed', count archived for now
        const archivedProjects = projects.filter(p => p.status === 'archived').length

        // Aggregate tasks across all projects
        let totalTasks = 0
        let completedTasks = 0
        let pendingTasks = 0
        let overdueTasks = 0

        for (const project of projects) {
            const tasks = await TaskService.getAll(project.id)
            totalTasks += tasks.length

            for (const task of tasks) {
                if (task.completedAt) {
                    completedTasks++
                } else {
                    pendingTasks++
                    if (task.dueDate && new Date(task.dueDate) < now) {
                        overdueTasks++
                    }
                }
            }
        }

        // Aggregate notes
        let totalNotes = 0
        let recentNotes = 0

        for (const project of projects) {
            const notes = await NoteService.getAll(project.id)
            totalNotes += notes.length
            recentNotes += notes.filter(n => new Date(n.updatedAt) >= weekAgo).length
        }

        // Calculate completion rate
        const taskCompletionRate = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0

        return {
            totalProjects: projects.length,
            activeProjects,
            completedProjects,
            archivedProjects,
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            totalNotes,
            recentNotes,
            taskCompletionRate,
        }
    }

    /**
     * Get activity data for the last N days
     */
    async getActivityData(days = 7): Promise<ActivityData[]> {
        const result: ActivityData[] = []
        const now = new Date()

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            // Note: For a full implementation, you'd query tasks/notes by date
            // This is a simplified version that returns placeholder data
            result.push({
                date: dateStr,
                tasks: Math.floor(Math.random() * 10),
                notes: Math.floor(Math.random() * 5),
                commits: Math.floor(Math.random() * 3),
            })
        }

        return result
    }

    /**
     * Get task completion data by project
     */
    async getTaskCompletionByProject(limit = 5): Promise<TaskCompletionData[]> {
        const projects = await ProjectService.getAll()
        const result: TaskCompletionData[] = []

        for (const project of projects.slice(0, limit)) {
            const tasks = await TaskService.getAll(project.id)
            const completed = tasks.filter(t => t.completedAt).length
            const pending = tasks.filter(t => !t.completedAt).length

            result.push({
                name: project.name.length > 20
                    ? project.name.substring(0, 20) + '...'
                    : project.name,
                completed,
                pending,
            })
        }

        return result
    }
}

// Singleton
export const AnalyticsService = new AnalyticsServiceClass()
