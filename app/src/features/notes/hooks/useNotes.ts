/**
 * Note Hooks
 * 
 * TanStack Query hooks for note operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NoteService } from '../services/note.service'
import type {
    CreateNoteDto,
    UpdateNoteDto,
} from '../types/note.types'

// ============================================
// Query Keys
// ============================================

export const noteKeys = {
    all: ['notes'] as const,
    lists: () => [...noteKeys.all, 'list'] as const,
    list: (projectId: string) => [...noteKeys.lists(), projectId] as const,
    pinned: (projectId: string) => [...noteKeys.list(projectId), 'pinned'] as const,
    recent: (projectId: string) => [...noteKeys.list(projectId), 'recent'] as const,
    detail: (noteId: string) => [...noteKeys.all, 'detail', noteId] as const,
    stats: (projectId: string) => [...noteKeys.all, 'stats', projectId] as const,
    tags: (projectId: string) => [...noteKeys.all, 'tags', projectId] as const,
    search: (projectId: string, query: string) => [...noteKeys.list(projectId), 'search', query] as const,
}

// ============================================
// Query Hooks
// ============================================

/**
 * Get all notes for a project
 */
export function useNotes(projectId: string) {
    return useQuery({
        queryKey: noteKeys.list(projectId),
        queryFn: () => NoteService.getAll(projectId),
        enabled: !!projectId,
    })
}

/**
 * Get a single note by ID
 */
export function useNote(noteId: string) {
    return useQuery({
        queryKey: noteKeys.detail(noteId),
        queryFn: () => NoteService.getById(noteId),
        enabled: !!noteId,
    })
}

/**
 * Get pinned notes for a project
 */
export function usePinnedNotes(projectId: string) {
    return useQuery({
        queryKey: noteKeys.pinned(projectId),
        queryFn: () => NoteService.getPinned(projectId),
        enabled: !!projectId,
    })
}

/**
 * Get recent notes for a project
 */
export function useRecentNotes(projectId: string, limit: number = 10) {
    return useQuery({
        queryKey: noteKeys.recent(projectId),
        queryFn: () => NoteService.getRecent(projectId, limit),
        enabled: !!projectId,
    })
}

/**
 * Get note statistics for a project
 */
export function useNoteStats(projectId: string) {
    return useQuery({
        queryKey: noteKeys.stats(projectId),
        queryFn: () => NoteService.getStats(projectId),
        enabled: !!projectId,
    })
}

/**
 * Get all tags for a project's notes
 */
export function useNoteTags(projectId: string) {
    return useQuery({
        queryKey: noteKeys.tags(projectId),
        queryFn: () => NoteService.getAllTags(projectId),
        enabled: !!projectId,
    })
}

/**
 * Search notes in a project
 */
export function useSearchNotes(projectId: string, query: string) {
    return useQuery({
        queryKey: noteKeys.search(projectId, query),
        queryFn: () => NoteService.search(projectId, query),
        enabled: !!projectId && query.length >= 2,
    })
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Create a new note
 */
export function useCreateNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateNoteDto) => NoteService.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(variables.projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.stats(variables.projectId)
            })
        },
    })
}

/**
 * Create a note from template
 */
export function useCreateNoteFromTemplate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            projectId,
            templateId,
            title,
        }: {
            projectId: string
            templateId: string
            title: string
        }) => NoteService.createFromTemplate(projectId, templateId, title),
        onSuccess: (newNote) => {
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(newNote.projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.stats(newNote.projectId)
            })
        },
    })
}

/**
 * Update an existing note
 */
export function useUpdateNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ noteId, data }: { noteId: string; data: UpdateNoteDto }) =>
            NoteService.update(noteId, data),
        onSuccess: (updatedNote) => {
            // Update the detail cache
            queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote)
            // Invalidate lists
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(updatedNote.projectId)
            })
        },
    })
}

/**
 * Update note content (optimized for auto-save)
 */
export function useUpdateNoteContent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ noteId, content }: { noteId: string; content: string }) =>
            NoteService.updateContent(noteId, content),
        onSuccess: (updatedNote) => {
            // Update the detail cache silently
            queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote)
        },
    })
}

/**
 * Delete a note
 */
export function useDeleteNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ noteId, projectId }: { noteId: string; projectId: string }) =>
            NoteService.delete(noteId).then(() => projectId),
        onSuccess: (projectId) => {
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.stats(projectId)
            })
        },
    })
}

/**
 * Toggle note pin status
 */
export function useToggleNotePin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (noteId: string) => NoteService.togglePin(noteId),
        onSuccess: (updatedNote) => {
            queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote)
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(updatedNote.projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.pinned(updatedNote.projectId)
            })
        },
    })
}

/**
 * Duplicate a note
 */
export function useDuplicateNote() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ noteId, newTitle }: { noteId: string; newTitle?: string }) =>
            NoteService.duplicate(noteId, newTitle),
        onSuccess: (newNote) => {
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(newNote.projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.stats(newNote.projectId)
            })
        },
    })
}

/**
 * Add tag to note
 */
export function useAddNoteTag() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ noteId, tag }: { noteId: string; tag: string }) =>
            NoteService.addTag(noteId, tag),
        onSuccess: (updatedNote) => {
            queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote)
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(updatedNote.projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.tags(updatedNote.projectId)
            })
        },
    })
}

/**
 * Remove tag from note
 */
export function useRemoveNoteTag() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ noteId, tag }: { noteId: string; tag: string }) =>
            NoteService.removeTag(noteId, tag),
        onSuccess: (updatedNote) => {
            queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote)
            queryClient.invalidateQueries({
                queryKey: noteKeys.list(updatedNote.projectId)
            })
            queryClient.invalidateQueries({
                queryKey: noteKeys.tags(updatedNote.projectId)
            })
        },
    })
}

// ============================================
// Combined Hook
// ============================================

/**
 * All-in-one hook for note management
 */
export function useProjectNotes(projectId: string) {
    const notesQuery = useNotes(projectId)
    const pinnedQuery = usePinnedNotes(projectId)
    const statsQuery = useNoteStats(projectId)
    const tagsQuery = useNoteTags(projectId)

    const createMutation = useCreateNote()
    const createFromTemplateMutation = useCreateNoteFromTemplate()
    const updateMutation = useUpdateNote()
    const updateContentMutation = useUpdateNoteContent()
    const deleteMutation = useDeleteNote()
    const togglePinMutation = useToggleNotePin()
    const duplicateMutation = useDuplicateNote()
    const addTagMutation = useAddNoteTag()
    const removeTagMutation = useRemoveNoteTag()

    return {
        // Queries
        notes: notesQuery.data ?? [],
        pinnedNotes: pinnedQuery.data ?? [],
        stats: statsQuery.data,
        tags: tagsQuery.data ?? [],
        isLoading: notesQuery.isLoading,
        isError: notesQuery.isError,
        error: notesQuery.error,

        // Mutations
        create: (data: CreateNoteDto) => createMutation.mutateAsync(data),
        createFromTemplate: (templateId: string, title: string) =>
            createFromTemplateMutation.mutateAsync({ projectId, templateId, title }),
        update: (noteId: string, data: UpdateNoteDto) =>
            updateMutation.mutateAsync({ noteId, data }),
        updateContent: (noteId: string, content: string) =>
            updateContentMutation.mutateAsync({ noteId, content }),
        remove: (noteId: string) =>
            deleteMutation.mutateAsync({ noteId, projectId }),
        togglePin: (noteId: string) =>
            togglePinMutation.mutateAsync(noteId),
        duplicate: (noteId: string, newTitle?: string) =>
            duplicateMutation.mutateAsync({ noteId, newTitle }),
        addTag: (noteId: string, tag: string) =>
            addTagMutation.mutateAsync({ noteId, tag }),
        removeTag: (noteId: string, tag: string) =>
            removeTagMutation.mutateAsync({ noteId, tag }),

        // Mutation states
        isCreating: createMutation.isPending || createFromTemplateMutation.isPending,
        isUpdating: updateMutation.isPending,
        isSaving: updateContentMutation.isPending,
        isDeleting: deleteMutation.isPending,
    }
}
