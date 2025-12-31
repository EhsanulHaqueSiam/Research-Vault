/**
 * Notes List Component
 * 
 * Display and manage notes with search, filter, and sort
 */

import { useState, useMemo, useCallback } from 'react'
import {
    Search,
    LayoutGrid,
    List,
    Plus,
    SlidersHorizontal,
    Pin,
    Clock,
    FileText,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { NoteCard } from './NoteCard'
import type { Note } from '../types/note.types'

// ============================================
// Types
// ============================================

interface NotesListProps {
    notes: Note[]
    pinnedNotes?: Note[]
    tags?: string[]
    isLoading?: boolean
    onCreateNote?: () => void
    onEditNote?: (note: Note) => void
    onTogglePin?: (noteId: string) => void
    onDuplicate?: (noteId: string) => void
    onDelete?: (noteId: string) => void
    className?: string
}

type SortOption = 'updated' | 'created' | 'title'
type ViewMode = 'grid' | 'list'

// ============================================
// Component
// ============================================

export function NotesList({
    notes,
    pinnedNotes = [],
    tags = [],
    isLoading = false,
    onCreateNote,
    onEditNote,
    onTogglePin,
    onDuplicate,
    onDelete,
    className,
}: NotesListProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<SortOption>('updated')
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [showFilters, setShowFilters] = useState(false)

    // Filter and sort notes
    const filteredNotes = useMemo(() => {
        let result = notes.filter(note => !note.isPinned) // Exclude pinned (shown separately)

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(note =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query)
            )
        }

        // Tag filter
        if (selectedTags.length > 0) {
            result = result.filter(note =>
                note.tags?.some(tag => selectedTags.includes(tag))
            )
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'updated':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                case 'created':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case 'title':
                    return a.title.localeCompare(b.title)
                default:
                    return 0
            }
        })

        return result
    }, [notes, searchQuery, selectedTags, sortBy])

    const handleTagToggle = useCallback((tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }, [])

    const clearFilters = useCallback(() => {
        setSearchQuery('')
        setSelectedTags([])
        setSortBy('updated')
    }, [])

    const hasActiveFilters = searchQuery || selectedTags.length > 0 || sortBy !== 'updated'

    // Empty state
    if (!isLoading && notes.length === 0) {
        return (
            <div className={cn('flex flex-col items-center justify-center py-16', className)}>
                <FileText size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                    No notes yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-center">
                    Create your first note to get started
                </p>
                {onCreateNote && (
                    <button
                        onClick={onCreateNote}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg',
                            'bg-blue-600 text-white',
                            'hover:bg-blue-700 transition-colors'
                        )}
                    >
                        <Plus size={16} />
                        Create Note
                    </button>
                )}
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Notes
                </h2>
                {onCreateNote && (
                    <button
                        onClick={onCreateNote}
                        className={cn(
                            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                            'bg-blue-600 text-white',
                            'hover:bg-blue-700 transition-colors'
                        )}
                    >
                        <Plus size={14} />
                        New Note
                    </button>
                )}
            </div>

            {/* Search and Filters */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 space-y-3">
                {/* Search Bar */}
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className={cn(
                                'w-full pl-9 pr-3 py-2 rounded-lg text-sm',
                                'bg-slate-50 dark:bg-slate-800',
                                'border border-slate-200 dark:border-slate-700',
                                'focus:outline-none focus:ring-2 focus:ring-blue-500'
                            )}
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'p-2 rounded-lg',
                            'border border-slate-200 dark:border-slate-700',
                            showFilters && 'bg-blue-50 dark:bg-blue-900/20 border-blue-300'
                        )}
                    >
                        <SlidersHorizontal size={16} className={showFilters ? 'text-blue-600' : 'text-slate-400'} />
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-2',
                                viewMode === 'grid'
                                    ? 'bg-slate-100 dark:bg-slate-700'
                                    : 'bg-white dark:bg-slate-800'
                            )}
                        >
                            <LayoutGrid size={16} className="text-slate-600 dark:text-slate-400" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2',
                                viewMode === 'list'
                                    ? 'bg-slate-100 dark:bg-slate-700'
                                    : 'bg-white dark:bg-slate-800'
                            )}
                        >
                            <List size={16} className="text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                    <div className="space-y-3 pt-2">
                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                                className="text-sm px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            >
                                <option value="updated">Last Updated</option>
                                <option value="created">Date Created</option>
                                <option value="title">Title</option>
                            </select>
                        </div>

                        {/* Tag Filters */}
                        {tags.length > 0 && (
                            <div>
                                <span className="text-xs text-slate-500 block mb-2">Filter by tags:</span>
                                <div className="flex flex-wrap gap-1">
                                    {tags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={cn(
                                                'px-2 py-1 text-xs rounded-full transition-colors',
                                                selectedTags.includes(tag)
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                            )}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs text-blue-600 hover:text-blue-700"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Notes Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Pinned Notes Section */}
                        {pinnedNotes.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Pin size={14} className="text-amber-500" />
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                        Pinned
                                    </h3>
                                </div>
                                <div className={cn(
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
                                        : 'flex flex-col gap-2'
                                )}>
                                    {pinnedNotes.map(note => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            onEdit={onEditNote}
                                            onTogglePin={onTogglePin}
                                            onDuplicate={onDuplicate}
                                            onDelete={onDelete}
                                            isCompact={viewMode === 'list'}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Notes Section */}
                        {filteredNotes.length > 0 && (
                            <div>
                                {pinnedNotes.length > 0 && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock size={14} className="text-slate-400" />
                                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Recent
                                        </h3>
                                    </div>
                                )}
                                <div className={cn(
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
                                        : 'flex flex-col gap-2'
                                )}>
                                    {filteredNotes.map(note => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            onEdit={onEditNote}
                                            onTogglePin={onTogglePin}
                                            onDuplicate={onDuplicate}
                                            onDelete={onDelete}
                                            isCompact={viewMode === 'list'}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {filteredNotes.length === 0 && pinnedNotes.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-slate-500 dark:text-slate-400">
                                    No notes match your filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NotesList
