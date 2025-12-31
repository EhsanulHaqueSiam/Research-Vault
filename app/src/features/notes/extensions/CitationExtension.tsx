/**
 * Citation Extension for Tiptap
 * 
 * Academic reference linking with DOI, ISBN, URL support
 */

import { Node, mergeAttributes, type NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'

// ============================================
// Types
// ============================================

export interface CitationData {
    id: string
    type: 'doi' | 'isbn' | 'url' | 'manual'
    title: string
    authors?: string
    year?: string
    journal?: string
    doi?: string
    isbn?: string
    url?: string
}

// ============================================
// Citation Node View
// ============================================

function CitationNodeView({ node, updateAttributes, selected }: NodeViewProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(node.attrs.title as string || '')
    const [authors, setAuthors] = useState(node.attrs.authors as string || '')
    const [year, setYear] = useState(node.attrs.year as string || '')
    const [doi, setDoi] = useState(node.attrs.doi as string || '')
    const [url, setUrl] = useState(node.attrs.url as string || '')
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSave = useCallback(() => {
        updateAttributes({ title, authors, year, doi, url })
        setIsEditing(false)
    }, [title, authors, year, doi, url, updateAttributes])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSave()
        }
        if (e.key === 'Escape') {
            setIsEditing(false)
        }
    }, [handleSave])

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    const displayText = node.attrs.title
        ? `${node.attrs.authors ? node.attrs.authors + ' ' : ''}(${node.attrs.year || 'n.d.'}) ${node.attrs.title}`
        : 'Add citation'

    const citationUrl = node.attrs.doi
        ? `https://doi.org/${node.attrs.doi}`
        : node.attrs.url

    return (
        <NodeViewWrapper as="span" className="inline">
            {isEditing ? (
                <span className="inline-flex flex-col gap-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <input
                        ref={inputRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Title"
                        className="px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded"
                    />
                    <input
                        value={authors}
                        onChange={(e) => setAuthors(e.target.value)}
                        placeholder="Authors (e.g., Smith, J. & Doe, A.)"
                        className="px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded"
                    />
                    <div className="flex gap-2">
                        <input
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            placeholder="Year"
                            className="w-20 px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded"
                        />
                        <input
                            value={doi}
                            onChange={(e) => setDoi(e.target.value)}
                            placeholder="DOI"
                            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded"
                        />
                    </div>
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="URL (optional)"
                        className="px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </div>
                </span>
            ) : (
                <span
                    className={`citation inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 ${selected ? 'ring-2 ring-blue-500' : ''
                        }`}
                    onClick={() => setIsEditing(true)}
                >
                    <BookOpen size={12} />
                    <span className="text-sm">{displayText}</span>
                    {citationUrl && (
                        <a
                            href={citationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="ml-1 hover:text-amber-900 dark:hover:text-amber-100"
                        >
                            <ExternalLink size={12} />
                        </a>
                    )}
                </span>
            )}
        </NodeViewWrapper>
    )
}

// ============================================
// Citation Extension
// ============================================

export const CitationExtension = Node.create({
    name: 'citation',
    group: 'inline',
    inline: true,
    atom: true,

    addAttributes() {
        return {
            id: { default: () => crypto.randomUUID() },
            type: { default: 'manual' },
            title: { default: '' },
            authors: { default: '' },
            year: { default: '' },
            journal: { default: '' },
            doi: { default: '' },
            isbn: { default: '' },
            url: { default: '' },
        }
    },

    parseHTML() {
        return [{ tag: 'span[data-type="citation"]' }]
    },

    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
        return ['span', mergeAttributes({ 'data-type': 'citation' }, HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CitationNodeView)
    },
})

export default CitationExtension
