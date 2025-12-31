import { BaseRepository } from './base.repository'
import { v4 as uuidv4 } from 'uuid'
import { invoke } from '@tauri-apps/api/core'
import type { Note, InsertNote } from '../schema'

// Check if running in Tauri
const isTauri = typeof window !== 'undefined' &&
    '__TAURI_INTERNALS__' in window

// In-memory storage for browser development
const inMemoryNotes: Note[] = []

/**
 * Note Repository
 * 
 * Data access layer for rich text notes.
 * Uses Tauri IPC when running in Tauri, in-memory storage otherwise.
 */
export class NoteRepository extends BaseRepository<Note> {
    /**
     * Get all notes
     */
    async findAll(): Promise<Note[]> {
        if (isTauri) {
            try {
                const notes = await invoke<Note[]>('list_notes', { projectId: null })
                return notes.map(this.normalizeNote)
            } catch (error) {
                console.error('Failed to list notes:', error)
                throw error
            }
        }
        return [...inMemoryNotes].sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    }

    /**
     * Find note by ID
     */
    async findById(id: string): Promise<Note | null> {
        if (isTauri) {
            try {
                const note = await invoke<Note>('get_note', { id })
                return this.normalizeNote(note)
            } catch {
                return null
            }
        }
        return inMemoryNotes.find(n => n.id === id) || null
    }

    /**
     * Get all notes for a project
     */
    async findByProjectId(projectId: string): Promise<Note[]> {
        if (isTauri) {
            try {
                const notes = await invoke<Note[]>('list_notes', { projectId })
                return notes.map(this.normalizeNote)
            } catch (error) {
                console.error('Failed to list project notes:', error)
                throw error
            }
        }
        return inMemoryNotes
            .filter(n => n.projectId === projectId)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    /**
     * Get pinned notes for a project
     */
    async findPinned(projectId: string): Promise<Note[]> {
        if (isTauri) {
            try {
                const notes = await invoke<Note[]>('list_pinned_notes', { projectId })
                return notes.map(this.normalizeNote)
            } catch (error) {
                console.error('Failed to list pinned notes:', error)
                throw error
            }
        }
        return inMemoryNotes
            .filter(n => n.projectId === projectId && n.isPinned)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    /**
     * Get notes by tags
     */
    async findByTags(projectId: string, tags: string[]): Promise<Note[]> {
        if (isTauri) {
            try {
                const notes = await invoke<Note[]>('list_notes_by_tags', { projectId, tags })
                return notes.map(this.normalizeNote)
            } catch (error) {
                console.error('Failed to list notes by tags:', error)
                throw error
            }
        }

        const allNotes = await this.findByProjectId(projectId)
        return allNotes.filter(note => {
            if (!note.tags || note.tags.length === 0) return false
            return tags.some(tag => note.tags!.includes(tag))
        })
    }

    /**
     * Create new note
     */
    async create(data: Partial<InsertNote>): Promise<Note> {
        const now = new Date()
        const note: Note = {
            id: uuidv4(),
            projectId: data.projectId!,
            title: data.title!,
            content: data.content || '',
            createdAt: now,
            updatedAt: now,
            tags: data.tags || null,
            isPinned: data.isPinned || false,
        }

        if (isTauri) {
            try {
                const created = await invoke<Note>('create_note', {
                    data: {
                        projectId: note.projectId,
                        title: note.title,
                        content: note.content,
                        tags: note.tags,
                        isPinned: note.isPinned,
                    }
                })
                return this.normalizeNote(created)
            } catch (error) {
                console.error('Failed to create note:', error)
                throw error
            }
        }

        inMemoryNotes.push(note)
        return note
    }

    /**
     * Update note
     */
    async update(id: string, data: Partial<InsertNote>): Promise<Note> {
        const updates = {
            ...data,
            updatedAt: new Date(),
        }

        if (isTauri) {
            try {
                const updated = await invoke<Note>('update_note', { id, data: updates })
                return this.normalizeNote(updated)
            } catch (error) {
                console.error('Failed to update note:', error)
                throw error
            }
        }

        const index = inMemoryNotes.findIndex(n => n.id === id)
        if (index !== -1) {
            inMemoryNotes[index] = {
                ...inMemoryNotes[index],
                ...updates,
            }
            return inMemoryNotes[index]
        }
        throw new Error('Note not found')
    }

    /**
     * Delete note
     */
    async delete(id: string): Promise<void> {
        if (isTauri) {
            try {
                await invoke('delete_note', { id })
                return
            } catch (error) {
                console.error('Failed to delete note:', error)
                throw error
            }
        }

        const index = inMemoryNotes.findIndex(n => n.id === id)
        if (index !== -1) {
            inMemoryNotes.splice(index, 1)
        }
    }

    /**
     * Search notes by title or content
     */
    async search(projectId: string, query: string): Promise<Note[]> {
        if (isTauri) {
            try {
                const notes = await invoke<Note[]>('search_notes', { projectId, query })
                return notes.map(this.normalizeNote)
            } catch (error) {
                console.error('Failed to search notes:', error)
                throw error
            }
        }

        const lowerQuery = query.toLowerCase()
        return inMemoryNotes
            .filter(n =>
                n.projectId === projectId && (
                    n.title.toLowerCase().includes(lowerQuery) ||
                    n.content.toLowerCase().includes(lowerQuery)
                )
            )
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    }

    /**
     * Toggle pin status
     */
    async togglePin(id: string): Promise<Note> {
        if (isTauri) {
            try {
                const note = await invoke<Note>('toggle_note_pin', { id })
                return this.normalizeNote(note)
            } catch (error) {
                console.error('Failed to toggle note pin:', error)
                throw error
            }
        }

        const note = await this.findById(id)
        if (!note) {
            throw new Error(`Note with id ${id} not found`)
        }

        return await this.update(id, { isPinned: !note.isPinned })
    }

    /**
     * Get recent notes (last N notes)
     */
    async findRecent(projectId: string, limit: number = 10): Promise<Note[]> {
        if (isTauri) {
            try {
                const notes = await invoke<Note[]>('list_recent_notes', { projectId, limit })
                return notes.map(this.normalizeNote)
            } catch (error) {
                console.error('Failed to list recent notes:', error)
                throw error
            }
        }

        return inMemoryNotes
            .filter(n => n.projectId === projectId)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, limit)
    }

    /**
     * Get all unique tags for a project
     */
    async getAllTags(projectId: string): Promise<string[]> {
        if (isTauri) {
            try {
                return await invoke<string[]>('get_note_tags', { projectId })
            } catch (error) {
                console.error('Failed to get note tags:', error)
                throw error
            }
        }

        const projectNotes = await this.findByProjectId(projectId)
        const tagSet = new Set<string>()
        projectNotes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(tag => tagSet.add(tag))
            }
        })

        return Array.from(tagSet).sort()
    }

    /**
     * Duplicate a note
     */
    async duplicate(id: string, newTitle?: string): Promise<Note> {
        if (isTauri) {
            try {
                const note = await invoke<Note>('duplicate_note', { id, newTitle })
                return this.normalizeNote(note)
            } catch (error) {
                console.error('Failed to duplicate note:', error)
                throw error
            }
        }

        const original = await this.findById(id)
        if (!original) {
            throw new Error(`Note with id ${id} not found`)
        }

        return await this.create({
            projectId: original.projectId,
            title: newTitle || `${original.title} (Copy)`,
            content: original.content,
            tags: original.tags,
            isPinned: false,
        })
    }

    /**
     * Normalize note from Rust backend format to TypeScript format
     */
    private normalizeNote(note: Record<string, unknown>): Note {
        const parseDate = (value: unknown): Date => {
            if (typeof value === 'number') return new Date(value * 1000)
            if (value instanceof Date) return value
            return new Date(value as string)
        }

        return {
            id: note.id as string,
            projectId: (note.project_id || note.projectId) as string,
            title: note.title as string,
            content: note.content as string,
            createdAt: parseDate(note.created_at || note.createdAt),
            updatedAt: parseDate(note.updated_at || note.updatedAt),
            tags: note.tags as string[] | null,
            isPinned: (note.is_pinned ?? note.isPinned ?? false) as boolean,
        }
    }
}
