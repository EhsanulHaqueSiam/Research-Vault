import { BaseRepository } from './base.repository'
import { v4 as uuidv4 } from 'uuid'
import { invoke } from '@tauri-apps/api/core'
import type { Project, InsertProject } from '../schema'

// Check if running in Tauri
const isTauri = typeof window !== 'undefined' &&
    '__TAURI_INTERNALS__' in window

// In-memory storage for browser development
const inMemoryProjects: Project[] = []

/**
 * Project Repository
 * 
 * Data access layer for research projects.
 * Uses Tauri IPC when running in Tauri, in-memory storage otherwise.
 */
export class ProjectRepository extends BaseRepository<Project> {
    /**
     * Get all projects
     */
    async findAll(): Promise<Project[]> {
        if (isTauri) {
            try {
                const projects = await invoke<Project[]>('list_projects')
                return projects.map(this.normalizeProject)
            } catch (error) {
                console.error('Failed to list projects:', error)
                throw error
            }
        }
        return [...inMemoryProjects]
    }

    /**
     * Find project by ID
     */
    async findById(id: string): Promise<Project | null> {
        if (isTauri) {
            try {
                const project = await invoke<Project>('get_project', { id })
                return this.normalizeProject(project)
            } catch (error) {
                // Not found
                return null
            }
        }
        return inMemoryProjects.find(p => p.id === id) || null
    }

    /**
     * Find project by path
     */
    async findByPath(path: string): Promise<Project | null> {
        const all = await this.findAll()
        return all.find(p => p.path === path) || null
    }

    /**
     * Create new project
     */
    async create(data: Partial<InsertProject>): Promise<Project> {
        const now = new Date()
        const project: Project = {
            id: uuidv4(),
            name: data.name!,
            path: data.path!,
            description: data.description || null,
            status: data.status || 'active',
            createdAt: now,
            lastModifiedAt: now,
            tags: data.tags || null,
            metadata: data.metadata || null,
        }

        if (isTauri) {
            try {
                const created = await invoke<Project>('create_project', {
                    data: {
                        name: project.name,
                        path: project.path,
                        description: project.description,
                        tags: project.tags,
                    }
                })
                return this.normalizeProject(created)
            } catch (error) {
                console.error('Failed to create project:', error)
                throw error
            }
        }

        inMemoryProjects.push(project)
        return project
    }

    /**
     * Update project
     */
    async update(id: string, data: Partial<InsertProject>): Promise<Project> {
        if (isTauri) {
            try {
                const updated = await invoke<Project>('update_project', {
                    id,
                    data: {
                        name: data.name,
                        description: data.description,
                        status: data.status,
                        tags: data.tags,
                    }
                })
                return this.normalizeProject(updated)
            } catch (error) {
                console.error('Failed to update project:', error)
                throw error
            }
        }

        const index = inMemoryProjects.findIndex(p => p.id === id)
        if (index !== -1) {
            inMemoryProjects[index] = {
                ...inMemoryProjects[index],
                ...data,
                lastModifiedAt: new Date(),
            }
            return inMemoryProjects[index]
        }
        throw new Error('Project not found')
    }

    /**
     * Delete project (soft delete by archiving)
     */
    async delete(id: string): Promise<void> {
        await this.update(id, { status: 'archived' })
    }

    /**
     * Hard delete project
     */
    async hardDelete(id: string): Promise<void> {
        if (isTauri) {
            try {
                await invoke('delete_project', { id })
                return
            } catch (error) {
                console.error('Failed to delete project:', error)
                throw error
            }
        }

        const index = inMemoryProjects.findIndex(p => p.id === id)
        if (index !== -1) {
            inMemoryProjects.splice(index, 1)
        }
    }

    /**
     * Search projects by name or description
     */
    async search(query: string): Promise<Project[]> {
        const all = await this.findAll()
        const lowerQuery = query.toLowerCase()
        return all.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description?.toLowerCase().includes(lowerQuery)
        )
    }

    /**
     * Get projects by status
     */
    async findByStatus(status: 'active' | 'archived' | 'template'): Promise<Project[]> {
        const all = await this.findAll()
        return all.filter(p => p.status === status)
    }

    /**
     * Normalize project from Rust backend format to TypeScript format
     */
    private normalizeProject(project: Record<string, unknown>): Project {
        return {
            id: project.id as string,
            name: project.name as string,
            path: project.path as string,
            description: project.description as string | null,
            status: project.status as 'active' | 'archived' | 'template',
            createdAt: typeof project.created_at === 'number'
                ? new Date(project.created_at * 1000)
                : typeof project.createdAt === 'object' && project.createdAt instanceof Date
                    ? project.createdAt
                    : new Date(project.createdAt as string | number),
            lastModifiedAt: typeof project.last_modified_at === 'number'
                ? new Date(project.last_modified_at * 1000)
                : typeof project.lastModifiedAt === 'object' && project.lastModifiedAt instanceof Date
                    ? project.lastModifiedAt
                    : new Date(project.lastModifiedAt as string | number),
            tags: project.tags as string[] | null,
            metadata: project.metadata as Record<string, unknown> | null,
        }
    }
}
