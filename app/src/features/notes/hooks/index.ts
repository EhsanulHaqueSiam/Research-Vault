/**
 * Notes Hooks - Public API
 */

export {
    // Query keys
    noteKeys,
    // Query hooks
    useNotes,
    useNote,
    usePinnedNotes,
    useRecentNotes,
    useNoteStats,
    useNoteTags,
    useSearchNotes,
    // Mutation hooks
    useCreateNote,
    useCreateNoteFromTemplate,
    useUpdateNote,
    useUpdateNoteContent,
    useDeleteNote,
    useToggleNotePin,
    useDuplicateNote,
    useAddNoteTag,
    useRemoveNoteTag,
    // Combined hook
    useProjectNotes,
} from './useNotes'
