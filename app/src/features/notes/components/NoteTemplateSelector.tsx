/**
 * Note Template Selector Component
 * 
 * Dialog for selecting a template when creating a new note
 */

import { useState, useCallback } from 'react'
import { FileText, BookOpen, Users, Check } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { NoteTemplate } from '../types/note.types'
import { builtInNoteTemplates } from '../types/note.types'

// ============================================
// Types
// ============================================

interface NoteTemplateSelectorProps {
    onSelect: (templateId: string, title: string) => void
    onCancel: () => void
    className?: string
}

// ============================================
// Template Icons
// ============================================

const templateIcons: Record<string, React.ReactNode> = {
    'blank': <FileText size={24} className="text-slate-400" />,
    'meeting': <Users size={24} className="text-blue-500" />,
    'literature-review': <BookOpen size={24} className="text-purple-500" />,
}

// ============================================
// Component
// ============================================

export function NoteTemplateSelector({
    onSelect,
    onCancel,
    className,
}: NoteTemplateSelectorProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string>('blank')
    const [noteTitle, setNoteTitle] = useState('')

    const handleCreate = useCallback(() => {
        const title = noteTitle.trim() || 'Untitled Note'
        onSelect(selectedTemplate, title)
    }, [selectedTemplate, noteTitle, onSelect])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleCreate()
        }
        if (e.key === 'Escape') {
            onCancel()
        }
    }, [handleCreate, onCancel])

    return (
        <div className={cn('flex flex-col', className)}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Create New Note
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Choose a template to get started
                </p>
            </div>

            {/* Title Input */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Note Title
                </label>
                <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter note title..."
                    className={cn(
                        'w-full px-3 py-2 rounded-lg text-sm',
                        'bg-white dark:bg-slate-800',
                        'border border-slate-200 dark:border-slate-700',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500'
                    )}
                    autoFocus
                />
            </div>

            {/* Templates Grid */}
            <div className="p-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Select Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {builtInNoteTemplates.map((template: NoteTemplate) => (
                        <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                                'relative p-4 rounded-lg border text-left transition-all',
                                'hover:border-blue-300 dark:hover:border-blue-700',
                                selectedTemplate === template.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                            )}
                        >
                            {/* Selected Check */}
                            {selectedTemplate === template.id && (
                                <div className="absolute top-2 right-2">
                                    <Check size={16} className="text-blue-600" />
                                </div>
                            )}

                            {/* Icon */}
                            <div className="mb-3">
                                {templateIcons[template.id] || <FileText size={24} className="text-slate-400" />}
                            </div>

                            {/* Template Info */}
                            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                                {template.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {template.description}
                            </p>

                            {/* Tags */}
                            {template.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {template.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-500"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
                <button
                    onClick={onCancel}
                    className={cn(
                        'px-4 py-2 rounded-lg text-sm',
                        'border border-slate-200 dark:border-slate-700',
                        'text-slate-700 dark:text-slate-300',
                        'hover:bg-slate-50 dark:hover:bg-slate-700',
                        'transition-colors'
                    )}
                >
                    Cancel
                </button>
                <button
                    onClick={handleCreate}
                    className={cn(
                        'px-4 py-2 rounded-lg text-sm',
                        'bg-blue-600 text-white',
                        'hover:bg-blue-700',
                        'transition-colors'
                    )}
                >
                    Create Note
                </button>
            </div>
        </div>
    )
}

export default NoteTemplateSelector
