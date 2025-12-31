/**
 * Note Service
 * 
 * Business logic layer for note operations
 */

import { NoteRepository } from '@/core/database/repositories'
import {
    Note,
    CreateNoteDto,
    UpdateNoteDto,
    NoteStats,
    CreateNoteDtoSchema,
    UpdateNoteDtoSchema,
    builtInNoteTemplates,
    NoteTemplate
} from '../types/note.types'

const noteRepository = new NoteRepository()

export class NoteService {
    /**
     * Create a new note
     */
    static async create(data: CreateNoteDto): Promise<Note> {
        // Validate input
        const validated = CreateNoteDtoSchema.parse(data)
        return await noteRepository.create(validated)
    }

    /**
     * Create a note from template
     */
    static async createFromTemplate(
        projectId: string,
        templateId: string,
        title: string
    ): Promise<Note> {
        const template = builtInNoteTemplates.find(t => t.id === templateId)
        if (!template) {
            throw new Error(`Template '${templateId}' not found`)
        }

        return await this.create({
            projectId,
            title,
            content: template.content,
            tags: template.tags,
            isPinned: false,
        })
    }

    /**
     * Get all notes for a project
     */
    static async getAll(projectId: string): Promise<Note[]> {
        return await noteRepository.findByProjectId(projectId)
    }

    /**
     * Get pinned notes
     */
    static async getPinned(projectId: string): Promise<Note[]> {
        return await noteRepository.findPinned(projectId)
    }

    /**
     * Get recent notes
     */
    static async getRecent(projectId: string, limit: number = 10): Promise<Note[]> {
        return await noteRepository.findRecent(projectId, limit)
    }

    /**
     * Get note by ID
     */
    static async getById(id: string): Promise<Note | null> {
        return await noteRepository.findById(id)
    }

    /**
     * Update note
     */
    static async update(id: string, data: UpdateNoteDto): Promise<Note> {
        // Validate input
        const validated = UpdateNoteDtoSchema.parse(data)
        return await noteRepository.update(id, validated)
    }

    /**
     * Delete note
     */
    static async delete(id: string): Promise<void> {
        return await noteRepository.delete(id)
    }

    /**
     * Toggle pin status
     */
    static async togglePin(id: string): Promise<Note> {
        return await noteRepository.togglePin(id)
    }

    /**
     * Duplicate note
     */
    static async duplicate(id: string, newTitle?: string): Promise<Note> {
        return await noteRepository.duplicate(id, newTitle)
    }

    /**
     * Search notes
     */
    static async search(projectId: string, query: string): Promise<Note[]> {
        return await noteRepository.search(projectId, query)
    }

    /**
     * Get all tags for a project
     */
    static async getAllTags(projectId: string): Promise<string[]> {
        return await noteRepository.getAllTags(projectId)
    }

    /**
     * Get notes by tags
     */
    static async getByTags(projectId: string, tags: string[]): Promise<Note[]> {
        return await noteRepository.findByTags(projectId, tags)
    }

    /**
     * Get note statistics for a project
     */
    static async getStats(projectId: string): Promise<NoteStats> {
        const allNotes = await noteRepository.findByProjectId(projectId)
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        return {
            total: allNotes.length,
            pinned: allNotes.filter(n => n.isPinned).length,
            recentlyModified: allNotes.filter(n =>
                new Date(n.updatedAt) > oneWeekAgo
            ).length,
        }
    }

    /**
     * Get available templates
     */
    static getTemplates(): NoteTemplate[] {
        return builtInNoteTemplates
    }

    /**
     * Export note as markdown
     */
    static async exportAsMarkdown(id: string): Promise<string> {
        const note = await noteRepository.findById(id)
        if (!note) {
            throw new Error('Note not found')
        }

        // TODO: Convert Tiptap JSON to Markdown
        // For now, return raw content
        return `# ${note.title}\n\n${note.content}`
    }

    /**
     * Update note content (auto-save friendly)
     */
    static async updateContent(id: string, content: string): Promise<Note> {
        return await noteRepository.update(id, { content })
    }

    /**
     * Add tag to note
     */
    static async addTag(id: string, tag: string): Promise<Note> {
        const note = await noteRepository.findById(id)
        if (!note) {
            throw new Error('Note not found')
        }

        const currentTags = note.tags || []
        if (currentTags.includes(tag)) {
            return note // Tag already exists
        }

        return await noteRepository.update(id, {
            tags: [...currentTags, tag]
        })
    }

    /**
     * Remove tag from note
     */
    static async removeTag(id: string, tag: string): Promise<Note> {
        const note = await noteRepository.findById(id)
        if (!note) {
            throw new Error('Note not found')
        }

        const currentTags = note.tags || []
        return await noteRepository.update(id, {
            tags: currentTags.filter(t => t !== tag)
        })
    }
}
