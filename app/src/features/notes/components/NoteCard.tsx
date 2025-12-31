/**
 * Note Card Component
 * 
 * Displays a preview of a note with actions
 */

import { formatDistanceToNow } from 'date-fns'
import {
    Pin,
    MoreVertical,
    Edit,
    Copy,
    Trash2,
    FileText,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useState, useCallback } from 'react'
import type { Note } from '../types/note.types'

// ============================================
// Types
// ============================================

interface NoteCardProps {
    note: Note
    onEdit?: (note: Note) => void
    onTogglePin?: (noteId: string) => void
    onDuplicate?: (noteId: string) => void
    onDelete?: (noteId: string) => void
    isCompact?: boolean
    className?: string
}

// ============================================
// Helpers
// ============================================

function stripHtmlAndTruncate(content: string, maxLength: number = 100): string {
    try {
        const parsed = JSON.parse(content)
        // Extract text from Tiptap JSON
        const extractText = (node: any): string => {
            if (node.text) return node.text
            if (node.content) return node.content.map(extractText).join(' ')
            return ''
        }
        const text = extractText(parsed).trim()
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    } catch {
        // If not JSON, treat as plain text
        return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
    }
}

// ============================================
// Component
// ============================================

export function NoteCard({
    note,
    onEdit,
    onTogglePin,
    onDuplicate,
    onDelete,
    isCompact = false,
    className,
}: NoteCardProps) {
    const [showMenu, setShowMenu] = useState(false)

    const handleEdit = useCallback(() => {
        onEdit?.(note)
        setShowMenu(false)
    }, [note, onEdit])

    const handleTogglePin = useCallback(() => {
        onTogglePin?.(note.id)
        setShowMenu(false)
    }, [note.id, onTogglePin])

    const handleDuplicate = useCallback(() => {
        onDuplicate?.(note.id)
        setShowMenu(false)
    }, [note.id, onDuplicate])

    const handleDelete = useCallback(() => {
        if (confirm('Are you sure you want to delete this note?')) {
            onDelete?.(note.id)
        }
        setShowMenu(false)
    }, [note.id, onDelete])

    const contentPreview = stripHtmlAndTruncate(note.content)
    const updatedAt = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })

    return (
        <div
            className={cn(
                'group relative p-4 rounded-lg border cursor-pointer',
                'bg-white dark:bg-slate-800',
                'border-slate-200 dark:border-slate-700',
                'hover:border-slate-300 dark:hover:border-slate-600',
                'hover:shadow-md transition-all duration-200',
                isCompact ? 'p-3' : 'p-4',
                className
            )}
            onClick={handleEdit}
        >
            {/* Pin Indicator */}
            {note.isPinned && (
                <div className="absolute top-2 right-2">
                    <Pin
                        size={14}
                        className="text-amber-500 fill-amber-500"
                    />
                </div>
            )}

            {/* Title */}
            <div className="flex items-start gap-2 mb-2">
                <FileText size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <h3 className={cn(
                    'font-medium text-slate-900 dark:text-slate-100 line-clamp-1',
                    isCompact ? 'text-sm' : 'text-base'
                )}>
                    {note.title || 'Untitled Note'}
                </h3>
            </div>

            {/* Content Preview */}
            {!isCompact && contentPreview && (
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 ml-6">
                    {contentPreview}
                </p>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3 ml-6">
                    {note.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        >
                            {tag}
                        </span>
                    ))}
                    {note.tags.length > 3 && (
                        <span className="text-xs text-slate-400">
                            +{note.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between ml-6">
                <span className="text-xs text-slate-400">
                    {updatedAt}
                </span>

                {/* Actions Menu */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowMenu(!showMenu)
                        }}
                        className={cn(
                            'p-1 rounded opacity-0 group-hover:opacity-100',
                            'hover:bg-slate-100 dark:hover:bg-slate-700',
                            'transition-opacity'
                        )}
                    >
                        <MoreVertical size={16} className="text-slate-400" />
                    </button>

                    {showMenu && (
                        <>
                            {/* Backdrop */}
                            <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowMenu(false)
                                }}
                            />

                            {/* Menu */}
                            <div
                                className={cn(
                                    'absolute right-0 bottom-full mb-1 z-20',
                                    'bg-white dark:bg-slate-800',
                                    'border border-slate-200 dark:border-slate-700',
                                    'rounded-lg shadow-lg py-1 min-w-[140px]'
                                )}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEdit()
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Edit size={14} /> Edit
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleTogglePin()
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Pin size={14} /> {note.isPinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDuplicate()
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <Copy size={14} /> Duplicate
                                </button>
                                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDelete()
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NoteCard
