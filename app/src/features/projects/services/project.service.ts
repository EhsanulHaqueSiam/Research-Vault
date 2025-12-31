/**
 * Project Service
 * 
 * Business logic layer for project operations
 */

import { ProjectRepository } from '@/core/database/repositories'
import {
    Project,
    CreateProjectDto,
    UpdateProjectDto,
    ProjectStats,
    ResearchMetadata,
    ResearchMetadataSchema,
    CreateProjectDtoSchema,
    UpdateProjectDtoSchema,
    builtInProjectTemplates,
    ProjectTemplate,
} from '../types/project.types'

const projectRepository = new ProjectRepository()

export class ProjectService {
    /**
     * Create a new project
     */
    static async create(data: CreateProjectDto): Promise<Project> {
        // Validate input
        const validated = CreateProjectDtoSchema.parse(data)

        // Check if project with same path exists
        const existing = await projectRepository.findByPath(validated.path)
        if (existing) {
            throw new Error(`A project already exists at path: ${validated.path}`)
        }

        return await projectRepository.create({
            name: validated.name,
            path: validated.path,
            description: validated.description || null,
            tags: validated.tags || null,
        })
    }

    /**
     * Create project from template
     */
    static async createFromTemplate(
        data: CreateProjectDto,
        templateId: string
    ): Promise<Project> {
        // Handle 'blank' template - just create without template
        if (templateId === 'blank' || !templateId) {
            return await this.create(data)
        }

        const template = builtInProjectTemplates.find(t => t.id === templateId)
        if (!template) {
            throw new Error(`Template '${templateId}' not found`)
        }

        // Create project with template tags
        const project = await this.create({
            ...data,
            tags: [...(data.tags || []), ...template.defaultTags],
        })

        // TODO: Create template folders
        // TODO: Create default notes from template

        return project
    }


    /**
     * Get all projects
     */
    static async getAll(): Promise<Project[]> {
        return await projectRepository.findAll()
    }

    /**
     * Get active projects
     */
    static async getActive(): Promise<Project[]> {
        return await projectRepository.findByStatus('active')
    }

    /**
     * Get archived projects
     */
    static async getArchived(): Promise<Project[]> {
        return await projectRepository.findByStatus('archived')
    }

    /**
     * Get project templates
     */
    static async getTemplates(): Promise<Project[]> {
        return await projectRepository.findByStatus('template')
    }

    /**
     * Get project by ID
     */
    static async getById(id: string): Promise<Project | null> {
        return await projectRepository.findById(id)
    }

    /**
     * Get project by path
     */
    static async getByPath(path: string): Promise<Project | null> {
        return await projectRepository.findByPath(path)
    }

    /**
     * Update project
     */
    static async update(id: string, data: UpdateProjectDto): Promise<Project> {
        // Validate input
        const validated = UpdateProjectDtoSchema.parse(data)
        return await projectRepository.update(id, validated)
    }

    /**
     * Archive project (soft delete)
     */
    static async archive(id: string): Promise<void> {
        await projectRepository.delete(id)
    }

    /**
     * Restore archived project
     */
    static async restore(id: string): Promise<Project> {
        return await projectRepository.update(id, { status: 'active' })
    }

    /**
     * Permanently delete project
     */
    static async permanentDelete(id: string): Promise<void> {
        await projectRepository.hardDelete(id)
    }

    /**
     * Search projects
     */
    static async search(query: string): Promise<Project[]> {
        return await projectRepository.search(query)
    }

    /**
     * Get project statistics
     */
    static async getStats(): Promise<ProjectStats> {
        const allProjects = await projectRepository.findAll()

        return {
            total: allProjects.length,
            active: allProjects.filter(p => p.status === 'active').length,
            archived: allProjects.filter(p => p.status === 'archived').length,
            templates: allProjects.filter(p => p.status === 'template').length,
        }
    }

    /**
     * Get available project templates
     */
    static getAvailableTemplates(): ProjectTemplate[] {
        return builtInProjectTemplates
    }

    /**
     * Add tag to project
     */
    static async addTag(id: string, tag: string): Promise<Project> {
        const project = await projectRepository.findById(id)
        if (!project) {
            throw new Error('Project not found')
        }

        const currentTags = project.tags || []
        if (currentTags.includes(tag)) {
            return project // Tag already exists
        }

        return await projectRepository.update(id, {
            tags: [...currentTags, tag],
        })
    }

    /**
     * Remove tag from project
     */
    static async removeTag(id: string, tag: string): Promise<Project> {
        const project = await projectRepository.findById(id)
        if (!project) {
            throw new Error('Project not found')
        }

        const currentTags = project.tags || []
        return await projectRepository.update(id, {
            tags: currentTags.filter(t => t !== tag),
        })
    }

    /**
     * Get recent projects (last accessed)
     */
    static async getRecent(limit: number = 5): Promise<Project[]> {
        const allProjects = await projectRepository.findByStatus('active')

        // Sort by lastModifiedAt descending
        return allProjects
            .sort((a, b) =>
                new Date(b.lastModifiedAt).getTime() - new Date(a.lastModifiedAt).getTime()
            )
            .slice(0, limit)
    }

    /**
     * Touch project (update lastModifiedAt)
     */
    static async touch(id: string): Promise<Project> {
        return await projectRepository.update(id, {})
    }

    /**
     * Validate research.json metadata
     */
    static validateMetadata(data: unknown): ResearchMetadata {
        return ResearchMetadataSchema.parse(data)
    }

    /**
     * Create default research.json metadata
     */
    static createDefaultMetadata(
        title: string,
        description?: string
    ): ResearchMetadata {
        const now = new Date().toISOString()

        return {
            version: '1.0.0',
            title,
            description,
            members: [],
            created_at: now,
            updated_at: now,
            tags: [],
            settings: {
                auto_commit: true,
                auto_commit_interval: 30,
                backup_enabled: true,
            },
            statistics: {
                total_files: 0,
                total_commits: 0,
                total_tasks: 0,
                total_notes: 0,
            },
        }
    }
}
