/**
 * Editor Toolbar Component
 * 
 * Formatting controls for the rich text editor
 */

import type { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    Link,
    Image,
    Table,
    Undo,
    Redo,
    Code2,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useCallback, useState } from 'react'

// ============================================
// Types
// ============================================

interface EditorToolbarProps {
    editor: Editor
    className?: string
}

interface ToolbarButtonProps {
    onClick: () => void
    isActive?: boolean
    disabled?: boolean
    title: string
    children: React.ReactNode
}

// ============================================
// Toolbar Button
// ============================================

function ToolbarButton({ onClick, isActive, disabled, title, children }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                'p-2 rounded-md transition-colors',
                'hover:bg-slate-100 dark:hover:bg-slate-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                isActive && 'bg-slate-200 dark:bg-slate-600 text-blue-600 dark:text-blue-400'
            )}
        >
            {children}
        </button>
    )
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-slate-200 dark:bg-slate-600 mx-1" />
}

// ============================================
// Component
// ============================================

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')

    // Text formatting
    const toggleBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor])
    const toggleItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor])
    const toggleStrike = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor])
    const toggleCode = useCallback(() => editor.chain().focus().toggleCode().run(), [editor])

    // Headings
    const setHeading = useCallback((level: 1 | 2 | 3) => {
        editor.chain().focus().toggleHeading({ level }).run()
    }, [editor])

    // Lists
    const toggleBulletList = useCallback(() => editor.chain().focus().toggleBulletList().run(), [editor])
    const toggleOrderedList = useCallback(() => editor.chain().focus().toggleOrderedList().run(), [editor])

    // Block elements
    const toggleBlockquote = useCallback(() => editor.chain().focus().toggleBlockquote().run(), [editor])
    const setHorizontalRule = useCallback(() => editor.chain().focus().setHorizontalRule().run(), [editor])
    const toggleCodeBlock = useCallback(() => editor.chain().focus().toggleCodeBlock().run(), [editor])

    // Link handling
    const addLink = useCallback(() => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setShowLinkInput(false)
        }
    }, [editor, linkUrl])

    const removeLink = useCallback(() => {
        editor.chain().focus().unsetLink().run()
    }, [editor])

    // Image handling
    const addImage = useCallback(() => {
        const url = prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    // Table handling
    const insertTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }, [editor])

    // Undo/Redo
    const undo = useCallback(() => editor.chain().focus().undo().run(), [editor])
    const redo = useCallback(() => editor.chain().focus().redo().run(), [editor])

    const iconSize = 18

    return (
        <div className={cn(
            'flex flex-wrap items-center gap-1 px-2 py-2',
            'border-b border-slate-200 dark:border-slate-700',
            'bg-slate-50 dark:bg-slate-800',
            className
        )}>
            {/* Undo/Redo */}
            <ToolbarButton onClick={undo} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
                <Undo size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={redo} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
                <Redo size={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Headings */}
            <ToolbarButton
                onClick={() => setHeading(1)}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => setHeading(2)}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => setHeading(3)}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
            >
                <Heading3 size={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Text formatting */}
            <ToolbarButton onClick={toggleBold} isActive={editor.isActive('bold')} title="Bold (Ctrl+B)">
                <Bold size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={toggleItalic} isActive={editor.isActive('italic')} title="Italic (Ctrl+I)">
                <Italic size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={toggleStrike} isActive={editor.isActive('strike')} title="Strikethrough">
                <Strikethrough size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={toggleCode} isActive={editor.isActive('code')} title="Inline Code">
                <Code size={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Lists */}
            <ToolbarButton onClick={toggleBulletList} isActive={editor.isActive('bulletList')} title="Bullet List">
                <List size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={toggleOrderedList} isActive={editor.isActive('orderedList')} title="Numbered List">
                <ListOrdered size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={toggleBlockquote} isActive={editor.isActive('blockquote')} title="Quote">
                <Quote size={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Block elements */}
            <ToolbarButton onClick={toggleCodeBlock} isActive={editor.isActive('codeBlock')} title="Code Block">
                <Code2 size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={setHorizontalRule} title="Horizontal Rule">
                <Minus size={iconSize} />
            </ToolbarButton>

            <ToolbarDivider />

            {/* Link */}
            {showLinkInput ? (
                <div className="flex items-center gap-1">
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://..."
                        className="px-2 py-1 text-sm border rounded bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 w-48"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') addLink()
                            if (e.key === 'Escape') setShowLinkInput(false)
                        }}
                        autoFocus
                    />
                    <button
                        onClick={addLink}
                        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => setShowLinkInput(false)}
                        className="px-2 py-1 text-sm bg-slate-200 dark:bg-slate-600 rounded hover:bg-slate-300 dark:hover:bg-slate-500"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <ToolbarButton
                    onClick={() => editor.isActive('link') ? removeLink() : setShowLinkInput(true)}
                    isActive={editor.isActive('link')}
                    title="Add/Remove Link"
                >
                    <Link size={iconSize} />
                </ToolbarButton>
            )}

            <ToolbarButton onClick={addImage} title="Insert Image">
                <Image size={iconSize} />
            </ToolbarButton>
            <ToolbarButton onClick={insertTable} title="Insert Table">
                <Table size={iconSize} />
            </ToolbarButton>
        </div>
    )
}

export default EditorToolbar
