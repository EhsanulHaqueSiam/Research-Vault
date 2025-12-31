/**
 * Note Editor Component
 * 
 * Rich text editor using Tiptap with auto-save functionality
 */

import { useCallback, useEffect, useState, useMemo } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { EditorToolbar } from './EditorToolbar'
import { cn } from '@/shared/utils/cn'

// Create lowlight instance with common languages
const lowlight = createLowlight(common)

// ============================================
// Types
// ============================================

interface NoteEditorProps {
    /** Initial content (Tiptap JSON string or empty) */
    content: string
    /** Note title */
    title?: string
    /** Called when content changes (debounced) */
    onContentChange?: (content: string) => void
    /** Called when title changes */
    onTitleChange?: (title: string) => void
    /** Auto-save delay in ms (default: 3000) */
    autoSaveDelay?: number
    /** Whether the editor is read-only */
    readOnly?: boolean
    /** Whether saving is in progress */
    isSaving?: boolean
    /** Additional class names */
    className?: string
}

interface EditorStats {
    words: number
    characters: number
}

// ============================================
// Component
// ============================================

export function NoteEditor({
    content,
    title = '',
    onContentChange,
    onTitleChange,
    autoSaveDelay = 3000,
    readOnly = false,
    isSaving = false,
    className,
}: NoteEditorProps) {
    const [localTitle, setLocalTitle] = useState(title)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [stats, setStats] = useState<EditorStats>({ words: 0, characters: 0 })

    // Parse initial content
    const initialContent = useMemo(() => {
        if (!content) return undefined
        try {
            return JSON.parse(content)
        } catch {
            // If not valid JSON, treat as plain text
            return {
                type: 'doc',
                content: [{ type: 'paragraph', content: [{ type: 'text', text: content }] }]
            }
        }
    }, [content])

    // Initialize Tiptap editor
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Use CodeBlockLowlight instead
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline hover:text-blue-700 cursor-pointer',
                },
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full',
                },
            }),
            TableRow,
            TableHeader.configure({
                HTMLAttributes: {
                    class: 'bg-slate-100 dark:bg-slate-800 font-semibold text-left p-2 border border-slate-300 dark:border-slate-600',
                },
            }),
            TableCell.configure({
                HTMLAttributes: {
                    class: 'p-2 border border-slate-300 dark:border-slate-600',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                HTMLAttributes: {
                    class: 'bg-slate-900 text-slate-100 rounded-lg p-4 my-2 overflow-x-auto font-mono text-sm',
                },
            }),
        ],
        content: initialContent,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            setHasUnsavedChanges(true)
            // Update stats
            const text = editor.getText()
            setStats({
                words: text.trim() ? text.trim().split(/\s+/).length : 0,
                characters: text.length,
            })
        },
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-slate dark:prose-invert max-w-none',
                    'focus:outline-none min-h-[300px] p-4',
                    'prose-headings:font-semibold',
                    'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
                    'prose-p:leading-relaxed',
                    'prose-code:bg-slate-100 prose-code:dark:bg-slate-800',
                    'prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
                    'prose-pre:bg-transparent prose-pre:p-0',
                ),
            },
        },
    })

    // Get current content as JSON string
    const getCurrentContent = useCallback(() => {
        if (!editor) return ''
        return JSON.stringify(editor.getJSON())
    }, [editor])

    // Debounced content for auto-save
    const debouncedContent = useDebounce(
        hasUnsavedChanges ? getCurrentContent() : null,
        autoSaveDelay
    )

    // Auto-save effect
    useEffect(() => {
        if (debouncedContent && onContentChange && hasUnsavedChanges) {
            onContentChange(debouncedContent)
            setHasUnsavedChanges(false)
        }
    }, [debouncedContent, onContentChange, hasUnsavedChanges])

    // Title change handler
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setLocalTitle(newTitle)
        onTitleChange?.(newTitle)
    }, [onTitleChange])

    // Calculate stats on initial load
    useEffect(() => {
        if (editor) {
            const text = editor.getText()
            setStats({
                words: text.trim() ? text.trim().split(/\s+/).length : 0,
                characters: text.length,
            })
        }
    }, [editor])

    if (!editor) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-slate-400">Loading editor...</div>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Title Input */}
            <div className="border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                <input
                    type="text"
                    value={localTitle}
                    onChange={handleTitleChange}
                    placeholder="Untitled Note"
                    disabled={readOnly}
                    className={cn(
                        'w-full text-2xl font-semibold bg-transparent border-none outline-none',
                        'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                        'text-slate-900 dark:text-slate-100',
                        readOnly && 'cursor-default'
                    )}
                />
            </div>

            {/* Toolbar */}
            {!readOnly && (
                <EditorToolbar editor={editor} />
            )}

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900">
                <EditorContent editor={editor} />
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                    <span>{stats.words} words</span>
                    <span>{stats.characters} characters</span>
                </div>
                <div className="flex items-center gap-2">
                    {isSaving && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            Saving...
                        </span>
                    )}
                    {hasUnsavedChanges && !isSaving && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full" />
                            Unsaved changes
                        </span>
                    )}
                    {!hasUnsavedChanges && !isSaving && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full" />
                            Saved
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NoteEditor
