/**
 * Research Metadata Service
 * 
 * Handles reading/writing research.json files for portable project metadata
 */

import {
    ResearchMetadata,
    ResearchMetadataSchema,
} from '@/features/projects/types/project.types'

// File name for metadata
export const METADATA_FILENAME = 'research.json'

/**
 * Metadata Service
 * 
 * Manages the portable research.json metadata file
 */
export class MetadataService {
    private projectPath: string
    private metadata: ResearchMetadata | null = null
    private isDirty: boolean = false

    constructor(projectPath: string) {
        this.projectPath = projectPath
    }

    /**
     * Get the full path to the metadata file
     */
    getMetadataPath(): string {
        return `${this.projectPath}/${METADATA_FILENAME}`
    }

    /**
     * Check if metadata file exists
     * Note: This is a placeholder - actual implementation needs Tauri FS API
     */
    async exists(): Promise<boolean> {
        // TODO: Use Tauri fs API to check file existence
        // For now, return false as a placeholder
        try {
            await this.load()
            return true
        } catch {
            return false
        }
    }

    /**
     * Load metadata from file
     * Note: This is a placeholder - actual implementation needs Tauri FS API
     */
    async load(): Promise<ResearchMetadata> {
        // TODO: Use Tauri fs API to read file
        // This is a placeholder implementation
        if (this.metadata) {
            return this.metadata
        }

        // Placeholder: will be replaced with actual file read
        throw new Error('Metadata file not found. Use Tauri fs API to read.')
    }

    /**
     * Save metadata to file
     * Note: This is a placeholder - actual implementation needs Tauri FS API
     */
    async save(): Promise<void> {
        if (!this.metadata) {
            throw new Error('No metadata to save')
        }

        // Update the updated_at timestamp
        this.metadata.updated_at = new Date().toISOString()

        // TODO: Use Tauri fs API to write file
        // const content = JSON.stringify(this.metadata, null, 2)
        // await writeTextFile(this.getMetadataPath(), content)

        this.isDirty = false
    }

    /**
     * Initialize new metadata for a project
     */
    async initialize(title: string, description?: string): Promise<ResearchMetadata> {
        const now = new Date().toISOString()

        this.metadata = {
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

        await this.save()
        return this.metadata
    }

    /**
     * Get current metadata (cached)
     */
    getMetadata(): ResearchMetadata | null {
        return this.metadata
    }

    /**
     * Update metadata fields
     */
    async update(updates: Partial<ResearchMetadata>): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        this.metadata = {
            ...this.metadata!,
            ...updates,
            updated_at: new Date().toISOString(),
        }

        this.isDirty = true
        return this.metadata
    }

    /**
     * Update project title
     */
    async updateTitle(title: string): Promise<ResearchMetadata> {
        return await this.update({ title })
    }

    /**
     * Update project description
     */
    async updateDescription(description: string): Promise<ResearchMetadata> {
        return await this.update({ description })
    }

    /**
     * Add a team member
     */
    async addMember(member: ResearchMetadata['members'][0]): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        const members = [...this.metadata!.members, member]
        return await this.update({ members })
    }

    /**
     * Remove a team member
     */
    async removeMember(memberName: string): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        const members = this.metadata!.members.filter(m => m.name !== memberName)
        return await this.update({ members })
    }

    /**
     * Update settings
     */
    async updateSettings(
        settings: Partial<ResearchMetadata['settings']>
    ): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        return await this.update({
            settings: { ...this.metadata!.settings, ...settings },
        })
    }

    /**
     * Update statistics
     */
    async updateStatistics(
        statistics: Partial<ResearchMetadata['statistics']>
    ): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        return await this.update({
            statistics: { ...this.metadata!.statistics, ...statistics },
        })
    }

    /**
     * Add tag
     */
    async addTag(tag: string): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        if (this.metadata!.tags.includes(tag)) {
            return this.metadata!
        }

        return await this.update({
            tags: [...this.metadata!.tags, tag],
        })
    }

    /**
     * Remove tag
     */
    async removeTag(tag: string): Promise<ResearchMetadata> {
        if (!this.metadata) {
            await this.load()
        }

        return await this.update({
            tags: this.metadata!.tags.filter(t => t !== tag),
        })
    }

    /**
     * Check if there are unsaved changes
     */
    hasUnsavedChanges(): boolean {
        return this.isDirty
    }

    /**
     * Validate metadata object
     */
    static validate(data: unknown): ResearchMetadata {
        return ResearchMetadataSchema.parse(data)
    }

    /**
     * Parse metadata from JSON string
     */
    static parse(json: string): ResearchMetadata {
        try {
            const data = JSON.parse(json)
            return MetadataService.validate(data)
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error('Invalid JSON format in research.json')
            }
            throw error
        }
    }

    /**
     * Serialize metadata to JSON string
     */
    static stringify(metadata: ResearchMetadata): string {
        return JSON.stringify(metadata, null, 2)
    }
}

/**
 * Sync service for keeping DB and research.json in sync
 */
export class MetadataSyncService {
    /**
     * Sync database project with research.json
     * Direction: DB -> File
     */
    static async syncToFile(
        _projectId: string,
        _metadataService: MetadataService
    ): Promise<void> {
        // TODO: Implement sync logic
        // 1. Load project from database
        // 2. Update research.json with DB data
        // 3. Save research.json
    }

    /**
     * Sync research.json with database project
     * Direction: File -> DB
     */
    static async syncFromFile(
        _projectId: string,
        _metadataService: MetadataService
    ): Promise<void> {
        // TODO: Implement sync logic
        // 1. Load research.json
        // 2. Update database with file data
        // 3. Save to database
    }

    /**
     * Detect and resolve conflicts between DB and file
     */
    static async detectConflicts(
        _projectId: string,
        _metadataService: MetadataService
    ): Promise<{ hasConflicts: boolean; conflicts: string[] }> {
        // TODO: Implement conflict detection
        return { hasConflicts: false, conflicts: [] }
    }
}
